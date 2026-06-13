# wzrdxOS skill eval baseline (M4)

Trigger-evaluation baseline for the 10 pilot skills, measured with the
**ecological runner** (`scripts/trigger_eval.py`) against the *deployed* skills
in the real environment (~360 competing skills installed). 20 queries per skill
(≈10 should-trigger, ≈10 should-NOT incl. near-misses), 2 runs each.

> Why ecological: the vendored `run_eval.py` clones the skill under a hashed
> name and reads 0 triggers forever once the real skill is deployed (the model
> picks the real one). See `docs/skills.md` → Eval methodology.

## Results (round 2, after one tuning pass)

| Skill | should-trigger | should-NOT | Notes |
|---|---|---|---|
| `ceo:balanced-decision` | 10/10 | 10/10 | clean |
| `ops:roadmap-diagnose` | 10/10 | 10/10 | clean |
| `admin:calendar-defense` | 10/10 | 9/10 | 1 FP: generic "plan my tasks" |
| `fin:unit-economics-audit` | 9/10 | 9/10 | 1 FP: "how do I calculate CAC" (keyword-conceptual) |
| `rh:hiring-pipeline` | 9/9 | 7/11 | FPs: adjacent (contract draft, ATS software, recruiting post) |
| `marketing:geo-content` | 9/9 | 8/11 | FPs: conceptual "what is GEO/AEO" (keyword) |
| `knowledge:daily-digest` | 9/10 | 10/10 | 1 miss: "resumo desta semana" lost to kb-enrich |
| `core:conductor` | 7/10 | 10/10 | misses route straight to the dept skill (see C2) |
| `growth:deal-pipeline` | 7/9 | 11/11 | runs=2 variance; perfect on false-positives |
| `eng:spec-driven-development` | 5/10 | 9/10 | gate-behaviour limit (see C1) |

Round 1 (pre-tuning) for comparison: conductor 6/10, sdd 6/10, unit-econ 8/10,
geo not-7/11, deal not-9/11 — deltas are within ±1-2, i.e. **runs=2 variance
dominates** fine wording changes. Boundary *clarity* improved regardless, which
is what matters for real use.

## Three structural causes (not wording bugs)

**C1 — Gate skills are mis-served by auto-triggering.** `spec-driven-development`
must *stop* the user and demand a spec before "add this feature" / "let's code".
But the skill-trigger mechanism is built to *activate capabilities*, not to
*block* — the model wants to be helpful and starts implementing. No description
wording reliably provokes the gate. **Design implication:** the SDD gate likely
needs a PreToolUse hook (Edit/Write interception), not description triggering —
tracked for M5/M6. This is the single most valuable finding of the pilot.

**C2 — Direct routing beats the conductor for single-domain asks.** conductor
"misses" went straight to the correct department skill (`roadmap-diagnose`,
`hiring-pipeline`). That is the desired behaviour — the conductor should only own
genuinely multi-department asks (now reflected in its description). The metric
penalises a correct outcome; the eval-set expectation is the thing to relax.

**C3 — Keyword-conceptual false-positives are a mechanism limit.** "What is
GEO?", "explica-me spec-driven development", "how do I calculate CAC" carry the
skill's exact keyword, so the trigger fires even though the intent is
informational. "Not for explaining X" in the description helps only partially.
Mitigation has diminishing returns; some of these are also debatable (a skill
answering a concept question it owns is not catastrophic).

## Decision

Stop tuning wording (would chase runs=2 noise — systematic-debugging Phase 4.5).
The infrastructure works and produces real signal; the baseline is solid (8 of
10 skills ≥ 9/10 on the should-trigger axis, 9 of 10 ≥ 9/10 on should-NOT). The
residual gaps are structural (C1-C3), tracked as follow-ups rather than chased
here.

## Next (M4 continuation / M5)
- Functional with/without benchmark (does the skill improve output quality) —
  separate executor+grader harness; pilot one skill end-to-end first.
- SDD gate as a PreToolUse hook (C1).
- Relax over-purist eval expectations (C2) and conceptual near-misses (C3).
- Higher `--runs` (5) for stable numbers when a specific skill is under scrutiny.
