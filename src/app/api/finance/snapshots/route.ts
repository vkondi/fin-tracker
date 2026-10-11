import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import {
  createSnapshotForUser,
  getSnapshotsForUser,
  isUserAuthorizedForSnapshot,
} from "@/services/snapshotService";
import { pool } from "@/app/api/database";
import { SYS_USERS_TABLE } from "@/utils/constants";

// Get financial snapshots for a user (timeline data, with optional year filter)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email;

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

    // Derive canTriggerSnapshot strictly from verified session identity
    const canTriggerSnapshot = sessionEmail
      ? await isUserAuthorizedForSnapshot(undefined, sessionEmail)
      : false;

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
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email;

    if (!session || !sessionEmail) {
      return NextResponse.json(
        { error: "Unauthorized: Active session required." },
        { status: 401 }
      );
    }

    // Role / Access Guardrail: Restrict trigger to verified OAuth session identity
    const authorized = await isUserAuthorizedForSnapshot(
      undefined,
      sessionEmail
    );
    if (!authorized) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to trigger snapshots." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, date } = body;

    let targetUserId = userId;
    if (!targetUserId) {
      try {
        const { rows: userRows } = await pool.query(
          `SELECT id FROM ${SYS_USERS_TABLE} WHERE LOWER(email) = LOWER($1) LIMIT 1;`,
          [sessionEmail]
        );
        if (userRows.length > 0) {
          targetUserId = userRows[0].id;
        }
      } catch (err) {
        console.error(
          "[finance/snapshots] Failed to query user ID for session:",
          err
        );
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Standard snapshot creation/update
    const result = await createSnapshotForUser(targetUserId, date);

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


