export type FinanceFormDataType = {
  platform: string;
  type: string;
  owner: string;
  investedAmount: number;
  currentAmount: number;
  absReturn?: number;
  absReturnPercentage?: string;
  id?: string;
};

export type FinanceFormMode = "add" | "edit" | "delete";

export type FinancePopupContextStateType = {
  isVisible: boolean;
  mode?: FinanceFormMode;
  data?: FinanceFormDataType;
};
