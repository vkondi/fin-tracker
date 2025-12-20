import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CustomLabel from './CustomLabel';
import { formattedAmount } from '@/utils/utility';

// Mock utility if needed, but formattedAmount is pure. 
// However, since it's imported, we can rely on real implementation or mock it.
// Let's rely on real implementation for now as it's simple.

describe('CustomLabel Component', () => {
    const defaultProps = {
        name: 'Test Label',
        value: 1000,
        x: 100,
        y: 100,
        percent: 0.5,
        midAngle: 0,
        fill: '#000000',
    };

    it('should render the label name', () => {
        render(<CustomLabel {...defaultProps} />);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should render the formatted percentage', () => {
        render(<CustomLabel {...defaultProps} />);
        // 0.5 * 100 = 50.00%
        expect(screen.getByText('(50.00%)')).toBeInTheDocument();
    });

    it('should render the formatted value', () => {
        render(<CustomLabel {...defaultProps} />);
        // formattedAmount(1000) -> 1,000 or similar. Best to check for partial match if unsure of exact format
        // or mock the utility. 
        // Given utility is: new Intl.NumberFormat("en-IN", ...).format(amount)
        // 1000 -> ₹1,000 (roughly)
        // We can just look for the text.
        const formatted = formattedAmount(1000);
        expect(screen.getByText(formatted)).toBeInTheDocument();
    });
});
