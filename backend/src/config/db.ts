// Postgre sql configuration

import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DB_URL
})

pool.on("connect", () => {
    console.log("Connected to PostgreSQL");
})

pool.on("error", (err) => {
    console.log("Enexpected error on idle client", err);
    process.exit(-1);
})