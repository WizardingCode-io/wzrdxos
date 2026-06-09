# wzrdxOS roadmap

A clean-slate successor to ArkaOS. Phased, with dedicated design sessions for the
two biggest pain points (Knowledge Base and the Org / Teams roster).

## Principles

1. Native first, custom only where it pays.
2. Opt-in flow, no blocking enforcement.
3. Curated skills, not accumulated.
4. Few, strong agents.
5. KB as a first-class citizen.
6. Open-source from day one (MIT).

## Milestones

| Milestone | Goal | Design session |
| --- | --- | --- |
| **M1** | Foundations & repo skeleton (formats, registry, CLI, KB stub, CI) | — |
| **M2** | KB deep-dive — design + ingestion/RAG prototype | ✅ dedicated |
| **M3** | Org / Teams — departments, agent roster, personas | ✅ dedicated |
| **M4** | Skill taxonomy + first skills (process + capability) | — |
| **M5** | Workflow library — quality patterns | — |
| **M6** | Distribution — installer, docs, OSS scaffolding, release | — |

## M1 — Foundations (current)

- Hybrid monorepo: `packages/core` (TS) + `services/kb` (Python via uv).
- Artifact format contract (`docs/formats.md`) + registry loader.
- `wzrdx` CLI: `init`, `status`, `doctor`, `skill new`, `agent new`.
- One example of each artifact (skill / agent / workflow).
- KB MCP stub that starts without crashing.
- CI: typecheck + build + commitlint.

## Open design sessions

- **M2 — KB:** vector engine (sqlite-vec / LanceDB / Qdrant), chunking,
  embedding model, metadata/persona schema, async ingestion pipeline.
- **M3 — Org:** final department set (strawman: Engineering, Product,
  Growth, Brand & Content, Knowledge, Operations + a thin leadership/quality
  layer), agent roster, personas, routing model.
- **Naming / brand:** wzrdxOS tagline and positioning before public launch.
