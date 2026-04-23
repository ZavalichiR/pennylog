import type { FastifyInstance } from 'fastify';
import { categoriesService } from '../services/categories.js';

export async function categoriesRoutes(app: FastifyInstance) {
  app.get('/api/categories', async () => categoriesService.getAll());
}
