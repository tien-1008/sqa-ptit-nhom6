import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { env } from "./env.js";

let database: Database.Database | undefined;

export function getDb(): Database.Database {
  if (!database) {
    if (env.dbPath !== ":memory:") {
      fs.mkdirSync(path.dirname(env.dbPath), { recursive: true });
    }

    database = new Database(env.dbPath);
    database.pragma("foreign_keys = ON");
  }

  return database;
}

export function closeDb(): void {
  database?.close();
  database = undefined;
}
