import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { categoriesRoutes } from './routes/categories.js';
import { transactionsRoutes } from './routes/transactions.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { tagsRoutes } from './routes/tags.js';
import { seedCategories, seedTransactions } from './db/seed.js';

const app = Fastify({ logger: { level: 'warn' } });

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

await app.register(cors, { origin: allowedOrigins });

await app.register(healthRoutes);
await app.register(categoriesRoutes);
await app.register(transactionsRoutes);
await app.register(dashboardRoutes);
await app.register(tagsRoutes);

app.setErrorHandler((error, _req, reply) => {
  console.error(error);
  reply.status(500).send({ error: 'Internal server error' });
});

try {
  seedCategories();
  seedTransactions();
} catch (err) {
  app.log.error({ err }, 'seed failed — continuing startup');
}

const port = parseInt(process.env.PORT ?? '3001', 10);
const host = process.env.HOST ?? '127.0.0.1';
await app.listen({ port, host });
console.log(`PennyLog backend → http://localhost:${port}`);
