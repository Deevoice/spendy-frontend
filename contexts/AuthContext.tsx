'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = {
    id: string;
    full_name: string;
    email: string;
    avatar?: string | null;
    role?: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (full_name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/', '/login', '/register'];
const API_URL = 'http://localhost:8000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const clearError = () => setError(null);

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    const verifyToken = async (token: string): Promise<User | null> => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                return {
                    id: userData.id.toString(),
                    full_name: userData.full_name,
                    email: userData.email,
                    avatar: userData.avatar,
                    role: userData.role,
                };
            }
            return null;
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    };

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('access_token');

            if (!token) {
                setUser(null);
                if (!PUBLIC_PATHS.includes(pathname) && !isLoading) {
                    router.replace('/login');
                }
                return;
            }

            const userData = await verifyToken(token);

            if (userData) {
                setUser(userData);
                if (PUBLIC_PATHS.includes(pathname) && !isLoading) {
                    router.replace('/dashboard');
                }
            } else {
                localStorage.removeItem('access_token');
                setUser(null);
                if (!PUBLIC_PATHS.includes(pathname) && !isLoading) {
                    router.replace('/login');
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setError('Unable to connect to the server. Please try again later.');
            setUser(null);
            if (!PUBLIC_PATHS.includes(pathname) && !isLoading) {
                router.replace('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, [pathname]);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const tokenData = await response.json();
            if (!tokenData.access_token) {
                throw new Error('No access token received');
            }

            localStorage.setItem('access_token', tokenData.access_token);

            const userData = await verifyToken(tokenData.access_token);
            if (!userData) {
                throw new Error('Failed to verify user after login');
            }

            setUser(userData);
            router.replace('/dashboard');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            throw error;
        }
    };

    const register = async (full_name: string, email: string, password: string) => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ full_name, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            await login(email, password);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            setUser(null);
            router.replace('/login');
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 