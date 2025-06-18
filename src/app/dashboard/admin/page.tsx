'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/styles/admin.css';

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'custom';
type Statistics = {
    totalUsers: number;
    totalVisits: number;
    totalTransactions: number;
    countries: { country: string; count: number }[];
};

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [timeRange, setTimeRange] = useState<TimeRange>('day');
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');
    const [statistics, setStatistics] = useState<Statistics>({
        totalUsers: 0,
        totalVisits: 0,
        totalTransactions: 0,
        countries: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStatistics();
    }, [timeRange, customStartDate, customEndDate]);

    const fetchStatistics = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/statistics?timeRange=day');
            if (response.status === 401) {
                setError(t('admin_unauthorized'));
                setIsLoading(false);
                return;
            }
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setError(t('error_fetching_statistics'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>{t('admin_dashboard')}</h1>

            <div className="time-range-selector">
                <button
                    className={timeRange === 'day' ? 'active' : ''}
                    onClick={() => setTimeRange('day')}
                >
                    {t('time_range_day')}
                </button>
                <button
                    className={timeRange === 'week' ? 'active' : ''}
                    onClick={() => setTimeRange('week')}
                >
                    {t('time_range_week')}
                </button>
                <button
                    className={timeRange === 'month' ? 'active' : ''}
                    onClick={() => setTimeRange('month')}
                >
                    {t('time_range_month')}
                </button>
                <button
                    className={timeRange === 'year' ? 'active' : ''}
                    onClick={() => setTimeRange('year')}
                >
                    {t('time_range_year')}
                </button>
                <button
                    className={timeRange === 'custom' ? 'active' : ''}
                    onClick={() => setTimeRange('custom')}
                >
                    {t('time_range_custom')}
                </button>

                {timeRange === 'custom' && (
                    <div className="custom-date-range">
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                        <span>{t('to')}</span>
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="loading">{t('loading')}</div>
            ) : (
                <>
                    <div className="statistics-grid">
                        <div className="stat-card">
                            <h3>{t('total_users')}</h3>
                            <p className="stat-number">{statistics.totalUsers}</p>
                        </div>
                        <div className="stat-card">
                            <h3>{t('total_visits')}</h3>
                            <p className="stat-number">{statistics.totalVisits}</p>
                        </div>
                        <div className="stat-card">
                            <h3>{t('total_transactions')}</h3>
                            <p className="stat-number">{statistics.totalTransactions}</p>
                        </div>
                    </div>

                    <div className="countries-section">
                        <h2>{t('visits_by_country')}</h2>
                        <div className="countries-list">
                            {statistics.countries.map((country, index) => (
                                <div key={index} className="country-item">
                                    <span className="country-name">{country.country}</span>
                                    <span className="country-count">{country.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="blog-management">
                        <h2>{t('blog_management')}</h2>
                        <button className="create-post-btn" onClick={() => window.location.href = '/dashboard/admin/blog/create'}>
                            {t('create_new_post')}
                        </button>
                    </div>

                    {error && <div className="error">{error}</div>}
                </>
            )}
        </div>
    );
} 