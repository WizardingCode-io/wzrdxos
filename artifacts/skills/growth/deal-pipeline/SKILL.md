---
name: growth:deal-pipeline
description: Set up or review the CRM and sales pipeline — HubSpot Free stage configuration, the 5 commercial KPIs with baselines and targets, weighted forecast (best/likely/worst), coverage-gap analysis, and weekly pipeline-review ritual feeding the COO Friday review.
type: capability
department: growth
when-to-use: Setting up or reviewing the CRM, running the weekly pipeline review, building a sales forecast, analysing pipeline coverage gaps, or when the user says "pipeline", "CRM", "HubSpot", "forecast", "revisão de pipeline", "cobertura de pipeline" or similar.
---

# Deal Pipeline

Flexible capability skill. Takes the current pipeline state (CRM data, deal notes,
or a verbal brief) and produces a structured pipeline review, forecast and action
plan. Also guides the initial CRM setup when HubSpot has not yet been implemented.

Closes the known gap from the Diagnostico-2026-05: "CRM recommended in the
Diagnostico, never implemented." This skill exists to make that implementation
happen and keep it running as a weekly ritual.

Anchored on: HubSpot Free (the Diagnostico quick-win CRM recommendation), the 5
commercial KPIs from the Diagnostico, the weighted-forecast model, and the COO
Friday review ritual. KB sources: WizardingCode/Diagnostico-2026-05, Vendas 25/100
section; Sales Frameworks topic (Alex Hormozi Revenue Growth Equation; Dan Martell
CEO Scorecard pipeline feed).

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — revenue target, monthly threshold, offer set.
- Diagnostico-2026-05: Vendas 25/100, the 5 commercial KPIs, 90-day roadmap status.
- Any prior pipeline snapshots, CRM setup notes or forecast documents in the KB.
- Revenue Growth Equation (Hormozi) — pipeline math baseline.
- CEO Scorecard pipeline feed conventions (Dan Martell).

Note what already exists. Only design from scratch for genuine gaps.

### 2. CRM setup guidance (first-run or reset)

If HubSpot has not been implemented or needs a reset, produce the following setup
guide:

#### Stage configuration (mirrors the sales funnel)

| Stage | Name | Exit criterion | Required fields |
|-------|------|----------------|-----------------|
| 1 | Prospeção | Contact made, pain confirmed | Company, contact, source, pain summary |
| 2 | Qualificação | Pain, timeline, authority, budget confirmed | BANT notes, deal value estimate |
| 3 | Apresentação | Proposal or demo delivered | Proposal link, presented date |
| 4 | Negociação | Commercial terms being discussed | Proposed value, discount if any |
| 5 | Fecho | Contract/PO received or verbal close | Close date, final value, payment terms |
| — | Perdido | Deal explicitly lost or stalled > 60d | Loss reason (mandatory) |

#### Required deal fields

- Deal name (format: `[Company] — [Offer] — [YYYY-MM]`)
- Deal value (€, weighted)
- Close date (expected)
- Probability % (stage-default + manual override)
- Lead source (inbound / outbound / referral / partnership)
- Next step + next-contact date

#### Automation basics (HubSpot Free)

- Stage-change trigger: automatic task creation for the next action (e.g. "Send
  proposal" when moving to Apresentação).
- Stale-deal alert: flag any deal with no activity in > 7 days.
- Lead-response SLA: any new inbound lead older than 5 minutes without a contact
  attempt triggers an alert (speed-to-lead three-fix, Neil Patel).

### 3. The 5 commercial KPIs — baselines and targets

Track these five KPIs every week, feed them to the COO Friday review:

| KPI | Definition | Baseline | Target | Alert threshold |
|-----|-----------|----------|--------|-----------------|
| **Pipeline €** | Sum of (deal value × probability) across all open deals | Establish within first 30d of CRM launch | ≥ 3× monthly revenue target | < 2× = amber; < 1× = red |
| **Conversão lead→cliente** | Closed-won deals / total leads entering funnel (rolling 90d) | Establish within first 30d | ≥ 15% | < 12% = amber; < 8% = red |
| **Ticket médio** | Average deal value of closed-won deals (rolling 90d) | Establish within first 30d | Grow 10% QoQ | > 20% drop MoM = amber |
| **Ciclo de vendas** | Average days from Prospeção to Fecho (rolling 90d) | Establish within first 30d; expected ~30d | Reduce by 20% within 6 months | > 50% increase MoM = amber |
| **Win rate** | Closed-won / (closed-won + closed-lost) (rolling 90d) | Already > 40% (Diagnostico estimate) | ≥ 40% maintained; grow to 50% within 12 months | < 35% = amber; < 25% = red |

Note on baselines: the Diagnostico identified that the win rate is already above 40%
but no CRM data exists to confirm it. Establishing the baseline is priority 1. Do
not report against targets until 30d of consistent CRM data is available.

### 4. Weighted forecast (best / likely / worst)

Produce a three-scenario forecast every week:

**Pipeline segmentation:**

| Segment | Criterion | Weight multiplier |
|---------|-----------|------------------|
| Hot | Stage 4-5, close date ≤ 30d, last contact ≤ 7d | 0.85 |
| Warm | Stage 2-3, close date ≤ 60d, last contact ≤ 14d | 0.40 |
| Cold | Stage 1-2, close date > 60d or last contact > 14d | 0.15 |
| Stale | No activity > 30d or close date > 90d | 0.05 |

**Scenario outputs:**

| Scenario | Formula | Use |
|----------|---------|-----|
| **Best** | Sum of hot (×0.85) + warm (×0.40) | Capacity planning upper bound |
| **Likely** | Sum of hot (×0.70) + warm (×0.25) | Revenue planning baseline |
| **Worst** | Sum of hot (×0.50) only | Cash-flow floor; runway input to CFO |

Feed the Likely figure to the CFO weekly dashboard (pipeline € KPI).
Flag any scenario where Likely < 2× monthly target: immediate pipeline-build action
required.

### 5. Coverage-gap analysis

After the forecast, compute the coverage gap:

```
Monthly revenue target: €X
Pipeline required (3× target): €3X
Current weighted pipeline: €W
Gap: €(3X − W)  [if positive, gap exists]
```

For each gap, produce a sourcing plan:
1. **Existing leads** — which stale or cold deals can be reactivated this week?
2. **Outbound** — how many new prospects need to enter the funnel to close the gap
   (use the conversão rate to back-calculate: gap / ticket médio / conversão rate =
   number of new leads needed)?
3. **Referral / partnerships** — one specific referral ask or Dream 100 touch this
   week.

### 6. Weekly pipeline-review ritual

Run every week (Friday, before the 17h COO review):

**Agenda (30 minutes):**

1. **Pipeline health** (10 min): review all hot and warm deals — next step defined?
   Last contact recent? Move stale deals to Cold or Perdido.
2. **5-KPI snapshot** (5 min): update all five KPIs, compare to prior week, flag
   any amber/red.
3. **Forecast update** (5 min): recalculate best/likely/worst, note change vs.
   prior week.
4. **Coverage gap** (5 min): is the pipeline at 3×? If not, what is the gap and
   the immediate sourcing action?
5. **Next week's commitments** (5 min): one specific deal to advance, one prospect
   to add, one follow-up overdue to clear.

Output: a one-page pipeline review memo (deal list + 5 KPIs + forecast scenarios +
gap analysis + commitments). Send to the COO before 17h Friday.

### 7. Ingest weekly snapshot to KB

After each pipeline review, ingest the snapshot via `kb_ingest`:
- Title: `Pipeline Review — <Company> — <YYYY-WNN>`.
- Tags: `pipeline`, `crm`, `forecast`, `kpis`, `<company-slug>`.
- Include: the full review memo (5 KPIs, forecast, gap, commitments).

The pipeline history is the sales memory. It compounds into baselines, trend
analysis and case study data over time.

## Output contract

The deliverable always contains:
1. **CRM status** — is HubSpot set up? If not, the setup guide (§2). If yes, a
   stage-by-stage deal count and health assessment.
2. **5-KPI table** — current values, baselines, targets, status (green / amber /
   red).
3. **Weighted forecast** — best / likely / worst scenarios with the underlying
   pipeline segmentation.
4. **Coverage-gap analysis** — gap in €, number of new leads required, sourcing plan.
5. **Pipeline review memo** — ready to send to the COO (when in review mode).
6. **Next action** — single most important pipeline action this week, owner, deadline.

## Red flags

- Running a forecast without stage-probability weights — unweighted pipeline is
  always optimistic; it misleads the CFO and CEO.
- Advancing deals without an exit criterion per stage — stages without criteria are
  not stages, they are labels.
- Skipping the KB-first step — prior snapshots establish the baselines; use them.
- Reporting KPIs before 30d of CRM data exists — flag as "baseline not yet
  established" rather than reporting zero.
- Missing the loss-reason field on Perdido deals — loss reasons are the single
  richest sales-learning data; never skip them.
- Not ingesting the weekly snapshot — the pipeline history is the sales memory;
  without it, every review starts from zero.
- Pipeline < 2× monthly target without an immediate sourcing action — this is a
  revenue emergency, not a monitoring item.
