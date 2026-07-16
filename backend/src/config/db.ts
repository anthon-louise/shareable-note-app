// postgre sql configuration
import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

// pool of database connections
export const pool = new Pool({
    connectionString: process.env.DB_URL
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