---
id: spec:carrier.markdown-body-grammar
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn: spec:carrier.slot-notation
  decidedBy:
    - spec:decisions.carrier-ruling
    - spec:decisions.prose-ownership
---
# The Markdown body accepts one closed form per section

## Intent
- problem: The default carrier's body grammar is stated only in parser source, so an author learns it by probing refusals and keeps a private copy that drifts when the parser changes.
- outcome: State what each section of a Markdown Spec body accepts and refuses, so an author can write a lawful carrier from this Spec alone.

## Behavior
- rule: The body opens with one H1 title. Text between the title and the first H2 is the Spec's narrative, and narrative accepts plain paragraphs only.
- rule: Each H2 names one section owner from a closed set of Intent, Behavior, Rule, Workflow, Contract, Example space, Constraints, Model, Design, Decision, UI, and Verification with its mode. An unrecognized heading is refused with the nearest known name, an owner appears at most once, and a Spec carries at most one of Behavior, Rule, Workflow, and Contract.
- rule: A section holds optional leading paragraphs and then structured content. Prose after the first list entry, fence, or H3 is refused as unowned.
- rule: A list entry is one line that starts with a hyphen and a space. A wrapped or indented continuation, a nested list, a star or plus bullet, and an ordered list are refused.
- rule: Tables, block quotes, thematic breaks, and setext underlines are refused wherever they appear.
- rule: Raw HTML is refused wherever it appears. The test reads a `<` followed by a letter, a slash, a bang, or a question mark, so a bare comparison such as `a < b` passes. Whether the test reads inside a code span is ruled by `spec:carrier.inline-code-spans`.
- rule: The only fences are `gwt` and `gwt-vocabulary`. A fence holds Given steps, exactly one When step, and Then steps in that order, with no blank or indented line, and its slot syntax is `spec:carrier.slot-notation`. An example's Intent owns one `gwt` fence that closes the section, and Example space owns exactly one `gwt-vocabulary` fence and nothing else.
- rule: Intent accepts `actor`, `problem`, `outcome`, and `value` once each and `risk` and `assumption` repeatedly. One `### Open questions` heading may follow those fields, each of its entries opens with `[blocking]` or `[non-blocking]`, and it is the only H3 any section accepts.
- rule: Behavior entries are keyed `rule` or `flow`. Rule and Contract entries are plain bullets, each one rule. Workflow entries are plain bullets, each one flow, plus keyed `rule` entries. Verification entries are plain criteria.
- rule: A keyed entry is one ASCII word, a colon, and a space before its value. Where a section takes plain bullets, a bullet of that shape is read as a key and refused unless the section names that key, so a plain bullet never opens with a single word and a colon.
- rule: Constraints accept one flat entry of `statement`, `flavor`, `target`, and `measurableBy`, each at most once, with `statement` required and no prose. One entry per Spec is the law, because a `constrainedBy` edge points at one constraint; the list shape of the TypeScript model aligns to it.
- rule: Model entries are a bold term, a dash, and its definition, with unique terms. Decision accepts `context` and `decision` once each and `rationale`, `alternative`, and `consequence` repeatedly.
- rule: Design and UI are open sections. Each entry is a unique lower-camel ASCII key and a one-line value.
- rule: A key that names a delivery fact, a claim, or a derived relation is refused in every keyed section. That law belongs to `spec:validation.authored-honesty`.
- rule: A refused construct excludes its whole carrier from the graph, and healthy sibling carriers survive.
- rule: The realizing entrypoints are `parseSectionContent` in `src/extract/markdown-body-content.ts` and the per-owner mappers that `mapOwner` in `src/extract/markdown-body-owners.ts` dispatches to.

## Example space
```gwt-vocabulary
Given a Markdown Spec carrier whose {owner:string} section holds {construct:string}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId:string} whose message contains {reason:string}
```
