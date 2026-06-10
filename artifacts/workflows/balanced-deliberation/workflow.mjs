export const meta = {
  name: "balanced-deliberation",
  description:
    "CEO decision gate: optimist, conservative and risk-taker lenses deliberate in parallel; a synthesis agent reaches equilibrium and issues go / no-go / revise.",
  phases: [
    { title: "Lenses" },
    { title: "Equilibrium" },
  ],
};

// wzrdxOS CEO workflow (org.md §1). Pass the decision via `args`:
//   { decision: "Should wzrdx build X?", context: "optional background" }
// The registry reads `meta` statically and never executes this body.

const LENS_SCHEMA = {
  type: "object",
  properties: {
    position: { type: "string" },
    keyArguments: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    opportunities: { type: "array", items: { type: "string" } },
    score: { type: "number", minimum: 0, maximum: 10, description: "0-10 support for proceeding" },
  },
  required: ["position", "keyArguments", "risks", "opportunities", "score"],
};

const DECISION_SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["go", "no-go", "revise"] },
    rationale: { type: "string" },
    conditions: { type: "array", items: { type: "string" } },
    dissent: { type: "string", description: "where the lenses disagreed and why" },
  },
  required: ["verdict", "rationale", "conditions", "dissent"],
};

const decision = typeof args === "string" ? args : (args?.decision ?? "");
const context =
  typeof args === "object" && args !== null && args.context
    ? `\nContext: ${args.context}`
    : "";
if (!decision) throw new Error("balanced-deliberation requires args.decision");

const LENSES = [
  {
    key: "optimist",
    prompt:
      "You are the OPTIMIST lens of the wzrdxOS CEO deliberation. Argue the full potential: upside, growth, strategic positioning. Be concrete, not cheerleading.",
  },
  {
    key: "conservative",
    prompt:
      "You are the PESSIMIST / CONSERVATIVE MASTER lens of the wzrdxOS CEO deliberation. Weigh everything: risks, costs, failure modes, pros and cons. You are rigorous, not negative by default.",
  },
  {
    key: "risk-taker",
    prompt:
      "You are the DYNAMIC / RISK-TAKER lens of the wzrdxOS CEO deliberation. Argue the bold opportunity: what aggressive move wins the market, what is lost by hesitating.",
  },
];

phase("Lenses");
const lenses = await parallel(
  LENSES.map((l) => () =>
    agent(
      `${l.prompt}\n\nFirst consult the Knowledge Base (kb_search / kb_ask via ToolSearch) for relevant prior knowledge. Then deliberate.\n\nDecision under deliberation: ${decision}${context}`,
      { label: `lens:${l.key}`, phase: "Lenses", schema: LENS_SCHEMA },
    ).then((r) => ({ lens: l.key, ...r })),
  ),
);

phase("Equilibrium");
const valid = lenses.filter(Boolean);
if (valid.length === 0) throw new Error("balanced-deliberation: all lens agents failed; cannot synthesize");
const synthesis = await agent(
  `You are the EQUILIBRIUM synthesizer of the wzrdxOS CEO deliberation. Three lenses analysed this decision:\n\n${JSON.stringify(valid, null, 2)}\n\nDecision: ${decision}${context}\n\nWeigh the lenses against each other, name the dissent explicitly, and issue the verdict (go / no-go / revise with conditions). The conservative lens's risks must be either accepted with rationale or converted into conditions.`,
  { label: "equilibrium", phase: "Equilibrium", schema: DECISION_SCHEMA },
);

log(`verdict: ${synthesis.verdict}`);
return { decision, lenses: valid, ...synthesis };
