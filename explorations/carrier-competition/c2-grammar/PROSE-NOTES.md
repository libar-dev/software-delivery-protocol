# Prose in the own-grammar exhibit

The spike counts **four prose paragraphs** that are deliberately absent from reified section data:
the parent readiness note, the child happy-path note, the decision context, and the contract parking
note. `graph-shape.test.ts` pins that count. The loss is therefore measured evidence, never silent
behavior.

The `cases` block is different: it is structured pre-graph expansion input, not prose. Ordinary
reification omits it from `Spec` section data but reports one named `droppedStructures` entry;
`table-expansion.test.ts` pins that side channel. The expander consumes the same parsed block and
pins its generated siblings byte-for-byte.

The illustrative grammar uses one small delimitation law: keyword-led, indented lines are
structure; unindented lines after the title are prose. That keeps ordinary paragraphs visually
light, but the simplicity moves complexity into ownership:

- prose that needs to begin with an indented structural keyword must be escaped or reformulated;
- wrapping and indentation are semantic, so a formatter must understand the grammar;
- an unknown keyword cannot be guessed as prose without risking silent loss;
- multi-paragraph structured fields need an explicit continuation form.

The standing gen-1 evidence is the truncated-docstrings caution: an owned grammar that treats prose
as incidental eventually clips or degrades the material humans care about most. A product parser
must preserve unknown prose or emit a finding; it may not use this spike's counted-drop behavior.

F2 already names the shared prose-in-graph options in
`../f2-markdown/PROSE-IN-GRAPH.md`. This exhibit adds corroborating data and no competing proposal.
Where prose lives in the one graph remains a plan-16 ruling item.
