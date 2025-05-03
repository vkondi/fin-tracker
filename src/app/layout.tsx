import AuthProvider from "@/components/auth-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";

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
            <Header title="FINTRAKR" />
            <main>{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
