# 7-typelevel-slots — the slot notation parsed by the compiler, as-you-type

> **Exploration record — illustrative, nothing ratified.** A half-day spike added 2026-07-12 at
> the pre-competition review (plan 14). It is **orthogonal to the carrier competition**: the TS
> DSL stays the sole canonical authoring surface throughout the competition regardless of which
> carrier wins, and this spike is about *that* surface's authoring DX.

## What it shows

TypeScript template-literal types can parse the ratified slot micro-notation **at the type
level**: a vocabulary step `"a cart with {n:number} line items"` yields `{ n: number }`
as-you-type, and a bound step `"a cart with {n: 2} line items"` yields the literal point
`{ n: 2 }`. A mini `declareExampleSpace` / `bindPoint` surface (mirroring the DSL's
`behavior.exampleSpace` / `behavior.examples` shape — copied, never imported from `src/`) then
checks every authored example step against the parent's declared example space **in the editor,
with zero codegen and zero new authoring surface**:

- an **unknown slot name** (`{m: 2}`) reddens the step,
- a **wrong value type** (`{n: "2"}`) and an **out-of-union literal**
  (`{availability: "in stok"}`) redden the step,
- a **parent-side slot rename** reddens the child's untouched binding — spec-edit drift caught
  before any build runs.

Every error quotes the exact authored step string. `TSC-OUTPUT.txt` is the captured transcript.

Equally important is what the surface **refuses to police**: an **unbound slot** (`{n}`)
**compiles** (`partialPointStillAuthorable` in the demo). A partial point is legal authoring —
the concreteness law holds it below `defined`, and that is the readiness floor's honesty check,
never an authoring gate: checks police honesty, never workflow.

## The promotion caveat (the tension this exhibit names, not hides)

The four reddening cases are states the shipped codegen answers loudly without ever gating
(gating stays `validateGraph`'s alone), and its posture splits by whether the *step* resolves,
not by which slot is wrong: a step skeleton the parent space never declares — or no longer
declares, the rename — **withholds that child's step contract**
(`contracts/unmatched-vocabulary-step`) while the parent's space contract still emits with the
foreign binding dropped from the point (`contracts/undeclared-slot`); an off-dimension *value*
on a resolving step withholds nothing — the space contract **drops the binding from the point**
and the step contract **widens that param to its scalar kind**
(`contracts/off-dimension-value`), the generated artifacts always compiling. Every one is
**legal transitional authoring**: a child authored before its parent declares the space, a slot
rename mid-flight across files. As-you-type visibility of that drift is the DX win — but
authored spec files typecheck in CI, so promoting these checks as hard types would convert the
codegen's deliberate warn-and-continue postures into gates on states the protocol keeps
authorable. A promotion
therefore needs an **advisory form** (editor-only feedback, or an opt-in assertion an author
adds when a spec claims `defined`+) rather than mandatory types on the authoring surface — which
form, if any, belongs to the winner's surface-design session (plan 14 §4).

## Why it matters for the ruling

If the ruling lands the kind-partitioned dual carrier (the named candidate in plan 14 §4 —
a document carrier for the prose-natured kinds, the TS DSL canonical for `contract`/`model`),
engineers keep living in the TS DSL for the structure-heavy kinds — and this is DX that surface
can gain with zero codegen, in whatever advisory form the promotion caveat above allows. It is
equally compatible with every other outcome: the TS DSL as typed substrate keeps the same win.

## The law boundary

The one-validation-path law (MD-14) is untouched. This is **editor-time feedback only**: the
graph's truth stays what the extractor statically reifies, and the generated step/space
contracts stay the binding seam of record. The MD-14 objection to A1 (evaluated vs
statically-reified truth) does not apply — nothing here is evaluated into the graph.

## Run it

```bash
npx tsc -p explorations/executable-examples/7-typelevel-slots   # errors ONLY in drift-demo.ts
cat explorations/executable-examples/7-typelevel-slots/TSC-OUTPUT.txt
```

`valid-cart.demo.ts` (the real worked-example vocabulary, its bound point, and the compiling
unbound-slot partial point) typechecks clean; `drift-demo.ts` is broken by design — its four
binding-error cases are the exhibit.

## Spike limits

`src/notation/slots.ts` stays the grammar of record. This mirror handles the canonical authored
spacing only: no quote-aware brace scanning, no local degradation, no prose-brace tolerance, and
a plain `:` in step prose ahead of a slot group would confuse the match. A promotion of this
spike into the shipped DSL would mirror those rules too — and would need the recursion-depth and
error-message ergonomics checked against a real-sized vocabulary corpus, not one spec.
