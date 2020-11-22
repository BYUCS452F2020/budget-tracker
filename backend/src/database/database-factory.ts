import { Database } from './database';
import { MongoDatabase } from './mongo/MongoDatabase';

export class DatabaseFactory {
    static getDatabase(): Database {
        return MongoDatabase.instance();
    }
}
