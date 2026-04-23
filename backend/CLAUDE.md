# pennylog backend

Fastify + TypeScript + Drizzle ORM + better-sqlite3. Port 3001.

## Architecture

```
src/
├── db/
│   ├── client.ts       SQLite connection + CREATE TABLE IF NOT EXISTS
│   ├── schema.ts       Drizzle table definitions (source of truth for types)
│   └── seed.ts         Inserts default categories on first run
├── schemas/
│   └── transaction.ts  Zod input validation schemas
├── repositories/       Raw DB queries — no business logic
├── services/           Business logic — calls repositories
├── routes/             Fastify route handlers — call services, handle HTTP concerns
└── utils/
    └── dates.ts        Period → date range helpers
```

## Adding a new resource

1. Add table to `db/schema.ts` and the `CREATE TABLE` SQL in `db/client.ts`
2. Add Zod schema in `schemas/`
3. Add repository in `repositories/` — query-only, return plain objects
4. Add service in `services/` — orchestrate, validate business rules
5. Add route file in `routes/` and register it in `index.ts`

## Key patterns

**Query pattern (Drizzle sync API):**
```ts
// select
db.select(fields).from(table).where(...).all()
db.select(fields).from(table).where(...).get()   // first row or undefined

// insert + get back inserted row
const [row] = db.insert(table).values(data).returning({ id: table.id }).all();
return this.findById(row.id);  // re-query with JOIN for full shape

// update
db.update(table).set(data).where(eq(table.id, id)).returning(...).all();

// delete
db.delete(table).where(eq(table.id, id)).run();
```

**Validation pattern in routes:**
```ts
const result = mySchema.safeParse(req.body);
if (!result.success) return reply.status(400).send({ error: 'Validation error', details: result.error.flatten() });
```

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3001` | Listening port |
| `HOST` | `127.0.0.1` | Bind address (`0.0.0.0` in Docker) |
| `DB_PATH` | `<root>/pennylog.db` | SQLite file location |
| `CORS_ORIGIN` | `localhost:5173,localhost:4173` | Comma-separated allowed origins |

## Scripts

```bash
npm run dev       # tsx watch — hot reload
npm run build     # tsc → dist/
npm run serve     # node dist/index.js (production)
npm run typecheck # tsc --noEmit
```
