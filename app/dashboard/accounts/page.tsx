'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Account } from '@/types';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '@/api';
import '@/styles/accounts.css';

export default function AccountsPage() {
    const { t } = useLanguage();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        currency: 'RUB',
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const data = await getAccounts();
            setAccounts(data);
        } catch (err) {
            setError('Ошибка при загрузке счетов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const accountData = {
                ...formData,
                balance: parseFloat(formData.balance),
            };

            if (editingAccount) {
                await updateAccount(editingAccount.id, accountData);
            } else {
                await createAccount(accountData);
            }

            fetchAccounts();
            setIsModalOpen(false);
            setEditingAccount(null);
            setFormData({ name: '', balance: '', currency: 'RUB' });
        } catch (err) {
            setError('Ошибка при сохранении счета');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (account: Account) => {
        setEditingAccount(account);
        setFormData({
            name: account.name,
            balance: String(account.balance),
            currency: account.currency,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить этот счет?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await deleteAccount(id);
            fetchAccounts();
        } catch (err) {
            setError('Ошибка при удалении счета');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">{t('loading')}</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="accounts-page">
            <div className="accounts-header">
                <h1>{t('accounts_title')}</h1>
                <button
                    className="btn-primary"
                    onClick={() => {
                        setEditingAccount(null);
                        setFormData({ name: '', balance: '', currency: 'RUB' });
                        setIsModalOpen(true);
                    }}
                >
                    {t('add_account')}
                </button>
            </div>

            <div className="accounts-grid">
                {accounts.map((account) => (
                    <div key={account.id} className="account-card">
                        <div className="account-info">
                            <h3>{account.name}</h3>
                            <p className="account-balance">
                                {account.balance} {account.currency}
                            </p>
                        </div>
                        <div className="account-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => handleEdit(account)}
                            >
                                {t('edit')}
                            </button>
                            <button
                                className="btn-danger"
                                onClick={() => handleDelete(account.id)}
                            >
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{editingAccount ? t('edit_account') : t('add_account')}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">{t('account_name')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="balance">{t('balance')}</label>
                                <input
                                    type="number"
                                    id="balance"
                                    value={formData.balance}
                                    onChange={(e) =>
                                        setFormData({ ...formData, balance: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="currency">{t('currency')}</label>
                                <select
                                    id="currency"
                                    value={formData.currency}
                                    onChange={(e) =>
                                        setFormData({ ...formData, currency: e.target.value })
                                    }
                                >
                                    <option value="RUB">RUB</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingAccount ? t('save') : t('add')}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 