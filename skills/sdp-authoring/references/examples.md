# Make an example executable

For an example's bound point, contracts and runner, in this order.

1. The parent carries the typed `gwt-vocabulary` example space, each example child one concrete
   `gwt` bound point (`spec:decisions.point-per-example`).
2. A step key goes on the vocabulary step, `Given [#cartSize] a cart with {items:number} items`;
   the child's step inherits it, and a key on the child alone withholds its contract. A new key
   changes the contract key: update hand-written handlers and a Then step's oracle outcome `kind`
   (`spec:carrier.step-keys#rule.contractKey`).
3. Write the suite first, with a top-level `specTest` anchor whose `verifies` names the example;
   the build emits the registrar beside it, and none without it.
4. `sdp build` writes the contracts and one `<spec-id-path>.test.generated.ts` registrar per
   bindable example and reports contract refusals; it removes the page roots, which
   `sdp generate` republishes.
5. A top-level `specOracle` anchor `models` the parent; type the oracle against the generated
   space contract, `unspecified` included (`spec:validation.oracle-target-eligibility`).
6. Import the registrar and activate it once with `createWorld`, `invoke`, `observe`, `expected`
   and optional `assertions` (`spec:extraction.runnable-modules`); `bindExample` from `./vitest`
   is the adapter beneath it.
7. Commit a registrar once tracked code imports it (`spec:decisions.adopted-registrars-committed`).
8. Before a person states `ready`, mutate one expected result, see the point go red through the
   comparator, and restore it.
