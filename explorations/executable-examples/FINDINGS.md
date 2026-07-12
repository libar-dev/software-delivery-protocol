# Executable examples — exploration findings (pre-session input)

> **Status: exploration record, nothing ratified.** This document argues narrowings for the
> executable-examples design session (the live plan under `plans/` — it carries the dated
> pointer back here); the session ratifies, refines, or overrules each one. The micros beside
> this file (`README.md` for the tour) are the exhibits the arguments lean on. Terminology
> follows the ratified base; MD-n / JS-x citations resolve in `docs/concept/DECISIONS.md` and
> `jtbd-stories/`.

## 1. What this is

The design-session plan asks for a ruling on how gen 2 recovers gen 1's executable-spec DX
without re-importing its diseases. This exploration re-read the gen-1 evidence at the artifact
level (a real `.feature`/`.steps.ts` pair, the custom step linter, the relevant ADRs, the
`playground/` agent-surface experiment), built micro-implementations of every contender surface
over one real spec, and proved the binding seam's type-safety with captured `tsc` errors. The
product owner set the priority order for scoring: **DX first, gen-1 problems solved second,
adoption strategy third.**

## 2. The gen-1 evidence, reread — two cost families, two different cures

Gen 1 (`@libar-dev/architect`, prior art — evidence about the problem, never the answer)
executed Gherkin `.feature` files via a vitest-cucumber runner with companion `.steps.ts` files
bound by string match at runtime. Its costs split cleanly:

**The seam family** — costs of an untyped binding between spec and test:

- A 20-line feature required a ~100-line steps file that **mirrors the feature's whole
  structure** (Rule → Scenario → step nesting, every step string duplicated verbatim) — a
  shadow copy, the dual-source disease in miniature.
- Binding drift surfaced only at **runtime** (`StepAbleUnknowStepError`), never in the editor.
- World/lifecycle was hand-rolled per file: module-level mutable state plus a manual reset hook.
- A whole **step-stub lifecycle** (gen-1 ADR-008: a stub folder taxonomy, moved at
  implementation, deleted when complete) existed only to bridge the design-time/test-time gap.

**The foreign-grammar family** — costs of executing someone else's grammar:

- The custom static analyzer (`architect-lint-steps`) policed **twelve rules**, and not one
  polices spec *content* — every rule guards a Cucumber parser quirk or a runtime-matcher trap
  (missing `And` destructuring, missing `Rule()` wrapper, `#` terminating the parser, `{phrase}`
  unsupported, regex patterns unsupported, duplicate `And` text…). A linter-shaped confession
  that the grammar was rented, not owned.
- Gen-1 ADR-002's own recorded negative: Scenario Outline syntax more verbose than
  parameterized tests.
- Prose was a second-class citizen: epic-level design context authored in Gherkin docstrings
  was silently truncated by the projection (a recorded gen-1 feedback finding).

**The feature file itself was never the wound** — its register (plain-language Rule/Scenario/
GWT, reviewable by anyone) is the thing worth recovering, and the maturation arc
(idea → … → ready → executable spec) is a core gen-1 idea that survives intact.

**The `playground/` lesson** (gen 1's agent-surface experiment; the measured ~⅕-tokens figure
in the decision diary's evidence table): capable models want **plain files plus typed shapes
they can script** — not a verb wall; "the type is the discovery surface — under-typing a shape
hides a capability." Applied here: the *authoring* surface should optimize for emission
register (text), while the *typed* experiences ride the derived layer.

### The fork question (recorded 2026-07-11 — the gen-1 repo reread at source, `/Users/darkomijic/dev-projects/architect`)

The product owner asked whether **forking the Gherkin grammar/parser and building own test-runner
adapters** deserves detailed exploration as the most gen-1-faithful route. A source-level reread
of gen 1 (the step linter's rule registry, the ADR set, `FEEDBACK.md`, `formal-spec/03–10`, the
parser wrapper) splits the question into three components with very different verdicts:

- **The static parser (`@cucumber/gherkin`) was the *least* painful component of gen 1** — zero
  recorded complaints, a clean wrapper (`gherkin-ast-parser.ts`), and no ADR ever considered
  forking or replacing it. Only **3 of the linter's 13 rules** trace to grammar quirks
  (`#`-comment lexing in descriptions/steps, keyword-terminated descriptions) — and the linter
  sidesteps them by regex-scanning raw text *because the parser rejects the malformed files it
  wants to lint*. Forking the parser fixes the component that wasn't broken, and inherits a
  foreign machine-generated codebase (the `.berp` grammar pipeline, ~70 i18n keyword sets, the
  token-matcher architecture).
- **The runtime matcher (`@amiceli/vitest-cucumber`) was the dominant pain: 10 of 13 linter
  rules** (regex/`{phrase}` unsupported, the ScenarioOutline two-pattern trap, duplicate-`And`
  ambiguity, silent re-registration overwrite, missing-destructuring `StepAbleUnknowStepError`…),
  plus ADR-008's whole stub taxonomy existing to keep stubs runner-shaped. This half of the
  owner's instinct is **already the settled architecture** — the framework-neutral `/runner`
  core + `/vitest` adapter over generated contracts (settlement 6) — and it strictly dominates
  gen 1's shape: binding is compile-time, and where amiceli handed steps untyped
  `Record<string,string>` DataTables papered over with hand-written accessors, typed parameter
  slots (settlement 7) hand the handler a typed point.
- **The tag/metadata encoding was the largest structural cost** — four formal-spec chapters
  (03 tag system, 04 tag registry, 08 spec evolution, 09 delivery lifecycle) plus the
  bold-markdown pseudo-fields (`**Invariant:**`, `**Verified by:**` re-parsed from prose by a
  second bespoke micro-parser) exist *solely* because delivery state could not parse as syntax;
  `FEEDBACK.md` records the silent-failure traps (space-separated `@architect-uses` drops the
  whole node; a missing bare marker ignores the block — "annotation mistakes fail silently to
  zero"). A fork only relieves this if it adds first-class metadata slots — i.e. breaks Gherkin
  compatibility — at which point every benefit of forking (ecosystem tooling, verbatim
  familiarity) is forfeit and the route *is* C2 on a heavier chassis.

**Ruling argued:** the fork decomposes into a compatible variant (= tags-on-Gherkin, gen 1's
own shape, fails the differentiation test by the recorded evidence above) and an incompatible
variant (= C2, better built on an owned minimal line-oriented parser than on a forked `.berp`
pipeline). Neither variant is a new option; the fork question **strengthens the existing
settlements** rather than reopening them. Two salvages worth keeping, both cheap:

1. **`sdp import`** — a one-way, one-time `.feature` → SDP converter built *on the vendored
   `@cucumber/gherkin` as a devtool dependency* (never the canonical parse path): the adoption
   wedge for Cucumber shops, lawful because it is a converter, not a surface. **Proven at the
   mapping level in `6-import/`:** Feature→behavior, Rule→`rule`-kind, Scenario→`example`,
   Scenario Outline placeholders→**the example space** with types inferred from Examples
   columns, rows→bound points, Background hoisted explicitly — plus the import report that
   refuses to guess (tags, readiness above `scoped`, `verifies` edges, names, inferred types
   all flagged for the human). The wedge composes with settlement 7: an imported Outline
   corpus arrives already parameterized.
2. **Cucumber's own `GherkinInMarkdownTokenMatcher`** (gen 1 already used it for `.feature.md`)
   is industrial prior art that *Cucumber itself* accepted markdown as a Gherkin carrier —
   direct evidence for the F2-layered finalist.

And the strongest carrier evidence of the reread: **gen 1's feature files were already
markdown-inside-Gherkin** (`docs/GHERKIN-PATTERNS.md` documents bold pseudo-fields, pipe
tables, and lists as the sanctioned idiom inside description slots — and deliverables
hand-tracked in a fake `Background:` table, authored delivery facts the gen-2 model forbids).
F2-layered inverts the nesting to match where the content actually lived: prose and structure
as the document, GWT as the owned fenced notation.

## 3. Proposed settlements (each for the session to ratify by name)

1. **The framing holds: executability was never the disease.** Every documented gen-1 cost
   traces to the untyped seam or the rented grammar — properties of Gherkin-as-a-second-
   language, not of executable specs. Execution also never touches the graph: binding-never-
   liveness (MD-7) is intact under every option; the whole executable half lives runner-side,
   below the `specTest` anchor.
2. **A2 (generated step contracts) over A1 (direct spec import)** — three arguments, one
   decisive: (a) A1 breaches the no-import-edges criterion (JS-B2.3) and needs a supersession;
   A2 rides the already-designed generated-union pattern (JS-B2.6) — derived, regenerable,
   keyed by spec ID, importable *because* it is a projection. (b) **The one-validation-path
   argument (MD-14): A1 binds the test to the spec module's *evaluated* value; A2 binds it to a
   contract generated from the *extracted graph* — the statically-reified truth.** Under
   graceful partial extraction the two can disagree; only A2 is consistent with "the protocol's
   truth is what source statically states." (c) A1's const-generic machinery (`StepOf<T>` over
   nested readonly arrays) is throwaway under any text surface; A2's generator just emits the
   literal union — no type-system gymnastics. The `4-seam/` exhibit proves the payoff with real
   captured `tsc` errors: a missing handler, a spec-side rename, and a typo each fail
   compile-time, **naming the exact step string** (the typo case even gets `tsc`'s own
   did-you-mean). Gen 1's twelve-rule linter and its runtime binding errors reduce to the type
   checker.
3. **C1 (Gherkin via a vendored Cucumber parser) dies on DX evidence, not only supply-chain
   taste** — it would re-import the exact quirk catalog the gen-1 linter existed to police.
4. **The notation enters as a renderer before it is ever a parser.** The A2 failure messages,
   the one-way projection of example specs, and the Design Review's GWT rendering are **one
   renderer with three consumers** — dogfooded while the notation is still a regenerable output
   format with near-zero versioning pressure. "Owning a language is forever" starts at the
   first *parser*; the delivery order shrinks the window where syntax is expensive to change.
5. **F1 (TSX) as an *authoring* surface is demoted — because the interactive document does not
   require it.** Building the dials render proved the decoupling: everything on that page —
   envelope chips, the derived readiness banner, the GWT, the live coverage verdict — derives
   from the graph, so the interactive review works identically over a spec authored in the
   grammar, markdown, or the TS DSL. The component library is a **projection-layer competency**
   (Design Review, Studio, harness), where it threatens no authoring law. What TSX-as-authoring
   uniquely buys shrinks to envelope typing *as-you-type* instead of *on-save* — for the
   persona (engineers) already best served by tooling. JSX is also a genuinely poor prose
   medium (escaping, whitespace collapsing, no markdown), and TSX children-typing is too weak
   to enforce document structure — "full `tsc` coverage" oversells what it checks.
6. **Mechanism defaults** (rubber-stamp material): per-example contracts (no global step
   registry — gen 1's ambiguity engine); duplicate step text within an example dedupes to one
   handler ("same words, same meaning" — the ubiquitous-language bet at step level); step
   sharing across examples is ordinary TS reuse; the world lifecycle is the adapter's (fresh
   world per example, no reset hooks); package shape is a framework-neutral `/runner` core plus
   a `/vitest` adapter subpath with vitest as the adapter's optional peer. **Typed step
   parameters** (`"a cart with {n:number} line items"` → handler arg `{ n: number }`) are the
   strongest "the language knows things Gherkin doesn't" capability at the *type* level —
   capability worth committing, syntax owned by the grammar session, first slice shippable
   without it.

### Addendum — settlements 7–9 (the `5-harness/` exhibit; grilled with the product owner
### 2026-07-11 — each branch settled by explicit choice; the design session still ratifies by name)

7. **The two-level parameter structure: the parent owns the space, the example binds a point.**
   Typed step parameters (`{n:number}`, closed unions like
   `{availability:"in stock"|"out of stock"}`) live in the *parent behavior spec's* step
   vocabulary — a new authored **example space** section (an MD-10-family content-section
   extension; the sibling set shares one vocabulary, the ubiquitous-language bet at the
   parameter level); an `example`-kind child instantiates the slots of the steps it uses (an
   example is a point — partial points are honest: an empty cart binds only `n=0`).
   **Settled: the concreteness law** — an example with an unbound slot in a step it uses does
   not meet `defined`; one structural clause in the example kind's `defined` evidence cell
   (the existing floor evaluator, MD-12/MD-13), never content-quality. **Settled: binding is
   explicit** (`{n: 2}` in the authored step; sigils are the grammar session's) — natural
   reading is the *renderer's* job everywhere humans review; Gherkin-style text-matching is
   the rented-grammar trap re-imported (the matcher quirk catalog) and is rejected. `sdp
   build` emits, per parent, a **space contract** (typed input dimensions + every child's
   bound point + the generated Outcome union) alongside the per-example step contracts —
   parameter values flow *from the spec into the bound test* (`valid-cart.test.ts`: the
   Then's `total === p.total` asserts the authored value; 4-seam hardcoded the cart math
   handler-side — editing the spec's `100` reddens the bound test with zero test edits).
   Captured `tsc` proofs: renamed slot, out-of-union comparison, bag-shape misuse.
8. **The `expected()` artifact is the ORACLE (the industry's noun, adopted per MD-2 — no
   collision with the `model` kind), oracle-first, implementation-side, anchor-bound, never
   extracted.** The harness's highest-value moment is readiness `defined` — *before* any
   implementation or bound handlers exist — so bound handlers cannot be the primary
   semantics. One oracle per parent behavior spec, beside the tests, bound by a `specOracle`
   anchor sibling of `specTest`; the graph records that an oracle exists (the anchor), never
   what it says; **settled: no new derived fact at MVP** (discovery is an anchor query;
   `has-oracle` waits for the second-caller bar). The oracle is **typed against the generated
   space contract** — vocabulary drift breaks it at `tsc` time (`oracle-drift-demo.ts`,
   captured) — and its **return type is the generated Outcome union derived from the parent's
   Then vocabulary**, so "the oracle may never claim more than the specs state" is a compile
   error, not an honor-system rule; `unspecified` (contributed by the runner core) is the
   honest first-class answer for an unstated region. Outcome *faithfulness* stays
   human-reviewed, by law. **Named ASPIRATIONAL: the bound-handlers overlay** — at
   `implemented`, the harness may run the real step handlers at a dial point beside the
   oracle's answer; disagreement rendered inline is the drift alarm made interactive —
   runner-side, never in the graph (MD-7 intact).
9. **Coverage is equivalence-witnessing, derived — and it ships in slices.** The oracle
   partitions the space into outcome classes; each sibling example's bound point witnesses
   one class; the harness verdict is a computation (dials → outcome class → witness search),
   with `unspecified`/unwitnessed rendered as a **coverage gap carrying a draft-example
   affordance** (one click emits an `idea`-rung example refining the parent, the dial point
   pre-bound — `idea` is exactly right: the point is bound but intent prose is missing, so
   the floor holds it down honestly; the harness becomes a spec-authoring funnel). **Settled
   placement:** the parameter machinery (slot vocabulary, space contract, `StepParams`,
   concreteness clause) and the oracle *law + type surface* (`specOracle` anchor, generated
   Conditions/Outcome) ride plan 13's A2 slice — same codegen stage, and shipping A2 without
   slots would buy a later whole-corpus spec migration, the enrich-don't-migrate smell; the
   interactive harness UI is a **named later slice** with `5-harness/render/` as its rendered
   spec. This is the second capability for the differentiation test — Gherkin has Examples
   *tables*; this has an example *space*.

Names settled here for the language base to ratify: **example space** · **parameter slot**
(short: *slot*) · **bound point** · **oracle** (`specOracle`, `oracle:` ID namespace;
rendered surfaces say "expected outcome") · **witness** · **coverage gap**.

## 4. The contenders — pros and cons over the exhibits

The seam (A2) is identical everywhere, so the surfaces compete on authoring alone. Personas
weighted per the recorded mandate: agents heaviest, then the whole delivery org, engineers last
(they are tooled either way).

| | **C2 — own grammar** (`1-grammar/`) | **F2-layered — markdown carrier** (`2-document/`) | **F1 — TSX document** (`3-typed-markup/`) | **TS DSL** (today, `examples/`) |
|---|---|---|---|---|
| Agent emission register | strong — line-oriented, token-cheap; but novel syntax, zero training distribution, needs the grammar in context | **strongest — markdown is the deepest training-distribution format there is**; frontmatter + fences are muscle memory | weak for prose; JSX noise; styled-text emission less reliable | fine, but imports/brackets/quoting noise |
| Non-engineer authoring/review | strong (the gen-1 register, recovered) | **strong (the format PMs already write daily)** | weak (component tags intimidate) | none |
| Conversation→repo verbatim ("the spec is the prompt") | good, once the syntax is learned | **exact — the proposal in chat *is* the file** | poor | poor |
| Envelope typing | extractor diagnostics only (did-you-mean, honest-readiness) until an LSP | generated **JSON Schema** → stock YAML language server gives autocomplete + squiggles with zero custom LSP work (JS-B2.6's pattern at the authoring seam) | native `tsc`, as-you-type | native `tsc`, as-you-type |
| Step-text / structure typing | none anywhere — the seam contract covers it (by design) | same | same (children-typing too weak to do better) | same |
| Prose | needs designed prose blocks (gen 1 truncated docstrings — cautionary) | **first-class — prose is just the document** | hostile (JSX text) | string fields |
| Kind coverage | prose-natured kinds only → **per-kind partition law required** | **all eight kinds, one family — no partition law** (see the `decision`-kind exhibit) | all eight, at register cost | all eight |
| Ownership cost | **own everything forever**: grammar, parser, formatter, highlighting, GitHub rendering, editor plugins, LSP | own only the GWT-fence grammar + envelope schema; **rent the page** (GitHub renders it today; one parser dep, same class as `ts-morph`) | component library — needed anyway, but at the projection layer | zero new |
| Differentiation sentence | "a grammar for delivery state" — sharpest | "delivery state as a typed document — markdown that compiles to a delivery graph" | "typed spec documents" — weakest | — |
| Standalone (no-toolchain) wedge | **yes — the strongest** | partial (readable everywhere; *validating* needs the CLI) | no | no |
| Diff/merge ergonomics (PR review is the delivery org's daily surface) | strong — line-oriented by design: a step rename or an envelope line is a one-line diff; the raw text *is* the review surface, with no rich rendering behind it | **strong — a step rename is one fence line, an envelope change one YAML line, prose edits diff as prose, and GitHub renders the rich diff** | weak — JSX attribute and wrapping noise swamps the semantic change | moderate — per-field lines diff cleanly, but bracket/quote churn leaks into diffs |
| Agent read-back token cost (agents *load* specs into context constantly, not only emit them — the ~⅕-tokens `playground/` figure cuts both ways) | densest raw text, but the grammar must ride along in context until any training distribution exists — the net cost is the syntax's, not the file's | **light — ceremony is thin (frontmatter + fences), prose carries no markup tax, and reading it needs zero schema context** | heaviest — JSX tags tax every line read back | moderate — import/builder ceremony re-read on every load |

> The two rows above were added 2026-07-12 at the pre-competition review (plan 14 §2), before
> any carrier PR cut. A third added axis — the **minimum-ceremony `idea` spec** ("how little
> ceremony does the minimum honest spec require?" — the draft-example affordance of settlement 9
> makes the two-line `idea` spec the highest-volume authoring event) — is judged from each PR's
> arc `01-idea` snapshot rather than pre-scored here, because the seed exhibits do not all carry
> an `idea` rung. One shared property the diff row deliberately excludes: under every carrier,
> point-per-example (MD-17) keeps sibling examples in separate files, so concurrent example
> edits merge structurally — the row scores the within-file cases.

Bottom line under the stated priority order: **F2-layered and C2 are the genuine finalists**,
and they share the same owned core — the GWT notation and the envelope semantics. F2-layered
minimizes the owned-language surface to exactly the differentiating part and wins the two
heaviest personas on register; C2-pure maximizes identity and the standalone wedge at maximal
permanent cost. They are not mutually exclusive: one notation, designed once, can be carried by
the markdown document now and by a standalone grammar file later if evidence demands (per-ID
canonical-surface config is already designed-in, `04` §1).

### Directions dismissed by name (added 2026-07-12 — the pre-competition review)

The carrier space beyond the four competitors was walked deliberately, so the ruling session
can dismiss each direction **by name, never by omission**. Every one is dominated by a scored
contender or excluded by ratified law — none earns an exhibit:

- **Pure-data carriers** (whole-spec YAML / JSON / TOML / CUE files): making the *entire* spec
  data kills prose — the gen-1 truncated-docstrings lesson — and the envelope already lives
  happily in frontmatter; the direction loses to the markdown carrier on every register row
  above. CUE is the only interesting member (schema+data unification would type the envelope
  natively), but it is a foreign toolchain with near-zero agent training distribution — the
  exact C1 disease.
- **Colocated specs** (doctest-style, the spec beside its implementation): violates the
  intent/implementation split (JS-B1.4) and collapses the anchor design — dead on arrival.
- **Alternative document dialects** (AsciiDoc, org-mode, Djot, Typst): each loses markdown's
  single decisive property — the deepest agent training distribution there is — while adding
  ownership or rendering cost; the F2 argument transfers against them wholesale.
- **Notebook formats** (`.ipynb`, MyST): the JSON carrier is diff-hostile and agent-hostile,
  and the "executable cells" appeal is already answered better by the A2 seam — execution
  lives runner-side, below the anchor, never in the authored file.
- **Projection / structured editing** (the spec stored as graph, edited through views):
  contradicts git-is-the-event-log and text-first authoring; it is the aspirational Studio,
  not a carrier.

## 5. What stays open for the session

- **Envelope representation:** envelope-as-syntax (the `1-grammar/` sketch) vs frontmatter
  (the `2-document/` sketch) — DX vs identity/differentiation weight; the exhibits put both in
  front of the decider.
- **Carrier ruling:** markdown-first with the grammar file as a possible later carrier, vs
  grammar-first — and whether plain `.sdp.md` (commonmark + frontmatter + fences) suffices at
  MVP with MDX islands deferred until interactive harnesses demand them.
- **The prose ruling** (the one genuine law-work item the document route adds): where free
  markdown around the structured parts lives in the graph — a content-only-sections (MD-10)
  extension.
- **Structured-kind conventions** in documents (`model.terms`, `constraint.target`,
  `decision` headings) and the `.sdp.ts`-extension law (MD-15) extending to the new compound
  extensions.
- **The TS DSL's long-term role**: canonical surface for some kinds forever, vs the typed
  substrate documents reify onto (plus protocol self-hosting) — shapes the dual-source
  letter-vs-spirit ruling. The **kind-partitioned dual carrier** is a named affirmative
  candidate here, not a fallback (the winning carrier for the prose-natured kinds, the TS DSL
  canonical for `contract`/`model`, lawful via the per-ID canonical-surface config) — docketed
  as a first-class candidate ruling in plan 14 §4; the competition's structure-heavy exhibits
  generate exactly the evidence it needs.
- The **doc-repair bill** for whichever route wins (the cut table, the aspirational-surfaces
  section, the dual-source sentence, the executable-meta-model gloss (MD-1), the JTBD B-theme)
  — enumerated in the design-session plan.

## 6. How to re-enter the exhibits

Read `README.md` for the tour; run the seam proof from the repo root:

```bash
npx tsc -p explorations/executable-examples/4-seam
```

Open `3-typed-markup/render/valid-cart-review.html` in a browser and set a quantity dial to
zero: the coverage verdict flips to a named gap with a draft-example affordance — the
interactive-harness convergence working as a *projection*, which is the finding that demoted
TSX authoring (settlement 5).
