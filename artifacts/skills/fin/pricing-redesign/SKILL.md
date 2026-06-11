---
name: fin:pricing-redesign
description: "Pricing review from the finance side — current pricing vs unit economics (links fin:unit-economics-audit), premium-pricing opportunity via Status Engineering and annual price-increase as demand engine (Sabri Suby), included-compute/fair-use thinking for recurring offers; verdict proposed to CEO+CRO gate; output = pricing memo. Economics only — marketing owns offer messaging."
type: capability
department: fin
when-to-use: Reviewing whether current pricing is financially sustainable, modelling a price increase, evaluating a new pricing tier, or when the user says "preço", "pricing", "devíamos cobrar mais", "margem de preço", "preço vs custo", "aumento de preço", "ancoragem de preços" or similar.
---

# Pricing Redesign (Finance Side)

Flexible capability skill. Reviews the economics of current pricing and produces
a CFO-authored pricing memo with a verdict and options table — to be proposed to
the CEO + CRO gate for final decision.

**Scope boundary:** this skill covers the economics — unit margins, cost coverage,
payback at each price point, premium-pricing opportunity from the financial angle,
and included-compute/fair-use modelling for recurring offers. Offer messaging,
copy, and positioning belong to `marketing:offer-architecture` (phase 2). Do not
produce ad copy or positioning language here.

Anchored on Sabri Suby (premium pricing, Status Engineering, annual price increase
as demand engine), the CAC/LTV/Payback Triangle, and the CFO's unit economics
mandate.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — current price list, offer structure, client
  types, revenue streams.
- Prior unit-economics audits (`fin:unit-economics-audit`) already in the KB —
  per-stream fully-loaded P&L, gross margin, CAC, LTV, payback.
- Diagnostico-2026-05 — pricing position, margin data, €83K/month threshold,
  target €1M @ 2026-12-31.
- Premium Pricing and Status Engineering frameworks (Sabri Suby) from the KB.
- CAC/LTV/Payback Triangle — current triangle state per stream.
- Prior pricing memos or pricing risk-register entries.

If a `fin:unit-economics-audit` result is not available for the stream(s) under
review, run that skill first — pricing without unit economics is opinion.

### 2. Baseline — current pricing vs unit economics

For each offer under review, build the baseline economics table:

| Offer | Current price | COGS (fully loaded) | Gross margin % | CAC | LTV | Payback | GP/CAC |
|-------|--------------|--------------------|----|-----|-----|---------|--------|
| | € | € | % | € | € | months | ratio |

Mark each row:
- Green: gross margin ≥ target (50% services / 70% software), payback on track,
  GP/CAC ≥ 1.
- Amber: one metric below threshold — fixable with price adjustment.
- Red: multiple metrics below threshold — structural problem; pricing is not the
  only fix.

### 3. Price floor and target margin calculation

For each offer, compute:

**Price floor** = COGS ÷ (1 − target gross margin %).
- Example: COGS = €800/month, target gross margin = 60% → price floor = €2,000/month.

**Current gap** = price floor − current price.
- If negative (current price < floor): the offer is loss-making at current margin
  targets; quantify the gap and state the minimum price increase needed.
- If positive: there is margin above floor; evaluate how much premium-pricing
  headroom exists.

**Premium headroom** = market-rate price for equivalent value − current price.
Use deep-research or market data from the KB for the benchmark; do not estimate
without a reference.

### 4. Premium-pricing opportunity (Status Engineering lens)

Apply Sabri Suby's Status Engineering diagnostic:

> "Does the price of this offer signal status to the buyer, or does it signal
> commodity? A price that is too low destroys perceived value faster than any
> competitor."

Evaluate each offer against the four premium-pricing signals:
1. **Scarcity/exclusivity**: is access limited, or does everyone who asks get it?
2. **Proof density**: are there case studies, results, testimonials that justify
   a premium? (Note: if not, route to `growth:deal-pipeline` for case study
   production — that is a sales/ops dependency, not a pricing fix.)
3. **Outcome specificity**: is the offer priced on the value of the outcome or the
   cost of the input? (Input pricing = commodity; outcome pricing = premium.)
4. **Anchoring**: is there a higher-priced tier that makes the core offer feel
   like the rational middle choice?

Score each signal (0 = no signal, 1 = partial, 2 = strong).
Total premium signal score: 0-8. Below 4 = the offer is not structurally positioned
for premium pricing without changes; above 6 = premium price increase is defensible.

### 5. Annual price increase as demand engine

Sabri Suby principle: **a planned annual price increase creates urgency before the
increase date and is a legitimate demand lever** — it is not inflation, it is brand
management.

Evaluate viability:
- Is there a consistent client renewal/retention rate ≥ 70%? (If not, fix
  retention before increasing price — price increase on a leaky bucket accelerates
  churn.)
- Is the offer positioned on outcomes, not hours? (If not, an hourly-rate increase
  is easy to resist; outcome repricing is not.)
- Is the company at or near capacity for the offer? (Scarcity is the strongest
  pricing signal.)

If viability is confirmed, propose:
- Increase amount and new price.
- Effective date (suggest 60-90 days forward — enough lead time for current clients
  to act, short enough to create urgency).
- Communication approach (note: messaging is CMO/CRO scope — here only state
  "grandfathering vs no-grandfathering" as an economics decision).
- Revenue impact: (new price × current client count) − current ARR = incremental
  revenue at 100% retention. State the retention breakeven: at what churn rate does
  the increase become revenue-neutral?

### 6. Included-compute / fair-use modelling (for recurring offers)

For any SaaS or recurring service offer that includes a usage component (AI tokens,
storage, API calls, compute hours, support hours):

Map the cost exposure:
| Usage metric | Included/month | Actual avg usage | Overage cost | Margin impact |
|---|---|---|---|---|
| | | | €/unit over | |

Evaluate three structures:
1. **Soft cap with upgrade prompt**: included up to X; over X triggers a plan
   upgrade suggestion (no hard block). Best for low-overage customers who are
   upsell candidates.
2. **Hard cap with overage fee**: included up to X; over X charged at €Y/unit.
   Best when cost is linear and predictable.
3. **Fair-use policy**: "unlimited for reasonable use" with a ToS clause for
   outliers. Best when 95% of users are well within cost-neutral range and the
   outlier cohort is small.

Recommend the structure that maximises gross margin per client without triggering
perceived price-gouging. State the breakeven usage level for each structure.

### 7. Pricing options table — CFO verdict

Produce a pricing options table for the CEO + CRO gate:

| Option | Description | New price | Gross margin | Payback | Premium signal | Risk |
|--------|-------------|-----------|---|---|---|---|
| A — Status quo | Keep current pricing | current | current % | current | — | Margin erosion risk |
| B — Floor fix | Raise to price floor | floor € | target % | improved | low | Some client friction |
| C — Premium | Raise to premium-signal-justified price | premium € | high % | short | high | Requires proof density |
| D — Tiered | Introduce anchor tier above core | tier € | | | | Migration risk |

**CFO recommendation:** state which option the CFO proposes, with the quantified
financial rationale and the condition(s) that must be true for it to succeed.

**Decision gate:** this memo proposes; CEO + CRO decide. Do not frame this as
"the decision is made" — frame it as "CFO proposes Option C, subject to CEO/CRO
alignment on messaging and client communication."

### 8. Ingest memo to KB

After producing the pricing review, ingest via `kb_ingest`:
- Title: `Pricing Redesign Memo — <Company> — <Offer(s)> — <YYYY-MM>`.
- Source path: `memos/fin/pricing-redesign-<company-slug>-<YYYY-MM>`.
- Tags: `pricing`, `financeiro`, `cfo`, `unit-economics`, `premium-pricing`,
  `<company-slug>`.
- Include: baseline economics table, price floor calculation, premium signal
  scores, annual-increase viability analysis, options table, CFO recommendation,
  and any fair-use modelling.

## Output contract

The deliverable always contains:
1. **Baseline economics table** — current price vs fully-loaded unit economics
   per offer.
2. **Price floor calculation** — minimum price to hit margin target per offer.
3. **Premium signal scorecard** — 4 signals scored; total and interpretation.
4. **Annual price increase analysis** — viability, proposed increase, revenue
   impact, retention breakeven.
5. **Included-compute / fair-use model** — for recurring offers: cost exposure,
   structure recommendation, breakeven usage.
6. **Pricing options table** — 4 options with economics per option.
7. **CFO recommendation** — single preferred option with rationale and conditions.
8. **Decision gate statement** — explicit that CEO + CRO must approve.
9. **Next action** — single highest-impact pricing action, owner, deadline within
   30 days.

## Red flags

- Producing a pricing recommendation without a unit-economics baseline — a price
  without a cost structure is a guess.
- Recommending a price increase before fixing retention — price increases on
  churning offers accelerate loss.
- Conflating pricing economics with offer messaging — this skill produces numbers;
  messaging belongs to `marketing:offer-architecture`.
- Setting a price that is below the fully-loaded cost floor — any price below floor
  is subsidised by the company's balance sheet.
- Recommending a single option without the options table — the CEO/CRO gate needs
  alternatives, not a mandate.
- Skipping the fair-use analysis for recurring offers that include compute/usage —
  an included-unlimited structure without cost modelling is a liability.
- Not flagging the CEO + CRO decision gate — the CFO proposes; the decision is
  joint.
