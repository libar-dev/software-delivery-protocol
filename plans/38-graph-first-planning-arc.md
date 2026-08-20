# Plan 38 — the graph-first planning arc (pilot)

> **Status:** 🧭 DRAFTED — a thin lineage pointer, deliberately not a briefs index. This arc
> pilots `spec:consumers.graph-first-planning`: the arc's forward intent is authored as
> capture-rung Specs in the corpus, and the backlog, readiness, and sequencing are read from the
> graph (recipes 1, 9, 11) rather than from this file. If this file and the graph disagree, the
> graph wins and this file is stale.

## Authority

The graph is the read model for this arc. If this file and the graph disagree, the graph wins
and this file is stale.

## Why this arc

Plan 37 closed the plan-36 arc with an empty operational backlog and no open briefs. The next
intent, planning through the Specs themselves plus structural annotations for architecturally
significant patterns and relationships, entered the corpus as Specs at the commit that adds
this file.

## The arc's intent lives in the graph

Authored for this arc:

- `spec:consumers.graph-first-planning`, the planning practice itself.
- `spec:model.structural-patterns`, anchor vocabulary beyond `component` and `uses`.
- `spec:protocol.structural-self-binding`, the engine's own structural self-binding.
- `spec:decisions.planning-truths-placement`, the ruling that gives every planning-truth type
  one ruled graph home and retires the briefs index as a carrier of law.
- `spec:decisions.shipped-projections-frozen`, the refusal to re-specify the shipped Design
  Review, census, Mermaid, or Gherkin projections.

Already in the graph and expected to be worked this arc:

- `spec:consumers.intent-composition`
- `spec:consumers.impact-graph`
- `spec:extraction.regenerability`

Readiness, backlog, and sequencing for all of the above are read from the graph, never from
this file.

## The do-not-reopen register lives in the graph

The live register law that plans 34 through 36 carried as prose rows now lives in Specs:

- `spec:decisions.carrier-universality` holds the default-carrier refusal and the Gherkin
  expansion refusals.
- `spec:decisions.structural-anchor-semantics` holds the `implements`-slot refusal.
- `spec:extraction.runnable-modules` holds the frozen registrar interface and the O5 plus
  Scenario Outlines refusals.
- `spec:decisions.shipped-projections-frozen` holds the shipped-projections refusal.
- `spec:consumers.impact-graph` holds the `bySymbol` and impact-graph row as a blocking open
  question; it is a hold, not a refusal.
- `spec:decisions.sdp-gherkin-extension` holds the `.sdp.gherkin` suffix ruling.
- `spec:decisions.agent-front-door` holds the query-verbs refusal.
- `spec:decisions.mcp-deferred` holds the E3 half of the MCP non-ruling. The three named H
  deferral triggers (Spec Studio, reference projection, structural-edge Mermaid) are not live
  register law: they remain historical evidence in the plan 35 record, while
  `spec:consumers.graph-first-planning` carries only the generic re-entry-trigger placement
  rule.
- The E2 placement ruling is a lawful non-decision and stays in the plan 35 record.

Reopening any row is a later decision Spec that `supersedes` the carrier and passes the ADR
three-part test. Plans 36 and 37 keep their historical text untouched; this pointer replaces
nothing in them.

## Discipline (unchanged)

Plan-vs-execution separation; `npm run check` before any green claim; readiness promotion is a
human statement after recipe 9; checks police conformance and honesty, never content-quality and
never workflow; close records re-derive their numbers and label them as re-derived.
