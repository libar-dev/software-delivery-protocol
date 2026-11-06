# Choose a kind and write its entries

For new intent before `sdp new spec`, and for every entry you write. No check reads this
guidance: the floor reads a kind's evidence (`spec:validation.kind-evidence`), never whether the
kind fits the statement.

## Choose the kind

A kind is the category of truth and sets what the floor asks for; altitude is size
(`spec:model.core-model`). Choose the kind by what the statement is, never by how big it is.

| Kind         | The statement is                         | `defined` asks for               |
| ------------ | ---------------------------------------- | -------------------------------- |
| `behavior`   | what the system does for an actor        | rules or examples                |
| `workflow`   | an ordered flow across steps or actors   | rules or examples                |
| `contract`   | an interface others build against        | rules or examples                |
| `rule`       | one invariant other Specs rest on        | its statement                    |
| `constraint` | a measurable quality bound               | a machine-readable `target` each |
| `example`    | one concrete case with literal values    | one fully bound `gwt` point      |
| `model`      | the terms a family shares                | its terms                        |
| `decision`   | a choice made against a real alternative | the chosen option                |

A scenario is an `example`, an NFR is a `constraint`, and a capability is a Pack or the
capability map, never a kind. Readiness, status, a plan and a schedule are never kinds either.

## Inline or a Spec of its own

Rules, examples, constraints, a model and a decision can sit inside the Spec that needs them, or
stand as their own Spec of the twin kind (`spec:model.spec-sections`). Keep detail inline while
only its own Spec rests on it. Move it out when another Spec rests on it, or when it needs its own
identity, readiness or review. Moving out takes the content with it, and a relation links it,
`constrainedBy`, `decidedBy` or `refines`; the content is never copied
(`spec:decisions.content-only-sections`).

## Admit a decision

A decision holds a choice that later choices and code rest on, so it is hard, expensive and slow
to change. Record one, as a Decision section or a `decision` Spec, only when the choice:

- stays true after the work it shapes ships;
- is hard to reverse, would surprise a reader without its context, and was made against a real
  alternative, written as `alternative:`: the three-part test the planning-truths placement
  applies (`spec:decisions.planning-truths-placement`).

An admitted choice sits where the inline rule above puts it: inline in the one Spec it shapes by
default, and a `decision` Spec of its own when another Spec rests on it too, or when it needs its
own identity, readiness or review. How many Specs it shapes decides where it sits, never whether
it is a decision.

| Never a decision                                          | Its home                         |
| --------------------------------------------------------- | -------------------------------- |
| a plan, a sequence of work, "ship together"               | a roadmap Pack, the pull request |
| a status or a list of deliverables                        | derived delivery facts           |
| today's realization: file lists, named exceptions, wiring | anchors and derived views        |
| a why the existing design already forced                  | the commit and pull request      |

Read each `consequence:` against the same table: a plan inside a consequence turns the record
into work. Open the rationale with why this choice is a decision at all. A session proposes a
`decision` Spec below `ready`, and its owner states `ready`
(`spec:decisions.decision-readiness-posture`).

## Write each entry

Write so a reader can check it, in the person's words:

- `outcome:` the change for its actor, without the mechanism.
- A rule: one obligation a test can check. Split a rule that joins two obligations.
- An example: literal values for one case.
- A question: one choice, its `decider`, and the asker's lean as `provisional`.
- Why: once, in the narrative or a decision Spec, never repeated across rules.
- Never delivery bookkeeping: a session date, delivery state, a derived count or the order work
  is built in. Git, the graph and recipes carry those. A domain's own dates, states, quantities,
  bounds and step orders are content, such as an example's literal date, a constraint's limit or
  a workflow's steps.
