"use client";

import {
  FinanceFormDataType,
  FinanceFormMode,
  FinancePopupContextStateType,
} from "@/components/component.types";
import { createContext, ReactNode, useContext, useState } from "react";

type RootContextType = {
  showFinanceForm: (mode: FinanceFormMode, data?: FinanceFormDataType) => void;
  hideFinanceForm: () => void;
  financePopupState: FinancePopupContextStateType;

  financeData: FinanceFormDataType[];
};

const RootContext = createContext<RootContextType | undefined>(undefined);

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const [financePopupState, setFinancePopupState] =
    useState<FinancePopupContextStateType>({ isVisible: false });

  const showFinanceForm = (
    mode: FinanceFormMode,
    data?: FinanceFormDataType
  ) => {
    setFinancePopupState({ isVisible: true, mode, data });
  };

  const hideFinanceForm = () => {
    setFinancePopupState({ isVisible: false });
  };

  return (
    <RootContext.Provider
      value={{
        showFinanceForm,
        hideFinanceForm,
        financePopupState,

        financeData: [
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
        ], // Placeholder for finance data
      }}
    >
      {children}
    </RootContext.Provider>
  );
};

export const useRootContext = () => {
  const context = useContext(RootContext);
  if (!context)
    throw new Error("useRootContext must be used within a RootProvider");

  return context;
};
