# Remaining pin failures

Final `npm test`: 80 suites pass, two suites fail; 1865 tests pass and 24 fail. Every remaining failure reads a frozen oracle or a literal corpus pin. No oracle file, self-hosting-graph test or CLI warning pin is edited. All CLI tests pass.

| Suite | Exact test name | Class and reason |
| --- | --- | --- |
| `test/recipes.test.ts` | returns exact component uses fan-in and fan-out from the structural oracle | pin, Imported expectedUsesEdges omits the lane-added component:protocol.cli to component:protocol.adapters edge. |
| `test/self-hosting-graph.test.ts` | reports exactly the retained honesty gap and three unbacked prose mentions | pin, The warning pin still expects the old set; current findings are the kept gap and six intended question-link mentions. |
| `test/self-hosting-graph.test.ts` | holds the frozen corpus totals | pin, Literal Spec, anchor, node, edge and binding totals predate the refresh. |
| `test/self-hosting-graph.test.ts` | rosters exactly the authored Spec, Pack, and anchor node ids | pin, Oracle rosters lack the new captures and bindings and retain deleted identities. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the carrier family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the protocol family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the extraction family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the validation family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the model family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the observation family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the consumers family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | carries the authored descriptors of the decisions family | pin, The corresponding family oracle pins predate refreshed title, narrative, sections, readiness or delivery facts. |
| `test/self-hosting-graph.test.ts` | leaves no authored Spec outside the families | pin, The expected family roster lacks the newly captured Specs. |
| `test/self-hosting-graph.test.ts` | derives exactly the authored declared relations | pin, declared-relations.ts predates the relation additions, replacements, reasons and exercised rule keys. |
| `test/self-hosting-graph.test.ts` | holds the frozen stated-readiness distribution | pin, The readiness histogram predates delegated example, design-maturity and sink statements and the parked signal. |
| `test/self-hosting-graph.test.ts` | derives the Pack membership edges from the manifest, in manifest order | pin, Pack membership pins predate regrouping, deletion and capture additions. |
| `test/self-hosting-graph.test.ts` | carries the Pack aggregate nodes exactly as authored | pin, Pack framing, authored member order and modelRefs pins are stale. |
| `test/self-hosting-graph.test.ts` | derives the independent zero-to-many binding edge roster | pin, anchors.ts binding targets predate the lane changes and restored/added integration bindings. |
| `test/self-hosting-graph.test.ts` | gives every owned impl/api CodeNode exactly one component | pin, The oracle exception set has not yet excluded document-realization recipe anchors removed from the reader component. |
| `test/self-hosting-graph.test.ts` | derives exactly the sparse authored component uses edges | pin, The structural oracle lacks the CLI-to-adapters edge. |
| `test/self-hosting-graph.test.ts` | covers every accepted architecturally significant unit | pin, The accepted-unit roster predates new CLI/validator identities, reader-impact deletion and recipe component removals. |
| `test/self-hosting-graph.test.ts` | finds every converted comment anchor at its block's first line | pin, expectedCommentAnchorIds still includes removed impl:protocol.reader-impact. |
| `test/self-hosting-graph.test.ts` | projects every anchor and code node at the line its declaration occupies | pin, The anchor roster retains removed reader-impact and stale moved anchor file/site records. |
| `test/self-hosting-graph.test.ts` | keeps every anchor beside the site it binds | pin, The old authoring-recipes roster points to the skills suite after those anchors moved to the recipe suite. |
