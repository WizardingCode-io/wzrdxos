---
name: ops:discovery-cadence
description: Set up a Teresa Torres Continuous Discovery cadence — weekly customer touchpoints, an Opportunity Solution Tree, assumption tests, and a discovery ritual that keeps the product rooted in real customer outcomes.
type: capability
department: ops
when-to-use: Setting up product discovery habits, building an Opportunity Solution Tree, designing customer interview cadence, running assumption tests, or when the user says "continuous discovery", "oportunidades de produto", "entrevistar clientes", "OST", "árvore de oportunidades", "discovery semanal" or similar.
---

# Discovery Cadence

Flexible capability skill. Takes a product context and produces a discovery cadence
setup — weekly touchpoints designed, an Opportunity Solution Tree (OST) skeleton
built, and assumption tests designed. Adapts from a full cadence setup to a single
OST session or interview planning.

Anchored on: Teresa Torres Continuous Discovery Habits framework, Marty Cagan
product management principles, KB Area 09 (Project Management). PM/PO role lives
in Operações — the discovery cadence is the PM/PO's operational anchor. All sourced
from the wzrdxOS Obsidian vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Teresa Torres Continuous Discovery Habits — weekly interview cadence, OST structure,
  assumption testing methodology.
- Marty Cagan product principles from the KB (empowered teams, outcome vs. output).
- KB Area 09 (Project Management) — any prior discovery artifacts.
- Company profile (`wzrdx company`) — product(s), customer segments, ICP, current
  team structure (PM/PO identified?).
- Prior customer interview notes, OSTs, or discovery memos in the KB (`memos/`).

Record what exists. Build on prior discovery artifacts; do not start from zero if
interviews or OST work has already been done.

### 2. Define the discovery scope

Before setting up the cadence, nail down:

| Question | Answer needed |
|----------|---------------|
| What product(s) are in scope? | Bounds the OST. |
| Who are the customers? (ICP) | Determines who to interview. |
| What is the desired outcome? | The root of the OST (outcome, not output). |
| Is there a PM/PO owner? | Who runs the cadence week to week. |
| How many customers are accessible? | Sets the realistic interview volume. |
| What is the current discovery state? | Are we starting from zero or building on prior work? |

The desired outcome must be a business/customer outcome — not a feature. Examples:
- Good: "customers renew and expand"; "clients achieve X result within 30 days"
- Bad: "ship feature Y"; "build integration Z"

### 3. Build the Opportunity Solution Tree (OST)

The OST is the visual backbone of discovery. Structure:

```
Root — Desired Outcome
│
├── Opportunity 1 (customer pain / need / desire)
│   ├── Opportunity 1.1 (more specific)
│   │   ├── Solution A (experiment)
│   │   └── Solution B (experiment)
│   └── Opportunity 1.2
│       └── Solution C
│
├── Opportunity 2
│   ├── Opportunity 2.1
│   └── Opportunity 2.2
│
└── Opportunity 3
    └── ...
```

**OST rules:**
- The root is always a business outcome (not a feature or a solution).
- Opportunities are customer needs, pains, or desires — discovered through interviews,
  not invented in meetings. They are always stated from the customer's perspective.
- Solutions are experiments proposed to address an opportunity. They are only added
  after the opportunity is validated through interviews.
- Assumptions are the beliefs embedded in each solution — they must be tested before
  building.

**Starter OST:** populate the first 2-3 opportunities from prior knowledge (KB, sales
notes, support logs). These are hypotheses — label them as unvalidated. The cadence
will validate or replace them.

### 4. Design the weekly interview cadence

The Torres method: at least one customer interview per week, every week. No
exceptions. One interview per week is the minimum viable discovery cadence.

**Interview structure (30-50 min):**

1. **Warm-up (5 min):** build rapport, confirm context ("You're a [role], using us
   for [use case]?"), set expectations ("I'm going to ask about your experience; there
   are no right or wrong answers").

2. **Story elicitation (20-30 min):** ask for specific recent stories — not opinions
   or hypotheticals.
   - "Tell me about the last time you [did X]."
   - "Walk me through what happened — what did you do first?"
   - "What was frustrating about that?"
   - "What did you do instead?"
   Never ask "Would you use feature Y?" — hypotheticals produce unreliable answers.

3. **Opportunity mapping (10 min):** during/after the interview, map what you heard
   to the OST. Which opportunities were mentioned? Were any new ones surfaced?

4. **Wrap-up (5 min):** "Is there anything else important for me to understand about
   how you do X?" Thank them. Offer to share findings.

**Interview recruitment:**
- 1 interview/week requires a pipeline of ~4 willing participants.
- Sources: existing clients, churned clients (most valuable), prospects who said no,
  power users, support tickets.
- Recruitment message: "I'd love 30 minutes to learn about your experience with X.
  No product demo — just questions." Send to 4 people to get 1 acceptance.

**After each interview:**
- Write a brief summary: date, participant role/segment, top 3 observations, OST
  opportunities updated.
- Ingest to KB: `kb_ingest` with source `memos/interviews/YYYY-MM-DD-<segment>.md`.

### 5. Design assumption tests

Every solution on the OST is built on assumptions. Before building, test the most
critical ones.

**Identify the critical assumption:**
The most critical assumption is the one that, if false, makes the solution fail.
Ask: "If we were wrong about X, would we still build this solution?"

**Assumption test types (ascending commitment/cost):**

| Test type | When to use | How |
|-----------|-------------|-----|
| Fake door / smoke test | Is there demand? | Landing page, CTA with no backend; measure clicks |
| Concierge | Does the solution solve the problem? | Do it manually for 2-3 customers; no code |
| Prototype test | Is the design right? | Clickable mockup; observe customer using it |
| Spike / MVP | Does the implementation work? | Minimal working version; 1-3 customers |

**Assumption test structure:**
```
Assumption: We believe [X].
Test: We will [action] with [N] customers.
Signal: If [measurable outcome], the assumption is supported.
Threshold: We need ≥ [N%] positive signal to proceed.
Cost: [time / money to run this test].
Deadline: [date by which we will have results].
```

Never skip from "we think this is needed" to "let's build it." Always have a test
result before committing engineering resources.

### 6. Build the weekly discovery ritual

**Weekly discovery ritual (60 min, recommended mid-week):**

1. **Interview (30-50 min):** conduct or review the week's interview (PM/PO + optional
   stakeholder as silent observer).

2. **OST update (10 min):** review the OST against what was heard. Add, merge, or
   retire opportunities. Update confidence levels.

3. **Assumption test review (10 min):** check the status of running tests. Any
   completed? Pivot, persevere, or kill the associated solution.

4. **Next week plan (5 min):** confirm the next interview is scheduled. Select the
   next assumption to test if a slot opens.

**Ritual cadence:**
- Weekly: interview + OST update + assumption test review.
- Monthly: OST health check — are we stuck in the same opportunities? Are any
  opportunities consistently unvalidated? Rotate focus.
- Quarterly: OST reset if the desired outcome changes (ties to OKR cadence — hand
  off to `ops:roadmap-diagnose`).

**PM/PO role in Operações:**
The PM/PO runs the discovery cadence and owns the OST. The COO orchestrates how
discovery feeds into the sprint/backlog cycle. The CEO gate applies when discovery
surfaces a strategic opportunity (new market, major pivot, significant resource need).

### 7. Ingest discovery artifacts to the KB

After setup:
```
kb_ingest("<cadence design + OST skeleton>", source="memos/YYYY-MM-DD-discovery-cadence-setup.md", target="global")
```

After each interview:
```
kb_ingest("<interview summary>", source="memos/interviews/YYYY-MM-DD-<segment>.md", target="global")
```

## Output contract

Every invocation delivers:
1. **OST skeleton** — desired outcome + 3-5 starter opportunities (labeled as
   hypotheses) + placeholder solutions awaiting validation.
2. **Interview cadence design** — recruitment approach, interview guide, summary
   template.
3. **Assumption test backlog** — top 3 critical assumptions per active solution, with
   test design and threshold.
4. **Weekly ritual schedule** — when, who, how long, what is reviewed.
5. **KB ingest confirmation** — cadence design stored.

## Red flags

- **Discovery by committee.** The PM/PO runs the interview, not a group. Observers
  are silent. Interviews by committee produce biased, unfocused results.
- **Asking hypothetical questions.** "Would you use X?" is not a discovery question.
  Ask for stories about what customers actually did. Hypotheticals produce false
  positives.
- **OST with solutions before opportunities are validated.** Solutions on an unvalidated
  opportunity are features invented in meetings — the classic trap. Validate the
  opportunity first.
- **Missing the weekly interview.** One skipped week becomes two; the cadence breaks.
  The whole point of "continuous" is that it never stops. Protect the slot.
- **Discovery disconnected from the backlog.** If the OST never influences which
  stories are prioritized, discovery is theatre. Connect the OST to the sprint cycle
  via the COO orchestration.
- **Skipping the KB-first step.** Prior interview notes and OST work already exist;
  build on them, do not restart.
