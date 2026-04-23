# pennylog — project context for Claude

Single-user local expense tracker. No auth, no multi-tenancy.

## Repo layout

```
pennylog/
├── backend/       Fastify API + SQLite (port 3001)
├── frontend/      React + Vite SPA (port 5173 in dev, 8080 via Docker)
├── e2e/           Playwright end-to-end tests
└── docker-compose.yml
```

## Running locally

```bash
npm run install:all   # install all deps (run once)
npm run dev           # start both backend + frontend concurrently
```

## Running tests

```bash
npm test              # Vitest unit tests (frontend)
npm run test:e2e      # Playwright e2e (auto-starts servers)
```

## Key decisions

- **SQLite** — local file at `backend/pennylog.db`; path overrideable via `DB_PATH` env var
- **No ORM migrations** — tables are created with `CREATE TABLE IF NOT EXISTS` on startup; Drizzle is used only for query building
- **Vite proxy** in dev: `/api/*` → `localhost:3001`; in Docker: nginx proxies `/api/` to the backend container
- **No React Router** — single-page app, all state in React

## Conventions

- Backend: add resources by following the routes → services → repositories pattern; keep business logic in services, not routes
- Frontend: keep data fetching in components via `useQuery`/`useMutation`; invalidate `['dashboard']` and `['transactions']` after any mutation
- Zod schemas live in `backend/src/schemas/` (server) and inline in form components (client)
- `data-testid` attributes are used by Playwright — don't remove them
