## The next work, from the roadmap

Roadmap: The next units `pack:roadmap`

A trial roadmap written from the next units of the design roadmap file, round 5, in its order. The history view's build comes first: its projection waits only for the owner's statement, and its paused rebuild also waits for one open decision. Baselines and migration come next, then the restore procedure and its drill. The adopter-facing cut has no Spec yet, so it joins once captured. The order is a preference; what each entry still needs is read from the graph.

This Pack's order is reading order, not a stated priority.

### To design

No entry needs design.

### To state

| Place | Entry | Earlier waiting statements | Why now |
| --- | --- | --- | --- |
| 1 | History projection `spec:application.history-projection` | in this entry `spec:decisions.d04-four-outcomes`, `spec:decisions.d02-context-owns-state-and-journal`, `spec:decisions.d08-read-models-in-command`, `spec:decisions.d05-rebuildable-history-with-baselines`, `spec:decisions.d09-rebuild-online-by-default`, `spec:decisions.d19-operations-travel-with-capability`, `spec:decisions.d18-everything-else-waits-for-trigger`; on the roadmap `spec:decisions.d03-events-only-source-of-next-state` (place 4), `spec:context.event-envelope` (place 3); 15 outside the roadmap | Pin the history form of a projection, which folds the events of several streams into one row that the live path and the backfill write alike (E-9, D8, D9). Waited on by 6. |
| 2 | Rebuild of a history view under a write pause `spec:application.history-rebuild` | in this entry `spec:decisions.d04-four-outcomes`, `spec:decisions.d09-rebuild-online-by-default`, `spec:decisions.d19-operations-travel-with-capability`, `spec:application.history-rebuild`; on the roadmap `spec:decisions.d08-read-models-in-command` (place 1), `spec:context.event-envelope` (place 3), `spec:application.history-projection` (place 1); 14 outside the roadmap | A cross-stream history view is rebuilt without a consistent cut (Sc L2-6). Waited on by 2. |
| 3 | The journal `spec:context.journal` | in this entry `spec:decisions.d02-context-owns-state-and-journal`, `spec:decisions.d05-rebuildable-history-with-baselines`, `spec:kernel.state-document-mapping`, `spec:context.journal`; on the roadmap `spec:decisions.d03-events-only-source-of-next-state` (place 4); 19 outside the roadmap | Without an expected-version check two appends can interleave on one stream; a global position puts a counter in every write's path; and a change of meaning in `evolve` silently breaks rebuild for every old stream (D2, D5, Sc L2-7). Waited on by 11. |
| 4 | Restore `spec:application.restore` | in this entry `spec:decisions.d06-idempotency-client-and-receipts`, `spec:decisions.d03-events-only-source-of-next-state`, `spec:decisions.d08-read-models-in-command`, `spec:decisions.d05-rebuildable-history-with-baselines`, `spec:decisions.d19-operations-travel-with-capability`, `spec:application.restore`; on the roadmap `spec:decisions.d04-four-outcomes` (place 1), `spec:decisions.d02-context-owns-state-and-journal` (place 1), `spec:context.event-envelope` (place 3), `spec:context.journal` (place 3), `spec:application.history-rebuild` (place 2); 24 outside the roadmap | A representative dataset is restored with matching code and configuration; if the procedure does not exist or its checks are missing, the restored deployment can serve a state whose events do not fold to its saved state, whose journal has gaps, or whose read models miss entities, and nobody knows until a customer does (Sc L2-8). Waited on by 2. |

### To build

No entry is ready to build.

### Waiting on the owner

- State `spec:decisions.d04-four-outcomes`: it states `defined` and its floor allows `ready`; place 1, 2
- State `spec:decisions.d06-idempotency-client-and-receipts`: it states `defined` and its floor allows `ready`; place 4
- State `spec:decisions.d02-context-owns-state-and-journal`: it states `defined` and its floor allows `ready`; place 1, 3
- State `spec:decisions.d03-events-only-source-of-next-state`: it states `defined` and its floor allows `ready`; place 4
- State `spec:decisions.d08-read-models-in-command`: it states `defined` and its floor allows `ready`; place 1, 4
- State `spec:decisions.d05-rebuildable-history-with-baselines`: it states `defined` and its floor allows `ready`; place 1, 3, 4
- State `spec:decisions.d09-rebuild-online-by-default`: it states `defined` and its floor allows `ready`; place 1, 2
- State `spec:decisions.d19-operations-travel-with-capability`: it states `defined` and its floor allows `ready`; place 1, 2, 4
- State `spec:decisions.d18-everything-else-waits-for-trigger`: it states `defined` and its floor allows `ready`; place 1
- State `spec:kernel.state-document-mapping`: it states `defined` and its floor allows `ready`; place 3
- State `spec:context.event-envelope`: it states `defined` and its floor allows `ready`; place 3
- State `spec:context.journal`: it states `defined` and its floor allows `ready`; place 3
- State `spec:context.journal.rebuild-from-baseline`: it states `defined` and its floor allows `ready`; place 3
- State `spec:application.history-projection`: it states `defined` and its floor allows `ready`; place 1
- State `spec:application.history-rebuild`: it states `defined` and its floor allows `ready`; place 2
- State `spec:application.history-rebuild.write-pause-rebuild-abort`: it states `defined` and its floor allows `ready`; place 2
- State `spec:application.history-rebuild.write-pause-rebuild-installation`: it states `defined` and its floor allows `ready`; place 2
- State `spec:application.history-rebuild.write-pause-rebuild-interrupt`: it states `defined` and its floor allows `ready`; place 2
- State `spec:application.history-rebuild.write-pause-rebuild-source-order-mismatch`: it states `defined` and its floor allows `ready`; place 2
- State `spec:application.history-rebuild.write-pause-rebuild-version-change`: it states `defined` and its floor allows `ready`; place 2
- State `spec:application.restore`: it states `defined` and its floor allows `ready`; place 4
- State `spec:application.restore.restore-representative-dataset`: it states `defined` and its floor allows `ready`; place 4

### Questions without a decider

These questions have no named decider.

- `spec:application.history-projection#question.historyFoldOrder`, place 1
- `spec:application.history-projection#question.historyProjectionCost`, place 1
- `spec:application.history-projection#question.historyFoldPureTest`, place 1
- `spec:application.history-projection#question.historySubjectErasure`, place 1
- `spec:decisions.d02-context-owns-state-and-journal#question.contextCallLatencyQuota`, place 1, 3
- `spec:decisions.d02-context-owns-state-and-journal#question.contextIsolationChoice`, place 1, 3
- `spec:decisions.d08-read-models-in-command#question.parentQueryPaginationSplit`, place 1, 4
- `spec:decisions.d09-rebuild-online-by-default#question.rebuildContentionCoverage`, place 1, 2
- `spec:decisions.d19-operations-travel-with-capability#question.restoreObligationCoverage`, place 1, 2, 4
- `spec:application.history-rebuild#question.historyBatchShape`, place 2
- `spec:application.history-rebuild#question.verifyPassUnderPause`, place 2
- `spec:application.history-rebuild#question.historyBatchWriteThroughput`, place 2
- `spec:application.history-rebuild#question.historyMigrationBeforePause`, place 2
- `spec:application.history-rebuild#question.abortSwitchAtomicity`, place 2
- `spec:application.history-rebuild#question.historyTenantPauseIsolation`, place 2
- `spec:context.event-envelope#question.eventEnvelopeFields`, place 3
- `spec:context.event-envelope#question.envelopeTextBounds`, place 3
- `spec:context.journal#question.baselineMigrationContract`, place 3
- `spec:kernel.state-document-mapping#question.streamStateBudget`, place 3
- `spec:application.restore#question.restoreBackupCoverage`, place 4
- `spec:application.restore#question.restoreInvariantChecks`, place 4
- `spec:application.restore#question.restoreStreamBatchBounds`, place 4
- `spec:application.restore#question.restoreBaselineEnumeration`, place 4
- `spec:application.restore#question.restoreHistoryFoldVerification`, place 4
- `spec:decisions.d03-events-only-source-of-next-state#question.initialStateChoice`, place 4
- `spec:decisions.d03-events-only-source-of-next-state#question.streamStateSizeBudget`, place 4
- `spec:decisions.d06-idempotency-client-and-receipts#question.httpCallerReceipts`, place 4
