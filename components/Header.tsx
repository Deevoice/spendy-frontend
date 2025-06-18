'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user?.avatar) {
            console.log('Avatar URL:', user.avatar);
        }
    }, [user?.avatar]);

    const handleSignOut = async () => {
        try {
            await logout();
            setIsMenuOpen(false);
            window.location.href = '/login';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="header">
            <div className="container">
                <nav className="nav">
                    <Link href="/" className="logo">
                        Spendy
                    </Link>

                    <div className="nav-links">
                        {user ? (
                            <div className="user-menu" ref={menuRef}>
                                <button
                                    className="user-avatar-link"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.full_name || user.email}
                                            className="user-avatar-image"
                                            onError={(e) => {
                                                console.error('Error loading avatar:', e);
                                                const img = e.target as HTMLImageElement;
                                                img.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()
                                    )}
                                </button>
                                {isMenuOpen && (
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <span className="user-name">{user.full_name || user.email}</span>
                                            <span className="user-email">{user.email}</span>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            href="/dashboard"
                                            className={`dropdown-item ${pathname === '/dashboard' ? 'active' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="14" width="7" height="7"></rect>
                                                <rect x="3" y="14" width="7" height="7"></rect>
                                            </svg>
                                            Дашборд
                                        </Link>
                                        <Link
                                            href="/dashboard/accounts"
                                            className={`dropdown-item ${pathname === '/dashboard/accounts' ? 'active' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                                                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                                                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                                            </svg>
                                            Счета
                                        </Link>
                                        <Link
                                            href="/dashboard/transactions"
                                            className={`dropdown-item ${pathname === '/dashboard/transactions' ? 'active' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                                                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                                                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                                            </svg>
                                            Транзакции
                                        </Link>
                                        <Link
                                            href="/dashboard/categories"
                                            className={`dropdown-item ${pathname === '/dashboard/categories' ? 'active' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                                            </svg>
                                            Категории
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <div className="dropdown-item">
                                            <ThemeToggle />
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            href="/dashboard/settings"
                                            className="dropdown-item"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            Настройки
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            className="dropdown-item"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            Профиль
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="logout-button dropdown-item text-danger"
                                            onClick={handleSignOut}
                                            type="button"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login">Войти</Link>
                                <Link href="/register">Регистрация</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
} 