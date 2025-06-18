import { useState } from 'react';
import { Category } from '@/types';
import { createCategory } from '@/api';
import Modal from './Modal';
import '@/styles/forms.css';
import '@/styles/buttons.css';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddCategoryModal({
    isOpen,
    onClose,
    onSuccess,
}: AddCategoryModalProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [color, setColor] = useState('#6366f1'); // Default color
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setError('Пожалуйста, введите название категории');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await createCategory({
                name,
                type,
                color,
            });
            onSuccess();
        } catch (err) {
            setError('Не удалось создать категорию');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Добавить категорию">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Название</label>
                    <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите название категории"
                    />
                </div>

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
                    <label className="form-label">Цвет</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            style={{ width: '50px', height: '38px', padding: '2px' }}
                        />
                        <input
                            type="text"
                            className="form-input"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="#000000"
                        />
                    </div>
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
                        {loading ? 'Создание...' : 'Создать категорию'}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 