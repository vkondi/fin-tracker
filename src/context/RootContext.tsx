"use client";

import {
  APIResponseType,
  FinanceFormDataType,
  FinanceFormMode,
  FinancePopupContextStateType,
  FinanceRecordType,
  LoaderProps,
  MemberWiseSummary,
} from "@/components/component.types";
import { constructMemberWiseData } from "@/utils/utility";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";

type RootContextType = {
  showFinanceForm: (mode: FinanceFormMode, data?: FinanceFormDataType) => void;
  hideFinanceForm: () => void;
  financePopupState: FinancePopupContextStateType;

  addFinance: (data: FinanceFormDataType) => Promise<APIResponseType>;
  deleteFinance: (id: string) => Promise<APIResponseType>;
  updateFinance: (data: FinanceFormDataType) => Promise<APIResponseType>;
  financeData: FinanceFormDataType[];
  memberWiseData: MemberWiseSummary[];
  financeSummaryData: {
    totalInvested: number;
    totalCurrent: number;
    totalOwners: number;
    totalPlatforms: number;
    totalAbsReturn: number;
    totalAbsReturnPercentage: number;
  };
  loading: boolean;
  hasNoFinanceData: boolean;

  name?: string;
  userId?: string;
  email?: string;

  isUserRegistered?: boolean;

  isMobile: boolean;

  loader: LoaderProps;
  setLoader: Dispatch<SetStateAction<LoaderProps>>;
};

const RootContext = createContext<RootContextType | undefined>(undefined);

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [loader, setLoader] = useState<LoaderProps>({
    show: false,
  });

  const [name, setName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const { data: session } = useSession();
  const email = session?.user?.email;

  const isUserRegistered = !!email && !!name;

  const [loading, setLoading] = useState<boolean>(false);
  const [financePopupState, setFinancePopupState] =
    useState<FinancePopupContextStateType>({ isVisible: false });

  const [financeData, setFinanceData] = useState<FinanceFormDataType[]>([]);
  const memberWiseData = useMemo(
      () => constructMemberWiseData(financeData),
      [financeData]
    );
  const { totalInvested, totalCurrent, totalOwners, totalPlatforms } = useMemo(
    () =>
      financeData.reduce(
        (prev, curr) => {
          if (!prev.owners.includes(curr.owner)) {
            prev.owners.push(curr.owner);
          }
          if (!prev.platforms.includes(curr.platform)) {
            prev.platforms.push(curr.platform);
          }

          return {
            totalInvested:
              prev.totalInvested + parseFloat(curr.investedAmount.toString()),
            totalCurrent:
              prev.totalCurrent + parseFloat(curr.currentAmount.toString()),
            totalOwners: prev.owners.length,
            totalPlatforms: prev.platforms.length,
            owners: prev.owners,
            platforms: prev.platforms,
          };
        },
        {
          totalInvested: 0,
          totalCurrent: 0,
          totalOwners: 0,
          totalPlatforms: 0,
          owners: [] as string[],
          platforms: [] as string[],
        }
      ),
    [financeData]
  );

  const totalAbsReturn = useMemo(
    () => totalCurrent - totalInvested,
    [totalCurrent, totalInvested]
  );
  const totalAbsReturnPercentage = useMemo(
    () => ((totalAbsReturn / totalInvested) * 100).toFixed(2),
    [totalAbsReturn, totalInvested]
  );

  const showFinanceForm = (
    mode: FinanceFormMode,
    data?: FinanceFormDataType
  ) => {
    setFinancePopupState({ isVisible: true, mode, data });
  };

  const hideFinanceForm = () => {
    setFinancePopupState({ isVisible: false });
  };

  const getAllFinances = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/finance?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const massagedData =
        data?.data?.map((item: FinanceRecordType) => ({
          ...item,
          type: item?.platform_type,
          category: item?.platform_category,
          investedAmount: item?.amount_invested,
          currentAmount: item?.amount_current,
          updatedDate: item?.updated_date,
        })) ?? [];
      setFinanceData(massagedData);
    } catch (error) {
      console.error("[RootContext][getAllFinances] >> Exception:", error);
      debugger;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addFinance = async (
    data: FinanceFormDataType
  ): Promise<APIResponseType> => {
    setLoading(true);
    try {
      await fetch("/api/finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, userId }),
      });

      // Refresh the finance data after adding a new record
      getAllFinances();

      return { success: true, message: "Finance data added successfully!" };
    } catch (error) {
      console.error("[RootContext][addFinance] >> Exception:", error);
      return {
        success: false,
        message: "Failed to add finance data. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateFinance = async (data: FinanceFormDataType) => {
    setLoading(true);
    try {
      await fetch("/api/finance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Refresh the finance data after deleting a record
      getAllFinances();

      return { success: true, message: "Finance data updated successfully!" };
    } catch (error) {
      console.error("[RootContext][updateFinance] >> Exception:", error);

      return {
        success: false,
        message: "Failed to update finance data. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteFinance = async (id: string) => {
    setLoading(true);
    try {
      await fetch("/api/finance", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      // Refresh the finance data after deleting a record
      getAllFinances();

      return { success: true, message: "Finance data deleted successfully!" };
    } catch (error) {
      console.error("[RootContext][deleteFinance] >> Exception:", error);

      return {
        success: false,
        message: "Failed to delete finance data. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = useCallback(async () => {
    console.log("[RootContext] >> [registerUser]");

    setLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name: session?.user?.name }),
      });
      const data = await response.json();

      if (data) {
        setName(data?.data?.name ?? "");
        setUserId(data?.data?.id ?? "");
      }
    } catch (error) {
      console.error("[RootContext][registerUser] >> Exception:", error);
    } finally {
      setLoading(false);
    }
  }, [email, session?.user?.name]);

  // Fetch data only when registered user is logged in
  useEffect(() => {
    if (isUserRegistered) {
      getAllFinances();
    }
  }, [isUserRegistered, getAllFinances]);

  // Register user once email is available from session
  useEffect(() => {
    if (email && !name) {
      registerUser();
    }
  }, [email, name, registerUser]);

  useEffect(() => {
    setLoader((prev) => ({ ...prev, show: loading }));
  }, [loading]);

  return (
    <RootContext.Provider
      value={{
        // popup
        showFinanceForm,
        hideFinanceForm,
        financePopupState,

        // finance tracker
        addFinance,
        deleteFinance,
        updateFinance,
        financeData,
        memberWiseData,
        financeSummaryData: {
          totalInvested,
          totalCurrent,
          totalOwners,
          totalPlatforms,
          totalAbsReturn,
          totalAbsReturnPercentage: parseFloat(totalAbsReturnPercentage),
        },
        loading,
        hasNoFinanceData: Array.isArray(financeData) && !financeData.length,

        name,
        userId,
        email: email ?? undefined,
        isUserRegistered,

        isMobile,

        loader,
        setLoader,
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
