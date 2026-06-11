---
name: fin:cfo-4-pilares
description: "Diagnostic across the 4 CFO pillars (Planeamento · Contabilidade · Análise · Risco) — score 1-5 per pillar with evidence, identify the weakest pillar, produce a rebalancing roadmap; output = pillar diagnostic memo."
type: capability
department: fin
when-to-use: Running a financial health check, diagnosing CFO maturity, preparing a board memo on financial governance, or when the user says "diagnóstico financeiro", "pilares do CFO", "saúde financeira", "planeamento contabilidade análise risco", "CFO check" or similar.
---

# CFO 4 Pilares Diagnostic

Flexible capability skill. Scores the company's financial management across the 4
pillars of the CFO framework (Planeamento · Contabilidade · Análise · Risco), surfaces
the weakest pillar with supporting evidence, and produces a prioritised rebalancing
roadmap.

Anchored on the "4 Pilares de Atividade do CFO" KB framework (vault:
Topics/Frameworks/4 Pilares do CFO), the CEO Scorecard 7 Numbers (Dan Martell), and
the Diagnostico-2026-05 KPI set.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- The "4 Pilares de Atividade do CFO" framework — definitions, expected maturity
  signals per pillar, and scoring rubric.
- Company profile (`wzrdx company`) — current financial state, team size, revenue
  stage, existing tools.
- Diagnostico-2026-05 — existing KPI baselines, the 25 operational KPIs, and any
  prior financial health data.
- Prior CFO diagnostic memos or financial risk registers already in the KB.
- CEO Scorecard 7 Numbers (Dan Martell) — MRR, net-new MRR, churn, pipeline,
  payroll vs revenue, runway, net profit — to cross-check what is already tracked.

Surface what is already known per pillar before collecting new data. Only ask the
user for genuine gaps.

### 2. Evidence collection

For each pillar, collect evidence from the user or existing KB data:

**Pillar 1 — Planeamento (Planning)**
Evidence signals:
- Is there a written annual budget and monthly plan? (yes / draft / no)
- Is there a rolling 12-month cash-flow forecast updated at least monthly? (yes / no)
- Are OKRs or financial targets formally set and reviewed quarterly? (yes / no)
- Is there a scenario model (best / likely / worst) for the next 6-12 months? (yes / no)
- Does the team meet regularly against plan vs actual? (weekly / monthly / never)

**Pillar 2 — Contabilidade (Accounting)**
Evidence signals:
- Is bookkeeping current (< 30 days behind)? (yes / no)
- Is there a reconciled P&L and balance sheet available at least monthly? (yes / no)
- Are invoices issued and followed up systematically? (yes / partly / no)
- Is IVA and statutory reporting delivered on time without last-minute scramble? (yes / no)
- Is the external accountant relationship structured (defined deliverables, cadence)? (yes / no)

**Pillar 3 — Análise (Analysis)**
Evidence signals:
- Are unit economics per revenue stream tracked and reviewed? (yes / partly / no)
- Is CAC/LTV/Payback calculated per offer type? (yes / no)
- Is there a financial dashboard with the 7 CEO numbers updated weekly? (yes / no)
- Are financial variances (plan vs actual) analysed with a root-cause explanation? (yes / no)
- Is pricing set with margin data, not intuition? (yes / no)

**Pillar 4 — Risco (Risk)**
Evidence signals:
- Is there a financial risk register (FX, concentration, runway, credit)? (yes / no)
- Is cash runway ≥ 6 months? (yes / < 6m / unknown)
- Is revenue concentration < 50% in any single client? (yes / no / unknown)
- Are there documented default-debt thresholds (AR overdue warning levels)? (yes / no)
- Are major financial obligations (rent, payroll, debt service) mapped and stress-tested? (yes / no)

### 3. Score each pillar 1-5

Apply the scoring rubric to each pillar. Each "yes" above adds ~0.5 to the score.
Anchor against the rubric:

| Score | Meaning |
|-------|---------|
| 1 | Absent — no systematic practice; firefighting mode. |
| 2 | Ad-hoc — done irregularly or only when a problem forces it. |
| 3 | Developing — process exists but not consistently executed; gaps in quality. |
| 4 | Managed — consistent execution; gaps are known and being closed. |
| 5 | Optimised — proactive, data-driven, feeding CEO decisions in real time. |

Provide the evidence sentences that justify each score. Do not assign a score
without at least two evidence data points per pillar.

Produce the pillar scorecard:

| Pillar | Score (1-5) | Evidence summary | Key gap |
|--------|-------------|------------------|---------|
| Planeamento | | | |
| Contabilidade | | | |
| Análise | | | |
| Risco | | | |
| **Overall CFO maturity** | *avg* | | |

### 4. Identify the weakest pillar

State the lowest-scoring pillar explicitly. If two pillars are tied, apply the
tiebreaker: which gap creates the most immediate business risk?

State the consequence of leaving the weakest pillar unaddressed for the next 90 days.

### 5. Rebalancing roadmap

Produce a 90-day roadmap prioritising the weakest pillar while maintaining the
others. Structure as:

**Now (days 1-30) — Stop the bleeding in [weakest pillar]:**
- Action 1: [specific, named action — owner — deadline]
- Action 2: ...

**Soon (days 31-60) — Lift the floor on the next weakest:**
- Action 1: ...

**Later (days 61-90) — Build the intelligence layer:**
- Action 1: ...

Each action must name a tool, ritual, or artefact that will exist at the end of the
period (e.g. "rolling 12-month forecast model in Sheets — CFO — by 2026-07-15").
No vague actions.

### 6. Cross-reference to adjacent skills

- If Planeamento scores ≤ 2: route to `fin:cash-first-ops` for the cash ritual
  before building a plan.
- If Análise scores ≤ 2: route to `fin:unit-economics-audit` for per-stream P&L
  before building the dashboard.
- If Risco scores ≤ 2 with runway unknown: route to `fin:cash-first-ops` for the
  runway calculation as the immediate fix.
- If pricing is intuition-driven (Análise gap): route to `fin:pricing-redesign`
  for the economics-side review.

State these cross-references explicitly in the memo so the CEO/CFO can sequence work.

### 7. Ingest memo to KB

After producing the diagnostic, ingest via `kb_ingest`:
- Title: `CFO 4 Pilares Diagnostic — <Company> — <YYYY-MM>`.
- Source path: `memos/fin/cfo-4-pilares-<company-slug>-<YYYY-MM>`.
- Tags: `cfo`, `financeiro`, `diagnóstico`, `planeamento`, `contabilidade`,
  `análise`, `risco`, `<company-slug>`.
- Include: pillar scorecard table, evidence per pillar, weakest-pillar statement,
  and the full 90-day rebalancing roadmap.

## Output contract

The deliverable always contains:
1. **Pillar scorecard** — score (1-5) + evidence summary + key gap per pillar,
   plus overall CFO maturity average.
2. **Weakest pillar statement** — named pillar, evidence, consequence of inaction.
3. **90-day rebalancing roadmap** — specific actions with owner and deadline in each
   of the three windows (Now / Soon / Later).
4. **Cross-references** — adjacent skills to invoke, in sequenced order.
5. **Next action** — single highest-impact financial governance action, owner,
   deadline within 14 days.

## Red flags

- Scoring a pillar without naming at least two evidence data points — a score is an
  opinion without evidence.
- Giving the same score to all four pillars — real organisations are always uneven;
  probe harder.
- Producing a roadmap with "review financials" or "improve tracking" as actions —
  every action must name a specific artefact or ritual.
- Recommending Análise improvements before Contabilidade reaches score ≥ 3 —
  you cannot analyse data you are not recording.
- Ignoring the Risco pillar because there is no formal risk register — absence of
  data is itself a risk signal.
- Not ingesting the memo — the KB must hold the diagnostic history so the next run
  shows progress.
