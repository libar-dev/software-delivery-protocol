---
id: spec:consumers.spec-studio.index-page
kind: behavior
altitude: story
readiness: idea
relations:
  refines:
    target: spec:consumers.spec-studio.lenses
    reason: the index is where the Packs lens lands
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.spec-studio.shell
    - spec:consumers.derived-readiness-banner
    - spec:consumers.binding-language-views
---
# The index says where the corpus stands and narrows every Spec

A reader of a large design needs two ways in: by the task they came to do and by a word they remember. The index gives the first and links to search for the second, opens with a summary the build counts, and replaces one long table with a list a person narrows.

## Intent
- outcome: Give a person one landing page that says where the corpus stands, routes them by task, lists every Pack with its members, and narrows every Spec by the coordinates and bindings they ask about.

## Behavior
- rule: [#summary] The page opens with a summary the build counts from reader values, each count in a sentence: the Specs and Packs; the Specs at each stated rung; the Specs stated above their floor; the open and blocking questions; the Specs with an implementation binding and with a verifier binding; and the findings by severity.
- rule: [#taskRoutes] A short list then routes by task, in fixed words that quote nothing from the corpus: read a Pack's design, find a Spec, entry or file by a word, narrow the Specs, and read the findings; each route links to its place in the page set.
- rule: [#packsLens] The Packs section lists every Pack in id order with its title and its members in authored order, each member with its stated rung beside its floor; it draws no capability tree.
- rule: [#specRows] The Specs section lists every Spec in id order, one row each: its title and id, kind and altitude, stated rung beside the floor reached, implementation binding and verifier binding as present or none, open and blocking questions, and its Packs.
- rule: [#filters] Filters narrow the Specs section by kind, altitude, stated rung, floor reached, implementation binding, verifier binding and Pack; each filter takes one value or any, the filters combine, and the section says how many of its rows it shows. Without script every row shows.
- rule: [#findings] The findings section lists the validation report's findings in its order, each with its severity in words, its validator id, its subject when it has one, linked to its page when it is a Spec or a Pack and as text otherwise, its message, and its recorded file and line as text.

## UI
- summary: a short list of sentences under the page title, each with a count.
- taskRoutes: four links under a `Start here` heading: Read a Pack's design, Find a Spec, entry or file by a word, Narrow the Specs, Read the findings.
- packList: one closed disclosure per Pack, its summary line the Pack's title, id and member count, its body the members in authored order as links with their rung badges.
- specRow: one line per Spec: the title linked to its page, the id as code, the rung badge, then as plain text the kind, altitude, floor in words, the two binding values, the question counts and the Packs; the line wraps on a narrow screen.
- filterBar: one labelled select per filter above the Specs, each listing any and the values the rows hold, and a line saying how many of all rows show.
- sectionIds: the Packs, Specs and findings sections carry the element ids `packs`, `specs` and `findings`, which the top navigation, the rail and the task routes link to.
- findingsList: one line per finding, the severity word first.
