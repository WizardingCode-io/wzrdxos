---
name: knowledge:agent-evolution
description: Evolve a wzrdxOS agent definition based on cited KB evidence — gather digest/enrichment evidence for the capability gap, draft the agent.md diff (system-prompt/working-style additions grounded in KB content), gate mandate changes through the CEO balanced-decision, and propose as a PR. Never auto-applies. Use when digests show a recurring technique an agent lacks, an agent repeatedly under-performs in an area, or quarterly agent review identifies a sharpening opportunity.
type: process
department: knowledge
when-to-use: Digests show a recurring technique or knowledge an agent lacks; an agent repeatedly under-performs in a domain; "o agente X devia saber Y"; quarterly agent review; knowledge:daily-digest routes a gap to a specific dept head who confirms the agent needs sharpening.
---

# Agent Evolution

Rigid process skill — follow every step in order without skipping. This skill
operationalizes **Constitution rule 6** (evolutive agents) at the agent layer: it
sharpens agent definitions as the KB accumulates patterns, gated by human review.

**The daily digest (`knowledge:daily-digest`) is the primary input feed for this
skill.** When the digest routes a knowledge gap to a dept head and they confirm the
gap is an agent shortfall, this skill picks it up.

**Critical boundary:** evolution may sharpen HOW an agent does its work — techniques,
working style, KB-first patterns, tool preferences. It may NEVER change the agent's
mandate, department, does-NOT boundaries, or C-suite double-hat assignment without
an `org.md` change approved through the CEO balanced-decision gate.

MCP tools used: `kb_search`, `kb_ask`, `kb_ingest`.

## Steps

### 1. KB-first — gather the evidence

```
kb_search("<the technique, domain, or recurring gap>")
kb_ask("What does the KB say about <technique>? How many times has it appeared in digests?")
```

Identify and cite the evidence for the capability gap:
- Specific digest entries where the gap appeared (`[source: digests/YYYY-MM-DD.md]`).
- Enrichment verdicts or memos that named the pattern.
- Knowledge the KB holds that the agent is not currently using.

The evidence must be cited, not asserted. Every gap claim requires a source. If you
cannot cite it, it is not a verified gap — stop and document the candidate for
future monitoring.

### 2. Read the target agent and its org.md section

Read the target agent's definition file: `artifacts/agents/<name>/agent.md`.

Read the corresponding section in `docs/org.md` (the authoritative spec for the
agent's mandate, responsibilities, does-NOT boundaries, and toolbox).

Identify:
- **Current working style / system prompt** — what the agent already knows and does.
- **The gap** — what the KB evidence in step 1 shows the agent is missing.
- **The boundary** — what the agent's mandate explicitly covers vs. does NOT cover.
  Evolution is only valid within the mandate. Boundary changes need org.md surgery.

Document explicitly: "The gap falls [within / outside] the agent's current mandate."

### 3. Draft the agent.md diff

If the gap falls **within the mandate**: draft additions to the agent's working style,
system-prompt enrichment, or toolbox — grounded entirely in the KB content cited in
step 1.

Additions may include:
- New techniques or frameworks the agent should apply (cite the KB source).
- KB-first search patterns specific to this agent's domain.
- Tool preferences or sequencing improvements.
- Persona/working-style sharpening (more direct, more quantitative, etc.) — only if
  evidenced in the KB.

Keep diffs small and focused. One gap → one evolution event. Batching multiple gaps
in one PR makes review harder and rollback impossible.

Format the diff as a `git diff`-style before/after block:

```diff
## Working style
+
+**<New technique from KB>** — <one-sentence rationale citing the KB source>.
+Apply this when <trigger condition>: <specific step or behavior>.
```

If the gap falls **outside the mandate**: do NOT evolve. Instead, document the finding
and route it to the CEO gate (step 4 is mandatory for mandate changes).

### 4. Mandate changes → CEO balanced-decision first

If the evolution would change the agent's mandate, does-NOT boundaries, or C-suite
double-hat assignment, invoke `wzrdx-ceo-balanced-decision` before drafting:

```
wzrdx-ceo-balanced-decision(
  context="Proposed mandate change for <agent>: <description>",
  impact="<what changes and why>"
)
```

The CEO gate produces an Optimist / Pessimist-conservative / Risk-taker assessment.
Include the gate verdict in the PR body. Do not open the PR without it.

For working-style-only evolutions (no mandate change), skip this step.

### 5. Propose as a PR — never auto-apply

Apply the draft diff to `artifacts/agents/<name>/agent.md` in a working branch.

Open a PR with:
- **Title:** `feat(agents): evolve <name> — <one-line gap description>`
- **Body:**
  - This skill operationalizes Constitution rule 6; the daily digest
    (`knowledge:daily-digest`) is its input feed.
  - Evidence: the cited KB sources from step 1 (digests, memos, enrichment).
  - Mandate check: confirmation that the gap falls within the mandate (or CEO gate
    verdict if it does not).
  - Diff: the before/after agent.md changes.
  - Redeploy note: after merge, run `wzrdx install claude` to deploy the updated
    agent definition.

**This PR must not be merged by the agent-evolution process itself.** A human
reviews and merges. The PR gate is the safeguard against silent mandate drift —
the most dangerous failure mode of an evolving agent system.

### 6. After merge — redeploy and document

After the PR is merged (by a human):

```bash
wzrdx install claude
```

This redeploys all agents to `~/.claude/agents/`. The updated agent is live.

Document the evolution:

```
kb_ingest(
  source="memos/agent-evolution-<name>-YYYY-MM-DD.md",
  content="# Agent Evolution: <name>\nDate: YYYY-MM-DD\nGap addressed: <description>\nEvidence: <cited sources>\nChanges: <summary of diff>\nMerged: PR #<N>\nRedeployed: yes"
)
```

## Red flags

- **Editing mandates or does-NOT boundaries silently.** This is the critical failure
  mode — an agent whose boundary shifts without org.md approval gradually loses its
  identity and causes routing ambiguity. Never touch the mandate without the CEO gate.
- **Evolution without cited KB evidence.** "I think the agent should know X" is an
  opinion, not a knowledge event. Every evolution must be anchored in retrieved KB
  content with source citations.
- **Auto-applying without review.** The PR gate is what distinguishes a controlled
  evolution from an untraceable drift. Auto-merging defeats the entire purpose.
- **Batching multiple gaps in one PR.** Mixing gaps makes review harder and rollback
  impossible. One gap per evolution event.
- **Not redeploying after merge.** The agent definition in `artifacts/` is the source
  of truth; `~/.claude/agents/` is the deployed copy. Forgetting to redeploy means
  the evolution never reaches the runtime.
- **Not documenting the evolution to the KB.** Future digests need to know what
  changed and why. Undocumented evolutions cannot be tracked, reversed, or learned from.
