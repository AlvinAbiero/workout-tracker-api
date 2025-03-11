"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("./config"));
const pool = new pg_1.Pool({
    host: config_1.default.DB_HOST,
    port: parseInt(config_1.default.DB_PORT || "5432"),
    user: config_1.default.DB_USER,
    password: config_1.default.DB_PASSWORD,
    database: config_1.default.DB_NAME,
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
exports.default = pool;
