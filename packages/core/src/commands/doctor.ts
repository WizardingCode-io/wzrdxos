import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { claudePaths, findRepoRoot, wzrdxPaths } from "../paths.js";
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

  const python = tryVersion("python3", ["--version"]);
  python ? ui.ok(python) : ui.warn("python3 not found (needed for services/kb)");

  const uv = tryVersion("uv", ["--version"]);
  uv ? ui.ok(uv) : ui.warn("uv not found (recommended for services/kb)");

  const root = findRepoRoot();
  const paths = wzrdxPaths(root);
  existsSync(paths.artifacts)
    ? ui.ok(`artifacts/ found at ${ui.dim(root)}`)
    : (ui.fail("artifacts/ not found — are you inside a wzrdxOS repo?"), (hardFail = true));

  const claude = claudePaths();
  existsSync(claude.home)
    ? ui.ok(`Claude Code home found (${ui.dim(claude.home)})`)
    : ui.warn(`Claude Code home not found at ${claude.home}`);

  console.log("");
  if (hardFail) {
    ui.fail("doctor found blocking issues.");
    process.exitCode = 1;
  } else {
    ui.ok("environment looks good.");
  }
}
