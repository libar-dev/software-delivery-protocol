# 08 - Self-hosting phase-2 pre-merge branch review

**Reviewed:** the full `main...feature/protocol-self-application-phase-2` diff at `f8648c4`
(42 commits, ~264 files), using the executed phase plan (`plans/18a-self-hosting-phase-2-execution.md`,
the durable copy of the orchestrator's plan) and its evidence ledgers as context.

**Method:** five parallel adversarial passes, one per dimension — the pure import/emit surface, the
`sdp import` CLI verb and the `--exclude` surface, the Markdown carrier hardening and the
refusal-parity matrix, the projections/model/graph/reader surfaces, and the authored records
(specs corpus, decision fold, operative docs, audit scripts). Every finding marked **CONFIRMED**
was reproduced by a probe against the built product or the real repo state, not inferred from a
code read. This review deliberately does not re-report the findings of
`reviews/07-self-hosting-phase-2-code-review.md`; instead it re-probed those remediations (they
held — see "What held") and hunted for what that review missed.

**Disposition:** compiled for a follow-up session. No product file was changed by this review.
The one working-tree repair made alongside it (banned temporal tokens in the uncommitted
`.omo` close notepad, which turned `check:temporal` red) is recorded as R-31 and was fixed
before commit. **The follow-up session then ran on this same branch** — see the remediation
addendum at the foot of this document and `plans/19-review-08-remediation.md` for the
per-finding dispositions.

---

## Verdict

**SOUND TO MERGE, WITH A RECORDED FOLLOW-UP DOCKET.** The phase's central guarantees held under
adversarial probing: the emitter's fidelity gate refused every lossy shape thrown at it (no silent
data change was found on any path), the migration's batch-atomicity held under normal failure, the
carrier-rule flip is consistent across every operative record, the fold's 21 pointers all resolve,
and the 58-spec corpus extracts clean with honest readiness. The majors below are defects in the
*durable* import/render surfaces — robustness, scoping, and diagnostic-quality debts — not in the
phase's fidelity or honesty claims. None of them corrupts authored data or falsifies a derived
fact on the repo's own pipeline today; two (R-4, R-5) can mislead or misfire in **consumer**
repos and should be treated as the head of the follow-up docket.

---

## Major findings (8)

### R-1 — A rollback removal failure crashes `sdp import`, abandons the rollback, and hides the original error

**Where:** `src/cli/sdp.ts:284-288`. **CONFIRMED** (probe against `dist/cli/sdp.js`).

The publish-failure catch block calls `remove(path, { force: true })` raw; `force` only swallows
ENOENT. An EACCES/EPERM/EBUSY on the first removal throws *out of the catch*, escaping
`runImport` as an uncaught exception: a Node stack trace (violating the CLI's own one-line
diagnostic law), the loop never reaches the remaining paths — so a **partially published target
persists**, which is exactly the state the review-07 B2 remediation exists to prevent — a temp
file leaks, and the original publish error is swallowed entirely. `runBuild`/`runView` treat this
identical scenario as a first-class law via `removeArtifact`/`removeArtifacts`
(`src/cli/sdp.ts:401-433`: never-throw + name-the-survivor, with injected-seam tests); import
bypasses that machinery. **Fix direction:** route the rollback through the same never-throw
removal helpers and report both the publish error and any surviving paths.

### R-2 — The import root scan is unbounded: it recurses `node_modules`/`dist`/`generated`/dot-dirs and writes into them

**Where:** `src/cli/sdp.ts:158-177` (`collectImportPaths`). **CONFIRMED** (two probes).

Extraction discovery deliberately skips `node_modules`, `dist`, `generated`, `coverage`, and
dot-directories (`src/extract/discover.ts`); the import scan shares none of that, and `sdp import`
has no `--exclude`. Probed consequences: (1) `sdp import .` on a root whose `node_modules`
contains a dependency shipping a `*.sdp.ts` **writes a `.sdp.md` inside `node_modules` and exits
0**; (2) a directory symlink cycle under the root (routine in pnpm layouts) aborts the whole batch
with a bare `ELOOP`. Also an unbounded scan cost over `.git`/`node_modules`. **Fix direction:**
share the discovery exclusion set (and consider the repeatable `--exclude` flag) on the import
walk.

### R-3 — A family of lawful TS Specs cannot be imported, and the refusal never names the divergent field

**Where:** `src/import/emit-markdown.ts:230` (title), `:84-109` (intent/GWT nesting);
`src/import/markdown-fidelity.ts`. **CONFIRMED** (four probes).

`title` is optional in the TS DSL (the repo's own parity fixtures omit it and reify cleanly), but
the emitter renders `` `# ${String(data.title)}` `` → `# undefined`; the fidelity gate then
rejects its own emission. A kind-`example` Spec without `intent` is likewise unimportable (the
ruled grammar's only home for the example `gwt` fence is inside `## Intent`, and an empty emitted
`## Intent` reifies as `intent: {}` ≠ absent), as is any authored-empty owner record, and
duplicate relation entries. In every case the CLI refuses with the same opaque
`import/unsupported-construct — … the emitted Markdown does not preserve the authored Spec data`
message: nothing names the construct or the field, so a batch-migration user gets no actionable
diagnosis. The refusal direction is *safe* (the gate is doing its job; no corrupt document lands),
but the verb's usefulness to adopters depends on refusing precisely. **Fix direction:** emit a
real refusal for absent-title/absent-intent shapes (or rule an emitter form for them), and make
`MarkdownEmissionError.reason` name the first divergent path.

### R-4 — Protocol-builder recognition by generic relative specifiers can mint false anchors in consumer repos

**Where:** `src/extract/reify.ts:204-215` (`protocolBuilderModuleSpecifiers`) wired through
`src/extract/index.ts:208`. **CONFIRMED** mechanism (probe: a file importing `spec`/`specId` from
its own `"./ids.js"` reifies a spec); flagged independently by two review dimensions.

The self-hosting corpus needed the Protocol's own source to be anchor-eligible, so the raw-text
gate now trusts the generic specifiers `"./ids.js"`, `"../ids.js"`, `"./code-anchor.js"`,
`"./model/code-anchor.js"`, `"../model/code-anchor.js"`. Anchor candidacy spans every `.ts` file
in a consumer repo: a consumer file importing a symbol *named* `codeAnchor` from **their own**
module spelled `./code-anchor.js` gets its calls reified as `impl:` anchors → `satisfies` edges →
**derived `implemented` delivery facts from non-protocol code** — a name-coincidence path to false
machine truth in a system whose core law is "delivery facts are derived, never authored."
Conversely the set is depth-limited: a legitimate Protocol-internal anchor imported via
`"../../ids.js"` is not recognized and vanishes **silently** (fail-safe direction, but invisible
drift). Nothing today breaks the repo's own pipeline (all current sites sit at depth ≤ 1), and no
test pins the consumer-repo false-positive surface. **Fix direction:** scope the trusted-specifier
gate to the Protocol's own tree (or an explicit opt-in), and pin both directions with tests; this
deserves a recorded ruling.

### R-5 — The uniform escaping policy corrupts values rendered inside fenced code and code spans

**Where:** `src/projections/design-review.ts:485-506` (`renderOpenBag` via `renderDynamicRecord`
at `:129-135`); inline-code sites at `:467`, `:626`, `:628`. **CONFIRMED** (the branch's own test
asserts the corrupted output).

The session-2 ruling ("one escaping policy covers every rendered field") was applied to
markdown-*literal* positions where escapes are never decoded. Open-bag values are escaped and then
`JSON.stringify`-ed into a ` ```json ` fence: authored `&` displays as `&amp;`, `<` as `&lt;`, and
`|` double-transforms to a displayed `a\|b` — visibly mangled data, and anything copying the JSON
out gets wrong values. `test/design-review.test.ts` locks the corruption in
(`'"surface": "Review &lt;design&gt; &amp; safely."'` asserted inside the JSON block). The
escaping has zero protective value there — `JSON.stringify` already neutralizes everything that
could close the fence. The same category error applies to inline code spans (verification `mode`,
findings `where`/`validatorId`), where entities and backslash escapes render literally. **Fix
direction:** exempt markdown-literal positions (fenced code, code spans) from the entity/escape
policy — `JSON.stringify` is already the correct encoder for the fence — and update the ruling's
wording plus the now-stale "renders verbatim" comment (R-20).

### R-6 — The Markdown frontmatter's reserved-vocabulary set misses the three delivery-fact names

**Where:** `src/extract/markdown-yaml-policy.ts:12-21`. **CONFIRMED** (probe on all three names).

`reservedEnvelopeKeys` bans `claim`/`deliveryFacts`/`nodeType`/`specKind`/`satisfies`/`verifies`/
`belongsTo`/`models` but not `implemented`, `has-verifier`, `observed` (the TS carrier's
`RESERVED_DERIVED_PROPERTIES` includes all delivery-fact names, and the Markdown *body* set does
too — only the frontmatter envelope omits them). Authoring `implemented: true` in `.sdp.md`
frontmatter therefore classifies as `extract/unrecognized-property` ("looks like a typo") instead
of `extract/reserved-property` ("you authored derived vocabulary"). Not an honesty *bypass* — the
carrier is still refused with an error either way — but it breaks the same-class parity claimed
for `extract/reserved-property` by `specs/carrier/markdown-parser.sdp.md`; the parity matrix
passes only because its fixture happens to use `deliveryFacts`. **Fix direction:** add the
delivery-fact names (both spellings) to `reservedEnvelopeKeys` and widen the parity fixture.

### R-7 — Two new `localeCompare` sorts violate the repo's own determinism law

**Where:** `src/cli/sdp.ts:172-173` (the import directory walk) and
`src/import/markdown-fidelity.ts:30` (the fidelity gate's relation-sort normalization).
**CONFIRMED** as code fact (not reproduced across locales).

`src/extract/serialize.ts:20` states the law: "Sorting is code-unit string comparison, never
`localeCompare`: locale-aware collation is environment-dependent." The import walk orders
multi-target processing — and therefore finding/report order — by ICU collation, which can differ
across machines. The fidelity-gate instance is locale-*consistent within a process* (both sides of
the equality sort with the same comparator), so it cannot flip an equality verdict, but it is the
same banned pattern in a surface whose whole point is determinism. **Fix direction:** replace both
with the existing `compareCodeUnits` pattern.

### R-8 — `AGENTS.md`'s "Where to look" row still describes the pre-fold DECISIONS.md diary

**Where:** `AGENTS.md:59`. **CONFIRMED.**

The row advertises `docs/concept/DECISIONS.md` as "**the why-log** … (the ratified-name registry +
the MD-series, the R-series, the legacy D1–D6 shorthand, measured evidence) — rationale + open
tensions." Post-fold, that file is a ~48-line lean registry containing none of that — no R-series,
no measured-evidence section, no rationale — and its own header says rationale lives in git,
plans, and the Specs. The flip's anti-misleading pass swept the status header two paragraphs above
but missed this row. An agent onboarding via the top operative record is sent to the registry for
rationale and finds pointers, then may dig the deleted diary out of git and treat it as current.
**Fix direction:** rewrite the row for the lean registry (and the companion pointer at
`CONTEXT.md:7`, R-18).

---

## Minor findings (12)

- **R-9 — Batch diagnostics are fail-fast, not "per-file fail-collecting."** `src/cli/sdp.ts:246-254`
  returns at the first source with an error finding/refusal/existing target; later sources'
  findings are never computed. The phase plan's contract for the verb says per-file
  fail-collecting (the authored spec is silent). A 50-file migration with 6 bad carriers takes 6
  runs to see all six diagnostics. **CONFIRMED.**
- **R-10 — Same physical source via two spellings defeats dedupe; dry-run diverges from execution.**
  Dedupe is a string-keyed `Set` (`src/cli/sdp.ts:232`); a symlinked dir or case-differing path on
  a case-insensitive FS validates clean, publishes the first twin, then fails blaming *its own
  just-published file* ("Markdown target already exists"), rolls back, exit 1 — while `--dry-run`
  prints both twins and exits 0. Rollback held in both probes; the message and the
  preview/execution divergence mislead. **CONFIRMED.**
- **R-11 — A successful mixed Spec+Pack import (exit 0) guarantees the next `sdp build` fails.**
  `src/import/import.ts:88-121`: the Spec twin is emitted with only an info finding; the Spec now
  exists in both carriers, the TS source cannot be deleted (the Pack must stay TS), and nothing
  tells the user the remedy is hand-editing the Spec out of the TS file. Next build:
  2 × `extract/duplicate-id`, graph not written. **CONFIRMED.**
- **R-12 — An explicitly named non-carrier operand is silently ignored** when any other source
  emits (`src/cli/sdp.ts:161-165`, `:257-260`): `sdp import good.sdp.ts order.spd.ts` (typo) exits
  0 with no diagnostic for the typo'd operand. **CONFIRMED.**
- **R-13 — The multi-Spec refusal drops the Pack finding.** `src/import/import.ts:76-86`: the
  `specs.length > 1` early return fires before `packFindings` is computed, so a two-Spec + Pack
  module reports only `import/unsupported-construct`. **CONFIRMED.**
- **R-14 — `MarkdownEmissionError` is thrown by a public barrel export but not exported.**
  `src/index.ts:9-11` exports `emitMarkdownSpec`, whose documented failure mode is the typed
  error; consumers cannot `instanceof`-match it (dist probe: `MarkdownEmissionError === undefined`
  on the barrel). **CONFIRMED.**
- **R-15 — The parity claim is id parity, not refusal parity.** `test/extract-parity.test.ts:187-195`
  asserts exact `validatorId` containment (good) but neither severity nor extraction outcome;
  probed inside a claimed same-class row: TS `unrecognized-property` is a **warning that still
  extracts**, Markdown's is an **error that refuses the document** — the very degrade-vs-refuse
  asymmetry the matrix's `non-static-section` rationale names as grounds for a non-claim.
  `specs/carrier/markdown-parser.sdp.md` should say "finding-class parity" or carry the asymmetry
  note. **CONFIRMED.**
- **R-16 — The frontmatter finding-cap summary carries the body's finding id.**
  `src/extract/markdown-frontmatter.ts:191` caps a pure-frontmatter flood under
  `extract/invalid-markdown-structure` (probed: 99 × invalid-frontmatter + 1 structure-id
  summary). Pre-existing on `main`, carried through the refactor. **CONFIRMED.**
- **R-17 — Directive refusal line off-by-one** when `%` is not on the first frontmatter line:
  `src/extract/markdown-frontmatter.ts:47-54`'s `search(/(?:^|\r?\n)%/u)` returns the offset of
  the *newline before* the `%`, so the structured finding points one line high while the
  yaml-native text beside it is right. Pre-existing; line correctness was this cluster's scope.
  **CONFIRMED.**
- **R-18 — `CONTEXT.md:7` still says "rationale in `docs/concept/DECISIONS.md`,"** contradicting
  the lean registry's own header. Companion of R-8. **CONFIRMED.**
- **R-19 — The D1–D6 table's "Canonical in" column is stale for D3/D5/D6**
  (`docs/concept/DECISIONS.md:45-48`): they now have decision Specs, but a reader resolving a live
  `(D5)` citation via the table never learns the decision record exists. **CONFIRMED.**
- **R-20 — Stale "renders verbatim" comment over the now-escaped example space**
  (`src/projections/design-review.ts:351-352` vs `:363`) — the comment is the stale side of an
  intent/realization drift. **CONFIRMED.**

---

## Notes (11)

- **R-21 — `import/*` findings ride severity `"info"`, outside the ratified severity vocabulary**
  (`src/import/import.ts:19,42` vs `src/validate/contracts.ts:6`). The CLI is safe only because it
  also keys on `result.emitted`; any consumer filtering `severity === "error"` or exhaustively
  switching over `Severity` misclassifies import refusals. An undeclared third severity on a
  shared channel — worth a deliberate ruling either way.
- **R-22 — Round-trip fixture blind spots:** no `rule`/`workflow`/`contract` kind, no
  `design`/`ui`/`verification` section, no multi-target relation in the graph-level corpus; no
  direct test that public `emitMarkdownSpec` throws; no test documenting the R-3 refusal family.
- **R-23 — Publication hygiene tail:** the never-overwrite guarantee is `existsSync`+`renameSync`
  and `rename(2)` clobbers (TOCTOU window; `linkSync`+unlink would refuse atomically); temp files
  leak on SIGKILL between temp-write and publish and nothing sweeps pid-scoped `*.tmp` strays;
  import finding messages embed the path already carried in the structured `file` field (against
  `formatFinding`'s own doc law); `--` is rejected so a path beginning with `--` is unreachable;
  `src/cli/sdp.ts:249` is dead code; `targetExistsFinding`/`noSourcesFinding` fabricate `line: 1`.
- **R-24 — Control characters flow into spec data** (NUL/BEL in body prose, escaped CR in YAML
  values) and land verbatim in `graph.json`. Same latitude as TS string literals — hygiene
  observation, no parity break.
- **R-25 — Inherited-property lookups produce misleading uniqueness messages:**
  `- constructor: x` under `## Design` refuses as "keys must be unique" on first occurrence
  (`Object.prototype` members seen by `!== undefined` checks). Nothing is accepted; message-only.
- **R-26 — `renderDynamicRecord` sorts raw keys but emits escaped keys**
  (`src/projections/design-review.ts:129-135`): deterministic, but rendered JSON keys can appear
  non-lexicographic when escaping reorders (`a|x` vs `ab`).
- **R-27 — Two anchors import builders via the package name** (`src/graph/schema.ts:1`,
  `src/codegen/contracts.ts:1` — a self-import cycle that works only through hoisting + the vitest
  alias + tsup inlining), and `src/ids.ts:133-137` bypasses the builders with raw `as` casts.
  Extraction re-validates, so no honesty hole; consistency debt.
- **R-28 — `test/self-hosting-graph.test.ts` is one 2,282-line `it`** with frozen absolute counts:
  first failure masks the rest; every corpus edit churns the frozen block. Not tautological (it
  asserts hand-written literals against real extraction) — a granularity/maintenance cost.
- **R-29 — The MD-3/MD-6 numbering gap is unexplained in the lean registry** (the retired-entries
  note died with the diary); git-only archaeology required against the registry's own
  "dispositions" promise.
- **R-30 — The example corpus shares the `decisions.` id namespace with the root corpus**
  (`spec:decisions.order-lifecycle` in checkout-v1 vs 21 root `spec:decisions.*`). No collision —
  the root pipeline excludes `examples/` — convention fragility only.
- **R-31 — (Resolved during this review.)** The uncommitted `.omo` close-notepad section carried
  banned temporal tokens (an ISO date, `Wave F…`, a numbered plan-file reference), turning
  `check:temporal` — and with it the whole green gate — red on the working tree while HEAD stayed
  clean. Reworded before commit; the gate is green again. Kept on the record because notepad prose
  is swept by the guard and this is the second time a close-note tripped it.

---

## What held (re-probed, hunted, and clean)

- **Review-07 remediations:** B1 holds and generalizes — multi-constraint, string open question,
  multi-`when`, structural title, trailing-whitespace/CRLF/leading-`#`/embedded-fence/`---`
  narratives, and `flows`/`description` injection shapes all refuse loudly; unicode and
  line-separator prose round-trips faithfully; no silent data change was found on any path. B2
  holds under normal failure (validation precedes writes; failed batches leave zero targets); C1
  and C2 hold; `--dry-run` writes nothing on every exercised path.
- **The parity matrix is rigorous where it counts:** exact `validatorId` assertions per cell,
  rationale required for every non-claim row, duplicate-id exercised through the full `extract()`
  path. The review-06 grammar cluster is closed for real (non-mapping-root findings preserved,
  duplicate `When` once, exact `...`, literal terminal `#`, per-limit single summaries, linear
  flood behavior: 10k bad headings ≈ 309 ms). The acceptance subset refuses directives, tags,
  anchors, aliases, complex/duplicate/merge keys, and the review-06 scalar-spelling gaps.
- **Escaping is injective and deterministic** (the `&`-first order actually fixed a pre-existing
  non-injectivity), ordering in the render path is code-unit only, and the permuted-insertion
  determinism test is a genuine byte-identity check.
- **Anchor honesty:** all 19 new `impl:protocol.*` anchors target existing spec ids, sit within
  the test-enforced proximity of a named real entrypoint, and no validator was silenced;
  `validateGraph` over the root corpus: zero findings. `schemaVersion` stays `0.4.0` with no
  hidden shape change.
- **The records:** the post-flip carrier sentence is verbatim-consistent across every active
  surface probed (AGENTS.md, CONTEXT.md, the registry, README, concept docs, JTBD stories, the
  checkout README, the decision spec); no active doc states the interim rule; all three audit
  scripts pass; all 21 registry pointers resolve with matching ids; the pinned fold-target map
  matches the authored `refines`/`decidedBy` edges on every spot-checked spec; 15 sampled corpus
  specs are substantive with no filler; checkout-v1 is exactly 11 `.sdp.md` + the lawful TS pack
  manifest, and its README figures reproduce exactly.
- **The gates:** the full `npm run check` chain is green at HEAD and after the R-31 repair;
  focused suites across all five dimensions pass (import/CLI/package 38+, parity/hardening/reifier
  120, projections/reader/self-hosting 59).

## Suggested follow-up order

1. R-1, R-2 (the two robustness holes in the durable verb), then R-3 (diagnosability) — one
   session, TDD, with R-9/R-10/R-11/R-12/R-13 riding as the same verb's diagnostic cluster.
2. R-4 (the anchor-trust scoping ruling) and R-6 (reserved-vocabulary parity) — small, high-honesty
   value; R-15's claim-wording repair lands with R-6.
3. R-5 + R-20 + R-26 (the escaping-policy scope repair) — one ruled projection session.
4. R-7, R-14, R-16, R-17 as a small hygiene batch; R-8, R-18, R-19, R-29 as one records sweep.
5. The notes (R-21 … R-30) enter the docket for disposition, not necessarily for work.

---

## Remediation addendum — the docket closed on this branch

The follow-up session ran before merge rather than after it, so the docket this review opened does
not survive into `main`. The per-finding disposition table, the three architecture rulings it
forced (anchor-builder trust, the import transaction, Markdown rendering contexts), and the
verification record are `plans/19-review-08-remediation.md`.

- **Fixed:** R-1 … R-23, R-25, R-26, R-27 (partial, with a named bootstrap exception), R-29.
- **Recorded only, no invented policy:** R-24 (control-character latitude matches TS string
  literals), R-28 (corpus-test granularity — owned by the named tests-to-executable-specs
  program), R-30 (root and example corpora are separate extraction roots).
- **Already resolved:** R-31.

Three rulings are worth reading before touching those surfaces again, because each closed a
finding by fixing a *contract* rather than a call site: builder trust is physical module identity,
never a raw relative spelling (R-4); import is a scan → plan → prepare → publish transaction whose
publication is an atomic hard link and whose rollback never throws (R-1, R-2, R-9 … R-13, R-23);
and Markdown escaping follows syntactic context — prose escapes, fenced JSON and inline code carry
literal data under their own encoders (R-5, R-20, R-26).
