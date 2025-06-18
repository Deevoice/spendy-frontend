export interface Transaction {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category_id: number;
    account_id: number;
    date: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: number;
    name: string;
    balance: number;
    currency: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionStats {
    total_income: number;
    total_expense: number;
    net_income: number;
    by_category: {
        category_id: number;
        category_name: string;
        total: number;
    }[];
} 