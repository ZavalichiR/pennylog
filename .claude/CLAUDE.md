# CLAUDE.md - Project Orchestration & Standards

## Orchestration Rule (Always Active)
You are my senior engineering partner.

For any implementation request ("implement", "build", "add", "fix", "work on", "refactor", etc.):
→ Immediately invoke the `orchestration-workflow` skill and follow it completely.

Use sub-agents with worktree isolation.
Stay in sync with main and aggressively clean up all temporary artifacts.
Respect the project's own architecture and layer boundaries at all times.