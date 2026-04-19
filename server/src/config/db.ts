import { Pool, Client } from "pg";
import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Debug env
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASSWORD);

// Pool (dipakai app)
const pool = new Pool({
  user: process.env.DB_USER || "myuser",
  password: process.env.DB_PASSWORD || "mypassword",
  host: "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "mydb",
});

// FUNCTION ASLI
export const connectDB = async (): Promise<void> => {
  const client = await pool.connect();
  console.log("✅ Connected to PostgreSQL (POOL)");
  client.release();
};

// TEST KONEKSI LANGSUNG (INI YANG KITA CEK)
const testConnection = async () => {
  const client = new Client({
    user: "myuser",
    password: "mypassword",
    host: "127.0.0.1",
    port: 5433,
    database: "mydb",
  });

  try {
    await client.connect();
    console.log("TEST CONNECT SUCCESS");
    await client.end();
  } catch (err) {
    console.error("TEST CONNECT FAIL:", err);
  }
};

// PANGGIL TEST
testConnection();

export default pool;