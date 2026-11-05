---
id: spec:model.anchors.markdown-deliverable
kind: behavior
altitude: story
readiness: idea
relations:
  refines:
    target: spec:model.anchors
    reason: the question is whether the anchor model reaches a Markdown file
---
# An anchor for a Markdown deliverable

The extractor reads anchors only from `.ts` and `.tsx` files, so a Markdown deliverable such as a shipped skill or a handbook binds through the document-realization binding: the suite that asserts the document carries the code anchor. The graph never names the Markdown file itself, so a change to it impacts no Spec and reports as coverage-unknown.

## Intent

- outcome: Let a Markdown deliverable, such as a shipped skill or a handbook, carry its own anchor, so the graph names the file and changed-file impact reaches the Specs it realizes.

### Open questions
- [blocking #markdownAnchor] Should a Markdown deliverable carry an anchor the extractor reads, and in what form?
  - decider: owner
  - provisional: keep the document-realization binding, with the Markdown file coverage-unknown in changed-file impact
  - links: spec:model.anchors
  - trigger: an adopter or a reviewer needs changed-file impact for a Markdown deliverable, such as an edit to a shipped skill reaching the on-ramp Spec it realizes

## Behavior
