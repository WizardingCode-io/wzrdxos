import { createInterface } from "node:readline/promises";
import { findRepoRoot } from "../paths.js";
import { readCompany, writeCompany } from "../company.js";
import { ui } from "../ui.js";

interface SetOptions {
  name?: string;
  market?: string;
  customers?: string;
  niche?: string;
  objective?: string[];
}

async function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

/** `wzrdx company` — show profile if present, else hint how to set it. */
export function companyShowCommand(): void {
  const root = findRepoRoot();
  const profile = readCompany(root);

  ui.title("wzrdxOS — company profile");

  if (!profile) {
    ui.item(ui.dim("company profile not set — run `wzrdx company set` to configure it."));
    console.log("");
    return;
  }

  ui.section("Profile");
  ui.item(`Name       : ${profile.name}`);
  ui.item(`Market     : ${profile.market}`);
  ui.item(`Customers  : ${profile.customers}`);
  ui.item(`Niche      : ${profile.niche}`);
  ui.item(`Updated    : ${profile.updatedAt}`);

  ui.section(`Objectives (${ui.count(profile.objectives.length)})`);
  if (profile.objectives.length > 0) {
    for (const o of profile.objectives) ui.item(`• ${o}`);
  } else {
    ui.item(ui.dim("none defined"));
  }

  console.log("");
}

/** `wzrdx company set` — collect fields interactively (or via flags) and persist the profile. */
export async function companySetCommand(opts: SetOptions): Promise<void> {
  const root = findRepoRoot();
  const isTTY = Boolean(process.stdin.isTTY);

  ui.title("wzrdxOS — set company profile");

  async function resolve(label: string, flag: string | undefined): Promise<string> {
    if (flag !== undefined && flag.trim() !== "") return flag.trim();
    if (isTTY) {
      return ask(`${label}: `);
    }
    ui.fail(`--${label.toLowerCase()} is required in non-interactive mode`);
    process.exitCode = 1;
    throw new Error(`missing required flag: ${label}`);
  }

  let name: string;
  let market: string;
  let customers: string;
  let niche: string;

  try {
    name = await resolve("name", opts.name);
    market = await resolve("market", opts.market);
    customers = await resolve("customers", opts.customers);
    niche = await resolve("niche", opts.niche);
  } catch {
    return;
  }

  let objectives: string[] = opts.objective ?? [];
  if (objectives.length === 0 && isTTY) {
    const raw = await ask(
      "Objectives (comma-separated, or blank to skip): ",
    );
    if (raw.trim()) {
      objectives = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  const profile = {
    name,
    market,
    customers,
    niche,
    objectives,
    updatedAt: new Date().toISOString(),
  };

  const paths = writeCompany(root, profile);

  ui.ok(`profile written to ${ui.dim(paths.jsonPath)}`);
  ui.ok(`markdown memo written to ${ui.dim(paths.mdPath)}`);
  ui.item(
    `Ingest into the KB: kb_ingest .wzrdx/company.md (or via the wzrdx-kb MCP)`,
  );
  console.log("");
}
