export const meta = {
  name: "judge-panel",
  description:
    "Generic multi-judge review: N independent judges score a deliverable or decision from distinct lenses; a synthesis agent merges the verdict.",
  phases: [
    { title: "Judge" },
    { title: "Synthesize" },
  ],
};

// wzrdxOS CQO workflow (org.md Quality section).
// Pass the deliverable or decision via `args`:
//   { subject: "the text or file path to review", lenses?: ["accuracy","clarity","fit-for-purpose"], context?: "optional background" }
// The registry reads `meta` statically and never executes this body.

const JUDGE_SCHEMA = {
  type: "object",
  properties: {
    score: {
      type: "number",
      minimum: 0,
      maximum: 10,
      description: "0-10 quality score from this lens",
    },
    strengths: { type: "array", items: { type: "string" } },
    issues: { type: "array", items: { type: "string" } },
    verdict: { type: "string", enum: ["approve", "fix-first", "reject"] },
  },
  required: ["score", "strengths", "issues", "verdict"],
};

const SYNTH_SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["ship", "fix-first", "escalate"] },
    score: { type: "number", minimum: 0, maximum: 10 },
    mustFix: { type: "array", items: { type: "string" } },
    rationale: { type: "string" },
    dissent: { type: "string" },
  },
  required: ["verdict", "score", "mustFix", "rationale", "dissent"],
};

const subject =
  typeof args === "string" ? args : (args?.subject ?? "");
const lenses =
  Array.isArray(args?.lenses) && args.lenses.length > 0
    ? args.lenses
    : ["accuracy", "clarity", "fit-for-purpose"];
const context =
  typeof args === "object" && args !== null && args.context
    ? `\nContext: ${args.context}`
    : "";

if (!subject) throw new Error("judge-panel requires args.subject");

phase("Judge");
const judges = await parallel(
  lenses.map((lens) => () =>
    agent(
      `You are the ${lens} judge in the wzrdxOS judge-panel review.\n\nKB-first: consult the Knowledge Base (kb_search / kb_ask via ToolSearch) for quality standards relevant to this deliverable or decision before judging.\n\nJudge the following from the ${lens} lens exclusively. Score it 0-10, list strengths, list issues (with specific evidence), and give your verdict.\n\nSubject to judge:\n${subject}${context}`,
      { label: `judge:${lens}`, phase: "Judge", schema: JUDGE_SCHEMA },
    ).then((r) => ({ lens, ...r })),
  ),
);

phase("Synthesize");
const valid = judges.filter(Boolean);
if (valid.length === 0)
  throw new Error("judge-panel: all judge agents failed; cannot synthesize");

const synthesis = await agent(
  `You are the synthesis agent of the wzrdxOS judge-panel review. The following judges evaluated the deliverable or decision:\n\n${JSON.stringify(valid, null, 2)}\n\nSubject: ${subject}${context}\n\nMerge the judges' findings into a single synthesis verdict. Name any dissent between judges explicitly. The mustFix list must contain specific, actionable items (not categories). Map judge verdicts to the synthesis scale: approve→ship, fix-first→fix-first, reject→escalate. If any judge issued "reject", the synthesis must be at least "fix-first" unless you can explicitly rebut the rejection with evidence from the other judges.`,
  { label: "synthesis", phase: "Synthesize", schema: SYNTH_SCHEMA },
);

log(`verdict: ${synthesis.verdict} (score: ${synthesis.score})`);
return { subject, judges: valid, ...synthesis };
