'use client';

import { useEffect } from 'react';
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        try {
            const theme = localStorage.getItem('theme') || 'system';
            let resolved = theme;
            if (theme === 'system') {
                resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            document.documentElement.classList.add(resolved);
        } catch (e) {
            console.error('Error setting theme:', e);
        }
    }, []);

    return (
        <LanguageProvider>
            <ThemeProvider>
                <AuthProvider>
                    <Toaster />
                    <Header />
                    <main className="main">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
            </ThemeProvider>
        </LanguageProvider>
    );
}