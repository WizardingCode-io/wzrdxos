---
name: growth:cold-outreach-engine
description: Design and run the outbound engine — ICP list building, shotgun lane
  (volume email, compliance-aware) and sniper lane (personalised Loom, 5-min research
  pass), Cold-First Microwave sequencing, speed-to-lead three-fix on replies; output
  is an outreach playbook and first cadence ready to execute.
type: capability
department: growth
when-to-use: Building or running outbound prospecting, cold email campaigns, personalised
  outreach, or any proactive pipeline-generation motion. Triggered by "cold outreach",
  "outbound", "cold email", "prospeção", "Loom personalizado", "Cold-First Microwave",
  "sniper", "shotgun", "speed-to-lead", or "pipeline vazio".
---

# Cold Outreach Engine

Flexible capability skill. Takes the ICP definition and the pipeline state and
produces a structured outbound motion — list, copy, cadence, and metrics — ready to
run immediately. Adapts depth to context: a full engine design vs. a single-lane
cadence vs. a reply-handling fix.

Anchored on: Sabri Suby (shotgun lane — volume email; sniper lane — personalised
Loom; "cold outreach is the floor before the ceiling" — Personas 775 lines);
Alex Hormozi (Cold-First Microwave — design the cold motion before warming; outbound
volume discipline); Neil Patel (speed-to-lead three-fix — 5-minute response rule);
Dan Martell (parallel outreach for whale accounts). All sourced from the WizardingCode
vault (Topics — Sales Frameworks, Lead Generation & Conversion, Growth Hacking Aplicado;
Personas — Suby, Hormozi, Patel, Martell).

Note on compliance: email outreach in the EU/PT market is subject to GDPR and
CAN-SPAM equivalents. This skill flags compliance requirements at each step; legal
review for the specific setup is the founder's responsibility.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — offer, ICP, pricing tier, current pipeline.
- Prior outreach campaigns, copy, reply rates or list sources already in the KB.
- Diagnostico-2026-05 — Vendas 25/100, current pipeline state, target €1M.
- Sales Frameworks topic — shotgun/sniper, speed-to-lead, Cold-First Microwave.
- Lead Generation & Conversion topic — list-building sources, qualifying signals.
- Growth Hacking Aplicado topic — outbound tactics relevant to the PT/EU market.
- Deal pipeline snapshot (if available) — compute the coverage gap to size the
  outreach volume required.

Note what already exists. Only design from scratch for genuine gaps.

### 2. Cold-First Microwave principle

The Cold-First Microwave (Hormozi) is the design sequence: **build the cold motion
first, then warm it up**. Most founders wait until they have referrals and inbound;
Hormozi's principle is to design outbound first so the warm motion amplifies it, not
replaces it.

Apply this principle before choosing which lane to run:

1. **Define the cold motion** (this skill — outbound engine).
2. **Design the warm motion** (referrals, content, Dream 100 — `growth:dream-100-
   partnerships` for the partnership layer).
3. **Sequence:** cold motion launches first, warms up pipeline; warm motion adds to it.

Never defer outbound because "inbound is coming". Outbound is the floor; inbound is
the ceiling.

### 3. ICP list building

A list without qualification is spam. Build lists with a qualification-first filter.

#### Step 1 — Define the ICP precisely

Answer each attribute:
- **Industry / vertical:** which sectors have the highest pain-fit for the current offer?
- **Company size:** headcount and/or revenue range.
- **Role / title:** who feels the pain directly? Who signs the contract?
- **Trigger event:** what happens in the ICP's world that makes them ready to buy now?
  (Examples: new funding, leadership change, rebranding, product launch, regulatory
  deadline, competitor win/loss.)
- **Geography:** PT-first, Lusofonia, or EU market?
- **Exclusion criteria:** who is NOT a fit, regardless of size or title? (Explicit
  exclusion avoids wasted touches and protects sender reputation.)

#### Step 2 — List sources

| Source | Best for | Compliance note |
|--------|---------|-----------------|
| LinkedIn Sales Navigator | Role+company+trigger filters | Export requires manual copy or third-party enrichment — check ToS |
| Apollo.io / Hunter.io | Email discovery and enrichment | GDPR: verify legitimate interest basis per contact |
| Lusha / Clearbit | PT/EU company data enrichment | Same GDPR note |
| Industry directories / associações PT | Local market penetration | Public data — legitimate interest easier to establish |
| Podcast guest lists / event speakers | Thought-leader tier / whales | High fit, high effort — use for sniper lane only |
| Referral map (existing clients) | Highest conversion | Warm by definition — not cold; route to Dream 100 skill |

Target list size per lane:
- **Shotgun lane:** 200-500 contacts per week minimum to produce statistically meaningful
  reply rates. Fewer is not enough data.
- **Sniper lane:** 5-10 deeply researched targets per week maximum. Quality not volume.

**GDPR compliance floor (EU/PT market):**
- Establish a legitimate interest basis for each list (B2B outreach to professional
  role = generally permissible under legitimate interest; DPA guidance varies — check).
- Include an unsubscribe/opt-out mechanism in every email.
- Never purchase scraped lists without verifying the data source's compliance status.
- Document the legitimate interest assessment in the KB before launching.

### 4. Shotgun lane — volume email

The shotgun lane maximises volume with a personalised-at-scale approach. The goal is
a 2%+ reply rate at volume. Below 1% = copy or list quality problem.

#### Email structure (Suby shotgun framework)

Each email must be:
- **Short:** 5-7 sentences. No walls of text. The prospect decides in 8 seconds.
- **Specific:** one pain, one ICP, one call to action. Do not try to sell the offer
  in the cold email — sell the conversation.
- **Non-salesy:** the tone is peer-to-peer, not pitch-deck. Write as if introducing
  yourself at a conference.

Template scaffold:

```
Subject: [specific, under 7 words — curiosity or relevance, not clickbait]

Hi [First name],

[1 sentence: the precise reason you are reaching out to them specifically — trigger
event, shared context, or observed pain. Not "I found you on LinkedIn."]

[1-2 sentences: the specific outcome you have achieved for companies like theirs.
Concrete result, named vertical. No features.]

[1 sentence: the soft ask — are they open to a 15-minute call? A specific question
that requires a yes/no answer.]

[Name]
[Company] — [one-line position: what you do for whom]

P.S. [Optional — a second proof point or a relevant resource. Keeps the email alive
if the main CTA doesn't land.]
```

#### Cadence (shotgun)

| Touch | Day | Channel | Action |
|-------|-----|---------|--------|
| 1 | Day 0 | Email | Initial email (template above) |
| 2 | Day 3 | Email | Short follow-up: "Did you get a chance to see this?" + one new value point |
| 3 | Day 7 | Email | "Last reach-out" framing — Either-Or close (Hormozi): "Open to a quick call or prefer I send you a resource first?" |
| 4 | Day 14 | Email | Break-up email: "I won't keep reaching out — happy to connect whenever it makes sense." |

After Touch 4: move to 24-36 Month Buyer Maturation sequence in the CRM
(content nurture — do not delete, they buy eventually or refer).

#### Sender reputation protection

- Use a domain alias (not the main domain) for cold outreach.
- Warm the domain for 2-4 weeks before launching volume (10 → 25 → 50 → 100/day).
- Hard-bounce rate must stay below 2%; spam complaint rate below 0.1%.
- SPF, DKIM, DMARC must be configured before any sends. Confirm with Engenharia.

### 5. Sniper lane — personalised Loom

The sniper lane is for high-value targets where a personal touch dramatically increases
reply rate. One sniper touch is worth 50 shotgun emails for the right account.

#### 5-minute research pass

Before recording the Loom, invest 5 minutes of focused research. Any more and the
ROI breaks down at volume.

Research sources (in order of insight density):
1. LinkedIn profile — recent posts, job change, shared content.
2. Company website — recent news, product pages, team page.
3. Their own content — podcast, newsletter, or webinar (if exists).
4. Google: "[name] + [company] + interview or talk" — quoted opinions are the richest
   personalisation material.

From the 5 minutes, extract one specific observation: "I noticed you [specific thing].
That made me think [specific connection to the offer]."

#### Loom structure (60-90 seconds maximum)

```
Frame 0: screen share showing their website or LinkedIn — they recognise it immediately.

0-10s:  "Hey [name] — quick video for you. I noticed [specific observation from research]."

10-40s: "We work with [ICP profile] to [specific outcome]. For example, [30-second case study
         — company type + result + timeframe]. The reason I'm reaching out is I think
         [specific connection to their situation]."

40-60s: "If this resonates, [CTA — reply to this email / book a call via the link below].
         If not, no worries — happy to connect whenever the timing is right."

Thumbnail: your face + text overlay with the prospect's name or company logo.
```

#### Sniper cadence

| Touch | Day | Channel | Action |
|-------|-----|---------|--------|
| 1 | Day 0 | Email + Loom link | Personalised email with Loom embedded |
| 2 | Day 3 | LinkedIn DM | "Sent you a short video — wanted to make sure it landed." |
| 3 | Day 7 | Email | Follow-up with a relevant resource (case study or insight) |
| 4 | Day 14 | Email | Either-Or close |

Sniper targets that do not reply after 4 touches move to the Dream 100 warm-up
sequence (`growth:dream-100-partnerships`) — do not treat unresponsive whales as lost.

### 6. Speed-to-lead three-fix

Inbound responses to cold outreach decay within minutes. Neil Patel's three-fix:

**Fix 1 — 5-minute response rule:**
Any reply to cold outreach is responded to within 5 minutes during working hours. This
single discipline has a disproportionate impact on meeting bookings. Set a notification
trigger for the outreach inbox.

**Fix 2 — Pre-written reply templates:**
Prepare responses for the four most common reply types before launching the cadence:
- Positive reply (interested) → immediate booking link + confirmation.
- "Not now" reply → "Of course — when would it make sense to reconnect?" + CRM nurture
  tag.
- "Wrong person" reply → "Who would be the right person? Happy to reach out to them
  directly."
- Objection reply → QATQ framework (see `growth:sales-machine` §4).

**Fix 3 — Booking friction removal:**
The CTA must link directly to a calendar booking page (Calendly or equivalent). A
"let me know your availability" response adds at minimum 1-2 days of friction; a
direct booking link removes it. Every cold email CTA includes a booking link.

### 7. Metrics — reply and meeting rates

Track these metrics weekly per lane and feed them to the CRO weekly pipeline review:

| Metric | Shotgun target | Sniper target | Alert |
|--------|---------------|---------------|-------|
| Email open rate | ≥ 40% | ≥ 60% | < 30% = subject line problem |
| Reply rate | ≥ 2% | ≥ 15% | < 1% = copy or list quality |
| Positive reply rate | ≥ 0.5% | ≥ 5% | < 0.3% = ICP or offer fit |
| Meeting booked rate | ≥ 0.3% | ≥ 3% | < 0.2% = booking friction |
| Meeting no-show rate | < 20% | < 15% | > 30% = qualification problem |

If any metric is in alert territory for two consecutive weeks, pause the lane and
diagnose before continuing. Common fixes:

- Open rate alert → test 3 new subject lines (use hook-viral-system for subject line
  generation).
- Reply rate alert → shorten the email, add a specific result, remove one idea.
- Meeting booked alert → check booking link, simplify the CTA, apply Fix 2 templates.
- No-show alert → add a confirmation sequence (24h before + 1h before), qualify harder
  in the application step.

### 8. Ingest playbook and learnings to KB

After the engine design and after each weekly review, `kb_ingest`:

Design session:
- Title: `Cold Outreach Engine — [Company] — [YYYY-MM-DD]`.
- Tags: `outreach`, `outbound`, `cold-email`, `loom`, `growth`, `<company-slug>`.
- Include: ICP definition, list sources, lane designs, copy templates, cadences,
  GDPR notes, sender setup checklist, metric targets.

Weekly review:
- Title: `Outreach Review — [Company] — [YYYY-WNN]`.
- Tags: `outreach`, `metrics`, `growth`, `weekly-review`.
- Include: per-lane metrics vs. targets, decisions made, copy variants tested, what
  to change next week.

## Output contract

Every cold outreach engine session produces:
1. **ICP definition** — precise attributes and exclusion criteria (§3).
2. **List-building plan** — sources, volumes, GDPR compliance notes (§3).
3. **Shotgun lane** — email template, cadence, sender setup checklist (§4).
4. **Sniper lane** — research pass protocol, Loom structure, cadence (§5).
5. **Speed-to-lead three-fix** — 5-min rule setup, reply templates, booking link (§6).
6. **Metrics dashboard** — targets and alert thresholds per lane (§7).
7. **Next action** — single most important outreach action this week. Owner, deadline.

## Red flags

- Launching volume email without sender warm-up — a cold domain sending 500 emails
  on day 1 will be flagged as spam; the entire domain is at risk.
- Missing GDPR/legitimate-interest documentation — EU regulators have issued fines for
  B2B cold email without a documented basis; check before launching.
- Copy that pitches the offer in the cold email — the goal of cold email is a reply,
  not a close; never try to sell in touch 1.
- Skipping the 5-minute response rule — a reply left for 2 hours has already cooled;
  every minute of delay reduces the meeting-booked probability.
- Running the sniper lane without the 5-minute research cap — more than 5 minutes per
  prospect breaks the ROI model; time-box it strictly.
- Reporting metrics without acting on alert states — metrics that are in alert for two
  weeks with no change decision are decoration, not management.
- Not ingesting the playbook — an outreach system that lives only in the founder's
  head cannot be delegated or improved systematically.
