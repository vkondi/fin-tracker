import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrackerTable from './TrackerTable';
import * as RootContext from '@/context/RootContext';
import * as FinContext from '@/context/FinContext';
import { RootContextType } from '@/context/RootContext';
import { FinContextType } from '@/context/FinContext';

// Mock contexts
vi.mock('@/context/RootContext', () => ({
    useRootContext: vi.fn(),
}));

vi.mock('@/context/FinContext', () => ({
    useFinContext: vi.fn(),
}));

// Mock sub-components if desired, but we can stick to integration to verify columns
// However, TableControls is complex, so maybe we want to verify it interacts correctly?
// We will test if TrackerTable handles the sorting/filtering callbacks correctly.

describe('TrackerTable Component', () => {
    const mockUseRootContext = vi.mocked(RootContext.useRootContext);
    const mockUseFinContext = vi.mocked(FinContext.useFinContext);

    const mockShowFinanceForm = vi.fn();
    const mockFinanceData = [
        {
            id: '1',
            platform: 'Zerodha',
            category: 'Stocks',
            type: 'Equity',
            owner: 'John',
            investedAmount: 1000,
            currentAmount: 1200,
            updatedDate: '2023-01-01',
        },
        {
            id: '2',
            platform: 'Groww',
            category: 'MF',
            type: 'SIP',
            owner: 'Jane',
            investedAmount: 2000,
            currentAmount: 1800,
            updatedDate: '2023-01-02',
        },
    ];

    // memberWiseData is used for colors
    const mockMemberWiseData = [
        { owner: 'John', fill: 'red' },
        { owner: 'Jane', fill: 'blue' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue({
            showFinanceForm: mockShowFinanceForm,
            isMobile: false,
            loader: { show: false },
        } as unknown as RootContextType);
        mockUseFinContext.mockReturnValue({
            financeData: mockFinanceData,
            memberWiseData: mockMemberWiseData,
        } as unknown as FinContextType);
    });

    it('should render empty state when no data', () => {
        mockUseFinContext.mockReturnValue({ financeData: [], memberWiseData: [] } as unknown as FinContextType);
        render(<TrackerTable />);
        // Assuming TrackerTableEmptyState renders some text like "No data found" or "Get started"
        // Let's check for something generic if we don't know exact text, or we can check what TrackerTableEmptyState renders.
        // Or cleaner: import and mock TrackerTableEmptyState. 
        // For now, let's assume it renders a specific message "No finance records found" or we check behavior.
        // Actually the code says: if ((!financeData || financeData.length === 0) && !loading) return <TrackerTableEmptyState />;
        // We will just verify the table is not there.
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should render table with data on desktop', () => {
        render(<TrackerTable />);

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(3); // Header + 2 data rows

        // Check content
        expect(screen.getByText('Zerodha')).toBeInTheDocument();
        expect(screen.getByText('Groww')).toBeInTheDocument();
    });

    it('should show Add New button and call showFinanceForm on click', () => {
        render(<TrackerTable />);

        const addButton = screen.getByText('Add New');
        fireEvent.click(addButton);
        expect(mockShowFinanceForm).toHaveBeenCalledWith('add');
    });

    it('should render list view on mobile', () => {
        mockUseRootContext.mockReturnValue({
            showFinanceForm: mockShowFinanceForm,
            isMobile: true,
            loader: { show: false },
        } as unknown as RootContextType);

        render(<TrackerTable />);

        // Mobile view doesn't use <table> usually in this implementation:
        // {isMobile ? (<div className="space-y-2">...</div>) : (<table>...</table>)}
        expect(screen.queryByRole('table')).not.toBeInTheDocument();

        // Check content existence
        expect(screen.getByText('Zerodha')).toBeInTheDocument();
    });

    // We could test sorting/filtering but since logic is inside component state which is driven by TableControls callbacks,
    // we would need to mock TableControls to trigger those callbacks or interact with real TableControls.
    // Interacting with real TableControls is better for integration.
    // But TableControls might be complex (dropdowns etc).
    // Let's rely on basic rendering validation for now as requested by user ("add test cases now").
});
