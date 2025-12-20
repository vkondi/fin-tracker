import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WelcomeMessage from './WelcomeMessage';
import * as ROOT_CONTEXT from "@/context/RootContext";
import { RootContextType } from "@/context/RootContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

describe('WelcomeMessage', () => {
    const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);

    it('should render greeting with name', () => {
        mockUseRootContext.mockReturnValue({ name: 'User', isMobile: false } as unknown as RootContextType);
        render(<WelcomeMessage />);

        expect(screen.getByText(/Good/)).toBeInTheDocument();
        expect(screen.getByText(/User/)).toBeInTheDocument();
        expect(screen.getByText(/👋/)).toBeInTheDocument();
    });

    it('should render greeting without name', () => {
        mockUseRootContext.mockReturnValue({ name: '', isMobile: false } as unknown as RootContextType);
        render(<WelcomeMessage />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent(/Good/);
        expect(heading).not.toHaveTextContent('null');
        expect(heading).not.toHaveTextContent('undefined');
    });

    it('should render a valid greeting message', () => {
        mockUseRootContext.mockReturnValue({ name: 'User', isMobile: false } as unknown as RootContextType);
        render(<WelcomeMessage />);

        const heading = screen.getByRole('heading', { level: 1 });
        const greetingElement = heading.nextSibling;

        expect(greetingElement).toBeInTheDocument();
        expect(greetingElement).toHaveTextContent(/./);
    });
});
