import { describe, it, expect } from 'vitest';
import type { Transaction } from '../types';
import { formatCents } from '../utils';

// ── groupByDay (extracted from TransactionList for unit testing) ──

function groupByDay(txs: Transaction[]): { date: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const existing = map.get(tx.date) ?? [];
    map.set(tx.date, [...existing, tx]);
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
}

// ── formatDayHeader ──

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

// ── Tests ──

const makeTx = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 1,
  type: 'expense',
  amount: 5000,
  categoryId: 1,
  categoryName: 'Groceries',
  categoryIcon: '🛒',
  date: '2025-01-15',
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T10:00:00.000Z',
  tags: [],
  ...overrides,
});

describe('groupByDay', () => {
  it('groups transactions by date', () => {
    const txs = [
      makeTx({ id: 1, date: '2025-01-15' }),
      makeTx({ id: 2, date: '2025-01-15' }),
      makeTx({ id: 3, date: '2025-01-14' }),
    ];
    const groups = groupByDay(txs);
    expect(groups).toHaveLength(2);
    expect(groups.find((g) => g.date === '2025-01-15')?.items).toHaveLength(2);
    expect(groups.find((g) => g.date === '2025-01-14')?.items).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(groupByDay([])).toHaveLength(0);
  });

  it('preserves insertion order', () => {
    const txs = [
      makeTx({ id: 1, date: '2025-01-17' }),
      makeTx({ id: 2, date: '2025-01-16' }),
      makeTx({ id: 3, date: '2025-01-15' }),
    ];
    const groups = groupByDay(txs);
    expect(groups[0].date).toBe('2025-01-17');
    expect(groups[1].date).toBe('2025-01-16');
    expect(groups[2].date).toBe('2025-01-15');
  });
});

describe('formatCents', () => {
  it('formats positive cent values as USD', () => {
    expect(formatCents(123456)).toBe('$1,234.56');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('$0.00');
  });

  it('formats negative cent values', () => {
    expect(formatCents(-9950)).toBe('-$99.50');
  });

  it('is exact for amounts that would drift as floats', () => {
    // 10 + 20 + 30 cents = $0.60 exactly (floats would give $0.6000000001).
    const total = 10 + 20 + 30;
    expect(formatCents(total)).toBe('$0.60');
  });
});

describe('formatDayHeader', () => {
  it('returns "Today" for today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(formatDayHeader(today)).toBe('Today');
  });

  it('returns "Yesterday" for yesterday\'s date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().split('T')[0];
    expect(formatDayHeader(yestStr)).toBe('Yesterday');
  });

  it('returns formatted date for older dates', () => {
    const result = formatDayHeader('2024-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
  });
});
