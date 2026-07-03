#!/usr/bin/env node
// wzrdx SDD soft-gate — PreToolUse hook for Edit|Write|MultiEdit.
//
// NON-BLOCKING by policy (docs/formats.md → Flow policy): always allows the
// action. When code is about to be written and no spec under docs/specs/ or
// docs/superpowers/specs/ was touched in the last 7 days, it injects a
// reminder to run eng:spec-driven-development — at most once per session.
// Fail-open: any internal error exits 0 with no output; this script must
// never be able to break the user's editing.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { extname, join } from "node:path";

const CODE_EXTS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".php", ".vue",
  ".go", ".rs", ".java", ".kt", ".rb", ".swift", ".c", ".h", ".cpp",
  ".cc", ".cs", ".sql",
]);
const SPEC_DIRS = [join("docs", "specs"), join("docs", "superpowers", "specs")];
const SPEC_NAME = /^SPEC-|-design\.md$/;
const FRESH_MS = 7 * 24 * 60 * 60 * 1000;

function hasRecentSpec(cwd) {
  for (const rel of SPEC_DIRS) {
    const dir = join(cwd, rel);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!SPEC_NAME.test(name)) continue;
      if (Date.now() - statSync(join(dir, name)).mtimeMs < FRESH_MS) return true;
    }
  }
  return false;
}

function main() {
  const payload = JSON.parse(readFileSync(0, "utf8"));
  const filePath = String(payload?.tool_input?.file_path ?? "");
  if (!CODE_EXTS.has(extname(filePath).toLowerCase())) return;
  const sessionId = String(payload?.session_id ?? "");
  if (!sessionId) return;

  const stateDir = join(homedir(), ".claude", "wzrdx", "state");
  const marker = join(stateDir, `sdd-gate-${sessionId}`);
  if (existsSync(marker)) return;

  const cwd = String(payload?.cwd ?? process.cwd());
  if (hasRecentSpec(cwd)) return;

  mkdirSync(stateDir, { recursive: true });
  writeFileSync(marker, new Date().toISOString());

  const reminder =
    "wzrdx SDD gate (non-blocking reminder): no spec was modified in the last " +
    "7 days under docs/specs/ or docs/superpowers/specs/. Before implementing, " +
    "consider invoking the eng:spec-driven-development skill (deployed in " +
    "Claude Code as wzrdx-eng-spec-driven-development) to locate or " +
    "author an approved spec. The edit itself is allowed.";
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
        permissionDecisionReason: reminder,
        additionalContext: reminder,
      },
    }),
  );
}

try {
  main();
} catch {
  // fail-open by design
}
process.exit(0);
