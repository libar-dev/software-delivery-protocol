---
id: spec:consumers.spec-studio.data.inputs
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.data
  dependsOn:
    - target: spec:consumers.spec-studio.publisher
      reason: each input is named by a flag of the studio verb
    - target: spec:consumers.design-diff
      reason: the base graph input is the design diff's base
    - target: spec:observation.run-evidence
      reason: the run records input is read only as run evidence
  constrainedBy: spec:extraction.determinism
---
# The Studio reads two named inputs beside the graph, a base graph and run records

Two inputs may ride beside the graph: the graph an earlier commit wrote, so a page can show what changed since, and CI run records, so a reviewer reads what ran beside the verifier bindings. Each is named on the command line and on every page that shows it, and neither answers in the graph's name. Without them the page set is what the graph alone writes.

## Intent
- outcome: Let the Studio's build read a base graph and run records beside the graph, each named where it shows, while the graph alone writes the page set when neither is given.

## Contract
- [#namedInputs] Beside the graph the build reads at most two inputs, each named on the command line: a base graph, the graph object `sdp build` wrote at an earlier commit, which reaches recipe 35 as `params.base`; and run records, each one Common Test Report Format document, which reach recipe 45 as `params.runs`. The build reads neither in any other way.
- [#inputFlags] The studio verb also takes `--base PATH`, naming the base graph, a JSON file `sdp build` wrote; `--base-label TEXT`, the words that name the base graph on its pages; and `--runs PATH`, naming one run record, a JSON file in the Common Test Report Format, repeatable, the records keeping the order of their flags. `--base-label` without `--base`, or `--base` given twice, is refused.
- [#unreadableInput] An input file that cannot be read or does not hold JSON refuses the run before extraction, with exit 1 and one line on stderr naming the flag and the path; a JSON value a recipe cannot read shows on its page as that recipe's diagnostics.
- [#inputPages] An input adds pages and page sections, never a data file: the base graph adds `diff.html` and the changed-since-base sections of the Spec and Pack pages, and run records add `runs.html` and the run rows of the tests lens and the verification panels.
- [#inputNaming] A page that shows an input names it in words, the base graph by its label when it was given one, its schema version and its Spec count, and a run as `spec:consumers.spec-studio.runs-page` names it; no page holds an input's path.
- [#inputsNeverGraph] An input never becomes graph data, a delivery fact, a finding, a rung or a verdict: no page counts a run toward a binding, and no difference from the base moves a rung.
- [#inputsUntouched] A run leaves every input file byte-identical.
- [#sameInputsSameBytes] Without inputs the page set is the one the graph alone writes; with them, the same graph and the same input bytes and labels write the same page set, byte for byte, and a value an input carries, such as a run's commit and times, shows only on the pages that name that input.

## Design
- studioInputs: `{ base?: { graph: unknown; label: string | null }; runs: unknown[] }`, the inputs the command hands the build: `base` absent without a base graph, `runs` the run records in the order the command names them and empty without any.
- baseName: `{ label: string | null; schemaVersion: string; specs: number }`, how a page names the base graph: the label the command gave or null, the base graph's `schemaVersion`, and its count of Spec nodes.

## Example space
```gwt-vocabulary
Given an extraction root holding a Pack and its member Specs
Given the studio command is given the base graph {base:"none"|"an earlier graph of the root"} and the run records {runs:"none"|"one CTRF report"}
When the studio command runs twice with those inputs
Then the two runs wrote byte-identical files: {byteIdentical:boolean}
Then the page set holds the diff page: {diffPage:boolean}
Then the page set holds the runs page: {runsPage:boolean}
Then every page that shows an input names it and holds no input path: {inputsNamed:boolean}
```
