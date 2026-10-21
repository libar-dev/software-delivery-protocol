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

An adopter's gate checks both with copies of these bodies in its own rules file. Each recipe therefore answers with findings beside its rows, so the shipped file runs unchanged as a rules file and a gate keeps no copy. A finding is data: the corpus that names the file as a rules file chooses to fail on it, and the recipe still refuses nothing.

## Intent
- problem: An adopter that cites entry addresses outside its Specs resolves each one with its own grammar, and a Spec can rest on itself through a `dependsOn` chain no one has traced.
- outcome: Resolve a list of entry addresses and report every `dependsOn` cycle with catalog recipes, so neither is rebuilt by hand.

## Behavior
- rule: Address resolution reads `params.addresses`, falling back to the catalog sample when absent, and returns one row per input in input order, repeats included; each row carries `address`, `resolves`, `id`, `section`, `key`, `value`, `file`, `line` and `reason`. A resolving row carries the entry text or value and its recorded file and line, null when unlocated, with `reason` null. A miss keeps `id`, `section` and `key` when parsed, keeps `value`, `file` and `line` null, and gives `reason` `malformed` for an input that is no entry address, a bare Spec id included, or `spec`, `section` or `entry` for an absent Spec, section or key; `malformed` carries `expected`, the grammar in one line, and `section` or `entry` carries `available`, the keys that section holds sorted in code-unit order.
- rule: Address resolution follows the checked-mentions address grammar: a `design` or `ui` key resolves as an own key other than `description`, a `question` key resolves when an open question carries it, and a `rule` key resolves through `behavior.ruleKeys` to its rule or flow text; totals count inputs, resolving rows and each miss reason.
- rule: Dependency cycles take no parameter other than `severity` and read the whole graph. They report every set of two or more Specs in which each Spec reaches every other through declared `dependsOn` edges, and every Spec that declares `dependsOn` on itself and belongs to no such set. An edge whose target is not a Spec in the graph is ignored.
- rule: Each reported set lists its members sorted by id in code-unit order and one cycle through it as a closed path that starts and ends at its first member. The cycle is the shortest such path, found by a breadth-first walk from the first member over targets in code-unit order and restricted to the set; a Spec that depends only on itself reports the path of that Spec twice. Sets are ordered by their first member, and the totals count the sets, the self-dependent Specs, and the Specs in any set.
- rule: Both recipes report their answers and never refuse an authored dependency cycle.
- rule: [#addressFindings] Address resolution answers with `findings` beside its totals and rows: one finding for each row that does not resolve, in input order, the catalog sample's rows included, so the shipped file runs as a rules file over the addresses its `--params` names.
- rule: [#cycleFindings] Dependency cycles answers with `findings` beside its totals and cycles: one finding for each entry of `cycles`, in that order, naming the first member and the closed path through the set.
- rule: [#findingsSeverity] Both recipes take `params.severity`, `"error"` by default or `"warning"`, which every finding they return carries; another value returns `{ diagnostics }` and no findings, which fails the file as a rules file.
- rule: [#answersUnchanged] Apart from `findings`, both answers keep their shapes: the totals, rows and cycles stated above.

## Design
- addressFinding: `{ validatorId: "unresolved-address", subjectId, severity, message }`, where `subjectId` is the input when it is a non-empty string and its JSON text otherwise, and `message` reads `<subjectId> does not resolve: <why>`, `<why>` being `not an entry address`, `no Spec <id>`, `<id> has no <section> entries` or `<id> has no <section> entry <key>` by the row's `reason`.
- cycleFinding: `{ validatorId: "dependency-cycle", subjectId, severity, message, file, line }`, where `subjectId` is the entry's first member, `message` reads `<first member> rests on itself through dependsOn: <cycle>`, `<cycle>` being the entry's closed path joined by ` -> `, `file` is the first member's carrier, and `line` is the line the location table records for its `dependsOn` relation to the path's second id, left out when not located.
- severityDiagnostic: `{ diagnostics: [{ parameter: "severity", problem: "Expected error or warning." }] }` is the whole answer for a `severity` other than `"error"` or `"warning"`.
- answerShapes: address resolution returns `{ totals, rows, findings }` and dependency cycles returns `{ totals, cycles, findings }`; each recipe's accepted names gain `severity`, after its existing ones.

## Example space
```gwt-vocabulary
Given a probe corpus in which {corpus:"two Specs depend on each other through dependsOn"|"one Spec depends on another"}
Given the caller passes the addresses {addresses:string}
When the shipped {recipe:"address resolution"|"dependency cycles"} file runs {invocation:"through sdp q"|"as a rules file named by sdp validate --rules"}
Then the command exits {exitCode:number}
Then the answer carries {findings:number} findings with the rule ids {ruleIds:string}
```
