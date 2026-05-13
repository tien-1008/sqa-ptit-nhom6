import { getDb } from "../config/database.js";
import { initializeSchema } from "../database/schema.js";

initializeSchema(getDb());
console.log("Database schema initialized.");
