const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function runSnapshotForUser(userId) {
  console.log(`\n--- Running snapshot for user ID: ${userId} ---`);

  const { rows: aggregation } = await pool.query(
    `SELECT
      COALESCE(SUM(amount_invested), 0) AS total_invested,
      COALESCE(SUM(amount_current), 0) AS total_current,
      COUNT(DISTINCT platform) AS total_platforms,
      COUNT(DISTINCT owner) AS total_owners
    FROM FINANCES
    WHERE user_id = $1`,
    [userId]
  );

  const agg = aggregation[0];
  const snapshotDate = new Date();
  snapshotDate.setDate(1);
  const snapshotDateStr = snapshotDate.toISOString().split('T')[0];

  const { rows } = await pool.query(
    `INSERT INTO FINANCIAL_SNAPSHOTS (
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
  console.log('✅ Snapshot recorded:', rows[0]);
}

async function seedMockData(userId) {
  console.log(`\n--- Seeding 22 mock historical snapshots (Jan 2025 – Oct 2026) for user ${userId} ---`);

  const mockTimeline = [
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

  for (const item of mockTimeline) {
    await pool.query(
      `INSERT INTO FINANCIAL_SNAPSHOTS (
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
  }

  const { rows } = await pool.query(
    'SELECT snapshot_date, total_invested, total_current FROM FINANCIAL_SNAPSHOTS WHERE user_id = $1 ORDER BY snapshot_date ASC',
    [userId]
  );
  console.log(`✅ Total snapshots in DB for user ${userId}: ${rows.length}`);
  console.table(rows);
}

async function main() {
  const args = process.argv.slice(2);
  const isSeed = args.includes('--seed');
  const userIdArg = args.find((a) => !isNaN(parseInt(a)));
  const targetUserId = userIdArg ? parseInt(userIdArg) : 2;

  if (isSeed) {
    await seedMockData(targetUserId);
  } else {
    await runSnapshotForUser(targetUserId);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
