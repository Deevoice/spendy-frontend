'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Category, Budget, FinancialGoal, Transaction } from '@/types';
import { getCategories, getBudgets, getFinancialGoals, getTransactions } from '@/api';
import AddBudgetModal from '@/components/AddBudgetModal';
import AddGoalModal from '@/components/AddGoalModal';
import BudgetList from '@/components/BudgetList';
import GoalList from '@/components/GoalList';
import '@/styles/budgets.css';

export default function BudgetsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [goals, setGoals] = useState<FinancialGoal[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, budgetsData, goalsData, transactionsData] = await Promise.all([
                    getCategories(),
                    getBudgets(),
                    getFinancialGoals(),
                    getTransactions()
                ]);
                setCategories(categoriesData);
                setBudgets(budgetsData);
                setGoals(goalsData);
                setTransactions(transactionsData);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить данные');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleBudgetUpdate = async () => {
        try {
            const budgetsData = await getBudgets();
            setBudgets(budgetsData);
        } catch (error) {
            console.error('Error updating budgets:', error);
        }
    };

    const handleGoalUpdate = async () => {
        try {
            const goalsData = await getFinancialGoals();
            setGoals(goalsData);
        } catch (error) {
            console.error('Error updating goals:', error);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="budgets-page">
            <div className="budgets-header">
                <h1>Бюджеты и цели</h1>
                <div className="budgets-actions">
                    <button
                        className="button button-primary"
                        onClick={() => setShowBudgetModal(true)}
                    >
                        Добавить бюджет
                    </button>
                    <button
                        className="button button-success"
                        onClick={() => setShowGoalModal(true)}
                    >
                        Добавить цель
                    </button>
                </div>
            </div>

            <div className="budgets-content">
                <div className="budgets-section">
                    <h2>Бюджеты по категориям</h2>
                    <BudgetList
                        budgets={budgets}
                        categories={categories}
                        transactions={transactions}
                        onBudgetUpdate={handleBudgetUpdate}
                    />
                </div>

                <div className="goals-section">
                    <h2>Финансовые цели</h2>
                    <GoalList
                        goals={goals}
                        onGoalUpdate={handleGoalUpdate}
                    />
                </div>
            </div>

            <AddBudgetModal
                isOpen={showBudgetModal}
                onClose={() => setShowBudgetModal(false)}
                categories={categories}
                onSuccess={handleBudgetUpdate}
            />

            <AddGoalModal
                isOpen={showGoalModal}
                onClose={() => setShowGoalModal(false)}
                onSuccess={handleGoalUpdate}
            />
        </div>
    );
} 