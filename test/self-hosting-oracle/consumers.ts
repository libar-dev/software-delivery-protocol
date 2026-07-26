// The authored descriptors of the `consumers` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const consumersSpecs = [
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
    id: "spec:consumers.derived-readiness-banner",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/derived-readiness-banner.sdp.md",
    title: "Derived readiness renders beside the stated rung and warns in one direction",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Show a reader where a Spec's stated maturity stands against the structure it earns, without turning a floor into a quota.",
      },
      behavior: {
        rules: [
          "Derived readiness is the highest rung whose cumulative floor clauses pass. It is computed from the graph, rendered beside the author's statement, and never overwrites it.",
          "Every spec page renders the stated rung beside the floor reached, on one line, whether or not the two agree; the index and the pack member table carry the same pair as two columns.",
          "The divergence banner is raised only in the dishonest direction — the floor reached standing below the stated rung. A floor reached at or above the stated rung raises nothing, because a floor is a floor and never a quota that nags upward.",
          "A raised banner names the first unmet clause by its clause id and its description, so the reader is told which clause to satisfy rather than only that something is wrong.",
          "When even the `idea` floor is unmet, the floor reached renders as none rather than as a rung, and a raised banner states that the floor stands below `idea`.",
          "The banner is rendering, never a check: the same divergence is already the readiness floor's own finding, and the page shows it in context rather than gating on it.",
          "The realizing entrypoint is `renderReadiness` in `src/projections/design-review-context.ts`; the rung it renders is the derived readiness the one clause table yields.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a rule spec {specId:string} whose stated readiness is {statedReadiness:"scoped"|"ready"}',
            'the spec {structure:"clears every floor clause"|"records a blocking open question"}',
          ],
          when: ["the Design Review renders the graph"],
          then: [
            'the spec page renders the floor reached {floorReached:"scoped"|"ready"}',
            "the divergence banner is raised: {bannerRaised:boolean}",
            "the banner names the first unmet clause {clauseId:string}",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.derived-readiness-banner.dishonest-divergence",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/derived-readiness-banner.dishonest-divergence.sdp.md",
    title: "An overstated rung raises the banner and names the clause that refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the dishonest direction, where the page must name the first clause the structure leaves unmet.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a rule spec {specId: "spec:probe.overstated-rung"} whose stated readiness is {statedReadiness: "ready"}',
              'the spec {structure: "records a blocking open question"}',
            ],
            when: ["the Design Review renders the graph"],
            then: [
              'the spec page renders the floor reached {floorReached: "scoped"}',
              "the divergence banner is raised: {bannerRaised: true}",
              'the banner names the first unmet clause {clauseId: "no-blocking-open-questions"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.derived-readiness-banner.honest-headroom",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/derived-readiness-banner.honest-headroom.sdp.md",
    title: "A rung the structure overshoots renders as information, not as a banner",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the honest direction, where the line still renders both rungs and nothing nags the author upward.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a rule spec {specId: "spec:probe.understated-rung"} whose stated readiness is {statedReadiness: "scoped"}',
              'the spec {structure: "clears every floor clause"}',
            ],
            when: ["the Design Review renders the graph"],
            then: [
              'the spec page renders the floor reached {floorReached: "ready"}',
              "the divergence banner is raised: {bannerRaised: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.binding-language-views",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/binding-language-views.sdp.md",
    title: "Views speak binding language, never the internal fact name",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep a reader from reading a delivery fact as a liveness claim the graph never made.",
      },
      behavior: {
        rules: [
          "The delivery-fact names stay internal. They are the graph's own vocabulary and the drift queries read them; no rendered surface shows one as user-facing label text.",
          "A spec page's bindings block renders four labelled lines — implementation binding, verifier binding, expected-outcome oracle, and runtime observation.",
          "The three binding lines read present or none, and nothing else: what a binding says is that a resolving anchor exists, so the reader is offered existence rather than a degree.",
          "Runtime observation always reads not tracked. No delivery fact records it, and the view states the absence instead of leaving a reader to infer it from a missing line.",
          "The pack member table and the index table carry the same two binding columns, with the same present and none values, so the aggregate surfaces speak the page's language rather than a shorthand of their own.",
          "The model half of this rule — that a binding states existence and never liveness — belongs to the decision this Spec is shaped by; what is stated here is only what the views render.",
          "The realizing entrypoints are `renderBindings` in `src/projections/design-review-context.ts` and the member and index tables in `src/projections/design-review-pages.ts`.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} bound by {bindings:"an implementing code anchor and a verifying test anchor"|"no anchor at all"}',
            "the graph holds a pack {packId:string} listing that spec beside an unbound member",
          ],
          when: ["the Design Review renders the graph"],
          then: [
            'the spec page renders the implementation binding as {implementation:"present"|"none"}',
            'the spec page renders the verifier binding as {verifier:"present"|"none"}',
            "the spec page renders the runtime observation as {observation:string}",
            "the index table repeats those binding values for the spec: {tableRepeats:boolean}",
            "the pack member table repeats those binding values for the spec: {memberTableRepeats:boolean}",
            "the internal delivery-fact name {factName:string} appears as rendered label text: {factNameRendered:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.binding-language-views.bound-spec-page",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/binding-language-views.bound-spec-page.sdp.md",
    title: "A fully bound spec renders binding language on the page and in the index",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the rendered vocabulary on a spec both anchors reach, where the internal fact name would be easiest to leak.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.bound-surface"} bound by {bindings: "an implementing code anchor and a verifying test anchor"}',
            ],
            when: ["the Design Review renders the graph"],
            then: [
              'the spec page renders the implementation binding as {implementation: "present"}',
              'the spec page renders the verifier binding as {verifier: "present"}',
              'the spec page renders the runtime observation as {observation: "not tracked"}',
              "the index table repeats those binding values for the spec: {tableRepeats: true}",
              'the internal delivery-fact name {factName: "implemented"} appears as rendered label text: {factNameRendered: false}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.binding-language-views.pack-member-table",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/binding-language-views.pack-member-table.sdp.md",
    title: "The pack member table speaks the page's binding language, not a shorthand",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the aggregate half of the rule on the surface a reviewer reads a whole pack from, where a two-column yes/no shorthand would be cheapest to reach for.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.bound-surface"} bound by {bindings: "an implementing code anchor and a verifying test anchor"}',
              'the graph holds a pack {packId: "pack:probe.review-aggregate"} listing that spec beside an unbound member',
            ],
            when: ["the Design Review renders the graph"],
            then: [
              "the pack member table repeats those binding values for the spec: {memberTableRepeats: true}",
              'the internal delivery-fact name {factName: "implemented"} appears as rendered label text: {factNameRendered: false}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.wholesale-view-rewrite",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/wholesale-view-rewrite.sdp.md",
    title: "Every view run rewrites the view wholesale",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Guarantee that whatever a reader finds in the view directory was produced by the last run over the current source.",
      },
      behavior: {
        rules: [
          "A view run rewrites the view wholesale: no page written by an earlier run survives a later one, so a spec that left the corpus leaves no page behind.",
          "Pages are written to a temporary sibling of the view directory, the previous directory is removed, and the temporary is renamed into place — one rename, so no half-written view is ever readable and no temporary survives a completed run.",
          "A run that cannot produce a current view removes the stale one instead of leaving it readable as current: an absent view is honest, a stale view is not.",
          "The invalidation happens before rendering as well as after it: the build the run passes through removes any existing view up front, so a run that fails before rendering leaves nothing behind either.",
          "Under `--check-clean` the view is rendered twice from the same graph and the run refuses when the two renders diverge, removing the view it could not certify.",
          "Findings never withhold the view. A run whose checks report findings still writes the current view and returns the checks' own exit code, because the view is where those findings are read in context.",
          "The realizing entrypoint is `runView` in `src/cli/validate-view-command.ts`, with the up-front invalidation in `runBuild` in `src/cli/build-command.ts`.",
        ],
        exampleSpace: {
          given: [
            'an extraction root holding {corpus:"one authored spec"|"one authored spec the extractor refuses"} and a stale view page {stalePage:string}',
            'the stale page is planted {planted:"before the run"|"after the build has invalidated the view"}',
          ],
          when: ['the {command:"view"|"build"} command runs at that root'],
          then: [
            "the run exits {exitCode:number}",
            "the view directory survives: {viewSurvives:boolean}",
            "the view holds the current page {currentPage:string}",
            "the stale page survives: {staleSurvives:boolean}",
            "a temporary view sibling survives: {temporarySurvives:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.wholesale-view-rewrite.stale-page-removed",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/wholesale-view-rewrite.stale-page-removed.sdp.md",
    title: "A page from an earlier run does not survive the next one",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the wholesale rewrite against the case it exists for — a page whose subject the current source no longer holds.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding {corpus: "one authored spec"} and a stale view page {stalePage: "spec/probe.departed.md"}',
              'the stale page is planted {planted: "before the run"}',
            ],
            when: ['the {command: "view"} command runs at that root'],
            then: [
              "the run exits {exitCode: 0}",
              "the view directory survives: {viewSurvives: true}",
              'the view holds the current page {currentPage: "index.md"}',
              "the stale page survives: {staleSurvives: false}",
              "a temporary view sibling survives: {temporarySurvives: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.wholesale-view-rewrite.late-stale-page",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/wholesale-view-rewrite.late-stale-page.sdp.md",
    title: "A page the build's invalidation never saw still does not survive the swap",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the swap against a page the up-front invalidation cannot have removed, so the rename into place is what evicts it.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding {corpus: "one authored spec"} and a stale view page {stalePage: "spec/probe.departed.md"}',
              'the stale page is planted {planted: "after the build has invalidated the view"}',
            ],
            when: ['the {command: "view"} command runs at that root'],
            then: [
              "the run exits {exitCode: 0}",
              "the view directory survives: {viewSurvives: true}",
              'the view holds the current page {currentPage: "index.md"}',
              "the stale page survives: {staleSurvives: false}",
              "a temporary view sibling survives: {temporarySurvives: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.wholesale-view-rewrite.failed-run-view-removed",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/wholesale-view-rewrite.failed-run-view-removed.sdp.md",
    title: "A run that cannot produce a current view leaves no view at all",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the honest-absence half of the law on a run that fails before it can render, where leaving the old view would read as current.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding {corpus: "one authored spec the extractor refuses"} and a stale view page {stalePage: "spec/probe.departed.md"}',
              'the stale page is planted {planted: "after the build has invalidated the view"}',
            ],
            when: ['the {command: "view"} command runs at that root'],
            then: [
              "the run exits {exitCode: 1}",
              "the view directory survives: {viewSurvives: false}",
              "the stale page survives: {staleSurvives: false}",
              "a temporary view sibling survives: {temporarySurvives: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.wholesale-view-rewrite.build-invalidates-view",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/wholesale-view-rewrite.build-invalidates-view.sdp.md",
    title: "A build that never renders still takes the old view down",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the up-front half of the invalidation on a command that writes no view, where a surviving directory would describe a graph that has moved.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding {corpus: "one authored spec"} and a stale view page {stalePage: "spec/probe.departed.md"}',
              'the stale page is planted {planted: "before the run"}',
            ],
            when: ['the {command: "build"} command runs at that root'],
            then: [
              "the run exits {exitCode: 0}",
              "the view directory survives: {viewSurvives: false}",
              "the stale page survives: {staleSurvives: false}",
              "a temporary view sibling survives: {temporarySurvives: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
