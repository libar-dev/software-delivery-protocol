# Plan 38 — the graph-first planning arc (pilot)

> **Status:** 🧭 DRAFTED — a thin lineage pointer, deliberately not a briefs index. This arc
> pilots `spec:consumers.graph-first-planning`: the arc's forward intent is authored as
> capture-rung Specs in the corpus, and the backlog, readiness, and sequencing are read from the
> graph (recipes 1, 9, 11) rather than from this file. If this file and the graph disagree, the
> graph wins and this file is stale.

## Why this arc

Plan 37 closed the plan-36 arc with an empty operational backlog and no open briefs. The next
intent — planning through the Specs themselves, and structural annotations for architecturally
significant patterns and relationships — entered the corpus as Specs at the commit that adds
this file, alongside the native-skills work merged in PRs #22 and #23.

## The arc's intent lives here (re-measure with recipe 11, never inherit)

Authored at this commit, all at the `idea` rung with their blocking questions written in place:

- `spec:consumers.graph-first-planning` — the planning practice itself. Maturing this Spec is
  both this arc's method and one of its subjects: the arc is the worked evidence.
- `spec:model.structural-patterns` — whether anchor vocabulary beyond `component` and `uses`
  passes the ADR three-part test, and what would carry it. "Pattern" needs a ratified term
  before any field is designed.
- `spec:protocol.structural-self-binding` — the coverage criterion for the engine's own
  component/uses self-binding, then the widening itself.

Existing sub-ready Specs this arc expects to work (already in the graph; recipe 11 is current):

- `spec:consumers.intent-composition` (`idea`, derived floor `ready`) — design the composing
  surface; this arc's captures are its worked input.
- `spec:consumers.impact-graph` (`idea`) — a design session may answer its blocking
  language-neutral identity question; it stays `idea` until that answer exists (the standing
  do-not-reopen row), and answering it also unblocks part of `spec:consumers.projections-model`'s
  recorded drift reason.
- `spec:extraction.regenerability` (`defined`) — recorded blocker is narrow: quoted thresholds
  lack their measurement artifact.

## Discipline (unchanged)

Plan-vs-execution separation; `npm run check` before any green claim; readiness promotion is a
human statement after recipe 9; checks police conformance and honesty, never content-quality and
never workflow; close records re-derive their numbers and label them as re-derived.
