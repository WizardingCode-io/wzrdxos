# wzrdxOS roadmap

A clean-slate successor to ArkaOS. Phased, with dedicated design sessions for the
two biggest pain points (Knowledge Base and the Org / Teams roster).

## Principles

1. Native first, custom only where it pays.
2. Mandatory flow, low-friction enforcement — every request follows the doctrine
   (task-breakdown, KB-first, document-first, enrichment, evolutive agents; see
   `docs/constitution.md`), enforced natively/intelligently, NOT via brittle blocking
   marker-hooks (the ArkaOS pain).
3. Curated skills, not accumulated.
4. Few, strong agents.
5. KB as a first-class citizen — Graphify (graph) + LanceDB (vectors) + Obsidian (fallback).
6. Open-source from day one (MIT).
7. Mandatory cross-platform auto-install — `setup`/`update` install the full KB stack
   (graphify, LanceDB, services/kb, embeddings) with zero manual steps on Mac/Linux/Windows.

## Milestones

| Milestone | Goal | Design session |
| --- | --- | --- |
| **M1** | Foundations & repo skeleton (formats, registry, CLI, KB stub, CI) | — |
| **M2** | KB deep-dive — Graphify + LanceDB + Obsidian; auto-install (see `docs/kb-design.md`) | ✅ dedicated |
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

- **M2 — KB:** ✅ implemented (slices 1–3). Vector layer (LanceDB + local embeddings),
  cross-platform auto-install (`setup`/`update`/`doctor`), graph build wired to ingestion
  (`graphify update`/`extract`) and GraphRAG fusion (`kb_ask`). All design questions
  resolved in `docs/kb-design.md`. Remaining polish: Obsidian fallback, graphify global
  graph integration, async/watch ingestion.
- **M3 — Org:** 🟢 in progress. Department set locked in `docs/org.md` (9 depts +
  Quality transversal; C-suite double-hats). C-suite **defined and implemented
  (phase 1)**: CEO pilot (PR #1) + COO/CTO/CFO/CHRO/CMO rollout (PR #2) — 7 agents,
  14 skills, balanced-deliberation workflow, plugin manifests, Claude deploy.
  Remaining: define Growth (incl. Vendas), Knowledge, Administrativo, Quality;
  then phase-2 skills (KB-mined backlog per dept) and routing model.
- **Naming / brand:** wzrdxOS tagline and positioning before public launch.
