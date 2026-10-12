---
id: spec:consumers.spec-studio
kind: behavior
altitude: feature
readiness: defined
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

## Behavior
- rule: The Studio serves a person working in the repository who designs a capability ahead of its code and iterates on it in passes, and a reviewer of a pull request who holds only a link. The Markdown Design Review serves neither well: its pages have no search, no filters and no navigation beyond links, and its readers in the first adopter open the carrier files instead.
- rule: The Studio's first build is accepted when a reader completes, from the Studio's page set and the files it links to, the five reader tasks the first adopter set over its history-view Pack (`libar-platform/docs/feedback/sdp-feedback-01.md`): find the history contract, locate OD-157, explain the aggregate dependency, find one declaration's type comparison, and say whether a paused-rebuild example has native-backend evidence. The first build reads no run evidence, so the last task passes when the reader finds that the example requires the native backend tier and has a bound verifier, and reports that no run result is supplied.
- rule: The read-only Studio ships in the open-source package `@libar-dev/software-delivery-protocol`, beside the four shipped projections; hosted review, shared comments and hosted previews may later ship under `@libar-ai/`.
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
