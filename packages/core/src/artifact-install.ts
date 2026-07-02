import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";
import matter from "gray-matter";
import { claudePaths, wzrdxPaths, type ClaudePaths } from "./paths.js";
import { loadRegistry } from "./registry/loader.js";
import type { HookDefinition } from "./registry/types.js";

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
  hooks: number;
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

  // Hooks → ~/.claude/wzrdx/hooks/<name>.mjs + surgical settings.json merge.
  mkdirSync(claude.wzrdxHooks, { recursive: true });
  for (const h of reg.hooks) {
    copyFileSync(h.script, join(claude.wzrdxHooks, `${h.name}.mjs`));
  }
  mergeHookSettings(claude, reg.hooks);

  return {
    agents: reg.agents.length,
    skills: reg.skills.length,
    workflows: reg.workflows.length,
    hooks: reg.hooks.length,
  };
}

/** wzrdx-managed hook entries are recognized by their command path — no
 * foreign keys are added to the user's settings schema. */
function isWzrdxHookEntry(entry: unknown): boolean {
  const hooks = (entry as { hooks?: { command?: unknown }[] })?.hooks;
  return (
    Array.isArray(hooks) &&
    hooks.some(
      (h) =>
        typeof h?.command === "string" &&
        h.command.includes(join(".claude", "wzrdx", "hooks")),
    )
  );
}

/**
 * Merge wzrdx hook entries into ~/.claude/settings.json. Surgical and
 * idempotent: strips previous wzrdx-managed entries (recognized by command
 * path) from every event array, appends the current set, and never touches
 * user-owned entries. If the existing file is unparseable, it is left alone
 * (hooks are then simply not registered — doctor can report this later).
 */
function mergeHookSettings(claude: ClaudePaths, hooks: HookDefinition[]): void {
  let settings: Record<string, unknown> = {};
  if (existsSync(claude.settings)) {
    try {
      settings = JSON.parse(readFileSync(claude.settings, "utf8"));
    } catch {
      return; // never clobber an unparseable user file
    }
    if (settings === null || typeof settings !== "object" || Array.isArray(settings)) {
      return; // non-object settings file: treat like unparseable
    }
  }
  const events = (settings.hooks ??= {}) as Record<string, unknown[]>;
  for (const key of Object.keys(events)) {
    if (Array.isArray(events[key])) {
      events[key] = events[key].filter((e) => !isWzrdxHookEntry(e));
    }
  }
  for (const h of hooks) {
    const existing = events[h.event];
    const list = Array.isArray(existing) ? existing : [];
    list.push({
      matcher: h.matcher ?? "",
      hooks: [
        {
          type: "command",
          command: `node "${join(claude.wzrdxHooks, `${h.name}.mjs`)}"`,
        },
      ],
    });
    events[h.event] = list;
  }
  mkdirSync(dirname(claude.settings), { recursive: true });
  writeFileSync(claude.settings, JSON.stringify(settings, null, 2) + "\n", "utf8");
}
