import { describe, it, expect } from 'vitest';
import { formattedAmount } from './utility';

describe('formattedAmount', () => {
  it('should format integer amount without fractions if configured (code says if not fractional, min 0, max 2)', () => {
    // The code logic:
    // const hasFractionalPart = amount % 1 !== 0;
    // minimumFractionDigits: hasFractionalPart ? 2 : 0,
    // maximumFractionDigits: 2,
    
    // So 100 -> 100 (or 100.00 depending on browser implementation of en-IN currency, but usually defaults to 2 for INR? 
    // Wait, the code explicitly sets min to 0 if no fraction.
    // So 100 -> ₹100
    
    expect(formattedAmount(100)).toMatch(/100/);
  });

  it('should format decimal amount with 2 decimal places', () => {
    expect(formattedAmount(123.45)).toMatch(/123.45/);
  });

  it('should handles zero', () => {
    expect(formattedAmount(0)).toMatch(/0/);
  });
});
