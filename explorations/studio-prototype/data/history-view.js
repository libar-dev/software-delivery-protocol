window.SDP_PROTOTYPE = {
"design": {
  "found": true,
  "id": "pack:history-view",
  "title": "History view",
  "totals": {
    "members": 19,
    "unresolved": 0,
    "heldBelowNextRung": 0,
    "waitingForAuthor": 19,
    "entries": 283,
    "declarations": 169,
    "openQuestions": 53,
    "blockingQuestions": 0,
    "withImplementations": 2,
    "withReferences": 10,
    "restsOn": 56,
    "restedOnBy": 39,
    "verifiedBy": 21,
    "supersededBy": 0
  },
  "members": [
    {
      "id": "spec:application.history-projection",
      "resolved": true,
      "title": "History projection",
      "specKind": "contract",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 10,
        "declarations": 8,
        "openQuestions": 4,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "historyFoldOrder",
          "blocking": false,
          "address": "spec:application.history-projection#question.historyFoldOrder",
          "line": 37,
          "question": "Extension E-9, the history fold: D2 orders events only within a stream, and the two paths feed one history row in different orders, the live path command by command and the backfill stream by stream; the option taken here is a fold that gives one row whatever the order across streams and however its events are split between calls, a row no fold deletes, which keeps its subject's ended state, and baselines dropped before `keyOf`, so a view whose meaning needs the order across streams waits for the ordered consumer of D18 (E-9, D2, D9, D18, E-25)"
        },
        {
          "key": "historyProjectionCost",
          "blocking": false,
          "address": "spec:application.history-projection#question.historyProjectionCost",
          "line": 38,
          "question": "The cost of the binding on the live path, one row read and one write of up to `rowBudgetBytes` per command and the measure of the row, is taken by the first experiment's latency cell with the order allocation history bound, for `PlaceOrder` and for `CancelOrder` of an order of the maximum lines, before the view is declared essential anywhere (E-9, E-47, F13)"
        },
        {
          "key": "historyFoldPureTest",
          "blocking": false,
          "address": "spec:application.history-projection#question.historyFoldPureTest",
          "line": 39,
          "question": "Extension E-9, the check of the history fold: the order independence the Contract requires is checked for the order allocation history alone; the option taken here is that every history projection of an application carries a pure test that folds a sample of one key's events in every interleaving of its streams and every split into calls, and a library helper that runs that test is added with a second history view (E-9, D2, D18)"
        },
        {
          "key": "historySubjectErasure",
          "blocking": false,
          "address": "spec:application.history-projection#question.historySubjectErasure",
          "line": 40,
          "question": "A history row keeps a deleted subject's history and every rebuild writes it again from the journal; whether a history view falls under the retention and deletion policy of D19, and what its rebuild does after an erasure, is answered by that policy (D19, D9, E-9)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d02-context-owns-state-and-journal",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d04-four-outcomes",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d05-rebuildable-history-with-baselines",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d08-read-models-in-command",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d09-rebuild-online-by-default",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d18-everything-else-waits-for-trigger",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d19-operations-travel-with-capability",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:application.order-allocation-history",
          "file": "example/domain/orderAllocationHistory.ts",
          "line": 8,
          "role": "projection",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        }
      ],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.projection-contract",
      "resolved": true,
      "title": "Projection contract",
      "specKind": "contract",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 21,
        "declarations": 11,
        "openQuestions": 5,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "projectionRowContract",
          "blocking": false,
          "address": "spec:application.projection-contract#question.projectionRowContract",
          "line": 33,
          "question": "Extension E-9: the doc says a projection is named, versioned and deterministic and that live update and rebuild share its logic; it does not give the signature or the row shape, for counts and sums it names the marker but not the aggregate row, and for the read models that depend on history across several streams, the ones the write pause exists for, it names no input. The option taken here: a per-entity read model declared as a `ReadModel<D, Row>` with `name`, `table`, `rowBudgetBytes` and its `projections`, a list of `Projection<D, Row>` with the latest first, each holding `version`, `keyOf` and `project` alone, rows with `tenantId`, `generation`, `key`, `projectionVersion` and `sourceVersions`, one `applyProjection` helper with a mode per caller that writes each generation by its role, active, building or verifying, with the projection whose version the generation records, for the aggregate form the row and the writer `spec:application.aggregate-projection` pins, and for a history-dependent view a `HistoryProjection<Row>` that folds events into the prior row, fed on the live path by the events the operation appended, which the adapter's `streams` entry carries, and on the backfill by the context's `history` pages under the write pause, with `sourceVersions` recording the highest version folded per stream so that an event is never folded twice; a row that derives from more than one source stream type is a history row, its projection bound once per source stream type, and a small cross-context view of current state is D8's parent query over bounded component reads; the owner confirms the three forms and has not ruled on the split of a per-entity read model into `ReadModel` and `Projection`, on the write by generation role or on the row measured against its budget at every write (E-9, E-23, E-24, D8, D9)"
        },
        {
          "key": "projectionGenerationVersions",
          "blocking": false,
          "address": "spec:application.projection-contract#question.projectionGenerationVersions",
          "line": 34,
          "question": "Extension E-9, two projection versions: the doc says live update and rebuild share one projection and does not say how a command writes two generations built by two versions; the option taken here is that a read model declares its projection versions as a list, the latest first, and `applyProjection` writes each generation with the projection whose version the generation row records, failing as a technical failure when the read model declares none of that version, so the rows of one generation are one truth of one version; the cost is that an earlier version stays in the code while a generation that records it is written or can be rolled back to, and a projection changed without a version change is still undetected (E-9, D8, D9)"
        },
        {
          "key": "backfillVersionOverwrite",
          "blocking": false,
          "address": "spec:application.projection-contract#question.backfillVersionOverwrite",
          "line": 35,
          "question": "The rule that a row with a newer version is never overwritten is read as the backfill path's rule only, so a live write to the active generation always lands, as `step3` has it; the owner has not confirmed that reading (D9, E-9)"
        },
        {
          "key": "compositeCurrentStateRow",
          "blocking": false,
          "address": "spec:application.projection-contract#question.compositeCurrentStateRow",
          "line": 36,
          "question": "Extension E-9, a composite row of current state: D8 lets a small cross-context view be a read model updated in the command, and no form here writes one row from the DTOs of two sources, because `project` builds a whole row from one DTO and a backfill enumerates one source; the option taken here is D8's other default, a parent query over bounded component reads, until a view needs such a row, which then needs a form whose `project` takes the DTO of every matching entry of one command and whose backfill reads the other context in the same mutation, online (E-9, D8, E-45)"
        },
        {
          "key": "historySourceVersionTenant",
          "blocking": false,
          "address": "spec:application.projection-contract#question.historySourceVersionTenant",
          "line": 37,
          "question": "Extension E-9, the cost of `sourceVersions`: a history row's entries repeat the row's tenant ID once per source stream, about three quarters of the largest order allocation history row by `spec:application.history-projection#design.tableOrderAllocationHistory`; whether a row's `sourceVersions` may omit `tenantId`, equal to the row's on every entry, and the write rule compare three identity fields, is a choice the owner may take with the pinned conventions (E-9, Law 11, F13)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d08-read-models-in-command",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d09-rebuild-online-by-default",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:application.generation-registry.tables",
          "file": "src/read-model/tables.ts",
          "line": 5,
          "role": "schema",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "id": "impl:application.projection-contract",
          "file": "src/read-model/projection.ts",
          "line": 3,
          "role": "projection",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.read-models",
      "resolved": true,
      "title": "Read models",
      "specKind": "behavior",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 20,
        "declarations": 11,
        "openQuestions": 6,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "parentListGenerationSwitch",
          "blocking": false,
          "address": "spec:application.read-models#question.parentListGenerationSwitch",
          "line": 49,
          "question": "Probe 5 showed that the built-in `.paginate` treats `maximumRowsRead` as advice once a page has an end cursor and that a cursor it issued is refused by any other query, so a subscription over the active generation threw `InvalidCursor` at a switch; a parent list therefore pages with `paginator` of `convex-helpers`, as a context list does, and a pinned page is bounded on every run by the row cap and by the byte cap as `spec:context.queries` states it, the helper stopping at the row that reaches it and admitting that row whole, and answers `SplitRequired` beyond them (Probe 5, F13, D8, D9)"
        },
        {
          "key": "readModelListBounds",
          "blocking": false,
          "address": "spec:application.read-models#question.readModelListBounds",
          "line": 50,
          "question": "Extension E-24, as it reaches read models: a list over a parent read-model table calls `paginator` of `convex-helpers` with the options of `boundedPage`, a row cap of twice the item cap, with each cursor of the client's pair moved into the active generation by `pageInGeneration`, and returns through `paginationResultValidator` with its rows mapped by `readModelView`, and a client pages every list by an explicit cursor pair with no hook; these are options taken here and the owner has not ruled (E-24, S4, Probe 5, D8)"
        },
        {
          "key": "parentQueryRefusal",
          "blocking": false,
          "address": "spec:application.read-models#question.parentQueryRefusal",
          "line": 51,
          "question": "Extension E-6, as it reaches queries: a parent query establishes and authorizes its actor through `authorizeQuery`, and its refusal is the command's rejection shape, `RejectionData` with the query's name in the field `entry` and the codes `unauthenticated` or `forbidden`; the owner confirmed the word, and nothing else of the shape is new (E-6, D7, D11, Law 5)"
        },
        {
          "key": "contextQueryCost",
          "blocking": false,
          "address": "spec:application.read-models#question.contextQueryCost",
          "line": 52,
          "question": "Probe 3 pending: the cost of one component call in latency and function-call quota decides whether one entity's detail stays a component query or hot reads move, which is OQ1 (Probe 3, F4, OQ1)"
        },
        {
          "key": "parentQueryReadBounds",
          "blocking": false,
          "address": "spec:application.read-models#question.parentQueryReadBounds",
          "line": 53,
          "question": "Extension E-45: the doc says a small cross-context view is a parent query over bounded component reads and does not give the bound; the option taken here is at most 8 component reads per parent query and at most 4 read-model rows written per command, both measured by the first experiment (E-45, D8)"
        },
        {
          "key": "crossContextReadForm",
          "blocking": false,
          "address": "spec:application.read-models#question.crossContextReadForm",
          "line": 54,
          "question": "Extension E-9, as it reaches read models: D8 lets a small cross-context view be a parent query over bounded component reads or a read model updated in the command; the option taken here is the parent query for a view of current state, because no form of `spec:application.projection-contract` writes one row from the DTOs of two sources, and the history projection for a view that folds the events of several streams; a composite row of current state is a form for the view that needs it (E-9, E-45, D8)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d01-one-mutation-per-operation",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d08-read-models-in-command",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d11-tenant-scope-and-authority",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:application.read-models",
          "file": "src/read-model/write.ts",
          "line": 3,
          "role": "service",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "id": "impl:application.read-models.queries",
          "file": "src/read-model/queries.ts",
          "line": 3,
          "role": "query",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 5,
        "enabled": 5
      },
      "examples": {
        "total": 5,
        "enabled": 5
      }
    },
    {
      "id": "spec:application.rebuild",
      "resolved": true,
      "title": "Rebuild: generations, backfill and the write pause",
      "specKind": "workflow",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 42,
        "declarations": 27,
        "openQuestions": 5,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "rebuildBatchDriver",
          "blocking": false,
          "address": "spec:application.rebuild#question.rebuildBatchDriver",
          "line": 59,
          "question": "`@convex-dev/migrations` walks only the tables of the component it is defined in, reaches a context's rows only through a parent internal mutation written by hand against a contract its README does not document and the compiled tier needs a cast for, keeps a status apart from the generation's state, and leaves no error on its row when a batch fails past the read limit, so every batch is driven by the rebuild's own self-scheduled internal mutation and the progress row is the one checkpoint; a hosted deployment and sustained contention are not observed (Probe 6, F1, F17, D9)"
        },
        {
          "key": "rebuildBatchBounds",
          "blocking": false,
          "address": "spec:application.rebuild#question.rebuildBatchBounds",
          "line": 60,
          "question": "Extension E-40: the doc binds resumable batching to `@convex-dev/migrations` and gives no batch size; the component iterates a parent table while the sources of a read model live in a context component. The option taken here: a batch is one mutation with one cursor on the progress row and a bound of at most 100 entities, capped by the read model's declared `rowBudgetBytes` so that the parent's point reads and writes stay under 4 MiB, and by the context's byte-derived `list` page bound, which is 16 items at the default 256 KiB stream budget; every batch, the backfill and the verify pass over a context's enumeration and the purge over a parent table, is driven by the platform's own self-scheduled internal mutation, and the rebuild uses the component for nothing, because Probe 6 showed that it walks only the tables of the component it is defined in and drives a context's rows only through a parent internal mutation written by hand against a contract its README does not document; the progress row is the one checkpoint (E-40, E-24, E-9, F17, F13, F1)"
        },
        {
          "key": "rebuildGenerationPauseContract",
          "blocking": false,
          "address": "spec:application.rebuild#question.rebuildGenerationPauseContract",
          "line": 61,
          "question": "Extension E-8: the registry states, the rollback period, what a rollback does, the gate document, the scope a paused rebuild closes and the reach of a generation are design choices the doc does not make; they are pinned in the two contracts under this workflow (E-8, E-9, E-38, D9)"
        },
        {
          "key": "rebuildReadModelForms",
          "blocking": false,
          "address": "spec:application.rebuild#question.rebuildReadModelForms",
          "line": 62,
          "question": "Extension E-8, what this workflow does not offer: the online path is pinned for a per-entity read model with one source stream type and the paused path for a history view, a `HistoryRebuildTarget` with its sources, in `spec:application.history-rebuild`; the aggregate form's rebuild is deferred with the form in its own Spec, the aggregate projection, and a row made from the current state of more than one source has no form at all, as `spec:application.projection-contract` records; `rollbackGeneration` refuses a generation that needs a write pause, because nothing would hold its sources while live commands fold onto a row that missed the events since its retirement, so such a view returns to earlier rules only through a new generation under the pause (E-8, E-9, D9, D18)"
        },
        {
          "key": "tenantListFill",
          "blocking": false,
          "address": "spec:application.rebuild#question.tenantListFill",
          "line": 63,
          "question": "Extension E-49, a deployment whose grants predate the tenant list: the tenant list is written by `insertGrant`, so on such a deployment it holds no row while `grants` holds many, and a pass over an empty list visits no tenant and still ends; the option taken here is that `startGeneration` refuses an empty list beside a grant with a message naming `fillTenants`, and `fillTenants`, an operator entry, walks the grants in bounded batches through a progress row of its own and inserts each missing tenant once; a list that holds a tenant whose first grant came after the table and misses an older one is not detected by that refusal, so the operator runs `fillTenants` on such a deployment before its first `startGeneration` (E-49, E-48, E-40, Law 11)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d08-read-models-in-command",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d09-rebuild-online-by-default",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d11-tenant-scope-and-authority",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d19-operations-travel-with-capability",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:application.rebuild",
          "file": "src/read-model/rebuild.ts",
          "line": 2,
          "role": "service",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 1,
        "enabled": 1
      },
      "examples": {
        "total": 1,
        "enabled": 1
      }
    },
    {
      "id": "spec:application.history-rebuild",
      "resolved": true,
      "title": "Rebuild of a history view under a write pause",
      "specKind": "workflow",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 12,
        "declarations": 3,
        "openQuestions": 6,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "historyBatchShape",
          "blocking": false,
          "address": "spec:application.history-rebuild#question.historyBatchShape",
          "line": 41,
          "question": "Extension E-40, the shape of a history batch: a batch takes one stream, so a pass costs at least one scheduled mutation per source stream and the pause lasts about twice the stream count times one batch; the alternative is a batch that takes streams from one `list` page until its event budget is spent, one `history` call per stream, with the byte bound counting one baseline per stream; the first paused rebuild on the native backend measures one batch, and the shape is chosen with that number (E-40, E-9, F13, F19, D9)"
        },
        {
          "key": "verifyPassUnderPause",
          "blocking": false,
          "address": "spec:application.history-rebuild#question.verifyPassUnderPause",
          "line": 42,
          "question": "The verify pass under the write pause: a history view's generation is built while no source changes, so its verify pass repeats the backfill's batches and, by `spec:application.history-rebuild#design.historyVerify`, finds nothing over a covered generation, which doubles the pause; the option kept here is the pass, as D9's \"Verify coverage, then switch\" and Sc L2-6's \"writes reopen only after verification\" read, and whether a paused generation is `verified` when its backfill ends is the owner's (D9, Sc L2-6)"
        },
        {
          "key": "historyBatchWriteThroughput",
          "blocking": false,
          "address": "spec:application.history-rebuild#question.historyBatchWriteThroughput",
          "line": 43,
          "question": "Whether a history view's batch chain, at up to 2 MiB of rows per batch scheduled with `runAfter(0)`, is held by the deployment class's write throughput limit, `spec:facts.f13-transactions-have-limits#design.limitWriteThroughput`, which the first paused rebuild on the native backend and one hosted run show (F13, E-40)"
        },
        {
          "key": "historyMigrationBeforePause",
          "blocking": false,
          "address": "spec:application.history-rebuild#question.historyMigrationBeforePause",
          "line": 44,
          "question": "Must every source's migration that reads history finish before `startGeneration` closes its source scopes, with abort, migration completion and a fresh generation as the recovery if it did not? If enumeration must instead remain possible during that migration, which context query provides it without constructing a DTO of the wrong meaning?"
        },
        {
          "key": "abortSwitchAtomicity",
          "blocking": false,
          "address": "spec:application.history-rebuild#question.abortSwitchAtomicity",
          "line": 45,
          "question": "Should the native-backend abort example inject failure in the second source's audit insert, assert unchanged generation, progress, gate entries and audit records, then retry after removing the fault and assert one successful abort with both sources reopened? The same atomicity check should cover the switch that reopens them."
        },
        {
          "key": "historyTenantPauseIsolation",
          "blocking": false,
          "address": "spec:application.history-rebuild#question.historyTenantPauseIsolation",
          "line": 46,
          "question": "Should the native-backend example use two tenants with equal local order and stock item IDs, check their folds separately, and refuse a command that writes a paused source without a history binding in both tenants, while a command writing only an unrelated source remains allowed? Include a retry of resume after its response is lost so the same saved event page cannot change the fold twice."
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d04-four-outcomes",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d09-rebuild-online-by-default",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d19-operations-travel-with-capability",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [],
      "verifiers": {
        "total": 5,
        "enabled": 0
      },
      "examples": {
        "total": 5,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-interrupt",
      "resolved": true,
      "title": "Rebuild a cross-stream history view under a write pause; interrupt, then resume",
      "specKind": "example",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "openQuestions": 0,
        "blockingQuestions": 0
      },
      "questions": [],
      "decisions": [],
      "implementedBy": [],
      "referencedBy": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-abort",
      "resolved": true,
      "title": "Rebuild a cross-stream history view under a write pause; interrupt, then abort",
      "specKind": "example",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "openQuestions": 0,
        "blockingQuestions": 0
      },
      "questions": [],
      "decisions": [],
      "implementedBy": [],
      "referencedBy": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-version-change",
      "resolved": true,
      "title": "Deploy a changed history projection version through the handoff",
      "specKind": "example",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "openQuestions": 0,
        "blockingQuestions": 0
      },
      "questions": [],
      "decisions": [],
      "implementedBy": [],
      "referencedBy": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-installation",
      "resolved": true,
      "title": "Install a history view through the handoff",
      "specKind": "example",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "openQuestions": 0,
        "blockingQuestions": 0
      },
      "questions": [],
      "decisions": [],
      "implementedBy": [],
      "referencedBy": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-source-order-mismatch",
      "resolved": true,
      "title": "Reorder a history view's sources while its generation is interrupted",
      "specKind": "example",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "openQuestions": 0,
        "blockingQuestions": 0
      },
      "questions": [],
      "decisions": [],
      "implementedBy": [],
      "referencedBy": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.write-pause",
      "resolved": true,
      "title": "Write pause",
      "specKind": "contract",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 20,
        "declarations": 14,
        "openQuestions": 3,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "writePauseSourceScopes",
          "blocking": false,
          "address": "spec:application.write-pause#question.writePauseSourceScopes",
          "line": 39,
          "question": "Extension E-8: the doc names a maintenance gate every writer reads, fencing or draining of background writers, and operator resume and abort; the option taken here is one gate document per deployment holding the closed scopes, each in one `closed` state, with no fence of its own and no drain interval, because optimistic concurrency serializes every writer's gate read against the close and the generation row's fence already fences a rebuild's batches, and a refusal answered with `writePaused`, the transient code the outcome boundary reserves for this contract under its E-35, which this contract confirms; the scope a paused rebuild closes is the paused view's sources, one `source:` entry per context and stream type its bindings name, because a consistent cut must hold every writer of those streams and a use case that writes a source stream without maintaining the view would otherwise pass the gate, which is why the command declaration names what it writes under E-38 and the pipeline proves the list at its step 9; an operator entry closes only a tenant or `all`, the coarser and always safe scopes, and no scope names a read model, because nothing would close it (E-8, E-38, D9, D4, F1)"
        },
        {
          "key": "generationGateExemption",
          "blocking": false,
          "address": "spec:application.write-pause#question.generationGateExemption",
          "line": 40,
          "question": "Extension E-8, the generation exemption: a batch reads the gate with the scopes `all` and its tenant, and no entry of either scope ever names a generation, so the exemption `gateAllows` makes for a given generation is reached by no reader; either the exemption goes, or a history batch reads the gate with its source scopes as well and passes them by it (E-8, D9)"
        },
        {
          "key": "writePauseOperatingInstructions",
          "blocking": false,
          "address": "spec:application.write-pause#question.writePauseOperatingInstructions",
          "line": 41,
          "question": "Should its operating instructions distinguish a stopped pass from a verified generation awaiting switch, using `getGenerations` and `getGate`, and measure the closed interval through the successful switch or abort? Keep any acceptable pause length for the owner's decision rather than deriving a timeout from a batch estimate."
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d04-four-outcomes",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d09-rebuild-online-by-default",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [
        {
          "id": "component:platform.gate",
          "file": "src/gate/index.ts",
          "line": 3,
          "role": null,
          "component": null
        },
        {
          "id": "impl:application.write-pause",
          "file": "src/gate/gate.ts",
          "line": 8,
          "role": "service",
          "component": {
            "id": "component:platform.gate",
            "layer": "infrastructure",
            "context": "platform"
          }
        },
        {
          "id": "impl:application.write-pause.entries",
          "file": "src/gate/entries.ts",
          "line": 7,
          "role": "operator-entry",
          "component": {
            "id": "component:platform.gate",
            "layer": "infrastructure",
            "context": "platform"
          }
        },
        {
          "id": "impl:application.write-pause.tables",
          "file": "src/gate/tables.ts",
          "line": 4,
          "role": "schema",
          "component": {
            "id": "component:platform.gate",
            "layer": "infrastructure",
            "context": "platform"
          }
        }
      ],
      "referencedBy": [],
      "verifiers": {
        "total": 1,
        "enabled": 1
      },
      "examples": {
        "total": 1,
        "enabled": 1
      }
    },
    {
      "id": "spec:application.generation-registry",
      "resolved": true,
      "title": "Generation registry",
      "specKind": "contract",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 20,
        "declarations": 13,
        "openQuestions": 6,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "generationRollbackPolicy",
          "blocking": false,
          "address": "spec:application.generation-registry#question.generationRollbackPolicy",
          "line": 37,
          "question": "Extension E-8: the doc names a generation registry, a marker and a gate without their shapes, and says to keep the old generation for a rollback period without saying whether live commands keep writing it; the option taken here is the `generations` table below with seven states, a rollback period of 7 days, one generation being built per read model at a time, and a retired generation that is kept and not written, so that a rollback reopens it as `verifying`, one verify pass repairs what the writes since its retirement changed, and the ordinary switch makes it active again; a rollback is therefore a verify pass and then a switch of one write, never one write by itself (E-8, D9, Sc L2-5)"
        },
        {
          "key": "generationTenantReach",
          "blocking": false,
          "address": "spec:application.generation-registry#question.generationTenantReach",
          "line": 38,
          "question": "Extension E-8, reach of a generation: the doc says nothing about tenants and rebuild; one generation per read model spans every tenant, the registry has no tenant dimension, one row is active for all tenants and the batches iterate the tenant list of `spec:command.actor-and-scope`; the registry is operational data of the deployment, so its indexes lead with the read model name and not with `tenantId`, a confirmed deviation from Law 11's index rule of the same kind the obligation module records under E-57, while every table that holds tenant data, the read-model rows among them, leads with the tenant; a rebuild for one tenant is not offered (E-8, D9, D11, Law 11, E-57)"
        },
        {
          "key": "restoreGenerationFence",
          "blocking": false,
          "address": "spec:application.generation-registry#question.restoreGenerationFence",
          "line": 39,
          "question": "Extension E-42, as it touches the registry: a restore brings back a generation row and its progress row at their checkpoint and drops the scheduled batch that was driving them, so the row's fence at inventory time is the restore's proof that the generation is still stranded, and `resumeChain` bumping it is the proof that it is not (E-42, F12)"
        },
        {
          "key": "readModelInstallation",
          "blocking": false,
          "address": "spec:application.generation-registry#question.readModelInstallation",
          "line": 40,
          "question": "Extension E-8, the first generation: the doc says how a generation is rebuilt and not how a read model's first generation comes to exist; the option taken here is that a read model is installed through its first rebuild, generation 1 starting as `building` like any other, so a read model added to a deployment that has history serves that history from its first switch and no transition claims coverage it did not build; a command that finds no generation to write fails as a technical failure and a query that finds no active generation fails the same way (E-8, D9, D19)"
        },
        {
          "key": "rebuildProgressRow",
          "blocking": false,
          "address": "spec:application.generation-registry#question.rebuildProgressRow",
          "line": 41,
          "question": "Extension E-40, the checkpoint: the cursor, the batch size and the counts live on the progress row and not on the generation row, because a batch that wrote its checkpoint on the row every command reads would re-run every command in flight on the read model once per batch; the progress row is the one checkpoint of every batch whatever drives it (E-40, F1)"
        },
        {
          "key": "tenantListGenerationStart",
          "blocking": false,
          "address": "spec:application.generation-registry#question.tenantListGenerationStart",
          "line": 42,
          "question": "Extension E-49, as it touches the registry: on a deployment whose grants predate the tenant list the list is empty while grants exist, and a generation started then visits no tenant; the option taken here is that `startGeneration` refuses then, with a message naming `fillTenants`, the operator entry of `spec:application.rebuild` that fills the list from the grants, and refuses while that fill runs (E-49, E-8, Law 11)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d09-rebuild-online-by-default",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:application.generation-registry",
          "file": "src/read-model/generations.ts",
          "line": 2,
          "role": "query",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "id": "impl:application.generation-registry.tables",
          "file": "src/read-model/tables.ts",
          "line": 5,
          "role": "schema",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 2,
        "enabled": 2
      },
      "examples": {
        "total": 2,
        "enabled": 2
      }
    },
    {
      "id": "spec:application.orders-inventory-example",
      "resolved": true,
      "title": "Orders and Inventory, the example domain",
      "specKind": "model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "openQuestions": 1,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "orderInventoryCommandChoices",
          "blocking": false,
          "address": "spec:application.orders-inventory-example#question.orderInventoryCommandChoices",
          "line": 36,
          "question": "Extension E-46: the second lifecycle command, the essential summary, the command that creates stock, the unit price an order line carries, the bound on an order line's stock item ID, the rejection reasons, the stream budgets of the two stream types, the order of the two context calls and the history-dependent view Sc L2-6 builds are choices the doc leaves open; two of them are decided, that the stock item keeps totals only and `release` takes its quantities from the cancelled order's own lines, and that the order allocation history view stays in the experiment; the owner may substitute the others, and the experiment's terms move with them (E-46, E-2, E-9, First experiment)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d03-events-only-source-of-next-state",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d04-four-outcomes",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d06-idempotency-client-and-receipts",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d07-rejections-thrown-not-stored",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d10-contexts-meet-in-parent-use-cases",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:application.order-allocation-history",
          "file": "example/domain/orderAllocationHistory.ts",
          "line": 8,
          "role": "projection",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        },
        {
          "id": "impl:application.orders-inventory-example",
          "file": "example/domain/order.ts",
          "line": 10,
          "role": "decider",
          "component": {
            "id": "component:example.orders-domain",
            "layer": "domain",
            "context": "orders"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.inventory-operations",
          "file": "example/convex/inventory/operations.ts",
          "line": 2,
          "role": "service",
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.inventory-schema",
          "file": "example/convex/inventory/schema.ts",
          "line": 1,
          "role": "schema",
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.inventory-stock-item-query",
          "file": "example/convex/inventory/queries/stockItem.ts",
          "line": 2,
          "role": "query",
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.inventory-streams",
          "file": "example/convex/inventory/streams.ts",
          "line": 2,
          "role": null,
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.order-summary",
          "file": "example/convex/orderSummary.ts",
          "line": 4,
          "role": "read-model",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.orders-operations",
          "file": "example/convex/orders/operations.ts",
          "line": 2,
          "role": "service",
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.orders-order-query",
          "file": "example/convex/orders/queries/order.ts",
          "line": 2,
          "role": "query",
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.orders-schema",
          "file": "example/convex/orders/schema.ts",
          "line": 1,
          "role": "schema",
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.orders-streams",
          "file": "example/convex/orders/streams.ts",
          "line": 3,
          "role": null,
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "id": "impl:application.orders-inventory-example.stock-item",
          "file": "example/domain/stockItem.ts",
          "line": 11,
          "role": "decider",
          "component": {
            "id": "component:example.inventory-domain",
            "layer": "domain",
            "context": "inventory"
          }
        },
        {
          "id": "impl:application.parent-use-cases",
          "file": "example/convex/ordering.ts",
          "line": 8,
          "role": "use-case",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        },
        {
          "id": "impl:application.parent-use-cases.receiving",
          "file": "example/convex/receiving.ts",
          "line": 4,
          "role": "use-case",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        }
      ],
      "verifiers": {
        "total": 6,
        "enabled": 6
      },
      "examples": {
        "total": 6,
        "enabled": 6
      }
    },
    {
      "id": "spec:command.command-declaration",
      "resolved": true,
      "title": "Command declaration and bindings",
      "specKind": "contract",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 19,
        "declarations": 18,
        "openQuestions": 3,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "commandEntrySignatures",
          "blocking": false,
          "address": "spec:command.command-declaration#question.commandEntrySignatures",
          "line": 38,
          "question": "Extension E-7: the doc says a small composition helper and shared schema values; the helper signatures, the executor signature and the read-model binding below are the design's; the cost is two registered mutations per command instead of one, and the cheaper alternative the design refuted is one public export per command plus one generic internal dispatcher mutation keyed by command type, as D7's conditional dispatcher already does; it lost because trusted server callers would then reach every command through one untyped `internalMutation`, so a renamed handler or a broken argument contract would pass `tsc` at the caller and fail only at runtime, which is the check Sc L2-4 exists to keep before traffic, and because the receipt fingerprint's contract version would be looked up by string rather than typed; the owner may still prefer the dispatcher form once code generation makes the per-command internal entry free (E-7, D12, D7, Sc L2-4, Decision method rule 5)"
        },
        {
          "key": "commandDeclarationLookup",
          "blocking": false,
          "address": "spec:command.command-declaration#question.commandDeclarationLookup",
          "line": 39,
          "question": "Extension E-7: the pipeline receives the declaration and takes the fingerprint's contract version from it, and the type check at a typed caller is the check of Sc L2-4, so no standing map from command type to declaration exists; the conditional dispatcher of `spec:command.outcome-boundary` is the one thing that would need such a map and brings it with it; this is a provisional reading the owner rules (E-7, D12, D18, OQ2)"
        },
        {
          "key": "commandDeclarationFields",
          "blocking": false,
          "address": "spec:command.command-declaration#question.commandDeclarationFields",
          "line": 40,
          "question": "Extension E-38: the doc names five declaration fields; this design adds `contractVersion` for the fingerprint, `retention` and `irreversible` for receipts, `admission`, `bounds`, `rejections`, `audit`, `diagnosticSink` and `writes`, each serving a cited rule of another Spec, and asks whether the owner accepts them as part of the one declaration; `bounds` is the one input bound in the corpus, `maxItems` and `maxBytes`, checked by the pipeline's step 1 and by no executor body, so `spec:application.parent-use-cases` reads it rather than declaring a bound of its own; `writes` is required on every declaration, because an absent list would be an unchecked one, and `readModels` is optional, absent meaning none, which the owner has not ruled; `writes` names the context and stream type pairs the executor may write, from which the pipeline's step 7 derives the source scopes the write pause closes for a consistent cut and which step 9 proves against the `streams` entries the executor returns, because a use case that writes a source stream without maintaining the paused view would otherwise pass the gate; the declaration still imports nothing from the obligation family, so a command's static reactions are not a field here but the `createObligation` calls of its executor, as `spec:obligations.fan-out-and-chains` rules under E-54 (E-38, E-8, E-54, D6, D9, D10, D19, Thesis)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d12-one-declaration-per-command",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:command.command-declaration",
          "file": "src/command/declaration.ts",
          "line": 3,
          "role": "contract",
          "component": {
            "id": "component:platform.command",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "id": "impl:command.command-declaration.depot-commands",
          "file": "fixture/convex/depotCommands.ts",
          "line": 3,
          "role": null,
          "component": null
        }
      ],
      "verifiers": {
        "total": 2,
        "enabled": 2
      },
      "examples": {
        "total": 2,
        "enabled": 2
      }
    },
    {
      "id": "spec:command.command-pipeline",
      "resolved": true,
      "title": "The command pipeline",
      "specKind": "workflow",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 35,
        "declarations": 18,
        "openQuestions": 7,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "commandOutcomeWireShape",
          "blocking": false,
          "address": "spec:command.command-pipeline#question.commandOutcomeWireShape",
          "line": 68,
          "question": "Extension E-30: the doc names the outcome, the operation ID and the affected stream versions as what a command returns, but not a wire shape; the shape here is a union discriminated by `replayed`, whose executed member carries the declaration's result and whose replayed member carries `result` null because a receipt stores no result, so the entry's returns validator admits a replay as a value; affected IDs are application IDs, never private document IDs (E-30, D2, D6, D8)"
        },
        {
          "key": "operationIdentityCause",
          "blocking": false,
          "address": "spec:command.command-pipeline#question.operationIdentityCause",
          "line": 69,
          "question": "Extension E-31: the doc says an operation's ID ties together everything one request caused but not how it is minted, and it says a derived command carries causation and an event's `causedBy` may be a triggering event without saying how that cause reaches the pipeline; here the pipeline mints the operation ID once per top-level mutation with `crypto.randomUUID()` before the first context call, a duplicate returns the operation ID stored on the receipt, and the internal entry takes an optional `causedBy` argument that step 7 copies onto the `OperationRef` when present, so a reaction that issues a derived command passes `causedBy` of kind `event` naming its publication event and the envelope's `event` variant has exactly one producer, while an entry called without it mints `causedBy` of kind `command` from the declaration's name; the obligation and attempt behind a derived command are found through its receipt, whose request key is the obligation's effect key, and never through the envelope (E-31, E-54, D2, D13, Vocab: operation)"
        },
        {
          "key": "commandAdmissionPolicy",
          "blocking": false,
          "address": "spec:command.command-pipeline#question.commandAdmissionPolicy",
          "line": 70,
          "question": "Extension E-32: the doc places rate admission for new intent after the duplicate check and makes a rate or capacity refusal a retryable error, but names no admission mechanism; here admission is an optional per-command policy in the declaration, absent by default, evaluated inside the mutation so that a refusal that throws leaves no consumption behind; the flip side is that a consumption the policy writes commits only with the command, so the policy counts committed intent and cannot bound refused or unauthorized traffic, and a product that must bound refused traffic needs the dispatcher form of D7, where the parent survives the body's rejection (E-32, D4, D6, D7)"
        },
        {
          "key": "publicRequestKey",
          "blocking": false,
          "address": "spec:command.command-pipeline#question.publicRequestKey",
          "line": 71,
          "question": "Extension E-33: the doc lists the callers that need receipts and leaves UI commands to the client guarantee; here a public caller may still supply a request key to opt into a receipt, which Probe 1 showed a caller of `ConvexHttpClient` needs when it retries, and the internal entry always requires one (E-33, D6, Probe 1)"
        },
        {
          "key": "contextCallBudgetReservation",
          "blocking": false,
          "address": "spec:command.command-pipeline#question.contextCallBudgetReservation",
          "line": 72,
          "question": "Probe 4 showed on the pinned backend that the transaction limits are one budget across the parent and its component sub-transactions, so the per-command bounds are checked against one budget; `ctx.runMutation` accepts a `transactionLimits` option, the design passes none on a context call, and whether a call should reserve room with it for the work after it stays open (Probe 4, F13, S3)"
        },
        {
          "key": "commandReadModelWrites",
          "blocking": false,
          "address": "spec:command.command-pipeline#question.commandReadModelWrites",
          "line": 73,
          "question": "Extension E-9: the doc says essential read models are updated inside the command and does not say from what or in what order; here step 9 writes a per-entity read model from the DTO of each matching `streams` entry, never from its events, and a history read model from the events of every matching entry in one call per command, checks `writes` first, then that each bound read model has a generation to write, then the count of the rows it writes against `limitReadModelWritesPerCommand`, each failure a plain error, and the library helpers that step 9 calls are generic over the application's data model; the owner has not ruled on any of it (E-9, E-7, E-8, E-45, D8, D9)"
        },
        {
          "key": "commandTextBounds",
          "blocking": false,
          "address": "spec:command.command-pipeline#question.commandTextBounds",
          "line": 74,
          "question": "Extension E-34: step 1 bounds every text field a caller sets beside the input, the tenant ID, the request key, the correlation ID, the actor's fields and the fields of `causedBy`, in UTF-8 bytes as `limitCallText` lists them, as rejection `invalidInput`, and treats a declaration name above `limitIdLength` as a defect, a plain error, because these fields become fields of the receipt row or of every event's envelope; the doc says events stay small and names no number; the owner has not ruled (E-34, D6, D12, D19)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d01-one-mutation-per-operation",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d04-four-outcomes",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d06-idempotency-client-and-receipts",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d07-rejections-thrown-not-stored",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d08-read-models-in-command",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d10-contexts-meet-in-parent-use-cases",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d11-tenant-scope-and-authority",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d12-one-declaration-per-command",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:application.read-models",
          "file": "src/read-model/write.ts",
          "line": 3,
          "role": "service",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "id": "impl:command.command-pipeline",
          "file": "src/command/pipeline.ts",
          "line": 3,
          "role": "service",
          "component": {
            "id": "component:platform.command",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 3,
        "enabled": 3
      },
      "examples": {
        "total": 3,
        "enabled": 3
      }
    },
    {
      "id": "spec:context.event-envelope",
      "resolved": true,
      "title": "The event envelope",
      "specKind": "contract",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 16,
        "declarations": 10,
        "openQuestions": 2,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "eventEnvelopeFields",
          "blocking": false,
          "address": "spec:context.event-envelope#question.eventEnvelopeFields",
          "line": 31,
          "question": "Extension E-26: the doc lists the fifteen fields and their meaning; this Spec fixes the validator shapes, the `CausedBy` union with a migration variant for baseline events, the `OperationRef` the parent passes, and the event ID as a version 4 UUID from the runtime's `crypto`; the owner confirms (D2, E-26)"
        },
        {
          "key": "envelopeTextBounds",
          "blocking": false,
          "address": "spec:context.event-envelope#question.envelopeTextBounds",
          "line": 32,
          "question": "Extension E-12: the doc says events stay small and gives no number for the envelope; this Spec bounds the envelope beside the payload at `limitEnvelopeBytes`, 4,096 bytes, and each text field of it that a caller can set at 256 bytes of UTF-8, 512 for an actor's ID, so the largest stored event, `limitEventBytes`, is derived and enforced and never assumed; the owner may set other numbers, and the fold bound of `spec:context.journal` moves with them (E-12, D19, F13)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d02-context-owns-state-and-journal",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [
        {
          "id": "impl:context.event-envelope",
          "file": "src/context/envelope.ts",
          "line": 2,
          "role": "contract",
          "component": {
            "id": "component:platform.context",
            "layer": "adapter",
            "context": "platform"
          }
        }
      ],
      "referencedBy": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:context.journal",
      "resolved": true,
      "title": "The journal",
      "specKind": "behavior",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 39,
        "declarations": 18,
        "openQuestions": 1,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "baselineMigrationContract",
          "blocking": false,
          "address": "spec:context.journal#question.baselineMigrationContract",
          "line": 51,
          "question": "Extension E-25: the doc says a migration writes a baseline event holding the migrated state and that rebuild starts from the latest baseline, and it does not say who computes that state, who drives the migration, or what a live command does on a stream the migration has not reached; this Spec fixes the representation, an event of the reserved type `baseline` whose payload holds the state and its schema version and is bounded by the stream's `budgetBytes` instead of the payload bound, a `baselineVersion` on the stream row, a `BaselineMigration` registered on the stream type whose `migrate` function computes the migrated state from the saved state, or, for a step that declares `readsHistory`, from the saved state and the events since the last baseline in the sweep only, the rule that `stateSchemaVersion` counts meaning only and lives on the registration, one helper `migrateToSchemaVersion` that writes the baseline chain, called by the adapter on load for a chain that reads no history and by the `writeBaseline` maintenance mutation for every chain, the code-older-than-data error, the `writeBaseline` mutation built by `defineMaintenance` and declared with the component's public `mutation` builder, the parent-side scheduled chain that drives it by cursor, the batch bound derived from `budgetBytes`, the upcasting rule for old event schema versions, the fold bound of 500 events with the refusals `rebuildStream` returns above it and for a stream awaiting its baseline, the retirement rule for a migration, and the payload byte check in `append`; the option of refusing commands on unmigrated streams with a transient code until the sweep arrives was not taken for a state-only migration, because it turns a deploy into a partial write pause the doc reserves for history-dependent views, and is taken for a history-reading migration, the exception, where it holds only the streams the sweep has not reached and keeps D3 whole on the command path, which the owner confirmed; a consequence the owner should weigh is that every baseline bumps its stream's version, so a reviewed version held across the sweep is answered `staleVersion` and re-reviewed rather than silently accepted, because Sc L1-10 forbids reinterpreting a reviewed version against fresh state and the baseline is a real event of the stream, while a live stream migrated on load never trips it because its expected-version check runs before the chain; and the driver reads the write pause's gate before every batch and reschedules itself when refused, so a sweep never changes a source under a paused rebuild's cut; the owner confirms (D5, D9, S4, Sc L1-10, E-2, E-8, E-12, E-25)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d02-context-owns-state-and-journal",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:decisions.d05-rebuildable-history-with-baselines",
          "statedReadiness": "defined",
          "resolved": true
        },
        {
          "id": "spec:kernel.state-document-mapping",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:context.journal",
          "file": "src/context/journal.ts",
          "line": 2,
          "role": "event-store",
          "component": {
            "id": "component:platform.context",
            "layer": "adapter",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 1,
        "enabled": 0
      },
      "examples": {
        "total": 1,
        "enabled": 0
      }
    },
    {
      "id": "spec:context.queries",
      "resolved": true,
      "title": "The context queries",
      "specKind": "contract",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 29,
        "declarations": 18,
        "openQuestions": 3,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "contextPaginationSplit",
          "blocking": false,
          "address": "spec:context.queries#question.contextPaginationSplit",
          "line": 41,
          "question": "Probe 5 showed on the pinned backend with `convex-helpers` 0.1.124 that the parent query stays reactive, that pages pinned by their end cursors stay contiguous, that a capped page crosses the boundary as `SplitRequired` with its `splitCursor`, and that the `usePaginatedQuery` hook of `convex-helpers/react` then shows 40 of 45 rows; this design uses no hook across the boundary, and the examples are rerun when either pin moves (Probe 5, F15, S4, D8, E-24)"
        },
        {
          "key": "contextQueryContract",
          "blocking": false,
          "address": "spec:context.queries#question.contextQueryContract",
          "line": 42,
          "question": "Extension E-24: the doc says component queries are authorized and return DTOs; this Spec fixes one definer per query, the one `tenantId` argument with no separate scope, the `toDto` mapping with the stream version on every DTO, pagination through `paginator`, the item cap with a row cap of twice the item cap and a byte cap passed on every run, the relay of `pageStatus` and `splitCursor` unchanged, paging by an explicit cursor pair with no client hook, the parent query's one `authorizeQuery` call and its refusal as a rejection, the `maxEvents` argument of the `rebuild` query and its `budgetExhausted` refusal for a batching caller, and the fold refusal of the `rebuild` query; this is a provisional reading the owner has not ruled (D8, S4, E-24, E-42)"
        },
        {
          "key": "queryRefusalEntry",
          "blocking": false,
          "address": "spec:context.queries#question.queryRefusalEntry",
          "line": 43,
          "question": "A parent query's refusal carries the name of the entry that refused in the field `entry` of the rejection data; the wire shape stays `RejectionData` of `spec:command.outcome-boundary` unchanged, and the owner confirmed the word (D7, E-24)"
        }
      ],
      "decisions": [
        {
          "id": "spec:decisions.d08-read-models-in-command",
          "statedReadiness": "defined",
          "resolved": true
        }
      ],
      "implementedBy": [],
      "referencedBy": [
        {
          "id": "impl:context.queries",
          "file": "src/context/queries.ts",
          "line": 3,
          "role": "query",
          "component": {
            "id": "component:platform.context",
            "layer": "adapter",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:decisions.d09-rebuild-online-by-default",
      "resolved": true,
      "title": "Rebuild online by default, pause writes only for history-dependent views",
      "specKind": "decision",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "openQuestions": 1,
        "blockingQuestions": 0
      },
      "questions": [
        {
          "key": "rebuildContentionCoverage",
          "blocking": false,
          "address": "spec:decisions.d09-rebuild-online-by-default#question.rebuildContentionCoverage",
          "line": 30,
          "question": "Probe 6 ran a backfill batch racing a live command and the migrations component on the native backend, with its results on F17; a hosted deployment and sustained contention are not run (Probe 6, F1, F17, D9)"
        }
      ],
      "decisions": [],
      "implementedBy": [],
      "referencedBy": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    }
  ],
  "boundary": {
    "restsOn": [
      {
        "id": "spec:application.first-experiment",
        "title": "The first experiment",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:command.actor-and-scope",
        "title": "Actor, tenant scope, namespace and grants",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.idempotency-and-receipts",
        "title": "Idempotency and receipts",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.outcome-boundary",
        "title": "The outcome and rejection boundary",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.receipt-table",
        "title": "The receipts table",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.tenancy-and-authority",
        "title": "Tenancy and authority",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.bulk-operations-bounded",
        "title": "Every bulk operation has a stated bound",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.events-stay-small",
        "title": "Events stay small",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.no-queue-recovery-for-essential-reads",
        "title": "No queue recovery needed for essential reads",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.zero-core-projection-jobs",
        "title": "Zero core projection jobs",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:context.batch-shaped-api",
        "title": "Batch-shaped context APIs",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:context.context-component",
        "title": "The context component",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:context.journal",
              "spec:context.queries"
            ]
          },
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:context.persistence-adapter",
        "title": "The persistence adapter",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:context.tables",
        "title": "The context tables",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d01-one-mutation-per-operation",
        "title": "One mutation per business operation",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.read-models",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d02-context-owns-state-and-journal",
        "title": "Each bounded context owns its state and its journal",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d03-events-only-source-of-next-state",
        "title": "Events are the only source of the next state",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d04-four-outcomes",
        "title": "Four outcomes, not a boolean",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d05-rebuildable-history-with-baselines",
        "title": "Rebuildable history by default, with baseline events",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d06-idempotency-client-and-receipts",
        "title": "Convex covers UI retries, receipts cover the rest",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d07-rejections-thrown-not-stored",
        "title": "Rejections are thrown, not stored, at the public boundary",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d08-read-models-in-command",
        "title": "Read models update inside the command",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          },
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d10-contexts-meet-in-parent-use-cases",
        "title": "Contexts meet only in parent use cases",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d11-tenant-scope-and-authority",
        "title": "Tenant scope and authority from day one",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d12-one-declaration-per-command",
        "title": "One declaration per command, generated bindings later",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d18-everything-else-waits-for-trigger",
        "title": "Everything else waits for its trigger",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d19-operations-travel-with-capability",
        "title": "Operations travel with the capability",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.rebuild",
              "spec:application.history-rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f01-serializable-mutations-under-occ",
        "title": "Mutations are serializable under optimistic concurrency",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.journal",
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f02-component-calls-commit-with-caller",
        "title": "Component calls commit or roll back with the calling mutation",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f03-nested-run-mutation-partial-rollback",
        "title": "A nested runMutation gives partial rollback",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f04-nested-calls-cost-more-than-helpers",
        "title": "Nested calls cost more than helper calls",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f07-queries-reactive-not-durable-delivery",
        "title": "Queries are reactive, subscriptions are not durable delivery",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f08-scheduling-commits-with-mutation",
        "title": "Scheduling from a mutation commits with it",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f09-scheduled-mutation-and-action-retry-semantics",
        "title": "Scheduled mutations run once, scheduled actions are not retried",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f11-components-have-no-ctx-auth",
        "title": "Components have no ctx.auth",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f12-backups-exclude-pending-scheduled-functions",
        "title": "Backups exclude pending scheduled functions",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f13-transactions-have-limits",
        "title": "Transactions have limits",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f14-convex-error-survives-nested-and-component-boundary",
        "title": "ConvexError data survives a nested mutation and a component boundary",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f15-parent-query-over-component-query-stays-reactive",
        "title": "A parent query over a component query stays reactive",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f17-migrations-fits-generation-backfill",
        "title": "The migrations component fits a generation backfill",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:application.generation-registry",
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f18-commit-timestamps",
        "title": "Commit timestamps order committed transactions",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f19-nested-calls-share-time-budgets",
        "title": "Nested calls draw on a system-operation time budget",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f20-pagination-checks-bytes-after-reading",
        "title": "Pagination checks bytes after reading",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:kernel.outcome-model",
        "title": "The outcome model",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:kernel.state-document-mapping",
        "title": "One document per stream, with a derived mapping above the budget",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law01-sanctioned-writes-only",
        "title": "Business writes go only through sanctioned operations",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law02-state-and-events-commit-together",
        "title": "State and its required events commit together",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law03-events-only-source-of-state",
        "title": "Events are the only source of the next state",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law04-server-scoped-idempotency-key",
        "title": "A retryable command carries a server-scoped idempotency key",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law05-authorization-before-execution-and-disclosure",
        "title": "Authorization comes before execution and disclosure",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law06-technical-failure-never-a-rejection",
        "title": "A technical failure is never stored as a rejection",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law09-no-invariant-on-late-read-model",
        "title": "No invariant depends on a late read model",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law10-replay-never-runs-commands-or-effects",
        "title": "Replay never runs commands or repeats effects",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law11-tenant-scope-named",
        "title": "Every command and query names its tenant scope",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.generation-registry",
              "spec:command.command-pipeline",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:operations.baseline-operations",
        "title": "Baseline operations",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause",
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:platform.transactional-domain-platform",
        "title": "Convex transactional domain platform",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      }
    ],
    "restedOnBy": [
      {
        "id": "spec:advanced.cross-stream-online-rebuild",
        "title": "Online rebuild of cross-stream history views",
        "statedReadiness": "scoped",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:agents.agent-runs",
        "title": "Agent runs",
        "statedReadiness": "scoped",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:application.aggregate-projection",
        "title": "Aggregate projection",
        "statedReadiness": "scoped",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          },
          {
            "type": "dependsOn",
            "members": [
              "spec:application.projection-contract",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          },
          {
            "type": "decidedBy",
            "members": [
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:application.first-experiment",
        "title": "The first experiment",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.history-projection",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:application.generation-registry.command-without-generation-fails",
        "title": "A command whose read model has no generation fails",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.generation-registry.first-rebuild-installs-read-model",
        "title": "A read model is installed through its first rebuild",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-duplicate-answered-from-receipt",
        "title": "A repeated cancel request is answered from its receipt",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-placed-order",
        "title": "A placed order is cancelled",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-second-context-rejects",
        "title": "Orders cancels, then Inventory refuses the release",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-twice-rejected",
        "title": "A second cancel of one order is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-unknown-order-rejected",
        "title": "A cancel of an order never placed is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-without-grant-refused",
        "title": "A caller without the cancel grant is refused",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.parent-use-cases",
        "title": "Parent use cases",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-read-through-query",
        "title": "A successful command, then a query",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-visible",
        "title": "A successful command, then a query or subscription",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.list-pages-by-cursor",
        "title": "A client reads a tenant's order list in pages by cursor",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-before-disclosure",
        "title": "A caller with no identity reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-without-grant",
        "title": "A caller with no grant in the tenant reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.rebuild.online-rebuild-interrupt-resume",
        "title": "Rebuild a per-entity read model online while commands run; interrupt and resume",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:application.restore",
        "title": "Restore",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.projection-contract",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:context.event-envelope",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:application.write-pause.restore-door-without-deploy",
        "title": "The restore door closes and opens with no deploy",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.broken-argument-contract-fails-build",
        "title": "Break a typed handler's argument contract",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.renamed-handler-fails-build",
        "title": "Rename a typed handler",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-journal-append",
        "title": "Inject a failure after the journal append",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-state-write",
        "title": "Inject a failure after the state write",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-before-receipt",
        "title": "Inject a failure before the receipt insert",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.idempotency-and-receipts",
        "title": "Idempotency and receipts",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          },
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.outcome-boundary",
        "title": "The outcome and rejection boundary",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.receipt-table",
        "title": "The receipts table",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.tenancy-and-authority",
        "title": "Tenancy and authority",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:context.context-component",
        "title": "The context component",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope"
            ]
          }
        ]
      },
      {
        "id": "spec:context.journal.rebuild-from-baseline",
        "title": "Rebuild a stream that has a baseline event",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:context.persistence-adapter",
        "title": "The persistence adapter",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:context.tables",
        "title": "The context tables",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d18-everything-else-waits-for-trigger",
        "title": "Everything else waits for its trigger",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:obligations.fan-out-and-chains",
        "title": "Fan-out and reaction chains",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.event-envelope"
            ]
          }
        ]
      },
      {
        "id": "spec:obligations.local-reaction-wrapper",
        "title": "Local reaction wrapper",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:obligations.obligation-module",
        "title": "Obligation module",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:operations.baseline-operations",
        "title": "Baseline operations",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope"
            ]
          }
        ]
      }
    ],
    "verifiedBy": [
      {
        "id": "spec:application.generation-registry.command-without-generation-fails",
        "title": "A command whose read model has no generation fails",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.generation-registry.first-rebuild-installs-read-model",
        "title": "A read model is installed through its first rebuild",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-duplicate-answered-from-receipt",
        "title": "A repeated cancel request is answered from its receipt",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-placed-order",
        "title": "A placed order is cancelled",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-second-context-rejects",
        "title": "Orders cancels, then Inventory refuses the release",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-twice-rejected",
        "title": "A second cancel of one order is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-unknown-order-rejected",
        "title": "A cancel of an order never placed is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-without-grant-refused",
        "title": "A caller without the cancel grant is refused",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-read-through-query",
        "title": "A successful command, then a query",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-visible",
        "title": "A successful command, then a query or subscription",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.list-pages-by-cursor",
        "title": "A client reads a tenant's order list in pages by cursor",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-before-disclosure",
        "title": "A caller with no identity reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-without-grant",
        "title": "A caller with no grant in the tenant reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.rebuild.online-rebuild-interrupt-resume",
        "title": "Rebuild a per-entity read model online while commands run; interrupt and resume",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:application.write-pause.restore-door-without-deploy",
        "title": "The restore door closes and opens with no deploy",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.broken-argument-contract-fails-build",
        "title": "Break a typed handler's argument contract",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.renamed-handler-fails-build",
        "title": "Rename a typed handler",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-journal-append",
        "title": "Inject a failure after the journal append",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-state-write",
        "title": "Inject a failure after the state write",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-before-receipt",
        "title": "Inject a failure before the receipt insert",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:context.journal.rebuild-from-baseline",
        "title": "Rebuild a stream that has a baseline event",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      }
    ],
    "supersededBy": []
  }
},
"context": {
  "id": "pack:history-view",
  "title": "History view",
  "framing": "The Specs a history view rests on, in reading order. A history view is a read model whose row folds the events of several streams, such as the order allocation history of the example domain. The history projection comes first because it pins the form, its fold and that view; the projection contract and the read models follow with the row conventions and the read-model rules every view shares. The rebuild, the history rebuild with its five examples, the write pause and the generation registry say how such a view comes to exist and is rebuilt while the commands that write its sources are refused. The rebuild comes first because it holds the operator entries and the batch chain both paths share; the history rebuild holds the paused path alone and the five examples verify it, so the rebuild's implementation binding claims the online path and the history rebuild shows the paused path designed apart from it. The example domain names the events the view folds, and the command declaration and the command pipeline bind the view to the commands that feed it and write it inside each command. The event envelope, the journal and the queries are where the events come from on the live path and on the backfill, and D9 is the decision that a read model which depends on history across several streams rebuilds under a write pause.",
  "file": "design/specs/history-view.pack.sdp.md",
  "modelRefs": [
    "spec:platform.vocabulary"
  ],
  "members": [
    {
      "id": "spec:application.history-projection",
      "resolved": true,
      "title": "History projection",
      "specKind": "contract",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/history-projection.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 10,
        "declarations": 8,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-9, the history fold: D2 orders events only within a stream, and the two paths feed one history row in different orders, the live path command by command and the backfill stream by stream; the option taken here is a fold that gives one row whatever the order across streams and however its events are split between calls, a row no fold deletes, which keeps its subject's ended state, and baselines dropped before `keyOf`, so a view whose meaning needs the order across streams waits for the ordered consumer of D18 (E-9, D2, D9, D18, E-25)",
            "blocking": false,
            "key": "historyFoldOrder",
            "line": 37
          },
          {
            "index": 1,
            "question": "The cost of the binding on the live path, one row read and one write of up to `rowBudgetBytes` per command and the measure of the row, is taken by the first experiment's latency cell with the order allocation history bound, for `PlaceOrder` and for `CancelOrder` of an order of the maximum lines, before the view is declared essential anywhere (E-9, E-47, F13)",
            "blocking": false,
            "key": "historyProjectionCost",
            "line": 38
          },
          {
            "index": 2,
            "question": "Extension E-9, the check of the history fold: the order independence the Contract requires is checked for the order allocation history alone; the option taken here is that every history projection of an application carries a pure test that folds a sample of one key's events in every interleaving of its streams and every split into calls, and a library helper that runs that test is added with a second history view (E-9, D2, D18)",
            "blocking": false,
            "key": "historyFoldPureTest",
            "line": 39
          },
          {
            "index": 3,
            "question": "A history row keeps a deleted subject's history and every rebuild writes it again from the journal; whether a history view falls under the retention and deletion policy of D19, and what its rebuild does after an erasure, is answered by that policy (D19, D9, E-9)",
            "blocking": false,
            "key": "historySubjectErasure",
            "line": 40
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d02-context-owns-state-and-journal",
            "title": "Each bounded context owns its state and its journal",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d04-four-outcomes",
            "title": "Four outcomes, not a boolean",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d05-rebuildable-history-with-baselines",
            "title": "Rebuildable history by default, with baseline events",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d08-read-models-in-command",
            "title": "Read models update inside the command",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d09-rebuild-online-by-default",
            "title": "Rebuild online by default, pause writes only for history-dependent views",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d18-everything-else-waits-for-trigger",
            "title": "Everything else waits for its trigger",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d19-operations-travel-with-capability",
            "title": "Operations travel with the capability",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:application.order-allocation-history",
          "claim": "anchored",
          "label": "the order allocation history's keyOf and project rules",
          "file": "example/domain/orderAllocationHistory.ts",
          "line": 8,
          "role": "projection",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        }
      ],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.projection-contract",
      "resolved": true,
      "title": "Projection contract",
      "specKind": "contract",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/projection-contract.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 21,
        "declarations": 11,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-9: the doc says a projection is named, versioned and deterministic and that live update and rebuild share its logic; it does not give the signature or the row shape, for counts and sums it names the marker but not the aggregate row, and for the read models that depend on history across several streams, the ones the write pause exists for, it names no input. The option taken here: a per-entity read model declared as a `ReadModel<D, Row>` with `name`, `table`, `rowBudgetBytes` and its `projections`, a list of `Projection<D, Row>` with the latest first, each holding `version`, `keyOf` and `project` alone, rows with `tenantId`, `generation`, `key`, `projectionVersion` and `sourceVersions`, one `applyProjection` helper with a mode per caller that writes each generation by its role, active, building or verifying, with the projection whose version the generation records, for the aggregate form the row and the writer `spec:application.aggregate-projection` pins, and for a history-dependent view a `HistoryProjection<Row>` that folds events into the prior row, fed on the live path by the events the operation appended, which the adapter's `streams` entry carries, and on the backfill by the context's `history` pages under the write pause, with `sourceVersions` recording the highest version folded per stream so that an event is never folded twice; a row that derives from more than one source stream type is a history row, its projection bound once per source stream type, and a small cross-context view of current state is D8's parent query over bounded component reads; the owner confirms the three forms and has not ruled on the split of a per-entity read model into `ReadModel` and `Projection`, on the write by generation role or on the row measured against its budget at every write (E-9, E-23, E-24, D8, D9)",
            "blocking": false,
            "key": "projectionRowContract",
            "line": 33
          },
          {
            "index": 1,
            "question": "Extension E-9, two projection versions: the doc says live update and rebuild share one projection and does not say how a command writes two generations built by two versions; the option taken here is that a read model declares its projection versions as a list, the latest first, and `applyProjection` writes each generation with the projection whose version the generation row records, failing as a technical failure when the read model declares none of that version, so the rows of one generation are one truth of one version; the cost is that an earlier version stays in the code while a generation that records it is written or can be rolled back to, and a projection changed without a version change is still undetected (E-9, D8, D9)",
            "blocking": false,
            "key": "projectionGenerationVersions",
            "line": 34
          },
          {
            "index": 2,
            "question": "The rule that a row with a newer version is never overwritten is read as the backfill path's rule only, so a live write to the active generation always lands, as `step3` has it; the owner has not confirmed that reading (D9, E-9)",
            "blocking": false,
            "key": "backfillVersionOverwrite",
            "line": 35
          },
          {
            "index": 3,
            "question": "Extension E-9, a composite row of current state: D8 lets a small cross-context view be a read model updated in the command, and no form here writes one row from the DTOs of two sources, because `project` builds a whole row from one DTO and a backfill enumerates one source; the option taken here is D8's other default, a parent query over bounded component reads, until a view needs such a row, which then needs a form whose `project` takes the DTO of every matching entry of one command and whose backfill reads the other context in the same mutation, online (E-9, D8, E-45)",
            "blocking": false,
            "key": "compositeCurrentStateRow",
            "line": 36
          },
          {
            "index": 4,
            "question": "Extension E-9, the cost of `sourceVersions`: a history row's entries repeat the row's tenant ID once per source stream, about three quarters of the largest order allocation history row by `spec:application.history-projection#design.tableOrderAllocationHistory`; whether a row's `sourceVersions` may omit `tenantId`, equal to the row's on every entry, and the write rule compare three identity fields, is a choice the owner may take with the pinned conventions (E-9, Law 11, F13)",
            "blocking": false,
            "key": "historySourceVersionTenant",
            "line": 37
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d08-read-models-in-command",
            "title": "Read models update inside the command",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d09-rebuild-online-by-default",
            "title": "Rebuild online by default, pause writes only for history-dependent views",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:application.generation-registry.tables",
          "claim": "anchored",
          "label": "the generations, progress, marker and tenant fill tables and rowConventions",
          "file": "src/read-model/tables.ts",
          "line": 5,
          "role": "schema",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "codeId": "impl:application.projection-contract",
          "claim": "anchored",
          "label": "ReadModel, Projection and applyProjection",
          "file": "src/read-model/projection.ts",
          "line": 3,
          "role": "projection",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.read-models",
      "resolved": true,
      "title": "Read models",
      "specKind": "behavior",
      "altitude": "feature",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "has-verifier"
      ],
      "file": "design/specs/application/read-models.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 20,
        "declarations": 11,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Probe 5 showed that the built-in `.paginate` treats `maximumRowsRead` as advice once a page has an end cursor and that a cursor it issued is refused by any other query, so a subscription over the active generation threw `InvalidCursor` at a switch; a parent list therefore pages with `paginator` of `convex-helpers`, as a context list does, and a pinned page is bounded on every run by the row cap and by the byte cap as `spec:context.queries` states it, the helper stopping at the row that reaches it and admitting that row whole, and answers `SplitRequired` beyond them (Probe 5, F13, D8, D9)",
            "blocking": false,
            "key": "parentListGenerationSwitch",
            "line": 49
          },
          {
            "index": 1,
            "question": "Extension E-24, as it reaches read models: a list over a parent read-model table calls `paginator` of `convex-helpers` with the options of `boundedPage`, a row cap of twice the item cap, with each cursor of the client's pair moved into the active generation by `pageInGeneration`, and returns through `paginationResultValidator` with its rows mapped by `readModelView`, and a client pages every list by an explicit cursor pair with no hook; these are options taken here and the owner has not ruled (E-24, S4, Probe 5, D8)",
            "blocking": false,
            "key": "readModelListBounds",
            "line": 50
          },
          {
            "index": 2,
            "question": "Extension E-6, as it reaches queries: a parent query establishes and authorizes its actor through `authorizeQuery`, and its refusal is the command's rejection shape, `RejectionData` with the query's name in the field `entry` and the codes `unauthenticated` or `forbidden`; the owner confirmed the word, and nothing else of the shape is new (E-6, D7, D11, Law 5)",
            "blocking": false,
            "key": "parentQueryRefusal",
            "line": 51
          },
          {
            "index": 3,
            "question": "Probe 3 pending: the cost of one component call in latency and function-call quota decides whether one entity's detail stays a component query or hot reads move, which is OQ1 (Probe 3, F4, OQ1)",
            "blocking": false,
            "key": "contextQueryCost",
            "line": 52
          },
          {
            "index": 4,
            "question": "Extension E-45: the doc says a small cross-context view is a parent query over bounded component reads and does not give the bound; the option taken here is at most 8 component reads per parent query and at most 4 read-model rows written per command, both measured by the first experiment (E-45, D8)",
            "blocking": false,
            "key": "parentQueryReadBounds",
            "line": 53
          },
          {
            "index": 5,
            "question": "Extension E-9, as it reaches read models: D8 lets a small cross-context view be a parent query over bounded component reads or a read model updated in the command; the option taken here is the parent query for a view of current state, because no form of `spec:application.projection-contract` writes one row from the DTOs of two sources, and the history projection for a view that folds the events of several streams; a composite row of current state is a form for the view that needs it (E-9, E-45, D8)",
            "blocking": false,
            "key": "crossContextReadForm",
            "line": 54
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d01-one-mutation-per-operation",
            "title": "One mutation per business operation",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d08-read-models-in-command",
            "title": "Read models update inside the command",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d11-tenant-scope-and-authority",
            "title": "Tenant scope and authority from day one",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:application.read-models",
          "claim": "anchored",
          "label": "writeReadModels, step 9's read-model half",
          "file": "src/read-model/write.ts",
          "line": 3,
          "role": "service",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "codeId": "impl:application.read-models.queries",
          "claim": "anchored",
          "label": "readModelView, pageInGeneration and limitReadModelList",
          "file": "src/read-model/queries.ts",
          "line": 3,
          "role": "query",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 5,
        "enabled": 5
      },
      "examples": {
        "total": 5,
        "enabled": 5
      }
    },
    {
      "id": "spec:application.rebuild",
      "resolved": true,
      "title": "Rebuild: generations, backfill and the write pause",
      "specKind": "workflow",
      "altitude": "feature",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "has-verifier"
      ],
      "file": "design/specs/application/rebuild.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 42,
        "declarations": 27,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "`@convex-dev/migrations` walks only the tables of the component it is defined in, reaches a context's rows only through a parent internal mutation written by hand against a contract its README does not document and the compiled tier needs a cast for, keeps a status apart from the generation's state, and leaves no error on its row when a batch fails past the read limit, so every batch is driven by the rebuild's own self-scheduled internal mutation and the progress row is the one checkpoint; a hosted deployment and sustained contention are not observed (Probe 6, F1, F17, D9)",
            "blocking": false,
            "key": "rebuildBatchDriver",
            "line": 59
          },
          {
            "index": 1,
            "question": "Extension E-40: the doc binds resumable batching to `@convex-dev/migrations` and gives no batch size; the component iterates a parent table while the sources of a read model live in a context component. The option taken here: a batch is one mutation with one cursor on the progress row and a bound of at most 100 entities, capped by the read model's declared `rowBudgetBytes` so that the parent's point reads and writes stay under 4 MiB, and by the context's byte-derived `list` page bound, which is 16 items at the default 256 KiB stream budget; every batch, the backfill and the verify pass over a context's enumeration and the purge over a parent table, is driven by the platform's own self-scheduled internal mutation, and the rebuild uses the component for nothing, because Probe 6 showed that it walks only the tables of the component it is defined in and drives a context's rows only through a parent internal mutation written by hand against a contract its README does not document; the progress row is the one checkpoint (E-40, E-24, E-9, F17, F13, F1)",
            "blocking": false,
            "key": "rebuildBatchBounds",
            "line": 60
          },
          {
            "index": 2,
            "question": "Extension E-8: the registry states, the rollback period, what a rollback does, the gate document, the scope a paused rebuild closes and the reach of a generation are design choices the doc does not make; they are pinned in the two contracts under this workflow (E-8, E-9, E-38, D9)",
            "blocking": false,
            "key": "rebuildGenerationPauseContract",
            "line": 61
          },
          {
            "index": 3,
            "question": "Extension E-8, what this workflow does not offer: the online path is pinned for a per-entity read model with one source stream type and the paused path for a history view, a `HistoryRebuildTarget` with its sources, in `spec:application.history-rebuild`; the aggregate form's rebuild is deferred with the form in its own Spec, the aggregate projection, and a row made from the current state of more than one source has no form at all, as `spec:application.projection-contract` records; `rollbackGeneration` refuses a generation that needs a write pause, because nothing would hold its sources while live commands fold onto a row that missed the events since its retirement, so such a view returns to earlier rules only through a new generation under the pause (E-8, E-9, D9, D18)",
            "blocking": false,
            "key": "rebuildReadModelForms",
            "line": 62
          },
          {
            "index": 4,
            "question": "Extension E-49, a deployment whose grants predate the tenant list: the tenant list is written by `insertGrant`, so on such a deployment it holds no row while `grants` holds many, and a pass over an empty list visits no tenant and still ends; the option taken here is that `startGeneration` refuses an empty list beside a grant with a message naming `fillTenants`, and `fillTenants`, an operator entry, walks the grants in bounded batches through a progress row of its own and inserts each missing tenant once; a list that holds a tenant whose first grant came after the table and misses an older one is not detected by that refusal, so the operator runs `fillTenants` on such a deployment before its first `startGeneration` (E-49, E-48, E-40, Law 11)",
            "blocking": false,
            "key": "tenantListFill",
            "line": 63
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d08-read-models-in-command",
            "title": "Read models update inside the command",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d09-rebuild-online-by-default",
            "title": "Rebuild online by default, pause writes only for history-dependent views",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d11-tenant-scope-and-authority",
            "title": "Tenant scope and authority from day one",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d19-operations-travel-with-capability",
            "title": "Operations travel with the capability",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:application.rebuild",
          "claim": "anchored",
          "label": "the online rebuild's operator entries, batch chains, tenant fill and batch bounds",
          "file": "src/read-model/rebuild.ts",
          "line": 2,
          "role": "service",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 1,
        "enabled": 1
      },
      "examples": {
        "total": 1,
        "enabled": 1
      }
    },
    {
      "id": "spec:application.history-rebuild",
      "resolved": true,
      "title": "Rebuild of a history view under a write pause",
      "specKind": "workflow",
      "altitude": "feature",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/history-rebuild.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 12,
        "declarations": 3,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-40, the shape of a history batch: a batch takes one stream, so a pass costs at least one scheduled mutation per source stream and the pause lasts about twice the stream count times one batch; the alternative is a batch that takes streams from one `list` page until its event budget is spent, one `history` call per stream, with the byte bound counting one baseline per stream; the first paused rebuild on the native backend measures one batch, and the shape is chosen with that number (E-40, E-9, F13, F19, D9)",
            "blocking": false,
            "key": "historyBatchShape",
            "line": 41
          },
          {
            "index": 1,
            "question": "The verify pass under the write pause: a history view's generation is built while no source changes, so its verify pass repeats the backfill's batches and, by `spec:application.history-rebuild#design.historyVerify`, finds nothing over a covered generation, which doubles the pause; the option kept here is the pass, as D9's \"Verify coverage, then switch\" and Sc L2-6's \"writes reopen only after verification\" read, and whether a paused generation is `verified` when its backfill ends is the owner's (D9, Sc L2-6)",
            "blocking": false,
            "key": "verifyPassUnderPause",
            "line": 42
          },
          {
            "index": 2,
            "question": "Whether a history view's batch chain, at up to 2 MiB of rows per batch scheduled with `runAfter(0)`, is held by the deployment class's write throughput limit, `spec:facts.f13-transactions-have-limits#design.limitWriteThroughput`, which the first paused rebuild on the native backend and one hosted run show (F13, E-40)",
            "blocking": false,
            "key": "historyBatchWriteThroughput",
            "line": 43
          },
          {
            "index": 3,
            "question": "Must every source's migration that reads history finish before `startGeneration` closes its source scopes, with abort, migration completion and a fresh generation as the recovery if it did not? If enumeration must instead remain possible during that migration, which context query provides it without constructing a DTO of the wrong meaning?",
            "blocking": false,
            "key": "historyMigrationBeforePause",
            "line": 44
          },
          {
            "index": 4,
            "question": "Should the native-backend abort example inject failure in the second source's audit insert, assert unchanged generation, progress, gate entries and audit records, then retry after removing the fault and assert one successful abort with both sources reopened? The same atomicity check should cover the switch that reopens them.",
            "blocking": false,
            "key": "abortSwitchAtomicity",
            "line": 45
          },
          {
            "index": 5,
            "question": "Should the native-backend example use two tenants with equal local order and stock item IDs, check their folds separately, and refuse a command that writes a paused source without a history binding in both tenants, while a command writing only an unrelated source remains allowed? Include a retry of resume after its response is lost so the same saved event page cannot change the fold twice.",
            "blocking": false,
            "key": "historyTenantPauseIsolation",
            "line": 46
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d04-four-outcomes",
            "title": "Four outcomes, not a boolean",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d09-rebuild-online-by-default",
            "title": "Rebuild online by default, pause writes only for history-dependent views",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d19-operations-travel-with-capability",
            "title": "Operations travel with the capability",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [],
      "verifiers": {
        "total": 5,
        "enabled": 0
      },
      "examples": {
        "total": 5,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-interrupt",
      "resolved": true,
      "title": "Rebuild a cross-stream history view under a write pause; interrupt, then resume",
      "specKind": "example",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/history-rebuild.write-pause-rebuild-interrupt.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "blockingQuestions": 0,
        "openQuestions": [],
        "decisions": []
      },
      "implementations": [],
      "references": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-abort",
      "resolved": true,
      "title": "Rebuild a cross-stream history view under a write pause; interrupt, then abort",
      "specKind": "example",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/history-rebuild.write-pause-rebuild-abort.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "blockingQuestions": 0,
        "openQuestions": [],
        "decisions": []
      },
      "implementations": [],
      "references": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-version-change",
      "resolved": true,
      "title": "Deploy a changed history projection version through the handoff",
      "specKind": "example",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/history-rebuild.write-pause-rebuild-version-change.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "blockingQuestions": 0,
        "openQuestions": [],
        "decisions": []
      },
      "implementations": [],
      "references": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-installation",
      "resolved": true,
      "title": "Install a history view through the handoff",
      "specKind": "example",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/history-rebuild.write-pause-rebuild-installation.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "blockingQuestions": 0,
        "openQuestions": [],
        "decisions": []
      },
      "implementations": [],
      "references": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-source-order-mismatch",
      "resolved": true,
      "title": "Reorder a history view's sources while its generation is interrupted",
      "specKind": "example",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/application/history-rebuild.write-pause-rebuild-source-order-mismatch.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "blockingQuestions": 0,
        "openQuestions": [],
        "decisions": []
      },
      "implementations": [],
      "references": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:application.write-pause",
      "resolved": true,
      "title": "Write pause",
      "specKind": "contract",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "implemented",
        "has-verifier"
      ],
      "file": "design/specs/application/write-pause.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 20,
        "declarations": 14,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-8: the doc names a maintenance gate every writer reads, fencing or draining of background writers, and operator resume and abort; the option taken here is one gate document per deployment holding the closed scopes, each in one `closed` state, with no fence of its own and no drain interval, because optimistic concurrency serializes every writer's gate read against the close and the generation row's fence already fences a rebuild's batches, and a refusal answered with `writePaused`, the transient code the outcome boundary reserves for this contract under its E-35, which this contract confirms; the scope a paused rebuild closes is the paused view's sources, one `source:` entry per context and stream type its bindings name, because a consistent cut must hold every writer of those streams and a use case that writes a source stream without maintaining the view would otherwise pass the gate, which is why the command declaration names what it writes under E-38 and the pipeline proves the list at its step 9; an operator entry closes only a tenant or `all`, the coarser and always safe scopes, and no scope names a read model, because nothing would close it (E-8, E-38, D9, D4, F1)",
            "blocking": false,
            "key": "writePauseSourceScopes",
            "line": 39
          },
          {
            "index": 1,
            "question": "Extension E-8, the generation exemption: a batch reads the gate with the scopes `all` and its tenant, and no entry of either scope ever names a generation, so the exemption `gateAllows` makes for a given generation is reached by no reader; either the exemption goes, or a history batch reads the gate with its source scopes as well and passes them by it (E-8, D9)",
            "blocking": false,
            "key": "generationGateExemption",
            "line": 40
          },
          {
            "index": 2,
            "question": "Should its operating instructions distinguish a stopped pass from a verified generation awaiting switch, using `getGenerations` and `getGate`, and measure the closed interval through the successful switch or abort? Keep any acceptable pause length for the owner's decision rather than deriving a timeout from a batch estimate.",
            "blocking": false,
            "key": "writePauseOperatingInstructions",
            "line": 41
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d04-four-outcomes",
            "title": "Four outcomes, not a boolean",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d09-rebuild-online-by-default",
            "title": "Rebuild online by default, pause writes only for history-dependent views",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [
        {
          "codeId": "component:platform.gate",
          "claim": "anchored",
          "label": "the maintenance gate: its table, the writer check, the two writers and the operator entries",
          "file": "src/gate/index.ts",
          "line": 3,
          "layer": "infrastructure",
          "context": "platform"
        },
        {
          "codeId": "impl:application.write-pause",
          "claim": "anchored",
          "label": "gateAllows, assertWritable and the two scope writers",
          "file": "src/gate/gate.ts",
          "line": 8,
          "role": "service",
          "component": {
            "id": "component:platform.gate",
            "layer": "infrastructure",
            "context": "platform"
          }
        },
        {
          "codeId": "impl:application.write-pause.entries",
          "claim": "anchored",
          "label": "the four gate operator entries",
          "file": "src/gate/entries.ts",
          "line": 7,
          "role": "operator-entry",
          "component": {
            "id": "component:platform.gate",
            "layer": "infrastructure",
            "context": "platform"
          }
        },
        {
          "codeId": "impl:application.write-pause.tables",
          "claim": "anchored",
          "label": "the gate document's table fragment",
          "file": "src/gate/tables.ts",
          "line": 4,
          "role": "schema",
          "component": {
            "id": "component:platform.gate",
            "layer": "infrastructure",
            "context": "platform"
          }
        }
      ],
      "references": [],
      "verifiers": {
        "total": 1,
        "enabled": 1
      },
      "examples": {
        "total": 1,
        "enabled": 1
      }
    },
    {
      "id": "spec:application.generation-registry",
      "resolved": true,
      "title": "Generation registry",
      "specKind": "contract",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "has-verifier"
      ],
      "file": "design/specs/application/generation-registry.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 20,
        "declarations": 13,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-8: the doc names a generation registry, a marker and a gate without their shapes, and says to keep the old generation for a rollback period without saying whether live commands keep writing it; the option taken here is the `generations` table below with seven states, a rollback period of 7 days, one generation being built per read model at a time, and a retired generation that is kept and not written, so that a rollback reopens it as `verifying`, one verify pass repairs what the writes since its retirement changed, and the ordinary switch makes it active again; a rollback is therefore a verify pass and then a switch of one write, never one write by itself (E-8, D9, Sc L2-5)",
            "blocking": false,
            "key": "generationRollbackPolicy",
            "line": 37
          },
          {
            "index": 1,
            "question": "Extension E-8, reach of a generation: the doc says nothing about tenants and rebuild; one generation per read model spans every tenant, the registry has no tenant dimension, one row is active for all tenants and the batches iterate the tenant list of `spec:command.actor-and-scope`; the registry is operational data of the deployment, so its indexes lead with the read model name and not with `tenantId`, a confirmed deviation from Law 11's index rule of the same kind the obligation module records under E-57, while every table that holds tenant data, the read-model rows among them, leads with the tenant; a rebuild for one tenant is not offered (E-8, D9, D11, Law 11, E-57)",
            "blocking": false,
            "key": "generationTenantReach",
            "line": 38
          },
          {
            "index": 2,
            "question": "Extension E-42, as it touches the registry: a restore brings back a generation row and its progress row at their checkpoint and drops the scheduled batch that was driving them, so the row's fence at inventory time is the restore's proof that the generation is still stranded, and `resumeChain` bumping it is the proof that it is not (E-42, F12)",
            "blocking": false,
            "key": "restoreGenerationFence",
            "line": 39
          },
          {
            "index": 3,
            "question": "Extension E-8, the first generation: the doc says how a generation is rebuilt and not how a read model's first generation comes to exist; the option taken here is that a read model is installed through its first rebuild, generation 1 starting as `building` like any other, so a read model added to a deployment that has history serves that history from its first switch and no transition claims coverage it did not build; a command that finds no generation to write fails as a technical failure and a query that finds no active generation fails the same way (E-8, D9, D19)",
            "blocking": false,
            "key": "readModelInstallation",
            "line": 40
          },
          {
            "index": 4,
            "question": "Extension E-40, the checkpoint: the cursor, the batch size and the counts live on the progress row and not on the generation row, because a batch that wrote its checkpoint on the row every command reads would re-run every command in flight on the read model once per batch; the progress row is the one checkpoint of every batch whatever drives it (E-40, F1)",
            "blocking": false,
            "key": "rebuildProgressRow",
            "line": 41
          },
          {
            "index": 5,
            "question": "Extension E-49, as it touches the registry: on a deployment whose grants predate the tenant list the list is empty while grants exist, and a generation started then visits no tenant; the option taken here is that `startGeneration` refuses then, with a message naming `fillTenants`, the operator entry of `spec:application.rebuild` that fills the list from the grants, and refuses while that fill runs (E-49, E-8, Law 11)",
            "blocking": false,
            "key": "tenantListGenerationStart",
            "line": 42
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d09-rebuild-online-by-default",
            "title": "Rebuild online by default, pause writes only for history-dependent views",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:application.generation-registry",
          "claim": "anchored",
          "label": "generationsToWrite and activeGeneration",
          "file": "src/read-model/generations.ts",
          "line": 2,
          "role": "query",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "codeId": "impl:application.generation-registry.tables",
          "claim": "anchored",
          "label": "the generations, progress, marker and tenant fill tables and rowConventions",
          "file": "src/read-model/tables.ts",
          "line": 5,
          "role": "schema",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 2,
        "enabled": 2
      },
      "examples": {
        "total": 2,
        "enabled": 2
      }
    },
    {
      "id": "spec:application.orders-inventory-example",
      "resolved": true,
      "title": "Orders and Inventory, the example domain",
      "specKind": "model",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "has-verifier"
      ],
      "file": "design/specs/application/orders-inventory-example.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-46: the second lifecycle command, the essential summary, the command that creates stock, the unit price an order line carries, the bound on an order line's stock item ID, the rejection reasons, the stream budgets of the two stream types, the order of the two context calls and the history-dependent view Sc L2-6 builds are choices the doc leaves open; two of them are decided, that the stock item keeps totals only and `release` takes its quantities from the cancelled order's own lines, and that the order allocation history view stays in the experiment; the owner may substitute the others, and the experiment's terms move with them (E-46, E-2, E-9, First experiment)",
            "blocking": false,
            "key": "orderInventoryCommandChoices",
            "line": 36
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d03-events-only-source-of-next-state",
            "title": "Events are the only source of the next state",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d04-four-outcomes",
            "title": "Four outcomes, not a boolean",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d06-idempotency-client-and-receipts",
            "title": "Convex covers UI retries, receipts cover the rest",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d07-rejections-thrown-not-stored",
            "title": "Rejections are thrown, not stored, at the public boundary",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d10-contexts-meet-in-parent-use-cases",
            "title": "Contexts meet only in parent use cases",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:application.order-allocation-history",
          "claim": "anchored",
          "label": "the order allocation history's keyOf and project rules",
          "file": "example/domain/orderAllocationHistory.ts",
          "line": 8,
          "role": "projection",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example",
          "claim": "anchored",
          "label": "the order decider",
          "file": "example/domain/order.ts",
          "line": 10,
          "role": "decider",
          "component": {
            "id": "component:example.orders-domain",
            "layer": "domain",
            "context": "orders"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.inventory-operations",
          "claim": "anchored",
          "label": "the Inventory sanctioned operations",
          "file": "example/convex/inventory/operations.ts",
          "line": 2,
          "role": "service",
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.inventory-schema",
          "claim": "anchored",
          "label": "the Inventory context schema",
          "file": "example/convex/inventory/schema.ts",
          "line": 1,
          "role": "schema",
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.inventory-stock-item-query",
          "claim": "anchored",
          "label": "the stock item query",
          "file": "example/convex/inventory/queries/stockItem.ts",
          "line": 2,
          "role": "query",
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.inventory-streams",
          "claim": "anchored",
          "label": "the stock item stream registration",
          "file": "example/convex/inventory/streams.ts",
          "line": 2,
          "component": {
            "id": "component:example.inventory-context",
            "layer": "adapter",
            "context": "inventory"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.order-summary",
          "claim": "anchored",
          "label": "the order summary read model",
          "file": "example/convex/orderSummary.ts",
          "line": 4,
          "role": "read-model",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.orders-operations",
          "claim": "anchored",
          "label": "the Orders sanctioned operations",
          "file": "example/convex/orders/operations.ts",
          "line": 2,
          "role": "service",
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.orders-order-query",
          "claim": "anchored",
          "label": "the order query",
          "file": "example/convex/orders/queries/order.ts",
          "line": 2,
          "role": "query",
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.orders-schema",
          "claim": "anchored",
          "label": "the Orders context schema",
          "file": "example/convex/orders/schema.ts",
          "line": 1,
          "role": "schema",
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.orders-streams",
          "claim": "anchored",
          "label": "the order stream registration",
          "file": "example/convex/orders/streams.ts",
          "line": 3,
          "component": {
            "id": "component:example.orders-context",
            "layer": "adapter",
            "context": "orders"
          }
        },
        {
          "codeId": "impl:application.orders-inventory-example.stock-item",
          "claim": "anchored",
          "label": "the stock item decider",
          "file": "example/domain/stockItem.ts",
          "line": 11,
          "role": "decider",
          "component": {
            "id": "component:example.inventory-domain",
            "layer": "domain",
            "context": "inventory"
          }
        },
        {
          "codeId": "impl:application.parent-use-cases",
          "claim": "anchored",
          "label": "PlaceOrder and CancelOrder over Orders and then Inventory",
          "file": "example/convex/ordering.ts",
          "line": 8,
          "role": "use-case",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        },
        {
          "codeId": "impl:application.parent-use-cases.receiving",
          "claim": "anchored",
          "label": "ReceiveStock",
          "file": "example/convex/receiving.ts",
          "line": 4,
          "role": "use-case",
          "component": {
            "id": "component:example.parent",
            "layer": "application",
            "context": "orders-inventory"
          }
        }
      ],
      "verifiers": {
        "total": 6,
        "enabled": 6
      },
      "examples": {
        "total": 6,
        "enabled": 6
      }
    },
    {
      "id": "spec:command.command-declaration",
      "resolved": true,
      "title": "Command declaration and bindings",
      "specKind": "contract",
      "altitude": "feature",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "has-verifier"
      ],
      "file": "design/specs/command/command-declaration.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 19,
        "declarations": 18,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-7: the doc says a small composition helper and shared schema values; the helper signatures, the executor signature and the read-model binding below are the design's; the cost is two registered mutations per command instead of one, and the cheaper alternative the design refuted is one public export per command plus one generic internal dispatcher mutation keyed by command type, as D7's conditional dispatcher already does; it lost because trusted server callers would then reach every command through one untyped `internalMutation`, so a renamed handler or a broken argument contract would pass `tsc` at the caller and fail only at runtime, which is the check Sc L2-4 exists to keep before traffic, and because the receipt fingerprint's contract version would be looked up by string rather than typed; the owner may still prefer the dispatcher form once code generation makes the per-command internal entry free (E-7, D12, D7, Sc L2-4, Decision method rule 5)",
            "blocking": false,
            "key": "commandEntrySignatures",
            "line": 38
          },
          {
            "index": 1,
            "question": "Extension E-7: the pipeline receives the declaration and takes the fingerprint's contract version from it, and the type check at a typed caller is the check of Sc L2-4, so no standing map from command type to declaration exists; the conditional dispatcher of `spec:command.outcome-boundary` is the one thing that would need such a map and brings it with it; this is a provisional reading the owner rules (E-7, D12, D18, OQ2)",
            "blocking": false,
            "key": "commandDeclarationLookup",
            "line": 39
          },
          {
            "index": 2,
            "question": "Extension E-38: the doc names five declaration fields; this design adds `contractVersion` for the fingerprint, `retention` and `irreversible` for receipts, `admission`, `bounds`, `rejections`, `audit`, `diagnosticSink` and `writes`, each serving a cited rule of another Spec, and asks whether the owner accepts them as part of the one declaration; `bounds` is the one input bound in the corpus, `maxItems` and `maxBytes`, checked by the pipeline's step 1 and by no executor body, so `spec:application.parent-use-cases` reads it rather than declaring a bound of its own; `writes` is required on every declaration, because an absent list would be an unchecked one, and `readModels` is optional, absent meaning none, which the owner has not ruled; `writes` names the context and stream type pairs the executor may write, from which the pipeline's step 7 derives the source scopes the write pause closes for a consistent cut and which step 9 proves against the `streams` entries the executor returns, because a use case that writes a source stream without maintaining the paused view would otherwise pass the gate; the declaration still imports nothing from the obligation family, so a command's static reactions are not a field here but the `createObligation` calls of its executor, as `spec:obligations.fan-out-and-chains` rules under E-54 (E-38, E-8, E-54, D6, D9, D10, D19, Thesis)",
            "blocking": false,
            "key": "commandDeclarationFields",
            "line": 40
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d12-one-declaration-per-command",
            "title": "One declaration per command, generated bindings later",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:command.command-declaration",
          "claim": "anchored",
          "label": "CommandDeclaration, publicCommand and internalCommand",
          "file": "src/command/declaration.ts",
          "line": 3,
          "role": "contract",
          "component": {
            "id": "component:platform.command",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "codeId": "impl:command.command-declaration.depot-commands",
          "claim": "anchored",
          "label": "the depot fixture's command declarations",
          "file": "fixture/convex/depotCommands.ts",
          "line": 3
        }
      ],
      "verifiers": {
        "total": 2,
        "enabled": 2
      },
      "examples": {
        "total": 2,
        "enabled": 2
      }
    },
    {
      "id": "spec:command.command-pipeline",
      "resolved": true,
      "title": "The command pipeline",
      "specKind": "workflow",
      "altitude": "feature",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "has-verifier"
      ],
      "file": "design/specs/command/command-pipeline.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 35,
        "declarations": 18,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-30: the doc names the outcome, the operation ID and the affected stream versions as what a command returns, but not a wire shape; the shape here is a union discriminated by `replayed`, whose executed member carries the declaration's result and whose replayed member carries `result` null because a receipt stores no result, so the entry's returns validator admits a replay as a value; affected IDs are application IDs, never private document IDs (E-30, D2, D6, D8)",
            "blocking": false,
            "key": "commandOutcomeWireShape",
            "line": 68
          },
          {
            "index": 1,
            "question": "Extension E-31: the doc says an operation's ID ties together everything one request caused but not how it is minted, and it says a derived command carries causation and an event's `causedBy` may be a triggering event without saying how that cause reaches the pipeline; here the pipeline mints the operation ID once per top-level mutation with `crypto.randomUUID()` before the first context call, a duplicate returns the operation ID stored on the receipt, and the internal entry takes an optional `causedBy` argument that step 7 copies onto the `OperationRef` when present, so a reaction that issues a derived command passes `causedBy` of kind `event` naming its publication event and the envelope's `event` variant has exactly one producer, while an entry called without it mints `causedBy` of kind `command` from the declaration's name; the obligation and attempt behind a derived command are found through its receipt, whose request key is the obligation's effect key, and never through the envelope (E-31, E-54, D2, D13, Vocab: operation)",
            "blocking": false,
            "key": "operationIdentityCause",
            "line": 69
          },
          {
            "index": 2,
            "question": "Extension E-32: the doc places rate admission for new intent after the duplicate check and makes a rate or capacity refusal a retryable error, but names no admission mechanism; here admission is an optional per-command policy in the declaration, absent by default, evaluated inside the mutation so that a refusal that throws leaves no consumption behind; the flip side is that a consumption the policy writes commits only with the command, so the policy counts committed intent and cannot bound refused or unauthorized traffic, and a product that must bound refused traffic needs the dispatcher form of D7, where the parent survives the body's rejection (E-32, D4, D6, D7)",
            "blocking": false,
            "key": "commandAdmissionPolicy",
            "line": 70
          },
          {
            "index": 3,
            "question": "Extension E-33: the doc lists the callers that need receipts and leaves UI commands to the client guarantee; here a public caller may still supply a request key to opt into a receipt, which Probe 1 showed a caller of `ConvexHttpClient` needs when it retries, and the internal entry always requires one (E-33, D6, Probe 1)",
            "blocking": false,
            "key": "publicRequestKey",
            "line": 71
          },
          {
            "index": 4,
            "question": "Probe 4 showed on the pinned backend that the transaction limits are one budget across the parent and its component sub-transactions, so the per-command bounds are checked against one budget; `ctx.runMutation` accepts a `transactionLimits` option, the design passes none on a context call, and whether a call should reserve room with it for the work after it stays open (Probe 4, F13, S3)",
            "blocking": false,
            "key": "contextCallBudgetReservation",
            "line": 72
          },
          {
            "index": 5,
            "question": "Extension E-9: the doc says essential read models are updated inside the command and does not say from what or in what order; here step 9 writes a per-entity read model from the DTO of each matching `streams` entry, never from its events, and a history read model from the events of every matching entry in one call per command, checks `writes` first, then that each bound read model has a generation to write, then the count of the rows it writes against `limitReadModelWritesPerCommand`, each failure a plain error, and the library helpers that step 9 calls are generic over the application's data model; the owner has not ruled on any of it (E-9, E-7, E-8, E-45, D8, D9)",
            "blocking": false,
            "key": "commandReadModelWrites",
            "line": 73
          },
          {
            "index": 6,
            "question": "Extension E-34: step 1 bounds every text field a caller sets beside the input, the tenant ID, the request key, the correlation ID, the actor's fields and the fields of `causedBy`, in UTF-8 bytes as `limitCallText` lists them, as rejection `invalidInput`, and treats a declaration name above `limitIdLength` as a defect, a plain error, because these fields become fields of the receipt row or of every event's envelope; the doc says events stay small and names no number; the owner has not ruled (E-34, D6, D12, D19)",
            "blocking": false,
            "key": "commandTextBounds",
            "line": 74
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d01-one-mutation-per-operation",
            "title": "One mutation per business operation",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d04-four-outcomes",
            "title": "Four outcomes, not a boolean",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d06-idempotency-client-and-receipts",
            "title": "Convex covers UI retries, receipts cover the rest",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d07-rejections-thrown-not-stored",
            "title": "Rejections are thrown, not stored, at the public boundary",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d08-read-models-in-command",
            "title": "Read models update inside the command",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d10-contexts-meet-in-parent-use-cases",
            "title": "Contexts meet only in parent use cases",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d11-tenant-scope-and-authority",
            "title": "Tenant scope and authority from day one",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d12-one-declaration-per-command",
            "title": "One declaration per command, generated bindings later",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:application.read-models",
          "claim": "anchored",
          "label": "writeReadModels, step 9's read-model half",
          "file": "src/read-model/write.ts",
          "line": 3,
          "role": "service",
          "component": {
            "id": "component:platform.read-model",
            "layer": "application",
            "context": "platform"
          }
        },
        {
          "codeId": "impl:command.command-pipeline",
          "claim": "anchored",
          "label": "runPipeline and the command response",
          "file": "src/command/pipeline.ts",
          "line": 3,
          "role": "service",
          "component": {
            "id": "component:platform.command",
            "layer": "application",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 3,
        "enabled": 3
      },
      "examples": {
        "total": 3,
        "enabled": 3
      }
    },
    {
      "id": "spec:context.event-envelope",
      "resolved": true,
      "title": "The event envelope",
      "specKind": "contract",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [
        "implemented"
      ],
      "file": "design/specs/context/event-envelope.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 16,
        "declarations": 10,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-26: the doc lists the fifteen fields and their meaning; this Spec fixes the validator shapes, the `CausedBy` union with a migration variant for baseline events, the `OperationRef` the parent passes, and the event ID as a version 4 UUID from the runtime's `crypto`; the owner confirms (D2, E-26)",
            "blocking": false,
            "key": "eventEnvelopeFields",
            "line": 31
          },
          {
            "index": 1,
            "question": "Extension E-12: the doc says events stay small and gives no number for the envelope; this Spec bounds the envelope beside the payload at `limitEnvelopeBytes`, 4,096 bytes, and each text field of it that a caller can set at 256 bytes of UTF-8, 512 for an actor's ID, so the largest stored event, `limitEventBytes`, is derived and enforced and never assumed; the owner may set other numbers, and the fold bound of `spec:context.journal` moves with them (E-12, D19, F13)",
            "blocking": false,
            "key": "envelopeTextBounds",
            "line": 32
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d02-context-owns-state-and-journal",
            "title": "Each bounded context owns its state and its journal",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [
        {
          "codeId": "impl:context.event-envelope",
          "claim": "anchored",
          "label": "the envelope types and validators",
          "file": "src/context/envelope.ts",
          "line": 2,
          "role": "contract",
          "component": {
            "id": "component:platform.context",
            "layer": "adapter",
            "context": "platform"
          }
        }
      ],
      "references": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:context.journal",
      "resolved": true,
      "title": "The journal",
      "specKind": "behavior",
      "altitude": "feature",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/context/journal.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 39,
        "declarations": 18,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Extension E-25: the doc says a migration writes a baseline event holding the migrated state and that rebuild starts from the latest baseline, and it does not say who computes that state, who drives the migration, or what a live command does on a stream the migration has not reached; this Spec fixes the representation, an event of the reserved type `baseline` whose payload holds the state and its schema version and is bounded by the stream's `budgetBytes` instead of the payload bound, a `baselineVersion` on the stream row, a `BaselineMigration` registered on the stream type whose `migrate` function computes the migrated state from the saved state, or, for a step that declares `readsHistory`, from the saved state and the events since the last baseline in the sweep only, the rule that `stateSchemaVersion` counts meaning only and lives on the registration, one helper `migrateToSchemaVersion` that writes the baseline chain, called by the adapter on load for a chain that reads no history and by the `writeBaseline` maintenance mutation for every chain, the code-older-than-data error, the `writeBaseline` mutation built by `defineMaintenance` and declared with the component's public `mutation` builder, the parent-side scheduled chain that drives it by cursor, the batch bound derived from `budgetBytes`, the upcasting rule for old event schema versions, the fold bound of 500 events with the refusals `rebuildStream` returns above it and for a stream awaiting its baseline, the retirement rule for a migration, and the payload byte check in `append`; the option of refusing commands on unmigrated streams with a transient code until the sweep arrives was not taken for a state-only migration, because it turns a deploy into a partial write pause the doc reserves for history-dependent views, and is taken for a history-reading migration, the exception, where it holds only the streams the sweep has not reached and keeps D3 whole on the command path, which the owner confirmed; a consequence the owner should weigh is that every baseline bumps its stream's version, so a reviewed version held across the sweep is answered `staleVersion` and re-reviewed rather than silently accepted, because Sc L1-10 forbids reinterpreting a reviewed version against fresh state and the baseline is a real event of the stream, while a live stream migrated on load never trips it because its expected-version check runs before the chain; and the driver reads the write pause's gate before every batch and reschedules itself when refused, so a sweep never changes a source under a paused rebuild's cut; the owner confirms (D5, D9, S4, Sc L1-10, E-2, E-8, E-12, E-25)",
            "blocking": false,
            "key": "baselineMigrationContract",
            "line": 51
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d02-context-owns-state-and-journal",
            "title": "Each bounded context owns its state and its journal",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:decisions.d05-rebuildable-history-with-baselines",
            "title": "Rebuildable history by default, with baseline events",
            "statedReadiness": "defined",
            "resolved": true
          },
          {
            "id": "spec:kernel.state-document-mapping",
            "title": "One document per stream, with a derived mapping above the budget",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:context.journal",
          "claim": "anchored",
          "label": "createJournal, load and append",
          "file": "src/context/journal.ts",
          "line": 2,
          "role": "event-store",
          "component": {
            "id": "component:platform.context",
            "layer": "adapter",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 1,
        "enabled": 0
      },
      "examples": {
        "total": 1,
        "enabled": 0
      }
    },
    {
      "id": "spec:context.queries",
      "resolved": true,
      "title": "The context queries",
      "specKind": "contract",
      "altitude": "story",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/context/queries.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 29,
        "declarations": 18,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Probe 5 showed on the pinned backend with `convex-helpers` 0.1.124 that the parent query stays reactive, that pages pinned by their end cursors stay contiguous, that a capped page crosses the boundary as `SplitRequired` with its `splitCursor`, and that the `usePaginatedQuery` hook of `convex-helpers/react` then shows 40 of 45 rows; this design uses no hook across the boundary, and the examples are rerun when either pin moves (Probe 5, F15, S4, D8, E-24)",
            "blocking": false,
            "key": "contextPaginationSplit",
            "line": 41
          },
          {
            "index": 1,
            "question": "Extension E-24: the doc says component queries are authorized and return DTOs; this Spec fixes one definer per query, the one `tenantId` argument with no separate scope, the `toDto` mapping with the stream version on every DTO, pagination through `paginator`, the item cap with a row cap of twice the item cap and a byte cap passed on every run, the relay of `pageStatus` and `splitCursor` unchanged, paging by an explicit cursor pair with no client hook, the parent query's one `authorizeQuery` call and its refusal as a rejection, the `maxEvents` argument of the `rebuild` query and its `budgetExhausted` refusal for a batching caller, and the fold refusal of the `rebuild` query; this is a provisional reading the owner has not ruled (D8, S4, E-24, E-42)",
            "blocking": false,
            "key": "contextQueryContract",
            "line": 42
          },
          {
            "index": 2,
            "question": "A parent query's refusal carries the name of the entry that refused in the field `entry` of the rejection data; the wire shape stays `RejectionData` of `spec:command.outcome-boundary` unchanged, and the owner confirmed the word (D7, E-24)",
            "blocking": false,
            "key": "queryRefusalEntry",
            "line": 43
          }
        ],
        "decisions": [
          {
            "id": "spec:decisions.d08-read-models-in-command",
            "title": "Read models update inside the command",
            "statedReadiness": "defined",
            "resolved": true
          }
        ]
      },
      "implementations": [],
      "references": [
        {
          "codeId": "impl:context.queries",
          "claim": "anchored",
          "label": "defineGet, defineList and boundedPage",
          "file": "src/context/queries.ts",
          "line": 3,
          "role": "query",
          "component": {
            "id": "component:platform.context",
            "layer": "adapter",
            "context": "platform"
          }
        }
      ],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    },
    {
      "id": "spec:decisions.d09-rebuild-online-by-default",
      "resolved": true,
      "title": "Rebuild online by default, pause writes only for history-dependent views",
      "specKind": "decision",
      "altitude": "feature",
      "statedReadiness": "defined",
      "derivedReadiness": "ready",
      "deliveryFacts": [],
      "file": "design/specs/decisions/d09-rebuild-online-by-default.sdp.md",
      "statedNextRung": "ready",
      "statedNextRungFailures": [],
      "design": {
        "entries": 0,
        "declarations": 0,
        "blockingQuestions": 0,
        "openQuestions": [
          {
            "index": 0,
            "question": "Probe 6 ran a backfill batch racing a live command and the migrations component on the native backend, with its results on F17; a hosted deployment and sustained contention are not run (Probe 6, F1, F17, D9)",
            "blocking": false,
            "key": "rebuildContentionCoverage",
            "line": 30
          }
        ],
        "decisions": []
      },
      "implementations": [],
      "references": [],
      "verifiers": {
        "total": 0,
        "enabled": 0
      },
      "examples": {
        "total": 0,
        "enabled": 0
      }
    }
  ],
  "verifierGaps": [
    {
      "id": "spec:application.history-projection",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:application.projection-contract",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:application.history-rebuild",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-interrupt",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-abort",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-version-change",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-installation",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:application.history-rebuild.write-pause-rebuild-source-order-mismatch",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:context.event-envelope",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:context.journal",
      "statedReadiness": "defined",
      "priority": false
    },
    {
      "id": "spec:context.queries",
      "statedReadiness": "defined",
      "priority": false
    }
  ],
  "boundary": {
    "restsOn": [
      {
        "id": "spec:application.first-experiment",
        "title": "The first experiment",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:command.actor-and-scope",
        "title": "Actor, tenant scope, namespace and grants",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.idempotency-and-receipts",
        "title": "Idempotency and receipts",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.outcome-boundary",
        "title": "The outcome and rejection boundary",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.receipt-table",
        "title": "The receipts table",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.tenancy-and-authority",
        "title": "Tenancy and authority",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.bulk-operations-bounded",
        "title": "Every bulk operation has a stated bound",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.events-stay-small",
        "title": "Events stay small",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.no-queue-recovery-for-essential-reads",
        "title": "No queue recovery needed for essential reads",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:constraints.zero-core-projection-jobs",
        "title": "Zero core projection jobs",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:context.batch-shaped-api",
        "title": "Batch-shaped context APIs",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:context.context-component",
        "title": "The context component",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:context.journal",
              "spec:context.queries"
            ]
          },
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:context.persistence-adapter",
        "title": "The persistence adapter",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:context.tables",
        "title": "The context tables",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d01-one-mutation-per-operation",
        "title": "One mutation per business operation",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.read-models",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d02-context-owns-state-and-journal",
        "title": "Each bounded context owns its state and its journal",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d03-events-only-source-of-next-state",
        "title": "Events are the only source of the next state",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d04-four-outcomes",
        "title": "Four outcomes, not a boolean",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d05-rebuildable-history-with-baselines",
        "title": "Rebuildable history by default, with baseline events",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d06-idempotency-client-and-receipts",
        "title": "Convex covers UI retries, receipts cover the rest",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d07-rejections-thrown-not-stored",
        "title": "Rejections are thrown, not stored, at the public boundary",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d08-read-models-in-command",
        "title": "Read models update inside the command",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          },
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d10-contexts-meet-in-parent-use-cases",
        "title": "Contexts meet only in parent use cases",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d11-tenant-scope-and-authority",
        "title": "Tenant scope and authority from day one",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d12-one-declaration-per-command",
        "title": "One declaration per command, generated bindings later",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d18-everything-else-waits-for-trigger",
        "title": "Everything else waits for its trigger",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d19-operations-travel-with-capability",
        "title": "Operations travel with the capability",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.rebuild",
              "spec:application.history-rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f01-serializable-mutations-under-occ",
        "title": "Mutations are serializable under optimistic concurrency",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.journal",
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f02-component-calls-commit-with-caller",
        "title": "Component calls commit or roll back with the calling mutation",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f03-nested-run-mutation-partial-rollback",
        "title": "A nested runMutation gives partial rollback",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f04-nested-calls-cost-more-than-helpers",
        "title": "Nested calls cost more than helper calls",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f07-queries-reactive-not-durable-delivery",
        "title": "Queries are reactive, subscriptions are not durable delivery",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f08-scheduling-commits-with-mutation",
        "title": "Scheduling from a mutation commits with it",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f09-scheduled-mutation-and-action-retry-semantics",
        "title": "Scheduled mutations run once, scheduled actions are not retried",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f11-components-have-no-ctx-auth",
        "title": "Components have no ctx.auth",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f12-backups-exclude-pending-scheduled-functions",
        "title": "Backups exclude pending scheduled functions",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f13-transactions-have-limits",
        "title": "Transactions have limits",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f14-convex-error-survives-nested-and-component-boundary",
        "title": "ConvexError data survives a nested mutation and a component boundary",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f15-parent-query-over-component-query-stays-reactive",
        "title": "A parent query over a component query stays reactive",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f17-migrations-fits-generation-backfill",
        "title": "The migrations component fits a generation backfill",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.rebuild",
              "spec:application.generation-registry",
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f18-commit-timestamps",
        "title": "Commit timestamps order committed transactions",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f19-nested-calls-share-time-budgets",
        "title": "Nested calls draw on a system-operation time budget",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:facts.f20-pagination-checks-bytes-after-reading",
        "title": "Pagination checks bytes after reading",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:kernel.outcome-model",
        "title": "The outcome model",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:kernel.state-document-mapping",
        "title": "One document per stream, with a derived mapping above the budget",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "decidedBy",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law01-sanctioned-writes-only",
        "title": "Business writes go only through sanctioned operations",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law02-state-and-events-commit-together",
        "title": "State and its required events commit together",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law03-events-only-source-of-state",
        "title": "Events are the only source of the next state",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law04-server-scoped-idempotency-key",
        "title": "A retryable command carries a server-scoped idempotency key",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law05-authorization-before-execution-and-disclosure",
        "title": "Authorization comes before execution and disclosure",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:command.command-pipeline",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law06-technical-failure-never-a-rejection",
        "title": "A technical failure is never stored as a rejection",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law09-no-invariant-on-late-read-model",
        "title": "No invariant depends on a late read model",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.read-models",
              "spec:application.orders-inventory-example",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law10-replay-never-runs-commands-or-effects",
        "title": "Replay never runs commands or repeats effects",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.history-projection",
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:laws.law11-tenant-scope-named",
        "title": "Every command and query names its tenant scope",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "constrainedBy",
            "members": [
              "spec:application.projection-contract",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.generation-registry",
              "spec:command.command-pipeline",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:operations.baseline-operations",
        "title": "Baseline operations",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause",
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:platform.transactional-domain-platform",
        "title": "Convex transactional domain platform",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      }
    ],
    "restedOnBy": [
      {
        "id": "spec:advanced.cross-stream-online-rebuild",
        "title": "Online rebuild of cross-stream history views",
        "statedReadiness": "scoped",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:agents.agent-runs",
        "title": "Agent runs",
        "statedReadiness": "scoped",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:application.aggregate-projection",
        "title": "Aggregate projection",
        "statedReadiness": "scoped",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          },
          {
            "type": "dependsOn",
            "members": [
              "spec:application.projection-contract",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          },
          {
            "type": "decidedBy",
            "members": [
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:application.first-experiment",
        "title": "The first experiment",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.history-projection",
              "spec:application.read-models",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.generation-registry",
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:application.generation-registry.command-without-generation-fails",
        "title": "A command whose read model has no generation fails",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.generation-registry.first-rebuild-installs-read-model",
        "title": "A read model is installed through its first rebuild",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-duplicate-answered-from-receipt",
        "title": "A repeated cancel request is answered from its receipt",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-placed-order",
        "title": "A placed order is cancelled",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-second-context-rejects",
        "title": "Orders cancels, then Inventory refuses the release",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-twice-rejected",
        "title": "A second cancel of one order is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-unknown-order-rejected",
        "title": "A cancel of an order never placed is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-without-grant-refused",
        "title": "A caller without the cancel grant is refused",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.parent-use-cases",
        "title": "Parent use cases",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-read-through-query",
        "title": "A successful command, then a query",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-visible",
        "title": "A successful command, then a query or subscription",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.list-pages-by-cursor",
        "title": "A client reads a tenant's order list in pages by cursor",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-before-disclosure",
        "title": "A caller with no identity reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-without-grant",
        "title": "A caller with no grant in the tenant reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.rebuild.online-rebuild-interrupt-resume",
        "title": "Rebuild a per-entity read model online while commands run; interrupt and resume",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:application.restore",
        "title": "Restore",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.projection-contract",
              "spec:application.rebuild",
              "spec:application.history-rebuild",
              "spec:application.write-pause",
              "spec:application.generation-registry",
              "spec:context.event-envelope",
              "spec:context.journal",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:application.write-pause.restore-door-without-deploy",
        "title": "The restore door closes and opens with no deploy",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.broken-argument-contract-fails-build",
        "title": "Break a typed handler's argument contract",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.renamed-handler-fails-build",
        "title": "Rename a typed handler",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-journal-append",
        "title": "Inject a failure after the journal append",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-state-write",
        "title": "Inject a failure after the state write",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-before-receipt",
        "title": "Inject a failure before the receipt insert",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.idempotency-and-receipts",
        "title": "Idempotency and receipts",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          },
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.outcome-boundary",
        "title": "The outcome and rejection boundary",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.receipt-table",
        "title": "The receipts table",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause",
              "spec:context.queries"
            ]
          }
        ]
      },
      {
        "id": "spec:command.tenancy-and-authority",
        "title": "Tenancy and authority",
        "statedReadiness": "defined",
        "implemented": true,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:context.context-component",
        "title": "The context component",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope"
            ]
          }
        ]
      },
      {
        "id": "spec:context.journal.rebuild-from-baseline",
        "title": "Rebuild a stream that has a baseline event",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "refines",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:context.persistence-adapter",
        "title": "The persistence adapter",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope",
              "spec:context.journal"
            ]
          }
        ]
      },
      {
        "id": "spec:context.tables",
        "title": "The context tables",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope"
            ]
          }
        ]
      },
      {
        "id": "spec:decisions.d18-everything-else-waits-for-trigger",
        "title": "Everything else waits for its trigger",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:decisions.d09-rebuild-online-by-default"
            ]
          }
        ]
      },
      {
        "id": "spec:obligations.fan-out-and-chains",
        "title": "Fan-out and reaction chains",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-declaration",
              "spec:command.command-pipeline",
              "spec:context.event-envelope"
            ]
          }
        ]
      },
      {
        "id": "spec:obligations.local-reaction-wrapper",
        "title": "Local reaction wrapper",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:obligations.obligation-module",
        "title": "Obligation module",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:operations.baseline-operations",
        "title": "Baseline operations",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "dependsOn",
            "members": [
              "spec:context.event-envelope"
            ]
          }
        ]
      }
    ],
    "verifiedBy": [
      {
        "id": "spec:application.generation-registry.command-without-generation-fails",
        "title": "A command whose read model has no generation fails",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.generation-registry.first-rebuild-installs-read-model",
        "title": "A read model is installed through its first rebuild",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.generation-registry"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-duplicate-answered-from-receipt",
        "title": "A repeated cancel request is answered from its receipt",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-placed-order",
        "title": "A placed order is cancelled",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-second-context-rejects",
        "title": "Orders cancels, then Inventory refuses the release",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-twice-rejected",
        "title": "A second cancel of one order is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-unknown-order-rejected",
        "title": "A cancel of an order never placed is rejected",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.orders-inventory-example.cancel-without-grant-refused",
        "title": "A caller without the cancel grant is refused",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.orders-inventory-example"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-read-through-query",
        "title": "A successful command, then a query",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.committed-state-visible",
        "title": "A successful command, then a query or subscription",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.list-pages-by-cursor",
        "title": "A client reads a tenant's order list in pages by cursor",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-before-disclosure",
        "title": "A caller with no identity reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.read-models.query-refused-without-grant",
        "title": "A caller with no grant in the tenant reads an order through the parent",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.read-models"
            ]
          }
        ]
      },
      {
        "id": "spec:application.rebuild.online-rebuild-interrupt-resume",
        "title": "Rebuild a per-entity read model online while commands run; interrupt and resume",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.rebuild"
            ]
          }
        ]
      },
      {
        "id": "spec:application.write-pause.restore-door-without-deploy",
        "title": "The restore door closes and opens with no deploy",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:application.write-pause"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.broken-argument-contract-fails-build",
        "title": "Break a typed handler's argument contract",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-declaration.renamed-handler-fails-build",
        "title": "Rename a typed handler",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-declaration"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-journal-append",
        "title": "Inject a failure after the journal append",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-after-state-write",
        "title": "Inject a failure after the state write",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:command.command-pipeline.failure-before-receipt",
        "title": "Inject a failure before the receipt insert",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:command.command-pipeline"
            ]
          }
        ]
      },
      {
        "id": "spec:context.journal.rebuild-from-baseline",
        "title": "Rebuild a stream that has a baseline event",
        "statedReadiness": "defined",
        "implemented": false,
        "via": [
          {
            "type": "verifies",
            "members": [
              "spec:context.journal"
            ]
          }
        ]
      }
    ],
    "supersededBy": []
  },
  "findings": []
}
};
