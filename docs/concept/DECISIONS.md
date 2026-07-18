# Decision registry — Libar Software Delivery Protocol

> The registry retains durable decision names, one-line glosses, and their carrying Specs. Historical execution and rationale live in git, plans, and the Specs themselves.

## The ratified-name registry

In prose, lead with meaning and use a code only as a parenthetical lookup key. Curation records the ADR three-part test: hard to reverse, surprising without context, and a real trade-off.

| ID | Ratified name | Curation | Gloss | Spec pointer or reservation |
|---|---|---|---|---|
| MD-1 | the executable meta-model | durable | Delivery intent conforms to a typed executable meta-model. | [Spec](../../specs/decisions/executable-meta-model.sdp.md) (`spec:decisions.executable-meta-model`) |
| MD-2 | adopt the nouns, reject the gates | durable | Shared delivery nouns do not imply workflow gates. | [Spec](../../specs/decisions/adopt-the-nouns.sdp.md) (`spec:decisions.adopt-the-nouns`) |
| MD-4 | one primitive, named coordinates | durable | One enrichable Spec carries independent coordinates. | [Spec](../../specs/decisions/one-primitive.sdp.md) (`spec:decisions.one-primitive`) |
| MD-5 | the protocol naming | durable | The product and protocol names remain stable. | [Spec](../../specs/decisions/protocol-naming.sdp.md) (`spec:decisions.protocol-naming`) |
| MD-7 | binding, never liveness | durable | Anchors state bindings, never runtime truth. | [Spec](../../specs/decisions/binding-not-liveness.sdp.md) (`spec:decisions.binding-not-liveness`) |
| MD-8 | the generic `codeAnchor` | folded | One generic binding form spans code locations. | `src/model/anchors.ts` |
| MD-9 | the open-questions home | folds | Unsettled durable questions live on their Spec. | `src/model/sections.ts`, `05` §3 |
| MD-10 | content-only sections | durable | Sections carry content while relations carry links. | [Spec](../../specs/decisions/content-only-sections.sdp.md) (`spec:decisions.content-only-sections`) |
| MD-11 | the typing law | durable | Floor-read sections have closed typed shapes. | [Spec](../../specs/decisions/typing-law.sdp.md) (`spec:decisions.typing-law`) |
| MD-12 | the kind-conditional floor | durable | Readiness evidence varies with the Spec kind. | [Spec](../../specs/decisions/kind-conditional-floor.sdp.md) (`spec:decisions.kind-conditional-floor`) |
| MD-13 | floor-table-as-truth | folds | The floor table is its code-level source of truth. | `05` §3, `src/validate/readiness-floor.ts` |
| MD-14 | one validation path | durable | Validation runs only through the derived graph. | [Spec](../../specs/decisions/one-validation-path.sdp.md) (`spec:decisions.one-validation-path`) |
| MD-15 | the `.sdp.ts` extension | durable | The extension law is re-pointed, not repealed: carrier extensions identify Specs without test-glob collisions. | [Spec](../../specs/decisions/sdp-ts-extension.sdp.md) (`spec:decisions.sdp-ts-extension`) |
| MD-16 | carried evidence | durable | Promoted evidence must carry the evidence it represents. | [Spec](../../specs/decisions/carried-evidence.sdp.md) (`spec:decisions.carried-evidence`) |
| MD-17 | point-per-example | durable | Each example is one bound point. | [Spec](../../specs/decisions/point-per-example.sdp.md) (`spec:decisions.point-per-example`) |
| MD-18 | the carrier ruling | durable | Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option. The surviving law is one canonical surface per ID, no mixing. | [Spec](../../specs/decisions/carrier-ruling.sdp.md) (`spec:decisions.carrier-ruling`) |
| MD-19 | the prose-ownership law | durable | Prose belongs to typed graph owners. | [Spec](../../specs/decisions/prose-ownership.sdp.md) (`spec:decisions.prose-ownership`) |
| MD-20 | the strict consumer-exclusion contract | durable | Consumer exclusions are explicit root-relative paths. | [Spec](../../specs/decisions/exclusion-contract.sdp.md) (`spec:decisions.exclusion-contract`) |
| MD-21 | the envelope-grammar ownership posture | durable | The Protocol owns the envelope contract, not the YAML library. | [Spec](../../specs/decisions/envelope-grammar-posture.sdp.md) (`spec:decisions.envelope-grammar-posture`) |

### Current executable decision-spec pointers

- [The plain-language references decision](../../specs/decisions/plain-language-references.sdp.md) (`spec:decisions.plain-language-references`).
- [The concept-documents dissolution decision](../../specs/decisions/concept-docs-dissolve.sdp.md) (`spec:decisions.concept-docs-dissolve`).

## Structural-decision shorthand (D1–D6)

| Label | One line | Canonical in |
|---|---|---|
| **D1** | readiness is separate from delivery facts | `02` §2 |
| **D2** | sections are typed to their evidence role | `02` §3 |
| **D3** | Pack is a reified grouping/aggregate | `02` §4 |
| **D4** | Design Review is the flagship curated projection | `06` §5 |
| **D5** | the agent surface is a visible graph the agent scripts | `06` §3 |
| **D6** | MCP integration is designed-in and deferred | `06` §7 |
