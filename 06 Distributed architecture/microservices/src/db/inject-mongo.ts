import { Db, MongoClient } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
 
export const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

export function injectMongo<T>(dbName: string, propertyName: string, creator: (db: Db) => T) {
    return async (_: Request, res: Response, next: NextFunction) => {
        const client = new MongoClient(connectionString);
        await client.connect()
        const db = client.db(dbName);
        res.locals[propertyName] = creator(db)
        res.on('close', () => client.close())
        next()
    }
}
