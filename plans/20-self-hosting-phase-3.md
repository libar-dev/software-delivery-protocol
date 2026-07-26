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
| S1 | `test/validators.test.ts` orphan/gap cases | `spec:validation.warn-level-signals` | 1–2 | planned |
| S1 | `test/validators.test.ts` referential cases | `spec:validation.referential-integrity` | 1–2 | planned |
| S1 | `test/validators.test.ts` + fixture rows | `spec:validation.authored-honesty` | 1–2 | planned |
| S1 | `test/validators.test.ts` claim cases | `spec:validation.claim-separation` | 1–2 | planned |
| S1 | `test/validators.test.ts` verifies/models cases | `spec:validation.verification-linkage` | 1–2 | planned |
| S1 | `test/validators.test.ts` pack cases (coverage gap) | `spec:validation.pack-coherence` | 1 | planned |
| S2 | `test/exclude-diagnostics.test.ts` | `spec:extraction.excludes` | 1–2 | planned |
| S2 | `test/graph-schema.test.ts` | `spec:extraction.schema-versioning` | 1 | planned |
| S2 | `test/ids.test.ts` (representative points) | `spec:model.stable-ids` | 1–2 | planned |
| S2 | `test/extract-parity.test.ts` (representative) | `spec:carrier.markdown-parser` | 1 | planned |
| S3 | `test/codegen.test.ts` (representative laws) | `spec:extraction.executable-contracts` (enriched) | 2–3 | planned |
| S3 | `test/runner.test.ts` | a new runner spec (§3) | 1–2 | planned |
| S3 | `test/notation.test.ts` | a new slot-notation spec (§3) | 1–2 | planned |

The readiness sweep (S4) and the audit tranche (S5) carry their own ledgers in §4 and §7.

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
| S1 | validation-family conversions (§2) + promotions that honestly clear | orchestrator-verified green gate | planned |
| S2 | extraction/model cheap wins (§2) | orchestrator-verified green gate | planned |
| S3 | corpus additions (§3) + codegen/runner/notation conversions | orchestrator-verified green gate | planned |
| S4 | readiness maturation sweep (ruling 5) | orchestrator-verified green gate | planned |
| S5 | per-doc audits + first dissolutions (§4) | orchestrator-verified green gate over the regenerated Design Review | planned |
| S6 | adversarial review, remediation, full close, done-record | full chain + clean-clone; review archived | planned |

Owner ratification of every gate above happens at the phase PR review; no live owner acceptance
is claimed by this ledger.
