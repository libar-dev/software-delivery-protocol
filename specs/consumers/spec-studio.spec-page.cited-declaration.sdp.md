---
id: spec:consumers.spec-studio.spec-page.cited-declaration
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.spec-page
  verifies:
    target: spec:consumers.spec-studio.spec-page
    exercises: [citations]
---
# A pinned declaration shows the test line that cites it

## Intent
- outcome: Execute the citations beside pinned declarations: a cited declaration lists its citing file and line, and an uncited one says so.
- assumption: The world writes a root with one Spec whose Design section holds two keyed entries, each opening with a code span, and a test file that holds a `specTest` anchor and writes the first entry's address on its twelfth line, in the form the extractor records as a citation; it builds the page set and reads the Spec page under each declaration.

```gwt
Given a Spec with two pinned declarations, the first of which an anchored test file {file: "test/orders.test.ts"} cites at line {line: 12}
When the build renders the Spec's page
Then beside the first declaration the page lists {cited: "test/orders.test.ts:12"}
Then beside the second declaration the page reads {uncited: "no citation recorded"}
```
