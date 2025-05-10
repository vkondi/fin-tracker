"use client";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Dashboard from "@/components/Dashboard/Dashboard";
import Loader from "@/components/Loader/Loader";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useRootContext } from "@/context/RootContext";

export default function Home() {
  const { loader } = useRootContext();

  return (
    <ProtectedRoute>
      <ContentWrapper>
        <>
          <Dashboard />

          {/* Loading component */}
          <Loader show={loader.show} loadingMessage={loader.loadingMessage} />
        </>
      </ContentWrapper>
    </ProtectedRoute>
  );
}
