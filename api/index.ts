import { Account, Category, Transaction, Budget, FinancialGoal } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        throw new Error('Authentication failed');
    }

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
};

// Account API
export const getAccounts = () => fetchWithAuth('/api/accounts/');
export const createAccount = (data: any) => fetchWithAuth('/api/accounts/', {
    method: 'POST',
    body: JSON.stringify(data),
});
export const updateAccount = (id: number, data: any) => fetchWithAuth(`/api/accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
});
export const deleteAccount = (id: number) => fetchWithAuth(`/api/accounts/${id}`, {
    method: 'DELETE',
});

// Category API
export const getCategories = () => fetchWithAuth('/api/categories/');
export const createCategory = (data: any) => fetchWithAuth('/api/categories/', {
    method: 'POST',
    body: JSON.stringify(data),
});
export const updateCategory = (id: number, data: any) => fetchWithAuth(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
});
export const deleteCategory = (id: number) => fetchWithAuth(`/api/categories/${id}`, {
    method: 'DELETE',
});

// Transaction API
export const getTransactions = (period: string = 'month', accountId?: number) => {
    const params = new URLSearchParams();
    params.append('period', period);

    if (typeof accountId === 'number' && !isNaN(accountId) && accountId > 0) {
        params.append('account_id', accountId.toString());
    }

    const url = `/api/transactions/?${params.toString()}`;
    return fetchWithAuth(url);
};

export const createTransaction = (data: any) => fetchWithAuth('/api/transactions/', {
    method: 'POST',
    body: JSON.stringify(data),
});

export const updateTransaction = (id: number, data: any) => fetchWithAuth(`/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
});

export const deleteTransaction = (id: number) => fetchWithAuth(`/api/transactions/${id}`, {
    method: 'DELETE',
});

export async function getBudgets(): Promise<Budget[]> {
    return fetchWithAuth('/api/budgets/');
}

export async function createBudget(data: Omit<Budget, 'id' | 'spent'>): Promise<Budget> {
    return fetchWithAuth('/api/budgets/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateBudget(id: number, data: Partial<Budget>): Promise<Budget> {
    return fetchWithAuth(`/api/budgets/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteBudget(id: number): Promise<void> {
    return fetchWithAuth(`/api/budgets/${id}/`, {
        method: 'DELETE',
    });
}

export async function getFinancialGoals(): Promise<FinancialGoal[]> {
    return fetchWithAuth('/api/goals/');
}

export async function createFinancialGoal(data: Omit<FinancialGoal, 'id' | 'months_remaining'>): Promise<FinancialGoal> {
    return fetchWithAuth('/api/goals/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateFinancialGoal(id: number, data: Partial<FinancialGoal>): Promise<FinancialGoal> {
    return fetchWithAuth(`/api/goals/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteFinancialGoal(id: number): Promise<void> {
    return fetchWithAuth(`/api/goals/${id}/`, {
        method: 'DELETE',
    });
} 