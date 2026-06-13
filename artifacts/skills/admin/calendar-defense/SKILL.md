---
name: 'admin:calendar-defense'
description: >-
  Audit the current calendar against the five defense rules, produce the Perfect
  Week template and Preloaded Year skeleton, and schedule the recurring weekly
  calendar review.
type: capability
department: admin
when-to-use: >-
  Defending or restructuring the CALENDAR: reverse booking, protecting deep-work
  mornings, meeting batching, Perfect Week / Preloaded Year, "a minha agenda
  está um caos", calendar audit. NOT for generic to-do/task planning for the day
  (task tools own that) — this skill is about the calendar architecture itself.
---

# Calendar Defense

Flexible capability skill. Audits the founder's current calendar against the five
non-negotiable defense rules, redesigns it, and produces a reusable Perfect Week
template plus a next-quarter Preloaded Year skeleton. Anchored on the Dan Martell
(Perfect Week, Preloaded Year, Reverse Booking), Alex Hormozi (Reverse Calendar
Booking, First-Four-Hours, Leverage Question), and Sabri Suby (11 Micro Habits,
pre-arrival sacred window, mode-switch threshold) frameworks from the WizardingCode
vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — working hours, timezone, recurring commitments.
- Prior Perfect Week templates or calendar audits already in the KB.
- Dan Martell — Perfect Week, Preloaded Year, Reverse Booking, got-a-minute
  containment.
- Alex Hormozi — Reverse Calendar Booking, First-Four-Hours, Leverage Question.
- Sabri Suby — 11 Micro Habits, pre-arrival sacred window, mode-switch threshold.
- Any fixed external constraints (client calls, team syncs, PT regulatory deadlines).

Note what already exists. Only author from scratch for genuine gaps.

### 2. Audit the current week

Request the current week's calendar from the user (screenshot, export, or verbal
description). Map every block and classify it:

| Block | Day | Time | Type (deep/shallow/meeting/admin) | Violates rule? |
|-------|-----|------|------------------------------------|----------------|
| ...   | ... | ...  | ...                                | Yes/No — which |

Check against the five rules (see §3). Note every violation explicitly.

### 3. Apply the five defense rules

These are non-negotiable. Every violation found in §2 must be corrected in §4.

**Rule 1 — Reverse Calendar Booking:**
Book from the end-of-day cutoff backwards, not from 09h00 forwards. Meetings and
shallow work fill from the cutoff hour backwards (e.g. 18h → 14h). Deep work
anchors the morning. Never start scheduling from the top of the day.

**Rule 2 — First-Four-Hours sacred:**
The first four working hours of every day belong to the founder's highest-leverage
deep work. No meetings, no Slack, no e-mail, no interruptions. This block is the
single highest-ROI hour in the day — protect it first, schedule everything else
around it.

**Rule 3 — Day batching (Mon/Fri shallow vs. Tue-Thu deep):**
- Monday and Friday: shallow work only — admin, reviews, got-a-minute catchups,
  planning, correspondence. These are the bookend days.
- Tuesday, Wednesday, Thursday: deep work only — creative, strategic, building,
  client-facing deep sessions. No shallow admin on these days.
- Exceptions require explicit justification; default is the pattern.

**Rule 4 — Got-a-minute containment:**
"Got a minute?" requests are accepted only on Mon/Fri, in designated open-office or
catchup slots. On Tue/Wed/Thu, all ad-hoc requests are deferred to the next Mon/Fri
slot. This is not rudeness — it is the protection that makes deep work possible.

**Rule 5 — 80% cap:**
No more than 80% of the workday is booked. The remaining 20% is unscheduled buffer:
for overruns, emergencies, and the Leverage Question moments (what is the one thing
I could do this week to make everything else irrelevant?). A full calendar is a
fragile calendar.

### 4. Produce the Perfect Week template

Design the restructured week following all five rules. Format:

```
Perfect Week Template — [Founder name] — [Date]

Monday (shallow)
  06:00-09:00  Pre-arrival ritual (Suby sacred window)
  09:00-13:00  First-Four-Hours — deep work block [PROTECTED]
  14:00-15:00  Weekly planning + OKR check
  15:00-17:00  Got-a-minute slot (catchups, short requests)
  17:00-18:00  Admin + correspondence

Tuesday / Wednesday / Thursday (deep)
  06:00-09:00  Pre-arrival ritual [PROTECTED]
  09:00-13:00  First-Four-Hours — deep work block [PROTECTED — no exceptions]
  14:00-16:00  Reverse-booked meetings (pushed from cutoff backwards)
  16:00-18:00  Deep work continuation or project block

Friday (shallow)
  09:00-13:00  First-Four-Hours — reviews, planning, strategic reading
  14:00-16:00  Weekly calendar review (30 min) + next-week prep
  16:00-17:00  Got-a-minute slot
  17:00        End-of-week cutoff
```

Adapt to the founder's actual constraints (client time zones, standing team syncs).
Every deviation from the template must be an explicit exception, not a new default.

### 5. Produce the Preloaded Year skeleton

For the next quarter (or the next 90 days), block the recurring commitments into the
calendar in advance:

- **Weekly:** calendar review (Fridays, 30 min), Got-a-minute slots (Mon/Fri),
  team syncs (whatever exists), Friday 17h COO operational review.
- **Monthly:** management review (CQO + COO), financial dashboard (CFO), 1:1s
  (CHRO cadence), retrospective.
- **Quarterly:** OKR review (CEO), planning session, QBR with key clients.
- **Annual:** budget and plan (CFO), strategy retreat (CEO).

The Preloaded Year principle: commitments that are not booked in advance are stolen
by urgent-but-not-important work. Book them now.

### 6. Schedule the recurring weekly calendar review

Set up a recurring 30-minute block every Friday afternoon:
- Purpose: audit the next week against the five rules before it starts.
- Trigger: the EA runs `admin:calendar-defense` in quick-audit mode (step 2 only)
  and reports any violations before they happen.
- Cross-reference: any new external commitments that arrived during the week are
  assessed against the rules before being accepted.

Note: if the `schedule` skill is available and the KB is cloud-reachable, set up an
automated Friday reminder via the `schedule` skill. Otherwise, add a manual recurring
block to the calendar.

### 7. Ingest the template and skeleton

Call `kb_ingest` with:
- `source` — `memos/calendar-defense-YYYY-MM-DD.md`.
- `target` — `global`.

Content: the Perfect Week template, the Preloaded Year skeleton for the quarter, and
the violations found in the current week with their corrections.

## Output contract

Every calendar-defense run delivers:
1. **Current-week violation report** — every rule broken, with the specific block
   that breaks it.
2. **Perfect Week template** — the restructured week, following all five rules.
3. **Preloaded Year skeleton** — next-quarter commitments blocked in advance.
4. **Recurring review schedule** — the Friday 30-min calendar audit block.
5. **Next action** — the single most important calendar change to make today.

## Red flags

- Auditing without asking for the current calendar — an audit without data is a
  guess; always request the actual blocks.
- Accepting "the client insists on Tuesday morning" as a reason to break Rule 2 —
  every exception has a cost; name it explicitly before accepting.
- Producing a Perfect Week that is 100% booked — a full template violates Rule 5
  before it starts; build in the 20% slack.
- Skipping the Preloaded Year — the weekly template is defensible only if recurring
  commitments are pre-booked; otherwise they crowd in and shatter the pattern.
- Not scheduling the weekly review — a calendar defense with no recurring review
  degrades within two weeks.
