---
id: spec:consumers.spec-studio.search
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.spec-studio.shell
  dependsOn:
    - spec:consumers.spec-studio.data
    - target: spec:consumers.reader
      reason: the page matches with the reader's concept matching
---
# Search finds a Spec, a Pack, an entry or a bound file by a word

The first adopter asked to search entry keys, pinned declarations and file paths. A Spec's envelope holds no tags, so search reads what the graph holds: the fields concept search reads, which already include every pinned declaration, plus the keys authors coin and the files the graph records. The page matches with the reader's own code, so a term finds on the page what `findByConcept` finds through `sdp q`.

## Intent
- outcome: Let a person find a Spec, a Pack, a keyed entry or the code bound at a file by a word they remember of it, from any page and with no request.

## Behavior
- rule: [#oneMatcher] Search matches with the reader's concept matching, one implementation the package exports without Node dependencies and the page script bundles, so over the fields `findByConcept` reads, the page returns the nodes it returns, in its order.
- rule: [#addedFields] Search also matches the keys authors coin, Design and UI keys, open question keys and rule keys, and a node's recorded file path; a node matched only through these follows every node `findByConcept` matches, in id order. It indexes nothing else.
- rule: A term matches where it appears in a field, without regard to case, as `findByConcept` matches; an empty term matches nothing.
- rule: [#searchPage] The search field on any page opens the search page with the term in its fragment, `search.html#q=<term>`; the search page matches as the person types and keeps the term in its fragment, so a search is a link.
- rule: [#resultShape] Each result names its node type in words. A Spec result shows its title, id, kind, and stated rung beside the floor reached, and opens its page; a Pack result shows its title and id and opens its page, with no readiness; an Anchor or CodeNode result shows its id, label, and recorded file and line as text with a copy action, and links each Spec its edges reach, with the edge type.
- rule: [#entryHits] Under a Spec result, the page lists the Spec's entries the term matches, as `spec:consumers.spec-studio.data#design.searchEntry` states, in the index's order, each with its section, key and recorded line, linked to the entry's element id on the Spec page when it has an entry address, and otherwise to its section's element id, or to the narrative's.
- rule: The page shows fifty results at a time, with a control that shows the next fifty.
- rule: The search page reads only the index it embeds; it fetches nothing and joins nothing.

## UI
- searchField: a labelled text field and a Search button in the top navigation of every page.
- resultsHeader: the term, how many nodes and entries match, and the fields searched.
- resultCard: one card per node, in result order: its node type in words, title and id, the fields that matched, and the Spec's rungs or the unit's location as the result rule states; then its entry hits.
- entryHit: one line per entry: its section, its key as code, its recorded line, and the text around the term, shortened.
- noMatch: `No node matches` and the term, then the fields searched.
- needsScript: without script, the search page says that search needs it and links to the index.
