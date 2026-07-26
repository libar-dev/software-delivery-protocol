# 09 - Self-hosting phase-3 pre-close adversarial review

**Reviewed:** the full `main...feature/protocol-self-application-phase-3` diff at `0ff991c`
(15 commits, 92 files, +5019 / −773), against `plans/20-self-hosting-phase-3.md` — its §1
engineering rulings and its §9 acceptance criteria are this review's yardstick.

**Method:** five adversarial dimensions, run in parallel. The central method for the phase's core
risk — verifier honesty — was **mutation testing**, not code reading: a full sandbox copy of the
branch was built outside the repository, its engine deliberately broken one law at a time
(37 mutations across five batteries), and the 27 new bound points re-run after each. A point counts
as honest only if it goes **red** when the law it names is removed. Every claim marked
**CONFIRMED** below was reproduced by a probe against the built product; nothing here rests on a
ledger or a receipt.

**Disposition:** compiled for the remediation session. No product file was changed by this review;
the working tree was clean at start and at finish. The disposition column of the table at the foot
is deliberately left open. (`reviews/` is Prettier-ignored and temporal-guard-exempt, so this file
is not format-policed and may carry dates and plan references.)

---

## Verdict

**SOUND TO CLOSE ONCE THE FOUR MAJORS ARE DISPOSITIONED. NO BLOCKER.**

The phase's central claim survives adversarial probing better than expected. **26 of the 27 new
bound points are provably mutation-sensitive to the law they name** — delete the validator, the
derivation rule, the grammar branch, or the constant each point claims to verify, and that point
goes red. None is a params-echo tautology; every Then step reads real engine output through a
public seam, and the world factories build inputs whose outcome the engine, not the factory,
decides. The graph bookkeeping is exact (pack manifest 87/87, all 29 new anchors top-level,
proximate and resolving, the golden oracle a faithful transcription with **zero** assertions
loosened), the residual vitest suites survive whole with no net case loss in any of the fourteen
checked files, all 51 `ready` specs carry `has-verifier`, the corpus holds at 0 errors / 0 warnings,
and every number in the §2 / §6 / §10 ledgers — including all five readiness distributions,
re-measured at their own commits — checks out exactly against git.

The majors are of two kinds, and none corrupts authored data or falsifies a derived fact today.
**One (P-1)** is a genuine verifier-honesty defect: a single point claims to execute the
concreteness law and stays green with that law entirely deleted — the precise failure mode this
phase exists to prevent, and it falsifies a recorded §6 ruling. **Three (D-1, D-2, D-3)** are
defects in the S5 dissolution record: one dangling reference that directly refutes the plan's own
sweep sentence and acceptance criterion 4, and two audit rows granted a deletion-authorizing
`carried` verdict on carriers that do not carry what the row says. Deletion is the one
irreversible-feeling act in this phase, so the rows that authorized it deserve to be exact — but
nothing left the repository, and the surviving docs the rows lean on are themselves gated by the
same rule, so the exposure is bounded and self-correcting.

Acceptance criteria 5 and 7 are **not yet met** — but honestly so: both are S6 deliverables and S6
is marked `planned`. Archiving this review is part of discharging criterion 7.

---

## Dimension 1 — Verifier honesty (mutation-tested)

Every one of the 27 new bound points was subjected to at least one mutation aimed at the law its
spec names. Confirmed kills:

| Point | Mutation that killed it | Killed |
|---|---|---|
| `warn-level-signals.orphan-signal` | `checkOrphans` incident-edge guard inverted | ✓ |
| `warn-level-signals.ready-gap-signal` | `checkGaps` has-verifier guard short-circuited | ✓ |
| `referential-integrity.dangling-target` | missing-target branch disabled | ✓ |
| `referential-integrity.did-you-mean` | `describeMissingTarget` suggestion suppressed | ✓ |
| `authored-honesty.section-authored-fact` | section-interior smuggled-fact scan removed | ✓ |
| `authored-honesty.unearned-stated-fact` | stated-but-underived branch disabled | ✓ |
| `claim-separation.collapsed-edge-claim` | `satisfies` → `requireClaim("anchored")` removed | ✓ |
| `claim-separation.unratified-descriptor` | descriptor fail-closed made fail-open | ✓ |
| `verification-linkage.unbound-example` | (a) linkage finding suppressed · (b) enabled-example anchor requirement dropped | ✓✓ |
| `verification-linkage.unresolved-oracle` | (a) oracle-linkage id renamed · (b) `models` made to confer `has-verifier` | ✓✓ |
| `pack-coherence.incoherent-aggregate` | duplicate-member threshold relaxed 2→3 | ✓ |
| `two-check-families.split-report` | either family's producing check disabled | ✓ |
| `excludes.segment-boundary` | exact-prefix match degraded to substring | ✓ |
| `excludes.refused-path` | `InvalidExcludePathError` replaced by a silent skip | ✓ |
| `schema-versioning.declared-version` | `schemaVersion` literal bumped | ✓ |
| `stable-ids.namespaced-round-trip` | `formatId` drops the `#` sub-part | ✓ |
| `stable-ids.malformed-refusal` | lowercase-namespace refusal removed | ✓ |
| `markdown-parser.bounded-parity` | either carrier's finding class renamed | ✓✓ |
| `executable-contracts.multi-entry-example` | multi-entry degradation finding renamed | ✓ |
| `executable-contracts.case-colliding-path` | `files.clear()` withholding removed | ✓ |
| `example-runner.step-order` | plan executed in reverse contract order | ✓ |
| `example-runner.red-step-naming` | `at step:` prefix stripped from the failure | ✓ |
| `slot-notation.typed-declaration` | `typed` form collapsed to `bound` | ✓ |
| `slot-notation.refused-guess` | unparsable RHS guessed as `bound` instead of `malformed` | ✓ |
| `anchors.lookalike-refusal` | any relative import trusted as a builder source | ✓ |
| `anchors.physical-identity` | relative-import canonicalization disabled | ✓ |
| **`executable-contracts.concreteness-refusal`** | **concreteness law deleted — point stayed GREEN** | **✗** |

**What this rules out.** No point asserts the contract's own params back at itself: the shared
`namesFinding` / `familyReports` helpers read `validateGraph`'s real output and compare
`validatorId`, `severity`, and `family` against values authored in the spec, and no assertion is
satisfiable by the world factory alone. Two assertions that *looked* hard-wired were probed
specifically and are not: `unresolved-oracle`'s `conferred: false` dies the moment `models` edges
are made to confer `has-verifier`, and `unbound-example`'s dies the moment the enabled-example rule
drops its anchor requirement — both are exactly the "binding, never liveness" law.

**Nor do the bound suites weaken or drift from their residual twins.** `test/validators.test.ts`,
`test/exclude-diagnostics.test.ts`, `test/graph-schema.test.ts`, `test/ids.test.ts`,
`test/extract-parity.test.ts`, `test/codegen.test.ts`, `test/runner.test.ts`,
`test/notation.test.ts`, `test/anchor-trust.test.ts`, and `test/descriptors.test.ts` carry
identical case counts on `main` and `HEAD`; zero test files were deleted; the only edits under
`test/` outside the new suites are reference-sweep comments and two frozen-fixture refreshes. §1
ruling 1 held.

### P-1 (MAJOR) — the concreteness point is over-determined and passes with its own law deleted

**Where:** `specs/extraction/executable-contracts.concreteness-refusal.sdp.md`, bound at
`test/self-hosting-extraction.test.ts:381`. **CONFIRMED** by four probes.

The point's stated subject is unambiguous — intent: *"Execute the concreteness law where the
example leaves a declared slot unbound"*; parent rule: *"The concreteness law is a refusal, never a
guess — an example carrying an unbound slot in any used step of any entry is not the bindable form
and receives no step contract."* Its two Then steps assert `fileCount: 1` and `emitted: false`.

Both assertions are satisfied by **two independent engine gates**, and the point cannot tell them
apart. `generateContracts` withholds a step contract when `bindableScenario` returns undefined (the
concreteness law, `src/codegen/contracts.ts:562-568`) **and, separately,** when
`resolveExampleVocabulary` reports issues (`src/codegen/contracts.ts:903-916`). The probe world's
bare `{n}` step trips both.

Probe results:

- Delete the concreteness slot check
  (`if (parseSlots(text).some((slot) => slot.form !== "bound")) { return undefined; }`) →
  **all 8 tests in the suite still pass**; the only observable change is a new
  `contracts/unmatched-vocabulary-step` warning the point never reads.
- Bypass `bindableScenario` entirely (early-return the scenario) → **point still green**.
- Disable only the vocabulary gate → **point still green**.
- Disable **both** gates → the point finally goes red.

So the point verifies a disjunction, not the law it names, and it has no teeth on the concreteness
law at all. This directly falsifies §6 S3 ruling 5, which lists *"the concreteness refusal (space
contract emitted, step contract withheld)"* among the clauses the points exercise and reports
"no drift found" on that basis. Actual coverage of the law is not lost — `test/codegen.test.ts`
still holds it — so this is a verifier-and-record defect, not a coverage regression.

**Fix direction:** make the point discriminate — bind a used step whose skeleton *does* match the
parent vocabulary while leaving the slot unbound (so vocabulary resolution succeeds and only
concreteness can withhold), or add a Then step asserting that generation reports **no**
`contracts/unmatched-vocabulary-step` finding. Then re-run the mutation: a point that cannot be
killed by deleting its own law must not be recorded as exercising it.

### P-2 (MINOR) — one decorative Then step on the schema-version point

`specs/extraction/schema-versioning.declared-version.sdp.md`'s second Then step — *"the parsed
payload agrees with the engine's declared version: {agrees: true}"* — binds to
`expect(payloadOf(world).schemaVersion === schemaVersion).toBe(true)`
(`test/self-hosting-extraction.test.ts:218-223`), comparing the serialized payload against the
engine's own exported constant. Both sides move together under every mutation, so the step can only
fail if `serializeGraph` drops the field outright — which the *first* Then step (the authored
`"0.4.0"` literal) already catches, and catches strictly harder. The point as a whole is honest;
this step reads as coverage it does not provide. **CONFIRMED.**

---

## Dimension 2 — Spec-content honesty

**What held.** The S1 spec-side repairs are, on the whole, genuinely intent-backed rather than
promoted from code, and the S4 enrichment of the two carrier stubs is **true of the engine**, which
I probed rather than assumed:

- The fail-closed descriptor clause on `spec:validation.claim-separation` is near-verbatim ratified
  intent — `docs/concept/05` §2 check 3 already says *"The floor is never evaluated over an
  unratified descriptor (fail closed, never a crash or a silent skip)."*
- *"A non-resolving trace is named loudly and confers no delivery fact"* on
  `spec:validation.verification-linkage` is carried by the then-live `02` §2 (*"A `verifies` edge
  from a verifier that is not enabled … does not yield `has-verifier`"*) and `04` §2's oracle clause
  (*"the anchor confers no delivery fact"*).
- **Every clause added to `spec:carrier.envelope-contract` is true of the parser**, probed on live
  reifications: a missing `relations` / `readiness` / `altitude` key each refuses with
  `extract/invalid-frontmatter`; an out-of-set key refuses with `extract/unrecognized-property`; and
  all five derived names — `implemented`, `has-verifier`, `observed`, `deliveryFacts`, `claim` —
  refuse under `extract/reserved-property`, i.e. *"under its own finding class"* exactly as the new
  clause claims. (This also re-confirms review-08's R-6 remediation landed and held.)
- `spec:extraction.example-runner`'s most surprising clause — *"The core contributes `unspecified`,
  the one outcome no Spec ever states"* — is ratified material, not module JSDoc promoted into
  intent: `docs/concept/04` §4 and `CONTEXT.md`'s oracle row both carry it.
- **Readiness promotions are honest.** All 51 `ready` specs carry `has-verifier` in
  `generated/graph.json`; so do all 29 example specs and all 15 converted parents. The corpus
  reports zero `honesty/gaps` warnings. The closing distribution counted directly off frontmatter is
  `defined: 36 / ready: 51` over 87 — exactly what §6 S4 records — and the `ready` floor
  (`all-relations-resolve` · `depends-on-and-refines-targets-are-defined` · `anchors-resolve`)
  clears for every one. `spec:carrier.envelope-contract` and `spec:carrier.prose-ownership-rule`
  were correctly enriched **before** promotion rather than promoted as the one-line stubs they were;
  both are now acceptance-grade on their own terms.

### S-1 (MINOR) — one added rule line exists to make a test dimension readable

`spec:validation.pack-coherence` gained *"Membership is counted on the derived belongsTo edges the
manifest re-expresses, so a repeated manifest entry is named once per repeated member."* The plan is
candid that this was added *"so its `{memberCount}` dimension is readable"* (§6 S1 ruling 4). It is a
true statement about `checkPackMembers`, but it is a **counting-mechanism** description authored to
serve a bound point's vocabulary, not a law ratified anywhere in the concept material — the nearest
intended truth (`02` §4, `spec:model.pack-aggregate`) says only that `belongsTo` is derived and that
packs are checked for coherence, not completeness. This is the mildest form of what §1 ruling 9
forbids: the direction of authorship ran test → spec. Worth an explicit disposition (ratify as
stated, or reword to state the law rather than the count).

### S-2 (MINOR) — the did-you-mean tie rule is a code-derived refinement recorded as pre-ratified

`spec:validation.referential-integrity` gained *"names the unique nearest known id as a suggestion
and stays silent when two candidates tie."* `05` §2 check 1 ratifies only *"with a 'did you mean…?'
suggestion **where possible**."* The tie-breaking rule is the precise behaviour of `suggestNearestId`
(`src/validate/validators.ts:130-140`, which returns `undefined` on a tie). It is defensibly
*derivable* from `05` §2's cross-cutting L2 rule (ambiguity is loud, never a silent winner), and the
clause states that rationale — so this is a legitimate reading, not a fabrication. But §6 S1
ruling 4 records all three promotions as *"already ratified in the concept material and merely
absent from the carrying specs,"* and for this one the specific rule was not. Record-accuracy nit.

---

## Dimension 3 — Graph and bookkeeping integrity

**Clean, and unusually so.** Verified against a from-scratch regeneration
(`87 specs · 1 pack · 65 anchors → 153 nodes · 294 edges (0 errors, 0 warnings)`):

- **Golden oracle faithful; nothing loosened.** The `test/self-hosting-graph.test.ts` diff against
  `main` is five literal-count updates plus 29 appended node ids — no assertion removed, no exact
  matcher replaced by a fuzzy one. The file's only four non-exact matchers are byte-identical to
  `main` and guard the anchor-proximity check, not a structural claim. Every literal
  (counts `87/1/65`, `153` nodes, `294` edges, histogram `{defined: 36, ready: 51}`, the full
  explicit id list, all 65 anchors, every spec's descriptors) matches the regenerated graph exactly,
  cross-checked through the CLI path rather than the test's own extraction.
- **Pack manifest complete.** 87 spec ids on disk, 87 manifest members, zero missing, zero ghosts,
  zero duplicates; all 29 branch-added spec files present. Corroborated by 87 `belongsTo` edges. The
  manifest was in sync at **every one of the 15 commits**, with spec counts stepping
  58→60→64→69→75→84→87 exactly as the ledgers claim.
- **`vitest-test.mjs` correct.** Exactly six test files import a generated contract; all six are
  listed; all seven listed paths exist; `test/self-hosting-graph.test.ts` and
  `test/self-hosting-contracts.test.ts` are correctly *absent* (they derive in memory). The §6 S1
  ruling 2 restructuring is real (one row per generated tree, `testPaths` list), and the missing-tree
  stderr that `test/self-hosting-duplicate-ids.test.ts` pins byte-exactly is unchanged from `main`.
- **No decorative anchors.** All 29 new anchors (2 `impl:` + 27 `specTest`) are top-level, resolve
  to real spec nodes, carry `claim: "anchored"`, and sit within the enforced 20-line proximity of a
  real entrypoint (measured deltas 7–9). Both `impl:` anchors sit on the entrypoints their specs
  *name in their own text*: `impl:protocol.example-runner` at `src/runner/index.ts:98` above
  `planExample` (:106), `impl:protocol.slot-notation` at `src/notation/slots.ts:256` above
  `parseSlots` (:265). Builder trust resolves physically through `src/ids.ts` /
  `src/model/code-anchor.ts`; both modules stay import-graph leaves, so the `/runner` subpath keeps
  its dependency-light shape (8.5 KB built).
- **Determinism holds.** `check:self-hosting` and `check:example` both exit 0; the full suite is 505
  tests green; `preflight` clean; `git status --porcelain` empty after regeneration.

### B-1 (MINOR) — the runner anchor orphans `planExample`'s doc comment

`src/runner/index.ts`: the JSDoc block at lines 92-97 ("The framework-neutral core: pairs each
contract step with its bound handler, in contract order…") documented `planExample` on `main`. The
new anchor constant was inserted between them, so the block now binds to `exampleRunnerAnchor` and
`planExample` is undocumented. `src/notation/slots.ts` got the same insertion right (anchor placed
above `parseSlots`'s own comment). One-line move. **CONFIRMED.**

---

## Dimension 4 — The dissolutions

### D-1 (MAJOR) — a dangling `02` reference survives, refuting the plan's own sweep claim

**Where:** `docs/concept/04-authoring-and-binding.md:29`. **CONFIRMED.**

```
// content only — never refs (02 §3): a promoted example is a child spec that refines/verifies this one
```

`02 §3` is the sections section of the deleted `docs/concept/02-core-model.md`; its content now
lives in `spec:model.spec-sections` (the phase-2 coverage trail names exactly that mapping). The line
sits inside the canonical TS-carrier worked example of a **surviving, active** concept doc, and the
same file already uses the repaired form at :11 and :45.

Plan §7 states flatly: *"No dangling inbound reference survives either deletion: a repository-wide
grep for `` `02` ``, `` `03` ``, `02-core-model`, and `03-the-one-graph` outside `plans/`,
`reviews/`, and `explorations/` returns nothing."* All four of those patterns do return nothing —
the claim is *literally* true and *materially* false, because the repo uses **two** citation forms
(backticked `` `05` §3 `` and bare `05 §3` inside code fences) and only the backticked one was swept.
An exhaustive bare-token sweep — `(^|[^0-9A-Za-z._/-])0[23]([^0-9A-Za-z._-]|$)` over every tracked
non-exempt file — returns **exactly this one line** and nothing else. The miss is a single line, but
it is a miss against acceptance criterion 4.

**Fix direction:** repair the line to `` (`spec:model.spec-sections`) ``, and amend the plan's sweep
sentence to name the unbackticked citation form so the next dissolution's sweep does not repeat the
hole.

### D-2 (MAJOR) — the `03` §1 edge-contract row is graded `carried` on a surviving concept doc plus code

**Where:** `plans/20-self-hosting-phase-3.md:515`. **CONFIRMED** by reading the deleted table and
every named carrier.

The row discharges `03` §1's eight-column edge-contract table. Six of its seven substantive columns
carry cleanly. The **Readiness effect** column does not: it asserts two concrete laws (`refines` /
`dependsOn` → *"`ready` floor: target ≥ `defined`"*; `satisfies` → *"`ready` floor: present anchors
must resolve"*), and the row's own citation is *"`spec:validation.readiness-floor` **+ `05` §3**."*
`spec:validation.readiness-floor` is a one-sentence stub — *"A Spec may state a readiness only when
every clause in that readiness floor passes"* — that enumerates no clause. The clauses exist only in
`src/validate/readiness-floor.ts:465-480` and in `docs/concept/05` §3, a doc **this same session
audited as "gaps · stays."** So the column moved doc → doc, not doc → Spec.

The dissolution decision's operative sentence is narrow
(`specs/decisions/concept-docs-dissolve.sdp.md:16`):

> Concept documents may dissolve only after their semantic contract is carried by **executable Specs
> and lean registries**.

A surviving concept document is neither. The session legislated the widening itself, in §6 S5
ruling 2 (*"a row whose law is carried by a surviving surface reads `expository-only`"*) and again in
the §7 preamble (*"a `gap` is a stated law … no Spec, registry, **or code+test surface** carries"*).
Two problems: the widening substitutes a weaker test than the decision states, and the `03` §1 row
uses it under a **`carried`** verdict — the verdict that authorizes deletion — while ruling 2's
escape hatch was scoped to `expository-only` rows. Discharging an *intended-truth* contract onto
`readiness-floor.ts` clause ids is also precisely the promotion `AGENTS.md` forbids (`src/` is
evidence of realization, "never permission to silently promote code behavior into intent").

Also uncarried by any Spec from the same row: the `models` uniqueness clause (*"more than one oracle
models the same space"* is an error), which lives solely as a validator message at
`src/validate/validators.ts:626`.

**In fairness:** nothing left the repository; `05` is gated by the same rule and so cannot itself be
deleted until its floor clauses reach a Spec; and the equivalent citation in the `03` §2 row
(`04` §1) is decorative — `spec:extraction.determinism` rule 3 already carries that whole contract
including the per-carrier asymmetry, so that row is genuinely carried.

**Fix direction:** either land the two floor clauses as rule lines on
`spec:validation.readiness-floor` — the cheaper and better option, since it is the thinnest `ready`
Spec in the corpus relative to the contract it is asked to carry — or amend the dissolution decision
if code+test surfaces are to count, rather than widening it by plan ruling.

### D-3 (MAJOR) — the `02` §5 row cites a carrier that does not carry it

**Where:** `plans/20-self-hosting-phase-3.md:500`. **CONFIRMED.**

The row grades *"the MVP namespace set and the `doc:` reservation"* as **carried** by *"`src/ids.ts`
(the namespace set) · `CONTEXT.md` flagged ambiguities."* `src/ids.ts` contains **no namespace
set**. It has one three-member code-anchor subset
(`CODE_ANCHOR_NAMESPACES = ["impl", "api", "component"]`), four per-builder singletons (`spec`,
`pack`, `test`, `oracle`), and an open grammar gate admitting *any* lowercase namespace. `doc`
appears once, in a comment describing what `ref()` **rejects**.

Genuinely uncarried anywhere after the deletion:

1. the eight-member MVP namespace list (`spec` · `pack` · `impl` · `api` · `test` · `oracle` ·
   `component` · `doc`) — no Spec, registry, or code enumerates it;
2. the positive half of the `doc:` reservation (*"reserved for a genuinely external document linked
   from a decision spec … never for an in-system decision"*) — `CONTEXT.md`'s flagged-ambiguities
   entry carries only the *deferral*, and `CONTEXT.md:171` / `src/model/relations.ts:21` carry only
   the parenthetical half;
3. the convention *"in-system decisions live under the `spec:decisions.*` convention"* — now only
   de-facto corpus practice, stated by nothing.

Small in volume, but graded `carried` under a fully-carried verdict, and (2) and (3) are naming law
an authoring agent would want. **Fix direction:** add them to `spec:model.stable-ids` (already
`ready`, already owns the grammar) or to the `CONTEXT.md` term ledger, and correct the citation.

### D-4 (MINOR) — the `02` §6 row names the wrong carriers

The `supersedes`-only-on-decision-specs row cites `spec:validation.claim-separation` +
`src/validate/validators.ts`. The former states only a generic pointer (*"relation endpoint contracts
must use their ratified forms"*) and enumerates no endpoint. The law **is** genuinely carried — by
`spec:model.relations` (*"A current Decision Record points forward to the decision it replaces"*),
`CONTEXT.md:173`, and the `derive-graph` narrative — but the row names none of them. A reader
auditing only the two cited surfaces would find one generic sentence plus a validator error string.
Contract carried; citation wrong.

### D-5 (MINOR) — two consistency-script comments now overstate what their checks prove

The four audit scripts were **faithfully re-pointed, not weakened** — verified assertion by
assertion against `main` (`check-carrier-truth.mjs` 32→29 CLAIMS / 53→48 RULES, with a 1:1
correspondence to the deleted docs' matching lines, so both retirements were *forced*, not
discretionary; `check-prose-schema.mjs` 19→19; `check-carrier-rule.mjs` 9→9;
`check-self-hosting-gates.mjs` byte-identical). Each re-pointed pin was proved non-vacuous by
corrupting its target in a scratch tree and watching the script fire. Two comment defects survive:

- `check-carrier-rule.mjs`'s header still claims it asserts *"the SAME logical/physical relations
  distinction on both surviving surfaces."* After the split it pins **two independently authored
  sentences** and proves only their co-presence, never their sameness — the wording coupling
  `main`'s shared literal enforced is gone. §6 S5 ruling 1 discloses the change honestly; the
  script's own comment does not.
- `check-carrier-rule.mjs:54-56` still names *"the core-model carrier note"* — the deleted `02`.

Structural note, pre-existing rather than a phase-3 regression: none of the four scripts is wired
into `npm run check` (a deliberate non-wiring decision recorded in plan 17), so every re-pointed pin
is on-demand only and any future weakening of them is invisible to CI. Related: the obsolete-sweep
in `check-carrier-truth.mjs` scans `docs/concept/` + `jtbd-stories/` + `CONTEXT.md` but **never
`specs/`** — and carrier-relevant exposition is precisely what is migrating into `specs/`. Harmless
today (zero hits), but the sweep no longer reaches the content's new home.

### D-6 (MINOR) — a provenance sentence misreads as this phase

§6 S5 ruling 3 and the `03` §5 audit row say the carriage "landed during **the phase's** earlier
corpus work." In a phase-3 plan that reads as phase 3. It landed in **phase 2**, on `main`, in
`8f5aabe`: this branch never touched `specs/extraction/derive-graph.sdp.md` (`git log main..HEAD` on
that file is empty; `git show main:` is byte-identical). The headline claim ("closed before this
session, not by it") is accurate; the attribution is not. The narrative itself does carry the
section — all four of `03` §5's laws map clause for clause. **CONFIRMED.**

### D-7 (MINOR) — a `carried` verdict that concedes an uncarried surface in its own text

The `06` §1 surfaces-taxonomy row reads verdict **carried**, then qualifies: *"except the Mermaid
and reference-projection rows, which only `06` §8 names."* That is an admitted uncarried surface,
and it appears in no `gap`-verdicted row and in none of the eleven numbered gaps carried out of S5.
`06` stays, so no deletion rests on it — a bookkeeping inconsistency in the audit table's own
grammar rather than a deletion defect. (The other seventeen gap-verdicted rows do consolidate
correctly into the eleven numbered items.)

---

## Dimension 5 — Process-record fidelity

**What held — the ledgers are honest.** All 13 §2 conversion rows are true: every claimed point
exists as a spec file with the exact claimed id and has a `bindExample` handler beside a `specTest`
anchor whose `verifies` names it, and every delivered count sits inside its planned range. The §3
modeling policy landed exactly as specified. Every §10 row's commit count maps to real commits
(S1 = 3 feat, S2 = 1, S3 = 1, S4 = 1, S5 = 3; S6 honestly `planned`). The S4 arithmetic is exact —
4 promoted + 36 stays-defined (15 individual + the `21 × spec:decisions.*` row) = 40 swept. And all
five readiness distributions were **re-measured at their own commits**, not merely checked for
internal consistency: 51/7 over 58 at the draft, 45/24 over 69 at S1, 41/34 over 75 at S2, 40/44 over
84 at S3, 36/51 over 87 at S4 — and 36/51 over 87 on disk at HEAD.

**Temporal-guard compliance.** `check:temporal` exits 0. Independently swept by hand: all 29 new
spec files and all four new `test/self-hosting-*.test.ts` suites carry **zero** temporal tokens of
any category — no ISO dates, no month names, no `S1`–`S6` handles, no wave handles, no plan
references. Phase 3 introduced no new ruling-7 violation.

### R-1 (MINOR) — §1 ruling 7 is stated as current-state law, and the repo does not satisfy it

The guard's pattern is `Session[ -][0-9]|Wave[- ][A-Z]|Fold-[A-Z]|deferredInSession|plans/[0-9]+|20[0-9]{2}-[0-9]{2}-[0-9]{2}`.
It cannot see `plan 12`, `plan-12`, `phase N`, bare `S1`-style handles, month names, or "docket".
Seven non-exempt files carry plan references that ruling 7 forbids — `src/runner/index.ts:6`,
`src/notation/slots.ts:2,15`, `src/validate/readiness-floor.ts:213`,
`src/validate/validators.ts:390`, `CONTEXT.md:139,157,210`, `check-carrier-truth.mjs:6-7` — and, most
pointedly, **a Spec does**: `specs/decisions/concept-docs-dissolve.sdp.md:18` reads
*"consequence: Deletion is later work, never part of phase 1."* That is a session-relative handle in
the very decision Spec that authorized S5's deletions, now visibly obsolete because the deletion it
defers has occurred (its golden-corpus twin at `test/self-hosting-graph.test.ts:1015` mirrors it
byte for byte). **All of these pre-date this branch** — phase 3 authored none of them, and the two
files it did touch (`src/runner/index.ts`, `src/notation/slots.ts`) gained only anchor constants.
The finding is that ruling 7 reads as a description of the repo and is not one, and that the guard
will not catch the next such token either. **CONFIRMED.**

### R-2 (MINOR) — a commit subject claims a docket close that did not happen

Commit `a989b14`'s subject is *"docs(plans): record the S4 readiness-sweep ledger and close its
docket row."* The §8 Docket ledger is **byte-identical to the draft commit `b536754`** — it merely
restates the eight carried-in rows as "all remain open," and not one row is dispositioned. The
commit body's narrower claim (it closes the §10 S4 row) is true; the subject line overstates.
**CONFIRMED.**

### R-3 (MINOR) — the carried-in corpus-test-granularity docket row was reached by every wave and dispositioned by none

That row entered the docket from review-08 R-28, described as "owned by this program — dispositioned
by the waves it reaches." Every wave reached it, none dispositioned it, and the condition it names
got substantially worse: `test/self-hosting-graph.test.ts` grew from 2,287 to 3,879 lines and is
still a **single** `it()` with frozen absolute counts, so the first failure still masks the rest and
every corpus edit still churns one monolithic block. Not a correctness defect — the oracle is exact
and faithful (Dimension 3) — but the row should close with a reason rather than roll forward
silently. **CONFIRMED.**

### Acceptance criteria (§9)

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | Executable-path facts, not claims | **PASS** | 15/15 converted parents and 27/27 child points carry `has-verifier` in `generated/graph.json`; 0 validation errors; `check:self-hosting` and `check:example` both clean under `--check-clean`. |
| 2 | Honest readiness | **PASS** | 0 errors / 0 warnings — no `honesty/gaps` warning exists at all; closing distribution recorded and matching disk (36 / 51 over 87). |
| 3 | Coverage never weakens | **PASS** | Zero test files deleted; case counts unchanged across all fourteen residual suites; +1,582 net lines of new bound suites. |
| 4 | Per-doc audits; clean deletions | **PARTIAL** | Five audit tables present; only the two `fully carried` docs deleted; all four audit scripts and the full gate green — **but** one dangling reference survives (D-1) and two `carried` verdicts rest on carriers that do not carry them (D-2, D-3). |
| 5 | Watch items | **PARTIAL** | §5 table is byte-identical to the draft — entry states only, no terminal column. Only 2 of 5 items have a recorded disposition anywhere (table-sugar, single-literal — both "unfired"); multi-entry constraint form, array-section prose sub-owner, and Markdown Pack syntax carry no reason. S6 is `planned`, so this is not-yet-due rather than false. |
| 6 | The gate holds throughout | **PASS** | `npm run check` green at HEAD (full 12-leg chain); pack manifest ↔ spec files in sync at **every one** of the 15 commits; wrapper dependency table and preflight targets current. The clean-clone proof remains S6's. |
| 7 | Records continue | **PARTIAL** | Conversion ledger terminal (13/13 `done`), readiness ledger complete, five audit tables recorded — but §8's docket rows are undispositioned (R-2, R-3) and no adversarial review was archived. Archiving this document discharges the last clause; the docket rows still need reasons. |

---

## Suggested follow-up order

1. **P-1** — the concreteness point, TDD: change the world so the mutation kills it, then re-run the
   mutation to prove it. Correct §6 S3 ruling 5's "no drift found" sentence in the same change.
2. **D-1** — the one-line reference repair, plus the plan's sweep-sentence amendment (name the
   unbackticked citation form).
3. **D-2 + D-3 + D-4** — one records-and-corpus session: land the two floor clauses on
   `spec:validation.readiness-floor`, land the namespace set and the `doc:` / `spec:decisions.*`
   conventions, and correct the three audit-row citations. This is the cluster that makes the two
   deletions defensible on the decision's own terms rather than on a plan ruling.
4. **Criteria 5 and 7** — the S6 close: watch-item terminal states with reasons, docket-row
   dispositions (including R-3), the conversion-ledger and audit terminal record, and the
   clean-clone proof.
5. **P-2, S-1, S-2, B-1, D-5, D-6, D-7, R-1, R-2** — one hygiene-and-records batch. R-1 deserves a
   deliberate call: either widen the guard's token list to match ruling 7 and repair the eight
   sites, or narrow ruling 7's wording to what the guard actually enforces.

---

## Disposition table

_Left open for the remediation session._

| # | Severity | Finding | Disposition |
|---|---|---|---|
| P-1 | major | Concreteness point is over-determined; stays green with its own law deleted | |
| P-2 | minor | Decorative Then step on the schema-version point | |
| S-1 | minor | Pack-coherence mechanism line authored test-first | |
| S-2 | minor | Did-you-mean tie rule recorded as pre-ratified | |
| B-1 | minor | Runner anchor orphans `planExample`'s JSDoc | |
| D-1 | major | Dangling `02 §3` reference at `docs/concept/04-authoring-and-binding.md:29` | |
| D-2 | major | `03` §1 row graded `carried` on a surviving concept doc + validator source | |
| D-3 | major | `02` §5 row cites `src/ids.ts` for a namespace set it does not hold | |
| D-4 | minor | `02` §6 row names the wrong carriers | |
| D-5 | minor | Two stale / overstating consistency-script comments; sweep never reaches `specs/` | |
| D-6 | minor | `03` §5 provenance attributed to the wrong phase | |
| D-7 | minor | `06` §1 row concedes an uncarried surface under a `carried` verdict | |
| R-1 | minor | Ruling 7 unenforced: 7 files and one Spec carry plan/phase handles the guard cannot see | |
| R-2 | minor | Commit `a989b14` subject claims a docket close that did not happen | |
| R-3 | minor | Corpus-test-granularity docket row rolled forward undispositioned; oracle grew to 3,879 lines in one `it()` | |
