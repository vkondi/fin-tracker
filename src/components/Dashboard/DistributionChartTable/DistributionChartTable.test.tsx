import React, { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DistributionChartTable from './DistributionChartTable';

vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    PieChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Pie: () => <div>Pie Chart</div>,
    Tooltip: () => <div>Tooltip</div>,
}));

vi.mock("../DashboardCard/DashboardCard", () => ({
    default: ({ children, title }: { children: ReactNode, title: string }) => <div><h1>{title}</h1>{children}</div>
}));

vi.mock("../../Chart/CustomTooltip/CustomTooltip", () => ({
    default: () => <div>CustomTooltip</div>
}));


describe('DistributionChartTable', () => {
    const mockSetActiveTab = vi.fn();
    const defaultProps = {
        title: "Test Chart",
        isMobile: false,
        chartData: [{ name: 'A', value: 10 }],
        total: 10,
        tabLabels: ["Tab 1", "Tab 2"] as [string, string],
        activeTab: "invested" as const,
        setActiveTab: mockSetActiveTab,
        tableColumns: [
            { header: "Name", render: (rec: { name: string; value: number }) => rec.name },
            { header: "Value", render: (rec: { name: string; value: number }) => rec.value.toString() },
        ],
        loading: false,
        hideIfNoData: false
    };

    it('should render title and tabs', () => {
        render(<DistributionChartTable {...defaultProps} />);

        expect(screen.getByText("Test Chart")).toBeInTheDocument();
        expect(screen.getByText("Tab 1")).toBeInTheDocument();
        expect(screen.getByText("Tab 2")).toBeInTheDocument();
    });

    it('should switch tabs', () => {
        render(<DistributionChartTable {...defaultProps} />);

        fireEvent.click(screen.getByText("Tab 2"));
        expect(mockSetActiveTab).toHaveBeenCalledWith("current");

        fireEvent.click(screen.getByText("Tab 1"));
        expect(mockSetActiveTab).toHaveBeenCalledWith("invested");
    });

    it('should render table data', () => {
        render(<DistributionChartTable {...defaultProps} />);

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Value")).toBeInTheDocument();

        expect(screen.getByText("A")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });

    it('should not render if loading', () => {
        const { container } = render(<DistributionChartTable {...defaultProps} loading={true} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should not render if no data and hidden flag is on', () => {
        const { container } = render(
            <DistributionChartTable
                {...defaultProps}
                chartData={[]}
                hideIfNoData={true}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });
});
