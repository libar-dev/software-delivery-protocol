# Free prose at the graph seam

The spike counts **four prose paragraphs** across the five live documents that it deliberately
drops from reified section data: the parent readiness note, the child happy-path note, the
decision context, and the contract parking note. `graph-shape.test.ts` pins that count, so this
loss is evidence, not a hand-wave. The spike proves graph shape, but a product parser cannot
silently make those paragraphs file-only.

The ruling session has three MD-10-compatible extension options:

1. A content-only `prose` section keyed by heading path. It preserves arbitrary Markdown and
   makes the graph self-sufficient, but introduces a new section whose keys mirror document
   structure and may be awkward for projections.
2. A `description` value on the owning typed section. It gives consumers an obvious place to
   render nearby prose, but requires a deterministic ownership rule for text before the first
   section, between sections, and beneath unrecognized headings.
3. Prose remains file-only and the graph carries a source pointer. This keeps the graph lean,
   but every consumer that needs prose must read source, violating the one graph's role as sole
   input unless the pointer resolves through an extractor-owned content service.

This exhibit names the choice; it does not rule it. Option 1 is the cleanest literal extension,
option 2 is the most convenient projection shape, and option 3 carries the sharpest conflict
with the current graph law.
