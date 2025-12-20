import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrackerTableEmptyState from './TrackerTableEmptyState';
import * as ROOT_CONTEXT from "@/context/RootContext";

vi.mock("@/context/RootContext", () => ({
    useRootContext: vi.fn(),
}));

describe('TrackerTableEmptyState', () => {
    const mockUseRootContext = ROOT_CONTEXT.useRootContext as any;
    const mockShowFinanceForm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRootContext.mockReturnValue({ showFinanceForm: mockShowFinanceForm, isMobile: false });
    });

    it('should render message', () => {
        render(<TrackerTableEmptyState />);
        expect(screen.getByText(/Ready to rule your finances/)).toBeInTheDocument();
    });

    it('should call showFinanceForm on clicking Add New', () => {
        render(<TrackerTableEmptyState />);
        
        const addButton = screen.getByText('Add New');
        fireEvent.click(addButton);
        
        expect(mockShowFinanceForm).toHaveBeenCalledWith('add');
    });
});
