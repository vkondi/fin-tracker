import { Pool } from "pg";
import { migrate } from "./migration";

// Strip sslmode from the connection string so pg-connection-string does not
// trigger the deprecation warning. SSL behaviour is controlled explicitly below.
const connectionString = process.env.DATABASE_URL?.replace(
  /([?&])sslmode=[^&]*(&?)/g,
  (_, prefix, suffix) => (suffix ? prefix : "")
);

const dbConfig = {
  connectionString,
  ssl: { rejectUnauthorized: false }, // Required for Neon serverless environments
};

// Create a connection pool
const pool = new Pool(dbConfig);

pool.on("connect", () => {
  console.log("Connected to Neon (PostgreSQL) database!");
});

// Global flag to ensure migration runs only once
let isInitialized = false;

export const initDatabase = async () => {
  if (!isInitialized) {
    console.log("⚡Running database migrations...");
    await migrate();
    isInitialized = true;
    console.log("✅ Database migrations complete.");
  }
};

initDatabase(); // Run when server starts

export { pool };
