// The authored descriptors of the `extraction` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const extractionSpecs = [
  {
    id: "spec:extraction.derive-graph",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/derive-graph.sdp.md",
    title: "Carrier reification derives the one graph",
    narrative:
      "The graph is the current projection of the repository at a commit. Git holds lifecycle history, so removed records disappear from the current graph and a current `supersedes` relation is the only forward pointer between records that still exist.",
    sections: {
      intent: { outcome: "Expose one carrier-neutral derivation seam." },
      behavior: {
        rules: [
          "Carrier reification feeds deriveGraph once; no consumer creates a second graph.",
          "The graph is flat arrays of typed nodes and edges; hierarchy and containment are expressed by edges rather than nested nodes.",
          "Declared relations resolve Primitive to Primitive, while `satisfies` and test `verifies` edges derive from anchors and run from their binding node to the direct Spec target.",
          "Delivery facts are computed node facts: a resolving `satisfies` edge contributes `implemented`, and an enabled direct verifier contributes `has-verifier` only to its target.",
          "Inferred structural edges are advisory inputs to impact analysis and never become authoritative graph truth.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.determinism",
    specKind: "constraint",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/determinism.sdp.md",
    title: "Committed source derives byte-identical output",
    narrative: null,
    sections: {
      intent: { outcome: "Make regeneration independent of location and prior generated state." },
      constraints: [
        {
          flavor: "quality",
          statement:
            "Two clean derivations of the same committed source produce byte-identical generated trees.",
          target: "sha256(tree@run1) == sha256(tree@run2)",
          measurableBy: "test/cli.test.ts clean-repo determinism",
        },
      ],
      behavior: {
        rules: [
          "Nodes sort by ID, edges sort by from, type, and to, and semantically compared output excludes wall-clock timestamps and run-specific hashes.",
          "`sdp build --check-clean` repeats extraction and contract generation independently, failing on any graph or generated-contract byte divergence.",
          "Static envelope fields fail extraction when they cannot be reified; optional TypeScript section detail may warn and drop, while Markdown documents refuse as a whole.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.excludes",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/excludes.sdp.md",
    title: "Extraction exclusions are strict consumer input",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep consumer-selected omissions precise without changing the extractor's canonical discovery rules.",
      },
      behavior: {
        rules: [
          "An exclusion is a unique, exact root-relative POSIX path prefix applied to both declared-carrier and anchor-candidate discovery surfaces.",
          "A prefix excludes itself and slash-delimited descendants only; it never excludes a merely similar sibling path.",
          "Empty, dot-relative, absolute, Windows-drive, backslash, trailing-slash, and parent-traversal paths are refused rather than normalized into a different meaning.",
          "The realizing entrypoints are `normalizeExcludes` and `discoverFiles` in `src/extract/discover.ts`.",
        ],
        exampleSpace: {
          given: [
            "the extraction root carries the tree {excludedTree:string} and the similar sibling {similarTree:string}",
            "the consumer supplies the exclusion {exclusion:string}",
          ],
          when: ["the root is discovered"],
          then: [
            'the discovery attempt {outcome:"completes"|"is refused"}',
            "the surviving spec carrier is {specCarrier:string} and the surviving anchor candidate is {anchorCandidate:string}",
            "the refusal states {diagnostic:string} and names the offending path",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.excludes.segment-boundary",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/excludes.segment-boundary.sdp.md",
    title: "A prefix excludes its own tree and leaves a similar sibling standing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the segment-boundary rule across both discovery surfaces.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the extraction root carries the tree {excludedTree: "foo"} and the similar sibling {similarTree: "foobar"}',
              'the consumer supplies the exclusion {exclusion: "foo"}',
            ],
            when: ["the root is discovered"],
            then: [
              'the discovery attempt {outcome: "completes"}',
              'the surviving spec carrier is {specCarrier: "foobar/included.sdp.ts"} and the surviving anchor candidate is {anchorCandidate: "foobar/helper.ts"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.excludes.refused-path",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/excludes.refused-path.sdp.md",
    title: "A Windows-drive absolute path is refused rather than normalized",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the refusal rule on an exclusion that cannot name a root-relative prefix.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the extraction root carries the tree {excludedTree: "foo"} and the similar sibling {similarTree: "foobar"}',
              'the consumer supplies the exclusion {exclusion: "C:/work/specs"}',
            ],
            when: ["the root is discovered"],
            then: [
              'the discovery attempt {outcome: "is refused"}',
              'the refusal states {diagnostic: "normalizeExcludes: invalid exclusion path"} and names the offending path',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.claim-taxonomy",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/extraction/claim-taxonomy.sdp.md",
    title: "Graph claims retain their epistemic source",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let every graph reader distinguish authored intent, human bindings, and machine-derived structure.",
      },
      model: {
        terms: {
          declared:
            "Human intent explicitly authored in a Spec or Pack; it is authoritative intent.",
          anchored:
            "A human binding from a code, test, or oracle location to one Spec ID; it is authoritative binding and carries no intent.",
          inferred:
            "Machine-derived structural information; it is advisory and never authoritative.",
          "claim inheritance":
            "An edge computed from an authored source retains that source's declared claim; derivation is a mechanism, not a fourth claim.",
          "delivery fact":
            "A realization signal computed from resolving edges, never an authored claim or edge.",
        },
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:extraction.regenerability",
    specKind: "rule",
    altitude: "feature",
    readiness: "defined",
    file: "specs/extraction/regenerability.sdp.md",
    title: "Generated artifacts are disposable projections",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep the repository canonical while allowing every graph and projection to be rebuilt safely.",
      },
      behavior: {
        rules: [
          "Generated artifacts are disposable: deleting them and rebuilding from the same committed repository produces the same bytes.",
          "Consumers read the graph or link to source locations recorded in it; they never re-parse source or keep a parallel model.",
          "The graph is a single JSON projection with in-memory query support; a graph database remains deferred until measured traversal pain establishes a real need.",
          "Measured evidence from the self-hosting corpus keeps full rebuilds comfortable below roughly 50 Specs.",
          "Measured evidence defers a graph database until the graph reaches roughly 10k+ nodes or traversal pain establishes a real need.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:extraction.schema-versioning",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/schema-versioning.sdp.md",
    title: "The graph declares its schema version",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let consumers identify the graph payload contract without premature migration machinery.",
      },
      behavior: {
        rules: [
          "Every graph declares its schemaVersion, and MVP consumers require that field to be present and readable.",
          "Envelope-stable, section-extensible growth is normally additive; SemVer negotiation and a migration command remain deferred until a consumer needs them.",
          "The declaring entrypoint is `schemaVersion` in `src/graph/schema.ts`, carried onto every derived payload by `deriveGraph`.",
        ],
        exampleSpace: {
          given: ["a graph derived from the authored spec {specId:string}"],
          when: ["the graph payload is serialized"],
          then: ["the payload declares the schema version {schemaVersion:string}"],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.schema-versioning.declared-version",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/schema-versioning.declared-version.sdp.md",
    title: "A derived payload carries a schema version its consumer can read",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the declared-version rule over a serialized graph payload.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a graph derived from the authored spec {specId: "spec:probe.schema-versioning"}',
            ],
            when: ["the graph payload is serialized"],
            then: ['the payload declares the schema version {schemaVersion: "0.5.0"}'],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.executable-contracts",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/executable-contracts.sdp.md",
    title: "The build derives executable contracts from graph examples",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give bound tests typed step and example-space contracts without reading authored Specs directly.",
      },
      behavior: {
        rules: [
          "`generateContracts` derives per-example step contracts and per-parent space contracts solely from the extracted graph.",
          "A generated contract is disposable, keyed by Spec ID, and becomes unavailable when its authored example cannot bind honestly to its shared vocabulary.",
          "The concreteness law is a refusal, never a guess — an example carrying an unbound slot in any used step of any entry is not the bindable form and receives no step contract, and a prose-only example receives none either.",
          "The concreteness law reads the example's own form alone, so it refuses whether or not a parent declares a shared vocabulary; vocabulary resolution is a separate, later gate whose withholding names its own finding.",
          "An example is one point, so the step contract and the bound point derive from the same first complete entry; a further structured entry is named rather than left silently inert.",
          "Degradation is loud and local — an undeclared slot, a value outside its declared type, and a conflicting re-binding each name the drift and drop exactly that one slot, so the emitted module still compiles.",
          "A vocabulary slot group that declares no usable type is named rather than dropped in silence, and no dimension enters the space for it.",
          "Two contract paths differing only by letter case cannot coexist on a case-insensitive filesystem, so the contracts tree is withheld whole and the finding names the colliding pair.",
          "Every generation finding is a warning that describes what did not emit; gating belongs to graph validation alone, so a withheld contract never fails the build by itself.",
          "The realizing entrypoint is `generateContracts` in `src/codegen/contracts.ts`.",
        ],
        exampleSpace: {
          given: [
            "a parent spec whose example space declares the slot {dimension:string}",
            "a parent spec that declares no shared vocabulary for the slot {dimension:string}",
            'a refining example {exampleId:string} whose used step {binding:"binds"|"leaves unbound"} that slot',
            "the example carries {entryCount:number} structured entries",
            "a case-twin example {twinId:string} whose contract path differs only by letter case",
          ],
          when: ["the contracts are generated from the derived graph"],
          then: [
            "the generated tree holds {fileCount:number} files",
            "the step contract for the example is emitted: {emitted:boolean}",
            "the findings name {findingId:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.executable-contracts.concreteness-refusal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/executable-contracts.concreteness-refusal.sdp.md",
    title: "An unbound slot in a used step earns no step contract",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the concreteness law alone, where no shared vocabulary can withhold the contract in its place.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a parent spec that declares no shared vocabulary for the slot {dimension: "n"}',
              'a refining example {exampleId: "spec:probe.create-order.unbound"} whose used step {binding: "leaves unbound"} that slot',
            ],
            when: ["the contracts are generated from the derived graph"],
            then: [
              "the generated tree holds {fileCount: 0} files",
              "the step contract for the example is emitted: {emitted: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.executable-contracts.multi-entry-example",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/executable-contracts.multi-entry-example.sdp.md",
    title: "A second structured entry is named, never left silently inert",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the one-point law where an example smuggles a second case into one document.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a parent spec whose example space declares the slot {dimension: "n"}',
              'a refining example {exampleId: "spec:probe.create-order.multi"} whose used step {binding: "binds"} that slot',
              "the example carries {entryCount: 2} structured entries",
            ],
            when: ["the contracts are generated from the derived graph"],
            then: [
              "the step contract for the example is emitted: {emitted: true}",
              'the findings name {findingId: "contracts/multi-entry-example"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.executable-contracts.case-colliding-path",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/executable-contracts.case-colliding-path.sdp.md",
    title: "A case-only path collision withholds the whole contracts tree",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the all-or-nothing rule where two examples claim one case-folded contract path.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a parent spec whose example space declares the slot {dimension: "n"}',
              'a refining example {exampleId: "spec:probe.create-order.same-case"} whose used step {binding: "binds"} that slot',
              'a case-twin example {twinId: "spec:probe.create-order.same-Case"} whose contract path differs only by letter case',
            ],
            when: ["the contracts are generated from the derived graph"],
            then: [
              "the generated tree holds {fileCount: 0} files",
              'the findings name {findingId: "contracts/case-colliding-path"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.runnable-modules",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/extraction/runnable-modules.sdp.md",
    title: "Derived runnable modules freeze the registrar interface",
    narrative: null,
    sections: {
      intent: {
        problem:
          "Bound example tests still carry mechanical registration, step-key mapping, parameter dispatch, and oracle↔Then re-encoding that the graph and generated contracts already know.",
        outcome:
          "Freeze the adopter-facing derived-runnable-module interface before any codegen change so authored tests shrink to irreducible semantics.",
        value:
          'A Spec plus a small authored semantics module become the honest form of "the spec is the test," without the engine loading or executing adopter code (O5 stayed refused).',
      },
      behavior: {
        rules: [
          "Registrar over self-running module — codegen emits a generated registrar whose call shape is frozen as register Example with the five adapters createWorld, invoke, observe, expected, and optional assertions (see example-space signature line for the exact type-parameter spelling the Markdown carrier cannot put in a list item). That registrar owns describe/it registration, step dispatch, the three-way comparator, and failure rendering. The authored `.test.ts` keeps the top-level `specTest` anchor and ONE activation call that passes the five adapters (`createWorld`, `invoke`, `observe`, `expected`, and optional `assertions`) beside the irreducible functions. IMPORT DIRECTION IS AUTHORED→GENERATED ONLY: the authored file imports the generated registrar and calls it with its semantics; the generated module NEVER imports authored code (no import cycle, and no export-identity problem — the graph stays binding-only per MD-7). Registration executes when the test runner's normal discovery loads the authored file; self-running generated modules are refused.",
          "Generated sibling path — for each bindable example, codegen emits exactly one generated registration module as a sibling `*.generated.ts` of the authored `.test.ts` (deterministic path keyed by Spec ID). Exactly one generated registration per example; a second registration path for the same example is refused.",
          'Shared testing runtime and export strategy — generated registrars import runtime helpers only from `@libar-dev/software-delivery-protocol/testing` (the shared registrar/comparator/failure-rendering runtime). Package export strategy freezes three adopter-facing subpaths plus the root: `.` (model/anchors/public types), `./runner` (framework-neutral plan/run core), `./vitest` (low-level `bindExample` adapter), and `./testing` (registrar runtime used by generated siblings). Authored and generated modules may import the root package for types only from the model surface; they must not reach into private `src/` paths. The actual supported Vitest peer range is the package\'s declared optional peer `vitest: ">=2"` (optional peerDependencyMeta), exercised in-repo against the current devDependency line `vitest@^4.1.10` — no tighter floor is frozen here than `>=2`.',
          "Step identity stays skeleton-text identity with deterministic fail-loudly semantics (wording edits redden types by design). Do NOT introduce generated ordinals or slugs; a wording-stable operation key is a model/carrier change and is out of this freeze.",
          "Handler resolution — the registrar's parameter object is an exhaustive mapped type over the contract's step skeletons for any residual per-step surface the freeze retains, and the five adapters themselves are required keys (`assertions` optional): a missing or stale authored callback is a `tsc` error naming the step or adapter. This is the strengthened handler-resolution check; codegen cannot statically see authored handlers, so no generation-time handler refusal is promised — the type system carries it. Existing generation-time refusals (unbindable example, incompatible vocabulary, colliding path) are reused unchanged.",
          "The three-way comparator is the exact generated algorithm: (1) call `expected(point)`; (2) find this example's Then contract step whose skeleton equals `expected.kind`; (3) compare that step's authored params with the oracle payload; (4) call authored `observe(world)` for the actual Outcome; (5) compare observed vs oracle outcomes; (6) run remaining authored domain assertions separately. Actual===oracle alone is FORBIDDEN — a Spec `{total}` mutation must redden. Oracle input typing is compatible with Partial Conditions space points (exact `Partial` of `Conditions` spelling in the example-space signature line) — never cast Partial to Conditions; refuse oracle comparison for incomplete points.",
          "Equality semantics — oracle payload vs Spec Then params and observed vs oracle Outcomes compare by deep structural equality on the authored shape. Failures emit readable missing/extra/changed diagnostics naming the path and the expected vs actual values; they never collapse to a bare boolean. Verbatim Then expectations stay the Spec's authored Then params and skeleton text — the comparator quotes them, it does not rephrase them. The freeze names this law as verbatim `Then` expectations.",
          "Failure rendering reuses the contract's matching Then step plus the existing `renderContractStep` path. When the oracle selected no authored Then, emit a scenario-level diagnostic quoting Spec ID, oracle kind, and available Then skeletons; preserve the original assertion as `cause`.",
          "Non-empty `verifies` — the authored top-level `specTest` must carry a non-empty `verifies` target (the example Spec ID). The anchor remains the sole `has-verifier` source; generated execution confers no delivery fact and says nothing about pass state (claim taxonomy unchanged; MD-7).",
          "Additive assertions — optional `assertions` may add domain checks the Outcome union cannot express; they never replace steps (3) or (5) of the three-way comparator and never silence a Spec-param or oracle mismatch.",
          "Case mapping and outlines — outline rows map one deterministic case per row in carrier order when a multi-row table sugar expands statically into sibling examples (point-per-example). Scenario Outlines and inline Examples tables stay refused as executable carrier constructs inside a single example; one example remains one point and earns exactly one generated registration.",
          "Explicit refusals — env/global/module side channels are refused (no ambient `process.env` contract, no mutable global registry, no module-level singleton world shared across examples). Self-running generated modules are refused (generated siblings export the registrar only; they do not self-register on import). Silently deriving domain observation is refused. O5 engine-side execution of adopter code is refused. Growing into harness projection (O4) is out of this freeze. Scenario Outlines stay refused. Claim taxonomy, the anchor layer, and ordinal/slug step identity stay untouched.",
        ],
        exampleSpace: {
          given: [
            "a bindable example {exampleId:string} with a generated sibling registrar module",
            "the authored test keeps top-level specTest with non-empty verifies and passes the five adapters",
            "the frozen registrar signature is register<Example>({ createWorld, invoke, observe, expected, assertions? })",
            "oracle input typing is Partial<Conditions> and never casts Partial to Conditions",
          ],
          when: ["the test runner discovers the authored file and the registrar activates"],
          then: [
            "exactly one generated registration runs for the example",
            "the three-way comparator applies equality semantics with readable missing/extra/changed diagnostics",
            "a Spec Then param mutation reddens via verbatim `Then` expectations",
            "a missing adapter or stale skeleton-text identity fails as a tsc exhaustive mapped type error",
          ],
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:extraction.example-runner",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/example-runner.sdp.md",
    title: "A bound example runs its contract steps against a fresh world",
    narrative: null,
    sections: {
      intent: {
        problem:
          "A bound test must execute a Spec's own steps without the executing core learning any test framework.",
        outcome:
          "Run a generated contract's steps in authored order and make a red step name itself in the Spec's own words.",
        value:
          "A failing example reads as the Spec that failed rather than as an anonymous assertion.",
      },
      behavior: {
        rules: [
          "The core plans every contract step in authored order and runs it against the world the caller hands in; creating a fresh world per example is the adapter's lifecycle, never the core's.",
          "Duplicate step text within one example binds one handler, and every occurrence runs that one handler with its own authored params.",
          "A red step names itself before the assertion detail: the failure message leads with the step's natural reading — the Spec's own words with bound values inlined — and the original error is preserved, carried as `cause` when it cannot be re-messaged, and wrapped when the thrown value is not an error.",
          "A missing or stale step handler is a compile-time refusal rather than a silent skip: the bindings type covers every step and only the steps, so spec-side drift fails the typecheck instead of the run.",
          "The core contributes `unspecified`, the one outcome no Spec ever states, so an uncovered region of an example space has an honest answer rather than a manufactured one.",
          "The realizing entrypoints are `planExample` and `runExamplePlan` in `src/runner/index.ts`.",
        ],
        exampleSpace: {
          given: [
            "a contract whose given step repeats {occurrences:number} times before one when step and one then step",
            'the handler bound to the {failingPhase:"given"|"when"|"then"} step throws {thrown:string}',
          ],
          when: ["the bound plan runs against a fresh world"],
          then: [
            "the world records the handler trace {trace:string}",
            'the run {outcome:"completes"|"fails"}',
            "the failure names the step in the Spec's own words as {failureLabel:string}",
            "the failure preserves the original detail {detail:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.example-runner.step-order",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/example-runner.step-order.sdp.md",
    title: "A repeated step runs its one handler at each occurrence, in contract order",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the contract-order and one-handler-per-step laws over a repeating given step.",
      },
      behavior: {
        examples: [
          {
            given: [
              "a contract whose given step repeats {occurrences: 2} times before one when step and one then step",
            ],
            when: ["the bound plan runs against a fresh world"],
            then: [
              'the world records the handler trace {trace: "given 2 | given 2 | when | then"}',
              'the run {outcome: "completes"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.example-runner.red-step-naming",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/example-runner.red-step-naming.sdp.md",
    title: "A red step names itself before the assertion detail",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the failure law where a bound handler throws inside the when step.",
      },
      behavior: {
        examples: [
          {
            given: [
              "a contract whose given step repeats {occurrences: 2} times before one when step and one then step",
              'the handler bound to the {failingPhase: "when"} step throws {thrown: "boom"}',
            ],
            when: ["the bound plan runs against a fresh world"],
            then: [
              'the run {outcome: "fails"}',
              'the failure names the step in the Spec\'s own words as {failureLabel: "at step: When the cart is submitted"}',
              'the failure preserves the original detail {detail: "boom"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.build-pipeline",
    specKind: "workflow",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/build-pipeline.sdp.md",
    title: "The build pipeline has one ordered flow",
    narrative: null,
    sections: {
      intent: { outcome: "Turn authored carriers into validated derived artifacts." },
      behavior: {
        rules: ["Every command uses the same extracted graph and validation seam."],
        flows: [
          "Discover carriers.",
          "Reify carriers.",
          "Derive the graph.",
          "Validate the graph.",
          "Emit derived artifacts.",
        ],
        exampleSpace: {
          given: ["an extraction root containing the isolated spec {specId:string}"],
          when: ["one query invocation reads the reader, raw graph, and validation report"],
          then: [
            "the query exits {exitCode:number}",
            "both graph entrances return the spec {returnedSpecId:string}",
            "the validation report names the same subject {findingSubjectId:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.build-pipeline.same-invocation",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/build-pipeline.same-invocation.sdp.md",
    title: "One query invocation shares its extracted graph and validation result",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Prove the query body receives a reader, raw graph, and validation report produced from the same invocation's extracted graph.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root containing the isolated spec {specId: "spec:probe.same-invocation"}',
            ],
            when: ["one query invocation reads the reader, raw graph, and validation report"],
            then: [
              "the query exits {exitCode: 0}",
              'both graph entrances return the spec {returnedSpecId: "spec:probe.same-invocation"}',
              'the validation report names the same subject {findingSubjectId: "spec:probe.same-invocation"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
