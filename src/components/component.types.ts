export type FinanceFormDataType = {
  updatedDate?: string;
  platform: string;
  type: string;
  category: string;
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
  platform_category: string;
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

export type LoaderProps = {
  show: boolean;
  loadingMessage?: string;
};

export type SectionWiseSummary = {
  totalInvestedAmount: number;
  totalCurrentAmount: number;
  totalAbsReturn: number;
  totalAbsReturnPercentage: number;
  fill: string;
};

export type MemberWiseSummary = SectionWiseSummary & {
  owner: string;
};

export type CategoryWiseSummary = SectionWiseSummary & {
  category: string;
};
