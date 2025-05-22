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
    // Sort by category/name
    const sortedPlatforms = [...PLATFORMS].sort((a, b) => {
      // First, compare by category
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;

      // If categories are equal, compare by name
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(
      {
        message: "success",
        data: {
          instruments: INSTRUMENTS,
          categories: PLATFORM_CATEGORIES,
          platforms: sortedPlatforms,
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
