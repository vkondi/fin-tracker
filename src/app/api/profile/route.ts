import { NextResponse } from "next/server";
import { pool } from "../database";

// Get user profile(s)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const id = searchParams.get("id");

    if (id) {
      const existingUser = await pool.query(
        `SELECT * FROM SYS_USERS WHERE id = $1`,
        [id]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { message: "success", data: existingUser.rows[0] },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: `Failed to find user with id ${id}` },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: `Missing required fields` },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("[profile] >> [GET]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Add new profile (Register)
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await pool.query(
      `SELECT * FROM SYS_USERS WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: "Existing user", data: existingUser.rows[0] },
        { status: 200 }
      );
    }

    // Insert the new user
    const result = await pool.query(
      `INSERT INTO SYS_USERS (email, name) VALUES ($1, $2) RETURNING *`,
      [email, name]
    );

    const newUser = result.rows?.[0];

    return NextResponse.json({
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("[profile] >> [POST]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update existing profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      // ...data
    } = body;

    if (id) {
      // Update the existing record in the database using the id
    } else {
      return NextResponse.json(
        { error: "ID is required to update a record" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Profile data updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[profile] >> [PUT]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete profile
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const id = searchParams.get("id");

    if (id) {
      // Delete the record from the database using the id
    } else {
      return NextResponse.json(
        { error: "ID is required to delete a record" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Profile data deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[profile] >> [DELETE]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
