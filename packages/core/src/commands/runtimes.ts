import { scanRuntimes } from "../runtimes.js";
import { ui } from "../ui.js";

/**
 * Scan the machine for supported AI agent runtimes and report which are present.
 * This is the entry point for multi-runtime install: setup uses the same scan to
 * offer install targets. See docs/runtimes.md.
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
    ui.item(ui.dim("`wzrdx setup` will let you choose which to install wzrdxOS into."));
  } else {
    ui.warn("no supported runtimes detected on this machine.");
  }
  console.log("");
}
