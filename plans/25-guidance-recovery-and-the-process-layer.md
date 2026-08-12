# Plan 25 — Guidance recovery and the process layer

> **Status:** ✅ EXECUTED 2026-07-29 — Workstreams A and B landed as one graph-first batch. The
> seven audit partials are re-homed or explicitly dispositioned; the packaged `sdp-sessions`
> on-ramp is owned by `spec:consumers.delivery-session-on-ramp`; the three-part test kept
> slimming as advisory practice rather than a Decision Spec; and the complete repository gate is
> the re-measurement surface named in the close record. **What this plan does:** closes the two guidance debts
> the 2026-07-29 audits surfaced — (A) re-homes the seven PARTIAL items from the dissolution
> value-transfer audit (`reviews/13`: zero lost laws, seven pieces of orphaned authoring guidance
> and rationale), and (B) rebuilds the **process layer** gen 1 had and this repo deliberately
> dissolved along with its enforcement machinery: a sessions on-ramp that routes delivery work
> shapes (capture · design · implement · review · close) through graph recipes — **guidance
> without gates**. Everything here is advisory by law: checks police conformance and honesty,
> never content-quality and never workflow (the two-check families; adopt the nouns, reject the
> gates, MD-2). No new validators, no new graph verbs, no FSM.

## Why now — the evidence

Two reviews in one session converged on the same shape of debt:

1. **The dissolution audit** (`reviews/13`) confirmed the dissolution wave lost no laws — but
   seven pieces of *authoring guidance and rationale* now live only in git history. Three of them
   (P1, P2, P5) are rules an authoring agent would actually need mid-session, and their absence
   is invisible until someone models a straddling fact, hesitates over a child's readiness, or
   proposes the Pack check the design already rejected.
2. **The gen-1 comparison** (this session's analysis of `@libar-dev/architect`'s formal spec and
   `architect-sessions` skill) found the pattern behind the remaining gap: gen 1 encoded its
   delivery process in *enforcement* machinery (FSM, ProcessGuard, scope gates) because its
   authored facts could lie. This design made facts underivable-from-lies, which dissolved the
   enforcement layer — but the **guidance half** of that layer (work-shape routing, session
   pre-flights, promotion habits, handoff discipline) dissolved with it and was never rebuilt.
   Before this plan, the practice lived in plan 24's prose and eleven recipes an agent had to
   already know to run; the reading and authoring skills carried no session routing.

The corpus itself was healthy; recipe and validation queries, rather than quoted counts, remain
the source for its current state. The debt was entirely in the guidance layer above it.

## Workstream A — re-home the dissolution partials

Small, surgical, execution-ready. Each item lands in its carrying Spec's prose (narrative or
rationale — content the typing law leaves open), or in a skill body; none changes a validator,
an enum, or a floor clause. Authored through the graph per the standing practice.

| Item | What lands | Where |
| --- | --- | --- |
| **A1** (P1) | The one-kind rule's second half: a fact that straddles kinds is modeled as **two Specs joined by a relation**, never one Spec with a blurred kind | `spec:model.core-model` narrative + a line in the `sdp-authoring` skill |
| **A2** (P2) | The affirmative permission: a child Spec may be **born at a higher readiness than its parent** (descriptor independence, P8); only the floor's target bound constrains it | `spec:validation.readiness-floor` narrative |
| **A3** (P5) | The named negative ruling: there is **no duplicated-intent check on Packs** — a Pack states no truth, so there is nothing to duplicate; semantic duplication is human/agent judgment. Keep the motivation: large coherent groups of low-detail Specs must not make the build demand implementation | `spec:validation.pack-coherence`; `spec:model.pack-aggregate` remains the truth-free premise |
| **A4** (P3 + P6) | One rationale line each: why `constrainedBy`/`decidedBy` stay distinct from generic `dependsOn` (separately-queryable intents a generic edge would flatten); and MD-1's gloss refinement (gen-1's disease was dual-source binding invisible to the type system — executability returns as a *recovered surface*) | `spec:model.relations` rationale; `spec:decisions.executable-meta-model` rationale |
| **A5** (P4 + P7) | P4's graph-diff-as-two-projections behavior is findable on `spec:consumers.impact-graph` without promoting that Spec past `idea`. P7 is resolved by softening the current concept claim so it asserts editorial selection without an unevidenced magnitude; the historical figure remains audit provenance. | the impact-graph Spec; `docs/concept/06` |

Done-signal for A: each re-homed line is grep-findable in its carrier; `npm run check` stays
green; corpus stays at zero findings; `reviews/13` items marked dispositioned in this plan's
done-record.

## Workstream B — the process layer (sessions on-ramp)

The larger piece, and design-first: **B1 is a design session before it is an execution session.**

- **B1 — the `sdp-sessions` skill.** A repository-owned skill (beside `sdp-agent-surface` and
  `sdp-authoring`, canonical home `.agents/skills/`), owned by the ready story behavior
  `spec:consumers.delivery-session-on-ramp`, that routes the delivery work shapes:
  - **capture / refine** — draft an `idea` Spec cheaply; enrich toward `scoped`/`defined`.
    Pre-flight: concept search (recipe 6) to find the family and avoid duplicate intent.
  - **design** — mature toward `ready`; resolve blocking open questions. Pre-flight: promotion
    preflight (recipe 9) + readiness divergence (recipe 7).
  - **implement** — "implement `spec:…`": bind anchors, make examples executable via generated
    contracts. Pre-flight: build backlog (recipe 1) + the Spec's own context (guarantees &
    verifiers, recipe 3).
  - **review** — a Pack / Design Review pass over a related set. Pre-flight: Pack backbone
    (recipe 5) + warn-level signals (recipe 8), or Spec context (recipe 3) + warn-level signals
    when no Pack exists.
  - **close / slim** — post-implementation slimming and drift check. Pre-flight: drift alarm
    (recipe 2) + blast radius (recipe 4) over the session's diff.
  The gen-1 lesson to keep: **state-driven, not intent-driven** — the same graph reads serve
  every shape; the shape only picks which reference to open and which advisory pre-flight to run.
  The gen-1 lesson to reject: no verdicts that block, no session scoping enforcement, no
  unlock-reason machinery — the recipes *inform*, the human decides (MD-2).
  Handoffs carry targets and pointers to commands or evidence locations that the next session
  re-runs; they never carry an inherited verified verdict.
- **B2 — the idea-capture flow.** Extend `sdp-authoring` with the cheap-capture path: the minimal
  lawful `idea`-tier Spec (the floor's idea clauses are the whole shape), where it lives, and the
  promotion habit (recipe 9 before each rung). Gen 1 needed a folder convention and a line
  budget; here the kind-conditional floor already *is* the tier shape — the missing piece is only
  the documented habit.
- **B3 — slimming is advisory practice, not a decision.** Plan 24's oracle slice ran the full
  loop through post-implementation slimming once. The three-part test rejects a Decision Spec:
  the guidance is reversible and follows prose ownership plus enrich-in-place, while the universal
  distillation boundary remains explicitly unresolved on `spec:model.enrichment-lifecycle`.
  Close/slim guidance therefore preserves durable law and one prose owner without claiming a
  universal deletion rule.

Done-signal for B: the skill exists and is exercised by `test/skills.test.ts`-style checks (as
the existing skills are); every named pre-flight is one of the eleven recipe bodies (no new
verbs — recipes are the growth valve); a fresh session can open any work shape from the skill
alone without reading a plan.

## Non-goals

- **No MCP surface** — D6 stands; `sdp q` through the shell is the agent front door (MD-22).
- **No new validators or floor clauses** — everything in this plan is prose, skill, or
  disposition; the check families are untouched.
- **No gen-1-style gates** — no FSM, no scope enforcement, no blocking pre-flights.
- **No new reader verbs** — a join freezes into the reader only at the second machine consumer;
  every pre-flight above is an existing recipe.

## Sequencing

The review of this plan was B1's design session and ratified the decisions below. Execution landed
A and B in one batch. The new behavior Spec was authored at `defined`; its complete rules,
resolving parent, packaged skill, and implementation/test anchors then cleared the `ready` floor;
only after that evidence review did the human readiness statement move to `ready` and the close
queries run.

## Ratified decisions

1. `spec:consumers.delivery-session-on-ramp` is a behavior-kind, story-altitude child of
   `spec:consumers.authoring-on-ramp`, targeted at `ready`; per Sequencing it was authored at
   `defined` and stated `ready` only after its evidence cleared the floor.
2. Slimming remains advisory skill guidance; no Decision Spec or registry entry is created.
3. P7 softens the live concept claim instead of restoring a historical ratio.
4. `pnpm-workspace.yaml` does not change. Homebrew pnpm 10.4.1 reproduced
   `packages field missing or empty`, while NVM pnpm 11.12.0 ran the documented query and returned
   the corpus count. That is a PATH/toolchain discrepancy; the supported npm wrapper is the
   execution fallback, not a reason to change workspace resolution.

## Provenance

- `reviews/13` — the dissolution value-transfer audit (the P1–P7 items and their suggested homes).
- This session's gen-1 comparison: `architect-sessions` (work shapes, state-driven routing,
  universal session rules), the architect formal spec (the enforcement machinery this design
  deliberately does not rebuild), and the PR #15 implementation-state review (anchor layer,
  executable machinery, query surface — all healthy; the debt is guidance, not machinery).

## Close record

| Audit item | Disposition |
| --- | --- |
| P1 | `spec:model.core-model` plus `sdp-authoring` carry the two-Spec rule. |
| P2 | `spec:validation.readiness-floor` states child/parent readiness independence and its target bound. |
| P3 | `spec:model.relations` carries why the typed dependency relations remain distinct. |
| P4 | `spec:consumers.impact-graph` carries `graph(A)` versus `graph(B)` without promotion. |
| P5 | `spec:validation.pack-coherence` names the rejected duplicated-intent check and its motivation. |
| P6 | `spec:decisions.executable-meta-model` carries the recovered-surface rationale. |
| P7 | `docs/concept/06` no longer implies a measured selectivity magnitude; the historical ratio remains in `reviews/13`. |

Re-measure from the repository root rather than inheriting this record:

- recipe 1 through `npm run --silent sdp:q -- '<body>'` returns no operational backlog;
- recipe 2 returns the same eight deliberate drift IDs recorded by plan 24, with no new row;
- recipe 3 for `spec:consumers.delivery-session-on-ramp` returns stated and derived `ready`, direct
  `impl:protocol.delivery-session-on-ramp`, and enabled
  `test:protocol.delivery-session-on-ramp`;
- `npm test -- --run test/skills.test.ts test/recipes.test.ts test/self-hosting-graph.test.ts`
  exercises the guidance, recipe routing, and authored graph oracle;
- `npm test -- --run test/package-smoke.test.ts` proves the installed tarball carries all three
  skills (use a writable temporary npm cache when the user cache is not writable);
- `npm run check` is the complete repository gate and the only whole-tree green verdict.
