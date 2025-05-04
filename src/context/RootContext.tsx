"use client";

import {
  APIResponseType,
  FinanceFormDataType,
  FinanceFormMode,
  FinancePopupContextStateType,
  FinanceRecordType,
} from "@/components/component.types";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type RootContextType = {
  showFinanceForm: (mode: FinanceFormMode, data?: FinanceFormDataType) => void;
  hideFinanceForm: () => void;
  financePopupState: FinancePopupContextStateType;

  addFinance: (data: FinanceFormDataType) => Promise<APIResponseType>;
  financeData: FinanceFormDataType[];
  loading: boolean;

  name?: string;
  userId?: string;
  email?: string;

  isUserRegistered?: boolean;
};

const RootContext = createContext<RootContextType | undefined>(undefined);

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const { data: session } = useSession();
  const email = session?.user?.email;

  const isUserRegistered = !!email && !!name;

  const [loading, setLoading] = useState<boolean>(false);
  const [financePopupState, setFinancePopupState] =
    useState<FinancePopupContextStateType>({ isVisible: false });

  const [financeData, setFinanceData] = useState<FinanceFormDataType[]>([]);

  const showFinanceForm = (
    mode: FinanceFormMode,
    data?: FinanceFormDataType
  ) => {
    setFinancePopupState({ isVisible: true, mode, data });
  };

  const hideFinanceForm = () => {
    setFinancePopupState({ isVisible: false });
  };

  const getAllFinances = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/finance?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const massagedData = data?.data?.map((item: FinanceRecordType) => ({
        ...item,
        investedAmount: item?.amount_invested,
        currentAmount: item?.amount_current,
      }));
      setFinanceData(massagedData);
    } catch (error) {
      console.error("[RootContext][getAllFinances] >> Exception:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFinance = async (
    data: FinanceFormDataType
  ): Promise<APIResponseType> => {
    setLoading(true);
    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, userId }),
      });
      const result = await response.json();
      // if (result) {
      //   setFinanceData((prev) => [...prev, data]);
      // }

      getAllFinances(); // Refresh the finance data after adding a new record

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

  // const updateFinance = (data: FinanceFormDataType) => {
  //   // setFinanceData((prev) => [...prev, newData]);
  // };

  // const deleteFinance = (id: string) => {
  //   // setFinanceData((prev) => [...prev, newData]);
  // };

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
  }, [isUserRegistered]);

  // Register user once email is available from session
  useEffect(() => {
    if (email && !name) {
      registerUser();
    }
  }, [email, name, registerUser]);

  return (
    <RootContext.Provider
      value={{
        // popup
        showFinanceForm,
        hideFinanceForm,
        financePopupState,

        // finance tracker
        addFinance,
        financeData,
        loading,

        name,
        userId,
        email: email ?? undefined,
        isUserRegistered,
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
