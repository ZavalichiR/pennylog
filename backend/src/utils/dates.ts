import type { Period } from '../schemas/transaction.js';

export function getDateRange(period: Period): { from: string; to: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  switch (period) {
    case 'today': {
      const today = toDateStr(now);
      return { from: today, to: today };
    }
    case 'week': {
      const day = now.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { from: toDateStr(monday), to: toDateStr(sunday) };
    }
    case 'month': {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { from: toDateStr(first), to: toDateStr(last) };
    }
    case 'year': {
      return {
        from: `${now.getFullYear()}-01-01`,
        to: `${now.getFullYear()}-12-31`,
      };
    }
  }
}

export function getTrendGroupFormat(period: Period): string {
  switch (period) {
    case 'today': return '%H';
    case 'week':
    case 'month': return '%Y-%m-%d';
    case 'year': return '%Y-%m';
  }
}
