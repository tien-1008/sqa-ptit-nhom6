import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "local-demo-secret-change-me",
  dbPath: process.env.DB_PATH
    ? path.resolve(process.cwd(), process.env.DB_PATH)
    : path.resolve(process.cwd(), "data", "sqa-ecommerce.sqlite"),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173"
};
