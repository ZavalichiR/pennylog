import type { Category, DashboardData, Transaction, TransactionFormData, Period } from '../types';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { ...(options?.headers as Record<string, string>) };
  if (options?.body != null && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(path, { ...options, headers });
  } catch {
    throw new Error('Network error — is the server running?');
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const msg = payload?.error ?? `HTTP ${res.status}`;
    const fieldErrors = payload?.details?.fieldErrors as Record<string, string[]> | undefined;
    const formErrors = payload?.details?.formErrors as string[] | undefined;
    const detail = [
      ...(fieldErrors ? Object.entries(fieldErrors).map(([k, v]) => `${k}: ${v.join(', ')}`) : []),
      ...(formErrors ?? []),
    ].filter(Boolean).join('; ');
    throw new Error(detail ? `${msg}: ${detail}` : msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getDashboard: (period: Period) =>
    request<DashboardData>(`/api/dashboard?period=${period}`),

  getTransactions: (period: Period) =>
    request<Transaction[]>(`/api/transactions?period=${period}`),

  getCategories: () => request<Category[]>('/api/categories'),

  createTransaction: (data: TransactionFormData) =>
    request<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTransaction: (id: number, data: Partial<TransactionFormData>) =>
    request<Transaction>(`/api/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteTransaction: (id: number) =>
    request<void>(`/api/transactions/${id}`, { method: 'DELETE' }),
};
