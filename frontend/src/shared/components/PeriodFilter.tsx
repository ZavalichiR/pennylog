import type { Period } from '../../types';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

interface PeriodFilterProps {
  value: Period;
  onChange: (p: Period) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <nav className="period-filter" role="tablist" aria-label="Time period">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          role="tab"
          aria-selected={value === p.value}
          className={`period-btn${value === p.value ? ' active' : ''}`}
          onClick={() => onChange(p.value)}
          data-testid={`period-${p.value}`}
        >
          {p.label}
        </button>
      ))}
    </nav>
  );
}
