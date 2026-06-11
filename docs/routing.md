# wzrdxOS Routing Model

The routing contract for wzrdxOS. Every request enters via the conductor flow
(Constitution rule 1) and is routed to the department(s) best positioned to execute it.

## Entry point

Every request follows the same entry:

```
request → core:conductor → decompose → KB-first → route → execute → document
```

The `core:conductor` skill is the universal entry point. It decomposes the work,
consults the KB for prior art, routes each task to the correct department, applies the
CEO balanced-decision gate where needed, and documents back to the KB on completion.

See the [Constitution](constitution.md) for the six mandatory rules that govern this
flow.

## Routing table

One row per routing axis. "Head agent" refers to the first agent to engage; subordinate
agents may be delegated after.

| Request domain | Department | Head agent | Typical skills |
|---|---|---|---|
| Strategy, vision, go/no-go, OKRs, initiative evaluation, trade-off resolution | CEO / Administração | `ceo` | `wzrdx-ceo-balanced-decision`, `wzrdx-ceo-initiative-eval`, `strategy`, `okr-define`, `scenario-analysis`, `blue-ocean`, `five-forces`, `moat-analysis`, `premortem` |
| Execution, process, PM/PO, automation, client-ops, SOPs, onboarding operations | Operações (COO) | `coo` | `wzrdx-ops-roadmap-diagnose`, `wzrdx-ops-pop-builder`, `sop-create`, `workflow-automate`, `n8n-flow`, `sprint-plan`, `backlog-groom`, `kanban-setup`, `delegation-matrix` |
| Code, architecture, infra, AI-engineering, DevOps, security, specs, tech debt | Engenharia / Tecnologia (CTO) | `cto` | `wzrdx-eng-spec-driven-development`, `wzrdx-eng-tech-stack-eval`, `architecture-design`, `api-design`, `clean-code-review`, `security-audit`, `ci-cd-pipeline`, `mcp-builder` |
| Money, budget, cash, forecasting, unit economics, pricing policy, runway | Financeiro (CFO) | `cfo` | `wzrdx-fin-metrics-dashboard`, `wzrdx-fin-unit-economics-audit`, `financial-model`, `cashflow-forecast`, `budget-plan`, `pricing-strategy`, `valuation-model` |
| People, hiring, culture, onboarding (HR side), compensation, talent lifecycle | Recursos Humanos (CHRO) | `chro` | `wzrdx-rh-hiring-pipeline`, `wzrdx-rh-onboarding-60d`, `culture-define`, `culture-audit`, `performance-review`, `compensation-plan`, `org-design` |
| Brand, content, copywriting, campaigns, SEO, GEO/AEO, editorial calendar | Comunicação & Marketing (CMO) | `cmo` | `wzrdx-marketing-rebranding-execution`, `wzrdx-marketing-geo-content`, `brand`, `content`, `copy-framework`, `seo-audit`, `social-strategy`, `launch-sequence` |
| Revenue, pipeline, deals, outreach, partnerships, CRM, commercial offers | Growth / Vendas (CRO) | `cro` | `wzrdx-growth-sales-machine`, `wzrdx-growth-deal-pipeline`, `deal-qualify`, `pipeline-manage`, `cold-email`, `proposal-write`, `forecast-revenue` |
| KB ingestion, daily digest, enrichment cycle, source curation, knowledge gaps | Knowledge (CKO) | `cko` | `wzrdx-knowledge-daily-digest`, `wzrdx-knowledge-kb-enrich`, `knowledge:skill-promotion`, `knowledge:agent-evolution`, `kb`, `search-kb`, `taxonomy-manage` |
| Calendar, e-mail, admin deadlines, meetings, filing, buyback-of-time | Administrativo (EA) | `ea` | `wzrdx-admin-buyback-audit`, `wzrdx-admin-calendar-defense`, `gtd-setup`, `meeting-optimize`, `sop-create` |
| Quality audits, deliverable reviews, non-conformities, compliance process | Quality (CQO — transversal) | `cqo` | `core:deliverable-review`, `core:quality-audit`, `lean-audit`, `voc-loop`, `risk-register`, `sop-process` |

## Cross-department flows

Some initiatives require coordinated hand-offs across multiple departments. These are
the primary cross-department flows:

### Product lifecycle
CEO go/no-go → COO orchestrates tasks + department assignments → Engenharia (build) +
Marketing (go-to-market) → Quality (pre-ship review) → launch → COO monitors KPIs.

### Pricing decision
CRO proposes commercial structure → CFO models unit economics and margin impact →
CEO balanced-decision gate → CRO implements.

### First hire (onboarding)
CHRO owns the hiring pipeline → COO co-designs the 60-day plan → CHRO+COO execute
the shadowing → autonomous milestone at D60–D90.

### Deliverable ship
Owning department produces the artifact → `core:deliverable-review` issues an
evidence-based verdict → owning head decides (ship / fix-first / escalate).

### Significant decisions (any domain)
Any decision that materially changes strategy, resources, or company boundaries must
pass the CEO balanced-decision gate before execution — regardless of the originating
department.

## Routing rules

1. **Decompose first.** Multi-domain requests are broken into individual tasks before
   routing. Each task routes independently.

2. **CEO gate for significant decisions.** Strategy-grade decisions (market entry, major
   spend, hiring, product direction, pricing policy) always pass through the CEO
   balanced-decision workflow. This is non-negotiable and non-blocking — it enriches the
   decision, it does not stall it.

3. **Quality transversal.** Ship-grade deliverables route through `core:deliverable-review`
   before reaching the client. The CQO produces evidence; the owning head decides.

4. **KB-first, document-last.** Every task begins with a KB lookup. Every task ends
   with `kb_ingest` so the next request is smarter (Constitution rules 3–5).

5. **No routing by guesswork.** Use this table. If a request maps to multiple rows,
   decompose and route each task separately.

6. **No blocking gates.** Routing is guidance, not bureaucracy. The conductor decomposes
   and routes; it does not hold the user's request hostage. Fast tasks execute directly;
   complex ones decompose.

## Deployment note

Agents are available as `wzrdx-<name>` subagents after `wzrdx install claude`. The
conductor invokes them by their subagent id:

- `wzrdx-ceo` · `wzrdx-coo` · `wzrdx-cto` · `wzrdx-cfo` · `wzrdx-chro`
- `wzrdx-cmo` · `wzrdx-cro` · `wzrdx-cko` · `wzrdx-ea` · `wzrdx-cqo`

The `core:conductor` skill resolves routing without needing subagents if they are not
installed — it returns routing guidance for the user to execute manually.
