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
### Open questions
- [non-blocking #phaseZeroSplit] No Spec states phase 0's deliverables: the index, the Pack page, search and the `sdp studio` publisher with its flags, output root, invalidation, clean check and exit code. Which child Specs carry them, and do pull request previews join phase 0?
  - decider: owner
  - provisional: child Specs for the index, the Pack page, search and the publisher; the publisher's draft: `sdp studio [root] [--exclude PATH]... [--check-clean]` writes only `generated/spec-studio/` under the root, which defaults to the working directory, with each exclusion a root-relative path prefix; a run writes its page set to `generated/spec-studio.tmp/` and replaces the live root with it wholesale; every `sdp build` attempt invalidates the live and temporary Studio roots before extraction, and an unsuccessful Studio run removes any Studio root it cannot certify; under `--check-clean` it compares an independent twin with the current output, returns nonzero and removes divergent, missing or drifted output, and replaces certified output wholesale; it shows validation findings without withholding publication and returns the validation exit code; previews stay a later phase
- [non-blocking #pageModel] The Studio is built as a single-page application, while its data contract both writes data files, which a page opened through `file://` cannot fetch, and embeds each page's data; is the Studio one page or a static page set, and how does each page get its data with no request?
  - decider: owner
  - links: spec:consumers.spec-studio.data
  - provisional: a static page set of an index page and one page per Pack and per Spec, each embedding the data it reads in one JSON script element, with its local assets; a standalone data file, if any, duplicates the embedded values for consumers outside the page
- [non-blocking #recipeValues] The Studio shows only values the reader computes, while its pages need answers only catalog recipes compute, such as pinned declarations and keyed-rule coverage; may the Studio's build compose recipe answers over the same graph, and which?
  - decider: owner
  - links: spec:consumers.spec-studio.data
  - provisional: the build composes a recipe's answer over the same graph only when the Studio's design names that recipe, as recipe 24's pinned declarations and recipe 34's keyed-rule coverage; the page recomputes no join, and no context bundle is saved as Studio data
- [non-blocking #acceptanceMeasure] The first build's acceptance names one adopter's corpus, a register id and a path in another repository; does phase 0 keep those five named tasks, or state a measure any corpus can run?
  - decider: owner
  - provisional: keep the first adopter's five named tasks until phase 0 is accepted

## Behavior
- rule: The read-only Studio ships in the open-source package `@libar-dev/software-delivery-protocol`, beside the four shipped projections; hosted review, shared comments and hosted previews may later ship under `@libar-ai/`.
- rule: The Studio is a projection of the one graph: its page set under `generated/spec-studio/` is regenerated from the graph, states no truth, and confers nothing back into the graph.
- rule: The Studio is a mostly static single-page application, buildable as an `index.html` page and its assets, and it needs no server.
- rule: The Studio works offline: the same files open from the file system through `file://` for local use and from any static host for sharing.
- rule: The Studio is reproducible: one graph renders byte-identical files, and an asset whose filename embeds a hash of its content gets the same name from the same graph.
- rule: The Studio is read-rich: everything the graph holds about a Spec or a Pack is explorable in it.
- rule: The Studio is write-careful: it writes nothing to canonical source, and a change a person wants leaves it as scoped intent for an agent, as `spec:consumers.edit-model` states.
- rule: [#noSecondGraph] The Studio never builds a second graph: every join, claim, delivery fact, derived readiness, floor failure and finding it shows is a value the reader computed when the Studio was built, and the page computes none of them again.
- rule: The Studio stands beside the shipped Design Review, census, Mermaid and Gherkin projections and re-specifies none of them, which `spec:decisions.shipped-projections-frozen` keeps as they are.

## Example space
```gwt-vocabulary
Given an extraction root whose graph holds a Pack and its member Specs
When the Studio renders twice from freshly derived graphs of that root
Then the page set holds the entry page {entryPage:string}
Then the two renders are byte-identical: {byteIdentical:boolean}
Then every carrier and source file under the root stays byte-identical: {rootUntouched:boolean}
```

## Verification — manual
- The Studio's first build is accepted when a person completes, from the Studio's page set and the files it links to, the five tasks the first adopter set over its history-view Pack (`libar-platform/docs/feedback/sdp-feedback-01.md`): find the history contract, locate OD-157, explain the aggregate dependency, find one declaration's type comparison, and say whether a paused-rebuild example has native-backend evidence. The first build reads no run evidence, so the last task passes when the person finds that the example requires the native backend tier and has a bound verifier, and reports that no run result is supplied.
