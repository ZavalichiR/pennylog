# pennylog frontend

React 18 + Vite + TypeScript SPA. Port 5173 in dev.

## Structure

```
src/
├── api/
│   └── client.ts          Typed fetch wrapper; all API calls live here
├── features/
│   ├── dashboard/          KPICards, TrendChart, CategoryBreakdown, Dashboard
│   └── transactions/       TransactionList, TransactionItem, TransactionForm
├── shared/
│   └── components/         Header, Modal, PeriodFilter, EmptyState
├── styles/globals.css       All styles — CSS custom properties, no CSS-in-JS
├── types.ts                 Shared TypeScript types (mirrors backend shapes)
└── App.tsx                  Root: period state + modal open/close state
```

## Data fetching

All server state goes through TanStack Query. Query keys:
- `['dashboard', period]` — dashboard aggregation
- `['transactions', period]` — transaction list
- `['categories']` — category list (staleTime: Infinity, rarely changes)

After any mutation (create / update / delete), invalidate both:
```ts
queryClient.invalidateQueries({ queryKey: ['dashboard'] });
queryClient.invalidateQueries({ queryKey: ['transactions'] });
```

## Forms

React Hook Form + Zod resolver. Schema defined inline in `TransactionForm.tsx`.
Use `z.coerce.number()` for numeric inputs (HTML inputs always return strings).

## Styling

Pure CSS in `src/styles/globals.css`. CSS custom properties defined on `:root`.
No Tailwind, no CSS modules. Class names are semantic (`.tx-item`, `.kpi-card`, etc).

## Testing

- Unit tests: `src/__tests__/` — Vitest + Testing Library
- E2E: `../e2e/` — Playwright, uses `data-testid` attributes for selectors
- Keep `data-testid` on interactive elements; Playwright depends on them

## Scripts

```bash
npm run dev         # Vite dev server with /api proxy to :3001
npm run build       # tsc + vite build → dist/
npm test            # vitest run (CI mode)
npm run test:watch  # vitest interactive watch
npm run typecheck   # tsc --noEmit
```
