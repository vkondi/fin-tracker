import { act, waitFor, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RootProvider, useRootContext } from './RootContext';
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import { FinanceFormDataType } from '@/components/component.types';

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
}));

vi.mock("react-responsive", () => ({
    useMediaQuery: vi.fn(),
}));

vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
    ToastContainer: () => <div data-testid="toast-container" />,
}));

const globalFetch = vi.fn();
global.fetch = globalFetch;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RootProvider>{children}</RootProvider>
);

describe('RootContext', () => {
    const mockUseSession = vi.mocked(useSession);
    const mockUseMediaQuery = vi.mocked(useMediaQuery);

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" } as unknown as ReturnType<typeof useSession>);
        mockUseMediaQuery.mockReturnValue(false);
        globalFetch.mockResolvedValue({
            json: async () => ({ data: {} }),
        });
    });

    it('should provide default values', () => {
        const { result } = renderHook(() => useRootContext(), { wrapper });

        expect(result.current.financePopupState).toEqual({ isVisible: false });
        expect(result.current.isMobile).toBe(false);
        expect(result.current.loader).toEqual({ show: false });
        expect(result.current.name).toBe("");
        expect(result.current.platforms).toEqual([]);
    });

    it('should throw error if used outside provider', () => {
        const originalConsoleError = console.error;
        console.error = vi.fn();

        expect(() => {
            renderHook(() => useRootContext());
        }).toThrow("useRootContext must be used within a RootProvider");

        console.error = originalConsoleError;
    });

    it('should detect mobile device', () => {
        mockUseMediaQuery.mockReturnValue(true);
        const { result } = renderHook(() => useRootContext(), { wrapper });
        expect(result.current.isMobile).toBe(true);
    });

    it('should handle finance popup state changes', () => {
        const { result } = renderHook(() => useRootContext(), { wrapper });

        act(() => {
            result.current.showFinanceForm('add', { id: '1' } as unknown as FinanceFormDataType);
        });

        expect(result.current.financePopupState).toEqual({
            isVisible: true,
            mode: 'add',
            data: { id: '1' }
        });

        act(() => {
            result.current.hideFinanceForm();
        });

        expect(result.current.financePopupState).toEqual({ isVisible: false });
    });

    it('should register user automatically when session email exists', async () => {
        mockUseSession.mockReturnValue({
            data: { user: { email: 'test@example.com', name: 'Test User' } },
            status: "authenticated",
        } as unknown as ReturnType<typeof useSession>);

        globalFetch.mockResolvedValueOnce({
            json: async () => ({
                data: { id: 'user-123', name: 'API User Name', email: 'test@example.com' }
            }),
        });

        const { result } = renderHook(() => useRootContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.name).toBe('API User Name');
            expect(result.current.userId).toBe('user-123');
        });

        expect(globalFetch).toHaveBeenCalledWith("/api/profile", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ email: 'test@example.com', name: 'Test User' })
        }));
    });

    it('should fetch configurations when user is registered', async () => {
        mockUseSession.mockReturnValue({
            data: { user: { email: 'test@example.com', name: 'Test User' } },
            status: "authenticated",
        } as unknown as ReturnType<typeof useSession>);

        globalFetch.mockResolvedValueOnce({
            json: async () => ({
                data: { id: 'user-123', name: 'API User Name' }
            }),
        });

        globalFetch.mockResolvedValueOnce({
            json: async () => ({
                data: { platforms: [{ name: 'Zerodha', id: 'p1' }] }
            }),
        });

        const { result } = renderHook(() => useRootContext(), { wrapper });

        await waitFor(() => {
            expect(result.current.name).toBe('API User Name');
        });

        await waitFor(() => {
            expect(result.current.platforms).toHaveLength(1);
            expect(result.current.platforms?.[0].name).toBe('Zerodha');
        });

        expect(globalFetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/finance/config"),
            expect.objectContaining({ method: "GET" })
        );
    });

    it('should update loader state', () => {
        const { result } = renderHook(() => useRootContext(), { wrapper });

        act(() => {
            result.current.setLoader({ show: true, loadingMessage: "Loading..." });
        });

        expect(result.current.loader).toEqual({ show: true, loadingMessage: "Loading..." });
    });
});
