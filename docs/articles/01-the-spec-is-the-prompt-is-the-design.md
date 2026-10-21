# The Spec Is the Prompt Is the Design: Why AI-Native Software Delivery Needs One Graph, Not Another Ticket Tracker

> *Series: Introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (Part 1 of 8) · All links and measurements pinned to commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) ([PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)).*

Every software team knows the decay curve of documentation.

At the start of a project, intent is sharp. You write an architecture doc, sketch a few sequence diagrams, record a couple of ADRs, file tickets in your issue tracker, and write tests in your repo. Six weeks later, a customer edge case forces a design change during a pull request. The code changes. The test changes. The architecture doc, the ADR, and the ticket do not. Within a quarter, your documentation is a museum of what you *meant* to build three sprints ago.

Now drop AI coding agents into that repository.

An LLM can write a function in seconds, but when you ask it to change an architectural seam—"update order creation so stock reservation respects our latency constraint"—how does it know what the system guarantees? It greps raw source files, reads stale Markdown, and **hallucinates structure**. It cannot tell an aspirational idea from a settled contract, an implementation shortcut from a ratified decision, or a stub from a verified feature—because **no typed model of the delivery lifecycle exists in the repository for it to reason over**.

[**Libar Software Delivery Protocol**](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (`@libar-dev/software-delivery-protocol`, CLI `sdp`) is our answer: an **executable, self-validating meta-model of the software-delivery process**.

Its premise fits in one sentence:

> **Specs are code; the graph is derived; the `claim` stays honest; git is the event log.**

---

## 1. A Second Take, Front-Loaded with First Principles

The Protocol is not our first attempt at this problem. Its predecessor, [`@libar-dev/architect`](https://github.com/libar-dev/architect), ran in production across 349 architectural patterns. It proved three things that worked: keeping annotations in source beside the code, deriving a single immutable graph as the read model for both documentation and agents, and giving agents a scriptable graph handle instead of raw files.

It also taught us what fails in production:

- **Sprawling tag registries.** When every metadata wish becomes a new `@architect-*` tag across TypeScript and Gherkin, the formal taxonomy and the live parser inevitably drift apart.
- **Process state-machine gates.** Encoding ticket statuses (`candidate → roadmap → active → completed`) inside source files turns your compiler into a workflow bureaucracy.
- **Hand-authored delivery status.** If a human or an agent types `status: completed` into a spec file, that string will eventually lie.

We built the Libar Software Delivery Protocol ([PR #1](https://github.com/libar-dev/software-delivery-protocol/pull/1)) as a clean-sheet second generation—zero backward compatibility, zero old sins carried over—around **three meta-levels** ([the executable meta-model decision, MD-1](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/executable-meta-model.sdp.md)):

| Meta-level | What lives here | Role |
|---|---|---|
| **1. The Protocol** | The `Spec` primitive, descriptors, relations, and validators *as typed code* | Defines the conformance contract |
| **2. The Authored Model** | A project's `Spec`s, `Pack`s, and source `anchor`s committed in the repo | Conforms to the contract (checked in CI, never workflow-gated) |
| **3. Derived Facts** | Machine truth (`implemented`, `has-verifier`, `observed`) and projections | Computed from the graph, **never authored by hand** |

And we bound the entire system with **two permanent honesty guardrails** ([`00-vision-scope-and-mvp-boundary.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/00-vision-scope-and-mvp-boundary.md)):

1. **Checks police conformance and honesty—never content quality, never workflow.** Validators check whether your model is well-formed and whether it is pretending to have evidence it lacks. They never judge whether your design is "good," and they never enforce sprint or ticket state machines ([adopt the nouns, reject the gates, MD-2](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/adopt-the-nouns.sdp.md)).
2. **We claim "deterministically validated," never "provably correct."** Conformance to a typed meta-model is mechanically verifiable; real-world business correctness requires human judgment and runtime evidence.

---

## 2. One Enrichable Primitive: `Spec`

In traditional delivery tooling, an idea changes artifact types as it matures. It starts as a sticky note or Epic, gets rewritten into a PRD, gets copied into an ADR or RFC, gets sliced into Jira Stories, and finally gets re-typed into Gherkin `.feature` files and unit tests. Every migration between artifact types loses context and breaks traceability.

In the Protocol, there is **one authored truth-primitive: `Spec`** ([one primitive, named coordinates, MD-4](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/one-primitive.sdp.md); [`spec:model.core-model`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/core-model.sdp.md)).

A `Spec` keeps its stable, namespaced identity (`spec:orders.create-order`) from its first two-line capture to production realization. Instead of migrating it to a new artifact type, you **enrich it in place** by adding typed sections (`Intent`, `Behavior`, `Rule`, `Workflow`, `Contract`, `Example space`, `Constraints`, `Model`, `Design`, `Decision`, `UI`, `Verification`) or by refining it into child `Spec`s.

Every `Spec` is positioned by **three independent descriptors**:

- **`kind`** *(the category of truth — a true subtype that determines required evidence)*:
  `behavior` (Use Case / Behavior) · `workflow` (Workflow) · `example` (Example / Scenario) · `rule` (Business Rule) · `constraint` (Constraint / NFR) · `model` (Domain Model) · `decision` (Decision Record) · `contract` (Contract).
- **`altitude`** *(size and scope)*:
  `epic → feature → story`.
- **`readiness`** *(author-stated design maturity, checked against a structural floor)*:
  `idea → scoped → defined → ready`.

Familiar delivery nouns—Use Case, NFR, ADR, Epic, Story, Executable Scenario—are **named coordinates on this single primitive**, not separate schemas or tools. Because `altitude` and `readiness` move independently, an `epic`-altitude `behavior` Spec can honestly sit at `scoped` while one of its `story`-altitude `example` children is already `ready` and verified.

Alongside `Spec`, two other authored constructs enter the repository, and **neither states system truth of its own**:

- **`Pack`** (`pack:checkout-v1`, [`spec:model.pack-aggregate`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/pack-aggregate.sdp.md)): a review and reading grouping over `Spec`s. A `Spec` can belong to multiple `Pack`s.
- **`anchor`** ([`spec:model.anchors`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/anchors.sdp.md)): a pointer in source code or tests that binds a code unit (`impl:`, `api:`, `component:`), a test (`test:`), or an expected-outcome oracle (`oracle:`) to `Spec` IDs. An anchor carries identity, bindings, and optional architectural structure—never behavior, rationale, or readiness.

Here is an entire `idea`-rung `Spec` in its default Markdown carrier (`.sdp.md`), scaffolded by `sdp new spec`:

```markdown
---
id: spec:orders.create-order.api-contract
kind: contract
altitude: story
readiness: idea
relations:
  refines: spec:orders.create-order
---

# HTTP contract for order creation

## Intent

- outcome: Define the HTTP request and response payload for POST /orders.

### Open questions

- [blocking #idempotencyHeader] Should the endpoint require an Idempotency-Key header on every POST?
  - decider: owner
  - provisional: Require Idempotency-Key on all order-creation requests.
```

No boilerplate. No mandatory 12-section template to fill out just to capture a thought. Yet it is already a typed node in the graph, joined to `spec:orders.create-order`, carrying a keyed blocking question (`spec:orders.create-order.api-contract#question.idempotencyHeader`) that the validator knows will hold this Spec below `defined` until settled.

---

## 3. The Epistemic Boundary: Why `claim` Separation Changes Everything

Why don't coding agents trust architecture tools? Because most tools mix together three completely different kinds of statements:

1. What a human *intended* the system to do.
2. What a human *bound* in code or tests.
3. What a static-analysis heuristic *guessed* from import statements.

Once those three collapse into a single "dependency" edge, a single bad heuristic poisons the graph.

The Protocol enforces a strict epistemic boundary ([`01-founding-principles-and-invariants.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md), P9 & P10; [`spec:extraction.claim-taxonomy`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/claim-taxonomy.sdp.md)). Every node and every edge in the graph carries a **`claim`** field with one of three values, and **they are never collapsed**:

| `claim` value | Who asserts it | What it means | Authority |
|---|---|---|---|
| **`declared`** | Human author in a `Spec` or `Pack` carrier | Authoritative delivery intent: relations (`refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, `supersedes`), stated readiness, and section content | **Authoritative intent** |
| **`anchored`** | Human author via an in-code `anchor` | Authoritative binding from source code or tests into the graph (`satisfies`, `references`, `verifies`, `models`, `memberOf`, `uses`) | **Authoritative binding** (carries no intent) |
| **`inferred`** | Static analyzer (e.g., `sdp build --imports`) | Mechanical code structure (file-level imports used for curation advice) | **Advisory only** — never confers delivery facts, never triggers validator errors, never silently promoted |

### Stated Readiness vs. Derived Delivery Facts

Because `declared` intent and `anchored` bindings are kept separate, **design maturity** (`readiness`) and **code realization** (`deliveryFacts`) live on orthogonal axes ([`spec:extraction.delivery-facts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/delivery-facts.sdp.md)):

- **Author-stated `readiness` (`idea → scoped → defined → ready`):** What the author states about the maturity of the design, checked against the cumulative [**readiness floor**](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/readiness-floor.sdp.md) (`derivedReadiness`). You cannot state `defined` while a `[blocking]` open question remains open; you cannot state `ready` while a `dependsOn`, `refines`, `constrainedBy`, or `decidedBy` target sits below `defined` ([`spec:validation.typed-dependency-floor`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/typed-dependency-floor.sdp.md)).
- **Derived `deliveryFacts` (`implemented`, `has-verifier`, `observed`):** Computed deterministically from resolving `anchored` edges—**never authored by hand**. Writing `implemented: true` in a Spec file is rejected as an honesty violation (`honesty/authored-delivery-fact`).
  - `implemented` is conferred when at least one resolving code anchor declares `satisfies` to that Spec. It never propagates through `refines` from parent to child or child to parent.
  - `has-verifier` is conferred when a resolving `specTest` anchor verifies the Spec directly, or when a verifying `example` Spec is itself backed by a resolving `specTest` anchor (an **enabled verifier**).

Look at the two payoff queries that fall out of keeping those axes separate:

1. **The Operational Build Backlog ([Recipe 1](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/recipes.md)):**
   \[
   \text{statedReadiness} = \texttt{ready} \;\land\; \texttt{implemented} \notin \text{deliveryFacts} \;\land\; \text{specKind} \notin \{\texttt{example}, \texttt{decision}\}
   \]
   These are the Specs whose design is settled, whose dependencies are at least `defined`, and whose human author has stated `ready`—waiting to be built.
2. **The Drift Alarm ([Recipe 2](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/recipes.md)):**
   \[
   \texttt{implemented} \in \text{deliveryFacts} \;\land\; \text{statedReadiness} \neq \texttt{ready}
   \]
   This is code that ran ahead of its design: an implementation anchor claims to realize a Spec whose design has not been stated `ready`.

---

## 4. Conformance and Honesty Checks (Plus Corpus Rules)

When you run `sdp validate`, every carrier is extracted into the one graph and checked by two validator families ([`spec:validation.two-check-families`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/two-check-families.sdp.md)):

- **Conformance checks** ask: *Is this model well-formed against the Protocol?*
  - Do all relation targets and anchor targets resolve (`conformance/referential-integrity`, with edit-distance suggestions)?
  - Are all IDs unique across `.sdp.md`, `.sdp.ts`, `.sdp.gherkin`, and source anchors (`conformance/duplicate-ids`)?
  - Are `claim` values, descriptors, and structural anchor edges (`memberOf`, `uses`, `layer`, `context`) valid (`conformance/claim-separation`, `conformance/structural-anchors`)?
  - Do `spec:` mentions and entry addresses (`spec:id#design.key`, `#ui.key`, `#question.key`, `#rule.key`) written in prose resolve and have a backing declared relation (`conformance/prose-mentions`)?
- **Honesty checks** ask: *Is this model pretending to be something it isn't?*
  - Did someone try to hand-author a derived edge (`satisfies`, `belongsTo`) or a delivery fact (`implemented`, `has-verifier`) inside a Spec (`honesty/authoring-shape`, `honesty/authored-delivery-fact`)?
  - Does every Spec clear the cumulative structural floor for the `readiness` rung its author stated (`honesty/readiness-floor`)?
  - Are `ready` Specs missing an enabled verifier surfaced visibly as informative `honesty/gaps` warnings without blocking the build?

And when an adopting team has project-specific architectural rules—for instance, "domain components must never use edge components" or "every question must name a decider"—they run **corpus rules** on the same validation path via `sdp validate --rules` ([`spec:validation.corpus-rules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/corpus-rules.sdp.md), introduced in [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)). Corpus findings are reported in their own section, never corrupt Protocol readiness floors, and fail CI when they report an error.

---

## 5. Self-Hosting by the Numbers

The Protocol does not have a separate PRD. It **self-hosts** ([`spec:protocol.self-hosting`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/protocol/self-hosting.sdp.md)): every rule of its model, extractor, validators, projections, and agent surface is authored in its own `.sdp.md` and `.sdp.gherkin` carriers under [`specs/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs), bound to its own TypeScript engine under [`src/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/src) and test suite under [`test/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/test), and certified on every commit by `npm run check`.

At commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (re-run the queries below rather than quoting these numbers across commits), the Protocol's own self-hosting graph measures:

| Dimension | Count at `5a0b22c` | Breakdown |
|---|---|---|
| **Authored `Spec`s** | **276** | `110 example` · `71 behavior` · `41 decision` · `35 rule` · `12 model` · `5 contract` · `1 workflow` · `1 constraint` |
| **Stated `readiness`** | **276** | `245 ready` · `17 defined` · `3 scoped` · `11 idea` |
| **Authored `Pack`s** | **6** | `self-hosting-v1` (276) · `design-management-v1` (24) · `spec-studio-v1` (18) · `corpus-checks-v1` (13) · `design-iteration-v1` (11) · `obsidian-vault-v1` (5) |
| **Source & Test Bindings** | **339** | `160 CodeNode` (`impl:`, `api:`, `component:` across 14 components and 4 layers) · `179 Anchor` (`test:` and `oracle:`) |
| **Derived Graph Size** | **621 nodes · 1,624 edges** | `1,063 declared` edges · `561 anchored` edges · `1,774` entry & relation source locations (schema `0.10.0`) |
| **Derived Delivery Facts** | **94 `implemented` · 205 `has-verifier`** | Operational build backlog (recipe 1): **0** · Drift alarm (recipe 2): **0** · Design backlog (recipe 33): **17** |

Meanwhile, the first external adopter, `libar-platform`, models a six-layer transactional domain platform as **243 Specs across six Packs**, using the Protocol to run token-budgeted design passes, enforce context isolation through `sdp validate --rules`, and publish a 251-page static HTML **Spec Studio** workbench ([PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)).

![The Spec Studio Pack page for pack:corpus-checks-v1](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/protocol-pack.png)

---

## 6. Try It Yourself in 60 Seconds

Clone the repository and query the live self-hosting graph through `sdp q`—the evaluation sink that derives the graph in memory and runs any async JavaScript body you give it:

```sh
git clone https://github.com/libar-dev/software-delivery-protocol.git
cd software-delivery-protocol
npm ci

# 1. Validate the 276-Spec self-hosting corpus
npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity

# 2. Run Recipe 1 (the operational build backlog) and Recipe 2 (the drift alarm)
npm run --silent sdp:q -- "$(cat dist/recipes/01-the-build-backlog.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/02-the-drift-alarm.js)" --json

# 3. Publish the static HTML Spec Studio and open generated/spec-studio/index.html
npm run --silent sdp -- studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

---

## Up Next in the Series

In **[Part 2: From Rough Idea to Verified Code](./02-walkthrough-intent-to-verified-code.md)**, we open the hood on `examples/checkout-v1` and the Protocol's own source code to walk through the complete engineering loop: authoring `.sdp.md` and `.sdp.gherkin` carriers, binding code with constant-form and `@sdp*` comment-form anchors, generating typed step and space contracts, writing an expected-outcome `specOracle`, and deliberately breaking the graph to watch the conformance and honesty checks fire.
