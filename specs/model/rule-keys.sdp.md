---
id: spec:model.rule-keys
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:model.spec-sections
  dependsOn:
    - spec:model.open-question-keys
    - target: spec:extraction.entry-locations
      reason: adds rows to the location table
  decidedBy:
    - target: spec:decisions.checked-mentions
      reason: rule addresses join the address law it rules
    - target: spec:decisions.shipped-projections-frozen
      reason: keys stay off the frozen projections, which read the rule text unchanged
---
# A rule or flow entry may carry a key that addresses it

The original design gave a behavior rule an optional id, so the rule could later be promoted to a Spec of its own, and an optional rationale (`docs/lineage/v0-design/01-core-primitives.md` §2.2). The Protocol kept promotion and dropped the id. An unkeyed rule has no address, so a review finding, a register row or an example cannot name it; a key gives it an address. Open questions carry optional keys on the entry-address key grammar; this Spec follows that pattern for rules.

## Intent
- problem: An inline rule has no identity but its position and its text, so anything outside the Spec that cites one rule breaks silently when the rules above it move or the rule is reworded.
- outcome: Let an author key a rule or flow entry, so a review, a register row or an example can name the entry it is about.

## Rule
- Every entry of a Spec's primary behavior owner may carry an optional key on the open-question key grammar: the `rule:` and `flow:` entries of Behavior, the entries of Rule and Contract, and the entries and `rule:` entries of Workflow. One Spec keeps one key namespace across them, unique among its keyed entries, and an unkeyed entry stays lawful and has no address.
- A key sits in a marker at the start of the entry's text, after the `rule:` or `flow:` label where the entry has one, as in `- rule: [#graphOnly] The Studio is a projection.` and `- [#oneFamily] Every validator belongs to one family.`, the shape an open question's marker uses, so one form serves labelled and plain entries.
- Every keyed entry is addressed as `spec:<id>#rule.<key>` whatever its section, because a Spec uses one primary behavior owner. The address resolves while the Spec carries an entry with that key and fails validation in every Spec that names it once the key is renamed or removed.
- A rule address is refused in every id slot, as every entry address is, so no anchor targets a rule and no delivery fact attaches to one.
- An example names the keyed rules it exercises on its `verifies` relation: the target is an object with `target` and `exercises`, a list of the verified Spec's rule keys, beside an optional `reason`. A key the verified Spec does not carry is a conformance error at the relation, as a missing entry address is. The list mints no edge and confers no delivery fact, so `verifies` stays whole-Spec, and a rule-coverage recipe reads it to report which keyed rules a bound example exercises and which none does.
- A keyed entry carries its key and its text and nothing else; why a rule holds is the Spec's narrative, or a decision Spec named through `decidedBy` when the why passes the ADR three-part test.
- A keyed rule promoted to a Spec of its own leaves its address behind, because promotion moves the content out, and every mention of that address fails until it names the new Spec.

## Design

- keyMarker: `[#<key>]` and one space open the entry's text, after `rule: ` or `flow: ` where the entry has a label, with the key on the open-question key grammar, `^[a-z][A-Za-z0-9]*$`; text that opens with `[#` and does not match is refused at its line, and a marker later in the text is plain text.
- ruleKeysField: `behavior.rules` and `behavior.flows` are lists of strings with the marker removed, and `behavior.ruleKeys` maps each key to the entry it names, `rules[<i>]` or `flows[<i>]`, in authored order; a Spec with no keyed entry carries no `ruleKeys`, and the frozen projections read the rule text unchanged.
- carrierSpelling: the TypeScript carrier writes the same marker at the start of a rule or flow string, and the Gherkin carrier at the start of a `Rule:` line's text, so one normalization after reification reads all three carriers.
- duplicateKey: a key repeated across one Spec's rules and flows is a conformance error at each site, as a repeated question key is.
- ruleLocations: the location table records every rule and flow entry, keyed or not, as `rule[<i>]` or `flow[<i>]` with `key` beside a keyed entry, from each carrier that records its line.
- exercisesValidator: `conformance/rule-exercises`, a conformance error for an off-contract `exercises` list or a rule key absent from the verified Spec.
- exercisesAttribute: `verifies: { target: <spec id>, exercises: [<key>] }`, with an optional `reason`, is lawful on a declared `verifies` only; the graph's declared `verifies` edge carries `exercises` in authored order, an anchored `verifies` from a test anchor carries none, and `exercises` on any other relation type is refused.
- gherkinExercises: `@exercises.<key>` on an ordinary Scenario names a rule of the Spec the Scenario verifies, by default its Feature, once per key; a Scenario that verifies more than one Spec and exercises a rule is authored in Markdown.
- ruleCoverage: recipe 34, rule coverage, takes `params.spec` or `params.pack` and returns `{ totals: { keyedRules, exercised, unexercised, unkeyedRules }, rows }`, one row per keyed rule `{ address, line, exercisedBy: [{ example, enabled }] }`, with an empty `exercisedBy` for a rule no example exercises.
- ruleAddress: `spec:<id>#rule.<key>` resolves through `ruleKeys`; address resolution (recipe 25) reads `rule` as a fourth section and returns the entry's text, file and line, and entry search (recipe 23) matches rule keys as it matches Design keys.
