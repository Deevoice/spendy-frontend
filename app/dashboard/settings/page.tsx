'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/styles/settings.css';

export default function SettingsPage() {
    const { logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [currency, setCurrency] = useState('RUB');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        transactions: true,
        reports: true
    });
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setCurrency(localStorage.getItem('currency') || 'RUB');
        setNotifications(JSON.parse(localStorage.getItem('notifications') || '{"email":true,"push":true,"transactions":true,"reports":true}'));
    }, []);

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        setSuccess(t('success'));
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value;
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    const handleNotificationChange = (type: string) => {
        const newNotifications = {
            ...notifications,
            [type]: !notifications[type as keyof typeof notifications]
        };
        setNotifications(newNotifications);
        localStorage.setItem('notifications', JSON.stringify(newNotifications));
    };

    const handleLanguageChange = (newLanguage: 'ru' | 'en') => {
        setLanguage(newLanguage);
        setSuccess(t('success'));
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div className="settings">
            <h1 className="settings-title">{t('settings')}</h1>

            {success && <div className="success-message">{success}</div>}

            <div className="settings-section">
                <div className="card">
                    <h2>{t('theme')}</h2>
                    <div className="settings-options">
                        <button
                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            {t('light')}
                        </button>
                        <button
                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            {t('dark')}
                        </button>
                        <button
                            className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('system')}
                        >
                            {t('system')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <div className="card">
                    <h2>{t('language')}</h2>
                    <div className="settings-options">
                        <button
                            className={`language-option ${language === 'ru' ? 'active' : ''}`}
                            onClick={() => handleLanguageChange('ru')}
                        >
                            Русский
                        </button>
                        <button
                            className={`language-option ${language === 'en' ? 'active' : ''}`}
                            onClick={() => handleLanguageChange('en')}
                        >
                            English
                        </button>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h2>Язык и валюта</h2>
                <div className="card">
                    <div className="form-group">
                        <label>Основная валюта</label>
                        <select value={currency} onChange={handleCurrencyChange}>
                            <option value="RUB">Рубль (₽)</option>
                            <option value="USD">Доллар ($)</option>
                            <option value="EUR">Евро (€)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h2>Уведомления</h2>
                <div className="card">
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={() => handleNotificationChange('email')}
                            />
                            Email-уведомления
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={notifications.push}
                                onChange={() => handleNotificationChange('push')}
                            />
                            Push-уведомления
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={notifications.transactions}
                                onChange={() => handleNotificationChange('transactions')}
                            />
                            Уведомления о транзакциях
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={notifications.reports}
                                onChange={() => handleNotificationChange('reports')}
                            />
                            Еженедельные отчеты
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h2>Аккаунт</h2>
                <div className="card">
                    <button className="logout-button" onClick={logout}>
                        Выйти из аккаунта
                    </button>
                </div>
            </div>
        </div>
    );
} 