'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Account, Category, Transaction } from '@/types';
import { getAccounts, getCategories, getTransactions } from '@/api';
import AddTransactionModal from '@/components/AddTransactionModal';
import { TimeFilter, TimePeriod } from '@/components/TimeFilter';
import DashboardTitle from '@/components/DashboardTitle';
import '@/styles/transactions.css';

export default function TransactionsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
    const [selectedTransactionType, setSelectedTransactionType] = useState<'all' | 'income' | 'expense'>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accountsData, categoriesData, transactionsData] = await Promise.all([
                    getAccounts(),
                    getCategories(),
                    getTransactions()
                ]);
                setAccounts(accountsData);
                setCategories(categoriesData);
                setTransactions(transactionsData);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleTransactionUpdate = async () => {
        try {
            const transactionsData = await getTransactions();
            setTransactions(transactionsData);
        } catch (err) {
            console.error('Error updating transactions:', err);
        }
    };

    const getFilteredTransactions = () => {
        let filtered = [...transactions];

        // Фильтр по типу транзакции
        if (selectedTransactionType !== 'all') {
            filtered = filtered.filter(t => t.type === selectedTransactionType);
        }

        // Фильтр по счету
        if (selectedAccountId !== 'all') {
            filtered = filtered.filter(t => t.account_id && t.account_id.toString() === selectedAccountId);
        }

        // Фильтр по периоду
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        switch (selectedPeriod) {
            case 'day':
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    return transactionDate.getTime() === now.getTime();
                });
                break;
            case 'week':
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    return transactionDate >= sevenDaysAgo;
                });
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    return transactionDate >= startOfMonth;
                });
                break;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    return transactionDate >= startOfYear;
                });
                break;
            case 'custom':
                if (customStartDate && customEndDate) {
                    const start = new Date(customStartDate);
                    const end = new Date(customEndDate);
                    start.setHours(0, 0, 0, 0);
                    end.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(t => {
                        const transactionDate = new Date(t.date);
                        return transactionDate >= start && transactionDate <= end;
                    });
                }
                break;
        }

        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const filteredTransactions = getFilteredTransactions();

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <DashboardTitle title="Транзакции" />
                <div className="dashboard-actions">
                    <button
                        className="button button-primary"
                        onClick={() => setShowTransactionModal(true)}
                    >
                        Добавить транзакцию
                    </button>
                </div>
            </div>

            <div className="transactions-filters">
                <div className="filter-row">
                    <div className="filter-group">
                        <select
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            className="account-select"
                        >
                            <option value="all">Все счета</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <select
                            value={selectedTransactionType}
                            onChange={(e) => setSelectedTransactionType(e.target.value as 'all' | 'income' | 'expense')}
                            className="transaction-type-select"
                        >
                            <option value="all">Все транзакции</option>
                            <option value="income">Доходы</option>
                            <option value="expense">Расходы</option>
                        </select>
                    </div>
                </div>

                <div className="time-filter-container">
                    <TimeFilter
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={setSelectedPeriod}
                        customStartDate={customStartDate}
                        customEndDate={customEndDate}
                        onCustomDateChange={(start, end) => {
                            setCustomStartDate(start);
                            setCustomEndDate(end);
                        }}
                    />
                </div>
            </div>

            <div className="transactions-list">
                {filteredTransactions.length === 0 ? (
                    <div className="no-transactions">
                        Нет транзакций за выбранный период
                    </div>
                ) : (
                    filteredTransactions.map((transaction) => {
                        const account = transaction.account_id ? accounts.find(acc => acc.id === transaction.account_id) : null;
                        const category = categories.find(cat => cat.name === transaction.category);

                        return (
                            <div key={transaction.id} className="transaction-item">
                                <div className="transaction-info">
                                    <div className="transaction-category">
                                        {category?.name || 'Без категории'}
                                    </div>
                                    <h3>{transaction.description || 'Без описания'}</h3>
                                    <div className="transaction-date">
                                        {new Date(transaction.date).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className="transaction-details">
                                    <div className="transaction-account">
                                        {account?.name || 'Неизвестный счет'}
                                    </div>
                                    <div className={`transaction-amount ${transaction.type}`}>
                                        {transaction.amount.toLocaleString('ru-RU', {
                                            style: 'currency',
                                            currency: account?.currency || 'RUB'
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <AddTransactionModal
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
                accounts={accounts}
                categories={categories}
                onSuccess={handleTransactionUpdate}
            />
        </div>
    );
} 