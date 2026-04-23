# pennylog

A modern personal expense tracker. Local, single-user, no authentication.

---

## Tech stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Frontend     | React 18 + Vite + TypeScript            |
| Backend      | Fastify + TypeScript                    |
| Database     | SQLite via better-sqlite3 + Drizzle ORM |
| Validation   | Zod                                     |
| Data fetching| TanStack Query v5                       |
| Forms        | React Hook Form                         |
| Charts       | Recharts                                |
| Unit tests   | Vitest + Testing Library                |
| E2E tests    | Playwright                              |

---

## Running locally

### Prerequisites

- **Node.js 20+** — check with `node --version`
- **npm 10+** — check with `npm --version`

### 1. Install dependencies

```bash
npm run install:all
```

This installs packages for the root, `backend/`, and `frontend/` in one step.

### 2. Start the app

```bash
npm run dev
```

This starts both the backend and frontend concurrently:

| Service     | URL                                          |
| ----------- | -------------------------------------------- |
| Frontend    | <http://localhost:5173>                      |
| Backend API | <http://localhost:3001>                      |

On first run the backend creates `backend/pennylog.db` and seeds 10 default categories automatically.

> To start them separately:
>
> ```bash
> npm run dev --prefix backend    # API only
> npm run dev --prefix frontend   # UI only
> ```

---

## Running tests

### Unit tests (Vitest)

Tests utility functions and key React components. No servers needed.

```bash
npm test
```

Example output:

```text
✓ src/__tests__/utils.test.ts  (9 tests)
✓ src/__tests__/kpiCards.test.tsx  (3 tests)
Test Files  2 passed (2)
     Tests  12 passed (12)
```

### End-to-end tests (Playwright)

Covers: dashboard load, create transaction, edit, delete, period filter.

**First time only** — install the browser:

```bash
npx playwright install chromium --with-deps
```

Then run:

```bash
npm run test:e2e
```

Playwright will start both servers automatically if they are not already running.

---

## Resetting the database

To wipe the local SQLite database and start fresh:

```bash
npm run reset
```

This deletes `backend/pennylog.db` (and its `-shm`/`-wal` sidecars) along with the e2e test db files. The backend recreates an empty database with default categories on next startup.

---

## Running with Docker

### Prerequisites

- **Docker** and **Docker Compose** — check with `docker compose version`

### Build and start

```bash
docker compose up --build
```

| Service                      | URL                     |
| ---------------------------- | ----------------------- |
| App (frontend + proxied API) | <http://localhost:8080> |

The frontend nginx container proxies `/api/*` to the backend container. Neither service is exposed individually.

### Stop

```bash
docker compose down
```

The SQLite database is stored in a Docker named volume (`db-data`) and persists across restarts.

To wipe all data:

```bash
docker compose down -v
```

### Rebuild after code changes

```bash
docker compose up --build
```

---

## Project structure

```text
pennylog/
├── backend/
│   ├── src/
│   │   ├── db/            SQLite connection, Drizzle schema, seeding
│   │   ├── repositories/  Data access layer (queries only)
│   │   ├── services/      Business logic
│   │   ├── routes/        Fastify HTTP handlers
│   │   ├── schemas/       Zod validation schemas
│   │   └── utils/         Date range helpers
│   ├── Dockerfile
│   └── CLAUDE.md
├── frontend/
│   ├── src/
│   │   ├── api/           Typed fetch client
│   │   ├── features/
│   │   │   ├── dashboard/ KPI cards, trend chart, category breakdown
│   │   │   └── transactions/ List, item, create/edit form
│   │   └── shared/        Header, Modal, PeriodFilter, EmptyState
│   ├── nginx.conf         Nginx config used in Docker (proxies /api/)
│   ├── Dockerfile
│   └── CLAUDE.md
├── e2e/
│   ├── playwright.config.ts
│   └── tests/app.spec.ts
├── docker-compose.yml
├── CLAUDE.md
└── README.md
```

---

## API reference

| Method | Path                                              | Description               |
| ------ | ------------------------------------------------- | ------------------------- |
| GET    | `/api/health`                                     | Health check              |
| GET    | `/api/categories`                                 | List all categories       |
| GET    | `/api/dashboard?period=today\|week\|month\|year`  | Aggregated dashboard data |
| GET    | `/api/transactions?period=today\|week\|month\|year` | Transaction list        |
| POST   | `/api/transactions`                               | Create transaction        |
| PATCH  | `/api/transactions/:id`                           | Update transaction        |
| DELETE | `/api/transactions/:id`                           | Delete transaction        |

Dashboard response includes: summary KPIs, category breakdown with percentages, and trend data grouped by day (or month for the year view).

---

## Environment variables (backend)

| Variable      | Default                        | Description          |
| ------------- | ------------------------------ | -------------------- |
| `PORT`        | `3001`                         | Listening port       |
| `HOST`        | `127.0.0.1`                    | Bind address         |
| `DB_PATH`     | `<repo>/backend/pennylog.db`   | SQLite file path     |
| `CORS_ORIGIN` | `localhost:5173,localhost:4173`| Allowed origins      |
