# 06 — Extraction & Validation

This document covers the *engine* of the system: how the extractor turns Layer 1 source into the canonical graph, and how the layered validation pipeline turns that graph into pass/fail signals.

The whole pipeline is **pure**: same inputs → same outputs. No databases, no remote calls, no side effects beyond writing the graph file and reports.

---

## 1. The extraction pipeline (overview)

```mermaid
flowchart TB
  subgraph S [Layer 1 — sources]
    direction LR
    A1[/specs/**/*.spec.ts/]
    A2[/arch/**/*.ts/]
    A3[/src/**/*.ts/]
    A4[/features/**/*.feature/]
    A5[/tests/**/*.{spec.ts, ts}/]
    A6[/arch/decisions/*.md/]
  end

  subgraph E [Layer 2 — extractors]
    direction TB
    E1[Spec DSL extractor<br/>ts-morph + static eval]
    E2[Source-marker extractor<br/>decorators / JSDoc / consts]
    E3[Fastify route extractor<br/>defineRoute / app.<method>]
    E4[Effect Layer extractor<br/>Layer.effect / Tag / gen]
    E5[Awilix extractor<br/>defineRegistrations / asClass]
    E6[Gherkin parser<br/>@cucumber/gherkin]
    E7[Test discovery<br/>Vitest/Cucumber/Playwright]
    E8[ADR scanner<br/>filename + front-matter]
    E9[Overlay ingest<br/>dep-cruiser/Nx/CodeQL/Semgrep]
    E10[Evidence ingest<br/>Cucumber NDJSON / Vitest / Playwright / OTel / SLSA / SBOM]
  end

  G[Graph builder<br/>merge + dedupe + resolve]
  V[Layered validators]
  R[/generated/spec.graph.json/]
  Rep[/generated/validation.json/]

  A1 --> E1
  A2 --> E1
  A2 --> E2
  A3 --> E2
  A3 --> E3
  A3 --> E4
  A3 --> E5
  A4 --> E6
  A5 --> E7
  A6 --> E8
  A3 --> E9
  E10 -.-> G

  E1 --> G
  E2 --> G
  E3 --> G
  E4 --> G
  E5 --> G
  E6 --> G
  E7 --> G
  E8 --> G
  E9 --> G

  G --> R
  G --> V
  V --> Rep
```

Each extractor is independent and produces a *fragment* (a typed list of candidate nodes and edges). The graph builder merges fragments by ID, de-duplicates, resolves references, and emits the canonical graph.

---

## 2. The Spec DSL extractor

This is the highest-fidelity extractor. It walks `/specs/**/*.spec.ts` and `/arch/**/*.ts`, identifies calls to known constructors, and reifies their arguments.

### 2.1 What it recognises

Recognised call expressions (function names from `@akg/spec`):

- `spec({...})` → a `Spec` node.
- `specPack({...})` → a `SpecPack` node.
- `enrichSpec("spec:...", {...})` → a partial merge into an existing Spec.
- `defineCapabilities({ "capability:...": {...} } as const)` → multiple `Capability` nodes.
- `defineComponents({ "component:...": {...} } as const)` → multiple `Component` nodes.
- `definePorts({ "port:...": {...} } as const)` → multiple `Port` nodes.
- `defineDecisions({ "adr:...": {...} } as const)` or `defineDecisions(["adr:..."])` → `Decision` nodes (may also reference markdown files).
- `defineExternalSystems({...})` → `ExternalSystem` nodes.
- `harness({...})` → harness metadata attached to the referenced spec.
- `defineView({...})` → projection view configuration.

### 2.2 Static evaluation rules

The extractor evaluates argument expressions using a restricted static evaluator:

| Expression kind | Allowed? | Notes |
|---|---|---|
| String literal | ✓ | Including template literals with no interpolation |
| Numeric literal | ✓ | |
| Boolean literal | ✓ | |
| Array literal | ✓ | Elements evaluated recursively |
| Object literal | ✓ | Properties evaluated recursively |
| Identifier from `import { x } from "@akg/spec"` | ✓ | `ref("…")`, `belongsTo("…")`, etc. are unwrapped |
| `as const` assertion | ✓ | Preserved at extraction time |
| `satisfies T` clause | ✓ | Ignored (it is a type-only construct) |
| Spread `...x` of static value | ✓ | Evaluated and inlined |
| Member access on enum import | ✓ | If the enum is statically determinable |
| Function call to anything but `@akg/spec` helpers | ✗ | Extractor warns; spec partially extracted |
| Conditional expression (`a ? b : c`) | ✗ | Specs must be deterministic data |
| Template literal with interpolation | ✗ | Forbidden in `.spec.ts` files |
| Identifier from product source code | ✗ | Spec files don't import product code |
| Any other expression | ✗ | Warning + skip |

The evaluator is intentionally narrow. Anything outside its grammar produces a `dsl-non-static` warning at the location, and the offending property is excluded from the extracted node — *the rest of the spec still extracts*. This matters: a single suspicious expression should not poison the entire graph build.

### 2.3 Resolving relations

`belongsTo("capability:order-management")`, `dependsOn("spec:payment.authorize")`, `decidedBy("adr:007-order-lifecycle")` — all become `SpecRelation` entries on the extracted node, with the `to` ID preserved verbatim.

The extractor does *not* verify that the `to` ID exists yet — that is the graph builder's job (§4). This separation matters: extractors process one file at a time; resolution is necessarily cross-file.

### 2.4 Per-file fragment output

```ts
interface ExtractorFragment {
  source: { file: string; sha256: string; extractedAt: ISODateTime };
  nodes:  CandidateNode[];
  edges:  CandidateEdge[];
  warnings: ExtractorWarning[];
}

interface CandidateNode extends NodeCommon {
  // identical to GraphNode but candidate IDs may have unresolved references
  unresolvedReferences?: NodeId[];
}

interface CandidateEdge {
  from: NodeId;
  to:   NodeId;
  type: EdgeKind;
  provenance: EdgeProvenance;
  metadata?: Record<string, unknown>;
}

interface ExtractorWarning {
  severity: "info" | "warning" | "error";
  code:     string;        // e.g. "dsl-non-static", "missing-required-facet"
  file:     string;
  line:     number;
  message:  string;
}
```

Fragments are cached per file (`/generated/.akg-cache/partial-graph/<sha256>.json`). On the next build, unchanged files reuse their cached fragments.

---

## 3. Source-marker extractor

This extractor handles three syntactic forms (`04-authoring-surfaces.md` §2): decorators, JSDoc, and marker constants. They all produce the same kind of candidate nodes and edges.

### 3.1 Decorator extraction

For each `ClassDeclaration` (or `MethodDeclaration`) in `/src/**/*.ts`:

1. Walk `getDecorators()`.
2. For each decorator whose *callee* is `arch.node`, `arch.handles`, `arch.emits`, etc., evaluate the argument literal.
3. Produce a candidate node (kind derived from `kind` field) and edges (component, satisfies, etc.).

`ts-morph` provides `getDecorators()`, `getName()`, `getArguments()`, and `getCallExpression()` to do this efficiently.

### 3.2 JSDoc extraction

For each top-level export or declaration:

1. Read `getJsDocs()` and walk tags.
2. For tags named `@akg.*`, parse the comment payload according to the per-tag mini-grammar:
   - Single-value: `@akg.node impl:Foo`.
   - Multi-value brace: `@akg.satisfies { spec:a, spec:b }`.
   - Key-value pairs: `@akg.kind implementation`.
3. Reconstruct a marker object equivalent to the decorator argument.

JSDoc tags must be declared in `tsdoc.json` so that TypeDoc and API Extractor do not flag them as unknown.

### 3.3 Marker constant extraction

For each `CallExpression` whose callee is `markImplementation`, `markRoute`, `markLayer`, etc.:

1. Read the argument literal.
2. Treat it as the equivalent of a decorator argument.
3. Bind the resulting node to the location of the call expression's enclosing statement.

### 3.4 Combined extraction & precedence

When the same `id` is claimed by multiple marker forms (e.g., a decorator on the class plus a JSDoc tag on a method), they are merged with precedence:

```
decorator > marker constant > JSDoc > inferred
```

Conflicts (e.g., different `component` values) become validator errors (`marker-conflict`).

---

## 4. Graph builder (merge, dedupe, resolve)

The graph builder takes all extractor fragments and produces the final `SpecGraph`. It is the *only* layer that has cross-file knowledge.

### 4.1 Merge phase

1. Collect all `CandidateNode` arrays into a map `Map<NodeId, CandidateNode[]>`.
2. For each `NodeId` with multiple candidates, attempt to **merge** facets:
   - Strict facets (`id`, `kind`, `abstraction`, `readiness`, `provenance`) must match exactly. Conflict → `node-merge-conflict` error.
   - Additive facets (`bindings.code`, `bindings.tests`, `relations`, `runtime.fastifyRoutes`) are unioned with de-duplication.
   - `enrichSpec` calls are folded into their target node.
3. Collect all `CandidateEdge` arrays. Edges are de-duplicated by `(from, to, type, provenance.layer)`.

### 4.2 Reference resolution

For every node and edge that references an `id`:

1. If the referenced ID exists in the merged map → resolved.
2. If not → mark as `unresolved` and emit `unresolved-reference` validation error pointing at the original source location.

The graph still serialises — `unresolved` references appear in the JSON with a sentinel marker — so the Spec Studio can render the broken state for debugging. CI rejects via the validator.

### 4.3 Provenance preservation

Every node carries the provenance of its *originating extractor*. When a node is extracted from multiple sources (a `Spec` from `.spec.ts` plus marker-side claims in source), the primary provenance is `spec-file` and the marker claims become secondary edges with their own provenance.

### 4.4 ID-union regeneration

After resolution, the builder writes `/generated/spec-ids.d.ts`:

```ts
// AUTO-GENERATED — do not edit
export type SpecId =
  | "spec:checkout.complete-purchase"
  | "spec:orders.create-order"
  | "spec:orders.create-order.valid-cart"
  | /* … */;

export type ComponentId = "component:orders-api" | /* … */;
export type LayerId     = "layer:CreateOrderUseCaseLive" | /* … */;
// …
```

`tsc` runs *after* this file is regenerated. The build script enforces ordering via project references and a `prepare` hook in the `@akg/graph` package.

---

## 5. Overlay extractors

These are *opt-in* and supplement the canonical graph with inferred edges. None of them are required for v1, but each adds substantial value.

### 5.1 `dependency-cruiser`

Run `depcruise --output-type json src/ > /tmp/dc.json` and ingest the result. The graph gains `imports` and `dependsOn` edges between `impl:*` nodes with `provenance.layer: "inferred"`.

`dependency-cruiser` also has a *rules* mode: a `.dependency-cruiser.cjs` file declares forbidden dependency patterns (e.g., "domain layer may not depend on infrastructure"). Violations become `forbidden-dependency` errors in `akg validate` — the graph validator re-uses the same rule set.

### 5.2 Nx project graph

`nx graph --json --file=/tmp/nx.json`. Yields project-to-project edges; useful for monorepos with explicit Nx project boundaries. Nodes corresponding to Nx projects can be elevated to `Component` nodes (or mapped to existing ones via `akg.config.ts`).

### 5.3 CodeQL / Semgrep dataflow

CodeQL JS/TS queries (custom or library) can produce `reaches-data`, `calls-external`, `untrusted-flow` style findings. The extractor ingests CodeQL SARIF output and creates `Observation` nodes with edges to the affected `impl:*` or `api:*` nodes. Similar for Semgrep's cross-file dataflow.

### 5.4 TypeScript Compiler API (deep)

For specific patterns (Effect's `R` parameter tracking, Awilix's `dependsOn` cycles), the extractor uses the full TypeScript type-checker — not just `ts-morph`'s structural API — to read inferred types and detect missing dependencies:

```ts
const checker = project.getTypeChecker();
const program = checker.getProgram(); // ts.Program
const sourceFile = program.getSourceFile("src/orders/create-order.route.ts");
// For the handler expression's Effect type, read its R parameter:
const handlerType = checker.getTypeAtLocation(handlerExpression);
const rParam = extractEffectRequirement(handlerType, checker);
// If rParam is anything other than `never`, the route's program is under-provided.
```

This is the deepest extractor; it makes "your runtime is statically incomplete" a CI-failable condition.

---

## 6. Validation tiers — the layered gate

Validation is split into five tiers. Each tier is responsible for one *kind* of correctness. The motivation: forcing all checks into TypeScript types makes the type system contort; treating everything as runtime makes feedback slow; pushing everything into a graph validator hides type errors. A tiered gate is more maintainable.

```
Tier 1 — TypeScript types          (compile-time, shape)
Tier 2 — Schema validation         (compile-time-ish, payload structure)
Tier 3 — Graph validators          (cross-file, semantic invariants)
Tier 4 — Architecture rules        (boundary, dependency, conventions)
Tier 5 — Custom team rules         (project-specific policies)
```

### 6.1 Tier 1 — TypeScript types

What is enforced:

- Spec, SpecPack, ExampleSpec, RuleSpec shape correctness.
- Branded ID types (`SpecId`, `ComponentId`, …) — misspellings caught.
- Discriminated unions for relations (`{ type: "refines", to: SpecId }`).
- Enum membership (`SpecKind`, `SpecAbstraction`, `SpecReadiness`).
- Facet field types (e.g., `ConstraintFacet.kind` is `"business" | "quality" | …`).

What is *not* enforced at Tier 1:

- Completeness per readiness level.
- Referential integrity across files.
- Architectural rules.

Tools: plain `tsc --build` with project references; the regenerated `SpecId` union closes most of the cross-file gap.

### 6.2 Tier 2 — Schema validation

What is enforced:

- The graph file itself (`spec.graph.json`) validates against the published `spec.graph.schema.json`.
- Patch payloads (`/generated/patches/*.json`) validate against the patch schema.
- External schema references (`schema:CreateOrderRequest`) validate against the extracted JSON Schema.
- Configuration validates (`akg.config.ts` produces an object matching the config schema).

Tools: **Zod** at the DSL author surface (for runtime helpers that need to fail fast), **Ajv** for raw JSON validation of the graph and patches.

Why both:

- Zod gives TypeScript-first ergonomics where authors write code (`@akg/runtime` helpers, harness controls, configuration loading).
- Ajv with compiled schemas validates large machine-generated payloads (the graph, patches) faster than Zod and integrates with JSON Schema tooling.

### 6.3 Tier 3 — Graph validators (semantic invariants)

This is where most of the *interesting* enforcement happens. Default rules (all toggleable in `akg.config.ts`):

#### 6.3.1 Identity & references

- `duplicate-node-id` — two extractors claim the same ID with conflicting content.
- `unresolved-reference` — an edge or facet references an ID that does not exist.
- `id-grammar` — an ID does not match the namespace grammar.
- `forbidden-cross-namespace-ref` — a node references an ID in a namespace its kind cannot legally reference (e.g., a `Spec` cannot directly `decidedBy` a `Component`).

#### 6.3.2 Readiness profiles

Each readiness level has a `ReadinessProfile` (`03-graph-metamodel.md` §7). The validator checks each Spec against its claimed readiness. Default profiles:

| Level | Required |
|---|---|
| `sketch` | `id`, `title`, `kind`, `abstraction`, `readiness`; either `intent.outcome` or one `belongsTo`/`refines` relation. |
| `framed` | All of `sketch` + at least one of (`behavior.rules`, `behavior.examples`, `constraints`, `model.terms`). |
| `specified` | All of `framed` + at least one `behavior.examples` *or* ≥2 `behavior.rules`. NFR `constraints` must have `target`. No `blocking: true` open questions. |
| `designed` | All of `specified` + `design.components` ≥1; `design.decisions` ≥1 for `abstraction in {capability, feature}`. |
| `bound` | All of `designed` + at least one of (`runtime.fastifyRoutes`, `runtime.effectLayers`, `runtime.awilixRegistrations`) + `bindings.code` ≥1 + all bindings resolve. |
| `executable` | All of `bound` + `verification.mode === "executable"` + `verification.tests` ≥1 + every test resolves to a `Test` node. |
| `verified` | All of `executable` + `evidence.verifiedBy` ≥1 + `verification.lastResult === "passed"` + `evidence.lastVerifiedAt` within `ttl` (default 7d). |

These profiles are *defaults*. Teams override them in `akg.config.ts`:

```ts
validation: {
  profiles: {
    bound: {
      requires: [
        { kind: "facet", facet: "runtime", predicate: { hasField: "effectLayers" } },  // mandate Effect, not Awilix
      ],
    },
  },
},
```

#### 6.3.3 Coverage & traceability

- `executable-needs-tests` — `readiness === "executable"` but no `verification.tests`.
- `bound-route-without-impl` — a `Spec.runtime.fastifyRoutes` references a route whose handler has no extracted `impl:*` invocation.
- `orphan-implementation` — `impl:*` exists in source but no `Spec.bindings.code` references it.
- `orphan-test` — `Test` node exists but no `Spec.verification.tests` or `Spec.bindings.tests` references it (and the test is not in a designated "infrastructure tests" location).
- `orphan-route` — a Fastify route exists but no Spec claims it via `runtime.fastifyRoutes`.

#### 6.3.4 Lifecycle integrity

- `invalid-readiness-promotion` — a Spec changed readiness in a way that requires removed facets (e.g., dropped `bindings.code` while declaring `bound`).
- `superseded-spec-still-referenced` — a spec marked `supersedes` is still depended on by non-deprecated specs.
- `deprecated-decision-applied` — an ADR with `status: "deprecated"` is still referenced by `decidedBy`.

#### 6.3.5 Quality / NFR rules

- `nfr-needs-target` — a `ConstraintFacet` with `kind in {"performance","reliability"}` lacks `target`.
- `nfr-needs-measurable` — at `readiness >= specified`, NFRs lack `measurableBy`.
- `nfr-target-format` — `target` matches a parser pattern (`p\d+\s*<\s*\d+\s*(ms|s|%)` etc.).

#### 6.3.6 Open questions

- `blocking-open-question` — `intent.openQuestions` contains `blocking: true` but `readiness >= specified`.
- `stale-open-question` — open question is older than configured TTL; warn.

#### 6.3.7 Provenance hygiene

- `inferred-only-edge-promotion-needed` — heavily-used inferred edge that should be declared (heuristic; warns only).
- `marker-conflict` — different markers on the same code location disagree.

### 6.4 Tier 4 — Architecture rules

This tier enforces *boundaries*. Sources:

- **`dependency-cruiser` rules** — a TypeScript-level dependency policy (`.dependency-cruiser.cjs`).
- **`ts-arch` / `arch-unit-ts` style rules** — JavaScript-DSL rules expressed in test files:

  ```ts
  archRule("ui-must-not-depend-on-persistence", graph => {
    expect(
      graph.componentsByPath("**/ui/**").dependsOn(graph.componentsByPath("**/persistence/**"))
    ).toBe(false);
  });
  ```

- **ESLint rules** authored against the graph for code-shaped concerns (`akg/marker-required`, `akg/no-cross-imports`, `akg/spec-not-importing-source`).

Typical rules:

- `no-direct-external-from-application-layer` — only adapter components may depend on external systems.
- `domain-purity` — domain components may not import `node:*`, infrastructure libraries, or external SDKs.
- `single-direction-architecture` — cyclic dependencies between architectural layers fail.
- `route-has-component` — every Route must belong to a Component.
- `layer-respects-component` — every Layer's `provides` port belongs to the same Component as the Layer.

These run via either:

- `pnpm depcruise` (existing tool).
- `pnpm vitest run tests/architecture/` (ts-arch-style).
- `pnpm eslint .` (lint rules).

`akg validate` invokes all three subcommands and aggregates their reports into `/generated/validation.json` for the Spec Studio.

### 6.5 Tier 5 — Custom team rules

Teams add project-specific rules in `arch/rules.ts`:

```ts
import { defineRule } from "@akg/validate";

export const noLegacyAdaptersInNewBoundedContexts = defineRule({
  id: "team:no-legacy-adapters-in-new-bc",
  severity: "error",
  applies: (graph) =>
    graph.specPacks().filter(p => p.metadata?.maturity === "v2"),

  check: (graph, pack) => {
    const violations = graph.descendants(pack.id, ["contains"])
      .filter(n => n.kind === "Implementation")
      .filter(impl => impl.tags?.includes("legacy-adapter"));
    return violations.map(v => ({
      message: `${v.id} is a legacy adapter inside v2 pack ${pack.id}`,
      location: v.location,
    }));
  },
});
```

Custom rules execute alongside the built-ins. They have full access to the `Graph` query API.

---

## 7. Severity, exit codes, and CI policy

Every rule has a severity:

```ts
type Severity = "info" | "warning" | "error";
```

Configuration:

```ts
validation: {
  failOn: ["error"],            // baseline
  overrides: {
    "executable-needs-tests": "error",
    "nfr-needs-measurable":   "warning",
    "stale-open-question":    "info",
  },
},
```

`akg validate` exit codes:

| Exit | Meaning |
|---|---|
| 0 | No issues at or above `failOn`. |
| 1 | Issues at `failOn` severity. |
| 2 | Validator infrastructure error (bug). |

The CI pipeline runs `akg validate --report=generated/validation.json` and uploads the report. The Spec Studio reads the report directly so authors can navigate findings in-browser.

---

## 8. Validation feedback in the Spec Studio

Validation results are first-class graph artifacts. They drive:

- **Per-spec readiness banners**: "claimed `bound`, derived `framed` because runtime bindings missing".
- **Coverage heatmaps** at the pack/capability level.
- **Click-through-to-source**: every finding has `file:line`; the Spec Studio links to `vscode://` or the team's chosen IDE protocol.
- **Suggested patches**: for some findings (missing NFR target, missing example for executable), the Studio proposes a draft patch the user can review and apply.

---

## 9. Patch validation (the loop closure)

When a patch arrives from the Spec Studio (or any source), it is validated *before* anything is written.

### 9.1 Patch schema

```ts
interface SpecPatch {
  schemaVersion: SemVerString;
  patchId:       string;
  target:        SpecId | SpecPackId;
  baseGraphHash: Sha256Hex;        // hash of the graph the patch is built against
  rationale?:    string;
  operations:    PatchOp[];
  proposedBy?:   { kind: "human" | "ai"; identity?: string };
  createdAt:     ISODateTime;
}

type PatchOp =
  | { op: "add";     path: string; value: unknown }
  | { op: "remove";  path: string }
  | { op: "replace"; path: string; value: unknown }
  | { op: "move";    from: string; path: string }
  | { op: "copy";    from: string; path: string }
  | { op: "test";    path: string; value: unknown }
  // Libar Omni-specific ops:
  | { op: "promote-readiness"; from: SpecReadiness; to: SpecReadiness }
  | { op: "split-spec";        newId: SpecId; movedPaths: string[] }
  | { op: "merge-spec";        otherId: SpecId; strategy: "prefer-this" | "prefer-other" };
```

Standard RFC 6902 JSON Patch operations cover most edits; the Libar Omni-specific operations cover lifecycle moves the Spec Studio offers as first-class actions.

### 9.2 Validation pipeline (transactional)

`akg patch apply patch.json`:

1. Load the patch and validate against the patch schema (Ajv).
2. Load current graph; check `baseGraphHash` matches. If not → `patch-conflict`; reject.
3. Apply operations to an *in-memory clone* of the graph.
4. Run all Tier 1–5 validators against the cloned graph.
5. If any error: reject; emit a structured diff explaining why.
6. If validators pass: invoke the `ts-morph` codemod to materialise the spec changes in `.spec.ts` files.
7. Rebuild the graph from the updated source files; assert it matches the cloned graph (sanity check — a bug in the codemod would diverge here).
8. Commit changes (or stage them, or open a PR — configurable).

The "speculative apply then real apply" structure is what makes the patch loop *safe*. No half-applied patches; no inconsistent intermediate states.

---

## 10. Performance characteristics

Approximate complexity for a repo of ~50k TS LOC with ~500 specs and ~1000 marker decorations:

| Operation | Cold | Warm (incremental) |
|---|---|---|
| Spec DSL extraction | 4–8 s | <0.5 s |
| Marker extraction (`/src/`) | 6–12 s | <1 s |
| Fastify route + Effect layer extraction | 2–4 s | <0.5 s |
| Gherkin parse | <1 s | <0.2 s |
| `dependency-cruiser` overlay | 8–20 s | 4–8 s (depcruise itself is the bottleneck) |
| Graph build (merge + resolve) | 1–2 s | <0.5 s |
| Validators (all tiers) | 1–3 s | <1 s |
| Projection generation (Studio + LikeC4 + AI slices) | 4–8 s | 1–2 s |
| **Total** | **25–60 s** | **3–10 s** |

Targets for v1: cold build < 60 s, warm build < 10 s, Spec Studio served via `akg watch` updates within 1 s of file save. These targets assume per-file caching, `tsbuildinfo` integration, and a moderate-spec hardware baseline.

---

## 11. Test discovery and evidence ingestion

### 11.1 Test discovery

Tests are discovered by *file pattern* and *AST signature*:

- **Vitest**: files matching `tests/**/*.spec.ts` containing `describe(...)`, `it(...)`, or `specTest(...)`.
- **Cucumber**: `.feature` files (handled by Gherkin parser); step definitions in `features/steps/**/*.ts`.
- **Playwright**: files matching `tests/e2e/**/*.playwright.ts` with `test(...)` calls importing `@playwright/test`.

Each test becomes a `Test` node. Its `verifies` field is populated from:

- `specTest("...", { verifies: ["spec:..."] })` for Vitest.
- `@spec.*` tags on Gherkin scenarios.
- `tag` / `annotation` arrays on Playwright tests.

A test without an explicit `verifies` is allowed but gets `provenance: { layer: "inferred" }` for the verifies edge to the nearest spec by *filename heuristic* (lowest confidence). Validators warn but do not fail on such inferred verifies edges (unless the team enables `strict-test-verifies`).

### 11.2 Evidence ingestion

After test runs:

- **Cucumber Messages NDJSON** (`generated/cucumber.ndjson`) → `TestRun` nodes with result, duration, `ranAs` edges.
- **Vitest JSON reporter** (`generated/vitest.json`) → `TestRun` nodes per `it`.
- **Playwright JSON reporter** (`generated/playwright.json`) → `TestRun` nodes per `test`.

Each `TestRun` updates the parent Test's `lastResult` and contributes to the spec's `evidence.verifiedBy` / `evidence.lastVerifiedAt` via reverse traversal.

OTel exports (`evidence/otel-queries.yaml`) configure which OTel queries map to which spec IDs:

```yaml
- spec: spec:orders.create-order
  query:
    type: prometheus
    expr: 'histogram_quantile(0.95, sum by (le)(rate(http_server_request_duration_seconds_bucket{route="POST /orders"}[5m])))'
    measures: target_p95_ms
```

The ingestor runs this query, attaches the result as an `Observation` node, and the validator confirms `target_p95_ms` is within the NFR's target.

---

## 12. The complete `akg validate` output

A typical successful run:

```
$ akg validate
[akg] reading graph from generated/spec.graph.json (412 nodes, 1183 edges)
[akg] running 47 validators across 5 tiers
[akg] tier 1 (types)      ✓
[akg] tier 2 (schema)     ✓
[akg] tier 3 (graph)      2 warnings, 0 errors
[akg] tier 4 (arch)       ✓
[akg] tier 5 (custom)     ✓

Warnings:
  generated/validation.json#W001  spec:orders.create-order
    nfr-needs-measurable: the performance constraint has a target but no measurableBy[] entry.
    location: specs/orders/create-order.spec.ts:42

  generated/validation.json#W002  spec:checkout.complete-purchase
    stale-open-question: open question is older than 14 days.
    location: specs/checkout/complete-purchase.spec.ts:18

[akg] 0 errors, exit 0
```

The structured JSON in `validation.json` has the same content with stable IDs that the Spec Studio links to.

---

## 13. Test strategy for the validators themselves

Validators are the most consequential code in the system — a silently-passing validator hides a problem. Therefore:

- Every validator has a `fixtures/<rule>/should-fail/*.spec.ts` and `fixtures/<rule>/should-pass/*.spec.ts` directory in `@akg/validate`'s test suite.
- Each fixture is a minimal repo snapshot constructed to exercise exactly that rule.
- The validator runs against the fixture graph and asserts the *expected findings*.
- A `validators.snapshot.json` captures the full validator inventory; PRs that add or remove rules must update the snapshot.

This is the analogue of golden-test files for ESLint rules and is well-trodden territory.

---

## 14. What the validators do *not* try to catch

Out of scope for v1, explicitly:

- *Semantic equivalence between two spec phrasings.* "X may not Y" and "Y is forbidden for X" are two different strings; the validator does not unify them.
- *Cross-codebase consistency.* If two teams independently use `spec:orders.create-order` to mean different things in different repos, that is their integration problem.
- *Style enforcement on prose.* `intent.outcome` may be a single word or a paragraph; prose-quality lints are out of scope.
- *Performance-budget enforcement at runtime.* The NFR target check happens during evidence ingestion (post-CI), not in production traffic.
- *Security scanning.* CodeQL/Semgrep overlays bring findings into the graph but the actual security policy lives in those tools.

These are not philosophical objections — they are scope discipline. v1 ships a defensible core; v2/v3 can extend.
