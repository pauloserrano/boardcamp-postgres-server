import pkg from "pg";
import dotenv from "dotenv"
dotenv.config()

const { DATABASE_URL } = process.env

const { Pool } = pkg
const connection = new Pool({
    connectionString: DATABASE_URL,
});


export default connection