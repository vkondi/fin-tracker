"use client";

import AuthProvider from "@/components/wrappers/AuthProvider/AuthProvider";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import Header from "@/components/Header/Header";
import { RootProvider, useRootContext } from "@/context/RootContext";
import FinanceFormPopup from "@/components/FinanceFormPopup/FinanceFormPopup";
import Loader from "@/components/Loader/Loader";
import { FinProvider } from "@/context/FinContext";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" className={inter.className}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <RootProvider>
            <FinProvider>
              <RootComponent>{children}</RootComponent>
            </FinProvider>
          </RootProvider>
        </AuthProvider>

        {/* Cloudfare Web Analytics */}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": ${process.env.CLOUDFARE_WEB_ANALYTICS_TOKEN}}`}
        />
      </body>
    </html>
  );
}
