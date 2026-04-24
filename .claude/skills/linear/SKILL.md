---
name: linear
description: Standard practices for fetching Linear tickets, sub-issues, and updating status via MCP.
---

## Fetching tickets

When the user provides one or more Linear issues as input:
- Fetch each issue.
- For each fetched issue, check whether it has sub-issues.
- If sub-issues exist, fetch them too.
- Summarize the main issue and any sub-issues with relevant status/context for the current task.

Use the Linear MCP for all operations.