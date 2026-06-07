# Session 1 — Bootstrap + Phase 0 (the protocol as typed code)

> **Status: SCOPED · awaiting detailed implementation plan.** This document fixes the *scope and shape* of the
> very first setup/implementation session. A fully detailed implementation plan (file-by-file contents) will be
> authored next and reviewed against this scope before execution.
> **Date:** 2026-06-07 · **Branch:** `feature/mvp-init` · **Repo state at planning time:** docs-only; npm not yet
> initialized.

This is the first *code* session of the MVP. It implements **Slice 0** of the roadmap (`docs/concept/07` §1) —
*Phase 0, the protocol as code* — plus the repo/toolchain bootstrap that must precede any code, and it authors the
running example against the new DSL as a usability tracer bullet. It deliberately **stops before the `ts-morph`
extractor** (Slice 1).

---

## §0 — How this fits

The roadmap (`07` §1) sequences the build as Slices 0→5. Slice 0 is explicitly *the foundation, not a detour*: the
extractor, the graph schema, and every validator presuppose the typed meta-model. So the first session is "bootstrap
the repo, then build Slice 0," with the running example written first per the roadmap's tip:

> *"write the example specs and anchored code first — it forces the DSL and extractor to be usable before they are
> finished."* (`07` §1)

There is a clean complexity seam between Slice 0 (pure types + thin builders + the read-model schema — no I/O,
deterministic by construction) and Slice 1 (the `ts-morph` extractor, where source-reading, determinism P3, and
graceful-partial-extraction L3 enter). Keeping the extractor out of session 1 is what makes session 1 bounded and
green-at-the-end.

---

## §1 — Decisions locked

**Scope (selected):** Bootstrap the package + build Phase 0 (the typed meta-model + DSL) + author the
`checkout-v1` example specs against it so they typecheck. No extractor, no validator firing logic this session.

**Toolchain (selected):** **npm · ESM · TypeScript strict · Vitest · tsup · ESLint + Prettier · Node ≥ 20.**

Two cross-cutting setup decisions made here (override in the detailed plan if preferred):

1. **The example imports the package by name, via a `paths` alias.** The fixture must
   `import { spec } from "@libar-dev/software-delivery-protocol"` — the *public* DX — not `../../src`. Pre-publish,
   a `tsconfig.examples.json` maps the package name → `src/index.ts`. If this alias is wrong, the example silently
   typechecks against internal paths and the tracer bullet is defeated; verifying the public barrel re-exports
   everything the example needs is part of "done."
2. **The running example lives under `examples/checkout-v1/`, not `/specs/`.** The design's repo-shape (`04` §5)
   puts `/specs` at a *consuming project's* root; the Protocol's own repo self-hosting is an explicit *later
   milestone* (base §1). A clearly-labeled fixture avoids prematurely claiming self-hosting.

---

## §2 — Session goal & "Done" gates

**Goal:** a buildable `@libar-dev/software-delivery-protocol` package whose typed meta-model (the protocol *as
code*) is complete enough that the `checkout-v1` example authors against it and compiles.

| Gate | Command |
|---|---|
| Package + DSL typecheck | `npm run typecheck` (src) |
| Example specs compile against the public barrel | `tsc --noEmit -p tsconfig.examples.json` |
| Unit tests pass | `npm test` (Vitest) |
| Build emits JS + `.d.ts` | `npm run build` (tsup) |
| Lint clean | `npm run lint` |
| CLI runs | `npx sdp --help` (build/validate print "not implemented — Slice 1/3") |

---

## §3 — Part A: Repo & toolchain bootstrap

| File | Purpose |
|---|---|
| `package.json` | name `@libar-dev/software-delivery-protocol`, `"type":"module"`, `exports` map, `bin: { sdp }`, scripts (`build`/`test`/`typecheck`/`lint`/`format`), `engines.node ">=20"` |
| `tsconfig.json` | strict, `moduleResolution: "bundler"`, target ES2022, `declaration`, `isolatedModules`, `noUncheckedIndexedAccess` |
| `tsconfig.examples.json` | extends base, includes `examples/**`, `paths` alias → `src/index.ts`, `noEmit` |
| `tsup.config.ts` | ESM build, `dts: true`, CLI shebang banner |
| `vitest.config.ts` | node env |
| `eslint.config.js` + Prettier | flat config |
| `.gitignore` | append `node_modules/`, `dist/`, `generated/` (L8 — generated is disposable) |
| `.github/workflows/ci.yml` | install → typecheck (both tsconfigs) → lint → test → build |

---

## §4 — Part B: Phase 0 — the protocol as typed code

```
src/
  index.ts            # public barrel (the agent/author-facing surface)
  ids.ts              # branded SpecId/PackId/AnchorId; grammar <ns>:<dotted.path>#<sub>; parse/format; ref()
  model/
    descriptors.ts    # SpecKind(8) · SpecAltitude(epic→feature→story) · SpecReadiness(idea→scoped→defined→ready) + display labels
    sections.ts       # intent·behavior·constraints[]·model·design·decision·verification·ui (all optional — P7)
    spec.ts           # Spec envelope type + spec() builder
    pack.ts           # Pack type + pack() builder (framing = plain note, not truth — 02 §4)
    relations.ts      # refines·dependsOn·constrainedBy·decidedBy·verifies·supersedes builders (all claim:"declared")
    anchors.ts        # anchorImplementation()/specTest() — identity-only, intent-forbidden (P9/P10)
  graph/
    schema.ts         # read-model types: Node union (Primitive/Pack/Anchor/CodeNode…), Edge{from,type,to,claim}, deliveryFacts, schemaVersion "0.1.0"
  validate/
    contracts.ts      # Validator iface, ValidatorFamily(conformance|honesty), Severity, Finding, ValidationReport
    readiness-floor.ts# the 05 §3 floor table as data (declared, NOT enforced yet)
  cli/
    sdp.ts            # bin entry; --help; build/validate => "not implemented (Slice 1/3)"
```

Each piece is type/contract-only and pure — no I/O — so it is deterministic by construction. The graph schema and
validator contracts ship now (everything downstream presupposes them) but stay inert until the extractor (Slice 1)
and validators (Slice 3) arrive.

**Envelope discipline (L9):** the `Spec` envelope (`id · title · kind · altitude · readiness · relations`) is the
stability contract; all detail lives in optional `sections`. The session must not encode completeness in conditional
types — *types describe shape; validators decide completeness* (P7).

---

## §5 — Part C: The running example (the tracer bullet)

`pack:checkout-v1`, Order Management, ~8–12 specs (`07` §1):

```
examples/checkout-v1/
  specs/  checkout.pack.ts · orders/order-management.spec.ts · orders/create-order.spec.ts
          · 2–3 scenarios · 1–2 rules · 1 NFR(constraint) · decisions/order-lifecycle.spec.ts   (~8–12 specs)
  src/    orders/create-order.use-case.ts        # anchored: impl:orders.create-order-use-case
  test/   orders/create-order.valid-cart.test.ts # specTest verifies spec:orders.create-order.valid-cart
```

These compile against the **public barrel**. If they do not typecheck, the DSL is not usable — we fix the DSL, not
the example.

---

## §6 — Part D: Tests (Vitest)

- `ids.test.ts` — parse/format round-trip; reject malformed IDs; `ref()` branding.
- `builders.test.ts` — `spec()`/`pack()`/relation builders produce the expected plain objects.
- Example typecheck wired as a CI step (the `tsconfig.examples.json` gate).

---

## §7 — Deferred (NOT this session)

`ts-morph` extractor + `graph.json` (Slice 1) · validator firing logic + CI graph-gate (Slice 3) · reader / agent
surface + view (Slice 4) · determinism `--check-clean` (needs the extractor) · validator self-test fixtures
(`05` §5, needs validators).

---

## §8 — Suggested commits (small, on `feature/mvp-init`)

1. `chore: bootstrap package + tsconfig + vitest/tsup/eslint/prettier + gitignore`
2. `chore: CI (typecheck, lint, test, build)`
3. `feat: stable IDs — branded types, grammar, parse, ref`
4. `feat: descriptors + sections types`
5. `feat: Spec/Pack/relations/anchors DSL builders`
6. `feat: graph read-model schema types`
7. `feat: validator + report contracts + readiness-floor table (data)`
8. `feat: sdp CLI stub`
9. `test: ids + builders`
10. `feat(examples): checkout-v1 running example + typecheck gate`

---

## §9 — Risks & gotchas

- **Self-referencing import alias** (§1.1) — the single most likely thing to get subtly wrong; verify the example
  resolves the package *name*, not `src`.
- **Over-reach into Slice 1** — resist adding any source-reading / `ts-morph` here; the green seam is "types compile,
  example compiles," nothing runtime-derived.
- **Encoding completeness in types** — keep all sections optional; readiness floors are *data* this session, enforced
  later (P7, P8).

---

## §10 — Traceability

| Session element | Anchored in |
|---|---|
| Slice 0 = protocol as code | `07` §1; `00` §3; base §1 |
| `Spec` envelope + 3 descriptors + sections | `02` §1–§3; P4, P7, P8, L9 |
| Stable IDs grammar | `02` §5; P6 |
| Relations + claim:"declared" | `02` §6; `03` edge contract; P9 |
| Anchors identity-only | `04` §2; P9, P10 |
| Graph read-model schema types | `03` §1 |
| Validator/report contracts + two families | `05` §1–§2 |
| Readiness-floor table (data) | `05` §3 |
| Running example as tracer bullet | `07` §1 tip; `04` §5 |
| `generated/` disposable / gitignored | L8; `03` §4 |

---

## §11 — Next session preview

**Session 2 = Slice 1:** the `ts-morph` one-graph extractor reading `examples/checkout-v1/specs/**` + anchors,
emitting `graph.json` (nodes + declared relations), with the deterministic-rebuild discipline (P3) and graceful
partial extraction (L3). The example authored in session 1 becomes its first real input.
