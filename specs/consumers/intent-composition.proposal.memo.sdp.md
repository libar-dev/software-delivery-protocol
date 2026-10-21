---
id: spec:consumers.intent-composition.proposal.memo
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.intent-composition.proposal
---
# Recipe 49 renders a change proposal as the Markdown memo a person reviews

A person reviews a proposed change as text, not as JSON beside the proposal check's rows. The memo is a rendering of the proposal document and never a second source of it: it ends with the document itself, so one paste hands an agent everything the person reviewed. Recipe 49 renders it, and the Studio's composing panel writes the same bytes, so a person, a reviewer and an agent read one text.

## Intent
- outcome: Render a change proposal as one Markdown memo, the same bytes from the recipe and from the Studio's composing panel, that a person reviews and hands to an agent whole.

## Contract
- [#memo] Recipe 49 renders a proposal as the Markdown memo a person reviews and hands off, ending with the document itself, and the Studio's composing panel, `spec:consumers.spec-studio.intent-panel`, writes the same bytes for the same document, so a person, a reviewer and an agent read one text.

## Design
- memoRecipe: recipe 49, the proposal memo, takes `params.proposal` and returns `{ schemaProblems: [{ path, problem }], memo }`: the schema problems recipe 38 reports for the same document and, when there are none, the memo as one string, otherwise `memo: null`; it reads no graph value, so one document renders one memo in any corpus.
- memoHead: the memo opens with the line `# Change proposal`, a blank line, the line `Base: ` followed by the base as a code span, the line `Reason: ` followed by the reason, and a blank line.
- memoChange: each change follows in document order as the line `## Change <n>`, counting from 1, and a blank line, then each on its own line: `Scope: ` followed by the scope items as code spans joined by `, `; `Request:` followed by a blank line and the request in a fenced block whose info string is `text`; when present, `Replaces: ` or `Follows: ` followed by the address as a code span; `Relation: ` followed by the action, the source as a code span, the relation type and the target as a code span, separated by single spaces; and `Reason: ` followed by the change's reason; then, when the change carries exact text, a blank line and the text in a fenced block with no info string; then a blank line.
- memoDocument: the memo ends with the line `## The proposal`, a blank line, and the document in a fenced block whose info string is `json`, written as `JSON.stringify` writes it with two-space indentation and the keys in the order the document holds them.
- memoMarkup: a code span uses a backtick run one longer than the longest run its content holds, padded with a space on each side when the content starts or ends with a backtick; a fence is a backtick run one longer than the longest run its content holds and at least three long; each request and each change's exact text is enclosed in a fence longer than any backtick run it holds, so a request cannot open HTML, add a heading or close its fence; every value is written verbatim; every line ends with a line feed and the memo with one.

## Example space
```gwt-vocabulary
Given a change proposal with {changes:number} changes, one whose exact text holds a run of {ticks:number} backticks
When recipe 49 renders its memo and the composing panel renders its memo
Then the two memos are byte-identical: {identical:boolean}
Then the memo ends with the proposal as JSON in a fenced block: {carriesDocument:boolean}
Then the fence around that exact text is {fence:number} backticks long
```
