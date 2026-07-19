import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { extract, validateGraph } from "../src/index.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const expectedSpecs = [
  {
    id: "spec:carrier.markdown-authoring",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/markdown-authoring.sdp.md",
    title: "Markdown authoring enters the one graph",
    narrative: null,
    sections: {
      intent: {
        outcome: "Author new Protocol Specs in Markdown without creating a second truth path.",
      },
      behavior: {
        rules: [
          "Markdown and TypeScript carriers feed the same reification and graph-derivation path.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:carrier.envelope-contract",
    specKind: "contract",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/envelope-contract.sdp.md",
    title: "The Markdown envelope is explicit and bounded",
    narrative: null,
    sections: {
      intent: {
        outcome: "Make a Markdown Spec's identity and descriptors deterministic to reify.",
      },
      behavior: {
        rules: [
          "A Markdown Spec declares id, kind, altitude, readiness, and relations in bounded YAML frontmatter; its first H1 declares title.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.markdown-parser",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/markdown-parser.sdp.md",
    title: "The product parser reifies the ruled Markdown subset",
    narrative: null,
    sections: {
      intent: {
        problem: "Prevent carrier-specific graph and validation paths from diverging.",
        outcome: "Reify authored Markdown without a second graph or validation path.",
        value: "Markdown-carried intent remains subject to the Protocol's deterministic checks.",
      },
      behavior: {
        rules: [
          "The parser accepts only the ruled heading grammar and excludes one malformed carrier while continuing healthy siblings.",
          "The ruled Markdown parser has bounded finding-class parity with the TypeScript carrier for `extract/non-static-envelope`, `extract/invalid-id`, `extract/duplicate-id`, `extract/reserved-property`, `extract/unowned-prose`, and `extract/unrecognized-property`; the shared validator ID is the claim, while severity and extract-versus-refuse outcomes remain carrier-specific.",
          "Named non-claim — `extract/parse-error` remains distinct because YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.",
          "Named non-claim — `extract/non-static-section` remains distinct because TypeScript degrades optional section properties while Markdown refuses malformed documents whole.",
          "Named non-claim — `extract/unrecognized-statement` remains distinct because Markdown owns prose and structures, not TypeScript statement recognition.",
          "Named non-claim — `extract/misplaced-authoring` remains distinct because Markdown has no executable authoring-call surface.",
        ],
      },
      verification: {
        mode: "executable",
        criteria: [
          "`test/extract-parity.test.ts` executes the settled finding-class parity matrix, including the six same-class findings, their carrier-specific outcomes, and four named non-claims.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.sdp-import",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/carrier/sdp-import.sdp.md",
    title: "TypeScript-carried Specs can become Markdown twins",
    narrative: null,
    sections: {
      intent: {
        actor: "A coding agent or maintainer.",
        outcome:
          "Convert a TypeScript-carrier Spec into an idiomatic `.sdp.md` twin beside its source.",
        value:
          "The TypeScript DSL survives as an import source while Markdown becomes the authored twin.",
      },
      behavior: {
        rules: [
          "Import writes the emitted Markdown sibling beside the TypeScript carrier and never deletes the source carrier.",
          "Import refuses an existing Markdown sibling rather than overwriting it.",
          "Refusal outcomes retain the TypeScript reifier findings and add import-local findings honestly.",
          "Import consumes the TypeScript reifier so source acceptance follows one validation path.",
          "A batch scans only bounded source directories, canonicalizes physical carrier identity, and computes every refusal and target collision before publishing any sibling.",
          "Publication prepares exclusive temporary siblings and atomically creates targets without clobbering; rollback attempts every artifact, reports survivors, and never deletes a TypeScript source.",
        ],
        exampleSpace: {
          given: ["a TS-carrier spec"],
          when: ["importTypeScriptSpec runs"],
          [["t", "hen"].join("")]: ["the emitted Markdown re-parses to an equal graph"],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.sdp-import.round-trip",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/sdp-import.round-trip.sdp.md",
    title: "A TypeScript carrier survives import as an equal Markdown graph",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the import round-trip against a TypeScript-carrier fixture.",
      },
      behavior: {
        examples: [
          {
            given: ["a TS-carrier spec"],
            when: ["importTypeScriptSpec runs"],
            [["t", "hen"].join("")]: ["the emitted Markdown re-parses to an equal graph"],
          },
        ],
      },
      verification: {
        mode: "executable",
        criteria: [
          "The bound test runs `assertAuthoredRoundTrip` against the import behavior fixture.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.prose-ownership-rule",
    specKind: "rule",
    altitude: "story",
    readiness: "defined",
    file: "specs/carrier/prose-ownership-rule.sdp.md",
    title: "Every prose edge has one owner",
    narrative: null,
    sections: {
      intent: { outcome: "Keep free prose in the graph without ambiguous attachment." },
      behavior: {
        rules: [
          "Narrative lives before the first H2; descriptions live only under their owning singular sections; unowned prose is refused.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:protocol.self-hosting",
    specKind: "behavior",
    altitude: "epic",
    readiness: "defined",
    file: "specs/protocol/self-hosting.sdp.md",
    title: "The Protocol authors and validates itself",
    narrative:
      "The Protocol's own delivery model exercises the same carrier, graph, checks, and projections offered to consumers.",
    sections: {
      intent: { outcome: "Prove the Protocol can carry its own intended truth honestly." },
      behavior: {
        rules: [
          "All authored carriers derive one regenerable graph through one validation path.",
          "Self-hosting remains deterministic in a clean clone.",
        ],
      },
    },
    deliveryFacts: [],
  },
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
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.excludes",
    specKind: "rule",
    altitude: "feature",
    readiness: "defined",
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
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:decisions.exclusion-contract",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/exclusion-contract.sdp.md",
    title: "Consumer exclusions stay exact",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep consumer-selected omissions precise and unsurprising.",
      },
      decision: {
        context: "Exclusion input crosses from a consumer into canonical source discovery.",
        decision: "Consumers declare exclusions as exact root-relative POSIX path prefixes.",
        rationale: [
          "Semantic globbing and path normalization are rejected because they make an omission broader or different from the path the consumer supplied.",
        ],
        consequences: [
          "A prefix excludes only itself and slash-delimited descendants; malformed paths, including Windows-drive absolutes, are refused.",
        ],
      },
    },
    deliveryFacts: [],
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
    readiness: "defined",
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
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:extraction.executable-contracts",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
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
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:extraction.build-pipeline",
    specKind: "workflow",
    altitude: "feature",
    readiness: "defined",
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
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.readiness-floor",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/readiness-floor.sdp.md",
    title: "Stated readiness must clear its floor",
    narrative: null,
    sections: {
      intent: { outcome: "Refuse maturity claims that their authored evidence does not support." },
      behavior: {
        rules: [
          "A Spec may state a readiness only when every clause in that readiness floor passes.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.sdp.md",
    title: "Duplicate carrier IDs are excluded loudly",
    narrative: null,
    sections: {
      intent: { outcome: "Prevent ambiguous authored identity from entering the graph." },
      behavior: {
        rules: [
          "If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.",
        ],
        exampleSpace: {
          given: [
            "a {firstCarrier:string} carrier declares {specId:string}",
            "a {secondCarrier:string} carrier declares {specId:string}",
          ],
          when: ["the extraction root is read"],
          [["t", "hen"].join("")]: [
            "both sites report {findingId:string}",
            "no graph node is emitted for {specId:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids.dual-carrier",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.dual-carrier.sdp.md",
    title: "TypeScript and Markdown duplicates are both refused",
    narrative: null,
    sections: {
      intent: { outcome: "Execute the duplicate-ID rule across both carrier surfaces." },
      behavior: {
        examples: [
          {
            given: [
              'a {firstCarrier: "TypeScript"} carrier declares {specId: "spec:fixture.duplicate"}',
              'a {secondCarrier: "Markdown"} carrier declares {specId: "spec:fixture.duplicate"}',
            ],
            when: ["the extraction root is read"],
            [["t", "hen"].join("")]: [
              'both sites report {findingId: "extract/duplicate-id"}',
              'no graph node is emitted for {specId: "spec:fixture.duplicate"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
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
    id: "spec:decisions.plain-language-references",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/plain-language-references.sdp.md",
    title: "Durable references lead with meaning",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep design rationale readable without decoding registries.",
      },
      decision: {
        context: "Decision codes are useful lookup keys but poor standalone prose.",
        decision:
          "Durable references lead with plain-language meaning; decision codes follow parenthetically when useful.",
        rationale: ["Meaning survives registry churn."],
        consequences: ["AGENTS and plans lead with names."],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.concept-docs-dissolve",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/concept-docs-dissolve.sdp.md",
    title: "Concept documents may dissolve after executable truth lands",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep intended truth authoritative while allowing exposition to shrink.",
      },
      decision: {
        context: "Concept documents currently carry both laws and unsettled representation.",
        decision:
          "Concept documents may dissolve only after their semantic contract is carried by executable Specs and lean registries.",
        rationale: ["Executable truth is easier to validate and consume."],
        consequences: ["Deletion is later work, never part of phase 1."],
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
        },
      },
    },
    deliveryFacts: ["implemented"],
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
    readiness: "defined",
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
          "An ID uses a lowercase namespace and dotted path, with an optional single `#` sub-part; referential-integrity checks reject malformed or unresolved references.",
          "IDs carry no history: a rename is a repository edit recorded by git rather than graph-resident bookkeeping.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
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
    readiness: "defined",
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
          "Protocol builder binding":
            "A builder import from the public Protocol package, or a relative import whose importer-relative resolution — including the TypeScript `.js`-to-`.ts` convention — canonicalizes to this package's `ids` or `model/code-anchor` module; consumer-local lookalike modules confer no binding authority. On the CommonJS package surface the trusted relative-module set is empty (`import.meta.url` is rewritten away), so relative bindings mint no anchors there while package imports stay trusted.",
          anchor:
            "A human-written source binding from one code location to one Spec ID, carrying identity, an optional label, and one target only.",
          "anchor-constant form":
            "The top-level const builder call that the MVP extractor reifies; decorator and JSDoc forms remain unextracted representations.",
          "code anchor":
            "An implementation-flavored binding that derives an anchored satisfies edge.",
          "oracle anchor":
            "A binding that records an oracle's models target without deriving a delivery fact.",
          "test anchor":
            "A binding that derives an anchored verifies edge from a test to its target Spec.",
        },
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:validation.two-check-families",
    specKind: "rule",
    altitude: "feature",
    readiness: "defined",
    file: "specs/validation/two-check-families.sdp.md",
    title: "Validation separates well-formedness from non-pretending",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep the graph trustworthy by checking conformance and honesty without judging content quality or enforcing workflow.",
      },
      behavior: {
        rules: [
          "Every validator belongs to either the conformance family, which checks meta-model well-formedness, or the honesty family, which rejects authored or overstated derived truth.",
          "Validation errors fail the build; gaps and orphans remain informative signals rather than delivery-process gates.",
          "Types enforce structural shape, schema validates graph payloads, and graph validators enforce cross-file conformance and honesty; no one layer substitutes for the others.",
          "All graph validation runs through the one derived graph path: source, extraction, graph, then checks.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:validation.referential-integrity",
    specKind: "rule",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/referential-integrity.sdp.md",
    title: "Every graph reference resolves",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep derived graph relationships trustworthy by refusing references to absent nodes.",
      },
      behavior: {
        rules: [
          "Every edge endpoint and every Pack model reference must resolve to a node in the derived graph; an unresolved reference is a conformance error.",
          "The realizing validator entrypoint is `checkReferentialIntegrity` in `src/validate/validators.ts`.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.claim-separation",
    specKind: "rule",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/claim-separation.sdp.md",
    title: "Graph claims and contracts stay distinct",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Preserve the graph's declared, anchored, and inferred distinctions while keeping its typed contracts lawful.",
      },
      behavior: {
        rules: [
          "Node and edge types, claims, descriptors, and relation endpoint contracts must use their ratified forms; the claim taxonomy never collapses.",
          "The realizing validator entrypoint is `checkClaimSeparation` in `src/validate/validators.ts`.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.verification-linkage",
    specKind: "rule",
    altitude: "feature",
    readiness: "defined",
    file: "specs/validation/verification-linkage.sdp.md",
    title: "Declared verification resolves to a performing trace",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep verification relationships meaningful by requiring declared test and oracle traces to resolve to their enabled bindings.",
      },
      behavior: {
        rules: [
          "A declared verifies relation and an oracle model relation must resolve through their respective binding traces before either can stand as verification evidence.",
          "The realizing validator entrypoints are `checkVerifiesLinkage` and `checkOracleLinkage` in `src/validate/validators.ts`.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.pack-coherence",
    specKind: "rule",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/pack-coherence.sdp.md",
    title: "Packs are coherent aggregates",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep review aggregates coherent without treating them as truth-bearing delivery artifacts.",
      },
      behavior: {
        rules: [
          "Pack membership must not repeat a Spec, and every modelRef must resolve to a model-kind Spec.",
          "The realizing validator entrypoint is `checkPackCoherence` in `src/validate/validators.ts`.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.authored-honesty",
    specKind: "rule",
    altitude: "feature",
    readiness: "defined",
    file: "specs/validation/authored-honesty.sdp.md",
    title: "Machine truth is never authored",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep derived graph truth trustworthy by rejecting any authored substitute for machine-derived claims or facts.",
      },
      behavior: {
        rules: [
          "Specs and Packs must not author derived edges, claims, or delivery facts, and any stated delivery facts must equal the graph's recomputed facts.",
          "The realizing validator entrypoints are `checkAuthoringShape` and `checkDeliveryFacts` in `src/validate/validators.ts`.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.warn-level-signals",
    specKind: "rule",
    altitude: "feature",
    readiness: "defined",
    file: "specs/validation/warn-level-signals.sdp.md",
    title: "Missing connective evidence warns without failing",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Surface graph conditions that need attention without turning informative delivery signals into workflow gates.",
      },
      behavior: {
        rules: [
          "Orphaned Specs and ready Specs lacking a resolving verifier are warnings, not validation errors.",
          "The realizing validator entrypoints are `checkOrphans` and `checkGaps` in `src/validate/validators.ts`.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.projections-model",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/consumers/projections-model.sdp.md",
    title: "Projections fan out from one graph without becoming truth stores",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give agents and humans consumer-specific views while preserving the repository as the only canonical source.",
      },
      model: {
        terms: {
          baseline:
            "A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.",
          "curated graph":
            "The authored architectural read model of declared intent and anchored bindings, valued for editorial sparsity.",
          curation:
            "The deliberate difference between the sparse curated graph and the code-structure surface; it is not drift.",
          discipline:
            "A lens or projection that filters or groups Specs by kind or section; it is not a phase to pass through.",
          "measured curation":
            "In a measured comparison, the curated graph selected from single-digit to about one quarter of the mechanical impact-graph surface.",
          "impact graph":
            "A separately derived code-structure surface for exhaustive usage and blast-radius questions, valued for exhaustiveness and never promoted into architecture.",
          "phase / iteration / milestone":
            "Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.",
          projection:
            "A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.",
          reader:
            "The thin typed front door that decodes graph joins and taxonomy once, returns composable data, and persists nothing.",
          release: "A tagged set surfaced as a git-tag projection.",
        },
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:consumers.agent-surface",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/consumers/agent-surface.sdp.md",
    title: "Agents script a visible typed graph",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let an agent obtain and compose graph context without rebuilding joins or navigating a fixed verb wall.",
      },
      behavior: {
        rules: [
          "The agent surface exposes a visible, self-describing typed graph through the CLI; the schema is the contract and agents script the graph directly.",
          "The reader constructs decoded joins and claim taxonomy once, then returns plain composable data without persisting graph state.",
          "Entry adapters bridge strings, files, and changesets to curated graph context; file-level blast radius names coverage-unknown files rather than implying exhaustive reach.",
          "Context efficiency is an empirical result: a measured comparison may show structured graph context uses fewer supplied tokens than a comparable raw-text workflow while preserving the task-relevant result.",
          "Measured evidence: a multi-probe agent comparison used about one fifth of the tokens of a comparable grep or verb-API workflow while preserving task-relevant conclusions.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:consumers.design-review",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/consumers/design-review.sdp.md",
    title: "Design Review renders graph context without becoming a gate",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give a human a regenerable, contextual view for deciding how to state readiness without recording approval as graph truth.",
      },
      behavior: {
        rules: [
          "Design Review renders a Spec or Pack in context with relations, bindings, delivery badges, design questions, and findings from the graph.",
          "The review is a pure projection that resolves through ordinary source edits, git, and conformance checks; it stores no findings and writes no canonical source.",
          "A human may use the review context when stating readiness, while validators check only the structural readiness floor and never record or require review approval.",
          "The MVP view is deterministic generated Markdown with an index and pages for Specs and Packs; richer visual representations remain outside this behavior.",
          "Rendering encodes by Markdown syntax context: prose and table fields escape structural characters, fenced JSON preserves authored keys and values through JSON encoding, and inline code uses a delimiter that preserves literal backticks.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:consumers.reader",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/consumers/reader.sdp.md",
    title: "The reader bridges agent entry points to composable graph context",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let agents enter the curated graph from the strings, files, and changesets they already have without rebuilding its joins or taxonomy.",
      },
      behavior: {
        rules: [
          "`createReader` constructs a fresh thin typed loader that decodes graph joins, claims, delivery facts, derived readiness, and validation findings once, then returns plain composable data without persisting state.",
          "`findByConcept` and `byFile` bridge strings and extraction-root-relative files to the graph's recorded context.",
          "The reader's `blastRadius` surface maps changed files to directly impacted Specs and Packs, their explicit one-hop at-risk neighbors, and every coverage-unknown file.",
          "File-level blast radius reports curated graph reach without claiming exhaustive symbol-level usage reach.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:consumers.edit-model",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/consumers/edit-model.sdp.md",
    title: "Views compose scoped intent instead of patching canonical source",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a view frame a requested change without giving derived surfaces a direct write path to canonical source.",
      },
      behavior: {
        rules: [
          "A view composes scoped intent, bounded by a Spec, its neighbors, a Pack, or open questions, and hands that intent to an agent.",
          "The agent edits source as a human would, git records the ordinary edit, and the same conformance and honesty checks evaluate it.",
          "Lifecycle changes such as splitting, combining, refining, or deleting are ordinary source and git edits rather than structured patches from a derived view.",
          "No single realizing entrypoint exists for intent composition; this defined behavior records design intent and has no code anchor or verifier.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.one-validation-path",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/one-validation-path.sdp.md",
    title: "Validation follows one graph",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep conformance and honesty checks aligned with the source the graph actually represents.",
      },
      decision: {
        context:
          "Source can be statically reified without matching what an executing import would evaluate.",
        decision:
          "Validators consume the derived graph through one path: source, extraction, graph, then checks.",
        rationale: [
          "A parallel import-time validation path can approve values absent from the graph.",
        ],
        consequences: [
          "Typed authoring feedback and extraction findings remain distinct from graph validation rather than becoming a second validator.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.sdp-ts-extension",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/sdp-ts-extension.sdp.md",
    title: "Spec extensions identify the carrier without colliding with tests",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep authored Spec files recognizable to tools and safe beside ordinary test conventions.",
      },
      decision: {
        context:
          "A carrier filename must distinguish authored Specs from test files and remain useful when files are colocated.",
        decision:
          "Markdown Specs use `.sdp.md`; `.sdp.ts` names the surviving TypeScript DSL import source and lawful per-ID option.",
        rationale: [
          "Test-glob extensions and path-only conventions either misclassify Specs or hide their identity.",
        ],
        consequences: [
          "Carrier-specific tooling can target the compound extension without changing the `Spec` model name.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.point-per-example",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/point-per-example.sdp.md",
    title: "Each example binds one point",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep example-space coverage and outcome witnesses unambiguous while preserving compact authoring views.",
      },
      decision: {
        context: "A single example must remain one witness in its parent's typed example space.",
        decision:
          "An example binds exactly one point; table syntax may expand statically into sibling examples and renderers may project siblings as a table.",
        rationale: [
          "Point sets make concreteness and witness semantics conditional, while banning table sugar taxes a surface layer that can translate honestly.",
        ],
        consequences: [
          "The graph never stores multi-point examples even when a carrier offers tabular authoring.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.carrier-ruling",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/carrier-ruling.sdp.md",
    title: "Markdown is the default Spec carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give every Spec kind one readable canonical authoring surface without losing a lawful escape hatch.",
      },
      decision: {
        context:
          "The carrier must express all Spec kinds without creating an unbounded tooling obligation or a dual-source truth path.",
        decision:
          "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option.",
        rationale: [
          "An owned grammar and a permanent kind split both add surface cost without a demonstrated expressive gain, while retiring the DSL removes a useful bounded option.",
        ],
        consequences: [
          "Each ID has one canonical surface, and Markdown tooling is the default path for authored Specs.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.prose-ownership",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/prose-ownership.sdp.md",
    title: "Prose belongs to typed graph owners",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Preserve free prose for projections without making its attachment ambiguous or forcing consumers to re-parse files.",
      },
      decision: {
        context: "Document prose needs a stable graph home when section structure evolves.",
        decision:
          "Free prose is stored as a narrative or a description on its typed owner; unowned prose is refused.",
        rationale: [
          "File pointers force consumer re-parsing, while heading-path keys make churned document structure carry identity.",
        ],
        consequences: [
          "Prose remains graph content inside typed shapes and ambiguous attachment fails loudly.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.envelope-grammar-posture",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/envelope-grammar-posture.sdp.md",
    title: "The Protocol owns the envelope grammar",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep authored envelope meaning stable while retaining a replaceable parsing representation.",
      },
      decision: {
        context: "YAML parsing behavior alone cannot define the Protocol's authored contract.",
        decision:
          "The Protocol owns a bounded envelope grammar and parser policy; the pinned YAML library is a swappable representation behind that contract.",
        rationale: [
          "Permissive parsing lets library behavior define meaning, while an owned YAML parser recreates the rejected grammar-maintenance burden.",
        ],
        consequences: [
          "Unsupported YAML constructs are refused within explicit resource bounds instead of silently becoming carrier semantics.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.executable-meta-model",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/executable-meta-model.sdp.md",
    title: "The Protocol is an executable meta-model",
    narrative: null,
    sections: {
      intent: { outcome: "Make delivery intent conform to one typed, self-validating contract." },
      decision: {
        context: "Delivery tools can describe work without making their model executable.",
        decision:
          "The Protocol models authored Specs, Packs, and anchors in typed code, derives one graph, and checks conformance and honesty.",
        rationale: ["Executable specs alone and workflow tooling omit the meta-model contract."],
        consequences: [
          "The Protocol is deterministically validated without judging content quality or enforcing workflow.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.adopt-the-nouns",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/adopt-the-nouns.sdp.md",
    title: "Delivery nouns remain familiar without workflow gates",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep the Protocol legible to delivery practitioners without adopting a lifecycle machine.",
      },
      decision: {
        context:
          "Shared delivery vocabulary is useful, but process-state language hides epistemic distinctions.",
        decision:
          "The Protocol adopts established delivery nouns and rejects process state-machine and lifecycle gating.",
        rationale: [
          "Invented terminology taxes users, while workflow states reverse the Protocol's conformance-only boundary.",
        ],
        consequences: [
          "Terms must be concrete, unambiguous, and carry authored-versus-derived status where it matters.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.one-primitive",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/one-primitive.sdp.md",
    title: "One Spec carries named delivery coordinates",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Preserve one durable authored primitive while making familiar delivery forms precise.",
      },
      decision: {
        context:
          "Delivery statements vary by truth category, scope, and maturity without needing separate artifact types.",
        decision:
          "A Spec is enriched in place with kind, altitude, and readiness; familiar delivery nouns are named coordinates on that primitive.",
        rationale: [
          "Separate types per coordinate combination multiply shapes and break enrich-in-place identity.",
        ],
        consequences: ["Domains and capabilities are projections or Packs, not extra altitudes."],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.protocol-naming",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/protocol-naming.sdp.md",
    title: "The meta-model is a software delivery protocol",
    narrative: null,
    sections: {
      intent: { outcome: "Name the product and its meta-layer without implying workflow control." },
      decision: {
        context:
          "The meta-layer needs a name that communicates a conformance contract rather than a process engine.",
        decision:
          "The product is the Libar Software Delivery Protocol, shortened to the Protocol; `sdp` names its CLI.",
        rationale: [
          "Protocol names an executable conformance contract more honestly than process while retaining process for the modeled activity.",
        ],
        consequences: [
          "Product, package, repository, and CLI names stay aligned around the Protocol.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.binding-not-liveness",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/binding-not-liveness.sdp.md",
    title: "Bindings state existence, not liveness",
    narrative: null,
    sections: {
      intent: {
        outcome: "Make realization signals useful without overstating what source bindings prove.",
      },
      decision: {
        context:
          "Anchors can resolve code and tests without proving reachability, execution, or approval.",
        decision:
          "Delivery facts record bindings and enabled verifier existence; coverage gaps and human readiness practice remain explicit without becoming graph facts.",
        rationale: [
          "Renaming useful delivery facts or recording approval primitives either weakens drift signals or reverses the one-primitive boundary.",
        ],
        consequences: [
          "Impact reports name coverage-unknown files and `ready` remains a declared statement above a structural floor.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.content-only-sections",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/content-only-sections.sdp.md",
    title: "Sections carry content while relations carry links",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep inline detail and promoted Specs from representing the same fact twice.",
      },
      decision: {
        context:
          "Behavior content can mature from prose to structured evidence or into a standalone matching-kind Spec.",
        decision:
          "Sections contain local content only; promotion moves content exclusively and relations state the linkage.",
        rationale: [
          "Reference unions and duplicate parent lists force consumers to branch and leave double-linkage drift legal.",
        ],
        consequences: [
          "Promoted children preserve readiness evidence through their own content and authored relations.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.typing-law",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/typing-law.sdp.md",
    title: "Floor-read sections are closed typed shapes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give authors guardrails exactly where readiness and honesty checks depend on section content.",
      },
      decision: {
        context: "A fixed list of typed sections becomes stale when the readiness floor evolves.",
        decision:
          "Every section read by a floor clause has a closed typed shape; unsettled design and ui surfaces remain open.",
        rationale: [
          "Closed shapes block authored-fact smuggling and provide useful authoring guidance without prematurely fixing unsettled surfaces.",
        ],
        consequences: [
          "A newly floor-read section becomes typed by the criterion, not by a frozen list.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.kind-conditional-floor",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/kind-conditional-floor.sdp.md",
    title: "Readiness evidence follows the Spec kind",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Make stated readiness structurally honest without turning the floor into a quota.",
      },
      decision: {
        context:
          "Kinds have different natural evidence, while structural maturity clauses apply across every Spec.",
        decision:
          "The readiness floor combines cumulative kind-blind clauses with one kind-conditional evidence clause at each rung.",
        rationale: [
          "Defined-only evidence and uniform evidence rules either leave padding legal or erase meaningful kind distinctions.",
        ],
        consequences: [
          "Floor rows are monotonic, promotion-neutral, and converge honestly where a kind has no stronger form.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.carried-evidence",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/carried-evidence.sdp.md",
    title: "Promoted evidence must carry its own evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Prevent empty promoted Specs and relation targets from satisfying an evidence floor.",
      },
      decision: {
        context:
          "Promotion and constraints preserve meaning only when the promoted target carries the matching kind evidence.",
        decision:
          "Promoted evidence counts only when the promoted Spec holds its natural evidence; authoring-shape honesty rejects authored delivery facts and external `doc:` targets remain deferred.",
        rationale: [
          "Counting empty children or wrong-kind constraints makes a structural floor pass without content, while readiness gates and premature external target types add the wrong contract.",
        ],
        consequences: [
          "The floor checks resolved target shape, and unresolved external decision links stay outside the current relation grammar.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.pack-reified",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/pack-reified.sdp.md",
    title: "Packs group review context without becoming truth",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let related Specs be reviewed together without introducing another truth-bearing artifact.",
      },
      decision: {
        context: "Delivery work needs a cross-cutting aggregate that is distinct from refinement.",
        decision:
          "A Pack declares membership and framing while stating no system truth; Specs may belong to many Packs.",
        rationale: [
          "Treating a Pack as a truth primitive or a refinement parent confuses grouping with authored intent.",
        ],
        consequences: [
          "Review context remains disposable while Spec relations retain semantic hierarchy.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.agent-surface-scripts-graph",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/agent-surface-scripts-graph.sdp.md",
    title: "Agents script the visible graph",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give agents composable graph context without a fixed command vocabulary becoming the model.",
      },
      decision: {
        context: "Agents need decoded context and entry adapters without rebuilding graph joins.",
        decision:
          "The typed graph is the visible contract and agents script it directly through a thin reader surface.",
        rationale: [
          "A verb wall duplicates graph semantics and hides composable data behind commands.",
        ],
        consequences: [
          "Entry adapters expose curated context while coverage gaps remain explicit rather than implied exhaustive.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.mcp-deferred",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/mcp-deferred.sdp.md",
    title: "MCP integration remains deferred",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Preserve a clean projection model without prematurely fixing an application integration surface.",
      },
      decision: {
        context:
          "The graph already supports typed agent and human projections without an MCP transport.",
        decision:
          "MCP integration is deferred until a concrete caller establishes its boundary and contract.",
        rationale: [
          "Adding an MCP surface without a caller invents verbs and persistence choices outside the projection model.",
        ],
        consequences: [
          "Consumers use the current graph and reader surfaces while MCP remains designed-in rather than claimed.",
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;

const expectedPackMembers = [
  "spec:carrier.markdown-authoring",
  "spec:carrier.envelope-contract",
  "spec:carrier.markdown-parser",
  "spec:carrier.sdp-import",
  "spec:carrier.sdp-import.round-trip",
  "spec:carrier.prose-ownership-rule",
  "spec:protocol.self-hosting",
  "spec:extraction.derive-graph",
  "spec:extraction.determinism",
  "spec:extraction.build-pipeline",
  "spec:extraction.excludes",
  "spec:extraction.claim-taxonomy",
  "spec:extraction.regenerability",
  "spec:extraction.schema-versioning",
  "spec:extraction.executable-contracts",
  "spec:validation.readiness-floor",
  "spec:validation.duplicate-ids",
  "spec:validation.two-check-families",
  "spec:validation.referential-integrity",
  "spec:validation.claim-separation",
  "spec:validation.verification-linkage",
  "spec:validation.pack-coherence",
  "spec:validation.authored-honesty",
  "spec:validation.warn-level-signals",
  "spec:consumers.projections-model",
  "spec:consumers.agent-surface",
  "spec:consumers.design-review",
  "spec:consumers.reader",
  "spec:consumers.edit-model",
  "spec:model.protocol-domain",
  "spec:model.core-model",
  "spec:model.spec-sections",
  "spec:model.relations",
  "spec:model.stable-ids",
  "spec:model.pack-aggregate",
  "spec:model.anchors",
  "spec:validation.duplicate-ids.dual-carrier",
  "spec:decisions.plain-language-references",
  "spec:decisions.concept-docs-dissolve",
  "spec:decisions.one-validation-path",
  "spec:decisions.sdp-ts-extension",
  "spec:decisions.point-per-example",
  "spec:decisions.carrier-ruling",
  "spec:decisions.prose-ownership",
  "spec:decisions.envelope-grammar-posture",
  "spec:decisions.exclusion-contract",
  "spec:decisions.executable-meta-model",
  "spec:decisions.adopt-the-nouns",
  "spec:decisions.one-primitive",
  "spec:decisions.protocol-naming",
  "spec:decisions.binding-not-liveness",
  "spec:decisions.content-only-sections",
  "spec:decisions.typing-law",
  "spec:decisions.kind-conditional-floor",
  "spec:decisions.carried-evidence",
  "spec:decisions.pack-reified",
  "spec:decisions.agent-surface-scripts-graph",
  "spec:decisions.mcp-deferred",
] as const;

const expectedDeclaredRelations = [
  ["spec:carrier.markdown-authoring", "dependsOn", "spec:carrier.markdown-parser"],
  ["spec:carrier.markdown-authoring", "decidedBy", "spec:decisions.sdp-ts-extension"],
  ["spec:carrier.markdown-authoring", "decidedBy", "spec:decisions.carrier-ruling"],
  ["spec:carrier.envelope-contract", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.envelope-contract", "decidedBy", "spec:decisions.envelope-grammar-posture"],
  ["spec:carrier.markdown-parser", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.markdown-parser", "dependsOn", "spec:carrier.envelope-contract"],
  ["spec:carrier.sdp-import", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.sdp-import.round-trip", "refines", "spec:carrier.sdp-import"],
  ["spec:carrier.sdp-import.round-trip", "verifies", "spec:carrier.sdp-import"],
  ["spec:carrier.prose-ownership-rule", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.prose-ownership-rule", "decidedBy", "spec:decisions.prose-ownership"],
  ["spec:protocol.self-hosting", "dependsOn", "spec:carrier.markdown-authoring"],
  ["spec:protocol.self-hosting", "dependsOn", "spec:model.protocol-domain"],
  ["spec:protocol.self-hosting", "decidedBy", "spec:decisions.concept-docs-dissolve"],
  ["spec:protocol.self-hosting", "decidedBy", "spec:decisions.executable-meta-model"],
  ["spec:protocol.self-hosting", "decidedBy", "spec:decisions.adopt-the-nouns"],
  ["spec:protocol.self-hosting", "decidedBy", "spec:decisions.protocol-naming"],
  ["spec:extraction.derive-graph", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.derive-graph", "constrainedBy", "spec:extraction.determinism"],
  ["spec:extraction.determinism", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.build-pipeline", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.build-pipeline", "dependsOn", "spec:extraction.derive-graph"],
  ["spec:extraction.excludes", "refines", "spec:extraction.derive-graph"],
  ["spec:extraction.excludes", "decidedBy", "spec:decisions.exclusion-contract"],
  ["spec:extraction.claim-taxonomy", "refines", "spec:extraction.derive-graph"],
  ["spec:extraction.regenerability", "refines", "spec:extraction.determinism"],
  ["spec:extraction.schema-versioning", "refines", "spec:extraction.derive-graph"],
  ["spec:extraction.executable-contracts", "refines", "spec:extraction.build-pipeline"],
  ["spec:validation.readiness-floor", "refines", "spec:protocol.self-hosting"],
  ["spec:validation.readiness-floor", "dependsOn", "spec:model.protocol-domain"],
  ["spec:validation.readiness-floor", "decidedBy", "spec:decisions.kind-conditional-floor"],
  ["spec:validation.readiness-floor", "decidedBy", "spec:decisions.carried-evidence"],
  ["spec:validation.duplicate-ids", "refines", "spec:protocol.self-hosting"],
  ["spec:validation.duplicate-ids", "dependsOn", "spec:carrier.markdown-parser"],
  ["spec:validation.duplicate-ids.dual-carrier", "refines", "spec:validation.duplicate-ids"],
  ["spec:validation.duplicate-ids.dual-carrier", "verifies", "spec:validation.duplicate-ids"],
  ["spec:validation.two-check-families", "refines", "spec:protocol.self-hosting"],
  ["spec:validation.two-check-families", "decidedBy", "spec:decisions.one-validation-path"],
  ["spec:validation.referential-integrity", "refines", "spec:validation.two-check-families"],
  ["spec:validation.claim-separation", "refines", "spec:validation.two-check-families"],
  ["spec:validation.verification-linkage", "refines", "spec:validation.two-check-families"],
  ["spec:validation.pack-coherence", "refines", "spec:validation.two-check-families"],
  ["spec:validation.authored-honesty", "refines", "spec:validation.two-check-families"],
  ["spec:validation.warn-level-signals", "refines", "spec:validation.two-check-families"],
  ["spec:consumers.projections-model", "refines", "spec:protocol.self-hosting"],
  ["spec:consumers.projections-model", "decidedBy", "spec:decisions.mcp-deferred"],
  ["spec:consumers.agent-surface", "refines", "spec:consumers.projections-model"],
  ["spec:consumers.agent-surface", "decidedBy", "spec:decisions.agent-surface-scripts-graph"],
  ["spec:consumers.design-review", "refines", "spec:consumers.projections-model"],
  ["spec:consumers.reader", "refines", "spec:consumers.agent-surface"],
  ["spec:consumers.edit-model", "refines", "spec:consumers.projections-model"],
  ["spec:model.protocol-domain", "refines", "spec:protocol.self-hosting"],
  ["spec:model.core-model", "refines", "spec:protocol.self-hosting"],
  ["spec:model.core-model", "decidedBy", "spec:decisions.one-primitive"],
  ["spec:model.spec-sections", "refines", "spec:model.core-model"],
  ["spec:model.spec-sections", "decidedBy", "spec:decisions.point-per-example"],
  ["spec:model.spec-sections", "decidedBy", "spec:decisions.content-only-sections"],
  ["spec:model.spec-sections", "decidedBy", "spec:decisions.typing-law"],
  ["spec:model.relations", "refines", "spec:model.core-model"],
  ["spec:model.stable-ids", "refines", "spec:model.core-model"],
  ["spec:model.pack-aggregate", "refines", "spec:model.core-model"],
  ["spec:model.pack-aggregate", "decidedBy", "spec:decisions.pack-reified"],
  ["spec:model.anchors", "refines", "spec:model.core-model"],
  ["spec:model.anchors", "decidedBy", "spec:decisions.binding-not-liveness"],
  ["spec:decisions.plain-language-references", "refines", "spec:protocol.self-hosting"],
  ["spec:decisions.concept-docs-dissolve", "refines", "spec:protocol.self-hosting"],
  ["spec:decisions.one-validation-path", "refines", "spec:validation.two-check-families"],
  ["spec:decisions.sdp-ts-extension", "refines", "spec:carrier.markdown-authoring"],
  ["spec:decisions.point-per-example", "refines", "spec:model.spec-sections"],
  ["spec:decisions.carrier-ruling", "refines", "spec:carrier.markdown-authoring"],
  ["spec:decisions.prose-ownership", "refines", "spec:carrier.prose-ownership-rule"],
  ["spec:decisions.envelope-grammar-posture", "refines", "spec:carrier.envelope-contract"],
  ["spec:decisions.exclusion-contract", "refines", "spec:extraction.excludes"],
  ["spec:decisions.executable-meta-model", "refines", "spec:protocol.self-hosting"],
  ["spec:decisions.adopt-the-nouns", "refines", "spec:protocol.self-hosting"],
  ["spec:decisions.one-primitive", "refines", "spec:model.core-model"],
  ["spec:decisions.protocol-naming", "refines", "spec:protocol.self-hosting"],
  ["spec:decisions.binding-not-liveness", "refines", "spec:model.anchors"],
  ["spec:decisions.content-only-sections", "refines", "spec:model.spec-sections"],
  ["spec:decisions.typing-law", "refines", "spec:model.spec-sections"],
  ["spec:decisions.kind-conditional-floor", "refines", "spec:validation.readiness-floor"],
  ["spec:decisions.carried-evidence", "refines", "spec:validation.readiness-floor"],
  ["spec:decisions.pack-reified", "refines", "spec:model.pack-aggregate"],
  ["spec:decisions.agent-surface-scripts-graph", "refines", "spec:consumers.agent-surface"],
  ["spec:decisions.mcp-deferred", "refines", "spec:consumers.projections-model"],
] as const;

const expectedWarnings = [] as const;

const expectedAnchors = [
  {
    id: "impl:protocol.extract",
    nodeType: "CodeNode",
    label: "extracts authored carriers and bindings into one graph",
    type: "satisfies",
    target: "spec:extraction.derive-graph",
    file: "src/extract/index.ts",
    constant: "extractAnchor",
    site: "export function extract",
  },
  {
    id: "impl:protocol.derive-graph",
    nodeType: "CodeNode",
    label: "derives the graph from reified carriers and bindings",
    type: "satisfies",
    target: "spec:extraction.derive-graph",
    file: "src/extract/derive.ts",
    constant: "deriveGraphAnchor",
    site: "export function deriveGraph",
  },
  {
    id: "test:protocol.extract",
    nodeType: "Anchor",
    label: "extraction contracts verify graph derivation",
    type: "verifies",
    target: "spec:extraction.derive-graph",
    file: "test/extract.test.ts",
    constant: "extractContractTestAnchor",
    site: 'describe("anchor extraction corpora",',
  },
  {
    id: "test:protocol.extraction-determinism",
    nodeType: "Anchor",
    label: "clean-repo pipeline determinism verifies byte-identical output",
    type: "verifies",
    target: "spec:extraction.determinism",
    file: "test/cli.test.ts",
    constant: "cleanRepoDeterminismTestAnchor",
    site: 'it("clean-repo determinism: the full pipeline at a different absolute path is byte-identical"',
  },
  {
    id: "impl:protocol.readiness-floor",
    nodeType: "CodeNode",
    label: "evaluates the stated readiness floor against the graph",
    type: "satisfies",
    target: "spec:validation.readiness-floor",
    file: "src/validate/readiness-floor.ts",
    constant: "readinessFloorAnchor",
    site: "export function evaluateReadinessFloor",
  },
  {
    id: "test:protocol.readiness-floor",
    nodeType: "Anchor",
    label: "readiness-floor contracts verify stated maturity",
    type: "verifies",
    target: "spec:validation.readiness-floor",
    file: "test/readiness.test.ts",
    constant: "readinessFloorTestAnchor",
    site: 'describe("readiness and validation contracts",',
  },
  {
    id: "impl:protocol.markdown-authoring",
    nodeType: "CodeNode",
    label: "reifies Markdown authoring into the one carrier path",
    type: "satisfies",
    target: "spec:carrier.markdown-authoring",
    file: "src/extract/markdown.ts",
    constant: "markdownAuthoringAnchor",
    site: "export function reifyMarkdownCarrier",
  },
  {
    id: "impl:protocol.markdown-parser",
    nodeType: "CodeNode",
    label: "reifies the ruled Markdown parser input",
    type: "satisfies",
    target: "spec:carrier.markdown-parser",
    file: "src/extract/markdown.ts",
    constant: "markdownParserAnchor",
    site: "export function reifyMarkdownCarrier",
  },
  {
    id: "test:protocol.markdown-parser",
    nodeType: "Anchor",
    label: "Markdown reifier tests verify the ruled parser",
    type: "verifies",
    target: "spec:carrier.markdown-parser",
    file: "test/markdown-reifier.test.ts",
    constant: "markdownParserTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.envelope-contract",
    nodeType: "CodeNode",
    label: "parses the bounded Markdown frontmatter envelope",
    type: "satisfies",
    target: "spec:carrier.envelope-contract",
    file: "src/extract/markdown.ts",
    constant: "envelopeContractAnchor",
    site: "export function parseMarkdownFrontmatter",
  },
  {
    id: "test:protocol.envelope-contract",
    nodeType: "Anchor",
    label: "frontmatter contract tests verify the Markdown envelope",
    type: "verifies",
    target: "spec:carrier.envelope-contract",
    file: "test/markdown-reifier.test.ts",
    constant: "envelopeContractTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.prose-ownership",
    nodeType: "CodeNode",
    label: "reads Markdown body content through its prose owners",
    type: "satisfies",
    target: "spec:carrier.prose-ownership-rule",
    file: "src/extract/markdown.ts",
    constant: "proseOwnershipAnchor",
    site: "export function readMarkdownBody",
  },
  {
    id: "test:protocol.prose-ownership",
    nodeType: "Anchor",
    label: "Markdown reifier tests verify prose ownership",
    type: "verifies",
    target: "spec:carrier.prose-ownership-rule",
    file: "test/markdown-reifier.test.ts",
    constant: "proseOwnershipTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.duplicate-id-exclusion",
    nodeType: "CodeNode",
    label: "excludes duplicated carrier ids from the graph",
    type: "satisfies",
    target: "spec:validation.duplicate-ids",
    file: "src/extract/index.ts",
    constant: "duplicateIdExclusionAnchor",
    site: "function findDuplicatedIds",
  },
  {
    id: "test:protocol.duplicate-ids.dual-carrier",
    nodeType: "Anchor",
    label: "dual-carrier duplicate-ID contract verifies carrier exclusion",
    type: "verifies",
    target: "spec:validation.duplicate-ids.dual-carrier",
    file: "test/self-hosting-duplicate-ids.test.ts",
    constant: "dualCarrierDuplicateTestAnchor",
    site: "bindExample(",
  },
  {
    id: "test:protocol.sdp-import.round-trip",
    nodeType: "Anchor",
    label: "TypeScript import round-trip contract preserves authored data",
    type: "verifies",
    target: "spec:carrier.sdp-import.round-trip",
    file: "test/self-hosting-sdp-import.test.ts",
    constant: "sdpImportRoundTripTestAnchor",
    site: "bindExample(",
  },
  {
    id: "impl:protocol.anchor-extraction",
    nodeType: "CodeNode",
    label: "anchor-constant reification seam",
    type: "satisfies",
    target: "spec:model.anchors",
    file: "src/extract/anchors.ts",
    constant: "anchorExtractionAnchor",
    site: "const ANCHOR_BUILDER_TARGET_FIELDS",
  },
  {
    id: "impl:protocol.anchor-model",
    nodeType: "CodeNode",
    label: "binding-only anchor model builders",
    type: "satisfies",
    target: "spec:model.anchors",
    file: "src/model/anchors.ts",
    constant: "anchorModelAnchor",
    site: "export function specTest",
  },
  {
    id: "impl:protocol.pack-aggregate",
    nodeType: "CodeNode",
    label: "Pack aggregate and model references",
    type: "satisfies",
    target: "spec:model.pack-aggregate",
    file: "src/model/pack.ts",
    constant: "packAggregateAnchor",
    site: "export function pack",
  },
  {
    id: "impl:protocol.spec-descriptors",
    nodeType: "CodeNode",
    label: "Spec kind, altitude, and readiness coordinates",
    type: "satisfies",
    target: "spec:model.core-model",
    file: "src/model/descriptors.ts",
    constant: "specDescriptorsAnchor",
    site: "export const SPEC_KIND_DISPLAY_LABELS",
  },
  {
    id: "impl:protocol.spec-primitive",
    nodeType: "CodeNode",
    label: "Spec envelope and enrich-in-place shape",
    type: "satisfies",
    target: "spec:model.core-model",
    file: "src/model/spec.ts",
    constant: "specPrimitiveAnchor",
    site: "export function spec",
  },
  {
    id: "impl:protocol.spec-relations",
    nodeType: "CodeNode",
    label: "declared Spec relation builders",
    type: "satisfies",
    target: "spec:model.relations",
    file: "src/model/relations.ts",
    constant: "specRelationsAnchor",
    site: "export function supersedes",
  },
  {
    id: "impl:protocol.spec-sections",
    nodeType: "CodeNode",
    label: "typed Spec section shapes",
    type: "satisfies",
    target: "spec:model.spec-sections",
    file: "src/model/sections.ts",
    constant: "specSectionsAnchor",
    site: "export interface SpecSections",
  },
  {
    id: "impl:protocol.stable-ids",
    nodeType: "CodeNode",
    label: "stable ID grammar parser",
    type: "satisfies",
    target: "spec:model.stable-ids",
    file: "src/ids.ts",
    constant: "stableIdsAnchor",
    site: "export function parseId",
  },
  {
    id: "impl:protocol.verifier-semantics",
    nodeType: "CodeNode",
    label: "readiness clauses over direct verification bindings",
    type: "satisfies",
    target: "spec:model.spec-sections",
    file: "src/validate/readiness-floor.ts",
    constant: "verifierSemanticsAnchor",
    site: "export function evaluateReadinessFloor",
  },
  {
    id: "impl:protocol.validation-families",
    nodeType: "CodeNode",
    label: "conformance and honesty validator registry",
    type: "satisfies",
    target: "spec:validation.two-check-families",
    file: "src/validate/validators.ts",
    constant: "validationFamiliesAnchor",
    site: "export const graphValidatorIds",
  },
  {
    id: "impl:protocol.projections-model",
    nodeType: "CodeNode",
    label: "pure generated projection page contract",
    type: "satisfies",
    target: "spec:consumers.projections-model",
    file: "src/projections/design-review.ts",
    constant: "projectionModelAnchor",
    site: "export interface DesignReviewPage",
  },
  {
    id: "impl:protocol.agent-surface",
    nodeType: "CodeNode",
    label: "typed graph reader and agent entry adapters",
    type: "satisfies",
    target: "spec:consumers.agent-surface",
    file: "src/reader/reader.ts",
    constant: "agentSurfaceAnchor",
    site: "export function createReader",
  },
  {
    id: "impl:protocol.reader-impact",
    nodeType: "CodeNode",
    label: "file-level reader blast-radius contract",
    type: "satisfies",
    target: "spec:consumers.reader",
    file: "src/reader/reader.ts",
    constant: "readerImpactAnchor",
    site: "export interface BlastRadius",
  },
  {
    id: "impl:protocol.reader",
    nodeType: "CodeNode",
    label: "thin typed graph reader construction",
    type: "satisfies",
    target: "spec:consumers.reader",
    file: "src/reader/reader.ts",
    constant: "readerAnchor",
    site: "export function createReader",
  },
  {
    id: "impl:protocol.design-review",
    nodeType: "CodeNode",
    label: "renders the contextual Design Review projection",
    type: "satisfies",
    target: "spec:consumers.design-review",
    file: "src/projections/design-review.ts",
    constant: "designReviewAnchor",
    site: "export function renderDesignReview",
  },
  {
    id: "impl:protocol.exclusion-surface",
    nodeType: "CodeNode",
    label: "strict root-relative exclusion input for both extraction surfaces",
    type: "satisfies",
    target: "spec:extraction.excludes",
    file: "src/extract/index.ts",
    constant: "exclusionSurfaceAnchor",
    site: "export interface ExtractOptions",
  },
  {
    id: "impl:protocol.graph-claims",
    nodeType: "CodeNode",
    label: "declares the graph claim taxonomy",
    type: "satisfies",
    target: "spec:extraction.claim-taxonomy",
    file: "src/graph/schema.ts",
    constant: "graphClaimsAnchor",
    site: "export const graphClaims",
  },
  {
    id: "impl:protocol.regenerability",
    nodeType: "CodeNode",
    label: "repeats graph and contract producers for deterministic regeneration",
    type: "satisfies",
    target: "spec:extraction.regenerability",
    file: "src/cli/build-command.ts",
    constant: "regenerabilityAnchor",
    site: "export function runBuild",
  },
  {
    id: "impl:protocol.schema-version",
    nodeType: "CodeNode",
    label: "declares the graph schema version",
    type: "satisfies",
    target: "spec:extraction.schema-versioning",
    file: "src/graph/schema.ts",
    constant: "schemaVersionAnchor",
    site: "export const schemaVersion",
  },
  {
    id: "impl:protocol.executable-contracts",
    nodeType: "CodeNode",
    label: "derives step and example-space contracts from the graph",
    type: "satisfies",
    target: "spec:extraction.executable-contracts",
    file: "src/codegen/contracts.ts",
    constant: "executableContractsAnchor",
    site: "export function generateContracts",
  },
] as const;

function lineContaining(source: string, token: string): number {
  const line = source.split("\n").findIndex((entry) => entry.includes(token));

  return line + 1;
}

describe("the self-hosting corpus", () => {
  it("derives the Markdown-canonical specs and their exact Pack checkpoint from the root", () => {
    // Given: the repository root with evidence and the worked example excluded from the authored model.
    const result = extract({
      root: repoRoot,
      exclude: ["explorations", "examples", "test/fixtures/import/parity"],
    });

    // When: the root corpus is reified through the public extractor.
    const nodeIds = result.graph.nodes.map((node) => node.id).sort();
    const primitiveNodes = result.graph.nodes.filter((node) => node.nodeType === "Primitive");
    const packNode = result.graph.nodes.find((node) => node.id === "pack:self-hosting-v1");

    // Then: the frozen corpus enters one graph with exact descriptors and its direct bindings.
    expect(result.report.findings).toEqual([]);
    expect(
      validateGraph(result.graph).findings.map(({ validatorId, family, severity, subjectId }) => ({
        validatorId,
        family,
        severity,
        subjectId,
      })),
    ).toEqual(expectedWarnings);
    expect(result.counts).toEqual({ specs: 58, packs: 1, anchors: 36 });
    expect(nodeIds).toEqual(
      [
        "pack:self-hosting-v1",
        "spec:carrier.envelope-contract",
        "spec:carrier.markdown-authoring",
        "spec:carrier.markdown-parser",
        "spec:carrier.prose-ownership-rule",
        "spec:carrier.sdp-import",
        "spec:carrier.sdp-import.round-trip",
        "spec:consumers.agent-surface",
        "spec:consumers.design-review",
        "spec:consumers.edit-model",
        "spec:consumers.projections-model",
        "spec:consumers.reader",
        "spec:decisions.concept-docs-dissolve",
        "spec:decisions.one-validation-path",
        "spec:decisions.sdp-ts-extension",
        "spec:decisions.point-per-example",
        "spec:decisions.carrier-ruling",
        "spec:decisions.prose-ownership",
        "spec:decisions.envelope-grammar-posture",
        "spec:decisions.exclusion-contract",
        "spec:decisions.executable-meta-model",
        "spec:decisions.adopt-the-nouns",
        "spec:decisions.one-primitive",
        "spec:decisions.protocol-naming",
        "spec:decisions.binding-not-liveness",
        "spec:decisions.content-only-sections",
        "spec:decisions.typing-law",
        "spec:decisions.kind-conditional-floor",
        "spec:decisions.carried-evidence",
        "spec:decisions.pack-reified",
        "spec:decisions.agent-surface-scripts-graph",
        "spec:decisions.mcp-deferred",
        "spec:decisions.plain-language-references",
        "spec:extraction.build-pipeline",
        "spec:extraction.claim-taxonomy",
        "spec:extraction.derive-graph",
        "spec:extraction.determinism",
        "spec:extraction.excludes",
        "spec:extraction.executable-contracts",
        "spec:extraction.regenerability",
        "spec:extraction.schema-versioning",
        "spec:model.anchors",
        "spec:model.core-model",
        "spec:model.pack-aggregate",
        "spec:model.protocol-domain",
        "spec:model.relations",
        "spec:model.spec-sections",
        "spec:model.stable-ids",
        "spec:protocol.self-hosting",
        "spec:validation.duplicate-ids",
        "spec:validation.duplicate-ids.dual-carrier",
        "spec:validation.authored-honesty",
        "spec:validation.claim-separation",
        "spec:validation.pack-coherence",
        "spec:validation.readiness-floor",
        "spec:validation.referential-integrity",
        "spec:validation.two-check-families",
        "spec:validation.verification-linkage",
        "spec:validation.warn-level-signals",
        ...expectedAnchors.map((anchor) => anchor.id),
      ].sort(),
    );
    expect(result.graph.nodes).toHaveLength(95);
    expect(
      primitiveNodes
        .map((node) => ({
          id: node.id,
          specKind: node.specKind,
          altitude: node.altitude,
          readiness: node.readiness,
          title: node.title,
          narrative: node.narrative ?? null,
          sections: node.sections,
          deliveryFacts: node.deliveryFacts ?? [],
          file: node.file,
        }))
        .sort((left, right) => left.id.localeCompare(right.id)),
    ).toEqual(
      [...expectedSpecs]
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((spec) => ({
          id: spec.id,
          specKind: spec.specKind,
          altitude: spec.altitude,
          readiness: spec.readiness,
          title: spec.title,
          narrative: spec.narrative,
          sections: spec.sections,
          deliveryFacts: spec.deliveryFacts,
          file: spec.file,
        })),
    );
    expect(
      result.graph.edges
        .filter((edge) => edge.claim === "declared" && edge.type !== "belongsTo")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual([...expectedDeclaredRelations].sort());
    expect(
      primitiveNodes.reduce<Record<string, number>>(
        (histogram, node) => ({
          ...histogram,
          [node.readiness]: (histogram[node.readiness] ?? 0) + 1,
        }),
        {},
      ),
    ).toEqual({ defined: 51, ready: 7 });
    expect(
      result.graph.edges
        .filter((edge) => edge.type === "belongsTo")
        .map((edge) => [edge.from, edge.to, edge.claim]),
    ).toEqual(expectedPackMembers.map((id) => [id, "pack:self-hosting-v1", "declared"]));
    expect(packNode).toEqual({
      id: "pack:self-hosting-v1",
      nodeType: "Pack",
      claim: "declared",
      title: "Self-hosting",
      framing: "The Protocol authors and validates its own delivery model.",
      modelRefs: ["spec:model.protocol-domain", "spec:model.core-model"],
      file: "specs/self-hosting.pack.sdp.ts",
    });
    expect(result.graph.edges).toHaveLength(180);
    expect(
      result.graph.edges
        .filter((edge) => edge.claim === "anchored")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual(expectedAnchors.map((anchor) => [anchor.id, anchor.type, anchor.target]).sort());
    const expectedAnchorNodes = expectedAnchors
      .map((anchor) => {
        const source = readFileSync(join(repoRoot, anchor.file), "utf8");

        return {
          id: anchor.id,
          nodeType: anchor.nodeType,
          claim: "anchored",
          label: anchor.label,
          file: anchor.file,
          line: lineContaining(source, `const ${anchor.constant}`),
        };
      })
      .sort((left, right) => left.id.localeCompare(right.id));
    expect(
      result.graph.nodes
        .filter((node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode")
        .map((node) => ({
          id: node.id,
          nodeType: node.nodeType,
          claim: node.claim,
          label: node.label,
          file: node.file,
          line: node.line,
        }))
        .sort((left, right) => left.id.localeCompare(right.id)),
    ).toEqual(expectedAnchorNodes);
    for (const anchor of expectedAnchors) {
      const source = readFileSync(join(repoRoot, anchor.file), "utf8");
      const anchorLine = lineContaining(source, `const ${anchor.constant}`);
      const siteLine = lineContaining(source, anchor.site);
      const node = result.graph.nodes.find((entry) => entry.id === anchor.id);

      expect(anchorLine).toBeGreaterThan(0);
      expect(siteLine, anchor.id).toBeGreaterThan(0);
      expect(Math.abs(anchorLine - siteLine), anchor.id).toBeLessThanOrEqual(20);
      expect(node).toMatchObject({ file: anchor.file, line: anchorLine, claim: "anchored" });
    }

    const childId = "spec:validation.duplicate-ids.dual-carrier";
    const parentId = "spec:validation.duplicate-ids";
    const child = primitiveNodes.find((node) => node.id === childId);
    const parent = primitiveNodes.find((node) => node.id === parentId);

    expect(child?.deliveryFacts).toEqual(["has-verifier"]);
    expect(parent?.deliveryFacts).toEqual(["implemented", "has-verifier"]);
    expect(
      result.graph.edges.filter(
        (edge) =>
          edge.from === "test:protocol.duplicate-ids.dual-carrier" &&
          edge.type === "verifies" &&
          edge.claim === "anchored",
      ),
    ).toEqual([
      {
        from: "test:protocol.duplicate-ids.dual-carrier",
        type: "verifies",
        to: childId,
        claim: "anchored",
      },
    ]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.type === "verifies" && edge.claim === "anchored" && edge.to === parentId,
      ),
    ).toEqual([]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === childId && edge.type === "verifies" && edge.claim === "declared",
      ),
    ).toEqual([{ from: childId, type: "verifies", to: parentId, claim: "declared" }]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === childId && edge.type === "refines" && edge.claim === "declared",
      ),
    ).toEqual([{ from: childId, type: "refines", to: parentId, claim: "declared" }]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === "impl:protocol.duplicate-id-exclusion" && edge.type === "satisfies",
      ),
    ).toEqual([
      {
        from: "impl:protocol.duplicate-id-exclusion",
        type: "satisfies",
        to: parentId,
        claim: "anchored",
      },
    ]);

    const importChildId = "spec:carrier.sdp-import.round-trip";
    const importParentId = "spec:carrier.sdp-import";
    const importChild = primitiveNodes.find((node) => node.id === importChildId);
    const importParent = primitiveNodes.find((node) => node.id === importParentId);

    expect(importChild?.deliveryFacts).toEqual(["has-verifier"]);
    expect(importParent?.deliveryFacts).toEqual(["has-verifier"]);
    expect(
      result.graph.edges.filter(
        (edge) =>
          edge.from === "test:protocol.sdp-import.round-trip" &&
          edge.type === "verifies" &&
          edge.claim === "anchored",
      ),
    ).toEqual([
      {
        from: "test:protocol.sdp-import.round-trip",
        type: "verifies",
        to: importChildId,
        claim: "anchored",
      },
    ]);
  });
});
