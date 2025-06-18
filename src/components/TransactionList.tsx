'use client';

import { useState } from 'react';
import { Transaction, Account, Category } from '@/types';
import TransactionModal from './TransactionModal';
import TransferModal from './TransferModal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TransactionListProps {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    onTransactionUpdate: () => void;
}

const TRANSACTIONS_PER_PAGE = 10;

export default function TransactionList({
    transactions,
    accounts,
    categories,
    onTransactionUpdate,
}: TransactionListProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setSelectedTransaction(undefined);
        setIsModalOpen(false);
    };

    const formatAmount = (amount: number, type: string, accountId: number) => {
        const account = accounts.find(acc => acc.id === accountId);
        const currency = account?.currency || 'RUB';

        const formattedAmount = amount.toLocaleString('ru-RU', {
            style: 'currency',
            currency: currency,
        });

        return type === 'income' ? `+${formattedAmount}` : `-${formattedAmount}`;
    };

    const getCategoryColor = (category: string) => {
        const foundCategory = categories.find(cat => cat.name === category);
        return foundCategory?.color || 'var(--text-secondary)';
    };

    const filteredTransactions = transactions.filter(transaction => {
        const searchLower = searchQuery.toLowerCase();
        return (
            transaction.description?.toLowerCase().includes(searchLower) ||
            transaction.category.toLowerCase().includes(searchLower) ||
            formatAmount(transaction.amount, transaction.type, transaction.account_id).toLowerCase().includes(searchLower)
        );
    });

    const displayedTransactions = showAll
        ? filteredTransactions
        : filteredTransactions.slice(0, TRANSACTIONS_PER_PAGE);

    const hasMoreTransactions = filteredTransactions.length > TRANSACTIONS_PER_PAGE;

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <h2>Транзакции</h2>
                <div className="transactions-search">
                    <input
                        type="text"
                        placeholder="Поиск транзакций..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="transactions-list">
                {filteredTransactions.length === 0 ? (
                    <div className="no-transactions">
                        <p>{searchQuery ? 'Транзакции не найдены' : 'Нет транзакций'}</p>
                    </div>
                ) : (
                    <>
                        <div className="transactions-list">
                            {displayedTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="transaction-card"
                                    onClick={() => handleEdit(transaction)}
                                >
                                    <div className="transaction-info">
                                        <div className="transaction-category" style={{ color: getCategoryColor(transaction.category) }}>
                                            {transaction.category}
                                        </div>
                                        <h3>{transaction.description || 'Без описания'}</h3>
                                        <span className="transaction-date">
                                            {format(new Date(transaction.date), 'd MMMM yyyy', { locale: ru })}
                                        </span>
                                    </div>
                                    <div className={`transaction-amount ${transaction.type}`}>
                                        {formatAmount(transaction.amount, transaction.type, transaction.account_id)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {hasMoreTransactions && (
                            <button
                                className="show-more-button"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll
                                    ? `Скрыть (показать первые ${TRANSACTIONS_PER_PAGE})`
                                    : `Показать все транзакции (${filteredTransactions.length})`
                                }
                            </button>
                        )}
                    </>
                )}
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleClose}
                accounts={accounts}
                categories={categories}
                transaction={selectedTransaction}
                onSuccess={onTransactionUpdate}
            />

            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                accounts={accounts}
                onSuccess={onTransactionUpdate}
            />
        </div>
    );
} 