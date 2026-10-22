---
id: spec:model.open-question-fields
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:model.open-question-keys
  dependsOn:
    target: spec:extraction.entry-locations
    reason: adds rows to the location table
  decidedBy:
    - target: spec:decisions.adopt-the-nouns
      reason: question fields describe the question without adding workflow state or gates
    - target: spec:decisions.planning-truths-placement
      reason: a deferral's re-entry trigger rides its own blocking question, the home that decision rules
---
# An open question may name who decides it, its links, a provisional reading and a re-entry trigger

The original design gave an open question an owner and a list of links to decision records, discussions and tickets, beside its text and its blocking flag (`docs/lineage/v0-design/01-core-primitives.md` §2.1). A question key gives a question an address and nothing more, so the first adopter keeps the rest beside the graph. Its decision register (`libar-platform/design/decisions/register.json`, described in `design/advisors/register.md`) records for each open decision its sources, who decides it as a class (`tactical`, `delegated` or `owner`) and an advisor lens, the provisional reading the design proceeds on, and a lean. It also records a status, the work unit it blocks, dates and who checked the lean. This Spec captures the part that states something about the question and leaves the work record outside.

A TypeScript open-question list that cannot be read statically drops whole, blocking questions included. A failure under one of the four fields is an error, because the fields arrived with no carrier relying on a lossy reading; a failure in a question's text, its blocking flag or the list itself keeps the warning every other non-static TypeScript section property gives.

## Intent
- problem: A question's text and blocking flag do not say who settles it, what it rests on, or what the design assumes until it is settled, so an adopter keeps a register beside the graph that repeats each question.
- outcome: Let an open question carry who decides it, the sources it rests on, the reading the design proceeds on and, on a deferral, what brings it back, without a status.
- risk: A field for who decides invites fields for when and for what state the question is in, which would rebuild a workflow tracker inside the Spec.

## Rule
- An open question may carry four optional fields beside its text, flag and key, namely who decides it, the links it rests on, its provisional reading and its re-entry trigger; a question without them stays lawful.
- Who decides a question names the person, role or body whose ruling settles it. It authorizes nothing, gates no edit, and no validator compares it with the author of a change.
- Who decides a question is one lowercase kebab token the corpus owns, on the grammar a role uses, such as `owner` or `delegated`. The graph holds no person or role to point at, so the value references nothing, and the Protocol ships no list of values.
- In the Markdown carrier the four fields ride labelled sub-items indented under the question's own line, `decider:`, `links:`, `provisional:` and `trigger:`, each at most once and each one line, so the question line stays as authored. They are the only indented field lines the body grammar admits, and the TypeScript carrier carries the same four fields on the question object.
- [#fieldFailureError] In the TypeScript carrier, a value under any of the four fields that cannot be read statically is an extraction error at that field, and the Spec's whole open-question list drops with it.
- [#droppedListWarning] In the TypeScript carrier, a question text or blocking flag that cannot be read statically, or a spread in the list, drops the Spec's whole open-question list, blocking questions included, with the lossy warning `extract/non-static-section`; only a failure under the four fields is an error.
- A link is a Spec id or an entry address the question rests on, and nothing else. Each is checked as a mention is: a missing target or entry is an error, and a target with no declared relation either way raises the `conformance/prose-mentions` warning for that pair. A link mints no relation, and a document outside the graph is named in the question's text as prose, because the graph holds no identity for it to resolve.
- The provisional reading is one line stating what the design assumes while the question is open. It is intent, never a ruling.
- A question carries at most one provisional line. A worked proposal for settling it is a decision Spec whose Decision section holds its decision, context, rationales, alternatives and consequences, stated at the rung its record earns. Each shaped Spec names it through `decidedBy`, so a decision below `defined` holds that Spec below `ready` under the typed-dependency floor.
- A re-entry trigger is one line naming what brings a deferred Spec back, such as a named reader the shipped views do not serve. It sits on the blocking question that holds the deferral, and the open-question register reports questions that carry one apart from design holds, so no reader tells the two apart by their wording.
- An open question carries no status, date, blocked work unit or record of who checked it. A settled question leaves the Spec, a ruling that passes the ADR three-part test lands as a decision Spec the shaped Specs name through `decidedBy`, and the rest of the history stays in git and in the adopter's own records.
- Whether a question holds the readiness floor stays its `[blocking]` flag alone; none of the four fields moves a floor.

## Example space
The world writes one TypeScript carrier for a story-altitude rule Spec stating `idea`, with a title, an Intent outcome, one rule and an open-question list holding one blocking question. Every value is static apart from the construct the point names: a question text or blocking flag written as a function call, or a spread of another list beside the question.

```gwt-vocabulary
Given a TypeScript Spec carrier whose blocking open question meets {construct:"a non-static question text"|"a non-static blocking flag"|"a spread in the list"}
When the extractor reifies the carrier
Then the extractor reports {findingId:string} at severity {severity:"warning"|"error"}
Then the Spec stays in the graph with {questionCount:number} open questions
```

## Design

- subItemLine: a field is one line of exactly two spaces, `- `, a label from `decider`, `links`, `provisional` and `trigger`, a colon, a space and the value, directly under its question's line or a sibling field; any other indented line stays refused, as is a field under an entry that is not an open question.
- questionObject: the open question object carries optional `decider`, `links` as a list of strings in authored order, `provisional` and `trigger` fields, each absent when the author wrote none; the TypeScript carrier writes the same fields.
- linksValue: `links:` takes a comma-separated list, as an anchor comment's target tags do, non-empty and with no repeat.
- fieldFindings: an unknown or repeated label, an empty value, a `decider` off the token grammar, and a `trigger` on a non-blocking question are conformance errors at the field's line.
- fieldLocations: each carrier that records entry lines records a row per field present, `question[<i>].decider`, `question[<i>].links`, `question[<i>].provisional` or `question[<i>].trigger`; a link finding reads the `links` row, and a line the carrier did not record stays absent.
- linkResolution: each link is checked as a mention is, at the field's line, by the same validator and with the same two findings.
- registerColumns: the open-question register (recipe 20) reports the four fields on each row, marks a question carrying a trigger as a deferral, and counts deferrals and holds apart.
