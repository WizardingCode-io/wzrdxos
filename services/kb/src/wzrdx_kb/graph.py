"""Thin wrapper around the Graphify CLI (the knowledge-graph engine).

Graphify is installed separately as a `uv tool` (`uv tool install graphifyy`) and
exposes the `graphify` binary. We never import it as a library — we shell out.

Note on extraction: Graphify's *semantic* extraction needs an LLM — either Gemini
(`GEMINI_API_KEY`, headless/automatic mode) or Claude Code subagents (interactive/
manual mode). Structural (code) extraction is free and headless. The LanceDB vector
layer is independent of this and always works offline.
"""

from __future__ import annotations

import os
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path


def graphify_available() -> bool:
    return shutil.which("graphify") is not None


def graphify_version() -> str | None:
    if not graphify_available():
        return None
    try:
        out = subprocess.run(
            ["graphify", "--help"],
            capture_output=True,
            text=True,
            timeout=20,
        )
        return "installed" if out.returncode == 0 else None
    except (subprocess.SubprocessError, OSError):
        return None


def has_gemini() -> bool:
    """A Gemini/Google key enables headless full (AST + semantic) extraction."""
    return bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))


@dataclass
class GraphResult:
    ok: bool
    output: str
    mode: str = ""  # "extract" (full, LLM) | "update" (structural, no LLM)


def build(path: str, cwd: Path) -> GraphResult:
    """Headless graph build of ``path`` into ``cwd/graphify-out``.

    Picks the real graphify command by capability (graceful runtime rule):
    - ``graphify extract`` when a Gemini key is present — full AST + semantic LLM.
    - ``graphify update`` otherwise — structural (code) extraction, no LLM.

    Semantic extraction of docs without a key is done out-of-band by the Claude
    agent via the `/graphify` skill (manual mode) — see kb-design.md.
    """
    if not graphify_available():
        return GraphResult(False, "graphify CLI not installed (run `wzrdx setup`)")
    cwd.mkdir(parents=True, exist_ok=True)
    sub = "extract" if has_gemini() else "update"
    try:
        proc = subprocess.run(
            ["graphify", sub, path],
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=900,
        )
        output = (proc.stdout or "") + (proc.stderr or "")
        if proc.returncode != 0:
            return GraphResult(False, output, mode=sub)
        # graphify writes graphify-out next to the *source*; fold it into the KB graph.
        merged = _fold_into_kb(path, cwd)
        return GraphResult(merged.ok, output + merged.output, mode=sub)
    except subprocess.TimeoutExpired:
        return GraphResult(False, "graphify build timed out", mode=sub)
    except (subprocess.SubprocessError, OSError) as exc:
        return GraphResult(False, f"graphify build failed: {exc}", mode=sub)


def _fold_into_kb(source_path: str, kb_dir: Path) -> GraphResult:
    """Merge/copy the graph graphify produced (next to the source) into the KB dir.

    graphify writes ``<source>/graphify-out/graph.json``. We accumulate it into
    ``<kb_dir>/graphify-out/graph.json`` so a KB location holds one merged graph
    across all ingested sources.
    """
    src_root = Path(source_path) if Path(source_path).is_dir() else Path(source_path).parent
    produced = src_root / "graphify-out" / "graph.json"
    if not produced.exists():
        return GraphResult(False, "\n(graphify produced no graph.json)")

    kb_out = kb_dir / "graphify-out"
    kb_out.mkdir(parents=True, exist_ok=True)
    kb_graph = kb_out / "graph.json"

    if kb_graph.resolve() == produced.resolve():
        return GraphResult(True, "")
    if not kb_graph.exists():
        shutil.copy2(produced, kb_graph)
        return GraphResult(True, "\n(graph copied into KB)")
    # Merge the new graph into the existing KB graph.
    merge = subprocess.run(
        ["graphify", "merge-graphs", str(kb_graph), str(produced), "--out", str(kb_graph)],
        capture_output=True,
        text=True,
        timeout=120,
    )
    if merge.returncode != 0 or not kb_graph.exists():
        # Fall back to overwrite so the latest source is at least queryable.
        shutil.copy2(produced, kb_graph)
        return GraphResult(True, "\n(merge failed; overwrote KB graph)")
    return GraphResult(True, "\n(graph merged into KB)")


def query(question: str, cwd: Path) -> GraphResult:
    """Run a graph traversal query against an existing graph in ``cwd``."""
    if not graphify_available():
        return GraphResult(False, "graphify CLI not installed (run `wzrdx setup`)")
    if not (cwd / "graphify-out" / "graph.json").exists():
        return GraphResult(False, "no graph built yet for this location")
    try:
        proc = subprocess.run(
            ["graphify", "query", question],
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=120,
        )
        return GraphResult(proc.returncode == 0, (proc.stdout or "") + (proc.stderr or ""))
    except subprocess.TimeoutExpired:
        return GraphResult(False, "graphify query timed out")
    except (subprocess.SubprocessError, OSError) as exc:
        return GraphResult(False, f"graphify query failed: {exc}")
