#!/usr/bin/env node
import { Command } from "commander";
import { statusCommand } from "./commands/status.js";
import { doctorCommand } from "./commands/doctor.js";
import { initCommand } from "./commands/init.js";
import { skillNewCommand } from "./commands/skillNew.js";
import { agentNewCommand } from "./commands/agentNew.js";
import { setupCommand } from "./commands/setup.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

program
  .name("wzrdx")
  .description("wzrdxOS — operating system for AI agent teams")
  .version("0.1.0");

program
  .command("init")
  .description("initialize a wzrdxOS workspace in the current directory")
  .option("-f, --force", "overwrite an existing config")
  .action((opts) => initCommand({ force: opts.force }));

program
  .command("status")
  .description("list registered skills, agents and workflows")
  .action(() => statusCommand());

program
  .command("doctor")
  .description("validate the local environment")
  .action(() => doctorCommand());

program
  .command("setup")
  .description("auto-install the KB stack (uv, graphify, worker) and register the MCP")
  .option("-y, --yes", "non-interactive (use defaults / flags)")
  .option("-m, --mode <mode>", "ingestion mode: manual | automatic")
  .option("--gemini-key <key>", "Gemini API key (automatic mode)")
  .action((opts) => setupCommand({ yes: opts.yes, mode: opts.mode, geminiKey: opts.geminiKey }));

program
  .command("update")
  .description("keep the KB stack in sync (upgrade graphify, re-sync worker, refresh MCP)")
  .action(() => updateCommand());

const skill = program.command("skill").description("manage skills");
skill
  .command("new <name>")
  .description("scaffold a new skill")
  .option("-d, --department <slug>", "owning department", "core")
  .option("-t, --type <type>", "process | capability", "capability")
  .action((name, opts) => skillNewCommand(name, opts));

const agent = program.command("agent").description("manage agents");
agent
  .command("new <name>")
  .description("scaffold a new agent")
  .option("-d, --department <slug>", "owning department", "core")
  .option("-r, --role <role>", "human-facing role")
  .option("-T, --tier <tier>", "authority tier 0-3", "2")
  .option("-m, --model <model>", "opus | sonnet | haiku", "sonnet")
  .action((name, opts) => agentNewCommand(name, opts));

program.parseAsync(process.argv);
