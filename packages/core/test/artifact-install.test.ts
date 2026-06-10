import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
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

    const wfFile = join(home, ".claude", "workflows", "balanced-deliberation.mjs");
    expect(existsSync(wfFile)).toBe(true);

    expect(report.agents).toBeGreaterThanOrEqual(1);
    expect(report.skills).toBeGreaterThanOrEqual(2);
    expect(report.workflows).toBeGreaterThanOrEqual(1);
  });
});
