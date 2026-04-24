---
name: orchestration-workflow
description: End-to-end orchestration. Smart planning → dependency-aware delegation → verification → review → cleanup.
---

# Orchestration Workflow
Follow these phases in order.

## Phase 0 — Triage
Orchestrate only when the change spans multiple files, layers, or has test impact.  
For tiny changes (<20 LOC, single file, no cross-layer effect) edit directly in the main session.

## Phase 1 — Input Analysis
Parse the request:
- Ticket key / URL → fetch ticket + sub-issues
- Doc URL → fetch page
- Otherwise treat the message as the spec

If the spec contains **multiple independent tasks**, identify and list them clearly.  
If ambiguous, ask one clarifying question and stop.

---

## Phase 2 — Planning (mandatory interactive gate)
Enter **Plan Mode** (read-only). Produce the plan in this exact scannable shape:

```
## Goal
<one sentence>

## Tasks
- Task 1: ...
- Task 2: ... (if multiple)

## Affected layers
- domain: ...
- api:    ...
- ui:     ...
- tests:  ...

## Dependency analysis
- Pattern: <parallel | chain | fan-in | partial>
- DAG:     <e.g. "domain → api → ui;  tests fan in at end">
- Mode:    <parallel | sequential | hybrid>
- Rationale: <one sentence on why this pattern>

## Branch strategy
- Prefer small, focused, independent PRs where possible.
- Base branch: main
- Branches: feature/<slug>-<layer> (from <prev or main>, stacked when needed)
- Integration branch (if fan-in): temp-e2e-integration-<slug>

## Planned sub-agent execution
- business-logic-agent → <one sentence>
- api-agent            → <one sentence>
- frontend-agent       → <one sentence>
- testing-agent        → <one sentence>
- code-reviewer        → final gate
```
Stop and wait for explicit approval (“proceed”, “approve”, “go ahead”). Iterate if needed.

---

## Phase 3 — Dependency-Aware Delegation
`git fetch --all --prune` and ensure clean main.

Execute according to the approved plan:
- Independent work → parallel (each from main)
- Dependent work → sequential (branch from upstream branch)
- Fan-in → use temporary integration branch when required

Use worktree isolation for all agents except `code-reviewer`.

---

## Phase 4 — Integration & Verification

1. Collect results from all agents.
2. If the pattern was fan-in or hybrid, ensure the integration branch
   exists and contains all upstream work.
3. From the integration branch (or the tip of a linear stack), run the
   full project verification: lint, typecheck, build, unit, integration,
   E2E. Fix failures by dispatching back to the responsible agent — never
   silently patch in the orchestrator.
4. Invoke `code-reviewer` on the combined diff vs `main`.

---

## Layer 5: Delivery & Cleanup
Only after `code-reviewer` returns `APPROVE`:

1. Apply `branch-naming`, `commit-message`, and `pr-description` skills.
2. **Synchronize branches (dependency-aware)**:
   - Rebase base/root branches on latest `main`.
   - Sequentially rebase stacked branches onto their parent (follow topological order from the plan).
3. **Push to remote (conditional)**:
   - Only if user explicitly requested PR creation → `git push --force-with-lease`
   - Otherwise keep everything local.
4. **PR Creation Policy**:
   - Create PRs only if user explicitly requested it.
   - For stacked/fan-in patterns, document base branch and review order in PR description.
5. Perform final cleanup:
   - Run `git worktree prune`
   - Delete all temporary worktrees
   - (If created) report the name of the temporary E2E integration branch and the command to delete it: `git branch -D temp-e2e-integration-xxx`

---

## Permanent Constraints
- Always work from latest `main`
- Respect project layer boundaries
- Main session stays clean
- Never leave temporary worktrees or artifacts behind
