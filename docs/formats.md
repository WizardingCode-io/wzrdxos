# wzrdxOS artifact formats

The registry (`@wzrdx/core`) loads three artifact types from `artifacts/`. This
document is the contract. Keep it in sync with `packages/core/src/registry/`.

## Conventions

- Everything is **file-based** and human-readable. The registry is built by
  scanning directories — no database.
- Skills are **namespaced by department** via their directory path and a
  `<department>:<name>` id.
- Naming: lower-kebab-case directory names; ids are `<department>:<name>`.

## Skills — `artifacts/skills/<department>/<name>/SKILL.md`

Markdown with YAML frontmatter.

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Id, conventionally `<department>:<name>`. |
| `description` | yes | One line; used for discovery / routing. |
| `type` | yes | `process` (rigid) or `capability` (flexible domain). |
| `department` | yes | Owning department slug, or `core`. |
| `when-to-use` | no | Trigger conditions; drives the Skill tool description. |

The body is the skill content itself (purpose, steps, red flags).

Scaffold with: `wzrdx skill new <name> --department <slug> --type <type>`.

## Agents — `artifacts/agents/<name>/agent.md`

Markdown with YAML frontmatter.

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Unique agent id (lower-case). |
| `role` | yes | Human-facing role. |
| `department` | yes | Owning department slug. |
| `tier` | yes | `0` leadership · `1` lead · `2` specialist · `3` support. |
| `model` | yes | `opus` \| `sonnet` \| `haiku`. |
| `description` | yes | One line. |

The body documents the mandate, working style and system prompt.

Scaffold with: `wzrdx agent new <name> --department <slug> --role "..." --tier N --model <m>`.

> The final agent roster and personas are designed in **milestone M3**. The
> example `paulo` agent exists only to exercise the format.

## Workflows — `artifacts/workflows/<name>/workflow.mjs`

A real [Workflow-tool](https://claude.com/claude-code) script. It **must** begin
with a pure-literal `export const meta = { name, description, phases }` block.

The registry reads `meta` **statically** (regex; never executes the body, which
is side-effectful). Extracted fields:

- `name` — from `meta.name` (falls back to the directory name).
- `description` — from `meta.description`.
- `phases` — count of `title:` entries in `meta.phases`.

Workflows encode reusable quality patterns: fan-out + adversarial verification,
judge panels, loop-until-dry, multi-modal sweep, completeness critic. See
`artifacts/workflows/adversarial-review/` for the canonical example.

## Flow policy (non-negotiable, by inversion)

wzrdxOS never ships **blocking enforcement hooks**. The flow is opt-in: a workflow
the user chooses, not a gate that stalls work. This is the explicit anti-pattern
inherited from ArkaOS.
