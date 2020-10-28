import { Database } from './database';
import { PgDatabase } from './postgres/PostgresDatabase';

export class DatabaseFactory {
  static getDatabase(): Database {
    return PgDatabase.instance();
  }
}
