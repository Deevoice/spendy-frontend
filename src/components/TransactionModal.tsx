'use client';

import { useState, useEffect } from 'react';
import { Transaction, Account, Category } from '@/types';
import { createTransaction, updateTransaction, deleteTransaction } from '@/api';
import '@/styles/transaction-form.css';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
    categories: Category[];
    transaction?: Transaction;
    onSuccess: () => void;
}

export default function TransactionModal({
    isOpen,
    onClose,
    accounts,
    categories,
    transaction,
    onSuccess,
}: TransactionModalProps) {
    const [formData, setFormData] = useState({
        account_id: '',
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (transaction) {
            setFormData({
                account_id: String(transaction.account_id),
                amount: String(transaction.amount),
                type: transaction.type,
                category: transaction.category,
                description: transaction.description || '',
                date: new Date(transaction.date).toISOString().split('T')[0],
            });
        } else {
            const defaultAccount = accounts.length > 0 ? String(accounts[0].id) : '';
            const defaultCategory = categories.length > 0 ? categories[0].name : '';

            setFormData({
                account_id: defaultAccount,
                amount: '',
                type: 'expense',
                category: defaultCategory,
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [transaction, accounts, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const transactionData = {
                ...formData,
                amount: Number(formData.amount),
            };

            if (transaction) {
                await updateTransaction(transaction.id, transactionData);
            } else {
                await createTransaction(transactionData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError('Ошибка при сохранении транзакции');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!transaction) return;

        if (!confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await deleteTransaction(transaction.id);
            onSuccess();
            onClose();
        } catch (err) {
            setError('Ошибка при удалении транзакции');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const selectedAccount = accounts.find(acc => acc.id === Number(formData.account_id));

    return (
        <div className="modal-overlay">
            <div className="transaction-form-container">
                <div className="modal-header">
                    <h2 className="transaction-form-title">
                        {transaction ? 'Редактировать транзакцию' : 'Новая транзакция'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="transaction-form-group">
                        <label htmlFor="account" className="transaction-form-label">Счет</label>
                        <select
                            id="account"
                            className="transaction-form-select"
                            value={formData.account_id}
                            onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                            required
                        >
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name} ({account.currency})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="transaction-form-group">
                        <label htmlFor="type" className="transaction-form-label">Тип</label>
                        <select
                            id="type"
                            className="transaction-form-select"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="expense">Расход</option>
                            <option value="income">Доход</option>
                        </select>
                    </div>

                    <div className="transaction-form-group">
                        <label htmlFor="category" className="transaction-form-label">Категория</label>
                        <select
                            id="category"
                            className="transaction-form-select"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            {categories
                                .filter(cat => cat.type === formData.type)
                                .map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="transaction-form-group">
                        <label htmlFor="amount" className="transaction-form-label">Сумма</label>
                        <div className="transaction-form-amount-group">
                            <input
                                type="number"
                                id="amount"
                                className="transaction-form-input transaction-form-amount-input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                min="0"
                                step="0.01"
                                required
                            />
                            {selectedAccount && (
                                <span className="transaction-form-currency">{selectedAccount.currency}</span>
                            )}
                        </div>
                    </div>

                    <div className="transaction-form-group">
                        <label htmlFor="description" className="transaction-form-label">Описание</label>
                        <input
                            type="text"
                            id="description"
                            className="transaction-form-input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Введите описание транзакции"
                        />
                    </div>

                    <div className="transaction-form-group">
                        <label htmlFor="date" className="transaction-form-label">Дата</label>
                        <input
                            type="date"
                            id="date"
                            className="transaction-form-input"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            max={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    {error && <div className="transaction-form-error">{error}</div>}

                    <div className="transaction-form-buttons">
                        {transaction && (
                            <button
                                type="button"
                                className="transaction-form-button transaction-form-button-danger"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Удалить
                            </button>
                        )}
                        <button
                            type="button"
                            className="transaction-form-button transaction-form-button-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="transaction-form-button transaction-form-button-primary"
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : (transaction ? 'Сохранить' : 'Создать')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 