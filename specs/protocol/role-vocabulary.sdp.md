---
id: spec:protocol.role-vocabulary
kind: model
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:protocol.structural-self-binding
    reason: names what each role value the engine's significant units carry means
  decidedBy: spec:decisions.architectural-annotation
---
# The engine's architectural roles each name one pattern

Authors choose a role by the architectural responsibility a unit owns. The same responsibility uses the same word across the engine. These definitions are this corpus's design vocabulary, not a Protocol enum or a registry a validator checks. An adopter may use other roles for its own architecture.

## Intent

- outcome: Define each architectural role the engine's anchors use, so the accepted set of significant units reads as a curated register of the engine's patterns and abstractions.

## Model

- **adapter** — [#adapter] Connects an external tool or runtime to an engine contract, such as a test runner or a TypeScript import reader.
- **codec** — [#codec] Parses, normalizes or encodes a representation while preserving the meaning owned by its contract, such as ids, carrier text, parameter input or source links.
- **contract** — [#contract] Owns a shared interface, data shape, closed vocabulary or public boundary that independently developed callers and providers must agree on.
- **decider** — [#decider] Computes a semantic answer from explicit inputs without reading or writing external state, such as delivery facts or example eligibility.
- **extractor** — [#extractor] Reads authored carriers or source bindings, or composes their reified results, into the graph and its located evidence.
- **interaction** — [#interaction] Adds browser controls and feedback to build-rendered content without owning its graph joins or layout. This is a corpus role for optional element behavior.
- **projection** — [#projection] Derives read-only presentation or generated contract content from the graph, the reader or an explicitly supplied answer. A page fragment and a complete page use the same role when both own presentation.
- **publisher** — [#publisher] Writes or synchronizes an owned artifact set, including its path checks, replacement, recovery and clean comparison.
- **index** — [#index] Builds a disposable lookup structure over the graph for the units that query it; it holds no authored state and is never a second read model.
- **reader** — [#reader] Answers queries over graph content, resolving or joining recorded identities and bindings without reading source files.
- **service** — [#service] Coordinates a use case or pipeline across collaborators, including execution and failure handling, while each collaborator owns its own contract.
- **validator** — [#validator] Evaluates a stated contract and reports its failures, including readiness clauses, import fidelity and corpus-selected checks. A role does not determine a Protocol validator family.

## Design

- roleChoice: Use the dominant responsibility of the anchored unit. A catalog of shared shapes is a contract, a table computing a semantic answer is a decider, and a failure-producing check is a validator. File size, caller count and naming style never select a role.
- componentRole: A component anchor's role names the dominant architectural responsibility its members serve together, read from their reviewed responsibilities rather than a count of role tokens. Omit the role when no responsibility dominates.
- presentationWord: Use projection for pure page, fragment and text-equivalent rendering. Use publisher for filesystem publication, codec for representation encoding and interaction for optional DOM behavior; a unit that presents uses projection, never renderer.
- helperWord: Choose a specific responsibility after reading the code. Graph indexes use index, concept queries use reader, parameter and path encoders use codec, browser controls use interaction and test-runtime integration uses adapter.
- freeVocabulary: These Model terms explain the engine's role values. Token grammar remains the only Protocol check on role, omission remains lawful, and this Model is not an adopter-wide allowlist; the self-hosting suite pins each accepted engine unit's role.

## Verification — reviewed

- Compare the graph's role taxonomy with these meanings and review every renamed unit against its implementation; keep an unfamiliar adopter role visible without reporting a Protocol finding.
- Check that pure presentation uses projection across the Markdown and Studio implementations, and that publication and optional browser interaction retain their distinct responsibilities.
