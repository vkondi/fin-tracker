import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrackerTableRow from './TrackerTableRow';
import * as ROOT_CONTEXT from "@/context/RootContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/utils/utility", () => ({
    formattedAmount: (val: number) => `₹${val}`,
}));

describe('TrackerTableRow', () => {
    const mockUseRootContext = ROOT_CONTEXT.useRootContext as any;
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
        });
    });

    it('should render row data in desktop view', () => {
        // Need to wrap in table/tbody/tr structure or render just the row if it was just <tr>
        // But TrackerTableRow returns <tr> in desktop mode.
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
        expect(screen.getByText('20.00%')).toBeInTheDocument(); // Abs return %
    });

    it('should call edit on click', () => {
        render(
            <table>
                <tbody>
                    <TrackerTableRow data={mockData} memberColorMap={mockMemberColorMap} />
                </tbody>
            </table>
        );

        const editBtns = screen.getAllByRole('button', { name: /edit/i }); // might find multiple or need aria-label if icon is used
        // Implementation: <button ...><FaEdit /></button>. No aria-label in desktop view code?
        // Wait, looking at code: desktop view buttons are just icons.
        // Let's rely on finding by role button.
        // There are 2 buttons: Edit and Delete.
        const editBtn = screen.getByRole('button', { name: "Edit entry" });
        fireEvent.click(editBtn);
        
        expect(mockShowFinanceForm).toHaveBeenCalledWith('edit', mockData);
    });

    it('should render card view in mobile', () => {
        mockUseRootContext.mockReturnValue({ 
            showFinanceForm: mockShowFinanceForm, 
            isMobile: true,
            loader: { show: false }
        });

        render(<TrackerTableRow data={mockData} memberColorMap={mockMemberColorMap} />);
        
        // In mobile it returns a div, no need for table wrapper
        expect(screen.getByText('Zerodha')).toBeInTheDocument();
        // Check for expand capability
        expect(screen.getByLabelText('Expand details')).toBeInTheDocument();
    });

    it('should expand details on mobile', () => {
         mockUseRootContext.mockReturnValue({ 
            showFinanceForm: mockShowFinanceForm, 
            isMobile: true,
            loader: { show: false }
        });

        render(<TrackerTableRow data={mockData} memberColorMap={mockMemberColorMap} />);
        
        fireEvent.click(screen.getByLabelText('Expand details'));
        
        // Now details should be visible (check for expanded class or existence of detail items)
        expect(screen.getByText('Invested Amount')).toBeInTheDocument();
        expect(screen.getByLabelText('Collapse details')).toBeInTheDocument();
    });
});
