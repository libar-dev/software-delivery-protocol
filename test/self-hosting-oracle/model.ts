// The authored descriptors of the `model` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const modelSpecs = [
  {
    id: "spec:model.core-model",
    specKind: "model",
    altitude: "epic",
    readiness: "ready",
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
          altitude:
            "The scope position `epic`, `feature`, or `story`; `epic` is the ceiling, and anything above it is deferred.",
          "delivery fact":
            "A derived realization signal, `implemented`, `has-verifier` or the deferred `observed`, computed from edges and never authored; it is independent of the stated readiness.",
          "direct realization":
            "`implemented` follows a resolving implementation binding and never propagates through refinement; examples normally provide verification evidence rather than implementation work.",
          envelope:
            "The stable outer shape of id, title, kind, altitude, readiness, and relations; sections carry extension detail.",
          kind: "The true subtype that categorizes a Spec's truth and changes its required detail and validation; one of eight, each shown by its display label: `behavior` (Use Case / Behavior), `workflow` (Workflow), `example` (Example / Scenario), `rule` (Business Rule), `constraint` (Constraint (NFR)), `model` (Domain Model), `decision` (Decision Record), `contract` (Contract).",
          "one-kind rule":
            "A Spec states one category of truth; when one fact straddles kinds, author two Specs and join them with the relation that preserves their distinct intents.",
          readiness:
            "The author-stated design-maturity position `idea`, `scoped`, `defined`, or `ready`, checked against a structural floor.",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
            "A verifying example backed by a linked, resolvable test anchor; a test anchor that verifies a Spec directly confers `has-verifier` without being an enabled verifier, and runner execution and pass state stay outside the graph.",
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
    readiness: "ready",
    file: "specs/model/enrichment-lifecycle.sdp.md",
    title: "Enrichment keeps one Spec while its detail changes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep a Spec useful after implementation without copying its detail into a second artifact that drifts from it.",
      },
      model: {
        terms: {
          "enrichment lifecycle":
            "The same Spec gains and may later slim typed detail without changing identity or moving truth into another artifact type.",
          "distillation boundary":
            "A Design entry may leave its Spec once the Spec is implemented with a verifier and a bound artifact carries the entry: a pinned declaration whose realizing unit exists, or a bound example. Prose that explains why always stays, so each explanation keeps one home, and implemented code alone justifies neither keeping nor deleting detail.",
          "slimming candidate":
            "A Design entry past the distillation boundary. A recipe reports the candidates and never deletes one; removing an entry stays the author's edit.",
        },
      },
      design: {
        slimmingRecipe:
          "recipe 39, slimming candidates, takes an optional `params.pack` and returns `{ totals: { specs, potentialCandidates }, rows, leftOut }`, each row `{ spec, key, line, declaration, implementations, verifiers }` for a pinned declaration on a Spec that carries both `implemented` and `has-verifier`.",
        slimmingScope:
          "rows are potential candidates the author compares with the bound artifacts, because a binding names a whole Spec and the graph proves no entry-level realization for a declaration or an example; `leftOut` states both limits, and prose entries are never candidates.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
          refines:
            "A more precise child points to its parent; refinement is how altitude descends, and a decision that narrows one part of another decision refines it.",
          supersedes:
            "A newer Decision Record points to the older record it replaces whole; the older record and the edge stay only while its text explains something a reader still needs.",
          "typed dependency distinction":
            "`constrainedBy` and `decidedBy` preserve separately queryable intents that a generic `dependsOn` edge would flatten.",
          verifies:
            "A verifier points to the Spec it verifies; an example declares it, a test anchor's binding derives it, and the two claims are never collapsed.",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
          "An ID has a lowercase namespace followed by a colon and a dotted path whose segments admit mixed case. An optional single `#` suffix is an entry address, `<section>.<key>`, with section `design`, `ui`, `question`, `rule` or `term` and a lower-camel ASCII key; it is admitted only in the `spec:` namespace and never belongs to an identity. Referential-integrity checks reject malformed or unresolved references.",
          "IDs carry no history: a rename is a repository edit recorded by git rather than graph-resident bookkeeping.",
          "The Spec and Spec-reference builders admit `spec:`, the Pack builder `pack:`, the code-anchor builder `impl:`, `api:` and `component:`, the test-anchor builder `test:`, and the oracle-anchor builder `oracle:`. These are the namespaces of the flavored authored identities and targets; the grammar itself admits any lowercase namespace.",
          "`doc:` is reserved for a genuinely external document a decision Spec links to; in-system decisions are Specs. Authored relations and the Spec-reference builder accept `spec:` targets, so the `doc:` relation-target reservation is a named deferral rather than a landed relation target.",
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
        ruleKeys: {
          idGrammar: "rules[1]",
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
    readiness: "ready",
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
              'the refusal names the reason {reason: "entry address must be <section>.<key> with section design, ui, question, rule, or term"}',
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
    deliveryFacts: ["implemented", "has-verifier"],
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
            "The top-level const initialized with a trusted builder call; the extractor reifies it statically. The decorator form remains an unextracted representation.",
          "comment form":
            "A top-level `/** … */` block in a `.ts` or `.tsx` file carrying reserved camelCase tags (`@sdpAnchor`, `@sdpLabel`, `@sdpSatisfies`, `@sdpVerifies`, `@sdpModels`, `@sdpReferences`, `@sdpComponent`, `@sdpUses`, `@sdpRole`, `@sdpLayer`, `@sdpContext`); `@sdpAnchor <id>` opens it, each tag appears at most once, prose precedes the tags, only the reserved tags are read, and comment prose authors nothing. No import is required: trust is by reserved grammar. The same id in both forms is a duplicate id. The law is the comment-form ruling (MD-36).",
          "anchors subpath":
            "The zero-dependency package subpath `@libar-dev/software-delivery-protocol/anchors`, exporting the id builders and the three anchor builders and nothing else; the extractor trusts it as a Protocol builder module.",
          "code anchor":
            "An implementation-flavored binding in the `impl:`, `api:`, or `component:` namespace. Its optional, plural `satisfies` derives one anchored `satisfies` edge per target; its optional `references` derives one anchored `references` edge per target. It may also name one `component:` anchor it belongs to, a non-empty list of distinct code units it `uses`, and a `role`; a `component:` anchor may also name `layer` and `context`. The binding grain is the binding-grain ruling (MD-37); the structural attributes are the architectural-annotation ruling (MD-38).",
          "plural targets":
            "`satisfies` on a code anchor and `verifies` on a test anchor accept one `ref(…)` or a fresh array literal of them; `verifies` is non-empty. Each resolving target confers its fact as a single target does, and `implemented` stays a whole-Spec fact.",
          "identity-only anchor":
            "A code anchor with no `satisfies` and no `references`; it mints a CodeNode for structure and for `byFile`, derives no realization edge, and confers nothing.",
          references:
            "The anchored CodeNode-to-Spec edge derived from `references?: readonly SpecId[]` on a code anchor: this code answers to that design without claiming to realize it. The unit follows the design without realizing any of its promises, or realizes part of a Spec whose remaining promises no unit yet realizes, so a change to the design asks the code to follow. The direction is one way: a design that builds on existing code states that on its own side, by a `dependsOn` or `refines` relation to the Spec the code satisfies, never by a reference from the code. It confers no delivery fact, moves no readiness floor, and the drift alarm ignores it; a target also named in `satisfies` is an error. The reader reports the referencing units on the Spec's context, and blast radius traverses the edge as a binding.",
          role: "An optional one-token value on a code anchor, lowercase kebab and never normalized, naming the architectural pattern the unit plays; a corpus-owned vocabulary whose taxonomy the census renders with counts, checked against no list.",
          layer:
            "An optional attribute of a `component:` anchor, one of `edge`, `application`, `domain`, `adapter`, or `infrastructure`; a value outside the set, or the attribute on a non-component anchor, is an envelope error.",
          context:
            "An optional one-token value on a `component:` anchor, in the token grammar of a role, naming its bounded context; on a non-component anchor it is an envelope error.",
          "declared component":
            "The `component:` anchor is the component's declaration; there is no separate architecture file, because the anchor sits where the component is realized.",
          "component realization convention":
            "A `component:` anchor that satisfies a Spec satisfies its seam's most-specific design Spec; that `satisfies` edge is the component's own realization claim. As guidance, checked by no validator: a component either satisfies its seam's design Spec or binds no Spec its members satisfy, and it never references one. Structural edges confer nothing (the architectural-annotation ruling, MD-38).",
          "structural anchor validity":
            "A `memberOf` source is an `impl:` or `api:` CodeNode and its target is a `component:` CodeNode; every structural target exists, every edge is unique, each source has at most one component, and structural self-reference is refused. A malformed or non-static structural field, an unknown `layer`, or `layer` or `context` on a non-component anchor refuses the whole anchor at reification; a graph-validly reified edge that later fails referential or structural validation remains visible with its anchor and independent `satisfies` binding. Multi-node `uses` cycles remain data and produce no finding.",
          "structural non-conferral":
            "Structural edges, `role`, `layer`, and `context` carry no intent, delivery fact, readiness effect, or binding-to-Spec traversal; no `implements` field is admitted.",
          "test anchor":
            "A binding in the `test:` namespace that derives one anchored `verifies` edge per target from a test to each Spec it verifies.",
          "oracle anchor":
            "A binding in the `oracle:` namespace that records an oracle's `models` target without deriving a delivery fact.",
          "executable binding boundary":
            "A resolving `specTest` anchor can establish verifier realization; a registrar activation or a `bindExample` call executes a generated contract but is not extracted graph data, so the graph cannot claim from that call alone that the contract is bound.",
          "document-realization binding":
            "When the realizing artifact is authored Markdown that cannot carry an extracted in-code anchor, the executable suite that asserts the shipped document may carry its code anchor. Its label must name the document realization rather than imply the test body is the product, and file-level blast radius remains coverage-unknown for the Markdown artifact.",
          "Protocol builder binding":
            "A builder import from the public Protocol package or its anchors subpath, or a relative import whose importer-relative resolution, including the TypeScript `.js`-to-`.ts` convention, canonicalizes to this package's `ids`, `anchors` or `model/code-anchor` module; consumer-local lookalike modules confer no binding authority. On the CommonJS package surface the trusted relative-module set is empty (`import.meta.url` is rewritten away), so relative bindings mint no anchors there while package imports stay trusted. The comment form needs no builder binding.",
          "untrusted builder":
            "A constant-form builder call whose import is no Protocol builder binding: it mints nothing and reports nothing, because a source file that never bound to the Protocol is not authoring drift to report.",
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
      design: {
        structuralValidator:
          "`conformance/structural-anchors`, the conformance error for graph structural-anchor violations; referential integrity and generic edge-contract errors keep their own diagnostic ownership.",
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
    readiness: "ready",
    file: "specs/model/structural-patterns.sdp.md",
    title: "Architecturally significant units are annotated where they are realized",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Annotate each architecturally significant unit on the anchor of the code that realizes it, with its role, its component's layer and bounded context, and the designs it references, and declare `uses` where a dependency is architectural, so the graph answers architecture questions from the code itself. Architectural significance adds no Spec kind, no node type, and no vocabulary registry.",
      },
      model: {
        terms: {
          "architecturally significant unit":
            "A code unit with exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand; export status or import rank alone is insufficient. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters may qualify. Its anchor records component membership, a role and `references` to the designs it answers to. An architectural dependency is declared as `uses`, normally between components; a unit's own `uses` is optional.",
          "structural attributes":
            "`role` on any code anchor; `layer` and `context` on a `component:` anchor; they describe the unit's architecture and carry no readiness or delivery fact, and the census renders their taxonomy from the graph.",
          "accepted set":
            "The set of architecturally significant units in a corpus is an owner-reviewed declaration, never derived from imports or exports; anchors are curated, never a coverage quota.",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.open-question-keys.keyed-question-resolves",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
          "An open question is prose, or an object with `question`, an optional `blocking` flag, an optional `key`, and the optional fields of spec:model.open-question-fields. A key matches `^[a-z][A-Za-z0-9]*$`, the entry-address key grammar, and is unique among the open questions of one Spec. An unkeyed question stays lawful and has no address.",
          "In the Markdown carrier the key follows the flag inside the marker, after one space and `#`, as in `- [blocking #aggregateReach] Does the owner widen the aggregate?` or `- [non-blocking #pageHome] Where does the page live?`. A marker whose key text is empty or off the grammar is refused with `open question keys must be lower-camel ASCII`, and a key that repeats an earlier key of the same Spec is refused with `open question keys must be unique`, each as the structure finding `extract/invalid-markdown-structure` at the line of the entry, and the carrier is refused whole as for every structure refusal.",
          'In the TypeScript carrier the key is the `key` property of the question object. A key that is not a string on the grammar, or that repeats an earlier key of the same Spec, is refused with the finding `extract/unrecognized-property` at severity error and the message `property "intent.openQuestions[<n>].key" is refused: open question keys must be lower-camel ASCII` or `property "intent.openQuestions[<n>].key" is refused: open question keys must be unique`, with `<n>` the zero-based position; only the key drops, and the question and the Spec stay.',
          "The serialized graph writes a question object's fields in the order `question`, `blocking`, `key`, `decider`, `links`, `provisional`, `trigger`, omitting an absent field. The import emitter writes a keyed question's marker as `[<flag> #<key>]` and its optional fields as one-line sub-items under it, so an object-form TypeScript question round-trips into Markdown.",
          "An entry address may name an open question as `spec:<id>#question.<key>`; it parses, is refused in every id slot, and resolves when the Spec exists and an open question carries the key. A missing question key is a prose-mentions error, so renaming or removing it fails validation where it is addressed.",
          "The open-question register reports each question's key, or null for an unkeyed question. The mention audit and entry search read the `question` address as they read a `design` or `ui` address, and entry search gives a keyed question's text the address `spec:<id>#question.<key>`.",
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
        ruleKeys: {
          keyGrammar: "rules[0]",
          markdownMarker: "rules[1]",
          questionAddress: "rules[4]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/model/open-question-keys.sdp.md",
  },
  {
    id: "spec:model.design-maturity",
    specKind: "model",
    altitude: "feature",
    readiness: "ready",
    file: "specs/model/design-maturity.sdp.md",
    title: "What a Spec's design carries is derived, beside its readiness",
    narrative:
      "The original design's `designed` stage meant a Spec's key concepts were settled before code (`docs/lineage/v0-design/01-core-primitives.md` §1.4 and §8). The Protocol's readiness describes the maturity of intent. The graph therefore derives what design a Spec carries beside readiness, without adding a rung, floor clause or delivery fact. A new rung would change the locked readiness values, a floor clause reading Design would close that section's shape, and a design fact would mix design with realization signals.",
    sections: {
      intent: {
        problem:
          "A reviewer or an implementer cannot tell from readiness alone which Specs carry a settled design and which carry only intent, and the first adopter's owner asked for Specs whose key concepts are designed as stubs before code.",
        outcome:
          "Show what design a Spec carries in values the graph derives, so the backlog and a review can tell a designed Spec from one that states only its intent.",
        assumptions: [
          "The design columns tell a Spec with pinned declarations and keyed entries from one that states only its intent.",
        ],
        openQuestions: [
          {
            question:
              "If the first adopter's design passes show that the design columns cannot distinguish settled design from intent alone, should this representation be revisited?",
            blocking: false,
            key: "designColumnsSufficiency",
            decider: "owner",
            provisional:
              "derive what design a Spec carries beside readiness without a new rung, floor clause or delivery fact",
          },
        ],
      },
      model: {
        terms: {
          "design columns":
            "The counts and lists the reader derives for a Spec beside its readiness under spec:consumers.pack-design; they are read on every pass and never stated.",
          "designed stage":
            "The original design's readiness stage for a Spec whose key concepts were settled; it is not a Protocol rung.",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.planned-architecture",
    specKind: "model",
    altitude: "feature",
    readiness: "ready",
    file: "specs/model/planned-architecture.sdp.md",
    title: "Components are designed ahead of their code",
    narrative:
      "The original design declared a component before its code, as a Component node with a layer, a bounded context and a capability, kept in an architecture folder and reconciled with its code anchors and the Specs (`docs/lineage/v0-design/03-graph-metamodel.md` §2.5; `04-authoring-surfaces.md` §7). Its runtime chapter separated what a unit requires from the provider that supplies it, the provider a composition root selects and the one a test puts in its place, and gave one mechanism the ownership of runtime composition (`05-runtime-anchors.md` §1, §3.3, §7).\n\nThe Protocol records the architecture the code realizes. A `component:` anchor states its layer and context, and anchored `memberOf` and `uses` edges join the code units. Under the architectural annotation decision, a component no code realizes is a Spec, and the graph holds no node for it until an anchor exists. The first adopter states its component list and its context rule in prose (`libar-platform/design/PLAN.md` §2.1) and checks context isolation over anchored `uses` in its own script (`libar-platform/design/tools/check.py`). The owner ruled that the architectural annotation decision stands: a component designed before its code is a component design Spec, and the `component:` anchor that later realizes it satisfies that Spec, which is the join a comparison reads.\n\nChoosing a provider stays prose. The original's distinctions between the interface a unit requires, the providers that supply it, the one a composition root selects and the one a test substitutes help a reader, and none of them needs graph structure beyond `uses` to be compared. Keeping one composition mechanism per application is a corpus's own architecture rule when the corpus wants it, stated in a `constraint` Spec and checked by its own corpus rule. A component design names its component with the keys a component anchor uses, so the comparison reads the same words on both sides, and a key the design leaves out is not compared, so a design states only what it has decided; a design that has decided its component uses nothing says `none`, which a left-out key cannot say.",
    sections: {
      intent: {
        problem:
          "A design ahead of its code cannot state the components it adds, their layer and context and what they use, in a form the graph compares with the components the code later anchors.",
        outcome:
          "Let a design name the components it will add, with their layer, context and uses, and compare that design with the anchored components once code exists.",
        risks: [
          "A planned component kept apart from its realization is a second place for the component to drift, which is why the architectural annotation decision refused a separate architecture file and why the design lives in a Spec the realizing anchor satisfies.",
        ],
      },
      model: {
        terms: {
          "component design":
            "A Spec that states a component the code does not yet realize and what it is for. Its Design entries are keyed as the anchor's attributes are named: `id` for the planned `component:` anchor's own id, `layer`, `context`, `uses` for the components it will use, and optionally `role`. The keys are a convention recipes read; the Protocol closes no Design shape, and the Spec confers nothing and mints no code unit.",
          "planned component":
            "The component a component design names. It stays intent until a `component:` anchor realizes it, and that anchor satisfies the component design; the graph holds no component node before the anchor exists.",
          "realization comparison":
            "Recipe 43, planned against realized components, which reads each component design beside the `component:` anchor that satisfies it, resolving members through `memberOf` as recipe 32 does, and lists a design no anchor satisfies yet, a layer, context or role that differs, and a `uses` named on one side only. It reports and refuses nothing.",
          provider:
            "A code unit that supplies an interface another unit requires; a composition selects one provider for each requirement, and a test may select another. A component design names its providers and that selection in prose, and none of them earns graph structure beyond `uses`.",
        },
      },
      design: {
        componentDesign:
          "a Spec is a component design when its Design `id` value, bare or in the code span that opens it, is a `component:` id; the curation report and the realization comparison select designs this way, and no validator reads the convention.",
        designKeys:
          "the comparison reads five Design keys, `id`, `layer`, `context`, `role` and `uses`, and no other; `layer` takes one of the five layers, `context` and `role` one token on the role grammar, and `uses` either `none` for the empty list or `component:` ids separated by commas, each trimmed, read as the set of distinct ids; each value is read bare when it is the whole value, or from the code span that opens it, with prose after the span free to say why.",
        comparisonRecipe:
          "recipe 43, planned against realized components, takes no parameter, so any parameter name returns `{ unknownParams, accepts: [] }` alone, as every catalog recipe answers a name it does not take; otherwise it returns `{ totals, unrealized, differing, unreadable }`, where `totals` is `{ designs, realized, matching, unrealized, differing, unreadable }`, `matching` counts the realized designs with neither a differing row nor an unreadable row, and `differing` counts rows.",
        realizedWhen:
          "a design is realized when its `component:` CodeNode is anchored and has an anchored `satisfies` edge to the design, as the curation report reads it; a design whose component exists without that edge stays unrealized, with `anchorExists: true`.",
        comparedFields:
          "for a realized design, each of `layer`, `context`, `role` and `uses` the design states is compared with the anchored component, and a key the design leaves out is not compared; the realized `uses` are the components other than its own that an anchored `uses` edge from the component or one of its members reaches, each end resolved to its component as recipe 32 resolves it.",
        comparisonRows:
          "`unrealized` rows are `{ spec, componentId, anchorExists, layer, context, role, uses }` with the planned values, null when unstated, and `uses` an empty list when the design states `none`; `differing` rows are `{ spec, componentId, field, planned, realized }`, one for each differing field, where `layer`, `context` and `role` carry the two values or null and `uses` carries the two sorted lists of components named on that side only; `unreadable` rows are `{ spec, key, value }` for a value outside its key's form, and that key is not compared; rows sort by `spec`, then by `field` or `key`.",
      },
      behavior: {
        exampleSpace: {
          given: [
            'a component design for {componentId:string} that plans the layer {plannedLayer:"domain"|"application"} and uses {plannedUses:string}',
            'the component anchor for that design {anchor:"is absent"|"satisfies the design"}',
            'that anchor states the layer {realizedLayer:"domain"|"application"|"absent"} and its member uses {realizedUses:string}',
          ],
          when: ["the realization comparison runs"],
          then: [
            "the comparison lists {unrealized:number} unrealized designs, {matching:number} matching designs and {differing:number} differing rows",
            "the differing fields are {fields:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.open-question-fields",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/open-question-fields.sdp.md",
    title:
      "An open question may name who decides it, its links, a provisional reading and a re-entry trigger",
    narrative:
      "The original design gave an open question an owner and a list of links to decision records, discussions and tickets, beside its text and its blocking flag (`docs/lineage/v0-design/01-core-primitives.md` §2.1). A question key gives a question an address and nothing more, so the first adopter keeps the rest beside the graph. Its decision register (`libar-platform/design/decisions/register.json`, described in `design/advisors/register.md`) records for each open decision its sources, who decides it as a class (`tactical`, `delegated` or `owner`) and an advisor lens, the provisional reading the design proceeds on, and a lean. It also records a status, the work unit it blocks, dates and who checked the lean. This Spec captures the part that states something about the question and leaves the work record outside.\n\nA TypeScript open-question list that cannot be read statically drops whole, blocking questions included. A failure under one of the four fields is an error, because the fields arrived with no carrier relying on a lossy reading; a failure in a question's text, its blocking flag or the list itself keeps the warning every other non-static TypeScript section property gives.",
    sections: {
      intent: {
        problem:
          "A question's text and blocking flag do not say who settles it, what it rests on, or what the design assumes until it is settled, so an adopter keeps a register beside the graph that repeats each question.",
        outcome:
          "Let an open question carry who decides it, the sources it rests on, the reading the design proceeds on and, on a deferral, what brings it back, without a status.",
        risks: [
          "A field for who decides invites fields for when and for what state the question is in, which would rebuild a workflow tracker inside the Spec.",
        ],
      },
      behavior: {
        rules: [
          "An open question may carry four optional fields beside its text, flag and key, namely who decides it, the links it rests on, its provisional reading and its re-entry trigger; a question without them stays lawful.",
          "Who decides a question names the person, role or body whose ruling settles it. It authorizes nothing, gates no edit, and no validator compares it with the author of a change.",
          "Who decides a question is one lowercase kebab token the corpus owns, on the grammar a role uses, such as `owner` or `delegated`. The graph holds no person or role to point at, so the value references nothing, and the Protocol ships no list of values.",
          "In the Markdown carrier the four fields ride labelled sub-items indented under the question's own line, `decider:`, `links:`, `provisional:` and `trigger:`, each at most once and each one line, so the question line stays as authored. They are the only indented field lines the body grammar admits, and the TypeScript carrier carries the same four fields on the question object.",
          "In the TypeScript carrier, a value under any of the four fields that cannot be read statically is an extraction error at that field, and the Spec's whole open-question list drops with it.",
          "In the TypeScript carrier, a question text or blocking flag that cannot be read statically, or a spread in the list, drops the Spec's whole open-question list, blocking questions included, with the lossy warning `extract/non-static-section`; only a failure under the four fields is an error.",
          "A link is a Spec id or an entry address the question rests on, and nothing else. Each is checked as a mention is: a missing target or entry is an error, and a target with no declared relation either way raises the `conformance/prose-mentions` warning for that pair. A link mints no relation, and a document outside the graph is named in the question's text as prose, because the graph holds no identity for it to resolve.",
          "The provisional reading is one line stating what the design assumes while the question is open. It is intent, never a ruling.",
          "A question carries at most one provisional line. A worked proposal for settling it is a decision Spec whose Decision section holds its decision, context, rationales, alternatives and consequences, stated at the rung its record earns. Each shaped Spec names it through `decidedBy`, so a decision below `defined` holds that Spec below `ready` under the typed-dependency floor.",
          "A re-entry trigger is one line naming what brings a deferred Spec back, such as a named reader the shipped views do not serve. It sits on the blocking question that holds the deferral, and the open-question register reports questions that carry one apart from design holds, so no reader tells the two apart by their wording.",
          "An open question carries no status, date, blocked work unit or record of who checked it. A settled question leaves the Spec, a ruling that passes the ADR three-part test lands as a decision Spec the shaped Specs name through `decidedBy`, and the rest of the history stays in git and in the adopter's own records.",
          "Whether a question holds the readiness floor stays its `[blocking]` flag alone; none of the four fields moves a floor.",
        ],
        ruleKeys: {
          fieldFailureError: "rules[4]",
          droppedListWarning: "rules[5]",
        },
        exampleSpace: {
          given: [
            'a TypeScript Spec carrier whose blocking open question meets {construct:"a non-static question text"|"a non-static blocking flag"|"a spread in the list"}',
          ],
          when: ["the extractor reifies the carrier"],
          then: [
            'the extractor reports {findingId:string} at severity {severity:"warning"|"error"}',
            "the Spec stays in the graph with {questionCount:number} open questions",
          ],
        },
        description:
          "The world writes one TypeScript carrier for a story-altitude rule Spec stating `idea`, with a title, an Intent outcome, one rule and an open-question list holding one blocking question. Every value is static apart from the construct the point names: a question text or blocking flag written as a function call, or a spread of another list beside the question.",
      },
      design: {
        subItemLine:
          "a field is one line of exactly two spaces, `- `, a label from `decider`, `links`, `provisional` and `trigger`, a colon, a space and the value, directly under its question's line or a sibling field; any other indented line stays refused, as is a field under an entry that is not an open question.",
        questionObject:
          "the open question object carries optional `decider`, `links` as a list of strings in authored order, `provisional` and `trigger` fields, each absent when the author wrote none; the TypeScript carrier writes the same fields.",
        linksValue:
          "`links:` takes a comma-separated list, as an anchor comment's target tags do, non-empty and with no repeat.",
        fieldFindings:
          "an unknown or repeated label, an empty value, a `decider` off the token grammar, and a `trigger` on a non-blocking question are conformance errors at the field's line.",
        fieldLocations:
          "each carrier that records entry lines records a row per field present, `question[<i>].decider`, `question[<i>].links`, `question[<i>].provisional` or `question[<i>].trigger`; a link finding reads the `links` row, and a line the carrier did not record stays absent.",
        linkResolution:
          "each link is checked as a mention is, at the field's line, by the same validator and with the same two findings.",
        registerColumns:
          "the open-question register (recipe 20) reports the four fields on each row, marks a question carrying a trigger as a deferral, and counts deferrals and holds apart.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.open-question-fields.dropped-list-warns",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/open-question-fields.dropped-list-warns.sdp.md",
    title: "A TypeScript question list that cannot be read drops whole with a warning",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the lossy drop on a blocking question whose text is not static, so the question leaves the graph with only a warning.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a TypeScript Spec carrier whose blocking open question meets {construct: "a non-static question text"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the extractor reports {findingId: "extract/non-static-section"} at severity {severity: "warning"}',
              "the Spec stays in the graph with {questionCount: 0} open questions",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.rule-keys",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/rule-keys.sdp.md",
    title: "A rule or flow entry may carry a key that addresses it",
    narrative:
      "The original design gave a behavior rule an optional id, so the rule could later be promoted to a Spec of its own, and an optional rationale (`docs/lineage/v0-design/01-core-primitives.md` §2.2). The Protocol kept promotion and dropped the id. An unkeyed rule has no address, so a review finding, a register row or an example cannot name it; a key gives it an address. Open questions carry optional keys on the entry-address key grammar; this Spec follows that pattern for rules.",
    sections: {
      intent: {
        problem:
          "An inline rule has no identity but its position and its text, so anything outside the Spec that cites one rule breaks silently when the rules above it move or the rule is reworded.",
        outcome:
          "Let an author key a rule or flow entry, so a review, a register row or an example can name the entry it is about.",
      },
      behavior: {
        rules: [
          "Every entry of a Spec's primary behavior owner may carry an optional key on the open-question key grammar: the `rule:` and `flow:` entries of Behavior, the entries of Rule and Contract, and the entries and `rule:` entries of Workflow. One Spec keeps one key namespace across them, unique among its keyed entries, and an unkeyed entry stays lawful and has no address.",
          "A key sits in a marker at the start of the entry's text, after the `rule:` or `flow:` label where the entry has one, as in `- rule: [#graphOnly] The Studio is a projection.` and `- [#oneFamily] Every validator belongs to one family.`, the shape an open question's marker uses, so one form serves labelled and plain entries.",
          "Every keyed entry is addressed as `spec:<id>#rule.<key>` whatever its section, because a Spec uses one primary behavior owner. The address resolves while the Spec carries an entry with that key and fails validation in every Spec that names it once the key is renamed or removed.",
          "A rule address is refused in every id slot, as every entry address is, so no anchor targets a rule and no delivery fact attaches to one.",
          "An example names the keyed rules it exercises on its `verifies` relation: the target is an object with `target` and `exercises`, a list of the verified Spec's rule keys, beside an optional `reason`. A key the verified Spec does not carry is a conformance error at the relation, as a missing entry address is. The list mints no edge and confers no delivery fact, so `verifies` stays whole-Spec, and a rule-coverage recipe reads it to report which keyed rules a bound example exercises and which none does.",
          "A keyed entry carries its key and its text and nothing else; why a rule holds is the Spec's narrative, or a decision Spec named through `decidedBy` when the why passes the ADR three-part test.",
          "A keyed rule promoted to a Spec of its own leaves its address behind, because promotion moves the content out, and every mention of that address fails until it names the new Spec.",
        ],
      },
      design: {
        keyMarker:
          "`[#<key>]` and one space open the entry's text, after `rule: ` or `flow: ` where the entry has a label, with the key on the open-question key grammar, `^[a-z][A-Za-z0-9]*$`; text that opens with `[#` and does not match is refused at its line, and a marker later in the text is plain text.",
        ruleKeysField:
          "`behavior.rules` and `behavior.flows` are lists of strings with the marker removed, and `behavior.ruleKeys` maps each key to the entry it names, `rules[<i>]` or `flows[<i>]`, in authored order; a Spec with no keyed entry carries no `ruleKeys`, and the frozen projections read the rule text unchanged.",
        carrierSpelling:
          "the TypeScript carrier writes the same marker at the start of a rule or flow string, and the Gherkin carrier at the start of a `Rule:` line's text, so one normalization after reification reads all three carriers.",
        duplicateKey:
          "a key repeated across one Spec's rules and flows is a conformance error at each site, as a repeated question key is; rule keys and question keys address different sections, so the two namespaces stay apart.",
        ruleLocations:
          "the location table records every rule and flow entry, keyed or not, as `rule[<i>]` or `flow[<i>]` with `key` beside a keyed entry, from each carrier that records its line.",
        exercisesAttribute:
          "`verifies: { target: <spec id>, exercises: [<key>] }`, with an optional `reason`, is lawful on a declared `verifies` only; the graph's declared `verifies` edge carries `exercises` in authored order, an anchored `verifies` from a test anchor carries none, and `exercises` on any other relation type is refused.",
        gherkinExercises:
          "`@exercises.<key>` on an ordinary Scenario names a rule of the Spec the Scenario verifies, by default its Feature, once per key; a Scenario that verifies more than one Spec and exercises a rule is authored in Markdown.",
        ruleCoverage:
          "recipe 34, rule coverage, takes `params.spec` or `params.pack` and returns `{ totals: { keyedRules, exercised, unexercised, unkeyedRules }, rows }`, one row per keyed rule `{ address, line, exercisedBy: [{ example, enabled }] }`, with an empty `exercisedBy` for a rule no example exercises.",
        ruleAddress:
          "`spec:<id>#rule.<key>` resolves through `ruleKeys`; address resolution (recipe 25) reads `rule` as a fourth section and returns the entry's text, file and line, and entry search (recipe 23) matches rule keys as it matches Design keys.",
        exercisesValidator:
          "`conformance/rule-exercises`, a conformance error for an off-contract `exercises` list or a rule key absent from the verified Spec.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.relation-reasons",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/relation-reasons.sdp.md",
    title: "An authored relation may carry its reason",
    narrative:
      "The original design let a relation say why it holds: a rationale on `refines`, a strength on `dependsOn`, an aspect on `constrainedBy` and a reason on `supersedes` (`docs/lineage/v0-design/01-core-primitives.md` §4; `04-authoring-surfaces.md` §1.3). The Protocol's relations carry a type, a target and a claim; a relation without a reason leaves the explanation of why a Spec rests on another in narrative prose a reader has to find. The prose-ownership decision gives free prose a typed owner; this Spec gives a relation's reason its home on that relation.\n\nThe first adopter meets the reverse case. When its mention audit reported Spec pairs named in prose with no relation behind them, it declared the relations that were missing dependencies and kept the rest as prose, each listed with a one-line reason no typed relation fits (`libar-platform/docs/feedback/sdp-feedback-01.md`, \"The mention warnings were mostly missing edges\"; `libar-platform/design/tools/prose-mentions.json`). A reason on a relation says why an edge holds; a listed mention reason says why none does.",
    sections: {
      intent: {
        problem:
          "A reviewer reading a relation cannot see why it holds, and a reviewer reading a mention left as prose cannot tell an intended pointer from a forgotten dependency without a list kept outside the graph.",
        outcome:
          "Let an author say in one line why a Spec refines, depends on, is constrained by, is decided by or supersedes another, beside the relation itself.",
      },
      behavior: {
        rules: [
          "An authored relation may carry one optional reason, a single line of prose owned by that relation from that Spec to that target.",
          "One optional reason serves every relation type. No strength, aspect or other attribute rides a relation, except the rule keys an example's `verifies` lists, which the rule-coverage recipe reads.",
          "A reason is intent, as its relation is; it confers no delivery fact, moves no readiness floor and changes nothing its edge confers, and a relation without one stays lawful.",
          "In the envelope a relation target is a plain Spec id or an object with `target` and optional `reason`; a declared `verifies` object may also carry `exercises`. A target-only object reads as the plain id, plain ids and objects may mix in one relation, and no target is written twice. The TypeScript carrier passes the same reason beside the target.",
          "A reason on `supersedes` says what the newer decision replaces, and a reason on a `refines` from one decision to another says which part of the older decision the newer one narrows.",
          "A reason reaches readers with its relation through the graph, so a projection or a recipe reads it from the edge and never from the carrier.",
          "A mention left as prose carries no reason in the Spec. A corpus may keep the mentions it intends as rows of `from`, `to` and `reason` beside its Specs and pass them to the mention audit as a parameter; the audit reports the pairs a row matches apart from the rest, each with its reason, and lists the rows that match no current pair, while the validator reads no such list and its warning stands.",
        ],
      },
      design: {
        envelopeTarget:
          "a relation target is a Spec id or `{ target: <spec id>, reason: <one line> }`, the two mixing in one list and a single target taking either form; a declared `verifies` object may also carry `exercises`, and an object with another key, an empty reason, or a reason on two lines is refused; an object carrying only `target` reads as the plain id.",
        builderArgument:
          "each TypeScript relation builder takes an optional second argument, `dependsOn(target, { reason })`, with `verifies(target, { reason, exercises })` also taking the rule keys, and a builder called without it writes a plain declared relation.",
        edgeReason:
          "an authored graph edge carries an optional `reason`, and the reader's relation ends carry it; the guarantees recipe (3), dependency footing (21), the planning slice (19) and the decision register (31) show it beside the relation.",
        gherkinRelations:
          "no Gherkin form is invented for a relation reason, because relation tags carry no prose; a Spec that needs one is authored in Markdown or TypeScript.",
        intendedMentions:
          "the mention audit (recipe 22) takes `params.intended`, rows `{ from, to, reason }` keyed by Spec ids, and returns `intended`, the unbacked pairs a row matches with its reason, kept apart from the remaining pairs, and `staleIntended`, the rows that match no current pair.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.term-addresses",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/term-addresses.sdp.md",
    title: "A Model term may carry a key that addresses it",
    narrative:
      "A Model section defines a Spec's terms, and prose names those terms by word. A word is not a checked entry address, so a view cannot resolve it to one authored definition, and a renamed term leaves every sentence that names it silently stale. Design, UI, question and rule entries already carry keys that a mention addresses and validation checks; a key gives a Model term the same. The key is authored in a marker, as a rule's is, rather than derived from the term: a derived key would change, and break every address, whenever the term is reworded. The address segment is `term`, because an address names the kind of entry it reaches, as `question` and `rule` do, and the Model section's own prose is not an entry. The ratified glossary stays a document, beside the graph and outside it, so its terms gain no address; a term gains one where a Spec defines it.",
    sections: {
      intent: {
        problem:
          "Prose that names a concept a Model section defines has no checked way to point at that definition, so a view cannot link it and a renamed term breaks its readers silently.",
        outcome:
          "Let a Model term carry a key, addressed as `spec:<id>#term.<key>`, so prose cites a concept as a checked mention and every view links it exactly.",
      },
      behavior: {
        description:
          "The world writes two carriers in one extraction root. The first is a story-altitude model Spec stating `scoped`, with an Intent outcome and a Model section holding the entries the terms slot joins with a semicolon and a space, in the carrier the slot names: in Markdown one line each, as written, and in TypeScript a `.sdp.ts` carrier whose `model.terms` object maps each entry's term to its definition, marker included. The second is a Markdown story-altitude rule Spec stating `idea`, with an Intent outcome and one rule; its narrative names the address, and it declares `dependsOn` on the first. A finding read is the first extraction finding, and an empty slot value means the extraction reports none; the term keys of every Spec in the graph are joined by a comma and a space. `resolved` is true when address resolution gives the address a resolving row whose `value` is the definition without its marker and whose `file` and `line` are those of the term's row in the location table. `found` is true when entry search for the words of the term that carries the address's key returns a row with that address and that line. The audit reason is the `reason` of the mention audit's unresolved row for the address, and empty when it lists none. The import reads the first carrier as written in TypeScript: the world imports it to Markdown, reads the emitted Model entry of its first term, extracts the imported carrier in a fresh root, and compares its term keys and definitions with the TypeScript graph's.",
        rules: [
          "A Model term may carry an optional key in a marker that opens its definition, after the bold term and the em dash, as in `- **step key** — [#stepKey] the key a step carries`; the TypeScript carrier writes the same marker at the start of the definition string. The key follows the entry-address key grammar, and an unkeyed term stays lawful and has no address. Importing a TypeScript carrier to Markdown writes the marker on the term that carries the key.",
          "The key is authored and never derived from the term, so rewording a term or its definition keeps its address, while renaming or removing the key fails validation in every Spec that addresses it.",
          "A term key is unique among the Model terms of one Spec. Term keys and the Spec's Design, UI, question and rule keys sit under different address segments and stay apart.",
          "A definition that opens with `[#` and does not continue as a marker is refused at its term, and a repeated term key is refused at each term that carries it; a refused Markdown carrier is refused whole, as for every structure refusal, and in the TypeScript carrier the key drops at each site and the Spec stays.",
          "A keyed term is addressed as `spec:<id>#term.<key>`. The address parses, is refused in every id slot as every entry address is, and resolves while the Spec's `model.termKeys` carries the key; a mention of a term key the Spec does not carry is a prose-mentions error.",
          "The ratified glossary stays a document, so its terms gain no address; a term gains one where a Spec defines it in a Model section.",
          "The location table records every Model term its carrier locates, keyed or not, as `term[<i>]`, with `<i>` the term's position among the Spec's terms in authored order and `key` beside a keyed term.",
          "Address resolution resolves a `term` address to the term's definition with its file and line, entry search gives a keyed term its address and matches term keys as it matches rule keys, and the mention audit reports a term key the Spec does not carry as a missing entry.",
          "A term key mints no edge, confers no delivery fact and moves no readiness floor, and `exercises` names rule keys only. A term promoted to a `model` Spec of its own leaves its address behind, because promotion moves the content out, and every mention of the address fails until it names the new Spec.",
        ],
        ruleKeys: {
          termMarker: "rules[0]",
          authoredKey: "rules[1]",
          uniqueTermKeys: "rules[2]",
          markerRefusals: "rules[3]",
          termAddress: "rules[4]",
          termLocations: "rules[6]",
          termReaders: "rules[7]",
        },
        exampleSpace: {
          given: [
            'a {carrier:"Markdown"|"TypeScript"} Spec carrier {specId:string} whose Model terms read {terms:string}',
            "a second Spec that names {address:string} in its narrative and declares dependsOn on the first",
          ],
          when: ["the extractor reifies both carriers and the graph is validated"],
          then: [
            "the first carrier is reified: {reified:boolean}",
            "the first extraction finding's message contains {extractMessage:string}",
            "the graph holds the term keys {keys:string}",
            "the report holds {mentionErrors:number} prose-mention errors",
            "address resolution resolves the address to the marker-free definition at its recorded term location: {resolved:boolean}",
            "entry search for the addressed term's words finds it at that same address and line: {found:boolean}",
            "the mention audit lists the address as unresolved with reason {auditReason:string}",
            "the first carrier imported to Markdown writes the entry {importedEntry:string} and keeps its term keys and definitions: {keptOnImport:boolean}",
          ],
        },
      },
      design: {
        termMarker:
          '`- **<term>** — [#<key>] <definition>` is a keyed Model entry in Markdown and `terms: { "<term>": "[#<key>] <definition>" }` in TypeScript; `<key>` matches `^[a-z][A-Za-z0-9]*$`, and a marker later in the definition is plain text.',
        termKeysField:
          "`model.termKeys` maps each key to the term it names, as authored, in authored order; the definitions hold the text with the marker removed; a Spec with no keyed term carries no `termKeys`, and the serialized graph writes it after `terms`.",
        markerRefusal:
          "`term key markers must be [#<lower-camel ASCII key>] followed by one space and text` is the message, as the finding `extract/unrecognized-property` at severity error, at path `model.terms.<term>`.",
        repeatedKey:
          '`term key "<key>" is repeated; term keys must be unique within a Spec` is the message, as the same finding, at each term that carries the key.',
        addressSections:
          '`ENTRY_ADDRESS_SECTIONS` is `["design", "ui", "question", "rule", "term"]`, and `parseId` refuses any other segment with `entry address must be <section>.<key> with section design, ui, question, rule, or term`.',
        missingTerm:
          '`Mention in "<spec>" at <path> points to missing entry "term.<key>" of "<target>".` is the prose-mentions error for a term key the target does not carry.',
        termLocation:
          "`{ spec, file, entry: \"term[<i>]\", key?, line }` is a term's row in the location table; a mention in a definition, at `model.terms.<term>`, takes that row's line.",
        resolutionRow:
          "address resolution (recipe 25) reads `term` through `model.termKeys`; a resolving row gives the marker-free definition as `value` and its recorded file and line. A `section` or `entry` miss gives the available term keys sorted in code-unit order. The grammar text is `spec:<id>#<section>.<key>, section design, ui, question, rule, or term; key lower-camel ASCII`.",
        searchRow:
          "entry search (recipe 23) gives a matching keyed term, in section `model` and entry `terms.<term>`, the address `spec:<id>#term.<key>` and the line of its `term[<i>]` row, matches the term key as it matches a rule key, and never walks `termKeys` as content.",
        importEmitter:
          "the TypeScript-to-Markdown import writes a keyed term as `- **<term>** — [#<key>] <definition>`, so a keyed TypeScript term imports keyed.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:model.term-addresses.keyed-term-resolves",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/term-addresses.keyed-term-resolves.sdp.md",
    title: "A keyed term is reified and its address resolves",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the term marker and the term address on one keyed term beside an unkeyed one, and show that address resolution and entry search find the term at the line the location table records.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepKey] the key a step carries in its marker; - **slot** — one typed placeholder in a step"}',
              'a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: true}",
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the graph holds the term keys {keys: "stepKey"}',
              "the report holds {mentionErrors: 0} prose-mention errors",
              "address resolution resolves the address to the marker-free definition at its recorded term location: {resolved: true}",
              "entry search for the addressed term's words finds it at that same address and line: {found: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.term-addresses.unknown-term-key-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/term-addresses.unknown-term-key-refused.sdp.md",
    title: "An address that names a term key no term carries is an error",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the missing-entry error on a term address whose key the target no longer carries, after the key was renamed and the address was not.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepLabel] the key a step carries in its marker"}',
              'a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: true}",
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the graph holds the term keys {keys: "stepLabel"}',
              "the report holds {mentionErrors: 1} prose-mention errors",
              'the mention audit lists the address as unresolved with reason {auditReason: "entry"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.term-addresses.repeated-term-key-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/term-addresses.repeated-term-key-refused.sdp.md",
    title: "A term key repeated in one Spec refuses its carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the uniqueness refusal, and show that the address then names a missing Spec.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepKey] the key a step carries in its marker; - **term key** — [#stepKey] the key a Model term carries in its marker"}',
              'a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: false}",
              'the first extraction finding\'s message contains {extractMessage: "is repeated; term keys must be unique within a Spec"}',
              'the graph holds the term keys {keys: ""}',
              "the report holds {mentionErrors: 1} prose-mention errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.term-addresses.malformed-term-marker-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/term-addresses.malformed-term-marker-refused.sdp.md",
    title: "A term marker whose key is off the grammar refuses its carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the marker refusal on a definition that opens with a marker whose key is not lower-camel ASCII.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#step-key] the key a step carries in its marker"}',
              'a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: false}",
              'the first extraction finding\'s message contains {extractMessage: "term key markers must be [#<lower-camel ASCII key>] followed by one space and text"}',
              'the graph holds the term keys {keys: ""}',
              "the report holds {mentionErrors: 1} prose-mention errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.term-addresses.typescript-term-imports-keyed",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/term-addresses.typescript-term-imports-keyed.sdp.md",
    title: "A keyed TypeScript term keeps its address through import to Markdown",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the term marker in the TypeScript carrier: a keyed definition string is reified with its key, its address resolves, and importing the carrier to Markdown writes the marker and extracts to the same term keys and definitions.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {carrier: "TypeScript"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepKey] the key a step carries in its marker"}',
              'a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first',
            ],
            when: ["the extractor reifies both carriers and the graph is validated"],
            then: [
              "the first carrier is reified: {reified: true}",
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the graph holds the term keys {keys: "stepKey"}',
              "the report holds {mentionErrors: 0} prose-mention errors",
              'the first carrier imported to Markdown writes the entry {importedEntry: "- **step key** — [#stepKey] the key a step carries in its marker"} and keeps its term keys and definitions: {keptOnImport: true}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.planned-architecture.unrealized-design",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/planned-architecture.unrealized-design.sdp.md",
    title: "A component design no anchor satisfies is listed as unrealized",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the realization comparison on one component design whose component no anchor realizes yet.",
        assumptions: [
          "The world writes a probe root holding one story-altitude model Spec stating `idea` with an Intent outcome, one Model term and a Design section whose `id`, `layer` and `uses` entries carry the slots' planned values, bare. Beside it the root holds comment-form anchors for `component:probe.kernel` and `component:probe.audit`, each with one `impl:` member. The world runs the comparison's shipped recipe file through `sdp q --json`; the differing fields are the `field` values of the `differing` rows joined by a comma and a space, in answer order, and an empty string names none.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a component design for {componentId: "component:probe.history"} that plans the layer {plannedLayer: "domain"} and uses {plannedUses: "component:probe.kernel"}',
              'the component anchor for that design {anchor: "is absent"}',
              'that anchor states the layer {realizedLayer: "absent"} and its member uses {realizedUses: ""}',
            ],
            when: ["the realization comparison runs"],
            then: [
              "the comparison lists {unrealized: 1} unrealized designs, {matching: 0} matching designs and {differing: 0} differing rows",
              'the differing fields are {fields: ""}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.planned-architecture.differing-layer-and-uses",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/planned-architecture.differing-layer-and-uses.sdp.md",
    title: "A realized component that differs from its design gives one row per field",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the realization comparison on one realized component whose layer and uses differ from its design.",
        assumptions: [
          "The world writes the probe root of the unrealized-design example and adds a comment-form anchor for the planned component that satisfies the design Spec and states the realized layer, with one `impl:` member whose anchor `uses` the member of the component the realized-uses slot names.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a component design for {componentId: "component:probe.history"} that plans the layer {plannedLayer: "domain"} and uses {plannedUses: "component:probe.kernel"}',
              'the component anchor for that design {anchor: "satisfies the design"}',
              'that anchor states the layer {realizedLayer: "application"} and its member uses {realizedUses: "component:probe.audit"}',
            ],
            when: ["the realization comparison runs"],
            then: [
              "the comparison lists {unrealized: 0} unrealized designs, {matching: 0} matching designs and {differing: 2} differing rows",
              'the differing fields are {fields: "layer, uses"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.planned-architecture.matching-design",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/model/planned-architecture.matching-design.sdp.md",
    title: "A realized component that matches its design gives no row",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the realization comparison on one realized component whose layer and uses match its design.",
        assumptions: [
          "The world writes the probe root of the differing example, with the realized layer and uses the slots give.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a component design for {componentId: "component:probe.history"} that plans the layer {plannedLayer: "domain"} and uses {plannedUses: "component:probe.kernel"}',
              'the component anchor for that design {anchor: "satisfies the design"}',
              'that anchor states the layer {realizedLayer: "domain"} and its member uses {realizedUses: "component:probe.kernel"}',
            ],
            when: ["the realization comparison runs"],
            then: [
              "the comparison lists {unrealized: 0} unrealized designs, {matching: 1} matching designs and {differing: 0} differing rows",
              'the differing fields are {fields: ""}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
