// The authored descriptors of the `carrier` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const carrierSpecs = [
  {
    id: "spec:carrier.markdown-authoring",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
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
    id: "spec:carrier.gherkin-authoring",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.sdp.md",
    title: "Gherkin authoring enters the one graph",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Author behavior and example Specs in Gherkin without creating a second graph or execution path.",
      },
      behavior: {
        rules: [
          "One `.sdp.gherkin` file carries exactly one behavior Spec as its Feature and zero or more example Specs as ordinary Scenarios, with one canonical carrier surface per Spec ID.",
          "Feature and ordinary Scenario tags carry exactly one identity, altitude, and readiness; kind is structural (Feature → behavior, Scenario → example), Pack membership stays manifest-owned, and authored delivery facts, claims, lifecycle state, and workflow status are refused.",
          "Gherkin is an honest canonical per-ID option only for `behavior` and `example`; the other six kinds stay Markdown because a Gherkin mapping would lie — `workflow` has no distinct Gherkin root and Feature mapping erases the kind; `rule` collides with `Rule:` already consumed as inline `behavior.rules`; `constraint` needs machine-readable targets a Scenario cannot own; `model` needs keyed terms; `decision` needs context/decision/rationale/consequences (and supersedes) that Feature structure cannot distinguish; `contract` shares the behavior family row today but Feature cannot structurally mark the kind.",
          "The closed relation tags map one-for-one to declared `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, and `verifies` relations, while an ordinary Scenario defaults `refines` and `verifies` to its Feature unless that relation type is explicit.",
          "Closed keyed description bullets populate existing intent and verification fields; remaining non-heading prose belongs to narrative on the typed Spec owner; unknown keys and heading-shaped lines are refused at their exact physical source line despite blanks and comments; no Gherkin form is invented for open questions; Feature and Scenario description prose is lawful only as free prose on MD-19's existing owners and never as a new field or a parser-within-a-parser.",
          "Trailing title-only Rule blocks populate behavior rules in source order; a Rule carrying tags, description, or positionally nested children is refused.",
          "At most one `@example-space` pseudo-scenario supplies the parent vocabulary without producing a Spec node, while each ordinary Scenario supplies exactly one bound example point.",
          "An ordinary Scenario and an `@example-space` pseudo-scenario must each carry at least one step; a step-less Scenario is refused at its Scenario line without inventing a complete-GWT rule.",
          "Gherkin steps reuse the Protocol-owned slot notation; conjunctions inherit the preceding phase, and outlines, backgrounds, star steps, doc strings, data tables, and leading conjunctions are refused.",
          "Independent semantic Gherkin findings accumulate in physical source order up to a hard cap of 100; any semantic finding excludes the entire invalid carrier from the graph while healthy sibling files survive.",
          "Gherkin is a canonical authoring carrier rather than a Cucumber execution path; generated contracts and resolving code-side anchors remain the execution and delivery-fact boundary.",
          "Markdown remains the default Spec carrier; a default flip to Gherkin is refused before full honest round-trip exists.",
          "Packs stay under MD-25; this carrier neither admits a Gherkin Pack surface nor reopens the Pack Markdown envelope.",
          "Universality is a generated Gherkin-shaped READ projection of any Spec, never an authored `.sdp.gherkin` in an authored tree and never round-trip parity.",
        ],
        exampleSpace: {
          given: ["the Gherkin fixture corpus {probe:string}"],
          when: ["the fixture corpus is extracted and validated"],
          then: [
            "extraction reports {findingCount:number} findings",
            "validation reports {findingCount:number} findings",
            "the first finding is {findingId:string} at line {line:number}",
            "the report contains finding {findingId:string}",
            "the graph contains exactly {specCount:number} Specs",
            'the graph contains the Spec {specId:string} with kind {specKind:"behavior"|"example"}',
            'the graph contains the child Spec {childId:string} with kind {specKind:"behavior"|"example"}',
            "the child Spec {childId:string} declares {relationType:string} to {relationTarget:string}",
            "the child Spec {childId:string} declares the additional relation {relationType:string} to {relationTarget:string}",
            "the graph omits the Spec {absentId:string}",
            "no graph edge names the absent Spec {absentId:string}",
            "the parent example space contains {spaceStep:string}",
            "the graph for {parityLeft:string} equals the graph for {parityRight:string}",
            "the contracts for {parityLeft:string} equal the contracts for {parityRight:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.authored-fact-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.authored-fact-refused.sdp.md",
    title: "An authored delivery fact lookalike is refused",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "authored-fact"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 1} findings",
              'the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 1}',
              'the graph omits the Spec {absentId: "spec:fixture.authored-fact"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove Gherkin cannot author a delivery fact or disguise one as non-semantic decoration.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.contract-parity",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.contract-parity.sdp.md",
    title: "Markdown and Gherkin twins derive equal graphs and contracts",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "parity"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 0} findings",
              'the graph for {parityLeft: "twin.sdp.md"} equals the graph for {parityRight: "twin.sdp.gherkin"}',
              'the contracts for {parityLeft: "twin.sdp.md"} equal the contracts for {parityRight: "twin.sdp.gherkin"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove the Gherkin carrier derives the same graph and generated contract semantics as its Markdown twin.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.duplicate-surface-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.duplicate-surface-refused.sdp.md",
    title: "Duplicate Markdown and Gherkin surfaces are both excluded",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "duplicate-surface"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 2} findings",
              'the report contains finding {findingId: "extract/duplicate-id"}',
              'the graph omits the Spec {absentId: "spec:fixture.surface-duplicate"}',
              'no graph edge names the absent Spec {absentId: "spec:fixture.surface-duplicate"}',
              'the graph contains the Spec {specId: "spec:fixture.surface-sibling"} with kind {specKind: "example"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove one canonical surface per Spec ID by excluding every duplicate site and its edges while preserving healthy siblings.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.example-space-extraction",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.example-space-extraction.sdp.md",
    title: "The pseudo-scenario supplies example space without a node",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "example-space"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 0} findings",
              "the graph contains exactly {specCount: 2} Specs",
              'the parent example space contains {spaceStep: "Given a cart containing {item:string}"}',
              'the graph omits the Spec {absentId: "spec:fixture.example-space"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove the Gherkin example-space pseudo-scenario populates the parent vocabulary and is withheld from graph identity.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.malformed-relation-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.malformed-relation-refused.sdp.md",
    title: "A malformed relation target is refused",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "malformed-relation"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 1} findings",
              'the first finding is {findingId: "extract/invalid-id"} at line {line: 4}',
              'the graph omits the Spec {absentId: "spec:fixture.malformed-relation"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove every Gherkin relation target restores to a lawful Spec ID before it can enter the graph.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.missing-id-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.missing-id-refused.sdp.md",
    title: "A Feature without identity is refused",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "missing-id"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 1} findings",
              'the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 3}',
              'the graph omits the Spec {absentId: "spec:fixture.missing-id"}',
            ],
          },
        ],
      },
      intent: {
        outcome: "Prove every Gherkin Feature must carry exactly one lawful Spec identity.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.parent-child-extraction",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.parent-child-extraction.sdp.md",
    title: "A Feature and Scenario enter the graph as parent and child",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "parent-child"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 0} findings",
              "the graph contains exactly {specCount: 2} Specs",
              'the graph contains the Spec {specId: "spec:fixture.gherkin-parent"} with kind {specKind: "behavior"}',
              'the graph contains the child Spec {childId: "spec:fixture.gherkin-child"} with kind {specKind: "example"}',
              'the child Spec {childId: "spec:fixture.gherkin-child"} declares {relationType: "refines"} to {relationTarget: "spec:fixture.gherkin-parent"}',
              'the child Spec {childId: "spec:fixture.gherkin-child"} declares the additional relation {relationType: "verifies"} to {relationTarget: "spec:fixture.gherkin-parent"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove Gherkin nesting produces one behavior parent, one example child, and the two declared parent relations.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.unbound-ready-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.unbound-ready-refused.sdp.md",
    title: "A ready example with an unbound used slot is refused",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "unbound-ready"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "validation reports {findingCount: 3} findings",
              'the report contains finding {findingId: "honesty/readiness-floor"}',
              'the graph contains the Spec {specId: "spec:fixture.unbound-ready"} with kind {specKind: "example"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove Gherkin-authored examples share the existing readiness floor and concreteness law without carrier exceptions.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.unknown-tag-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.unknown-tag-refused.sdp.md",
    title: "A graph-aware tag near miss is refused",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "unknown-tag"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 1} findings",
              'the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 1}',
              'the graph omits the Spec {absentId: "spec:fixture.unknown-tag"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove misspelled graph-aware tags fail with a bounded suggestion rather than becoming silent decoration.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.unsupported-construct-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.unsupported-construct-refused.sdp.md",
    title: "A Scenario Outline is refused",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "unsupported-construct"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 1} findings",
              'the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 7}',
              'the graph omits the Spec {absentId: "spec:fixture.outline"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove Gherkin constructs outside the closed carrier grammar fail loudly instead of entering the graph partially.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.description-location-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.description-location-refused.sdp.md",
    title: "A bad description key reports its physical source line",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "description-location-refusal"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 1} findings",
              'the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 6}',
              'the graph omits the Spec {absentId: "spec:fixture.desc-loc-refusal"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove Gherkin description diagnostics point at the exact physical line after blanks and comments rather than at a parser-relative offset.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.step-less-scenario-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.step-less-scenario-refused.sdp.md",
    title: "A step-less Scenario is refused at its Scenario line",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "step-less"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 1} findings",
              'the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 5}',
              'the graph omits the Spec {absentId: "spec:fixture.step-less"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove an ordinary Scenario without steps fails loudly at the Scenario line and contributes no Spec nodes.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.gherkin-authoring.multi-finding-bounded",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/gherkin-authoring.multi-finding-bounded.sdp.md",
    title: "Multiple findings exclude one carrier and keep a healthy sibling",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: ['the Gherkin fixture corpus {probe: "multi-finding"}'],
            when: ["the fixture corpus is extracted and validated"],
            then: [
              "extraction reports {findingCount: 4} findings",
              'the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 1}',
              "the graph contains exactly {specCount: 1} Specs",
              'the graph omits the Spec {absentId: "spec:fixture.invalid-parent"}',
              'no graph edge names the absent Spec {absentId: "spec:fixture.invalid-child"}',
              'the graph contains the Spec {specId: "spec:fixture.healthy-sibling"} with kind {specKind: "behavior"}',
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Prove independent semantic Gherkin findings accumulate without partial graph insertion while a healthy sibling survives.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.envelope-contract",
    specKind: "contract",
    altitude: "feature",
    readiness: "ready",
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
          "The envelope key set is closed and every one of its five keys is required: a key outside the set is refused rather than absorbed, and a missing key refuses the document rather than being defaulted.",
          "`relations: {}` is written explicitly when the logical relation set is empty — honest carrier syntax, not a new logical requirement: the physical key catches a truncated envelope at reification while the model itself stays relation-optional.",
          "A derived name is never authorable in the envelope: a delivery-fact or graph-shape key is refused under its own finding class, because delivery facts are derived and never authored.",
          "The Protocol owns the envelope grammar and the parser policy while the pinned YAML library stays a swappable representation behind that contract, so an unsupported YAML construct is refused within explicit byte bounds on the carrier and its frontmatter rather than silently becoming carrier semantics.",
          "The realizing entrypoints are `readMarkdownEnvelope` in `src/extract/markdown-envelope.ts` and `parseMarkdownFrontmatter` in `src/extract/markdown-frontmatter.ts`.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.markdown-pack-authoring",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/carrier/markdown-pack-authoring.sdp.md",
    title: "Packs may gain a Markdown authoring carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a Markdown Pack manifest carry the same grouping identity, framing, membership, and model references as the TypeScript form.",
      },
      behavior: {
        rules: [
          "Routing is by envelope id namespace: `pack:` reifies as a Pack manifest; `spec:` keeps the Spec path; any other namespace keeps the existing invalid-id refusal.",
          "The pack envelope is closed to exactly `id` (required, `pack:` namespace), `specs` (required YAML list of `spec:` ids, manifest order; may be empty), and `modelRefs` (optional YAML list of `spec:` ids). A derived-name key is refused as `extract/reserved-property`. Any other key — including the Spec-only keys `kind`, `altitude`, `readiness`, `relations`, `title` — refuses with `extract/unrecognized-property`. Symmetrically, `specs` or `modelRefs` on a `spec:` carrier refuse the same way.",
          "The body H1 is the Pack title. All remaining body prose is the framing, owned by the Pack node. Any `##` section heading refuses with `extract/unrecognized-heading` — a Pack has no section tier.",
          "A Markdown manifest and a TypeScript manifest of the same Pack derive the identical Pack node (the `file` field aside) and identical `belongsTo` edges. The same id authored in both carriers is the standing duplicate-id refusal.",
          "The TypeScript `pack()` builder stays a lawful per-ID option and the import source; `sdp import` remains Spec-only and does not convert pack manifests.",
        ],
        exampleSpace: {
          given: ["an extraction root holding the pack carrier {carrierSource:string}"],
          when: ["the extractor derives the graph"],
          then: [
            "the graph holds the pack {packId:string} whose membership names {memberId:string}",
            "the report names the refusal {findingId:string} and the graph holds no pack node",
          ],
        },
      },
      design: {
        description: "The implementing Design: one envelope, one walk, one Pack node.",
        envelopeSketch:
          "Frontmatter closed to `id` · `specs` · `modelRefs`; H1 owns the title; remaining paragraphs normalize to framing the same way a Spec narrative slot does.",
        routingRule:
          "After the bounded frontmatter parse, the envelope id namespace selects the carrier class. `pack:` never asks for `kind`.",
        refusalSet:
          "Unrecognized keys share `extract/unrecognized-property` across both carrier classes. A Pack `##` heading shares `extract/unrecognized-heading` with an unrecognized Spec heading. Wrong-namespace `id` or membership entries reuse the existing id-grammar refusal.",
        rejectedSuffix:
          "A distinct `.pack.md` suffix would invent a second discovery walk the carrier ruling never chose.",
        rejectedBodyList:
          "Membership as a body list would give Packs a section tier and split identity between envelope and prose.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.markdown-pack-authoring.markdown-ts-parity",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/carrier/markdown-pack-authoring.markdown-ts-parity.sdp.md",
    title: "A Markdown Pack twin matches its TypeScript manifest",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute Markdown↔TypeScript Pack parity on one probe pack, the `file` field aside.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding the pack carrier {carrierSource: "the Markdown twin of a TS manifest"}',
            ],
            when: ["the extractor derives the graph"],
            then: [
              'the graph holds the pack {packId: "pack:probe.parity"} whose membership names {memberId: "spec:probe.member"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-pack-authoring.spec-envelope-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/carrier/markdown-pack-authoring.spec-envelope-refused.sdp.md",
    title: "A Spec key on a Pack envelope is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the closed-envelope refusal when a Markdown pack carries a Spec-only key.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding the pack carrier {carrierSource: "a Markdown pack manifest carrying kind: behavior"}',
            ],
            when: ["the extractor derives the graph"],
            then: [
              'the report names the refusal {findingId: "extract/unrecognized-property"} and the graph holds no pack node',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-parser",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
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
        exampleSpace: {
          given: ["the paired carrier probes named {probe:string}"],
          when: ["both carriers reify their probe"],
          then: [
            "both carriers report the finding class {findingId:string}",
            'the TypeScript carrier reports severity {typeScriptSeverity:"warning"|"error"} and extracts {typeScriptSpecs:number} specs',
            'the Markdown carrier reports severity {markdownSeverity:"warning"|"error"} and extracts {markdownSpecs:number} specs',
          ],
        },
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
    id: "spec:carrier.markdown-parser.bounded-parity",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-parser.bounded-parity.sdp.md",
    title: "One finding class is shared while the carriers' outcomes stay their own",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute one same-class row of the parity matrix, including the outcomes it never claims.",
      },
      behavior: {
        examples: [
          {
            given: ['the paired carrier probes named {probe: "unrecognized-property"}'],
            when: ["both carriers reify their probe"],
            then: [
              'both carriers report the finding class {findingId: "extract/unrecognized-property"}',
              'the TypeScript carrier reports severity {typeScriptSeverity: "warning"} and extracts {typeScriptSpecs: 1} specs',
              'the Markdown carrier reports severity {markdownSeverity: "error"} and extracts {markdownSpecs: 0} specs',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
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
          "`sdp import` converts Spec carriers; Pack manifests are out of scope — the TypeScript manifest stays a lawful per-ID option.",
          "A batch scans only bounded source directories, canonicalizes physical carrier identity, and computes every refusal and target collision before publishing any sibling.",
          "Publication prepares exclusive temporary siblings and atomically creates targets without clobbering; rollback attempts every artifact, reports survivors, and never deletes a TypeScript source.",
        ],
        exampleSpace: {
          given: ["a TS-carrier spec"],
          when: ["importTypeScriptSpec runs"],
          then: ["the emitted Markdown re-parses to an equal graph"],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
            then: ["the emitted Markdown re-parses to an equal graph"],
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
    readiness: "ready",
    file: "specs/carrier/prose-ownership-rule.sdp.md",
    title: "Every prose edge has one owner",
    narrative: null,
    sections: {
      intent: { outcome: "Keep free prose in the graph without ambiguous attachment." },
      behavior: {
        rules: [
          "Narrative lives before the first H2 and is owned directly by the Spec; it is Spec content, never an envelope field.",
          "A description is owned only by a singular section and lives under that section's own heading; the array-shaped constraints section has no description owner, so its explanatory prose belongs in narrative or intent instead.",
          "Unowned prose — prose standing under no typed owner — is refused loudly rather than attached by guess or dropped in silence.",
          "Prose is stored as graph content inside its typed owner, never as a file pointer or a heading-path key: a consumer reads prose from the graph without re-parsing the document, and churned document structure carries no identity.",
          "The realizing entrypoints are `parseMarkdownBody` in `src/extract/markdown-body.ts` and `mapOwner` in `src/extract/markdown-body-owners.ts`.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.slot-notation",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/slot-notation.sdp.md",
    title: "Slot notation declares, binds, and refuses to guess",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give step text one owned typed placeholder syntax whose normalized identity a generated contract can key on.",
      },
      behavior: {
        rules: [
          "A slot group opens with an identifier; a brace group that does not open with one is prose, and prose is never policed.",
          "A vocabulary slot declares a type only in the ratified type form — `number`, `string`, `boolean`, or a closed union of two or more quoted literals — while an example binds one scalar literal in the same position.",
          "The skeleton — every slot group normalized to `{name}` with prose braces left untouched — is the step's identity: it keys the generated step contract, matches an example step to its vocabulary entry, and makes a declaration and its binding the same step.",
          "An identifier-led group whose remainder parses as neither a type nor a value stays a named but unusable slot: it declares nothing, binds nothing, and reads as unbound rather than being guessed into meaning.",
          "The single-quoted-literal form parses as a binding, and what it would declare in a vocabulary is unruled — so a vocabulary consumer treats it as declaring nothing and says so rather than inventing a one-value dimension.",
          "Lexical degradation stays local: a stray or unterminated brace group is prose only up to the next candidate, so it never swallows a well-formed binding that follows it.",
          "The realizing entrypoints are `parseSlots` and `stepSkeleton` in `src/notation/slots.ts`.",
        ],
        exampleSpace: {
          given: ["the step text {stepText:string}"],
          when: ["the notation parses the step text"],
          then: [
            "the notation finds {slotCount:number} slot groups",
            'the first group has the form {form:"bare"|"typed"|"bound"|"malformed"} and the name {slotName:string}',
            "the step skeleton is {skeleton:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.slot-notation.typed-declaration",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/slot-notation.typed-declaration.sdp.md",
    title: "A typed declaration normalizes to the skeleton its binding shares",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the declaration form and the skeleton identity on one vocabulary step.",
      },
      behavior: {
        examples: [
          {
            given: ['the step text {stepText: "a cart with {n:number} line items"}'],
            when: ["the notation parses the step text"],
            then: [
              "the notation finds {slotCount: 1} slot groups",
              'the first group has the form {form: "typed"} and the name {slotName: "n"}',
              'the step skeleton is {skeleton: "a cart with {n} line items"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.slot-notation.refused-guess",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/slot-notation.refused-guess.sdp.md",
    title: "A stray brace stays prose while an unusable group stays a named slot",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the refuse-to-guess posture where a stray brace precedes an unparsable group.",
      },
      behavior: {
        examples: [
          {
            given: ['the step text {stepText: "a stray { then {n: maybe} line items"}'],
            when: ["the notation parses the step text"],
            then: [
              "the notation finds {slotCount: 1} slot groups",
              'the first group has the form {form: "malformed"} and the name {slotName: "n"}',
              'the step skeleton is {skeleton: "a stray { then {n} line items"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
