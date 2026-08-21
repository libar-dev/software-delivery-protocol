# F3 real-surface Manual QA — architectural-patterns-views (post-remediation)

Independent F3 (`st_01a0229c`) at HEAD `c244bf06125481f4e01b1a9d197b0925c4088731` (`fix: resolve architecture views final review findings`). Branch `feature/architectural-patterns-views`. No product, plan, Boulder, ledger, stage, commit, push, or stash. No full `npm run check`. No sleeps or retries. This file replaces the pre-remediation F3 capture at `aa54e86`.

Pre-run `generated/` held only `graph.json`, `contracts/`, `registrars.json`. Restored with `npm run generate:self-hosting`, certified with `npm run check:self-hosting`, exercised the live CLI, ran the exact dirty-graph regression, then validated and re-restored.

## Verdict

`pass`

```json
{
  "type": "FinalAudit",
  "audit": "F3",
  "plan": "architectural-patterns-views",
  "phase": "post-remediation",
  "verdict": "pass",
  "head": "c244bf06125481f4e01b1a9d197b0925c4088731",
  "branch": "feature/architectural-patterns-views",
  "worktree": "/home/darkomijic/dev-libar/software-delivery-protocol",
  "fullNpmCheckRun": false,
  "commands": [
    {
      "command": "npm run generate:self-hosting",
      "exit": 0,
      "role": "restore ignored self-hosting projection trees",
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
        "q paragraph: derive-in-process, write-nothing, argv or stdin, refuse rather than wait, return is the output contract, --json is JSON.stringify, body throw exits 1"
      ]
    },
    {
      "command": "pnpm --silent sdp:q 'return {{{' --json",
      "exit": 1,
      "role": "malformed q body (bad input)",
      "observations": [
        "stdout empty",
        "stderr exactly: sdp q: Unexpected token '{'",
        "nonzero with a useful parse diagnostic"
      ]
    },
    {
      "command": "pnpm --silent sdp:q '<recipe-17-body>' --json",
      "exit": 0,
      "role": "catalog recipe 17 architecture map, fence-extracted from docs/agent-surface/recipes.md",
      "observations": [
        "stderr empty",
        "components.length === 13 including protocol.import (members 3, fanIn 1, fanOut 2) and protocol.testing (members 1, fanIn 0, fanOut 2)",
        "member counts sum to 73; fan data present on every component"
      ]
    },
    {
      "command": "pnpm --silent sdp:q '<recipe-18-body>' --json",
      "exit": 0,
      "role": "catalog recipe 18 decision map",
      "observations": [
        "stderr empty",
        "total === 34; ranking fanIn sum === 12; dependsOn in/out === 12",
        "every decision has empty supersedes/supersededBy and fanInByType.supersedes === 0"
      ]
    },
    {
      "command": "pnpm --silent sdp:q '<recipe-19-body>' --json",
      "exit": 0,
      "role": "catalog recipe 19 planning slice, default id spec:consumers.agent-surface",
      "observations": [
        "stderr empty",
        "found: true; neighborhood and constrainingDecisions unchanged vs pre-remediation close-out",
        "top-level key implementations present; abstractions absent from Object.keys, nested component rows, and the raw JSON string",
        "catalog body contains 0 occurrences of abstractions and 11 of implementations",
        "known binding IDs: impl:protocol.agent-surface (src/reader/reader.ts:362) and impl:protocol.agent-surface-cli (src/cli/sdp.ts:100)",
        "component rows carry implementations arrays (cli → agent-surface-cli, reader → agent-surface), never abstractions"
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
      "command": "npx vitest run test/recipes.test.ts -t \"preserves an unresolved component row when memberOf outlives the node\"",
      "exit": 0,
      "role": "exact focused dirty-graph regression (nullable unresolved component row)",
      "observations": [
        "1 passed | 26 skipped (27); duration ~4.5s; no retry",
        "Override removes component:protocol.reader node, retains memberOf from impl:protocol.agent-surface",
        "validateGraph reports conformance/referential-integrity; sink exits 0",
        "unresolved row keeps id with label/file/line null; implementation id retained; no component blast-radius entry for the missing node"
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
        "After exit, generated/ contained only graph.json, contracts/, registrars.json — projection trees stripped"
      ]
    },
    {
      "command": "npm run generate:self-hosting",
      "exit": 0,
      "role": "re-restore ignored projection trees after validate",
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
      "neighborhoodUnchanged": true,
      "constrainingDecisionsUnchanged": true,
      "emitsImplementationsOnly": true,
      "abstractionsAnywhere": false,
      "knownBindingIds": [
        "impl:protocol.agent-surface",
        "impl:protocol.agent-surface-cli"
      ]
    },
    "recipe19Unknown": {
      "id": "spec:does-not-exist.unknown",
      "found": false,
      "exact": true
    },
    "dirtyGraph": {
      "method": "exact focused regression test/recipes.test.ts it('preserves an unresolved component row when memberOf outlives the node')",
      "exit": 0,
      "nullableUnresolvedRow": true,
      "implementationRetained": "impl:protocol.agent-surface",
      "noThrow": true
    },
    "projectionSpotCheck": {
      "artifact": "generated/census/index.md",
      "against": "live recipe 17 JSON (in-process sdp:q)",
      "match": [
        "13 component rows including protocol.import (3 members, fan-in 1, fan-out 2) and protocol.testing (1 member, fan-in 0, fan-out 2)",
        "Census CodeNode component satisfies 13, uses 25"
      ],
      "designReview": [
        "generated/design-review/index.md lists spec:decisions.architectural-significance-rides-primitives ready/ready"
      ]
    }
  },
  "cleanup": {
    "tempBodiesRemoved": "/tmp/f3-apv-post (recipe bodies, stdout/stderr captures)",
    "sdpProcessesLeft": 0,
    "ignoredGeneratedTrees": "re-restored after validate and left as the normal self-hosting surface",
    "untouchedDirtyPaths": [".omo/start-work/ledger.jsonl"],
    "ownedWrite": ".omo/evidence/architectural-patterns-views/final-verification/f3-manual-qa.md",
    "gitMutations": "none"
  },
  "residualRisks": [
    "Full npm run check was not re-run here (F3 instruction).",
    "Example-corpus verifies-linkage warning is outside this self-hosting-only surface.",
    "Concurrent sibling writes may rewrite or strip ignored generated/ after this capture. Live sdp:q results are independent of those trees."
  ]
}
```
