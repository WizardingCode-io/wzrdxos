---
name: ceo:initiative-eval
description: Evaluate a business initiative — market, viability, SWOT, competition — into a structured decision memo for the CEO gate.
type: capability
department: ceo
when-to-use: A new initiative, product idea, market entry, partnership or investment needs structured evaluation before the balanced-decision gate.
---

# Initiative Evaluation

Produces the evidence the CEO deliberation consumes. Flexible capability skill —
adapt depth to the initiative's size.

## Steps

1. **KB-first.** `kb_search` / `kb_ask` for: company profile, prior related
   initiatives, relevant frameworks (positioning, five-forces, blue-ocean,
   unit economics) already in the KB.
2. **Market.** Size, demand signals, timing. Who pays, how much, how often.
3. **Viability.** Effort/cost estimate, capability fit (do our departments cover
   it?), unit-economics sketch (revenue per unit vs. fully-loaded cost).
4. **SWOT.** Strengths / Weaknesses / Opportunities / Threats — max 4 bullets each,
   evidence-based, no filler.
5. **Competition.** Direct and indirect alternatives; our differentiation; what the
   competitor intel in the KB (e.g. AIOX watch) says.
6. **Memo.** One page: recommendation (pursue / drop / investigate), the three
   strongest arguments for and against, open questions with owners. Feed it into
   `ceo:balanced-decision`. Ingest the memo into the KB via `kb_ingest`:

```
kb_ingest("<memo text>", source="memos/YYYY-MM-DD-initiative-eval-<slug>.md", target="global")
```

## Output contract

The memo always ends with: `Recommendation:` one of pursue / drop / investigate,
plus the single most decision-relevant unknown.

## Red flags

- **Evaluating without KB-first.** Prior initiative evals and the company profile
  are in the KB; duplicating analysis already documented is wasted effort.
- **Recommendation without a SWOT.** Pursue / drop / investigate must rest on
  evidence, not intuition. An unsupported recommendation is an opinion, not a memo.
- **Skipping competition.** Initiatives fail at the market, not in the spreadsheet.
  Missing the competitive landscape invalidates the viability step.
- **Not ingesting the memo.** The evaluation is a knowledge event; feeding it to
  `ceo:balanced-decision` without recording it means the decision record is
  incomplete and cannot compound into future evaluations.
