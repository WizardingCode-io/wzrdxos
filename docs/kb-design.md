# wzrdxOS Knowledge Base — design (M2)

> Status: **implemented** (M2 slices 1–3). All decisions below are locked.
>
> Real graphify commands used by the worker: `graphify update <path>` (structural,
> headless, no LLM — manual mode) / `graphify extract <path>` (full AST + semantic LLM —
> automatic mode, Gemini), `graphify query` (traversal), `graphify merge-graphs` (fold a
> source graph into the KB graph). graphify writes `graphify-out/` next to the source; the
> worker folds it into the KB location's graph.

The KB is wzrdxOS's biggest differentiator and was the #1 pain point in ArkaOS. It is a
three-layer stack unified behind a single MCP server.

## The stack

```
                ┌──────────────────────────────────────────────┐
   ingest  ───▶ │  Graphify (graphifylabs.ai, pip `graphifyy`)  │   PRIMARY
   (urls, files,│  knowledge graph · communities · god nodes ·  │   "feed all
    video, code)│  graph.json (GraphRAG) · graph query (BFS/DFS)│    knowledge here"
                └───────────────┬──────────────────────────────┘
                                │ nodes + source chunks
                                ▼
                ┌──────────────────────────────────────────────┐
                │  LanceDB (embedded vector DB)                 │   VECTOR LAYER
                │  dense semantic search over chunks/nodes      │   the "parrudo" one
                └───────────────┬──────────────────────────────┘
                                │
                                ▼
                ┌──────────────────────────────────────────────┐
                │  Obsidian vault (Markdown)                    │   FALLBACK
                │  human-readable mirror; graphify can emit it  │   of the other two
                └──────────────────────────────────────────────┘

   all three unified by  services/kb (Python)  →  exposed to Claude Code as MCP `wzrdx-kb`
```

- **Graphify = primary.** Every source is fed into Graphify, producing the relational
  backbone: a persistent knowledge graph with community detection, god nodes, an honest
  EXTRACTED/INFERRED audit trail, and a GraphRAG-ready `graph.json`. Graph queries
  (`graphify query`, `path`, `explain`) answer relational/structural questions.
- **LanceDB = vector layer.** Chunks (and node text) are embedded into LanceDB for dense
  similarity search — this is the GraphRAG complement: graph for structure, vectors for
  "what's semantically near this". Embedded, single-file, cross-platform.
- **Obsidian = fallback.** A Markdown vault (graphify can emit one) is the portable,
  human-readable mirror and the retrieval fallback when graph/vector layers are
  unavailable or insufficient.

## Retrieval (hybrid, GraphRAG)

`wzrdx-kb` exposes unified tools to Claude Code:

1. `kb_search(query)` — hybrid: LanceDB vector recall + Graphify graph expansion, fused.
2. `kb_query(question)` — Graphify graph traversal (relational questions).
3. `kb_explain(node)` / `kb_path(a, b)` — Graphify explain / shortest-path.
4. Fallback: if the graph/vector index is missing, grep the Obsidian vault.

## Ingestion

Sources (all via Graphify's own ingestion + an embedding pass into LanceDB):

- Articles / URLs (`graphify add <url>`), local files/docs, code/repos, video/audio
  (Whisper transcription inside Graphify).

**Extraction backend (decided):** `wzrdx setup` asks the user to pick the ingestion mode:

- **Manual / interactive** — semantic extraction runs via Claude Code subagents. No key,
  no extra cost; only works while the user is inside a Claude Code session.
- **Automatic / unattended** — for background/scheduled ingestion (watchers, cron). The
  setup **prompts for `GEMINI_API_KEY`** and stores it; Graphify then extracts headlessly
  via Gemini.

The choice is persisted in `.wzrdx/config.json` (`kb.mode = "manual" | "automatic"`).
Runtime rule stays graceful: if mode is automatic and a key is present, use Gemini;
otherwise fall back to subagents.

**Embeddings:** local by default (fastembed / sentence-transformers — private, free,
offline, cross-platform), optional cloud API for max quality.

## Mandatory: cross-platform auto-install (NON-NEGOTIABLE)

`wzrdx setup` and `wzrdx update` MUST install the **entire** KB stack automatically, with
zero manual steps, on **macOS, Linux and Windows**:

- graphify: `uv tool install graphifyy` (provides `graphify` + `graphify-mcp`).
- `services/kb` worker + LanceDB + embedding models: `uv sync` in the service.
- MCP registration: write the `wzrdx-kb` (and graphify) MCP server entry into the
  Claude Code config.

Implementation rule: the **Node CLI (`wzrdx`)** is the cross-platform orchestrator (Node
runs on all three OSes); it drives **uv** (also cross-platform) for every Python install.
Bootstrap `uv` if absent (astral install script on Mac/Linux; PowerShell on Windows).
**Never assume bash in the installed-product path.** `wzrdx doctor` verifies every piece
is present and repairs/reinstalls what is missing.

## Decided (was open)
- **Graphify wrapping:** `services/kb` drives `graphify` as a subprocess/library and adds
  the LanceDB layer, exposing **one unified `wzrdx-kb` MCP**. The raw `graphify-mcp` is
  not exposed separately.
- **KB scope:** **global graph (shared across all projects) + optional per-project
  overlay.** Search fuses the global graph with the current project's local graph when
  one exists.

## Scope resolution

- Global KB lives at `~/.wzrdx/kb/` (LanceDB table + graphify graph).
- A project may have a local overlay at `<project>/.wzrdx/kb/`.
- `kb_search` / `kb_query` query the global store, and the project overlay too when the
  caller is inside a project that has one; results are merged.

## Daily intelligence loop

The daily-intelligence loop closes the KB lifecycle: ingest → synthesize → document →
enrich. It is the operational form of Constitution rules 4-6 and is owned by the CKO.

### added_at column + idempotent migration

Every chunk stored in LanceDB carries an `added_at` ISO timestamp (UTC). The migration
is idempotent: rows inserted before the column existed receive the epoch sentinel
(`1970-01-01T00:00:00+00:00` — `ISO_EPOCH` in `store.py`). Legacy rows are therefore
always older than any real watermark and will appear in the first digest run; subsequent
runs are clean.

### Idempotent upsert (merge_insert)

Ingestion uses LanceDB's `merge_insert` keyed on `id` = sha1(source:idx:text). Re-ingesting
the same file is a no-op: the row is updated in place, `added_at` is preserved.
Pre-existing duplicate chunks (ingested before upsert was introduced) are flagged by
the first `kb-enrich` run (cosine ≈ 1.0, same source) and listed for one-time manual
cleanup. The upsert prevents new duplicates from forming.

### Watermark file

`<kb_dir>/digest.json` holds:
```json
{ "last_run": "<ISO timestamp>", "chunks_at_run": <N> }
```
The watermark advances **only after the digest memo has been ingested successfully**.
The `kb_digest(advance=false)` call retrieves chunks without moving the pointer;
`kb_digest(advance=true)` is called only in the final step of `knowledge:daily-digest`.
A no-op run (0 new chunks) never advances the watermark.

### MCP tools + CLI

| Tool | Purpose |
|------|---------|
| `kb_digest(since, cap, advance)` | List new chunks since watermark; optionally advance. |
| `kb_enrich_report(threshold, max_pairs)` | Pairwise cosine over all vectors; return near-duplicate/contradiction pairs. |
| `wzrdx-kb digest` | CLI equivalent of `kb_digest` (advance=true after memo). |
| `wzrdx-kb enrich` | CLI equivalent of `kb_enrich_report`. |

### Source-prefix page-typing convention

Every memo ingested by the loop uses a source path that signals its type to the
retrieval layer:
- `digests/YYYY-MM-DD.md` — daily digest memos.
- `memos/YYYY-MM-DD-<slug>.md` — decisions, meeting notes, strategic memos.
- `enrichment/YYYY-MM-DD.md` — enrichment verdict memos.

Raw sources (vault notes, ingested files, URLs) retain their natural paths. Queries
can filter by prefix to distinguish loop-generated content from source material.

### Skills drive the loop — no daemon

The loop fires on a lazy trigger: the `knowledge:daily-digest` skill checks whether
the watermark is older than 24h before running. There is no background daemon or
watcher process (Constitution doctrine: no blocking hooks, no daemons).

The `schedule` skill can automate the cadence when a cloud-reachable KB endpoint
exists. Until then, the lazy trigger (user-initiated or local cron calling
`wzrdx-kb digest`) is the recommended approach.

### Inspired by gbrain (MIT)

The digest/enrich/citation/source-prefix architecture is inspired by gbrain
(https://github.com/garrytan/gbrain, MIT). Concepts are replicated natively using
the existing Graphify + LanceDB stack. gbrain itself is not installed — it would
introduce a second store/retrieval stack (Bun + Postgres) with no retrieval advantage
given the wzrdx-kb MCP already covers the same surface.
