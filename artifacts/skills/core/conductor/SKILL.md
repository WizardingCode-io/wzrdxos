---
name: 'core:conductor'
description: >-
  Universal entry point for wzrdxOS — REQUIRED whenever a request spans MORE
  THAN ONE department (e.g. hire someone + set salary + announce it; pricing +
  campaign; strategy + execution in one ask) or the owner is unclear.
  Decomposes, consults the KB, routes each part via the routing table, applies
  the CEO gate, and documents learnings. Single-department requests go straight
  to that department's skill instead.
type: process
department: core
when-to-use: >-
  Requests that mix two or more departments in one ask (people + money +
  marketing, product + pricing, etc.); unclear owner; "quem trata disto"; "por
  onde começo" when the answer involves several areas; coordinating a full
  wzrdxOS flow end-to-end. NOT for single-department requests — route those
  directly.
---

# Conductor

Rigid process skill — follow every step in order without skipping. This skill is the
universal entry point for the wzrdxOS flow (Constitution rule 1). It decomposes,
routes, coordinates, and closes the KB loop so every request makes the OS smarter.

MCP tools used: `kb_search`, `kb_ask`, `kb_ingest`.

## Steps

### 1. KB-first lookup

Before anything else, consult the KB:

```
kb_search("<the request or its core intent>")
kb_ask("Have we handled a similar request before? What was the outcome?")
```

Look for:
- Prior similar requests or decisions and their outcomes.
- Existing documentation, SOPs, or process notes that apply.
- Known gaps that are relevant to this request.

Record what you found (or confirm that nothing exists yet). This is Constitution
rule 3 — skipping it breaks the compounding loop.

### 2. Decompose into tasks

Break the request into discrete, independently-routable tasks. Each task should
have:
- A clear goal (what done looks like).
- A single owner domain (one row in the routing table below).
- A dependency order if tasks must sequence.

For simple, single-domain requests, the task list has one item. For complex or
multi-department requests, decompose before routing — never route a blended task.

### 3. Route each task via the routing table

Map each task to a row in the table. Use the table literally — do not route by
guesswork.

| Request domain | Department | Head agent | Typical skills |
|---|---|---|---|
| Strategy, vision, go/no-go, OKRs, initiative eval, trade-offs | CEO / Administração | `ceo` | `wzrdx-ceo-balanced-decision`, `wzrdx-ceo-initiative-eval`, `strategy`, `okr-define`, `scenario-analysis`, `blue-ocean`, `five-forces`, `moat-analysis` |
| Execution, process, PM/PO, automation, client-ops, SOPs | Operações (COO) | `coo` | `wzrdx-ops-roadmap-diagnose`, `wzrdx-ops-pop-builder`, `sop-create`, `workflow-automate`, `n8n-flow`, `sprint-plan`, `backlog-groom`, `delegation-matrix` |
| Code, architecture, infra, AI-engineering, DevOps, security, specs | Engenharia (CTO) | `cto` | `wzrdx-eng-spec-driven-development`, `wzrdx-eng-tech-stack-eval`, `architecture-design`, `api-design`, `clean-code-review`, `security-audit`, `ci-cd-pipeline` |
| Money, budget, cash, forecasting, unit economics, pricing policy | Financeiro (CFO) | `cfo` | `wzrdx-fin-metrics-dashboard`, `wzrdx-fin-unit-economics-audit`, `financial-model`, `cashflow-forecast`, `budget-plan`, `pricing-strategy` |
| People, hiring, culture, talent lifecycle, compensation | Recursos Humanos (CHRO) | `chro` | `wzrdx-rh-hiring-pipeline`, `wzrdx-rh-onboarding-60d`, `culture-define`, `performance-review`, `compensation-plan`, `org-design` |
| Brand, content, copywriting, campaigns, SEO, GEO/AEO | Comunicação & Marketing (CMO) | `cmo` | `wzrdx-marketing-rebranding-execution`, `wzrdx-marketing-geo-content`, `brand`, `content`, `copy-framework`, `seo-audit`, `social-strategy` |
| Revenue, pipeline, deals, outreach, partnerships, CRM | Growth / Vendas (CRO) | `cro` | `wzrdx-growth-sales-machine`, `wzrdx-growth-deal-pipeline`, `deal-qualify`, `pipeline-manage`, `cold-email`, `proposal-write` |
| KB ingestion, daily digest, enrichment, curation, knowledge gaps | Knowledge (CKO) | `cko` | `wzrdx-knowledge-daily-digest`, `wzrdx-knowledge-kb-enrich`, `knowledge:skill-promotion`, `knowledge:agent-evolution`, `kb`, `search-kb` |
| Calendar, e-mail, admin deadlines, meetings, filing, buyback | Administrativo (EA) | `ea` | `wzrdx-admin-buyback-audit`, `wzrdx-admin-calendar-defense`, `gtd-setup`, `meeting-optimize` |
| Quality audits, deliverable reviews, non-conformities, compliance | Quality (CQO — transversal) | `cqo` | `core:deliverable-review`, `core:quality-audit`, `lean-audit`, `voc-loop`, `risk-register` |

For tasks that touch more than one row: decompose further until each sub-task maps
to a single row.

**Cross-department flows** (pre-defined hand-off sequences):
- **Product lifecycle:** CEO go → COO orchestrates → Eng + Marketing → Quality → launch.
- **Pricing decision:** CRO proposes → CFO models → CEO gate → CRO implements.
- **First hire:** CHRO pipeline → COO 60-day plan → CHRO+COO execute.
- **Deliverable ship:** owning dept → `core:deliverable-review` → owning head decides.

### 4. CEO balanced-decision gate

Before routing execution tasks, check: does any task constitute a **significant
decision**?

Significant decisions include: market entry, major budget allocation, hiring (any
hire), strategic product direction, pricing policy, partnership commitments, or any
action that materially changes the company's trajectory or resources.

If yes: invoke the `wzrdx-ceo-balanced-decision` skill (or the `wzrdx-ceo` subagent)
**before** executing the task. This enriches the decision through Optimist /
Pessimist-conservative / Risk-taker lenses. It does not block — it takes minutes and
prevents expensive mistakes.

Fast, reversible, operational tasks do not need the CEO gate.

### 5. Execute via the owning department

For each task (after the CEO gate if applicable):

1. **Subagent available:** call `wzrdx-<name>` (e.g. `wzrdx-coo`) as a subagent,
   passing the task and relevant KB context found in step 1. Available after
   `wzrdx install claude`.

2. **Subagent not available:** apply the department's skills directly (use the skill
   names from the routing table). Name which department and head is executing and
   why — give the user full visibility.

3. **Parallel tasks:** tasks with no dependency on each other may run in parallel.
   Tasks that depend on a prior output must sequence.

Document the execution approach before starting ("Routing X to COO via `sop-create`
because...").

### 6. Ship-grade outputs → core:deliverable-review

Any output that will reach a client, be published externally, or represent the
company in a formal context is **ship-grade** and requires a pre-ship review.

Invoke `core:deliverable-review` before handing off to the client. The verdict
(ship / fix-first / escalate) routes to the owning head; they decide.

Internal working documents, drafts, and analysis outputs do not require this step.

### 7. Document learnings to the KB

After completion, ingest new learnings:

```
kb_ingest("<path or inline content>", source="memos/YYYY-MM-DD-<slug>.md", target="global")
```

Document:
- What the request was and how it was decomposed.
- Which routing decisions were made and why.
- Any novel patterns, decisions, or outcomes worth reusing.
- Any new gaps found (for the CKO daily digest to pick up).

Name the gap explicitly if one was found: "Gap: no SOP for X — CKO digest should
route to COO."

## Output contract

Every conductor invocation delivers:
1. **KB findings** — what prior art exists; what is net-new.
2. **Task decomposition** — the discrete tasks, in order, with owners.
3. **Routing decisions** — which department / agent handles each task and why.
4. **CEO gate decision** — which tasks (if any) passed the gate and what the verdict was.
5. **Execution outputs** — the actual work product from each routed task.
6. **KB ingest confirmation** — what was documented and where.

## Red flags

- **Routing by guesswork instead of the table.** The routing table exists precisely to
  prevent arbitrary routing. If a task does not fit a row, decompose further.
- **Skipping decomposition on multi-domain requests.** Routing a blended task to a
  single department is a scope error — it always results in incomplete execution.
- **Executing strategy-grade decisions without the CEO gate.** The gate is fast and
  non-blocking; skipping it for convenience is how expensive mistakes happen.
- **Not consulting the KB first.** Constitution rule 3 is unconditional. Skipping the
  KB-first step means the OS cannot compound — every task starts from zero.
- **Not ingesting learnings.** Rule 4 (document-first) and rule 5 (enrichment) require
  that new learnings land in the KB. A task that does not close the loop is a wasted
  compounding opportunity.
