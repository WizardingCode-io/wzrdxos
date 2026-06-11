import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { installInstructions } from "../src/runtime-install.js";
import { RUNTIMES } from "../src/runtimes.js";

const home = mkdtempSync(join(tmpdir(), "wzrdx-instructions-test-"));

afterAll(() => rmSync(home, { recursive: true, force: true }));

describe("installInstructions", () => {
  it("writes a file containing core:conductor and wzrdx-kb references", () => {
    const claude = RUNTIMES.find((rt) => rt.id === "claude");
    if (!claude) throw new Error("claude runtime not found in RUNTIMES");

    const file = installInstructions(claude, home);
    const content = readFileSync(file, "utf8");

    expect(content).toContain("wzrdx-kb");
    expect(content).toContain("core:conductor");
  });

  it("writes the department roster to the instructions block", () => {
    const claude = RUNTIMES.find((rt) => rt.id === "claude");
    if (!claude) throw new Error("claude runtime not found in RUNTIMES");

    const file = installInstructions(claude, home);
    const content = readFileSync(file, "utf8");

    // Verify all department heads are present in the roster line
    expect(content).toContain("ceo");
    expect(content).toContain("coo/ops");
    expect(content).toContain("cto/eng");
    expect(content).toContain("cfo/fin");
    expect(content).toContain("chro/rh");
    expect(content).toContain("cmo/marketing");
    expect(content).toContain("cro/growth");
    expect(content).toContain("cko/knowledge");
    expect(content).toContain("ea/admin");
    expect(content).toContain("cqo");
  });
});
