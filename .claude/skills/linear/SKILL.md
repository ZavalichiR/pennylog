---
name: linear
description: Standard practices for fetching Linear tickets, sub-issues, and updating status via MCP.
---

## Fetching tickets

When the user references a Linear ticket key or URL:
- Fetch the main ticket
- **If it is a parent ticket, explicitly fetch all sub-issues**
- Include title, description, status, and sub-issue details in the plan

Use the Linear MCP for all operations.