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

- **Linear ticket** (key like `PRJ-5` or Linear URL) → use the `linear` skill to fetch the ticket + **all sub-issues**
- **Notion URL** (or other documentation URL) → fetch the page content
- Otherwise treat the entire user message as the feature specification

If the spec contains **multiple independent tasks**, identify and list them clearly.  
If ambiguous, ask one clarifying question and stop.

---

## Phase 2 — Planning (mandatory interactive gate)
Enter **Plan Mode** (read-only). Produce the plan using this exact structure and tree format:

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
- DAG:     [Use clean tree format with ├── and └──. Clearly mark parallel branches]
- Mode:    <parallel | sequential | hybrid>
- Rationale: <one sentence on why this pattern>

## Branch strategy
- Prefer small, focused, independent PRs.
- Base branch: main [Use clean tree format with ├── and └──. Clearly mark parallel branches]
- Integration branch (if fan-in): temp-e2e-integration-<slug>

## Planned sub-agent execution
Show each agent in tree format:
 - Agent name
 - Branch name (with relevant ticket numbers)
 - Short description of work
 - Clearly mark any parallel groups with "(parallel)"
```
Stop and wait for explicit approval (“proceed”, “approve”, “go ahead”). Iterate if needed.

---

## Phase 3 — Dependency-Aware Delegation

Run `git fetch --all --prune` and ensure the main session is clean and on `main`.

**For every agent (strict rules):**

- Use the **exact branch name** from the approved plan and `branch-naming` skill (`feature/ZAV-5-...`).
- Create the branch if it doesn't exist: `git checkout -b <exact-branch-name>`
- Create a dedicated worktree for this branch.
- Delegate the sub-agent to work **only** inside that worktree.
- After the sub-agent finishes:
  - Run lint, type-check, build, and relevant tests on that branch.
  - If checks pass → the sub-agent already committed using `commit-message` skill → **delete the worktree immediately**.
  - If checks fail → delegate fixes back to the same agent and re-verify.
- **Never** run `code-reviewer` here — only technical verification.

---

## Phase 4 — Integration & Final Code Review

Only after **all** individual agents have completed and passed technical verification:

- For chain patterns: the last branch becomes the integration point.
- For fan-in / parallel patterns:
  - Create `temp-e2e-integration-<slug>`
  - Merge the upstream branches into it (in the exact order from the plan).
- From the integration branch (or final branch), run full project verification (lint + build + unit + E2E).
- Run `code-reviewer` **exactly once** on the combined diff vs `main`.
- If changes are requested → delegate fixes back to the responsible agent(s) → re-verify.
- Only when `code-reviewer` returns `APPROVE`, proceed to Layer 5.

---

## Phase 5: Delivery & Cleanup
**Only after `code-reviewer` returns `APPROVE` in Phase 4**:

1. Apply `pr-description` skill where needed (only if creating PRs).
2. **Synchronize branches (dependency-aware)**:
   - Rebase base/root branches on latest `main`.
   - Sequentially rebase stacked branches onto their parent (follow plan order).
3. **Push to remote (conditional)**:
   - Only if user explicitly requested PR creation → `git push --force-with-lease`
   - Otherwise keep everything local.
4. **PR Creation Policy**:
   - Create PRs only if user explicitly requested it.
   - For stacked/fan-in patterns, document base branch and review order in PR description.
5. **Aggressive Cleanup**:
   - Delete all temporary agent worktrees (except the final integration worktree if it exists).
   - Run `git worktree prune`.
   - Delete any spurious `worktree-agent-*` directories.
   - Report remaining artifacts and manual cleanup commands.

---

## Phase 6 — Final Report (always generated)

After cleanup, **always** output this exact report:
Final Execution Report — <ticket>
1. Execution Flow
Agents ran in this order:
Work done in parallel:
Dependencies handled:

2. Branches Created
feature/... → created by [agent] | purpose: ...

3. Worktrees Status
Current worktrees (git worktree list):
Explanation for any remaining worktrees.

4. Manual Testing Guide
You can test any branch manually:
BranchCommand to testfeature/ZAV-5-...git checkout feature/ZAV-5-... && npm run test (or npm run build, npm run dev)temp-e2e-integration-<slug>cd .claude/worktrees/integration && npm run test (node_modules is already symlinked — no reinstall needed)

5. Cleanup Summary
What was cleaned
Remaining artifacts + manual cleanup commands

---

## Permanent Constraints
- Always work from latest `main`
- Respect project layer boundaries
- Main session stays clean
- Never leave temporary worktrees or artifacts behind
