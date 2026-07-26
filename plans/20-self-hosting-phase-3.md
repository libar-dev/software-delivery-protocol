# Plan 20 — Self-hosting phase 3: the executable-specs rewrite, readiness maturation, and the first concept-doc dissolutions

> **Status:** 🧭 DRAFTED — execution begins on `feature/protocol-self-application-phase-3`, never on
> `main`. This is plan 20, the highest primary-numbered plan. The latest ✅ EXECUTED ground is plan
> 18 (with plan 19's remediation riding the same phase-2 close). Build state lives in **`plans/`** —
> read the highest **primary-numbered** plan's status header, plus any **active subplans it (or its
> parent family) explicitly designates as current**; ignore unnumbered files and letter-suffixed
> plans only when no primary/active plan designates them. If that plan is DRAFTED, also read the
> latest ✅ EXECUTED plan for settled ground.
>
> **Spec anchors:** [plan 18 §7 done-record](18-self-hosting-phase-2.md) · [the phase-2 brief's
> remaining-work enumeration](18-self-hosting-phase-2-brief.md) ·
> [the dissolution decision](../specs/decisions/concept-docs-dissolve.sdp.md)
> (`spec:decisions.concept-docs-dissolve`) · [the point-per-example decision]
> (../specs/decisions/point-per-example.sdp.md) (`spec:decisions.point-per-example`).

## (a) Status

This is the executable phase plan for the remaining-work enumeration recorded at the phase-2
close: the systematic tests-to-executable-specs rewrite (item 1), readiness maturation riding it
(item 2), and the first per-doc concept audits under the dissolution decision (item 3). The
deferred tail (item 4) stays deferred unless a wave forces an entry under fire. Execution happens
only on `feature/protocol-self-application-phase-3`. Sessions run agent-executed and
orchestrator-verified; **owner ratification of the whole phase happens at the phase PR review** —
the gate ledger (§10) records that honestly and never claims a live owner acceptance that did not
occur.

## (b) Context

Phase 2 left one carrier rule, 58 interlinked specs, and a green twelve-leg gate — but the thesis
is not yet fully applied to the repo itself: 529 of 532 repository tests are plain vitest
assertions whose verification the graph cannot see, and `has-verifier` is earned through the
executable path for only two spec pairs (the duplicate-IDs tracer and the `sdp import`
round-trip). The corpus sits at 7 `ready` / 51 `defined`; the concept docs still duplicate
contract the specs now carry. Phase 3 makes the rewrite systematic where the verify loop is
honestly cheap, matures readiness only as verifiers land, and performs the first per-doc
dissolution audits — deleting a concept doc only where its semantic contract is fully carried.

The permanent guardrails stand unchanged: checks police conformance and honesty, never
content-quality and never workflow; delivery facts are derived, never authored; the claim
taxonomy is never collapsed; readiness is stated only where the floor honestly clears; "one
canonical surface per ID, no mixing."

## (c) Scope

1. **Tranche 1 — the executable-specs rewrite, first systematic waves.** Convert the cheap,
   law-shaped test suites to bound executable specs under the tracer template: the validation
   family (S1), the extraction/model cheap wins (S2), and the uncovered engine areas — contract
   codegen, the runner core, slot notation — which first need honest corpus additions (S3).
2. **Tranche 2 — readiness maturation (S4).** Promote `defined` specs to `ready` only where the
   floor clears **and** a resolving verifier exists; sweep the specs whose verifiers landed in
   S1–S3 plus the three carrier specs that already carry anchored verifiers.
3. **Tranche 3 — per-doc concept audits and the first dissolutions (S5).** Audit `02`, `03`,
   `05`, `06`, and `07` against the coverage trail; repair the last prose ties; delete only the
   docs whose contract is fully carried, per-doc, judged over the regenerated Design Review.
4. **Close (S6).** Adversarial review over the full branch diff, remediation, the full gate
   (including clean-clone), and this plan's done-record.

**Out of scope, named deliberately:** converting the filesystem-corpus giants
(`test/markdown-reifier.test.ts`, `test/extract.test.ts`, `test/cli.test.ts`) and the golden
corpus oracle (`test/self-hosting-graph.test.ts`) — their specs already hold anchored verifiers,
and their worlds are not cheap; the packaging/bootstrap smoke surface; the deferred tail
(Markdown Pack syntax · the gen-1 `.feature` adapter · the no-reparse read seam · temporal-guard
token assembly) unless a wave forces an entry; the editor-association gap; new content-quality
validators; bulk concept purges.

## (d) §1 Engineering rulings

1. **The unit of conversion is the law, never the assertion.** A wave converts a spec's law into
   an example space plus 1–3 bound points that honestly exercise it. Row-for-row expansion of
   `it.each` tables is refused: the residual plain-vitest assertions survive as regression
   evidence (checks never police workflow), and a residual test is deleted only when a bound
   contract honestly carries its assertion. Conversion must never weaken coverage.
2. **A `rule`-kind parent may own an Example space.** The parser routes `## Example space` for
   every kind, codegen keys on `sections.behavior.exampleSpace` alone, and sections are optional
   detail slices under the section/kind duality — so the tracer parent's `behavior` kind was
   convention, not law. Recorded here as an under-fire ruling; it does not pass the three-part
   test (the base already forced it), so it stays a plan record, not a decision spec.
3. **The four-artifact template is the only conversion path.** Parent `## Example space`
   (`gwt-vocabulary` fence) → `example`-kind child spec (`refines` + `verifies` the parent, one
   immediate `gwt` point, fully bound, vocabulary-compatible) → regenerated
   `generated/contracts/` → `bindExample` handlers beside a top-level `specTest` anchor whose
   `verifies` names the child. Anchors bind real test entrypoints only — no decorative anchors.
4. **Table sugar does not fire by default.** Where a law's honest coverage needs more points than
   1–3 siblings, prefer sibling `example` specs (the point-per-example decision's static
   expansion is already the ruled semantics); the Markdown table syntax is ruled only if a wave
   shows sibling authoring is dishonest or unusable in practice, and any such ruling lands as its
   own recorded grammar session, never a wave side-effect. Same discipline for the single-literal
   vocabulary form and the multi-entry constraint form.
5. **The readiness promotion law.** `ready` is stated only where (a) the `ready` floor clears,
   (b) a resolving verifier exists — so the promotion introduces no `honesty/gaps` warning — and
   (c) the spec's content is honestly acceptance-grade. Promotion is per-spec judgment, never a
   quota; a spec may honestly stay `defined` with a verifier.
6. **Bookkeeping moves with each wave, batch-green.** Every new spec ID enters
   `specs/self-hosting.pack.sdp.ts` in the same change; contract-dependent test files enter the
   `vitest-test.mjs` dependency table; `generated/` is regenerated and committed in-wave;
   `npm run check` is green at every commit a wave blesses. No blessed commit holds a generated
   contract whose bound test is planned-but-missing unless the wave records the gap deliberately
   (the checkout `invalid-cart` precedent).
7. **Temporal-guard discipline.** Specs, source, and tests never carry dates, plan references,
   or wave handles; those live only in `plans/` and `reviews/`. Wave prompts must repeat this —
   the guard enumerates untracked files too.
8. **Concept deletion is per-doc, audited, and ratified at the PR.** Each candidate doc gets an
   audit row (§4): every section mapped to its carrying surface or the doc is not deleted. The
   audit is judged over the regenerated Design Review; the deletion commit carries the audit
   pointer; the owner's ratification is the phase PR review. `CONTEXT.md`, the lean
   `DECISIONS.md` registry, and `plans/` never dissolve.
9. **Drift discipline.** Any disagreement a wave finds between a spec's stated law and engine
   behavior is drift to resolve deliberately — fix the stale side on the record; never silently
   promote code behavior into intent to make a contract bind.

## (e) §2 Wave inventory — the conversion ledger

State values: `planned` → `done` / `deferred` / `dropped` (with reasons, §7). "Points" are bound
example children; residual tests stay per ruling 1.

| Wave | Source tests | Parent spec (vocabulary) | Planned points | State |
|---|---|---|---|---|
| S1 | `test/validators.test.ts` orphan/gap cases | `spec:validation.warn-level-signals` | 1–2 | done — 2 points (`orphan-signal`, `ready-gap-signal`) |
| S1 | `test/validators.test.ts` referential cases | `spec:validation.referential-integrity` | 1–2 | done — 2 points (`dangling-target`, `did-you-mean`) |
| S1 | `test/validators.test.ts` + fixture rows | `spec:validation.authored-honesty` | 1–2 | done — 2 points (`section-authored-fact`, `unearned-stated-fact`) |
| S1 | `test/validators.test.ts` claim cases | `spec:validation.claim-separation` | 1–2 | done — 2 points (`collapsed-edge-claim`, `unratified-descriptor`) |
| S1 | `test/validators.test.ts` verifies/models cases | `spec:validation.verification-linkage` | 1–2 | done — 2 points (`unbound-example`, `unresolved-oracle`) |
| S1 | `test/validators.test.ts` pack cases (coverage gap) | `spec:validation.pack-coherence` | 1 | done — 1 point (`incoherent-aggregate`) |
| S2 | `test/exclude-diagnostics.test.ts` | `spec:extraction.excludes` | 1–2 | done — 2 points (`segment-boundary`, `refused-path`) |
| S2 | `test/graph-schema.test.ts` | `spec:extraction.schema-versioning` | 1 | done — 1 point (`declared-version`) |
| S2 | `test/ids.test.ts` (representative points) | `spec:model.stable-ids` | 1–2 | done — 2 points (`namespaced-round-trip`, `malformed-refusal`) |
| S2 | `test/extract-parity.test.ts` (representative) | `spec:carrier.markdown-parser` | 1 | done — 1 point (`bounded-parity`) |
| S3 | `test/codegen.test.ts` (representative laws) | `spec:extraction.executable-contracts` (enriched) | 2–3 | done — 3 points (`concreteness-refusal`, `multi-entry-example`, `case-colliding-path`) |
| S3 | `test/runner.test.ts` | `spec:extraction.example-runner` (new, §3 ID confirmed) | 1–2 | done — 2 points (`step-order`, `red-step-naming`) |
| S3 | `test/notation.test.ts` | `spec:carrier.slot-notation` (new, §3 ID confirmed) | 1–2 | done — 2 points (`typed-declaration`, `refused-guess`) |

The readiness sweep (S4) carries its own ledger in §6, beside the rulings that produced it; the
audit tranche (S5) carries its tables in §4 and §7.

## (f) §3 Modeling policy for the S3 corpus additions

- **The runner core** (`src/runner/`): one `behavior`-kind spec, feature altitude, under the
  extraction family (the executable-contracts chain) — proposed `spec:extraction.example-runner`
  — `refines spec:extraction.executable-contracts`, anchored to `planExample`/`runExamplePlan`.
  Its law: a bound example runs steps in contract order against a fresh world; a red step names
  itself in the spec's own words; an unbound handler is a compile-time refusal.
- **Slot notation** (`src/notation/slots.ts`): one `rule`-kind spec, story altitude — proposed
  `spec:carrier.slot-notation` — `refines spec:carrier.markdown-authoring`, anchored to
  `parseSlots`/`stepSkeleton`. Its law: the typed slot forms, the skeleton identity, and the
  refuse-to-guess posture for malformed groups.
- **Codegen enrichment**: `spec:extraction.executable-contracts` gains the concreteness law, the
  refusal catalog (`contracts/*` findings), and an example space over contract generation; its
  existing anchors stand.
- Kinds and altitudes follow the corpus conventions; IDs are two-segment; every new spec enters
  the pack manifest and the §4 coverage trail. Thin filler specs are a defect — if a law cannot
  be stated with honest content, it is not authored this phase.

## (g) §4 The concept-doc audit design

Per-doc criterion (the dissolution decision): a doc may be deleted only once its semantic
contract is fully carried by specs and lean registries, judged at a Design Review — never a bulk
purge. Audit table template (one per candidate doc, recorded in §7 at execution):

`| Doc section | Carrying surface (spec / registry / code) | Verdict (carried · gap · expository-only) |`

Candidate ranking from the phase-2 coverage trail, with known blockers to repair or record:

1. **`02-core-model.md`** — strongest: all six sections have carrying specs. Known tie: the
   D1/D2 rows in `DECISIONS.md` still point at `02` §2/§3 as canonical — re-point to
   `spec:model.core-model` / `spec:model.spec-sections` before deletion.
2. **`07-roadmap...`** — docket-superseded at phase 2; likeliest deletion on supersession
   grounds; sweep inbound references (`AGENTS.md` names `07` as the historical slice roadmap).
3. **`03-the-one-graph.md`** — near: only §5 ("git is the event log", duplicated in `01`) lacks
   a carrier; either carry it or record the doc as not-yet-deletable.
4. **`05-validation-and-honesty.md`** — blocked unless repaired: §3's floor tables are the
   recorded mirror of `readiness-floor.ts` and are cited by MD-13/MD-9 as carrying surfaces;
   §5–§7 have no carriers. Expect audit-recorded, not deleted, unless the wave honestly closes
   the gaps.
5. **`06-consumers-and-projections.md`** — partial (§6, §8–§10 uncarried); expect
   audit-recorded, not deleted.

`00`, `01`, `04`, and the concept README are out of audit scope this phase. Every deletion
sweeps inbound references (`AGENTS.md`, `README.md`, `CONTEXT.md` pointers, other concept docs,
`check-carrier-truth.mjs`'s audit map) in the same commit.

## (h) §5 Watch items carried into phase 3

| Watch item | Trigger | Ruling rule | Entry state |
|---|---|---|---|
| table-sugar syntax | sibling-point authoring proves dishonest for a real law | rule Markdown syntax; preserve static sibling expansion semantics | watch — unfired |
| single-literal vocabulary form | a real vocabulary slot needs one literal | rule only with a concrete fixture | watch — unfired |
| multi-entry constraint form | a real constraint needs more than one entry | rule carrier syntax + parity evidence together | watch — unfired |
| array-section prose sub-owner | a real spec needs prose beside array entries | rule with the forcing spec | watch — unfired |
| Markdown Pack syntax | a Pack needs Markdown authoring for a real caller | rule separately; Pack is not a kind | watch — unfired |

## (i) §6 Rulings-under-fire running log (execution)

Appended as waves execute; entries name the forcing material and the disposition.

### 2026-07-26 — S1 (the validation family)

1. **Bound handlers live in a dedicated `test/self-hosting-validators.test.ts`, not inside
   `test/validators.test.ts`.** *Forcing material:* the anchor scanner's file-level gate. A
   `specTest` anchor is extracted only from a file the scanner reads, and the scanner reads a file
   only when it imports the package specifier (or a trusted relative builder module). Adding that
   import to `test/validators.test.ts` turned the scan on for the whole file, and its two
   pre-existing **inline** `specTest(…)` fixture calls — arguments to `deriveFixtureGraph`, not
   anchor constants — immediately raised two `extract/misplaced-authoring` warnings the corpus must
   not carry. The alternatives were both worse: hoisting those fixture calls to top level would
   mint real graph anchors pointing at deliberately dangling ids, and leaving the warnings in place
   would break the corpus's zero-finding oracle. *Disposition:* the wave's bound points go in a
   dedicated suite, matching the repository's existing convention for bound self-hosting examples
   (`test/self-hosting-duplicate-ids.test.ts`, `test/self-hosting-sdp-import.test.ts`); the
   plain-vitest suite is untouched and survives whole as regression evidence (ruling 1). No ADR
   test is met — the base already forced this — so it stays a plan record.
2. **The wrapper's contract-dependency table becomes one row per generated tree.** *Forcing
   material:* a second self-hosting suite. The old table keyed one row per test file, and a second
   row for the same tree would have made the missing-tree stderr repeat
   `npm run generate:self-hosting` — a message
   `test/self-hosting-duplicate-ids.test.ts` pins byte-exactly. *Disposition:* rows now carry a
   `testPaths` list, so the recovery command a missing tree names is stated once regardless of how
   many suites depend on it; the pinned messages are unchanged.
3. **Rule-kind parents own their Example space (§1 ruling 2, exercised).** All six S1 parents are
   `rule` kind; the parser, codegen, and floor treated them exactly like the `behavior`-kind
   tracer. No grammar change was needed and no watch item fired.
4. **Three unstated laws were promoted into spec text — from intended truth, never from code.**
   The did-you-mean suggestion (`05` §2 check 1), the fail-closed descriptor posture (`05` §2
   check 3), and "a non-resolving trace confers nothing" (`02` §2, `04` §2) were all already
   ratified in the concept material and merely absent from the carrying specs; each is now a rule
   line on its parent so its bound point reads against stated intent. `pack-coherence` gained one
   mechanism sentence (membership is counted on the derived `belongsTo` edges the manifest
   re-expresses) so its `{memberCount}` dimension is readable; the validator's behavior was found
   to agree with the stated law, so no code moved.
5. **Six parents and eleven children promoted to `ready` under §1 ruling 5.** Every promotion
   clears the floor, carries a resolving verifier through the executable path (the children by
   their bound `specTest` anchors, the parents by the enabled-example rule), and introduces no
   `honesty/gaps` warning. The closing distribution is `defined: 45 / ready: 24` over 69 specs.

### 2026-07-26 — S2 (the extraction, model, and carrier cheap wins)

1. **Three dedicated suites, one per family, rather than one S2 suite.** *Forcing material:* the
   four converted laws span three families whose worlds share nothing — a temporary filesystem
   root, an in-memory derived payload, in-process ID parsing, and a fixture-pair reification.
   *Disposition:* `test/self-hosting-extraction.test.ts` (excludes · schema-versioning),
   `test/self-hosting-model.test.ts` (stable-ids), and `test/self-hosting-carrier.test.ts`
   (markdown-parser). S1's per-tree wrapper row absorbed all three as `testPaths` entries with no
   change to the pinned recovery messages, which is exactly what that restructuring was for. No
   ADR test is met; it stays a plan record.
2. **A behavior-kind parent owns an Example space beside a `Verification — executable` section.**
   *Forcing material:* `spec:carrier.markdown-parser` already carried an anchored verifier
   (`test:protocol.markdown-parser`) and its executable-verification criteria. Adding
   `## Example space` between `## Behavior` and `## Verification — executable` routes into
   `sections.behavior.exampleSpace` exactly as for a `rule` parent; the existing anchor and the
   verification section are untouched. *Disposition:* the executable path now stands **beside**
   the anchored one on the same spec — both bindings resolve, and the spec's bounded parity claim
   is unchanged in wording.
3. **Partial points are the honest shape for refusal-versus-success pairs.** *Forcing material:*
   three of the four vocabularies branch on an outcome (discovery completes vs. is refused,
   parsing resolves vs. is refused), so each sibling uses only the Then steps its branch reaches.
   The concreteness law reads used steps only, so both siblings clear `defined` and each contract
   carries exactly its own steps. *Disposition:* no new grammar; the table-sugar watch item stayed
   unfired — two siblings per law were enough, and the ledger's 1–2 point budget was never
   pressed.
4. **No drift found between the four stated laws and engine behavior.** Every clause the points
   exercise — exact-prefix exclusion across both discovery surfaces, refusal rather than
   normalization, the payload-carried schema version, the lowercase-namespace and `#` sub-part
   grammar, and the shared-validator-ID parity with carrier-specific severity and extraction
   outcomes — held as authored. Four mechanism lines were added (`normalizeExcludes` /
   `discoverFiles`, `schemaVersion` / `deriveGraph`, `parseId` / `formatId`) purely to name the
   realizing entrypoints in the corpus's established style; **no code moved and no claim was
   widened**.
5. **Four parents and six children promoted to `ready` under §1 ruling 5.** Each parent's floor
   clears (every `refines` / `dependsOn` target is at least `defined`), each child carries a
   resolving verifier through its bound `specTest` anchor, and each parent earns `has-verifier`
   from its enabled example — the promotion introduces no `honesty/gaps` warning.
   `spec:carrier.markdown-parser` was judged acceptance-grade on its own terms: its parity claim
   is explicitly bounded and its four named non-claims are stated exclusions, not open questions.
   The closing distribution is `defined: 41 / ready: 34` over 75 specs; the corpus stays at 0
   errors and 0 warnings.

### 2026-07-26 — S3 (the corpus additions: codegen, the runner core, slot notation)

1. **The bound points join the existing per-family suites rather than three new files.**
   *Forcing material:* S2's ruling 1 settled the convention as one dedicated suite **per family**,
   and all three S3 laws fall inside families that already own one — extraction
   (`spec:extraction.executable-contracts`, `spec:extraction.example-runner`) and carrier
   (`spec:carrier.slot-notation`). Their worlds share nothing with the suites' existing worlds, but
   that was already true inside `test/self-hosting-extraction.test.ts` (a temporary filesystem root
   beside an in-memory derived payload), so world-sharing was never the criterion the convention
   turned on. *Disposition:* `test/self-hosting-extraction.test.ts` absorbs the codegen and runner
   points, `test/self-hosting-carrier.test.ts` the notation points; the wrapper's per-tree
   `testPaths` row and the pinned missing-tree stderr are untouched, which is exactly what S1's
   restructuring was for. No ADR test is met — it stays a plan record.
2. **Two new `impl:` anchors landed in source, in the canonical anchor-constant form.**
   `impl:protocol.example-runner` (`src/runner/index.ts`, beside `planExample`) and
   `impl:protocol.slot-notation` (`src/notation/slots.ts`, beside `parseSlots`) each import their
   builders from this package's canonical `ids` / `model/code-anchor` modules, so the anchor-trust
   rule holds. Both modules are leaves in the import graph, so the added imports introduce no cycle
   and the `/runner` subpath keeps its dependency-light shape.
3. **Inline authoring builders in a bound suite stay silent, so the codegen world is honest.**
   *Forcing material:* the codegen law needs probe graphs, and the natural way to build one is the
   typed `spec(…)` builder inside a step handler — the exact shape S1 had to relocate for
   `specTest(…)`. *Disposition:* the misplaced-authoring scan resolves builders through **protocol
   bindings only** (the package specifier, or a relative import canonicalizing to this package's
   `ids` / `model/code-anchor`), and the probe helpers import `spec` / `specId` / `refines` from
   `../src/index.js`, which is neither. The scan is on for the file (the `specTest` anchors need
   it) and reports nothing; the corpus keeps its zero-finding oracle. No grammar or code moved.
4. **Two vocabulary shapes were bounded by the notation itself, and the boundary was recorded, not
   worked around.** A bound slot value is one double-quoted literal with no interior quote, so a
   step text carrying a closed union (`{a:"x"|"y"}`) cannot itself be bound as a slot value. The
   closed-union clause therefore stays a stated rule with `test/notation.test.ts` as its regression
   evidence, and the two bound points cover the typed form, the skeleton identity, the prose brace,
   and the unusable group. The single-literal vocabulary form is stated as a refusal in
   `spec:carrier.slot-notation` **without ruling new syntax** — the watch item stays unfired.
5. **No drift found between the three stated laws and engine behavior.** Every clause the points
   exercise held as authored: contract order with one handler per repeated step, the `at step:`
   failure prefix with the original error preserved by identity, the concreteness refusal (space
   contract emitted, step contract withheld), the named second entry, and the whole-tree
   withholding on a case-folded collision with a warning that never gates. Where the specs state
   more than the points exercise — the compile-time bindings law, the closed-union declaration
   form, the loud local degradations — the clause is authored from intended truth (the runner and
   codegen module contracts and the ratified executable-half vocabulary) and the plain-vitest
   suites remain its evidence. **No code moved and no claim was widened.**
6. **Three parents and seven children promoted to `ready` under §1 ruling 5.** Each parent's floor
   clears (`spec:extraction.executable-contracts` → `spec:extraction.build-pipeline`,
   `spec:extraction.example-runner` → `spec:extraction.executable-contracts`,
   `spec:carrier.slot-notation` → `spec:carrier.markdown-authoring`, every target at least
   `defined`), each child carries a resolving verifier through its bound `specTest` anchor, and
   each parent earns `has-verifier` from its enabled examples — the promotions introduce no
   `honesty/gaps` warning. `spec:extraction.executable-contracts` was judged acceptance-grade only
   after the enrichment: the two-rule stub it was could not honestly carry `ready`. The closing
   distribution is `defined: 40 / ready: 44` over 84 specs; the corpus stays at 0 errors and 0
   warnings.

### 2026-07-26 — S4 (the readiness maturation sweep)

1. **Enrichment precedes promotion, or the promotion does not happen.** *Forcing material:* the two
   carrier specs that already carried anchored verifiers — `spec:carrier.envelope-contract` and
   `spec:carrier.prose-ownership-rule` — were one-line stubs. Each cleared the `ready` floor
   structurally and carried `has-verifier`, so both would have promoted silently; neither was
   acceptance-grade. *Disposition:* the S3 precedent applied (`executable-contracts` was promoted
   only after enrichment). The envelope contract gained the closed-key-set law, the explicit
   `relations: {}` carrier rule (the carrier ruling's own carrier note), the derived-name refusal
   (delivery facts are derived, never authored), and the owned-grammar bounded-refusal posture (the
   envelope-grammar-posture decision's stated consequence); the prose rule gained the
   singular-section description owner, the constraints-array exception, and the
   graph-content-never-a-file-pointer clause (the prose-ownership decision's stated rationale).
   **Every added clause came from ratified intent; no code moved and no claim was widened.**
2. **A `model`-kind parent may own an Example space — ruling 2 exercised on a fourth kind.**
   *Forcing material:* the anchor-trust law lives on `spec:model.anchors`, whose kind evidence is
   `model.terms`, not `behavior`. Adding `## Example space` routed into `sections.behavior.exampleSpace`
   beside an untouched `model` section exactly as for the `rule` and `behavior` parents, and the
   floor read the terms as before. *Disposition:* no grammar change and no watch item fired; the
   section/kind duality carried it, as ruling 2 predicted.
3. **Two laws were converted, and both were chosen for law-shape rather than for cheapness.**
   `spec:model.anchors` — builder trust is physical module identity — took two sibling points
   (`lookalike-refusal`, `physical-identity`); `spec:validation.two-check-families` took one
   (`split-report`), because the family split is one law and one probe graph exhibits both halves
   at once. `test/anchor-trust.test.ts` and `test/validators.test.ts` survive whole as regression
   evidence (ruling 1). The bound points joined the existing per-family suites per S3's ruling 1;
   the wrapper's per-tree `testPaths` row and the pinned missing-tree stderr are untouched.
4. **The second-tier model candidates were refused on ruling 1, not on budget.**
   `spec:model.core-model` and `spec:model.spec-sections` were examined against
   `test/descriptors.test.ts`: every assertion there is a literal-list equality over the ratified
   enums, which is an assertion, not a law with an example space. Converting it would have been
   row-for-row expansion wearing a contract, so both stay `defined` with their vocabularies intact.
   The same reading kept `spec:model.relations`, `spec:model.pack-aggregate`,
   `spec:model.protocol-domain`, and `spec:extraction.claim-taxonomy` at `defined`: each is a
   vocabulary whose clauses are already exercised through a *different* spec's ready points.
5. **The epic stays `defined`, deliberately.** `spec:protocol.self-hosting` has no resolving
   verifier and no honestly cheap one — its two rules are whole-pipeline claims whose worlds
   (the full build chain, the clean-clone rebuild) are named out of scope for this tranche. Its
   children now carry heavy verification, but `has-verifier` is direct and never propagates up
   `refines` (binding, never liveness), so promoting the epic would have introduced exactly the
   `honesty/gaps` warning ruling 5 forbids. Recorded as an honest `defined`, not an oversight.
6. **Decisions get no verifiers, and none was invented.** All 21 `decision`-kind specs stay
   `defined`: a decision's truth is a ratified choice, not a runtime behavior, so no resolving
   verifier can exist for it and any promotion would be a `honesty/gaps` warning by construction.
   `spec:consumers.edit-model` stays `defined` on its own stated terms — it says in its own rules
   that it has no realizing entrypoint and no verifier, which is the honest shape, not a gap.
7. **Frozen-fixture bookkeeping moved with the enrichment.** Two of the five self-hosting carrier
   fixtures are byte-identical copies of live carriers (`test/markdown-reifier.test.ts` pins that),
   and `test/extract.test.ts` asserts their reified sections. Both were refreshed in the same
   change, so the carrier specs' anchored verifiers keep verifying the text that is actually
   authored. The closing distribution is `defined: 36 / ready: 51` over 87 specs; the corpus stays
   at 0 errors and 0 warnings.

#### The S4 readiness-sweep ledger

Every spec that stood at `defined` when S4 opened, with its disposition. "Stays `defined`,
honestly" is a first-class outcome; promotion is per-spec judgment, never a quota.

| Spec | Readiness | Verifier basis | Disposition |
|---|---|---|---|
| `spec:carrier.envelope-contract` | defined → **ready** | anchored `test:protocol.envelope-contract` | enriched in place first — four clauses from ratified intent; floor clears, no gap |
| `spec:carrier.prose-ownership-rule` | defined → **ready** | anchored `test:protocol.prose-ownership` | enriched in place first — three clauses from the prose-ownership decision; floor clears |
| `spec:model.anchors` | defined → **ready** | enabled examples (both points below) | converted — Example space added; terms gain the untrusted-builder clause and its entrypoints |
| `spec:model.anchors.lookalike-refusal` | **new — ready** | anchored `test:protocol.anchors.lookalike-refusal` | new point — a consumer-local lookalike mints nothing and reports nothing |
| `spec:model.anchors.physical-identity` | **new — ready** | anchored `test:protocol.anchors.physical-identity` | new point — a deep relative import resolving to the builder modules is trusted |
| `spec:validation.two-check-families` | defined → **ready** | enabled example (the point below) | converted — Example space added; two clauses added (aggregate family, entrypoints) |
| `spec:validation.two-check-families.split-report` | **new — ready** | anchored `test:protocol.two-check-families.split-report` | new point — one report, both families, neither claimed as its own |
| `spec:protocol.self-hosting` | defined | none | epic — whole-pipeline rules, no cheap verifier; promotion would add a gap warning |
| `spec:carrier.markdown-authoring` | defined | none of its own | parent of four ready children; the executable path lives on them, not on it |
| `spec:consumers.agent-surface` | defined | none | two of its rules are measured-evidence claims, not runtime laws; reader world not cheap |
| `spec:consumers.reader` | defined | none | verifier world is a full graph fixture — outside this tranche's cheap boundary |
| `spec:consumers.design-review` | defined | none | verifier world is projection rendering — outside this tranche |
| `spec:consumers.edit-model` | defined | none, by its own rule | states in its own words that it has no entrypoint and no verifier — honest `defined` |
| `spec:consumers.projections-model` | defined | none | vocabulary; its measured-curation terms are recorded evidence, not runtime law |
| `spec:extraction.build-pipeline` | defined | none | the ordered flow's world is the CLI pipeline — a named out-of-scope giant |
| `spec:extraction.regenerability` | defined | none | its law is the clean-room rebuild; that world is the close's, not a cheap point |
| `spec:extraction.claim-taxonomy` | defined | none of its own | vocabulary; its clauses are exercised through `spec:validation.claim-separation`'s ready points |
| `spec:model.core-model` | defined | none | second-tier candidate refused on ruling 1 — `test/descriptors.test.ts` is list equality, not a law |
| `spec:model.spec-sections` | defined | none | same reading as `core-model`; the section-name list is an assertion, not an example space |
| `spec:model.relations` | defined | none of its own | vocabulary; relation grammar is exercised by referential-integrity's ready points |
| `spec:model.pack-aggregate` | defined | none of its own | vocabulary; the pack law is carried executably by `spec:validation.pack-coherence` |
| `spec:model.protocol-domain` | defined | none | four-term vocabulary; no runtime law to bind |
| 21 × `spec:decisions.*` | defined | none, by construction | a decision's truth is a ratified choice, not a runtime behavior — no verifier exists and none was invented |

## (j) §7 Done-record (execution — appended at close)

Executed delivery, the conversion ledger's terminal states, the readiness sweep ledger, the
per-doc audit tables and deletion dispositions, watch-item terminal states, the docket close,
and close-evidence pointers.

## (k) §8 Docket ledger

Carried in from phase 2 (all remain open unless a wave adopts them): the Markdown Pack syntax
ruling · the gen-1 `.feature` adapter · the no-reparse read seam · temporal-guard token assembly
· the editor-association gap · corpus-test granularity (owned by this program — dispositioned by
the waves it reaches) · control-character latitude · the separate example id namespace. Rows
close only with reasons in §7.

## (l) §9 Acceptance criteria

1. **Executable-path facts, not claims:** every converted law's parent and child earn
   `has-verifier` through the executable path (anchored `verifies` from a bound test), visible
   in `generated/graph.json`; zero validation errors; contract generation deterministic under
   `--check-clean`.
2. **Honest readiness:** every promotion clears the floor and carries a resolving verifier; the
   phase introduces no `honesty/gaps` warning; the closing readiness distribution is recorded.
3. **Coverage never weakens:** residual tests are deleted only where a bound contract honestly
   carries the assertion; the suite's law coverage at close is a superset of its opening
   coverage.
4. **Per-doc audits recorded for `02`, `03`, `05`, `06`, `07`;** deletions only where the audit
   verdict is fully-carried; no dangling inbound reference survives a deletion
   (`check-carrier-truth.mjs` and the full gate stay green).
5. **Watch items:** any fired ruling is recorded; every unfired item survives with a reason.
6. **The gate holds throughout:** `npm run check` green at every blessed commit; the close runs
   the full chain plus a clean-clone proof; the wrapper dependency table and preflight targets
   are current.
7. **Records continue:** the conversion/readiness/audit ledgers are terminal; the docket rows
   are dispositioned or carried with reasons; an adversarial review over the full branch diff is
   archived under `reviews/` with remediation dispositions before close.

## (m) §10 Session and gate ledger

Sessions execute sequentially; each closes with a green gate, a regenerated Design Review, and a
commit series on the effort branch. This ledger is git process evidence, never graph content.

| Session | Delivers | Gate discipline | State |
|---|---|---|---|
| S1 | validation-family conversions (§2) + promotions that honestly clear | orchestrator-verified green gate | done — 11 points bound across 6 parents; three green-gate commits |
| S2 | extraction/model cheap wins (§2) | orchestrator-verified green gate | done — 6 points bound across 4 parents; one green-gate conversion commit |
| S3 | corpus additions (§3) + codegen/runner/notation conversions | orchestrator-verified green gate | done — 2 new specs + 1 enrichment; 7 points bound across 3 parents; 2 new `impl:` anchors; one green-gate conversion commit |
| S4 | readiness maturation sweep (ruling 5) | orchestrator-verified green gate | done — 40 `defined` specs swept; 4 promoted (2 enriched in place, 2 converted) + 3 new points at `ready`; 36 recorded as honest `defined`; one green-gate sweep commit |
| S5 | per-doc audits + first dissolutions (§4) | orchestrator-verified green gate over the regenerated Design Review | planned |
| S6 | adversarial review, remediation, full close, done-record | full chain + clean-clone; review archived | planned |

Owner ratification of every gate above happens at the phase PR review; no live owner acceptance
is claimed by this ledger.
