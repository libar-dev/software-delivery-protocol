# 03 — Graph Metamodel

This document defines the canonical graph: what node and edge kinds exist, what fields each carries, how edges are tagged with provenance, how IDs are structured, and how the graph evolves with readiness.

The graph is the *single* thing all other layers consume. Every projection (Spec Studio, LikeC4, OpenAPI, JSON-LD, AI slices) reads from this model. Validators run against it. The patch loop modifies it. Treating the metamodel pedantically is therefore worth the effort.

---

## 1. Top-level structure

```ts
interface SpecGraph {
  schemaVersion: SemVerString;          // e.g. "1.0.0"
  generatedAt:   ISODateTime;
  configHash:    Sha256Hex;             // hash of akg.config.ts at extraction time
  sourceManifest: SourceManifest;       // file hashes for reproducibility

  nodes: GraphNode[];
  edges: GraphEdge[];

  validation: ValidationReport;         // attached for convenience; not re-computed by consumers
  evidence:   EvidenceIndex;            // pointers to CI artifacts
}
```

The graph is *flat*: nodes and edges are arrays, not nested. Hierarchies (a `SpecPack` containing specs, a `component` containing implementations) are expressed via `contains`/`belongsTo` edges, not nesting. This keeps querying uniform and serialisation cheap.

`SpecGraph` is itself published as:

1. A **TypeScript type** in `@akg/graph`.
2. A **JSON Schema** at `/generated/spec.graph.schema.json` (pinned to `schemaVersion`).
3. A **JSON-LD context** at `/generated/spec.graph.jsonld.context` for interop.

---

## 2. Node kinds

Every node has the common envelope:

```ts
interface NodeCommon {
  id:           NodeId;                 // namespaced, see §6
  kind:         NodeKind;
  title?:       string;
  abstraction?: SpecAbstraction;        // for spec-class nodes
  readiness?:   SpecReadiness;          // for spec-class nodes
  location?:    SourceLocation;         // file/line if extracted from source
  owner?:       OwnerRef;
  tags?:        string[];
  provenance:   NodeProvenance;         // see §5
  metadata?:    Record<string, unknown>;
}

type NodeKind =
  // delivery-intent nodes
  | "Spec"            // any Spec from /specs
  | "SpecPack"
  | "Capability"      // a capability, either declared or extracted
  | "Decision"        // an ADR / decision
  | "Rule"            // a promotable rule extracted from BehaviorFacet
  | "Example"         // a promotable example extracted from BehaviorFacet
  | "Constraint"      // a promotable NFR
  // architecture nodes
  | "Component"
  | "Port"
  | "ExternalSystem"
  // implementation nodes
  | "Implementation"  // a class/function/module annotated with `impl:*` ID
  | "Schema"
  | "Event"
  // runtime nodes
  | "Route"           // Fastify route
  | "Layer"           // Effect Layer or DI registration
  | "Tag"             // Effect Context.Tag (a service identifier)
  // test nodes
  | "Test"            // any executable verifying spec
  | "TestRun"         // single execution of a test (for evidence)
  // evidence nodes
  | "Build"
  | "Deployment"
  | "Observation";    // OTel span / metric / log family
```

The split between *Spec*-class nodes (Spec, SpecPack, Capability, Decision, Rule, Example, Constraint) and *non-Spec* nodes is important: only Spec-class nodes carry `abstraction` and `readiness`. Other nodes carry their own kind-specific fields.

### 2.1 `Spec` node

The same `Spec` object from `01-core-primitives.md` is *the* `Spec` node, serialised verbatim into the graph. Facets are preserved. The extractor adds:

- `provenance: { layer: "spec-file", file: "...", line: ... }`
- `incomingEdges: number` / `outgoingEdges: number` (for fast UI ranking)
- `derivedReadiness?: SpecReadiness` — what readiness the *validators* believe the spec should claim, vs `readiness` (what the author claimed). Diverges on misclaims.

### 2.2 `SpecPack` node

```ts
interface SpecPackNode extends NodeCommon {
  kind: "SpecPack";
  intent:        IntentFacet;
  sharedModel?:  DomainModelFacet;
  constraints?:  ConstraintFacet[];
  specs:         SpecId[];              // references resolved to spec nodes
}
```

`specs` is denormalised here for convenience even though `contains` edges also exist; the array preserves *author order* which the Spec Studio uses for stable presentation.

### 2.3 `Capability` node

Capabilities can be either:

- **Declared** — a `Spec` with `abstraction: "capability"` (then *both* a `Spec` node and an alias `Capability` node may exist; conventionally only the `Spec` node is materialised, and references to `capability:*` resolve to it).
- **Lightweight** — declared inline in `/arch/capabilities.ts` with no full Spec body; useful for early architecture sketches.

### 2.4 `Decision` node

ADRs:

```ts
interface DecisionNode extends NodeCommon {
  kind:   "Decision";
  status: "proposed" | "accepted" | "deprecated" | "superseded";
  context?:    string;     // extracted from ADR markdown
  consequences?: string[];
  supersedes?: DecisionRef;
  filePath?:   string;     // path to the markdown file
}
```

ADRs are read but not parsed semantically — the graph stores file path and metadata, plus extracted relations (`decidedBy` edges).

### 2.5 `Component` node

```ts
interface ComponentNode extends NodeCommon {
  kind: "Component";
  layer?: "edge" | "application" | "domain" | "adapter" | "infrastructure";
  bounded_context?: string;
  capability?: SpecId;             // resolved
  package?: string;                // pnpm package or directory
}
```

Components are declared in `/arch/components.ts`. The extractor also creates implicit component nodes when a `@arch.node({ component: ... })` references an unknown ID (then a validation warning fires).

### 2.6 `Port` node

```ts
interface PortNode extends NodeCommon {
  kind: "Port";
  signature?: string;        // string representation of the TS interface signature
  schema?:    SchemaRef;
}
```

Ports correspond to Effect `Context.Tag` declarations or to abstract interfaces in a class-DI codebase.

### 2.7 `Implementation` node

```ts
interface ImplementationNode extends NodeCommon {
  kind: "Implementation";
  exportName: string;        // the exported symbol
  filePath:   string;
  language:   "ts" | "tsx";
  visibility: "public" | "internal";
}
```

Implementations are the AST entities (classes, functions, exported constants) carrying `@arch.node({ id: "impl:..." })` or equivalent JSDoc/marker.

### 2.8 `Schema` node

```ts
interface SchemaNode extends NodeCommon {
  kind: "Schema";
  representation: "json-schema" | "zod" | "typebox" | "valibot" | "openapi";
  source?: object | string;   // inlined JSON Schema if small, path if large
}
```

Schemas are typically Zod/TypeBox shapes used at Fastify route boundaries. The extractor converts them to JSON Schema where reasonable (Zod has `zodToJsonSchema`, TypeBox is already JSON Schema-shaped).

### 2.9 `Event` node

```ts
interface EventNode extends NodeCommon {
  kind: "Event";
  channel?: string;           // logical channel / queue name
  schema?: SchemaRef;
  asyncApiChannel?: string;
}
```

Events are referenced by `BehaviorFacet.rules`, by handlers (`@arch.node({ handles: "event:OrderCreated" })`), and by emitters.

### 2.10 `Route` node

```ts
interface RouteNode extends NodeCommon {
  kind:   "Route";
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  path:   string;             // exact Fastify path, including ":param" segments
  schema?: { request?: SchemaRef; response?: SchemaRef };
  plugin?: string;
  component?: ComponentRef;
}
```

Routes are extracted from `defineRoute(...)` calls and Fastify plugin registration patterns.

### 2.11 `Layer` node

```ts
interface LayerNode extends NodeCommon {
  kind: "Layer";
  framework: "effect" | "awilix" | "custom";
  provides:  PortRef[];        // tags / interfaces provided
  requires:  PortRef[];        // tags consumed within construction
  lifetime:  "singleton" | "scoped" | "transient";
  testDouble?: LayerRef;       // pointer to test-mode replacement layer
}
```

For Effect, `provides` is the tag the layer constructs; `requires` is the set of tags yielded in its `Effect.gen` body.

### 2.12 `Tag` node

(Effect-specific) — a `Context.Tag` is its own node so that *interface* identity is preserved across multiple layer implementations:

```ts
interface TagNode extends NodeCommon {
  kind: "Tag";
  interfaceName: string;
  signature?: string;
  port?: PortRef;
}
```

### 2.13 `Test` node

```ts
interface TestNode extends NodeCommon {
  kind: "Test";
  runner: "vitest" | "cucumber" | "playwright" | "custom";
  filePath: string;
  testTitle?: string;
  examplePath?: string[];  // for nested describes
  verifies?: SpecId[];     // resolved from @spec tag or `specTest({verifies})`
}
```

The same test may verify multiple specs — explicit, multi-valued `verifies`.

### 2.14 `TestRun` node

```ts
interface TestRunNode extends NodeCommon {
  kind: "TestRun";
  test: TestRef;
  result: "passed" | "failed" | "skipped";
  durationMs: number;
  startedAt: ISODateTime;
  build?: BuildRef;
}
```

One node per execution, ingested from Cucumber Messages / Vitest reporters / Playwright JSON.

### 2.15 `Build`, `Deployment`, `Observation` nodes

Optional, used when delivery-evidence overlay is enabled (see `08`).

```ts
interface BuildNode extends NodeCommon {
  kind: "Build";
  commitSha: string;
  pipelineRunId?: string;
  attestations?: ProvenanceRef[];   // SLSA in-toto refs
  sbom?: string;                    // CycloneDX path
  startedAt: ISODateTime;
  status: "passed" | "failed";
}

interface DeploymentNode extends NodeCommon {
  kind: "Deployment";
  environment: string;
  build: BuildRef;
  deployedAt: ISODateTime;
  artifact: string;
}

interface ObservationNode extends NodeCommon {
  kind: "Observation";
  signal: "trace" | "metric" | "log";
  semanticConvention: string;       // OTel semconv name
  sourceQuery?: string;             // query/templated identifier in Honeycomb/Tempo/etc.
}
```

---

## 3. Edge kinds

Every edge has the common envelope:

```ts
interface EdgeCommon {
  from:        NodeId;
  to:          NodeId;
  type:        EdgeKind;
  provenance:  EdgeProvenance;       // see §5
  confidence?: "high" | "medium" | "low";  // for inferred edges
  metadata?:   Record<string, unknown>;
}

type EdgeKind =
  // delivery / spec relations
  | "refines"          // child spec refines parent spec
  | "belongsTo"        // spec → pack | capability | domain
  | "dependsOn"        // spec → spec (semantic), or impl → impl (structural)
  | "decidedBy"        // spec → decision
  | "constrainedBy"    // spec → constraint
  | "exemplifies"      // example → spec
  | "supersedes"       // decision → decision, or spec → spec
  // architecture relations
  | "contains"         // component → impl, pack → spec, capability → spec
  | "implements"       // impl → port  (a class implements an interface)
  | "exposes"          // component → port
  // runtime relations
  | "provides"         // layer → port  (Effect: layer provides Tag)
  | "requires"         // layer → port  (Effect: layer requires Tag in its construction)
  | "satisfiedBy"      // spec → route | layer | impl
  | "invokes"          // route → impl  (route handler invokes use case)
  | "handles"          // impl → event
  | "emits"            // impl → event
  | "calls"            // impl → impl  (structural call edge)
  | "imports"          // impl → impl  (structural import edge)
  // verification & evidence
  | "verifies"         // test | example | run → spec
  | "executedBy"       // example → test
  | "ranAs"            // testrun → test
  | "observedIn"       // spec | impl → observation
  | "builtFrom"        // build → impl  (impl came from this build)
  | "deployedFrom";    // deployment → build
```

Constraints on edge kinds (validator-enforced):

- `refines` only between Spec nodes of compatible abstraction levels (child cannot be *higher* abstraction than parent).
- `provides`/`requires` only on Layer ↔ Port edges.
- `verifies` only from Test or Example nodes to Spec nodes.
- `decidedBy` requires the `to` node to exist (declared ADR or `Decision` node).
- `imports` and `calls` are *inferred* only (never declared).

### 3.1 The edge-as-table view

For quick reference:

| From kind     | Edge          | To kind                       | Typical provenance |
|---------------|---------------|-------------------------------|--------------------|
| Spec          | `refines`     | Spec                          | declared           |
| Spec          | `belongsTo`   | SpecPack, Capability          | declared           |
| Spec          | `dependsOn`   | Spec                          | declared           |
| Spec          | `decidedBy`   | Decision                      | declared           |
| Spec          | `constrainedBy` | Spec, Constraint            | declared           |
| Spec          | `satisfiedBy` | Route, Layer, Implementation  | declared / annotation |
| Example       | `exemplifies` | Spec                          | declared           |
| Example       | `verifies`    | Spec                          | declared           |
| Test          | `verifies`    | Spec                          | annotation         |
| TestRun       | `ranAs`       | Test                          | inferred (evidence)|
| Component     | `contains`    | Implementation                | declared / annotation |
| Component     | `exposes`     | Port                          | declared           |
| Implementation | `implements` | Port                          | annotation         |
| Implementation | `calls`      | Implementation                | inferred (ts-morph)|
| Implementation | `imports`    | Implementation                | inferred (ts-morph)|
| Implementation | `handles`    | Event                         | annotation         |
| Implementation | `emits`      | Event                         | annotation / inferred |
| Route         | `invokes`     | Implementation                | inferred           |
| Layer         | `provides`    | Port (Tag)                    | inferred (Effect)  |
| Layer         | `requires`    | Port (Tag)                    | inferred (Effect)  |
| Build         | `builtFrom`   | Implementation                | inferred (provenance)|
| Deployment    | `deployedFrom` | Build                        | inferred           |
| Spec          | `observedIn`  | Observation                   | declared (in `evidence.observedIn`) |
| Decision      | `supersedes`  | Decision                      | declared           |

---

## 4. Edge provenance — three sources, never collapsed

This is one of the most-debated topics across the input documents and one of the load-bearing design decisions.

```ts
type EdgeProvenance =
  | { layer: "declared";    file: string; line: number }
  | { layer: "annotation";  file: string; line: number; marker: string }
  | { layer: "inferred";    extractor: InferredExtractor; reasoning?: string };

type InferredExtractor =
  | "ts-morph:imports"
  | "ts-morph:calls"
  | "ts-morph:extends"
  | "dependency-cruiser"
  | "nx-project-graph"
  | "codeql"
  | "semgrep"
  | "cucumber-messages"
  | "vitest-reporter"
  | "playwright-reporter"
  | "otel-export"
  | "slsa-attestation"
  | "cyclonedx-sbom";
```

Three sources, never merged:

### 4.1 Declared edges

Authored explicitly in `/specs/*.spec.ts` or `/arch/*.ts`:

```ts
relations: [
  { type: "refines",   to: "spec:checkout.complete-purchase" },
  { type: "dependsOn", to: "spec:payment.authorize" },
]
```

These are the *truth* of business intent. The author put them there knowingly. They override conflicting inferred edges in projections.

### 4.2 Annotation edges

Authored in product code via decorators / JSDoc / marker constants:

```ts
@arch.node({
  id: "impl:CreateOrderUseCase",
  kind: "implementation",
  implements: ["spec:orders.create-order"],   // → `verifies`/`satisfies` edge
  component: "component:orders-api",          // → `contains` edge from component
})
export class CreateOrderUseCase { /* ... */ }
```

Annotations bind *real code locations* to graph IDs. They are slightly less authoritative than declared edges (because product code is edited more often than `/specs/`), but still explicit author intent.

### 4.3 Inferred edges

Produced by the extractors. Examples:

- `ts-morph:imports` — every `import` statement creates a node-to-node edge.
- `ts-morph:calls` — every method-call expression to a known annotated symbol creates a `calls` edge.
- `dependency-cruiser` — module-to-module dependency facts.
- `cucumber-messages` — `executedBy` edges from a test run to the executed scenario.
- `otel-export` — `observedIn` edges from a spec to an OTel span/metric.

Inferred edges carry `confidence` and `reasoning` (optional). They are *suggestions*, not commitments. The Spec Studio shows them differently (dotted lines, faded colour). They never trigger validator errors on their own.

`★ Insight ─────────────────────────────────────`
Never *promote* an inferred edge into a declared one silently. That would erase the distinction the whole system depends on. The Spec Studio can *suggest* promotion ("This `calls` edge looks important — declare it explicitly?") and produce a patch, but the promotion is a human action that becomes a declared edge in a `.spec.ts` file. Mixing the layers is what tools like architecture-recovery research warn against — automated traceability is "helpful but imperfect" and should remain assistive.
`─────────────────────────────────────────────────`

---

## 5. Node provenance

```ts
type NodeProvenance =
  | { layer: "spec-file";    file: string; line: number }
  | { layer: "arch-file";    file: string; line: number }
  | { layer: "source-marker"; file: string; line: number; marker: string }
  | { layer: "gherkin";      file: string; line: number }
  | { layer: "extracted";    extractor: InferredExtractor }
  | { layer: "evidence";     source: string };
```

A node is declared by exactly one provenance. If two extractors both claim to produce the same `id`, that is a validator error (`duplicate-node-id`).

---

## 6. ID grammar in pedantic detail

The ID grammar from `01-core-primitives.md` §7 expanded with full rules:

### 6.1 Lexical grammar

```ebnf
NodeId   ::= Namespace ":" Path SubSegment?
Namespace ::= "spec" | "pack" | "capability" | "component" | "port" | "impl"
            | "layer" | "tag" | "api" | "test" | "adr" | "decision"
            | "external" | "schema" | "event" | "build" | "deployment"
            | "observation" | "rule" | "example" | "constraint"

Path     ::= Segment ("." Segment)*
Segment  ::= LowerSnake | LowerKebab | Identifier
SubSegment ::= "#" Identifier | "#" Path                  // optional

// Special form for API
ApiId    ::= "api:" HttpMethod ":" UrlPath
HttpMethod ::= "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS"
UrlPath  ::= "/" (Segment | ":" Identifier | "*") ("/" ...)*

// LowerSnake = `[a-z][a-z0-9_]*`
// LowerKebab = `[a-z][a-z0-9-]*`
// Identifier = `[A-Za-z][A-Za-z0-9]*`
```

### 6.2 Rules

- **Namespace is required.** Bare `orders.create-order` is invalid.
- **Path uses `.` as separator.** Kebab-case within a segment (`orders.create-order`) is allowed.
- **Sub-segments use `#`** to indicate "this is a child of the parent path that is not itself a Spec".
  - `spec:orders.create-order#fixtures.valid-cart` is *not* a separate Spec; it is a sub-identifier inside the parent.
  - `spec:orders.create-order.valid-cart` *is* a separate Spec (its own object, its own readiness).
- **Special form for routes** preserves HTTP method and path literally (`api:POST:/orders/:id`).
- **External systems** use the third-party brand: `external:stripe`, `external:postgres`, `external:redis`.
- **ADR ids** preserve the document's number-and-slug convention: `adr:007-order-lifecycle`.

### 6.3 ID stability rules

- Once a Spec has been `bound` or higher, its `id` is **frozen**. Changing it requires a `supersedes` relation pointing from the new ID to the old.
- IDs are **case-sensitive** but tooling lints uppercase mixed within the path (`spec:Orders.create-order` warns).
- IDs are **content-addressed via hash** in the cache to detect renames silently (cache stores `id ↔ contentHash` mapping; renames produce a `supersedes` suggestion in the Spec Studio).

### 6.4 The generated `SpecId` union (re-iterated)

`/generated/spec-ids.d.ts` is regenerated on every build. It is a discriminated literal union of *all known IDs* across namespaces, exposed as `type SpecId`, `type ComponentId`, etc.

Authoring code imports the branded types:

```ts
import type { SpecId } from "@akg/graph/ids";

declare const id: SpecId;     // accepts only known literal IDs
```

Misspelled IDs in `relations: [{ type: "refines", to: "spec:orders.creat-order" }]` therefore fail at `tsc` time, *not* at `akg validate` time.

---

## 7. Readiness profiles in the graph (formalised)

Each readiness level has a JSON-schema-like profile describing required facets and relations:

```ts
interface ReadinessProfile {
  level:    SpecReadiness;
  requires: ProfileRule[];
  warns:    ProfileRule[];
}

type ProfileRule =
  | { kind: "facet";    facet: keyof Spec; predicate?: PredicateExpr }
  | { kind: "relation"; type:  EdgeKind;   minCount?: number; maxCount?: number; ofKind?: NodeKind[] }
  | { kind: "evidence"; signal: "tests" | "buildProvenance" | "observedIn"; minCount?: number }
  | { kind: "custom";   id: string;        explanation: string };

type PredicateExpr =
  | { hasField:   string }           // facet has the named field present
  | { fieldMatch: { field: string; pattern: string } }    // matches a regex (e.g. "p\d+ < \d+")
  | { andAll:     PredicateExpr[] }
  | { orAny:      PredicateExpr[] };
```

Example profile for `bound`:

```ts
{
  level: "bound",
  requires: [
    { kind: "facet", facet: "runtime", predicate: {
        orAny: [ { hasField: "fastifyRoutes" }, { hasField: "effectLayers" } ]
    }},
    { kind: "facet", facet: "bindings", predicate: { hasField: "code" }},
    { kind: "relation", type: "satisfiedBy", minCount: 1 },
  ],
  warns: [
    { kind: "facet", facet: "design", predicate: { hasField: "decisions" }},
  ],
}
```

Profiles are declarative — `akg.config.ts` can override individual rules without forking the validator code. See `06-extraction-and-validation.md` for the full default set.

---

## 8. Query API on top of the graph

The in-memory `Graph` exposes typed queries used by projections, validators, and the patch tool:

```ts
interface Graph {
  // direct lookups
  node(id: NodeId): GraphNode | undefined;
  spec(id: SpecId): SpecNode | undefined;
  pack(id: SpecPackId): SpecPackNode | undefined;

  // collections
  specs(predicate?: (s: SpecNode) => boolean): SpecNode[];
  componentsByCapability(id: SpecId): ComponentNode[];
  routesByComponent(id: ComponentId): RouteNode[];
  testsBySpec(id: SpecId): TestNode[];

  // walks
  outgoing(id: NodeId, edge?: EdgeKind): GraphEdge[];
  incoming(id: NodeId, edge?: EdgeKind): GraphEdge[];
  ancestors(id: SpecId,   via?: EdgeKind[]): SpecNode[];   // following refines/belongsTo
  descendants(id: SpecId, via?: EdgeKind[]): SpecNode[];

  // analyses
  impactOf(id: NodeId): ImpactReport;        // upstream + downstream affected nodes
  orphans():           SpecNode[];           // specs not reachable from any pack/capability
  unverifiedExecutable(): SpecNode[];        // readiness >= executable, no passing TestRun
  forbiddenDeps(rules: ForbiddenRule[]): EdgeViolation[];

  // diff
  diff(other: Graph): GraphDiff;             // for patch validation & PR diffs
}
```

The `impactOf` walk is one of the most-used queries in the Spec Studio: given a spec, it returns:

- upstream parents (via `belongsTo`, `refines`),
- downstream children,
- affected runtime nodes (via `satisfiedBy`),
- affected tests (via reverse `verifies`),
- affected components (via `contains`),
- affected ADRs.

---

## 9. JSON-LD context (for interop)

For machine portability, the graph also serialises to JSON-LD. A snippet of the context:

```jsonld
{
  "@context": {
    "@vocab": "https://libar-omni.dev/schema/v1/",
    "schemaVersion": "https://libar-omni.dev/schema/v1/version",
    "Spec":        "https://libar-omni.dev/schema/v1/Spec",
    "SpecPack":    "https://libar-omni.dev/schema/v1/SpecPack",
    "Component":   "https://libar-omni.dev/schema/v1/Component",
    "refines":     { "@id": "https://libar-omni.dev/schema/v1/refines", "@type": "@id" },
    "dependsOn":   { "@id": "https://libar-omni.dev/schema/v1/dependsOn", "@type": "@id" },
    "verifiedBy":  { "@id": "https://libar-omni.dev/schema/v1/verifiedBy", "@type": "@id" },
    "prov":        "http://www.w3.org/ns/prov#",
    "wasDerivedFrom": "prov:wasDerivedFrom",
    "wasGeneratedBy": "prov:wasGeneratedBy"
  }
}
```

Why JSON-LD: it keeps the data shape JSON-friendly (so consumers without RDF libraries are unaffected) while carrying linked-data semantics for tools that want them. PROV-O is included for provenance interop (SLSA attestations align here).

A SHACL shapes file (`/generated/spec.graph.shacl.ttl`) is also emitted for organisations that need *standards-based* graph validation (in addition to the bespoke JS validators).

---

## 10. Versioning and migration

The graph schema is **SemVer-versioned**:

- **PATCH** — additive metadata, new optional fields, new validator rules.
- **MINOR** — new node kinds, new edge kinds, new facets.
- **MAJOR** — breaking changes (field renames, kind removals, ID grammar shifts).

Every `spec.graph.json` includes `schemaVersion`. The Spec Studio refuses to load a graph whose major version it doesn't support.

When a major version ships, `akg migrate` consumes the old graph and writes upgraded `.spec.ts` files via codemod. The patch system is the same one used for the interactive loop — migrations are just large patches.

---

## 11. Worked example — graph fragment for `spec:orders.create-order`

Nodes:

```json
[
  {
    "id": "pack:checkout-v1",
    "kind": "SpecPack",
    "title": "Checkout v1",
    "abstraction": "initiative",
    "provenance": { "layer": "spec-file", "file": "specs/checkout/checkout.pack.ts", "line": 12 }
  },
  {
    "id": "capability:order-management",
    "kind": "Capability",
    "abstraction": "capability",
    "readiness": "designed",
    "provenance": { "layer": "arch-file", "file": "arch/capabilities.ts", "line": 7 }
  },
  {
    "id": "spec:orders.create-order",
    "kind": "Spec",
    "abstraction": "feature",
    "readiness": "bound",
    "title": "Customer creates an order",
    "provenance": { "layer": "spec-file", "file": "specs/orders/create-order.spec.ts", "line": 5 }
  },
  {
    "id": "spec:orders.create-order.valid-cart",
    "kind": "Example",
    "abstraction": "scenario",
    "readiness": "executable",
    "provenance": { "layer": "spec-file", "file": "specs/orders/create-order.spec.ts", "line": 78 }
  },
  {
    "id": "component:orders-api",
    "kind": "Component",
    "provenance": { "layer": "arch-file", "file": "arch/components.ts", "line": 11 }
  },
  {
    "id": "api:POST:/orders",
    "kind": "Route",
    "method": "POST",
    "path": "/orders",
    "provenance": { "layer": "source-marker", "file": "src/orders/create-order.route.ts", "line": 14, "marker": "defineRoute" }
  },
  {
    "id": "layer:CreateOrderUseCaseLive",
    "kind": "Layer",
    "framework": "effect",
    "provides": ["port:CreateOrderUseCase"],
    "requires": ["port:OrderRepository","port:EventBus"],
    "lifetime": "scoped",
    "provenance": { "layer": "source-marker", "file": "src/orders/create-order.layer.ts", "line": 22, "marker": "defineArchLayer" }
  },
  {
    "id": "impl:CreateOrderUseCase",
    "kind": "Implementation",
    "exportName": "CreateOrderUseCase",
    "filePath": "src/orders/create-order.use-case.ts",
    "language": "ts",
    "visibility": "internal",
    "provenance": { "layer": "source-marker", "file": "src/orders/create-order.use-case.ts", "line": 10, "marker": "@arch.node" }
  },
  {
    "id": "test:orders.create-order.valid-cart",
    "kind": "Test",
    "runner": "vitest",
    "filePath": "tests/orders/create-order.spec.ts",
    "testTitle": "valid cart creates an order",
    "verifies": ["spec:orders.create-order","spec:orders.create-order.valid-cart"],
    "provenance": { "layer": "source-marker", "file": "tests/orders/create-order.spec.ts", "line": 8, "marker": "specTest" }
  },
  {
    "id": "adr:007-order-lifecycle",
    "kind": "Decision",
    "status": "accepted",
    "filePath": "arch/decisions/adr-007-order-lifecycle.md",
    "provenance": { "layer": "arch-file", "file": "arch/decisions/adr-007-order-lifecycle.md", "line": 1 }
  }
]
```

Edges:

```json
[
  { "from": "pack:checkout-v1",                    "to": "spec:orders.create-order",            "type": "contains",     "provenance": { "layer": "declared", "file": "specs/checkout/checkout.pack.ts", "line": 24 } },
  { "from": "spec:orders.create-order",            "to": "capability:order-management",         "type": "belongsTo",    "provenance": { "layer": "declared", "file": "specs/orders/create-order.spec.ts", "line": 31 } },
  { "from": "spec:orders.create-order.valid-cart", "to": "spec:orders.create-order",            "type": "exemplifies",  "provenance": { "layer": "declared", "file": "specs/orders/create-order.spec.ts", "line": 84 } },
  { "from": "spec:orders.create-order.valid-cart", "to": "spec:orders.create-order",            "type": "verifies",     "provenance": { "layer": "declared", "file": "specs/orders/create-order.spec.ts", "line": 85 } },
  { "from": "spec:orders.create-order",            "to": "api:POST:/orders",                    "type": "satisfiedBy",  "provenance": { "layer": "declared", "file": "specs/orders/create-order.spec.ts", "line": 42 } },
  { "from": "spec:orders.create-order",            "to": "layer:CreateOrderUseCaseLive",        "type": "satisfiedBy",  "provenance": { "layer": "declared", "file": "specs/orders/create-order.spec.ts", "line": 43 } },
  { "from": "spec:orders.create-order",            "to": "adr:007-order-lifecycle",             "type": "decidedBy",    "provenance": { "layer": "declared", "file": "specs/orders/create-order.spec.ts", "line": 37 } },
  { "from": "component:orders-api",                "to": "impl:CreateOrderUseCase",             "type": "contains",     "provenance": { "layer": "annotation", "file": "src/orders/create-order.use-case.ts", "line": 10, "marker": "@arch.node" } },
  { "from": "impl:CreateOrderUseCase",             "to": "spec:orders.create-order",            "type": "satisfiedBy",  "provenance": { "layer": "annotation", "file": "src/orders/create-order.use-case.ts", "line": 10, "marker": "@arch.node" } },
  { "from": "api:POST:/orders",                    "to": "impl:CreateOrderUseCase",             "type": "invokes",      "provenance": { "layer": "inferred", "extractor": "ts-morph:calls", "reasoning": "request.diScope.resolve('createOrderUseCase').execute()" } },
  { "from": "layer:CreateOrderUseCaseLive",        "to": "port:CreateOrderUseCase",             "type": "provides",     "provenance": { "layer": "inferred", "extractor": "ts-morph:calls" } },
  { "from": "layer:CreateOrderUseCaseLive",        "to": "port:OrderRepository",                "type": "requires",     "provenance": { "layer": "inferred", "extractor": "ts-morph:calls" } },
  { "from": "test:orders.create-order.valid-cart", "to": "spec:orders.create-order.valid-cart", "type": "verifies",     "provenance": { "layer": "annotation", "file": "tests/orders/create-order.spec.ts", "line": 8, "marker": "specTest" } }
]
```

This fragment is enough to render the Spec Studio "Create Order" page, generate the LikeC4 container view for `component:orders-api`, produce the OpenAPI for `api:POST:/orders`, and slice an AI context file `change-impact-spec.orders.create-order.json`.

---

## 12. Anti-patterns the metamodel forbids

A few things the metamodel intentionally cannot represent — and what to do instead:

| Anti-pattern | Why it's forbidden | Do this instead |
|---|---|---|
| Nesting nodes inside other nodes | Breaks uniform querying, makes diffs ugly | Use `contains`/`belongsTo` edges |
| Edge between non-existent IDs | Silent broken links | Validator rejects; provide ID or remove |
| Inferring `verifies` from test filename heuristics | Confidence too low; lies about coverage | Require explicit `@spec` tag or `specTest({verifies})` |
| Same ID for a class and a layer | Identity collision | Use namespaces (`impl:Foo` vs `layer:FooLive`) |
| Mutating evidence facets in `.spec.ts` files | Drifts from CI reality | Evidence is extractor-populated; author-touching warns |
| Declaring `implements` edge with provenance `inferred` | Inference cannot know *which* spec a class implements | Annotate with `@arch.node({ implements })` |
| Using `provides` between non-Layer/non-Port nodes | Type confusion | Restrict to Layer→Port only |
| Storing arbitrary JSON in `metadata` | Becomes a dumping ground | `metadata` is reserved for namespaced keys (`metadata: { "ext.linear.issueId": "..." }`) |

The validator enforces all of these.
