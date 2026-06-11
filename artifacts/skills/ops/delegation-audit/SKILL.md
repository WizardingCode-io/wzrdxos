---
name: ops:delegation-audit
description: "Apply the Estratégico×Delegável matrix over the founder's task inventory, analyse the 5-failed-hire pattern, define the first-hire profile (92% rule, director-not-doer), and produce a delegation plan — cross-referencing rh:hiring-pipeline and admin:buyback-audit."
type: capability
department: ops
when-to-use: Auditing what the founder can and should delegate, diagnosing failed hiring attempts, defining the profile for the next hire, building a delegation plan, or when the user says "o que devo delegar", "perfil da próxima contratação", "por que falharam as contratações", "matriz de delegação", "92% rule" or similar.
---

# Delegation Audit

Flexible capability skill. Takes the founder's current task inventory and produces
a delegation plan — the strategic vs. delegable classification, a postmortem of
failed hiring attempts, and a first-hire profile grounded in the 92% rule and the
director-not-doer principle.

Anchored on: Diagnostico-2026-05 (5 failed hires, score Gestão 28.4/100, Cultura
25/100, extreme-centralisation pattern), Dan Martell Buyback Rate + 92% Rule + No-
How-To Delegation framework, Alex Hormozi 90%-autonomous-ops model, KB Area 07
(Organização & Equipas). All sourced from the wzrdxOS Obsidian vault.

Cross-references: `rh:hiring-pipeline` (structured selection process) and
`admin:buyback-audit` (time & energy audit and Buyback Rate calculation).

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Diagnostico-2026-05 — extreme centralisation pattern (score 28.4/100 Gestão),
  5 failed hires analysis (Diagnostico D21), delegation gap data.
- Dan Martell frameworks: Buyback Rate, 92% Rule, No-How-To Delegation, Standards-
  Not-Presence, Teach-Don't-Do identity shift.
- Prior delegation plans, task inventories, or time audits in the KB (`memos/`).
- Company profile (`wzrdx company`) — current team size, revenue, founder bottlenecks.
- If `admin:buyback-audit` has been run, retrieve its output — the time & energy
  audit is the input to this skill.

Record what exists. If a time audit does not exist, note it as a prerequisite.

### 2. Build the task inventory

If no prior time audit exists, instruct the founder to run `admin:buyback-audit`
first (2-week time tracking). If a prior audit exists, use it as the input.

From the task inventory, list every recurring task:

| Task | Frequency | Time/week (h) | Hourly value (est.) | Category (step 3) | Energy drain (1-5) |
|------|-----------|---------------|--------------------|--------------------|---------------------|
| ... | daily/weekly | ... | ... | ... | ... |

Aim for completeness. Missed tasks in the inventory = missed delegation opportunities.

### 3. Apply the Estratégico×Delegável matrix

Classify every task across two axes:

**Axis 1 — Strategic value** (what only the founder can do):
- High: sets direction, builds relationships, creates unique insight, requires the
  founder's credibility or relationships to execute.
- Low: execution, administration, repetition, tasks that have a clear right answer.

**Axis 2 — Delegability** (can someone else do this to 80%+ standard?):
- High: well-defined inputs/outputs, learnable, does not require founder authority.
- Low: ambiguous, requires tacit knowledge, deeply relational, unique to the founder.

**Matrix quadrants:**

| | High Strategic | Low Strategic |
|---|---|---|
| **High Delegable** | Transition zone — document + train; delegate within 90d | Delegate immediately — no reason to keep |
| **Low Delegable** | Keep — this is the founder's core work (the 8%) | Eliminate or systematize — highest priority |

**The 8% / 92% rule (Dan Martell):** only 8% of tasks are truly irreplaceable by
the founder. The 92% can be delegated to the right person with the right system.
The audit's job is to find the 8% and protect it ferociously.

### 4. Postmortem — the 5 failed hiring attempts

Reference the Diagnostico D21 data. For each failed hire attempt, capture:

| Hire | Role | When | Failure mode | Root cause | What was different |
|------|------|------|-------------|------------|-------------------|
| 1 | ... | ... | Left / fired / never productive | ... | ... |
| 2 | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |

Common failure modes from the Diagnostico (fill in from KB data):
- **Role mismatch:** hired a doer, needed a director (or vice versa).
- **No onboarding:** thrown in without a 60-day plan; abandoned.
- **No delegation system:** the founder kept doing the work anyway; hire became redundant.
- **Culture fit not assessed:** attitude misaligned with the way the company operates.
- **Wrong hire sequence:** hired for the wrong bottleneck; the real bottleneck remained.

Surface the pattern across all 5 attempts. The pattern is the lesson — not the
individual failure.

### 5. Define the first-hire profile (director-not-doer)

Based on the 92% classification and the postmortem, define the first autonomous hire:

**The director-not-doer principle (Dan Martell):**
- Do NOT hire someone to do tasks — hire someone to own a system.
- The first hire should own an entire function (e.g. Operações, Growth) — not execute
  individual tasks under the founder's direction.
- A doer requires constant management (which the founder has no capacity for).
- A director sets up their own systems and manages upward with results.

**First-hire profile template:**

```
# First Hire Profile — <role name>

**Function owned:** <e.g. Operações, Growth, Marketing>
**Trigger:** <what metric or condition justifies the hire now>

## Must-have (92% rule — non-negotiable)
- [ ] Can own the function without daily founder input
- [ ] Track record of building systems, not just executing tasks
- [ ] Attitude: [...]; skills can be trained — attitude cannot
- [ ] Can be fully autonomous by D180 (per Diagnostico roadmap)

## Nice-to-have
- ...

## Disqualifiers (lessons from the 5 failed hires)
- [ ] Requires constant direction → this is a doer, not a director
- [ ] No prior ownership of a business function
- [ ] [any pattern from the postmortem that was present in every failure]

## Onboarding plan
- D1-D30: Observe — shadow the founder, no solo decisions
- D31-D60: Do together — supervised execution with daily check-in
- D61-D90: Supervised — solo execution, weekly check-in
- D91-D180: Autonomous — owns the function; founder reviews results only

Cross-reference `rh:hiring-pipeline` for the structured selection process.
Cross-reference `wzrdx-rh-onboarding-60d` for the 60-day onboarding execution.
```

### 6. Build the delegation plan

Produce the plan in three priority buckets:

**Immediate (this week — 0 hires needed):**
- Tasks from the "Delegate immediately" quadrant that can go to existing tools,
  automation, or AI agents right now.
- For each: task, delegation target (agent/automation), SOP needed (yes/no), by when.

**Short-term (D30-D60 — with existing team or automation):**
- Tasks from the "Transition zone" that need documentation before delegation.
- For each: task, delegate, SOP to author, training needed, by when.

**Hire-dependent (D61-D90 — requires the first autonomous hire):**
- Tasks that can only be delegated once the first-hire profile is filled.
- For each: task, role it maps to, expected delegation date.

**The 8% protected list:**
- Tasks the founder keeps forever. No guilt, no pressure — these are the core.
- Document them explicitly. The list should have ≤ 5 items.

### 7. Cross-reference and handoffs

- If the hire profile is approved: hand off to `rh:hiring-pipeline` to open the
  structured selection process.
- If time tracking data is missing: hand off to `admin:buyback-audit` first.
- If automation is identified: hand off to `ops:automation-discovery` for ROI scoring
  and tool selection.

### 8. Ingest the delegation plan to the KB

```
kb_ingest("<delegation plan>", source="memos/YYYY-MM-DD-delegation-audit.md", target="global")
```

## Output contract

Every invocation delivers:
1. **Task inventory** — classified into the Estratégico×Delegável matrix.
2. **Postmortem** — 5 failed hires analyzed; root-cause pattern named.
3. **First-hire profile** — role, must-haves, disqualifiers, onboarding plan.
4. **Delegation plan** — immediate / short-term / hire-dependent buckets + the 8%
   protected list.
5. **Cross-reference handoffs** — what routes to rh:hiring-pipeline, admin:buyback-audit,
   and ops:automation-discovery.

## Red flags

- **Delegating without a SOP.** Handing off a task with no documentation is not
  delegation — it is abdication. The delegate will fail or return it within 2 weeks.
- **Hiring a doer when you need a director.** The postmortem pattern shows this is
  the most common failure mode. Check the profile before opening the process.
- **The 8% list has more than 8 items.** If the protected list is > 8% of the
  inventory, the founder is rationalizing keeping work. Challenge each item.
- **Skipping the KB-first step.** Prior delegation plans and the Diagnostico data
  already exist; the baseline is there — do not reset to zero.
- **No handoff to rh:hiring-pipeline.** A first-hire profile that is not connected
  to a structured selection process is a wish, not a plan.
- **Delegation plan with no dates.** Every delegation action must have a by-when.
  Open-ended delegation plans are not implemented.
