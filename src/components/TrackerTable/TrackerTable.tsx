import React from "react";
import { useRootContext } from "@/context/RootContext";
import styles from "./TrackerTable.module.css";
import TrackerTableEmptyState from "./TrackerTableEmptyState";
import TrackerTableRow from "./TrackerTableRow";
import { FaPlus } from "react-icons/fa";
import { TRACKER_TABLE_LABELS } from "@/utils/constants";
import { useFinContext } from "@/context/FinContext";

const TrackerTable = () => {
  const {
    showFinanceForm,
    isMobile,
    loader: { show: loading },
  } = useRootContext();
  const { financeData, memberWiseData } = useFinContext();

  const memberColorMap = memberWiseData.reduce((map, curr) => {
    const ownerName = curr?.owner;
    if (!map.has(ownerName)) {
      map.set(ownerName, curr.fill);
    }
    return map;
  }, new Map<string, string>());

  const handleAddNew = () => {
    showFinanceForm("add");
  };

  // Show empty state if no data and not loading
  if ((!financeData || financeData.length === 0) && !loading) {
    return <TrackerTableEmptyState />;
  }

  // Show only loading state if data is not available
  if (loading) {
    return null;
  }

  return (
    <div className={`p-4 bg-white ${isMobile ? "" : "w-full"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Finance Tracker</h2>

        {/* Add New */}
        {isMobile ? (
          <button
            onClick={handleAddNew}
            className="bg-[var(--primary-btn)] text-white px-4 py-2 rounded hover:bg-[var(--primary-btn-hover)]"
          >
            <FaPlus />
          </button>
        ) : (
          <button
            onClick={handleAddNew}
            className="bg-[var(--primary-btn)] text-white px-4 py-2 rounded hover:bg-[var(--primary-btn-hover)] flex items-center gap-2"
          >
            <FaPlus /> Add New
          </button>
        )}
      </div>
      <div className={styles.tableContainer}>
        <table className="min-w-full">
          {!isMobile && (
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.platform}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.type}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.owner}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.investedAmount}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.currentAmount}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.absReturn}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.absReturnPercentage}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.lastUpdated}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  {TRACKER_TABLE_LABELS.actions}
                </th>
              </tr>
            </thead>
          )}

          <tbody>
            {financeData.map((row, index) => (
              <TrackerTableRow
                data={row}
                key={index}
                memberColorMap={memberColorMap}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackerTable;
