// One source of truth for the suites that import generated contracts.
//
// A bound suite couples two surfaces that never see each other: the test wrapper
// (`vitest-test.mjs`), which must refuse to run before the tree it imports exists, and the lint
// config (`eslint.config.js`), which must stay runnable in a clean room where that tree has not
// been generated yet. Naming the same files twice drifted once; both consumers now read this
// module, so a new bound suite enters the list here and both surfaces follow.
//
// One row per generated contract tree, listing every test file that imports from it. Rows stay
// per-tree so the recovery command a missing tree names is stated once, never repeated per suite.
//
// The exclusion rule: a suite that derives its graph in memory never belongs here — the corpus
// oracle (`test/self-hosting-graph.test.ts`) and the contracts self-check
// (`test/self-hosting-contracts.test.ts`) import no contract, so listing them would weaken lint
// and demand a generation neither needs.
//
// The tracked `test/*.test.generated.ts` registrars belong here too: each imports its contract
// module directly. So does `test/helpers/generated-contract.ts`, whose types come from the
// package's `runner` subpath — `dist/` output that, like the contracts, does not exist yet when
// lint runs in a clean room.

export const contractDependentSuites = [
  {
    contracts: "generated/contracts",
    generation: "npm run generate:self-hosting",
    testPaths: [
      "test/carrier.slot-notation.refused-guess.test.generated.ts",
      "test/carrier.slot-notation.typed-declaration.test.generated.ts",
      "test/helpers/generated-contract.ts",
      "test/model.anchors.lookalike-refusal.test.generated.ts",
      "test/model.anchors.physical-identity.test.generated.ts",
      "test/model.stable-ids.malformed-refusal.test.generated.ts",
      "test/model.stable-ids.namespaced-round-trip.test.generated.ts",
      "test/self-hosting-carrier.test.ts",
      "test/self-hosting-carrier-gherkin.test.ts",
      "test/self-hosting-consumers-oracle.test.ts",
      "test/self-hosting-consumers.oracle.ts",
      "test/self-hosting-consumers.test.ts",
      "test/self-hosting-duplicate-ids.test.ts",
      "test/self-hosting-extraction.test.ts",
      "test/self-hosting-model.test.ts",
      "test/self-hosting-projections.test.ts",
      "test/self-hosting-pack-markdown.test.ts",
      "test/self-hosting-sdp-import.test.ts",
      "test/self-hosting-validators-oracle.test.ts",
      "test/self-hosting-validators.oracle.ts",
      "test/self-hosting-validators.test.ts",
      "test/validation.duplicate-ids.dual-carrier.test.generated.ts",
      "test/validation.kind-evidence.constraints-alone.test.generated.ts",
      "test/validation.kind-evidence.empty-promoted-child.test.generated.ts",
      "test/validation.kind-evidence.untargeted-constraint.test.generated.ts",
    ],
  },
  {
    contracts: "examples/checkout-v1/generated/contracts",
    generation: "npm run generate:example",
    testPaths: ["examples/checkout-v1/test/orders/create-order.valid-cart.test.ts"],
  },
];

/** The repository-root tree — the one whose suites fall inside the typed-lint globs. */
export const rootContractDependentSuite = contractDependentSuites[0];
