import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthProvider from './AuthProvider';
import { SessionProvider } from "next-auth/react";

// Mock SessionProvider
vi.mock("next-auth/react", () => ({
    SessionProvider: ({ children }: any) => <div data-testid="session-provider">{children}</div>,
}));

describe('AuthProvider', () => {
    it('should wrap children in SessionProvider', () => {
        render(
            <AuthProvider>
                <div>Child</div>
            </AuthProvider>
        );
        
        expect(screen.getByTestId('session-provider')).toBeInTheDocument();
        expect(screen.getByText('Child')).toBeInTheDocument();
    });
});
