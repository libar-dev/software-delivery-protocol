---
id: spec:consumers.agent-surface.address-and-cycle-recipes
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface.register-recipes
  dependsOn:
    - spec:decisions.checked-mentions
    - target: spec:consumers.agent-surface.recipe-parameters
      reason: address resolution reads its addresses from params
    - target: spec:model.rule-keys
      reason: a rule address resolves through the Spec's rule keys
---
# Address resolution and dependency cycles stay executable graph recipes

A dependency cycle is data about the authored dependencies. The readiness floor reads each dependency target's stated rung without walking a chain.

## Intent
- problem: An adopter that cites entry addresses outside its Specs resolves each one with its own grammar, and a Spec can rest on itself through a `dependsOn` chain no one has traced.
- outcome: Resolve a list of entry addresses and report every `dependsOn` cycle with catalog recipes, so neither is rebuilt by hand.

## Behavior
- rule: Address resolution reads `params.addresses`, falling back to the catalog sample when absent, and returns one row per input in input order, repeats included; each row carries `address`, `resolves`, `id`, `section`, `key`, `value`, `file`, `line` and `reason`. A resolving row carries the entry text or value and its recorded file and line, null when unlocated, with `reason` null. A miss keeps `id`, `section` and `key` when parsed, keeps `value`, `file` and `line` null, and gives `reason` `malformed` for an input that is no entry address, a bare Spec id included, or `spec`, `section` or `entry` for an absent Spec, section or key; `malformed` carries `expected`, the grammar in one line, and `section` or `entry` carries `available`, the keys that section holds sorted in code-unit order.
- rule: Address resolution follows the checked-mentions address grammar: a `design` or `ui` key resolves as an own key other than `description`, a `question` key resolves when an open question carries it, and a `rule` key resolves through `behavior.ruleKeys` to its rule or flow text; totals count inputs, resolving rows and each miss reason.
- rule: Dependency cycles take no parameter and read the whole graph. They report every set of two or more Specs in which each Spec reaches every other through declared `dependsOn` edges, and every Spec that declares `dependsOn` on itself and belongs to no such set. An edge whose target is not a Spec in the graph is ignored.
- rule: Each reported set lists its members sorted by id in code-unit order and one cycle through it as a closed path that starts and ends at its first member. The cycle is the shortest such path, found by a breadth-first walk from the first member over targets in code-unit order and restricted to the set; a Spec that depends only on itself reports the path of that Spec twice. Sets are ordered by their first member, and the totals count the sets, the self-dependent Specs, and the Specs in any set.
- rule: Both recipes report their answers and never refuse an authored dependency cycle.
