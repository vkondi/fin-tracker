"use client";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import TrackerTable from "@/components/TrackerTable/TrackerTable";

export default function Home() {

  return (
    <ProtectedRoute>
      <ContentWrapper>
        <div className="flex min-h-screen flex-col items-center p-24 bg-sky-100">
          <TrackerTable />
        </div>
      </ContentWrapper>
    </ProtectedRoute>
  );
}
