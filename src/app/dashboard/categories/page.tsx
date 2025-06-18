'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category } from '@/types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api';
import '@/styles/categories.css';

export default function CategoriesPage() {
    const { t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError('Ошибка при загрузке категорий');
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
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }

            fetchCategories();
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: '', type: 'expense' });
        } catch (err) {
            setError('Ошибка при сохранении категории');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            type: category.type,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err) {
            setError('Ошибка при удалении категории');
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
        <div className="categories-page">
            <div className="categories-header">
                <h1>{t('categories_title')}</h1>
                <button
                    className="btn-primary"
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', type: 'expense' });
                        setIsModalOpen(true);
                    }}
                >
                    {t('add_category')}
                </button>
            </div>

            <div className="categories-grid">
                {categories.map((category) => (
                    <div key={category.id} className="category-card">
                        <div className="category-info">
                            <h3>{category.name}</h3>
                            <p className="category-type">{category.type}</p>
                        </div>
                        <div className="category-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => handleEdit(category)}
                            >
                                {t('edit')}
                            </button>
                            <button
                                className="btn-danger"
                                onClick={() => handleDelete(category.id)}
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
                        <h2>{editingCategory ? t('edit_category') : t('add_category')}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">{t('category_name')}</label>
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
                                <label htmlFor="type">{t('category_type')}</label>
                                <select
                                    id="type"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value })
                                    }
                                >
                                    <option value="expense">Расход</option>
                                    <option value="income">Доход</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? t('save') : t('add')}
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