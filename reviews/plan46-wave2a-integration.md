# Plan 46 wave 2a integration

Integrated on `lane/46-integrate-2a` from `2f2611c3eaf6cecc183e1e912303941271ee9745`.
This closes integration of these seven build lanes only. Plan 46 remains executing.
Each lane was reviewed by Opus 5.5 and fixed before integration. Nothing was pushed.

| Order | Lane | Reviewed and fixed lane head | Merge commit |
| --- | --- | --- | --- |
| 1 | G | `bf3cb7f` | `d9607a4` |
| 2 | K | `fe8c53c` | `d1ca4f8` |
| 3 | R1 | `2be724c` | `4fdb60c` |
| 4 | D | `604c743` | `40c387c` |
| 5 | R23 | `096b38b` | `6a044f9` |
| 6 | BQ | `30eeabc` | `0cfc7a5` |
| 7 | S1 | `08e699d` | `4d4e7a4` |

## Conflict resolutions

The table accounts for every file-level conflict in every merge, 44 in all. G merged without
conflicts. Existing tests and each incoming lane's tests remain. Where lanes changed the same
function, both diffs were read against the integration base before combining them.

| File | Conflicting merges | Both sides' intent and the result |
| --- | --- | --- |
| `contract-dependent-suites.mjs` | R1, D, R23, BQ, S1 | Earlier lanes registered their adopted registrars and suites; each incoming lane registered more. Kept their union so every contract-dependent suite remains subject to generation checks. |
| `docs/agent-surface/recipes.md` | R23, BQ, S1 | D supplied recipe 51; R23 supplied 50; BQ supplied 46 and bundle parts; S1 supplied 44 and architecture fields. Kept every body and index row, in numeric order. Recipe 36 combines BQ's parts with K's term addresses, physical lines and intact key maps. Recipes 25 and 38 retain K's term support. |
| `src/cli/sdp.ts` | R23 | R1 expanded help to five bindings and named-file watching; R23 moved help to a shared module and added generate and per-verb dispatch. Kept R23's structure and moved R1's help paragraphs into `src/cli/help.ts`. |
| `src/cli/studio-command.ts` | S1 | R23 prepared publication before the shared build and preserved the invoking verb in diagnostics; S1 made data assembly asynchronous. Publication preparation now returns an async publisher. Studio and generate await it, retaining prior-tree checks, cleanup, and generate-prefixed diagnostics. |
| `src/codegen/contracts.ts` | S1 | K keyed vocabulary, steps, outcomes and registrars and withheld conflicting contracts; S1 moved common decoding into notation. Moved K's vocabulary helpers and finding ids into `src/notation/example-space.ts`, retained its withholding set, and kept keyed rendering and dispatch in codegen. Incomplete points remain in space contracts while coverage admits complete examples only. Added the moved decoder to the step-key satisfying set. |
| `src/reader/reader.ts` | S1 | D added citations and shared address resolution; S1 added decoded example-space contexts. Kept both imports and joins, alongside K's term-aware content and locations. |
| `src/validate/validators.ts` | D | K added term resolution and term source lines; D replaced duplicate address logic with the shared resolver. Used D's resolver, which explicitly resolves terms, and retained K's metadata exclusions and mention locations. G's superseded-decision validator remains registered and active. |
| `test/cli.test.ts` | K, D, R23, BQ, S1 | Each lane removed the gaps for newly bound verifiers. Added the independent reductions from the base; the final expected warning count is 29. |
| `test/recipes.test.ts` | K, D, R23, BQ, S1 | G moved and expanded register bindings; K added term realization; D and R23 extended parameter tests; BQ introduced a teaching exemption; S1 added recipe tests. Kept one register anchor with all targets, both fallback checks, every test, and full catalog teaching coverage. No recipe exemption remains. |
| `test/self-hosting-graph.test.ts` | K, R1, D, R23, BQ, S1 | Each lane transcribed its own anchor, binding, structural, readiness and graph deltas. Summed those deltas against the common base. The extra moved-decoder binding adds one binding and one graph edge. Anchor-site expectations follow the async generator declaration. |
| `test/self-hosting-oracle/anchors.ts` | K, R1, D, R23, BQ, S1 | Each lane added anchors and binding edges; some moved existing sites. Kept the complete union, the moved help site, every comment anchor, and the shared decoder's step-key binding. Planning changes from references to satisfies only after its missing guidance is implemented and tested. |
| `test/self-hosting-oracle/index.ts` | K, D, R23, S1 | Adjacent gap removals conflicted. Removed the union of gaps whose Specs gained resolving verifiers; retained the other warnings. |
| `test/self-hosting-oracle/structural-edges.ts` | R1, D, R23, S1 | Earlier and incoming lanes extended accepted architectural units, membership, exceptions and uses. Kept the union. The Studio adapter now uses `api:protocol.evaluate-body` in the reader component, replacing its temporary dependency on the CLI compiler. |
| `test/skills.test.ts` | BQ | R23 exempted recipe 50 and BQ exempted 46 pending integration-owned teaching. Removed both exemptions, taught the recipes, and restored the test's whole-catalog name. |

The automatically merged Model renderer retains K's `termKeys` filter. Its regression now awaits
S1's asynchronous data builder. G's two test adapters now narrow generated steps by their
contract `key`, preserving the correlation K's contract types require.

## Shared integration work

- Taught recipes 44, 46, 50 and 51 in the reading skill's task table and relevant guidance, and
  in the sessions skill. Taught `params.part`, external registers and entry citations where they
  belong in the authoring workflow. No catalog test exempts a recipe.
- Added capability-based Pack naming and plan-pointer guidance to the authoring skill, with
  removal tests for both promises. The promise pass for
  `spec:consumers.graph-first-planning` now covers all seven rules, so its document realization
  states `satisfies`; its oracle delivery facts change accordingly.
- Routed the Studio recipe adapter through R1's exported evaluator. One retained recipe caller
  shares one graph, reader and report across the build. Shipped bodies compile once per evaluator
  context, preserving S1's compilation reuse; a new context reloads them. Spec and Pack rows
  and contexts also memoize within that evaluation, preserving the Studio's join reuse. Both
  regressions failed before their fixes. The compilation cache regression
  failed first on two reads instead of one. The existing test still checks every
  assigned recipe call, parameter set, shared Pack totals and the absence of calls while rendering.
- Added a rules-file regression that combines two calls to recipe 50, checking both unknown-token
  errors and successful resolution with two supplied registers.
- Added a regression preserving incomplete space-contract points while excluding them from
  reader coverage. Restoring S1's completeness filter on contract points or removing the reader
  filter makes that regression fail. Restoring the old Studio compiler adapter fails the
  recipe-call test; removing the evaluator's fifth binding fails the two-register test.
- Added generate to README and AGENTS CLI guidance. Recorded the settled step-key, term-key and
  entry-citation vocabulary in CONTEXT.
- Kept S1's existing offline diagram assets. Replaced machine-local command paths with named
  directory placeholders, including future measurement output. Marked its earlier build report
  as historical; measurements, hashes and images were not re-created or presented as head evidence.
- Removed the unused `check-prose-schema.mjs` probe. It was already stale at the base, and its only
  remaining references are historical records. Executable schema and carrier tests remain.

## Schema and oracle

The settled graph schema is **0.11.0**, one minor version above base 0.10.0. It carries both the
citation table and step/term-key additions. The schema-versioning Spec continues to state the
versioning law; its bound example, declaring literal, fixture graphs, oracle and current-version
assertions agree. Historical schema-compatibility fixtures intentionally retain older literals.

The oracle remains a transcription of authored lane changes. Re-run the self-hosting suite and
queries rather than inheriting this close snapshot. The merged roster is 403 Specs, 7 Packs,
448 anchors, 544 binding edges, 141 membership edges, 45 uses edges, 67 comment anchors,
858 graph nodes and 2,375 graph edges. The stated readiness distribution is 359 ready,
38 defined, 5 idea and 1 scoped. The additional decoder binding accounts for the one edge beyond
the sum of the seven lanes' base deltas.

G's closed validator audit passes over all 31 registered validation ids. D and K add no new
`graphValidatorIds` or `extractFindingIds`: term refusals reuse `extract/unrecognized-property`.
K's two new `contracts/` findings are contract-generation findings, explicitly outside the audit
under `spec:validation.validator-self-testing#rule.auditScope`, and remain covered by the keyed
contract tests. Recipe findings remain corpus-rule findings, outside the Protocol registries.

G's delegated declaration still awaits owner review for the eventual PR table:

| Declaration | Carrying Spec |
| --- | --- |
| Accept `src/validate/validators.ts#checkSupersededDecisions`, bound by `impl:protocol.superseded-decision-signal` in `component:protocol.validate`, alongside its sibling validators. | `spec:protocol.structural-self-binding#rule.acceptedSet`; `spec:model.structural-patterns` |

## Re-measure

The integrated main suite passes 2,486 tests across 106 files, and the separate CLI suite
passes 100 tests. Self-hosting projection checks report 0 errors and 29 expected warnings;
the worked example reports 0 errors and 0 warnings. Re-run the full gate at the committed
integration head with the commands below.

Self-hosting tests were run successfully after each merge before starting the next. The focused
integration tests cover citations, stable keys, bundle cuts and parts, planner ordering, help,
all-root generation, the validator audit, Studio pages and recipe calls. Four integration
mutations were restored after the named regressions failed.

```sh
npm run check
pnpm --silent sdp:q "$(cat dist/recipes/02-the-drift-alarm.js)" --json
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

The final validation warning list is derived as follows; every retained row is an informative
`honesty/gaps` warning, not a validation error:

```sh
pnpm --silent sdp:q 'return report.findings.map(({validatorId, subjectId, severity}) => ({validatorId, subjectId, severity}))' --json
```

## Left for the next wave or owner

| Item | Why it remains |
| --- | --- |
| `docs/agent-surface/upgrade-guide.md` and its existence/package checks | Lane U owns the guide. R23's help reference and its tests remain as supplied; integration did not author the guide or strengthen tests to require the absent asset. |
| Vault synchronization | Lane V fills R23's explicitly empty seam and must pass through the existing validation report, preserving one validation. The command-line realization remains a reference until that promise is built. |
| Studio panels and later inputs | S2 owns Spec-page panels and term HTML anchors; S3 owns registers, owner queue, glossary and diff input; S4 owns run evidence; S5 owns composing, export, print and watch. Their unfinished broader bindings remain references. |
| Whitespace-only address subjects | R1 reported a conflict between recipe 25's pinned subject wording and the rules runner's lawful-subject check. A Spec ruling is required; integration preserves the current promise and behavior. |
| Adopter policy migration | R1's scratch measurement leaves the platform's four-binding manual evaluator test failing and drops its former `params.addressSections` control. Batch recipe 25 calls when migrating that policy. This branch does not edit the adopter. |
| Oversized repeated bundle framing | BQ reports the current reading: an oversized repeated header makes each whole single-item part oversized. The owner may choose a distinct header diagnostic. Tests preserve the existing reading. |
| Trace diagrams' first relation | S1 reports that direction versus relation-type priority is unspecified when the same Spec relates both ways. Relation-type priority remains; S2 needs the wording settled before embedding that graph. |
| Optional bundle serialization optimization | BQ found no correctness defect. Retained whole-part measurement rather than changing the algorithm during integration. |
| Public previews, adopter capture publication and decision ratification | These remain owner decisions under plan 46. Existing assets stay in the branch; no host was enabled, no PR published and no push performed. |
| Future symbol realization binding | When symbol reach is built, its unit must join the impact-graph satisfying set. The current imports binding covers current realization. |

The wave-2a integration introduces no new owner ruling and changes no Spec promise or readiness
statement beyond the reviewed lanes. It leaves `.omo/`, other worktrees and the platform untouched.
