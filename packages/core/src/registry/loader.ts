import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { wzrdxPaths, type WzrdxPaths } from "../paths.js";
import type {
  AgentDefinition,
  Registry,
  SkillDefinition,
  WorkflowDefinition,
} from "./types.js";

function dirs(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((n) => !n.startsWith("."));
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

/** Load skills from artifacts/skills/<department>/<name>/SKILL.md. */
function loadSkills(paths: WzrdxPaths): SkillDefinition[] {
  const out: SkillDefinition[] = [];
  for (const department of dirs(paths.skills)) {
    const deptDir = join(paths.skills, department);
    for (const name of dirs(deptDir)) {
      const file = join(deptDir, name, "SKILL.md");
      if (!existsSync(file)) continue;
      const { data } = matter(readFileSync(file, "utf8"));
      const type = data.type === "process" ? "process" : "capability";
      out.push({
        name: str(data.name, `${department}:${name}`),
        description: str(data.description),
        type,
        department: str(data.department, department),
        whenToUse: str(data["when-to-use"] ?? data.whenToUse) || undefined,
        path: file,
      });
    }
  }
  return out;
}

/** Load agents from artifacts/agents/<name>/agent.md. */
function loadAgents(paths: WzrdxPaths): AgentDefinition[] {
  const out: AgentDefinition[] = [];
  for (const name of dirs(paths.agents)) {
    const file = join(paths.agents, name, "agent.md");
    if (!existsSync(file)) continue;
    const { data } = matter(readFileSync(file, "utf8"));
    const tier = [0, 1, 2, 3].includes(Number(data.tier)) ? Number(data.tier) : 2;
    const model = ["opus", "sonnet", "haiku"].includes(data.model)
      ? data.model
      : "sonnet";
    out.push({
      name: str(data.name, name),
      role: str(data.role, "Specialist"),
      department: str(data.department, "core"),
      tier: tier as AgentDefinition["tier"],
      model: model as AgentDefinition["model"],
      description: str(data.description),
      path: file,
    });
  }
  return out;
}

const META_REGION = /export\s+const\s+meta\s*=\s*\{([\s\S]*?)\n\}/;

/**
 * Extract the registry-facing fields from a Workflow script's `meta` literal.
 * Static (no execution): the script body is side-effectful and must not run.
 */
function extractWorkflowMeta(source: string): {
  name?: string;
  description?: string;
  phases: number;
} {
  const region = META_REGION.exec(source)?.[1] ?? "";
  const name = /name:\s*['"`]([^'"`]+)['"`]/.exec(region)?.[1];
  const description = /description:\s*['"`]([^'"`]+)['"`]/.exec(region)?.[1];
  const phases = (region.match(/title:\s*['"`]/g) ?? []).length;
  return { name, description, phases };
}

/** Load workflows from artifacts/workflows/<name>/workflow.mjs. */
function loadWorkflows(paths: WzrdxPaths): WorkflowDefinition[] {
  const out: WorkflowDefinition[] = [];
  for (const name of dirs(paths.workflows)) {
    const file = join(paths.workflows, name, "workflow.mjs");
    if (!existsSync(file)) continue;
    const meta = extractWorkflowMeta(readFileSync(file, "utf8"));
    out.push({
      name: meta.name ?? name,
      description: meta.description ?? "",
      phases: meta.phases,
      path: file,
    });
  }
  return out;
}

/** Load the full registry from the artifacts directory. */
export function loadRegistry(root?: string): Registry {
  const paths = wzrdxPaths(root);
  const skills = loadSkills(paths);
  const agents = loadAgents(paths);
  const workflows = loadWorkflows(paths);
  const departments = [
    ...new Set([
      ...skills.map((s) => s.department),
      ...agents.map((a) => a.department),
    ]),
  ].sort();
  return { skills, agents, workflows, departments };
}
