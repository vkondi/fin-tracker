import { FaEdit, FaTrash } from "react-icons/fa";
import { FinanceFormDataType } from "../component.types";
import styles from "./TrackerTable.module.css";

function calculateAbsoluteReturn(
  investedAmount: number,
  currentAmount: number
) {
  const absoluteReturn =
    ((currentAmount - investedAmount) / investedAmount) * 100;
  return absoluteReturn.toFixed(2); // Returns with 2 decimal places
}

const TrackerTableRow = ({ data }: { data: FinanceFormDataType }) => {
  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

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
    parseFloat(abosulteReturnAmount));

  const handleEdit = () => {
    // console.log(`Edit row ${index}`);
  };

  const handleDelete = () => {
    // console.log(`Delete row ${index}`);
  };

  return (
    <tr className={`odd:bg-white even:bg-gray-50 ${styles.responsiveRow}`}>
      <td className={styles.responsiveCell}>{data.platform}</td>
      <td className={styles.responsiveCell}>{data.type}</td>
      <td className={styles.responsiveCell}>{data.owner}</td>
      <td className={styles.responsiveCell}>{formattedInvestedAmount}</td>
      <td className={styles.responsiveCell}>{formattedCurrentAmount}</td>
      <td className={styles.responsiveCell}>{formattedAbsoluteReturnAmount}</td>
      <td className={styles.responsiveCell}>{formattedAbsoluteReturnPercentage}</td>
      <td className={`${styles.responsiveCell} flex justify-center space-x-2`}>
        <button
          onClick={handleEdit}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default TrackerTableRow;
