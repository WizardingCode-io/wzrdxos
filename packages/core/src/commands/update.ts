import { join } from "node:path";
import { findRepoRoot } from "../paths.js";
import { ensureUv, installGraphify, registerMcp, syncKb } from "../installer.js";
import { ui } from "../ui.js";

/**
 * Keep the KB stack in sync: upgrade graphify, re-sync the worker venv, and
 * refresh the MCP registration. Mirrors `setup` but non-interactive and
 * preserves the chosen mode/secrets.
 */
export function updateCommand(): void {
  const root = findRepoRoot();
  const kbDir = join(root, "services", "kb");

  ui.title("wzrdxOS — update");

  const uv = ensureUv();
  uv.ok ? ui.ok(uv.output) : ui.fail(uv.output);
  if (!uv.ok) {
    process.exitCode = 1;
    return;
  }

  const gfy = installGraphify();
  gfy.ok ? ui.ok("graphify upgraded") : ui.fail(`graphify upgrade failed: ${gfy.output}`);

  const sync = syncKb(kbDir);
  sync.ok ? ui.ok("KB worker dependencies synced") : ui.fail(`uv sync failed: ${sync.output}`);

  const mcpPath = registerMcp(root, kbDir);
  ui.ok(`refreshed wzrdx-kb MCP in ${ui.dim(mcpPath)}`);

  console.log("");
  ui.ok("update complete.");
  console.log("");
}
