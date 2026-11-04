---
id: spec:consumers.adopter-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.authoring-on-ramp
    reason: an adopter takes the authoring path from the installed package, with the ruled homes and install steps it needs
  dependsOn:
    - target: spec:validation.typed-dependency-floor
      reason: the skill teaches an unsettled fact as a constraint Spec this floor reads
    - target: spec:consumers.agent-surface.register-recipes
      reason: the skill derives the open-question and mention registers from the recipes this Spec owns
    - target: spec:consumers.shipped-protocol-corpus
      reason: the help points the reader at the corpus the package ships
    - target: spec:carrier.markdown-body-grammar
      reason: the grammar table points at the closed body grammar this Spec states
  decidedBy:
    - target: spec:decisions.planning-truths-placement
      reason: each ruled home the skill teaches is the home this ruling sets
    - target: spec:decisions.decision-readiness-posture
      reason: a decision Spec states `ready` once ratified, so the skill teaches a ruling awaiting its owner below it
---
# An adopter learns graph homes, carrier grammar and shipped paths from the on-ramps

The help names the on-ramps by path because an operator can reach the CLI without a package runner and still needs to find the shipped on-ramps and the law they cite. A commit pin lets an adopter take any reviewed revision without a registry release, and the package builds itself during that install, so a re-pin is one dependency edit rather than a rebuilt vendored tarball.

## Intent
- problem: An adopter needs a repeatable commit install and stable recipe inputs. An adopter that follows the shipped on-ramps cannot learn where a deferral, an unsettled fact, a ruling awaiting its owner, a statement a test checks, or a count belongs, so it invents tags of its own, hand-kept registers, and scripts that keep them true.
- outcome: Teach commit installation and stable recipe inputs in the README. Teach each ruled home in the shipped skills, one line each with its carrying Spec, so an adopter states those truths in the graph and not beside it.

## Behavior
- rule: [#commitInstall] An adopter can pin the package to a git commit, and the package's `prepare` script builds the CLI, subpath exports and shipped recipes before installation completes. While the package version is `0.0.0`, the installation guidance uses a commit pin rather than an npm prerelease.
- rule: [#installGuidance] The shipped README teaches a commit install with npm and pnpm, the source-qualified build approval each needs, and a check that the installed CLI's `sdp --version` names the pinned full commit, for a git clone or a hosted git archive install. It teaches that the `./vitest` subpath needs Vitest 2 or later installed beside the package.
- rule: [#recipeUpgrade] The upgrade guidance teaches a recipe caller to pass the recipe's subject as `--params` data and run the shipped recipe file, never to rewrite the recipe body.
- rule: The authoring skill teaches a deferral as a blocking open question whose `trigger:` field names what brings the Spec back, plus `dependsOn` for a true precondition, in one line citing `spec:decisions.planning-truths-placement`.
- rule: It teaches an unsettled fact as a constraint Spec whose blocking open question names the check that would settle it, with `constrainedBy` from each Spec it bounds, in one line citing `spec:validation.typed-dependency-floor`.
- rule: It teaches a ruling that awaits its owner as a decision Spec below `ready`, with `decidedBy` from each Spec the ruling shapes.
- rule: It teaches that a fact is checked by an example that `verifies` it. `has-verifier` is derived once a test anchor binds the example, and a checked status is never authored.
- rule: [#grammarTable] It keeps a short table of the Markdown body grammar, one row per section owner, citing `spec:carrier.markdown-body-grammar`, for the moment a refused carrier stops every query.
- rule: It teaches that counts, registers, and review scope are derived. Census counts come from `sdp census`, open-question and mention registers from catalog recipes, and a change's review scope from changed-file blast radius. None is quoted into prose.
- rule: [#helpNamesOnRamps] `sdp --help` names the shipped skills, the recipe catalog, and the Protocol's own `specs/` by package-relative path.
- rule: The skills teach and never check. No validator reads an adopter's own tags, and an adopter's own policy checks stay the adopter's.
