import { describe, expect, it } from "vitest";
import { loadRegistry } from "../src/registry/loader.js";
import { findRepoRoot } from "../src/paths.js";

const root = findRepoRoot(import.meta.dirname);
const reg = loadRegistry(root);

const M5_WORKFLOWS = ["loop-until-dry", "multi-modal-sweep", "completeness-critic"];

describe("M5 quality-pattern workflows", () => {
  it.each(M5_WORKFLOWS)("%s is registered with parseable meta", (name) => {
    const wf = reg.workflows.find((w) => w.name === name);
    expect(wf).toBeDefined();
    expect(wf?.description).toBeTruthy();
    expect(wf?.phases).toBeGreaterThanOrEqual(1);
  });
});
