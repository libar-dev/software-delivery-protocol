---
slug: design-law-transfer
status: plan-written
intent: clear
review_required: true
plan_path: .omo/plans/design-law-transfer.md
plan_sha256: bdbcefcb44aee1332d1d5cbf7b1c6da5ff4c9f719a36e7ec1b6c568d866f9a9c
review_round_id: rr-20260821-dlt-02
review_round_limit: 5
round_status: active
pending-action: plan approved by momus round rr-20260821-dlt-02 after third-party review fixes - handoff delivered; execution starts only on explicit user start (/start-work design-law-transfer)
review:
  momus:
    status: approved
    workspace_root: /home/darkomijic/dev-libar/software-delivery-protocol
    runtime_home: null
    target: .omo/plans/design-law-transfer.md
    round_id: rr-20260821-dlt-02
    plan_sha256: bdbcefcb44aee1332d1d5cbf7b1c6da5ff4c9f719a36e7ec1b6c568d866f9a9c
    launch_id: launch-rr-20260821-dlt-02
    session: st_01a02395
    result: '[OKAY] round 2 - unconditional approval; receipt validated (session match + live plan sha256 match). One non-blocking note: a stale lineage line range, section named and discoverable.'
review_history:
  - round_id: rr-20260821-dlt-01
    session: st_01a02372
    verdict: '[OKAY] unconditional approval'
    invalidated_by: plan edits folding the third-party review fixes (wave-1 anchors.ts collision, todo-5 Gherkin mechanics + candidate cut, draft C4 contradiction, ready-statement sentence, roster unit format, PR wording guards)
approach: Extend branch feature/architectural-patterns-views (PR #25) with the design-law transfer direction from the PR review discussion (tmp-context.md), shaped by two advisory memos: (C1a) promotion-filter advisory rule folded onto spec:model.spec-sections (architect: NOT a dedicated capture Spec; it is the MD-10 promotion law applied to comment surfaces); (C1b) realization-grain correction landed as the amendment of spec:protocol.structural-self-binding's universal rule (ultrabrain: the current absolute wording contradicts the mandatory-satisfies anchor contract); (C2) refusal decision Spec spec:decisions.jsdoc-graph-extraction-refused (ready via MD-35 registry row; refines spec:model.anchors, dependsOn one-validation-path + structural-anchor-semantics); (C3) delivery-facts tracer: new spec:extraction.delivery-facts (behavior, story, ready) carrying the 10 conferral rules, load-bearing specTest test:protocol.delivery-facts binding to avoid a 6th honesty/gaps warning, anchor impl:protocol.delivery-facts re-targets, JSDoc demotes to pointer-only (MD-10), stale test-commentary pointers retargeted; (C4) self-binding verifier: AcceptedArchitecturalUnit + CoarseGrainCoverage rosters extending test/self-hosting-oracle/structural-edges.ts, six per-row assertions + no-unexpected-sources, specTest test:protocol.structural-self-binding (Spec stays defined; ready is the user's statement); (C5) owner acts APPROVED (F2: include both); (C6) PR/branch bookkeeping. Oracle/test lockstep everywhere; gate npm run check.
---

# Draft: design-law-transfer

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
- C1a promotion filter | one advisory rule on spec:model.spec-sections: law-carrying comments promote per MD-10 when other surfaces depend on them | active | specs/model/spec-sections.sdp.md
- C1b realization grain | spec:protocol.structural-self-binding universal amended to accepted-realization grain (helpers covered by nearest honest realization anchor) | active | specs/protocol/structural-self-binding.sdp.md
- C2 refusal record | spec:decisions.jsdoc-graph-extraction-refused (decision, feature, ready via MD-35 row) | active | specs/decisions/, docs/concept/DECISIONS.md
- C3 delivery-facts tracer | spec:extraction.delivery-facts (behavior, story, ready) + anchor re-target + JSDoc pointer demotion + test:protocol.delivery-facts specTest (load-bearing: avoids a 6th honesty/gaps warning) | active | src/graph/delivery-facts.ts, specs/extraction/, test/
- C4 self-binding verifier | oracle rosters + 6 per-row assertions + sorted failure contract + specTest; Spec amendment STAYS defined (ready is the user's statement) | active | test/self-hosting-oracle/structural-edges.ts, test/self-hosting-graph.test.ts
- C5 owner acts | CONTEXT.md registration of "architecturally significant unit" + decidedBy fills (6 frozen candidates, verify-first, drop-recording) | approved (F2: include both) | CONTEXT.md, specs/*
- C6 PR/branch bookkeeping | commits on feature/architectural-patterns-views, PR #25 description forward-section update | active | PR #25

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
- Landing surface | extend feature/architectural-patterns-views + PR #25 | user stated "extend the current branch and PR" | n/a (user-set)
- Test strategy | tests-after with self-hosting oracle lockstep in the same commit; gate npm run check | repo discipline (AGENTS.md) | yes
- Verifier shape (C4) | oracle-census extending structural-edges.ts; warn-level posture per MD-30; NOT ESLint, NOT a Protocol validator, NOT derived from exports/imports | architect + ultrabrain agree: accepted set is owner-reviewed state, the test polices conformance not content | yes
- Grain-rule home | promotion filter on spec:model.spec-sections (advisory); realization grain inside the self-binding amendment; NO dedicated grain-rule Spec | architect: a Spec whose payload is "when to mint Specs" is meta-taxonomy (MD-33); ultrabrain's spec-grain Spec is subsumed by the C1b amendment | yes
- Marginal files (validate-watch.ts, markdown-fidelity.ts, data-access.ts) | CoarseGrainCoverage roster rows naming the covering realization anchor; NO manufactured anchors | ultrabrain: satisfies is mandatory on anchors (src/model/anchors.ts:21-26); MD-34 forbids manufacturing coverage | yes
- Re-target breadth | ONLY impl:protocol.delivery-facts re-targets; the other 4 derive-graph bindings keep the seam target | architect: they realize the derivation seam, not the composition law | yes
- Tracer readiness | ready, WITH a direct specTest binding (test:protocol.delivery-facts) reusing existing ladder/fail-closed tests | ultrabrain: ready without verifier adds a 6th honesty/gaps warning; binding not duplicate tests | yes
- Extrinsic sweep | no budget/stack/scale/audience forks | internal corpus work, no new dependencies | n/a

## Findings (cited - path:lines)
- Branch feature/architectural-patterns-views at ed77ee7, clean tree (only untracked tmp-context.md); PR #25 OPEN "Architectural significance rides existing primitives".
- src/graph/delivery-facts.ts:1-80 — file JSDoc carries conferral law (implemented/has-verifier conditions, enabled-example rule, "direct, never propagated up refines", observed never computed, fail-closed for foreign graphs, one-derivation-path-shared-by-three-surfaces); anchor impl:protocol.delivery-facts satisfies spec:extraction.derive-graph, memberOf component:protocol.graph.
- specs/extraction/derive-graph.sdp.md — carries the delivery-facts law as ONE behavior rule line (coarse grain confirmed).
- specs/protocol/structural-self-binding.sdp.md — readiness defined; three behavior rules incl. the uses convention; NO verifier (the unevaluable universal).
- docs/lineage/v0-design/04-authoring-surfaces.md:295-320 — markers bind code location to graph ID, "not for storing business logic"; §2.4 forbids readiness/behavior/intent/verification on markers, "markers are read-only pointers from code to spec, never the reverse"; §2.5 marker-required lint over an owner-accepted pattern set (the designed verifier shape for C4); §7 the what-stays-in-code rule.
- docs/lineage/v0-design/01-core-primitives.md:137-316 — facets (sections) carry BehaviorFacet rules with rationale: the designed home for unit law now in JSDoc.
- specs/validation/readiness-floor.sdp.md — defined floor: kind natural evidence complete + no blocking open questions; ready floor: relations resolve + refines/dependsOn targets >= defined + anchors resolve. A new behavior Spec with complete rules, resolving relations, and the re-targeted anchor can honestly state ready on day one (advisory lane to confirm).
- Capture rung today: spec:consumers.graph-first-planning (idea), spec:consumers.impact-graph (idea), spec:consumers.intent-composition (idea), spec:model.enrichment-lifecycle (scoped), spec:observation.runtime-overlay (idea). 34 decision Specs. spec:model.structural-patterns at defined.
- plans/38-graph-first-planning-arc.md — arc pointer: forward intent lives in capture-rung Specs; do-not-reopen register lives in decision Specs; NO new plans/ file for this work.
- tmp-context.md (PR review synthesis) — the direction: grain rule + tracer + verifier + refusal; owner-judgment leftovers: decidedBy fills, CONTEXT.md glossary registration; marginal files have no honest satisfies target today.
- Explore sweep (st_01a02354, verified by file reads): 49 codeAnchor-carrying src files. Law-grade JSDoc ∩ coarse family-parent satisfies, ranked: 1 delivery-facts.ts (exemplar), 2 validate/validators.ts, 3 validate/readiness-floor.ts, 4 runner/index.ts, 5 codegen/contracts.ts, 6 projections/design-review.ts, 7 notation/slots.ts, 8 extract/reify.ts, 9 model/sections.ts, 10 model/anchors.ts; honorable: cli/q-command.ts, adapters/vitest.ts; mid-file-law near-misses: extract/index.ts, extract/derive.ts, reader/reader.ts.
- Architect memo (st_01a02352): branch B is the ratified reading; A twice-refused (lineage 04 §2.4, spec:model.anchors, MD-30, P9/P10). Alpha (promote-and-retarget) for the ONE conferral-composition law; Beta (enrich-in-place) or nothing for the rest. Grain rule = MD-10 exclusive-promotion applied to comments; fold onto spec:model.spec-sections; REJECT a dedicated grain-rule capture Spec (MD-33 meta-taxonomy). Retarget only the delivery-facts anchor; parent derive-graph stays implemented via 4 remaining bindings. Oracle lockstep: extraction.ts descriptor, declared-relations.ts, pack manifest, deliveryFacts on child+parent. Verifier: oracle-census, warn-level, never derived from exports, never a Protocol validator. Failure modes if the filter relaxes: Spec-count explosion (162 Specs, ~13 non-example story), readiness churn, drift-alarm churn, comment↔Spec drift (MD-10), wrong-family placement.
- Ultrabrain memo (st_01a02353): exact mechanics. C3: spec:extraction.delivery-facts (behavior/story/ready, refines derive-graph, decidedBy binding-not-liveness) with 10 enumerated rules covering src/graph/delivery-facts.ts:5-27,29-71,82-152; JSDoc keep/drop lists; stale pointers at test/extract.test.ts:816, test/reader.test.ts:680-681,737-739, test/design-review.test.ts:428-431; oracle lockstep incl. anchors.ts:1681-1688 retarget, frozen totals test/self-hosting-graph.test.ts:138-147,188-197, expectedWarnings index.ts:52-86 (5 pinned today). C4: AcceptedArchitecturalUnit roster {unit, anchorId, componentId} deriving expectedMemberOfEdges, 6 assertions per row + no-unexpected-memberOf-source; CoarseGrainCoverage {unit, coveredBy, componentId, rationale} for the 3 marginal files with named covering anchors; specTest test:protocol.structural-self-binding (NOT specOracle — models confers nothing, target needs example space); sorted aggregate failure contract; Spec amendment required because the absolute universal contradicts mandatory-satisfies. C2: spec:decisions.jsdoc-graph-extraction-refused exact frontmatter + section content; MD-35 row makes ready honest per decision-readiness-posture.
- Readiness floors (specs/validation/readiness-floor.sdp.md + src/validate/readiness-floor.ts:311-326,474-490): behavior Spec with rules clears defined; ready additionally needs resolving relations + refines/dependsOn targets >= defined + resolving anchors; ready does NOT require implementation or verifier facts, but a ready non-decision Spec without has-verifier adds an informative honesty/gaps warning (src/validate/validators.ts:1187-1214).

## Decisions (with rationale)

- Intent CLEAR: user specified the outcome (extend branch/PR with the tmp-context direction); only scope/owner forks remain. review_required: true (default-on; not declined).
- Direction branch B (prose-to-Spec promotion) over branch A (JSDoc extraction): twice-refused (lineage 04 §2.4, spec:model.anchors, MD-30); recorded as C2, never re-deliberated.
- C1 split into C1a (advisory rule on spec-sections, architect) + C1b (realization-grain amendment inside the self-binding Spec, ultrabrain); the dedicated grain-rule capture Spec is rejected (MD-33 meta-taxonomy) and ultrabrain's spec-grain Spec is subsumed by C1b.
- Third-party review (post-momus round 1) folded in: wave-1 anchors.ts collision resolved by moving ALL anchors.ts edits into todo 8's sync pass; todo 5 candidate spec:carrier.sdp-import→MD-34 CUT (decidedBy attributes the Spec's law; the ruling shaped the binding act, not the import Spec's law); spec:consumers.reader Gherkin tag mechanics named; roster unit format pinned to path#symbol; "Spec smell" reworded to "promotion trigger"; ready-statement mechanism made explicit in the TL;DR (user approval of the plan text carrying the Spec verbatim IS the ready statement for the tracer; registry-ratification precedent for the decision Spec); PR-description wording guards added (no "teeth on the universal" without the grain caveat). Plan change invalidated momus round 1; fresh round rr-20260821-dlt-02 launched.
- C4 fixed as oracle-census with specTest binding (ultrabrain) — specOracle rejected: models confers nothing and the target has no example space.

## Scope IN

- C1a promotion-filter advisory rule on spec:model.spec-sections; C1b realization-grain amendment on spec:protocol.structural-self-binding; C2 refusal decision Spec + MD-35 registry row + pack manifest + oracle lockstep; C3 delivery-facts tracer end-to-end (new Spec + 10 rules + anchor re-target + JSDoc demotion + specTest + stale-pointer retargets + oracle lockstep); C4 self-binding verifier (rosters, assertions, failure contract, specTest, Spec amendment staying defined); C6 commits on the branch + PR #25 description forward-section update; test/oracle lockstep for every corpus edit; gate npm run check.
- C5 owner acts ONLY per the F2 answer.
- Promotion beyond delivery-facts ONLY per the F1 answer.

## Scope OUT (Must NOT have)

- NO JSDoc/doc-comment extraction into the graph (branch A — recorded refusal, never implemented).
- NO JSDoc-compiler sweep: no per-file Spec minting beyond the F1 answer; no Spec whose payload is the grain rule itself.
- NO bulk satisfies re-targeting (only impl:protocol.delivery-facts moves; the other 4 derive-graph bindings stay).
- NO new relation types, anchor fields, reader methods, projections, or validator families; MD-32 freeze intact.
- NO significance classifier derived from exports/imports (MD-30/MD-34: structural edges are authored declarations).
- NO manufactured anchors on units with no honest satisfies target; the 3 marginal files get CoarseGrainCoverage roster rows only.
- NO specOracle use for the self-binding verifier (models confers nothing; the Spec has no example space).
- NO new plans/ file; plan 38 stays the arc pointer.
- NO ready promotion of spec:model.structural-patterns (stays the user's review act).
- NO push or PR-side git actions beyond what the user explicitly requests.

## Open questions

- None. F1 resolved to A (tracer only + worklist as graph backlog, todo 7); F2 resolved to include both owner acts (todos 5, 6). The user approved the brief and all recommendations on 2026-08-21.

## Approval gate
status: approved
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
