"""Tests for VectorStore: upsert idempotence, legacy migration, new_since."""

from __future__ import annotations

import lancedb
import pyarrow as pa

from wzrdx_kb.store import ISO_EPOCH, TABLE, VectorStore


def _make_rows(n: int = 3, added_at: str = "2025-01-01T00:00:00+00:00") -> list[dict]:
    return [
        {
            "id": f"id-{i}",
            "text": f"chunk {i}",
            "source": f"file{i}.md",
            "vector": [float(i), float(i + 1), float(i + 2), float(i + 3)],
            "added_at": added_at,
        }
        for i in range(n)
    ]


class TestUpsertIdempotence:
    def test_first_add_returns_n(self, tmp_path):
        store = VectorStore(tmp_path, dim=4)
        rows = _make_rows(3)
        count = store.add(rows)
        assert count == 3

    def test_second_add_returns_zero(self, tmp_path):
        store = VectorStore(tmp_path, dim=4)
        rows = _make_rows(3)
        store.add(rows)
        count2 = store.add(rows)
        assert count2 == 0

    def test_total_count_unchanged_after_duplicate(self, tmp_path):
        store = VectorStore(tmp_path, dim=4)
        rows = _make_rows(3)
        store.add(rows)
        store.add(rows)
        assert store.count() == 3

    def test_partial_new_rows(self, tmp_path):
        store = VectorStore(tmp_path, dim=4)
        rows = _make_rows(3)
        store.add(rows)
        # add 2 existing + 1 new
        new_row = {
            "id": "id-new",
            "text": "new chunk",
            "source": "new.md",
            "vector": [9.0, 8.0, 7.0, 6.0],
            "added_at": "2025-06-01T00:00:00+00:00",
        }
        count3 = store.add(rows[:2] + [new_row])
        assert count3 == 1
        assert store.count() == 4


class TestLegacyMigration:
    def test_opens_table_without_added_at_and_adds_column(self, tmp_path):
        """Simulate a legacy table created without added_at; reopening via VectorStore should migrate it."""
        # create legacy table directly via lancedb (no added_at)
        db = lancedb.connect(str(tmp_path / "lance.db"))
        schema = pa.schema(
            [
                pa.field("id", pa.string()),
                pa.field("text", pa.string()),
                pa.field("source", pa.string()),
                pa.field("vector", pa.list_(pa.float32(), 4)),
            ]
        )
        tbl = db.create_table(TABLE, schema=schema)
        tbl.add(
            [{"id": "leg-1", "text": "legacy", "source": "old.md", "vector": [1.0, 2.0, 3.0, 4.0]}]
        )
        assert "added_at" not in tbl.schema.names

        # reopen via VectorStore — should trigger migration
        store = VectorStore(tmp_path, dim=4)
        # trigger _table() by calling count()
        assert store.count() == 1

        # verify column exists with epoch value
        db2 = lancedb.connect(str(tmp_path / "lance.db"))
        tbl2 = db2.open_table(TABLE)
        assert "added_at" in tbl2.schema.names
        rows = tbl2.search().limit(10).to_list()
        assert all(r["added_at"] == ISO_EPOCH for r in rows)


class TestNewSince:
    def test_empty_store_returns_empty(self, tmp_path):
        store = VectorStore(tmp_path, dim=4)
        assert store.new_since(ISO_EPOCH) == []

    def test_returns_rows_after_boundary(self, tmp_path):
        store = VectorStore(tmp_path, dim=4)
        before = "2024-01-01T00:00:00+00:00"
        after = "2025-06-01T00:00:00+00:00"
        rows_old = _make_rows(2, added_at=before)
        rows_new = _make_rows(2, added_at=after)
        # give new rows different ids so they don't clash
        for i, r in enumerate(rows_new):
            r["id"] = f"new-{i}"
        store.add(rows_old)
        store.add(rows_new)

        since = "2025-01-01T00:00:00+00:00"
        result = store.new_since(since)
        ids = {r["id"] for r in result}
        assert ids == {"new-0", "new-1"}

    def test_boundary_is_exclusive(self, tmp_path):
        """Rows with added_at == since should NOT be returned."""
        store = VectorStore(tmp_path, dim=4)
        ts = "2025-06-01T00:00:00+00:00"
        rows = _make_rows(2, added_at=ts)
        store.add(rows)
        result = store.new_since(ts)
        assert result == []

    def test_sorted_oldest_first(self, tmp_path):
        store = VectorStore(tmp_path, dim=4)
        ts_a = "2025-03-01T00:00:00+00:00"
        ts_b = "2025-06-01T00:00:00+00:00"
        rows_a = [{"id": "a-0", "text": "a", "source": "a.md", "vector": [1.0, 0.0, 0.0, 0.0], "added_at": ts_a}]
        rows_b = [{"id": "b-0", "text": "b", "source": "b.md", "vector": [0.0, 1.0, 0.0, 0.0], "added_at": ts_b}]
        store.add(rows_a)
        store.add(rows_b)
        result = store.new_since(ISO_EPOCH)
        assert len(result) == 2
        assert result[0]["added_at"] <= result[1]["added_at"]
