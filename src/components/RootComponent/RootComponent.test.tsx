import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootComponent from './RootComponent';
import { useRootContext, RootContextType } from "@/context/RootContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/components/Header/Header", () => ({
    default: () => <header aria-label="site header">Header</header>,
}));

vi.mock("@/components/Footer/Footer", () => ({
    default: () => <footer aria-label="site footer">Footer</footer>,
}));

vi.mock("@/components/FinanceFormPopup/FinanceFormPopup", () => ({
    default: () => <div role="dialog" aria-label="finance popup">FinanceFormPopup</div>,
}));

vi.mock("@/components/Loader/Loader", () => ({
    default: ({ show, loadingMessage }: { show: boolean; loadingMessage?: string }) => (
        show ? <div role="status" aria-label="loading indicator">{loadingMessage}</div> : null
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
                <main aria-label="main content">Main Content</main>
            </RootComponent>
        );

        expect(screen.getByLabelText('site header')).toBeInTheDocument();
        expect(screen.getByLabelText('site footer')).toBeInTheDocument();
        expect(screen.getByLabelText('finance popup')).toBeInTheDocument();
        expect(screen.getByLabelText('main content')).toBeInTheDocument();
        expect(screen.queryByLabelText('loading indicator')).not.toBeInTheDocument();
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

        expect(screen.getByLabelText('loading indicator')).toBeInTheDocument();
        expect(screen.getByText("Wait...")).toBeInTheDocument();
    });
});
