import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().int('Amount must be an integer (cents)').positive('Amount must be positive'),
  categoryId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  description: z.string().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const periodSchema = z.enum(['today', 'week', 'month', 'year']);

export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type Period = z.infer<typeof periodSchema>;
