---
id: spec:consumers.spec-studio.pack-page
kind: behavior
altitude: story
readiness: ready
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
- rule: [#header] The page opens with the Pack's title, its id and its carrier file as text with a copy action, and a link to the Pack's slice page, then the summary; the framing follows as prose under the heading Framing, with the vocabulary references, linked.
- rule: [#summary] The summary states each Pack total in one sentence that opens with its count, never as a table: the members and the unresolved ones, the members held below their stated next rung and those waiting only for their author, the design entries and pinned declarations, the open and blocking questions, the members with an implementation binding and with a design reference, and the boundary in each direction.
- rule: [#holds] The summary's held sentence links each held member to its card with its count of unmet clauses, and its waiting sentence names the members whose stated next rung waits only for their author's statement unless every member does; the page never presents a rung as approved.
- rule: [#memberCards] The members follow in authored order, one closed card each. A card's summary line shows the member's position, title and kind, its stated rung beside the floor reached, its stated next rung with `nothing blocks` or how many of its clauses are unmet, its open and blocking questions, and its implementation and verifier bindings as present or none.
- rule: [#cardBody] An open card shows the member's id, linked to its Spec page, then the parts the next five rules state, in their order.
- rule: [#cardHolds] A card lists each clause unmet for the member's stated next rung, with the targets the clause names and their stated rungs.
- rule: [#cardDesign] A card counts the member's design entries and pinned declarations, and links the decisions it names, each with its stated rung.
- rule: [#cardQuestions] A card lists each open question with its blocking flag in words, its address when it is keyed, linked to the question on the Spec page, its recorded line, its text, and its decider, links, provisional reading and trigger when present.
- rule: [#cardCode] A card lists each unit that implements the member and each that references it, by id, label, and recorded file and line as text with a copy action, with its role and its component's id, layer and context.
- rule: [#cardVerifiers] A card states the member's verifier binding as present or none and, when it has any, counts its verifiers and verifying examples, each beside how many are enabled.
- rule: An unresolved member's card says only that the manifest names an id the graph does not hold.
- rule: [#boundary] The boundary follows in four closed sections, Rests on, Rested on by, Verified by and Superseded by, each headed with its count. Each row shows the outside Spec, linked, its stated rung, its implementation binding as present or none, and the members it joins under each relation type; an empty section reads None.
- rule: [#unboundVerifiers] Then come the members with no verifier binding, those stated `ready` first, under one sentence saying the graph records bindings and never runs; then the findings that name the Pack.
- rule: [#openAll] `Open all` and `Close all` open or close every card and section at once, and opening the page at a card's fragment opens that card.

## UI
- headerBlock: the title as the page heading; below it the id and the carrier file, each with a copy action, and the link `Read this Pack as one design` to its slice page; then the summary; then the framing under a `Framing` heading, and the vocabulary references.
- summaryList: the totals as a short list of sentences under a `Where the design stands` heading, each opening with its count, a zero written as No.
- memberCard: a disclosure whose element id is the member's Spec id; its summary line reads `<position>. <title>`, then the kind, the rung badge, the floor in words, the next rung in words unless the member states ready, the question counts and the two binding values, all but the badge as plain text, wrapping onto further lines on a narrow screen.
- cardBody: in order, the id link, the unmet clauses, the design counts and decisions, the open questions, the code, and the verifier binding.
- questionItem: the blocking flag in words; for a keyed question, `question.<key>` as a link to its address with a copy action for the full address; `line <n>` when recorded; the text; then each present field on its own labelled line.
- unitItem: the unit id as code, its label, `<file>:<line>` with a copy action, its role, and its component with layer and context.
- boundaryTable: four columns, Spec, stated rung, implementation binding and joined members, the last listing each relation type with its members.
