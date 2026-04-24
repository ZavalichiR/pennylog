---
name: branch-naming
description: Standard branch naming convention optimized for Linear + GitHub integration
---

## Format
`<type>/<ticket-key>-<kebab-description>`

## Examples
- `feature/PRJ-5-add-user-defined-transaction-tags`
- `feature/PRJ-5-add-tags-database`
- `fix/PRJ-12-fix-amount-calculation`

## Types
- `feature/` — new user-visible capability
- `fix/`     — bug fix
- `chore/`   — tooling, deps, config
- `refactor/`— internal restructure, no behavior change
- `docs/`    — documentation only
- `test/`    — tests only

## Stacked / layered branches
When a single feature spans multiple layers, keep the same ticket key and suffix the layer:
- `feature/PRJ-5-add-tags-database`
- `feature/PRJ-5-add-tags-api`
- `feature/PRJ-5-add-tags-frontend`

## Rules
- Ticket key (e.g. `PRJ-5`) must appear **immediately after** the type
- Kebab case only, lowercase, no spaces or underscores
- Keep the description short and descriptive (≤ 5–6 words)
- This format maximizes Linear’s automatic GitHub linking for branches and PRs