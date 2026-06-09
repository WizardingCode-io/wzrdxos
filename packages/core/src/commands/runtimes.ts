import { join } from "node:path";
import { findRepoRoot } from "../paths.js";
import { detectedRuntimes, scanRuntimes } from "../runtimes.js";
import { installRuntimes } from "../runtime-install.js";
import { ui } from "../ui.js";

/**
 * Scan the machine for supported AI agent runtimes and report which are present.
 * Entry point for multi-runtime install. See docs/runtimes.md.
 */
export function runtimesCommand(): void {
  const results = scanRuntimes();
  const present = results.filter((r) => r.present);

  ui.title("wzrdxOS — runtimes");
  ui.section(`Detected (${ui.count(present.length)} of ${results.length})`);
  for (const r of results) {
    const mark = r.present ? "✓" : "·";
    const via = r.present ? ui.dim(`(${r.via.join(", ")})`) : ui.dim("(not found)");
    console.log(`  ${mark} ${r.displayName.padEnd(16)} ${via}`);
  }

  console.log("");
  if (present.length) {
    ui.ok(`${present.length} runtime(s) available as install targets.`);
    ui.item(ui.dim("install with `wzrdx runtimes install` (all detected) or `--only id1,id2`."));
  } else {
    ui.warn("no supported runtimes detected on this machine.");
  }
  console.log("");
}

interface InstallOptions {
  only?: string;
  geminiKey?: string;
}

/** Install wzrdxOS into detected (or selected) runtimes, following each one's standard. */
export function runtimesInstallCommand(opts: InstallOptions = {}): void {
  const root = findRepoRoot();
  const kbDir = join(root, "services", "kb");
  const detected = detectedRuntimes().map((r) => r.id);
  const ids = opts.only ? opts.only.split(",").map((s) => s.trim()).filter(Boolean) : detected;

  ui.title("wzrdxOS — runtimes install");
  if (!ids.length) {
    ui.warn("no runtimes selected/detected.");
    return;
  }

  const geminiKey = opts.geminiKey ?? process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  const reports = installRuntimes(ids, kbDir, { geminiKey });

  for (const r of reports) {
    const mcp = r.mcp === "written" ? "MCP ✓" : ui.dim("MCP deferred");
    ui.ok(`${r.displayName.padEnd(16)} instructions ✓  ${mcp}`);
  }
  const deferred = reports.filter((r) => r.mcp === "deferred").map((r) => r.id);
  console.log("");
  if (deferred.length) {
    ui.warn(`MCP registration deferred (format pending verification): ${deferred.join(", ")}`);
    ui.item(ui.dim("instructions were still installed for these — MCP adapters land as each is verified."));
  }
  ui.ok(`wzrdxOS installed into ${reports.length} runtime(s).`);
  console.log("");
}
