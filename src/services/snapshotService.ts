import { pool } from "@/app/api/database";
import {
  FINANCES_TABLE,
  FINANCIAL_SNAPSHOTS_TABLE,
  SYS_USERS_TABLE,
} from "@/utils/constants";
import { Pool } from "pg";

export interface SnapshotRecord {
  id?: number;
  user_id: number;
  snapshot_date: string;
  total_invested: number | string;
  total_current: number | string;
  total_platforms: number;
  total_owners: number;
  created_at?: string;
}

/**
 * Retrieves authorized user IDs from environment variable AUTHORIZED_SNAPSHOT_USER_IDS.
 * If not configured in environment variables, returns an empty list (restricted by default).
 */
export const getAuthorizedSnapshotUserIds = (): string[] => {
  const envVal = process.env.AUTHORIZED_SNAPSHOT_USER_IDS;
  if (!envVal) return [];
  return envVal
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
};

/**
 * Retrieves authorized emails from environment variable AUTHORIZED_SNAPSHOT_EMAILS.
 */
export const getAuthorizedSnapshotEmails = (): string[] => {
  const envVal = process.env.AUTHORIZED_SNAPSHOT_EMAILS;
  if (!envVal) return [];
  return envVal
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

/**
 * Synchronously checks whether a given userId or email is authorized to manually trigger snapshots.
 */
export const isAuthorizedForSnapshot = (
  userId?: number | string | null,
  email?: string | null
): boolean => {
  if (userId && getAuthorizedSnapshotUserIds().includes(String(userId))) {
    return true;
  }
  if (
    email &&
    getAuthorizedSnapshotEmails().includes(String(email).trim().toLowerCase())
  ) {
    return true;
  }
  return false;
};

/**
 * Async authorization check that validates userId and email against environment variables,
 * falling back to a database lookup on SYS_USERS if only userId is provided.
 */
export const isUserAuthorizedForSnapshot = async (
  userId?: number | string | null,
  email?: string | null,
  db: Pool = pool
): Promise<boolean> => {
  if (isAuthorizedForSnapshot(userId, email)) {
    return true;
  }

  if (userId) {
    try {
      const { rows } = await db.query(
        `SELECT email FROM ${SYS_USERS_TABLE} WHERE id = $1 LIMIT 1;`,
        [userId]
      );
      if (rows.length > 0 && rows[0].email) {
        const userEmail = String(rows[0].email).trim().toLowerCase();
        if (getAuthorizedSnapshotEmails().includes(userEmail)) {
          return true;
        }
      }
    } catch (err) {
      console.error(
        "[isUserAuthorizedForSnapshot] Failed to query user email:",
        err
      );
    }
  }

  return false;
};

/**
 * Normalize date to the 1st of the month in YYYY-MM-DD format
 */
export const formatSnapshotDate = (date?: Date | string): string => {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

/**
 * Creates or updates a financial snapshot for a specific user
 * (Single Source of Truth invoked by both API and cron/scripts)
 */
export const createSnapshotForUser = async (
  userId: number | string,
  snapshotDate?: Date | string,
  db: Pool = pool
): Promise<{ success: boolean; data?: SnapshotRecord; error?: string }> => {
  const snapshotDateStr = formatSnapshotDate(snapshotDate);

  // 1. Aggregate current finances for user
  const { rows: aggregation } = await db.query(
    `SELECT
      COALESCE(SUM(amount_invested), 0) AS total_invested,
      COALESCE(SUM(amount_current), 0) AS total_current,
      COUNT(DISTINCT platform) AS total_platforms,
      COUNT(DISTINCT owner) AS total_owners
    FROM ${FINANCES_TABLE}
    WHERE user_id = $1`,
    [userId]
  );

  const agg = aggregation[0];

  if (
    parseFloat(agg.total_invested) === 0 &&
    parseFloat(agg.total_current) === 0
  ) {
    return {
      success: false,
      error: "No finance data found for user",
    };
  }

  // 2. Upsert snapshot into database
  const { rows: inserted } = await db.query(
    `INSERT INTO ${FINANCIAL_SNAPSHOTS_TABLE} (
      user_id,
      snapshot_date,
      total_invested,
      total_current,
      total_platforms,
      total_owners
    ) VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id, snapshot_date)
    DO UPDATE SET
      total_invested = EXCLUDED.total_invested,
      total_current = EXCLUDED.total_current,
      total_platforms = EXCLUDED.total_platforms,
      total_owners = EXCLUDED.total_owners
    RETURNING *;`,
    [
      userId,
      snapshotDateStr,
      agg.total_invested,
      agg.total_current,
      parseInt(agg.total_platforms),
      parseInt(agg.total_owners),
    ]
  );

  return {
    success: true,
    data: inserted[0],
  };
};

/**
 * Creates snapshots for all users who have finance records
 * (Invoked by background cron job)
 */
export const createSnapshotsForAllUsers = async (
  snapshotDate?: Date | string,
  db: Pool = pool
): Promise<{ snapshotsCreated: number; snapshotDate: string }> => {
  const snapshotDateStr = formatSnapshotDate(snapshotDate);

  const { rows: users } = await db.query(
    `SELECT id FROM ${SYS_USERS_TABLE}`
  );

  let snapshotsCreated = 0;

  for (const user of users) {
    const res = await createSnapshotForUser(user.id, snapshotDateStr, db);
    if (res.success) {
      snapshotsCreated++;
    }
  }

  return {
    snapshotsCreated,
    snapshotDate: snapshotDateStr,
  };
};

/**
 * Queries snapshots for a user, optionally filtered by year
 */
export const getSnapshotsForUser = async (
  userId: number | string,
  year?: string | number,
  db: Pool = pool
): Promise<SnapshotRecord[]> => {
  let queryText = `
    SELECT
      snapshot_date,
      total_invested,
      total_current,
      total_platforms,
      total_owners,
      created_at
    FROM
      ${FINANCIAL_SNAPSHOTS_TABLE}
    WHERE
      user_id = $1
  `;
  const queryParams: (number | string)[] = [userId];

  if (year && String(year).toLowerCase() !== "all") {
    queryText += ` AND EXTRACT(YEAR FROM snapshot_date) = $2`;
    queryParams.push(Number(year));
  }

  queryText += ` ORDER BY snapshot_date ASC;`;

  const { rows } = await db.query(queryText, queryParams);
  return rows;
};

/**
 * Seeds realistic, intelligently mocked historical snapshots for a user
 * covering Jan 2025 through Oct 2026 (22 monthly snapshots)
 */
export const seedMockHistoricalSnapshots = async (
  userId: number | string,
  db: Pool = pool
): Promise<number> => {
  const mockTimeline = [
    // 2025
    { date: "2025-01-01", invested: 50000, current: 50000, platforms: 1, owners: 1 },
    { date: "2025-02-01", invested: 50000, current: 51200, platforms: 1, owners: 1 },
    { date: "2025-03-01", invested: 50000, current: 49800, platforms: 1, owners: 1 },
    { date: "2025-04-01", invested: 50000, current: 51500, platforms: 1, owners: 1 },
    { date: "2025-05-01", invested: 50000, current: 53200, platforms: 1, owners: 1 },
    { date: "2025-06-01", invested: 135000, current: 142000, platforms: 2, owners: 2 },
    { date: "2025-07-01", invested: 260667, current: 274500, platforms: 3, owners: 2 },
    { date: "2025-08-01", invested: 260667, current: 280700, platforms: 3, owners: 2 },
    { date: "2025-09-01", invested: 310000, current: 335000, platforms: 3, owners: 2 },
    { date: "2025-10-01", invested: 556018, current: 582000, platforms: 5, owners: 3 },
    { date: "2025-11-01", invested: 556018, current: 596050, platforms: 5, owners: 3 },
    { date: "2025-12-01", invested: 556018, current: 591200, platforms: 5, owners: 3 },
    // 2026
    { date: "2026-01-01", invested: 556018, current: 602400, platforms: 5, owners: 3 },
    { date: "2026-02-01", invested: 556018, current: 597800, platforms: 5, owners: 3 },
    { date: "2026-03-01", invested: 556018, current: 604500, platforms: 5, owners: 3 },
    { date: "2026-04-01", invested: 560540, current: 609100, platforms: 6, owners: 3 },
    { date: "2026-05-01", invested: 560540, current: 601250, platforms: 6, owners: 3 },
    { date: "2026-06-01", invested: 560540, current: 612400, platforms: 6, owners: 3 },
    { date: "2026-07-01", invested: 560540, current: 618900, platforms: 6, owners: 3 },
    { date: "2026-08-01", invested: 560540, current: 608200, platforms: 6, owners: 3 },
    { date: "2026-09-01", invested: 560540, current: 614500, platforms: 6, owners: 3 },
    { date: "2026-10-01", invested: 560540, current: 601250, platforms: 6, owners: 3 },
  ];

  let seededCount = 0;
  for (const item of mockTimeline) {
    await db.query(
      `INSERT INTO ${FINANCIAL_SNAPSHOTS_TABLE} (
        user_id,
        snapshot_date,
        total_invested,
        total_current,
        total_platforms,
        total_owners
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, snapshot_date)
      DO UPDATE SET
        total_invested = EXCLUDED.total_invested,
        total_current = EXCLUDED.total_current,
        total_platforms = EXCLUDED.total_platforms,
        total_owners = EXCLUDED.total_owners;`,
      [userId, item.date, item.invested, item.current, item.platforms, item.owners]
    );
    seededCount++;
  }

  return seededCount;
};
