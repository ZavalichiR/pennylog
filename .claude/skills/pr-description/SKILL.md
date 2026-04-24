---
name: pr-description
description: Standard PR description template for all PRs produced by this orchestration setup.
---

```markdown
## Summary
<1–3 bullets: what changed and why, user-facing perspective>

## Ticket
<ticket key + link, or "none">

## Dependency context
- Pattern: <parallel | chain | fan-in | partial>
- Base branch: <main | previous stacked branch>
- Stacked on: <PR # or "n/a">
- Merges before: <PR # or "n/a">

## Key changes
- <layer>: <change>
- <layer>: <change>

## Verification
- [ ] Lint / typecheck
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E (if applicable)
- [ ] Manual QA steps: <list or "n/a">

## Risks & rollback
<risk> → <mitigation / rollback plan>

## Screenshots / recordings
<only for UI changes; else remove this section>
```

## Rules
- Keep the Summary scannable — reviewers read this first.
- The Dependency context section is required for any orchestrated change so
  reviewers land stacked PRs in the correct order.
- Remove sections that are truly not applicable; do not leave "n/a" spam.
