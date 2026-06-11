---
name: eng:token-cost-optimization
description: Minimize LLM token spend without sacrificing output quality — model selection matrix by task tier, caching strategy, fallback routing, harness-pattern thinking, and a cost-optimization memo with projected savings.
type: capability
department: eng
when-to-use: Auditing or reducing LLM costs, choosing the right model for a task, designing a caching strategy, reviewing token spend, or when the user says "reduzir custos de LLM", "model selection", "caching strategy", "tokens estão caros", "quanto custa rodar X" or similar.
---

# Token Cost Optimization

Flexible capability skill. Takes a current or planned agentic workload and produces
a cost-optimization plan — the right model per task tier, caching opportunities,
fallback strategies, and projected savings. The harness is the product: the cost
structure of running the OS is as important as its capabilities.

Anchored on: "Harness Pattern Token Optimization" framework (+ 8 with "Implications
para ArkaOS" notes), Claude Code Mastery topic, AI Operating Systems topic, "Tokens
as Currency" KB fragments. All sourced from the wzrdxOS Obsidian vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- "Harness Pattern Token Optimization" framework and its ArkaOS implications.
- "Tokens as Currency" KB fragments — the mental model.
- Prior cost analyses or model-selection decisions in the KB or `docs/`.
- Company profile (`wzrdx company`) — active models, monthly token spend if known,
  budget tier, runtime constraints.

Record what exists. Build on prior decisions; do not restart analysis from zero.

### 2. Inventory the workload

Map every AI-powered task in the current system:

| Task | Frequency | Input tokens (est.) | Output tokens (est.) | Current model | Notes |
|------|-----------|--------------------|--------------------|---------------|-------|
| ... | daily/weekly/on-demand | ... | ... | opus/sonnet/haiku | ... |

Estimate monthly token volume per task: `frequency × (input + output)`. Sum to a
monthly total. If exact data is unavailable, use conservative estimates — flag them
as estimates in the memo.

### 3. Apply the model selection matrix

The core principle: match task complexity to model tier. Using a top-tier model for
a low-complexity task is the single biggest source of avoidable cost.

**Task tier → model recommendation:**

| Task tier | Description | Recommended model | Notes |
|-----------|-------------|-------------------|-------|
| Tier 1 — Routing & classification | Determine intent, route to the right skill, simple yes/no | Haiku | Fastest, cheapest; output is a routing signal, not content |
| Tier 2 — Structured extraction | Extract fields from a document, parse structured input | Haiku / Sonnet | Haiku for simple schemas; Sonnet when output needs reasoning |
| Tier 3 — Drafting & synthesis | Write memos, summarize, draft emails, produce reports | Sonnet | The workhorse tier; high quality at reasonable cost |
| Tier 4 — Complex reasoning | Multi-step analysis, architecture decisions, adversarial review | Sonnet / Opus | Sonnet-first; escalate to Opus only for genuinely hard problems |
| Tier 5 — Strategic / irreversible | CEO gate decisions, legal review, final architecture ADRs | Opus | Full power justified; these decisions compound over time |

**Default rule:** start at the lowest tier that produces acceptable quality. Run a
quality test before committing to a tier. Do not use Opus for tasks Sonnet handles
well — the 5-10× cost difference is a budget decision, not a quality one.

### 4. Design the caching strategy

Token caching (prompt caching / KV cache) is the highest-leverage optimization after
model selection.

**What to cache:**
- System prompts — static role briefs, tool definitions, routing tables. These change
  rarely; cache aggressively.
- Shared context blocks — company profile, KB snapshots injected into every call.
  Use `<cache>` markers or structured cache turns.
- Large document contexts — when the same document is referenced across multiple
  agent calls in a session.

**What not to cache:**
- Per-request variable input (the user's message, task-specific context).
- Outputs — outputs are never cached; only inputs.

**Cache invalidation rule:** caches are invalidated when the underlying content
changes. Track cache hit rate. A hit rate below 60% on a static system prompt
indicates a structural problem (non-deterministic content injected into the cached
block).

**Cache configuration per runtime:**
- Claude Code: use `cache_control` blocks in messages.
- API direct: `cache_control: { type: "ephemeral" }` on `system` or large `user`
  turns.
- Document the cache configuration in the agent's system prompt file.

### 5. Design fallback and degradation routing

Every critical AI path needs a fallback:

**Fallback tiers:**
1. **Model fallback:** if Opus is unavailable or over budget, fall back to Sonnet.
   If Sonnet is unavailable, fall back to Haiku for non-critical tasks.
2. **Output degradation:** if the full output cannot be generated within budget,
   produce a reduced output (key points only, no examples) with a note to the user.
3. **Human-in-the-loop:** for Tier 5 tasks where automated fallback is not safe,
   route to a human review step rather than degrade silently.

Document the fallback path for every critical task in the optimization memo.

### 6. Apply harness-pattern thinking

The harness pattern insight: the harness (the orchestrator, the routing logic, the
context injection) is the product — not the model calls. Well-designed harness code
reduces costs more than model choice alone.

Apply these harness-pattern principles:

- **Lazy evaluation.** Do not call an LLM until the output is actually needed. Many
  orchestration flows call models preemptively "just in case."
- **Short-circuit on cache hit.** If a prior KB result already answers the question,
  return it without a model call.
- **Batch small tasks.** Multiple small, independent Haiku calls can often be batched
  into one Sonnet call with a structured multi-output prompt — reducing round-trip
  overhead.
- **Token budget per agent.** Every agent in the system has a per-call token budget.
  Document it. Alert when a single call exceeds 2× the budget.
- **The system prompt is working capital.** Every token in the system prompt is spent
  on every call. Treat it like working capital — cut what is not earning its keep.

### 7. Produce the cost-optimization memo

Structure the memo as:

```
# Token Cost Optimization — <system / workload name>

**Date:** YYYY-MM-DD
**Analyst:** CTO

## Current state
<workload inventory table; current monthly token estimate; current cost estimate>

## Model selection decisions
<per task: current tier → recommended tier; rationale>

## Caching opportunities
<what will be cached, expected hit rate, projected token reduction>

## Fallback strategy
<per critical path: primary model → fallback → degraded output or human gate>

## Harness improvements
<specific code/config changes; lazy evaluation, batching, budget alerts>

## Projected savings
| Change | Monthly token reduction (est.) | Monthly cost reduction (est.) |
|--------|-------------------------------|-------------------------------|
| ... | ... | ... |
| **Total** | ... | ... |

## Implementation sequence
<ordered steps; quick wins first (caching), then model tier changes, then harness>

## Monitoring
<how to track cost vs. projection: token spend per agent, per task, cache hit rate>
```

Flag any model-tier change that increases cost (e.g. upgrading from Sonnet to Opus
for a high-frequency task) for the CEO balanced-decision gate before implementing.

### 8. Ingest the memo to the KB

```
kb_ingest("<memo text>", source="memos/YYYY-MM-DD-token-cost-optimization.md", target="global")
```

## Output contract

Every invocation delivers:
1. **Workload inventory** — every AI-powered task, its frequency, and estimated tokens.
2. **Model selection decisions** — per task, with tier rationale and rejected alternatives.
3. **Caching plan** — what is cached, expected hit rate, configuration steps.
4. **Fallback strategy** — per critical path.
5. **Cost-optimization memo** — projected savings table and implementation sequence.

## Red flags

- **Using Opus for Tier 1-2 tasks.** This is the single most common source of
  avoidable cost. Every Opus call that Haiku could handle is a budget leak.
- **No caching on static system prompts.** A system prompt that is the same every
  call and is not cached is burning money on every invocation.
- **No fallback for critical paths.** A path without a fallback fails hard. Hard
  failures in production are more expensive than the cost of the fallback design.
- **Skipping the KB-first step.** Prior cost analyses exist; re-analyzing from scratch
  wastes tokens and time.
- **Projected savings without a monitoring plan.** Optimization without measurement
  is guessing. Every projected saving must have a corresponding metric to verify it.
- **Model tier changes on high-frequency tasks without CEO gate.** A cost increase on
  a high-frequency task compounds quickly. Get the gate before committing.
