# F3 real-surface Manual QA — architectural-patterns-views

Independent F3 (`st_01a0229c`). HEAD `aa54e86a40943f555f03f8ce57eb32bd0036b0de`. Branch `feature/architectural-patterns-views`. No product, plan, Boulder, or ledger edit. No stage, commit, push, or stash. No full `npm run check`. No sleeps or retries.

Pre-F3 `generated/` held only `graph.json`, `contracts/`, `registrars.json` (projection trees already stripped by repository validate). Restored with `npm run generate:self-hosting`, certified with `npm run check:self-hosting`, then exercised the live CLI.

## Verdict

`pass`

```json
{
  "type": "FinalAudit",
  "audit": "F3",
  "plan": "architectural-patterns-views",
  "verdict": "pass",
  "head": "aa54e86a40943f555f03f8ce57eb32bd0036b0de",
  "branch": "feature/architectural-patterns-views",
  "worktree": "/home/darkomijic/dev-libar/software-delivery-protocol",
  "fullNpmCheckRun": false,
  "commands": [
    {
      "command": "npm run generate:self-hosting",
      "exit": 0,
      "role": "restore ignored self-hosting projection trees after validate had stripped them",
      "observations": [
        "Banner 162 specs · 1 packs · 172 anchors → 335 nodes · 731 edges (0 errors, 0 warnings)",
        "Published generated/design-review (164 pages), generated/census (1 pages), generated/mermaid (164 pages), generated/gherkin (163 pages)",
        "validate: 0 errors · 5 warnings on each projection verb"
      ]
    },
    {
      "command": "npm run check:self-hosting",
      "exit": 0,
      "role": "certify restored trees --check-clean",
      "observations": [
        "exit 0, no retry",
        "Same banner 162/1/172 → 335/731",
        "Exactly five honesty/gaps warnings, no extra class"
      ]
    },
    {
      "command": "pnpm --silent sdp --help",
      "exit": 0,
      "role": "help for q",
      "observations": [
        "stderr empty",
        "Usage line documents sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--json]",
        "q paragraph: derive-in-process, write-nothing, argv or stdin, refuse rather than wait when neither, return is the output contract, --json is JSON.stringify, body throw exits 1"
      ]
    },
    {
      "command": "pnpm --silent sdp:q 'return {{{' --json",
      "exit": 1,
      "role": "malformed q body (bad input)",
      "observations": [
        "stdout empty — no leaked derivation result",
        "stderr exactly: sdp q: Unexpected token '{'",
        "nonzero with a useful parse diagnostic"
      ]
    },
    {
      "command": "pnpm --silent sdp:q '<recipe-17-body>' --json",
      "exit": 0,
      "role": "catalog recipe 17 architecture map, body extracted by the recipes.test.ts fence parser from docs/agent-surface/recipes.md",
      "observations": [
        "stderr empty",
        "components.length === 13",
        "includes component:protocol.import (members 3, fanIn 1, fanOut 2) and component:protocol.testing (members 1, fanIn 0, fanOut 2)",
        "ids: adapters, cli, codegen, extract, graph, import, model, notation, projections, reader, runner, testing, validate",
        "member counts sum to 73; fan data present on every component"
      ]
    },
    {
      "command": "pnpm --silent sdp:q '<recipe-18-body>' --json",
      "exit": 0,
      "role": "catalog recipe 18 decision map",
      "observations": [
        "stderr empty",
        "total === 34, ranking.length === 34, decisions.length === 34",
        "ranking fanIn sum === 12, outgoing dependsOn count === 12, incoming dependedOnBy count === 12",
        "every decision has empty supersedes and supersededBy; fanInByType.supersedes === 0",
        "top fanIn: binding-not-liveness 4, kind-conditional-floor 2, then six at 1, remaining 26 at 0"
      ]
    },
    {
      "command": "pnpm --silent sdp:q '<recipe-19-body>' --json",
      "exit": 0,
      "role": "catalog recipe 19 planning slice, default id spec:consumers.agent-surface",
      "observations": [
        "stderr empty",
        "found: true",
        "parents: [spec:consumers.projections-model]",
        "children: authoring-recipes, demand-map-entries, scripted-context-body, reader, agent-front-door, agent-surface-scripts-graph",
        "constrainingDecisions: agent-front-door, agent-surface-scripts-graph, mcp-deferred",
        "components protocol.cli and protocol.reader; 7 blastRadiusEntryPoints; file-level blastRadiusLimit"
      ]
    },
    {
      "command": "pnpm --silent sdp:q '<recipe-19-unknown-body>' --json",
      "exit": 0,
      "role": "recipe 19 with only the opening const id substituted to spec:does-not-exist.unknown",
      "observations": [
        "stderr empty",
        "exact JSON {\"id\":\"spec:does-not-exist.unknown\",\"found\":false}"
      ]
    },
    {
      "command": "pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity",
      "exit": 0,
      "role": "exact repository validate (AGENTS.md)",
      "observations": [
        "Banner 162 specs · 1 packs · 172 anchors → 335 nodes · 731 edges (0 errors, 0 warnings)",
        "Wrote generated/graph.json and generated/contracts (102 modules)",
        "validate: 0 errors · 5 warnings",
        "After exit, generated/ contained only graph.json, contracts/, registrars.json — design-review, census, mermaid, gherkin removed, matching the task-14 note"
      ]
    },
    {
      "command": "npm run generate:self-hosting",
      "exit": 0,
      "role": "re-restore ignored projection trees so they remain as the normal restored surface after validate stripped them",
      "observations": [
        "exit 0; census, design-review, mermaid, gherkin republished"
      ]
    }
  ],
  "warningClassification": {
    "selfHosting": {
      "errors": 0,
      "warnings": 5,
      "classes": ["honesty/gaps"],
      "extraClasses": [],
      "subjects": [
        "spec:carrier.markdown-authoring",
        "spec:extraction.claim-taxonomy",
        "spec:model.pack-aggregate",
        "spec:model.relations",
        "spec:model.spec-sections"
      ],
      "message": "states readiness \"ready\" with no resolving verifier — a gap, informative only (ready never requires delivery facts).",
      "observedOn": [
        "generate:self-hosting",
        "check:self-hosting",
        "sdp validate (AGENTS.md exact)"
      ]
    },
    "notObservedOnThisSurface": [
      "example corpus conformance/verifies-linkage (full npm run check / generate:example not run, per F3 instruction)"
    ]
  },
  "manualQa": {
    "verdict": "pass",
    "recipe17": {
      "components": 13,
      "includesImportAndTesting": true,
      "fanDataPresent": true,
      "memberCountSum": 73
    },
    "recipe18": {
      "decisions": 34,
      "dependencyFanInSum": 12,
      "supersedes": 0
    },
    "recipe19Known": {
      "id": "spec:consumers.agent-surface",
      "found": true,
      "neighborhoodAndDecisionsMatchTask14Closeout": true
    },
    "recipe19Unknown": {
      "id": "spec:does-not-exist.unknown",
      "found": false,
      "exact": true
    },
    "projectionSpotCheck": {
      "artifact": "generated/census/index.md",
      "against": "live recipe 17 JSON (in-process sdp:q, not generated/graph.json as authority)",
      "match": [
        "13 component rows including protocol.import (3 members, fan-in 1, fan-out 2) and protocol.testing (1 member, fan-in 0, fan-out 2)",
        "Uses fan-in/fan-out table identical to recipe 17 fanIn/fanOut for all 13 components",
        "Census summary: CodeNode component satisfies 13, uses 25, impl memberOf 73"
      ],
      "designReview": [
        "generated/design-review/spec/decisions.architectural-significance-rides-primitives.md present",
        "index.md lists MD-34 ready/ready",
        "carrier.sdp-import.md binds component:protocol.import; extraction.example-runner.md binds component:protocol.testing"
      ]
    }
  },
  "cleanup": {
    "tempBodiesRemoved": "/tmp/f3-apv (recipe bodies, stdout/stderr captures)",
    "sdpProcessesLeft": 0,
    "ignoredGeneratedTrees": "restored and left as the normal self-hosting surface (census, design-review, mermaid, gherkin plus graph.json/contracts/registrars.json)",
    "untouchedDirtyPaths": [".omo/start-work/ledger.jsonl"],
    "ownedWrite": ".omo/evidence/architectural-patterns-views/final-verification/f3-manual-qa.md",
    "gitMutations": "none"
  },
  "residualRisks": [
    "Full npm run check was not re-run here (F3 instruction). Task 14 already recorded one green full gate at 1f09c39; product tree at aa54e86 is orchestration-only after that gate.",
    "Example-corpus verifies-linkage warning is outside this self-hosting-only surface.",
    "Recipe 19 can throw if a memberOf target is not a CodeNode (F2 finding). Live self-hosting census reports no dangling structural references; F3 did not inject a dirty graph.",
    "Concurrent sibling F audits may rewrite or strip ignored generated/ after this capture. That does not change the live sdp:q results."
  ]
}
```
