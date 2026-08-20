---
id: spec:decisions.planning-truths-placement
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.relations
---
# Planning truths live in ruled graph homes

## Intent

- outcome: Give every planning-truth type one ruled home in the graph so plans stay thin lineage pointers and the briefs index shape is retired as a carrier of law.

## Decision

- context: The prose briefs index carried dependency maps, decision gates, do-not-reopen rows, re-entry triggers, ownership rulings, selection-pressure heuristics, and session law, but none of those truth types had a ruled home in the graph, so plan documents drifted into carrying law the graph could not check.
- decision: Each planning-truth type lives in its ruled home. Work-item dependency truth rides `dependsOn` edges, with independence as absence of the edge and scheduling phrases never authored. Decision gates live on `decision`-kind Specs, linked by `decidedBy`. Do-not-reopen rows split by what they carry: a tradeoff refusal becomes a `decision`-kind Spec and reopens only through a later decision that `supersedes` it under the ADR three-part test; a row that restates a behavior guarantee already homed on a carrying Spec, including the runnable-modules extraction rows, stays on that Spec and changes by ordinary Spec revision; the bySymbol impact-graph row remains a blocking hold on `spec:consumers.impact-graph` and is never minted as a decision. A lawful non-decision stays in the plan record as evidence. Re-entry triggers are the deferred Spec's own blocking open questions plus `dependsOn` for a true precondition. Exclusive ownership is one Spec identity per deliverable with consumers depending on it. Selection-pressure heuristics are advisory only, carried as behavior rules on the graph-first planning Spec or in recipes. Session law splits separately, across behavior rules on the graph-first planning Spec, the on-ramp handoff rule, and the thin plan file. The briefs index shape is retired as a carrier of law.
- rationale: The closed six-relation vocabulary already expresses every ruled home, so the ruling costs no engine work and keeps planning prose free of sequencing authority. New relation types such as `precedes`, `inArc`, or `forbids` were refused: each one is engine surface across the model, parser, extraction, validators, oracle rosters, and agent-surface docs, buying machine-checkable planning relations the corpus does not need. A `constraint`-kind home for refusals was refused because refusals are decisions. A single session-law home was refused because the planning Spec must not own per-session routing.
- consequence: Plans stay thin lineage pointers and the do-not-reopen register lives across its ruled homes: tradeoff refusals in decision Specs, already-homed guarantees on their carrying Specs, and the impact-graph row as a blocking hold. This ruling reopens only through a later `decision`-kind Spec that supersedes this one and itself passes the ADR three-part test.
