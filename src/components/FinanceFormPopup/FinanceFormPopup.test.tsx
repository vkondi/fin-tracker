import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FinanceFormPopup from './FinanceFormPopup';
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

vi.mock('react-icons/lia', () => ({
    LiaWindowCloseSolid: () => <span aria-label="close icon" />,
}));

describe('FinanceFormPopup', () => {
    const mockUseRootContext = vi.mocked(RootContext.useRootContext);
    const mockUseFinContext = vi.mocked(FinContext.useFinContext);

    const mockHideFinanceForm = vi.fn();
    const mockSetLoader = vi.fn();
    const mockToast = { success: vi.fn(), error: vi.fn() };
    const mockAddFinance = vi.fn();
    const mockUpdateFinance = vi.fn();
    const mockDeleteFinance = vi.fn();

    const platforms = [
        { name: 'Zerodha', category: 'Stocks', instruments: ['Equity', 'Mutual Fund'] },
        { name: 'Groww', category: 'Mutual Funds', instruments: ['SIP', 'Lumpsum'] },
    ];

    const defaultRootContext = {
        financePopupState: { isVisible: false, mode: undefined, data: undefined },
        showFinanceForm: vi.fn(),
        hideFinanceForm: mockHideFinanceForm,
        loader: { show: false },
        isMobile: false,
        setLoader: mockSetLoader,
        toast: mockToast,
        platforms,
    };

    const defaultFinContext = {
        updateFinance: mockUpdateFinance,
        deleteFinance: mockDeleteFinance,
        addFinance: mockAddFinance,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue(defaultRootContext as unknown as RootContextType);
        mockUseFinContext.mockReturnValue(defaultFinContext as unknown as FinContextType);

        mockAddFinance.mockResolvedValue({ success: true });
        mockUpdateFinance.mockResolvedValue({ success: true });
        mockDeleteFinance.mockResolvedValue({ success: true });
    });

    it('should not render anything when isVisible is false', () => {
        render(<FinanceFormPopup />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render Add New Finance form', () => {
        mockUseRootContext.mockReturnValue({
            ...defaultRootContext,
            financePopupState: { isVisible: true, mode: 'add' as const, data: undefined },
        } as unknown as RootContextType);

        render(<FinanceFormPopup />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Add New Finance')).toBeInTheDocument();
        expect(screen.getByLabelText('Add')).toBeInTheDocument();
    });

    it('should handle form submission in Add mode', async () => {
        mockUseRootContext.mockReturnValue({
            ...defaultRootContext,
            financePopupState: { isVisible: true, mode: 'add' as const, data: undefined },
        } as unknown as RootContextType);

        render(<FinanceFormPopup />);

        fireEvent.change(screen.getByLabelText('Platform'), { target: { value: 'Zerodha' } });
        fireEvent.change(screen.getByLabelText('Type/Instruments'), { target: { value: 'Equity' } });
        fireEvent.change(screen.getByLabelText('Owner'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Invested Amount'), { target: { value: '1000' } });
        fireEvent.change(screen.getByLabelText('Current Amount'), { target: { value: '1200' } });

        fireEvent.click(screen.getByLabelText('Add'));

        await waitFor(() => {
            expect(mockSetLoader).toHaveBeenCalledWith({ show: true, loadingMessage: "Adding finance record..." });
            expect(mockAddFinance).toHaveBeenCalledWith({
                platform: 'Zerodha',
                type: 'Equity',
                owner: 'John',
                investedAmount: 1000,
                currentAmount: 1200,
                category: 'Stocks',
            });
            expect(mockToast.success).toHaveBeenCalledWith("Finance record added successfully!", expect.any(Object));
            expect(mockHideFinanceForm).toHaveBeenCalled();
        });
    });

    it('should render Edit Finance form with prefilled data', () => {
        const testData = {
            id: '123',
            platform: 'Zerodha',
            category: 'Stocks',
            type: 'Equity',
            owner: 'John',
            investedAmount: 5000,
            currentAmount: 6000,
        };

        mockUseRootContext.mockReturnValue({
            ...defaultRootContext,
            financePopupState: { isVisible: true, mode: 'edit' as const, data: testData },
        } as unknown as RootContextType);

        render(<FinanceFormPopup />);

        expect(screen.getByText('Edit Finance')).toBeInTheDocument();
        expect(screen.getByLabelText('Platform')).toHaveValue('Zerodha');
        expect(screen.getByLabelText('Owner')).toHaveValue('John');
        expect(screen.getByLabelText('Invested Amount')).toHaveValue(5000);
    });

    it('should render Delete Finance confirmation', () => {
        const testData = {
            id: '123',
            platform: 'Zerodha',
            category: 'Stocks',
            type: 'Equity',
            owner: 'John',
            investedAmount: 5000,
            currentAmount: 6000,
        };

        mockUseRootContext.mockReturnValue({
            ...defaultRootContext,
            financePopupState: { isVisible: true, mode: 'delete' as const, data: testData },
        } as unknown as RootContextType);

        render(<FinanceFormPopup />);

        expect(screen.getByText('Delete Finance')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete "Zerodha" of "John"?')).toBeInTheDocument();
        expect(screen.getByLabelText('Delete')).toHaveClass('bg-red-900');
    });

    it('should close popup on outside click', () => {
        mockUseRootContext.mockReturnValue({
            ...defaultRootContext,
            financePopupState: { isVisible: true, mode: 'add' as const, data: undefined },
        } as unknown as RootContextType);

        render(<FinanceFormPopup />);

        const overlay = screen.getAllByRole('button', { name: 'Close overlay' })[0];
        fireEvent.click(overlay);

        expect(mockHideFinanceForm).toHaveBeenCalled();
    });
});
