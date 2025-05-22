import { FaEdit, FaTrash } from "react-icons/fa";
import { FinanceFormDataType } from "../component.types";
import styles from "./TrackerTable.module.css";
import { useRootContext } from "@/context/RootContext";
import { TRACKER_TABLE_LABELS } from "@/utils/constants";
import { formattedAmount } from "@/utils/utility";

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

  const rowCls = "flex justify-between items-center";
  const labelCls = "text-gray-500 text-xs";
  const valueCls = "text-gray-800 font-semibold text-sm";

  const handleEdit = () => {
    showFinanceForm("edit", data);
  };

  const handleDelete = () => {
    showFinanceForm("delete", data);
  };

  if (isMobile) {
    return (
      <tr
        className="p-2 flex flex-col gap-1 border-r-1 border-l-2 border-b-2 border-gray-300 first:border-t-2 w-[360px] mx-auto mb-1 rounded-lg shadow-md"
        style={{
          borderLeftColor: memberColor,
          background: `linear-gradient(to top right, white, white 85%, ${memberColor})`,
        }}
      >
        <td className={rowCls}>
          <div className="text-2xl truncate">{data.platform}</div>
          <div className="text-xs">{data.type}</div>
        </td>

        <td
          className={`${rowCls} font-thin mt-1 mb-2`}
          style={{ color: memberColor }}
        >
          {data.owner}
        </td>
        <td className={rowCls}>
          <div className={labelCls}>{TRACKER_TABLE_LABELS.investedAmount}</div>
          <div className={valueCls}>{formattedInvestedAmount}</div>
        </td>

        <td className={rowCls}>
          <div className={labelCls}>{TRACKER_TABLE_LABELS.currentAmount}</div>
          <div className={valueCls}>{formattedCurrentAmount}</div>
        </td>
        <td className={rowCls}>
          <div className={labelCls}>{TRACKER_TABLE_LABELS.absReturn}</div>
          <div className={`${valueCls} ${absReturnTextCls}`}>
            {formattedAbsoluteReturnAmount}
          </div>
        </td>
        <td className={rowCls}>
          <div className={labelCls}>
            {TRACKER_TABLE_LABELS.absReturnPercentage}
          </div>
          <div className={`${valueCls} ${absReturnTextCls}`}>
            {formattedAbsoluteReturnPercentage}
          </div>
        </td>
        <td className={rowCls}>
          <div className={labelCls}>{TRACKER_TABLE_LABELS.lastUpdated}</div>
          <div
            className={valueCls}
            style={{
              fontWeight: "normal",
              fontSize: "0.8rem",
              fontStyle: "italic",
            }}
          >
            {updatedDate}
          </div>
        </td>

        <td className="flex justify-between items-center py-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
          <button
            onClick={handleEdit}
            disabled={loading}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className={styles.responsiveRow}>
      <td className={styles.responsiveCell}>{data.platform}</td>
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
