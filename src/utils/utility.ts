import {
  FinanceFormDataType,
  MemberWiseSummary,
} from "@/components/component.types";

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
    };
  });
};
