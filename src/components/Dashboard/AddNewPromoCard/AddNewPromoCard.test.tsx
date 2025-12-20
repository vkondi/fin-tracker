import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddNewPromoCard from './AddNewPromoCard';
import * as ROOT_CONTEXT from "@/context/RootContext";
import { RootContextType } from "@/context/RootContext";

// Mock dependencies
vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

vi.mock("../DashboardCard/DashboardCard", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="dashboard-card">{children}</div>
}));

// Mock icons
vi.mock("react-icons/im", () => ({ ImCheckmark: () => <span>check</span> }));
vi.mock("react-icons/io5", () => ({ IoPieChartSharp: () => <span>pie</span> }));
vi.mock("react-icons/ai", () => ({ AiFillThunderbolt: () => <span>bolt</span> }));
vi.mock("react-icons/fa", () => ({ FaPlus: () => <span>plus</span> }));

describe('AddNewPromoCard', () => {
    const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);
    const mockShowFinanceForm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue({ showFinanceForm: mockShowFinanceForm } as unknown as RootContextType);
    });

    it('should render promo points', () => {
        render(<AddNewPromoCard />);

        expect(screen.getByText("Stay on Top of Your Finances")).toBeInTheDocument();
        expect(screen.getByText("See Real-Time Insights")).toBeInTheDocument();
        expect(screen.getByText("Takes Just 10 Seconds!")).toBeInTheDocument();
    });

    it('should call showFinanceForm on click', () => {
        render(<AddNewPromoCard />);

        const actionButton = screen.getByRole('button', { name: "Log Now, Grow Smarter" });
        fireEvent.click(actionButton);

        expect(mockShowFinanceForm).toHaveBeenCalledWith("add");
    });

    it('should call showFinanceForm on Enter key', () => {
        render(<AddNewPromoCard />);

        const actionButton = screen.getByRole('button', { name: "Log Now, Grow Smarter" });
        fireEvent.keyPress(actionButton, { key: 'Enter', code: 13, charCode: 13 });

        expect(mockShowFinanceForm).toHaveBeenCalledWith("add");
    });
});
