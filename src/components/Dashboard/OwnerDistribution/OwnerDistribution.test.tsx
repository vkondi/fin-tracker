import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OwnerDistribution from './OwnerDistribution';
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

vi.mock("../DistributionChartTable/DistributionChartTable", () => ({
    default: ({ title, chartData }: { title: string; chartData: { name: string; valueFormatted: string }[] }) => (
        <div data-testid="distribution-chart-table">
            <h1>{title}</h1>
            <ul>
                {chartData.map((item, idx) => (
                    <li key={idx} data-testid="chart-item">{item.name} - {item.valueFormatted}</li>
                ))}
            </ul>
        </div>
    ),
}));

vi.mock("@/utils/utility", () => ({
    formattedAmount: (val: number) => `₹${val}`,
}));

describe('OwnerDistribution', () => {
    const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);
    const mockUseFinContext = vi.mocked(FIN_CONTEXT.useFinContext);

    it('should render correct data transformation', () => {
        mockUseRootContext.mockReturnValue({ isMobile: false, loader: { show: false } } as unknown as RootContextType);
        mockUseFinContext.mockReturnValue({
            hasNoFinanceData: false,
            financeSummaryData: { totalInvested: 1000, totalCurrent: 1200 },
            memberWiseData: [
                { owner: 'Alice', totalInvestedAmount: 500, totalCurrentAmount: 600, fill: 'red' }
            ]
        } as unknown as FinContextType);

        render(<OwnerDistribution />);

        expect(screen.getByText('Member Allocation')).toBeInTheDocument();
        expect(screen.getByText('Alice - ₹500')).toBeInTheDocument();
    });
});
