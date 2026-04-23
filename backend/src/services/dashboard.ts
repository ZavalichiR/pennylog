import { db } from '../db/client.js';
import { transactions, categories } from '../db/schema.js';
import { eq, gte, lte, and, or, sql } from 'drizzle-orm';
import type { Period } from '../schemas/transaction.js';
import { getDateRange, getTrendGroupFormat } from '../utils/dates.js';

export const dashboardService = {
  getDashboard(period: Period) {
    const { from, to } = getDateRange(period);

    const dateCondition = and(gte(transactions.date, from), lte(transactions.date, to));

    const summaryRows = db
      .select({
        type: transactions.type,
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(dateCondition)
      .groupBy(transactions.type)
      .all();

    let totalIncome = 0;
    let totalExpenses = 0;
    for (const row of summaryRows) {
      const total = Number(row.total ?? 0);
      if (row.type === 'income') totalIncome = total;
      else totalExpenses = total;
    }

    const breakdownRows = db
      .select({
        categoryId: categories.id,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(categories)
      .leftJoin(
        transactions,
        and(
          eq(transactions.categoryId, categories.id),
          eq(transactions.type, 'expense'),
          gte(transactions.date, from),
          lte(transactions.date, to),
        ),
      )
      .where(or(eq(categories.type, 'expense'), eq(categories.type, 'both')))
      .groupBy(categories.id)
      .all();

    const categoryBreakdown = breakdownRows
      .map((r) => {
        const total = Number(r.total ?? 0);
        return {
          categoryId: r.categoryId,
          categoryName: r.categoryName,
          categoryIcon: r.categoryIcon,
          total,
          percentage: totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0,
        };
      })
      .sort((a, b) => b.total - a.total);

    const groupFmt = getTrendGroupFormat(period);
    const trendRows = db
      .select({
        bucket: sql<string>`strftime(${sql.raw(`'${groupFmt}'`)}, ${transactions.date})`,
        type: transactions.type,
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(dateCondition)
      .groupBy(
        sql`strftime(${sql.raw(`'${groupFmt}'`)}, ${transactions.date})`,
        transactions.type,
      )
      .all();

    const trendMap = new Map<string, { income: number; expenses: number }>();
    for (const row of trendRows) {
      if (!trendMap.has(row.bucket)) trendMap.set(row.bucket, { income: 0, expenses: 0 });
      const entry = trendMap.get(row.bucket)!;
      const total = Number(row.total ?? 0);
      if (row.type === 'income') entry.income = total;
      else entry.expenses = total;
    }

    const trendData = Array.from(trendMap.entries())
      .map(([date, vals]) => ({ date, ...vals }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      period,
      dateRange: { from, to },
      summary: { totalIncome, totalExpenses, netCashFlow: totalIncome - totalExpenses },
      categoryBreakdown,
      trendData,
    };
  },
};
