# `sdp import` emitter notes for `.sdp.md`

The existing carrier-neutral import exploration already produces the target shape: one document
per behavior, rule, or example; frontmatter for the envelope; prose for imported descriptions;
and `gwt` fences for steps. The Markdown emitter is therefore mostly a deterministic formatter.

Its jobs are:

1. Choose stable ids, write `kind`, `altitude`, conservative `readiness`, and declared
   `refines` relations into frontmatter.
2. Map a feature title to H1 and preserve its description as ordinary prose.
3. Emit scenario steps into `gwt` fences without guessing bindings.
4. Turn scenario-outline placeholders into parent vocabulary slots only when inference is
   unambiguous; otherwise retain prose and report the uncertainty.
5. Expand each examples row to one named child bound point, asking for meaningful identity when
   source rows provide only ordinals.
6. Emit an import report for tags, inferred types, unresolved parents, absent verifier bindings,
   and every construct it cannot map. The converter is one-way and never a canonical parse path.

The spike exposed one product seam: `deriveGraph` exists at the carrier boundary but is not
exported from the package barrel. This exploration deep-imports `src/extract/derive.ts` under its
local Vitest config. Productizing a document parser would need an extractor-owned carrier adapter
or a public reified-input seam; importing `dist` from a standalone `.mjs` script cannot reach it.

Frontmatter relation lists are another named formatter item. The micro-parser supports one target
per relation type because that covers this exhibit; a real emitter and parser must support the
model's relation arrays without collapsing repeated relation types.
