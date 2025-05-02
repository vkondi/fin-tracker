'use client';

import ProtectedRoute from "@/components/protected-route";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center">Dashboard</h1>
          <p className="text-center">
            Welcome, {session?.user?.name || "User"}!
          </p>
          <p className="text-center">This is a protected page.</p>
          <div className="text-center mt-6">
            <Link
              href="/"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}