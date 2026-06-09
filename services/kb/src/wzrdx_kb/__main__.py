"""Entry point for the wzrdxOS KB worker.

Usage:
    wzrdx-kb --help
    wzrdx-kb info
    wzrdx-kb serve        # start the (stub) MCP server over stdio

`info` and `--help` rely only on the standard library, so they work before the
optional `mcp` dependency is installed. `serve` lazily imports `mcp`.
"""

from __future__ import annotations

import argparse
import sys

from . import __version__


def _info() -> int:
    print(f"wzrdx-kb {__version__}")
    print("status: stub (M1). Real ingestion/RAG lands in M2.")
    print("mcp server name: wzrdx-kb")
    return 0


def _serve() -> int:
    """Start the placeholder MCP server.

    The stub exposes a single `kb_status` tool so Claude Code can connect and
    confirm the wiring end-to-end. Real search/ingest tools arrive in M2.
    """
    try:
        from mcp.server.fastmcp import FastMCP
    except ImportError:
        print(
            "error: the 'mcp' package is not installed. Run `uv sync` first.",
            file=sys.stderr,
        )
        return 1

    server = FastMCP("wzrdx-kb")

    @server.tool()
    def kb_status() -> str:
        """Return the KB worker status (stub)."""
        return f"wzrdx-kb {__version__} — stub. Ingestion/RAG arrives in M2."

    server.run()
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="wzrdx-kb",
        description="wzrdxOS Knowledge Base worker (M1 stub).",
    )
    parser.add_argument("--version", action="version", version=f"wzrdx-kb {__version__}")
    sub = parser.add_subparsers(dest="command")
    sub.add_parser("info", help="print worker info")
    sub.add_parser("serve", help="start the stub MCP server over stdio")

    args = parser.parse_args(argv)

    if args.command == "serve":
        return _serve()
    # default and `info` both print info
    return _info()


if __name__ == "__main__":
    raise SystemExit(main())
