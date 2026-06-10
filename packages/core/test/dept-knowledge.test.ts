import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("knowledge department", () => {
  it("loads the CKO agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const cko = reg.agents.find((a) => a.name === "cko");
    expect(cko?.department).toBe("knowledge");
    expect(cko?.tier).toBe(0);
    expect(cko?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("knowledge:daily-digest");
    expect(ids).toContain("knowledge:kb-enrich");
    const dd = reg.skills.find((s) => s.name === "knowledge:daily-digest");
    expect(dd?.type).toBe("process");
    expect(reg.plugins.filter((p) => p.department === "knowledge").length).toBeGreaterThanOrEqual(4);
    expect(reg.departments).toContain("knowledge");
  });
});
