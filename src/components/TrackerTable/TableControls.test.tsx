import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TableControls from './TableControls';

// Mock icons
vi.mock("react-icons/fa", () => ({
    FaFilter: () => <span>filter-icon</span>,
    FaSort: () => <span>sort-icon</span>,
    FaTimes: () => <span>times-icon</span>,
}));

describe('TableControls', () => {
    const mockOnFilterChange = vi.fn();
    const mockOnSortChange = vi.fn();
    const mockData = [
        { owner: 'Alice', category: 'Stocks', platform: 'Zerodha', type: 'Equity', updatedDate: '', investedAmount: 0, currentAmount: 0 },
        { owner: 'Bob', category: 'MF', platform: 'Groww', type: 'SIP', updatedDate: '', investedAmount: 0, currentAmount: 0 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render filter and sort buttons', () => {
        render(
            <TableControls 
                data={mockData} 
                onFilterChange={mockOnFilterChange} 
                onSortChange={mockOnSortChange} 
                isMobile={false} 
            />
        );
        
        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByText('Sort')).toBeInTheDocument();
    });

    it('should toggle filter dropdown on click', () => {
         render(
            <TableControls 
                data={mockData} 
                onFilterChange={mockOnFilterChange} 
                onSortChange={mockOnSortChange} 
                isMobile={false} 
            />
        );
        
        fireEvent.click(screen.getByText('Filter'));
        expect(screen.getByText('Filters')).toBeInTheDocument();
        
        // Should show categories like Owner, Category etc.
        expect(screen.getByText('owner')).toBeInTheDocument();
        expect(screen.getByText('category')).toBeInTheDocument();
    });

    it('should select a filter option', () => {
         render(
            <TableControls 
                data={mockData} 
                onFilterChange={mockOnFilterChange} 
                onSortChange={mockOnSortChange} 
                isMobile={false} 
            />
        );
        
        fireEvent.click(screen.getByText('Filter'));
        
        // Find checkbox for Alice
        const aliceCheckbox = screen.getByLabelText('Alice');
        fireEvent.click(aliceCheckbox);
        
        expect(mockOnFilterChange).toHaveBeenCalled();
        const calledArgs = mockOnFilterChange.mock.calls[0][0];
        expect(calledArgs.owner).toContain('Alice');
    });

    it('should toggle sort dropdown and select sort option', () => {
         render(
            <TableControls 
                data={mockData} 
                onFilterChange={mockOnFilterChange} 
                onSortChange={mockOnSortChange} 
                isMobile={false} 
            />
        );
        
        fireEvent.click(screen.getByText('Sort'));
        expect(screen.getByText('Sort By')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Owner'));
        
        expect(mockOnSortChange).toHaveBeenCalledWith('owner', expect.any(String));
        
        // Dropdown should close
        expect(screen.queryByText('Sort By')).not.toBeInTheDocument();
    });
});
