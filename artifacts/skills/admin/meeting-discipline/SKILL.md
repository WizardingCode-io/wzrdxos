---
name: admin:meeting-discipline
description: Run meetings that respect the calendar-defense rules — agenda-or-decline,
  25/50-min default slots, decision-focused minutes (decisions/owners/deadlines only),
  follow-up routing within 24h, and got-a-minute containment; output is a meeting
  pack with agenda template, minutes template and follow-up checklist.
type: capability
department: admin
when-to-use: Preparing for a meeting, running a meeting, writing minutes, handling
  follow-ups, or auditing whether a meeting should exist at all. Triggered by "reunião",
  "agenda de reunião", "ata", "minutos", "follow-up de reunião", "got-a-minute",
  "meeting", "calendar invite", or any request to make meetings more effective.
---

# Meeting Discipline

Flexible capability skill. Takes a meeting request, a scheduled meeting, or a
retrospective of a past meeting and produces the full meeting pack — an agenda that
makes the meeting earnable, decision-focused minutes, and a routed follow-up checklist.
Enforces the calendar-defense rules at every step.

Note on KB coverage: the WizardingCode vault has thin explicit coverage on meeting
management methodology. This skill synthesises from the calendar-defense frameworks
already in the KB (Dan Martell — Perfect Week, got-a-minute containment; Alex Hormozi
— Reverse Calendar Booking, First-Four-Hours protection; Sabri Suby — mode-switch
threshold), supplemented with standard EA and operational practice. Where a specific
framework is referenced, it is named; where this skill synthesises, it is marked [EA
practice]. The KB will be enriched as real meeting learnings are ingested.

Connects to: `admin:calendar-defense` (the five rules that govern when and where
meetings can be scheduled); `ops:pop-builder` (if a recurring meeting needs a POP).

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — working hours, team size, recurring commitments.
- Perfect Week template (if produced by `admin:calendar-defense`) — which slots are
  available for meetings, which are protected.
- Any prior meeting agendas, minutes or follow-up formats already in the KB.
- Calendar-defense five rules — apply them before accepting or scheduling any meeting.
- Dan Martell got-a-minute containment — is this request a meeting or a got-a-minute?
- Any prior decisions that are relevant to this meeting's agenda.

Surface what already exists. Do not design a meeting structure from scratch if a POP
or template already covers it.

### 2. Agenda-or-decline gate

Every meeting must earn its place on the calendar. Apply the gate before scheduling:

**The three gate questions:**

1. **Does this meeting have a written agenda?**
   If no → do not accept or schedule the meeting. Send: "Happy to join — can you share
   the agenda and the decision or outcome you need from this meeting? I'll confirm once
   I have that."

2. **Is the outcome a decision or an action, or is it an update that could be an email?**
   - Decision or action needed → meeting is justified.
   - Status update / information share → decline and replace with an async update (doc,
     voice note, Loom, or email summary).
   - Brainstorm or creative session → justify the real-time need; if async brainstorm
     (doc + comments) would work, suggest it first.

3. **Is this meeting consistent with the calendar-defense rules?**
   - Does it land in the First-Four-Hours block? → Decline or push to afternoon.
   - Does it land on a deep-work day (Tue/Wed/Thu) for a shallow task? → Push to
     Mon/Fri.
   - Is it a got-a-minute on a deep day? → Defer to the next got-a-minute slot
     (Mon/Fri only per `admin:calendar-defense` Rule 4).
   - Would it exceed the 80% calendar cap? → Decline until space opens.

If the meeting passes all three gate questions → schedule and proceed to §3.
If it fails any gate → decline with a constructive alternative (async, later slot,
shorter format).

### 3. Got-a-minute containment

Got-a-minute requests ("have you got a minute?", "quick call?", "can we chat?") are
the single largest source of calendar fragmentation. Apply the containment protocol:

**Identify whether this is a got-a-minute:**
- Unscheduled, no agenda, "quick chat", "just want to talk through something".
- Estimated duration: "5-10 minutes" but no defined outcome.

**Containment response:**
"Happy to connect. I have a got-a-minute slot on [Mon/Fri at time]. Does that work?
If it's urgent and can't wait, send me a voice note or a 2-paragraph written summary
and I'll respond by [time]."

**Rules:**
- Got-a-minute slots exist only on Mon/Fri (calendar-defense Rule 4).
- On Tue/Wed/Thu, got-a-minutes are deferred — no exceptions unless the founder
  explicitly overrides for a genuine emergency.
- A got-a-minute that requires a decision becomes a scheduled meeting with an agenda
  (gate §2 applies).
- Log every contained got-a-minute in the follow-up tracker (§6) — recurring topics
  become agenda items for the next scheduled meeting.

### 4. Design the agenda

A meeting without a written agenda is an improvised conversation. Every agenda must:

**Agenda template:**

```
Meeting Agenda — [Title] — [YYYY-MM-DD HH:MM]
Duration: [25 min / 50 min]
Participants: [Names and roles]
Owner: [Who is running this meeting]
Objective: [The single decision or outcome needed from this meeting — one sentence]

---

Pre-read (complete before the meeting — not in the meeting)
- [Document 1: link or description]
- [Document 2]

---

Agenda items

| # | Item | Time | Lead | Type |
|---|------|------|------|------|
| 1 | [Topic] | [5 min] | [Name] | Decision / Update / Discussion |
| 2 | [Topic] | [10 min] | [Name] | Decision |
| 3 | Decisions and next steps | [5 min] | [Owner] | Summary |

---

Parking lot (items that surface during the meeting but are out of scope)
[Empty at start — filled during the meeting]
```

**Agenda rules [EA practice]:**
- Default slot: 25 minutes (shallow decisions, operational) or 50 minutes (complex
  decisions, strategic). Never 30 or 60 — the 5-minute buffer matters.
- Maximum 3 agenda items per 25-minute meeting; 5 items per 50-minute meeting.
- The last 5 minutes of every meeting are reserved for decisions and next steps.
  If the discussion runs long, cut an agenda item — never cut the decision summary.
- Items typed as "Update" are pre-meeting reads. No time for them in the meeting.
- The agenda is sent to all participants at least 24 hours before the meeting.
  If 24 hours' notice is not possible, send an async alternative instead.

Send the agenda with: "Please confirm you've read the pre-reads before the meeting.
If you see anything missing from the agenda, let me know by [time] so I can update it."

### 5. Run the meeting — decision-focused minutes

During the meeting, the EA (or the meeting owner) captures decisions in real time.
The minutes are not a transcript — they are a decision record.

**Minutes template:**

```
Meeting Minutes — [Title] — [YYYY-MM-DD HH:MM]
Duration: [actual duration]
Participants: [Names present]
Facilitated by: [Name]

---

Decisions made

| # | Decision | Owner | Deadline |
|---|----------|-------|----------|
| 1 | [Specific decision — what was agreed, not the discussion] | [Name] | [YYYY-MM-DD] |
| 2 | [Decision] | [Name] | [YYYY-MM-DD] |

---

Actions

| # | Action | Owner | Deadline | Dependencies |
|---|--------|-------|----------|--------------|
| 1 | [Specific action — verb-led: "Draft the proposal", "Send the contract"] | [Name] | [YYYY-MM-DD] | [If any] |

---

Deferred / parking lot

| Item | Routed to | By when |
|------|-----------|---------|
| [Topic that surfaced but was out of scope] | [Person / next meeting] | [YYYY-MM-DD] |

---

Next meeting (if applicable)
Date: [YYYY-MM-DD]   Time: [HH:MM]   Owner: [Name]   Objective: [one sentence]
```

**Minutes rules:**
- Write decisions in declarative sentences: "We will use HubSpot Free as the CRM."
  Not "discussed HubSpot options."
- Every decision has an owner (one person, not "the team") and a deadline.
- Every action has an owner and a deadline. "Someone will look into it" is not an
  action.
- The parking lot is not a graveyard — every parked item has a routing (who takes it,
  by when).
- Minutes are distributed within 1 hour of the meeting ending (or by end of business
  day at latest). Delayed minutes decay.

### 6. Follow-up routing within 24 hours

The meeting is not complete until the follow-up is done. Follow-up within 24 hours is
the discipline that makes meetings produce outcomes instead of conversations.

**Follow-up checklist:**

```
Meeting Follow-up Checklist — [Title] — [YYYY-MM-DD]

Within 1 hour
[ ] Minutes distributed to all participants (template §5).
[ ] Any decision requiring CEO / CFO / department head approval flagged and routed.
[ ] Any action with a dependency unblocked or the dependency surfaced to the owner.

Within 24 hours
[ ] Every action owner has acknowledged their action and deadline (reply to the minutes
    email or CRM task created if HubSpot is live).
[ ] Parking-lot items routed: added to the next meeting agenda or converted to an async
    follow-up.
[ ] Got-a-minutes that were deferred during the week: reviewed and handled (moved to
    next slot or resolved async).
[ ] Next meeting (if applicable): calendar invite sent with the pre-drafted agenda.

By the weekly COO review (Friday 17h)
[ ] All decisions from this week's meetings logged in the CRM or KB.
[ ] Any overdue actions from prior meetings flagged to owners.
[ ] Meeting load for the next week checked against the Perfect Week template — any
    violations corrected before the week starts.
```

**Routing rules [EA practice]:**
- CEO gate items (significant decisions, budget commitments) → route via the
  `ceo:balanced-decision` skill.
- Cross-department actions → copy the relevant department head on the minutes.
- Recurring unresolved topics → flag to the COO for SOP or POP creation
  (`ops:pop-builder`).

### 7. Ingest meeting learnings to KB

After each significant meeting (not every standup), `kb_ingest`:
- Title: `Meeting Minutes — [Topic] — [YYYY-MM-DD]`.
- Tags: `meeting`, `minutes`, `decisions`, `<department>`, `<topic-slug>`.
- Include: the decisions table, the actions table, the parking lot. Not the discussion.

For recurring meeting formats (weekly pipeline review, monthly management review),
ingest the template once; update with outcomes weekly.

## Output contract

Every meeting discipline session produces:
1. **Agenda-or-decline decision** — the gate result with reasoning (§2).
2. **Got-a-minute containment response** (if applicable) — the exact response and
   the scheduled slot (§3).
3. **Meeting agenda** — complete template with objective, pre-reads, items, and
   time allocations (§4).
4. **Minutes template** — decision-focused, pre-populated for the specific meeting
   context (§5).
5. **Follow-up checklist** — 1-hour, 24-hour, and weekly checkpoints (§6).
6. **Next action** — single most important follow-up item. Owner, deadline.

## Red flags

- Scheduling a meeting without a written agenda — a meeting without an agenda defaults
  to a conversation; conversations do not produce commitments.
- Accepting a got-a-minute on a deep-work day — one interruption on a deep-work day
  costs more than the meeting itself in cognitive recovery; the containment rule exists
  precisely for this.
- Writing minutes as a transcript — a transcript is not a decision record; it is
  homework nobody reads. Decisions and actions only.
- Distributing minutes more than 24 hours after the meeting — momentum is a function
  of time; a minutes email on Thursday for a Tuesday meeting arrives in a different
  context and produces less action.
- Actions without owners or deadlines — "the team will do X" is never done; one owner,
  one deadline, every time.
- Parking-lot items with no routing — a parking lot that is never emptied becomes a
  graveyard of good ideas; every parked item must have a destination.
- Running meetings that could have been an async update — protect the calendar; every
  unnecessary meeting costs more than its duration in opportunity cost and fragmentation.
