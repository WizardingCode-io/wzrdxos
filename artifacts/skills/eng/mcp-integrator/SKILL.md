---
name: eng:mcp-integrator
description: "Decide when and how to integrate a tool via MCP — connector selection/vetting, least-privilege config, the 20-30-connector workspace pattern — and produce an integration plan with config steps."
type: capability
department: eng
when-to-use: Adding a new MCP tool or connector, evaluating a third-party MCP server, reviewing an existing MCP workspace, or when the user says "ligar via MCP", "connector para X", "MCP integration", "qual MCP usar", "plugin para X" or similar.
---

# MCP Integrator

Flexible capability skill. Takes a tool-integration need and produces a vetted,
least-privilege integration plan: whether to use MCP, which connector, how to
configure it, and how it fits the workspace pattern. Adapts from a single connector
decision to a full workspace design.

Anchored on: "MCP USB Universal" framework (DDias Matt — MCP as USB-C for AI),
"Claude Managed Agents Architecture" framework, MCP topic in the KB, Claude Code
Mastery topic. All sourced from the wzrdxOS Obsidian vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- "MCP USB Universal" framework — the USB-C analogy, connector patterns, workspace limits.
- Existing MCP decisions in `docs/` (ADRs) or in the KB (`memos/`).
- The integration need: has this tool or category been evaluated before?
- Company profile (`wzrdx company`) — which runtimes are active, existing connector inventory.

Record what exists. Do not re-evaluate a connector that already has a decision.

### 2. Clarify the integration need

Before recommending a connector, answer:

| Question | Why it matters |
|----------|----------------|
| What task does this tool perform? | Maps to the right MCP category. |
| How often will it be called? | Drives caching strategy and cost tier. |
| What data does it read/write? | Scope the minimum permissions needed. |
| Which agent or skill will use it? | Determines where the MCP config lives. |
| Is there an existing MCP server for this? | Build vs adopt decision. |
| Is this a one-runtime or multi-runtime need? | Affects install path (see `docs/runtimes.md`). |

### 3. Apply the "MCP as USB-C" decision framework

The DDias Matt framework: MCP is the universal port — one standard connector per
tool category, plugged in once, reused by any agent in the workspace.

**When to use MCP (vs. direct API call / native tool):**
- The tool will be used by multiple agents or skills → MCP (reuse).
- The tool needs to persist across sessions (memory, calendar, files) → MCP.
- The tool requires auth that should not be hard-coded in prompts → MCP (secrets in config).
- The tool is a one-off, in-conversation lookup → direct call or native tool is fine.
- The tool is only used by one skill, called once, no reuse value → skip MCP overhead.

**The 20-30-connector workspace pattern:**
- An effective AI workspace has 20-30 carefully selected MCP connectors — no more.
- Each connector occupies a token budget in the available tools list.
- Above 30: tool selection degrades (the model struggles to choose); below 20: capability
  gaps require workarounds.
- When adding a connector, check if an existing one can be repurposed or extended
  before installing a new one.

### 4. Connector selection and vetting

For each candidate connector, score it on:

| Criterion | Pass | Flag | Reject |
|-----------|------|------|--------|
| Source | Official / well-known maintainer | Community, active | Unknown, no commit history |
| License | MIT / Apache 2 | BSL / commercial | Proprietary, no license |
| Scope | Reads only what is needed | Broader read access | Write access to production |
| Auth model | OAuth / API key in env | Hardcoded in config | None |
| Maintenance | Active (commits < 30d) | Stale (30-180d) | Abandoned (> 180d) |
| Alternatives | None or inferior | One comparable | Better alternative exists |

**Vetting rule:** a connector must pass all criteria or have a documented exception.
Third-party connectors with unknown maintainers are rejected by default (Constitution
doctrine: no unreviewed third-party prompts/tools).

### 5. Least-privilege configuration

Every MCP connector is configured with the minimum permissions necessary:

- **Read-only first.** Only add write scopes when a specific, documented need exists.
- **Scoped auth.** API keys and tokens belong in `.env` / secret manager — never in
  the connector config committed to the repo.
- **One key per connector.** Never share an API key between connectors (blast radius
  isolation on compromise).
- **Document what each scope grants.** In the integration plan, list every scope and
  justify why it is needed.
- **Rotate after provisioning.** Note the rotation schedule in the integration plan.

### 6. Produce the integration plan

Structure the plan as:

```
# MCP Integration Plan — <tool name>

**Date:** YYYY-MM-DD
**Status:** proposed | accepted

## Problem
<what task this connector enables; why now>

## Decision
Use MCP connector: <connector name / repo>
Reason: <why this connector over alternatives>

## Vetting scorecard
<table with scores per criterion above>

## Permissions
| Scope | Justification |
|-------|---------------|
| ... | ... |

## Config steps
1. Install: <install command or path>
2. Auth: <where to set the API key / OAuth flow>
3. Register: <how to add to the runtime config — .mcp.json or settings.json>
4. Smoke test: <minimal test call to verify connectivity>
5. Docs: add to `docs/runtimes.md` connector inventory

## Workspace impact
<connector count before → after; any connector to retire to stay within 20-30>

## Open questions / risks
<any unresolved items>
```

Flag any connector that requires write access to production systems or holds
sensitive auth for CEO balanced-decision review before adoption.

### 7. Ingest the integration plan to the KB

```
kb_ingest("<plan text>", source="memos/YYYY-MM-DD-mcp-<tool-slug>.md", target="global")
```

Also update `docs/runtimes.md` with the new connector entry (CTO owns the technical
source of truth in the repo).

## Output contract

Every invocation delivers:
1. **Decision** — use MCP or not, with rationale.
2. **Connector recommendation** — vetted connector with vetting scorecard.
3. **Least-privilege config** — scopes, secrets handling, rotation schedule.
4. **Integration plan** — config steps, smoke test, workspace impact.
5. **KB ingest confirmation** — plan stored at `memos/YYYY-MM-DD-mcp-<slug>.md`.

## Red flags

- **Installing a connector without vetting.** Unknown maintainers are rejected by
  default. Document the exception if you override.
- **Hardcoding credentials in config files.** Secrets belong in env / secret manager.
  A committed API key is a security incident waiting to happen.
- **Exceeding 30 connectors without retiring one.** Tool selection degrades above the
  limit. Every new connector should displace a less-used one or be justified as an
  exception.
- **Broad write scopes on first adoption.** Start read-only. Add write scopes only
  after the connector is proven and the write need is documented.
- **Skipping the KB-first step.** A prior connector evaluation may already exist.
  Re-evaluating from scratch wastes time and may contradict a prior ADR.
- **No smoke test.** A connector that is configured but never verified working is
  silent technical debt.
