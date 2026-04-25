import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Period } from '../../types';
import { api } from '../../api/client';
import { PeriodFilter } from './PeriodFilter';
import { TagChip } from './TagChip';

interface HeaderProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  onAdd: () => void;
  selectedTagIds?: number[];
  onTagFilterChange?: (ids: number[]) => void;
}

export function Header({ period, onPeriodChange, onAdd, selectedTagIds = [], onTagFilterChange }: HeaderProps) {
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: api.getTags,
    staleTime: Infinity,
  });

  const toggleTag = (id: number) => {
    if (!onTagFilterChange) return;
    const next = selectedTagIds.includes(id)
      ? selectedTagIds.filter((tid) => tid !== id)
      : [...selectedTagIds, id];
    onTagFilterChange(next);
  };

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
      {tags.length > 0 && (
        <div className="header-tag-filter">
          <div className="tag-filter-row">
            {tags.map((tag) => (
              <TagChip
                key={tag.id}
                name={tag.name}
                color={tag.color}
                active={selectedTagIds.includes(tag.id)}
                onClick={() => toggleTag(tag.id)}
                data-testid={`tag-filter-${tag.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
