"use client";

import ProtectedRoute from "@/components/wrappers/ProtectedRoute/ProtectedRoute";
import TrackerTable from "@/components/TrackerTable/TrackerTable";
import { useRootContext } from "@/context/RootContext";

const Finances = () => {
  const { isMobile } = useRootContext();

  return (
    <ProtectedRoute>
      <div className="w-full bg-gray-100">
        <div className={`max-w-[2200px] mx-auto ${isMobile ? "" : "px-16 pt-8"}`}>
          <TrackerTable />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Finances;
