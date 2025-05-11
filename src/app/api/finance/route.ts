import { NextResponse } from "next/server";
import { pool } from "../database";
import { FINANCES_TABLE } from "@/utils/constants";

// Get user finance(s)
// This endpoint retrieves the finance records for a specific user based on their userId.
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
        platform_category,
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

// Add new finance record
export async function POST(request: Request) {
  try {
    const newRecord = await request.json();

    const queryText = `
      INSERT INTO FINANCES (
        platform,
        platform_type,
        platform_category,
        amount_invested,
        amount_current,
        updated_date,
        owner,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)
      RETURNING *;
    `;

    const values = [
      newRecord.platform,
      newRecord.type,
      newRecord.category,
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

// Update finance record
export async function PUT(request: Request) {
  try {
    const updatedRecord = await request.json();

    // Validate that we have an ID to update
    if (!updatedRecord.id) {
      return NextResponse.json(
        { error: "ID is required for updating a record" },
        { status: 400 }
      );
    }

    const queryText = `
        UPDATE ${FINANCES_TABLE}
        SET 
          platform = $1,
          platform_type = $2,
          platform_category = $3,
          amount_invested = $4,
          amount_current = $5,
          updated_date = CURRENT_TIMESTAMP,
          owner = $6
        WHERE 
          id = $7
        RETURNING *;
      `;

    const values = [
      updatedRecord.platform,
      updatedRecord.type,
      updatedRecord.category,
      updatedRecord.investedAmount,
      updatedRecord.currentAmount,
      updatedRecord.owner,
      updatedRecord.id,
    ];

    const { rows } = await pool.query(queryText, values);

    if (rows.length) {
      return NextResponse.json(
        { message: "success", data: rows[0] },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: `Failed to update finance record with id ${updatedRecord.id}`,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("[finance] >> [PUT]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete finance record
export async function DELETE(request: Request) {
  try {
    const requestObj = await request.json();
    const recordId = requestObj?.id;

    if (!recordId) {
      return NextResponse.json(
        { error: "ID is required for deleting a record" },
        { status: 400 }
      );
    }

    const queryText = `
        DELETE FROM ${FINANCES_TABLE}
        WHERE id = $1
        RETURNING *;
      `;

    const { rows } = await pool.query(queryText, [recordId]);

    if (rows.length) {
      return NextResponse.json(
        { message: "success", data: rows[0] },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: `Failed to find finance record with id ${recordId} to delete`,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("[finance] >> [DELETE]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
