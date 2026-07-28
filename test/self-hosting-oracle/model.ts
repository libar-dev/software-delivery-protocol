// The authored descriptors of the `model` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const modelSpecs = [
  {
    id: "spec:model.protocol-domain",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/model/protocol-domain.sdp.md",
    title: "The Protocol domain uses one ratified language",
    narrative: null,
    sections: {
      intent: { outcome: "Give self-hosting specs the same core vocabulary." },
      model: {
        terms: {
          Pack: "A grouping and review aggregate that states no system truth.",
          Spec: "The one authored truth-primitive.",
          anchor: "An in-code identity binding that states no intent.",
          "delivery fact": "A machine-derived realization signal.",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:model.core-model",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/model/core-model.sdp.md",
    title: "The Protocol models delivery with one enrichable Spec",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give every authored delivery statement one stable shape and independent coordinates.",
      },
      model: {
        terms: {
          Spec: "The one authored truth-primitive, enriched in place without changing artifact type.",
          altitude: "The scope position `epic`, `feature`, or `story`.",
          "delivery fact":
            "A derived realization signal such as implemented or has-verifier; it is never authored readiness.",
          "direct realization":
            "`implemented` follows a resolving implementation binding and never propagates through refinement; examples normally provide verification evidence rather than implementation work.",
          envelope:
            "The stable outer shape of id, title, kind, altitude, readiness, and relations; sections carry extension detail.",
          kind: "The true subtype that categorizes a Spec's truth and changes its required detail and validation.",
          readiness:
            "The author-stated design-maturity position `idea`, `scoped`, `defined`, or `ready`, checked against a structural floor.",
        },
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:model.spec-sections",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/model/spec-sections.sdp.md",
    title: "Spec sections carry typed detail and direct verifier semantics",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Extend Specs with local detail without weakening their envelope or confusing binding evidence with intent.",
      },
      model: {
        terms: {
          "content-only section":
            "A section carries local content, while relations carry links to promoted standalone Specs.",
          "enabled verifier":
            "An example or direct test with a linked, resolvable test anchor; runner execution and pass state remain outside the graph.",
          promotion:
            "Moving shared or independently reviewed content into a standalone Spec of the matching kind, exclusively rather than alongside inline content.",
          section:
            "An optional detail slice of a Spec: intent, behavior, constraints, model, design, decision, verification, or ui.",
          "typing law":
            "Every section read by a readiness-floor clause has a closed typed shape; unsettled design and ui surfaces remain open bags.",
          verifies:
            "A direct verifier-to-target relation whose enabled test binding can derive has-verifier only for that stated target.",
          "verification mode":
            "Authored intended posture such as executable; it never stands in for the derived enabled-verifier realization.",
        },
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:model.enrichment-lifecycle",
    specKind: "model",
    altitude: "feature",
    readiness: "scoped",
    file: "specs/model/enrichment-lifecycle.sdp.md",
    title: "Enrichment keeps one Spec while its detail changes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep a Spec useful after implementation without recreating value-transfer duplication.",
        openQuestions: [
          {
            question:
              "After implementation, which design-time detail stays in the Spec and which detail may be removed while preserving one durable home for each explanation?",
            blocking: true,
          },
        ],
      },
      model: {
        terms: {
          "enrichment lifecycle":
            "The same Spec gains and may later slim typed detail without changing identity or moving truth into another artifact type.",
          "distillation boundary":
            "Implemented code does not automatically justify either retaining or deleting design-time detail; the unresolved policy must preserve one home per explanation.",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:model.relations",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/model/relations.sdp.md",
    title: "Specs declare typed directed relations",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Preserve the explicit intent links that make a delivery model navigable and queryable.",
      },
      model: {
        terms: {
          "authored relation": "A declared, directed Spec-to-Spec edge that records human intent.",
          constrainedBy: "A bounded Spec points to its rule, constraint, or policy Spec.",
          decidedBy: "A shaped Spec points to its Decision Record.",
          dependsOn: "A dependent Spec points to the Spec it needs.",
          refines: "A child points to its more precise parent.",
          supersedes: "A current Decision Record points forward to the decision it replaces.",
          verifies: "A verifier points to the Spec it verifies.",
        },
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:model.stable-ids",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/stable-ids.sdp.md",
    title: "Stable IDs are the Protocol's durable join key",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep intent, bindings, and graph nodes connected through names that survive code refactoring.",
      },
      behavior: {
        rules: [
          "A Protocol ID is stable, unique, namespaced, human-readable, and the only binding between intent and code.",
          "An ID uses a lowercase namespace and a dotted path whose segments admit mixed case (case binds only on the namespace), with an optional single `#` sub-part; referential-integrity checks reject malformed or unresolved references.",
          "IDs carry no history: a rename is a repository edit recorded by git rather than graph-resident bookkeeping.",
          "The builders reserve one namespace per binding direction — `spec:` for a Spec and for every Spec reference, `pack:` for the aggregate, `impl:` · `api:` · `component:` for a code anchor, `test:` for a verifying test anchor, and `oracle:` for an expected-outcome anchor — while the grammar itself admits any lowercase namespace, so the reserved set is the builders' law rather than the parser's.",
          "`doc:` is reserved for a genuinely external document a decision Spec links to, never for an in-system decision: in-system decisions are Specs under the `spec:decisions.*` convention. No builder mints a `doc:` identifier and the Spec-only reference builder refuses one, so the reservation is a named deferral rather than a landed namespace.",
          "The realizing entrypoints are `parseId` and `formatId` in `src/ids.ts`.",
        ],
        exampleSpace: {
          given: ["the authored identifier {identifier:string}"],
          when: ["the identifier is parsed"],
          then: [
            'parsing {outcome:"resolves"|"is refused"}',
            "reformatting the parsed parts restores {restored:string}",
            "the refusal names the reason {reason:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.stable-ids.namespaced-round-trip",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/stable-ids.namespaced-round-trip.sdp.md",
    title: "A namespaced dotted path with a sub-part survives parsing unchanged",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the ID grammar on the fullest well-formed shape the model allows.",
      },
      behavior: {
        examples: [
          {
            given: ['the authored identifier {identifier: "spec:orders.create-order#valid-cart"}'],
            when: ["the identifier is parsed"],
            then: [
              'parsing {outcome: "resolves"}',
              'reformatting the parsed parts restores {restored: "spec:orders.create-order#valid-cart"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.stable-ids.malformed-refusal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/stable-ids.malformed-refusal.sdp.md",
    title: "An uppercase namespace is refused with its reason named",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the lowercase-namespace clause of the ID grammar.",
      },
      behavior: {
        examples: [
          {
            given: ['the authored identifier {identifier: "Spec:orders.create-order"}'],
            when: ["the identifier is parsed"],
            then: [
              'parsing {outcome: "is refused"}',
              'the refusal names the reason {reason: "namespace must be lowercase"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.pack-aggregate",
    specKind: "model",
    altitude: "story",
    readiness: "defined",
    file: "specs/model/pack-aggregate.sdp.md",
    title: "A Pack is a truth-free review aggregate",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let reviewers group related Specs without introducing a second truth-bearing artifact.",
      },
      model: {
        terms: {
          Pack: "An authored aggregate that groups related Specs for ideation and review while stating no system truth of its own.",
          framing: "A plain descriptive note explaining why a Pack exists; it is not Spec intent.",
          membership:
            "A declared manifest reference that derives a belongsTo edge; a Spec may belong to many Packs.",
          modelRefs:
            "References from a Pack to standalone model Specs that carry shared vocabulary.",
          refinement:
            "A truth-bearing parent-child relation, distinct from the cross-cutting Pack aggregate.",
        },
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:model.anchors",
    specKind: "model",
    altitude: "feature",
    readiness: "ready",
    file: "specs/model/anchors.sdp.md",
    title: "Source anchors bind code without carrying intent",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Connect implementation, tests, and oracles to Specs while keeping authored intent centralized in the carrier.",
      },
      behavior: {
        exampleSpace: {
          given: [
            'a repository whose one source file builds an anchor through {builderSource:"a consumer-local lookalike module"|"a relative import resolving to the Protocol builder modules"|"the published Protocol package"}',
          ],
          when: ["the repository is extracted"],
          then: [
            "the extraction mints {anchorCount:number} anchors",
            "the extraction reports {findingCount:number} findings",
          ],
        },
      },
      model: {
        terms: {
          "Protocol builder binding":
            "A builder import from the public Protocol package, or a relative import whose importer-relative resolution — including the TypeScript `.js`-to-`.ts` convention — canonicalizes to this package's `ids` or `model/code-anchor` module; consumer-local lookalike modules confer no binding authority. On the CommonJS package surface the trusted relative-module set is empty (`import.meta.url` is rewritten away), so relative bindings mint no anchors there while package imports stay trusted.",
          anchor:
            "A human-written source binding from one code location to one Spec ID, carrying identity, an optional label, and one target only.",
          "anchor-constant form":
            "The top-level const builder call that the MVP extractor reifies; decorator and JSDoc forms remain unextracted representations.",
          "code anchor":
            "An implementation-flavored binding that derives an anchored satisfies edge.",
          "document-realization binding":
            "When the realizing artifact is authored Markdown that cannot carry an extracted in-code anchor, the executable suite that asserts the shipped document may carry its code anchor. Its label must name the document realization rather than imply the test body is the product, and file-level blast radius remains coverage-unknown for the Markdown artifact.",
          "executable binding boundary":
            "A resolving `specTest` anchor can establish verifier realization; a `bindExample` call executes a generated contract but is not extracted graph data, so the graph cannot claim from that call alone that the contract is bound.",
          "oracle anchor":
            "A binding that records an oracle's models target without deriving a delivery fact.",
          "test anchor":
            "A binding that derives an anchored verifies edge from a test to its target Spec.",
          "untrusted builder":
            "A builder call whose import is no Protocol builder binding: it mints nothing and reports nothing, because a source file that never bound to the Protocol is not authoring drift to report. The realizing entrypoints are `protocolBindingScopeFor` and `collectProtocolBindings` in `src/extract/protocol-bindings.ts`.",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.anchors.lookalike-refusal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/anchors.lookalike-refusal.sdp.md",
    title: "A consumer-local lookalike builder mints no anchor and no finding",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the builder-trust law where a repository's own module merely resembles the Protocol builders.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a repository whose one source file builds an anchor through {builderSource: "a consumer-local lookalike module"}',
            ],
            when: ["the repository is extracted"],
            then: [
              "the extraction mints {anchorCount: 0} anchors",
              "the extraction reports {findingCount: 0} findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.anchors.physical-identity",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/anchors.physical-identity.sdp.md",
    title: "A deep relative import that resolves to the Protocol builders is trusted",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the builder-trust law where trust turns on physical module identity rather than the import's spelling.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a repository whose one source file builds an anchor through {builderSource: "a relative import resolving to the Protocol builder modules"}',
            ],
            when: ["the repository is extracted"],
            then: [
              "the extraction mints {anchorCount: 1} anchors",
              "the extraction reports {findingCount: 0} findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
