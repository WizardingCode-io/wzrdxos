import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

  it("skips malformed and null manifests without crashing", () => {
    const fakeRoot = mkdtempSync(join(tmpdir(), "wzrdx-plugins-"));
    const mk = (dept: string, content: string) => {
      const dir = join(fakeRoot, "artifacts", "plugins", dept);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "plugins.json"), content, "utf8");
    };
    mk("broken", "{ not json");
    mk("nulldept", "null");
    mk("ok", JSON.stringify({ plugins: [{ name: "x", kind: "weird", status: "weird" }] }));

    const reg = loadRegistry(fakeRoot);
    expect(reg.plugins).toHaveLength(1);
    expect(reg.plugins[0]?.name).toBe("x");
    expect(reg.plugins[0]?.kind).toBe("plugin");
    expect(reg.plugins[0]?.status).toBe("optional");

    rmSync(fakeRoot, { recursive: true, force: true });
  });
});
