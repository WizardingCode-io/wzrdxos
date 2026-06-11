---
name: ops:automation-discovery
description: Map repetitive workflows to automation (n8n/Zapier/AI agents), score by frequency×time×error-risk, pick the right tool per flow, estimate ROI, and produce an automation backlog ordered by return.
type: capability
department: ops
when-to-use: Identifying what to automate, choosing between n8n/Zapier/AI agents, building an automation backlog, estimating ROI on automation, or when the user says "o que posso automatizar", "n8n vs Zapier", "fluxo repetitivo", "automation backlog", "quanto tempo poupo" or similar.
---

# Automation Discovery

Flexible capability skill. Takes a workflow inventory (or helps build one from
scratch) and produces a scored automation backlog — each flow ranked by ROI,
matched to the right tool (n8n / Zapier / AI agent), with implementation notes.

Anchored on: KB Area 10 (Operações & Automação), Diagnostico-2026-05 (operational
inefficiencies, centralisation pattern), Dan Martell Buy Back Your Time (automation
as the first buyback lever), Alex Hormozi 90%-autonomous-ops model, n8n and Zapier
workflow patterns from the KB. All sourced from the wzrdxOS Obsidian vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- KB Area 10 (Operações & Automação) — automation patterns, tool decisions, existing
  flows already documented.
- Diagnostico-2026-05 — which operational bottlenecks have automation potential.
- Prior automation backlog or n8n/Zapier flow designs in the KB (`memos/`).
- Company profile (`wzrdx company`) — current tools stack, active integrations,
  team size, revenue (determines which tier of automation makes economic sense).
- Output of `admin:buyback-audit` or `ops:delegation-audit` if available — these
  surface the time-heavy tasks that are the best automation candidates.

Record what exists. Do not rediscover flows that are already documented or automated.

### 2. Build the workflow inventory

If no prior inventory exists, systematically surface repetitive workflows across
all departments. For each workflow, capture:

| Workflow | Department | Frequency | Time/occurrence (min) | Error/delay risk (1-5) | Currently manual? |
|----------|------------|-----------|----------------------|------------------------|-------------------|
| ... | ... | daily/weekly | ... | ... | yes/no |

Prompt for workflows in each category:
- **Lead / client intake:** form submissions, new lead notification, CRM entry, welcome email.
- **Reporting:** weekly KPI pull, dashboard update, financial snapshot, digest.
- **Client communication:** follow-up sequences, status updates, invoice reminders.
- **Internal ops:** meeting scheduling, task assignment, status reporting, file management.
- **Content / marketing:** content scheduling, social posting, repurposing triggers.
- **Finance admin:** invoice creation, payment tracking, expense categorisation.
- **HR / people:** onboarding checklists, 1:1 reminders, culture ritual triggers.

Aim for 20-40 workflows. Fewer than 10 suggests the inventory is incomplete.

### 3. Score each workflow (Frequency × Time × Error-risk)

Score every workflow on three dimensions:

**Frequency score (F):**
- 5 = multiple times per day
- 4 = daily
- 3 = 2-4× per week
- 2 = weekly
- 1 = monthly or less

**Time score (T):**
- 5 = > 60 min/occurrence
- 4 = 30-60 min
- 3 = 15-30 min
- 2 = 5-15 min
- 1 = < 5 min

**Error/delay risk score (E):**
- 5 = high: errors happen regularly or delays cause client impact
- 3 = medium: occasional errors or delays
- 1 = low: rarely fails, low impact if it does

**Composite score = F × T × E** (range: 1-125). Higher score = higher ROI for
automation. Sort the backlog by composite score, descending.

### 4. Select the right tool per workflow

Match each workflow to the right automation tier:

**Tier 1 — Simple integrations (Zapier):**
- Use when: trigger → action, 2-3 apps, no branching logic, no data transformation.
- Best for: form → CRM, new email → task creation, calendar event → notification.
- Constraint: Zapier is fast to set up but expensive at scale (Zap limits); prefer for
  simple, high-value triggers.
- Example: "New Typeform submission → HubSpot contact → Slack notification."

**Tier 2 — Complex multi-step flows (n8n):**
- Use when: multi-branch logic, data transformation, loops, webhooks, custom code nodes.
- Best for: weekly report generation, client onboarding sequences, invoice automation,
  multi-step approval flows.
- Constraint: requires technical setup (self-hosted or n8n cloud); higher upfront cost
  but lower per-execution cost than Zapier at volume.
- Example: "Every Friday 17h → pull KPIs from spreadsheet → generate report →
  send to CEO → ingest to KB."

**Tier 3 — AI agents (wzrdxOS skills + managed agents):**
- Use when: the task requires reasoning, language generation, judgment, or context
  that simple trigger-action cannot handle.
- Best for: content drafting, email triage, lead qualification, deal debrief, KB
  enrichment, diagnostic synthesis.
- Constraint: token cost per run; design with `eng:token-cost-optimization` in mind.
  Do not use an AI agent for tasks that a deterministic rule handles correctly.
- Example: "New lead intake → AI agent qualifies against ICP → drafts personalised
  outreach → routes to CRO for review."

**Hybrid flows:** many high-value automations combine Tier 2 + Tier 3 — n8n handles
the orchestration (triggers, data routing, scheduling) and calls an AI agent for the
reasoning step.

### 5. Estimate ROI per workflow

For each scored workflow:

```
Time saved per week (h) = Frequency (per week) × Time (h/occurrence)
Annual time saved (h)   = Time saved per week × 52
Annual value saved (€)  = Annual time saved × founder/team hourly rate
Implementation cost (€) = Setup time (h) × CTO hourly rate + tool subscription cost
Payback period (months) = Implementation cost / (Annual value saved / 12)
```

Hourly rate guideline: use the Buyback Rate from `admin:buyback-audit` if available;
otherwise use the company's effective hourly rate (annual revenue / hours worked).

Flag any workflow where payback period > 6 months — these are low-priority unless
there is a strategic reason (client impact, error prevention, capability building).

### 6. Produce the automation backlog

Structure the backlog as a prioritized table:

```
# Automation Backlog — <company / date>

## Priority tier 1 (composite score ≥ 60 — implement first)
| Rank | Workflow | Score | Tool | Annual saving (h) | Payback (mo) | Owner | By when |
|------|----------|-------|------|------------------|-------------|-------|---------|
| 1 | ... | ... | n8n | ... | ... | COO | D30 |

## Priority tier 2 (score 30-59 — implement after tier 1)
...

## Priority tier 3 (score < 30 — backlog; revisit in 90d)
...

## Already automated (for reference)
...

## Total projected saving
Annual time saved: X hours
Annual value saved: €X
Total implementation cost: €X
Blended payback: X months
```

### 7. Handoffs and next steps

- **n8n flows:** hand off to `arka-n8n-flow` skill for detailed flow design.
- **Zapier flows:** hand off to `arka-zapier-flow` skill for detailed flow design.
- **AI agent flows:** hand off to `eng:ai-agent-architecture` for agent design.
- **Time audit missing:** if step 2 surfaced very few workflows, run `admin:buyback-audit`
  first to get a complete task inventory.

### 8. Ingest the backlog to the KB

```
kb_ingest("<automation backlog>", source="memos/YYYY-MM-DD-automation-discovery.md", target="global")
```

## Output contract

Every invocation delivers:
1. **Workflow inventory** — 20-40 repetitive flows across all departments.
2. **Scored backlog** — every flow ranked by F×T×E composite score.
3. **Tool match** — Zapier / n8n / AI agent selected per flow with rationale.
4. **ROI table** — annual time saved, annual value, payback period per flow.
5. **Handoff list** — which flows route to which next skill.

## Red flags

- **Automating without scoring.** Gut-feeling automation priorities are usually wrong.
  Score first; implement in priority order.
- **Using an AI agent for deterministic tasks.** If a rule handles it correctly 100%
  of the time, use n8n logic — not an AI agent. AI agents add cost and latency;
  reserve them for tasks requiring genuine reasoning.
- **Skipping the KB-first step.** Prior flow decisions and existing automations are
  in the KB. Re-building what already exists wastes implementation budget.
- **No owner per backlog item.** Automation items without an owner are not implemented.
  Every row needs a named person and a date.
- **ROI estimate without a baseline time measurement.** An estimate without data is
  a guess. If no time tracking data exists, note the uncertainty and recommend
  `admin:buyback-audit` first.
- **Backlog items in tier 3 with payback > 12 months.** Do not implement low-priority,
  high-cost automations when high-value ones are waiting. Sequence matters.
