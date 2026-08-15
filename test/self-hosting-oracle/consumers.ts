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
          "Rendering encodes by Markdown syntax context: prose and table fields escape structural characters, fenced JSON preserves authored keys and values through JSON encoding, and inline code uses a delimiter that preserves literal backticks.",
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
          "A Pack page presents framing, model references, and an ordered member table with each member's kind, altitude, readiness, and implementation and verifier bindings.",
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
          "Cheap capture starts with `sdp new spec` (or the equivalent hand-authored idea carrier) in the family found through concept search; the scaffolder emits envelope, Intent outcome, and the kind's bare typed heading, never invented content, and refuses `constraint` because that kind has no lawful bare skeleton. Every later readiness edit is preceded by the promotion-preflight recipe and remains a human statement.",
          "The executable transition is taught as parent example space, child bound point, generated contracts, colocated `bindExample` and `specTest`, and a mutation-probed red result before the human states `ready`.",
          "Contract-generation refusals are diagnosed through `sdp build`; query-time validation does not claim to report codegen findings.",
          "Verifier-binding queries report graph-visible anchors and cannot detect a suite whose generated contract is never bound.",
          "Implementation anchors state identity-only bindings, and Design Review supplies context for the human readiness statement without becoming a workflow gate.",
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
          "Promotion preflight reports the Spec's stated rung, floor reached, and any current unmet floor clause.",
          "The verifier audit keeps declared example relations distinct from enabled verifier bindings.",
          "The lower-ladder view groups non-ready Specs by family and reports their next graph-visible unmet clause without treating an empty failure list as automatic promotion.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
] as const;
