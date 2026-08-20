# Todo 20 CLI pin fix evidence

- Changed only `test/cli.test.ts` in the commit.
- Pinned the five `honesty/gaps` warnings for:
  - `spec:carrier.markdown-authoring`
  - `spec:extraction.claim-taxonomy`
  - `spec:model.pack-aggregate`
  - `spec:model.relations`
  - `spec:model.spec-sections`
- Updated the summary pin to `validate: 0 errors · 5 warnings`.

## Verification

Focused repro:

```text
npx vitest run test/cli.test.ts --pool forks --maxWorkers 1 --no-isolate -t "views the self-hosting corpus from the default repository root"

Test Files  1 passed (1)
Tests  1 passed | 79 skipped (80)
```

Full CLI suite:

```text
npx vitest run test/cli.test.ts --pool forks --maxWorkers 1 --no-isolate

Test Files  1 passed (1)
Tests  80 passed (80)
```

The LSP diagnostics request could not connect to the workspace daemon. The expected TypeScript no-excuse checker was not present at `scripts/typescript/check-no-excuse-rules.ts`.
