import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';
import * as RootContext from '@/context/RootContext';
import { RootContextType } from '@/context/RootContext';
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

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

vi.mock("next/link", () => {
    return {
        default: ({ children, href, onClick, className }: { children: React.ReactNode, href: string, onClick?: React.MouseEventHandler, className?: string }) => {
            return (
                <a href={href} onClick={onClick} className={className}>
                    {children}
                </a>
            );
        },
    };
});

describe('Header Component', () => {
    const mockUseRootContext = vi.mocked(RootContext.useRootContext);
    const mockUseSession = vi.mocked(useSession);
    const mockUsePathname = vi.mocked(usePathname);

    beforeEach(() => {
        vi.clearAllMocks();
        mockUsePathname.mockReturnValue("/");
        mockUseRootContext.mockReturnValue({ isMobile: false } as unknown as RootContextType);
    });

    it('should match the snapshot', () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" } as unknown as ReturnType<typeof useSession>);
        const { asFragment } = render(<Header title="Test App" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render the title', () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" } as unknown as ReturnType<typeof useSession>);
        render(<Header title="My Finance" />);
        expect(screen.getByText('My Finance')).toBeInTheDocument();
    });

    it('should render Sign In button when unauthenticated', () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" } as unknown as ReturnType<typeof useSession>);

        render(<Header />);
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });

    it('should render Home, Finances, and Sign Out when authenticated', () => {
        mockUseSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: "authenticated" } as unknown as ReturnType<typeof useSession>);

        render(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Finances')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('should call signIn when Sign In is clicked', () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" } as unknown as ReturnType<typeof useSession>);
        render(<Header />);

        fireEvent.click(screen.getByText('Sign In'));
        expect(signIn).toHaveBeenCalled();
    });

    it('should call signOut when Sign Out is clicked', () => {
        mockUseSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: "authenticated" } as unknown as ReturnType<typeof useSession>);
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
        mockUseRootContext.mockReturnValue({ isMobile: true } as unknown as RootContextType);
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" } as unknown as ReturnType<typeof useSession>);

        render(<Header />);
        expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
    });

    it('should toggle drawer on mobile', async () => {
        mockUseRootContext.mockReturnValue({ isMobile: true } as unknown as RootContextType);
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" } as unknown as ReturnType<typeof useSession>);

        render(<Header />);
        const toggleButton = screen.getByLabelText('Open navigation menu');

        fireEvent.click(toggleButton);
        expect(screen.getByText('Sign In')).toBeInTheDocument(); // Drawer item

        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);

        expect(screen.queryByText('✕')).not.toBeInTheDocument();
    });
});
