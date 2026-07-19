# Task 2: Physical-identity import dedupe

## RED

Command:

```sh
npx vitest run test/cli-import-review-08.test.ts
```

Result: exit 1. The new hardlink and case-alias dry-run regressions each observed two planned
documents where one was required.

## GREEN

Command:

```sh
npx vitest run test/cli-import-review-08.test.ts
```

Result: exit 0. All 12 CLI import review regressions passed, including physical hardlink dedupe,
case-alias dry-run and publication dedupe, the existing symlink-alias regression, and distinct
physical sources planning independently.

## Implementation

`scanImportPaths` now stats each retained source before canonicalizing it. Nonzero inodes use a
`dev:<device>:ino:<inode>` identity key; zero inodes retain the canonical-path fallback. The map
stores the first canonical path and remains silent before emitting a code-unit-sorted source list.

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
