---
name: fin:metrics-dashboard
description: Build or update the weekly financial KPI dashboard and CEO scorecard feed — MRR, margem operacional, runway, receita por fonte concentration, pipeline €; based on Dan Martell 7-Number / 5-Number CEO Scorecard wired to the WizardingCode KPI set.
type: capability
department: fin
when-to-use: Building or updating the financial-KPI dashboard, producing the weekly financial snapshot, feeding the CEO scorecard, or when the user says "dashboard financeiro", "scorecard", "snapshot semanal", "KPIs financeiros" or similar.
---

# Fin Metrics Dashboard

Flexible capability skill. Assembles the weekly financial KPI dashboard and CEO
scorecard feed. Depth adapts to available data — a complete data brief yields a
fully quantified scorecard; a sparse brief yields a hypothesis dashboard with
data-gathering tasks as the first output.

Anchored on the Dan Martell CEO Scorecard (7 Numbers and 5-Number variants) wired
to the WizardingCode KPI set from the Diagnostico-2026-05, and the 4 Pilares do
CFO framework from the Obsidian vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — name, market, revenue streams, team size.
- Prior dashboards, scorecard snapshots or KPI baselines already in the KB.
- Diagnostico-2026-05 KPI set — target €1M @ 2026-12-31, threshold €83K/month.
- CEO Scorecard frameworks: Dan Martell 7 Numbers / 5-Number, 4 Pilares do CFO.
- Prior financial risk register entries (surface any open flags).

Note what is already measured. Only generate new definitions for genuine gaps.

### 2. Data intake

Collect (or infer from context) the current-period figures:

| Metric | Source | Period |
|--------|--------|--------|
| MRR (Monthly Recurring Revenue) | CRM / invoicing | Current month |
| Receitas não-recorrentes | Invoicing | Current month |
| Receita por fonte | Revenue breakdown | Current month |
| Margem operacional bruta | P&L | Current month |
| Runway (meses) | Bank balance / monthly burn | Current |
| Pipeline € (weighted) | CRM pipeline | Rolling |
| Novos clientes | CRM | Current month |
| Churn (€ e %) | CRM / invoicing | Current month |
| Despesas fixas + variáveis | Expense tracker | Current month |
| CAC médio | Marketing spend / new clients | Rolling 90d |

If data is missing for a metric, flag it explicitly and assign a data-gathering
task with an owner and deadline.

### 3. Scorecard assembly

Build the CEO Scorecard using the Dan Martell 7-Number framework, adapted to the
WizardingCode KPI set:

#### The 7 Numbers (weekly)

| # | Number | Current | Target | Alert |
|---|--------|---------|--------|-------|
| 1 | **MRR** | | €83K/month threshold | < threshold = red |
| 2 | **Margem operacional** | | ≥ 30% | < 30% = amber; < 20% = red |
| 3 | **Runway** | | ≥ 6 months | < 6 months = amber; < 3 = red |
| 4 | **Receita por fonte** (top source %) | | < 50% concentration | ≥ 50% = amber; ≥ 70% = red |
| 5 | **Pipeline €** (weighted) | | 3× monthly target | < 2× = amber |
| 6 | **Novos clientes** | | Per growth plan | Below target = amber |
| 7 | **Churn € (MRR)** | | < 3% monthly | > 3% = amber; > 5% = red |

#### Status legend
- **Green:** on target.
- **Amber:** within 20% of threshold — monitor and act within 2 weeks.
- **Red:** threshold breached — immediate escalation to CEO.

#### 5-Number (executive summary strip)

Condensed version for the CEO briefing (Dan Martell 5-Number):

| MRR | Margem | Runway | Pipeline | Clientes novos |
|-----|--------|--------|----------|----------------|

### 4. Variance analysis

Compare current period vs. prior period (week-on-week or month-on-month):
- Absolute change and % change for each of the 7 Numbers.
- Root cause for any metric moving > 10% in either direction.
- Cross-reference with operational KPIs (from COO dashboard) for causality.

### 5. Alert generation

For every amber or red metric:
- Name the metric and threshold breached.
- State the current value and the gap.
- Propose the immediate action: owner, deadline, success criterion.
- Escalate reds to the CEO via the weekly scorecard memo.

### 6. Weekly cadence (via `schedule`)

Set up or confirm the recurring snapshot:
- Frequency: weekly, every Friday at 16h (before the Friday 17h ops review ritual
  so CFO data feeds the COO's Friday review).
- Format: the scorecard table + alert block + prior-week comparison.
- Distribution: CEO scorecard feed + CFO financial risk register update.
- Tool: invoke `schedule` to register the recurring task if not already set.

### 7. Ingest snapshot to KB

After producing each weekly snapshot, ingest it into the KB via `kb_ingest`:
- Title: `Dashboard Financeiro — <Company> — <YYYY-WNN>`.
- Tags: `dashboard`, `financeiro`, `scorecard`, `kpis`, `<company-slug>`.
- Include: the full scorecard table, alerts, variance analysis, actions.

## Output contract

The deliverable always contains:
1. **7-Number scorecard** — current values, targets, status (green / amber / red).
2. **5-Number executive strip** — one-line CEO briefing.
3. **Variance analysis** — period-on-period deltas with root cause for outliers.
4. **Alert block** — all amber/red metrics with proposed actions, owners, deadlines.
5. **Next action** — single most important financial action this week, owner, deadline.

## Red flags

- Skipping the KB-first step — prior baselines exist; use them.
- Producing a dashboard without the runway figure — it is never optional.
- Reporting MRR without separating recurring from non-recurring revenue.
- Amber or red metrics without proposed actions — the dashboard is not a report card,
  it is a decision tool.
- Not ingesting the snapshot to the KB — the scorecard history is the financial memory.
- Setting the schedule without confirming it fits the Friday 17h review ritual.
