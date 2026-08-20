---
slug: architectural-patterns-views
status: drafting
intent: clear
review_required: true
plan_path: .omo/plans/architectural-patterns-views.md
plan_sha256: null
review_round_id: null
review_round_limit: 5
pending-action: write and review .omo/plans/architectural-patterns-views.md
review:
  momus:
    status: pending
    workspace_root: null
    runtime_home: null
    target: .omo/plans/architectural-patterns-views.md
    round_id: null
    plan_sha256: null
    launch_id: null
    session: null
    result: null
approach: <fill: the approach you intend to plan>
---

# Draft: architectural-patterns-views

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
- branch | feature/architectural-patterns-views exists before any change | active | git branch --show-current
- ruling | decision Spec + MD-34 row minted; structural-patterns blocking questions resolved, Spec enriched | active | specs/decisions/*.sdp.md, docs/concept/DECISIONS.md, specs/model/structural-patterns.sdp.md
- self-binding | significance criterion ruled; component/uses anchor coverage widened across src/; structural-self-binding enriched | active | specs/protocol/structural-self-binding.sdp.md, src/
- decision-relations | genuine dependsOn/supersedes edges authored across the 33 decision Specs | active | specs/decisions/
- recipes | recipes 17-19 added to recipes.md with verbatim-executing test coverage | active | docs/agent-surface/recipes.md, test/recipes.test.ts, test/skills.test.ts
- skills | sdp-agent-surface + sdp-sessions highlight the new views | active | .agents/skills/
- agents-md | AGENTS.md (+README) recipe counts and key decision highlights updated | active | AGENTS.md, README.md
- gate | npm run check green; counts re-measured and labeled re-derived; coherent commits | active | npm run check output

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->

## Findings (cited - path:lines)
- Baseline re-derived via `pnpm --silent sdp:q`: 33 decision Specs, exactly 5 inter-decision edges (4 refines + 1 dependsOn, all carrier family), 11 component: nodes, 59 memberOf, 19 uses — matches the request's measured baseline.
- Edge vocabulary in graph: refines, decidedBy, verifies, dependsOn, constrainedBy, belongsTo, satisfies, uses, memberOf, models. Node types: Primitive, Pack, CodeNode, Anchor.
- Plan 38 (plans/38-graph-first-planning-arc.md) is DRAFTED lineage pointer; this arc executes its captured intent. Settled ground: plan 37 EXECUTED.
- MD registry rows: docs/concept/DECISIONS.md:41-44 (MD-30..MD-33) — table format: | MD-n | ratified name | durability | one-line ruling | Spec link |. MD-34 row appends in the same shape.
- Exemplar decision Spec shape: specs/decisions/structural-anchor-semantics.sdp.md (frontmatter id/kind:decision/altitude/readiness:ready/relations.refines; Intent/Decision sections with context/decision/rationale/consequence/alternative bullets).
- `spec:model.structural-patterns` (readiness: idea) has 2 blocking open questions — both resolved by the user-selected Option A ruling (no new vocabulary).
- `spec:protocol.structural-self-binding` (readiness: idea) has 1 blocking open question — the significance criterion; request proposes "exported public surface plus cross-component reach".
- Recipe-count mentions to update: AGENTS.md:79, AGENTS.md:125, README.md:31, README.md:147, .agents/skills/sdp-agent-surface/SKILL.md:88, plus test/skills.test.ts and test/recipes.test.ts pins (lane st_01a020b1 confirming line numbers).
- `ready` promotion stays a human statement — plan leaves both enriched Specs below ready for the user's review (per request).
- Recipe surface survey (lane st_01a020b1, verified against quoted lines):
  - recipes.md recipe shape: `## N. Title` heading, italic need line, one ```js fence (double quotes only, `return`, no import/export), trailing prose. Template: recipe 12 at docs/agent-surface/recipes.md:464-499.
  - test/recipes.test.ts:229-233 ordinal contiguity is dynamic (no hardcoded 16); on-ramp sync at 343-368 derives count word from heading count — with 19 recipes: "nineteen", `Recipes 1-19`, `catalog contains nineteen ready-made bodies`, `nineteen runnable \`sdp q\` bodies`. countWords table already covers nineteen.
  - recipes.test.ts:365-367 pins sessions mentions for ordinals [12,13,14,15,16] — extend to include 17-19 when sessions routes them.
  - test/skills.test.ts:298-330 same dynamic count-word sync for AGENTS + agent-surface prose; 194-220 pins sessions per-shape recipe mentions.
  - Parameterized recipe convention: body opens `const id = "..."` (or term/subject) and intro line ~35 list `Recipes 3, 6, 9, and 14` must gain the new ordinal (recipe 19 is parameterized on a Spec id).
  - Reader capability: NO reader gap. components/memberOf/uses hand-rolled over raw `graph` (precedent: recipes 12-16); decidedBy/refines via `g.specContext(id).relationsOut/In`; satisfies via `context.implementations`; Spec→component is a memberOf hop over `graph`. Recipes 17-19 need zero engine surface.
- Architect advisory (lane st_01a020b2, verified claims folded in):
  - The ruling holds: no architectural-significance claim exists that existing primitives cannot carry; two grain limits to DOCUMENT (not fix): (A) pattern membership is Spec-grain not CodeNode-grain; (B) negative constraints are claimable, not enforced (deferred architecture-enforcement validator family in src/validate/validators.ts).
  - Significance whitelist (exported public surface + cross-component reach): two MISSING components — `component:protocol.import` and `component:protocol.testing` (both public exports, cross-component reach, currently unanchored). Unanchored significant units: src/graph/delivery-facts.ts, src/graph/example-space.ts, src/extract/{carrier,discover,protocol-bindings,reify}.ts, src/validate/{graph-index,contracts}.ts, src/cli/{sdp,census-command,mermaid-command,gherkin-command,new-spec-command}.ts. Incidental plumbing to EXCLUDE: src/index.ts barrel, src/model/code-anchor.ts, src/extract/markdown-body-*/markdown-support/types/yaml-policy/envelope/frontmatter/serialize/set-own/gherkin-kind-honesty, src/cli/{artifacts,build-args,import-publish,import-scan,validate-watch}.ts, src/projections/{owned-prose,diagnostic-banner,design-review-markdown,design-review-section-content,design-review-sections}.ts.
  - Blast radius: adding component/uses to EXISTING anchors is fact-neutral (delivery facts key on satisfies/verifies only). Minting NEW codeAnchors can flip `implemented` (recipe 2 drift alarm) — rule: new anchors point only at Specs the unit already realizes (already implemented), or are not minted; NEVER satisfy decision Specs (MD-26). Census --check-clean fails until regenerated — expected, not a semantics flip.
  - Inter-decision edge honesty: today 4 refines + 1 dependsOn, ZERO supersedes. Do NOT quota-fill: supersedes stays 0 until an actual replacement passes ADR; add dependsOn only where a later decision is unintelligible without an earlier one; consider retyping carrier-stack refines that are really preconditions; fill the 6 missing inbound decidedBy from subject Specs (structural-anchor-semantics and agent-front-door among them) instead of manufacturing decision-to-decision edges.
  - Recipe footgun to document: union component-node satisfies with member satisfies (recipe 14 pattern alone misses the component node's own satisfies).
- Decision/anchor survey (lane st_01a020b0; counts match my live sdp q probes — two independent sources agree):
  - All 33 decision Specs inventoried with their current relationsOut; inter-decision edges exactly 5 (list in draft findings above), all carrier family. Zero supersedes anywhere.
  - Candidate first tranche ~12 genuine dependsOn edges with quoted justifications: carrier (universality→prose-ownership, pack-markdown-carrier, carrier-ruling), agent-surface (agent-front-door→agent-surface-scripts-graph; mcp-deferred→agent-surface-scripts-graph), structural (structural-anchor-semantics, verification-posture-not-realization, example-realization-posture → binding-not-liveness), readiness (carried-evidence→kind-conditional-floor + content-only-sections; decision-readiness-posture→kind-conditional-floor), planning (planning-truths-placement→shipped-projections-frozen). Explicit non-candidates: no scheduling edges, no supersedes, no ceremonial edges on plain-language-references/protocol-naming/exclusion-contract/etc.
  - Anchor gap map: 4 CodeNodes without memberOf (impl:protocol.sdp-import + 3 skill-doc impls in test/skills.test.ts — the latter stay off the src whitelist). Completely unanchored src trees: src/import/ (entire), src/testing/index.ts, and the per-file lists under cli/extract/graph/projections/validate (advisory whitelist narrows these).
  - Open fork on src/import/: mint sparse `component:protocol.import` (architect lane recommends) vs join `component:protocol.cli` via the existing impl:protocol.sdp-import (plan-35 deliberately did not mint an import component). Same question smaller for src/testing/index.ts.
- Ultrabrain advisory (lane st_01a020b3): all three recipe bodies (17 architecture map, 18 decision map, 19 planning slice) DRAFTED AND VERIFIED by actual `pnpm --silent sdp:q` execution (exit 0, real output inspected). Bodies use only current g/graph surface; recipe 19 uses the `const id = "spec:consumers.agent-surface";` opening-const convention (matches recipes 3/9 and the test's detection regex). Edge cases verified: unknown id returns {found:false}, no-bound-components returns honest empties, missing graph fields normalized to []. Hard limits (correctly out of scope): no symbol-level blast radius (no bySymbol by design), no typed abstraction kinds on CodeNode. Full bodies preserved in task output st_01a020b3 — plan embeds them verbatim.

## Decisions (with rationale)
- D1 ruling content: `spec:decisions.architectural-significance-rides-primitives` (working id) + MD-34 row "architectural significance rides existing primitives" — mirrors MD-30/MD-33 refusal shape; passes ADR test (hard to reverse: it closes the vocabulary question permanently; surprising: patterns dissolve into coordinates; trade-off: gives up CodeNode-grain pattern roles and machine-checked forbidden deps). Wire decidedBy from spec:model.structural-patterns.
- D2 significance criterion ratified as proposed: exported public surface plus cross-component reach. Becomes the answer to structural-self-binding's blocking question.
- D3 supersedes stays at ZERO — exploration found no genuine replacement; MD-33 forbids manufacturing edges. The request's "dependsOn/supersedes" resolves to dependsOn only; documented in the decision Spec.
- D4 inter-decision authoring scope = the survey's justified first tranche: 12 dependsOn edges (carrier/agent-surface/structural/readiness/planning families, quoted justifications) + 2 dependsOn on the new decision Spec itself (→ structural-anchor-semantics, → binding-not-liveness) authored in todo 2 + 6 decidedBy fills (agent-surface→agent-front-door, warn-level-signals→decision-readiness-posture, core-model→example-realization-posture, self-hosting→plain-language-references, gherkin-authoring→sdp-gherkin-extension, anchors→structural-anchor-semantics). Remaining candidates explicitly deferred, never quota-filled.
- D10 ORACLE LOCKSTEP (verified): every corpus edit has a committed-oracle counterpart — test/self-hosting-oracle/{anchors.ts (count pin 157 at self-hosting-graph.test.ts:145), structural-edges.ts (exact component/memberOf/uses rosters + exceptions list whose comment records plan-35's "import is a bounded carrier capability, not a separate engine seam" — superseded by Q1), declared-relations.ts (full transcription), decisions.ts (full descriptor transcription), pack-members.ts + specs/self-hosting.pack.sdp.md (manifest enumerates all 33 decisions), model.ts + protocol.ts (entries for the two enriched Specs)}. Each corpus todo names its oracle files.
- D11 readiness floor verified: structural-patterns (model) defined = non-empty model.terms (currently absent) + refines target spec:model.anchors ready ✓; structural-self-binding (behavior) defined = rules/examples present (already has a rule) + refines target spec:protocol.self-hosting defined ✓. New decision Spec states ready (registry ratification is the decision kind's natural evidence, MD-26; MD-34 row lands in the same commit; user selected Option A).
- D12 satisfies-target mapping pinned per unit with a verify-then-skip rule: executor reads the target Spec; on mismatch the unit is skipped and recorded, never forced. new-spec-command has no realizing Spec → SKIP by default.
- D5 anchor widening: add component/uses to EXISTING anchors (fact-neutral) and mint NEW anchors only where the unit already realizes an already-implemented Spec; never satisfy decision Specs (MD-26); never point anchors at unfinished idea-rung Specs (recipe-2 drift). Whitelist/blacklist per the architect lane's module-boundary view.
- D6 recipe bodies 17-19 are pre-verified (executed, exit 0); plan embeds them verbatim. Recipe 19 parameterized via opening `const id = ...`; recipes.md intro parameterized list gains 19.
- D7 test strategy: tests-after in the same commit — extend test/recipes.test.ts (per-recipe ground-truth it-blocks mirroring 12-16, sessions ordinal loop [12..16]→[12..19]) and keep test/skills.test.ts green via prose updates. Agent-executed QA: npm run check per todo wave.
- D8 readiness rungs: enrich both Specs to the honest floor-supported rung (expected `defined`); `ready` left to the user's review per the request.
- D9 branch: feature/architectural-patterns-views; commits at coherent boundaries authorized by the plan.

## Scope IN
- Ruling: new decision Spec + MD-34 row + structural-patterns enrichment (blocking questions resolved).
- Anchor widening across src/ per the significance whitelist (incl. the two missing components if the fork resolves to mint).
- Inter-decision dependsOn first tranche (~12 edges) + missing inbound decidedBy fills.
- structural-self-binding enrichment once coverage lands.
- Recipes 17-19 + recipes.test.ts/skills.test.ts lockstep updates.
- sdp-agent-surface + sdp-sessions skill highlights; AGENTS.md (79, 125) + README.md (31, 147) count updates + key-decision named list.
- npm run check gate + re-measured counts at close.

## Scope OUT (Must NOT have)
- No new relation types, anchor fields, reader methods, or component: naming semantics.
- No supersedes edges; no scheduling-flavored edges (MD-33).
- No anchors on incidental plumbing (blacklist in findings); no anchors satisfying decision Specs or unfinished idea-rung Specs.
- No committed renderings of the new views (derived on demand, MD-32).
- No readiness: ready promotion — human statement, user's review.
- No engine behavior changes; if a recipe join proves impossible, STOP and surface (second-caller bar).
- No new plans/ file; plan 38 stays the arc pointer.

## Open questions
- Q1 RESOLVED (user, 2026-08-20): MINT `component:protocol.import` and `component:protocol.testing` as new components — both are package exports with cross-component reach, matching the ratified criterion; plan-35's no-import-component choice predates the criterion (drift repair).

## Approval gate
status: approved
approved: 2026-08-20 (user: "okay. agree with q1 recommendation")
approach: execute plan-38's structural intent in 8 components: branch → ruling (decision Spec + MD-34 + structural-patterns enrichment) → anchor widening per whitelist (minting the two new components per Q1) → inter-decision dependsOn first tranche → structural-self-binding enrichment → recipes 17-19 with test lockstep → skills + AGENTS/README highlights → npm run check gate with re-measured counts. All recipe bodies pre-verified; no engine surface changes.
pending-action: write and review .omo/plans/architectural-patterns-views.md
plan_written: 2026-08-20
metis_review: 2026-08-20 — BLOCKER resolved (component:protocol.testing satisfies target enriched in todo 4), remaining gaps fixed or accepted as residual risk.
external_review: 2026-08-20 — execution-model flaw (Wave 3 parallel oracle collisions) fixed by adding T15 oracle-sync todo; generated/ commit clause dropped; example-runner Spec edit dropped; structural-patterns title/outcome rewrite added; test runner corrected to vitest; dependsOn tranche made measured/droppable; recipe bodies stripped of defensive guards; graph-first-planning noted out of scope.
momus_review: 2026-08-20 — APPROVED with no required changes (after external-review corrections and dependency contradiction fix).
