export const meta = {
  name: "completeness-critic",
  description:
    "Final completeness check on any deliverable: parallel critics ask what is missing — work not run, claims unverified, sources unread. Output is the next round of work.",
  phases: [{ title: "Critique" }],
};

// wzrdxOS quality-pattern workflow (docs/formats.md → Workflows).
// Pass the deliverable via `args`:
//   { deliverable: "text or file path", context?: "what the deliverable is for" }
// or a plain string (used as the deliverable).
// Designed to run as the LAST step of other workflows and skills
// (deliverable-review, daily-digest): what it finds becomes the next round.
// The registry reads `meta` statically and never executes this body.

const GAPS_SCHEMA = {
  type: "object",
  properties: {
    gaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["missing-work", "unverified-claim", "unread-source", "other"],
          },
          description: { type: "string" },
          suggestedAction: { type: "string" },
        },
        required: ["type", "description", "suggestedAction"],
      },
    },
  },
  required: ["gaps"],
};

const deliverable = typeof args === "string" ? args : (args?.deliverable ?? "");
if (!deliverable) {
  return { error: "args.deliverable is required", gaps: [], complete: false };
}
const context = typeof args?.context === "string" ? args.context : "";

const LENSES = [
  {
    key: "missing-work",
    prompt:
      "What work is missing? A step never run, an angle never searched, a case never tested, a section never written.",
  },
  {
    key: "unverified-claims",
    prompt:
      "Which claims are unverified? Numbers not double-checked, statements without evidence, conclusions that do not follow from what was actually done.",
  },
  {
    key: "unread-sources",
    prompt:
      "Which sources were cited, referenced or obviously relevant but never actually read or consulted?",
  },
];

const critiques = await parallel(
  LENSES.map((lens) => () =>
    agent(
      `You are a completeness critic reviewing a deliverable through one lens only.\n\n` +
        `Lens: ${lens.prompt}\n\n` +
        (context ? `Context: ${context}\n\n` : "") +
        `Deliverable:\n${deliverable}\n\n` +
        "Report only genuine gaps — an empty list is a valid answer. For each gap, " +
        "state the concrete next action that would close it.",
      { label: `critic:${lens.key}`, phase: "Critique", schema: GAPS_SCHEMA },
    ),
  ),
);

const seen = new Set();
const gaps = [];
for (const g of critiques.flatMap((c) => c?.gaps ?? [])) {
  const k = g.description.toLowerCase();
  if (seen.has(k)) continue;
  seen.add(k);
  gaps.push(g);
}

log(gaps.length === 0 ? "no gaps found — deliverable is complete" : `${gaps.length} gaps found`);
return { gaps, complete: gaps.length === 0 };
