'use client';

import { useState, useEffect } from 'react';
import { Account } from '@/types';
import { fetchWithAuth } from '@/lib/auth';
import '@/styles/transfer-form.css';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
    onSuccess: () => void;
}

interface ExchangeRate {
    from: string;
    to: string;
    rate: number;
}

export default function TransferModal({
    isOpen,
    onClose,
    accounts,
    onSuccess,
}: TransferModalProps) {
    const [fromAccount, setFromAccount] = useState<number | ''>('');
    const [toAccount, setToAccount] = useState<number | ''>('');
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [exchangeRate, setExchangeRate] = useState<number | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

    const fromAccountData = accounts.find(acc => acc.id === fromAccount);
    const toAccountData = accounts.find(acc => acc.id === toAccount);

    useEffect(() => {
        if (fromAccount && toAccount && amount && fromAccountData?.currency !== toAccountData?.currency) {
            fetchExchangeRate(fromAccountData!.currency, toAccountData!.currency);
        } else {
            setExchangeRate('');
            setConvertedAmount(null);
        }
    }, [fromAccount, toAccount, amount]);

    const fetchExchangeRate = async (from: string, to: string) => {
        try {
            const response = await fetchWithAuth(`/api/exchange-rate?from=${from}&to=${to}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch exchange rate');
            }
            const data = await response.json();
            setExchangeRate(data.rate);
            calculateConvertedAmount(Number(amount), data.rate);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            setError('Не удалось получить курс валют. Введите курс вручную.');
        }
    };

    const calculateConvertedAmount = (amount: number, rate: number) => {
        setConvertedAmount(amount * rate);
    };

    const handleExchangeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setExchangeRate(value === '' ? '' : Number(value));
        if (value && amount) {
            calculateConvertedAmount(Number(amount), Number(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromAccount || !toAccount || !amount) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchWithAuth('/api/transactions/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from_account_id: fromAccount,
                    to_account_id: toAccount,
                    amount: Number(amount),
                    description,
                    exchange_rate: exchangeRate ? Number(exchangeRate) : undefined,
                    date: new Date().toISOString(),
                    type: 'expense',
                    category: 'Transfer'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create transfer');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating transfer:', error);
            setError(error instanceof Error ? error.message : 'Не удалось выполнить перевод. Пожалуйста, попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="transfer-form-container">
                <div className="modal-header">
                    <h2 className="transfer-form-title">Перевод между счетами</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="transfer-form-group">
                        <label htmlFor="fromAccount" className="transfer-form-label">С какого счета</label>
                        <select
                            id="fromAccount"
                            className="transfer-form-select"
                            value={fromAccount}
                            onChange={(e) => setFromAccount(e.target.value ? Number(e.target.value) : '')}
                            required
                        >
                            <option value="">Выберите счет</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name} ({account.currency})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="transfer-form-group">
                        <label htmlFor="toAccount" className="transfer-form-label">На какой счет</label>
                        <select
                            id="toAccount"
                            className="transfer-form-select"
                            value={toAccount}
                            onChange={(e) => setToAccount(e.target.value ? Number(e.target.value) : '')}
                            required
                        >
                            <option value="">Выберите счет</option>
                            {accounts
                                .filter((account) => account.id !== fromAccount)
                                .map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} ({account.currency})
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="transfer-form-group">
                        <label htmlFor="amount" className="transfer-form-label">Сумма</label>
                        <div className="transfer-form-amount-group">
                            <input
                                type="number"
                                id="amount"
                                className="transfer-form-input transfer-form-amount-input"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                            />
                            {fromAccountData && (
                                <span className="transfer-form-currency">{fromAccountData.currency}</span>
                            )}
                        </div>
                    </div>

                    {fromAccountData?.currency !== toAccountData?.currency && (
                        <div className="transfer-form-group">
                            <label htmlFor="exchangeRate" className="transfer-form-label">Курс конвертации</label>
                            <input
                                type="number"
                                id="exchangeRate"
                                className="transfer-form-input"
                                value={exchangeRate}
                                onChange={handleExchangeRateChange}
                                min="0"
                                step="0.0001"
                                required
                            />
                            <div className="transfer-form-exchange-rate">
                                {convertedAmount !== null && toAccountData && (
                                    <p>
                                        Итоговая сумма: {convertedAmount.toFixed(2)} {toAccountData.currency}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="transfer-form-group">
                        <label htmlFor="description" className="transfer-form-label">Описание</label>
                        <input
                            type="text"
                            id="description"
                            className="transfer-form-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Например: Перевод на основной счет"
                        />
                    </div>

                    {error && <div className="transfer-form-error">{error}</div>}

                    <div className="transfer-form-buttons">
                        <button type="button" className="transfer-form-button transfer-form-button-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="transfer-form-button transfer-form-button-primary" disabled={isLoading}>
                            {isLoading ? 'Выполняется...' : 'Выполнить перевод'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 