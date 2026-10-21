---
id: spec:carrier.markdown-body-grammar
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn:
    - spec:carrier.slot-notation
    - spec:model.spec-sections
    - spec:model.rule-keys
    - spec:model.open-question-fields
    - target: spec:validation.kind-evidence
      reason: its evidence clauses read every constraint entry a Spec carries, whichever carrier wrote it
  constrainedBy: spec:validation.authored-honesty
  decidedBy:
    - spec:decisions.carrier-ruling
    - spec:decisions.prose-ownership
---
# The Markdown body accepts one closed form per section

## Intent
- problem: Without a stated body grammar, an author learns the default carrier by probing refusals and keeps a private copy that drifts when the parser changes.
- outcome: State what each section of a Markdown Spec body accepts and refuses, and name the Spec that owns each field's values, so an author can write a lawful carrier from this Spec and the Specs it depends on.

## Behavior
- rule: The body opens with one H1 title. Text between the title and the first H2 is the Spec's narrative, and narrative accepts plain paragraphs only.
- rule: [#closedOwners] Each H2 names one section owner from a closed set of Intent, Behavior, Rule, Workflow, Contract, Example space, Constraints, Model, Design, Decision, UI, and `Verification — manual`, `reviewed`, `contract`, or `executable`, spelled with the em dash. An unrecognized heading is refused, with the nearest known name offered when it lies within edit distance two; an owner appears at most once, and a Spec carries at most one of Behavior, Rule, Workflow, and Contract.
- rule: [#sectionProse] A section holds optional leading paragraphs and then structured content. Prose after the first list entry, fence, or H3 is refused as unowned. The primary behavior owner, whichever of Behavior, Rule, Workflow, or Contract the Spec uses, and Example space share one description: leading prose may stand under one of them, and prose under both is refused.
- rule: [#oneLineEntries] A list entry is one line that starts with a hyphen and a space. A wrapped or indented continuation, a nested list, a star or plus bullet, and an ordered list are refused, except the field lines an open question may carry, each indented by exactly two spaces directly under its question.
- rule: [#blockShapes] The refused block shapes are read line by line in narrative, section prose, and list text: a line that opens with a pipe, a block-quote marker, whitespace, a star or plus bullet, an ordered-list marker, or a `<`, and a line that is only a thematic break or a setext underline. A table without outer pipes is prose to the parser.
- rule: [#rawHtml] Raw HTML is refused in narrative, section prose, and list text, and is not scanned in the H1 title or inside fence steps. The test matches an HTML tag with its closing `>`, a comment delimiter, a declaration, or a processing instruction, so `a < b` and an unclosed `Promise<T` pass. The test ignores matched code spans, as ruled by `spec:carrier.inline-code-spans`.
- rule: [#closedFences] The only fences are `gwt` and `gwt-vocabulary`. A fence holds Given steps, exactly one When step, and Then steps in that order, with no blank or indented line, and its slot syntax is `spec:carrier.slot-notation`. An example's Intent owns one `gwt` fence that closes the section. Example space owns optional leading prose, which counts as the shared description above, and then exactly one `gwt-vocabulary` fence, with no list entry or H3.
- rule: [#singleH3] Intent accepts `actor`, `problem`, `outcome`, and `value` once each and `risk` and `assumption` repeatedly. One `### Open questions` heading may follow those fields, each of its entries opens with `[blocking]` or `[non-blocking]`, optionally with a lower-camel key after one space and `#` inside the brackets, unique within the Spec, and it is the only H3 any section accepts. Under a question's line may follow its `decider`, `links`, `provisional` and `trigger` fields, one line each and each at most once; their values follow `spec:model.open-question-fields`.
- rule: Behavior entries are keyed `rule` or `flow`. Rule and Contract entries are plain bullets, each one rule. Workflow entries are plain bullets, each one flow, plus keyed `rule` entries. Any entry of the primary behavior owner may open its text, after its label where it has one, with a rule key marker, `[#key]` and a space, and the key follows `spec:model.rule-keys`. Verification entries are plain criteria.
- rule: [#keyedEntryShape] A keyed entry is one ASCII word, a colon, and a space before its value. Where a section takes plain bullets, a bullet of that shape is read as a key and refused unless the section names that key, so a plain bullet never opens with a single word and a colon.
- rule: [#constraintFields] Constraints accept one flat entry of `statement`, `flavor`, `target`, and `measurableBy`, each at most once, with `statement` required and no prose. A second entry is refused by this carrier.
- rule: [#constraintEntryCount] The TypeScript carrier may give one Spec several constraint entries, and the evidence clauses read every entry a Spec carries, whichever carrier wrote it. A `constrainedBy` edge names the constraint Spec whole, whatever its entry count, so a Markdown author with two measurable targets writes two constraint Specs.
- rule: [#modelEntries] A Model entry is a bold term, the em dash character with a space on each side, and the definition; a hyphen is refused, terms are unique, and an integer-like term is refused. Decision accepts `context` and `decision` once each and `rationale`, `alternative`, and `consequence` repeatedly.
- rule: [#openSectionKeys] Design and UI are open sections. Each entry is a lower-camel ASCII key, unique within its section, and a one-line value; the same key may appear once under Design and once under UI.
- rule: The keys `implemented`, `hasVerifier`, `observed`, `claim`, `deliveryFacts`, `nodeType`, `specKind`, `satisfies`, `verifies`, `belongsTo`, and `models` are refused in every keyed section, under `spec:validation.authored-honesty`. In Design and UI, an otherwise lawful lower-camel key outside this set is ordinary content, including `dependsOn`, `references`, `uses` and `memberOf`; it creates no edge. Every closed section still admits only its own fields.
- rule: A refused construct excludes its whole carrier from the graph, and healthy sibling carriers survive.

## Example space
The world writes two Markdown carriers in one extraction root, the refused carrier and a healthy sibling. The sibling is a story-altitude behavior Spec stating `idea`, with no relations and an Intent outcome.

```gwt-vocabulary
Given a Markdown Spec carrier whose {owner:string} section holds {construct:string}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId:string} whose message contains {reason:string} at line {line:number}
Then the healthy sibling {siblingId:string} stays in the graph
```
