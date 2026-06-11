import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("fin department", () => {
  it("loads the CFO agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const cfo = reg.agents.find((a) => a.name === "cfo");
    expect(cfo?.department).toBe("fin");
    expect(cfo?.tier).toBe(0);
    expect(cfo?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("fin:metrics-dashboard");
    expect(ids).toContain("fin:unit-economics-audit");
    expect(reg.plugins.filter((p) => p.department === "fin").length).toBeGreaterThanOrEqual(7);
    expect(reg.departments).toContain("fin");
  });

  it("loads phase-2 skill: fin:cfo-4-pilares", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("fin:cfo-4-pilares");
  });

  it("loads phase-2 skill: fin:cash-first-ops", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("fin:cash-first-ops");
  });

  it("loads phase-2 skill: fin:pricing-redesign", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("fin:pricing-redesign");
  });
});
