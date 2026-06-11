import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("eng department", () => {
  it("loads the CTO agent, phase-1 skills and plugin manifest", () => {
    const reg = loadRegistry(root);
    const cto = reg.agents.find((a) => a.name === "cto");
    expect(cto?.department).toBe("eng");
    expect(cto?.tier).toBe(0);
    expect(cto?.model).toBe("opus");
    const ids = reg.skills.map((s) => s.name);
    expect(ids).toContain("eng:spec-driven-development");
    expect(ids).toContain("eng:tech-stack-eval");
    expect(ids).toContain("eng:ai-agent-architecture");
    expect(ids).toContain("eng:mcp-integrator");
    expect(ids).toContain("eng:aios-operating-model");
    expect(ids).toContain("eng:token-cost-optimization");
    const sdd = reg.skills.find((s) => s.name === "eng:spec-driven-development");
    expect(sdd?.type).toBe("process");
    expect(reg.plugins.filter((p) => p.department === "eng").length).toBeGreaterThanOrEqual(7);
    expect(reg.departments).toContain("eng");
  });
});
