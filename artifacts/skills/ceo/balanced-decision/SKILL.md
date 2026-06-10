---
name: ceo:balanced-decision
description: CEO decision gate — deliberate any significant decision through optimist, conservative and risk-taker lenses to an equilibrium go/no-go verdict.
type: process
department: ceo
when-to-use: Any significant or strategic decision — approving an initiative, go/no-go, large resource allocation, cross-department trade-off, or when the user asks "should we…".
---

# Balanced Decision (CEO deliberation)

Rigid process skill. Every significant decision goes through three lenses before a
verdict. Never skip a lens; never decide on one perspective.

## Steps

1. **KB-first.** Query the Knowledge Base (`kb_search`, `kb_ask`) for prior
   decisions, frameworks and company context relevant to this decision. Note what
   the OS already knows.
2. **Frame the decision.** One sentence: what is being decided, by when, and what
   "go" would commit us to. Capture relevant context (numbers, constraints).
3. **Run the deliberation.** Preferred: invoke the `balanced-deliberation` workflow
   via the Workflow tool with `args: { decision, context }` (in-repo path:
   `artifacts/workflows/balanced-deliberation/workflow.mjs`; post-install:
   `~/.claude/workflows/balanced-deliberation.mjs`). Fallback (no Workflow tool): produce the
   three lens analyses inline — Optimist (potential), Pessimist/conservative
   (risks, pros & cons, weighs everything), Dynamic/risk-taker (bold opportunity) —
   each with position, key arguments, risks, opportunities and a 0-10 score.
4. **Equilibrium verdict.** Synthesize: name the dissent between lenses explicitly;
   every conservative-lens risk is either accepted with rationale or converted into
   a condition. Verdict is exactly one of **go / no-go / revise** + conditions.
5. **Document (Constitution rule 4).** Write the decision memo (decision, lenses
   summary, verdict, conditions, evidence that would change it) back to the KB via
   `kb_ingest`. On "go", hand off to Operações (COO) with the memo.

## Red flags

- "This one is obvious, skip the lenses" — run them anyway; obvious decisions are
  where unexamined risk hides.
- A verdict with no conditions and no dissent recorded — the deliberation was not
  real.
- Deciding without the KB lookup — violates KB-first.
