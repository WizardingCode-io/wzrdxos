---
name: eng:tech-stack-eval
description: Technology evaluation — KB-first, requirements-anchored, evidence-based evaluation of any technology, library, vendor or model with an ADR draft and KB ingest.
type: capability
department: eng
when-to-use: Evaluating a technology, library, vendor or model — "should we use X or Y", build-vs-buy decisions, runtime or model routing choices (Codex vs Claude), framework upgrades, dependency additions, or any stack decision that will persist beyond the current sprint.
---

# Tech Stack Evaluation

Flexible capability skill. Takes a technology decision (framework, library, vendor,
LLM model, cloud service) and produces a rigorous, evidence-based evaluation with a
clear recommendation and an ADR draft ready for approval and KB ingest.

Anchored on the wzrdxOS KB sources: Vue 3.6 / Nuxt 4 / Laravel 13 (2026 ecosystem
notes), model-agnostic routing (Codex vs Claude), MCP USB-C framework, and the
Harness Pattern + Tokens-as-Currency token-economics fragments.

## Steps

### 1. KB-first — check prior decisions

Query the Knowledge Base (`kb_search`, `kb_ask`) for:
- Prior ADRs or evaluations for this technology or the decision space it sits in.
- Architecture decisions in `docs/` that constrain or inform the choice.
- Ecosystem notes already in the KB (e.g. Vue/Nuxt/Laravel 2026 notes, model routing
  matrix, MCP connector patterns).
- Token-cost data if the evaluation involves an LLM model or agentic component.

Note what is already known. If a prior ADR covers the decision and remains current,
review it for currency and either re-confirm or initiate a superseding ADR.

### 2. Requirements and constraints

Before looking at candidates, anchor the evaluation in the specific context:

**Functional requirements**
- What must this technology do? (capabilities, features, integration points)

**Non-functional requirements**
- Performance budget (latency, throughput, memory).
- Security requirements (data residency, access control, audit logging).
- **Token / cost budget** (if an LLM or API-metered service): monthly cap, per-request
  ceiling, acceptable model degradation under load.
- Compliance constraints (GDPR, SOC 2, Portuguese data residency if applicable).

**Constraints**
- Team skills (what do we already know how to operate?).
- Existing stack compatibility (runtime, language, deploy target).
- Licensing (OSS licence compatibility, commercial licence cost/ceiling).
- Time-to-productive (how long before the team is effective with this choice?).

### 3. Candidate research — verified docs

For each candidate technology:

1. Use **Context7** (`mcp__context7__resolve-library-id` → `mcp__context7__query-docs`)
   to retrieve version-specific, current documentation. Do not rely on training-data
   knowledge for library APIs or version constraints — use Context7.
2. Use **deep-research** for vendor claims, benchmark comparisons, and market
   positioning that require cross-source verification (cited report with sources).
3. Cross-check with the wzrdxOS KB for any internal notes or prior experience.

For each candidate, record:
- Current stable version and release cadence.
- Community size and activity (GitHub stars trend, issues/PRs velocity — not absolute
  count).
- Verified claims vs marketing claims (flag where vendor docs and independent
  benchmarks diverge).
- Known breaking changes or migration costs relative to the current stack.

### 4. Evaluation matrix

Score each candidate (1–5) on each dimension. Weight by the requirements from Step 2.

| Dimension | Weight | Candidate A | Candidate B | Notes |
|-----------|--------|-------------|-------------|-------|
| Functional fit | high | | | Does it actually do what we need? |
| Maturity / stability | medium | | | API stability, semver discipline, EOL date |
| Ecosystem health | medium | | | Integrations, community, plugin coverage |
| Cost (licensing + ops) | per context | | | Include token economics if LLM |
| Token economics | if LLM | | | Cost/1K tokens, caching support, fallback |
| Vendor / lock-in risk | medium | | | Proprietary API surface, exit cost |
| Security posture | high | | | CVE history, audit logs, data handling |
| Team skill match | medium | | | Onboarding cost for current team |
| Model-agnostic routing | if LLM | | | Can we swap models under the same API? |

**Token economics sub-matrix** (for LLM / model routing decisions):

| Model | Cost/1M input tokens | Cost/1M output tokens | Context window | Caching? | Best for |
|-------|---------------------|----------------------|----------------|----------|---------|
| (fill from Context7 / KB) | | | | | |

Select the cheapest model that meets the quality bar for each task class. Do not
default to opus when sonnet (or a non-Anthropic model) is sufficient — token spend
is a first-class engineering cost.

### 5. Recommendation and ADR draft

Produce a clear recommendation:

**Recommendation:** [Candidate name] — **adopt / defer / reject**

**Rationale (3–5 bullet points):**
- Primary reason (functional fit, cost, risk).
- …

**Risks and mitigations:**
- Risk 1 → mitigation / monitoring trigger.
- …

**What would change this recommendation:**
- Condition 1 (e.g. "if vendor X drops price below Y").
- …

Then draft the ADR:

---

**ADR-[NNN] — [Decision title]**

| Field | Value |
|-------|-------|
| Status | Proposed |
| Date | [YYYY-MM-DD] |
| Deciders | CTO (+ CEO/COO if cross-department budget) |
| Supersedes | ADR-[NNN] (if any) |

**Context:** [Why is this decision being made now?]

**Decision:** [What is being decided and in which direction?]

**Options considered:**
1. [Candidate A] — [one-line summary of why it was or wasn't chosen]
2. [Candidate B]
3. …

**Consequences:**
- Positive: …
- Negative / trade-offs: …
- Risks and mitigations: …

---

Submit the ADR for CTO approval before committing to the technology. Log the approved
ADR in `docs/adr/` and update the index.

### 6. Ingest ADR into KB

After the ADR is approved:

1. Store the ADR file in `docs/adr/ADR-[NNN]-[slug].md`.
2. Ingest into the KB via `kb_ingest`:
   - Title: `ADR-[NNN] — [Decision title] — [Project]`.
   - Tags: `adr`, `tech-decision`, `<technology-slug>`, `<department>`.
   - Include: full ADR + evaluation matrix + recommendation rationale.

## Red flags

- Evaluating without KB-first — prior ADRs may already answer the question or
  constrain the options.
- Using training-data knowledge for library APIs instead of Context7 — versions drift;
  always fetch current docs.
- Defaulting to the highest-capability (and highest-cost) model without a token
  economics analysis — opus is not the default; sonnet or a cheaper model may be
  sufficient.
- Choosing a technology because it is popular, not because it fits the requirements.
- Skipping the lock-in / exit-cost row in the matrix — proprietary APIs compound over
  time; the cost of being wrong rises with adoption.
- Producing a recommendation without drafting the ADR — a decision not recorded is a
  decision that will be repeated.
