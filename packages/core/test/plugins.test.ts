import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);

describe("plugin manifests", () => {
  it("loads the CEO plugin manifest", () => {
    const reg = loadRegistry(root);
    const ceo = reg.plugins.filter((p) => p.department === "ceo");
    expect(ceo.map((p) => p.name)).toEqual(
      expect.arrayContaining(["wzrdx-kb", "company-profile", "bright-data"]),
    );
    const kb = ceo.find((p) => p.name === "wzrdx-kb");
    expect(kb?.kind).toBe("mcp");
    expect(kb?.status).toBe("required");
  });
});
