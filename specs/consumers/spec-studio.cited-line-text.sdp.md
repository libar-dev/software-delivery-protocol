---
id: spec:consumers.spec-studio.cited-line-text
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:extraction.entry-citations
      reason: the words belong to a citation the graph already records by file and line
    - target: spec:consumers.spec-studio.registers
      reason: the declarations page lists each citing line beside its declaration
---
# A pinned declaration shows the words of each test line that cites it

A reader checking a pinned declaration reaches the test line that cites it and then follows a source link to read the assertion. The words of that line would close the task on the page. The graph records where a line cites an entry and never what the line says, and the Studio reads only the graph and its named inputs, so one of them has to hold the words. The extractor already reads the line when it records the citation, which makes the citation row the cheapest honest home; the choice is the owner's, because it puts source text in the graph for the first time.

## Intent

- actor: A reviewer with only a link, checking that a pinned declaration is held to its code.
- problem: The declarations page names each citing line by file and line only, so the reader leaves the page to read it, and has no route at all when the page set carries no source link.
- outcome: Show beside each pinned declaration the text of every test line that cites it, so a reviewer reads the check without leaving the page.

### Open questions

- [blocking #lineText] May the Studio show source text the graph does not hold, and if so is it recorded in the graph beside the citation or read as a named input?
  - decider: owner
  - provisional: the extractor records the citing line's text, trimmed and bounded, on the citation row it already writes, as inferred data that confers nothing, and the Studio reads no source
- [non-blocking #lineBound] How long may a recorded line be, and how does a page show a line that was cut?
  - decider: delegated
  - provisional: a bound of a few hundred code units, cut at a word boundary and marked as cut, the whole line one source link away

## Behavior

- rule: [#lineShown] Beside each citing line, the declarations page and the Spec page show the line's words as code after its file and line, and the reader's citation row carries them.
- rule: [#wordsNotVerdict] The words are what the citing line said at the commit the graph was derived from; no page says the line asserts, checks or passes anything because of them.
- rule: [#withoutWords] A citation whose words are not recorded shows its file and line as it does now.
