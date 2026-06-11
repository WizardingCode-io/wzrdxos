import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface CompanyProfile {
  name: string;
  market: string;       // market / industry
  customers: string;    // who pays
  niche: string;        // positioning / niche
  objectives: string[]; // top objectives (e.g. "€1M até 2026-12-31")
  updatedAt: string;    // ISO
}

function wzrdxDir(root: string): string {
  return join(root, ".wzrdx");
}

function jsonPath(root: string): string {
  return join(wzrdxDir(root), "company.json");
}

function mdPath(root: string): string {
  return join(wzrdxDir(root), "company.md");
}

/** Read the company profile from .wzrdx/company.json. Returns null if missing or malformed. */
export function readCompany(root: string): CompanyProfile | null {
  const path = jsonPath(root);
  if (!existsSync(path)) return null;
  try {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    if (
      typeof raw === "object" &&
      raw !== null &&
      typeof raw.name === "string" &&
      raw.name.length > 0
    ) {
      return raw as CompanyProfile;
    }
    return null;
  } catch {
    return null;
  }
}

/** Render the company profile as a human-readable Markdown memo (KB-ingestable). */
export function renderCompanyMd(profile: CompanyProfile): string {
  const objectives =
    profile.objectives.length > 0
      ? profile.objectives.map((o) => `- ${o}`).join("\n")
      : "- (none defined)";

  return `# Company Profile — ${profile.name}

> Source of truth for the \`wzrdx company\` profile.

## Fields

| Field | Value |
|-------|-------|
| **Name** | ${profile.name} |
| **Market / Industry** | ${profile.market} |
| **Customers** | ${profile.customers} |
| **Niche / Positioning** | ${profile.niche} |
| **Last updated** | ${profile.updatedAt} |

## Objectives

${objectives}
`;
}

/**
 * Write the company profile to .wzrdx/company.json and .wzrdx/company.md.
 * Creates the .wzrdx/ directory if it does not exist.
 * Returns the paths written.
 */
export function writeCompany(
  root: string,
  profile: CompanyProfile,
): { jsonPath: string; mdPath: string } {
  const dir = wzrdxDir(root);
  mkdirSync(dir, { recursive: true });

  const jp = jsonPath(root);
  const mp = mdPath(root);

  writeFileSync(jp, JSON.stringify(profile, null, 2) + "\n", "utf8");
  writeFileSync(mp, renderCompanyMd(profile), "utf8");

  return { jsonPath: jp, mdPath: mp };
}
