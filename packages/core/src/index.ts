/** Public API surface of @wzrdx/core (for programmatic consumers). */
export { loadRegistry } from "./registry/loader.js";
export type {
  AgentDefinition,
  Registry,
  SkillDefinition,
  WorkflowDefinition,
} from "./registry/types.js";
export {
  claudePaths,
  findRepoRoot,
  wzrdxPaths,
  type ClaudePaths,
  type WzrdxPaths,
} from "./paths.js";
