// The authored descriptors of the `extraction` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const extractionSpecs = [
  {
    id: "spec:extraction.derive-graph",
    specKind: "behavior",
    altitude: "epic",
    readiness: "ready",
    file: "specs/extraction/derive-graph.sdp.md",
    title: "Carrier reification derives the one graph",
    narrative:
      "The graph is the current projection of the repository at a commit. Git holds lifecycle history, so removed records disappear from the current graph. A current `supersedes` relation, from a decision to the one it replaces, is the only relation between a record and its predecessor, and it lasts only while both records exist.",
    sections: {
      intent: {
        outcome: "Expose one carrier-neutral derivation seam.",
      },
      behavior: {
        rules: [
          "Each extraction feeds reified carriers to `deriveGraph`; no consumer derives a graph of its own from source.",
          "The graph payload carries `schemaVersion`, flat arrays of typed nodes and edges, and the location table. Hierarchy and containment are edges, never nested nodes.",
          "Each derived node and edge uses the claim and endpoint row in Design. Kind restrictions on authored relations remain those of the relations Spec; binding eligibility remains that of the anchors and delivery-facts Specs.",
          "The edge list is closed at twelve types: the six declared relations `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`, and the six derived edges `belongsTo`, `satisfies`, `models`, `memberOf`, `uses`, and `references`.",
          "A `references` edge is anchored, runs from a CodeNode to the Spec its code answers to, and contributes no delivery fact.",
          "Delivery facts are computed node facts: a resolving `satisfies` edge contributes `implemented`, and an enabled direct verifier contributes `has-verifier` only to its target.",
          "Mechanical file-level imports carry `inferred` as external input apart from the curated graph. They remain advisory and derive no `uses`, `memberOf` or `satisfies` edge and no delivery fact in that graph.",
          "The key order of `design`, `ui`, and `model.terms` is the authored order and part of the graph contract.",
          "A Pack node carries its manifest's members in authored order, and the `belongsTo` edges that re-express them keep the global edge sort.",
        ],
      },
      design: {
        description:
          "One read model. Carrier reifiers translate each supported syntax into common reified input. Graph derivation joins that input with bindings and computes delivery facts before consumers read it. Adding a carrier changes the input boundary; validators and projections continue to consume the same graph. The shared delivery-fact policy belongs to the graph component so graph construction does not define a competing policy.",
        authoredEdges:
          "`refines`, `dependsOn`, `constrainedBy`, `decidedBy` and `supersedes` carry declared and run Primitive to Primitive.",
        verifiesEdge:
          "Declared `verifies` runs Primitive to Primitive; anchored `verifies` runs from a test Anchor to a Primitive. Enabled-verifier eligibility and conferral are owned by the delivery-facts Spec.",
        bindingEdges:
          "`satisfies` and `references` carry anchored and run CodeNode to Primitive; `models` carries anchored and runs from an oracle Anchor to a Primitive.",
        structureEdges:
          "`memberOf` and `uses` carry anchored and run CodeNode to CodeNode; structural endpoint restrictions are owned by the anchors Spec.",
        membershipEdge:
          "`belongsTo` carries declared and runs Primitive to Pack, derived from the manifest.",
        nodeClaims: "Primitive and Pack carry declared; Anchor and CodeNode carry anchored.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.delivery-facts",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/delivery-facts.sdp.md",
    title: "Resolving bindings confer direct delivery facts",
    narrative: null,
    sections: {
      design: {
        description:
          "Shared policy. Extraction, validation, and the reader use one graph-level delivery-fact computation and its eligibility predicates. The graph component owns the policy; callers own graph construction, diagnostics, and decoded views. Keeping that computation below its callers prevents each consumer from maintaining a separate interpretation of binding eligibility.",
      },
      intent: {
        outcome:
          "State the shared delivery-fact conferral law used by extraction, the delivery-facts honesty check and the reader's verifier eligibility checks.",
      },
      behavior: {
        rules: [
          "Delivery facts are derived from resolving graph edges and are never authored.",
          "`implemented` is conferred only by an anchored `satisfies` edge that resolves to the Spec — its source is a CodeNode present in the graph; a dangling or off-contract binding confers nothing.",
          "`has-verifier` is conferred by an anchored `verifies` edge that resolves to the Spec from a test anchor, an `Anchor` node in the `test:` namespace, present in the graph, or by a declared `verifies` edge from an enabled verifier that resolves to it.",
          "An enabled verifier is an example-kind Spec that declares `verifies` to a target and is itself backed by a resolving anchored `verifies` edge from a test anchor. A declared verifier without that binding confers nothing; binding says nothing about whether a run passed.",
          "Both facts are direct and per-target; neither propagates through `refines`.",
          "`observed` is never computed; it remains the aspirational liveness rung.",
          "An edge the claim-separation check would reject confers no fact, so any graph producer other than the extractor is fail-closed.",
          "Binding eligibility resolves ids through the same first node in node order as the graph index; the duplicate-ids check reports the ambiguity.",
          "The extractor, the delivery-facts honesty check, and the reader's enabled decode share the one conferral computation and its two eligibility predicates, so the three surfaces can never disagree.",
          "Facts are emitted in ladder order — `implemented`, then `has-verifier`.",
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
      intent: {
        outcome: "Make regeneration independent of location and prior generated state.",
      },
      constraints: [
        {
          flavor: "quality",
          statement:
            "Two clean derivations of the same committed source produce byte-identical generated trees.",
          target: "sha256(tree@run1) == sha256(tree@run2)",
          measurableBy: "test:protocol.extraction-determinism",
        },
      ],
      behavior: {
        rules: [
          "Nodes sort by id and edges by from, type and to. Generated graph and contract metadata contains no wall-clock timestamp or run-specific hash. Graph file locations are extraction-root-relative POSIX paths, never absolute paths; authored section text remains as authored.",
          "`sdp build --check-clean` repeats extraction and contract generation independently, failing on any graph or generated-contract byte divergence.",
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
          "Discovery reads Spec and Pack carriers by the suffixes `.sdp.md`, `.sdp.gherkin` and `.sdp.ts`. Other `.ts` and `.tsx` files are anchor candidates, except `.d.ts` files. Discovery never descends into `node_modules`, `dist`, `generated`, `coverage` or a dot-directory, and configured exclusions apply to both lists.",
          "An exclusion is an exact root-relative POSIX path prefix applied to Spec-carrier and anchor-candidate discovery; a repeated exclusion counts once.",
          "A prefix excludes itself and slash-delimited descendants only; it never excludes a merely similar sibling path.",
          "Empty, absolute, Windows-drive, backslash and trailing-slash paths, and paths with an empty, `.` or `..` segment, are refused rather than normalized into a different meaning.",
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
        ruleKeys: {
          canonicalDiscovery: "rules[0]",
          segmentBoundary: "rules[2]",
          refusedPaths: "rules[3]",
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
    readiness: "ready",
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
            "A human binding from a code, test, or oracle location to zero or more Spec IDs, or between code units for structure; it is authoritative binding and carries no intent.",
          inferred:
            "Machine-derived structural information; it is advisory and never authoritative.",
          "claim inheritance":
            "An edge computed from an authored source keeps that source's claim. `belongsTo` derives from a Pack manifest and carries declared; anchor-derived edges carry anchored. Derivation is a mechanism, not a fourth claim.",
          "delivery fact":
            "A realization signal computed from resolving edges, never an authored claim or edge.",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.regenerability",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
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
          "The graph is one JSON document queried in memory.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
          "Every derived graph carries `schemaVersion`, which identifies its payload contract for consumers.",
          "Additive payload fields, including optional fields, increment the schema minor version; incompatible shape or meaning changes increment the major version, while patch changes preserve the payload contract.",
        ],
        exampleSpace: {
          given: ["a graph derived from the authored spec {specId:string}"],
          when: ["the graph payload is serialized"],
          then: ["the payload declares the schema version {schemaVersion:string}"],
        },
        ruleKeys: {
          declaredVersion: "rules[0]",
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
      behavior: {
        examples: [
          {
            given: [
              'a graph derived from the authored spec {specId: "spec:probe.schema-versioning"}',
            ],
            when: ["the graph payload is serialized"],
            then: ['the payload declares the schema version {schemaVersion: "0.12.0"}'],
          },
        ],
      },
      intent: {
        outcome: "Execute the declared-version rule over a serialized graph payload.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.executable-examples",
    specKind: "behavior",
    altitude: "epic",
    readiness: "ready",
    file: "specs/extraction/executable-examples.sdp.md",
    title: "Bound examples execute their authored steps",
    narrative:
      "The capability connects authored intent to an example's execution. Contract generation and the runner own narrower parts of that outcome; neither alone owns it. A change to the authored example must reach its test through the generated contract.",
    sections: {
      intent: {
        actor: "An author binding an example to a test of the intended behavior.",
        problem:
          "A separately handwritten test can drift from the Spec's own steps and expected outcome.",
        outcome:
          "Run an example against its authored intent through graph-derived contracts and report failures in the words of its steps.",
      },
      behavior: {
        rules: [
          "Execution reads the steps and bound values from contracts derived from the graph; it adds no second authored description of the example.",
          "A bound test supplies the world and step handlers, and the runner executes the contract's steps in authored order. Contract generation and execution keep their separate responsibilities.",
          "A failing step names the authored intent it exercised. An unspecified expected outcome remains explicit and cannot become a passing comparison by assumption.",
          "A verifier binding says the example has a verifier. Execution results stay outside the graph and confer no readiness or delivery fact on this epic.",
        ],
        ruleKeys: {
          authoredSteps: "rules[0]",
          binding: "rules[1]",
          failure: "rules[2]",
          facts: "rules[3]",
        },
      },
      verification: {
        mode: "reviewed",
        criteria: [
          "Trace a bound example from its graph steps through generated contracts to runner dispatch, then change an expected outcome and check that its test fails in the example's words.",
          "Read the epic's own binding facts separately from the bindings on its contract-generation and runner descendants.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:extraction.executable-contracts",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/executable-contracts.sdp.md",
    title: "The build derives step and space contracts from graph examples",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give bound tests typed step contracts and space contracts without reading authored Specs directly.",
      },
      behavior: {
        rules: [
          "`generateContracts` derives per-example step contracts and per-parent space contracts solely from the extracted graph.",
          "A generated contract is disposable, keyed by Spec ID, and withheld when its example is not in the bindable form or its steps do not resolve against the shared vocabulary.",
          "The concreteness law is a refusal, never a guess — an example carrying an unbound slot in any used step of any entry is not the bindable form and receives no step contract, and a prose-only example receives none either.",
          "Concreteness reads the example's own form, whether or not a parent declares shared vocabulary. Vocabulary resolution is a separate later check; incompatible resolution withholds the step contract with `contracts/unmatched-vocabulary-step`.",
          "An example is one point, so the step contract and bound point derive from the same first complete structured Given/When/Then entry. A further entry, which the TypeScript carrier can carry, is named `contracts/multi-entry-example` rather than left silently inert.",
          "Each step of a step contract carries its contract key beside its skeleton: its step key, from its own marker or from the vocabulary step it resolves to, under `spec:carrier.step-keys`, and its skeleton when it has none. The `Step` union and the `StepParams` properties are the contract keys in first-occurrence order, and the runner dispatches each step to the handler bound under its contract key.",
          "Degradation is loud and local: an undeclared slot or a value outside its declared type is named and left out of the bound point; an off-type value stays in the step contract, widened to its scalar kind, so the emitted module still compiles; and a conflicting re-binding is named and its first value wins, in the bound point for a slot bound twice and in the step contract for a step that recurs with other values.",
          "A vocabulary slot group that declares no usable type is named rather than dropped in silence, and no dimension enters the space for it.",
          "Each Then step of the parent's example space is one variant of the space contract's Outcome union, whose `kind` is that step's contract key, its step key or else its skeleton text; the build derives no slug or ordinal, and the runner core adds `unspecified`.",
          "A contract never holds two steps under one contract key. An example marker that disagrees with the key of its vocabulary step withholds the example's step contract with `contracts/conflicting-step-key`. A step or space contract whose steps would share a contract key, two skeletons under one key or a key equal to another step's skeleton, is withheld with `contracts/duplicate-step-key`, naming the key and both skeletons; a withheld space contract withholds every registrar of its children.",
          "Two contract paths differing only by letter case cannot coexist on a case-insensitive filesystem, so the contracts tree is withheld whole and the finding names the colliding pair.",
          "Every generation finding is a warning that describes what did not emit; gating belongs to graph validation alone, so a withheld contract never fails the build by itself.",
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
        ruleKeys: {
          concreteness: "rules[2]",
          onePoint: "rules[4]",
          contractKeys: "rules[5]",
          outcomeIdentity: "rules[8]",
          keyConflicts: "rules[9]",
          caseCollision: "rules[10]",
        },
      },
      design: {
        findingIds:
          "`contracts/undeclared-slot` · `contracts/off-dimension-value` · `contracts/conflicting-binding` · `contracts/conflicting-dimension` · `contracts/untyped-vocabulary-slot` · `contracts/multi-entry-example` · `contracts/unmatched-vocabulary-step` · `contracts/case-colliding-path` · `contracts/multiple-registrar-paths` · `contracts/conflicting-step-key` · `contracts/duplicate-step-key`, each at warning severity.",
        duplicateStepKey:
          '`contracts/duplicate-step-key` is a warning on the parent at `behavior.exampleSpace` for a space collision, or on the example at `behavior.examples` for a step-contract collision. Its message is `contract key "<key>" names both "<first skeleton>" and "<second skeleton>"; <space|step> contract withheld`, with the skeletons in first-occurrence order.',
        contractStep:
          "`export interface ContractStep<K extends string, P extends ParamShape> { readonly kind: StepKind; readonly key: K; readonly text: string; readonly params: P; }` is the step shape the runner exports, where `key` is the contract key and `text` the skeleton the natural reading renders.",
        stepContractModule:
          '`export type Step = "<contract key>" | …;` is the union of the example\'s contract keys in first-occurrence order, `StepParams` maps each contract key to its parameters, and `export const <camel>Contract: ExampleContract<Step, StepParams>` lists every step as `{ kind, key, text, params }` in authored order.',
        outcomeVariant:
          '`{ readonly kind: "<contract key>"; readonly <slot>: <type>; … }` is the Outcome variant of one Then step of the example space, one per Then step, beside `UnspecifiedOutcome`.',
        planDispatch:
          "the runner's `planExample` runs each step through `bindings[step.key]`, carries `key` on each planned step beside `text` and `label`, and renders the label from `text` and `params`, so a red keyed step still names itself in the Spec's own words.",
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
    readiness: "ready",
    file: "specs/extraction/runnable-modules.sdp.md",
    title: "Derived runnable modules freeze the registrar interface",
    narrative: null,
    sections: {
      intent: {
        problem:
          "A bound example test would otherwise repeat registration, step dispatch and oracle comparison that the graph and contracts already determine.",
        outcome:
          "Give each bindable example a generated registrar, so its authored test keeps semantics derivation cannot supply.",
        value:
          "A Spec and a small authored semantics module express the test while the engine neither loads nor executes adopter code.",
      },
      behavior: {
        rules: [
          "Code generation emits a registrar called with `createWorld`, `invoke`, `observe`, `expected` and optional `assertions`. It owns describe/it registration, step dispatch, the three-way comparator and failure rendering. The authored test keeps its top-level `specTest` anchor and one activation call beside its semantics. The authored file imports the generated registrar; the generated module imports no authored code. Normal runner discovery loads the authored file and activates registration. Generated modules never self-register; the graph records binding, never liveness.",
          "Generated sibling path — for each bindable example, codegen emits exactly one generated registration module as a sibling `*.generated.ts` of the authored `.test.ts` (deterministic filename keyed by Spec ID, not by the authored suite filename). One authored suite may verify many examples without their registrar map keys or output paths colliding. Exactly one generated registration per example; a second registration path for the same example is refused. Generated siblings are disposable build output: an adopted registrar is committed because authored code imports it, while unadopted registrars remain ignored, regenerable output and confer no migration claim.",
          "`generated/registrars.json` is a versioned, sorted manifest of every extraction-root-relative registrar sibling owed by the build. Publication reconciles the manifest and removes siblings no longer owed under the build-pipeline law. `--check-clean` compares the manifest and every sibling byte with fresh generation. Preflight independently compares every tracked adopted registrar in the worktree and Git index with regenerated bytes.",
          "Registration-path loudness — multiple anchors in one authored suite still locate one registrar sibling; when one example resolves to more than one distinct authored suite path, generation emits a named finding and withholds that registrar rather than selecting a path silently.",
          "Generated registrars import shared runtime helpers from `@libar-dev/software-delivery-protocol/testing` and types through public package subpaths. Public exports are the root for model, anchors and public types, `./anchors` for zero-dependency anchor builders, `./runner` for the framework-neutral plan/run core, `./vitest` for `bindExample`, and `./testing` for the registrar runtime. Authored suites may import anchor builders through the root or `./anchors`. Authored and generated modules never import private `src` paths. The supported optional Vitest peer range is `>=2`, as declared by the package.",
          "Step identity is the step's contract key: its step key under `spec:carrier.step-keys`, or its skeleton text when it has none, and generation introduces no ordinal or slug identity. A directly authored `bindExample` handler map fails the typecheck when one of its keys goes stale. An adopted registrar holds no authored per-step handler: a stale committed registrar fails the regeneration preflight, and its internal handlers change with the contract when it is regenerated. The contract key of a Then step of the example space also names an Outcome `kind`, so changing it fails the typecheck of an authored oracle that names the old kind.",
          "Handler resolution — the generated registrar's internal dispatch object is an exhaustive mapped type over the contract's step keys: removing or staling one of those generated callbacks is a `tsc` error naming that step. The adopted authored surface retains no per-step callbacks (and therefore no step keys); its five adapters are required keys (`assertions` optional), so a missing or stale authored callback is a `tsc` error naming that adapter. These are the two exhaustive mapped-type checks; demanding an authored error name a step while simultaneously retaining no authored per-step surface is refused as contradictory. Codegen cannot statically see authored handlers, so no generation-time handler refusal is promised — the type system carries it. Existing generation-time refusals (unbindable example, incompatible vocabulary, colliding path) are reused unchanged.",
          "Scenario-level invocation — the five-adapter interface carries one product `invoke` per example, so the first `When` occurrence invokes it and later `When` occurrences in the same lawful scenario do not repeat side effects.",
          "At the first Then, the comparator refuses an incomplete point before calling the oracle and otherwise evaluates and caches `expected(point)`. It finds the authored Then whose contract key equals `expected.kind`, compares that step's authored parameters with the oracle payload, reads `observe(world)`, compares observed and oracle outcomes, and runs additional assertions separately. Actual-equals-oracle alone is insufficient: a Spec parameter mutation must fail. The oracle accepts `Partial<Conditions>`; the registrar never casts a partial point to Conditions.",
          "Oracle payload versus Spec Then parameters and observed versus oracle outcomes use deep structural equality on the authored shape. Diagnostics name missing, extra or changed values by path and show expected and actual values. The comparator quotes authored Then parameters and skeleton text without rephrasing them.",
          "Failure rendering reuses the contract's matching Then step plus the existing `renderContractStep` path. When the oracle selected no authored Then, emit a scenario-level diagnostic quoting Spec ID, oracle kind, and the contract keys of the available Then steps; preserve the original assertion as `cause`.",
          "Bound unspecified outcome — `unspecified` names a coverage gap in the example space, but a bound executable example selecting it reddens because no authored Then may silently witness that gap.",
          "The authored top-level `specTest` carries a non-empty `verifies` target naming the example. It remains the source of `has-verifier`; generated execution confers no delivery fact and records no pass state.",
          "Additive assertions — optional `assertions` may add domain checks the Outcome union cannot express; they never replace steps (3) or (5) of the three-way comparator and never silence a Spec-param or oracle mismatch.",
          "Case mapping and outlines — outline rows map one deterministic case per row in carrier order when a multi-row table sugar expands statically into sibling examples (point-per-example). Scenario Outlines and inline Examples tables stay refused as executable carrier constructs inside a single example; one example remains one point and earns exactly one generated registration.",
          "Registrars use no environment, global or module side channel, mutable global registry or singleton world shared across examples. Generated siblings export the registrar and never self-register. Generation derives no domain observation; the engine never loads or executes adopter code. Registrars do not become generated test harnesses. Scenario Outlines stay refused. The interface changes neither the claim taxonomy, anchor bindings nor the contract-key identity of steps.",
        ],
      },
      design: {
        registrar:
          "`export declare function registerExample<World>(adapters: RunnableExampleAdapters<World, Conditions, Outcome>): void;` is the signature template; substitute the generated function name and the parent's generated Conditions and Outcome names.",
        registrarName:
          "Prefix `register` to the example's final dot-delimited id segment in PascalCase after removing the first occurrence of the parent's final segment in PascalCase; if removal leaves an empty name, use the example's PascalCase segment. PascalCase splits that segment at non-alphanumeric characters, capitalizes each part, and prefixes `X` when the result starts with a digit.",
        adapters:
          "`interface RunnableExampleAdapters<W, C, O extends { readonly kind: string }> { readonly createWorld: (point: Partial<C>) => W; readonly invoke: (world: W, point: Partial<C>) => void | Promise<void>; readonly observe: (world: W) => O; readonly expected: (point: Partial<C>) => O; readonly assertions?: (world: W, observed: O) => void | Promise<void>; }`",
        registrarPath:
          "The authored suite directory plus the example id without the `spec:` prefix and the suffix `.test.generated.ts`, retaining the id's dots.",
        registrarManifest:
          "`generated/registrars.json` carries the versioned, sorted extraction-root-relative registrar paths owed by the build.",
        thenBinding:
          '`compareContractOutcome(execution, { kind: "then", key, text, params })` is the generated binding of a Then step; it compares only the step whose `key` equals the oracle\'s `kind`.',
        noMatchingThen:
          '`scenario <spec>: oracle selected "<kind>"; available Then steps: "<key>", …` is the diagnostic when no authored Then matches, listing each Then step\'s contract key in contract order, with the original assertion as `cause`.',
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
      design: {
        description:
          "Ports and adapters. The runner accepts a generated contract, step handlers, and a caller-owned world. The Vitest adapter registers tests and creates each world before calling the runner. Framework dependencies point from the adapter toward the runner; the runner remains usable without a test framework. Step ordering and failure labels belong to the core, while test registration and world lifecycle belong to the adapter.",
        failureMessage:
          '`"at step: " + naturalReading + "\\n" + originalMessage` is the message expression; naturalReading is the rendered contract step and originalMessage is the original error message or the string form of a non-Error throw.',
      },
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
          "Once the Vitest adapter creates a world, it awaits the optional `after` hook whether the steps pass or fail. A step failure stays the test's failure and an error from `after` is then discarded; when the steps pass, an error from `after` fails the test. A world factory that throws creates no world, so `after` does not run.",
          "Duplicate step text within one example binds one handler, and every occurrence runs it; an occurrence that binds a slot to a different value is a conflicting re-binding, named at generation, and every occurrence runs with the first binding, because an example is one point.",
          "A red step names itself before the assertion detail: the failure message leads with the step's natural reading — the Spec's own words with bound values inlined — and the original error is preserved, carried as `cause` when it cannot be re-messaged, and wrapped when the thrown value is not an error.",
          "A missing or stale step handler is a compile-time refusal rather than a silent skip: the bindings type covers every step and only the steps, so spec-side drift fails the typecheck instead of the run.",
          "The core contributes `unspecified`, the one outcome no Spec ever states, so an uncovered region of an example space has an honest answer rather than a manufactured one.",
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
        ruleKeys: {
          contractOrder: "rules[0]",
          worldCleanup: "rules[1]",
          oneHandlerPerStep: "rules[2]",
          redStepNamesItself: "rules[3]",
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
      intent: {
        outcome:
          "Turn authored carriers into one graph and the artifacts derived from it, with every command that checks reading that same graph.",
      },
      behavior: {
        rules: [
          "Every command that checks the graph checks the graph its own run derived, through the one validation seam; `sdp build` stops at extraction checks.",
          "`sdp build` publishes derived outputs only after extraction reports no error. A warning does not fail the build; a contract-generation warning may withhold the contract or registrar it names under the executable-contracts law.",
          "Before replacing current outputs, `sdp build` stages the graph, the owed contracts, the registrar manifest, each registrar sibling whose bytes differ from the file on disk, and the imports when `--imports` is supplied, in temporary locations; a sibling whose bytes are unchanged is left untouched, with no temporary write and no rename. It then publishes the staged set and removes registrar siblings no longer owed.",
          "On failure, `sdp build` removes its graph, contracts, manifest, temporary outputs and the confined registrar siblings known from the previous and new manifests. It removes imports only when that invocation requested them. A failed removal names the surviving path and says it must not be read as current; an untrusted registrar path is outside generated ownership.",
        ],
        flows: [
          "The build discovers carriers, reifies them, derives the graph, stops on any extraction error, and emits the graph, the executable contracts and the registrars without running the graph checks.",
          "Validation runs the build, then checks the graph that build derived and reports every finding, exiting nonzero on an error.",
          "Each projection verb runs validation, then renders its root from that same graph and publishes it whatever the findings, keeping validation's exit code.",
          "A query discovers, reifies and derives in process, stops on any extraction error, checks the graph, and hands the body the reader, the raw graph and the report from that one derivation, writing nothing.",
        ],
        exampleSpace: {
          given: ["an extraction root containing the isolated spec {specId:string}"],
          when: ["one query invocation reads the reader, raw graph, and validation report"],
          then: [
            "the query exits {exitCode:number}",
            "the reader and the raw graph both return the spec {returnedSpecId:string}",
            "the validation report names the same subject {findingSubjectId:string}",
          ],
        },
        ruleKeys: {
          oneSeam: "rules[0]",
          emitOnClean: "rules[1]",
          stagedPublication: "rules[2]",
          failedPublication: "rules[3]",
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
              'the reader and the raw graph both return the spec {returnedSpecId: "spec:probe.same-invocation"}',
              'the validation report names the same subject {findingSubjectId: "spec:probe.same-invocation"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.open-section-order",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/open-section-order.sdp.md",
    title: "Serialization preserves authored entry order",
    narrative:
      "Integer-like keys are refused rather than carried in an ordered list: JavaScript orders integer-like object keys before all others, so a plain object keeps authored order only when no key is integer-like.",
    sections: {
      intent: {
        problem: "Sorting entries by code unit loses the author's sequence and grouping.",
        outcome:
          "Carry the authored order of open-section entries and model terms through the serialized graph and the Design Review's key order.",
      },
      behavior: {
        rules: [
          "The entry order of `design`, `ui`, and `model` terms is authored content. Extraction keeps it, the serialized graph emits it, the Design Review's entry list follows it for open sections, and the Model table follows it for terms.",
          "Authored order is a function of the committed source, so two derivations of one commit stay byte-identical. What is given up is invariance under permutation: two carriers that author the same entries in different orders derive different graph bytes, and parity for these sections means the same entries in the same order.",
          "A key is integer-like when it matches `^(0|[1-9][0-9]*)$`; `design`, `ui` and `model.terms` refuse such keys in every carrier that carries those sections.",
          "The Markdown carrier refuses an integer-like Model term with the structure finding `model terms must not be integer-like` and drops the carrier. Its lower-camel Design and UI keys cannot be integer-like. Gherkin carries no open section.",
          'The TypeScript carrier reads identifier and string names as their text and numeric names as JavaScript\'s string form of the number, so `1e3` becomes `"1000"`, `0x10` becomes `"16"`, and `0.0000001` becomes `"1e-7"`.',
          'The TypeScript carrier refuses each integer-like property, method, getter or setter with one `extract/unrecognized-property` error regardless of value, with the message `property "<key>" is refused: integer-like keys are not accepted in design, ui, or model terms`. Only that member drops; the Spec and other keys remain.',
          "A non-integer numeric name such as `1.5` drops as a non-static name.",
          "With integer-like keys refused, a plain object keeps insertion order, so the representation stays an object and no field shape changes. Authored key order is part of the graph contract. The derived graph establishes it, so the reader, the serialized graph, and the Design Review agree. In `design` and `ui` the section's own `description`, its leading prose, comes first, then every other key in authored order. `model.terms` keeps pure authored order, and a term named `description` is an ordinary term, because the Model section's prose lives at `model.description`.",
          "The reader exposes authored order as the key order of a Spec context's `sections.design`, `sections.ui`, and `sections.model.terms`; entry search rows follow it, and no reader method is added.",
          "Rendering open-section entries as a list follows the authored-entry-order decision; this Spec supplies the order the list follows.",
        ],
        ruleKeys: {
          integerLikeKey: "rules[2]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.contract-declarations",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/contract-declarations.sdp.md",
    title: "Pinned declarations give an adopter a derived module to typecheck",
    narrative:
      "The first adopter authored its design as keyed Design entries whose values open with a one-line code span, and a builder and a test author worked apart from that text. Every disagreement raised at the merge was a prose sentence with two readings, never a declaration, and a long table was split across several keyed entries rather than wrapped. That evidence rules the declaration shape below: a one-line code span rather than a fence or a closed section. The shape leaves the contract kind's evidence row unchanged, and a request for a closed contract section needs a Spec of its own. The adopter owns the derived module's emission with its own preamble; implementation and tests may import that module, and compiling it alone does not check their agreement. Nor does it check a span used inside a step bullet against its declaration.",
    sections: {
      intent: {
        problem:
          "Signatures and types in a design are code, yet an author writes them as prose entries no compiler reads, so a name used and never declared, or declared twice, is found only by a reviewer.",
        outcome:
          "Give a pinned declaration one ruled shape inside Design, so the adopter can derive a module and typecheck agreement with its implementation.",
      },
      behavior: {
        rules: [
          "A declaration is the code span that opens the value of one keyed Design entry, written on one line in the language the adopter's code is written in. The Protocol parses no language inside the span and stores it as authored.",
          "A fence is not the declaration shape. A declaration that does not fit one line is split across several keyed entries, each a declaration of its own.",
          "The key names the declaration's role, and the Protocol fixes no key vocabulary. An adopter's prefix convention, such as `fn`, `type`, `table`, `validator`, and `index`, is a project policy that a recipe reads and never a carrier rule.",
          "A declaration states a shape and never a delivery fact. The anchor's `satisfies` binds the code that claims to realize it and a test anchor binds the verifier that claims to check it, both outside the span.",
          "The derived module is a projection: regenerable, never edited, imported by the adopter's tests and never by an authored Spec.",
          "The adopter emits the derived module from the pinned declarations list with its own preamble of imports and placeholder declarations, until a second adopter needs the same preamble and the emitter freezes into `sdp build`. The module earns its place only when a changed pinned declaration fails the adopter's typecheck against its implementation; compiling it alone establishes no agreement with that implementation.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.pack-member-order.manifest-order-kept",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A manifest's member order survives into the graph and the reader",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Pack manifest whose specs list reads {manifestOrder: "spec:probe.zeta, spec:probe.alpha, spec:probe.mid"}',
            ],
            when: ["the graph is derived and serialized"],
            then: [
              'the serialized Pack node lists the members {serializedMembers: "spec:probe.zeta, spec:probe.alpha, spec:probe.mid"}',
              'the serialized belongsTo edges run from {edgeSources: "spec:probe.alpha, spec:probe.mid, spec:probe.zeta"}',
              'the reader\'s Pack context lists the members {readerMembers: "spec:probe.zeta, spec:probe.alpha, spec:probe.mid"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Execute the member order rule on a manifest whose authored order is not id order.",
        assumptions: [
          "The world writes one Markdown Pack manifest and three member Specs in one extraction root. Each member is a story-altitude behavior Spec stating `idea` with an Intent outcome and no relations. Lists are written as ids joined by a comma and a space.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/extraction/pack-member-order.manifest-order-kept.sdp.md",
  },
  {
    id: "spec:extraction.pack-member-order",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    title: "A Pack node keeps its members in authored order",
    narrative: null,
    sections: {
      intent: {
        problem:
          "A Pack manifest lists its members in the order its author chose to read them, and the graph loses that order: the serialized edges sort by from, type, and to, and the reader's Pack context sorts members by id, so an adopter reads the manifest file to recover a reading order the graph was given.",
        outcome:
          "Carry a Pack's members in the manifest's authored order through the serialized graph, the reader's Pack context, and the Design Review's Pack page, while the edges keep their global sort.",
      },
      behavior: {
        rules: [
          "A Pack node carries `members`, the manifest's `specs` list in authored order, a repeat included where the carrier admits one. The `belongsTo` edges re-express the same list, one edge per entry, so the members of a Pack node and the sources of its `belongsTo` edges are one list read twice and never disagree in a derived graph.",
          "`members` is always present on a Pack node, and an empty manifest list derives `members: []`. The serialized Pack node writes its fields in the order `id`, `nodeType`, `claim`, `title`, `framing`, `file`, `members`, `modelRefs`, `order`, omitting an absent optional field.",
          "Nodes keep their sort by id and edges keep their sort by from, type, and to. Authored member order is content of the Pack node, as authored entry order is content of a Spec's open sections, so two derivations of one commit stay byte-identical and two manifests that list the same members in different orders derive different Pack nodes.",
          "The reader's Pack context lists one member row per entry of `members`, in that order, and its verifier gaps follow the same order. The Design Review's Pack page renders its member table and its verifier gap list in that order.",
          "A repeated member is kept only where its carrier admits it. TypeScript keeps repetitions in `members` and reader rows, and pack-coherence reports the duplicate `belongsTo` edge. Markdown refuses a repeated manifest member with `extract/invalid-frontmatter` and the message `duplicate entry in specs`.",
        ],
        exampleSpace: {
          given: ["a Markdown Pack manifest whose specs list reads {manifestOrder:string}"],
          when: ["the graph is derived and serialized"],
          then: [
            "the serialized Pack node lists the members {serializedMembers:string}",
            "the serialized belongsTo edges run from {edgeSources:string}",
            "the reader's Pack context lists the members {readerMembers:string}",
          ],
        },
        ruleKeys: {
          authoredMembers: "rules[0]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/extraction/pack-member-order.sdp.md",
  },
  {
    id: "spec:extraction.entry-locations",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/entry-locations.sdp.md",
    title: "The graph records where each addressable entry is written",
    narrative:
      "An entry address names one keyed Design or UI entry, one keyed rule or flow, one keyed open question, or one keyed Model term. A reader following an address needs its recorded source line.",
    sections: {
      intent: {
        problem:
          "The graph records the file of a Spec and the line of every anchor, but not the line of an entry inside a Spec, so a page that links an address to its text, or a review that cites one, re-reads carrier syntax the extractor already parsed.",
        outcome:
          "Record source lines for Design and UI entries, rules and flows, Model terms, open questions and their optional fields, and authored relation targets beside the graph's nodes, so consumers locate text without parsing carriers.",
      },
      behavior: {
        rules: [
          "The graph carries a location table beside its nodes and edges. Each row names a Spec id, carrier file, entry and 1-based source line. Entries are `design.<key>` or `ui.<key>` for keys other than `description`, `rule[<i>]` or `flow[<i>]` for entries of the primary behavior owner, `term[<i>]` for a Model term, `question[<i>]` for an open question, `question[<i>].decider`, `question[<i>].links`, `question[<i>].provisional` or `question[<i>].trigger` for each of those optional fields present, and `relation.<type>.<target>` for an authored relation target. Indexes count from 0 within their authored lists, a term's among the Spec's terms in authored order. A rule, flow, term or question row carries `key` when that entry has one.",
          "Primitive and Pack nodes stay free of lines, so a comparison of nodes and edges is unchanged by an edit that only moves an entry, and carrier parity compares nodes and edges and never the location table, whose lines differ by carrier by nature.",
          "Markdown and TypeScript record the entry forms their syntax carries. TypeScript questions are located at the question property or string literal. Gherkin records its Rule lines and authored or defaulted relation sites; it carries no Design, UI or Model section, open question or question field. A missing row means not located, never absent.",
          "An authored relation target has a location row whose entry is `relation.<type>.<target>`, at its carrier's recorded relation site. A defaulted Gherkin relation uses the Scenario identity line when no explicit relation tag locates it.",
          "Rows sort by Spec id, then by entry, in code-unit order. The table is a deterministic function of the carriers at the extracted commit, as every other part of the graph is.",
          "A location names where an entry is written and nothing else: it is not an identity, never an anchor target or a binding, and an edit above an entry moves its line.",
          "The reader's Spec context carries the Spec's rows as its entry locations. Address resolution (recipe 25) adds the entry's value, file and line to each resolving row, and entry search (recipe 23) adds the line to each entry it matches.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.entry-citations",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/entry-citations.sdp.md",
    title: "The graph records where anchored source cites an entry address",
    narrative:
      "A test that checks a pinned declaration names the entry in its own text, often as the test's title, and the graph does not see that link: a reader of the declaration finds the suite's file through its anchor but not the assertion. The first adopter's type test names each comparison by the address of the Design entry it binds (`libar-platform/tests/types/pinned.test-d.ts`), and a reader of its pages could not find the comparison for one declaration. The extractor already reads every anchored source file for its anchors, so it records where such a file writes an entry address, and a page or a recipe shows the line that checks a declaration.\n\nA citation is where text names an entry, read by the machine from comments and strings. It carries the `inferred` claim and confers nothing, and it sits in a table beside the location table, as a position does. A citation is inferred location data in the graph. It adds no node or edge, confers no delivery fact, moves no readiness floor, feeds no Protocol validator and records no test verdict.",
    sections: {
      intent: {
        problem:
          "A test that checks one pinned declaration names its entry address only in its own text, so no view links the declaration to the line that checks it, and a reader holding the declaration cannot find its assertion.",
        outcome:
          "Record each entry address an anchored source file cites, with its file and line, as an inferred citation that confers nothing, so a view can show the test line that checks a pinned declaration.",
      },
      behavior: {
        rules: [
          "The extractor reads citations from each source file it reads for anchors that carries at least one anchor, of either form and any namespace, after the same exclusions; a file that carries no anchor, a carrier and any other file is not read for citations.",
          "A citation is a token the prose-mention scan would read as a mention, found anywhere in such a file's text, in a comment, a string or a template literal, that holds `#`; a token followed by `${`, directly or after the trailing punctuation the mention scan strips, is the prefix of a computed address and records no citation, whether or not the prefix parses as an entry address; a bare Spec id is not a citation.",
          "Each citation records the address as written, the file's root-relative path and the 1-based line the token starts on; one address written twice on one line is one row.",
          "The citations ride in a table of their own beside the location table, sorted and deterministic as the graph is, and Primitive and Pack nodes stay free of them.",
          "The table's definition gives every citation the `inferred` claim, and every reader row of a citation carries it, so no consumer reads a citation as an authored binding.",
          "A citation mints no node or edge, confers no delivery fact, moves no readiness floor, feeds no Protocol validator and records no verdict on the citing file; removing every citation changes no node, edge, fact, floor or finding.",
          "The reader resolves each citation by the rules address resolution applies, and the Spec context carries the citations whose address names that Spec as its entry citations, each with the entry it names, whether it resolves and why not, the citing file and line, the anchors recorded at that file and those of them that are test anchors verifying the Spec.",
          "Those rows let a view show, beside each pinned declaration of a Spec, the anchored lines that cite it, with no join of its own; a row reads as a test line only when a `test:` anchor at its file verifies the cited Spec, directly or through an example that verifies it, every other row stays a citation with its file and line, and no row says what a test asserts or whether it passed.",
          "Entry citations, recipe 51, lists for a Pack, a list of Specs or the corpus each pinned declaration and every other cited entry with the lines that cite it, and every citation that does not resolve, and answers each citation that does not resolve, and only those, as a finding, so a corpus may name the shipped file as a rules file.",
          "An unresolved citation stays in the table and reports only through the reader's rows and the recipe's answer, never as a Protocol finding: whether it fails a gate is the corpus's choice of rules file.",
        ],
        exampleSpace: {
          given: [
            "a probe corpus whose Spec pins the declaration {declaration:string}",
            'a source file that {anchored:"carries a test anchor verifying the Spec"|"carries a code anchor referencing the Spec"|"carries no anchor"} and names the address {address:string} on line {line:number}',
          ],
          when: ["the graph is derived"],
          then: [
            "the Spec context lists {citations:number} entry citations",
            'the citation {recorded:"resolves"|"does not resolve"|"is not recorded"}',
            "the citing line reads as a test line: {testLine:boolean}",
            "the shipped entry-citations file named as a rules file exits {exitCode:number}",
          ],
        },
        ruleKeys: {
          anchoredFilesOnly: "rules[0]",
          citationToken: "rules[1]",
          citationRow: "rules[2]",
          citationTable: "rules[3]",
          inferredClaim: "rules[4]",
          confersNothing: "rules[5]",
          readerRows: "rules[6]",
          declarationLines: "rules[7]",
          citationRecipe: "rules[8]",
          unresolvedReports: "rules[9]",
        },
      },
      design: {
        citationTable:
          "`citations?: readonly { address: string; file: string; line: number }[]` on the graph schema beside `locations`, rows sorted by `file`, then `line`, then `address`, in code-unit order; an absent table reads as empty, and the field is additive, so the schema version's minor part rises.",
        citationAddress:
          "`address` is the token as the prose-mention scan cuts it, its trailing punctuation removed; the sections it may name are the package's exported `ENTRY_ADDRESS_SECTIONS`, so an address section the grammar gains is read with no change here.",
        readerCitation:
          '`entryCitations: readonly { address: string; entry: string | null; resolves: boolean; reason: "malformed" | "section" | "entry" | null; file: string; line: number; anchors: readonly string[]; testAnchors: readonly string[]; claim: "inferred" }[]` on the Spec context, for every row whose address\'s Spec part, the text before its `#`, is this Spec\'s id, where `entry` is the location-table entry the address names, such as `design.<key>` or `rule[<i>]`, or null when it does not resolve, `reason` is address resolution\'s reason for a miss, `anchors` lists the ids of the anchors recorded at `file` in code-unit order, and `testAnchors` lists those of them that are `test:` anchors verifying this Spec, directly or through an example that verifies it; rows sort by `address`, then `file`, then `line`.',
        citationsRecipe:
          'recipe 51, entry citations, takes at most one scope, `params.pack` or `params.specs`, the whole corpus with neither, and `params.severity`, `"error"` by default or `"warning"`; both scopes, an id that does not resolve or another severity returns `{ diagnostics: [{ parameter, problem }] }` and no findings.',
        citationsAnswer:
          "`{ scope, totals: { citations, citedEntries, declarations, citedDeclarations, unresolved }, entries, unresolved, findings }`, where `scope` is `{ corpus: true }`, `{ pack }` or `{ specs }`, and the totals count within the scope: the citations whose Spec part names a Spec in it, the entry rows that some citation names, the pinned declarations, those an anchored line cites, and the unresolved rows.",
        entryRow:
          "`{ address, spec, pinned, line, citedBy: [{ file, line, anchors, testAnchors }] }`, one per pinned declaration in scope and per other entry in scope that a citation names, sorted by `address`; `line` is the entry's own recorded line or null, `citedBy` sorts by `file`, then `line`, and an uncited pinned declaration has an empty `citedBy`.",
        unresolvedRow:
          "`{ address, reason, file, line }`, one per citation that does not resolve whose Spec part names a Spec in scope, or every such citation with no scope, `reason` being address resolution's, `spec` for an absent Spec; rows sort by `file`, then `line`, then `address`.",
        citationFinding:
          '`{ validatorId: "unresolved-citation", subjectId, severity, message, file, line }` for each unresolved row, in that order, where `subjectId` is the address, `file` and `line` the citing site, and `message` reads `<address> cited at <file>:<line> does not resolve: <why>`, `<why>` as address resolution\'s finding words it.',
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.entry-citations.code-comment-cites-declaration",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/entry-citations.code-comment-cites-declaration.sdp.md",
    title: "A code file's comment cites a declaration without reading as a test line",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the test-line rule on a source file that carries a code anchor and names a pinned declaration's address in a comment.",
        assumptions: [
          "The world writes the probe corpus of the test-title example and a source file whose comment-form code anchor references that Spec and whose line comment, on the line the step names, holds the address. It derives the graph and reads the Spec context's entry citations, the row's `resolves`, its `anchors`, which name the code anchor, and its `testAnchors`, which are empty.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}',
              'a source file that {anchored: "carries a code anchor referencing the Spec"} and names the address {address: "spec:probe.one#design.typeOne"} on line {line: 9}',
            ],
            when: ["the graph is derived"],
            then: [
              "the Spec context lists {citations: 1} entry citations",
              'the citation {recorded: "resolves"}',
              "the citing line reads as a test line: {testLine: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.entry-citations.test-title-cites-declaration",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/entry-citations.test-title-cites-declaration.sdp.md",
    title: "A test title in an anchored file cites a pinned declaration",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the citation record on a test file that carries a test anchor and names a pinned declaration's address as a test title.",
        assumptions: [
          "The world writes a probe corpus of one story-altitude behavior Spec stating `idea` with an Intent outcome and one Design entry, `typeOne`, whose value opens with the code span `type One = string`. It writes a test file that carries a constant-form test anchor verifying that Spec and, on the line the step names, calls `test` with the address as its title. It derives the graph, reads the Spec context's entry citations, the row's `resolves` and whether its `testAnchors` names the file's anchor, then runs `sdp validate` on the probe root with `dist/recipes/51-entry-citations.js` named by `--rules`.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}',
              'a source file that {anchored: "carries a test anchor verifying the Spec"} and names the address {address: "spec:probe.one#design.typeOne"} on line {line: 9}',
            ],
            when: ["the graph is derived"],
            then: [
              "the Spec context lists {citations: 1} entry citations",
              'the citation {recorded: "resolves"}',
              "the citing line reads as a test line: {testLine: true}",
              "the shipped entry-citations file named as a rules file exits {exitCode: 0}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.entry-citations.unanchored-file-unread",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/entry-citations.unanchored-file-unread.sdp.md",
    title: "A file that carries no anchor is not read for citations",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the anchored-file rule on a test file with no anchor that names a pinned declaration's address.",
        assumptions: [
          "The world writes the probe corpus of the test-title example and the same test file without its test anchor, derives the graph and reads the Spec context's entry citations.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}',
              'a source file that {anchored: "carries no anchor"} and names the address {address: "spec:probe.one#design.typeOne"} on line {line: 9}',
            ],
            when: ["the graph is derived"],
            then: [
              "the Spec context lists {citations: 0} entry citations",
              'the citation {recorded: "is not recorded"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.entry-citations.unresolved-citation",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/extraction/entry-citations.unresolved-citation.sdp.md",
    title:
      "A citation of an entry its Spec lacks reports through the recipe, never as a Protocol finding",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the unresolved path on an anchored test file that names a Design key its Spec does not carry.",
        assumptions: [
          "The world writes the probe corpus and anchored test file of the test-title example, the title naming the address below. It derives the graph and reads the Spec context's entry citations, checks that the validation report holds no finding about the citation, then runs the shipped entry-citations file as a rules file as that example does.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}',
              'a source file that {anchored: "carries a test anchor verifying the Spec"} and names the address {address: "spec:probe.one#design.typeTwo"} on line {line: 9}',
            ],
            when: ["the graph is derived"],
            then: [
              "the Spec context lists {citations: 1} entry citations",
              'the citation {recorded: "does not resolve"}',
              "the shipped entry-citations file named as a rules file exits {exitCode: 1}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
