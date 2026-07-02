# M5 — Workflow Library + SDD Soft-Gate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the M5 milestone — 3 new quality-pattern workflows, the `core:product-lifecycle` skill, and a non-blocking SDD PreToolUse hook (new `hooks` artifact type with registry + deploy support), per the approved spec `docs/superpowers/specs/2026-07-02-m5-workflow-library-sdd-gate-design.md`.

**Architecture:** Hooks become a fourth artifact type (`artifacts/hooks/<name>/hook.json` + `hook.mjs`) loaded by the registry and deployed by `installClaudeArtifacts` — the script goes to `~/.claude/wzrdx/hooks/`, and a surgical, idempotent merge adds the hook entry to `~/.claude/settings.json` (wzrdx entries identified by command path, never touching user entries). The SDD gate is fail-open and never blocks. Workflows follow the `adversarial-review` conventions (pure-literal `meta`, JSON schemas, `args` parameterization). The lifecycle is a skill with document-first state, not a workflow script.

**Tech Stack:** TypeScript (packages/core, vitest, tsup), plain Node ESM for the hook script (no deps), Workflow-tool `.mjs` scripts, Python (`scripts/trigger_eval.py`) for measurement.

**Branch:** all work happens on `feat/m5-workflows` (already created; the design doc is its first commit).

---

## File structure

| File | Action | Responsibility |
| --- | --- | --- |
| `artifacts/hooks/sdd-gate/hook.mjs` | Create | The hook script: stdin JSON → optional non-blocking reminder JSON |
| `artifacts/hooks/sdd-gate/hook.json` | Create | Hook manifest (name, description, event, matcher) |
| `packages/core/test/sdd-gate-hook.test.ts` | Create | Behavioral tests for the hook script (spawns node) |
| `packages/core/src/paths.ts` | Modify | Add `hooks` to `WzrdxPaths`; add `wzrdxHooks` + `settings` to `ClaudePaths` |
| `packages/core/src/registry/types.ts` | Modify | `HookDefinition` + `Registry.hooks` |
| `packages/core/src/registry/loader.ts` | Modify | `loadHooks()` |
| `packages/core/test/hooks.test.ts` | Create | Registry contract for hooks |
| `packages/core/src/artifact-install.ts` | Modify | Deploy hooks + settings.json merge; report `hooks` count |
| `packages/core/src/commands/setup.ts` | Modify | Print hooks count in the deploy summary line |
| `packages/core/test/artifact-install.test.ts` | Modify | Deploy + merge + idempotency + user-entry preservation tests |
| `artifacts/workflows/loop-until-dry/workflow.mjs` | Create | Quality pattern: rounds of finders until K dry rounds |
| `artifacts/workflows/multi-modal-sweep/workflow.mjs` | Create | Quality pattern: blind per-mode search, merged + deduped |
| `artifacts/workflows/completeness-critic/workflow.mjs` | Create | Quality pattern: parallel "what's missing" critics |
| `packages/core/test/workflows-m5.test.ts` | Create | Registry sees the 3 new workflows with parseable meta |
| `artifacts/skills/core/product-lifecycle/SKILL.md` | Create | Lifecycle orchestrator skill (document-first state) |
| `artifacts/skills/core/product-lifecycle/evals/evals.json` | Create | Functional evals (M4 contract) |
| `artifacts/skills/core/product-lifecycle/evals/trigger_eval.json` | Create | 20 trigger queries |
| `docs/formats.md` | Modify | New "Hooks" section + flow-policy amendment |
| `docs/roadmap.md` | Modify | M5 status entry |
| `docs/eval-baseline.md` | Modify | M5 measurement section (C1 re-run) |

---

### Task 1: SDD soft-gate hook script (`sdd-gate`)

**Files:**
- Create: `artifacts/hooks/sdd-gate/hook.json`
- Create: `artifacts/hooks/sdd-gate/hook.mjs`
- Test: `packages/core/test/sdd-gate-hook.test.ts`

The hook reads the Claude Code PreToolUse stdin payload (`{session_id, cwd, tool_name, tool_input: {file_path}}`). It emits a non-blocking reminder **only** when: the target file is code, no spec file (`SPEC-*` or `*-design.md` under `docs/specs/` or `docs/superpowers/specs/` of the payload's `cwd`) was modified in the last 7 days, and it hasn't already fired this session (marker in `~/.claude/wzrdx/state/`). Everything else — including any internal error — exits 0 with no output (fail-open). It never emits `deny`/`ask`.

`node:os.homedir()` honors `$HOME` on macOS/Linux, so tests isolate state via a temp `HOME`.

- [ ] **Step 1: Write the failing tests**

Create `packages/core/test/sdd-gate-hook.test.ts`:

```typescript
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);
const script = join(root, "artifacts", "hooks", "sdd-gate", "hook.mjs");

const tmp: string[] = [];
function tmpDir(prefix: string): string {
  const d = mkdtempSync(join(tmpdir(), prefix));
  tmp.push(d);
  return d;
}
afterAll(() => tmp.forEach((d) => rmSync(d, { recursive: true, force: true })));

interface HookRun {
  stdout: string;
  status: number | null;
}

function runHook(input: string, home: string): HookRun {
  const res = spawnSync("node", [script], {
    input,
    encoding: "utf8",
    env: { ...process.env, HOME: home },
  });
  return { stdout: res.stdout.trim(), status: res.status };
}

function payload(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    session_id: "sess-1",
    cwd: overrides.cwd ?? tmpDir("wzrdx-proj-"),
    tool_name: "Edit",
    tool_input: { file_path: "/some/project/src/index.ts" },
    ...overrides,
  });
}

describe("sdd-gate hook", () => {
  it("stays silent for non-code files", () => {
    const home = tmpDir("wzrdx-home-");
    const run = runHook(
      payload({ tool_input: { file_path: "/p/README.md" } }),
      home,
    );
    expect(run.status).toBe(0);
    expect(run.stdout).toBe("");
  });

  it("emits a non-blocking allow reminder when code is edited without a recent spec", () => {
    const home = tmpDir("wzrdx-home-");
    const run = runHook(payload(), home);
    expect(run.status).toBe(0);
    const out = JSON.parse(run.stdout);
    expect(out.hookSpecificOutput.hookEventName).toBe("PreToolUse");
    expect(out.hookSpecificOutput.permissionDecision).toBe("allow");
    expect(out.hookSpecificOutput.additionalContext).toContain("spec-driven-development");
    // marker written → once per session
    expect(existsSync(join(home, ".claude", "wzrdx", "state", "sdd-gate-sess-1"))).toBe(true);
  });

  it("fires at most once per session", () => {
    const home = tmpDir("wzrdx-home-");
    const cwd = tmpDir("wzrdx-proj-");
    expect(runHook(payload({ cwd }), home).stdout).not.toBe("");
    expect(runHook(payload({ cwd }), home).stdout).toBe("");
  });

  it("stays silent when a recent spec exists", () => {
    const home = tmpDir("wzrdx-home-");
    const cwd = tmpDir("wzrdx-proj-");
    const specs = join(cwd, "docs", "specs");
    mkdirSync(specs, { recursive: true });
    writeFileSync(join(specs, "SPEC-ENG-001.md"), "# spec");
    expect(runHook(payload({ cwd }), home).stdout).toBe("");
  });

  it("fires when the only spec is older than 7 days", () => {
    const home = tmpDir("wzrdx-home-");
    const cwd = tmpDir("wzrdx-proj-");
    const specs = join(cwd, "docs", "superpowers", "specs");
    mkdirSync(specs, { recursive: true });
    const old = join(specs, "2026-01-01-stale-design.md");
    writeFileSync(old, "# old");
    const eightDaysAgo = (Date.now() - 8 * 24 * 60 * 60 * 1000) / 1000;
    utimesSync(old, eightDaysAgo, eightDaysAgo);
    expect(runHook(payload({ cwd }), home).stdout).not.toBe("");
  });

  it("fails open on malformed stdin", () => {
    const home = tmpDir("wzrdx-home-");
    const run = runHook("not json at all", home);
    expect(run.status).toBe(0);
    expect(run.stdout).toBe("");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm --filter @wzrdx/core exec vitest run test/sdd-gate-hook.test.ts`
Expected: FAIL — the script does not exist (`Cannot find module .../hook.mjs` / spawn errors).

- [ ] **Step 3: Write the manifest**

Create `artifacts/hooks/sdd-gate/hook.json`:

```json
{
  "name": "sdd-gate",
  "description": "Non-blocking SDD reminder — on Edit|Write|MultiEdit of code files without a recent spec, injects a spec-first nudge once per session. Never blocks (flow policy).",
  "event": "PreToolUse",
  "matcher": "Edit|Write|MultiEdit"
}
```

- [ ] **Step 4: Write the hook script**

Create `artifacts/hooks/sdd-gate/hook.mjs`:

```javascript
#!/usr/bin/env node
// wzrdx SDD soft-gate — PreToolUse hook for Edit|Write|MultiEdit.
//
// NON-BLOCKING by policy (docs/formats.md → Flow policy): always allows the
// action. When code is about to be written and no spec under docs/specs/ or
// docs/superpowers/specs/ was touched in the last 7 days, it injects a
// reminder to run eng:spec-driven-development — at most once per session.
// Fail-open: any internal error exits 0 with no output; this script must
// never be able to break the user's editing.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { extname, join } from "node:path";

const CODE_EXTS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".php", ".vue",
  ".go", ".rs", ".java", ".kt", ".rb", ".swift", ".c", ".h", ".cpp",
  ".cc", ".cs", ".sql",
]);
const SPEC_DIRS = [join("docs", "specs"), join("docs", "superpowers", "specs")];
const SPEC_NAME = /^SPEC-|-design\.md$/;
const FRESH_MS = 7 * 24 * 60 * 60 * 1000;

function hasRecentSpec(cwd) {
  for (const rel of SPEC_DIRS) {
    const dir = join(cwd, rel);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!SPEC_NAME.test(name)) continue;
      if (Date.now() - statSync(join(dir, name)).mtimeMs < FRESH_MS) return true;
    }
  }
  return false;
}

function main() {
  const payload = JSON.parse(readFileSync(0, "utf8"));
  const filePath = String(payload?.tool_input?.file_path ?? "");
  if (!CODE_EXTS.has(extname(filePath).toLowerCase())) return;
  const sessionId = String(payload?.session_id ?? "");
  if (!sessionId) return;

  const stateDir = join(homedir(), ".claude", "wzrdx", "state");
  const marker = join(stateDir, `sdd-gate-${sessionId}`);
  if (existsSync(marker)) return;

  const cwd = String(payload?.cwd ?? process.cwd());
  if (hasRecentSpec(cwd)) return;

  mkdirSync(stateDir, { recursive: true });
  writeFileSync(marker, new Date().toISOString());

  const reminder =
    "wzrdx SDD gate (non-blocking reminder): no spec was modified in the last " +
    "7 days under docs/specs/ or docs/superpowers/specs/. Before implementing, " +
    "consider invoking the eng:spec-driven-development skill to locate or " +
    "author an approved spec. The edit itself is allowed.";
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
        permissionDecisionReason: reminder,
        additionalContext: reminder,
      },
    }),
  );
}

try {
  main();
} catch {
  // fail-open by design
}
process.exit(0);
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm --filter @wzrdx/core exec vitest run test/sdd-gate-hook.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add artifacts/hooks/sdd-gate packages/core/test/sdd-gate-hook.test.ts
git commit -m "feat(hooks): sdd-gate non-blocking PreToolUse hook"
```

---

### Task 2: Registry support for hooks

**Files:**
- Modify: `packages/core/src/paths.ts:25-44` (WzrdxPaths)
- Modify: `packages/core/src/registry/types.ts` (append + Registry)
- Modify: `packages/core/src/registry/loader.ts` (loadHooks + loadRegistry)
- Test: `packages/core/test/hooks.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/core/test/hooks.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);
const reg = loadRegistry(root);

describe("hooks registry", () => {
  it("loads the sdd-gate hook with manifest fields", () => {
    const hook = reg.hooks.find((h) => h.name === "sdd-gate");
    expect(hook).toBeDefined();
    expect(hook?.event).toBe("PreToolUse");
    expect(hook?.matcher).toBe("Edit|Write|MultiEdit");
    expect(hook?.description).toBeTruthy();
    expect(hook?.script.endsWith("hook.mjs")).toBe(true);
  });

  it("every hook has a manifest and a script", () => {
    for (const h of reg.hooks) {
      expect(h.name, h.path).toBeTruthy();
      expect(h.description, h.path).toBeTruthy();
      expect(h.script, h.path).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @wzrdx/core exec vitest run test/hooks.test.ts`
Expected: FAIL — `reg.hooks` is undefined (TS build error: property does not exist).

- [ ] **Step 3: Add the `hooks` path**

In `packages/core/src/paths.ts`, extend `WzrdxPaths`:

```typescript
export interface WzrdxPaths {
  root: string;
  artifacts: string;
  skills: string;
  agents: string;
  workflows: string;
  plugins: string;
  hooks: string;
}

export function wzrdxPaths(root: string = findRepoRoot()): WzrdxPaths {
  const artifacts = join(root, "artifacts");
  return {
    root,
    artifacts,
    skills: join(artifacts, "skills"),
    agents: join(artifacts, "agents"),
    workflows: join(artifacts, "workflows"),
    plugins: join(artifacts, "plugins"),
    hooks: join(artifacts, "hooks"),
  };
}
```

- [ ] **Step 4: Add `HookDefinition` to types**

In `packages/core/src/registry/types.ts`, add after `PluginDefinition`:

```typescript
/**
 * A hook: a native runtime hook script (Claude Code settings.json hooks).
 * wzrdx hooks are ALWAYS non-blocking — they inject context or reminders and
 * never deny/ask (docs/formats.md → Flow policy).
 */
export interface HookDefinition {
  /** Unique id, e.g. "sdd-gate". */
  name: string;
  /** One-line summary. */
  description: string;
  /** Hook event this script attaches to. */
  event: "PreToolUse" | "PostToolUse" | "UserPromptSubmit" | "SessionStart" | "Stop";
  /** Tool-name matcher (event-dependent), e.g. "Edit|Write|MultiEdit". */
  matcher?: string;
  /** Absolute path to the hook script (.mjs). */
  script: string;
  /** Absolute path to the hook.json manifest. */
  path: string;
}
```

And extend `Registry`:

```typescript
export interface Registry {
  skills: SkillDefinition[];
  agents: AgentDefinition[];
  workflows: WorkflowDefinition[];
  plugins: PluginDefinition[];
  hooks: HookDefinition[];
  /** Distinct department slugs discovered across skills, agents and plugins. */
  departments: string[];
}
```

- [ ] **Step 5: Add `loadHooks` to the loader**

In `packages/core/src/registry/loader.ts`:

Add `HookDefinition` to the type import list. Then add after `loadPlugins`:

```typescript
const HOOK_EVENTS = [
  "PreToolUse",
  "PostToolUse",
  "UserPromptSubmit",
  "SessionStart",
  "Stop",
] as const;

/** Load hooks from artifacts/hooks/<name>/hook.json (+ hook.mjs script). */
function loadHooks(paths: WzrdxPaths): HookDefinition[] {
  const out: HookDefinition[] = [];
  for (const name of dirs(paths.hooks)) {
    const manifest = join(paths.hooks, name, "hook.json");
    const script = join(paths.hooks, name, "hook.mjs");
    if (!existsSync(manifest) || !existsSync(script)) continue;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(readFileSync(manifest, "utf8"));
    } catch {
      continue; // malformed manifest: skip, doctor reports separately
    }
    const event = HOOK_EVENTS.includes(parsed.event as never)
      ? (parsed.event as HookDefinition["event"])
      : "PreToolUse";
    out.push({
      name: str(parsed.name, name),
      description: str(parsed.description),
      event,
      matcher: str(parsed.matcher) || undefined,
      script,
      path: manifest,
    });
  }
  return out;
}
```

In `loadRegistry`, load and return them:

```typescript
export function loadRegistry(root?: string): Registry {
  const paths = wzrdxPaths(root);
  const skills = loadSkills(paths);
  const agents = loadAgents(paths);
  const workflows = loadWorkflows(paths);
  const plugins = loadPlugins(paths);
  const hooks = loadHooks(paths);
  const departments = [
    ...new Set([
      ...skills.map((s) => s.department),
      ...agents.map((a) => a.department),
      ...plugins.map((p) => p.department),
    ]),
  ].sort();
  return { skills, agents, workflows, plugins, hooks, departments };
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm --filter @wzrdx/core exec vitest run test/hooks.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 7: Typecheck and run the full suite (guards against regressions)**

Run: `pnpm --filter @wzrdx/core typecheck && pnpm --filter @wzrdx/core test`
Expected: PASS everywhere.

- [ ] **Step 8: Commit**

```bash
git add packages/core/src/paths.ts packages/core/src/registry packages/core/test/hooks.test.ts
git commit -m "feat(core): hooks artifact type in registry"
```

---

### Task 3: Deploy hooks (script copy + settings.json surgical merge)

**Files:**
- Modify: `packages/core/src/paths.ts:46-62` (ClaudePaths)
- Modify: `packages/core/src/artifact-install.ts`
- Modify: `packages/core/src/commands/setup.ts:135`
- Test: `packages/core/test/artifact-install.test.ts`

- [ ] **Step 1: Write the failing tests**

In `packages/core/test/artifact-install.test.ts`, add inside the existing `describe` (reusing `root`; note each test gets its own temp home to avoid cross-test state — add a small helper):

```typescript
import { mkdirSync, writeFileSync } from "node:fs"; // extend the existing fs import

it("deploys hooks and merges settings.json idempotently", () => {
  const report = installClaudeArtifacts(root, home);
  expect(report.hooks).toBeGreaterThanOrEqual(1);

  const script = join(home, ".claude", "wzrdx", "hooks", "sdd-gate.mjs");
  expect(existsSync(script)).toBe(true);

  const settingsPath = join(home, ".claude", "settings.json");
  const settings = JSON.parse(readFileSync(settingsPath, "utf8"));
  const entries = settings.hooks.PreToolUse.filter((e: { hooks: { command: string }[] }) =>
    e.hooks.some((h) => h.command.includes("wzrdx/hooks")),
  );
  expect(entries).toHaveLength(1);
  expect(entries[0].matcher).toBe("Edit|Write|MultiEdit");

  // Idempotency: re-running must not duplicate the entry.
  installClaudeArtifacts(root, home);
  const again = JSON.parse(readFileSync(settingsPath, "utf8"));
  const dupes = again.hooks.PreToolUse.filter((e: { hooks: { command: string }[] }) =>
    e.hooks.some((h) => h.command.includes("wzrdx/hooks")),
  );
  expect(dupes).toHaveLength(1);
});

it("preserves pre-existing user hook entries in settings.json", () => {
  const home2 = mkdtempSync(join(tmpdir(), "wzrdx-test-"));
  try {
    mkdirSync(join(home2, ".claude"), { recursive: true });
    writeFileSync(
      join(home2, ".claude", "settings.json"),
      JSON.stringify({
        hooks: {
          PreToolUse: [
            { matcher: "Bash", hooks: [{ type: "command", command: "my-user-hook.sh" }] },
          ],
        },
      }),
    );
    installClaudeArtifacts(root, home2);
    const settings = JSON.parse(
      readFileSync(join(home2, ".claude", "settings.json"), "utf8"),
    );
    const commands = settings.hooks.PreToolUse.flatMap(
      (e: { hooks: { command: string }[] }) => e.hooks.map((h) => h.command),
    );
    expect(commands).toContain("my-user-hook.sh");
    expect(commands.some((c: string) => c.includes("wzrdx/hooks"))).toBe(true);
  } finally {
    rmSync(home2, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @wzrdx/core exec vitest run test/artifact-install.test.ts`
Expected: FAIL — `report.hooks` is undefined / script not deployed.

- [ ] **Step 3: Extend `ClaudePaths`**

In `packages/core/src/paths.ts`:

```typescript
/** Claude Code install targets (where generated artifacts are deployed). */
export interface ClaudePaths {
  home: string;
  skills: string;
  agents: string;
  workflows: string;
  /** wzrdx-owned hook scripts (never mixed with user files). */
  wzrdxHooks: string;
  /** Claude Code user settings file — merged surgically, wzrdx entries only. */
  settings: string;
}

export function claudePaths(home: string = homedir()): ClaudePaths {
  const base = join(home, ".claude");
  return {
    home: base,
    skills: join(base, "skills"),
    agents: join(base, "agents"),
    workflows: join(base, "workflows"),
    wzrdxHooks: join(base, "wzrdx", "hooks"),
    settings: join(base, "settings.json"),
  };
}
```

- [ ] **Step 4: Implement hook deploy + settings merge**

In `packages/core/src/artifact-install.ts`:

Extend the report interface:

```typescript
export interface ClaudeInstallReport {
  agents: number;
  skills: number;
  workflows: number;
  hooks: number;
}
```

Add below the workflow deploy block in `installClaudeArtifacts` (before the return), plus two helpers at module level:

```typescript
  // Hooks → ~/.claude/wzrdx/hooks/<name>.mjs + surgical settings.json merge.
  mkdirSync(claude.wzrdxHooks, { recursive: true });
  for (const h of reg.hooks) {
    copyFileSync(h.script, join(claude.wzrdxHooks, `${h.name}.mjs`));
  }
  mergeHookSettings(claude, reg.hooks);

  return {
    agents: reg.agents.length,
    skills: reg.skills.length,
    workflows: reg.workflows.length,
    hooks: reg.hooks.length,
  };
```

```typescript
import type { HookDefinition } from "./registry/types.js";
import type { ClaudePaths } from "./paths.js";

/** wzrdx-managed hook entries are recognized by their command path — no
 * foreign keys are added to the user's settings schema. */
function isWzrdxHookEntry(entry: unknown): boolean {
  const hooks = (entry as { hooks?: { command?: unknown }[] })?.hooks;
  return (
    Array.isArray(hooks) &&
    hooks.some(
      (h) =>
        typeof h?.command === "string" &&
        h.command.includes(join(".claude", "wzrdx", "hooks")),
    )
  );
}

/**
 * Merge wzrdx hook entries into ~/.claude/settings.json. Surgical and
 * idempotent: strips previous wzrdx-managed entries (recognized by command
 * path) from every event array, appends the current set, and never touches
 * user-owned entries. If the existing file is unparseable, it is left alone
 * (hooks are then simply not registered — doctor can report this later).
 */
function mergeHookSettings(claude: ClaudePaths, hooks: HookDefinition[]): void {
  let settings: Record<string, unknown> = {};
  if (existsSync(claude.settings)) {
    try {
      settings = JSON.parse(readFileSync(claude.settings, "utf8"));
    } catch {
      return; // never clobber an unparseable user file
    }
  }
  const events = (settings.hooks ??= {}) as Record<string, unknown[]>;
  for (const key of Object.keys(events)) {
    if (Array.isArray(events[key])) {
      events[key] = events[key].filter((e) => !isWzrdxHookEntry(e));
    }
  }
  for (const h of hooks) {
    const list = Array.isArray(events[h.event]) ? events[h.event] : [];
    list.push({
      matcher: h.matcher ?? "",
      hooks: [
        {
          type: "command",
          command: `node "${join(claude.wzrdxHooks, `${h.name}.mjs`)}"`,
        },
      ],
    });
    events[h.event] = list;
  }
  mkdirSync(dirname(claude.settings), { recursive: true });
  writeFileSync(claude.settings, JSON.stringify(settings, null, 2) + "\n", "utf8");
}
```

(`copyFileSync`, `dirname` are already imported in this file.)

- [ ] **Step 5: Update the setup summary line**

In `packages/core/src/commands/setup.ts:135`, change:

```typescript
ui.ok(`deployed ${art.agents} agents · ${art.skills} skills · ${art.workflows} workflows · ${art.hooks} hooks → ~/.claude`);
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm --filter @wzrdx/core typecheck && pnpm --filter @wzrdx/core test`
Expected: PASS — including the two new deploy tests.

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/paths.ts packages/core/src/artifact-install.ts packages/core/src/commands/setup.ts packages/core/test/artifact-install.test.ts
git commit -m "feat(core): deploy hooks with surgical settings.json merge"
```

---

### Task 4: Registry test for the three M5 workflows

**Files:**
- Test: `packages/core/test/workflows-m5.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/core/test/workflows-m5.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);
const reg = loadRegistry(root);

const M5_WORKFLOWS = ["loop-until-dry", "multi-modal-sweep", "completeness-critic"];

describe("M5 quality-pattern workflows", () => {
  it.each(M5_WORKFLOWS)("%s is registered with parseable meta", (name) => {
    const wf = reg.workflows.find((w) => w.name === name);
    expect(wf).toBeDefined();
    expect(wf?.description).toBeTruthy();
    expect(wf?.phases).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @wzrdx/core exec vitest run test/workflows-m5.test.ts`
Expected: FAIL — 3 tests, workflows not found.

- [ ] **Step 3: Commit the failing test alongside Task 5's first workflow** (no separate commit here; proceed to Task 5).

---

### Task 5: `loop-until-dry` workflow

**Files:**
- Create: `artifacts/workflows/loop-until-dry/workflow.mjs`

- [ ] **Step 1: Write the workflow**

Create `artifacts/workflows/loop-until-dry/workflow.mjs`:

```javascript
export const meta = {
  name: "loop-until-dry",
  description:
    "Unknown-size discovery: rounds of parallel finders keep searching until K consecutive rounds surface nothing new; every finding deduped against all seen.",
  phases: [{ title: "Find" }],
};

// wzrdxOS quality-pattern workflow (docs/formats.md → Workflows).
// Pass the discovery goal via `args`:
//   { prompt: "what to find", finders?: 3, dryRounds?: 2, maxRounds?: 6 }
// or a plain string (used as the prompt).
// The registry reads `meta` statically and never executes this body.

const FINDINGS_SCHEMA = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          location: { type: "string", description: "file, doc or place" },
          detail: { type: "string" },
        },
        required: ["title", "detail"],
      },
    },
  },
  required: ["findings"],
};

const prompt = typeof args === "string" ? args : (args?.prompt ?? "");
if (!prompt) {
  return { error: "args.prompt is required", found: [], rounds: 0, wentDry: false };
}
const finders = Number(args?.finders) || 3;
const dryRounds = Number(args?.dryRounds) || 2;
const maxRounds = Number(args?.maxRounds) || 6;

const key = (f) => `${f.title}::${f.location ?? ""}`.toLowerCase();
const seen = new Set();
const found = [];
let dry = 0;
let round = 0;

while (dry < dryRounds && round < maxRounds) {
  round += 1;
  const batches = await parallel(
    Array.from({ length: finders }, (_, i) => () =>
      agent(
        `${prompt}\n\nYou are finder ${i + 1} of ${finders} in round ${round}. ` +
          "Take an angle the other finders are unlikely to take. Report every " +
          "distinct finding with a stable title and its location.",
        { label: `find:r${round}:${i + 1}`, phase: "Find", schema: FINDINGS_SCHEMA },
      ),
    ),
  );
  // Dedup against ALL seen (not just confirmed) so rejected repeats never
  // reset the dry counter.
  const fresh = batches
    .filter(Boolean)
    .flatMap((b) => b.findings)
    .filter((f) => !seen.has(key(f)));
  if (fresh.length === 0) {
    dry += 1;
    log(`round ${round}: dry (${dry}/${dryRounds})`);
    continue;
  }
  dry = 0;
  for (const f of fresh) {
    seen.add(key(f));
    found.push(f);
  }
  log(`round ${round}: ${fresh.length} new findings (${found.length} total)`);
}

const wentDry = dry >= dryRounds;
if (!wentDry) {
  log(`stopped at maxRounds=${maxRounds} before going dry — coverage may be incomplete`);
}
return { found, rounds: round, wentDry };
```

- [ ] **Step 2: Run the registry test**

Run: `pnpm --filter @wzrdx/core exec vitest run test/workflows-m5.test.ts`
Expected: `loop-until-dry` test PASSES, the other two still FAIL.

Note: do NOT use `node --check` on workflow scripts — the Workflow tool injects
`args`/`agent`/`parallel`/`log` as globals and allows top-level `return`, which
plain ESM parsing rejects. The registry meta-extraction test is the validation,
matching how the three existing workflows are covered.

- [ ] **Step 3: Commit**

```bash
git add artifacts/workflows/loop-until-dry packages/core/test/workflows-m5.test.ts
git commit -m "feat(workflows): loop-until-dry quality pattern"
```

---

### Task 6: `multi-modal-sweep` workflow

**Files:**
- Create: `artifacts/workflows/multi-modal-sweep/workflow.mjs`

- [ ] **Step 1: Write the workflow**

Create `artifacts/workflows/multi-modal-sweep/workflow.mjs`:

```javascript
export const meta = {
  name: "multi-modal-sweep",
  description:
    "Exhaustive search via independent angles: one blind agent per mode (by-structure, by-content, by-entity, by-history), merged and deduped with per-mode coverage reporting.",
  phases: [{ title: "Sweep" }, { title: "Merge" }],
};

// wzrdxOS quality-pattern workflow (docs/formats.md → Workflows).
// Pass the search goal via `args`:
//   { goal: "what to find", modes?: ["by-structure", "by-content", ...] }
// or a plain string (used as the goal).
// Each mode agent is blind to the others — diversity catches what a single
// search angle misses. No silent caps: per-mode coverage is always reported.
// The registry reads `meta` statically and never executes this body.

const ITEMS_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          location: { type: "string" },
          detail: { type: "string" },
        },
        required: ["title", "detail"],
      },
    },
    coverage: {
      type: "string",
      description: "what was searched and what was NOT covered by this mode",
    },
  },
  required: ["items", "coverage"],
};

const goal = typeof args === "string" ? args : (args?.goal ?? "");
if (!goal) {
  return { error: "args.goal is required", items: [], coverage: [] };
}
const modes =
  Array.isArray(args?.modes) && args.modes.length > 0
    ? args.modes
    : ["by-structure", "by-content", "by-entity", "by-history"];

// Barrier justified: the merge/dedup needs ALL sweep results together.
const sweeps = await parallel(
  modes.map((mode) => () =>
    agent(
      `${goal}\n\nSearch ONLY through the "${mode}" angle. Do not attempt other ` +
        "angles — other agents cover those. Report every item you find and " +
        "state explicitly what your angle could NOT cover.",
      { label: `sweep:${mode}`, phase: "Sweep", schema: ITEMS_SCHEMA },
    ).then((r) => ({ mode, ...(r ?? { items: [], coverage: "agent failed" }) })),
  ),
);

const seen = new Set();
const items = [];
let duplicates = 0;
for (const s of sweeps.filter(Boolean)) {
  for (const it of s.items) {
    const k = `${it.title}::${it.location ?? ""}`.toLowerCase();
    if (seen.has(k)) {
      duplicates += 1;
      continue;
    }
    seen.add(k);
    items.push({ ...it, mode: s.mode });
  }
}

const coverage = sweeps
  .filter(Boolean)
  .map((s) => ({ mode: s.mode, found: s.items.length, coverage: s.coverage }));
log(`${items.length} unique items across ${modes.length} modes (${duplicates} duplicates merged)`);

return { items, coverage };
```

- [ ] **Step 2: Run the registry test**

Run: `pnpm --filter @wzrdx/core exec vitest run test/workflows-m5.test.ts`
Expected: 2 of 3 tests PASS (`completeness-critic` still failing).

- [ ] **Step 3: Commit**

```bash
git add artifacts/workflows/multi-modal-sweep
git commit -m "feat(workflows): multi-modal-sweep quality pattern"
```

---

### Task 7: `completeness-critic` workflow

**Files:**
- Create: `artifacts/workflows/completeness-critic/workflow.mjs`

- [ ] **Step 1: Write the workflow**

Create `artifacts/workflows/completeness-critic/workflow.mjs`:

```javascript
export const meta = {
  name: "completeness-critic",
  description:
    "Final completeness check on any deliverable: parallel critics ask what is missing — work not run, claims unverified, sources unread. Output is the next round of work.",
  phases: [{ title: "Critique" }],
};

// wzrdxOS quality-pattern workflow (docs/formats.md → Workflows).
// Pass the deliverable via `args`:
//   { deliverable: "text or file path", context?: "what the deliverable is for" }
// or a plain string (used as the deliverable).
// Designed to run as the LAST step of other workflows and skills
// (deliverable-review, daily-digest): what it finds becomes the next round.
// The registry reads `meta` statically and never executes this body.

const GAPS_SCHEMA = {
  type: "object",
  properties: {
    gaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["missing-work", "unverified-claim", "unread-source", "other"],
          },
          description: { type: "string" },
          suggestedAction: { type: "string" },
        },
        required: ["type", "description", "suggestedAction"],
      },
    },
  },
  required: ["gaps"],
};

const deliverable = typeof args === "string" ? args : (args?.deliverable ?? "");
if (!deliverable) {
  return { error: "args.deliverable is required", gaps: [], complete: false };
}
const context = typeof args?.context === "string" ? args.context : "";

const LENSES = [
  {
    key: "missing-work",
    prompt:
      "What work is missing? A step never run, an angle never searched, a case never tested, a section never written.",
  },
  {
    key: "unverified-claims",
    prompt:
      "Which claims are unverified? Numbers not double-checked, statements without evidence, conclusions that do not follow from what was actually done.",
  },
  {
    key: "unread-sources",
    prompt:
      "Which sources were cited, referenced or obviously relevant but never actually read or consulted?",
  },
];

const critiques = await parallel(
  LENSES.map((lens) => () =>
    agent(
      `You are a completeness critic reviewing a deliverable through one lens only.\n\n` +
        `Lens: ${lens.prompt}\n\n` +
        (context ? `Context: ${context}\n\n` : "") +
        `Deliverable:\n${deliverable}\n\n` +
        "Report only genuine gaps — an empty list is a valid answer. For each gap, " +
        "state the concrete next action that would close it.",
      { label: `critic:${lens.key}`, phase: "Critique", schema: GAPS_SCHEMA },
    ),
  ),
);

const seen = new Set();
const gaps = [];
for (const c of critiques.filter(Boolean)) {
  for (const g of c.gaps) {
    const k = g.description.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    gaps.push(g);
  }
}

log(gaps.length === 0 ? "no gaps found — deliverable is complete" : `${gaps.length} gaps found`);
return { gaps, complete: gaps.length === 0 };
```

- [ ] **Step 2: Run the full registry test**

Run: `pnpm --filter @wzrdx/core exec vitest run test/workflows-m5.test.ts`
Expected: all 3 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add artifacts/workflows/completeness-critic
git commit -m "feat(workflows): completeness-critic quality pattern"
```

---

### Task 8: `core:product-lifecycle` skill (+ evals)

**Files:**
- Create: `artifacts/skills/core/product-lifecycle/SKILL.md`
- Create: `artifacts/skills/core/product-lifecycle/evals/evals.json`
- Create: `artifacts/skills/core/product-lifecycle/evals/trigger_eval.json`

The `skills-contract.test.ts` already enforces the body contract (`kb_search|kb_ask`, `kb_ingest`, "red flags") and the canonical id — writing the skill and running the suite IS the test loop here.

- [ ] **Step 1: Run the contract test to observe the current green baseline**

Run: `pnpm --filter @wzrdx/core exec vitest run test/skills-contract.test.ts`
Expected: PASS (baseline before adding the skill).

- [ ] **Step 2: Write the SKILL.md**

Create `artifacts/skills/core/product-lifecycle/SKILL.md`:

```markdown
---
name: core:product-lifecycle
description: >-
  Cross-department product lifecycle orchestrator — drives a product or service
  from idea to monitored launch through six gated phases (CEO gate → Operações →
  Build → Quality gate → Launch → Monitor), with document-first state in
  docs/lifecycle/<slug>.md so the flow is resumable across sessions. Not for
  single-department tasks and not for explaining what a product lifecycle is.
type: process
department: core
when-to-use: >-
  Launching or evolving a product/service end-to-end — "quero lançar um novo
  produto/serviço", "vamos tirar esta ideia do papel", "em que fase está o
  lançamento de X?", resuming a lifecycle in progress, or any initiative that
  must cross CEO decision, operations, build, quality and launch. NOT for a
  task that lives inside a single department (route it directly) and NOT for
  conceptual questions about lifecycles.
---

# Product Lifecycle

Rigid process skill — the lifecycle is THE cross-department flow of wzrdxOS
(docs/org.md). One product = one state file = six phases, each ending in a
gate. Never skip a gate; never run phases out of order. The gate is the flow
itself — no blocking hooks (Constitution: quality by construction).

MCP tools used: `kb_search`, `kb_ask`, `kb_ingest`.
Workflows used at gates:
- `balanced-deliberation` (CEO gate) — in-repo `artifacts/workflows/balanced-deliberation/workflow.mjs`, post-install `~/.claude/workflows/balanced-deliberation.mjs`.
- `adversarial-review` + `judge-panel` (Quality gate) — same locations pattern.
- `completeness-critic` (before Launch) — same locations pattern.

## State file — document-first

The single source of truth is `docs/lifecycle/<product-slug>.md` in the
user's project (create `docs/lifecycle/` if missing):

    ---
    product: <human name>
    slug: <kebab-slug>
    phase: 1-ceo-gate | 2-operations | 3-build | 4-quality-gate | 5-launch | 6-monitor
    status: active | paused | killed | shipped
    gates:
      ceo: pending | go | no-go
      quality: pending | ship | fix-first | escalate
    updated: YYYY-MM-DD
    ---

    ## Log
    - YYYY-MM-DD — <phase> — <what happened, verdicts, links>

On EVERY invocation: read the state file first (if it exists), announce the
current phase, execute or delegate ONLY the current phase, update the state
file, and stop at the next gate. If no state file exists, this is a new
lifecycle — start at Phase 1.

## Phases

### 1. CEO gate
`kb_search`/`kb_ask` for prior initiatives, market context and the company
profile (`wzrdx company`). Run `ceo:initiative-eval` to produce the decision
memo, then the `balanced-deliberation` workflow for the go/no-go. Record the
verdict in the state file (`gates.ceo`). **no-go → status: killed**; document
why and `kb_ingest` the post-mortem. go → Phase 2.

### 2. Operações
COO owns it: task breakdown (one owner per task), POPs for anything that will
repeat (`ops:pop-builder`), launch KPIs wired into `ops:kpi-system`. Output:
an execution plan in the state file log. → Phase 3.

### 3. Build
Eng and Marketing run in parallel:
- Eng: implementation under `eng:spec-driven-development` — the SDD soft-gate
  hook (`artifacts/hooks/sdd-gate/`) reinforces spec-first during this phase.
- Marketing: positioning, offer and launch assets (`marketing:offer-architecture`).
Both report into the state file log. When both are done → Phase 4.

### 4. Quality gate
`core:deliverable-review` over every client-facing output; the
`adversarial-review` workflow over the code; `judge-panel` for critical
deliverables. Record `gates.quality`. **fix-first → back to Phase 3** with the
must-fix list logged. ship → Phase 5.

### 5. Launch
Run `completeness-critic` over the launch checklist first — gaps become
pre-launch tasks. Then execute the launch (comms, deploy, announcement) and
log it. → Phase 6.

### 6. Monitor
Wire actuals into `fin:metrics-dashboard`; compare against the Phase 2 KPIs
at day 7 / day 30. Close with a retro and `kb_ingest` the full lifecycle
summary (`source: lifecycle/<slug>-retro.md`) — learnings feed the next
lifecycle. status: shipped.

## Red flags — STOP if you catch yourself thinking

| Thought | Reality |
|---|---|
| "The CEO gate is obvious, skip it" | The gate exists because obvious-looking initiatives fail; run it. |
| "We can build while the CEO decides" | no-go after build = wasted build. Gates are sequential. |
| "Quality can review after launch" | Post-launch review is a post-mortem, not a gate. |
| "No need to update the state file now" | Un-logged state dies with the session; the file IS the lifecycle. |
| "This is single-department, but I'll lifecycle it anyway" | Route single-department work directly; the lifecycle is for cross-department initiatives. |
```

- [ ] **Step 3: Write the functional evals**

Create `artifacts/skills/core/product-lifecycle/evals/evals.json`:

```json
{
  "skill_name": "core:product-lifecycle",
  "evals": [
    {
      "id": 1,
      "prompt": "Quero lançar um serviço de auditoria de SEO para PMEs portuguesas — leva-me do zero até ao lançamento.",
      "expected_output": "A new lifecycle: state file created at docs/lifecycle/auditoria-seo-pme.md, Phase 1 executed (KB lookup, initiative eval, balanced-deliberation go/no-go), verdict recorded, and a stop at the Phase 2 gate.",
      "expectations": [
        "The skill calls kb_search or kb_ask before any phase work.",
        "A state file under docs/lifecycle/ is created with frontmatter (product, slug, phase, status, gates).",
        "Phase 1 runs ceo:initiative-eval and the balanced-deliberation workflow before anything else.",
        "The go/no-go verdict is recorded in gates.ceo and the log.",
        "The skill stops at the next gate instead of executing later phases."
      ]
    },
    {
      "id": 2,
      "prompt": "Em que ponto está o lançamento do produto X? Continua a partir de onde ficámos.",
      "expected_output": "The state file docs/lifecycle/produto-x.md is read first, the current phase announced, and ONLY that phase executed/delegated, ending with an updated state file.",
      "expectations": [
        "The state file is read before any action.",
        "The current phase is announced explicitly to the user.",
        "Only the current phase is executed — no phase skipping.",
        "The state file is updated (phase/gates/log) before the skill ends."
      ]
    },
    {
      "id": 3,
      "prompt": "O quality gate deu fix-first ao produto Y. E agora?",
      "expected_output": "Return to Phase 3 (Build) with the must-fix list logged in the state file; the lifecycle does not advance to Launch until a new quality verdict of ship.",
      "expectations": [
        "gates.quality = fix-first is recorded in the state file.",
        "The lifecycle moves back to Phase 3 — not forward to Phase 5.",
        "The must-fix list is written to the state file log.",
        "A kb_ingest documents the quality verdict and rework decision."
      ]
    }
  ]
}
```

- [ ] **Step 4: Write the trigger evals**

Create `artifacts/skills/core/product-lifecycle/evals/trigger_eval.json`:

```json
[
  { "query": "Quero lançar um novo serviço de auditoria de IA — leva-me da ideia até ao lançamento.", "should_trigger": true },
  { "query": "Vamos tirar do papel aquela ideia do produto de relatórios automáticos.", "should_trigger": true },
  { "query": "Em que fase está o lançamento do serviço de SEO? Continua de onde ficámos.", "should_trigger": true },
  { "query": "I want to take this product idea from concept to a monitored launch.", "should_trigger": true },
  { "query": "O quality gate deu fix-first ao produto novo — o que acontece agora no fluxo?", "should_trigger": true },
  { "query": "Retoma o ciclo de vida do produto wzrdx-templates.", "should_trigger": true },
  { "query": "We got a go from the CEO gate on the new offer — what's the next phase?", "should_trigger": true },
  { "query": "Quero transformar este protótipo num produto lançado e monitorizado, com todos os gates.", "should_trigger": true },
  { "query": "Start the product lifecycle for our new consulting retainer offering.", "should_trigger": true },
  { "query": "Este lançamento envolve CEO, operações, engenharia, marketing e qualidade — orquestra o processo todo.", "should_trigger": true },
  { "query": "O que é um product lifecycle e porque é que importa?", "should_trigger": false },
  { "query": "Implementa a página de checkout do produto.", "should_trigger": false },
  { "query": "Escreve o copy de lançamento para a campanha de email.", "should_trigger": false },
  { "query": "Devemos avançar com a contratação do primeiro comercial?", "should_trigger": false },
  { "query": "Review this proposal before I send it to the client.", "should_trigger": false },
  { "query": "Faz o diagnóstico operacional da WizardingCode.", "should_trigger": false },
  { "query": "What KPIs should a SaaS track after launch?", "should_trigger": false },
  { "query": "Cria um POP para o processo de onboarding de clientes.", "should_trigger": false },
  { "query": "Preciso de uma análise de unit economics do serviço atual.", "should_trigger": false },
  { "query": "Explica-me as fases de desenvolvimento de software.", "should_trigger": false }
]
```

- [ ] **Step 5: Run the contract test to verify the new skill passes it**

Run: `pnpm --filter @wzrdx/core exec vitest run test/skills-contract.test.ts`
Expected: PASS — the new skill satisfies id (`core:product-lifecycle`), KB-first, `kb_ingest` and "red flags".

- [ ] **Step 6: Commit**

```bash
git add artifacts/skills/core/product-lifecycle
git commit -m "feat(skills): core:product-lifecycle cross-department flow"
```

---

### Task 9: Documentation (formats.md, roadmap.md)

**Files:**
- Modify: `docs/formats.md` (new section after Workflows, ~line 64; flow-policy paragraph ~line 94)
- Modify: `docs/roadmap.md` (M5 status)

- [ ] **Step 1: Add the Hooks section to formats.md**

Insert after the Workflows section (after the line pointing to `artifacts/workflows/adversarial-review/`):

```markdown
## Hooks — `artifacts/hooks/<name>/hook.mjs` + `hook.json`

A native runtime hook: a dependency-free Node script plus a JSON manifest.

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Unique id (falls back to the directory name). |
| `description` | yes | One-line summary. |
| `event` | yes | `PreToolUse` \| `PostToolUse` \| `UserPromptSubmit` \| `SessionStart` \| `Stop`. |
| `matcher` | no | Tool-name matcher, e.g. `Edit\|Write\|MultiEdit`. |

**wzrdx hooks are ALWAYS non-blocking** — they inject context or reminders
(`permissionDecision: "allow"` + `additionalContext`) and never `deny`/`ask`.
They are fail-open: any internal error exits 0 silently. See the Flow policy
below — this is the enforcement style that replaces ArkaOS's blocking gates.

Deploy: script → `~/.claude/wzrdx/hooks/<name>.mjs`; the hook entry is merged
into `~/.claude/settings.json` surgically and idempotently — wzrdx-managed
entries are recognized by their command path (`.claude/wzrdx/hooks/`), user
entries are never touched, and an unparseable settings file is left alone.
This is the one documented, surgical exception to "user files are never
touched": settings.json is the only place Claude Code reads hooks from.
```

- [ ] **Step 2: Amend the flow-policy paragraph**

In the "Flow policy" section of `docs/formats.md`, replace the existing paragraph with:

```markdown
wzrdxOS never ships **blocking enforcement hooks**. The flow is opt-in: a workflow
the user chooses, not a gate that stalls work. This is the explicit anti-pattern
inherited from ArkaOS. Hooks ARE allowed — but only non-blocking ones: they may
inject context and reminders at the right moment (e.g. the `sdd-gate` spec-first
nudge) and must always allow the action, fail-open, and rate-limit themselves
(once per session).
```

- [ ] **Step 3: Update the roadmap**

In `docs/roadmap.md`, under "Open design sessions", add after the M4 entry:

```markdown
- **M5 — Workflows:** ✅ **closed.** Quality-pattern library completed
  (loop-until-dry, multi-modal-sweep, completeness-critic — joining
  adversarial-review, judge-panel, balanced-deliberation);
  `core:product-lifecycle` skill (document-first state in
  `docs/lifecycle/<slug>.md`, six gated phases); hooks as a fourth artifact
  type + `sdd-gate` non-blocking PreToolUse hook resolving finding C1
  (spec: `docs/superpowers/specs/2026-07-02-m5-workflow-library-sdd-gate-design.md`;
  measurement: `docs/eval-baseline.md` → M5 section).
```

(If the measurement in Task 10 is still pending at this point, mark the entry
"✅ implementation done, measurement pending" and finalize it in Task 10.)

- [ ] **Step 4: Commit**

```bash
git add docs/formats.md docs/roadmap.md
git commit -m "docs(formats): hooks artifact type + amended flow policy"
```

---

### Task 10: Deploy locally and measure C1 (SDD gate re-run)

**Files:**
- Modify: `docs/eval-baseline.md` (new M5 section)

This task runs against the REAL environment (deployed skills + active hook),
like the M4 baseline. It costs real `claude -p` runs (~40 queries × 2).

- [ ] **Step 1: Build and deploy**

Run: `pnpm --filter @wzrdx/core build && node packages/core/dist/cli.js setup`
Expected: setup summary includes `… · 1 hooks → ~/.claude`. Verify:
`cat ~/.claude/settings.json | python3 -m json.tool | grep -A3 wzrdx` shows the PreToolUse entry, and `ls ~/.claude/wzrdx/hooks/` shows `sdd-gate.mjs`.

- [ ] **Step 2: Sanity-check the hook end-to-end**

In a scratch project directory without recent specs, run a single probe:
`claude -p "add a small helper function to src/util.ts that trims whitespace" --output-format stream-json --verbose | grep -i "sdd"` — expect the SDD reminder to appear in the transcript context. If the `additionalContext` field is not honored by the installed Claude Code version, check the current PreToolUse hook output schema (`claude-code-guide` agent or docs) and adjust `hook.mjs` — keeping `permissionDecision: "allow"` invariant.

- [ ] **Step 3: Re-run the SDD trigger eval with the hook active**

Run:

```bash
python3 scripts/trigger_eval.py \
  --eval-set artifacts/skills/eng/spec-driven-development/evals/trigger_eval.json \
  --skill wzrdx-eng-spec-driven-development \
  --runs 2 > /tmp/m5-sdd-eval.json
python3 -m json.tool /tmp/m5-sdd-eval.json | tail -20
```

Expected: summary shows should-trigger ≥ 8/10 (M4 baseline: 5/10). The hook
fires on the Edit/Write attempt and nudges the model into the SDD skill.

- [ ] **Step 4: Record the measurement in eval-baseline.md**

Append to `docs/eval-baseline.md`:

```markdown
## M5 — SDD gate re-measurement (hook active)

Finding C1 follow-up: with the `sdd-gate` non-blocking PreToolUse hook
deployed, `eng:spec-driven-development` re-measured with the ecological
runner (same eval-set, runs=2):

| Metric | M4 baseline | M5 (hook active) |
|---|---|---|
| should-trigger | 5/10 | <measured>/10 |
| should-NOT | 9/10 | <measured>/10 |

Acceptance (spec): should-trigger ≥ 8/10. <verdict + 1-2 sentence analysis;
if below target, record why and what the next structural step would be.>
```

Fill in the real numbers from Step 3 — this table must not be committed with
placeholders. If the target is missed, still commit the honest numbers and
analysis; the acceptance decision then goes back to the user.

- [ ] **Step 5: Commit**

```bash
git add docs/eval-baseline.md docs/roadmap.md
git commit -m "docs(evals): M5 SDD-gate measurement with hook active"
```

---

### Task 11: Final verification and PR

- [ ] **Step 1: Full local CI parity**

Run: `pnpm -r typecheck && pnpm -r build && pnpm -r test`
Expected: everything green (vitest for core, pytest untouched).

- [ ] **Step 2: Commitlint parity check** (M4's PR was blocked by this)

Run: `npx commitlint --from main --to HEAD`
Expected: no violations.

- [ ] **Step 3: Push and open the PR**

```bash
git push -u origin feat/m5-workflows
gh pr create --title "feat: M5 — workflow library + SDD soft-gate" --body "$(cat <<'EOF'
## M5 — Workflow library + SDD soft-gate

Spec: docs/superpowers/specs/2026-07-02-m5-workflow-library-sdd-gate-design.md

- 3 new quality-pattern workflows: loop-until-dry, multi-modal-sweep, completeness-critic
- core:product-lifecycle skill — six gated phases, document-first state (docs/lifecycle/<slug>.md)
- Hooks as a fourth artifact type (registry + deploy with surgical settings.json merge)
- sdd-gate non-blocking PreToolUse hook — resolves eval-baseline finding C1 without violating the flow policy
- Measurement: docs/eval-baseline.md → M5 section (SDD should-trigger with hook active)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Watch CI to green, then hand the merge decision to the user.**

---

## Self-review notes (spec coverage)

- Spec "SDD soft-gate" → Tasks 1-3, 10. ✔
- Spec "3 quality patterns" → Tasks 4-7. ✔
- Spec "product-lifecycle skill + evals" → Task 8. ✔
- Spec "docs (formats/roadmap/eval-baseline)" → Tasks 9-10. ✔ (org.md mentioned in the spec as "atualização" — the lifecycle flow is already described there from M3; only touch it if the implementer finds a contradiction with the new skill, otherwise skip: YAGNI.)
- Spec "registry contract test estendido" → Tasks 2, 4 (hooks.test.ts + workflows-m5.test.ts run in the existing CI vitest step; no CI config change needed). ✔
- Deferred (per spec, out of scope): functional with/without benchmark, hook deploy to non-Claude runtimes, artifact pruning.
```
