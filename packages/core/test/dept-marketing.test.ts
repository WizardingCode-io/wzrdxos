import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("marketing department", () => {
  it("loads the CMO agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const cmo = reg.agents.find((a) => a.name === "cmo");
    expect(cmo?.department).toBe("marketing");
    expect(cmo?.tier).toBe(0);
    expect(cmo?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("marketing:rebranding-execution");
    expect(ids).toContain("marketing:geo-content");
    expect(ids).toContain("marketing:offer-architecture");
    expect(ids).toContain("marketing:hook-viral-system");
    expect(ids).toContain("marketing:status-engineering");
    expect(reg.plugins.filter((p) => p.department === "marketing").length).toBeGreaterThanOrEqual(6);
    expect(reg.departments).toContain("marketing");
  });
});
