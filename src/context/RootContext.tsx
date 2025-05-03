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
