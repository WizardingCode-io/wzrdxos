---
name: rh:comp-ladder
description: Compensation and careers framework — Talent Levels Ladder tiers, talent-debt check (underpaying = invisible candidates), salary banding with PT-market benchmark via deep-research per role, decision-budget per level, results participation; output = comp framework memo.
type: capability
department: rh
when-to-use: Building or reviewing compensation bands, defining career levels, evaluating whether salaries are attracting or repelling the right candidates, or when the user says "salários", "bandas salariais", "progressão na carreira", "talent levels", "compensation", "quanto pagar", "remuneração" or similar.
---

# Compensation Ladder

Flexible capability skill. Builds or reviews the company's compensation and career
framework. Starts with a talent-debt audit (are current salaries invisibly repelling
the right people?), defines career tiers from the Talent Levels Ladder, bands each
tier against the PT market, and links compensation to decision authority and results
participation.

Anchored on the Talent Levels Ladder (KB framework — the $50K→$1M tier ladder),
the talent-debt concept (underpaying = invisible to the candidates you actually want),
the $50 Fix-It Rule (decision budget per level), and results participation as a
retention mechanism.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — current team, roles, salaries (if disclosed),
  revenue stage, headcount plan.
- Talent Levels Ladder (KB framework) — the tier definitions, typical responsibilities
  per tier, and the talent-debt diagnostic signals.
- Diagnostico-2026-05 — Cultura 25/100 baseline, 5 failed hires postmortem (were
  any failures linked to underpaying or misaligned expectations?), D61-D90 hire target.
- Prior comp-ladder memos or salary benchmarking data already in the KB.
- PT salary market data already in the KB — if present, use it; if not, flag that
  `deep-research` will be triggered in step 3.

Surface any prior hiring failures with a salary or career-level dimension — these
are the first evidence of talent debt.

### 2. Talent debt audit

**Talent debt** = the hidden cost of paying below market: the best candidates
self-select out before applying, leaving a pool of candidates who accept below-market
pay for reasons that are often disqualifying (desperate, underperforming, risk-averse
in ways that do not suit the role).

Run the talent-debt diagnostic:

| Signal | Present? | Evidence |
|--------|----------|---------|
| Hiring process takes > 60 days to fill a role | | |
| Fewer than 10 qualified applicants per role posted | | |
| Best candidates decline at the offer stage (citing compensation) | | |
| Current team members are paid > 20% below market (if known) | | |
| Last hire accepted the first offer without negotiating | | |
| No candidate has ever counter-offered | | |

**Interpretation:**
- 0-1 signals: talent debt is low or absent.
- 2-3 signals: moderate talent debt — compensation review needed before next hire.
- 4+ signals: severe talent debt — addressing compensation is a prerequisite for
  any effective recruiting; the current salary structure is the hiring bottleneck.

### 3. PT market benchmark — deep-research per role

For each role in scope, trigger `deep-research` for the current PT market salary
benchmark (role + location + experience level + company size).

**Benchmark dimensions:**
- Role title (e.g. Desenvolvedor Full-Stack Sénior, Account Manager, Operations
  Manager).
- Market: Portugal (primary); Lisbon vs remote market where applicable.
- Experience level: junior (0-2 years) / mid (3-5 years) / senior (5+ years) /
  lead (people + domain).
- Company size: comparable to the current company stage (≤ 10 people / 10-50 /
  50+).
- Sources: LinkedIn Salary Insights, Glassdoor PT, Numbeo PT, Ambição jobs
  survey, or equivalent current data.

Benchmark table output (one row per role):

| Role | Tier | P25 (€/yr) | Median P50 (€/yr) | P75 (€/yr) | Current salary (€/yr) | Gap to P50 |
|------|------|------------|-------------------|------------|----------------------|------------|
| | | | | | | |

**Benchmark rule:** the company's target compensation band for each role should sit
between P50 and P75 to attract top-third candidates. Paying at or below P25
produces a talent-debt pool.

### 4. Talent Levels Ladder — tier definitions

Adapt the Talent Levels Ladder to the company's current roles and stage. Define 4-5
tiers (not all tiers are needed at current stage — define only the tiers you will
hire into within the next 24 months):

**Tier 1 — Executor (entry/junior):**
- Does what is asked, with guidance. Learning the craft.
- Decision authority: €50 Fix-It Rule only.
- Compensation band: P40-P55 of market (trade compensation for learning environment
  and growth opportunity — explicit in the offer).

**Tier 2 — Contributor (mid-level):**
- Does what is needed without being asked for tasks in their domain. Proactively
  closes gaps.
- Decision authority: €200 Fix-It Rule; owns a process or a client relationship.
- Compensation band: P50-P65 of market.

**Tier 3 — Senior:**
- Defines how the work should be done in their domain. Mentors Tier 1-2.
  Handles ambiguity without escalation.
- Decision authority: €500 Fix-It Rule; can make client commitments within policy.
- Compensation band: P60-P75 of market.

**Tier 4 — Lead / Head:**
- Builds the system and the team that does the work. Hires, coaches, accountable
  for domain results.
- Decision authority: €2,000 Fix-It Rule; department-level budget ownership.
- Compensation band: P65-P80 of market + results participation.

**Tier 5 — Director / C-level (post-scale):**
- Not needed at current stage for most PT SMEs; document as the ceiling so Tier 4
  has a visible growth path. Define when activated.
- Decision authority: company-level; CEO gate for strategic spend.
- Compensation band: above P80; equity/results participation is primary.

For each current team member (anonymised if preferred), map to a tier and flag
any misalignment (e.g. Tier 3 responsibilities at Tier 1 pay = talent debt in place).

### 5. Decision budget per level — $50 Fix-It ladder

The $50 Fix-It Rule (from the Diagnostico buyback framework): **every team member
should be able to spend up to their threshold to fix a problem without asking.**

Produce the decision-budget table for the company:

| Tier | Spend threshold (no approval) | Notify after | Approval required |
|------|------------------------------|---|---|
| Tier 1 — Executor | ≤ €50 | >€50 | Always |
| Tier 2 — Contributor | ≤ €200 | >€200 | >€500 |
| Tier 3 — Senior | ≤ €500 | >€500 | >€1,000 |
| Tier 4 — Lead | ≤ €2,000 | >€2,000 | >€5,000 |

Calibrate these to the company's actual cost structure and invoice averages.

This table must live in the onboarding documentation and be referenced in every
offer letter — it signals trust and reduces founder bottleneck.

### 6. Results participation

For Tier 3+ (or for any role where the person influences revenue or retention
directly): define results participation as a retention mechanism.

Results participation options (choose the appropriate structure for the company):

**Option A — Revenue sharing:**
- A fixed percentage (e.g. 5-10%) of net revenue above a baseline threshold is
  distributed quarterly to eligible tiers.
- Threshold: €83K/month (Diagnostico) or the agreed MRR target.
- Simpler to explain; most appropriate for early-stage teams.

**Option B — Bonus pool linked to OKRs:**
- A bonus pool (e.g. 10-15% of annual salary) distributed based on OKR achievement
  at quarter end.
- More complex; appropriate when OKRs are documented and measured.

**Option C — Phantom equity / profit participation:**
- A share of net profit (after owner draw) distributed annually.
- Appropriate when the company has a stable profit margin and wants long-term
  retention without diluting cap table.

For each Tier 3+ role, state which option applies and the financial terms.

Stress-test: at what revenue level does the results participation become a meaningful
amount for the recipient (e.g. > 10% of annual base salary)? This is the threshold
below which results participation is a promise, not a retention mechanism.

### 7. Produce the comp framework memo

Compile the compensation framework memo:

---
**[Company] — Compensation Framework — [YYYY-MM]**

**Talent Debt Audit:** [score and evidence]
**Key talent debt finding:** [named root cause if any signals present]

**Market Benchmark per Role:**
[Table from step 3]

**Talent Levels Ladder:**
[Table from step 4, with tier definitions and current team mapping]

**Decision Budget per Level:**
[Table from step 5]

**Results Participation:**
[Option chosen per tier, financial terms, stress-test threshold]

**Comp Band Summary:**
[Tier / Band (€/yr) / Decision budget / Results participation / Notes]

**Immediate action:** [any salary adjustment needed to close a talent-debt gap,
named person (or role), amount, timeline]
---

### 8. Ingest to KB

After producing the memo, ingest via `kb_ingest`:
- Title: `Compensation Ladder — <Company> — <YYYY-MM>`.
- Source path: `memos/rh/comp-ladder-<company-slug>-<YYYY-MM>`.
- Tags: `remuneração`, `rh`, `talent-levels`, `comp-ladder`, `mercado-pt`,
  `<company-slug>`.
- Include: the full memo — talent-debt audit, benchmark table, tier definitions,
  decision-budget ladder, results-participation structure.

## Output contract

The deliverable always contains:
1. **Talent debt audit** — signals table with score and interpretation.
2. **PT market benchmark** — P25/P50/P75 per role, current salary, gap.
3. **Talent Levels Ladder** — 4-5 tier definitions with current team mapping.
4. **Decision budget ladder** — spend thresholds per tier, calibrated to company.
5. **Results participation structure** — option chosen per eligible tier with
   financial terms and stress-test.
6. **Comp framework memo** — the compiled artefact.
7. **Next action** — single most urgent compensation action, owner, deadline.

## Red flags

- Building salary bands without PT market benchmark data — "we pay what we can
  afford" is not a comp strategy, it is a talent-debt factory.
- Defining career tiers without linking them to decision authority — a tier without
  autonomy is a title, not a career level.
- Offering results participation below the meaningful-amount threshold — a promise
  of 1% of €40K revenue is €400/year; this does not retain anyone.
- Not mapping current team members to tiers — the tier definitions only matter
  if they resolve current misalignments.
- Skipping the talent-debt audit — if the audit signals are present and are ignored,
  the comp framework will fail before the next hire.
- Producing Tier 5 definitions before Tier 4 exists — define what is needed
  in the next 24 months, not a 10-year org chart.
