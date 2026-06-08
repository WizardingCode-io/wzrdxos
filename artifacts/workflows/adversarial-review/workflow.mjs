export const meta = {
  name: "adversarial-review",
  description:
    "Review changed code across dimensions, then adversarially verify each finding before reporting.",
  phases: [
    { title: "Review" },
    { title: "Verify" },
  ],
};

// WZRDX reference workflow — the canonical quality pattern.
// find (per dimension) -> adversarially verify each finding -> report only the confirmed.
//
// This is a real Workflow-tool script. The registry reads its `meta` statically
// and never executes the body. See docs/formats.md.

const FINDINGS_SCHEMA = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          file: { type: "string" },
          detail: { type: "string" },
        },
        required: ["title", "file", "detail"],
      },
    },
  },
  required: ["findings"],
};

const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    isReal: { type: "boolean" },
    reason: { type: "string" },
  },
  required: ["isReal", "reason"],
};

const DIMENSIONS = [
  { key: "bugs", prompt: "Review the current diff for correctness bugs." },
  { key: "security", prompt: "Review the current diff for security issues (OWASP)." },
  { key: "simplicity", prompt: "Review the current diff for needless complexity." },
];

const results = await pipeline(
  DIMENSIONS,
  (d) =>
    agent(d.prompt, {
      label: `review:${d.key}`,
      phase: "Review",
      schema: FINDINGS_SCHEMA,
    }),
  (review) =>
    parallel(
      (review?.findings ?? []).map((f) => () =>
        agent(
          `Adversarially verify this finding. Default to isReal=false if uncertain: ${f.title} — ${f.detail}`,
          { label: `verify:${f.file}`, phase: "Verify", schema: VERDICT_SCHEMA },
        ).then((v) => ({ ...f, verdict: v })),
      ),
    ),
);

const confirmed = results
  .flat()
  .filter(Boolean)
  .filter((f) => f.verdict?.isReal);

log(`${confirmed.length} confirmed findings`);

return { confirmed };
