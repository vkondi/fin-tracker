import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRootContext } from "@/context/RootContext";
import styles from "./TrackerTable.module.css";

const data = [
  {
    platform: "Platform A",
    type: "Stock",
    owner: "John Doe",
    investedAmount: 1000,
    currentAmount: 1200,
    absReturn: 200,
    absReturnPercentage: "20%",
  },
  {
    platform: "Platform B",
    type: "Crypto",
    owner: "Jane Smith",
    investedAmount: 500,
    currentAmount: 450,
    absReturn: -50,
    absReturnPercentage: "-10%",
  },
];

const TrackerTable = () => {
  const { showFinanceForm } = useRootContext();

  const handleAddNew = () => {
    showFinanceForm("add");
  };

  const handleEdit = (index: number) => {
    console.log(`Edit row ${index}`);
  };

  const handleDelete = (index: number) => {
    console.log(`Delete row ${index}`);
  };

  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg shadow-md bg-white w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Finance Tracker</h2>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className={styles.hiddenThead}>
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
              <th className="border border-gray-300 px-4 py-2">Abs Return %</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`odd:bg-white even:bg-gray-50 ${styles.responsiveRow}`}
              >
                <td className={styles.responsiveCell}>{row.platform}</td>
                <td className={styles.responsiveCell}>{row.type}</td>
                <td className={styles.responsiveCell}>{row.owner}</td>
                <td className={styles.responsiveCell}>${row.investedAmount}</td>
                <td className={styles.responsiveCell}>${row.currentAmount}</td>
                <td className={styles.responsiveCell}>${row.absReturn}</td>
                <td className={styles.responsiveCell}>
                  {row.absReturnPercentage}
                </td>
                <td
                  className={`${styles.responsiveCell} flex justify-center space-x-2`}
                >
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackerTable;
