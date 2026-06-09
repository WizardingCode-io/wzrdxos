import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("registry baseline", () => {
  it("loads the example agent and core skills", () => {
    const reg = loadRegistry(root);
    expect(reg.agents.map((a) => a.name)).toContain("paulo");
    expect(reg.skills.length).toBeGreaterThan(0);
    expect(reg.workflows.map((w) => w.name)).toContain("adversarial-review");
  });

  it("loads the CEO agent with leadership tier and opus model", () => {
    const reg = loadRegistry(root);
    const ceo = reg.agents.find((a) => a.name === "ceo");
    expect(ceo).toBeDefined();
    expect(ceo?.department).toBe("ceo");
    expect(ceo?.tier).toBe(0);
    expect(ceo?.model).toBe("opus");
  });

  it("loads the balanced-deliberation workflow with 2 phases", () => {
    const reg = loadRegistry(root);
    const wf = reg.workflows.find((w) => w.name === "balanced-deliberation");
    expect(wf).toBeDefined();
    expect(wf?.phases).toBe(2);
  });
});
