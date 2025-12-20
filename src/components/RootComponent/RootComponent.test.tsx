import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootComponent from './RootComponent';
import { useRootContext, RootContextType } from "@/context/RootContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/components/Header/Header", () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock("@/components/Footer/Footer", () => ({
    default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/components/FinanceFormPopup/FinanceFormPopup", () => ({
    default: () => <div data-testid="finance-popup">FinanceFormPopup</div>,
}));

vi.mock("@/components/Loader/Loader", () => ({
    default: ({ show, loadingMessage }: { show: boolean; loadingMessage?: string }) => (
        show ? <div data-testid="loader">{loadingMessage}</div> : null
    ),
}));

describe('RootComponent', () => {
    const mockUseRootContext = vi.mocked(useRootContext);

    it('should render children and shared components', () => {
        mockUseRootContext.mockReturnValue({
            loader: { show: false },
        } as unknown as RootContextType);

        render(
            <RootComponent>
                <div data-testid="child">Main Content</div>
            </RootComponent>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('finance-popup')).toBeInTheDocument();
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('should show loader when context says so', () => {
        mockUseRootContext.mockReturnValue({
            loader: { show: true, loadingMessage: "Wait..." },
        } as unknown as RootContextType);

        render(
            <RootComponent>
                <div>Content</div>
            </RootComponent>
        );

        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(screen.getByText("Wait...")).toBeInTheDocument();
    });
});
