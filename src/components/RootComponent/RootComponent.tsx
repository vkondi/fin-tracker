"use client";

import { ReactNode, Suspense } from "react";
import { useRootContext } from "@/context/RootContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FinanceFormPopup from "@/components/FinanceFormPopup/FinanceFormPopup";
import Loader from "@/components/Loader/Loader";

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

export default RootComponent; 