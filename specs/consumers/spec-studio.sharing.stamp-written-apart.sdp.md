---
id: spec:consumers.spec-studio.sharing.stamp-written-apart
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.sharing
  verifies:
    target: spec:consumers.spec-studio.sharing
    exercises: [buildWritesNoStamp, stampVerb, stampLifetime]
---
# The stamp is written beside the page set, and a later build removes it

## Intent
- outcome: Execute the stamp step apart from the build: it touches no page, and no stamp outlives its build.
- assumption: The world writes a root with one Pack of two member Specs, runs the studio command, keeps the bytes of every page file, runs the stamp command, reads `stamp.json` and compares the page files with the kept bytes, then runs the studio command again and checks whether `stamp.json` exists.

```gwt
Given a page set the studio command wrote at an extraction root
When the stamp command runs with the commit {commit: "0123abc"} and the source template {source: "https://example.test/blob/0123abc/{file}#L{line}"}
Then the stamp names the corpus commit {corpusCommit: "0123abc"}
Then every page file stays byte-identical: {pagesUntouched: true}
Then a later studio run keeps the stamp: {stampSurvives: false}
```
