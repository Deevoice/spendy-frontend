import { useState } from 'react';
import { createFinancialGoal } from '@/api';
import '@/styles/modal.css';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddGoalModal({
    isOpen,
    onClose,
    onSuccess
}: AddGoalModalProps) {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!name || !targetAmount || !targetDate) {
                throw new Error('Пожалуйста, заполните все обязательные поля');
            }

            const targetAmountNumber = parseFloat(targetAmount);
            const currentAmountNumber = parseFloat(currentAmount || '0');

            if (isNaN(targetAmountNumber) || targetAmountNumber <= 0) {
                throw new Error('Введите корректную целевую сумму');
            }

            if (isNaN(currentAmountNumber) || currentAmountNumber < 0) {
                throw new Error('Введите корректную текущую сумму');
            }

            if (currentAmountNumber > targetAmountNumber) {
                throw new Error('Текущая сумма не может быть больше целевой');
            }

            const selectedDate = new Date(targetDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                throw new Error('Дата достижения цели не может быть в прошлом');
            }

            await createFinancialGoal({
                name,
                target_amount: targetAmountNumber,
                deadline: new Date(targetDate).toISOString(),
                monthly_contribution: Math.ceil((targetAmountNumber - (parseFloat(currentAmount) || 0)) / Math.max(1, Math.ceil((new Date(targetDate).getFullYear() - new Date().getFullYear()) * 12 + (new Date(targetDate).getMonth() - new Date().getMonth()))))
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
                    <h2>Добавить финансовую цель</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Название цели</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например: Накопить на отпуск"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="targetAmount">Целевая сумма</label>
                        <input
                            type="number"
                            id="targetAmount"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="Введите целевую сумму"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentAmount">Текущая сумма</label>
                        <input
                            type="number"
                            id="currentAmount"
                            value={currentAmount}
                            onChange={(e) => setCurrentAmount(e.target.value)}
                            placeholder="Введите текущую сумму"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="targetDate">Дата достижения цели</label>
                        <input
                            type="date"
                            id="targetDate"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
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