- tsup: prefer one ESM-only library build with named entries, `dts: true`, and a real `#!/usr/bin/env node` shebang in `src/cli.ts`; tsup docs say hashbang entries become executable.
- Vitest: package-name aliases belong at top-level `resolve.alias`, not under `test.alias`; `test.alias` is for mock/non-existent modules.
- typescript-eslint: current strict flat-config stack is `strictTypeChecked` + `stylisticTypeChecked` + `parserOptions.projectService: true`.
- package.json: use `type: "module"`, `exports` for the library entry, and `bin` for the CLI; keep `files: ["dist"]` so only build output ships.
- Typed linting with `projectService: true` needs the root TS config files (`tsup.config.ts`, `vitest.config.ts`) included in `tsconfig.json`, or ESLint will refuse to analyze them.
- Prettier `--check .` on this repo needs a `.prettierignore` for the docs/plans/notepad surface so bootstrap verification stays focused on the toolchain files.
- When tsup outputs both a source shebang and a banner shebang, the emitted CLI needs a tiny post-build normalization step to collapse it back to one executable hashbang.
- `tsconfig.examples.json` must explicitly reset `exclude` to `[]` after extending the root config, otherwise the inherited `examples` exclusion leaves the example project empty and TS18003 fires.
- A bootstrap Vitest file can meaningfully prove the package surface by checking both `import "@libar-dev/software-delivery-protocol"` and the package.json `bin`/`exports` shape.
- `npm test -- --run ids` needs a small wrapper script when the package script already bakes in `--run`; otherwise Vitest sees `--run` twice and exits early.
- Named export tests for the public barrel are easiest against `../src/index.js` before the package is built; the alias-only bootstrap test can stay a namespace import.
- The stable-ID parser should accept any lowercase namespace shape and defer broader namespace policy; helper functions (`specId`, `packId`, `implAnchorId`, `testAnchorId`) enforce their own prefixes.
- The optional `#<sub>` suffix is a single segment, not another dotted path; treating it like the main path would accept malformed IDs such as `spec:orders.create-order#valid.cart`.
- Canonical descriptor literals should stay separate from display labels: `SpecKind` is the authored value set, while labels live in a dedicated lookup so `Scenario`/`NFR` remain display language only.
- For optional section bags, `Record<string, unknown>` fits the open-ended payload while the exported container shape stays as an `interface`; that combination satisfies the lint rules without introducing index signatures.
- Bootstrap schema guards should import `../src/index.js` instead of the package name when they need new source exports; package-name imports can still resolve to stale dist declarations during `tsc --noEmit`.
- Readiness-floor coverage is easiest to keep stable when the floor data exposes clause IDs as inert metadata; tests can then assert the canonical rungs and Session 1 deferred graph-shaped `ready` clauses without coupling to validator logic that does not exist yet.
- The minimal `sdp` stub can stay fully import-free and deterministic: export a pure `runSdpCli(args)` helper, write directly to `process.stdout` / `process.stderr`, and gate auto-execution on the built `dist/cli/sdp.js` path so tests can import the module safely.

- Validator TDD stayed stable when readiness-floor enforcement flattened the local idea→scoped→defined clauses for a stated rung while skipping  and every  ready clause; that keeps Session 1 checks authored-layer only without duplicating graph validation.

- Validator TDD stayed stable when readiness-floor enforcement flattened the local idea-to-scoped-to-defined clauses for a stated rung while skipping the ready defined-floor placeholder and all Session 1 deferred ready clauses; that keeps the checks authored-layer only without duplicating graph validation.

- When the authored example must keep concept-aligned `*.spec.ts` filenames under `examples/`, Vitest needs an explicit `test.include` such as `test/**/*.test.ts`; otherwise it will collect authored spec files as empty test suites and fail with `No test suite found`.
- On current TypeScript, `tsconfig.examples.json` needs `compilerOptions.ignoreDeprecations: "6.0"` alongside its package-alias `paths` mapping, or `tsc --noEmit -p tsconfig.examples.json` fails on the deprecated `baseUrl` setting before the example code is even checked.
- TypeScript 5.9 rejects `ignoreDeprecations: "6.0"` in `tsconfig.examples.json` with TS5103, so the examples config should stay compatible with the actually installed compiler version instead of pinning a forward-looking deprecation override.
