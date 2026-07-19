# Task 1: Markdown Model-term own-property remediation

## RED

Command:

```sh
npx vitest run test/markdown-review-08.test.ts
```

Output:

```text
RUN  v2.1.9 /Users/darkomijic/dev-projects/libar-software-delivery-protocol

❯ test/markdown-review-08.test.ts (9 tests | 2 failed) 25ms
  × review-08 Markdown diagnostics > retains __proto__ as an authored Model term 3ms
    → expected Model terms to reify as an object
  × review-08 Markdown diagnostics > reports duplicate __proto__ Model terms 3ms
    → expected [] to deep equally contain ObjectContaining{…}

Failed Tests 2

FAIL  test/markdown-review-08.test.ts > review-08 Markdown diagnostics > retains __proto__ as an authored Model term
Error: expected Model terms to reify as an object

FAIL  test/markdown-review-08.test.ts > review-08 Markdown diagnostics > reports duplicate __proto__ Model terms
AssertionError: expected [] to deep equally contain ObjectContaining{…}

Test Files  1 failed (1)
     Tests  2 failed | 7 passed (9)
```

## GREEN

Command:

```sh
npx vitest run test/markdown-review-08.test.ts
```

Output:

```text
RUN  v2.1.9 /Users/darkomijic/dev-projects/libar-software-delivery-protocol

✓ test/markdown-review-08.test.ts (9 tests) 15ms

Test Files  1 passed (1)
     Tests  9 passed (9)
```

`setOwn` uses `Object.defineProperty` with enumerable, writable, and configurable own-property descriptors. The Model parser retains the existing `Object.hasOwn` duplicate check and uses this helper only to write authored term keys.
