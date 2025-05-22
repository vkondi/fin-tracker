import { NextResponse } from "next/server";

import {
  INSTRUMENTS,
  PLATFORM_CATEGORIES,
  PLATFORMS,
} from "../../_utility/constants";

// Get finance configurations
// This endpoint retrieves the finance related configurations
export async function GET() {
  try {
    return NextResponse.json(
      {
        message: "success",
        data: {
          instruments: INSTRUMENTS,
          categories: PLATFORM_CATEGORIES,
          platforms: PLATFORMS,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[finance] >> [GET]: ", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
