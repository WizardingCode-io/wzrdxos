"""LanceDB-backed vector store for KB chunks.

One embedded LanceDB database per KB location (global or project overlay), each with
a single ``chunks`` table. Cross-platform, single-directory, no server.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

TABLE = "chunks"


@dataclass
class SearchHit:
    text: str
    source: str
    score: float  # higher = closer (1 - distance)


class VectorStore:
    """A LanceDB database holding the ``chunks`` table for one KB location."""

    def __init__(self, directory: Path, dim: int) -> None:
        self.directory = Path(directory)
        self.dim = dim
        self.directory.mkdir(parents=True, exist_ok=True)

    def _db(self):  # type: ignore[no-untyped-def]
        import lancedb

        return lancedb.connect(str(self.directory / "lance.db"))

    def _table(self, db):  # type: ignore[no-untyped-def]
        import pyarrow as pa

        if TABLE in db.table_names():
            return db.open_table(TABLE)
        schema = pa.schema(
            [
                pa.field("id", pa.string()),
                pa.field("text", pa.string()),
                pa.field("source", pa.string()),
                pa.field("vector", pa.list_(pa.float32(), self.dim)),
            ]
        )
        return db.create_table(TABLE, schema=schema)

    def add(self, rows: list[dict]) -> int:
        """Insert rows: each dict needs id, text, source, vector."""
        if not rows:
            return 0
        db = self._db()
        self._table(db).add(rows)
        return len(rows)

    def search(self, vector: list[float], k: int = 8) -> list[SearchHit]:
        db = self._db()
        if TABLE not in db.table_names():
            return []
        results = self._table(db).search(vector).limit(k).to_list()
        hits: list[SearchHit] = []
        for r in results:
            distance = float(r.get("_distance", 0.0))
            hits.append(
                SearchHit(
                    text=r.get("text", ""),
                    source=r.get("source", ""),
                    score=round(1.0 / (1.0 + distance), 4),
                )
            )
        return hits

    def count(self) -> int:
        db = self._db()
        if TABLE not in db.table_names():
            return 0
        return self._table(db).count_rows()
