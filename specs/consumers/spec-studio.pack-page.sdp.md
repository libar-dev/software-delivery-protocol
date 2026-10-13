---
id: spec:consumers.spec-studio.pack-page
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.spec-studio.shell
    - target: spec:consumers.pack-design
      reason: the page renders the Pack design the Pack context carries
    - spec:consumers.derived-readiness-banner
    - spec:consumers.binding-language-views
    - spec:model.open-question-fields
---
# A Pack page shows the Pack's design as one card per member

The Markdown Pack page renders the Pack design as one wide member table, and the first adopter's reviewers read carrier files instead. This page renders the same assembly as a summary, then a card per member that a reviewer opens where they need the detail.

## Intent
- outcome: Show where a Pack's design stands, member by member in reading order, on one page a reviewer scans quickly and opens where they need detail.

## Behavior
- rule: [#header] The page opens with the Pack's title, its id, its carrier file as text with a copy action, its framing as prose, and its vocabulary references, linked.
- rule: [#summary] A summary follows with each of the Pack totals in a sentence: the members and the unresolved ones, the members held below their stated next rung and those waiting only for their author, the design entries, pinned declarations, open and blocking questions, the members with implementing and with referencing units, and the boundary in each direction.
- rule: [#memberCards] The members follow in authored order, one closed card each. A card's summary line shows the member's position, title and kind, its stated rung beside the floor reached, its stated next rung with `nothing blocks` or how many clauses hold it, its open and blocking questions, and its implementation and verifier bindings as present or none.
- rule: [#cardBody] An open card shows the member's id, linked to its Spec page; each clause that holds it below its stated next rung, with the targets the clause names and their stated rungs; its counts of design entries and pinned declarations, and the decisions it names, linked, each with its stated rung; each open question with its blocking flag in words, its address linked to the question on the Spec page, its recorded line, its text, and its decider, links, provisional reading and trigger when present; each unit that implements it and each that references it, by id, label, and recorded file and line as text with a copy action, with its role and its component's id, layer and context; and its verifiers and verifying examples, each count beside how many are enabled.
- rule: An unresolved member's card says only that the manifest names an id the graph does not hold.
- rule: [#holds] After the cards, the page lists each member held below its stated next rung with every clause and its targets, then names the members whose next rung waits only for their author's statement; it never presents a rung as approved.
- rule: [#boundary] The boundary follows in four closed sections, Rests on, Rested on by, Verified by and Superseded by, each headed with its count. Each row shows the outside Spec, linked, its stated rung, its implementation binding as present or none, and the members it joins under each relation type; an empty section reads None.
- rule: Then come the members with no verifier binding, those stated `ready` first, and the findings that name the Pack.
- rule: [#openAll] One control opens or closes every card and section at once, and opening the page at a card's fragment opens that card.

## UI
- headerBlock: the title as the page heading; below it the id and the carrier file, each with a copy action; the framing; the vocabulary references.
- summaryList: the totals as a short list of sentences, each count first.
- memberCard: a disclosure whose element id is the member's Spec id; its summary line reads `<position>. <title>`, then badges for kind, stated rung and floor, the next rung in words, the question counts and the two binding values, wrapping onto further lines on a narrow screen.
- cardBody: in order, the id link, the holds, the design columns and decisions, the open questions, the code, and the verifiers.
- questionItem: the blocking flag in words, the address as a link, `line <n>` when recorded, the text, then each present field on its own labelled line.
- unitItem: the unit id as code, its label, `<file>:<line>` with a copy action, its role, and its component with layer and context.
- holdsList: one entry per held member with its clauses; then one sentence naming the members that wait for their author.
- boundaryTable: four columns, Spec, stated rung, implementation binding and joined members, the last listing each relation type with its members.
