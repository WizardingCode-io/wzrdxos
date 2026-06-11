---
name: core:deliverable-review
description: Pre-ship structured review of a client-facing deliverable — retrieve the type checklist (or draft it first), run checklist dimensions, invoke judge-panel for critical deliverables, issue an evidence-based verdict (ship / fix-first / escalate), and ingest the verdict.
type: process
department: core
when-to-use: Pre-ship review, "posso enviar isto ao cliente?", deliverable quality gate, "está pronto?", commercial proposal review, campaign review, report review, or any request to assess whether a client-facing output meets quality standards before shipping.
---

# Deliverable Review

Rigid process skill — follow every step in order without skipping. This skill drives
the pre-ship quality gate: retrieve the checklist → run it → optionally invoke
judge-panel → verdict with evidence → ingest.

**Constitution principle:** quality by construction, not blocking gates. This review
produces an evidence-based verdict and routes it to the owning head — the owning
head decides whether to ship, fix, or escalate. The CQO never unilaterally blocks a
deliverable.

MCP tools used: `kb_search`, `kb_ask`, `kb_ingest`.
Workflow used for critical deliverables: `judge-panel`
  (in-repo: `artifacts/workflows/judge-panel/workflow.mjs`;
  post-install: `~/.claude/workflows/judge-panel.mjs`).

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- The **type checklist** for this deliverable (from `quality/checklists/` in the KB).
  If no checklist exists for this type, **draft it first** (step 1b) and ingest it
  before proceeding.
- Prior reviews of the same deliverable type — what issues recur?
- Quality standards for this deliverable type (`quality/standards/` in the KB).
- Company profile (`wzrdx company`) — brand voice, client profile, positioning.

Identify the deliverable type explicitly:
- **Commercial proposal** — highest stakes; judge-panel is strongly recommended.
- **Campaign** — copy, visuals, landing page, e-mail sequence.
- **Report / analysis** — data accuracy and citation discipline critical.
- **Client deliverable** (code, design, document) — type-specific checklist applies.
- **Other** — draft the checklist before reviewing.

**Step 1b — Draft the checklist if it does not exist:**

If no checklist exists for this deliverable type, draft it now:
```
# Checklist — [Deliverable type] — [YYYY-MM-DD]

## Dimensions
1. Copy quality — clear, concise, no jargon (unless the client uses it), no typos.
2. Numbers verified — every statistic, price, date, and quantitative claim double-checked.
3. Brand voice — matches the established brand voice (tone, vocabulary, formality).
4. Completeness — all required sections present; no placeholders or TBDs in the final.
5. Client-fit — addresses the specific client's context, pain, and expectations.
[Add type-specific dimensions here]
```

Ingest the draft checklist with `source: quality/checklists/<type>-checklist.md`
before proceeding. The checklist is now in the KB for future reviews.

### 2. Run the checklist

For each checklist dimension, evaluate the deliverable and record:

| Dimension | Pass / Fail / Partial | Evidence | Severity if fail |
|-----------|----------------------|----------|-----------------|
| Copy quality | ... | ... | ... |
| Numbers verified | ... | ... | ... |
| Brand voice | ... | ... | ... |
| Completeness | ... | ... | ... |
| Client-fit | ... | ... | ... |
| [type-specific] | ... | ... | ... |

Severity of fails:
- **Minor** — cosmetic, does not affect client outcome. Note it; ship is still
  possible with a fix logged.
- **Major** — affects client outcome or brand perception. Fix-first before shipping.
- **Critical** — factual error, wrong client context, compliance risk, or major brand
  breach. Escalate immediately; do not ship.

### 3. Judge-panel (critical deliverables)

Invoke the `judge-panel` workflow when ANY of the following is true:
- The deliverable is a commercial proposal ≥ €5,000 deal value.
- At least one Major or Critical fail was found in §2.
- The deliverable is the first of its type (no prior baseline).
- The owning head requests a second-opinion review.

**How to invoke:**

Use the Workflow tool with `judge-panel` and pass:
```json
{
  "subject": "<the deliverable text or file path>",
  "lenses": ["accuracy", "clarity", "fit-for-purpose"],
  "context": "<client context, deal size, deliverable type>"
}
```

The judge-panel runs N independent judges (one per lens) in parallel, then a
synthesis agent produces the final verdict: `ship`, `fix-first`, or `escalate`.

Wait for the synthesis verdict before proceeding to §4.

### 4. Issue the verdict

Synthesize the checklist results (and the judge-panel verdict, if run) into the
review verdict:

**Verdict options:**

`ship` — all dimensions pass (Minor fails logged for next iteration); the deliverable
is ready to send to the client. State what Minor items to address in the next version.

`fix-first` — one or more Major fails; list the **exact fixes required** (not
categories — specific text, numbers, or sections to change) with a suggested owner
and a time estimate. The owning head decides whether to fix now or ship with a
documented risk acceptance.

`escalate` — Critical fail; the deliverable must not ship until the CQO, the owning
head, and if necessary the CEO review the issue. State the critical finding, the risk,
and the escalation path.

**Evidence rule:** every verdict element cites the specific dimension, the evidence
found, and the severity. No verdict without evidence.

**Ownership rule:** the verdict routes to the owning head; they decide the next step.
The CQO never unilaterally blocks shipping — it produces evidence and names the risk.

### 5. Ingest the verdict

Call `kb_ingest` with:
- `source` — `reviews/YYYY-MM-DD-<deliverable-slug>.md`.
- `target` — `global`.

Content: the checklist results, the judge-panel output (if run), the verdict with
evidence, and the exact fixes required (if fix-first or escalate).

## Output contract

Every deliverable review delivers:
1. **Checklist results** — all dimensions evaluated, with evidence and severity.
2. **Judge-panel synthesis** (if invoked) — judges' scores and the merged verdict.
3. **Verdict** — `ship`, `fix-first`, or `escalate`, with full evidence.
4. **Exact fixes** (if fix-first) — specific changes, not general directions.
5. **Routing** — to whom the verdict goes and why.

## Red flags

- **Verdict without evidence.** "It doesn't feel right" is not a finding. Every
  verdict element cites a specific checklist dimension and the concrete observation.
- **Blocking instead of reporting.** The CQO reports; the owning head decides. If the
  head chooses to ship despite a Major finding, that is a documented risk decision —
  not a CQO failure.
- **Reviewing your own work alone.** If the reviewer is the same person who produced
  the deliverable, at minimum invoke the judge-panel workflow. Self-review without
  adversarial checks is a structural blind spot.
- **Skipping the checklist-draft step.** If no checklist exists for this type, the
  first review is also a checklist-authoring session. Defer the review until the
  checklist is drafted and ingested.
- **Not ingesting the verdict.** Review intelligence compounds only when verdicts are
  in the KB and retrievable for pattern analysis.
