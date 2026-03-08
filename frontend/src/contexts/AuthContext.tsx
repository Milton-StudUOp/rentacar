import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AuthContext, type User } from '../hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth/profile');
                setUser(res.data);
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (loginStr: string, password: string) => {
        const { data } = await api.post('/auth/login', { login: loginStr, password });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        if (data.user.role === 'ADMIN') {
            navigate('/admin');
        }
    };

    const register = async (regData: { name: string; phone: string; email?: string; password: string }) => {
        const { data } = await api.post('/auth/register', regData);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAdmin: user?.role === 'ADMIN',
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
