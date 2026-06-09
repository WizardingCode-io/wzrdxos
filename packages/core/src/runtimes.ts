import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";

/**
 * Runtime adapter registry. wzrdxOS installs into whatever AI agent runtime the user
 * has — this registry knows how to *detect* each one (step 1) and where its native
 * integration points live (used by the install adapters, step 2). See docs/runtimes.md.
 */

export interface RuntimeSpec {
  id: string;
  displayName: string;
  /** Executable names that indicate this runtime is installed. */
  bins: string[];
  /** Config directories (relative to home) that indicate use. */
  dirs: string[];
  /** Per-runtime instructions file (AGENTS.md-style). */
  instructions: string;
  /** graphify platform id for `graphify install --platform <p>`, when supported. */
  graphifyPlatform?: string;
}

export const RUNTIMES: RuntimeSpec[] = [
  { id: "claude", displayName: "Claude Code", bins: ["claude"], dirs: [".claude"], instructions: "CLAUDE.md", graphifyPlatform: "claude" },
  { id: "codex", displayName: "OpenAI Codex", bins: ["codex"], dirs: [".codex"], instructions: "AGENTS.md", graphifyPlatform: "codex" },
  { id: "gemini", displayName: "Gemini CLI", bins: ["gemini"], dirs: [".gemini"], instructions: "GEMINI.md", graphifyPlatform: "gemini" },
  { id: "qwen", displayName: "Qwen Code", bins: ["qwen"], dirs: [".qwen"], instructions: "QWEN.md" },
  { id: "cursor", displayName: "Cursor", bins: ["cursor"], dirs: [".cursor"], instructions: "AGENTS.md", graphifyPlatform: "cursor" },
  { id: "antigravity", displayName: "Antigravity", bins: ["antigravity"], dirs: [".antigravity"], instructions: "AGENTS.md", graphifyPlatform: "antigravity" },
  { id: "opencode", displayName: "OpenCode", bins: ["opencode"], dirs: [".config/opencode", ".local/share/opencode"], instructions: "AGENTS.md", graphifyPlatform: "opencode" },
  { id: "hermes", displayName: "Hermes Agent", bins: ["hermes"], dirs: [".hermes"], instructions: "AGENTS.md", graphifyPlatform: "hermes" },
  { id: "copilot", displayName: "Copilot CLI", bins: ["copilot", "gh-copilot"], dirs: [".config/github-copilot", ".copilot"], instructions: "AGENTS.md" },
  { id: "openclaw", displayName: "OpenClaw", bins: ["claw", "openclaw"], dirs: [".claw", ".openclaw"], instructions: "AGENTS.md", graphifyPlatform: "claw" },
];

export interface RuntimeStatus {
  id: string;
  displayName: string;
  present: boolean;
  /** Detection signals that fired, e.g. ["bin:claude", "dir:~/.claude"]. */
  via: string[];
}

/** Is `bin` on PATH? Checks PATH entries without executing anything. */
function onPath(bin: string): boolean {
  const path = process.env.PATH ?? "";
  const exts = process.platform === "win32" ? ["", ".exe", ".cmd", ".bat"] : [""];
  for (const dir of path.split(delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      if (existsSync(join(dir, bin + ext))) return true;
    }
  }
  return false;
}

/** Detect every known runtime on this machine (safe: no execution, no side effects). */
export function scanRuntimes(home: string = homedir()): RuntimeStatus[] {
  return RUNTIMES.map((rt) => {
    const via: string[] = [];
    for (const bin of rt.bins) if (onPath(bin)) via.push(`bin:${bin}`);
    for (const dir of rt.dirs) if (existsSync(join(home, dir))) via.push(`dir:~/${dir}`);
    return { id: rt.id, displayName: rt.displayName, present: via.length > 0, via };
  });
}

export function detectedRuntimes(home?: string): RuntimeStatus[] {
  return scanRuntimes(home).filter((r) => r.present);
}
