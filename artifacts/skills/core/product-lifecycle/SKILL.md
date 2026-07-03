---
name: core:product-lifecycle
description: >-
  Cross-department product lifecycle orchestrator — drives a product or service
  from idea to monitored launch through six gated phases (CEO gate → Operações →
  Build → Quality gate → Launch → Monitor), with document-first state in
  docs/lifecycle/<slug>.md so the flow is resumable across sessions. Not for
  single-department tasks and not for explaining what a product lifecycle is.
type: process
department: core
when-to-use: >-
  Launching or evolving a product/service end-to-end — "quero lançar um novo
  produto/serviço", "vamos tirar esta ideia do papel", "em que fase está o
  lançamento de X?", resuming a lifecycle in progress, or any initiative that
  must cross CEO decision, operations, build, quality and launch. NOT for a
  task that lives inside a single department (route it directly) and NOT for
  conceptual questions about lifecycles. For mixed multi-department requests
  that are not a product/service lifecycle, use core:conductor.
---

# Product Lifecycle

Rigid process skill — the lifecycle is THE cross-department flow of wzrdxOS
(docs/org.md). One product = one state file = six phases, each ending in a
gate. Never skip a gate; never run phases out of order. The gate is the flow
itself — no blocking hooks (Constitution: quality by construction).

MCP tools used: `kb_search`, `kb_ask`, `kb_ingest`.
Workflows used at gates:
- `balanced-deliberation` (CEO gate) — in-repo `artifacts/workflows/balanced-deliberation/workflow.mjs`, post-install `~/.claude/workflows/balanced-deliberation.mjs`.
- `adversarial-review` + `judge-panel` (Quality gate) — same locations pattern.
- `completeness-critic` (before Launch) — same locations pattern.

## State file — document-first

The single source of truth is `docs/lifecycle/<product-slug>.md` in the
user's project (create `docs/lifecycle/` if missing):

    ---
    product: <human name>
    slug: <kebab-slug>
    phase: 1-ceo-gate | 2-operations | 3-build | 4-quality-gate | 5-launch | 6-monitor
    status: active | paused | killed | shipped
    gates:
      ceo: pending | go | no-go
      quality: pending | ship | fix-first | escalate
    updated: YYYY-MM-DD
    ---

    ## Log
    - YYYY-MM-DD — <phase> — <what happened, verdicts, links>

On EVERY invocation: read the state file first (if it exists), announce the
current phase, execute or delegate ONLY the current phase, update the state
file, and stop at the next gate. If no state file exists, this is a new
lifecycle — start at Phase 1.

## Phases

### 1. CEO gate
`kb_search`/`kb_ask` for prior initiatives, market context and the company
profile (`wzrdx company`). Run `ceo:initiative-eval` to produce the decision
memo, then the `balanced-deliberation` workflow for the go/no-go. Record the
verdict in the state file (`gates.ceo`). **no-go → status: killed**; document
why and `kb_ingest` the post-mortem. go → Phase 2.

### 2. Operações
COO owns it: task breakdown (one owner per task), POPs for anything that will
repeat (`ops:pop-builder`), launch KPIs wired into `ops:kpi-system`. Output:
an execution plan in the state file log. → Phase 3.

### 3. Build
Eng and Marketing run in parallel:
- Eng: implementation under `eng:spec-driven-development` — the SDD soft-gate
  hook (`artifacts/hooks/sdd-gate/`) reinforces spec-first during this phase.
- Marketing: positioning, offer and launch assets (`marketing:offer-architecture`).
Both report into the state file log. When both are done → Phase 4.

### 4. Quality gate
`core:deliverable-review` over every client-facing output; the
`adversarial-review` workflow over the code; `judge-panel` for critical
deliverables. Record `gates.quality`. `kb_ingest` the quality verdict and
must-fix list (`source: lifecycle/<slug>-quality-<date>.md`).
**fix-first → back to Phase 3** with the must-fix list logged.
**escalate → status: paused**; route to CEO+CQO per `core:deliverable-review`
— their decision returns the lifecycle to Phase 3 or kills it. ship → Phase 5.

### 5. Launch
Run `completeness-critic` over the launch checklist first — gaps become
pre-launch tasks. Then execute the launch (comms, deploy, announcement) and
log it. → Phase 6.

### 6. Monitor
Wire actuals into `fin:metrics-dashboard`; compare against the Phase 2 KPIs
at day 7 / day 30. Close with a retro and `kb_ingest` the full lifecycle
summary (`source: lifecycle/<slug>-retro.md`) — learnings feed the next
lifecycle. status: shipped.

## Red flags — STOP if you catch yourself thinking

| Thought | Reality |
|---|---|
| "The CEO gate is obvious, skip it" | The gate exists because obvious-looking initiatives fail; run it. |
| "We can build while the CEO decides" | no-go after build = wasted build. Gates are sequential. |
| "Quality can review after launch" | Post-launch review is a post-mortem, not a gate. |
| "No need to update the state file now" | Un-logged state dies with the session; the file IS the lifecycle. |
| "This is single-department, but I'll lifecycle it anyway" | Route single-department work directly; the lifecycle is for cross-department initiatives. |
