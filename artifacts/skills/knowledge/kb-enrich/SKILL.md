---
name: knowledge:kb-enrich
description: Run a near-duplicate and contradiction review over the KB vector store, classify each pair, write a verdict memo with citations, ingest it, and route contradictions to the owning department.
type: process
department: knowledge
when-to-use: Enrichment or dream-cycle run, duplicate/contradiction review, weekly KB hygiene, "limpar a KB", "verificar duplicados", or when first-run cleanup of pre-upsert legacy chunks is needed.
---

# KB Enrich

Rigid process skill — follow every step in order. This is the wzrdxOS "dream cycle":
a gbrain-inspired enrichment pass that surfaces near-duplicates and contradictions for
agent review. The agent classifies and routes; it never deletes automatically.

MCP tool used: `kb_enrich_report`, `kb_ingest`.
CLI equivalent: `wzrdx-kb enrich`.

## Steps

### 1. Run the enrichment report

Call `kb_enrich_report(threshold=0.95, max_pairs=25)`.

Record the response fields:
- `pairs` — list of high-similarity chunk pairs.
- `rows_scanned` — total vectors examined.
- `scopes` — which KB scopes were included (global, project).
- `threshold` — confirm it matches 0.95.

If `pairs` is empty: the KB is clean above the threshold. Write a brief
"enrich run: 0 pairs above 0.95 across <rows_scanned> chunks" note, ingest it as
`enrichment/YYYY-MM-DD.md`, and stop.

### 2. Read both sides of each pair

For each pair in `pairs`, read the full text of both chunks:
- Use `a_text_head` and `b_text_head` as previews.
- Call `kb_search` or `kb_ask` to retrieve the full chunk text when needed for
  accurate classification. Never classify from the 120-char head alone.

Note `a_source`, `b_source`, and `cosine` for every pair.

### 3. Classify each pair

Apply one of three classifications:

**Exact duplicate** (cosine ≈ 1.0, same or different source, text is identical or
near-identical):
- If `a_source == b_source`: **pre-upsert legacy duplicate** — these are chunks
  ingested before the upsert migration that created the idempotent merge-insert.
  List the pair ids for one-time manual cleanup (see first-run note below).
- If `a_source != b_source`: same content appeared in two different source files.
  Flag for source consolidation; do not auto-delete.

**Contradiction** (cosine ≥ 0.95, high similarity, but the claims are incompatible
— e.g. conflicting facts, opposing recommendations, different version assumptions):
- Flag as contradiction.
- Identify the owning department (based on the subject matter and the source prefix).
- Route to that dept head for resolution.

**Fine** (cosine ≥ 0.95 but the pair is related-but-distinct — complementary
perspectives, same topic different depth, same framework different application):
- Mark as fine.
- No action required. Note that they are intentionally distinct.

### 4. First-run note (if applicable)

If any pairs have cosine ≈ 1.0 and `a_source == b_source`, this is likely the
pre-upsert legacy duplicate population — chunks that existed in LanceDB before the
idempotent upsert (merge_insert by source+hash) was introduced. Document:
- The pair ids.
- The source.
- The recommendation: one-time manual cleanup via `lancedb` table delete by id,
  after human verification.

This cleanup is a one-time event. Subsequent ingestion is idempotent (re-ingest is
a no-op; the merge_insert deduplications at write time).

### 5. Write the verdict memo

Structure:

```
# KB Enrichment Verdict — YYYY-MM-DD

**Rows scanned:** <N>
**Pairs above 0.95:** <M>
**Threshold:** 0.95

## Exact duplicates (<count>)

### [pre-upsert legacy] <a_id> ↔ <b_id>  cosine=<X>
Source: <a_source>
Recommendation: manual cleanup (list ids).

...

## Contradictions (<count>)

### <a_id> ↔ <b_id>  cosine=<X>
Sources: <a_source> ↔ <b_source>
Claim A: "..." [source: <a_source>]
Claim B: "..." [source: <b_source>]
Conflict: <describe the incompatibility>
Route to: <dept head> — reason.

...

## Fine — related but distinct (<count>)

### <a_id> ↔ <b_id>  cosine=<X>
Sources: <a_source> ↔ <b_source>
Assessment: <why they are intentionally distinct>.

...

## Summary

- Exact duplicates: <N> pairs (<M> pre-upsert legacy, <K> cross-source)
- Contradictions: <N> pairs — routed to <dept heads>
- Fine: <N> pairs
- Action items: <list>
```

**Citation rule:** every claim about a chunk must cite `[source: <path>]`. Never
assert a contradiction without quoting both sides.

### 6. Ingest the verdict memo

Call `kb_ingest` with:
- `source` — `enrichment/YYYY-MM-DD.md` (ISO date of the run).
- `target` — `global`.

### 7. Route contradictions

For each contradiction pair, deliver a routing note to the relevant dept head:
- Name the dept head, the conflicting claims, and the sources.
- Ask them to resolve: which claim is correct, or do both apply in different contexts?
- After resolution, the correct version should be re-ingested and the other flagged
  for manual cleanup.

## Red flags

- **Deleting data automatically.** Never. The agent reports; the human decides.
  Auto-deletion of KB data is forbidden regardless of the cosine score.
- **Judging pairs without reading both texts.** The 120-char preview is not enough
  for classification. Always retrieve the full text before assigning a verdict.
- **Classifying from cosine alone.** High similarity ≠ contradiction and high
  similarity ≠ duplicate. Read the content.
- **Skipping the ingest of the verdict memo.** The enrichment cycle is only
  complete when the verdict is documented back into the KB. The enrichment loop
  enriches itself.
- **Routing without a specific dept head.** "Someone should look at this" is not
  routing. Name the dept head, the claim, and why.
