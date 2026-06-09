import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Cross-platform installer helpers. The Node CLI is the orchestrator (runs on
 * macOS/Linux/Windows); it drives `uv` (also cross-platform) for every Python
 * install. Never assumes bash in the installed-product path.
 */

export type Platform = "mac" | "linux" | "windows" | "unknown";

export function platform(): Platform {
  switch (process.platform) {
    case "darwin":
      return "mac";
    case "linux":
      return "linux";
    case "win32":
      return "windows";
    default:
      return "unknown";
  }
}

export interface RunResult {
  ok: boolean;
  output: string;
}

/** Run a command, capturing output. Never throws — returns ok=false on failure. */
export function run(cmd: string, args: string[], cwd?: string): RunResult {
  try {
    const output = execFileSync(cmd, args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      // Drop a stale VIRTUAL_ENV so `uv` targets the project venv, not the shell's.
      env: { ...process.env, VIRTUAL_ENV: undefined } as NodeJS.ProcessEnv,
    });
    return { ok: true, output: output.trim() };
  } catch (err) {
    const e = err as { stdout?: Buffer; stderr?: Buffer; message?: string };
    const out = `${e.stdout?.toString() ?? ""}${e.stderr?.toString() ?? ""}`.trim();
    return { ok: false, output: out || e.message || "command failed" };
  }
}

/** Is an executable available on PATH? */
export function has(cmd: string): boolean {
  const probe = platform() === "windows" ? ["--version"] : ["--version"];
  return run(cmd, probe).ok;
}

/** Ensure `uv` is installed; bootstrap it per-OS if missing. */
export function ensureUv(): RunResult {
  if (has("uv")) return { ok: true, output: "uv present" };
  try {
    if (platform() === "windows") {
      execSync('powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"', {
        stdio: "inherit",
      });
    } else {
      execSync("curl -LsSf https://astral.sh/uv/install.sh | sh", { stdio: "inherit", shell: "/bin/sh" });
    }
  } catch {
    return {
      ok: false,
      output:
        "could not bootstrap uv automatically. Install it from https://docs.astral.sh/uv/ and re-run `wzrdx setup`.",
    };
  }
  return has("uv")
    ? { ok: true, output: "uv installed" }
    : { ok: false, output: "uv installed but not on PATH — restart your shell and re-run `wzrdx setup`." };
}

/** Install/upgrade the graphify knowledge-graph engine as a uv tool. */
export function installGraphify(): RunResult {
  return run("uv", ["tool", "install", "--upgrade", "graphifyy"]);
}

/** Sync the Python KB worker venv. */
export function syncKb(kbDir: string): RunResult {
  return run("uv", ["sync"], kbDir);
}

/** Read GEMINI key from the local secrets file, if present. */
function readSecret(cwd: string, key: string): string | undefined {
  const env = join(cwd, ".wzrdx", ".env");
  if (!existsSync(env)) return undefined;
  for (const line of readFileSync(env, "utf8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k?.trim() === key) return rest.join("=").trim();
  }
  return undefined;
}

/** Persist a secret to the gitignored `.wzrdx/.env`. */
export function writeSecret(cwd: string, key: string, value: string): void {
  const dir = join(cwd, ".wzrdx");
  mkdirSync(dir, { recursive: true });
  const env = join(dir, ".env");
  const lines = existsSync(env)
    ? readFileSync(env, "utf8").split("\n").filter((l) => l && !l.startsWith(`${key}=`))
    : [];
  lines.push(`${key}=${value}`);
  writeFileSync(env, lines.join("\n") + "\n", "utf8");
}

/** Merge KB settings into `.wzrdx/config.json`. */
export function writeConfig(cwd: string, patch: Record<string, unknown>): void {
  const dir = join(cwd, ".wzrdx");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "config.json");
  const current = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : { version: 1 };
  const merged = { ...current, kb: { ...(current.kb ?? {}), ...patch } };
  writeFileSync(path, JSON.stringify(merged, null, 2) + "\n", "utf8");
}

/**
 * Register the unified `wzrdx-kb` MCP server in the project `.mcp.json`
 * (merged, never clobbered). Launches the worker via uv against the kb dir.
 */
export function registerMcp(repoRoot: string, kbDir: string): string {
  const path = join(repoRoot, ".mcp.json");
  const config = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  config.mcpServers = config.mcpServers ?? {};
  const env: Record<string, string> = {};
  const gemini = readSecret(repoRoot, "GEMINI_API_KEY");
  if (gemini) env.GEMINI_API_KEY = gemini;
  config.mcpServers["wzrdx-kb"] = {
    command: "uv",
    args: ["run", "--project", kbDir, "wzrdx-kb", "serve"],
    ...(Object.keys(env).length ? { env } : {}),
  };
  writeFileSync(path, JSON.stringify(config, null, 2) + "\n", "utf8");
  return path;
}
