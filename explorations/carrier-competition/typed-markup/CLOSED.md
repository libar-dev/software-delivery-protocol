# Typed markup as an authoring carrier — closed on evidence

> **Ruling:** the escape test did not overturn settlement 5. Typed markup makes the minimum
> `idea`-rung document pay TypeScript and JSX ceremony, ordinary decision prose needs markup or
> explicit conventions, and its remaining unique authoring benefit is as-you-type envelope
> typing. The graph-derived projection already supplies the interactive review experience.
> Typed markup therefore concedes the carrier competition **as an authoring surface**; its
> projection-layer value remains intact.

## What this record is

The Libar Software Delivery Protocol models software-delivery intent as typed `Spec`s, derives one
graph from the authored model, and generates validation, documentation, and executable contracts
from that graph. Its executable machinery is already carrier-independent. The remaining
competition asks which text format should carry the authored `Spec` envelope, prose, and owned step
notation.

The first two entrants built full evidence exhibits: [F2 Markdown](../f2-markdown/README.md) in
[PR #4](https://github.com/libar-dev/software-delivery-protocol/pull/4) and
[C2 own grammar](../c2-grammar/README.md) in
[PR #5](https://github.com/libar-dev/software-delivery-protocol/pull/5). The third entrant
[closed the Gherkin extension/fork question](../gherkin-fork/CLOSED.md) in
[PR #6](https://github.com/libar-dev/software-delivery-protocol/pull/6). This fourth record
implements [Plan 15d](../../../plans/15d-carrier-typed-markup-closed.md) and asks whether TSX as the
authored document can beat the standing typed-markup evidence.

This directory is evidence, not product. It adds no canonical authoring surface, markup package,
extractor path, generated graph, runtime adapter, dependency, or product code. The TypeScript DSL
remains the sole canonical authoring surface during the competition.

## Settlement 5

The source record already contains both halves of the typed-markup proposition:

- The original [`.sdp.tsx` seed](../../executable-examples/3-typed-markup/create-order-valid-cart.sdp.tsx)
  shows a typed component tree carrying the envelope, sections, prose, and example steps.
- The [interactive Design Review](../../executable-examples/3-typed-markup/render/valid-cart-review.html)
  derives its envelope chips, readiness banner, verifier binding, Given/When/Then rendering,
  expected outcome, coverage verdict, and draft-example affordance from the graph at render time.

That second artifact proved the decoupling: the interactive experience works over a graph produced
from any authoring carrier. Typed markup is not required to obtain it. What TSX uniquely retains at
authoring time is as-you-type typing of component props, while its prose and children structure pay
the costs recorded in [FINDINGS settlement 5](../../executable-examples/FINDINGS.md): JSX is a poor
prose medium, and children typing is too weak to make step text, ordering, and nesting fully typed.
The component library survives as a projection-layer competency rather than an authoring-format
requirement.

## The escape test

> _an authoring exhibit that beats settlement 5 across the maturity arc_ — concretely,
> TSX-as-authoring must show it can (i) make the `idea` rung's ceremony competitive with a five-line
> envelope plus one heading (the minimum-ceremony axis — the highest-volume authoring event), (ii)
> carry `decision`-kind prose without escaping/whitespace/markdown loss (the prose axis), and (iii)
> buy something _at authoring time_ that the graph-derived projection does not already provide (the
> settlement-5 core).

All three clauses must hold. A failure on any clause leaves settlement 5 standing.

## Probe 1 — minimum `idea`-rung ceremony

[`probes/01-idea.create-order.sdp.tsx`](probes/01-idea.create-order.sdp.tsx) carries the smallest
honest behavior used for this comparison: identity, kind, altitude, readiness, one relation, and a
title. The evidence comments and blank lines are excluded from the count. The authored expression
contains **11 nonblank code lines**:

| Lines | Content                                                                                                         |
| ----: | --------------------------------------------------------------------------------------------------------------- |
|     6 | The semantic declarations: `id`, `kind`, `altitude`, `readiness`, `refines`, and `title`.                       |
|     5 | Host-language scaffold: the import, default-export wrapper, component opener, self-close, and expression close. |

The carrier-neutral baseline in the escape test states the same six facts as a five-line envelope
plus one heading. Physical line counts can be gamed by minification, so the decisive observation is
not “11 beats 6” as a score: it is that TSX adds an import, export expression, and component-tree
syntax before an `idea`-rung author can state the same facts. This is the format's largest relative
tax at the highest-volume authoring event. Clause (i) fails.

## Probe 2 — decision prose

[`probes/decision-prose.sdp.tsx`](probes/decision-prose.sdp.tsx) ports the existing order-lifecycle
material. Its Context sentences come from the already-landed
[decision carrier port](../f2-markdown/specs/decisions.order-lifecycle.sdp.md); its decision,
rationale, and consequence sentences remain exact to the canonical
[TypeScript decision Spec](../../../examples/checkout-v1/specs/decisions/order-lifecycle.sdp.ts).
The probe labels that faithful material separately from synthetic syntax stress samples, so no
example sentence is passed off as authored system truth.

The stress samples make three costs visible in source:

| Prose need           | What the probe must write                    | Consequence                                                                                                                                             |
| -------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Literal braces       | `{"{ id, lines, total }"}`                   | A natural brace group enters JSX expression syntax and needs an explicit string expression.                                                             |
| Paragraph separation | Explicit `<p>` elements in the faithful port | A blank source line inside one JSX text node is not an authored paragraph boundary; standard JSX transformation and HTML rendering join or collapse it. |
| Emphasis and links   | `<strong>` and `<a>` elements                | Markdown spellings remain literal text unless another parser or component convention interprets them.                                                   |

This is a boundary claim, not a claim that a static extractor must lose source bytes. A future
extractor using `ts-morph` could read raw JSX trivia and invent whitespace-preservation rules.
Doing so would make the Protocol own a second prose convention; it would not make JSX itself a
first-class prose format. Likewise, an MDX-style parser could recover Markdown, but that is the
separate layered-markdown proposition already represented by F2. Clause (ii) fails.

## Typecheck honesty

The import used by both probes is hypothetical. The package currently exports the root DSL,
`/runner`, and `/vitest`; it has no `/markup` export or component implementation
([`package.json`](../../../package.json)). The original seed says the same thing explicitly.

Consequently these probes do **not** typecheck, and this record claims no green `tsc` result. Making
them typecheck would require designing and building the component library before the carrier can
demonstrate its one unique promise. Spending that effort after the standing evidence has already
reduced the authoring proposition would be exhibit theater, not additional information.

Even if built, native prop typing would provide as-you-type envelope feedback to engineers. It
would not type arbitrary step text or strongly enforce useful child ordering and nesting, and it
would not provide the interactive review features: the graph-derived HTML projection already does
that for every carrier. Clause (iii) fails.

## Concession ruling

The escape test failed on all three clauses. The `idea` form adds host-language scaffold, the prose
form needs markup and JSX-specific escaping, and the interactive value remains carrier-independent.
Typed markup therefore concedes the carrier competition as an authored `Spec` format.

This is a positive evidence result. “Why not author Specs as TSX documents?” now has a falsifiable,
artifact-backed answer rather than a preference. Reopening the carrier requires new evidence
against a named probe: for example, a minimum form that removes the host-language scaffold, a
prose-preserving JSX authoring mechanism that does not add another parser or convention, and an
authoring-time capability that cannot be supplied by the graph-derived projection. All three escape
clauses would still need to hold.

## What survives the concession

The concession is deliberately limited to **authoring**. A typed component library remains valuable
as projection-layer machinery:

- Design Review components can render graph facts and authored content with one honesty boundary.
- Studio can use the same components for interactive exploration and future structured editing.
- The interactive review harness can host controls, expected outcomes, witnesses, and coverage gaps
  without coupling those capabilities to the source format.

That is where settlement 5 locates typed markup: downstream of the one graph, serving every carrier
without creating another authored truth surface.

## Docket for Plan 16

Plan 16 should judge this record on one question: **did settlement 5 survive a current, falsifiable
probe?** It did. This entrant is not to be compared against the five full-exhibit deliverables after
conceding; `CLOSED.md` is Plan 14's recorded alternative deliverable. Read this ruling first, then
the [minimum-ceremony probe](probes/01-idea.create-order.sdp.tsx) and the
[decision-prose probe](probes/decision-prose.sdp.tsx).

The build-state ledger also remains for Plan 16: plans 14 and 15a–15d retain `DRAFTED` status
headers even though the carrier evidence has landed or is represented by this branch. This
exploration PR does not edit plan files because Plan 15d's scope fence permits only
`explorations/carrier-competition/typed-markup/`. The ruling session should stamp the 15-family
done-records or record an explicit follow-up before relying on the highest-numbered status header
for “what now.”
