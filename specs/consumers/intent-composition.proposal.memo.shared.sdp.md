---
id: spec:consumers.intent-composition.proposal.memo.shared
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.intent-composition.proposal.memo
  verifies:
    target: spec:consumers.intent-composition.proposal.memo
    exercises: [memo]
---
# Recipe 49 and the composing panel write one memo for one proposal

## Intent
- outcome: Execute the shared memo: the recipe and the panel render the same bytes, the memo carries the document, and a fence outgrows the backticks it holds.
- assumption: The world writes a proposal document with a base, a reason and the stated number of changes, the first scoped to one entry address with exact text that holds the stated run of backticks, and the second declaring a relation; it runs recipe 49's shipped body with the document as `proposal`, calls the composing panel's memo function on the same document, compares the two strings, parses the last fenced block's content as JSON and compares it with the document, and measures the fence around the first change's text.

```gwt
Given a change proposal with {changes: 2} changes, one whose exact text holds a run of {ticks: 3} backticks
When recipe 49 renders its memo and the composing panel renders its memo
Then the two memos are byte-identical: {identical: true}
Then the memo ends with the proposal as JSON in a fenced block: {carriesDocument: true}
Then the fence around that exact text is {fence: 4} backticks long
```
