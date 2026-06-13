---
name: ops:roadmap-diagnose
description: 5-area operational diagnostic + custom 90-day roadmap (Documentar → Medir → Delegar), anchored on the Diagnostico WizardingCode 2026-05 pattern.
type: capability
department: ops
when-to-use: Diagnosing a business's operational maturity, starting an ops engagement, building a 90-day operational roadmap, or when the user says "diagnóstico", "diagnóstico operacional", "onde estamos", "o que melhorar primeiro", "audit the business", "operational assessment", "roadmap de 90 dias" or similar.
---

# Ops Roadmap Diagnose

Flexible capability skill. Produces a scored diagnostic across 5 operational areas
and a custom 90-day roadmap. Depth adapts to available data — a rich brief yields a
precise roadmap; a sparse brief yields a hypothesis map with data-gathering tasks.

Anchored on the real Diagnostico WizardingCode 2026-05 (28.4/100 baseline) and the
Dan Martell / Alex Hormozi operational maturity model.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Company profile (`wzrdx company`) — name, market, customers, niche, objectives.
- Prior diagnostics, roadmaps or KPI baselines already in the KB.
- Diagnostico-2026-05 docs (if this is WizardingCode) — 6 documents, 90-day roadmap,
  25 KPIs, POP templates.
- Relevant frameworks: Dan Martell 92% rule, Alex Hormozi 90%-autonomous ops,
  Lencioni Five Dysfunctions.

Note what is already known. Only generate new analysis for gaps.

### 2. Brief intake

Collect (or infer from context):
- Company / business unit being diagnosed.
- Scope: full company or a specific area (e.g. only Processos or only Equipa).
- Available data: revenue, team size, tools in use, recent pain events.
- Time horizon: 30 / 60 / 90 days.
- Primary constraint: the single biggest bottleneck the founder names.

### 3. 5-area diagnostic

Score each area 0–100 (with evidence); flag the top 2–3 gaps per area.

| # | Area | What is assessed |
|---|------|-----------------|
| 1 | **Processos** | SOPs/POPs documented and in use; process compliance; rework rate |
| 2 | **Métricas** | KPIs defined, measured and reviewed weekly; dashboard exists |
| 3 | **Equipa & Delegação** | Delegation index; autonomy level; 92%-rule application; onboarding quality |
| 4 | **Automação & Ferramentas** | Workflow automation coverage; tool sprawl vs. integration depth |
| 5 | **Cultura & Rituals** | Weekly rituals (stand-up, review, retrospective); team health score; documented values |

**Scoring guide:**
- 0–30: critical — no system, founder-dependent, high risk.
- 31–59: developing — partial system, inconsistent execution.
- 60–79: functional — system exists, gaps in measurement or delegation.
- 80–100: mature — documented, measured, delegated, continuously improved.

**Overall maturity score:** weighted average (Processos ×30%, Métricas ×25%,
Equipa ×25%, Automação ×10%, Cultura ×10%). Below 40 = "Fase Sobrevivência";
40–65 = "Fase Organização"; 66–85 = "Fase Escala"; 86+ = "Fase Optimização".

### 4. Root constraint identification

Identify the single constraint that, if removed, unlocks the most progress across
areas. Common patterns (from Diagnostico-2026-05):
- **Extreme centralisation:** founder does everything; no delegation; no docs.
- **Invisible metrics:** decisions by gut; no weekly KPI review.
- **Tool chaos:** many tools, no integrations, manual hand-offs everywhere.
- **Culture vacuum:** no rituals, no documented values, no feedback loops.

Name the pattern explicitly; link it to the diagnostic scores.

### 5. 90-day roadmap

Three-phase roadmap — Documentar → Medir → Delegar — with weekly milestones.

**Phase 1 — Documentar (D1–D30):**
- Map the top 5 recurring processes (by frequency × founder-time).
- Write POPs for each (use `ops:pop-builder`).
- Define the 25 KPIs with baselines (or a subset covering the worst-scoring areas).
- Set up the Friday 17h dashboard ritual.

**Phase 2 — Medir (D31–D60):**
- Run the dashboard for 4 consecutive weeks; tune KPI definitions.
- Identify the top 3 automation candidates (highest ROI, lowest complexity).
- Build or configure the automations (n8n / Zapier / AI agent).
- First delegation test: hand off 1 documented process to a team member.

**Phase 3 — Delegar (D61–D90):**
- Delegate 3+ processes with documented POPs and quality criteria.
- Run the 60-day onboarding checkpoint with CHRO (if a hire is involved).
- Retrospective: re-score all 5 areas; identify Phase 2 roadmap items.

For each milestone: owner · target date · success criterion.

### 6. Priority matrix

2×2 matrix: Impact (high/low) × Effort (low/high).

- **Quick wins (high impact, low effort):** do first — these fund the roadmap.
- **Big bets (high impact, high effort):** plan and resource; Phase 2–3.
- **Fill-ins (low impact, low effort):** batch or delegate.
- **Avoid (low impact, high effort):** don't start.

Name at least 3 quick wins with owners.

### 7. Document to KB

Ingest the diagnostic report and roadmap into the KB via `kb_ingest`:
- Title: `Diagnostico Operacional — <Company> — <YYYY-MM>`.
- Tags: `diagnostico`, `roadmap`, `ops`, `<company-slug>`.
- Include: scores, root constraint, roadmap milestones, priority matrix.

## Output contract

The deliverable always contains:
1. **Diagnostic scorecard** — 5 areas scored + overall maturity phase.
2. **Root constraint** — one named pattern with evidence.
3. **90-day roadmap** — three phases with weekly milestones, owners, and criteria.
4. **Priority matrix** — 4 quadrants, at least 3 quick wins named.
5. **Next action** — single most important step, owner, deadline.

## Red flags

- Skipping the KB-first step — the Diagnostico-2026-05 exists; use it.
- Producing a generic roadmap not tied to the company's actual scores.
- No owners on milestones — a roadmap without owners is a wish list.
- Jumping to Phase 3 (Delegar) before Phase 1 (Documentar) is complete.
- Scoring without evidence — every score needs at least one observable fact.
