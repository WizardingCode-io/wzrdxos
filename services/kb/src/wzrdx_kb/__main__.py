"""Entry point / CLI for the wzrdxOS KB worker.

    wzrdx-kb info                      # stdlib-only worker info
    wzrdx-kb status                    # scope, chunk counts, graphify availability
    wzrdx-kb ingest <path> [--project] [--graph]
    wzrdx-kb search "<query>" [-k N]
    wzrdx-kb query "<question>"        # graphify graph traversal
    wzrdx-kb serve                     # start the unified wzrdx-kb MCP over stdio

`info` relies only on the standard library; the data commands lazily import the
vector/graph stack.
"""

from __future__ import annotations

import argparse
import json
import sys

from . import __version__


def _info() -> int:
    print(f"wzrdx-kb {__version__}")
    print("KB: Graphify (graph) + LanceDB (vectors) + Obsidian (fallback)")
    print("mcp server name: wzrdx-kb")
    return 0


def _status() -> int:
    from .service import KB

    print(json.dumps(KB().status(), indent=2))
    return 0


def _ingest(path: str, project: bool, build_graph: bool) -> int:
    from .service import KB

    result = KB().ingest_path(path, target="project" if project else "global", build_graph=build_graph)
    print(json.dumps(result, indent=2))
    return 0


def _search(query: str, k: int) -> int:
    from .service import KB

    hits = KB().search(query, k)
    for h in hits:
        print(f"[{h.score:.4f}] {h.source}\n  {h.text[:200].strip()}\n")
    if not hits:
        print("(no results)")
    return 0


def _query(question: str) -> int:
    from .service import KB

    res = KB().graph_query(question)
    print(res["output"] or ("ok" if res["ok"] else "no graph available"))
    return 0 if res["ok"] else 1


def _ask(question: str, k: int) -> int:
    from .service import KB

    res = KB().ask(question, k)
    print(json.dumps(res, indent=2))
    return 0


def _digest(since: str | None, advance: bool) -> int:
    from .service import KB

    res = KB().digest(since=since, advance=advance)
    print(json.dumps(res, indent=2))
    return 0


def _enrich(threshold: float, max_pairs: int, cross_source_only: bool) -> int:
    from .service import KB

    res = KB().enrich_report(
        threshold=threshold,
        max_pairs=max_pairs,
        cross_source_only=cross_source_only,
    )
    print(json.dumps(res, indent=2))
    return 0


def _serve() -> int:
    try:
        from .server import run
    except ImportError as exc:
        print(f"error: missing dependency ({exc}). Run `uv sync`.", file=sys.stderr)
        return 1
    return run()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="wzrdx-kb", description="wzrdxOS Knowledge Base worker.")
    parser.add_argument("--version", action="version", version=f"wzrdx-kb {__version__}")
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("info", help="print worker info (stdlib only)")
    sub.add_parser("status", help="scope, chunk counts, graphify availability")
    sub.add_parser("serve", help="start the unified wzrdx-kb MCP over stdio")

    p_ingest = sub.add_parser("ingest", help="ingest a file or directory")
    p_ingest.add_argument("path")
    p_ingest.add_argument("--project", action="store_true", help="ingest into the project overlay")
    p_ingest.add_argument("--graph", action="store_true", help="also build the graphify graph")

    p_search = sub.add_parser("search", help="semantic vector search")
    p_search.add_argument("query")
    p_search.add_argument("-k", type=int, default=8)

    p_query = sub.add_parser("query", help="graphify graph traversal query")
    p_query.add_argument("question")

    p_ask = sub.add_parser("ask", help="GraphRAG: fuse vector recall + graph traversal")
    p_ask.add_argument("question")
    p_ask.add_argument("-k", type=int, default=6)

    p_digest = sub.add_parser("digest", help="list chunks ingested since last digest")
    p_digest.add_argument("--since", default=None, help="ISO timestamp override")
    p_digest.add_argument(
        "--no-advance",
        dest="advance",
        action="store_false",
        default=True,
        help="do not advance the watermark",
    )

    p_enrich = sub.add_parser("enrich", help="near-duplicate analysis across KB")
    p_enrich.add_argument("--threshold", type=float, default=0.95)
    p_enrich.add_argument("--max-pairs", type=int, default=25)
    p_enrich.add_argument(
        "--include-same-source",
        dest="cross_source_only",
        action="store_false",
        default=True,
        help="include same-source pairs (useful for legacy duplicate cleanup)",
    )

    args = parser.parse_args(argv)

    if args.command == "serve":
        return _serve()
    if args.command == "status":
        return _status()
    if args.command == "ingest":
        return _ingest(args.path, args.project, args.graph)
    if args.command == "search":
        return _search(args.query, args.k)
    if args.command == "query":
        return _query(args.question)
    if args.command == "ask":
        return _ask(args.question, args.k)
    if args.command == "digest":
        return _digest(args.since, args.advance)
    if args.command == "enrich":
        return _enrich(args.threshold, args.max_pairs, args.cross_source_only)
    return _info()


if __name__ == "__main__":
    raise SystemExit(main())
