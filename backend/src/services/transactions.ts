import { transactionsRepository } from '../repositories/transactions.js';
import type { CreateTransaction, UpdateTransaction } from '../schemas/transaction.js';

export const transactionsService = {
  getAll(from?: string, to?: string) {
    return transactionsRepository.findAll(from, to);
  },

  create(data: CreateTransaction) {
    return transactionsRepository.create(data);
  },

  update(id: number, data: UpdateTransaction) {
    return transactionsRepository.update(id, data);
  },

  delete(id: number) {
    return transactionsRepository.delete(id);
  },
};
