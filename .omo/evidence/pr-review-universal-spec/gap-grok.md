# Gap & conformance review — `feature/universal-spec` vs plan-29 briefs A–E

Reviewer: GAP & CONFORMANCE (read-only).
Merge-base: `4ccc2e9b3845a288f5426e2d6dc52d05e2ea416b` (`main`).
Diff: 89 files, +5467/−156.
Sources: `plans/29-universal-carrier-annotations-and-agent-surface-briefs.md`, `.omo/plans/arc-keystone-engines.md`, `plans/31-carrier-universality-runnable-modules-projections-structural-anchors.md`, tree + `sdp:q`.

---

## 1. Gap register

### Brief A — carrier universality ruling

| Clause (plan 29) | Asked | Landed | Gap |
|---|---|---|---|
| A1 Kind coverage, honestly | Per-kind disposition vs kind-evidence table; refuse where dishonest | **Landed.** `spec:decisions.carrier-universality` (ready / derived ready): Gherkin lawful only for `behavior` (Feature) and `example` (Scenario); six kinds stay Markdown with per-kind lie-reasons. Recorded on `spec:carrier.gherkin-authoring` rules 3, 12–13. Enforced: `src/extract/gherkin-kind-honesty.ts` + `@kind.*` refusal in `src/extract/gherkin.ts:390–398`. | None. Refusal is the lawful outcome. |
| A2 Rich content | Decide whether bounded Markdown/doc-strings become lawful; land only on existing MD-19 prose owners | **Landed as a bound, not an expansion.** Description prose lawful only as free prose on MD-19 owners (narrative / keyed description). DocStrings and DataTables remain refused (`carrier-universality` decision; `gherkin-authoring` rule 5). | None vs the ruling. Brief C's "rich-content ceiling" stays at already-owned description prose — no new Gherkin body syntax. |
| A3 Meaning of "universal" | One default carrier vs per-ID + generated Gherkin-shaped projection | **Landed: second reading.** Universal = per-ID carriers + generated Gherkin-shaped READ projection. `specs/consumers/gherkin-view.sdp.md` + `src/projections/gherkin-view.ts` + `sdp gherkin` → `generated/gherkin/`. Never `.sdp.gherkin` in authored trees; no round-trip claim. | None. |
| A4 Default question | Flip only if coverage lands; amend MD-18/MD-27 with plan-18 discipline | **Declined.** Markdown stays default. MD-18/MD-27 consequence sections point at the new Spec; no operative-record flip. Discovery still `.sdp.ts` / `.sdp.md` / `.sdp.gherkin` (`src/extract/discover.ts:5`). | None — declined branch, recorded. |
| A5 Packs, explicitly | In or out, named | **Out.** Packs stay under MD-25. Named in decision consequence and `gherkin-authoring` rule 12. | None. |
| A6 Boundaries | One surface per ID; no authored delivery status / lifecycle / value-transfer; execution behind generated contracts | **Held.** Decision consequence + carrier Spec refuse those constructs. `has-verifier` still from resolving `specTest` only. | None. |
| A7 Drift inventory | Do not re-open plan-30 cleanup; do not reintroduce "Gherkin declined" | **Held.** Suffix/discovery unchanged. MD-18/MD-27 updated only with forward pointers. | None. |
| A8 ADR | Pass three-part test or end without a ruling | **Passed.** Rationale names hard-to-reverse / surprising / trade-off. Graph: `statedReadiness=ready`, `derivedReadiness=ready`. | Registry gap — see G1. |

**A verdict:** Commissioned work complete. Visible "shrink" vs owner dissatisfaction is the *honest* ruling: six kinds stay Markdown; default does not flip; "universal" is a read projection.

### Brief B — derived runnable modules (O3)

| Clause | Asked | Landed | Gap |
|---|---|---|---|
| B1 Codegen emits registrar | Contract import, test registration, step-key mapping, param dispatch, oracle `expected()` compare, failure rendering | **Landed.** `src/codegen/contracts.ts` `renderRunnableRegistrar`; runtime in `src/testing/index.ts`; export `./testing` in `package.json`. Frozen law: `specs/extraction/runnable-modules.sdp.md`. | Spec is `defined`, **not implemented**, no `has-verifier` (see G5). |
| B2 Authored code shrinks to semantics | World, invoke, observe, oracle | **Landed on the named tracer.** `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts`: `specTest` + `createWorld` / `invoke` / `observe` / `assertions` + one `registerValidCart(...)`. Zero authored step-skeleton keys. | 30 other runnable families **DEFER** (`task-8-self-hosting-rationale.md`). Lawful tracer cut. |
| B3 Mutation evidence | Spec `{total}` change reds; oracle `expected()` change reds; revert green | **Landed.** `.omo/evidence/arc-keystone-engines/task-8-mutation.log`: Spec 100→101 red (`expected 101, actual 100`); oracle +1 red (`expected 100, actual 101`); revert exit 0. | None. |
| B4 Actual-outcome contract explicit | Silently deriving domain observation forbidden | **Landed.** Freeze requires authored `observe(world): Outcome`. Valid-cart `observe` is authored. | None. |
| B5 Claim taxonomy | `specTest` remains sole `has-verifier` source | **Held.** Delivery-fact ladder unchanged (`src/graph/delivery-facts.ts`: `satisfies` / resolving `verifies` only). Registrar confers no fact. | None. |
| B6 Generation-time refusals reused | Unbindable / incompatible vocabulary / colliding path; no O5; no Outlines | **Held.** Outlines still refused (`src/extract/gherkin.ts:935–941, 1032–1038`). No engine-side adopter load. | None. |
| B7 Frozen interface (a)–(g) | Registrar, skeleton-text identity, three-way comparator, `Partial<Conditions>`, `renderContractStep`, exhaustive mapped type, Outlines refused | **Landed in the freeze Spec.** Handler-resolution nuance recorded: authored surface has no per-step keys; tsc names the *adapter*, generated dispatch names the *step*. | Honest amendment of the plan's "tsc error naming the step" wording — not a missing deliverable. |

**B verdict:** Tracer + freeze + mutation log complete. Remaining work is adoption of the registrar on deferred families (not this plan).

### Brief C — new projections beside Design Review

| Clause | Asked | Landed | Gap |
|---|---|---|---|
| C1 Decide next projection(s) | Candidates: Mermaid, reference, context-bundle, census/taxonomy, Spec Studio | **Chose census + bounded Mermaid.** Reference, context-bundle, Spec Studio not built (`src/` has no `renderReference` / Spec Studio). | Declined candidates — lawful; name them in Upcoming work. |
| C2 Do not re-specify Design Review | Inherit determinism / "projections confer nothing" | **Held.** `src/projections/design-review.ts` untouched except schema-version prose in `docs/concept/06`. `sdp view` still owns `generated/design-review/`. | None. |
| C3 Census sole owner | Derived taxonomy from runtime constants; zero-count rows visible | **Landed.** `specs/consumers/census-page.sdp.md` + `src/projections/census.ts` + `sdp census` → `generated/census/`. Golden: `test/fixtures/checkout-v1/expected-census/index.md` shows `supersedes: 0`, `memberOf: 0`, `uses: 0`, `observed: 0`. | Stated `defined` / implemented / **no `has-verifier`** (G5). |
| C4 CLI/publication posture | Separate verb or atomic root; do not bolt onto Design Review transaction | **Landed as three verbs.** `sdp census` / `sdp mermaid` / `sdp gherkin`. Build invalidates all four projection roots (`src/cli/build-command.ts:81–86`). `generate:self-hosting` / `check:self-hosting` still run **only** `sdp view`. | Publication exists; CI/generate scripts do not emit or `--check-clean` the new roots (G3). |
| C5 Graph-only first slice lawful before A | — | Census does not depend on rich Gherkin content. Gherkin *view* is A's B3 follow-through, sibling not child of census. | None. |
| C6 Mermaid (plan todo 7) | Per-Spec one-hop and/or per-Pack; never whole-graph; injective tokens; dedicated escaper; refuse overflow | **Landed.** `specs/consumers/mermaid-view.sdp.md` + `src/projections/mermaid.ts`. Bounds 64/128. Pack slice is `belongsTo` only; Spec slice is incident edges. | Mermaid **does not specially name** `memberOf`/`uses` (todo 7: bonus, not a gate). If those edges exist in a one-hop slice they would render as ordinary edges; Pack diagrams omit them. |
| C7 C∩D seam (todo 10) | Census renders structural bindings; empty-section honesty; cycles as data | **Landed.** Census "Structural bindings" section; checkout golden: "No structural bindings exist." Tests render SCC groups and dangling findings via `reader.findings()`. | Self-hosting corpus authors **zero** structural edges (honest empty). |

**C verdict:** Chosen pair delivered. Other taxonomy candidates remain open. Agent-facing docs and generate scripts lag the new verbs.

### Brief D — structural anchor semantics

| Clause | Asked | Landed | Gap |
|---|---|---|---|
| D1 `implements` vs `satisfies` first | Rule it; do not assume a new slot | **Declined `implements`.** Realization stays `satisfies` (decision first sentence; `src/` has no `implements` field). | None. |
| D2 Which fields | Candidates `component` / `uses` | **Both admitted.** `CodeAnchor.component?: ComponentAnchorId`, `uses?: readonly CodeAnchorId[]` (`src/model/anchors.ts:21–27`). | None. |
| D3 Value form | Graph-ID refs, never free strings | **Landed.** Closed ID helpers; static-literal extraction; malformed field excludes the whole anchor. | None. |
| D4 Validators | Target existence, endpoints, uniqueness, self-ref, one-level membership; cycles are data | **Landed.** `src/validate/validators.ts` `conformance/structural-anchors` + claim-separation cases for `memberOf`/`uses` (anchored, CodeNode→CodeNode). | None. |
| D5 Census surfaces them | Always generated | **Landed** via todo 10 (brief C owns the page). | None. |
| D6 Anchor-required lint | Stay warn/optional | **Held.** No promotion in `src/validate`. | None. |
| D7 Refusal list in the Spec | Extend `codeAnchor` only; edges anchored not inferred; no intent/status/facts; closed envelope | **In the Spec body** (consequences). Derive emits `claim: "anchored"` (`src/extract/derive.ts:186–204`). `isTraversableBinding` excludes structural edges (`src/reader/reader.ts:382–387`). Delivery-fact ladder unchanged. | None. |
| D8 Schema bump | Required under BR1 | **Source is `0.5.0`** (`src/graph/schema.ts:6`; `schema-versioning.declared-version` example `{schemaVersion: "0.5.0"}`). | Live `generated/graph.json` in this checkout still reads `0.4.0` (stale untracked artifact; `dist/` gitignored). Source of truth is `src/`. |
| D9 Projection of authored structural bindings | Off the new edges | Census section yes. Mermaid does not specialize them. | Optional Mermaid structural rendering (todo 7 bonus). |

**D verdict:** BR1 complete. Self-hosting corpus does not yet *author* `component`/`uses`, so `sdp:q` `graph.edges.filter(e => e.type==="memberOf"\|\|"uses")` returns `[]` on the Protocol root — vocabulary and fixture emission exist; production instances do not.

### Brief E — agent surface (deliberately deferred)

| Half | Asked | Touched? | Re-entry |
|---|---|---|---|
| E1 Read recipes | git-diff → at-risk via `blastRadius`; census/fan-in recipes consuming C and D | **Untouched.** `docs/agent-surface/recipes.md` still eleven bodies; no census/fan-in recipe; no `specsReverifying` convenience. | **Satisfied.** Census Spec + projection queryable (`g.findByConcept("census")` hits `spec:consumers.census-page`). Structural edge types are in `graphEdgeTypes` and filterable (`sdp:q` returns count 0 on this corpus). |
| E2 Write ergonomics | `sdp new spec`; `sdp validate --watch` | **Untouched.** `src/cli/sdp.ts` command set: `build \| validate \| view \| census \| mermaid \| gherkin \| import \| q`. No `new`. No `--watch` on validate. | Unblocked by this plan only as sequencing, not as a dependency. |
| E3 MCP amendment | May lawfully fail the three-part test | **Untouched.** `spec:decisions.mcp-deferred` still the D6 pointer. No MCP server/surface in `src/cli`. | Concrete-caller bar still unmet. |
| E4 `bySymbol` | Stay absent until impact-graph substrate | **Held.** `spec:consumers.impact-graph` still `idea` with blocking open question (`test/self-hosting-oracle/consumers.ts:1020–1034`). Reader comment: `bySymbol` deliberately absent. | Still blocked on impact-graph identity question. |

**E verdict:** Genuinely untouched. Plan-29 sequencing ("E goes last because it consumes D's edges and C's census") is now true: both exist. Re-entry trigger **SATISFIED** at the query-surface level. A census/fan-in *recipe* on the Protocol corpus will currently print an honest empty structural section.

---

## 2. Upcoming-work item list

Ready to drop into a PR description.

1. **Commission brief E (agent surface)** — read recipes (changeset→at-risk; census/fan-in over C+D), write ergonomics (`sdp new`, `--watch`), MCP amendment attempt that may lawfully fail. *Source: plan 29 brief E; plans/31 re-entry trigger now SATISFIED.*
2. **Register the two new decisions in `docs/concept/DECISIONS.md`** — append-only MD-29 / MD-30 (or next free IDs) with ratified names, glosses, Spec pointers. *Source: registry discipline; both Specs pass the ADR three-part test and are `ready`.*
3. **Update agent-surface docs for new CLI verbs** — `AGENTS.md` still lists `sdp build · validate · view · import · q`; recipes and `.agents/skills/sdp-agent-surface` never mention `census` / `mermaid` / `gherkin`. *Source: landed CLI vs docs; brief E will consume this anyway.*
4. **Wire generate/check scripts to the new projection verbs** (separate steps, not bolted onto `sdp view`) — `generate:self-hosting` / `check:self-hosting` / `generate:example` / `check:example` still only `view`/`build`. *Source: brief C publication posture; `package.json:55–59`.*
5. **Promote or verifier-bind the new behavior Specs** — `census-page` implemented ∧ ¬has-verifier; `mermaid-view` / `gherkin-view` implemented ∧ stated `defined`; `runnable-modules` defined ∧ unimplemented. *Source: graph query; drift-alarm / example-realization posture.*
6. **Adopt registrar on deferred self-hosting families** — 30 DEFER rows; closest cousins already have `expected()` (`consumers.reader`, `validation.oracle-target-eligibility`). *Source: brief B; `task-8-self-hosting-rationale.md`.*
7. **Author Protocol-side `component`/`uses` bindings** if census/fan-in recipes need non-empty structure — vocabulary exists; self-hosting count is 0. *Source: brief D + E census/fan-in half.*
8. **Optional: Mermaid render of `memberOf`/`uses`** — todo 7 bonus, not a gate. *Source: arc-keystone-engines todo 7.*
9. **Declined / closed — do not reopen without a new ruling:** default-carrier flip (A4); Gherkin kind expansion for the six refused kinds (A1); DocStrings/DataTables (A2); Gherkin Packs (A5); `implements` slot (D1); O5 / Scenario Outlines (B6); Design Review re-spec (C2); `bySymbol` / impact-graph (E4); MD-28 suffix (Must-NOT).
10. **Still-open brief C candidates:** reference projection, context-bundle, Spec Studio. *Source: plan 29 brief C candidate list.*
11. **Refresh checkout-v1 README** after valid-cart registrar migration — walkthrough still describes contract-driven assertion / stale handler keys; does not mention the generated sibling or `sdp census|mermaid|gherkin`. *Source: `examples/checkout-v1/README.md` vs migrated test.*
12. **Stale plan-29 sentence:** "Brief A … remains the open owner of kind coverage, rich content, and any default-carrier flip" — those questions are now ruled. *Source: `plans/29` lines 17–18 vs landed decision.*

---

## 3. Must-NOT audit

| # | Must NOT | Held / violated | Evidence |
|---|---|---|---|
| 1 | Brief E entirely (`sdp new`, `--watch`, MCP, `bySymbol`) | **Held** | CLI dispatch has no `new`. No validate `--watch`. No MCP surface. `impact-graph` still `idea`. `bySymbol` still absent (reader + oracle). New verbs are projection publishers, not E's write/MCP/recipe work. |
| 2 | Reopen MD-28 (suffix, dual-recognition, bare `.feature`) or plan-30 drift cleanup | **Held** | `SPEC_FILE_SUFFIXES` still `.sdp.ts` / `.sdp.md` / `.sdp.gherkin`. No bare-`.feature` discovery. Plan 30 badge ✅ EXECUTED; A follow-through does not touch suffix law. |
| 3 | Self-executing prose; `has-verifier` outside generated contracts + anchored handlers | **Held** | Delivery facts still `satisfies` + resolving `verifies` only. Valid-cart keeps `specTest`. Gherkin view is disposable read. |
| 4 | O5 (engine loads/executes adopter code); Scenario Outlines / Examples tables | **Held** | No `vm`/`eval`/dynamic import of adopter tests in `src/`. Outlines refused in `gherkin.ts`. Freeze Spec refuses O5 and Outlines. |
| 5 | `bySymbol` / impact-graph smuggling | **Held** | `spec:consumers.impact-graph` readiness `idea`; blocking identity question intact. |
| 6 | Anchor-required lint → error | **Held** | No new error-level missing-anchor check. Decision consequence: stays warn/optional. |
| 7 | Authored delivery status, lifecycle tags, free-form tags, parallel registry, per-namespace sibling builders | **Held** | Structural fields are closed graph IDs on `codeAnchor` only. No `anchorApi` / `anchorComponent` builders. Gherkin still refuses authored facts/lifecycle. |
| 8 | Re-specify shipped Design Review | **Held** | Design Review renderer/page anatomies not rewritten. `06` change is schema `0.4.0`→`0.5.0` prose only. |
| 9 | Default-carrier flip without A ruling landing it | **Held** | A explicitly refuses the flip. Markdown remains default. |
| 10 | Self-executing / second-source projections | **Held** | Census/Mermaid/Gherkin views are regenerable, confer nothing, own separate roots, invalidated on build. |

No Must-NOT violation found.

---

## 4. Hygiene findings

### G1 — New decisions absent from the lean registry
- **Severity:** high (conformance / lookup)
- **Evidence:** `docs/concept/DECISIONS.md` table ends at MD-28. Grep for `carrier-universality` / `structural-anchor` in that file: no hits. Both Specs exist, `ready`, in the self-hosting Pack, and pass the ADR three-part test.
- **Fix:** Append MD-29 / MD-30 (next free IDs; numbering is append-only) with ratified names, one-line glosses, Spec pointers. Suggested names from the Spec titles: "carrier universality is bounded by honest kind structure"; "structural anchor semantics".

### G2 — AGENTS.md / skills / recipes under-describe the CLI
- **Severity:** medium (agent on-ramp drift)
- **Evidence:** `AGENTS.md:76` and `:107` still say `sdp build · validate · view · import · q`. `docs/agent-surface/recipes.md` has no `census`/`mermaid`/`gherkin` mention. `.agents/skills/sdp-agent-surface` does not list the new verbs. Status header correctly claims plan 31 EXECUTED.
- **Fix:** Update the CLI surface sentence in AGENTS.md and the skill bootstrap; add a one-line "projection verbs" note. Do **not** mint query recipes here unless this is brief E.

### G3 — Generate/check scripts ignore new projections
- **Severity:** medium (publication honesty)
- **Evidence:** `package.json` `generate:self-hosting` / `check:self-hosting` = `sdp view` only; `generate:example` / `check:example` = `build` / `view --check-clean`. Build *invalidates* census/mermaid/gherkin roots, so a green `check:self-hosting` leaves those directories absent.
- **Fix:** Add separate `sdp census|mermaid|gherkin --check-clean` steps (mirrors the "do not bolt onto Design Review" ruling).

### G4 — checkout-v1 README stale after valid-cart migration
- **Severity:** medium (tracer-bullet docs)
- **Evidence:** README still says generated contracts drive the assertion and a stale handler key fails the test (`README.md:66–74`). Authored test now has no skeleton keys; activation is `registerValidCart`. `generated/` blurb lists graph/contracts/Design Review only.
- **Fix:** Describe registrar + generated sibling; optionally mention the extra projection verbs as optional walks.

### G5 — New behavior Specs sit below `ready` / missing verifiers
- **Severity:** low–medium (honesty / drift-adjacent)
- **Evidence (`sdp:q`):**
  - `spec:consumers.census-page` — stated `defined`, derived `ready`, facts `implemented` (no `has-verifier`)
  - `spec:consumers.mermaid-view` — stated `defined`, derived `ready`, `implemented` + `has-verifier`
  - `spec:consumers.gherkin-view` — stated `defined`, derived `ready`, `implemented` + `has-verifier`
  - `spec:extraction.runnable-modules` — stated `defined`, derived `ready`, facts `[]`
- **Fix:** Bind a `specTest` for census and runnable-modules; human `ready` statement after review. Not a plan-31 acceptance miss (todos allowed `defined`).

### G6 — plans/31 record is status-only
- **Severity:** low
- **Evidence:** File is 10 lines: EXECUTED header, one-paragraph scope, pointer to `.omo/plans/arc-keystone-engines.md`. Todo 1 forbade duplicating the todo list; outcomes live in the close line. Declined branches (A4, D1, E) are not enumerated in the durable record.
- **Fix:** Optional one-screen "outcomes / declined / E trigger" table so the plans/ record stands without `.omo/`.

### G7 — plans/29 commissioned-plans line half-stale
- **Severity:** low
- **Evidence:** Lines 15–20 correctly name Plan 31 executed and E deferred. Lines 17–18 still say brief A "remains the open owner of kind coverage, rich content, and any default-carrier flip."
- **Fix:** Past-tense: A ruled those questions under plan 31.

### G8 — `docs/concept/06` taxonomy table still lists Mermaid as a nameless candidate
- **Severity:** low
- **Evidence:** `06` §1 table row "Mermaid projection | live, regenerable" unchanged except schema 0.5.0 prose. Census and Gherkin view are not in the taxonomy table. Concept docs are exposition; carrying Specs exist.
- **Fix:** Point the table at `spec:consumers.census-page` / `mermaid-view` / `gherkin-view` when dissolving, or leave to brief E / concept-dissolve work.

### G9 — Terminology
- **Severity:** none found in new Specs
- **Evidence:** Grep of `specs/decisions/carrier-universality.sdp.md`, `structural-anchor-semantics.sdp.md`, `specs/consumers/census-page.sdp.md`, `mermaid-view.sdp.md`, `gherkin-view.sdp.md`, `specs/extraction/runnable-modules.sdp.md` for `abstraction`, `provenance`, `marker`, `facet`, `two axes`: no hits. Ratified terms used (`claim`, `anchor`, `readiness`, `delivery fact`).

### G10 — AGENTS.md status header vs tree
- **Severity:** none (accurate)
- **Evidence:** Header claims plan 31 EXECUTED, briefs A/B/C/D, E may re-enter now that census + structural edges are queryable. Matches `plans/31` and this review's E trigger check. Plan 30 EXECUTED matches `plans/30` badge.

### G11 — Live generated graph vs source schema
- **Severity:** informational (this checkout)
- **Evidence:** `src/graph/schema.ts` = `0.5.0`; untracked `generated/graph.json` and a stale `dist` (gitignored, `dist/graph/` absent) reported `0.4.0` via `sdp:q`. Not a PR-file defect. Rebuild before treating live `sdp:q` schemaVersion as source.

---

## 5. Evidence completeness

| Artifact | Exists | Plausible contents |
|---|---|---|
| `task-1-hygiene.log` | yes (172 lines) | Plan 30/29/31 greps; AGENTS recovery; validate notes |
| `task-2-a-ruling.log` | yes (146) | Five rulings; ADR; readiness-floor red proof (missing `decision.decision`) |
| `task-3-d-ruling.log` | yes (140) | satisfies-first; refusal-list greps; temporal-token cite fix |
| `task-4-b-design-gate.log` | yes (187) | Freeze tokens; readiness lowered to `defined`; incomplete-draft teeth |
| `task-5-d-impl.log` | yes (224) | BR1 fields/edges/validators; TDD red then 116 tests; schema 0.5.0 |
| `task-6-census.log` | yes (169) | TDD red (`renderCensus` missing); golden/zero-count/`--check-clean` |
| `task-7-mermaid.log` + `task-7-mermaid-independent.log` + `task-7-mermaid-commit.log` + `task-7b-mermaid-refusal-locality.log` | yes | Escaping, bounds, refusal locality |
| `task-8-o3-impl.log` | yes (28) | Registrar green; notes mutation deferred to QA |
| `task-8-mutation.log` | yes (99) | **Red / red / green** with Then-param mismatch diagnostics |
| `task-8-self-hosting-rationale.md` | yes (95) | 31 families; 1 MIGRATE / 30 DEFER; binary and auditable |
| `task-8-independent.log` / `integration.log` / `lint-repair.log` / `rework.log` | yes | Extra impl trail; not required by the named list |
| `task-9-a-followthrough.log` | yes (48) | Validate 0/0; exemplar stable; `@kind.decision` lie-reason; finding-cap via vitest after a failed direct import |
| `task-10-census-seam.log` | yes (391) | Census `--check-clean` identical; `npm run check` exit 0 in lane |
| `F1-compliance.log` | yes (327) | T1–T10 PASS; `npm run check` 0; notes 0 self-hosting structural edges |
| `F2-quality.md` | yes (152) | Adversarial quality read |
| `F3-qa.log` | yes (1177) | Real-surface QA |
| `F4-scope.md` | yes (381) | A–D present; E untouched; trigger PASS; written while plans/31 still EXECUTING (later flipped) |

**Evidence verdict:** Required task-1…10 and F1–F4 files exist and match their todos. Mutation log and self-hosting rationale are the two load-bearing B artifacts and both hold. Extra task-7/8 satellite logs are surplus, not gaps.

---

## 6. Query notes (re-entry trigger)

```
sdp:q structuralEdgeCount → 0
sdp:q edgeTypes → no memberOf/uses in *this* derived snapshot
src/graph/schema.ts derivedEdgeTypes → includes memberOf, uses
sdp:q findByConcept("census") → spec:consumers.census-page, impl:protocol.census-page, …
sdp:q findByConcept("memberOf") → spec:decisions.structural-anchor-semantics, spec:model.anchors
```

Trigger interpretation: **queryable** means the schema, reader, census projection, and `sdp:q` filter surface exist — not that the Protocol corpus authors instances. F1 already recorded fixture-root count > 0. Checkout golden census prints `memberOf: 0` / `uses: 0` and "No structural bindings exist."

`sdp:q` in this checkout used a stale `dist` (`schemaVersion` 0.4.0). Re-run after `npm run build` before quoting live graph schemaVersion. Source tree is 0.5.0.
