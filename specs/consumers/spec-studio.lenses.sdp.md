---
id: spec:consumers.spec-studio.lenses
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:consumers.spec-studio.data
---
# Five lenses read the graph as Packs, capabilities, architecture, tests and evidence

Each lens is a page with a Spec of its own, so each builds on the graph it reads today: the Packs, capabilities, architecture and tests lenses read what the graph records, and the evidence lens reads not tracked until the graph records an observation. This Spec keeps what the five share.

## Intent
- outcome: Let a person see the graph five ways, by Pack, by capability, by architecture, by verification and by evidence, from one top navigation.

## Behavior
- rule: [#order] The lenses are pages of the page set, reached from the top navigation in the order Packs, capabilities, architecture, tests, evidence; the index page is the Packs lens and the default landing page.
- rule: [#lensValues] A lens renders reader values and the recipe answers its own Spec names, and computes none of them in the page.
- rule: [#readOnly] A lens writes nothing and states nothing: it lists, groups, draws and links, and a change a person wants from it leaves through the composing panel as scoped intent.

## UI
- lensPages: `index.html` for the Packs lens, `capabilities.html` for the capabilities lens, `architecture.html`, `tests.html` and `evidence.html`, each opening with its name and one sentence saying what it reads.
