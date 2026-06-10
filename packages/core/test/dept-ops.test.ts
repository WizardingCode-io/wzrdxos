import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("ops department", () => {
  it("loads the COO agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const coo = reg.agents.find((a) => a.name === "coo");
    expect(coo?.department).toBe("ops");
    expect(coo?.tier).toBe(0);
    expect(coo?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("ops:roadmap-diagnose");
    expect(ids).toContain("ops:pop-builder");
    expect(reg.plugins.filter((p) => p.department === "ops").length).toBeGreaterThanOrEqual(5);
    expect(reg.departments).toContain("ops");
  });
});
