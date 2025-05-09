import { FaEdit, FaTrash } from "react-icons/fa";
import { FinanceFormDataType } from "../component.types";
import styles from "./TrackerTable.module.css";
import { useRootContext } from "@/context/RootContext";

function calculateAbsoluteReturn(
  investedAmount: number,
  currentAmount: number
) {
  const absoluteReturn =
    ((currentAmount - investedAmount) / investedAmount) * 100;
  return absoluteReturn.toFixed(2); // Returns with 2 decimal places
}

const TrackerTableRow = ({ data }: { data: FinanceFormDataType }) => {
  const { deleteFinance, loading, showFinanceForm } = useRootContext();

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
    parseFloat(abosulteReturnAmount)
  );

  const handleEdit = () => {
    showFinanceForm("edit", data);
  };

  const handleDelete = () => {
    deleteFinance(data.id!)
      .then((res) => {
        if (res.success) {
          alert("Finance record deleted successfully!");
        } else {
          alert("Failed to delete finance record: " + res.message);
          console.error("Failed to delete finance record:", res.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting finance record:", error);
      });
  };

  return (
    <tr className={`odd:bg-white even:bg-gray-50 ${styles.responsiveRow}`}>
      <td className={styles.responsiveCell}>{data.platform}</td>
      <td className={styles.responsiveCell}>{data.type}</td>
      <td className={styles.responsiveCell}>{data.owner}</td>
      <td className={styles.responsiveCell}>{formattedInvestedAmount}</td>
      <td className={styles.responsiveCell}>{formattedCurrentAmount}</td>
      <td className={styles.responsiveCell}>{formattedAbsoluteReturnAmount}</td>
      <td className={styles.responsiveCell}>
        {formattedAbsoluteReturnPercentage}
      </td>
      <td className={`${styles.responsiveCell} flex justify-center space-x-2`}>
        <button
          onClick={handleEdit}
          disabled={loading}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default TrackerTableRow;
