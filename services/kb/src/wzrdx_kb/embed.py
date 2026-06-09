"""Local embeddings via fastembed (ONNX — no torch, cross-platform wheels).

Local-by-default per docs/kb-design.md. A cloud backend can be added later behind
the same interface.
"""

from __future__ import annotations

from functools import cached_property

from .config import DEFAULT_EMBED_MODEL


class Embedder:
    """Wraps a fastembed TextEmbedding model. The model is loaded lazily on first use."""

    def __init__(self, model_name: str = DEFAULT_EMBED_MODEL) -> None:
        self.model_name = model_name

    @cached_property
    def _model(self):  # type: ignore[no-untyped-def]
        from fastembed import TextEmbedding

        return TextEmbedding(model_name=self.model_name)

    @cached_property
    def dim(self) -> int:
        """Embedding dimensionality (probed once)."""
        return len(self.embed_one("dimension probe"))

    def embed(self, texts: list[str]) -> list[list[float]]:
        """Embed a batch of texts into plain float lists (LanceDB-friendly)."""
        return [vec.tolist() for vec in self._model.embed(texts)]

    def embed_one(self, text: str) -> list[float]:
        return next(iter(self._model.embed([text]))).tolist()
