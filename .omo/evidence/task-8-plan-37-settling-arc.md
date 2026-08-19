# Task 8 - consumers adoption evidence

## Outcome

REFUSED all five sites, by family. The authored suite was restored unchanged; no generated sibling was force-added.

This is recorded freeze-friction for the arc: the frozen registrar interface cannot host these points honestly with the already-generated siblings. `src/testing/index.ts:38` computes `missingConditions` from the registrar's hardcoded `requiredConditions` before `createWorld` runs, and `completeRunnableExample` refuses oracle comparison before `assertions` can run. This is a registrar-contract refusal, not an adapter misunderstanding or product-behavior failure.

## Per-example adapter/Outcome mappings

The following are exact sibling registration shapes, authored partial points, and the adapter mapping that would work if the frozen completeness check allowed family-specific points.

### `consumers.agent-surface.scripted-context-body`

(a) Sibling registrar's hardcoded requirement and point:

```ts
registerRunnableExample(
  scriptedContextBodyContract,
  { specId: "spec:orders.create-order", body: "composing that spec's verifier bindings" },
  ["specId", "concept", "file", "unrecordedFile", "body"],
  adapters,
  bindings,
);
```

(b) The authored example supplies the partial point `{ specId: "spec:orders.create-order", body: "composing that spec's verifier bindings" }`.

(c) Missing dimensions are `concept`, `file`, and `unrecordedFile`.

(d) Natural mapping absent the completeness requirement: `createWorld: frontDoorWorld` would own the corpus root and point values; `invoke: invokeFrontDoor` would call `runSdpCli` with the scripted body; `observe: observeFrontDoor` would return the exit-code Outcome; `expected: expectedFrontDoor` would select the comparator-owned oracle Then and return the exact selected Outcome object `{ kind: "the front door exits {exitCode} with an empty error stream", exitCode: 0 }` (the sibling's `AgentSurfaceOutcome` variant); `assertions: assertScriptedContextBody` would join the printed-answer and anchored-versus-declared-verifier Thens.

### `consumers.agent-surface.demand-map-entries`

(a) Sibling registrar's hardcoded requirement and point:

```ts
registerRunnableExample(
  demandMapEntriesContract,
  {
    concept: "backorder",
    file: "src/create-order.ts",
    unrecordedFile: "src/price-book.ts",
    body: "reaching every entry point the demand map names",
  },
  ["specId", "concept", "file", "unrecordedFile", "body"],
  adapters,
  bindings,
);
```

(b) The authored example supplies the partial point `{ concept: "backorder", file: "src/create-order.ts", unrecordedFile: "src/price-book.ts", body: "reaching every entry point the demand map names" }`.

(c) Missing dimension is `specId`.

(d) Natural mapping absent the completeness requirement: `createWorld: frontDoorWorld` would own the corpus root and demand-map point values; `invoke: invokeFrontDoor` would call `runSdpCli`; `observe: observeFrontDoor` would return the concept-entry Outcome; `expected: expectedFrontDoor` would select the comparator-owned oracle Then and return the exact selected Outcome object `{ kind: "the concept entry answers with the spec {conceptSpecId}", conceptSpecId: "spec:orders.order-management" }` (the sibling's `AgentSurfaceOutcome` variant); `assertions: assertDemandMapEntries` would join exit code, file entry, changeset/coverageUnknown, and absent symbol-entry assertions.

### `consumers.reader.concept-entry`

(a) Sibling registrar's hardcoded requirement and point:

```ts
registerRunnableExample(
  conceptEntryContract,
  { concept: "backorder", conceptSpecId: "spec:orders.order-management", entry: "concept" },
  ["concept", "conceptSpecId", "boundFile", "bindingId", "unrecordedFile", "entry"],
  adapters,
  bindings,
);
```

(b) The authored example supplies the partial point `{ concept: "backorder", conceptSpecId: "spec:orders.order-management", entry: "concept" }`.

(c) Missing dimensions are `boundFile`, `bindingId`, and `unrecordedFile`.

(d) Natural mapping absent the completeness requirement: `createWorld: readerWorld` would own the corpus root and concept point; `invoke: invokeReader` would perform `extract` plus `createReader`, then call `findByConcept`; `observe: observeReader` would return the matched-id/field Outcome; `expected: expectedReader` would select the comparator-owned oracle Then and return the exact selected Outcome object `{ kind: "the reader names {matchedId} as a match on the field {matchedField}", matchedId: "spec:orders.order-management", matchedField: "sections.behavior" }` (the sibling's `ReaderOutcome` variant); `assertions: assertConceptEntry` would join the match-count and recorded-context premise assertions.

### `consumers.reader.file-entry`

(a) Sibling registrar's hardcoded requirement and point:

```ts
registerRunnableExample(
  fileEntryContract,
  { boundFile: "src/create-order.ts", bindingId: "impl:orders.create-order", entry: "file" },
  ["concept", "conceptSpecId", "boundFile", "bindingId", "unrecordedFile", "entry"],
  adapters,
  bindings,
);
```

(b) The authored example supplies the partial point `{ boundFile: "src/create-order.ts", bindingId: "impl:orders.create-order", entry: "file" }`.

(c) Missing dimensions are `concept`, `conceptSpecId`, and `unrecordedFile`.

(d) Natural mapping absent the completeness requirement: `createWorld: readerWorld` would own the corpus root and file point; `invoke: invokeReader` would perform `extract` plus `createReader`, then call `byFile`; `observe: observeReader` would return the node-id Outcome; `expected: expectedReader` would select the comparator-owned oracle Then and return the exact selected Outcome object `{ kind: "the file entry names the node {nodeId} the graph records at that path", nodeId: "impl:orders.create-order" }` (the sibling's `ReaderOutcome` variant); `assertions: assertFileEntry` would join the reached-spec and spec-carrier assertions.

### `consumers.reader.changeset-entry`

(a) Sibling registrar's hardcoded requirement and point:

```ts
registerRunnableExample(
  changesetEntryContract,
  {
    boundFile: "src/create-order.ts",
    bindingId: "impl:orders.create-order",
    unrecordedFile: "src/price-book.ts",
    entry: "changeset",
  },
  ["concept", "conceptSpecId", "boundFile", "bindingId", "unrecordedFile", "entry"],
  adapters,
  bindings,
);
```

(b) The authored example supplies the partial point `{ boundFile: "src/create-order.ts", bindingId: "impl:orders.create-order", unrecordedFile: "src/price-book.ts", entry: "changeset" }`.

(c) Missing dimensions are `concept` and `conceptSpecId`.

(d) Natural mapping absent the completeness requirement: `createWorld: readerWorld` would own the corpus root and changeset point; `invoke: invokeReader` would perform `extract` plus `createReader`, then call `blastRadius`; `observe: observeReader` would return the impacted-spec/binding/claim Outcome; `expected: expectedReader` would select the comparator-owned oracle Then and return the exact selected Outcome object `{ kind: "the impacted specs name {impactedSpecId} through the binding {impactBindingId} at claim {impactClaim}", impactedSpecId: "spec:orders.create-order", impactBindingId: "impl:orders.create-order", impactClaim: "anchored" }` (the sibling's `ReaderOutcome` variant); `assertions: assertChangesetEntry` would join at-risk edge/count and coverageUnknown assertions.

## Per-family ledger

Each row is an explicit freeze-friction record; refusal is complete and does not authorize changing the frozen registrar machinery.

| Family | Sites | Outcome | Freeze-friction evidence | Generated siblings |
| --- | --- | --- | --- | --- |
| `consumers.agent-surface` | `scripted-context-body`, `demand-map-entries` | REFUSE | Both siblings hardcode all five parent-space conditions; the two authored points omit `concept/file/unrecordedFile` and `specId` respectively, so oracle comparison is refused before the natural front-door adapter mapping can run. | None force-added; both refused. |
| `consumers.reader` | `concept-entry`, `file-entry`, `changeset-entry` | REFUSE | All three siblings hardcode all six parent-space conditions; the authored points omit the unrelated dimensions listed above, so oracle comparison is refused before the natural extract/reader adapter mapping can run. | None force-added; all three refused. |

## Registration red failures

The attempted adapter rewrite was restored afterward. These are the five individual registration failures, verbatim from the focused run:

### scripted-context-body

```text
Error: at step: Then the front door exits 0 with an empty error stream
scenario spec:consumers.agent-surface.scripted-context-body: oracle comparison refused for incomplete point; missing Conditions: "concept", "file", "unrecordedFile"
```

### demand-map-entries

```text
Error: at step: Then the front door exits 0 with an empty error stream
scenario spec:consumers.agent-surface.demand-map-entries: oracle comparison refused for incomplete point; missing Conditions: "specId"
```

### concept-entry

```text
Error: at step: Then the reader names spec:orders.order-management as a match on the field sections.behavior
scenario spec:consumers.reader.concept-entry: oracle comparison refused for incomplete point; missing Conditions: "boundFile", "bindingId", "unrecordedFile"
```

### file-entry

```text
Error: at step: Then the file entry names the node impl:orders.create-order the graph records at that path
scenario spec:consumers.reader.file-entry: oracle comparison refused for incomplete point; missing Conditions: "concept", "conceptSpecId", "unrecordedFile"
```

### changeset-entry

```text
Error: at step: Then the impacted specs name spec:orders.create-order through the binding impl:orders.create-order at claim anchored
scenario spec:consumers.reader.changeset-entry: oracle comparison refused for incomplete point; missing Conditions: "concept", "conceptSpecId"
```

## Anchor-pin record

Refusal leaves each oracle pin on its existing `bindExample(...)` value. No `register` replacement is recorded or activated for a refused example; `anchors.ts` was not edited.

| Site | Exact current `site:` string from `test/self-hosting-oracle/anchors.ts` | Replacement | Anchor id | Result |
| --- | --- | --- | --- | --- |
| scripted-context-body | `bindExample(scriptedContextBodyContract` | None - existing `bindExample(...)` retained | `test:protocol.agent-surface.scripted-context-body` | REFUSED |
| demand-map-entries | `bindExample(demandMapEntriesContract` | None - existing `bindExample(...)` retained | `test:protocol.agent-surface.demand-map-entries` | REFUSED |
| concept-entry | `bindExample(conceptEntryContract` | None - existing `bindExample(...)` retained | `test:protocol.reader.concept-entry` | REFUSED |
| file-entry | `bindExample(fileEntryContract` | None - existing `bindExample(...)` retained | `test:protocol.reader.file-entry` | REFUSED |
| changeset-entry | `bindExample(changesetEntryContract` | None - existing `bindExample(...)` retained | `test:protocol.reader.changeset-entry` | REFUSED |

## Verification transcripts

Happy path after restoring the refused suite:

```text
$ npx vitest run test/self-hosting-consumers.test.ts
 RUN  v4.1.10 ...
 Test Files  1 passed
 Tests  5 passed
```

WRONG-IMPORT PROBE: temporarily changed the scripted contract import to the nonexistent `.contract.missing.js` path.

```text
$ npx vitest run test/self-hosting-consumers.test.ts
 FAIL  test/self-hosting-consumers.test.ts (0 test)
Error: Cannot find module '../generated/contracts/consumers.agent-surface.scripted-context-body.contract.missing.js'
```

Restored the import and reran the focused test: 1 file passed, 5 tests passed.

## Freshness and scope

All five generated siblings were newer than `git log -1 --format=%cd -- specs/`:

```text
sibling=1787158017  specs-head=1786847368
```

(the same values held for each of the five siblings). None were staged because refusal is complete and no adoption occurred. `git diff --name-only -- test/self-hosting-consumers.test.ts` is empty; no `specs/` path is modified. The shared worktree currently contains unrelated concurrent changes in `test/self-hosting-pack-markdown.test.ts` and `test/self-hosting-sdp-import.test.ts`; this lane did not modify them.

## Adversarial probes

- `stale_state`: REFUSED; generated sibling freshness is checked and is newer than the latest specs commit, so stale generated output is not a basis for adoption.
- `misleading_success_output`: REFUSED; each registrar's explicit incomplete-point error prevents a green result from being mistaken for adapter coverage.
- `dirty_worktree`: REFUSED; unrelated concurrent suite changes remain visible and were not staged or touched by this lane.

## Cleanup

- Restored `test/self-hosting-consumers.test.ts` byte-for-byte.
- Restored the intentionally broken import after the WRONG-IMPORT PROBE.
- No generated sibling, spec, helper, oracle, anchor, recipe, or other suite was edited.
- No commit or push performed.

{"task":"st_01a01af3","changed_files":[".omo/evidence/task-8-plan-37-settling-arc.md"],"tests":["npx vitest run test/self-hosting-consumers.test.ts (5 passed)","WRONG-IMPORT PROBE red, import restored, focused run green"],"manual_qa":"All five generated registrar attempts reproduced their individual frozen required-condition refusals; five expected: mappings and exact selected Outcome objects are recorded; no adoption pins activated.","cleanup":"Evidence-only update; suite and probe import remain restored; no siblings force-added; no product files or git operations performed.","risks":"Adoption remains blocked until generated registrar required conditions are scoped per authored point or the frozen machinery is changed by its owner."}
