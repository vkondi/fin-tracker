import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import { useSession } from "next-auth/react";
import * as ROOT_CONTEXT from "@/context/RootContext";
import { RootContextType } from "@/context/RootContext";

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
}));

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("@/context/FinContext", () => ({
    useFinContext: vi.fn(),
}));

vi.mock('./WelcomeMessage/WelcomeMessage', () => ({
    default: () => <section aria-label="welcome message">WelcomeMessage</section>
}));
vi.mock('./AddNewPromoCard/AddNewPromoCard', () => ({
    default: () => <section aria-label="add new promo">AddNewPromoCard</section>
}));
vi.mock('./Summary/Summary', () => ({
    default: () => <section aria-label="summary">Summary</section>
}));
vi.mock('./DashboardCard/DashboardCard', () => ({
    default: ({ title }: { title: string }) => <article aria-label={`dashboard card ${title}`}>{title}</article>
}));
vi.mock('./DistributionChartTable/DistributionChartTable', () => ({
    default: () => <section aria-label="distribution chart">DistributionChartTable</section>
}));
vi.mock('./CategoryDistribution/CategoryDistribution', () => ({
    default: () => <section aria-label="category distribution">CategoryDistribution</section>
}));
vi.mock('./OwnerDistribution/OwnerDistribution', () => ({
    default: () => <section aria-label="owner distribution">OwnerDistribution</section>
}));
vi.mock('./MembersCard/MembersCard', () => ({
    default: () => <section aria-label="members card">MembersCard</section>
}));


describe('Dashboard Component', () => {
    const mockUseSession = vi.mocked(useSession);
    const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);

    it('should render dashboard content correctly', () => {
        mockUseSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: 'authenticated' } as unknown as ReturnType<typeof useSession>);
        mockUseRootContext.mockReturnValue({ isMobile: false } as unknown as RootContextType);

        render(<Dashboard />);

        expect(screen.getByLabelText('welcome message')).toBeInTheDocument();
        expect(screen.getByLabelText('summary')).toBeInTheDocument();
    });
});
