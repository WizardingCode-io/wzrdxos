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

**Departments & heads:** ceo (strategy/decisions) · coo/ops (execution, PM/PO) · cto/eng
(code/architecture) · cfo/fin (money) · chro/rh (people) · cmo/marketing (brand/content) ·
cro/growth (revenue/deals) · cko/knowledge (KB/digests) · ea/admin (calendar/e-mail) ·
cqo (quality, transversal). Route requests via the \`core:conductor\` flow; agents deploy
as \`wzrdx-<name>\` subagents via \`wzrdx install claude\`.
${END}`;
}

/** Args (after the `uv` command) that launch the wzrdx-kb worker. */
function kbArgs(kbDir: string): string[] {
  return ["run", "--project", kbDir, "wzrdx-kb", "serve"];
}

function readJson(file: string): Record<string, any> {
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8") || "{}");
  } catch {
    return {};
  }
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

/**
 * Register the wzrdx-kb MCP in the runtime's config, following its native format.
 * Returns "written" | "deferred". Never writes a guessed format.
 */
export function installMcp(
  rt: RuntimeSpec,
  home: string,
  kbDir: string,
  geminiKey?: string,
): "written" | "deferred" {
  if (!rt.mcp) return "deferred";
  const file = join(home, rt.mcp.file);
  mkdirSync(dirname(file), { recursive: true });
  const args = kbArgs(kbDir);

  if (rt.mcp.style === "mcpServers-json") {
    const config = readJson(file);
    config.mcpServers = config.mcpServers ?? {};
    const entry: Record<string, unknown> = { command: "uv", args };
    if (rt.mcp.typed) {
      entry.type = "local";
      entry.tools = ["*"];
    }
    if (geminiKey) entry.env = { GEMINI_API_KEY: geminiKey };
    config.mcpServers["wzrdx-kb"] = entry;
    writeFileSync(file, JSON.stringify(config, null, 2) + "\n", "utf8");
    return "written";
  }

  if (rt.mcp.style === "opencode-json") {
    const config = readJson(file);
    config.mcp = config.mcp ?? {};
    const entry: Record<string, unknown> = { type: "local", command: ["uv", ...args], enabled: true };
    if (geminiKey) entry.environment = { GEMINI_API_KEY: geminiKey };
    config.mcp["wzrdx-kb"] = entry;
    writeFileSync(file, JSON.stringify(config, null, 2) + "\n", "utf8");
    return "written";
  }

  if (rt.mcp.style === "codex-toml") {
    let text = existsSync(file) ? readFileSync(file, "utf8") : "";
    if (!text.includes("[mcp_servers.wzrdx-kb]")) {
      const argsToml = args.map((a) => JSON.stringify(a)).join(", ");
      const block = `[mcp_servers.wzrdx-kb]\ncommand = "uv"\nargs = [${argsToml}]\n`;
      text = text.trimEnd() ? `${text.trimEnd()}\n\n${block}` : block;
      writeFileSync(file, text, "utf8");
    }
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
  const mcp = installMcp(rt, home, kbDir, opts.geminiKey);
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
