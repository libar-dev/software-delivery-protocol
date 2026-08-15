# Decision registry — Libar Software Delivery Protocol

> The registry retains durable decision names, one-line glosses, and their carrying Specs. Historical execution and rationale live in git, plans, and the Specs themselves.

## The ratified-name registry

In prose, lead with meaning and use a code only as a parenthetical lookup key. Curation records the ADR three-part test: hard to reverse, surprising without context, and a real trade-off.

Numbering is append-only: absent identifiers such as MD-3 and MD-6 are retired or reserved historical
positions and are never reused.

| ID | Ratified name | Curation | Gloss | Spec pointer or reservation |
|---|---|---|---|---|
| MD-1 | the executable meta-model | durable | Delivery intent conforms to a typed executable meta-model. | [Spec](../../specs/decisions/executable-meta-model.sdp.md) (`spec:decisions.executable-meta-model`) |
| MD-2 | adopt the nouns, reject the gates | durable | Shared delivery nouns do not imply workflow gates. | [Spec](../../specs/decisions/adopt-the-nouns.sdp.md) (`spec:decisions.adopt-the-nouns`) |
| MD-4 | one primitive, named coordinates | durable | One enrichable Spec carries independent coordinates. | [Spec](../../specs/decisions/one-primitive.sdp.md) (`spec:decisions.one-primitive`) |
| MD-5 | the protocol naming | durable | The product and protocol names remain stable. | [Spec](../../specs/decisions/protocol-naming.sdp.md) (`spec:decisions.protocol-naming`) |
| MD-7 | binding, never liveness | durable | Anchors state bindings, never runtime truth. | [Spec](../../specs/decisions/binding-not-liveness.sdp.md) (`spec:decisions.binding-not-liveness`) |
| MD-8 | the generic `codeAnchor` | folded | One generic binding form spans code locations. | `src/model/anchors.ts` |
| MD-9 | the open-questions home | folds | Unsettled durable questions live on their Spec. | `src/model/sections.ts`, [Spec](../../specs/validation/readiness-floor.sdp.md) (`spec:validation.readiness-floor`) — the `defined` clause that reads a blocking open question |
| MD-10 | content-only sections | durable | Sections carry content while relations carry links. | [Spec](../../specs/decisions/content-only-sections.sdp.md) (`spec:decisions.content-only-sections`) |
| MD-11 | the typing law | durable | Floor-read sections have closed typed shapes. | [Spec](../../specs/decisions/typing-law.sdp.md) (`spec:decisions.typing-law`) |
| MD-12 | the kind-conditional floor | durable | Readiness evidence varies with the Spec kind. | [Spec](../../specs/decisions/kind-conditional-floor.sdp.md) (`spec:decisions.kind-conditional-floor`) |
| MD-13 | floor-table-as-truth | folds | The floor table is its code-level source of truth. | [Spec](../../specs/validation/readiness-floor.sdp.md) (`spec:validation.readiness-floor`), `src/validate/readiness-floor.ts` |
| MD-14 | one validation path | durable | Validation runs only through the derived graph. | [Spec](../../specs/decisions/one-validation-path.sdp.md) (`spec:decisions.one-validation-path`) |
| MD-15 | the `.sdp.ts` extension | durable | The extension law is re-pointed, not repealed: carrier extensions identify Specs without test-glob collisions. MD-28 applies the same law to the Gherkin option. | [Spec](../../specs/decisions/sdp-ts-extension.sdp.md) (`spec:decisions.sdp-ts-extension`) |
| MD-16 | carried evidence | durable | Promoted evidence must carry the evidence it represents. | [Spec](../../specs/decisions/carried-evidence.sdp.md) (`spec:decisions.carried-evidence`) |
| MD-17 | point-per-example | durable | Each example is one bound point. | [Spec](../../specs/decisions/point-per-example.sdp.md) (`spec:decisions.point-per-example`) |
| MD-18 | the carrier ruling | durable | Specs and Packs default to Markdown; the TS DSL survives as import source and a lawful per-ID option. MD-25 completes the Pack syntax deferral; MD-27 adds a Gherkin option for behavior and example Specs; MD-28 settles that option's canonical suffix as `.sdp.gherkin`. The surviving law is one canonical surface per ID, no mixing. | [Spec](../../specs/decisions/carrier-ruling.sdp.md) (`spec:decisions.carrier-ruling`) |
| MD-19 | the prose-ownership law | durable | Prose belongs to typed graph owners. | [Spec](../../specs/decisions/prose-ownership.sdp.md) (`spec:decisions.prose-ownership`) |
| MD-20 | the strict consumer-exclusion contract | durable | Consumer exclusions are explicit root-relative paths. | [Spec](../../specs/decisions/exclusion-contract.sdp.md) (`spec:decisions.exclusion-contract`) |
| MD-21 | the envelope-grammar ownership posture | durable | The Protocol owns the envelope contract, not the YAML library. | [Spec](../../specs/decisions/envelope-grammar-posture.sdp.md) (`spec:decisions.envelope-grammar-posture`) |
| MD-22 | the agent front door | durable | The CLI's one evaluation sink and the exported reader are two entrances over one seam, deriving the graph in process on every invocation. | [Spec](../../specs/decisions/agent-front-door.sdp.md) (`spec:decisions.agent-front-door`) |
| MD-23 | verification posture, not realization | durable | `verification.mode` states intended posture; enabled-verifier realization remains derived. | [Spec](../../specs/decisions/verification-posture-not-realization.sdp.md) (`spec:decisions.verification-posture-not-realization`) |
| MD-24 | the example realization posture | durable | Examples normally carry verification evidence rather than build-backlog work; implementation remains a direct binding-derived fact. | [Spec](../../specs/decisions/example-realization-posture.sdp.md) (`spec:decisions.example-realization-posture`) |
| MD-25 | the Pack syntax ruling | durable | Packs gain a Markdown manifest carrier closed to id · specs · modelRefs with H1 title and prose framing; the TS manifest stays a lawful per-ID option. | [Spec](../../specs/decisions/pack-markdown-carrier.sdp.md) (`spec:decisions.pack-markdown-carrier`) |
| MD-26 | the decision readiness posture | durable | Registry-ratified decision records state `ready`; operational backlog and verifier-gap signals exclude kind `decision` while preserving an explicit count. | [Spec](../../specs/decisions/decision-readiness-posture.sdp.md) (`spec:decisions.decision-readiness-posture`) |
| MD-27 | the Gherkin carrier option | durable | Behavior and example Spec IDs may select a graph-aware Gherkin carrier; Markdown stays default, execution stays behind generated contracts and anchored handlers, and no lifecycle taxonomy is imported. MD-28 settles the canonical suffix as `.sdp.gherkin`. | [Spec](../../specs/decisions/gherkin-carrier-option.sdp.md) (`spec:decisions.gherkin-carrier-option`) |
| MD-28 | the `.sdp.gherkin` extension | durable | Canonical Gherkin carriers use `.sdp.gherkin`; bare `.feature` stays non-canonical import-source territory so Protocol files stay outside default Cucumber globs. | [Spec](../../specs/decisions/sdp-gherkin-extension.sdp.md) (`spec:decisions.sdp-gherkin-extension`) |
| MD-29 | the carrier universality bound | durable | Gherkin remains honest for behavior and example Specs; universality is per-ID carriers plus a generated read projection, with Markdown still the default. | [Spec](../../specs/decisions/carrier-universality.sdp.md) (`spec:decisions.carrier-universality`) |
| MD-30 | structural anchors confer nothing | durable | `component` and `uses` author narrow CodeNode structure while leaving realization, readiness, and delivery facts untouched. | [Spec](../../specs/decisions/structural-anchor-semantics.sdp.md) (`spec:decisions.structural-anchor-semantics`) |
| MD-31 | adopted registrars are committed | durable | A registrar imported by tracked authored code is committed and byte-checked; unadopted registrar siblings remain ignored and regenerable. | [Spec](../../specs/decisions/adopted-registrars-committed.sdp.md) (`spec:decisions.adopted-registrars-committed`) |

### Current executable decision-spec pointers

- [The plain-language references decision](../../specs/decisions/plain-language-references.sdp.md) (`spec:decisions.plain-language-references`).
- [The concept-documents dissolution decision](../../specs/decisions/concept-docs-dissolve.sdp.md) (`spec:decisions.concept-docs-dissolve`).
- [The Pack reified decision](../../specs/decisions/pack-reified.sdp.md) (`spec:decisions.pack-reified`).
- [The agent surface scripts the graph decision](../../specs/decisions/agent-surface-scripts-graph.sdp.md) (`spec:decisions.agent-surface-scripts-graph`).
- [The MCP-deferred decision](../../specs/decisions/mcp-deferred.sdp.md) (`spec:decisions.mcp-deferred`).

## Structural-decision shorthand (D1–D6)

| Label | One line | Canonical in |
|---|---|---|
| **D1** | readiness is separate from delivery facts | [Core model spec](../../specs/model/core-model.sdp.md) (`spec:model.core-model`) |
| **D2** | sections are typed to their evidence role | [Spec sections spec](../../specs/model/spec-sections.sdp.md) (`spec:model.spec-sections`) |
| **D3** | Pack is a reified grouping/aggregate | [Pack reified decision](../../specs/decisions/pack-reified.sdp.md) (`spec:decisions.pack-reified`) |
| **D4** | Design Review is the flagship curated projection | `06` §5 |
| **D5** | the agent surface is a visible graph the agent scripts | [Agent surface scripts the graph decision](../../specs/decisions/agent-surface-scripts-graph.sdp.md) (`spec:decisions.agent-surface-scripts-graph`) |
| **D6** | MCP integration is designed-in and deferred | [MCP-deferred decision](../../specs/decisions/mcp-deferred.sdp.md) (`spec:decisions.mcp-deferred`) |
