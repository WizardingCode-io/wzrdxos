import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";

/**
 * Runtime adapter registry. wzrdxOS installs into whatever AI agent runtime the user
 * has — this registry knows how to *detect* each one and where its native integration
 * points live. See docs/runtimes.md.
 */

/** How a runtime registers MCP servers. */
export interface McpTarget {
  /** "mcpServers-json": `{ mcpServers: { name: {command,args,env} } }` in a JSON file. */
  style: "mcpServers-json";
  /** Config file relative to home. */
  file: string;
}

export interface RuntimeSpec {
  id: string;
  displayName: string;
  /** Executable names that indicate this runtime is installed. */
  bins: string[];
  /** Config directories (relative to home) that indicate use. */
  dirs: string[];
  /** Primary config directory (relative to home) for writing artifacts. */
  configDir: string;
  /** Per-runtime instructions file (AGENTS.md-style), written under configDir. */
  instructions: string;
  /** MCP registration target, when the format is confirmed. Omitted = deferred. */
  mcp?: McpTarget;
  /** graphify platform id for `graphify install --platform <p>`, when supported. */
  graphifyPlatform?: string;
}

const MCP_JSON = (file: string): McpTarget => ({ style: "mcpServers-json", file });

export const RUNTIMES: RuntimeSpec[] = [
  { id: "claude", displayName: "Claude Code", bins: ["claude"], dirs: [".claude"], configDir: ".claude", instructions: "CLAUDE.md", mcp: MCP_JSON(".claude.json"), graphifyPlatform: "claude" },
  { id: "codex", displayName: "OpenAI Codex", bins: ["codex"], dirs: [".codex"], configDir: ".codex", instructions: "AGENTS.md", graphifyPlatform: "codex" },
  { id: "gemini", displayName: "Gemini CLI", bins: ["gemini"], dirs: [".gemini"], configDir: ".gemini", instructions: "GEMINI.md", mcp: MCP_JSON(".gemini/settings.json"), graphifyPlatform: "gemini" },
  { id: "qwen", displayName: "Qwen Code", bins: ["qwen"], dirs: [".qwen"], configDir: ".qwen", instructions: "QWEN.md", mcp: MCP_JSON(".qwen/settings.json") },
  { id: "cursor", displayName: "Cursor", bins: ["cursor"], dirs: [".cursor"], configDir: ".cursor", instructions: "AGENTS.md", mcp: MCP_JSON(".cursor/mcp.json"), graphifyPlatform: "cursor" },
  { id: "antigravity", displayName: "Antigravity", bins: ["antigravity"], dirs: [".antigravity"], configDir: ".antigravity", instructions: "AGENTS.md", graphifyPlatform: "antigravity" },
  { id: "opencode", displayName: "OpenCode", bins: ["opencode"], dirs: [".config/opencode", ".local/share/opencode"], configDir: ".config/opencode", instructions: "AGENTS.md", graphifyPlatform: "opencode" },
  { id: "hermes", displayName: "Hermes Agent", bins: ["hermes"], dirs: [".hermes"], configDir: ".hermes", instructions: "AGENTS.md", graphifyPlatform: "hermes" },
  { id: "copilot", displayName: "Copilot CLI", bins: ["copilot", "gh-copilot"], dirs: [".config/github-copilot", ".copilot"], configDir: ".copilot", instructions: "AGENTS.md" },
  { id: "openclaw", displayName: "OpenClaw", bins: ["claw", "openclaw"], dirs: [".claw", ".openclaw"], configDir: ".openclaw", instructions: "AGENTS.md", graphifyPlatform: "claw" },
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

export function runtimeById(id: string): RuntimeSpec | undefined {
  return RUNTIMES.find((r) => r.id === id);
}
