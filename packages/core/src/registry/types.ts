/**
 * wzrdxOS registry types — the contract for every artifact the engine knows about.
 *
 * Artifacts live as files under `artifacts/` and are loaded into this in-memory
 * registry. The format for each is documented in `docs/formats.md`.
 */

/** A skill: a small, composable, disciplined capability (superpowers-style). */
export interface SkillDefinition {
  /** Unique id, namespaced by department, e.g. "eng:tdd-cycle". */
  name: string;
  /** One-line summary used for discovery/routing. */
  description: string;
  /**
   * Process skills are rigid (follow exactly: brainstorm, debug, TDD).
   * Capability skills are flexible domain skills.
   */
  type: "process" | "capability";
  /** Owning department slug, or "core" for cross-cutting process skills. */
  department: string;
  /** When the skill should fire — drives the Skill tool description. */
  whenToUse?: string;
  /** Absolute path to the SKILL.md file. */
  path: string;
}

/** An agent: a persona with a role inside a department. */
export interface AgentDefinition {
  /** Unique id, e.g. "paulo". */
  name: string;
  /** Human-facing role, e.g. "Senior Backend Engineer". */
  role: string;
  /** Owning department slug. */
  department: string;
  /** Authority tier: 0 = leadership, 1 = lead, 2 = specialist, 3 = support. */
  tier: 0 | 1 | 2 | 3;
  /** Default model for this agent (opus | sonnet | haiku). */
  model: "opus" | "sonnet" | "haiku";
  /** One-line description for discovery. */
  description: string;
  /** Absolute path to the agent definition file. */
  path: string;
}

/** A workflow: a reusable Workflow-tool script encoding a quality pattern. */
export interface WorkflowDefinition {
  /** Unique id (matches the script's meta.name), e.g. "review-changes". */
  name: string;
  /** One-line summary. */
  description: string;
  /** Number of declared phases (from meta.phases), when discoverable. */
  phases: number;
  /** Absolute path to the workflow script (.mjs). */
  path: string;
}

/** A plugin/MCP/skill-pack a department depends on. Declared, not auto-installed. */
export interface PluginDefinition {
  /** Unique name within the department, e.g. "wzrdx-kb". */
  name: string;
  /** What kind of integration this is. */
  kind: "mcp" | "plugin" | "command" | "skill-pack";
  /** Adoption status — drives doctor/status reporting, never blocks. */
  status: "required" | "adopt" | "optional" | "planned" | "deferred" | "rejected";
  /** Owning department slug. */
  department: string;
  /** Where it comes from (repo URL, marketplace id, internal path). */
  source?: string;
  /** How to install it (command or pointer). */
  install?: string;
  /** Free-form rationale/notes. */
  notes?: string;
  /** Absolute path to the manifest that declared it. */
  path: string;
}

/** The fully loaded registry. */
export interface Registry {
  skills: SkillDefinition[];
  agents: AgentDefinition[];
  workflows: WorkflowDefinition[];
  plugins: PluginDefinition[];
  /** Distinct department slugs discovered across skills, agents and plugins. */
  departments: string[];
}
