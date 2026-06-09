# wzrdxOS runtime adapters — design

wzrdxOS is a layer that amplifies whatever AI agent runtime the user already uses. It is
**not** Claude-Code-only. This document defines how wzrdxOS installs into each runtime.

## Goals

1. **Multi-runtime install** — installable into any supported runtime, at setup, update,
   or any time.
2. **Scan → choose → install per standard** — detect what's on the machine, let the user
   pick targets, install following each runtime's native conventions.

## Two unifying primitives

Despite different configs, runtimes share two integration points wzrdxOS rides on:

1. **MCP servers** — register the unified `wzrdx-kb` MCP so the KB is available natively.
2. **Instructions file** — an `AGENTS.md`-style bootstrap. The de-facto standard is
   `AGENTS.md` (Codex, Cursor, OpenCode, …); Claude reads `CLAUDE.md`, Gemini `GEMINI.md`,
   Qwen `QWEN.md`. wzrdxOS writes one canonical block and renders it to each runtime's file.

Skills/commands are a third, runtime-specific surface. For the **graphify** skill we
delegate to its own installer: `graphify install --platform <p>` already supports
claude, codex, opencode, gemini, cursor, antigravity, hermes, claw, and more.

## Adapter architecture

A **runtime adapter registry** in `@wzrdx/core`. Each adapter implements:

```
interface RuntimeAdapter {
  id: string;                 // "claude" | "codex" | "gemini" | ...
  displayName: string;
  detect(): Detection;        // binary on PATH and/or known config dir
  paths(): { configDir; mcp?; instructions? };
  installMcp(server): void;   // register wzrdx-kb in this runtime's MCP config
  installInstructions(): void;// write/merge the AGENTS.md-style block
  installSkills?(): void;     // native skill/command install (or delegate to graphify)
}
```

## Flow (setup / update / `wzrdx runtimes`)

1. **Scan** — run every adapter's `detect()`; collect the runtimes present.
2. **Choose** — show detected runtimes; user multi-selects targets (all detected by default).
3. **Install per standard** — for each chosen runtime, run `installMcp` + `installInstructions`
   (+ skills), each writing that runtime's native files. Idempotent and merge-safe.
4. `update` re-runs install across previously chosen runtimes; `wzrdx runtimes` lists status.

## Runtime matrix

Detection = binary on PATH and/or config dir. Install targets per runtime (✔ known,
~ to verify on a machine that has it).

| Runtime | id | detect (bin / dir) | MCP config | Instructions | Skill install |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `claude` | `claude` / `~/.claude` | `.mcp.json` / `~/.claude.json` ✔ | `CLAUDE.md` ✔ | `~/.claude/skills` ✔ |
| OpenAI Codex | `codex` | `codex` / `~/.codex` | `~/.codex/config.toml` `[mcp_servers]` ~ | `AGENTS.md` ✔ | graphify ~ |
| Gemini CLI | `gemini` | `gemini` / `~/.gemini` | `~/.gemini/settings.json` `mcpServers` ~ | `GEMINI.md` ✔ | `~/.gemini/commands` ~ |
| Qwen Code | `qwen` | `qwen` / `~/.qwen` | `~/.qwen/settings.json` ~ | `QWEN.md` ~ | ~ |
| Cursor | `cursor` | `cursor` / `~/.cursor` | `.cursor/mcp.json` ~ | `.cursor/rules/*.mdc` / `AGENTS.md` ~ | graphify ~ |
| Antigravity | `antigravity` | dir / app ~ | ~ | ~ | graphify ~ |
| OpenCode | `opencode` | `opencode` / `~/.config/opencode` | `opencode.json` `mcp` ~ | `AGENTS.md` ✔ | ~ |
| Hermes Agent | `hermes` | `hermes` ~ | ~ | ~ | graphify ~ |
| Copilot CLI | `copilot` | `copilot` / `gh copilot` ~ | ~ | ~ | ~ |
| OpenClaw | `openclaw` | `claw` ~ | ~ | ~ | graphify (`claw`) ~ |

> The `~` cells are integration points to confirm on a machine that actually has the
> runtime — wzrdxOS detects presence safely regardless; deep install adapters are built
> and verified runtime-by-runtime, prioritised by what the user's scan finds.

## Status

- **Step 1 — scanner** (`wzrdx runtimes` / used by setup): detect installed runtimes. ⬅ first.
- **Step 2 — adapters**: implement installMcp/installInstructions per runtime, starting
  with the ones detected on the user's machine.
- **Step 3 — setup integration**: multi-select targets, install per standard; `update`
  re-applies; `doctor` reports per-runtime status.
