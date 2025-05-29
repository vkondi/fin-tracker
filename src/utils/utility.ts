import {
  CategoryWiseSummary,
  FinanceFormDataType,
  MemberWiseSummary,
} from "@/components/component.types";
import { CHART_COLORS } from "./constants";

export const formattedAmount = (amount: number) => {
  // Check if the amount has fractional paise (cents)
  const hasFractionalPart = amount % 1 !== 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hasFractionalPart ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Shuffles the array in-place (modifies the original).
 * @param {Array} array - The array to shuffle.
 * @return {Array} - The same array (shuffled).
 */
export function shuffleArrayInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap in-place
  }
  return array;
}

export const constructMemberWiseData = (
  financeData: FinanceFormDataType[]
): MemberWiseSummary[] => {
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
          fill: "",
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

  return Object.keys(data).map((name) => {
    return {
      ...data[name],
      fill: getUniqueColor(),
    };
  });
};

export const constructCategoryWiseData = (
  financeData: FinanceFormDataType[]
): CategoryWiseSummary[] => {
  const data = financeData.reduce(
    (prev: Record<string, CategoryWiseSummary>, curr) => {
      const category = curr?.category;
      if (!category) return prev;

      if (!prev[category]) {
        prev[category] = {
          category,
          totalInvestedAmount: 0,
          totalCurrentAmount: 0,
          totalAbsReturn: 0,
          totalAbsReturnPercentage: 0,
          fill: CHART_COLORS[Object.keys(prev).length % CHART_COLORS.length],
        };
      }

      prev[category].totalInvestedAmount +=
        parseFloat(curr?.investedAmount.toString()) ?? 0;
      prev[category].totalCurrentAmount +=
        parseFloat(curr?.currentAmount.toString()) ?? 0;
      prev[category].totalAbsReturn =
        prev[category].totalCurrentAmount - prev[category].totalInvestedAmount;
      prev[category].totalAbsReturnPercentage =
        Math.round(
          (prev[category].totalAbsReturn / prev[category].totalInvestedAmount) *
            100 *
            100
        ) / 100;

      return prev;
    },
    {} as Record<string, CategoryWiseSummary>
  );

  return Object.values(data);
};

const usedColors = new Set<string>();
export const getUniqueColor = (): string => {
  // Find first unused color
  for (const color of CHART_COLORS) {
    if (!usedColors.has(color)) {
      usedColors.add(color);
      return color;
    }
  }

  // Fallback: Reset or cycle (optional)
  usedColors.clear();
  return getUniqueColor();
};

// Release a color when no longer needed
export const releaseColor = (color: string) => {
  usedColors.delete(color);
};
