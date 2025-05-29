import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort, FaTimes } from "react-icons/fa";
import { FinanceFormDataType } from "../component.types";

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

type FilterType = {
  owner: string[];
  category: string[];
  platform: string[];
  type: string[];
};

interface TableControlsProps {
  data: FinanceFormDataType[];
  onFilterChange: (filters: FilterType) => void;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  isMobile: boolean;
}

const TableControls = ({ data, onFilterChange, onSortChange, isMobile }: TableControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
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

  const controlsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(filters => filters.length > 0);
  // Check if sort is active
  const hasSortActive = sortConfig.field !== null;

  // Extract unique values for filter options
  const filterOptions = data.reduce(
    (acc, curr) => {
      if (!acc.owner.includes(curr.owner)) acc.owner.push(curr.owner);
      if (!acc.category.includes(curr.category)) acc.category.push(curr.category);
      if (!acc.platform.includes(curr.platform)) acc.platform.push(curr.platform);
      if (!acc.type.includes(curr.type)) acc.type.push(curr.type);
      return acc;
    },
    { owner: [], category: [], platform: [], type: [] } as FilterType
  );

  const sortOptions: { field: SortField; label: string }[] = [
    { field: "updatedDate", label: "Last Updated" },
    { field: "owner", label: "Owner" },
    { field: "platform", label: "Platform" },
    { field: "category", label: "Category" },
    { field: "type", label: "Type" },
    { field: "currentAmount", label: "Current Amount" },
    { field: "investedAmount", label: "Invested Amount" },
  ];

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsSortOpen(false);
  };

  const handleSortToggle = () => {
    setIsSortOpen(!isSortOpen);
    setIsFilterOpen(false);
  };

  const handleFilterChange = (type: keyof FilterType, value: string) => {
    const newFilters = { ...activeFilters };
    const index = newFilters[type].indexOf(value);

    if (index === -1) {
      newFilters[type].push(value);
    } else {
      newFilters[type].splice(index, 1);
    }

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {
      owner: [],
      category: [],
      platform: [],
      type: [],
    };
    setActiveFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleSortChange = (field: SortField) => {
    const direction: SortDirection =
      sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";

    setSortConfig({ field, direction });
    onSortChange(field, direction);
    setIsSortOpen(false);
  };

  const handleClearSort = () => {
    setSortConfig({ field: null, direction: "desc" });
    onSortChange("updatedDate", "desc"); // Reset to default sort
  };

  const buttonClass = "bg-[var(--primary-btn)] text-white rounded hover:bg-[var(--primary-btn-hover)] transition-colors";
  const dropdownClass = "absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 py-2 border border-gray-200";
  const filterItemClass = "px-4 py-2 hover:bg-gray-50";

  return (
    <div className="flex gap-2 relative" ref={controlsRef}>
      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={handleFilterToggle}
          className={`${buttonClass} ${isMobile ? "p-2" : "px-4 py-2 flex items-center gap-2"}`}
        >
          <FaFilter size={isMobile ? 16 : 14} />
          {!isMobile && <span>Filter</span>}
        </button>
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </div>

      {/* Sort Button */}
      <div className="relative">
        <button
          onClick={handleSortToggle}
          className={`${buttonClass} ${isMobile ? "p-2" : "px-4 py-2 flex items-center gap-2"}`}
        >
          <FaSort size={isMobile ? 16 : 14} />
          {!isMobile && <span>Sort</span>}
        </button>
        {hasSortActive && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </div>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div className={dropdownClass}>
          <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200">
            <span className="font-medium text-sm text-gray-700">Filters</span>
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FaTimes size={12} />
                Clear All
              </button>
            )}
          </div>
          {(Object.keys(filterOptions) as Array<keyof FilterType>).map((filterType) => (
            <div key={filterType} className="mb-4 last:mb-0">
              <div className="px-4 py-1 bg-gray-50 font-medium text-sm text-gray-700 capitalize">
                {filterType}
              </div>
              <div className="py-1">
                {filterOptions[filterType].map((option) => (
                  <label key={option} className={`${filterItemClass} flex items-center`}>
                    <input
                      type="checkbox"
                      checked={activeFilters[filterType].includes(option)}
                      onChange={() => handleFilterChange(filterType, option)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sort Dropdown */}
      {isSortOpen && (
        <div className={dropdownClass}>
          <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200">
            <span className="font-medium text-sm text-gray-700">Sort By</span>
            {hasSortActive && (
              <button
                onClick={handleClearSort}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FaTimes size={12} />
                Clear Sort
              </button>
            )}
          </div>
          {sortOptions.map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className={`${filterItemClass} w-full text-left flex items-center justify-between`}
            >
              <span className="text-sm text-gray-700">{label}</span>
              {sortConfig.field === field && (
                <span className="text-xs text-gray-500">
                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableControls; 