export const meta = {
  name: "multi-modal-sweep",
  description:
    "Exhaustive search via independent angles: one blind agent per mode (by-structure, by-content, by-entity, by-history), merged and deduped with per-mode coverage reporting.",
  phases: [{ title: "Sweep" }, { title: "Merge" }],
};

// wzrdxOS quality-pattern workflow (docs/formats.md → Workflows).
// Pass the search goal via `args`:
//   { goal: "what to find", modes?: ["by-structure", "by-content", ...] }
// or a plain string (used as the goal).
// Each mode agent is blind to the others — diversity catches what a single
// search angle misses. No silent caps: per-mode coverage is always reported.
// The registry reads `meta` statically and never executes this body.

const ITEMS_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          location: { type: "string" },
          detail: { type: "string" },
        },
        required: ["title", "detail"],
      },
    },
    coverage: {
      type: "string",
      description: "what was searched and what was NOT covered by this mode",
    },
  },
  required: ["items", "coverage"],
};

const goal = typeof args === "string" ? args : (args?.goal ?? "");
if (!goal) {
  return { error: "args.goal is required", items: [], coverage: [] };
}
const modes =
  Array.isArray(args?.modes) && args.modes.length > 0
    ? args.modes
    : ["by-structure", "by-content", "by-entity", "by-history"];

// Barrier justified: the merge/dedup needs ALL sweep results together.
const sweeps = await parallel(
  modes.map((mode) => () =>
    agent(
      `${goal}\n\nSearch ONLY through the "${mode}" angle. Do not attempt other ` +
        "angles — other agents cover those. Report every item you find and " +
        "state explicitly what your angle could NOT cover.",
      { label: `sweep:${mode}`, phase: "Sweep", schema: ITEMS_SCHEMA },
    ).then((r) => ({ mode, items: r?.items ?? [], coverage: r?.coverage ?? "agent failed" })),
  ),
);

const seen = new Set();
const items = [];
let duplicates = 0;
for (const s of sweeps.filter(Boolean)) {
  for (const it of s.items) {
    const k = `${it.title}::${it.location ?? ""}`.toLowerCase();
    if (seen.has(k)) {
      duplicates += 1;
      continue;
    }
    seen.add(k);
    items.push({ ...it, mode: s.mode });
  }
}

const coverage = sweeps
  .filter(Boolean)
  .map((s) => ({ mode: s.mode, found: s.items.length, coverage: s.coverage }));
log(`${items.length} unique items across ${modes.length} modes (${duplicates} duplicates merged)`);

return { items, coverage };
