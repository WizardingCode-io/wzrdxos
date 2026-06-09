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
import { detectedRuntimes } from "../runtimes.js";
import { installRuntimes } from "../runtime-install.js";
import { ui } from "../ui.js";

interface SetupOptions {
  yes?: boolean;
  mode?: string;
  geminiKey?: string;
  /** "all" | "none" | comma-separated ids */
  runtimes?: string;
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

  let geminiKey = "";
  if (mode === "automatic") {
    geminiKey = opts.geminiKey ?? process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
    if (!geminiKey && interactive) geminiKey = await ask("Paste your GEMINI_API_KEY: ");
    if (geminiKey) {
      writeSecret(root, "GEMINI_API_KEY", geminiKey);
      ui.ok("stored GEMINI_API_KEY in .wzrdx/.env (gitignored)");
    } else {
      ui.warn("automatic mode chosen but no Gemini key provided — falling back to manual at runtime");
    }
  }
  ui.ok(`ingestion mode: ${mode}`);

  // 5. config + 6. project MCP registration
  writeConfig(root, { mode, mcp: "wzrdx-kb", enabled: true });
  const mcpPath = registerMcp(root, kbDir);
  ui.ok(`registered wzrdx-kb MCP in ${ui.dim(mcpPath)}`);

  // 7. multi-runtime install — scan, let the user choose, install per standard
  ui.section("Runtimes");
  const detected = detectedRuntimes();
  if (!detected.length) {
    ui.warn("no supported runtimes detected — skipping runtime install.");
  } else {
    ui.item(`detected: ${detected.map((r) => r.displayName).join(", ")}`);
    let targets = detected.map((r) => r.id);
    if (opts.runtimes && opts.runtimes !== "all") {
      targets = opts.runtimes === "none" ? [] : opts.runtimes.split(",").map((s) => s.trim());
    } else if (interactive && !opts.runtimes) {
      const answer = await ask(
        "Install wzrdxOS into which runtimes? [all] / none / comma-separated ids: ",
      );
      if (answer && answer !== "all") {
        targets = answer === "none" ? [] : answer.split(",").map((s) => s.trim());
      }
    }
    if (targets.length) {
      const reports = installRuntimes(targets, kbDir, { geminiKey: geminiKey || undefined });
      for (const r of reports) {
        const mcp = r.mcp === "written" ? "MCP ✓" : ui.dim("MCP deferred");
        ui.ok(`${r.displayName.padEnd(16)} instructions ✓  ${mcp}`);
      }
      const deferred = reports.filter((r) => r.mcp === "deferred").map((r) => r.id);
      if (deferred.length) ui.warn(`MCP deferred (format pending): ${deferred.join(", ")}`);
    } else {
      ui.item(ui.dim("no runtimes selected."));
    }
  }

  console.log("");
  ui.ok("setup complete. Run `wzrdx doctor` to verify, then restart your runtime(s) to load the MCP.");
  console.log("");
}
