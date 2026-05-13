import { app } from "./app.js";
import { getDb } from "./config/database.js";
import { env } from "./config/env.js";
import { initializeSchema } from "./database/schema.js";

initializeSchema(getDb());

app.listen(env.port, () => {
  console.log(`Backend server listening on http://localhost:${env.port}`);
});
