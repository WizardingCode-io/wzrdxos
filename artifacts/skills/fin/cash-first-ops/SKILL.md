---
name: fin:cash-first-ops
description: "Daily/weekly cash ritual — cash-in/cash-out report, runway calculation (≥6 months target), default-debt warning thresholds, weekly snapshot feeding fin:metrics-dashboard; output = cash ritual setup + first snapshot."
type: capability
department: fin
when-to-use: Setting up a cash tracking ritual, calculating runway, checking if overdue receivables are at risk, feeding the weekly financial dashboard, or when the user says "cash flow", "runway", "quanto tempo temos de dinheiro", "caixa", "recebimentos", "pagamentos", "dívidas em atraso" or similar.
---

# Cash First Ops

Flexible capability skill. Sets up (or resets) the company's cash ritual — the
daily/weekly habit that keeps the CFO and CEO aware of real cash position at all
times. Produces the first live snapshot and configures the warning thresholds.

Anchored on Dan Martell (cash-first operating discipline, Buy Back Your Time:
the CEO always knows their runway), David FilterBuy (cash-in/cash-out as the
ground truth of financial health), and the Diagnostico-2026-05 KPI set.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — bank accounts, primary revenue streams,
  fixed vs variable cost structure, payment terms.
- Diagnostico-2026-05 — existing runway data, threshold €83K/month, target
  €1M @ 2026-12-31, any prior cash snapshots.
- Prior cash reports or runway calculations already in the KB.
- Dan Martell's 5-Number CEO Scorecard for the cash-position components.
- Default-debt warning framework (David FilterBuy AR overdue thresholds).

Note what is already tracked. Only ask for genuine gaps.

### 2. Current cash position — the base snapshot

Collect or confirm the following data points (from the user, bank statements, or
existing KB data):

| Item | Value | As of date |
|------|-------|-----------|
| Cash in operating account(s) | € | |
| Confirmed receivables (invoiced, due ≤ 30d) | € | |
| Receivables overdue 31-60 days | € | |
| Receivables overdue > 60 days | € | |
| Committed payables due ≤ 30 days (incl. payroll, rent, IVA, subscriptions) | € | |
| Committed payables due 31-60 days | € | |
| Net cash position (cash + ≤30d recv − ≤30d payables) | € | |

Flag immediately if the net cash position is negative or within 30 days of zero.

### 3. Monthly burn rate and runway

Calculate:

**Monthly burn rate** = total operating costs per month (payroll + rent + tools +
subscriptions + direct cost of delivery + overhead), excluding one-off or
non-recurring items.

**Gross burn** = total cash out per month before revenue.
**Net burn** = gross burn − cash in from revenue (confirmed, not projected).

**Runway (months)** = cash in operating account ÷ net monthly burn.

| Metric | Value |
|--------|-------|
| Gross burn / month | € |
| Revenue collected / month (rolling 3m avg) | € |
| Net burn / month | € |
| Cash on hand | € |
| Runway | ___ months |

**Target:** runway ≥ 6 months. If runway < 6 months, escalate to the CEO
immediately and activate the Risco flag in `fin:cfo-4-pilares`.

**Runway tiers:**
- Green: ≥ 6 months — stable; maintain the ritual.
- Amber: 3-6 months — constrained; weekly cash review mandatory, no new
  discretionary spend.
- Red: < 3 months — critical; daily cash review, CEO-gate on all outgoings > €500,
  activate collections pressure on all overdue AR.

### 4. Default-debt warning thresholds

Map all receivables into aging buckets and apply the warning ladder:

| Aging bucket | Amount | Action threshold | Status | Action |
|---|---|---|---|---|
| Current (≤ 30d) | € | — | Normal | Routine follow-up at due date |
| Overdue 31-60d | € | > €2,000 | Amber | Personal phone call within 24h |
| Overdue 61-90d | € | > €1,000 | Red | Formal notice letter; escalate to CEO |
| Overdue > 90d | € | Any amount | Critical | Legal/collection action; provision for loss |

Adjust the threshold values to the company's average invoice size (if avg invoice
< €1,000, halve the thresholds; if avg invoice > €10,000, scale them up).

State the total AR at risk (≥ 31d) as a percentage of monthly revenue. If > 20%
of monthly revenue is overdue > 30 days, treat as a Risco signal.

### 5. Weekly cash ritual — setup

Define and document the ritual so it can be executed in ≤ 20 minutes each Monday:

**Monday Morning Cash Ritual (≤ 20 min):**

1. **Log cash in** (5 min): update operating account balance from bank portal.
   Record confirmed payments received since last Friday.
2. **Log cash out** (5 min): record all outgoings since last Friday (auto-debits,
   transfers, payroll dates this week).
3. **Update AR aging** (5 min): advance any invoices that crossed a 30/60/90-day
   threshold; trigger the action for each bucket per step 4.
4. **Recalculate runway** (2 min): update the net burn and runway figures.
5. **Flag escalations** (3 min): if runway crossed a tier boundary since last week,
   notify the CEO immediately.

Tooling options (pick the one that exists):
- Google Sheets template with the tables above (preferred for < 5-person teams).
- Notion / Obsidian embedded table.
- Simple spreadsheet model (build the model in `xlsx` skill if not yet done).

Name the owner of the ritual (default: CFO or founder) and the day/time.

### 6. Feed fin:metrics-dashboard

After each Monday ritual, the cash snapshot feeds the weekly financial dashboard
(`fin:metrics-dashboard`):

- Cash on hand (€)
- Net burn (€/month)
- Runway (months)
- AR overdue > 30d (€ and %)
- Runway tier (Green / Amber / Red)

If `fin:metrics-dashboard` is not yet set up, flag this as a dependent action.

### 7. Ingest snapshot to KB

After producing the first snapshot and ritual setup, ingest via `kb_ingest`:
- Title: `Cash Ritual Setup + Snapshot — <Company> — <YYYY-MM-DD>`.
- Source path: `memos/fin/cash-first-ops-<company-slug>-<YYYY-MM-DD>`.
- Tags: `cash`, `runway`, `financeiro`, `cfo`, `ritual`, `<company-slug>`.
- Include: base snapshot table, runway calculation, AR aging table, tier status,
  ritual definition (owner, day/time, steps), and first escalation flags if any.

Each subsequent weekly snapshot should be ingested as:
- Title: `Cash Snapshot — <Company> — <YYYY-WW>`.
- Source path: `memos/fin/cash-snapshot-<company-slug>-<YYYY-WW>`.

## Output contract

The deliverable always contains:
1. **Base cash snapshot** — cash, receivables by aging, payables by horizon, net
   position.
2. **Burn rate and runway** — gross burn, net burn, runway in months, tier status.
3. **AR warning table** — aging buckets with action thresholds and status.
4. **Runway tier escalation** — explicit statement if amber or red, with immediate
   action.
5. **Weekly cash ritual definition** — owner, day/time, 5-step checklist,
   tooling choice.
6. **Dashboard feed** — the 5 cash metrics to push to fin:metrics-dashboard.
7. **Next action** — single most urgent cash action, owner, deadline within 7 days.

## Red flags

- Calculating runway from projected revenue — use only confirmed cash in hand plus
  receivables due ≤ 30 days; projections are not cash.
- Treating AR overdue > 60 days as "probably fine" — provision and escalate;
  optimism does not collect invoices.
- Running the ritual monthly instead of weekly — a monthly cash review catches
  problems too late; weekly is the minimum.
- Not separating gross burn from net burn — gross burn is the real cost structure;
  net burn hides it.
- Skipping the KB ingest — the snapshot history is the trend data that matters;
  a single snapshot without a series is anecdotal.
- Producing a runway figure without stating the date it was calculated — cash
  positions decay; always timestamp.
