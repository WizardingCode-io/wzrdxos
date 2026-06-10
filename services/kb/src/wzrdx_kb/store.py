"""LanceDB-backed vector store for KB chunks.

One embedded LanceDB database per KB location (global or project overlay), each with
a single ``chunks`` table. Cross-platform, single-directory, no server.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

TABLE = "chunks"
ISO_EPOCH = "1970-01-01T00:00:00+00:00"


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
            tbl = db.open_table(TABLE)
            # idempotent migration: add added_at column if absent
            if "added_at" not in tbl.schema.names:
                tbl.add_columns({"added_at": f"'{ISO_EPOCH}'"})
            return tbl
        schema = pa.schema(
            [
                pa.field("id", pa.string()),
                pa.field("text", pa.string()),
                pa.field("source", pa.string()),
                pa.field("vector", pa.list_(pa.float32(), self.dim)),
                pa.field("added_at", pa.string()),
            ]
        )
        return db.create_table(TABLE, schema=schema)

    def add(self, rows: list[dict]) -> int:
        """Upsert rows (keyed on id): each dict needs id, text, source, vector, added_at.

        Returns the number of NEWLY inserted rows (0 when all are duplicates).
        """
        if not rows:
            return 0
        db = self._db()
        res = self._table(db).merge_insert("id").when_not_matched_insert_all().execute(rows)
        return res.num_inserted_rows

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

    def new_since(self, since: str, cap: int = 200) -> list[dict]:
        """Rows with added_at > since (ISO string compare): oldest-first, capped.

        Args:
            since: ISO-8601 timestamp. Raises ValueError if not valid ISO-8601.
            cap: maximum rows to return.

        Returns list of dicts with keys: id, text, source, added_at.
        """
        try:
            datetime.fromisoformat(since)
        except ValueError:
            raise ValueError("since must be ISO-8601")
        db = self._db()
        if TABLE not in db.table_names():
            return []
        tbl = self._table(db)
        rows = (
            tbl.search()
            .where(f"added_at > '{since}'")
            .limit(cap)
            .select(["id", "text", "source", "added_at"])
            .to_list()
        )
        # sort oldest-first by added_at string (ISO format is lexicographically sortable)
        rows.sort(key=lambda r: r.get("added_at", ""))
        return rows

    def vectors(self, cap: int = 2000) -> list[dict]:
        """Capped scan returning [{id, source, vector}] for similarity analysis."""
        db = self._db()
        if TABLE not in db.table_names():
            return []
        tbl = self._table(db)
        rows = (
            tbl.search()
            .limit(cap)
            .select(["id", "source", "vector"])
            .to_list()
        )
        return rows
