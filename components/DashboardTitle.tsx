import { useAuth } from '@/contexts/AuthContext';

export default function DashboardTitle() {
    const { user } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return 'Доброе утро';
        } else if (hour >= 12 && hour < 18) {
            return 'Добрый день';
        } else if (hour >= 18 && hour < 23) {
            return 'Добрый вечер';
        } else {
            return 'Доброй ночи';
        }
    };

    return (
        <div className="dashboard-title">
            <h1>{getGreeting()}, {user?.full_name || 'Гость'}</h1>
        </div>
    );
} 