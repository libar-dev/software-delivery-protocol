# The Spec Is the Prompt Is the Design: Why AI-Native Software Delivery Needs One Graph, Not Another Ticket Tracker

*Part 1 of 8 in a series introducing the Libar Software Delivery Protocol. Links and measurements are pinned to one commit; see the footer.*

Every software team knows the decay curve of documentation.

At the start of a project, intent is sharp. You write an architecture doc, sketch a few sequence diagrams, record a couple of ADRs, file tickets in your issue tracker, and write tests in your repo. Six weeks later, a customer edge case forces a design change during a pull request. The code changes. The test changes. The architecture doc, the ADR, and the ticket do not. Within a quarter, your documentation is a museum of what you *meant* to build three sprints ago.

Now drop AI coding agents into that repository.

An LLM can write a function in seconds, but when you ask it to change an architectural seam—"update order creation so stock reservation respects our latency constraint"—how does it know what the system guarantees? It greps raw source files, reads stale Markdown, and **hallucinates structure**. It cannot tell an aspirational idea from a settled contract, an implementation shortcut from a ratified decision, or a stub from a verified feature—because **no typed model of the delivery lifecycle exists in the repository for it to reason over**.

[**Libar Software Delivery Protocol**](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (`@libar-dev/software-delivery-protocol`, CLI `sdp`) is our answer: an **executable, self-validating meta-model of the software-delivery process**.

Its premise fits in one sentence:

> **Specs are code; the graph is derived; the `claim` stays honest; git is the event log.**

This article takes those four clauses in turn, then measures the Protocol against its own corpus.

---

## 1. A Second Take, Front-Loaded with First Principles

The Protocol is not our first attempt at this problem. Its predecessor, [`@libar-dev/architect`](https://github.com/libar-dev/architect), ran in production; its own self-hosted graph held 349 patterns (227 from TypeScript, 122 from Gherkin), as the [annotation scout report in `docs/lineage/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/lineage) measured. It proved three things that worked: keeping annotations in source beside the code, deriving a single immutable graph as the read model for both documentation and agents, and giving agents a scriptable graph handle instead of raw files.

It also taught us what fails in production:

- **Sprawling tag registries.** When every metadata wish becomes a new `@architect-*` tag across TypeScript and Gherkin, the formal taxonomy and the live parser inevitably drift apart.
- **Process state-machine gates.** Encoding ticket statuses (`candidate → roadmap → active → completed`) inside source files turns your compiler into a workflow bureaucracy.
- **Hand-authored delivery status.** If a human or an agent types `status: completed` into a spec file, that string will eventually lie.

We built the Libar Software Delivery Protocol ([PR #1](https://github.com/libar-dev/software-delivery-protocol/pull/1)) as a clean-sheet second generation—zero backward compatibility, zero old sins carried over—around **three meta-levels** ([the executable meta-model decision, MD-1](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/executable-meta-model.sdp.md)):

| Meta-level | What lives here | Role |
|---|---|---|
| **1. The Protocol** | The `Spec` primitive, descriptors, relations, and validators *as typed code* | Defines the conformance contract |
| **2. The Authored Model** | A project's `Spec`s, `Pack`s, and source `anchor`s committed in the repo | Conforms to the contract (checked in CI, never workflow-gated) |
| **3. Derived Facts** | Machine truth (delivery facts such as `implemented` and `has-verifier`) and projections | Computed from the graph, **never authored by hand** |

And we bound the entire system with **two permanent honesty guardrails** ([`00-vision-scope-and-mvp-boundary.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/00-vision-scope-and-mvp-boundary.md)):

1. **Checks police conformance and honesty—never content quality, never workflow.** Validators check whether your model is well-formed and whether it is pretending to have evidence it lacks. They never judge whether your design is "good," and they never enforce sprint or ticket state machines ([adopt the nouns, reject the gates, MD-2](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/adopt-the-nouns.sdp.md)).
2. **We claim "deterministically validated," never "provably correct."** Conformance to a typed meta-model is mechanically verifiable; real-world business correctness requires human judgment and runtime evidence.

---

## 2. One Enrichable Primitive: `Spec`

In traditional delivery tooling, an idea changes artifact types as it matures. It starts as a sticky note or Epic, gets rewritten into a PRD, gets copied into an ADR or RFC, gets sliced into Jira Stories, and finally gets re-typed into Gherkin `.feature` files and unit tests. Every migration between artifact types loses context and breaks traceability.

In the Protocol, there is **one authored truth-primitive: `Spec`** ([one primitive, named coordinates, MD-4](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/one-primitive.sdp.md); [`spec:model.core-model`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/core-model.sdp.md)).

A `Spec` keeps its stable, namespaced identity (`spec:orders.create-order`) from its first two-line capture to production realization. Instead of migrating it to a new artifact type, you **enrich it in place**, by adding detail to its typed sections or by refining it into child `Spec`s. There are **eight typed sections**, one concern each: `intent`, `behavior`, `constraints`, `model`, `design`, `decision`, `verification`, and `ui` ([`spec:model.spec-sections`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/spec-sections.sdp.md)). In the Markdown carrier you will also see `## Rule`, `## Workflow`, `## Contract`, and `## Example space` headings; those are carrier forms of the one `behavior` section, and they reify into it ([`spec:validation.kind-evidence`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/kind-evidence.sdp.md), [`spec:carrier.markdown-body-grammar`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/carrier/markdown-body-grammar.sdp.md)).

Every `Spec` is positioned by **three independent descriptors**:

- **`kind`** *(the category of truth — a true subtype that determines required evidence)*:
  `behavior` (Use Case / Behavior) · `workflow` (Workflow) · `example` (Example / Scenario) · `rule` (Business Rule) · `constraint` (Constraint / NFR) · `model` (Domain Model) · `decision` (Decision Record) · `contract` (Contract).
- **`altitude`** *(size and scope)*:
  `epic → feature → story`.
- **`readiness`** *(author-stated design maturity, checked against a structural floor)*:
  `idea → scoped → defined → ready`.

Familiar delivery nouns—Use Case, NFR, Decision Record, Contract, Epic, Feature, Story, Scenario—are **named coordinates on this single primitive**, not separate schemas or tools. An **Executable Spec** is likewise not a type or a rung: it is an `example` Spec that carries the `has-verifier` delivery fact.

Because a child's readiness statement is its own, parent and child can stand on different rungs. In the worked example the next article tours, the `epic`-altitude `behavior` Spec `spec:orders.order-management` states `defined`, as does the `feature` beneath it, while the `story`-altitude `example` `spec:orders.create-order.valid-cart` already states `ready` and has a bound verifier. The epic could honestly sit at `scoped`, because the example refines the `defined` feature, not the epic. There is one coupling: the `ready` floor requires every `refines`, `dependsOn`, `constrainedBy`, and `decidedBy` target to state at least `defined` (`spec:validation.readiness-floor#rule.readyFloor`, [`spec:validation.typed-dependency-floor`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/typed-dependency-floor.sdp.md)). So a `ready` Spec never refines a `scoped` parent directly.

Alongside `Spec`, two other authored constructs enter the repository, and **neither states system truth of its own**:

- **`Pack`** (`pack:checkout-v1`, [`spec:model.pack-aggregate`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/pack-aggregate.sdp.md)): a review and reading grouping over `Spec`s. A `Spec` can belong to multiple `Pack`s.
- **`anchor`** ([`spec:model.anchors`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/anchors.sdp.md)): a pointer in source code or tests that binds a code unit (`impl:`, `api:`, `component:`), a test (`test:`), or an expected-outcome oracle (`oracle:`) to `Spec` IDs. An anchor carries identity, bindings, and optional architectural structure—never behavior, rationale, or readiness.

### A Spec at its first rung

Suppose the team behind the worked example (`examples/checkout-v1`, Order Management) starts thinking about refunds. One command scaffolds an honest `idea`-rung Spec in the default Markdown carrier (`.sdp.md`):

```sh
npm run --silent sdp -- new spec examples/checkout-v1/specs/orders/refund-order-api-contract.sdp.md \
  --id spec:orders.refund-order.api-contract --kind contract --altitude story \
  --title "HTTP contract for refunding an order" \
  --outcome "Define the HTTP request and response payload for POST /orders/{id}/refunds."
```

`sdp new spec` writes the envelope with `readiness: idea` and `relations: {}`, the `# Title`, an `## Intent` section holding the `- outcome:` line, and the kind's typed heading, here a bare `## Contract`, with no invented content. The author then edits the file in place: one `refines` relation to the Order Management epic, and one keyed blocking question with a decider and a provisional answer:

```markdown
---
id: spec:orders.refund-order.api-contract
kind: contract
altitude: story
readiness: idea
relations:
  refines: spec:orders.order-management
---
# HTTP contract for refunding an order

## Intent

- outcome: Define the HTTP request and response payload for POST /orders/{id}/refunds.

### Open questions

- [blocking #idempotencyHeader] Should the endpoint require an Idempotency-Key header on every refund request?
  - decider: owner
  - provisional: Require an Idempotency-Key header on every refund request.

## Contract
```

Dropped into `examples/checkout-v1/specs/orders/`, that file validates cleanly: `npm run --silent sdp -- validate examples/checkout-v1` reports `12 specs · 1 packs · 5 anchors → 18 nodes · 33 edges` and `validate: 0 errors · 0 warnings`. (The title must follow the closing `---` directly; a blank line between them is refused with `extract/invalid-markdown-structure — the first body line must be an H1 title`.)

No boilerplate. No mandatory twelve-part template to fill out just to capture a thought. Yet it is already a typed node in the graph, joined to `spec:orders.order-management`. Its question has an **entry address**, an address for one keyed entry inside a Spec: `spec:orders.refund-order.api-contract#question.idempotencyHeader`. Another Spec's prose can cite that address, and `sdp validate` reports one that does not resolve; a register, test, or page outside the Specs checks its addresses with address resolution (recipe 25). The floor tells the author what comes next: the empty `## Contract` holds the Spec at `idea` until the contract has its first entry, and once it does, the blocking question holds it below `defined` until someone settles it.

### Why the Spec is the prompt

This is the sense of the title. Because one `Spec` is enriched in place from rough idea to implementable contract, and never migrates across tools, everything an implementer needs about it sits behind one ID in one graph. Feeding an agent that Spec's graph context *is* the implementation prompt:

```sh
npm run --silent sdp:q -- 'return g.specContext("spec:consumers.reader")' --json
```

`g.specContext` returns the Spec's typed sections, its stated and derived readiness with any floor failures, its relations in both directions with their claims, the code units that realize it or answer to it (with file and line), its verifiers and oracle, and the source line of each keyed entry. There is no second brief to write and keep in sync: "implement `spec:…`" is the whole instruction, and the real work moves to maturing and reviewing the Spec.

That only works if Specs stay lean. Principle P4 of the [founding principles](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md) carries the corollary: **significance governs detail, not a tier.** A Spec carries detail only where the work is architecturally significant or genuinely novel; the Nth CRUD endpoint earns a reference, not a re-derivation. Its motto is *"Enrich what matters; reference what is standard; pad nothing."* That is why readiness is a **floor to clear**, never a **quota to fill**: a fixed template pressures every author, and AI authors most of all, to fill sections the work never needed, and padding is noise the next prompt has to read.

---

## 3. The Graph Is Derived, and Git Is the Event Log

### `graph = f(repo)`

Nobody edits the graph. `sdp build` reads every carrier and source anchor and derives one flat document: an array of nodes, an array of edges, and a location table of source lines, with no nesting and nothing hand-maintained ([`spec:extraction.derive-graph`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/derive-graph.sdp.md)). Here is one real `Primitive` node from the Protocol's own graph, complete. Fittingly, it is the Spec that states the regenerability law:

```json
{
  "id": "spec:extraction.regenerability",
  "nodeType": "Primitive",
  "claim": "declared",
  "specKind": "rule",
  "altitude": "feature",
  "readiness": "ready",
  "title": "Generated artifacts are disposable projections",
  "file": "specs/extraction/regenerability.sdp.md",
  "sections": {
    "intent": {
      "outcome": "Keep the repository canonical while allowing every graph and projection to be rebuilt safely."
    },
    "behavior": {
      "rules": [
        "Generated artifacts are disposable: deleting them and rebuilding from the same committed repository produces the same bytes.",
        "Consumers read the graph or link to source locations recorded in it; they never re-parse source or keep a parallel model.",
        "The graph is one JSON document queried in memory."
      ]
    }
  },
  "deliveryFacts": ["implemented", "has-verifier"]
}
```

And these are the five edges that touch it. Hierarchy, membership, and bindings are all just edges, and every edge carries its `claim`:

```json
[
  { "from": "spec:decisions.studio-html-surface", "type": "dependsOn", "to": "spec:extraction.regenerability", "claim": "declared",
    "reason": "disposable HTML can be regenerated from the graph instead of committed as authored source" },
  { "from": "spec:extraction.regenerability", "type": "refines", "to": "spec:extraction.determinism", "claim": "declared" },
  { "from": "spec:extraction.regenerability", "type": "belongsTo", "to": "pack:self-hosting-v1", "claim": "declared" },
  { "from": "impl:protocol.regenerability", "type": "satisfies", "to": "spec:extraction.regenerability", "claim": "anchored" },
  { "from": "test:protocol.regenerability", "type": "verifies", "to": "spec:extraction.regenerability", "claim": "anchored" }
]
```

The `refines` and `dependsOn` edges are authored relations (`declared`). The `belongsTo` edge is computed from the Pack manifest and inherits the manifest's `declared` claim. The `satisfies` and `verifies` edges come from a code anchor and a test anchor (`anchored`), and they are why the node's `deliveryFacts` read `implemented` and `has-verifier`. Reproduce the excerpt with:

```sh
npm run --silent sdp:q -- 'const id = "spec:extraction.regenerability"; return { node: graph.nodes.find((n) => n.id === id), edges: graph.edges.filter((e) => e.from === id || e.to === id) }' --json
```

Derivation is deterministic: stable ordering, no timestamps, `graph = f(repo)` and `view = f(graph)`. The regenerability invariant follows: **delete `generated/` and rebuild, and you get the same bytes** ([`spec:extraction.regenerability`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/regenerability.sdp.md)). Every validator, human view, and agent query reads this one graph, so none of them can disagree with another about what the repository says.

### Git is the event log

The graph holds only the current state of the repository at one commit. It keeps no deleted or superseded "ghost" nodes, no change history, and no audit tables. When a Spec is removed, it is gone from the graph; to read what it used to say, check out an earlier commit and regenerate. "Who changed what, and when" is `git log` and `git blame`, never graph state.

There is one narrow exception, and it holds because it is current intent rather than history. A decision record may declare `supersedes` another decision record while both are present and the older one still explains something a reader needs. Once it no longer does, the older record is deleted and git holds its history. The Protocol's own registry shows this: the decision that kept source comments out of the graph (MD-35) was replaced by the comment form (MD-36) and then deleted; [`DECISIONS.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/DECISIONS.md) keeps a `deleted` row naming the commit that holds its last text.

---

## 4. The Epistemic Boundary: Why `claim` Separation Changes Everything

Why don't coding agents trust architecture tools? Because most tools mix together three completely different kinds of statements:

1. What a human *intended* the system to do.
2. What a human *bound* in code or tests.
3. What a static-analysis heuristic *guessed* from import statements.

Once those three collapse into a single "dependency" edge, a single bad heuristic poisons the graph.

The graph keeps a strict epistemic boundary (a working name; see Principles P9 and P10 in [`01-founding-principles-and-invariants.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md), and [`spec:extraction.claim-taxonomy`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/claim-taxonomy.sdp.md)). A **`claim`** records a fact's epistemic status, and its three values are **never collapsed**. Every node and edge in the curated graph carries `declared` or `anchored`. The third value, `inferred`, names mechanical structure: the file-level imports that `sdp build --imports` writes beside the graph. That input is kept apart from the curated graph, feeds curation advice, and never derives a curated edge, a binding, or a delivery fact.

| `claim` value | Who asserts it | What it means | Authority |
|---|---|---|---|
| **`declared`** | Human author in a `Spec` or `Pack` carrier | Delivery intent: relations (`refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, `supersedes`), stated readiness, section content, and Pack membership (`belongsTo`, computed from the manifest) | **Authoritative intent** |
| **`anchored`** | Human author via an in-code `anchor` | A binding from source code or tests into the graph (`satisfies`, `references`, `verifies`, `models`, `memberOf`, `uses`) | **Authoritative binding** (carries no intent) |
| **`inferred`** | Static analyzer (the TypeScript imports adapter behind `sdp build --imports`) | Mechanical code structure (file-level imports), held outside the curated graph | **Advisory only** — feeds curation advice; never derives a curated edge, binding, or delivery fact; never triggers a validator error; never silently promoted |

### Stated Readiness vs. Derived Delivery Facts

Because `declared` intent and `anchored` bindings are kept separate, **design maturity** (`readiness`) and **code realization** (`deliveryFacts`) are independent coordinates (readiness is separate from delivery facts, D1; [`spec:extraction.delivery-facts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/delivery-facts.sdp.md)):

- **Author-stated `readiness` (`idea → scoped → defined → ready`):** What the author states about the maturity of the design, checked against the cumulative [**readiness floor**](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/readiness-floor.sdp.md). The graph also computes **`derivedReadiness`**, the highest rung whose cumulative floor clauses all pass, and renders it beside `statedReadiness`; it never overwrites the author's statement. You cannot state `defined` while a `[blocking]` open question remains open, and you cannot state `ready` while a `dependsOn`, `refines`, `constrainedBy`, or `decidedBy` target sits below `defined`.
- **Derived `deliveryFacts`:** Computed deterministically from resolving `anchored` edges—**never authored by hand**. `implemented` and `has-verifier` are derived today; `observed`, the runtime liveness fact, is designed for and not yet derived.
  - `implemented` is conferred when at least one anchored `satisfies` edge from a code anchor resolves to that Spec. It never propagates through `refines` from parent to child or child to parent.
  - `has-verifier` is conferred when a resolving `specTest` anchor verifies the Spec directly, or when a verifying `example` Spec is itself backed by a resolving `specTest` anchor (an **enabled verifier**). It says a verifier binding exists, not that the test passed.

Every route to hand-authoring a delivery fact is refused, each with its own finding:

- Writing `implemented: true` in a Spec's frontmatter is refused at extraction (`extract/reserved-property`).
- Writing a derived edge such as `satisfies` under `relations` is refused at extraction (`extract/invalid-frontmatter`).
- Smuggling a delivery fact into a section fails `honesty/authoring-shape`.
- A graph whose stated delivery facts disagree with its bindings, from any graph producer, fails `honesty/delivery-facts`.

Look at the two payoff queries that fall out of keeping those coordinates separate. Each is a filter over the reader's `g.specs()`; the shipped recipes, runnable `sdp q` bodies cataloged in [`docs/agent-surface/recipes.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/recipes.md) and each executed as written by the test suite, wrap these expressions with counts and audit rows.

1. **The operational build backlog (recipe 1):** Specs whose design is settled, whose typed dependencies are at least `defined`, and whose author has stated `ready`, waiting to be built. Ready `example` and `decision` Specs are excluded and counted, because examples carry verification evidence and decision records are ratified rather than built (the example realization posture, MD-24, and the decision readiness posture, MD-26).

   ```js
   g.specs().filter((s) =>
     s.statedReadiness === "ready" &&
     !s.deliveryFacts.includes("implemented") &&
     s.specKind !== "example" &&
     s.specKind !== "decision")
   ```

2. **The drift alarm (recipe 2):** Code that ran ahead of its design: a code anchor binds an implementation to a Spec whose author has not stated `ready`.

   ```js
   g.specs().filter((s) =>
     s.deliveryFacts.includes("implemented") &&
     s.statedReadiness !== "ready")
   ```

Neither query is a CI failure. They are standing questions anyone can ask the graph at any commit.

---

## 5. Conformance and Honesty Checks (Plus Corpus Rules)

When you run `sdp validate`, every carrier is extracted into the one graph and checked by two validator families ([`spec:validation.two-check-families`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/two-check-families.sdp.md)):

- **Conformance checks** ask: *Is this model well-formed against the Protocol?*
  - Do all relation targets and anchor targets resolve (`conformance/referential-integrity`, with a nearest-ID suggestion)?
  - Are all IDs unique across `.sdp.md`, `.sdp.ts`, `.sdp.gherkin`, and source anchors? The extractor reports each duplicate site (`extract/duplicate-id`) and keeps those carriers out of the graph; `conformance/duplicate-ids` is the backstop for any other graph producer.
  - Do `claim` values, node types, edge types, and descriptors stay inside their closed sets (`conformance/claim-separation`)?
  - Are the structural edges `memberOf` and `uses`, and the design-reference edge `references`, well-formed (`conformance/structural-anchors`)? `layer` and `context` are attributes of a `component:` anchor rather than edges; a `layer` outside its closed set, or either attribute on a non-component anchor, is refused at extraction.
  - Do `spec:` mentions and entry addresses (`spec:id#design.key`, `#ui.key`, `#question.key`, `#rule.key`) written in prose resolve (`conformance/prose-mentions`)? A mention or entry address that does not resolve is an error. A resolving mention between two Specs where neither declares a relation to the other is an informative warning, reported once per pair.
- **Honesty checks** ask: *Is this model pretending to be something it isn't?*
  - Did someone hand-author a delivery fact or a derived edge? (The refusals listed in the previous section: `extract/reserved-property` and `extract/invalid-frontmatter` at extraction, `honesty/authoring-shape` and `honesty/delivery-facts` over the graph.)
  - Does every Spec clear the cumulative structural floor for the `readiness` rung its author stated (`honesty/readiness-floor`)?
  - Are `ready` Specs (excluding `decision` Specs, under the decision readiness posture, MD-26) that have no resolving verifier surfaced as informative `honesty/gaps` warnings, never blocking the build?

And when an adopting team has project-specific architectural rules—for instance, "domain components must never use edge components" or "every question must name a decider"—they run **corpus rules** on the same validation path via `sdp validate --rules` ([`spec:validation.corpus-rules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/corpus-rules.sdp.md), introduced in [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)). Corpus findings are reported in their own section, never move a readiness floor or change a Protocol finding, and make `sdp validate` exit nonzero when they report an error.

---

## 6. Self-Hosting by the Numbers

The Protocol does not have a separate PRD. It **self-hosts** ([`spec:protocol.self-hosting`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/protocol/self-hosting.sdp.md)): every rule of its model, extractor, validators, projections, and agent surface is authored in its own `.sdp.md` and `.sdp.gherkin` carriers under [`specs/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs), bound to its own TypeScript engine under [`src/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/src) and test suite under [`test/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/test), and certified on every commit by `npm run check`.

At commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (re-run the queries below rather than quoting these numbers across commits), the Protocol's own self-hosting graph measures:

| Dimension | Count at `5a0b22c` | Breakdown |
|---|---|---|
| **Authored `Spec`s** | **276** | `110 example` · `71 behavior` · `41 decision` · `35 rule` · `12 model` · `5 contract` · `1 workflow` · `1 constraint` |
| **Stated `readiness`** | **276** | `245 ready` · `17 defined` · `3 scoped` · `11 idea` |
| **Authored `Pack`s** | **6** | `self-hosting-v1` (276) · `design-management-v1` (24) · `spec-studio-v1` (18) · `corpus-checks-v1` (13) · `design-iteration-v1` (11) · `obsidian-vault-v1` (5) |
| **Source & test bindings** | **339** | `160 CodeNode` (`146 impl:`, `14 component:` across 14 components and 4 layers; code anchors also admit `api:`) · `179 Anchor` (`172 test:`, `7 oracle:`) |
| **Derived graph size** | **621 nodes · 1,624 edges** | `1,063 declared` edges · `561 anchored` edges · `1,774` entry and relation source locations (schema `0.10.0`) |
| **Derived delivery facts** | **94 `implemented` · 205 `has-verifier`** | Operational build backlog (recipe 1): **0** · Drift alarm (recipe 2): **0** · Design backlog (recipe 33): **17** |

Re-derive the breakdowns with:

```sh
npm run --silent sdp:q -- 'const tally = (xs, f) => xs.reduce((a, x) => ((a[f(x)] = (a[f(x)] || 0) + 1), a), {}); return { kinds: tally(g.specs(), (s) => s.specKind), readiness: tally(g.specs(), (s) => s.statedReadiness), nodeTypes: tally(graph.nodes, (n) => n.nodeType), bindingNamespaces: tally(graph.nodes.filter((n) => n.nodeType === "CodeNode" || n.nodeType === "Anchor"), (n) => n.id.split(":")[0]), edgeClaims: tally(graph.edges, (e) => e.claim), locations: graph.locations.length }' --json
```

The self-hosting `validate` run prints `0 errors · 6 warnings`, and all six are intentional, pinned by the self-hosting oracle: five `conformance/prose-mentions` warnings, where one Spec names another (three times in an open question's `links:` field, twice in rule text) without a declared relation between them, and one `honesty/gaps` warning on `spec:model.spec-sections`, an owner-ratified `ready` Spec with no resolving verifier.

Meanwhile, the first adopter, [`libar-platform`](https://github.com/libar-dev/libar-platform) (a separate repository in the `libar-dev` organization), models a Convex transactional domain platform as **243 Specs across six Packs**, most of it designed ahead of its code. It runs design passes whose reading is composed within a 100,000-UTF-16-unit context bundle, checks its own architecture and policy rules through `sdp validate --rules`, and publishes 251 static **Spec Studio** pages. The Protocol work that made that possible is [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33); the adopter's side is [`libar-platform#13`](https://github.com/libar-dev/libar-platform/pull/13).

The Spec Studio renders the same graph for people. Here is the Protocol's own `pack:corpus-checks-v1`, the Pack that carries corpus rules:

![The Spec Studio Pack page for pack:corpus-checks-v1: a plain-language summary, the Pack's framing, and one collapsed card per member](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/protocol-pack.png)

*The Pack page for `pack:corpus-checks-v1`, published by `sdp studio` and opened from `file://` with no network. It leads with a summary the graph computes, then the Pack's framing, then one card per member with its rung, floor, questions, and bindings. Captured for [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33).*

---

## 7. Scope, Non-Goals, and How Adopters Install Today

Some things the Protocol deliberately is not ([`00` §5, non-goals](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/00-vision-scope-and-mvp-boundary.md)):

- **Not a workflow state machine.** It adopts the delivery nouns (phase, iteration, milestone, release) as descriptive vocabulary and rejects the gates. "In sprint / in review / in QA" status stays in your issue tracker, linked through a separate index.
- **Not an embedded RBAC or governance engine.** Change approval lives in git and CI (pull request review, CODEOWNERS). A Spec names no owner, and an open question's `decider:` names who settles it, never an authorization.
- **Not an intent inferer.** Structure is extracted; intent is always authored. Inference assists and never asserts.
- **Not a replacement for adjacent tools.** It is the membrane that links issue trackers, design tools, LikeC4, and OpenAPI, not a substitute for them.
- **No separate PRD.** The jobs live in [`jtbd-stories/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/jtbd-stories) and the laws live in [`specs/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs).

And where it stands today:

- **Install from a reviewed commit.** The package version is `0.0.0` and no npm prerelease is published. An adopter pins `"@libar-dev/software-delivery-protocol": "github:libar-dev/software-delivery-protocol#<sha>"` to a commit it reviewed; the package's `prepare` script builds the CLI, subpath exports, and shipped recipes during the git install, and `sdp --version` prints the pinned commit. The [README](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/README.md) covers the npm and pnpm build approvals.
- **Designed in, deferred.** The `observed` delivery fact (runtime liveness) and the MCP surface for user-facing apps (the MCP-deferred decision, D6) are designed for and not built.
- **Verdicts stay in CI.** `has-verifier` means a verifier binding exists. Pass, fail, skip, and quarantine never enter the graph.

---

## 8. Try It Yourself in 60 Seconds

Clone the repository at the commit these numbers were measured at, and query the self-hosting graph through `sdp q`—the evaluation sink that derives the graph in memory and runs any async JavaScript body you give it:

```sh
git clone https://github.com/libar-dev/software-delivery-protocol.git
cd software-delivery-protocol
git checkout 5a0b22c2d9ead98c900b60ed6209342fce2cbef6
npm ci   # the prepare script builds dist/

# 1. Validate the 276-Spec self-hosting corpus (0 errors · 6 warnings)
npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity

# 2. Run recipe 1 (the operational build backlog) and recipe 2 (the drift alarm)
npm run --silent sdp:q -- "$(cat dist/recipes/01-the-build-backlog.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/02-the-drift-alarm.js)" --json

# 3. Publish the static HTML Spec Studio, then open generated/spec-studio/index.html
npm run --silent sdp -- studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

The three `--exclude` flags keep the exploration exhibits, the separate worked example, and the carrier-parity fixtures (which deliberately duplicate IDs) out of the self-hosting root; the `sdp:q` script supplies them for you.

---

## Up Next in the Series

In **Part 2: From Rough Idea to Verified Code** ([read it here](./02-walkthrough-intent-to-verified-code.md), or [on GitHub](https://github.com/libar-dev/software-delivery-protocol/blob/ARTICLES_COMMIT/docs/articles/02-walkthrough-intent-to-verified-code.md)), we open `examples/checkout-v1` and the Protocol's own source code to walk the complete engineering loop: authoring `.sdp.md` carriers (and where `.sdp.gherkin` fits), binding code with constant-form and `@sdp*` comment-form anchors, generating typed step and space contracts, writing an expected-outcome `specOracle`, and deliberately breaking the graph to watch the extraction, conformance, honesty, and contract checks fire.

---

*About this article: Part 1 of 8 in a series introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6). Repository links and every measurement are pinned to commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6), the merge of [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33); re-run the commands rather than quoting the numbers at a later commit.*
