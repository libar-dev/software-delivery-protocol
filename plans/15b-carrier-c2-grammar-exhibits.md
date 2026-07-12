# Plan 15b — C2 own grammar: the exhibit PR (plan 14's second full-bar competitor)

> **Status: 🔲 DRAFTED 2026-07-12 — execution plan for the C2 carrier exploration PR.**
> Part of the plan-15 fork (`15a`–`15d`: one plan family, four carriers, only one survives the
> ruling — plan 16 is the ruling session). 15a (F2 markdown) is implemented as PR #4; this plan
> is deliberately parallel to 15a in structure and evidence so the ruling session compares like
> with like.
>
> **Spec anchors:** plan 14 §1–§3 as amended (the operational competition plan — the exhibit
> bar of record, the C2 posture, the scope fence) · plan 12 §8 (the ruling text the bar
> restates; MD-17 point-per-example; the TS-DSL-stays-canonical rule) · FINDINGS §4 (the
> scorecard axes and the pre-scored C2 column) · `explorations/executable-examples/1-grammar/`
> (the seed, named by plan 14 §3) · CONTEXT.md "The executable half" (ratified vocabulary;
> *notation* and *carrier* stay flagged until the ruling).

## §0 — Context: why this PR exists, and what kind of work it is

Plan 12's design session ratified everything carrier-independent (generated contracts, the
example space, the oracle, the runner) and turned the one remaining question — **which file
format carries the owned notation and the envelope** — into an evidence competition. **C2 — the
own grammar — is the identity maximalist** (FINDINGS §4: the sharpest differentiation sentence,
"a grammar for delivery state"; the strongest standalone no-toolchain wedge; at maximal
permanent ownership cost), and plan 14 §1 gives it the full five-deliverable bar. It is the only
competitor the record says can beat F2. This plan is the C2 PR's execution plan.

The competition's terms make the shape of the work unusual, worth stating plainly: **this PR
produces evidence, not product.** Every file lives under
`explorations/carrier-competition/c2-grammar/`; nothing under `src/`, `examples/`, the concept
docs, or any root config is touched; the TS DSL remains the sole canonical authoring surface
throughout (no spec ever has two homes). The house method applies end-to-end: arguments are
converted into committed transcripts — captured `tsc`/vitest/CLI output, mechanical diffs —
never assertions.

**Branch and reference (read this before touching anything):**

- Cut the branch from the **pinned commit `251736137f6baa9748abeebe0fbbfa03e4dfa300`** (the
  PR #3 merge — the exact reference PR #4 was also cut from), *not* from wherever `main` sits
  when this session runs. From the main checkout:

  ```sh
  git switch -c explore/carrier-c2-grammar 251736137f6baa9748abeebe0fbbfa03e4dfa300
  ```

  The pin keeps every exhibit bound to the identical machinery snapshot and every carrier PR's
  merge-base diff clean, regardless of what has merged since.
- **This plan file, the F2 exhibit (`explorations/carrier-competition/f2-markdown/`), and the
  other 15-family plans are NOT in the branch's tree** — they postdate the pin. Read this plan
  from the main checkout (`git show main:plans/15b-carrier-c2-grammar-exhibits.md`). Never copy
  F2's exhibit files onto this branch; this plan restates every fact and recipe the session
  needs.
- **Setup before any executable exhibit:** `npm install && npm run build &&
  npm run generate:example` — `examples/checkout-v1/generated/` (the real contracts the exhibit
  binds) is **not committed** at the pin; it is built output.

**Owner choices recorded at planning (2026-07-12), mirrored from 15a for evidence parity:**
1. The graph-shape proof of deliverable 1 is a **spike parser** inside the exploration
   (mechanical evidence: grammar text → the extractor's reified seam shape → `deriveGraph` →
   diff against the real `graph.json`), reusing the package's real notation functions — never a
   re-implementation of the slot grammar.
2. Deliverable 2 ports **both** structure-heavy kinds (`model` *and* `contract`), not one —
   together with F2's twin ports they generate exactly the evidence the ruling session's
   kind-partitioned dual-carrier docket item needs.
3. The exhibit's material is the **same worked material** as F2's, point for point (same specs,
   same arc rungs, same table rows, same one-line drift edit), so every scorecard axis compares
   carriers, never content.

**Lessons carried from the F2 PR's review pass (apply from the start, not at the end):**
- Every validator/finding id in `DIAGNOSTICS.txt` must be a **real pinned id** verified against
  `src/` at implementation time — a wrong id was a confirmed F2 finding.
- Any illustrative flourish (output the machinery cannot produce today) must be **labeled** as
  illustrative, separated from the verbatim-shape parts.
- Every stated readiness in the table-sugar family must be **floor-checked by a test**, not
  narrated.

## §1 — The bar this PR is judged against (plan 14 §2, restated as a checklist)

1. **The maturity arc** — `spec:orders.create-order` (behavior parent, gains the example space)
   + `spec:orders.create-order.valid-cart` (example child, gains the bound point), each one file
   enriched in place `idea → scoped → defined → ready` as staged snapshots, **executable at
   `ready` through the real plan-13 machinery**: the exhibit's bound test imports
   `examples/checkout-v1/generated/contracts/orders.create-order.valid-cart.contract.ts`
   exactly as the in-repo test does, and the `ready` form provably maps onto the same graph
   shape the TS DSL produces.
2. **One prose-heavy + one structure-heavy kind** — the `decision` record, plus both
   structure-heavy kinds: the `model` spec (terms map — the shape most hostile to prose
   carriers, and the shape a grammar file must prove it can carry without becoming a data
   format) *and* the `contract` spec (idea-rung, blocking open question).
3. **The table sugar** — the grammar's syntax for a multi-point example and its **static
   expansion to N sibling examples** (point-per-example, MD-17), shown mechanically, not
   asserted.
4. **`SCORECARD.md`** — self-scored against the twelve FINDINGS §4 axes (agent emission
   register · non-engineer authoring/review · conversation→repo verbatim · envelope typing ·
   prose · kind coverage · ownership cost · differentiation sentence · standalone wedge ·
   diff/merge ergonomics★ · agent read-back token cost★ · minimum-ceremony `idea` spec★) plus
   the differentiation paragraph (*what does this carrier know that Gherkin doesn't?*);
   `IMPORT-NOTES.md` earns extra weight.
5. **The CLI-feedback sketch** — what a typo'd envelope reports at `sdp validate`, verbatim, as
   a mock transcript in the house `DIAGNOSTICS.txt` style, under the one-line diagnostic law.

House rules that bind even though the toolchain doesn't (plan 14 §2): no gen-1 product name
anywhere in the exhibits (say "gen 1" / "the prior art"); the ratified vocabulary (CONTEXT.md)
end-to-end; captured transcripts committed verbatim as the evidence they are.

**C2's own posture questions (plan 14 §3) — named for the ruling session, never ruled here:**
- **Envelope-as-syntax** (vs frontmatter — FINDINGS §5's first open question): this exhibit is
  the syntax side of that comparison; the README states what identity-as-grammar buys and costs,
  it does not rule the question.
- **How prose is delimited in a grammar file** — the gen-1 truncated-docstrings caution is the
  standing evidence against grammar-carried prose; `PROSE-NOTES.md` names the delimitation rule
  this exhibit uses and its failure modes honestly.
- **The ownership cost made concrete** — plan 14 §3's explicit demand: `OWNERSHIP.md` itemizes
  the owned surface (each item marked *forever*), and the exhibit shows — not narrates — that
  GitHub renders `.sdp` as plain text today.
- **Prose-in-graph** (the MD-10 extension) is shared with F2 and already named there; C2 adds
  its dropped-prose count as corroborating data, never a second proposal.

## §2 — Verified facts the implementing session must know (each checked against source at the pin)

These were verified during 15a/15b planning against commit `2517361…` (nothing under `src/` has
moved between the two plans); several correct plausible-but-wrong assumptions:

1. **`deriveGraph` is NOT exported from the package barrel.** `src/extract/index.ts` re-exports
   only `PROTOCOL_MODULE_SPECIFIER`, `extractFindingIds`, `serializeGraph`,
   `extractValidatorId`, and `extract`. Consequence: a plain `.mjs`-importing-`dist` spike is
   dead — the spike runs as **TS under the exploration's local vitest config**, deep-importing
   `src/extract/derive.ts` by relative path (the *type* of the seam likewise:
   `import type { FileReification } from "../../../../src/extract/reify.js"`). This "carrier
   seam exists but is not public surface" fact is itself exhibit-worthy — one sentence in
   `IMPORT-NOTES.md`.
2. **These ARE importable via the package alias** (barrel exports): `serializeGraph`,
   `generateContracts`, `buildGraphIndex`, `evaluateReadinessFloor`, `deriveReadiness`,
   `kindEvidence`, `SPEC_SECTION_NAMES`, `SPEC_RELATION_TYPES`, and the whole notation family
   (`parseSlots`, `stepSkeleton`, `renderStepText`, `boundSlotValues`, `hasUnboundSlot` —
   `src/notation/slots.ts`).
3. **The real parent states `readiness: "defined"`, not `ready`**
   (`examples/checkout-v1/specs/orders/create-order.sdp.ts`), and carries three relations
   (`refines` + `constrainedBy` + `decidedBy`). The arc's `04-ready` parent therefore cannot
   node-diff field-exact — §5's splice-and-floor design handles it.
4. **Both arc nodes carry `deliveryFacts`** (derived from anchors, which no carrier authors)
   and every checkout-v1 spec has a `belongsTo` edge from the pack manifest. The spike's diff
   normalizes these out **by name, never silently**.
5. **The parent's third `then` vocabulary step is
   `'order creation is rejected because {reason:"empty cart"|"out of stock"}'`.** The
   `1-grammar/` seed predates the landed vocabulary — mirror the real
   `create-order.sdp.ts` example space verbatim (it feeds the contract byte-diff), never the
   seed's step texts.
6. **The one-line diagnostic rendering is `file[:line] — [severity] validatorId — message`**
   (`formatFinding`, `src/cli/sdp.ts`). The seed's `1-grammar/DIAGNOSTICS.txt` mock predates
   it; the C2 mock uses the real shape with real pinned finding ids (verify each against
   `src/extract/` and `src/validate/` at implementation — e.g. the referential-integrity and
   unrecognized-property families), keeping the did-you-mean flourish *labeled as illustrative*
   where the shipped machinery does not produce it.
7. **Toolchain exemptions confirmed:** `explorations/**` is ignored in `eslint.config.js`,
   `.prettierignore`, and `check-temporal.mjs`; root `vitest.config.ts` includes only `test/**`
   and `examples/**`; root tsconfigs never include `explorations/`. Everything here is
   invisible to `npm run check` — by design.
8. **The readiness floor clauses** (`src/validate/readiness-floor.ts`) that dictate every arc
   rung: *idea* = id · title · kind · altitude · (intent.outcome OR refines); *scoped* =
   intent.outcome · ≥1 relation · kind-evidence present; *defined* = kind-evidence complete ·
   no blocking open questions (for `example` kind this includes the **concreteness law**:
   every used step fully bound and compatible with the parent space); *ready* = all relations
   resolve · refines/dependsOn targets ≥ defined · anchors resolve.
9. **The exact reified shape the spike must emit** (`src/extract/reify.ts`):
   `ReifiedSpec { data, id, file, line }` inside
   `FileReification { specs, packs, findings }`, where `data` is the Spec-shaped record —
   envelope fields + section names from `SPEC_SECTION_NAMES`, `relations` as
   `[{type, target, claim: "declared"}]`.
10. **`examples/checkout-v1/generated/` is not committed at the pin** — run
    `npm run generate:example` (after `npm run build`) before the executable exhibit or the
    contract byte-diff can run.

## §3 — The exhibit tree

All under `explorations/carrier-competition/c2-grammar/` (nothing outside it is created or
modified):

```
explorations/carrier-competition/c2-grammar/
├── README.md                 # exhibit map: deliverable → files; run commands; the .sdp→graph mapping table
├── SCORECARD.md              # deliverable 4: 12-axis self-score + differentiation paragraph
├── IMPORT-NOTES.md           # deliverable 4 extra weight: the sdp-import emitter targeting .sdp
├── OWNERSHIP.md              # plan 14 §3's demand: the owned-surface bill, itemized and concrete
├── PROSE-NOTES.md            # prose delimitation in a grammar file + the truncated-docstrings caution + the dropped-prose count
├── DIAGNOSTICS.txt           # deliverable 5: mock `sdp validate` transcript, formatFinding shape, real pinned ids
│
├── arc/                      # deliverable 1: staged snapshots, two specs × four rungs
│   ├── 01-idea/      create-order.sdp · create-order.valid-cart.sdp
│   ├── 02-scoped/    (same two filenames)
│   ├── 03-defined/   (same two filenames)
│   └── 04-ready/     (same two filenames — byte-identical to specs/)
│
├── specs/                    # the exhibit's "live" documents
│   ├── orders.create-order.sdp                # arc-final parent
│   ├── orders.create-order.valid-cart.sdp     # arc-final child
│   ├── decisions.order-lifecycle.sdp          # prose-heavy: decision kind, ported
│   ├── orders.order-model.sdp                 # structure-heavy: model kind (terms map), ported
│   └── orders.create-order.api-contract.sdp   # structure-heavy: contract kind at idea, blocking open question, ported
│
├── table-sugar/              # deliverable 3 (MD-17)
│   ├── TABLE-NOTES.md        # syntax proposal · MD-17 mapping · the diff/merge argument
│   ├── orders.create-order.order-total.sdp    # host rule spec carrying the `cases` block
│   └── expanded/             # committed expander output — generated, never hand-edited
│       ├── orders.create-order.order-total.single-unit.sdp
│       ├── orders.create-order.order-total.multi-line.sdp
│       └── orders.create-order.order-total.zero-price.sdp
│
├── spike/                    # the graph-shape evidence
│   ├── grammar-parse.ts      # hand-rolled line-oriented grammar-subset parser (no new deps — stated in-file)
│   ├── sdp-reify.ts          # .sdp → ReifiedSpec/FileReification (the extractor-seam shape)
│   ├── expand-table.ts       # `cases` block → N sibling .sdp documents (pure function)
│   ├── graph-shape.test.ts   # reify → deriveGraph → serializeGraph → diffs + splice/floor + contract byte-diff
│   ├── table-expansion.test.ts  # expander output === committed expanded/* (byte-exact); N example nodes reify; floors checked
│   ├── emitted/              # committed spike output (evidence)
│   │   ├── graph-fragment.json                          # serializeGraph of the grammar-derived graph
│   │   └── orders.create-order.valid-cart.contract.ts   # generateContracts output from the grammar-derived graph
│   └── SPIKE-OUTPUT.txt      # captured verbatim vitest transcript of the spike tests
│
├── executable/               # deliverable 1's "executable at ready"
│   ├── create-order.valid-cart.test.ts   # binds the REAL generated contract; mirrors the in-repo bound test
│   ├── drift-demo.red.test.ts            # the honest red demo (§6) — excluded from the green include
│   ├── after-edit/
│   │   ├── orders.create-order.valid-cart.sdp           # the spec copy with {total: 150} — the one-line edit
│   │   └── orders.create-order.valid-cart.contract.ts   # spike-emitted contract from the edited grammar file (committed)
│   ├── GREEN-RUN.txt         # captured verbatim green vitest transcript
│   └── RED-RUN.txt           # captured verbatim red vitest transcript (drift demo alone)
│
├── tsconfig.json             # §6 — embedded verbatim below (same directory depth as 15a's exhibit)
└── vitest.config.ts          # §6 — embedded verbatim below; red-demo env var SDP_C2_RED
```

Deliberately **no `envelope.schema.json`**: C2's envelope-typing story is *extractor
diagnostics until an LSP exists* (the FINDINGS §4 row) — pretending a schema file helps a
grammar surface would fake the axis. `DIAGNOSTICS.txt` and `OWNERSHIP.md` carry that axis
honestly.

## §4 — The grammar and the maturity arc (deliverable 1's authored half)

The syntax extends the `1-grammar/` seed's recorded forms, under the seed's own discipline
stated in every file header: **syntax illustrative only — the winner's surface-design session
owns the real grammar design.** The load-bearing law: **line-oriented; keyword-led lines are
structure, everything else is prose.** The envelope: `spec <id>` on line one, then an indented
`<kind> · <altitude> · <readiness>` descriptor line, then indented relation lines
(`refines <id>` · `verifies <id>` · `constrainedBy <id>` · `decidedBy <id>` — one target per
line). The `spec` keyword is the namespace: reify maps `orders.create-order` →
`spec:orders.create-order`. The first non-keyword line after the envelope is the **title**
(a missing title fails the idea floor's title clause honestly).

The floor clauses (§2.8) drive exactly what each rung adds. Work **backwards** from `04-ready`
(mirroring the real specs' field strings verbatim so node diffs are field-exact) by removal —
that keeps every rung honest by construction.

- **`01-idea/`** — the minimum honest spec, and the highest-volume authoring event (the scored
  minimum-ceremony axis). The parent is four lines + a title:

  ```
  spec orders.create-order
    behavior · feature · idea
    refines orders.order-management

  Customer creates an order
  ```

  The child is the same shape (`example · story · idea`, `refines orders.create-order`). One
  optional prose sentence under the title shows what prose costs in this carrier (a line, but
  no delimiter — and no rendering; note it for the scorecard).
- **`02-scoped/`** — parent adds an `intent` block (indented `outcome:` and `value:` lines,
  strings mirrored verbatim from the real spec); the child adds the `verifies` relation and a
  **prose** GWT block (keyword-led `Given/When/Then/And` lines, plain sentences, no slots — the
  seed's stage-2 form; a prose examples entry is the example kind's scoped evidence).
- **`03-defined/`** — the structural heart of the arc: the **parent gains the example space**
  (an `example space` block whose Given/When/Then lines mirror `create-order.sdp.ts`'s
  `exampleSpace` verbatim, typed slots included — `{n:number}`,
  `{availability:"in stock"|"out of stock"}`, and the corrected third `then` of §2.5), and the
  **child's GWT block flips from prose to the bound point** (`{n: 2}` · `{q: 1}` ·
  `{price: 50}` · `{availability: "in stock"}` · `{total: 100}` — the concreteness law is a
  defined-rung clause). Parent adds `constrainedBy` + `decidedBy` (targets are defined in the
  real graph).
- **`04-ready/`** — child adds the `verification executable` block (the seed's stage-3 form:
  the keyword line + indented criteria lines) and states `ready`; its enabled-verifier fact
  comes from the **in-repo** test anchor, which the exhibit's bound test mirrors (§6). The
  parent states `ready` **with the honesty note written in the document as prose**: the in-repo
  TS spec states `defined` (stating less than you clear is lawful — the floor is never a
  quota); spliced into the real graph, the parent's ready clauses pass, and the spike proves
  that mechanically (§5). `04-ready/*` byte-identical to `specs/`.

**The three ports (deliverable 2):**
- `decisions.order-lifecycle.sdp` — the prose-heavy port, and the place this carrier is
  weakest by its own FINDINGS row: the Context paragraphs are bare prose lines, the `decision`
  block carries `decision:` (scalar) and `rationale:` / `consequences:` (indented list lines)
  mapped onto the real spec's `decision` section fields so the node diffs field-exact. Where
  the grammar makes the prose feel worse than the document twin, **that is evidence — record
  it in `PROSE-NOTES.md`, never smooth it over.**
- `orders.order-model.sdp` — a `model` block, one term per line
  (`cart — A customer-selected set of line items…`; term ↔ `model.terms` key, em-dash separates
  the definition). Exact strings from `order-model.sdp.ts`.
- `orders.create-order.api-contract.sdp` — parked honestly at `idea`: an `intent` block with
  `outcome:` plus the seed's open-question form
  (`? Does the response carry the inventory-snapshot version …? [blocking]`) →
  `intent.openQuestions[{question, blocking: true}]`. The prose names why it parks: a blocking
  open question fails the defined floor.

## §5 — The spike parser (the graph-shape evidence)

**Toolchain decision (inherited from 15a, same reasoning):** TS modules run **as vitest tests**
under the local `vitest.config.ts` (needed anyway for the bound test): (a) `deriveGraph` is
reachable only by relative deep import of `src/extract/derive.ts` (§2.1); (b) zero new deps,
zero build step; (c) the captured transcript doubles as evidence. README records the
considered-and-dead alternative (`.mjs`-on-dist).

**Pipeline (`grammar-parse.ts` → `sdp-reify.ts` → `graph-shape.test.ts`):**

1. `grammar-parse.ts` — hand-rolled, line-oriented, indentation-sensitive subset, stated
   in-file (no parser dep; the PR adds no dependencies): the envelope forms of §4; the block
   keywords (`intent` · `model` · `decision` · `verification` · `example space` · `cases`);
   keyword-led GWT lines with `And` continuing the previous keyword's bucket; the
   `? …? [blocking]` question form; `#` comment lines ignored. Anything else at a structural
   position throws "outside the grammar subset" (spike, not product; the real carrier would
   emit `extract/*` findings — say so in a comment).
2. `sdp-reify.ts` — `reifySdp(text, relativePath): FileReification` plus the honesty
   side-channels:
   - `title` ← the first prose line after the envelope (decision recorded in-file).
   - blocks onto `SPEC_SECTION_NAMES`: `intent` (`outcome:` / `value:`; open-question lines
     with `[blocking]` markers) · `model` (term-lines → `model.terms` record, authored order
     preserved) · `decision` (`decision:` scalar; `rationale:` / `consequences:` arrays) ·
     `verification` (`mode` + criteria list).
   - `example space` block → `behavior.exampleSpace {given[], when[], then[]}` (slot syntax
     passed through **verbatim** — the package's `parseSlots` is used only to *validate*
     declarations). The child's GWT block → `behavior.examples[0]` the same way
     (`hasUnboundSlot` flags unbound-in-used-step for the honesty note).
   - **Free prose outside recognized structures is dropped from the data record with a counted
     notice** — that count is the concrete number `PROSE-NOTES.md` reports (corroborating the
     prose-in-graph question F2 named; C2 files no second proposal).
   - Relations → `[{type, target, claim: "declared"}]` (§2.9).
3. `graph-shape.test.ts` — the evidence, five checks (identical in design to 15a §5, so the
   ruling session reads two directly comparable transcripts):
   - Reify all `specs/*.sdp` (+ `table-sugar/expanded/*` in a second describe) →
     `deriveGraph(specs, [], [])` → `serializeGraph` → assert it matches the **committed**
     `spike/emitted/graph-fragment.json` (drift is loud).
   - **Node diff A (field-exact, the three ports):** for `orders.order-model`,
     `orders.create-order.api-contract`, `decisions.order-lifecycle`, compare against the
     `generated/graph.json` node with exactly one named normalization — drop `file`
     (carrier-relative by design; these three carry no `deliveryFacts`). Everything else,
     `sections` content included, `toEqual`-exact, keyed by id.
   - **Edge diff:** spike edges vs real edges `from ∈ ported ids`, excluding `belongsTo` (pack
     manifest not ported — a named exclusion).
   - **Arc pair (splice + floor):** child diffs field-exact after dropping `file` +
     `deliveryFacts`; parent diffs after additionally asserting the delta is **exactly**
     `readiness: ready` vs `defined` (§2.3). Then splice the two grammar-derived nodes (and
     their declared edges) into the real graph, `buildGraphIndex`, `evaluateReadinessFloor` →
     **zero failures at `ready` for both**. Then the rung ladder: each `arc/0N` snapshot
     reifies and passes the floor at its stated rung against the spliced index — the arc is
     honest by machine, not by prose.
   - **Contract byte-diff:** `generateContracts(splicedGraph)` → the emitted
     `orders.create-order.valid-cart.contract.ts` is **byte-identical** to the real generated
     one; committed to `spike/emitted/`. (If the space contract also matches under the splice,
     assert it too; if not, name the reason — the invalid-cart sibling isn't ported.)

## §6 — The executable proof (deliverable 1's "executable at ready")

**Green:** `executable/create-order.valid-cart.test.ts` mirrors the in-repo bound test
line-for-line — same `World`, same six handlers, `bindExample` from
`@libar-dev/software-delivery-protocol/vitest` — importing the **real** generated contract and
`createOrderFromCart` from `examples/checkout-v1/` (read-only imports; nothing under
`examples/` changes). **Omit the `specTest` anchor**, with the reason in a comment: the real
anchor lives beside the in-repo test; a duplicate `test:` id here would be exhibit theater and
dishonest if the extraction root ever widened.

**Wiring — embedded verbatim (the carrier branch has no F2 exhibit to copy from; directory
depth is identical, so the relative paths transfer unchanged):**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "baseUrl": "../../..",
    "paths": {
      "@libar-dev/software-delivery-protocol": ["src/index.ts"],
      "@libar-dev/software-delivery-protocol/runner": ["src/runner/index.ts"],
      "@libar-dev/software-delivery-protocol/vitest": ["src/adapters/vitest.ts"]
    }
  },
  "include": ["**/*.ts"]
}
```

`vitest.config.ts` (note the **explicit `root`** — vite's root defaults to `process.cwd()`, so
include patterns would otherwise resolve against wherever the command runs; a verified risk):

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const packageAliasTarget = fileURLToPath(new URL("../../../src/index.ts", import.meta.url));
const runnerAliasTarget = fileURLToPath(
  new URL("../../../src/runner/index.ts", import.meta.url),
);
const vitestAdapterAliasTarget = fileURLToPath(
  new URL("../../../src/adapters/vitest.ts", import.meta.url),
);

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  resolve: {
    alias: [
      { find: "@libar-dev/software-delivery-protocol/runner", replacement: runnerAliasTarget },
      {
        find: "@libar-dev/software-delivery-protocol/vitest",
        replacement: vitestAdapterAliasTarget,
      },
      { find: "@libar-dev/software-delivery-protocol", replacement: packageAliasTarget },
    ],
  },
  test: {
    environment: "node",
    globals: true,
    include:
      process.env.SDP_C2_RED === "1"
        ? ["executable/drift-demo.red.test.ts"]
        : ["executable/create-order.valid-cart.test.ts", "spike/**/*.test.ts"],
  },
});
```

**Run command (both transcripts, cwd-independent):**
`npx vitest --run -c explorations/carrier-competition/c2-grammar/vitest.config.ts`
(type-level: `npx tsc -p explorations/carrier-competition/c2-grammar`).

**The red demo — honest framing (do not fudge this).** Editing the grammar file cannot redden
anything by itself: the real generated contract derives from the TS DSL spec (the canonical
surface, by competition law), and no toolchain watches `.sdp`. The honest demo runs the
document through the spike's own pipeline — which is the whole point of the exhibit:

1. `after-edit/…valid-cart.sdp` — the spec copy with the single edit `{total: 100}` →
   `{total: 150}` (a one-line diff in the grammar file — SCORECARD diff-axis evidence too).
2. The spike's emit path regenerates the contract from the edited document; the committed
   `after-edit/…contract.ts` diffs one line against `spike/emitted/…contract.ts`:
   `params: { total: 150 }`.
3. `drift-demo.red.test.ts` binds the after-edit contract with **identical handlers** —
   `expect(world.order?.total).toBe(params.total)` receives 150 from the document, the
   implementation returns 100, vitest reds **at runtime with the step naming itself in the
   spec's language**. Captured as `RED-RUN.txt`. The framing sentence goes in the test header:
   *the value flows grammar file → spike extraction → generated contract → assertion, zero test
   edits; the demo edits a copy because the TS DSL stays the sole canonical surface during the
   competition.*
4. `GREEN-RUN.txt` = the full suite green with the red demo excluded (hence the
   `drift-demo.red.test.ts` name, outside the green include; `SDP_C2_RED=1` runs it alone for
   `RED-RUN.txt`). Capture verbatim (`2>&1 | tee`).

## §7 — Table sugar (deliverable 3, MD-17)

**Syntax:** one `cases` block in a host spec
(`table-sugar/orders.create-order.order-total.sdp`, `kind: rule`, refining the parent):
template GWT lines with *unbound* slots, a blank line, then a pipe table whose **first column
is the point's identity** and whose remaining headers name slots:

```
spec orders.create-order.order-total
  rule · story · defined
  refines orders.create-order

Order total follows the cart math

  cases
    Given a customer has a cart with {n} line items
      And every line item has quantity {q} and unit price {price}
      And every cart item is {availability}
    When the customer submits the cart for order creation
    Then an order is created with total {total}

    | point       | n | q | price | availability | total |
    | ----------- | - | - | ----- | ------------ | ----- |
    | single-unit | 1 | 1 | 50    | "in stock"   | 50    |
    | multi-line  | 3 | 2 | 20    | "in stock"   | 120   |
    | zero-price  | 2 | 1 | 0     | "in stock"   | 0     |
```

The same three points, values, and child-id scheme as F2's exhibit — the ruling session
compares table *syntax*, never table content. `TABLE-NOTES.md` argues: **inside the `cases`
block, not a floating table** (the block is grammar, so the table cannot drift from its
template steps); **the named `point` column** gives each row stable identity → stable child id
`spec:….order-total.<point>`; **diff/merge scoring** — a value edit is a one-line row diff in a
line-oriented file (C2's strongest register — score it), concurrent edits to different rows
merge line-by-line, and the expanded siblings are *generated* artifacts (regenerable, never
hand-edited), so merges only ever happen on the table; **MD-17 mapping** — expansion is static
and pre-graph: one host node + N `example` children, each one bound point; the graph never sees
a "table".

**Mechanics:** `spike/expand-table.ts` parses the block (package `parseSlots` /
`hasUnboundSlot` for the template), zips rows against header slots, substitutes
`{slot}` → `{slot: value}` (strings keep quotes → closed-union compatible), and emits one full
`.sdp` per row (envelope `spec <host>.<point>` · `example · story · defined` — earned:
structured + fully bound; the notes say why not `ready`). Output committed under `expanded/`;
`table-expansion.test.ts` regenerates in-memory, asserts **byte-equality** with the committed
files, feeds them through `sdp-reify` → `deriveGraph`, asserts N example nodes each refining
the host, **and floor-checks every stated readiness in the family** (the F2-review lesson).

## §8 — The prose deliverables

- **`OWNERSHIP.md`** — plan 14 §3's demand, the bill made concrete. One itemized table:
  grammar spec · parser (product-grade, findings-not-throws) · formatter · syntax highlighting
  (include a ~20-line **TextMate-grammar sketch** as the concreteness artifact — enough to show
  what "own highlighting" means, never wired up) · GitHub/web rendering (**show it**: state
  plainly, beside a verbatim raw excerpt, that GitHub renders `.sdp` as an unhighlighted plain
  text file today — the rented-page contrast) · editor plugins · LSP (the envelope-typing axis's
  real cost: did-you-mean and honest-readiness arrive on save via the CLI until an LSP exists) —
  each row marked **forever**, per the FINDINGS row this exhibit must make concrete rather than
  restate.
- **`DIAGNOSTICS.txt`** — mock `sdp validate` transcript over a typo'd envelope
  (`examle` kind · a dangling relation target · a malformed descriptor line), rendered in the
  real `formatFinding` shape with real pinned finding ids (§2.6), the did-you-mean flourish
  kept and **labeled illustrative** where the shipped machinery does not produce it. A header
  separates verbatim-shape parts from grammar-specific illustrative parts (the F2-review
  lesson).
- **`PROSE-NOTES.md`** — opens with the spike's counted prose drops; states the delimitation
  law (keyword-led = structure, else prose) and its failure modes honestly (a prose line that
  begins with a keyword word; the truncated-docstrings caution as the standing gen-1 evidence);
  points at F2's named prose-in-graph proposal as the shared ruling-session item — **adds no
  second proposal**.
- **`IMPORT-NOTES.md`** — the emitter's job list for `.sdp` (the import model is
  carrier-neutral; the emitter is a *renderer of the grammar* — roughly the notation renderer
  plus the envelope printer), plus the `deriveGraph`-not-public seam note (§2.1).
- **`SCORECARD.md`** — the FINDINGS §4 C2 column confirmed/adjusted **with pointers at the
  exhibit's own files** (the minimum-ceremony axis scores `arc/01-idea/`; the diff axis scores
  the one-line after-edit and row-edit diffs; the read-back axis counts the exhibit files'
  tokens *and adds the grammar-context tax the FINDINGS row records* — the grammar must ride
  along in context until any training distribution exists; score it honestly, it is C2's
  structural handicap). Differentiation paragraph: identity-as-syntax + the standalone
  no-toolchain wedge + line-oriented review surface.
- **`README.md`** (written last) — the deliverable→file map, the run commands (including the
  `npm run generate:example` setup step), the `.sdp`→graph mapping table (envelope lines →
  envelope fields; first prose line → title; blocks → sections; `example space`/GWT blocks →
  behavior evidence; `cases` → pre-graph static expansion), the envelope-as-syntax posture
  paragraph (named for the ruling, not ruled), and the house-rules note.

## §9 — Execution order (each step ends verified)

1. **Wiring first** — scaffold the tree, local `tsconfig.json` + `vitest.config.ts` (§6
   verbatim), and a trivial `spike/graph-shape.test.ts` that only deep-imports `deriveGraph`
   and asserts it is a function. Run
   `npx vitest --run -c …/c2-grammar/vitest.config.ts` from the repo root AND from another cwd.
   *This is the one genuinely risky step (deep import + aliases + explicit root) — prove it
   before writing any content.* (Setup: `npm install && npm run build &&
   npm run generate:example` first — §2.10.)
2. **Executable green** — `create-order.valid-cart.test.ts`; green run; confirm root
   `npm run check` is untouched.
3. **Spike core** — `grammar-parse.ts` + `sdp-reify.ts`; port `orders.order-model.sdp` first
   (smallest), node diff A green for it; then `api-contract` (openQuestions), then the
   decision port. *Verify per file: field-exact node diff + edge diff.*
4. **Arc** — write `04-ready` mirroring the real specs verbatim (vocabulary from
   `create-order.sdp.ts`, §2.5); child field-exact diff + parent single-delta assert +
   splice/floor + contract byte-diff green. Derive `03 → 01` **by removal**, asserting each
   rung's floor verdict in the test as it is staged. Copy `04-ready` → `specs/`.
5. **Red demo** — after-edit fixture; emit + commit the after-edit contract;
   `drift-demo.red.test.ts` red under `SDP_C2_RED=1`. Capture `GREEN-RUN.txt`, `RED-RUN.txt`,
   `SPIKE-OUTPUT.txt`.
6. **Table sugar** — host spec + `expand-table.ts` + `table-expansion.test.ts` (byte-equality +
   N example nodes + every stated readiness floor-checked); commit `expanded/*`.
7. **Prose deliverables** — §8's six files, README last.
8. **House-rule sweep** — grep the exhibit for gen-1 product names; vocabulary against
   CONTEXT.md (*notation*/*carrier* used only as the flagged terms they are); transcripts
   verbatim; `git status` shows changes only under
   `explorations/carrier-competition/c2-grammar/`.

## §10 — Verification (what "done" means)

- `npx vitest --run -c explorations/carrier-competition/c2-grammar/vitest.config.ts` — green:
  the bound test through the **real** generated contract, node/edge diffs, splice+floor at
  every arc rung, the contract **byte**-diff, the table-expansion byte-equality, and the
  family's floor checks.
- `npx tsc -p explorations/carrier-competition/c2-grammar` — clean.
- The red demo reds with the step naming itself in the spec's language; `RED-RUN.txt`
  committed.
- `npm run check` at the repo root — green and byte-identical to the pin's behavior (the PR
  adds nothing to any toolchain scope).
- The five-deliverable checklist maps to files: (1) `arc/` + `specs/` + `executable/` +
  `spike/emitted/` + transcripts · (2) the three ports, each node-diffed · (3) `table-sugar/` +
  its test · (4) `SCORECARD.md` + `IMPORT-NOTES.md` · (5) `DIAGNOSTICS.txt`. Plus the posture
  extras: `OWNERSHIP.md` (the concrete bill) · `PROSE-NOTES.md`.
- PR body written in the house register: what each exhibit proves, what is deliberately mocked
  (the grammar subset; the spike is evidence, never product), and what is named-not-ruled
  (envelope-as-syntax vs frontmatter; prose delimitation; the ownership bill is priced, not
  ruled).

## §11 — Deliberately out of scope

- Anything under `src/`, `examples/`, `docs/concept/`, `CONTEXT.md`, root configs,
  `package.json` (zero new dependencies — the grammar parser is a hand-rolled subset).
- Ruling anything plan 14 §4 dockets: the carrier itself, envelope-as-syntax vs frontmatter,
  prose-in-graph, dual-source/kind partition, *notation*/*carrier* ratification, `sdp import`
  emitter implementation.
- Building any item on the ownership bill (formatter, highlighting beyond the TextMate sketch,
  LSP, GitHub rendering) — `OWNERSHIP.md` *prices* them; building one would be exhibit theater.
- A real `.sdp` discovery/extraction path in the product (the spike proves the seam; the
  winner's surface-design session owns productization).
- The other carrier PRs (15a landed; 15c and 15d are timeboxed CLOSED.md sessions).
