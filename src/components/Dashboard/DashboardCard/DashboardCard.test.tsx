import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardCard from './DashboardCard';
import * as ROOT_CONTEXT from "@/context/RootContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

describe('DashboardCard', () => {
    const mockUseRootContext = ROOT_CONTEXT.useRootContext as any;

    it('should render children', () => {
        mockUseRootContext.mockReturnValue({ isMobile: false });
        render(
            <DashboardCard>
                <div>Child Content</div>
            </DashboardCard>
        );
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it('should render title if provided', () => {
        mockUseRootContext.mockReturnValue({ isMobile: false });
        render(
            <DashboardCard title="My Card">
                <div>Content</div>
            </DashboardCard>
        );
        expect(screen.getByText("My Card")).toBeInTheDocument();
    });

    it('should apply mobile specific classes', () => {
        mockUseRootContext.mockReturnValue({ isMobile: true });
        const { container } = render(
            <DashboardCard>
                <div>Content</div>
            </DashboardCard>
        );
        // On mobile, max-w-[50%] is NOT applied
        expect(container.firstChild).not.toHaveClass("max-w-[50%]");
    });

    it('should apply desktop specific classes', () => {
        mockUseRootContext.mockReturnValue({ isMobile: false });
        const { container } = render(
            <DashboardCard>
                <div>Content</div>
            </DashboardCard>
        );
        // On desktop, max-w-[50%] IS applied
        expect(container.firstChild).toHaveClass("max-w-[50%]");
    });
});
