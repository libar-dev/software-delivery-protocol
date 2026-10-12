# Spec refresh integration

The integration pass runs in the main checkout on `review/spec-refresh`. Refresh base: `46f0280`. Integration starts at `5e70b7e`, after the lane merges. The working tree was clean at entry. No oracle file is edited.

[handoffs.md](handoffs.md) records each handoff, including superseding fix reports and conflicts. [lane-pins.md](lane-pins.md) preserves every lane's PINS list. [integration-delta.json](integration-delta.json) records the graph changes this pass adds to those lists. [sources.json](sources.json) identifies and hashes the review material.

## Gaps and backlog

- The authoring-recipes implementation and verifier at `46f0280` were `impl:protocol.authoring-recipes` and `test:protocol.authoring-recipes`, in `test/skills.test.ts`. ONRAMPS-DOCS removed them for the coordinated move, while ONRAMPS-RECIPES deliberately left insertion to integration to avoid duplicate ids. Both are restored in `test/recipes.test.ts` with the specified labels and targets. The suite executes promotion preflight, the verifier audit and the lower ladder. The address-and-cycle pair moves beside its own suite so the enlarged opening anchor group does not exceed the adjacency convention.
- `spec:model.design-maturity` already states `ready` and is implemented by `impl:protocol.pack-design`. `test/pack-design.test.ts` tests design-entry and declaration counts, questions, decisions, and agreement between Spec context and Pack members. Its existing test anchor, `test:protocol.pack-design`, also verifies design-maturity. Both forms of test anchor are lawful; the existing binding uses the comment form.
- The evaluation sink clears the ready floor and has two satisfying units and two enabled verifier bindings from ENG-CLI. After recipe 9, integration states the delegated `ready` rung under R04 OQ-42. The reading on-ramp already states `ready`, clears the floor and has its document-realization and verifier bindings under R04 OQ-38. Neither requires a downgrade.
- The three captures join the self-hosting Pack in the exact positions PROTO-PACKS named. Schema source, schema assertions, the declared-version example and checkout version goldens already use `0.10.0`.
- The owner-kept gap on `spec:model.spec-sections` stays. The five merged question-link warnings stay; the reverse structural-Mermaid link adds another intended warning. No relation is added to silence a mention.
- Recipes 1 and 2 both return `total: 0`, and recipe 1 has no excluded example without a verifier. A query confirms every Primitive belongs to `pack:self-hosting-v1`.

## Conflicts and obsolete work

- R02 says a rule key is unique with its question keys. The Spec and engine previously admitted a collision. Integration follows the ruling, updates Rule 1 and `duplicateKey`, and refuses colliding rule or flow keys at each site in Markdown and TypeScript. It does not adopt the handoff's drafting-slip alternative. The corrected two regression cases fail when that refusal is disabled and pass when it is restored.
- R04 OQ-01 names the comment-form decision as narrowing a rendering freeze. That decision adds a second anchor syntax to the same envelope, and no projection reads the form. DECISIONS declined a false rendering relation. Integration retains that result and applies GLOSSARY's explicit fallback, trimming the MD-32 gloss and pointer to the actual rendering refinements. Binding-grain and architectural-annotation keep their reasoned refinements.
- Gherkin's explicit Feature and Scenario relations are located at their own tag lines, matched by relation type and target. Defaulted relations use the `Scenario:` keyword line. This is the reading requested by EXTRACTION's fix report for the ruled phrase "Scenario identity line". A regression exercises every admitted Feature relation head, separate Scenario targets of one type, and defaulted refines/verifies sites.
- The Pack-order example no longer carries a schema-version slot or assertion. Its version-replacement handoff is obsolete. The example and adopted registrar stay focused on member order.
- ENG-CLI's fix-report packedAssets handoff supersedes the older adopterAssets recommendation. The registry is admitted to the tarball allowlist without requiring help to index it.
- The carrier fixtures remain frozen. The test that required them to match live carrier bytes is removed; their existing parser tests remain. The stale no-cycle assertion is removed while the independent reachability comparison remains. The duplicate-ID contract suite checks its extraction rule without pinning the complete rule list, and the Design Review expectation recognizes the epic's lane-bound verifier.

The pre-existing `generated/imports.json` is external adapter input that the standard generation scripts do not own. Preflight found it beside the checked outputs. Its bytes are preserved unchanged in [imports.before.json](imports.before.json), with original path, modification time and SHA-256 in [imports-receipt.json](imports-receipt.json). It is moved out of `generated/`; no user recovery state is discarded.

## Integration additions for PINS

Apply these after the lane lists, re-reading the final graph rather than inheriting lane-only totals.

| Kind | Integration delta |
| --- | --- |
| Spec text | `spec:model.rule-keys` Rule 1 and Design `duplicateKey`; `spec:model.anchors` Model `Protocol builder binding`; `spec:consumers.reading-on-ramp` adds the task-sheet rule; `spec:consumers.structural-mermaid#question.layerAndContext` adds the reverse `links` field |
| Rule keys | `spec:validation.corpus-rules` adds `operatorNamed`, `exitCode`, `brokenRuleFails`; `spec:validation.architecture-constraints` adds `walk`; rule text stays unchanged |
| Readiness | `spec:consumers.agent-surface.evaluation-sink`, `defined` to delegated `ready`; every other rung is unchanged by integration |
| Declared relation | Engine-provenance replaces `refines` adopter-on-ramp with reasoned `dependsOn`; the reason is in integration-delta.json |
| Pack | Add feature-adapter after round-trip, evaluation-sink after answer-shapes, and reading-on-ramp after authoring-on-ramp; all in `pack:self-hosting-v1` |
| Restored nodes | `impl:protocol.authoring-recipes` and `test:protocol.authoring-recipes` move from the base's skills suite to the recipe suite; preserve their identities and binding edges, update file/site and verifier label |
| New node | `impl:protocol.validate-summary` satisfies diagnostic-rendering and belongs to the CLI component, with role `renderer` |
| Existing bindings | Static-reification also satisfies markdown-parser; `test:protocol.pack-design` also verifies design-maturity |
| Delivery facts | Authoring-recipes regains `implemented` and `has-verifier`; design-maturity gains `has-verifier` |
| Sites | Re-derive all affected anchor sites, notably recipe/register/address pairs, iteration recipes after extractFixture removal, Markdown-reifier anchors, Gherkin extractor, readiness-floor anchors, entry-locations verifier and wholesale-view-rewrite; exact before/after rows are in integration-delta.json |
| Location table | Feature relation rows appear for the Gherkin reader, explicit Scenario rows locate the correct target tags, and defaulted rows use the Scenario line; structural-Mermaid gains a question links row; engine-provenance and later carrier lines move as derived |
| Graph totals | Re-measured before close: schema `0.10.0`, 260 Specs, 5 Packs, 299 anchors, 564 nodes and 1446 edges; anchors comprise 137 CodeNodes and 162 Anchor nodes. Re-run at PINS |

The exact warning set is six `conformance/prose-mentions` findings and the kept `honesty/gaps` finding:

| Subject | Related Spec |
| --- | --- |
| `spec:consumers.obsidian-vault.iteration` | `spec:consumers.validate-watch` |
| `spec:consumers.obsidian-vault` | `spec:consumers.spec-studio` |
| `spec:consumers.spec-studio.lenses` | `spec:consumers.structural-mermaid` |
| `spec:consumers.spec-studio.lenses` | `spec:observation.run-evidence` |
| `spec:consumers.spec-studio.verification-panels` | `spec:observation.run-evidence` |
| `spec:consumers.structural-mermaid` | `spec:consumers.spec-studio.lenses` |
| `spec:model.spec-sections`, honesty gap | no resolving verifier, kept by the owner |

## Checks and commits

The final ordered run passes build, validate, both generators, both typechecks, lint and format:check. Validate reports 0 errors and 7 warnings. The full test run passes 1865 tests in 80 suites and fails 24 tests in two suites, all pins. All CLI tests pass. [checks.json](checks.json) records command exits and log hashes; [failures.md](failures.md) names every remaining failure and the pin it reads. The temporal guard, self-hosting gates, self-hosting and example projection certification, preflight and the prose-schema audit all pass. The final evidence formatting check also passes. The implementation commits are reported in the final response; git is the event log.
