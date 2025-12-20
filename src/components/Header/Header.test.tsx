import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';
import * as RootContext from '@/context/RootContext';
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

// Mock dependencies
vi.mock('@/context/RootContext', () => ({
    useRootContext: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}));

// Mock Link since it's used
vi.mock("next/link", () => {
    return {
        default: ({ children, href, onClick, className }: any) => {
            return (
                <a href={href} onClick={onClick} className={className}>
                    {children}
                </a>
            );
        },
    };
});

describe('Header Component', () => {
    const mockUseRootContext = RootContext.useRootContext as any;
    const mockUseSession = useSession as any;
    const mockUsePathname = usePathname as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUsePathname.mockReturnValue("/");
        mockUseRootContext.mockReturnValue({ isMobile: false });
    });

    it('should match the snapshot', () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
        const { asFragment } = render(<Header title="Test App" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render the title', () => {
         mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
        render(<Header title="My Finance" />);
        expect(screen.getByText('My Finance')).toBeInTheDocument();
    });

    it('should render Sign In button when unauthenticated', () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
        
        render(<Header />);
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });

    it('should render Home, Finances, and Sign Out when authenticated', () => {
        mockUseSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: "authenticated" });
        
        render(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Finances')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('should call signIn when Sign In is clicked', () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
        render(<Header />);
        
        fireEvent.click(screen.getByText('Sign In'));
        expect(signIn).toHaveBeenCalled();
    });

    it('should call signOut when Sign Out is clicked', () => {
         mockUseSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: "authenticated" });
        render(<Header />);
        
        fireEvent.click(screen.getByText('Sign Out'));
        expect(signOut).toHaveBeenCalled();
    });

    it('should not render on /login page', () => {
        mockUsePathname.mockReturnValue("/login");
        const { container } = render(<Header />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should show drawer toggle on mobile', () => {
        mockUseRootContext.mockReturnValue({ isMobile: true });
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
        
        render(<Header />);
        expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
    });

    it('should toggle drawer on mobile', async () => {
        mockUseRootContext.mockReturnValue({ isMobile: true });
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
        
        render(<Header />);
        const toggleButton = screen.getByLabelText('Open navigation menu');
        
        // Open
        fireEvent.click(toggleButton);
        expect(screen.getByText('Sign In')).toBeInTheDocument(); // Drawer item
        
        // Close via close button (rendered inside drawer when open)
        // Note: The close button has text "✕", we can find by text or class. 
        // The implementation uses <button>✕</button>
        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);
        
        // Wait purely for state update if needed, but synchronous in React usually.
        // However, if the menu items are hidden, we check if they are gone.
        // In the implementation, if !isDrawerOpen, the drawer div is not rendered at all.
        expect(screen.queryByText('✕')).not.toBeInTheDocument();
    });
});
