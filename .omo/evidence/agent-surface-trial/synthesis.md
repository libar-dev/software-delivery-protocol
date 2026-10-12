# Agent-surface trial and gen 1 review: synthesis

Run 2026-10-12 on `feature/design-management-v0` at `bc2c84e`, the green head of PR 30, driven by
Claude Opus 5.5 in the session that folded plan 41. Read-only throughout.

## Method

Three agents received the same brief (`brief.md`) and thirteen tasks, with answers fixed in
`answer-key.md` before launch. Each could read the three repository skills, the recipe catalog,
`dist/recipes/` and `CONTEXT.md`, and reach everything else only through `sdp q`. They ran in
parallel and never saw each other's output. Two tasks carried probes: recipe 31 labels every
decision-to-decision `refines` as narrowing, which overstates the owner's ruling for four older
edges; and a removed question's address misses with the bare reason `entry`.

The gpt-6.1-sol and gpt-6-astra reports are kept verbatim here. The Opus 5.5 trial report and the
gen 1 review (an Opus 5.5 fork reading `@libar-dev/architect`'s `formal-spec/` and its three
skills) were returned inside the session and are summarized below, not kept verbatim.

## Scores

| Agent | Correct | `sdp q` calls | Time | Caught the narrows probe |
| --- | --- | --- | --- | --- |
| gpt-6.1-sol, high | 13 of 13 | 20 | 4m 19s | No |
| Opus 5.5 | 13 of 13 | 38 | 5m 41s | No |
| gpt-6-astra, xhigh | 13 of 13 | 17 | 6m 15s | No |

All three rated claim clarity and speed 5 of 5 (1.2 to 2.2 s a call); output shape and
diagnostics scored lowest (3 or 4). None opened a carrier or source file to answer a task. All
three found the `entry` reason too terse; it cost Opus 5.5 three extra calls.

## Friction, by how many agents hit it

All three:

- Rules have no source line and no address; the location table covers Design entries, UI
  entries and questions only.
- Large outputs: recipe 29 overflowed a tool's output limit, recipe 4 runs to about 400 lines,
  and filtering a shipped recipe needs a wrap no document describes.
- Two meanings of next rung: recipe 9 reads the floor's, recipe 29 the stated rung's; a decision
  stated `scoped` with a `ready` floor gets `nextRung: null` from recipe 9.
- A missed address drops what it parsed and suggests nothing.
- No recipe lists Specs stated `defined` with no implementation; all three wrote the same body.
- A deferral trigger and a design hold differ only in their prose.
- The verifier-gap signal exempts decisions without saying so.

Two of three: recipe 3 is titled for guarantees but returns section names and fewer binding
fields; the 2,400-line catalog has no index.

Opus 5.5 alone: blast radius mixes dependents and dependencies in at-risk and resolves example
verifiers to the example's carrier, not its test; a body's syntax error has no line or column;
recipe 32 omits same-layer edges; `CONTEXT.md` calls a bundle token-budgeted where the Spec
budgets UTF-16 code units, and `spec:consumers.spec-studio.data#question.aiSlices` still calls the
bundle deferred.

By design, not a defect: no agent could establish that a test passed, because `has-verifier`
records a binding, not a run.

## Open task, where the agents differed

gpt-6.1-sol and gpt-6-astra proposed the Studio's phase 0 next. Opus 5.5 proposed stating
`ready` on the thirteen captures that waited only for their author, ratifying
`spec:decisions.studio-web-components`, and building captures before the Studio. All three noted
that `defined` is not the same as designed: the design-management Pack carried no keyed Design
entries, its design living in rules, while the Studio Pack carried fifty.

## Gen 1 review, in brief

Worth taking: curation help from a file-level import graph (load-bearing modules no annotation
covers, designed modules not yet built), kept inferred and advisory; proof per rule, gen 1's most
used guarantee read; a value-transfer rule for slimming design detail after implementation; skill
doctrine on how much detail to write, review as a numbered gap list, a handoff template, tripwires
per work shape, a named place for friction, and a list of ambiguous empty results.

Keep out, beyond the three known sins (an authored tag registry, workflow gates, hand-authored
status): state carried by folder location; content quotas written as MUSTs; semantics inferred
from file paths; links that fail silently; unreproducible headline numbers; meaning carried by
naming suffixes; gates presented as advice.

## Rulings that followed

The owner ruled on a nine-card sheet: plan 43's scope as a follow-up PR, compressed with the
iteration loop and gen 1's lessons into one arc; the order 43 then 42; a file-level curation layer
before symbol identity; rule-grain proof through a checked field; `supersedes` kept but parked,
with replaced records deleted by default before the first release; the slimming rule; a re-entry
trigger field; recipe 31 named after the relation; and `spec:decisions.studio-web-components`
ratified. They land in `pack:design-iteration-v1` and plan 43.
