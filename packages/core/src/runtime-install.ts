import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { RUNTIMES, type RuntimeSpec } from "./runtimes.js";

/**
 * Install adapters: wire wzrdxOS into a runtime following its native conventions.
 *
 * Two surfaces (see docs/runtimes.md):
 * - instructions: an AGENTS.md-style bootstrap block (universal).
 * - MCP: register the `wzrdx-kb` server (confirmed for the mcpServers-JSON family;
 *   deferred for runtimes whose format is not yet validated — never write a guess).
 */

const BEGIN = "<!-- wzrdxos:begin -->";
const END = "<!-- wzrdxos:end -->";

function instructionsBlock(): string {
  return `${BEGIN}
## wzrdxOS

This runtime is augmented by **wzrdxOS**. A unified Knowledge Base is available via the
\`wzrdx-kb\` MCP server:

- \`kb_search(query)\` — semantic vector search over the KB (global + project).
- \`kb_query(question)\` — relational graph traversal (Graphify).
- \`kb_ask(question)\` — GraphRAG: fuse vector recall + graph.
- \`kb_ingest(path)\` — add a file/folder to the KB.

**KB-first:** before external research, consult the KB via \`kb_search\`/\`kb_ask\`.
${END}`;
}

export interface McpServerEntry {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

/** The wzrdx-kb MCP server entry that launches the Python worker via uv. */
export function wzrdxKbServer(kbDir: string, geminiKey?: string): McpServerEntry {
  return {
    command: "uv",
    args: ["run", "--project", kbDir, "wzrdx-kb", "serve"],
    ...(geminiKey ? { env: { GEMINI_API_KEY: geminiKey } } : {}),
  };
}

function upsertBlock(filePath: string, block: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  let content = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
  const start = content.indexOf(BEGIN);
  const end = content.indexOf(END);
  if (start !== -1 && end !== -1) {
    content = content.slice(0, start) + block + content.slice(end + END.length);
  } else {
    content = content.trim() ? `${content.trimEnd()}\n\n${block}\n` : `${block}\n`;
  }
  writeFileSync(filePath, content, "utf8");
}

/** Write the wzrdxOS instructions block into the runtime's instructions file. */
export function installInstructions(rt: RuntimeSpec, home: string): string {
  const file = join(home, rt.configDir, rt.instructions);
  upsertBlock(file, instructionsBlock());
  return file;
}

/** Register the wzrdx-kb MCP in the runtime's config. Returns "written" | "deferred". */
export function installMcp(rt: RuntimeSpec, home: string, server: McpServerEntry): "written" | "deferred" {
  if (!rt.mcp) return "deferred";
  if (rt.mcp.style === "mcpServers-json") {
    const file = join(home, rt.mcp.file);
    mkdirSync(dirname(file), { recursive: true });
    const config = existsSync(file) ? JSON.parse(readFileSync(file, "utf8") || "{}") : {};
    config.mcpServers = config.mcpServers ?? {};
    config.mcpServers["wzrdx-kb"] = server;
    writeFileSync(file, JSON.stringify(config, null, 2) + "\n", "utf8");
    return "written";
  }
  return "deferred";
}

export interface RuntimeInstallReport {
  id: string;
  displayName: string;
  instructionsFile: string;
  mcp: "written" | "deferred";
  graphify: boolean;
}

/** Install wzrdxOS into one runtime, following its conventions. */
export function installRuntime(
  rt: RuntimeSpec,
  kbDir: string,
  opts: { home?: string; geminiKey?: string } = {},
): RuntimeInstallReport {
  const home = opts.home ?? homedir();
  const instructionsFile = installInstructions(rt, home);
  const mcp = installMcp(rt, home, wzrdxKbServer(kbDir, opts.geminiKey));
  return {
    id: rt.id,
    displayName: rt.displayName,
    instructionsFile,
    mcp,
    graphify: Boolean(rt.graphifyPlatform),
  };
}

/** Install wzrdxOS into several runtimes by id. */
export function installRuntimes(
  ids: string[],
  kbDir: string,
  opts: { home?: string; geminiKey?: string } = {},
): RuntimeInstallReport[] {
  return RUNTIMES.filter((rt) => ids.includes(rt.id)).map((rt) => installRuntime(rt, kbDir, opts));
}
