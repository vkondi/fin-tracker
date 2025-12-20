import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from './Loader';

describe('Loader Component', () => {
    it('should not render anything when show is false', () => {
        const { container } = render(<Loader show={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render when show is true', () => {
        render(<Loader show={true} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render custom loading message', () => {
        const message = 'Please wait...';
        render(<Loader show={true} loadingMessage={message} />);
        expect(screen.getByText(message)).toBeInTheDocument();
    });
});
