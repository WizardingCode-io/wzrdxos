import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("routing + rule-6 loops", () => {
  it("loads conductor and the rule-6 skills", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("core:conductor");
    expect(ids).toContain("knowledge:skill-promotion");
    expect(ids).toContain("knowledge:agent-evolution");
    for (const id of ["core:conductor", "knowledge:skill-promotion", "knowledge:agent-evolution"]) {
      expect(reg.skills.find((s) => s.name === id)?.type).toBe("process");
    }
  });
});
