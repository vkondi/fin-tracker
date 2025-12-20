import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ContentWrapper from './ContentWrapper';

describe('ContentWrapper', () => {
    it('should render children', () => {
        render(<ContentWrapper><div>Children</div></ContentWrapper>);
        expect(screen.getByText('Children')).toBeInTheDocument();
    });

    it('should apply custom classes', () => {
        const { container } = render(
            <ContentWrapper className="custom-class">
                <div>Children</div>
            </ContentWrapper>
        );
        
        // Structure is div.w-full -> div.max-w... .custom-class
        const innerDiv = container.firstChild?.firstChild;
        expect(innerDiv).toHaveClass('custom-class');
        expect(innerDiv).toHaveClass('max-w-[2200px]');
    });
});
