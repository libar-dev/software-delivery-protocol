---
id: spec:extraction.entry-citations.test-title-cites-declaration
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:extraction.entry-citations
  verifies:
    target: spec:extraction.entry-citations
    exercises: [anchoredFilesOnly, citationToken, citationRow, readerRows, declarationLines]
---
# A test title in an anchored file cites a pinned declaration

## Intent
- outcome: Execute the citation record on a test file that carries a test anchor and names a pinned declaration's address as a test title.
- assumption: The world writes a probe corpus of one story-altitude behavior Spec stating `idea` with an Intent outcome and one Design entry, `typeOne`, whose value opens with the code span `type One = string`. It writes a test file that carries a constant-form test anchor verifying that Spec and, on the line the step names, calls `test` with the address as its title. It derives the graph, reads the Spec context's entry citations and the row's `resolves`, then runs `sdp validate` on the probe root with `dist/recipes/51-entry-citations.js` named by `--rules`.

```gwt
Given a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}
Given a test file that {anchored: "carries a test anchor"} and names the address {address: "spec:probe.one#design.typeOne"} in a test title on line {line: 9}
When the graph is derived
Then the Spec context lists {citations: 1} entry citations
Then the citation {recorded: "resolves"}
Then the shipped entry-citations file named as a rules file exits {exitCode: 0}
```
