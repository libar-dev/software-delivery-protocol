---
id: spec:consumers.roadmap.memo
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.roadmap
  dependsOn:
    - target: spec:consumers.intent-composition.proposal.memo
      reason: the memo writes its code spans by the proposal memo's markup rules
    - target: spec:consumers.agent-surface.register-recipes
      reason: the deferred items come from the open-question register
---
# A roadmap renders as the forward section of a pull request description

A pull request description ends with a forward section: the next work in priority order, what waits on the owner, and what is deferred until its trigger. Written by hand, it drifts from the Specs it names and is rewritten each time. The roadmap memo renders it from the roadmap reading at the head of the branch, so the forward section a description carries is the roadmap the graph holds. The memo states what the graph holds and nothing more: it copies each entry's purpose from its own intent and derives its dependency reach, and the owner's reason for an entry's place, the re-entry condition of the next pull request and the durable refused list stay the description author's words around it.

## Intent

- actor: The author of a pull request description, and the owner reading it.
- problem: A description's forward section is written by hand from plan files and recipe answers, so it drifts from the roadmap and the Specs it names.
- outcome: Render a roadmap's entries, what waits on the owner and the deferred questions as Markdown a pull request description carries as its forward section, so the plan a description proposes is the roadmap the graph holds.

## Behavior

- rule: [#memoRecipe] Recipe 55 renders one roadmap's reading, recipe 53's answer for that Pack, as one Markdown memo a pull request description carries as its forward section; the roadmap page shows the same bytes.
- rule: [#sections] The memo holds, in order: the roadmap's title, a line saying what to state and built mean, and its framing; the entries to design, to state and to build, each need in priority order with every entry's place; what waits on the owner; the questions that name no decider; the entries built and still listed; the unresolved members with their original places and ids; and the deferred open questions with their triggers. The to design and to build sections always appear and say when they hold no entry; every other section is left out when it holds no row.
- rule: [#purposeAndReach] An entry's purpose and reach is read, never authored: its intent's problem, or its outcome when it states no problem, then how many Specs outside its scope wait on it and how many of its parts are ready to build now. These values state its purpose and its place in the graph's structure, never why the owner selected the entry or gave it its place; the description's author may state that reason around the memo, and the memo adds no status, date, estimate or assignment to a pull request.
- rule: [#holds] An entry to design names the parts that set its need, its own first, each with its stated next rung and the clauses and dependency targets that hold it, then its blocking questions and its decisions below `ready`; an entry to state names the waiting statements the statement queue puts before its own, inside the entry, elsewhere on the roadmap and outside it, as advice on the order of statements and never as a readiness requirement; an entry to build names each Spec it rests on that is not built.
- rule: [#authorsOwn] The memo derives no reason for the priority and carries no re-entry condition or refused list; the description's author writes those around it.
- rule: [#readingOrderNoted] A memo of a Pack whose order is reading order says so under the framing, so no description presents it as a priority.
- rule: [#deterministic] One graph and one set of parameters render one memo, byte for byte.

## Design

- memoRecipe: recipe 55, the roadmap memo, takes `params.pack` and `params.decider` as recipe 53 does; without `pack` it reads the one Pack whose manifest states `order: priority`, and with none or several it returns `{ diagnostics: [{ parameter, problem }], memo: null }`; otherwise it answers `{ diagnostics: [], memo }`, the memo one string.
- memoHead: the memo opens with the line `## The next work, from the roadmap`, a blank line, the line `Roadmap: ` followed by the Pack's title and its id as a code span, a blank line, the line `To state means the floor allows ready and a person still judges the statement. Built means every Spec of the entry's work states ready and has an implementation binding; it reports no passing test and no deployment.` and a blank line, each paragraph of the framing as authored followed by a blank line, and for a reading-order Pack the line `This Pack's order is reading order, not a stated priority.` and a blank line.
- memoDesign: the section `### To design` holds a table with the columns `Place`, `Entry`, `Next` and `Purpose and reach`; `Next` reads, for at most three of the work rows with the entry's need, the entry's own first and the rest in Spec-id order, the row's id as a code span or `itself` for the entry's own, its stated rung and stated next rung as code spans joined by ` → `, then `held by` and each clause id followed by its targets as code spans in parentheses, or `nothing holds it`; then `and <n> more parts to design` when rows are left out; then `blocked by` and each blocking question's address as a code span, or its Spec id when unkeyed; then `decided by` and each decision below `ready` as a code span with its stated rung; the parts joined by `; `.
- memoState: the section `### To state` holds a table with the columns `Place`, `Entry`, `Earlier waiting statements` and `Purpose and reach`; the third column reads `No preceding waiting statement in the statement queue.` when the entry's `earlierStatements` is empty, and otherwise `in this entry` followed by those inside it as code spans, `on the roadmap` followed by those at another entry as code spans each with `(place <n>)`, and `<n> outside the roadmap`, each part present only when it holds a row and the parts joined by `; `.
- memoBuild: the section `### To build` holds a table with the columns `Place`, `Entry`, `Purpose and reach` and `Rests on`; `Rests on` lists each Spec the entry rests on as a code span with its need, or reads `nothing unbuilt`.
- memoEntry: an `Entry` cell is the entry's title followed by its id as a code span; the `Purpose and reach` cell is the intent line, ending with a full stop when it ends with none, then `Waited on by <n>.` when Specs wait on it and `<n> of its parts ready to build now.` for an entry not to build that has such parts.
- memoWaiting: the section `### Waiting on the <decider>` lists one line per row of recipe 53's `waiting.questions` and `waiting.statements`, questions first and statements in the order the answer gives: a question as its address as a code span, or its Spec id when unkeyed, `(blocking)` when it blocks, `place` and the places, and its text; a statement as `State `, the Spec id as a code span, its stated rung and the rung its floor allows, and the places.
- memoUndecided: the section `### Questions without a decider` opens with the line `These questions have no named decider.` and a blank line, then lists one line per row of recipe 53's `waiting.withoutDecider`: its address as a code span, or its Spec id as a code span followed by `question` and its authored position from 1 when unkeyed, then `(blocking)` when it blocks, `place` and the places; the text stays on the roadmap page, so a corpus with many such questions keeps a short memo.
- memoBuilt: the section `### Built and still on the roadmap` lists each built entry as its place, its title and its id as a code span. The section `### Unresolved members` follows when recipe 53 reports unresolved members, listing each as `- Place <place>: <id>`, the id as a code span.
- memoDeferred: the section `### Deferred, with their triggers` lists each open question recipe 20 marks as a deferral, in the register's order, as its address as a code span, or its Spec id when unkeyed, its text, and `Trigger:` with its trigger.
- memoMarkup: code spans follow the proposal memo's rule; outside code spans, authored `<`, `>` and `&` are written as `&lt;`, `&gt;` and `&amp;`, respectively; other authored text is written verbatim, with each line break written as a space and, inside a table cell, each `|` written `\|`; every line ends with a line feed and the memo with one.
