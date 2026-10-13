---
id: spec:validation.corpus-rules
kind: behavior
altitude: feature
readiness: ready
relations:
  dependsOn:
    - spec:consumers.agent-surface
    - target: spec:validation.diagnostic-rendering
      reason: corpus findings use the shared diagnostic currency
    - target: spec:consumers.agent-surface.evaluation-sink
      reason: a rules file holds the body the sink evaluates, with the sink's bindings and trust
    - target: spec:consumers.agent-surface.recipe-parameters
      reason: validate takes `--params` in the sink's grammar
    - target: spec:consumers.validate-watch
      reason: the watch loop reruns the named rules in each cycle
  constrainedBy: spec:validation.two-check-families
  decidedBy:
    target: spec:decisions.architectural-annotation
    reason: architecture checks remain the corpus's own rules
---
# Corpus-authored rules run on the one validation path

The original design let a team add its own rules beside the built-in validators, each with an id, a severity and the whole graph query API, run in the same pass and reported in the same output (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.5). The Protocol has two check families, conformance and honesty, and every validator belongs to one of them. The architectural annotation decision sends a corpus's own rules to the corpus's own gate.

The first adopter's gate runs `sdp validate` and parses its summary line, then checks its own context isolation, entry addresses, dependency cycles, question keys, prose mentions, cited laws and Pack pages. It also parses carrier frontmatter to read kind, readiness and relations, a second read model that a graph-based corpus-rule runner would remove.

A rules file holds the body `sdp q` evaluates, so a rule tried through `sdp q` runs unchanged under `sdp validate`, and a catalog recipe whose answer carries findings, such as the architecture walk, is a rules file as shipped. The runner reads only the answer's findings, so the recipe keeps the rest of its answer for a reader. Corpus findings print after the Protocol's and are tallied on a line of their own, so a gate that reads the Protocol's summary line reads it unchanged; any error, the Protocol's or the corpus's, exits 1, and the two lines say which. Each rules file receives its own copy of what it reads, so a careless rule cannot change another rule's input and the order of the files changes only the order of the output. Its parameters are its own too: a catalog recipe answers a parameter name it does not take with that name and no findings, so parameters shared by every file would fail the walk on the names another file reads.

## Intent
- problem: A corpus with rules of its own checks them off the one validation path, reading the carriers a second way and reporting in a form no Protocol surface reads.
- outcome: Let a corpus author its own graph rules and have their findings join the one validation report, so no corpus re-parses its carriers to check itself.

## Behavior
- rule: A corpus rule is a graph body the corpus authors, given `g`, `graph`, `report` and `params` as a recipe body is, and returning findings that each carry a rule id, a subject, a message and a severity.
- rule: [#readsGraphOnly] A corpus rule reads the one derived graph, the Protocol's report and the `params` the operator supplies for its file, and no carrier, source file or network; that is the rule author's obligation, because the runner evaluates the body with the trust `sdp q` asks and claims no sandbox.
- rule: [#operatorNamed] Validation runs corpus rules only from a file the operator names with `sdp validate --rules PATH`, which may repeat, and never from a file it finds in the corpus or in a configuration; it asks the trust `sdp q` already asks, to run code the operator chose.
- rule: [#namedOrder] Rules files run one at a time in the order named, each to completion, after the Protocol's validators; every file receives the same Protocol report and none sees another file's findings, so the order changes only the order of the output.
- rule: [#copiesPerFile] Each rules file receives its own copy of the graph and the report, made after the graph is written, and its own `params`, so a body that changes what it receives changes no node, edge, delivery fact or Protocol finding, and nothing another rules file receives.
- rule: Each rules file receives as `params` only the parameters the operator names after its `--rules` and before the next `--rules`, or `{}` when none follow it, so no file receives a parameter meant for another.
- rule: A rule id names one check within its rules file; two files may use the same id, and their findings stay apart by the file that reported them.
- rule: Each corpus finding names its rule and its rules file as its source. The Protocol states none of these rules: a shipped recipe that a corpus names as a rules file checks the rule data the corpus passes it.
- rule: Corpus findings stand outside the conformance and honesty families, in a section of the output labelled as the corpus's own and tallied on a summary line of their own, so the two families keep their meaning, the guardrail that checks never judge content quality or workflow keeps binding the Protocol's own validators, and no corpus finding adds to, suppresses or changes a Protocol finding or the exit reason it sets.
- rule: [#exitCode] A corpus finding carries severity `error` or `warning`. When the operator names `--rules`, an `error` corpus finding makes `sdp validate` exit nonzero and a `warning` stays informative; without `--rules` no corpus rule runs and only the Protocol's validators set the exit code.
- rule: [#neverMovesFloor] A corpus finding moves no readiness floor and reaches no other surface: not the report `sdp q` hands a body, not the reader, not the written graph, and not the Design Review or another projection.
- rule: [#brokenRuleFails] A rules file that cannot be read or does not parse, a body that throws, or an answer that is not an object with a `findings` array of well-formed findings is a rule execution failure; `sdp validate` reports it in the corpus section and exits nonzero, so a broken rule never passes as a clean run. A failed file reports none of its findings, and the other files still run.
- rule: [#watchReruns] `sdp validate --watch` with `--rules` reads and runs every named rules file afresh in each cycle, after the Protocol's validators; an edit to a rules file alone starts no cycle, because the watcher watches carriers.
- rule: When the graph does not derive, no rules file runs, and the corpus summary line says so.

## Design
- rulesFlag: `sdp validate [root] [--exclude PATH]... [--check-clean | --watch] [--rules PATH [--params JSON | --params @PATH | --params KEY=@PATH]...]...`; `--rules` and `--params` are options of `validate` alone, a `--params` before the first `--rules` is refused, one file named twice is refused, including through a symlink, and each PATH resolves from the working directory, as a `--params @PATH` file does. Diagnostics retain the path the operator named.
- paramsFlag: `--params` on `validate` takes the three forms of `sdp q --params` with the same refusals, before the graph derives; each `--params` belongs to the nearest `--rules` before it in the argument list, whatever other options stand between them; one file's parameters merge as `sdp q` merges them, a key given twice for one file is refused, two files may each take the same key, and a file with no `--params` after it receives `{}`.
- rulesFile: a rules file is UTF-8 text holding one plain JavaScript async function body, the form `sdp q` evaluates, with the bindings `g`, `graph`, `report` and `params`; the runner reads the text and never imports it as a module, so no file extension is required and a catalog recipe file under `dist/recipes/` is a lawful rules file.
- ruleAnswer: `{ findings: [] }`: the body returns an object whose `findings` is an array, possibly empty; the runner reads `findings` and nothing else, so the answer's other keys stay the body's own data and are never printed.
- ruleFinding: `{ validatorId, subjectId, severity, message, relatedId?, path?, file?, line? }`, where `validatorId` is the rule id, one token matching `^[a-z][a-z0-9-]*$`, so it never reads as a Protocol validator id; `subjectId` and `message` are non-empty strings; `severity` is `"error"` or `"warning"`; `relatedId` and `path` are strings; `file` is a non-empty root-relative POSIX path, with absolute paths, backslashes and traversal above the root refused, and `line` a positive integer that requires `file`; the runner ignores a finding's other keys.
- corpusFinding: `{ rulesFile, validatorId, subjectId, severity, message, relatedId?, path?, file?, line? }` is the corpus branch of the finding currency, where `rulesFile` is the path as the operator named it; it carries no `family`, and the Protocol's findings keep their shape.
- corpusReport: the report a run with `--rules` builds keeps the Protocol's findings unchanged in `findings` and adds `corpusFindings`, the corpus findings of each file that did not fail, in the order the files are named and then in the order returned, and `corpusFailures`, one `{ rulesFile, reason }` for each failed file in the order named, never a finding; the report a rules file receives, like the one `sdp q` hands a body, carries neither.
- corpusSection: on standard error, after every Protocol finding, each rules file in the order named prints the line `corpus rules <path>` and then its findings in the order returned, each in the one composition of location, severity in brackets, rule id and message; a failed file prints `corpus rules <path> failed: <reason>` in place of its findings.
- corpusSummary: `corpus rules: <errors> errors · <warnings> warnings · <failed> of <files> files failed (the corpus's own rules)`, written to standard output directly after the Protocol's summary line, which stays as `spec:validation.diagnostic-rendering#design.summaryLine` pins it; without `--rules` no such line prints; when the graph does not derive, no rules file runs and no Protocol summary line prints, and the corpus line, the last line on standard output, reads `corpus rules: not run, the graph did not derive`.
- exitCodes: with `--rules`, `sdp validate` exits 1 when a Protocol finding is an error, a corpus finding is an error, a rules file fails or the graph does not derive, and 0 otherwise; the two summary lines say which.
- failureReasons: `<reason>` is `cannot be read (<cause>)`, `does not parse at line <L>, column <C>: <cause>`, `threw: <message on one line>`, `returned no findings array`, followed by `; diagnostics: <the answer's diagnostics as JSON>` when the answer carries `diagnostics` or by `; unknownParams: <as JSON>; accepts: <as JSON>` when it carries `unknownParams`, or `finding <N> has no lawful <field>`, with N counted from 1.

## Example space
```gwt-vocabulary
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first:"returns one error finding"|"returns one warning finding"|"returns a finding with no subject"|"empties the graph it receives"}
Given a second rules file that returns one warning when the graph it receives holds no node
When the probe corpus is validated with the rules files named by --rules in that order
Then the command exits {exitCode:number}
Then the Protocol summary line reads {protocolSummary:string}
Then the corpus summary line reads {corpusSummary:string}
```
