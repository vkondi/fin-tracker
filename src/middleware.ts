import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  // Extract cookies from the request
  const cookies = request.headers.get("cookie");

  // Check for the presence of a session token (e.g., `next-auth.session-token`)
  const hasSessionToken = cookies?.includes("next-auth.session-token");

  // If no session token is found, return a 401 response
  if (!hasSessionToken) {
    return NextResponse.json(
      { message: "You must be logged in to access this resource." },
      { status: 401 }
    );
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware to all API routes
export const config = {
  matcher: [
    "/api/finance", 
    "/api/profile",   
  ],
};
