# wzrdxOS artifact formats

The registry (`@wzrdx/core`) loads four artifact types from `artifacts/`. This
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

## Hooks — `artifacts/hooks/<name>/hook.mjs` + `hook.json`

A native runtime hook: a dependency-free Node script plus a JSON manifest.

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Unique id (falls back to the directory name). |
| `description` | yes | One-line summary. |
| `event` | yes | `PreToolUse` \| `PostToolUse` \| `UserPromptSubmit` \| `SessionStart` \| `Stop`. |
| `matcher` | no | Tool-name matcher, e.g. `Edit\|Write\|MultiEdit`. |

**wzrdx hooks are ALWAYS non-blocking** — they inject context or reminders
(`permissionDecision: "allow"` + `additionalContext`) and never `deny`/`ask`.
They are fail-open: any internal error exits 0 silently. See the Flow policy
below — this is the enforcement style that replaces ArkaOS's blocking gates.

Deploy: script → `~/.claude/wzrdx/hooks/<name>.mjs`; the hook entry is merged
into `~/.claude/settings.json` surgically and idempotently — wzrdx-managed
entries are recognized by their command path (`.claude/wzrdx/hooks/`), user
entries are never touched, and an unparseable settings file is left alone.
This is the one documented, surgical exception to "user files are never
touched": settings.json is the only place Claude Code reads hooks from.

## Plugins — `artifacts/plugins/<department>/plugins.json`

A JSON manifest declaring the plugins/MCPs/skill-packs a department depends on.
Declared, **never auto-installed** — `wzrdx plugins` lists them; doctor reports
status; adoption is a human decision.

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Unique within the department. |
| `kind` | yes | `mcp` \| `plugin` \| `command` \| `skill-pack`. |
| `status` | yes | `required` \| `adopt` \| `optional` \| `planned` \| `deferred` \| `rejected`. |
| `source` | no | Repo URL, marketplace id, or internal path. |
| `install` | no | Install command or pointer. |
| `notes` | no | Rationale. Third-party packs are vetted before adoption. |

The file shape is `{ "department": "<slug>", "plugins": [ … ] }`.

## Deployment — `wzrdx install claude`

Registry artifacts deploy into Claude Code's native locations, always prefixed
`wzrdx-` (user files are never touched): agents → `~/.claude/agents/wzrdx-<name>.md`
(subagent format), skills → `~/.claude/skills/wzrdx-<dept>-<dirname>/SKILL.md`
(frontmatter `name` rewritten to the slug), workflows → `~/.claude/workflows/<name>.mjs`.
`wzrdx setup` runs this as its final step. Known limitation: renamed/removed
artifacts leave stale deployed copies (no pruning yet). Other runtimes receive the
instructions-block + MCP wiring (see `docs/runtimes.md`); artifact deployment for
them is future work.

## Flow policy (non-negotiable, by inversion)

wzrdxOS never ships **blocking enforcement hooks**. The flow is opt-in: a workflow
the user chooses, not a gate that stalls work. This is the explicit anti-pattern
inherited from ArkaOS. Hooks ARE allowed — but only non-blocking ones: they may
inject context and reminders at the right moment (e.g. the `sdd-gate` spec-first
nudge) and must always allow the action, fail-open, and rate-limit themselves
(once per session).
