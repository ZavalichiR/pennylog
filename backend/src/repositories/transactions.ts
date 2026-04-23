import { db } from '../db/client.js';
import { transactions, categories } from '../db/schema.js';
import { eq, gte, lte, and, desc } from 'drizzle-orm';
import type { CreateTransaction, UpdateTransaction } from '../schemas/transaction.js';

const withCategory = {
  id: transactions.id,
  type: transactions.type,
  amount: transactions.amount,
  categoryId: transactions.categoryId,
  categoryName: categories.name,
  categoryIcon: categories.icon,
  date: transactions.date,
  description: transactions.description,
  createdAt: transactions.createdAt,
  updatedAt: transactions.updatedAt,
};

export const transactionsRepository = {
  findAll(from?: string, to?: string) {
    const conditions = [];
    if (from) conditions.push(gte(transactions.date, from));
    if (to) conditions.push(lte(transactions.date, to));

    return db
      .select(withCategory)
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(transactions.date), desc(transactions.createdAt))
      .all();
  },

  findById(id: number) {
    return (
      db
        .select(withCategory)
        .from(transactions)
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(eq(transactions.id, id))
        .get() ?? null
    );
  },

  create(data: CreateTransaction) {
    const now = new Date().toISOString();
    const rows = db
      .insert(transactions)
      .values({ ...data, createdAt: now, updatedAt: now })
      .returning({ id: transactions.id })
      .all();
    return this.findById(rows[0].id);
  },

  update(id: number, data: UpdateTransaction) {
    const now = new Date().toISOString();
    const rows = db
      .update(transactions)
      .set({ ...data, updatedAt: now })
      .where(eq(transactions.id, id))
      .returning({ id: transactions.id })
      .all();
    if (rows.length === 0) return null;
    return this.findById(rows[0].id);
  },

  delete(id: number) {
    const existing = this.findById(id);
    if (!existing) return null;
    db.delete(transactions).where(eq(transactions.id, id)).run();
    return existing;
  },
};
