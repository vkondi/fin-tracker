import { NextResponse } from "next/server";
import {
  createSnapshotForUser,
  getSnapshotsForUser,
  isAuthorizedForSnapshot,
  seedMockHistoricalSnapshots,
} from "@/services/snapshotService";

// Get financial snapshots for a user (timeline data, with optional year filter)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const year = url.searchParams.get("year");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const rows = await getSnapshotsForUser(userId, year ?? undefined);

    return NextResponse.json(
      { message: "success", data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("[finance/snapshots] >> [GET]: ", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Manually capture or update a financial snapshot for a user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, date, action } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Role / Access Guardrail: Restrict trigger to authorized user IDs only
    if (!isAuthorizedForSnapshot(userId)) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to trigger snapshots." },
        { status: 403 }
      );
    }

    // Mock data seeding action
    if (action === "seed") {
      const seeded = await seedMockHistoricalSnapshots(userId);
      return NextResponse.json(
        {
          message: `Successfully seeded ${seeded} historical snapshots (Jan 2025 – Oct 2026)`,
        },
        { status: 200 }
      );
    }

    // Standard snapshot creation/update
    const result = await createSnapshotForUser(userId, date);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Failed to create snapshot" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Financial snapshot captured successfully",
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[finance/snapshots] >> [POST]: ", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


