import { FinancialGoal } from '@/types';
import { ProgressBar } from './ProgressBar';
import '@/styles/goal-list.css';

interface GoalListProps {
    goals: FinancialGoal[];
    onGoalUpdate: () => void;
}

export default function GoalList({ goals, onGoalUpdate }: GoalListProps) {
    const calculateProgress = (goal: FinancialGoal) => {
        const progress = (goal.current_amount / goal.target_amount) * 100;
        return Math.min(progress, 100);
    };

    const calculateMonthlyContribution = (goal: FinancialGoal) => {
        const remainingAmount = goal.target_amount - goal.current_amount;
        const monthsRemaining = Math.max(1, goal.months_remaining);
        return Math.ceil(remainingAmount / monthsRemaining);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="goal-list">
            {goals.map((goal) => {
                const progress = calculateProgress(goal);
                const monthlyContribution = calculateMonthlyContribution(goal);

                return (
                    <div key={goal.id} className="goal-card">
                        <div className="goal-header">
                            <h3>{goal.name}</h3>
                            <div className="goal-amounts">
                                <span className="current">
                                    Накоплено: {goal.current_amount.toLocaleString('ru-RU')} ₽
                                </span>
                                <span className="target">
                                    Цель: {goal.target_amount.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        </div>
                        <ProgressBar
                            progress={progress}
                            color="var(--primary)"
                        />
                        <div className="goal-details">
                            <div className="goal-info">
                                <span className="deadline">
                                    До {formatDate(goal.target_date)}
                                </span>
                                <span className="remaining-months">
                                    Осталось месяцев: {goal.months_remaining}
                                </span>
                            </div>
                            <div className="goal-contribution">
                                <span className="monthly">
                                    Ежемесячный взнос: {monthlyContribution.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 