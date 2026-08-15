# Technical/pedantic verification — `feature/universal-spec`

Reviewed HEAD `002849f3f8dcac2346967207dc9200ce9071964a` against merge-base
`4ccc2e9b3845a288f5426e2d6dc52d05e2ea416b`.

## Verification ledger

| Claim | Command / evidence | Observed result | Verdict |
| --- | --- | --- | --- |
| Full green gate | `npm run check` | Exit 1 after 98.9s. Temporal, lint, format, build, self-hosting/example generation, and both typechecks passed. Vitest then ran 754 tests: 751 passed, 1 skipped, and 2 timed out at 5000ms (`test/design-review.test.ts:195`, `test/self-hosting-duplicate-ids.test.ts:193`). Later gate legs did not run. | **Does NOT reproduce** |
| Corpus extraction remains clean | Every census/Mermaid generation below invokes validation | `155 specs · 1 pack · 143 anchors → 299 nodes · 565 edges`; 0 errors / 0 warnings on every run. | Reproduces |
| Census is byte-deterministic | Two `npm run --silent sdp -- census . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`, snapshot to `/tmp/sdp-review/census-first`, then `diff -ru` | Both exits 0; diff exit 0. | Reproduces |
| Census `--check-clean` | Same command plus `--check-clean` | Exit 0; one page republished. | Reproduces |
| Mermaid is byte-deterministic | Two equivalent `sdp mermaid` runs, snapshot to `/tmp/sdp-review/mermaid-first`, then `diff -ru` | Both exits 0; 157 pages; diff exit 0. | Reproduces |
| Mermaid `--check-clean` | Same command plus `--check-clean` | Exit 0; 157 pages republished. | Reproduces |
| Structural `uses` behavior | `npx vitest run test/structural-anchors.test.ts --reporter=verbose` | 11/11 pass. Missing `uses` target produces referential-integrity error and excludes source anchor; self-use is refused; non-static `uses` excludes whole anchor; two-node cycle emits edges with no findings. | Reproduces |
| Task-8 mutation evidence is red/red/green | Read `.omo/evidence/arc-keystone-engines/task-8-mutation.log` | Spec `{total:100→101}`: exit 1, expected 101/actual 100. Oracle `+1`: exit 1, expected 100/actual 101. Restored: exit 0, 1/1 test passed. | Reproduces from recorded log |
| Valid-cart migration shape | Inspected `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts` | One `specTest(` at line 13; one `registerValidCart(` activation at line 58; no literal step-skeleton keys. | Reproduces |
| New focused suites | `npx vitest run test/census.test.ts test/mermaid-cli.test.ts test/mermaid-render.test.ts test/gherkin-view.test.ts test/structural-anchors.test.ts test/testing.test.ts test/codegen.test.ts --reporter=dot` | 7 files, 74/74 tests pass. | Reproduces |
| Census golden is fresh | `sdp census examples/checkout-v1`; `diff -ru test/fixtures/checkout-v1/expected-census examples/checkout-v1/generated/census` | Generation exit 0 (one expected verifier-linkage warning); diff exit 0. | Reproduces |
| Mermaid golden is fresh | `sdp mermaid examples/checkout-v1`; `diff -ru test/fixtures/checkout-v1/expected-mermaid examples/checkout-v1/generated/mermaid` | Generation exit 0 (same expected warning); diff exit 0. | Reproduces |
| Schema bump propagated | Read fresh root and checkout `generated/graph.json`; focused graph/package tests | Both graphs report `0.5.0`; `test/package-smoke.test.ts` and `test/graph-schema.test.ts` pass 2/2; `node check-prose-schema.mjs` passes. | Reproduces |
| Package/config/public exports | Package smoke plus inspection of `package.json`, `tsup.config.ts`, `vitest.config.ts`, `tsconfig.examples.json`, `src/index.ts` | `/testing` is exported and built; aliases/typecheck path are wired; census/Gherkin/Mermaid public projection exports are coherent. | Reproduces |
| Diff hygiene | `git diff --check 4ccc2e9...HEAD` | Exit 0. | Reproduces |
| Plan-31 durable record | Read `plans/31-*` | Status is `✅ EXECUTED`; A/B/C/D outcomes and E re-entry trigger are recorded. | Reproduces |

The prior F1/F3 evidence records a green full gate in isolated worktrees at earlier HEADs, but the
required fresh run at current HEAD did not reproduce it. Historical green is not substituted for
the current measurement.

## Findings register

### T1 — major — high confidence

**The required full green gate is not reliable at current HEAD: two extraction-heavy tests exceed
Vitest's default 5-second timeout under the normal pooled run.**

Evidence: fresh `npm run check` exited 1. `test/design-review.test.ts:195` timed out after 5000ms
(observed file time 6580ms), and `test/self-hosting-duplicate-ids.test.ts:193` timed out after
5000ms (observed file time 8805ms). Vitest reported 2 failed files, 751 passed tests, 1 skipped.
The same full gate is claimed complete at `.omo/evidence/arc-keystone-engines/F1-compliance.log:304-323`
and F3 lines 739-841, so the completed verifier claim is not reproducible on this checkout.

Suggested fix direction: give these intentionally whole-corpus tests explicit, justified timeouts
or reduce/reuse extraction work; then re-run the full gate repeatedly enough to establish it is not
load-sensitive.

### T2 — major — high confidence

**Generated runnable registrar siblings are not reconciled, so removing a verifier anchor leaves a
stale generated registrar after a successful build.**

Evidence: `/tmp/sdp-review/repro-stale.mjs` copied checkout-v1, built once, removed only the
`specTest` declaration, and built again. Observed:

```text
firstExit: 0
registrarAfterFirst: true
secondExit: 0
registrarAfterAnchorRemoval: true
```

The second build truthfully reported 4 anchors / 31 edges, yet the obsolete
`test/orders/orders.create-order.valid-cart.test.generated.ts` remained. Code writes current
registrars one-by-one at `src/cli/build-command.ts:207-211`; unlike `generated/contracts`, there is
no owned-root replacement or stale-file removal. This also weakens the CLI help's all-or-nothing
artifact claim (`src/cli/sdp.ts:39-41`).

Suggested fix direction: publish registrars through a manifest/owned generated root with atomic
reconciliation, or explicitly delete no-longer-owed sibling registrars before reporting success,
with rollback/error handling.

### T3 — major — high confidence

**The census's “dangling structural references” subsection cannot surface a real extracted dangling
`uses` reference, despite Todo 10 claiming that behavior.**

Evidence: `/tmp/sdp-review/repro-census-dangling.mjs` extracted a real anchor with
`uses: [api:fixture.missing]`. The extraction report contained the expected
`conformance/referential-integrity` error, but fail-closed extraction removed both source node and
edge. Rendering the resulting graph observed:

```text
graphHasSubject: false
graphHasDanglingEdge: false
structuralSectionSaysNoBindings: true
danglingSectionPresent: false
referentialFindingRendered: false
```

`src/projections/census.ts:225-235` first derives `structuralIds` only from retained structural
edges, then filters Reader findings against those IDs. The extraction finding is not in the graph
Reader at all. The test at `test/census.test.ts:277-314` avoids the real path by injecting both a
retained dangling edge and a hand-authored finding, a state the extractor deliberately cannot
produce (`src/extract/index.ts:133-171`).

Suggested fix direction: either pass the extraction/validation report into the projection's
documented input and classify structural findings directly, or revise the acceptance claim and
remove the unreachable subsection.

### T4 — minor — high confidence

**Runnable-comparator failures duplicate the step prefix.**

Evidence: task-8 mutation log lines 23-27 prints `at step: Then ...` twice. The comparator creates
an error already prefixed with `at step:` at `src/testing/index.ts:74-85`; the runner then
unconditionally prefixes the same step at `src/runner/index.ts:142-150`. The focused test regex at
`test/testing.test.ts:64-71` tolerates duplication and therefore does not catch it.

Suggested fix direction: let the runner own the single step prefix; comparator errors should carry
only assertion detail (and preserve the underlying assertion as cause where wrapping is needed).

### T5 — minor — medium-high confidence

**Incomplete points invoke the oracle before the promised refusal, allowing an oracle exception or
side effect to replace the deterministic incomplete-point diagnostic.**

Evidence: `src/testing/index.ts:37` calls `adapters.expected(point)` before checking missing required
conditions at lines 38-43. `test/testing.test.ts:82-101` uses a benign oracle and only proves the
eventual refusal, not that the oracle was withheld.

Suggested fix direction: compute/refuse missing conditions before calling `expected(point)`, and add
a spy/throwing-oracle assertion.

### T6 — minor — high confidence

**No permanent test proves the generated exhaustive mapped type actually reddens TypeScript when a
generated callback is missing or stale.**

Evidence: `test/codegen.test.ts:98-132` asserts emitted source substrings
(`satisfies StepBindings...`) but does not compile a mutated registrar. The only proof is transient
task evidence (`task8-handler-step-red.log` / `task8-handler-adapter-red.log`), while the plan makes
compile-time refusal part of the adopter contract.

Suggested fix direction: add a scratch compile test that removes/renames one generated skeleton
handler and asserts `tsc` fails naming that property, then restores and passes.

### T7 — minor — high confidence

**Mermaid bound tests cover first-over-limit but not the exact accepted boundaries.**

Evidence: `test/mermaid-render.test.ts:150-195` tests 65 nodes against limit 64 and 129 edges against
limit 128; the oversized Pack tests similarly exceed the node bound. No assertion pins exactly 64
nodes and exactly 128 edges as accepted. Production comparisons are `>` at
`src/projections/mermaid.ts:158-170`, which looks correct but is not regression-protected.

Suggested fix direction: add exact-limit acceptance cases for both node and edge bounds, alongside
the existing limit+1 refusal cases.

### T8 — minor — high confidence

**The direct runtime suite does not test the third comparator leg (observed outcome vs oracle), nor
that domain assertions are skipped after that failure.**

Evidence: `test/testing.test.ts` covers success, Spec-params/oracle mismatch, unmatched oracle kind,
and incomplete Conditions, but never makes `observe(world)` disagree with `expected(point)`.
Task-8's two required mutations prove the first comparison leg; they do not isolate the observed
comparison at `src/testing/index.ts:80-87`.

Suggested fix direction: add an observed/oracle mismatch test that pins the rendered message and
proves optional assertions were not called.

## Test-quality notes

Meaningful coverage is generally strong:

- Census pins runtime-derived zero rows, foreign values, stated/derived readiness separation,
  Reader-owned findings, deterministic SCC rendering, empty-section honesty, wholesale replacement,
  drift refusal, twin-render divergence, and failed-build invalidation.
- Mermaid pins permutation independence, hostile quotes/brackets/braces/parentheses/backticks/
  ampersands/angle brackets/backslashes/newlines/Unicode, the `"]-->` injection shape, dangling
  placeholders, duplicate identities, deterministic over-bound refusal, refusal locality, golden
  fidelity, and projection-root isolation.
- Structural tests exercise the real extractor (not only synthetic graph validation) for dangling,
  self, duplicate, empty, namespace-invalid, non-static, whole-anchor exclusion, and allowed cycles.
- Gherkin-view tests cover deterministic ordering, ruled lossy-kind commentary, hostile fence/
  DocString text, lawful generated suffixes, wholesale publication, drift, and failed extraction.

Precise gaps:

1. `test/census.test.ts:277-314` constructs an impossible retained-edge state and therefore misses
   T3's real extraction/report boundary.
2. Runnable-module tests miss observed-vs-oracle failure, assertion suppression, oracle-not-called
   on incomplete points, and single-prefix failure rendering (T4/T5/T8).
3. Exhaustiveness is string-inspected but not compile-probed in a permanent suite (T6).
4. Mermaid exact-limit acceptance is unpinned (T7).
5. No publication test removes an anchor and proves obsolete registrar cleanup (T2), nor injects a
   registrar write failure to verify the CLI's all-or-nothing claim.

## Overall technical verdict

**REQUEST CHANGES.** The projection bytes, schema bump, structural validators, mutation log, and
goldens reproduce. However, the mandatory current full gate is red, registrar generation leaves
stale artifacts after lawful model change, and one explicit census acceptance behavior is
unreachable through the real extraction boundary.
