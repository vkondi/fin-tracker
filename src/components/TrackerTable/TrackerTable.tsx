import React, { useMemo, useState } from "react";
import { useRootContext } from "@/context/RootContext";
import styles from "./TrackerTable.module.css";
import TrackerTableEmptyState from "./TrackerTableEmptyState";
import TrackerTableRow from "./TrackerTableRow";
import TableControls from "./TableControls";
import { FaPlus } from "react-icons/fa";
import { TRACKER_TABLE_LABELS } from "@/utils/constants";
import { useFinContext } from "@/context/FinContext";
import { FinanceFormDataType } from "../component.types";

type FilterType = {
  owner: string[];
  category: string[];
  platform: string[];
  type: string[];
};

type SortField = keyof Pick<
  FinanceFormDataType,
  | "updatedDate"
  | "owner"
  | "platform"
  | "category"
  | "type"
  | "currentAmount"
  | "investedAmount"
>;

type SortDirection = "asc" | "desc";

const TrackerTable = () => {
  const {
    showFinanceForm,
    isMobile,
    loader: { show: loading },
  } = useRootContext();
  const { financeData, memberWiseData } = useFinContext();

  const [activeFilters, setActiveFilters] = useState<FilterType>({
    owner: [],
    category: [],
    platform: [],
    type: [],
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField | null;
    direction: SortDirection;
  }>({
    field: null,
    direction: "desc",
  });

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

  const filteredAndSortedData = useMemo(() => {
    let result = [...financeData];

    // Apply filters
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter((item) => 
          values.includes(item[key as keyof FinanceFormDataType] as string)
        );
      }
    });

    // Apply sorting
    if (sortConfig.field) {
      result.sort((a, b) => {
        const field = sortConfig.field as SortField;
        let aValue = a[field];
        let bValue = b[field];

        // Handle special cases for numeric fields
        if (["currentAmount", "investedAmount"].includes(field)) {
          aValue = Number(aValue || 0);
          bValue = Number(bValue || 0);
        }

        // Handle date comparison
        if (field === "updatedDate") {
          aValue = new Date(aValue as string || "").getTime();
          bValue = new Date(bValue as string || "").getTime();
        }

        // Handle string comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc" 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle number comparison
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [financeData, activeFilters, sortConfig]);

  const handleFilterChange = (filters: FilterType) => {
    setActiveFilters(filters);
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortConfig({ field, direction });
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
    <div className={`w-full ${isMobile ? "p-4" : ""}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Finance Tracker</h2>
        <div className="flex items-center gap-2">
          <TableControls
            data={financeData}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            isMobile={isMobile}
          />
          {isMobile ? (
            <button
              onClick={handleAddNew}
              className="bg-[var(--primary-btn)] text-white p-2 rounded hover:bg-[var(--primary-btn-hover)]"
              aria-label="Add new entry"
            >
              <FaPlus size={16} />
            </button>
          ) : (
            <button
              onClick={handleAddNew}
              className="bg-[var(--primary-btn)] text-white px-4 py-2 rounded hover:bg-[var(--primary-btn-hover)] flex items-center gap-2"
              aria-label="Add new entry"
            >
              <FaPlus /> Add New
            </button>
          )}
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-2">
          {filteredAndSortedData.map((row, index) => (
            <TrackerTableRow
              data={row}
              key={index}
              memberColorMap={memberColorMap}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className={styles.tableContainer}>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.platform}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.category}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.type}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.owner}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.investedAmount}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.currentAmount}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.absReturn}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.absReturnPercentage}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.lastUpdated}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {TRACKER_TABLE_LABELS.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((row, index) => (
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
      )}
    </div>
  );
};

export default TrackerTable;
