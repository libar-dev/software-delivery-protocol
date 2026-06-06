# 08 — Delivery Evidence & Tooling

This document closes the loop: how runtime and supply-chain *evidence* is ingested into the graph, the CLI surface, the repository layout, and the phased implementation roadmap from MVP to v4. It ends with the open questions and limitations explicitly retained.

The recurring concern across the input documents: design-time specs are only half the story. The graph becomes uniquely valuable when it can answer questions like *"is this NFR being met in production right now?"*, *"which build produced the binary running in prod?"*, *"are all our dependencies licensed correctly?"*, and *"which observed incident touched this spec?"*. Delivery evidence is what enables those questions.

---

## 1. The evidence layer at a glance

```
            Layer 1 — sources              Layer 1 — runtime
            ┌──────────────────┐           ┌──────────────────────────┐
            │ /specs, /src,    │           │ CI pipeline, deploys,    │
            │ /tests, /arch    │           │ production telemetry     │
            └─────────┬────────┘           └──────────────┬───────────┘
                      │                                   │
                      │             ┌─────────────────────┘
                      ▼             ▼
              ┌────────────────────────────┐
              │ Layer 2 — extractors +     │
              │ evidence ingestors         │
              └─────────────┬──────────────┘
                            ▼
              ┌────────────────────────────┐
              │ Layer 3 — canonical graph  │
              │ (now with Build,           │
              │ Deployment, Observation,   │
              │ TestRun nodes)             │
              └────────────────────────────┘
```

The evidence layer is **opt-in**. v1 ships without it; teams enable the ingestors they need. The graph schema accommodates evidence nodes whether or not they are populated.

---

## 2. Standards we lean on

Each evidence ingestor maps a well-defined external standard to graph nodes/edges. We deliberately avoid bespoke formats here — interoperability with the broader ecosystem is the whole point.

| Standard | Domain | Ingested into | Notes |
|---|---|---|---|
| **OpenTelemetry semantic conventions** (incl. CI/CD spans) | Runtime traces / metrics / logs; CI/CD pipeline events | `Observation`, `Build`, `TestRun` | Lean on existing OTel semconv names; the graph stores *pointers*, not full telemetry data. |
| **SLSA in-toto attestations** | Build provenance | `Build.attestations` | SLSA Level 3+ attestations carry signed provenance; we reference them by URI. |
| **CycloneDX** | SBOM | `Build.sbom` | One SBOM per build; consumed by license/vuln scanners externally. |
| **GitHub artifact attestations / SBOM attestations** | Equivalent to SLSA for GitHub Actions | `Build.attestations` | Convenience path for GitHub-hosted CI. |
| **Cucumber Messages** (NDJSON) | BDD test results | `TestRun` for Cucumber | Standard JSON Schema + NDJSON stream. |
| **Vitest JSON reporter** | Unit / integration test results | `TestRun` for Vitest | One JSON file per test run. |
| **Playwright JSON reporter** | E2E test results | `TestRun` for Playwright | Includes trace and screenshot artifact paths. |
| **PROV-O** | Provenance vocabulary | JSON-LD export of the graph | Aligns SLSA attestations with the linked-data export. |
| **JSON Schema** | Schema definitions for routes / events | `Schema` nodes | Often derived from Zod or TypeBox at extraction time. |

The evidence ingestors are conceptually tiny: each one reads an artifact path declared in `akg.config.ts:evidence`, parses it, and produces candidate nodes/edges with `provenance: { layer: "evidence", source: "<...>" }`.

---

## 3. CI/CD integration patterns

### 3.1 Typical pipeline shape (illustrative GitHub Actions)

```yaml
name: build-and-verify
on:
  pull_request: {}
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents:    read
      id-token:    write      # for SLSA attestations
      attestations: write
    steps:
      - uses: actions/checkout@v4

      # 0. dependency setup
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile

      # 1. type-check (with ID union regenerated)
      - run: pnpm akg ids regenerate
      - run: pnpm tsc --build

      # 2. lint (includes akg lint for Gherkin)
      - run: pnpm eslint .
      - run: pnpm akg lint features/**/*.feature

      # 3. test
      - run: pnpm vitest run --reporter=json --outputFile=generated/vitest.json
      - run: pnpm cucumber-js --format message:generated/cucumber.ndjson
      - run: pnpm playwright test --reporter=json --output=generated/playwright

      # 4. overlay scans
      - run: pnpm depcruise src --output-type json > generated/dep-cruise.json
      # - run: codeql analyze (optional)

      # 5. SBOM
      - run: pnpm cyclonedx-npm --output-file generated/sbom.cdx.json

      # 6. provenance attestations
      - uses: actions/attest-build-provenance@v1
        with: { subject-path: 'dist/**/*' }
      - uses: actions/attest-sbom@v1
        with: { subject-path: 'dist/**/*', sbom-path: 'generated/sbom.cdx.json' }

      # 7. AKG build / validate / projections
      - run: pnpm akg build
      - run: pnpm akg validate
      - run: pnpm akg projections --check-clean

      # 8. publish Spec Studio preview
      - uses: actions/upload-pages-artifact@v3
        with: { path: 'generated/spec-studio' }
```

The pipeline is incremental-friendly: each step writes a known artifact path; `akg build` consumes the union; `akg validate` is the gate.

### 3.2 What lands in the graph per build

For a single CI run:

- One `Build` node — commit SHA, pipeline run ID, attestation refs, SBOM path.
- N `TestRun` nodes — from Vitest / Cucumber / Playwright reporters.
- Updated `evidence.observedIn` pointers on specs whose NFRs have OTel queries.

For each deployment:

- One `Deployment` node — environment, build ref, deployed-at, artifact identifier.
- Optionally a `Verified` readiness transition if all the spec's bound checks pass post-deploy (with the configured TTL).

---

## 4. OTel ingestion — the NFR-evidence bridge

OpenTelemetry is the load-bearing standard for runtime observability in this design. Two paths:

### 4.1 Pull model — querying an OTel backend

A configuration file maps spec/NFR pairs to queries:

```yaml
# evidence/otel-queries.yaml
queries:
  - spec: spec:orders.create-order
    nfrIndex: 0
    measures: target_p95_ms
    query:
      backend: honeycomb
      dataset: orders-api
      filter:
        - { field: 'http.route', value: '/orders' }
        - { field: 'http.method', value: 'POST' }
      compute: p95(span.duration)
      lookback: 24h
  - spec: spec:orders.create-order
    measures: target_error_rate
    query:
      backend: prometheus
      expr: 'sum(rate(http_server_requests_total{route="POST /orders",code=~"5.."}[5m]))'
```

A scheduled job (or a CI step on `main`) runs `akg evidence pull --config evidence/otel-queries.yaml`. Results land in the graph as `Observation` nodes with `observedIn` edges to the spec.

The validator can then check: `does the observed p95 satisfy target p95 < 300ms?` — emitting `nfr-violated` if not.

### 4.2 Push model — OTel exporter side-channel

For teams that already export traces/metrics with consistent attribute names, a lightweight `akg-otel-collector` plugin sits in the OTel collector pipeline and pushes summaries to a graph-update endpoint (or writes them to a known path picked up by `akg evidence ingest`).

This avoids polling external backends and works well for self-hosted observability stacks.

### 4.3 CI/CD spans

OTel's semantic conventions now include CI/CD spans for pipeline runs and tasks. When emitted by the CI provider (or a wrapper), these become `Build` and `Deployment` evidence with rich provenance — no parsing of CI-provider-specific JSON.

---

## 5. SLSA + SBOM ingestion

### 5.1 SLSA attestations

After `actions/attest-build-provenance` (or the equivalent for GitLab/CircleCI), an in-toto attestation file is produced. `akg evidence ingest-slsa <path>`:

- Parses the attestation envelope (`subject`, `predicateType: slsaprovenance/v1`).
- Creates / updates the `Build` node with the attestation's `builder.id`, `buildDefinition.externalParameters`, `runDetails.metadata.startedOn`, `runDetails.metadata.finishedOn`.
- Sets `Build.attestations` to the verified attestation URI.

The provenance node is a `Build` with an `attestation` field referencing the in-toto bundle by hash; consumers (auditors, compliance dashboards) can resolve it independently.

### 5.2 CycloneDX SBOM

`akg evidence ingest-sbom generated/sbom.cdx.json`:

- Parses the CycloneDX document.
- Creates `Build.sbom` reference and a *summary* (component count, licence summary, top vulnerabilities by severity).
- Does *not* dump the full SBOM into the graph; the file is referenced by path, with a content hash.

This keeps the graph small while preserving the link to the canonical SBOM.

### 5.3 License compliance

A configurable validator (`license-compliance`) reads the SBOM summary and fails if forbidden licences appear in production dependencies. Per-spec license overrides are supported (`tags: ["accepts-gpl"]` etc.).

---

## 6. CLI surface

The full `akg` CLI consolidates all subsystems. Each subcommand is its own package's binary; `akg` is the umbrella.

### 6.1 Inspection

```
akg ids regenerate                          # write /generated/spec-ids.d.ts
akg build [--incremental]                   # full or incremental graph build
akg build --check-clean                     # rebuild + assert /generated unchanged
akg explain <id>                            # print a spec / node detail
akg search <query> [--kind] [--readiness]   # search the graph
akg graph stats                             # node/edge counts, fragments, cache hits
akg graph diff <ref1> <ref2>                # diff between two graph snapshots
```

### 6.2 Validation

```
akg validate                                # all tiers
akg validate --tier 3                       # specific tier
akg validate --rule executable-needs-tests  # specific rule
akg lint features/**/*.feature              # Gherkin tag lint
akg arch check                              # arch rules only (dep-cruise + ts-arch)
```

### 6.3 Projections

```
akg projections [--only studio,likec4,openapi]   # regenerate selected views
akg studio open                                  # `akg watch` + browser launch
akg watch [--port 4321]                          # dev mode (incremental rebuild + Studio live reload)
akg export gherkin specs/orders/create-order.spec.ts > out.feature
akg export ts features/checkout.feature > out.spec.ts
```

### 6.4 Patches

```
akg patch validate <patch.json>
akg patch apply <patch.json>                # speculative + apply
akg patch generate --spec <id> --kind add-example   # produce a draft patch
akg patch revert <commit-sha>               # invert and produce a revert patch
```

### 6.5 Evidence

```
akg evidence pull --config evidence/otel-queries.yaml
akg evidence ingest-cucumber generated/cucumber.ndjson
akg evidence ingest-vitest   generated/vitest.json
akg evidence ingest-playwright generated/playwright.json
akg evidence ingest-slsa <attestation-file>
akg evidence ingest-sbom <sbom-file>
akg evidence summarise                      # compact dashboard JSON
```

### 6.6 AI helpers

```
akg ai bundle <spec-id>                     # produce copy-pasteable prompt
akg ai slice <slice-id>                     # produce a slice for an MCP-disabled flow
akg ai mcp-server [--port 7878]             # start the MCP server
```

### 6.7 Migration

```
akg migrate                                 # migrate /specs files to current schema version
akg migrate plan                            # dry-run with patch summary
```

---

## 7. Repository layout (canonical)

```
.
├── akg.config.ts
├── package.json                    # pnpm workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.build.json
├── tsconfig.specs.json             # references for /specs and /arch
├── .dependency-cruiser.cjs
├── .eslintrc.cjs
├── tsdoc.json                      # registered @akg.* custom tags

├── packages/
│   ├── akg-spec/                   # DSL types & constructors
│   ├── akg-markers/                # decorators, JSDoc parsers, marker constants
│   ├── akg-graph/                  # graph types + Graph query API
│   ├── akg-extractor/              # ts-morph-based extractors
│   ├── akg-validate/               # validators (Zod + Ajv + graph rules)
│   ├── akg-projections/            # generators (Studio, LikeC4, OpenAPI, JSON-LD, AI)
│   ├── akg-patch/                  # patch schema + ts-morph codemod
│   ├── akg-cli/                    # the `akg` binary
│   ├── akg-runtime/                # defineRoute, defineArchLayer, defineRegistrations
│   ├── akg-test/                   # specTest, executable example helpers, Cucumber/Vitest ingestors
│   ├── akg-config/                 # config loader and presets
│   ├── akg-mcp-server/             # MCP server exposing graph (optional)
│   └── akg-studio-runtime/         # the Web Components for Spec Studio

├── specs/
│   ├── checkout/
│   │   ├── checkout.pack.ts
│   │   └── complete-purchase.spec.ts
│   ├── orders/
│   │   ├── create-order.spec.ts
│   │   ├── cancel-order.spec.ts
│   │   └── fulfill-order.spec.ts
│   ├── payment/
│   │   ├── authorize.spec.ts
│   │   └── capture.spec.ts
│   ├── inventory/
│   │   └── reserve.spec.ts
│   ├── notifications/
│   │   └── send-order-confirmation.spec.ts
│   ├── glossary/
│   │   └── commerce.terms.ts
│   └── harnesses/
│       └── orders.create-order.harness.ts

├── arch/
│   ├── capabilities.ts
│   ├── components.ts
│   ├── ports.ts
│   ├── external-systems.ts
│   ├── rules.ts                    # custom Tier 5 validators
│   ├── views.ts                    # LikeC4 view overrides
│   └── decisions/
│       ├── adr-007-order-lifecycle.md
│       └── adr-012-event-emission.md

├── src/
│   ├── runtime/
│   │   ├── app-runtime.ts
│   │   ├── fastify-effect-plugin.ts
│   │   └── config.ts
│   ├── orders/
│   │   ├── create-order.route.ts
│   │   ├── create-order.layer.ts
│   │   ├── create-order.use-case.ts
│   │   └── schemas.ts
│   ├── payment/
│   │   ├── authorize.route.ts
│   │   ├── authorize.layer.ts
│   │   └── authorize.use-case.ts
│   └── adapters/
│       ├── postgres-order-repository.ts
│       └── kafka-event-bus.ts

├── features/
│   ├── orders/
│   │   └── create-order.feature
│   └── steps/
│       └── orders.steps.ts

├── tests/
│   ├── orders/
│   │   └── create-order.spec.ts
│   ├── architecture/
│   │   └── orders.arch.spec.ts
│   ├── e2e/
│   │   └── checkout.playwright.ts
│   └── support/
│       └── test-runtime.ts

├── evidence/
│   ├── otel-queries.yaml
│   └── compliance-rules.yaml

└── generated/                       # gitignored, regenerable
    ├── spec.graph.json
    ├── spec.graph.schema.json
    ├── spec.graph.jsonld
    ├── spec-ids.d.ts                # regenerated; only this file in /generated is consumed by tsc
    ├── validation.json
    ├── spec-studio/
    │   ├── index.html
    │   ├── assets/
    │   └── data/
    │       ├── graph.json
    │       └── validation.json
    ├── likec4/
    │   └── checkout.likec4
    ├── openapi.yaml
    ├── ai/
    │   ├── per-pack/
    │   ├── per-capability/
    │   ├── change-impact/
    │   └── failing-tests.json
    ├── views/
    │   ├── traceability.md
    │   ├── readiness-dashboard.html
    │   └── adr-index.md
    ├── patches/
    └── .akg-cache/                  # incremental fragments
```

**The only file under `/generated/` consumed by `tsc` is `spec-ids.d.ts`** — and its build hook ensures it is regenerated before type-check. Everything else under `/generated/` is purely downstream.

---

## 8. Roadmap (MVP → v4)

The roadmap mirrors the input documents' staged adoption advice. Each phase is *internally complete* — a team can stop at any phase and still have value.

### 8.1 Phase 0 — Foundations (1–2 weeks)

Goal: scaffolding only. No business value yet, but enables Phase 1.

- Bootstrap the pnpm monorepo with TypeScript project references.
- Implement `akg-spec` with the core DSL: `spec`, `specPack`, `example`, `rule`, `quality`, `ref`, relations.
- Implement `akg-graph` types and minimal `Graph` query API.
- Implement `akg-cli` skeleton with `akg build` and `akg validate` (no rules yet).
- Implement `akg-extractor` reading only `/specs/**/*.spec.ts` (no source markers, no overlays).
- One example spec end-to-end: `spec:orders.create-order` at `sketch` readiness.

Exit criterion: `akg build` reads one spec and emits a one-node graph; `akg validate` returns 0.

### 8.2 Phase 1 — MVP (3–5 weeks)

Goal: prove the loop on one bounded context (Order Management) end-to-end.

Scope:

- Full Spec DSL with all facets and relations.
- `akg-markers` with `@arch.node`, JSDoc parser, `markImplementation`.
- `akg-extractor` for source markers + `defineRoute` + `defineArchLayer`.
- `akg-validate` with the core graph validators (`unresolved-reference`, `executable-needs-tests`, all readiness profiles).
- `akg-projections` Studio v0: read-only spec pages with sections A–H from `07` §2.3 (no patch loop, no harness).
- A reference monorepo: 1 pack, ~10 specs, ~5 components, ~10 implementations, ~5 tests.
- CI integration: `akg build && akg validate` runs and gates merges.

Exit criterion: the team can write specs, mark code, navigate the Studio, and CI rejects PRs that leave specs broken.

### 8.3 Phase 2 — Patches & projections (4–6 weeks)

Goal: close the read-write loop and add the projections that make the system genuinely useful.

Scope:

- `akg-patch` with schema validation + ts-morph codemod for the common operations (`add`, `replace`, `remove`, `promote-readiness`).
- Studio patch panel + inline edits.
- LikeC4 model generation + embedded views in the Studio.
- OpenAPI/AsyncAPI export.
- AI slices generator + first MCP server prototype.
- Annotated Gherkin extractor; `akg lint`; Gherkin export.
- Traceability matrix and ADR index views.
- Evidence ingestors for Cucumber, Vitest, Playwright (the test-side of the evidence pipeline).

Exit criterion: a PM can propose an NFR target change in the Studio, export a patch, run `akg patch apply`, and see the spec file updated in PR.

### 8.4 Phase 3 — Architecture rigor (4–6 weeks)

Goal: turn the validators into a true architecture gate, and add the heavier overlay extractors.

Scope:

- `dependency-cruiser` overlay + forbidden-dependency validator.
- ts-arch-style architecture tests integrated into `akg validate`.
- ESLint rules: `akg/marker-required`, `akg/no-cross-imports`, `akg/spec-not-importing-source`.
- Effect Layer extractor with TypeChecker-driven `R` parameter analysis.
- Harnesses + Studio harness UI + "Propose tests" patch generation.
- Spec Studio Lens 2 (Architecture) and Lens 3 (Tests) complete.

Exit criterion: a refactor that violates an architectural boundary fails CI; a missing test combination is surfaced before merge.

### 8.5 Phase 4 — Delivery evidence (4–8 weeks, ongoing)

Goal: connect design-time graph to runtime reality.

Scope:

- SLSA attestation ingestor.
- CycloneDX SBOM ingestor + license-compliance validator.
- OTel observation pull + push paths; NFR-evidence validator (`nfr-violated`).
- `Build`, `Deployment`, `Observation` nodes + Spec Studio Lens 4 (Evidence).
- Optional CodeQL / Semgrep overlay extractors.
- JSON-LD export + PROV-O alignment for cross-org interop.

Exit criterion: the Spec Studio shows "p95 over the last 24h is 287 ms (within target)" sourced from live OTel data; an NFR violation in production becomes a CI-visible finding the next time `akg evidence pull` runs.

### 8.6 Phase 5+ — Future capabilities

Beyond v4, in rough priority order:

- **MCP-first AI agents** integrated with the patch loop end-to-end.
- **Multi-language extractors** (Go / Python / Rust) sharing the graph schema.
- **Graph database mirror** (Neo4j or Memgraph) for huge graphs (10k+ specs).
- **SysML v2 import/export** for organisations with formal MBSE practices.
- **CALM interop** as a packaged extension (FINOS architecture-as-code).
- **VS Code extension** with inline validation feedback and Spec Studio peek.
- **Automatic trace-link recovery** as an *assistive* feature (never authoritative).
- **Multi-tenant variant Specs** (parent + tenant-specific child specs with diff visualisation).
- **Cross-repo federation** for organisations whose architecture spans many repositories.

---

## 9. Open questions and limitations (retained from inputs)

These are not flaws — they are *known boundaries* of the v1 design that we deliberately leave open.

### 9.1 Inline vs centralised semantics

How much semantics belongs in the implementation file (via markers) vs in central `/specs/`/`/arch/` files? The recommendation in `01.md` and `02.md` was *centralised intent with selective inline markers* because TypeScript's current decorator model has limitations. We have followed that, but teams with extreme decorator affinity may want richer inline semantics. Configurable.

### 9.2 Graph database (Neo4j) — when?

A property-graph mirror becomes valuable when:

- Graph size exceeds ~10k nodes (cross-file walks become slow).
- Interactive graph algorithms (community detection, centrality) are part of regular workflows.
- External tools (Neo4j Bloom, Memgraph Lab) become part of the team's daily flow.

Until then, in-memory + JSON-LD export is enough. The graph schema is designed to map cleanly to property graphs when the time comes.

### 9.3 Trace-link recovery — never authoritative

Open research on automatic trace recovery (matching identifiers, comments, and code relations to candidate spec links) is useful as a *suggestion engine*, never as truth. The Spec Studio can surface "this code looks like it might satisfy `spec:X`" as a proposal that a human accepts via patch, but the system will never silently promote inferred edges to declared ones. This is a design boundary, not a temporary limitation.

### 9.4 Modern decorators vs experimental decorators

TypeScript 5 introduced standard decorators that are *not compatible* with `--emitDecoratorMetadata` and *do not support parameter decorators*. We have designed the marker layer to *not depend on runtime metadata* — markers are read statically by `ts-morph`. Either decorator flavor works. Teams already on `experimentalDecorators + emitDecoratorMetadata` can keep using them; new repos should prefer the modern proposal.

### 9.5 Polyglot codebases

The system is TypeScript-first by design. Polyglot support is feasible:

- Build per-language extractors (Go via go/ast, Python via libcst, Rust via rust-analyzer's API).
- Share the graph schema unchanged; each language extractor produces fragments with appropriate provenance.
- The Spec Studio renders nodes from any language.

But the *authoring* surface remains TypeScript: spec files are not duplicated per language. Polyglot is a v3+ effort.

### 9.6 Spec governance / change approval

The patch loop applies changes locally. *Who* can apply *what* is governed by the configured `patch.requireApprovalFor` rules and by standard Git workflows (PR review, CODEOWNERS). Libar Omni does not embed an RBAC system — that belongs at the Git/CI layer.

### 9.7 Performance at extreme scale

`ts-morph` and the TypeScript compiler API scale to large monorepos but require care. The cache + project-references strategy makes warm builds fast; cold builds at 100k+ TS LOC may take 1–3 minutes. Teams approaching that scale should:

- Shard `/specs/` by domain across TypeScript projects.
- Aggressively limit which files the marker extractor scans (configurable globs).
- Consider migrating the Graph builder to a long-running watch daemon backed by a SQLite cache for sub-second incremental queries.

### 9.8 AI hallucination risk

AI agents proposing patches are useful but can hallucinate. Mitigations:

- The patch *must* be validated before apply — broken IDs, missing relations, broken bindings all reject.
- The Spec Studio surfaces *every* AI-proposed change as a diff for human review (no silent apply).
- The MCP server is read-only; AI does not have a direct write path.
- Patch envelopes record `proposedBy: { kind: "ai" }` so audit logs can filter.

### 9.9 The "spec file size" question

Spec files can grow large (a feature with 20 examples, several rules, multiple ADRs). Mitigations:

- Split into multiple files; the extractor merges by ID via `enrichSpec`.
- Promote child examples to standalone `spec:*.example-id` specs.
- Use `notes` sparingly; long prose belongs in ADR markdown files.

### 9.10 The "what if the team hates this" question

Adoption realism:

- Start with one bounded context (Phase 1 explicitly says this).
- Make the Studio the *first* visible win — the patch loop and validators are second.
- Pair Libar Omni adoption with an existing pain (refactor, audit, onboarding) so the cost is tied to a visible benefit.
- Allow `--lenient` mode where missing readiness profiles warn instead of failing CI — let teams ratchet strictness as confidence grows.

---

## 10. Closing — the one-line summary

> Libar Omni turns the entire software delivery process — idea, design, code, tests, decisions, runtime evidence — into one typed, queryable, validated graph. TypeScript is the canonical authoring language. `ts-morph` is the extractor. The graph is the truth. The HTML Spec Studio is the lens. Patches are the bridge. Validators decide what is allowed.

Everything in this concept document set elaborates that sentence.
