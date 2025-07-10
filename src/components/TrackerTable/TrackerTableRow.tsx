import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FinanceFormDataType } from "../component.types";
import styles from "./TrackerTable.module.css";
import { useRootContext } from "@/context/RootContext";
import { TRACKER_TABLE_LABELS } from "@/utils/constants";
import { formattedAmount } from "@/utils/utility";
import { useState } from "react";

function calculateAbsoluteReturn(
  investedAmount: number,
  currentAmount: number
) {
  const absoluteReturn =
    ((currentAmount - investedAmount) / investedAmount) * 100;
  return absoluteReturn.toFixed(2); // Returns with 2 decimal places
}

const TrackerTableRow = ({
  data,
  memberColorMap,
}: {
  data: FinanceFormDataType;
  memberColorMap: Map<string, string>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    loader: { show: loading },
    showFinanceForm,
    isMobile,
  } = useRootContext();

  const owner = data.owner;
  const memberColor = memberColorMap.get(owner);
  const formattedInvestedAmount = formattedAmount(data.investedAmount);
  const formattedCurrentAmount = formattedAmount(data.currentAmount);
  const absoluteReturnPercentage = calculateAbsoluteReturn(
    data.investedAmount,
    data.currentAmount
  );
  const formattedAbsoluteReturnPercentage = `${absoluteReturnPercentage}%`;
  const abosulteReturnAmount = (
    data.currentAmount - data.investedAmount
  ).toFixed(2);
  const formattedAbsoluteReturnAmount = formattedAmount(
    parseFloat(abosulteReturnAmount)
  );
  const updatedDate = data?.updatedDate
    ? new Date(data.updatedDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const absReturnTextCls =
    parseInt(abosulteReturnAmount) > 0
      ? "text-green-700"
      : parseInt(abosulteReturnAmount) < 0
      ? "text-red-700"
      : "";


  const handleEdit = () => {
    showFinanceForm("edit", data);
  };

  const handleDelete = () => {
    showFinanceForm("delete", data);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isMobile) {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          borderLeft: `4px solid ${memberColor}`,
        }}
      >
        {/* Main Card Content - Always Visible */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800">{data.platform}</h3>
              {!isExpanded && (
                <p className="text-xs text-gray-600 mt-1">{data.type}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                disabled={loading}
                className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <FaEdit size={13} />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
              >
                <FaTrash size={13} />
              </button>
              <button
                onClick={toggleExpand}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Owner</p>
              <p className="text-sm font-medium" style={{ color: memberColor }}>{owner}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Current Amount</p>
              <p className="text-sm font-semibold text-gray-800">{formattedCurrentAmount}</p>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <div 
          className={`bg-gray-50 transition-all duration-200 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[500px] border-t' : 'max-h-0'
          }`}
        >
          <div className="p-4 space-y-3">
            {/* Financial Details */}
            <div className="pb-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">{TRACKER_TABLE_LABELS.investedAmount}</p>
                  <p className="text-sm font-medium text-gray-800">{formattedInvestedAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{TRACKER_TABLE_LABELS.absReturn}</p>
                  <p className={`text-sm font-medium ${absReturnTextCls}`}>
                    {formattedAbsoluteReturnAmount}
                    <span className="text-[11px] ml-1">({formattedAbsoluteReturnPercentage})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Details */}
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-gray-800">{data.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm text-gray-800">{data.type}</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">{TRACKER_TABLE_LABELS.lastUpdated}</p>
              <p className="text-xs text-gray-600 italic">{updatedDate}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr className={styles.responsiveRow}>
      <td className={styles.responsiveCell}>{data.platform}</td>
      <td className={styles.responsiveCell}>{data.category}</td>
      <td className={styles.responsiveCell}>{data.type}</td>
      <td className={styles.responsiveCell} style={{ color: memberColor }}>
        {owner}
      </td>
      <td className={styles.responsiveCell}>{formattedInvestedAmount}</td>
      <td className={styles.responsiveCell}>{formattedCurrentAmount}</td>
      <td className={`${styles.responsiveCell} ${absReturnTextCls}`}>
        {formattedAbsoluteReturnAmount}
      </td>
      <td className={`${styles.responsiveCell} ${absReturnTextCls}`}>
        {formattedAbsoluteReturnPercentage}
      </td>
      <td className={styles.responsiveCell}>{updatedDate}</td>
      <td className={styles.responsiveCell}>
        <button
          onClick={handleEdit}
          disabled={loading}
          className="text-blue-500 hover:text-blue-700 pl-2"
        >
          <FaEdit />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700 pl-2"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default TrackerTableRow;
