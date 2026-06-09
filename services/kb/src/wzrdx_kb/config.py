"""Paths and configuration for the wzrdxOS Knowledge Base.

Scope model (decided in docs/kb-design.md):
- Global KB at ``~/.wzrdx/kb`` — shared across all projects.
- Optional per-project overlay at ``<project>/.wzrdx/kb``.

Search fuses the global store with the project overlay when one exists.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

#: Default local embedding model (small, fast, cross-platform ONNX wheels).
DEFAULT_EMBED_MODEL = os.environ.get("WZRDX_EMBED_MODEL", "BAAI/bge-small-en-v1.5")


def global_kb_dir() -> Path:
    """Return the global KB directory (``~/.wzrdx/kb``), created if missing."""
    root = Path(os.environ.get("WZRDX_HOME", Path.home() / ".wzrdx")) / "kb"
    root.mkdir(parents=True, exist_ok=True)
    return root


def project_kb_dir(start: Path | None = None) -> Path | None:
    """Return the nearest project overlay KB (``<project>/.wzrdx/kb``), or None.

    Walks up from ``start`` (default: cwd) looking for a ``.wzrdx`` marker that is
    not the global home.
    """
    start = (start or Path.cwd()).resolve()
    home_wzrdx = (Path(os.environ.get("WZRDX_HOME", Path.home() / ".wzrdx"))).resolve()
    for d in [start, *start.parents]:
        marker = d / ".wzrdx"
        if marker.is_dir() and marker.resolve() != home_wzrdx:
            kb = marker / "kb"
            kb.mkdir(parents=True, exist_ok=True)
            return kb
    return None


@dataclass(frozen=True)
class KBScope:
    """The set of KB locations a query should consider."""

    global_dir: Path
    project_dir: Path | None

    @property
    def dirs(self) -> list[Path]:
        return [self.global_dir] + ([self.project_dir] if self.project_dir else [])


def resolve_scope(start: Path | None = None) -> KBScope:
    """Resolve global + (optional) project overlay for the current location."""
    return KBScope(global_dir=global_kb_dir(), project_dir=project_kb_dir(start))
