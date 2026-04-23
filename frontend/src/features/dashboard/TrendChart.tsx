import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { TrendDataPoint, Period } from '../../types';
import { formatCents } from '../../utils';

function formatLabel(date: string, period: Period): string {
  switch (period) {
    case 'today':
      return `${date}:00`;
    case 'week': {
      const d = new Date(date + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    case 'month': {
      const d = new Date(date + 'T00:00:00');
      return String(d.getDate());
    }
    case 'year': {
      const [, month] = date.split('-');
      return new Date(2024, parseInt(month, 10) - 1).toLocaleDateString('en-US', { month: 'short' });
    }
  }
}

function formatY(cents: number) {
  const dollars = cents / 100;
  if (dollars >= 1000) return `$${(dollars / 1000).toFixed(1)}k`;
  return `$${Math.round(dollars)}`;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  period: Period;
}

export function TrendChart({ data, period }: TrendChartProps) {
  const formatted = data.map((d) => ({ ...d, label: formatLabel(d.date, period) }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatY}
          tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={(v: number, name: string) => [
            formatCents(v),
            name === 'income' ? 'Income' : 'Expenses',
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
        />
        <Legend
          formatter={(v) => (v === 'income' ? 'Income' : 'Expenses')}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Area type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} fill="url(#income-grad)" dot={false} />
        <Area type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} fill="url(#expense-grad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
