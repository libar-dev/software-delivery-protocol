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
    deliveryFacts: ["implemented", "has-verifier"],
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
          "A `.sdp.gherkin` file uses Gherkin's English dialect, by default or under `# language: en`; any other `# language:` header refuses the file at that line with `extract/gherkin-grammar`.",
          "A Feature and each ordinary Scenario carry exactly one `@spec.<dotted-id>` tag, with the Spec id's `spec:` prefix omitted, one `@altitude.<value>` tag taking `epic`, `feature` or `story`, and one `@readiness.<value>` tag taking `idea`, `scoped`, `defined` or `ready`.",
          "Kind is structural: a Feature carries a `behavior` Spec and an ordinary Scenario carries an `example` Spec; Pack membership stays manifest-owned.",
          "A `.sdp.gherkin` carrier holds only `behavior` and `example` Specs; the Markdown and TypeScript carriers remain lawful for the other kinds, under `spec:decisions.carrier-universality`.",
          "A relation tag is a head, a dot and a full Spec id, as in `@depends-on.spec:carrier.slot-notation`, and the heads `@refines.`, `@depends-on.`, `@constrained-by.`, `@decided-by.` and `@verifies.` declare `refines`, `dependsOn`, `constrainedBy`, `decidedBy` and `verifies`; an ordinary Scenario defaults `refines` and `verifies` to its Feature unless it explicitly declares that relation type.",
          "`@exercises.<key>` on an ordinary Scenario names a rule key of the Spec it verifies, and it and a Rule title key follow `spec:model.rule-keys`; `@kind.`, `@pack`, `@pack.` and `@supersedes.` are refused.",
          "A tag whose head, compared case-insensitively, is `implemented`, `has-verifier`, `hasVerifier`, `observed`, `claim`, `status`, `lifecycle`, `workflow` or `architect`, followed by the end of the tag, `.` or `-`, is refused, so the carrier authors no delivery fact, claim, lifecycle state or workflow status.",
          "A tag whose head has a unique nearest reserved head, within one edit of a reserved head of at most five letters or two edits of a longer one, is refused, and the refusal suggests that head only when its suggested form is lawful; every other tag, `@wip` included, is decoration and authors no graph state.",
          "A keyed Feature or ordinary Scenario description line has the form `- <key>: <value>` with a nonempty value; `actor`, `problem`, `outcome`, `value` and `description` occur at most once and populate Intent, `risk` and `assumption` repeat in Intent, `criterion` repeats in Verification, and `verification-mode` occurs at most once with `manual`, `reviewed`, `contract` or `executable`.",
          "An unknown description key or a heading-shaped description line is refused at its physical source line, despite blanks and comments; remaining non-heading prose is narrative, lawful only as free prose on the typed prose owners named by the prose-ownership decision, `spec:decisions.prose-ownership`, and never a new field or a parser within a parser.",
          "The carrier has no form for open questions, their fields, or a relation reason; a Spec that needs one is authored in Markdown.",
          "Trailing title-only Rule blocks populate behavior rules in source order, and a Rule title may open with a rule key marker, `[#key]` and a space; a Rule carrying tags, description, or positionally nested children is refused.",
          "At most one `@example-space` pseudo-scenario supplies the parent vocabulary without producing a Spec node, while each ordinary Scenario supplies exactly one bound example point.",
          "An ordinary Scenario and an `@example-space` pseudo-scenario must each carry at least one step; a step-less Scenario is refused at its Scenario line without inventing a complete-GWT rule.",
          "Gherkin steps reuse the Protocol-owned slot notation; conjunctions inherit the preceding phase, and outlines, backgrounds, star steps, doc strings, data tables, and leading conjunctions are refused.",
          "A step of an ordinary Scenario or of the `@example-space` pseudo-scenario may open its text with a step key marker, `[#key]` and a space, after its keyword, `And` included, under `spec:carrier.step-keys`.",
          "Independent semantic Gherkin findings accumulate in physical source order up to a hard cap of 100; any semantic finding excludes the entire invalid carrier from the graph while healthy sibling files survive.",
          "Gherkin is a canonical authoring carrier rather than a Cucumber execution path; generated contracts and resolving code-side anchors remain the execution and delivery-fact boundary.",
          "Markdown remains the default Spec carrier; a default flip to Gherkin is refused before full honest round-trip exists.",
          "Packs follow the Pack syntax ruling, `spec:decisions.pack-markdown-carrier`; this carrier neither admits a Gherkin Pack surface nor reopens the Pack Markdown envelope.",
          "Universality is a generated Gherkin-shaped read projection of any Spec, never an authored `.sdp.gherkin` in an authored tree and never round-trip parity.",
        ],
        exampleSpace: {
          given: ["the Gherkin fixture corpus {probe:string}"],
          when: ["the fixture corpus is extracted and validated"],
          then: [
            "extraction reports {findingCount:number} findings",
            "validation reports {findingCount:number} findings",
            "the first finding is {findingId:string} at line {line:number}",
            "the first finding message contains {messageText:string}",
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
        ruleKeys: {
          identityTags: "rules[2]",
          kindBound: "rules[4]",
          relationTags: "rules[5]",
          decorationTags: "rules[8]",
          descriptionKeys: "rules[9]",
        },
      },
      design: {
        reservedTagHeads:
          "the reserved heads are `spec`, `altitude`, `readiness`, `refines`, `depends-on`, `constrained-by`, `decided-by`, `verifies`, `exercises`, `kind`, `pack`, `supersedes` and `example-space`; the near-miss refusal measures a tag head against them.",
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
    title: "A Gherkin example with an unbound used slot fails its stated readiness floor",
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
          "Execute the readiness floor on a Gherkin-carried example whose used step leaves a slot unbound.",
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
              'the first finding message contains {messageText: "did you mean"}',
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
          "Each relation type takes one target or a list; its target forms follow `spec:model.relation-reasons`, and an example's declared `verifies` may carry `exercises` under `spec:model.rule-keys`.",
          "`relations: {}` is written explicitly when the logical relation set is empty — honest carrier syntax, not a new logical requirement: the physical key catches a truncated envelope at reification while the model itself stays relation-optional.",
          "A derived name is never authorable in the envelope: a delivery-fact or graph-field key (`implemented`, `has-verifier`, `hasVerifier`, `observed`, `claim`, `deliveryFacts`, `nodeType`, `specKind`, `satisfies`, `verifies`, `belongsTo` or `models`) is refused as `extract/reserved-property`, because delivery facts are derived and never authored; `title` is refused as `extract/invalid-frontmatter`, and any other unknown envelope key as `extract/unrecognized-property`.",
          "The Protocol owns the envelope grammar and the parser policy while the pinned YAML library stays a swappable representation behind that contract, so an unsupported YAML construct is refused within explicit byte bounds on the carrier and its frontmatter rather than silently becoming carrier semantics.",
          "The bounds are 256 KiB per carrier, 32 KiB of frontmatter, 16 KiB per scalar, 2,000 YAML nodes, and a nesting depth of 16; YAML anchor (`&name`) and alias (`*name`) syntax and explicit YAML tags (`!tag`) are refused at any size.",
          "The frontmatter opens at byte zero with an exact `---` line and closes at the next exact `---` line; a byte-order mark, a `...` line in the frontmatter, a further exact `---` line in the body, a lone CR, or mixed LF and CRLF newlines refuses the carrier.",
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
    title: "A Pack has a Markdown manifest carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a Markdown Pack manifest carry the same grouping identity, framing, membership, and model references as the TypeScript form.",
      },
      behavior: {
        rules: [
          "Routing is by envelope id namespace: `pack:` reifies as a Pack manifest; `spec:` keeps the Spec path; any other namespace is refused as `extract/invalid-id`.",
          "The pack envelope is closed to exactly `id` (required, `pack:` namespace), `specs` (required YAML list of `spec:` ids, manifest order; may be empty), and `modelRefs` (optional YAML list of `spec:` ids). A derived-name key is refused as `extract/reserved-property`. Any other key — including the Spec envelope keys `kind`, `altitude`, `readiness` and `relations`, and `title` — refuses with `extract/unrecognized-property`. Symmetrically, `specs` or `modelRefs` on a `spec:` carrier refuse the same way.",
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
            "the Markdown and TypeScript Pack nodes are equal apart from carrier file paths, and their membership edges are equal: {equal:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.markdown-pack-authoring.markdown-ts-parity",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
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
              "the Markdown and TypeScript Pack nodes are equal apart from carrier file paths, and their membership edges are equal: {equal: true}",
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
    readiness: "ready",
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
    title: "The Markdown parser reifies the ruled subset",
    narrative: null,
    sections: {
      intent: {
        problem: "Prevent carrier-specific graph and validation paths from diverging.",
        outcome: "Reify authored Markdown without a second graph or validation path.",
        value: "Markdown-carried intent remains subject to the Protocol's deterministic checks.",
      },
      behavior: {
        rules: [
          "The parser accepts the grammar stated by `spec:carrier.markdown-body-grammar`, keeps matched code spans literal under `spec:carrier.inline-code-spans`, and excludes a malformed Markdown carrier while continuing healthy siblings.",
          "The ruled Markdown parser has bounded finding-class parity with the TypeScript carrier for `extract/non-static-envelope`, `extract/invalid-id`, `extract/duplicate-id`, `extract/reserved-property`, `extract/unowned-prose`, and `extract/unrecognized-property`; both carriers report each of these findings under the same validator id, while severity and extract-versus-refuse outcomes remain carrier-specific.",
          "Carrier-specific finding — `extract/parse-error` remains distinct because YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.",
          "Carrier-specific finding — `extract/non-static-section` remains distinct because TypeScript degrades optional section properties while Markdown refuses malformed documents whole.",
          "A static envelope field that cannot be reified fails extraction in either carrier. A non-static optional TypeScript section property drops with a warning, except the question failures below; a malformed Markdown carrier is refused whole.",
          "The TypeScript carrier refuses an integer-like Design or UI key or Model term with an error and drops only that member. An unknown property inside a question, or a malformed question key, is an error at that property; refusing it does not remove the question's blocking flag.",
          "In the TypeScript carrier, a non-static value under a question's `decider`, `links`, `provisional` or `trigger` field drops the whole question list with an error; a non-static question text or blocking flag drops the whole list with a warning.",
          "Carrier-specific finding — `extract/unrecognized-statement` remains distinct because Markdown owns prose and structures, not TypeScript statement recognition.",
          "Carrier-specific finding — `extract/misplaced-authoring` remains distinct because Markdown has no executable authoring-call surface.",
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
          "Each same-class matrix row reports the same validator id from both carriers, with the specified severity and extraction outcome for each carrier; carrier-specific rows keep their distinct findings.",
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
          "Execute one same-class row of the parity matrix, including each carrier's severity and extraction outcome.",
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
    title: "A TypeScript-carried Spec can be converted to Markdown",
    narrative: null,
    sections: {
      intent: {
        actor: "A coding agent or maintainer.",
        outcome:
          "Convert a TypeScript-carrier Spec into an idiomatic Markdown carrier beside its source.",
        value:
          "The TypeScript DSL remains an import source and a lawful per-ID option; the author chooses which carrier remains canonical.",
      },
      behavior: {
        rules: [
          "Import writes the emitted Markdown sibling beside the TypeScript carrier and never deletes the source carrier.",
          "A written Markdown sibling and its retained TypeScript source carry the same Spec id; before extracting both paths in one root, the author keeps one canonical surface by moving, renaming, excluding or removing the source, and the import success message explains this hand-off.",
          "Import refuses an existing Markdown sibling rather than overwriting it.",
          "Refusal outcomes retain the TypeScript reifier findings and add import-local findings honestly.",
          "Import consumes the TypeScript reifier so source acceptance follows one validation path.",
          "Import accepts only carriers whose builders come from the public package or its `/anchors` subpath; a relative builder import that a source checkout trusts during extraction is refused here.",
          "`sdp import` converts Spec carriers; Pack manifests are out of scope — the TypeScript manifest stays a lawful per-ID option.",
          "A batch walks only ordinary directory entries in requested source directories, skips dot-directories and `node_modules`, `dist`, `generated` and `coverage`, selects `.sdp.ts` files, canonicalizes physical carrier identity, and computes refusals and target collisions before publishing.",
          "Publication prepares exclusive temporary siblings and atomically creates targets without clobbering; rollback attempts every artifact, reports survivors, and never deletes a TypeScript source.",
        ],
        exampleSpace: {
          given: ["a TS-carrier spec"],
          when: ["importTypeScriptSpec runs"],
          then: ["the emitted Markdown re-parses to an equal graph"],
        },
      },
      design: {
        findingIds:
          "`import/refusal`, `import/pack-unsupported`, `import/target-exists`, `import/unsupported-construct`, `import/invalid-source-path`, `import/no-sources` and `import/empty` name the importer's findings; retained TypeScript reifier findings keep their own ids.",
        dryRun:
          "`sdp import <path...> --dry-run` computes refusals and target collisions, prints the planned Markdown siblings and writes none.",
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
          "The actual returned Markdown preserves the source's Spec content and declared relations after carrier locations are normalized.",
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
    title: "Every prose value has one typed owner",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep free prose in the graph without ambiguous attachment.",
      },
      behavior: {
        rules: [
          "Narrative lives before the first H2 and is owned directly by the Spec; it is Spec content, never an envelope field.",
          "A description belongs to one typed section; under `spec:carrier.markdown-body-grammar`, the primary behavior heading and Example space share the behavior section's one description, so leading prose may occur under either, never both. Constraints has no description owner; its explanatory prose belongs in narrative or Intent.",
          "Unowned prose — prose standing under no typed owner — is refused loudly rather than attached by guess or dropped in silence.",
          "Prose is graph content inside its typed owner, never a file pointer or a heading-path key: a consumer reads prose from the graph without re-parsing the document, and churned document structure carries no identity.",
          "Additional typed prose owners are stated by `spec:model.relation-reasons` for a relation's reason and `spec:model.open-question-fields` for a question's provisional and trigger lines.",
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
    narrative:
      "A closed union takes two or more literals because a dimension with one value varies nothing. A vocabulary that means one fixed word writes it as step text, so a group holding one quoted literal stays what it is in an example, a binding, and declares no dimension.",
    sections: {
      intent: {
        outcome:
          "Give step text one owned typed placeholder syntax whose normalized identity a generated contract can key on.",
      },
      behavior: {
        rules: [
          "A slot group opens with a name matching ASCII `[A-Za-z_][A-Za-z0-9_]*`, and `__proto__` is always a malformed slot; a brace group that does not open with such a name is prose, and prose is never policed.",
          "A vocabulary slot declares a type only in the ratified type form — `number`, `string`, `boolean`, or a closed union of two or more quoted literals — while an example binds one scalar literal in the same position.",
          "The skeleton — every slot group normalized to `{name}` with prose braces left untouched — is the step's identity: it matches an example step to its vocabulary entry, makes a declaration and its binding the same step, and keys the generated step contract unless the step carries a step key under `spec:carrier.step-keys`.",
          "An identifier-led group whose remainder parses as neither a type nor a value stays a named but unusable slot: it declares nothing, binds nothing, and reads as unbound rather than being guessed into meaning.",
          'A group holding one double-quoted literal, `{x: "only"}`, is a binding; in a vocabulary it declares no type, no one-value dimension, and contract generation reports `contracts/untyped-vocabulary-slot`.',
          "A bare group, `{n}`, names a slot and binds nothing; in an example it is unbound, and in a vocabulary it declares no type.",
          "Lexical degradation stays local: a stray or unterminated brace group is prose only up to the next candidate, so it never swallows a well-formed binding that follows it.",
        ],
        ruleKeys: {
          slotName: "rules[0]",
          typeForm: "rules[1]",
          skeletonIdentity: "rules[2]",
          unusableSlot: "rules[3]",
          oneLiteralBinding: "rules[4]",
          bareGroup: "rules[5]",
          localDegradation: "rules[6]",
        },
        exampleSpace: {
          given: ["the step text {stepText:string}"],
          when: ["the notation parses the step text"],
          then: [
            "the notation finds {slotCount:number} slot groups",
            'the first group has the form {form:"bare"|"typed"|"bound"|"malformed"} and the name {slotName:string}',
            "the step skeleton is {skeleton:string}",
            "contract generation declares {dimensionCount:number} dimensions and reports {generationFinding:string}",
          ],
        },
        description:
          "A bound value cannot hold a double quote, so a point writes each double quote its step text needs as a single quote, and the world restores them before it parses. The world also runs contract generation over a parent whose example space holds the restored step text as its one Given step; the generation finding is `nothing` when generation reports none.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.slot-notation.one-literal-binding",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/slot-notation.one-literal-binding.sdp.md",
    title: "A one-literal group in a vocabulary is a binding that declares nothing",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the one-literal reading on a vocabulary step, from the parse to contract generation.",
      },
      behavior: {
        examples: [
          {
            given: [`the step text {stepText: "the cart is in {mode: 'only'} mode"}`],
            when: ["the notation parses the step text"],
            then: [
              "the notation finds {slotCount: 1} slot groups",
              'the first group has the form {form: "bound"} and the name {slotName: "mode"}',
              'the step skeleton is {skeleton: "the cart is in {mode} mode"}',
              'contract generation declares {dimensionCount: 0} dimensions and reports {generationFinding: "contracts/untyped-vocabulary-slot"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
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
  {
    id: "spec:carrier.markdown-body-grammar",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.sdp.md",
    title: "The Markdown body accepts one closed form per section",
    narrative: null,
    sections: {
      intent: {
        problem:
          "Without a stated body grammar, an author learns the default carrier by probing refusals and keeps a private copy that drifts when the parser changes.",
        outcome:
          "State what each section of a Markdown Spec body accepts and refuses, and name the Spec that owns each field's values, so an author can write a lawful carrier from this Spec and the Specs it depends on.",
      },
      behavior: {
        rules: [
          "The body opens with one H1 title. Text between the title and the first H2 is the Spec's narrative, and narrative accepts plain paragraphs only.",
          "Each H2 names one section owner from a closed set of Intent, Behavior, Rule, Workflow, Contract, Example space, Constraints, Model, Design, Decision, UI, and `Verification — manual`, `reviewed`, `contract`, or `executable`, spelled with the em dash. An unrecognized heading is refused, with the nearest known name offered when it lies within edit distance two; an owner appears at most once, and a Spec carries at most one of Behavior, Rule, Workflow, and Contract.",
          "A section holds optional leading paragraphs and then structured content. Prose after the first list entry, fence, or H3 is refused as unowned. The primary behavior owner, whichever of Behavior, Rule, Workflow, or Contract the Spec uses, and Example space share one description: leading prose may stand under one of them, and prose under both is refused.",
          "A list entry is one line that starts with a hyphen and a space. A wrapped or indented continuation, a nested list, a star or plus bullet, and an ordered list are refused, except the field lines an open question may carry, each indented by exactly two spaces directly under its question.",
          "The refused block shapes are read line by line in narrative, section prose, and list text: a line that opens with a pipe, a block-quote marker, whitespace, a star or plus bullet, an ordered-list marker, or a `<`, and a line that is only a thematic break or a setext underline. A table without outer pipes is prose to the parser.",
          "Raw HTML is refused in narrative, section prose, and list text, and is not scanned in the H1 title or inside fence steps. The test matches an HTML tag with its closing `>`, a comment delimiter, a declaration, or a processing instruction, so `a < b` and an unclosed `Promise<T` pass. The test ignores matched code spans, as ruled by `spec:carrier.inline-code-spans`.",
          "The only fences are `gwt` and `gwt-vocabulary`. A fence holds Given steps, exactly one When step, and Then steps in that order, with no blank or indented line, and its slot syntax is `spec:carrier.slot-notation`. A step may open with a step key marker after its keyword, under `spec:carrier.step-keys`. An example's Intent owns one `gwt` fence that closes the section. Example space owns optional leading prose, which counts as the shared description above, and then exactly one `gwt-vocabulary` fence, with no list entry or H3.",
          "Intent accepts `actor`, `problem`, `outcome`, and `value` once each and `risk` and `assumption` repeatedly. One `### Open questions` heading may follow those fields, each of its entries opens with `[blocking]` or `[non-blocking]`, optionally with a lower-camel key after one space and `#` inside the brackets, unique within the Spec, and it is the only H3 any section accepts. Under a question's line may follow its `decider`, `links`, `provisional` and `trigger` fields, one line each and each at most once; their values follow `spec:model.open-question-fields`.",
          "Behavior entries are keyed `rule` or `flow`. Rule and Contract entries are plain bullets, each one rule. Workflow entries are plain bullets, each one flow, plus keyed `rule` entries. Any entry of the primary behavior owner may open its text, after its label where it has one, with a rule key marker, `[#key]` and a space, and the key follows `spec:model.rule-keys`. Verification entries are plain criteria.",
          "A keyed entry is one ASCII word, a colon, and a space before its value. Where a section takes plain bullets, a bullet of that shape is read as a key and refused unless the section names that key, so a plain bullet never opens with a single word and a colon.",
          "Constraints accept one flat entry of `statement`, `flavor`, `target`, and `measurableBy`, each at most once, with `statement` required and no prose. A second entry is refused by this carrier.",
          "The TypeScript carrier may give one Spec several constraint entries, and the evidence clauses read every entry a Spec carries, whichever carrier wrote it. A `constrainedBy` edge names the constraint Spec whole, whatever its entry count, so a Markdown author with two measurable targets writes two constraint Specs.",
          "A Model entry is a bold term, the em dash character with a space on each side, and the definition, which may open with a term key marker under `spec:model.term-addresses`; a hyphen is refused, terms are unique, and an integer-like term is refused. Decision accepts `context` and `decision` once each and `rationale`, `alternative`, and `consequence` repeatedly.",
          "Design and UI are open sections. Each entry is a lower-camel ASCII key, unique within its section, and a one-line value; the same key may appear once under Design and once under UI.",
          "The keys `implemented`, `hasVerifier`, `observed`, `claim`, `deliveryFacts`, `nodeType`, `specKind`, `satisfies`, `verifies`, `belongsTo`, and `models` are refused in every keyed section, under `spec:validation.authored-honesty`. In Design and UI, an otherwise lawful lower-camel key outside this set is ordinary content, including `dependsOn`, `references`, `uses` and `memberOf`; it creates no edge. Every closed section still admits only its own fields.",
          "A refused construct excludes its whole carrier from the graph, and healthy sibling carriers survive.",
        ],
        exampleSpace: {
          given: ["a Markdown Spec carrier whose {owner:string} section holds {construct:string}"],
          when: ["the extractor reifies the carrier"],
          then: [
            "the carrier is refused whole with the finding {findingId:string} whose message contains {reason:string} at line {line:number}",
            "the healthy sibling {siblingId:string} stays in the graph",
          ],
        },
        ruleKeys: {
          closedOwners: "rules[1]",
          sectionProse: "rules[2]",
          oneLineEntries: "rules[3]",
          blockShapes: "rules[4]",
          rawHtml: "rules[5]",
          closedFences: "rules[6]",
          singleH3: "rules[7]",
          keyedEntryShape: "rules[9]",
          constraintFields: "rules[10]",
          constraintEntryCount: "rules[11]",
          modelEntries: "rules[12]",
          openSectionKeys: "rules[13]",
        },
        description:
          "The world writes two Markdown carriers in one extraction root, the refused carrier and a healthy sibling. The sibling is a story-altitude behavior Spec stating `idea`, with no relations and an Intent outcome.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.inline-code-spans",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/inline-code-spans.sdp.md",
    title: "Inline code is content, never markup",
    narrative:
      "CommonMark lets a code span cross a line ending inside a paragraph, lets a backslash escape a backtick, and lets an HTML tag that opens before a backtick pair win over the span. The Protocol reads all three cases the other way. A span is a pair of equal backtick runs on one line, and nothing else changes that, so an author or an agent can tell by eye what a span shields, every location reads a span the same way, and a carrier that validates today stays valid. The cost is that a CommonMark renderer may show these rare constructs differently from how the Protocol reads them.",
    sections: {
      intent: {
        problem:
          "Authors need to write type parameters inside code spans without the raw-HTML guard forcing a private bracket notation that cannot be pasted into source.",
        outcome:
          "Let a code span carry any literal text, angle brackets included, while raw HTML outside code spans stays refused.",
      },
      behavior: {
        rules: [
          "A code span is literal content. The raw-HTML refusal never reads inside one, whether the span sits in a Spec's narrative, a section description, a list entry, or a Pack's framing prose.",
          "A code span opens at a backtick run and closes at the next run of the same length on that same line. Both runs must sit on one line, even inside a paragraph whose next line holds the closing run. An unmatched run is ordinary text and shields nothing.",
          "A backslash does not escape a backtick: every backtick run counts when spans are matched, so a backtick written after a backslash still opens or closes a span.",
          "Spans are matched before the raw-HTML test reads what is left of the line, so a tag that opens before a span and closes inside it is no tag, while a tag that opens before a span and closes after it is still refused.",
          "Raw HTML outside a code span is refused as `extract/invalid-markdown-structure` with the message `raw HTML is unsupported`.",
          "The graph stores the line as authored, backticks included. Each projection renders it through the encoding its own Spec requires for that field.",
        ],
        ruleKeys: {
          literalSpan: "rules[0]",
          lineScoped: "rules[1]",
          noEscape: "rules[2]",
          spanBeforeTag: "rules[3]",
          rawHtmlRefused: "rules[4]",
          storedAsAuthored: "rules[5]",
        },
        exampleSpace: {
          given: ["the code-span matrix in {location:string}"],
          when: ["the extractor reifies the probes"],
          then: [
            "matched spans preserve {accepted:number} carriers and exposed HTML refuses {refused:number} carriers",
          ],
        },
        description:
          'The matrix uses matched and unmatched backtick runs of one, two, and three backticks, multiple spans, literal tags and comment delimiters inside spans, exposed HTML before and after spans, closing tags, declarations, processing instructions, and ordinary angle-bracket comparisons. It includes ``Use <T title=`value>.``, ``Use </T`>.``, and ``Use <img alt="`">.`` as refused tag bodies with an unmatched backtick, and ``Use <!-`x`-> here.`` as accepted text whose matched span separates the comment delimiter. It also includes ``Use \\`<b>\\` here.``, whose backslashes escape nothing, and ``Use <a title="`">x` here.``, whose tag closes inside a matched span, as accepted text.\n\nParagraph probes run in narrative, section-description and Pack-framing locations; the list-entry location uses only the single-line matrix. The paragraph probes split a single-backtick pair across two lines. One puts ``Use `Promise<T>.`` on the first line and ``Close here`.`` on the second; another puts ``Open here `.`` first and ``Use Promise<T>`.`` second. Neither pair shields HTML. A third puts ``Open here `.`` first and ``Use `Promise<T>`.`` second, so the pair on the second line shields that line despite the unmatched run on the first.',
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.table-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.table-refused.sdp.md",
    title: "A table under a section is refused",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the block-structure refusal on a table row under an open section.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "a table row"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "nested or unsupported Markdown structure"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.continuation-line-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.continuation-line-refused.sdp.md",
    title: "A bullet wrapped onto a second line is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the one-line entry rule on a bullet whose text continues on an indented line.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Behavior"} section holds {construct: "a bullet wrapped onto an indented second line"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "nested or unsupported Markdown structure"} at line {line: 15}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.ordered-list-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.ordered-list-refused.sdp.md",
    title: "An ordered list is refused",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the list-entry rule on an ordered list item under a primary owner.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Contract"} section holds {construct: "an ordered list item"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "nested or unsupported Markdown structure"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.foreign-fence-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.foreign-fence-refused.sdp.md",
    title: "A fence other than gwt or gwt-vocabulary is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the closed fence set on a language-tagged code fence under an open section.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "a ts fence"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "fences must be exact gwt or gwt-vocabulary fences"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.h3-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.h3-refused.sdp.md",
    title: "An H3 under Design is refused",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the single-H3 rule on a third-level heading under an open section.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "an H3 heading"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "open sections do not accept an H3 or fence"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.plain-bullet-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.plain-bullet-refused.sdp.md",
    title: "A plain bullet under an open section is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the keyed-entry rule of open sections on a bullet with no lower-camel key.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Design"} section holds {construct: "a plain bullet"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "open section keys must be lower-camel ASCII"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.keyed-bullet-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.keyed-bullet-refused.sdp.md",
    title: "A keyed bullet under a plain-bullet owner is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the keyed-bullet rule on a Rule entry that opens with one word and a colon.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Rule"} section holds {construct: "a bullet opening with one word and a colon"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/unrecognized-property"} whose message contains {reason: "is not accepted"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.trailing-prose-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.trailing-prose-refused.sdp.md",
    title: "Prose after structured content is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the prose-ownership rule on a paragraph that follows a section's first list entry.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Behavior"} section holds {construct: "a paragraph after the first bullet"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/unowned-prose"} whose message contains {reason: "prose after structured content has no owner"} at line {line: 16}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.repeated-field-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.repeated-field-refused.sdp.md",
    title: "A repeated single-valued field is refused",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the at-most-once rule on a second statement under Constraints.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Constraints"} section holds {construct: "a second statement field"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "is authored more than once"} at line {line: 15}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.unrecognized-heading-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.unrecognized-heading-refused.sdp.md",
    title: "An unrecognized heading is refused with a suggestion",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the closed owner set on a misspelled heading and read the nearest known name back.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Behaviour"} section holds {construct: "a rule bullet"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/unrecognized-heading"} whose message contains {reason: "did you mean"} at line {line: 13}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.second-primary-owner-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.second-primary-owner-refused.sdp.md",
    title: "A second primary owner is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the one-primary-owner rule on a Rule section that follows a Behavior section.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Rule"} section holds {construct: "a plain bullet after a Behavior section"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "a single-valued Markdown owner is authored more than once"} at line {line: 16}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.raw-html-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.raw-html-refused.sdp.md",
    title: "Raw HTML outside a code span is refused",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the raw-HTML refusal on a line break tag written in a rule.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Behavior"} section holds {construct: "a line break tag"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "raw HTML is unsupported"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.shared-description-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.shared-description-refused.sdp.md",
    title: "A second description across Behavior and Example space is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the shared-owner rule when both the primary behavior heading and Example space carry leading prose.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Example space"} section holds {construct: "a description when Behavior already has one"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "behavior description has more than one owner"} at line {line: 19}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.markdown-body-grammar.integer-term-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/markdown-body-grammar.integer-term-refused.sdp.md",
    title: "An integer-like Model term is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the integer-like term refusal on a Model term written as a bare digit, and keep the healthy sibling carrier as the only Spec in the graph.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a Markdown Spec carrier whose {owner: "Model"} section holds {construct: "an integer-like term"}',
            ],
            when: ["the extractor reifies the carrier"],
            then: [
              'the carrier is refused whole with the finding {findingId: "extract/invalid-markdown-structure"} whose message contains {reason: "model terms must not be integer-like"} at line {line: 14}',
              'the healthy sibling {siblingId: "spec:probe.sibling"} stays in the graph',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.inline-code-spans.narrative",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/inline-code-spans.narrative.sdp.md",
    title: "Code spans in a Spec narrative are literal",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the narrative probes.",
        assumptions: [
          "Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in narrative before Intent.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the code-span matrix in {location: "narrative"}'],
            when: ["the extractor reifies the probes"],
            then: [
              "matched spans preserve {accepted: 15} carriers and exposed HTML refuses {refused: 20} carriers",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.inline-code-spans.description",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/inline-code-spans.description.sdp.md",
    title: "Code spans in section descriptions are literal",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the description probes.",
        assumptions: [
          "Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in the Behavior description.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the code-span matrix in {location: "description"}'],
            when: ["the extractor reifies the probes"],
            then: [
              "matched spans preserve {accepted: 15} carriers and exposed HTML refuses {refused: 20} carriers",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.inline-code-spans.list",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/inline-code-spans.list.sdp.md",
    title: "Code spans in list entries are literal",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the list probes.",
        assumptions: [
          "Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in one Behavior rule entry.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the code-span matrix in {location: "list"}'],
            when: ["the extractor reifies the probes"],
            then: [
              "matched spans preserve {accepted: 14} carriers and exposed HTML refuses {refused: 18} carriers",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.inline-code-spans.pack",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/inline-code-spans.pack.sdp.md",
    title: "Code spans in Pack framing are literal",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the pack probes.",
        assumptions: [
          "Each probe has its own carrier. Each Pack has an empty membership list and puts the probe in framing prose.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the code-span matrix in {location: "pack"}'],
            when: ["the extractor reifies the probes"],
            then: [
              "matched spans preserve {accepted: 15} carriers and exposed HTML refuses {refused: 20} carriers",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.sdp-import.feature-adapter",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    file: "specs/carrier/sdp-import.feature-adapter.sdp.md",
    title: "A bare .feature corpus can be imported",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Convert a bare .feature source corpus into canonical Protocol carriers without adding a second extraction path.",
        openQuestions: [
          {
            question: "Which bare .feature constructs can an import adapter preserve honestly?",
            blocking: true,
            key: "featureAdapter",
            decider: "owner",
            trigger: "an adopter migrates a gen-1 `.feature` corpus into the Protocol",
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:carrier.step-keys",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.sdp.md",
    title: "An example step may carry a key that survives rewording",
    narrative:
      "A test that binds an example through `bindExample` names each step it handles, and an oracle names each Then step of its example space as an outcome `kind`. Both names are the step's skeleton, the step text with each slot reduced to its name, so rewording a step renames it and the typecheck fails at every handler and oracle that names it; a generated registrar holds its own handlers and changes with the contract when it is regenerated, so behind a registrar only the oracle's kinds hold a step's name. That break is the right default for a step whose words are its meaning, and the wrong one when an author improves the wording of a step that many examples and tests share. A step key separates the two. An author keys a step once, in the vocabulary its sibling examples share, and the key, not the wording, names the step in the contract and in the test. The key serves the build and the test, not prose: nothing outside an example and its test cites a single step, so the address grammar gains no step segment.",
    sections: {
      intent: {
        problem:
          "A test that binds an example's steps directly names each by its text, and an oracle names each Then step the same way, so improving a step's wording breaks every test and oracle that names it, though nothing the step means has changed.",
        outcome:
          "Let an example step carry a key in a marker, so its contract key and the binding a test holds survive a change of wording, in the Markdown, Gherkin and TypeScript carriers alike.",
      },
      behavior: {
        description:
          "The world writes one extraction root holding a parent probe Spec and one child example in the carrier the slot names. The parent is a story-altitude behavior Spec stating `scoped`, with an Intent outcome, one rule and an example space whose Given steps are the steps the vocabulary slot joins with a semicolon and a space, followed by `When the probe runs` and `Then the probe ends with {result:string}`. The child is an example stating `scoped` that refines and verifies the parent, whose Given steps are the steps the example slot joins the same way, followed by `When the probe runs` and `Then the probe ends with {result: \"done\"}`. In Markdown the two are separate carriers; in Gherkin they are the Feature and one Scenario of one `.sdp.gherkin` file, with the vocabulary in its `@example-space` pseudo-scenario; in TypeScript they are two `.sdp.ts` carriers whose step strings are the same steps. The world extracts the root and generates the contracts, replaces every occurrence of the before text with the after text in every step as written, markers included, and extracts and generates again. A finding read is the first extraction finding of the first run, or the first contract-generation finding of the first run that names the child, and an empty slot value means the run reports none. A binding key is the key the child's step contract gives its first Given step, in the first run and then in the second, and an empty string when no step contract is emitted for the child. The world writes one `bindExample` handler map against the first contract, one handler per contract key, each declaring its parameters with the names and types that contract gives them and recording which handler each step reaches; it typechecks that unchanged map against the second contract and, when the typecheck passes, runs it with the second contract through `planExample` and `runExamplePlan`. `stillBound` is true only when the unchanged map typechecks and the reworded step reaches the handler it reached in the first run; a changed contract key, slot name or declared slot type makes it false. The import reads the carriers as reworded: the world imports each TypeScript carrier to Markdown, reads the emitted fence line of the parent's first Given step, extracts the imported carriers in a fresh root, and compares each Spec's step keys and step text with the TypeScript graph's.",
        rules: [
          "A step may open its text with a step key marker, `[#key]` and one space, after its keyword: in a line of a `gwt` or `gwt-vocabulary` fence, in a step of a `.sdp.gherkin` Scenario or `@example-space` pseudo-scenario, and at the start of a step string in the TypeScript carrier. The key is lower-camel ASCII, the grammar every marker key follows, and an unkeyed step stays lawful. Importing a TypeScript carrier to Markdown writes the marker on every step that carries the key.",
          "The marker is carrier syntax: the graph holds the step text without it and records the key apart, so the slot notation, the skeleton, the vocabulary match, the bound point, the readiness floor and the frozen projections read the step text unchanged.",
          "Step text that opens with `[#` and does not continue as a marker is refused at its step; a marker later in the text is plain text.",
          "Within one Spec a key names one step and a step carries one key, a step being one skeleton: a key on two skeletons, or two keys on one skeleton, is refused at each step that carries one. A step written more than once needs its marker once and may repeat it. An example space belongs to one Spec, so its keys are unique across the space and the sibling set that binds it. A refused Markdown or Gherkin carrier is refused whole, as for every structure refusal; in the TypeScript carrier the key drops at each site and the Spec stays.",
          "A sibling set shares its parent's vocabulary, and so its keys: an example step that resolves to a step of its parent's example space takes that step's key. A marker on such a step must repeat that key; any other marker, or a marker where the vocabulary step has none, withholds the example's step contract. An example step that no parent's example space declares takes its key from its own marker.",
          "A step's contract key is its key when it has one and its skeleton otherwise, as `spec:extraction.executable-contracts` derives it. The contract key names the step in the generated contract, the handler a test binds to it, and, for a Then step of an example space, the `kind` of its outcome.",
          "A key names the step and its slots name the step's parameters: the handler bound under a key receives the step's bound values, typed by the vocabulary as an unkeyed handler's are, and a key never names a slot.",
          "Rewording a keyed step, in the vocabulary and in every example that uses it, leaves its contract key unchanged, so a directly authored handler bound under the key, and an oracle that names it as an outcome `kind`, compile and run unchanged; an adopted registrar is regenerated, as after every carrier edit, and its authored adapters compile unchanged. Renaming or retyping one of its slots changes its parameters and breaks the binding, as it always has.",
          "An unkeyed step is keyed by its skeleton, as it always was: rewording it changes its contract key. A directly authored handler under the old skeleton fails the typecheck as a missing and an excess property and fails the run at that step; a committed adopted registrar fails the regeneration preflight until it is regenerated; and an oracle that names a reworded Then step by its old `kind` fails the typecheck.",
          "Renaming or removing a key changes the step's contract key: a directly authored handler under the old key fails the typecheck, and when the key names a Then step of the example space, an oracle that names its old outcome `kind` fails the typecheck too. A key changes only when an author changes it.",
          "A step key is not an entry address: the address grammar gains no step segment, prose cites no step, and the location table records none. The generated contract and the code bound to it are a key's only readers, and the typechecker holds them to it; a review that cites one step cites its example Spec and the rules that example exercises.",
          "A step key mints no edge, confers no delivery fact and moves no readiness floor.",
        ],
        ruleKeys: {
          stepMarker: "rules[0]",
          markerRefusals: "rules[2]",
          oneKeyOneStep: "rules[3]",
          vocabularyHome: "rules[4]",
          contractKey: "rules[5]",
          rewordedStaysBound: "rules[7]",
          unkeyedBreaks: "rules[8]",
          renamedKey: "rules[9]",
        },
        exampleSpace: {
          given: [
            'the {carrier:"Markdown"|"Gherkin"|"TypeScript"} carriers of a parent whose example space declares the Given steps {vocabulary:string}',
            "a child example of that parent whose Given steps read {example:string}",
          ],
          when: [
            "the contracts are generated, the step lines are reworded by replacing {before:string} with {after:string}, and the contracts are generated again",
          ],
          then: [
            "the first extraction finding's message contains {extractMessage:string}",
            "the first contract finding about the child is {contractFinding:string}",
            "the child contract binds its first Given step as {bindingKey:string} and then as {rewordedBindingKey:string}",
            "the handlers bound to the first contract cover the second: {stillBound:boolean}",
            "the carriers imported to Markdown write the parent's first Given step as {importedStep:string} and keep every step key and step text: {keptOnImport:boolean}",
          ],
        },
      },
      design: {
        stepMarker:
          '`<keyword> [#<key>] <text>` is a keyed step in a `gwt` or `gwt-vocabulary` fence line and in a `.sdp.gherkin` step, with `<keyword>` one of `Given`, `When`, `Then` and `And`, and `"[#<key>] <text>"` is a keyed TypeScript step string; `<key>` matches `^[a-z][A-Za-z0-9]*$`.',
        stepKeysField:
          "`behavior.stepKeys` maps each key to the skeleton of the step it names, in authored order, the example space's steps before the examples' steps; the step strings hold the text with the marker removed; a Spec with no keyed step carries no `stepKeys`, and the serialized graph writes it after `exampleSpace`.",
        markerRefusal:
          "`step key markers must be [#<lower-camel ASCII key>] followed by one space and text` is the message, as the finding `extract/unrecognized-property` at severity error.",
        keyOnTwoSteps:
          '`step key "<key>" names two steps; a step key names one step within a Spec` is the message, as the same finding, at each step that carries the key.',
        twoKeysOnStep:
          '`step "<skeleton>" carries two step keys; a step carries one key within a Spec` is the message, as the same finding, at each step of that skeleton that carries a key.',
        stepPath:
          "a step refusal's path is `behavior.exampleSpace.<phase>[<i>]` or `behavior.examples[<n>].<phase>[<i>]`, with `<phase>` one of `given`, `when` and `then` and each index counting from 0; the finding carries the step's source line where its carrier reports one and the Spec's line otherwise.",
        conflictingKey:
          "`contracts/conflicting-step-key` is the contract-generation warning for an example marker that disagrees with its vocabulary step; it names the example, the step's skeleton, the marker's key and the vocabulary step's key or none, and the example's step contract and registrar are withheld.",
        importEmitter:
          "the TypeScript-to-Markdown import writes `[#<key>] ` at the start of every step of the Spec whose skeleton `stepKeys` maps the key to, so a keyed TypeScript Spec imports keyed.",
        keyedBinding:
          '`bindExample(contract, () => world, { cartSize: (world, { items }) => { … }, "the probe runs": (world) => { … } })` binds a keyed step by its key beside an unkeyed step bound by its skeleton.',
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.reworded-keyed-step-stays-bound",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.reworded-keyed-step-stays-bound.sdp.md",
    title: "A keyed step reworded in its vocabulary and its example keeps its binding",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the step key's acceptance: a step keyed in the parent's vocabulary keeps its contract key across a rewording, so the handlers bound before it still bind.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the child contract binds its first Given step as {bindingKey: "cartSize"} and then as {rewordedBindingKey: "cartSize"}',
              "the handlers bound to the first contract cover the second: {stillBound: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.reworded-unkeyed-step-breaks",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.reworded-unkeyed-step-breaks.sdp.md",
    title: "The same rewording without a key breaks the binding",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the contrast to the keyed rewording: an unkeyed step is keyed by its skeleton, so the same rewording renames it and the handlers bound before it no longer cover the contract.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the child contract binds its first Given step as {bindingKey: "a customer has a cart with {items} line items"} and then as {rewordedBindingKey: "the cart holds {items} line items"}',
              "the handlers bound to the first contract cover the second: {stillBound: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.gherkin-keyed-step-stays-bound",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.gherkin-keyed-step-stays-bound.sdp.md",
    title: "A keyed Gherkin step keeps its binding across a rewording",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the step marker in the Gherkin carrier, where the vocabulary lives in the `@example-space` pseudo-scenario and the child is an ordinary Scenario.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Gherkin"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the child contract binds its first Given step as {bindingKey: "cartSize"} and then as {rewordedBindingKey: "cartSize"}',
              "the handlers bound to the first contract cover the second: {stillBound: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.renamed-key-breaks",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.renamed-key-breaks.sdp.md",
    title: "Renaming a step key breaks the binding",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the renamed-key rule: a change of the key itself, with the wording left as it was, renames the step in the contract.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "cartSize"} with {after: "cartLines"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the child contract binds its first Given step as {bindingKey: "cartSize"} and then as {rewordedBindingKey: "cartLines"}',
              "the handlers bound to the first contract cover the second: {stillBound: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.repeated-key-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.repeated-key-refused.sdp.md",
    title: "One key on two vocabulary steps refuses the carrier",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the refusal of a key that names two steps of one Spec.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items; [#cartSize] the cart is open"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items; the cart is open"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: "names two steps; a step key names one step within a Spec"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.two-keys-on-one-step-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.two-keys-on-one-step-refused.sdp.md",
    title: "Two keys on one step refuse the carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the refusal of one step, written twice in a vocabulary, that carries a different key each time.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items; [#cartLines] a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: "carries two step keys; a step carries one key within a Spec"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.malformed-marker-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.malformed-marker-refused.sdp.md",
    title: "A step marker whose key is off the grammar refuses the carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the marker refusal on step text that opens with a marker whose key is not lower-camel ASCII.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cart-size] a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: "step key markers must be [#<lower-camel ASCII key>] followed by one space and text"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.conflicting-example-key-withheld",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.conflicting-example-key-withheld.sdp.md",
    title: "An example marker that disagrees with its vocabulary withholds the contract",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the shared-key rule: an example step keyed apart from the vocabulary step it resolves to gets no step contract, and the finding names the conflict.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "[#basketSize] a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the first contract finding about the child is {contractFinding: "contracts/conflicting-step-key"}',
              'the child contract binds its first Given step as {bindingKey: ""} and then as {rewordedBindingKey: ""}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.key-equal-to-a-skeleton-withheld",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.key-equal-to-a-skeleton-withheld.sdp.md",
    title: "A step key equal to another step's skeleton withholds the contract",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the contract-key collision: a keyed step and an unkeyed step whose skeleton is that key would share one contract key, so extraction accepts both and contract generation withholds the child's step contract with a named finding.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] the cart has {items:number} items; cartSize"}',
              'a child example of that parent whose Given steps read {example: "the cart has {items: 2} items; cartSize"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "the cart has"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the first contract finding about the child is {contractFinding: "contracts/duplicate-step-key"}',
              'the child contract binds its first Given step as {bindingKey: ""} and then as {rewordedBindingKey: ""}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.step-keys.typescript-keyed-step-imports-keyed",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/step-keys.typescript-keyed-step-imports-keyed.sdp.md",
    title: "A keyed TypeScript step keeps its key through import to Markdown",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the step marker in the TypeScript carrier: a keyed step string keeps its contract key across a rewording, and importing the carriers to Markdown writes the marker and extracts to the same step keys and step text.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the {carrier: "TypeScript"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}',
              'a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}',
            ],
            when: [
              'the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again',
            ],
            then: [
              'the first extraction finding\'s message contains {extractMessage: ""}',
              'the child contract binds its first Given step as {bindingKey: "cartSize"} and then as {rewordedBindingKey: "cartSize"}',
              'the carriers imported to Markdown write the parent\'s first Given step as {importedStep: "Given [#cartSize] the cart holds {items:number} line items"} and keep every step key and step text: {keptOnImport: true}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
