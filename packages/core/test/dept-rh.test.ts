import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("rh department", () => {
  it("loads the CHRO agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const chro = reg.agents.find((a) => a.name === "chro");
    expect(chro?.department).toBe("rh");
    expect(chro?.tier).toBe(0);
    expect(chro?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("rh:hiring-pipeline");
    expect(ids).toContain("rh:onboarding-60d");
    expect(reg.plugins.filter((p) => p.department === "rh").length).toBeGreaterThanOrEqual(5);
    expect(reg.departments).toContain("rh");
  });

  it("loads phase-2 skill: rh:delegation-coach", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("rh:delegation-coach");
  });

  it("loads phase-2 skill: rh:culture-foundation", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("rh:culture-foundation");
  });

  it("loads phase-2 skill: rh:comp-ladder", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("rh:comp-ladder");
  });

  it("loads phase-2 skill: rh:founder-transition", () => {
    const reg = loadRegistry(root);
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("rh:founder-transition");
  });
});
