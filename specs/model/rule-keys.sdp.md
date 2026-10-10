---
id: spec:model.rule-keys
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:model.spec-sections
  dependsOn: spec:model.open-question-keys
---
# A behavior rule may carry a key that addresses it

The original design gave a behavior rule an optional id, so the rule could later be promoted to a Spec of its own, and an optional rationale (`docs/lineage/v0-design/01-core-primitives.md` §2.2). The Protocol kept promotion and dropped the id. An inline rule has no key and no address, so a review finding, a register row or an example cannot name the rule it is about, and the Spec Studio's tests lens cannot name the rules no example exercises until a rule gains an address. Open questions gained optional keys on the Design key grammar; this Spec follows that pattern for rules.

## Intent
- problem: An inline rule has no identity but its position and its text, so anything outside the Spec that cites one rule breaks silently when the rules above it move or the rule is reworded.
- outcome: Let an author key a behavior rule, so a review, a register row or an example can name the rule it is about.

### Open questions
- [blocking #ruleKeyMarker] Where does the key sit in the Markdown carrier: before the colon of a `rule:` entry, in a marker like an open question's, or elsewhere? The Rule, Contract and Workflow sections hold plain entries with no `rule:` prefix, so one form has to serve both.
- [blocking #keyedSections] Which entries take a key: the `rule:` entries of Behavior only, or also the plain entries of Rule, Contract and Workflow, and the `flow:` entries?
- [non-blocking #exampleNamesRule] Should an example name the rule it exercises, and where: in its prose, or in a field a rule-coverage view could read?
- [non-blocking #ruleRationale] Does a rule keep the original's rationale, or is the rationale prose the Spec's narrative already owns?

## Rule
- A behavior rule may carry an optional key on the open-question key grammar, unique among the keyed rules of one Spec, and an unkeyed rule stays lawful and has no address.
- A keyed rule is addressed as `spec:<id>#rule.<key>`, which resolves while the Spec carries a rule with that key and fails validation in every Spec that names it once the key is renamed or removed.
- A rule address is refused in every id slot, as every entry address is, so no anchor targets a rule and no delivery fact attaches to one.
- A keyed rule promoted to a Spec of its own leaves its address behind, because promotion moves the content out, and every mention of that address fails until it names the new Spec.
