# M5 — Workflow library + SDD soft-gate — Design

- **Status:** Draft (pending user review)
- **Date:** 2026-07-02
- **Milestone:** M5 (roadmap: "Workflow library — quality patterns")
- **Decisions taken during brainstorming:** SDD gate = hook **não-bloqueante**
  (user-approved); âmbito = padrões de qualidade **+ product-lifecycle**
  (user-approved); lifecycle = **skill + estado em ficheiro** (recomendação
  assumida — utilizador AFK; revisitar na revisão).

## Problema

Três lacunas identificadas no fecho do M4:

1. `docs/formats.md` enumera cinco padrões de qualidade para a biblioteca de
   workflows; só dois existem (`adversarial-review`, `judge-panel`, mais
   `balanced-deliberation`). Faltam **loop-until-dry**, **multi-modal sweep**
   e **completeness critic**.
2. O **product-lifecycle-flow** (CEO→Operações→Eng/Marketing→Quality→launch→
   monitor) está definido na memória do projeto e em `docs/org.md` como o fluxo
   cross-departamental central, mas não existe como artefacto executável.
3. **Finding C1** (`docs/eval-baseline.md`): o gate SDD não dispara de forma
   fiável por trigger de descrição (5/10 no baseline) — o mecanismo de triggers
   ativa capacidades, não bloqueia ações. Precisa de interceção PreToolUse.
   Em tensão direta com a flow policy ("never ships blocking enforcement
   hooks", `docs/formats.md`).

## Decisão central: SDD soft-gate (resolve C1 sem violar a flow policy)

Um PreToolUse hook em `Edit|Write|MultiEdit` que **nunca bloqueia**: quando
deteta implementação sem spec, injeta contexto ("não existe spec aprovado para
este trabalho — considera `eng:spec-driven-development` primeiro") e **permite
sempre** a ação. A flow policy proíbe hooks *bloqueantes*; um lembrete
não-bloqueante no momento exato da edição é enforcement "nativo e inteligente",
exatamente o que o princípio 2 do roadmap pede.

### Comportamento do hook

- **Evento:** `PreToolUse` matcher `Edit|Write|MultiEdit`.
- **Deteção:** dispara só quando (a) o ficheiro alvo é código (allowlist de
  extensões: ts/js/py/php/vue/mjs/etc.; exclui md/json/yml/txt), e (b) não há
  evidência de spec — regra determinística: nenhum ficheiro `SPEC-*` ou
  `*-design.md` sob `docs/specs/` ou `docs/superpowers/specs/` do projeto foi
  modificado nos últimos 7 dias (mtime), e o marcador de sessão ainda não existe.
- **Uma vez por sessão:** guarda um marcador (keyed pelo `session_id` do stdin
  JSON do hook) em `~/.claude/wzrdx/state/`; nunca repete o aviso na mesma
  sessão. Low-friction por construção.
- **Saída:** JSON `permissionDecision: "allow"` + `permissionDecisionReason`
  com o lembrete (ou `additionalContext`). **Nunca** `deny`/`ask`.
- **Fail-open:** qualquer erro interno → exit 0 sem output. O hook nunca pode
  partir a edição do utilizador.
- **Implementação:** script Node único sem dependências
  (`artifacts/hooks/sdd-gate/hook.mjs`) — o repo já exige Node.

### Novo tipo de artefacto: hooks

- `artifacts/hooks/<name>/hook.mjs` + `hook.json` (manifest: `name`,
  `description`, `event`, `matcher`).
- Registry (`loader.ts`) aprende a ler hooks; `docs/formats.md` ganha a secção
  "Hooks", incluindo a regra: **hooks wzrdx são sempre não-bloqueantes** —
  a flow policy passa a dizê-lo explicitamente.
- **Deploy** (`artifact-install.ts`): script → `~/.claude/wzrdx/hooks/<name>.mjs`;
  entrada de hook em `~/.claude/settings.json` via **merge idempotente marcado**
  (chave/comentário `wzrdx-managed`): só toca nas entradas wzrdx, nunca nas do
  utilizador; re-executar `wzrdx setup`/`update` atualiza sem duplicar.
  (Exceção documentada ao "never touch user files": settings.json é o único
  local onde o Claude Code lê hooks; o merge é cirúrgico e reversível.)

## Padrões de qualidade — 3 novos workflows `.mjs`

Seguem as convenções de `adversarial-review` (meta pure-literal, schemas
JSON, `args` para parametrização, registry lê estaticamente):

1. **`loop-until-dry`** — descoberta de tamanho desconhecido (bugs, gaps,
   edge-cases). Rondas de finders em paralelo; dedup contra `seen` (não contra
   confirmados); termina após K rondas consecutivas sem novidade (default 2).
   `args`: `{ prompt, finders?, dryRounds? }`.
2. **`multi-modal-sweep`** — pesquisa exaustiva por ângulos independentes
   (por-container, por-conteúdo, por-entidade, por-tempo — ou ângulos passados
   em `args.modes`). Cada agente é cego aos outros; merge + dedup no fim;
   reporta cobertura por modo (no silent caps).
3. **`completeness-critic`** — crítico final para qualquer entregável:
   "o que falta — modo não corrido, afirmação não verificada, fonte não lida?"
   Output estruturado = próxima ronda de trabalho. Desenhado para ser invocado
   como último passo pelos outros workflows/skills (deliverable-review,
   daily-digest).

## Product-lifecycle-flow — skill orquestrador + estado em ficheiro

- **Artefacto:** skill `core:product-lifecycle` (type: process), com
  `evals.json` (obrigatório desde M4) e `trigger_eval.json`.
- **Estado document-first:** `docs/lifecycle/<product-slug>.md` no projeto do
  utilizador — frontmatter com máquina de estados (fase atual, gates, vereditos,
  datas) + corpo legível. Retomável entre sessões; ingerível no KB (doctrine
  enrichment).
- **Fases e gates** (de `docs/org.md` / memória do projeto):
  1. **CEO gate** — `ceo:initiative-eval` + workflow `balanced-deliberation`
     → go/no-go registado.
  2. **Operações** — COO: task-breakdown, POPs, KPIs de lançamento.
  3. **Build** — Eng (com SDD gate — o hook deste milestone cobre esta fase)
     e Marketing em paralelo.
  4. **Quality gate** — `core:deliverable-review` + workflow
     `adversarial-review`; veto CQO.
  5. **Launch** — checklist de lançamento; comunicação.
  6. **Monitor** — KPIs para `fin:metrics-dashboard`; retro alimenta o KB.
- O skill lê o estado, anuncia a fase, executa/delega a fase corrente, atualiza
  o estado, e para no gate seguinte. Nunca salta gates; nunca bloqueia com
  hooks — o gate é o próprio fluxo (flow policy respeitada).

## Testes e medição

- **Registry contract test** (CI) estendido: hooks aparecem no registry; novos
  workflows têm meta estaticamente parseável; skill nova tem `evals.json`.
- **Hook:** testes unitários Node da lógica de decisão (é-código?, há-spec?,
  once-per-session, fail-open com stdin malformado).
- **Medição C1:** re-correr `scripts/trigger_eval.py` para
  `eng:spec-driven-development` com o hook ativo; critério de aceitação:
  gate-behaviour ≥ 8/10 should-trigger (baseline: 5/10). Se o runner não
  conseguir observar o hook, medição manual documentada em
  `docs/eval-baseline.md` (secção M5).

## Fora de âmbito (YAGNI)

- Functional with/without benchmark (continua deferido — precisa de env isolado).
- Deploy de hooks para runtimes não-Claude-Code (futuro, como os restantes
  artefactos — `docs/runtimes.md`).
- Pruning de artefactos removidos (limitação conhecida pré-existente).
- Daily-intelligence como workflow .mjs (já coberto por skills kb_digest/kb_enrich).

## Entrega

Branch `feat/m5-workflows` → PR único para `main` (padrão dos milestones
anteriores), com atualização de `docs/roadmap.md`, `docs/formats.md`,
`docs/org.md` e `docs/eval-baseline.md`.
