# Plan 46 S5 build

Built on `lane/46-build-s5` from `51c0276036c44a37bcd590ce8ce91e5a2ddd4794`. The final session report names the delivery commit.

## Built and bound

| Carrying Spec | Realization and binding |
| --- | --- |
| `spec:consumers.spec-studio.intent-panel` | `impl:protocol.studio-intent-panel`, `impl:protocol.studio-intent-panel-element`, `impl:protocol.studio-compose` and `impl:protocol.studio-scenario-editor` satisfy it. Every browsing page has the closed composing panel. Requests persist under the resolved page-root key, gather through native dialogs or example forms, and leave through copy or local download links. Pack requests retain their rendered membership and expand only against the stamped base. Unsupported requests remain visible and copyable apart. |
| `spec:consumers.intent-composition.proposal.memo` | `impl:protocol.studio-proposal-memo` and the document-realization anchor `impl:protocol.proposal-memo-recipe` satisfy it. Recipe 49 and the panel render the same proposal bytes, with verbatim fields, growing backtick delimiters and the full JSON document at the end. Schema diagnostics match recipe 38. |
| `spec:consumers.spec-studio.export` | `impl:protocol.studio-pack-export`, `impl:protocol.studio-expander` and `impl:protocol.studio-diagram-element` satisfy it. Every Pack gets an inline-styled, script-free HTML export. Copied ids, fragments, SVG markers and element references are prefixed. Disclosures open for print and restore afterward; a zoomed diagram prints its whole original drawing and restores its viewport. |
| `spec:consumers.spec-studio.publisher.watch` | `impl:protocol.studio-watch` satisfies it. It uses validate's event loop and awaits the ordinary Studio publication each cycle. Carrier events rerun it, source and input events do not, failed extraction removes publication, recovery continues, and SIGINT exits zero. The parser and help include the flag and refuse its combination with `--check-clean`. |
| `spec:consumers.spec-studio.responsive` | `impl:protocol.studio-frame` and `impl:protocol.studio-diagram-element` satisfy it. Layouts collapse below 720 CSS pixels, diagrams scale without losing boxes or edges, and their existing pan, zoom and pinch remain available. |
| `spec:consumers.edit-model` and `spec:consumers.intent-composition` | The panel model and element reference both. They realize composing and local hand-off. The applying caller's later source edits, git recording, changed-scope routing and clean-worktree validation are promises outside this browser implementation, so the promise pass retains `references`. `test:protocol.studio-intent-handoff` exercises the composing boundary without source writes or network requests. |

Four examples are bound through adopted generated registrars in `test/studio-s5.test.ts`, with a typed oracle for each parent space:

| Example | Test anchor |
| --- | --- |
| `spec:consumers.spec-studio.intent-panel.refresh-keeps-intents` | `test:protocol.studio-intents-refresh` |
| `spec:consumers.intent-composition.proposal.memo.shared` | `test:protocol.studio-memo-shared` |
| `spec:consumers.spec-studio.export.self-contained` | `test:protocol.studio-export-contained` |
| `spec:consumers.spec-studio.publisher.watch.matches-plain-run` | `test:protocol.studio-watch-plain` |

Each now states `ready` after binding and passing. Mutating each example's primary expected result in its generated contract made its registrar fail with `Spec Then parameters do not match the oracle payload`; restoring it restored the suite. The watch example compares every completed cycle, file by file, with a plain run over a copy of that cycle's corpus. Separate probes cover native-process SIGINT, failed-extraction recovery, ignored source/input events, unsupported Pack requests, storage refusal, malformed proposals, long memo delimiters, element references and print restoration.

## Spec questions

- `spec:consumers.spec-studio.export#rule.exportBytes` and `#rule.exportContent`: named browsing inputs can carry commits and timestamps. The stricter export-bytes rule wins here: exports render the graph-only Pack and member content, omitting base/run additions. A regression test holds their bytes unchanged when browsing inputs change. No carrier was rewritten.
- `spec:consumers.spec-studio.export#rule.exportContent`: an unresolved Pack member has no Spec page to copy. Its unresolved card remains in the Pack content; full member sections contain only recorded Specs, retaining their authored positions.
- `spec:consumers.edit-model` rules about ordinary source and git edits and `spec:consumers.intent-composition#rule.changedScope`: the applying caller's work is outside this composing implementation. The generic bindings therefore reference these designs.

## Measurements and evidence

Re-run measurements rather than inheriting them. The platform measurement uses a disposable clone at `b038bd4`; the original platform worktree was not changed. Run `node dist/cli/sdp.js studio /tmp/plan46-s5-platform`, then count files and bytes under its `generated/spec-studio` root. [measurements.json](assets/plan46-s5/measurements.json) records the result and each Pack export's size.

`npx vitest run test/studio-s5.test.ts test/recipes.test.ts test/self-hosting-graph.test.ts` runs the bound evidence, verbatim catalog body and oracle. `pnpm --silent sdp:q 'return {backlog: await recipes(1), drift: await recipes(2)}' --json` re-derives the operational state. The authored oracle accounts for 403 Specs, 7 Packs, 537 anchors, 947 nodes and 2525 edges; readiness is `{ defined: 4, idea: 5, ready: 393, scoped: 1 }`. Four retained warning rows belong to the broader Studio/component/navigation designs and `spec:model.spec-sections`.

The Impeccable mechanical detector returned no findings. Browser visual QA was unavailable: the browser URL policy refused the local `file://` page and explicitly prohibited workarounds. No browser visual result is claimed.

## Integration and gate

The common brief reserves skill edits to integration. Existing complete-coverage assertions require a recipe-49 task-table row in `sdp-agent-surface` and a pointer beside the proposal workflow in `sdp-sessions`. A narrow exception for those two pointers is pending; neither assertion is relaxed.

The first full gate reached all tests and found that on-ramp gap plus two older browsing-only assertions that included the new exports. The browsing assertions now exclude exports, whose own suite checks their separate document contract. The final full-gate attempt has 2,706 passing pooled tests and exactly the two recipe-49 on-ramp failures. The dedicated CLI pass has 100 passing tests. The subsequent self-hosting gate checks, all projection cleanliness checks, example checks and preflight pass. The full gate remains non-green until the two pointers are added.

No push, merge, edit to another lane or integration checkout, or change to the platform source was made. Broader Studio parent/component binding closure and handbook updates remain integration work.
