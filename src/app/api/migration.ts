import { SYS_USERS_TABLE } from "@/utils/constants";
import { pool } from "./database";

const createTable = async ({
  name,
  query,
}: {
  name: string;
  query: string;
}) => {
  try {
    await pool.query(query);
    console.log(`✅ ${name} table created successfully!`);
  } catch (error) {
    console.error(`❌ Failed to create table ${name}: `, error);
  }
};

// Main migration method
export const migrate = async () => {
  try {
    const tables = [
      {
        name: SYS_USERS_TABLE,
        query: `CREATE TABLE IF NOT EXISTS ${SYS_USERS_TABLE} (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name TEXT NOT NULL
        );`,
      },
    ];

    // Create Database tables
    await Promise.all(tables.map(createTable));
    console.log("✅ Tables created successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error);
  }
};
