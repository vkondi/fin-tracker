"use client";

import ContentWrapper from "@/components/wrappers/ContentWrapper/ContentWrapper";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute/ProtectedRoute";
import TrackerTable from "@/components/TrackerTable/TrackerTable";

const Finances = () => {
  return (
    <ProtectedRoute>
      <ContentWrapper>
        <TrackerTable />
      </ContentWrapper>
    </ProtectedRoute>
  );
};

export default Finances;
