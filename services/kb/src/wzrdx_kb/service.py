"""High-level KB operations shared by the CLI and the MCP server.

Ties together scope resolution (global + project overlay), local embeddings, the
LanceDB vector layer, and the Graphify graph wrapper.
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

from . import graph
from .config import DEFAULT_EMBED_MODEL, load_env, resolve_scope
from .digest import near_duplicates, now_iso, read_watermark, write_watermark
from .embed import Embedder
from .ingest import ingest_path, ingest_text
from .store import ISO_EPOCH, SearchHit, VectorStore


class KB:
    def __init__(self, model_name: str = DEFAULT_EMBED_MODEL) -> None:
        load_env()  # pick up GEMINI_API_KEY from .wzrdx/.env (enables automatic mode)
        self.embedder = Embedder(model_name)
        self.scope = resolve_scope()

    # --- stores -----------------------------------------------------------
    def _store(self, directory: Path) -> VectorStore:
        return VectorStore(directory, dim=self.embedder.dim)

    def _target_dir(self, target: str) -> Path:
        if target == "project":
            if not self.scope.project_dir:
                raise ValueError("no project overlay here — run `wzrdx init` in the project")
            return self.scope.project_dir
        return self.scope.global_dir

    # --- operations -------------------------------------------------------
    def status(self) -> dict:
        # Count without loading the embedding model (dim only needed to create).
        out: dict = {
            "model": self.embedder.model_name,
            "graphify": "installed" if graph.graphify_available() else "missing",
            "locations": [],
        }
        for name, d in (("global", self.scope.global_dir), ("project", self.scope.project_dir)):
            if not d:
                continue
            store = VectorStore(d, dim=1)
            out["locations"].append(
                {
                    "scope": name,
                    "dir": str(d),
                    "chunks": store.count(),
                    "graph": (Path(d) / "graphify-out" / "graph.json").exists(),
                }
            )
        return out

    def ingest_text(self, text: str, source: str, target: str = "global") -> int:
        return ingest_text(text, source, self._store(self._target_dir(target)), self.embedder)

    def ingest_path(self, path: str, target: str = "global", build_graph: bool = False) -> dict:
        directory = self._target_dir(target)
        files, chunks = ingest_path(Path(path), self._store(directory), self.embedder)
        result = {"files": files, "chunks": chunks, "graph": None}
        if build_graph:
            gr = graph.build(path, directory)
            result["graph"] = {"ok": gr.ok, "mode": gr.mode, "output": gr.output[-2000:]}
        return result

    def search(self, query: str, k: int = 8) -> list[SearchHit]:
        vector = self.embedder.embed_one(query)
        merged: list[SearchHit] = []
        for d in self.scope.dirs:
            merged.extend(self._store(d).search(vector, k))
        merged.sort(key=lambda h: h.score, reverse=True)
        return merged[:k]

    def graph_query(self, question: str) -> dict:
        # Query every KB location that has a graph (global + project overlay).
        outputs: list[str] = []
        for d in self.scope.dirs:
            gr = graph.query(question, d)
            if gr.ok and gr.output.strip():
                outputs.append(gr.output)
        if outputs:
            return {"ok": True, "output": "\n\n".join(outputs)}
        return {"ok": False, "output": "no graph available in any KB location"}

    def ask(self, question: str, k: int = 6) -> dict:
        """GraphRAG fusion: dense vector recall + Graphify graph traversal."""
        chunks = [
            {"text": h.text, "source": h.source, "score": h.score}
            for h in self.search(question, k)
        ]
        g = self.graph_query(question)
        return {"chunks": chunks, "graph": g["output"] if g["ok"] else None}

    def digest(self, since: str | None = None, cap: int = 200, advance: bool = True) -> dict:
        """Return chunks ingested since the last digest (or since the given timestamp).

        Resolves since per-scope: explicit arg > that scope's watermark > ISO_EPOCH.
        When advance=True and new chunks exist, both watermarks are updated.
        Merges global + project overlay. The response ``since`` field reflects the
        global scope's resolved since value.

        Args:
            since: optional ISO-8601 timestamp override. Raises ValueError if not
                valid ISO-8601 (e.g. ``since="not-a-date"``).
            cap: maximum number of chunks to return (default 200).
            advance: when True (default) and new chunks exist, advances the watermarks.

        Returns:
            {since, new_chunks: [{id,source,text,added_at,scope}], stats: {new,total,sources}, watermark}
        """
        # Fix 2: validate since to prevent filter injection
        if since is not None:
            try:
                datetime.fromisoformat(since)
            except ValueError:
                raise ValueError("since must be ISO-8601")

        global_store = VectorStore(self.scope.global_dir, dim=1)

        # Fix 3: per-scope watermark resolution
        # global scope
        global_since = since
        if global_since is None:
            wm = read_watermark(self.scope.global_dir)
            global_since = wm if wm else ISO_EPOCH

        current_time = now_iso()

        new_chunks: list[dict] = []

        for row in global_store.new_since(global_since, cap=cap):
            row["scope"] = "global"
            new_chunks.append(row)

        # project overlay — uses its own watermark when since is not explicitly given
        if self.scope.project_dir:
            proj_since = since
            if proj_since is None:
                proj_wm = read_watermark(self.scope.project_dir)
                proj_since = proj_wm if proj_wm else ISO_EPOCH
            proj_store = VectorStore(self.scope.project_dir, dim=1)
            for row in proj_store.new_since(proj_since, cap=cap):
                row["scope"] = "project"
                new_chunks.append(row)

        # sort merged oldest-first
        new_chunks.sort(key=lambda r: r.get("added_at", ""))
        new_chunks = new_chunks[:cap]

        # stats
        sources: dict[str, int] = {}
        for row in new_chunks:
            src = row.get("source", "")
            sources[src] = sources.get(src, 0) + 1

        total = global_store.count()
        if self.scope.project_dir:
            total += VectorStore(self.scope.project_dir, dim=1).count()

        if advance and new_chunks:
            write_watermark(self.scope.global_dir, current_time, total)
            if self.scope.project_dir:
                write_watermark(self.scope.project_dir, current_time, total)

        return {
            "since": global_since,
            "new_chunks": new_chunks,
            "stats": {"new": len(new_chunks), "total": total, "sources": sources},
            "watermark": current_time if (advance and new_chunks) else global_since,
        }

    def enrich_report(
        self,
        threshold: float = 0.95,
        max_pairs: int = 25,
        max_rows: int = 2000,
        cross_source_only: bool = True,
    ) -> dict:
        """Near-duplicate / potential-contradiction pairs for agent review.

        Gathers vectors from all scopes (global + project overlay), runs pairwise
        cosine similarity, returns pairs above threshold.

        Args:
            threshold: minimum cosine similarity (default 0.95).
            max_pairs: maximum pairs to return (default 25).
            max_rows: maximum vectors to scan per scope (default 2000).
            cross_source_only: when True (default), only cross-source pairs are returned.
                Set False to include same-source pairs — useful for legacy duplicate cleanup.

        Returns:
            {pairs: [...], rows_scanned: int, scopes: [...], threshold: float}
        """
        all_rows: list[dict] = []
        scopes: list[str] = []

        global_store = VectorStore(self.scope.global_dir, dim=1)
        global_rows = global_store.vectors(cap=max_rows)
        if global_rows:
            all_rows.extend(global_rows)
            scopes.append("global")

        if self.scope.project_dir:
            proj_store = VectorStore(self.scope.project_dir, dim=1)
            proj_rows = proj_store.vectors(cap=max_rows)
            if proj_rows:
                all_rows.extend(proj_rows)
                scopes.append("project")

        pairs = near_duplicates(
            all_rows,
            threshold=threshold,
            max_pairs=max_pairs,
            cross_source_only=cross_source_only,
        )

        return {
            "pairs": pairs,
            "rows_scanned": len(all_rows),
            "scopes": scopes,
            "threshold": threshold,
        }
