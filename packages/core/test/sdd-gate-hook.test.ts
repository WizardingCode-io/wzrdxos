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
