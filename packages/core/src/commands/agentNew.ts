import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findRepoRoot, wzrdxPaths } from "../paths.js";
import { ui } from "../ui.js";

interface AgentNewOptions {
  department?: string;
  role?: string;
  tier?: string;
  model?: string;
}

/** Scaffold a new agent at artifacts/agents/<name>/agent.md from the template. */
export function agentNewCommand(name: string, opts: AgentNewOptions = {}): void {
  const department = opts.department ?? "core";
  const role = opts.role ?? "Specialist";
  const tier = ["0", "1", "2", "3"].includes(opts.tier ?? "") ? opts.tier : "2";
  const model = ["opus", "sonnet", "haiku"].includes(opts.model ?? "")
    ? opts.model
    : "sonnet";
  const paths = wzrdxPaths(findRepoRoot());
  const dir = join(paths.agents, name);
  const file = join(dir, "agent.md");

  ui.title("wzrdxOS — agent new");

  if (existsSync(file)) {
    ui.fail(`agent already exists at ${ui.dim(file)}`);
    process.exitCode = 1;
    return;
  }

  const body = `---
name: ${name}
role: ${role}
department: ${department}
tier: ${tier}
model: ${model}
description: One-line description of what this agent is best at.
---

# ${name} — ${role}

## Mandate

What this agent owns and is accountable for.

## How ${name} works

The agent's approach, standards and non-negotiables.

## System prompt

You are ${name}, ${role} in the ${department} department of wzrdxOS.
`;

  mkdirSync(dir, { recursive: true });
  writeFileSync(file, body, "utf8");
  ui.ok(`created ${ui.dim(file)}`);
  console.log("");
}
