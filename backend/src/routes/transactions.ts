import type { FastifyInstance } from 'fastify';
import { createTransactionSchema, updateTransactionSchema, periodSchema } from '../schemas/transaction.js';
import { transactionsService } from '../services/transactions.js';
import { getDateRange } from '../utils/dates.js';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/api/transactions', async (req) => {
    const query = req.query as Record<string, string>;
    const parsed = periodSchema.safeParse(query.period);
    if (parsed.success) {
      const { from, to } = getDateRange(parsed.data);
      return transactionsService.getAll(from, to);
    }
    return transactionsService.getAll();
  });

  app.post('/api/transactions', async (req, reply) => {
    const result = createTransactionSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation error', details: result.error.flatten() });
    }
    const transaction = transactionsService.create(result.data);
    return reply.status(201).send(transaction);
  });

  app.patch('/api/transactions/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const result = updateTransactionSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation error', details: result.error.flatten() });
    }
    const transaction = transactionsService.update(parseInt(id, 10), result.data);
    if (!transaction) return reply.status(404).send({ error: 'Transaction not found' });
    return transaction;
  });

  app.delete('/api/transactions/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const transaction = transactionsService.delete(parseInt(id, 10));
    if (!transaction) return reply.status(404).send({ error: 'Transaction not found' });
    return reply.status(204).send();
  });
}
