"""Digest + enrichment helpers for the wzrdxOS daily intelligence loop.

Phase A: watermark-based new-chunk tracking and near-duplicate detection.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

WATERMARK_FILE = "digest.json"


def now_iso() -> str:
    """Return the current UTC time as an ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Watermark helpers
# ---------------------------------------------------------------------------


def read_watermark(kb_dir: Path) -> str | None:
    """Return the last_run ISO timestamp from the watermark file, or None."""
    path = Path(kb_dir) / WATERMARK_FILE
    if not path.exists():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data.get("last_run") or None
    except (json.JSONDecodeError, OSError):
        return None


def write_watermark(kb_dir: Path, last_run: str, chunks_at_run: int) -> None:
    """Persist the digest watermark (last_run timestamp + chunk count snapshot)."""
    path = Path(kb_dir) / WATERMARK_FILE
    path.write_text(
        json.dumps({"last_run": last_run, "chunks_at_run": chunks_at_run}, indent=2),
        encoding="utf-8",
    )


# ---------------------------------------------------------------------------
# Near-duplicate analysis
# ---------------------------------------------------------------------------


def near_duplicates(
    rows: list[dict],
    threshold: float = 0.95,
    max_pairs: int = 25,
    cross_source_only: bool = True,
) -> list[dict]:
    """Pairwise cosine similarity over row vectors; return high-similarity pairs.

    Args:
        rows: dicts with keys ``id``, ``source``, ``vector`` (list[float]), and optionally ``text``.
        threshold: minimum cosine similarity to report (default 0.95).
        max_pairs: cap on returned pairs.
        cross_source_only: when True (default), same-source pairs are skipped.
            Set False to include same-source pairs — useful for legacy duplicate cleanup.

    Returns:
        List of dicts [{a_id, a_source, b_id, b_source, a_text_head, b_text_head, cosine}]
        sorted descending by cosine, capped at max_pairs.
    """
    import numpy as np  # available via fastembed/pyarrow transitive dep

    if len(rows) < 2:
        return []

    ids = [r["id"] for r in rows]
    sources = [r["source"] for r in rows]
    texts = [r.get("text", "") for r in rows]
    vectors = [r["vector"] for r in rows]

    mat = np.array(vectors, dtype=np.float32)

    # defensive normalisation — avoid division by zero for zero vectors
    norms = np.linalg.norm(mat, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1.0, norms)
    mat = mat / norms

    # full pairwise cosine via matmul; mat is already normalised
    sim = mat @ mat.T  # shape (n, n)

    n = len(rows)
    pairs: list[dict[str, Any]] = []
    for i in range(n):
        for j in range(i + 1, n):
            if cross_source_only and sources[i] == sources[j]:
                continue  # skip same-source pairs
            cos = float(sim[i, j])
            if cos >= threshold:
                pairs.append(
                    {
                        "a_id": ids[i],
                        "a_source": sources[i],
                        "b_id": ids[j],
                        "b_source": sources[j],
                        "a_text_head": texts[i][:120] if texts[i] else "",
                        "b_text_head": texts[j][:120] if texts[j] else "",
                        "cosine": round(cos, 6),
                    }
                )

    pairs.sort(key=lambda p: p["cosine"], reverse=True)
    return pairs[:max_pairs]
