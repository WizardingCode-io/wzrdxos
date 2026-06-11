---
name: eng:aios-operating-model
description: Structure an AI Operating System deployment for a company or team using the Liam Ottley 5-Layer AIOS framework and the /new-employee agent pattern — producing a complete AIOS blueprint.
type: capability
department: eng
when-to-use: Setting up or auditing the AI infrastructure for a company or team, structuring agent roles and layers, onboarding a new agent into the OS, or when the user says "estruturar o OS de IA", "AIOS blueprint", "como organizar os agentes", "new employee pattern", "camadas do AI OS" or similar.
---

# AIOS Operating Model

Flexible capability skill. Takes a company/team context and produces a structured
AIOS blueprint — five layers mapped to the specific company, agents provisioned
per the /new-employee pattern, and a deployment sequence. Adapts from a full
green-field design to an audit of an existing deployment.

Anchored on: Liam Ottley 5-Layer AIOS Framework (KB topic "AI Operating Systems"),
Claude Code Mastery topic, Claude Managed Agents Architecture framework. Persona
Liam Ottley as the AIOS design reference. All sourced from the wzrdxOS Obsidian
vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- "AI Operating Systems" topic — Liam Ottley 5-Layer Framework detail.
- "Claude Managed Agents Architecture" framework — agent provisioning patterns.
- Existing agent manifests in `artifacts/agents/` and deployed configs.
- Company profile (`wzrdx company`) — departments, heads, current runtime, team size.
- Prior AIOS blueprints or architecture memos in the KB (`memos/`).

Note what already exists. Do not re-design what is already decided.

### 2. Map the 5 layers to the company context

Apply the Liam Ottley AIOS model. For each layer, populate the company-specific
content:

**Layer 1 — Foundation (Memory & Knowledge):**
- What is the knowledge base? (wzrdxOS: Graphify + LanceDB + Obsidian vault)
- How is knowledge ingested, queried, and enriched?
- Who owns it? (wzrdxOS: CKO)
- Gap: what is missing and how will it be filled?

**Layer 2 — Intelligence (Models & Reasoning):**
- Which models are in use, at which tier, for which task type?
- Model selection matrix (see `eng:token-cost-optimization`).
- Routing logic: which task tier triggers which model?
- Fallback and degradation strategy.

**Layer 3 — Agents (Roles & Tools):**
- Agent roster: name, role, department, tier, model, tool set.
- Each agent has: a system prompt, a defined tool set (least-privilege), a memory
  store, and a reporting cadence.
- Orchestration pattern: how agents communicate and delegate.
- For wzrdxOS: CEO/C-suite tier-0 → dept heads tier-1 → specialists tier-2 →
  support tier-3.

**Layer 4 — Workflows (Automation & Processes):**
- Which workflows are automated vs. human-in-the-loop?
- Trigger types: on-demand (skill invocation), scheduled (cron), event-driven (webhook).
- Workflow artifacts: `artifacts/workflows/` for reusable patterns; department
  SOPs/POPs for operational flows.
- Cross-department flows: product lifecycle, pricing decision, first hire, ship gate.

**Layer 5 — Interface (Interaction & Experience):**
- How do humans interact with the OS? (CLI, chat, scheduled reports, dashboards)
- Skill discovery: how does a user know which skill to invoke?
- Output formats: memos (docx), dashboards (xlsx), decks (pptx), KB artifacts.
- Routing entry point: `core:conductor` as the universal entry point for any request.

### 3. Apply the /new-employee pattern for each agent

For every agent in the roster (Layer 3), provision using the /new-employee pattern:

1. **Role brief** — what this agent does, what it does NOT do, who it reports to.
2. **Tool list** — exactly which MCP tools and skills it can invoke (no more).
3. **Memory store** — which KB scope it reads and writes (project vs. global).
4. **Reporting cadence** — how it surfaces outputs (KB ingest, digest routing, alerts).
5. **Escalation path** — which agent or human it escalates to when stuck.
6. **Agent file** — create `artifacts/agents/<name>/agent.md` per `docs/formats.md`.

Do not activate an agent without completing all five elements. An agent without a
reporting cadence or escalation path is a black box.

### 4. Produce the AIOS blueprint

Structure the blueprint as:

```
# AIOS Blueprint — <company / team name>

**Date:** YYYY-MM-DD
**Version:** v<N>

## Layer 1 — Foundation (Memory & Knowledge)
<KB stack, ingestion pipeline, ownership, known gaps>

## Layer 2 — Intelligence (Models & Reasoning)
<model roster, selection matrix, routing logic, fallbacks>

## Layer 3 — Agents (Roles & Tools)
| Agent | Role | Dept | Tier | Model | Tools | Memory store | Reports to |
|-------|------|------|------|-------|-------|-------------|------------|
| ... | ... | ... | ... | ... | ... | ... | ... |

## Layer 4 — Workflows (Automation & Processes)
<automated workflows, triggers, human-in-the-loop gates>

## Layer 5 — Interface (Interaction & Experience)
<interaction modes, skill discovery, output formats>

## Deployment sequence
<ordered steps to activate layers; Layer 1 before 2 before 3 before 4 before 5>

## Known gaps
<what is missing at each layer; owner; resolution path>
```

Flag any decision that materially affects budget (model tier, managed agent costs)
or that requires strategy-grade alignment for the CEO balanced-decision gate.

### 5. Deployment sequence

Activate layers in order — earlier layers must be stable before later ones are built:

1. Foundation: KB stack operational, ingestion running, watermark advancing.
2. Intelligence: model tiers confirmed, routing logic documented, caching configured.
3. Agents: each provisioned via /new-employee pattern, tested with a smoke call.
4. Workflows: automated flows tested end-to-end in staging before production.
5. Interface: skill discovery validated, entry points documented, team trained.

### 6. Ingest the blueprint to the KB

```
kb_ingest("<blueprint text>", source="memos/YYYY-MM-DD-aios-blueprint-<slug>.md", target="global")
```

Store a copy in `docs/aios-blueprint.md` — the CTO owns the technical source of
truth in the repo.

## Output contract

Every invocation delivers:
1. **5-layer map** — each layer populated with company-specific content.
2. **Agent roster** — every agent provisioned with the /new-employee pattern elements.
3. **Deployment sequence** — ordered activation plan.
4. **AIOS blueprint document** — ready to paste into `docs/` and ingest to KB.
5. **Known gaps list** — what is missing, who owns it, how it will be closed.

## Red flags

- **Activating Layer 3 before Layer 1.** Agents without a KB have no memory — every
  session starts from zero, compounding is impossible.
- **Over-provisioning tool sets.** An agent with too many tools makes poor choices
  and is a security surface. Every tool in the list must be justified.
- **Designing Layer 5 first.** The interface is a consequence of the layers below it,
  not the other way around.
- **No reporting cadence for managed agents.** Silent agents produce invisible outputs.
  CKO cannot route what is not ingested.
- **Skipping the KB-first step.** An existing blueprint may already exist; building
  on top is faster and safer than replacing.
- **Blueprint not landed in `docs/`.** Architectural decisions in the KB only are not
  the technical source of truth — they must be in the repo.
