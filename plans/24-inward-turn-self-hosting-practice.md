# Plan 24 — The inward turn: self-hosting as the standing practice

> **Status:** EXECUTED — revision 3. Phase 7 is the inward turn: the Protocol's own forward
> work is carried as Specs, sessions open from graph recipes, implementation bindings are
> audited rather than assumed, expected-outcome oracles bind inward, and one real engine slice
> runs the complete spec-first loop through post-implementation slimming. Settled phase-6
> ground is recoverable at commit `b6f123c` and on PR #15; the reverted origin working-copy
> changes survive only on `libar-ai/convex-event-sourcing#181`. This plan never touches that
> origin checkout.

## Revision-3 execution ruling

The owner explicitly requested execution of revision 3 on 2026-07-28. Before changing the
backlog recipe, the session rebuilt the CLI and re-ran the canonical graph recipes:

- raw backlog: 64 = 51 examples + 13 non-example laws; all 64 have verifier evidence;
- drift alarm: 8; every row states `defined`, reaches the `ready` floor, and has a direct
  implementation binding;
- corpus before edits: 121 Specs · 1 Pack · 91 anchors → 213 nodes · 416 edges, zero findings.

### The example realization posture (MD-24)

The proposal passes the three-part test on the fresh measurement and owner statement:

1. **Hard to reverse:** deriving implementation through refinement would change the meaning and
   claim of a delivery fact across every extractor, consumer, and adopter query.
2. **Surprising without context:** the literal `ready ∧ ¬implemented` set contains 51 executable
   example points even though their suites are bound and their parents own the implementation.
3. **Real trade-off:** direct anchor-derived facts preserve the epistemic boundary but make the
   unqualified raw query operationally misleading; parent propagation would make the convenient
   query smaller by asserting inferred realization no source bound.

**Ruling:** ready examples normally carry verification evidence rather than backlog work.
`implemented` remains direct and anchor-derived, never inherited through refinement. Recipe 1 is
the canonical operational backlog: `ready ∧ kind≠example ∧ ¬implemented`; it also reports the
excluded ready-example count and any excluded example lacking verifier evidence. A rare example
that genuinely owns a distinct realization may still carry its own direct code anchor.

### Oracle choices

`spec:validation.duplicate-ids` is eligible under the current behavior-only oracle law, but its
one bound point fixes one literal finding and one literal absence. An oracle there would be a
constant repetition of the bound test, so revision 3 records that vacuity refusal.
`spec:consumers.reader` instead has three existing witness points with three distinct result
variants; it is the non-vacuous first inward oracle.

S1 bound `oracle:protocol.reader-entry-map` over those three points. Mutating the concept branch
from `sections.behavior.rules` to `sections.intent.outcome` reddened the exact oracle assertion;
restoration returned the focused suite green.

The phase's engine slice was selected during revision-3 planning, not at execution theater:
`spec:validation.oracle-target-eligibility`. Eleven of the thirteen non-example backlog laws are
rule Specs, most owning example spaces, while the shared fail-closed predicate admits behavior
targets only. S2 reruns the lower-ladder and backlog recipes to confirm that no newer prerequisite
outranks the slice; it does not pretend to choose an already planted winner.

S2 opened from the regenerated graph at 126 Specs · 1 Pack · 112 anchors → 239 nodes · 452
edges, zero findings. The lower ladder held 43 entries; the named slice stated `scoped`, reached
that floor with no failures, and had `defined` as its next rung. Recipe 1 returned no operational
backlog, while the drift recipe returned the same eight freshly argued rows. No new prerequisite
or higher-severity evidence displaced the planning-time selection.

## Charter and sequence

### S0 — standing intent and working-surface semantics

- Ratify MD-24 and update recipe 1, the glossary payoff query, skills, tests, and adopter-facing
  guidance without changing the graph schema or reader API.
- Author the runtime-observation overlay under the deliberate `observation` domain, the impact
  graph, Markdown Pack authoring, and oracle-target eligibility at the rungs their structures
  earn. Pack syntax remains unruled and unimplemented.
- Keep `spec:consumers.intent-composition` at `idea` and
  `spec:model.enrichment-lifecycle` at `scoped`.
- Retire the inline-carrier deferral on its measured 1/57 population as evidence closure, not an
  ADR. Restate the `bindExample`/`specTest` graph boundary on `spec:model.anchors`.
- Ignore `.vscode/` as user-local state. Preserve and run the existing recipe-name enumeration
  pin rather than duplicating it.

### S1 — deliberate bindings and first inward oracle

- Audit the 13 non-example backlog laws. Each receives exactly one recorded disposition:
  `bind`, `refuse`, or `known-real backlog`. Existing function names are candidates, never
  permission for a ceremonial anchor. In particular, bind determinism only if a concrete seam
  owns the guarantee; otherwise refuse it as whole-pipeline truth.
- Re-measure and re-argue every one of the eight drift refusals against the current graph and
  verifier evidence. No refusal is inherited and no promotion is batched.
- Bind `oracle:protocol.reader-entry-map` to all three generated reader points, assert three
  distinct expected variants, and mutation-probe its expected function.

### S2 — kind-neutral oracle eligibility

- Mature `spec:validation.oracle-target-eligibility` with an implementing Design section and two
  example children: rule-space accepted and missing-space refused.
- Change the shared resolution predicate from behavior-kind eligibility to Spec-plus-example-space
  eligibility; preserve every other fail-closed refusal and update diagnostics and reader coverage.
- Bind a self-referential rule-kind oracle over the two points and mutation-probe both predicate
  and expected-outcome seams.
- After green implementation, remove only Design detail whose implementation-time purpose is over.
  Keep durable behavior and trade-offs, and record the before/after commits as one datum without
  promoting the enrichment-lifecycle Spec.

The implementing Design was committed independently at `019d063`: it named the shared predicate,
resolution flow, diagnostic language, and validator/reader seams before any engine code changed.
The owner's explicit implementation request is the fresh human readiness statement; after the
blocking question was answered by that Design, the rule's complete evidence and resolving
relations passed the floor and Design Review before promotion. The two generated child contracts
bind the rule-with-space acceptance and missing-space refusal points directly.

Both mutation probes reddened as intended before restoration:

- restoring `target.specKind === "behavior"` in `isResolvingOracleModel` failed the focused
  validator regression, reader regression, and bound rule-space example;
- reversing the expected `findingCount` branch failed the self-referential oracle assertion across
  both generated points.

## Disposition ledgers

The backlog ledger is filled from current evidence during S1. Zero remaining rows is likely, not
a target.

| Spec | Candidate seam | Disposition and current evidence |
|---|---|---|
| `spec:carrier.sdp-import` | `runImport` | **bind** — the entrypoint owns scan/refusal/planning/publication orchestration |
| `spec:consumers.binding-language-views` | binding renderers | **bind ×3** — the Spec explicitly names the Spec page, Pack table, and index table |
| `spec:consumers.derived-readiness-banner` | readiness renderer | **bind** — `renderReadiness` owns the paired rungs and one-direction banner |
| `spec:consumers.wholesale-view-rewrite` | view/build rewrite boundary | **bind ×2** — `runBuild` owns up-front invalidation and `runView` owns atomic replacement |
| `spec:extraction.determinism` | concrete clean-state seam | **bind** — `runBuild --check-clean` independently repeats and byte-compares graph/contracts; not a whole-pipeline token |
| `spec:validation.authored-honesty` | authoring-shape and delivery-fact checks | **bind ×2** — each named check owns one half of the authored/derived refusal |
| `spec:validation.claim-separation` | claim-separation check | **bind** — one check owns the typed claim/descriptor/edge contract |
| `spec:validation.diagnostic-rendering` | CLI and projection renderers | **bind ×2** — the two named renderers own the command and table forms |
| `spec:validation.kind-evidence` | kind-evidence table | **bind** — the exported table is the ruled code-level row set |
| `spec:validation.pack-coherence` | Pack-coherence check | **bind** — one check owns membership and modelRef coherence |
| `spec:validation.referential-integrity` | referential-integrity check | **bind** — one check owns edge endpoints, modelRefs, and nearest-ID suggestions |
| `spec:validation.verification-linkage` | verifier and oracle linkage checks | **bind ×2** — the Spec explicitly names both resolution checks |
| `spec:validation.warn-level-signals` | orphan and gap checks | **bind ×2** — each named check owns one informative signal |

| Drift Spec | Fresh disposition |
|---|---|
| `spec:carrier.markdown-authoring` | **stay `defined`** — fresh graph: seven refining carrier laws, one implementation binding, zero resolving verifiers; the umbrella promise has no direct executable witness |
| `spec:consumers.projections-model` | **stay `defined`** — fresh graph: five refining consumer Specs, one projection binding, zero resolving verifiers; vocabulary umbrella rather than one executable guarantee |
| `spec:extraction.claim-taxonomy` | **stay `defined`** — fresh graph: model vocabulary, one enum binding, zero resolving verifiers; the floor passes but no direct witness justifies the human `ready` statement |
| `spec:extraction.regenerability` | **stay `defined`** — fresh graph: one `runBuild` binding, zero resolving verifiers; the determinism test targets its constraint parent, not this rule |
| `spec:model.core-model` | **stay `defined`** — fresh graph: eight refining Specs, two primitive/descriptor bindings, zero resolving verifiers; root vocabulary remains deliberately conservative |
| `spec:model.pack-aggregate` | **stay `defined`** — fresh graph: two refining Specs, one Pack binding, zero resolving verifiers; no direct aggregate witness targets the model Spec |
| `spec:model.relations` | **stay `defined`** — fresh graph: relation vocabulary, one builder binding, zero resolving verifiers; structural completeness alone does not supply the human statement |
| `spec:model.spec-sections` | **stay `defined`** — fresh graph: four refining Specs, two section/verifier bindings, zero resolving verifiers; the umbrella has no direct executable witness |

## Inward friction ledger

Every affected Spec records all four surfaces; “none observed” is an explicit result. A skill
changes only when the same friction recurs twice.

| Spec | Anchor / binding | Ladder / readiness | Executable contract | CLI / recipe |
|---|---|---|---|---|
| `spec:decisions.example-realization-posture` | none observed | raw-query trade-off required explicit ruling | none observed | recipe 1 needed example accounting |
| `spec:observation.runtime-overlay` | none observed | blocking producer boundary keeps `idea` honest | none observed | none observed |
| `spec:consumers.impact-graph` | none observed | language-neutral identity question keeps `idea` honest | none observed | none observed |
| `spec:carrier.markdown-pack-authoring` | none observed | unresolved syntax keeps `idea` honest | none observed | none observed |
| `spec:validation.oracle-target-eligibility` | one shared-predicate anchor; none observed | Design resolved the blocker; fresh statement plus floor/Review earned `ready` | two generated points bound; post-close clean-room verification exposed omitted suite registration | lower ladder confirmed the preselected slice; no competing evidence |
| `spec:carrier.sdp-import` | concrete entrypoint; no friction | already ready | existing point; no friction | backlog recipe led directly to the missing binding |
| `spec:consumers.binding-language-views` | three honest sites required | already ready | existing points; no friction | guarantee recipe named all renderers |
| `spec:consumers.derived-readiness-banner` | one honest site | already ready | existing points; no friction | none observed |
| `spec:consumers.wholesale-view-rewrite` | split build/view ownership | already ready | existing points; no friction | none observed |
| `spec:extraction.determinism` | audit distinguished a real check-clean seam from diffuse pipeline truth | already ready | direct test anchor already resolves | none observed |
| `spec:validation.authored-honesty` | two named check sites | already ready | existing points; no friction | none observed |
| `spec:validation.claim-separation` | one named check site | already ready | existing points; no friction | none observed |
| `spec:validation.diagnostic-rendering` | two renderer sites | already ready | existing points; no friction | none observed |
| `spec:validation.kind-evidence` | one table site | already ready | existing points; no friction | none observed |
| `spec:validation.pack-coherence` | one check site | already ready | existing point; no friction | none observed |
| `spec:validation.referential-integrity` | one check site | already ready | existing points; no friction | none observed |
| `spec:validation.verification-linkage` | two named resolution sites | already ready | existing points; no friction | none observed |
| `spec:validation.warn-level-signals` | two informative-check sites | already ready | existing points; no friction | none observed |
| `spec:consumers.reader` | oracle binding resolved directly | already ready | three partial points required explicit defaults | graph context supplied all three witness IDs |

## Verification and close

Every checkpoint re-derives corpus and delivery-fact counts and runs relevant targeted suites.
Every committed phase boundary receives the complete thirteen-leg `npm run check`, independently
confirmed from a clean worktree. Mutation probes must redden for the named law and be restored
before a tracked gate.

Close requires: every backlog and drift row deliberate; two inward `models` edges; one genuine
spec-first engine slice slimmed after implementation; the friction ledger complete; zero findings;
no readiness sweep; and plan/AGENTS status synchronized.

The owner authorized deletion of the superseded phase-6 execution plan after this plan landed.
Before deletion, replace live pointers with carrying Specs, commit evidence, and PR references;
verify no live link depends on the file. Historical evidence remains in git and origin PR #181.

Execution expands PR #15. At close its title becomes
`feat: make self-hosting the standing delivery practice (phases 6–7)` and its body names both the
phase-6 usage layer and phase-7 inward evidence. No origin-repo work occurs.

## Close record

The inward phase closed on 2026-07-28 with:

- 128 Specs · 1 Pack · 116 anchors → 245 nodes · 462 edges, zero findings;
- stated readiness `ready: 86 / defined: 37 / scoped: 1 / idea: 4`;
- delivery facts `implemented: 41 / has-verifier: 87 / observed: 0`;
- recipe 1 returning zero operational backlog rows, with 53 excluded ready examples and none
  lacking a verifier;
- the same eight freshly argued drift rows, each at `defined` with floor `ready`;
- exactly two inward `models` edges:
  `oracle:protocol.reader-entry-map → spec:consumers.reader` and
  `oracle:protocol.oracle-target-eligibility → spec:validation.oracle-target-eligibility`;
- no friction category repeated within the inward phase at close, so neither agent skill received a
  speculative revision before the clean-room follow-up described below.

The genuine enrichment datum is the sequence `019d063` (implementing Design),
`341ead6` (implementation and executable seams), and `7ae8087` (post-green slimming).
The final Spec retains the observable eligibility, refusal, uniqueness, and shared-consumer laws;
only symbol placement, implementation sequencing, and test-placement scaffolding left. One datum
does not establish a general enrichment lifecycle, so `spec:model.enrichment-lifecycle` remains
`scoped`.

The owner explicitly authorized deletion of the superseded phase-6 plan after this plan landed.
Before deletion, live references were replaced by carrying Specs, commits `b6f123c` through
`7ae8087`, PR #15, and origin PR `libar-ai/convex-event-sourcing#181`; a repository-wide search
found no remaining live dependency on that file. Its evidence remains recoverable from git.

The phase-close thirteen-leg gate passed over the committed checkpoints. A separate clean-worktree
run is recorded after the close commit. Vitest 2→4 followed as a separate mechanical commit:
`f8a50bb`; it changed no Specs or graph semantics and left derived graph output unchanged.

Post-close clean-install CI then exposed that the four new oracle suites imported generated
contracts without appearing in the shared contract-dependent suite registry. Commit `191cf49`
registered those suites, and `fe42233` completed the matching clean-room lint allowance. This was
the second occurrence of that binding-friction class across the Protocol and origin adoption, so
the friction-ledger trigger earned a non-speculative revision to the authoring skill: registering a
generated-contract consumer is now an explicit part of binding. The exact `npm ci && npm run check`
path passed after both fixes.

The review follow-up also made `.agents/skills/` the repository-owned and packaged canonical skill
location. Claude resolves the same files through the relative `.claude/skills → ../.agents/skills`
symlink, so supporting both agent conventions creates no second skill copy and depends on no
user-level installation. The temporal sweep accepts that tracked in-repository directory symlink,
continues to scan the canonical tracked files, and fails closed when a symlink escapes the
repository.
