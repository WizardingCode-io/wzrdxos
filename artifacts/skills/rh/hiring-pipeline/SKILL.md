---
name: rh:hiring-pipeline
description: Full hiring pipeline — KB-first postmortem of prior failures, role definition via Interview-to-Learn (8+ candidates), structured selection (screening, case study, final interview), First-Week Leadership Diagnostic for leadership roles, offer via Sams 5 Rules; KB ingest at close.
type: capability
department: rh
when-to-use: Opening a role, starting a hiring process, screening candidates, or when the user says "vamos contratar", "abrir vaga", "procurar candidatos", "recrutar", "hiring" or similar.
---

# Hiring Pipeline

Flexible capability skill. Runs the full hiring pipeline from the first question
("do we actually need this role?") through to offer acceptance and KB ingest.
Calibrated against the postmortem of 5 failed hires (Diagnostico D21) and the
Diagnostico D61-D90 hire target.

Anchored on David FilterBuy Interview-to-Learn, Alex Hormozi First-Week Leadership
Diagnostic, and Sams 5 Rules (hire slow, fire fast).

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — current team, open needs, culture baseline.
- Diagnostico-2026-05: the 5 failed hires postmortem (Diagnostico D21) — what went
  wrong each time, root patterns (attitude fit? onboarding? role clarity? founder
  readiness?). Read the postmortem before defining any new role.
- Prior JDs, hiring briefs or criteria documents already in the KB.
- Relevant frameworks: Interview-to-Learn, First-Week Leadership Diagnostic, Sams 5
  Rules, Collect People Doctrine, Talent Levels Ladder.
- Culture baseline: mission/vision/values (if documented). If not documented, note
  that culture artefacts must be produced before writing hiring criteria.

Surface the postmortem patterns explicitly. Every new hire decision must answer: "how
does this hire avoid the patterns that caused the previous 5 to fail?"

### 2. Role definition via Interview-to-Learn

Before writing the JD, run 8+ candidate interviews to learn what the role really is.

**Why:** the founder's mental model of what a role needs is systematically different
from what the role actually requires in the market. Interview-to-Learn corrects this
(David FilterBuy method).

**How to run the 8+ interviews:**

1. Identify 8+ people currently doing the target role (at companies, in networks,
   via LinkedIn) — not candidates yet, but practitioners.
2. Run a 30-minute structured discovery interview with each:
   - "What does a great week look like in this role?"
   - "What separates a top performer from an average one?"
   - "What's the hardest part of this role that's never in the JD?"
   - "What skills did you wish you had on day one?"
   - "What attitude / mindset makes someone fail in this role?"
3. Synthesise across all 8+ interviews:
   - Real must-have skills vs. nice-to-haves.
   - Attitude/mindset signals that predict success.
   - Red flags that predict failure.
   - Realistic day-1 expectations (correct the founder's assumptions).

Output of this step: a **Role Reality Brief** — not a JD yet.

### 3. JD + criteria (hire for attitude/values)

From the Role Reality Brief, produce:

**Job Description:**
- Title, team, reporting line, mission of the role (1 sentence).
- What success looks like at 30/60/90 days — specific, measurable.
- Must-have attitude/values signals (from the interview synthesis).
- Must-have skills (minimum viable competency, not inflated).
- Nice-to-have skills (clearly labelled as optional).
- What this role is NOT (sets realistic expectations, reduces misfit applications).

**Selection criteria (scored rubric):**
| Criterion | Weight | How assessed |
|-----------|--------|--------------|
| Attitude signal 1 | high | Behavioural interview question |
| Attitude signal 2 | high | Reference check |
| Skill 1 | medium | Case study |
| Skill 2 | medium | Portfolio / work sample |
| Culture fit | high | Values alignment questions |

Weight attitude and values criteria above skills. A skill gap can be trained.
An attitude misfit cannot.

### 4. Structured selection

Run every candidate through the same pipeline, in order:

**Stage 1 — Application screening:**
- CV + cover letter (or async video intro for junior roles).
- Screen for: minimum attitude signals (do they explain why they want this specific
  role?), minimum viable skills, no automatic disqualifiers (per postmortem red flags).
- Target: advance 20-30% of applicants to the next stage.

**Stage 2 — Discovery call (30 min):**
- Validate the basics: availability, compensation range, motivation.
- One open-ended behavioural question per key attitude criterion.
- Decide yes/no within 24h. No dragging candidates along.

**Stage 3 — Case study:**
- A real, paid mini-project (≤4h) that mirrors actual day-1 work.
- Assess: quality of thinking, communication, attitude under uncertainty, initiative.
- Debrief the case study live (30 min) — observe how they explain their reasoning
  and handle "what would you do differently?"

**Stage 4 — Final interview (structured, panel if possible):**
- Behavioural questions mapped to the scored rubric (all criteria).
- Values alignment questions (from the culture baseline or the postmortem red flags).
- "What is one thing you wish you'd asked us before accepting?" — observe curiosity.
- Reference checks: 2 references minimum, at least 1 from a direct manager.

Score every candidate on the rubric after each stage. Do not advance candidates who
score below threshold on attitude criteria, even if their skills are strong.

### 5. First-Week Leadership Diagnostic (Hormozi)

For leadership roles or roles that require significant autonomy from day one:

The first week is a structured diagnostic — not a training week.

**What to observe:**
- **Initiative:** do they identify what needs doing before being told?
- **Judgment under ambiguity:** when there is no clear instruction, what do they do?
- **Cultural fit in practice:** do they behave consistently with the stated values
  when no one is watching, or only when observed?
- **Communication:** do they surface blockers early and clearly, or hide them?
- **Learning speed:** can they ask the right questions and synthesise quickly?

**How to run it:**
1. Give them a real, scoped problem on day 2 — not busywork.
2. Check in at the end of days 2, 3, and 5 with structured questions (not
   performance feedback yet — observation only).
3. At end of week 1, produce the Leadership Diagnostic Summary: initiative (1-5),
   judgment (1-5), cultural fit (1-5), communication (1-5), learning speed (1-5).
4. If any dimension scores ≤2, flag immediately and decide: coaching plan with clear
   milestones, or exit before probation ends.

### 6. Offer + Sams 5 Rules

**Sams 5 Rules (hire slow, fire fast):**
1. **Hire slow:** never rush to close because a role is urgent. Urgency bias is the
   #1 cause of bad hires. Extend the pipeline, add a candidate, rerun the case study
   if in doubt.
2. **Values above skills:** if the candidate has the right attitude and 70% of the
   skills, hire and train. If they have 100% of the skills but values misalignment,
   do not hire.
3. **Reference-check seriously:** call the references, do not just email. Ask "would
   you hire them again?" and listen to the pause before the answer.
4. **Probation is not a formality:** set explicit 30-day and 60-day milestones at
   offer stage. If milestones are not met, act — do not wait for the 90-day review.
5. **Fire fast when values break:** a single values violation that goes unaddressed
   destroys culture. Act within 48h of a confirmed values breach — CEO gate required.

**Offer structure:**
- Compensation (base + variable if applicable), aligned to the PT benchmark from
  `deep-research`.
- 30/60/90-day success milestones (written, agreed before signing).
- Probation period and checkpoints.
- What autonomy looks like at the end of onboarding (the autonomy target).

### 7. Ingest decisions to KB

After each hire (successful or not), ingest to the KB via `kb_ingest`:
- Title: `Hiring — [Role] — [Company] — [YYYY-MM]`.
- Tags: `hiring`, `recrutamento`, `<role>`, `<company-slug>`, `postmortem` (if failed).
- Include: the Role Reality Brief, the scored rubric results per candidate, the offer
  terms, the First-Week Leadership Diagnostic if run, and the key lesson learned.
- For failed hires: document the root cause explicitly and link to the Diagnostico
  D21 postmortem to build the pattern library.

## Output contract

The deliverable for each open role contains:
1. **Postmortem check** — what patterns from the 5 failed hires apply here, and how
   this hire avoids them.
2. **Role Reality Brief** — synthesised from 8+ Interview-to-Learn interviews.
3. **JD + scored rubric** — attitude-weighted criteria, measurable success targets.
4. **Pipeline tracker** — candidate list, stage, score, next action for each.
5. **Offer package** — compensation, 30/60/90 milestones, autonomy target.
6. **Next action** — single most important hiring action right now, owner, deadline.

## Red flags

- Opening a role without running 8+ Interview-to-Learn interviews — the JD will be
  wrong and the wrong candidates will apply.
- Advancing a candidate who scores low on attitude criteria because their skills
  are strong — the postmortem shows this pattern fails every time.
- Rushing to close because the role is urgent — urgency is not a hiring criterion.
- Skipping the reference check or treating it as a formality — references are the
  cheapest due diligence available.
- Skipping the case study — a candidate who cannot do the work in a low-stakes
  context will not do it in a high-stakes one.
- Not ingesting the outcome to the KB — the hiring history is the pattern library
  that prevents the next failure.
