import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryDistribution from './CategoryDistribution';
import * as ROOT_CONTEXT from "@/context/RootContext";
import * as FIN_CONTEXT from "@/context/FinContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/context/FinContext", () => ({
    useFinContext: vi.fn(),
}));

// Mock child component
vi.mock("../DistributionChartTable/DistributionChartTable", () => ({
    default: ({ title, chartData }: any) => (
        <div data-testid="distribution-chart-table">
            <h1>{title}</h1>
            <ul>
                {chartData.map((item: any, idx: number) => (
                    <li key={idx} data-testid="chart-item">{item.name} - {item.valueFormatted} ({item.percentFormatted})</li>
                ))}
            </ul>
        </div>
    ),
}));

vi.mock("@/utils/utility", () => ({
    constructCategoryWiseData: vi.fn().mockReturnValue([
        { category: 'Stocks', totalInvestedAmount: 500, totalCurrentAmount: 600, fill: 'red' },
        { category: 'MF', totalInvestedAmount: 500, totalCurrentAmount: 550, fill: 'blue' },
    ]),
    formattedAmount: (val: number) => `₹${val}`,
}));

describe('CategoryDistribution', () => {
    const mockUseRootContext = ROOT_CONTEXT.useRootContext as any;
    const mockUseFinContext = FIN_CONTEXT.useFinContext as any;

    it('should render correct data transformation', () => {
        mockUseRootContext.mockReturnValue({ isMobile: false, loader: { show: false } });
        mockUseFinContext.mockReturnValue({
            hasNoFinanceData: false,
            financeData: [],
            financeSummaryData: { totalInvested: 1000, totalCurrent: 1150 }
        });

        render(<CategoryDistribution />);

        expect(screen.getByText('Category Allocation')).toBeInTheDocument();
        // Check items 
        // 500/1000 = 50%
        expect(screen.getByText('Stocks - ₹500 (50%)')).toBeInTheDocument();
        expect(screen.getByText('MF - ₹500 (50%)')).toBeInTheDocument();
    });
});
