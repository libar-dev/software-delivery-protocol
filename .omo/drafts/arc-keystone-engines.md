---
slug: arc-keystone-engines
status: plan-complete
intent: clear
review_required: true
plan_path: .omo/plans/arc-keystone-engines.md
plan_sha256: 1ae3e3798bf0389b9d5c2df0c20a354c53295755a5028df0f7bf901aca05b32e
review_round_id: rr-5f509eebdd5a
review_round_limit: 5
round_status: active
pending-action: review .omo/plans/arc-keystone-engines.md
review:
  momus:
    status: approved
    workspace_root: /home/darkomijic/dev-libar/software-delivery-protocol
    runtime_home: null
    target: .omo/plans/arc-keystone-engines.md
    round_id: rr-5f509eebdd5a
    plan_sha256: 1ae3e3798bf0389b9d5c2df0c20a354c53295755a5028df0f7bf901aca05b32e
    launch_id: launch-151dc7694156
    session: st_019ffe80
    result: approved — [OKAY] "referenced files exist and substantiate the claimed starting points; each todo has executable acceptance and QA scenarios, including defined branch outcomes for the two decision-dependent implementations"; final live-plan validation passed (hash match 1ae3e3798bf0389b9d5c2df0c20a354c53295755a5028df0f7bf901aca05b32e)
  history:
    - round_id: rr-c5046fb37bf5
      session: st_019ffe78
      result: changes_requested
      note: todos 4/8 handler-resolution contradiction; fixed by removing the stale generation-time-refusal sentence from todo 8
    - round_id: rr-5f42958f9b77
      session: st_019ffe7a
      result: changes_requested
      note: todo 3 refusal outcome vs todo 5 unconditional fields; fixed with BR1/BR2/BR3 per-ruling branches in todos 5 and 10
    - round_id: rr-c59a03eec766
      session: st_019ffe7d
      result: changes_requested
      note: F4 and Success Criteria unconditionally required memberOf/uses edges; made branch-aware for BR2/BR3
approach: ONE plan covering briefs A+B+C+D (E deferred with re-entry trigger), plan-26-style mixed ruling+engine, three waves: Wave 0 = A-ruling ‖ D-ruling design sessions + plan-30 badge hygiene; Wave 1 = B design-gate (registrar interface, step identity, comparator) then O3 codegen ‖ D-impl ‖ C census (graph-only); Wave 2 = A-follow-through gated on ruling + C second projection. Decision-complete with ruling outcomes handled as named branches.
---
# Draft: arc-keystone-engines

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
- A-ruling | carrier universality decision Spec (per-kind honesty map, rich content, universal meaning, default question, packs named) — may lawfully refuse kinds | active | new specs/decisions/* + plans/29:60-128
- A-followthrough | gherkin-authoring Spec + extractor amendments gated on the ruling | active (Wave 2, gated) | specs/carrier/gherkin-authoring.sdp.md + src/extract/gherkin.ts
- B-O3-design-gate | adopter-facing interface frozen BEFORE codegen: registrar-vs-self-running-module, step identity (skeleton vs stable operation key), three-way comparator, partial-oracle input, failure-context reuse | active (Wave 1 head, gates B-O3) | ultrabrain-risks report 2026-08-14
- B-O3 | codegen emits runnable modules; authored verifier shrinks to world/product/oracle; valid-cart mutation evidence | active | src/codegen/contracts.ts + reviews/14:228-247
- C-projections | new spec:consumers.* + pure renderer(s); census page owned here; CLI posture ruled on record | active | src/projections/ + specs/consumers/
- D-ruling | structural-anchor decision Spec, refusal list inside it, satisfies-vs-implements ruled first | active | new specs/decisions/* + plans/29:189-229
- D-impl | codeAnchor fields, anchored structural edges, claim-separation validators | active | src/model/anchors.ts + src/extract/anchors.ts + src/extract/derive.ts + src/validate/validators.ts
- E-agent-surface | read recipes / write ergonomics / MCP amendment | deferred (re-entry trigger: census + structural edges queryable) | plans/29:231-268

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
- chunk selection | {A,B,C,D} in ONE plan, E deferred | user delegated selection ("please select ... lean larger"); architect advisory + briefs' sequencing concur; E consumes C/D outputs and its MCP half may lawfully end without a ruling | yes — at the gate
- plan shape | plan-26-style mixed ruling+engine, three waves (Wave 0: A+D rulings ‖; Wave 1: B ‖ D-impl ‖ C graph-only; Wave 2: A-follow-through gated) | plan 26 precedent (MD-25 ruling + engine in one plan); avoids serializing behind A | yes — plan-internal
- C first slice | census/taxonomy page first (graph-only, lawful before A rules), one more graph-only candidate second | C owns census exclusively; reader exposes all descriptor fields; gen-1 lesson: census generated, never hand-maintained | yes
- B boundary | specTest stays sole has-verifier source; claim taxonomy untouched; ADD handler-resolution refusal (compile-time-only today); never O5 | brief B law + explore-b finding | no (brief law)
- stale plan-30 badge | flip plans/30 header to executed as Wave-0 hygiene | code landed via PR #17; header stale | yes

## Findings (cited - path:lines)
- Corpus re-measured 2026-08-14: 149 specs · 1 pack · 138 anchors → 288 nodes · 545 edges, 0 errors/0 warnings (`npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`).
- Operational backlog (recipe 1): EMPTY. Drift alarm: 8 Specs implemented@defined — carrier.markdown-authoring, consumers.projections-model, extraction.claim-taxonomy, extraction.regenerability, model.core-model, model.pack-aggregate, model.relations, model.spec-sections. Matches plan 29's recorded observations.
- Plan 30 LANDED (verified against tree, header still says EXECUTING = stale): discovery recognizes only .sdp.ts/.sdp.md/.sdp.gherkin (src/extract/discover.ts:5, src/extract/index.ts:195); no bare-.feature carrier; zero "declined" Gherkin language remains in docs/concept/00, docs/concept/07, specs/decisions/carrier-ruling.sdp.md; MD-28 decision spec exists at specs/decisions/sdp-gherkin-extension.sdp.md. PR #17 merged (16be6d7 + a9b65c5, fix 4ccc2e9).
- Consequence: brief A is UNBLOCKED ("plan 30 before brief A's carrier edits" satisfied).
- pnpm absent on this workstation; use `npm run --silent sdp:q -- '<body>'` / `npm run --silent sdp -- ...` everywhere (AGENTS.md sanctions this).
- Seven research lanes dispatched 2026-08-14: explore-a/b/c/d/e + architect-chunk + ultrabrain-risks (st_019ffe32..st_019ffe38).
- A (explore-a): kind structural (Feature=behavior gherkin.ts:1200, Scenario=example :1076); Rule: already = behavior.rules (rule-kind collision); doc strings/data tables refused (gherkin.ts:850-871); kind-evidence honesty map at src/validate/readiness-floor.ts:336-397; A amends MD-27 kind bound + maybe MD-18 default, never MD-28; sole exemplar specs/consumers/reader.sdp.gherkin.
- B (explore-b): codegen emits contracts ONLY (68 contract + 30 space = 98 modules); zero runnable emission; valid-cart test ~35-40% mechanical, oracle expected() authored but unwired (examples/checkout-v1/test/orders/create-order.oracle.ts:22-38); review 14 §7 acceptance reviews/14-executable-verification-design-review.md:228-247; unresolved-handler-binding compile-time-only today — new refusal to add; executable-contracts + example-runner specs ready/implemented/has-verifier.
- C (explore-c): NO projection registry — sdp view hardcoded to Design Review (src/cli/validate-view-command.ts:64-110); CLI posture itself the on-record decision; all candidates (Mermaid/reference/context-bundle/census/Studio) have ZERO carrying specs — first product is new spec:consumers.* refining projections-model; reader exposes all census fields (reader.ts:251-264); determinism template = pure render + wholesale tmp→rename + --check-clean.
- D (explore-d): anchors are top-level const builder calls, NOT comment tags; CodeAnchor={id,label?,satisfies}, foreign fields extraction envelope errors (src/extract/anchors.ts:279-288); zero implements in SDP src/ — gen-1 @architect-implements joins pattern identities (architect checkout registry-builder.ts:198-207); 50→~26 drift record architect/formal-spec/REVIEW-2026-05-17-FINDINGS.md:52-70; plug-in path: model → extract allowlist → derive anchored edge → claim-separation case (validators.ts:387-390); anchor-required lint unimplemented, stays warn/optional.
- E (explore-e): front door fully landed (agent-surface/agent-front-door/reader all ready); blastRadius file-level exists (reader.ts:708-815); no sdp new / --watch anywhere; MCP bar verbatim "deferred until a concrete caller establishes its boundary and contract" (mcp-deferred.sdp.md:16); burst-mode rule only plan-29 evidence, not a Spec.
- architect-chunk: recommends {A,B,C,D} one plan, E deferred; plan-26 precedent for ruling+engine mix; waves: 0 rulings ‖ 1 engines ‖ 2 A-follow-through; low contention, only real seam C∩D (D owns edges, C owns page).
- ultrabrain-risks (top risk = arc-sinker): Brief B has NO semantic-binding identity — graph anchors carry no export symbol, step identity is mutable skeleton text (src/notation/slots.ts); plan MUST gate B on an interface freeze: generated registrar (authored .test.ts keeps specTest anchor + one activation call) recommended over self-running module; mutation evidence needs a THREE-WAY comparator (Spec Then params vs oracle payload vs observed outcome) — actual===oracle alone stays green when Spec total mutates; never cast Partial<Conditions> to Conditions; outlines stay refused.
- ultrabrain A-position (advisory, ruling session decides): reaffirm canonical Gherkin for behavior/example only; refuse workflow/rule/constraint/model/decision/contract with per-kind reasons; "universal" = generated Gherkin-shaped READ projection (medium) not default flip (XL dishonesty risk); Gherkin carrier selection is family-scoped physically (one .sdp.gherkin = Feature+children).
- ultrabrain C-position: census from RUNTIME constants (src/model/descriptors.ts, src/graph/schema.ts) so zero-count categories visible; Mermaid needs own injective node tokens + dedicated escape + bounded scale policy (per-Spec one-hop or per-Pack, never whole-graph); publication unit must be ruled (single atomic projection root vs per-projection commands) — runView is Design-Review-specific today.
- ultrabrain D-position: component/uses as GRAPH REFERENCES (component?: ComponentAnchorId, uses?: readonly CodeAnchorId[]) not enums; DECLINE implements (duplicates satisfies); complete edge-contract rows (memberOf/uses CodeNode→CodeNode claim anchored, no delivery-fact/readiness effect); malformed structural field excludes whole anchor; cycles = data not findings; bump schemaVersion.

## Decisions (with rationale)
- intent: clear — user delegated the chunk selection explicitly ("please select ... lean larger"); outcome (one decision-complete plan for a large next-arc chunk) is known.
- review_required: true — default-on per Senpi review policy; user did not opt out.

## Scope IN
- Brief A ruling (per-kind honesty map vs kind-evidence table; rich content on existing prose owners per MD-19; "universal" meaning; default question only if coverage lands; packs named in/out) + gated follow-through amendments
- Brief B: O3 derived runnable modules, valid-cart tracer + mutation evidence
- Brief C: new projection(s) — census first slice + one more graph-only candidate; CLI posture ruled on record; never re-specify Design Review
- Brief D ruling (closed structural fields on codeAnchor; closed enums or graph-ID values; refusal list in the decision Spec) + implementation (extract/derive/validate plug-in path already mapped)

## Scope OUT (Must NOT have)
- Brief E entirely (read recipes, sdp new, --watch, MCP amendment) — re-entry trigger: after this chunk closes, census + structural edges queryable
- Reopening MD-28 (suffix, dual-recognition, bare .feature)
- Self-executing prose; execution/has-verifier outside generated contracts + anchored handlers
- bySymbol / impact-graph smuggling (impact-graph stays idea with its blocking question)
- Anchor-required lint promotion to error level (stays warn/optional)
- Authored delivery status, lifecycle tags, free-form tag vocabulary, parallel registry
- Re-specifying the shipped Design Review

## Open questions
- (none blocking — chunk selection and test strategy are announced defaults the user can veto at the gate)

## Direct verifications (planner-owned, 2026-08-14)
- Review 14 §5.4/§7 verified at reviews/14-executable-verification-design-review.md:153-167,228-247: mechanical 35–40% quote exact; O3 recommendation + valid-cart mutation acceptance shape exact; "Owner outcome: O2" at :249 — O3 deferred-not-rejected, recommissioned as brief B.
- Valid-cart test verified at examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:1-64: specTest anchor + bindExample with six literal skeleton keys; Then handlers re-encode expectations; oracle never imported. Ultrabrain three-way-comparator risk confirmed real: current reddening works via params.total in the Then handler; a generated module comparing only observed-vs-oracle would stay green on a Spec {total} mutation.
- All load-bearing lane claims now dual-sourced or directly verified.

## Approval gate
status: approved 2026-08-14 (user: "approved!"); plan written; metis gap analysis folded (14 findings: 3 major, 8 minor, 3 notes — all resolved); structural self-check PASS; TL;DR filled last. Momus review: round 4 APPROVED ([OKAY], receipt st_019ffe80, plan sha256 1ae3e379 validated live at handoff); rounds 1-3 changes_requested, all fixed.
next workflow action: DELIVERED — execution via /start-work arc-keystone-engines.

## Wave skeleton (pre-approval sketch — becomes the plan's Todos)
Wave 0 — rulings + hygiene (all parallel):
- T1 plan-30 badge flip to executed + plan-29 commissioned-plans line gains plan 31 record + plans/31-* arc record authored (repo convention: commissioned plans take 30 upward) [quick/writing]
- T2 A-ruling session → carrier-universality decision Spec: per-kind disposition vs kind-evidence (readiness-floor.ts:336-397), rich-content ruling on MD-19 prose owners, "universal" meaning (projection vs default flip), packs named in/out; ADR three-part test; refusal lawful [deep]
- T3 D-ruling session → structural-anchor decision Spec: component/uses as graph-ID refs (ComponentAnchorId / CodeAnchorId[]), implements ruled (advisory: decline — duplicates satisfies), refusal list IN the Spec body, cycles-as-data [deep]
Wave 1 — engines (parallel; T4 gates T8, T3 gates T5):
- T4 B design-gate: freeze adopter interface — generated registrar (registerValidCart({createWorld,invoke,observe,expected,assertions?})), step identity (skeleton fail-loudly vs stable operation key), three-way comparator (Spec Then params vs oracle payload vs observed), Partial<Conditions> oracle input, failure-context reuse of renderContractStep; deliverable = Spec amendments to extraction.example-runner/executable-contracts [ultrabrain — one cohesive hard problem]
- T5 D-impl: CodeAnchor model fields, extraction allowlist, derive memberOf/uses edges (claim anchored), schema edge-contract rows + schemaVersion bump, claim-separation cases, referential integrity, malformed-field whole-anchor exclusion, tests [unspecified-high]
- T6 C census: new spec:consumers.census-page refines projections-model; pure renderer from runtime constants (descriptors.ts/schema.ts — zero-count rows visible); CLI posture + publication unit ruled on record; wholesale tmp→rename + --check-clean twin; tests [unspecified-high]
- T7 C bounded Mermaid: per-Spec one-hop / per-Pack diagrams, injective node tokens, dedicated escapeMermaidLabel, deterministic scale-bound refusal (never silent truncation), permutation tests [unspecified-high]
Wave 2 — gated follow-through:
- T8 B O3 implementation: runnable-module emission in codegen, handler-resolution refusal (new), valid-cart migration to registrar shape, mutation evidence (Spec total change reddens; oracle result change reddens) [deep]
- T9 A-follow-through: gherkin-authoring Spec + extractor amendments per ruling branches (named per outcome; default-flip branch includes operative-record discipline per plan-18 precedent) [unspecified-high]
- T10 census consumes D edges: structural-bindings section in census (C owns page, D owns edges) [quick]
Final verification wave: F1 plan compliance audit, F2 code quality, F3 real manual QA (npm run check + sdp q recipe spot-checks), F4 scope fidelity — all parallel, ALL must APPROVE.
Dependency matrix: T4→T8; T3→T5; T2→T9; T5→T10; T6→T10; T6→T7 (CLI posture).
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
