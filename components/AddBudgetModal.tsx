import { useState } from 'react';
import { Category } from '@/types';
import { createBudget } from '@/api';
import '@/styles/modal.css';

interface AddBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onSuccess: () => void;
}

export default function AddBudgetModal({
    isOpen,
    onClose,
    categories,
    onSuccess
}: AddBudgetModalProps) {
    const [categoryId, setCategoryId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [period, setPeriod] = useState<'month' | 'year'>('month');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!categoryId || !amount) {
                throw new Error('Пожалуйста, заполните все поля');
            }

            const amountNumber = parseFloat(amount);
            if (isNaN(amountNumber) || amountNumber <= 0) {
                throw new Error('Введите корректную сумму');
            }

            const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
            if (!selectedCategory) {
                throw new Error('Категория не найдена');
            }

            await createBudget({
                category: selectedCategory.name,
                amount: amountNumber,
                period
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Добавить бюджет</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="category">Категория</label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Сумма</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Введите сумму"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="period">Период</label>
                        <select
                            id="period"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value as 'month' | 'year')}
                            required
                        >
                            <option value="month">Месяц</option>
                            <option value="year">Год</option>
                        </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 