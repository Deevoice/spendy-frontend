'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Account, Category, Transaction } from '@/types';
import { getAccounts, getCategories, getTransactions } from '@/api';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddCategoryModal from '@/components/AddCategoryModal';
import AddAccountModal from '@/components/AddAccountModal';
import TransferModal from '@/components/TransferModal';
import TransactionList from '@/components/TransactionList';
import { BalanceBlock } from '@/components/BalanceBlock';
import { TimeFilter, TimePeriod } from '@/components/TimeFilter';
import DashboardTitle from '@/components/DashboardTitle';
import '@/styles/dashboard.css';
import '@/styles/buttons.css';

export default function Dashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
    const [selectedTransactionType, setSelectedTransactionType] = useState<'all' | 'income' | 'expense'>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

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
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить данные');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        const updateTransactions = async () => {
            if (!user || !selectedPeriod) return;

            try {
                // Parse account ID only if it's not 'all'
                let accountId: number | undefined = undefined;
                if (selectedAccountId !== 'all') {
                    const parsed = parseInt(selectedAccountId);
                    if (!isNaN(parsed) && parsed > 0) {
                        accountId = parsed;
                    }
                }

                console.log('useEffect: Updating transactions with:', { period: selectedPeriod, accountId }); // Debug log
                const transactionsData = await getTransactions(selectedPeriod, accountId);
                console.log('useEffect: Received transactions:', transactionsData); // Debug log
                setTransactions(transactionsData);
            } catch (err) {
                console.error('Ошибка при обновлении транзакций:', err);
            }
        };

        updateTransactions();
    }, [selectedAccountId, selectedPeriod, user]);

    const handleTransactionUpdate = async () => {
        console.log('handleTransactionUpdate: Starting update with params:', { period: selectedPeriod, accountId: selectedAccountId });
        try {
            const accountId = selectedAccountId !== 'all' ? parseInt(selectedAccountId) : undefined;
            if (selectedAccountId !== 'all' && (!accountId || isNaN(accountId))) {
                console.error('Invalid account ID:', selectedAccountId);
                return;
            }

            // Обновляем и транзакции, и счета
            const [transactionsData, accountsData] = await Promise.all([
                getTransactions(selectedPeriod, accountId),
                getAccounts()
            ]);

            console.log('handleTransactionUpdate: Received transactions:', transactionsData); // Debug log
            console.log('handleTransactionUpdate: Received accounts:', accountsData); // Debug log

            setTransactions(transactionsData);
            setAccounts(accountsData);
        } catch (error) {
            console.error('Error updating transactions:', error);
        }
    };

    const handleTransactionTypeSelect = (type: 'all' | 'income' | 'expense') => {
        setSelectedTransactionType(type);
    };

    const handlePeriodChange = (period: TimePeriod) => {
        setSelectedPeriod(period);
        if (period !== 'custom') {
            setCustomStartDate(null);
            setCustomEndDate(null);
        }
    };

    const handleCustomDateChange = (start: Date | null, end: Date | null) => {
        setCustomStartDate(start);
        setCustomEndDate(end);
    };

    const getFilteredTransactions = () => {
        let filtered = [...transactions]; // Создаем копию массива

        console.log('Initial transactions:', filtered.map(t => ({
            id: t.id,
            date: t.date,
            description: t.description
        })));

        // Фильтрация по типу транзакции
        if (selectedTransactionType !== 'all') {
            filtered = filtered.filter(t => t.type === selectedTransactionType);
        }

        // Фильтрация по периоду
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Устанавливаем время на начало дня

        console.log('Filtering by period:', {
            selectedPeriod,
            now: now.toISOString()
        });

        switch (selectedPeriod) {
            case 'day':
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    const isIncluded = transactionDate.getTime() === now.getTime();
                    console.log('Day filter:', {
                        transactionId: t.id,
                        transactionDate: transactionDate.toISOString(),
                        isIncluded
                    });
                    return isIncluded;
                });
                break;
            case 'week':
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    const isIncluded = transactionDate >= sevenDaysAgo;
                    console.log('Week filter:', {
                        transactionId: t.id,
                        transactionDate: transactionDate.toISOString(),
                        isIncluded
                    });
                    return isIncluded;
                });
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    const isIncluded = transactionDate >= startOfMonth;
                    console.log('Month filter:', {
                        transactionId: t.id,
                        transactionDate: transactionDate.toISOString(),
                        isIncluded
                    });
                    return isIncluded;
                });
                break;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    const isIncluded = transactionDate >= startOfYear;
                    console.log('Year filter:', {
                        transactionId: t.id,
                        transactionDate: transactionDate.toISOString(),
                        isIncluded
                    });
                    return isIncluded;
                });
                break;
            case 'custom':
                if (customStartDate && customEndDate) {
                    const start = new Date(customStartDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(customEndDate);
                    end.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(t => {
                        const transactionDate = new Date(t.date);
                        transactionDate.setHours(0, 0, 0, 0);
                        const isIncluded = transactionDate >= start && transactionDate <= end;
                        console.log('Custom filter:', {
                            transactionId: t.id,
                            transactionDate: transactionDate.toISOString(),
                            isIncluded
                        });
                        return isIncluded;
                    });
                }
                break;
        }

        // Сортируем транзакции по дате (новые сверху)
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        console.log('Final filtered transactions:', filtered.map(t => ({
            id: t.id,
            date: t.date,
            description: t.description
        })));

        return filtered;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.querySelector('.dashboard-actions-dropdown');
            const toggle = document.querySelector('.dashboard-actions-toggle');

            if (dropdown && toggle && !dropdown.contains(event.target as Node) && !toggle.contains(event.target as Node)) {
                setIsActionsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (authLoading || loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
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
                <DashboardTitle />
                <div className="dashboard-actions">
                    <button
                        className="button button-primary dashboard-actions-toggle"
                        onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                    >
                        Действия
                    </button>
                    <div className={`dashboard-actions-dropdown ${isActionsDropdownOpen ? 'open' : ''}`}>
                        <button
                            className="button button-primary"
                            onClick={() => {
                                setShowTransactionModal(true);
                                setIsActionsDropdownOpen(false);
                            }}
                        >
                            Добавить транзакцию
                        </button>
                        <button
                            className="button button-secondary"
                            onClick={() => {
                                setShowCategoryModal(true);
                                setIsActionsDropdownOpen(false);
                            }}
                        >
                            Добавить категорию
                        </button>
                        <button
                            className="button button-success"
                            onClick={() => {
                                setShowAccountModal(true);
                                setIsActionsDropdownOpen(false);
                            }}
                        >
                            Добавить счет
                        </button>
                        <button
                            className="button button-primary"
                            onClick={() => {
                                setShowTransferModal(true);
                                setIsActionsDropdownOpen(false);
                            }}
                        >
                            Перевод между счетами
                        </button>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <BalanceBlock
                    accounts={accounts}
                    selectedAccount={selectedAccountId}
                    onAccountSelect={setSelectedAccountId}
                    transactions={transactions}
                    selectedTransactionType={selectedTransactionType}
                    onTransactionTypeSelect={handleTransactionTypeSelect}
                    selectedPeriod={selectedPeriod}
                    customStartDate={customStartDate}
                    customEndDate={customEndDate}
                />
            </div>

            <TimeFilter
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onCustomDateChange={handleCustomDateChange}
            />

            <div className="dashboard-content">
                {selectedAccountId === 'all' && (
                    <div className="accounts-section">
                        <h2>Счета</h2>
                        <div className="accounts-list">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="account-card"
                                    onClick={() => setSelectedAccountId(account.id.toString())}
                                >
                                    <div className="account-info">
                                        <h3>{account.name}</h3>
                                        <p className="account-currency">{account.currency}</p>
                                    </div>
                                    <p className="account-balance">
                                        {account.balance.toLocaleString('ru-RU', {
                                            style: 'currency',
                                            currency: account.currency
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <TransactionList
                    transactions={filteredTransactions}
                    accounts={accounts}
                    categories={categories}
                    onTransactionUpdate={handleTransactionUpdate}
                />
            </div>

            <AddTransactionModal
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
                accounts={accounts}
                categories={categories}
                onSuccess={handleTransactionUpdate}
            />

            <AddCategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onSuccess={() => {
                    setShowCategoryModal(false);
                    getCategories().then(setCategories);
                }}
            />

            <AddAccountModal
                isOpen={showAccountModal}
                onClose={() => setShowAccountModal(false)}
                onSuccess={() => {
                    setShowAccountModal(false);
                    getAccounts().then(setAccounts);
                }}
            />

            <TransferModal
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                accounts={accounts}
                onSuccess={handleTransactionUpdate}
            />
        </div>
    );
} 