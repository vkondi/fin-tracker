"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  console.log("Session data:", session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Next.js Authentication</h1>
          <p className="mt-2 text-gray-600">
            Example app with Google OAuth authentication
          </p>
        </div>

        <div className="mt-8">
          {loading && <div className="text-center">Loading...</div>}

          {!loading && !session && (
            <div className="text-center">
              <p className="mb-4">You are not signed in</p>
              <button
                onClick={() => signIn()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          )}

          {!loading && session && (
            <div className="text-center">
              <p className="mb-2">
                Signed in as{" "}
                <span className="font-bold">{session.user?.email}</span>
              </p>
              <div className="mb-4">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-12 w-12 rounded-full mx-auto"
                  />
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
