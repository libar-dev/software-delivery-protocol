# PR 25 final F2 code-quality review

## Verdict

**APPROVE**

Reviewed detached head: `2ef4a7afd55a471a136ced9f0bbbdf65b60bda4c`.

No code, test, dependency, graph, plan, Boulder, ledger, publication, or generated artifact was changed. This review adds only this evidence record.

## Historical continuity

The final history preserves the failed approaches rather than rewriting them:

- `79d7529` rejected named type-only re-exports but missed `export type *` because checker resolution exposed the origin declaration.
- `e864410` walked stars from a checker-selected symbol and remained declaration-order dependent for conflicting runtime origins.
- `7f6151c` accumulated candidates but treated an active recursive visit as an empty acyclic result, allowing a cyclic partial success to enter the cache.
- Clean-base fix `cd7050b32ea518327adcb21a38f2eef318cb8183` was independently confirmed and integrated as `00c6354048c9ce3ea0473847c75e78bf2bf322be`. The four F2 paths at the integrated commit are byte-identical to `cd7050b`; both commits have parent `91992f11acc33867b857971f5e9a429a391926b4` and the same subject.

The retained failing-first evidence is 7 failed / 16 passed against the published helper. It covers named and star type-only exports, attempted value use through erased exports, two acyclic runtime origins, and both star-cycle declaration orders.

## Resolver and Oracle audit

The final implementation conforms to the final Oracle contract:

- `runtime-export-resolver.ts` owns only runtime export resolution. `structural-coverage.ts` separately owns callable certification and exact direct-call consumption.
- Resolution keys are `(SourceFile, exportName)`. Active keys return `cyclic: true`; that active-path result is not cached as an acyclic empty result. Completed callers propagate the cycle bit, so candidate-relevant cycles fail closed.
- Candidate identity is the TypeScript `Symbol`, not a name or graph node. Diamonds to one origin deduplicate; distinct origins remain ambiguous and fail closed.
- `export type { ... }`, `export type *`, type-only import specifiers, and type-only import clauses contribute no runtime candidate.
- Explicit non-type declarations and named exports set precedence before star traversal. Unrelated ambiguous or cyclic stars therefore cannot defeat an explicit value export. A type-only named mention does not incorrectly suppress a valid value-star path.
- Missing/malformed `path#symbol`, unresolved modules, ambiguous origins, cycles, and non-callable values return `exported unit missing`.
- Consumption accepts only the exact checker-resolved local binding of a non-type named import when that identifier is the direct callee. An unused import, type-only import, another imported function's call, property access, or indirect use does not certify consumption.
- The audit reads the supplied TypeScript `Program`; it derives no graph edge, accepted-set membership, implementation fact, or product fact.

The six live coarse rows remain explicit Oracle data and all certify green in the self-hosting test. Their rostered unit, covering anchor, component, and source-level call rationale remain inspectable rather than inferred from the graph.

## Recipe and structural review

Recipes 1, 11, and 18 use null-prototype family maps. The real `runSdpCli` tests exercise all four lawful `Object.prototype` collisions (`constructor`, `toString`, `valueOf`, `hasOwnProperty`) as own keys, so the original prototype-bearing-map crash is closed without narrowing lawful IDs.

Recipe 19 computes outgoing and incoming `dependsOn` neighbors with explicit endpoint direction, deduplication, sorting, and stated-readiness lookup. Its characterization uses a live decision with one outgoing and two incoming dependencies, preventing an empty-set tautology or direction swap. Recipes 17-19 continue to compose the flat graph without adding reader verbs or inferred product facts.

Structural coverage remains test-only. The production dependency manifests are unchanged from `origin/main`, and no remediation dependency was introduced.

## Maintainability

Pure LOC measurements:

| File | Pure LOC | Assessment |
| --- | ---: | --- |
| `test/helpers/runtime-export-resolver.ts` | 159 | healthy; one responsibility |
| `test/helpers/structural-coverage.ts` | 99 | healthy; one responsibility |
| `test/structural-coverage.test.ts` | 222 | warning band; split before adding another substantial matrix |

The resolver extraction is justified: combining it with consumption auditing would exceed the 250-pure-LOC ceiling and merge two responsibilities. No reviewed function exceeds three parameters, no type suppression or untyped escape hatch was added, fixtures are uniquely namespaced and synchronously cleaned, and no sleep, polling, logger, or nondeterministic shared resource is present.

`test/recipes.test.ts` remains pre-existing oversized debt; this remediation did not enlarge its architectural scope beyond the focused recipe regressions. It is not a hidden F2 regression, but future recipe-test work should split it before expansion.

## Independent verification

The target worktree intentionally had no `node_modules`; direct probes stopped before execution (`vitest`/`tsc`/`eslint`/`prettier` unavailable). To preserve the read-only constraint, verification used disposable `git archive` sandboxes of exact tree `2ef4a7a`, linked to the already-installed final-integration dependency set. Sandboxes and temporary fixtures were removed after use. No target-worktree dependency or generated output was created.

Results:

- `npx vitest run test/structural-coverage.test.ts test/self-hosting-graph.test.ts`: 2 files, **50/50 passed**.
- `npx vitest run test/recipes.test.ts`: 1 file, **33/33 passed**.
- `npm run typecheck`, after sandbox-only build and self-hosting generation prerequisites: exit 0.
- `npm run lint`: exit 0.
- `npm run format:check`: exit 0, all files matched.
- Independent adversarial matrix: **6/6 passed**. It adds a three-node cycle checked from every entry, explicit type-only mention plus valid value star, explicit value precedence over ambiguous and cyclic stars, a type-imported local re-exported as an apparent value, exact-local direct-callee consumption, and a unique non-callable runtime value.
- `git diff --check origin/main...HEAD`: exit 0.

## Final raw gate receipt

Inspected, not rerun: `.omo/evidence/pr-25-review-remediation/full-gate-final.log`.

- SHA-256: `07f43f8d58d59eebc4d2d0048c9e872f80b900b5e2d99f77148b519dcfb00914`
- Size: 465 lines, 30,002 bytes
- Main suite: **874 passed / 1 skipped (875)**
- CLI suite: **80/80 passed**
- Final marker: `CHECK_EXIT:0`
- Final preflight: `clean`

The receipt contains the expected full command line followed by one heading for each of the thirteen stages; no stage or test summary is missing. Expected warnings are retained rather than suppressed.

## Final finding

No hidden regression, unsafe cache/order behavior, type-only leak, ambiguous-symbol acceptance, graph inference, dependency addition, or unresolved code-quality blocker was found. The conservative fail-closed resolver is independently supported by focused, self-hosting, recipe, type, lint/format, and additional adversarial evidence.
