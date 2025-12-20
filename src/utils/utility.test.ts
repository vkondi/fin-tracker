import { describe, it, expect } from 'vitest';
import { 
  formattedAmount, 
  shuffleArrayInPlace, 
  constructMemberWiseData, 
  constructCategoryWiseData,
  getUniqueColor
} from './utility';
import { FinanceFormDataType } from '@/components/component.types';

describe('formattedAmount', () => {
  it('should format integer amount to have no decimal places', () => {
    // 100 -> ₹100
    const result = formattedAmount(100);
    // Use replace/regex to handle potential non-breaking spaces or different currency symbols in environment
    expect(result.replace(/\s/g, '')).toMatch(/100$/); 
  });

  it('should format decimal amount with 2 decimal places', () => {
    // 123.45 -> ₹123.45
    expect(formattedAmount(123.45)).toMatch(/123.45/);
  });

  it('should format amount with 1 decimal place to 2 decimal places', () => {
    // 100.5 -> ₹100.50
    expect(formattedAmount(100.5)).toMatch(/100.50/);
  });

  it('should handles zero', () => {
    expect(formattedAmount(0).replace(/\s/g, '')).toMatch(/0$/);
  });
});

describe('shuffleArrayInPlace', () => {
  it('should shuffle array and retain logic elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const originalArr = [...arr];
    const shuffled = shuffleArrayInPlace(arr);
    
    // Check lengths
    expect(shuffled).toHaveLength(originalArr.length);
    // Check elements existence
    originalArr.forEach(item => {
      expect(shuffled).toContain(item);
    });
    // Note: It's possible for shuffled array to end up same order as original,
    // so strictly expecting not.toEqual might be flaky. 
    // Just verifying in-place modification and content.
    expect(shuffled).toBe(arr); // It returns same reference
  });
});

describe('Data Construction Helpers', () => {
  const mockFinanceData: FinanceFormDataType[] = [
    {
      id: "1",
      owner: "Alice",
      category: "Stocks",
      platform: "Zerodha",
      type: "Equity",
      investedAmount: 1000,
      currentAmount: 1200,
      updatedDate: "2023-01-01"
    },
    {
      id: "2",
      owner: "Alice",
      category: "Stocks",
      platform: "Tijori",
      type: "Equity",
      investedAmount: 500,
      currentAmount: 550,
      updatedDate: "2023-01-02"
    },
    {
      id: "3",
      owner: "Bob",
      category: "MF",
      platform: "Groww",
      type: "SIP",
      investedAmount: 2000,
      currentAmount: 1900,
      updatedDate: "2023-01-01"
    }
  ];

  describe('constructMemberWiseData', () => {
    it('should aggregate data by owner', () => {
      const result = constructMemberWiseData(mockFinanceData);
      
      expect(result).toHaveLength(2); // Alice and Bob
      
      // Alice: 1000+500 invested, 1200+550 current
      const alice = result.find(r => r.owner === "Alice");
      expect(alice).toBeDefined();
      expect(alice?.totalInvestedAmount).toBe(1500);
      expect(alice?.totalCurrentAmount).toBe(1750);
      expect(alice?.totalAbsReturn).toBe(250);
      // Percentage: (250/1500)*100 = 16.666... -> 16.67
      expect(alice?.totalAbsReturnPercentage).toBe(16.67);
      expect(alice?.fill).toBeDefined(); // Color assigned
    });

    it('should handle single empty or missing owner entries properly', () => {
        const data = [{ ...mockFinanceData[0], owner: undefined as any }];
        const result = constructMemberWiseData(data);
        expect(result).toHaveLength(0);
    });
  });

  describe('constructCategoryWiseData', () => {
    it('should aggregate data by category', () => {
      const result = constructCategoryWiseData(mockFinanceData);
      
      expect(result).toHaveLength(2); // Stocks and MF
      
      // Stocks: 1000+500, 1200+550
      const stocks = result.find(r => r.category === "Stocks");
      expect(stocks).toBeDefined();
      expect(stocks?.totalInvestedAmount).toBe(1500);
      expect(stocks?.totalCurrentAmount).toBe(1750);
      
      // MF: 2000, 1900
      const mf = result.find(r => r.category === "MF");
      expect(mf).toBeDefined();
      expect(mf?.totalInvestedAmount).toBe(2000);
      expect(mf?.totalCurrentAmount).toBe(1900);
      expect(mf?.totalAbsReturn).toBe(-100);
    });

    it('should assign persistent colors', () => {
      const result1 = constructCategoryWiseData(mockFinanceData);
      const stocksColor1 = result1.find(r => r.category === "Stocks")?.fill;
      
      const result2 = constructCategoryWiseData(mockFinanceData);
      const stocksColor2 = result2.find(r => r.category === "Stocks")?.fill;
      
      expect(stocksColor1).toBe(stocksColor2);
    });
  });
});

describe('Colors', () => {
  it('should return a string color', () => {
    const color = getUniqueColor();
    expect(typeof color).toBe('string');
    expect(color).toMatch(/^#/);
  });

  it('should return different colors on subsequent calls', () => {
      // It might return same if shuffled array is small or refreshed, but generally should differ in small sequence
      const c1 = getUniqueColor();
      const c2 = getUniqueColor();
      // This is probabilistic if array is size 1, but for standard palettes it should differ.
      // If fails, it might be due to chance or small palette.
      // Given CHART_COLORS usually has many, this is safe.
      expect(c1).not.toBe(c2);
  });
});
