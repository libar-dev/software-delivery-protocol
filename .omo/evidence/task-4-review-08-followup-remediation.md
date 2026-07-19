# Task 4: Happy-path cleanup and hard-link requirement

## RED

Command:

```sh
npx vitest run test/cli-import-review-08.test.ts
```

Result: exit 1. The three appended cases failed as intended:

- A temporary-path `rmSync` failure returned exit 1 instead of preserving the successful target.
- An injected `EXDEV` link failure reported only `cross-device link`, without the hard-link-support cause.
- `sdp --help` did not contain `hard link`.

## GREEN

Command:

```sh
npx vitest run test/cli-import-review-08.test.ts
```

Result: exit 0. All 19 tests passed. The new cases prove that a successful hard-link publication
survives temporary cleanup failure with a stale-artifact warning, `EXDEV` reports the hard-link
requirement and rolls back created artifacts, and import help documents the requirement.
