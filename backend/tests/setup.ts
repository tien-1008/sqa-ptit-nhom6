import path from "node:path";

process.env.NODE_ENV = "test";
process.env.PORT = "4100";
process.env.JWT_SECRET = "test-secret-for-sqa";
process.env.DB_PATH = path.resolve(process.cwd(), "data", "test.sqlite");
