import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);
const reg = loadRegistry(root);

describe("hooks registry", () => {
  it("loads the sdd-gate hook with manifest fields", () => {
    const hook = reg.hooks.find((h) => h.name === "sdd-gate");
    expect(hook).toBeDefined();
    expect(hook?.event).toBe("PreToolUse");
    expect(hook?.matcher).toBe("Edit|Write|MultiEdit");
    expect(hook?.description).toBeTruthy();
    expect(hook?.script.endsWith("hook.mjs")).toBe(true);
  });

  it("every hook has a manifest and a script", () => {
    for (const h of reg.hooks) {
      expect(h.name, h.path).toBeTruthy();
      expect(h.description, h.path).toBeTruthy();
      expect(h.script, h.path).toBeTruthy();
    }
  });
});
