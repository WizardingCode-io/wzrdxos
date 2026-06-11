import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { claudePaths, findRepoRoot, wzrdxPaths } from "../paths.js";
import { has, run } from "../installer.js";
import { readCompany } from "../company.js";
import { ui } from "../ui.js";

function tryVersion(cmd: string, args: string[]): string | null {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .trim()
      .split("\n")[0]!;
  } catch {
    return null;
  }
}

function checkNodeMajor(min: number): { ok: boolean; version: string } {
  const version = process.versions.node;
  const major = Number(version.split(".")[0]);
  return { ok: major >= min, version };
}

function readJson(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/** Validate the local environment for running wzrdxOS. Exit code 1 if any hard check fails. */
export function doctorCommand(): void {
  ui.title("wzrdxOS — doctor");
  let hardFail = false;

  const node = checkNodeMajor(22);
  node.ok
    ? ui.ok(`Node ${node.version} (>= 22)`)
    : (ui.fail(`Node ${node.version} — need >= 22`), (hardFail = true));

  const pnpm = tryVersion("pnpm", ["--version"]);
  pnpm ? ui.ok(`pnpm ${pnpm}`) : ui.warn("pnpm not found (needed for development)");

  const root = findRepoRoot();
  const paths = wzrdxPaths(root);
  existsSync(paths.artifacts)
    ? ui.ok(`artifacts/ found at ${ui.dim(root)}`)
    : (ui.fail("artifacts/ not found — are you inside a wzrdxOS repo?"), (hardFail = true));

  const claude = claudePaths();
  existsSync(claude.home)
    ? ui.ok(`Claude Code home found (${ui.dim(claude.home)})`)
    : ui.warn(`Claude Code home not found at ${claude.home}`);

  // --- Knowledge Base stack -------------------------------------------------
  ui.section("Knowledge Base");
  const fix = "run `wzrdx setup`";

  const uv = tryVersion("uv", ["--version"]);
  uv ? ui.ok(uv) : ui.warn(`uv not found — ${fix}`);

  has("graphify")
    ? ui.ok("graphify installed")
    : ui.warn(`graphify not found — ${fix}`);

  const kbDir = join(root, "services", "kb");
  const kbInfo = run("uv", ["run", "--project", kbDir, "wzrdx-kb", "info"]);
  kbInfo.ok
    ? ui.ok("KB worker runnable (wzrdx-kb)")
    : ui.warn(`KB worker not runnable — ${fix}`);

  const mcp = readJson(join(root, ".mcp.json"));
  const mcpServers = (mcp?.mcpServers ?? {}) as Record<string, unknown>;
  mcpServers["wzrdx-kb"]
    ? ui.ok("wzrdx-kb MCP registered (.mcp.json)")
    : ui.warn(`wzrdx-kb MCP not registered — ${fix}`);

  const cfg = readJson(join(root, ".wzrdx", "config.json"));
  const kbCfg = (cfg?.kb ?? {}) as Record<string, unknown>;
  kbCfg.mode
    ? ui.ok(`ingestion mode: ${String(kbCfg.mode)}`)
    : ui.warn(`ingestion mode not configured — ${fix}`);

  // --- Company Profile -------------------------------------------------------
  ui.section("Company Profile");
  const companyProfile = readCompany(root);
  if (companyProfile && companyProfile.name.trim().length > 0) {
    ui.ok(`company profile set: ${companyProfile.name}`);
  } else {
    ui.warn("company profile not set — run `wzrdx company set`");
  }

  console.log("");
  if (hardFail) {
    ui.fail("doctor found blocking issues.");
    process.exitCode = 1;
  } else {
    ui.ok("environment looks good.");
  }
}
