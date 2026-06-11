---
name: eng:ai-agent-architecture
description: Design multi-agent systems — choose the right orchestration pattern (sequential/hierarchical/graph/swarm), engineer context and memory layers, apply Claude Managed Agents for 24/7 workloads, and produce an architecture memo or ADR.
type: capability
department: eng
when-to-use: Designing a new agent or multi-agent system, choosing between orchestration patterns, architecting context/memory layers, reviewing an existing agentic architecture, or when the user says "como estruturar os agentes", "qual o padrão de orquestração", "agent architecture", "multi-agent design", or similar.
---

# AI Agent Architecture

Flexible capability skill. Takes a system requirement or agentic problem statement and
produces a structured architecture decision — pattern choice, context strategy, memory
layers, and a deployable ADR or architecture memo. Adapts depth from a quick
pattern recommendation to a full blueprint.

Anchored on: Claude Managed Agents Architecture (KB framework), Agentic Development
topic, Claude Code Mastery topic, AI Operating Systems topic. Personas Liam Ottley
(AIOS layers) and DDias Matt (MCP USB patterns). All sourced from the wzrdxOS
Obsidian vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Existing agent designs, ADRs, or architecture decisions in the KB or `docs/`.
- "Claude Managed Agents Architecture" framework — orchestration topology vocabulary.
- "Agentic Development" topic — patterns, pitfalls, context engineering principles.
- "AI Operating Systems" topic — Liam Ottley 5-Layer AIOS reference.
- Company profile (`wzrdx company`) — runtime constraints, budget tier, deployment target.

Note what already exists. Only design from scratch for genuine gaps.

### 2. Clarify the problem scope

Before choosing a pattern, nail down:

| Dimension | Questions |
|-----------|-----------|
| Task type | Deterministic pipeline or open-ended reasoning? |
| Concurrency | Tasks run sequentially, in parallel, or dynamically spawned? |
| State | How much shared state between agents? Where does it live? |
| Reliability | Is failure of a sub-agent recoverable? How? |
| Cost tier | Token budget per run? Latency constraints? |
| Runtime | Claude Code subagents, cloud managed agents, or hybrid? |

Record answers before recommending a pattern. Skipping this step leads to
over-engineered designs.

### 3. Choose the orchestration pattern

Select one primary pattern (or a justified hybrid) from the canonical set:

**Sequential (pipeline):**
- Use when: tasks have strict dependencies; output of step N is input of step N+1.
- Strengths: simple, debuggable, deterministic.
- Weaknesses: no parallelism; one slow step blocks everything.
- Example: spec-writing → code review → security scan → merge.

**Hierarchical (orchestrator + specialists):**
- Use when: one "manager" agent decomposes work and dispatches to role-specialist
  sub-agents; results are synthesized at the top.
- Strengths: natural for complex, multi-domain tasks; easy to add specialists.
- Weaknesses: orchestrator becomes the bottleneck and single point of failure.
- Example: Conductor → COO subagent + CTO subagent → synthesis.

**Graph (DAG):**
- Use when: tasks have partial dependency ordering — some can run in parallel, some
  must sequence; the topology is known at design time.
- Strengths: maximizes parallelism; explicit dependency modeling.
- Weaknesses: harder to build and debug; graph changes require structural edits.
- Example: market research (parallel) → strategy synthesis → CEO gate → execution.

**Swarm (dynamic peer agents):**
- Use when: the number and roles of agents emerge from the task at runtime; agents
  collaborate and can spawn sub-agents.
- Strengths: highly adaptive; good for open-ended exploration.
- Weaknesses: hard to control; cost and token usage can explode; debugging is painful.
- Example: adversarial review (judge panel), open research fan-out.

**Pattern selection rule:** prefer the simplest pattern that satisfies the
requirements. Swarm is rarely the right first choice. Document the rejected patterns
and the reason for rejection in the ADR.

### 4. Design the context and memory layers

Every agent system has three memory dimensions. Map each explicitly:

**In-context (working memory):**
- What must every agent see in its system prompt or conversation window?
- Rule: only include what the agent actively uses. Every token in context is a cost.
- Use `<cache>` blocks for static content (system prompts, shared references) to
  minimize repeated token spend (see `eng:token-cost-optimization`).

**External / KB memory:**
- Short-term: conversation history, task notes, intermediate outputs → project-scoped
  KB (source-prefix: `memos/`).
- Long-term: decisions, learnings, patterns → global KB (source-prefix varies by type).
- Rule: agents write to the KB; they do not keep state in memory variables.

**Structural memory (the harness):**
- The orchestrator's routing table, the agent manifest, the workflow DAG.
- This is code / config, not conversation. It changes through PRs, not at runtime.

### 5. Apply Claude Managed Agents pattern (24/7 workloads)

For agents that need to run continuously or on a schedule (not just on-demand):

- **Managed agent** = an agent with a persistent system prompt, a defined tool set
  (least-privilege), and a memory store it owns.
- Key decisions:
  - Who owns the agent's system prompt? (Engenharia — stored in `artifacts/agents/`)
  - What tools does it have? (Minimum viable tool set — no unnecessary permissions.)
  - How does it receive tasks? (KB poll, webhook trigger, or schedule via `wzrdx schedule`.)
  - How does it report back? (KB ingest to `memos/`, then CKO digest picks it up.)
- Apply the `/new-employee` pattern from Liam Ottley: give the agent a role brief,
  a tool list, a memory store, and a reporting cadence before activating it.
- Document the agent in `artifacts/agents/<name>/agent.md` per `docs/formats.md`.

### 6. Write the architecture memo / ADR

Produce a structured memo with these sections:

```
# Architecture Decision — <system name>

**Date:** YYYY-MM-DD
**Status:** proposed | accepted | superseded

## Context
<problem statement; why a decision is needed now>

## Options considered
<each pattern considered + its trade-offs in this context>

## Decision
<chosen pattern and configuration>

## Context engineering
<what goes in-context; what goes in KB; what is structural>

## Memory layers
<in-context: ...; external/KB: ...; structural: ...>

## Agent manifest
<agents, their roles, their tools, their memory stores>

## Consequences
<what becomes easier; what becomes harder; known risks>

## Open questions
<unresolved items — flag for CEO gate if any are strategy-grade>
```

Flag any decision that materially affects cost (model tier change, major token
budget increase) or architecture direction for the CEO balanced-decision gate before
finalizing.

### 7. Ingest the ADR to the KB

```
kb_ingest("<memo text>", source="memos/YYYY-MM-DD-agent-architecture-<slug>.md", target="global")
```

Copy the ADR to `docs/` in the repo as well (`docs/adr-<slug>.md`) — the CTO owns
ADRs in the repo as the technical source of truth (org.md §3).

## Output contract

Every invocation delivers:
1. **Pattern recommendation** — chosen orchestration pattern with rationale and
   rejected alternatives documented.
2. **Context engineering map** — what each agent sees in-context and why.
3. **Memory layer design** — in-context / KB / structural allocation per agent.
4. **Agent manifest** — agents, roles, tools, memory stores, reporting cadences.
5. **Architecture memo / ADR** — ready to paste into `docs/` and ingest to KB.

## Red flags

- **Choosing swarm first.** Swarm is the most complex pattern; justify it explicitly.
  Sequential or hierarchical covers 80% of real cases.
- **Putting everything in context.** Every token costs money and fills the window.
  If information is not actively used every call, it belongs in KB or structural memory.
- **Skipping the KB-first step.** A prior ADR may already exist; building twice is
  expensive.
- **Managed agents without least-privilege tools.** An agent with more tools than it
  needs is a security surface. Document every tool and the reason it is included.
- **No reporting cadence.** A 24/7 agent with no reporting mechanism is a black box;
  CKO cannot digest what it produces.
- **ADR not landed in `docs/`.** Architecture decisions that live only in the KB are
  not the technical source of truth — they must be in the repo.
