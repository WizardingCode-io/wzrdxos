import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);
const reg = loadRegistry(root);

// Vendored/legacy exemptions (do not rename third-party content):
const ID_EXEMPT = new Set(["skill-creator"]);

describe("skills contract", () => {
  it("every skill has the required frontmatter and a canonical id", () => {
    for (const s of reg.skills) {
      expect(s.description, s.path).toBeTruthy();
      expect(["process", "capability"]).toContain(s.type);
      expect(s.department, s.path).toBeTruthy();
      if (!ID_EXEMPT.has(s.name)) {
        expect(s.name, s.path).toBe(`${s.department}:${basename(dirname(s.path))}`);
      }
    }
  });

  it("every wzrdx-authored skill honors the KB-first / kb_ingest / red-flags body contract", () => {
    // core:brainstorm is a meta/utility process with no KB loop by design.
    // skill-creator is vendored third-party content.
    const BODY_EXEMPT = new Set(["skill-creator", "core:brainstorm"]);
    for (const s of reg.skills) {
      if (BODY_EXEMPT.has(s.name)) continue;
      const body = readFileSync(s.path, "utf8");
      expect(body, s.path).toMatch(/kb_search|kb_ask/);
      expect(body, s.path).toMatch(/kb_ingest/);
      expect(body.toLowerCase(), s.path).toContain("red flags");
    }
  });
});
