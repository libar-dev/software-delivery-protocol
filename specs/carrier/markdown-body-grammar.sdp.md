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

### Open questions
- [non-blocking] The Markdown carrier admits one constraint entry per Spec; the TypeScript model and carrier admit several, and the kind-evidence law reads every entry. The owner's ruling makes one entry the law across carriers. Two reviewers contest it: a `constrainedBy` edge points at one Spec and says nothing about how many entries that Spec holds, and the narrowing would force a Spec with two bounds to promote or bundle them. The revision stays unlanded until that cost is weighed.

## Behavior
- rule: The body opens with one H1 title. Text between the title and the first H2 is the Spec's narrative, and narrative accepts plain paragraphs only.
- rule: Each H2 names one section owner from a closed set of Intent, Behavior, Rule, Workflow, Contract, Example space, Constraints, Model, Design, Decision, UI, and `Verification — manual`, `reviewed`, `contract`, or `executable`, spelled with the em dash. An unrecognized heading is refused, with the nearest known name offered when it lies within edit distance two; an owner appears at most once, and a Spec carries at most one of Behavior, Rule, Workflow, and Contract.
- rule: A section holds optional leading paragraphs and then structured content. Prose after the first list entry, fence, or H3 is refused as unowned. The primary behavior owner, whichever of Behavior, Rule, Workflow, or Contract the Spec uses, and Example space share one description: leading prose may stand under one of them, and prose under both is refused.
- rule: A list entry is one line that starts with a hyphen and a space. A wrapped or indented continuation, a nested list, a star or plus bullet, and an ordered list are refused.
- rule: The refused block shapes are read line by line in narrative, section prose, and list text: a line that opens with a pipe, a block-quote marker, whitespace, a star or plus bullet, an ordered-list marker, or a `<`, and a line that is only a thematic break or a setext underline. A table without outer pipes is prose to the parser.
- rule: Raw HTML is refused in narrative, section prose, and list text, and is not scanned in the H1 title or inside fence steps. The test matches an HTML tag with its closing `>`, a comment delimiter, a declaration, or a processing instruction, so `a < b` and an unclosed `Promise<T` pass. The test ignores matched code spans, as ruled by `spec:carrier.inline-code-spans`.
- rule: The only fences are `gwt` and `gwt-vocabulary`. A fence holds Given steps, exactly one When step, and Then steps in that order, with no blank or indented line, and its slot syntax is `spec:carrier.slot-notation`. An example's Intent owns one `gwt` fence that closes the section. Example space owns optional leading prose, which counts as the shared description above, and then exactly one `gwt-vocabulary` fence, with no list entry or H3.
- rule: Intent accepts `actor`, `problem`, `outcome`, and `value` once each and `risk` and `assumption` repeatedly. One `### Open questions` heading may follow those fields, each of its entries opens with `[blocking]` or `[non-blocking]`, optionally with a lower-camel key after one space and `#` inside the brackets, unique within the Spec, and it is the only H3 any section accepts.
- rule: Behavior entries are keyed `rule` or `flow`. Rule and Contract entries are plain bullets, each one rule. Workflow entries are plain bullets, each one flow, plus keyed `rule` entries. Verification entries are plain criteria.
- rule: A keyed entry is one ASCII word, a colon, and a space before its value. Where a section takes plain bullets, a bullet of that shape is read as a key and refused unless the section names that key, so a plain bullet never opens with a single word and a colon.
- rule: Constraints accept one flat entry of `statement`, `flavor`, `target`, and `measurableBy`, each at most once, with `statement` required and no prose. A second entry is refused by this carrier; whether one entry becomes the law for every carrier is the open question above.
- rule: A Model entry is a bold term, the em dash character with a space on each side, and the definition; a hyphen is refused, terms are unique, and an integer-like term is refused. Decision accepts `context` and `decision` once each and `rationale`, `alternative`, and `consequence` repeatedly.
- rule: Design and UI are open sections. Each entry is a lower-camel ASCII key, unique within its section, and a one-line value; the same key may appear once under Design and once under UI.
- rule: The keys `implemented`, `hasVerifier`, `observed`, `claim`, `deliveryFacts`, `nodeType`, `specKind`, `satisfies`, `verifies`, `belongsTo`, and `models` are refused in every keyed section, under `spec:validation.authored-honesty`. The structural edge names `uses` and `memberOf` are not in that set and pass as ordinary keys.
- rule: A refused construct excludes its whole carrier from the graph, and healthy sibling carriers survive.
- rule: The realizing entrypoints are `parseSectionContent` in `src/extract/markdown-body-content.ts` and the per-owner mappers that `mapOwner` in `src/extract/markdown-body-owners.ts` dispatches to.

## Example space
```gwt-vocabulary
Given a Markdown Spec carrier whose {owner:string} section holds {construct:string}
When the extractor reifies the carrier
Then the carrier is refused whole with the finding {findingId:string} whose message contains {reason:string} at line {line:number}
```
