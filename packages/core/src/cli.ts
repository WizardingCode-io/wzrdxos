#!/usr/bin/env node
import { Command } from "commander";
import { statusCommand } from "./commands/status.js";
import { doctorCommand } from "./commands/doctor.js";
import { initCommand } from "./commands/init.js";
import { skillNewCommand } from "./commands/skillNew.js";
import { agentNewCommand } from "./commands/agentNew.js";
import { setupCommand } from "./commands/setup.js";
import { updateCommand } from "./commands/update.js";
import { runtimesCommand, runtimesInstallCommand } from "./commands/runtimes.js";
import { pluginsCommand } from "./commands/plugins.js";

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

const runtimes = program
  .command("runtimes")
  .description("scan / install supported AI agent runtimes (install targets)");
runtimes
  .command("scan", { isDefault: true })
  .description("scan the machine for supported runtimes")
  .action(() => runtimesCommand());
runtimes
  .command("install")
  .description("install wzrdxOS into detected runtimes (or --only id1,id2)")
  .option("--only <ids>", "comma-separated runtime ids")
  .option("--gemini-key <key>", "Gemini API key to inject into the MCP env")
  .action((opts) => runtimesInstallCommand({ only: opts.only, geminiKey: opts.geminiKey }));

program
  .command("setup")
  .description("auto-install the KB stack (uv, graphify, worker) and register the MCP")
  .option("-y, --yes", "non-interactive (use defaults / flags)")
  .option("-m, --mode <mode>", "ingestion mode: manual | automatic")
  .option("--gemini-key <key>", "Gemini API key (automatic mode)")
  .option("--runtimes <ids>", "runtimes to install into: all | none | comma-separated ids")
  .action((opts) =>
    setupCommand({ yes: opts.yes, mode: opts.mode, geminiKey: opts.geminiKey, runtimes: opts.runtimes }),
  );

program
  .command("update")
  .description("keep the KB stack in sync (upgrade graphify, re-sync worker, refresh MCP)")
  .action(() => updateCommand());

program
  .command("plugins")
  .description("list declared department plugins/MCPs and their adoption status")
  .option("-d, --department <slug>", "filter by department")
  .action((opts) => pluginsCommand({ department: opts.department }));

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
