import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MembersCard from './MembersCard';
import * as ROOT_CONTEXT from "@/context/RootContext";
import * as FIN_CONTEXT from "@/context/FinContext";

import { RootContextType } from "@/context/RootContext";
import { FinContextType } from "@/context/FinContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/context/FinContext", () => ({
    useFinContext: vi.fn(),
}));

vi.mock("../DashboardCard/DashboardCard", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="dashboard-card">{children}</div>
}));

// Mock utility
vi.mock("@/utils/utility", () => ({
    formattedAmount: (val: number) => `₹${val}`,
}));

describe('MembersCard', () => {
    const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);
    const mockUseFinContext = vi.mocked(FIN_CONTEXT.useFinContext);

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue({
            loader: { show: false },
            isMobile: false
        } as unknown as RootContextType);
    });

    it('should render nothing if loading', () => {
        mockUseRootContext.mockReturnValue({
            loader: { show: true },
            isMobile: false
        } as unknown as RootContextType);
        mockUseFinContext.mockReturnValue({ memberWiseData: [], hasNoFinanceData: false } as unknown as FinContextType);

        const { container } = render(<MembersCard />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render nothing if no data', () => {
        mockUseRootContext.mockReturnValue({
            loader: { show: false },
            isMobile: false
        } as unknown as RootContextType);
        mockUseFinContext.mockReturnValue({ memberWiseData: [], hasNoFinanceData: true } as unknown as FinContextType);

        const { container } = render(<MembersCard />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render members data sorted by current amount', () => {
        const mockData = [
            {
                owner: 'Alice',
                totalCurrentAmount: 1000,
                totalInvestedAmount: 800,
                totalAbsReturn: 200,
                totalAbsReturnPercentage: 25,
                fill: 'red'
            },
            {
                owner: 'Bob',
                totalCurrentAmount: 2000,
                totalInvestedAmount: 1500,
                totalAbsReturn: 500,
                totalAbsReturnPercentage: 33.33,
                fill: 'blue'
            }
        ];

        mockUseFinContext.mockReturnValue({
            memberWiseData: mockData,
            hasNoFinanceData: false
        } as unknown as FinContextType);

        render(<MembersCard />);

        // Bob should be first (2000 > 1000)
        const names = screen.getAllByText(/Alice|Bob/);
        expect(names[0]).toHaveTextContent('Bob');
        expect(names[1]).toHaveTextContent('Alice');

        // Check values rendering
        expect(screen.getByText('₹2000')).toBeInTheDocument();
        expect(screen.getByText('₹1000')).toBeInTheDocument();
        expect(screen.getByText('(33.33%)')).toBeInTheDocument();
    });
});
