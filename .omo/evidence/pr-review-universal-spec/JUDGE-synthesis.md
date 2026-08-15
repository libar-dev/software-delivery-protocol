# Judge synthesis — MoA review of `feature/universal-spec` (plan 31, briefs A–D)

Judge did not participate in wave 1. Base `4ccc2e9b`, HEAD `002849f`. Every kept finding was
re-checked against the tree; measurements below were taken by the judge, not inherited.

Inputs: `arch-fable.md` (F1–F10), `arch-kimi.md` (K1–K9), `technical-gpt.md` (T1–T8 + ledger),
`gap-grok.md` (G1–G11 + upcoming-work list). Operative law read: `AGENTS.md`, `CONTEXT.md`,
`.omo/plans/arc-keystone-engines.md`, `plans/29-…briefs.md`, and both new decision Specs.

---

## 1. Adjudication — the contested gate claim

**Verdict: genuine failure. Not an environment artifact.** The technical reviewer's T1 reproduces.

| Run | Command | Result |
| --- | --- | --- |
| 1 | `npm run check` | red — `test/design-review.test.ts:195` timed out at 5000 ms (5096 ms observed) |
| 2 | `npm run check; echo GATE_EXIT=$?` | **`GATE_EXIT=1`** — `design-review.test.ts:195` (5572 ms) *and* `self-hosting-duplicate-ids.test.ts:193` (5025 ms) both timed out; 2 failed files, 751 passed, 1 skipped |
| 3 | `npx vitest run test/design-review.test.ts test/self-hosting-duplicate-ids.test.ts` | green — the two tests take **1332 ms** and **1215 ms** in isolation |
| 4 | `npx vitest run --testTimeout=20000` | green — 59 files, **812 passed**, 1 skipped, exit 0 |
| 5 | `check:self-hosting-gates && check:self-hosting && check:example && preflight` | all green; preflight prints `clean` |

No competing test process was running (`ps` shows only desktop background load; no other node/vitest
processes). Both failing tests are whole-corpus extraction tests running on Vitest's **default
5000 ms** budget — `vitest.config.ts` sets no `testTimeout` — inside a pooled run that does ~76 s of
test work in ~32 s of wall clock on 8 cores. Load amplifies the failure; it does not create it. The
architectural reviewers' targeted-suite greens are also true and simply never exercise the pooled
path, so the two positions were not in real conflict.

Scope note, stated honestly: the branch grew the tracked spec corpus from **147 to 153** files, which
is exactly the work these two tests do, and touched `vitest.config.ts` only to add the `/testing`
alias. That makes it plausible the branch pushed a pre-existing margin over the line rather than
creating the fragility — but the `main`-side counterfactual was **not measured** and should not be
asserted. Fix: explicit justified timeouts (or a repository `testTimeout`), then repeat the gate to
show stability. Plan 31's completed-gate claim needs reconciling either way.

## 2. Adjudication — dangling structural targets

**Verdict: the code exceeds the decision. F2 is upheld on the law; K6/T3 are the visible cost of the
same defect.**

**What the decision ruled.** `specs/decisions/structural-anchor-semantics.sdp.md:18` — "Every
`component` and `uses` target must exist as a `CodeNode`; a dangling graph ID is an error." Line 25
scopes whole-anchor refusal narrowly: "a **malformed** structural field refuses the whole anchor
rather than yielding a partial declaration." Line 23 rules that structural fields "mint no delivery
facts, add no delivery status, and do not change readiness floors." The commissioning plan drew the
same two-case line — "malformed structural field excludes the WHOLE anchor" *and*
"referential-integrity covers dangling targets (error, not warning)" — and its todo-5 QA scenarios
contrast dangling → referential error against non-static → whole-anchor exclusion.

**What the code does.** `excludeInvalidStructuralAnchors` (`src/extract/index.ts:139-172`) derives a
candidate graph, runs `validateStructuralAnchorEdges` — referential integrity **plus** every
structural check (`src/validate/validators.ts:695-705`) — removes every code anchor named by any
finding, and repeats to a fixed point. So dangling targets, namespace violations, duplicate edges,
and multi-component sources all get whole-anchor treatment, and the withholding cascades by design
(the code comment says so): an anchor whose only fault is `uses: [A]` where A was itself withheld is
withheld in turn. `test/structural-anchors.test.ts:179-194` pins the dangling case as intended
("rejects a missing component target **and excludes the whole anchor**"). The withheld anchor's
`satisfies` edge disappears with it, so the Spec it realized loses `implemented`.

**Why that matters against the repo's own law.** A one-character typo in `uses` now *removes* a
delivery fact, and the cascade removes facts from Specs realized by anchors whose declarations are
perfectly valid. Structural annotations were sold as intent-free and non-load-bearing; withholding
makes them load-bearing at distance, and it contradicts line 23 as written. Intended truth also
disagrees with itself: this branch broadened `specs/model/anchors.sdp.md:18` to "**Any failure**
excludes the whole code anchor" to match the code, while the decision's narrower wording was left
untouched. The standing derive doctrine in the very file the branch edits still says the opposite —
"A dangling target is emitted, not dropped: the unresolved id itself is the sentinel"
(`src/extract/derive.ts:109`) — true of `deriveGraph` in isolation, false of the pipeline wrapping
it. Kimi's framing ("fail-closed structural extraction done right") describes a defensible design,
but not the one that was ruled.

**Correct fix direction — code, not Spec, is the cheaper resolution.**

- **(a) Conform the code.** Keep the anchor, emit the dangling structural edge, let graph-level
  referential integrity error on it. Whole-anchor refusal stays where the decision put it: malformed,
  non-static, and envelope failures at reification, already handled in
  `src/extract/anchors.ts:395-443`. `satisfies` survives, `implemented` stops moving at a distance,
  and the cascade disappears with the withholding. Requires reverting the model-Spec broadening and
  rewriting `test/structural-anchors.test.ts:179-194`.
- **(b) Amend the decision** to rule fail-closed withholding as intended — which forces amending the
  non-conferral clause too, since the delivery-fact ripple becomes a ruled consequence — and kill the
  transitive cascade regardless.

**The census section under each resolution.** Today the "Dangling structural references" subsection
is unreachable: extraction removes the offender before the final derive, and the projection filters
`reader.findings()` against endpoints of *retained* structural edges
(`src/projections/census.ts:225-235`), so it always prints the empty state. Under **(a)** it becomes
reachable exactly as todo 10 claimed, and `test/census.test.ts:277-314` stops constructing a state
the extractor cannot produce — K6 and T3 dissolve as a side effect. Under **(b)** it is provably dead
and must be deleted or re-sourced from the extraction report, the only place withholding findings
live. Resolving toward (a) closes three findings with one change.

## 3. Merged findings register

| ID | Sev | Conf | Merged statement | Evidence | Sources | Fix direction |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | blocker | high | `npm run check` exits 1 at HEAD: two whole-corpus tests exceed Vitest's default 5 s budget in the pooled run. Green with `--testTimeout=20000`; 1.2–1.3 s in isolation; all later gate legs pass. | judge runs 1–5 above; `vitest.config.ts` (no `testTimeout`) | T1 | Explicit justified timeouts or a repository `testTimeout`; re-run the gate for stability; reconcile plan 31's gate claim. |
| R2 | major | high | Structural extraction withholds the whole anchor for **dangling** targets and cascades to a fixed point, exceeding the ruling and stripping `implemented` from the satisfied Spec. | `src/extract/index.ts:139-172`; `validators.ts:695-705`; `test/structural-anchors.test.ts:179-194`; decision lines 18/23/25; `derive.ts:109`; `specs/model/anchors.sdp.md:18` | F2, K6(part) | Adjudication 2 (a) preferred; else amend the decision and kill the cascade. |
| R3 | major | high | The census "Dangling structural references" subsection cannot surface a real dangling reference; its test injects a state the extractor cannot produce. | `src/projections/census.ts:225-235`; `test/census.test.ts:277-314`; T3 repro | K6, T3 | Falls out of R2(a); otherwise delete or source from the extraction report. |
| R4 | major | high | The one committed generated registrar has no **failing** byte-equality gate anywhere: `--check-clean` compares two in-process generations, preflight prints tracked-registrar drift but never fails on it, CI runs no `git diff --exit-code`. | tracked `examples/checkout-v1/test/orders/orders.create-order.valid-cart.test.generated.ts`; `.gitignore:20`; `build-command.ts:169-176`; `preflight.mjs:155-188` | F1, T2(part) | Make preflight fail on tracked-registrar drift, or byte-compare on-disk registrars in `--check-clean`. |
| R5 | major | high | Registrars are written one-by-one with no owned root, no stale removal, and no rollback: 69 ignored siblings currently sit in the authored test tree, removing a `specTest` leaves an obsolete registrar after an exit-0 build, and a mid-write failure leaves partial siblings against the all-or-nothing claim. | `build-command.ts:207-211` vs 179-198; `find` count 69; T2 repro; `src/cli/sdp.ts:39-41` | F5, K7, T2 | Owned generated root or manifest reconciliation; delete what a run does not owe. |
| R6 | major | high | Both new decision Specs state `ready` without registry ratification, which is what `ready` *means* for a decision record. | `carrier-universality.sdp.md:5`; `structural-anchor-semantics.sdp.md:5`; `DECISIONS.md` ends at MD-28 (grep: no rows); `decision-readiness-posture.sdp.md:16` | F3, G1 | Append the two registry rows, or restate both Specs at `defined`. |
| R7 | major | medium | Multi-`When` scenarios invoke the product call once per `When` step — a lawful carrier shape that double-executes a non-idempotent invoke, baked into a frozen interface. Latent: corpus multi-`When` count is **0** (judge-measured). | `src/codegen/contracts.ts:914-915`; `src/testing/index.ts:57-61`; `src/runner/index.ts:100-140` | K1 | Invoke once, or name multi-`When` refused in the freeze. |
| R8 | minor | high | The Gherkin view drops content its own Spec requires be marked lossy: `design` and `ui` sections render nowhere, and canonical kinds render no inline constraints/model/decision. Live today on two Specs. | `gherkin-view.sdp.md:18`; `gherkin-view.ts:269-297`; judge query — `spec:carrier.markdown-pack-authoring` (design), `spec:consumers.design-review` (ui) | F6 | Emit `# LOSSY:` commentary for every populated section the page does not render. |
| R9 | minor | high | Comparator failures print the `at step:` prefix twice; the current test regex tolerates it. | `src/testing/index.ts:77,84`; `src/runner/index.ts:142-150`; `task-8-mutation.log:24-25` | K2, T4 | Let the runner own the single prefix. |
| R10 | minor | high | The oracle is invoked before the incomplete-point refusal, so an adopter oracle can throw first and mask the deterministic diagnostic; the throw then refuses the whole scenario, not just the comparison. | `src/testing/index.ts:37-44`; the in-repo oracle was amended to tolerate partial points | F8, K9, T5 | Compute `missing` before calling `expected`; scope the refusal to oracle comparison. |
| R11 | minor | high | `unspecified` means two opposite things: "never an error" in the runner doctrine, a hard failure in the registrar runtime. | `src/runner/index.ts:157-160`; `src/testing/index.ts:67-69,93-101` | K3 | Qualify the runner comment, or carve the exception in `completeRunnableExample`. |
| R12 | minor | high | The three projection verbs disagree on publishing over an invalid graph: mermaid refuses, census and gherkin publish then exit nonzero. | `mermaid-command.ts:98` vs `census-command.ts:82`, `gherkin-command.ts:89`, `validate-view-command.ts:49,70` | K4 | One posture for all projection verbs, or name the divergence in the Specs. |
| R13 | minor | medium | Registrar placement silently takes the lexicographically first anchored suite while the freeze says a second registration path "is refused". | `src/codegen/contracts.ts:1093-1102`; `runnable-modules.sdp.md:19` | F7, K5 | Emit a finding naming unselected suites, or restate the sentence as deterministic attribution. |
| R14 | minor | high | Verification debt on the new surface: no observed-vs-oracle mismatch test, no oracle-not-called proof, no compile probe for the exhaustive mapped type, no exact-bound Mermaid acceptance, no registrar-cleanup publication test. | `test/testing.test.ts` (4 tests, none on leg 3); `test/codegen.test.ts:128`; `test/mermaid-render.test.ts:150-221` (limit+1 only) | T6, T7, T8, T5(part), T2(part) | Add the five named permanent tests. |
| R15 | minor | high | Agent on-ramps and generate/check scripts lag the three new CLI verbs; because build invalidates their roots, a green `check:self-hosting` leaves three projections absent. | `AGENTS.md:107`; grep of `docs/agent-surface/` + skills returns nothing; `package.json` scripts; `build-command.ts:99-109` | G2, G3 | Update the surface sentence and skills; add per-verb `--check-clean` steps. |
| R16 | minor | high | The checkout-v1 walkthrough describes the pre-registrar shape it headlines. | `examples/checkout-v1/README.md:73-74` vs the migrated authored test | K8, G4 | Name the registrar, the authored→generated import direction, and the new redness paths. |
| R17 | minor | high | The branch adds three rows to the drift alarm (now 11) without recording it, while the arc's keystone freeze has **zero** incoming edges and empty delivery facts. | judge query: drift 11 incl. census-page/mermaid-view/gherkin-view; `spec:extraction.runnable-modules` facts `[]`, edges in `[]` | F4, G5 | Anchor the registrar emitter to the freeze; bind a census `specTest`; mature or record the sub-`ready` posture. |
| R18 | nit | high | An evidence file misstates why generated siblings never self-run. | `task-8-self-hosting-rationale.md:34` vs `vitest.config.ts:30` (include-only, no exclude) | F9 | Correct the recorded reason; behavior is right. |
| R19 | nit | medium | "Committed generated code" is an architectural novelty carried only by a behavior-Spec rule and a `.gitignore` comment. | `runnable-modules.sdp.md:19`; `.gitignore:20`; registry silent | F10 | Fold into the runnable-modules ratification story with R4's gate, or record as deliberately not a decision. |
| R20 | nit | low | Record hygiene: plan 31's durable record is status-only, plan 29 carries a stale "A remains the open owner" sentence, `docs/concept/06` still lists Mermaid as a nameless candidate. | `plans/31-*` (10 lines); `plans/29-*:17-18`; `docs/concept/06` §1 | G6, G7, G8 | One-screen fixes; optional. |

### Dropped or downgraded

| Source | Disposition | Reason |
| --- | --- | --- |
| G11 (live graph reports schema `0.4.0`) | dropped | Stale `dist`/artifact only. After `npm run build`, judge query returns `schemaVersion 0.5.0`. Not a defect. |
| G9, G10 (terminology, AGENTS status header) | dropped | Both were "no finding" rows; judge re-checked and agrees. |
| Kimi's note on the projection's `encodeURIComponent` path fallback | dropped | Injective by construction; no defect claimed, no test gap worth a row. |
| F4's "grew from 8 to 11" framing | kept as R17, reframed | Count reproduces (11). The alarm is informative, never a gate, and spec-plus-implementation in one session is normal practice — the row is about the *unrecorded* posture and the unbound freeze, not about the count being wrong. |
| T2 "weakens the all-or-nothing claim" | merged into R5 | Same missing reconciliation; not a separate fix. |
| F5 "sprays into the authored tree" | merged into R5 | Same missing owned-root/cleanup fix. Judge measured 69 sibling files (reviewers reported 14 and ~30 at different points; the count tracks bound examples and which roots were built, so the discrepancy is not a contradiction). |

### Corroboration notes

Findings raised independently by two or more reviewers and confirmed by the judge — R2/R3 (three
reports), R4/R5 (three), R6 (two), R9 (two), R10 (three), R13 (two), R15 (one, fully reproduced),
R16 (two) — carry the highest confidence. R7 is single-source but structurally verified and worth
its severity because the interface is frozen. R8 was single-source and *strengthened* by the judge:
the reviewer argued it as a latent rule violation, and a live query found two Specs whose authored
content is dropped today.

### What is genuinely good (carried forward)

The comparator is honest by construction — `actual === oracle` alone is structurally absent, and the
Spec's authored Then params sit in the comparison path, proven by the mutation log's path-level
`$.total` diff. Refusal lists live in the decision Specs' bodies rather than only in the plan.
Projections are disciplined pure functions with wholesale temporary-rename publication, honest
absence on failure, and a `--check-clean` that byte-compares the published root — stronger than the
pre-existing Design Review twin-render check and worth back-porting. Per-diagram Mermaid refusal
locality is the right grain. Claim-taxonomy integrity is measurable and intact: zero `inferred`
claims, `specTest` still the sole `has-verifier` source, the delivery-fact ladder untouched. Scope
discipline held completely — brief E untouched, MD-28 unopened, every plan-31 Must-NOT held.

## 4. Written artifacts

- `plans/32-universal-spec-review-followup-briefs.md` — the fixes brief (planning input, not
  execution authority): provenance, the two adjudications, ten fix themes, the do-not-reopen list,
  and the hygiene pass.
- `.omo/evidence/pr-review-universal-spec/pr-description.md` — the PR description.
- `.omo/evidence/pr-review-universal-spec/JUDGE-synthesis.md` — this file.

No tracked file was modified; no commit was made.
