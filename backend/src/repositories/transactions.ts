import { db } from '../db/client.js';
import { transactions, categories } from '../db/schema.js';
import { eq, gte, lte, and, desc } from 'drizzle-orm';
import type { CreateTransaction, UpdateTransaction } from '../schemas/transaction.js';
import { tagsRepository } from './tags.js';

type WithTags<T> = T & { tags: { id: number; name: string; color: string }[] };

function attachTags<T extends { id: number }>(rows: T[]): WithTags<T>[] {
  if (rows.length === 0) return [];
  const tagRows = tagsRepository.findByTransactionIds(rows.map((r) => r.id));
  const tagMap = new Map<number, { id: number; name: string; color: string }[]>();
  for (const row of tagRows) {
    const list = tagMap.get(row.transactionId) ?? [];
    list.push({ id: row.id, name: row.name, color: row.color });
    tagMap.set(row.transactionId, list);
  }
  return rows.map((r) => ({ ...r, tags: tagMap.get(r.id) ?? [] }));
}

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

    const rows = db
      .select(withCategory)
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(transactions.date), desc(transactions.createdAt))
      .all();
    return attachTags(rows);
  },

  findById(id: number) {
    const row = db
      .select(withCategory)
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.id, id))
      .get();
    if (!row) return null;
    return { ...row, tags: tagsRepository.findByTransactionId(id) };
  },

  create(data: CreateTransaction & { tagIds?: number[] }) {
    const { tagIds, ...txData } = data;
    const now = new Date().toISOString();
    const rows = db
      .insert(transactions)
      .values({ ...txData, createdAt: now, updatedAt: now })
      .returning({ id: transactions.id })
      .all();
    tagsRepository.setTransactionTags(rows[0].id, tagIds ?? []);
    return this.findById(rows[0].id);
  },

  update(id: number, data: UpdateTransaction & { tagIds?: number[] }) {
    const { tagIds, ...txData } = data;
    const now = new Date().toISOString();
    const rows = db
      .update(transactions)
      .set({ ...txData, updatedAt: now })
      .where(eq(transactions.id, id))
      .returning({ id: transactions.id })
      .all();
    if (rows.length === 0) return null;
    if (tagIds !== undefined) {
      tagsRepository.setTransactionTags(id, tagIds);
    }
    return this.findById(rows[0].id);
  },

  delete(id: number) {
    const existing = this.findById(id);
    if (!existing) return null;
    db.delete(transactions).where(eq(transactions.id, id)).run();
    return existing;
  },
};
