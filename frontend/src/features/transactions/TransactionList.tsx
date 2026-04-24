import type { Transaction } from '../../types';
import { TransactionItem } from './TransactionItem';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '../../api/client';
import { formatCents } from '../../utils';

function groupByDay(txs: Transaction[]): { date: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const existing = map.get(tx.date) ?? [];
    map.set(tx.date, [...existing, tx]);
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
}

function formatDayHeader(dateStr: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yestStr = yesterday.toISOString().split('T')[0];

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yestStr) return 'Yesterday';

  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  selectedTagIds?: number[];
}

export function TransactionList({ transactions, onEdit, selectedTagIds = [] }: TransactionListProps) {
  const queryClient = useQueryClient();
  const filtered = selectedTagIds.length === 0
    ? transactions
    : transactions.filter((tx) => tx.tags.some((t) => selectedTagIds.includes(t.id)));
  const groups = groupByDay(filtered);

  const deleteMutation = useMutation({
    mutationFn: api.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return (
    <div>
      {groups.map((group) => {
        const dayNet = group.items.reduce(
          (acc, tx) => acc + (tx.type === 'income' ? tx.amount : -tx.amount),
          0,
        );
        return (
          <div key={group.date} className="tx-group">
            <div className="tx-date-header">
              <span>{formatDayHeader(group.date)}</span>
              <span
                className="tx-date-total"
                style={{ color: dayNet >= 0 ? 'var(--income)' : 'var(--expense)' }}
              >
                {dayNet >= 0 ? '+' : ''}{formatCents(dayNet)}
              </span>
            </div>
            {group.items.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEdit={onEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === tx.id}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
