---
id: spec:model.open-question-fields
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:model.open-question-keys
  decidedBy: spec:decisions.adopt-the-nouns
---
# An open question may name who decides it, its links and a provisional reading

The original design gave an open question an owner and a list of links to decision records, discussions and tickets, beside its text and its blocking flag (`docs/lineage/v0-design/01-core-primitives.md` §2.1). The Protocol gave a question an optional key and an address and stopped there. The first adopter keeps the rest beside the graph. Its decision register (`libar-platform/design/decisions/register.json`, 175 rows, described in `design/advisors/register.md`) records for each open decision its sources, who decides it as a class (`tactical`, `delegated` or `owner`) and an advisor lens, the provisional reading the design proceeds on, which 96 rows carry, and a lean. It also records a status, the work unit it blocks, dates and who checked the lean. This Spec captures the part that states something about the question and leaves the work record outside.

## Intent
- problem: A question's text and blocking flag do not say who settles it, what it rests on, or what the design assumes until it is settled, so an adopter keeps a register beside the graph that repeats each question.
- outcome: Let an open question carry who decides it, the sources it rests on, the reading the design proceeds on and, on a deferral, what brings it back, without a status.
- risk: A field for who decides invites fields for when and for what state the question is in, which would rebuild a workflow tracker inside the Spec.

## Rule
- An open question may carry four optional fields beside its text, flag and key, namely who decides it, the links it rests on, its provisional reading and its re-entry trigger; a question without them stays lawful.
- Who decides a question names the person, role or body whose ruling settles it. It authorizes nothing, gates no edit, and no validator compares it with the author of a change.
- Who decides a question is one lowercase kebab token the corpus owns, on the grammar a role uses, such as `owner` or `delegated`. The graph holds no person or role to point at, so the value references nothing, and the Protocol ships no list of values.
- In the Markdown carrier the four fields ride labelled sub-items indented under the question's own line, `decider:`, `links:`, `provisional:` and `trigger:`, each at most once and each one line, so the question line stays as authored. They are the one indented line the body grammar admits, and the TypeScript carrier carries the same four fields on the question object.
- A link is a Spec id or an entry address the question rests on, and nothing else. Each is checked as a mention is: a missing target or entry is an error, and a target with no declared relation either way raises the pair warning. A link mints no relation, and a document outside the graph is named in the question's text as prose, because the graph holds no identity for it to resolve.
- The provisional reading is one line stating what the design assumes while the question is open. It is intent, never a ruling.
- A question carries at most its one-line provisional reading of a lean. A worked lean is a decision Spec whose Decision section holds its parts as `decision`, `context`, `rationale`, `alternative` and `consequence`, stated at the rung its record earns, and the Specs it shapes name it through `decidedBy`, so a lean below `defined` holds them below `ready` under the typed-dependency floor.
- A re-entry trigger is one line naming what brings a deferred Spec back, such as a named reader the shipped views do not serve. It sits on the blocking question that holds the deferral, and the open-question register reports questions that carry one apart from design holds, so no reader tells the two apart by their wording.
- An open question carries no status, date, blocked work unit or record of who checked it. A settled question leaves the Spec, a ruling that passes the decision test lands as a decision Spec the shaped Specs name through `decidedBy`, and the rest of the history stays in git and in the adopter's own records.
- Whether a question holds the readiness floor stays its `[blocking]` flag alone; none of the four fields moves a floor.

## Design

- subItemLine: a field is one line of exactly two spaces, `- `, a label from `decider`, `links`, `provisional` and `trigger`, a colon, a space and the value, directly under its question's line or a sibling field; any other indented line stays refused, as is a field under an entry that is not an open question.
- questionObject: the open question object gains `decider`, `links`, a list of strings in authored order, `provisional` and `trigger`, each absent when the author wrote none, and the TypeScript carrier writes the same four fields on its question object.
- linksValue: `links:` takes a comma-separated list, as an anchor comment's target tags do, non-empty and with no repeat.
- fieldFindings: an unknown or repeated label, an empty value, a `decider` off the token grammar, and a `trigger` on a non-blocking question are conformance errors at the field's line.
- fieldLocations: each carrier that records entry lines adds a location row per field present, `question[<i>].decider`, `question[<i>].links`, `question[<i>].provisional` or `question[<i>].trigger`; a link finding reads the `links` row, and a line the carrier did not record stays absent.
- linkResolution: each link is checked as a mention is, at the field's line, by the same validator and with the same two findings.
- registerColumns: the open-question register (recipe 20) adds the four fields to each row, marks a question that carries a trigger as a deferral, and counts deferrals and holds apart in its totals.
