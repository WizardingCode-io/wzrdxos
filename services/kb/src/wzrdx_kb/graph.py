"""Thin wrapper around the Graphify CLI (the knowledge-graph engine).

Graphify is installed separately as a `uv tool` (`uv tool install graphifyy`) and
exposes the `graphify` binary. We never import it as a library — we shell out.

Note on extraction: Graphify's *semantic* extraction needs an LLM — either Gemini
(`GEMINI_API_KEY`, headless/automatic mode) or Claude Code subagents (interactive/
manual mode). Structural (code) extraction is free and headless. The LanceDB vector
layer is independent of this and always works offline.
"""

from __future__ import annotations

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


@dataclass
class GraphResult:
    ok: bool
    output: str


def build(path: str, cwd: Path) -> GraphResult:
    """Best-effort headless graph build of ``path`` into ``cwd/graphify-out``.

    Returns ok=False with a message when graphify is missing or the headless build
    can't complete (e.g. semantic extraction needs Gemini and no key is set).
    """
    if not graphify_available():
        return GraphResult(False, "graphify CLI not installed (run `wzrdx setup`)")
    cwd.mkdir(parents=True, exist_ok=True)
    try:
        proc = subprocess.run(
            ["graphify", path, "--no-viz"],
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=600,
        )
        ok = proc.returncode == 0 and (cwd / "graphify-out" / "graph.json").exists()
        return GraphResult(ok, (proc.stdout or "") + (proc.stderr or ""))
    except subprocess.TimeoutExpired:
        return GraphResult(False, "graphify build timed out")
    except (subprocess.SubprocessError, OSError) as exc:
        return GraphResult(False, f"graphify build failed: {exc}")


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
