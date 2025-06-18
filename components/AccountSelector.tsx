'use client';

import { useState, useRef, useEffect } from 'react';
import { Account } from '@/types/account';
import '@/styles/account-selector.css';

interface AccountSelectorProps {
    accounts: Account[];
    selectedAccount: string;
    onAccountSelect: (accountId: string) => void;
}

export default function AccountSelector({
    accounts,
    selectedAccount,
    onAccountSelect,
}: AccountSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const selectedAccountData = selectedAccount === 'all'
        ? { name: 'Все счета', balance: accounts.reduce((sum, acc) => sum + acc.balance, 0), currency: 'RUB' }
        : accounts.find(acc => acc.id.toString() === selectedAccount);

    return (
        <div className="account-selector" ref={dropdownRef}>
            <button
                className={`account-selector-button ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedAccountData?.name || 'Выберите счет'}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="account-selector-list">
                    <div
                        className={`account-selector-item ${selectedAccount === 'all' ? 'active' : ''}`}
                        onClick={() => {
                            onAccountSelect('all');
                            setIsOpen(false);
                        }}
                    >
                        <div className="account-selector-item-details">
                            <div className="account-selector-item-name">Все счета</div>
                            <div className="account-selector-item-balance">
                                {formatAmount(accounts.reduce((sum, acc) => sum + acc.balance, 0), 'RUB')}
                            </div>
                        </div>
                    </div>
                    <div className="account-selector-divider" />
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className={`account-selector-item ${selectedAccount === account.id.toString() ? 'active' : ''}`}
                            onClick={() => {
                                onAccountSelect(account.id.toString());
                                setIsOpen(false);
                            }}
                        >
                            <div className="account-selector-item-details">
                                <div className="account-selector-item-name">{account.name}</div>
                                <div className="account-selector-item-balance">
                                    {formatAmount(account.balance, account.currency)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 