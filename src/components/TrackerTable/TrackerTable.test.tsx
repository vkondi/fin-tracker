import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrackerTable from './TrackerTable';
import * as RootContext from '@/context/RootContext';
import * as FinContext from '@/context/FinContext';
import { RootContextType } from '@/context/RootContext';
import { FinContextType } from '@/context/FinContext';

vi.mock('@/context/RootContext', () => ({
    useRootContext: vi.fn(),
}));

vi.mock('@/context/FinContext', () => ({
    useFinContext: vi.fn(),
}));


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
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should render table with data on desktop', () => {
        render(<TrackerTable />);

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(3);

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

        expect(screen.queryByRole('table')).not.toBeInTheDocument();

        expect(screen.getByText('Zerodha')).toBeInTheDocument();
    });

});
