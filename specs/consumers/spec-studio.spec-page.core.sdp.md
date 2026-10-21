---
id: spec:consumers.spec-studio.spec-page.core
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.spec-page
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.spec-studio.shell
    - spec:consumers.derived-readiness-banner
    - spec:consumers.binding-language-views
    - spec:model.open-question-fields
    - spec:model.rule-keys
    - spec:model.relation-reasons
    - spec:extraction.entry-locations
  decidedBy: spec:decisions.authored-entry-order
---
# A Spec page's core shows the whole Spec, with an anchor for every entry

The full Spec page adds panels to this core: diagrams, a runtime neighborhood, verification and evidence panels, impact, and actions that compose intent. The core shows what the Spec context holds, as text, so a reviewer with only a link reads the whole Spec and can cite any entry by its address.

## Intent
- outcome: Show everything the graph holds about one Spec on one page that reads without script: its header, its sections in order with an anchor for every addressable entry, its relations both ways, its bindings and its findings.

## Behavior
- rule: [#header] The header shows the title; the id with a copy action; the kind's display label and the altitude; the stated rung beside the floor reached on one line, with the divergence banner only in the dishonest direction; the stated next rung with `nothing blocks` or each unmet clause and its targets; the Packs the Spec belongs to, linked; its design columns; its findings by severity; and its carrier file as text with a copy action. It shows no owner, capability, tag or last-verified time: the envelope holds none, the Packs stand for a capability, and a binding never records a run.
- rule: [#summary] A summary in words follows the header with what the header does not show: the open and blocking questions, and the implementation, verifier and oracle bindings as present or none. It repeats no rung the header shows.
- rule: [#sections] The narrative comes next, then each section the Spec carries as a panel open by default, in the order intent, behavior, constraints, model, design, decision, verification, ui, with its entries in authored order. A section the Spec lacks is absent, and the page adds no section the graph does not hold. The narrative carries the element id `narrative` and each section panel `section.<name>`, such as `section.behavior`.
- rule: [#entryIds] Every entry an entry address can name, a keyed Design or UI entry, a keyed rule or flow, a keyed open question and a keyed Model term, carries an element id equal to its address after the `#`, such as `design.<key>` or `term.<key>`, and shows its key and its recorded line.
- rule: [#questions] Each open question shows its blocking flag in words, its key as code with a copy action for the full entry address when it has one, its text, its decider, its links, linked, its provisional reading and its trigger when present, and its recorded line. It shows no date: git records when a line changed.
- rule: A `gwt` or `gwt-vocabulary` fence shows as preformatted step text, as authored.
- rule: [#relations] Relations show both ways, each with its type, its direction, its claim, the other endpoint, linked when it is a Spec or a Pack, whether it resolves, and its reason and the rule keys it exercises when present.
- rule: [#bindings] Bindings speak binding language. The implementation binding, design reference, verifier binding and expected-outcome oracle each read present or none, and list each unit, test anchor, example or oracle by id, label, and recorded file and line as text with a copy action; a unit adds its role and component, and an example verifier says whether it is enabled. Runtime observation reads not tracked, and run results read not recorded in the graph.
- rule: [#findings] The findings that name the Spec close the page, each with its severity in words, its validator id and its message.

## UI
- headerBlock: the title as the page heading; below it a line with the id, kind, altitude, the rung badge with the floor in words, and the next rung; then the Packs, the design columns, the finding counts and the carrier file.
- summaryLine: one sentence under the header.
- sectionPanel: an open disclosure per section, headed with the section's name, and for Verification its mode.
- entryRow: an entry's key as code, its value, and `line <n>` when recorded, in a definition list.
- questionItem: the blocking flag in words, `question.<key>` as code when keyed, a copy action whose text and accessible name carry the full entry address, with no second code span of that address, the text, each present field on its own labelled line, and `line <n>` when recorded.
- relationsTable: five columns, relation and direction, other end, claim, reason, and exercised keys, with an unresolved endpoint marked in words.
- bindingsBlock: four labelled lines, each present or none with its items below it, then runtime observation and run results.
- findingsList: one line per finding, the severity word first.
