'use client';

import { Account, Transaction } from '@/types';
import { TimePeriod } from './TimeFilter';
import '@/styles/dashboard.css';

interface BalanceBlockProps {
    accounts: Account[];
    selectedAccount: string;
    onAccountSelect: (accountId: string) => void;
    transactions: Transaction[];
    selectedTransactionType: 'all' | 'income' | 'expense';
    onTransactionTypeSelect: (type: 'all' | 'income' | 'expense') => void;
    selectedPeriod: TimePeriod;
    customStartDate: Date | null;
    customEndDate: Date | null;
}

export function BalanceBlock({
    accounts,
    selectedAccount,
    onAccountSelect,
    transactions,
    selectedTransactionType,
    onTransactionTypeSelect,
    selectedPeriod,
    customStartDate,
    customEndDate,
}: BalanceBlockProps) {
    const getFilteredTransactions = () => {
        console.log('Initial transactions:', transactions.map(t => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            account_id: t.account_id,
            date: t.date
        })));
        let filtered = [...transactions];

        // Фильтрация по типу транзакции
        if (selectedTransactionType !== 'all') {
            filtered = filtered.filter(t => t.type === selectedTransactionType);
            console.log('After type filter:', filtered.map(t => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                account_id: t.account_id
            })));
        }

        // Фильтрация по периоду
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
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(customEndDate);
                    end.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(t => {
                        const transactionDate = new Date(t.date);
                        transactionDate.setHours(0, 0, 0, 0);
                        return transactionDate >= start && transactionDate <= end;
                    });
                }
                break;
        }
        console.log('After period filter:', filtered.map(t => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            account_id: t.account_id
        })));

        // Распределяем транзакции по счетам
        if (accounts.length > 0) {
            // Создаем копию транзакций для каждого счета
            const transactionsByAccount = accounts.flatMap(account =>
                filtered.map(transaction => ({
                    ...transaction,
                    account_id: account.id
                }))
            );
            filtered = transactionsByAccount;
        }

        // Фильтрация по выбранному счету
        if (selectedAccount !== 'all') {
            const selectedAccountId = parseInt(selectedAccount);
            console.log('Filtering by account ID:', selectedAccountId);
            console.log('Available accounts:', accounts.map(a => ({
                id: a.id,
                name: a.name,
                currency: a.currency
            })));
            console.log('Transaction account IDs:', filtered.map(t => ({
                id: t.id,
                account_id: t.account_id,
                type: t.type,
                amount: t.amount
            })));

            filtered = filtered.filter(t => {
                const transactionAccountId = typeof t.account_id === 'string' ? parseInt(t.account_id) : t.account_id;
                return transactionAccountId === selectedAccountId;
            });
            console.log('After account filter:', filtered.map(t => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                account_id: t.account_id
            })));
        }

        return filtered;
    };

    const filteredTransactions = getFilteredTransactions();

    const getBalanceByCurrency = () => {
        const balances: { [key: string]: number } = {};

        if (selectedAccount === 'all') {
            // Суммируем балансы по всем счетам
            accounts.forEach(account => {
                balances[account.currency] = (balances[account.currency] || 0) + account.balance;
            });
        } else {
            // Показываем баланс выбранного счета
            const selectedAccountData = accounts.find(acc => acc.id.toString() === selectedAccount);
            if (selectedAccountData) {
                balances[selectedAccountData.currency] = selectedAccountData.balance;
            }
        }

        return balances;
    };

    const getIncomeByCurrency = () => {
        const income: { [key: string]: number } = {};
        const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
        console.log('Income transactions:', incomeTransactions.map(t => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            account_id: t.account_id
        })));

        if (selectedAccount === 'all') {
            // Суммируем доходы по всем счетам
            incomeTransactions.forEach(transaction => {
                const account = accounts.find(acc => {
                    const accId = typeof acc.id === 'string' ? parseInt(acc.id) : acc.id;
                    const transAccId = typeof transaction.account_id === 'string' ? parseInt(transaction.account_id) : transaction.account_id;
                    return accId === transAccId;
                });

                if (account) {
                    const amount = parseFloat(transaction.amount.toString());
                    if (!isNaN(amount)) {
                        if (!income[account.currency]) {
                            income[account.currency] = 0;
                        }
                        income[account.currency] += amount;
                        console.log(`Adding income: ${amount} ${account.currency}, new total: ${income[account.currency]}`);
                    }
                } else {
                    console.log('Account not found for transaction:', {
                        transactionId: transaction.id,
                        accountId: transaction.account_id,
                        availableAccounts: accounts.map(a => ({ id: a.id, name: a.name }))
                    });
                }
            });
        } else {
            // Показываем доходы по выбранному счету
            const selectedAccountId = parseInt(selectedAccount);
            const account = accounts.find(acc => {
                const accId = typeof acc.id === 'string' ? parseInt(acc.id) : acc.id;
                return accId === selectedAccountId;
            });

            if (account) {
                const totalIncome = incomeTransactions
                    .filter(t => {
                        const transactionAccountId = typeof t.account_id === 'string' ? parseInt(t.account_id) : t.account_id;
                        return transactionAccountId === selectedAccountId;
                    })
                    .reduce((sum, t) => {
                        const amount = parseFloat(t.amount.toString());
                        return sum + (isNaN(amount) ? 0 : amount);
                    }, 0);
                income[account.currency] = totalIncome;
                console.log(`Selected account income: ${totalIncome} ${account.currency}`);
            }
        }

        console.log('Final income calculations:', income);
        return income;
    };

    const getExpensesByCurrency = () => {
        const expenses: { [key: string]: number } = {};
        const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
        console.log('Expense transactions:', expenseTransactions);

        if (selectedAccount === 'all') {
            // Суммируем расходы по всем счетам
            expenseTransactions.forEach(transaction => {
                const account = accounts.find(acc => {
                    const accId = typeof acc.id === 'string' ? parseInt(acc.id) : acc.id;
                    const transAccId = typeof transaction.account_id === 'string' ? parseInt(transaction.account_id) : transaction.account_id;
                    return accId === transAccId;
                });

                if (account) {
                    const amount = parseFloat(transaction.amount.toString());
                    if (!isNaN(amount)) {
                        if (!expenses[account.currency]) {
                            expenses[account.currency] = 0;
                        }
                        expenses[account.currency] += amount;
                        console.log(`Adding expense: ${amount} ${account.currency}, new total: ${expenses[account.currency]}`);
                    }
                } else {
                    console.log('Account not found for transaction:', {
                        transactionId: transaction.id,
                        accountId: transaction.account_id,
                        availableAccounts: accounts.map(a => ({ id: a.id, name: a.name }))
                    });
                }
            });
        } else {
            // Показываем расходы по выбранному счету
            const selectedAccountId = parseInt(selectedAccount);
            const account = accounts.find(acc => {
                const accId = typeof acc.id === 'string' ? parseInt(acc.id) : acc.id;
                return accId === selectedAccountId;
            });

            if (account) {
                const totalExpenses = expenseTransactions
                    .filter(t => {
                        const transactionAccountId = typeof t.account_id === 'string' ? parseInt(t.account_id) : t.account_id;
                        return transactionAccountId === selectedAccountId;
                    })
                    .reduce((sum, t) => {
                        const amount = parseFloat(t.amount.toString());
                        return sum + (isNaN(amount) ? 0 : amount);
                    }, 0);
                expenses[account.currency] = totalExpenses;
                console.log(`Selected account expenses: ${totalExpenses} ${account.currency}`);
            }
        }

        console.log('Final expense calculations:', expenses);
        return expenses;
    };

    const balances = getBalanceByCurrency();
    const income = getIncomeByCurrency();
    const expenses = getExpensesByCurrency();

    console.log('Final state:', {
        balances,
        income,
        expenses,
        selectedAccount,
        selectedPeriod,
        selectedTransactionType,
        accounts: accounts.map(a => ({ id: a.id, name: a.name, currency: a.currency })),
        transactions: filteredTransactions.map(t => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            account_id: t.account_id
        }))
    });

    return (
        <div className="dashboard-card">
            <div className="card-header">
                <h2>Баланс</h2>
                <select
                    value={selectedAccount}
                    onChange={(e) => onAccountSelect(e.target.value)}
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

            <div className="balance-section">
                {Object.entries(balances).map(([currency, amount]) => (
                    <div key={currency} className="balance-item">
                        <span className="balance-label">Баланс ({currency})</span>
                        <span className="balance-amount">
                            {amount.toLocaleString('ru-RU', {
                                style: 'currency',
                                currency: currency
                            })}
                        </span>
                    </div>
                ))}
            </div>
            <div className="income-expenses__section">
                <div className="income-section">
                    <h3>Доходы</h3>
                    {Object.entries(income).length > 0 ? (
                        Object.entries(income).map(([currency, amount]) => (
                            <div key={currency} className="income-item">
                                <span className="income-label">({currency})</span>
                                <span className="income-amount">
                                    {amount.toLocaleString('ru-RU', {
                                        style: 'currency',
                                        currency: currency
                                    })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="income-item">
                            <span className="income-label">Нет доходов за выбранный период</span>
                        </div>
                    )}
                </div>

                <div className="expenses-section">
                    <h3>Расходы</h3>
                    {Object.entries(expenses).length > 0 ? (
                        Object.entries(expenses).map(([currency, amount]) => (
                            <div key={currency} className="expense-item">
                                <span className="expense-label">({currency})</span>
                                <span className="expense-amount">
                                    {amount.toLocaleString('ru-RU', {
                                        style: 'currency',
                                        currency: currency
                                    })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="expense-item">
                            <span className="expense-label">Нет расходов за выбранный период</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
} 