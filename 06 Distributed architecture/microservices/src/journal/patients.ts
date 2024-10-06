import { Db, Document, FindCursor } from 'mongodb';

export type Diagnosis = {
    cpr: string;
    diagnose: string;
    diagnosedOn: string;
    diagnosedBy: string;
};

export type Patient = {
    cpr: string,
    name: string,
    address: string,
    birthdate: string
}

export interface PatientSystem {
    diagnoses(cpr: string): Promise<Partial<Diagnosis>[]>
    diagnose(cpr: string, diagnosis: Diagnosis): Promise<Diagnosis>
    patients(): Promise<Partial<Patient>[]>
    patient(cpr: string): Promise<Partial<Patient> | null>
};

export function patientSystem(db: Db): PatientSystem {
    return {
        async diagnoses(cpr: string) {
            const diagnosesForPatient: FindCursor<Document> = db.collection('journal.diagnoses').find({ cpr })
            return diagnosesForPatient.toArray()
        },
        async diagnose(cpr: string, diagnosis: Diagnosis) {
            const fullDiagnosis = { ...diagnosis, cpr };
            await db.collection('journal.diagnoses').insertOne(fullDiagnosis)
            return fullDiagnosis
        },
        async patients() {
            const patients: FindCursor<Document> = db.collection('journal.patients').find();
            return patients.toArray()
        },
        async patient(cpr: string) {
            const patient: Document | null = await db.collection('journal.patients').findOne({cpr})
            return patient
        }
    }
}
