"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FinanceFormDataType } from "../component.types";
import { useRootContext } from "@/context/RootContext";
import { LiaWindowCloseSolid } from "react-icons/lia";

const formDefaultState: FinanceFormDataType = {
  platform: "",
  type: "None",
  owner: "",
  investedAmount: 0,
  currentAmount: 0,
};

const modeDetails = {
  add: {
    title: "Add New Finance",
    buttonText: "Add",
  },
  edit: {
    title: "Edit Finance",
    buttonText: "Update",
  },
  delete: {
    title: "Delete Finance",
    buttonText: "Delete",
  },
};

const FinanceFormPopup = () => {
  const {
    financePopupState: { isVisible, mode, data: financeData },
    hideFinanceForm,
    addFinance,
    updateFinance,
    deleteFinance,
    loading,
    isMobile,
    setLoader,
  } = useRootContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const title = mode && modeDetails[mode].title;
  const buttonText = mode && modeDetails[mode].buttonText;
  const [formData, setFormData] =
    useState<FinanceFormDataType>(formDefaultState);

  const closePopup = useCallback(() => {
    setFormData(formDefaultState); // Reset form data to default state
    hideFinanceForm(); // Call the hideFinanceForm function to close the popup
  }, [hideFinanceForm]);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      closePopup();
    }
  };

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "investedAmount" || name === "currentAmount"
            ? parseFloat(value)
            : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (mode === "add") {
        setLoader({ show: true, loadingMessage: "Adding finance record..." });
        addFinance(formData)
          .then((res) => {
            if (res.success) {
              closePopup();
              alert("Finance record added successfully!");
            } else {
              alert("Failed to add finance record: " + res.message);
              console.error("Failed to add finance record:", res.message);
            }
          })
          .catch((error) => {
            console.error("Error adding finance record:", error);
          })
          .finally(() => {
            setLoader({ show: false }); // Hide loader after operation
          });
      }

      if (mode === "edit") {
        setLoader({ show: true, loadingMessage: "Updating finance record..." });

        updateFinance(formData)
          .then((res) => {
            if (res.success) {
              closePopup();
              alert("Finance record updated successfully!");
            } else {
              alert("Failed to uupdate finance record: " + res.message);
              console.error("Failed to update finance record:", res.message);
            }
          })
          .catch((error) => {
            console.error("Error updating finance record:", error);
          })
          .finally(() => {
            setLoader({ show: false }); // Hide loader after operation
          });
      }

      if (mode === "delete" && financeData?.id) {
        setLoader({ show: true, loadingMessage: "Deleting record..." });

        deleteFinance(financeData.id!)
          .then((res) => {
            if (res.success) {
              closePopup();
              alert("Finance record deleted successfully!");
            } else {
              alert("Failed to delete finance record: " + res.message);
              console.error("Failed to delete finance record:", res.message);
            }
          })
          .catch((error) => {
            console.error("Error deleting finance record:", error);
          })
          .finally(() => {
            setLoader({ show: false }); // Hide loader after operation
          });
      }
    },
    [
      addFinance,
      updateFinance,
      deleteFinance,
      financeData,
      mode,
      formData,
      closePopup,
      setLoader,
    ]
  );

  const renderAddEditView = useCallback(() => {
    return (
      <div
        className={`bg-white shadow-lg p-6 relative overflow-y-auto ${
          isMobile ? "w-full h-full" : "w-96 rounded-lg"
        }`}
      >
        {/* Overlay Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700"
          >
            <LiaWindowCloseSolid size={35} />
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
              className="bg-[var(--primary-btn)] text-white px-4 py-2 rounded hover:bg-[var(--primary-btn-hover)]"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    );
  }, [
    formData,
    loading,
    title,
    buttonText,
    isMobile,
    closePopup,
    handleSubmit,
    handleChange,
  ]);

  const renderDeleteView = useCallback(() => {
    const deleteMessage = `Are you sure you want to delete "${financeData?.platform}" of "${financeData?.owner}"?`;

    return (
      <div className="bg-white shadow-lg p-6 relative overflow-y-auto w-fit rounded-lg">
        {/* Overlay Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700"
          >
            <LiaWindowCloseSolid size={35} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {deleteMessage}
            </label>
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
              className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    );
  }, [
    loading,
    title,
    buttonText,
    closePopup,
    handleSubmit,
    financeData?.platform,
    financeData?.owner,
  ]);

  // Prepopulates data for edit mode
  useEffect(() => {
    if (financeData) {
      setFormData(financeData);
    }
  }, [financeData]);

  // Don't render if not visible
  if (!isVisible) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
        isMobile ? "z-1000" : "z-50"
      }`}
      onClick={handleClickOutside}
    >
      {mode === "delete" ? renderDeleteView() : renderAddEditView()}
    </div>,
    document.body
  );
};

export default FinanceFormPopup;
