# wzrdxOS organization (M3)

> Design in progress. Departments are being defined one at a time; agents come after.
> Governed by the [Constitution](constitution.md). Product is a [cross-department
> flow](../) (see memory: product-lifecycle-flow), not a department.

## Departments (locked set)

1. CEO / Administração
2. Operações (inclui Planeamento — PM/PO — e orquestra o ciclo de vida do produto)
3. Engenharia / Tecnologia
4. Financeiro
5. Recursos Humanos
6. Comunicação & Marketing (inclui Brand & Design)
7. Growth (inclui Vendas)
8. Knowledge
9. Administrativo
\+ **Quality** — transversal (não é departamento)

The C-suite heads live in CEO/Administração and **double-hat** — each also leads a
functional department.

---

## 1 — CEO / Administração ✅ defined

**Purpose:** the strategic brain of the company. Everything depends on its analysis,
research, knowledge, strategy, and coordination.

**Heads (C-suite, top tier):** CEO · CTO · COO · CMO · CFO · CHRO. Each double-hats:
- CTO → leads Engenharia · COO → leads Operações · CMO → leads Comunicação & Marketing ·
  CFO → leads Financeiro · CHRO → leads Recursos Humanos · CEO → overall.

**Responsibilities:**
- Vision and strategic direction.
- Evaluate initiatives: market, viability, SWOT, competition.
- Approve / veto — the go/no-go gate; initiate the product lifecycle flow.
- Set priorities, allocate resources, resolve cross-department trade-offs, define OKRs.
- Align everything to the company profile (`wzrdx company`).

**Balanced-decision mechanism (deliberation workflow):** every significant decision is
weighed through lenses — **Optimist** (potential), **Pessimist / conservative master**
(risks, pros & cons, weighs everything), **Dynamic / risk-taker** (bold opportunity) —
to reach equilibrium before approval.

**Does NOT:** execute/implement (that is Operações + departments).
**Hands off to:** Operações (which decides the flows and department responsibilities).

### CEO (head) — toolbox

**Skills**
- `pptx` — board decks, investor updates, pitch decks (very high value)
- `xlsx` — financial models, budgets, scenarios, unit economics (very high)
- `docx` — memos, formal reports/letters for the board/investors (high)
- `pdf` — read/combine/extract from contracts and documents (medium)
- `deep-research` — verified multi-source research (market, M&A, competitors), cited report (high)
- `schedule` — recurring automated briefings (e.g. 7am daily snapshot) (medium-high)
- adapt (🔄): `strategy`, `position`, `blue-ocean`, `five-forces`, `moat-analysis`,
  `validate-idea`, `competitive-intel`, `scenario-analysis`, `premortem`,
  `decision-framework`, `okr-define`, `okr-cadence`, `board-advisor`
- new (🆕): balanced-decision deliberation workflow (optimist / pessimist-conservative /
  risk-taker lenses → equilibrium)

**Plugins / MCPs**
- `wzrdx-kb` (KB-first, mandatory) · company profile (`wzrdx company`)
- Bright Data (web scraping / Google search) — for market evaluation
- (Small Business → mostly Financeiro/Ops · Productivity → Ops — mapped to those depts)

> Skill authoring: the **skill-creator** skill is vendored at
> `artifacts/skills/core/skill-creator/` — wzrdxOS authors and evals its own skills,
> mining the Obsidian KB for domain content (doctrine: knowledge enrichment).
> Obsidian vault: `~/Documents/Personal`.

---

## 4 — Financeiro (CFO) ✅ defined

**Purpose:** financial discipline and intelligence. Knows where every euro comes from
and goes to, keeps the company solvent, and turns numbers into decisions.

**Head:** CFO (double-hats from CEO/Administração).

**Responsibilities:**
- Financial strategy, annual budget and plan; cash flow / treasury and runway.
- Forecasting and scenario modelling; unit economics and margin discipline.
- Pricing policy (proposed by CFO, signed off with CEO/Growth).
- Invoicing, collections, expense control; weekly financial dashboard (MRR, margem
  operacional, runway, pipeline €, receita por fonte) — feeds the CEO scorecard.
- Investor relations and fundraising materials when needed; financial risk register.
- Interface with the external accountant — PT statutory accounting/IVA stays with the
  contabilista; wzrdxOS **prepares and reconciles, never files**.

**Does NOT:** file taxes / statutory accounts (external accountant), sell (Growth),
approve strategy alone (CEO deliberation gate).

### CFO (head) — toolbox

**Skills**
- `xlsx` — financial models, budgets, scenarios, forecast, unit economics (very high)
- `pptx` — board decks, investor updates, results presentations (very high)
- `deep-research` — due diligence, peer benchmarking, verified+cited market research (high)
- `docx` — financial memos, board reports, investor letters (high)
- `pdf` — read/extract from contracts, statements and documents (medium-high)
- `schedule` — recurring financial reports (e.g. weekly cash snapshot) (medium)
- adapt (🔄): `financial-model`, `cashflow-forecast`, `budget-plan`, `unit-economics`,
  `pricing-strategy`, `forecast-revenue`, `valuation-model`, `scenario-analysis`,
  `metrics-dashboard`, `subscription-model`
- new (🆕 — mined from the Obsidian KB, authored via skill-creator):
  - `cfo-metrics-dashboard` — CEO Scorecard 7 Numbers / 5-Number (Dan Martell) wired to
    the WizardingCode KPI set (Diagnostico-2026-05)
  - `unit-economics-audit` — per-revenue-stream profitability, gross-profit-to-CAC
    sanity check (David FilterBuy, Alex Hormozi)
  - `pricing-redesign` — premium pricing / category shift, 3-tier anchoring, payback
    engineering (Sabri Suby, Neil Patel, DDias Matt)
  - `cfo-4-pilares` — diagnostic across Planeamento · Contabilidade · Análise · Risco
    (KB framework "4 Pilares de Atividade do CFO")
  - `cash-first-ops` — daily/weekly cash ritual, runway calc, default-debt warning
    (Dan Martell, David FilterBuy)

**Plugins / MCPs**
- `wzrdx-kb` (KB-first, mandatory) · company profile (`wzrdx company`)
- **Small Business** (Anthropic, knowledge-work-plugins) — best fit for current stage:
  payroll planning, cash forecast, month-end close, `/monday-brief`, invoice chasing
- **Finance** (Anthropic, knowledge-work-plugins) — close cycle: journal entries,
  reconciliation, statements, variance analysis (adopt the relevant subset)
- **Financial Analysis** (Anthropic, financial-services-plugins) — DCF, comps,
  model/deck review — for valuation and strategic analysis
- Deferred: Equity Research · Investment Banking · Private Equity — only relevant if
  wzrdx enters M&A/investing; revisit then.

**KB sources (vault `~/Documents/Personal`):** Topics — Unit Economics, Business
Valuation, Offer Design & Pricing, Premium Pricing, Bootstrapping; Frameworks — 4
Pilares do CFO, CAC/LTV/Payback Triangle, CEO Scorecards, Book Value vs EBITDA;
Personas — David FilterBuy, Dan Martell, Sabri Suby, Alex Hormozi;
WizardingCode/Strategy/Diagnostico-2026-05 — KPIs por área, target €1M @ 2026-12-31,
threshold €83K/mês.

**Known gap:** PT statutory accounting/tax (IVA, SNC) has no KB coverage — handled via
the external accountant; author a `fiscal-pt` skill once the KB has vetted content.
