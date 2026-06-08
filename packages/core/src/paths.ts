import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

/**
 * Resolve the WZRDX repository root by walking up from a starting directory
 * until a marker (pnpm-workspace.yaml + artifacts/) is found. Falls back to cwd.
 */
export function findRepoRoot(start: string = process.cwd()): string {
  let dir = resolve(start);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (
      existsSync(join(dir, "pnpm-workspace.yaml")) &&
      existsSync(join(dir, "artifacts"))
    ) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) return resolve(start);
    dir = parent;
  }
}

export interface WzrdxPaths {
  root: string;
  artifacts: string;
  skills: string;
  agents: string;
  workflows: string;
}

export function wzrdxPaths(root: string = findRepoRoot()): WzrdxPaths {
  const artifacts = join(root, "artifacts");
  return {
    root,
    artifacts,
    skills: join(artifacts, "skills"),
    agents: join(artifacts, "agents"),
    workflows: join(artifacts, "workflows"),
  };
}

/** Claude Code install targets (where generated artifacts are deployed). */
export interface ClaudePaths {
  home: string;
  skills: string;
  agents: string;
  workflows: string;
}

export function claudePaths(home: string = homedir()): ClaudePaths {
  const base = join(home, ".claude");
  return {
    home: base,
    skills: join(base, "skills"),
    agents: join(base, "agents"),
    workflows: join(base, "workflows"),
  };
}
