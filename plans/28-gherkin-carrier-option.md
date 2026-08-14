# Plan 28 — Gherkin carrier option for behavior and example Specs

> **Status:** ✅ EXECUTED 2026-08-13 — the Gherkin carrier option (MD-27) is realized for behavior and example Specs with one graph, generated-contract execution, and binding-only delivery facts.

## Context

Review 14 tested the executable-verification design against the restored v0 set, the gen-1 production record, and the current Protocol. Its evidence-led recommendation was to derive more test structure, but the owner selected O2: restore a stakeholder-readable, graph-aware Gherkin carrier option for behavior and example Specs.

The ruling is intentionally bounded:

- Markdown remains the default carrier; the TS DSL remains an import source and lawful per-ID option.
- Gherkin is lawful only for `kind: behavior` and `kind: example` Specs.
- Each Spec ID has one canonical surface. A Markdown/TS/Gherkin duplicate is refused, never merged.
- Gherkin derives the existing graph schema and uses the existing readiness floor, relation vocabulary, generated contracts, runner, and binding-only anchors.
- A scenario does not earn `has-verifier`; only the existing resolving `specTest` anchor does.
- No gen-1 value-transfer deletion, authored lifecycle status, or independent tag taxonomy enters the Protocol.

The implementation must prove equal canonicity as **graph parity**, not merely accept `.feature` text. The existing generated-contract path is the tracer bullet: a Gherkin-authored behavior parent and concrete example child must generate the same step/space contract shapes and execute through the same anchored handler boundary as their Markdown equivalents.

## Carrier grammar to realize

One `.feature` file owns one behavior Spec plus zero or more example Specs:

1. **Feature → behavior Spec.** File-level tags carry `@spec.<id-after-spec-prefix>`, `@altitude.<value>`, and `@readiness.<value>`. `kind` is structurally `behavior`; a kind tag is forbidden because it would duplicate the grammar.
2. **Scenario → example Spec.** Every ordinary Scenario carries its own `@spec.<id-after-spec-prefix>`, `@altitude.<value>`, and `@readiness.<value>`. `kind` is structurally `example`. Nesting declares the child’s `refines` and `verifies` relations to the Feature Spec unless an explicit mapped relation targets another lawful Spec.
3. **Relations.** `@refines.`, `@depends-on.`, `@constrained-by.`, `@decided-by.`, and `@verifies.` map one-for-one onto the existing relation vocabulary and restore the `spec:` prefix. Pack membership remains owned only by the Pack manifest; there is no `@pack` membership tag.
4. **Intent and verification descriptions.** Feature and Scenario descriptions use a closed line grammar for the existing `intent` and `verification` fields. Unknown headings fail loudly. Free prose outside recognized fields maps to the existing prose owner only when that owner exists; it never creates a new field.
5. **Rules.** Gherkin `Rule` titles map to `behavior.rules`; any description maps to that rule’s existing statement/rationale shape only after the carrier Spec fixes the exact lossless mapping.
6. **Example space.** One `@example-space` Scenario is carrier syntax, not a Spec node and not an executable case. Its Given/When/Then steps carry the current unbound typed-slot notation (`{n:number}`, closed unions, and the other forms already parsed by `src/notation`). Ordinary Scenarios bind one point with the current bound-slot notation (`{n: 2}`). The pseudo-scenario is withheld from projections as an example node but supplies the parent’s `gwt-vocabulary` entry.
7. **Execution.** Gherkin is not run by Cucumber. Extraction produces the same structured entries as Markdown; `sdp build` emits the same contracts; ordinary anchored code-side handlers execute them through the existing runner/adapters.
8. **No lifecycle tags.** Delivery facts, claim, implementation state, pass state, and workflow status have no Gherkin syntax. Unknown `@architect-*`, `@status-*`, and authored fact lookalikes are refusals, not ignored decoration.

The grammar is deliberately small. Before implementation, Phase A writes it as a ready carrier Spec with concrete accepted/refused examples; that Spec, not this plan, becomes the durable syntax owner.

## Approach

Ordered. Each phase leaves the tree green. The first engine commit includes a Gherkin tracer-bullet carrier so discovery and extraction cannot be declared complete without graph and contract proof.

### Phase 0 — build record

0.1. Stamp this plan `EXECUTING` and update the repository status block.
0.2. Re-measure the corpus and validation report through `sdp q`; record counts only in the done-record.

### Phase A — executable carrier contract

A1. Author `spec:carrier.gherkin-authoring` at `defined`, refining the carrier model and decided by the Gherkin carrier option. Carry the eight grammar rules above in typed behavior/constraints rather than prose-only guidance.
A2. Add accepted examples for parent+child extraction, example-space extraction, generated-contract parity, and one-canonical-surface behavior.
A3. Add refused examples for missing/duplicate IDs, unsupported constructs/kinds, unknown graph-aware tags, authored lifecycle/delivery facts, malformed relation targets, unbound ready examples, and a Markdown/Gherkin duplicate.
A4. Add the parent and every example to the self-hosting Pack in the same commit.
A5. Promotion preflight before any readiness edit. State the parent `ready` only after the engine, bound examples, mutation probes, and graph parity land.

### Phase B — discovery and deterministic parsing

B1. Add exact-pinned official Cucumber Gherkin/message parser dependencies. Do not implement a partial handwritten Gherkin parser.
B2. Extend discovery to nonignored `.feature` files under the selected root and existing exclusions. Discovery order and file-path normalization remain deterministic.
B3. Add a Gherkin reifier that returns the existing reified Spec shape plus source locations. It must parse the closed graph-aware tag grammar, descriptions, Rule blocks, the one `@example-space` pseudo-scenario, and ordinary bound Scenarios.
B4. Reuse `src/notation` for slot parsing and skeleton identity. A second slot grammar is prohibited.
B5. Assign `declared` claims to authored relations, including the nesting-owned child `refines`/`verifies` pair. Never infer a delivery fact or executing edge from carrier presence.
B6. Normalize parser diagnostics into existing extraction failures with file, line, construct, and exact rejected token. Unknown graph-aware syntax fails closed; unrelated ordinary Cucumber tags may survive only as non-semantic source decoration and never enter the graph.
B7. Feed reified Gherkin Specs through the same merge, duplicate-ID exclusion, serialization, validation, and projection paths as Markdown/TS carriers. No Gherkin-only graph builder branch after reification.

### Phase C — parity and honesty checks

C1. Add fixture pairs that author the same behavior parent and example children in Markdown and Gherkin. Compare graph nodes and edges after removing only carrier-specific `file`/location fields.
C2. Prove Markdown↔Gherkin duplicate IDs trigger the standing duplicate-ID refusal and exclude every edge sourced by the excluded carriers.
C3. Prove relation tags map only onto the existing relation contract, wrong-kind endpoints remain validator findings, and nesting never manufactures unrelated relations.
C4. Prove unknown/misspelled graph-aware tags fail with a bounded suggestion from the closed carrier vocabulary. This is carrier syntax validation, not a new global registry.
C5. Prove parser output is byte-deterministic across repeated builds and stable under input discovery order.
C6. Mutation-probe the parser and refusal suite: remove ID decoding, accept an authored delivery fact, mis-map one relation, leak an excluded duplicate edge, and reorder output. Every mutation must redden a named observable assertion.

### Phase D — executable-contract tracer bullet

D1. Migrate one current self-hosted `behavior` Spec and at least two of its `example` children into one canonical `.feature` carrier; delete the Markdown twins in the same commit. Choose a family already using generated contracts so parity is measurable.
D2. Include the parent’s `@example-space` pseudo-scenario and two concrete ordinary Scenarios. Preserve IDs, section content, relations, readiness, and Pack membership.
D3. Run `sdp build`; generated step and space contracts must match the pre-migration semantic shapes, carrier-specific source paths aside.
D4. Keep the existing `specTest` anchors and code-side handlers. The migrated examples must retain `has-verifier`; no new fact derivation path is allowed.
D5. Execute the existing contract-dependent suites. Mutate one bound Gherkin value and prove the anchored suite goes red in the Spec’s language; restore it.
D6. Prove the example-space oracle remains typed against the generated Outcome union. Gherkin changes that alter a slot or outcome must fail typecheck until the authored code-side semantics are updated.

### Phase E — CLI, reader, and guidance

E1. `sdp build`, `validate`, `view`, and `q` discover Gherkin through the shared extraction pipeline. Add no Gherkin-specific CLI verb.
E2. Report carrier-specific parse failures through the existing validation/extraction output contracts. Do not add workflow gates or content-quality scoring.
E3. Update README, `CONTEXT.md` only if vocabulary changes, the authoring/binding concept, agent-surface recipes where source-file assumptions matter, and `sdp-authoring` with the lawful Gherkin flow.
E4. Document that Cucumber execution is not part of the design: `.feature` is a canonical carrier; generated contracts plus ordinary anchored handlers remain the execution boundary.
E5. Update examples or adopter guidance with one complete Gherkin-authored executable path, including the still-separate code-side binding.

### Phase F — close

F1. Query the new carrier Spec context, lower ladder, readiness divergence, warn-level signals, and declared-versus-enabled verifiers. Record exact commands, not inherited verdicts.
F2. Re-measure the self-hosting graph: zero errors/warnings, no operational backlog introduced by decision/example posture, and the migrated examples retain enabled verifiers.
F3. Run the specific Gherkin parser/parity/refusal suites, generated-contract suite, migrated executable suite, typecheck, and CLI smoke paths.
F4. Run `npm run check` from the complete tree.
F5. Stamp this plan `EXECUTED`, update the repository status block, and record the commits and mutation evidence.

## Non-goals

- No Gherkin carrier for rule, constraint, model, contract, decision, or UI Specs.
- No Cucumber runtime, step-definition discovery, Cucumber Messages evidence ingestion, or test-pass facts in the graph.
- No Gherkin↔Markdown round-trip converter in the first realization. Graph parity is required; textual codec fidelity is not claimed.
- No generated-test-wrapper work from review option O3.
- No harness UI from option O4.
- No engine-side execution from option O5.
- No gen-1 value-transfer deletion, authored status FSM, `@architect-*` compatibility, or independent tag registry.
- No change to `SpecTestAnchor`, claim taxonomy, delivery-fact derivation, readiness descriptors, or existing GraphSchema semantics.

## Verification

1. **Carrier parity:** Markdown and Gherkin fixture pairs derive equal nodes/edges after removing carrier-specific locations.
2. **Duplicate refusal:** a cross-carrier duplicate produces the standing duplicate-ID finding and leaks no excluded carrier edges.
3. **Grammar refusal:** missing IDs, unsupported kinds, malformed relation tags, authored lifecycle/delivery facts, unknown graph-aware tags, and multiple `@example-space` scenarios fail loudly with source locations.
4. **Executable proof:** the migrated Gherkin examples generate contracts and run through unchanged anchored handlers; a bound-value mutation reddens the named step.
5. **Claim boundary:** `has-verifier` remains absent until a resolving `specTest` anchor exists and present after that binding resolves; Gherkin presence alone confers nothing.
6. **Determinism:** repeated builds emit byte-identical graph, contracts, and Design Review output.
7. **Green gate:** `npm run check` passes with the Gherkin tracer bullet in the self-hosting corpus.

## Done record

- **Commits:** `1b543a0` carrier contract; `e6699d2` parser/discovery; `ed14eac` parity,
  honesty, executable examples, and mutation evidence; `884a7f2` reader-family migration;
  `98ae590` CLI/guidance; `6556fde` readiness promotion; `d321208` implementation binding.
- **Carrier Spec and examples:** `spec:carrier.gherkin-authoring` plus ten ready example Specs cover
  parent/child extraction, example-space extraction, Markdown parity, missing identity, unsupported
  constructs, unknown tags, authored facts, malformed relations, readiness-floor reuse, and
  duplicate-surface refusal. All eleven have enabled verifiers; the parent also has the
  `impl:protocol.gherkin-authoring` code anchor.
- **Migrated IDs:** `spec:consumers.reader`, `.concept-entry`, `.file-entry`, and
  `.changeset-entry` moved from four Markdown files to one `specs/consumers/reader.feature` without
  changing IDs, sections, relations, contracts, handlers, or anchors.
- **Graph-parity evidence:** `npx vitest run test/gherkin-parity.test.ts` proved the Markdown and
  Gherkin twins serialize equally after normalizing only the carrier filename; two derivations and
  generated-contract sets were byte-identical. Migrating the reader family left
  `generated/contracts/consumers.reader.*` byte-identical.
- **Refusal mutations:** removing `@spec.` decoding reddened the parent/child graph assertions;
  accepting `@implemented` reddened `authored-fact-refused`; mapping `@depends-on.` to `refines`
  reddened the exact relation assertion; retaining duplicate `.feature` sites reddened the
  duplicate example's zero-node/zero-edge assertions; reversing serializer order reddened the
  repeated-extraction byte comparison. Every mutation was reverted.
- **Executable mutations:** changing the migrated concept point from `{matchCount: 1}` to
  `{matchCount: 2}` reddened its named runner case with the authored step text. Renaming
  `{concept:string}` to `{topic:string}` removed `ReaderConditions.concept`; renaming a Then
  vocabulary line removed the referenced `ReaderOutcome` member. Both made `npm run typecheck`
  fail and were reverted.
- **Measurements:** the opening recipe-8/11 baseline was 0 errors, 0 warnings, and 18 lower-ladder
  Specs. Promotion preflight found all eleven Gherkin Specs at stated `defined`, floor reached
  `ready`, with no floor failures. At close: 145 Specs, 1 Pack, 135 anchors, 281 nodes, 530 edges;
  readiness `{ ready: 127, defined: 14, idea: 3, scoped: 1 }`; recipe 1 backlog 0, 63 excluded
  ready examples, 27 excluded ready decisions, and no excluded example without a verifier;
  recipe 8 remained 0 errors/0 warnings; recipe 10 had no declared-only verifier; recipe 11
  returned 18. The measured anchor/node/edge totals are one above the planning estimate because
  the Gherkin implementation now carries its required code anchor.
- **Final gate:** the Phase-F targeted command passed 6 files / 75 tests, `npm run typecheck`
  passed, and the built CLI smoke derived the complete corpus. `npm run check` then passed from the
  complete tree, including 52 files / 666 tests, self-hosting gates, self-hosting validation,
  example validation, and preflight.
