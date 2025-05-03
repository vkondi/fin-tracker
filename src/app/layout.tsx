import AuthProvider from "@/components/AuthProvider/AuthProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import { RootProvider } from "@/context/RootContext";
import NewFinanceForm from "@/components/NewFinanceForm/NewFinanceForm";

export const metadata: Metadata = {
  title: "FINTRAKR",
  description: "Your personal finance tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          <AuthProvider>
            <Suspense>
              <Header />
              <main>{children}</main>
              <NewFinanceForm />
            </Suspense>
          </AuthProvider>
        </RootProvider>
      </body>
    </html>
  );
}
