'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Account } from '@/types/account';
import { formatCurrency } from '@/utils/format';

interface AccountCardProps {
    account: Account;
    isDetailed?: boolean;
    onDelete?: () => void;
}

export default function AccountCard({ account, isDetailed = false, onDelete }: AccountCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleClick = () => {
        if (!isDetailed) {
            router.push(`/dashboard/accounts/${account.id}`);
        }
    };

    const handleDelete = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/accounts/${account.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            setShowDeleteModal(false);
            if (onDelete) {
                onDelete();
            }
            router.push('/dashboard/accounts');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <>
            <div
                className={`account-card ${isDetailed ? 'detailed' : ''}`}
                onClick={handleClick}
            >
                <div className="account-info">
                    <h3>{account.name}</h3>
                    <span className="account-currency">{account.currency}</span>
                </div>
                <div className="account-balance">
                    {formatCurrency(account.balance, account.currency)}
                </div>
                {isDetailed && (
                    <button
                        className="delete-account-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(true);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                )}
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Удалить счет</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <p>Вы уверены, что хотите удалить счет "{account.name}"? Это действие нельзя отменить.</p>
                        <div className="modal-actions">
                            <button
                                className="button-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="button-danger"
                                onClick={handleDelete}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 