import { NextResponse } from "next/server";
import { pool } from "../database";
import { FINANCES_TABLE } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const userId = searchParams.get("userId");

    const queryText = `
      SELECT 
        id,
        platform,
        platform_type,
        amount_invested,
        amount_current,
        updated_date,
        owner
      FROM 
        ${FINANCES_TABLE}
      WHERE 
        user_id = $1
      ORDER BY 
        updated_date DESC;
    `;

    const { rows } = await pool.query(queryText, [userId]);

    if (rows.length) {
      return NextResponse.json(
        { message: "success", data: rows },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: `Failed to find finances for user with id ${userId}` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("[finance] >> [GET]: ", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newRecord = await request.json();

    const queryText = `
      INSERT INTO FINANCES (
        platform,
        platform_type,
        amount_invested,
        amount_current,
        updated_date,
        owner,
        user_id
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)
      RETURNING *;
    `;

    const values = [
      newRecord.platform,
      newRecord.type,
      newRecord.investedAmount,
      newRecord.currentAmount,
      newRecord.owner,
      newRecord.userId,
    ];

    const { rows } = await pool.query(queryText, values);

    if (rows.length) {
      return NextResponse.json(
        { message: "success", data: rows[0] },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to add finance record" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[finance] >> [POST]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
      { message: "Finance data updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[finance] >> [PUT]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
      { message: "Finance data deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[finance] >> [DELETE]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
