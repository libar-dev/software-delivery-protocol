---
id: spec:consumers.spec-studio.lenses
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:consumers.spec-studio.data
---
# Four lenses read the graph as Packs, architecture, tests and evidence

Each lens is a page with a Spec of its own, so the Packs, architecture and tests lenses build on the graph they read today, and only the evidence lens waits for an observation the graph does not yet record. This Spec keeps what the four share.

## Intent
- outcome: Let a person see the graph four ways, by Pack, by architecture, by verification and by evidence, from one top navigation.

## Behavior
- rule: [#order] The lenses are pages of the page set, reached from the top navigation in the order Packs, architecture, tests, evidence; the index page is the Packs lens and the default landing page.
- rule: [#lensValues] A lens renders reader values and the recipe answers its own Spec names, and computes none of them in the page.
- rule: [#readOnly] A lens writes nothing and states nothing: it lists, groups, draws and links, and a change a person wants from it leaves through the composing panel as scoped intent.

## UI
- lensPages: `index.html` for the Packs lens, `architecture.html`, `tests.html` and `evidence.html`, each opening with its name and one sentence saying what it reads.
