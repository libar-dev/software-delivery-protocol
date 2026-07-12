# Plan — F2 markdown carrier: the exhibit PR (plan 14's first competitor)

> **Status: 🔲 DRAFTED 2026-07-12 — execution plan for the F2 carrier exploration PR.**
> Filed as **plan 15a** (owner ruling 2026-07-12): the four carrier plans share the number as a
> fork — `15a`–`15d`, only one survives the ruling — and the ruling session is **plan 16**.
>
> **Spec anchors:** plan 14 §1–§3 (the operational competition plan — the exhibit bar of record,
> the F2 posture, the scope fence) · plan 12 §8 (the ruling text the bar restates; MD-17
> point-per-example; the TS-DSL-stays-canonical rule) · FINDINGS §4 (the scorecard axes and the
> pre-scored F2 column) · `explorations/executable-examples/2-document/` + `5-harness/*.sdp.md`
> (the seeds, named by plan 14 §3) · CONTEXT.md "The executable half" (ratified vocabulary;
> *notation* and *carrier* stay flagged until the ruling).

## §0 — Context: why this PR exists, and what kind of work it is

Plan 12's design session ratified everything carrier-independent (generated contracts, the
example space, the oracle, the runner) and turned the one remaining question — **which file
format carries the owned notation and the envelope** — into an evidence competition: four
exploration PRs against one exhibit bar, judged at a dedicated PLAN-ONLY ruling session.
**F2 — the markdown carrier — is the evidence leader** (FINDINGS §4 pre-scores it strongest on
the two heaviest personas: agent emission register and non-engineer review), and plan 14 §1
gives it the full five-deliverable bar. This plan is the F2 PR's execution plan.

The competition's terms make the shape of the work unusual, worth stating plainly: **this PR
produces evidence, not product.** Every file lives under
`explorations/carrier-competition/f2-markdown/`; nothing under `src/`, `examples/`, the concept
docs, or any root config is touched; the TS DSL remains the sole canonical authoring surface
throughout (no spec ever has two homes). The house method applies end-to-end: arguments are
converted into committed transcripts — captured `tsc`/vitest/CLI output, mechanical diffs —
never assertions.

**Branch note (recorded deviation from plan 14 §1):** plan 14 prescribes worktree
`../sdp-carrier-f2` on branch `explore/carrier-f2-markdown`. This PR lives on
**`feature/markdown-carrier`**, freshly cut from `main` *after* PR #3 merged — functionally
identical (fixed reference, clean diff against `main`), kept to avoid churn (owner's choice at
planning). The other three carriers may still follow plan 14's naming.

**Owner choices recorded at planning (2026-07-12):**
1. The graph-shape proof of deliverable 1 is a **spike parser** inside the exploration
   (mechanical evidence: frontmatter + fences → the extractor's reified seam shape →
   `deriveGraph` → diff against the real `graph.json`), reusing the package's real notation
   functions — never a re-implementation of the slot grammar.
2. Deliverable 2 ports **both** structure-heavy kinds (`model` *and* `contract`), not one —
   together they generate exactly the evidence the ruling session's kind-partitioned
   dual-carrier docket item needs.
3. The branch stays `feature/markdown-carrier`.

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
   carriers) *and* the `contract` spec (idea-rung, blocking open question in the envelope).
3. **The table sugar** — the markdown syntax for a multi-point example and its **static
   expansion to N sibling examples** (point-per-example, MD-17), shown mechanically, not
   asserted.
4. **`SCORECARD.md`** — self-scored against the twelve FINDINGS §4 axes (agent emission
   register · non-engineer authoring/review · conversation→repo verbatim · envelope typing ·
   prose · kind coverage · ownership cost · differentiation sentence · standalone wedge ·
   diff/merge ergonomics★ · agent read-back token cost★ · minimum-ceremony `idea` spec★) plus
   the differentiation paragraph (*what does this carrier know that Gherkin doesn't?*);
   `IMPORT-NOTES.md` earns extra weight.
5. **The CLI-feedback sketch** — what a typo'd envelope reports at `sdp validate`, verbatim, as
   a mock transcript in the `1-grammar/DIAGNOSTICS.txt` house style, under the one-line
   diagnostic law.

House rules that bind even though the toolchain doesn't (plan 14 §2): no gen-1 product name
anywhere in the exhibits; the ratified vocabulary (CONTEXT.md) end-to-end; captured transcripts
committed verbatim as the evidence they are.

**F2's own posture questions (plan 14 §3) — named for the ruling session, never ruled here:**
- **Envelope as frontmatter:** the generated-JSON-Schema autocomplete story (JS-B2.6's pattern
  at the authoring seam) — exhibited via `envelope.schema.json` + the `yaml-language-server`
  modeline, with the editor-association gap stated honestly.
- **Does plain `.sdp.md` (commonmark + frontmatter + fences) suffice at MVP?** The exhibits are
  authored in exactly that dialect; the README states what, if anything, wanted more (MDX
  islands stay deferred).
- **Where free prose lives in the graph** — the MD-10 extension. `PROSE-IN-GRAPH.md` *names* a
  proposal with options and trade-offs; this PR does not rule it.

## §2 — Verified facts the implementing session must know (each checked against source)

These were verified during planning; several correct plausible-but-wrong assumptions:

1. **`deriveGraph` is NOT exported from the package barrel.** `src/extract/index.ts` re-exports
   only `PROTOCOL_MODULE_SPECIFIER`, `extractFindingIds`, `serializeGraph`, `extractValidatorId`,
   and `extract`. Consequence: a plain `.mjs`-importing-`dist` spike is dead — the spike runs as
   **TS under the exploration's local vitest config**, deep-importing
   `src/extract/derive.ts` by relative path. This "carrier seam exists but is not public
   surface" fact is itself exhibit-worthy — one sentence in `IMPORT-NOTES.md`.
2. **These ARE importable via the package alias** (barrel exports): `serializeGraph`,
   `generateContracts`, `buildGraphIndex`, `evaluateReadinessFloor`, `deriveReadiness`,
   `kindEvidence`, and the whole notation family (`parseSlots`, `stepSkeleton`,
   `renderStepText`, `boundSlotValues`, `hasUnboundSlot` — `src/notation/slots.ts`).
3. **The real parent states `readiness: "defined"`, not `ready`**
   (`examples/checkout-v1/specs/orders/create-order.sdp.ts`), and carries three relations
   (`refines` + `constrainedBy` + `decidedBy`). The arc's `04-ready` parent therefore cannot
   node-diff field-exact — §5's splice-and-floor design handles it.
4. **Both arc nodes carry `deliveryFacts`** (derived from anchors, which no carrier authors)
   and every checkout-v1 spec has a `belongsTo` edge from the pack manifest. The spike's diff
   normalizes these out **by name, never silently**.
5. **The parent's third `then` vocabulary step is
   `'order creation is rejected because {reason:"empty cart"|"out of stock"}'`** — the
   5-harness seed's "the cart is rejected because…" is stale. Arc-final markdown mirrors the
   real vocabulary verbatim (it feeds the contract byte-diff).
6. **The one-line diagnostic rendering is `file[:line] — [severity] validatorId — message`**
   (`formatFinding`, `src/cli/sdp.ts`). The 1-grammar DIAGNOSTICS mock predates it;
   the F2 mock uses the real shape with real pinned finding ids (`extract/*`,
   `graph/referential-integrity`), keeping the did-you-mean flourish.
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
   `[{type, target, claim: "declared"}]` (mirroring `reifyRelations`).

## §3 — The exhibit tree

All under `explorations/carrier-competition/f2-markdown/` (~35 files; nothing outside it is
created or modified):

```
explorations/carrier-competition/f2-markdown/
├── README.md                 # exhibit map: deliverable → files; the two run commands; the .sdp.md→graph mapping table
├── SCORECARD.md              # deliverable 4: 12-axis self-score + differentiation paragraph
├── IMPORT-NOTES.md           # deliverable 4 extra weight: the sdp-import emitter targeting .sdp.md (6-import is the prototype)
├── PROSE-IN-GRAPH.md         # F2 posture: NAMED MD-10-extension proposal — options + trade-offs, none ruled
├── DIAGNOSTICS.txt           # deliverable 5: mock `sdp validate` transcript, formatFinding shape
├── envelope.schema.json      # hand-authored "as sdp build would emit": enums verbatim from descriptors.ts/relations.ts + ids union
│
├── arc/                      # deliverable 1: staged snapshots, two specs × four rungs
│   ├── 01-idea/      create-order.sdp.md · create-order.valid-cart.sdp.md
│   ├── 02-scoped/    (same two filenames)
│   ├── 03-defined/   (same two filenames)
│   └── 04-ready/     (same two filenames — byte-identical to specs/)
│
├── specs/                    # the exhibit's "live" documents
│   ├── orders.create-order.sdp.md               # arc-final parent
│   ├── orders.create-order.valid-cart.sdp.md    # arc-final child
│   ├── decisions.order-lifecycle.sdp.md         # prose-heavy: decision kind, ported
│   ├── orders.order-model.sdp.md                # structure-heavy: model kind (terms map), ported
│   └── orders.create-order.api-contract.sdp.md  # structure-heavy: contract kind at idea, blocking open question, ported
│
├── table-sugar/              # deliverable 3 (MD-17)
│   ├── TABLE-NOTES.md        # syntax proposal · MD-17 mapping · the diff/merge argument
│   ├── orders.create-order.order-total.sdp.md   # host rule spec carrying the ```gwt-table fence
│   └── expanded/             # committed expander output — generated, never hand-edited
│       ├── orders.create-order.order-total.single-unit.sdp.md
│       ├── orders.create-order.order-total.multi-line.sdp.md
│       └── orders.create-order.order-total.zero-price.sdp.md
│
├── spike/                    # the graph-shape evidence
│   ├── micro-yaml.ts         # hand-rolled frontmatter-subset parser (no new deps — stated in-file)
│   ├── md-reify.ts           # .sdp.md → ReifiedSpec/FileReification (the extractor-seam shape)
│   ├── expand-table.ts       # ```gwt-table → N sibling .sdp.md documents (pure function)
│   ├── graph-shape.test.ts   # reify → deriveGraph → serializeGraph → diffs + splice/floor + contract byte-diff
│   ├── table-expansion.test.ts  # expander output === committed expanded/* (byte-exact); N example nodes reify
│   ├── emitted/              # committed spike output (evidence)
│   │   ├── graph-fragment.json                          # serializeGraph of the markdown-derived graph
│   │   └── orders.create-order.valid-cart.contract.ts   # generateContracts output from the markdown-derived graph
│   └── SPIKE-OUTPUT.txt      # captured verbatim vitest transcript of the spike tests
│
├── executable/               # deliverable 1's "executable at ready"
│   ├── create-order.valid-cart.test.ts   # binds the REAL generated contract; mirrors the in-repo bound test
│   ├── drift-demo.red.test.ts            # the honest red demo (§6) — excluded from the green include
│   ├── after-edit/
│   │   ├── orders.create-order.valid-cart.sdp.md       # the spec copy with {total: 150} — the one-line edit
│   │   └── orders.create-order.valid-cart.contract.ts  # spike-emitted contract from the edited markdown (committed)
│   ├── GREEN-RUN.txt         # captured verbatim green vitest transcript
│   └── RED-RUN.txt           # captured verbatim red vitest transcript (drift demo alone)
│
├── tsconfig.json             # local: 4-seam/5-harness compilerOptions + tsconfig.examples.json paths re-based to ../../..
└── vitest.config.ts          # local: explicit root + the three package-subpath aliases → ../../../src
```

## §4 — The maturity arc (deliverable 1's authored half)

The floor clauses (§2.8) drive exactly what each rung adds. Work **backwards** from `04-ready`
(mirroring the real specs verbatim) by removal — that keeps every rung honest by construction.

- **`01-idea/`** — the minimum honest spec, and the highest-volume authoring event (the scored
  minimum-ceremony axis). The parent is **five frontmatter lines + one H1** — the whole file:

  ```markdown
  ---
  id: spec:orders.create-order
  kind: behavior
  altitude: feature
  readiness: idea
  relations:
    refines: spec:orders.order-management
  ---
  # Customer creates an order
  ```

  (title ← H1 clears the title clause; the `refines` line clears outcome-or-parent.) The child
  is the same shape (`kind: example`, `refines: spec:orders.create-order`). One optional prose
  sentence under the H1 shows prose costs nothing.
- **`02-scoped/`** — adds: `## Intent` with `- outcome:` / `- value:` list lines; the child adds
  the `verifies` relation and a **prose** `gwt` fence (plain sentences, no slots — the
  2-document seed's form; a prose examples entry is the example kind's scoped evidence). Parent
  evidence at scoped may be promoted (the refining child now exists).
- **`03-defined/`** — the structural heart of the arc: the **parent gains the example space**
  (a `gwt-vocabulary` fence mirroring `create-order.sdp.ts`'s `exampleSpace` verbatim, including
  the corrected third `then` — §2.5), and the **child's `gwt` fence flips from prose to the
  bound point** (`{n: 2}` · `{q: 1}` · `{price: 50}` · `{availability: "in stock"}` ·
  `{total: 100}` — the concreteness law is a defined-rung clause). Parent adds `constrainedBy`
  + `decidedBy` (mirroring the real spec; targets are defined in the real graph).
- **`04-ready/`** — child adds `## Verification — executable` (mode + criteria list) and states
  `ready`; its enabled-verifier fact comes from the **in-repo** test anchor, which the exhibit's
  bound test mirrors (§6). The parent states `ready` **with the honesty note written in the
  document**: the in-repo TS spec states `defined` (stating less than you clear is lawful — the
  floor is never a quota); spliced into the real graph, the parent's ready clauses pass, and the
  spike proves that mechanically (§5). `04-ready/*` byte-identical to `specs/`.

**The three ports (deliverable 2):**
- `decisions.order-lifecycle.sdp.md` — free-prose Context paragraphs (where the carrier
  flexes), `## Decision` carrying `- decision:` / `- rationale:` / `- consequences:` list lines
  mapped onto the real spec's `decision` section fields so the node diffs field-exact.
- `orders.order-model.sdp.md` — `## Model` with one term per line:
  `- **cart** — A customer-selected set of line items…` (term ↔ `model.terms` key, em-dash
  separates the definition). Exact strings from `order-model.sdp.ts`.
- `orders.create-order.api-contract.sdp.md` — parked honestly at `idea`: `## Intent` with
  `- outcome:` plus `### Open questions` / `- [blocking] Does the response carry the
  inventory-snapshot version…?` → `intent.openQuestions[{question, blocking: true}]`. The prose
  names why it parks: a blocking open question fails the defined floor.

## §5 — The spike parser (the graph-shape evidence)

**Toolchain decision:** TS modules run **as vitest tests** under the local `vitest.config.ts`
(needed anyway for the bound test): (a) `deriveGraph` is reachable only by relative deep import
of `src/extract/derive.ts` (§2.1); (b) zero new deps, zero build step; (c) the captured
transcript doubles as evidence. README records the considered-and-dead alternative
(`.mjs`-on-dist).

**Pipeline (`micro-yaml.ts` → `md-reify.ts` → `graph-shape.test.ts`):**

1. `micro-yaml.ts` — hand-rolled frontmatter subset, stated in-file (no yaml dep; the PR adds
   no dependencies): `#` comments + the `yaml-language-server` modeline ignored; flat
   `key: value` scalars (`id` · `kind` · `altitude` · `readiness`); one nested `relations:`
   block of 2-space-indented `type: spec:…` lines (the six `SPEC_RELATION_TYPES`; one target
   per type suffices for every exhibit — the list form is a named note, not built). Anything
   else throws "outside the frontmatter subset" (spike, not product; the real carrier would
   emit `extract/*` findings — say so in a comment).
2. `md-reify.ts` — `reifyMarkdown(text, relativePath): FileReification`:
   - `title` ← first `# ` heading (decision recorded in-file: H1 is the human title, exactly as
     `sdp import` mapped it; a missing H1 fails the idea floor's title clause honestly).
   - H2 section conventions onto `SPEC_SECTION_NAMES`: `## Intent` (`- outcome:` / `- value:`;
     `### Open questions` list with `[blocking]` markers) · `## Model` (term-list →
     `model.terms` record, authored order preserved) · `## Decision` (`- decision:` scalar;
     `- rationale:` / `- consequences:` arrays) · `## Verification` (`mode` + criteria list).
   - ```` ```gwt-vocabulary ```` fence → `behavior.exampleSpace {given[], when[], then[]}`
     (keyword-prefixed lines; indented `And` continues the previous keyword's bucket; slot
     syntax passed through **verbatim** — the package's `parseSlots` is used only to *validate*
     declarations). ```` ```gwt ```` fence → `behavior.examples[0]` the same way
     (`hasUnboundSlot` flags unbound-in-used-step for the honesty note).
   - **Free prose outside recognized structures is dropped from the data record with a counted
     notice** — that count is the concrete number `PROSE-IN-GRAPH.md` opens with.
   - Relations map → `[{type, target, claim: "declared"}]` (§2.9).
3. `graph-shape.test.ts` — the evidence, five checks:
   - Reify all `specs/*.sdp.md` (+ `table-sugar/expanded/*` in a second describe) →
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
     `readiness: ready` vs `defined` (§2.3). Then splice the two markdown-derived nodes (and
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

**Wiring:**
- `tsconfig.json`: 4-seam/5-harness compilerOptions verbatim (`strict` · `noEmit` · `ES2022` ·
  `moduleResolution: "Bundler"` · `skipLibCheck`), plus `baseUrl: "../../.."` and the three
  `paths` entries from `tsconfig.examples.json` re-based; `include: ["**/*.ts"]`. Gives
  `npx tsc -p explorations/carrier-competition/f2-markdown` as the type-level command.
- `vitest.config.ts`: the root config's array-form alias block re-pathed
  (`new URL("../../../src/index.ts", import.meta.url)` etc.), **explicit
  `root: fileURLToPath(new URL(".", import.meta.url))`** (verified risk: vite's root defaults
  to `process.cwd()`, so include patterns would otherwise resolve against wherever the command
  runs), `test.include: ["executable/**/*.test.ts", "spike/**/*.test.ts"]`, node env, globals.
- **Run command (both transcripts, cwd-independent):**
  `npx vitest --run -c explorations/carrier-competition/f2-markdown/vitest.config.ts`

**The red demo — honest framing (do not fudge this).** Editing the markdown spec cannot redden
anything by itself: the real generated contract derives from the TS DSL spec (the canonical
surface, by competition law), and no toolchain watches markdown. The honest demo runs the
document through the spike's own pipeline — which is the whole point of the exhibit:

1. `after-edit/…valid-cart.sdp.md` — the spec copy with the single edit `{total: 100}` →
   `{total: 150}` (a one-line markdown diff — SCORECARD diff-axis evidence too).
2. The spike's emit path regenerates the contract from the edited document; the committed
   `after-edit/…contract.ts` diffs one line against `spike/emitted/…contract.ts`:
   `params: { total: 150 }`.
3. `drift-demo.red.test.ts` binds the after-edit contract with **identical handlers** —
   `expect(world.order?.total).toBe(params.total)` receives 150 from the document, the
   implementation returns 100, vitest reds **at runtime with the step naming itself in the
   spec's language**. Captured as `RED-RUN.txt`. The framing sentence goes in the test header:
   *the value flows document → spike extraction → generated contract → assertion, zero test
   edits; the demo edits a copy because the TS DSL stays the sole canonical surface during the
   competition — what reddens is the same seam 4-seam/5-harness proved, fed from markdown.*
4. `GREEN-RUN.txt` = the full suite green with the red demo excluded (hence the
   `drift-demo.red.test.ts` name, outside the green include; run it alone for `RED-RUN.txt`).
   Capture verbatim (`2>&1 | tee`).

## §7 — Table sugar (deliverable 3, MD-17)

**Syntax:** one `gwt-table` fence in a host spec
(`table-sugar/orders.create-order.order-total.sdp.md`, `kind: rule`, refining the parent):
template steps with *unbound* slots, a blank line, then a pipe table whose **first column is
the point's identity** and whose remaining headers name slots:

````markdown
```gwt-table
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
````

`TABLE-NOTES.md` argues: **inside the fence, not a floating table** (the fence is the one
owned-grammar surface; the page is rented, and the table cannot drift from its template steps);
**the named `point` column** gives each row stable identity → stable child id
`spec:….order-total.<point>` (fixing the numbered-placeholder weakness visible in 6-import);
**diff/merge scoring** — a value edit is a one-line row diff, concurrent edits to different
rows merge line-by-line, and the expanded siblings are *generated* artifacts (regenerable,
never hand-edited — the `generated/contracts/` law), so merges only ever happen on the table;
**MD-17 mapping** — expansion is static and pre-graph: one host node + N `example` children,
each one bound point; the graph never sees a "table".

**Mechanics:** `spike/expand-table.ts` parses the fence (package `parseSlots` /
`hasUnboundSlot` for the template), zips rows against header slots, substitutes
`{slot}` → `{slot: value}` (strings keep quotes → closed-union compatible), and emits one full
`.sdp.md` per row (frontmatter `id: <host>.<point>` · `kind: example` · `readiness: defined` —
earned: structured + fully bound; the notes say why not `ready`). Output committed under
`expanded/`; `table-expansion.test.ts` regenerates in-memory, asserts **byte-equality** with
the committed files, then feeds them through `md-reify` → `deriveGraph` and asserts N example
nodes each refining the host.

## §8 — The prose deliverables

- **`envelope.schema.json`** — enums verbatim from `src/model/descriptors.ts` /
  `src/model/relations.ts`, the ids union from the real `graph.json` node ids, written "as
  `sdp build` would emit" (JS-B2.6's pattern). The README shows the
  `# yaml-language-server: $schema=./envelope.schema.json` modeline and states the honest gap:
  frontmatter-in-markdown needs an editor association for the YAML language server to fire —
  a named posture question, not hand-waved.
- **`DIAGNOSTICS.txt`** — mock `sdp validate` transcript over a typo'd envelope
  (`kind: examle` · a dangling relation target · a misspelled section heading), rendered in the
  real `formatFinding` shape with real pinned finding ids, keeping the did-you-mean flourish.
- **`PROSE-IN-GRAPH.md`** — opens with the spike's counted prose drops, then enumerates the
  MD-10-extension options with trade-offs: (a) a content-only `prose` section keyed by heading
  path; (b) prose-as-`description` on the owning section; (c) prose stays file-only, the graph
  carries a pointer. Named for the ruling session; **not ruled**.
- **`IMPORT-NOTES.md`** — the emitter's job list (6-import's `imported/*.sdp.md` already ARE
  this file shape — the emitter is nearly a formatter), plus the `deriveGraph`-not-public seam
  note (§2.1).
- **`SCORECARD.md`** — the FINDINGS §4 F2 column confirmed/adjusted **with pointers at the
  exhibit's own files** (the minimum-ceremony axis scores `arc/01-idea/`; the diff axis scores
  the one-line after-edit and row-edit diffs; the read-back axis counts the exhibit files'
  tokens vs their TS twins). Differentiation paragraph: typed envelope + closed-union slots +
  all-eight-kinds-one-family + rented page.
- **`README.md`** (written last) — the deliverable→file map, the two run commands, the
  `.sdp.md`→graph mapping table (H1→title, H2 conventions→sections, fences→behavior), the
  plain-`.sdp.md`-suffices-at-MVP paragraph, and the house-rules note.

## §9 — Execution order (each step ends verified)

1. **Wiring first** — scaffold the tree, local `tsconfig.json` + `vitest.config.ts`, and a
   trivial `spike/graph-shape.test.ts` that only deep-imports `deriveGraph` and asserts it is a
   function. Run `npx vitest --run -c …/vitest.config.ts` from the repo root AND from another
   cwd. *This is the one genuinely risky step (deep import + aliases + explicit root) — prove
   it before writing any content.*
2. **Executable green** — `create-order.valid-cart.test.ts`; green run; confirm root
   `npm run check` is untouched.
3. **Spike core** — `micro-yaml.ts` + `md-reify.ts`; port `orders.order-model.sdp.md` first
   (smallest), node diff A green for it; then `api-contract` (openQuestions), then the
   decision port. *Verify per file: field-exact node diff + edge diff.*
4. **Arc** — write `04-ready` mirroring the real specs verbatim (vocabulary from
   `create-order.sdp.ts`, §2.5); child field-exact diff + parent single-delta assert +
   splice/floor + contract byte-diff green. Derive `03 → 01` **by removal**, asserting each
   rung's floor verdict in the test as it is staged. Copy `04-ready` → `specs/`.
5. **Red demo** — after-edit fixture; emit + commit the after-edit contract;
   `drift-demo.red.test.ts` red. Capture `GREEN-RUN.txt`, `RED-RUN.txt`, `SPIKE-OUTPUT.txt`
   (and a `tsc -p` transcript if `@ts-expect-error` pins are kept — optional; the runtime red
   carries the demo).
6. **Table sugar** — host spec + `expand-table.ts` + `table-expansion.test.ts`; commit
   `expanded/*`; extend `graph-shape.test.ts` to the N example nodes.
7. **Prose deliverables** — §8's six files, README last.
8. **House-rule sweep** — grep the exhibit for gen-1 product names; vocabulary against
   CONTEXT.md (*notation*/*carrier* used only as the flagged terms they are); transcripts
   verbatim; `git status` shows changes only under `explorations/carrier-competition/f2-markdown/`.

## §10 — Verification (what "done" means)

- `npx vitest --run -c explorations/carrier-competition/f2-markdown/vitest.config.ts` — green:
  the bound test through the **real** generated contract, node/edge diffs, splice+floor at
  every arc rung, the contract **byte**-diff, and the table-expansion byte-equality.
- `npx tsc -p explorations/carrier-competition/f2-markdown` — clean (or exactly the
  `@ts-expect-error` pins if kept).
- The red demo reds with the step naming itself in the spec's language; `RED-RUN.txt` committed.
- `npm run check` at the repo root — green and byte-identical to `main`'s behavior (the PR adds
  nothing to any toolchain scope).
- The five-deliverable checklist maps to files: (1) `arc/` + `specs/` + `executable/` +
  `spike/emitted/` + transcripts · (2) the three ports, each node-diffed · (3) `table-sugar/` +
  its test · (4) `SCORECARD.md` + `IMPORT-NOTES.md` · (5) `DIAGNOSTICS.txt`. Plus the posture
  extras: `envelope.schema.json` story · the plain-`.sdp.md` paragraph · `PROSE-IN-GRAPH.md`.
- PR body written in the house register: what each exhibit proves, what is deliberately mocked
  (micro-yaml subset; the spike is evidence, never product), and what is named-not-ruled
  (prose-in-graph; the envelope-association gap; the list-form relations note).

## §11 — Deliberately out of scope

- Anything under `src/`, `examples/`, `docs/concept/`, `CONTEXT.md`, root configs,
  `package.json` (zero new dependencies — the frontmatter parser is a hand-rolled subset).
- Ruling anything plan 14 §4 dockets: prose-in-graph, dual-source/kind partition,
  *notation*/*carrier* ratification, the ambiguous single-literal vocabulary form, `sdp import`
  emitter implementation.
- A real `.sdp.md` discovery/extraction path in the product (the spike proves the seam; the
  winner's surface-design session owns productization).
- The other three carrier PRs (C2 full-bar; Gherkin-fork and typed-markup timeboxed CLOSED.md
  sessions — plan 14 §3).
