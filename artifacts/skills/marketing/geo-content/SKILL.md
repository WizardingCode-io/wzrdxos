---
name: "marketing:geo-content"
description: Create and optimise content for AI-engine citation (GEO/AEO) and
  traditional SEO — Three Qualities check (Definitive, Structured, Quotable),
  Two-Boards doctrine (Google floor + AI-engine ceiling), Citation-as-KPI reporting,
  and KB ingest of learnings.
type: capability
department: marketing
when-to-use: Creating or optimising content for AI-engine citation or SEO/GEO/AEO
  work. Triggered by "GEO", "AEO", "aparecer no ChatGPT", "Perplexity", "AI search",
  "citação", "llms.txt", "Citation-as-KPI", "content SEO", "seo-audit", or any
  request to improve how wzrdx appears in AI-generated answers.
---

# GEO/AEO Content

Flexible capability skill. Ensures every piece of wzrdx content is engineered to
score on both the Google ranking board (floor) and the AI-engine citation board
(ceiling). Anchored on Neil Patel's GEO framework (Definitive / Structured /
Quotable) and the wzrdxOS Two-Boards doctrine.

## Steps

### 1. KB-first — check existing content and prior learnings

`kb_search` and `kb_ask` for:
- Existing content docs, editorial calendar, prior SEO/GEO audits.
- Company profile (`wzrdx company`) — brand voice, target audience, niche, positioning.
- Any prior Citation-as-KPI measurements or AI share-of-voice snapshots.
- The Rebranding-2026-06 positioning and verbal identity — all content must align with
  the current brand direction (or the locked-in naming once D1 is resolved).
- Relevant KB areas: 01 Branding, 05 Marketing & Growth, 06 GTM, 14 Landing Pages,
  16 Conteúdo & Viralização.

Surface what content already exists. Do not produce content that duplicates something
already in the vault unless the goal is a refresh or upgrade.

### 2. Identify the content goal and audience

State explicitly:
- **Goal:** rank for a query? Get cited by ChatGPT/Perplexity? Both?
- **Target query or topic:** the specific question or keyword this content answers.
- **Audience:** who is searching or asking this in an AI tool? What do they already
  know? What decision are they trying to make?
- **Format:** article, landing page, FAQ, comparison page, LinkedIn post, newsletter?

Match format to citability: AI engines prefer structured, self-contained content that
answers a complete question without requiring the reader to follow a link.

### 3. Three Qualities check (Neil Patel GEO)

Before writing or auditing, assess the content against the three qualities that make
content AI-citable:

**1. Definitive**
- Does this content give the most complete, authoritative answer available on this
  topic in the PT/EU AI-first market context?
- "Best X in Portugal", "Guide to Y in 2026", "How leading AI companies in Europe do Z"
  — the superlative framing signals definitiveness to AI engines.
- If the content is not the most complete answer, either expand it or narrow the scope
  until it is definitively the best answer for a specific sub-question.

**2. Structured**
- Is the content scannable by a human AND parseable by an LLM?
- Required structure elements: clear H1 (the question answered), H2/H3 hierarchy
  (each section = one sub-answer), bullet lists for multi-item answers, tables for
  comparisons, numbered steps for processes.
- Include a TL;DR or summary at the top — AI engines extract summaries to cite.
- Add a FAQ section at the bottom with verbatim questions the audience asks + direct
  answers (these are prime citation targets).

**3. Quotable**
- Does the content contain standalone claims, data points or insights that an AI
  engine can quote without further context?
- Quotable signals: specific statistics ("X% of PT companies in 2026 do Y"),
  named frameworks ("the Two-Boards doctrine: Google floor, AI-engine ceiling"),
  concise definitions ("GEO — Generative Engine Optimisation — is the practice of..."),
  expert attributions ("Alex Hormozi's Grand Slam Offer defines...").
- If the content contains no quotable units, it will not be cited. Add them.

Score each piece as: Definitive (Y/N), Structured (Y/N), Quotable (Y/N). All three
must be Y before publishing or after the revision pass.

### 4. Two-Boards doctrine — score both boards

Evaluate the content on both boards:

**Board 1 — Google floor (traditional SEO)**
- Primary keyword in H1, first 100 words, at least one H2, and meta description.
- Semantic keywords (LSI) distributed naturally — do not keyword-stuff.
- Internal links to 2-3 related wzrdx pages.
- Target: page 1 for the primary query. Floor = minimum viable discoverability.

**Board 2 — AI-engine citation ceiling (GEO/AEO)**
- Schema markup where applicable (Article, FAQPage, HowTo) — structured data makes
  content machine-readable.
- `llms.txt` file at the domain root — lists the canonical content the AI engines
  should index first. Add or update the entry for this content.
- Self-contained answers: each H2 section must answer its sub-question fully without
  requiring the reader to click elsewhere. AI engines cite passages, not pages.
- Citations and data sources: where wzrdx cites statistics or research, name the
  source inline ("according to [Source], [Year]"). AI engines replicate attribution.
- Content freshness signal: include a "Last updated: [YYYY-MM-DD]" line — AI engines
  prefer recent content for fast-moving topics.

**Scoring:**
- Google floor: green (H1 ✓, keyword density ✓, internal links ✓, meta ✓).
- AI ceiling: green (FAQ ✓, schema ✓, llms.txt ✓, self-contained sections ✓,
  quotable units ✓, freshness date ✓).

Both must be green before the content is published. If one board is red, revise.

### 5. Draft or revise the content

Produce or revise the content following the structure below:

```
[H1 — the exact question answered, in natural language]

TL;DR: [2-3 sentence summary — the quotable, AI-citable version of the answer]

[H2 — sub-topic 1]
[Complete answer to sub-topic 1. Self-contained paragraph + bullet list if multi-item.]

[H2 — sub-topic 2]
[…]

[H2 — Frequently Asked Questions]
Q: [Verbatim question audience asks]
A: [Direct, complete answer in 2-4 sentences. No fluff.]

Q: [Next question]
A: […]

Last updated: [YYYY-MM-DD]
Sources: [Named inline + list at bottom if applicable]
```

Apply the brand voice from the Rebranding-2026-06 verbal identity (once locked).
If verbal identity is not yet approved, use: clear, authoritative, no jargon,
European Portuguese primary / English secondary.

### 6. Measure Citation-as-KPI (AI share of voice)

Citation-as-KPI replaces rankings-only reporting. Measure quarterly:

**AI share-of-voice audit (manual, until tooling exists):**
1. Pick 10-20 queries the target audience asks in ChatGPT, Perplexity, Gemini,
   Claude, and Copilot.
2. Run each query in each AI engine.
3. Record: is wzrdx cited? Is a competitor cited instead? What source is cited?
4. Compute: wzrdx citations / total queries × 100 = AI share-of-voice %.
5. Track competitor AI citations for the AIOX watch (coordinate with CEO).

**Benchmark targets (to set at baseline measurement):**
- Quarter 0 (now): establish the baseline %.
- Quarter 1: 2× the baseline.
- Quarter 2: track and set the growth target based on Q1 trajectory.

Report the AI share-of-voice result alongside Google ranking data. Both boards, both
metrics.

### 7. Quarterly freshness refresh

AI engines deprioritise stale content. Every published piece of wzrdx content gets a
quarterly refresh:

1. `kb_search` for the content doc and any new data, frameworks or competitor moves
   since the last update.
2. Update statistics, examples and dates.
3. Add any new FAQ entries based on real audience questions collected since publish.
4. Update `llms.txt` if the content was significantly changed.
5. Update the "Last updated" date and re-ingest the updated doc to the KB.

Freshness refresh is scheduled by the content calendar — not ad hoc.

### 8. Ingest learnings to KB

After every content creation or GEO audit cycle, `kb_ingest`:
- Title: `GEO Content — [Topic] — [YYYY-MM-DD]`.
- Tags: `geo`, `aeo`, `content`, `seo`, `marketing`, `<topic-slug>`.
- Include: the Three Qualities scores, Two-Boards scores, the Citation-as-KPI
  snapshot, any newly discovered AI-citation patterns, and what to do differently
  next cycle.

## Output contract

Each GEO/AEO content session produces:
1. **Content audit or draft** — structured, three-quality-scored, both-board-scored.
2. **Three Qualities scorecard** — Definitive / Structured / Quotable (Y/N + gaps).
3. **Two-Boards scorecard** — Google floor (green/red) + AI ceiling (green/red + gaps).
4. **Citation-as-KPI snapshot** — AI share-of-voice % if a measurement cycle was run.
5. **llms.txt update** — new or revised entry for the domain file.
6. **KB ingest confirmation** — title and tags.
7. **Next action** — single most important GEO action now. Owner, deadline, metric.

## Red flags

- Publishing content that scores red on either board — both boards must be green.
  Content that is only Google-optimised will not be cited by AI engines; content that
  is only AI-optimised may not be found at all.
- Producing content without the Three Qualities check — unstructured, non-definitive,
  non-quotable content is invisible to AI engines regardless of keyword optimisation.
- Measuring only rankings — Citation-as-KPI is the primary north-star metric for
  the AI-first 2026 search landscape. Rankings are the floor, not the ceiling.
- Skipping the quarterly freshness refresh — stale content is penalised by AI engines
  on fast-moving topics (AI, technology, marketing best practices).
- Not updating `llms.txt` when new canonical content is published — AI engines use
  this file to discover priority content; an outdated file means new content is missed.
- Not ingesting GEO learnings to the KB — the citation patterns discovered are the
  competitive edge; losing them to undocumented context wastes the measurement work.
