import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";
import matter from "gray-matter";
import { claudePaths, wzrdxPaths } from "./paths.js";
import { loadRegistry } from "./registry/loader.js";

/**
 * Deploy registry artifacts into Claude Code's native locations (~/.claude).
 * Everything is prefixed `wzrdx-` so user-owned files are never touched.
 * Idempotent: re-running overwrites only wzrdx-prefixed files. Known limitation:
 * renamed/removed artifacts leave stale deployed copies behind (no pruning yet).
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
  const paths = wzrdxPaths(root);
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

  // Skills → ~/.claude/skills/wzrdx-<dept>-<dirname>/SKILL.md. The slug comes from
  // the filesystem layout (not the frontmatter id) so it is always convention-true,
  // and the deployed frontmatter `name` is rewritten to match the directory.
  for (const s of reg.skills) {
    const slug = `wzrdx-${s.department}-${basename(dirname(s.path))}`;
    const dir = join(claude.skills, slug);
    mkdirSync(dir, { recursive: true });
    const parsed = matter(readFileSync(s.path, "utf8"));
    const deployed = matter.stringify(parsed.content, { ...parsed.data, name: slug });
    writeFileSync(join(dir, "SKILL.md"), deployed, "utf8");
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
