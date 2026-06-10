---
name: ops:pop-builder
description: Process inventory + Estratégico×Delegável classification + POP (Procedimento Operacional Padrão) generation with step-by-step checklists and quality criteria — ready for delegation.
type: capability
department: ops
when-to-use: Documenting a recurring process, creating an SOP/POP, preparing a process for delegation, or when the user says "POP", "SOP", "documentar processo", "delegar", "checklist" or similar.
---

# POP Builder

Flexible capability skill. Takes a process (named or described) and produces a
complete, delegation-ready POP — Procedimento Operacional Padrão — with step-by-step
instructions, quality criteria, checklists and the classification that drives the
delegation decision.

Anchored on the WizardingCode vault POP templates (lead intake, client onboarding
D14, monthly close) and the Dan Martell 92%-rule / No-How-To Delegation framework.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) and any existing process documentation.
- Prior POPs or SOPs already in the KB for this process or department.
- WizardingCode vault POP templates: lead intake · client onboarding D14 · monthly
  close — use as scaffolds if the process matches.
- Relevant frameworks: Dan Martell No-How-To Delegation, 92% rule, Buyback Rate;
  Alex Hormozi systems thinking.

Note what already exists. Only generate from scratch for genuine gaps.

### 2. Process inventory (if starting from scratch)

Before writing the first POP, map all recurring processes in scope:

1. **List:** ask the founder / operator: "What do you do that you do more than once?"
   Capture every recurring task — daily, weekly, monthly, per-client, per-project.
2. **Time audit:** for each process, estimate: frequency × time-per-run × founder-only?
3. **Pain rank:** sort by Founder-Hours-per-Month (FHM) descending. Top 5 = the first
   POPs to write.

Output a process inventory table:

| Process | Frequency | Time/run | FHM | Founder-only? | Priority |
|---------|-----------|----------|-----|---------------|----------|

### 3. Estratégico × Delegável classification

For each process in scope, classify on two axes:

**Estratégico axis (high/low):**
- High: requires final judgement, client relationship ownership, legal/financial sign-off,
  or strategic context only the founder holds.
- Low: rule-based, template-driven, or expertise that can be documented and taught.

**Delegável axis (ready/not ready):**
- Ready: the process can be documented clearly enough for a capable person to follow
  at 92%+ quality without founder involvement.
- Not ready: missing tools, missing authority, or genuinely founder-dependent context.

**Quadrant output:**

| Quadrant | Action |
|----------|--------|
| Estratégico + Not ready | Founder keeps; schedule for future redesign |
| Estratégico + Ready | Document → delegate execution; founder reviews output |
| Operacional + Not ready | Document first → then delegate |
| Operacional + Ready | **Delegate now** — highest priority POP |

Flag every "Delegate now" process as immediate POP priority.

### 4. POP generation

For each selected process, produce the POP document. Follow this structure:

---

**POP — [Process Name]**

| Field | Value |
|-------|-------|
| ID | POP-[DEPT]-[NNN] |
| Owner | [Role, not name] |
| Version | 1.0 |
| Created | [YYYY-MM-DD] |
| Last reviewed | [YYYY-MM-DD] |
| Trigger | What starts this process |
| Inputs | What is needed before starting |
| Outputs | What is produced / delivered |
| SLA | Expected completion time |
| Tools | List of tools/platforms used |

**Steps (numbered, action-first verbs):**

1. [Verb] [Object] — [where / how] — [quality criterion]
2. …
3. …

Use sub-steps (1a, 1b) for branching decisions. Keep each step to one action.
Include decision points explicitly: "IF [condition] → go to step N; ELSE → go to step M."

**Quality criteria (the 92%-rule checklist):**
- [ ] Criterion 1 — measurable, not subjective.
- [ ] Criterion 2
- [ ] …

A task delegated without quality criteria is not delegated — it is abandoned.

**Common errors:**
- Error 1 → how to prevent / recover.
- …

**Escalation:** if [condition], escalate to [owner] via [channel] within [timeframe].

---

Produce one POP document per process selected. If multiple POPs are requested,
generate them sequentially and confirm each before starting the next.

### 5. Delegation handoff plan

For each completed POP, produce a handoff card:

| Field | Value |
|-------|-------|
| Process | POP ID + name |
| Delegating to | Role / person |
| Handoff date | Target date |
| Training method | Shadow × 1 · Pair × 2 · Supervised × 3 · Autonomous |
| First supervised run | Date |
| Autonomous by | Date |
| Review cadence | Weekly / bi-weekly until autonomous |

Three-repetition rule (Dan Martell): shadow → pair → supervised → autonomous.
Never skip a phase; document each checkpoint result.

### 6. Ingest to KB

After producing each POP, ingest it into the KB via `kb_ingest`:
- Title: `POP — [Process Name] — [Company] — v1.0`.
- Tags: `pop`, `sop`, `processo`, `<dept>`, `<company-slug>`.
- Include: the full POP document + classification + handoff plan.

## Output contract

For each process, the deliverable contains:
1. **Classification** — Estratégico×Delegável quadrant + action.
2. **POP document** — trigger, inputs, outputs, SLA, tools, numbered steps, quality
   criteria, common errors, escalation path.
3. **Handoff card** — who, when, training method, autonomous-by date.
4. **Next action** — single most important next step, owner, deadline.

## Red flags

- Writing a POP without quality criteria — unmeasurable delegation is not delegation.
- Skipping the Estratégico×Delegável classification — not every process should be
  delegated in the same way.
- Steps with passive verbs or vague objects ("ensure quality", "check things") — every
  step must be an action that can be ticked done.
- Delegating without a handoff plan — the three-repetition rule is not optional.
- Generating a POP for a process the KB already documents — check first.
