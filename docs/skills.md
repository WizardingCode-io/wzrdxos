# wzrdxOS skill taxonomy

This document is the authoritative reference for skill authoring, evaluation, and
registry governance. It formalises what is already practised across the 46 skills
in `artifacts/skills/` and provides the contract the registry loader and the
contract test enforce.

---

### Trigger evals: ecological method (this machine)

The vendored `run_eval.py` clones the skill under a hashed name and assumes a
CLEAN environment. On a machine with the wzrdx skills deployed (plus ~300 other
installed skills) the model correctly picks the REAL skill over the hashed
clone, so the vendored runner reads 0 triggers forever (verified 2026-06-11;
the probe query fired `wzrdx-ops-roadmap-diagnose`, never the clone).

Use `scripts/trigger_eval.py` instead — it measures whether a query triggers
the DEPLOYED skill (`wzrdx-<dept>-<name>`) in the real environment, which is
the production condition; near-misses then measure true false-positives, and
`fired_others` records which competing skill stole the query (routing signal).

```
python3 scripts/trigger_eval.py \
  --eval-set artifacts/skills/<dept>/<name>/evals/trigger_eval.json \
  --skill wzrdx-<dept>-<name> [--runs 2] [--model sonnet]
```

Ops notes (hard-won): the script fail-fasts if `claude` is not on PATH —
background shells load a minimal profile, so export a PATH that includes
`~/.local/bin` before batch runs. Results land outside git (`.wzrdx/eval-runs/`).
The vendored runner remains the right tool for clean-room environments (CI
sandbox, fresh machine).

## 1. Conventions

### 1.1 Canonical id

Every skill has a unique id in the form `<department>:<name>`, where:

- `<department>` is the owning department slug (e.g. `eng`, `fin`, `ops`, `core`).
- `<name>` is the directory name under `artifacts/skills/<department>/`.

The YAML frontmatter `name` field **must equal** `<department>:<name>`. The
registry loader derives the id from the frontmatter `name`; mismatches are caught
by the contract test (`packages/core/test/skills-contract.test.ts`).

The sole exemption is `skill-creator` (vendored; third-party content — never rename).

### 1.2 Required frontmatter fields

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Canonical id: `<department>:<name>`. |
| `description` | yes | One line; used for routing and the Skill tool trigger. |
| `type` | yes | `process` or `capability` — see §1.3. |
| `department` | yes | Owning department slug, or `core`. |
| `when-to-use` | strongly recommended | Trigger conditions; include pt-PT phrases (see §1.4). |

### 1.3 Skill types

**`process`** — rigid. Follow every step in order without skipping. The skill body
is a sequential protocol; deviation is a failure mode. Process skills are always
enforced with a "Red flags" section that names the most dangerous divergences.
Examples: `core:conductor`, `eng:spec-driven-development`, `knowledge:daily-digest`.

**`capability`** — flexible. Domain expertise applied with judgment. Steps are a
recommended structure, not a rigid sequence. Depth adapts to context.
Examples: `ops:roadmap-diagnose`, `fin:unit-economics-audit`, `growth:deal-pipeline`.

### 1.4 `when-to-use` — trigger phrases

The `when-to-use` field drives Claude's skill-triggering decision. Include:

- English trigger phrases (what the user would type).
- **pt-PT trigger phrases** for the primary workflow language of wzrdxOS. Examples:
  - `"diagnóstico"`, `"onde estamos"`, `"o que melhorar primeiro"` → `ops:roadmap-diagnose`
  - `"quem trata disto"`, `"por onde começo"` → `core:conductor`
  - `"devíamos ter uma skill para isto"` → `knowledge:skill-promotion`
  - `"o que há de novo na KB"` → `knowledge:daily-digest`
  - `"limpar a KB"`, `"verificar duplicados"` → `knowledge:kb-enrich`

Including pt-PT phrases in `when-to-use` is mandatory for any skill that serves a
workflow the founder or team would naturally express in Portuguese.

### 1.5 Body contract

Every wzrdx-authored skill body (all except `skill-creator` and `core:brainstorm`)
must honour the following contract:

**Step 1 — KB-first (mandatory, always first)**

Before any substantive work, query the KB:

```
kb_search("<the request or its core intent>")
kb_ask("<specific question about prior context>")
```

Rationale: Constitution rule 3 (KB-first) is unconditional. Skipping it means every
task starts from zero and prior learnings cannot compound.

**Final step — kb_ingest (mandatory, always last)**

After completing the skill's work, ingest new learnings back into the KB:

```
kb_ingest("<memo or summary>", source="<prefix>/YYYY-MM-DD-<slug>.md", target="global")
```

Use the correct source prefix (see §1.6). This closes the KB loop.

**Red flags section (mandatory)**

Every skill body must include a `## Red flags` section listing the most dangerous
failure modes for that skill. The section must be the last section of the body
(after the output contract when present).

### 1.6 Source-prefix registry

The `source` argument in `kb_ingest` calls uses a path prefix that encodes the
document type. The following prefixes are in use across the registry:

| Prefix | Document type | Owning skills |
|---|---|---|
| `memos/` | Decisions, meeting notes, strategic memos, domain analyses. General-purpose output from most skills. | All departments. |
| `digests/` | Daily KB digest memos. | `knowledge:daily-digest` |
| `enrichment/` | Enrichment verdict memos from the dream cycle. | `knowledge:kb-enrich` |
| `reviews/` | Pre-ship deliverable review reports. | `core:deliverable-review` |
| `audits/` | Quality audit reports. | `core:quality-audit` |
| `memos/interviews/` | Customer interview summaries from the discovery cadence. | `ops:discovery-cadence` |

When authoring a new skill, default to `memos/`. Introduce a new prefix only when
the document type is structurally distinct from memos and needs to be queryable
as a class (e.g. all digests, all enrichment runs).

---

## 2. Eval methodology

### 2.1 Summary

Skills are evaluated using the vendored skill-creator eval framework
(`artifacts/skills/core/skill-creator/`). Evals measure:

- **Trigger accuracy** — does the skill fire on the right prompts and not on
  irrelevant ones? (trigger eval)
- **Functional quality** — does the skill produce the correct output for a set of
  representative prompts? (functional eval)

### 2.2 File locations

| File | Purpose |
|---|---|
| `<skill>/evals/evals.json` | Functional eval prompts and assertions (skill-creator schema). |
| `<skill>/evals/trigger_eval.json` | Trigger eval queries (`[{ query, should_trigger }]`). |

### 2.3 Runner scripts

The eval runners live in the vendored skill-creator:

```
artifacts/skills/core/skill-creator/scripts/
  run_eval.py             — runs trigger_eval.json; reports trigger accuracy
  run_loop.py             — description optimisation loop (train/test split)
  aggregate_benchmark.py  — aggregates functional eval results into benchmark.json
```

Run examples:

```bash
# Trigger eval
python -m scripts.run_eval \
  --eval-set artifacts/skills/<dept>/<name>/evals/trigger_eval.json \
  --skill-path artifacts/skills/<dept>/<name> \
  --model <model-id>

# Description optimisation
python -m scripts.run_loop \
  --eval-set artifacts/skills/<dept>/<name>/evals/trigger_eval.json \
  --skill-path artifacts/skills/<dept>/<name> \
  --model <model-id> --max-iterations 5

# Aggregate functional benchmark
python -m scripts.aggregate_benchmark <skill-name>-workspace/iteration-N \
  --skill-name <name>
```

All scripts must be run from `artifacts/skills/core/skill-creator/`.

### 2.4 Eval workspaces

Workspace directories (`<skill-name>-workspace/`) are generated during eval runs
and **must not be committed**. They are gitignored by:

```
**/skills/**/*-workspace/
```

See `.gitignore` at the repository root.

### 2.5 Contract test

`packages/core/test/skills-contract.test.ts` enforces §1 conventions over every
skill in the registry on every test run:

- Frontmatter completeness (`name`, `description`, `type`, `department` all present).
- Canonical id format (`<department>:<name>` matches the directory structure).
- Body contract (KB-first, kb_ingest, Red flags present) for all wzrdx-authored skills.

Exemptions are documented inline in the test file with a rationale comment.

---

## 3. Skill index

46 skills across 10 departments. Eval status columns:

- **Trigger eval** — score = should-trigger·should-NOT (round-2, runs=2). Full
  analysis in [`eval-baseline.md`](eval-baseline.md).
- **Functional eval** — `evals/evals.json` exists with assertions and a passing benchmark.

All skills are currently `—` (not yet evaluated). The M4 pilot set (§4) will be
the first 10 to flip to `✓`.

### core (cross-cutting process skills)

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `core:brainstorm` | process | Explore intent and requirements before any creative work or implementation. | — | — |
| `core:conductor` | process | Universal entry point — decompose, route via the routing table, CEO gate, execute, and close the KB loop. | 7/10·10/10 | — |
| `core:deliverable-review` | process | Pre-ship structured review of a client-facing deliverable against type checklist and quality bar. | — | — |
| `core:quality-audit` | process | Internal audit of a process or department — POP vs. practice gap analysis with finding severity scores. | — | — |
| `skill-creator` | — | Vendored: create, improve, and benchmark skills using the eval framework. | — | — |

### ceo

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `ceo:balanced-decision` | process | CEO decision gate — deliberate any significant decision through optimist, conservative and risk-taker lenses to a go/no-go verdict. | 10/10·10/10 | — |
| `ceo:initiative-eval` | capability | Evaluate a business initiative (market, viability, SWOT, competition) into a structured decision memo for the CEO gate. | — | — |

### eng

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `eng:ai-agent-architecture` | capability | Design multi-agent systems — choose the right orchestration pattern and produce a deployment blueprint. | — | — |
| `eng:aios-operating-model` | capability | Structure an AI Operating System deployment using the Liam Ottley model — layer map, agent roster, and governance. | — | — |
| `eng:mcp-integrator` | capability | Decide when and how to integrate a tool via MCP — connector selection, vetting, wiring, and KB documentation. | — | — |
| `eng:spec-driven-development` | process | Spec gate — enforce document-first before any code is written; locate or author the spec, gate on approval, then TDD. | 5/10·9/10 | — |
| `eng:tech-stack-eval` | capability | KB-first, requirements-anchored technology evaluation producing a scored comparison and ADR. | — | — |
| `eng:token-cost-optimization` | capability | Minimise LLM token spend without sacrificing output quality — model selection, caching, prompt compression. | — | — |

### fin

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `fin:cash-first-ops` | capability | Daily/weekly cash ritual — cash-in/cash-out report, runway calculation, and cash-first decision gate. | — | — |
| `fin:cfo-4-pilares` | capability | Diagnostic across the 4 CFO pillars (Planeamento · Contabilidade · Análise · Riscos) with a scored maturity map. | — | — |
| `fin:metrics-dashboard` | capability | Build or update the weekly financial KPI dashboard and CEO scorecard feed — MRR, runway, burn, gross margin. | — | — |
| `fin:pricing-redesign` | capability | Pricing review from the finance side — current pricing vs unit economics, value-anchored redesign. | — | — |
| `fin:unit-economics-audit` | capability | Audit profitability per revenue stream — fully-loaded P&L, gross-profit-to-CAC ratio, and improvement roadmap. | 9/10·9/10 | — |

### growth

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `growth:cold-outreach-engine` | capability | Design and run the outbound engine — ICP list building, shotgun vs. sniper lanes, weekly review ritual. | — | — |
| `growth:deal-pipeline` | capability | Set up or review the CRM and sales pipeline — HubSpot stage config, 5 commercial KPIs, weighted forecast, coverage-gap analysis. | 7/9·11/11 | — |
| `growth:dream-100-partnerships` | capability | Build the Dream 100 list (Brunson) of dream partners, channels and whales with a relationship-farming calendar. | — | — |
| `growth:sales-machine` | capability | Design and run the full sales process — Magic Lantern trust funnel, application call, close call. | — | — |

### knowledge

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `knowledge:agent-evolution` | process | Evolve a wzrdxOS agent definition based on cited KB evidence — gather digest/enrichment evidence, draft agent.md diff, gate mandate changes through CEO, propose as PR. | — | — |
| `knowledge:daily-digest` | process | Synthesise everything new in the KB since the last watermark into a cited memo, run gap analysis, ingest, and route highlights. | 9/10·10/10 | — |
| `knowledge:kb-enrich` | process | Near-duplicate and contradiction review over the KB vector store — classify each pair, write a verdict memo, ingest, and route contradictions. | — | — |
| `knowledge:skill-promotion` | process | Promote a recurring KB pattern into a new wzrdxOS skill — collect ≥3 cited occurrences, check registry, draft via skill-creator, evaluate, propose as PR. | — | — |

### marketing

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `marketing:geo-content` | capability | Create and optimise content for AI-engine citation (GEO/AEO) and traditional SEO — structured data, authority signals, citation targeting. | 9/9·8/11 | — |
| `marketing:hook-viral-system` | capability | Generate a hook set using the 7 hook types and score a piece or campaign for virality potential. | — | — |
| `marketing:offer-architecture` | capability | Build the messaging layer of a Grand Slam Offer — dream outcome, perceived likelihood, effort/time reduction, unique mechanism. | — | — |
| `marketing:rebranding-execution` | capability | Drive the Rebranding-2026-06 roadmap — KB-first from the vault (9 docs, brand guide, domain decision, social migration). | — | — |
| `marketing:status-engineering` | capability | Reposition an offer as a status artifact — identify the ICP's status signals, engineer the positioning and social proof. | — | — |

### ops

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `ops:automation-discovery` | capability | Map repetitive workflows to automation (n8n/Zapier/AI agents), score by frequency × founder-time, produce a ranked backlog. | — | — |
| `ops:delegation-audit` | capability | Apply the Estratégico×Delegável matrix over the founder's task inventory, analyse the Buyback Rate, produce a delegation plan. | — | — |
| `ops:discovery-cadence` | capability | Set up a Teresa Torres Continuous Discovery cadence — weekly customer touchpoints, OST map, and interview-to-KB pipeline. | — | — |
| `ops:kpi-system` | capability | Build and run the 25-KPI system (5 per area: Gestão/Marketing/Vendas/Cultura/CX) with a weekly Friday dashboard ritual. | — | — |
| `ops:pop-builder` | capability | Process inventory + Estratégico×Delegável classification + POP (Procedimento Operacional Padrão) production and KB archiving. | — | — |
| `ops:roadmap-diagnose` | capability | 5-area operational diagnostic + custom 90-day roadmap (Documentar → Medir → Delegar) anchored on the WizardingCode 2026-05 baseline. | 10/10·10/10 | — |

### rh

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `rh:comp-ladder` | capability | Compensation and careers framework — Talent Levels Ladder tiers, talent-debt check, and comp-band calculation. | — | — |
| `rh:culture-foundation` | capability | Mission/vision/values workshop — draft M/V/V from founder interview + KB evidence, culture audit, and values embedding plan. | — | — |
| `rh:delegation-coach` | capability | Coach the founder/leader through a delegation — pick the task (Buyback Rate), define success, hand off with a Delegation Card. | — | — |
| `rh:founder-transition` | capability | Psychological-blockers protocol for the founder — name the blocker with evidence, reframe, and produce a transition micro-plan. | — | — |
| `rh:hiring-pipeline` | capability | Full hiring pipeline — KB-first postmortem of prior failures, role definition via SBIs, structured interview + scorecard, onboarding handoff. | 9/9·7/11 | — |
| `rh:onboarding-60d` | capability | 60-day structured onboarding — observe/do-together/supervise/delegate phases with weekly checkpoints and KB documentation. | — | — |

### admin

| id | type | description | trigger eval | functional eval |
|---|---|---|---|---|
| `admin:buyback-audit` | capability | Time and energy audit — classify every recurring task on the energy × $/h matrix and produce a buyback plan. | — | — |
| `admin:calendar-defense` | capability | Audit the current calendar against the five defense rules and produce a Perfect Week template. | 10/10·9/10 | — |
| `admin:meeting-discipline` | capability | Run meetings that respect the calendar-defense rules — agenda-or-decline, time-box, async-first. | — | — |

---

## 4. Pilot set — M4

The following 10 skills form the M4 eval pilot — one per department. They will be
the first to have both `trigger_eval.json` and `evals/evals.json` authored and run,
flipping their eval status from `—` to `✓`.

| id | department |
|---|---|
| `core:conductor` | core |
| `ceo:balanced-decision` | ceo |
| `ops:roadmap-diagnose` | ops |
| `eng:spec-driven-development` | eng |
| `fin:unit-economics-audit` | fin |
| `rh:hiring-pipeline` | rh |
| `marketing:geo-content` | marketing |
| `growth:deal-pipeline` | growth |
| `knowledge:daily-digest` | knowledge |
| `admin:calendar-defense` | admin |

Eval files for each pilot skill are created at:

```
artifacts/skills/<dept>/<name>/evals/evals.json
artifacts/skills/<dept>/<name>/evals/trigger_eval.json
```

Run the trigger eval for a pilot skill:

```bash
cd artifacts/skills/core/skill-creator
python -m scripts.run_eval \
  --eval-set ../../<dept>/<name>/evals/trigger_eval.json \
  --skill-path ../../<dept>/<name> \
  --model claude-sonnet-4-6
```
