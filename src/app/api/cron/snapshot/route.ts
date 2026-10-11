import { NextResponse } from "next/server";
import { createSnapshotsForAllUsers } from "@/services/snapshotService";

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron using the authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await createSnapshotsForAllUsers();

    console.log(
      `✅ Monthly snapshot complete: ${result.snapshotsCreated} snapshots created/updated for ${result.snapshotDate}`
    );

    return NextResponse.json(
      {
        message: "success",
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[cron/snapshot] >> [GET]: ", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

