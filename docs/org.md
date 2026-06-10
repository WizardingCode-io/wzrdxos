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

## 1 — CEO / Administração ✅ defined · 🚀 implemented (pilot)

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

## 2 — Operações (COO) ✅ defined · 🚀 implemented (phase 1)

**Purpose:** the execution engine. Receives the CEO's go and orchestrates the product
lifecycle flow; turns the founder's tacit knowledge into systems, processes, and
metrics. Includes Planeamento (PM/PO).

**Head:** COO (double-hats from CEO/Administração).

**Responsibilities:**
- Orchestrate the **product lifecycle flow** after the CEO go/no-go — decides flows and
  department responsibilities for each initiative.
- Product management / ownership: continuous discovery, backlog, prioritisation,
  sprint cadence.
- **SOPs/POPs**: process documentation, delegation matrix, systems — the direct
  antidote to the "extreme centralisation" pattern (Diagnostico-2026-05, score 28.4/100).
- Workflow automation (n8n, Zapier, AI agents) and internal tooling.
- Client onboarding and operational client management; CRM hygiene.
- Operational KPIs (the 25 from the Diagnostico — 5 per area), weekly dashboard and
  rituals (Friday 17h review); feeds the CEO scorecard alongside the CFO.
- Capacity planning and team onboarding (60-day plan, with CHRO).

**Does NOT:** strategy/go-no-go (CEO), technical implementation (Engenharia), selling
(Growth), people policy (CHRO).

### COO (head) — toolbox

**Skills**
- `xlsx` — operational dashboards, KPIs, capacity, planning (very high)
- `schedule` — routine automation: daily ops briefing, weekly report (very high — the
  operating leverage tool)
- `pptx` — operational reviews (QBR), board presentations (high)
- `docx` — SOPs, runbooks, policies, memos (high)
- `deep-research` — vendor evaluation, process benchmarking, market research (high)
- `pdf` — read/extract vendor contracts and documents (medium-high)
- adapt (🔄): `sop-create`, `workflow-automate`, `n8n-flow`, `zapier-flow`, `agile-po`,
  `sprint-plan`, `backlog-groom`, `kanban-setup`, `okr-cadence`, `meeting-optimize`,
  `onboarding-design`, `customer-journey`, `delegation-matrix`, `discovery-plan`,
  `roadmap-build`, `metrics-track`
- new (🆕 — mined from the Obsidian KB; strongest coverage of any department, anchored
  on a real case study):
  - `ops-roadmap-diagnose` — 5-area diagnostic + custom 90-day roadmap
    (Documentar → Medir → Delegar), from the real Diagnostico WizardingCode 2026-05
  - `pop-builder` — process inventory + POP generation; 3 ready templates in the vault
    (lead intake, client onboarding D14, monthly close)
  - `kpi-system` — the 25 KPIs with baselines, alerts, weekly rituals
  - `delegation-audit` — Estratégico×Delegável matrix, hiring-failure pattern analysis,
    first-hire profile (Dan Martell — 92% rule, director-not-doer)
  - `onboarding-60d` — observe → do together → supervised → autonomous
  - `automation-discovery` — map workflows to n8n/Zapier/AI agents with ROI estimate
  - `discovery-cadence` — Teresa Torres Continuous Discovery Habits (PM/PO side)

**Plugins / MCPs**
- `wzrdx-kb` (KB-first, mandatory) · company profile (`wzrdx company`)
- **Productivity** (Anthropic, knowledge-work-plugins) — the anchor: persistent tasks,
  workplace memory, dashboard, `/start` / `/update`
- **data** (Anthropic, knowledge-work-plugins) — analytics/KPI dashboards over
  operational data
- **Small Business** (Anthropic) — shared with Financeiro: COO uses the ops subset
  (`/monday-brief`, CRM hygiene, customer follow-ups); CFO owns the money subset
- Cross-references: Human Resources → CHRO · Finance → CFO · Marketing → CMO (each
  defined in its own section)

**KB sources (vault `~/Documents/Personal`):**
WizardingCode/Strategy/Diagnostico-2026-05 (6 docs — diagnostic, 90-day roadmap, POP
templates, 25 KPIs); Projects/ArkaOS/KB Areas — Area 10 Operações & Automação, Area 07
Organização & Equipas, Area 09 Project Management; Personas — Dan Martell (the modern
AI-COO blueprint), Alex Hormozi (90% autonomous ops), Teresa Torres + Marty Cagan
(product side), Patrick Lencioni (org health).

**Known gaps:** operational recruitment/hiring playbook (belongs to CHRO), CRM
(HubSpot) implementation guide, capacity planning for scaling 1 → 5-10 people — author
when vetted content exists.

---

## 3 — Engenharia / Tecnologia (CTO) ✅ defined

**Purpose:** technical direction and execution quality. Owns every line of code, every
architecture decision, and the engineering cost structure of running an agentic OS.

**Head:** CTO (double-hats from CEO/Administração).

**Responsibilities:**
- Final technical authority: architecture, stack choices, build-vs-buy, ADRs/decision
  records (kept in the repo `docs/` — the technical source of truth).
- Code quality standards, code review gates, tech debt management.
- Technical security (OWASP, AI security — prompt injection, tool abuse, agent
  permissions) and technical compliance.
- DevOps/CI/CD, infrastructure, observability, and **cost management** — cloud + tokens
  (model selection matrix, caching, fallbacks, model-agnostic routing).
- Agentic engineering — the wzrdxOS core: agent architecture, MCP strategy,
  multi-runtime support.
- Spec-driven: no code without an approved spec (Constitution: document-first).

**Does NOT:** set product priorities alone (CEO + Operações), strategic go/no-go (CEO
deliberation gate).

### CTO (head) — toolbox

**Skills**
- `security-review` — security review of changes on the current branch (very high)
- `review` / `code-review` — PR review with confidence-filtered findings (very high)
- `init` — generate/maintain CLAUDE.md codebase docs — onboarding & context (high)
- `deep-research` — technology/vendor evaluation, build-vs-buy, verified benchmarking (high)
- `pptx` / `docx` — tech strategy decks for the board, formal RFCs/specs (high)
- `schedule` — recurring automation (e.g. weekly security/quality report) (medium)
- adapt (🔄): `architecture-design`, `api-design`, `clean-code-review`,
  `adversarial-review`, `security-audit`, `ai-security`, `tech-debt`, `ci-cd-pipeline`,
  `db-design`, `observability`, `stack-check`, `mcp-builder`, `agent-design`,
  `agent-workflow`, `rag-architect`, `tdd-cycle`, `dependency-audit`,
  `performance-audit`, `cto-advisor`
- new (🆕 — mined from the Obsidian KB, authored via skill-creator):
  - `ai-agent-architecture` — orchestration patterns (sequential / hierarchical /
    graph / swarm), Claude Managed Agents, context engineering
  - `mcp-integrator` — "MCP as USB-C" framework (DDias Matt), 20-30 connector patterns
  - `tech-stack-eval` — Vue 3.6 / Nuxt 4 / Laravel 13 (2026), model-agnostic routing
    (Codex vs Claude), vendor risk
  - `aios-operating-model` — Liam Ottley 5-Layer Framework, `/new-employee` pattern
  - `spec-driven-development` — SDD + multi-agent memory layers (reinforces doctrine)
  - `token-cost-optimization` — synthesis of Harness Pattern + Tokens-as-Currency KB
    fragments

**Plugins / MCPs**
- `wzrdx-kb` (KB-first, mandatory) · company profile (`wzrdx company`)
- **Engineering** (Anthropic, knowledge-work-plugins) — standups, ADR drafting,
  incident post-mortems, technical docs
- **Code Review** (Anthropic) — multi-agent PR review, confidence-based filtering
- **Security Guidance** (Anthropic) — pre-tool hook warning on unsafe code patterns
  (command injection, XSS, eval, pickle)
- **Context7** — live version-specific library docs (already in use)
- **Superpowers** — TDD, debugging, planning discipline (already installed)
- GitHub MCP — repo/PR operations
- Optional: **Qodo Skills** (3rd-party — requires Qodo platform) — repo-specific coding
  rules + PR issue resolver; adopt if/when a Qodo account exists
- Note: **Productivity** (Anthropic) stays mapped to Operações (per CEO section);
  Engenharia consumes its task/memory layer via Ops.

**KB sources (vault `~/Documents/Personal`):** Topics — Agentic Development, AI
Operating Systems, Claude Code Mastery, MCP, Custom Software & Vertical AI, Vue &
Laravel Ecosystem 2026, Anti-Vibe-Coding, Codex; Frameworks — MCP USB Universal,
Claude Managed Agents Architecture, Harness Pattern Token Optimization (+8 with
"Implications para ArkaOS" — AIOX competitive intel); Personas — Liam Ottley, DDias
Matt, Alani Nicolas (competitor), David FilterBuy, Marty Cagan.

**Known gaps:** the vault has no internal wzrdxOS architecture specs (repo `docs/` is
the source of truth — CTO owns keeping ADRs there) and no KB coverage of CI/CD for
agents, security/observability of agentic systems, or technical hiring — author those
skills only once vetted content exists.

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

---

## 5 — Recursos Humanos (CHRO) ✅ defined

**Purpose:** people, culture and the founder's transition from doer to leader. Owns
the full talent lifecycle. Immediate mission: **make the first autonomous hire work**
(after 5 failed attempts) — D61-D90 hire + 60-day onboarding, autonomous by D180
(24-Oct-2026 per the Diagnostico roadmap).

**Head:** CHRO (double-hats from CEO/Administração).

**Responsibilities:**
- Recruitment: hiring criteria ("contrate por atitude, treine habilidades"), job
  descriptions, structured selection (8+ candidates, case study, Interview-to-Learn).
- Onboarding 60-90 days: observe → do together → supervised → autonomous, with
  weekly checkpoints (executes with COO).
- Culture: mission/vision/values (none documented today — Cultura 25/100), rituals,
  team health (Lencioni), internal NPS ≥ 8.
- Leadership development: structured 1:1s, feedback (praise public / correct private),
  progressive delegation, intermediate leadership.
- Compensation & careers: salary bands, talent levels, results participation,
  growth plans; PT market benchmarking via research.
- Founder unblocking: perfectionism, fear of losing control, indispensability —
  mentoring/coaching cadence (the Diagnostico's root constraint).

**Does NOT:** legal/labour contracts and RGPD compliance (external lawyer — wzrdxOS
prepares, never files), operational task assignment (COO), firing decisions alone
(CEO gate).

### CHRO (head) — toolbox

**Skills**
- `xlsx` — compensation models, headcount plans, KPI tracking (high)
- `docx` — policies, handbooks, job descriptions, offer letters (high)
- `pptx` — people decks for the board (medium-high)
- `deep-research` — PT salary benchmarking, best-practice research (medium-high)
- `schedule` — recurring people reports, 1:1/review cadence (medium-high)
- adapt (🔄): `hiring-plan`, `onboarding-design`, `compensation-plan`,
  `culture-define`, `culture-audit`, `performance-review`, `feedback-give`,
  `team-assess`, `team-health`, `disc-assess`, `leadership`, `conflict-resolve`,
  `org-design`, `delegation-matrix` (shared with COO)
- new (🆕 — mined from the Obsidian KB):
  - `hiring-pipeline` — Interview-to-Learn (David FilterBuy) + First-Week Leadership
    Diagnostic (Hormozi) + Sams 5 Rules (hire slow, fire fast); includes postmortem of
    the 5 failed hires (Diagnostico D21)
  - `onboarding-60d` — shared with COO: shadowing → pair → supervised → autonomous,
    three-repetition rule, interrupt-correct-repeat coaching loop
  - `delegation-coach` — Buyback Rate formula, No-How-To Delegation,
    Standards-Not-Presence, Teach-Don't-Do identity shift (Dan Martell)
  - `culture-foundation` — mission/vision/values workshop + Five Dysfunctions
    (Lencioni), Netflix talent density, Collect People Doctrine (Sabri Suby)
  - `comp-ladder` — Talent Levels Ladder ($50K→$1M tiers), talent-debt concept,
    decision-budget ladder ($50 Fix-It Rule)
  - `founder-transition` — psychological blockers protocol + "80% by others > 100%
    alone" + Leader vs Manager Insecurity Test

**Plugins / MCPs**
- `wzrdx-kb` (KB-first, mandatory) · company profile (`wzrdx company`)
- **Human Resources** (Anthropic, knowledge-work-plugins) — the anchor:
  `/hr:onboarding`, `/hr:draft-offer`, `/hr:performance-review`, `/hr:comp-analysis`,
  `/hr:people-report`; connectors Gmail/Slack/Calendar/Notion/DocuSign
- **data** (Anthropic) — shared: people analytics (turnover, headcount)
- **claude-skills** (alirezarezvani, MIT, 338 skills) — cherry-pick the C-level
  advisory (66 skills incl. CHRO), org design, compliance subsets.
  Install: `/plugin marketplace add alirezarezvani/claude-skills`
- **hr-skills** (tuanductran, MIT) — dedicated HR/TA skills incl. technical
  recruiting per role (backend, frontend, AI, ...); small but active — vet and adopt
  selectively
- Rejected: **JobPilot** (suxrobGM) — candidate-side job-application automation, not
  a recruiter tool; does not fit CHRO.

**KB sources (vault `~/Documents/Personal`):**
WizardingCode/Strategy/Diagnostico-2026-05 (Cultura 25/100, 5 failed hires, founder
blockers, D1-D180 roadmap); Topics — Hiring & Talent Acquisition, Team Building &
Management, Team Culture & Office Rituals, Investing in People; Frameworks —
Interview-to-Learn, First-Week Leadership Diagnostic, Buyback Rate, No-How-To
Delegation, Standards-Not-Presence, Sams 5 Rules, Collect People Doctrine, Talent
Levels Ladder, Millionaires Build Systems / Billionaires Build People; ArkaOS KB Area
07 (Lencioni, Hastings, Skelton/Pais, Dalio, Horowitz); Personas — Dan Martell
(people-builder blueprint), Alex Hormozi, Sabri Suby, David FilterBuy, Simon Squibb.

**Known gaps:** PT labour-law/contracts/equity-vesting and RGPD-in-hiring (external
lawyer; no KB content), PT salary benchmarks (use deep-research per hire), DISC/
personality instruments (no KB coverage — adapt the generic arka skill), succession
planning (post-D180 concern).

---

## 6 — Comunicação & Marketing (CMO) ✅ defined

**Purpose:** the voice and the demand engine. Owns brand, positioning, content,
campaigns and marketing performance. Includes **Brand & Design**.

**Head:** CMO (double-hats from CEO/Administração).

**Responsibilities:**
- Brand strategy and identity: positioning, naming, archetypes, verbal + visual
  identity. Immediate mission: **execute Rebranding-2026-06** (9 docs in the vault,
  decisions D1-D7 pending).
- Content engine: pillars, editorial calendar, YouTube/short-form, newsletter,
  repurposing (pillar → derivatives).
- Copywriting and offers: landing pages, e-mail sequences, offer architecture.
- SEO **and GEO/AEO** (2026): traditional search as floor, AI-engine citation as
  ceiling (Two-Boards doctrine); Citation-as-KPI reporting.
- Campaign planning and paid media (when active); marketing performance reporting —
  raise the Marketing area from 25/100 (Diagnostico) with real KPIs (MQLs, CAC,
  engagement).
- Competitive/positioning intel in coordination with CEO (AIOX watch).

**Does NOT:** close deals (Growth/Vendas), set product priorities (CEO + Operações),
implement web/code (Engenharia — CMO specifies, Eng builds).

### CMO (head) — toolbox

**Skills**
- `pptx` / `docx` — board/campaign decks, positioning docs, briefs (high)
- `deep-research` — cited market research, competitor briefs (high)
- `schedule` — recurring performance reports, content cadence (medium-high)
- `xlsx` — marketing KPI dashboard, campaign budgets (medium)
- adapt (🔄): `brand`, `marketing`, `content`, `copy-framework`, `headline-write`,
  `hook-write`, `email-sequence`, `seo-audit`, `calendar-plan`, `social-strategy`,
  `paid-campaign`, `landing-gen`, `funnel-design`, `persona-build`,
  `awareness-diagnose`, `archetype-finder`, `primal-audit`, `voice-guide`,
  `positioning-statement`, `naming-evaluate`, `gtm-strategy`, `launch-sequence`,
  `repurpose-plan`, `youtube-strategy`, `short-form`, `newsletter-write`,
  `analytics-report`, `competitor-analysis`
- new (🆕 — mined from the Obsidian KB; 58+ marketing/brand frameworks available):
  - `rebranding-execution` — drive the Rebranding-2026-06 roadmap (naming D1-D7,
    brand architecture Casa Única, verbal identity PT/EN, 4 visual directions)
  - `geo-content` — Neil Patel GEO: Definitive/Structured/Quotable content,
    Citation-as-KPI, Two-Boards (Google floor + AI engines ceiling)
  - `offer-architecture` — Hormozi Grand Slam Offer + Sabri 17-step sales message
  - `hook-viral-system` — 7 hook types + STEPPS virality checklist (Berger)
  - `status-engineering` — "sell status, not stuff" premium positioning (Sabri Suby)

**Plugins / MCPs**
- `wzrdx-kb` (KB-first, mandatory) · company profile (`wzrdx company`)
- **Marketing** (Anthropic, knowledge-work-plugins) — the anchor: `/draft-content`,
  `/campaign-plan`, `/brand-review` (enforces brand voice), `/competitive-brief`,
  `/performance-report`, `/seo-audit`, `/email-sequence`
- **data** (Anthropic) — shared with Operações: campaign/funnel analytics
- **Marketing Skills Library** (Corey Haines, MIT, ~50 skills) — adopt: CRO,
  copywriting, ads, programmatic-seo, marketing-psychology, pricing, launch.
  Install: `npx skills add coreyhaines31/marketingskills`
- Curated third-party (from composio.dev/content/best-marketing-skills — vet each repo
  before install, doctrine: no unreviewed third-party prompts):
  - GEO/AEO skills (Zubair Trabzada / Aaron He Zhu) — complements `geo-content`
  - Humanizer (jpeggdev) — de-AI-ify output before publishing
  - Email Marketing Bible (CosmoBlk) — lifecycle flows when e-mail channel activates
  - Claude Ads Audit (AgriciDaniel, 250+ checks) — defer until paid ads run
  - Context-Link marketplace (~80 marketing skills) — browse-only source, cherry-pick

**KB sources (vault `~/Documents/Personal`):**
WizardingCode/Strategy/Rebranding-2026-06 (9 docs — audit, naming, positioning v2,
brand architecture, verbal identity, channels, 90-day roadmap, visual directions);
Projects/ArkaOS/KB Areas — 01 Branding, 02 Design, 05 Marketing & Growth, 06 GTM,
14 Landing Pages, 16 Conteúdo & Viralização; Frameworks — Primal Branding, StoryBrand
SB7, 12 Archetypes, NUEPH, STEPPS, Hook Architecture, GEO/Citation-as-KPI, Grand Slam
Offer; Personas — Alex Hormozi (169 fontes), Sabri Suby, Russell Brunson, Neil Patel.

**Known gaps:** WizardingCode ICPs/customer personas (none documented), editorial
calendar and content ops (zero), tested copy/headlines for wzrdx, marketing KPI
dashboard (area at 25/100), and no Brand & Design specialist persona in the KB —
author these as operational docs first, skills after.
