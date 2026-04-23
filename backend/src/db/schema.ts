import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type', { enum: ['income', 'expense', 'both'] }).notNull().default('both'),
  icon: text('icon').notNull().default('📦'),
});

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  // Integer cents (e.g. $12.34 stored as 1234).
  amount: integer('amount').notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  date: text('date').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
