import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';
import * as RootContext from '@/context/RootContext';

// Mock the context hook
vi.mock('@/context/RootContext', () => ({
    useRootContext: vi.fn(),
}));

describe('Footer Component', () => {
    it('should render desktop view correctly', () => {
        vi.spyOn(RootContext, 'useRootContext').mockReturnValue({ isMobile: false } as any);
        
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByRole('contentinfo')).toHaveTextContent(`Copyright © ${currentYear} Vishwajeet Kondi. All rights reserved.`);
    });

    it('should render mobile view correctly', () => {
        vi.spyOn(RootContext, 'useRootContext').mockReturnValue({ isMobile: true } as any);
        
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        // in mobile, text is split into two paragraphs
        expect(screen.getByText(`Copyright © ${currentYear} Vishwajeet Kondi.`)).toBeInTheDocument();
        expect(screen.getByText('All rights reserved.')).toBeInTheDocument();
    });
});
