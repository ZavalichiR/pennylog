import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { tagsService } from '../services/tags.js';

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export async function tagsRoutes(app: FastifyInstance) {
  app.get('/api/tags', async () => {
    return tagsService.getAll();
  });

  app.post('/api/tags', async (req, reply) => {
    const result = createTagSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Validation error', details: result.error.flatten() });
    }
    const tag = tagsService.create(result.data);
    return reply.status(201).send(tag);
  });

  app.delete('/api/tags/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    tagsService.delete(parseInt(id, 10));
    return reply.status(204).send();
  });
}
