---
id: spec:consumers.upgrade-kit.rule-key-proposal
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.upgrade-kit
  dependsOn:
    - target: spec:consumers.intent-composition.proposal
      reason: the recipe writes a change proposal in the shape the proposal check reads
    - target: spec:model.rule-keys
      reason: a coined key follows the rule-key grammar and marker
    - target: spec:extraction.entry-locations
      reason: each change names the file and line the location table records for its entry
---
# The rule-key proposal keys every unkeyed rule as a change proposal

A key is the one capability a machine can add without an author's judgment: it addresses a rule and changes nothing the rule says. The proposal coins each key from the words of its rule, so the same corpus gives the same keys, and a person reads and may rename a key before an agent applies the change. A key coined from words is plainer than one an author would choose, which is why it travels as a proposal a person reviews rather than as an edit.

## Intent
- problem: Keying every rule of a large corpus by hand is slow and uneven, and an agent asked to do it in one pass edits carriers with no reviewable record of what it intends.
- outcome: Write one change proposal that adds a key to each unkeyed rule and flow entry in a scope, so an agent applies it after the proposal check and the corpus validates with no error.

## Behavior
- rule: [#proposesKeys] The rule-key proposal, recipe 48, writes one change proposal that adds a key to each unkeyed rule and flow entry in its scope, in the shape the change-proposal contract states, and edits nothing.
- rule: [#keepsText] Each change adds only the key marker to its entry and keeps the entry's text, so keying a rule changes no rule's meaning and no frozen projection's text.
- rule: [#coinedKey] Each key is coined from its entry's text by fixed steps, so the same graph and parameters give the same keys.
- rule: [#uniqueKey] A coined key is lower camel on the rule-key grammar, unique among the rule and flow keys of its Spec, the keys it already carries and the keys coined before it, and never a name the carrier refuses as a key.
- rule: [#unkeyable] An entry whose text yields no word to coin from is listed apart, with its Spec, entry and line, and gets no change; the recipe never invents a key from nothing.
- rule: [#applyAfterCheck] An agent reads the proposal check per change: a change whose scope moved since the named commit goes to a person, and the remaining changes are applied as ordinary carrier edits, so one moved scope never holds back the whole proposal. A person may rename a coined key before it is applied. The proposal check grants no approval and edits nothing; conformance and honesty checks remain the only gate.

## Design
- proposalRecipe: recipe 48, the rule-key proposal, takes `params.commit`, the commit whose graph it reads, required, and at most one scope, `params.pack` or `params.specs`, the whole corpus with neither; a missing commit, both scopes, or an id that does not resolve returns `{ diagnostics: [{ parameter, problem }] }` and no proposal.
- proposalAnswer: `{ scope, totals: { specs, entries, keyed, proposed, unkeyable }, proposal, unkeyable }`, where `scope` is `{ corpus: true }`, `{ pack }` or `{ specs }`, `entries` counts the rule and flow entries in scope, `keyed` those that already carry a key, `proposal` is the change-proposal document, or null when no entry needs a key, and `unkeyable` lists the entries no key could be coined for.
- proposalDocument: `{ "schema": "sdp-proposal/1", "base": "<commit>", "reason": "Key every rule and flow entry in <scope> so a review, a register row or an example can cite it.", "changes": [change] }`, with `<scope>` the Pack id, the Spec ids joined by a comma and a space, or `the corpus`.
- keyChange: `{ "scope": ["<spec id>"], "request": "<request>", "text": "[#<key>] <entry text>", "reason": "Gives the entry the address <spec id>#rule.<key>." }`, one per unkeyed entry, by Spec in scope order, then its rules before its flows, each in authored order; `text` is the entry's text as its carrier writes it once keyed, after its `rule:` or `flow:` label where it has one.
- keyRequest: `Add the key marker [#<key>] and one space at the start of the text of <entry> of <spec id>, at <file> line <line>, after its rule: or flow: label where it has one.`, with `<entry>` the location table's `rule[<i>]` or `flow[<i>]` and `, at <file>` alone when the line is not located.
- keyCoining: decompose the text and drop combining marks; drop the bracketed groups that open it, such as `[extension]`; drop `'s` and `’s`, then any remaining apostrophe; split the rest into words at every character other than an ASCII letter or digit and at each change from a lowercase letter or digit to an uppercase letter; lowercase each word; drop the stop words, unless that leaves no word; drop the leading words that do not open with a letter and every repeat of a word kept before it; join the first three words left in lower camel case, the first all lowercase and each later one with its first letter uppercased.
- stopWords: `a`, `an`, `the`, `and`, `or`, `but`, `nor`, `so`, `then`, `than`, `if`, `when`, `while`, `where`, `of`, `to`, `in`, `on`, `at`, `by`, `for`, `with`, `from`, `into`, `onto`, `as`, `per`, `via`, `over`, `under`, `about`, `is`, `are`, `was`, `were`, `be`, `been`, `being`, `do`, `does`, `did`, `has`, `have`, `had`, `can`, `could`, `may`, `might`, `must`, `shall`, `should`, `will`, `would`, `it`, `its`, `this`, `that`, `these`, `those`, `there`, `their`, `they`, `them`, `which`, `who`, `whom`, `whose`, `what`, `each`, `every`, `any`, `also`, `only` and `own`.
- keyCollision: a coined key already taken in its Spec, or equal to a key the carrier refuses, takes the smallest suffix from `2` up that makes it unique.
- unkeyableRow: `{ spec, entry, file, line, reason: "no word to coin a key from" }`, with `entry` the location table's `rule[<i>]` or `flow[<i>]` and `line` null when not located.

## Example space
```gwt-vocabulary
Given a probe Spec whose unkeyed rules read {rules:string}
When the rule-key proposal runs for it at a commit and the proposal check reads it against the graph of that commit
Then the proposal adds the keys {keys:string}
Then the proposal leaves {unkeyable:number} entries unkeyed
Then the proposal check reports {moved:number} moved changes and {problems:number} schema problems
Then the probe validates with {errors:number} errors once an agent applies the proposal
```
