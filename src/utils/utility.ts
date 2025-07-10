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

// Persistent category color mapping for session
let categoryColorMap = new Map<string, string>();

export const constructCategoryWiseData = (
  financeData: FinanceFormDataType[]
): CategoryWiseSummary[] => {
  const data = financeData.reduce(
    (prev: Record<string, CategoryWiseSummary>, curr) => {
      const category = curr?.category;
      if (!category) return prev;

      if (!prev[category]) {
        // Get or assign persistent color for category
        let categoryColor = categoryColorMap.get(category);
        if (!categoryColor) {
          categoryColor = getRandomColor();
          categoryColorMap.set(category, categoryColor);
        }

        prev[category] = {
          category,
          totalInvestedAmount: 0,
          totalCurrentAmount: 0,
          totalAbsReturn: 0,
          totalAbsReturnPercentage: 0,
          fill: categoryColor,
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

// Session-based color management
let shuffledColors: string[] = [];
let usedColors = new Set<string>();

export const getRandomColor = (): string => {
  // Initialize shuffled colors if empty
  if (shuffledColors.length === 0) {
    shuffledColors = [...CHART_COLORS];
    shuffleArrayInPlace(shuffledColors);
  }
  
  // Find first unused color from shuffled array
  for (let i = 0; i < shuffledColors.length; i++) {
    const color = shuffledColors[i];
    if (!usedColors.has(color)) {
      usedColors.add(color);
      return color;
    }
  }
  
  // If all colors are used, reshuffle and start over
  usedColors.clear();
  shuffledColors = [...CHART_COLORS];
  shuffleArrayInPlace(shuffledColors);
  const color = shuffledColors[0];
  usedColors.add(color);
  return color;
};

export const getUniqueColor = (): string => {
  return getRandomColor();
};

// Release a color when no longer needed
export const releaseColor = (color: string) => {
  usedColors.delete(color);
};

// Reset all color mappings (call this when session ends or app reloads)
export const resetColorMappings = () => {
  usedColors.clear();
  shuffledColors = [];
  categoryColorMap.clear();
};
