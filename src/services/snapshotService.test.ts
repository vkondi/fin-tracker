import {
  isAuthorizedForSnapshot,
  formatSnapshotDate,
  createSnapshotForUser,
  createSnapshotsForAllUsers,
  getSnapshotsForUser,
  seedMockHistoricalSnapshots,
} from "./snapshotService";
import { Pool } from "pg";

vi.mock("@/app/api/database", () => ({
  pool: {
    query: vi.fn(),
  },
}));

describe("snapshotService", () => {
  describe("isAuthorizedForSnapshot", () => {
    it("should return true for authorized user IDs", () => {
      expect(isAuthorizedForSnapshot("1")).toBe(true);
      expect(isAuthorizedForSnapshot("2")).toBe(true);
      expect(isAuthorizedForSnapshot(1)).toBe(true);
      expect(isAuthorizedForSnapshot(2)).toBe(true);
    });

    it("should return false for unauthorized user IDs or empty values", () => {
      expect(isAuthorizedForSnapshot("3")).toBe(false);
      expect(isAuthorizedForSnapshot("99")).toBe(false);
      expect(isAuthorizedForSnapshot(null)).toBe(false);
      expect(isAuthorizedForSnapshot(undefined)).toBe(false);
    });
  });

  describe("formatSnapshotDate", () => {
    it("should normalize date to the first of the month (YYYY-MM-01)", () => {
      const date = new Date("2026-10-15T12:00:00Z");
      const result = formatSnapshotDate(date);
      expect(result).toBe("2026-10-01");
    });

    it("should default to current month first day when no date provided", () => {
      const result = formatSnapshotDate();
      expect(result).toMatch(/^\d{4}-\d{2}-01$/);
    });
  });

  describe("createSnapshotForUser", () => {
    it("should return error when user has no finance data", async () => {
      const mockDb = {
        query: vi.fn().mockResolvedValue({
          rows: [
            {
              total_invested: "0",
              total_current: "0",
              total_platforms: "0",
              total_owners: "0",
            },
          ],
        }),
      } as unknown as Pool;

      const result = await createSnapshotForUser(2, "2026-10-01", mockDb);
      expect(result.success).toBe(false);
      expect(result.error).toBe("No finance data found for user");
    });

    it("should aggregate and upsert snapshot when finance data exists", async () => {
      const mockDb = {
        query: vi
          .fn()
          .mockResolvedValueOnce({
            rows: [
              {
                total_invested: "500000",
                total_current: "550000",
                total_platforms: "4",
                total_owners: "2",
              },
            ],
          })
          .mockResolvedValueOnce({
            rows: [
              {
                id: 1,
                user_id: 2,
                snapshot_date: "2026-10-01",
                total_invested: "500000",
                total_current: "550000",
                total_platforms: 4,
                total_owners: 2,
              },
            ],
          }),
      } as unknown as Pool;

      const result = await createSnapshotForUser(2, "2026-10-01", mockDb);
      expect(result.success).toBe(true);
      expect(result.data?.total_invested).toBe("500000");
      expect(mockDb.query).toHaveBeenCalledTimes(2);
    });
  });

  describe("createSnapshotsForAllUsers", () => {
    it("should iterate through all users and create snapshots", async () => {
      const mockDb = {
        query: vi
          .fn()
          // SELECT id FROM SYS_USERS
          .mockResolvedValueOnce({
            rows: [{ id: 1 }, { id: 2 }],
          })
          // User 1 aggregation
          .mockResolvedValueOnce({
            rows: [
              {
                total_invested: "1000",
                total_current: "1100",
                total_platforms: "1",
                total_owners: "1",
              },
            ],
          })
          // User 1 upsert
          .mockResolvedValueOnce({
            rows: [{ id: 10, user_id: 1 }],
          })
          // User 2 aggregation (0 finance data)
          .mockResolvedValueOnce({
            rows: [
              {
                total_invested: "0",
                total_current: "0",
                total_platforms: "0",
                total_owners: "0",
              },
            ],
          }),
      } as unknown as Pool;

      const result = await createSnapshotsForAllUsers("2026-10-01", mockDb);
      expect(result.snapshotsCreated).toBe(1);
      expect(result.snapshotDate).toBe("2026-10-01");
    });
  });

  describe("getSnapshotsForUser", () => {
    it("should query snapshots without year filter", async () => {
      const mockDb = {
        query: vi.fn().mockResolvedValue({
          rows: [{ snapshot_date: "2026-10-01", total_invested: 100 }],
        }),
      } as unknown as Pool;

      const rows = await getSnapshotsForUser(2, undefined, mockDb);
      expect(rows.length).toBe(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.not.stringContaining("EXTRACT(YEAR"),
        [2]
      );
    });

    it("should query snapshots with year filter when specified", async () => {
      const mockDb = {
        query: vi.fn().mockResolvedValue({
          rows: [{ snapshot_date: "2025-05-01", total_invested: 50 }],
        }),
      } as unknown as Pool;

      const rows = await getSnapshotsForUser(2, "2025", mockDb);
      expect(rows.length).toBe(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("EXTRACT(YEAR FROM snapshot_date) = $2"),
        [2, 2025]
      );
    });
  });

  describe("seedMockHistoricalSnapshots", () => {
    it("should seed 22 mock snapshot records", async () => {
      const mockDb = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
      } as unknown as Pool;

      const count = await seedMockHistoricalSnapshots(2, mockDb);
      expect(count).toBe(22);
      expect(mockDb.query).toHaveBeenCalledTimes(22);
    });
  });
});
