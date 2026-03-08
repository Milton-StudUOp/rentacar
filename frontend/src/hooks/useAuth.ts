import { createContext, useContext } from 'react';

export interface User {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    role: 'ADMIN' | 'CLIENT';
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (login: string, password: string) => Promise<void>;
    register: (data: { name: string; phone: string; email?: string; password: string }) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
