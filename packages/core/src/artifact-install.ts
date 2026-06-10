import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import matter from "gray-matter";
import { claudePaths, wzrdxPaths } from "./paths.js";
import { loadRegistry } from "./registry/loader.js";

/**
 * Deploy registry artifacts into Claude Code's native locations (~/.claude).
 * Everything is prefixed `wzrdx-` so user-owned files are never touched.
 * Idempotent: re-running overwrites only wzrdx-prefixed files.
 */

export interface ClaudeInstallReport {
  agents: number;
  skills: number;
  workflows: number;
}

export function installClaudeArtifacts(
  root?: string,
  home: string = homedir(),
): ClaudeInstallReport {
  const paths = wzrdxPaths(root ?? undefined);
  const claude = claudePaths(home);
  const reg = loadRegistry(paths.root);

  // Agents → ~/.claude/agents/wzrdx-<name>.md (Claude Code subagent format:
  // frontmatter name/description/model, body = system prompt material).
  mkdirSync(claude.agents, { recursive: true });
  for (const a of reg.agents) {
    const { content } = matter(readFileSync(a.path, "utf8"));
    const out = [
      "---",
      `name: wzrdx-${a.name}`,
      `description: ${a.description}`,
      `model: ${a.model}`,
      "---",
      content.trim(),
      "",
    ].join("\n");
    writeFileSync(join(claude.agents, `wzrdx-${a.name}.md`), out, "utf8");
  }

  // Skills → ~/.claude/skills/wzrdx-<dept>-<name>/SKILL.md (id ":" → "-").
  for (const s of reg.skills) {
    const slug = `wzrdx-${s.name.replace(/:/g, "-")}`;
    const dir = join(claude.skills, slug);
    mkdirSync(dir, { recursive: true });
    copyFileSync(s.path, join(dir, "SKILL.md"));
  }

  // Workflows → ~/.claude/workflows/<name>.mjs (invoked via Workflow scriptPath).
  mkdirSync(claude.workflows, { recursive: true });
  for (const w of reg.workflows) {
    copyFileSync(w.path, join(claude.workflows, `${w.name}.mjs`));
  }

  return {
    agents: reg.agents.length,
    skills: reg.skills.length,
    workflows: reg.workflows.length,
  };
}
