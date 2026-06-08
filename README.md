# WZRDX

> The open-source operating system for AI agent teams.

WZRDX is a lightweight, native-first framework for running a company of AI agents
on top of [Claude Code](https://claude.com/claude-code) primitives — skills,
workflows, subagents and memory — without the weight of a bespoke orchestration
engine.

It is a clean-slate successor to ArkaOS, built around three target inspirations:

- **Native Claude Code primitives** — the Skill tool, the Workflow tool, native
  subagents and plan mode do the orchestration. WZRDX resolves *who* does the work
  and *with which workflow*; it does not reinvent orchestration.
- **Modular skills** (superpowers-style) — small, composable, disciplined skills
  instead of monolithic flows.
- **Quality workflows** — fan-out + adversarial verification + cited synthesis,
  judge panels, loop-until-dry.

## Why WZRDX

ArkaOS grew into a heavy Python engine with a non-negotiable 13-phase flow,
blocking enforcement hooks, 270+ skills and 65 agents. WZRDX keeps the **company
with departments** metaphor but makes it lean:

- **Opt-in flow, no blocking enforcement.** Quality comes from workflow patterns,
  not gates that stall the work.
- **Curated skills, not accumulated.** A designed taxonomy plus a generator.
- **Few, strong agents.** A small roster of high-quality specialists.
- **Knowledge base as a first-class citizen.** A purpose-built ingestion / RAG
  pipeline exposed to Claude Code over MCP.

## Architecture

A hybrid monorepo with a clean runtime boundary:

```
WZRDX
├─ packages/core   (TypeScript)  registry · routing · conductor · CLI · artifact generator
├─ services/kb     (Python)      ingestion · embeddings · vector index · RAG → MCP server
└─ artifacts/                    Claude Code artifacts (curated + generated)
   ├─ skills/      SKILL.md (superpowers-style)
   ├─ agents/      agent / persona definitions
   └─ workflows/   Workflow scripts (reusable quality patterns)
```

- **`@wzrdx/core` (TS):** source of truth for the registry (skills, agents,
  departments, workflows), the natural-language routing resolver, a light
  conductor, profile/config, the KB client, light telemetry, and the `wzrdx` CLI.
  It generates and installs Claude Code artifacts into `~/.claude/`.
- **`@wzrdx/kb` (Python, via `uv`):** the isolated worker for everything TS does
  poorly — ingestion (YouTube/Whisper, articles, URLs, files), chunking,
  embeddings, a vector index and semantic search, exposed to Claude Code as the
  `wzrdx-kb` MCP server.

## Status

**M1 — Foundations & skeleton.** This milestone delivers firm ground and the
artifact format contracts, not domain functionality. See
[`docs/roadmap.md`](docs/roadmap.md) for the full phased plan and the dedicated
design sessions for the Knowledge Base (M2) and the Org / Teams roster (M3).

## Quick start (development)

```bash
pnpm install
pnpm build
pnpm wzrdx -- doctor    # validate the environment
pnpm wzrdx -- status    # list registered skills / agents / workflows
```

## Requirements

- Node.js >= 22 + pnpm 10
- Python 3.13 + [uv](https://docs.astral.sh/uv/) (for `services/kb`)

## License

MIT © WizardingCode
