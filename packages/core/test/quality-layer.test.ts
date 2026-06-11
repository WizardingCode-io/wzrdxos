import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("quality transversal layer", () => {
  it("loads the CQO agent, quality skills, judge-panel workflow and core manifest", () => {
    const reg = loadRegistry(root);
    const cqo = reg.agents.find((a) => a.name === "cqo");
    expect(cqo?.department).toBe("core");
    expect(cqo?.tier).toBe(0);
    expect(cqo?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("core:quality-audit");
    expect(ids).toContain("core:deliverable-review");
    const jp = reg.workflows.find((w) => w.name === "judge-panel");
    expect(jp?.phases).toBe(2);
    expect(reg.plugins.filter((p) => p.department === "core").length).toBeGreaterThanOrEqual(5);
    // Quality is transversal: there must be NO "quality" department slug
    expect(reg.departments).not.toContain("quality");
  });
});
