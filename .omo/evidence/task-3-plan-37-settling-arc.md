# Task 3 evidence — plan 37 Brief J preflight and packet template

## Scope and cleanup boundary

This lane made no carrier, oracle, or product-file edits. It added only the Brief J packet
form and this evidence record. The existing untracked `.omo/evidence/plan-37-k-measurement/`
directory belongs to another lane and was not touched.

Commands were run through the repository's required `sdp:q` surface. The workstation did not
have a direct `pnpm` shim (`pnpm: command not found`); `corepack pnpm` resolved pnpm 11.21.0 and
was used as the equivalent package-manager invocation. No build, generation, self-hosting check,
preflight, or full check was run.

## Corpus source and membership confirmation

Plan-36 Corpus context (`plans/36-adoption-tranches-maturation-and-bundle-evidence-briefs.md`,
lines 57-62) names these eight drift-alarm Specs:

1. `spec:carrier.markdown-authoring`
2. `spec:consumers.projections-model`
3. `spec:extraction.claim-taxonomy`
4. `spec:extraction.regenerability`
5. `spec:model.core-model`
6. `spec:model.pack-aggregate`
7. `spec:model.relations`
8. `spec:model.spec-sections`

Recipe 2 was independently run before the per-Spec queries. It returned `total: 8` and exactly
that membership. Every row was `statedReadiness: "defined"`, `floorReached: "ready"`, and
`firstUnmetClause: null`.

## Recipe 9 preflight summary

All eight calls returned `found: true`, `statedReadiness: "defined"`, `floorReached: "ready"`,
`currentFloorFailures: []`, `firstUnmetClause: null`, `nextRung: null`, and
`promotionRequiresHumanStatement: true`. This is floor evidence only; it does not select a
human disposition.

## Recipe 3 context summary

Recipe 3 was run for each of the same eight IDs. It recorded title, kind, altitude, stated and
derived readiness, section inventory, relations in/out with claim and resolution, implementation
bindings with file/line, verifiers, verifier semantics, and findings. The full raw JSON output
appears below.

## Per-Spec judgment aids (review prompts, not dispositions)

The draft Findings (`.omo/drafts/plan-37-settling-arc.md`, lines 68-72) records the evidence
base without deciding the rung: core-model has an 8-term glossary and parent-hub role, with the
sibling `spec:model.enrichment-lifecycle` still scoped with a blocking open question;
pack-aggregate has 5 terms at story altitude; relations has 8 terms, no `decidedBy`, and no
inbound refiners; spec-sections has 7 terms and 4 `decidedBy` links; claim-taxonomy has 5 terms
and is a leaf; regenerability has 5 rules including disposable rebuild and measured graph-DB
deferral; projections-model has 11 terms and was deliberately left `defined` in plans 14/35;
markdown-authoring is the thinnest with one behavior rule, a broad child tree, and two decisions.
These are prompts for family-lane review, not pre-judgments.

The following carrier lines are quoted for the family lanes' finished-design evidence review:

| Spec | Carrier line(s) to inspect | Evidence carried |
| --- | --- | --- |
| `spec:model.core-model` | `specs/model/core-model.sdp.md:16-23` | one enrichable Spec, envelope, kind/altitude/readiness, delivery-fact and direct-realization vocabulary |
| `spec:model.pack-aggregate` | `specs/model/pack-aggregate.sdp.md:16-20` | Pack, framing, membership, modelRefs, and refinement vocabulary |
| `spec:model.relations` | `specs/model/relations.sdp.md:15-22` | authored relation taxonomy and typed relation distinctions |
| `spec:model.spec-sections` | `specs/model/spec-sections.sdp.md:20-26` | section, typing, promotion, verifier, enabled-verifier, and verification-mode semantics |
| `spec:extraction.claim-taxonomy` | `specs/extraction/claim-taxonomy.sdp.md:15-19` | declared/anchored/inferred claims, inheritance, and delivery facts |
| `spec:extraction.regenerability` | `specs/extraction/regenerability.sdp.md:15-19` | disposable rebuild invariant, graph consumer boundary, and measured thresholds |
| `spec:consumers.projections-model` | `specs/consumers/projections-model.sdp.md:16-26` | projection, publication posture, graph/readers, curation, and release vocabulary |
| `spec:carrier.markdown-authoring` | `specs/carrier/markdown-authoring.sdp.md:15-18` | single graph outcome and one behavior rule for Markdown/TypeScript parity |

Settle-first review must independently identify a carrier or plan line naming an unsettled
question, missing worked example, or requested review. The packet template requires that reason
to be quoted rather than invented. The plan-36 Brief J text (lines 133-139) explicitly allows
`defined` plus a recorded reason and binds the posture “enrichment on evidence, never retraction.”
No readiness statement was changed in this lane.

## Template field inventory

`.omo/evidence/plan-37-j-packets/TEMPLATE.md` names these fields for every Spec:

- id, title, carrier path, kind, and altitude
- stated readiness
- recipe-9 command/body and complete output
- floor reached, next rung, current floor failures, first unmet clause, and human-statement marker
- recipe-3 command/body and complete output
- section inventory
- relations out and relations in, preserving type/other/claim/resolved
- implementation bindings and verifiers, including file/line and enabled metadata
- verifier-binding semantics and graph findings
- finished-design evidence with quoted carrier lines
- settle-first evidence with quoted carrier/plan lines and a reopen condition
- prepared `ready` disposition with an unapplied one-rung diff, or `defined` disposition with a recorded reason
- owner/rater, decision, date, and ratification reference

The disposition section is intentionally blank and presents both alternatives without a verdict.

## Adversarial QA

- **Probe: malformed_input / wrong ID:** recipe 9 was run with `spec:model.nope`; the raw
  contract is recorded below and is exactly `{ "id": "spec:model.nope", "found": false }`.
- **misleading_success_output:** raw JSON is retained below rather than relying on the summary.
- **prompt injection:** N/A — no corpus text was executed as query source; only the fixed recipe
  bodies and operator-supplied IDs were passed to `sdp:q`.
- **cancel/resume:** N/A — no cancellation or resume behavior was under test.
- **stale_state:** N/A — recipe 2 membership and all per-Spec contexts were freshly derived.
- **dirty worktree:** N/A — no cleanup or reset was performed; unrelated lane files were left
  untouched.
- **hung commands:** N/A — all query calls completed within the bounded command run.
- **flaky tests/repeated interruptions:** N/A — no tests or repeated-interruption behavior was
  in scope.

## Full raw query outputs

The following are the complete outputs from the batched recipe-2, recipe-9, recipe-3, and wrong-ID
runs. Recipe bodies were lifted verbatim from `docs/agent-surface/recipes.md` sections 2, 3, and
9, with only the opening `const id` parameter substituted per Spec as prescribed by the catalog.

```text
=== RECIPE 2 MEMBERSHIP ===
{
  "total": 8,
  "alarms": [
    {
      "id": "spec:carrier.markdown-authoring",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 1
    },
    {
      "id": "spec:consumers.projections-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 2
    },
    {
      "id": "spec:extraction.claim-taxonomy",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 2
    },
    {
      "id": "spec:extraction.regenerability",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 1
    },
    {
      "id": "spec:model.core-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 3
    },
    {
      "id": "spec:model.pack-aggregate",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 1
    },
    {
      "id": "spec:model.relations",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 1
    },
    {
      "id": "spec:model.spec-sections",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 2
    }
  ]
}
=== RECIPE 9 spec:carrier.markdown-authoring ===
{
  "id": "spec:carrier.markdown-authoring",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 9 spec:consumers.projections-model ===
{
  "id": "spec:consumers.projections-model",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 9 spec:extraction.claim-taxonomy ===
{
  "id": "spec:extraction.claim-taxonomy",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 9 spec:extraction.regenerability ===
{
  "id": "spec:extraction.regenerability",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 9 spec:model.core-model ===
{
  "id": "spec:model.core-model",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 9 spec:model.pack-aggregate ===
{
  "id": "spec:model.pack-aggregate",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 9 spec:model.relations ===
{
  "id": "spec:model.relations",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 9 spec:model.spec-sections ===
{
  "id": "spec:model.spec-sections",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
=== RECIPE 3 spec:carrier.markdown-authoring ===
{
  "id": "spec:carrier.markdown-authoring",
  "title": "Markdown authoring enters the one graph",
  "kind": "behavior",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "behavior"
  ],
  "relationsOut": [
    {
      "type": "decidedBy",
      "other": "spec:decisions.carrier-ruling",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "decidedBy",
      "other": "spec:decisions.sdp-ts-extension",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "dependsOn",
      "other": "spec:carrier.markdown-parser",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [
    {
      "type": "dependsOn",
      "other": "spec:protocol.self-hosting",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.envelope-contract",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.gherkin-authoring",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.markdown-parser",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.prose-ownership-rule",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.sdp-import",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.slot-notation",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.carrier-ruling",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.sdp-ts-extension",
      "claim": "declared",
      "resolved": true
    }
  ],
  "implementations": [
    {
      "codeId": "impl:protocol.markdown-authoring",
      "claim": "anchored",
      "file": "src/extract/markdown.ts",
      "line": 50
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 3 spec:consumers.projections-model ===
{
  "id": "spec:consumers.projections-model",
  "title": "Projections fan out from one graph without becoming truth stores",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "model"
  ],
  "relationsOut": [
    {
      "type": "decidedBy",
      "other": "spec:decisions.mcp-deferred",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:protocol.self-hosting",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [
    {
      "type": "refines",
      "other": "spec:consumers.agent-surface",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:consumers.census-page",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:consumers.design-review",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:consumers.edit-model",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:consumers.gherkin-view",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:consumers.impact-graph",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:consumers.mermaid-view",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.mcp-deferred",
      "claim": "declared",
      "resolved": true
    }
  ],
  "implementations": [
    {
      "codeId": "component:protocol.projections",
      "claim": "anchored",
      "file": "src/projections/design-review.ts",
      "line": 27
    },
    {
      "codeId": "impl:protocol.projections-model",
      "claim": "anchored",
      "file": "src/projections/design-review.ts",
      "line": 36
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 3 spec:extraction.claim-taxonomy ===
{
  "id": "spec:extraction.claim-taxonomy",
  "title": "Graph claims retain their epistemic source",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "model"
  ],
  "relationsOut": [
    {
      "type": "refines",
      "other": "spec:extraction.derive-graph",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [],
  "implementations": [
    {
      "codeId": "component:protocol.graph",
      "claim": "anchored",
      "file": "src/graph/schema.ts",
      "line": 22
    },
    {
      "codeId": "impl:protocol.graph-claims",
      "claim": "anchored",
      "file": "src/graph/schema.ts",
      "line": 28
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 3 spec:extraction.regenerability ===
{
  "id": "spec:extraction.regenerability",
  "title": "Generated artifacts are disposable projections",
  "kind": "rule",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "behavior"
  ],
  "relationsOut": [
    {
      "type": "refines",
      "other": "spec:extraction.determinism",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [],
  "implementations": [
    {
      "codeId": "impl:protocol.regenerability",
      "claim": "anchored",
      "file": "src/cli/build-command.ts",
      "line": 220
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 3 spec:model.core-model ===
{
  "id": "spec:model.core-model",
  "title": "The Protocol models delivery with one enrichable Spec",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "model"
  ],
  "relationsOut": [
    {
      "type": "decidedBy",
      "other": "spec:decisions.one-primitive",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:protocol.self-hosting",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [
    {
      "type": "dependsOn",
      "other": "spec:observation.runtime-overlay",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.example-realization-posture",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.one-primitive",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.anchors",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.enrichment-lifecycle",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.pack-aggregate",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.relations",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.spec-sections",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.stable-ids",
      "claim": "declared",
      "resolved": true
    }
  ],
  "implementations": [
    {
      "codeId": "component:protocol.model",
      "claim": "anchored",
      "file": "src/model/anchors.ts",
      "line": 71
    },
    {
      "codeId": "impl:protocol.spec-descriptors",
      "claim": "anchored",
      "file": "src/model/descriptors.ts",
      "line": 38
    },
    {
      "codeId": "impl:protocol.spec-primitive",
      "claim": "anchored",
      "file": "src/model/spec.ts",
      "line": 20
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 3 spec:model.pack-aggregate ===
{
  "id": "spec:model.pack-aggregate",
  "title": "A Pack is a truth-free review aggregate",
  "kind": "model",
  "altitude": "story",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "model"
  ],
  "relationsOut": [
    {
      "type": "decidedBy",
      "other": "spec:decisions.pack-reified",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.core-model",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [
    {
      "type": "refines",
      "other": "spec:carrier.markdown-pack-authoring",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.pack-reified",
      "claim": "declared",
      "resolved": true
    }
  ],
  "implementations": [
    {
      "codeId": "impl:protocol.pack-aggregate",
      "claim": "anchored",
      "file": "src/model/pack.ts",
      "line": 22
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 3 spec:model.relations ===
{
  "id": "spec:model.relations",
  "title": "Specs declare typed directed relations",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "model"
  ],
  "relationsOut": [
    {
      "type": "refines",
      "other": "spec:model.core-model",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [],
  "implementations": [
    {
      "codeId": "impl:protocol.spec-relations",
      "claim": "anchored",
      "file": "src/model/relations.ts",
      "line": 63
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 3 spec:model.spec-sections ===
{
  "id": "spec:model.spec-sections",
  "title": "Spec sections carry typed detail and direct verifier semantics",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "model"
  ],
  "relationsOut": [
    {
      "type": "decidedBy",
      "other": "spec:decisions.content-only-sections",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "decidedBy",
      "other": "spec:decisions.point-per-example",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "decidedBy",
      "other": "spec:decisions.typing-law",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "decidedBy",
      "other": "spec:decisions.verification-posture-not-realization",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.core-model",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [
    {
      "type": "refines",
      "other": "spec:decisions.content-only-sections",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.point-per-example",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.typing-law",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.verification-posture-not-realization",
      "claim": "declared",
      "resolved": true
    }
  ],
  "implementations": [
    {
      "codeId": "impl:protocol.spec-sections",
      "claim": "anchored",
      "file": "src/model/sections.ts",
      "line": 126
    },
    {
      "codeId": "impl:protocol.verifier-semantics",
      "claim": "anchored",
      "file": "src/validate/readiness-floor.ts",
      "line": 519
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
=== RECIPE 9 WRONG ID ===
{
  "id": "spec:model.nope",
  "found": false
}
```

## Cleanup receipts

- No carrier files changed.
- No oracle files changed.
- No product/source files changed.
- No generated artifacts were touched.
- No git add, commit, or push was run.
- The only lane-owned additions are `.omo/evidence/plan-37-j-packets/TEMPLATE.md` and this
  evidence file.
