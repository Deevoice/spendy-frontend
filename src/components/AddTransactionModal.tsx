import { useState } from 'react';
import { Account, Category, Transaction } from '@/types';
import { createTransaction } from '@/api';
import Modal from './Modal';
import '@/styles/forms.css';
import '@/styles/buttons.css';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
    categories: Category[];
    onSuccess: () => void;
}

export default function AddTransactionModal({
    isOpen,
    onClose,
    accounts,
    categories,
    onSuccess,
}: AddTransactionModalProps) {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        return new Date(year, month, day);
    });
    const [accountId, setAccountId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!amount || !category || !description || !accountId) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        const selectedCategory = categories.find(c => c.id === parseInt(category));
        if (!selectedCategory) {
            setError('Выбранная категория не найдена');
            return;
        }

        // Создаем дату в UTC
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const utcDate = new Date(Date.UTC(year, month, day));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date > today) {
            setError('Нельзя создавать транзакции на будущую дату');
            return;
        }

        const transactionData = {
            amount: parseFloat(amount),
            type,
            category: selectedCategory.name,
            category_id: selectedCategory.id,
            description,
            date: utcDate.toISOString(),
            account_id: parseInt(accountId)
        };

        console.log('Creating transaction with data:', {
            ...transactionData,
            localDate: date.toLocaleString(),
            utcDate: utcDate.toISOString()
        });

        try {
            setLoading(true);
            await createTransaction(transactionData);
            console.log('Transaction created successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating transaction:', error);
            setError('Ошибка при создании транзакции');
        } finally {
            setLoading(false);
        }
    };

    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newDate = new Date(year, month - 1, day);
        setDate(newDate);
    };

    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Добавить транзакцию">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Тип</label>
                    <select
                        className="form-select"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                    >
                        <option value="income">Доход</option>
                        <option value="expense">Расход</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Сумма</label>
                    <input
                        type="number"
                        className="form-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="Введите сумму"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Описание</label>
                    <input
                        type="text"
                        className="form-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Дата</label>
                    <input
                        type="date"
                        className="form-input"
                        value={formatDateForInput(date)}
                        onChange={handleDateChange}
                        max={formatDateForInput(new Date())}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Счет</label>
                    <select
                        className="form-select"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                    >
                        <option value="">Выберите счет</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Категория</label>
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Выберите категорию</option>
                        {filteredCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-actions">
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={loading}
                    >
                        {loading ? 'Создание...' : 'Создать транзакцию'}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 