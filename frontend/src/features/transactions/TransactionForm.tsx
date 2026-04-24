import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Transaction } from '../../types';
import { api } from '../../api/client';
import { TagChip } from '../../shared/components/TagChip';

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Amount must be positive'),
  categoryId: z.coerce.number().int().positive('Please select a category'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  transaction: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    transaction?.tags.map((t) => t.id) ?? [],
  );

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      date: today,
      categoryId: 0,
      description: '',
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        // Transaction.amount is cents; form displays dollars.
        amount: transaction.amount / 100,
        categoryId: transaction.categoryId,
        date: transaction.date,
        description: transaction.description ?? '',
      });
      setSelectedTagIds(transaction.tags.map((t) => t.id));
    } else {
      reset({ type: 'expense', date: today, categoryId: 0, description: '' });
      setSelectedTagIds([]);
    }
  }, [transaction, reset, today]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
    staleTime: Infinity,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: api.getTags,
    staleTime: Infinity,
  });

  const filteredCategories = categories.filter(
    (c) => c.type === selectedType || c.type === 'both',
  );

  useEffect(() => {
    const currentCatId = watch('categoryId');
    const valid = filteredCategories.find((c) => c.id === currentCatId);
    if (!valid) setValue('categoryId', 0);
  }, [selectedType, filteredCategories, watch, setValue]);

  const createMutation = useMutation({
    mutationFn: api.createTransaction,
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FormData> }) =>
      api.updateTransaction(id, data),
    onSuccess,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  const onSubmit = (data: FormData) => {
    // Convert user-entered dollars to integer cents before sending.
    const payload = { ...data, amount: Math.round(data.amount * 100), tagIds: selectedTagIds };
    if (transaction) {
      updateMutation.mutate({ id: transaction.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-body">
        {/* Type toggle */}
        <div className="form-field">
          <label className="form-label">Type</label>
          <div className="type-toggle">
            <label className="type-option expense-opt">
              <input type="radio" value="expense" {...register('type')} />
              💸 Expense
            </label>
            <label className="type-option income-opt">
              <input type="radio" value="income" {...register('type')} />
              💰 Income
            </label>
          </div>
        </div>

        {/* Amount */}
        <div className="form-field">
          <label className="form-label" htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className={`form-input${errors.amount ? ' error' : ''}`}
            {...register('amount')}
            data-testid="amount-input"
          />
          {errors.amount && <span className="form-error">{errors.amount.message}</span>}
        </div>

        {/* Category */}
        <div className="form-field">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            className={`form-select${errors.categoryId ? ' error' : ''}`}
            {...register('categoryId', { valueAsNumber: true })}
            data-testid="category-select"
          >
            <option value={0} disabled>Select a category…</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          {errors.categoryId && <span className="form-error">{errors.categoryId.message}</span>}
        </div>

        {/* Date */}
        <div className="form-field">
          <label className="form-label" htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            className={`form-input${errors.date ? ' error' : ''}`}
            {...register('date')}
            data-testid="date-input"
          />
          {errors.date && <span className="form-error">{errors.date.message}</span>}
        </div>

        {/* Description */}
        <div className="form-field">
          <label className="form-label" htmlFor="description">Note (optional)</label>
          <textarea
            id="description"
            className="form-textarea"
            placeholder="Add a note…"
            {...register('description')}
            data-testid="description-input"
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="form-field">
            <label className="form-label">Tags (optional)</label>
            <div className="tag-picker-row">
              {tags.map((tag) => (
                <TagChip
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                  active={selectedTagIds.includes(tag.id)}
                  onClick={() => {
                    setSelectedTagIds((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id],
                    );
                  }}
                  data-testid={`tag-picker-${tag.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {mutationError && (
          <div className="form-error" role="alert">{mutationError.message}</div>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isPending}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
          data-testid="submit-transaction-btn"
        >
          {isPending ? 'Saving…' : transaction ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
