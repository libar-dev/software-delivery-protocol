# Task 2 — carrier bounded-parity registrar adoption

## Outcome

**ADOPT** — `spec:carrier.markdown-parser.bounded-parity` now uses the generated registrar sibling `test/carrier.markdown-parser.bounded-parity.test.generated.ts`. The authored suite retains its `specTest` anchor and passes `createWorld`, `invoke`, `observe`, `expected`, and `assertions`; there are zero remaining `bindExample(` calls in `test/self-hosting-carrier.test.ts`.

The split TypeScript-vs-Markdown severity/spec-count Thens are different kinds from the finding-ID oracle and are expressed honestly in `assertions` using `paramsForStep`. No frozen adapter, helper, old registrar, or other suite was edited.

## Baseline / dirty-worktree receipt

Initial `git status --porcelain` before this lane's edit:

```text
 M .omo/boulder.json
?? .omo/drafts/plan-37-settling-arc.md
?? .omo/plans/plan-37-settling-arc.md
```

The worktree was therefore not clean at lane start. Other lanes subsequently added/modified their own plan and gate files. Those files were not touched by this lane.

## Implementation

The authored suite changed from the single `bindExample` call and per-step binding table to:

- `parityWorld(point)` materializing the probe from `Partial<MarkdownParserConditions>`;
- `invokeParity(world)` reifying both carriers once;
- `observeParity(world)` returning the shared finding-ID outcome;
- `expectedParity(point)` returning that outcome for complete points and `unspecified` for incomplete points;
- `assertParity(world)` checking the two split severity/spec-count Thens from generated-contract parameters;
- one `registerBoundedParity({...})` activation beside the retained `specTest` anchor.

The generated sibling was produced by the required build/generation path, not edited manually.

## Required serialized verification transcript

### 1. Focused Vitest (before generation)

Command:

```text
npx vitest run test/self-hosting-carrier.test.ts
```

Output:

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  17:54:26
   Duration 1.06s (transform 459ms, setup 0ms, import 879ms, tests 40ms, environment 0ms)
```

Exit: `0`.

### 2. Build

Command: `npm run build`

Output ended with:

```text
WARN "import.meta" is not available with the "cjs" output format and will be empty
CJS Build success
ESM Build success
DTS Build success
```

Exit: `0`. The warning is pre-existing build configuration output and did not fail the build.

### 3. Self-hosting generation

Command: `npm run generate:self-hosting`

Output (each projection pass reported the same graph):

```text
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote generated/graph.json
Wrote generated/contracts (102 modules)
validate: 0 errors · 0 warnings (conformance + honesty over the one graph)
Wrote generated/design-review (158 pages)
Wrote generated/census (1 pages)
Wrote generated/mermaid (158 pages)
Wrote generated/gherkin (157 pages)
```

Exit: `0`.

### 4. Force-add and tracked sibling receipt

Command:

```text
git add -f test/carrier.markdown-parser.bounded-parity.test.generated.ts
git ls-files test/carrier.markdown-parser.bounded-parity.test.generated.ts
```

Output:

```text
test/carrier.markdown-parser.bounded-parity.test.generated.ts
```

The sibling's worktree and index SHA-1 both equal:

```text
29b3c219627f2ce9a2131ba49342611badd0e081
```

### 5. Adopted byte gate

Command: `npm run check:self-hosting`

Output:

```text
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote generated/graph.json
Wrote generated/contracts (102 modules)
validate: 0 errors · 0 warnings (conformance + honesty over the one graph)
Wrote generated/design-review (158 pages)
Wrote generated/census (1 pages)
Wrote generated/mermaid (158 pages)
Wrote generated/gherkin (157 pages)
```

Exit: `0`.

### 6. Required preflight

Command: `npm run preflight`

Output:

```text
preflight: semantic diff summary
.omo/boulder.json
AGENTS.md
plans/36-adoption-tranches-maturation-and-bundle-evidence-briefs.md
test/carrier.markdown-parser.bounded-parity.test.generated.ts
test/check-self-hosting-gates.test.ts
test/self-hosting-carrier.test.ts
preflight: tracked/untracked status inspected
preflight: nonignored runtime garbage:
.omo/drafts/plan-37-settling-arc.md
.omo/evidence/plan-37-k-measurement/definition.md
.omo/plans/plan-37-settling-arc.md
plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md
```

Exit: `1`.

This is an environment/worktree interference, not registrar drift: concurrent lanes have nonignored plan/evidence files, and this lane did not touch, stage, remove, or hide them. The tamper probe below independently confirms that the adopted registrar drift alarm fires as required.

## QA scenarios

### Happy path

The focused Vitest run above passed with 3/3 tests. `npm run check:self-hosting` passed with exit `0` after the sibling was force-added. The required `npm run preflight` could not be green in this shared worktree because of the concurrent nonignored files listed above; it was rerun after byte restoration with the same sole failure class (nonignored runtime garbage) and no registrar drift.

### Failure: deliberate adopted-sibling byte tamper

Mutation:

```text
printf ' ' >> test/carrier.markdown-parser.bounded-parity.test.generated.ts
```

Command: `npm run preflight`

Relevant output:

```text
preflight: tracked adopted registrar drift:
test/carrier.markdown-parser.bounded-parity.test.generated.ts (worktree bytes differ)

preflight: nonignored runtime garbage:
.omo/drafts/plan-37-settling-arc.md
.omo/evidence/plan-37-k-measurement/definition.md
.omo/plans/plan-37-settling-arc.md
plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md

TAMPER_PREFLIGHT_EXIT=1
```

The probe exited nonzero and named `tracked adopted registrar drift`.

### Restoration by regeneration

Commands, in order:

```text
npm run generate:self-hosting
git add -f test/carrier.markdown-parser.bounded-parity.test.generated.ts
npm run preflight
```

Generation again reported `156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)` and exit `0`; the sibling was force-added again. The final preflight output contained only the concurrent nonignored runtime-garbage block and no registrar-drift block, so the tampered byte was restored canonically. Final worktree/index hashes matched at `29b3c219627f2ce9a2131ba49342611badd0e081`.

## Additional checks

```text
rg -n 'bindExample\\(' test/self-hosting-carrier.test.ts
# no matches

npx vitest run test/self-hosting-carrier.test.ts  # after formatting
# Test Files 1 passed (1); Tests 3 passed (3); exit 0

npx prettier --check test/self-hosting-carrier.test.ts
# passed after formatting

git diff --check -- test/self-hosting-carrier.test.ts
# clean

git diff --cached --check -- test/carrier.markdown-parser.bounded-parity.test.generated.ts
# clean
```

## Adversarial / N/A record

- `stale_state`: sibling was regenerated after tampering; worktree/index bytes were compared and match.
- `misleading_success_output`: real command exits are recorded: focused test `0`, build `0`, generation `0`, `check:self-hosting` `0`, normal preflight `1` due concurrent garbage, tampered preflight `1` with the required drift name.
- `malformed input`: N/A; this task has no malformed-input surface.
- `prompt injection`: N/A; no repository content attempted to redirect the task.
- `cancel/resume`: N/A; no interruption occurred.
- `dirty worktree`: applicable; baseline and final concurrent-file receipts are recorded above, and unrelated changes were preserved.
- `hung commands`: N/A; all commands completed within the bounded command timeout.
- `flaky tests`: N/A; focused runs were deterministic and passed in one run each.
- `repeated interruptions`: N/A; no interruptions occurred.

## Cleanup receipts

- The tampered sibling was restored by `npm run generate:self-hosting`, then `git add -f` was rerun.
- No commit or push was performed.
- No old tracked registrar, helper, frozen adapter, spec, oracle, or other suite file was touched.
- The evidence file itself is intentionally untracked `.omo` state required by the task; it is one reason a later preflight in this shared worktree will report nonignored runtime garbage.

**Ledger-worthy line:** `ADOPT — carrier.markdown-parser.bounded-parity — sibling test/carrier.markdown-parser.bounded-parity.test.generated.ts — focused + check:self-hosting green; preflight registrar check clean, whole-worktree preflight blocked only by concurrent nonignored plan/evidence files.`
