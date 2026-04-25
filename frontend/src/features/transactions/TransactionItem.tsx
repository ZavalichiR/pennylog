import { Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatCents } from '../../utils';
import { TagChip } from '../../shared/components/TagChip';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export function TransactionItem({ transaction: tx, onEdit, onDelete, isDeleting }: TransactionItemProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${tx.categoryName}" transaction?`)) {
      onDelete(tx.id);
    }
  };

  return (
    <div className="tx-item" style={{ opacity: isDeleting ? 0.5 : 1 }} data-testid="transaction-item">
      <div className={`tx-icon ${tx.type}`}>
        <span>{tx.categoryIcon}</span>
      </div>
      <div className="tx-info">
        <div className="tx-name">{tx.categoryName}</div>
        {tx.description && <div className="tx-desc">{tx.description}</div>}
        {tx.tags.length > 0 && (
          <div className="tx-tags">
            {tx.tags.map((tag) => (
              <span key={tag.id} data-testid={`transaction-tag-${tag.id}`}>
                <TagChip name={tag.name} color={tag.color} />
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="tx-right">
        <div className={`tx-amount ${tx.type}`}>
          {tx.type === 'income' ? '+' : '-'}{formatCents(tx.amount)}
        </div>
        <div className="tx-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(tx)}
            aria-label="Edit transaction"
            data-testid="edit-transaction-btn"
          >
            <Pencil size={14} />
          </button>
          <button
            className="btn-icon"
            onClick={handleDelete}
            aria-label="Delete transaction"
            data-testid="delete-transaction-btn"
            style={{ color: 'var(--expense)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
