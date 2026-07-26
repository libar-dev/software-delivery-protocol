# Plan 21 — Self-hosting phase 4: the oracle split, the floor and view corpus waves, and the `05` dissolution attempt

> **Status:** DRAFTED — execution begins on `feature/protocol-self-application-phase-4`. This is
> plan 21, the highest primary-numbered plan; the latest ✅ EXECUTED ground is plan 20 (the
> phase-3 close). Build state lives in **`plans/`** — read the highest **primary-numbered**
> plan's status header, plus any **active subplans it (or its parent family) explicitly
> designates as current**; ignore unnumbered files and letter-suffixed plans only when no
> primary/active plan designates them. If that plan is DRAFTED, also read the latest ✅
> EXECUTED plan for settled ground.
>
> **Spec anchors:** [plan 20 §7 done-record and successor guidance](20-self-hosting-phase-3.md) ·
> [the dissolution decision](../specs/decisions/concept-docs-dissolve.sdp.md)
> (`spec:decisions.concept-docs-dissolve`) · [the point-per-example decision]
> (../specs/decisions/point-per-example.sdp.md) (`spec:decisions.point-per-example`).

## (a) Status

This is the executable phase plan for plan 20's recorded successor guidance, in its stated
order: the golden-oracle split first, the shared-constant hardening for the contract-dependent
suites, then the next corpus wave in recorded gap order — the lower readiness-floor rungs and
the per-kind evidence table, the derived-readiness banner law, and the
already-implemented-but-uncarried view rules — with readiness maturing only where verifiers
honestly land, a re-audit of `docs/concept/05` (the doc those gaps hold in place) with `06` and
`07` re-graded on the same pass, and an adversarial mutation-probing close. Execution happens
only on `feature/protocol-self-application-phase-4`. Sessions run agent-executed and
orchestrator-verified; **owner ratification of the whole phase happens at the phase PR review**
— the gate ledger (§9) records that honestly and never claims a live owner acceptance that did
not occur.

## (b) Context

Phase 3 closed at **87 Specs · 51 `ready` / 36 `defined` · 29 bound points across five bound
suites**, with `02` and `03` deleted and twelve gaps recorded against `05`/`06`/`07`. Three
debts are on record. First, `test/self-hosting-graph.test.ts` stands at 3,888 lines in a single
`it()` with frozen absolute counts — the first failure masks the rest, and every conversion
wave thrashes it. Second, the clean-room lint exemption (`eslint.config.js`) and the wrapper's
contract-dependency table (`vitest-test.mjs`) name the same six files independently; the next
bound suite would repeat the clean-clone lint surprise. Third, the biggest recorded gaps are
laws the engine already implements but no Spec carries: the `idea`/`scoped`/`defined` floor
rungs and the per-kind evidence table (`src/validate/readiness-floor.ts`), the
derived-readiness banner (`src/projections/design-review-context.ts` `renderReadiness`), the
`implemented` view-label rule (`renderBindings`), the Design Review wholesale rewrite
(`src/cli/validate-view-command.ts` `runView`), the one diagnostic rendering rule
(`src/cli/output.ts` `formatFinding`), and validator self-testing (`05` §5).

The permanent guardrails stand unchanged: checks police conformance and honesty, never
content-quality and never workflow; delivery facts are derived, never authored; the claim
taxonomy is never collapsed; readiness is stated only where the floor honestly clears; one
canonical surface per ID, no mixing.

## (c) Scope

1. **S1 — the oracle split.** The single-purpose session plan 20 ordered: split the golden
   corpus oracle by assertion family, never one mega-assert, with zero assertion loss.
2. **S2 — the shared constant + the floor wave.** One source of truth for the
   contract-dependent suites; then Specs carrying the lower floor rungs and the per-kind
   evidence table, with bound points in the existing validators suite.
3. **S3 — the view wave.** Specs carrying the banner law, the view-label rule, the wholesale
   rewrite, the diagnostic rendering rule, and validator self-testing; a new bound projections
   suite entering through the S2 shared constant.
4. **S4 — readiness sweep + the `05` re-audit.** Per-spec disposition of the remaining
   `defined` corpus; the per-doc audit re-run for `05` (delete only if fully carried), `06` and
   `07` re-graded honestly.
5. **S5 — close.** Adversarial mutation-probing review over the new points, remediation, the
   full gate plus clean-clone proof, this plan's done-record.

**Out of scope, named deliberately:** converting the filesystem-corpus giants
(`test/markdown-reifier.test.ts`, `test/extract.test.ts`, `test/cli.test.ts`); the
packaging/bootstrap smoke surface; the deferred docket tail (Markdown Pack syntax · the gen-1
`.feature` adapter · the no-reparse read seam · temporal-guard token assembly · the
editor-association gap · control-character latitude · the separate example-id namespace) unless
a wave forces an entry under fire; new content-quality validators; bulk concept purges; the
`06`/`07` gaps that are not this wave's laws (assist roles, `bySymbol`, discipline mapping,
distribution chart, per-PR preview, Mermaid surfaces, the two open questions, measure-what-hurts).

## §1 Engineering rulings

Rulings 1–9 of plan 20 carry forward verbatim (the law is the unit of conversion; any-kind
example spaces; the four-artifact template; no table sugar by default; the readiness promotion
law; batch-green bookkeeping; temporal-guard discipline as amended; per-doc audited deletion
ratified at the PR; drift discipline). Phase 4 adds:

10. **The oracle split preserves the oracle.** The split may reorganize
    `test/self-hosting-graph.test.ts` into multiple `it()` blocks and move the frozen expected
    data into per-family modules, but: extraction runs **once** per suite run (hoisted, never
    re-run per `it()`); every assertion survives or is replaced by a strictly equivalent or
    stricter one; the expected data stays **authored transcription** (never computed from the
    live graph); a total may be derived from the authored arrays' lengths only where a
    same-strength repo↔oracle equality assertion remains (`result.counts` vs the authored
    arrays), and the readiness histogram stays an explicit literal. The redundant inline
    node-id roster (a second copy of the spec-id list) may be derived from the authored
    `expectedSpecs`/`expectedAnchors` arrays — recorded here as deliberate de-duplication of
    oracle data, not assertion loss.
11. **One source of truth for contract-dependent suites.** A root ESM module exports the
    per-tree dependency rows (`contracts` dir · `generation` command · `testPaths`);
    `vitest-test.mjs` and `eslint.config.js` both import it. The eslint side derives its
    exemption file list from the root tree's `testPaths`; the exclusion rule stays as
    documented (in-memory suites — the corpus oracle, the contracts self-check — are never
    listed). A new bound suite enters the constant once and both surfaces follow.
12. **The P-1 lesson is the conversion playbook.** Build worlds where only the named law can
    refuse; mutation-probe the named law before recording "exercises clause X"; never use
    absence-of-a-finding-id as the sole discriminator.
13. **Enrichment follows the mirror, never invents a third behavior.** The floor-wave Specs
    state the clause tables in authored words that agree with `src/validate/readiness-floor.ts`
    (MD-13's code-level source of truth); the view-wave Specs state what the projection code
    verifiably does. Any disagreement found while transcribing is drift to resolve on the
    record — fix the stale side deliberately.
14. **A registry surface never dangles.** If `05` is deleted at S4, every registry row citing
    `05` §3 as a mirror (MD-13, MD-9), every `CONTEXT.md` section pointer (`→ 05`), and every
    surviving-doc citation is re-pointed at the carrying Spec in the same change, and the
    two-form reference sweep (backticked and bare citation spellings) is re-run to zero hits —
    the phase-3 deletion protocol unchanged.

## §2 Session inventory

### S1 — the oracle split (single purpose)

`test/self-hosting-graph.test.ts` today: one `describe`/one `it()` (lines 3593–3886) over
module-level frozen data — `expectedSpecs` (87 entries, ~2,558 lines), `expectedPackMembers`,
`expectedDeclaredRelations`, `expectedWarnings`, `expectedAnchors` (65 entries) — asserting in
order: clean extraction · no warn-level findings · frozen counts (87/1/65) · a redundant
151-item node-id roster · per-spec descriptor equality · declared relations · the readiness
histogram (51/36) · pack membership · the pack node · edge count (294) · anchored edges ·
anchor nodes (with file I/O line resolution) · anchor-site proximity · two derived-fact case
studies.

Deliverables:

1. The suite reorganized so each assertion group above is its own `it()` (or a small set of
   per-family `it()`s for the per-spec descriptor block), sharing **one** hoisted extraction.
2. The frozen expected data moved to authored per-family modules (e.g.
   `test/self-hosting-oracle/`), so the next conversion wave touches one family file, not a
   3,888-line monolith. Data modules are plain authored transcription — no generation.
3. The redundant node-id roster derived from the authored arrays (ruling 10).
4. Zero assertion loss, verified by diff discipline: every projected field asserted today is
   asserted after the split at equal or stricter strength.
5. `npm run check` green; one or more green-gate commits.

Out of S1's scope: any corpus change, any conversion, any count change — the oracle's numbers
enter S1 at 87/1/65 · 153 · 294 · 51/36 and leave S1 identical.

### S2 — the shared constant + the floor wave

1. **The shared constant (ruling 11).** Root module (suggested name
   `contract-dependent-suites.mjs`) exporting the two dependency rows exactly as
   `vitest-test.mjs:13–31` states them today; both consumers import it; behavior byte-identical
   (same preflight failure text, same lint exemption set). The eslint comment updates to name
   the shared module as the coupling's mechanism.
2. **The floor wave (gap 1 of the phase-3 ledger).** Author the Specs that carry what
   `src/validate/readiness-floor.ts` and `05` §3 state today:
   - Enrich `spec:validation.readiness-floor` to state the `idea` / `scoped` / `defined` rung
     clauses in authored words (today its own text defers them to code), keeping the MD-13
     posture: the code table remains the realizing entrypoint; the Spec now carries the law.
   - Author the per-kind evidence table's carrying surface — a new `rule`-kind Spec (suggested
     `spec:validation.kind-evidence`) refining `spec:validation.readiness-floor`, `decidedBy`
     `spec:decisions.kind-conditional-floor`, stating the 7-kind × `scoped`/`defined` rows
     (including the `behavior`/`workflow`/`contract` shared family and the MD-12 contract-row
     interim) in authored words.
   - Example space + bound points (planned 3–5 across the two Specs) in the existing
     `test/self-hosting-validators.test.ts` probe-graph style: e.g. a `defined` probe failing
     `kind-evidence-complete` under its own clause id; a `scoped` probe failing
     `at-least-one-relation`; a `constraint` probe at `defined` whose entry lacks a
     machine-readable target; a promoted-evidence probe honoring the MD-16 bound. Each point
     names the finding `honesty/readiness-floor` **and** the clause id via `relatedId` — never
     absence-of-a-finding as the sole discriminator.
3. Bookkeeping batch-green (ruling 6): pack manifest, regenerated contracts, promotions that
   honestly clear (the two floor Specs promote only with resolving verifiers).

### S3 — the view wave

Author the Specs carrying the five implemented-but-uncarried laws (phase-3 gaps 2, 3, 4, 5, 6),
stating what the code verifiably does (ruling 13):

| Law | Realizing code | Suggested carrier |
|---|---|---|
| derived-readiness banner: stated renders beside floor-reached always; the divergence banner fires **only** in the dishonest direction and names the **first unmet clause** | `src/projections/design-review-context.ts` `renderReadiness` | new `rule` Spec under `specs/consumers/` refining `spec:consumers.design-review` |
| `implemented` view-label: the fact name stays internal; views render binding language ("Implementation binding: present / Verifier binding: … / Runtime observation: not tracked") | `renderBindings` + the pack/index tables | same Spec family; MD-7 (`spec:decisions.binding-not-liveness`) keeps the model half |
| wholesale page rewrite: build to a temp dir, atomic swap, no stale page survives; a failed run removes rather than leaves the view | `src/cli/validate-view-command.ts` `runView` | new `rule` Spec refining `spec:consumers.design-review` |
| one diagnostic rendering rule: location composed from the structured `file`/`line` fields, `path:line — [severity] validatorId — message`; absent fields degrade cleanly | `src/cli/output.ts` `formatFinding` (+ the Design Review twin) | new `rule` Spec under `specs/validation/` or `specs/consumers/` — the wave decides and records |
| validator self-testing: each validator ships should-fail and should-pass evidence | `test/validators.test.ts` practice | new `rule` Spec under `specs/validation/`; may honestly stay `defined` if its only verifier would be decorative |

Bound points (planned 4–6) live in a **new** bound suite (suggested
`test/self-hosting-projections.test.ts`) that enters through the S2 shared constant — the
seventh suite proving ruling 11 — plus, where a law is CLI-side (`formatFinding`, `runView`),
worlds run the real seams (render over a probe reader context; a temp-dir `runView` with a
planted stale page). Every point is mutation-probed before its "exercises clause X" is
recorded (ruling 12). Promotions ride verifiers per ruling 5.

### S4 — readiness sweep + the re-audits

1. **Sweep**: every then-`defined` Spec dispositioned per-Spec — promote only under ruling 5,
   refuse with a named reason otherwise (the phase-3 discipline; the 21 decisions and
   whole-pipeline worlds are expected honest refusals).
2. **The `05` re-audit**, to the phase-3 template, judged over the regenerated Design Review:
   the S2/S3 waves target exactly its three recorded gaps (the rungs + evidence table · the
   banner · validator self-testing). Delete only on a fully-carried verdict, with ruling 14's
   re-pointing and two-form reference sweep in the same change. If any gap honestly survives,
   `05` stays and the residue is recorded.
3. **`06` and `07` re-graded** on the same pass: the banner gap (shared) and the view-label /
   diagnostic-rendering / wholesale-rewrite gaps close if S3 landed them; the remaining gaps
   (assist roles, `bySymbol`, discipline mapping, distribution chart, per-PR preview, Mermaid
   surfaces, open questions, measure-what-hurts) are out of scope, so both docs are expected
   to **stay** — the re-grade updates their gap ledgers honestly, nothing more.

### S5 — close

1. Adversarial review over the full branch diff, archived as
   `reviews/10-self-hosting-phase-4-pre-close-review.md`: mutation-test every new bound point
   (break the named law in a sandbox copy, re-run the point, record red-for-the-right-reason),
   plus a records-honesty recomputation of the headline numbers and a dangling-reference sweep
   if `05` was deleted.
2. Remediation with per-finding dispositions in the archived table.
3. The full twelve-leg `npm run check` green, plus the clean-clone proof
   (`git clone --no-local` → `npm ci` → full chain) at the close SHA.
4. This plan's done-record (§6–§9 terminal), the `AGENTS.md` status update, and the PR
   description.

## §3 Watch items

| Item | Fires when | State |
|---|---|---|
| table sugar (ruling 4) | sibling authoring proves dishonest or unusable in a wave | unfired |
| single-literal vocabulary form | real material forces it | unfired |
| per-family oracle drift | a split family module regains cross-family assertions or a mega-assert | unfired |
| shared-constant bypass | a new contract-dependent suite lands outside the constant | unfired — the constant landed at S2 with no surprise; the eslint side derives from the root row only, because the example tree's suite sits outside the typed-lint globs the exemption relaxes. **S3 proved it:** `test/self-hosting-projections.test.ts` (the seventh suite) entered through one edit to the root row and both surfaces followed. The negative control ran too — with the row removed and `generated/contracts` moved aside, clean-room lint fails with five `no-unsafe-argument` errors and the wrapper stops refusing fast, so the coupling is load-bearing on both sides rather than incidentally satisfied |
| separate example-id namespace | a collision or real pressure appears | unfired (watch continues from phase 3) |

## §4 Docket ledger (carried in from plan 20)

Markdown Pack syntax ruling · the gen-1 `.feature` adapter · the no-reparse read seam ·
temporal-guard token assembly · the editor-association gap · corpus-test granularity (owned by
this phase — S1 is the session that dispositions it; **dispositioned at S1** — the corpus oracle
split into 21 `it()`s over one hoisted extraction, with the frozen expectation moved to authored
per-family modules under `test/self-hosting-oracle/`) · control-character latitude · the
separate example id namespace. Rows close only with reasons in the done-record.

## §5 Acceptance criteria

1. **The oracle is split with zero assertion loss**: multiple `it()`s over one hoisted
   extraction; the per-family data modules are authored transcription; the suite's law
   coverage at close is a superset of its opening coverage; the corpus-test granularity docket
   row is dispositioned.
2. **One source of truth for contract-dependent suites**: `vitest-test.mjs` and
   `eslint.config.js` derive from the shared constant; the S3 suite enters through it; a clean
   clone lints green before generation.
3. **Executable-path facts, not claims**: every new Spec promoted to `ready` carries
   `has-verifier` through the executable path in the regenerated graph; zero validation
   errors; contract generation deterministic under `--check-clean`; every new bound point is
   mutation-probed red for the law it names.
4. **Honest readiness**: every promotion clears the floor with a resolving verifier; no
   `honesty/gaps` warning is introduced; the closing distribution is recorded; refusals carry
   named reasons.
5. **The `05` disposition is audit-grounded**: deleted only on a fully-carried per-doc audit
   with ruling 14's sweep at zero hits, or kept with its residue recorded; `06`/`07` re-graded
   with honest ledgers. *(Met at S4 — §5a: `05` **stays** on two newly-surfaced gap rows, both
   recorded precisely; `06` and `07` re-graded, six of the twelve phase-3 gaps closed.)*
6. **The gate holds throughout**: `npm run check` green at every blessed commit; the close
   runs the full chain plus the clean-clone proof.
7. **Records continue**: the session ledger, watch items, and docket rows are terminal or
   carried with reasons; the adversarial review is archived with every finding dispositioned
   before close.

## §5a The S4 re-audits (`05` re-run · `06` and `07` re-graded)

Built to the phase-3 template (plan 20 §7, the per-doc concept-dissolution audits) and judged over
the **regenerated** Design Review — `npm run build && npm run generate:self-hosting`, then the
carrying specs' `generated/design-review/spec/*.md` pages read directly, because the criterion is
what the graph carries, not what a raw spec file says. The governing criterion is unchanged (the
dissolution decision, `spec:decisions.concept-docs-dissolve`): a doc may be deleted only once its
semantic contract is **fully** carried by Specs and lean registries; **one gap blocks deletion**;
an `expository-only` row never blocks, provided its law is carried elsewhere — a Spec, a lean
registry, a pinned code+test surface, or a **surviving** doc, named in the row.

**Terminal dispositions this session:** `05` **stays — two gaps recorded** · `06` **stays — gaps
reduced** · `07` **stays — gaps reduced**. No doc was deleted, so ruling 14's re-pointing and
two-form reference sweep did not run; what a future `05` deletion will cost is inventoried at the
end of the `05` table.

### `05-validation-and-honesty.md` — re-run verdict: **gaps** · stays

The three gaps the phase-3 audit recorded against `05` are **all closed** by the S2 and S3 waves.
Two *new* gap rows surface on this pass — both are parenthetical named deferrals that the phase-3
table never had a row for (they sit in prose the earlier audit did not decompose), and both fall
in the class the phase-3 audit itself graded as gaps elsewhere (`06` §8's per-PR hosted preview,
gap 9: a designed-for deferral named only in the candidate doc). They are recorded rather than
stretched into `carried`, per the D-2/D-3 lesson.

| Doc section | Carrying surface (spec / registry / code / surviving doc) | Verdict |
|---|---|---|
| header ¶ — validation makes the graph trustworthy; the meta-model is a conformance contract, instances conform, conformance is checked but the process is never workflow-gated | `spec:validation.two-check-families` (both families; errors fail the build, gaps and orphans inform) · `spec:protocol.self-hosting` · `CONTEXT.md` "the Protocol" (the conformance contract instances conform to) | carried |
| header ¶ — delineates the MVP validator subset from the aspirational tiers, realising P7 · P8 · L2 · L3 | `01` P7/P8/L2/L3 (surviving) | expository-only against `01` |
| the guardrail blockquote — (a) checks police conformance & honesty, never content-quality and never workflow; (b) "deterministically validated," never "provably correct" | `spec:validation.two-check-families` (intent outcome states both halves of (a)) · `CONTEXT.md` §Validation & honesty closing lines (both halves verbatim) · `AGENTS.md` | carried |
| §1 the two check families table (conformance asks well-formedness · honesty asks non-pretending) | `spec:validation.two-check-families` + its `split-report` point · `CONTEXT.md` "conformance checks" / "honesty checks" | carried |
| §1 an error fails the build, a gap informs; "checked, never gated"; the `validator` · `gap` · `orphan` terms | `spec:validation.two-check-families` (rule 2) · `spec:validation.warn-level-signals` + `orphan-signal` and `ready-gap-signal` · `CONTEXT.md` term rows | carried |
| §1 "the honesty family is the real differentiator" | — | expository-only (motivation) |
| §1 the layered-enforcement table, CORE rows (types → shape · schema → payload · graph validators → cross-file invariants) | `spec:validation.two-check-families` (rule 3, no layer substitutes for another) · `spec:decisions.typing-law` | carried |
| §1 the layered-enforcement table, ASPIRATIONAL rows (architecture rules · custom team `defineRule` policy) | `00` §4 (Architecture enforcement — forbidden-dependency tiers, ts-arch tests, custom rules) · `07` §3 item 7 (surviving) | expository-only against `00`/`07` |
| §1 "types describe shape; validators decide completeness (P7); completeness is never encoded in conditional types" | `01` P7 (surviving, verbatim) · `spec:decisions.typing-law` (the closed-shape half) | expository-only against `01` |
| §2 the one-validation-path ¶ — no pre-graph seam; validating an evaluated form checks a phantom; `sdp validate` is `sdp build` + checks and `validateGraph` is the sole seam; authoring-time feedback is per-carrier; the `sdp/spec-static` lint is earlier surfacing, never a parallel path | `spec:decisions.one-validation-path` (context, decision, rationale, consequence — all four halves) · `spec:validation.two-check-families` (rule 4) · `spec:extraction.build-pipeline` (every command uses the same extracted graph and validation seam) · `04` §1 (surviving, the lint) | carried |
| §2 checks 1–2 (referential integrity with did-you-mean · duplicate IDs) | `spec:validation.referential-integrity` + `dangling-target` and `did-you-mean` · `spec:validation.duplicate-ids` + `dual-carrier` | carried |
| §2 check 3 (`claim` separation, endpoint contracts, fail-closed descriptors, the kind-typed endpoints) | `spec:validation.claim-separation` + `collapsed-edge-claim` and `unratified-descriptor` · `spec:model.relations` (the per-relation endpoint kinds in its vocabulary) | carried |
| §2 check 4 (`verifies` linkage; a wrong-kind verifier confers nothing rather than failing) | `spec:validation.verification-linkage` + `unbound-example` and `unresolved-oracle` ("a non-resolving trace is named loudly and confers no delivery fact") | carried |
| §2 checks 5–6 (authoring-shape honesty · derived-facts honesty, including `observed`; the gap check reads recomputed facts) | `spec:validation.authored-honesty` + `section-authored-fact` and `unearned-stated-fact` · `src/validate/validators.ts` `checkGaps` (reads the recomputed facts, pinned by the two points) | carried |
| §2 check 7 (honest readiness — a stated rung is checked against the floor) | `spec:validation.readiness-floor` (**all four rungs now in authored words**, cumulative evaluation stated) | carried |
| §2 check 8 (orphan detection) | `spec:validation.warn-level-signals` + `orphan-signal` · `CONTEXT.md` "`orphan`" | carried |
| §2 check 8 parenthetical — **a per-team severity override is designed-for, deferred** | none — no Spec, registry, code+test surface, or surviving doc names this deferral; `00` §4 and `07` §2/§3 do not list it | **gap** (new — recorded as gap 13) |
| §2 check 9 (readiness/delivery gaps; the backlog and drift-alarm queries) | `spec:validation.warn-level-signals` + `ready-gap-signal` · `CONTEXT.md` "The payoff queries" · `spec:model.core-model` | carried |
| §2 ambiguity fails (L2) | `spec:validation.duplicate-ids` + its point · `spec:validation.claim-separation` · `01` L2 (surviving) | carried |
| §2 partial failure stays local (L3) | `spec:carrier.markdown-parser` (excludes one malformed carrier, continues healthy siblings) · `spec:extraction.determinism` | carried |
| §3 opening ¶ — a readiness floor is the minimum structural requirement to *state* a rung; a floor to clear, never a quota or a score | `spec:validation.readiness-floor` · `CONTEXT.md` "readiness floor" · `01` P4 corollary (surviving, the no-tier-filling half) | carried |
| §3 opening ¶ tail — the floors are the mechanism, the thresholds are a Representation, and **a team-overridable floor config is designed-for, deferred** | none for the deferral — the mechanism/threshold split rides the `AGENTS.md` Principle-vs-Representation convention, but no surface states the overridable-config deferral | **gap** (new — recorded as gap 14) |
| §3 the floor's two parts (kind-blind structural clauses + one kind-conditional evidence clause, which can relax as well as add) | `spec:validation.readiness-floor` ("Every clause stated here is kind-blind. The two evidence clauses are the one kind-conditional place…") · `spec:decisions.kind-conditional-floor` | carried |
| §3 the kind-blind clause table — the `idea` / `scoped` / `defined` / `ready` rungs | `spec:validation.readiness-floor` — five `idea` clauses, three `scoped`, two `defined`, three `ready`, plus cumulative evaluation, the anchors-present reading, and the authored-edges-only reading, all in authored words | carried — **phase-3 gap 1 (first half) closed at S2** |
| §3 the per-kind evidence table (7 kinds × `scoped`/`defined`) | `spec:validation.kind-evidence` + `constraints-alone`, `untargeted-constraint`, `empty-promoted-child` — row for row, including the shared `behavior`/`workflow`/`contract` family and the contract row's named deferral | carried — **phase-3 gap 1 (second half) closed at S2** |
| §3 the three bounding laws (monotonic · promotion-neutral incl. the MD-16 bound · convergence is honest) | `spec:validation.kind-evidence` (the promoted-evidence bound in law; the three bounds attributed to their decisions) · `spec:decisions.kind-conditional-floor` · `spec:decisions.carried-evidence` | carried |
| §3 the MD-13 representation note (the code table is the clause set's own source of truth; the two are mirror images) | `spec:validation.readiness-floor` ("the code-level source of truth and the realizing entrypoint… one law read twice, so any disagreement is drift to resolve on one side, never a second floor") · `spec:validation.kind-evidence` (the same posture for the table) · `docs/concept/DECISIONS.md` MD-13 · `src/validate/readiness-floor.ts` | carried |
| §3 `ready` is earned, not asserted, and is not a delivery fact; the floor may require anchors to *resolve*, never to exist; higher floors degrade gracefully | `spec:validation.readiness-floor` (the anchor clause reads the bindings that are present — the floor never demands a binding an author has not made) · `spec:decisions.binding-not-liveness` | carried |
| §3 `ready` is the floor plus a human's `declared` statement; no review fact is stored; where approval matters the signed git tag is the artifact and RBAC stays outside the model | `spec:consumers.design-review` (rule 3) · `spec:consumers.projections-model` (the *baseline* term: a named approved snapshot whose signed git tag is the approval artifact, approval outside the authored model) · `CONTEXT.md` · `00` §5 (surviving, the RBAC non-goal) | carried |
| §3 the stated-vs-derived blockquote — both ship; rendered beside, never overwriting; the banner fires only in the dishonest direction and names the first unmet clause | `spec:consumers.derived-readiness-banner` + `dishonest-divergence` and `honest-headroom` (all four rules, plus the below-`idea` case the doc never states) · `CONTEXT.md` "derived readiness" | carried — **phase-3 gap 2 closed at S3** |
| §3 the verb note — readiness is *stated/asserted*, never "claimed" ("claim" is reserved for the taxonomy) | `CONTEXT.md` "Locked usage" and the `readiness` term row's aliases-to-avoid | carried |
| §4 pack coherence, not member completeness; no duplicated-intent check; a Pack states no truth of its own | `spec:validation.pack-coherence` + `incoherent-aggregate` · `spec:model.pack-aggregate` (Pack · framing · membership · modelRefs) · `spec:validation.two-check-families` (never judges content quality) | carried |
| §5 validator self-testing (should-fail and should-pass evidence per validator; cheap insurance) | `spec:validation.validator-self-testing` — both directions, why the should-fail half is the load-bearing one, the cheap-by-construction line, and the standing refusal to make it a check. The dissolution criterion asks that the law be **carried by a Spec**, not that the Spec be `ready`; this one honestly stays `defined` (§8) | carried — **phase-3 gap 5 closed at S3** |
| §6 aspirational tiers (architecture enforcement · custom team rules · NFR-to-`observed` · `--lenient` · incremental builds/caching) | `00` §4 (architecture enforcement, incremental builds/caching, runtime observations incl. `nfr-violated`) · `07` §2 (the `--lenient` ratchet, in the ASPIRATIONAL map) · `07` §3 item 7 (custom `defineRule`) — all five named on surviving docs; the design-time NFR half is `spec:validation.kind-evidence`'s constraint row (a machine-readable target to state `defined`), and the cache bound is `spec:extraction.regenerability` | expository-only against `00`/`07` |
| §7 what CI guarantees at MVP | the §2 rows above · `spec:extraction.determinism` (`--check-clean`) | expository-only (summary) |

**Residue — exactly what keeps `05` alive.** Two rows, both narrow, both cheap to carry next phase:

13. **The per-team severity override** for the informative signals (`05` §2 check 8) — designed-for
    and deferred, named nowhere else. Natural carrier: one clause on
    `spec:validation.warn-level-signals`, or a `00` §4 / `07` §3 cut-list row.
14. **The team-overridable floor config** (`05` §3 opening ¶) — the thresholds are a Representation
    and a per-team floor config is designed-for and deferred; named nowhere else. Natural carrier:
    one clause on `spec:validation.readiness-floor` beside the MD-13 posture it already states.

Both are *deferrals*, not laws in force, which is precisely the class the phase-3 audit recorded as
gaps (per-PR hosted preview · `bySymbol`'s frozen-shape status · the harness/evidence half of
`07` §4). Grading them `carried` would repeat the D-7 mistake of conceding an uncarried surface
inside a `carried` row; grading them away as prose would repeat D-2/D-3. Neither was rushed into a
Spec this session: S4 authors no corpus law (that was S2/S3's work), and the dissolution decision
forbids bundling the carrying change with the deletion anyway.

**Deletion-cost inventory (recorded so the next attempt is one session, not two).** When the two
rows above are carried, a `05` deletion must re-point, in the same change: `CONTEXT.md`'s
"Validation & honesty (→ `05`)" section pointer · `docs/concept/DECISIONS.md` (MD-13 and MD-9 cite
`05` §3 as one of two mirrors — re-point at `spec:validation.readiness-floor` and
`spec:validation.kind-evidence`) · `docs/concept/README.md` (2 hits) · `06` (2) · `07` (2) · `01`
(1) · `jtbd-stories/01`, `/04`, `/05`, `/07` · `examples/checkout-v1/README.md` ·
`src/validate/validators.ts` (13 hits — the per-check `05 §2` provenance comments) ·
`src/validate/readiness-floor.ts` (5, including the header's "mirroring `05` §3 row-for-row") ·
`src/validate/contracts.ts` · `src/reader/reader.ts` · `src/projections/design-review.ts` ·
`src/model/sections.ts` · `src/extract/reify.ts` · `test/readiness.test.ts` ·
`test/extract.test.ts` · `test/fixtures/graph-validator.fixtures.ts` · and **two pinned quotes** in
`check-carrier-truth.mjs` (the one-validation-path claim at its `file:` row, and the
`STILL_SUPPORTED` classification row pinning "the type system's job in the TS carrier"), which
must be re-pointed at the carrying Spec rather than deleted — the `check-prose-schema.mjs`
precedent from the `02`/`03` deletions. Then ruling 14's two-form sweep (backticked/path forms and
the bare `05 §` form) to zero hits outside `plans/`, `reviews/`, `explorations/`.

### `06-consumers-and-projections.md` — re-grade: **gaps** · stays

Only the rows whose verdict moved are restated; every other row of the phase-3 table stands as
written.

| Doc section | Phase-3 verdict | Carrying surface now | Re-graded |
|---|---|---|---|
| §5 the per-spec field list — the stated-vs-derived readiness divergence banner | **gap** | `spec:consumers.derived-readiness-banner` + `dishonest-divergence` and `honest-headroom`; the rest of the field list (header · intent and behaviour · relations · bindings with source links · verification status · impact list · `claim` cues) stands on `spec:consumers.design-review` rules 1 and 4 and `spec:consumers.binding-language-views` | **carried** |
| §5 pages rewritten wholesale each run so no stale page survives | **gap** | `spec:consumers.wholesale-view-rewrite` + `stale-page-removed` — the temp-sibling/remove/one-rename sequence, the failed-run removal, the up-front invalidation in `runBuild`, and the `--check-clean` double render | **carried** |

**`06`'s surviving gaps** (6 rows): the impact graph's two assist roles (§2) · `bySymbol`'s
frozen-shape-but-aspirational status (§3) · the discipline ≈ kind/section mapping (§6) · the
disciplines × phases × iterations distribution chart (§6) · the per-PR hosted preview (§8) · the
Mermaid and reference-projection rows of the §1 taxonomy. All six are named out of scope by this
plan's §(c); `06` stays.

### `07-mvp-roadmap-and-open-questions.md` — re-grade: **gaps** · stays

| Doc section | Phase-3 verdict | Carrying surface now | Re-graded |
|---|---|---|---|
| §6 ① the one diagnostic rendering rule (location from the finding's structured fields; first contact fails clean) | **gap** | `spec:validation.diagnostic-rendering` + `composed-location` — one currency, the composed `path:line — [severity] validatorId — message` order, and both degradations | **carried** |
| §6 ③ the derived-readiness banner ships in the Design Review | **gap** | `spec:consumers.derived-readiness-banner` + its two points (the shared row with `05` §3 and `06` §5) | **carried** |
| §6 ④ `implemented` is a UI hazard — the fact name stays, views render binding language | **gap** | `spec:consumers.binding-language-views` + `bound-spec-page`; `spec:decisions.binding-not-liveness` keeps the model half | **carried** |
| §4 derived-readiness banner timing · impact-graph depth (both "resolved") | expository-only against `05` / `06` | unchanged — both mirrors survive, and the banner half now also stands on a Spec | expository-only (unchanged) |

**Drift note recorded, deliberately not repaired here.** `07` §6 ④ quotes the rendered binding
language as three lines ("Implementation binding … / Verifier binding … / Runtime observation …").
The view renders **four** — the expected-outcome oracle line landed with the oracle work — and
`spec:consumers.binding-language-views` states four. The doc's quote is illustrative rather than
false, and §2 S4 scopes this session's `06`/`07` work to the gap ledgers and "nothing more", so the
stale enumeration is recorded for the successor instead of edited under an audit-only session.

**`07`'s surviving gaps** (3 rows): inline-vs-centralized anchor semantics (§4, open) · when
harnesses / evidence become CORE (§4, open, the non-Gherkin half) · the measure-what-hurts
prioritization heuristic (§5). All three are named out of scope by §(c); `07` stays.

### The twelve phase-3 gaps, re-stated

| # | Gap | State after S4 |
|---|---|---|
| 1 | the readiness-floor clause tables (lower rungs + per-kind evidence) | **closed** — S2, `spec:validation.readiness-floor` (enriched) + `spec:validation.kind-evidence` |
| 2 | the derived-readiness banner (one direction · first unmet clause) | **closed** — S3, `spec:consumers.derived-readiness-banner` |
| 3 | the `implemented` view-label rule | **closed** — S3, `spec:consumers.binding-language-views` |
| 4 | the one diagnostic rendering rule | **closed** — S3, `spec:validation.diagnostic-rendering` |
| 5 | validator self-testing | **closed** — S3, `spec:validation.validator-self-testing` (carried at `defined`) |
| 6 | Design Review's wholesale page rewrite | **closed** — S3, `spec:consumers.wholesale-view-rewrite` |
| 7 | discipline ≈ kind/section mapping · the distribution chart (`06` §6) | stands — out of this phase's scope |
| 8 | the impact graph's two assist roles · `bySymbol`'s status (`06` §2/§3) | stands — out of scope |
| 9 | the per-PR hosted preview (`06` §8) | stands — out of scope |
| 10 | inline-vs-centralized anchor semantics · when harnesses/evidence become CORE (`07` §4) | stands — out of scope |
| 11 | measure-what-hurts (`07` §5) | stands — out of scope |
| 12 | the Mermaid and reference-projection surfaces (`06` §1/§8) | stands — out of scope |
| 13 | **new** — the per-team severity override for informative signals (`05` §2 check 8) | open — surfaced by the S4 re-audit; blocks `05` |
| 14 | **new** — the team-overridable floor config (`05` §3) | open — surfaced by the S4 re-audit; blocks `05` |

## §6 Done-record

*(written at close)*

## §7 Conversion / corpus ledger

*(maintained by the waves; state values `planned` → `done` / `deferred` / `dropped` with
reasons)*

| Wave | Law | Carrier Spec(s) | Planned points | State |
|---|---|---|---|---|
| S2 | lower floor rungs (`idea`/`scoped`/`defined` clauses) | `spec:validation.readiness-floor` (enriched) | 2–3 | done — 2 points (`at-least-one-relation` on a scoped probe · `no-blocking-open-questions` on a defined probe), both mutation-probed red |
| S2 | per-kind evidence table + MD-16 promoted-evidence bound | new `spec:validation.kind-evidence` | 1–2 | done — 3 points (behavior-family complete cell · constraint target · the promoted-evidence bound); one over the planned ceiling, taken deliberately so the MD-16 bound the Spec states is not the only row left unbound |
| S3 | derived-readiness banner (one direction · first unmet clause) | new `spec:consumers.derived-readiness-banner` | 1–2 | done — 2 points (`dishonest-divergence` names the first unmet clause · `honest-headroom` pairs the absent banner with the rendered stated-beside-derived line), both mutation-probed red |
| S3 | `implemented` view-label (binding language) | new `spec:consumers.binding-language-views` | 1 | done — 1 point (`bound-spec-page`: the four binding lines, the index row repeating them, and the internal fact names absent from both surfaces), mutation-probed red |
| S3 | wholesale page rewrite (atomic swap · no stale page) | new `spec:consumers.wholesale-view-rewrite` | 1 | done — 1 point (`stale-page-removed`, a temp-root world running the real `runView`), mutation-probed red; the law is realized at two sites (the up-front invalidation in `runBuild` plus the temp-and-rename in `runView`), so breaking one alone leaves the point green — recorded, and the Spec states both |
| S3 | one diagnostic rendering rule | new `spec:validation.diagnostic-rendering` | 1 | done — 1 point (`composed-location`: the composed prefix plus both degradations on one finding), mutation-probed red. **Family call:** the carrier lives in `specs/validation/` and refines `spec:validation.two-check-families`, because the law's subject is the Finding currency — a validation concept whose shape law that parent already carries. The consumers family offered no honest parent: `spec:consumers.projections-model` is a `model`-kind vocabulary rather than a law a rule refines, and `spec:consumers.design-review` is only one of the two rendering surfaces. The Design Review half rides a `dependsOn` edge to that Spec instead |
| S3 | validator self-testing | new `spec:validation.validator-self-testing` | 0–1 (may honestly stay `defined`) | done — 0 points, stated `defined`: the only mechanical verifier available would inspect the test corpus for should-fail/should-pass pairs, which polices the delivery process rather than conformance or honesty |

## §8 Readiness ledger

*(maintained at S2/S3 promotions and the S4 sweep; opening distribution `ready: 51 /
defined: 36` over 87)*

**S2 — the floor wave.** Six Specs enter the corpus, every one of them stated `ready` at
authoring because the floor clears and a resolving verifier lands in the same change: the new
rule Spec `spec:validation.kind-evidence`, its three `example` children
(`constraints-alone`, `untargeted-constraint`, `empty-promoted-child`), and the two `example`
children of `spec:validation.readiness-floor` (`unrelated-scoped-spec`,
`blocking-open-question`). `spec:validation.readiness-floor` was already `ready` and stays
`ready` and floor-clean after enrichment — its rule set grew, its descriptors did not move.

Refusals on the record: `spec:decisions.kind-conditional-floor` stays `defined` — the phase-3
decision precedent holds, a Decision Record's own maturity is not moved by a Spec citing it.
`spec:validation.kind-evidence` carries `has-verifier` but not `implemented`: no code anchor was
added for it, because the one anchor on the floor's evaluator already binds the realizing
entrypoint and a second anchor on the same file would be decorative.

Closing distribution: **`ready: 57 / defined: 36` over 93** (87 → 93 Specs · 65 → 70 anchors ·
153 → 164 nodes · 294 → 317 edges), zero errors and zero warnings over the regenerated graph.

**S3 — the view wave.** Ten Specs enter the corpus (opening distribution `ready: 57 /
defined: 36` over 93). Nine are stated `ready` at authoring because the floor clears and a
resolving verifier lands in the same change: the four new rule Specs
(`spec:consumers.derived-readiness-banner`, `spec:consumers.binding-language-views`,
`spec:consumers.wholesale-view-rewrite`, `spec:validation.diagnostic-rendering`) and their five
`example` children (`dishonest-divergence`, `honest-headroom`, `bound-spec-page`,
`stale-page-removed`, `composed-location`).

Refusals on the record. `spec:validation.validator-self-testing` stays `defined`: its content is
acceptance-grade and its floor clears, but no honest verifier exists — the only mechanical check
would read the test corpus for should-fail/should-pass pairs, which is workflow policing, so the
Spec carries no example child and no bound point. None of the four new rule Specs carries
`implemented`: no code anchor was added, because the projection artifact is already bound at its
entry (`impl:protocol.design-review`) and a second anchor per render helper on the same artifact
would be decorative — the S2 precedent, applied to the view surface.

Closing distribution: **`ready: 66 / defined: 37` over 103** (93 → 103 Specs · 70 → 75 anchors ·
164 → 179 nodes · 317 → 351 edges), zero errors and zero warnings over the regenerated graph.

**S4 — the readiness sweep.** Every one of the 37 Specs standing at `defined` when S4 opened,
dispositioned per-Spec under ruling 5. **Zero promotions, 37 honest refusals**, and the reason is
uniform at the mechanical level: *not one* of the 37 carries `has-verifier` in the regenerated
graph, so every promotion would introduce an `honesty/gaps` warning and fail ruling 5's clause (b).
Every one of them *does* clear the `ready` floor structurally (each page reads "structural floor
reached: `ready`"), so the refusals are about missing evidence, never about missing structure —
and inventing a verifier to enable a promotion is exactly what the ruling forbids. S4 adds no bound
points by design (that was S2/S3's work), so the per-Spec column below records *why no verifier is
the honest state for that Spec*, which is the judgment ruling 5 actually asks for.

Checked specifically, as the session's charter required: **no Spec whose verifier landed in S2 or
S3 is still sitting at `defined`.** All eleven Specs the two waves bound (the two floor carriers,
the four view carriers, and their example children) were stated `ready` at authoring in their own
wave; `has-verifier` is direct and never transitive, so the S3 points confer nothing on the
parents those Specs refine — which is why `spec:consumers.design-review` and its family still
stand at `defined` on evidence grounds rather than on tranche grounds.

| Spec | Disposition | Reason |
|---|---|---|
| `spec:protocol.self-hosting` | refuse | **phase-3 refusal stands verbatim**: the epic states whole-pipeline rules; no cheap verifier exists and promotion would add a gap warning |
| `spec:carrier.markdown-authoring` | refuse | **phase-3 refusal stands verbatim**: parent of four `ready` children; the executable path lives on them, not on it |
| `spec:consumers.agent-surface` | refuse | **phase-3 refusal stands verbatim**: two of its rules are measured-evidence claims, not runtime laws |
| `spec:consumers.reader` | refuse | **phase-3 refusal stands verbatim**: its verifier world is a full graph fixture — no cheap point, and S3's projections suite renders views rather than exercising the reader's entry adapters |
| `spec:consumers.design-review` | refuse — **reason updated** | the phase-3 reason ("projection rendering is outside this tranche") **no longer stands**: S3 built exactly that world. It stays `defined` on evidence, not on tranche — its own law (renders in context · pure projection · never a gate · deterministic Markdown · the escaping rule) has no point of its own, and the three S3 children that do carry points verify *themselves*, never their parent. Named as the strongest candidate for the next corpus wave |
| `spec:consumers.projections-model` | refuse | **phase-3 refusal stands verbatim**: vocabulary; its measured-curation terms are recorded evidence, not runtime law. Now also the parent of the view family whose points sit two hops away |
| `spec:consumers.edit-model` | refuse | **phase-3 refusal stands verbatim**: it states in its own words that it has no entrypoint and no verifier — the one Spec whose `defined` is stated by its own content |
| `spec:extraction.build-pipeline` | refuse | **phase-3 refusal stands verbatim**: the ordered flow's world is the CLI pipeline — a named out-of-scope giant |
| `spec:extraction.regenerability` | refuse | **phase-3 refusal stands verbatim**: its law is the clean-room rebuild, which is the phase close's proof, not a cheap point |
| `spec:extraction.claim-taxonomy` | refuse | **phase-3 refusal stands verbatim**: vocabulary; its clauses are exercised through `spec:validation.claim-separation`'s `ready` points, which verify that Spec and not this one |
| `spec:model.core-model` | refuse | **phase-3 refusal stands verbatim**: refused on ruling 1 — `test/descriptors.test.ts` is list equality, not a law |
| `spec:model.spec-sections` | refuse | **phase-3 refusal stands verbatim**: same reading as `core-model`; the section-name list is an assertion, not an example space |
| `spec:model.relations` | refuse | **phase-3 refusal stands verbatim**: vocabulary; relation grammar is exercised by referential-integrity's points |
| `spec:model.pack-aggregate` | refuse | **phase-3 refusal stands verbatim**: vocabulary; the pack law is carried executably by `spec:validation.pack-coherence` |
| `spec:model.protocol-domain` | refuse | **phase-3 refusal stands verbatim**: a four-term vocabulary with no runtime law to bind |
| `spec:validation.validator-self-testing` | refuse — **S3 refusal re-judged and upheld** | re-judged this session against the S3 projections suite: still no honest verifier. Its law is evidence discipline *over* the validators, so any mechanical check would read the test corpus for should-fail/should-pass pairs — policing the delivery process, which the standing guardrail forbids and which the Spec itself states as a non-goal. A point that merely re-ran an existing validator test would verify that validator, not this discipline. Honest `defined` with acceptance-grade content |
| 21 × `spec:decisions.*` (`adopt-the-nouns` · `agent-surface-scripts-graph` · `binding-not-liveness` · `carried-evidence` · `carrier-ruling` · `concept-docs-dissolve` · `content-only-sections` · `envelope-grammar-posture` · `exclusion-contract` · `executable-meta-model` · `kind-conditional-floor` · `mcp-deferred` · `one-primitive` · `one-validation-path` · `pack-reified` · `plain-language-references` · `point-per-example` · `prose-ownership` · `protocol-naming` · `sdp-ts-extension` · `typing-law`) | refuse ×21 | **phase-3 refusal stands verbatim**: a Decision Record's truth is a ratified choice, not a runtime behavior — no verifier exists and none was invented. The S2 precedent reconfirms it: `spec:decisions.kind-conditional-floor` gained a citing Spec *and* three bound points downstream this phase and still stays `defined`, because a Spec citing a decision does not mature the decision |

Closing distribution: unchanged at **`ready: 66 / defined: 37` over 103** — 179 nodes · 351 edges,
zero errors and zero warnings. No spec file, oracle transcription, or histogram literal moved,
because nothing was promoted.

## §9 Session and gate ledger

Sessions execute sequentially; each closes with a green twelve-leg gate, a regenerated Design
Review where the wave touched the corpus, and a commit series on the effort branch. This
ledger is git process evidence, never graph content.

| Session | Delivers | Gate discipline | State |
|---|---|---|---|
| S1 | the oracle split (§2 S1) | orchestrator-verified green gate | done — 21 `it()`s over one hoisted extraction; the frozen expectation moved to ten authored modules under `test/self-hosting-oracle/` (seven family files, pack manifest, declared relations, anchors) plus their aggregating index; zero assertion loss (every one of the 27 original `expect` sites survives, 5 added: three oracle-length cross-checks and the two-assertion "no Spec outside the families" law), the node-id roster derived from the authored arrays per ruling 10; counts unchanged at 87/1/65 · 153 · 294 · ready 51 / defined 36 |
| S2 | shared constant + floor wave | orchestrator-verified green gate | done — `contract-dependent-suites.mjs` now states the per-tree rows once and both `vitest-test.mjs` and `eslint.config.js` read it (clean-room proof: lint passes with `generated/contracts` moved aside, the wrapper still fails fast with the same recovery text); the floor wave carried the `idea`/`scoped`/`defined` rungs into `spec:validation.readiness-floor` and the per-kind table into the new `spec:validation.kind-evidence`, with 5 bound points each mutation-probed red for the clause it names; corpus 87 → 93 Specs, `ready` 51 → 57 |
| S3 | view wave + seventh bound suite | orchestrator-verified green gate | done — five laws carried (banner · view-label · wholesale rewrite · diagnostic rendering · validator self-testing), ten Specs added, five bound points in the new `test/self-hosting-projections.test.ts`, each mutation-probed red for the law it names; the suite entered the shared constant once and both surfaces followed (clean-room proof: with `generated/contracts` moved aside, lint passes with the row and fails with five unsafe-argument errors without it, while the wrapper refuses fast with the recovery text); corpus 93 → 103 Specs, `ready` 57 → 66 |
| S4 | readiness sweep + re-audits (± the `05` deletion) | orchestrator-verified green gate over the regenerated Design Review | done — the sweep dispositioned all 37 `defined` Specs with zero promotions and 37 named refusals (§8): none carries `has-verifier`, so every promotion would have added an `honesty/gaps` warning, and no verifier was invented to enable one. The `05` re-audit closed all three of its phase-3 gaps (S2's floor wave, S3's banner and validator-self-testing carriers) and surfaced **two new gap rows** — the per-team severity override and the team-overridable floor config, both designed-for deferrals named nowhere else — so **`05` stays** and its residue plus a deletion-cost inventory are recorded (§5a). `06` and `07` re-graded: six of the twelve phase-3 gaps closed, both docs stay. Records-only session — no product surface changed, graph numbers unmoved at 103/1/75 · 179 · 351 · `ready` 66 / `defined` 37 |
| S5 | adversarial review, remediation, full close, done-record | full chain + clean-clone; review archived | planned |

Owner ratification of every gate above happens at the phase PR review; no live owner
acceptance occurs during execution.
