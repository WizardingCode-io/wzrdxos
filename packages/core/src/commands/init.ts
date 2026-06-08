import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ui } from "../ui.js";

interface InitOptions {
  /** Target directory; defaults to cwd. */
  cwd?: string;
  /** Overwrite an existing config. */
  force?: boolean;
}

/**
 * Initialize a WZRDX workspace in the target directory by writing a minimal
 * `.wzrdx/config.json`. Idempotent unless --force is given.
 */
export function initCommand(opts: InitOptions = {}): void {
  const cwd = opts.cwd ?? process.cwd();
  const dir = join(cwd, ".wzrdx");
  const configPath = join(dir, "config.json");

  ui.title("WZRDX — init");

  if (existsSync(configPath) && !opts.force) {
    ui.warn(`already initialized at ${ui.dim(configPath)} (use --force to overwrite)`);
    return;
  }

  mkdirSync(dir, { recursive: true });
  const config = {
    version: 1,
    createdAt: null as string | null, // stamped by tooling, kept null to stay deterministic
    profile: {
      name: null,
      company: null,
      role: null,
    },
    kb: {
      enabled: false,
      mcp: "wzrdx-kb",
    },
    flow: {
      // WZRDX policy: opt-in, never blocking enforcement.
      mode: "opt-in",
    },
  };
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  ui.ok(`workspace initialized at ${ui.dim(configPath)}`);
  ui.item(ui.dim("next: run `wzrdx doctor` then `wzrdx status`"));
  console.log("");
}
