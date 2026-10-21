---
id: spec:carrier.step-keys
kind: rule
altitude: story
readiness: defined
relations:
  refines:
    target: spec:carrier.slot-notation
    reason: a key joins the step text the notation reads, ahead of its slots
  decidedBy:
    target: spec:decisions.shipped-projections-frozen
    reason: keys stay off the frozen projections, which read the step text unchanged
---
# An example step may carry a key that survives rewording

A bound test names each step it handles. A step's name in its generated contract is its skeleton, the step text with each slot reduced to its name, so rewording a step renames it and fails every test bound to it: the typecheck names the handler that no longer matches. That is the right default for a step whose words are its meaning, and the wrong one when an author improves the wording of a step that many examples and tests share. A step key separates the two. An author keys a step once, in the vocabulary its sibling examples share, and the key, not the wording, names the step in the contract and in the test. The key serves the build and the test, not prose: nothing outside an example and its test cites a single step, so the address grammar gains no step segment.

## Intent
- problem: A test binds each step of an example by the step's text, so improving the wording of a step breaks every test bound to it, though nothing the step means has changed.
- outcome: Let an example step carry a key in a marker, so its contract key and the binding a test holds survive a change of wording, in the Markdown and Gherkin carriers alike.

## Rule
- [#stepMarker] A step may open its text with a step key marker, `[#key]` and one space, after its keyword: in a line of a `gwt` or `gwt-vocabulary` fence, in a step of a `.sdp.gherkin` Scenario or `@example-space` pseudo-scenario, and at the start of a step string in the TypeScript carrier. The key is lower-camel ASCII, the grammar every marker key follows, and an unkeyed step stays lawful.
- The marker is carrier syntax: the graph holds the step text without it and records the key apart, so the slot notation, the skeleton, the vocabulary match, the bound point, the readiness floor and the frozen projections read the step text unchanged.
- [#markerRefusals] Step text that opens with `[#` and does not continue as a marker is refused at its step; a marker later in the text is plain text.
- [#oneKeyOneStep] Within one Spec a key names one step and a step carries one key, a step being one skeleton: a key on two skeletons, or two keys on one skeleton, is refused at each step that carries one. A step written more than once needs its marker once and may repeat it. An example space belongs to one Spec, so its keys are unique across the space and the sibling set that binds it. A refused Markdown or Gherkin carrier is refused whole, as for every structure refusal; in the TypeScript carrier the key drops at each site and the Spec stays.
- [#vocabularyHome] A sibling set shares its parent's vocabulary, and so its keys: an example step that resolves to a step of its parent's example space takes that step's key. A marker on such a step must repeat that key; any other marker, or a marker where the vocabulary step has none, withholds the example's step contract. An example step that no parent's example space declares takes its key from its own marker.
- [#contractKey] A step's contract key is its key when it has one and its skeleton otherwise, as `spec:extraction.executable-contracts` derives it. The contract key names the step in the generated contract, the handler a test binds to it, and, for a Then step of an example space, the `kind` of its outcome.
- A key names the step and its slots name the step's parameters: the handler bound under a key receives the step's bound values, typed by the vocabulary as an unkeyed handler's are, and a key never names a slot.
- [#rewordedStaysBound] Rewording a keyed step, in the vocabulary and in every example that uses it, leaves its contract key unchanged, so the handler and the oracle bound to it compile and run as before. Renaming or retyping one of its slots changes its parameters and breaks the binding, as it always has.
- [#unkeyedBreaks] An unkeyed step is keyed by its skeleton, as it always was: rewording it changes its contract key, so a handler bound to the old text fails the typecheck as a missing and an excess property and fails the run at that step.
- [#renamedKey] Renaming or removing a key changes the step's contract key, and every handler and oracle bound under the old key fails as for a reworded unkeyed step; a key changes only when an author changes it.
- A step key is not an entry address: the address grammar gains no step segment, prose cites no step, and the location table records none. The generated contract and the code bound to it are a key's only readers, and the typechecker holds them to it; a review that cites one step cites its example Spec and the rules that example exercises.
- A step key mints no edge, confers no delivery fact and moves no readiness floor.

## Example space
The world writes one extraction root holding a parent probe Spec and one child example in the carrier the slot names. The parent is a story-altitude behavior Spec stating `scoped`, with an Intent outcome, one rule and an example space whose Given steps are the steps the vocabulary slot joins with a semicolon and a space, followed by `When the probe runs` and `Then the probe ends with {result:string}`. The child is an example stating `scoped` that refines and verifies the parent, whose Given steps are the steps the example slot joins the same way, followed by `When the probe runs` and `Then the probe ends with {result: "done"}`. In Markdown the two are separate carriers; in Gherkin they are the Feature and one Scenario of one `.sdp.gherkin` file, with the vocabulary in its `@example-space` pseudo-scenario. The world extracts the root and generates the contracts, replaces every occurrence of the before text with the after text in the step lines of both carriers as written, markers included, and extracts and generates again. A finding read is the first extraction finding of the first run, or the first contract-generation finding of the first run that names the child, and an empty slot value means the run reports none. A binding key is the key the child's step contract gives its first Given step, in the first run and then in the second, and an empty string when no step contract is emitted for the child. The handlers bound to the first contract cover the second when both contracts hold the same contract keys and each step keeps its parameter names.

```gwt-vocabulary
Given the {carrier:"Markdown"|"Gherkin"} carriers of a parent whose example space declares the Given steps {vocabulary:string}
Given a child example of that parent whose Given steps read {example:string}
When the contracts are generated, the step lines are reworded by replacing {before:string} with {after:string}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage:string}
Then the first contract finding about the child is {contractFinding:string}
Then the child contract binds its first Given step as {bindingKey:string} and then as {rewordedBindingKey:string}
Then the handlers bound to the first contract cover the second: {stillBound:boolean}
```

## Design
- stepMarker: `<keyword> [#<key>] <text>` is a keyed step in a `gwt` or `gwt-vocabulary` fence line and in a `.sdp.gherkin` step, with `<keyword>` one of `Given`, `When`, `Then` and `And`, and `"[#<key>] <text>"` is a keyed TypeScript step string; `<key>` matches `^[a-z][A-Za-z0-9]*$`.
- stepKeysField: `behavior.stepKeys` maps each key to the skeleton of the step it names, in authored order, the example space's steps before the examples' steps; the step strings hold the text with the marker removed; a Spec with no keyed step carries no `stepKeys`, and the serialized graph writes it after `exampleSpace`.
- markerRefusal: `step key markers must be [#<lower-camel ASCII key>] followed by one space and text` is the message, as the finding `extract/unrecognized-property` at severity error.
- keyOnTwoSteps: `step key "<key>" names two steps; a step key names one step within a Spec` is the message, as the same finding, at each step that carries the key.
- twoKeysOnStep: `step "<skeleton>" carries two step keys; a step carries one key within a Spec` is the message, as the same finding, at each step of that skeleton that carries a key.
- stepPath: a step refusal's path is `behavior.exampleSpace.<phase>[<i>]` or `behavior.examples[<n>].<phase>[<i>]`, with `<phase>` one of `given`, `when` and `then` and each index counting from 0; the finding carries the step's source line where its carrier reports one and the Spec's line otherwise.
- conflictingKey: `contracts/conflicting-step-key` is the contract-generation warning for an example marker that disagrees with its vocabulary step; it names the example, the step's skeleton, the marker's key and the vocabulary step's key or none, and the example's step contract and registrar are withheld.
- importEmitter: the TypeScript-to-Markdown import writes `[#<key>] ` at the start of every step of the Spec whose skeleton `stepKeys` maps the key to, so a keyed TypeScript Spec imports keyed.
- keyedBinding: `bindExample(contract, () => world, { cartSize: (world, { items }) => { … }, "the probe runs": (world) => { … } })` binds a keyed step by its key beside an unkeyed step bound by its skeleton.
