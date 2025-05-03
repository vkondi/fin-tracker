"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        <Link href="/" className="text-2xl font-bold">
          FINTRAKR
        </Link>
        
        <div className="flex space-x-4 items-center">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          {!loading && session && (
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          )}
          {!loading && !session ? (
            <button
              onClick={() => signIn()}
              className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Sign In
            </button>
          ) : (
            !loading && (
              <button
                onClick={() => signOut()}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
