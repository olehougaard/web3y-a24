import { Db, Document, FindCursor } from 'mongodb';

export type Diagnoses = {
    cpr: string,
    diagnose: string[]
}

export type Drug = {
    drug_id: number,
    name: string,
    drug: string,
    dose: {
        amount: number,
        unit: 'mg' | 'ml' | 'pcs'
    },
    indications: string[]
}

export type Prescription = {
    cpr: string,
    drug_id: number,
    dosage: {
        period: 'hourly' | 'daily' | 'weekly',
        administrations: number,
        units: number
    }
}

export type Patient = {
    cpr: string,
    name: string,
    address: string,
    birthdate: string
}

export interface PrescriptionSystem {
    prescriptions(cpr: string): Promise<Partial<Prescription>[]>
    prescribe(cpr: string, prescription: Prescription): Promise<Prescription>
    drugs(): Promise<Partial<Drug>[]>
};

export function prescriptionSystem(db: Db): PrescriptionSystem {
    return {
        async prescriptions(cpr: string) {
            const prescriptionsForPatient: FindCursor<Document> = db.collection('medicine.prescriptions').find({ cpr })
            return prescriptionsForPatient.toArray()
        },
        async prescribe(cpr: string, prescription: Prescription) {
            const patientDiagnoses: string[] = await db.collection('medicine.diagnoses').findOne({cpr}).then(p => p?.diagnoses)
            const eligibleDrug = await db.collection('medicine.drugs').findOne({drug_id: prescription.drug_id, indications: {$in: patientDiagnoses}})
            if (!eligibleDrug) throw new Error('Drug is not indicated')
            const fullPrescription = { ...prescription, cpr };
            await db.collection('medicine.prescriptions').insertOne(fullPrescription)
            return fullPrescription
        },
        async drugs() {
            const patients: FindCursor<Document> = db.collection('journal.patients').find();
            return patients.toArray()
        }
    }
}
