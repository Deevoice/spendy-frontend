import { useState } from 'react';
import { Account } from '@/types';
import { createAccount } from '@/api';
import Modal from './Modal';
import '@/styles/forms.css';
import '@/styles/buttons.css';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAccountModal({
    isOpen,
    onClose,
    onSuccess,
}: AddAccountModalProps) {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [currency, setCurrency] = useState('RUB');
    const [type, setType] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !balance) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await createAccount({
                name,
                balance: parseFloat(balance),
                currency,
                type,
            });
            onSuccess();
        } catch (err) {
            setError('Не удалось создать счет');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Добавить счет">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Название</label>
                    <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите название счета"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Начальный баланс</label>
                    <input
                        type="number"
                        className="form-input"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="Введите начальный баланс"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Валюта</label>
                    <select
                        className="form-select"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="RUB">Рубль (₽)</option>
                        <option value="USD">Доллар ($)</option>
                        <option value="EUR">Евро (€)</option>
                        <option value="GBP">Фунт (£)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Тип</label>
                    <select
                        className="form-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="card">Банковская карта</option>
                        <option value="cash">Наличные</option>
                        <option value="savings">Сберегательный счет</option>
                        <option value="investment">Инвестиционный счет</option>
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
                        {loading ? 'Создание...' : 'Создать счет'}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 