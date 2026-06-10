# Plan 06 — Slice 1: the `ts-morph` extractor and the one graph

> **Status: ✅ EXECUTED 2026-06-10** — all eight work items landed on `feature/extractor`;
> `npm run check` green end-to-end. The tracer bullet passed whole on the first run: the untouched
> example extracts with **zero findings** (no dropped sections), `validateAuthoredModel` on the
> extractor-fed model reports zero findings (the MD-14 re-point), and the graph is exactly the
> predicted shape — 10 nodes, 22 edges (13 declared + 9 `belongsTo`), zero delivery facts.
> `examples/checkout-v1/model.ts` is deleted; delete-`generated/`-and-rebuild through the built CLI
> is byte-identical (same SHA), and the emitted bytes equal the committed golden.
>
> **Execution deviations, all deliberate:** (1) the plan's risk register watched the temporal guard,
> but the gate that actually collided with the golden was **prettier** — `format` rewrote the
> committed oracle (short arrays collapse to one line; `JSON.stringify` always expands), breaking
> byte-equality with the serializer that owns all output bytes (§2.5), so
> `test/fixtures/checkout-v1/expected-graph.json` joined `.prettierignore` as a genre exemption
> (derived-then-committed artifact, like the lockfile and `reviews/`); (2) **two corpora beyond the
> plan's list** — `invalid-malformed-id` and `unrecognized-statement` — so each of the five pinned
> finding ids has its own should-fail/should-pass corpus, not just the three activations;
> (3) `Finding` gained optional `file`/`line` (additive, L9) — §1.3/§2.5 presupposed file:line on
> report findings without naming the field growth that delivers it in the one diagnostic currency;
> (4) one grammar precision left implicit in §2.3 is now pinned in code: an envelope enum field
> (`kind`/`altitude`/`readiness`) that reifies to a *static but non-member* literal is an envelope
> error — the typed envelope cannot carry it (in authored repos `tsc` rejects it first; the
> extractor must not trust that); (5) on a duplicated id, the **model** records every authored site
> (truthful record; the existing duplicate-ids validator also fires) while the **graph** excludes
> them all — it cannot be keyed on an ambiguous id.
>
> **Next session: Slice 2 — generic anchors** (`codeAnchor`, MD-8; H10's api anchor) +
> implementation/test binding → `satisfies` and anchored `verifies` edges.
>
> **Spec anchors:** `03` (derivation, determinism, the `claim` taxonomy, the edge contract) · `04` §1
> (the static-data constraint, the two tiers) · `05` §2 (one validation path, MD-14) · `07` §6 ②
> (golden-graph fixture + determinism self-check, kept distinct) and (b) (no dropped sections) ·
> JTBD theme C (JS-C1 derive-one-graph, JS-C2 trust-every-claim, JS-C3 regenerate-pure-function).

## Context

Phase 0 shipped the protocol as code: the `Spec`/`Pack`/anchor builders, typed sections (the typing
law, MD-11), the floor table (floor-table-as-truth, MD-13), the pre-graph validators on the
`AuthoredModel` stand-in harness, an inert graph schema (`src/graph/schema.ts`, `0.1.0`), a CLI stub,
and the 9-spec + 1-pack + 2-anchor checkout-v1 example — all `*.sdp.ts` (the `.sdp.ts` extension,
MD-15). **No extractor exists**; `ts-morph` is not yet a dependency; the example feeds the validators
through hand-assembled imports (`examples/checkout-v1/model.ts`) — exactly the import-evaluation path
the one-validation-path decision (MD-14) retires once the extractor lands.

Slice 1 builds the **`extractor`** — the producer, the *only* component that reads source (`03` §1)
— for the **declared layer only**: spec files and pack manifests. Anchors, `satisfies`/anchored
`verifies` edges, `CodeNode`s, and the inferred layer ride Slice 2; the graph-validator gate rides
Slice 3.

## §1 — Decisions this plan pins (Representation, not DECISIONS.md entries)

Each of these is forced or near-forced by the ratified base; none passes the ADR three-part test, so
the paper trail is this plan + git. Where `07` §6 ② asked for a *conscious* choice, this is it.

1. **`Primitive` nodes carry their sections.** The graph is "the sole input every consumer reads"
   (`03`); the Slice-3 floor checks read section evidence and the Slice-4 Design Review renders
   section content, and neither may re-parse source (P2, DECISIONS R2). So the reified sections ride
   the node, nested under one `sections` field (structural metadata stays flat and scannable;
   content is fenced in one place). Section content preserves authored order — it is content, and
   authored order is deterministic given the repo.
2. **Schema grows additively to `0.2.0`** (L9): `PrimitiveNode` += `title?` · `file` · `sections?`;
   `PackNode` += `title?` · `framing?` · `modelRefs?` · `file`. `modelRefs` stays node **data** — the
   `03` edge contract has no `modelRefs` edge type; pack coherence reads it at Slice 3 (F4).
3. **No line numbers in the graph at Slice 1.** Nodes carry `file` only (extraction-root-relative,
   POSIX separators, no leading `./`). The golden fixture stays robust to unrelated edits; report
   findings still carry file:line for messages (JS-C2 #7 is satisfied by `file` + the report).
   Revisit at Slice 2, where a `CodeNode`'s line *is* the binding location.
4. **`title` is not a hard-error field.** The base's hard-error list (`03` §2) is deliberate: `id` ·
   `kind` · `altitude` · `readiness` · any relation target. A non-static `title` degrades with a
   warning (omitted from the node) like section detail — the graph can be keyed and typed without it.
5. **Hard errors: report everything, emit nothing.** Extraction always completes and reports every
   finding (L3 — one bad spec never poisons the rest); the offending spec is not extracted; with any
   hard error present `sdp build` exits 1 and **does not write** `graph.json` (the emitted artifact
   is all-or-nothing — a silently partial projection is the dishonesty the build exists to prevent).
   Programmatic callers still get the partial in-memory graph + the full report.
6. **`AuthoredModel`'s public demotion waits for Slice 3.** This slice makes the extractor the
   **sole in-repo producer** of `AuthoredModel` values from real corpora (the hand-assembly
   `examples/checkout-v1/model.ts` is deleted), but the barrel exports stay: the floor table's
   predicate signatures are keyed to `AuthoredModel`, and removing the exports now churns those
   types twice — once now, once at the Slice-3 re-key that deletes the seam wholesale. The
   doc-comment fence is updated to say so. (One validation path, MD-14: "Slice 1 — the extractor
   feeds the floor checks; Slice 3 — the full gate.")
7. **Sorting is code-unit string comparison** (`Array.prototype.sort` default / `<` on strings),
   never `localeCompare` — locale-aware collation is environment-dependent and would break P3.
8. **The golden lives at `test/fixtures/checkout-v1/expected-graph.json`** — the committed
   correctness oracle of `07` §6 ② (legitimate because it is in `test/fixtures/`, never
   `generated/`, which stays gitignored, L8). Its update flow is regenerate-and-review-diff; the
   diff *is* the review. It is labeled distinctly from the determinism **self-check** (rebuild twice,
   byte-compare) — two different claims, never conflated.

## §2 — Work items

### 1. Dependency + module skeleton (S)

- `ts-morph` becomes the package's **first runtime dependency** (pinned minor; tsup externalizes
  dependencies by default — verify `dist/` builds and the CLI still boots).
- New area **`src/extract/`** (the producer, beside `src/graph/` the schema and `src/validate/` the
  checks): `discover.ts` · `reify.ts` · `derive.ts` · `serialize.ts` · `index.ts`.
- Public entry: `extract({ root }): ExtractionResult` where the result carries `graph`
  (`GraphSchema`), `report` (the existing `ValidationReport`/`Finding` contracts — one diagnostic
  currency, no parallel report shape), and `model` (`AuthoredModel` — the MD-14 Slice-1 bridge that
  feeds the existing floor checks; it dissolves at the Slice-3 re-key). Exported from the barrel:
  the extractor is the package's headline capability.

### 2. Discovery (S)

- File set: `<root>/**/*.sdp.ts` minus `node_modules/` / `dist/` / `generated/` (reads `*.sdp.ts`
  from day one — the `.sdp.ts` extension, MD-15). The file list is sorted for stable diagnostics
  (output ordering never depends on filesystem enumeration anyway — item 5 owns ordering).
- `ts-morph` `Project` with `skipAddingFilesFromTsConfig`; **no type checker, no tsconfig
  dependence** — reification is pure AST reading. Spec files are reified standalone; the extractor
  never follows imports (static reification without execution — one validation path, MD-14).

### 3. Static reification — the two tiers (L)

The heart of the slice. A spec file is "a JSON file that TypeScript happens to validate" (P5).

**Recognized top-level statements** — anything else in a `*.sdp.ts` file yields a file-level
`extract/unrecognized-statement` warning (loud without inventing a hard-error class the base does
not define; the `sdp/spec-static` lint named in `04` §1 remains future work):

- import declarations whose module specifier is `@libar-dev/software-delivery-protocol` (the
  recognized builders are matched **by import binding**, so aliasing survives; identifiers bound to
  any *other* import are non-static wherever they appear);
- (exported) `const` declarations whose initializer is a `spec({ … })` or `pack({ … })` call bound
  to such an import.

**Value grammar:** string literals (and no-substitution template literals), number/boolean literals,
array literals, fresh object literals, the id-builder unwraps (`specId` / `packId` / `ref` around a
string literal), and — inside `relations[]` — exactly the six relation builders (`refines` ·
`dependsOn` · `constrainedBy` · `decidedBy` · `verifies` · `supersedes`). `as const` and parentheses
are transparent. Everything else is non-static.

**The two tiers (`04` §1 / `03` §2), per finding id:**

| Finding | Tier | Severity | Behavior |
|---|---|---|---|
| `extract/non-static-envelope` | envelope: `id` · `kind` · `altitude` · `readiness` · any relation entry/target; pack `id` · every `specs[]` / `modelRefs[]` entry | **error** | spec/pack not extracted; build fails |
| `extract/invalid-id` | any id/target failing `parseId` grammar | **error** | same — the graph is never keyed on a malformed id |
| `extract/duplicate-id` | the same id reified from two sites (L2 — ambiguity is loud) | **error** | both sites reported; build fails |
| `extract/non-static-section` | a non-static property inside an optional section (or `title`/`framing`) | **warning** | that one property dropped; the rest of the spec survives (graceful partial extraction, L3) |
| `extract/unrecognized-statement` | a statement outside the recognized set | **warning** | statement ignored, loudly |

A `relations[]` entry that is **not** one of the six builders (e.g. a raw object literal smuggling a
`satisfies` edge) is an envelope **error** — the extraction-layer twin of authoring-shape honesty,
activating the reserved fixture name `invalid-hand-authored-satisfies-edge`.

Reification constructs **plain `Spec`/`Pack`-shaped objects directly from the AST** — it never
calls the runtime builders (evaluation is the phantom-value trap MD-14 closes). GWT entries and
`IntentOpenQuestion` objects reify per the typed section shapes.

### 4. Graph derivation (M)

- **Nodes:** one `PrimitiveNode` per spec, one `PackNode` per pack — both `claim: "declared"`
  (authored). No `Anchor`/`CodeNode` this slice. Schema growth per §1.2; `schemaVersion` → `0.2.0`
  (additive, L9; `06` §6's minimal versioning).
- **Edges:** one edge per authored relation (`from` = the carrying spec, `claim: "declared"`), and
  one derived `belongsTo` per manifest entry (spec → pack) carrying `claim: "declared"` — a
  deterministic re-expression of the declared manifest inherits its source's claim; there is no 4th
  claim (`03` §3).
- **Dangling targets are emitted, not dropped:** an edge whose `to` resolves to no node still
  serializes — the unresolved id itself is the sentinel — and surfaces as a validation finding (L3);
  the full referential-integrity gate is Slice 3 (the tracer-bullet test's `validateAuthoredModel`
  covers it meanwhile).
- **Delivery facts stay empty and are omitted when empty.** No anchored edges exist before Slice 2,
  and a *declared* `verifies` edge confers nothing — `has-verifier` requires an **enabled verifier**
  (a resolvable test binding; binding, never liveness — MD-7; `02` Verifier semantics). The example's
  graph at Slice 1 honestly shows zero delivery facts.

### 5. Deterministic serialization (S)

All output bytes are owned by `serialize.ts`, so no `ts-morph` upgrade can change them silently:

- nodes sorted by `id`; edges by `(from, type, to)` (P3; code-unit compare, §1.7);
- one canonical key order per node/edge shape, pinned in the serializer; 2-space indent; LF; final
  newline; UTF-8 without BOM;
- no wall-clock timestamps, no run hashes, no absolute paths (JS-C3);
- report findings sorted by `(file, position, validatorId)` — the report is deterministic too;
- output path: `<root>/generated/graph.json` (`generated/` is already gitignored, L8).

### 6. CLI: `sdp build` + `--check-clean` (S)

- `sdp build [root]` (root defaults to cwd): discover → reify → derive → emit; prints a summary
  (specs/packs/nodes/edges/warnings) and every finding; exit 0 clean, exit 1 + **no `graph.json`**
  on hard errors (§1.5). Stays synchronous (`ts-morph` is synchronous; `runSdpCli`'s signature
  holds).
- `sdp build --check-clean`: **two independent in-process extractions, byte-compared** — a
  self-comparison, never a diff against a committed artifact (`generated/` is gitignored — `03` §2,
  `07` §6 ②). Divergence exits 1.
- `validate` keeps its honest rejection (the gate is Slice 3). `test/cli.test.ts` updated: build
  writes the file and exits 0; `--check-clean` passes; a hard-error corpus exits 1 and writes
  nothing; help text updated.

### 7. The example becomes the first real input (M)

- **Tracer-bullet re-point:** `test/checkout-v1.test.ts` builds the model via
  `extract({ root: "examples/checkout-v1" })` and asserts `validateAuthoredModel` still reports
  **zero findings** — the extractor now feeds the floor checks (one validation path, MD-14), and the
  import-evaluation path retires.
- **Delete `examples/checkout-v1/model.ts`** (the hand-assembly; the extractor discovers by glob).
  Check `examples/bootstrap-alias.ts` and the examples tsconfig for references and re-point. The two
  anchor constants stay where they are, typechecked in place — Slice 2 extracts them; the test's
  anchor-presence assertions move to direct imports or wait for Slice 2.
- **Doc-comment update** on `src/validate/authored-model.ts` per §1.6: the extractor is the sole
  in-repo producer; the public export retires with the Slice-3 graph-validator re-key.
- **The golden correctness oracle:** commit `test/fixtures/checkout-v1/expected-graph.json`; a test
  extracts the example and byte-compares (did the extractor produce the *right* graph). Expected
  content: 10 nodes (9 `Primitive` + 1 `Pack`), the declared edges from all authored relations, 9
  `belongsTo` edges, full sections, zero delivery facts.
- **No dropped sections** (`07` §6 (b)): assert the example's extraction report carries zero
  `extract/non-static-section` warnings — the fixture survives static extraction whole.

### 8. Extraction fixture corpus + activations (M)

- New corpus root `test/fixtures/extract/<case>/` holding tiny on-disk `.sdp.ts` corpora (the
  extractor reads files, not in-memory objects). Excluded from the typecheck tsconfigs — they
  exercise the extractor, not `tsc` (and `tsconfig.json`'s `test/**/*.ts` include would otherwise
  sweep them); vitest never collects them (the `.sdp.ts` extension, MD-15, doing its job).
- **Activate three reserved extractor-era fixture names** (recorded in
  `test/fixtures/authored-model.fixtures.ts`'s doc comment): `invalid-non-static-id` (envelope hard
  error; a sibling valid spec in the same corpus still extracts — L3), `invalid-non-static-section`
  (property dropped + warning, spec survives), `invalid-hand-authored-satisfies-edge` (raw
  `relations[]` entry → envelope error). Each pins one finding id, should-fail/should-pass style
  (`05` §5). Move them out of the "awaiting" list in that doc comment; `invalid-ready-with-unresolved-dependency`
  and `invalid-ready-with-target-below-defined` stay reserved for Slice 3 (the graph-shaped `ready`
  clauses ride the gate).
- Plus: a duplicate-id corpus (two files, one id — L2), a dangling-relation corpus (edge emitted,
  finding raised), and the **determinism self-check** test labeled as such (extract twice →
  byte-identical; plus an end-to-end delete-`generated/`-and-rebuild through the CLI path).

## §3 — Verification (the done gate)

1. `npm run check` green end-to-end (the temporal guard sweeps all new files by default —
   subtractive, never additive).
2. The golden test (correctness oracle) and the determinism self-check both pass and are **named
   distinctly** in test titles (`07` §6 ②).
3. The no-dropped-sections assertion passes against the untouched example (tracer-bullet
   discipline: any reification gap found is fixed in the extractor; the example changes only if a
   genuine authoring bug surfaces — then flagged, not silently edited).
4. `sdp build examples/checkout-v1` from a clean checkout writes `graph.json`; delete `generated/`,
   rebuild, byte-identical; `--check-clean` exits 0.
5. The tracer-bullet test passes on extractor output with zero findings; `examples/checkout-v1/model.ts`
   is gone; `grep -rn "model.ts" examples test` shows no dangling references.
6. Write this plan's done-record header at session end (Status: executed; **Next: Slice 2 — generic
   anchors (`codeAnchor`, MD-8; H10's api anchor) + implementation/test binding → `satisfies` and
   anchored `verifies` edges**) — the only place carrying "what next."

## §4 — Explicit non-goals (deferred by decision, not omission)

- **Anchors and the anchored layer** — `codeAnchor` (the generic `codeAnchor`, MD-8), anchor
  extraction, `satisfies`/anchored-`verifies` edges, `Anchor`/`CodeNode` nodes, delivery-fact
  computation, the example's missing api anchor (H10) → **Slice 2**.
- **The graph-validator gate** — re-keying the conformance + honesty checks to the graph, `sdp
  validate`, the public demotion of `AuthoredModel` + the pre-graph validators, the graph-shaped
  `ready` clauses and their two reserved fixtures, pack-coherence `modelRefs` kind check (F4),
  orphan/`gap` surfacing, CI gating on `sdp validate` → **Slice 3**.
- **The inferred layer** — even "minimal advisory" (basic test discovery) rides Slice 2's anchor
  work; Slice 1 emits zero `inferred` claims.
- **The reader / agent surface / Design Review / derived-readiness banner** → Slice 4; **CLI polish,
  `explain`/`search`, error-message work, the documented example** → Slice 5.
- **A persisted `report.json`** — the report prints to the CLI and returns in-memory; whether the
  Slice-3 gate persists it is decided there.
- **The decision-spec fold** (DECISIONS.md durables → `kind:"decision"` specs) — explicitly *after*
  Slice 1; it becomes the extractor's second corpus.
- **The generated `spec-ids` union** (L8 optional convenience) and the **`sdp/spec-static` lint** —
  later, optional.
- **Self-hosting** this repo's own model — a later milestone, never a Slice-1 claim (`00` §3).

## §5 — Risks

- **Reification grammar vs the real example.** The example uses `specId(…)` wraps, structured GWT,
  open-question objects — the grammar above was written against it, but the tracer bullet decides:
  any gap is an extractor fix, never an example simplification.
- **Golden brittleness is the feature.** Every meaningful example edit changes the golden; the
  regenerate-and-review-diff flow makes that the review. The risk is blind regeneration — the test
  failure message should say "review the diff, then update," not "run X to fix."
- **`ts-morph` is a heavy first dependency.** Pinned version; serializer owns all output bytes
  (§2.5), so upgrades can shift only what we *read*, caught by the golden, never silent output
  drift. CLI cold-start cost accepted at MVP scale.
- **Schema `0.2.0` ripples** through `test/graph-schema.test.ts` / `graph-schema.typecheck.ts` —
  mechanical, covered by the check gate.
- **The temporal guard vs committed fixtures:** the golden contains no ISO dates today; if a future
  corpus legitimately needs one, narrow the guard's date pattern in the same commit (plan 05's
  recorded path), never widen the genre exemptions.
- **`model.ts` deletion ripple** — `bootstrap-alias.ts`, the examples tsconfig, and any test
  importing the hand-assembled model are re-pointed in the same commit (verification §3.5).
