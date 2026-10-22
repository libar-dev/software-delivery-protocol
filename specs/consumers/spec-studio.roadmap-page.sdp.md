---
id: spec:consumers.spec-studio.roadmap-page
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.spec-studio.shell
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
- rule: [#roadmapSummary] Each roadmap's section opens with its title linked to its Pack page, its framing, and sentences the build counts from the answer: the entries in each lane and listed apart, the questions waiting on the owner, blocking and not, and the statements waiting, with a link to the owner queue.
- rule: [#board] A board follows: four columns, to design, to state, to build and built, each headed by its lane and its count and listing its entries in place order, each as its place and its title linked to the entry's row below; an empty column reads `none`.
- rule: [#laneLists] Four lists follow in the same order, each keeping the roadmap's order and numbering each entry by its place, so a gap in the numbers shows an entry in another lane; an empty list says no entry is in that lane.
- rule: [#entryRow] Each entry shows its place and title, its kind and altitude, its stated rung and the rung its floor reaches, and its work by lane with any drift; opened, it shows its Spec linked, its stated next rung with the clauses that hold it or `nothing blocks`, the parts to build now linked, its blocking questions linked to their Spec pages, its decisions below `ready` with their blocking questions, what it rests on, what waits on it, its other Packs and the entries it shares Specs with.
- rule: [#restsOnShown] Among what an entry rests on, the Specs to design, the Specs on the roadmap and the Specs that hold a `ready` statement show first, each with its relation, its lane and its place on the roadmap or `outside the roadmap`; the rest fold under one line that counts them.
- rule: [#waitingList] After the lists, the page lists what waits on the owner, recipe 53's `waiting`: each question with its blocking flag, its address linked to the question on its Spec page with a copy action, its text and its provisional reading when present, and each waiting statement with its stated rung and the rung its floor allows, each row linking the entries it touches.
- rule: [#apartList] The entries listed apart follow the lists, each with its place, kind, stated rung and lane.
- rule: [#forwardSection] Each roadmap ends with a disclosure holding recipe 55's memo as preformatted text with a copy action, so a description's author pastes the forward section the graph holds.
- rule: [#laneFilter] A filter narrows the lists by lane; without script every row shows.
- rule: [#statesNothing] The page orders by the roadmap's places and links: it states no rung, approves nothing, and never presents a place as a date, a deadline or permission to start.

## UI

- boardColumn: a column headed `To design`, `To state`, `To build` or `Built` with its count, listing `<place>` and the title as a link to `#entry-<place>`; the four columns sit side by side at desktop width and stack at phone width.
- entryRow: a disclosure whose summary reads `<place>. <title>` on its first line and, on its second, the kind and altitude, the stated rung as a badge, `floor <rung>`, and the work as `<n> Specs:` followed by the nonzero counts of `to design`, `to state`, `to build` and `built`, then `<d> drift` when present; its element id is `entry-<place>`.
- entryFields: labelled lines Id, Next, Build now, Blocked by, Decided by, Rests on, Waited on by, Also in and Shares Specs with, an empty line left out.
- restsOnItem: the Spec linked, its relation in words, its lane, `holds ready` when it states below `defined`, and `entry <place>` linked to that row or `outside the roadmap`.
- memoDisclosure: a disclosure whose summary reads `The forward section, as Markdown`, holding a copy action and the memo in a `pre` element.
