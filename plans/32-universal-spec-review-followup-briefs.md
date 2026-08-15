# Plan 32 briefs — the plan-31 review follow-up

> **Status: 🧭 BRIEFS — planning input, not execution authority.** The merged findings of a
> five-agent review of `feature/universal-spec` (plan 31, briefs A–D), recorded so a future
> planning session can cut them into todos. Nothing here is a todo yet: no file is claimed, no
> wave is assigned, no acceptance criterion is agent-executable. Settled ground is **plan 31
> (✅ EXECUTED)** — carrier universality, derived runnable modules, census/Mermaid projections,
> and structural anchor semantics.
>
> **Numbering.** This file takes 32 and keeps it. The next-arc brief index remains plan 29; brief
> E is still uncommissioned there and is *not* re-briefed here.
>
> **Re-measure, never inherit.** Every count, readiness, and finding below was measured at HEAD
> `002849f`. A session opening this file re-runs the queries and the gate first; a row that no
> longer reproduces is closed with that reason, not carried forward.

## Provenance

Four independent reviewers read the same branch (merge-base `4ccc2e9b`, 89 files, +5467/−156) and
filed reports under `.omo/evidence/pr-review-universal-spec/`: two deep architectural reads
(`arch-fable.md`, findings F1–F10; `arch-kimi.md`, K1–K9), one empirical verification pass with a
reproduction ledger (`technical-gpt.md`, T1–T8), and one gap-and-conformance pass against the
plan-29 briefs (`gap-grok.md`, G1–G11 plus an upcoming-work list). A fifth agent adjudicated:
re-ran the gate, re-derived the contested evidence, deduplicated the four registers, and dropped
what did not reproduce. The adjudication record is
`.omo/evidence/pr-review-universal-spec/JUDGE-synthesis.md`.

Two contested claims were settled by measurement rather than by reviewer confidence.

**The gate is red at HEAD, and it is not an environment artifact.** `npm run check` exited 1 on two
consecutive runs with no competing test processes: `test/design-review.test.ts:195` and
`test/self-hosting-duplicate-ids.test.ts:193` both hit Vitest's default 5000 ms budget. Run in
isolation the same two tests take 1332 ms and 1215 ms; run with `--testTimeout=20000` the whole
suite is green (59 files, 812 passed, 1 skipped) and every gate leg after `test` passes, preflight
included. So the cause is unbudgeted default timeouts on whole-corpus extraction tests competing
inside the pooled run — machine load amplifies it, but the margin is structural. The architectural
reviewers' targeted suites really were green; they simply never exercised the pooled path.

**Structural extraction is stricter than the decision it implements.** The structural anchor
semantics decision rules a dangling `component`/`uses` target an *error*
(`specs/decisions/structural-anchor-semantics.sdp.md:18`) and scopes whole-anchor refusal to a
*malformed* structural field (line 25); the commissioning plan drew the same line and its QA
scenarios contrast the two cases. The code withholds the whole anchor for **any** structural
finding, including referential integrity, and iterates to a fixed point
(`src/extract/index.ts:139-172`). Because the withheld anchor's `satisfies` edge goes with it, a
one-character typo in `uses` now removes `implemented` from the Spec that anchor realized — and the
cascade extends that to anchors whose own declarations are valid. That contradicts the decision's
own non-conferral clause (line 23) and the derive doctrine still stated in the file this branch
edits (`src/extract/derive.ts:109`). The intent layer already disagrees with itself: the model Spec
was broadened in this branch to "Any failure excludes the whole code anchor"
(`specs/model/anchors.sdp.md:18`) while the decision's narrower wording was left as written.

---

## Theme 1 — Make the green gate honest again (R1)

The repo's discipline is "run `npm run check` before claiming green," and plan 31's durable record
claims a completed gate. Both cannot stand while the gate exits 1 on a developer machine. This is
the one row that blocks merge.

The fix is a budget, not a redesign: give the two whole-corpus tests explicit, justified timeouts
(or set a repository-wide `test.testTimeout` in `vitest.config.ts`, which currently sets none), then
run the full gate enough times to show it is stable rather than merely lucky. Worth recording while
in there: this branch grew the tracked spec corpus from 147 to 153 files, which is exactly the cost
these tests pay, and it touched `vitest.config.ts` only to add the `/testing` alias — so the branch
plausibly pushed a pre-existing margin over the line rather than creating the fragility. The
counterfactual on `main` was not measured and should not be asserted either way without measuring
it.

## Theme 2 — Restore the ruled dangling-target semantics (R2, R3)

Two lawful resolutions exist; the session picks one deliberately and records it.

**(a) Bring the code to the decision — the cheaper path.** Keep the anchor, emit the dangling
structural edge, and let graph-level referential integrity error on it: the unresolved id is the
sentinel, which is the doctrine already written into `derive.ts`. Whole-anchor refusal stays where
the decision put it — malformed, non-static, and envelope failures at reification, which
`src/extract/anchors.ts:395-443` already handles. `satisfies` survives a structural typo, so
`implemented` stops moving at a distance and the fixed-point cascade disappears with the
withholding. The amended sentence in `specs/model/anchors.sdp.md:18` must then come back to the
decision's narrower scope, and `test/structural-anchors.test.ts:179-194` (which pins whole-anchor
exclusion for a *dangling* target as intended behavior) is rewritten.

**(b) Amend the decision to rule fail-closed withholding.** Then the delivery-fact ripple has to be
ruled as a consequence, which contradicts the non-conferral clause as currently worded, so that
clause is amended too — and the transitive cascade should still go: withhold the offending anchor,
never anchors whose own declarations are valid.

The census section follows from the choice. Today the "Dangling structural references" subsection is
unreachable through the real pipeline: extraction removes the offending anchor before the final
derive, so no dangling structural edge exists, and the projection filters `reader.findings()`
against endpoints of *retained* structural edges (`src/projections/census.ts:225-235`). It always
prints the empty state. Under (a) the section becomes reachable exactly as commissioned, and
`test/census.test.ts:277-314` stops constructing a state the extractor cannot produce. Under (b) the
section is provably dead and must either be deleted or re-sourced from the extraction report, which
is the only place the withholding findings live.

## Theme 3 — Make derived registrars falsifiable and reconciled (R4, R5, R19)

This branch introduced the repo's first tracked generated code, and the property that makes
"derived" a claim worth anything — falsifiability — is not yet enforced on it.

**No failing byte-equality gate.** `examples/checkout-v1/test/orders/orders.create-order.valid-cart.test.generated.ts`
is tracked past the new `.gitignore:20` rule. Nothing compares the committed bytes against fresh
codegen and *fails*: `--check-clean` compares two in-process generations to each other
(`src/cli/build-command.ts:169-176`), preflight's `failures` array covers script-owned generated
roots and untracked garbage only, so a modified tracked registrar surfaces in the printed semantic
diff summary but never in `failures` (`preflight.mjs:155-188`), and CI never runs
`git diff --exit-code`. Meanwhile `generate:example` silently repairs the working copy before the
tests run, so the executed bytes stay honest while the committed artifact a reviewer reads is
unverified. Locally, with no build first, the authored test's relative import executes the stale
committed bytes.

**No reconciliation and no cleanup.** Registrars are written file-by-file with no owned root and no
stale removal (`build-command.ts:207-211`), unlike `graph.json` and the contracts tree, which get
wholesale temporary-rename replacement. Consequences measured: 69 ignored `*.test.generated.ts`
files currently sit interleaved with authored suites in this working tree; removing a `specTest`
anchor leaves an obsolete registrar behind after an exit-0 build; and because the registrar writes
sit outside the build's rollback set, a mid-write failure leaves partial siblings against the CLI's
all-or-nothing artifact claim. Candidate directions: emit under an owned generated root that
adopters import from, or keep the sibling placement and reconcile it through a manifest, deleting
what this run does not owe.

Fold the posture itself into the same work: "an adopted registrar is committed" lives only in a
behavior-Spec rule (`specs/extraction/runnable-modules.sdp.md:19`) and a `.gitignore` comment. It
plausibly passes the ADR three-part test — hard to reverse once adopters spread, surprising without
context, a real trade-off against the gitignore-everything posture — and it should either earn a
registry row alongside the gate or be recorded as deliberately not a decision.

## Theme 4 — Ratify the two new decisions (R6)

`specs/decisions/carrier-universality.sdp.md` and
`specs/decisions/structural-anchor-semantics.sdp.md` both state `readiness: ready`, but
`docs/concept/DECISIONS.md` still ends at MD-28 with no row for either. The decision readiness
posture defines `ready` on a decision Spec as registry ratification, so the two Specs claim
evidence that does not exist. No validator can catch this — checks never police content — which is
precisely why review must. Either append the next two registry rows with ratified names, one-line
glosses, and Spec pointers, or restate both Specs at `defined` until they are ratified. Until then
every document referring to these rulings must point at bare Spec IDs, against the lead-with-meaning
discipline.

## Theme 5 — Close the frozen registrar's semantic gaps (R7, R9, R10, R11, R13)

Five findings sit on the runnable-module runtime. Only the first changes behavior for a lawful
authored shape; the rest are honesty and consistency repairs that are cheap now and awkward after
adopters build on the freeze.

- **Multi-`When` scenarios invoke the product call once per `When` step.** Codegen emits
  `await invokeRunnableExample(execution)` in every `when` binding
  (`src/codegen/contracts.ts:914-915`), and the runner runs every step occurrence, so a scenario
  with two `When` steps executes a non-idempotent invoke twice. The corpus has zero multi-`When`
  examples today (measured), so this is latent — but `when: string[]` is lawful in both carriers and
  the interface is frozen. Either invoke once or name multi-`When` refused in the freeze.
- **Comparator failures print `at step:` twice.** The comparator's context string already carries the
  prefix (`src/testing/index.ts:77,84`) and the runner adds its own
  (`src/runner/index.ts:142-150`). Let the runner own the single prefix; the current test regex
  tolerates the duplicate and would not catch a regression.
- **The oracle runs before the incomplete-point refusal**, and the refusal is broader than frozen:
  `adapters.expected(point)` is called at `src/testing/index.ts:37` and missing conditions are
  checked at 38-44, so an adopter oracle that dereferences a missing condition throws first and
  masks the deterministic diagnostic the refusal exists to give. The in-repo oracle had to be
  amended to tolerate partial points, which is the hazard showing up in practice. The throw then
  refuses the whole scenario rather than only the oracle comparison.
- **`unspecified` means two opposite things.** The runner documents it as "a coverage gap, never an
  error" (`src/runner/index.ts:157-160`); in the registrar runtime an `unspecified` oracle matches
  no `Then` and reddens the test. Reddening for a *bound* example is arguably the honest choice —
  then the runner comment is stale and an adopter reading it designs oracles against the wrong law.
- **Registrar placement silently picks the lexicographically first anchored suite**
  (`src/codegen/contracts.ts:1093-1102`), while the freeze says "a second registration path for the
  same example is refused." Deterministic, but silent where the Spec language implies loudness:
  either emit a finding naming the unselected suites or restate the sentence as deterministic
  attribution.

## Theme 6 — Honour the Gherkin view's own lossy rule (R8)

`spec:consumers.gherkin-view` rule 3 requires that "content Gherkin cannot carry honestly is marked
[as lossy commentary] rather than invented as structure." `renderSpecPage`
(`src/projections/gherkin-view.ts:269-297`) renders `design` and `ui` sections nowhere — no
structure and no commentary — and for canonical kinds it renders only intent, verification, and
behavior, so a behavior Spec's inline `constraints`, `model`, or `decision` content would vanish
too. This is live, not theoretical: `spec:carrier.markdown-pack-authoring` carries a `design`
section and `spec:consumers.design-review` carries a `ui` section, both at canonical kinds, so both
pages drop authored content silently today. The projection is disposable so no truth is lost — but
the branch authored the rule and broke it in the same commit, which the drift rule says to fix on
one side deliberately.

## Theme 7 — Settle one publish posture for projection verbs (R12)

Three verbs added in one arc implement near-identical wholesale-rewrite Spec sentences with two
different gating policies: `sdp mermaid` refuses to publish over a graph with validation errors
(`src/cli/mermaid-command.ts:98`), while `sdp census` and `sdp gherkin` publish and then return
nonzero (`census-command.ts:82`, `gherkin-command.ts:89`, inheriting `sdp view`'s posture). Either
mermaid over-refuses a pure, correctly-labeled projection of an existing graph, or the other two
publish output derived from a graph the checks just condemned. The Specs do not settle it; pick one
posture for all projection verbs or name the divergence in the carrying Specs.

## Theme 8 — Pay the verification debt the new surface took on (R14)

Coverage on the new surface is broadly strong; five gaps are precise and each names its own test.

1. No test makes `observe(world)` disagree with `expected(point)` — the third comparator leg is
   unproven, as is the claim that domain assertions are skipped after it fails.
2. No test proves the oracle is *not* called for an incomplete point (a spy or throwing oracle).
3. The exhaustive mapped type is asserted as an emitted substring
   (`test/codegen.test.ts:98-132`), never compile-probed; the only proof is transient task evidence,
   while compile-time refusal is part of the adopter contract.
4. Mermaid bounds are tested at limit + 1 only; nothing pins exactly 64 nodes and exactly 128 edges
   as *accepted*, so the `>` comparisons are unprotected in the accepting direction.
5. No publication test removes an anchor and proves obsolete registrar cleanup, and none injects a
   registrar write failure against the all-or-nothing claim (both follow theme 3).

## Theme 9 — Bind and place the arc's own Specs (R17)

The branch adds three rows to the model's headline honesty signal without a sentence recording it:
the drift alarm (`implemented ∧ ¬ready`) now names 11 Specs, three of them this branch's
`spec:consumers.census-page`, `spec:consumers.mermaid-view`, and `spec:consumers.gherkin-view`.
Adding a Spec and its implementation in one session is normal self-hosting practice, so the fix is
a recorded posture, not a retraction. The inverse inconsistency is more interesting: the arc's
keystone freeze `spec:extraction.runnable-modules` has **zero** incoming edges and empty delivery
facts, so the graph cannot see brief B's realization at all while its three sibling projection
Specs are anchored. Anchor the registrar emitter to the freeze, bind a `specTest` for the census
page, then either mature the four Specs through Design Review or record the deliberate sub-`ready`
posture.

## Theme 10 — Hygiene repairs (R15, R16, R18, R20)

Small, mechanical, and worth doing in one pass.

- **Registry rows.** Append the two decision rows per theme 4; that is the same repair, listed here
  so the hygiene pass does not miss it.
- **CLI surface in the on-ramps.** `AGENTS.md:107` still says the full surface is
  `sdp build · validate · view · import · q`; neither `docs/agent-surface/recipes.md` nor any
  repository-owned skill mentions `census`, `mermaid`, or `gherkin` (grep returns nothing). Update
  the surface sentence and the skill bootstrap with a one-line projection-verbs note. Do not mint
  new query recipes here — that is brief E's work.
- **Generate/check wiring.** `generate:self-hosting`, `check:self-hosting`, `generate:example`, and
  `check:example` still run only `view`/`build`, while every build *invalidates* the census, Mermaid,
  and Gherkin roots (`src/cli/build-command.ts:99-109`). A green `check:self-hosting` therefore
  leaves three published projections absent. Add separate `--check-clean` steps per verb, mirroring
  the ruling that these are not bolted onto Design Review's transaction.
- **checkout-v1 walkthrough.** `examples/checkout-v1/README.md:73-74` still claims a stale handler
  key can fail the test; the migrated authored test has no step-skeleton keys, and drift now reddens
  the generated registrar's mapped type or the oracle kind. The walkthrough never names the
  committed registrar sibling, nor that `generated/` is no longer the whole derived story. This is
  the tracer-bullet proof document, so it should describe the shape it headlines.
- **Evidence-file correction.** `.omo/evidence/arc-keystone-engines/task-8-self-hosting-rationale.md:34`
  says `vitest.config.ts` excludes `**/*.test.generated.ts`. No such exclude exists — the include
  pattern simply does not match. The behavior is right; the recorded reason is wrong.
- **Record hygiene.** The plan-31 durable record is status-only, so declined branches (the default
  flip, `implements`, deferred brief E) are not readable without `.omo/`; plan 29 still says brief A
  "remains the open owner of kind coverage, rich content, and any default-carrier flip," which plan
  31 ruled; and the `docs/concept/06` taxonomy table still lists Mermaid as a nameless candidate
  without census or Gherkin view. All optional, all one-screen fixes.

---

## Do not reopen

These were ruled, declined, or deliberately held on this branch. Reopening any of them needs a new
ruling, not a follow-up todo.

- **The default-carrier flip.** Markdown stays the default; the carrier ruling and the Gherkin
  carrier option gained forward pointers only, not an operative-record flip.
- **Gherkin kind expansion.** Six kinds stay Markdown with per-kind lie reasons; refusal was the
  lawful outcome, not a gap.
- **DocStrings and DataTables.** Still refused. Rich content landed as a bound on existing prose
  owners, not new body syntax.
- **Gherkin Packs.** Out of scope; Packs stay under the Pack syntax ruling.
- **An `implements` slot.** Declined — contract realization remains `satisfies` by authoring
  convention.
- **O5 and Scenario Outlines.** The engine never loads or executes adopter code; outlines stay
  refused as executable carrier constructs.
- **Re-specifying the shipped Design Review.** Its determinism and confer-nothing laws are
  inherited, never re-decided.
- **`bySymbol` and the impact graph.** `spec:consumers.impact-graph` is still at `idea` with its
  blocking identity question intact.
- **The `.sdp.gherkin` suffix (MD-28).** Untouched on this branch and not in scope here.

## What is not in this file

Brief E's commissioning belongs to plan 29, whose sequencing condition is now satisfied — the census
projection and the structural edge types are both queryable. Adopting the registrar across the 30
deferred self-hosting families is brief B follow-on work, not a review finding. Authoring
Protocol-side `component`/`uses` bindings, a Mermaid rendering that specializes structural edges,
and the remaining brief C candidates (reference projection, context bundle, Spec Studio) are all
open forward work rather than defects, and none of them belongs to a fix pass.
