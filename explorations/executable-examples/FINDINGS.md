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

Bottom line under the stated priority order: **F2-layered and C2 are the genuine finalists**,
and they share the same owned core — the GWT notation and the envelope semantics. F2-layered
minimizes the owned-language surface to exactly the differentiating part and wins the two
heaviest personas on register; C2-pure maximizes identity and the standalone wedge at maximal
permanent cost. They are not mutually exclusive: one notation, designed once, can be carried by
the markdown document now and by a standalone grammar file later if evidence demands (per-ID
canonical-surface config is already designed-in, `04` §1).

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
  letter-vs-spirit ruling.
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
