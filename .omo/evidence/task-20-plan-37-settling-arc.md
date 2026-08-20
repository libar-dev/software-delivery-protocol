# Task 20. Plan 37 final gate

CLOSED. Two consecutive `npm run check` runs exited 0. Statuses flipped in one pass. F5 remains unchecked.

The STOPPED attempt below is the earlier CLI-pin failure, kept as history.

## Preconditions (step 1)

F1-F4 checkboxes in `.omo/plans/plan-37-settling-arc.md` are `[x]`. Artifacts:

- `.omo/evidence/f1-plan-37-settling-arc.md` current final verdict `APPROVE`, open findings 0
- `.omo/evidence/f2-plan-37-settling-arc.md` verdict `APPROVE`
- `.omo/evidence/f3-plan-37-settling-arc.md` verdict `APPROVE`
- `.omo/evidence/f4-plan-37-settling-arc.md` current final verdict `APPROVE`, open findings 0

Owner okay recorded as exact statement `okay` (2026-08-20) in `.omo/evidence/ulw-20260820-081346.05dmOx.md` under "Transition — final-wave owner okay", after "F1-F4 all APPROVE".

## Pass 1 — `npm run check`

Command: `npm run check` (serialized, first of two). Exit **1**. Second run not started.

Earlier legs exited 0: `check:temporal`, `lint`, `format:check`, `build`, `generate:self-hosting`, `generate:example`, `typecheck`, `typecheck:examples`. `npm test` failed. Later legs (`check:self-hosting-gates`, `check:self-hosting`, `check:example`, `preflight`) did not run.

Full stdout/stderr, including the `EXIT:1` marker appended after the process:

```
> @libar-dev/software-delivery-protocol@0.0.0 check
> npm run check:temporal && npm run lint && npm run format:check && npm run build && npm run generate:self-hosting && npm run generate:example && npm run typecheck && npm run typecheck:examples && npm test && npm run check:self-hosting-gates && npm run check:self-hosting && npm run check:example && npm run preflight


> @libar-dev/software-delivery-protocol@0.0.0 check:temporal
> node ./check-temporal.mjs


> @libar-dev/software-delivery-protocol@0.0.0 lint
> eslint .


> @libar-dev/software-delivery-protocol@0.0.0 format:check
> prettier --check .

Checking formatting...
All matched files use Prettier code style!

> @libar-dev/software-delivery-protocol@0.0.0 build
> tsup

CLI Building entry: src/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /home/darkomijic/dev-libar/software-delivery-protocol/tsup.config.ts
CLI Building entry: src/index.ts, src/adapters/vitest.ts, src/cli/sdp.ts, src/runner/index.ts, src/testing/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /home/darkomijic/dev-libar/software-delivery-protocol/tsup.config.ts
CLI Target: es2022
CJS Build start
CLI Target: es2022
CLI Cleaning output folder
ESM Build start

 WARN  ▲ [WARNING] "import.meta" is not available with the "cjs" output format and will be empty [empty-import-meta]

    src/extract/protocol-bindings.ts:53:20:
      53 │   const moduleUrl = import.meta.url;
         ╵                     ~~~~~~~~~~~

  You need to set the output format to "esm" for "import.meta" to work correctly.



CJS dist/index.cjs 342.06 KB
CJS ⚡️ Build success in 112ms
ESM dist/adapters/vitest.js 10.01 KB
ESM dist/runner/index.js    9.13 KB
ESM dist/testing/index.js   14.20 KB
ESM dist/index.js           335.97 KB
ESM dist/cli/sdp.js         408.02 KB
ESM ⚡️ Build success in 107ms
DTS Build start
DTS ⚡️ Build success in 5056ms
DTS dist/adapters/vitest.d.ts 325.00 B
DTS dist/cli/sdp.d.ts         10.29 KB
DTS dist/index.d.ts           20.08 KB
DTS dist/testing/index.d.ts   2.11 KB
DTS dist/runner/index.d.ts    5.35 KB
DTS dist/census-erZPBp8-.d.ts 47.91 KB

> @libar-dev/software-delivery-protocol@0.0.0 generate:self-hosting
> node ./projection-suite.mjs . --exclude explorations --exclude examples --exclude test/fixtures/import/parity

156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/design-review (158 pages)
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/census (1 pages)
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/mermaid (158 pages)
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/gherkin (157 pages)

> @libar-dev/software-delivery-protocol@0.0.0 generate:example
> node ./projection-suite.mjs examples/checkout-v1

11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/contracts (3 modules)
specs/orders/create-order-invalid-cart.sdp.md — [warning] conformance/verifies-linkage — Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier.
validate: 0 errors · 1 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/design-review (13 pages)
11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/contracts (3 modules)
specs/orders/create-order-invalid-cart.sdp.md — [warning] conformance/verifies-linkage — Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier.
validate: 0 errors · 1 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/census (1 pages)
11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/contracts (3 modules)
specs/orders/create-order-invalid-cart.sdp.md — [warning] conformance/verifies-linkage — Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier.
validate: 0 errors · 1 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/mermaid (13 pages)
11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/contracts (3 modules)
specs/orders/create-order-invalid-cart.sdp.md — [warning] conformance/verifies-linkage — Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier.
validate: 0 errors · 1 warnings (conformance + honesty over the one graph)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/examples/checkout-v1/generated/gherkin (12 pages)

> @libar-dev/software-delivery-protocol@0.0.0 typecheck
> tsc --noEmit -p tsconfig.json


> @libar-dev/software-delivery-protocol@0.0.0 typecheck:examples
> tsc --noEmit -p tsconfig.examples.json


> @libar-dev/software-delivery-protocol@0.0.0 test
> node ./vitest-test.mjs


 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 ❯ test/markdown-reifier.test.ts (103 tests | 1 failed) 1631ms
     × keeps specs/carrier/markdown-authoring.sdp.md.txt byte-identical to its live carrier 36ms
[warn] ▲ [WARNING] "import.meta" is not available with the "cjs" output format and will be empty [empty-import-meta]

    src/extract/protocol-bindings.ts:53:20:
      53 │   const moduleUrl = import.meta.url;
         ╵                     ~~~~~~~~~~~

  You need to set the output format to "esm" for "import.meta" to work correctly.


npm notice
npm notice 📦  @libar-dev/software-delivery-protocol@0.0.0
npm notice Tarball Contents
npm notice 7.1kB .agents/skills/sdp-agent-surface/SKILL.md
npm notice 11.3kB .agents/skills/sdp-authoring/SKILL.md
npm notice 4.1kB .agents/skills/sdp-sessions/SKILL.md
npm notice 11.4kB LICENSE
npm notice 5.8kB README.md
npm notice 325B dist/adapters/vitest.d.ts
npm notice 10.2kB dist/adapters/vitest.js
npm notice 49.2kB dist/census-erZPBp8-.d.ts
npm notice 10.5kB dist/cli/sdp.d.ts
npm notice 417.8kB dist/cli/sdp.js
npm notice 350.3kB dist/index.cjs
npm notice 20.7kB dist/index.d.ts
npm notice 344.0kB dist/index.js
npm notice 5.5kB dist/runner/index.d.ts
npm notice 9.3kB dist/runner/index.js
npm notice 2.2kB dist/testing/index.d.ts
npm notice 14.5kB dist/testing/index.js
npm notice 26.7kB docs/agent-surface/recipes.md
npm notice 3.2kB package.json
npm notice Tarball Details
npm notice name: @libar-dev/software-delivery-protocol
npm notice version: 0.0.0
npm notice filename: libar-dev-software-delivery-protocol-0.0.0.tgz
npm notice package size: 279.4 kB
npm notice unpacked size: 1.3 MB
npm notice shasum: fff162bfb6d844dc1008a3cd7a29a192c960f34b
npm notice integrity: sha512-l/D0STDW05fZe[...]wtbOOxDXxVlvg==
npm notice total files: 19
npm notice

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/markdown-reifier.test.ts > Markdown frontmatter reifier > keeps specs/carrier/markdown-authoring.sdp.md.txt byte-identical to its live carrier
AssertionError: expected Buffer[ 45, 45, 45, 10, 105, 100, …(424) ] to deeply equal Buffer[ 45, 45, 45, 10, 105, 100, …(426) ]

- Expected
+ Received

@@ -82,17 +82,15 @@
      101,
      115,
      115,
      58,
      32,
-     100,
+     114,
      101,
-     102,
-     105,
-     110,
-     101,
+     97,
      100,
+     121,
      10,
      114,
      101,
      108,
      97,

 ❯ test/markdown-reifier.test.ts:208:25
    206|       const liveBytes = await readFile(new URL(path.slice(0, -4), new …
    207|
    208|       expect(liveBytes).toEqual(fixtureBytes);
       |                         ^
    209|     },
    210|   );

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 61 passed (62)
      Tests  1 failed | 837 passed | 1 skipped (839)
   Start at  11:31:59
   Duration  31.80s (transform 9.30s, setup 0ms, import 92.56s, tests 67.95s, environment 17ms)

EXIT:1
```

## Pass 2

Not run. Binding order stops after a non-zero first check.

## Diagnosis

`test/markdown-reifier.test.ts` `byteIdenticalFixturePaths` includes `specs/carrier/markdown-authoring.sdp.md.txt` under `test/fixtures/extract/self-hosting-carrier/`. The test requires those bytes to equal live `specs/carrier/markdown-authoring.sdp.md`.

Todo 16 commit `7f768d1` set the live carrier `readiness: ready`. The fixture still has `readiness: defined`. The assertion dump is that one token: expected `defined` (bytes `100,101,102,105,110,101,100`), received `ready` (`114,101,97,100,121`).

Wave 3 after Todo 16 ran focused graph/validate work, not this suite. This is the first full `npm run check` since that rung.

Todo 20 is not authorized to edit `test/` or `specs/` to close the pin.

Focused repro, same failure without the rest of the gate:

```sh
npx vitest run test/markdown-reifier.test.ts -t "keeps specs/carrier/markdown-authoring.sdp.md.txt"
```

## Status surfaces (unchanged)

- `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` header remains `🔄 EXECUTING`
- `AGENTS.md` remains `plan 37 is EXECUTING`
- `plans/36-…-briefs.md` remains DRAFTED lineage, commissioned-plans line still says executing
- Todo 20 checkbox remains `[ ]`
- F5 remains `[ ]`

## Disclosed next blocker, not reached

`git ls-files --others --exclude-standard` still lists five nonignored untracked `.omo` paths (parity draft/plan/evidence and the ultrawork note). `preflight.mjs` fails closed on that set. Those files were preserved and not cleaned. They were not this run's failure because `npm test` stopped the gate first.

## Cleanup

No Plan 37 status edit. Generated trees are gitignored; `git status --short -- generated examples/checkout-v1/generated` is empty. No live `npm run check` / vitest process. Scratch capture `/tmp/plan37-todo20-check1.txt` removed after pasting the tail above. Unrelated boulder, parity, and ultrawork dirt left in place.

## Retry after fixture fix `b98ccc9` and checkpoint `f556957d`

STOPPED again. No status flip. No commit. Todo 20 and F5 remain unchecked.

Preflight ancestry and workspace conditions passed: HEAD was exactly `f556957d119f6e18a4aa95502ac5919f944d1691`; `b98ccc9` was its ancestor; the only nonignored untracked paths were this file and `.omo/evidence/task-20-fixture-fix-plan-37-settling-arc.md`.

Fixture confirmation passed once:

```text
npx vitest run test/markdown-reifier.test.ts -t "keeps specs/carrier/markdown-authoring.sdp.md.txt"
Test Files  1 passed (1)
Tests  1 passed | 102 skipped (103)
```

Before pass 1, the two Todo-20 evidence files were temporarily moved outside the repository so preflight could inspect a clean untracked set. They were restored immediately after the failure.

Pass 1 command: `npm run check`. Exit **1** at the first leg, `npm run check:temporal`. Pass 2 was not run. Exact failure lead:

```text
> @libar-dev/software-delivery-protocol@0.0.0 check:temporal
> node ./check-temporal.mjs

check:temporal — banned temporal tokens found:
```

Every reported violation is in tracked `.omo/start-work/ledger.jsonl`. Checkpoint `f556957d` added that file with 241 lines. It did not exist in the checkpoint's parent. The file contains the banned session, wave, date, and numbered-plan tokens that `check-temporal.mjs` scans in every cached path. This fails before lint, build, tests, the status gate, and preflight.

Exact focused repro from this checkpoint:

```sh
npm run check:temporal
```

Expected result: exit 1 with `.omo/start-work/ledger.jsonl` violations. Repair must remove that checkpoint-only orchestration path from tracked delivery state without adding it to the Todo-20 manifest. The retry task expressly excludes `start-work/ledger.jsonl`, parity state, ultrawork state, and `.omo/boulder.json` from the close commit, so this worker did not alter or stage them.

Status surfaces remain unchanged: Plan 37 and `AGENTS.md` still say EXECUTING; Plan 36 remains DRAFTED with its commissioned-plan line saying executing; Todo 20 and F5 remain unchecked. No pin/gate run followed because both full checks did not pass.

## Retry after ledger untrack `808dbc6` and fixture ancestry `b98ccc9`

STOPPED. No status flip. No commit. Todo 20 and F5 remain unchecked.

Preflight ancestry and workspace conditions passed: `b98ccc9` is an ancestor of HEAD `808dbc6`; `npm run check:temporal` exits 0; `git ls-files --others --exclude-standard` showed only this file and `.omo/evidence/task-20-fixture-fix-plan-37-settling-arc.md`. Those two files plus dirty F1/F4 artifacts and `.omo/plans/plan-37-settling-arc.md` were staged before the gate. Unstaged leftovers were only `.omo/evidence/ulw-20260820-081346.05dmOx.md`. `.omo/boulder.json`, `start-work/ledger.jsonl`, and parity files were not staged.

Pass 1 command: `npm run check`. Exit **1** at `npm test`, after pooled Vitest (62 files, 838 passed, 1 skipped) and during the dedicated `test/cli.test.ts` pass. Later legs (`check:self-hosting-gates`, `check:self-hosting`, `check:example`, `preflight`) did not run. Pass 2 was not started.

Earlier legs exited 0: `check:temporal`, `lint`, `format:check`, `build`, `generate:self-hosting`, `generate:example`, `typecheck`, `typecheck:examples`.

Pass 1 tail:

```
 Test Files  62 passed (62)
      Tests  838 passed | 1 skipped (839)
   Start at  12:03:38
   Duration  31.97s (transform 9.07s, setup 0ms, import 88.86s, tests 67.58s, environment 20ms)


 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 ❯ test/cli.test.ts (80 tests | 1 failed) 3130ms
     × views the self-hosting corpus from the default repository root 2295ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/cli.test.ts > sdp cli > views the self-hosting corpus from the default repository root
AssertionError: expected 'specs/carrier/markdown-authoring.sdp.…' to be '' // Object.is equality

- Expected
+ Received

+ specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
+ specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
+ specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
+ specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
+ specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
+

 ❯ test/cli.test.ts:205:36
    203|
    204|       expect(exitCode).toBe(0);
    205|       expect(capture.readStderr()).toBe("");
       |                                    ^
    206|       expect(capture.readStdout()).toContain("validate: 0 errors · 0 w…
    207|       expect(readFileSync(join(root, "generated", "graph.json"), "utf8…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 79 passed (80)
   Start at  12:04:11
   Duration  4.20s (transform 506ms, setup 0ms, import 937ms, tests 3.13s, environment 0ms)

EXIT:1
```

## Pass 2

Not run. Binding order stops after a non-zero first check.

## Diagnosis

`test/cli.test.ts` `views the self-hosting corpus from the default repository root` copies live `specs/` into a temp root, then runs `sdp view --check-clean` with the Protocol exclusions. It still pins empty stderr and stdout `validate: 0 errors · 0 warnings`.

Todo 16 commit `7f768d1` stated `ready` on five Specs with no resolving verifier. `sdp view` now writes five `honesty/gaps` warnings. Exit stays 0 because warnings are not errors. The pin is the lag: empty stderr plus zero warnings.

Pooled Vitest excludes `test/cli.test.ts` (`vitest-test.mjs`), so the markdown-reifier fixture fix never exercised this dedicated pass. This is the first full `npm run check` to reach it after the promotions.

Todo 20 is not authorized to edit `test/` or `specs/` to retarget the pin.

Focused repro, same failure without the rest of the gate:

```sh
npx vitest run test/cli.test.ts --pool forks --maxWorkers 1 --no-isolate -t "views the self-hosting corpus from the default repository root"
```

Result: Test Files 1 failed; Tests 1 failed, 79 skipped. Assertion at `test/cli.test.ts:205` (`expect(capture.readStderr()).toBe("")`). The next assertion, stdout `validate: 0 errors · 0 warnings`, is the same stale pin and was not reached.

## Status surfaces (unchanged)

- `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` header remains `🔄 EXECUTING`
- `AGENTS.md` remains `plan 37 is EXECUTING`
- `plans/36-…-briefs.md` remains DRAFTED lineage, commissioned-plans line still says executing
- Todo 20 checkbox remains `[ ]`
- F5 remains `[ ]`

## Cleanup

No Plan 37 status edit. Generated trees are gitignored. No live `npm run check` / vitest process. Scratch capture `/tmp/plan37-todo20-check1.txt` removed after pasting the tail above. Allowed Todo-20 evidence and F1/F4/plan checkbox files remain staged. Unrelated ultrawork dirt left unstaged.

## Final close

HEAD at start of this close: `340a629`. Prior Plan-37 commits present: `340a629`, `808dbc6`, `b98ccc9`. `npm run check:temporal` exited 0. Nonignored untracked after staging Todo-20 evidence: none. Unrelated ultrawork note left unstaged.

### Pass 1 — `npm run check`

Exit **0**. Tests: 62 files passed; 838 passed, 1 skipped (839). Dedicated CLI pass: 1 file, 80 passed. Self-hosting gates `currentRecord.status` was `EXECUTING`. Preflight listed the staged Todo-20 evidence plus the unstaged ultrawork note; no generated or registrar drift.

### Pass 2 — `npm run check`

Exit **0**, run immediately after pass 1. Tests: 62 files passed; 838 passed, 1 skipped (839). Dedicated CLI pass: 1 file, 80 passed. Same gate legs, same warning subjects, same test counts. No nondeterminism versus pass 1.

### Pin tests (before status flip)

`npx vitest run test/check-self-hosting-gates.test.ts`: 1 file, 6 passed, exit 0. Discovery pin still names plan 37 as `37-adoption-tranches-drift-maturation-and-bundle-measurement.md`.

`node check-self-hosting-gates.mjs .`: exit 0.

### Status flip

- `plans/37-…md` header → `✅ EXECUTED` with close-summary paragraph
- `plans/36-…md` commissioned-plans line → Plan 37 `EXECUTED`, closed briefs I–K
- `AGENTS.md` → `plan 37 is EXECUTED`; `plan 36 is DRAFTED` lineage retained
- Todo 20 checkbox `[x]`; F5 remains `[ ]`
