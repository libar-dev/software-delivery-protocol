---
id: spec:consumers.spec-studio
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
  dependsOn:
    - spec:consumers.reader
    - target: spec:consumers.edit-model
      reason: wanted changes leave the view as intent for an ordinary source edit
  constrainedBy: spec:extraction.determinism
  decidedBy:
    - spec:decisions.studio-html-surface
    - spec:decisions.studio-web-components
    - spec:decisions.shipped-projections-frozen
---
# The Spec Studio is a static HTML workbench over the one graph

## Intent
- actor: A person in the repository who designs a capability ahead of its code and iterates on it in passes, and a pull request reviewer who holds only a link; both read far more than they change.
- problem: The generated Markdown Design Review offers no built-in search or filters, and navigation is through its links, so reviewers in the first adopter open carrier files alongside it.
- outcome: Give a person reviewing a design one generated HTML workbench that explores the whole graph through lenses, shows each Spec and Pack in context, and turns a wanted change into scoped intent rather than an edit.

## Behavior
- rule: The read-only Studio ships in the open-source package `@libar-dev/software-delivery-protocol`, beside the four shipped projections; hosted review, shared comments and hosted previews may later ship under `@libar-ai/`.
- rule: The Studio is a projection of the one graph: its page set under `generated/spec-studio/` is regenerated from the graph, states no truth, and confers nothing back into the graph.
- rule: [#staticPageSet] The Studio is a static page set: an index page, a search page, and one page per Pack and per Spec, with their local assets. Its build renders each page whole, so a page needs no server and reads without its script, which adds filtering, search and copying.
- rule: The Studio works offline: the same files open from the file system through `file://` for local use and from any static host for sharing.
- rule: The Studio is reproducible: one graph renders byte-identical files, and an asset whose filename embeds a hash of its content gets the same name from the same graph.
- rule: The Studio is read-rich: everything the graph holds about a Spec or a Pack is explorable in it.
- rule: The Studio is write-careful: it writes nothing to canonical source, and a change a person wants leaves it as scoped intent for an agent, as `spec:consumers.edit-model` states.
- rule: [#noSecondGraph] The Studio never builds a second graph: every join, claim, delivery fact, derived readiness, floor failure and finding it shows is a value the reader computed when the Studio was built, and the page computes none of them again.
- rule: [#recipeAnswers] A page shows a catalog recipe's answer only when the Studio's design names that recipe, and the build composes the answer over the graph it derived; the page recomputes none of it.
- rule: The Studio stands beside the shipped Design Review, census, Mermaid and Gherkin projections and re-specifies none of them, which `spec:decisions.shipped-projections-frozen` keeps as they are.

## Verification — manual
- The Studio's first build is accepted when a person completes, from the Studio's page set and the files it links to, the five tasks the first adopter set over its history-view Pack (`libar-platform/docs/feedback/sdp-feedback-01.md`): find the history contract, locate OD-157, explain the aggregate dependency, find one declaration's type comparison, and say whether a paused-rebuild example has native-backend evidence. The first build reads no run evidence, so the last task passes when the person finds that the example requires the native backend tier, reads whether a verifier is bound to it, and reports that no run result is supplied.
