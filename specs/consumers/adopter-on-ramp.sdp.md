---
id: spec:consumers.adopter-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.authoring-on-ramp
  dependsOn:
    - spec:validation.typed-dependency-floor
    - spec:consumers.agent-surface.register-recipes
    - target: spec:consumers.shipped-protocol-corpus
      reason: the help points the reader at the corpus the package ships
    - spec:carrier.markdown-body-grammar
  decidedBy:
    - spec:decisions.planning-truths-placement
    - spec:decisions.decision-readiness-posture
---
# An adopter learns graph homes, carrier grammar and shipped paths from the on-ramps

The help names the on-ramps by path because an operator can reach the CLI without a package runner and still needs to find the shipped on-ramps and the law they cite.

## Intent
- problem: An adopter that follows the shipped on-ramps cannot learn where a deferral, an unsettled fact, a ruling awaiting its owner, a statement a test checks, or a count belongs, so it invents tags of its own, hand-kept registers, and scripts that keep them true.
- outcome: Teach each ruled home in the shipped skills, one line each with its carrying Spec, so an adopter states those truths in the graph and not beside it.

## Behavior
- rule: [#commitInstall] An adopter can pin the package to a git commit; its `prepare` script builds the CLI, subpath exports and shipped recipes before installation completes. While the package version is `0.0.0`, the installation guidance uses a commit pin rather than an npm prerelease.
- rule: [#installGuidance] The shipped README teaches commit installation with npm and the dependency build permission pnpm needs, and checks the installed CLI with `sdp --version`.
- rule: [#recipeUpgrade] The upgrade guidance teaches callers to pass recipe subjects through `--params` and run the shipped recipe files; address resolution reads `params.addresses`, so rewriting a sample in the recipe body is no longer an input mechanism.
- rule: The authoring skill teaches a deferral as a blocking open question whose `trigger:` field names what brings the Spec back, plus `dependsOn` for a true precondition. Its blocking question holds the Spec below `defined` without an adopter-specific tag. Example children may still state `defined` once their bound points are complete and match the parent's example vocabulary when it has one; their `ready` waits until the parent states at least `defined`.
- rule: It teaches an unsettled fact as a constraint Spec whose blocking open question names the check that would settle it. Specs bounded by it declare `constrainedBy`; they may state `defined` when their own floor clears, and their `ready` waits until the constraint states at least `defined`.
- rule: It teaches a ruling that awaits its owner as a decision Spec below `ready`, with `decidedBy` from each Spec the ruling shapes.
- rule: It teaches that a fact is checked by an example that `verifies` it. `has-verifier` is derived once a test anchor binds the example, and a checked status is never authored.
- rule: It carries a short table of the Markdown body grammar, one row per section, that points at `spec:carrier.markdown-body-grammar`, so the grammar is found from the skill and not by probing.
- rule: It teaches that counts, registers, and review scope are derived. Census counts come from `sdp census`, open-question and mention registers from catalog recipes, and a change's review scope from changed-file blast radius. None is quoted into prose.
- rule: [#helpNamesOnRamps] `sdp --help` names the shipped skills, the recipe catalog, and the Protocol's own `specs/` by package-relative path.
- rule: The skills teach and never check. No validator reads an adopter's own tags, and an adopter's own policy checks stay the adopter's.
