import { getDb } from "../config/database.js";
import { initializeSchema } from "../database/schema.js";
import { seedDemoData } from "../database/seed.js";

const db = getDb();
initializeSchema(db);
seedDemoData(db);
console.log("Demo data seeded.");
