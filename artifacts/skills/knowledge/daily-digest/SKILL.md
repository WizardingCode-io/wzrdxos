---
name: knowledge:daily-digest
description: Synthesize everything new in the KB since the last watermark into a cited memo, run gap analysis against org.md Known gaps, ingest the memo, and route highlights to dept heads.
type: process
department: knowledge
when-to-use: Daily digest run, "o que há de novo na KB", watermark older than 24h, start-of-day knowledge review, or when the user asks what was recently ingested into the knowledge base.
---

# Daily Digest

Rigid process skill — follow every step in order without skipping. This skill drives
the daily-intelligence loop: what entered the KB, synthesized with citations, gapped
against the org's Known gaps, documented back, and routed to those who need it.

MCP tools used: `kb_status`, `kb_digest`, `kb_ingest`.
CLI equivalent: `wzrdx-kb digest`.

## Steps

### 1. Status and retrieval

Call `kb_status` first. Record the chunk counts and graphify availability.

Call `kb_digest()` with:
- `since` — omit (use the stored watermark) unless the user specifies an explicit
  ISO timestamp override.
- `cap` — 200 (default).
- `advance` — **false** at this point. Do not advance the watermark yet; the memo
  has not been produced. Set to true only in step 4, after the memo is ready to
  ingest.

If `stats.new` is 0: record a "no-op" note (e.g. "digest run: 0 new chunks since
`<watermark>`"), stop here. Do not advance the watermark for a no-op run.

### 2. Read the chunks

Read every chunk returned in `new_chunks`. For each, note:
- `source` — the source path or URL.
- `text` — the chunk content (may be truncated to 120 chars in the response; use
  `kb_search` or `kb_ask` to retrieve the full text of a chunk if needed).
- `added_at` — ingestion timestamp.
- `scope` — global or project.

Group chunks by **source-prefix type**:
- `digests/` — prior digest memos (the loop is aware of itself).
- `memos/` — decisions, meeting notes, strategic memos.
- `enrichment/` — prior enrichment verdicts.
- Everything else — raw sources (vault notes, ingested files, URLs).

### 3. Synthesize the digest memo

Write the memo in the following structure:

```
# KB Digest — YYYY-MM-DD

**Period:** <since> → <watermark>
**New chunks:** <N> across <M> sources

## By source type

### digests/ (N chunks)
...

### memos/ (N chunks)
...

### enrichment/ (N chunks)
...

### raw sources (N chunks)
...

## Key insights

- <claim> [source: <source-path>]
- <claim> [source: <source-path>]
...

## Gap analysis

Compare what arrived against the Known gaps in docs/org.md §§1-8.
Name each known gap and whether the new chunks address it (partially or fully)
or whether the gap remains open. Be explicit: "Gap: <X> — still open / partially
closed by [source]."

## Routing

For each key insight, name which dept head should act on it and why:
- COO: <insight> — operational relevance.
- CTO: <insight> — technical relevance.
- CFO / CHRO / CMO / CRO: as applicable.
```

**Citation rule:** every claim must cite `[source: <source-path>]`. Never assert
without grounding in a retrieved chunk. An uncited claim is a red flag.

**Gap analysis rule:** check every Known gaps list in org.md §§1-8. Address each
explicitly — do not summarize them away.

### 4. Ingest the memo

Call `kb_ingest` with:
- `path` — the memo written to a temp file or inline text via `kb_ingest` text mode.
- `source` — `digests/YYYY-MM-DD.md` (ISO date of the run).
- `target` — `global`.

Only after `kb_ingest` confirms success, call `kb_digest(advance=true)` with the
same `since` timestamp to advance the watermark. If ingestion fails, do not advance.

### 5. Route highlights

Deliver the routing section to the relevant dept heads directly in the conversation
output. Name the dept head, the insight, and why it is relevant to their department.
This is not automated — it is a synthesis judgment call by the agent.

## Red flags

- **Digest without citations.** Every claim must cite a source chunk. If you cannot
  cite it, do not assert it.
- **Advancing the watermark before ingesting the memo.** The watermark must only
  advance once the memo is durably stored. Reversing the order corrupts the loop.
- **Running the synthesis in the worker.** LLM synthesis belongs to the agent, not
  to the MCP service. The MCP returns raw chunks; the agent writes the memo.
- **Skipping the gap analysis.** The gap analysis is not optional — it is what makes
  the digest actionable for the OS.
- **No-op with advance=true.** When there are 0 new chunks, do not advance the
  watermark. The loop should retry next time.
