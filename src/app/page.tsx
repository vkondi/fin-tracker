"use client";

import ProtectedRoute from "@/components/protected-route";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-200">
        <div className="max-w-md w-full space-y-8 p-8 bg-blue-100 rounded-lg shadow-md">
          <p className="text-center">
            Welcome, {session?.user?.name || "User"}!
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
