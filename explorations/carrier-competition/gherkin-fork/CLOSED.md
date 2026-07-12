# Gherkin extension/fork — closed on evidence

> **Ruling:** the escape test did not find a distinct carrier. A stock-compatible extension
> recreates delivery state as conventions inside opaque Gherkin fields; an incompatible fork is
> the own-grammar carrier on a heavier inherited parser chassis. This entrant therefore concedes
> the carrier competition.

## What this record is

The Libar Software Delivery Protocol models software-delivery intent as typed `Spec`s, derives one
graph from the authored model, and generates every consumer artifact from that graph. Its
executable machinery is already carrier-independent. The remaining competition asks which text
format should carry the authored `Spec` envelope, prose, and owned step notation.

The first two entrants built full evidence exhibits: [F2 Markdown](../f2-markdown/README.md) and
[C2 own grammar](../c2-grammar/README.md). This third entrant asks whether extending or forking
Gherkin is a genuinely different option. It was deliberately timeboxed because the source-level
reread in [FINDINGS §2, “The fork question”](../../executable-examples/FINDINGS.md)
had already reduced it to two familiar shapes. [Plan 15c](../../../plans/15c-carrier-gherkin-fork-closed.md)
therefore calls for a falsifiable escape test and an honest concession if the reduction holds,
not a full exhibit built for symmetry's sake.

This directory is evidence, not product. It adds no canonical authoring surface, parser dependency,
generated graph, runtime adapter, or product code.

## The standing reduction

The gen-1 source record separates static parsing from runtime matching and delivery-state
encoding. The stock parser was the least painful part. Runtime matching created most of the
recorded failure surface, and the Protocol has already replaced that half with generated step
contracts and framework adapters. The largest structural cost came from encoding delivery state
in tags and pseudo-fields, because the grammar had nowhere typed to put it. Those findings and
their supporting counts live in [FINDINGS §2, “The fork question”](../../executable-examples/FINDINGS.md).

That leaves two horns:

- A **compatible extension** keeps the stock grammar and puts the envelope and slot vocabulary in
  tags, descriptions, or comments. The parser preserves text, but Protocol meaning comes from a
  second convention parser — the recorded disease rather than an escape from it.
- An **incompatible fork** adds first-class envelope syntax to the grammar. It gives up stock
  ecosystem compatibility and reaches the same proposition as the C2 exhibit, while inheriting
  the larger generated-parser and localization chassis.

## The escape test

> _find a mechanism that gives `.feature` files a first-class typed envelope (kind · altitude ·
> readiness · relations) and a typed slot vocabulary, such that (i) the files still parse with
> stock `@cucumber/gherkin` unchanged — the compatible horn — and (ii) the mechanism is not
> re-parsing tags, descriptions, or comments with a second bespoke micro-parser — the
> pseudo-field disease._

Both clauses must hold. Dropping compatibility enters the incompatible horn; assigning Protocol
semantics to an opaque stock field fails the second clause.

## Upstream snapshot checked

The grammar walk is pinned to sources current for this session rather than to remembered Gherkin:

- [`@cucumber/gherkin` v41.0.0](https://github.com/cucumber/gherkin/releases/tag/v41.0.0), the
  current release on 2026-07-12.
- The official [Gherkin reference](https://cucumber.io/docs/gherkin/reference/), including its
  complete primary and secondary keyword inventory.
- The released [`.berp` grammar](https://github.com/cucumber/gherkin/blob/v41.0.0/gherkin.berp)
  and the classic matcher's
  [tag scanner](https://github.com/cucumber/gherkin/blob/v41.0.0/javascript/src/GherkinClassicTokenMatcher.ts).
- The pinned [Gherkin document schema](https://github.com/cucumber/messages/blob/a4cc6869acd683996ed323b08200189fd4a72947/jsonschema/src/GherkinDocument.schema.json),
  inspected for the shapes actually emitted for tags, descriptions, comments, Doc Strings, and
  tables.

The walk found no newer syntax point that changes the standing reduction.

## Probe 1 — envelope and slots in tags

[`probes/envelope-in-tags.feature`](probes/envelope-in-tags.feature) re-annotates the deliberately
messy import input rather than using a toy. It preserves the original tags, Background, Rule
blocks, plain scenarios, Scenario Outline, and Examples table from
[`6-import/legacy/create-order.feature`](../../executable-examples/6-import/legacy/create-order.feature).
Every structurally taggable `Spec` receives `@id`, `@kind`, `@altitude`, `@readiness`, and
`@refines` names; the outline also attempts `@slot:qty:number`-style declarations.

The compatible syntax works only in the shallowest sense: the stock matcher accepts each
whitespace-free tag, and the document schema returns a `Tag` whose meaningful source field is a
single string `name`. Neither the grammar nor the AST knows that `kind` is closed to eight values,
that readiness is ordered, that `refines` targets a `Spec` ID, or that `qty` is a numeric slot.
Recovering those facts requires parsing tag names again. The
[committed stock-parser run](probes/PARSE-RUN.txt) pins the compatible half mechanically: v41.0.0
parses this exact probe into two Rules and three scenarios/outlines with exit code 0.

The realistic table exposes a second boundary. Gherkin can tag an `Examples` block, but not an
individual table row. Rows receive parser-generated AST IDs, not authored `Spec` identities. The
Protocol's [import mapping](../../executable-examples/6-import/IMPORT-REPORT.md) lawfully expands
each row to one sibling example and flags generated names for human attention. A compatible
canonical carrier would instead have to choose among three non-escapes: treat the whole outline as
one multi-point example and violate the point-per-example law; split every row into a one-row
`Examples` block; or invent a point/id column and parse that convention. Tags therefore fail both
the typed-envelope and typed-slot parts of the escape test.

This is also the gen-1 shape, not a new carrier. [FINDINGS §2](../../executable-examples/FINDINGS.md)
records four formal-spec chapters — tag system, tag registry, spec evolution, and delivery
lifecycle — plus silent-failure traps that existed because delivery state used exactly this
encoding. A typo such as `@readines:scoped` still parses successfully as an opaque tag; nothing
can diagnose it until the second convention parser exists. That is the recorded “annotation
mistakes fail silently to zero” failure mode. The differentiation test has a direct answer:
**what does this carrier know that Gherkin does not? — nothing; it is Gherkin plus conventions.**
Clause (ii) fails.

## Probe 2 — envelope in descriptions

The official reference permits free-form descriptions below Feature, Rule, Background, Scenario,
and Scenario Outline. In the document schema each description is one string. Frontmatter-like
`kind: example` and `readiness: ready` lines would consequently remain prose until a second parser
recognized keys, decoded values, attached the block to its owner, and diagnosed duplicates or
misspellings.

That is the pseudo-field disease by construction. It changes the spelling of the convention, not
its epistemic status, and fails clause (ii).

## Probe 3 — envelope in comments

Comments survive parsing as top-level document records containing `location` and `text`. They do
not carry an owning Feature, Rule, Scenario, or Examples reference. A convention such as
`# sdp: kind=example` must therefore parse the text and infer ownership from position. Blank lines,
ordinary explanatory comments, and node movement all become attachment rules owned by the
Protocol.

This is a second micro-parser with weaker structural attachment than descriptions. It also returns
directly to one of the three grammar-quirk costs recorded in the
[fork-question evidence in FINDINGS §2](../../executable-examples/FINDINGS.md). Clause (ii)
fails again.

## Probe 4 — the current grammar surface

The complete released grammar and schema were checked, including constructs newer than the gen-1
starting point:

| Surface                                             | What stock Gherkin knows                                                 | Why it is not the escape                                                                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature, Rule, Scenario, Scenario Outline, Examples | Keyword, name, description, children, and selected tag attachment points | No typed descriptor or relation fields exist.                                                                                                                   |
| Background                                          | Description and steps                                                    | It has no tag collection and states execution context, not a `Spec` envelope.                                                                                   |
| Tags                                                | Location and opaque string name                                          | [Tag expressions](https://cucumber.io/docs/cucumber/api/#tags) query those names outside the document grammar; they do not type them.                           |
| Descriptions                                        | Free-form string                                                         | Structured fields require reparsing prose.                                                                                                                      |
| Doc Strings                                         | String content plus an optional media type                               | They are step arguments. A media label does not type an envelope or the step text's slots.                                                                      |
| Data Tables and Examples tables                     | Rows and string-valued cells                                             | Headers name placeholders but declare no scalar or union types; rows have no authored identity attachment point.                                                |
| `<placeholder>` references                          | Name substitution in outlines                                            | Types are neither declared nor checked in the authored document.                                                                                                |
| Parameter types                                     | Runtime/glue configuration                                               | The official [parameter-type mechanism](https://cucumber.io/docs/cucumber/configuration/#parameter-types) belongs to code outside the authored `.feature` file. |
| `# language:`                                       | Selection of a localized keyword dialect                                 | It changes parsing vocabulary, not delivery-state semantics.                                                                                                    |

Every available content-bearing point reduces to tags, descriptions, comments, or string payloads.
The released grammar contains no fourth first-class metadata surface and no authored slot type.

### Named non-escape — a sidecar envelope

A typed YAML sidecar beside an unchanged `.feature` file may look like a way around the grammar
inventory: stock parsing still works, and no tag, description, or comment is reparsed. It does not
satisfy the escape test. The envelope no longer belongs to the `.feature` file; one authored `Spec`
is split across two source homes, and a join keyed by file path, scenario name, or source position
becomes another attachment convention whose meaning stock Gherkin does not know. Renaming or
moving the Gherkin node can silently detach its envelope. The Examples-row problem also remains:
the sidecar must invent identities and attachment keys for rows that have no authored identity
surface in Gherkin.

The sidecar therefore abandons the single-carrier premise rather than creating a third horn. It is
Probe 3's positional-attachment disease with a file boundary added, and it cannot reopen this
carrier.

## Probe 5 — price the incompatible fork honestly

Adding envelope keywords to
[`gherkin.berp`](https://github.com/cucumber/gherkin/blob/v41.0.0/gherkin.berp) can make delivery
state real syntax, but the result no longer parses with stock Gherkin. The fork must carry grammar
changes through generated parser implementations and decide how its new keywords interact with the
[80 localized dialect entries](https://github.com/cucumber/gherkin/blob/v41.0.0/gherkin-languages.json)
present in v41.0.0. Existing formatters, editors, and other consumers do not recognize the new
language until they adopt the fork.

Once compatibility is surrendered, the distinguishing proposition is simply “a grammar for
delivery state” — exactly what the [C2 exhibit](../c2-grammar/README.md) already tests with a
minimal line-oriented surface and an explicit permanent ownership bill. A forked `.berp` chassis
does not create a third proposition; it makes that proposition heavier. Clause (i) fails.

## Concession ruling

The escape test failed on all five named probes. The compatible horn preserves stock parsing only
by asking a second parser to recover Protocol meaning from opaque strings. The incompatible horn
can make the envelope first-class only by forfeiting the compatibility that motivated the fork and
re-entering the own-grammar option.

The Gherkin extension/fork carrier therefore concedes the competition. This is a positive evidence
result: “why not extend Gherkin?” now has a falsifiable, source-pinned answer. Reopening the carrier
requires new evidence against a named probe — for example, a stock grammar release with a typed,
extensible node field and authored typed slots — rather than a new preference for familiar syntax.

## What survives the concession

Two useful results were never part of the fork and remain intact:

1. **`sdp import`.** The existing [one-way mapping](../../executable-examples/6-import/IMPORT-REPORT.md)
   shows how a devtool-only converter can use the stock parser to turn Feature, Rule, Scenario,
   Background, Scenario Outline, and Examples rows into an honest first draft. It never becomes a
   canonical parse path, never round-trips, and refuses to guess what Gherkin cannot know.
2. **Markdown prior art.** Cucumber's released
   [`GherkinInMarkdownTokenMatcher`](https://github.com/cucumber/gherkin/blob/v41.0.0/javascript/src/GherkinInMarkdownTokenMatcher.ts)
   is industrial evidence that Gherkin structures can live inside a Markdown document. That
   evidence belongs to the F2 column; it does not rescue a Gherkin fork.

## Docket for Plan 16

Plan 16 should judge this record on one question: **did the standing reduction survive a current,
falsifiable probe?** It did. This entrant is not to be compared against the five full-exhibit
deliverables after conceding; `CLOSED.md` is the planned alternative deliverable. Read this ruling
first, then the [realistic tag probe](probes/envelope-in-tags.feature) for the compatible horn's
authored shape.

Plan 16 must also reconcile the build-state ledger: the status headers for plans 14, 15a, 15b, and
15c still say `DRAFTED` although the first two carrier PRs have merged and this PR is open. This
exploration PR does not edit plan files because its scope fence forbids that change; the ruling
session should stamp the 15-family done-records or carry an explicit follow-up before relying on
the highest-numbered status header for “what now.”
