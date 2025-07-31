"use client";

import AuthProvider from "@/components/wrappers/AuthProvider/AuthProvider";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { RootProvider, useRootContext } from "@/context/RootContext";
import FinanceFormPopup from "@/components/FinanceFormPopup/FinanceFormPopup";
import Loader from "@/components/Loader/Loader";
import { FinProvider } from "@/context/FinContext";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FINTRAKR",
  description:
    "A multi-user investment portfolio tracker with real-time analytics and visual insights.",
  openGraph: {
    title: "FINTRAKR",
    description:
      "A multi-user investment portfolio tracker with real-time analytics and visual insights.",
    type: "website",
    url: "https://my-fintracker.vercel.app/",
    images: [
      {
        url: "https://my-fintracker.vercel.app/thumbnail.png",
        width: 1905,
        height: 902,
        alt: "FINTRAKR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FINTRAKR",
    description:
      "A multi-user investment portfolio tracker with real-time analytics and visual insights.",
    images: ["https://my-fintracker.vercel.app/thumbnail.png"],
  },
};

const RootComponent = ({ children }: { children: ReactNode }) => {
  const { loader } = useRootContext();

  return (
    <Suspense>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <FinanceFormPopup />

      {/* Loading component */}
      <Loader show={loader.show} loadingMessage={loader.loadingMessage} />
    </Suspense>
  );
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const token = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN;

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

        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${token}"}`}
        ></script>
        {/* End Cloudflare Web Analytics */}
      </body>
    </html>
  );
}
