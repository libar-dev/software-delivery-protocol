---
id: spec:consumers.spec-studio.slice-page
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    - spec:consumers.spec-studio
    - target: spec:consumers.design-slice
      reason: the page is the design slice's reading for a person
  dependsOn:
    - target: spec:consumers.design-slice
      reason: the page renders the slice's answer
    - target: spec:consumers.spec-studio.data.recipe-answers
      reason: the build evaluates the slice recipe once for each Pack, and the page reads that answer
    - target: spec:consumers.spec-studio.pack-page
      reason: each member links to its card on the Pack page, whose element id is the member's id
    - target: spec:consumers.spec-studio.diagram-kinds.dependency
      reason: the dependency drawing given the slice's order is a drawing kind, which owns layout, folding and the text equivalent
    - target: spec:consumers.spec-studio.diagram-kinds.scoped-architecture
      reason: the scoped architecture drawing is a drawing kind, which owns layout, folding and the text equivalent
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
- rule: [#summary] The summary states each slice total in one sentence that opens with its count: the members and the examples counted in their parents; the relations among members, the deepest depth and any cycle; the members held below their stated next rung and those waiting only for their author; the outside Specs the slice rests on, how many of them hold a member, and the outside Specs that rest on it; the components touched, through the members' code, through what the slice rests on, and named by member designs, with the outside components shown beside them; the member component designs, how many are realized and how many of those match; the decisions in scope and how many state below `ready`; and the open and blocking questions.
- rule: [#readingNote] The reading note says in words that members read with the ones others rest on first, that the design columns count what each member carries beside its rung and never judge whether it is enough, and that the page records no review and approves nothing.
- rule: [#dependencyDrawing] Under `How the members rest on each other` comes the slice's dependency drawing, `spec:consumers.spec-studio.diagram-kinds.dependency` given the slice's order: it consumes the answer's members, depths, rests-on links, structure edges, cycles and boundary rows and recomputes no scope, depth or order. Each member that is not a folded example is a box with its title, id, stated rung and floor, and its count of folded example members; every supplied relation keeps its type and direction, and a relation that orders nothing reads apart from one that orders. The drawing kind owns layout, bounded folding and the complete text equivalent, which lists every folded example with its `refines`; a fold changes no value of the answer.
- rule: [#memberTable] Under `What each member needs next` comes one row per member that is not a folded example, by depth and then in the scope's order: the member's title linked to its card on the Pack page with its id, its depth, its stated rung beside the floor reached, its stated next rung with `nothing blocks` or each unmet clause and the Specs it names with their stated rungs, then the design it carries, its rules with how many are keyed, its design entries, pinned declarations, open questions with how many block, decisions, and verifying examples with how many are bound, each count on its own line, and its implementation and reference bindings as counts; the table has no total row, and no count is combined with another.
- rule: [#exampleRows] A folded example member has no row of its own and stays readable in a disclosure within its parent's row, whose summary counts the folded examples and how many are held below their stated next rung; inside, each example shows its title linked to its card on the Pack page, its id, its own stated rung, floor reached and stated next rung with each unmet clause and the Specs it names. Folding lends the parent no rung, hold or binding, and the folded count stays apart from the count of examples that verify the parent.
- rule: [#architecture] Under `The architecture it touches` comes the scoped architecture drawing of the diagram kinds, given the answer's components, designs, uses, planned uses and outside components, then one row per touched component: its id linked to its detail on the architecture lens; its label, layer and context; and how the slice reaches it, the members whose code satisfies it, the members whose code references it, the Specs the slice rests on whose code it holds, and the member designs naming it, each on its own line in words.
- rule: [#designs] After the component rows comes one row per member component design: the design linked to its Spec page, the component it names, the layer, context, role and uses it declares, whether an anchor holds that component and whether that anchor satisfies the design, in words, and its differing rows with the declared and anchored values side by side and its unreadable rows; a declared value and an anchored value never share a cell.
- rule: [#outside] Then come the components outside the slice, each with how it is reached and whether an anchor holds it, under a heading that says they are shown for context and not counted as touched.
- rule: [#unplaced] After them come the units that implement or reference a member and belong to no component, reading None when empty.
- rule: [#noArchitecture] A slice that touches no component and holds no component design says so in one sentence and names, by count, the Specs it rests on that no code satisfies, so an empty architecture never reads as an architecture nobody needs.
- rule: [#decisions] Under `Decisions in scope` comes one row per decision: its title linked to its Spec page, its stated rung beside the floor reached, whether it is a member, the members it shapes, the decisions it refines or supersedes, and its open and blocking question counts.
- rule: [#questions] Under `Open questions in scope` comes each question, blocking ones first, with its blocking flag in words, its address linked to the question on its Spec page when it is keyed, its Spec, its text, its decider, links, provisional reading and trigger when present, and the members it holds.
- rule: [#boundary] Under `Where the slice meets the rest` come four closed sections, Rests on, Rested on by, Verified by and Superseded by, each headed with its count; a Rests on row shows the outside Spec linked, its stated rung beside the floor reached, its implementation binding as present or none, the members it joins under each relation type, and the members it holds.
- rule: [#bindingWords] The page speaks binding language: a unit implements or references a member, a verifier is bound, and no cell reads built, done, verified or approved.
- rule: [#openAll] `Open all` and `Close all` open or close every closed section and text equivalent at once, and the page reads in full without script.

## UI

- pagePath: `slices/<name>.html`, `<name>` formed from the Pack id as `packs/<name>.html` forms it, so the Pack page and its slice page share a name.
- headerBlock: the page heading `Design slice: <Pack title>`; below it the Pack id with a copy action and the link `Read the Pack member by member` to its Pack page; then the summary under `The design as a whole`, then the reading note.
- readingNoteText: `Members read with the ones others rest on first. The columns count the design each member carries beside its rung; they never judge whether it is enough. This page records no review and approves nothing.`
- drawingIds: Both drawings take the Pack id as their subject and use their drawing kind's element-id contract. The dependency text and arrow ids are `diagram.<pack id>.dependencies.text` and `diagram.<pack id>.dependencies.arrow`; scoped architecture uses `diagram.<pack id>.architecture.text` and `diagram.<pack id>.architecture.arrow`. The kinds also own viewport, source, fold and occurrence suffixes; the page invents no singular dependency or scoped-architecture alias.
- memberTable: a table in a scroll region with the columns `Member`, `Depth`, `Rung`, `Next rung`, `Design carried` and `Code`, so it fits a desktop column without scrolling; `Member` holds the title link, the id and the kind; `Rung` the rung badge and `floor <rung>`; `Design carried` six lines, `<n> rules, <k> keyed`, `<n> entries`, `<n> declarations`, `<n> questions, <b> blocking`, `<n> decisions` and `<bound> of <n> verifying examples bound`, each count a plain number, a zero written `0`, and a zero part such as `, 0 keyed` left out; `Code` two lines, `<n> implementing` and `<n> referencing`. Below the phone breakpoint each member reads as a stacked block: its title, id and kind, its rung badge and floor, and its next rung with each unmet clause stay together at the top, and its depth, design counts and binding counts follow as labelled runs that wrap; no part of a member sits beyond a horizontal scroll.
- foldedExamples: a row under the parent's row spanning the table, holding a closed disclosure whose summary reads `<n> example members folded in`, followed by `, <h> held below the next rung` when any is held; inside, one line per example with its title link, its id, its rung badge, `floor <rung>` and `next <rung>:` with `nothing blocks` or each unmet clause.
- componentTable: a table with the columns `Component`, `Layer and context` and `Reached through`, the last listing each way the slice reaches the component on its own labelled line.
- designTable: a table with the columns `Design`, `Component`, `Declared`, `Anchor` and `Comparison`; `Declared` one labelled line per key, `not stated` for a key the design leaves out; `Anchor` reads `absent`, `present, does not satisfy the design` or `satisfies the design`; `Comparison` reads `not compared` for a design no anchor satisfies, `matches` for a realized design with no differing or unreadable row, and otherwise one line per differing field as `<field>: declared <value>; anchored <value>`, a `uses` line reading `uses: only declared <components>; only anchored <components>` as the comparison names them, and one line per unreadable key as `<key>: unreadable <value>, not compared`.
- outsideList: a list headed `Outside the slice, shown for context and not counted as touched`, each component with its id, linked when anchored, its label, `anchored` or `not anchored`, and how it is reached in words.
- decisionTable: a table with the columns `Decision`, `Rung`, `In the slice`, `Shapes` and `Questions`.
- questionItem: the blocking flag in words; for a keyed question, `question.<key>` as a link to its address with a copy action for the full address; its Spec; the text; each present field on its own labelled line; then `Holds: ` and the held members, or nothing for a question that holds none.
- boundaryTable: five columns, Spec, rung, implementation binding, joined members and holds, the joined members listing each relation type with its members.

## Verification — manual

- A person given only the slice page of the first adopter's history-view Pack names the member the most others rest on, the components the Pack's code touches and the outside Specs whose code the Pack builds on, from the page alone.
- The same person, given the slice page of a Pack whose members no code realizes yet, names the components the design will touch through what it rests on, and the members carrying pinned declarations while they state below `defined`.
- The same person, given the slice page of a Pack holding member component designs, says for each design whether code realizes it and where its declared values differ from the anchored ones, and reads no declared value as anchored.
- The same person, given the same page on a phone, names each member's stated next rung and what holds it without scrolling sideways, including an example member folded into its parent.
