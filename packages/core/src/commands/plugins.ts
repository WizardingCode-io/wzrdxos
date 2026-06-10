import { loadRegistry } from "../registry/loader.js";
import { findRepoRoot } from "../paths.js";
import { ui } from "../ui.js";

interface PluginsOptions {
  department?: string;
}

/** List declared plugins, optionally filtered by department. */
export function pluginsCommand(opts: PluginsOptions = {}): void {
  const reg = loadRegistry(findRepoRoot());
  const plugins = opts.department
    ? reg.plugins.filter((p) => p.department === opts.department)
    : reg.plugins;

  ui.title("wzrdxOS — plugins");
  if (!plugins.length) {
    ui.item(ui.dim("no plugin manifests found."));
    console.log("");
    return;
  }

  const departments = [...new Set(plugins.map((p) => p.department))].sort();
  for (const dept of departments) {
    ui.section(dept);
    for (const p of plugins.filter((x) => x.department === dept)) {
      const status =
        p.status === "required" || p.status === "adopt"
          ? p.status
          : ui.dim(p.status);
      ui.item(`${p.name}  [${p.kind}]  ${status}${p.install ? ui.dim(`  — ${p.install}`) : ""}`);
      if (p.notes) ui.item(ui.dim(`  ${p.notes}`));
    }
  }
  console.log("");
}
