import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    const url = new URL(request.url);
    const { searchParams } = url;
    const id = searchParams.get("id");

    if (id) {
      // Fetch data from the database using the id
    } else {
      // Fetch all data from the database
    }

    // TODO: Fetch data from the database and return it in the response
    return NextResponse.json(
      {
        message: "Hello from finance API!",
        email,
        data: [
          {
            platform: "Platform A",
            type: "Stock",
            owner: "John Doe",
            investedAmount: 1000,
            currentAmount: 1200,
            absReturn: 200,
            absReturnPercentage: "20%",
          },
          {
            platform: "Platform B",
            type: "Crypto",
            owner: "Jane Smith",
            investedAmount: 500,
            currentAmount: 450,
            absReturn: -50,
            absReturnPercentage: "-10%",
          },
        ],
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      // ...data
    } = body;

    if (id) {
      // Update the existing record in the database
    } else {
      // Create a new record in the database
    }

    return NextResponse.json(
      { message: "Finance data processed successfully!" },
      { status: 200 }
    );
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
