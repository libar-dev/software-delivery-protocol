# G7 Evidence Pack: Coverage-Ledger Completeness Audit

Source checkbox: **39. Session 7 close — gate G7 (coverage-ledger completeness audit)**

## Disposition

G7 is accepted on 2026-07-19 at
`b471189034e1ee238394f3364c349937be6bebed`. The user explicitly instructed continuation without
incremental owner reviews, which supplies the owner disposition for this gate.

## Audit Basis

The audited manifest is `specs/self-hosting.pack.sdp.ts`. It contains 58 `ref(...)` entries. Each
entry resolved to one `.sdp.md` carrier in `specs/`. No manifest member was missing a carrier, and
no carrier had an unrecorded concept-contract mapping.

The existing coverage ledger was accurate for waves 1 through 4 except its `derive-graph` note
said no standalone Spec was authored. The correction makes clear that the existing ready
`spec:extraction.derive-graph` carries the narrative and no additional Spec was needed.

Several Specs carry distinct contracts from the same concept-document section. Those rows are not
duplicate claims: the disposition names each distinct contract. Each corpus Spec has one primary
coverage row below. There are no unresolved double claims.

## Coverage Ledger Completeness

| Spec ID | Concept-document contract | Disposition |
| --- | --- | --- |
| `spec:carrier.markdown-authoring` | `04-authoring-and-binding.md` §1 authoring carrier | primary carrier contract |
| `spec:carrier.envelope-contract` | `04-authoring-and-binding.md` §1 envelope | distinct envelope contract |
| `spec:carrier.markdown-parser` | `04-authoring-and-binding.md` §1 Markdown parser | distinct parser contract |
| `spec:carrier.sdp-import` | `04-authoring-and-binding.md` §1 TypeScript import source | distinct import behavior |
| `spec:carrier.sdp-import.round-trip` | `04-authoring-and-binding.md` §4 harnesses | executable import example |
| `spec:carrier.prose-ownership-rule` | `04-authoring-and-binding.md` §1 prose ownership | distinct authoring rule |
| `spec:protocol.self-hosting` | `00-vision-scope-and-mvp-boundary.md` §2-3 and `01-founding-principles-and-invariants.md` P1-P10 | phase-level carrier |
| `spec:extraction.derive-graph` | `03-the-one-graph.md` §1 derivation and §5 git event log | existing carrier, no additional Spec |
| `spec:extraction.determinism` | `03-the-one-graph.md` §2 determinism | determinism constraint |
| `spec:extraction.build-pipeline` | `03-the-one-graph.md` §1 derivation | build workflow contract |
| `spec:extraction.excludes` | `03-the-one-graph.md` §1 exclusion surface | strict exclusion rule |
| `spec:extraction.claim-taxonomy` | `03-the-one-graph.md` §3 claim taxonomy | epistemic model |
| `spec:extraction.regenerability` | `03-the-one-graph.md` §4 regenerability | no-second-store rule |
| `spec:extraction.schema-versioning` | `03-the-one-graph.md` §6 schema versioning | schema rule |
| `spec:extraction.executable-contracts` | `03-the-one-graph.md` §1 and plan 13 A2 | generated-contract behavior |
| `spec:validation.readiness-floor` | `05-validation-and-honesty.md` §3 readiness floors | floor rule |
| `spec:validation.duplicate-ids` | `05-validation-and-honesty.md` §2 MVP graph validators | duplicate-ID behavior |
| `spec:validation.two-check-families` | `05-validation-and-honesty.md` §1 two check families | validation parent |
| `spec:validation.referential-integrity` | `05-validation-and-honesty.md` §2 MVP graph validators | distinct validator rule |
| `spec:validation.claim-separation` | `05-validation-and-honesty.md` §2 MVP graph validators | distinct validator rule |
| `spec:validation.verification-linkage` | `05-validation-and-honesty.md` §2 MVP graph validators | paired trace-law bundle |
| `spec:validation.pack-coherence` | `05-validation-and-honesty.md` §4 Pack coherence | Pack validator rule |
| `spec:validation.authored-honesty` | `05-validation-and-honesty.md` §2 MVP graph validators | paired honesty-law bundle |
| `spec:validation.warn-level-signals` | `05-validation-and-honesty.md` §2 MVP graph validators | warning-signal bundle |
| `spec:validation.duplicate-ids.dual-carrier` | `05-validation-and-honesty.md` §2 MVP graph validators | executable duplicate-ID example |
| `spec:consumers.projections-model` | `06-consumers-and-projections.md` §1-2 projections taxonomy and surfaces | projections model |
| `spec:consumers.agent-surface` | `06-consumers-and-projections.md` §3 agent surface | agent behavior |
| `spec:consumers.design-review` | `06-consumers-and-projections.md` §5 Design Review | human projection behavior |
| `spec:consumers.reader` | `06-consumers-and-projections.md` §3 reader | reader behavior |
| `spec:consumers.edit-model` | `06-consumers-and-projections.md` §4 edit model | intent-composition behavior |
| `spec:model.protocol-domain` | `02-core-model.md` §1-2 primitive and descriptors | protocol vocabulary |
| `spec:model.core-model` | `02-core-model.md` §1-2 primitive and descriptors | primary model contract |
| `spec:model.spec-sections` | `02-core-model.md` §3 sections | section and verifier model |
| `spec:model.relations` | `02-core-model.md` §6 relations | relation vocabulary |
| `spec:model.stable-ids` | `02-core-model.md` §5 stable IDs | identity rule |
| `spec:model.pack-aggregate` | `02-core-model.md` §4 Pack | aggregate model |
| `spec:model.anchors` | `04-authoring-and-binding.md` §2 generic source anchors | binding model |
| `spec:decisions.plain-language-references` | `DECISIONS.md` current executable decision-spec pointers | retained phase decision |
| `spec:decisions.concept-docs-dissolve` | `DECISIONS.md` current executable decision-spec pointers | retained phase decision |
| `spec:decisions.one-validation-path` | `DECISIONS.md` ratified-name registry, MD-14 | folded decision |
| `spec:decisions.sdp-ts-extension` | `DECISIONS.md` ratified-name registry, MD-15 | folded decision |
| `spec:decisions.point-per-example` | `DECISIONS.md` ratified-name registry, MD-17 | folded decision |
| `spec:decisions.carrier-ruling` | `DECISIONS.md` ratified-name registry, MD-18 | folded decision |
| `spec:decisions.prose-ownership` | `DECISIONS.md` ratified-name registry, MD-19 | folded decision |
| `spec:decisions.envelope-grammar-posture` | `DECISIONS.md` MD-21 | folded decision |
| `spec:decisions.exclusion-contract` | `DECISIONS.md` MD-20 | folded decision |
| `spec:decisions.executable-meta-model` | `DECISIONS.md` ratified-name registry, MD-1 | folded decision |
| `spec:decisions.adopt-the-nouns` | `DECISIONS.md` ratified-name registry, MD-2 | folded decision |
| `spec:decisions.one-primitive` | `DECISIONS.md` ratified-name registry, MD-4 | folded decision |
| `spec:decisions.protocol-naming` | `DECISIONS.md` ratified-name registry, MD-5 | folded decision |
| `spec:decisions.binding-not-liveness` | `DECISIONS.md` ratified-name registry, MD-7 | folded decision |
| `spec:decisions.content-only-sections` | `DECISIONS.md` ratified-name registry, MD-10 | folded decision |
| `spec:decisions.typing-law` | `DECISIONS.md` ratified-name registry, MD-11 | folded decision |
| `spec:decisions.kind-conditional-floor` | `DECISIONS.md` ratified-name registry, MD-12 | folded decision |
| `spec:decisions.carried-evidence` | `DECISIONS.md` ratified-name registry, MD-16 | folded decision |
| `spec:decisions.pack-reified` | `DECISIONS.md` structural-decision shorthand, D3 | folded decision |
| `spec:decisions.agent-surface-scripts-graph` | `DECISIONS.md` structural-decision shorthand, D5 | folded decision |
| `spec:decisions.mcp-deferred` | `DECISIONS.md` structural-decision shorthand, D6 | folded decision |

Result: 58 manifest members, 58 carrier files, 58 primary coverage rows, zero orphans, and zero
unresolved double claims.

## Floor-Honest Readiness Audit

The applied floor is the current implementation in `src/validate/readiness-floor.ts`. `defined`
requires complete natural evidence for the kind and no blocking question. `ready` additionally
requires resolved relations, defined `refines` and `dependsOn` targets, and resolved anchors.
An enabled verifier is a direct test binding, not a mandatory `## Verification` section on every
ready Spec. This follows `02-core-model.md` §3 verifier semantics.

| Spec ID and quoted relations | Stated readiness | Floor evidence present | Verifier or anchor evidence |
| --- | --- | --- | --- |
| `spec:carrier.markdown-authoring`; `dependsOn markdown-parser`; `decidedBy sdp-ts-extension, carrier-ruling` | defined | Complete `Behavior` rules; parent carrier uses dependency rather than refinement | No verifier claim |
| `spec:carrier.envelope-contract`; `refines markdown-authoring`; `decidedBy envelope-grammar-posture` | defined | Complete `Contract` statements and refining relation | Direct test anchor `test:protocol.envelope-contract` exists; readiness remains conservative |
| `spec:carrier.markdown-parser`; `refines markdown-authoring`; `dependsOn envelope-contract` | defined | Complete `Behavior` rules and refining relation | Direct test anchor `test:protocol.markdown-parser` exists; readiness remains conservative |
| `spec:carrier.sdp-import`; `refines markdown-authoring` | ready | Complete behavior, resolved refinement, and defined target | Enabled child `sdp-import.round-trip` declares `verifies sdp-import`; its direct test anchor resolves |
| `spec:carrier.sdp-import.round-trip`; `refines sdp-import`; `verifies sdp-import` | ready | Bound GWT example, resolved relations, and defined parent | `## Verification - executable`; direct `test:protocol.sdp-import.round-trip` anchor |
| `spec:carrier.prose-ownership-rule`; `refines markdown-authoring`; `decidedBy prose-ownership` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:protocol.self-hosting`; `dependsOn markdown-authoring, protocol-domain`; `decidedBy concept-docs-dissolve, executable-meta-model, adopt-the-nouns, protocol-naming` | defined | Complete `Behavior` rules; epic root has dependencies, not a parent refinement | No verifier claim |
| `spec:extraction.derive-graph`; `refines self-hosting`; `constrainedBy determinism` | ready | Complete behavior and resolved relations | Direct `test:protocol.extract` anchor |
| `spec:extraction.determinism`; `refines self-hosting` | ready | Complete machine-readable constraint and resolved refinement | Direct `test:protocol.extraction-determinism` anchor |
| `spec:extraction.build-pipeline`; `refines self-hosting`; `dependsOn derive-graph` | defined | Complete `Workflow` rules and refining relation | No verifier claim |
| `spec:extraction.excludes`; `refines derive-graph`; `decidedBy exclusion-contract` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:extraction.claim-taxonomy`; `refines derive-graph` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:extraction.regenerability`; `refines determinism` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:extraction.schema-versioning`; `refines derive-graph` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:extraction.executable-contracts`; `refines build-pipeline` | defined | Complete `Behavior` rules and refining relation | No verifier claim |
| `spec:validation.readiness-floor`; `refines self-hosting`; `dependsOn protocol-domain`; `decidedBy kind-conditional-floor, carried-evidence` | ready | Complete `Rule`, resolved relations, and defined targets | Direct `test:protocol.readiness-floor` anchor |
| `spec:validation.duplicate-ids`; `refines self-hosting`; `dependsOn markdown-parser` | ready | Complete behavior and resolved relations | Enabled child `duplicate-ids.dual-carrier` verifies it and has a direct test anchor |
| `spec:validation.two-check-families`; `refines self-hosting`; `decidedBy one-validation-path` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:validation.referential-integrity`; `refines two-check-families` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:validation.claim-separation`; `refines two-check-families` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:validation.verification-linkage`; `refines two-check-families` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:validation.pack-coherence`; `refines two-check-families` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:validation.authored-honesty`; `refines two-check-families` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:validation.warn-level-signals`; `refines two-check-families` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:validation.duplicate-ids.dual-carrier`; `refines duplicate-ids`; `verifies duplicate-ids` | ready | Bound GWT example and resolved relations | Direct `test:protocol.duplicate-ids.dual-carrier` anchor |
| `spec:consumers.projections-model`; `refines self-hosting`; `decidedBy mcp-deferred` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:consumers.agent-surface`; `refines projections-model`; `decidedBy agent-surface-scripts-graph` | defined | Complete `Behavior` rules and refining relation | No verifier claim |
| `spec:consumers.design-review`; `refines projections-model` | defined | Complete `Behavior` rules and refining relation | No verifier claim |
| `spec:consumers.reader`; `refines agent-surface` | defined | Complete `Behavior` rules and refining relation | No verifier claim |
| `spec:consumers.edit-model`; `refines projections-model` | defined | Complete `Behavior` rules and refining relation | No verifier claim |
| `spec:model.protocol-domain`; `refines self-hosting` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:model.core-model`; `refines self-hosting`; `decidedBy one-primitive` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:model.spec-sections`; `refines core-model`; `decidedBy point-per-example, content-only-sections, typing-law` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:model.relations`; `refines core-model` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:model.stable-ids`; `refines core-model` | defined | Complete `Rule` statement and refining relation | No verifier claim |
| `spec:model.pack-aggregate`; `refines core-model`; `decidedBy pack-reified` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:model.anchors`; `refines core-model`; `decidedBy binding-not-liveness` | defined | Complete `Model` terms and refining relation | No verifier claim |
| `spec:decisions.plain-language-references`; `refines self-hosting` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.concept-docs-dissolve`; `refines self-hosting` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.one-validation-path`; `refines two-check-families` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.sdp-ts-extension`; `refines markdown-authoring` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.point-per-example`; `refines spec-sections` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.carrier-ruling`; `refines markdown-authoring` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.prose-ownership`; `refines prose-ownership-rule` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.envelope-grammar-posture`; `refines envelope-contract` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.exclusion-contract`; `refines excludes` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.executable-meta-model`; `refines self-hosting` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.adopt-the-nouns`; `refines self-hosting` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.one-primitive`; `refines core-model` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.protocol-naming`; `refines self-hosting` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.binding-not-liveness`; `refines anchors` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.content-only-sections`; `refines spec-sections` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.typing-law`; `refines spec-sections` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.kind-conditional-floor`; `refines readiness-floor` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.carried-evidence`; `refines readiness-floor` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.pack-reified`; `refines pack-aggregate` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.agent-surface-scripts-graph`; `refines agent-surface` | defined | Written `Decision` and refining relation | No verifier claim |
| `spec:decisions.mcp-deferred`; `refines projections-model` | defined | Written `Decision` and refining relation | No verifier claim |

Result: 7 ready Specs and 51 defined Specs. No `idea` or `scoped` Spec is in the corpus. Every
stated readiness clears its cumulative floor, and no Spec states a rung beyond the evidence present.

## Generated Design Review

Command:

```sh
npm run generate:self-hosting
```

Observed output:

```text
58 specs · 1 packs · 36 anchors → 95 nodes · 180 edges (0 errors, 0 warnings)
Wrote /Users/darkomijic/dev-projects/libar-software-delivery-protocol/generated/design-review (60 pages)
```

The regenerated Design Review contains 60 pages.

## Gate Verification

Commands run after this evidence and plan update:

```sh
node ./check-self-hosting-gates.mjs
npm run check
```

`node ./check-self-hosting-gates.mjs` exited 0. Its temporal check ran and exited 0, and its
phase-2 result was `G1-G8 scaffold checked`.

`npm run check` exited 0. Relevant output included:

```text
All matched files use Prettier code style!
58 specs · 1 packs · 36 anchors → 95 nodes · 180 edges (0 errors, 0 warnings)
Wrote /Users/darkomijic/dev-projects/libar-software-delivery-protocol/generated/design-review (60 pages)
Test Files  31 passed (31)
Tests  427 passed (427)
```

The checkout example check retained its intentional, non-failing unbound-invalid-cart warning. It
does not affect the self-hosting corpus or G7, and the full command still exited 0.
