import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
    it('should render copyright text correctly', () => {
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByRole('contentinfo')).toHaveTextContent(`© ${currentYear} Vishwajeet Kondi`);
    });
});
