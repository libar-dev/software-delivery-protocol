---
id: spec:consumers.spec-studio.spec-page
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.derived-readiness-banner
    - spec:consumers.binding-language-views
    - spec:model.open-question-keys
    - spec:model.open-question-fields
    - spec:model.rule-keys
    - spec:model.relation-reasons
    - spec:extraction.entry-locations
    - spec:consumers.pack-design
    - target: spec:consumers.spec-studio.diagrams
      reason: the design view and the impact panel draw the realization diagram and the trace graph
    - target: spec:extraction.entry-citations
      reason: the design section shows the source lines that cite each entry
    - target: spec:model.term-addresses
      reason: a keyed term's address names the element a glossary row links to
    - target: spec:consumers.spec-studio.sharing
      reason: a recorded file and line become a link only from a stamp's source template
    - target: spec:consumers.spec-studio.diff-page
      reason: given a base graph, the header's marker links the Spec's row on the diff page
  decidedBy: spec:decisions.authored-entry-order
---
# A Spec page shows one Spec in collapsible panels, in a fixed order

The original runtime panel linked Fastify routes to Effect programs, showed what Effect layers provided and required, and recorded Awilix registrations and their lifetimes, beside ports and external systems. That representation is lineage evidence in `docs/lineage/v0-design/07-spec-studio-and-projections.md`, section 2.3, Section F. The structural anchors record identity, component membership, uses, role, and a component's architectural layer and context, so the runtime panel shows that structural neighborhood and no more until a reader asks for more of the runtime composition.

The page shows only what the graph and the build's named inputs hold. The original header's owner, tags and last-verified time, its schema bindings and its `UI / Stories` section have no graph value behind them, so the page shows none of them.

## Intent
- outcome: Show everything the graph holds about one Spec on one page, in panels a person opens and closes one at a time.

## Behavior
- rule: Each panel collapses and expands on its own.
- rule: The page's core, its header, sections, relations, bindings and findings, is the one `spec:consumers.spec-studio.spec-page.core` states, and the panels below add to it.
- rule: [#sourceText] Every Spec and Pack a panel names links to its page. A code unit, component or anchor shows its id and its recorded repository-relative file and line as text, with an action that copies `file:line`; the page set holds no code-unit page and writes no editor URI, absolute path or assumed source URL; a recorded file and line become a link only when a stamp beside the page set names a source template, as `spec:consumers.spec-studio.sharing` states; a component's attributes, members and uses show in the architecture lens, which its id links to.
- rule: [#panelOrder] After the core's sections the page adds five panels, in this order, each open by default: Verification, Design view, Runtime, Evidence and Impact; a panel with nothing to show says so in one sentence and stays in its place; the core's relations, bindings and findings follow them.
- rule: [#sectionAdditions] Inside the core's sections the page adds a composing action beside each keyed entry that proposes new text for it, the composing actions beside each open question, the rule coverage beside each keyed rule or flow and the example cards after the rules, each constraint's target, the citations beside each cited entry, and an element id on each keyed term, as the rules below state.
- rule: [#termIds] Each keyed Model term in the core's Model section carries the element id `term.<key>`, its address after the `#`, and shows its key and its recorded line, as the core's entry ids do.
- rule: [#citations] Beside each keyed entry an anchored source file cites, its section lists every citing file and line recipe 51 records, as text with a copy action; a pinned declaration no file cites reads `no citation recorded`.
- rule: [#designView] The Design view panel draws the realization diagram of the units that satisfy the Spec, their components and what they use, and then lists the decision records the Spec names through `decidedBy`, each with its title linked and its decision text inline.
- rule: [#runtime] The Runtime panel shows the structural neighborhood of the Spec's implementation anchors: each anchor's component with its layer and context, and the units it uses, each with its file and line; runtime observation reads not tracked.
- rule: [#impact] The Impact panel draws the Spec's trace graph, one hop each way, and then lists what it rests on with each target's stated and derived rung, from recipe 21, and every Spec that rests on it to any depth, by distance, with the units, enabled verifiers and Packs each brings, from recipe 30.
- rule: [#diffMarker] Given a base graph, a line under the header names the base and lists the Spec's changed parts, as `spec:consumers.spec-studio.diff-page` states.

## UI
The panels the core does not hold, in page order.
- entryAction: beside each keyed entry, an action that composes intent proposing new text for it, with the entry's address as the change's scope and as the address it replaces.
- intentActions: beside each open question, actions that compose intent to resolve it or to promote it to a decision record.
- behaviorAdditions: beside each keyed rule or flow, its exercising examples as `spec:consumers.spec-studio.verification-panels` lays them out, then the example cards and unwritten example cards.
- constraintsAdditions: each constraint with its target, laid out as `spec:consumers.spec-studio.verification-panels` states.
- citationList: under a cited entry, `Cited at` and each citing file and line with a copy action, the citing anchor's id as code when the citation names one.
- verificationPanel: the verifier list, with run evidence given run records, then the coverage grid when the Spec owns an example space, laid out as `spec:consumers.spec-studio.verification-panels` states; the panel's element id is `panel.verification`.
- designViewPanel: the realization diagram, drawn as SVG whose nodes show their id, source file and line as the source-text rule states, then the decision records with their decision text; the panel's element id is `panel.design-view`.
- runtimePanel: the structural neighborhood of the Spec's implementation anchors, each anchor's component and the code units it uses, with file and line, then `Runtime observation: not tracked`; the panel's element id is `panel.runtime`.
- evidencePanel: the evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states, with no invented build, deployment, measurement or bill-of-materials data; the panel's element id is `panel.evidence`.
- impactPanel: the trace graph, then `Rests on` and `Rested on by` lists, the second grouped by distance, each row with its units, enabled verifiers and Packs; the panel's element id is `panel.impact`.

## Example space
```gwt-vocabulary
Given a Spec with two pinned declarations, the first of which an anchored test file {file:string} cites at line {line:number}
When the build renders the Spec's page
Then beside the first declaration the page lists {cited:string}
Then beside the second declaration the page reads {uncited:string}
```
