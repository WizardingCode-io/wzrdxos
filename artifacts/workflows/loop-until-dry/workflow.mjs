export const meta = {
  name: "loop-until-dry",
  description:
    "Unknown-size discovery: rounds of parallel finders keep searching until K consecutive rounds surface nothing new; every finding deduped against all seen.",
  phases: [{ title: "Find" }],
};

// wzrdxOS quality-pattern workflow (docs/formats.md → Workflows).
// Pass the discovery goal via `args`:
//   { prompt: "what to find", finders?: 3, dryRounds?: 2, maxRounds?: 6 }
// or a plain string (used as the prompt).
// The registry reads `meta` statically and never executes this body.

const FINDINGS_SCHEMA = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          location: { type: "string", description: "file, doc or place" },
          detail: { type: "string" },
        },
        required: ["title", "detail"],
      },
    },
  },
  required: ["findings"],
};

const prompt = typeof args === "string" ? args : (args?.prompt ?? "");
if (!prompt) {
  return { error: "args.prompt is required", found: [], rounds: 0, wentDry: false };
}
const finders = Math.max(1, Math.floor(Number(args?.finders) || 3));
const dryRounds = Math.max(1, Math.floor(Number(args?.dryRounds) || 2));
const maxRounds = Math.max(1, Math.floor(Number(args?.maxRounds) || 6));

const key = (f) => `${f.title}::${f.location ?? ""}`.toLowerCase();
const seen = new Set();
const found = [];
let dry = 0;
let round = 0;

while (dry < dryRounds && round < maxRounds) {
  round += 1;
  const batches = await parallel(
    Array.from({ length: finders }, (_, i) => () =>
      agent(
        `${prompt}\n\nYou are finder ${i + 1} of ${finders} in round ${round}. ` +
          "Take an angle the other finders are unlikely to take. Report every " +
          "distinct finding with a stable title and its location.",
        { label: `find:r${round}:${i + 1}`, phase: "Find", schema: FINDINGS_SCHEMA },
      ),
    ),
  );
  // Dedup against ALL seen (not just confirmed) so rejected repeats never
  // reset the dry counter. Check-and-add per item so same-round duplicates
  // from different finders collapse too.
  const fresh = [];
  for (const f of batches.flatMap((b) => b?.findings ?? [])) {
    const k = key(f);
    if (seen.has(k)) continue;
    seen.add(k);
    fresh.push(f);
  }
  if (fresh.length === 0) {
    dry += 1;
    log(`round ${round}: dry (${dry}/${dryRounds})`);
    continue;
  }
  dry = 0;
  found.push(...fresh);
  log(`round ${round}: ${fresh.length} new findings (${found.length} total)`);
}

const wentDry = dry >= dryRounds;
if (!wentDry) {
  log(`stopped at maxRounds=${maxRounds} before going dry — coverage may be incomplete`);
}
return { found, rounds: round, wentDry };
