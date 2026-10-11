import { FINANCES_TABLE, FINANCIAL_SNAPSHOTS_TABLE, SYS_USERS_TABLE } from "@/utils/constants";
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
      {
        name: FINANCES_TABLE,
        query: `CREATE TABLE IF NOT EXISTS ${FINANCES_TABLE} (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(255) NOT NULL,
      platform_type VARCHAR(255) NOT NULL,
      platform_category VARCHAR(255) NOT NULL,
      amount_invested NUMERIC NOT NULL,
      amount_current NUMERIC NOT NULL,
      updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      owner VARCHAR(255) NOT NULL,
      user_id INTEGER NOT NULL,
      CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES ${SYS_USERS_TABLE}(id)
        ON DELETE CASCADE
    );
    
    CREATE OR REPLACE FUNCTION update_updated_date()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_date = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE OR REPLACE TRIGGER update_finances_updated_date
    BEFORE UPDATE ON ${FINANCES_TABLE}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_date();`,
      },
      {
        name: FINANCIAL_SNAPSHOTS_TABLE,
        query: `CREATE TABLE IF NOT EXISTS ${FINANCIAL_SNAPSHOTS_TABLE} (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      snapshot_date DATE NOT NULL,
      total_invested NUMERIC NOT NULL DEFAULT 0,
      total_current NUMERIC NOT NULL DEFAULT 0,
      total_platforms INTEGER NOT NULL DEFAULT 0,
      total_owners INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_snapshot_user
        FOREIGN KEY(user_id)
        REFERENCES ${SYS_USERS_TABLE}(id)
        ON DELETE CASCADE,
      CONSTRAINT uq_user_snapshot_date
        UNIQUE(user_id, snapshot_date)
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
