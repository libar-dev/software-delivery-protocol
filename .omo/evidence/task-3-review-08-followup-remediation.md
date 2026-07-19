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
