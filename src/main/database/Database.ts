import path from 'path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { configManager } from '../config/configManager';
import * as schema from './schemas';

const dbPath = '';
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export function initDB() {
    sqlite.exec(`CREATE TABLE IF NOT EXISTS nutrition_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        energy_per_unit REAL NOT NULL,
        is_completed INTEGER NOT NULL DEFAULT 0,
        completion_date TEXT,
        creation_date TEXT NOT NULL,
        notes TEXT
    );`);
}
