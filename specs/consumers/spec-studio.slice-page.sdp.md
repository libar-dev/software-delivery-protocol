---
id: spec:consumers.spec-studio.slice-page
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:consumers.design-slice
      reason: the page renders the slice's answer
    - target: spec:consumers.spec-studio.data.recipe-answers
      reason: the build evaluates the slice recipe once for each Pack, and the page reads that answer
    - target: spec:consumers.spec-studio.pack-page
      reason: each member links to its card on the Pack page, whose element id is the member's id
    - target: spec:consumers.spec-studio.diagram-kinds
      reason: the dependency drawing over a set of Specs and the architecture drawing scoped to the components a set touches are drawing kinds
    - target: spec:consumers.spec-studio.diagrams
      reason: both drawings keep the diagram contract, bound and text equivalent included
    - spec:consumers.derived-readiness-banner
    - spec:consumers.binding-language-views
    - spec:model.open-question-fields
---
# A slice page shows a Pack's design as one whole

The Pack page reads a Pack card by card, in the order its author wrote. A reviewer judging the design needs the other reading first: which members the rest stand on, what the design will touch in the code, and what decisions and questions bound it. The slice page gives that reading on a page of its own beside the Pack page, one link apart. It keeps the Pack page whole, because a Pack of a hundred members already makes a long page of cards, and the two readings answer different questions in different orders: the author's narrative there, the members others rest on first here.

## Intent

- outcome: Give the Studio a page per Pack that shows its design slice: the members' dependency drawing, the components they touch, the decisions and open questions in scope, and each member's next rung.

### Open questions

- [non-blocking #exportCarriesSlice] Does a Pack export also carry the Pack's slice page?
  - decider: delegated
  - provisional: no; the export keeps the Pack page and its members, and the slice page stays one link away in the page set

## Behavior

- rule: [#slicePerPack] The page set holds one slice page per Pack, `slices/<name>.html`, its name formed from the Pack's id as the Pack page's name is; it renders the build's design slice answer for that Pack in full and states no value the answer does not hold, apart from counts the build takes of it.
- rule: [#header] The page opens with the heading `Design slice` and the Pack's title, the Pack's id as text with a copy action, and a link back to the Pack page, then the summary and a reading note.
- rule: [#summary] The summary states each slice total in one sentence that opens with its count: the members and the examples counted in their parents; the relations among members, the deepest depth and any cycle; the members held below their stated next rung and those waiting only for their author; the outside Specs the slice rests on, how many of them hold a member, and the outside Specs that rest on it; the components touched, through the members' code, through what the slice rests on, and planned; the decisions in scope and how many state below `ready`; and the open and blocking questions.
- rule: [#readingNote] The reading note says in words that members read with the ones others rest on first, that the design columns count what each member carries beside its rung and never judge whether it is enough, and that the page records no review and approves nothing.
- rule: [#dependencyDrawing] Under `How the members rest on each other` comes the slice's dependency drawing, laid out as `spec:consumers.spec-studio.diagram-kinds` lays out a dependency drawing over a set of Specs: each member that is not an example counted in its parent is a box with its title, id, stated rung and floor, and its count of examples; members in bands by depth, a member sitting above the members it rests on; the outside Specs the slice rests on in a band of their own, each one that holds a member or states below `defined` as its own box and the rest folded into one box per relation that names them; each relation an edge named by its type; and a cycle's members in one band, named as a cycle in the text equivalent.
- rule: [#memberTable] Under `What each member needs next` comes one row per member that is not an example counted in its parent, by depth and then in the scope's order: the member's title linked to its card on the Pack page with its id, its depth, its stated rung beside the floor reached, its stated next rung with `nothing blocks` or each unmet clause and the Specs it names with their stated rungs, then the design it carries, its rules with how many are keyed, its design entries, pinned declarations, open questions with how many block, decisions, and examples with how many are bound, each count on its own line, and its implementation and reference bindings as counts; the table has no total row, and no count is combined with another.
- rule: [#exampleRows] An example member counted in its parent has no row of its own; its parent's row counts it, and the example keeps its card on the Pack page.
- rule: [#architecture] Under `The architecture it touches` comes the architecture drawing scoped to the touched components, laid out as the diagram kinds lay out an architecture drawing over a set of components, then one row per touched component: its id linked to its detail on the architecture lens, or a planned component's design linked to its Spec page; its label, layer and context; anchored or planned in words; and how the slice reaches it, the members whose code satisfies it, the members whose code references it, the Specs the slice rests on whose code it holds, and the member designs naming it, each list in words.
- rule: [#unplacedAndDiffering] After the component rows come the units that implement or reference a member and belong to no component, then the differing rows of member designs, each section reading None when empty.
- rule: [#noArchitecture] A slice that touches no component says so in one sentence and names, by count, the Specs it rests on that no code satisfies, so an empty architecture never reads as an architecture nobody needs.
- rule: [#decisions] Under `Decisions in scope` comes one row per decision: its title linked to its Spec page, its stated rung beside the floor reached, whether it is a member, the members it shapes, the decisions it refines or supersedes, and its open and blocking question counts.
- rule: [#questions] Under `Open questions in scope` comes each question, blocking ones first, with its blocking flag in words, its address linked to the question on its Spec page when it is keyed, its Spec, its text, its decider, links, provisional reading and trigger when present, and the members it holds.
- rule: [#boundary] Under `Where the slice meets the rest` come four closed sections, Rests on, Rested on by, Verified by and Superseded by, each headed with its count; a Rests on row shows the outside Spec linked, its stated rung beside the floor reached, its implementation binding as present or none, the members it joins under each relation type, and the members it holds.
- rule: [#bindingWords] The page speaks binding language: a unit implements or references a member, a verifier is bound, and no cell reads built, done, verified or approved.
- rule: [#openAll] `Open all` and `Close all` open or close every closed section and text equivalent at once, and the page reads in full without script.

## UI

- pagePath: `slices/<name>.html`, `<name>` formed from the Pack id as `packs/<name>.html` forms it, so the Pack page and its slice page share a name.
- headerBlock: the page heading `Design slice: <Pack title>`; below it the Pack id with a copy action and the link `Read the Pack member by member` to its Pack page; then the summary under `The design as a whole`, then the reading note.
- readingNoteText: `Members read with the ones others rest on first. The columns count the design each member carries beside its rung; they never judge whether it is enough. This page records no review and approves nothing.`
- drawingIds: the dependency drawing's subject is the Pack id with the view name `dependencies`, and the architecture drawing's the Pack id with the view name `architecture`, so their text equivalents are `diagram.<pack id>.dependencies.text` and `diagram.<pack id>.architecture.text`.
- memberTable: a table in a scroll region with the columns `Member`, `Depth`, `Rung`, `Next rung`, `Design carried` and `Code`, so it fits a desktop column without scrolling; `Member` holds the title link, the id and the kind; `Rung` the rung badge and `floor <rung>`; `Design carried` six lines, `<n> rules, <k> keyed`, `<n> entries`, `<n> declarations`, `<n> questions, <b> blocking`, `<n> decisions` and `<bound> of <n> examples bound`, each count a plain number, a zero written `0`, and a zero part such as `, 0 keyed` left out; `Code` two lines, `<n> implementing` and `<n> referencing`.
- componentTable: a table with the columns `Component`, `Layer and context`, `Anchored or planned` and `Reached through`, the last listing each way the slice reaches the component on its own labelled line.
- decisionTable: a table with the columns `Decision`, `Rung`, `In the slice`, `Shapes` and `Questions`.
- questionItem: the blocking flag in words; for a keyed question, `question.<key>` as a link to its address with a copy action for the full address; its Spec; the text; each present field on its own labelled line; then `Holds: ` and the held members, or nothing for a question that holds none.
- boundaryTable: five columns, Spec, rung, implementation binding, joined members and holds, the joined members listing each relation type with its members.

## Verification — manual

- A person given only the slice page of the first adopter's history-view Pack names the member the most others rest on, the components the Pack's code touches and the outside Specs whose code the Pack builds on, from the page alone.
- The same person, given the slice page of a Pack whose members no code realizes yet, names the components the design will touch through what it rests on, and the members carrying pinned declarations while they state below `defined`.
