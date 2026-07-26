# Plan 20 — Self-hosting phase 3: the executable-specs rewrite, readiness maturation, and the first concept-doc dissolutions

> **Status:** ✅ EXECUTED — phase-3 implementation complete; the pre-close adversarial review is
> archived with every finding dispositioned and its four majors remediated. This is plan 20, the
> highest primary-numbered plan and the latest ✅ EXECUTED ground (superseding plan 18, whose
> phase-2 close carried plan 19's remediation). Build state lives in **`plans/`** — read the
> highest **primary-numbered** plan's status header, plus any **active subplans it (or its parent
> family) explicitly designates as current**; ignore unnumbered files and letter-suffixed plans
> only when no primary/active plan designates them. If that plan is DRAFTED, also read the latest
> ✅ EXECUTED plan for settled ground.
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

Terminal states are recorded at the close; every entry survives with a reason, fired or not.

| Watch item | Trigger | Ruling rule | Entry state | Terminal state (close) |
|---|---|---|---|---|
| table-sugar syntax | sibling-point authoring proves dishonest for a real law | rule Markdown syntax; preserve static sibling expansion semantics | watch — unfired | **unfired, survives** — 29 points were authored as siblings across fifteen laws and the 1–3 point budget was never pressed (S2 ruling 3, S3 ruling 4); no law needed more points than siblings gave it |
| single-literal vocabulary form | a real vocabulary slot needs one literal | rule only with a concrete fixture | watch — unfired | **unfired, survives** — S3 met the closed-union boundary in `spec:carrier.slot-notation` and stated it as a refusal in authored words instead of ruling syntax under fire (S3 ruling 4) |
| multi-entry constraint form | a real constraint needs more than one entry | rule carrier syntax + parity evidence together | watch — unfired | **unfired, survives** — no wave authored a constraint at all; the corpus holds one `constraint`-kind spec and it was untouched, so nothing forced the form |
| array-section prose sub-owner | a real spec needs prose beside array entries | rule with the forcing spec | watch — unfired | **unfired, survives** — every enrichment this phase fitted the existing owners (rule lines, model terms, `## Example space`); the prose-ownership rule was stated, never stretched |
| Markdown Pack syntax | a Pack needs Markdown authoring for a real caller | rule separately; Pack is not a kind | watch — unfired | **unfired, survives** — the pack manifest absorbed 29 new member ids as TS with no friction; no caller needed Markdown authoring, so the carrier rule's "Packs remain TS" default held on its own terms |

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
   line on its parent so its bound point reads against stated intent. **Corrected at S6 (review-09
   S-2):** that sentence over-claims for one of the three. The did-you-mean *suggestion* is
   ratified verbatim (`05` §2 check 1, "where possible"), but the **tie rule** the spec line adds
   ("names the unique nearest known id … and stays silent when two candidates tie") is not stated
   anywhere in the concept material; it is a legitimate reading of `05` §2's cross-cutting
   ambiguity-is-loud rule, and the spec line states that rationale, but it was authored here
   rather than carried in. Recorded as a derivation from a ratified principle, not as
   pre-ratified text; the clause stands and `suggestNearestId` already agreed with it.
   `pack-coherence` gained one
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

   **Corrected at S6 (review-09 P-1).** One item in that list was not true as written: the
   concreteness refusal was *not* among the clauses the S3 points exercised. Mutation testing
   showed `concreteness-refusal` stayed green with the unbound-slot refusal deleted, because its
   world ran under a parent owning an example space, where vocabulary resolution withholds the
   step contract for the same input — the point verified a disjunction of two gates and could not
   name which one fired. The honest statement for S3 is: the drift sweep confirmed the *other*
   four clauses; the concreteness clause was carried by `test/codegen.test.ts` alone, so no
   coverage was ever lost, but the executable claim was over-stated. Remediated in S6 by running
   the point under a parent that declares no shared vocabulary, which removes the second gate
   structurally rather than asserting around it — re-probed both ways (see the S6 log).
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

### 2026-07-26 — S5 (the per-doc concept-dissolution audits)

1. **An audit-script surface map follows its content to the carrying Spec; it is never blanket
   disabled.** *Forcing material:* three standalone audit scripts pin concept-doc text.
   `check-carrier-truth.mjs` enumerates `docs/concept/*.md` from disk, so a deleted doc drops out
   of the scan by itself — but its CLAIMS entries would fail unreadable and its classification
   RULES would fail as stale audit entries, so both sets are retired with the doc.
   `check-prose-schema.mjs` and `check-carrier-rule.mjs` instead pin *laws*, and a law that moved
   into a Spec is still pinnable. *Disposition:* the narrative-ownership and constraints-omission
   pins re-point to `spec:carrier.prose-ownership-rule`; the schema-version pin re-points to
   `spec:extraction.schema-versioning` (the version literal was already pinned independently on
   `src/graph/schema.ts`, so nothing weakened); the logical/physical relations pin re-points to
   `spec:carrier.envelope-contract`. That last one is the only case where a **verbatim-sameness**
   assertion across two surfaces became one verbatim surface (JS-A1) plus one surface stating the
   same law in its own authored words — recorded here because it is a real, deliberate change in
   what that check proves, not a silent map edit. Two surfaces remain pinned; no check lost a leg.
   No ADR test is met — the base already forced it — so it stays a plan record.
2. **A doc-level law duplicated into a *surviving* concept doc is expository, not a gap.** *Forcing
   material:* `03` §5 duplicates `01`'s git-is-the-event-log principle, and `07` §§1–4 duplicate
   `00`'s MVP boundary and cut list. The §4 audit design already anticipated this shape for `03`
   §5. *Disposition:* a row whose law is carried by a surviving surface reads `expository-only` and
   names that surface; a row whose law is carried **nowhere** reads `gap`, whether or not the
   prose is duplicated. Applied uniformly across all five audits.
3. **The phase-2 prediction for `03` §5 was closed before this session, not by it.** The plan's §4
   ranking expected §5 ("git is the event log") to be `03`'s one uncarried section. The audit found
   it carried by the `spec:extraction.derive-graph` narrative — current projection, removed means
   gone, `supersedes` the one forward pointer — **landed in phase 2 on `main`** and visible on the
   regenerated Design Review page. Recorded so the ranking is reconciled rather than quietly
   overtaken. (**Corrected at S6, review-09 D-6:** this entry first read "the phase's earlier
   corpus work," which in a phase-3 plan reads as phase 3. This branch never edited
   `specs/extraction/derive-graph.sdp.md`; the carriage predates it. The headline — closed before
   this session, not by it — was and remains accurate.)
4. **`07` is not deletable on supersession grounds.** The phase-2 docket's `SUPERSEDED` row is a
   *doc-repair* disposition, not a statement about the document, and the dissolution decision
   admits only one basis: the semantic contract is fully carried. Audited on content, `07` carries
   five gaps (§4's two open questions, §5's prioritization heuristic, §6 ①'s diagnostic rendering
   rule, §6 ③'s banner, §6 ④'s view-label rule), so it stays. Recorded because the plan named it
   the likeliest deletion.
5. **No drift found, and no Spec was edited.** Every law the audits traced agreed with its carrying
   Spec; no concept-doc statement contradicted a Spec, so no drift finding was raised. Eleven gaps
   are recorded in §7 as future corpus work; none was closed by rushing content into a Spec, per
   the session's standing constraint. The registry pre-repair (D1/D2 re-pointed to
   `spec:model.core-model` and `spec:model.spec-sections`) is the session's only non-sweep edit,
   and `check-self-hosting-gates.mjs`'s DECISIONS.md pins were verified before it was committed.

### S6 (the adversarial review, its remediation, and the close)

1. **A point is made honest by removing the competing gate from its world, never by asserting
   around it.** _Forcing material:_ review-09's P-1 — `concreteness-refusal` stayed green with the
   concreteness law deleted, because its probe world ran under a parent owning an example space,
   where `resolveExampleVocabulary` withholds the step contract for the same input. Two fixes were
   available: add a Then step asserting that generation reports **no**
   `contracts/unmatched-vocabulary-step` finding, or change the world so the second gate cannot
   fire. The first was rejected: an absence assertion pinned to a finding id goes vacuous the day
   that id is renamed, which is the same class of defect one rung down. _Disposition:_ the parent
   offers a second Given — a parent that declares no shared vocabulary — and the point uses it. The
   vocabulary gate is then structurally absent (the resolver returns no issues when no `refines`
   parent owns a space), so the withheld contract can only be the concreteness law's doing.
   Re-probed both ways: deleting the unbound-slot refusal turns that point red and no other test in
   the suite; disabling the vocabulary gate leaves it green, which is honest, because the point does
   not name that law. No ADR test is met — the base already forced it — so it stays a plan record.
2. **The concreteness law's scope was stated, because the honest world depends on it.** The point
   now runs under a parent with no vocabulary, so `spec:extraction.executable-contracts` says in its
   own words that the concreteness law reads the example's own form alone and refuses with or
   without a parent vocabulary, and that vocabulary resolution is a separate, later gate whose
   withholding names its own finding. This is a scope clarification of a ratified law rather than a
   new law — but it was written down deliberately, because a reader of the point should not have to
   infer from code why the parent has no space.
3. **A tautological Then step is coverage that does not exist, so it was removed rather than
   ratified.** _Forcing material:_ review-09's P-2 — the schema-version point's second Then compared
   the serialized payload against the engine's own exported constant, so both sides moved together
   under every mutation. _Disposition:_ the step is gone from the parent vocabulary, the point, the
   binding, and the oracle; the authored `"0.4.0"` literal remains and still dies when the constant
   is bumped (re-probed). Removing a vocabulary step is not weakening coverage when the step could
   not fail on its own — ruling 1's "conversion must never weaken coverage" is about *assertions
   that can fail*, and this one could not.
4. **Two audit rows were made true by enrichment, not by retraction.** _Forcing material:_
   review-09's D-2 and D-3 — both rows carried a deletion-authorizing `carried` verdict while
   resting on a surviving concept doc plus code (`05` §3 + `readiness-floor.ts`) or on a file that
   does not hold what the row claimed (`src/ids.ts` has no namespace *set*). Retracting the
   verdicts would have unpicked two clean deletions over a citation defect; widening the
   dissolution criterion by plan ruling — which S5 had effectively done — substitutes a weaker test
   than the decision states. _Disposition:_ the missing laws were authored onto their honest
   carriers, in their own words and from intended truth: the `ready` floor's three clauses and the
   vacuous-anchor reading onto `spec:validation.readiness-floor`, the one-oracle-per-space clause
   onto `spec:validation.verification-linkage`, and the per-binding-direction reserved namespace
   set plus the `doc:` reservation onto `spec:model.stable-ids`. The two deletions now stand on the
   dissolution decision's own terms. What could **not** be honestly carried was not forced: the
   three lower floor rungs and the per-kind evidence table remain uncarried and stay recorded as a
   narrowed gap 1.
5. **`doc:`'s status was stated as it is, not as the deleted doc described it.** `src/ids.ts` mints
   no `doc:` identifier, `ref()` refuses one, and the grammar admits any lowercase namespace. The
   new clause therefore says the reserved set is the *builders'* law rather than the parser's, and
   that the `doc:` reservation is a named deferral rather than a landed namespace — with in-system
   decisions living under the `spec:decisions.*` convention, which until now was de-facto corpus
   practice stated by nothing.
6. **Ruling 7 was enforced where it binds hardest — on a Spec — and carried where it does not
   bind.** _Forcing material:_ review-09's R-1 found the temporal guard blind to `plan N`, `phase
   N`, and bare wave handles, with seven pre-existing non-exempt sites and **one Spec**
   (`spec:decisions.concept-docs-dissolve`, whose consequence read "never part of phase 1")
   carrying such tokens. _Disposition:_ the Spec is repaired in timeless language, because a Spec
   carrying a session-relative handle — visibly obsolete, since the deletion it defers has since
   happened — is exactly the case ruling 7 exists for. The seven source and registry sites and the
   guard's token list are carried on the standing temporal-guard docket row with the choice named:
   widen the guard and repair the sites, or narrow ruling 7's wording to what it enforces. Phase 3
   authored none of them, and inventing a guard rule at the close would be exactly the
   under-fire legislating this plan warns against.
7. **The clean-clone proof earned its place: it caught a lint exemption the phase never
   extended.** _Forcing material:_ the first close-time clone of this branch failed at the
   **lint** leg with 27 `no-unsafe-*` errors across the five bound suites S1–S4 added. The cause
   is order, not code: `lint` runs before `generate:self-hosting`, so in a room with no
   `generated/` the contract imports resolve to nothing and every `bindExample` call reads as an
   unsafe call. `eslint.config.js` already carried an exemption for exactly this — scoped by an
   explicit two-file list written when only two bound suites existed. Every later wave added
   suites without extending it, and no wave could see the omission, because a developed checkout
   always has `generated/` present. _Disposition:_ the exemption list now names all six suites
   that import `generated/contracts/` — the bound-suite half of `vitest-test.mjs`'s root
   contract-dependency row — and says so, so the two lists are read as the pair they are. It is
   deliberately still an explicit list rather than a `self-hosting-*` glob: the corpus oracle and
   the contracts self-check derive their graphs in memory, need nothing generated, and must keep
   full lint strength. This is a genuine gate hole the twelve-leg chain could not have found in
   place — precisely what §9 criterion 6 asks the clean-clone leg to prove — and the phase-2 close
   was not exposed to it, since both suites it had were listed.

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

### Executed delivery

The phase ran as six sequential sessions on `feature/protocol-self-application-phase-3`, each
closing green. What it delivered, against what it planned:

- **The executable-specs rewrite is systematic where the verify loop is honestly cheap.** Fifteen
  laws were converted to bound points across three tranches — the whole validation family (S1),
  the extraction / model / carrier cheap wins (S2), the three uncovered engine areas that first
  needed corpus additions (S3), and two more laws the readiness sweep found worth converting on
  law-shape rather than cheapness (S4). **29 new example specs**, each an immediate `gwt` point
  bound through a generated contract to a `specTest` anchor; **27** of them from the conversion
  ledger's thirteen rows plus **2** from S4.
- **Three specs were added and three enriched to carry laws no spec held.**
  `spec:extraction.example-runner` and `spec:carrier.slot-notation` are new (with the two new
  `impl:` anchors that bind them); `spec:extraction.executable-contracts`,
  `spec:carrier.envelope-contract`, and `spec:carrier.prose-ownership-rule` were enriched from
  one- and two-rule stubs into acceptance-grade specs **before** any promotion. The corpus went
  **58 → 87 specs**.
- **Readiness matured only where a verifier landed.** `7 ready / 51 defined` at the draft became
  **`51 ready / 36 defined`** at the close, in four steps that each rode their own wave's
  verifiers (69: 24/45 → 75: 34/41 → 84: 44/40 → 87: 51/36). Every `ready` spec carries
  `has-verifier`; the corpus reports **zero** `honesty/gaps` warnings.
- **Two concept docs dissolved, three stayed on their own audit's evidence.** `02-core-model.md`
  and `03-the-one-graph.md` were deleted with full reference sweeps; `05`, `06`, and `07` stay
  with their gaps recorded rather than papered over.
- **Nothing weakened.** No test file was deleted, no residual vitest suite lost a case, and the
  golden oracle grew by transcription only — no assertion removed, no exact matcher loosened.

**Ledger terminal states.**

- **§2 conversion ledger:** all thirteen rows **done**; every delivered point count sits inside
  its planned range. No row was deferred or dropped.
- **§6 S4 readiness-sweep ledger:** terminal as recorded — 40 `defined` specs swept, 4 promoted
  (2 enriched in place, 2 converted) plus 3 new points at `ready`, and 36 recorded as honest
  `defined` with a per-spec reason. S6 promoted nothing: its enrichments landed laws on specs
  already `ready`, so the readiness distribution is unchanged from S4's close.
- **§4 / §7 audit ledger:** five audits recorded, terminal — `02` **deleted** · `03` **deleted** ·
  `05` **stays, gaps recorded** · `06` **stays, gaps recorded** · `07` **stays, gaps recorded**.
  Four audit-row citations were corrected at S6 and one row re-verdicted (see the disposition
  table in `reviews/09-self-hosting-phase-3-pre-close-review.md`).

### Recorded gaps carried out of the phase

The eleven gaps S5 recorded stand, with two amendments made at S6: **gap 1 narrowed** (the `ready`
rung's clauses now stand on `spec:validation.readiness-floor`; the three lower rungs and the
per-kind evidence table remain uncarried) and **gap 12 added** (the Mermaid and reference-projection
surfaces of `06` §1, conceded inside a `carried` row at S5 and re-verdicted at S6). Two further
contracts entered no gap list because S5 graded them `carried` in error — the `03` §1 edge
contract's readiness-effect and `models`-uniqueness clauses, and the `02` §5 namespace set with the
`doc:` reservation. Both were **closed at S6 by enrichment**, so they neither survive as
mis-gradings nor join the list. The full list is under "Gaps carried out of S5" below, as amended.

### Adversarial review and remediation

An adversarial review over the full branch diff is archived at
`reviews/09-self-hosting-phase-3-pre-close-review.md`. Its central method was **mutation testing**,
not code reading: a sandbox copy of the branch, its engine broken one law at a time across 37
mutations, with the new bound points re-run after each. Verdict: sound to close once the four
majors were dispositioned; **26 of 27** points were provably mutation-sensitive to the law they
name.

All fifteen findings carry an explicit disposition in that document's table. Ten were fixed, one
record was corrected, one was accepted as stated, and three are carried with stated reasons (an
immutable commit subject, the oracle-granularity docket row, and the temporal guard's token list).
The four majors: **P-1** the concreteness point made discriminating and re-probed; **D-1** the last
bare-form `02` citation repaired with the sweep re-run over both citation forms; **D-2** and **D-3**
closed by enriching the honest carrying specs so the two deletions rest on executable Specs, as the
dissolution decision requires, rather than on a plan ruling that widened the criterion.

### The docket close

| Docket row | Disposition at close |
|---|---|
| Markdown Pack syntax ruling | **carried** — the watch item never fired; the pack manifest absorbed 29 new members as TS with no friction, so no caller has yet needed Markdown Pack authoring |
| the gen-1 `.feature` adapter | **carried** — untouched this phase; the deferred tail was never forced by a wave |
| the no-reparse read seam | **carried** — untouched; `spec:extraction.regenerability` still carries the law and no consumer re-parses source today |
| temporal-guard token assembly | **carried, with the choice now named** — review-09 R-1 measured the guard's blindness (`plan N`, `phase N`, month names, bare wave handles) and found seven pre-existing non-exempt sites. The one **Spec** instance was repaired at S6; the rest needs a deliberate call: widen the guard's token list and repair the sites, or narrow §1 ruling 7's wording to what the guard enforces. Not decided at a close, on purpose |
| the editor-association gap | **carried** — named out of scope at the draft and never forced |
| corpus-test granularity (review-08 R-28) | **carried, with a stated reason and a measurement** — review-09 R-3 is right that every wave reached this row and none dispositioned it, and that the condition worsened: `test/self-hosting-graph.test.ts` grew from 2,287 to **3,888** lines and is still a single `it()` with frozen absolute counts, so the first failure masks the rest. It is carried rather than closed because splitting the oracle is a single-purpose session over the one artifact every wave's correctness claim rested on; churning it mid-phase would have put the phase's own evidence under the knife. The row rolls forward **with this reason recorded**, which is the thing S5 failed to do |
| control-character latitude | **carried** — recorded-only at review-08 and untouched since |
| the separate example id namespace | **carried** — 29 example specs were authored under the existing two-segment convention with no collision and no pressure for a separate namespace; the row survives as a watch, not a want |

### Close evidence

- **Graph:** `87 specs · 1 pack · 65 anchors → 153 nodes · 294 edges`, **0 errors · 0 warnings**,
  regenerated from a clean tree. Node mix: 87 `Primitive`, 1 `Pack`, 35 `Anchor`, 30 `CodeNode`.
- **Readiness histogram:** `ready: 51 · defined: 36` over 87 specs (`idea: 0 · scoped: 0`). All 51
  `ready` specs carry `has-verifier`; so do all 29 example points and all 15 converted parents.
- **Kind mix:** `example: 29 · decision: 21 · rule: 14 · behavior: 12 · model: 8 · contract: 1 ·
  workflow: 1 · constraint: 1`.
- **Tests:** **559 passing** across 41 files under the wrapper's two legs (505 in the parallel pool,
  54 in the dedicated CLI process); zero skipped, zero deleted this phase.
- **Gate:** the full twelve-leg `npm run check` green in the working checkout, and green again in
  a **clean clone** — `git clone --no-local` of this repository into a scratch root outside it,
  `npm ci`, then the whole chain — at the close commit `268d1cb`. The clone reproduced the same
  numbers (87 specs · 1 pack · 65 anchors → 153 nodes · 294 edges, 0 errors · 0 warnings; the
  example corpus at 11 specs with its one recorded `invalid-cart` warning; 505 + 54 tests; a clean
  `preflight` and an empty `git status`), which is the determinism claim proved rather than
  asserted. The **first** clone run failed at the lint leg and found a real gate hole — the
  clean-room contract exemption had never been extended past the two bound suites that existed
  when it was written (S6 ruling 7). It was fixed, re-committed, and re-cloned; only the record of
  the result follows the proven commit.
- **Review:** `reviews/09-self-hosting-phase-3-pre-close-review.md`, with its disposition table
  filled and a remediation addendum.

### The per-doc concept-dissolution audits (S5)

Five audits, one table per candidate doc, built to the §4 template and judged over the
regenerated Design Review (`npm run build && npm run generate:self-hosting`, then the carrying
specs' `generated/design-review/spec/*.md` pages read directly). The governing criterion is the
dissolution decision (`spec:decisions.concept-docs-dissolve`): a doc may be deleted only once its
semantic contract is fully carried by Specs and lean registries — never a bulk purge. A `gap` is a
stated law or contract no Spec, registry, or code+test surface carries, and one gap blocks
deletion. `expository-only` is restatement, motivation, or worked narrative whose law is carried
elsewhere; where the elsewhere is a *surviving* concept doc, the row names it.

**Terminal dispositions:** `02` **deleted** · `03` **deleted** · `05` **stays — gaps recorded** ·
`06` **stays — gaps recorded** · `07` **stays — gaps recorded**.

#### `02-core-model.md` — verdict: fully carried · **deleted**

| Doc section | Carrying surface (spec / registry / code) | Verdict |
|---|---|---|
| §1 the `Spec` primitive — one authored truth-primitive, enrich in place, envelope minimal and stable, sections optional | `spec:model.core-model` (Spec · envelope) · `spec:decisions.one-primitive` · `src/model/spec.ts` | carried |
| §1 carrier note — logical relations optional, physical Markdown writes `relations: {}` | `spec:carrier.envelope-contract` (the explicit-`relations: {}` clause) | carried |
| §1 the two other authored things (`Pack`, `anchor`) | `spec:model.pack-aggregate` · `spec:model.anchors` | carried |
| §1 the TS `Spec` type block | `src/model/spec.ts` | expository-only (representation of the typed shape) |
| §2 the three descriptors and their value sets | `spec:model.core-model` (kind · altitude · readiness) · `CONTEXT.md` "Descriptor values locked" · `src/model/descriptors.ts` + `test/descriptors.test.ts` | carried |
| §2 "why the enums look the way they do" (altitude is a clean ladder · no `quality` alias · capability/domain are projections · NFR and Scenario are labels) | `spec:decisions.one-primitive` (named coordinates; domains and capabilities are projections or Packs) · `CONTEXT.md` "named coordinates" table | carried |
| §2 readiness vs delivery facts; the `implemented`/`has-verifier`/`observed` table and its does-**not**-mean column | `spec:model.core-model` (delivery fact) · `CONTEXT.md` "Delivery facts" table · `spec:extraction.derive-graph` (facts computed from resolving edges) · `spec:validation.authored-honesty` | carried |
| §2 the payoff queries (`ready ∧ ¬implemented`, `implemented ∧ ¬ready`) | `CONTEXT.md` "The payoff queries" | carried |
| §2 the liveness ladder (binding, never liveness; skip/quarantine is CI's) | `spec:decisions.binding-not-liveness` · `CONTEXT.md` "enabled verifier" | carried |
| §3 the section list and each section's concern | `spec:model.spec-sections` (section) · `CONTEXT.md` "Sections" · `src/model/sections.ts` (the typed shapes) | carried |
| §3 prose ownership — `narrative` on the Spec, `description` on the seven singular sections, `constraints` has no owner | `spec:carrier.prose-ownership-rule` · `spec:decisions.prose-ownership` | carried |
| §3 the `decision` section carries no `status` field | `CONTEXT.md` term ledger, Rejected (`status` — adoption arc is `readiness`, replacement is `supersedes`) · `spec:decisions.typing-law` | carried |
| §3 the typing law (floor-bearing sections are closed typed shapes; the criterion outlives the list) | `spec:decisions.typing-law` · `spec:model.spec-sections` (typing law term) | carried |
| §3 section ⟷ kind duality; sections carry content, relations carry linkage; promotion is exclusive | `spec:decisions.content-only-sections` · `spec:model.spec-sections` (content-only section · promotion) · `CONTEXT.md` "section ⟷ kind duality" | carried |
| §3 verifier semantics — direct, per-spec, never transitive; the enabled verifier is a resolving test binding | `spec:model.spec-sections` (`verifies` · enabled verifier) · `spec:extraction.derive-graph` (has-verifier only to its target) · `spec:validation.verification-linkage` + its two bound points | carried |
| §3 the worked enrich-in-place examples | — | expository-only (worked narrative; the law is the rows above) |
| §4 `Pack` — aggregate, states no truth, plain `framing`, many packs per spec, `belongsTo` derived, coherence not completeness | `spec:model.pack-aggregate` · `spec:decisions.pack-reified` · `spec:validation.pack-coherence` + its bound point | carried |
| §4 refinement vs the aggregate kept distinct | `spec:model.pack-aggregate` (refinement term) · `CONTEXT.md` "Two grouping mechanisms" | carried |
| §5 stable IDs — grammar, stability, uniqueness, string linkage, no history | `spec:model.stable-ids` (ready; `namespaced-round-trip` and `malformed-refusal` points) · `src/ids.ts` | carried |
| §5 the MVP namespace set and the `doc:` reservation | `spec:model.stable-ids` (**since S6**: the per-binding-direction reserved set — `spec:` · `pack:` · `impl:` · `api:` · `component:` · `test:` · `oracle:` — and the `doc:` reservation with its actual status) · `src/ids.ts` (`CODE_ANCHOR_NAMESPACES` and the per-builder singletons) · `CONTEXT.md` flagged ambiguities (`ref()` is spec-only; `doc:` deferral) | carried — **citation corrected at S6 (review-09 D-3)**: `src/ids.ts` holds no namespace *set* (one three-member code-anchor subset, four per-builder singletons, and a grammar admitting any lowercase namespace), and nothing carried the positive half of the `doc:` reservation or the `spec:decisions.*` convention. Both now stand on the Spec. |
| §6 the six authored relations, directions and meanings | `spec:model.relations` · `CONTEXT.md` "Relations" table (with the UML anchors) | carried |
| §6 `supersedes` only on decision specs; the kind-typed endpoints | `spec:model.relations` ("A current Decision Record points forward to the decision it replaces") · `CONTEXT.md` "Relations" table · `spec:extraction.derive-graph` narrative · `spec:validation.claim-separation` (the generic endpoint-contract rule) · `src/validate/validators.ts` | carried — **citation corrected at S6 (review-09 D-4)**: the contract was always carried, but the row named only the generic endpoint sentence and the validator source; the surfaces that actually state the kind-typed endpoints are now named first. |
| §6 the `doc:`-target named deferral (MD-16) | `spec:decisions.carried-evidence` ("external `doc:` targets remain deferred") · `CONTEXT.md` flagged ambiguities | carried |
| §6 derived edges never authored (`satisfies`, `belongsTo`); every authored relation is `declared` | `spec:extraction.derive-graph` · `spec:extraction.claim-taxonomy` (claim inheritance) · `CONTEXT.md` "Derived, never authored" | carried |

#### `03-the-one-graph.md` — verdict: fully carried · **deleted**

| Doc section | Carrying surface (spec / registry / code) | Verdict |
|---|---|---|
| §1 two pure steps; the extractor is the only component that reads source | `spec:extraction.derive-graph` (one derivation seam, no second graph) · `spec:extraction.build-pipeline` | carried |
| §1 what the extractor reads (declared carriers · anchors · the designed-in, MVP-empty inferred layer) | `spec:extraction.derive-graph` · `spec:model.anchors` · `spec:extraction.claim-taxonomy` (inferred advisory) · `spec:extraction.excludes` (discovery surfaces) | carried |
| §1 the graph is flat; hierarchy is edges, never nested nodes | `spec:extraction.derive-graph` (flat typed arrays) | carried |
| §1 the `graph.json` payload sample and the `nodeType`/`specKind` split | `src/graph/schema.ts` · `CONTEXT.md` "`nodeType` / `specKind`" | carried (sample itself expository) |
| §1 schema `0.4.0` prose fields and fixed serializer key order | `spec:carrier.prose-ownership-rule` (owners) · `src/graph/schema.ts` · `spec:extraction.determinism` | carried |
| §1 the edge contract — one row per edge type (source, claim, authoring surface, severity, readiness effect, delivery-fact effect) | `spec:extraction.derive-graph` (endpoints, anchor-derived edges, computed facts) · `spec:validation.claim-separation` (claims + endpoint contracts) · `spec:validation.referential-integrity` (missing target is an error) · `spec:validation.verification-linkage` (the enabled-verifier condition **and, since S6, the one-oracle-per-space clause**) · `spec:validation.pack-coherence` (`belongsTo`) · `spec:validation.readiness-floor` (**since S6**, the three `ready`-floor clauses in its own authored words — the readiness-effect column) | carried — **citation corrected at S6 (review-09 D-2)**: the row first cited `spec:validation.readiness-floor` **+ `05` §3**, and the floor Spec was then a single clause-free sentence, so the readiness-effect column rested on a surviving concept doc plus `readiness-floor.ts` rather than on a Spec. The two clauses now stand on the Spec, and the `models` uniqueness clause — previously only a validator message — stands on `spec:validation.verification-linkage`. |
| §1 delivery facts are node facts, not edges | `spec:extraction.derive-graph` ("computed node facts") · `spec:extraction.claim-taxonomy` | carried |
| §2 determinism — byte-identical output, sort order, no wall-clock or run hashes, `--check-clean` | `spec:extraction.determinism` (all three rules) · `spec:extraction.regenerability` | carried |
| §2 the static-extractability consequence and the two tiers, with the per-carrier asymmetry | `spec:extraction.determinism` (rule 3) · `spec:carrier.markdown-parser` (whole-document refusal) · `04` §1 (surviving) | carried |
| §3 the `claim` table — declared / anchored / inferred | `spec:extraction.claim-taxonomy` (all three terms verbatim in law) | carried |
| §3 inference is never authoritative; no 4th claim; computed-from-authored inherits its source's claim | `spec:extraction.claim-taxonomy` (claim inheritance) · `spec:validation.claim-separation` + its two bound points | carried |
| §3 ambiguity is loud | `spec:validation.duplicate-ids` + its bound point · `spec:validation.referential-integrity` | carried |
| §3 delivery facts derived, never declared | `spec:validation.authored-honesty` + its two bound points · `spec:extraction.claim-taxonomy` | carried |
| §3 the doc-generator contrast blockquote | — | expository-only (motivation) |
| §4 regenerability, no consumer re-parses source, single JSON, graph DB deferred | `spec:extraction.regenerability` (clause for clause, including both measured-evidence lines) | carried |
| §5 git is the event log — current state only, history is a git operation, removed means gone, `supersedes` the one kept forward pointer | `spec:extraction.derive-graph` narrative (renders in the Design Review) · `spec:model.stable-ids` (IDs carry no history) · `01` founding principle 5 (surviving) · `CONTEXT.md` "git is the event log" | carried — the phase-2 prediction that §5 lacked a carrier was already closed by the narrative enrichment that landed in phase 2 on `main` (corrected at S6, review-09 D-6) |
| §5 "a graph diff is just two projections" | `spec:extraction.determinism` + `spec:extraction.regenerability` (the diff is their consequence) | expository-only (consequence; the aspirational impact UI is named in `00`/`07`) |
| §6 minimal schema versioning | `spec:extraction.schema-versioning` (ready; `declared-version` point) · `src/graph/schema.ts` | carried |

#### `05-validation-and-honesty.md` — verdict: **gaps** · stays

| Doc section | Carrying surface (spec / registry / code) | Verdict |
|---|---|---|
| §1 the two check families; errors fail the build, gaps inform; checked, never workflow-gated | `spec:validation.two-check-families` + its `split-report` point | carried |
| §1 the layered-enforcement table (types · schema · graph validators; architecture and custom rules aspirational) | `spec:validation.two-check-families` (the layering rule) · `spec:decisions.typing-law` · aspirational rows carried by §6 below | carried |
| §2 the one-validation-path paragraph (no pre-graph seam; per-carrier authoring feedback) | `spec:decisions.one-validation-path` · `spec:validation.two-check-families` | carried |
| §2 checks 1–2 (referential integrity with did-you-mean · duplicate IDs) | `spec:validation.referential-integrity` + `dangling-target` and `did-you-mean` · `spec:validation.duplicate-ids` + `dual-carrier` | carried |
| §2 check 3 (`claim` separation, endpoint contracts, fail-closed descriptors) | `spec:validation.claim-separation` + `collapsed-edge-claim` and `unratified-descriptor` | carried |
| §2 check 4 (`verifies` linkage) | `spec:validation.verification-linkage` + `unbound-example` and `unresolved-oracle` | carried |
| §2 checks 5–6 (authoring-shape and derived-facts honesty) | `spec:validation.authored-honesty` + `section-authored-fact` and `unearned-stated-fact` | carried |
| §2 check 7 (honest readiness) | `spec:validation.readiness-floor` | carried |
| §2 checks 8–9 (orphans · readiness/delivery gaps) | `spec:validation.warn-level-signals` + `orphan-signal` and `ready-gap-signal` | carried |
| §2 partial failure stays local | `spec:carrier.markdown-parser` (excludes one malformed carrier, continues healthy siblings) · `spec:extraction.determinism` | carried |
| §3 the kind-blind clause table (`idea`/`scoped`/`defined`/`ready` rungs) | the `ready` rung: `spec:validation.readiness-floor` (**since S6** — its three clauses in authored words) · the `idea`/`scoped`/`defined` rungs: none — their clauses live in `src/validate/readiness-floor.ts`, which the registry rows MD-13 and MD-9 cite **together with `05` §3** as the mirror pair | **gap** (narrowed at S6 to the three lower rungs) |
| §3 the per-kind evidence table (7 kinds × `scoped`/`defined`) | same as above — `spec:decisions.kind-conditional-floor` states *that* one clause is kind-conditional, never *which* evidence each kind names | **gap** |
| §3 the three bounding laws (monotonic · promotion-neutral · convergence is honest) | `spec:decisions.kind-conditional-floor` (consequence line) · `spec:decisions.carried-evidence` (the promoted-evidence honesty bound) | carried |
| §3 the MD-13 representation note (floor table as its own code-level source of truth) | `docs/concept/DECISIONS.md` MD-13 · `src/validate/readiness-floor.ts` | carried (registry row still cites `05` §3 as one of two mirrors) |
| §3 `ready` is earned, not asserted, and is not a delivery fact | `spec:validation.readiness-floor` · `spec:decisions.binding-not-liveness` | carried |
| §3 `ready` is the floor plus a human's declared statement; no review fact is stored | `spec:consumers.design-review` (rule 3) · `spec:decisions.binding-not-liveness` | carried |
| §3 stated vs derived readiness — the banner fires only in the dishonest direction and names the first unmet clause | `CONTEXT.md` "derived readiness" carries *rendered beside, never overwriting*; nothing carries the one-direction rule or the first-unmet-clause rule | **gap** (shared with `06` §5 and `07` §6 ③) |
| §4 pack coherence, not member completeness; no duplicated-intent check | `spec:validation.pack-coherence` + its point · `spec:model.pack-aggregate` · `spec:validation.two-check-families` (never judges content quality) | carried |
| §5 validator self-testing (should-fail and should-pass fixtures per validator) | none — a stated practice with no Spec, registry, or pinned code surface | **gap** |
| §6 aspirational tiers (architecture enforcement · custom team rules · NFR-to-`observed` · `--lenient` · incremental builds) | `00` §4 and `07` §2/§3 (surviving) name all five; the cache bound is `spec:extraction.regenerability` | expository-only against `00`/`07` |
| §7 what CI guarantees at MVP | §2 rows above · `spec:extraction.determinism` | expository-only (summary) |

#### `06-consumers-and-projections.md` — verdict: **gaps** · stays

| Doc section | Carrying surface (spec / registry / code) | Verdict |
|---|---|---|
| §1 projections fan out from one graph; nothing is a second source | `spec:consumers.projections-model` (projection) | carried |
| §1 the surfaces taxonomy table | `spec:consumers.projections-model` · `CONTEXT.md` "Surfaces & projections" | **gap** (partial) — the taxonomy is carried except the Mermaid and reference-projection rows, which only `06` §8 names. **Re-verdicted at S6 (review-09 D-7)**: a row conceding an uncarried surface may not read `carried`; `06` stays either way, and the conceded surface now enters the gap list as item 12. |
| §2 curated graph vs impact graph; divergence is curation, not drift; never densify from imports | `spec:consumers.projections-model` (curated graph · impact graph · curation · measured curation) · `spec:extraction.claim-taxonomy` | carried |
| §2 the impact graph's two assist roles (propose candidates · flag unambiguous drift) | none | **gap** |
| §2 the MVP boundary blockquote (file-level impact rides the curated graph; `coverage-unknown` is explicit) | `spec:consumers.reader` (rules 3–4) | carried |
| §3 the agent surface — a visible typed graph, the schema is the contract, no verb wall, neither failure mode | `spec:consumers.agent-surface` · `spec:decisions.agent-surface-scripts-graph` | carried |
| §3 the reader — joins and claim decode once, persists nothing; entry adapters; blast radius; irreducible joins | `spec:consumers.reader` (all four rules) · `spec:consumers.agent-surface` (rules 2–3) | carried |
| §3 the second-caller bar (freeze a typed contract only when a second machine consumer appears) | `00` §4 and `07` §1/§3 (surviving) | expository-only against `00`/`07` |
| §3 `bySymbol` is frozen in shape but aspirational in build | none — `spec:consumers.reader` names `findByConcept` and `byFile` only | **gap** |
| §3 measured context efficiency | `spec:consumers.agent-surface` (rules 4–5, measured evidence) | carried |
| §4 the edit model — intent composition, no patch loop, lifecycle ops are git + edit | `spec:consumers.edit-model` (all four rules) | carried |
| §5 Design Review renders a Spec/Pack in context; pure projection with no stored `Finding`; the human's call, never a gate; deterministic generated Markdown | `spec:consumers.design-review` (rules 1–5) | carried |
| §5 the per-spec field list — the stated-vs-derived readiness divergence banner | none (see `05` §3 and `07` §6 ③) | **gap** |
| §5 pages rewritten wholesale each run so no stale page survives | none — `spec:consumers.design-review` rule 4 names the index-and-pages shape and determinism, not the wholesale rewrite | **gap** |
| §5 owned prose reaches Design Review through the graph and Reader with no source reparse | `spec:carrier.prose-ownership-rule` · `spec:consumers.design-review` · pinned by `check-prose-schema.mjs` | carried |
| §6 delivery-process nouns as projections and vocabulary, never gates | `spec:consumers.projections-model` (discipline · release · baseline · phase/iteration/milestone) · `CONTEXT.md` "Delivery-process vocabulary" | carried |
| §6 the discipline ≈ kind/section mapping (Requirements → `behavior`, Test → `example` + `verifies`, …) | none | **gap** |
| §6 the disciplines × phases × iterations distribution chart as an analytical projection | none | **gap** |
| §7 the MCP surface — designed-in, deferred, distinct from the agent surface | `spec:decisions.mcp-deferred` · `CONTEXT.md` "MCP surface" | carried |
| §8 aspirational projections (Spec Studio · contract/model exports · AI slices · per-PR hosted preview) | `00` §4 and `07` §2 carry the first three; nothing carries the per-PR hosted preview | **gap** (per-PR preview only) |
| §9 interop posture — the membrane, not a replacement | `00` §2/§5 (surviving) | expository-only against `00` |
| §10 what the MVP consumer story proves | §§1–5 rows above | expository-only (summary) |

#### `07-mvp-roadmap-and-open-questions.md` — verdict: **gaps** · stays

The phase-2 docket recorded `07`'s *doc-repair* row as SUPERSEDED; that disposition is about the
repair bill, not about the document, and it is not a deletion basis under the dissolution
decision. The audit therefore ran on content, and found gaps.

| Doc section | Carrying surface (spec / registry / code) | Verdict |
|---|---|---|
| §1 the MVP vertical slice, the slice table 0–5, the package line | `AGENTS.md` "The build path" (the same slice table) · `00` §3 | expository-only against `AGENTS.md`/`00` |
| §1 what "done" looks like and the North Star | `00` §3 ("Done" for the MVP) · `spec:protocol.self-hosting` · `spec:extraction.build-pipeline` | expository-only against `00` |
| §2 the CORE vs ASPIRATIONAL map, with the carrier addendum | `00` §3/§4 · `spec:decisions.carrier-ruling` | expository-only against `00` |
| §3 the cut list, nine items with rationale | `00` §4 (the same nine, condensed, with per-item rationale) | expository-only against `00` |
| §4 derived-readiness banner timing (recorded as resolved) | `05` §3 (surviving) — but see the banner gap recorded there | expository-only against `05` |
| §4 impact-graph depth (recorded as resolved) | `06` §2 (surviving) · `spec:consumers.reader` | expository-only against `06` |
| §4 inline-vs-centralized anchor semantics (open) | none — `spec:model.anchors` states the landed binding contract and the unextracted forms, not the open question about further structural semantics | **gap** |
| §4 graph-DB timing (open, measured) | `spec:extraction.regenerability` (both measured-evidence lines) | carried |
| §4 trace-link recovery — assistive suggestion only, never a declared edge | `01` P10 (surviving) · `spec:extraction.claim-taxonomy` (inferred is advisory, never authoritative) | expository-only against `01` |
| §4 when (if ever) harnesses / evidence become CORE (open) | the Gherkin half is `spec:decisions.carrier-ruling`; the harness/evidence half has no carrier | **gap** |
| §5 measure what actually hurts (the four pain-to-next-slice mappings) | none — a prioritization heuristic with no Spec or registry home | **gap** |
| §6 ① authoring ergonomics — typed sections | `spec:decisions.typing-law` | carried |
| §6 ① the one diagnostic rendering rule (location from the finding's structured fields; first contact fails clean) | none | **gap** |
| §6 ② the golden correctness oracle kept distinct from the determinism self-checks | `spec:extraction.determinism` (the self-checks) · `test/fixtures/checkout-v1/expected-graph.json` + `expected-design-review/` (the oracle, a code+test surface) | carried |
| §6 ③ the derived-readiness banner ships in the Design Review | none (the same gap as `05` §3 and `06` §5) | **gap** |
| §6 ④ `implemented` is a UI hazard — the fact name stays, views render binding language | `spec:decisions.binding-not-liveness` carries the do-not-rename half; nothing carries the view-label rule the Design Review actually implements | **gap** |
| §6 ⑤ `coverage-unknown` is acceptance, never a design note | `spec:consumers.reader` (rule 3) | carried |
| §6 the MVP acceptance checklist and its three pinned sharpenings | the three sharpenings are pinned test surfaces (the blocking-open-question should-fail fixture · the drops-no-sections extraction test · the `api:` anchor assertion) | carried |

#### Gaps carried out of S5 (future corpus work, not this session's)

Recorded so they are not lost; each is a stated law or open question with no carrying Spec.
None was rushed into a Spec — this session authored no Spec edits.

1. The readiness-floor **clause tables** (kind-blind rungs and the per-kind evidence table) have
   no carrying Spec; the clauses live only in `src/validate/readiness-floor.ts` and `05` §3.
   **Narrowed at S6 (review-09 D-2):** the `ready` rung's three clauses now stand on
   `spec:validation.readiness-floor` in its own authored words. The `idea` / `scoped` / `defined`
   rungs and the per-kind evidence table remain uncarried — that residue is the standing gap.
2. The **derived-readiness banner** rule — rendered beside stated, fires only in the dishonest
   direction, names the first unmet clause — is stated in `05` §3, `06` §5, and `07` §6 ③ and in
   no Spec.
3. The **`implemented` view-label rule** (the fact name stays; views render binding language) is
   stated only in `07` §6 ④, while the Design Review implements it.
4. The **one diagnostic rendering rule** (location from the finding's structured fields; first
   contact fails clean) is stated only in `07` §6 ①.
5. **Validator self-testing** (should-fail and should-pass fixtures per validator) is stated only
   in `05` §5.
6. Design Review's **wholesale page rewrite** (no stale page survives a run) is stated only in
   `06` §5.
7. The **discipline ≈ kind/section mapping** and the disciplines × phases × iterations
   distribution projection are stated only in `06` §6.
8. The impact graph's two **assist roles** (propose candidates · flag unambiguous drift) and
   `bySymbol`'s frozen-shape-but-aspirational status are stated only in `06` §2/§3.
9. The **per-PR hosted preview** deferral is stated only in `06` §8.
10. Two open questions have no Spec home: **inline-vs-centralized anchor semantics** and **when
    harnesses / evidence become CORE** (`07` §4).
11. The **measure-what-hurts** prioritization heuristic (`07` §5) has no Spec or registry home.
12. The **Mermaid and reference-projection surfaces** of `06` §1's taxonomy table are named only
    by `06` §8. **Added at S6 (review-09 D-7):** S5 conceded them inside a `carried` row instead
    of recording them, so the row is re-verdicted and the surface enters the list here.

#### Reference-sweep inventory (per deletion)

`03` — `CONTEXT.md` (2 glossary pointers) · `AGENTS.md` (the where-to-look row) ·
`docs/concept/README.md` (index row + reading path) · `01` · `05` (2) · `06` · `07` (3) ·
`jtbd-stories/03-one-graph.md` (4) · `jtbd-stories/07-trace-and-impact.md` (5) ·
`examples/checkout-v1/README.md` · `src/graph/schema.ts` (2) · `src/graph/delivery-facts.ts` (2) ·
`src/validate/validators.ts` (2) · `src/extract/derive.ts` (2) · `src/extract/reify.ts` (2) ·
`src/extract/index.ts` · `test/design-review.test.ts` · `test/validators.test.ts` ·
`test/reader.test.ts` (2) · `check-carrier-truth.mjs` (3 claims + 5 classification rules retired
with the doc) · `check-prose-schema.mjs` (2 pins re-pointed).

`02` — `CONTEXT.md` (5 section pointers + the MD-16 note + the header's doc-range sentence) ·
`AGENTS.md` (the where-to-look row and the glossary row) · `docs/concept/DECISIONS.md` (D1/D2,
landed as the pre-repair commit) · `docs/concept/README.md` (index row + reading path) · `01` (3) ·
`04` (4) · `05` (8) · `06` · six JTBD story files (14 reference lines) ·
`examples/checkout-v1/README.md` · `src/validate/validators.ts` (3, two of them user-visible
validator diagnostics) · `src/validate/readiness-floor.ts` · `src/graph/delivery-facts.ts` (2) ·
`src/reader/reader.ts` · `src/model/relations.ts` · `test/checkout-v1.test.ts` ·
`test/extract.test.ts` (a test title) · one extraction fixture comment ·
`check-prose-schema.mjs` · `check-carrier-rule.mjs`.

No dangling inbound reference survives either deletion. **Amended at S6 (review-09 D-1):** the
S5 sweep ran only the *backticked* citation form (`` `02` ``, `` `03` ``, `02-core-model`,
`03-the-one-graph`), and the repository uses two forms — the repo also cites bare, unbackticked
`02 §3` inside fenced code. One such line survived in `docs/concept/04`'s TS-carrier worked
example and is repaired. The sweep is now stated as it must be run: **both** forms, over every
tracked file outside `plans/`, `reviews/`, and `explorations/` — the bare-token pattern
`(^|[^0-9A-Za-z._/-])0[23]([^0-9A-Za-z._-]|$)` plus the backticked and path spellings
(`` `02` ``, `` `03` ``, `02 §`, `03 §`, `concept/02`, `concept/03`, `02-core-model`,
`03-the-one-graph`). Re-run at S6 over the repaired tree: **zero hits**.

## (k) §8 Docket ledger

Carried in from phase 2 (all remained open through S1–S5; none was adopted by a wave): the
Markdown Pack syntax ruling · the gen-1 `.feature` adapter · the no-reparse read seam ·
temporal-guard token assembly · the editor-association gap · corpus-test granularity (owned by
this program — dispositioned by the waves it reaches) · control-character latitude · the separate
example id namespace. Rows close only with reasons in §7.

**Closed at S6:** every row is dispositioned in §7's docket-close table. All eight are **carried**
into the next phase — none closed as done — but each now carries a stated reason rather than
rolling forward silently, which is what review-09 R-3 caught. Two rows gained substance in the
process: temporal-guard token assembly now names the decision it is waiting on, and corpus-test
granularity carries the measurement (`test/self-hosting-graph.test.ts` at 3,888 lines in one
`it()`) that will justify the session that finally splits it.

## (l) §9 Acceptance criteria

Graded at the close, after remediation. Review-09 graded 1 / 2 / 3 / 6 **PASS** and 4 / 5 / 7
**PARTIAL** pre-remediation; the partials are re-graded here against what actually landed.

1. **Executable-path facts, not claims:** every converted law's parent and child earn
   `has-verifier` through the executable path (anchored `verifies` from a bound test), visible
   in `generated/graph.json`; zero validation errors; contract generation deterministic under
   `--check-clean`. — **PASS.** All 15 converted parents and all 29 example points carry
   `has-verifier` in the regenerated graph; 0 errors; `check:self-hosting` and `check:example`
   both clean under `--check-clean`. Independently mutation-tested: 27 of 27 points now go red
   when the law they name is removed (26 confirmed by review-09, the 27th by S6's re-probe).
2. **Honest readiness:** every promotion clears the floor and carries a resolving verifier; the
   phase introduces no `honesty/gaps` warning; the closing readiness distribution is recorded. —
   **PASS.** 0 errors / 0 warnings — no `honesty/gaps` warning exists at all. All 51 `ready` specs
   carry `has-verifier` and clear the `ready` floor. Closing distribution `ready: 51 / defined: 36`
   over 87, recorded in §7 and re-measured off disk at the close.
3. **Coverage never weakens:** residual tests are deleted only where a bound contract honestly
   carries the assertion; the suite's law coverage at close is a superset of its opening
   coverage. — **PASS.** Zero test files deleted; case counts unchanged across all fourteen
   residual suites (verified against `main`); the only `test/` edits outside the new bound suites
   are reference-sweep comments and two frozen-fixture refreshes. The one removal at S6 — the
   schema-version point's tautological Then step — removed an assertion that could not fail, and
   its authored-literal twin still dies under mutation.
4. **Per-doc audits recorded for `02`, `03`, `05`, `06`, `07`;** deletions only where the audit
   verdict is fully-carried; no dangling inbound reference survives a deletion
   (`check-carrier-truth.mjs` and the full gate stay green). — **PASS after remediation**
   (PARTIAL at review time). Five audits recorded; only the two fully-carried docs deleted; all
   four standalone audit scripts and the full gate green. The two defects the review found are
   closed rather than argued: the one surviving bare-form `02 §3` citation is repaired and the
   sweep re-run over **both** citation forms with zero hits (D-1), and the two `carried` verdicts
   that rested on a surviving doc or on a file that did not hold the claim are now carried by
   enriched Specs (D-2, D-3) — so both deletions stand on the dissolution decision's own terms.
5. **Watch items:** any fired ruling is recorded; every unfired item survives with a reason. —
   **PASS after remediation** (PARTIAL at review time — the §5 table then carried entry states
   only). No watch item fired in six sessions; §5 now carries a terminal-state column, and each of
   the five items records *why* it stayed unfired rather than merely that it did.
6. **The gate holds throughout:** `npm run check` green at every blessed commit; the close runs
   the full chain plus a clean-clone proof; the wrapper dependency table and preflight targets
   are current. — **PASS.** The twelve-leg chain is green at the close; the pack manifest matched
   the spec files at every commit of the phase; the wrapper's per-tree dependency table and the
   preflight targets are current. The clean-clone proof is recorded in §10's S6 row.
7. **Records continue:** the conversion/readiness/audit ledgers are terminal; the docket rows
   are dispositioned or carried with reasons; an adversarial review over the full branch diff is
   archived under `reviews/` with remediation dispositions before close. — **PASS after
   remediation** (PARTIAL at review time). All three ledgers are terminal; all eight docket rows
   are dispositioned in §7 with reasons; the adversarial review is archived with every one of its
   fifteen findings dispositioned and a remediation addendum. The two record defects the review
   itself raised are answered on the record: the overstating commit subject is corrected in prose
   rather than by rewriting history (R-2), and the docket row that rolled forward five times now
   carries its reason and its measurement (R-3).

## (m) §10 Session and gate ledger

Sessions execute sequentially; each closes with a green gate, a regenerated Design Review, and a
commit series on the effort branch. This ledger is git process evidence, never graph content.

| Session | Delivers | Gate discipline | State |
|---|---|---|---|
| S1 | validation-family conversions (§2) + promotions that honestly clear | orchestrator-verified green gate | done — 11 points bound across 6 parents; three green-gate commits |
| S2 | extraction/model cheap wins (§2) | orchestrator-verified green gate | done — 6 points bound across 4 parents; one green-gate conversion commit |
| S3 | corpus additions (§3) + codegen/runner/notation conversions | orchestrator-verified green gate | done — 2 new specs + 1 enrichment; 7 points bound across 3 parents; 2 new `impl:` anchors; one green-gate conversion commit |
| S4 | readiness maturation sweep (ruling 5) | orchestrator-verified green gate | done — 40 `defined` specs swept; 4 promoted (2 enriched in place, 2 converted) + 3 new points at `ready`; 36 recorded as honest `defined`; one green-gate sweep commit |
| S5 | per-doc audits + first dissolutions (§4) | orchestrator-verified green gate over the regenerated Design Review | done — five audits recorded (§7); `02` and `03` deleted with their full reference sweeps; `05`, `06`, `07` stay with 11 gaps recorded as future corpus work; D1/D2 re-pointed; three green-gate commits |
| S6 | adversarial review, remediation, full close, done-record | full chain + clean-clone; review archived | done — review archived and all 15 findings dispositioned; four majors and seven minors remediated across two green-gate commits; §5 / §7 / §8 / §9 terminal records written; the twelve-leg `npm run check` green in the checkout and again in a clean clone at `268d1cb` after that clone caught, and the phase fixed, a clean-room lint hole (S6 ruling 7) |

Owner ratification of every gate above happens at the phase PR review; no live owner acceptance
is claimed by this ledger.
