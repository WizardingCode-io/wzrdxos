# wzrdxOS Knowledge Base — design (M2)

> Status: design session in progress. Decisions below are locked unless marked **open**.

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

## Open items
- How tightly to wrap graphify: proxy its `graphify-mcp` under `wzrdx-kb`, or call the
  `graphify` CLI/library from `services/kb`. Leaning: `services/kb` drives graphify as a
  subprocess/library and adds the LanceDB layer, exposing one unified `wzrdx-kb` MCP.
- KB scope: shared across all projects vs per-project graphs (or both, with a global +
  per-project overlay).
