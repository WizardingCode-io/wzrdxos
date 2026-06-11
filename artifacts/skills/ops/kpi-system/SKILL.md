---
name: ops:kpi-system
description: "Build and run the 25-KPI system (5 per area: Gestão/Marketing/Vendas/Cultura/CX) with baselines, targets, alert thresholds, the Friday-17h weekly ritual, and a 1-page executive dashboard."
type: capability
department: ops
when-to-use: Setting up or reviewing operational KPIs, running the weekly review ritual, building the executive dashboard, or when the user says "sistema de KPIs", "dashboard operacional", "revisão de sexta", "25 KPIs", "métricas da empresa", "quais os KPIs" or similar.
---

# KPI System

Flexible capability skill. Takes the company context and produces a complete,
operational KPI system — 25 metrics across 5 areas, baselines, targets, alerts, the
weekly ritual, and a 1-page dashboard. Adapts from full system setup to a single-area
review or a weekly ritual run.

Anchored on: Diagnostico-2026-05 (the 25 KPIs, baselines, area scores), Dan Martell
CEO Scorecard patterns, Alex Hormozi operational metrics framework, KB Areas 10
(Operações) and 09 (Project Management). All sourced from the wzrdxOS Obsidian vault.

## Steps

### 1. KB-first

`kb_search` and `kb_ask` for:
- Diagnostico-2026-05 — the 25 KPIs, baselines, current area scores (scores: Gestão
  28.4, Marketing 25, Vendas 25, Cultura 25, CX 31 — all out of 100).
- Company profile (`wzrdx company`) — current stage, revenue run rate, team size.
- Prior KPI reviews, dashboard snapshots, or weekly memos in the KB (`memos/`).
- CEO Scorecard frameworks (Dan Martell 7 Numbers / 5-Number) from the KB.

Record current baselines before proposing targets. Do not set targets without
grounding in actual baseline data.

### 2. Map the 25 KPIs across the 5 areas

The 25-KPI system is organized in 5 areas, 5 KPIs each. Populate from the
Diagnostico data and company profile:

**Area 1 — Gestão (score: 28.4/100)**
| KPI | Baseline | Target | Alert threshold | Owner |
|-----|----------|--------|----------------|-------|
| Processos documentados (SOPs/POPs) | 0 | ≥ 10 POPs | < 5 | COO |
| Tempo médio de entrega | unknown | benchmark − 20% | > benchmark | COO |
| Reuniões com agenda pré-definida | rare | 100% | < 80% | COO |
| Dashboard semanal preenchido | no | every Friday | missed once | COO |
| Decisões documentadas (ADRs/memos) | 0 | ≥ 2/month | 0 in 4 weeks | CEO |

**Area 2 — Marketing (score: 25/100)**
| KPI | Baseline | Target | Alert threshold | Owner |
|-----|----------|--------|----------------|-------|
| MQLs gerados / mês | unknown | 20 | < 10 | CMO |
| CAC (Custo de Aquisição de Cliente) | unknown | < 3× ticket | > 5× ticket | CMO/CFO |
| Taxa de engajamento (LinkedIn/email) | unknown | ≥ 3% | < 1% | CMO |
| Conteúdo publicado / semana | 0 | ≥ 3 peças | 0 in a week | CMO |
| Citation-as-KPI (GEO/AEO mentions) | 0 | ≥ 5/month | 0 in 4 weeks | CMO |

**Area 3 — Vendas (score: 25/100)**
| KPI | Baseline | Target | Alert threshold | Owner |
|-----|----------|--------|----------------|-------|
| Pipeline total (€) | unknown | 3× monthly target | < 1.5× target | CRO |
| Taxa de conversão lead→cliente | unknown | ≥ 15% | < 8% | CRO |
| Ticket médio (€) | unknown | benchmark per segment | -20% vs prior period | CRO |
| Ciclo de vendas (dias) | unknown | ≤ 30d | > 60d | CRO |
| Win rate | ≥ 40% (stated) | ≥ 40% (verified) | < 30% | CRO |

**Area 4 — Cultura (score: 25/100)**
| KPI | Baseline | Target | Alert threshold | Owner |
|-----|----------|--------|----------------|-------|
| Missão/visão/valores documentados | no | yes (by D60) | not done by D90 | CHRO |
| Internal NPS (equipa) | unknown | ≥ 8 | < 6 | CHRO |
| 1:1s estruturadas realizadas | 0 | 100% weekly | missed 2 weeks | CHRO |
| Rituais de equipa ativos | 0 | ≥ 2/month | 0 in 4 weeks | CHRO |
| Fundador — % tempo em tarefas delegáveis | ≈ 100% | ≤ 20% by D180 | > 80% at D120 | CEO/CHRO |

**Area 5 — CX / Cliente (score: 31/100)**
| KPI | Baseline | Target | Alert threshold | Owner |
|-----|----------|--------|----------------|-------|
| NPS cliente | unknown | ≥ 8 | < 6 | COO/CRO |
| Entregas dentro do SLA (%) | unknown | ≥ 90% | < 80% | COO |
| Taxa de retenção / recompra | unknown | ≥ 80% | < 65% | CRO |
| Taxa de rework | unknown | ≤ 5% | > 15% | COO/CQO |
| Caso de estudo produzido | 0 | ≥ 1 por trimestre | 0 in 6 months | CRO/CMO |

Note: for KPIs with "unknown" baseline, the first action is to measure once and
record the baseline before the next weekly review.

### 3. Set targets and alert thresholds

For each KPI, targets must be:
- **Grounded** — based on the baseline, not aspirational guesswork.
- **Time-bound** — when will the target be achieved? (D30, D90, Q4-2026)
- **Owned** — one named owner per KPI (see table above).
- **Aligned to the €1M 2026 target** — the Diagnostico anchor; every target must
  contribute a traceable path to that outcome.

Alert thresholds trigger immediate escalation to the owning head. They are not
targets — they are failure signals that demand action within 48h.

### 4. Design the weekly ritual (Friday 17h)

The weekly ritual is non-negotiable (Diagnostico doctrine). Structure:

**Friday at 17h00 — Weekly KPI Review (30 min):**

1. **Dashboard fill (5 min):** COO updates the 25 KPIs in the 1-page dashboard for
   the current week. Numbers only — no commentary yet.

2. **Alert scan (5 min):** flag any KPI below its alert threshold. Each flagged KPI
   gets a 48h action owner and response.

3. **Area review (15 min):** one area in depth each week (rotating: Gestão → Marketing
   → Vendas → Cultura → CX → repeat). Review trend vs. prior 4 weeks. Surface the
   root cause of any negative trend. Agree one action.

4. **CEO scorecard update (5 min):** roll the 5 highest-signal KPIs (one per area)
   into the CEO scorecard for the week. CFO feeds the financial numbers in parallel.

**Ritual cadence:**
- Friday 17h00: ritual runs (COO + head agents; CEO reviews async).
- Friday 17h30: CEO scorecard memo ingested to KB (`memos/YYYY-MM-DD-kpi-review.md`).
- Monday morning: any 48h alert responses due from owning heads.

### 5. Build the 1-page executive dashboard

The dashboard is a single view with:

**Header:** week number, date, overall RAG status (Red/Amber/Green per area).

**5-area summary table:**
| Area | Score today | vs. last week | Alert KPIs | Top action |
|------|-------------|---------------|------------|------------|
| Gestão | ... | ↑/↓/→ | 0/N | ... |
| Marketing | ... | ... | ... | ... |
| Vendas | ... | ... | ... | ... |
| Cultura | ... | ... | ... | ... |
| CX | ... | ... | ... | ... |

**KPI detail:** 5 rows per area (25 total), with current value, target, alert
threshold, and RAG status.

**CEO 5-number snapshot (Dan Martell):**
1. MRR / Receita mensal
2. Pipeline (€)
3. Novos clientes este mês
4. Margem operacional (%)
5. Runway (meses)

**One action per area** — the single most important thing to move the needle in
each area this week.

Format: xlsx (preferred) or markdown table. Template lives in the KB after the first
run.

### 6. Ingest the KPI review memo to the KB

After each weekly ritual:
```
kb_ingest("<review memo>", source="memos/YYYY-MM-DD-kpi-review.md", target="global")
```

After system setup:
```
kb_ingest("<KPI system design>", source="memos/YYYY-MM-DD-kpi-system-setup.md", target="global")
```

## Output contract

Every invocation delivers:
1. **25-KPI table** — all 5 areas, all 25 KPIs, baseline, target, alert, owner.
2. **Gap list** — KPIs with unknown baselines flagged for immediate measurement.
3. **Weekly ritual schedule** — Friday 17h ritual design, duration, participants.
4. **1-page dashboard template** — area summary, 25-KPI detail, CEO 5-number snapshot.
5. **KB ingest confirmation** — system design or review memo stored.

## Red flags

- **Setting targets without baselines.** A target without a baseline is a wish, not
  a goal. Measure first, set target second.
- **25 KPIs but no alert thresholds.** Metrics without alerts are decoration. Alerts
  are what make the system operational.
- **No owner per KPI.** A KPI without an owner does not move. Ownership is mandatory.
- **Skipping the weekly ritual.** The ritual is the heartbeat. A system that is not
  reviewed weekly decays within 4 weeks (Diagnostico pattern).
- **CEO scorecard not connected to dept KPIs.** The scorecard must aggregate from
  the 25 — not be filled in separately. Disconnected dashboards are inconsistent.
- **Skipping the KB-first step.** Prior reviews exist; build the trend, don't reset.
