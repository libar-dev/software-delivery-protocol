---
id: spec:consumers.command-line
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.projections-model
    reason: one verb publishes every projection root from one graph
  dependsOn:
    - target: spec:consumers.wholesale-view-rewrite
      reason: each root the verb writes is written and invalidated as every view run's is
    - target: spec:consumers.spec-studio.publisher
      reason: the Studio's page set is one of the roots the verb writes
    - target: spec:consumers.adopter-on-ramp
      reason: a verb's help repeats the top-level help that names the shipped on-ramps
  decidedBy:
    target: spec:decisions.shipped-projections-frozen
    reason: the verb writes the frozen roots unchanged and adds no projection of its own
---
# Every verb answers --help, and one verb writes every projection root

An adopter meets the command line one verb at a time, and the verb itself is the natural place to ask how it works. Each publisher's build first removes all five projection roots, so after one publisher runs only its own root is current, and writing all five took a script private to this repository. One public verb writes every root from one graph in one run, so an adopter's checkout and its CI publish the same set the Protocol's own does.

## Intent
- actor: An adopter, or an agent working for one, at the command line or in CI.
- problem: A verb refuses `--help` instead of explaining itself, and no public verb publishes every projection root at once, so an adopter runs the publishers one by one and is left with only the last one's root.
- outcome: Let every verb explain itself through `--help`, and let one verb write every projection root from one graph in one run.

## Behavior
- rule: [#verbHelp] Every verb answers `--help`: when `--help` is among a verb's arguments, the verb prints its help on standard output and exits 0, reading no other argument, deriving no graph and touching no file, a projection root included.
- rule: [#oneHelpText] A verb's help opens with its usage and its paragraph from the top-level help, the same text, so a verb's help and `sdp --help` never disagree; only the scaffolder's help, for `sdp new` and `sdp new spec`, adds a paragraph of its own after that text.
- rule: [#generateVerb] `sdp generate [root] [--exclude PATH]... [--vault DIR] [--check-clean]` enters the shared build once, validates the graph, synchronizes the vault, and writes all five projection roots from that one graph: the Design Review, the census, the Mermaid diagrams, the Gherkin-shaped view and the Studio.
- rule: [#sameBytes] Each root the verb writes holds the bytes its own publisher writes from the same graph, written wholesale through its temporary sibling as that publisher writes it.
- rule: [#generateExit] Findings never withhold a root: the verb writes all five and exits with the validation exit code, and a graph that does not derive writes no root and exits 1.
- rule: [#generateCheck] With `--check-clean`, the verb applies to each root the check its publisher applies under `--check-clean`, to renders of the one graph; a root that fails its check is removed, the others are written, and the run exits 1.

## Design
- helpVerbs: `build`, `validate`, `view`, `census`, `mermaid`, `gherkin`, `studio`, `vault`, `stamp`, `generate`, `import`, `new` and `q` answer `--help`.
- verbHelpText: `Usage:` on its own line, then the verb's usage lines as `sdp --help` writes them, a blank line and the verb's paragraph from the `Commands:` list of `sdp --help`; `sdp new --help` and `sdp new spec --help` then add a blank line and the scaffolder's own paragraph on what `PATH` takes and what the scaffold writes.
- generateRoots: in this order, `generated/design-review/`, `generated/census/`, `generated/mermaid/`, `generated/gherkin/` and `generated/spec-studio/`.
- generateOutput: the build and validation summary lines once, then the line each publisher prints for its root, in the order of the roots.
- vaultRoot: the verb never removes a vault with the five roots; before it publishes any root it synchronizes the vault at the folder `sdp vault` uses for the same root, or at `--vault DIR`, through the vault's own directory checks and guard, and a refusal there writes no root and exits 1; under `--check-clean` it leaves the vault alone, since the vault has no check mode and its tests hold its determinism.

## Example space
```gwt-vocabulary
Given an extraction root holding two authored Specs and {roots:"a stale page in each of the five projection roots"|"five current projection roots, one stale page planted in the census root"}
When the command {command:"sdp generate"|"sdp generate --check-clean"|"sdp view --help"} runs at that root
Then the command exits {exitCode:number}
Then the stale pages survive: {staleSurvive:boolean}
Then the roots holding the current pages for those Specs are {currentRoots:string}
Then the absent projection roots are {absentRoots:string}
Then standard output opens with the line {firstLine:string}
```
