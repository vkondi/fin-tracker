import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CustomTooltip from './CustomTooltip';
import { formattedAmount } from '@/utils/utility';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

// Use real utility or mock it. Since it relies on Intl, real is fine, but we can mock for consistency.
// But since previous tests mocked it, maybe stick to pattern.
// However, CustomTooltip uses formattedAmount directly. 
// Let's use real implementation for integration or mock if needed.
// Given it's a simple pure function, we can rely on real implementation or standard mock.

describe('CustomTooltip', () => {
    it('should render tooltip content when active', () => {
        const payload: Payload<number, string>[] = [{
            payload: { name: 'Stocks', value: 50 },
            value: 50,
            name: 'Stocks',
            dataKey: 'value' 
        }];

        render(<CustomTooltip total={100} active={true} payload={payload} />);
        
        // 50 / 100 = 50.00%
        expect(screen.getByText('Stocks (50.00%)')).toBeInTheDocument();
        // formattedAmount(50) -> check presence.
        // If we don't mock formattedAmount, it returns currency string.
        // We can just check that *some* currency text is there, or check calling formattedAmount.
        const formatted = formattedAmount(50);
        expect(screen.getByText(formatted)).toBeInTheDocument();
    });

    it('should not render anything if not active', () => {
        const payload: Payload<number, string>[] = [{
            payload: { name: 'Stocks', value: 50 },
            value: 50,
            name: 'Stocks',
            dataKey: 'value'
        }];

        const { container } = render(<CustomTooltip total={100} active={false} payload={payload} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should not render anything if payload is empty', () => {
        const { container } = render(<CustomTooltip total={100} active={true} payload={[]} />);
        expect(container).toBeEmptyDOMElement();
    });
});
