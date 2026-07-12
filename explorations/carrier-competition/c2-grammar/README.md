# C2 own-grammar carrier exhibit

This directory is evidence for plan 14's carrier competition, not product code. The TypeScript DSL
remains the sole canonical authoring surface while the exhibit asks whether an owned `.sdp`
language should carry the envelope, prose, and step notation. A deliberately small parser reifies
the grammar into the extractor seam, then hands it to the Protocol's real graph, readiness-floor,
contract-codegen, runner, and Vitest machinery.

The proposition is identity maximalist: **a grammar for delivery state**. The descriptors and
relations do not decorate another document language; they are syntax. `OWNERSHIP.md` records the
corresponding permanent bill. The exhibit names that trade-off for plan 16 and does not rule it.

## Run the evidence

Generate the real checkout artifacts once, then run the two green checks from any working
directory:

```bash
npm install && npm run build && npm run generate:example
npx tsc -p explorations/carrier-competition/c2-grammar
npx vitest --run -c explorations/carrier-competition/c2-grammar/vitest.config.ts
```

Run the deliberately failing drift proof separately:

```bash
SDP_C2_RED=1 npx vitest --run -c explorations/carrier-competition/c2-grammar/vitest.config.ts
```

`executable/GREEN-RUN.txt`, `executable/RED-RUN.txt`, and `spike/SPIKE-OUTPUT.txt` preserve the
captured evidence. The red path is grammar file → spike reification → generated contract → bound
assertion, with zero test edits. It uses a document copy because competition law keeps TypeScript
canonical until a carrier is ruled.

## Deliverable map

| Competition bar | Evidence |
|---|---|
| In-place maturity arc and executable `ready` | `arc/`, the two live `specs/orders.create-order*` files, `executable/`, `spike/emitted/` |
| Prose-heavy and structure-heavy kinds | decision, model, and contract files under `specs/`, each field-diffed against the real graph |
| Table sugar and point-per-example expansion | `table-sugar/`, `spike/expand-table.ts`, `spike/table-expansion.test.ts` |
| Twelve-axis score and import posture | `SCORECARD.md`, `IMPORT-NOTES.md` |
| CLI feedback sketch | `DIAGNOSTICS.txt` |
| C2 posture evidence | `OWNERSHIP.md`, `PROSE-NOTES.md`, `spike/subset-honesty.test.ts` |

## Grammar-to-graph mapping

| `.sdp` form | Reified graph content |
|---|---|
| `spec orders.create-order` | `id: "spec:orders.create-order"` |
| `behavior · feature · ready` | `kind`, `altitude`, `readiness` |
| one indented relation per line | declared relation edges with `declared` claim |
| first unindented prose line | `title` |
| `intent`, `model`, `decision`, `verification` blocks | their same-named typed sections |
| `example space` | `sections.behavior.exampleSpace` with typed slot declarations |
| top-level Given/When/Then group | one structured `sections.behavior.examples` bound point |
| `rule` | `sections.behavior.rules` |
| `cases` | static pre-graph expansion to N sibling example Specs |

The parser is an indentation-sensitive subset with no recovery and no dependency. It proves the
carrier seam; it is not a product parser. Unsupported or repeated structural forms throw instead
of guessing or replacing earlier content. `subset-honesty.test.ts` pins that refusal, while the
table tests pin malformed-separator, short-row, and point-collision refusal. A product parser would
emit source-located findings and preserve independently valid declarations.

`deriveGraph` is reached through a relative deep import because the reified-input seam is not
public today. Running a standalone `.mjs` file against `dist` was therefore considered and rejected;
the local Vitest configuration supplies both that seam and the package aliases the executable proof
needs.

## What the spike proves

- Five grammar documents derive the committed graph fragment.
- The decision, model, and contract ports match their real graph nodes field-for-field after only
  the named carrier-relative `file` normalization; their declared edges match too.
- The final example matches after dropping only derived delivery facts. The parent differs only in
  its honest `ready` statement versus the real TypeScript spec's honest `defined` statement.
- Both final nodes and all eight staged snapshots clear the real readiness floor when spliced into
  the real graph.
- The grammar-derived step contract and parent space contract are byte-identical to the real
  generated artifacts.
- Three table rows become three one-point example nodes, and every stated readiness clears its
  floor.
- Free prose omitted by the spike is counted, never silently forgotten.

## Named for the ruling, deliberately not ruled here

- **Envelope as syntax versus frontmatter.** This file family demonstrates the syntax side.
- **Prose delimitation and prose in the graph.** `PROSE-NOTES.md` records the evidence and points to
  the shared options without inventing a second proposal.
- **Permanent ownership.** `OWNERSHIP.md` prices the grammar, parser, formatter, highlighting,
  rendering, editor, and LSP obligations; it builds none of them as exhibit theater.
- **The authored surface.** No `.sdp` discovery path is added to product code, and no source of
  system truth moves during the competition.
- The terms *notation* and *carrier* remain flagged candidates pending plan 16.

Everything stays below this exploration directory. No product source, canonical example, concept
document, dependency, or root configuration changes.
