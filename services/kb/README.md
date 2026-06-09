# @wzrdx/kb

The wzrdxOS Knowledge Base worker — ingestion, embeddings, a vector index and RAG,
exposed to Claude Code as the `wzrdx-kb` MCP server.

**Status: M1 stub.** This package currently ships a placeholder MCP server with a
single `kb_status` tool, so the wiring can be verified end-to-end. The real stack
(embedding model, vector store, chunking, async ingestion of YouTube/articles/
files) is designed in **milestone M2**.

## Development

```bash
cd services/kb
uv sync
uv run wzrdx-kb --help
uv run wzrdx-kb info
uv run wzrdx-kb serve   # starts the stub MCP server over stdio
```

## Why a separate Python service

The TS core does orchestration and the registry well; Python owns the ML / RAG
surface (embeddings, vector search, transcription). The boundary is the MCP
protocol: `@wzrdx/core` is a client, `wzrdx-kb` is the server.
