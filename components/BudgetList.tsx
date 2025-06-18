import { Budget, Category, Transaction } from '@/types';
import { ProgressBar } from './ProgressBar';
import '@/styles/budget-list.css';

interface BudgetListProps {
    budgets: Budget[];
    categories: Category[];
    transactions: Transaction[];
    onBudgetUpdate: () => void;
}

export default function BudgetList({ budgets, categories, transactions, onBudgetUpdate }: BudgetListProps) {
    const calculateSpent = (budget: Budget) => {
        const now = new Date();
        const startOfPeriod = new Date(now);

        if (budget.period === 'month') {
            startOfPeriod.setDate(1);
            startOfPeriod.setHours(0, 0, 0, 0);
        } else {
            startOfPeriod.setMonth(0, 1);
            startOfPeriod.setHours(0, 0, 0, 0);
        }

        const category = categories.find(c => c.name === budget.category);
        if (!category) {
            console.log('Category not found for budget:', budget);
            return 0;
        }

        console.log('Calculating spent for budget:', {
            budget,
            category,
            startOfPeriod: startOfPeriod.toISOString(),
            now: now.toISOString()
        });

        // Логируем все транзакции для этой категории
        const categoryTransactions = transactions.filter(t => t.category_id === category.id);
        console.log('Transactions for category:', {
            categoryName: category.name,
            categoryId: category.id,
            transactions: categoryTransactions
        });

        const filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const matches =
                t.category_id === category.id &&
                t.type === 'expense' &&
                transactionDate >= startOfPeriod &&
                transactionDate <= now;

            if (matches) {
                console.log('Matching transaction:', {
                    id: t.id,
                    amount: t.amount,
                    date: t.date,
                    category_id: t.category_id,
                    type: t.type
                });
            } else {
                console.log('Non-matching transaction:', {
                    id: t.id,
                    amount: t.amount,
                    date: t.date,
                    category_id: t.category_id,
                    type: t.type,
                    reasons: {
                        categoryMatch: t.category_id === category.id,
                        isExpense: t.type === 'expense',
                        dateInRange: transactionDate >= startOfPeriod && transactionDate <= now
                    }
                });
            }

            return matches;
        });

        const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
        console.log('Total spent:', total);
        return total;
    };

    const calculateProgress = (budget: Budget) => {
        const spent = calculateSpent(budget);
        const progress = (spent / budget.amount) * 100;
        return Math.min(progress, 100);
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'var(--error)';
        if (progress >= 80) return 'var(--warning)';
        return 'var(--success)';
    };

    console.log('BudgetList render:', {
        budgets,
        categories,
        transactions: transactions.length,
        transactionsDetails: transactions.map(t => ({
            id: t.id,
            amount: t.amount,
            date: t.date,
            category_id: t.category_id,
            type: t.type
        }))
    });

    return (
        <div className="budget-list">
            {budgets.map((budget) => {
                const spent = calculateSpent(budget);
                const progress = calculateProgress(budget);
                const progressColor = getProgressColor(progress);

                return (
                    <div key={budget.id} className="budget-card">
                        <div className="budget-header">
                            <h3>{budget.category}</h3>
                            <div className="budget-amounts">
                                <span className="spent">
                                    Потрачено: {spent.toLocaleString('ru-RU')} ₽
                                </span>
                                <span className="total">
                                    из {budget.amount.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        </div>
                        <ProgressBar
                            progress={progress}
                            color={progressColor}
                        />
                        <div className="budget-footer">
                            <span className="remaining">
                                Осталось: {(budget.amount - spent).toLocaleString('ru-RU')} ₽
                            </span>
                            <span className="period">
                                {budget.period === 'month' ? 'в месяц' : 'в год'}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 