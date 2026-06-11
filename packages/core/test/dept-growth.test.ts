import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("growth department", () => {
  it("loads the CRO agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const cro = reg.agents.find((a) => a.name === "cro");
    expect(cro?.department).toBe("growth");
    expect(cro?.tier).toBe(0);
    expect(cro?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("growth:sales-machine");
    expect(ids).toContain("growth:deal-pipeline");
    expect(ids).toContain("growth:cold-outreach-engine");
    expect(ids).toContain("growth:dream-100-partnerships");
    expect(reg.plugins.filter((p) => p.department === "growth").length).toBeGreaterThanOrEqual(7);
    expect(reg.departments).toContain("growth");
  });
});
