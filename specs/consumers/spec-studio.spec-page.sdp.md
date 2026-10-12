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

## Intent
- outcome: Show everything the graph holds about one Spec on one page, in panels a person opens and closes one at a time.
### Open questions
- [non-blocking #headerFields] The original header shows an owner, a capability, tags and a last-verified time; the envelope is closed to `id`, `kind`, `altitude`, `readiness` and `relations` with the H1 as title, a capability is a projection or a Pack, and a verifier binding never records when a test last ran. Which of the four does the header show, and from which graph value?
  - decider: owner
- [non-blocking #rungColors] The original pins one color for each of seven rungs: light grey for `sketch`, blue for `framed`, cyan for `specified`, green for `designed`, emerald for `bound`, indigo for `executable` and violet for `verified`; readiness has four rungs, idea through ready, and the floor reached renders beside the stated rung. Does the palette color the stated rung, the floor reached, or both?
  - decider: owner
- [non-blocking #questionMetadata] The original shows each open question's owner and the date it was added; an open question carries its text, whether it blocks, an optional key and the optional fields `decider`, `links`, `provisional` and `trigger`, where `decider` names who settles it as a corpus token rather than a person, and git, not the graph, records when its line was added. Which fields does the panel show, and does a date stay off a page that is a function of the graph?
  - decider: owner
  - links: spec:model.open-question-fields
- [non-blocking #runtimeComposition] Does the runtime panel show more than the structural neighborhood of the Spec's implementation anchors?
- [non-blocking #schemaBindings] The original's bindings panel lists schema bindings beside code and test bindings; anchors bind implementation code, tests and oracles, and no anchor binds a schema. Does a schema binding need a home?
- [non-blocking #uiStories] The original's page outline names a section `UI / Stories`, whose UI half the UI panel carries; the original never says what a story is. What is a story, and does the page show one?
- [blocking #sourceLinks] Panels name code units, components and anchors, and the architecture lens selects a component, yet no Studio page or data value designs a destination for them. Does each get a page, or show its id and recorded repository-relative file and line as text?
  - decider: owner
  - provisional: no code-unit pages in phase 0; a code unit or anchor shows its id and recorded repository-relative file and line as text, with an action that copies file:line and no editor URI, absolute path or assumed source URL; source navigation waits for a separately designed source target, and a component's attributes, members and uses show in the architecture lens

## Behavior
- rule: Each panel collapses and expands on its own.
- rule: The header renders readiness as `spec:consumers.derived-readiness-banner` states: the stated rung beside the floor reached, with the divergence banner only in the dishonest direction.
- rule: The bindings panel speaks binding language as `spec:consumers.binding-language-views` states: each binding present or none, and the runtime observation not tracked.
- rule: Every Spec and Pack a panel names links to its page; how a code unit or anchor is reached awaits `spec:consumers.spec-studio.spec-page#question.sourceLinks`.
- rule: The design panel lists the `design` entries in authored order with their keys as code, and the UI panel lists the `ui` entries the same way, as `spec:decisions.authored-entry-order` rules for the Design Review.

## UI
The panels in page order.
- header: the Spec's id, its stated readiness beside the floor reached, its stated next rung with the clauses that keep it below that rung, its altitude and kind; its title; its design columns; the Packs it belongs to; and its warning and error counts as pill badges; the header infers no promotion.
- readinessColors: a palette distinct under color blindness, with text beside every color; whether it colors the stated rung, floor reached or both awaits `spec:consumers.spec-studio.spec-page#question.rungColors`.
- intentPanel: the intent section as prose, then an open-questions panel headed with its count; each question shows its text, blocking flag, key and address when keyed, its decider, links, provisional reading and trigger when present, and its carrier line when recorded, with an action that composes intent scoped to it.
- behaviorPanel: rules and flows in authored order, a keyed entry with its rule address and the examples that exercise it as recipe 34 reports, followed by example cards laid out as `spec:consumers.spec-studio.verification-panels` states.
- constraintsPanel: each constraint with its target, laid out as `spec:consumers.spec-studio.verification-panels` states.
- designPanel: a diagram of the components that realize the Spec, from its implementation anchors' `component` and `uses` edges, drawn as SVG whose nodes show their id, source file and line, with their destination awaiting `spec:consumers.spec-studio.spec-page#question.sourceLinks`; below it, the `design` entries, then the decision records the Spec names by `decidedBy` with each decision's text inline.
- runtimePanel: the structural neighborhood of the Spec's implementation anchors: each anchor's component and the code units it uses, with file and line.
- bindingsPanel: implementation bindings, design references, verifier bindings and the expected-outcome oracle, each with its id and recorded repository-relative file and line, shown as text with an action that copies file:line, plus runtime observation reading not tracked; source navigation awaits `spec:consumers.spec-studio.spec-page#question.sourceLinks`.
- verificationPanel: the verifiers and the coverage of the example space, laid out as `spec:consumers.spec-studio.verification-panels` states.
- evidencePanel: the evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states, with no invented build, deployment, measurement or SBOM data.
- relationsPanel: relations both ways, each with its type, claim, endpoint, resolution, reason and exercises when present; a resolving Spec endpoint links to its page.
- impactPanel: the upstream parents and downstream children, the Specs that depend on this one, the decision records it names, the tests that verify it, and the code its bindings reach.
- uiPanel: the `ui` entries.
- entryIds: every keyed Design, UI, rule or flow entry and every keyed open question carries an HTML element id equal to its entry address without the Spec id, the section and lower-camel key the entry-address grammar defines, so a link opens the entry on its page.
