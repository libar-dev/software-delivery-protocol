// The authored descriptors of the `consumers` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const consumersSpecs = [
  {
    id: "spec:consumers.mermaid-view",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/mermaid-view.sdp.md",
    title: "Mermaid renders bounded one-hop and Pack diagrams without becoming a graph browser",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give maintainers disposable, deterministic Mermaid diagrams of each Spec's one-hop neighborhood and each Pack's membership without ever projecting the whole graph or inventing a second truth store.",
      },
      behavior: {
        rules: [
          "`renderMermaid` is a pure `Reader -> pages` projection with no filesystem or clock access; equal reader data produces byte-identical pages.",
          "The page set is one diagram per Spec (that Spec plus its one-hop neighborhood), one diagram per Pack (the Pack and its members), and one deterministic index that links them. The projection never emits a whole-graph diagram.",
          "Machine node tokens are injective encodings of the full graph ID. Titles and other display text never become machine tokens.",
          "Visible labels use a dedicated Mermaid label escape (`escapeMermaidLabel`) that is parser-safe for Mermaid syntax. The Markdown/owned-prose escaper is not reused.",
          "Every emitted record — pages, node declarations, edge declarations, index rows — is ordered by deterministic code-unit order independent of graph input order.",
          "An unresolved relation or edge target renders as an explicit unresolved placeholder node rather than disappearing or being invented.",
          "Cycles are retained as ordinary edges with a visited-set walk; the projection never computes transitive closure and never performs layout.",
          "Disconnected neighborhoods and foreign edge types remain visible when they appear in the selected one-hop or Pack slice; absence of a neighbor is honest silence, not a synthetic hub.",
          "Hard bounds are exact: `maxNodesPerDiagram = 64` and `maxEdgesPerDiagram = 128`. A token collision or an overflow of either bound refuses the affected diagram with a deterministic refusal that names the bound, while every in-bound diagram still publishes and the command exits 0. The projection never silently truncates, shards partially, drops edges to fit, or aborts the whole page set because one diagram overflowed.",
          "Publication owns only `generated/mermaid/` and uses the explicit `sdp mermaid` surface. It is not a child of or an extra write inside Design Review's transaction, and it shares no publication bus or hidden side channel with other projections.",
          "A Mermaid run writes its complete page set to `generated/mermaid.tmp/`, removes the prior Mermaid root, and renames the temporary root into place. Every build attempt invalidates both Mermaid roots before extraction, so failure leaves honest absence rather than stale output that looks current. A failed publish removes any live or temporary Mermaid root it cannot certify.",
          "`sdp mermaid --check-clean` renders an independent twin, refuses divergent renders, and compares the current generated root with the new render. Missing or drifted output returns nonzero and is removed; clean output is replaced wholesale with byte-identical content.",
          "When extraction succeeds but graph validation reports errors, Mermaid still publishes the labelled diagnostic projection and returns the nonzero validation exit code.",
          "The projection adds no Mermaid-specific Reader accessors, maintains no projection-owned taxonomy list, and confers nothing back into the graph.",
        ],
        exampleSpace: {
          given: [
            "a graph containing Specs, Packs, one-hop relations, an unresolved target, a cycle, and a neighborhood within the stated bounds",
          ],
          when: [
            "the Mermaid projection renders and publishes through the explicit mermaid command",
          ],
          then: [
            "each Spec page holds only that Spec's one-hop neighborhood",
            "each Pack page holds only that Pack and its members",
            "the index links every diagram deterministically",
            "machine tokens remain injective full-ID encodings",
            "hostile label characters cannot close or break Mermaid syntax",
            "an unresolved target renders as an explicit placeholder",
            "a colliding token or a diagram past maxNodesPerDiagram = 64 or maxEdgesPerDiagram = 128 is refused by name while every in-bound diagram still publishes",
            "generated/mermaid/ is the only current Mermaid root",
            "a clean independent render is byte-identical",
            "validation errors label the index as a diagnostic projection",
            "no whole-graph diagram is emitted",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.gherkin-view",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/gherkin-view.sdp.md",
    title: "Gherkin view renders any Spec as a disposable read shape",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give maintainers a generated Gherkin-shaped READ projection of any Spec without creating a second carrier, a default flip, or round-trip parity.",
      },
      behavior: {
        rules: [
          "`renderGherkinView` is a pure `Reader -> pages` projection with no filesystem or clock access; equal reader data produces byte-identical pages.",
          "Every Spec renders as one Gherkin-shaped page plus one deterministic index. Packs are not projected. The projection never uses `.sdp.gherkin` and never claims round-trip parity.",
          "Each page is visibly generated and disposable. Refused kinds carry lossy commentary naming the per-kind lie-reason; content Gherkin cannot carry honestly is marked the same way rather than invented as structure.",
          "Description prose lands only on MD-19's existing owners — narrative or keyed description bullets — and the projection never emits DocStrings, DataTables, Scenario Outlines, Examples tables, backgrounds, star steps, or leading conjunctions.",
          "Every emitted record is ordered by deterministic code-unit order independent of graph input order. Hostile characters are escaped so they cannot close a fence or invent a DocString.",
          "Publication owns only `generated/gherkin/` and uses the explicit `sdp gherkin` surface. It is not a child of or an extra write inside Design Review's transaction, and it shares no publication bus or hidden side channel with other projections.",
          "A Gherkin-view run writes its complete page set to `generated/gherkin.tmp/`, removes the prior Gherkin-view root, and renames the temporary root into place. Every build attempt invalidates both Gherkin-view roots before extraction, so failure leaves honest absence rather than stale output that looks current. A failed publish removes any live or temporary Gherkin-view root it cannot certify.",
          "`sdp gherkin --check-clean` renders an independent twin, refuses divergent renders, and compares the current generated root with the new render. Missing or drifted output returns nonzero and is removed; clean output is replaced wholesale with byte-identical content.",
          "When extraction succeeds but graph validation reports errors, the Gherkin view still publishes the labelled diagnostic projection and returns the nonzero validation exit code.",
          "The projection adds no Gherkin-specific Reader accessors and confers nothing back into the graph.",
        ],
        exampleSpace: {
          given: [
            "a graph containing behavior, example, and refused-kind Specs with hostile titles",
          ],
          when: [
            "the Gherkin-view projection renders and publishes through the explicit gherkin command",
          ],
          then: [
            "each Spec page is a visibly generated Gherkin-shaped read",
            "refused-kind pages carry the per-kind lie-reason as lossy commentary",
            "a clean independent render is byte-identical",
            "hostile characters cannot close a fence or invent a DocString",
            "generated/gherkin/ is the only current Gherkin-view root",
            "validation errors label the index as a diagnostic projection",
            "no page uses the .sdp.gherkin suffix",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
        openQuestions: [
          {
            question:
              "Does the pure-projection binding-language law stated in src/projections/design-review.ts commentary promote here or to a story-altitude child under comment promotion?",
            blocking: false,
          },
        ],
      },
      model: {
        terms: {
          baseline:
            "A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.",
          "curated graph":
            "The authored architectural read model of declared intent and anchored bindings, valued for editorial sparsity.",
          curation:
            "The deliberate difference between the sparse curated graph and the code-structure surface; it is not drift.",
          "diagnostic publication posture":
            "After extraction succeeds, a projection publishes its honestly labelled graph view even when validation reports errors, and returns the validation exit code so findings remain both visible and nonzero.",
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
    readiness: "ready",
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
          "An agent arrives holding a concept string, a file it is editing, or the changeset a diff touches, and not the Spec id it is looking for, so the surface is designed around those entry points rather than around lookup by id.",
          "The string entry is `findByConcept`, the file entry is `byFile`, and the changeset entry is `blastRadius`, whose answer names every coverage-unknown changed file rather than dropping it into silence.",
          "The symbol entry is designed for and deferred: `bySymbol` would resolve through the aspirational impact graph, no such substrate exists, and the adapter is absent rather than stubbed so its absence cannot read as a landed capability.",
          "Past those entry adapters the surface grows by recipe and not by verb: a join is frozen into the reader only when a second machine consumer needs it and hand-rolled attempts get it wrong, and every other question stays a body an agent scripts.",
        ],
        exampleSpace: {
          given: [
            "an extraction root the front door derives in process on the invocation",
            "the corpus binds the spec {specId:string} to one anchored verifier and one declared-only verifier",
            "the agent holds the concept {concept:string}, the file {file:string}, and a changeset that also touches the unrecorded file {unrecordedFile:string}",
          ],
          when: [
            'the agent scripts a body {body:"composing that spec\'s verifier bindings"|"reaching every entry point the demand map names"} through the front door',
          ],
          then: [
            "the front door exits {exitCode:number} with an empty error stream",
            "the printed answer is exactly the body's pre-shaped return {printedAnswer:string}",
            "the anchored verifier {anchoredVerifierId:string} decodes as enabled while the declared-only verifier {declaredVerifierId:string} does not",
            "the concept entry answers with the spec {conceptSpecId:string}",
            "the file entry answers with the spec {fileSpecId:string}",
            "the changeset entry answers with the impacted spec {changesetSpecId:string}",
            "the surface offers a symbol entry: {symbolEntry:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.design-review",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
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
          "The page set is a function of the graph alone — it carries no timestamp, no commit, and no run identity — so two renders of the same corpus are byte-identical.",
          "Rendering encodes by Markdown syntax context: prose and table fields escape structural characters, each entry of a `design` or `ui` section renders as a list item in authored order with its key as inline code, as ruled by `spec:decisions.authored-entry-order`, fenced JSON preserves a structured value inside one entry through JSON encoding, and inline code uses a delimiter that preserves literal backticks.",
          "The realizing entrypoint is `renderDesignReview` in `src/projections/design-review.ts`, which reads the reader and returns pages; writing them is the caller's job.",
        ],
        exampleSpace: {
          given: [
            "an extraction root holding a Pack, its member Specs, and one member the checks warn about",
          ],
          when: ["the Design Review renders the graph derived from that root"],
          then: [
            "the page set holds the index page {indexPage:string}, one page per Spec, and one page per Pack",
            "the page {packPage:string} renders its members in context",
            "the page {specPage:string} renders the finding {findingId:string} as data",
            "a second render from a freshly derived graph is byte-identical: {byteIdentical:boolean}",
            "the render leaves the extraction root byte-identical: {rootUntouched:boolean}",
          ],
        },
      },
      ui: {
        description:
          "The generated Design Review exposes three page anatomies from the same graph.",
        specPage:
          "A Spec page presents descriptors, readiness, relations, bindings, authored sections, and findings in one context.",
        packPage:
          "A Pack page presents framing, model references, and a member table in the manifest's authored order with each member's kind, altitude, readiness, and implementation and verifier bindings.",
        indexPage:
          "The index presents one sortable-style Markdown table for Specs and a linked bullet list for Packs, with stable links into their detail pages.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.census-page",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/census-page.sdp.md",
    title: "Census renders the runtime taxonomy without becoming a registry",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give maintainers one disposable graph-derived census that exposes the complete runtime taxonomy, foreign values, readiness divergence, binding flavor, and current findings without creating another source of truth.",
      },
      behavior: {
        rules: [
          "`renderCensus` is a pure `Reader -> pages` projection with no filesystem or clock access; every page, row, and finding is deterministically sorted so equal reader data produces byte-identical output.",
          "Spec kind rows and their display labels, altitude rows, and readiness rows derive from `SPEC_KINDS`, `SPEC_KIND_DISPLAY_LABELS`, `SPEC_ALTITUDES`, and `SPEC_READINESS`; graph node, claim, delivery-fact, and edge rows derive from `graphNodeTypes`, `graphClaims`, `deliveryFactNames`, and `graphEdgeTypes`. Every exported runtime category renders even at count zero; no projection-owned taxonomy list is maintained.",
          "A foreign value outside an exported runtime taxonomy renders as a deterministic `unrecognized` row sorted by its literal value rather than disappearing or being coerced into a known category.",
          "Stated readiness and structurally derived readiness render as separate dimensions, including a count for Specs that have not structurally reached the first derived rung; the census never resolves or confers readiness.",
          "Anchor flavor is counted from each binding node's graph node type, ID namespace, and outgoing binding edge, so structural bindings are visible as graph data and their absence is stated rather than inferred.",
          "Findings come only from `reader.findings()`, the one validation report exposed as data; the projection never re-runs or re-implements validation.",
          "The census is regenerable and disposable under `generated/census/index.md`; it confers nothing, writes no canonical source, and never becomes a second registry or truth store.",
          "Publication uses the explicit `sdp census` surface and owns only `generated/census/`. It is not a child of or an extra write inside Design Review's transaction.",
          "A census run writes its complete page set to `generated/census.tmp/`, removes the prior census root, and renames the temporary root into place. Every build attempt invalidates both census roots before extraction, so failure leaves honest absence rather than stale output that looks current.",
          "`sdp census --check-clean` renders an independent twin, refuses divergent renders, and compares the current generated root with the new render. Missing or drifted output returns nonzero and is removed; clean output is replaced wholesale with byte-identical content.",
          "When extraction succeeds but graph validation reports errors, census still publishes the labelled diagnostic projection and returns the nonzero validation exit code.",
        ],
        exampleSpace: {
          given: [
            "a graph containing known runtime categories, foreign taxonomy values, bindings, readiness divergence, and findings",
          ],
          when: ["the census projection renders and publishes through the explicit census command"],
          then: [
            "every runtime category remains visible including zero-count rows",
            "foreign values render as deterministic unrecognized rows",
            "stated and derived readiness remain separate dimensions",
            "findings equal the values returned by reader.findings()",
            "generated/census/index.md is the only current census page",
            "a clean independent render is byte-identical",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.reader",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/reader.sdp.gherkin",
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
          "`findByConcept` matches a string against every field the graph records — ids, titles, anchor labels, Pack framing, narrative, and reified section content — and names the fields a node matched on rather than returning a bare hit.",
          "`byFile` answers with the nodes the graph records at the path and with the Specs those nodes reach, so a source file carrying a binding names the Spec it binds and a carrier file names the Spec authored in it.",
          "The reader's `blastRadius` surface maps changed files to directly impacted Specs and Packs, their explicit one-hop at-risk neighbors, and every coverage-unknown file.",
          "Every impact and at-risk answer carries its reason as data — the changed file, the binding it travelled through, the connecting edge, and that edge's claim — so nothing about the reach is left to the caller's inference.",
          "File-level blast radius reports curated graph reach without claiming exhaustive symbol-level usage reach.",
          "`packContext` lists one member row per manifest entry in the manifest's authored order, and its verifier gaps follow that order.",
          "The realizing entrypoint is `createReader` in `src/reader/reader.ts`.",
        ],
        exampleSpace: {
          given: [
            "a reader built over the graph a real extraction derives from the probe root",
            "the concept {concept:string} appears in the corpus only inside the recorded context of {conceptSpecId:string}",
            "the source file {boundFile:string} carries the binding {bindingId:string}",
            "the changeset also holds the file {unrecordedFile:string} the graph records nothing at",
          ],
          when: ['the reader answers the {entry:"concept"|"file"|"changeset"} entry'],
          then: [
            "the reader names {matchedId:string} as a match on the field {matchedField:string}",
            "the reader names {matchCount:number} matches in all",
            "the file entry names the node {nodeId:string} the graph records at that path",
            "the file entry reaches the spec {reachedSpecId:string} that binding names",
            "the spec carrier {carrierFile:string} answers with its own spec {carrierSpecId:string}",
            "the impacted specs name {impactedSpecId:string} through the binding {impactBindingId:string} at claim {impactClaim:string}",
            "the one-hop at-risk neighbors name {atRiskId:string} through the edge {atRiskEdge:string} at claim {atRiskClaim:string}",
            "the at-risk neighbors number {atRiskCount:number}",
            "the coverage-unknown files name {coverageUnknownFile:string}",
            "the coverage-unknown files number {coverageUnknownCount:number}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
    deliveryFacts: ["implemented", "has-verifier"],
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
    deliveryFacts: ["implemented", "has-verifier"],
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
    deliveryFacts: ["implemented", "has-verifier"],
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
  {
    id: "spec:consumers.agent-surface.scripted-context-body",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.scripted-context-body.sdp.md",
    title: "A scripted body returns claim-decoded context, pre-shaped by the body",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the whole path an agent uses — a root, the extractor, the graph, the injected reader, one scripted body — and read back the decode a hand-rolled join gets wrong.",
      },
      behavior: {
        examples: [
          {
            given: [
              "an extraction root the front door derives in process on the invocation",
              'the corpus binds the spec {specId: "spec:orders.create-order"} to one anchored verifier and one declared-only verifier',
            ],
            when: [
              'the agent scripts a body {body: "composing that spec\'s verifier bindings"} through the front door',
            ],
            then: [
              "the front door exits {exitCode: 0} with an empty error stream",
              'the printed answer is exactly the body\'s pre-shaped return {printedAnswer: "spec:orders.create-order.empty-cart is a declared verifier · spec:orders.create-order.valid-cart is an enabled verifier"}',
              'the anchored verifier {anchoredVerifierId: "spec:orders.create-order.valid-cart"} decodes as enabled while the declared-only verifier {declaredVerifierId: "spec:orders.create-order.empty-cart"} does not',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.demand-map-entries",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.demand-map-entries.sdp.md",
    title: "One body reaches every entry point the demand map names, and no symbol entry",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the demand map end to end — a string, a file, and a changeset each answered through the front door — and read the deferred symbol entry as honestly absent.",
      },
      behavior: {
        examples: [
          {
            given: [
              "an extraction root the front door derives in process on the invocation",
              'the agent holds the concept {concept: "backorder"}, the file {file: "src/create-order.ts"}, and a changeset that also touches the unrecorded file {unrecordedFile: "src/price-book.ts"}',
            ],
            when: [
              'the agent scripts a body {body: "reaching every entry point the demand map names"} through the front door',
            ],
            then: [
              "the front door exits {exitCode: 0} with an empty error stream",
              'the concept entry answers with the spec {conceptSpecId: "spec:orders.order-management"}',
              'the file entry answers with the spec {fileSpecId: "spec:orders.create-order"}',
              'the changeset entry answers with the impacted spec {changesetSpecId: "spec:orders.create-order"}',
              "the surface offers a symbol entry: {symbolEntry: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.reader.concept-entry",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/reader.sdp.gherkin",
    title:
      "A concept recorded only inside a Spec's sections is still reached, and the field is named",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the string entry against the case a title-and-id lookup would miss, and read back the field the match was recorded in.",
      },
      behavior: {
        examples: [
          {
            given: [
              "a reader built over the graph a real extraction derives from the probe root",
              'the concept {concept: "backorder"} appears in the corpus only inside the recorded context of {conceptSpecId: "spec:orders.order-management"}',
            ],
            when: ['the reader answers the {entry: "concept"} entry'],
            then: [
              'the reader names {matchedId: "spec:orders.order-management"} as a match on the field {matchedField: "sections.behavior"}',
              "the reader names {matchCount: 1} matches in all",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.reader.file-entry",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/reader.sdp.gherkin",
    title: "A source file reaches the Spec its binding names, and a carrier reaches its own Spec",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the file entry on both halves it has to bridge — a source file the graph records only a binding at, and the carrier a Spec is authored in.",
      },
      behavior: {
        examples: [
          {
            given: [
              "a reader built over the graph a real extraction derives from the probe root",
              'the source file {boundFile: "src/create-order.ts"} carries the binding {bindingId: "impl:orders.create-order"}',
            ],
            when: ['the reader answers the {entry: "file"} entry'],
            then: [
              'the file entry names the node {nodeId: "impl:orders.create-order"} the graph records at that path',
              'the file entry reaches the spec {reachedSpecId: "spec:orders.create-order"} that binding names',
              'the spec carrier {carrierFile: "specs/create-order.sdp.md"} answers with its own spec {carrierSpecId: "spec:orders.create-order"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.reader.changeset-entry",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/reader.sdp.gherkin",
    title: "A changeset names what it reaches, why, and what it cannot see",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the changeset entry on a mixed changeset, so the impacted reason, the one-hop at-risk edge with its claim, and the coverage-unknown file are all read from one answer.",
      },
      behavior: {
        examples: [
          {
            given: [
              "a reader built over the graph a real extraction derives from the probe root",
              'the source file {boundFile: "src/create-order.ts"} carries the binding {bindingId: "impl:orders.create-order"}',
              'the changeset also holds the file {unrecordedFile: "src/price-book.ts"} the graph records nothing at',
            ],
            when: ['the reader answers the {entry: "changeset"} entry'],
            then: [
              'the impacted specs name {impactedSpecId: "spec:orders.create-order"} through the binding {impactBindingId: "impl:orders.create-order"} at claim {impactClaim: "anchored"}',
              'the one-hop at-risk neighbors name {atRiskId: "spec:orders.order-management"} through the edge {atRiskEdge: "refines"} at claim {atRiskClaim: "declared"}',
              "the at-risk neighbors number {atRiskCount: 4}",
              'the coverage-unknown files name {coverageUnknownFile: "src/price-book.ts"}',
              "the coverage-unknown files number {coverageUnknownCount: 1}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.design-review.pure-projection",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/design-review.pure-projection.sdp.md",
    title: "The view is the graph read twice, and the corpus is untouched by reading it",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the parent's own law — an index beside a page per Spec and per Pack, a finding rendered as data, byte-identical repeat renders, and nothing written anywhere.",
      },
      behavior: {
        examples: [
          {
            given: [
              "an extraction root holding a Pack, its member Specs, and one member the checks warn about",
            ],
            when: ["the Design Review renders the graph derived from that root"],
            then: [
              'the page set holds the index page {indexPage: "index.md"}, one page per Spec, and one page per Pack',
              'the page {packPage: "pack/orders-v1.md"} renders its members in context',
              'the page {specPage: "spec/orders.create-order.empty-cart.md"} renders the finding {findingId: "conformance/verifies-linkage"} as data',
              "a second render from a freshly derived graph is byte-identical: {byteIdentical: true}",
              "the render leaves the extraction root byte-identical: {rootUntouched: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.authoring-on-ramp",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/authoring-on-ramp.sdp.md",
    title: "Authors move one Spec from intent to reviewed evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give an agent or human one graph-first path for creating, enriching, binding, and reviewing a Spec without inventing a parallel workflow.",
      },
      behavior: {
        rules: [
          "An author starts from the build-backlog and drift-alarm recipes, reads carrying Specs for law, and edits the canonical carrier.",
          "Cheap capture starts with `sdp new spec` (or the equivalent hand-authored idea carrier) in the family found through concept search; the scaffolder emits envelope, Intent outcome, and the kind's bare typed heading, never invented content, and for `constraint` emits envelope, title, and Intent only with no twin section. Every later readiness edit is preceded by the promotion-preflight recipe and remains a human statement.",
          "Binding is taught across the three anchor builders `codeAnchor`, `specTest`, and `specOracle`, one realization target per anchor, naming the two silent non-binding hazards: only the anchor-constant form is extracted, and a builder call through an untrusted import mints nothing and reports nothing.",
          "Structural binding is taught through the `component` and `uses` fields of `codeAnchor` as closed graph-ID references: at most one component per source, no `implements` field, and `uses` cycles remain data rather than findings.",
          "The executable transition is taught as parent example space, child bound point, generated contracts, the oracle bound by a `specOracle` anchor, and one generated-registrar activation beside the authored suite's top-level `specTest` anchor, with `bindExample` named as the low-level adapter and a mutation-probed red result required before the human states `ready`.",
          "Contract-generation refusals are diagnosed through `sdp build`; query-time validation does not claim to report codegen findings.",
          "Verifier-binding queries report graph-visible anchors; the `specTest` anchor remains the sole `has-verifier` source, and the graph cannot detect a generated contract or registrar that no authored suite activates.",
          "Implementation anchors state identity-only bindings, and a Markdown deliverable binds through the document-realization convention: the suite asserting the shipped document carries the code anchor, and blast radius stays coverage-unknown for the Markdown file.",
          "Design Review supplies context for the human readiness statement without becoming a workflow gate.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.delivery-session-on-ramp",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/delivery-session-on-ramp.sdp.md",
    title: "Delivery sessions route work from current graph state",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let an agent enter capture, design, implementation, review, or close work from current graph evidence without inventing workflow state or gates.",
      },
      behavior: {
        rules: [
          "Work shapes are advisory entries over the same current graph; they are neither phases nor a required sequence, and a session may enter or revisit any shape.",
          "Capture or refinement uses concept search, the lower ladder, and promotion preflight; design uses promotion preflight and readiness divergence.",
          "Implementation uses the build backlog and the target Spec context; review uses the Pack backbone and warn-level signals, or the target Spec context and warn-level signals when no Pack exists.",
          "Close uses the drift alarm and changed-file blast radius; optional slimming preserves durable law and one prose owner without claiming a universal distillation boundary.",
          "A handoff names targets, changed files, current readiness, findings or open questions, and commands or evidence locations to re-run; it never carries an inherited verification verdict.",
          "An arc-scale handoff names the concrete register carriers rather than an abstract home: `spec:consumers.graph-first-planning` for placement law and the Spec ids that carry its register rows, including `spec:decisions.planning-truths-placement` and `spec:decisions.shipped-projections-frozen`, so the next session re-measures those Specs rather than inheriting register state from the handoff.",
          "Every preflight informs human or agent judgment and never authorizes, blocks, scopes, or advances delivery work.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.authoring-recipes",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.authoring-recipes.sdp.md",
    title: "Authoring questions stay executable graph recipes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Answer recurring maturity and verifier questions by scripting the graph rather than adding query verbs.",
      },
      behavior: {
        rules: [
          "Promotion preflight reports the Spec's stated rung, floor reached, any current unmet floor clause, and the unmet clauses of the rung above the floor reached, a typed-dependency failure with its targets.",
          "The verifier audit keeps declared example relations distinct from enabled verifier bindings.",
          "The lower-ladder view groups non-ready Specs by family and reports their next graph-visible unmet clause without treating an empty failure list as automatic promotion.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.graph-first-planning",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/consumers/graph-first-planning.sdp.md",
    title: "Arc intent is planned from the graph, not a prose briefs index",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Forward arc intent is captured as sub-ready Specs so planning sessions derive the backlog and readiness from the graph, with plans reduced to thin lineage pointers.",
        openQuestions: [
          {
            question:
              "How does an arc boundary stay legible in the graph (a Pack, a relation cluster, a naming convention) without minting a workflow gate or an authored delivery fact? Evidence note: the briefs-index register's rows landed in four homes: tradeoff refusals on `decision`-kind Specs, existing behavior guarantees on their carrying Specs, holds as blocking open questions, and a lawful non-decision in the plan record; that split is observed evidence for this question, not a ruling on arc-boundary representation.",
            blocking: true,
          },
        ],
      },
      behavior: {
        rules: [
          "`spec:consumers.delivery-session-on-ramp` owns per-session routing from graph state; this Spec owns only arc-scale commissioning — how the next arc's intent enters the corpus and is read back.",
          "Planning remains advisory reading of the graph; no recipe, preflight, or plan document authorizes, blocks, or sequences delivery work.",
          "A work-item dependency is authored only as a `dependsOn` edge between Specs whose truth genuinely needs the other to hold; independence is the absence of the edge, and no scheduling or sequencing phrase is ever authored.",
          "A decision record is a `decision`-kind Spec joined to its subject by `decidedBy`; a lawful non-decision lives as decision content or a plan record, never as a decision record, and it never mints an authored delivery fact.",
          "A do-not-reopen row's home follows its shape: a tradeoff refusal lives on a `decision`-kind Spec, never a `constraint`, and reopens only through a later decision that `supersedes` it and passes the ADR three-part test; an existing behavior guarantee stays on its carrying Spec and reopens by revising that Spec; a hold stays a blocking open question on its Spec; a lawful non-decision stays in the plan record and mints no Spec.",
          "A re-entry trigger is the deferred Spec's own blocking open questions, plus a `dependsOn` edge when a true precondition exists; the plan 35 deferrals name three re-entry triggers for this arc: Spec Studio, the reference projection, and the structural-edge Mermaid; no plan document re-arms deferred work.",
          "A deliverable with exclusive ownership across consumers has exactly one Spec identity; every consumer `dependsOn` that identity instead of restating the deliverable.",
          "Selection-pressure heuristics stay advisory, carried as behavior rules here or as recipes; they authorize, block, and sequence nothing.",
          "Session law re-measures from the graph first; a session never inherits readiness, backlog, or placement state from a prior plan, register, or summary.",
          "The thin plan file is a lineage pointer that carries plan numbering and staleness; numbering and staleness never become graph structure.",
          "The E2 placement ruling for `sdp new spec` and `sdp validate --watch` is a lawful non-decision that failed the ADR three-part test; it lives in the plan record and mints no Spec.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.impact-graph",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/consumers/impact-graph.sdp.md",
    title: "An impact graph can answer exhaustive code-structure questions",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give symbol and import impact questions an exhaustive derived substrate without promoting mechanical structure into curated intent.",
        openQuestions: [
          {
            question:
              "Which language-neutral identity and extraction boundary can support exhaustive symbol reach without freezing a single compiler's representation into the Protocol?",
            blocking: true,
          },
        ],
      },
      behavior: {
        rules: [
          "Mechanical import and symbol structure is inferred and remains distinct from the sparse curated graph.",
          "Comparing commits derives `graph(A)` and `graph(B)` and reports added, removed, or changed nodes and edges without persisting either projection as a second store.",
          "Candidate relationship suggestions and unambiguous-drift flags are assistive outputs; neither authors intent or silently rewrites the curated graph.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.intent-composition",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    file: "specs/consumers/intent-composition.sdp.md",
    title: "Intent composition needs a realizing surface",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Realize the absent user and agent surface that composes scoped intent before ordinary source edits.",
      },
      behavior: {
        rules: [
          "`spec:consumers.edit-model` owns the settled intent → agent → git law; this child owns only the future composing interaction that does not yet exist.",
          "No entrypoint, persistence path, or structured patch contract is implied at the idea rung.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.adopter-on-ramp",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/adopter-on-ramp.sdp.md",
    title: "An adopter learns the ruled graph homes from the shipped on-ramps",
    narrative: null,
    sections: {
      intent: {
        problem:
          "An adopter that follows the shipped on-ramps cannot learn where a deferral, an unsettled fact, a ruling awaiting its owner, a probe, or a count belongs, so it invents marker conventions, hand-kept registers, and scripts that keep them true.",
        outcome:
          "Teach each ruled home in the shipped skills, one line each with its carrying Spec, so an adopter states those truths in the graph and not beside it.",
      },
      behavior: {
        rules: [
          "The authoring skill teaches a deferral as a blocking open question that names its re-entry trigger, plus `dependsOn` for a true precondition. The floor then holds the Spec below `defined` without a marker, and because readiness is independent across refinement, the deferred Spec's example children still state `defined` when their bound points are complete; `ready` waits, because the `ready` floor reads the `refines` target.",
          "It teaches an unsettled fact as a constraint Spec that records a blocking open question naming the check that would settle it. Specs bounded by it declare `constrainedBy`, and the floor refuses their `ready` statement.",
          "It teaches a ruling that awaits its owner as a decision Spec below `ready`, with `decidedBy` from each Spec the ruling shapes.",
          "It teaches that a fact is checked by an example that `verifies` it. `has-verifier` is derived once a test anchor binds the example, and a checked status is never authored.",
          "It carries a short table of the Markdown body grammar, one row per section, that points at `spec:carrier.markdown-body-grammar`, so the grammar is found from the skill and not by probing.",
          "It teaches that counts, registers, and review scope are derived. Census counts come from `sdp census`, open-question and mention registers from catalog recipes, and delta review scope from changed-file blast radius. None is quoted into prose.",
          "`sdp --help` names the shipped skills, the recipe catalog, and the Protocol's own `specs/` by package-relative path, so an operator who reaches the CLI without a package runner still finds the on-ramps and the law they cite.",
          "The skills teach and never check. No validator reads an adopter's marker convention, and an adopter's own policy checks stay the adopter's.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.register-recipes",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/agent-surface.register-recipes.sdp.md",
    title: "Register questions stay executable graph recipes",
    narrative: null,
    sections: {
      intent: {
        problem:
          "An adopter keeps open-question tables, dependency lists, and reference checks by hand because the catalog ships no body for them, and each hand-kept copy goes stale.",
        outcome:
          "Answer register, dependency, and mention questions with catalog recipes, so the tables an adopter would keep by hand are derived on demand.",
      },
      behavior: {
        rules: [
          "The open-question register lists every open question by Spec with its blocking flag and its key and reports the totals.",
          "The dependency footing lists what one Spec rests on across `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`, with each target's stated and derived readiness.",
          "The mention audit lists Spec ids and entry addresses written in narrative and section text, outside `gwt` and `gwt-vocabulary` fences, that do not resolve or that no declared relation in either direction backs.",
          "Entry search matches whole tokens and answers with the Spec, the section, and the matching entry's key or text, plus `address: string | null`, where concept search answers with the Spec and the section only.",
          "Entry search gives `spec:<id>#<section>.<key>` for a `design` or `ui` key matching `^[a-z][A-Za-z0-9]*$` and `spec:<id>#question.<key>` for the text of an open question that carries a key, and `null` for every other entry, including `description` and off-grammar keys.",
          "The pinned declarations list reports each keyed Design entry whose value opens with a code span, giving the Spec, the key, and the span content as authored with the count of entries and of Specs, and parses no language inside the span.",
          "Each body composes the existing reader. None adds a reader join or a CLI verb, because a join freezes into the reader only at the second-caller bar.",
          "The recipe check executes each body as written, and every document that states the catalog's size moves with the catalog.",
          "Whole tokens are maximal runs of Unicode letters and digits, split at camelCase humps and compared without case; a multiword term matches only as a consecutive run in the same order inside one key or text.",
          'The mention audit takes a list of mentioning Spec ids, with an empty list selecting the whole corpus. It reports target Spec pairs and unresolved token pairs, keeping every location in `at` as section and entry. Unresolved rows carry `reason: "spec" | "entry" | "malformed"` for an absent Spec; an absent own key of that `design` or `ui` section, `description` there, or a question key no open question of that Spec carries; or a refused token. Pairs with no declared relation in either direction, and pairs backed only by a declared relation from the target are separate lists.',
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.shipped-protocol-corpus",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/shipped-protocol-corpus.sdp.md",
    title: "The package ships the Specs its skills cite",
    narrative: null,
    sections: {
      intent: {
        problem:
          "The shipped skills and recipes cite Specs by id. An adopter that installs the package has no Spec to read, and an adopter that runs the CLI from a source checkout has the Specs on disk and no pointer to them.",
        outcome:
          "Ship the Protocol's own corpus in the package and point at it from the CLI, so every cited Spec id leads either adopter to a readable carrier.",
      },
      behavior: {
        rules: [
          "The published package includes the Protocol's Spec and Pack carriers under `specs/`.",
          "An adopter reads a cited Spec through the front door by selecting the package's `specs/` directory, installed or checked out, as the root, or by opening the carrier file. `sdp --help` names that path, as `spec:consumers.adopter-on-ramp` requires.",
          "Discovery never descends into `node_modules`, so the shipped corpus never enters an adopter's own graph.",
          "The package ships no source anchors. A graph derived from the shipped corpus answers what the Protocol intends and never what it has realized, so its delivery facts and gap warnings are not evidence about the Protocol.",
          "The package ships the glossary `CONTEXT.md`, because the shipped skills and catalog send their reader to it.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.address-and-cycle-recipes",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    title: "Address checks and dependency cycles stay executable graph recipes",
    narrative: null,
    sections: {
      intent: {
        problem:
          "An adopter that cites entry addresses outside its Specs resolves each one with its own grammar and its own lookup, and no recipe reports a cycle in `dependsOn`, so a Spec can rest on itself through a chain no one has traced.",
        outcome:
          "Resolve a list of entry addresses and report every `dependsOn` cycle with catalog recipes, so neither is rebuilt by hand.",
      },
      behavior: {
        rules: [
          'Address resolution takes a list of entry addresses on its opening line and returns one row per input, in input order, repeats included. Each row carries `address`, `resolves`, `id`, `section`, `key`, and `reason`. A resolving row carries the Spec id, the section `design`, `ui`, or `question`, the key, and `reason: null`. A row that does not resolve carries `id`, `section`, and `key` as null and one reason: `"malformed"` for an input that is not an entry address, a bare Spec id included, `"spec"` for an address whose Spec is absent, and `"entry"` for an address whose Spec holds no such entry.',
          "Address resolution reads the address grammar and the resolution rule of the checked-mentions record: a `design` or `ui` key resolves as an own key of that section other than `description`, and a `question` key resolves when one of the Spec's open questions carries it. Its totals count the inputs, the resolving rows, and each reason.",
          "Dependency cycles take no parameter and read the whole graph. They report every set of two or more Specs in which each Spec reaches every other through declared `dependsOn` edges, and every Spec that declares `dependsOn` on itself and belongs to no such set. An edge whose target is not a Spec in the graph is ignored.",
          "Each reported set lists its members sorted by id in code-unit order and one cycle through it as a closed path that starts and ends at its first member. The cycle is the shortest such path, found by a breadth-first walk from the first member over targets in code-unit order and restricted to the set; a Spec that depends only on itself reports the path of that Spec twice. Sets are ordered by their first member, and the totals count the sets, the self-dependent Specs, and the Specs in any set.",
          "Both recipes report and never refuse: a cycle is data about the authored dependencies, as a structural cycle is, and the readiness floor reads each `dependsOn` target's stated rung without walking a chain.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/agent-surface.address-and-cycle-recipes.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.components",
    specKind: "contract",
    altitude: "story",
    readiness: "scoped",
    title: "The Studio's custom elements each render one view and embed anywhere",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give the Studio a small set of custom elements that each render one view of the graph, so one view serves a Studio page, a status report, a pull request description or a slide export.",
        openQuestions: [
          {
            question:
              "The original embeds interactive LikeC4 diagrams through an element that wraps LikeC4's own runtime; a LikeC4 export is designed-for and deferred, and the shipped Mermaid projection draws bounded one-hop Spec and Pack diagrams and never the whole graph. Which renderer draws a Studio diagram, and does that bound hold for it?",
            blocking: false,
            key: "embeddedDiagrams",
          },
          {
            question:
              "The original's harness element takes a harness id and keeps its coverage current as a reader works it; the graph holds example spaces, bound points and oracle bindings, and has no harness node and no `harness:` namespace. What does the element take as its subject?",
            blocking: false,
            key: "harnessElement",
          },
        ],
      },
      behavior: {
        rules: [
          "Each element is self-contained and light on dependencies, and works embedded in any HTML page.",
          "Each element reads the one graph object its page sets, as `spec:consumers.spec-studio.data` states, and takes its subject as a graph id in an attribute.",
          "Every element's name starts with `sdp-`.",
        ],
      },
      design: {
        description: "The elements in the original's order, with their attributes.",
        specCard:
          "`sdp-spec-card` with `spec-id`, `variant` and `readiness-pill`: one Spec as a card, in full or short form, with its readiness pill shown or hidden.",
        traceGraph:
          "`sdp-trace-graph` with `spec-id`, `depth` and `highlight`: the Spec's relations drawn as SVG to the given depth, highlighting what `highlight` names, such as missing tests.",
        maturityMap:
          "`sdp-maturity-map` with `pack-id` and `group-by`: a Pack's members by readiness, grouped by the named field, such as capability.",
        harness:
          "`sdp-harness` with `harness-id` and `auto-coverage`: an interactive scenario harness that keeps its coverage current.",
        diagramView:
          "`sdp-likec4-view` with `view-id`: a LikeC4 view, wrapping LikeC4's own runtime.",
        scenarioEditor:
          "`sdp-scenario-editor` with `spec-id` and `mode`: a given, when and then editor for one example, which in `propose` mode composes intent for a new one.",
        impactView: "`sdp-impact-view` with `spec-id`: a Spec's impact panel on its own.",
        intentPanel:
          "`sdp-intent-panel` with `id`: the composing panel on its own, in the place of the original's patch export button.",
        validationFindings:
          "`sdp-validation-findings` with `filter`: the validation report's findings for the Spec or Pack id the filter names.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.components.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.data",
    specKind: "contract",
    altitude: "story",
    readiness: "scoped",
    title: "The Studio hydrates from the serialized graph and the reader's values",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give every Studio page its data as files the build writes beside it, so the page reads the graph the agent surface reads and derives nothing of its own.",
        openQuestions: [
          {
            question:
              "The original hydrates the Studio from AI slices beside the graph and the validation report; the context bundle is designed-in and deferred, and no Spec states the shape of a slice. Does the Studio's data hold a slice, and which Spec would state it?",
            blocking: false,
            key: "aiSlices",
          },
        ],
      },
      behavior: {
        rules: [
          "The Studio hydrates from data files under `generated/spec-studio/data/`, written by the build that writes its pages.",
          "Each data file holds values the graph serializes or the reader returns and nothing a page computes; a page derives no join, claim, delivery fact, readiness or floor failure from them.",
          "One graph writes byte-identical data files.",
          "A page embeds the data it reads in one `script` element of type `application/json` with the id `sdp-graph`, parses it once into `window.__sdp__.graph`, and every element on the page reads from that one object.",
        ],
      },
      design: {
        graphFile:
          "the serialized graph exactly as `sdp build` writes `generated/graph.json`, with its `schemaVersion`.",
        reportFile: "the validation report, the findings the reader returns from `findings()`.",
        specContexts:
          "for each Spec, the reader's `specContext` value: descriptors, narrative, sections, stated and derived readiness, `floorFailures` and `nextRungFailures`, relations both ways, implementation and verifier bindings, the oracle binding and the findings.",
        packContexts:
          "for each Pack, the reader's `packContext` value: framing, model references, the members in the manifest's authored order, verifier gaps and findings.",
        searchIndex:
          "for each node, the fields the reader's `findByConcept` matches: id, title, anchor label, Pack framing, narrative and section content, so a search on the page matches what the concept entry matches.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.data.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.intent-panel",
    specKind: "behavior",
    altitude: "story",
    readiness: "scoped",
    title: "A composing panel on every page gathers scoped intent for an agent",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a reader gather the changes they want while they read, each bounded by a Spec, its neighbors, a Pack or one open question, and hand them to an agent that edits source.",
        openQuestions: [
          {
            question:
              "How does a static page hand composed intent to an agent: as a file the reader saves, as text the reader copies, or as a pull request? The original exports patch JSON or opens a pull request, and `spec:consumers.intent-composition` names no entrypoint for the composing surface.",
            blocking: true,
            key: "handOff",
          },
          {
            question:
              "The original stages each change as a JSON patch, checks its schema in the browser and its effect on the graph through the CLI or an agent, and applies it to canonical source; `spec:consumers.edit-model` has a view compose scoped intent that an agent turns into an ordinary source edit, with no patch loop. Does any part of the patch loop return, or is scoped intent the panel's only output?",
            blocking: false,
            key: "patchLoop",
          },
        ],
      },
      behavior: {
        rules: [
          "The composing panel is visible on every page.",
          "The panel writes nothing: source changes only when an agent edits it and git records the edit, and the conformance and honesty checks judge that edit as they judge every edit.",
          "A reader gathers intents across pages before handing them off.",
          "Gathered intents persist in the browser's local storage, so refreshing a tab on a phone loses none.",
          "A composed intent names its scope by id or entry address, so the agent that receives it reads the same Spec, Pack, entry or question through the graph.",
        ],
        exampleSpace: {
          given: ["the composing panel holds {gathered:number} gathered intents"],
          when: ["the reader refreshes the tab"],
          then: ["the composing panel holds {kept:number} gathered intents"],
        },
      },
      ui: {
        gatheredIntents:
          "the intents gathered so far, headed with their count, each on one line naming its scope and the change it asks for, such as adding an example or changing a constraint's target.",
        panelActions: "discard, hand off, and open as a pull request.",
        composingActions:
          "the actions on other panels that compose intent: resolve an open question or promote it to a decision record, propose or edit an example, propose or adjust a constraint target, and propose examples for missing combinations.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.intent-panel.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses",
    specKind: "behavior",
    altitude: "story",
    readiness: "scoped",
    title: "Four lenses read the graph as Packs, architecture, tests and evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a reader see the graph four ways, by Pack, by architecture, by verification and by evidence, from one top navigation.",
        openQuestions: [
          {
            question:
              "The original's Packs lens groups Specs by Pack or by capability; a capability is a projection over high-altitude behavior Specs or a Pack grouping, no Capability Map projection exists, and grouping by architectural significance is derived from id families and the component graph. Which grouping does the capability tree read?",
            blocking: false,
            key: "capabilityGrouping",
          },
          {
            question:
              "The original's architecture lens draws runtime layers, ports and external systems beside components and their dependencies; `spec:decisions.architectural-significance-rides-primitives` admits no structural vocabulary beyond component membership and `uses`. Does the lens draw only what those edges hold?",
            blocking: false,
            key: "architectureVocabulary",
          },
          {
            question:
              "The original's tests lens shows each test's last run result; a verifier binding states that a verifier exists, and pass and fail stay in CI, as `spec:decisions.binding-not-liveness` rules. Does the lens show run results read from CI output, or bindings only?",
            blocking: false,
            key: "testRunResults",
          },
          {
            question:
              "The original's tests lens names the rules of a Spec that no test exercises; an example verifies a whole Spec and a rule entry has no address, so the graph cannot tell which rule an example exercises. Does a rule gain an address, or does the lens name the uncovered Specs only?",
            blocking: false,
            key: "ruleCoverage",
          },
        ],
      },
      behavior: {
        rules: [
          "The Packs lens is the default landing page.",
          "Clicking a component in the architecture lens opens its detail.",
          "The evidence lens is read-only.",
        ],
      },
      ui: {
        description: "The lenses in the order of the top navigation.",
        packsLens:
          "a Spec-by-Spec tree grouped by Pack or by capability, each Pack's members in authored order.",
        architectureLens:
          "the graph drawn as components and their dependencies, from component membership and `uses` edges, in an embedded interactive diagram whose renderer is the open question `spec:consumers.spec-studio.components#question.embeddedDiagrams`.",
        testsLens:
          "a coverage view: for each Spec, its verifiers with their bindings, and the rules no example exercises.",
        evidenceLens:
          "build provenance, SBOM links, OpenTelemetry runtime observations and deployment history.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.lenses.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.responsive",
    specKind: "behavior",
    altitude: "story",
    readiness: "scoped",
    title: "The Studio reads on a phone as on a desktop",
    narrative: null,
    sections: {
      intent: {
        actor: "A product manager or an executive reviewing a design on a phone.",
        outcome: "Let a design be reviewed on a phone through the same pages a desktop shows.",
        openQuestions: [
          {
            question:
              "The original's summary mode hides low-confidence inferred edges; a claim is declared, anchored or inferred and carries no confidence, and the curated graph holds no inferred edge, which only the aspirational impact graph would add. What does summary mode hide?",
            blocking: false,
            key: "summaryMode",
          },
        ],
      },
      behavior: {
        rules: [
          "Every page of the Studio is responsive, so the same pages serve a desktop and a phone.",
        ],
        exampleSpace: {
          given: ["a Studio page whose layout holds {wideColumns:number} columns"],
          when: ["the page is shown {width:number} pixels wide"],
          then: ["the layout holds {columns:number} columns"],
        },
      },
      ui: {
        singleColumn: "below about 720 pixels wide, every layout collapses to a single column.",
        pinchZoom: "on a touch device, every diagram zooms with a pinch.",
        summaryMode:
          "below a set screen width, the trace graph and the component diagrams switch to a summary mode that hides low-confidence inferred edges.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.responsive.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio",
    specKind: "behavior",
    altitude: "feature",
    readiness: "scoped",
    title: "The Spec Studio is a static HTML workbench over the one graph",
    narrative: null,
    sections: {
      intent: {
        actor:
          "A stakeholder who reviews a design, on a desktop or on a phone, and reads far more than they change.",
        outcome:
          "Give a person reviewing a design one generated HTML workbench that explores the whole graph through lenses, shows each Spec and Pack in context, and turns a wanted change into scoped intent rather than an edit.",
        openQuestions: [
          {
            question:
              "Which package carries the Studio: the open-source `@libar-dev/software-delivery-protocol`, or a commercial `@libar-ai/` package? The Studio's deferral re-enters on a recorded ruling that names this home; earlier planning placed the Studio under `@libar-ai/`, and no Spec rules it.",
            blocking: true,
            key: "packageHome",
          },
          {
            question:
              "Which reader does the Studio serve that the generated Markdown Design Review does not? The first adopter generates its own Pack page beside the Design Review, with the members in reading order, the clause that holds each below its next rung, the Specs outside the Pack they rest on, and their open questions with register rows, while the Design Review's Pack page lists the members and the verifier gaps.",
            blocking: true,
            key: "unservedReader",
          },
        ],
      },
      behavior: {
        rules: [
          "The Studio is a projection of the one graph: its page set under `generated/spec-studio/` is regenerated from the graph, states no truth, and confers nothing back into the graph.",
          "The Studio is a mostly static single-page application, buildable as an `index.html` page and its assets, and it needs no server.",
          "The Studio works offline: the same files open from the file system through `file://` for local use and from any static host for sharing.",
          "The Studio is reproducible: one graph renders byte-identical files, and an asset whose filename embeds a hash of its content gets the same name from the same graph.",
          "The Studio is read-rich: everything the graph holds about a Spec or a Pack is explorable in it.",
          "The Studio is write-careful: it writes nothing to canonical source, and a change a reader wants leaves it as scoped intent for an agent, as `spec:consumers.edit-model` states.",
          "The Studio never builds a second graph: every join, claim, delivery fact, derived readiness, floor failure and finding it shows is a value the reader computed when the Studio was built, and the page computes none of them again.",
          "The Studio is built from custom elements, as `spec:decisions.studio-web-components` rules.",
          "The Studio stands beside the shipped Design Review, census, Mermaid and Gherkin projections and re-specifies none of them, which `spec:decisions.shipped-projections-frozen` keeps as they are.",
        ],
        exampleSpace: {
          given: ["an extraction root whose graph holds a Pack and its member Specs"],
          when: ["the Studio renders twice from freshly derived graphs of that root"],
          then: [
            "the page set holds the entry page {entryPage:string}",
            "the two renders are byte-identical: {byteIdentical:boolean}",
            "the extraction root stays byte-identical: {rootUntouched:boolean}",
          ],
        },
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.sharing",
    specKind: "behavior",
    altitude: "story",
    readiness: "scoped",
    title: "A Studio build is stamped and shared from a static host",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a stakeholder open the Studio of a pull request from a link, and let its author know which graph and which build the stakeholder read.",
        openQuestions: [
          {
            question:
              "The original stamps the Studio's data with the git commit and the build time; the Studio renders byte-identical files from one graph, and `spec:extraction.determinism` keeps wall-clock timestamps and run-specific values out of generated output. Where does the stamp live, if anywhere?",
            blocking: true,
            key: "buildStamp",
          },
        ],
      },
      behavior: {
        rules: [
          "A build is shared by uploading its page set to a static host, such as S3, Vercel or GitHub Pages.",
          "Each pull request can publish its Studio as a preview.",
          "A stakeholder opens the link, navigates the Studio and composes intent, and the pull request's author hands that intent to an agent that edits the source.",
        ],
      },
      design: {
        dataStamp:
          "each data file carries the graph's `schemaVersion`, the git commit SHA it was built from or `unknown` for a local build, and the build timestamp.",
        previewPath: "a pull request's preview is served at `<host>/preview/<pr-number>/`.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.sharing.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.shell",
    specKind: "behavior",
    altitude: "story",
    readiness: "scoped",
    title: "The Studio's shell frames every page with navigation, a rail and a canvas",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a reader move between lenses, Packs and Specs from any page, and find a Spec by what they remember of it.",
        openQuestions: [
          {
            question:
              "The original's left rail lists recent edits; the graph carries only current state, git is the event log, and the shipped views are a function of the graph alone. Does the rail read recent edits from git when the Studio is built, or leave them out?",
            blocking: false,
            key: "recentEdits",
          },
          {
            question:
              "The original's search indexes tags; the Spec envelope is closed to `id`, `kind`, `altitude`, `readiness` and `relations` with the H1 as title, and no free-form tag vocabulary is admitted. What, if anything, does search index in place of tags?",
            blocking: false,
            key: "searchTags",
          },
        ],
      },
      behavior: {
        rules: [
          "Every page has the same shell: a top navigation, a left rail and a main canvas.",
          "Search is persistent on every page; each result shows the Spec's readiness and opens its page.",
          "The rail's count of findings is the count of the validation report's findings, never a count the page derives.",
        ],
      },
      ui: {
        description: "The parts of the shell, top to bottom and left to right.",
        topNavigation:
          "one bar with the entries Packs, Capabilities, Architecture, Tests, Evidence and Search; the first five open a lens, Packs and Capabilities being the two groupings of the Packs lens, and Search opens the search.",
        leftRail:
          "the current Pack's tree, its member Specs in the Pack's authored order, then the recent edits, then the count of validation findings by severity.",
        mainCanvas: "the page of the Spec or Pack selected in the rail or in a lens.",
        search:
          "indexes every Spec's title, id, terms and notes, and lists the matches, each with its readiness and a link into its page.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.shell.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.spec-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "scoped",
    title: "A Spec page shows one Spec in collapsible panels, in a fixed order",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Show everything the graph holds about one Spec on one page, in panels a reader opens and closes one at a time.",
        openQuestions: [
          {
            question:
              "The original header shows an owner, a capability, tags and a last-verified time; the envelope is closed to `id`, `kind`, `altitude`, `readiness` and `relations` with the H1 as title, a capability is a projection or a Pack, and a verifier binding never records when a test last ran. Which of the four does the header show, and from which graph value?",
            blocking: false,
            key: "headerFields",
          },
          {
            question:
              "The original pins one color for each of seven rungs, sketch through verified; readiness has four rungs, idea through ready, and the floor reached renders beside the stated rung. Does the palette color the stated rung, the floor reached, or both?",
            blocking: false,
            key: "rungColors",
          },
          {
            question:
              "The original shows each open question's owner and the date it was added; an open question carries its text, whether it blocks and an optional key, and git records when its line was added. Does the panel show an owner or a date, and from where?",
            blocking: false,
            key: "questionMetadata",
          },
          {
            question:
              "The original's runtime panel shows the HTTP route, the Effect layer with what it provides and requires, its lifetime and its test layer, the external systems, and the Awilix registration with its lifetime; an anchor carries identity only, and `component` and `uses` are its only structural fields. Does the panel show more than the structural neighborhood of the Spec's implementation anchors?",
            blocking: false,
            key: "runtimeComposition",
          },
          {
            question:
              "The original's bindings panel lists schema bindings beside code and test bindings; anchors bind implementation code, tests and oracles, and no anchor binds a schema. Does a schema binding need a home?",
            blocking: false,
            key: "schemaBindings",
          },
        ],
      },
      behavior: {
        rules: [
          "Each panel collapses and expands on its own.",
          "The header renders readiness as `spec:consumers.derived-readiness-banner` states: the stated rung beside the floor reached, with the divergence banner only in the dishonest direction.",
          "The bindings panel speaks binding language as `spec:consumers.binding-language-views` states: each binding present or none, and the runtime observation not tracked.",
          "Every node a panel names is a link to its page.",
          "The design panel lists the `design` entries in authored order with their keys as code, and the UI panel lists the `ui` entries the same way, as `spec:decisions.authored-entry-order` rules for the Design Review.",
        ],
      },
      ui: {
        description: "The panels in page order.",
        header:
          "the Spec's id, its stated readiness beside the floor reached, its altitude and kind; its title; the Packs it belongs to; and its warning and error counts as pill badges.",
        readinessColors:
          "each rung has its own color, from a pinned palette that stays distinct under color blindness.",
        intentPanel:
          "the intent section as prose, then an open-questions panel headed with their count, each question with its text, whether it blocks, its key and the address the key gives it, and an action that composes intent scoped to that question.",
        behaviorPanel:
          "the rules, then the examples as cards, laid out as `spec:consumers.spec-studio.verification-panels` states.",
        constraintsPanel:
          "each constraint with its target, laid out as `spec:consumers.spec-studio.verification-panels` states.",
        designPanel:
          "a diagram of the components that realize the Spec, from its implementation anchors' `component` and `uses` edges, drawn as SVG whose nodes open their pages and show their source file and line on hover; below it, the `design` entries, then the decision records the Spec names by `decidedBy` with each decision's text inline.",
        runtimePanel:
          "the structural neighborhood of the Spec's implementation anchors: each anchor's component and the code units it uses, with file and line.",
        bindingsPanel:
          "the implementation, verifier and oracle bindings, each anchor's file and line as a link, with an action that opens the file at that line in the reader's editor.",
        verificationPanel:
          "the verifiers and the coverage of the example space, laid out as `spec:consumers.spec-studio.verification-panels` states.",
        evidencePanel:
          "builds, deployments, runtime observations and the SBOM, laid out as `spec:consumers.spec-studio.verification-panels` states.",
        impactPanel:
          "the upstream parents and downstream children, the Specs that depend on this one, the decision records it names, the tests that verify it, and the code its bindings reach.",
        uiPanel: "the `ui` entries.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.spec-page.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.verification-panels",
    specKind: "behavior",
    altitude: "story",
    readiness: "scoped",
    title: "The panels for examples, targets, verifiers and evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Show on a Spec page how far each example, constraint target and verifier goes, and what runtime evidence exists, without stating more than the graph records.",
        openQuestions: [
          {
            question:
              "The original shows each test's runner, whether it passed, its duration and its last run, and offers to run an example again; the graph records that a verifier binding exists and never a run, and a static page runs nothing. Does a panel show run results read from CI output when the Studio is built, or bindings only?",
            blocking: false,
            key: "runResults",
          },
          {
            question:
              "The original reads coverage from a harness's combinations; a parent's example space types its slots and the space contract lists each example's bound point, but only a slot typed as a union of literals has a finite set of values, and harnesses are outside this Pack. Does the grid enumerate those slots only?",
            blocking: false,
            key: "coverageSource",
          },
        ],
      },
      behavior: {
        rules: [
          "An example card shows the example's verifier as a binding that exists, and the example as an Executable Spec when a test anchor binds it, never as a test that passed.",
          "The evidence panel shows only runtime evidence the graph records, and reads not tracked while no delivery fact records an observation.",
          "Each action on these panels composes scoped intent and changes no source.",
        ],
      },
      ui: {
        description: "The panels' parts in page order.",
        ruleList: "each rule on its own line, followed by the example cards.",
        exampleCard:
          "one card per example: its title; its stated readiness and whether it is an Executable Spec; its given, when and then steps with their bound values; and actions to view its verifying test, open the example, and compose intent to edit it.",
        unwrittenExampleCard:
          "an example with no given, when and then steps yet says so, and offers to compose intent proposing them.",
        constraintTarget:
          "each constraint with its flavor and statement, its target drawn as a bar beside the number, and the last measured value next to it; moving the bar composes intent to change the target, and the new value shows on the page only, while the intent waits in the composing panel.",
        unsetTarget:
          "a constraint with no quantitative target says so, and offers to compose intent proposing one.",
        verifierList: "each verifier with its id, its binding, and its file and line as a link.",
        coverageGrid:
          "when the Spec owns an example space, one row per combination of slot values, marked covered when an example's bound point witnesses it and missing otherwise, with an action that composes intent proposing examples for the missing rows.",
        evidencePanel:
          "the last build with its SLSA attestation, the last deployment with its environment, the OpenTelemetry observation against the target with a link to the tool that holds it, and the CycloneDX SBOM to download.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.verification-panels.sdp.md",
  },
] as const;
