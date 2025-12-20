import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinProvider, useFinContext } from './FinContext';
import * as RootContext from './RootContext';
import { RootContextType } from './RootContext';
import { FinanceFormDataType } from '@/components/component.types';

vi.mock('./RootContext', () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/utils/utility", () => ({
    getRandomColor: vi.fn(() => "#FFFFFF"),
}));


const globalFetch = vi.fn();
global.fetch = globalFetch;


const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FinProvider>{children}</FinProvider>
);

describe('FinContext', () => {
    const mockSetLoader = vi.fn();
    const mockUseRootContext = vi.mocked(RootContext.useRootContext);

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue({
            isUserRegistered: true,
            userId: 'user-123',
            setLoader: mockSetLoader,
        } as unknown as RootContextType);

        globalFetch.mockResolvedValue({
            json: async () => ({ data: [] }),
        });
    });

    it('should throw error if used outside provider', () => {
        const originalConsoleError = console.error;
        console.error = vi.fn();

        expect(() => {
            renderHook(() => useFinContext());
        }).toThrow("useFinContext must be used within a FinProvider");

        console.error = originalConsoleError;
    });

    it('should fetch and process finance data on mount if registered', async () => {
        const mockApiData = [
            {
                id: "1",
                platform_type: "Equity",
                platform_category: "Stocks",
                amount_invested: 1000,
                amount_current: 1200,
                updated_date: "2023-01-01",
                owner: "Alice",
                platform: "Zerodha"
            }
        ];

        globalFetch.mockResolvedValueOnce({
            json: async () => ({ data: mockApiData }),
        });

        const { result } = renderHook(() => useFinContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.financeData).toHaveLength(1);
        });

        const data = result.current.financeData[0];
        expect(data.id).toBe("1");
        expect(data.type).toBe("Equity");
        expect(data.category).toBe("Stocks");
        expect(data.investedAmount).toBe(1000);
        expect(data.currentAmount).toBe(1200);

        expect(mockSetLoader).toHaveBeenCalledWith({ show: true });
        expect(mockSetLoader).toHaveBeenCalledWith({ show: false });
    });

    it('should compute summaries correctly', async () => {
        const mockApiData = [
            {
                id: "1",
                platform_type: "Equity",
                platform_category: "Stocks",
                amount_invested: 1000,
                amount_current: 1200,
                owner: "Alice",
                platform: "Zerodha"
            },
            {
                id: "2",
                platform_type: "SIP",
                platform_category: "Mutual Fund",
                amount_invested: 1000,
                amount_current: 1000,
                owner: "Bob",
                platform: "Groww"
            }
        ];

        globalFetch.mockResolvedValueOnce({
            json: async () => ({ data: mockApiData }),
        });

        const { result } = renderHook(() => useFinContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.financeData).toHaveLength(2);
        });

        const summary = result.current.financeSummaryData;
        expect(summary.totalInvested).toBe(2000);
        expect(summary.totalCurrent).toBe(2200);
        expect(summary.totalAbsReturn).toBe(200);
        expect(summary.totalAbsReturnPercentage).toBe(10);
        expect(summary.totalOwners).toBe(2);
        expect(summary.totalPlatforms).toBe(2);
    });

    it('should add finance record', async () => {
        const { result } = renderHook(() => useFinContext(), { wrapper });

        globalFetch.mockResolvedValue({
            json: async () => ({ data: [] }),
        });

        const newRecord = {
            id: "1",
            owner: "Alice",
            category: "Stocks",
            platform: "Zerodha",
            type: "Equity",
            investedAmount: 100,
            currentAmount: 110,
        };

        let response;
        await act(async () => {
            response = await result.current.addFinance(newRecord as FinanceFormDataType);
        });

        expect(response).toEqual({ success: true, message: "Finance data added successfully!" });
        expect(globalFetch).toHaveBeenCalledWith("/api/finance", expect.objectContaining({
            method: "POST",
            body: expect.stringContaining("Alice")
        }));
        expect(globalFetch).toHaveBeenCalledTimes(3);
    });

    it('should update finance record', async () => {
        const { result } = renderHook(() => useFinContext(), { wrapper });

        globalFetch.mockResolvedValue({
            json: async () => ({ data: [] }),
        });

        const record = {
            id: "1",
            owner: "Alice",
            category: "Stocks",
            platform: "Zerodha",
            type: "Equity",
            investedAmount: 100,
            currentAmount: 110,
        };

        let response;
        await act(async () => {
            response = await result.current.updateFinance(record as FinanceFormDataType);
        });

        expect(response).toEqual({ success: true, message: "Finance data updated successfully!" });
        expect(globalFetch).toHaveBeenCalledWith("/api/finance", expect.objectContaining({
            method: "PUT",
        }));
    });

    it('should delete finance record', async () => {
        const { result } = renderHook(() => useFinContext(), { wrapper });

        globalFetch.mockResolvedValue({
            json: async () => ({ data: [] }),
        });

        let response;
        await act(async () => {
            response = await result.current.deleteFinance("1");
        });

        expect(response).toEqual({ success: true, message: "Finance data deleted successfully!" });
        expect(globalFetch).toHaveBeenCalledWith("/api/finance", expect.objectContaining({
            method: "DELETE",
            body: JSON.stringify({ id: "1" })
        }));
    });
});
