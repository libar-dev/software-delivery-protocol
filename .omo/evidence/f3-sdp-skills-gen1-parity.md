# F3 real manual QA: sdp-skills-gen1-parity

Date: 2026-08-20
Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol`
HEAD: `8df0d80 chore(.omo): plan 37 F5 PR opened`
Documented source surface: `pnpm --silent sdp` / `pnpm --silent sdp:q` (`node ./dist/cli/sdp.js`)
Node: v24.19.0

No product, skill, test, or plan file was edited. This file is the only write.

**Verdict: APPROVE**

Happy path, bad input, help, source on-ramp, and installed-package all match the changed skills.

## 1. Spec count

`WORKING: parity F3 - spec count`

```
CMD: pnpm --silent sdp:q 'return g.specs().length'
started: 2026-08-20T13:02:16+02:00
ended:   2026-08-20T13:02:24+02:00
exit=0
--- stdout ---
156
```

Expected 156. Got 156.

## 2. Stdout contract (console is not suppressed)

`WORKING: parity F3 - stdout contract`

The packed and worktree skill both say: `return` is the machine output contract, but `sdp q` does not suppress `console.*`.

```
CMD: pnpm --silent sdp:q 'console.log("side-output"); return "value"'
started: 2026-08-20T13:02:16+02:00
ended:   2026-08-20T13:02:24+02:00
exit=0
--- stdout ---
side-output
'value'
```

Side-output prints first. The rendered return `'value'` follows. That is the unchanged runtime. The old claim "nothing else is printed" is gone from the packed skill.

JSON form, same wrapper, still a clean machine object:

```
CMD: pnpm --silent sdp:q 'return { specs: g.specs().length, packs: g.packs().length }' --json
started: 2026-08-20T13:02:16+02:00
ended:   2026-08-20T13:02:24+02:00
exit=0
--- stdout ---
{
  "specs": 156,
  "packs": 1
}
```

## 3. Graph still readable

`WORKING: parity F3 - graph read`

```
CMD: pnpm --silent sdp:q 'return g.findByConcept("Gherkin carrier").slice(0,3).map(n=>n.id)'
started: 2026-08-20T13:02:16+02:00
ended:   2026-08-20T13:02:24+02:00
exit=0
--- stdout ---
[
  'spec:decisions.sdp-gherkin-extension',
  'test:protocol.gherkin-authoring.authored-fact-refused',
  'test:protocol.gherkin-authoring.contract-parity'
]
```

Frozen adapter `findByConcept` still returns nodes with ids. No parse-the-corpus workaround.

## 4. Authoring refusals

`WORKING: parity F3 - authoring refusal`

The authoring skill says there is no dry-run flag, and PATH must stay cwd-relative without `..`.

Parent-listed probe:

```
CMD: pnpm --silent sdp new spec forbidden/escape.sdp.md --kind feature --dry-run
started: 2026-08-20T13:02:16+02:00
ended:   2026-08-20T13:02:20+02:00
exit=1
--- stdout ---
(empty)
--- stderr ---
sdp new spec: unknown option --dry-run
```

After the probe: no `forbidden/` directory, no `forbidden/escape.sdp.md`. `--dry-run` is refused before kind or path are considered. That is the right refusal. `sdp new spec` does not grow a dry-run flag.

Extra outside-root probe from the authoring skill PATH rule:

```
CMD: pnpm --silent sdp new spec ../forbidden.sdp.md --id spec:qa.forbidden --kind behavior --altitude story --title "Forbidden" --outcome "Must not write outside root"
exit=1
--- stdout ---
(empty)
--- stderr ---
sdp new spec: PATH must stay cwd-relative and must not contain .. segments.
```

`/home/darkomijic/dev-libar/forbidden.sdp.md` was not created.

Throwing query body (plan F3 bad-input):

```
CMD: pnpm --silent sdp:q 'throw new Error("qa-sentinel")'
exit=1
--- stdout ---
(empty)
--- stderr ---
sdp q: qa-sentinel
```

No leaked graph result. Non-zero. Bounded.

## 5. Validate

`WORKING: parity F3 - validate`

```
CMD: pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
started: 2026-08-20T13:02:57+02:00
ended:   2026-08-20T13:03:03+02:00
exit=0
--- stdout ---
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
--- stderr (5 honesty/gaps warnings) ---
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
```

Exit 0. Five warnings. Extraction line `(0 errors, 0 warnings)` is the graph derive summary; the validate closer is the one that counts the five honesty/gaps warnings.

`generated/` is gitignored. The working tree product diff did not grow.

## 6. Source-checkout on-ramp

`WORKING: parity F3 - on-ramp`

```
CMD: pnpm exec sdp --help
started: 2026-08-20T13:02:16+02:00
ended:   2026-08-20T13:02:19+02:00
exit=1
--- stdout ---
undefined
[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command "sdp" not found

Did you mean "pnpm exec tsup"?
```

That is the source-checkout contract. This package does not link `sdp` into its own `node_modules/.bin`. `pnpm exec` looks for a dependency binary. The skills tell you to use `pnpm --silent sdp` / `pnpm --silent sdp:q` here, not `pnpm exec`.

```
CMD: pnpm --silent sdp --help
started: 2026-08-20T13:02:16+02:00
ended:   2026-08-20T13:02:20+02:00
exit=0
stderr empty (0 bytes)
first line: sdp — Libar Software Delivery Protocol
```

Usage includes `sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--json]`. Verbs named: build, validate, view, census, mermaid, gherkin, import, new spec, q. Help still calls `return` the output contract and does not mention `console.*`. That is CLI help, not the skill, and it does not claim "nothing else is printed". The skill is the more precise statement, and the runtime matches the skill.

## 7. Installed package

`WORKING: parity F3 - installed package`

```
CMD: npx vitest run test/package-smoke.test.ts
started: 2026-08-20T13:03:37+02:00
ended:   2026-08-20T13:03:58+02:00
exit=0
Test Files  1 passed (1)
Tests  1 passed (1)
Duration  19.97s
```

The suite builds, packs, installs into a disposable consumer, runs installed `sdp --help`, dry-runs `sdp import` without writing, and reads the three installed `SKILL.md` files. Pack listing from that run:

```
.agents/skills/sdp-agent-surface/SKILL.md
.agents/skills/sdp-authoring/SKILL.md
.agents/skills/sdp-sessions/SKILL.md
docs/agent-surface/recipes.md
```

19 files. No fourth skill. No `references/` tree. No `sdp-base`.

A second `npm pack` extract (then deleted) confirmed the shipped bytes:

- agent-surface carries `does not suppress` / `console.*` and does not carry `nothing else is printed`
- authoring carries `There is no dry-run flag` and `must not contain ..`; no `files.associations`, no `@cucumber/gherkin@`, no `@cucumber/messages@`
- README says `sixteen graph-first recipes` and `sixteen recipe bodies`; no live `eleven`
- packed `sdp-sessions/SKILL.md` sha256 matches the worktree file
- packed `docs/agent-surface/recipes.md` has 16 numbered headings

## Product tree after QA

`git status --short` product paths are still the Wave 1 three:

```
.agents/skills/sdp-agent-surface/SKILL.md
.agents/skills/sdp-authoring/SKILL.md
README.md
```

No `forbidden/` carrier. No outside-root file. Temp pack directory removed.

## DoneClaim

```json
{
  "task": "st_01a01ed5 / sdp-skills-gen1-parity F3",
  "verdict": "APPROVE",
  "changed_files": [".omo/evidence/f3-sdp-skills-gen1-parity.md"],
  "tests": "npx vitest run test/package-smoke.test.ts exit 0, 1 file 1 test",
  "manual_qa": "sdp:q length 156; console side-output then 'value'; findByConcept three ids; new spec --dry-run unknown option; validate 0 errors 5 warnings; pnpm exec sdp --help exit 1; pnpm --silent sdp --help exit 0",
  "cleanup": "removed /tmp/f3-parity-pack-OGVO; no forbidden carriers left behind",
  "risks": "none for F3; CLI --help still omits the console.* sentence, which is out of this plan's file set"
}
```
