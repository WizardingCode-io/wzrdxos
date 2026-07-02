import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { installClaudeArtifacts } from "../src/artifact-install.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);
const home = mkdtempSync(join(tmpdir(), "wzrdx-test-"));

afterAll(() => rmSync(home, { recursive: true, force: true }));

describe("installClaudeArtifacts", () => {
  it("deploys agents, skills and workflows with wzrdx- prefix", () => {
    const report = installClaudeArtifacts(root, home);

    const agentFile = join(home, ".claude", "agents", "wzrdx-ceo.md");
    expect(existsSync(agentFile)).toBe(true);
    const agent = readFileSync(agentFile, "utf8");
    expect(agent).toContain("name: wzrdx-ceo");
    expect(agent).toContain("model: opus");
    expect(agent).toContain("You are the CEO of wzrdxOS");

    const skillFile = join(
      home, ".claude", "skills", "wzrdx-ceo-balanced-decision", "SKILL.md",
    );
    expect(existsSync(skillFile)).toBe(true);
    const skill = readFileSync(skillFile, "utf8");
    expect(skill).toContain("name: wzrdx-ceo-balanced-decision");

    const wfFile = join(home, ".claude", "workflows", "balanced-deliberation.mjs");
    expect(existsSync(wfFile)).toBe(true);

    expect(report.agents).toBeGreaterThanOrEqual(1);
    expect(report.skills).toBeGreaterThanOrEqual(2);
    expect(report.workflows).toBeGreaterThanOrEqual(1);

    // Idempotency: re-running must not throw and must return the same counts.
    const report2 = installClaudeArtifacts(root, home);
    expect(report2.agents).toBe(report.agents);
    expect(report2.skills).toBe(report.skills);
    expect(report2.workflows).toBe(report.workflows);
  });

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
});
