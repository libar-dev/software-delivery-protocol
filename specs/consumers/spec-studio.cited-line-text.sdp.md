---
id: spec:consumers.spec-studio.cited-line-text
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.spec-studio
---
# A pinned declaration shows the words of each test line that cites it

A reader checking a pinned declaration reaches the test line that cites it and then follows a source link to read the assertion. The words of that line would close the task on the page.

## Intent

- outcome: Show beside each pinned declaration the text of every test line that cites it, so a reviewer reads the check without leaving the page.

### Open questions

- [blocking #lineText] May the Studio show source text the graph does not hold, and if so is it recorded in the graph beside the citation or read as a named input?
  - decider: owner
