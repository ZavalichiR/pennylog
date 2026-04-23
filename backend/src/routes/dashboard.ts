import type { FastifyInstance } from 'fastify';
import { periodSchema } from '../schemas/transaction.js';
import { dashboardService } from '../services/dashboard.js';

export async function dashboardRoutes(app: FastifyInstance) {
  app.get('/api/dashboard', async (req) => {
    const query = req.query as Record<string, string>;
    const parsed = periodSchema.safeParse(query.period);
    const period = parsed.success ? parsed.data : 'month';
    return dashboardService.getDashboard(period);
  });
}
