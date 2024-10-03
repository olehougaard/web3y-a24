import express from 'express'
import bodyParser from 'body-parser'
import { Db, Document, FindCursor, MongoClient, WithId } from 'mongodb';

const medicineServer = express()

medicineServer.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
    next();
});

medicineServer.use(bodyParser.json())

const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

function dbQuery(query: (db: Db) => FindCursor<WithId<Document>>): Promise<WithId<Document>[]> {
    const client = new MongoClient(connectionString)
    try {
        const db = client.db('test')
        const prescriptionsForPatient = query(db)
        return prescriptionsForPatient.toArray()
    } finally {
        client.close()
    }
}

// /prescriptions?cpr=XXXXXXXXXX
medicineServer.get('/prescriptions', async (req, res) => {
    const cpr = req.query.cpr?.toString()
    if (!cpr) {
        res.status(403).send()
        return
    }
    const prescriptionsForPatient = dbQuery(db => db.collection('medicine.prescriptions').find({ cpr }))
    res.send(await prescriptionsForPatient)
})
