export interface User {
    id: number;
    email: string;
    full_name: string;
}

export interface Account {
    id: number;
    name: string;
    balance: number;
    currency: string;
}

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

export interface Transaction {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
    category_id: number;
    account_id: number;
}

export interface Budget {
    id: number;
    category: string;
    amount: number;
    spent: number;
    period: 'month' | 'year';
}

export interface FinancialGoal {
    id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    months_remaining: number;
} 