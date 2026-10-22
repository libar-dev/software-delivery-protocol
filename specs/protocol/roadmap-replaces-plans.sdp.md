---
id: spec:protocol.roadmap-replaces-plans
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  dependsOn:
    - target: spec:consumers.roadmap
      reason: the Protocol reads its own next work from its roadmap
    - target: spec:consumers.roadmap.memo
      reason: each description's forward section is the roadmap memo
  decidedBy: spec:decisions.roadmap-over-plans
---
# The Protocol reads its next work from its roadmap, and its plan files are history

Each arc's intent already lives in its capture Specs and Pack, its rulings in their carrying Specs, and its story in its pull request description. What a plan file still carries is the status line agents read first, the lanes and waves of the arc, and copies of ruling tables. Once a roadmap holds priority, the Protocol reads its next work from the graph and lets the plan files stand as the record of how earlier arcs were run. The Protocol keeps one living roadmap, edited by the pull requests that change what it lists.

## Intent

- actor: An agent or a person opening the Protocol's next body of work, and the owner keeping its order.
- problem: The handbook points every session at the newest plan file and keeps a status line for each, and a gate requires both, so forward planning lives in prose beside the graph that already holds the arc's intent.
- outcome: Let an agent opening the Protocol's next work read it from the roadmap recipe, and keep the numbered plan files as frozen history no gate requires to grow.

## Behavior

- rule: [#readsRoadmap] An agent opening the Protocol's next work runs the roadmap recipe over the roadmap Pack the handbook names and follows each entry to its Packs and carrying Specs; no plan file answers for forward work.
- rule: [#oneRoadmap] The Protocol keeps one living roadmap Pack, edited in place: an entry joins when its capture lands, leaves once the pull request that builds it merges, and moves on the owner's word, with git as its history.
- rule: [#plansFrozen] `plans/` keeps the plans of the arcs that had one as history; no plan file is added, and a plan file changes only to correct the record it keeps.
- rule: [#executionRecord] An arc's execution record, its lanes, the rulings with who made them, its acceptance as measured, its deferrals and its refusals, lives in its pull request description, opened as a draft when the arc first pushes; evidence no test or recipe carries sits under `reviews/` beside the description that cites it.
- rule: [#forwardSection] Each description's forward section is the roadmap memo rendered at the branch's head, with the re-entry condition and the refused list in the author's words around it; the pull request that designs or builds an entry edits the roadmap in the same change, and nothing checks that it did.
- rule: [#handbookPointer] The handbook names the roadmap Pack and the roadmap recipe where it named the current plan, and keeps no status line for any plan.
- rule: [#gateRecord] The self-hosting gate's current-record check refuses a primary-numbered plan above the last frozen plan, a handbook that does not name the roadmap Pack or the roadmap recipe, and a roadmap Pack manifest that is missing or does not state `order: priority`; it keeps the frozen historical checks, the documented green-gate legs, and the ban on plan status in the decision registry and the glossary.

## Design

- roadmapPack: `pack:roadmap`, carried by `specs/roadmap.pack.sdp.md`.
- handbookTokens: the gate reads the handbook for the strings `pack:roadmap` and `recipe 53`, and the roadmap Pack's manifest for a frontmatter line `order: priority`.
- frozenCeiling: the number of the last frozen plan is a constant of the gate, set when the gate changes; a file under `plans/` whose name opens with a number above it, zero-padded or not, is refused, and a letter-suffixed or unnumbered file is not read.
- gateMessages: `plans/<name> — a numbered plan above the last frozen plan; forward work reads from the roadmap`, `AGENTS.md — the handbook does not name the roadmap Pack`, `AGENTS.md — the handbook does not name the roadmap recipe`, `specs/roadmap.pack.sdp.md — the roadmap Pack's manifest is missing`, and `specs/roadmap.pack.sdp.md — the roadmap Pack's manifest does not state order: priority`.
