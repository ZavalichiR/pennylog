import { useQuery } from '@tanstack/react-query';
import type { Period, Transaction } from '../../types';
import { api } from '../../api/client';
import { KPICards } from './KPICards';
import { CategoryBreakdown } from './CategoryBreakdown';
import { TrendChart } from './TrendChart';
import { TransactionList } from '../transactions/TransactionList';
import { EmptyState } from '../../shared/components/EmptyState';

interface DashboardProps {
  period: Period;
  onEdit: (tx: Transaction) => void;
  selectedTagIds?: number[];
}

export function Dashboard({ period, onEdit, selectedTagIds = [] }: DashboardProps) {
  const { data: dashboard, isLoading: loadingDash, error: dashError } = useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => api.getDashboard(period),
  });

  const { data: transactions, isLoading: loadingTx } = useQuery({
    queryKey: ['transactions', period],
    queryFn: () => api.getTransactions(period),
  });

  if (dashError) {
    return (
      <div className="error-banner" role="alert">
        Failed to load dashboard. Make sure the backend is running on port 3001.
      </div>
    );
  }

  return (
    <div>
      <KPICards summary={dashboard?.summary} loading={loadingDash} />
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Transactions</span>
              {transactions && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>
            {loadingTx ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div className="skeleton" style={{ height: 14, width: '60%' }} />
                      <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    </div>
                    <div className="skeleton" style={{ height: 14, width: 60 }} />
                  </div>
                ))}
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <EmptyState
                icon="💳"
                title="No transactions yet"
                description="Add your first transaction to start tracking your finances."
              />
            ) : (
              <TransactionList transactions={transactions} onEdit={onEdit} selectedTagIds={selectedTagIds} />
            )}
          </div>
        </div>

        <div className="dashboard-right">
          {dashboard && dashboard.trendData.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Income vs Expenses</span>
              </div>
              <div className="card-body" style={{ paddingTop: 8 }}>
                <TrendChart data={dashboard.trendData} period={period} />
              </div>
            </div>
          )}

          {dashboard && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Expenses by Category</span>
              </div>
              <div className="card-body">
                <CategoryBreakdown breakdown={dashboard.categoryBreakdown} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
