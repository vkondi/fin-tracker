"use client";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import TrackerTable from "@/components/TrackerTable/TrackerTable";
import { useRootContext } from "@/context/RootContext";

export default function Home() {
  const { isMobile } = useRootContext();

  return (
    <ProtectedRoute>
      <ContentWrapper>
        <div
          className={`flex min-h-screen flex-col items-center bg-gray-200 min-w-[360px] ${
            isMobile ? "py-24 px-2" : "p-24"
          }`}
        >
          <TrackerTable />
        </div>
      </ContentWrapper>
    </ProtectedRoute>
  );
}
