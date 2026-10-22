---
id: spec:consumers.spec-studio.registers
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.spec-studio.shell
    - target: spec:consumers.agent-surface.register-recipes
      reason: the questions page renders the open-question register
    - target: spec:consumers.agent-surface.design-recipes
      reason: the decisions page renders the decision register
    - target: spec:extraction.contract-declarations
      reason: the declarations page lists the pinned declarations recipe 24 reads
    - target: spec:extraction.entry-citations
      reason: each declaration shows the source lines that cite its address
---
# The corpus's registers are pages a reviewer opens from a link

A large design keeps registers, and each is a catalog recipe an agent runs. Four become pages, so a reviewer with only a link reads the same rows: the open questions and the decisions, which the owner works through; the pinned declarations, each with the source lines that cite it, which is where a reader finds the test that checks a declaration; and the design backlog, the Specs designed and not yet built, which a design ahead of its code is mostly made of. The key-family register stays a recipe: its rows depend on key prefixes a corpus chooses, the Studio takes no corpus configuration, and search already finds a coined key.

## Intent
- outcome: Let a person read every open question, decision, pinned declaration and designed-but-unbuilt Spec of the corpus on one page each, linked to the entries they name.

## Behavior
- rule: [#registerPages] The page set holds four register pages, each rendering one catalog recipe's answer over the whole corpus: `questions.html` the open-question register, recipe 20; `decisions.html` the decision register, recipe 31; `declarations.html` the pinned declarations, recipe 24, with the entry citations of recipe 51 beside them; and `backlog.html` the design backlog, recipe 33.
- rule: [#noKeyFamilyPage] The key-family register, recipe 41, has no page.
- rule: [#questionsPage] The questions page lists the Specs with a blocking question first and then the rest, each in id order with its stated rung, and under each its questions in authored order: the blocking flag in words, the address linked to the question on the Spec page with a copy action when the question is keyed, the text, and its decider, links, provisional reading and trigger when present, a question with a trigger named a deferral.
- rule: [#decisionsPage] The decisions page lists one row per decision in id order: its title linked, its id, its stated rung, the decisions it supersedes and that supersede it, the decisions it refines and that refine it with the reasons its relations state, the Specs it shapes with their count, and its keyed questions linked; a superseded decision reads superseded in words.
- rule: [#declarationsPage] The declarations page lists the pinned declarations grouped by Spec in id order, each with its key linked to the entry on the Spec page, the declaration as code, and every source line recipe 51 records citing the entry's address, as file and line with a copy action, or `no citation recorded`.
- rule: [#backlogPage] The backlog page lists recipe 33's rows in id order: the Spec linked, its kind and altitude, its floor reached, the clauses that hold it below its stated next rung, its design columns as counts, and the units that reference it; a sentence names how many examples and decisions the recipe leaves out.
- rule: [#registerFilters] The questions page filters by blocking flag, decider, deferral and Pack, and the declarations page by whether a citation is recorded; without script every row shows.
- rule: [#statesNothing] A register page lists and links in its recipe's order; it states no rung, verdict or priority of its own.
- rule: [#registerTotals] Each register page opens with its recipe's totals as sentences, each opening with its count.

## UI
- questionRow: the blocking flag in words, `question.<key>` as a link with a copy action for the full address when keyed, the text, then each present field on its own labelled line, `deferral` written beside a question with a trigger.
- decisionRow: the title linked, the id as code, the rung badge, then labelled lines for Supersedes, Superseded by, Refines, Refined by, Shapes and Questions, each listing ids as links and an empty line reading None, and the reasons under the relations they belong to.
- declarationRow: the key as a link, the declaration in a code block, then `Cited at` and each citing file and line with a copy action, or `no citation recorded`.
- backlogRow: the title linked, the id as code, then as plain text the kind, altitude, floor in words, the unmet clauses by id, `<e> entries, <d> declarations, <q> open, <b> blocking`, and the referencing units by id.

## Example space
```gwt-vocabulary
Given a Spec {blockingSpec:string} with a blocking open question and a Spec {otherSpec:string}, before it in id order, with only a non-blocking one
When the build renders the questions page
Then the page lists {first:string} first
```
