"""High-level KB operations shared by the CLI and the MCP server.

Ties together scope resolution (global + project overlay), local embeddings, the
LanceDB vector layer, and the Graphify graph wrapper.
"""

from __future__ import annotations

from pathlib import Path

from . import graph
from .config import DEFAULT_EMBED_MODEL, load_env, resolve_scope
from .embed import Embedder
from .ingest import ingest_path, ingest_text
from .store import SearchHit, VectorStore


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
