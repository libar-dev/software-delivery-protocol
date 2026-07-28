# Plan 24 — The inward turn: self-hosting as the standing practice

> **Status:** EXECUTING — revision 3. Phase 7 is the inward turn: the Protocol's own forward
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

The phase's engine slice was selected during revision-3 planning, not at execution theater:
`spec:validation.oracle-target-eligibility`. Eleven of the thirteen non-example backlog laws are
rule Specs, most owning example spaces, while the shared fail-closed predicate admits behavior
targets only. S2 reruns the lower-ladder and backlog recipes to confirm that no newer prerequisite
outranks the slice; it does not pretend to choose an already planted winner.

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

## Disposition ledgers

The backlog ledger is filled from current evidence during S1. Zero remaining rows is likely, not
a target.

| Spec | Candidate seam | Disposition and current evidence |
|---|---|---|
| `spec:carrier.sdp-import` | `runImport` | pending |
| `spec:consumers.binding-language-views` | binding renderers | pending |
| `spec:consumers.derived-readiness-banner` | readiness renderer | pending |
| `spec:consumers.wholesale-view-rewrite` | view/build rewrite boundary | pending |
| `spec:extraction.determinism` | concrete clean-state seam, if any | pending |
| `spec:validation.authored-honesty` | authoring-shape and delivery-fact checks | pending |
| `spec:validation.claim-separation` | claim-separation check | pending |
| `spec:validation.diagnostic-rendering` | CLI and projection renderers | pending |
| `spec:validation.kind-evidence` | kind-evidence table | pending |
| `spec:validation.pack-coherence` | Pack-coherence check | pending |
| `spec:validation.referential-integrity` | referential-integrity check | pending |
| `spec:validation.verification-linkage` | verifier and oracle linkage checks | pending |
| `spec:validation.warn-level-signals` | orphan and gap checks | pending |

| Drift Spec | Fresh disposition |
|---|---|
| `spec:carrier.markdown-authoring` | pending re-argument |
| `spec:consumers.projections-model` | pending re-argument |
| `spec:extraction.claim-taxonomy` | pending re-argument |
| `spec:extraction.regenerability` | pending re-argument |
| `spec:model.core-model` | pending re-argument |
| `spec:model.pack-aggregate` | pending re-argument |
| `spec:model.relations` | pending re-argument |
| `spec:model.spec-sections` | pending re-argument |

## Inward friction ledger

Every affected Spec records all four surfaces; “none observed” is an explicit result. A skill
changes only when the same friction recurs twice.

| Spec | Anchor / binding | Ladder / readiness | Executable contract | CLI / recipe |
|---|---|---|---|---|
| `spec:decisions.example-realization-posture` | none observed | raw-query trade-off required explicit ruling | none observed | recipe 1 needed example accounting |
| `spec:observation.runtime-overlay` | none observed | blocking producer boundary keeps `idea` honest | none observed | none observed |
| `spec:consumers.impact-graph` | none observed | language-neutral identity question keeps `idea` honest | none observed | none observed |
| `spec:carrier.markdown-pack-authoring` | none observed | unresolved syntax keeps `idea` honest | none observed | none observed |
| `spec:validation.oracle-target-eligibility` | pending S2 | blocking implementation seam supports `scoped` | pending S2 | graph exposed rule-kind demand directly |

## Verification and close

Every checkpoint re-derives corpus and delivery-fact counts and runs relevant targeted suites.
Every committed phase boundary receives the complete thirteen-leg `npm run check`, independently
confirmed from a clean worktree. Mutation probes must redden for the named law and be restored
before a tracked gate.

Close requires: every backlog and drift row deliberate; two inward `models` edges; one genuine
spec-first engine slice slimmed after implementation; the friction ledger complete; zero findings;
no readiness sweep; and plan/AGENTS status synchronized.

The owner authorized deletion of the superseded plan-23 file after plan 24 lands. Before deletion,
replace this plan's and AGENTS' live plan-23 pointers with carrying Specs, commit evidence, and PR
references; verify no live link depends on the file. Historical evidence remains in git and origin
PR #181.

Execution expands PR #15. At close its title becomes
`feat: make self-hosting the standing delivery practice (phases 6–7)` and its body names both the
phase-6 usage layer and phase-7 inward evidence. No origin-repo work occurs.

After the phase closes, Vitest 2→4 runs as a separate mechanical commit. The session inspects the
actual v4 configuration and help before replacing the removed single-fork option, changes no
Specs or graph semantics, re-measures advisories, and stops if derived graph output moves.
