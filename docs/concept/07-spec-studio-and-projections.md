# 07 — Spec Studio & Projections

This document covers the *human-facing surface* of Libar Omni: the **HTML Spec Studio** (the interactive workbench generated from the graph) and the other generated projections — LikeC4 diagrams, Gherkin exports, OpenAPI/AsyncAPI, JSON-LD, AI context slices, traceability matrices, and dashboards.

The product thesis here, drawn directly from `08.md` and `07-anthropic-post.md`:

> **Specs are code. HTML is the lens. Interactions produce patches. Validators decide what is allowed.**

Generated HTML is the primary stakeholder surface. Markdown remains a fallback. The Spec Studio is **read-rich and write-careful**: it makes the graph deeply explorable, but every edit round-trips through validated JSON patches before touching the canonical TypeScript.

---

## 1. Why HTML, not Markdown, as the primary surface

The argument from the input documents (especially `07-anthropic-post.md`):

- **Markdown caps out at ~100 lines.** Beyond that, nobody — including authors — reads it. Large specs are common; Markdown rots into wall-of-text quickly.
- **HTML conveys richer information density.** Tables, SVG diagrams, code blocks with syntax highlighting, embedded harnesses, interactive sliders, side-by-side comparisons, tabbed views — all native.
- **HTML is shareable.** Upload to S3 (or any static host); send a link. No rendering-engine mismatch between viewers.
- **HTML is interactive.** Slidersize an NFR target; toggle a scenario harness; reorder pack contents via drag-and-drop. Markdown cannot do this.
- **AI-driven editing flips the equation.** When the model writes specs, the human's primary act is *review*. HTML beats Markdown for review by a wide margin.
- **The download is acceptable.** ~2-4× the generation time of Markdown; with prompt caching and 1MM-token windows, the token cost is negligible for the value gained.

The principal trade-off — *HTML diffs are noisier in Git* — is sidestepped by the architectural rule: HTML is **derived**, never committed in raw form. Git diffs are over the canonical TypeScript specs.

---

## 2. Spec Studio — anatomy

The Spec Studio is a generated, mostly-static SPA living in `/generated/spec-studio/`. Its constraints:

- **Statically buildable** — `index.html` plus assets; no server.
- **Offline-friendly** — works opened directly from filesystem (`file://`) for local use; works hosted on any static host for sharing.
- **Hydrates from `/generated/spec-studio/data/*.json`** — graph, validation, AI slices.
- **Reproducible** — same graph → byte-identical assets (modulo asset hashes embedded in filenames).
- **Web-components-based** — see §3.

### 2.1 Information architecture

The Studio organises content around four lenses:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Top nav                                                                 │
│  [Packs] [Capabilities] [Architecture] [Tests] [Evidence] [Search]      │
└──────────────────────────────────────────────────────────────────────────┘
┌────────────────────┬─────────────────────────────────────────────────────┐
│  Left rail         │  Main canvas                                        │
│                    │                                                     │
│  Pack: Checkout    │  ┌─ spec:orders.create-order ──────────────────┐   │
│  ├ specs           │  │ Overview                                    │   │
│  │ ├ create-order  │  │   readiness: bound  abstraction: feature   │   │
│  │ ├ authorize     │  │ Intent                                      │   │
│  │ └ …             │  │ Behavior                                    │   │
│  └ harnesses       │  │ Constraints                                 │   │
│                    │  │ Design                                      │   │
│  Recent edits      │  │ Runtime                                     │   │
│                    │  │ Bindings                                    │   │
│  Validation: 2 W   │  │ Verification                                │   │
│                    │  │ Evidence                                    │   │
│                    │  │ Relations / Impact                          │   │
│                    │  │ UI / Stories                                │   │
│                    │  │ Patch / Export                              │   │
│                    │  └─────────────────────────────────────────────┘   │
└────────────────────┴─────────────────────────────────────────────────────┘
```

### 2.2 The four lenses

**Lens 1 — Packs / Specs**: a spec-by-spec tree organised by `SpecPack` or `Capability`. The default landing page.

**Lens 2 — Architecture**: the graph rendered as components, dependencies, runtime layers, ports, and external systems. LikeC4 diagrams are *embedded* (interactive — click a component to open its detail).

**Lens 3 — Tests / Verification**: a coverage view. For each Spec, the list of `Test` nodes, their last `TestRun` results, and which spec rules are not exercised.

**Lens 4 — Evidence**: build provenance, SBOM links, OTel observations, deployment history. Read-only.

A persistent **Search** indexes all spec titles, IDs, tags, terms, and notes. Search results show the readiness state and a click-through into the spec page.

### 2.3 A spec detail page in depth

For a single spec (e.g. `spec:orders.create-order`), the page renders ten sections. Each section is independently collapsible.

#### Section A — Header

```
spec:orders.create-order                  bound · feature · behavior
"Customer creates an order"

Owner: @orders-team        Capability: order-management        Pack: pack:checkout-v1
Tags: customer-facing, p0  Last verified: 2026-05-17 09:14Z   2 warnings
```

Visual cue colors:

- Readiness: light grey (`sketch`) → blue (`framed`) → cyan (`specified`) → green (`designed`) → emerald (`bound`) → indigo (`executable`) → violet (`verified`). Colour-blind palette pinned.
- Warning/error counts as pill badges.

#### Section B — Intent

Prose rendering of `IntentFacet`. Open questions get a dedicated panel:

```
Open questions (2)
─────────────────────────────────────────────────
○ Should inventory reservation precede payment?
  blocking: false · owner: @arch · added 2026-04-12
  [ Mark resolved ]   [ Promote to ADR ]

○ Should OrderCreated be emitted before or after the confirmation email?
  blocking: false · owner: @orders-team
  [ Mark resolved ]   [ Promote to ADR ]
```

The buttons produce patches (covered in §6).

#### Section C — Behaviour

Rules and examples. Examples are interactive cards:

```
Rule: Only valid carts can become orders
  Examples:
  ┌─────────────────────────────────────────────────┐
  │ ✓ Valid cart creates an order          executable │
  │ Given a customer has a valid cart                │
  │   And all items are available                    │
  │ When the customer submits the order              │
  │ Then an order is created                         │
  │   And an OrderCreated event is emitted           │
  │                                                  │
  │ [ View test ]  [ Run again ]  [ Edit example ]  │
  └─────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────┐
  │ □ Cart contains unavailable item        framed   │
  │ (no Given/When/Then yet)                         │
  │                                                  │
  │ [ Propose example ]                              │
  └─────────────────────────────────────────────────┘
```

#### Section D — Constraints (NFRs)

NFRs render with slidersize-able targets:

```
performance ─ Order creation should be fast enough for checkout UX.
  Target:  p95 < [██████████░░░░░░░░░░] 300 ms       (last measured: 287 ms ✓)
                                                      [ Adjust target ]

reliability ─ Payment + order creation must not produce duplicate orders.
  Target:  (no quantitative target set)              [ Propose target ]
```

Adjusting the target produces a *patch*; the displayed value updates locally, and the patch is queued for export.

#### Section E — Design

Component diagram for the spec, generated as an embedded LikeC4 view:

```
        ┌──────────────────────┐
        │ component:orders-api │
        └──────────┬───────────┘
                   │ depends on
        ┌──────────▼───────────┐  ┌───────────────┐
        │ component:orders-    │  │ port:Order    │
        │ domain               │──│ Repository    │
        └──────────────────────┘  └───────────────┘
                                       │ provided by
                                  ┌────▼───────────┐
                                  │ layer:Postgres │
                                  │ OrderRepoLive  │
                                  └────────────────┘
```

The diagram is SVG; nodes are clickable; hover shows the source file/line.

Below the diagram: the list of `design.decisions` (ADRs) with link to the markdown rendered inline.

#### Section F — Runtime

Effect-anchored view:

```
Fastify route       api:POST:/orders
  invokes Effect program with R = CreateOrderUseCase

Effect Layer        layer:CreateOrderUseCaseLive
  provides   port:CreateOrderUseCase
  requires   port:OrderRepository, port:EventBus
  lifetime   scoped
  test layer layer:CreateOrderUseCaseTest

External systems    external:postgres
```

For Awilix:

```
DI registration     createOrderUseCase (impl:CreateOrderUseCase)
  asClass CreateOrderUseCase    lifetime: SCOPED
  dependsOn impl:OrderRepository, impl:EventBus
```

#### Section G — Bindings

Code, test, and schema bindings with file/line links and "open in IDE" actions.

#### Section H — Verification

The test runs panel:

```
test:orders.create-order.valid-cart           Vitest
  ✓ 187 ms · last run 2026-05-17 09:14Z       file: tests/orders/create-order.spec.ts:8

[Coverage from harness]
  ● valid           authorized            no-duplicate    → covered
  ● valid           failed                no-duplicate    → MISSING TEST
  ● unavailable     authorized            no-duplicate    → MISSING TEST
  ● valid           authorized            duplicate       → MISSING TEST
  [ Propose tests for missing combinations ]
```

#### Section I — Evidence

Observability and provenance:

```
Last build         build:2026-05-17.42        SLSA Level 3 attestation [link]
Last deployment    deploy:prod.2026-05-17     environment: production
OTel observation   p95 = 287 ms (last 24h, sampled)        [open in Honeycomb]
SBOM               cyclonedx.cdx.json                       [download]
```

#### Section J — Impact

Upstream / downstream impact for refactoring:

```
If this spec changes, the following are affected:

Upstream parents:                      Downstream children:
  spec:checkout.complete-purchase        spec:orders.create-order.valid-cart
                                         spec:orders.create-order.unavailable-item

Runtime ripple:                        Tests:
  api:POST:/orders                       test:orders.create-order.valid-cart
  layer:CreateOrderUseCaseLive

Other specs that depend on this:       Decisions referenced:
  spec:notifications.send-order-conf     adr:007-order-lifecycle
  spec:inventory.reserve-on-create
```

Each node is clickable.

### 2.4 The patch / export panel (always visible)

```
Pending changes (2)
─────────────────────────────────────────────────
[+] Add scenario "duplicate submit returns existing order"
[~] Change performance target to p95 < 250 ms

  [ Discard ]   [ Export patch JSON ]   [ Open as PR ]
```

The user accumulates changes locally before exporting. Exported patches are validated against the live graph (the schema check is in-browser; the graph check is via the CLI/agent that picks up the file).

---

## 3. Web Components — building blocks

The Spec Studio is built from a small set of custom elements. Each is self-contained, dependency-light, and can be embedded into other HTML (status reports, PR description bodies, slide exports).

```html
<!-- A single spec card -->
<akg-spec-card spec-id="spec:orders.create-order"
               variant="full"
               readiness-pill="show"></akg-spec-card>

<!-- A trace graph for a spec (SVG) -->
<akg-trace-graph spec-id="spec:orders.create-order"
                 depth="2"
                 highlight="missing-tests"></akg-trace-graph>

<!-- A maturity map for a pack -->
<akg-maturity-map pack-id="pack:checkout-v1"
                  group-by="capability"></akg-maturity-map>

<!-- An interactive scenario harness -->
<akg-harness harness-id="harness:orders.create-order"
             auto-coverage></akg-harness>

<!-- A LikeC4 view (renderer wraps the official LikeC4 runtime) -->
<akg-likec4-view view-id="container/orders-api"></akg-likec4-view>

<!-- A Given/When/Then editor -->
<akg-scenario-editor spec-id="spec:orders.create-order.valid-cart"
                     mode="propose"></akg-scenario-editor>

<!-- An impact view -->
<akg-impact-view spec-id="spec:orders.create-order"></akg-impact-view>

<!-- A patch export button -->
<akg-patch-export id="pending-changes"></akg-patch-export>

<!-- Validation findings panel -->
<akg-validation-findings filter="spec:orders.create-order"></akg-validation-findings>
```

Each element reads from a globally-attached `window.__akg__.graph` object set by the parent page's `<script type="application/json" id="akg-graph">` element.

`★ Insight ─────────────────────────────────────`
Building the Studio from Web Components (not React/Vue/Svelte) is deliberate: they have zero framework lock-in, they work standalone in any HTML container, and the Studio assets stay small and cache-friendly. The handful of interactive components that need richer state (harnesses, scenario editors) can internally use a tiny reactive primitive (`@lit/reactive-element` or `signals`-style atom) without imposing a framework choice on consumers.
`─────────────────────────────────────────────────`

---

## 4. Interaction patterns

Three interaction patterns recur across the Spec Studio:

### Pattern 1 — Inline edit with patch staging

A user clicks "Adjust target" on an NFR. A small inline editor appears (number input + units). On commit, the value updates locally, and an entry appears in the patch panel.

The user has not modified anything on disk. They can:

- **Discard** — revert to the canonical value.
- **Export patch JSON** — download or copy.
- **Open as PR** — produce a patch file in `/generated/patches/`, kick off `akg patch apply`, and (with appropriate config) open a Git PR.

### Pattern 2 — Propose / generate via AI

Several buttons trigger AI generation: "Propose tests for missing combinations", "Propose ADR for blocking question", "Propose alternative decompositions".

These do *not* execute AI in the browser. They emit an *AI prompt* (a structured Markdown file with the relevant graph slice embedded) plus an instruction template. The user pastes the prompt into Claude Code (or their agent of choice). The agent produces a patch JSON; the user feeds it to `akg patch apply`.

This indirection is important: the browser never has API keys, never makes external calls, and never runs untrusted model output without the user's approval.

### Pattern 3 — Simulate via harness

For specs with a `harness:*`, the Spec Studio renders the controls and the `expected()` result live. The user can:

- Drag sliders / toggle inputs to explore.
- See which combinations are *covered* by tests.
- Click "Propose tests" to generate patches for uncovered combinations.

The harness is a *modelling* tool, not a test runner. The actual verification runs in Vitest/Cucumber/Playwright in CI.

---

## 5. Generated projections (beyond the Studio)

The Studio is the primary projection but not the only one. Other generated views serve specific consumers.

### 5.1 LikeC4 models and diagrams

The graph emits a LikeC4 `.likec4` model file:

```c4
// generated/likec4/checkout.likec4
specification {
  element person
  element system
  element container
  element component
}

model {
  person customer
  system platform {
    container orders-api {
      component createOrderUseCase
      component orderRepository
      component eventBus
    }
    container payments-service { ... }
  }
  customer -> orders-api 'submits order'
  orders-api.createOrderUseCase -> orders-api.orderRepository 'persists order'
  orders-api.createOrderUseCase -> orders-api.eventBus 'emits OrderCreated'
}

views {
  view checkoutSystem { include * }
  view ordersApiContainer of platform.orders-api { ... }
}
```

LikeC4's own tooling renders the diagrams as SVG and static sites. The Spec Studio's `<akg-likec4-view>` embeds them inline; the LikeC4 standalone static site is also generated for teams that want a dedicated architecture portal.

### 5.2 OpenAPI / AsyncAPI

For every `Route` node with declared `schema.request`/`schema.response`:

```yaml
# generated/openapi.yaml
openapi: 3.1.0
info:
  title: Libar Omni — generated API
  version: "1.0.0"
paths:
  /orders:
    post:
      summary: "Create an order"
      x-akg-spec: spec:orders.create-order
      x-akg-component: component:orders-api
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateOrderRequest' }
      responses:
        '201':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/CreateOrderResponse' }
components:
  schemas:
    CreateOrderRequest: { ... }   # converted from Zod/TypeBox
    CreateOrderResponse: { ... }
```

`x-akg-*` extension fields preserve the spec linkage. AsyncAPI follows the same pattern for event-driven contracts (events emitted/handled by impl nodes).

### 5.3 Gherkin export

For `kind: "behavior"` specs authored in TypeScript, `akg export-gherkin` emits `.feature` files for stakeholder review:

```gherkin
@spec.orders.create-order
@readiness.bound
@capability.order-management
@component.orders-api
Feature: Customer creates an order

  Intent:
  Allow customers to create an order from a valid cart so checkout can complete.

  Rule: Only valid carts can become orders

    @example.valid-cart
    @readiness.executable
    Scenario: Valid cart creates an order
      Given a customer has a valid cart
      And all items are available
      When the customer submits the order
      Then an order is created
      And an OrderCreated event is emitted
```

The exported file is regenerable; if `akg.config.ts:specs.canonicalFormat === "ts"`, the file is never committed (it lives in `/generated/`).

### 5.4 JSON-LD export

`generated/spec.graph.jsonld` carries the full graph in linked-data form. Useful for:

- Cross-organisation interoperability (SysML v2 import / CALM ingest).
- Knowledge-graph tooling (Neo4j import via APOC, SPARQL endpoints).
- Long-term archival format.

Optional companion: `generated/spec.graph.shacl.ttl` for SHACL-based validation in environments that prefer standards-based shapes over the bespoke JS validators.

### 5.5 AI context slices

`generated/ai/` contains pre-sliced JSON files designed for LLM consumption. Each is small (≤32k tokens), self-contained, and includes:

- The relevant nodes and edges.
- The source files of the included implementations and tests (inlined or referenced).
- Open questions and validation findings.
- A natural-language summary header.

Default slicers (configurable):

- **`per-pack`** — one slice per `SpecPack`.
- **`per-capability`** — one slice per `Capability`.
- **`change-impact-<spec-id>`** — for each recently modified spec, the upstream and downstream neighbourhood.
- **`readiness-<level>`** — all specs at a given readiness with their incomplete fields, useful for "find me everything that's `framed` but should be `specified`" prompts.
- **`failing-tests`** — specs whose latest test runs failed; for triage prompts.

Each slice looks like:

```json
{
  "sliceId": "change-impact-spec.orders.create-order",
  "summary": "Customer order creation feature; bound, partial coverage; 2 warnings; affects 6 downstream nodes.",
  "generatedAt": "2026-05-17T09:14:22Z",
  "nodes": [/* … */],
  "edges": [/* … */],
  "sourceFiles": [
    { "path": "specs/orders/create-order.spec.ts", "content": "…" },
    { "path": "src/orders/create-order.use-case.ts", "content": "…" }
  ],
  "validationFindings": [
    { "code": "nfr-needs-measurable", "spec": "spec:orders.create-order", "severity": "warning" }
  ],
  "unresolvedQuestions": [
    "Should inventory reservation precede payment?"
  ]
}
```

This slice is what an AI agent receives via Claude Code (file attachment) or via an MCP server that exposes the slice directory. The slice replaces "throw the whole repo into a prompt" with "give the model a structured neighbourhood".

### 5.6 Traceability matrices and dashboards

`generated/views/traceability.md` (or `.html`):

```
Spec                              Maturity   Impl                       Tests                  Decisions       Status
spec:orders.create-order          bound      impl:CreateOrderUseCase    test:create-order…     adr:007         ⚠ NFR measurement missing
spec:checkout.complete-purchase   framed     —                           —                      —               OK
spec:payment.authorize            specified  —                           —                      adr:012         OK
…
```

`generated/views/readiness-dashboard.html` — a single page with the maturity heatmap, validation summary, open questions, and stalled specs. Suitable for upload to a status page or as a PR comment artifact.

### 5.7 ADR index

`generated/views/adr-index.md`:

```
007 · accepted   · Order lifecycle                     · referenced by 3 specs · 2026-03-04
012 · accepted   · Event emission ordering             · referenced by 1 spec  · 2026-04-11
019 · proposed   · Inventory reservation timing        · referenced by 1 open question · 2026-05-17
```

ADRs are linked to the live graph; the index is regenerated on every build.

---

## 6. The patch loop — pedantic walkthrough

The Spec Studio's interactive edits become repository changes via the patch loop. This section is the canonical reference for that loop.

### 6.1 In-browser staging

Every interactive change creates a `PatchOp` in browser memory:

```ts
// pseudo-code
window.__akg__.staging.push({
  op: "replace",
  path: "/constraints/0/target",
  value: "p95 < 250ms",
});
```

Staging is local to the browser tab. Refreshing the page discards staging unless the user opts into local-storage persistence.

### 6.2 Patch envelope assembly

When the user clicks **Export patch JSON**, the Studio assembles:

```json
{
  "schemaVersion": "1.0.0",
  "patchId": "patch:orders.create-order.20260517-091422-7b3a",
  "target": "spec:orders.create-order",
  "baseGraphHash": "sha256:8f3a2c1e…",
  "rationale": "Tighten p95 target after capacity review.",
  "operations": [
    { "op": "replace", "path": "/constraints/0/target", "value": "p95 < 250ms" }
  ],
  "proposedBy": { "kind": "human", "identity": "darko" },
  "createdAt": "2026-05-17T09:14:22Z"
}
```

The user can:

- **Download** the file.
- **Copy to clipboard** (for paste into Claude Code or other agent).
- **Save to filesystem** (when the Studio is served via `akg watch`, with appropriate permission; otherwise download).
- **Open as PR** (when integrated with GitHub via a configured token; produces a branch and PR).

### 6.3 CLI apply

`akg patch apply patch.json`:

1. Validate against patch schema (Ajv).
2. Verify `baseGraphHash`. Conflicts → `409 patch-conflict`; reject with explanation.
3. Speculative apply to in-memory graph clone.
4. Run all validators against the cloned graph.
5. If fail → reject; show structured diff.
6. If pass → run codemod via `ts-morph`.
7. Re-extract graph from updated `.spec.ts`; assert it matches the cloned graph.
8. Stage / commit / open PR per configuration.

### 6.4 Codemod mechanics

The codemod uses `ts-morph` to manipulate the source AST surgically:

- `add` / `replace` on a facet path locates the target object literal property and modifies it in place.
- `remove` deletes the property; trailing-comma and whitespace cleanup runs after.
- `promote-readiness` updates the `readiness` field and (optionally) reorders facets for canonical ordering.
- `split-spec` creates a new file (or appends to an existing one) for the new spec and adjusts relations.
- `merge-spec` consolidates two specs and adds a `supersedes` relation on the absorbed one.

After each operation, `ts-morph` reprints the source through Prettier (or the team's formatter) so the diff stays clean.

### 6.5 Safety — what cannot be patched

Some fields are *not* patchable via the Spec Studio in v1:

- `id` — changing it requires `supersedes` (use `merge-spec`).
- `evidence.*` — populated by extractors, not by humans.
- `bindings.code` / `runtime.fastifyRoutes` / `runtime.effectLayers` — derived from source markers; changing them via patch would orphan the actual code.

The Studio greys out these fields' edit handles and shows an info tooltip.

---

## 7. Inline harnesses inside the Spec Studio

Harnesses are first-class citizens of the Studio. The `<akg-harness>` element renders the controls declared in the harness module, plus a coverage indicator:

```
[Controls]                       [Expected result]
cart state:    valid         ▼   order-created
payment state: authorized    ▼
duplicate:     ☐
latency:       ▒▒▒▒░░░░ 300ms

[Coverage]
  ● valid · authorized · no-duplicate  → covered (test:orders.create-order.valid-cart, passing)
  ○ valid · failed     · no-duplicate  → uncovered
  ○ unavailable · *    · *             → uncovered
  ○ valid · authorized · duplicate     → uncovered

[Propose tests for uncovered combinations]
```

The "Propose tests" action assembles an AI prompt embedding the harness, the existing tests, and the gap. The user pastes into their agent; the agent returns a patch; the patch becomes new `ExampleSpec` entries inside `behavior.examples` with `readiness: "specified"` and an action item: *write step definitions to make these executable*.

---

## 8. Architecture lens

The "Architecture" tab is its own page family. It includes:

### 8.1 Capability map

A grid of capabilities with their readiness and spec counts. Click → opens that capability's specs.

### 8.2 Container diagram

LikeC4 container view, generated. Hover a container → see its specs. Click a container → opens it.

### 8.3 Component / port map

LikeC4 component view for each container. Shows components, ports they expose, dependencies between them, and external systems.

### 8.4 Forbidden-dependency report

A table of all `forbidden-dependency` validation findings, with the offending edges visualised on the component diagram.

### 8.5 Dependency cruise visualisation

The full `dependency-cruiser` output rendered as an interactive force-directed graph (for exploring inferred edges).

---

## 9. Tests / Verification lens

For each Spec, the verification panel; aggregated views:

- **Coverage by capability**: percentage of `executable` specs verified in the latest build.
- **Flaky tests**: tests whose `lastResult` flipped within the configured window.
- **Slow tests**: tests above a configurable duration threshold (linked to performance NFR enforcement when relevant).
- **Orphan tests** and **orphan implementations**.

A "Run subset" action assembles a Vitest/Cucumber/Playwright filter expression (e.g. tags `@spec.orders.*`) that the developer can copy.

---

## 10. Evidence lens

Aggregates build / deployment / observation nodes:

- **Build history**: most recent N builds, with SLSA attestations and SBOMs.
- **Deployment history**: environment, build, deployed-at, rollback links (when integrated).
- **OTel observation panel** per spec with linked NFRs.
- **Incident references**: if a spec or build is tagged in an incident postmortem ADR, that linkage shows here.

---

## 11. Mobile / responsive behaviour

The Spec Studio is mobile-responsive — important for PMs and execs reviewing on phones. Constraints:

- Layouts collapse to single-column below ~720px.
- Diagrams pinch-zoom on touch devices.
- Patch staging persists in localStorage so a tab refresh on mobile does not lose work.
- The trace graph and component diagrams have a simplified "summary" mode that hides low-confidence inferred edges below a certain screen width.

---

## 12. Versioning and shareability

When generated, the Spec Studio's data files are stamped with:

- The graph `schemaVersion`.
- The git commit SHA (or `unknown` for local builds).
- The build timestamp.

Sharing is done via the static site upload (S3, Vercel, GitHub Pages). Each PR can publish a Spec Studio preview at `<host>/preview/<pr-number>/`. Stakeholders open the link, navigate the Studio, propose patches, and the PR author applies them.

---

## 13. AI integrations

Three concrete AI integration points:

### 13.1 MCP server (recommended)

`@akg/mcp-server` exposes the graph and slices through MCP, so Claude Code (or any MCP-capable agent) can:

- `getSpec(id)` → returns the spec node, its facets, and its immediate neighbours.
- `getSlice(sliceId)` → returns a pre-built AI slice.
- `proposeChange(target, kind, description)` → server-side helper that drafts a patch JSON (still gated by validation on apply).
- `searchSpecs(query, filters)` → typed search across the graph.

The MCP server is read-only; writes go through `akg patch apply`.

### 13.2 Prompt-bundle generator

`akg ai bundle <spec-id>` generates a copy-pasteable prompt containing:

- The spec's full body.
- A focused slice of the graph (impact panel).
- The relevant source files.
- Validation findings.
- A standardised footer asking the agent to produce a patch JSON.

This is the manual analogue of the MCP integration — for teams not using MCP.

### 13.3 GraphRAG-style retrieval

For very large graphs, AI slices can be pre-indexed (vector + structural) so that an agent's question retrieves the most relevant slice plus a few hops of its neighbourhood. This is roughly Microsoft Research's GraphRAG approach applied to the Libar Omni graph: hierarchical community summaries + structured neighbourhoods, in JSON-LD form.

This is a v2 feature; v1 ships the static slicer.

---

## 14. The strongest version of the idea (restated)

To close the loop on the input documents' final framing (`08.md`):

> Generate → Explore → Refine → Export → Validate → Apply → Regenerate.

- **Generate**: typed specs become a graph; the graph becomes Studio HTML.
- **Explore**: humans and AI inspect architecture, behaviour, gaps, and risks.
- **Refine**: edits in the Studio (or in agents that consume the slices) propose changes.
- **Export**: structured patches are emitted.
- **Validate**: schema + graph validators speak the final word.
- **Apply**: codemod updates `.spec.ts`.
- **Regenerate**: the cycle continues.

This is a *living* environment, not a documentation generator. The HTML is rich; the TypeScript is sound; the patch protocol is the bridge. None of the three is sufficient alone.
