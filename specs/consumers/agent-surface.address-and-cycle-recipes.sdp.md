---
id: spec:consumers.agent-surface.address-and-cycle-recipes
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.register-recipes
  dependsOn: spec:decisions.checked-mentions
---
# Address checks and dependency cycles stay executable graph recipes

## Intent
- problem: An adopter that cites entry addresses outside its Specs resolves each one with its own grammar and its own lookup, and no recipe reports a cycle in `dependsOn`, so a Spec can rest on itself through a chain no one has traced.
- outcome: Resolve a list of entry addresses and report every `dependsOn` cycle with catalog recipes, so neither is rebuilt by hand.

## Behavior
- rule: Address resolution takes a list of entry addresses on its opening line and returns one row per input, in input order, repeats included. Each row carries `address`, `resolves`, `id`, `section`, `key`, and `reason`. A resolving row carries the Spec id, the section `design`, `ui`, or `question`, the key, and `reason: null`. A row that does not resolve carries `id`, `section`, and `key` as null and one reason: `"malformed"` for an input that is not an entry address, a bare Spec id included, `"spec"` for an address whose Spec is absent, and `"entry"` for an address whose Spec holds no such entry.
- rule: Address resolution reads the address grammar and the resolution rule of the checked-mentions record: a `design` or `ui` key resolves as an own key of that section other than `description`, and a `question` key resolves when one of the Spec's open questions carries it. Its totals count the inputs, the resolving rows, and each reason.
- rule: Dependency cycles take no parameter and read the whole graph. They report every set of two or more Specs in which each Spec reaches every other through declared `dependsOn` edges, and every Spec that declares `dependsOn` on itself and belongs to no such set. An edge whose target is not a Spec in the graph is ignored.
- rule: Each reported set lists its members sorted by id in code-unit order and one cycle through it as a closed path that starts and ends at its first member. The cycle is the shortest such path, found by a breadth-first walk from the first member over targets in code-unit order and restricted to the set; a Spec that depends only on itself reports the path of that Spec twice. Sets are ordered by their first member, and the totals count the sets, the self-dependent Specs, and the Specs in any set.
- rule: Both recipes report and never refuse: a cycle is data about the authored dependencies, as a structural cycle is, and the readiness floor reads each `dependsOn` target's stated rung without walking a chain.
