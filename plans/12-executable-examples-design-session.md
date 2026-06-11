# Plan 12 — Executable examples: the design session (PLAN-ONLY)

> **Status: 🔲 DRAFTED 2026-06-11 — not yet run.** A **PLAN-ONLY** session: it decides and
> records; it edits no target files (a throwaway type-feasibility spike in an isolated scratch
> directory is permitted, discarded before the session closes). The session exists because the
> product owner declared the pain the roadmap says orders the next phase (`07` §5): gen 2 gained
> type safety by rejecting dual-source authoring, but lost the gen-1 DX of **executable specs** —
> the spec itself driving test execution with immediate feedback. **Every route is on the table,
> including the extension, redefinition, or reimplementation of Gherkin** — what is not on the
> table is the trust model (§1) or a cheap-option retreat (§7: the mandate).
>
> **Queue note:** this session was pulled ahead of the decision-spec fold (the pointer plans 10
> and 11 carry); the fold stays pending and is unaffected by anything decided here.
>
> **Addendum recorded 2026-06-11, ahead of the session (sharpened same day):** §7 carries
> pre-session input from the product owner — the ambition mandate (**the Gherkin-like delivery
> language is the destination; cheap options are not on the table; gen 1's effectiveness is the
> capability bar**), the recommended delivery order (A2 → B → C2), the differentiation test for
> the language, and the scope ruling that grammar design earns its own PLAN-ONLY session. The
> session designs the path and resolves the law rulings; it does not relitigate *whether*.
>
> **Second addendum recorded 2026-06-11, ahead of the session:** a pre-session exploration
> built micro-implementations of the contender surfaces over the real
> `spec:orders.create-order.valid-cart` and proved the binding seam compile-time with captured
> `tsc` errors. Its outputs — the exhibits and the argued narrowings (six proposed
> settlements + the pros/cons scorecard) — live in **`explorations/executable-examples/`**
> (`FINDINGS.md` first); §7's closing subsection records what they narrow. The session opens
> onto those settlements as input, ratifying or overruling by name.
>
> **Spec anchors:** `02` §3 (an example becomes executable as a low-altitude `example`-kind spec;
> verifier semantics — direct, per-spec, structural) · `04` §1 (the TS DSL is canonical) · `04`
> §4 (Gherkin and harnesses — named, ASPIRATIONAL) · `00` §5 (the cut table rows for Gherkin and
> harnesses) · `07` §3.3 (the dual-source anti-pattern), §5 (measured pain orders the next
> phase), §6 ① (authoring ergonomics is the headline forward risk; `--watch` is a named lever) ·
> MD-1 ("executable specs alone (BDD) is unremarkable") · MD-15 (`.sdp.ts` is deliberately not a
> test-runner glob) · JS-B1.4 (an anchor never carries verification) · JS-B2.3 (no import edges
> between specs and code) · JS-B2.6 (a generated ids union for early `tsc` checks is designed-in)
> · JS-D2 (a passing `sdp validate` is a credible statement).

## §0 — The job and the gap

The MVP's spec↔test story is **pairing, not execution**: a structured GWT `example`-kind spec is
the authored half, a hand-written runner test is the executable half, the `specTest` anchor binds
them, and the graph records that an enabled verifier *exists* (`has-verifier`), never that it ran
(MD-7). What is missing is the gen-1 DX where the spec *drives* the test: edit the spec, watch the
bound test go red, read failures in the spec's own language.

**Gen-1 evidence** (prior art `@libar-dev/architect` — evidence about the problem, never the
answer): Gherkin `.feature` files executed through `@amiceli/vitest-cucumber`
(`loadFeature` + `describeFeature`); step handlers in companion `.steps.ts` files bound by string
match at runtime. The DX wins were real — failure messages named Rule/Scenario/step, watch mode
re-ran on edit, Examples tables killed parameterization boilerplate, features doubled as living
docs. The documented costs were equally real (`FEEDBACK.md`, `VALIDATION.md`, ADR-002/ADR-008):
binding drift surfaced only at **runtime** (TypeScript cannot see a Gherkin↔handler binding); a
whole custom static analyzer (`architect-lint-steps`) existed to approximate what a type checker
gives for free; and the canonical dual-source rot (guard code vs formal spec vs skills docs) had
to be repaired by hand.

**The candidate framing the session must ratify or refute first:** *executability was never the
disease — the disease was a binding invisible to the type system, which is a property of
Gherkin-as-a-second-language, not of executable specs.* If that framing holds, the cut-list
rationale stays true and the DX is recoverable; if it does not, the options below change weight.

## §1 — Fixed points (not on the table)

Whatever surface wins, these do not move; an option that requires bending one is dead on that
clause:

1. **One graph, one Primitive.** Every authoring surface reifies to the *same* `Spec` node shape
   and the same schema — familiar nouns stay named coordinates on the one primitive. A new
   surface is a new front door, never a new room.
2. **Static reification (P5).** Extraction never executes authored sources. A surface whose
   content cannot be read statically does not extract.
3. **Binding, never liveness (MD-7).** The graph records bindings; pass/fail/skip/quarantine
   stay CI's. No option ingests run results.
4. **Delivery facts derived, never authored; the claim taxonomy never collapsed.**
5. **Checks police conformance and honesty, never content-quality.** No validator may judge
   whether a test body faithfully implements its GWT.
6. **Determinism (P3).** Any generated artifact is a pure function of the repo, regenerable,
   never authoritative.
7. **No round-trip, ever.** Generation is one-way in every option — either authored-spec →
   derived projection, or authored-surface → derived contract. Two-way sync is the recorded
   anti-pattern regardless of surface.
8. **Intent and implementation stay split.** A spec never carries executable closures
   (JS-B1.4's boundary, R1, MD-10): step *bindings* are implementation and live with tests.

## §2 — The law collisions the session must resolve by name

These are honest conflicts between recovery options and ratified text — each needs an explicit
keep / refine / supersede decision, with the paper trail the discipline demands:

- **JS-B2.3 — "linked by IDs in strings, never by TypeScript import edges; neither side imports
  the other."** A test that imports the spec value to gain literal-typed step keys breaches this
  criterion directly. Either the criterion is refined (e.g. production code never imports specs;
  a *test* consuming the spec value is a named exception) — a real supersession to record — or
  the option space must route around imports entirely. Note the base already names the lawful
  route: **JS-B2.6's generated-union pattern** (derived contracts you *may* import, because they
  are projections keyed by stable ID, not the authored source).
- **The dual-source rejection (`07` §3.3 · `00` §5 · `04` §4).** Its exact recorded sentence is
  "a single canonical authoring surface **per spec**." A surface *partition* — e.g. Gherkin as
  the sole home of `example`-kind specs, TS for everything else — satisfies the letter (each
  spec has exactly one home). The session must decide whether it satisfies the spirit, and what
  doc repair each choice requires.
- **MD-1's gloss** ("executable specs alone (BDD) is unremarkable") reads, without context, as a
  rejection of executable specs. If §0's framing is ratified, the gloss earns a refinement: the
  meta-model stays the headline *and* the executable half is a recovered surface, not a pivot.
- **MD-15.** `.sdp.ts` stays out of runner globs in every option; nothing here may make spec
  files themselves execute under the test runner.

## §3 — The option space

All options assume the anchor layer is untouched: the `specTest` anchor remains the only thing
the graph reads; everything below is DX in the runner, invisible to extraction.

| # | Option | Mechanism | Drift detection | Laws touched |
|---|---|---|---|---|
| **A1** | **Direct import, const-generic DSL** | The test imports the spec value; `spec<const T extends Spec>(d: T): T` preserves literal GWT strings; `executeExample(spec, bindings)` types bindings as `Record<StepOf<T>, StepFn>`; the adapter emits `describe`/`it` from spec text | **Compile-time** (missing handler and renamed step are `tsc` errors) | **JS-B2.3** (import edge spec→test) — needs refinement/supersession |
| **A2** | **Generated step contracts** (the JS-B2.6 pattern, extended) | `sdp build` additionally emits a derived, regenerable step-contract module per example spec (keyed by spec ID); the test imports the *generated* contract, never the spec; same `executeExample` typing | **Compile-time**, one build-step behind authoring (stale contract = stale types; `--check-clean` already pins generated-artifact freshness) | none — the pattern is already designed-in for ID unions; adds a codegen stage to `build` |
| **B** | **Gherkin as one-way projection** | `.feature` files *generated from* example specs (readability/BI surface; possibly fed to external BDD tooling read-only); execution still via A1/A2 or hand-written tests | inherits A1/A2 | none (a projection like the Design Review); does not by itself recover the DX |
| **C1** | **Gherkin as the sole authoring home of `example`-kind specs** | The extractor gains a Gherkin parser; `.feature` (or `.sdp.feature`) files reify to the same `example` Primitive (id/readiness/relations via a typed header or annotations); step contracts generated as in A2; TS DSL remains canonical for the other seven kinds | Compile-time via generated contracts (gen 1's linter becomes `tsc`) | the dual-source letter survives (one home per spec); the spirit and the cut-list rationale need an explicit ruling; second parser + grammar discipline is the recorded cost |
| **C2** | **SDP-flavored Gherkin (redefinition/reimplementation)** | An own, minimal, statically-parsed grammar — Gherkin's readable skeleton with the Protocol's envelope as first-class syntax (id · kind · altitude · readiness · relations), designed for the graph rather than annotated onto it; reifies to the same Primitive; contracts generated as in A2 | Compile-time via generated contracts | same rulings as C1, plus owning a grammar + parser forever (supply-chain note: in-house parser vs a Gherkin dependency); the strongest non-engineer surface, the largest standing cost |
| **D** | **Specs carry step closures** | `example` specs embed executable step functions | n/a | dead on §1.2/§1.8 (non-static content; intent/implementation fusion) — recorded here so it is rejected by name, not forgotten |
| **F1** | **Typed-markup documents — `.sdp.tsx`** | Specs authored as TSX documents: typed spec components carry the envelope and the structured sections (`tsc` checks them natively — **no typing-law gap window**, C2's heaviest cost); prose flows as markup around the typed islands; the document renders to HTML as a projection with derived data injected from the graph at render time, never authored (the `.stories.tsx` pattern MD-15 already cites) | **Compile-time**, everywhere the typing law reaches today | no new parser (ts-morph speaks TSX); new rulings needed: where free prose lives in the graph (MD-10 extension), and the authored-vs-derived render discipline; MD-15 extends to the new extension |
| **F2** | **Typed-markup documents — `.sdp.mdx`** | Markdown body — the most LLM-native register there is — with typed component islands for the envelope and structured sections | Compile-time on the islands; the body is prose by design | second parser (MDX/remark) — the same standing-cost class as C1/C2, plus a real supply-chain expansion against the one-dependency posture |
| **E** | **Status quo (the null option)** | Agent generates plain tests from GWT; pairing policed by the existing checks | review-time only | none — the baseline DX gains are measured against; under the mandate (§7) never a terminal state |

Shared notes:

- **A2 and C1/C2 converge on the same codegen mechanism** — the surface choice and the
  type-safety mechanism are separable decisions. The generated contract is derived-never-authored
  (§1.6) and keyed by spec ID (JS-B2's refactor-freedom essence holds: moving files breaks
  nothing).
- **The runner half is the same everywhere:** a thin, framework-neutral core
  (`executeExample` produces a plan) plus a vitest adapter under a subpath export, keeping the
  package's single-runtime-dependency posture; vitest enters as an optional peer of the adapter
  only.
- **Prose-only examples refuse to execute** in every option — only structured GWT (the
  `defined`-rung form) is bindable; refusing is the honest behavior, not a degraded run.
- **The friction is the contract:** under compile-time binding, editing a GWT string breaks the
  bound test at `tsc` time. That is the drift alarm surfacing at the cheapest moment; binding by
  index instead would be the silent failure the model forbids elsewhere.
- **The options compose into a path, not only a fork** — §7 records a sequenced candidate
  (A2 → B → C2) the session must score beside the single options.

## §4 — Evaluation scorecard

Score each surviving option against, in order of severity:

1. §1 fixed points (pass/fail — a fail ends the option);
2. compile-time drift detection (the gen-1 lesson — runtime-only binding is what made gen 1
   build a linter);
3. per-spec single source honored in spirit, with the doc-repair bill named;
4. failure messages and watch loop in spec language (`07` §6 ①'s ergonomics bar; the `--watch`
   lever);
5. agent ergonomics — the spec stays the prompt; generation stays one-shot compilation of
   intent, not runtime interpretation;
6. non-engineer readability (the only axis where C1/C2 beat A1/A2 — weigh it against actual
   consumers: the Design Review already renders GWT for humans);
7. standing costs: second parser/grammar ownership, codegen stage in `build`, dependency
   posture, the second-caller bar for every new public surface;
8. migration story for the worked example and the acceptance criteria of record.

## §5 — Decisions this session must produce

Each with its recorded home (DECISIONS.md only where the three-part test admits it; otherwise
the plan's own pin):

1. **Ratify or refute the §0 framing** (executability vs dual-source as the disease). Likely a
   DECISIONS entry refining MD-1's gloss — surprising without context, hard to reverse once
   surfaces ship against it.
2. **Ratify the path to the language destination (§7):** the sequenced A2 → B → C2, a direct
   C1/C2-first route, a typed-markup route (F1/F2), or the layered convergence (§7: the GWT
   grammar carried inside typed-markup documents) — which surfaces ship, in which order (D dies
   in §3; E is a baseline measure, never a terminal state; elimination on cost grounds is
   outside the mandate).
3. **Rule on JS-B2.3** (keep · refine with a named test-side exception · supersede), and on the
   dual-source letter-vs-spirit question if any C option wins. Both are story/criterion edits —
   the JTBD base is the functional spec, so this is a recorded change, not drift.
4. **The typing mechanism:** const-generic DSL (A1) vs generated contracts (A2/C) — including
   `StepOf<T>` feasibility, duplicate-step semantics within one example, and the
   world/lifecycle contract of `executeExample` (per-example isolation, async steps).
5. **Package shape:** subpath export name, the framework-neutral core / vitest-adapter split,
   peer-dependency policy.
6. **Names to ratify, not coin silently** — candidates the session must take to the language
   base: *the executable half* · *step binding* · *step contract* · *execution adapter*.
7. **The doc-repair bill** for whichever option wins (`00` §5 cut table · `04` §4 · `07` §3.3 ·
   MD-1 gloss · JTBD B-theme), and **CORE/ASPIRATIONAL placement** — plus the scope of the
   execution session (plan 13) with the worked example as tracer bullet: at least one
   checkout-v1 example executing through the new surface before the session counts as done.

## §6 — Session shape

1. Walk §0–§2 to a ruling on the framing and the law collisions (the decisions everything else
   hangs on).
2. Score §3 options on §4; eliminate to one (or one + projection B).
3. Optional de-risk spike, isolated and discarded: prove `StepOf<T>` exhaustiveness over nested
   readonly GWT arrays (A1) and/or a generated-contract sample for one checkout-v1 example (A2)
   typecheck as claimed.
4. Draft the DECISIONS entries and language-base candidates; write plan 13 (execution) with its
   done-record criteria.

**Exit criteria:** the ratified path to the language destination, with its law rulings
recorded; the naming candidates flagged in the language base's terms; plan 13 scoped against
the worked example; the cut-table / JTBD repair list enumerated; the grammar-design session
scheduled as its own PLAN-ONLY plan (§7). Until those exist, nothing under `src/` or
`examples/` changes.

## §7 — Pre-session input (recorded ahead of the session; the session may overrule)

### The ambition mandate

The product owner's directive, recorded as session posture — sharpened twice and binding as
input: *think ambitious — the goal is solving the software-delivery problem in the age of AI
engineering, a real challenge worth solving* — and, after a year of building gen 1 and
(possibly) redoing it here: **cheap options are not the ambition and not on the table.**

Two consequences the session inherits rather than debates:

- **Gen 1's effectiveness is evidence, not only its pain.** `@libar-dev/architect` is *very
  complex and effective* — its capability is the bar gen 2 must meet or exceed. The redo exists
  to fix specific foundations (dual-source rot, a binding invisible to the type system, no one
  graph), **never to retreat from capability**. Complexity in service of effectiveness is
  accepted and expected; what gen 2 refuses is unsound foundations under that complexity.
- **The destination is mandate, not an option under elimination.** The Gherkin-like delivery
  language (the C-direction) is the differentiating ambition. The session designs the **path**
  to it and resolves the **law rulings** (§2) — it does not decide *whether*. Cost is never a
  go/no-go criterion anywhere in §4: costs are named, sized, and staffed. The only thing that
  may stop the destination is a genuine §1 fixed-point conflict — and that is surfaced back to
  the product owner, never quietly downgraded into a cheaper option.

### The differentiation case for a Gherkin-like language (C-direction)

The test any Gherkin-like proposal must pass: **does the language know things Gherkin doesn't?**
Tags-on-Gherkin (gen 1's `@architect-pattern:` / `@architect-maturity:` annotations, with a
custom linter policing what the grammar couldn't express) fails it. Envelope-as-syntax passes
it: when identity, kind, altitude, readiness, and relations *parse* rather than annotate, the
readiness floor, referential integrity, and the did-you-mean diagnostics apply to a file a
non-engineer can author and review in a PR diff. Gherkin gave the industry a shared grammar for
*behavior* and stopped there; nobody has a grammar for **delivery state**. That — not prose —
is the unlock.

Illustrative sketch only (the grammar is the grammar session's to design; nothing here is
ratified):

```
spec orders.create-order.valid-cart
  example · story · ready
  refines  orders.create-order
  verifies orders.create-order

Valid cart creates an order

  Given a customer has a cart with one or more line items
    And every cart item is in stock
  When the customer submits the cart for order creation
  Then an order is created
    And the order total equals the cart-math sum
```

Three arguments, in the order they should weigh:

1. **AI-native authoring — the heaviest.** A line-oriented grammar is token-cheap and
   low-syntax-noise — the register agents emit most reliably, against the TS DSL's imports,
   builders, and brackets. It closes a loop the TS DSL cannot: an agent proposes a spec as
   plain text in conversation, the human reads it natively, and the same text lands in the
   repo verbatim — *the spec is the prompt* becomes literally true, with no transcription step.
   This compounds the founding bets rather than adding to them.
2. **The whole delivery org can author.** Today the Design Review is the read surface and
   authoring is TS-only. A ratified text grammar makes the authored model writable by PMs and
   domain experts — the adopt-the-nouns rubric (MD-2) applied at the syntax level (Given/When/
   Then are the industry's nouns for examples), and the surface the commercial Studio renders
   and edits.
3. **The adoption wedge.** File formats are adopted faster than platforms (Markdown, YAML
   pipelines, `.feature` itself). An OSS grammar useful standalone under `@libar-dev/` is the
   cheapest front door to the graph and the honesty model; Studio sits above it under
   `@libar-ai/`. The language is not the product — it is the product's handshake.

### The costs the session must stress-test (not avoid)

- **Owning a language is forever:** grammar versioning, an in-house parser (a Cucumber
  dependency would re-import the semantics mismatch gen 1 paid for, and break the dependency
  posture), a canonical formatter from day one, error messages under the one-line law, an LSP
  eventually. Small grammar, permanent commitment.
- **The typing-law gap window:** MD-11's closed shapes, autocomplete, and in-editor rejection
  have no native text-grammar equivalent. Compensations: the extractor's diagnostics, generated
  step contracts at the binding seam, the formatter, later an LSP — but `07` §6 ① names
  authoring ergonomics as the headline forward risk, and the window where Gherkin-SDP is less
  guarded than TS is real and must be sized, not waved at.
- **The partition must be law, or dual-source returns:** the grammar earns its keep where prose
  *is* the content (`example`, plausibly `rule` — Gherkin has `Rule:` natively) and loses where
  structure dominates (`model` term maps, `constraint` targets, `decision` records). Per-kind
  single home, enforced by a conformance check; checkout-v1's examples are the migration tracer
  bullet.
- **The positioning sentence:** a Gherkin-like surface invites the "yet another BDD tool"
  mis-read MD-1 fought. The ruling to ratify: *the language is the front door; the graph and
  the honesty model are the building.* Marketing says that sentence forever, so it gets
  recorded, not implied.

### The recommended path: A2 → B → C2 (delivery order toward the mandate, never a hedge)

Under the mandate, the path is **not** a probe-then-decide hedge — the destination is set. The
sequence is the repo's own tracer-bullet discipline applied to a language: thin vertical slices,
each end-to-end, each feeding the next slice's design. The binding machinery is
surface-independent — generated step contracts, the framework-neutral runner core, the vitest
adapter, and the world lifecycle are identical under every route, and lawful today (JS-B2.6's
pattern). So:

1. **A2 now** — the executable-example DX on the TS surface: contracts generated by `sdp build`,
   compile-time step drift, failure messages in spec language. Every line of it is C2
   infrastructure.
2. **B next** — the Gherkin-like text emitted as a one-way projection of example specs. Its job
   under the mandate is to **inform the grammar's design** with real specs in front of real
   reviewers — surface decisions made on evidence, never on taste — not to decide whether the
   grammar happens.
3. **C2 then** — the grammar becomes an authored surface; with the runner, the contracts, and
   the dogfooding evidence already standing, the slice reduces to the parser, the formatter,
   and the partition law.

Two strategic corollaries the session should test: **A2 beats A1 on strategy, not only on law**
(A1's const-generic DSL work is throwaway under the text surface the mandate points at; A2's
contracts are exactly the mechanism C2 needs), and **a grammar is the hardest artifact to
change after contact with users** — sequencing it last means every upstream decision is settled
and dogfooded before syntax freezes anything. A direct C1/C2-first route stays scoreable beside
the path — the mandate fixes the destination, not the order.

### The typed-markup family (F) and the convergence question

Recorded after the mandate, same day: the destination — a delivery language the whole org and
its agents author natively — may be reachable by **three routes**, and the session scores them
as routes to the *same* destination, never as a retreat from it:

- **C2** — the from-scratch grammar: strongest non-engineer surface; pays the typing-law gap
  window and permanent grammar ownership.
- **F (typed markup)** — `.sdp.tsx` (no new parser — ts-morph speaks TSX; **no typing-law gap
  window at all**, which is C2's heaviest cost) or `.sdp.mdx` (markdown body — the most
  LLM-native register — at the cost of a second parser). The `.stories.tsx` pattern MD-15
  already cites is the industrial precedent. F additionally converges three aspirational pieces
  onto one substrate: the interactive harness (`04` §4) becomes embedded islands in the same
  documents, Studio gets the surface it must render and edit anyway, and the authored document
  and the Design Review can share rendering machinery — under one non-negotiable discipline:
  **derived data (banners, facts) is injected from the graph at render time, never authored in
  the markup** (authoring-shape honesty extended to markup).
- **The layered convergence** — possibly the most ambitious shape of all: the Gherkin-like GWT
  notation as the *example-section grammar carried inside* typed-markup documents. The readable
  grammar exactly where prose is the content; full `tsc` typing exactly where structure is; one
  document per spec, one home per kind.

New rulings the F routes add to the session's docket: where free prose around the typed islands
lives in the graph (an MD-10 extension — authored truth, section content, or documentation
flavor outside the graph); the render discipline above; the component library as a standing
competency (shared with Studio, so possibly a cost already on the books). JS-B2.3 is untouched
(no spec↔code imports), MD-15 extends to the new compound extensions, and the executable-half
machinery (§3) is fully orthogonal — contracts and runner are identical under every route.

### The exploration record (recorded 2026-06-11; exhibits committed)

`explorations/executable-examples/` holds the pre-session micro-implementations and
`FINDINGS.md`, whose six proposed settlements the session ratifies or overrules by name:
the §0 framing holds (gen 1's costs split into a **seam family** cured by generated contracts
and a **foreign-grammar family** cured by owning the notation — the twelve-rule step-linter
catalog is the evidence); **A2 over A1**, adding the one-validation-path argument (MD-14: A1
binds tests to the *evaluated* spec value, A2 to the *reified graph truth*) — proven with
captured `tsc` errors that name the drifted step strings; **C1 dies on DX evidence** (it
re-imports the policed quirk catalog); the notation ships as a **renderer before it is a
parser** (one renderer: failure messages, the B projection, the Design Review); **F1/TSX
demotes from authoring route to projection-layer competency** (the interactive dials render
derives entirely from the graph, so it serves every authoring surface — the harness
convergence without an authoring-law cost); and the mechanism defaults (per-example contracts,
dedupe-by-text, adapter-owned world lifecycle, `/runner` + `/vitest` subpaths, typed step
parameters as committed capability with grammar-session syntax). The surviving fork the
session must rule on narrows to **F2-layered (markdown carrier) vs C2-pure (own grammar)** —
same owned notation, different carrier — plus the envelope representation
(syntax vs frontmatter) and the prose-in-graph ruling (an MD-10 extension).

### Scope ruling

Plan 12 rules on **the path and the law rulings** — never on syntax, and never on *whether*.
Surface design is its own PLAN-ONLY session with its own plan, scheduled at this session's
close — for whichever route wins: grammar design (envelope syntax, `And`/`But`, Examples
tables, escaping, formatter rules, grammar versioning) under C2, document design (the spec
components, the prose ruling, the render discipline) under F, or both under the layered
convergence — plus the per-kind partition law in every case. Each has enough surface area to
deserve the grilling there, not here.
