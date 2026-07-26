# 10 - Self-hosting phase-4 pre-close adversarial review

**Reviewed:** the full `main...feature/protocol-self-application-phase-4` diff at `5f0a00f`
(8 commits, 36 files, +6328 / −3738), against `plans/21-self-hosting-phase-4.md` — its §1
engineering rulings (10–14, plus 1–9 carried from plan 20) and its §5 acceptance criteria are this
review's yardstick.

**Method:** mutation testing, not code reading — the phase-3 precedent, with an independently
designed mutation set. A full sandbox copy of the working tree was built outside the repository
(`/private/tmp/.../scratchpad/sandbox`), its engine broken one law at a time, and the ten new bound
points re-run after each. **Twenty-two mutations** were run in total: eighteen against the ten
points (M1–M18) and eight against the oracle split (O1–O8, run separately). None replays a mutation
plan 21 §7 recorded; every one was designed against the source, not the ledger. A point counts as
honest only if it goes **red** when the law it names is removed — and only if the *other* nine stay
green under the same mutation (the P-1 discrimination lesson, ruling 12). Every claim marked
**CONFIRMED** was reproduced by a probe against the built product. The real checkout was never
mutated; `git status` was clean at start.

**Disposition:** the disposition column at the foot is terminal — every finding carries fixed /
declined-with-reason / carried-with-reason, landed on this branch before the phase PR.
(`reviews/` is Prettier-ignored and temporal-guard-exempt.)

---

## Verdict

**SOUND TO CLOSE. NO BLOCKER. ONE MAJOR, FIXED ON THE BRANCH.**

**All ten new bound points are provably mutation-sensitive to the law they name**, and the
discrimination is near-perfect: of the eighteen mutations aimed at the points, seventeen killed
**exactly one** point and the eighteenth killed exactly two — the two whose Spec text names the same
floor clause. No point is a params echo; every Then step reads real engine output through a public
seam. The oracle split holds: a corrupted family module reddens exactly that family's `it()`, a
deleted oracle entry is caught by the length cross-checks rather than certifying itself, and the
count literals move independently of the authored arrays. Every headline number in the plan —
specs, anchors, nodes, edges, the histogram, the 37-row sweep, the assertion reconciliation —
recomputes exactly. The `05` deletion-blocking verdict survives an independent grep.

The one **major** is not a verifier defect and not a phase-4 invention: it is the **indirect `then`
key**, a defect review-06 raised, plan 17 recorded as *fixed*, and plan 18 re-verified as *intact* —
which had in fact silently regressed hours after the fix and has now been propagated to 66 sites,
43 of them authored on this branch. Two recorded verifications across two plans are therefore false.
The sandbox proves the whole twelve-leg gate green with every occurrence normalized, so the fix is
mechanical; it is landed here, and the falsified records are corrected.

Acceptance criterion 5 grades **PASS with `05` staying** — the criterion asks for an audit-grounded
disposition, not a deletion, and the two blocking rows (gaps 13/14) are real: an independent sweep
finds them named nowhere but in `05` itself.

---

## Dimension 1 — The mutation matrix (verifier honesty)

### The ten points

| Point | Suite | Killing mutation(s) | Survived a should-kill? |
|---|---|---|---|
| `readiness-floor.unrelated-scoped-spec` | validators | M1 | no |
| `readiness-floor.blocking-open-question` | validators | M2 | no |
| `kind-evidence.constraints-alone` | validators | M3 | no |
| `kind-evidence.untargeted-constraint` | validators | M4 | no |
| `kind-evidence.empty-promoted-child` | validators | M5 | no |
| `derived-readiness-banner.dishonest-divergence` | projections | M2, M7 | no |
| `derived-readiness-banner.honest-headroom` | projections | M6 | no |
| `binding-language-views.bound-spec-page` | projections | M8, M14, M17 | no |
| `wholesale-view-rewrite.stale-page-removed` | projections | M9c, M9d | **partly — see P-1** |
| `diagnostic-rendering.composed-location` | projections | M10, M11, M12, M13 | no |

### The mutations, and what each killed

| # | Mutation | Killed |
|---|---|---|
| M1 | `hasAtLeastOneRelation` → always true | `unrelated-scoped-spec` only |
| M2 | `hasNoBlockingOpenQuestions` → ignores the `blocking` flag | `blocking-open-question` **and** `dishonest-divergence` |
| M3 | behavior-family `defined` cell accepts constraints alone | `constraints-alone` only |
| M4 | `constraintTargetsAreMachineReadable` → target requirement dropped | `untargeted-constraint` only |
| M5 | `hasPromotedRuleOrExampleEvidence` → child's own evidence no longer required (MD-16 bound deleted) | `empty-promoted-child` only |
| M6 | `renderReadiness`: `derivedRank < statedRank` → `!==` (banner fires both ways) | `honest-headroom` only |
| M7 | `renderReadiness`: the first-unmet-clause suffix suppressed | `dishonest-divergence` only |
| M8 | bindings block renders `- implemented:` as the label | `bound-spec-page` only |
| M9a | `runView` writes in place — temp sibling and swap deleted | **nothing** |
| M9b | `runBuild`'s up-front view invalidation deleted | **nothing** |
| M9c | both no-stale-page sites deleted | `stale-page-removed` only |
| M9d | `runView` copies instead of renaming, leaving the temp sibling | `stale-page-removed` only |
| M10 | `formatFinding`: the ` — ` separator changed to `: ` | `composed-location` only |
| M11 | `formatFinding`: an absent location renders a `<unknown>` placeholder | `composed-location` only |
| M12 | `formatFinding`: the line dropped from the composed location | `composed-location` only |
| M13 | `formatFinding`: the location rendered twice | `composed-location` only |
| M14 | the `Runtime observation` line dropped from the bindings block | `bound-spec-page` only |
| M15 | index-table binding **column headers** renamed | nothing (the point reads cell values, not headers — correct) |
| M16 | pack member table binding cells → `yes`/`no` | **nothing** — see P-2 |
| M17 | index-row binding cells → `yes`/`no` | `bound-spec-page` only |
| M18 | (= M16, re-run isolated) | **nothing** — see P-2 |

**What this rules out.** No Then step is satisfiable by the world factory alone. Three assertions
that *looked* like they might be tautologies were probed specifically and are not:
`composed-location`'s "the composed prefix is the only place the path appears"
(`indexOf === lastIndexOf`) dies under M13; `honest-headroom`'s `bannerRaised: false` is an absence
assertion but is paired with a positive statement of the rendered rung pair and dies under M6; and
`bound-spec-page`'s `factNameRendered: false` dies under M8, i.e. it is the renderer's vocabulary
being read, not the probe's.

**M2's double kill is correct, not leakage.** `dishonest-divergence`'s world builds its divergence
out of a blocking open question, so the clause `no-blocking-open-questions` is genuinely the law
both points stand on; the banner point additionally dies alone under M7, which is the half only it
names.

### P-1 (MINOR) — the wholesale-rewrite point cannot see either site alone

**CONFIRMED** by M9a / M9b / M9c / M9d.

The no-stale-page law is realized twice — `runBuild` removes any existing view up front, `runView`
writes to `generated/design-review.tmp` and renames it into place — and the point survives the
deletion of *either* one (M9a, M9b) and dies only when both go (M9c). Plan 21 §7 discloses this
honestly and the Spec states both sites, so this is **not** the P-1 shape of review-09: there the
second gate realized a *different* law (vocabulary resolution) and the point had no teeth on the law
it named; here both gates realize the *same* law, and the point does die when the law is removed.

The residue worth recording precisely is narrower than the §7 row says, and I measured it:

- `stale-page-removed` **does** discriminate the swap mechanism in one direction — M9d (rename
  replaced by a copy, temp left behind) kills it through the `temporarySurvives: false` step.
- It does **not** discriminate the swap mechanism's *absence*: `temporarySurvives: false` is
  satisfied both when the temp ran and was cleaned up and when no temp exists at all (M9a). An
  absence assertion that goes vacuous exactly when its mechanism is deleted has no teeth on
  deletion — ruling 12's own lesson, applied to a step the ledger did not call out.
- Three of the Spec's seven rule lines have **no** verifier at all: the "no half-written view is
  ever readable" reading of the one-rename clause, the failed-run removal, and the `--check-clean`
  double render with its refusal.

Nothing here is false; the §7 row is simply less precise than the measurement supports.

### P-2 (MINOR) — the binding-language point covers the index table, not the pack member table

**CONFIRMED** by M16/M17/M18. `spec:consumers.binding-language-views` rule 5 states that *"the pack
member table and the index table carry the same two binding columns, with the same present and none
values."* The point's probe graph holds no Pack, so only the index half is exercised: changing the
index row's cells to `yes`/`no` kills the point (M17); making the identical change to the pack
member table's cells does not (M16/M18). Plan §7's row is honest — it says *"the index row repeating
them"* — but the Spec's rule is broader than the point, and the residue was not stated.

---

## Dimension 2 — Records honesty (recomputed from scratch)

Every number below was recomputed against `generated/graph.json`, the spec files on disk, and git —
never read back from a ledger.

| Claim | Recorded | Measured | Verdict |
|---|---|---|---|
| corpus counts | 103 specs · 1 pack · 75 anchors | 103 `Primitive` · 1 `Pack` · 45 `Anchor` + 30 `CodeNode` = 75 | ✓ |
| graph size | 179 nodes · 351 edges | 179 · 351 | ✓ |
| histogram | `ready: 66 / defined: 37` | `{ ready: 66, defined: 37 }` | ✓ |
| spec files on disk | 103 | 103 `.sdp.md` (+ the one `.sdp.ts` Pack carrier) | ✓ |
| every `ready` Spec carries `has-verifier` | asserted | 66/66, zero exceptions | ✓ |
| §8's uniform refusal reason ("*not one* of the 37 carries `has-verifier`") | asserted | 37/37 carry none | ✓ |
| §8's "each page reads structural floor reached: `ready`" | asserted | 37/37 pages, zero exceptions | ✓ |
| §8 sweep completeness | 37 dispositioned | 16 individual rows + the 21-decision row = 37; **zero `defined` Specs missing from the table**; zero promotions | ✓ |
| new bound points | 10 | validators 12→17, projections 0→5 | ✓ |
| total bound points | (implied 39) | 3+1+8+4+1+17+5 = 39 across 7 root suites | ✓ |
| S1 assertion reconciliation | 27 `expect` sites → 32 | `test/self-hosting-graph.test.ts` 27 → 32 | ✓ |
| no assertion deleted anywhere under `test/` | asserted | 1313 → 1342 `expect(` sites; per-file deltas are +5 oracle, +20 projections, +4 validators, **zero negative** | ✓ |
| oracle `it()` count | 21 | 21 executed | ✓ |
| the pre-split oracle | one `describe`/one `it()` at 3593–3886, 3,888 lines, `expectedSpecs` 87, `expectedAnchors` 65 | exact on `main` | ✓ |
| schema version | `0.4.0` | `0.4.0` | ✓ |

**The orchestrator's brief cites an S1 reconciliation of "283→294".** No metric on this branch
takes those values: the recorded and measured reconciliation is **27 → 32** expect sites in the
oracle suite (1313 → 1342 across all of `test/`). `294` is the phase-3 **edge** count, which plan 21
§2 uses as the S1 invariant; the brief appears to conflate the two. Recorded here so the conflation
does not propagate.

**The §5a audit tables.** Ten `carried` rows were re-judged against the regenerated Design Review
pages rather than the raw spec files, including all six rows S4 re-graded from `gap`:

| Row | Carrier page checked | Verdict |
|---|---|---|
| `05` §2 check 7 — honest readiness | `validation.readiness-floor.md` — four rungs in authored words, cumulative evaluation stated | carried ✓ |
| `05` §3 kind-blind clause table | same page, clause for clause against `readinessFloors` | carried ✓ |
| `05` §3 per-kind evidence table | `validation.kind-evidence.md` — all seven rows, the shared behavior family, the contract interim | carried ✓ |
| `05` §3 stated-vs-derived blockquote (**re-graded**) | `consumers.derived-readiness-banner.md` — one direction, first unmet clause, below-`idea` case | carried ✓ |
| `05` §5 validator self-testing (**re-graded**) | `validation.validator-self-testing.md` — both directions, stated `defined`, floor reached `ready` | carried ✓ |
| `05` §3 approval / baseline | `consumers.projections-model.md` term row, verbatim match | carried ✓ |
| `05` §2 L3 partial failure | `carrier.markdown-parser.md` — "excludes one malformed carrier while continuing healthy siblings" | carried ✓ |
| `05` §2 check 3 endpoint kinds | `model.relations.md` vocabulary rows | carried ✓ |
| `06` §5 wholesale rewrite (**re-graded**) | `consumers.wholesale-view-rewrite.md` — all five clauses present | carried ✓ |
| `07` §6 ① / ④ (**re-graded**) | `validation.diagnostic-rendering.md`, `consumers.binding-language-views.md` | carried ✓ |

### A-1 (MINOR) — one `carried` row still rests a clause on a code surface

**Where:** `plans/21-self-hosting-phase-4.md` §5a, the `05` §2 checks 5–6 row. **CONFIRMED.**

The row grades `carried` and cites *"`spec:validation.authored-honesty` + `section-authored-fact`
and `unearned-stated-fact` · `src/validate/validators.ts` `checkGaps` (reads the recomputed facts,
pinned by the two points)."* The Spec carries check 6's main clause — *"any stated delivery facts
must equal the graph's recomputed facts"* — but the doc's coupling sentence, *"The gap check (9)
reads the recomputed facts, so a faked fact never silences it,"* is stated by **no Spec**. It is
true of the code (`checkGaps` reads its `derivedFacts` argument, never `node.deliveryFacts`), and
`spec:validation.warn-level-signals` — whose realizing entrypoint *is* `checkGaps` — does not say it.

That is review-09's D-2 shape: a deletion-authorizing `carried` verdict discharging an
intended-truth clause onto `src/`. `05` stays, so no deletion rests on it and the exposure is
bounded — but the phase-3 remediation closed exactly this class by enrichment rather than by
argument, and the same fix is one line here.

### R-1 (MINOR) — §(b) undercounts the phase-3 bound suites

Plan §(b) opens *"29 bound points across five bound suites."* The point count is exact; the suite
count is **six** — on `main`, `bindExample` appears in `self-hosting-carrier` (3),
`self-hosting-duplicate-ids` (1), `self-hosting-extraction` (8), `self-hosting-model` (4),
`self-hosting-sdp-import` (1) and `self-hosting-validators` (12) — which is also exactly the six
paths the pre-branch root row of the contract dependency table listed. The projections suite is
therefore the **seventh**, as §3 correctly says elsewhere in the same plan. **CONFIRMED.**

### R-2 (MINOR) — §2 S1's description of the pre-split roster

§2 S1 describes *"a redundant 151-item node-id roster."* The roster on `main` was an **88-item**
literal (the pack id plus the 87 spec ids) whose anchor half was **already** derived by
`...expectedAnchors.map(...)`. The redundancy ruling 10 removed was therefore 87 duplicated spec
ids, not 151 items, and the total the roster compared against was 153. **CONFIRMED.**

---

## Dimension 3 — Spec quality (read word-for-word against the mirrors)

All twelve new/enriched Specs were read against `src/validate/readiness-floor.ts`,
`renderReadiness` / `renderBindings` / `renderFindings` in
`src/projections/design-review-context.ts`, the index and member tables in
`src/projections/design-review-pages.ts`, `runView` / `runBuild`, and `formatFinding`.

**What held — ruling 13 was respected.** No invented third behaviour was found in eleven of the
twelve. Specifically probed and confirmed true of the engine:

- The floor Spec's rung arithmetic is exact: five `idea` clauses, three `scoped`, two `defined`,
  three `ready`, cumulative, kind-blind except the two evidence clauses — matching `readinessFloors`
  entry for entry and `05` §3's table row for row.
- The evidence Spec's seven rows match `kindEvidence` cell for cell, including the shared
  `behavior`/`workflow`/`contract` family, the MD-16 promoted-evidence bound (a promoted child must
  clear *its own kind's* `scoped` cell; a `constrainedBy` edge must resolve to a `constraint` Spec
  carrying its constraints), and the contract row's named deferral.
- The banner Spec's *"the index and the pack member table carry the same pair as two columns"* is
  true: both tables render `| Stated | Floor reached |` (`design-review-pages.ts:68` and `:125`).
- The binding-language Spec's *"four labelled lines"* and *"Runtime observation always reads not
  tracked"* are exact, and M14 proves the fourth line is bound.
- The wholesale-rewrite Spec's *"findings never withhold the view"* is true: `runValidate` returns
  the graph with a non-zero exit code, so `runView` writes the current view and returns 1.
- The diagnostic Spec's *"a finding's location … never baked into its message text"* survives a
  probe: over every finding the example corpus produces, no message contains its own `file` value,
  and no validator message template interpolates a file path (the two near-misses interpolate a
  *section* path and a set of *output* paths, neither of which is the finding's location).
- Vocabulary is clean against `CONTEXT.md`: the *derived readiness* row (*"the highest rung whose
  floor clauses pass … rendered beside the stated rung, never overwriting the author's
  statement"*) is what the banner Spec states, near-verbatim. No residual pre-ratification term
  appears in any of the twelve.
- Temporal-guard hygiene: an independent sweep of every branch-added file under `specs/` and
  `test/`, using a **wider** token set than the guard's own pattern (adding bare `S1`-style
  handles, `phase N`, and month names), returns **zero** hits.

### S-1 (MINOR, declined) — one deliberate code behaviour the floor Spec does not state

`dependsOnAndRefinesTargetsAreDefined` deliberately **skips** an unresolved target
(`src/validate/readiness-floor.ts:274-288`, with a comment saying so), so an unresolved `refines`
target is attributed to `all-relations-resolve` alone rather than failing two clauses. The Spec
states the clause without that attribution rule. Read literally the Spec is *stricter* than the
code — but the observable outcome is identical (the Spec fails `ready` either way) and the banner
names the *first* unmet clause, which is `all-relations-resolve` in both readings. Nothing false is
stated; only a clause-attribution nuance is unstated.

### S-2 (MINOR, carried) — a second report shape lives in the file the diagnostic Spec names

`spec:validation.diagnostic-rendering` states *"no surface introduces a parallel report shape of its
own"* and names `src/cli/output.ts` as a realizing entrypoint. That file declares and exports
`RenderedFinding`, a second finding shape — used by nothing in `src/`, `test/`, or `examples/`
except `formatFinding`'s own union parameter, and not re-exported from the barrel. It is dead
internal surface rather than a live parallel path, so the Spec's claim is not falsified in
substance; but the one file the Spec points a reader at is the one file that declares a second
shape.

---

## Dimension 4 — The standing curiosities

### T-1 (MAJOR) — the indirect `then` key: a fixed defect that silently regressed, and two records that say otherwise

**CONFIRMED** by git archaeology, an exhaustive guard search, and a full-gate sandbox probe.

**What it is.** The frozen GWT result key is assembled indirectly rather than written — 66 sites:
`src/extract/markdown-body-owner-behavior.ts:21` (`const resultKey = ["t", "hen"].join("")`),
`test/markdown-reifier.test.ts:502`, `test/extract.test.ts:705`, and 63 occurrences of
`[["t", "hen"].join("")]:` across the six oracle transcription modules. (A fourth spelling,
`["t" + "hen", …]`, sits in `test/import-emit-markdown.test.ts`.)

**The history — this is the finding.** review-06 raised it: *"the `then` graph key is built as
`["t","hen"].join("")` in three production files with no explanatory comment — no configured lint or
guard requires it; it reads as guard evasion and hides the frozen `given/when/then` key set from
grep."* It was then:

1. **Fixed** — `cd735ae` *"refactor(extract): name the then key directly"* replaced both product
   sites with a plain `then:` key.
2. **Recorded as fixed** — `plans/17-self-hosting-v1.md:456`: *"Indirect assembly of the `then`
   graph key | fixed-by-remediation | `cd735ae` names the key directly."*
3. **Silently regressed nine hours later** — `fcd5cef` *"fix(extract): land the grammar-hardening
   cluster (review-06)"*, part of the *same* remediation cluster, reintroduced it as
   `const resultKey = ["t", "hen"].join("")` and routed both call sites back through it.
4. **Re-verified as intact against the regressed file** — `plans/18-self-hosting-phase-2.md:338`:
   *"Indirect assembly of the `then` graph key (review-06) | Verify remediation remains intact |
   verified — phase-1 remediation names the `then` key directly."* That sentence was false when
   written.
5. **Propagated by this phase** — S1 moved 43 of the occurrences into the new
   `test/self-hosting-oracle/` modules and S2/S3 authored fresh ones for the new Specs, so the
   branch is the largest single contributor to the site count.

**Does anything require it?** No. Exhaustively checked: no ESLint rule or plugin (the config has no
custom plugins and no rule that could see an object key), no `npm run check` leg, none of
`check-temporal.mjs` / `check-carrier-truth.mjs` / `check-carrier-rule.mjs` /
`check-prose-schema.mjs` / `check-self-hosting-gates.mjs` (none contains the token at all), and
nothing scans `test/` for GWT-shaped object literals — the extractor reifies only `.sdp.ts` and
`.sdp.md` carriers, so a test-file object literal is invisible to it. The product itself is already
inconsistent: `src/extract/reify.ts:618` and `src/extract/serialize.ts:64` write `"then"` plainly.

**Probe.** In the sandbox, all 66 occurrences were normalized (`[["t","hen"].join("")]:` → `then:`,
`const resultKey = ["t","hen"].join("")` → `const resultKey = "then"`) and the **full twelve-leg
`npm run check` ran green end to end** — 103 specs · 1 pack · 75 anchors → 179 nodes · 351 edges,
0 errors / 0 warnings, 589 tests, clean preflight. All four unwired audit scripts also pass both
ways. The only cost is one Prettier re-wrap in `test/self-hosting-oracle/extraction.ts`, because
the shorter key lets a literal fit on one line.

**Recommendation: normalize.** Keep-with-comment would institutionalize an evasion channel nobody
can name a reason for; leave-with-reason is unavailable because there is no reason. Normalizing also
makes the frozen `given/when/then` key set greppable again — the concrete harm review-06 named — and
makes plan 17's and plan 18's records true rather than aspirational.

### C-1 (informational) — the two-site wholesale rewrite is stated honestly

`spec:consumers.wholesale-view-rewrite` states both realizing sites explicitly — *"The invalidation
happens before rendering as well as after it: the build the run passes through removes any existing
view up front"* and *"The realizing entrypoint is `runView` … with the up-front invalidation in
`runBuild`."* Verified against `src/cli/build-command.ts:76-80` and
`src/cli/validate-view-command.ts:86-95`. The Spec does not overclaim; the verifier residue is
P-1's, not the Spec's.

### C-2 (informational) — gaps 13/14 survive an independent check

An independent repository-wide sweep for any surface carrying either deferral —
`per-team severity`, `severity override`, `overridable floor`, `floor config`, `team-overridable`,
`configurable floor`, `per-team threshold`, over every tracked `.md` / `.ts` / `.mjs` outside
`generated/` — returns hits in **exactly two places**: `docs/concept/05` itself (lines 61 and 73,
the two parentheticals) and `plans/21` (the audit rows recording them). No Spec, no registry, no
code+test surface, no surviving doc names either deferral; `00` §4 and `07` §2/§3 do not list them.
**The `05`-stays verdict is correct and the deletion is properly blocked.**

---

## Dimension 5 — The oracle split and the shared constant

### The split (O1–O8, run against `test/self-hosting-graph.test.ts`'s 21 `it()`s)

| # | Corruption | Reddened |
|---|---|---|
| O1 | one descriptor wrong in `oracle/model.ts` | **exactly one** — *carries the authored descriptors of the model family* |
| O2 | one spec id misspelled in `oracle/consumers.ts` | the consumers family, the roster, and *leaves no authored Spec outside the families* — the identity assertions, by design |
| O3 | one spec **entry deleted** from `oracle/model.ts` | the totals cross-check, the roster, the model family, and the no-escape law |
| O4 | the frozen `specs: 103` literal bumped | *holds the frozen corpus totals* only |
| O5 | the histogram literal bumped | *holds the frozen stated-readiness distribution* only |
| O6 | one anchor label wrong in `oracle/anchors.ts` | *projects every anchor and code node at the line its declaration occupies* only |
| O7 | one anchor **entry deleted** from `oracle/anchors.ts` | the totals cross-check plus the three anchor/roster laws |
| O8 | one declared relation deleted | *derives exactly the authored declared relations* only |

**Ruling 10 holds under fire.** Family isolation is real (O1, O6, O8 each redden exactly one `it()`,
so the first failure no longer masks the rest). The oracle cannot certify itself: deleting an entry
from a family module (O3, O7) is caught by `expect(expectedSpecs).toHaveLength(103)` and
`expect(expectedAnchors).toHaveLength(75)` measured against the same frozen literals the graph is
measured against — the "cross-check" ruling 10 required is load-bearing, not decorative. The
histogram stayed an explicit literal (O5) and the count literals move independently of the arrays
(O4).

### The shared constant (ruling 11) — the negative control reproduced

Plan §3's watch-item claim was re-run from scratch in the sandbox, not taken on trust:

- **With** the `test/self-hosting-projections.test.ts` row and `generated/contracts` moved aside:
  `eslint .` **passes**.
- **Without** the row, same clean room: `eslint .` fails with **exactly five
  `@typescript-eslint/no-unsafe-argument` errors**, one per `bindExample` call in the projections
  suite (lines 190, 199, 345, 430, 516) — the recorded number, exactly.
- **With** the row and the tree missing, the wrapper refuses fast:
  *"Generated contracts required by the selected test suite are missing. Run `npm run build && npm
  run generate:self-hosting` first."*
- **Without** the row, the wrapper stops refusing and spawns vitest straight into the missing tree.

Both surfaces are load-bearing on both sides. **CONFIRMED.**

---

## Acceptance criteria (§5)

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| 1 | Oracle split, zero assertion loss | **PASS** | 21 `it()`s over one hoisted extraction; ten authored transcription modules; 27 → 32 expect sites with zero deletions anywhere under `test/`; family isolation and the length cross-checks proved by O1–O8; docket row dispositioned at S1. |
| 2 | One source of truth for contract-dependent suites | **PASS** | Both consumers import `contract-dependent-suites.mjs`; the seventh suite entered through one edit; clean-room lint green with the row, five errors without it (reproduced). |
| 3 | Executable-path facts, not claims | **PASS** | 66/66 `ready` Specs carry `has-verifier`; 0 errors; `--check-clean` clean on both trees; **all ten new points mutation-probed red for the law they name**, with the discrimination measured rather than asserted. |
| 4 | Honest readiness | **PASS** | 0 warnings — no `honesty/gaps` finding exists; closing distribution `ready: 66 / defined: 37` matches disk; the 37 refusals are complete and each names a reason. |
| 5 | The `05` disposition is audit-grounded | **PASS** | `05` **stays** on two precisely recorded rows; independently verified that neither deferral is named anywhere else (C-2); `06`/`07` re-graded with honest ledgers; ruling 14's sweep correctly did not run. One row's citation needed correction (A-1). |
| 6 | The gate holds throughout | **PASS** | Full twelve-leg chain green at the close commit, plus the clean-clone proof. |
| 7 | Records continue | **PASS** | This review is archived with every finding terminal; ledgers, watch items and docket rows dispositioned at the close. |

---

## Disposition table

| # | Severity | Finding | Disposition |
|---|---|---|---|
| T-1 | **major** | The indirect `then` key: fixed by `cd735ae`, silently regressed by `fcd5cef`, recorded as fixed in plan 17 and re-verified as intact in plan 18 (false when written), now at 66 sites of which 43 were authored on this branch. No lint rule, gate leg, audit script, or scanner requires it; the full check is green with it normalized. | **FIXED** — every occurrence normalized to a plain `then` key across the one product file and seven test/oracle files; the sandbox result reproduced on the branch under the full twelve-leg gate and the clean clone. Plan 21 §6 records that the two prior verifications were false and that this close makes them true. |
| A-1 | minor | The `05` §2 checks 5–6 audit row grades `carried` while resting *"the gap check reads the recomputed facts"* on `src/validate/validators.ts` — the review-09 D-2 shape under a deletion-authorizing verdict. | **FIXED BY ENRICHMENT** — `spec:validation.warn-level-signals` gains the clause in authored words (ratified: it is `05` §2 check 6's own sentence), the oracle transcription follows, and the §5a row's citation is corrected to name the Spec first. |
| P-1 | minor | `stale-page-removed` survives the deletion of either realizing site alone; `temporarySurvives: false` goes vacuous exactly when the swap mechanism is deleted; three of the Spec's rule lines have no verifier. | **RECORD SHARPENED** — plan 21 §7's row now states the measured mutation classes (which single-site deletions survive, which kill) and names the three unverified clauses, instead of the looser sentence. No verifier invented; the law is genuinely two-site by design. |
| P-2 | minor | `bound-spec-page` exercises the index table but not the pack member table, though the Spec's rule names both. | **RECORD SHARPENED** — plan 21 §7's row now names the pack-member half as the residue, with the mutation that proves it (M16/M18 survive, M17 kills). |
| S-1 | minor | The floor Spec does not state the deliberate clause attribution for an unresolved `refines`/`dependsOn` target. | **DECLINED WITH REASON** — the Spec states nothing false; the observable outcome and the banner's named clause are identical under both readings, so adding the nuance would state a mechanism rather than a law. Recorded here rather than authored into the corpus. |
| S-2 | minor | `RenderedFinding` is a second declared report shape inside `src/cli/output.ts`, the file the diagnostic Spec names as an entrypoint. | **CARRIED WITH REASON** — dead internal surface with no producer and no barrel export, so no parallel path exists in substance; deleting an internal type is engine hygiene outside a review-and-close session's charter. Carried on the docket. |
| R-1 | minor | §(b) says phase 3 closed at "five bound suites"; six carried bound points. | **FIXED** — §(b) reads six, consistent with §3's "seventh suite". |
| R-2 | minor | §2 S1 describes "a redundant 151-item node-id roster"; the literal roster held 88 ids with the anchor half already derived. | **FIXED** — §2 S1 restated to the measured shape. |
| C-1 | info | The two-site wholesale rewrite is stated honestly by the Spec. | **NO ACTION** — verified, recorded. |
| C-2 | info | Gaps 13/14 confirmed by an independent sweep; the `05`-stays verdict survives. | **NO ACTION** — verified, recorded. |

---

## Remediation addendum — what landed on this branch

The remediation ran before the phase PR, so none of these findings survives into `main` as an open
docket. The per-finding work sits in three commits plus the close:

- **Fixed in product/corpus:** T-1 (`refactor(extract,tests): name the frozen then key directly` —
  the one product site inlined, 65 test/oracle sites normalized, Prettier re-wrap taken) and A-1
  (`docs(specs,tests): carry the gap signal's recomputed-facts reading` —
  `spec:validation.warn-level-signals` enriched, the oracle transcription following).
- **Records repaired, no product change:** R-1, R-2, and A-1's audit-row citation, in the close
  commit.
- **Records sharpened from the measurement:** P-1 and P-2 — plan 21 §7's two rows now state which
  mutation classes each point kills and which it does not, and which clauses stand unverified.
- **Declined with a reason:** S-1. **Carried with a reason:** S-2, on the §4 docket.

Two things are worth reading before touching these surfaces again. First, **T-1's value is the
history, not the diff**: a defect can be fixed, regressed inside the same remediation cluster, and
then re-verified as intact by a later phase reading a plan rather than the file. The cheap guard
against a repeat is to re-measure a docket row's condition at the moment it is verified, not to
trust the row that closed it. Second, **A-1 was closed by enrichment rather than by argument**, the
same way phase 3 closed D-2 and D-3: the `carried` verdict is now true on the dissolution
decision's own terms — carried by a Spec — rather than defensible only on a plan ruling that
widened the criterion to admit code surfaces.

### Post-review remediation (added after the owner's review of this branch)

The owner's review of the branch accepted the close and ordered a further wave of fixes before the
PR. It ran as S6 on the same branch. **The findings above are not rewritten** — what follows updates
their dispositions:

- **P-1 → FIXED (was RECORD SHARPENED).** The two realizing sites are now separately discriminated,
  by moving the *world* rather than the engine. The Spec's example space gained *when* the stale page
  is planted and *which command* runs, and three sibling points landed:
  `wholesale-view-rewrite.late-stale-page` (planted after the build has already invalidated the view,
  so only the temp-and-rename swap can evict it), `.failed-run-view-removed` (the same late plant over
  a carrier the extractor refuses, so only `runView`'s failed-run removal can take the view down), and
  `.build-invalidates-view` (`runBuild` alone, which renders no view, so only the up-front
  invalidation can). Re-measured one site at a time: **M9a — deleting the temp-and-rename path alone —
  now reddens exactly `late-stale-page`; M9b — deleting the up-front invalidation alone — now reddens
  exactly `build-invalidates-view`;** deleting `runView`'s failed-run removal alone reddens exactly
  `failed-run-view-removed`; M9c still reddens three. Two of the three rule lines this review named as
  unverified are now bound. **The `--check-clean` double render stays unbound with a stated reason:**
  divergence is not honestly inducible, because the renderer is deterministic by
  `spec:extraction.determinism` — the only world producing two diverging renders is one where the
  world itself supplies a lying renderer, which asserts nothing about the engine. Faking it through the
  declared render hook was refused rather than counted. The "no half-written view is ever readable"
  reading also stays unbound: observing it needs a concurrent reader mid-write.
- **P-2 → FIXED (was RECORD SHARPENED).** `binding-language-views.pack-member-table` builds a probe
  Pack holding the bound subject beside the unbound parent and reads the member table's cells for both.
  Re-measured: **M16/M18 — the `yes`/`no` shorthand on the pack member table — now redden exactly this
  point** and leave `bound-spec-page` green, while M17 on the index row still reddens exactly
  `bound-spec-page`.
- **S-2 → FIXED (was CARRIED WITH REASON).** `RenderedFinding` is deleted and `formatFinding` narrows
  to `Finding`. The no-producer verdict was re-measured over the whole tree, the barrel, and the CLI's
  JSON paths rather than inherited from the docket row. Plan 21 §4's row closes DONE.

Landed in the same wave, outside this review's findings: a bound Design Review twin for
`spec:validation.diagnostic-rendering` through `renderFindings` (the second entrypoint the Spec names,
covering the em-dash cell and the table-escaped message pipe); a one-line comment beside the product
site stating the plain-`then`-key constraint T-1 restored; errata beside the two false historical rows
in plans 17, 18, and 18a; an `AGENTS.md` bullet requiring a "verified" row to be re-measured rather
than inherited — T-1's own lesson, made standing discipline; and the correction of `07` §6 ④'s
three-line quote of the rendered binding language to the four lines the view renders.

Branch tip after the wave: **108 Specs · 1 Pack · 80 anchors → 189 nodes · 371 edges ·
`ready: 71 / defined: 37`**, 0 errors / 0 warnings, full twelve-leg gate green.

## What the owner is asked to ratify at the PR

Three things this review deliberately leaves to the owner rather than deciding by plan ruling:

1. **`05` stays.** Two designed-for deferrals — a per-team severity override and a team-overridable
   floor config — block its deletion. Both are cheap to carry next phase; the deletion-cost
   inventory is already written (§5a).
2. **The `then`-key normalization touches product code.** One line in
   `src/extract/markdown-body-owner-behavior.ts` plus 65 test/oracle sites. It is byte-neutral at
   runtime and gate-proven, but it reverses a shape that has survived three phases.
3. **`spec:validation.validator-self-testing` ships at `defined` with no verifier** and is
   nevertheless graded `carried` by the `05` audit. That reading — the dissolution criterion asks
   that a law be *carried by a Spec*, not that the Spec be `ready` — is correct on the decision's
   own terms and is the first time the corpus leans on it.
