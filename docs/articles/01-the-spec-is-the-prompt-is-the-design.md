# The spec is the prompt is the design: why AI-native delivery needs one graph

*Part 1 in a series introducing the Libar Software Delivery Protocol. Links and measurements are pinned to one commit; see the footer.*

At the start of a project, intent is sharp. You write an architecture document, record a few decisions, file tickets and write tests. Then a customer edge case forces a design change during a pull request. The code and test change. The architecture document, decision record and ticket do not.

An AI coding agent inherits that fragmentation. It can write a function quickly, but it cannot tell an early idea from a settled contract, an implementation shortcut from a ratified decision, or a verifier binding from a passing test. It reads raw files and stale prose, then guesses at the missing structure.

[Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753) (`@libar-dev/software-delivery-protocol`, CLI `sdp`) addresses that missing structure. It is an executable, self-validating meta-model of the software-delivery process.

Its premise has four parts:

> Specs are code; the graph is derived; the `claim` stays honest; git is the event log.

This article explains those parts and what they make possible.

## One Spec, enriched in place

Delivery tools often make an idea change artifact types as it matures. A note becomes a requirement, then a design document, then tickets, then acceptance criteria. Each migration loses context and breaks traceability.

The Protocol has one authored truth-primitive, `Spec`. A Spec keeps its stable, namespaced identity, such as `spec:orders.create-order`, from its first capture through implementation. You enrich it with typed sections or refine it into child Specs. You do not convert it into a different artifact ([`spec:model.core-model`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/model/core-model.sdp.md)).

Three independent descriptors position every Spec:

- `kind` names the category of truth: `behavior`, `workflow`, `example`, `rule`, `constraint`, `model`, `decision` or `contract`.
- `altitude` names size and scope: `epic`, `feature` or `story`.
- `readiness` is the author's stated design maturity: `idea`, `scoped`, `defined` or `ready`.

Use Case, NFR, Decision Record, Epic, Story and Scenario are named coordinates on this one shape, not separate schemas. An Executable Spec is an `example` with a verifier, not another type or a readiness rung.

A Pack groups Specs for reading and review without stating system truth of its own. An anchor binds a code unit, test or expected-outcome oracle into the graph. Anchors carry identity and optional structure, never behavior, rationale or readiness.

### Why the Spec is the prompt

A Spec can carry the intent, rules, examples, constraints, decisions, design entries and open questions needed to implement it. Its graph context also includes relations, source bindings, verifier bindings and the structural floor behind its stated readiness:

```sh
npm run --silent sdp:q -- 'return g.specContext("spec:consumers.reader")' --json
```

"Implement `spec:…`" can therefore be a precise instruction. The agent reads the same authored intent and bindings that a reviewer sees. The work shifts from rewriting briefs for different tools to improving the Spec itself.

That only works when authors avoid padding. The Protocol's readiness floor is a minimum structural requirement, not a quota of sections. A familiar CRUD endpoint may need little detail. A novel business rule may need much more. Checks can tell whether a stated rung clears its floor. They cannot decide whether the design is good.

## The graph is derived

Nobody authors the graph. `sdp build` reads the carriers and source anchors and derives one flat, typed, deterministic document: nodes, edges and a location table. Validators, recipes and projections consume that one read model rather than parsing source into private alternatives ([`spec:extraction.derive-graph`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/extraction/derive-graph.sdp.md)).

Edges that touch the same Spec can carry different claims:

- `refines` from one Spec to another is authored intent with a `declared` claim.
- `satisfies` from a code unit to a Spec comes from an anchor and has an `anchored` claim.
- `belongsTo` from a Spec to its Pack is computed from the Pack manifest and inherits the manifest's `declared` claim.

The distinction is not bookkeeping. It lets a consumer answer "what did the authors intend?" separately from "what source did they bind?" and "what did static analysis infer?"

The graph holds current state at one commit. Git holds prior states, deleted Specs and the answers to "who changed what?" and "when?" A decision may declare `supersedes` while the older record still explains something a reader needs. That is current intent, not a second history store.

## The claim stays honest

Every node and edge has one of three claims:

| Claim | Source | Authority |
|---|---|---|
| `declared` | Human-authored Spec or Pack content | Authoritative intent |
| `anchored` | Human-authored source or test anchor | Authoritative binding, no intent |
| `inferred` | Mechanical analysis | Advisory structure, never silently promoted |

The current curated graph contains declared and anchored content. File-level imports supplied through `sdp build --imports` remain separate inferred input for curation advice. They do not mint curated edges or delivery facts ([`spec:extraction.claim-taxonomy`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/extraction/claim-taxonomy.sdp.md)).

Readiness and realization stay independent too:

- Stated readiness is an author's position, checked against a structural floor.
- Derived readiness is the highest rung whose floor clauses pass. It appears beside the stated rung and never replaces it.
- `implemented` means at least one resolving `satisfies` edge binds code directly to the Spec.
- `has-verifier` means a resolving verifier binding exists. It does not mean the test passed.
- `observed` would record runtime liveness. It is designed for and not derived today.

Two useful queries fall out of this separation.

The operational build backlog finds ready Specs that no code realizes, excluding examples and decision records for their audited realization postures:

```js
g.specs().filter((s) =>
  s.statedReadiness === "ready" &&
  !s.deliveryFacts.includes("implemented") &&
  s.specKind !== "example" &&
  s.specKind !== "decision")
```

The drift alarm finds code ahead of stated design maturity:

```js
g.specs().filter((s) =>
  s.deliveryFacts.includes("implemented") &&
  s.statedReadiness !== "ready")
```

Neither query is a CI failure. They are standing questions over current repository state.

## Checks police conformance and honesty

`sdp validate` runs two check families over the one graph.

Conformance checks ask whether the model is well-formed. They catch unresolved relations, duplicate IDs, invalid claims and malformed structural bindings. Honesty checks ask whether the model is pretending. They reject hand-authored delivery facts and readiness statements that do not clear their floors. Informative gaps, such as a ready Spec without a verifier, remain visible without becoming mandatory workflow gates.

A team can add corpus rules through `sdp validate --rules`. Those findings remain distinct from the Protocol's two families.

The permanent guardrail is worth stating exactly: checks police conformance and honesty, never content quality and never workflow. The strongest claim is "deterministically validated," never "provably correct."

## One graph feeds different consumers

A graph is useful only if people and agents can read it in forms that fit their work.

Agents script the graph through `sdp q` and the exported typed reader. People can read Markdown Design Reviews, census reports, Mermaid diagrams, Gherkin-shaped views, the static HTML Spec Studio or generated Obsidian notes. These are projections, disposable and regenerable rather than rival stores of delivery status.

The Spec Studio makes the human side concrete. A reviewer can explore a Pack, inspect open questions and architecture, compare a design with a base, read supplied run evidence and gather requests as scoped intent. An agent applies accepted changes as ordinary source edits. The view never becomes canonical.

[Part 2](./02-one-graph-many-views.md) develops that human-projection story and its implications for UX/UI design. [Part 4](./04-stop-building-verb-walls-for-coding-agents.md) takes the agent side.

## The Protocol measures itself

The Protocol has no separate PRD. It authors its own rules as Specs, binds its engine and tests to them, derives its own graph and checks that graph in CI ([`spec:protocol.self-hosting`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/protocol/self-hosting.sdp.md)).

<!-- evidence:self-hosting-census -->
Measured at commit `b5e0a8bea1e3bedd48c616f96c9928e955792753`:

| Measure | Value |
|---|---|
| Authored Specs | 456: 447 `ready`, 4 `scoped`, 5 `idea` |
| Packs | 9 |
| Source and test bindings | 241 CodeNodes and 366 Anchors |
| Graph | 1,072 nodes, 2,978 edges, 3,120 locations |
| Delivery facts | 166 `implemented`, 397 `has-verifier`, 0 `observed` |
| Operational build backlog | 2 |
| Drift alarm | 0 |
| Runnable recipes | 55 |
<!-- /evidence:self-hosting-census -->

The [generated baseline metrics](./README.md#step-3-re-derive-corpus-metrics) report self-hosting validation errors and warnings by rule. A `honesty/gaps` warning names a ready Spec without a resolving verifier. Re-run the commands below rather than carrying these numbers to another commit.

The first adopter has also used the Protocol to design a much larger platform ahead of implementation. That story, including context bundles in parts, design slices and corpus rules, belongs to Part 9.

## What the Protocol does not try to be

The Protocol is not a ticket state machine. It adopts delivery nouns such as phase, iteration and release as descriptive vocabulary and projections, not mandatory gates.

It is not an embedded permissions system. Approval belongs in git and CI.

It does not infer intent. Mechanical structure can assist curation, but a person authors intent and bindings.

The aim is to connect adjacent tools rather than replace them. Today the Studio reads supplied CTRF test reports as run evidence. An interface and API reference remains an [idea-stage capture](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/reference-projection.sdp.md). Dedicated integrations with issue trackers and design tools are not designed yet; generic Design and UI prose can mention them without providing that experience.

At the pinned commit, installation is from a reviewed git commit rather than an npm release. The package version is `0.0.0`; `sdp --version` names the build commit.

## Try it

For this source checkout, use Node `^20.19.0 || ^22.12.0 || >=24.0.0`, where the ranges declared by the installed test toolchain (Vitest, Vite and Rolldown) overlap. The installed CLI separately declares Node `>=20`:

```sh
git clone https://github.com/libar-dev/software-delivery-protocol.git
cd software-delivery-protocol
git checkout b5e0a8bea1e3bedd48c616f96c9928e955792753
npm ci

npm run --silent sdp -- validate . \
  --exclude explorations --exclude examples --exclude test/fixtures/import/parity

npm run --silent sdp:q -- "$(cat dist/recipes/01-the-build-backlog.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/02-the-drift-alarm.js)" --json

npm run --silent sdp -- studio . \
  --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Open `generated/spec-studio/index.html`. The `sdp:q` script supplies the repository's three exclusions itself; the explicit CLI commands include them.

## Up next

[Part 2: One graph, many views](./02-one-graph-many-views.md) follows a reviewer through the Studio and asks the question that matters for the first UX/UI design pass: what can change freely when every interface is a projection?

---

*About this article: Part 1 in a series introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753). Repository links and measurements are pinned to commit `b5e0a8be`; re-run the commands rather than quoting the numbers at a later commit.*
