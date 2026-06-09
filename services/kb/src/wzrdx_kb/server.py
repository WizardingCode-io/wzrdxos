"""The unified ``wzrdx-kb`` MCP server.

Exposes the whole KB (Graphify graph + LanceDB vectors, global + project overlay)
to Claude Code behind one MCP. The raw graphify-mcp is intentionally not exposed.
"""

from __future__ import annotations

from . import __version__
from .service import KB


def build_server():  # type: ignore[no-untyped-def]
    from mcp.server.fastmcp import FastMCP

    server = FastMCP("wzrdx-kb")
    kb = KB()

    @server.tool()
    def kb_status() -> dict:
        """Report KB status: embedding model, graphify availability, and per-scope chunk/graph counts."""
        return {"version": __version__, **kb.status()}

    @server.tool()
    def kb_ingest(path: str, target: str = "global", build_graph: bool = False) -> dict:
        """Ingest a file or directory of text into the vector layer (and optionally build the graph).

        target: "global" (default) or "project" overlay. build_graph: also run graphify.
        """
        return kb.ingest_path(path, target=target, build_graph=build_graph)

    @server.tool()
    def kb_search(query: str, k: int = 8) -> list[dict]:
        """Semantic vector search across the global KB and the project overlay. Returns ranked chunks."""
        return [{"text": h.text, "source": h.source, "score": h.score} for h in kb.search(query, k)]

    @server.tool()
    def kb_query(question: str) -> dict:
        """Relational graph query (Graphify traversal) over the built knowledge graph."""
        return kb.graph_query(question)

    @server.tool()
    def kb_ask(question: str, k: int = 6) -> dict:
        """GraphRAG: fuse dense vector recall (chunks) with Graphify graph traversal (graph)."""
        return kb.ask(question, k)

    return server


def run() -> int:
    build_server().run()
    return 0
