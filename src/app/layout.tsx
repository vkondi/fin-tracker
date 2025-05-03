import AuthProvider from "@/components/auth-provider";
import Navbar from "@/components/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import GoogleAuthProvider from "@/components/GoogleAuthProvider";

export const metadata: Metadata = {
  title: "Next.js Auth App",
  description: "Next.js application with Google OAuth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleAuthProvider>
          <AuthProvider>
            <Suspense>
              <Navbar />
              <main>{children}</main>
            </Suspense>
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
