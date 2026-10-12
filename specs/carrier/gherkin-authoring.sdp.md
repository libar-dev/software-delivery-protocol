---
id: spec:carrier.gherkin-authoring
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  decidedBy:
    - spec:decisions.gherkin-carrier-option
    - spec:decisions.carrier-universality
    - spec:decisions.sdp-gherkin-extension
    - spec:decisions.prose-ownership
    - spec:decisions.pack-markdown-carrier
  dependsOn:
    - spec:carrier.slot-notation
    - spec:model.rule-keys
---
# Gherkin authoring enters the one graph

## Intent
- outcome: Author behavior and example Specs in Gherkin without creating a second graph or execution path.

## Behavior
- rule: One `.sdp.gherkin` file carries exactly one behavior Spec as its Feature and zero or more example Specs as ordinary Scenarios, with one canonical carrier surface per Spec ID.
- rule: A `.sdp.gherkin` file uses Gherkin's English dialect, by default or under `# language: en`; any other `# language:` header refuses the file at that line with `extract/gherkin-grammar`.
- rule: [#identityTags] A Feature and each ordinary Scenario carry exactly one `@spec.<dotted-id>` tag, with the Spec id's `spec:` prefix omitted, one `@altitude.<value>` tag taking `epic`, `feature` or `story`, and one `@readiness.<value>` tag taking `idea`, `scoped`, `defined` or `ready`.
- rule: Kind is structural: a Feature carries a `behavior` Spec and an ordinary Scenario carries an `example` Spec; Pack membership stays manifest-owned.
- rule: [#kindBound] A `.sdp.gherkin` carrier holds only `behavior` and `example` Specs; the Markdown and TypeScript carriers remain lawful for the other kinds, under `spec:decisions.carrier-universality`.
- rule: [#relationTags] A relation tag is a head, a dot and a full Spec id, as in `@depends-on.spec:carrier.slot-notation`, and the heads `@refines.`, `@depends-on.`, `@constrained-by.`, `@decided-by.` and `@verifies.` declare `refines`, `dependsOn`, `constrainedBy`, `decidedBy` and `verifies`; an ordinary Scenario defaults `refines` and `verifies` to its Feature unless it explicitly declares that relation type.
- rule: `@exercises.<key>` on an ordinary Scenario names a rule key of the Spec it verifies, and it and a Rule title key follow `spec:model.rule-keys`; `@kind.`, `@pack`, `@pack.` and `@supersedes.` are refused.
- rule: A tag whose head, compared case-insensitively, is `implemented`, `has-verifier`, `hasVerifier`, `observed`, `claim`, `status`, `lifecycle`, `workflow` or `architect`, followed by the end of the tag, `.` or `-`, is refused, so the carrier authors no delivery fact, claim, lifecycle state or workflow status.
- rule: [#decorationTags] A tag whose head has a unique nearest reserved head, within one edit of a reserved head of at most five letters or two edits of a longer one, is refused, and the refusal suggests that head only when its suggested form is lawful; every other tag, `@wip` included, is decoration and authors no graph state.
- rule: [#descriptionKeys] A keyed Feature or ordinary Scenario description line has the form `- <key>: <value>` with a nonempty value; `actor`, `problem`, `outcome`, `value` and `description` occur at most once and populate Intent, `risk` and `assumption` repeat in Intent, `criterion` repeats in Verification, and `verification-mode` occurs at most once with `manual`, `reviewed`, `contract` or `executable`.
- rule: An unknown description key or a heading-shaped description line is refused at its physical source line, despite blanks and comments; remaining non-heading prose is narrative, lawful only as free prose on the typed prose owners named by the prose-ownership decision, `spec:decisions.prose-ownership`, and never a new field or a parser within a parser.
- rule: The carrier has no form for open questions, their fields, or a relation reason; a Spec that needs one is authored in Markdown.
- rule: Trailing title-only Rule blocks populate behavior rules in source order, and a Rule title may open with a rule key marker, `[#key]` and a space; a Rule carrying tags, description, or positionally nested children is refused.
- rule: At most one `@example-space` pseudo-scenario supplies the parent vocabulary without producing a Spec node, while each ordinary Scenario supplies exactly one bound example point.
- rule: An ordinary Scenario and an `@example-space` pseudo-scenario must each carry at least one step; a step-less Scenario is refused at its Scenario line without inventing a complete-GWT rule.
- rule: Gherkin steps reuse the Protocol-owned slot notation; conjunctions inherit the preceding phase, and outlines, backgrounds, star steps, doc strings, data tables, and leading conjunctions are refused.
- rule: Independent semantic Gherkin findings accumulate in physical source order up to a hard cap of 100; any semantic finding excludes the entire invalid carrier from the graph while healthy sibling files survive.
- rule: Gherkin is a canonical authoring carrier rather than a Cucumber execution path; generated contracts and resolving code-side anchors remain the execution and delivery-fact boundary.
- rule: Markdown remains the default Spec carrier; a default flip to Gherkin is refused before full honest round-trip exists.
- rule: Packs follow the Pack syntax ruling, `spec:decisions.pack-markdown-carrier`; this carrier neither admits a Gherkin Pack surface nor reopens the Pack Markdown envelope.
- rule: Universality is a generated Gherkin-shaped read projection of any Spec, never an authored `.sdp.gherkin` in an authored tree and never round-trip parity.

## Design
- reservedTagHeads: the reserved heads are `spec`, `altitude`, `readiness`, `refines`, `depends-on`, `constrained-by`, `decided-by`, `verifies`, `exercises`, `kind`, `pack`, `supersedes` and `example-space`; the near-miss refusal measures a tag head against them.

## Example space
```gwt-vocabulary
Given the Gherkin fixture corpus {probe:string}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount:number} findings
Then validation reports {findingCount:number} findings
Then the first finding is {findingId:string} at line {line:number}
Then the first finding message contains {messageText:string}
Then the report contains finding {findingId:string}
Then the graph contains exactly {specCount:number} Specs
Then the graph contains the Spec {specId:string} with kind {specKind:"behavior"|"example"}
Then the graph contains the child Spec {childId:string} with kind {specKind:"behavior"|"example"}
Then the child Spec {childId:string} declares {relationType:string} to {relationTarget:string}
Then the child Spec {childId:string} declares the additional relation {relationType:string} to {relationTarget:string}
Then the graph omits the Spec {absentId:string}
Then no graph edge names the absent Spec {absentId:string}
Then the parent example space contains {spaceStep:string}
Then the graph for {parityLeft:string} equals the graph for {parityRight:string}
Then the contracts for {parityLeft:string} equal the contracts for {parityRight:string}
```
