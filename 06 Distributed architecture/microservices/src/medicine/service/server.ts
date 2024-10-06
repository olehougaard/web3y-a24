import express, { Response } from 'express'
import bodyParser from 'body-parser'
import { connectionString, injectMongo } from '../../db/inject-mongo.js'
import { PrescriptionSystem, prescriptionSystem } from '../prescriptions.js'
import * as amqp from 'amqplib'
import { Diagnosis } from '../../journal/patients.js'
import { MongoClient } from 'mongodb'

async function startServer() {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange('diagnoses', 'fanout', {durable: false})

    const queue = await channel.assertQueue('', {exclusive: true})
    await channel.bindQueue(queue.queue, 'diagnoses', '')

    channel.consume(queue.queue, async msg => {
        let diagnosis: Diagnosis = JSON.parse(msg.content.toString())
        const client = new MongoClient(connectionString);
        await client.connect()
        const db = client.db('test')
        db.collection('medicine.diagnoses').updateOne({
            cpr: diagnosis.cpr
        }, {
            $push: {diagnoses: diagnosis.diagnose}
        }, {
            upsert: true
        })
    })

    const medicineServer = express()
    
    medicineServer.use((_, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
        next();
    });
    
    medicineServer.use(bodyParser.json())
    
    medicineServer.use(injectMongo('test', 'system', prescriptionSystem))
    
    function localSystem(res: Response): PrescriptionSystem {
        return res.locals.system
    }    
    
    // /prescriptions?cpr=XXXXXXXXXX
    medicineServer.get('/prescriptions', async (req, res) => {
        const cpr = req.query.cpr?.toString()
        if (cpr)
            res.send(await localSystem(res).prescriptions(cpr))
        else
            res.status(403).send()
    })
    
    medicineServer.post('/prescriptions', async (req, res) => {
        try {
            const pres = await localSystem(res).prescribe(req.body.cpr, req.body);
            res.status(201).send(pres)
        } catch (e) {
            console.trace(e)
            res.status(409).send()
        }
    })
    
    medicineServer.get('/drugs', async (_, res) => {
        res.send(await localSystem(res).drugs())
    })

    medicineServer.listen(8889, () => console.log(`Server started on 8889`))
}

startServer()
