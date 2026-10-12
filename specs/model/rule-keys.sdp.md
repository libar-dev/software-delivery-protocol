---
id: spec:model.rule-keys
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:model.spec-sections
  dependsOn: spec:model.open-question-keys
---
# A rule or flow entry may carry a key that addresses it

The original design gave a behavior rule an optional id, so the rule could later be promoted to a Spec of its own, and an optional rationale (`docs/lineage/v0-design/01-core-primitives.md` §2.2). The Protocol kept promotion and dropped the id. An inline rule has no key and no address, so a review finding, a register row or an example cannot name the rule it is about, and the Spec Studio's tests lens cannot name the rules no example exercises until a rule gains an address. Open questions gained optional keys on the Design key grammar; this Spec follows that pattern for rules.

## Intent
- problem: An inline rule has no identity but its position and its text, so anything outside the Spec that cites one rule breaks silently when the rules above it move or the rule is reworded.
- outcome: Let an author key a rule or flow entry, so a review, a register row or an example can name the entry it is about.

### Open questions
- [non-blocking #exampleNamesRule] Should an example name the rule it exercises, and where: in its prose, or in a field a rule-coverage view could read?
- [non-blocking #ruleRationale] Does a rule keep the original's rationale, or is the rationale prose the Spec's narrative already owns?

## Rule
- Every entry of a Spec's primary behavior owner may carry an optional key on the open-question key grammar: the `rule:` and `flow:` entries of Behavior, the entries of Rule and Contract, and the entries and `rule:` entries of Workflow. One Spec keeps one key namespace across them, unique among its keyed entries, and an unkeyed entry stays lawful and has no address.
- A key sits in a marker at the start of the entry's text, after the `rule:` or `flow:` label where the entry has one, as in `- rule: [#graphOnly] The Studio is a projection.` and `- [#oneFamily] Every validator belongs to one family.`, the shape an open question's marker uses, so one form serves labelled and plain entries.
- Every keyed entry is addressed as `spec:<id>#rule.<key>` whatever its section, because a Spec uses one primary behavior owner. The address resolves while the Spec carries an entry with that key and fails validation in every Spec that names it once the key is renamed or removed.
- A rule address is refused in every id slot, as every entry address is, so no anchor targets a rule and no delivery fact attaches to one.
- A keyed rule promoted to a Spec of its own leaves its address behind, because promotion moves the content out, and every mention of that address fails until it names the new Spec.
