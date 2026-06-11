---
name: knowledge:skill-promotion
description: Promote a recurring KB pattern into a new wzrdxOS skill — collect evidence of ≥3 occurrences across digests/memos/audits, check the registry for duplicates, draft via the skill-creator framework, evaluate with test prompts, and propose as a PR. Never auto-lands without human review. Use when a pattern keeps recurring in digests/memos, "devíamos ter uma skill para isto", or quarterly KB review reveals an unserviced recurring need.
type: process
department: knowledge
when-to-use: A pattern keeps recurring in digests, memos, or quality audits (≥3 times); someone says "devíamos ter uma skill para isto" or "fazemos sempre isto manualmente"; quarterly KB review; knowledge:daily-digest highlights a recurring gap that a skill would close.
---

# Skill Promotion

Rigid process skill — follow every step in order without skipping. This skill
operationalizes **Constitution rule 6** (evolutive agents) at the skill layer: it
turns recurring KB patterns into reusable skills, gated by human review.

**Principle:** a skill promoted from a single anecdote is noise. A skill promoted
from three or more independently evidenced occurrences is signal. The PR gate is
what keeps the registry clean.

MCP tools used: `kb_search`, `kb_ask`, `kb_ingest`.
Framework used: vendored skill-creator at `artifacts/skills/core/skill-creator/SKILL.md`.

## Steps

### 1. KB-first — collect the evidence

```
kb_search("<the pattern or recurring need>")
kb_ask("How many times has <pattern> appeared across digests, memos, and audits?")
```

Retrieve and cite every occurrence. The evidence must meet the **minimum bar**:

- **≥ 3 independent occurrences** across `digests/`, `memos/`, `enrichment/`, or
  quality audit reports.
- Each occurrence must cite its source path: `[source: digests/YYYY-MM-DD.md]`.
- Occurrences from the same source on the same day count as one.

If the bar is not met: **stop here**. Document the candidate pattern with current
evidence so it can be picked up when more occurrences accumulate:

```
kb_ingest(
  source="memos/skill-candidate-<slug>.md",
  content="# Skill Candidate: <pattern>\nEvidence so far: <N> occurrence(s)\n<cited list>\nStatus: below threshold — revisit when ≥3 independent occurrences."
)
```

### 2. Check the registry for existing coverage

Read `artifacts/skills/` (all departments) and the `loadRegistry` output to check
whether an existing skill already covers this pattern.

Check both:
- The `name` field (exact or near-match).
- The `description` field (semantic overlap — a skill that "does the same thing
  but for a different audience" is still a duplicate).

If a sufficiently overlapping skill already exists: **do not promote**. Instead,
document the overlap finding and propose an improvement to the existing skill via
a PR that enriches its description or steps.

If no existing skill covers it: proceed to step 3.

### 3. Draft via the skill-creator framework

Read `artifacts/skills/core/skill-creator/SKILL.md` for the authoring framework.

Determine the skill's placement:
- **Department slug** — which org.md department owns this skill? Use the routing
  table in `core:conductor` to decide. If it is transversal, use `core`.
- **Type** — `process` (rigid, step-by-step) or `capability` (flexible domain).
- **Name** — `<department>:<name>` in lower-kebab-case.

Draft the `SKILL.md` frontmatter:

```yaml
---
name: <department>:<name>
description: <one line — what it does + when to trigger>
type: process | capability
department: <slug>
when-to-use: <trigger conditions>
---
```

Draft the skill body following the skill-creator anatomy:
1. **Purpose** — what the skill does and why it exists.
2. **KB-first step** (mandatory, first step of every process skill) — the KB lookup
   specific to this skill's domain.
3. **Steps** — the procedural body.
4. **Red flags** — common failure modes.
5. **`kb_ingest` at the end** — every process skill closes the KB loop.

The KB evidence from step 1 is the primary content input — mine it for domain
knowledge and cite sources inline.

### 4. Evaluate the draft

Run 2–3 realistic test prompts against the drafted skill following the skill-creator
evaluation loop:

1. Draft the prompts (the kind of thing a real user would say — not abstract).
2. Run the skill on each prompt.
3. Assess: does the skill produce the right output for the right input? Are there
   false positives (triggers when it shouldn't)? False negatives?
4. Iterate on the description and steps until the skill behaves correctly on all
   test prompts.

Document the test prompts and outcomes — they become part of the PR body.

### 5. Propose as a PR — never auto-apply

Create the skill file at `artifacts/skills/<department>/<name>/SKILL.md`.

Open a PR with:
- **Title:** `feat(skills): promote <department>:<name> from KB evidence`
- **Body:**
  - Evidence: the ≥3 cited occurrences from step 1.
  - Registry check: confirmation that no duplicate exists.
  - Skill draft: the SKILL.md content.
  - Eval results: the test prompts and outcomes from step 4.
  - Placement rationale: why this department and type.
  - Dept test update: if the department has a `packages/core/test/dept-<slug>.test.ts`,
    add the new skill name to its assertion list in the same PR.

**This PR must not be merged by the skill-promotion process itself.** A human
reviews and merges. The PR gate is the quality control.

### 6. Document the promotion decision to the KB

```
kb_ingest(
  source="memos/skill-promotion-<name>-YYYY-MM-DD.md",
  content="# Skill Promotion Decision: <name>\nDate: YYYY-MM-DD\nEvidence: <N> occurrences\n<cited list>\nDecision: promoted — PR #<N> opened\nPlacement: artifacts/skills/<dept>/<name>/"
)
```

## Red flags

- **Promoting from a single anecdote.** One occurrence, however vivid, is not a
  pattern — it is a preference. The ≥3 threshold is not negotiable.
- **Skipping the registry duplicate check.** Duplicate skills create routing
  ambiguity and dilute the registry. Always check before drafting.
- **Skipping evals.** A skill that has never been tested on a real prompt is
  untested by definition. Even two test prompts reveal obvious failure modes.
- **Bypassing the PR gate.** Auto-applying skills without review is the exact
  pattern this process is designed to prevent. The human review is the safeguard
  against low-quality, misplaced, or duplicate skills landing in the registry.
- **Promoting without closing the KB loop.** Step 6 is mandatory — the promotion
  decision itself is a knowledge event that future digests should be able to find.
