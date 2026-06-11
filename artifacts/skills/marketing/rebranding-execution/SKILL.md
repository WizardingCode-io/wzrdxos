---
name: marketing:rebranding-execution
description: Drive the Rebranding-2026-06 roadmap — KB-first from the vault (9 docs,
  decisions D1-D7), framework-guided decisions (Hormozi, StoryBrand, Primal Branding,
  Status Engineering), CEO balanced-decision gate for significant calls, and KB ingest
  of every outcome.
type: capability
department: marketing
when-to-use: Working on the rebrand — naming, positioning, brand architecture, verbal
  or visual identity, or the rebrand roadmap. Triggered by "rebranding", "naming",
  "brand architecture", "Casa Única", "verbal identity", "posicionamento", "marca",
  decisions D1-D7, or any reference to the Rebranding-2026-06 vault.
---

# Rebranding Execution

Flexible capability skill. Drives the Rebranding-2026-06 initiative from the current
open decision through to a documented decision memo. Calibrated against the 9-doc
vault in WizardingCode/Strategy/Rebranding-2026-06 and the D1-D7 decision backlog.

## Steps

### 1. KB-first — read the vault before generating anything

`kb_search` and `kb_ask` for the Rebranding-2026-06 vault. Locate and absorb:

- **README + decision log:** which of D1-D7 are pending, which are resolved, what
  constraints are already locked in.
- **Audit doc:** current brand reality, weaknesses, market positioning gaps.
- **Strategic recommendation:** the chosen direction and rationale.
- **Naming analysis (12 candidates):** the shortlist, scoring criteria, eliminated
  options, and why.
- **Positioning v2:** the draft positioning statement and the job-to-be-done framing.
- **Brand architecture — Casa Única:** Studio / Labs / Cloud / Pro sub-brands; the
  hierarchy and naming logic.
- **Verbal identity PT/EN:** tone of voice, vocabulary list, banned words, the brand
  voice in both languages.
- **Channel strategy:** where the brand speaks, to whom, in what format.
- **90-day roadmap:** what is scheduled, what is blocked, what is the current step.
- **4 visual directions:** the creative territories (do not choose direction without
  the CEO balanced-decision gate).

Surface what is decided vs. pending before doing any work. Never re-open a closed
decision without noting you are doing so and flagging it for CEO review.

### 2. Identify the current open decision or step

From the vault state, identify:
- Which of D1-D7 is the next pending decision.
- What input is missing to resolve it (research, stakeholder input, framework
  application, competitive reference).
- What the 90-day roadmap says should happen now.

State the current position explicitly: "We are at step X. Decision D[N] is open.
The input needed is Y."

### 3. Apply the decision frameworks

For the open decision, apply the relevant frameworks:

**Naming (D1 — if open):**
- Hormozi #1-At-What: what is the single thing wzrdx is definitively #1 at? The name
  must telegraph this. Run each of the 12 candidates against this test.
- Primal Branding (7 assembly points): creation story, creed, icons, rituals, pagans,
  sacred words, leader — does the candidate name anchor a full brand identity system?
- Memorability and domain availability check. Note PT/EN pronunciation and cultural
  connotations.
- Output: a scored comparison table + a recommendation with rationale.

**Positioning (D2/D3 — if open):**
- StoryBrand SB7: customer is the hero; wzrdx is the guide. Draft the one-liner:
  "[Customer] who want [goal] work with wzrdx to [achieve result] without [friction]."
- Status Engineering (Sabri Suby): is the positioning selling status ("WizardingCode
  clients are the AI-forward companies in Portugal") or just features? Reframe if needed.
- NUEPH: Novo, Único, Exclusivo, Para quem, Hostil. Score the positioning on each axis.
- Output: a revised positioning statement + a one-page brief.

**Brand architecture (D4 — if open):**
- Casa Única analysis: does Studio / Labs / Cloud / Pro create clarity or confusion?
  Map the customer journey across sub-brands. Identify overlap and cannibalisation risk.
- Primal Branding sacred words: does each sub-brand have a distinct vocabulary set?
- Output: a brand architecture map with rationale and a risk assessment.

**Verbal identity (D5 — if open):**
- Draft or refine the tone of voice in PT and EN. Two versions: formal (board/investor
  materials) and brand (content, social, website copy).
- Apply the StoryBrand clarity test: can a 10-year-old understand what wzrdx does from
  the homepage copy?
- Output: a verbal identity document — tone, vocabulary, PT/EN examples, banned words.

**Visual direction (D6 — if open):**
- Summarise the 4 visual territories from the vault.
- Apply the Status Engineering lens: which direction signals premium and authority in
  the PT/EU market for AI-first companies?
- **Do not select a direction** — this is a CEO balanced-decision gate item. Prepare
  the brief; route to the CEO for deliberation.

**Roadmap update (D7 / any step):**
- After each resolved decision, update the 90-day roadmap in the vault with: decision
  made, date, owner, next milestone, and what unblocks.

### 4. Produce a decision memo

For each resolved decision, produce a one-page Decision Memo:

```
Decision Memo — Rebranding-2026-06 — D[N]: [Title]
Date: [YYYY-MM-DD]
Status: APPROVED / PENDING CEO GATE

Context
[1-2 sentences: what the decision is about and why it matters now.]

Options considered
1. [Option A] — pros, cons, framework score.
2. [Option B] — pros, cons, framework score.
[…]

Recommended decision
[The recommendation with its primary rationale — framework + market signal.]

Dissenting considerations
[Any legitimate risk or counterargument that was weighed but did not change the
recommendation. Intellectual honesty — do not hide the cons.]

Next action
Owner: [CMO / CEO / Eng]   Deadline: [YYYY-MM-DD]   Success criterion: [measurable]
```

### 5. CEO balanced-decision gate (for significant decisions)

Route to the CEO `balanced-decision` skill for: naming (D1), brand architecture (D4),
visual direction (D6), any decision committing budget, and any decision that cannot
be reversed without significant cost or public exposure.

Prepare the gate input: the decision memo (Step 4) + the options table + the
recommendation. The CEO deliberates through Optimist / Pessimist-conservative /
Dynamic-risk-taker lenses before approval.

Do not implement a significant decision until the CEO gate is resolved.

### 6. Document outcome to KB and update the roadmap

After each decision (approved or deferred):

`kb_ingest` with:
- Title: `Rebranding-2026-06 — D[N] — [Decision title] — [YYYY-MM-DD]`.
- Tags: `rebranding`, `brand`, `marketing`, `wizardingcode`, `decision`, `D[N]`.
- Include: the decision memo, the options table, the CEO gate result if applicable,
  and the rationale.

Update the vault README decision log and the 90-day roadmap with the new status.

## Output contract

Each rebranding session produces:
1. **Vault state summary** — what is decided, what is pending, current roadmap step.
2. **Framework analysis** — scored options table for the open decision.
3. **Decision memo** — one-pager per resolved or escalated decision.
4. **CEO gate package** — if the decision requires deliberation (naming, architecture,
   visual direction, budget).
5. **KB ingest confirmation** — title and tags of what was documented.
6. **Next action** — single most important rebranding action now. Owner, deadline,
   success criterion.

## Red flags

- Working on naming or positioning without first reading the vault — the 12 candidates
  and the strategic recommendation already exist; re-generating from scratch wastes work
  and creates fragmentation.
- Closing a significant decision (D1, D4, D6) without the CEO balanced-decision gate —
  brand architecture and naming are irreversible at launch; they require deliberation.
- Choosing a visual direction without the CEO gate — visual identity commits budget and
  signals; it is not a CMO-only call.
- Re-opening a resolved decision without flagging it — mark it explicitly and route to
  the CEO if re-opening is warranted.
- Producing positioning that sells features instead of status — Status Engineering is
  not optional; feature-led positioning commoditises the brand.
- Not ingesting the decision outcome to the KB — the brand history is the source of
  truth; undocumented decisions fragment the record.
