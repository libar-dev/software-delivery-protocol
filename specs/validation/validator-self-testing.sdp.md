---
id: spec:validation.validator-self-testing
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Every validator ships evidence in both directions

A validator that stops firing reports nothing, and an empty report looks like a clean graph unless a test asserts the refusal. A validator that refuses every input is just as useless. Refusing and accepting inputs, one probe world per direction, tell the two failures apart, so the check families are themselves checked. No validator checks this discipline, because the Protocol's checks concern conformance and honesty, never the delivery process.

An audit keeps the discipline whole. Scattered tests can cover every check today and miss the next one, so the audit holds one probe pair per finding id in one table and fails when the table and the engine's registries disagree. Extraction refusals count: they carry the conformance family, refuse carriers in the same validation run, and go silent in the same way. The accepting probe is a near miss rather than an empty input, because an empty input passes a validator that refuses too much.

## Intent
- outcome: Keep a validator that has silently stopped firing from reading as a clean build.

## Rule
- [#bothDirections] Each validator ships evidence in both directions: at least one input it must report and at least one near miss it must leave unreported.
- [#neverAValidator] The discipline is evidence over the two check families, never a check of its own; no validator checks whether another validator carries tests, and no report, graph fact or delivery fact records the audit.
- [#auditScope] The audit covers every finding id a validation run can report: each graph validator's and each extraction finding's, the Markdown and Gherkin carriers' included. Contract generation and import report outside a validation run and stay outside the audit.
- [#probePairs] The audit holds one probe pair per finding id: a refusing probe the id must report, and an accepting probe, a near miss that differs from the refusing probe only in the construct the check reads, that the id must leave unreported.
- [#closedTable] The audit's table and the engine's registries agree exactly: a registered id without a pair, an id paired twice, a pair for an id no registry lists, a finding id written in the engine's source outside every registry, and a finding id a probe run reports outside every registry each fail the audit.
- [#sourceReadWhole] The audit reads the engine's source as code, so a comment never counts and every quote form does, and it fails on a finding id it cannot read whole, such as an id prefix joined to a value at run time.
- [#silentAndOvereager] The audit runs every probe through the entry a validation run uses, graph validation for a graph probe and extraction for a carrier probe, and fails for each id its refusing probe does not report and each id its accepting probe reports; it reads the finding id alone, never the message.
- [#auditInGate] The audit is a test in the repository's own suite, so the gate runs it on every change. It fails by naming each id at fault, writes no tracked file and no durable result, and may create and remove a temporary extraction root for a carrier probe.

## Design
- registries: `graphValidatorIds` and `extractFindingIds`; the Markdown extractor's `extract/invalid-markdown-structure`, `extract/unrecognized-heading` and `extract/invalid-frontmatter` join `extractFindingIds`, so one registry lists every extraction finding id.
- probeEntry: `{ id: string; refusing: Probe; accepting: Probe }`, with `type Probe = { graph: GraphSchema } | { carriers: Readonly<Record<string, string>> }`, a graph for a graph validator and root-relative carrier files for an extraction finding.
- auditFunction: `auditValidatorEvidence(table: readonly ProbeEntry[], run: (probe: Probe) => readonly Finding[], registered: readonly string[], source: SourceScan): AuditAnswer`, where `run` is graph validation or extraction as the probe needs, so a world can wrap it to silence one id or report it everywhere; every finding id any probe run reports outside `registered` is `unregistered`.
- auditAnswer: `{ unpaired: string[]; duplicatePairs: string[]; strayPairs: string[]; unregistered: string[]; unresolved: string[]; silent: string[]; overeager: string[] }`, each sorted in code-unit order and each id listed once; the audit passes when all seven are empty and otherwise fails with the non-empty lists in its message.
- sourceScan: `scanFindingIds(srcRoot: string): SourceScan`, with `type SourceScan = { ids: string[]; unresolved: string[] }`, reads every `.ts` file under `src/` with the TypeScript scanner, so comments are skipped. A string literal or a template literal without substitutions whose whole text matches `^(conformance|honesty|extract)/[a-z][a-z-]*$` is an id, and one outside every registry is `unregistered`. A literal whose text matches `^(conformance|honesty|extract)/[a-z-]*$` but is no whole id, or a template literal whose text before its first substitution matches it, is `unresolved`, named `<file>:<line>`. The gate suite scans the real source tree.

## Example space
The world runs the audit function on the shipped probe table, on that table without the pair for the named check, or on that table with the named check's pair written twice, over the shipped registries and the scanned source. A check that behaves silently has its findings removed from every probe's run; one that behaves overeagerly has a finding added to every probe's run. A source that also writes an id adds it to the scanned source ids, and `nothing` adds none. The named ids are joined by a comma and a space, or `nothing` when the audit names none.

```gwt-vocabulary
Given the audit reads {table:"the shipped probe table"|"the shipped table without one pair"|"the shipped table with one pair twice"}
Given the check {findingId:string} behaves {behavior:"as shipped"|"silently"|"overeagerly"}
Given the engine source also writes {extraSourceId:string}
When the audit runs
Then the audit {verdict:"passes"|"fails"}
Then the audit names {named:string} as {list:"none"|"unpaired"|"duplicatePairs"|"unregistered"|"silent"|"overeager"}
```
