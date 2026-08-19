---
slug: plan-37-settling-arc
status: drafting
intent: clear
review_required: true
plan_path: .omo/plans/plan-37-settling-arc.md
plan_sha256: null
review_round_id: null
review_round_limit: 5
pending-action: write and review .omo/plans/plan-37-settling-arc.md
review:
  momus:
    status: pending
    workspace_root: null
    runtime_home: null
    target: .omo/plans/plan-37-settling-arc.md
    round_id: null
    plan_sha256: null
    launch_id: null
    session: null
    result: null
approach: <fill: the approach you intend to plan>
---

# Draft: plan-37-settling-arc

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
| C1 commissioning hygiene | plan 37 stamped in plans/, plan-36 commissioned-plans line, AGENTS.md blurb | active | plans/36 header |
| C2 brief I registrar tranches | 8 deferred suites each adopted or refused with recorded evidence | active | plans/36 brief I |
| C3 brief J drift-alarm dispositions | 8 Specs each: ratified ready statement or recorded blocking reason | active | plans/36 brief J; recipe 2 output |
| C4 brief K bundle-trigger measurement | measurement definition, evidence, verdict (commission later plan or stand-down) | active | plans/36 brief K; plan-35 H record |
| C5 arc close | ledgers/tables/verdict, re-derived measurements, plan-32-mold independent review, statuses | active | plans/36 "What the arc must leave behind" |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
| plan artifact home | .omo/plans/plan-37-settling-arc.md is THE execution plan; repo plans/37-* is a stamp/pointer (plan-35 pattern) | prior arc did exactly this (plans/35 + .omo/plans/plan-35-agent-surface-arc.md) | yes |
| one plan for the arc | ONE plan 37 covers briefs I+J+K with K sequenced last | ulw-plan: one request one plan; plans/36 allows plural but does not require it | no (structural) |
| test strategy | tests-after, repo norm; implementation+test in one todo; vitest focused runs; npm run check green twice at close | inherited from plan 35 verification strategy | yes |
| wave-gate serialization | plan-35 rule re-applies: generated/-writing and full-tree commands serialized, one runner at a time | plan-32 merge race lesson, restated in plan 35 | yes |

## Findings (cited - path:lines)
Re-measured at planning time (reproduce plans/36 exactly):
- `npm run --silent sdp -- validate . --exclude ...`: 156 specs · 1 pack · 157 anchors → 314 nodes · 660 edges; 0 errors, 0 warnings; recipe 8 confirms {errors:0, warnings:0}.
- Recipe 1: operational backlog EMPTY; 66 ready examples + 31 ready decisions as audited exclusions; zero verifier-less ready examples.
- Recipe 2: the same eight drift-alarm Specs — spec:carrier.markdown-authoring, spec:consumers.projections-model, spec:extraction.claim-taxonomy, spec:extraction.regenerability, spec:model.core-model, spec:model.pack-aggregate, spec:model.relations, spec:model.spec-sections — all stated `defined`, floorReached `ready`, no unmet clause (cheap case).
- bindExample census: 58 across 8 suites — validators 16, carrier-gherkin 13, projections 11, extraction 9, consumers 5, pack-markdown 2, carrier 1, sdp-import 1.
- Plan numbering: 36 keeps its number; execution plans take 37 upward (plans/36 header).
- Prior-arc harness pattern: .omo/plans/plan-35-agent-surface-arc.md exists beside repo plans/35-*.md.

Plan-35 records (extracted, cited to plans/35 lines):
- F ledger (plans/35 L28-40): five families ALL ADOPTED — model.stable-ids (2 suites), model.anchors (2), carrier.slot-notation (2), validation.duplicate-ids (1 dual-carrier), validation.kind-evidence (3). Generated suites named `test/<family>.<example>.test.generated.ts`. Refusal would have been a complete close; none refused.
- Kind-evidence friction (full record: .omo/evidence/task-11-plan-35-agent-surface-arc.md): one-kind comparator vs multi-Then kinds forces different-kind Then params into assertion literals; observe must pick one finding; clause/count ride assertions not first-Then; helpers are factories not shared world; no second product call. Freeze unchanged; friction is evidence for a future ruling.
- Ownership splits (tranche-one settled): different-kind/join-heavy Thens → `assertions`; first-Then fields comparator-owned (slotCount, finding-id); `createWorld` owns materialization (temp roots, corpora, probe graphs); `expected(point)` aligns to generated first-Then Outcome kinds / Partial conditions (the exact phrase "authored expectations derived from generated contracts" is ABSENT from plans/35 — evidence shows the pattern, not the phrase).
- H deferral (plans/35 L78-87): all four deferred. Context bundle trigger EXACT: "Later evidence that agent sessions still hand-assemble the same token-budgeted slice after the E1 recipes, so scripting one body at a time is no longer the honest description. Then commission a later plan. Do not build the bundle inside plan 35." Studio trigger: package-home ruling + unserved reader. Reference projection trigger: named human-outside-repo consumer. Structural-edge Mermaid trigger: named CodeNode-diagram reader + one-generated-view ruling.
- E3 MCP non-ruling (plans/35 L68-76): D6 unchanged; bar = "deferred until a concrete caller establishes its boundary and contract"; failed candidate classes: skills, harness sessions, projection publishers, tests, Studio-class.
- Close (plans/35 L89-124): independent review = nine accepted findings closed + fresh full-delta APPROVE; gate green twice; note discrepancy — task-17 register shows 8 ACCEPT + 1 DO NOT ACCEPT (R2) vs close summary "nine accepted"; plans/35 stamp lineage line still says "plan 33" (stale wording to fix when stamping plan 37).

Brief I machinery (explored, cited):
- Registrar = build-emitted `registerX(adapters)` sibling owning describe/it + step dispatch + 3-way comparator; frozen in spec:extraction.runnable-modules + MD-31 (spec:decisions.adopted-registrars-committed). Five adapters: createWorld (required, materialize world from Partial<Conditions>), invoke (required, single product call), observe (required), expected (required, oracle from point, incomplete -> unspecified), assertions (optional, different-kind/join-heavy Thens via paramsForStep from test/helpers/generated-contract.ts).
- Emitter: src/codegen/contracts.ts (generateContracts, renderRunnableRegistrar); runtime: src/testing/index.ts (RunnableExampleAdapters, registerRunnableExample, compareContractOutcome); low-level bindExample survives in src/adapters/vitest.ts for deferred suites.
- Join-the-committed-set procedure (verified): rewrite authored suite (specTest + registerX + imports + paramsForStep) -> npm run build && npm run generate:self-hosting -> git add -f test/<family.example>.test.generated.ts (gitignored until adopted) -> commit -> check:self-hosting (--check-clean byte compare in src/cli/build-command.ts) + preflight (preflight-registrars.mjs trackedRegistrarDifferences) pass.
- Reference pattern: test/self-hosting-model.test.ts (stable-ids). generated/registrars.json manifest: version 1, 68 owed siblings.
- Deferred-suite map with tranche suggestion: (a) carrier leftovers: pack-markdown 2 (markdown-ts-parity, spec-envelope-refused; high bindability) + sdp-import 1 (round-trip; trivial) + carrier 1 (bounded-parity; split-Then strain like duplicate-ids); (b) validators remainder 16 across 8 families (readiness-floor 2, warn-level-signals 2, referential-integrity 2, authored-honesty 2, claim-separation 2, verification-linkage 2, oracle-target-eligibility 2, pack-coherence 1, two-check-families 1) — kind-evidence pattern already proven in the same file; (c) consumers 5 (agent-surface 2, reader 3; good); (d) extraction 9 (build-pipeline 1, excludes 2, schema-versioning 1, executable-contracts 3, example-runner 2 — example-runner tests the runner itself, strain/refuse candidate); (e) projections 11 (design-review 1, derived-readiness-banner 2, binding-language-views 2, wholesale-view-rewrite 4 — multi-When/byte-identity strain, diagnostic-rendering 2); (f) carrier-gherkin 13 alone (plan-36-mandated own tranche; hardest: one giant shared bindings object, parity Thens, filesystem worlds).

Brief J evidence base (explored, cited):
- All eight: stated defined, floorReached ready, zero unmet clauses; ready floor = 3 kind-blind clauses (all-relations-resolve, depends-on-and-refines-targets-are-defined, anchors-resolve; anchor clause presence-only) in src/validate/readiness-floor.ts + spec:validation.readiness-floor.
- Per-Spec judgment aids: core-model (8-term glossary, parent hub; sibling enrichment-lifecycle still scoped with blocking OQ); pack-aggregate (5 terms, story altitude); relations (8 terms, no decidedBy, no inbound refiners); spec-sections (7 terms, 4 decidedBy — strongest); claim-taxonomy (5 terms, leaf); regenerability (5 rules incl. disposable-rebuild invariant + measured graph-DB deferral); projections-model (11 terms, richest, deliberately left defined at plan-14/35); markdown-authoring (thinnest: 1 behavior rule, but broad child tree + 2 decisions).
- Theme-9 posture (plans/32, restated plans/34+36): "recorded posture, not a retraction" / "enrichment on evidence, never retraction" — promote on evidence or record deliberate sub-ready reason; never demote to silence the alarm.
- spec:model.enrichment-lifecycle itself is scoped with a blocking OQ (post-implementation distillation policy) — NOT one of the eight; context only.

Brief K measurement design (ultrabrain advisory — claims to verify, thresholds are proposals):
- Operational definition: assembly window = first successful `sdp q` recipe invocation until first product mutation/disposition; qualifying hand-assembly episode requires (1) >=2 distinct catalog recipe bodies in one window, (2) visible co-use in one context/rationale/verdict, (3) operator context acquisition (not test/QA runs).
- Skill-mandated chains (sdp-sessions: capture 6->11->9, design 9->7, implement 1->3, review 5/3->8, close 2->4) are corroboration, never trigger evidence by themselves.
- Corpus: this arc's own I/J execution sessions — .omo/senpi-task/tasks/<id>.json manifests + children/<id>/sessions/*.jsonl transcripts + .omo/evidence/ receipts (environment observation, not repo contract; verify layout at measurement time).
- Verdict rule (proposed): corpus adequate at >=6 completed eligible I/J sessions (>=2 per brief); trigger MET needs >=3 qualifying episodes from different tasks sharing a normalized core of >=2 recipe IDs with visible co-use, spanning both briefs or >=50% of a work-shape stratum; any failed conjunct with adequate corpus = unmet; <6 sessions = "not demonstrated; stand down as underpowered", trigger retained.
- Script counts only; co-use adjudication is manual. Report bytes, never estimated tokens. Disqualifiers: recipe test suites, QA-certification runs, failed calls, duplicate/resumed transcripts, quoted-not-run commands, K's own activity.
- Stand-down record must contain: baseline commit + catalog hashes, predeclared definition/thresholds, full task inventory with inclusion/exclusion reasons, per-session table, exact verdict arithmetic, bounded conclusion ("no qualifying repeated slice demonstrated in this corpus"), no-build confirmation.
- Recipe catalog for identity matching: docs/agent-surface/recipes.md sixteen bodies; parameter lines to normalize: recipes 3, 6, 9, 14 (recipe 4 takes filenames from env).

Brief K evidence surface (explored, cited — corrects/refines the advisory above):
- Skills statically instruct sequential chains (sdp-authoring: session-start 1+2, "run recipes 7-11"; sdp-sessions: per-shape chains 6->11->9, 9->7, 1->3->12->13, 3/5->8, 14->15->16, 2->4) — satisfies the "skills instructing sequential recipe chains" clause cheaply. No skill says "assemble a context bundle" or "token budget".
- Recipe 3 is already the one-Spec-in-one-shot payload; NO catalog recipe is a multi-Spec token-budgeted bundle.
- In-repo .omo proxies: boulder.json (work->session_ids), start-work/ledger.jsonl (task events WITH commands[] arrays), evidence/*.md (exact sdp:q invocations in QA write-ups), senpi-task/tasks/*.json (spawn prompts). senpi-task/logs/*.jsonl record tool NAMES only — NOT full sdp:q argv (weak for recipe identity).
- Primary transcripts for this repo: ~/.omo/agent/sessions/--home-darkomijic-dev-libar-software-delivery-protocol--/*.jsonl (message/toolCall records; minable for sdp:q bodies). Repo-local child copies under .omo/senpi-task/children/*/sessions/. Cursor transcripts exist at ~/.cursor/projects/.../agent-transcripts/; Claude/opencode stores ABSENT.
- Blind spots (honest measurement limits): no token-count or bundle-payload records; in-process createReader use invisible to shell grep; mental assembly without tool calls invisible; multi-recipe != stitching without manual adjudication.

## Decisions (with rationale)
- Arc shape: Design 1 (file-owned I tranches, I ∥ J same waves, K last, generate serialized as a queued service) over Design 2 (strictly sequential I->J->K). Plan-36 dependency map names I ∥ J the honest maximum; sequential starves K of mixed-brief evidence and buys safety the wave-gate already provides. [architect lane, verified against plans/36]
- Tranche cuts (write unit = suite FILE, not family): I-0 tracer = carrier.markdown-parser bounded-parity (1 site, in a file with existing register* siblings — teaches beside-existing-adoption); I-1 validators (16/9 families, one file); I-2 Gherkin alone (13, mandated); I-3 projections (11/5 families); I-4 extraction (9/5 families; executable-contracts is second-product-call refuse suspect); I-5 tails: pack-markdown 2 ∥ consumers 5 ∥ sdp-import 1.
- Per-family ledger rows inside multi-family files; refuse is complete; all-58-adopt is NOT the success criterion (plans/36).
- Wave-gate extended: `sdp build` (registrar emitter, src/cli/build-command.ts) joins the serialized set alongside generate:self-hosting/check/preflight; per-todo acceptance = focused vitest + queued regen, NOT full npm run check (one per wave boundary).
- recipes.md frozen for the whole arc (it is K's measurement baseline).
- K split: define the measurement early (W0/W1, so I/J sessions know what is counted); gather + verdict last (W3). Definition frozen BEFORE examining results.
- K corpus: this arc's own I/J execution sessions; sources = ~/.omo/agent/sessions/<ws>/*.jsonl transcripts + .omo/start-work/ledger.jsonl commands[] + .omo/evidence/*.md; script counts, human-adjudicable co-use; verdict rule per ultrabrain proposal (>=6 eligible sessions, >=3 qualifying episodes, >=2 shared recipe IDs, cross-brief or >=50% stratum prevalence; underpowered => stand-down retaining trigger).

## Scope IN
- Commission plan 37: repo plans/37-*.md stamp (EXECUTING, pointer to harness plan), plans/36 commissioned-plans line, AGENTS.md status blurb, discovery pin retarget in test/check-self-hosting-gates.test.ts (currently `number: 36`).
- Brief I: six tranches over 8 authored suites / 58 deferred bindExample sites; per-family ADOPT/REFUSE ledger; freeze-friction record accumulation.
- Brief J: 8 drift-alarm Specs — recipe-9 preflight + evidence packet + prepared one-rung carrier diff + oracle descriptor update per family group; owner ratifies; per-Spec disposition table.
- Brief K: measurement definition (frozen pre-results), read-only counter scripts over transcripts/ledger/evidence, verdict (commission later plan number OR recorded stand-down).
- Arc close: I ledger + J table + K verdict in plans/37, re-derived close measurements labeled re-derived, plan-32-mold independent review, statuses + AGENTS.md same pass, npm run check green twice.

## Scope OUT (Must NOT have)
- plans/36 do-not-reopen list verbatim (carrier flip; Gherkin expansion; implements slot; registrar freeze loosening; O5; re-specced projections; bySymbol/impact graph; .sdp.gherkin suffix; query verbs; E2 placement; E3 + 3 event-triggered H deferrals).
- No bundle implementation / no new projection / no new query verb / no reader accessor under ANY K outcome.
- No validator, floor, or check changes (J boundary); no readiness edits without owner ratification; no Spec demotion (theme 9).
- No edits to: recipes.md (frozen K baseline), test/helpers/generated-contract.ts (frozen shared helper), test/helpers/extract-corpus.ts (callable, not editable), already-tracked tranche-one registrars, corpus count pins in test/self-hosting-graph.test.ts.
- No content invented to reach a rung; no per-family adoption that authors a suite only to justify adoption.

## Open questions
1. J ratification cadence (owner-decision): one batch checkpoint of all eight evidence packets (recommended) vs per-family batches as lanes complete vs all-at-close.

## Approval gate
status: awaiting-approval
approach: one plan 37 covering briefs I+J+K; Design 1 waves (W0 commission+tracer+J-preflight, W1 heavy I lanes + J model/extraction, W2 remaining I + J consumers/carrier, W3 K then sequential close incl. plan-32-mold review); file-owned single-writer map; extended wave-gate serialization incl. sdp build; K defined early, gathered last.
next workflow action: write and review .omo/plans/plan-37-settling-arc.md (momus review default-on).
