import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, afterEach } from "vitest";
import { readCompany, writeCompany, renderCompanyMd } from "../src/company.js";
import type { CompanyProfile } from "../src/company.js";

const sampleProfile: CompanyProfile = {
  name: "WizardingCode",
  market: "software/AI agency",
  customers: "PMEs PT/EU",
  niche: "AI workforce para PMEs",
  objectives: ["€1M até 2026-12-31", "10 clientes enterprise"],
  updatedAt: "2026-06-11T00:00:00.000Z",
};

let tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const r = mkdtempSync(join(tmpdir(), "wzrdx-company-"));
  tmpRoots.push(r);
  return r;
}

afterEach(() => {
  for (const r of tmpRoots) rmSync(r, { recursive: true, force: true });
  tmpRoots = [];
});

describe("writeCompany / readCompany roundtrip", () => {
  it("writes company.json and company.md and reads back the profile", () => {
    const root = makeTmpRoot();
    const paths = writeCompany(root, sampleProfile);

    expect(paths.jsonPath).toContain(".wzrdx/company.json");
    expect(paths.mdPath).toContain(".wzrdx/company.md");

    const back = readCompany(root);
    expect(back).not.toBeNull();
    expect(back!.name).toBe("WizardingCode");
    expect(back!.market).toBe("software/AI agency");
    expect(back!.customers).toBe("PMEs PT/EU");
    expect(back!.niche).toBe("AI workforce para PMEs");
    expect(back!.objectives).toEqual(["€1M até 2026-12-31", "10 clientes enterprise"]);
    expect(back!.updatedAt).toBe("2026-06-11T00:00:00.000Z");
  });

  it("creates .wzrdx/ directory if it does not exist", () => {
    const root = makeTmpRoot();
    // .wzrdx does not exist inside a fresh tmpdir
    writeCompany(root, sampleProfile);
    const back = readCompany(root);
    expect(back).not.toBeNull();
  });

  it("overwrites an existing profile", () => {
    const root = makeTmpRoot();
    writeCompany(root, sampleProfile);
    writeCompany(root, { ...sampleProfile, name: "Updated Co" });
    const back = readCompany(root);
    expect(back!.name).toBe("Updated Co");
  });
});

describe("readCompany edge cases", () => {
  it("returns null when company.json does not exist", () => {
    const root = makeTmpRoot();
    expect(readCompany(root)).toBeNull();
  });

  it("returns null when company.json contains malformed JSON", () => {
    const root = makeTmpRoot();
    const dir = join(root, ".wzrdx");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "company.json"), "{ this is not valid json", "utf8");
    expect(readCompany(root)).toBeNull();
  });

  it("returns null when company.json has an empty name", () => {
    const root = makeTmpRoot();
    const dir = join(root, ".wzrdx");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "company.json"),
      JSON.stringify({ ...sampleProfile, name: "" }),
      "utf8",
    );
    expect(readCompany(root)).toBeNull();
  });

  it("returns null when company.json is not an object", () => {
    const root = makeTmpRoot();
    const dir = join(root, ".wzrdx");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "company.json"), "null", "utf8");
    expect(readCompany(root)).toBeNull();
  });
});

describe("renderCompanyMd", () => {
  it("contains the company name", () => {
    const md = renderCompanyMd(sampleProfile);
    expect(md).toContain("WizardingCode");
  });

  it("contains the market field", () => {
    const md = renderCompanyMd(sampleProfile);
    expect(md).toContain("software/AI agency");
  });

  it("lists all objectives", () => {
    const md = renderCompanyMd(sampleProfile);
    expect(md).toContain("€1M até 2026-12-31");
    expect(md).toContain("10 clientes enterprise");
  });

  it("includes the source-of-truth note", () => {
    const md = renderCompanyMd(sampleProfile);
    expect(md).toContain("wzrdx company");
  });

  it("handles empty objectives gracefully", () => {
    const md = renderCompanyMd({ ...sampleProfile, objectives: [] });
    expect(md).toContain("(none defined)");
  });
});
