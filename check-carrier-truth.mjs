import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// check-carrier-truth — the semantic consistency review for the carrier-truth repair (the
// anti-misleading doc pass: the narrowed form of plan 16 §6's full doc-repair bill, narrowed by
// plan 17's shrunk repair bill — only passages that actively mislead are repaired; cosmetic
// repair is deliberately skipped).
//
// Three assertion families, each NAMING the disagreeing surface on failure:
//   A. CLAIMS — every changed claim and its intended state: the repaired wording present, the
//      obsolete sole-TS-canonical and interim-transition wording gone, per file. The
//      canonical-default rule is mirrored exactly: Specs default to Markdown; Packs remain TS
//      until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID
//      option. P5's static/side-effect-free principle and the one graph/one validation path are
//      preserved while their carrier representations are plural, and concept 04 names the
//      per-carrier degradation asymmetry (TS: property-level drop with warning; Markdown:
//      all-or-nothing per document under the four hard finding IDs).
//   B. OBSOLETE SWEEP — the scanned corpus carries NO active unqualified sole-TS claim at all,
//      so the stale claims cannot silently migrate to another concept/JTBD file.
//   C. CLASSIFICATION SCAN — every TypeScript/`ts-morph`/`.sdp.ts`/TS mention retained in the
//      scanned corpus is classified by an explicit audit rule as exactly one of: checkout
//      history, the still-supported TS carrier, code-linkage wording, or an explicitly plural
//      carrier representation. An unclassified mention fails; a rule that no longer matches
//      anything fails as a stale audit entry.
//
// Scan scope: docs/concept/*.md and jtbd-stories/*.md (enumerated from disk), plus CONTEXT.md.
// Deliberately excluded: docs/concept/DECISIONS.md (the dated decision diary — historical
// records by genre; its active carrier wording is pinned by check-carrier-rule.mjs),
// AGENTS.md (same carrier gate; owned by a parallel flight), plans/ + reviews/ + explorations/
// (per-session records and exhibits, historical by genre), src/ + test/ (code, not concept/JTBD
// prose; its TypeScript mentions are implementation, not authoring guidance).
//
// Usage: node check-carrier-truth.mjs [rootDir]
//   rootDir — tree holding the corpus; defaults to this repo root. QA passes a temp tree with a
//   stale sentence restored to prove the disagreeing source is named.

const rootDir = process.argv[2] ?? dirname(fileURLToPath(import.meta.url));

// Sameness strips `>` blockquote markers and collapses whitespace before comparing text.
const norm = (text) => text.replace(/^>\s?/gm, "").replace(/\s+/g, " ");

const failures = [];
const readNorm = (rel) => norm(readFileSync(join(rootDir, rel), "utf8"));
const readRaw = (rel) => readFileSync(join(rootDir, rel), "utf8");

// ---------------------------------------------------------------------------
// Family A — every changed claim and its intended state.
// ---------------------------------------------------------------------------

const CLAIMS = [
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    label: "MVP DSL bullet names the TS carrier as one supported carrier, not the surface",
    present: ["the TS carrier (`.sdp.ts`), the MVP's authoring surface and still fully supported"],
    absent: [],
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    label: "MVP extractor bullet is carrier-plural",
    present: ["`*.sdp.ts` via `ts-morph`, `*.sdp.md` via the ruled Markdown parser"],
    absent: ["from every `*.sdp.ts` under the extraction root"],
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    label: "carrier status states the canonical-default rule precisely",
    present: [
      "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option",
    ],
    absent: ["until the ruled flip"],
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    label: "MVP write-path is carrier-plural",
    present: ['The MVP write-path is "edit the canonical carrier + git."'],
    absent: ["edit TypeScript + git"],
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    label: "Gherkin cut row names the ruled competition, not the open one",
    present: ["carrier competition is ruled (the carrier ruling, MD-18)"],
    absent: ["the TS DSL is the sole canonical surface throughout"],
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    label: "one-breath statement is carrier-plural",
    present: ["authored in a ruled carrier", "statically extracted from both carriers"],
    absent: ["TypeScript-canonical", "extracted by `ts-morph` into one"],
  },
  {
    file: "docs/concept/01-founding-principles-and-invariants.md",
    label: "P5 keeps the static/side-effect-free principle with a plural carrier illustration",
    present: [
      "Spec and anchor source is restricted to static, side-effect-free literals",
      "static data its carrier validates",
      "`ts-morph` for the TS carrier, the ruled Markdown parser for `.sdp.md`",
    ],
    absent: ['Treat a spec file as "a JSON file that TypeScript happens to validate."'],
  },
  {
    file: "docs/concept/01-founding-principles-and-invariants.md",
    label: "Representation table row names both carrier extractors",
    present: ["The carrier extractors — `ts-morph` (the TS carrier) and the ruled Markdown parser"],
    absent: ["| `ts-morph` as the extractor |"],
  },
  {
    file: "docs/concept/03-the-one-graph.md",
    label: "derivation diagram names the carrier extractors",
    present: ["carrier extractors"],
    absent: ["ts-morph extractor"],
  },
  {
    file: "docs/concept/03-the-one-graph.md",
    label: "spec discovery covers both carrier suffixes",
    present: ["every `*.sdp.ts` and `*.sdp.md` under the extraction root"],
    absent: ["every `*.sdp.ts` under the extraction root"],
  },
  {
    file: "docs/concept/03-the-one-graph.md",
    label: "the two-tier echo points at the per-carrier asymmetry",
    present: ["the per-carrier asymmetry is named at `04` §1"],
    absent: [],
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    label: "intro names two ruled carriers, not exactly two surfaces with an open competition",
    present: ["Authoring has two ruled **carriers**", "the carrier competition now ruled"],
    absent: ["exactly two authoring surfaces", "the carrier an open competition"],
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    label: "section 1 heading no longer teaches TS-as-canonical",
    present: ["The TypeScript Spec DSL — the TS carrier (CORE)"],
    absent: ["The TypeScript Spec DSL — canonical (CORE)"],
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    label: "the per-carrier degradation asymmetry is named precisely",
    present: [
      "The TS carrier keeps L3's property-level graceful degradation",
      "all-or-nothing per document",
      "extract/invalid-frontmatter",
      "extract/invalid-markdown-structure",
      "extract/unrecognized-heading",
      "extract/unowned-prose",
      "corpus-scoped hardening, not a contradiction of the two-tier law",
    ],
    absent: [],
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    label: "one canonical surface per ID states the canonical-default rule verbatim",
    present: [
      "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option",
    ],
    absent: [
      "In the MVP that is always the TS DSL",
      "When Gherkin arrives",
      "until the ruled flip",
    ],
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    label: "Gherkin contender is marked ruled, not open",
    present: ["a contender the ruling declined"],
    absent: [
      "Throughout the competition the TS DSL stays the sole canonical authoring surface",
      "### Annotated Gherkin (OPEN — the carrier competition)",
    ],
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    label: "closing write path is carrier-plural",
    present: ["editing the canonical carrier + git"],
    absent: ["editing TypeScript + git"],
  },
  {
    file: "docs/concept/05-validation-and-honesty.md",
    label: "the one validation path keeps its law with per-carrier authoring-time feedback",
    present: ["Authoring-time feedback is per-carrier", "there is exactly one validation path"],
    absent: ["Authoring-time feedback is the type system's job"],
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    label: "package line names both carrier extractors",
    present: [
      "the carrier extractors — `ts-morph` for the TS carrier, the ruled Markdown parser for `.sdp.md`",
    ],
    absent: [],
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    label: "what-done-looks-like write-path is carrier-plural",
    present: ["You write specs in the canonical carrier"],
    absent: ["You write specs in TS,"],
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    label: "North Star is carrier-plural",
    present: ["writes specs in the ruled carrier"],
    absent: ["an engineer writes specs in TypeScript,"],
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    label: "the carrier addendum reconciles the CORE map with the canonical-default rule",
    present: [
      "Carrier addendum (post-MVP)",
      "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option",
    ],
    absent: ["until the ruled flip"],
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    label: "the Gherkin open-question half is marked answered",
    present: ["the Gherkin half is answered"],
    absent: ["When (if ever) Gherkin / harnesses / evidence become CORE"],
  },
  {
    file: "docs/concept/README.md",
    label: "the definition names carrier extractors, not the ts-morph extractor",
    present: ["derives the graph from the repo's authored carriers"],
    absent: ["A `ts-morph` extractor derives the graph"],
  },
  {
    file: "docs/concept/README.md",
    label: "the 04 index row names both ruled carriers",
    present: ["The two ruled authoring carriers"],
    absent: ["MVP surfaces: the TypeScript DSL + generic source anchors"],
  },
  {
    file: "docs/concept/README.md",
    label: "the legend write-path states the canonical-default rule verbatim",
    present: [
      "edit the canonical carrier + git",
      "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option",
    ],
    absent: ["The MVP write-path is simply **edit TypeScript + git**", "until the ruled flip"],
  },
  {
    file: "CONTEXT.md",
    label: "the sdp import glossary definition retains its many-source-adapters amendment",
    present: ["one import verb with many source adapters"],
    absent: [],
  },
  {
    file: "README.md",
    label: "the package README carries the canonical-default rule",
    present: [
      "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option",
    ],
    absent: [],
  },
  {
    file: "jtbd-stories/01-capture-and-evolve-intent.md",
    label: "JS-A1 capture is carrier-plural (a new ID may be .sdp.md)",
    present: ["The new spec lives in a carrier document under the extraction root"],
    absent: ["The new spec lives in a `*.sdp.ts` file under the extraction root"],
  },
  {
    file: "jtbd-stories/01-capture-and-evolve-intent.md",
    label: "JS-A1 static-data criterion scopes the P5 illustration per carrier",
    present: ["static, side-effect-free data in its carrier"],
    absent: ['(a "JSON file that TypeScript happens to validate")'],
  },
  {
    file: "jtbd-stories/01-capture-and-evolve-intent.md",
    label: "JS-A2 enrichment is a carrier edit, not a TypeScript edit",
    present: ["an ordinary edit to the spec's canonical carrier (Markdown or TypeScript)"],
    absent: ["an ordinary TypeScript edit"],
  },
  {
    file: "jtbd-stories/README.md",
    label: "the MVP/write-path summary is carrier-plural",
    present: [
      "the one-graph extractor over both carriers (`ts-morph` for `.sdp.ts`, the ruled Markdown parser for `.sdp.md`)",
      "The write path is **edit the canonical carrier + git**",
    ],
    absent: [
      "the typed `Spec` DSL + generic anchors, the `ts-morph` one-graph extractor",
      "The write path is **edit TypeScript + git**",
    ],
  },
];

for (const claim of CLAIMS) {
  let body;
  try {
    body = readNorm(claim.file);
  } catch {
    failures.push(`${claim.file} — unreadable while checking claim: ${claim.label}`);
    continue;
  }
  for (const needle of claim.present) {
    if (!body.includes(norm(needle))) {
      failures.push(`${claim.file} — MISSING intended state (${claim.label}): "${needle}"`);
    }
  }
  for (const needle of claim.absent) {
    if (body.includes(norm(needle))) {
      failures.push(`${claim.file} — RETAINS obsolete wording (${claim.label}): "${needle}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Scan scope: the concept/JTBD corpus, enumerated from disk for durability.
// ---------------------------------------------------------------------------

const SCAN_DIRS = ["docs/concept", "jtbd-stories"];
const SCAN_EXTRA_FILES = ["CONTEXT.md"];
const SCAN_EXCLUDE = new Set(["docs/concept/DECISIONS.md"]);

const scanFiles = [];
for (const dir of SCAN_DIRS) {
  const abs = join(rootDir, dir);
  if (!existsSync(abs)) {
    failures.push(`${dir} — scan directory missing (fail closed)`);
    continue;
  }
  for (const entry of readdirSync(abs, { withFileTypes: true }).toSorted((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  )) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isFile() && entry.name.endsWith(".md") && !SCAN_EXCLUDE.has(rel)) {
      scanFiles.push(rel);
    }
  }
}
for (const rel of SCAN_EXTRA_FILES) {
  if (!existsSync(join(rootDir, rel))) {
    failures.push(`${rel} — scan file missing (fail closed)`);
    continue;
  }
  scanFiles.push(rel);
}

// ---------------------------------------------------------------------------
// Family B — no active unqualified sole-TS claim anywhere in the corpus.
// ---------------------------------------------------------------------------

const OBSOLETE = [
  "the TS DSL is the sole canonical surface",
  "stays the sole canonical authoring surface",
  "remains the sole canonical authoring surface",
  "TypeScript-canonical",
  "edit TypeScript + git",
  "editing TypeScript + git",
  "In the MVP that is always the TS DSL",
  "MVP surfaces: the TypeScript DSL",
  "A `ts-morph` extractor derives the graph",
  "an engineer writes specs in TypeScript",
  "write specs in TS,",
  "an ordinary TypeScript edit",
  "exactly two authoring surfaces",
  "The TypeScript Spec DSL — canonical (CORE)",
  "every `*.sdp.ts` under the extraction root",
  "ts-morph extractor",
  "lives in a `*.sdp.ts` file under the extraction root",
  "New spec IDs may be born Markdown-canonical once the product parser lands; pre-existing IDs and the worked example remain TS-canonical until the ruled flip (the product parser, `sdp import`, and the checkout-v1 migration)",
];

const normalizedBodies = new Map();
for (const rel of scanFiles) {
  try {
    normalizedBodies.set(rel, readNorm(rel));
  } catch {
    failures.push(`${rel} — unreadable during the obsolete sweep (fail closed)`);
  }
}
for (const [rel, body] of normalizedBodies) {
  for (const needle of OBSOLETE) {
    if (body.includes(norm(needle))) {
      failures.push(`${rel} — ACTIVE sole-TS claim survived the sweep: "${needle}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Family C — every retained TypeScript/ts-morph mention is classified.
// ---------------------------------------------------------------------------

const CHECKOUT_HISTORY = "checkout history";
const STILL_SUPPORTED = "the still-supported TS carrier";
const CODE_LINKAGE = "code-linkage wording";
const PLURAL = "an explicitly plural carrier representation";

// One rule per retained mention. `includes` is matched against the raw line (whitespace-tolerant),
// so the audit survives formatter re-wrapping. Every rule MUST classify at least one line — a
// rule that matches nothing is a stale audit entry and fails.
const RULES = [
  // CONTEXT.md — the ratified glossary (re-pinned at the canonical-default flip).
  {
    file: "CONTEXT.md",
    includes: "the TS DSL remaining the import source and a lawful per-ID option",
    category: PLURAL,
  },
  { file: "CONTEXT.md", includes: '"DSL" (reserved for the TS DSL)', category: STILL_SUPPORTED },
  {
    file: "CONTEXT.md",
    includes: "Markdown Spec files use the **`.sdp.md`** extension by default",
    category: PLURAL,
  },
  {
    file: "CONTEXT.md",
    includes: "identifies the lawful TypeScript carrier",
    category: STILL_SUPPORTED,
  },
  {
    file: "CONTEXT.md",
    includes: "the TS DSL survives as import source and a lawful per-ID option",
    category: PLURAL,
  },
  {
    file: "CONTEXT.md",
    includes: "many source adapters, sharing the document emitter",
    category: PLURAL,
  },
  {
    file: "CONTEXT.md",
    includes: "Packs remain TS until a Pack",
    category: PLURAL,
  },
  { file: "CONTEXT.md", includes: "the `.sdp.ts` extension", category: STILL_SUPPORTED },

  // 00 — vision, scope, MVP boundary.
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    includes: "the TS carrier (`.sdp.ts`), the MVP's authoring surface and still fully supported",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    includes: "`*.sdp.ts` via `ts-morph`, `*.sdp.md` via the ruled Markdown parser",
    category: PLURAL,
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    includes: "the TS DSL survives as import source and a lawful per-ID option",
    category: PLURAL,
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    includes: "TS DSL survives as the import source and a lawful per-ID option",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    includes: "`.sdp.md` by default; `.sdp.ts` remains lawful per ID",
    category: PLURAL,
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    includes: "TypeScript `.sdp.ts` remains lawful per ID",
    category: PLURAL,
  },
  {
    file: "docs/concept/00-vision-scope-and-mvp-boundary.md",
    includes: "TypeScript (`.sdp.ts`) a lawful per-ID option",
    category: PLURAL,
  },

  // 01 — founding principles.
  {
    file: "docs/concept/01-founding-principles-and-invariants.md",
    includes:
      "in the TS carrier; bounded YAML frontmatter plus the owned prose grammar in the Markdown carrier",
    category: PLURAL,
  },
  {
    file: "docs/concept/01-founding-principles-and-invariants.md",
    includes: "`ts-morph` for the TS carrier, the ruled Markdown parser for `.sdp.md`",
    category: PLURAL,
  },
  {
    file: "docs/concept/01-founding-principles-and-invariants.md",
    includes: "never by TypeScript import edges",
    category: CODE_LINKAGE,
  },
  {
    file: "docs/concept/01-founding-principles-and-invariants.md",
    includes: "`ts-morph` (the TS carrier) and the ruled Markdown parser (`.sdp.md`)",
    category: PLURAL,
  },

  // 03 — the one graph.
  {
    file: "docs/concept/03-the-one-graph.md",
    includes: "ts-morph for .sdp.ts · the ruled Markdown parser for .sdp.md",
    category: PLURAL,
  },
  {
    file: "docs/concept/03-the-one-graph.md",
    includes: "every `*.sdp.ts` and `*.sdp.md` under the extraction root",
    category: PLURAL,
  },
  {
    file: "docs/concept/03-the-one-graph.md",
    includes: '"file": "specs/orders/create-order.sdp.ts"',
    category: CHECKOUT_HISTORY,
  },
  {
    file: "docs/concept/03-the-one-graph.md",
    includes: "the TS carrier's granularity",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/03-the-one-graph.md",
    includes: "(from `ts-morph`)",
    category: CODE_LINKAGE,
  },

  // 04 — authoring & binding.
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "the **TypeScript Spec DSL (`.sdp.ts`)**, an import source and lawful per-ID option",
    category: PLURAL,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "The TypeScript Spec DSL — the TS carrier (CORE)",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "In the TS carrier, specs are authored as typed TypeScript in `*.sdp.ts` files",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "A spec file in this carrier is",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "The TS carrier keeps L3's property-level graceful degradation",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "TS DSL survives as import source and a lawful per-ID option",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "checkout.pack.sdp.ts",
    category: CHECKOUT_HISTORY,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "orders/create-order.sdp.ts",
    category: CHECKOUT_HISTORY,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "payments/authorize-payment.sdp.ts",
    category: CHECKOUT_HISTORY,
  },
  {
    file: "docs/concept/04-authoring-and-binding.md",
    includes: "Markdown or TypeScript per ID",
    category: PLURAL,
  },

  // 05 — validation & honesty.
  {
    file: "docs/concept/05-validation-and-honesty.md",
    includes: "the type system's job in the TS carrier",
    category: STILL_SUPPORTED,
  },

  // 07 — roadmap & open questions.
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    includes: "TS Spec DSL + spec extraction",
    category: CHECKOUT_HISTORY,
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    includes:
      "the carrier extractors — `ts-morph` for the TS carrier, the ruled Markdown parser for `.sdp.md`",
    category: PLURAL,
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    includes: "TypeScript `.sdp.ts` remains lawful per ID",
    category: PLURAL,
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    includes: "TypeScript a lawful per-ID option",
    category: PLURAL,
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    includes: "TS Spec DSL; the three descriptors",
    category: CHECKOUT_HISTORY,
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    includes: "the TS DSL survives as import source and a lawful per-ID option",
    category: PLURAL,
  },
  {
    file: "docs/concept/07-mvp-roadmap-and-open-questions.md",
    includes: "the TS DSL already expresses examples",
    category: CHECKOUT_HISTORY,
  },

  // Concept README.
  {
    file: "docs/concept/README.md",
    includes:
      "`ts-morph` for the TS carrier (`.sdp.ts`), the ruled Markdown parser for the Markdown carrier (`.sdp.md`)",
    category: PLURAL,
  },
  {
    file: "docs/concept/README.md",
    includes: "the TypeScript DSL (`.sdp.ts`, import source and lawful per-ID option)",
    category: PLURAL,
  },
  {
    file: "docs/concept/README.md",
    includes: "the typed `Spec` DSL (the MVP's TS carrier, still supported)",
    category: STILL_SUPPORTED,
  },
  {
    file: "docs/concept/README.md",
    includes: "`ts-morph` for `.sdp.ts`, the ruled Markdown parser for `.sdp.md`",
    category: PLURAL,
  },
  {
    file: "docs/concept/README.md",
    includes: "the TS DSL survives as import source and a lawful per-ID option",
    category: PLURAL,
  },

  // JTBD stories.
  {
    file: "jtbd-stories/01-capture-and-evolve-intent.md",
    includes: "with `*.sdp.ts` lawful per ID",
    category: PLURAL,
  },
  {
    file: "jtbd-stories/01-capture-and-evolve-intent.md",
    includes: "in the TS carrier; bounded frontmatter and owned prose in the Markdown carrier",
    category: PLURAL,
  },
  {
    file: "jtbd-stories/01-capture-and-evolve-intent.md",
    includes: "an ordinary edit to the spec's canonical carrier (Markdown or TypeScript)",
    category: PLURAL,
  },
  {
    file: "jtbd-stories/README.md",
    includes: "the TS DSL as an import source and lawful per-ID option",
    category: PLURAL,
  },
  {
    file: "jtbd-stories/README.md",
    includes: "`ts-morph` for `.sdp.ts`, the ruled Markdown parser for `.sdp.md`",
    category: PLURAL,
  },
  {
    file: "jtbd-stories/02-bind-code-to-intent.md",
    includes: "never by TypeScript import edges",
    category: CODE_LINKAGE,
  },
];

const MENTION = /ts-morph|TypeScript|\.sdp\.ts|\bTS\b/;
const ruleUsed = new Array(RULES.length).fill(false);
const ruleNeedle = (needle) => needle.replace(/\s+/g, " ");

for (const rel of scanFiles) {
  let raw;
  try {
    raw = readRaw(rel);
  } catch {
    continue; // already named above (fail closed)
  }
  const lines = raw.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!MENTION.test(line)) {
      continue;
    }
    let classified = false;
    for (let r = 0; r < RULES.length; r += 1) {
      const rule = RULES[r];
      if (rule.file === rel && line.includes(ruleNeedle(rule.includes))) {
        ruleUsed[r] = true;
        classified = true;
      }
    }
    if (!classified) {
      failures.push(
        `${rel}:${index + 1} — UNCLASSIFIED TypeScript/ts-morph mention: ${line.trim().slice(0, 160)}`,
      );
    }
  }
}
for (let r = 0; r < RULES.length; r += 1) {
  if (!ruleUsed[r]) {
    failures.push(
      `${RULES[r].file} — STALE audit rule (matches nothing; the mention moved or was removed): "${RULES[r].includes}"`,
    );
  }
}

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.error("check-carrier-truth — disagreeing surfaces:\n");
  console.error(failures.join("\n"));
  console.error(
    `\n${failures.length} disagreement(s). Every changed claim needs its intended state; every retained TypeScript/ts-morph mention must classify as: ${CHECKOUT_HISTORY} · ${STILL_SUPPORTED} · ${CODE_LINKAGE} · ${PLURAL}.`,
  );
  process.exit(1);
}

console.log(
  `check-carrier-truth — ${CLAIMS.length} repaired claims hold; ${scanFiles.length} corpus files scanned; ${RULES.length} retained mentions classified (no active unqualified sole-TS claim).`,
);
process.exit(0);
