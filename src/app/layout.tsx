"use client";

import AuthProvider from "@/components/wrappers/AuthProvider/AuthProvider";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import Header from "@/components/Header/Header";
import { RootProvider, useRootContext } from "@/context/RootContext";
import FinanceFormPopup from "@/components/FinanceFormPopup/FinanceFormPopup";
import Loader from "@/components/Loader/Loader";

const RootComponent = ({ children }: { children: ReactNode }) => {
  const { loader } = useRootContext();

  return (
    <Suspense>
      <Header />
      <main>{children}</main>
      <FinanceFormPopup />

      {/* Loading component */}
      <Loader show={loader.show} loadingMessage={loader.loadingMessage} />
    </Suspense>
  );
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RootProvider>
            <RootComponent>{children}</RootComponent>
          </RootProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
