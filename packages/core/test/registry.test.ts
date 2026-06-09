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
});
