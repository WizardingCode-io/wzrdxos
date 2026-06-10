"""Ingestion: chunk text, embed locally, store in LanceDB (the vector layer).

The Graphify graph build is orchestrated separately (graph.py); this module owns the
vector side, which is fully offline and independent of the extraction backend.
"""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from pathlib import Path

from .embed import Embedder
from .store import VectorStore

TEXT_SUFFIXES = {".md", ".markdown", ".txt", ".rst", ".text"}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def chunk_text(text: str, max_chars: int = 1200, overlap: int = 150) -> list[str]:
    """Split text into overlapping character windows on paragraph boundaries."""
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    buf = ""
    for para in paragraphs:
        if len(buf) + len(para) + 2 <= max_chars:
            buf = f"{buf}\n\n{para}" if buf else para
            continue
        if buf:
            chunks.append(buf)
        if len(para) <= max_chars:
            buf = para
        else:  # paragraph longer than the window — hard-split with overlap
            for i in range(0, len(para), max_chars - overlap):
                chunks.append(para[i : i + max_chars])
            buf = ""
    if buf:
        chunks.append(buf)
    return chunks


def _row_id(source: str, idx: int, text: str) -> str:
    digest = hashlib.sha1(f"{source}:{idx}:{text}".encode()).hexdigest()[:16]
    return f"{digest}"


def ingest_text(
    text: str,
    source: str,
    store: VectorStore,
    embedder: Embedder,
) -> int:
    """Chunk, embed and store a blob of text. Returns the number of chunks stored."""
    chunks = chunk_text(text)
    if not chunks:
        return 0
    vectors = embedder.embed(chunks)
    now = _now_iso()
    rows = [
        {"id": _row_id(source, i, c), "text": c, "source": source, "vector": v, "added_at": now}
        for i, (c, v) in enumerate(zip(chunks, vectors))
    ]
    return store.add(rows)


def ingest_path(
    path: Path,
    store: VectorStore,
    embedder: Embedder,
) -> tuple[int, int]:
    """Ingest a file or a directory of text files. Returns (files, chunks)."""
    path = Path(path)
    files = [path] if path.is_file() else [
        p for p in path.rglob("*") if p.is_file() and p.suffix.lower() in TEXT_SUFFIXES
    ]
    total_chunks = 0
    ingested = 0
    for f in files:
        try:
            text = f.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        added = ingest_text(text, source=str(f), store=store, embedder=embedder)
        if added:
            ingested += 1
            total_chunks += added
    return ingested, total_chunks
