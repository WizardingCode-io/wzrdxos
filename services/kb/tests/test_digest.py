"""Tests for digest watermark, KB.digest flow, and near_duplicates."""

from __future__ import annotations

import os

import pytest

from wzrdx_kb.digest import near_duplicates, read_watermark, write_watermark
from wzrdx_kb.store import ISO_EPOCH, VectorStore


# ---------------------------------------------------------------------------
# Watermark roundtrip
# ---------------------------------------------------------------------------


class TestWatermark:
    def test_read_missing_returns_none(self, tmp_path):
        assert read_watermark(tmp_path) is None

    def test_roundtrip(self, tmp_path):
        ts = "2025-06-01T12:00:00+00:00"
        write_watermark(tmp_path, ts, chunks_at_run=42)
        assert read_watermark(tmp_path) == ts

    def test_overwrite(self, tmp_path):
        write_watermark(tmp_path, "2025-01-01T00:00:00+00:00", 10)
        write_watermark(tmp_path, "2025-06-01T00:00:00+00:00", 99)
        assert read_watermark(tmp_path) == "2025-06-01T00:00:00+00:00"

    def test_corrupted_file_returns_none(self, tmp_path):
        (tmp_path / "digest.json").write_text("not json", encoding="utf-8")
        assert read_watermark(tmp_path) is None


# ---------------------------------------------------------------------------
# near_duplicates
# ---------------------------------------------------------------------------


class TestNearDuplicates:
    def _make_row(self, row_id: str, source: str, vec: list[float], text: str = "") -> dict:
        return {"id": row_id, "source": source, "vector": vec, "text": text}

    def test_empty_returns_empty(self):
        assert near_duplicates([]) == []

    def test_single_row_returns_empty(self):
        row = self._make_row("a", "a.md", [1.0, 0.0, 0.0, 0.0])
        assert near_duplicates([row]) == []

    def test_same_source_pairs_excluded(self):
        """Two nearly-identical rows from the same source should NOT appear."""
        row_a = self._make_row("a", "same.md", [1.0, 0.0, 0.0, 0.0])
        row_b = self._make_row("b", "same.md", [1.0, 0.0, 0.0, 0.0])
        assert near_duplicates([row_a, row_b], threshold=0.9) == []

    def test_exactly_one_pair_detected(self):
        """Three vectors: two nearly identical from different sources, one orthogonal."""
        # vec_a and vec_b are identical (cosine=1.0), vec_c is orthogonal
        vec_a = [1.0, 0.0, 0.0, 0.0]
        vec_b = [1.0, 0.0, 0.0, 0.0]
        vec_c = [0.0, 0.0, 0.0, 1.0]
        rows = [
            self._make_row("a", "file_a.md", vec_a, text="hello world this is a"),
            self._make_row("b", "file_b.md", vec_b, text="hello world this is b"),
            self._make_row("c", "file_c.md", vec_c, text="completely different"),
        ]
        pairs = near_duplicates(rows, threshold=0.95, max_pairs=25)
        assert len(pairs) == 1
        pair = pairs[0]
        assert {pair["a_id"], pair["b_id"]} == {"a", "b"}
        assert pair["cosine"] >= 0.95
        assert pair["a_text_head"] != ""
        assert pair["b_text_head"] != ""

    def test_text_head_truncated_at_120(self):
        long_text = "x" * 200
        vec = [1.0, 0.0, 0.0, 0.0]
        rows = [
            self._make_row("a", "a.md", vec, text=long_text),
            self._make_row("b", "b.md", vec, text=long_text),
        ]
        pairs = near_duplicates(rows, threshold=0.9)
        assert len(pairs) == 1
        assert len(pairs[0]["a_text_head"]) == 120
        assert len(pairs[0]["b_text_head"]) == 120

    def test_max_pairs_cap(self):
        """With many similar vectors, result is capped at max_pairs."""
        # 10 identical vectors from different sources
        rows = [
            self._make_row(f"r{i}", f"file{i}.md", [1.0, 0.0, 0.0, 0.0])
            for i in range(10)
        ]
        pairs = near_duplicates(rows, threshold=0.9, max_pairs=5)
        assert len(pairs) <= 5

    def test_sorted_descending(self):
        """Pairs should be sorted by cosine descending."""
        vec_a = [1.0, 0.0, 0.0, 0.0]
        vec_b = [0.99, 0.14, 0.0, 0.0]  # slightly off
        vec_c = [1.0, 0.0, 0.0, 0.0]   # identical to a
        rows = [
            self._make_row("a", "a.md", vec_a),
            self._make_row("b", "b.md", vec_b),
            self._make_row("c", "c.md", vec_c),
        ]
        pairs = near_duplicates(rows, threshold=0.5, max_pairs=25)
        cosines = [p["cosine"] for p in pairs]
        assert cosines == sorted(cosines, reverse=True)

    def test_same_source_default_excluded(self):
        """Two near-identical rows from the same source: default (cross_source_only=True) → 0 pairs."""
        vec = [1.0, 0.0, 0.0, 0.0]
        rows = [
            self._make_row("a", "same.md", vec, text="almost identical text a"),
            self._make_row("b", "same.md", vec, text="almost identical text b"),
        ]
        assert near_duplicates(rows, threshold=0.9) == []

    def test_same_source_cross_source_only_false(self):
        """Two near-identical rows from the same source: cross_source_only=False → 1 pair."""
        vec = [1.0, 0.0, 0.0, 0.0]
        rows = [
            self._make_row("a", "same.md", vec, text="almost identical text a"),
            self._make_row("b", "same.md", vec, text="almost identical text b"),
        ]
        pairs = near_duplicates(rows, threshold=0.9, cross_source_only=False)
        assert len(pairs) == 1
        assert pairs[0]["a_source"] == pairs[0]["b_source"] == "same.md"


# ---------------------------------------------------------------------------
# KB.digest flow (using tmp dirs via env var + manual seam)
# ---------------------------------------------------------------------------


class TestKBDigestFlow:
    """Test KB.digest and KB.enrich_report using direct VectorStore seams.

    We avoid loading the embedder entirely: digest and enrich_report in service.py
    both use VectorStore(d, dim=1) (the status() pattern), so we can pre-populate
    the store with dim=4 rows and rely on that.
    """

    def _populate_store(self, directory, rows: list[dict]) -> VectorStore:
        store = VectorStore(directory, dim=4)
        store.add(rows)
        return store

    def test_digest_returns_new_chunks_and_stats(self, tmp_path, monkeypatch):
        """KB.digest should return new_chunks since the given since timestamp."""
        global_dir = tmp_path / "global_kb"
        global_dir.mkdir()

        ts_old = "2024-01-01T00:00:00+00:00"
        ts_new = "2025-06-01T00:00:00+00:00"

        rows_old = [
            {"id": "old-0", "text": "old text", "source": "old.md",
             "vector": [1.0, 0.0, 0.0, 0.0], "added_at": ts_old},
        ]
        rows_new = [
            {"id": "new-0", "text": "new text", "source": "new.md",
             "vector": [0.0, 1.0, 0.0, 0.0], "added_at": ts_new},
        ]
        self._populate_store(global_dir, rows_old + rows_new)

        # patch resolve_scope to point at our tmp dir (no project overlay)
        from wzrdx_kb.config import KBScope

        monkeypatch.setattr(
            "wzrdx_kb.service.resolve_scope",
            lambda: KBScope(global_dir=global_dir, project_dir=None),
        )
        monkeypatch.setattr("wzrdx_kb.service.load_env", lambda: None)

        from wzrdx_kb.service import KB

        # instantiate with dim=1 trick (like status()) — we patch resolve_scope anyway
        # but KB.__init__ loads the embedder. Patch Embedder to avoid downloads.
        from wzrdx_kb.embed import Embedder

        monkeypatch.setattr(Embedder, "__init__", lambda self, model_name: None)
        monkeypatch.setattr(Embedder, "dim", property(lambda self: 4), raising=False)
        monkeypatch.setattr(Embedder, "model_name", property(lambda self: "mock"), raising=False)

        kb = KB.__new__(KB)
        kb.embedder = object.__new__(Embedder)
        kb.scope = KBScope(global_dir=global_dir, project_dir=None)

        since = "2025-01-01T00:00:00+00:00"
        result = kb.digest(since=since, advance=False)

        assert result["since"] == since
        assert result["stats"]["new"] == 1
        assert result["new_chunks"][0]["id"] == "new-0"
        assert result["stats"]["total"] >= 1
        assert "new.md" in result["stats"]["sources"]

    def test_digest_advances_watermark(self, tmp_path):
        """When advance=True and there are new chunks, the watermark file is written."""
        global_dir = tmp_path / "global_kb"
        global_dir.mkdir()

        ts_new = "2025-06-01T00:00:00+00:00"
        rows = [
            {"id": "n0", "text": "something", "source": "s.md",
             "vector": [1.0, 0.0, 0.0, 0.0], "added_at": ts_new},
        ]
        self._populate_store(global_dir, rows)

        from wzrdx_kb.config import KBScope
        from wzrdx_kb.embed import Embedder

        kb = KB.__new__(KB)
        kb.embedder = object.__new__(Embedder)
        kb.scope = KBScope(global_dir=global_dir, project_dir=None)

        assert read_watermark(global_dir) is None
        kb.digest(since=ISO_EPOCH, advance=True)
        assert read_watermark(global_dir) is not None

    def test_digest_uses_watermark_when_no_since(self, tmp_path):
        """When no since is passed, digest should fall back to the stored watermark."""
        global_dir = tmp_path / "global_kb"
        global_dir.mkdir()

        # write a watermark in the future so no rows are "new"
        future_wm = "2099-01-01T00:00:00+00:00"
        write_watermark(global_dir, future_wm, 0)

        ts_new = "2025-06-01T00:00:00+00:00"
        rows = [
            {"id": "n0", "text": "something", "source": "s.md",
             "vector": [1.0, 0.0, 0.0, 0.0], "added_at": ts_new},
        ]
        self._populate_store(global_dir, rows)

        from wzrdx_kb.config import KBScope
        from wzrdx_kb.embed import Embedder

        kb = KB.__new__(KB)
        kb.embedder = object.__new__(Embedder)
        kb.scope = KBScope(global_dir=global_dir, project_dir=None)

        result = kb.digest(since=None, advance=False)
        # since is after ts_new, so no new chunks
        assert result["stats"]["new"] == 0
        assert result["since"] == future_wm

    def test_digest_invalid_since_raises(self, tmp_path):
        """digest(since='not-a-date') must raise ValueError."""
        global_dir = tmp_path / "global_kb"
        global_dir.mkdir()

        from wzrdx_kb.config import KBScope
        from wzrdx_kb.embed import Embedder

        kb = KB.__new__(KB)
        kb.embedder = object.__new__(Embedder)
        kb.scope = KBScope(global_dir=global_dir, project_dir=None)

        with pytest.raises(ValueError, match="ISO-8601"):
            kb.digest(since="not-a-date", advance=False)


# import at module level so the monkeypatched class reference works
from wzrdx_kb.service import KB  # noqa: E402
