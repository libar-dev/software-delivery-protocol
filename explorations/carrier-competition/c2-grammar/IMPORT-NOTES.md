# `sdp import` emitter notes for `.sdp`

The import model remains carrier-neutral. For this exhibit, its document emitter becomes a grammar
renderer: the notation renderer supplies steps and slots; the envelope printer supplies identity,
descriptors, and declared relations.

Its work is concrete:

1. Choose stable ids and conservatively state `kind`, `altitude`, and `readiness` on the descriptor
   line; print one declared relation per line.
2. Emit the source title as the first prose line and preserve descriptions as unindented prose.
3. Render behavior steps with exact indentation and never invent a slot binding.
4. Turn scenario-outline placeholders into parent example-space slots only when type inference is
   unambiguous; otherwise preserve prose and report the uncertainty.
5. Expand every examples row to a named one-point child, requesting meaningful identity when the
   source offers only row numbers.
6. Report unmapped tags, unresolved parents, absent verifier bindings, and every construct the
   one-way converter cannot represent.

The spike also exposes a product seam: `deriveGraph` exists at the carrier boundary but is not
exported from the package barrel. This exploration deep-imports `src/extract/derive.ts` through its
local Vitest configuration. Productization needs an extractor-owned adapter or public reified-input
seam; a standalone `.mjs` script importing `dist` cannot reach it today.
