import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryDistribution from './CategoryDistribution';
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

interface ChartItem {
    name: string;
    valueFormatted: string;
    percentFormatted: string;
}

// Mock child component
vi.mock("../DistributionChartTable/DistributionChartTable", () => ({
    default: ({ title, chartData }: { title: string; chartData: ChartItem[] }) => (
        <div data-testid="distribution-chart-table">
            <h1>{title}</h1>
            <ul>
                {chartData.map((item, idx) => (
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
    const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);
    const mockUseFinContext = vi.mocked(FIN_CONTEXT.useFinContext);

    it('should render correct data transformation', () => {
        mockUseRootContext.mockReturnValue({ isMobile: false, loader: { show: false } } as unknown as RootContextType);
        mockUseFinContext.mockReturnValue({
            hasNoFinanceData: false,
            financeData: [],
            financeSummaryData: { totalInvested: 1000, totalCurrent: 1150 }
        } as unknown as FinContextType);

        render(<CategoryDistribution />);

        expect(screen.getByText('Category Allocation')).toBeInTheDocument();
        expect(screen.getByText('Stocks - ₹600 (52.17%)')).toBeInTheDocument();
        expect(screen.getByText('MF - ₹550 (47.83%)')).toBeInTheDocument();
    });
});
