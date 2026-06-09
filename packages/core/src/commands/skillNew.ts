import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findRepoRoot, wzrdxPaths } from "../paths.js";
import { ui } from "../ui.js";

interface SkillNewOptions {
  department?: string;
  type?: "process" | "capability";
}

/** Scaffold a new skill at artifacts/skills/<dept>/<name>/SKILL.md from the template. */
export function skillNewCommand(name: string, opts: SkillNewOptions = {}): void {
  const department = opts.department ?? "core";
  const type = opts.type === "process" ? "process" : "capability";
  const paths = wzrdxPaths(findRepoRoot());
  const dir = join(paths.skills, department, name);
  const file = join(dir, "SKILL.md");

  ui.title("wzrdxOS — skill new");

  if (existsSync(file)) {
    ui.fail(`skill already exists at ${ui.dim(file)}`);
    process.exitCode = 1;
    return;
  }

  const id = `${department}:${name}`;
  const body = `---
name: ${id}
description: One-line summary used for discovery and routing.
type: ${type}
department: ${department}
when-to-use: Describe the trigger — when should this skill fire?
---

# ${name}

## Purpose

What this skill does and the outcome it produces.

## When to use

The concrete trigger conditions.

## Steps

1. ...
2. ...

## Red flags

Thoughts that mean you are rationalizing away the skill.
`;

  mkdirSync(dir, { recursive: true });
  writeFileSync(file, body, "utf8");
  ui.ok(`created ${ui.dim(file)}`);
  console.log("");
}
