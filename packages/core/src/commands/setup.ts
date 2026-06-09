import { createInterface } from "node:readline/promises";
import { join } from "node:path";
import { findRepoRoot } from "../paths.js";
import {
  ensureUv,
  installGraphify,
  platform,
  registerMcp,
  syncKb,
  writeConfig,
  writeSecret,
} from "../installer.js";
import { ui } from "../ui.js";

interface SetupOptions {
  yes?: boolean;
  mode?: string;
  geminiKey?: string;
}

async function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

/**
 * Install the full KB stack and wire it into Claude Code. Mandatory cross-platform
 * auto-install: ensures uv, installs graphify, syncs the KB worker, picks the
 * ingestion mode, and registers the unified `wzrdx-kb` MCP. Idempotent.
 */
export async function setupCommand(opts: SetupOptions = {}): Promise<void> {
  const root = findRepoRoot();
  const kbDir = join(root, "services", "kb");
  const interactive = Boolean(process.stdin.isTTY) && !opts.yes;

  ui.title(`wzrdxOS — setup (${platform()})`);

  // 1. uv
  const uv = ensureUv();
  uv.ok ? ui.ok(uv.output) : ui.fail(uv.output);
  if (!uv.ok) {
    process.exitCode = 1;
    return;
  }

  // 2. graphify
  ui.item("installing graphify (uv tool install graphifyy)…");
  const gfy = installGraphify();
  gfy.ok ? ui.ok("graphify installed/updated") : ui.fail(`graphify install failed: ${gfy.output}`);

  // 3. KB worker venv
  ui.item("syncing KB worker (uv sync)…");
  const sync = syncKb(kbDir);
  sync.ok ? ui.ok("KB worker dependencies installed") : ui.fail(`uv sync failed: ${sync.output}`);

  // 4. ingestion mode
  let mode = (opts.mode ?? "").toLowerCase();
  if (mode !== "manual" && mode !== "automatic") {
    if (interactive) {
      const answer = await ask(
        "\nIngestion mode?\n  [1] manual — uses Claude Code subagents, no key (interactive only)\n  [2] automatic — unattended/background, needs a Gemini API key\nChoose 1 or 2 (default 1): ",
      );
      mode = answer === "2" ? "automatic" : "manual";
    } else {
      mode = "manual";
    }
  }

  if (mode === "automatic") {
    let key = opts.geminiKey ?? process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
    if (!key && interactive) key = await ask("Paste your GEMINI_API_KEY: ");
    if (key) {
      writeSecret(root, "GEMINI_API_KEY", key);
      ui.ok("stored GEMINI_API_KEY in .wzrdx/.env (gitignored)");
    } else {
      ui.warn("automatic mode chosen but no Gemini key provided — falling back to manual at runtime");
    }
  }
  ui.ok(`ingestion mode: ${mode}`);

  // 5. config + 6. MCP registration
  writeConfig(root, { mode, mcp: "wzrdx-kb", enabled: true });
  const mcpPath = registerMcp(root, kbDir);
  ui.ok(`registered wzrdx-kb MCP in ${ui.dim(mcpPath)}`);

  console.log("");
  ui.ok("setup complete. Run `wzrdx doctor` to verify, then restart Claude Code to load the MCP.");
  console.log("");
}
