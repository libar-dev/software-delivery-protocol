---
slug: plan-35-agent-surface-arc
status: plan-complete
intent: clear
review_required: true
plan_path: .omo/plans/plan-35-agent-surface-arc.md
plan_sha256: 91aa2620ed79eb7db8c00ae8569e1d948d433e925d4da8d1cc63438d97a7e880
review_round_id: rr-plan35-r12-20260815T181330Z
review_round_limit: unlimited (user explicitly authorized finalizing the review loop without per-step permission)
round_status: approved
pending-action: execute .omo/plans/plan-35-agent-surface-arc.md via /start-work
phase: review_complete
plan_status: complete-momus-approved
focused_repair_review:
  session: st_01a0061e
  reviewer: oracle
  result: approved
  findings: 0
metis_final_check:
  session: st_01a005c1
  lane: kimi-coding/kimi-for-coding-highspeed (user-configured; completed 7m16s, 82 tools — lane viable)
  findings: 3 (2 high, 1 low)
  folded: all 3 — matrix footnote subordinating parallelize column to wave-gate serialization; constraint kind has no lawful bare skeleton (mapConstraints hard-errors), scaffold emits envelope+title+Intent only, tests expect 7 twin-sectioned kinds + constraint exception; re-measure preamble added to todo 1 per plan-34 law
convergence_ledger:
  accepted_blockers:
    - "rr-plan35-r2: F1-F4 lacked executable QA scenarios (eligible: plan producer contract + F-wave gates todo 18) — fixed with concrete tool/invocation scenarios, smallest edit, no scope change"
    - "rr-plan35-r3: F1 audit was circular (required todo 18's commit/evidence while gating it) — F1 scope now todos 1-17; todo 18's flip verified by its own gate commands"
    - "metis-final (st_01a005c1): matrix/wave-gate contradiction; constraint bare-heading scaffold impossible (mapConstraints error); missing re-measure preamble — all folded"
    - "rr-plan35-r5: todo 10 cited gitignored untracked generated registrar with unstable line numbers — fixed with explicit generation prerequisite + tracked pattern reference"
    - "rr-plan35-r6: zero-human-intervention vs user-gated F-wave (clarified: governance checkpoint, not verification labor); F3 invocation used non-root-relative PATH (fixed to specs/probe.sdp.md --root <scratch>)"
    - "rr-plan35-r7: F3's --root option missing from todo 6's command contract — fixed by adding optional --root (default cwd) to the contract + tests, matching the CLI family's existing convention"
    - "rr-plan35-r8: F1 required closure commits todo 17 may legitimately not produce — fixed (zero-or-more)"
    - "rr-plan35-r10: Todo 6 contradicted itself on empty relations and Todo 17 lacked executable five-agent/re-measurement invocations — fixed by binding empty relations to emitMarkdownSpec's canonical relations: {} branch and specifying the exact native task batch, command gates, evidence, and retry semantics"
    - "rr-plan35-r11: Todo 17 cited absent test/agent-recipes.test.ts — corrected to the repository-owned test/recipes.test.ts suite"
  non_blocking_notes:
    - "rr-plan35-r8 claimed the tracked checkout registrar examples/checkout-v1/test/orders/orders.create-order.valid-cart.test.generated.ts is absent — DISPROVEN against the canonical tree: on disk, git ls-files tracked, committed in fa4518f (momus sandbox likely stale). Reference annotated with the commit id for executor verifiability; no contract change."
  rounds: 12
fable_metis_review:
  source: user-delivered Fable 5 report (designated by user as today's Metis review)
  findings: 10 (3 fix-before-execution, 4 worth-adjusting, 3 minor) + 1 process note
  folded: all 10 — committed oracle as source of truth (no .omo/evidence deps in committed tests); todo-5 Must-NOT explicit file list; recipe-4 keeps full at-risk set (atRiskSpecs + atRiskOther); todo-2 may retarget rows + graph/cli rows carry verification duty; todo-6 verifies kind-twin table + relations emptiness before freezing bytes; recipe 16 framed as graph-side upper bound; wave-gate serialization rule for generated/-writing commands; 146+accepted-count wording; cheap-to-deprecate wording; literal `plan 35 is EXECUTING` string; rulings presented as confirm-and-record
  invalidated: momus round rr-plan35-r1 (plan changed after approval)
review_history:
  - round_id: rr-plan35-r1
    session: st_01a0058d
    result: approved
    note: superseded — Fable findings folded after approval; plan hash changed
  - round_id: rr-plan35-r2
    session: st_01a005a1
    result: changes_requested
    note: F1-F4 missing executable QA scenarios; fixed and resubmitted as rr-plan35-r3
  - round_id: rr-plan35-r3
    session: st_01a005a3
    result: changes_requested
    note: circular F1/todo-18 dependency; F1 scope narrowed to todos 1-17; resubmitted as rr-plan35-r4
  - round_id: rr-plan35-r4
    session: st_01a005a6
    result: approved
    note: superseded — metis final check (st_01a005c1, highspeed lane) found 3 defects; folded; resubmitted as rr-plan35-r5
  - round_id: rr-plan35-r5
    session: st_01a005cb
    result: changes_requested
    note: todo 10 cited an untracked gitignored generated file with line numbers; fixed (generation prerequisite + tracked checkout registrar as pattern ref); CAP REACHED — user authorized round 6
  - round_id: rr-plan35-r6
    session: st_01a005d5
    result: changes_requested
    note: zero-human-intervention vs user-gated final wave contradiction (clarified as governance checkpoint, not verification labor); F3 scratch invocation violated root-relative PATH contract (fixed); stale eight-kind QA wording aligned — user authorized round 7
  - round_id: rr-plan35-r7
    session: st_01a005da
    result: changes_requested
    note: F3's --root missing from todo 6 contract; added optional --root (default cwd) to contract + tests; resubmitted as rr-plan35-r8
  - round_id: rr-plan35-r8
    session: st_01a005dc
    result: changes_requested
    note: F1/todo-17 commit-count conflict fixed (zero-or-more); second finding (missing tracked registrar) disproven against canonical tree and recorded as non-blocking note; resubmitted as rr-plan35-r9
  - round_id: rr-plan35-r9
    session: st_01a005df
    result: approved
    note: superseded by the user-directed repair after post-restoration forensics
  - round_id: user-directed-repair-2026-08-15
    session: st_01a0061e
    result: approved
    note: focused Oracle review found no blockers; the unnecessary public --root expansion is removed, commit boundaries are logical rather than per-todo, and Plan 35 runtime evidence remains narrowly ignored and workspace-local
  - round_id: rr-plan35-r10-20260815T180612Z
    session: st_01a0069a
    result: changes_requested
    note: empty-relations contradiction and non-executable Todo 17 review/re-measurement gates fixed; resubmitted as rr-plan35-r11
  - round_id: rr-plan35-r11-20260815T181122Z
    session: st_01a0069f
    result: changes_requested
    note: corrected absent test/agent-recipes.test.ts invocation to the repository-owned test/recipes.test.ts; resubmitted as rr-plan35-r12
  - round_id: rr-plan35-r12-20260815T181330Z
    session: st_01a006a1
    result: approved
    note: all implementation, test, plan, Spec, and tooling references exist and are relevant; every todo and final verifier has executable QA commands, concrete steps, and expected outcomes
gap_analysis:
  agent: oracle st_01a0057e (metis substitute — metis aborted twice on provider errors)
  findings: 9 (1 blocker, 6 major, 2 minor)
  folded: all 9 — single-writer glob fixed (G owns self-hosting-graph/oracle, F owns behavioral suites); matrix corrected (E2 unblocked, E3 after E halves, H after 12+13, F-wave gates todo 18); scaffold skeleton settled empirically (bare headings lawful, comments/bullets hard errors); G acceptance tracks accepted-set not hard-coded 11 + graph-roster memberOf completeness assertion; todo 12 specifies 5 recipes with schemas + semantic assertions; watch race test deterministic + flag rejections pre-decided; recipe-4 claim assertion matches production ImpactReason shape; TL;DR filled
structural_self_check: "18 impl rows (1-18), 4 final rows (F1-F4), all column-zero with categories, template order intact"
metis_substitution: "metis aborted 3x on kimi-for-coding standard lane (2m40s/2m42s/3m12s, mid-stream, invisible to provider logs); gap analysis substituted to oracle st_01a0057e with identical contract. Post-restore gate re-arm: ulw-plan re-activated by user + hash-preserving edit-pair touch of the plan (sha256 d62aa4e8 verified intact). Final metis check running on kimi-for-coding-highspeed: st_01a005c1"
review:
  momus:
    status: approved
    workspace_root: /home/darkomijic/dev-libar/software-delivery-protocol
    runtime_home: null
    target: .omo/plans/plan-35-agent-surface-arc.md
    round_id: rr-plan35-r12-20260815T181330Z
    plan_sha256: 91aa2620ed79eb7db8c00ae8569e1d948d433e925d4da8d1cc63438d97a7e880
    launch_id: launch-plan35-r12-20260815T181330Z
    session: st_01a006a1
    result: "OKAY — all referenced implementation, test, plan, Spec, and tooling files exist and are relevant; each todo and final verifier provides executable QA commands, concrete steps, and expected outcomes."
approach: <fill: the approach you intend to plan>
---

# Draft: plan-35-agent-surface-arc

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
- E1 read recipes | diff→at-risk bridge + census/fan-in reads + projection-verb recipes ship as runnable recipes | active | docs/agent-surface/recipes.md, src/reader
- E2 write ergonomics | `sdp new spec` + `sdp validate --watch` ship with an explicit placement ruling | active | src/cli, specs/decisions/agent-front-door.sdp.md
- E3 MCP amendment attempt | the D6 deferral is tested against its concrete-caller bar; ruling OR recorded non-ruling | active | specs/decisions/mcp-deferred.sdp.md
- F registrar adoption | first self-hosting tranche of the 30 deferred families adopted or refused per-family under MD-31 | active | generated/registrars.json, specs/decisions/adopted-registrars-committed.sdp.md
- G structural self-binding | engine's own component/uses edges authored in src/; satisfies-vs-component friction resolved by convention or ruled MD-30 amendment | active | src/model/anchors.ts, specs/decisions/structural-anchor-semantics.sdp.md
- H next projections | reference projection / context bundle / Spec Studio / structural Mermaid each earn a plan or a recorded deferral | active | specs/consumers/projections-model.sdp.md

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
- plan numbering | ONE execution plan, numbered 35, covering the whole arc | repo precedent: plan 31 executed briefs A–D as one plan; harness one-request-one-plan rule; plan 34 allows 35+ but does not require splitting | yes (plan 34 header can commission more)
- brief H posture | included as a decide/defer component, sequenced last | plan 34: "H goes last overall or defers"; deferral with reasons is lawful | yes
- review | high-accuracy momus review is REQUIRED (default-on; user asked for pedantic planning, did not decline) | Senpi review policy | no (unless user declines)

## Findings (cited - path:lines)
- Re-measurement (2026-08-15, main @ 5a8c984): `sdp validate` reproduces plan 34's numbers exactly — 156 Specs · 1 Pack · 146 anchors → 303 nodes · 571 edges, 0 errors, 0 warnings. Recipe 1 (backlog): empty. Recipe 2 (drift alarm): 8 Specs, all stated `defined` (model family parents, projections-model, claim-taxonomy, regenerability, markdown-authoring). Recipe 8: 0 errors/warnings/signals. Nothing inherited stale.
- Planning input corrected by user: plan 34 (not 35) is the briefs index; execution plans take 35 upward (plans/34-agent-surface-adoption-and-self-binding-briefs.md header, "Numbering").
- PR #19 (MERGED 2026-08-15): universal-Spec arc closed; its Upcoming-work section = plan 34's briefs E/F/G/H; do-not-reopen list carried into plan 34.
- gh CLI healthy: `gh pr view 19` succeeded; auth token + ssh protocol fine (user-flagged prior-session issue not reproducing).
- pnpm absent on PATH in this session; `npm run --silent sdp --` / `npm run --silent sdp:q` are the working invocation (AGENTS.md sanctions both).
- Prior harness state: .omo/boulder.json shows two completed works (pr-17, arc-keystone-engines); no active work. Plans 31/33 (EXECUTED) live in plans/; harness plans live in .omo/plans/ — relationship under exploration (lane 4).
- E1 (lane st_01a0055f): `blastRadius(changedFiles)` already returns impacted/at-risk/coverage-unknown with reasons (src/reader/reader.ts:261,710-824; guaranteed by ready spec:consumers.reader). Recipe 4 (docs/agent-surface/recipes.md:194-245) is that shape minus git acquisition; "no git-diff runner inside the reader" is a recorded plan-09 non-goal — the bridge is a recipe/convenience, not a reader change. `specsReverifying` exists only as plan prose (plans/29,34), no gen-1 artifact in repo.
- Recipes (lane st_01a0055f): adding a recipe = `## N. Title` + one js fence in recipes.md + plain-JS/no-single-quote hygiene; test/recipes.test.ts runs every body verbatim via runSdpCli; ordinals must stay contiguous.
- E2 (lane st_01a0055f): closed verb allowlist in src/cli/sdp.ts:105-118; `sdp new spec` needs new command module + allowlist + help; `validate --watch` needs BuildArgs/parser extension (unknown options currently fail, build-args.ts:53-55). MD-22/D5/D6 + agent-surface all `ready`; impact-graph `idea` with blocking identity question intact.
- E3 (lane st_01a0055f): all in-repo graph callers are shell-`sdp:q` (skills, AGENTS.md) or in-process `createReader` (CLI projections, tests). No MCP transport/tool-schema exists. Recorded non-ruling is the live default outcome.
- G contract (lane st_01a00561): CodeAnchor = { id, label?, satisfies (REQUIRED), component?, uses? } (src/model/anchors.ts:21-27); extraction refuses missing satisfies (extract/anchors.ts:426-435); dangling structural target = referential-integrity error that keeps node/satisfies/implemented (test/structural-anchors.test.ts:179-215). ~55 production anchors in src/, all satisfies-only; ZERO component/uses anywhere in src/ or examples/ (fixtures only).
- G seams (lane st_01a00561): brief-G's 11 candidate components match real dirs; also present: import/ (4 files, already anchored via spec:carrier.sdp-import), testing/ (1), root ids.ts. Import stack: ids→model→graph/validate/extract→reader/projections→cli; runner/adapters/codegen/notation side branches.
- G friction (lane st_01a00561): pure component: node impossible today (satisfies required by type + extraction + MD-30). Two lawful outcomes only: (1) recorded convention — component:protocol.<seam> satisfies its seam's design Spec (side effect: that Spec gains implemented via the component's satisfies edge); (2) ruled MD-30 amendment. Never convenience.
- G acceptance shape (lane st_01a00561): generated/census/index.md structural sections non-empty (### Component membership rows, fan-in/out counts, no dangling), zero validation findings; census empty-state currently "No structural bindings exist." (census.ts:153-155).
- F inventory (lane st_01a00560): exactly 30 deferred self-hosting families · 68 generated unadopted registrars (generated/registrars.json v1) · 68 contracts 1:1 · 1 adopted registrar total (checkout valid-cart). All 30 families already have authored specTest+bindExample suites (test/self-hosting-*.test.ts).
- F ops per adoption (lane st_01a00560): rewrite suite to five adapters + registerX activation → regenerate → force-add *.test.generated.ts (gitignored by default, .gitignore:19-20) → npm run check green (check:self-hosting --check-clean + preflight byte-compare). No MD-31/runnable-modules change needed.
- F friction on record (lane st_01a00560): multi-Then examples rely on optional `assertions` for non-oracle Thens (comparator only checks Then matching oracle.kind, testing/index.ts:83-85) — the main "without contortion" pressure point; recorded as freeze evidence, NOT reopened. Plan-32 theme-5 gaps all closed in plan 33.
- F tranche evidence (lane st_01a00560): evidence-ranked first cut = model.stable-ids + model.anchors + carrier.slot-notation + validation.duplicate-ids (4 families · 7 registrars · 2-3 suite files); defer gherkin-authoring (13 examples, largest rewrite), extraction.example-runner (meta/contortion risk), consumers.wholesale-view-rewrite (heavy FS worlds) to later tranches.
- H law (lane st_01a00562): inherited never re-decided — determinism, projections confer nothing, wholesale-rewrite publication, settled publish posture (projections-model L16-17, design-review L16-21, census/mermaid/gherkin-view). Candidate readers: context bundle → agent session assembling context from recipes (in-repo, measurable this arc); reference projection → human outside repo; Spec Studio → deferred on @libar-dev/@libar-ai boundary alone until home ruled; structural-edge Mermaid → carried-over candidate (plan 32 forward list). Full deferral with reasons lawful.
- plans/ convention (lane st_01a00562): two layers — briefs index (29, 34: no todos, by rule) and thin execution/close stamps (31 points operational tracking at .omo/plans/arc-keystone-engines.md; 33 compact close record). Current-plan discovery = primary-number regex sort + `> **Status:**` header + AGENTS.md agreement (check-self-hosting-gates.mjs L229-255).
- Plan-35 landing touches 4 surfaces (lane st_01a00562): new plans/35-<slug>.md with valid status header; plan 34 header gains commissioned-plans line; AGENTS.md status blurb names plan 35; pin test test/check-self-hosting-gates.test.ts:79-84 retargeted from 34 to 35.
- Q1 advisory (ultrabrain st_01a00564): G friction → CONVENTION, no contract change. component:protocol.<seam> satisfies its most-specific design Spec; if none honest exists, omit the component (sparse-and-true). Amendment creates a blastRadius coverage blind spot (reader.ts:729-732 treats any-node files as coverage-known). Oracle/test deltas: test/self-hosting-oracle/ split binding-edge vs structural-edge assertions; fixed corpus counts (146 anchors) move.
- Q2 advisory (ultrabrain st_01a00564): E1 bridge → refine recipe 4 ONLY. No reader accessor (filtering nodeType===Primitive is not an irreducible join; freeze bar unmet), no CLI verb, no stdin change (stdin is q's body channel; bindings are a scripted contract). Keep claim-bearing reasons; name it coverageUnknownFiles (they are files, never Specs).
- Q3 advisory (ultrabrain st_01a00564): E2 placement → existing law suffices; FAILS ADR three-part test (not surprising, no new trade-off); record reasoning in plan, no decision Spec. `sdp import` is the write-side precedent under the same CLI. Scaffold contract: `sdp new spec PATH --id --kind --altitude --title --outcome`, readiness always idea, refuse overwrite, reuse emitMarkdownSpec (src/import/emit-markdown.ts:18-24), emit NO empty typed sections (empty Constraints actively refused, markdown-body-owner-sections.ts:66). Watch: separate validate-watch command, serialize runs with one pending rerun, ignore generated/dist/node_modules, inject event source in tests (no sleeps), update runSdpCli async-comment (sdp.ts:89-94).
- Q3 advisory on-ramps (ultrabrain st_01a00564): update specs/consumers/authoring-on-ramp.sdp.md + .agents/skills/sdp-authoring/SKILL.md + package smoke coverage in the same pass.

## Decisions (with rationale)
- D1 one plan 35: ONE execution plan numbered 35 covers the whole arc (E1+E2+E3+F+G+H). Rationale: plan-31 precedent (briefs A–D one plan), plan-34 permits but does not require splitting, the only hard semantic edge (G rows → E1 fan-in) is a wave gate inside one plan. Architect lane st_01a00563 concurs.
- D2 G friction → CONVENTION (default, Wave-0 ruling todo): component:protocol.<seam> satisfies its most-specific design Spec; no MD-30 amendment, no contract delta. If the Wave-0 session finds a seam with no honest Spec target, it omits that component (sparse-and-true) — amendment only via ADR three-part test. Ultrabrain st_01a00564 + architect st_01a00563 concur; amendment also creates a blastRadius coverage blind spot.
- D3 E1 bridge → recipe-only: refine/extend recipe 4 over g.blastRadius; NO reader accessor (freeze bar unmet), NO CLI verb, NO stdin change; git acquisition stays caller-side (plan-09 non-goal). Keep claim-bearing reasons; coverageUnknownFiles naming.
- D4 E2 placement → existing law suffices: `sdp new spec` top-level write verb + `sdp validate --watch` flag; reasoning recorded in plan; NO new decision Spec (fails ADR three-part test; `sdp import` is the write-side precedent). Scaffold emits idea-rung envelope + Intent/outcome only, never empty typed sections, never content.
- D5 F first tranche (planner's selection per plan 34): model.stable-ids, model.anchors, carrier.slot-notation, validation.duplicate-ids (small, low-contortion) + validation.kind-evidence (the one larger pressure family, multi-Then/assertions exercise) = 5 families · 9 registrars. Deferred with reasons: carrier.gherkin-authoring (13, largest rewrite), extraction.example-runner (meta risk), consumers.wholesale-view-rewrite (heavy FS worlds), remainder → later tranches. Refusal per family is a complete outcome; freeze NOT reopened.
- D6 E3 default → recorded non-ruling at D6's bar (all callers are shell sdp:q burst-mode or in-process createReader; no named caller with boundary+contract). Ruling only if evidence meets the bar.
- D7 H default → defer all four candidates with reasons (Spec Studio on @libar-dev/@libar-ai boundary; reference projection has no in-arc consumer; context bundle awaits E1 usage evidence; structural-edge Mermaid would need CodeNode-rooted diagrams — census serves that reader). No new projection ships.
- D8 wave shape (architect): W0 rulings + independent starts (F-tranche ∥ G-ruling ∥ E2-ruling ∥ E1-bridge recipe + commissioning hygiene); W1 engines (G authoring ∥ E2 impl ∥ F tranche); W2 consume+close (E1 census/fan-in recipes after G rows, E3, H); W3 arc close (independent review in plan-32 mold, re-derived measurements, AGENTS/skills/recipes same pass). Max honest start parallelism = 4.
- D9 single-writer map: test/self-hosting-graph.test.ts corpus pins belong to G only; recipes.md new bodies to E1; src/cli/sdp.ts to E2; on-ramp prose (skills/AGENTS) to a dedicated late todo. F must not refresh corpus pins.
- D10 test strategy: repo norm — implementation + test in ONE todo; agent-executed QA (happy+failure) per todo; recipes verified by test/recipes.test.ts verbatim execution; watch tests in solo forks pool with event subscription, no sleeps. npm run check green (twice at arc close).

## Scope IN
- plans/35-<slug>.md commission stamp + plan-34 commissioned-plans line + AGENTS.md status + discovery pin retarget (4 surfaces, lane st_01a00562)
- E1: diff→at-risk bridge recipe, census/fan-in recipes over G's rows, projection-verb recipes; recipes.md + recipes.test.ts + skill on-ramps
- E2: sdp new spec + sdp validate --watch + placement ruling recorded + authoring-on-ramp Spec/skill updates
- E3: MCP amendment attempt ending in ruling or recorded non-ruling
- F: first-tranche per-family adopt/refuse under MD-31 (5 families), each with evidence record
- G: engine component/uses authoring per D2 convention; census structural sections non-empty; corpus pins re-derived
- H: decide/defer record for the four candidates
- Arc close: plan-32-mold independent review, re-derived close measurements, plan-35 status + AGENTS updates

## Scope OUT (Must NOT have)
- plan-34 do-not-reopen list, verbatim: default-carrier flip; Gherkin kind expansion/DocStrings/DataTables/Gherkin Packs; implements slot; frozen registrar interface loosening; O5 engine-side execution; Scenario Outlines; re-specifying shipped projections; bySymbol/impact graph; .sdp.gherkin suffix; new query verbs
- No MCP server implementation (E3 is an amendment ATTEMPT)
- No new projection implementation (H decides/defers only)
- No reader accessor freeze, no sdp impact/diff verb, no stdin plumbing changes
- No MD-30 amendment slipped as convenience; no import-graph dump as uses edges; no free-form tags
- No maturing of the 8 drift-alarm Specs beyond what a session's own work makes true
- No readiness above idea on scaffolded Specs; no content pre-fill in scaffolds
- F does not touch test/self-hosting-graph.test.ts pins; G does not edit test/self-hosting-*.ts suites

## Open questions
- none blocking — all forks carry announced defaults the user can veto at the gate

## Approval gate
status: awaiting-approval
approach: one plan 35, four waves (W0 rulings+starts ∥4, W1 engines, W2 consume+close, W3 arc close), defaults D1-D10 as recorded above
next workflow action: on explicit okay — scaffold plan, run metis gap analysis, append todos, run momus high-accuracy review (review_required: true, 5-round cap), then deliver handoff
