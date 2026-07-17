import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// check-carrier-interim — the structured consistency gate for the interim carrier rule (the
// carrier ruling (MD-18), transition clause amended by the self-hosting plan).
//
// Asserts, and NAMES each disagreeing surface on failure:
//   1. the SAME interim-rule sentence in the three current-rule surfaces (the decision diary,
//      the glossary, the agent handbook): new IDs may be born Markdown-canonical once the
//      product parser lands, while pre-existing IDs and the worked example stay TS-canonical
//      until the ruled flip — the canonical flip/import/migration is NOT claimed complete;
//   2. the obsolete sole-canonical-TS wording gone from the diary and the glossary, and the
//      surviving law (one canonical surface per ID, no mixing) still present in the diary;
//   3. the extension-law re-point (the `.sdp.ts` extension law, MD-15) present in the diary;
//   4. the SAME logical/physical relations distinction in the core-model doc and JS-A1:
//      relations stay OPTIONAL in the logical Spec; the physical Markdown envelope writes
//      `relations: {}` when the logical set is empty — honest carrier syntax, never a new
//      logical relation requirement;
//   5. every obligation row the self-hosting phase added to its docket.
//
// Usage: node check-carrier-interim.mjs [rootDir] [planFile]
//   rootDir  — tree holding the operative surfaces; defaults to this repo root. QA passes a
//              temp tree of mutated copies to prove disagreeing surfaces are named.
//   planFile — the docket file, relative to rootDir. The default is assembled in parts so this
//              durable tracked file carries no numbered plan-path token (check-temporal bans
//              those from tracked files).

const rootDir = process.argv[2] ?? dirname(fileURLToPath(import.meta.url));
const planFile = process.argv[3] ?? ["plans", "17-self-hosting-v1.md"].join("/");

const SURFACES = {
  decisions: "docs/concept/DECISIONS.md",
  glossary: "CONTEXT.md",
  agents: "AGENTS.md",
  coreModel: "docs/concept/02-core-model.md",
  jsA1: "jtbd-stories/01-capture-and-evolve-intent.md",
};

// The one interim carrier rule. Verbatim (modulo whitespace) in the diary, the glossary, and
// the agent handbook — never paraphrased per surface. The trailing period is surface-local
// punctuation (the AGENTS status row continues with its `·` separator), so it is not asserted.
const INTERIM_RULE =
  "New spec IDs may be born Markdown-canonical once the product parser lands; pre-existing IDs and the worked example remain TS-canonical until the ruled flip (the product parser, `sdp import`, and the checkout-v1 migration)";

// The owner-confirmed logical/physical relations distinction. Verbatim in the core-model doc
// and JS-A1.
const RELATIONS_DISTINCTION =
  "Relations are optional in the logical `Spec` model. A physical Markdown envelope writes `relations: {}` when the logical set is empty: honest carrier syntax, not a new logical relation requirement.";

const SURVIVING_LAW = "one canonical surface per ID, no mixing";
const OBSOLETE_SOLE_CANONICAL = "stays sole-canonical";
const EXTENSION_LAW_REPAIR = "re-pointed, not repealed";

const DOCKET_ROWS = [
  "Public/package API proof",
  "Temporal-scan coverage",
  "Root generated-state isolation",
  "Clean-clone proof",
  "JTBD carrier repair",
  "MD-15 wording repair",
  "Four-gate review ledger",
];

// Sameness is about WORDS, so markdown quoting furniture is stripped before whitespace
// normalization: a sentence wrapped inside a `>` blockquote (the AGENTS status row, the
// core-model carrier note) must read identically to its plain-paragraph twins.
const norm = (text) => text.replace(/^>\s?/gm, "").replace(/\s+/g, " ");
const read = (rel) => norm(readFileSync(join(rootDir, rel), "utf8"));

const failures = [];
const expectContains = (surface, needle, why) => {
  if (!read(surface).includes(norm(needle))) {
    failures.push(`${surface} — ${why}`);
  }
};
const expectOmits = (surface, needle, why) => {
  if (read(surface).includes(norm(needle))) {
    failures.push(`${surface} — ${why}`);
  }
};

for (const surface of [SURFACES.decisions, SURFACES.glossary, SURFACES.agents]) {
  expectContains(surface, INTERIM_RULE, "missing the interim carrier-rule sentence");
}
expectContains(
  SURFACES.decisions,
  SURVIVING_LAW,
  "dropped the surviving one-canonical-surface law",
);
expectOmits(
  SURFACES.decisions,
  OBSOLETE_SOLE_CANONICAL,
  "still carries the obsolete sole-canonical-TS wording",
);
expectOmits(
  SURFACES.glossary,
  OBSOLETE_SOLE_CANONICAL,
  "still carries the obsolete sole-canonical-TS wording",
);
expectContains(
  SURFACES.decisions,
  EXTENSION_LAW_REPAIR,
  "missing the extension-law re-point (the `.sdp.ts` extension law, MD-15)",
);
expectContains(
  SURFACES.coreModel,
  RELATIONS_DISTINCTION,
  "missing the logical/physical relations distinction",
);
expectContains(
  SURFACES.jsA1,
  RELATIONS_DISTINCTION,
  "missing the logical/physical relations distinction",
);
for (const row of DOCKET_ROWS) {
  expectContains(planFile, row, `docket obligation missing: ${row}`);
}

if (failures.length > 0) {
  console.error("check-carrier-interim — disagreeing surfaces:\n");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  "check-carrier-interim — all surfaces agree: interim carrier rule, relations distinction, docket obligations.",
);
process.exit(0);
