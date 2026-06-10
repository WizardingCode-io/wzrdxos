---
name: fin:unit-economics-audit
description: "Audit profitability per revenue stream — fully-loaded P&L, gross-profit-to-CAC sanity check, LTV:CAC ≥ 3:1 and payback; produces a keep/fix/kill verdict per stream. Frameworks: David FilterBuy, Alex Hormozi, Sabri Suby (CAC/LTV/Payback Triangle)."
type: capability
department: fin
when-to-use: Auditing profitability per revenue stream, conducting a pricing review, evaluating whether the business is making money on a specific offer or client type, or when the user says "unit economics", "rentabilidade por serviço", "estamos a ganhar dinheiro com X", "margem real", "CAC", "LTV" or similar.
---

# Unit Economics Audit

Flexible capability skill. Takes one or more revenue streams (offers, client types,
products) and produces a fully-loaded per-stream profitability audit with a
keep/fix/kill verdict and recommended action per stream.

Anchored on David FilterBuy (unit economics rigour, gross-profit-to-CAC), Alex
Hormozi (LTV:CAC ≥ 3:1, offer economics, Grand Slam Offer profitability), and
Sabri Suby (premium pricing, payback engineering, CAC/LTV/Payback Triangle).

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — revenue streams, pricing, client types.
- Prior unit-economics audits or P&L analyses already in the KB.
- Diagnostico-2026-05 — existing revenue breakdown, margin data, KPI baselines.
- Frameworks: CAC/LTV/Payback Triangle (Sabri Suby), Grand Slam Offer economics
  (Alex Hormozi), FilterBuy gross-profit-to-CAC diagnostic (David FilterBuy).
- Prior financial risk register entries related to margin compression or
  concentration risk.

Note what is already known. Only collect new data for genuine gaps.

### 2. Revenue stream inventory

List all active revenue streams with basic attributes:

| Stream | Type | Avg ticket | Freq/year | Clients | Monthly € |
|--------|------|-----------|-----------|---------|-----------|
| | Recurring / project / one-off | | | | |

If the user provides a single stream, scope the audit to that stream and note
whether a full-portfolio audit would add material insight.

### 3. Per-stream fully-loaded P&L

For each stream, build a fully-loaded unit P&L — no vanity margins:

#### Revenue
- Average ticket (contract value or MRR per client).
- Avg number of transactions / renewals per client per year.
- Gross revenue per client per year (LTV proxy at current retention).

#### Direct costs (COGS)
- Labour hours × loaded hourly rate (salary + benefits + overheads ÷ billable hours).
- Subcontractors / freelancers directly attributed to delivery.
- Tools and software directly attributed to this stream.
- Delivery overhead (project management, QA, internal reviews).

#### Gross profit per client
- Gross revenue − COGS.
- Gross margin % = gross profit ÷ gross revenue.

#### CAC (Customer Acquisition Cost)
- Marketing spend attributed to this stream (rolling 12m or cohort).
- Sales time (hours × loaded rate) per won client.
- Total CAC = (marketing + sales cost) ÷ new clients in period.

#### LTV (Lifetime Value)
- Gross profit per client per year × average retention in years.
- Or: avg monthly gross profit ÷ monthly churn rate (for recurring streams).

#### Payback period
- CAC ÷ gross profit per month.
- Target: ≤ 12 months for recurring streams; ≤ 3 months for project streams.

### 4. Triangle diagnostic (CAC / LTV / Payback)

Apply the Sabri Suby CAC/LTV/Payback Triangle for each stream:

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| LTV:CAC ratio | | ≥ 3:1 | |
| CAC payback | | ≤ 12m (recurring) / ≤ 3m (project) | |
| Gross margin | | ≥ 50% (services); ≥ 70% (software/info) | |
| Concentration | stream % of total revenue | < 50% | |

**Status per cell:**
- Green: threshold met.
- Amber: within 20% of threshold — fixable with pricing or cost adjustments.
- Red: threshold breached by > 20% — structural problem.

### 5. Gross-profit-to-CAC sanity check (FilterBuy diagnostic)

David FilterBuy's acid test:

> **Gross profit on first transaction ≥ CAC?**

If yes: the business is recovering CAC on the first sale — healthy.
If no: the business is funding growth from working capital — dangerous at scale.

For each stream, state:
- Gross profit on first transaction: €___
- CAC: €___
- Verdict: recovering / not recovering.

If not recovering, quantify the shortfall and map the fix options:
1. Raise price (preferred).
2. Reduce delivery cost.
3. Reduce CAC (marketing efficiency).
4. Raise minimum contract size / AOV.

### 6. Vanity vs real margin verdict

Strip out the margin illusions:
- **Vanity margin:** revenue − direct cost, ignoring overhead allocation.
- **Real margin:** fully-loaded gross profit per stream after overhead allocation.

State both. If they differ by > 10 pp, flag the vanity-margin illusion explicitly.

### 7. Keep / Fix / Kill verdict

Per stream, deliver a verdict:

| Stream | LTV:CAC | Payback | GP/CAC | Real margin | Verdict | Rationale |
|--------|---------|---------|--------|-------------|---------|-----------|
| | | | | | **Keep / Fix / Kill** | |

**Keep:** LTV:CAC ≥ 3:1, payback on target, real margin healthy. Scale this.

**Fix:** one or two metrics below threshold but the stream is strategically sound.
Provide a specific fix plan: which lever (price / cost / CAC), how much, by when,
and who owns it. Set a 90-day review gate.

**Kill:** multiple metrics below threshold AND no clear fix path without fundamental
redesign. Provide a wind-down plan: stop selling, honour existing commitments,
redirect capacity and CAC budget to a Keep stream.

### 8. Ingest memo to KB

After producing the audit, ingest it into the KB via `kb_ingest`:
- Title: `Unit Economics Audit — <Company> — <Stream(s)> — <YYYY-MM>`.
- Tags: `unit-economics`, `financeiro`, `margem`, `cac`, `ltv`, `<company-slug>`.
- Include: per-stream P&L tables, triangle diagnostic, verdicts, fix plans.

## Output contract

The deliverable always contains:
1. **Revenue stream inventory** — all streams with basic P&L snapshot.
2. **Per-stream fully-loaded P&L** — revenue, COGS, gross profit, CAC, LTV, payback.
3. **Triangle diagnostic** — LTV:CAC, payback, gross margin, concentration per stream.
4. **FilterBuy sanity check** — gross-profit-to-CAC recovery status per stream.
5. **Vanity vs real margin table** — both margins, gap flagged where relevant.
6. **Keep / Fix / Kill verdict table** — one verdict per stream with rationale.
7. **Fix plans** — for Fix streams: lever, target, owner, 90-day review gate.
8. **Next action** — single highest-impact financial action, owner, deadline.

## Red flags

- Using vanity margins (excluding overhead) for the verdict — always fully load costs.
- LTV:CAC < 3:1 without a fix plan — this is not a metric, it is a structural problem.
- Skipping the CAC attribution — "we don't track CAC" is the answer that matters most.
- Producing a "Fix" verdict without specifying which lever and by how much.
- Keeping a stream because it is "strategic" without quantifying the strategic value
  that justifies the margin subsidy.
- Not ingesting the audit — the KB must hold the history so future audits compare.
- Auditing only the best-performing stream — always surface the weakest one too.
