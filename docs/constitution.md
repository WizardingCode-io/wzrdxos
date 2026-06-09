# wzrdxOS Constitution

The mandatory operating doctrine of wzrdxOS. These rules apply to **everything**,
regardless of user or context. They are the difference between a pile of agents and an
operating system that gets smarter over time.

## The mandatory rules

1. **Flow always.** Every request follows the wzrdxOS flow — no matter the context.
2. **Task decomposition.** Work is broken into small tasks; each is analyzed before it
   is executed.
3. **KB-first (always).** Before anything is done or executed, the Knowledge Base is
   consulted first. Always.
4. **Document-first.** Anything done for the first time is documented in the KB — so the
   OS already holds that knowledge next time.
5. **Knowledge enrichment is mandatory.** The KB grows continuously; every task can leave
   it richer than it found it.
6. **Evolutive agents.** Agents improve automatically as knowledge grows — re-oriented
   with new techniques, concepts, and knowledge. Dynamic, automatic, evolutive.

## Mandatory ≠ friction

These rules are mandatory, but wzrdxOS does **not** enforce them with the brittle,
blocking marker-hooks that made ArkaOS painful (every action stalling on a missing text
marker). Enforcement is **native and intelligent**:

- The **core conductor** decomposes work, runs the KB-first lookup, and writes new
  learnings back to the KB as a natural part of doing the task.
- **Quality workflows** (adversarial verification, judge panels) guarantee quality by
  construction, not by gates that block the user.
- An **evolution loop** upgrades agent definitions as the KB accumulates patterns.

> Mandatory behavior, smooth enforcement. That is the doctrine.

## How the loop compounds

```
request → decompose into tasks → KB-first lookup (reuse what we know)
        → execute via the right department/agents + quality workflow
        → document new learnings into the KB
        → KB grows → agents evolve → next request is smarter
```

This is why the Knowledge Base ([Graphify + LanceDB + Obsidian](kb-design.md)) is the
heart of wzrdxOS: the doctrine turns every task into compounding intelligence.
