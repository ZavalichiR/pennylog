import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { CategoryBreakdown as CategoryBreakdownType } from '../../types';
import { formatCents } from '../../utils';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

interface CategoryBreakdownProps {
  breakdown: CategoryBreakdownType[];
}

export function CategoryBreakdown({ breakdown }: CategoryBreakdownProps) {
  if (breakdown.length === 0) return null;

  const pieData = breakdown
    .filter((b) => b.total > 0)
    .map((b) => ({ name: b.categoryName, value: b.total }));

  return (
    <div>
      {pieData.length > 0 && (
        <div className="pie-wrap">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => formatCents(v)}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="cat-list">
        {breakdown.map((item, i) => (
          <div key={item.categoryId} className="cat-row">
            <span className="cat-icon">{item.categoryIcon}</span>
            <span className="cat-name">{item.categoryName}</span>
            <div className="cat-bar-wrap">
              <div
                className="cat-bar"
                style={{ width: `${item.percentage}%`, background: COLORS[i % COLORS.length] }}
              />
            </div>
            <span className="cat-pct">{item.percentage}%</span>
            <span className="cat-amt">{formatCents(item.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
