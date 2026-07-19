# Task 8 — R-6 TS carrier camel spelling parity

## RED

Command:

```sh
npx vitest run test/extract.test.ts
```

Before the reservation change, the new `hasVerifier: true` TS-carrier envelope regression failed:

```text
expected [ { data: { …(4) }, …(3) } ] to deeply equal []
```

The reifier emitted a spec for `spec:orders.reserved-camel-verifier` instead of rejecting it, proving that the camel spelling was not in the TS reservation set.

## GREEN

Command:

```sh
npx vitest run test/extract.test.ts test/extract-parity.test.ts
```

Result:

```text
Test Files  2 passed (2)
Tests  70 passed (70)
```

The regression now observes `extract/reserved-property` with error severity and an empty reified-spec collection, restoring the R-6 delivery-fact spelling parity.
