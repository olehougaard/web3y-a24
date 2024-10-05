import {MongoClient} from 'mongodb'

const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

async function createTestData() {
    const mongo = new MongoClient(connectionString)
    try {
        const client = await mongo.connect()
        const db = client.db('test')
        
        await db.collection('medicine.drugs').insertMany([
            {
                drug_id: 12345,
                name: 'Panodil',
                drug: 'Paracetamol',
                dose: { amount: 1000, unit: 'mg' },
                indications: ['Headache', 'Fever'],
            },
            {
                drug_id: 34522,
                name: 'Ipren',
                drug: 'Ibuprofen',
                dose: { amount: 200, unit: 'mg' },
                indications: ['Inflammation', 'Muscle pain']
            }
        ])

        await db.collection('medicine.diagnoses').insertOne({
            cpr: '2112568901',
            diagnoses: ['Headache', 'Inflammation']
        })

        await db.collection('medicine.prescriptions').insertOne({
            cpr: '2112568901',
            drug_id: 12345,
            dosage: {
                period: 'daily',
                administrations: 3,
                units: 2
            }
        })

        await db.collection('journal.patients').insertOne({
            cpr: '2112568901',
            name: '',
            address: '',
            birthdate: ''
        })

        await db.collection('journal.diagnoses').insertMany([
            {
                cpr: '2112568901',
                diagnose: 'Headache',
                diagnosedOn: '',
                diagnosedBy: ''
            },
            {
                cpr: '2112568901',
                diagnose: 'Inflammation',
                diagnosedOn: '',
                diagnosedBy: ''
        }])
    } catch (e) {
        console.trace(e)
    } finally {
        mongo.close()
    }
}

createTestData()
