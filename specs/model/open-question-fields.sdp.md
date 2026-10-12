---
id: spec:model.open-question-fields
kind: rule
altitude: story
readiness: defined
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

### Open questions
- [non-blocking #linkTargets] May a link name only a Spec id or an entry address, which validation checks, or also an external document, which the `doc:` deferral leaves without an identity?
- [non-blocking #leanHome] The adopter's lean has six parts: what to do, what it rests on, the case against it, what it settles, what it changes and what follows if it is wrong. Does any part belong on the question, or is a lean always a draft of a decision Spec?

## Rule
- An open question may carry four optional fields beside its text, flag and key, namely who decides it, the links it rests on, its provisional reading and its re-entry trigger; a question without them stays lawful.
- Who decides a question names the person, role or body whose ruling settles it. It authorizes nothing, gates no edit, and no validator compares it with the author of a change.
- Who decides a question is one lowercase kebab token the corpus owns, on the grammar a role uses, such as `owner` or `delegated`. The graph holds no person or role to point at, so the value references nothing, and the Protocol ships no list of values.
- In the Markdown carrier the four fields ride labelled sub-items indented under the question's own line, `decider:`, `links:`, `provisional:` and `trigger:`, each at most once and each one line, so the question line stays as authored. They are the one indented line the body grammar admits, and the TypeScript carrier carries the same four fields on the question object.
- A link names a Spec id or an entry address the question rests on and resolves as a mention does. A link mints no relation.
- The provisional reading is one line stating what the design assumes while the question is open. It is intent, never a ruling.
- A re-entry trigger is one line naming what brings a deferred Spec back, such as a named reader the shipped views do not serve. It sits on the blocking question that holds the deferral, and the open-question register reports questions that carry one apart from design holds, so no reader tells the two apart by their wording.
- An open question carries no status, date, blocked work unit or record of who checked it. A settled question leaves the Spec, a ruling that passes the decision test lands as a decision Spec the shaped Specs name through `decidedBy`, and the rest of the history stays in git and in the adopter's own records.
- Whether a question holds the readiness floor stays its `[blocking]` flag alone; none of the four fields moves a floor.
