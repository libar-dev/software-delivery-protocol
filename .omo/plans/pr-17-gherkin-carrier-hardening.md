# pr-17-gherkin-carrier-hardening - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** A merge-ready Gherkin carrier whose canonical files cannot be mistaken for Cucumber tests, whose diagnostics point at the real source, and whose closed grammar refuses invalid examples without hiding sibling errors.

**Why this approach:** The canonical suffix becomes `.sdp.gherkin` now, before external adoption makes a rename permanently expensive. The ruling records the unavoidable trade-off between Cucumber-glob safety and default editor recognition, while parser hardening stays inside the existing one-graph carrier boundary.

**What it will NOT do:** It will not broaden Gherkin to new Spec kinds, add rich Gherkin bodies, run Cucumber, accept both suffixes, or begin any other plan-29 brief.

**Effort:** Large
**Risk:** Medium - the suffix migration changes frozen graph paths while multi-finding parsing changes control flow inside a 976-line reifier.
**Decisions to sanity-check:** `.sdp.gherkin` is canonical; bare `.feature` is not discovered; a dedicated decision record captures the suffix/tooling trade-off; narrative syntax remains closed until brief A.

Your next move: Run `/start-work pr-17-gherkin-carrier-hardening --worktree <absolute-path>` after the high-accuracy review passes. Full execution detail follows below.

---

> TL;DR (machine): Large, medium-risk plan 30 atomically establishes `.sdp.gherkin`, hardens locations/tags/empty scenarios/multi-findings, updates intended truth and frozen oracles, and closes PR #17 through the full green gate.

## Scope
### Must have
- Add a born-ready decision Spec for the canonical `.sdp.gherkin` suffix; register it as the next MD entry, relate it to the suffix and Gherkin carrier decisions, and state the collision-safety versus editor-tooling trade-off.
- Rename the canonical Gherkin carrier suffix atomically across discovery, extractor routing, CLI empty-corpus diagnostics, suffix predicates, copy/ignore rules, one live reader family, defused fixtures, tests, documentation, skills, editor association, generated artifacts, and frozen graph oracles.
- Preserve suffix-only discovery: ordinary `.feature` files are not canonical carriers and `.sdp.gherkin` files are; no content sniffing and no dual-suffix window.
- Report description grammar findings at their exact physical LF/CRLF source line despite parser-elided blanks and comments.
- Scale reserved-head similarity by candidate length, name authored and reserved heads correctly, and keep accepted decoration tags graph-inert.
- Refuse step-less ordinary and `@example-space` Scenarios at the Scenario line without adding a complete-GWT rule.
- Preserve and clearly document the closed description classification rather than loosening rich prose ahead of plan 29 brief A.
- Accumulate independent semantic Gherkin findings deterministically, cap output at 100, and exclude the entire invalid carrier from the graph while healthy sibling files survive.
- Add ready executable example Specs, defused corpora, generated contracts, anchors, Pack membership, and frozen oracle updates for the new guarantees.
- Restore the warning-oracle rationale, document exact runtime parser pins, repair all known declined-Gherkin drift, and make plan 29 brief A explicitly consume plan 30's suffix.
- Finish with LSP diagnostics, focused tests, graph queries, build/type checks, real CLI happy/failure/help QA, and `npm run check`.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- No plan 29 brief-A universality ruling, default-carrier flip, new Spec kinds, rich Markdown/Gherkin bodies, doc strings, data tables, derived runnable modules, projections, structural anchors, or MCP work.
- No `.feature` compatibility shim, `.sdp.feature`, content-gated discovery, path caste, opt-in carrier configuration, or second family migration for dogfooding.
- No Cucumber execution path, tag autocorrection/persistence, parallel tag registry, authored delivery facts, new claim path, workflow gate, or runner state in the graph.
- No handwritten structural Gherkin parser, approximate source lines, complete-GWT/phase-cardinality expansion, empty-contract workaround, partial graph insertion, lazy parser architecture, or new validator family.
- No modification or reversal of unrelated user/agent changes; stop and surface a direct conflict.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: TDD with Vitest plus self-hosted generated contracts; each behavioral todo first adds a focused regression that fails for the reviewed defect, then implements the smallest passing change.
- Evidence: `<attemptDir>/task-<N>-pr-17-gherkin-carrier-hardening.log` (where `attemptDir` is the active ulw-loop attempt directory; outside ulw-loop use `.omo/evidence/`).
- Mutation probes are temporary QA actions, never committed changes: restore old arithmetic/threshold/early-return behavior, observe the named test fail, then restore the implementation and rerun once green.
- Pure prose is reviewed through the derived graph and shipped-copy equality where applicable; no tests pin wording.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.
- **Wave 1 — Ruling and red seams (Todos 1-4):** land the durable suffix ruling and independent failing test/fixture contracts for suffix discovery, source locations, and closed grammar. Todo 1 fixes the public decision before any representation changes; Todos 2-4 then proceed in parallel.
- **Wave 2 — Engine hardening (Todos 5-8):** implement the atomic suffix migration, physical source alignment, grammar ergonomics, and bounded multi-finding collector in parallel where files do not overlap; serialize edits to `src/extract/gherkin.ts` through Todos 6 → 7 → 8.
- **Wave 3 — Carrying truth and projections (Todos 9-12):** bind the new executable examples, update author guidance/editor settings, repair tracked drift and plan-29 sequencing, then regenerate frozen artifacts/oracles.
- **Wave 4 — Close (Todo 13):** run diagnostics, focused/full gates, graph queries, built-CLI manual QA, and repository cleanliness checks.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | — | 5, 9, 11 | 2, 3, 4 |
| 2 | — | 5 | 1, 3, 4 |
| 3 | — | 6 | 1, 2, 4 |
| 4 | — | 7, 8 | 1, 2, 3 |
| 5 | 1, 2 | 9, 10, 12 | 6 |
| 6 | 3 | 7 | 5 |
| 7 | 4, 6 | 8 | 5 |
| 8 | 4, 7 | 9 | 5 |
| 9 | 1, 5, 8 | 12 | 10, 11 |
| 10 | 5 | 12 | 9, 11 |
| 11 | 1 | 12 | 9, 10 |
| 12 | 5, 9, 10, 11 | 13 | — |
| 13 | 6, 7, 8, 12 | F1-F4 | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Ratify the collision-safe Gherkin suffix
  What to do / Must NOT do: Author a born-ready decision Spec selecting `.sdp.gherkin`; record that `.feature` preserves default Gherkin tooling but collides with Cucumber runner globs, while `.sdp.gherkin` trades default editor recognition for safe canonical discovery. Relate it to `spec:decisions.sdp-ts-extension` and `spec:decisions.gherkin-carrier-option`, add it to `pack:self-hosting-v1`, register the next MD number, and update the MD-15/MD-27 glosses without rewriting their original choices. State bare `.feature` as non-canonical/import-source territory. Must not decide brief-A kind coverage/default-carrier questions.
  Parallelization: Wave 1 | Blocked by: none | Blocks: 5, 9, 11
  References (executor has NO interview context - be exhaustive): `specs/decisions/sdp-ts-extension.sdp.md:9-18`; `specs/decisions/gherkin-carrier-option.sdp.md:9-21`; `specs/decisions/carrier-ruling.sdp.md`; `docs/concept/DECISIONS.md:12-38`; `specs/self-hosting.pack.sdp.md`; `CONTEXT.md` carrier-extension entries.
  Acceptance criteria (agent-executable): `npm run --silent sdp:q -- 'return g.specs().filter((s) => s.title.toLowerCase().includes("gherkin") && s.specKind === "decision").map((s) => ({id:s.id, readiness:s.statedReadiness, packs:s.packs}))' --json` exits 0 and returns the new decision at `ready` in `pack:self-hosting-v1`; `npm run build && npm run typecheck` exits 0.
  QA scenarios (name the exact tool + invocation): Happy — query the new decision and its declared relations through `npm run --silent sdp:q -- '<body>' --json`; failure — temporarily remove one required decision field and run `npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`, observing a nonzero conformance result, then restore it. Evidence `<attemptDir>/task-1-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `writing` — intended-truth and registry work with a bounded graph verification surface.
  Commit: N | User did not authorize commits.

- [x] 2. Lock suffix discovery with failing tests
  What to do / Must NOT do: Before changing discovery, add tests proving `.sdp.gherkin` is discovered/routed/copied and ordinary `.feature` is ignored, including the empty-corpus diagnostic and the code-level `finding.file` suffix predicate. Include an ordinary Cucumber Feature lacking Protocol tags to prove it does not poison extraction. Must not content-sniff or add dual recognition.
  Parallelization: Wave 1 | Blocked by: none | Blocks: 5
  References (executor has NO interview context - be exhaustive): `src/extract/discover.ts:4-5,92-95,133-149`; `src/extract/index.ts:187-195`; `src/cli/build-command.ts:116-124`; `test/extract.test.ts`; `test/cli.test.ts`; `test/helpers/extract-corpus.ts`.
  Acceptance criteria (agent-executable): the new focused discovery/CLI tests fail against current bare-`.feature` behavior for the expected suffix reason, then later pass via `npx vitest run test/extract.test.ts test/cli.test.ts`.
  QA scenarios (name the exact tool + invocation): Happy — materialize one `.sdp.gherkin` carrier plus an unrelated `.feature` and assert only the former enters `specFiles`; failure — use a root containing only ordinary `.feature` and assert the built CLI reports the authored model empty rather than a missing-identity error. Evidence `<attemptDir>/task-2-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `unspecified-high` — cross-module behavior test spanning discovery and CLI diagnostics.
  Commit: N | User did not authorize commits.

- [x] 3. Lock physical description locations with fixtures
  What to do / Must NOT do: Add failing unit and defused-corpus tests for Feature and Scenario bad description keys after leading blanks/comments, an interior comment, Rule description, `@example-space` description, and CRLF parity. Exact assertions must use physical one-based lines; do not accept `line > 0`.
  Parallelization: Wave 1 | Blocked by: none | Blocks: 6
  References (executor has NO interview context - be exhaustive): `src/extract/gherkin.ts:385-479,695-727,762-831`; `test/gherkin-reifier.test.ts:24-35,254-336`; `test/fixtures/gherkin/`; `test/helpers/extract-corpus.ts`; `test/self-hosting-carrier-gherkin.test.ts:97-116`.
  Acceptance criteria (agent-executable): the new exact-line tests fail against current `keyword line + index` behavior for the intended mismatch and preserve existing parser-syntax line assertions.
  QA scenarios (name the exact tool + invocation): Happy — run `npx vitest run test/gherkin-reifier.test.ts` after implementation and observe exact LF/CRLF lines; failure — temporarily restore `feature.location.line + 1`/`scenario.location.line + 1` arithmetic and observe the named location test fail, then restore. Evidence `<attemptDir>/task-3-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `unspecified-high` — precise parser-location regression design across multiple constructs.
  Commit: N | User did not authorize commits.

- [x] 4. Lock closed-grammar and multi-finding regressions
  What to do / Must NOT do: Add failing tests for unique reserved-head suggestions, harmless distance-two short decoration tags, one-edit short-head refusal, step-less ordinary and `@example-space` Scenarios, a Feature with zero Scenarios, one-Given acceptance, exact narrative classification, four ordered semantic findings, repeated invalid derivation determinism, the 100-finding cap, whole-file exclusion, and healthy sibling survival. Keep narrative closed; do not test prose wording.
  Parallelization: Wave 1 | Blocked by: none | Blocks: 7, 8
  References (executor has NO interview context - be exhaustive): `src/extract/gherkin.ts:76-89,117-239,385-645,744-798`; `src/extract/markdown-support.ts:19-48`; `test/gherkin-reifier.test.ts:20-35,203-329`; `test/gherkin-parity.test.ts`; `test/fixtures/gherkin/`.
  Acceptance criteria (agent-executable): new tests fail against current global distance-2, empty-step acceptance, and first-finding behavior for the named reasons; existing parity tests remain green where unaffected.
  QA scenarios (name the exact tool + invocation): Happy — `npx vitest run test/gherkin-reifier.test.ts test/gherkin-parity.test.ts`; failure — individually restore the distance-2 threshold, remove the zero-step guard, and restore one early return, observing each targeted test fail before restoring. Evidence `<attemptDir>/task-4-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `deep` — intertwined semantic diagnostics and all-or-nothing graph invariants need careful regression design.
  Commit: N | User did not authorize commits.

- [x] 5. Migrate canonical files to `.sdp.gherkin`
  What to do / Must NOT do: Replace bare `.feature` with `.sdp.gherkin` in suffix discovery, extractor routing, code-level finding predicates, CLI empty-corpus note/help, suffix copy logic, `.prettierignore`, one live reader family, defused fixtures, tests, docs, examples, and shipped skills. Add a repository editor association mapping `*.sdp.gherkin` to Gherkin and document how consumers configure equivalent support. Rename frozen-path inputs atomically. Do not recognize both suffixes or use `.sdp.feature`.
  Parallelization: Wave 2 | Blocked by: 1, 2 | Blocks: 9, 10, 12
  References (executor has NO interview context - be exhaustive): `src/extract/discover.ts:4-5,148-149`; `src/extract/index.ts:187-195`; `src/cli/build-command.ts:116-124`; `.prettierignore:26-29`; `specs/consumers/reader.feature`; `test/fixtures/gherkin/`; `test/helpers/extract-corpus.ts`; `README.md`; `.agents/skills/sdp-authoring/SKILL.md:77-98`; `.vscode/settings.json` if present, otherwise create only that conventional association file.
  Acceptance criteria (agent-executable): `npx vitest run test/extract.test.ts test/cli.test.ts test/gherkin-parity.test.ts test/gherkin-reifier.test.ts` exits 0; a repository text inventory finds no canonical/discovery/help reference to bare `.feature` outside explicitly named import, history, lineage, review, or collision-rationale contexts.
  QA scenarios (name the exact tool + invocation): Happy — run the built CLI against a temp root containing a valid `.sdp.gherkin` and ordinary `.feature`, observing one Spec and zero findings; failure — rename only the canonical file to `.feature` in the temp root and observe the model is empty, then add malformed `.sdp.gherkin` and observe a source-located grammar error. Evidence `<attemptDir>/task-5-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `unspecified-high` — atomic public-surface migration across code, fixtures, docs, and config.
  Commit: N | User did not authorize commits.

- [x] 6. Align AST descriptions to physical source lines
  What to do / Must NOT do: Build one private source index from physical lines and official parser comment locations. Align AST description entries monotonically and exactly, skipping only whitespace/comment lines; pass located lines into description parsing and use the first located prose line for Rule/pseudo-scenario refusals. On nonblank mismatch or EOF emit one `extract/gherkin-syntax` finding and exclude the file. Do not parse Gherkin structure from raw text or alter valid graph bytes/identity-tag lines.
  Parallelization: Wave 2 | Blocked by: 3 | Blocks: 7
  References (executor has NO interview context - be exhaustive): `src/extract/gherkin.ts:1-16,385-479,695-727,762-831,807-976`; pinned `@cucumber/gherkin`/`@cucumber/messages` types; tests from Todo 3.
  Acceptance criteria (agent-executable): `npx vitest run test/gherkin-reifier.test.ts test/gherkin-parity.test.ts` exits 0; exact LF and CRLF locations pass; serialized valid graph/contracts remain byte-identical to their twins.
  QA scenarios (name the exact tool + invocation): Happy — use the test driver on Feature/Scenario/Rule/pseudo descriptions separated by blanks/comments; failure — inject a source/AST alignment mismatch through a focused test seam and assert `extract/gherkin-syntax` plus zero Specs. Evidence `<attemptDir>/task-6-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `ultrabrain` — exact monotonic parser/source reconciliation with honesty-sensitive failure semantics.
  Commit: N | User did not authorize commits.

- [x] 7. Harden decoration and empty-scenario grammar
  What to do / Must NOT do: Use distance 1 for reserved candidates of length five or fewer and distance 2 for longer candidates; suggest only a unique nearest lawful form, name authored/reserved heads, omit illegal recommendations for `kind`/`pack`/`supersedes`, and keep decorations inert. Refuse zero-step ordinary and pseudo-scenarios at the Scenario line after outline checks. Preserve Features without Scenarios and single lawful steps. Keep exact fact/claim/lifecycle refusals unchanged.
  Parallelization: Wave 2 | Blocked by: 4, 6 | Blocks: 8
  References (executor has NO interview context - be exhaustive): `src/extract/gherkin.ts:117-239,497-706,744-798`; tests from Todo 4; `specs/carrier/gherkin-authoring.sdp.md:17-24`.
  Acceptance criteria (agent-executable): `npx vitest run test/gherkin-reifier.test.ts test/gherkin-parity.test.ts` exits 0 and proves accepted decorations serialize identically to undecorated input; no empty example/space reaches the graph.
  QA scenarios (name the exact tool + invocation): Happy — assert `@kindle.ci`/`@paced` are inert and a one-Given Scenario reifies; failure — assert `@readines.ready`, `@king.dom`, `@packs.nightly`, and comments-only/empty Scenarios refuse at exact lines. Evidence `<attemptDir>/task-7-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `deep` — coupled grammar ergonomics with false-positive and graph-erasure boundaries.
  Commit: N | User did not authorize commits.

- [x] 8. Accumulate bounded semantic findings safely
  What to do / Must NOT do: Refactor semantic helpers to append findings while tracking locally valid values. Normalize all official parser errors then stop; retain file-level gates for missing Feature, non-English input, and source-alignment failure. Traverse independent feature metadata, description lines, direct children, Backgrounds, and Rules in physical order; avoid missing-field cascades for malformed authored fields; cap at 100 with the final suppression finding. If any semantic finding exists, return no Specs/Packs from that file. Do not reinterpret Rule-nested Scenarios.
  Parallelization: Wave 2 | Blocked by: 4, 7 | Blocks: 9
  References (executor has NO interview context - be exhaustive): `src/extract/gherkin.ts:242-976`; `src/extract/markdown-support.ts:19-48`; `src/extract/index.ts:187-195`; tests from Todo 4.
  Acceptance criteria (agent-executable): `npx vitest run test/gherkin-reifier.test.ts test/gherkin-parity.test.ts` exits 0; four errors return in exact source order; repeated runs return equal findings; cap is exactly 100; invalid carrier contributes zero nodes/edges while healthy sibling survives.
  QA scenarios (name the exact tool + invocation): Happy — materialize a corpus containing one multi-error carrier and one healthy sibling, asserting ordered findings and the sibling node; failure — temporarily return accumulated partial specs and observe the zero-node/zero-edge regression fail, then restore. Evidence `<attemptDir>/task-8-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `ultrabrain` — high-risk control-flow refactor with deterministic accumulation and no-partial-graph guarantees.
  Commit: N | User did not authorize commits.

- [x] 9. Extend self-hosted executable carrier evidence
  What to do / Must NOT do: Update `spec:carrier.gherkin-authoring` with `.sdp.gherkin`, exact description classification, zero-step refusal, source-location honesty, and bounded whole-file diagnostics. Add ready example Specs and defused corpora for description-location refusal, step-less Scenario refusal, and multiple findings; reuse the existing example-space vocabulary, generated contracts, `specTest` anchors, and `bindExample` harness. Add all new examples to the self-hosting Pack. Do not invent a separate Gherkin test runner or pin prose.
  Parallelization: Wave 3 | Blocked by: 1, 5, 8 | Blocks: 12
  References (executor has NO interview context - be exhaustive): `specs/carrier/gherkin-authoring.sdp.md:11-44`; sibling `specs/carrier/gherkin-authoring.*.sdp.md`; `test/fixtures/gherkin/`; `test/self-hosting-carrier-gherkin.test.ts:7-311`; `specs/self-hosting.pack.sdp.md`; `generated/contracts/`.
  Acceptance criteria (agent-executable): `npm run generate:self-hosting && npx vitest run test/self-hosting-carrier-gherkin.test.ts` exits 0; graph queries show every new ready example has `has-verifier`; no test snapshots documentation prose.
  QA scenarios (name the exact tool + invocation): Happy — run all bound carrier contracts and assert exact line/count/exclusion outcomes; failure — mutate each reviewed behavior once (old line arithmetic, no zero-step guard, first-finding return) and observe its named bound example fail, then restore. Evidence `<attemptDir>/task-9-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `unspecified-high` — multi-file self-hosted Spec, fixture, generated-contract, and binding work.
  Commit: N | User did not authorize commits.

- [x] 10. Publish suffix tooling and dependency guidance
  What to do / Must NOT do: Update README/concept/authoring skill guidance to use `.sdp.gherkin`, state that it is not a Cucumber execution suffix, explain editor file association for Gherkin highlighting/formatting, and document that the exact Cucumber parser/message pins are runtime dependencies installed for Markdown-only consumers. Update shipped-skill equality fixtures if present. Do not promise lazy loading or imply `.feature` is canonical.
  Parallelization: Wave 3 | Blocked by: 5 | Blocks: 12
  References (executor has NO interview context - be exhaustive): `README.md`; `docs/concept/04-authoring-and-binding.md`; `.agents/skills/sdp-authoring/SKILL.md:77-98`; `package.json` dependency entries; `test/skills.test.ts`; editor association from Todo 5.
  Acceptance criteria (agent-executable): `npx vitest run test/skills.test.ts` and the repository format/type checks covering changed assets exit 0; the built package contains the updated shipped skill bytes.
  QA scenarios (name the exact tool + invocation): Happy — follow the documented suffix through the built CLI and verify editor association syntax parses as JSON; failure — place a bare ordinary `.feature` beside a canonical carrier and verify docs-predicted discovery behavior via the CLI. Evidence `<attemptDir>/task-10-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `writing` — public authoring/tooling guidance coupled to shipped-copy verification.
  Commit: N | User did not authorize commits.

- [x] 11. Repair Gherkin history drift and arc sequencing
  What to do / Must NOT do: Repair every known blanket “Gherkin declined” statement in the roadmap and the carrier-ruling intended truth against MD-27; restore the non-obvious `expectedWarnings = []` rationale; update plan 29 brief A with one line that plan 30 settled `.sdp.gherkin` and brief A consumes it. Keep brief A’s kind/rich-content/default questions open and do not rewrite historical lineage/review evidence.
  Parallelization: Wave 3 | Blocked by: 1 | Blocks: 12
  References (executor has NO interview context - be exhaustive): `docs/concept/07-mvp-roadmap-and-open-questions.md:45,57,76`; `specs/decisions/carrier-ruling.sdp.md`; `plans/29-universal-carrier-annotations-and-agent-surface-briefs.md:30-36,54-115,261-265`; `test/self-hosting-oracle/index.ts:52`; `docs/lineage/`; `reviews/14-executable-verification-design-review.md`.
  Acceptance criteria (agent-executable): graph validation exits 0; temporal checks remain green; plan 29 still states brief A as the owner of kind coverage/rich content/default flip and explicitly names plan 30's settled suffix.
  QA scenarios (name the exact tool + invocation): Happy — run `npm run check:temporal` and the full-corpus validate command; failure — review every remaining “Gherkin declined” match and classify it as lawful history/import context or fix current-intent drift, recording the inventory in evidence. Evidence `<attemptDir>/task-11-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `writing` — bounded intended-truth and planning-index reconciliation.
  Commit: N | User did not authorize commits.

- [x] 12. Regenerate frozen graph and contract projections
  What to do / Must NOT do: Regenerate self-hosting contracts and views only after source truth, suffix migration, examples, skill, and drift updates settle. Update frozen oracle Spec rows, file fields, relations, Pack membership, counts, readiness distribution, anchors, and expected generated files from derivation rather than hand-maintained assumptions. Ensure reader contract bytes remain semantically unchanged aside from carrier path metadata and newly added examples.
  Parallelization: Wave 3 | Blocked by: 5, 9, 10, 11 | Blocks: 13
  References (executor has NO interview context - be exhaustive): `test/self-hosting-oracle/consumers.ts:146-149,672-739`; `test/self-hosting-oracle/carrier.ts:29-370`; `test/self-hosting-oracle/decisions.ts:108-135,724-750`; `test/self-hosting-oracle/index.ts`; `test/self-hosting-oracle/pack-members.ts`; `generated/contracts/`; package generation scripts.
  Acceptance criteria (agent-executable): `npm run generate:self-hosting && npm run generate:example && npm run check:self-hosting-gates && npm run check:self-hosting && npm run check:example` exits 0 twice without a second-run diff.
  QA scenarios (name the exact tool + invocation): Happy — compare two consecutive generated outputs and assert byte identity; failure — temporarily retain one `reader.feature` frozen path and observe the self-hosting oracle fail, then restore the derived `.sdp.gherkin` value. Evidence `<attemptDir>/task-12-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `unspecified-high` — load-bearing frozen graph/oracle regeneration across many derived files.
  Commit: N | User did not authorize commits.

- [x] 13. Prove PR-ready behavior through every surface
  What to do / Must NOT do: Run diagnostics on changed TypeScript and project scope, focused suites once reliably, build/type checks, graph backlog/verifier queries, full validation, built CLI `--help`, happy extraction, ignored ordinary `.feature`, malformed `.sdp.gherkin`, deterministic rerun, and finally `npm run check`. Inspect `git status --short` and the diff without modifying unrelated files. Fix only regressions caused by this plan.
  Parallelization: Wave 4 | Blocked by: 6, 7, 8, 12 | Blocks: F1-F4
  References (executor has NO interview context - be exhaustive): `AGENTS.md` green gate and graph recipes; `package.json` scripts; `docs/agent-surface/recipes.md`; changed paths from Todos 1-12.
  Acceptance criteria (agent-executable): LSP diagnostics report zero errors on changed TypeScript/project scope; `npx vitest run test/gherkin-reifier.test.ts test/gherkin-parity.test.ts test/self-hosting-carrier-gherkin.test.ts test/extract.test.ts test/cli.test.ts test/skills.test.ts` exits 0; `npm run build && npm run typecheck && npm run typecheck:examples` exits 0; full-corpus validate reports zero errors/warnings; `npm run check` exits 0.
  QA scenarios (name the exact tool + invocation): Happy — invoke built `sdp --help`, validate a temp `.sdp.gherkin` corpus, and run the affected reader contract; failure — validate a temp ordinary `.feature`-only root (empty model) and malformed `.sdp.gherkin` root (source-located nonzero error), recording stdout/stderr/exit codes. Evidence `<attemptDir>/task-13-pr-17-gherkin-carrier-hardening.log`.
  Recommended task executor category: `deep` — cross-cutting close requires diagnostics, graph evidence, full gate, and real CLI usage.
  Commit: N | User did not authorize commits.

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit
  Verify every Must-have and Must-NOT-have against the final diff and evidence ledger; reject missing decision/trade-off records, suffix residues, unbound examples, or unverified claims.
  Recommended task executor category: `unspecified-high`.
- [x] F2. Code quality review
  Review source indexing, similarity matching, collector ordering/cap/cascade control, error taxonomy, strict types, determinism, and no-partial-graph behavior; require zero LSP errors and no unrelated cleanup.
  Recommended task executor category: `unspecified-high`.
- [x] F3. Real manual QA
  Independently rerun built-CLI help, valid `.sdp.gherkin`, ordinary `.feature`-only, malformed carrier, reader contract, and repeat-derivation scenarios; approve only from captured real outputs.
  Recommended task executor category: `unspecified-high`.
- [x] F4. Scope fidelity
  Compare the final diff with PR review findings 1-6 and plan-29 boundaries; reject any universality/default-kind/rich-content/Cucumber-runtime or second-family expansion.
  Recommended task executor category: `unspecified-high`.

## Commit strategy
- No commits are authorized by this plan. Keep changes unstaged unless the user separately requests commits.
- If commit authorization arrives during execution, use small verified increments in repository convention: decision/suffix ruling; atomic suffix migration; location hardening; grammar/collector hardening; self-hosted evidence/docs/oracles; final close.
- Never mix unrelated workspace changes into an authorized commit.

## Success criteria
- `.sdp.gherkin` is the only canonical discovered Gherkin suffix; ordinary `.feature` neither poisons SDP extraction nor causes a Protocol carrier to match default Cucumber `*.feature` globs.
- The new decision record and guidance state both collision safety and lost default editor tooling, with a working repository association.
- Every reviewed diagnostic points to the true physical source; reserved-head suggestions are bounded and truthful; empty Scenarios fail loudly; narrative classification is explicit; independent findings accumulate deterministically without partial graph leakage.
- Every new ready example resolves through an anchored verifier; generated graph/contracts/oracles are deterministic and clean.
- Known current-intent Gherkin drift is repaired while plan 29 brief A remains open and explicitly builds on plan 30.
- Focused tests, type/build checks, full graph validation, CLI manual QA, `npm run check`, and all four final reviewers approve.
