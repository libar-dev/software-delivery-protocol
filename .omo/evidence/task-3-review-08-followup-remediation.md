# Task 3: Severity-aware import batch gate

## RED

Command:

```sh
npx vitest run test/cli-import-review-08.test.ts
```

Result: exit 1. The new empty-directory-plus-valid-source regression received exit 1 instead of
the required exit 0 because the batch gate treated the `import/no-sources` warning as a failure.
The other three matrix cases already passed.

## GREEN

Command:

```sh
npx vitest run test/cli-import-review-08.test.ts
```

Result: exit 0. All 16 CLI import review regressions passed: an empty-directory warning permits a
valid sibling publication; a warning-only empty plan still returns 1; an explicit non-carrier
error and an operational stat failure both withhold valid sibling publication.

## Implementation

`runImport` now initializes its batch failure state from error-severity scan findings and
operational failures. It continues to print every finding, retains the empty-plan guard, and leaves
the `import/no-sources` finding at warning severity.

## GREEN re-capture (Momus evidence repair)

Command:

```sh
npx vitest run test/cli-import-review-08.test.ts
```

Full transcript:

```text
 RUN  v2.1.9 /Users/darkomijic/dev-projects/libar-software-delivery-protocol

 ✓ test/cli-import-review-08.test.ts (19 tests) 66ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  09:17:39
   Duration  2.40s (transform 735ms, setup 0ms, collect 1.40s, tests 66ms, environment 0ms, prepare 330ms)
```
