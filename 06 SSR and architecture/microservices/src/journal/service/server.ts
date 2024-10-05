import express, { Response } from 'express'
import bodyParser from 'body-parser'
import { injectMongo } from '../../db/inject-mongo.js'
import { Diagnosis, PatientSystem, patientSystem } from '../patients.js';
import { Db, MongoClient } from 'mongodb';
import * as amqp from 'amqplib'

const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

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
        db['medicine.diagnoses'].updateOne({
            cpr: diagnosis.cpr
        }, {
            $push: {diagnoses: diagnosis}
        }, {
            upsert: true
        })
    })

    const journalServer = express()
    
    journalServer.use((_, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
        next();
    });
    
    journalServer.use(bodyParser.json())
    
    journalServer.use(injectMongo('test', 'patients', patientSystem))
    
    function localPatients(res: Response): PatientSystem {
        return res.locals.patients
    }    
    
    journalServer.get('/patients', async (_, res) => {
        res.send(await localPatients(res).patients())
    })
    
    journalServer.get('/patients/:cpr', async (req, res) => {
        res.send(await localPatients(res).patient(req.params.cpr))
    })
    
    journalServer.post('/patients/:cpr/diagnoses', async (req, res) => {
        const diagnoses = await localPatients(res).diagnose(req.params.cpr, req.body);
        res.status(201).send(diagnoses)
    })
    
    journalServer.get('/patients/:cpr/diagnoses', async (req, res) => {
        res.send(await localPatients(res).diagnoses(req.params.cpr))
    })
    
    const port = 8888
    
    journalServer.listen(port, () => console.log(`Journal Server listening on port ${port}.`))
}

startServer()