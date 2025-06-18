import { Transaction, Category, Account, TransactionStats } from '@/types/transaction';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'API request failed');
    }

    return response.json();
};

// Transactions
export const getTransactions = async (period: string = 'month', accountId?: number) => {
    const params = new URLSearchParams();
    params.append('period', period);

    if (typeof accountId === 'number' && !isNaN(accountId) && accountId > 0) {
        params.append('account_id', accountId.toString());
    }

    const url = `/transactions/?${params.toString()}`;
    console.log('Making request to:', url); // Debug log
    return apiRequest(url);
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    return apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify({
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date,
            account_id: transaction.account_id,
            category_id: transaction.category_id,
            category: transaction.category,
        }),
        credentials: 'include',
    });
};

export const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    return apiRequest(`/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(transaction),
    });
};

export const deleteTransaction = async (id: number) => {
    return apiRequest(`/transactions/${id}`, {
        method: 'DELETE',
    });
};

// Categories
export const getCategories = async () => {
    return apiRequest('/categories');
};

export const createCategory = async (category: Omit<Category, 'id'>) => {
    return apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
    });
};

export const updateCategory = async (id: number, category: Partial<Category>) => {
    return apiRequest(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(category),
    });
};

export const deleteCategory = async (id: number) => {
    return apiRequest(`/categories/${id}`, {
        method: 'DELETE',
    });
};

// Accounts
export const getAccounts = async () => {
    return apiRequest('/accounts');
};

export const createAccount = async (account: Omit<Account, 'id'>) => {
    return apiRequest('/accounts', {
        method: 'POST',
        body: JSON.stringify(account),
    });
};

export const updateAccount = async (id: number, account: Partial<Account>) => {
    return apiRequest(`/accounts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(account),
    });
};

export const deleteAccount = async (id: number) => {
    return apiRequest(`/accounts/${id}`, {
        method: 'DELETE',
    });
};

// Transfer between accounts
export const transferBetweenAccounts = async (
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description?: string
) => {
    return apiRequest('/transactions/transfer', {
        method: 'POST',
        body: JSON.stringify({
            from_account_id: fromAccountId,
            to_account_id: toAccountId,
            amount,
            description,
        }),
    });
};

export async function getTransactionStats(period: string, accountId?: number): Promise<TransactionStats> {
    const headers = getAuthHeaders();
    if (Object.keys(headers).length === 0) {
        return { total: 0, income: 0, expense: 0 };
    }

    const response = await fetch(`${API_URL}/transactions/stats?period=${period}${accountId ? `&account_id=${accountId}` : ''}`, {
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        throw new Error('Failed to fetch transaction stats');
    }
    return response.json();
} 