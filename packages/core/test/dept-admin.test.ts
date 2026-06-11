import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("admin department", () => {
  it("loads the EA agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const ea = reg.agents.find((a) => a.name === "ea");
    expect(ea?.department).toBe("admin");
    expect(ea?.tier).toBe(1);
    expect(ea?.model).toBe("sonnet");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("admin:buyback-audit");
    expect(ids).toContain("admin:calendar-defense");
    expect(ids).toContain("admin:meeting-discipline");
    expect(reg.plugins.filter((p) => p.department === "admin").length).toBeGreaterThanOrEqual(4);
    expect(reg.departments).toContain("admin");
  });
});
