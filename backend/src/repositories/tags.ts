import { db } from '../db/client.js';
import { tags, transactionTags } from '../db/schema.js';
import { eq, inArray } from 'drizzle-orm';

export const tagsRepository = {
  findAll(): { id: number; name: string; color: string }[] {
    return db.select({ id: tags.id, name: tags.name, color: tags.color }).from(tags).all();
  },

  findById(id: number): { id: number; name: string; color: string } | null {
    return (
      db
        .select({ id: tags.id, name: tags.name, color: tags.color })
        .from(tags)
        .where(eq(tags.id, id))
        .get() ?? null
    );
  },

  create(data: { name: string; color: string }): { id: number; name: string; color: string } {
    const rows = db
      .insert(tags)
      .values(data)
      .returning({ id: tags.id })
      .all();
    return this.findById(rows[0].id)!;
  },

  delete(id: number): void {
    db.delete(tags).where(eq(tags.id, id)).run();
  },

  findByTransactionId(transactionId: number): { id: number; name: string; color: string }[] {
    return db
      .select({ id: tags.id, name: tags.name, color: tags.color })
      .from(tags)
      .innerJoin(transactionTags, eq(tags.id, transactionTags.tagId))
      .where(eq(transactionTags.transactionId, transactionId))
      .all();
  },

  findByTransactionIds(
    transactionIds: number[],
  ): { transactionId: number; id: number; name: string; color: string }[] {
    if (transactionIds.length === 0) return [];
    return db
      .select({
        transactionId: transactionTags.transactionId,
        id: tags.id,
        name: tags.name,
        color: tags.color,
      })
      .from(transactionTags)
      .innerJoin(tags, eq(transactionTags.tagId, tags.id))
      .where(inArray(transactionTags.transactionId, transactionIds))
      .all();
  },

  setTransactionTags(transactionId: number, tagIds: number[]): void {
    db.delete(transactionTags).where(eq(transactionTags.transactionId, transactionId)).run();
    if (tagIds.length > 0) {
      db.insert(transactionTags)
        .values(tagIds.map((tagId) => ({ transactionId, tagId })))
        .run();
    }
  },
};
