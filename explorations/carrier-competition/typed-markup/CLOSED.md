# Typed markup as an authoring carrier — closed on evidence

> **Ruling:** the escape test did not overturn settlement 5. Typed markup makes the minimum
> `idea`-rung document pay TypeScript and JSX ceremony, ordinary decision prose needs markup or
> explicit conventions, and its remaining unique authoring benefit is as-you-type envelope
> typing. Interactive review belongs downstream of the graph and does not require TSX authoring.
> Typed markup therefore concedes the carrier competition **as an authoring surface**; its
> projection-layer value remains intact.

## What this record is

The Libar Software Delivery Protocol models software-delivery intent as typed `Spec`s, derives one
graph from the authored model, and generates every consumer artifact from that graph. Its
executable machinery is already carrier-independent. The remaining competition asks which text
format should carry the authored `Spec` envelope, prose, and owned step notation.

The first two entrants built full evidence exhibits: [F2 Markdown](../f2-markdown/README.md) in
[PR #4](https://github.com/libar-dev/software-delivery-protocol/pull/4) and
[C2 own grammar](../c2-grammar/README.md) in
[PR #5](https://github.com/libar-dev/software-delivery-protocol/pull/5). The third entrant
[closed the Gherkin extension/fork question](../gherkin-fork/CLOSED.md) in
[PR #6](https://github.com/libar-dev/software-delivery-protocol/pull/6). This fourth record
implements [Plan 15d](../../../plans/15d-carrier-typed-markup-closed.md) and asks whether TSX as the
authored document can beat the standing typed-markup evidence.

This directory is evidence, not product. It adds no canonical authoring surface, markup package,
extractor path, derived graph, runtime adapter, dependency, or product code. The TypeScript DSL
remains the sole canonical authoring surface during the competition.

## Settlement 5

The original [`.sdp.tsx` seed](../../executable-examples/3-typed-markup/create-order-valid-cart.sdp.tsx)
shows a typed component tree carrying the envelope, sections, prose, and example steps; the
[interactive review mock](../../executable-examples/3-typed-markup/render/valid-cart-review.html)
labels itself `MOCK` and hard-codes representative values while illustrating the intended
downstream surface; and the shipped [Design Review projection](../../../src/projections/design-review.ts)
with its [determinism tests](../../../test/design-review.test.ts) supplies the mechanical half by
regenerating the current Markdown view purely from the one graph. Together they make the boundary
explicit without pretending the mock proves a live integration: any authoring carrier can feed the
same projection layer. [FINDINGS settlement 5](../../executable-examples/FINDINGS.md) therefore
records that TSX uniquely retains as-you-type component-prop typing, while JSX remains a poor prose
medium and children typing is too weak to make step text, ordering, and nesting fully typed; the
component library survives as a projection-layer competency, not an authoring-format requirement.

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
plus one heading. The committed
[F2 `idea` snapshot](../f2-markdown/arc/01-idea/create-order.sdp.md) states the identical six facts in
**9 physical lines**, including frontmatter delimiters and the nested relation, versus this probe's 11. Physical line counts can be gamed by minification, so the decisive observation is not “11 beats
6” as a score: it is that TSX adds an import, export expression, and component-tree syntax before an
`idea`-rung author can state the same facts. The real comparison still points the same way: 11 TSX
lines versus 9 F2 lines, with the escape test's six authoring statements as the idealized baseline.
The real `Spec` ID at `idea` is a staged, noncanonical maturity snapshot matching the F2 arc; this
exploration tree is not extracted, so it creates no duplicate authored instance. Clause (i) fails.

## Probe 2 — decision prose

[`probes/decision-prose.sdp.tsx`](probes/decision-prose.sdp.tsx) ports the existing order-lifecycle
material. Plan 15d named Context paragraphs in the canonical
[TypeScript decision Spec](../../../examples/checkout-v1/specs/decisions/order-lifecycle.sdp.ts), but
that source has no Context field; the probe therefore uses the one Context paragraph introduced by
the already-landed [F2 carrier port](../f2-markdown/specs/decisions.order-lifecycle.sdp.md) and marks
that substitution in source. The canonical `intent`, `decision`, `rationale`, and `consequences`
fields all remain present and structurally distinct, with their strings exact to the TypeScript
Spec. Synthetic syntax stress samples stay separately labeled, so no example sentence is passed off
as authored system truth.

The stress samples make three costs visible in source:

| Prose need           | What the probe must write                    | Consequence                                                                                                                                             |
| -------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Literal braces       | `{"{ id, lines, total }"}`                   | A natural brace group enters JSX expression syntax and needs JSX-specific escaping; the probe uses an explicit string expression.                       |
| Paragraph separation | Explicit `<p>` elements in the faithful port | A blank source line inside one JSX text node is not an authored paragraph boundary; standard JSX transformation and HTML rendering join or collapse it. |
| Emphasis and links   | `<strong>` and `<a>` elements                | Markdown spellings remain literal text unless another parser or component convention interprets them.                                                   |

[`probes/TRANSFORM-RUN.txt`](probes/TRANSFORM-RUN.txt) commits the syntax-only TypeScript transform
that backs those mechanical claims: zero syntax diagnostics, one joined whitespace child string,
an explicit brace string expression, and literal Markdown text in the emitted JavaScript. It does
not resolve the hypothetical import or claim a typecheck.

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
demonstrate its one unique promise. Spending that effort after clauses (i) and (ii) have already
failed would be exhibit theater, not additional information.

Native prop typing is nevertheless a credible authoring-time capability that a graph-derived
projection or on-save extractor check does not provide. The seed does not demonstrate it
mechanically because the component library is hypothetical, but the fair score is that clause
(iii) **passes in principle**. Its reach remains narrow: it would not type arbitrary step text or
strongly enforce useful child ordering and nesting, and interactive review still belongs at the
carrier-independent projection layer.

This score deliberately corrects Plan 15d's gloss that settlement 5 made clause (iii) “empty.” The
underlying [FINDINGS settlement](../../executable-examples/FINDINGS.md) says the opposite more
precisely: TSX uniquely buys envelope typing as-you-type rather than on-save. The evidence takes
precedence over the plan's summary, so the departure is explicit rather than silently folded into
the ruling.

## Concession ruling

The escape test requires all three clauses to hold. Clause (iii) passes in principle, but the
`idea` form adds host-language scaffold and the prose form needs markup and JSX-specific escaping,
so clauses (i) and (ii) fail. Typed markup therefore concedes the carrier competition as an authored
`Spec` format.

This is a positive evidence result. “Why not author Specs as TSX documents?” now has a falsifiable,
artifact-backed answer rather than a preference. Reopening the carrier requires new evidence
against a named failed probe: a minimum form that removes the host-language scaffold and a
prose-preserving JSX authoring mechanism that does not add another parser or convention, while
retaining the as-you-type advantage already credited under clause (iii). All three escape clauses
would still need to hold.

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
[decision-prose probe](probes/decision-prose.sdp.tsx), followed by the committed
[transform transcript](probes/TRANSFORM-RUN.txt).

The build-state ledger also remains for Plan 16: plans 14 and 15a–15d retain `DRAFTED` status
headers even though the carrier evidence has landed or is represented by this branch. This
exploration PR does not edit plan files because Plan 15d's scope fence permits only
`explorations/carrier-competition/typed-markup/`. The ruling session should stamp the 15-family
done-records or record an explicit follow-up before relying on the highest-numbered status header
for “what now.”
