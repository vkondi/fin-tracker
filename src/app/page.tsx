"use client";

import ContentWrapper from "@/components/wrappers/ContentWrapper/ContentWrapper";
import Dashboard from "@/components/Dashboard/Dashboard";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <ContentWrapper>
        <Dashboard />
      </ContentWrapper>
    </ProtectedRoute>
  );
}
