
- `lsp_diagnostics` can lag behind file rewrites on `src/index.ts`/`test/ids.test.ts`, reporting stale pre-edit syntax until the workspace refreshes; CLI checks (`typecheck`, `test`, `lint`, `build`) were the reliable source of truth here.
