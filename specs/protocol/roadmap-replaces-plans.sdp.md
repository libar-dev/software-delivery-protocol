---
id: spec:protocol.roadmap-replaces-plans
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  dependsOn:
    - target: spec:consumers.roadmap
      reason: the Protocol reads its own next work from its roadmap
    - target: spec:consumers.roadmap.memo
      reason: each description's forward section is the roadmap memo
    - target: spec:consumers.intent-composition.proposal
      reason: a review's findings against Specs travel as a checked change proposal
    - target: spec:consumers.intent-composition.proposal.memo
      reason: the pull request carries a review's proposal as its memo
    - target: spec:observation.run-evidence
      reason: an arc's acceptance reads run records as evidence from test files at their recorded commit
  decidedBy: spec:decisions.roadmap-over-plans
---
# The Protocol reads its next work from its roadmap and keeps its delivery record in git and its pull requests

Each arc's intent already lives in its capture Specs and Pack, its rulings in their carrying Specs, and its story in its pull request description. What a plan file still carries is the status line agents read first, the lanes and waves of the arc, and copies of ruling tables; what a committed review file carries, a change proposal, its memo and git already hold. Once a roadmap holds priority, the Protocol reads its next work from the graph, keeps each arc's record in git and its pull request, with review findings and evidence beside the story, and lets the plan and review files stand as the record of how earlier arcs were run. The Protocol keeps one living roadmap: its owner selects what it lists, and the pull requests that complete that work remove it.

## Intent

- actor: An agent or a person opening, reviewing or resuming the Protocol's work, and the owner keeping its order.
- problem: The handbook points every session at the newest plan file and keeps a status line for each, and a gate requires both, so forward planning lives in prose beside the graph that already holds the arc's intent, and committed review files repeat what change proposals, git and the pull request already carry.
- outcome: Let an agent opening the Protocol's next work read it from the roadmap recipe, review and recover an arc from git and its pull request, and keep the plan and review files as frozen history no gate requires to grow.

## Behavior

- rule: [#readsRoadmap] An agent opening the Protocol's next work runs the roadmap recipe over the roadmap Pack the handbook names and follows each entry to its Packs and carrying Specs; no plan file answers for forward work.
- rule: [#oneRoadmap] The Protocol keeps one living roadmap Pack, edited in place. Its owner selects captured work for the upcoming pull requests; landing a capture does not add it. Entries leave by an ordinary manifest edit when the selected work is complete or no longer belongs among the next work, and move on the owner's word, with git as history.
- rule: [#plansFrozen] `plans/` and `reviews/` keep the plans and review records of the arcs that had them as history until a cleanup arc removes or archives them; no file is added to either, and a file in either changes only to correct the record it keeps.
- rule: [#executionRecord] Before an arc's first push its record is its branch, git being the event log: the first commit message states the owner's working rules for the arc and the arc's Pack, each later message says what its unit did, and outstanding work is read from the arc's Pack, the backlogs and the open-question register; no record file is kept under `reviews/` or anywhere else. The arc pushes and opens its draft pull request at its first coherent commit, normally the scaffold, so the window in which only local git holds the record stays short and a session restarted on another machine sees the work. The draft pull request description then holds the record: its branch and base, working rules, lanes, the rulings with who made them, review findings as change proposals and their memos, acceptance as measured, deferrals and refusals. A session resuming without its predecessor's context reads the branch, its commits, the draft pull request and the graph, and never claims git kept what was never committed. The authority to commit and push comes from the owner's instruction for the arc, never from this rule, and no check reads the record.
- rule: [#reviewFindings] A review's findings against Specs travel as one change proposal in the shape `spec:consumers.intent-composition.proposal` states, whose base is the branch-head commit the reviewer read; a proposal composed in a preview names the preview's merge commit from its stamp; the proposal check runs it against the graph at that base, a moved, unresolved or incomparable scope is read again before its change applies, and its memo, as `spec:consumers.intent-composition.proposal.memo` renders it, is posted to the pull request. A finding against code or another file is a review comment on its line, and a review that proposes no Spec edit has no proposal. The commit that applies a proposal carries its reason line and base, and whether a change was accepted stays in the pull request's discussion and git, never in the proposal or the graph. No review file is committed, and a brief or prompt stays in the session that used it.
- rule: [#openFindings] A finding left open against intended design becomes an open question on its carrying Spec with its `decider`, `provisional` reading and `links`, and a deferral is a blocking question with its re-entry `trigger`; a code defect against settled intent stays a code finding until it is repaired and never becomes an invented design question.
- rule: [#evidence] Evidence no test or recipe carries, such as a prototype of a view not yet built, an adopter measurement's raw output or a screenshot for the description, is committed on the arc's branch with the commands that made it, linked from the description at that commit, and removed before the merge; the Protocol merges its pull requests with merge commits, and GitHub keeps each pull request's head ref, so links at the evidence commit keep resolving. A squash or rebase merge would need the evidence published to a durable ref first.
- rule: [#acceptance] An arc's acceptance links its bound examples and their run evidence, and re-derives each recipe measurement at the commit the description names, with its commands, never inheriting an earlier result. A run record is evidence from its test file as `spec:observation.run-evidence` reads it, never a verdict for one verifier, and it counts as evidence for a preview only when its recorded commit is the commit the preview's stamp names; a preview stays a current view, never an acceptance record.
- rule: [#forwardSection] Each description's forward section is the roadmap memo rendered at the branch's head, with the re-entry condition, the owner's reason for each entry's place and the refused list in the author's words around it; the pull request that completes an entry's selected work removes it from the roadmap in the same change, entries join or move only on the owner's word, and nothing checks either.
- rule: [#handbookPointer] The handbook names the roadmap Pack and the roadmap recipe where it named the current plan, and keeps no status line for any plan.
- rule: [#gateRecord] The self-hosting gate's current-record check refuses a handbook that does not name the roadmap Pack or the roadmap recipe, and a generated graph without a Pack node `pack:roadmap` whose `order` is `priority`; it keeps the frozen historical checks, the documented green-gate legs, and the ban on plan status in the decision registry and the glossary until the cleanup arc removes the folders they read. It checks no plan number, roadmap content, freshness, work order or review disposition.

## Design

- roadmapPack: `pack:roadmap`, carried by `specs/roadmap.pack.sdp.md`.
- handbookTokens: the gate reads the handbook for the strings `pack:roadmap` and `recipe 53`, and the generated graph at `generated/graph.json` for a Pack node `pack:roadmap` whose `order` is `"priority"`.
- gateMessages: `AGENTS.md — the handbook does not name the roadmap Pack`, `AGENTS.md — the handbook does not name the roadmap recipe`, `generated/graph.json — the roadmap Pack pack:roadmap is missing`, `generated/graph.json — the roadmap Pack pack:roadmap does not state order: priority`, and `generated/graph.json — the generated graph is missing or unreadable`.

## Verification — reviewed

- Resume an arc from its branch and draft pull request alone, reading the tree, its commits and the graph, and name any context that lived only in the earlier session.
- Run the gate with a handbook that does not name the roadmap Pack and with a roadmap manifest that does not state `order: priority`, and see each refused; an empty roadmap, a built entry and an order contrary to dependency add no finding.
