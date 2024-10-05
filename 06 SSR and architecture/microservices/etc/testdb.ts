import {MongoClient} from 'mongodb'

const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

async function createTestData() {
    const mongo = new MongoClient(connectionString)
    try {
        const client = await mongo.connect()
        const db = client.db('test')

        const collections = ['medicine.drugs', 'medicine.diagnoses', 'medicine.prescriptions', 'journal.patients', 'journal.diagnoses']
        collections.forEach(c => db.collection(c).deleteMany())
        
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

        await db.collection('journal.patients').insertOne({
            cpr: '2112568901',
            name: '',
            address: '',
            birthdate: ''
        })

        await db.collection('journal.diagnoses').insertOne({
            cpr: '2112568901',
            diagnose: 'Headache',
            diagnosedOn: '',
            diagnosedBy: ''
        })
    } catch (e) {
        console.trace(e)
    } finally {
        mongo.close()
    }
}

createTestData()
