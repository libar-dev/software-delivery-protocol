---
id: spec:consumers.context-bundle
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.agent-surface
  dependsOn: spec:consumers.agent-surface.design-recipes
  decidedBy: spec:decisions.agent-front-door
---
# A context bundle is composed per invocation within a token budget

The original design cut the graph into slices for language models ahead of time. It wrote one slice per Pack, per capability, around a changed Spec, per readiness level and for failing tests, each under 32k tokens with its nodes, edges, source files, findings, open questions and a summary, and a prompt bundle for one Spec (`docs/lineage/v0-design/07-spec-studio-and-projections.md` §5.5, §13.2). The ratified vocabulary keeps the term and defines a context bundle as a token-budgeted curated slice pushed to an agent.

Plan 35 deferred the bundle until evidence showed agent sessions still hand-assembling the same token-budgeted slice after the catalog recipes (plan 35, "H leftover projections"). The first adopter's evidence meets that trigger. Every design pass there starts from the same hand-written brief, which tells the agent to read the Pack's page, run recipes 5, 20, 21 and 24 over the Pack and its members, read the member Specs where the page falls short, and end the memo with what the page did not give (`libar-platform/design/advisors/task-pass.md`). Four advisor lenses run that brief over each Pack, and the adopter asks for the reading material to be generated from a Pack and a lens (`libar-platform/docs/feedback/sdp-feedback-02.md`, item 29). The agent front door refuses a committed artifact that answers in the graph's name, so a bundle is composed on each invocation and never saved as slices. It builds on the Pack design recipe, recipe 29.

## Intent
- actor: An agent starting one design pass over a Pack, a Spec's neighborhood or a set of open questions.
- problem: Each pass assembles the same reading material by running the same recipes and joining their answers by hand, and nothing bounds what it hands the model.
- outcome: Give an agent the reading material for one design pass in one composed, token-budgeted slice of the graph, so no session hand-assembles it.

### Open questions
- [blocking #bundleEntrance] Is a bundle a catalog recipe that takes its scope and budget as parameters, or does it need an entrance of its own? The front door admits no new query verb, so a recipe is the default and anything else needs a ruling.
- [blocking #tokenBudget] How is a budget counted without binding the Protocol to one model's tokenizer, and what is cut first when the scope exceeds it: prose before entries, distant neighbors before members, or source excerpts before graph data?
- [non-blocking #bundleScopes] Which scopes does a bundle take beyond a Pack: a Spec with its neighborhood, the Specs a changeset touches, the open questions of a Pack?
- [non-blocking #perspectiveFilter] Does a bundle take a review perspective as a filter, so one call yields the brief for one lens?

## Behavior
- rule: A bundle is composed from the graph on each invocation by the reader every recipe uses; nothing is precomputed, saved or committed, and two invocations at one commit with one scope and one budget compose the same bundle.
- rule: A bundle for a Pack carries the Pack design assembly, its members in authored order with their design columns and its boundary, then each member's open questions with their addresses and lines, its dependency footing, its pinned declarations and its examples.
- rule: A bundle states its scope, its budget and what it left out to stay within the budget, so a reader knows what to read in the Specs themselves.
- rule: A bundle carries facts from the graph and no instructions of its own; the brief that tells an agent what to look for stays the corpus's own text.
