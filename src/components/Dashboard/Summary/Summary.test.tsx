import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Summary from './Summary';
import * as ROOT_CONTEXT from "@/context/RootContext";
import * as FIN_CONTEXT from "@/context/FinContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/context/FinContext", () => ({
    useFinContext: vi.fn(),
}));

vi.mock("../DashboardCard/DashboardCard", () => ({
    default: ({ children, title }: any) => <div data-testid="dashboard-card" title={title}>{children}</div>
}));

vi.mock("@/utils/utility", () => ({
    formattedAmount: (val: number) => `₹${val}`,
}));

describe('Summary', () => {
    const mockUseRootContext = ROOT_CONTEXT.useRootContext as any;
    const mockUseFinContext = FIN_CONTEXT.useFinContext as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue({ loader: { show: false } });
    });

    it('should render nothing if loading', () => {
        mockUseRootContext.mockReturnValue({ loader: { show: true } });
        mockUseFinContext.mockReturnValue({ hasNoFinanceData: false, financeSummaryData: {} });
        const { container } = render(<Summary />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render summary data', () => {
        mockUseFinContext.mockReturnValue({ 
            hasNoFinanceData: false,
            financeSummaryData: {
                totalInvested: 1000,
                totalCurrent: 1200,
                totalAbsReturn: 200,
                totalAbsReturnPercentage: 20,
                totalOwners: 2,
                totalPlatforms: 3,
            }
        });

        render(<Summary />);
        
        expect(screen.getByText('Total Current Amount')).toBeInTheDocument();
        expect(screen.getByText('₹1200')).toBeInTheDocument();
        
        expect(screen.getByText('Total Amount Invested')).toBeInTheDocument();
        expect(screen.getByText('₹1000')).toBeInTheDocument();

        expect(screen.getByText('Total Absolute Return')).toBeInTheDocument();
        expect(screen.getByText('₹200')).toBeInTheDocument(); // Positive, check class?
        
        // Check for class on positive return
        const returnVal = screen.getByText('₹200');
        expect(returnVal).toHaveClass('text-[var(--text-green)]');
    });
});
