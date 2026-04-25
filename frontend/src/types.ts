export type Period = 'today' | 'week' | 'month' | 'year';

export type Tag = { id: number; name: string; color: string };

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense' | 'both';
  icon: string;
}

// Monetary fields (amount, totals, netCashFlow, trend income/expenses) are integer cents.
// Format them for display with `formatCents` from utils.ts.

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  date: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  total: number;
  percentage: number;
}

export interface TrendDataPoint {
  date: string;
  income: number;
  expenses: number;
}

export interface DashboardData {
  period: Period;
  dateRange: { from: string; to: string };
  summary: DashboardSummary;
  categoryBreakdown: CategoryBreakdown[];
  trendData: TrendDataPoint[];
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  categoryId: number;
  date: string;
  description?: string;
}
