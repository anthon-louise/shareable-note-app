// postgre sql configuration
import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

// pool of database connections
export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || "postgres",
    password: process.env.password || "8080",
    database: process.env.DB_NAME || "shareable-notes",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

// logs when a connection is established
pool.on("connect", () => {
    console.log("Connected to PostgreSQL");
})

// logs when error then shut downs the database
pool.on("error", (err) => {
    console.log("Enexpected error on idle client", err);
    process.exit(-1);
})