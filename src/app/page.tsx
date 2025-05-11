"use client";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Dashboard from "@/components/Dashboard/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <ContentWrapper>
        <Dashboard />
      </ContentWrapper>
    </ProtectedRoute>
  );
}
