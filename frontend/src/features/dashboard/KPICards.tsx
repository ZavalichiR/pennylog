import type { DashboardSummary } from '../../types';
import { formatCents } from '../../utils';

interface KPICardsProps {
  summary?: DashboardSummary;
  loading: boolean;
}

export function KPICards({ summary, loading }: KPICardsProps) {
  if (loading) {
    return (
      <div className="kpi-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="kpi-card">
            <div className="skeleton" style={{ height: 12, width: '50%' }} />
            <div className="skeleton" style={{ height: 28, width: '70%', marginTop: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  const income = summary?.totalIncome ?? 0;
  const expenses = summary?.totalExpenses ?? 0;
  const net = summary?.netCashFlow ?? 0;

  return (
    <div className="kpi-grid">
      <div className="kpi-card kpi-income">
        <div className="kpi-label">Total Income</div>
        <div className="kpi-amount">{formatCents(income)}</div>
        <div className="kpi-badge">↑ Earned</div>
      </div>

      <div className="kpi-card kpi-expense">
        <div className="kpi-label">Total Expenses</div>
        <div className="kpi-amount">{formatCents(expenses)}</div>
        <div className="kpi-badge">↓ Spent</div>
      </div>

      <div className="kpi-card kpi-net">
        <div className="kpi-label">Net Cash Flow</div>
        <div className={`kpi-amount ${net >= 0 ? 'positive' : 'negative'}`}>
          {formatCents(net)}
        </div>
        <div className="kpi-badge">{net >= 0 ? '✓ Surplus' : '! Deficit'}</div>
      </div>
    </div>
  );
}
