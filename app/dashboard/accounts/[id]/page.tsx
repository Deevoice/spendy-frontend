'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Account } from '@/types/account';
import AccountCard from '@/components/AccountCard';
import TransactionList from '@/components/TransactionList';
import { formatCurrency } from '@/utils/format';

export default function AccountPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            if (!user) return;

            try {
                const response = await fetch(`/api/accounts/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch account');
                }
                const data = await response.json();
                setAccount(data);
            } catch (error) {
                console.error('Error fetching account:', error);
                router.push('/dashboard/accounts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccount();
    }, [params.id, user, router]);

    const handleDelete = () => {
        // После удаления счета пользователь будет перенаправлен на страницу счетов
        // благодаря логике в компоненте AccountCard
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!account) {
        return null;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Детали счета</h1>
            </div>

            <div className="dashboard-grid">
                <AccountCard
                    account={account}
                    isDetailed={true}
                    onDelete={handleDelete}
                />
            </div>

            <div className="transactions-section">
                <h2>Транзакции</h2>
                <TransactionList accountId={account.id} />
            </div>
        </div>
    );
} 