# F2 Markdown carrier exhibit

This directory is evidence for plan 14's carrier competition, not product code. The TypeScript
DSL remains the sole canonical authoring surface while this exhibit asks whether plain
`.sdp.md` can carry the envelope, prose, and owned step notation across the full maturity arc.
The spike reifies documents into the extractor seam, then uses the Protocol's real graph,
readiness-floor, contract-codegen, runner, and Vitest machinery.

## Run the evidence

The two green verification commands are cwd-independent:

```bash
npx tsc -p explorations/carrier-competition/f2-markdown
npx vitest --run -c explorations/carrier-competition/f2-markdown/vitest.config.ts
```

Run the deliberately failing drift exhibit separately:

```bash
SDP_F2_RED=1 npx vitest --run -c explorations/carrier-competition/f2-markdown/vitest.config.ts
```

`executable/GREEN-RUN.txt`, `executable/RED-RUN.txt`, and `spike/SPIKE-OUTPUT.txt` preserve the
captured evidence. The red failure names the authored Then step and shows 100 received against
150 expected after a one-line document edit with zero test-side edits.

## Deliverable map

| Competition bar | Files |
|---|---|
| In-place maturity arc and executable `ready` form | `arc/`, `specs/orders.create-order*.sdp.md`, `executable/`, `spike/emitted/` |
| Prose-heavy and structure-heavy kinds | `specs/decisions.order-lifecycle.sdp.md`, `specs/orders.order-model.sdp.md`, `specs/orders.create-order.api-contract.sdp.md` |
| Table sugar and static point-per-example expansion | `table-sugar/`, `spike/expand-table.ts`, `spike/table-expansion.test.ts` |
| Twelve-axis self-score and import posture | `SCORECARD.md`, `IMPORT-NOTES.md` |
| CLI feedback sketch | `DIAGNOSTICS.txt` |
| F2 posture evidence | `envelope.schema.json`, `PROSE-IN-GRAPH.md` |

## Document-to-graph mapping

| `.sdp.md` form | Reified graph content |
|---|---|
| Frontmatter | `id`, `kind`, `altitude`, `readiness`, declared relations |
| First H1 | `title` |
| `## Intent` list | `sections.intent` |
| `## Model` term list | `sections.model.terms` |
| `## Decision` list | `sections.decision` |
| `## Verification — executable` | `sections.verification` |
| `gwt-vocabulary` fence | `sections.behavior.exampleSpace` |
| `gwt` fence | prose or structured `sections.behavior.examples` evidence |
| `gwt-table` fence | pre-graph static expansion to N sibling example Specs |

The micro-parser is deliberately a subset with no recovery grammar and no dependency: flat
frontmatter scalars, one nested relations map, the demonstrated section conventions, and the two
step fences. It proves the carrier seam; it is not the document parser implementation. In
particular, relation-list syntax is named but not built, and `deriveGraph` is reached through a
relative deep import because that seam is not public today. Every multi-declaration form the
subset does not carry — a repeated relation type, envelope field, section heading, or a second
`gwt`/`gwt-vocabulary` fence — **refuses loudly instead of last-wins**, so the spike can never
silently lose authored content (`spike/subset-honesty.test.ts` pins each refusal; a product
parser would emit findings instead of throwing).

## Envelope typing posture

An authored document can point at the generated-style schema from frontmatter:

```yaml
# yaml-language-server: $schema=./envelope.schema.json
```

The schema copies descriptor and relation enums from the Protocol and derives its id unions from
the real checkout graph. The honest gap is editor wiring: YAML embedded in Markdown needs a file
association or frontmatter-aware extension before the stock YAML language server applies the
modeline. This exhibit names that posture question; it does not pretend every editor activates it
automatically.

## Does plain `.sdp.md` suffice at MVP?

For this bar, yes: CommonMark plus frontmatter plus owned fenced blocks carries the minimum idea,
the full readiness arc, prose-heavy decisions, structure-heavy model/contract content, bound
examples, and table sugar. Nothing in the exhibit required MDX. Interactive dials and harnesses
remain projections from the graph; if a later authoring need truly requires an island, it can earn
one without making MDX the MVP carrier.

## House rules and named non-rulings

Everything here stays below `explorations/`; no product source, canonical example, concept doc,
or root configuration is changed. Generated-looking artifacts are committed only as mechanical
evidence and checked byte-for-byte. The exhibit uses the ratified language; *notation* and
*carrier* remain flagged candidate terms pending the ruling session. It does not rule
prose-in-graph, kind-partitioned dual authoring, frontmatter editor association, or the long-term
role of the TypeScript DSL.
