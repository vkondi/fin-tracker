"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FinanceFormDataType } from "../component.types";
import { useRootContext } from "@/context/RootContext";

const formDefaultState: FinanceFormDataType = {
  platform: "",
  type: "None",
  owner: "",
  investedAmount: 0,
  currentAmount: 0,
};

const FinanceFormPopup = () => {
  const {
    financePopupState: { isVisible, mode, data: editData },
    hideFinanceForm,
    addFinance,
    updateFinance,
    loading,
  } = useRootContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const title = mode === "add" ? "Add New Finance" : "Edit Finance";
  const buttonText = mode === "add" ? "Add" : "Update";
  const [formData, setFormData] =
    useState<FinanceFormDataType>(formDefaultState);

  const closePopup = () => {
    setFormData(formDefaultState); // Reset form data to default state
    hideFinanceForm(); // Call the hideFinanceForm function to close the popup
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      closePopup();
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "investedAmount" || name === "currentAmount"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (mode === "add") {
      addFinance(formData)
        .then((res) => {
          if (res.success) {
            alert("Finance record added successfully!");
            closePopup();
          } else {
            alert("Failed to add finance record: " + res.message);
            console.error("Failed to add finance record:", res.message);
          }
        })
        .catch((error) => {
          console.error("Error adding finance record:", error);
        });
    }

    if (mode === "edit") {
      updateFinance(formData)
        .then((res) => {
          if (res.success) {
            alert("Finance record updated successfully!");
            closePopup();
          } else {
            alert("Failed to uupdate finance record: " + res.message);
            console.error("Failed to update finance record:", res.message);
          }
        })
        .catch((error) => {
          console.error("Error updating finance record:", error);
        });
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  if (!isVisible) return null; // Don't render if not visible

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Overlay Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Platform</label>
            <input
              type="text"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="Equity">Equity</option>
              <option value="MF">MF</option>
              <option value="None">None</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Owner</label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Invested Amount
            </label>
            <input
              type="number"
              name="investedAmount"
              value={formData.investedAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Current Amount
            </label>
            <input
              type="number"
              name="currentAmount"
              value={formData.currentAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Overlay Footer */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closePopup}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default FinanceFormPopup;
