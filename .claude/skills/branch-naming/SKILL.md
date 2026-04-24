---
name: branch-naming
description: Standard branch naming convention for all work produced by this orchestration setup.
---

## Format
`<type>/<ticket-or-slug>-<kebab-description>`

## Types
- `feature/` — new user-visible capability
- `fix/`     — bug fix
- `chore/`   — tooling, deps, config
- `refactor/`— internal restructure, no behavior change
- `docs/`    — documentation only
- `test/`    — tests only

## Stacked / layered branches
When a single feature spans multiple layers, suffix the layer:
- `feature/ENG-123-add-export-domain`
- `feature/ENG-123-add-export-api`
- `feature/ENG-123-add-export-ui`

## Integration branches (temporary)
`temp-e2e-integration-<slug>` — always prefixed `temp-`; must be deleted
or surfaced for deletion at cleanup time.

## Rules
- Kebab case only; lowercase; no spaces; no underscores.
- Keep the description under 5 words.
- Include the ticket key when one exists.
