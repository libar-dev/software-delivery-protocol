# Plan 07 — Slice 2: generic anchors and the anchored layer

> **Status: ✅ EXECUTED 2026-06-10** — all eight work items landed on `feature/anchors`;
> `npm run check` green end-to-end. The example extracts its three anchors (impl + api + test)
> with **zero findings**; the graph is exactly the predicted shape — 13 nodes (2 `CodeNode` +
> 1 `Anchor` added), 25 edges (2 anchored `satisfies` + 1 anchored `verifies` added), and the
> first derived delivery facts: `spec:orders.create-order` carries
> `["implemented", "has-verifier"]`, `spec:orders.create-order.valid-cart` carries
> `["has-verifier"]`, and the invalid-cart example honestly carries nothing (declared `verifies`
> without a test binding confers nothing — MD-7). Through the built CLI: `--check-clean` passes,
> delete-`generated/`-and-rebuild is byte-identical, and the emitted bytes equal the committed
> golden. The repo root still builds cleanly as a default root — the import-binding rule (not the
> text pre-filter) is what keeps this repo's own protocol-mentioning files (`vitest.config.ts`,
> `src/extract/reify.ts`, relative-import tests) out of the anchored layer, exactly as §5
> predicted.
>
> **Execution deviations, all minor:** (1) the `misplaced-anchor` corpus pins *both*
> `extract/misplaced-authoring` shapes in one corpus (an anchor call in a function body **and** a
> `spec(…)` in a source file) — one finding id, two warnings asserted; (2) `ids.test.ts` gained a
> dedicated MD-8 test (the one `codeAnchorId` brands all three implementation-flavored
> namespaces) beyond the §2.1 rename ripple; (3) `requireNamespace` in `ids.ts` generalized to a
> namespace *list* (the multi-namespace error message now reads `expected one of the namespaces
> "impl" · "api" · "component"`) — the §2.1 item's natural shape, recorded for the message-text
> change it implies.
>
> **Next session: Slice 3 — the graph-validator gate**: re-key the conformance + honesty checks
> to the graph (one validation path, MD-14 completes), wire `sdp validate`, demote
> `AuthoredModel` + the pre-graph validators, land the graph-shaped `ready` clauses and their two
> reserved fixtures (`invalid-ready-with-unresolved-dependency` ·
> `invalid-ready-with-target-below-defined`), the `verifies`-linkage check, pack coherence (F4),
> orphan/`gap` surfacing, and CI gating on `sdp validate`.
>
> **Spec anchors:** `02` §2 (delivery facts; verifier semantics — direct, per-spec, not transitive) ·
> `02` §5 (the `impl`/`api`/`test`/`component` namespaces) · `03` §1 (what the extractor reads; the
> edge contract — `satisfies` CodeNode→Primitive, `verifies` Anchor(test)→Primitive, both anchored) ·
> `04` §2 (anchors assert a binding, never intent — R1; the binding-only `specTest`, R3; the generic
> `codeAnchor`, MD-8) · `05` §2 (one validation path, MD-14 — the model bridge persists until Slice 3)
> · `07` §6 (c) ("extracts one api anchor" is the H10 gap) · JTBD theme B (bind code to intent),
> JS-C2 (trust every claim).

## Context

Slice 1 shipped the extractor for the **declared layer**: spec files and pack manifests reify
statically into the one graph (10 nodes, 22 edges on the example), the golden oracle and the
determinism self-check pin it, and `extract(…).model` feeds the pre-graph validators (the MD-14
bridge). Anchors exist only as DSL builders (`anchorImplementation` / `specTest`) typechecked in
place in the example; `model.anchors` is hard-coded empty; the graph carries zero `anchored` claims
and zero delivery facts.

Slice 2 builds the **anchored layer**: the generic `codeAnchor` (MD-8), anchor extraction from
source files, `Anchor`/`CodeNode` graph nodes, anchored `satisfies`/`verifies` edges, and the first
**derived delivery facts** (`implemented` / `has-verifier`). The example gains its missing api
anchor (H10). The graph-validator gate stays Slice 3; the reader stays Slice 4.

## §1 — Decisions this plan pins (Representation, not DECISIONS.md entries)

1. **`codeAnchor` replaces `anchorImplementation` outright** (the generic `codeAnchor`, MD-8 — this
   is its fold). Zero adopters and zero back-compat: the narrower builder, `implAnchorId`, and the
   `ImplAnchorId` brand are **removed**, not deprecated. New: a `CodeAnchorId` brand and a
   `codeAnchorId(…)` builder accepting the three implementation-flavored code namespaces
   (`impl` / `api` / `component`). `specTest` / `testAnchorId` stay as they are: the test anchor is
   the *verifying* binding (it emits `verifies`, not `satisfies`) — a different binding direction,
   not the per-namespace sibling MD-8 rejected. The MD-8 rationale lands as the `codeAnchor`
   doc-comment (the registry row already names that destination); the registry row is annotated
   folded.
2. **The extracted anchor surface is the anchor-constant form in non-spec source files.** Discovery
   walks `<root>/**/*.ts`+`*.tsx` minus `*.sdp.ts` (the spec surface), `*.d.ts`, and the same
   excluded directories as spec discovery. Recognition is **by import binding** from the protocol
   module, exactly as in spec files; a cheap pre-parse text filter (the file must contain the
   protocol module specifier) keeps `sdp build` from AST-parsing every source file in a real repo —
   sound, because the binding rule requires that literal in an import declaration. The decorator and
   JSDoc forms (`04` §2) stay unextracted Representations.
3. **Source files are real product code — no recognized-statement sweep.** Spec files warn on every
   foreign statement; source files are the opposite: the extractor only *looks for* top-level
   `const` declarations initialized with `codeAnchor(…)`/`specTest(…)` calls bound to the protocol
   import. One new loud case (L2 — a binding the author believes exists must never silently fall out
   of the graph): a protocol *authoring* call outside its recognized surface — an anchor builder not
   in top-level-const position, or a `spec(…)`/`pack(…)` call in a non-`.sdp.ts` file — yields a new
   warning finding **`extract/misplaced-authoring`** and is not extracted.
4. **Anchor reification reuses the Slice-1 two-tier finding currency.** An anchor is almost all
   envelope: `id` and the `satisfies`/`verifies` target are binding identity — non-static or
   grammar-failing values are hard errors (`extract/non-static-envelope` / `extract/invalid-id`),
   the anchor is not extracted, the build fails. `label` is degradable detail: dropped with the
   content-tier warning (`extract/non-static-section` — the finding id names the *tier*, not the
   artifact; its doc-comment now says so). Duplicate ids — across specs, packs, *and* anchors, one
   id space keys the graph — follow the Slice-1 rule: every site reported
   (`extract/duplicate-id`), the model records all, the graph excludes all.
5. **Graph shape per the `03` §1 sample and the edge contract.** A `codeAnchor` derives a
   **`CodeNode`** `{ id, claim: "anchored", label?, file, line }` plus a `satisfies` edge
   (anchor → spec, `claim: "anchored"`). A `specTest` derives an **`Anchor`** node (same fields)
   plus a `verifies` edge (anchor → spec, `claim: "anchored"`). Schema grows additively (L9):
   `AnchorNode` += `label?` · `file` · `line`; `CodeNode` += `label?` (its `line` stays optional in
   the schema, always emitted for extracted anchors); `schemaVersion` → `0.3.0`. **Line numbers
   enter the graph for binding nodes only** — the Slice-1 revisit lands as decided there: a binding
   node's `line` *is* the binding location (what a Design Review links to, R2); `Primitive`/`Pack`
   nodes stay line-free so the golden stays robust to spec-file editing.
6. **Delivery facts are computed in derivation, exactly per `02` §2.** `implemented(S)` = ≥1
   `satisfies` edge resolves to S (S's node exists). `has-verifier(S)` = an **anchored** `verifies`
   edge resolves to S directly (a test anchored to the spec), **or** a **declared** `verifies` edge
   from an *enabled* example resolves to S — enabled = an `example`-kind Primitive that is itself
   the target of a resolving anchored `verifies` edge. No transitivity up `refines`; `observed` is
   never computed. Facts serialize in ladder order (`implemented`, `has-verifier`). A declared
   `verifies` from a non-`example` spec confers nothing (the base names the example/scenario as the
   enabled-verifier shape); *surfacing* unenabled verifiers is the Slice-3 `verifies`-linkage
   check's job, not a Slice-2 finding.
7. **Dangling anchor targets are emitted, not dropped** — the unresolved id is the sentinel, same
   as Slice-1 declared relations. Resolution gates the delivery fact (a dangling `satisfies`
   confers no `implemented`), and `validateDanglingReferences` flags the miss through the model
   bridge until the Slice-3 gate.
8. **Still zero `inferred` claims — a named deviation from plan 06 §4's aside** ("even 'minimal
   advisory' rides Slice 2's anchor work"). No consumer reads inferred edges before the Slice-4
   reader/impact surface, and emitting unread machine guesses would pin speculative bytes in the
   golden. The minimal advisory inferred set is decided when its consumer lands (Slice 4), which is
   also when "minimal" can be measured against a real query.

## §2 — Work items

### 1. The `codeAnchor` DSL (S)

- `src/ids.ts`: `CodeAnchorId` brand + `codeAnchorId(…)` over `impl`/`api`/`component` (the
  namespace-set check generalizes `requireNamespace`); `implAnchorId`/`ImplAnchorId` deleted.
- `src/model/anchors.ts`: `CodeAnchor { id, label?, satisfies }` replaces `ImplementationAnchor`;
  `codeAnchor(…)` replaces `anchorImplementation`; the doc-comment carries the MD-8 rationale
  (generic by definition — the binding is the thing; per-namespace siblings rejected as surface
  bloat). `Anchor = CodeAnchor | SpecTestAnchor`.
- Ripple: `test/builders.test.ts`, `test/builders.typecheck.ts`, `test/readiness.typecheck.ts`,
  `test/validators.test.ts`, `test/ids.test.ts`/`ids.typecheck.ts` re-point to the new names.
- `docs/concept/04` §2 reconciles to the landed state (the "until then the DSL ships the narrower
  `anchorImplementation`" sentence retires; the anchor-constant sample shows the real single-target
  signature — the R1/R3 pattern: the code is the conformant truth). `DECISIONS.md` MD-8 row
  annotated folded.

### 2. Discovery of anchor-candidate source files (S)

- `src/extract/discover.ts`: the one walk now returns spec files **and** anchor-candidate source
  files (`*.ts`/`*.tsx`, minus `*.sdp.ts`, `*.d.ts`, excluded directories), both sorted code-unit.
- The pre-parse filter (§1.2) lives at the extract step: read the text once, skip AST work when the
  protocol module specifier is absent.

### 3. Anchor reification (M)

- New `src/extract/anchors.ts`, reusing `reify.ts`'s grammar internals (exported module-to-module,
  not via the barrel): import-binding collection, transparent unwraps, static string/id
  reification.
- `ReifiedAnchor { data, id, flavor: "code" | "test", file, line }`; namespace checks per slot
  (`codeAnchor` id ∈ impl/api/component · `specTest` id ∈ test · targets ∈ spec); `label`
  degradable (§1.4).
- The misplaced-authoring scan (§1.3): any descendant call expression bound to a protocol authoring
  builder (`spec` · `pack` · `codeAnchor` · `specTest`) that is not a recognized top-level
  const initializer (anchors in source files; spec/pack never) warns `extract/misplaced-authoring`.
  The same scan applies to `spec(…)`/`pack(…)` calls in source files.

### 4. Graph derivation + delivery facts (M)

- `derive.ts` takes the reified anchors: one `CodeNode` per code anchor, one `Anchor` node per test
  anchor, one anchored edge each (§1.5); then the delivery-fact computation (§1.6) decorates
  `PrimitiveNode.deliveryFacts`.
- `serialize.ts`: canonical key order for the two node shapes — `id`, `nodeType`, `claim`,
  `label?`, `file`, `line` — mirroring `title`-before-`file` on `Primitive`.
- `src/graph/schema.ts`: `0.3.0` + the §1.5 field growth; `test/graph-schema.test.ts` /
  `graph-schema.typecheck.ts` ripple.

### 5. Extractor wiring (S)

- `extract()`: reify anchors after specs/packs; duplicate detection spans all three carriers
  (§1.4); `model.anchors` carries the reified anchors (the MD-14 bridge, honestly populated);
  `deriveGraph(specs, packs, anchors)`.
- `src/extract/index.ts` doc-comments updated: the anchored layer is in; the inferred layer is the
  named Slice-4 deferral (§1.8).

### 6. CLI (S)

- `sdp build` summary gains the anchor count (`… specs · … packs · … anchors → … nodes · … edges`);
  help text says anchors are extracted from source files under the root. `test/cli.test.ts`
  expectations updated (the example: 9 specs · 1 pack · 3 anchors → 13 nodes · 25 edges).

### 7. The example completes its anchored layer (M)

- `create-order.use-case.ts` re-points to `codeAnchor`/`codeAnchorId`.
- **H10:** new `examples/checkout-v1/src/orders/create-order.route.ts` — a small route handler
  delegating to the use case, anchored `api:orders.post` → `satisfies` →
  `spec:orders.create-order` (`04` §5's repo shape).
- The test anchor file stays as is (`specTest` is unchanged).
- **Golden regenerated and review-diffed:** +3 nodes (2 `CodeNode` + 1 `Anchor`), +3 edges
  (2 anchored `satisfies` + 1 anchored `verifies`), `spec:orders.create-order` gains
  `["implemented", "has-verifier"]`, `spec:orders.create-order.valid-cart` gains
  `["has-verifier"]`, `schemaVersion` `0.3.0`. The invalid-cart example honestly stays fact-free
  (it has no test anchor — not an enabled verifier).
- `test/checkout-v1.test.ts` re-points: anchors arrive via extraction (the direct-import assertions
  retire with the "until Slice 2" test); the zero-delivery-facts assertion inverts to pin the
  Slice-2 facts above; `validateAuthoredModel` still reports zero findings on the extracted model.

### 8. Extraction corpora + activations (M)

- `test/helpers/extract-corpus.ts` generalizes: materialize any `*.txt`-defused file (corpora now
  carry `.ts.txt` source files beside `.sdp.ts.txt` spec files).
- New corpora under `test/fixtures/extract/`, one pinned outcome each (`05` §5 style):
  - `anchored-binding` (pass): parent spec + verifying example + impl anchor + test anchor → the
    full ladder: anchored edges present; `implemented` + `has-verifier` on the parent,
    `has-verifier` on the example.
  - `unenabled-verifier` (pass): the example declares `verifies` but has no test anchor → **no**
    `has-verifier` anywhere (binding, never liveness — MD-7's gate is structural enablement).
  - `invalid-non-static-anchor` (fail): a non-static anchor target → `extract/non-static-envelope`;
    a sibling static anchor in the same corpus still extracts (L3).
  - `invalid-anchor-namespace` (fail): `codeAnchor` carrying a `test:` id → `extract/invalid-id`.
  - `duplicate-anchor-id` (fail): the same anchor id from two files → both sites reported, neither
    in the graph, the model records both.
  - `dangling-anchor` (pass extraction): `satisfies` → a missing spec — edge emitted, **no**
    `implemented`, `validateDanglingReferences` flags it.
  - `misplaced-anchor` (warn): an anchor call inside a function body → `extract/misplaced-authoring`,
    not extracted.
  - `non-static-anchor-label` (warn): the label drops, the anchor survives whole.

## §3 — Verification (the done gate)

1. `npm run check` green end-to-end (the temporal guard sweeps the new files by default).
2. The golden test and the determinism self-check pass, still named distinctly; the regenerated
   golden's diff is reviewed as part of the commit (the diff is the review).
3. The tracer bullet holds: the untouched example specs + the two existing anchors + the new route
   anchor extract with **zero findings**, and `validateAuthoredModel` on the extracted model stays
   clean.
4. The repo root still builds cleanly as a default root (the Slice-1 regression test now also
   sweeps source files for anchors — the example's anchors resolve against the example's specs from
   the same root).
5. Every new corpus pins its finding id should-fail/should-pass style; the Slice-3 reserved
   fixtures stay reserved.
6. `sdp build examples/checkout-v1` writes the 13-node graph; delete `generated/`, rebuild,
   byte-identical; `--check-clean` exits 0.
7. Done-record header written at session end (Status: executed; Next: Slice 3 — the graph-validator
   gate: re-key conformance + honesty checks to the graph, `sdp validate`, the `AuthoredModel`
   demotion, the two reserved `ready`-clause fixtures, CI gating).

## §4 — Explicit non-goals (deferred by decision, not omission)

- **The graph-validator gate** — re-keying checks to the graph, `sdp validate`, `AuthoredModel`'s
  public demotion, the graph-shaped `ready` clauses (`all-relations-resolve` ·
  `depends-on-and-refines-targets-are-defined` · `anchors-resolve`), the `verifies`-linkage check
  surfacing unenabled verifiers, pack coherence (F4), orphan/`gap` surfacing → **Slice 3**.
- **The inferred layer** — zero `inferred` claims this slice (§1.8) → **Slice 4** with its consumer.
- **Decorator / JSDoc anchor forms** — unextracted Representations (`04` §2); the anchor-constant
  form is the MVP surface.
- **Structural bindings beyond `satisfies`/`verifies`** — `component`, `implements`,
  `handles`/`emits` (`04` §2 names them; aspirational) — the anchor stays `{ id, label?, target }`.
- **Multi-target anchors** — one binding per anchor; `04` §2's decorator sketch shows an array, but
  the landed single-target shape is the conformant truth (R1/R3 pattern) and two bindings are two
  anchors.
- **The reader / agent surface / Design Review / derived-readiness banner** → Slice 4; **CLI
  polish** → Slice 5.
- **The decision-spec fold** (DECISIONS durables → `kind:"decision"` specs) — after this slice as
  before; it becomes the extractor's next corpus.

## §5 — Risks

- **Repo-root sweep collisions.** Anchor discovery now reads every `.ts` under a build root; files
  in *this* repo that merely mention the protocol specifier string (`vitest.config.ts`,
  `src/extract/reify.ts`) pass the text filter but bind nothing — the import-binding rule is the
  real gate. The Slice-1 repo-root regression test is the canary; it must stay green without
  narrowing discovery.
- **Golden brittleness grows a notch** — binding nodes carry `line`, so editing the example's
  source files above an anchor moves the golden. Accepted in §1.5 (the line is the binding
  location); the regenerate-and-review-diff flow is unchanged.
- **Two-pass grammar drift.** Anchor reification reuses the spec grammar's internals rather than
  duplicating them — one static-value grammar, two surfaces. Any divergence (e.g. id-unwrap sets)
  is explicit in `anchors.ts`, not a copy.
- **`ts-morph` parse cost on big roots.** The text pre-filter bounds it; at MVP scale (<~50 specs)
  full rebuild stays comfortable (`00`/`05`/`07`).
- **Example route handler realism.** The route file must stay a plausible thin handler (tracer
  discipline) without dragging a framework in — a plain function named like a route, not Fastify.
