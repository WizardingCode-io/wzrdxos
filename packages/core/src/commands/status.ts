import { loadRegistry } from "../registry/loader.js";
import { findRepoRoot } from "../paths.js";
import { ui } from "../ui.js";

export function statusCommand(): void {
  const root = findRepoRoot();
  const reg = loadRegistry(root);

  ui.title("wzrdxOS — status");
  ui.item(ui.dim(root));

  ui.section(`Departments (${ui.count(reg.departments.length)})`);
  ui.item(reg.departments.length ? reg.departments.join("  ·  ") : ui.dim("none yet"));

  ui.section(`Skills (${ui.count(reg.skills.length)})`);
  for (const s of reg.skills) {
    ui.item(`${s.name}  ${ui.dim(`[${s.type}]`)}  ${ui.dim("— " + s.description)}`);
  }
  if (!reg.skills.length) ui.item(ui.dim("none yet"));

  ui.section(`Agents (${ui.count(reg.agents.length)})`);
  for (const a of reg.agents) {
    ui.item(`${a.name}  ${ui.dim(`(${a.role}, ${a.department}, T${a.tier}, ${a.model})`)}`);
  }
  if (!reg.agents.length) ui.item(ui.dim("none yet"));

  ui.section(`Workflows (${ui.count(reg.workflows.length)})`);
  for (const w of reg.workflows) {
    ui.item(`${w.name}  ${ui.dim(`(${w.phases} phases)`)}  ${ui.dim("— " + w.description)}`);
  }
  if (!reg.workflows.length) ui.item(ui.dim("none yet"));

  ui.section(`Plugins (${ui.count(reg.plugins.length)})`);
  for (const p of reg.plugins) {
    ui.item(`${p.department}:${p.name}  ${ui.dim(`[${p.kind}, ${p.status}]`)}`);
  }
  if (!reg.plugins.length) ui.item(ui.dim("none yet"));

  console.log("");
}
