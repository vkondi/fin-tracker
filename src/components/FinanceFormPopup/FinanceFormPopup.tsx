"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FinanceFormDataType } from "../component.types";
import { useRootContext } from "@/context/RootContext";
import { LiaWindowCloseSolid } from "react-icons/lia";
import { useFinContext } from "@/context/FinContext";

const formDefaultState: FinanceFormDataType = {
  platform: "",
  type: "",
  category: "",
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
    loader: { show: loading },
    isMobile,
    setLoader,
    toast,
    platforms,
  } = useRootContext();
  const { updateFinance, deleteFinance, addFinance } = useFinContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const title = mode && modeDetails[mode].title;
  const buttonText = mode && modeDetails[mode].buttonText;
  const [formData, setFormData] =
    useState<FinanceFormDataType>(formDefaultState);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);

  const category = useMemo(
    () =>
      formData?.platform
        ? (platforms ?? []).find((rec) => rec.name === formData.platform)
          ?.category
        : null,
    [formData?.platform, platforms]
  ); // Retrive "category" based on selected "platform"
  const isValidForm = useMemo(
    () =>
      !!formData?.platform &&
      !!category &&
      !!formData?.type &&
      !!formData?.owner &&
      (formData?.investedAmount ?? 0) > 0,
    [formData, category]
  ); // Validates form before submit

  const closePopup = useCallback(() => {
    setFormData(formDefaultState); // Reset form data to default state
    hideFinanceForm(); // Call the hideFinanceForm function to close the popup
  }, [hideFinanceForm]);

  const handleClickOutside = () => {
    closePopup();
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

      if (mode === "add" && category) {
        setLoader({ show: true, loadingMessage: "Adding finance record..." });
        addFinance({ ...formData, category })
          .then((res) => {
            if (res.success) {
              closePopup();

              toast.success("Finance record added successfully!", {
                position: "bottom-center",
              });
            } else {
              toast.error(`Failed to add finance record: ${res.message}`, {
                position: "bottom-center",
              });

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

      if (mode === "edit" && category) {
        setLoader({ show: true, loadingMessage: "Updating finance record..." });

        updateFinance({ ...formData, category })
          .then((res) => {
            if (res.success) {
              closePopup();
              toast.success("Finance record updated successfully!", {
                position: "bottom-center",
              });
            } else {
              toast.error(`Failed to update finance record: ${res.message}`, {
                position: "bottom-center",
              });
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

              toast.success("Finance record deleted successfully!", {
                position: "bottom-center",
              });
            } else {
              toast.error(`Failed to delete finance record: ${res.message}`, {
                position: "bottom-center",
              });
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
      category,
      closePopup,
      setLoader,
      toast,
    ]
  );

  const renderAddEditView = useCallback(() => {
    return (
      <div
        className={`bg-white shadow-lg p-6 relative overflow-y-auto ${isMobile ? "w-full h-full" : "w-96 rounded-lg"
          }`}
      >
        {/* Overlay Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close form"
          >
            <LiaWindowCloseSolid size={35} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Platform */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="platform">Platform</label>
            <select
              name="platform"
              id="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="" disabled>
                Select a platform
              </option>
              {(platforms ?? []).map(({ name }, index) => (
                <option value={name} key={index}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Type/Instruments */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="type">Type/Instruments</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="" disabled>
                Select a type
              </option>
              {typeOptions.map((value, index) => (
                <option value={value} key={index}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Owner */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="owner">Owner</label>
            <input
              type="text"
              name="owner"
              id="owner"
              value={formData.owner}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Invested Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="investedAmount">Invested Amount</label>
            <input
              type="number"
              name="investedAmount"
              id="investedAmount"
              value={formData.investedAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Current Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="currentAmount">Current Amount</label>
            <input
              type="number"
              name="currentAmount"
              id="currentAmount"
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
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              disabled={loading || !isValidForm}
              type="submit"
              className="bg-[var(--primary-btn)] text-white px-4 py-2 rounded hover:bg-[var(--primary-btn-hover)] disabled:bg-[var(--primary-btn-hover)]"
              aria-label={buttonText}
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
    typeOptions,
    isValidForm,
    platforms,
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
            aria-label="Close form"
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
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800"
              aria-label={buttonText}
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

  useEffect(() => {
    if (formData.platform) {
      const value = (platforms ?? []).find(
        (rec) => rec.name === formData.platform
      );
      if (value) {
        setTypeOptions(value?.instruments ?? []);
      }
    }
  }, [formData.platform, platforms]);

  // Don't render if not visible
  if (!isVisible) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isMobile ? "z-1000" : "z-50"
        }`}
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 w-full h-full bg-transparent cursor-default"
        style={{ zIndex: 1 }}
        onClick={handleClickOutside}
      />
      <div style={{ zIndex: 2, position: 'relative' }}>
        {mode === "delete" ? renderDeleteView() : renderAddEditView()}
      </div>
    </div>,
    document.body
  );
};

export default FinanceFormPopup;
