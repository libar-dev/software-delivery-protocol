---
id: spec:consumers.spec-studio.spec-page
kind: behavior
altitude: story
readiness: scoped
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
  decidedBy: spec:decisions.authored-entry-order
---
# A Spec page shows one Spec in collapsible panels, in a fixed order

The original runtime panel linked Fastify routes to Effect programs, showed what Effect layers provided and required, and recorded Awilix registrations and their lifetimes, beside ports and external systems. That representation is lineage evidence in `docs/lineage/v0-design/07-spec-studio-and-projections.md`, section 2.3, Section F. The current structural anchors record identity, component membership, uses, role, and a component's architectural layer and context; the question below asks whether a later runtime panel needs more.

The page shows only what the graph holds. The original header's owner, tags and last-verified time, its schema bindings and its `UI / Stories` section have no graph value behind them, so the page shows none of them.

## Intent
- outcome: Show everything the graph holds about one Spec on one page, in panels a person opens and closes one at a time.
### Open questions
- [non-blocking #runtimeComposition] Does the runtime panel show more than the structural neighborhood of the Spec's implementation anchors?
  - decider: owner
  - provisional: the panel shows only the structural neighborhood the anchors record, until a reader asks for more of the runtime composition

## Behavior
- rule: Each panel collapses and expands on its own.
- rule: The page's core, its header, sections, relations, bindings and findings, is the one `spec:consumers.spec-studio.spec-page.core` states, and the panels below add to it.
- rule: [#sourceText] Every Spec and Pack a panel names links to its page. A code unit, component or anchor shows its id and its recorded repository-relative file and line as text, with an action that copies `file:line`; the page set holds no code-unit page and writes no editor URI, absolute path or assumed source URL, source navigation waits for a source target designed for it, and a component's attributes, members and uses show in the architecture lens.

## UI
The panels the core does not hold, in page order.
- intentPanel: beside each open question, an action that composes intent scoped to it.
- behaviorPanel: beside each keyed rule or flow, the examples that exercise it as recipe 34 reports, then example cards laid out as `spec:consumers.spec-studio.verification-panels` states.
- constraintsPanel: each constraint with its target, laid out as `spec:consumers.spec-studio.verification-panels` states.
- designPanel: a diagram of the components that realize the Spec, from its implementation anchors' `component` and `uses` edges, drawn as SVG whose nodes show their id, source file and line as the source-text rule states; below the design entries, the decision records the Spec names by `decidedBy`, each with its text inline.
- runtimePanel: the structural neighborhood of the Spec's implementation anchors: each anchor's component and the code units it uses, with file and line.
- verificationPanel: the verifiers and the coverage of the example space, laid out as `spec:consumers.spec-studio.verification-panels` states.
- evidencePanel: the evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states, with no invented build, deployment, measurement or SBOM data.
- impactPanel: the upstream parents and downstream children, the Specs that depend on this one, the decision records it names, the tests that verify it, and the code its bindings reach.
