import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TrackerTable = () => {
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

  const handleEdit = (index: number) => {
    console.log(`Edit row ${index}`);
    // Add your edit logic here
  };

  const handleDelete = (index: number) => {
    console.log(`Delete row ${index}`);
    // Add your delete logic here
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Finance Tracker</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
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
              <th className="border border-gray-300 px-4 py-2">Abs Return %</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {row.platform}
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.type}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.owner}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${row.investedAmount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${row.currentAmount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${row.absReturn}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.absReturnPercentage}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
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
      <style jsx>{`
        @media (max-width: 768px) {
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          thead {
            display: none;
          }
          tbody tr {
            display: block;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }
          tbody td {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            border: none;
            border-bottom: 1px solid #ddd;
          }
          tbody td:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TrackerTable;
