import { Plus } from 'lucide-react';
import type { Period } from '../../types';
import { PeriodFilter } from './PeriodFilter';

interface HeaderProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  onAdd: () => void;
}

export function Header({ period, onPeriodChange, onAdd }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          penny<span>log</span>
        </div>
        <PeriodFilter value={period} onChange={onPeriodChange} />
        <div className="header-actions">
          <button className="btn btn-primary" onClick={onAdd} data-testid="add-transaction-btn">
            <Plus size={15} />
            Add Transaction
          </button>
        </div>
      </div>
    </header>
  );
}
