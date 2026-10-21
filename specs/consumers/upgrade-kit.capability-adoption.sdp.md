---
id: spec:consumers.upgrade-kit.capability-adoption
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.upgrade-kit
  dependsOn:
    - target: spec:model.rule-keys
      reason: rule keys and `exercises` are two of the capabilities it counts
    - target: spec:model.open-question-fields
      reason: question keys and fields are counted where open questions are
    - target: spec:model.relation-reasons
      reason: relation reasons are counted where authored relations are
    - target: spec:model.planned-architecture
      reason: component designs are selected by the convention that Spec states
    - target: spec:extraction.contract-declarations
      reason: pinned declarations are counted where keyed Design entries are
    - target: spec:extraction.entry-citations
      reason: a pinned declaration counts as cited when an anchored line cites it
    - target: spec:model.open-question-keys
      reason: question keys are counted where open questions are
    - target: spec:carrier.step-keys
      reason: step keys are counted where example steps are
    - target: spec:model.term-addresses
      reason: term keys are counted where Model terms are
    - target: spec:consumers.review-perspectives
      reason: perspectives are counted from the objects the caller passes
---
# Capability adoption counts where each capability is used and where it could apply

## Intent
- problem: An adopter learns which authoring capabilities its corpus uses, and where each could apply, only by writing a query per capability.
- outcome: Report, for the whole corpus, each Pack and each Spec, how many places use each capability and how many places it could apply, from the graph alone.

## Behavior
- rule: [#capabilityRows] Capability adoption, recipe 47, reports one row per capability with the places that use it and the places it could apply, counted from the graph, each row naming the Spec that carries the capability's law.
- rule: [#corpusTotals] Beside the rows it reports the corpus's size and its readiness statements: Specs, Packs, examples, decisions, anchored component units, the Specs stated `ready` and the Specs whose floor allows `ready`.
- rule: [#perPackAndSpec] It sums each capability's places over each Pack's members and, on request, reports each Spec's own places, so an adopter sees where each capability could apply.
- rule: [#outsideTheGraph] A capability the graph does not hold, such as the perspectives a corpus keeps as files, is counted only from data the caller passes, and its row reads null otherwise; the recipe reads no file.
- rule: [#countsOnly] A count is a place a capability could apply, never a score, a ranking or a finding, and the answer carries no findings.

## Design
- adoptionRecipe: recipe 47, capability adoption, takes `params.detail`, `false` by default, `true` for every Spec row or a list of Spec ids for those rows, and `params.perspectives`, the list of perspective objects the corpus keeps, absent by default; another `detail` value returns `{ diagnostics: [{ parameter, problem }] }`.
- adoptionAnswer: `{ totals, capabilities, packs, specs, leftOut }`, where `totals` is `{ specs, packs, examples, decisions, componentUnits, statedReady, floorReady }`, `capabilities` holds one row per capability in the order below, `packs` one row per Pack in id order, `specs` the Spec rows `detail` asks for, empty by default, and `leftOut` names what `detail: true` adds whenever Spec rows are left out.
- capabilityRow: `{ capability, inUse, applicable, carriedBy }`, where `inUse` counts the places that use the capability, `applicable` the places it could apply, and `carriedBy` is the id of the Spec that carries its law; a count the graph cannot give is null.
- capabilityList: each row as `capability` (`carriedBy`): places used, of places it could apply. `ruleKeys` (`spec:model.rule-keys`): rule and flow entries that carry a key, of all rule and flow entries; `questionKeys` (`spec:model.open-question-keys`): open questions that carry a key, of all open questions; `questionFields` (`spec:model.open-question-fields`): open questions that carry `decider`, `links`, `provisional` or `trigger`, of all open questions; `relationReasons` (`spec:model.relation-reasons`): authored relations that carry a reason, of all authored relations; `exercises` (`spec:model.rule-keys`): declared `verifies` edges from an example that carry `exercises`, of all such edges; `pinnedDeclarations` (`spec:extraction.contract-declarations`): keyed Design entries whose value opens with a code span, of every keyed Design entry other than `description`; `componentDesigns` (`spec:model.planned-architecture`): component design Specs, of anchored component units; `stepKeys` (`spec:carrier.step-keys`): keyed example steps, of all example steps; `termKeys` (`spec:model.term-addresses`): keyed Model terms, of all Model terms; `entryCitations` (`spec:extraction.entry-citations`): pinned declarations an anchored line cites, of all pinned declarations; `perspectives` (`spec:consumers.review-perspectives`): the perspective objects passed, of null.
- packRow: `{ id, members, capabilities }`, where `capabilities` maps each capability but `componentDesigns` and `perspectives` to `{ inUse, applicable }` summed over the Pack's resolving members.
- specRow: `{ id, packs, inUse, couldApply }`, where `inUse` maps each capability the Spec uses to its count and `couldApply` maps each capability with places left to `applicable` minus `inUse`, both leaving out `componentDesigns`, `perspectives` and every zero; rows sort by id.

## Example space
```gwt-vocabulary
Given a probe corpus with {rules:number} rule entries of which {keyed:number} carry a key, and {relations:number} authored relations of which {reasons:number} carry a reason
When capability adoption runs over it without perspectives
Then the rule-key row reads {ruleKeys:string}
Then the relation-reason row reads {relationReasons:string}
Then the perspectives row reads {perspectives:string}
```
