import AuthProvider from "@/components/AuthProvider/AuthProvider";
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import Header from "@/components/Header/Header";
import { RootProvider } from "@/context/RootContext";
import FinanceFormPopup from "@/components/FinanceFormPopup/FinanceFormPopup";

export const metadata: Metadata = {
  title: "FINTRAKR",
  description: "Your personal finance tracker",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          <AuthProvider>
            <Suspense>
              <Header />
              <main>{children}</main>
              <FinanceFormPopup />
            </Suspense>
          </AuthProvider>
        </RootProvider>
      </body>
    </html>
  );
}
