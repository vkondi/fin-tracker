import React from "react";
import { useRootContext } from "@/context/RootContext";
import styles from "./TrackerTable.module.css";
import TrackerTableEmptyState from "./TrackerTableEmptyState";
import TrackerTableRow from "./TrackerTableRow";
import { FaPlus } from "react-icons/fa";

const TrackerTable = () => {
  const { showFinanceForm, financeData, isMobile } = useRootContext();

  const handleAddNew = () => {
    showFinanceForm("add");
  };

  if (!financeData || financeData.length === 0) {
    return <TrackerTableEmptyState />;
  }

  return (
    <div
      className={`p-4 border-2 border-gray-300 rounded-lg shadow-md bg-white ${
        isMobile ? "" : "w-full"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Finance Tracker</h2>

        {/* Add New */}
        {isMobile ? (
          <button
            onClick={handleAddNew}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FaPlus />
          </button>
        ) : (
          <button
            onClick={handleAddNew}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
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
                <th className="border border-gray-300 px-4 py-2">Platform</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Owner</th>
                <th className="border border-gray-300 px-4 py-2">
                  Invested Amount
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Current Amount
                </th>
                <th className="border border-gray-300 px-4 py-2">Abs Return</th>
                <th className="border border-gray-300 px-4 py-2">
                  Abs Return %
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Last updated
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
          )}

          <tbody>
            {financeData.map((row, index) => (
              <TrackerTableRow data={row} key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackerTable;
