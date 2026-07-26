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
| shared-constant bypass | a new contract-dependent suite lands outside the constant | unfired |
| separate example-id namespace | a collision or real pressure appears | unfired (watch continues from phase 3) |

## §4 Docket ledger (carried in from plan 20)

Markdown Pack syntax ruling · the gen-1 `.feature` adapter · the no-reparse read seam ·
temporal-guard token assembly · the editor-association gap · corpus-test granularity (owned by
this phase — S1 is the session that dispositions it) · control-character latitude · the
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
   with honest ledgers.
6. **The gate holds throughout**: `npm run check` green at every blessed commit; the close
   runs the full chain plus the clean-clone proof.
7. **Records continue**: the session ledger, watch items, and docket rows are terminal or
   carried with reasons; the adversarial review is archived with every finding dispositioned
   before close.

## §6 Done-record

*(written at close)*

## §7 Conversion / corpus ledger

*(maintained by the waves; state values `planned` → `done` / `deferred` / `dropped` with
reasons)*

| Wave | Law | Carrier Spec(s) | Planned points | State |
|---|---|---|---|---|
| S2 | lower floor rungs (`idea`/`scoped`/`defined` clauses) | `spec:validation.readiness-floor` (enriched) | 2–3 | planned |
| S2 | per-kind evidence table + MD-16 promoted-evidence bound | new `spec:validation.kind-evidence` | 1–2 | planned |
| S3 | derived-readiness banner (one direction · first unmet clause) | new Spec under `specs/consumers/` | 1–2 | planned |
| S3 | `implemented` view-label (binding language) | same family | 1 | planned |
| S3 | wholesale page rewrite (atomic swap · no stale page) | new Spec | 1 | planned |
| S3 | one diagnostic rendering rule | new Spec | 1 | planned |
| S3 | validator self-testing | new Spec | 0–1 (may honestly stay `defined`) | planned |

## §8 Readiness ledger

*(maintained at S2/S3 promotions and the S4 sweep; opening distribution `ready: 51 /
defined: 36` over 87)*

## §9 Session and gate ledger

Sessions execute sequentially; each closes with a green twelve-leg gate, a regenerated Design
Review where the wave touched the corpus, and a commit series on the effort branch. This
ledger is git process evidence, never graph content.

| Session | Delivers | Gate discipline | State |
|---|---|---|---|
| S1 | the oracle split (§2 S1) | orchestrator-verified green gate | planned |
| S2 | shared constant + floor wave | orchestrator-verified green gate | planned |
| S3 | view wave + seventh bound suite | orchestrator-verified green gate | planned |
| S4 | readiness sweep + re-audits (± the `05` deletion) | orchestrator-verified green gate over the regenerated Design Review | planned |
| S5 | adversarial review, remediation, full close, done-record | full chain + clean-clone; review archived | planned |

Owner ratification of every gate above happens at the phase PR review; no live owner
acceptance occurs during execution.
