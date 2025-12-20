import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
}));

describe('ProtectedRoute', () => {
    const mockUseSession = useSession as any;
    const mockUseRouter = useRouter as any;
    const mockUsePathname = usePathname as any;
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRouter.mockReturnValue({ push: mockPush });
        mockUsePathname.mockReturnValue("/dashboard");
    });

    it('should render children if authenticated', () => {
        mockUseSession.mockReturnValue({ status: 'authenticated' });
        
        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it('should redirect to login if unauthenticated', () => {
        mockUseSession.mockReturnValue({ status: 'unauthenticated' });
        
        const { container } = render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        
        // Should not render content
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
        
        // Should redirect
        expect(mockPush).toHaveBeenCalledWith("/auth/signin?callbackUrl=/dashboard");
    });

     it('should render nothing while loading', () => {
        mockUseSession.mockReturnValue({ status: 'loading' });
        
        const { container } = render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        
        expect(container).toBeEmptyDOMElement();
    });
});
