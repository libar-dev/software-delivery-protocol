---
id: spec:consumers.spec-studio.roadmap-page
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    - spec:consumers.spec-studio
    - target: spec:consumers.roadmap
      reason: the page is the roadmap's reading for a person
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.spec-studio.shell
    - target: spec:consumers.spec-studio.publisher
      reason: an entry's element id carries the name the page set gives its roadmap's Pack page
    - target: spec:consumers.roadmap
      reason: the page renders the roadmap reading
    - target: spec:consumers.roadmap.memo
      reason: the page carries the roadmap memo for a description's author to copy
---
# The roadmap page shows the upcoming work in priority order, split by what it needs

The owner reads a roadmap to choose what the next pull requests take up, and a reviewer reads it to see where an arc stands. The page shows each roadmap at a glance as a board, its entries in the column of what each needs next, and then each entry with what holds it. It ends with the forward section a pull request description carries, ready to copy. The page orders by the owner's places and links; it states nothing.

## Intent

- actor: The owner choosing the next work, and a reviewer with only a link.
- problem: No page shows what comes next in priority order, so the owner reads it from the last pull request description, and a reviewer cannot tell which upcoming work needs design, a statement or a build.
- outcome: Give the Studio a page that shows each roadmap in its priority order, with what to design, what to state, what to build and what is built, and for each entry what it lacks.

## Behavior

- rule: [#roadmapPage] The page set holds `roadmap.html`, which renders recipe 53 over every Pack whose manifest states `order: priority`, one section per roadmap in id order, each ending with recipe 55's memo for that Pack.
- rule: [#noRoadmap] With no such Pack, the page says the corpus states no roadmap and that a Pack becomes one when its manifest states `order: priority`.
- rule: [#roadmapSummary] Each roadmap's section opens with its title linked to its Pack page, its framing, and sentences the build counts from the answer: the entries with each need and those listed apart, said to be in priority order only when the answer's `order` is `priority` and in authored reading order otherwise; the questions waiting on the owner, blocking and not, and those that name no decider; and the statements waiting, with a link to the owner queue.
- rule: [#board] A board follows: four columns, to design, to state, to build and built, each headed by its need and its count and listing its entries in place order, each as its place and its title linked to the entry's row below; an empty column reads `none`.
- rule: [#readingLegend] Beside the board, a legend reads `To state means the floor allows ready and a person still judges the statement. Built means every Spec of the entry's work states ready and has an implementation binding; it reports no passing test and no deployment. The entry's own readiness is shown separately.`
- rule: [#needLists] Four lists follow in the same order, each keeping the roadmap's order and numbering each entry by its place, so a gap in the numbers shows an entry with another need; an empty list says no entry has that need.
- rule: [#entryRow] Each entry shows its place and title, its kind and altitude, its stated rung and the rung its floor reaches, and its work by need with any drift; opened, it shows its Spec linked, its stated next rung with the clauses that hold it or `nothing blocks`, the parts with its need, each linked with its rungs and what holds its next rung, its own labelled `itself`, with its other parts folded under one line that counts them, the parts to build now linked, its blocking questions linked to their Spec pages, its decisions below `ready` with their blocking questions, what it rests on with the parts that reach it, what waits on it, for an entry to state the waiting statements the statement queue puts before its own, its other Packs and the entries it shares Specs with.
- rule: [#restsOnShown] Among what an entry rests on, the Specs to design, the Specs on the roadmap and the Specs that hold a `ready` statement show first, each with its relation, its need and its place on the roadmap or `outside the roadmap`; the rest fold under one line that counts them.
- rule: [#waitingList] After the lists, the page lists what waits on the owner, recipe 53's `waiting`: each question with its blocking flag, its address linked to the question on its Spec page with a copy action, its text and its provisional reading when present, and each waiting statement with its stated rung and the rung its floor allows, in the order the answer gives, each row linking the entries it touches. The questions that name no decider follow under the sentence `These questions have no named decider.`, apart from the owner's.
- rule: [#apartList] The entries listed apart follow the lists, each with its place, kind, stated rung and need.
- rule: [#forwardSection] Each roadmap ends with a disclosure holding recipe 55's memo as preformatted text with a copy action, so a description's author pastes the forward section the graph holds.
- rule: [#needFilter] A filter narrows the lists by need; without script every row shows.
- rule: [#statesNothing] The page orders by the roadmap's places and links: it states no rung, approves nothing, and never presents a place as a date, a deadline or permission to start.

## UI

- boardColumn: a column headed `To design`, `To state`, `To build` or `Built` with its count, listing `<place>` and the title as a link to the entry's element id; the four columns sit side by side at desktop width and stack at phone width.
- entryRow: a disclosure whose summary reads `<place>. <title>` on its first line and, on its second, the kind and altitude, the stated rung as a badge, `floor <rung>`, and the work as `<n> Specs:` followed by the nonzero counts of `to design`, `to state`, `to build` and `built`, then `<d> drift` when present; its element id is `roadmap-<name>-entry-<place>`, `<name>` the name the page set gives the roadmap's Pack page, and every link to an entry, from the board, a rests-on row, the waiting list or a shared-Specs line, uses the owning roadmap's prefix, so two roadmaps on the page never share an id.
- entryFields: labelled lines Id, Next, Parts, Build now, Blocked by, Decided by, Rests on, Waited on by, Earlier statements, Also in and Shares Specs with, an empty line left out; Parts appears when the entry has more than one part or a part other than itself sets its need.
- restsOnItem: the Spec linked, its relation in words, followed by `from` and the parts that reach it when any part other than the entry itself does, its need, `holds ready` when it states below `defined`, and `entry <place>` linked to that row or `outside the roadmap`.
- memoDisclosure: a disclosure whose summary reads `The forward section, as Markdown`, holding a copy action and the memo in a `pre` element.
