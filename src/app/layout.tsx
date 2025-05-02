import AuthProvider from "@/components/auth-provider";
import Navbar from "@/components/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";

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
        <AuthProvider>
          <Suspense>
            <Navbar />
            <main>{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
