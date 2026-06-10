---
name: eng:spec-driven-development
description: Spec gate — enforce document-first before any code is written; locate or author the spec, gate on approval, then follow TDD, and ingest outcomes to the KB.
type: process
department: eng
when-to-use: Any feature, change, or refactor that is about to be implemented without an approved spec — "vamos implementar", "build X", "add this feature", "let's code", or whenever implementation starts before the spec is confirmed.
---

# Spec-Driven Development (SDD)

Rigid process skill. No code is written until an approved spec exists. This enforces
the wzrdxOS Constitution's document-first rule (rule 5) at the implementation gate.
Never skip or defer any step — "it's a small change" is never an exception.

## Steps

### 1. KB-first — check what already exists

Query the Knowledge Base (`kb_search`, `kb_ask`) for:
- Prior specs, ADRs or decision records for this feature or component.
- Relevant architecture decisions in `docs/` (the technical source of truth).
- Prior implementation patterns, contracts or edge-case notes already documented.

Note what exists. If a valid approved spec is found, proceed to Step 4 (TDD). Do not
re-author a spec that already exists — review it for currency and move on.

### 2. Write or locate the spec

If no approved spec exists, author one before any other work. A spec is not a wish
list — it is a contract. Required sections:

**Spec — [Feature / Change Name]**

| Field | Value |
|-------|-------|
| ID | SPEC-[DEPT]-[NNN] |
| Status | Draft → Under Review → Approved |
| Author | [Role] |
| Created | [YYYY-MM-DD] |
| Approved by | [Role / stakeholder] |
| Approved on | [YYYY-MM-DD] |

**Scope**
- What is included in this change. One sentence per item.
- What is explicitly out of scope (equally important — prevents scope creep).

**Acceptance criteria**
- [ ] Criterion 1 — measurable and testable; written as a failing test would be.
- [ ] Criterion 2
- [ ] …

Each criterion must be verifiable by a test or an observable behaviour — not by
"it feels right" or "it looks good".

**Contracts and interfaces**
- Public API signatures, data shapes, event schemas, CLI commands — anything another
  component or person depends on.
- Breaking vs non-breaking: state explicitly which contracts are guaranteed stable.

**Edge cases and failure modes**
- List the cases that are not the happy path: empty inputs, concurrency, auth failure,
  rate-limit, timeout, malformed data.
- For each edge case, state the expected behaviour (error message, fallback, retry).

**Technical constraints**
- Runtime targets, performance budget, security requirements, model/token cost
  constraints if an LLM is involved.

### 3. Approval gate — no code before approval

Once the spec is drafted:

1. Share it with the relevant approver (CTO for architecture-touching changes; COO or
   CEO if the scope crosses department boundaries).
2. Wait for explicit approval: **approved** (with date and approver name) or **revise**
   (with specific conditions recorded in the spec).
3. Only after the spec status is updated to **Approved** does implementation begin.

If the approver is the same person writing the spec (solo context), the review step is
still required — a short self-review pass that explicitly checks each acceptance
criterion for testability and each edge case for completeness. Document the result.

### 4. Implementation — follow TDD

With an approved spec in hand:

1. Write the failing tests first (one test per acceptance criterion; edge-case tests
   for the edge cases listed in the spec).
2. Run the tests — confirm they fail for the right reason (the feature does not exist
   yet, not a setup error).
3. Implement the minimum code to make the tests pass.
4. Refactor — clean up without breaking tests.
5. Confirm all acceptance criteria are met by the passing test suite.

Do not merge code that has acceptance criteria without corresponding tests. "We'll add
tests later" converts an approved spec into a dead letter.

### 5. Document — spec + outcomes to the KB

After implementation:

1. Update the spec status to **Implemented** with the merge date and PR/commit ref.
2. Record any deviations from the original spec (scope changes, edge cases discovered
   late, contract adjustments) — these are future ADR material.
3. Ingest the final spec into the KB via `kb_ingest`:
   - Title: `SPEC — [Feature Name] — [Project] — v[N]`.
   - Tags: `spec`, `sdd`, `<department>`, `<component>`, `<project-slug>`.
   - Include: full spec + approval record + deviation notes.
4. If a new architecture pattern or significant decision was made during implementation,
   author an ADR in `docs/` and index it in the KB.

## Red flags

- "It's a small change — we don't need a spec." Every undocumented change is
  a future bug report or a future architectural debt. Run the spec step, keep it
  proportional (a small change gets a short spec), but do not skip it.
- "We'll write the spec after the code." Post-hoc specs are rationalisation, not
  engineering. They never capture the edge cases discovered during design.
- Acceptance criteria that are not testable ("the feature should work well", "it should
  be fast") — rewrite them until a failing test can be written from them.
- Merging code before the approval gate is confirmed — the approval step is not a
  formality, it is the gate.
- Skipping the KB lookup (Step 1) — re-authoring a spec that already exists wastes
  time and fragments the technical record.
