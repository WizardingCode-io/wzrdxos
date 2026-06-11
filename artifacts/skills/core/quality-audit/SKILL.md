---
name: core:quality-audit
description: Internal audit of a process or department — read the POP first, walk POP vs. practice step by step, log non-conformities with root cause, define PDCA corrective actions with owner and deadline, ingest the audit report, and route to the owning head.
type: process
department: core
when-to-use: Internal process audit, "o processo está a ser seguido?", non-conformity review, PDCA cycle, ISO 9001-light audit, audit of a POP/SOP, or when the CQO is asked to verify that a documented process matches actual practice.
---

# Quality Audit

Rigid process skill — follow every step in order without skipping. This skill drives
the internal audit loop: read the POP → observe practice → log non-conformities →
corrective actions → ingest and route. It operationalises the CQO's ISO 9001-light
QMS within wzrdxOS.

**Constitution principle:** quality by construction, not blocking gates. This audit
produces evidence and routes it to the owning head — it does not halt work.

MCP tools used: `kb_search`, `kb_ask`, `kb_ingest`.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- The **POP (Process Operating Procedure)** for the process being audited — if it
  does not exist in the KB, stop here and request the COO to document it first via
  the `ops:pop-builder` skill. An audit without a written POP is not an audit; it is
  an opinion.
- Prior audit reports for this process — what was found before, what corrective
  actions were agreed, whether they were closed.
- Quality standards for the deliverable type produced by this process (from
  `quality/standards/` in the KB).
- The non-conformity register — check if any open NCRs already exist for this
  process.

Scope the audit explicitly before proceeding:
- **Process audited:** [name]
- **Process owner:** [department head]
- **POP version:** [version or date]
- **Prior audits:** [dates and open NCRs, if any]

### 2. Walk POP vs. practice

For each step in the POP, collect evidence of practice. Evidence sources (in priority
order):
1. Artefacts produced by the process (documents, deliverables, records).
2. Direct observation or user report of how the step is executed.
3. Interview with the process owner or a practitioner.

For each POP step, record:

| POP step | Expected (POP says) | Observed (practice does) | Conforming? |
|----------|---------------------|--------------------------|-------------|
| ...      | ...                 | ...                      | Yes/No/NA   |

Mark "NA" only when a step is not applicable to the current audit scope (explain why).

### 3. Non-conformity log

For each non-conforming step, create a non-conformity record:

```
NCR-[YYYY-MM-DD]-[process]-[seq]

Severity: Minor | Major | Critical
  - Minor: deviation from the POP with no immediate impact on quality or the client.
  - Major: deviation that risks or has caused a quality failure; PDCA required.
  - Critical: deviation that has caused or will cause client harm or regulatory
    breach; immediate escalation to CQO + owning head.

POP step: [step number and title]
Expected: [what the POP says]
Observed: [what practice does]
Evidence: [the artefact, record, or observation that proves it]
Root cause (5-Whys):
  Why 1: ...
  Why 2: ...
  Why 3: ...
  Why 4: ...
  Why 5: ...
Root cause conclusion: [the systemic root cause at Why 4-5]
```

5-Whys discipline: never stop at the first "why". The root cause at Why 1 is almost
always a symptom; the fix at Why 5 is almost always a system change.

### 4. Corrective actions (PDCA)

For each non-conformity (Major or Critical), define a corrective action:

| NCR id | Corrective action | Owner (dept head) | Deadline | Verification method |
|--------|-------------------|-------------------|----------|---------------------|
| ...    | ...               | ...               | ...      | ...                 |

Rules:
- Every corrective action has a **single named owner** — a department head, never
  "the team".
- Deadline is realistic (Minor: ≤ 30 days; Major: ≤ 14 days; Critical: ≤ 48h).
- Verification method: how the CQO will confirm the action was taken (artefact,
  re-observation, updated POP version).
- The action closes the NCR; an unverified action is still open.

### 5. Audit report

Produce the full audit report:

```
# Quality Audit Report — [Process] — [YYYY-MM-DD]

**Auditor:** CQO
**Process owner:** [name/department]
**POP version:** [version]
**Scope:** [what was audited and what was out of scope]
**Prior audits:** [dates / open NCRs inherited]

## Summary

- Steps audited: N
- Conforming: N
- Non-conformities: N (Minor: N / Major: N / Critical: N)
- Overall verdict: Conforming / Minor deviations / Non-conforming

## Non-conformity log

[NCR records from §3]

## Corrective action plan

[Table from §4]

## Positive observations

[Anything the process does well, to preserve — audit is not only deficit-finding]

## Next audit

Recommended re-audit date after Major/Critical corrective actions close: [date]
```

**Citation rule:** every finding cites the evidence (artefact, record, observation).
An uncited finding is a red flag.

### 6. Ingest the report

Call `kb_ingest` with:
- `source` — `audits/YYYY-MM-DD-<process-slug>.md`.
- `target` — `global`.

Only ingest after the report is complete and the corrective action plan is defined.

### 7. Route to the owning head

Deliver the audit report routing in the conversation output:
- Name the process owner (department head).
- Summarise the verdict and the critical/major NCRs.
- State the corrective actions that require their decision or sign-off.
- State the re-audit date.

**Never block work** — if the audit finds deviations, work continues while
corrective actions are taken. The audit produces evidence; the owning head decides
the priority of corrections; the CEO arbitrates if there is a dispute.

## Red flags

- **Auditing without reading the POP first.** If there is no POP, the audit cannot
  happen — request the COO to document the process first.
- **Findings without evidence.** Every non-conformity must cite a concrete artefact,
  record, or observation. "It seems like" or "the team said" without citation is not
  a finding.
- **Corrective actions without owner and deadline.** An action without an owner and a
  deadline is a wish, not a commitment.
- **Stopping at Why 1.** First-level root causes are symptoms; fix them and the
  problem recurs. Drive the 5-Whys to the systemic level.
- **Blocking work to wait for corrections.** The CQO reports; the owning head decides;
  work continues. Blocking is the anti-pattern the Constitution explicitly forbids.
- **Not ingesting the report.** Audit intelligence compounds only when it is in the KB
  and retrievable for the next audit cycle.
