---
id: spec:extraction.entry-citations
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:extraction.derive-graph
  dependsOn:
    - target: spec:extraction.entry-locations
      reason: the citation table is the location table's sibling, and a resolving citation names an entry it locates
    - target: spec:model.anchors
      reason: only a source file that carries an anchor is read for citations
    - target: spec:validation.prose-mentions
      reason: a citation is a token the prose-mention scan would read, and resolves by the same address rules
    - target: spec:extraction.claim-taxonomy
      reason: every citation carries the inferred claim
  constrainedBy: spec:extraction.determinism
---
# The graph records where anchored source cites an entry address

A test that checks a pinned declaration names the entry in its own text, often as the test's title, and the graph does not see that link: a reader of the declaration finds the suite's file through its anchor but not the assertion. The first adopter's type test names each comparison by the address of the Design entry it binds (`libar-platform/tests/types/pinned.test-d.ts`), and a reader of its pages could not find the comparison for one declaration. The extractor already reads every anchored source file for its anchors, so it records where such a file writes an entry address, and a page or a recipe shows the line that checks a declaration.

A citation is where text names an entry, read by the machine from comments and strings. It carries the `inferred` claim and confers nothing, and it sits in a table beside the location table, as a position does. A citation is inferred location data in the graph. It adds no node or edge, confers no delivery fact, moves no readiness floor, feeds no Protocol validator and records no test verdict.

## Intent
- problem: A test that checks one pinned declaration names its entry address only in its own text, so no view links the declaration to the line that checks it, and a reader holding the declaration cannot find its assertion.
- outcome: Record each entry address an anchored source file cites, with its file and line, as an inferred citation that confers nothing, so a view can show the test line that checks a pinned declaration.

## Behavior
- rule: [#anchoredFilesOnly] The extractor reads citations from each source file it reads for anchors that carries at least one anchor, of either form and any namespace, after the same exclusions; a file that carries no anchor, a carrier and any other file is not read for citations.
- rule: [#citationToken] A citation is a token the prose-mention scan would read as a mention, found anywhere in such a file's text, in a comment, a string or a template literal, that holds `#`; a token directly followed by `${` is the prefix of a computed address and records no citation, whether or not the prefix parses as an entry address; a bare Spec id is not a citation.
- rule: [#citationRow] Each citation records the address as written, the file's root-relative path and the 1-based line the token starts on; one address written twice on one line is one row.
- rule: [#citationTable] The citations ride in a table of their own beside the location table, sorted and deterministic as the graph is, and Primitive and Pack nodes stay free of them.
- rule: [#inferredClaim] The table's definition gives every citation the `inferred` claim, and every reader row of a citation carries it, so no consumer reads a citation as an authored binding.
- rule: [#confersNothing] A citation mints no node or edge, confers no delivery fact, moves no readiness floor, feeds no Protocol validator and records no verdict on the citing file; removing every citation changes no node, edge, fact, floor or finding.
- rule: [#readerRows] The reader resolves each citation by the rules address resolution applies, and the Spec context carries the citations whose address names that Spec as its entry citations, each with the entry it names, whether it resolves and why not, the citing file and line, the anchors recorded at that file and those of them that are test anchors verifying the Spec.
- rule: [#declarationLines] Those rows let a view show, beside each pinned declaration of a Spec, the anchored lines that cite it, with no join of its own; a row reads as a test line only when a `test:` anchor at its file verifies the cited Spec, directly or through an example that verifies it, every other row stays a citation with its file and line, and no row says what a test asserts or whether it passed.
- rule: [#citationRecipe] Entry citations, recipe 51, lists for a Pack, a list of Specs or the corpus each pinned declaration and every other cited entry with the lines that cite it, and every citation that does not resolve, and answers each citation that does not resolve, and only those, as a finding, so a corpus may name the shipped file as a rules file.
- rule: [#unresolvedReports] An unresolved citation stays in the table and reports only through the reader's rows and the recipe's answer, never as a Protocol finding: whether it fails a gate is the corpus's choice of rules file.

## Design
- citationTable: `citations?: readonly { address: string; file: string; line: number }[]` on the graph schema beside `locations`, rows sorted by `file`, then `line`, then `address`, in code-unit order; an absent table reads as empty, and the field is additive, so the schema version's minor part rises.
- citationAddress: `address` is the token as the prose-mention scan cuts it, its trailing punctuation removed; the sections it may name are the package's exported `ENTRY_ADDRESS_SECTIONS`, so an address section the grammar gains is read with no change here.
- readerCitation: `entryCitations: readonly { address: string; entry: string | null; resolves: boolean; reason: "malformed" | "section" | "entry" | null; file: string; line: number; anchors: readonly string[]; testAnchors: readonly string[]; claim: "inferred" }[]` on the Spec context, for every row whose address's Spec part, the text before its `#`, is this Spec's id, where `entry` is the location-table entry the address names, such as `design.<key>` or `rule[<i>]`, or null when it does not resolve, `reason` is address resolution's reason for a miss, `anchors` lists the ids of the anchors recorded at `file` in code-unit order, and `testAnchors` lists those of them that are `test:` anchors verifying this Spec, directly or through an example that verifies it; rows sort by `address`, then `file`, then `line`.
- citationsRecipe: recipe 51, entry citations, takes at most one scope, `params.pack` or `params.specs`, the whole corpus with neither, and `params.severity`, `"error"` by default or `"warning"`; both scopes, an id that does not resolve or another severity returns `{ diagnostics: [{ parameter, problem }] }` and no findings.
- citationsAnswer: `{ scope, totals: { citations, citedEntries, declarations, citedDeclarations, unresolved }, entries, unresolved, findings }`, where `scope` is `{ corpus: true }`, `{ pack }` or `{ specs }`, and the totals count within the scope: the citations whose Spec part names a Spec in it, the entry rows that some citation names, the pinned declarations, those an anchored line cites, and the unresolved rows.
- entryRow: `{ address, spec, pinned, line, citedBy: [{ file, line, anchors, testAnchors }] }`, one per pinned declaration in scope and per other entry in scope that a citation names, sorted by `address`; `line` is the entry's own recorded line or null, `citedBy` sorts by `file`, then `line`, and an uncited pinned declaration has an empty `citedBy`.
- unresolvedRow: `{ address, reason, file, line }`, one per citation that does not resolve whose Spec part names a Spec in scope, or every such citation with no scope, `reason` being address resolution's, `spec` for an absent Spec; rows sort by `file`, then `line`, then `address`.
- citationFinding: `{ validatorId: "unresolved-citation", subjectId, severity, message, file, line }` for each unresolved row, in that order, where `subjectId` is the address, `file` and `line` the citing site, and `message` reads `<address> cited at <file>:<line> does not resolve: <why>`, `<why>` as address resolution's finding words it.

## Example space
```gwt-vocabulary
Given a probe corpus whose Spec pins the declaration {declaration:string}
Given a source file that {anchored:"carries a test anchor verifying the Spec"|"carries a code anchor referencing the Spec"|"carries no anchor"} and names the address {address:string} on line {line:number}
When the graph is derived
Then the Spec context lists {citations:number} entry citations
Then the citation {recorded:"resolves"|"does not resolve"|"is not recorded"}
Then the citing line reads as a test line: {testLine:boolean}
Then the shipped entry-citations file named as a rules file exits {exitCode:number}
```
