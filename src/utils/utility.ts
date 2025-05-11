export const formattedAmount = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
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
