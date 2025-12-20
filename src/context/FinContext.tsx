"use client";

import {
  APIResponseType,
  FinanceFormDataType,
  FinanceRecordType,
  MemberWiseSummary,
} from "@/components/component.types";
import { getRandomColor } from "@/utils/utility";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRootContext } from "./RootContext";

export type FinContextType = {
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
  hasNoFinanceData: boolean;
};

const FinContext = createContext<FinContextType | undefined>(undefined);

export const FinProvider = ({ children }: { children: ReactNode }) => {
  const { isUserRegistered, userId, setLoader } = useRootContext();

  const [financeData, setFinanceData] = useState<FinanceFormDataType[]>([]);
  const ownerColorMapRef = useRef<Map<string, string>>(new Map());

  // Get or assign a color for an owner
  const getOwnerColor = useCallback((owner: string) => {
    if (ownerColorMapRef.current.has(owner)) {
      return ownerColorMapRef.current.get(owner)!;
    }

    // Assign a random color
    const randomColor = getRandomColor();
    ownerColorMapRef.current.set(owner, randomColor);
    return randomColor;
  }, []);

  const memberWiseData = useMemo(() => {
    const data = financeData.reduce(
      (prev: Record<string, MemberWiseSummary>, curr) => {
        const owner = curr?.owner;
        if (!owner) return prev;

        if (!prev[owner]) {
          prev[owner] = {
            owner,
            totalInvestedAmount: 0,
            totalCurrentAmount: 0,
            totalAbsReturn: 0,
            totalAbsReturnPercentage: 0,
            fill: getOwnerColor(owner),
          };
        }

        prev[owner].totalInvestedAmount +=
          parseFloat(curr?.investedAmount.toString()) ?? 0;
        prev[owner].totalCurrentAmount +=
          parseFloat(curr?.currentAmount.toString()) ?? 0;
        prev[owner].totalAbsReturn =
          prev[owner].totalCurrentAmount - prev[owner].totalInvestedAmount;
        prev[owner].totalAbsReturnPercentage =
          Math.round(
            (prev[owner].totalAbsReturn / prev[owner].totalInvestedAmount) *
            100 *
            100
          ) / 100;

        return prev;
      },
      {} as Record<string, MemberWiseSummary>
    );

    return Object.values(data);
  }, [financeData, getOwnerColor]);

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

  const getAllFinances = useCallback(async () => {
    setLoader({ show: true });
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
      console.error("[FinContext][getAllFinances] >> Exception:", error);
    } finally {
      setLoader({ show: false });
    }
  }, [userId, setLoader]);

  const addFinance = async (
    data: FinanceFormDataType
  ): Promise<APIResponseType> => {
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
      console.error("[FinContext][addFinance] >> Exception:", error);
      return {
        success: false,
        message: "Failed to add finance data. Please try again.",
      };
    }
  };

  const updateFinance = async (data: FinanceFormDataType) => {
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
      console.error("[FinContext][updateFinance] >> Exception:", error);

      return {
        success: false,
        message: "Failed to update finance data. Please try again.",
      };
    }
  };

  const deleteFinance = async (id: string) => {
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
      console.error("[FinContext][deleteFinance] >> Exception:", error);

      return {
        success: false,
        message: "Failed to delete finance data. Please try again.",
      };
    }
  };

  // Fetch data only when registered user is logged in
  useEffect(() => {
    if (isUserRegistered) {
      getAllFinances();
    }
  }, [isUserRegistered, getAllFinances]);

  return (
    <FinContext.Provider
      value={{
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
        hasNoFinanceData: Array.isArray(financeData) && !financeData.length,
      }}
    >
      {children}
    </FinContext.Provider>
  );
};

export const useFinContext = () => {
  const context = useContext(FinContext);
  if (!context)
    throw new Error("useFinContext must be used within a FinProvider");

  return context;
};
