---
name: commit-message
description: Conventional commit format for all commits produced by this orchestration setup.
---

## Format
```
<type>(<scope>): <subject>

<body — optional, wrap at 72>

<footer — optional: BREAKING CHANGE, ticket refs>
```

## Types
`feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `build`, `style`

## Subject
- Imperative mood ("add", not "added" or "adds")
- No trailing period
- ≤ 72 characters

## Scope
The affected layer or module, lowercase: `domain`, `api`, `ui`, `tests`,
`deps`, `ci`, or a specific module name.

## Ticket reference
Include the ticket key in the footer when one exists:
```
Refs: ENG-123
```

## Rules
- One logical change per commit.
- Never include secrets, tokens, or environment values.
- Do not bypass hooks unless the user explicitly authorizes it.
