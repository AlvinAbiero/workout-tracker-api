import { Pool } from "pg";
import config from "./config";

const pool = new Pool({
  host: config.DB_HOST,
  port: parseInt(config.DB_PORT || "5432"),
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
