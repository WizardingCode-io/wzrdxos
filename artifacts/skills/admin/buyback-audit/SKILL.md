---
name: admin:buyback-audit
description: Time and energy audit — classify every recurring task on the energy × $/h matrix, compute the Buyback Rate, apply the 92% Rule, and produce a delegation plan with owner and deadline.
type: capability
department: admin
when-to-use: Time audit, delegation planning, "o que devo delegar", "Buyback Rate", "92% Rule", "estou a fazer demasiado", "quero libertar tempo", founder-transition kickoff, or any request to decide what the founder should stop doing.
---

# Buyback Audit

Flexible capability skill. Takes the founder's calendar, a time-tracking export, or
a reconstructed task list and produces a classified delegation plan grounded in the
Dan Martell Buy Back Your Time framework — anchored on the WizardingCode Obsidian
vault (Personas — Dan Martell: Buyback Rate, 92% Rule, Perfect Week, Preloaded Year,
Replacement Ladder; CHRO delegation-coach skill).

Connects to: COO `delegation-matrix`, CHRO `founder-transition` — cross-reference
both before issuing the delegation plan.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — role, revenue, annual pay or revenue proxy.
- Prior buyback audit results or delegation plans already in the KB.
- Dan Martell persona — Buyback Rate formula, 92% Rule, Perfect Week, Replacement
  Ladder, No-How-To Delegation.
- COO delegation-matrix and CHRO founder-transition — what has already been
  decided/documented.
- Diagnostico-2026-05 — centralisation score, root constraint, first-hire profile.

Note what already exists. Only author from scratch for genuine gaps.

### 2. Build the 2-week time log

Request the input from the user in one of these forms (in priority order):
1. Calendar export (Google Calendar .ics, or a week-by-week written summary).
2. Time-tracking export (Toggl, Clockify, or similar).
3. Reconstructed log: ask the user to recall the last 2 weeks' recurring activities
   (what did you do Monday morning? Tuesday? etc.), then capture the list.

For each task/activity record:
- **Name** — brief description.
- **Time/week** — average hours per week.
- **Energy** — drains (−1), neutral (0), energises (+1).
- **Hourly equivalent** — if you hired someone to do this, what would they charge
  per hour (€/h)?

### 3. Compute the Buyback Rate

```
Buyback Rate = annual pay (or annual revenue proxy) ÷ 2000 ÷ 4
```

Example: €80,000/year → €80,000 ÷ 2000 ÷ 4 = **€10/h**.

This is the threshold: anything the founder does that a competent person could do
for ≤ the Buyback Rate is a delegation candidate. The goal is to reach 92% of time
on activities above this threshold.

### 4. Classify all tasks

Build the classification table:

| Task | Time/week | Energy | Market rate (€/h) | Below rate? | Delegate? |
|------|-----------|--------|-------------------|-------------|-----------|
| ...  | ...       | ...    | ...               | Yes/No      | Yes/No    |

Flag every row where market rate ≤ Buyback Rate as a **delegation candidate**.
Flag rows that drain energy AND are below the rate as **urgent delegation**.

### 5. Apply the 92% Rule

From the full task list, isolate the **8% only the founder can do** — tasks where:
- No one else in the world could substitute (not just "no one I know now").
- The founder's personal presence or unique judgment is the irreplaceable input.
- The task directly generates the company's asymmetric advantage.

Everything else is a delegation candidate, regardless of how comfortable the founder
feels doing it.

Document the 8% list explicitly. This is the founder's protected zone.

### 6. Produce the delegation plan

For each delegation candidate, define:

| Task | Delegate to (who/agent) | By when | Handover step | POP needed? |
|------|-------------------------|---------|---------------|-------------|
| ...  | ...                     | ...     | ...           | Yes/No      |

Rules for assignment:
- Cross-reference the **COO delegation-matrix** — if a process is already documented
  and assigned, use that assignment; do not duplicate.
- Cross-reference the **CHRO founder-transition roadmap** — if a hire is planned
  (D61-D90), reserve those tasks for the incoming person.
- Agent-first for repeatable, low-judgment tasks (EA for admin, agents for research,
  drafting, data tasks).
- Human hire for relationship-intensive or high-judgment recurring tasks.

Handover step = the minimum viable POP or briefing that makes the delegation stick.
Without a handover step, the task bounces back. Reference the COO `sop-create` skill
if a full POP is needed.

### 7. Ingest the audit memo

Call `kb_ingest` with:
- `source` — `memos/buyback-audit-YYYY-MM-DD.md`.
- `target` — `global`.

Content: the task classification table, the Buyback Rate computed, the 8% list, the
delegation plan with owners and deadlines.

## Output contract

Every buyback audit delivers:
1. **Buyback Rate** — the computed threshold (€/h) with the formula shown.
2. **Task classification table** — all tasks with energy, market rate, and
   delegation flag.
3. **8% Only-Founder List** — explicit, short, non-negotiable.
4. **Delegation plan** — task → who → by when → handover step.
5. **Next action** — the single most impactful delegation to start this week.

## Red flags

- Classifying tasks without a market-rate estimate — guess if needed, but never skip;
  the threshold is the whole point of the exercise.
- Listing everything as "only the founder can do it" — the 92% Rule is a forcing
  function; challenge every claim in the 8% list.
- Producing a delegation plan without handover steps — delegation without a POP
  always bounces back.
- Skipping the COO delegation-matrix cross-reference — duplicate assignment is waste.
- Not ingesting the audit memo — the buyback audit compounds only when it is
  documented and retrievable.
