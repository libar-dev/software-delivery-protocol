---
id: spec:consumers.spec-studio
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.projections-model
  dependsOn:
    - spec:consumers.reader
    - spec:consumers.edit-model
  constrainedBy: spec:extraction.determinism
  decidedBy:
    - spec:decisions.studio-html-surface
    - spec:decisions.studio-web-components
    - spec:decisions.shipped-projections-frozen
---
# The Spec Studio is a static HTML workbench over the one graph

## Intent
- actor: A stakeholder who reviews a design, on a desktop or on a phone, and reads far more than they change.
- outcome: Give a person reviewing a design one generated HTML workbench that explores the whole graph through lenses, shows each Spec and Pack in context, and turns a wanted change into scoped intent rather than an edit.
### Open questions
- [blocking #packageHome] Which package carries the Studio: the open-source `@libar-dev/software-delivery-protocol`, or a commercial `@libar-ai/` package? The Studio's deferral re-enters on a recorded ruling that names this home; earlier planning placed the Studio under `@libar-ai/`, and no Spec rules it.
- [blocking #unservedReader] Which reader does the Studio serve that the generated Markdown Design Review does not? The first adopter generates its own Pack page beside the Design Review, with the members in reading order, the clause that holds each below its next rung, the Specs outside the Pack they rest on, and their open questions with register rows, while the Design Review's Pack page lists the members and the verifier gaps.

## Behavior
- rule: The Studio is a projection of the one graph: its page set under `generated/spec-studio/` is regenerated from the graph, states no truth, and confers nothing back into the graph.
- rule: The Studio is a mostly static single-page application, buildable as an `index.html` page and its assets, and it needs no server.
- rule: The Studio works offline: the same files open from the file system through `file://` for local use and from any static host for sharing.
- rule: The Studio is reproducible: one graph renders byte-identical files, and an asset whose filename embeds a hash of its content gets the same name from the same graph.
- rule: The Studio is read-rich: everything the graph holds about a Spec or a Pack is explorable in it.
- rule: The Studio is write-careful: it writes nothing to canonical source, and a change a reader wants leaves it as scoped intent for an agent, as `spec:consumers.edit-model` states.
- rule: The Studio never builds a second graph: every join, claim, delivery fact, derived readiness, floor failure and finding it shows is a value the reader computed when the Studio was built, and the page computes none of them again.
- rule: The Studio is built from custom elements, as `spec:decisions.studio-web-components` rules.
- rule: The Studio stands beside the shipped Design Review, census, Mermaid and Gherkin projections and re-specifies none of them, which `spec:decisions.shipped-projections-frozen` keeps as they are.

## Example space
```gwt-vocabulary
Given an extraction root whose graph holds a Pack and its member Specs
When the Studio renders twice from freshly derived graphs of that root
Then the page set holds the entry page {entryPage:string}
Then the two renders are byte-identical: {byteIdentical:boolean}
Then the extraction root stays byte-identical: {rootUntouched:boolean}
```
