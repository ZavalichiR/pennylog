import { db } from '../db/client.js';
import { categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const categoriesRepository = {
  findAll() {
    return db.select().from(categories).all();
  },

  findById(id: number) {
    return db.select().from(categories).where(eq(categories.id, id)).get() ?? null;
  },
};
