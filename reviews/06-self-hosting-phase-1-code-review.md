# 06 — Self-hosting phase-1 comprehensive code review

**Reviewed:** the full implementation of `.omo/plans/self-hosting-sessions-1-4.md` (all 25 todos,
sessions 1–4 owner-accepted) — the diff `main...feature/protocol-self-application-phase-1`,
31 commits, 92 files, +7,188/−273, from `37e2845` (publish carrier reification seams) through
`24f9978` (record the landed prose projection in 06).
**When:** 2026-07-18, after todo 25 (Gate-4 accepted) and **before** the plan's own F1–F4 final
verification wave.
**Method:** a 29-agent dynamic review workflow — nine dimension reviewers (public API contract ·
YAML envelope · Markdown body grammar · extraction/routing/exclusions · graph serialization &
projections · corpus/anchor fidelity · test quality · gate scripts · docs/scope), one live
full-gate run, and one adversarial verifier per medium-or-worse finding. Verifiers re-read the
cited source and plan text and ran independent runtime probes against the built reifiers; every
finding below survived that pass (1 finding was refuted and is recorded as such; 2 had their
severity adjusted with the verifier's reasoning). Reviewer effort ≈ 2.2M tokens, 523 tool calls.

---

## Verdict

**The implementation is substantially faithful to the plan's frozen contracts, and the gate is
green** — but the review confirms **4 high-severity findings** (no blockers) that the pending
F1–F4 wave should not be allowed to sail past, plus 8 mediums and a tail of 24 low/info
observations. Nothing found contradicts the owner-accepted session outcomes; the highs are
concentrated in two places the sessions structurally under-scrutinized: **test-infrastructure
honesty around repo-root generated state (todo 14's contract)** and **coverage of the frozen
grammar's security boundary (todo 4's mandated limit/throw cases)**.

Live gate evidence (run during this review): `npm run check` passed end-to-end — 22 test files /
299 tests plus the separate 53-test CLI leg; `check:self-hosting` derived 15 specs / 1 pack /
15 anchors → 31 nodes, 53 edges, 0 errors, 0 warnings, `--check-clean` satisfied; `check:example`
kept its 1 known checkout warning; preflight clean; the tree stayed byte-clean afterwards.

### What was verified and held

- **The frozen public carrier contract is honored exactly.** Record fields, readonly shapes,
  `CarrierReification` without anchors, both reifier signatures, `deriveGraph(specs, packs,
  anchors)` as the single derivation seam (only `extract()` calls it; the CLI goes through
  `extract()`), no `ts-morph`/`SourceFile` in public declarations, no new export subpath.
  Adversarial runtime probes of both built reifiers produced findings, never throws — including
  a composer stack overflow at 8,000-deep nesting.
- **The envelope boundary is real.** Byte-zero opener, original-byte counting, 256 KiB/32 KiB
  caps before parsing, `yaml` pinned exactly `2.9.0`, no `toJS()` before policy, catch-unknown
  totality, `relations: {}` vs missing-`relations` distinction, id-key line identity, the
  99+overflow cap — all behave as ruled (34 adversarial probes).
- **Exclusion matching is segment-bounded** (no `exp` → `explorations` over-exclusion), the
  frozen reject list is enforced, excludes reach both `--check-clean` passes identically, and
  cross-carrier duplicate IDs produce `extract/duplicate-id` at both sites with neither node.
- **Canonical serialization is faithful**: the frozen key orders, the `0.4.0` literal,
  description-never-on-constraints, omission of absent optionals, code-unit dynamic sorts, and
  real permutation byte-equality across both public reifiers. The no-reparse projection law
  holds (with one low-grade caveat on the spy mechanism, below).
- **Corpus and anchors are essentially byte-exact.** All 15 rows match the frozen table (IDs,
  paths, descriptors, H1 titles, ordered relations, payload text); the Pack is the exact
  15-member list with `modelRefs` `[spec:model.protocol-domain]`; the histogram is
  `idea=1, defined=9, ready=5` in both authored frontmatter and the derived graph; every stated
  readiness genuinely clears its floor; all 15 inventoried anchors sit top-level beside their
  named groups importing the exact public specifier. (Note: the frozen inventory has 15 rows —
  the number in this review's own brief, 16, was the brief's error, not the repo's.) One low
  deviation: row 3's enrichment wording (below).
- **Docs truth-repair is thorough.** No active unqualified TS-sole-canonical claim survives in
  `docs/concept` or `jtbd-stories`; the interim rule reads identically across the carrier ruling
  (MD-18), `CONTEXT.md`, `AGENTS.md`, and docs 00/04/07; P5 stays carrier-neutral; the
  per-carrier degradation asymmetry is named; the two doc-06 `provenance` wordings are replaced;
  the two named rulings entered `DECISIONS.md` as MD-20/MD-21 with explicit three-part-test
  dispositions.
- **Every Must-NOT guardrail checked against git history holds**: no committed `generated/`
  output, no `sdp import` tooling, no checkout migration, no Markdown Pack syntax, no `.review/`
  tree, no phase-2 work, and the product parser is a fresh implementation, not promoted
  F2-exhibit spike code.

---

## High-severity findings (4)

### H1 · The repo-root `generated/` contract of todo 14 is violated by the shipped test design

**Where:** `test/cli.test.ts:150-172` · `vitest-test.mjs:53-55` · absence of any sentinel test.
**Cluster of five confirmed findings across three dimensions.**

Todo 14 froze: *"Move every repo-root CLI mutation into a disposable root, assert a root
sentinel survives"* and Must-NOT *"serialize the suite, disable parallelism, delete root
output"*; the Scope guardrail bans *"mutation of repo-root generated state from parallel
tests."* The landed design does the opposite on all three counts:

1. The default-root CLI test `rmSync`s repo-root `generated/` both before the run **and in its
   `finally` block** — root output is deleted, and every run of `cli.test.ts` ends with
   `generated/contracts` absent. Verified deterministically: `npm test -- test/cli.test.ts`
   green, then an immediately following `npm test -- test/self-hosting-duplicate-ids.test.ts`
   fails at the wrapper preflight. **`npm test` is not idempotent** (`npm run check` is
   unaffected because `generate:self-hosting` precedes tests).
2. `vitest-test.mjs` isolates `cli.test.ts` into a dedicated single-fork pass **only on
   unfiltered runs** — `if (hasPathFilter) process.exit(runVitest(vitestArgs))` puts any
   filtered invocation in the normal parallel pool. Todo 17's own acceptance command
   (`npm test -- test/self-hosting-duplicate-ids.test.ts … test/cli.test.ts …`, required to
   "succeed repeatedly under default parallelism") schedules the `generated/` mutator in
   parallel with `test/self-hosting-duplicate-ids.test.ts:12`, which statically imports
   `../generated/contracts/….contract.js` at collection time. On low-worker machines the
   failure is near-deterministic; observed green reflects a 10-core machine, not race safety.
3. The mandated **root-sentinel assertion was never implemented** — grep finds no root-state
   sentinel anywhere in the durable suite, and the "10× concurrent with sentinel hash" QA has
   no receipt (task-14 evidence records one two-phase run). Nothing durable would catch a
   future test that mutates repo-root state.

The alternative design is documented openly in the (ignored, local) task-14 evidence and the
sessions were owner-accepted — but **no plan amendment, execution-learning line, or recorded
ruling covers the substitution**, and the plan's text still promises the other behavior.

**Recommendation:** regenerate rather than delete in the `finally` block (restoring `npm test`
idempotence); apply the `cli.test.ts` split on filtered runs too (or move the default-root case
onto a disposable root); add the sentinel assertion; and record the design substitution as an
execution learning on todo 14 so plan text and reality agree before F1 reconciles them.

### H2 · Unsupported CommonMark block structures are silently accepted as prose

**Where:** `src/extract/markdown-body.ts:102` · `src/extract/markdown-body-content.ts:204`.

The frozen grammar rules *"Unsupported block structures still refuse"* and narrative accepts
*"CommonMark paragraphs only."* But the refusal guards enumerate only `-`, ` ``` `, `|`, `>`,
`<`, `#`, and indentation (narrative) / indentation, `|`, `>` (sections). Verified by runtime
probe: ordered lists (`1. first`), star/plus bullets (`* item`), setext underlines
(`=========`), and thematic breaks (`***`) all reify with **zero findings**, their structure
mangled into narrative or owned-description prose (e.g. `intent.description` becomes
`"1. first 2. second"`). The parser already refuses tables, blockquotes, and indented code —
so this is an inconsistency in the refusal set, not a design choice, and authored block
structure silently enters the graph as junk prose with no diagnostic.

Related (medium): a CommonMark HTML-block opener without a closing `>` on the same line
(`<div` alone) evades `isHtml` and lands in owned prose — the narrative zone refuses bare-`<`
lines but `parseSectionContent` does not, so the two prose owners disagree on the same lexical
rule, against *"Raw inline HTML and HTML blocks refuse."*

**Recommendation:** extend both refusal patterns to CommonMark list markers (`* `, `+ `,
`\d+[.)] `), setext underlines, thematic breaks, and bare-`<` prose lines in sections, emitting
`extract/invalid-markdown-structure`; add a refusal test per shape.

### H3 · Preflight recovery commands drop the frozen `npm run build && ` prefix — and fail in exactly the state they exist for

**Where:** `vitest-test.mjs:31-36` · `test/self-hosting-duplicate-ids.test.ts:79,89,99`.

Todo 14 froze the per-suite recovery commands verbatim: self-hosting-only →
`npm run build && npm run generate:self-hosting` (likewise for the checkout and both cases).
The implemented preflight prints only the generate half — and the three preflight tests **pin
the wrong strings as the contract**. In the no-dist state the acceptance criterion itself names
("disposable no-dist cases … pinned to exactly the commands above"), the printed recovery fails,
because `generate:self-hosting` is `node ./dist/cli/sdp.js view .` and `dist/` does not exist.
The plan draft records the build prefix as a deliberate round-1 review fix; no ruling amends it.

**Recommendation:** prefix each dependency's recovery with `npm run build && ` and correct the
three pinned test strings to the plan's exact commands.

### H4 · The frozen grammar's resource limits and relation-uniqueness rules have zero test coverage

**Where:** `test/markdown-reifier.test.ts:131-181` (the refusal `it.each` table).

Todo 4's acceptance mandates *"one table-driven case per warning/directive/tag/anchor/alias/
merge/complex key/non-string scalar/extra body delimiter/**limit**/**throw path**."* The
delivered table stops at "body delimiter." Repo-wide grep confirms **no test anywhere**
exercises: the 256 KiB file cap, the 32 KiB frontmatter cap, the depth-16 / 2,000-node /
16 KiB-scalar budgets, the catch-unknown throw path, duplicate relation keys, duplicate targets
within one list, empty relation sequences, or wrong-namespace targets. Verifiers empirically
exercised every cap against `dist/` and each produced the correct finding without throwing —
behavior is correct today — but the boundary's most security-relevant rules are pinned by
nothing and can silently regress. (One nuance: extreme 8,000-deep nesting is caught by the
stack-overflow backstop rather than the depth guard — precisely the kind of behavior only a
pinned test keeps honest.) The same table's **"warning" row actually exercises the directive
path** (the `document.warnings` half of the diagnostic loop is untested), and the **lone-CR
refusal is pinned by nothing** — the CRLF-replacement case fails at the byte-zero opener before
the lone-CR check runs.

**Recommendation:** add table rows for each cap (at and just over the boundary, asserting exact
message and line), one throw-path case, the three relation-uniqueness cases (two refusals plus
the distinct-keys acceptance), a genuine `document.warnings` case, and a lone-CR case with a
valid LF opener.

---

## Medium-severity findings (8)

**M1 · The frontmatter-side 100-finding cap emits the wrong frozen ID — and the test enshrines
it.** The frozen rule makes finding 100 `extract/invalid-markdown-structure` at line 1;
`parseMarkdownFrontmatter` uses `capMarkdownFindings`' default `extract/invalid-frontmatter`,
and `test/markdown-reifier.test.ts:193-197` pins the deviating ID. The body-side path passes the
correct ID but is untested. Either fix both to the frozen text or record a ruling; add a
body-side cap test. (`src/extract/markdown.ts:202`, `src/extract/markdown-support.ts:36`)

**M2 · The canonical serializer silently drops unknown static in-section authored content**
(adjusted from high by the verifier). Lossy TS reification accepts any static in-section key
with zero findings (only top-level unknowns warn, citing L2: *"authored content must never
silently fall out of the graph"*), but the 0.4.0 serializer enumerates only known fields — so
`behavior.notes` reifies cleanly, lives on the in-memory node (Reader-searchable), and vanishes
from `graph.json` with no diagnostic. `main`'s serializer emitted `sections` verbatim; this is a
regression introduced by the canonical serializer. Mitigations verified: in-repo carriers can't
produce the state (typecheck excess-property checks; Markdown refuses unknown headings), and a
smuggled in-section `implemented: true` **is** caught by `validateGraph` — the exposure is
untypechecked foreign carriers through the newly public `reifyTypeScriptCarrier` seam, and
consumers composing reify→derive→serialize without validate. Pick one behavior (warn-on-drop, or
serialize unknown keys deterministically) and pin it. (`src/extract/serialize.ts:69`)

**M3 · Todo 14's prescribed isolation mechanism was replaced without amendment** — the
plan-conformance face of H1: no disposable root, no sentinel, root output deleted, suite
partially serialized, with the substitution recorded only in ignored local evidence. Record the
execution learning / ruling. (`test/cli.test.ts:150-173`)

**M4 · The unrelated-filter preflight case is untested, and legal vitest substring filters
bypass the preflight entirely.** The shipped suite covers root-only / checkout-only /
both-missing / both-present, but not the acceptance-named unrelated-filter case; and
`startsWith` matching means `npm test -- duplicate-ids` (a legal substring filter that selects
the contract-importing suite) skips the preflight and dies on a raw collection-time import error
instead of the recovery message. (`vitest-test.mjs:22-25`)

**M5 · The body-grammar edge matrix is incomplete** against todo 5's acceptance text: no
positive pure-CRLF acceptance test (only mixed-newline refusal — a parser wholesale rejecting
CRLF would stay green), no missing-H1/empty-H1 case, one suggestion case (no distance>2
no-suggestion case, no tie case — despite the grammar freezing the algorithm precisely so tie
tests are stable), fence blank-line/attribute/unclosed refusals untested, the
gwt-on-non-example refusal unexercised, invalid `## Verification — MODE` and repeated identical
literal headings untested. (`test/markdown-reifier.test.ts`)

**M6 · The Gate-4 ledger's `Corrections: none` does not account for the post-acceptance repair
commit.** At the accepted SHA `1d9f38c`, doc 06 still carried the then-false claim that Design
Review "does not yet render prose" (todo 20 had landed prose rendering at `daa8c43`); the
repair (`24f9978`) landed after the acceptance-recording commit `c4454e9` and is reflected
nowhere in plan 17. Content is now correct; the durable process record is incomplete — and F1
explicitly reconciles ledger vs commits with zero missing criteria. Amend the Corrections cell
(a new commit, not history rewrite) or note the follow-up in the plan's running log.
(`plans/17-self-hosting-v1.md:410`)

**M7 · The "warning" and lone-CR envelope tests exercise different code paths than they claim
to pin** — detail folded into H4's coverage cluster; kept visible here because the mislabeled
rows would defeat a casual coverage audit. (`test/markdown-reifier.test.ts:132-136,206`)

**M8 · `npm test` non-idempotence** — the deterministic consequence of H1's `finally`-block
deletion, called out separately because it bites developers immediately: any run including
`cli.test.ts` leaves `generated/` absent, so the next unfiltered `npm test` fails at preflight.

---

## Refuted during verification (1)

- **"package-smoke wipes repo-root `dist/` from the parallel pool — a guardrail violation."**
  The mechanics are real (in-place `npm run build`, tsup `clean: true`), but the verifier showed
  the plan's guarded term "repo-root generated state" consistently means the sdp-generated
  `generated/` contract trees, never the `dist/` build tree; todo 23 Phase A mandates exactly
  the pack-from-repo flow; and no parallel test consumes `dist/` at runtime. What survives is
  hygiene (offline flake on a cold npm cache; recoverable half-built `dist/` if a run is
  killed), recorded as a low.

## Low / info observations (24)

Parser & envelope: `reifyMarkdownCarrier` has no catch-all backstop (totality is by
construction; the TS reifier wraps everything) · the non-string-scalar regex misses YAML 1.2
core forms (`1e3`, `0x1F`, `-.inf`), misclassifying the refusal message · yaml-native error
messages embed frontmatter-relative line numbers that disagree with the rebased `finding.line`
by one · a `...` document-end line inside frontmatter is silently accepted when a `---` closer
follows (no test pins either reading) · the non-mapping-root refusal discards previously
accumulated findings · depth/node-cap violations emit one identical finding per offending node,
flooding the 100-finding budget · the example-kind gwt fence is accepted anywhere inside
Intent, not only "immediately after the Intent block" · `### Open questions` with trailing
whitespace refuses despite the frozen trailing-trim rule · H1/H2 titles legitimately ending in
`#` (e.g. `Support for C#`) are refused as closing markers · a duplicate `When` step
double-reports · an unreachable example-placement branch in `mapOwner` is dead code.

Extraction & CLI: Windows drive-letter absolutes (`C:/…`) pass `normalizeExcludes` as silent
no-ops · no test pins the path-segment boundary of prefix matching (the single most
regression-prone line of the matcher) · `--exclude --foo` is reported as a missing path ·
library-seam exclusion errors are worded as CLI flag errors.

Serialization & projections: the `then` graph key is built as `["t","hen"].join("")` in three
production files with no explanatory comment — no configured lint or guard requires it; it
reads as guard evasion and hides the frozen `given/when/then` key set from grep · Design Review
dynamic-key ordering follows in-memory insertion order, so rendering from a re-parsed
`graph.json` would yield different page bytes than rendering from the live extraction graph ·
escaping stops at narrative/descriptions — titles, rules, terms, criteria render unescaped (raw
HTML is authorable through the TS carrier) · no byte-equality permutation test covers
gwt/examples/flows/exampleSpace · a model term literally named `description` is hoisted out of
code-unit sort order.

Corpus & tests: row 3's enrichment added two Intent bullets (`problem`, `value`) that appear in
no frozen table and weren't needed to clear the defined floor — the only non-byte-exact corpus
row; record the sanctioned delta or trim · the bound example's "both sites report" step asserts
only a count of 2, not two distinct carrier files · no test pins fixture↔live byte-identity for
rows 1/2/4/5 or row 3's frozen `scoped` birth rung · the no-reparse `vi.spyOn(fs,
"readFileSync")` cannot intercept named-import bindings, so the projection proof could stay
green under a guarded source-read (the ENOENT fixture paths mitigate only unconditional reads).

Gate scripts & docs: `check-carrier-truth.mjs` claims formatter-re-wrap tolerance its
line-based Family-C matching does not have (fail-closed, but the comment misleads) ·
`check-self-hosting-gates.mjs` assembles temporal-guard-banned tokens at runtime (sanctioned by
todo 24, but it institutionalizes a circumvention channel) and duplicates its gate-4 entry ·
the exact phrase repaired in doc 06 (`approval provenance is git-native`) survives verbatim in
doc 05:106 and `CONTEXT.md:182` — inside the glossary that itself lists `provenance` as
rejected (pre-existing lines, outside this plan's scope, but now inconsistent with the repair) ·
`npm run check` appends a twelfth `preflight` leg beyond todo 22's frozen eleven-leg order
(AGENTS documents reality truthfully; benign additive deviation worth a docket note) · the
plan-16 §6 per-item REPAIRED/SUPERSEDED dispositions exist only in ignored evidence · decision
specs live at `spec:decisions.*` while the DECISIONS registry reserves
`spec:protocol.decisions.*` — a namespace divergence the back-catalog fold will have to rule.

---

## Disposition guidance for the pending F1–F4 wave

- **Fix before or during the wave:** H3 (small, mechanical, restores a frozen contract), H1's
  `finally`-block regeneration + filtered-run split (removes a real race and the `npm test`
  idempotence trap), M6 (one ledger cell — F1 will otherwise trip on it).
- **Fix or rule explicitly:** H2 (extend the refusal set, or record a ruling narrowing
  "unsupported block structures"), M1 (align the cap ID or rule the deviation), M2 (choose
  warn-on-drop or deterministic unknown-key serialization).
- **Coverage debt to schedule:** H4 + M5 as one test-authoring pass over the frozen grammar's
  untested branches.
- **Everything in the low/info tail** is recordable as follow-up work without blocking the
  phase; none of it contradicts an owner-accepted outcome.

No finding in this review challenges the phase's central claims: one graph, one validation
path, honest readiness, derived-never-authored facts, and a deterministic clean-clone gate all
held under adversarial re-verification.
