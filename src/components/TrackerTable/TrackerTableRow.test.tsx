import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrackerTableRow from './TrackerTableRow';
import * as ROOT_CONTEXT from "@/context/RootContext";
import { RootContextType } from "@/context/RootContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/utils/utility", () => ({
    formattedAmount: (val: number) => `₹${val}`,
}));

describe('TrackerTableRow', () => {
    const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);
    const mockShowFinanceForm = vi.fn();
    const mockData = {
        id: '1',
        platform: 'Zerodha',
        category: 'Stocks',
        type: 'Equity',
        owner: 'Alice',
        investedAmount: 1000,
        currentAmount: 1200,
        updatedDate: '2023-01-01T10:00:00.000Z',
    };
    const mockMemberColorMap = new Map([['Alice', 'red']]);

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue({
            showFinanceForm: mockShowFinanceForm,
            isMobile: false,
            loader: { show: false }
        } as unknown as RootContextType);
    });

    it('should render desktop view correctly', () => {
        render(
            <table>
                <tbody>
                    <TrackerTableRow data={mockData} memberColorMap={mockMemberColorMap} />
                </tbody>
            </table>
        );

        expect(screen.getByText('Zerodha')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('₹1000')).toBeInTheDocument();
        expect(screen.getByText('₹1200')).toBeInTheDocument();
        expect(screen.getByText('20.00%')).toBeInTheDocument();
    });

    it('should call edit on click', () => {
        render(
            <table>
                <tbody>
                    <TrackerTableRow data={mockData} memberColorMap={mockMemberColorMap} />
                </tbody>
            </table>
        );

        const editBtn = screen.getByRole('button', { name: "Edit entry" });
        fireEvent.click(editBtn);

        expect(mockShowFinanceForm).toHaveBeenCalledWith('edit', mockData);
    });

    it('should render card view in mobile', () => {
        mockUseRootContext.mockReturnValue({
            showFinanceForm: mockShowFinanceForm,
            isMobile: true,
            loader: { show: false }
        } as unknown as RootContextType);

        render(<TrackerTableRow data={mockData} memberColorMap={mockMemberColorMap} />);

        expect(screen.getByText('Zerodha')).toBeInTheDocument();
        expect(screen.getByLabelText('Expand details')).toBeInTheDocument();
    });

    it('should expand details on mobile', () => {
        mockUseRootContext.mockReturnValue({
            showFinanceForm: mockShowFinanceForm,
            isMobile: true,
            loader: { show: false }
        } as unknown as RootContextType);

        render(<TrackerTableRow data={mockData} memberColorMap={mockMemberColorMap} />);

        fireEvent.click(screen.getByLabelText('Expand details'));

        expect(screen.getByText('Invested Amount')).toBeInTheDocument();
        expect(screen.getByLabelText('Collapse details')).toBeInTheDocument();
    });
});
