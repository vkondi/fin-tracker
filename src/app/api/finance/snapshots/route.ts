import { NextResponse } from "next/server";
import {
  createSnapshotForUser,
  getSnapshotsForUser,
  isUserAuthorizedForSnapshot,
} from "@/services/snapshotService";

// Get financial snapshots for a user (timeline data, with optional year filter)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const year = url.searchParams.get("year");
    const email = url.searchParams.get("email");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const rows = await getSnapshotsForUser(userId, year ?? undefined);
    const canTriggerSnapshot = await isUserAuthorizedForSnapshot(
      userId,
      email ?? undefined
    );

    return NextResponse.json(
      { message: "success", data: rows, canTriggerSnapshot },
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
    const { userId, email, date } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Role / Access Guardrail: Restrict trigger to authorized users only
    const authorized = await isUserAuthorizedForSnapshot(userId, email);
    if (!authorized) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to trigger snapshots." },
        { status: 403 }
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


