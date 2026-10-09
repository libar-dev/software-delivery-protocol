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
          "one-kind rule":
            "A Spec states one category of truth; when one fact straddles kinds, author two Specs and join them with the relation that preserves their distinct intents.",
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
    readiness: "ready",
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
          "comment promotion":
            "Source commentary that states rules other surfaces depend on is a promotion trigger: those rules promote into a standalone Spec under the promotion law, and the comment demotes to local commentary plus a Spec pointer; restating the promoted rules in the comment violates exclusive promotion.",
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
    readiness: "ready",
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
          "typed dependency distinction":
            "`constrainedBy` and `decidedBy` preserve separately queryable intents that a generic `dependsOn` edge would flatten.",
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
          "An ID uses a lowercase namespace and a dotted path whose segments admit mixed case (case binds only on the namespace), with an optional single `#` sub-part; the `#` sub-part is an entry address, reserved in every namespace and never part of an identity; referential-integrity checks reject malformed or unresolved references.",
          "IDs carry no history: a rename is a repository edit recorded by git rather than graph-resident bookkeeping.",
          "The builders reserve one namespace per binding direction — `spec:` for a Spec and for every Spec reference, `pack:` for the aggregate, `impl:` · `api:` · `component:` for a code anchor, `test:` for a verifying test anchor, and `oracle:` for an expected-outcome anchor — while the grammar itself admits any lowercase namespace, so the reserved set is the builders' law rather than the parser's.",
          "`doc:` is reserved for a genuinely external document a decision Spec links to, never for an in-system decision: in-system decisions are Specs, and this corpus places them by convention under a dotted path opening with the `decisions` segment. No builder mints a `doc:` identifier and the Spec-only reference builder refuses one, so the reservation is a named deferral rather than a landed namespace.",
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
            given: [
              'the authored identifier {identifier: "spec:orders.create-order#design.validCart"}',
            ],
            when: ["the identifier is parsed"],
            then: [
              'parsing {outcome: "resolves"}',
              'reformatting the parsed parts restores {restored: "spec:orders.create-order#design.validCart"}',
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
    id: "spec:model.stable-ids.unsectioned-address-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/model/stable-ids.unsectioned-address-refused.sdp.md",
    title: "A `#` sub-part without its section is refused with its reason named",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the entry-address clause of the ID grammar on a sub-part that names no section.",
      },
      behavior: {
        examples: [
          {
            given: ['the authored identifier {identifier: "spec:orders.create-order#valid-cart"}'],
            when: ["the identifier is parsed"],
            then: [
              'parsing {outcome: "is refused"}',
              'the refusal names the reason {reason: "entry address must be <section>.<key> with section design, ui, or question"}',
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
    readiness: "ready",
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
      model: {
        terms: {
          anchor:
            "A human-written source binding from one code location into the graph, carrying identity, an optional label, zero or more targets, and optional structure; written in one of two extracted representations, the constant form or the comment form, which feed one closed envelope. It never carries behavior, rationale, readiness, status, acceptance criteria, or delivery facts.",
          "constant form":
            "The top-level const initialized with a trusted builder call; the extractor reifies it statically. It was formerly named the anchor-constant form. The decorator form remains an unextracted representation.",
          "comment form":
            "A top-level `/** … */` block in a `.ts` or `.tsx` file carrying reserved camelCase tags (`@sdpAnchor`, `@sdpLabel`, `@sdpSatisfies`, `@sdpVerifies`, `@sdpModels`, `@sdpReferences`, `@sdpComponent`, `@sdpUses`, `@sdpRole`, `@sdpLayer`, `@sdpContext`); `@sdpAnchor <id>` opens it, each tag appears at most once, prose precedes the tags, only the reserved tags are read, and comment prose authors nothing. No import is required: trust is by reserved grammar. The same id in both forms is a duplicate id. The law is the comment-form ruling (MD-36).",
          "anchors subpath":
            "The zero-dependency package subpath `@libar-dev/software-delivery-protocol/anchors`, exporting the id builders and the three anchor builders and nothing else; the extractor trusts it as a Protocol builder module.",
          "code anchor":
            "An implementation-flavored binding in the `impl:`, `api:`, or `component:` namespace. Its optional, plural `satisfies` derives one anchored `satisfies` edge per target; its optional `references` derives one anchored `references` edge per target. It may additionally name one `component?: ComponentAnchorId`, a non-empty, unique `uses?: readonly CodeAnchorId[]`, and a `role`; a `component:` anchor may also name `layer` and `context`. The binding grain is the binding-grain ruling (MD-37); the structural attributes are the architectural-annotation ruling (MD-38).",
          "plural targets":
            "`satisfies` on a code anchor and `verifies` on a test anchor accept one `ref(…)` or a fresh array literal of them; `verifies` is non-empty. Each resolving target confers its fact as a single target does, and `implemented` stays a whole-Spec fact.",
          "identity-only anchor":
            "A code anchor with no `satisfies` and no `references`; it mints a CodeNode for structure and for `byFile`, derives no realization edge, and confers nothing.",
          references:
            "The anchored CodeNode-to-Spec edge derived from `references?: readonly SpecId[]` on a code anchor: this code is written against that design. It confers no delivery fact, moves no readiness floor, and the drift alarm ignores it; a target also named in `satisfies` is an error. The reader reports the referencing units on the Spec's context, and blast radius traverses the edge as a binding.",
          role: "An optional free string on a code anchor naming the architectural pattern the unit plays; a corpus-owned vocabulary whose taxonomy the census renders with counts, checked against no list.",
          layer:
            "An optional attribute of a `component:` anchor, one of `edge`, `application`, `domain`, `adapter`, or `infrastructure`; a value outside the set, or the attribute on a non-component anchor, is an envelope error.",
          context:
            "An optional free string on a `component:` anchor naming its bounded context; on a non-component anchor it is an envelope error.",
          "declared component":
            "The `component:` anchor is the component's declaration; there is no separate architecture file, because the anchor sits where the component is realized.",
          "component realization convention":
            "A `component:` anchor that satisfies a Spec satisfies its seam's most-specific design Spec; that `satisfies` edge is the component's own realization claim. Structural edges confer nothing under the architectural-annotation ruling (MD-38), which supersedes structural anchors confer nothing (MD-30) without changing this.",
          "structural anchor validity":
            "A `memberOf` source is an `impl:` or `api:` CodeNode and its target is a `component:` CodeNode; every structural target exists, every edge is unique, each source has at most one component, and structural self-reference is refused. A malformed or non-static structural field, an unknown `layer`, or `layer` or `context` on a non-component anchor refuses the whole anchor at reification; a graph-validly reified edge that later fails referential or structural validation remains visible with its anchor and independent `satisfies` binding. Multi-node `uses` cycles remain data and produce no finding.",
          "structural non-conferral":
            "Structural edges, `role`, `layer`, and `context` carry no intent, delivery fact, readiness effect, or binding-to-Spec traversal; no `implements` field is admitted.",
          "test anchor":
            "A binding in the `test:` namespace that derives one anchored `verifies` edge per target from a test to each Spec it verifies.",
          "oracle anchor":
            "A binding in the `oracle:` namespace that records an oracle's `models` target without deriving a delivery fact.",
          "executable binding boundary":
            "A resolving `specTest` anchor can establish verifier realization; a `bindExample` call executes a generated contract but is not extracted graph data, so the graph cannot claim from that call alone that the contract is bound.",
          "document-realization binding":
            "When the realizing artifact is authored Markdown that cannot carry an extracted in-code anchor, the executable suite that asserts the shipped document may carry its code anchor. Its label must name the document realization rather than imply the test body is the product, and file-level blast radius remains coverage-unknown for the Markdown artifact.",
          "Protocol builder binding":
            "A builder import from the public Protocol package or its anchors subpath, or a relative import whose importer-relative resolution, including the TypeScript `.js`-to-`.ts` convention, canonicalizes to this package's `ids` or `model/code-anchor` module; consumer-local lookalike modules confer no binding authority. On the CommonJS package surface the trusted relative-module set is empty (`import.meta.url` is rewritten away), so relative bindings mint no anchors there while package imports stay trusted. The comment form needs no builder binding.",
          "untrusted builder":
            "A constant-form builder call whose import is no Protocol builder binding: it mints nothing and reports nothing, because a source file that never bound to the Protocol is not authoring drift to report. The realizing entrypoints are `protocolBindingScopeFor` and `collectProtocolBindings` in `src/extract/protocol-bindings.ts`.",
        },
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
  {
    id: "spec:model.structural-patterns",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/model/structural-patterns.sdp.md",
    title: "Architecturally significant units are annotated where they are realized",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Annotate each architecturally significant unit on the anchor of the code that realizes it, with its role, its component's layer and bounded context, its uses, and the designs it references, so the graph answers architecture questions from the code itself. Architectural significance adds no Spec kind, no node type, and no vocabulary registry.",
      },
      model: {
        terms: {
          "architecturally significant unit":
            "A code unit with exported public surface or cross-component reach that warrants graph-visible structural binding: component membership, uses declarations for its architectural dependencies, a role, and `references` to the designs it is written against.",
          "structural attributes":
            "`role` on any code anchor; `layer` and `context` on a `component:` anchor; all three describe what the unit is, never where it stands, and the census renders their taxonomy from the graph.",
          "accepted set":
            "The set of architecturally significant units in a corpus is an owner-reviewed declaration, never derived from imports or exports; annotations are curated, never a coverage quota.",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:model.open-question-keys.keyed-question-resolves",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "A keyed question is reified and its address resolves",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier {specId: "spec:probe.subject"} whose open questions read {questions: "- [blocking #aggregateReach] Does the owner widen the aggregate?; - [non-blocking] Is the name final?"}',
              'a second Spec that names {address: "spec:probe.subject#question.aggregateReach"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: true}",
              'the extraction findings name {extractMessage: ""}',
              'the graph holds the question keys {keys: "aggregateReach"}',
              "the report holds {mentionErrors: 0} prose-mention errors",
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Execute the key grammar and the question address on one keyed question beside an unkeyed one.",
        assumptions: [
          "The world writes two Markdown carriers in one extraction root. The first is a story-altitude rule Spec stating `scoped` with an Intent outcome, one rule, and one declared `refines` on the second; its Open questions hold the entries written in `questions`, one line each, where the slot joins them with a semicolon and a space. The second is a story-altitude rule Spec stating `idea` with an Intent outcome and one rule; it names the address in its narrative and declares `dependsOn` on the first. The messages of the extraction findings are joined by a semicolon and a space, and an empty string names no finding; the keys of every Spec in the graph are joined by a comma and a space.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/model/open-question-keys.keyed-question-resolves.sdp.md",
  },
  {
    id: "spec:model.open-question-keys.renamed-key-breaks",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "A renamed question key fails the mention that addresses it",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier {specId: "spec:probe.subject"} whose open questions read {questions: "- [blocking #aggregateScope] Does the owner widen the aggregate?"}',
              'a second Spec that names {address: "spec:probe.subject#question.aggregateReach"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: true}",
              'the extraction findings name {extractMessage: ""}',
              'the graph holds the question keys {keys: "aggregateScope"}',
              "the report holds {mentionErrors: 1} prose-mention errors",
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Execute the missing-entry error on an address whose question key the target no longer carries.",
        assumptions: [
          "The world is the one of the keyed-question example, with the key renamed in the first carrier and the address in the second left as it was.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/model/open-question-keys.renamed-key-breaks.sdp.md",
  },
  {
    id: "spec:model.open-question-keys.repeated-key-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "A repeated question key refuses its carrier",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier {specId: "spec:probe.subject"} whose open questions read {questions: "- [blocking #aggregateReach] Does the owner widen the aggregate?; - [non-blocking #aggregateReach] Does the aggregate keep its name?"}',
              'a second Spec that names {address: "spec:probe.subject#question.aggregateReach"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: false}",
              'the extraction findings name {extractMessage: "open question keys must be unique"}',
              'the graph holds the question keys {keys: ""}',
              "the report holds {mentionErrors: 1} prose-mention errors",
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Execute the uniqueness refusal, and show that the address then names a missing Spec.",
        assumptions: [
          "The world is the one of the keyed-question example, with two questions in the first carrier that carry the same key. The first carrier is refused whole, so the graph holds no question key and the address's Spec is absent.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/model/open-question-keys.repeated-key-refused.sdp.md",
  },
  {
    id: "spec:model.open-question-keys",
    specKind: "rule",
    altitude: "story",
    readiness: "defined",
    title: "An open question may carry a key that addresses it",
    narrative: null,
    sections: {
      intent: {
        problem:
          "An open question has no identity but its position and its text, so a register or a decision that cites one breaks silently when a question above it moves, closes, or is reworded.",
        outcome:
          "Let an author give an open question an optional key, so `spec:<id>#question.<key>` names it, resolves while it stands, and fails validation where it is renamed or removed.",
      },
      behavior: {
        rules: [
          "An open question is prose, or an object with `question`, an optional `blocking` flag, and an optional `key`. A key matches `^[a-z][A-Za-z0-9]*$`, the grammar of a Design key, and is unique among the open questions of one Spec. An unkeyed question stays lawful and has no address.",
          "In the Markdown carrier the key follows the flag inside the marker, after one space and `#`, as in `- [blocking #aggregateReach] Does the owner widen the aggregate?` or `- [non-blocking #pageHome] Where does the page live?`. A marker whose key text is empty or off the grammar is refused with `open question keys must be lower-camel ASCII`, and a key that repeats an earlier key of the same Spec is refused with `open question keys must be unique`, each as the structure finding `extract/invalid-markdown-structure` at the line of the entry, and the carrier is refused whole as for every structure refusal.",
          'In the TypeScript carrier the key is the `key` property of the question object. A key that is not a string on the grammar, or that repeats an earlier key of the same Spec, is refused with the finding `extract/unrecognized-property` at severity error and the message `property "intent.openQuestions[<n>].key" is refused: open question keys must be lower-camel ASCII` or `property "intent.openQuestions[<n>].key" is refused: open question keys must be unique`, with `<n>` the zero-based position; only the key drops, and the question and the Spec stay.',
          "The serialized graph writes a question object's fields in the order `question`, `blocking`, `key`, omitting an absent one. The import emitter writes a keyed question's marker as `[<flag> #<key>]`, so a keyed TypeScript question round-trips into Markdown.",
          "The entry address gains the section `question`: `spec:<id>#question.<key>` parses, is refused in every id slot as every entry address is, and resolves when the Spec exists and one of its open questions carries that key. A mention whose question key no open question carries is the prose-mentions error for a missing entry, so renaming or removing a key fails validation in every Spec that addresses it.",
          "The open-question register reports each question's key, or null for an unkeyed question. The mention audit and entry search read the `question` address as they read a `design` or `ui` address, and entry search gives a keyed question's text the address `spec:<id>#question.<key>`.",
          "The realizing sites are `IntentOpenQuestion` in `src/model/sections.ts`, the open-question marker in `src/extract/markdown-body-owner-behavior.ts`, the question shape in `src/extract/reify.ts`, `canonicalOpenQuestion` in `src/extract/serialize.ts`, the Intent emission in `src/import/emit-markdown.ts`, the entry-address grammar in `src/ids.ts`, and `hasAddressedEntry` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "a Markdown Spec carrier {specId:string} whose open questions read {questions:string}",
            "a second Spec that names {address:string} in its narrative and declares dependsOn on the first",
          ],
          when: ["the extractor reifies both carriers and the graph is validated"],
          then: [
            "the first carrier is reified: {reified:boolean}",
            "the extraction findings name {extractMessage:string}",
            "the graph holds the question keys {keys:string}",
            "the report holds {mentionErrors:number} prose-mention errors",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/model/open-question-keys.sdp.md",
  },
] as const;
