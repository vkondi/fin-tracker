export type FinanceFormDataType = {
  updatedDate?: string;
  platform: string;
  type: string;
  owner: string;
  investedAmount: number;
  currentAmount: number;
  absReturn?: number;
  absReturnPercentage?: string;
  id?: string;
};

export type FinanceRecordType = {
  platform: string;
  platform_type: string;
  amount_invested: number;
  amount_current: number;
  updated_date: Date;
  owner: string;
};

export type FinanceFormMode = "add" | "edit" | "delete";

export type FinancePopupContextStateType = {
  isVisible: boolean;
  mode?: FinanceFormMode;
  data?: FinanceFormDataType;
};

export type APIResponseType = { success: boolean; message?: string };
