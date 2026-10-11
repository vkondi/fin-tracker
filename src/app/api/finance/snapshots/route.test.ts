import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { getServerSession } from "next-auth/next";
import {
  getSnapshotsForUser,
  isUserAuthorizedForSnapshot,
  createSnapshotForUser,
} from "@/services/snapshotService";
import { pool } from "@/app/api/database";

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/services/snapshotService", () => ({
  getSnapshotsForUser: vi.fn(),
  isUserAuthorizedForSnapshot: vi.fn(),
  createSnapshotForUser: vi.fn(),
}));

vi.mock("@/app/api/database", () => ({
  pool: {
    query: vi.fn(),
  },
}));

vi.mock("@/lib/authOptions", () => ({
  authOptions: {},
}));

describe("/api/finance/snapshots route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 400 if userId is not provided", async () => {
      const request = new Request("http://localhost:3000/api/finance/snapshots");
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe("userId is required");
    });

    it("should return canTriggerSnapshot: false when there is no active session, even if client supplies email param", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      vi.mocked(getSnapshotsForUser).mockResolvedValue([]);

      const request = new Request(
        "http://localhost:3000/api/finance/snapshots?userId=2&email=admin@fin.com"
      );
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.canTriggerSnapshot).toBe(false);
      expect(isUserAuthorizedForSnapshot).not.toHaveBeenCalled();
    });

    it("should return canTriggerSnapshot: true when session email is authorized", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { email: "admin@fin.com" },
      });
      vi.mocked(isUserAuthorizedForSnapshot).mockResolvedValue(true);
      vi.mocked(getSnapshotsForUser).mockResolvedValue([
        {
          id: 1,
          user_id: 2,
          snapshot_date: "2026-10-01",
          total_invested: 1000,
          total_current: 1200,
          total_platforms: 2,
          total_owners: 1,
        },
      ]);

      const request = new Request(
        "http://localhost:3000/api/finance/snapshots?userId=2"
      );
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.canTriggerSnapshot).toBe(true);
      expect(json.data.length).toBe(1);
      expect(isUserAuthorizedForSnapshot).toHaveBeenCalledWith(
        undefined,
        "admin@fin.com"
      );
    });
  });

  describe("POST", () => {
    it("should return 401 when no session exists", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/finance/snapshots", {
        method: "POST",
        body: JSON.stringify({ userId: 2, email: "admin@fin.com" }),
      });
      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe("Unauthorized: Active session required.");
    });

    it("should return 403 when session user is not authorized, even if body provides an allowlisted email", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { email: "unauthorized@fin.com" },
      });
      vi.mocked(isUserAuthorizedForSnapshot).mockResolvedValue(false);

      const request = new Request("http://localhost:3000/api/finance/snapshots", {
        method: "POST",
        body: JSON.stringify({ userId: 2, email: "admin@fin.com" }),
      });
      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(403);
      expect(json.error).toBe(
        "Forbidden: You are not authorized to trigger snapshots."
      );
      expect(isUserAuthorizedForSnapshot).toHaveBeenCalledWith(
        undefined,
        "unauthorized@fin.com"
      );
      expect(createSnapshotForUser).not.toHaveBeenCalled();
    });

    it("should successfully capture snapshot when session user is authorized", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { email: "admin@fin.com" },
      });
      vi.mocked(isUserAuthorizedForSnapshot).mockResolvedValue(true);
      vi.mocked(createSnapshotForUser).mockResolvedValue({
        success: true,
        data: {
          id: 1,
          user_id: 2,
          snapshot_date: "2026-10-01",
          total_invested: 500000,
          total_current: 550000,
          total_platforms: 4,
          total_owners: 2,
        },
      });

      const request = new Request("http://localhost:3000/api/finance/snapshots", {
        method: "POST",
        body: JSON.stringify({ userId: 2, date: "2026-10-01" }),
      });
      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.message).toBe("Financial snapshot captured successfully");
      expect(createSnapshotForUser).toHaveBeenCalledWith(2, "2026-10-01");
    });

    it("should fallback to resolving userId from DB if not provided in body", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { email: "admin@fin.com" },
      });
      vi.mocked(isUserAuthorizedForSnapshot).mockResolvedValue(true);
      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ id: 5 }],
      } as never);
      vi.mocked(createSnapshotForUser).mockResolvedValue({
        success: true,
      });

      const request = new Request("http://localhost:3000/api/finance/snapshots", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const response = await POST(request);
      await response.json();

      expect(response.status).toBe(200);
      expect(createSnapshotForUser).toHaveBeenCalledWith(5, undefined);
    });
  });
});
