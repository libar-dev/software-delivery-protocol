// The authored descriptors of the `consumers` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const consumersSpecs = [
  {
    id: "spec:consumers.agent-surface.answer-shapes",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.answer-shapes.sdp.md",
    title: "Recipe answers fit an agent's context and explain their misses",
    narrative:
      "A usability trial gave agents only the skills, the recipe catalog and `sdp q` and a fixed set of delivery questions. Every answer was reachable without opening a carrier or source file. The agents repeatedly met oversized answers, unexplained misses, ambiguous next-rung labels and fields whose names overstated the relations they reported.",
    sections: {
      intent: {
        actor: "An agent answering a delivery question through the catalog recipes.",
        problem:
          "An agent spends calls trimming oversized answers, decoding terse misses and writing the same missing body, and can repeat a recipe's label as fact when the label says more than the graph does.",
        outcome:
          "Let an agent get each answer in one call that fits its context, with every miss explained.",
      },
      behavior: {
        rules: [
          "Changed-file impact, Pack design and design diff, recipes 4, 29 and 35, accept `detail: true` and default to summaries preserving every total and explicitly naming omitted detail.",
          "The guarantees recipe (recipe 3) returns each section's entries as the Spec states them and the binding fields the Spec context carries, not only the names of the sections.",
          "The orphans and gaps recipe (recipe 8) reports each kind the verifier-gap signal exempts and how many ready Specs it exempts, as the build backlog reports its exclusions.",
          "A design-backlog recipe lists the Specs stated `defined` that no code realizes, with their design columns, excluding examples and decisions as the build backlog does.",
          "The catalog opens with an index, one row per recipe, and shows how to run a shipped body inside a caller's own body to filter its answer.",
        ],
      },
      design: {
        detailParameter:
          "recipes 4, 29 and 35 read `params.detail`, absent or `false` for the summary and `true` for every row in full; recipe 29's `detail` may also be a list of member ids, which returns full rows for those members and summary rows for the rest of the Pack, and an id that is not a member is a diagnostic in the result. A summary keeps `totals` as the full answer counts them and adds `leftOut`, one line for each kind of detail it omits.",
        impactSummary:
          "`{ changedFiles, totals, impactedSpecs: [id], impactedPacks: [id], atRisk: { incomingSpecs: [id], outgoingSpecs: [id], other: [id] }, coverageUnknownFiles, unlinkedUnits: [id], leftOut }` is recipe 4's summary. Incoming and outgoing name the connecting edge's direction relative to the impacted node and assert no dependency, since the edge may be any type; a Spec reached both ways is listed in both, and `other` holds the at-risk nodes that are not Specs.",
        impactDetail:
          "With `detail: true`, recipe 4 returns full rows and reasons; every at-risk reason carries `direction`, `incoming` or `outgoing`, relative to its impacted end.",
        packDesignSummary:
          "`{ id, specKind, statedReadiness, floorReached, statedNextRung, holds: [{ clauseId, targets: [id] }], openQuestions, blockingQuestions, implementedBy, referencedBy }` is recipe 29's summary row, with counts for the last four; the summary's boundary lists ids per direction, and `totals` is unchanged. `holds` is the summary of `statedNextRungFailures`, retaining each `clauseId` and target ids.",
        guaranteeShape:
          "Recipe 3 returns `sections` as the graph holds them, `designColumns`, `packs`, `implementations` and `references` in recipe 29's unit shape, with id, file, line, role and component with its layer and context, plus each verifier with its `line`, relations with claims and reasons, and findings.",
        gapExemptions:
          "Recipe 8 returns `exemptions` as `{ validatorId, exemptKind, readySpecs }`, one row for each exempt kind, and `leftOut` when more signals exist than the 25 listed.",
        preflightRungs:
          "The Spec context carries `statedNextRung` when one exists and `statedNextRungFailures`; promotion preflight reads those fields and the floor's next rung without computing a floor, and renders a missing next rung as null.",
        designBacklog:
          "recipe 33, the design backlog, takes no parameter and returns `{ totals: { specs, byFamily, excludedExamples, excludedDecisions, withReferences }, rows }`, each row `{ id, specKind, altitude, floorReached, statedNextRungFailures: [clauseId], design: { entries, declarations, openQuestions, blockingQuestions }, referencedBy, packs }`, sorted by id.",
        catalogIndex:
          "the catalog opens with a table of every recipe, its number, name, parameters and a one-line use, before the contract; the build writes one file per body and none for the index.",
        wrapIdiom:
          "to filter a shipped answer, the caller wraps the shipped body in an async arrow function that takes `params`, inside its own body, `const answer = await (async (params) => { <shipped body> })({ <the recipe's own parameters> });`, and returns a filtered value, so the caller's own parameters never reach the recipe as names it does not take; the catalog shows the shell form and states that the caller's part must hold no shell expansion.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.impact-graph.curation-assist",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/impact-graph.curation-assist.sdp.md",
    title: "File-level imports show where curation is missing",
    narrative:
      "Gen 1 of this tool, `@libar-dev/architect`, derived a mechanical import graph beside its curated one and used it to show authors where curation was missing: load-bearing modules no anchor covered, coverage by package, and designed modules no code realized yet. The idea held; the build did not. It hard-coded the repository's layout into the engine, read TypeScript only, and mixed both graphs in one query handle. A review of gen 1 found that the file-level layer gave most of its curation value and that only symbol queries need a symbol identity, which the impact graph's symbol-reach child holds open, so the file-level layer stands on its own.",
    sections: {
      intent: {
        actor:
          "An author curating anchors across a codebase, or a design pass over a large redesign.",
        problem:
          "Nothing tells an author which load-bearing files no anchor covers, where anchored `uses` and the code's imports disagree, or which component designs no code realizes yet, so curation gaps surface only when someone reads the code.",
        outcome:
          "Report from file-level imports where anchors and component designs are missing or drifting, as advice that never authors intent.",
      },
      behavior: {
        rules: [
          "The layer reads file-level import edges from a per-language adapter and identifies each file by its repository-relative path, so it needs no symbol identity.",
          "Every import relationship it derives is `inferred`; the imports file's schema and the recipe's external-inferred-input label carry that claim for all of them at once, so no relationship carries its own. The relationships stay apart from the curated graph: no `uses`, `memberOf`, `satisfies` or delivery fact derives from them, and a query of the curated graph never reads them unless the caller asks.",
          "It reports the files with the highest import fan-in that no anchor covers, the anchored `uses` edges between two components whose files share no import, the imports between two anchored components that no `uses` states, and the component designs no `component:` anchor realizes yet.",
          "Every report is advice: it refuses nothing, fails no validation and authors no anchor, and an author who agrees edits an anchor or a Spec as usual.",
          "The engine reads no repository layout convention: source roots and module resolution come from the adapter's configuration, and a file belongs to a component only when it holds that `component:` anchor or a code anchor `memberOf` it, never through a path pattern in the engine.",
          "The TypeScript adapter reads imports through the compiler library extraction already depends on; another language arrives as another adapter.",
          "The adapter runs outside extraction and outside `sdp q`: `sdp build`, given the adapter's configuration, writes the import edges to `generated/imports.json`, sorted and without a timestamp, and the curation recipe reads that file through `--params`, so no query derives imports and no validator sees an inferred edge.",
          "The imports configuration accepts optional root-relative `exclude` paths matching a file or directory subtree, refuses unknown keys, and records exclusions in its output so curation distinguishes deliberate omissions from missing input.",
          "The recipe labels the file as external inferred input and reports a file present on one side only; it states nothing in the graph's name.",
          "The adapter follows re-exports through barrel files, so a `uses` that reaches a component through an index file counts as backed by an import.",
          "Load-bearing is a ranked list, not a threshold: the recipe reports each uncovered file's import fan-in and fan-out, takes a `limit`, and leaves the cut to the caller.",
        ],
      },
      design: {
        importsFlag:
          '`sdp build --imports PATH` names the adapter configuration, a JSON object `{ "adapter": "typescript", "tsconfig": "tsconfig.json", "roots": ["src"], "exclude": ["src/generated"] }` with root-relative paths, where `exclude` is optional and each of its paths names a file or a directory subtree, and a key outside these four is refused; without the flag the build writes no imports file and leaves an existing one untouched.',
        importsFile:
          '`{ "schema": "sdp-imports/1", "adapter": "typescript", "exclude": ["src/generated"], "files": [{ "file": "src/a.ts", "imports": ["src/b.ts"] }] }` in `generated/imports.json`, files and imports sorted in code-unit order, paths root-relative with POSIX separators, `exclude` recording the configuration\'s exclusions in that form and sorted, every file the adapter reads under the configured roots and outside the exclusions listed even when it imports nothing, and imports outside the roots or under an exclusion left out. The schema and the recipe\'s `external inferred input` label give every listed relationship the `inferred` claim.',
        barrelImports:
          "when a file imports a barrel that re-exports another file, its `imports` lists the barrel and every file the barrel's re-exports reach, so the list is already the backing a `uses` check reads; a barrel under an exclusion is left out of the list while the files reached through it stay.",
        curationRecipe:
          "recipe 40, the curation report, takes `params.imports`, the imports file's object, and `params.limit`, 20 by default, and returns `{ input, totals, uncovered, usesWithoutImport, importsWithoutUses, unrealizedComponents, oneSided }`.",
        curationRows:
          "`uncovered` rows are `{ file, fanIn, fanOut }` for files no anchor sits in, ranked by fan-in then path and cut at `limit`; `usesWithoutImport` rows are `{ from, to, fromComponent, toComponent }`; `importsWithoutUses` rows are `{ fromComponent, toComponent, imports, sample: { from, to } }`; `unrealizedComponents` rows are `{ spec, componentId }` for component designs with no resolving anchored `satisfies` edge from the planned `component:` unit to the design, so an existing id without that binding stays unrealized.",
        curationInput:
          '`input` is `{ label: "external inferred input", schema, adapter, exclude, files }`, with `exclude` echoing the imports file\'s exclusions, and `oneSided` lists anchored source files the imports file does not list and imports-file entries outside every anchored component, so a stale or partial file shows.',
        importForms:
          "the TypeScript adapter reads the `.ts`, `.cts`, `.mts` and `.tsx` files under the configured roots and the module references the compiler resolves in them: import and export-from declarations, type-only and side-effect imports included, `import x = require(...)`, and `import(...)` calls and import types with a literal specifier; a computed specifier and a plain `require(...)` call are not read.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
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
          "The page set is one page per Spec, selecting that Spec and every node one edge away, code units and test anchors included, one page per Pack selecting the Pack and its members, and one deterministic index that links them. A selected diagram is rendered or refused under the hard bounds; the projection never emits a whole-graph diagram.",
          "Machine node tokens are injective encodings of the full graph ID. Titles and other display text never become machine tokens.",
          "Visible labels are escaped for Mermaid's own syntax, apart from the Design Review's Markdown escaping, so no label can close or break a diagram.",
          "Every emitted record — pages, node declarations, edge declarations, index rows — is ordered by deterministic code-unit order independent of graph input order.",
          "An unresolved relation or edge target renders as an explicit unresolved placeholder node rather than disappearing or being invented.",
          "A cycle through the root renders as its ordinary edges; the projection computes no transitive closure and no layout.",
          "Disconnected neighborhoods and foreign edge types remain visible when they appear in the selected one-hop or Pack slice; absence of a neighbor is honest silence, not a synthetic hub.",
          "Hard bounds are exact: `maxNodesPerDiagram = 64` and `maxEdgesPerDiagram = 128`. A token collision or an overflow of either bound refuses the affected diagram with a deterministic refusal that names the bound, while every in-bound diagram still publishes and the command exits 0. The projection never silently truncates, shards partially, drops edges to fit, or aborts the whole page set because one diagram overflowed.",
          "After the shared build, publication owns only `generated/mermaid/` and uses the explicit `sdp mermaid` surface. It is not a child of or an extra write inside Design Review's transaction, and it shares no publication bus or hidden side channel with other projections.",
          "A Mermaid run writes its complete page set to `generated/mermaid.tmp/`, removes the prior Mermaid root, and renames the temporary root into place. The shared build invalidates this root and all sibling projection roots before extraction, as `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` states, so failure leaves honest absence rather than stale output that looks current. A failed publish removes any live or temporary Mermaid root it cannot certify.",
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
          "Give maintainers a generated Gherkin-shaped page for reading any Spec, without making it a carrier, changing the default carrier or claiming conversion back to the authored Spec.",
      },
      behavior: {
        rules: [
          "`renderGherkinView` is a pure `Reader -> pages` projection with no filesystem or clock access; equal reader data produces byte-identical pages.",
          "Every Spec renders as one Gherkin-shaped page plus one deterministic index. Pages use `spec/<id body>.feature.md`, with the `spec:` namespace removed from the id. Packs are not projected. The projection never uses `.sdp.gherkin` and never claims round-trip parity.",
          "Each page says it is generated and disposable. A page for a kind the Gherkin carrier does not carry has a `# LOSSY:` comment in its header giving that kind's reason, and content Gherkin cannot carry honestly is marked the same way rather than invented as structure.",
          "Description prose lands only on the narrative and keyed description bullets under the prose-ownership decision, `spec:decisions.prose-ownership`; the projection never emits DocStrings, DataTables, Scenario Outlines, Examples tables, backgrounds, star steps or leading conjunctions.",
          "Every emitted record is ordered by deterministic code-unit order independent of graph input order. Hostile characters are escaped so they cannot close a fence or invent a DocString.",
          "After the shared build, publication owns only `generated/gherkin/` and uses the explicit `sdp gherkin` surface. It is not a child of or an extra write inside Design Review's transaction, and it shares no publication bus or hidden side channel with other projections.",
          "A Gherkin-view run writes its complete page set to `generated/gherkin.tmp/`, removes the prior Gherkin-view root, and renames the temporary root into place. The shared build invalidates this root and all sibling projection roots before extraction, as `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` states, so failure leaves honest absence rather than stale output that looks current. A failed publish removes any live or temporary Gherkin-view root it cannot certify.",
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
    readiness: "ready",
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
          "curated graph":
            "The part of the one derived graph that carries declared intent and anchored bindings, kept sparse by curation; the impact graph's inferred structure remains distinct.",
          curation:
            "The deliberate difference between the sparse curated graph and the exhaustive code-structure surface `spec:consumers.impact-graph` designs; it is not drift.",
          "diagnostic publication posture":
            "After extraction succeeds, a projection publishes its honestly labelled graph view even when validation reports errors, and returns the validation exit code so findings remain both visible and nonzero.",
          discipline:
            "A filter that selects or groups Specs by kind or section; it is not a phase to pass through.",
          projection:
            "A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.",
          reader:
            "The thin typed front door that decodes graph joins and taxonomy once, returns composable data, and persists nothing.",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/agent-surface.sdp.md",
    title: "Agents script a visible typed graph",
    narrative:
      "Agents arrive with a question, and a command for each question would repeat the graph's semantics. The reader and the evaluation sink let a body return the conclusion its caller needs.",
    sections: {
      intent: {
        outcome:
          "Let an agent obtain and compose graph context without rebuilding joins or navigating a fixed verb wall.",
      },
      behavior: {
        rules: [
          "The agent surface exposes the typed graph through two entrances, the exported reader and the `sdp q` evaluation sink; the schema is the contract and agents script the graph directly.",
          "The reader constructs decoded joins and claim taxonomy once, then returns plain composable data without persisting graph state.",
          "Entry adapters bridge strings, files, and changesets to curated graph context; file-level blast radius names coverage-unknown files rather than implying exhaustive reach.",
          "An agent arrives holding a concept string, a file it is editing, or the changeset a diff touches, and not the Spec id it is looking for, so the surface is designed around those entry points rather than around lookup by id.",
          "The string entry is `findByConcept`, the file entry is `byFile`, and the changeset entry is `blastRadius`, whose answer names every coverage-unknown changed file rather than dropping it into silence.",
          "The surface offers no symbol entry: `bySymbol` would need the exhaustive symbol reach the impact graph defers, and the adapter is absent rather than stubbed so its absence cannot read as a landed capability.",
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
        ruleKeys: {
          demandMap: "rules[3]",
          entryAdapters: "rules[4]",
          noSymbolEntry: "rules[5]",
          growByRecipe: "rules[6]",
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
          "The Design Review renders a Spec or a Pack in context with its readiness, relations, bindings, authored open questions, verifier coverage gaps on Pack pages, and findings, all read from the graph.",
          "The review is a pure projection that resolves through ordinary source edits, git, and conformance checks; it stores no findings and writes no canonical source.",
          "A human may use the review context when stating readiness, while validators check only the structural readiness floor and never record or require review approval.",
          "The view is deterministic generated Markdown with an index and pages for Specs and Packs; richer visual representations remain outside this behavior.",
          "The page set is a function of the graph alone — it carries no timestamp, no commit, and no run identity — so two renders of the same corpus are byte-identical.",
          "A link target percent-encodes each path segment and keeps directory separators and line fragments.",
          "Prose and table fields escape Markdown's structural characters.",
          "Each entry of a `design` or `ui` section renders as a list item in authored order with its key as inline code; a structured value renders as fenced JSON under its item.",
          "Inline code uses a backtick delimiter longer than any backtick run inside the value.",
          "An open question that carries a key opens with the key as inline code, `#<key>`, before its text.",
          "A Spec page lists the code units that realize the Spec and, apart, the units that reference it, each with its file and line, its role and, for a component, its layer and context; a reference confers no implementation binding.",
          "The renderer reads the reader and returns pages; writing them is the caller's job.",
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
        ruleKeys: {
          linkTargets: "rules[5]",
          fieldEscaping: "rules[6]",
          openSectionList: "rules[7]",
          inlineCode: "rules[8]",
        },
      },
      ui: {
        description:
          "The generated Design Review exposes three page anatomies from the same graph.",
        specPage:
          "A Spec page presents descriptors, the narrative, readiness, bindings, the authored sections, relations and findings in one context.",
        packPage:
          "A Pack page presents the Pack's design as its child `spec:consumers.design-review.pack-design-page` states.",
        indexPage:
          "The index holds one Markdown table of Specs, a linked list of Packs and the findings table, with stable links into each page.",
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
          "Give maintainers one disposable graph-derived census that exposes the complete runtime taxonomy, foreign values, readiness divergence, binding flavor, structural bindings and their attributes, and current findings without creating another source of truth.",
      },
      behavior: {
        rules: [
          "`renderCensus` is a pure `Reader -> pages` projection with no filesystem or clock access; every page, row, and finding is deterministically sorted so equal reader data produces byte-identical output.",
          "Spec kind rows and their display labels, altitude rows, and readiness rows derive from `SPEC_KINDS`, `SPEC_KIND_DISPLAY_LABELS`, `SPEC_ALTITUDES`, and `SPEC_READINESS`; graph node, claim, delivery-fact, and edge rows derive from `graphNodeTypes`, `graphClaims`, `deliveryFactNames`, and `graphEdgeTypes`. Every exported runtime category renders even at count zero; no projection-owned taxonomy list is maintained. The structural section's layer rows derive from `CODE_ANCHOR_LAYERS`.",
          "A foreign value outside an exported runtime taxonomy renders as a deterministic `unrecognized` row sorted by its literal value rather than disappearing or being coerced into a known category.",
          "Stated readiness and structurally derived readiness render as separate dimensions, including a count for Specs that have not structurally reached the first derived rung; the census never resolves or confers readiness.",
          "Anchor flavor groups binding nodes by node type, id namespace and outgoing edge type, counting each outgoing edge occurrence; a binding node with no outgoing edge has a `no binding edge` row, so a missing binding is stated rather than inferred.",
          "The structural section counts `memberOf`, `uses` and `references` edges, with code units counted apart; it lists component members, `uses` fan-in and fan-out including members, references, and `uses` cycles as data rather than findings. Dangling structural references are read from the validation report.",
          "With no structural edge or role, layer or context attribute, the section states that no structural binding exists. Otherwise it lists every closed layer value even at zero and the role and context values the graph holds, each with the units that carry it.",
          "Findings come only from `reader.findings()`, the one validation report exposed as data; the projection never re-runs or re-implements validation.",
          "The census is regenerable and disposable under `generated/census/index.md`; it confers nothing, writes no canonical source, and never becomes a second registry or truth store.",
          "After the shared build, publication uses the explicit `sdp census` surface and owns only `generated/census/`. It is not a child of or an extra write inside Design Review's transaction.",
          "A census run writes its complete page set to `generated/census.tmp/`, removes the prior census root, and renames the temporary root into place. The shared build invalidates this root and all sibling projection roots before extraction, as `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` states, so failure leaves honest absence rather than stale output that looks current.",
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
          "`createReader` constructs a fresh thin typed loader that indexes graph joins and claims and computes delivery facts and validation findings once, derives readiness when a caller asks, and returns plain composable data without persisting state.",
          "The reader exposes `graph`, the raw graph it reads, and the methods `specs`, `packs`, `findings`, `findByConcept`, `byFile`, `blastRadius`, `specContext` and `packContext`; a join is added only when a second machine consumer needs it and hand-rolled attempts get it wrong.",
          "`findByConcept` matches ids, titles, anchor labels, Pack framing, Spec narrative, and reified section content, including model term keys, and names the fields a node matched on rather than returning a bare hit.",
          "`byFile` answers with the nodes the graph records at the path and with the Specs those nodes reach, so a source file carrying a binding names the Spec it binds and a carrier file names the Spec authored in it.",
          "`blastRadius` maps changed files to Specs and Packs authored at them and Specs reached through `satisfies`, `references`, `verifies` or a usable oracle `models` binding, plus their explicit one-hop at-risk neighbors; it reports every file the graph records nothing at as `coverageUnknown` and every changed code unit with no Spec linkage as `unlinked`, and neither list claims exhaustive coverage.",
          "Every reason is data; a direct impact names the changed file and, when it travelled through a binding, that binding's id, edge type and claim, and an at-risk neighbor names the connecting edge with both its ends and its claim, so its impacted end leads back to that impact's reasons.",
          "File-level blast radius reports curated graph reach without claiming exhaustive symbol-level usage reach.",
          "`specContext` returns `undefined` for an id that is no Spec; otherwise it returns the Spec summary and sections, design columns, failures of the stated rung's floor, failures at the stated next rung and at the rung above the floor reached, relations both ways with claims and optional reasons, realizing and referencing code units, decoded verifiers, an optional usable oracle binding, entry locations and findings naming the Spec.",
          "`packContext` returns `undefined` for an id that is no Pack; otherwise it returns the Pack summary, one row per manifest entry in authored order, the Pack design on resolved rows, verifier gaps, boundary and findings naming the Pack.",
          "`packContext` lists one member row per manifest entry in the manifest's authored order, and its verifier gaps follow that order.",
          "`packContext` lists a verifier gap for each resolved non-decision member that carries no `has-verifier`; a member stated `ready` has priority true, and the list is informative, never a gate.",
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
        ruleKeys: {
          conceptEntry: "rules[2]",
          fileEntry: "rules[3]",
          blastRadius: "rules[4]",
          reasonsAsData: "rules[5]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.edit-model",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
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
          "The page reads derived readiness as `spec:validation.readiness-floor` defines it and renders it beside the author's statement, never in its place.",
          "Every Spec page renders the stated rung beside the floor reached, on one line, whether or not the two agree; the index and the Pack member table carry the same pair as two columns.",
          "The divergence banner is raised only in the dishonest direction — the floor reached standing below the stated rung. A floor reached at or above the stated rung raises nothing, because a floor is a floor and never a quota that nags upward.",
          "A raised banner names the first unmet clause by its clause id and its description, so the reader is told which clause to satisfy rather than only that something is wrong.",
          "When even the `idea` floor is unmet, the floor reached renders as none rather than as a rung, and a raised banner states that the floor stands below `idea`.",
          "The banner is rendering, never a check: the same divergence is already the readiness floor's own finding, and the page shows it in context rather than gating on it.",
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
    narrative:
      "The binding-not-liveness decision owns what a binding asserts; this Spec states the labels the views render.",
    sections: {
      intent: {
        outcome:
          "Keep a reader from reading a delivery fact as a liveness claim the graph never made.",
      },
      behavior: {
        rules: [
          "No Design Review page labels a binding with a delivery-fact name; the drift queries read those names, and the census lists them as values of the graph's runtime taxonomy.",
          "A Spec page's bindings block renders four labelled lines — implementation binding, verifier binding, expected-outcome oracle, and runtime observation.",
          "The three binding lines read present or none, and nothing else: what a binding says is that a resolving anchor exists, so the reader is offered existence rather than a degree.",
          "Runtime observation always reads not tracked. The graph does not derive the designed observed fact, and the view states the absence instead of leaving a reader to infer it from a missing line.",
          "The Pack member table and the index table carry the same two binding columns, with the same present and none values, so the aggregate surfaces speak the page's language rather than a shorthand of their own.",
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
            'the spec page renders the expected-outcome oracle as {oracle:"present"|"none"}',
            "the spec page renders the runtime observation as {observation:string}",
            "the index table repeats those binding values for the spec: {tableRepeats:boolean}",
            "the pack member table repeats those binding values for the spec: {memberTableRepeats:boolean}",
            "the internal delivery-fact name {factName:string} appears as rendered label text: {factNameRendered:boolean}",
          ],
        },
        ruleKeys: {
          aggregateColumns: "rules[4]",
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
    title: "A fully bound Spec renders binding language on the page and in the index",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the rendered vocabulary on a Spec both anchors reach, where the internal fact name would be easiest to leak.",
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
              'the spec page renders the expected-outcome oracle as {oracle: "none"}',
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
    title: "The Pack member table speaks the page's binding language, not a shorthand",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the aggregate half of the rule on the surface a reviewer reads a whole Pack from, where a two-column yes/no shorthand would be cheapest to reach for.",
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
          "A view run rewrites the view wholesale: no page written by an earlier run survives a later one, so a Spec that left the corpus leaves no page behind.",
          "Pages are written to a temporary sibling of the view directory, the previous directory is removed, and the temporary is renamed into place — one rename, so no half-written view is ever readable and no temporary survives a completed run.",
          "A run that cannot produce a current view removes the stale one instead of leaving it readable as current: an absent view is honest, a stale view is not.",
          "Before extraction, the shared build removes `generated/design-review/`, `generated/census/`, `generated/mermaid/` and `generated/gherkin/`, each with its temporary sibling, so a run that fails before rendering leaves no view behind; a removal failure refuses the build before extraction. Every command that enters this build, including validate and its watch runs and every publisher, has this invalidation effect, so a sibling root the command does not publish stays absent until a later publication. The Studio's root is removed beside these four, as `spec:consumers.spec-studio.publisher#rule.buildInvalidates` states.",
          "Under `--check-clean` the view is rendered twice from the same graph and the run refuses when the two renders diverge, removing the view it could not certify.",
          "Findings never withhold the view. A run whose checks report findings still writes the current view and returns the checks' own exit code, because the view is where those findings are read in context.",
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
        ruleKeys: {
          buildInvalidates: "rules[3]",
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
          "The skill teaches question keys and their optional fields through `spec:model.open-question-keys` and `spec:model.open-question-fields`, rule keys and an example's `exercises` through `spec:model.rule-keys`, and optional relation reasons through `spec:model.relation-reasons`.",
          "The skill teaches the least design two parties need to agree: keyed Design entries for shared names and shapes, code spans for pinned declarations, rule keys for outside citations, one prose owner for why, and no derived counts, delivery state or implementation sequence authored as design.",
          "The skill points behavior and example authors to `spec:carrier.gherkin-authoring` for the lawful Gherkin alternative and Pack authors to `spec:carrier.markdown-pack-authoring` for namespace routing, framing and ordered membership.",
          "Binding is taught for code, test and oracle anchors in the constant form and the comment form, following `spec:decisions.anchor-comment-form` and `spec:decisions.anchor-binding-grain`. The constant builders are `codeAnchor`, `specTest` and `specOracle`; a code anchor's `satisfies` is optional and plural, a test anchor's `verifies` is non-empty and plural, and an oracle anchor has one `models` target. The skill teaches `references` as the code-to-design binding that claims no realization, and names the two silent non-binding hazards, a constant builder without a Protocol builder binding and a comment that does not open with `/**`.",
          "The skill teaches the collective promise test for `satisfies` and the one-way meaning of `references`, following `spec:decisions.anchor-binding-grain`; every promise is realized by the satisfying units together, and each satisfying unit realizes at least one promise.",
          "Structural binding is taught through `component`, `uses` and optional `role` on a code anchor, and optional `layer` and `context` on a `component:` anchor, in either form, following `spec:decisions.architectural-annotation`. The skill teaches closed graph-ID targets, at most one component per source, no `implements` field, cycles as data, and no conferral of intent, delivery facts or readiness by structural fields.",
          "The executable transition is taught as parent example space, child bound point, generated contracts, the oracle bound by a `specOracle` anchor, and one generated-registrar activation beside the authored suite's top-level `specTest` anchor, with `bindExample` named as the low-level adapter and a mutation-probed red result required before the human states `ready`.",
          "Contract-generation refusals are diagnosed through `sdp build`; query-time validation does not claim to report codegen findings.",
          "Verifier-binding queries report graph-visible anchors; the `specTest` anchor remains the sole `has-verifier` source, and the graph cannot detect a generated contract or registrar that no authored suite activates.",
          "An anchor carries identity, an optional label, its flavor's targets and optional structure, never intent; a code anchor with neither `satisfies` nor `references` is identity-only and lawful. A Markdown deliverable binds through the document-realization convention: the suite asserting the shipped document carries the code anchor, and blast radius stays coverage-unknown for the Markdown file.",
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
    narrative:
      "A handoff names the Specs that carry the work, so the next session re-measures them from the graph instead of inheriting register state or a verification verdict from the handoff.",
    sections: {
      intent: {
        outcome:
          "Let an agent enter capture, design, implementation, review, or close work from current graph evidence without inventing workflow state or gates.",
      },
      behavior: {
        rules: [
          "Work shapes are advisory entries over the same current graph; they are neither phases nor a required sequence, and a session may enter or revisit any shape.",
          "Capture or refinement uses concept search, the lower ladder, and promotion preflight; design uses promotion preflight and readiness divergence. The listed recipes are starting points, not exhaustive recipe sets.",
          "The skill teaches an advisory Pack design loop: read the design diff from the last pass, compose a context bundle within a stated budget, narrow by perspective when needed, and return a change proposal for a base check before an agent applies it.",
          "Implementation uses the build backlog and the target Spec context; review uses the Pack backbone and warn-level signals, or the target Spec context and warn-level signals when no Pack exists. The listed recipes are starting points, not exhaustive recipe sets.",
          "The skill teaches a review report as a numbered list ordered by severity, with each item naming one entry address or Spec section, stating the gap in one sentence, and proposing exact text with the address it replaces or follows.",
          "Close uses the drift alarm and changed-file blast radius; slimming is optional and preserves durable law and one prose owner. For a Design entry, the skill teaches the distillation boundary stated by `spec:model.enrichment-lifecycle`, compares the entry with its bound artifact before removal, and keeps every explanation of why.",
          "A handoff names targets, changed files, current readiness, findings or open questions, and commands or evidence locations to re-run; it never carries an inherited verification verdict.",
          "An arc-scale handoff names the Spec ids that carry the arc's standing refusals, guarantees and holds in the homes ruled by `spec:decisions.planning-truths-placement`: tradeoff refusals in decision Specs, already-homed guarantees on their carrying Specs, and deferrals or holds in their blocking open questions.",
          "The skill names tripwires that ask a session to reconsider its chosen work shape; they are guidance and create no required sequence or authorization.",
          "Every preflight informs human or agent judgment and never authorizes, blocks, scopes, or advances delivery work.",
        ],
        ruleKeys: {
          arcHandoff: "rules[7]",
        },
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
          "Promotion preflight reports the Spec's stated rung, floor reached, current floor failures, and both next rungs as `aboveStated` and `aboveFloor`, each with `rung`, `failures` and `firstUnmetClause`; `rung` is null at `ready`, and a typed-dependency failure carries its targets.",
          "Declared versus enabled verifiers keeps declared example relations distinct from enabled verifier bindings.",
          "The lower ladder groups non-ready Specs by family and reports stated readiness, floor reached, stated next rung and its first unmet clause; null means nothing blocks that rung, never automatic promotion.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.graph-first-planning",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/graph-first-planning.sdp.md",
    title: "The next body of work is planned from the graph, not from a prose index",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Capture the intent of the next body of work as Specs below `ready`, so planning sessions derive backlog and readiness from the graph and plan files point to their carrying Specs.",
      },
      behavior: {
        rules: [
          "`spec:consumers.delivery-session-on-ramp` owns per-session routing from graph state; this Spec owns how the next body of work's intent enters the corpus and is read back.",
          "Planning remains advisory reading of the graph; no recipe, preflight, or plan document authorizes, blocks, or sequences delivery work.",
          "Each planning truth lives in the home `spec:decisions.planning-truths-placement` rules for it; a deferred Spec carries its re-entry trigger in the `trigger:` field of its blocking open question, plus `dependsOn` when another Spec must hold first, as `spec:model.open-question-fields` states.",
          "A body of work is grouped in a Pack named for the capability it designs, never for a plan number, listing its Specs in reading order; membership confers no readiness, delivery fact or gate, and the Pack remains a review aggregate after the work ends.",
          "Heuristics for choosing work remain advisory behavior rules here or recipes; they authorize, block and sequence nothing.",
          "Session law re-measures from the graph first; a session never inherits readiness, backlog, or placement state from a prior plan, register, or summary.",
          "A plan file points to the Pack and carrying Specs for intended truth and derived state; it may keep an advisory execution and recovery record, while plan numbering, recorded work order and staleness never become graph structure or workflow authority.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.impact-graph",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/impact-graph.sdp.md",
    title: "Mechanical code structure stays inferred and apart from curated intent",
    narrative:
      "File-level import structure, keyed by repository-relative path, is designed in `spec:consumers.impact-graph.curation-assist`; exhaustive symbol reach is designed in `spec:consumers.impact-graph.symbol-reach`, which holds the symbol-identity question.",
    sections: {
      intent: {
        outcome:
          "Let mechanically derived import and symbol structure inform impact and curation without ever standing in for curated intent.",
      },
      behavior: {
        rules: [
          "Mechanical import and symbol structure derives under the `inferred` claim and stays apart from the sparse curated graph; no curated edge, binding or delivery fact derives from it.",
        ],
        ruleKeys: {
          inferredApart: "rules[0]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.impact-graph.symbol-reach",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/consumers/impact-graph.symbol-reach.sdp.md",
    title: "Exhaustive symbol reach waits for a language-neutral identity",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Answer find-all-usages and symbol-level impact exhaustively once a symbol identity exists that no single compiler owns.",
        openQuestions: [
          {
            question:
              "Which language-neutral identity and extraction boundary can support exhaustive symbol reach without freezing a single compiler's representation into the Protocol?",
            blocking: true,
            key: "symbolIdentity",
            decider: "owner",
            trigger:
              "a reader needs symbol-level reach that file-level imports and curated anchors cannot give",
          },
        ],
      },
      behavior: {
        rules: [
          "Symbol reach is inferred structure, kept apart from the curated graph under `spec:consumers.impact-graph#rule.inferredApart`, and a symbol is never an anchor id or a relation target.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.intent-composition",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/intent-composition.sdp.md",
    title: "Composed intent hands off on one proposal shape",
    narrative:
      "The edit model, `spec:consumers.edit-model`, owns the intent, agent and git law. This Spec owns how a composing surface hands its intent off.",
    sections: {
      intent: {
        actor: "A person or an agent reading a view who wants a design change made.",
        problem:
          "Each composing surface could invent its own hand-off, so a reviewer, an agent and a check would read one change in as many shapes as there are surfaces.",
        outcome:
          "Give every surface that composes scoped intent one hand-off shape, applied as an ordinary edit.",
      },
      behavior: {
        rules: [
          "Every surface that composes scoped intent, including the Studio's composing panel, hands off on the one change-proposal contract, `spec:consumers.intent-composition.proposal`.",
          "A composing surface writes no source.",
          "A composed proposal is applied after its proposal check: the applying caller sends a change whose scope changed since the base to a person instead of applying it and applies every other change as an ordinary edit, so one changed scope never holds back the whole proposal; the edit lands only from a worktree on which `sdp validate` reports no error, and the conformance and honesty checks stay the only gate.",
        ],
        ruleKeys: {
          changedScope: "rules[2]",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.adopter-on-ramp",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/adopter-on-ramp.sdp.md",
    title: "An adopter learns graph homes, carrier grammar and shipped paths from the on-ramps",
    narrative:
      "The help names the on-ramps by path because an operator can reach the CLI without a package runner and still needs to find the shipped on-ramps and the law they cite. A commit pin lets an adopter take any reviewed revision without a registry release, and the package builds itself during that install, so a re-pin is one dependency edit rather than a rebuilt vendored tarball.",
    sections: {
      intent: {
        problem:
          "An adopter needs a repeatable commit install and stable recipe inputs. An adopter that follows the shipped on-ramps cannot learn where a deferral, an unsettled fact, a ruling awaiting its owner, a statement a test checks, or a count belongs, so it invents tags of its own, hand-kept registers, and scripts that keep them true.",
        outcome:
          "Teach commit installation and stable recipe inputs in the README. Teach each ruled home in the shipped skills, one line each with its carrying Spec, so an adopter states those truths in the graph and not beside it.",
      },
      behavior: {
        rules: [
          "An adopter can pin the package to a git commit, and the package's `prepare` script builds the CLI, subpath exports and shipped recipes before installation completes. While the package version is `0.0.0`, the installation guidance uses a commit pin rather than an npm prerelease.",
          "The shipped README teaches a commit install with npm and pnpm, the source-qualified build approval each needs, and a check that the installed CLI's `sdp --version` names the pinned full commit, for a git clone or a hosted git archive install.",
          "The upgrade guidance teaches a recipe caller to pass the recipe's subject as `--params` data and run the shipped recipe file, never to rewrite the recipe body.",
          "The authoring skill teaches a deferral as a blocking open question whose `trigger:` field names what brings the Spec back, plus `dependsOn` for a true precondition. Its blocking question holds the Spec below `defined` without an adopter-specific tag. Example children may still state `defined` once their bound points are complete and match the parent's example vocabulary when it has one; their `ready` waits until the parent states at least `defined`.",
          "It teaches an unsettled fact as a constraint Spec whose blocking open question names the check that would settle it. Specs bounded by it declare `constrainedBy`; they may state `defined` when their own floor clears, and their `ready` waits until the constraint states at least `defined`.",
          "It teaches a ruling that awaits its owner as a decision Spec below `ready`, with `decidedBy` from each Spec the ruling shapes.",
          "It teaches that a fact is checked by an example that `verifies` it. `has-verifier` is derived once a test anchor binds the example, and a checked status is never authored.",
          "It carries a short table of the Markdown body grammar, one row per section, that points at `spec:carrier.markdown-body-grammar`, so the grammar is found from the skill and not by probing.",
          "It teaches that counts, registers, and review scope are derived. Census counts come from `sdp census`, open-question and mention registers from catalog recipes, and a change's review scope from changed-file blast radius. None is quoted into prose.",
          "`sdp --help` names the shipped skills, the recipe catalog, and the Protocol's own `specs/` by package-relative path.",
          "The skills teach and never check. No validator reads an adopter's own tags, and an adopter's own policy checks stay the adopter's.",
        ],
        ruleKeys: {
          commitInstall: "rules[0]",
          installGuidance: "rules[1]",
          recipeUpgrade: "rules[2]",
          helpNamesOnRamps: "rules[9]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.register-recipes",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.register-recipes.sdp.md",
    title: "Register questions stay executable graph recipes",
    narrative:
      "A corpus keeps registers of its own values, such as its limits, its error messages and its storage tables, as families of keyed Design entries whose keys share a prefix: `limit`, `error`, `table`. The key-family register lists one or more families across a scope each time it runs, so no one keeps those tables by hand. It reads Design and UI entries only. A rule or flow key names a law that an example exercises, and its text is a statement of law rather than a value two parties hold to. Rule coverage and entry search already list rule keys, the open-question register lists question keys, and a register that mixed laws with values would hide which rows are values.",
    sections: {
      intent: {
        problem:
          "An adopter that keeps open-question tables, dependency lists and reference checks by hand lets each copy go stale.",
        outcome:
          "Answer register, dependency, and mention questions with catalog recipes, so the tables an adopter would keep by hand are derived on demand.",
      },
      behavior: {
        rules: [
          "The open-question register lists every open question by Spec with its blocking flag, key, decider, links, provisional and trigger fields, marks a question carrying a trigger as a deferral, and counts deferrals and blocking questions without a trigger apart.",
          "The dependency footing lists what one Spec rests on across `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`, with each target's stated and derived readiness.",
          "The mention audit lists Spec ids and entry addresses written in narrative and section text, outside `gwt` and `gwt-vocabulary` fences, that do not resolve or that no declared relation in either direction backs.",
          'The mention audit takes a list of mentioning Spec ids, with an empty list selecting the whole corpus. It reports target Spec pairs and unresolved token pairs, keeping every location in `at` as section and entry. Unresolved rows carry `reason: "spec" | "entry" | "malformed"` for an absent Spec; an absent own key of that `design` or `ui` section, `description` there, a question key no open question carries, a rule key no rule or flow carries, or a term key no Model term carries; or a refused token. Pairs with no declared relation in either direction, and pairs backed only by a declared relation from the target are separate lists. The audit accepts `params.intended` rows of `from`, `to` and `reason`: `intended` holds the matching unbacked pairs with their reasons, `unbacked` holds the remaining unbacked pairs, and `staleIntended` holds supplied rows that match no unbacked pair in the selected scope. The validator reads no intended list, so its warnings stand.',
          "Entry search matches whole tokens and answers with the Spec, the section, and the matching entry's key or text, plus `address: string | null`, where concept search names the node and the fields it matched, never the entry.",
          "Entry search gives an entry its address when one exists: `spec:<id>#<section>.<key>` for a `design` or `ui` key matching `^[a-z][A-Za-z0-9]*$` other than `description`, `spec:<id>#question.<key>` for the text of an open question that carries a key, `spec:<id>#rule.<key>` for a keyed rule or flow, and `spec:<id>#term.<key>` for a keyed Model term; every other entry has `address: null`.",
          "Whole tokens are maximal runs of Unicode letters and digits, split at camelCase humps and compared without case; a multiword term matches only as a consecutive run in the same order inside one key or text.",
          "Pinned declarations reports each keyed Design entry whose value opens with a code span, giving the Spec, the key, and the span content as authored with the count of entries and of Specs, and parses no language inside the span.",
          "The key-family register lists every keyed Design and UI entry whose key starts with one of the given prefixes, across the corpus, the members of one Pack, or a list of Specs, each with its Spec, section, key, value as the graph holds it, file and line, with no row cap.",
          "The key-family register never lists a rule, flow or question key, or the `description` entry.",
          "Each body composes the reader and adds no reader join or CLI verb.",
          "The recipe check executes each catalog body as written, and the on-ramps point to the catalog for its contents.",
        ],
        ruleKeys: {
          keyFamily: "rules[8]",
          familySections: "rules[9]",
        },
      },
      design: {
        familyRecipe:
          'recipe 41, the key-family register, takes `params.prefixes`, a non-empty list of unique non-empty strings, each matched case-sensitively against the start of a key as authored, with `["finding", "impact"]` when absent, and at most one scope, `params.pack` or `params.specs`, reading the whole corpus with neither and a listed Spec once however often it is listed; a malformed prefix list, both scopes, or a Pack or Spec id that does not resolve returns `{ diagnostics: [{ parameter, problem }] }` and no register, `parameter` naming the parameter at fault and `specs` when both scopes are given. A Pack member that does not resolve returns a `pack` diagnostic naming that member, and no register.',
        familyShape:
          "`{ prefixes, scope, totals: { rows, specs, byPrefix }, rows }` is the register, where `scope` is `{ corpus: true }`, `{ pack }` or `{ specs }`, `totals.specs` counts the Specs with a row, and `byPrefix` maps each prefix, in the given order, to the count of rows it matches, a key that matches two prefixes counting under each.",
        familyRow:
          "`{ key, spec, section, value, file, line }` is one row, with `section` either `design` or `ui`, and `line` null when the location table records no line for the entry; rows sort by key, then Spec id, then section, in code-unit order.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.shipped-protocol-corpus",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/shipped-protocol-corpus.sdp.md",
    title: "The package ships the Specs and on-ramps its skills cite",
    narrative:
      "The skills and the recipe catalog also send their reader to the glossary, and the catalog to the decision registry, so both ship beside the Specs. An installed package sits under `node_modules`, which discovery skips, so the shipped Specs never mix into an adopter's own graph.",
    sections: {
      intent: {
        problem:
          "The shipped skills and recipes cite Specs by id. An adopter that installs the package has no Spec to read, and an adopter that runs the CLI from a source checkout has the Specs on disk and no pointer to them.",
        outcome:
          "Ship the Protocol's own corpus in the package and point at it from the CLI, so every cited Spec id leads either adopter to a readable carrier.",
      },
      behavior: {
        rules: [
          "Beside the runtime and runnable recipe files in `dist/`, the package ships the Protocol's Spec and Pack carriers under `specs/`, the glossary `CONTEXT.md`, the decision registry `docs/concept/DECISIONS.md`, the reading, authoring and session skills under `.agents/skills/`, the recipe catalog and architecture walkthrough under `docs/agent-surface/`, and the change-proposal schema under `schemas/`; package metadata, README and license files also ship.",
          "An adopter reads a cited Spec through the front door by selecting the package's `specs/` directory, installed or checked out, as the root, or by opening the carrier file. `sdp --help` names that path, as `spec:consumers.adopter-on-ramp#rule.helpNamesOnRamps` requires.",
          "The shipped corpus stays outside an adopter's own graph under the canonical discovery rules in `spec:extraction.excludes`.",
          "The package ships no source anchors. A graph derived from the shipped corpus answers what the Protocol intends; its delivery facts are empty, and verifier-gap and example-verifier-linkage warnings caused by the absent bindings are not evidence about the Protocol's realization.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.address-and-cycle-recipes",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "Address resolution and dependency cycles stay executable graph recipes",
    narrative:
      "A dependency cycle is data about the authored dependencies. The readiness floor reads each dependency target's stated rung without walking a chain.\n\nAn adopter's gate checks both with copies of these bodies in its own rules file. Each recipe therefore answers with findings beside its rows, so the shipped file runs unchanged as a rules file and a gate keeps no copy. A finding is data: the corpus that names the file as a rules file chooses to fail on it, and the recipe still refuses nothing.",
    sections: {
      intent: {
        problem:
          "An adopter that cites entry addresses outside its Specs resolves each one with its own grammar, and a Spec can rest on itself through a `dependsOn` chain no one has traced.",
        outcome:
          "Resolve a list of entry addresses and report every `dependsOn` cycle with catalog recipes, so neither is rebuilt by hand.",
      },
      behavior: {
        rules: [
          "Address resolution reads `params.addresses`, falling back to the catalog sample when absent, and returns one row per input in input order, repeats included; each row carries `address`, `resolves`, `id`, `section`, `key`, `value`, `file`, `line` and `reason`. A resolving row carries the entry text or value and its recorded file and line, null when unlocated, with `reason` null. A miss keeps `id`, `section` and `key` when parsed, keeps `value`, `file` and `line` null, and gives `reason` `malformed` for an input that is no entry address, a bare Spec id included, or `spec`, `section` or `entry` for an absent Spec, section or key; `malformed` carries `expected`, the grammar in one line, and `section` or `entry` carries `available`, the keys that section holds sorted in code-unit order.",
          "Address resolution follows the checked-mentions address grammar: a `design` or `ui` key resolves as an own key other than `description`, a `question` key resolves when an open question carries it, a `rule` key resolves through `behavior.ruleKeys` to its rule or flow text, and a `term` key resolves through `model.termKeys` to its term's definition; totals count inputs, resolving rows and each miss reason.",
          "Dependency cycles take no parameter other than `severity` and read the whole graph. They report every set of two or more Specs in which each Spec reaches every other through declared `dependsOn` edges, and every Spec that declares `dependsOn` on itself and belongs to no such set. An edge whose target is not a Spec in the graph is ignored.",
          "Each reported set lists its members sorted by id in code-unit order and one cycle through it as a closed path that starts and ends at its first member. The cycle is the shortest such path, found by a breadth-first walk from the first member over targets in code-unit order and restricted to the set; a Spec that depends only on itself reports the path of that Spec twice. Sets are ordered by their first member, and the totals count the sets, the self-dependent Specs, and the Specs in any set.",
          "Both recipes report their answers and never refuse an authored dependency cycle.",
          "Address resolution answers with `findings` beside its totals and rows: one finding for each row that does not resolve, in input order, the catalog sample's rows included, so the shipped file runs as a rules file over the addresses its `--params` names.",
          "Dependency cycles answers with `findings` beside its totals and cycles: one finding for each entry of `cycles`, in that order, naming the first member and the closed path through the set.",
          'Both recipes take `params.severity`, `"error"` by default or `"warning"`, which every finding they return carries; another value returns `{ diagnostics }` and no findings, which fails the file as a rules file.',
          "Apart from `findings`, both answers keep their shapes: the totals, rows and cycles stated above.",
        ],
        exampleSpace: {
          given: [
            'a probe corpus in which {corpus:"two Specs depend on each other through dependsOn"|"one Spec depends on another"}',
            "the caller passes the addresses {addresses:string}",
          ],
          when: [
            'the shipped {recipe:"address resolution"|"dependency cycles"} file runs {invocation:"through sdp q"|"as a rules file named by sdp validate --rules"}',
          ],
          then: [
            "the command exits {exitCode:number}",
            "the answer carries {findings:number} findings with the rule ids {ruleIds:string}",
          ],
        },
        ruleKeys: {
          addressFindings: "rules[5]",
          cycleFindings: "rules[6]",
          findingsSeverity: "rules[7]",
          answersUnchanged: "rules[8]",
        },
      },
      design: {
        addressFinding:
          "`{ validatorId: \"unresolved-address\", subjectId, severity, message }`, where `subjectId` is the input when it is a string holding at least one character that is not white space, and the input's JSON text otherwise, and `message` reads `<subjectId> does not resolve: <why>`, `<why>` being `not an entry address`, `no Spec <id>`, `<id> has no <section> entries` or `<id> has no <section> entry <key>` by the row's `reason`.",
        cycleFinding:
          "`{ validatorId: \"dependency-cycle\", subjectId, severity, message, file, line }`, where `subjectId` is the entry's first member, `message` reads `<first member> rests on itself through dependsOn: <cycle>`, `<cycle>` being the entry's closed path joined by ` -> `, `file` is the first member's carrier, and `line` is the line the location table records for its `dependsOn` relation to the path's second id, left out when not located.",
        severityDiagnostic:
          '`{ diagnostics: [{ parameter: "severity", problem: "Expected error or warning." }] }` is the whole answer for a `severity` other than `"error"` or `"warning"`.',
        answerShapes:
          "address resolution returns `{ totals, rows, findings }` and dependency cycles returns `{ totals, cycles, findings }`; each recipe's accepted names gain `severity`, after its existing ones.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/agent-surface.address-and-cycle-recipes.sdp.md",
  },
  {
    id: "spec:consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run.sdp.md",
    title: "The shipped dependency-cycles file fails a rules run on a cycle",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the cycle findings by naming the shipped dependency-cycles file as a rules file over a corpus with one cycle.",
        assumptions: [
          "The world writes a probe corpus of two story-altitude behavior Specs, each stating `idea` with an Intent outcome and each declaring `dependsOn` on the other, which the Protocol's validators find clean. It runs `sdp validate` on the probe root with `dist/recipes/26-dependency-cycles.js` named by `--rules` and no `--params`, which the addresses `none` names. The findings are the corpus findings the run prints, and the rule ids are their rule ids joined by a comma and a space.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus in which {corpus: "two Specs depend on each other through dependsOn"}',
              'the caller passes the addresses {addresses: "none"}',
            ],
            when: [
              'the shipped {recipe: "dependency cycles"} file runs {invocation: "as a rules file named by sdp validate --rules"}',
            ],
            then: [
              "the command exits {exitCode: 1}",
              'the answer carries {findings: 1} findings with the rule ids {ruleIds: "dependency-cycle"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run.sdp.md",
    title:
      "The shipped address-resolution file fails a rules run on an address that names no entry",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the address findings by naming the shipped address-resolution file as a rules file with one address its Spec does not carry.",
        assumptions: [
          "The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the first declaring `dependsOn` on the second, which the Protocol's validators find clean; the first Spec's id is the one the address names. It runs `sdp validate` on the probe root with `dist/recipes/25-address-resolution.js` named by `--rules` and followed by `--params` holding the address as `addresses`. The findings and rule ids are read as in the cycle example.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus in which {corpus: "one Spec depends on another"}',
              'the caller passes the addresses {addresses: "spec:probe.one#design.absent"}',
            ],
            when: [
              'the shipped {recipe: "address resolution"} file runs {invocation: "as a rules file named by sdp validate --rules"}',
            ],
            then: [
              "the command exits {exitCode: 1}",
              'the answer carries {findings: 1} findings with the rule ids {ruleIds: "unresolved-address"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.address-and-cycle-recipes.chain-reports-nothing.sdp.md",
    title: "A dependency chain with no cycle yields no finding",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the cycle findings through `sdp q` over a chain, which reports no set and carries no finding.",
        assumptions: [
          "The world writes the probe corpus of the unresolved-address example and runs `sdp q --json` on its root with the text of `dist/recipes/26-dependency-cycles.js` as the body and no `--params`, which the addresses `none` names. It reads the exit code, the answer's `findings` and the answer's keys, which are `totals`, `cycles` and `findings`.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus in which {corpus: "one Spec depends on another"}',
              'the caller passes the addresses {addresses: "none"}',
            ],
            when: [
              'the shipped {recipe: "dependency cycles"} file runs {invocation: "through sdp q"}',
            ],
            then: [
              "the command exits {exitCode: 0}",
              'the answer carries {findings: 0} findings with the rule ids {ruleIds: ""}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.components",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    title: "The Studio's custom elements each hold one view the build renders",
    narrative:
      "The original's harness element has no subject in the graph, which holds example spaces, bound points and oracle bindings but no harness node, so its successor takes the Spec that owns an example space. The build renders every view into the page's markup and an element adds only the interaction its view needs, as `spec:decisions.studio-build-renders` rules, so a trace graph draws one hop, a maturity map places members by stated rung and floor, a card always shows its rung, and the attributes the original used to choose another setting are gone.",
    sections: {
      intent: {
        outcome:
          "Give the Studio a small set of custom elements that each hold one view of the graph, rendered by the build, in a Studio page or in any HTML page that holds that markup and loads the element script.",
      },
      behavior: {
        rules: [
          "Each element is self-contained and light on dependencies, and works in any HTML page that holds the markup the build wrote for it and loads the Studio's script.",
          "The build renders every element's view into its markup, from reader values and the recipe answers the page names, so the view reads without script; the element adds only interaction, and an element whose view needs none is defined with no behavior.",
          "An element with a graph subject takes that subject's graph id in the attribute its Design entry names; an element over gathered intents has no single graph subject.",
          "Every element's name starts with `sdp-`.",
          "A diagram is laid out by the engine when the page set is built and written as inline SVG, and its element adds only pan, zoom and pinch, as `spec:decisions.studio-diagram-renderer` rules; one diagram draws within the bound `spec:consumers.spec-studio.diagrams#design.bound` names.",
          "Every element ships in the one classic script the page elements ship in, and none loads anything at run time.",
        ],
        ruleKeys: {
          selfContained: "rules[0]",
          buildRenders: "rules[1]",
          subjectAttribute: "rules[2]",
          diagramRenderer: "rules[4]",
          oneScript: "rules[5]",
        },
      },
      design: {
        description: "The elements in the original's order, with their attributes.",
        specCard:
          "`sdp-spec-card` with `spec-id` and `variant`: one Spec as a card; `full` is a Pack page's member card, `short` one line with the title linked, the id, the rung badge and the floor in words; no behavior.",
        traceGraph:
          "`sdp-trace-graph` with `spec-id`: the Spec's relations one hop each way, drawn in relation bands inside an `sdp-diagram`, then its text equivalent; no behavior of its own.",
        maturityMap:
          "`sdp-maturity-map` with `pack-id`: the Pack's members placed by stated rung and floor reached, as a table of short cards; no behavior.",
        exampleSpace:
          "`sdp-example-space` with `spec-id`, naming the Spec that owns the example space: the space's slots with their types and the step that declares each, its children's bound points as a table with one row per example and one column per slot, an unbound slot written `unbound`, its expected-outcome oracle binding as present or none, and recipe 44's coverage; its coverage is a report, never a verifier run or a delivery fact; no behavior beyond the composing actions inside it.",
        diagramView:
          "`sdp-diagram` with `subject`, the element `spec:consumers.spec-studio.diagrams#design.diagramElement` states.",
        scenarioEditor:
          "`sdp-scenario-editor` with `spec-id` and `mode`: in `edit` mode a form holding the example's given, when and then steps, in `propose` mode the parent's step vocabulary as a starting point; submitting gathers an intent scoped to the example or to the parent, with the steps as its exact text; without script it shows the steps as text and says that composing needs the script.",
        impactView:
          "`sdp-impact-view` with `spec-id`: a Spec's impact panel on its own, its trace graph, what it rests on and what rests on it; no behavior.",
        intentPanel:
          "`sdp-intent-panel` with `page-root` and no graph-subject attribute, rendering the gathered intents across their scopes as `spec:consumers.spec-studio.intent-panel` states.",
        composeAction:
          "`sdp-compose` with `scope` and `action`: a button labelled with what it composes that opens the compose dialog and gathers the intent in the composing panel; `scope` is a Spec id or entry address and `action` one of `resolve-question`, `promote-question`, `edit-example`, `propose-example`, `change-target`, `propose-target`, `propose-values` and `change-entry`; hidden without script.",
        validationFindings:
          "`sdp-validation-findings` with `filter`: the validation report's findings for the Spec or Pack id the filter names; no behavior.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.components.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.data",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    title: "The Studio renders from the reader's values and embeds only what its script reads",
    narrative:
      "The build writes each value into the page's markup, so a page reads in full as HTML. Search is the exception: a browser refuses a fetch from a page opened through `file://`, so the search page carries its index inside it. On the first adopter's corpus that index is too large to repeat on every page, which is why search runs on a page of its own.",
    sections: {
      intent: {
        outcome:
          "Render every Studio page from the values the reader returns for the graph the agent surface reads, so a page derives nothing of its own and carries only the data its script needs.",
      },
      behavior: {
        rules: [
          "The build renders the index from `specs()`, `packs()`, `findings()` and each Spec's design columns, a Pack page from `packContext` and the Pack totals, a Spec page from `specContext`, and the search page from the search index; every page's rail renders the rail values. A page states no value the reader did not return or a named recipe did not answer, apart from counts the build takes of those values.",
          "A page whose script reads data embeds it in one `script` element of type `application/json` with the id `sdp-data`, serialized as JSON with every `<` then written as the six characters `\\u003c`, so no text can close the element. The search page embeds the search index there; every other page embeds no data, because its values are in its markup.",
          "The page set writes no data file of its own: an agent reads the graph through `sdp q`, and `sdp build` writes the serialized graph.",
          "The Studio's data holds no context bundle or other AI slice: the context bundle is composed on each invocation and never saved, and a design pass composes one with its recipe when it needs it.",
        ],
        ruleKeys: {
          readerValues: "rules[0]",
          embeddedData: "rules[1]",
          noDataFiles: "rules[2]",
          noSlices: "rules[3]",
        },
      },
      design: {
        packTotals:
          "`{ members: number; unresolved: number; heldBelowNextRung: number; waitingForAuthor: number; entries: number; declarations: number; openQuestions: number; blockingQuestions: number; withImplementations: number; withReferences: number; restsOn: number; restedOnBy: number; verifiedBy: number; supersededBy: number }`, the totals recipe 29 returns for the Pack, each counted as that recipe counts it.",
        railValues:
          "`{ packs: { id: string; title?: string; members: { id: string; title?: string; statedReadiness?: string; ownsExampleSpace: boolean }[] }[]; findings: { errors: number; warnings: number } }`, the values every page's rail renders: each Pack in id order with its members in authored order, a member owning an example space when its Spec context carries one, and the validation report's findings counted by severity.",
        searchIndex: "`{ records: SearchRecord[] }`, one record per graph node, in id order.",
        searchRecord:
          '`{ id: string; nodeType: "Primitive" | "Pack" | "Anchor" | "CodeNode"; page: string | null; title?: string; label?: string; framing?: string; narrative?: string; sections?: Record<string, unknown>; file?: string; line?: number; specKind?: string; statedReadiness?: string; floorReached?: string | null; bindings: { edge: string; specId: string }[]; entries: SearchEntry[] }`: `title`, `label`, `framing`, `narrative` and `sections` exactly as the graph node holds them, the fields `findByConcept` reads; `page` the node\'s page path in the page set, null for an Anchor or a CodeNode; `file` and `line` as recorded; the kind and the two rungs on a Spec only, `floorReached` null when no rung derives; `bindings` the Specs an Anchor\'s or CodeNode\'s outgoing edges reach, with the edge type, and empty for any other node.',
        searchEntry:
          "`{ section: string; entry: string | null; key: string | null; address: string | null; line: number | null; text: string }`, one per value recipe 23's walk reaches in a Spec's narrative and sections, taken with no term: each string, and each value that is not a string under a key the author coins, as its JSON text; in that walk's order, with that recipe's entry path, coined key, address and line. A term matches an entry as that recipe matches it, a string by its key or text and any other value by its key only, so the entries a term matches are the rows recipe 23 returns for it.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.data.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.data.recipe-answers",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    title: "A page takes each recipe answer from the recipe's shipped body",
    narrative:
      "The lenses, the registers, the owner queue, the diff and runs pages and the panels of a Spec page show recipe answers. Each takes its answer from the recipe's shipped body, evaluated over the graph the build derived, so a page and `sdp q` give one answer. The two Design entries name every evaluation a build runs and which page reads each answer, so a builder and a test author read one list.",
    sections: {
      intent: {
        outcome:
          "Compose every recipe answer a Studio page shows by evaluating the recipe's shipped body over the graph the build derived, so a page and `sdp q` give one answer.",
      },
      behavior: {
        rules: [
          "The build composes each recipe answer a page shows by evaluating that recipe's shipped body, the one `dist/recipes/` holds, over the graph, reader and validation report it derived, with the parameters the recipe evaluations name, through the body evaluation `sdp q` runs; it re-implements no recipe, so a page and `sdp q` give one answer.",
          "Each evaluation the recipe evaluations name runs once per build, and every page that shows its answer reads that one answer.",
        ],
        ruleKeys: {
          recipeEvaluation: "rules[0]",
          oncePerBuild: "rules[1]",
        },
      },
      design: {
        recipeEvaluations:
          "a build evaluates each of these once, with no parameter unless one is named: recipes 17, 20, 24, 31, 33, 43, 44, 46 and 51; recipe 29 with `{ pack: id }` for every Pack; recipe 21 with `{ spec: id }` and recipe 30 with `{ specs: [id] }` for every Spec; recipe 34 with `{ spec: id }` for every Spec that is not an example, Specs in no Pack included; given a base graph, recipe 35 with `{ base, detail: true }`, and with `{ base, pack: id }` for every Pack; given run records, recipe 45 with `{ runs }`.",
        pageRecipes:
          "the index and the glossary render reader values only; the architecture lens renders recipes 17 and 43; the tests lens renders every recipe 34 answer, recipe 44, and recipe 45 given run records; a Spec page renders its recipe 21, 30 and 34 answers, its own space from recipe 44, the recipe 51 rows that cite its entries, the recipe 45 files whose `specs` hold its id, and its own row of recipe 35's whole-corpus answer; a Pack page renders the totals of its recipe 29 answer and, given a base graph, its own recipe 35 answer; the registers render recipes 20, 31, 24 beside recipe 51's rows, and 33; the owner queue renders recipe 46; the diff page renders recipe 35's whole-corpus answer; the runs page renders recipe 45; an export renders the values of the pages it holds.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.data.recipe-answers.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.data.inputs",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    title: "The Studio reads two named inputs beside the graph, a base graph and run records",
    narrative:
      "Two inputs may ride beside the graph: the graph an earlier commit wrote, so a page can show what changed since, and CI run records, so a reviewer reads what ran beside the verifier bindings. Each is named on the command line and on every page that shows it, and neither answers in the graph's name. Without them the page set is what the graph alone writes.",
    sections: {
      intent: {
        outcome:
          "Let the Studio's build read a base graph and run records beside the graph, each named where it shows, while the graph alone writes the page set when neither is given.",
      },
      behavior: {
        rules: [
          "Beside the graph the build reads at most two inputs, each named on the command line: a base graph, the graph object `sdp build` wrote at an earlier commit, which reaches recipe 35 as `params.base`; and run records, each one Common Test Report Format document, which reach recipe 45 as `params.runs`. The build reads neither in any other way.",
          "The studio verb also takes `--base PATH`, naming the base graph, a JSON file `sdp build` wrote; `--base-label TEXT`, the words that name the base graph on its pages; and `--runs PATH`, naming one run record, a JSON file in the Common Test Report Format, repeatable, the records keeping the order of their flags. `--base-label` without `--base`, or `--base` given twice, is refused.",
          "An input file that cannot be read or does not hold JSON refuses the run before extraction, with exit 1 and one line on stderr naming the flag and the path; a JSON value a recipe cannot read shows on its page as that recipe's diagnostics.",
          "An input adds pages and page sections, never a data file: the base graph adds `diff.html` and the changed-since-base sections of the Spec and Pack pages, and run records add `runs.html` and the run rows of the tests lens and the verification panels.",
          "A page that shows an input names it in words, the base graph by its label when it was given one, its schema version and its Spec count, and a run as `spec:consumers.spec-studio.runs-page` names it; no page holds an input's path.",
          "An input never becomes graph data, a delivery fact, a finding, a rung or a verdict: no page counts a run toward a binding, and no difference from the base moves a rung.",
          "A run leaves every input file byte-identical.",
          "Without inputs the page set is the one the graph alone writes; with them, the same graph and the same input bytes and labels write the same page set, byte for byte, and a value an input carries, such as a run's commit and times, shows only on the pages that name that input.",
        ],
        ruleKeys: {
          namedInputs: "rules[0]",
          inputFlags: "rules[1]",
          unreadableInput: "rules[2]",
          inputPages: "rules[3]",
          inputNaming: "rules[4]",
          inputsNeverGraph: "rules[5]",
          inputsUntouched: "rules[6]",
          sameInputsSameBytes: "rules[7]",
        },
        exampleSpace: {
          given: [
            "an extraction root holding a Pack and its member Specs",
            'the studio command is given the base graph {base:"none"|"an earlier graph of the root"} and the run records {runs:"none"|"one CTRF report"}',
          ],
          when: ["the studio command runs twice with those inputs"],
          then: [
            "the two runs wrote byte-identical files: {byteIdentical:boolean}",
            "the page set holds the diff page: {diffPage:boolean}",
            "the page set holds the runs page: {runsPage:boolean}",
            "every page that shows an input names it and holds no input path: {inputsNamed:boolean}",
          ],
        },
      },
      design: {
        studioInputs:
          "`{ base?: { graph: unknown; label: string | null }; runs: unknown[] }`, the inputs the command hands the build: `base` absent without a base graph, `runs` the run records in the order the command names them and empty without any.",
        baseName:
          "`{ label: string | null; schemaVersion: string; specs: number }`, how a page names the base graph: the label the command gave or null, the base graph's `schemaVersion`, and its count of Spec nodes.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.data.inputs.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.data.inputs.graph-only",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "Without inputs the page set is the graph's alone",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the graph-only build: no input, no input page, and the same bytes twice.",
        assumptions: [
          "The world writes a root with one Pack of two member Specs, runs the studio command twice with no input flag, and compares the two page sets file by file; it reads every page for the words `base graph` and `run evidence`, which no page may hold without an input.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "an extraction root holding a Pack and its member Specs",
              'the studio command is given the base graph {base: "none"} and the run records {runs: "none"}',
            ],
            when: ["the studio command runs twice with those inputs"],
            then: [
              "the two runs wrote byte-identical files: {byteIdentical: true}",
              "the page set holds the diff page: {diffPage: false}",
              "the page set holds the runs page: {runsPage: false}",
              "every page that shows an input names it and holds no input path: {inputsNamed: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.data.inputs.graph-only.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.data.inputs.both-given",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "Both inputs add their pages, named, and the same inputs write the same bytes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the two named inputs: each adds its page, each page names its input without its path, and two runs with the same inputs write the same bytes.",
        assumptions: [
          "The world writes a root with one Pack of two member Specs and a test anchor verifying the first, writes the root's graph with `sdp build` and keeps it outside the root as the base, adds a third Spec, writes one CTRF report whose one test names the anchored test file, and runs the studio command twice with both inputs and the label `before`. It reads the diff and runs pages for the label and the tool name, checks that no file in the page set holds either input's path, and checks that the graph the build derived holds no node or edge from either input.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "an extraction root holding a Pack and its member Specs",
              'the studio command is given the base graph {base: "an earlier graph of the root"} and the run records {runs: "one CTRF report"}',
            ],
            when: ["the studio command runs twice with those inputs"],
            then: [
              "the two runs wrote byte-identical files: {byteIdentical: true}",
              "the page set holds the diff page: {diffPage: true}",
              "the page set holds the runs page: {runsPage: true}",
              "every page that shows an input names it and holds no input path: {inputsNamed: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.data.inputs.both-given.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.intent-panel",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "A composing panel on every page gathers scoped intent for an agent",
    narrative:
      "The change-proposal contract requires the commit whose graph the person read, and a generated page set carries no commit, so a proposal's base comes from the build stamp when one is present and from the person otherwise. The panel hands off the same Markdown memo an agent gets from recipe 49 for the same proposal, so a person, a reviewer and an agent read one text. A static page holds no credentials, so the panel opens no pull request and writes nothing but its own gathered intents in the browser.",
    sections: {
      intent: {
        outcome:
          "Let a person gather the changes they want while they read, each bounded by a Spec, its neighbors, a Pack or one open question, and hand them to an agent that edits source.",
      },
      behavior: {
        rules: [
          "The composing panel is on every page, after the canvas, closed by default with its heading and the count of gathered intents; without script it says that composing needs the script.",
          "The panel writes no source; its hand-off follows `spec:consumers.intent-composition`.",
          "A person gathers intents across pages before handing them off.",
          "Gathered intents persist in the browser's local storage under the page set's own key, so refreshing a tab on a phone loses none, and two page sets served from one host never share intents.",
          "A composed intent names its scope by id or entry address, so the agent that receives it reads the same Spec, Pack, entry or question through the graph.",
          "The panel hands its gathered intents off as one change proposal, on the change-proposal contract, and as the memo recipe 49 renders for it: the person copies the memo or the proposal as text, or saves either as a file. The page opens no pull request, because a static page holds no credentials; any pull request comes from the agent's ordinary source edit.",
          "The memo the panel writes for a proposal is byte for byte the memo recipe 49 returns for the same proposal.",
          "A proposal's base is the commit a present build stamp names, otherwise one the person supplies, and the person gives one reason for the whole proposal; without a base and a reason the panel exports its intents as scoped-intent text, and the agent that receives them writes the proposal against a commit it knows.",
          "A request scoped to a Pack records the members this page set renders for that Pack, and expands to them at hand-off only when the proposal's base is the commit the page set's stamp names; otherwise it stays scoped-intent text for an agent to resolve against the base. A request that changes a Pack's membership or framing, or names an empty Pack, stays scoped-intent text too, so the change-proposal contract keeps its Spec and entry scopes.",
          "The proposal holds only the intents its contract can carry; every intent that stays scoped-intent text is listed apart under `Not in the proposal`, and `Copy scoped intent` copies those intents, so the panel drops none.",
          "The panel requests nothing over the network and sends its intents nowhere.",
        ],
        ruleKeys: {
          everyPage: "rules[0]",
          persist: "rules[3]",
          handOff: "rules[5]",
          sameMemo: "rules[6]",
          proposalBase: "rules[7]",
          packScope: "rules[8]",
          textApart: "rules[9]",
          noRequest: "rules[10]",
        },
        exampleSpace: {
          given: ["the composing panel holds {gathered:number} gathered intents"],
          when: ["the person refreshes the tab"],
          then: ["the composing panel holds {kept:number} gathered intents"],
        },
      },
      design: {
        storageKey:
          "`sdp-studio:intents:<root path>`, where the root path is the URL path of the page set's root as the page's `page-root` attribute resolves it, so a page set at `/preview/12/` and one at `/preview/13/` keep apart.",
        intentRecord:
          "`{ scope: string[]; request: string; text?: string; replaces?: string; follows?: string; pack?: string; action: string }` per gathered intent, in gathering order, where `action` names the composing action that gathered it, such as `edit-example`, and `pack` keeps the Pack a Pack-scoped request named, with `scope` holding the members this page set renders for it.",
        savedFiles:
          "`proposal.json` holding the proposal document and `proposal.md` holding its memo, each saved through a link the panel writes with the `download` attribute.",
        baseSource:
          "the panel reads the base from the `data-corpus-commit` attribute the page's `sdp-stamp` sets once its stamp loads, and requests no stamp of its own.",
      },
      ui: {
        gatheredIntents:
          "the intents gathered so far, headed `Composing` with their count, each on one line naming its scope and the change it asks for, such as adding an example or changing a constraint's target, with a button that discards it.",
        baseAndReason:
          "the base as code when a stamp names it, otherwise a labelled text field for a commit, then a labelled text field for the proposal's reason.",
        panelActions:
          "`Copy memo`, `Copy proposal`, `Save memo`, `Save proposal` and `Discard all`, the copy and save actions shown only when a base and a reason are present; and `Copy scoped intent` whenever an intent stays scoped-intent text, every intent without a base and a reason, and otherwise those the proposal cannot hold.",
        composingActions:
          "the actions on other panels that compose intent: propose new text for a keyed entry, resolve an open question or promote it to a decision record, propose or edit an example, propose or change a constraint target, and propose examples for values no example binds.",
        composeDialog:
          "a native dialog with a labelled text area for the request, a second for the exact entry text when the action proposes one, and `Gather` and `Cancel` buttons.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.intent-panel.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "Four lenses read the graph as Packs, architecture, tests and evidence",
    narrative:
      "Each lens is a page with a Spec of its own, so each builds on the graph it reads today: the Packs, architecture and tests lenses read what the graph records, and the evidence lens reads not tracked until the graph records an observation. This Spec keeps what the four share.",
    sections: {
      intent: {
        outcome:
          "Let a person see the graph four ways, by Pack, by architecture, by verification and by evidence, from one top navigation.",
      },
      behavior: {
        rules: [
          "The lenses are pages of the page set, reached from the top navigation in the order Packs, architecture, tests, evidence; the index page is the Packs lens and the default landing page.",
          "A lens renders reader values and the recipe answers its own Spec names, and computes none of them in the page.",
          "A lens writes nothing and states nothing: it lists, groups, draws and links, and a change a person wants from it leaves through the composing panel as scoped intent.",
        ],
        ruleKeys: {
          order: "rules[0]",
          lensValues: "rules[1]",
          readOnly: "rules[2]",
        },
      },
      ui: {
        lensPages:
          "`index.html` for the Packs lens, `architecture.html`, `tests.html` and `evidence.html`, each opening with its name and one sentence saying what it reads.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.lenses.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.responsive",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The Studio reads on a phone as on a desktop",
    narrative:
      "The curated graph's edges carry no confidence, and the impact graph's inferred imports stay outside it, so a diagram never drops an edge for a low score; a trace graph draws one hop at every width, and a narrow screen scales the drawing rather than cutting it.",
    sections: {
      intent: {
        actor:
          "A person reviewing a design on a phone, including a pull request reviewer who holds only a link.",
        outcome: "Let a design be reviewed on a phone through the same pages a desktop shows.",
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
        singleColumn:
          "every layout collapses to one column below 720 CSS pixels of viewport width.",
        pinchZoom:
          "on a touch device, every diagram zooms with a pinch, which the diagram element adds.",
        narrowDiagram:
          "below the same width a diagram opens scaled to the screen's width, with its zoom controls above it and its text equivalent below it, and draws the same boxes and edges a desktop draws.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.responsive.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    title: "The Spec Studio is a static HTML workbench over the one graph",
    narrative: null,
    sections: {
      intent: {
        actor:
          "A person in the repository who designs a capability ahead of its code and iterates on it in passes, and a pull request reviewer who holds only a link; both read far more than they change.",
        outcome:
          "Give a person reviewing a design one generated HTML workbench that explores the whole graph through lenses, shows each Spec and Pack in context, and turns a wanted change into scoped intent rather than an edit.",
        problem:
          "The generated Markdown Design Review offers no built-in search or filters, and navigation is through its links, so reviewers in the first adopter open carrier files alongside it.",
      },
      behavior: {
        rules: [
          "The read-only Studio ships in the open-source package `@libar-dev/software-delivery-protocol`, beside the four shipped projections; hosted review, shared comments and hosted previews may later ship under `@libar-ai/`.",
          "The Studio is a projection of the one graph: its page set under `generated/spec-studio/` is regenerated from the graph, states no truth, and confers nothing back into the graph.",
          "The Studio is a static page set: the index page, which is the Packs lens; a search page; a page for each other lens, each register, the owner queue and the glossary; one page per Pack and per Spec; one export file per Pack; and, when the build is given their inputs, a diff page and a runs page; with their local assets. Its build renders each page whole, so a page needs no server, and every page but the search page reads without its script, which adds filtering, search, copying, pan and zoom, and the composing panel.",
          "The Studio works offline: the same files open from the file system through `file://` for local use and from any static host for sharing.",
          "The Studio is reproducible: one graph and the same inputs render byte-identical files, and an asset whose filename embeds a hash of its content gets the same name from the same graph.",
          "The Studio is read-rich: everything the graph holds about a Spec or a Pack is explorable in it.",
          "The Studio is write-careful: it writes nothing to canonical source, and a change a person wants leaves it as scoped intent for an agent, as `spec:consumers.edit-model` states.",
          "The Studio never builds a second graph: every join, claim, delivery fact, derived readiness, floor failure and finding it shows is a value the reader computed when the Studio was built, and the page computes none of them again.",
          "A page shows a catalog recipe's answer only when the Studio's design names that recipe, and the build composes the answer over the graph it derived; the page recomputes none of it.",
          "Beside the graph the Studio reads only two optional inputs, a base graph and run records; each is named on every page that shows it, never becomes graph data, a delivery fact or a verdict, and never answers in the graph's name.",
          "The Studio stands beside the shipped Design Review, census, Mermaid and Gherkin projections and re-specifies none of them, which `spec:decisions.shipped-projections-frozen` keeps as they are.",
        ],
        ruleKeys: {
          staticPageSet: "rules[2]",
          noSecondGraph: "rules[7]",
          recipeAnswers: "rules[8]",
          namedInputs: "rules[9]",
        },
      },
      verification: {
        mode: "manual",
        criteria: [
          "The Studio is accepted when a person given only a link to a build of the first adopter's corpus completes, from the page set alone, the five tasks the first adopter set over its history-view Pack (`libar-platform/docs/feedback/sdp-feedback-01.md`): find the history contract, locate OD-157, explain the aggregate dependency, find one declaration's type comparison down to the source line that checks it, and say whether a paused-rebuild example has native-backend evidence. Given no run records, the last task passes when the person finds that the example requires the native backend tier, reads whether a verifier is bound to it, and reports that no run result is supplied.",
          "The same person names which statements the owner can make first, from the owner queue page.",
          "The same person, given a build with a base graph, names what changed in the design since the base, from the diff page.",
          "The same person names which components are designed and not yet built, from the architecture lens.",
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.sharing",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "A Studio build is stamped and shared from a static host",
    narrative:
      "A page set is a function of the graph and its named inputs, so it carries no commit or time. A reviewer opening a preview still needs to know which commit and which engine built it, so a publishing step that runs after the build writes one stamp file at the page set's root, and the shell shows it where the set is served over http or https. The same stamp may name where the repository's source is served, so a recorded file and line become a link in a preview and stay text everywhere else. A reusable workflow does the build, the stamp and the upload for every pull request, and deploys a preview only where the repository has chosen a host.",
    sections: {
      intent: {
        outcome:
          "Let a stakeholder open the Studio of a pull request from a link, and let its author know which graph and which build the stakeholder read.",
      },
      behavior: {
        rules: [
          "A build is shared by uploading its page set to a static host, such as S3, Vercel or GitHub Pages.",
          "A stakeholder opens the link, navigates the Studio and composes intent, and the pull request's author hands that intent to an agent that edits the source.",
          "The Studio's build writes no stamp, so every page and data file it writes stays a function of the graph and its named inputs; the stamp is written apart, after the build.",
          "`sdp stamp [root] [--commit SHA] [--source TEMPLATE]` writes `stamp.json` into `<root>/generated/spec-studio/` and touches no other file: it derives no graph, renders no page, and refuses with exit 1 when the root holds no page set; a stamp without `--commit` names the commit `unknown`.",
          "A later build removes the page set and its stamp together, so no stamp outlives the build it names.",
          "Publishing a preview and writing its stamp are a step the adopter's CI runs, never the Studio's build; the shell reads the stamp as `spec:consumers.spec-studio.shell#rule.stamp` states.",
          "The package's repository ships a reusable GitHub Actions workflow that, on a pull request, installs the caller's dependencies, runs `sdp studio` with the caller's root, exclusions and inputs, runs `sdp stamp` with the pull request's head commit and the repository's source template, and uploads the page set as a CI artifact; it opens no pull request, writes no comment and holds no credential beyond the run's own token.",
          "The workflow deploys the stamped page set under `/preview/<pr-number>/` only when the caller asks for it and the repository serves a host from the branch the workflow writes to; a pull request from a fork never deploys.",
          "Every recorded file and line a page shows as text carries its file and line as data on its element, and when a loaded stamp names a source template the stamp element links each to the template with the file and line filled in; without such a stamp, or through `file://`, each stays text.",
        ],
        ruleKeys: {
          buildWritesNoStamp: "rules[2]",
          stampVerb: "rules[3]",
          stampLifetime: "rules[4]",
          publishingStep: "rules[5]",
          previewWorkflow: "rules[6]",
          previewDeploy: "rules[7]",
          sourceLinks: "rules[8]",
        },
        exampleSpace: {
          given: ["a page set the studio command wrote at an extraction root"],
          when: [
            "the stamp command runs with the commit {commit:string} and the source template {source:string}",
          ],
          then: [
            "the stamp names the corpus commit {corpusCommit:string}",
            "every page file stays byte-identical: {pagesUntouched:boolean}",
            "a later studio run keeps the stamp: {stampSurvives:boolean}",
          ],
        },
      },
      design: {
        buildStamp:
          "`{ schemaVersion: string; corpusCommit: string; engine: string; builtAt: string; source?: string }` in `stamp.json` at the page set's root, written by `sdp stamp` and never by the Studio's build: the graph schema version of the stamping engine, the commit `--commit` names or `unknown`, the engine `sdp --version` names, the time the step ran as an ISO 8601 UTC timestamp to the second, and the source template `--source` names, when given.",
        sourceTemplate:
          "a URL holding `{file}` and optionally `{line}`, such as `https://github.com/<owner>/<repo>/blob/<commit>/{file}#L{line}`, into which the shell writes a recorded root-relative file and its line; `sdp stamp` refuses a template without `{file}`.",
        previewWorkflow:
          "`.github/workflows/studio-preview.yml`, triggered by `workflow_call` and called as `uses: libar-dev/software-delivery-protocol/.github/workflows/studio-preview.yml@<ref>`.",
        workflowInputs:
          "`root` (default `.`), `exclude` (root-relative prefixes, one per line), `node-version` (default `20`), `install` (the install command, default `npm ci`), `sdp` (the command that runs the installed `sdp`, default `npx sdp`), `runs-artifact` (the name of an artifact an earlier job uploaded holding CTRF reports, each passed as `--runs`), `diff` (a boolean: write the graph of the pull request's base commit in a separate worktree, with that commit's own install and engine, and pass it as `--base` labelled `base <short commit>`), and `deploy` (a boolean, default false).",
        previewArtifact: "the artifact `spec-studio-pr-<pr-number>`, holding the stamped page set.",
        workflowSource:
          "the workflow stamps with the pull request's head commit and the source template `<server>/<repository>/blob/<head commit>/<root>/{file}#L{line}`, the root and its slash left out when the root is `.`.",
        previewPath:
          "a pull request's preview is served at `<host>/preview/<pr-number>/`, which the workflow writes as the folder `preview/<pr-number>/` of the `gh-pages` branch, the branch GitHub Pages serves when a repository enables Pages from it.",
        stampElement:
          "the page element `sdp-stamp`, once its stamp loads, also sets `data-corpus-commit` on itself and, when the stamp names a source template, wraps each `code` element carrying `data-source-file` and `data-source-line` in a link to the template with `{file}` and `{line}` filled in, the file percent-encoded by path segment; without a template it links nothing.",
      },
      ui: {
        sourceMark:
          "a recorded file and line written as `<file>:<line>` in a `code` element carrying `data-source-file` and `data-source-line`, beside its copy action.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.sharing.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.shell",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The Studio's shell frames every page with navigation, a rail and a canvas",
    narrative:
      "The shell carries what every page shares, including the rules that keep a page readable: by keyboard, without color, on a phone and without its script. Recent edits stay out of it, because a page is a function of the graph alone and git holds the history.",
    sections: {
      intent: {
        outcome:
          "Let a person move between the index, Packs and Specs from any page, find a Spec by what they remember of it, and read every page by keyboard, on a phone and without its script.",
      },
      behavior: {
        rules: [
          "Every page has the same shell: a top navigation, a left rail and a main canvas, and it opens with a link that skips to the canvas.",
          "A search field is on every page; `spec:consumers.spec-studio.search` states what it matches and how its results show.",
          "The rail's count of findings is the count of the validation report's findings, never a count the page derives.",
          "The shell shows no recent edits and no other history: git holds it.",
          "Served over http or https, the shell reads `stamp.json` beside the page set and, when it loads, shows the build context it names; a page opened through `file://` requests nothing and shows no stamp.",
          "A stated rung shows as a badge that carries the rung's word, colored from a palette of four that stays distinct under color blindness; the floor reached shows beside it as words with no color of its own, and only the divergence banner adds a warning color, beside its words.",
          "Every status a color marks is also written in words, so no reading depends on color.",
          "Every link and control is reachable from the keyboard in reading order and shows where the focus is.",
          "Prose runs no wider than about 80 characters, and a table wider than the canvas scrolls inside its own box, never the page.",
          "Authored text renders as plain text with each inline code span as code, and no other Markdown is read. A mention the prose-mentions validator reads links to its target's page when the target resolves, and to the entry when the mention is an entry address.",
          "Every page but the search page reads in full without its script: its collapsible parts are native disclosure elements, and only filtering, copying, the stamp, pan and zoom, and the composing panel need the script. The search page needs its script to match, and without it says so and links to the index.",
        ],
        ruleKeys: {
          noRecentEdits: "rules[3]",
          stamp: "rules[4]",
          rungBadge: "rules[5]",
          wordsBesideColor: "rules[6]",
          keyboard: "rules[7]",
          lineLength: "rules[8]",
          text: "rules[9]",
          withoutScript: "rules[10]",
        },
      },
      ui: {
        description: "The parts of the shell, top to bottom and left to right.",
        topNavigation:
          "the Studio's name linking to the index, then Packs, linking to the index's Packs section, then the search field; each lens page the page set holds adds its entry in the order `spec:consumers.spec-studio.lenses` gives.",
        stampLine:
          "at the end of the top navigation, the stamp's corpus commit, engine and build time, when the stamp loads.",
        leftRail:
          "on a Pack page, the Pack's members in authored order, each linked to its card on the page; on a Spec page, each Pack the Spec belongs to with its members in authored order, each linked to its Spec page and the current one marked; on any other page, every Pack; then, on a Pack or Spec page, under an `Example spaces` heading shown only when there is one, each member of the rail's Packs that owns an example space, linked to its Spec page, with no harness named; then the validation report's finding counts by severity, linked to the index's findings.",
        railOnPhone:
          "below the phone breakpoint the rail follows the canvas, so a page opens on its content.",
        mainCanvas: "the page of the Spec or Pack selected in the rail or in a lens.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.shell.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.navigation",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "Every page of the page set is reached from the top navigation and the index",
    narrative:
      "The shell's top navigation reaches the index and each lens, and the index routes a reader by the task they came to do. The register pages, the owner queue, the glossary, and the diff and runs pages join both, so a reviewer with only a link reaches every page from any page and sees which page they are on.",
    sections: {
      intent: {
        outcome:
          "Let a person reach every page of the page set from the top navigation of any page, and from the index by the task they came to do.",
      },
      behavior: {
        rules: [
          "After the lens entries, the top navigation lists Queue, Questions, Decisions, Declarations, Backlog and Glossary, then Diff when the build was given a base graph and Runs when it was given run records, each linking its page; the search field follows them.",
          'The top-navigation link to the page being read carries `aria-current="page"` and an underline, so it shows by more than color.',
          "After its four routes, the index's `Start here` list adds See what the owner can state first, linking the owner queue; See the components by context and layer, linking the architecture lens; and, given a base graph, See what changed since the base, linking the diff page.",
        ],
        ruleKeys: {
          topEntries: "rules[0]",
          currentPage: "rules[1]",
          indexRoutes: "rules[2]",
        },
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.navigation.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.spec-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "A Spec page shows one Spec in collapsible panels, in a fixed order",
    narrative:
      "The original runtime panel linked Fastify routes to Effect programs, showed what Effect layers provided and required, and recorded Awilix registrations and their lifetimes, beside ports and external systems. That representation is lineage evidence in `docs/lineage/v0-design/07-spec-studio-and-projections.md`, section 2.3, Section F. The structural anchors record identity, component membership, uses, role, and a component's architectural layer and context, so the runtime panel shows that structural neighborhood and no more until a reader asks for more of the runtime composition.\n\nThe page shows only what the graph and the build's named inputs hold. The original header's owner, tags and last-verified time, its schema bindings and its `UI / Stories` section have no graph value behind them, so the page shows none of them.",
    sections: {
      intent: {
        outcome:
          "Show everything the graph holds about one Spec on one page, in panels a person opens and closes one at a time.",
      },
      behavior: {
        rules: [
          "Each panel collapses and expands on its own.",
          "The page's core, its header, sections, relations, bindings and findings, is the one `spec:consumers.spec-studio.spec-page.core` states, and the panels below add to it.",
          "Every Spec and Pack a panel names links to its page. A code unit, component or anchor shows its id and its recorded repository-relative file and line as text, with an action that copies `file:line`; the page set holds no code-unit page and writes no editor URI, absolute path or assumed source URL; a recorded file and line become a link only when a stamp beside the page set names a source template, as `spec:consumers.spec-studio.sharing` states; a component's attributes, members and uses show in the architecture lens, which its id links to.",
          "After the core's sections the page adds five panels, in this order, each open by default: Verification, Design view, Runtime, Evidence and Impact; a panel with nothing to show says so in one sentence and stays in its place; the core's relations, bindings and findings follow them.",
          "Inside the core's sections the page adds a composing action beside each keyed entry that proposes new text for it, the composing actions beside each open question, the rule coverage beside each keyed rule or flow and the example cards after the rules, each constraint's target, the citations beside each cited entry, and an element id on each keyed term, as the rules below state.",
          "Each keyed Model term in the core's Model section carries the element id `term.<key>`, its address after the `#`, and shows its key and its recorded line, as the core's entry ids do.",
          "Beside each keyed entry an anchored source file cites, its section lists every citing file and line recipe 51 records, as text with a copy action; a pinned declaration no file cites reads `no citation recorded`.",
          "The Design view panel draws the realization diagram of the units that satisfy the Spec, their components and what they use, and then lists the decision records the Spec names through `decidedBy`, each with its title linked and its decision text inline.",
          "The Runtime panel shows the structural neighborhood of the Spec's implementation anchors: each anchor's component with its layer and context, and the units it uses, each with its file and line; runtime observation reads not tracked.",
          "The Impact panel draws the Spec's trace graph, one hop each way, and then lists what it rests on with each target's stated and derived rung, from recipe 21, and every Spec that rests on it to any depth, by distance, with the units, enabled verifiers and Packs each brings, from recipe 30.",
          "Given a base graph, a line under the header names the base and lists the Spec's changed parts, as `spec:consumers.spec-studio.diff-page` states.",
        ],
        ruleKeys: {
          sourceText: "rules[2]",
          panelOrder: "rules[3]",
          sectionAdditions: "rules[4]",
          termIds: "rules[5]",
          citations: "rules[6]",
          designView: "rules[7]",
          runtime: "rules[8]",
          impact: "rules[9]",
          diffChangeNote: "rules[10]",
        },
        exampleSpace: {
          given: [
            "a Spec with two pinned declarations, the first of which an anchored test file {file:string} cites at line {line:number}",
          ],
          when: ["the build renders the Spec's page"],
          then: [
            "beside the first declaration the page lists {cited:string}",
            "beside the second declaration the page reads {uncited:string}",
          ],
        },
      },
      ui: {
        description: "The panels the core does not hold, in page order.",
        entryAction:
          "beside each keyed entry, an action that composes intent proposing new text for it, with the entry's address as the change's scope and as the address it replaces.",
        intentActions:
          "beside each open question, actions that compose intent to resolve it or to promote it to a decision record.",
        behaviorAdditions:
          "beside each keyed rule or flow, its exercising examples as `spec:consumers.spec-studio.verification-panels` lays them out, then the example cards and unwritten example cards.",
        constraintsAdditions:
          "each constraint with its target, laid out as `spec:consumers.spec-studio.verification-panels` states.",
        citationList:
          "under a cited entry, `Cited at` and each citing file and line with a copy action, the citing anchor's id as code when the citation names one.",
        verificationPanel:
          "the verifier list, with run evidence given run records, then the coverage grid when the Spec owns an example space, laid out as `spec:consumers.spec-studio.verification-panels` states; the panel's element id is `panel.verification`.",
        designViewPanel:
          "the realization diagram, drawn as SVG whose nodes show their id, source file and line as the source-text rule states, then the decision records with their decision text; the panel's element id is `panel.design-view`.",
        runtimePanel:
          "the structural neighborhood of the Spec's implementation anchors, each anchor's component and the code units it uses, with file and line, then `Runtime observation: not tracked`; the panel's element id is `panel.runtime`.",
        evidencePanel:
          "the evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states, with no invented build, deployment, measurement or bill-of-materials data; the panel's element id is `panel.evidence`.",
        impactPanel:
          "the trace graph, then `Rests on` and `Rested on by` lists, the second grouped by distance, each row with its units, enabled verifiers and Packs; the panel's element id is `panel.impact`.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.spec-page.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.spec-page.cited-declaration",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A pinned declaration shows the test line that cites it",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the citations beside pinned declarations: a cited declaration lists its citing file and line, and an uncited one says so.",
        assumptions: [
          "The world writes a root with one Spec whose Design section holds two keyed entries, each opening with a code span, and a test file that holds a `specTest` anchor and writes the first entry's address on its twelfth line, in the form the extractor records as a citation; it builds the page set and reads the Spec page under each declaration.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a Spec with two pinned declarations, the first of which an anchored test file {file: "test/orders.test.ts"} cites at line {line: 12}',
            ],
            when: ["the build renders the Spec's page"],
            then: [
              'beside the first declaration the page lists {cited: "test/orders.test.ts:12"}',
              'beside the second declaration the page reads {uncited: "no citation recorded"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.spec-page.cited-declaration.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.verification-panels",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The panels for examples, targets, verifiers and evidence",
    narrative:
      "The graph records that a verifier binding exists and never a run, and a static page runs nothing, so the panels show bindings and offer no run of an example. A run result shows only when the build was given run records, and then as evidence from a test file. No Spec designs a source for build attestations, deployments or bills of materials, so each reads not tracked. Moving a constraint target on a slider and running a scenario harness wait for designs of their own, as the HTML surface decision records; a panel action composes intent instead.",
    sections: {
      intent: {
        outcome:
          "Show on a Spec page how far each example, constraint target and verifier goes, and what runtime evidence exists, without stating more than the graph records.",
      },
      behavior: {
        rules: [
          "An example card shows the example's verifier as a binding that exists, and the example as an Executable Spec when a test anchor binds it, never as a test that passed.",
          "A panel shows verifier bindings and states no run result of its own; with the run records input, a verifier's row adds the results recipe 45 joins from its test file, labelled as external run evidence from that file, as `spec:observation.run-evidence` states, and never as the verifier's verdict.",
          "The evidence panel shows only runtime evidence the graph records, and reads not tracked while no delivery fact records an observation.",
          "Each panel action gathers intent in the composing panel, scoped to the Spec, the example or the entry it sits beside, and changes nothing on the page.",
          "Beside each keyed rule or flow, the panel lists the examples recipe 34 reports exercising it, each linked with enabled or not enabled in words, and a keyed rule no example exercises reads `no example exercises it`; the unkeyed rules are counted after the list.",
          "A Spec that owns an example space shows recipe 44's coverage: each enumerable slot with each of its declared values and the examples that bind it, a value no example binds reading `no example`; each other slot with the values its examples bind and the words `not enumerable`; and the examples that leave a slot unbound.",
        ],
        ruleKeys: {
          executableSpec: "rules[0]",
          bindingsOnly: "rules[1]",
          evidenceNotTracked: "rules[2]",
          composeActions: "rules[3]",
          ruleCoverage: "rules[4]",
          coverageGrid: "rules[5]",
        },
        exampleSpace: {
          given: [
            "a Spec whose keyed rule {exercisedKey:string} an enabled example exercises and whose keyed rule {otherKey:string} no example exercises",
          ],
          when: ["the build renders the Spec's page"],
          then: [
            'beside the first rule the panel lists the example as {enabledWords:"enabled"|"not enabled"}',
            "beside the second rule the panel reads {unexercised:string}",
          ],
        },
      },
      ui: {
        description: "The panels' parts in page order.",
        ruleList:
          "rules and flows in authored order, each keyed entry with its rule address, recorded carrier line and the examples that exercise it, followed by the example cards; an unrecorded line stays absent.",
        exampleCard:
          "one card per example that verifies the Spec: its title linked; its stated readiness and whether it is an Executable Spec; its given, when and then steps as preformatted text with their bound values; and actions to open the example's page and to compose intent to edit it.",
        unwrittenExampleCard:
          "an example with no given, when and then steps yet says so, and offers an action that composes intent proposing them.",
        constraintTarget:
          "each constraint with its flavor, its statement and its target as authored, and a measured value only when the graph records one, otherwise `not tracked`, with an action that composes intent to change the target.",
        unsetTarget:
          "a constraint with no target says so, and offers an action that composes intent proposing one.",
        verifierList:
          "each verifier with its id, its binding, and its recorded repository-relative file and line as text, as `spec:consumers.spec-studio.spec-page#rule.sourceText` states, no line invented for a verifier the graph does not locate; given run records, under each verifier the results joined from the test file that binds it, a test anchor's own file or, for an example, the file of the test anchor that verifies the example, each with its run, name, result in words and duration, headed `External run evidence from <file>`.",
        coverageGrid:
          "one table per enumerable slot, a row per declared value with the examples that bind it or `no example`; one line per other slot with the values bound and `not enumerable`; then `Unbound` with the examples that bind no value for a slot; and an action that composes intent proposing examples for the values no example binds.",
        evidencePanel:
          "runtime observation reads not tracked under the binding-language rule; build attestations, deployments and bills of materials show no payload and each reads not tracked until a Spec designs its source.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.verification-panels.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.verification-panels.rule-coverage",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "Each keyed rule shows the examples that exercise it, or that none does",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute rule coverage on a Spec page: an exercised rule lists its example in words, and an unexercised rule says so.",
        assumptions: [
          "The world writes a root with one behavior Spec holding the rules keyed `paid` and `refunded` and one example child that verifies it, exercising `paid`, bound by a `specTest` anchor; it builds the page set and reads the Spec page beside each keyed rule.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a Spec whose keyed rule {exercisedKey: "paid"} an enabled example exercises and whose keyed rule {otherKey: "refunded"} no example exercises',
            ],
            when: ["the build renders the Spec's page"],
            then: [
              'beside the first rule the panel lists the example as {enabledWords: "enabled"}',
              'beside the second rule the panel reads {unexercised: "no example exercises it"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.verification-panels.rule-coverage.sdp.md",
  },
  {
    id: "spec:consumers.pack-design",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/pack-design.sdp.md",
    title: "The Pack context carries the Pack's design",
    narrative:
      "A capability designed ahead of its code is read as a Pack: its members in reading order, how far each has matured, what design each carries, what it rests on, and which code answers to it. The reader holds every one of those facts. This Spec assembles them once on the Pack context so a page, a recipe and an adopter's script read one answer.",
    sections: {
      intent: {
        problem:
          "Reading a Pack's design means joining member readiness, the floor one rung above the stated rung, design entries, decisions, open questions, code bindings with their components, and the Specs outside the Pack, and every consumer that joins them by hand reads the floor or the boundary a different way.",
        outcome:
          "Give each Pack member its design columns and give the Pack its boundary on the Pack context, so the Design Review, a recipe and an adopter's page read the design from one assembly.",
      },
      behavior: {
        rules: [
          "One helper derives a Spec's design columns; the Spec context carries them as `designColumns` and each resolved Pack member carries the same value as `design`, while the Pack context carries the boundary.",
          "A member's stated next rung is the rung above its stated rung, none when it states `ready`. Its unmet clauses come from the one floor evaluator with that rung as the target, each failure with its targets when it has them. The list is empty when the floor already holds the stated next rung, so the rung waits for its author's statement, never a promotion. The floor reached and the failures at the rung above it are separate readings.",
          "A member's design columns count its keyed `design` and `ui` entries other than `description`, its pinned declarations under the contract-declarations rule, and its open questions with how many block. They list each question with its zero-based authored `index`, text, blocking flag, optional key, `decider`, `links`, `provisional` and `trigger` as present, and optional source line from the location table. They list the decisions it names through `decidedBy`, each with its stated rung or unresolved when the target is no Spec. The columns are counts and lists read from the graph, never a score or a rung.",
          "A member lists the code units that satisfy it and those that reference it as code unit bindings; each binding carries `codeId` and `claim`, plus `label`, `file`, `line` and `role` when recorded. A component unit carries its own optional `layer` and `context`; a `memberOf` edge adds its component's id and optional layer and context. The Spec context carries the same bindings.",
          "A member counts its verifiers and enabled verifiers, and the example Specs that declare `verifies` on it with how many are enabled, using the reader's verifier decoding.",
          "The Pack's boundary lists the Specs outside the Pack joined to a member by an authored relation. A Spec a member relates to by `refines`, `dependsOn`, `constrainedBy` or `decidedBy` is one the Pack rests on; a Spec that relates to a member by the same four relations is one that rests on the Pack. The boundary lists inbound `verifies` separately as `verifiedBy` and inbound `supersedes` as `supersededBy`, with the same row shape. Each row carries the outside Spec's id, title, stated rung and whether it carries `implemented`, and for each relation type the members it joins, the types in the closed relation list's order and the members in authored order. A relation whose target is not a Spec in the graph is left to referential integrity and does not appear.",
          "Members keep the manifest's authored order, unresolved members carry their unresolved row without design columns, and boundary rows sort by id in code-unit order.",
          "The assembly is a pure function of the graph: it reads no carrier file, records nothing, and confers no delivery fact or readiness.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.design-review.pack-design-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/design-review.pack-design-page.sdp.md",
    title: "A Pack page shows where the Pack's design stands",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Render a Pack's design assembly as one deterministic Markdown page a reviewer reads before a design pass, between iterations and before stating readiness.",
      },
      behavior: {
        rules: [
          "The page keeps its title line, framing and vocabulary references, then renders, in this order: the member table, what holds each member below its stated next rung, the Pack's boundary, the open questions, the code, the verifier coverage gaps, and the findings.",
          "The member table has one row per member in authored order: the linked Spec with its position from 1 and its title, kind, altitude, stated rung, floor reached, the stated next rung with `nothing blocks` when its unmet clauses are empty and the first unmet clause otherwise, the design columns as counts (entries, declarations, questions with the blocking count), the decisions it names, and the implementation and verifier binding columns with the present and none values `spec:consumers.binding-language-views#rule.aggregateColumns` fixes for every aggregate table, beside a design-reference column that reads present when a code unit references the member and none otherwise. Unit counts stay off the table, which offers existence and never a degree. An unresolved member keeps a row that says so, and the later sections skip it, because the graph holds none of its data.",
          "The section for the stated next rung lists each member with unmet clauses at its stated next rung, every clause with the targets it names and their stated rungs. A member whose floor already holds its stated next rung is listed apart as waiting for its author's statement, which the page never presents as approval.",
          "The boundary section lists, in order, Rests on, Rested on by, Verified by and Superseded by, from `restsOn`, `restedOnBy`, `verifiedBy` and `supersededBy`. Each empty list reads `None.`; otherwise a table gives each row with the linked Spec, its stated rung, its implementation binding, present or none, and the members it joins under each relation type.",
          "The open-questions section groups questions by member in authored order. Each question shows its blocking flag, its entry address when it carries a key, its text, and a link to its line in the carrier file when the location table records one.",
          "The code section lists, per member, each realizing and each referencing unit with its id, a link to its file and line, its role, and its component with that component's layer and context, under the binding-language headings the Design Review already uses. A member with no unit says so in one line.",
          "A line link is a relative link from the page to the carrier or source file with a `#L<line>` fragment, encoded as `spec:consumers.design-review#rule.linkTargets` states.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.recipe-parameters",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.recipe-parameters.sdp.md",
    title: "Recipes take parameters as data and ship as runnable files",
    narrative:
      "A body reads its parameters by name, so a name it does not read would be dropped without a word, and a recipe with a sample would answer for the sample: a misspelled name would look like a successful call. A recipe therefore answers a name it does not take with that name and the names it does take, and nothing else. A body cannot import and the reader holds no recipe metadata, so each body declares its own names in its first statement, and the recipe check holds that declaration to the catalog.",
    sections: {
      intent: {
        problem:
          "A recipe that takes its input in its own source makes a caller rewrite the body for each input, a long list included, and a script that runs a recipe must first cut its body out of the Markdown catalog.",
        outcome:
          "Pass a recipe's parameter as data through the one evaluation sink, and ship every catalog body as a file a caller runs as written.",
      },
      behavior: {
        rules: [
          "`sdp q` takes `--params` with a JSON object, or `--params @PATH` with a file holding one, the path resolved from the working directory, and injects it as a fourth binding, `params`, beside `g`, `graph` and `report`. Without the flag `params` is an empty object. In these two forms, a value that is not valid JSON, JSON that is not an object (null, an array, a string, a number or a boolean), or a file that cannot be read is refused before the body runs, with exit 1, one line on stderr and no output on stdout.",
          "`--params` is repeatable in three forms: a JSON object, `@PATH` naming a file that holds one, and `KEY=@PATH` binding the JSON value in the file, of any type, to `params.KEY`, with `KEY` on the lower-camel grammar. Objects merge at the top level from left to right, and a key given twice by any form is refused before the body runs, with exit 1, one line on stderr and no output on stdout, so a recipe takes a large file such as a base graph beside its other parameters.",
          "The bindings `g`, `graph` and `report` keep their names and meaning beside `params`. The sink evaluates one operator-supplied body and adds no query vocabulary: a parameter is input to a body, never a verb.",
          "Every recipe reads its parameters under the names the catalog states. A parameter with a documented sample falls back to it when absent, so each body runs as written; a required input with no sample, such as a base graph, a proposal or an imports file, returns diagnostics when absent. Recipe 4 reads its changed files from `params.files`.",
          "Each catalog body opens by declaring the parameter names it takes, in the order the catalog's index lists them, and checks `params` against that list before it reads anything else; a recipe that takes no parameter declares an empty list.",
          "A recipe given a parameter name it does not take returns `{ unknownParams, accepts }` as its whole answer, and `sdp q` exits 0; it never answers for its sample, for an empty input or for the names it does take in that case.",
          "The recipe check holds each body's declared names to the catalog's index and to the `params` names the body reads, and runs each body with a name it does not take.",
          "The package build writes each catalog body to `dist/recipes/<NN>-<slug>.js`, where `NN` is the two-digit recipe number and the slug is the recipe's heading in lower kebab case, and the package ships that directory. The catalog stays the one owner of the bodies; the files are derived, and the recipe test checks that each file equals its catalog body byte for byte.",
        ],
        ruleKeys: {
          declaredNames: "rules[4]",
          unknownNames: "rules[5]",
          namesChecked: "rules[6]",
        },
      },
      design: {
        acceptsPreamble:
          "`const accepts = [...]; const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name)); if (unknownParams.length > 0) return { unknownParams, accepts };` opens every catalog body as three statements on three lines, with the recipe's names in the brackets as double-quoted strings.",
        unknownAnswer:
          "`{ unknownParams, accepts }` is the whole answer for a name a recipe does not take, where `unknownParams` lists every such name in the order `params` holds them, and `accepts` repeats the recipe's declared names.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.design-recipes",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.design-recipes.sdp.md",
    title: "Design work reads its answers from catalog recipes",
    narrative: null,
    sections: {
      intent: {
        problem:
          "Iterating on a design asks questions no recipe answers in one body: where a Pack's design stands, what a change to a Spec asks to follow, which decisions shape what, and which component dependencies cross a context or a layer. The first adopter answers each with its own script.",
        outcome:
          "Answer each of those questions with a catalog recipe that runs as written, so design work reads them from the graph.",
      },
      behavior: {
        rules: [
          "The build backlog (recipe 1) gives each listed Spec its design columns, read from its Spec context.",
          "Pack design (recipe 29) takes a Pack id in `params.pack` and returns the Pack context's design assembly as data, with members in authored order and the Pack's boundary. It returns a summary by default, full rows with `detail: true`, or mixed full and summary rows when `detail` lists member ids, in the shapes the answer-shapes Spec states. It returns `found: false` for an id that is no Pack.",
          "Design-change impact (recipe 30) takes Spec ids in `params.specs` and returns every Spec that rests on them, transitively, through inbound `refines`, `dependsOn`, `constrainedBy` or `decidedBy` edges, each with the relation path that reaches it and its distance. For the changed Specs and every dependent it lists the units that satisfy it, the units that reference it, its enabled verifiers and its Packs. A `references` edge counts as a unit to notify and confers nothing.",
          "Decision register (recipe 31) takes no parameter and returns one row per decision Spec, sorted by id: its title, stated rung, the decisions it supersedes and the decisions that supersede it, the decision-kind Specs it refines as `refines` and those that refine it as `refinedBy`, the reasons its relations state, the Specs that name it through `decidedBy`, its keyed open questions, and its Packs. It reads the graph alone; the ratified names stay in the decision registry document. Whether a refinement narrows a decision is that decision's own text or its relation's reason, never the field name.",
          "Architecture crossings (recipe 32) takes no parameter and returns every `uses` edge whose two ends, each resolved to its own component directly or through `memberOf`, have components that both state a context and differ in it, or both state a layer and differ in it. Each row names both units, both components and what differs, and the totals tally the crossings by context pair and by layer pair, `from -> to`, so a corpus reads the direction of its dependencies at a glance. It reports and never refuses: a corpus gates its own architecture rule, as the architectural annotation decision leaves it. The totals also carry `sameLayer` and `sameContext` for resolved `uses` edges between distinct components that state the same layer or context, and `bySameLayer` per layer; edges within one component count in neither.",
          "Each recipe body lives in the catalog and runs as written in the recipe test, and each reads its parameter as the recipe-parameters Spec states.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.engine-provenance",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/engine-provenance.sdp.md",
    title: "The CLI names the engine that produced a result",
    narrative: null,
    sections: {
      intent: {
        problem:
          "An adopter pinned to a build of the Protocol needs to name that build: the package version alone does not change between commits, so when a check changes with no Spec changed, nothing tells the engine moving from the corpus moving.",
        outcome:
          "Let `sdp --version` name the package version and the commit the build came from, without putting either into the graph.",
      },
      behavior: {
        rules: [
          "`sdp --version` prints one line, `sdp <version> (<commit>)`, and exits 0. The version is the package's own version; the commit is the full hash the build was made from, or `unknown` when the build could not read one; a build from a checkout with uncommitted changes names the commit checked out when it ran.",
          "The build records the commit in a file beside the compiled CLI, and the CLI reads that file; it never runs git at run time.",
          "The build reads the commit from git first. When git gives no full commit, it reads the archive's substituted commit file; a full commit there names the archived revision, and an absent, unsubstituted or malformed file leaves the commit `unknown`.",
          "Neither the version nor the commit enters the graph, a projection or a generated contract, so a derived artifact stays a function of the corpus alone.",
        ],
      },
      design: {
        archiveCommit:
          "`.git-archive-commit` contains `$Format:%H$` in a checkout and is marked `export-subst` in `.gitattributes`, so git archives carry their full commit. The build reads the trimmed file only as a full Git object name, never as a command or an abbreviated hash.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.validate-watch",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/validate-watch.sdp.md",
    title: "Validation re-runs while an author edits carriers",
    narrative: null,
    sections: {
      intent: {
        problem: "An author editing a Spec re-runs `sdp validate` by hand after every save.",
        outcome:
          "Let `sdp validate --watch` re-run the one validation path on every carrier change and stay alive after findings, as a loop for authoring and never a second validation path.",
      },
      behavior: {
        rules: [
          "`sdp validate --watch [root]` installs its watcher first, then runs the same validate path `sdp validate` runs, from scratch, once at start and again after every carrier create, change, delete or rename under the root.",
          "A carrier ends in `.sdp.md`, `.sdp.gherkin` or `.sdp.ts`. The watcher ignores the directories discovery skips, the configured exclusion prefixes and every non-carrier path other than the rules files and parameter files `--rules` names, which it watches wherever they live, as `spec:validation.corpus-rules#rule.watchReruns` and `spec:validation.corpus-rules#rule.watchedParams` state; a removed watched directory and an event with no filename each schedule a run because their affected carriers cannot be named.",
          "Events that arrive while a run is in progress coalesce into one pending run.",
          "Findings print as `sdp validate` prints them and the process stays alive; operator SIGINT terminates the process with exit 0 even while a rules body is active, without waiting for it. No further rules file runs or output is written after the stop.",
          "For `sdp validate`, `--watch` cannot combine with `--check-clean`, and it re-runs on carrier edits and on edits to the files `--rules` names, and never on source edits, so an author re-runs validation after editing an anchor. This rule restricts no other verb's `--watch`, which its own Spec states.",
        ],
        ruleKeys: { operatorStop: "rules[3]" },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.example-space-coverage",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "Example spaces report which values their examples cover",
    narrative:
      "The original design rendered a coverage heatmap from each example space: which combinations of its typed slots an example witnesses and which none does (`docs/lineage/v0-design/04-authoring-surfaces.md` §4 and §4.1, `06-extraction-and-validation.md` §8). This Spec reports slot-value coverage; the glossary keeps witness for an example in an outcome class. Coverage is per slot value: no design pass has yet asked which combinations of slots no example exercises, and a combination grid grows with the product of the slots' sizes.",
    sections: {
      intent: {
        problem:
          "The graph carries example spaces and bound points, but no reader value or recipe reports which literal slot values example children bind.",
        outcome:
          "Report each literal slot value with the example children that bind it, and each value no child binds, before code exists.",
      },
      behavior: {
        rules: [
          "The engine decodes each Spec's example space into its typed slots, and each example child's steps into its bound point, once, through the notation module that writes the space contracts, and the reader carries both on the Spec context; no recipe or projection parses slot notation a second time.",
          "Slot-value coverage is a catalog recipe, recipe 44, over the decoded reader values, listing each literal-union value with the example children that bind it and each value no child binds.",
          "The recipe enumerates slots typed as closed unions of quoted literals. It reports every other slot type, a boolean included, as not enumerable by this recipe, never as covered or as missing a value.",
          "Coverage is reported per slot value; the recipe reports no combination of two or more slots until a design pass asks which combinations no example exercises.",
          "The examples counted are the space owner's example children that declare `refines` on it and carry a given, when and then entry, the same children its space contract collects.",
          "An example that binds no value for a slot is listed under that slot as unbound, never as covering a value of it.",
          "Slot-value coverage reports and confers nothing: it moves no readiness, records no verdict and emits no validation finding.",
        ],
        ruleKeys: {
          decodedOnce: "rules[0]",
          catalogRecipe: "rules[1]",
          literalUnions: "rules[2]",
          perSlotOnly: "rules[3]",
          eligibleChildren: "rules[4]",
          unboundSlot: "rules[5]",
          confersNothing: "rules[6]",
        },
        exampleSpace: {
          given: [
            "an example space that declares the slot {slot:string} as {declared:string}",
            "its example children bind {bound:string}",
          ],
          when: ["recipe 44 reports the space's coverage"],
          then: [
            "the slot is enumerable: {enumerable:boolean}",
            "the values no example binds are {uncovered:string}",
            "the examples that leave the slot unbound are {unbound:string}",
          ],
        },
      },
      design: {
        readerSpace:
          "the Spec context of a Spec that owns an example space carries `exampleSpace: { slots: ExampleSlot[]; points: BoundPoint[] }`, and a Spec that owns none carries no `exampleSpace`.",
        exampleSlot:
          '`{ name: string; type: "number" | "string" | "boolean" | "enum"; values?: string[]; step: string }`, one per slot the space\'s given and when steps declare, in the order the space contract\'s dimensions take, `values` the quoted literals in authored order when `type` is `enum`, and `step` the skeleton of the first step declaring the slot.',
        boundPoint:
          "`{ example: string; values: Record<string, string | number | boolean> }`, one per eligible child in id order, `values` holding the first value the child binds for each slot, the values the space contract holds for it.",
        coverageRecipe:
          "recipe 44, example-space coverage, takes `params.spec` or `params.pack`, at most one, and without either reads every Spec that owns an example space; it returns `{ scope, totals, spaces }`, and `{ diagnostics: [{ parameter, problem }] }` alone when the scope names no Spec or Pack, names both, or names a Spec that owns no example space.",
        coverageSpace:
          "`{ spec: string; examples: string[]; slots: CoverageSlot[] }`, one per space in Spec id order, `examples` the eligible children in id order.",
        coverageSlot:
          "`{ name: string; type: string; step: string; enumerable: boolean; values: { value: string | number | boolean; examples: string[] }[]; unbound: string[] }`: for an enumerable slot one value row per declared literal in authored order, a row with no example being an uncovered value; for any other slot one row per distinct value its examples bind, in the order they are first bound; `unbound` the examples that bind no value for the slot.",
        coverageTotals:
          "`{ spaces: number; slots: number; enumerable: number; values: number; uncovered: number }`, `values` counting the declared literals of the enumerable slots and `uncovered` those no example binds.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/agent-surface.example-space-coverage.sdp.md",
  },
  {
    id: "spec:consumers.review-perspectives",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/review-perspectives.sdp.md",
    title: "A Pack is read from a named perspective",
    narrative:
      "The original design gave every reader one reading surface, each reading from their own concern: the analyst, the domain engineer, the architect, the tester, the designer and the agent (`docs/lineage/v0-design/04-authoring-surfaces.md` §6). The first adopter iterates each capability's design through advisor lenses, its runtime platform, the domain, operations and the product, each a written list of the questions its field asks, run over the same Pack by the same pass brief (`libar-platform/design/advisors/lenses/`, `libar-platform/design/advisors/task-pass.md`). It asks for a lens to be a filter over the same capability that reorders and emphasizes questions, entries, examples and constraints and opens the same Specs, with no new Spec kind and no compulsory sequence of stages (`libar-platform/docs/feedback/sdp-feedback-02.md`, item 28). The Protocol takes the member filter and the order and leaves each member's content whole; emphasis inside a member stays the reader's.\n\nThe owner ruled the word: perspective. The Spec Studio keeps lens for its graph views, its Packs, architecture, tests and evidence views, and discipline stays the filter by kind or section. The adopter's advisor lens is a reader's concern, not a view of the graph, so in the Protocol's terms it is a perspective.",
    sections: {
      intent: {
        actor:
          "A reviewer or an agent who reads a Pack for one concern, such as the domain model, operations or the runtime platform.",
        problem:
          "Every reading of a Pack shows every member in the same order with the same emphasis, so a reader with one concern sorts it by hand, and an adopter keeps its perspectives as prose briefs the graph cannot apply.",
        outcome:
          "Let a reviewer read the same Pack from one perspective at a time, filtered and ordered for that perspective, without a new kind or a stage.",
      },
      behavior: {
        rules: [
          "A perspective filters and orders a Pack's members and leaves each selected member's content intact; every row opens the same Spec, and the whole Pack stays one step away.",
          "A perspective adds no kind, readiness, stage or sequence; reading a Pack from one perspective records nothing, and no perspective is required before another or before `ready` is stated.",
          "The corpus owns its perspectives and their questions; the Protocol supplies the filter and ships no list of perspectives.",
          "A perspective is corpus data: a JSON object the corpus keeps beside its briefs and passes to the perspective filter, a catalog recipe, through `--params`. The reader loads no perspective file, and no validator lists or checks perspectives, so no registry forms.",
          "A perspective selects members by Spec id or id prefix, kind, section presence, Design key with an optional value, question key, and authored relation type with a stated direction; it selects component layer or context only through the member's code unit bindings, satisfying or referencing, that the perspective names; it infers nothing from prose, paths or imports.",
          "A member selected by a Design key, including the `layer` and `context` keys a component design states, is selected on declared intent; a member selected through a binding's component is selected on anchored structure; each row names which, and the two are never merged into one architecture answer.",
          "Values within one selector are alternatives and different selectors combine as requirements; an unsupported selector is a diagnostic in the result, and a valid selector that matches nothing is an explicit empty result.",
          "Members keep the manifest's authored order unless the perspective gives an explicit priority order, authored order breaking ties; every selected member's blocking questions stay visible whatever else the perspective filters out.",
        ],
        ruleKeys: {
          contentIntact: "rules[0]",
        },
      },
      design: {
        perspectiveObject:
          '`{ "name": "models", "select": { "kinds": ["model"] } }` selects the members of kind `model`. A perspective is `{ name, select, order }` with `select` and `order` optional, and its selectors are `ids`, `idPrefixes`, `kinds`, `sections`, `designKeys`, `questionKeys`, `relations` and `bindings`, each optional; different selectors combine as requirements. An absent selector imposes no requirement, a present empty list matches no member, and an absent or empty `select` object selects every member. A `designKeys` item is `{ key, value }` with `value` optional; a `relations` item is `{ type, direction, target }` with `direction` `out` or `in` and `target` optional; `bindings` is `{ via, layers, contexts }`, where `via` is required and lists `satisfies` or `references`, and absent `layers` or `contexts` impose no restriction. `order` lists Spec ids by priority, authored order breaking ties.',
        perspectiveRecipe:
          "recipe 37, the perspective filter, takes `params.pack` and `params.perspective` and returns `{ pack, perspective, totals: { members, selected }, diagnostics, selected, notSelected }`.",
        perspectiveRows:
          "each `selected` row is `{ id, matchedOn: [{ selector, value, claim }], blockingQuestions: [{ address, question }] }` in the perspective's order and then authored order; `claim` is `declared` for a match on authored intent and `anchored` for a match through a binding; `notSelected` lists the remaining member ids in authored order.",
        perspectiveDiagnostics:
          "an unknown selector, a value of the wrong type or a `bindings` selector with no `via` is a diagnostic row `{ selector, problem }`, and the recipe still applies the selectors it understood.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.context-bundle",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/context-bundle.sdp.md",
    title: "A context bundle is composed per invocation within a stated budget",
    narrative:
      "The original design precomputed graph slices for different reading scopes and a prompt bundle for one Spec. The Protocol keeps context bundle for the reading material of one design pass, composed on demand.\n\nThe first adopter's design passes assemble the same reading material by hand: the Pack design, member questions, dependency footing, pinned declarations and carrying Spec text where the graph answer falls short. Its perspectives read the same Pack for different concerns. The agent front door composes a bundle on each invocation; the bundle is never a committed answer in the graph's name. It builds on Pack design.\n\nAt an adopter's scale a bundle is mostly structure, so its shape is compact. Each member and each example row names its carrier file once. A cut entry without an entry address keeps only its line, since its row and its place in the bundle already name it. A question, a pinned value or a member example's steps appears in one place. Pinned declarations stay whole by default, because a builder and a test author hold to them. A caller whose scope still does not fit may let the bundle cut them to their entry addresses, and then reads each one in its Spec when the pass needs it. A partial bundle stays refused, because a bundle missing members would read as the whole scope.\n\nA scope can hold more design than one budget allows after every cut, as the first adopter's largest Packs do. A caller then reads the bundle in parts: the same bundle, split between members into ordered parts that each fit the budget, whose members together are the whole scope. In parts a cut is taken only when an item, a member or the boundary, does not fit a part by itself, so a part keeps the design a single bundle would have cut. A repeated header that exceeds the budget alone is named as one oversized item; otherwise each item that exceeds the budget alone is named. No part is returned in either case.",
    sections: {
      intent: {
        actor: "An agent starting one design pass over a Pack or an ordered list of Specs.",
        problem:
          "Each pass assembles the same reading material by running the same recipes and joining their answers by hand, and nothing bounds what it hands the model.",
        outcome:
          "Give an agent the reading material for one design pass in one composed slice of the graph within a stated budget, so no session hand-assembles it.",
      },
      behavior: {
        rules: [
          "A bundle is a catalog recipe that takes its scope and its budget as recipe parameters; it adds no entrance and no query verb.",
          "A bundle is composed from the graph on each invocation by the reader every recipe uses; nothing is precomputed, saved or committed, and two invocations over the same graph with the same parameters compose the same bundle.",
          "A bundle takes one scope: `pack`, a Pack id, or `specs`, an ordered list of Spec ids. For `specs` the members are the listed Specs in the given order and the boundary is each member's one-hop neighbors through the four typed relations both ways, with `verifies` and `supersedes` apart, as the Pack boundary is built. Both scopes or neither is a diagnostic result. A changeset fills `specs` from the impacted Spec ids changed-file impact reports, and a Pack's open questions are read from the Pack bundle, not from a third scope.",
          "With `pack`, a bundle may take `members`, an ordered subset of the Pack's member ids, which the perspective filter returns; it keeps the Pack's framing and boundary, lists only those members in that order, and states that it is a subset, so one filter implementation serves both recipes.",
          "A bundle for a Pack carries the Pack design assembly, its members in authored order with their design columns and its boundary, then each member's open questions with their addresses and lines, its dependency footing, its pinned declarations and its examples.",
          "The budget is a hard limit on a successful bundle, counted in UTF-16 code units, the `length` a recipe body reads, of the compact `JSON.stringify` of the value the recipe returns, its scope, budget and left-out statement included; `sdp q --json` prints a longer indented form, and the budget never measures printed text. The bundle also reports a token estimate labeled as an estimate, so no model's tokenizer binds the Protocol.",
          "A bundle carries a member's open questions only in its `questions`, a pinned declaration's value only in its member's Design section, and an example's steps only in its own member row when the example is a member of the bundle; an example outside the bundle keeps its steps in the row of each member it refines or verifies.",
          "When the scope exceeds the budget, the bundle cuts in a fixed order and stops at the first cut after which it fits: boundary rows down to their ids, footing rows down to their ids, member narrative, example step text, non-blocking question text, remaining section values other than pinned declarations, then, only when the caller allows it, pinned declarations down to their entry addresses. It never cuts member ids, the stated rung, the floor reached, the stated next rung, blocking questions or entry addresses, and it cuts nothing else.",
          'A caller allows the last cut by passing `declarations: "addresses"`; without it, or with `declarations: "whole"`, pinned declarations stay whole, and any other value is a diagnostic result.',
          "Without `part`, when the protected content alone exceeds the budget after every permitted cut, the recipe returns a budget-exceeded result as data and no partial bundle: the requested scope, the budget, and the minimum count the protected content needs in the same unit; `sdp q` exits 0, because the result is the body's return and not a refusal.",
          "A bundle gives the file and line of an entry or a binding in place of a source excerpt, because the reader never reads source.",
          "A bundle states its scope, its budget and what it left out to stay within the budget, so a reader knows what to read in the Specs themselves.",
          "A bundle carries facts from the graph and no instructions of its own; the brief that tells an agent what to look for stays the corpus's own text.",
          "With `part`, the 1-based index of the part to return, a bundle comes in ordered parts, each within the budget, and the members of its parts, read in part order, are the bundle's members in order, each once.",
          "A part boundary falls between items and never inside one: the boundary is the first item and each member is one item, in the scope's order, and each part holds the longest run of items after the part before it that fits the budget.",
          "In parts the bundle tries the cut order one cut at a time, starting from no cut, splits the scope at each stage and takes the first stage at which every part fits the budget, each part measured whole in the shape it returns: its repeated fields, its `leftOut`, the boundary in part 1 and the final `part.of`; every part takes that stage's cuts and lists them in `leftOut`.",
          "Every part repeats the scope, the budget, the declaration mode, the cuts taken, its own place among the parts and, for a Pack scope, the Pack's id, title and framing, so each part reads on its own; only the first part carries the boundary.",
          "The split depends on the graph and on every parameter but `part`, so a caller that asks for each part in turn over one graph reads one bundle.",
          'When the repeated part header alone exceeds the budget after every permitted cut, the recipe names `"header"` as its one oversized item and returns no part. Otherwise, when an item alone exceeds the budget after every permitted cut, the recipe names each such item with its length and returns no part. In both cases `sdp q` exits 0.',
        ],
        exampleSpace: {
          given: [
            'a probe Pack of three members whose bundle exceeds the budget {budget:number} {sizes:"while each member fits a part alone"|"and one member carries a blocking question longer than the budget"}',
          ],
          when: ["each part of its context bundle is requested in turn"],
          then: [
            "the bundle comes in {parts:number} parts, each within the budget",
            "the members of the parts, in part order, are the Pack's members in authored order, each once: {complete:boolean}",
            "the answer names the oversized items {oversizedItems:string}",
          ],
        },
        ruleKeys: {
          oneCopy: "rules[6]",
          cutOrder: "rules[7]",
          declarationAddresses: "rules[8]",
          parts: "rules[13]",
          partBoundaries: "rules[14]",
          partCuts: "rules[15]",
          partHeader: "rules[16]",
          sameParts: "rules[17]",
          oversizedItem: "rules[18]",
        },
      },
      design: {
        bundleRecipe:
          'recipe 36, the context bundle, takes exactly one scope, `params.pack` or `params.specs`, an optional `params.members` beside `pack`, `params.budget`, 100,000 code units by default, `params.declarations`, `"whole"` by default or `"addresses"`, and an optional `params.part`; a missing, doubled or unknown scope, another `declarations` value, or a `part` that is not a positive integer returns `{ diagnostics }` and no bundle.',
        bundleShape:
          "`{ scope, budget, declarations, used, tokenEstimate: { value, method }, leftOut, pack, members, boundary }`, where `declarations` is the mode in force, `pack` is `{ id, title, framing }` for a Pack scope and null otherwise, and `tokenEstimate.method` reads `UTF-16 code units divided by four, an estimate`.",
        memberShape:
          "`{ id, file, title, specKind, altitude, statedReadiness, floorReached, statedNextRung, holds, narrative, sections, questions, footing, declarations, examples, design, decisions, implementedBy, referencedBy, verifiers }`, with `file` the member's carrier path; `sections` as the graph holds them, without `intent.openQuestions`; `questions` one row per open question in authored order, `{ index, question, blocking, key, address, line }` with its fields, `key` absent and `address` null when it has none; `footing` as dependency footing (recipe 21) reports it; `declarations` the keys of the member's pinned declarations in Design order; `design` the counts of entries, declarations, open questions and blocking questions; `decisions` the decisions its design columns name; `implementedBy` and `referencedBy` as `{ id, claim, file, line, role, component }`; and `verifiers` as `{ id, claim, enabled, file, line }`. `holds` lists the member's stated-next-rung failures as the reader returns them, each with its `clauseId` and `description`, and with `targets` on a typed-dependency failure.",
        exampleRow:
          "`{ id, member, file, statedReadiness, enabled, steps }` lists one example that refines or verifies the member, in id order, with `member` true and `steps` null when the example is itself a member of the bundle, its steps then sitting in its own member row.",
        pointer:
          "`{ line }` replaces a cut entry that has no entry address, `line` being the line the location table records for it, or null when it records none; the entry's Spec and file are those of the row that holds it, and its place in the bundle names its path. A cut entry whose text names other entry addresses becomes a list of them, led by its own address when it has one and otherwise ended by its pointer.",
        boundaryRows:
          "a Pack scope's boundary is the Pack design's; a Spec-list scope's boundary is every Spec outside the list one authored relation away from a listed Spec, in the same row shape.",
        footingCut:
          "`{ refines, dependsOn, constrainedBy, decidedBy }` replaces a member's footing at the footing cut, each a list of target ids in code-unit order, with a type that has no target left out.",
        narrativeCut:
          "The narrative cut replaces a member's narrative with the entry addresses written in it, in order of first appearance and joined by single spaces, or with null when it holds none.",
        exampleCut:
          "The example cut replaces each entry of a member's `behavior.examples`, and its `behavior.exampleSpace`, with its pointer, and each example row's `steps` that are not null with the pointer of that example's `behavior.examples`.",
        questionCut:
          "The question cut replaces each non-blocking question in `questions` with its address, or with its pointer when it has no key, and with `{ pointer, links }` when it has links, `pointer` being that address or pointer; blocking questions stay whole.",
        sectionCut:
          "The section cut replaces each section entry other than a pinned declaration with its entry address when it has one, and otherwise with its pointer.",
        declarationCut:
          "The declaration cut, taken only under `declarations: \"addresses\"`, replaces each pinned declaration in its member's Design section with its entry address, or with its pointer when its key has none; the member's `declarations` keeps the keys.",
        leftOutLines:
          "One fixed line per cut taken, in cut order, makes up `leftOut`: `Boundary details; ids kept per direction.`, `Footing details; ids kept per relation type.`, `Member narrative.`, `Example step text, including member sections and example-space vocabulary.`, `Non-blocking question text; addresses and links kept.`, `Section entry values other than pinned declarations; addresses and lines kept.` and `Pinned declaration text; entry addresses kept.`",
        budgetExceeded:
          "`{ scope, budget, declarations, budgetExceeded: true, protectedLength, leftOut }` is the whole result when the protected content alone exceeds the budget after every permitted cut, with `protectedLength` in the budget's unit.",
        partShape:
          "a part is the bundle shape with `part: { index, of }` after `declarations`, where `of` is the number of parts; its `members` hold its run of members, its `boundary` holds the scope's boundary in part 1 and is null in every later part, and its `used` and `tokenEstimate` measure the part.",
        partDiagnostic:
          'a `part` above the number of parts returns `{ diagnostics: [{ scope: "part", problem: "The bundle has <of> parts." }] }`, in the `{ scope, problem }` row the recipe\'s other diagnostics use.',
        partsExceeded:
          '`{ scope, budget, declarations, part: { index, of: null }, budgetExceeded: true, oversized: [{ item, length }], leftOut }` is the whole result when an item exceeds the budget alone after every permitted cut, where `item` is `"header"` alone when the repeated header exceeds the budget, and otherwise a member id or `"boundary"`, in scope order. For `"header"`, `length` counts the code units of a part with `part: { index: 1, of: 1 }`, no members and a null boundary after every permitted cut; otherwise it counts a part that holds that item alone.',
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.context-bundle.parts-cover-the-pack",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/context-bundle.parts-cover-the-pack.sdp.md",
    title: "A Pack too large for one bundle reads whole in parts",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the parts rules on a probe Pack whose members together exceed the budget while each fits a part alone.",
        assumptions: [
          "The world writes a probe Pack of three story-altitude behavior Specs stating `idea`, each with an Intent outcome and a narrative of 6,000 letters, none related to a Spec outside the Pack. It runs the shipped context bundle file through `sdp q --json` with the Pack, the budget and `part: 1`, reads `part.of`, then asks for every other part in turn. It checks that each part's `used` is at most the budget, that no part's `leftOut` names a cut, that every part repeats the scope and the Pack, and that only part 1 carries a boundary.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe Pack of three members whose bundle exceeds the budget {budget: 10000} {sizes: "while each member fits a part alone"}',
            ],
            when: ["each part of its context bundle is requested in turn"],
            then: [
              "the bundle comes in {parts: 3} parts, each within the budget",
              "the members of the parts, in part order, are the Pack's members in authored order, each once: {complete: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.context-bundle.oversized-member-named",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/context-bundle.oversized-member-named.sdp.md",
    title: "A member larger than the budget is named, and no part is returned",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the oversized-item rule on a probe Pack whose second member carries a blocking question longer than the budget, which no cut reduces.",
        assumptions: [
          "The world writes the probe Pack of the parts example, with short narratives, and gives its second member a blocking open question of 12,000 letters. It runs the shipped context bundle file through `sdp q --json` with the Pack, the budget and `part: 1`, and reads the budget-exceeded result's `oversized` items, joined by a comma and a space.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe Pack of three members whose bundle exceeds the budget {budget: 10000} {sizes: "and one member carries a blocking question longer than the budget"}',
            ],
            when: ["each part of its context bundle is requested in turn"],
            then: ['the answer names the oversized items {oversizedItems: "spec:probe.two"}'],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.design-diff",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/design-diff.sdp.md",
    title: "Designs are compared between a base commit and the working tree at entry grain",
    narrative:
      "The original design compared graph snapshots. Comparison concerns the curated graph a design lives in and needs no symbol identity.\n\nIterating on a design asks what changed since the last reading. The first adopter asks for a comparison by Spec id, section and entry key that tells changed declaration text from changed prose, moved entries, readiness edits, relation edits and new or removed examples, and for what changed since a design pass, read against the commit that pass read (`libar-platform/docs/feedback/sdp-feedback-02.md`, items 30 and 31). Git shows the changed lines; this comparison shows the changed design.",
    sections: {
      intent: {
        actor:
          "A reviewer or an agent starting the next design pass over a Pack, holding the commit the last pass read.",
        problem:
          "A line diff of the carriers shows edits but not which Specs, entries, questions and relations changed, so each pass re-reads the whole Pack to find what moved.",
        outcome:
          "Show what changed in a design between a base commit and the working tree, down to the Spec, section and keyed entry, so a reviewer reads what changed since the last pass.",
      },
      behavior: {
        rules: [
          "The design diff compares a base graph with the current graph.",
          "A comparison is a catalog recipe that takes the graph `sdp build` wrote at the base commit as a recipe parameter and compares it with the graph the evaluation derives from the working tree, including uncommitted edits; it adds no verb or binding.",
          "The base graph is input the caller holds, derived from the repository alone at the base commit; it never answers in the graph's name, and the comparison writes nothing.",
          "The caller always names the base. The recipe reads no record of a design pass and keeps none, and a corpus that notes which commit a pass read keeps that note outside the graph.",
          "Two graphs written by different engine versions are compared on what both carry; the result reports each side's schema version, and a difference is a diagnostic in the result, never a refusal.",
          "It reports the Specs added and removed, and for a Spec present in both graphs the changes to its title, kind, altitude, stated readiness, relations, narrative and each section.",
          "Inside the Design and UI sections, the open questions and any other section whose entries carry keys, it compares keyed entries by key and reports each as added, removed, changed in value or moved in order.",
          "An unkeyed entry has no identity across the two graphs, neither its position nor its text, so it is compared as part of its whole section.",
          "A keyed rule or flow compares with its owning list as part of its value, so a rule becoming a flow is changed; when one graph keeps no order across rules and flows, keyed entries compare by order within each list and a `ruleOrder` diagnostic names the Spec.",
          "It reports changes to Pack membership and order, and to the code units, verifiers and delivery facts bound to each Spec, kept apart from the authored changes because they derive from anchors.",
          "A comparison states facts about the two graphs and confers nothing. It grants no approval, raises no staleness flag, moves no readiness and never records that a pass happened.",
        ],
      },
      design: {
        diffRecipe:
          "recipe 35, the design diff, takes `params.base`, the graph object `sdp build` wrote at the base commit, an optional `params.pack` that limits the comparison to the Specs that are members of that Pack at either commit, and `params.detail`; it compares `params.base` with the `graph` binding and reads nothing else.",
        diffShape:
          "`{ base: { schemaVersion, specs }, head: { schemaVersion, specs }, diagnostics, totals, specs: { added: [id], removed: [id], changed }, packs, bindings, leftOut }`, where `totals` counts each list and `diagnostics` lists schema-version differences, parts outside the common schema, a Pack absent from both graphs, and Specs compared without order across rules and flows; `base.specs` and `head.specs` count the Specs of the comparison scope present on each side, the scope being every Spec or, with `pack`, the Pack's members in either graph, while the top-level `specs` object carries the change lists.",
        changedSpecRow:
          "`{ id, parts: [part] }` in the summary and `{ id, parts: [{ part, change, from, to }] }` with `detail: true`; `change` is `added`, `removed`, `changed` or `moved`, and `from` and `to` carry the values on each side.",
        diffParts:
          "a part is `title`, `specKind`, `altitude`, `statedReadiness`, `narrative`, `relation.<type>:<target>`, a keyed entry as `design.<key>`, `ui.<key>`, `question.<key>`, `rule.<key>` or `term.<term>`, an unkeyed list as `behavior.rules`, `behavior.flows` or `intent.openQuestions`, and any other section as its name.",
        movedEntry:
          "a keyed entry whose value is unchanged and whose position among the keyed entries of its section changed is `moved`; an entry whose value changed is `changed` whatever its position.",
        packRows:
          "`packs` rows are `{ id, change, membersAdded, membersRemoved, reordered }` for each Pack added, removed or changed in membership or order.",
        bindingRows:
          "`bindings` rows are `{ id, implementedBy, referencedBy, verifiers, deliveryFacts }`, each an `{ added, removed }` pair of ids or fact names, kept apart from `specs` because they derive from anchors.",
        baseRecipe:
          "The catalog shows how to derive the base graph in a worktree at the base commit with the corpus's exclusions. When constant-form anchors use relative engine imports, as in this repository, run the base worktree's own engine, then pass its `generated/graph.json` as `base` and remove the worktree.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.intent-composition.proposal",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/intent-composition.proposal.sdp.md",
    title: "A change proposal is addressed, based and checked before it lands",
    narrative:
      "The original design's patch loop made every change from a view reviewable and checked before it touched source. A patch named its target, the graph hash it was made against, a rationale, its operations and who proposed it; a CLI checked its schema and its base, applied it to a copy of the graph, ran the validators and only then rewrote the Spec files (`docs/lineage/v0-design/02-system-architecture.md` §2; `07-spec-studio-and-projections.md` §6). The Protocol refused the patch and the codemod. A view composes scoped intent, an agent edits source as a person would, git records the edit and the same checks evaluate it. That edit model drops two things the patch loop gave: a proposed change a person can review before an agent applies it, and a guard against a proposal made against an older design.\n\nThe first adopter's agents already write proposals in that shape. A design pass returns findings that each name an entry address or a Spec section, state the gap, and propose exact text for a Spec with the entry it replaces or follows (`libar-platform/design/advisors/task-pass.md`), and its register tool applies a JSON patch only after checking all of it (`libar-platform/design/advisors/register.md`). This Spec states the reviewable half of the patch loop without the codemod. A proposal is a request that an agent applies as an ordinary edit, checked by `sdp validate` on a worktree before it merges. It also gives the Spec Studio's composing panel a shape to hand off.",
    sections: {
      intent: {
        problem:
          "A proposed design change travels as free prose, so a reviewer cannot tell what it touches, which version of the design it read, or whether it still applies once the design has moved.",
        outcome:
          "Give a proposed design change a reviewable shape: what it touches by Spec id or entry address, the commit it was read at, the change requested and why, checked on a worktree before merge.",
      },
      behavior: {
        rules: [
          "A proposal is one JSON document on one schema, which a recipe takes as a parameter; a Markdown memo is a rendering of that document and never a second source of it.",
          "A proposal names its scope as one or more Spec ids or entry addresses, each resolved before anything is applied: a Spec id through the reader's Spec context, an entry address through address resolution.",
          "A proposal names the commit whose graph it was read against.",
          "A proposal states the requested change in words an agent can apply, such as the exact text for an entry with the address it replaces or follows, a new open question with its flag, or a relation to declare or remove.",
          "A proposal states its reason in one line.",
          "The proposal check compares each change's scope between the proposal's base commit and the working tree through the design diff, entry by entry, and reports each change on its own row, so one changed scope never hides the state of another change; the check applies nothing and routes nothing.",
          "Applying a proposal is an ordinary source edit by an agent or a person; no tool rewrites a carrier from it, and nothing is applied to a copy of the graph first.",
          "A proposal carries no status, approval or verdict, and the graph records none; whether it was accepted is git history and the adopter's own record.",
          "A proposal carries no proposer. Whoever hands it over is its author until it is applied, and then git authorship and co-author trailers are the record; the schema refuses the field.",
        ],
      },
      design: {
        proposalDocument:
          '`{ "schema": "sdp-proposal/1", "base": "<commit>", "reason": "<one line>", "changes": [change] }`, with `schema`, `base`, `reason` and a non-empty `changes` required and no other field.',
        proposalChange:
          '`{ "scope": ["<spec id or entry address>"], "request": "<words an agent can apply>", "text": "<exact entry text>", "replaces": "<entry address>", "follows": "<entry address>", "relation": { "action": "declare", "from": "<spec id>", "type": "dependsOn", "target": "<spec id>" }, "reason": "<one line>" }`, with `scope` non-empty and `request` required, `replaces` and `follows` exclusive, `action` either `declare` or `remove`, `from` naming the relation\'s source Spec, and no other field.',
        proposalSchemaFile:
          "the package ships the document's JSON Schema as `schemas/sdp-proposal-1.schema.json`, so an agent can use it as a structured-output schema; the check recipe validates the same shape itself, and a test holds the two to the same accepted and refused samples.",
        checkRecipe:
          "recipe 38, the proposal check, takes `params.proposal` and `params.base`, the base graph, and returns `{ schemaProblems: [{ path, problem }], base, diagnostics, totals: { changes, moved, unresolved }, changes }`, with the design diff's `diagnostics` for the Specs it compares; when the document breaks the schema or the base graph is missing it returns the problems and no change rows.",
        checkedScope:
          "the check resolves and compares the deduplicated union of `scope`, `replaces`, `follows` and `relation.from`, and a change row's `scope` reports that union, so an entry a change replaces or follows cannot move unseen.",
        checkRows:
          "each change row is `{ index, scope: [{ ref, resolvesAtHead, resolvesAtBase, moved }], moved, relationTarget }`; an item's `moved` is true when its Spec is added or removed between the two graphs, and otherwise, for an entry address, when the entry's value is added, removed or changed, an order-only move leaving it false, or, for a whole Spec, when any of its parts changed or moved in order; the row's `moved` is true when any item's is; `relationTarget` is `{ ref, resolvesAtHead }` for a declared relation and null otherwise.",
        incomparableScope:
          "an item outside the common schema, or an otherwise unmoved whole-Spec item whose order across rules and flows one graph does not keep, carries `comparable: false` and a `reason` in place of `moved`; its row carries `comparable: false` and a null `moved` unless another item moved.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.intent-composition.proposal.memo",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    title: "Recipe 49 renders a change proposal as the Markdown memo a person reviews",
    narrative:
      "A person reviews a proposed change as text, not as JSON beside the proposal check's rows. The memo is a rendering of the proposal document and never a second source of it: it ends with the document itself, so one paste hands an agent everything the person reviewed. Recipe 49 renders it, and the Studio's composing panel writes the same bytes, so a person, a reviewer and an agent read one text.",
    sections: {
      intent: {
        outcome:
          "Render a change proposal as one Markdown memo, the same bytes from the recipe and from the Studio's composing panel, that a person reviews and hands to an agent whole.",
      },
      behavior: {
        rules: [
          "Recipe 49 renders a proposal as the Markdown memo a person reviews and hands off, ending with the document itself, and the Studio's composing panel, `spec:consumers.spec-studio.intent-panel`, writes the same bytes for the same document, so a person, a reviewer and an agent read one text.",
        ],
        ruleKeys: {
          memo: "rules[0]",
        },
        exampleSpace: {
          given: [
            "a change proposal with {changes:number} changes, one whose exact text holds a run of {ticks:number} backticks",
          ],
          when: ["recipe 49 renders its memo and the composing panel renders its memo"],
          then: [
            "the two memos are byte-identical: {identical:boolean}",
            "the memo ends with the proposal as JSON in a fenced block: {carriesDocument:boolean}",
            "the fence around that exact text is {fence:number} backticks long",
          ],
        },
      },
      design: {
        memoRecipe:
          "recipe 49, the proposal memo, takes `params.proposal` and returns `{ schemaProblems: [{ path, problem }], memo }`: the schema problems recipe 38 reports for the same document and, when there are none, the memo as one string, otherwise `memo: null`; it reads no graph value, so one document renders one memo in any corpus.",
        memoHead:
          "the memo opens with the line `# Change proposal`, a blank line, the line `Base: ` followed by the base as a code span, the line `Reason: ` followed by the reason, and a blank line.",
        memoChange:
          "each change follows in document order as the line `## Change <n>`, counting from 1, and a blank line, then each on its own line: `Scope: ` followed by the scope items as code spans joined by `, `; `Request: ` followed by the request; when present, `Replaces: ` or `Follows: ` followed by the address as a code span; `Relation: ` followed by the action, the source as a code span, the relation type and the target as a code span, separated by single spaces; and `Reason: ` followed by the change's reason; then, when the change carries exact text, a blank line and the text in a fenced block with no info string; then a blank line.",
        memoDocument:
          "the memo ends with the line `## The proposal`, a blank line, and the document in a fenced block whose info string is `json`, written as `JSON.stringify` writes it with two-space indentation and the keys in the order the document holds them.",
        memoMarkup:
          "a code span uses a backtick run one longer than the longest run its content holds, padded with a space on each side when the content starts or ends with a backtick; a fence is a backtick run one longer than the longest run its content holds and at least three long; every value is written verbatim; every line ends with a line feed and the memo with one.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/intent-composition.proposal.memo.sdp.md",
  },
  {
    id: "spec:consumers.intent-composition.proposal.memo.shared",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "Recipe 49 and the composing panel write one memo for one proposal",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the shared memo: the recipe and the panel render the same bytes, the memo carries the document, and a fence outgrows the backticks it holds.",
        assumptions: [
          "The world writes a proposal document with a base, a reason and the stated number of changes, the first scoped to one entry address with exact text that holds the stated run of backticks, and the second declaring a relation; it runs recipe 49's shipped body with the document as `proposal`, calls the composing panel's memo function on the same document, compares the two strings, parses the last fenced block's content as JSON and compares it with the document, and measures the fence around the first change's text.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a change proposal with {changes: 2} changes, one whose exact text holds a run of {ticks: 3} backticks",
            ],
            when: ["recipe 49 renders its memo and the composing panel renders its memo"],
            then: [
              "the two memos are byte-identical: {identical: true}",
              "the memo ends with the proposal as JSON in a fenced block: {carriesDocument: true}",
              "the fence around that exact text is {fence: 4} backticks long",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/intent-composition.proposal.memo.shared.sdp.md",
  },
  {
    id: "spec:consumers.reference-projection",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/consumers/reference-projection.sdp.md",
    title: "A reference projection serves a reader outside the repository",
    narrative:
      "An interface and API reference is a deferred projection of the graph. The original design generated OpenAPI and AsyncAPI documents from route and schema nodes linked to their Specs. This capture keeps the reader and source questions open until a reader needs a reference the shipped projections do not provide.",
    sections: {
      intent: {
        outcome:
          "Publish a current interface and API reference from the graph for a reader outside the repository, once such a reader is named.",
        openQuestions: [
          {
            question:
              "Does a human reader outside the repository need a reference projection the four shipped roots do not serve? The taxonomy row is not that reader.",
            blocking: true,
            key: "namedOutsideReader",
            decider: "owner",
            trigger:
              "a named consumer outside the repository, with a way to measure that demand inside the arc that builds the projection",
          },
          {
            question:
              "Would the reference read pinned declarations, contract-kind Specs or `api:` code anchors, and does any of them hold enough to document an interface?",
            blocking: false,
            key: "referenceSource",
          },
        ],
      },
      behavior: {},
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.structural-mermaid",
    specKind: "behavior",
    altitude: "feature",
    readiness: "scoped",
    file: "specs/consumers/structural-mermaid.sdp.md",
    title: "Mermaid diagrams can be rooted at code units",
    narrative:
      "The shipped Mermaid projection draws bounded diagrams rooted at a Spec or a Pack. A Spec-rooted diagram within the bounds includes directly bound code units and test anchors; component membership and uses are read through the census and structural recipes. A view rooted at code units, grouping components by their context and layer, is now the Studio's architecture lens. Adding such a view to the shipped Mermaid root would still need a decision that narrows or replaces the projection freeze.",
    sections: {
      intent: {
        outcome:
          "Draw component, membership and uses diagrams rooted at code units, once a reader needs them and the existing views do not serve it.",
        openQuestions: [
          {
            question:
              "Does a reader need diagrams rooted at code units, which census tables and Spec-rooted one-hop Mermaid do not serve?",
            blocking: true,
            key: "namedStructuralReader",
            decider: "owner",
            trigger:
              "a named reader with that need, plus a decision that refines `spec:decisions.shipped-projections-frozen` for the affected Mermaid rendering or supersedes that ruling whole",
          },
        ],
      },
      behavior: {
        rules: [
          "A component diagram rooted at code units groups its components by context and orders them by layer, and the Studio's architecture lens, `spec:consumers.spec-studio.lenses.architecture`, draws it; the shipped Mermaid root draws none.",
        ],
        ruleKeys: {
          architectureLens: "rules[0]",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.projections-model.roadmap-views",
    specKind: "model",
    altitude: "story",
    readiness: "idea",
    file: "specs/consumers/projections-model.roadmap-views.sdp.md",
    title: "Roadmap views read releases, baselines and phases from git and the graph",
    narrative:
      "Release, baseline and roadmap vocabulary belongs to optional projections that wait until a reader needs them.",
    sections: {
      intent: {
        outcome:
          "Name the release, baseline and roadmap views a delivery reader may want, as optional projections that never gate or sequence work.",
        openQuestions: [
          {
            question:
              "Does a reader need release, baseline or roadmap views that the shipped projections, the recipes and git do not serve?",
            blocking: true,
            key: "namedRoadmapReader",
            decider: "owner",
            trigger:
              "a named reader with that need, and a way to measure it inside the arc that builds the views",
          },
        ],
      },
      model: {
        terms: {
          release: "A tagged set surfaced as a git-tag projection.",
          baseline:
            "A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.",
          "phase / iteration / milestone":
            "Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/obsidian-vault.sdp.md",
    title: "An Obsidian vault lets a person iterate on designs from the one graph",
    narrative:
      "The Design Review links a Spec's relations both ways and gives keyed Pack questions a separate carrier-line link, but it offers no built-in filtering of a Pack or navigation from arbitrary prose mentions to their entries. The Spec Studio serves a person who iterates on a design in the repository and a pull request reviewer who holds only a link. A linked-notes view lets a person follow relations, filter members by rung and design columns, open entries by address and see each pass's edits arrive. It is a projection of its own, not the Studio's local half: the Studio's page set serves a reader who holds a link, the vault serves a person who iterates in a notes app, and each has its own verb; the verb that writes every projection root writes the vault too.\n\nObsidian already does that for linked Markdown notes with properties: backlinks, a graph view, search, and filterable tables it calls Bases. The first prototype, in `explorations/obsidian-vault/`, wrote notes from dumped graph and reader values, with relations and checked mentions as wikilinks, entry addresses as block links, and Bases for Pack members and standing queries. The second, in `explorations/obsidian-vault-prototype/`, writes the vault this Pack designs from the built engine and checks it on the Protocol's corpus and the first adopter's: links that resolve, Bases whose views select what their recipes select, two identical renders, and a person's notes that survive.\n\nThe principle is a linked-notes view regenerated from the one graph; Obsidian and its Bases are the representation chosen first. Like every projection, the vault states no truth, and two runs over one graph write the same bytes, so no note names a commit or a time. Intent is still written only in the carriers. One thing sets the vault apart from the other projections: a person keeps it open and writes notes of their own in it. So the command owns one folder of the vault and a list of what it wrote there, and synchronizes that folder instead of rewriting a root wholesale; the vault's owned-folder decision, `spec:decisions.vault-owned-folder`, says why. For the same reason the vault never lies where the shared build removes files, and a run refuses rather than guess whose a file is.\n\nThe default vault sits under `generated/`, which discovery skips and an adopter usually keeps out of git. A person who wants to keep the intent notes they write in the vault points `--out` at a directory of their own.",
    sections: {
      intent: {
        actor:
          "A person in the repository who designs a capability in passes while an agent edits the carriers.",
        problem:
          "The Markdown Design Review offers no built-in Pack filters or navigation from arbitrary prose mentions to their entries, so a person iterating on a design still reads carrier files alongside it.",
        outcome:
          "Generate an Obsidian vault from the one graph, in which a person reads, navigates and filters the corpus and follows each pass's edits, while the carriers stay the only place intent is written.",
        risks: [
          "A notes app invites editing, and an edit to a generated note never reaches the carrier.",
        ],
      },
      behavior: {
        rules: [
          "The vault is a projection of its own, written only through its synchronization, which `sdp vault` and the verb that writes every projection root run, and no part of the Studio's page set.",
          "`sdp vault [root | --root PATH] [--exclude PATH]... [--out DIR] [--watch]` validates the graph as `sdp validate` does and then synchronizes the vault at `DIR`, by default `generated/obsidian-vault/` under the root; the root is given as an argument or by `--root`, never both, and defaults to the working directory, each exclusion is a root-relative path prefix as for the publishers, and `--out` resolves against the working directory; a root given both ways, `--root` or `--out` given twice or without a value, and any other option refuse the run.",
          "A vault directory inside the root must lie under a directory discovery skips or under an excluded prefix, so no file in the vault is ever read as a carrier or a source; any other vault directory inside the root refuses the run before the build, writing and removing nothing.",
          "A vault directory that is, lies inside or holds a path the shared build writes or removes, as `spec:consumers.obsidian-vault#design.buildOwnedPaths` lists, refuses the run before the build, writing and removing nothing, so no build ever removes a file in the vault.",
          "The command writes only the generated folder `sdp/` inside the vault; Obsidian's settings, a person's intent notes and every other file of the vault lie outside it and are never written, moved or removed.",
          "Before the build and before any cleanup, a run inspects `sdp/` and every entry under it, names that begin with a dot included, and refuses when `sdp/` or an entry under it is a symbolic link or neither a file nor a directory, when the file list is not well formed, when a file other than the file list and the command's own temporaries is one the list does not name, or when a listed file's bytes match no content the list records for it; a refused run writes nothing, removes nothing, names each such path and exits 1. Without a file list, every file under `sdp/` is one the list does not name.",
          "A run that passes the guard writes each generated file whose bytes differ from the file on disk through a temporary sibling renamed into place, leaves every file whose bytes already match untouched, removes each file the list names that the new set no longer holds, removes every directory under `sdp/` left empty, and writes the file list last.",
          "Before it changes any file, a run records in the file list both the content each path holds and the content it will hold, so a run stopped at any point leaves every generated file matching the list, and the next run recognizes each, and each whole temporary, as its own and completes the synchronization; a temporary cut short while it was written matches no recorded content, so the guard refuses it as unknown and the person deletes it.",
          "The vault is not one of the five projection roots the shared build rewrites: the build's invalidation never removes it, and the repository's projection suite does not certify it. The verb that writes every projection root also synchronizes the vault, at the directory `sdp vault` would use for the same root unless that verb names another, through the same directory checks and guard, before it publishes any root; a refusal there leaves the vault untouched and fails that run. `sdp vault` enters the shared build, so it removes the five projection roots as `sdp validate` does.",
          "Two runs over one graph write byte-identical files under `sdp/`, the file list included, and no file there holds a time, a commit, an absolute path or a host name.",
          "Every wikilink, embed and block link a generated note writes resolves to a file the run wrote and, with a block, to a block id that file carries; no note links outside the vault, a carrier or source file is named by its root-relative path in a code span, and text in a code span or a fenced block, where Obsidian reads no link, is no link.",
          "Findings never withhold the vault: a run over a graph with validation findings still synchronizes and returns the validation exit code. A finding whose subject is a Spec or a Pack with a note shows on that note; every other finding shows on the index with its severity, its validator, its file and line when known and its message; and the index counts every finding by severity.",
          "A run whose extraction fails keeps every generated file but the index and the file list: it rewrites the index to open with a warning naming the failure, through the steps `spec:consumers.obsidian-vault#rule.interruptedRun` and `spec:consumers.obsidian-vault#rule.synchronize` state, so the file list ends recording the warning index, and exits 1. The next run that succeeds finds the index matching the list and writes it whole again; with no earlier run, the failed run leaves only that index and the file list under `sdp/`.",
          "Notes are plain Markdown with YAML properties, wikilinks and block ids, which other notes tools read; only the `.base` files are Obsidian's own.",
          "A person opens the vault directory itself as an Obsidian vault, and every link and Base filter names its target by a path from that directory.",
        ],
        exampleSpace: {
          given: [
            "an extraction root holding a Pack and its member Specs, among them {member:string}",
            "the vault command names the vault directory {out:string}",
            'a vault whose generated folder holds {generated:"nothing"|"the files an earlier run wrote"|"the files a run stopped at its first rename left"|"the files a run whose extraction failed left"}',
            'the vault holds {extra:"no other file"|"an intent note and Obsidian settings outside the generated folder"|"a note a person wrote inside the generated folder"|"a file a person wrote inside the generated folder under a temporary\'s name"|"a generated note a person changed"}',
            'the member {change:"stays in the corpus"|"leaves the corpus"|"changes its title"|"has a carrier the extractor refuses"}',
          ],
          when: ["the vault command runs at that root"],
          then: [
            "the run exits {exitCode:number}",
            'the run refuses the path {refusedPath:string} as {refusal:"unknown"|"changed"}',
            'the run refuses the vault directory as {placement:"overlapping a path the build owns"|"inside the extraction"}',
            "the index note warns that the last regeneration failed: {indexWarns:boolean}",
            "every generated file matches a content the file list records for it: {listMatches:boolean}",
            "the generated folder is byte-identical to a fresh vault's, the file list included: {matchesFresh:boolean}",
            "a second run over the same graph leaves every generated file byte-identical: {byteIdentical:boolean}",
            "the member's note is present: {memberNote:boolean}",
            "every file the person wrote is byte-identical: {personFilesKept:boolean}",
            "every link a generated note writes resolves inside the vault: {linksResolve:boolean}",
          ],
        },
        ruleKeys: {
          ownProjection: "rules[0]",
          verb: "rules[1]",
          outsideExtraction: "rules[2]",
          apartFromBuild: "rules[3]",
          ownedFolder: "rules[4]",
          guard: "rules[5]",
          synchronize: "rules[6]",
          interruptedRun: "rules[7]",
          standsApart: "rules[8]",
          deterministic: "rules[9]",
          linksResolve: "rules[10]",
          findingsShown: "rules[11]",
          failedExtraction: "rules[12]",
          plainNotes: "rules[13]",
          openAsVault: "rules[14]",
        },
        description:
          "The world writes a probe corpus of one Pack and its member Specs, runs the vault command with the vault under the root's `generated/` directory unless a point names another, and reads the vault from disk; a second run reads the same graph. The world leaves a stopped run's files by running the command with its first rename failing, which leaves the file list recording both contents and a whole temporary beside its target, and a failed run's files by running it while the member's carrier is one the extractor refuses, then repairing that carrier. A fresh vault is one the command writes into an empty directory from the same graph.",
      },
      design: {
        layout:
          "the generated folder `sdp/` holds `index.md`, `specs.base`, `specs/<family>/<note>.md`, `packs/<note>.md` beside `packs/<note>.base`, `code/<namespace>/<note>.md`, `terms/<note>.md` and the file list `.sdp-vault.json`; `<family>` is the first segment of a Spec's path, `<namespace>` a code unit's or anchor's namespace, and `<note>` the note name `spec:consumers.obsidian-vault.notes#design.noteName` states.",
        fileList:
          '`{ "schema": "sdp-vault/1", "files": { "<path under sdp/>": ["<sha256 hex of the file\'s bytes>"] } }` in `sdp/.sdp-vault.json`, paths sorted in code-unit order, JSON with two-space indentation and a closing newline; a path lists one content after a completed run and at most two while a run is under way, the content it held first.',
        wellFormedList:
          "a file list is well formed when it parses to the `fileList` shape, every path is relative to `sdp/`, `/`-separated, with no empty, `.` or `..` segment, and names neither the file list nor a temporary, every content is 64 lowercase hex digits, every path lists one or two contents, and the file's bytes equal the serialization `spec:consumers.obsidian-vault#design.fileList` states of what it parses to, so a repeated or reordered path is not well formed.",
        temporaryName:
          "a file is written as `.<name>.sdp-tmp` in its own directory and renamed over `<name>`; a temporary a run finds is the command's own only when its bytes match a content the file list records for `<name>`, and the run removes it after the guard passes; the file list's own temporary is the command's own only when it is itself a well-formed file list; any other file of a temporary's name is one the list does not name.",
        buildOwnedPaths:
          "under the root, `generated/graph.json`, `generated/contracts/`, `generated/registrars.json`, `generated/imports.json`, `generated/design-review/`, `generated/census/`, `generated/mermaid/`, `generated/gherkin/` and `generated/spec-studio/`, each with its `.tmp` sibling, and every path the shared build comes to write or remove.",
        guardMessage:
          "one stderr line per refused path, with `<path>` relative to the vault: `sdp vault: <path> is not a file this command wrote (unknown)`, `sdp vault: <path> has changed since this command wrote it (changed)`, `sdp vault: <path> is a link or a special file, which this command never writes (not a file)` or `sdp vault: sdp/.sdp-vault.json is not a file list this command wrote (malformed)`; then `sdp vault: nothing was written or removed; keep what you wrote outside sdp/, then delete each refused path, or delete sdp/ whole`.",
        outsideExtractionMessage:
          "`sdp vault: the vault <out> lies inside the root and would be read as source; choose a directory under generated/, under an excluded prefix, or outside the root`.",
        buildOwnedMessage:
          "`sdp vault: the vault <out> overlaps <path>, which every build rewrites or removes; choose another directory, such as generated/obsidian-vault/`, with `<path>` the first overlapping path in the order `spec:consumers.obsidian-vault#design.buildOwnedPaths` lists them.",
        summaryLine:
          "on stdout after a synchronization, `Wrote <out>/sdp (<n> files: <w> written, <u> unchanged, <r> removed)`.",
        exitCodes:
          "0 when the vault is synchronized over a graph with no validation error; the validation exit code when it is synchronized over one with errors; 1 on a refused option, a refused vault directory, a guard refusal, a case collision, a failed extraction or a write that fails.",
        indexNote:
          "`sdp/index.md` opens with `` > [!info] Generated by `sdp vault` from the graph. Every file under `sdp/` is regenerated: write your own notes outside it, and intent notes in `intent/`. ``, then `# Spec graph`, the finding counts by severity, `## Findings without a note` with one line per finding whose subject has no Spec or Pack note, in report order, the corpus Base embedded, and a link to each Pack note in id order.",
        findingLine:
          "`- <severity> · <validator id> · <file>:<line> · <message>`, leaving out the file and line when the finding names none and the line when it names only a file, with the message escaped as `spec:consumers.obsidian-vault.notes#rule.textEscaped` states.",
        failedIndex:
          "after a failed extraction, `sdp/index.md` opens with `> [!warning] The last regeneration failed, and the notes show the graph of the last one that succeeded.` followed by one line per extraction error, its root-relative file and its message.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.fresh-vault",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.fresh-vault.sdp.md",
    title: "A fresh vault is written the same way twice and every link resolves",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the verb, the generated folder, determinism and link resolution on a vault the command writes for the first time.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "nothing"}',
              'the vault holds {extra: "no other file"}',
              'the member {change: "stays in the corpus"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 0}",
              "a second run over the same graph leaves every generated file byte-identical: {byteIdentical: true}",
              "the member's note is present: {memberNote: true}",
              "every link a generated note writes resolves inside the vault: {linksResolve: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.person-notes-survive",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.person-notes-survive.sdp.md",
    title: "A regeneration removes a note that left the graph and keeps a person's notes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute synchronization on a vault holding a person's intent note and Obsidian's settings while a Spec leaves the corpus.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "the files an earlier run wrote"}',
              'the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}',
              'the member {change: "leaves the corpus"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 0}",
              "the member's note is present: {memberNote: false}",
              "every file the person wrote is byte-identical: {personFilesKept: true}",
              "every link a generated note writes resolves inside the vault: {linksResolve: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.unknown-note-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.unknown-note-refused.sdp.md",
    title: "A note a person wrote inside the generated folder refuses the regeneration",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the guard on a file the command never wrote, left inside its generated folder.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "the files an earlier run wrote"}',
              'the vault holds {extra: "a note a person wrote inside the generated folder"}',
              'the member {change: "leaves the corpus"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 1}",
              'the run refuses the path {refusedPath: "sdp/specs/probe/mine.md"} as {refusal: "unknown"}',
              "the member's note is present: {memberNote: true}",
              "every file the person wrote is byte-identical: {personFilesKept: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.changed-note-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.changed-note-refused.sdp.md",
    title: "A generated note a person changed refuses the regeneration and keeps the edit",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the guard on a generated note whose bytes a person changed after the command wrote it.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "the files an earlier run wrote"}',
              'the vault holds {extra: "a generated note a person changed"}',
              'the member {change: "stays in the corpus"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 1}",
              'the run refuses the path {refusedPath: "sdp/specs/probe/spec.probe.member.md"} as {refusal: "changed"}',
              "every file the person wrote is byte-identical: {personFilesKept: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.hidden-file-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.hidden-file-refused.sdp.md",
    title: "A person's file under a temporary's name refuses the regeneration",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the guard on a file whose name begins with a dot and reads as a temporary of a generated note, but whose bytes the file list does not record.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "the files an earlier run wrote"}',
              'the vault holds {extra: "a file a person wrote inside the generated folder under a temporary\'s name"}',
              'the member {change: "stays in the corpus"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 1}",
              'the run refuses the path {refusedPath: "sdp/specs/probe/.spec.probe.member.md.sdp-tmp"} as {refusal: "unknown"}',
              "every file the person wrote is byte-identical: {personFilesKept: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.vault-in-build-path-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.vault-in-build-path-refused.sdp.md",
    title: "A vault directory the build removes refuses the run and keeps a person's notes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the refusal of a vault directory inside a projection root the shared build removes, and show that a person's notes there survive.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'the vault command names the vault directory {out: "generated/design-review"}',
              'a vault whose generated folder holds {generated: "nothing"}',
              'the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 1}",
              'the run refuses the vault directory as {placement: "overlapping a path the build owns"}',
              "every file the person wrote is byte-identical: {personFilesKept: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.interrupted-run-recovered",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.interrupted-run-recovered.sdp.md",
    title: "A run after a stopped synchronization finishes it",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the recovery from a run stopped at its first rename, which left the file list recording both contents and a whole temporary beside its target.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "the files a run stopped at its first rename left"}',
              'the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}',
              'the member {change: "changes its title"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 0}",
              "the generated folder is byte-identical to a fresh vault's, the file list included: {matchesFresh: true}",
              "every file the person wrote is byte-identical: {personFilesKept: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.failed-extraction-keeps-notes",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.failed-extraction-keeps-notes.sdp.md",
    title: "A failed extraction keeps the notes and says so on the index",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute a run whose extraction fails over a vault an earlier run wrote, which keeps every note, rewrites the index with a warning and records it in the file list.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "the files an earlier run wrote"}',
              'the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}',
              'the member {change: "has a carrier the extractor refuses"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 1}",
              "the member's note is present: {memberNote: true}",
              "the index note warns that the last regeneration failed: {indexWarns: true}",
              "every generated file matches a content the file list records for it: {listMatches: true}",
              "every file the person wrote is byte-identical: {personFilesKept: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.failed-extraction-recovered",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.failed-extraction-recovered.sdp.md",
    title: "The run after a failed extraction passes the guard and restores the index",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the run that follows a failed extraction once the carrier is repaired: the guard accepts the warning index the failed run recorded, and the vault ends as a fresh one would.",
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}',
              'a vault whose generated folder holds {generated: "the files a run whose extraction failed left"}',
              'the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}',
              'the member {change: "stays in the corpus"}',
            ],
            when: ["the vault command runs at that root"],
            then: [
              "the run exits {exitCode: 0}",
              "the index note warns that the last regeneration failed: {indexWarns: false}",
              "the generated folder is byte-identical to a fresh vault's, the file list included: {matchesFresh: true}",
              "every file the person wrote is byte-identical: {personFilesKept: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.notes",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/obsidian-vault.notes.sdp.md",
    title: "Every Spec, Pack, code unit and keyed term is a note, and every relation is a link",
    narrative:
      "A note carries the reader's values as flat properties, so Obsidian's tables filter on them, and the Spec's sections in the graph's order. Each declared relation is a wikilink in both directions with its reason, each mention in prose is a wikilink to its Spec or to its entry's block, and each keyed entry carries a block id named for its address. Backlinks and the graph view then show what rests on a Spec without a query.\n\nTwo findings from the prototypes shape the names and properties. Obsidian refuses a colon in a note's name, so a note cannot be named by its id as written. And Obsidian renders a text or list property as a link to an external address whenever its value holds no space and parses as a URL, which `spec:` followed by a path does, while it renders an alias as plain text. Every link also names the note's `.md` extension, so an id whose last segment reads like another file type's extension, such as `base`, still links to its note.",
    sections: {
      intent: {
        outcome:
          "Write one note per Spec, Pack, code unit, test anchor, oracle anchor and keyed Model term, with graph and reader values as properties and every declared relation and checked mention as a wikilink, so a person follows the graph in both directions.",
      },
      behavior: {
        rules: [
          "The vault holds one note per Spec, Pack, code unit, test anchor and oracle anchor, and one per Model term that carries a key, which `spec:model.term-addresses` gives an address; a term without a key appears only in its Spec's note, since no address can name it, and a ratified glossary term gains a note only where a Spec's Model section defines it with a key.",
          "A term defined in several Specs gets one note per defining Spec and term, so each definition keeps its authored owner; the term's aliases bring the notes together when a person types it.",
          "A note is named by its id with the colon after the namespace replaced by a dot, and a term note by `term.`, its Spec's path, a dot and its key; one vault holds the notes of one corpus.",
          "Two notes whose paths differ only in case refuse the run before it writes, naming both ids, so no two names collide on a file system that ignores case; the run writes and removes nothing and exits 1.",
          "A note's id, colon included, is written as plain text only in its `aliases` property and in the code span of its head line, since Obsidian shows an alias as plain text; a property that names another node holds a link to its note, and no other property value the generator composes is an id or an entry address. Authored text in a property, such as a title or a label, is written as authored, and the generator never treats one that looks like an address as an address.",
          "A Spec note's properties are the reader's values for that Spec, listed under `spec:consumers.obsidian-vault.notes#design.specProperties`; every join, delivery fact, floor and rung among them is one the reader computed, and the generator computes none.",
          "A Spec's bindings are two booleans, `implementationBinding` true where the reader's delivery facts hold `implemented` and `verifierBinding` true where they hold `has-verifier`, and the note's body renders the four binding lines `spec:consumers.binding-language-views` states, so no rendered label is a delivery-fact name.",
          "Each declared relation whose two ends have notes is a link on the notes at both ends, with its type, its reason, and for an example's `verifies` a link to the block of each rule it exercises in the verified Spec's note; an end with no note, such as a target that does not resolve, and an exercised key the verified Spec does not carry, appear on the source note as their id or key in a code span, with no link.",
          "Each keyed Design and UI entry, keyed open question, keyed rule or flow, and keyed Model term ends its line in its Spec's note with the block id `^<section>-<key>`, with section `design`, `ui`, `question`, `rule` or `term`.",
          "A mention in any text the vault renders from the graph, found by the scanner the prose-mention validator uses, becomes a link when its Spec resolves and, for an entry address, its entry does; a mention that does not resolve stays as written. A code span holding exactly one mention becomes that link, and any other code span stays code.",
          "Text from the graph renders as written, except that the generator escapes what Obsidian would read as a link, an embed, a tag, a block id, a comment, a highlight or math, so no note holds a link, tag or block id the graph does not.",
          "Every note name and block id converts back to what it names: a note name to its id by restoring the colon after the namespace, a term note's name to its term address, and a block id in a Spec's note to its entry address, so an agent reading a link a person wrote names the entry it cites.",
        ],
        exampleSpace: {
          given: [
            "a corpus holding the Spec {source:string} whose narrative mentions {mention:string}",
            "a corpus holding the Specs {first:string} and {second:string}",
            "the Spec {target:string} keys the Design entry {key:string}",
            "the Spec {termSpec:string} defines a Model term with the key {termKey:string}",
          ],
          when: ["the vault command runs over that corpus"],
          then: [
            "the run exits {exitCode:number}",
            "the refusal names {named:string}",
            "nothing under the generated folder was written: {nothingWritten:boolean}",
            "the mentioning Spec's note is {notePath:string}",
            "the mention renders as {rendered:string}",
            "the term's note is {termNotePath:string}",
            "the defining Spec's note carries the block id {blockId:string}",
            "the note's aliases open with {alias:string}",
            "no property but aliases holds an id or an entry address as plain text: {plainProperties:boolean}",
          ],
        },
        ruleKeys: {
          oneNotePer: "rules[0]",
          termNoteGrain: "rules[1]",
          noteNames: "rules[2]",
          caseCollision: "rules[3]",
          idInAliases: "rules[4]",
          readerProperties: "rules[5]",
          bindingProperties: "rules[6]",
          relationsBothWays: "rules[7]",
          blockIds: "rules[8]",
          mentionLinks: "rules[9]",
          textEscaped: "rules[10]",
          addressRoundTrip: "rules[11]",
        },
        description:
          "The world writes a probe corpus whose Specs mention each other, runs the vault command, and reads the mentioning Spec's note from disk. A keyed Model term is written as `spec:model.term-addresses` states.",
      },
      design: {
        noteName:
          "`<namespace>.<path>` for an id `<namespace>:<path>`, as `spec.model.rule-keys`, `pack.design-iteration-v1` and `impl.protocol.reader`; `term.<path>.<key>` for the term address `spec:<path>#term.<key>`.",
        linkForm:
          "`[[<path from the vault>.md|<id or address>]]`, with `#^<block id>` after `.md` for an entry; every link names the file's extension, and an embedded Base is `![[sdp/packs/<note>.base]]` or `![[sdp/specs.base]]`.",
        blockId:
          "`<section>-<key>`, written as ` ^<section>-<key>` at the end of the entry's line, so `spec:<id>#design.limit` opens as `[[sdp/specs/<family>/<note>.md#^design-limit|spec:<id>#design.limit]]`.",
        propertyEncoding:
          "the properties sit between two `---` lines at the top of the note, one per line as `<key>: <JSON value>`, in the order listed below; a property the graph does not hold is left out.",
        specProperties:
          "`aliases` (the id, then the title), `title`, `specKind`, `altitude`, `statedReadiness`, `derivedReadiness` (`none` when no rung derives), `statedNextRung` (left out when the Spec states `ready`), `statedNextRungFailures` (the failing clause ids), `implementationBinding`, `verifierBinding`, `designEntries`, `declarations`, `openQuestions` (a count), `blockingQuestions`, `decisions` (links to the notes of the resolving decisions the design columns name), `packs` (links to the Pack notes), `carrier` (the root-relative carrier path).",
        packProperties:
          "`aliases` (the id, then the title), `title`, `manifest` (the root-relative manifest path).",
        codeProperties:
          "`aliases` (the id), `label`, `role`, `layer`, `context`, `component` (a link to the component's note), `sourceFile` (root-relative), `sourceLine`.",
        termProperties:
          "`aliases` (the term, then its address), `definedIn` (a link to the defining Spec's note).",
        banner:
          "the first line after the properties, `` > [!info] Generated by `sdp vault` from the graph. Edit the <carrier|Pack manifest|source file> `<root-relative path>`, never this note: a regeneration refuses while a note it wrote has changed. ``, naming the Spec's carrier, the Pack's manifest or the unit's source file.",
        headLine:
          "under a Spec note's title, `` `<id>` · <kind display label> · <altitude> · stated <rung> · floor <rung or none> ``, then ` · <stated next rung>: <failing clause ids, or nothing blocks>` when the Spec states less than `ready`.",
        specNoteBody:
          "the banner, `# <title>`, the head line, the narrative's paragraphs, each section under `## <Section>` in the graph's order with Intent's open questions under `### Open questions` and an example's steps or an example space's vocabulary in a fenced `gherkin` block, then `## Relations` with `### From this Spec` and `### Toward this Spec`, `## Bindings`, `## Packs` and `## Findings`, each heading left out when it has nothing under it.",
        bindingLines:
          "under `## Bindings`, `- Implementation binding: present` or `none` with each realizing unit, the units that reference the Spec, `- Verifier binding: present` or `none` with each verifier, `- Expected-outcome oracle: present` or `none`, and `- Runtime observation: not tracked`.",
        packNoteBody:
          "the banner, `# <title>`, the framing, `## Members, filterable` with the Pack's Base embedded, `## Members, in reading order` as a numbered list in manifest order, each a link with its stated rung, floor and stated next rung or `nothing blocks`, then `## Boundary` with the reader's four boundary lists and `## Findings`.",
        codeNoteBody:
          "the banner, `# <id>`, the label, `` `<file>:<line>` ``, then link lists under `## Member of`, `## Members`, `## Uses`, `## Used by`, `## Satisfies`, `## References`, `## Verifies` and `## Models`, each left out when empty.",
        termNoteBody:
          "the banner, `# <term>`, the definition, and `Defined in [[<Spec note>.md#^term-<key>|<term address>]].`",
        caseCollisionMessage:
          "`sdp vault: <first id> and <second id> name notes whose paths differ only in case; nothing was written`, one line per colliding pair, the ids in code-unit order.",
        escapes:
          "a backslash before `[[`, `%%`, `==`, `$`, a `#` that opens a tag after a space or at a line's start, and a `^` that would end a line as a block id; text inside a code span is left as written.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.notes.entry-address-link",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.notes.entry-address-link.sdp.md",
    title: "An entry address in prose opens the entry's block in its Spec's note",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute note naming, the id alias and a mention of an entry address rendered as a block link.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a corpus holding the Spec {source: "spec:probe.source"} whose narrative mentions {mention: "spec:probe.target#design.limit"}',
              'the Spec {target: "spec:probe.target"} keys the Design entry {key: "limit"}',
            ],
            when: ["the vault command runs over that corpus"],
            then: [
              'the mentioning Spec\'s note is {notePath: "sdp/specs/probe/spec.probe.source.md"}',
              'the mention renders as {rendered: "[[sdp/specs/probe/spec.probe.target.md#^design-limit|spec:probe.target#design.limit]]"}',
              'the note\'s aliases open with {alias: "spec:probe.source"}',
              "no property but aliases holds an id or an entry address as plain text: {plainProperties: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.notes.unresolved-mention-stays",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.notes.unresolved-mention-stays.sdp.md",
    title: "A mention of an entry that does not exist stays as written",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the mention rule on an entry address whose key its Spec does not carry, which validation reports and the vault leaves unlinked.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a corpus holding the Spec {source: "spec:probe.source"} whose narrative mentions {mention: "spec:probe.target#design.missing"}',
              'the Spec {target: "spec:probe.target"} keys the Design entry {key: "limit"}',
            ],
            when: ["the vault command runs over that corpus"],
            then: ['the mention renders as {rendered: "spec:probe.target#design.missing"}'],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.notes.term-address-link",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.notes.term-address-link.sdp.md",
    title: "A keyed Model term gets a note, and its address in prose opens the term's block",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the term note, the term's block id and a mention of a term address rendered as a block link.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a corpus holding the Spec {source: "spec:probe.source"} whose narrative mentions {mention: "spec:probe.target#term.limit"}',
              'the Spec {termSpec: "spec:probe.target"} defines a Model term with the key {termKey: "limit"}',
            ],
            when: ["the vault command runs over that corpus"],
            then: [
              'the term\'s note is {termNotePath: "sdp/terms/term.probe.target.limit.md"}',
              'the defining Spec\'s note carries the block id {blockId: "term-limit"}',
              'the mention renders as {rendered: "[[sdp/specs/probe/spec.probe.target.md#^term-limit|spec:probe.target#term.limit]]"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.notes.case-collision-refused",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.notes.case-collision-refused.sdp.md",
    title: "Two Specs whose notes differ only in case refuse the run",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the case-collision refusal on two Spec ids that differ only in the case of one letter.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a corpus holding the Specs {first: "spec:probe.Member"} and {second: "spec:probe.member"}',
            ],
            when: ["the vault command runs over that corpus"],
            then: [
              "the run exits {exitCode: 1}",
              'the refusal names {named: "spec:probe.Member and spec:probe.member"}',
              "nothing under the generated folder was written: {nothingWritten: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.bases",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/obsidian-vault.bases.sdp.md",
    title: "A Pack's members and the standing queries are tables over the reader's values",
    narrative:
      "A Base is Obsidian's table, card or list view over notes, filtered and sorted by their properties. Each Pack gets a Base of its members and the corpus one Base whose views are standing queries: the build backlog, the design backlog, the Specs whose next rung waits only for their author's statement, the Specs with blocking questions, and the decisions. In Obsidian a Pack's members read as one sortable table with implementation and verifier bindings shown as present or none, where the Design Review's Pack page is a table too wide for its page.\n\nA view is a filter over values the generator wrote from the reader, so it agrees with the query it mirrors only while its predicate stays that simple. A view that would need a join waits until the reader carries the joined value. Keeping every filter inside a small closed grammar lets a test read each view's selection from the written files, without Obsidian, and compare it with its source over the same graph.",
    sections: {
      intent: {
        outcome:
          "Give each Pack a Base of its members and the corpus a Base of standing queries, so a person filters and sorts a design by rung, floor, bindings and design columns.",
      },
      behavior: {
        rules: [
          "The corpus has one Base, `sdp/specs.base`, over every Spec note, whose views are the standing queries `spec:consumers.obsidian-vault.bases#design.standingViews` lists, embedded in the index note.",
          "Each Pack has a Base beside its note that selects the Spec notes whose `packs` property links the Pack, with the views `spec:consumers.obsidian-vault.bases#design.packViews` lists, embedded in the Pack's note.",
          "Each standing view selects, over one graph, exactly the Specs its source selects, as `spec:consumers.obsidian-vault.bases#design.viewSources` pairs them.",
          "Every filter is an `and` list of clauses from the closed grammar `spec:consumers.obsidian-vault.bases#design.filterClauses` states, over properties the notes hold, so no view computes a join, a fact or a floor.",
          "A Base shows the two binding properties through formulas as present or none, under the column names Implementation binding and Verifier binding, never under a delivery-fact name.",
          "A Pack's note lists its members in manifest order beside its embedded Base, since a Base sorts by property and keeps no authored order.",
        ],
        exampleSpace: {
          given: [
            "a corpus holding a Pack of {members:number} Specs, with a Spec in every standing view",
          ],
          when: ["the vault command writes the vault"],
          then: [
            "each standing view of the corpus Base selects the Specs its source selects: {viewsMatch:boolean}",
            "the Pack's Base selects every member and nothing else: {packMatches:boolean}",
            "every filter clause belongs to the closed grammar: {closedClauses:boolean}",
          ],
        },
        ruleKeys: {
          corpusBase: "rules[0]",
          packBase: "rules[1]",
          viewsMirrorSources: "rules[2]",
          closedClauses: "rules[3]",
          bindingDisplay: "rules[4]",
          memberOrder: "rules[5]",
        },
        description:
          "The world writes a probe corpus with a Pack whose members put at least one Spec in every standing view, runs the vault command, reads the Bases and the Spec notes' properties from disk, applies each view's clauses to those properties, and runs each view's source over the same graph.",
      },
      design: {
        filterClauses:
          'a clause is one of `<property> == "<text>"`, `<property> != "<text>"`, `<property> == true`, `<property> == false`, `<property> > 0`, `<property>.isEmpty()`, `!<property>.isEmpty()`, `<property>.contains(link("<path>.md"))` and `file.inFolder("<folder>")`, each written as one double-quoted YAML string.',
        corpusFilter: '`sdp/specs.base` filters on `file.inFolder("sdp/specs")`.',
        standingViews:
          'table views in this order, `All Specs` with no further clause; `Build backlog` with `statedReadiness == "ready"`, `specKind != "example"`, `specKind != "decision"` and `implementationBinding == false`; `Design backlog` with `statedReadiness == "defined"`, `specKind != "example"`, `specKind != "decision"` and `implementationBinding == false`; `Nothing blocks the next rung` with `!statedNextRung.isEmpty()` and `statedNextRungFailures.isEmpty()`; `Blocking questions` with `blockingQuestions > 0`; `Decisions` with `specKind == "decision"`.',
        viewSources:
          "`Build backlog` the rows of the build backlog recipe; `Design backlog` the rows of the design backlog recipe; `Nothing blocks the next rung` the Specs whose reader context has a `statedNextRung` and an empty `statedNextRungFailures`; `Blocking questions` the Specs with a blocking question in the open-question register; `Decisions` the rows of the decision register; each compared by Spec id over the same graph.",
        packFilter:
          '`sdp/packs/<note>.base` filters on `file.inFolder("sdp/specs")` and `packs.contains(link("sdp/packs/<note>.md"))`.',
        packViews:
          "table views in this order, `Members` with no further clause and `Nothing blocks the next rung` with the clauses of the corpus view of that name.",
        memberColumns:
          "`Members` and `All Specs` show `file.name`, `title`, `specKind`, `statedReadiness`, `derivedReadiness`, `statedNextRung`, `statedNextRungFailures`, `formula.implementation`, `formula.verifier`, `designEntries`, `declarations`, `openQuestions` and `blockingQuestions`; the other views show `file.name`, `title` and the properties their clauses read.",
        bindingFormulas:
          '`implementation: \'if(implementationBinding, "present", "none")\'` and `verifier: \'if(verifierBinding, "present", "none")\'` under `formulas:` in every Base.',
        columnNames:
          "every Base names its columns under `properties:` with `displayName`, keyed `note.<property>` or `formula.<name>`: Title, Kind, Stated, Floor reached, Next rung, What holds it, Implementation binding, Verifier binding, Design entries, Declarations, Open questions, Blocking.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.bases.views-match-sources",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.bases.views-match-sources.sdp.md",
    title: "Each standing view selects what its source selects",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the corpus Base, a Pack's Base and the closed clause grammar against the sources the views mirror, over one graph.",
      },
      behavior: {
        examples: [
          {
            given: [
              "a corpus holding a Pack of {members: 6} Specs, with a Spec in every standing view",
            ],
            when: ["the vault command writes the vault"],
            then: [
              "each standing view of the corpus Base selects the Specs its source selects: {viewsMatch: true}",
              "the Pack's Base selects every member and nothing else: {packMatches: true}",
              "every filter clause belongs to the closed grammar: {closedClauses: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.iteration",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/obsidian-vault.iteration.sdp.md",
    title: "A design pass is followed and answered from the vault",
    narrative:
      "A design pass is a loop: an agent edits carriers, the graph changes, a person reads the change and answers it. In a vault the reading half is cheap, because Obsidian reloads a note when its file changes, so a vault regenerated as the carriers change shows each edit where the person is already reading. Rewriting only the notes whose bytes changed keeps every other note, and the person's place in it, as it was.\n\nThe answering half must not become a second write path. The edit model refuses patches to canonical source from a view, and a person's edit to a generated note would never reach the carrier. So a regeneration refuses while a generated note has changed, and a person composes intent in notes of their own beside the generated ones, citing entries by their block links. An agent turns such a note into a change proposal, runs the proposal check, and applies the proposal as an ordinary edit, which git records and validation checks.",
    sections: {
      intent: {
        outcome:
          "Let a person follow a design pass in the vault as an agent edits the carriers, and answer it from the vault with intent an agent hands off as a change proposal.",
        risks: [
          "Regenerating the vault while a person reads could move them off their place or overwrite a note they are editing.",
        ],
      },
      behavior: {
        rules: [
          "A person composes intent in notes outside the generated folder, by convention in `intent/` at the top of the vault, citing entries by block link or by entry address; the vault command never writes there.",
          "An agent turns an intent note into a change proposal on the one proposal contract, runs the proposal check, and applies what the check allows as an ordinary carrier edit; git records the edit and validation checks it. The vault writes no carrier and no proposal.",
          "`sdp vault --watch` runs once and then again after every create, change, delete or rename of a carrier or an anchored source file, a `.ts` or `.tsx` file other than a `.d.ts`, under the root, outside the directories discovery skips, the exclusions and the vault; it runs the loop `spec:consumers.validate-watch` states, so events during a run coalesce into one pending run, findings, refusals and failed extractions print while the process stays alive, and an operator's SIGINT exits 0 and leaves no temporary under `sdp/`.",
          "The vault's watch never widens `sdp validate --watch`, which still runs on carrier edits only.",
          "A regeneration under `--watch` writes only the notes whose bytes change and removes the notes whose node or entry left the graph, so a note a person is reading reloads in place and every other note keeps its bytes and modification time.",
          "Every generated note opens with a banner naming the file to edit instead, and a regeneration that finds a generated note changed refuses as `spec:consumers.obsidian-vault#rule.guard` states, naming it, so a person's edit is never overwritten and the person moves those words into an intent note.",
        ],
        exampleSpace: {
          given: ["a vault the vault command wrote from an extraction root and now watches"],
          when: [
            'the Spec {specId:string} is edited by {edit:"a title change in its carrier"|"an anchor added in a source file"}',
          ],
          then: [
            "the note of that Spec shows the new title: {shown:boolean}",
            "the note of that Spec shows an implementation binding: {bindingShown:boolean}",
            "every note whose bytes the change leaves alone keeps its modification time: {othersUntouched:boolean}",
            "the watch process stays alive and exits {exitCode:number} on SIGINT",
          ],
        },
        ruleKeys: {
          composeHome: "rules[0]",
          handOff: "rules[1]",
          watch: "rules[2]",
          carriersOnlyForValidate: "rules[3]",
          inPlace: "rules[4]",
          editGuard: "rules[5]",
        },
        description:
          "The world writes a probe corpus and starts the vault command with `--watch`, waits for the first run, edits one carrier or adds a comment-form anchor that satisfies the Spec in a new `.ts` source file, waits for the next run, records each generated file's bytes and modification time before and after, and stops the process with SIGINT.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.iteration.watch-rewrites-changed-notes",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.iteration.watch-rewrites-changed-notes.sdp.md",
    title: "A carrier edit under watch rewrites only the notes it changes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the vault's watch on one carrier edit and show that every note the edit leaves alone keeps its modification time.",
      },
      behavior: {
        examples: [
          {
            given: ["a vault the vault command wrote from an extraction root and now watches"],
            when: [
              'the Spec {specId: "spec:probe.member"} is edited by {edit: "a title change in its carrier"}',
            ],
            then: [
              "the note of that Spec shows the new title: {shown: true}",
              "every note whose bytes the change leaves alone keeps its modification time: {othersUntouched: true}",
              "the watch process stays alive and exits {exitCode: 0} on SIGINT",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.iteration.watch-source-anchor",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/obsidian-vault.iteration.watch-source-anchor.sdp.md",
    title: "An anchor added in a source file under watch rewrites the Spec's note",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the vault's watch on a source-file edit, which `sdp validate --watch` ignores, and show the Spec's note gaining its binding while every other note keeps its bytes.",
      },
      behavior: {
        examples: [
          {
            given: ["a vault the vault command wrote from an extraction root and now watches"],
            when: [
              'the Spec {specId: "spec:probe.member"} is edited by {edit: "an anchor added in a source file"}',
            ],
            then: [
              "the note of that Spec shows an implementation binding: {bindingShown: true}",
              "every note whose bytes the change leaves alone keeps its modification time: {othersUntouched: true}",
              "the watch process stays alive and exits {exitCode: 0} on SIGINT",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.agent-surface.evaluation-sink",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.evaluation-sink.sdp.md",
    title: "The evaluation sink runs one body and prints its return",
    narrative:
      "Without a way to call a shipped recipe, a body that needs its answer pastes the recipe's file into its own text, and a rules file keeps its own copy of the recipe's code. The `recipes` binding lets a body call a shipped recipe by its catalog number over the graph it already holds, so the answer is the recipe's own and nothing derives twice. A recipe call is a binding, never a reader verb: the catalog stays the one owner of the bodies, and the reader gains no query vocabulary. The package exports the same evaluator, so a script that holds a graph runs a body, or a shipped recipe through that body, without deriving the graph again.",
    sections: {
      intent: {
        problem:
          "How `sdp q` takes a body, prints its answer and refuses is stated only in the CLI help and the reading skill, so a caller and a script that runs a recipe learn the contract by trial.",
        outcome:
          "State how the evaluation sink takes a body, renders its return and refuses, so every caller relies on one contract.",
      },
      behavior: {
        rules: [
          "`sdp q` takes one positional JavaScript async-function body, which takes precedence over stdin; with no positional body it reads non-terminal stdin, and absent, unreadable or empty input refuses with exit 1 before evaluation.",
          "The sink supplies `g`, `graph`, `report` and `params`, permits `await` and prints the returned value using bounded `util.inspect` by default or `JSON.stringify` with `--json`; it does not suppress console output, so machine-consumed bodies must avoid it.",
          "A body that returns `undefined` prints no answer, reports on stderr that `return` is the output contract and exits 0; a `--json` result with no JSON form or one that cannot be serialized refuses with exit 1 and no rendered answer.",
          "An extraction error prevents evaluation, renders the extraction findings and exits 1; validation findings are supplied as `report` and do not gate evaluation. A compilation, evaluation or rendering failure exits 1 and reports its error on stderr.",
          "A body that fails to parse is reported with the line and column of the error in the body the caller wrote.",
          "The sink supplies a fifth binding, `recipes`, beside `g`, `graph`, `report` and `params`, and every body it, the rules runner or the exported evaluator runs receives it, a recipe called through it included.",
          "A body calls a shipped recipe as a function of its catalog number and one parameters object; the call runs the recipe's body over the caller's own `g`, `graph` and `report`, with no second derivation and no copy, and resolves to the recipe's answer unchanged, `{ unknownParams, accepts }` and `{ diagnostics }` included.",
          "A call names a recipe the catalog holds and passes one plain object or nothing; any other number or parameters reject the call with a message naming the recipe, and a recipe that throws rejects the call with its error, so a mistaken call fails loudly instead of answering for a sample.",
          "`sdp q`, the rules runner and the exported evaluator compile and run a body one way: the same compilation, the same parse error with its line and column, worded by each surface in its own pinned text, and the same five bindings.",
          "The package exports the body evaluator, so a script that holds a graph runs a body, or a shipped recipe through `recipes`, without deriving the graph again; the evaluator writes and prints nothing and claims no sandbox, as the sink claims none.",
        ],
        exampleSpace: {
          given: [
            "a probe corpus in which two Specs depend on each other through dependsOn",
            'a body that calls {call:"recipe 26 with no parameters"|"recipe 26 with the severity warning"|"a recipe number the catalog does not hold"}',
          ],
          when: [
            'the body runs {entrance:"through sdp q"|"through the exported evaluator over a graph derived once"}',
          ],
          then: [
            'the call {outcome:"resolves"|"rejects"}',
            "the answer equals the shipped recipe file's own answer over the same graph and parameters: {sameAnswer:boolean}",
            "the rejection reads {rejection:string}",
          ],
        },
        ruleKeys: {
          fifthBinding: "rules[5]",
          recipeCall: "rules[6]",
          callRefusals: "rules[7]",
          oneEvaluator: "rules[8]",
          exportedEvaluator: "rules[9]",
        },
      },
      design: {
        parseErrorLine:
          "A body that does not parse prints one stderr line, `sdp q: the body does not parse at line L, column C: <message>`, with 1-based positions in the caller's body, exits 1 and prints nothing on stdout.",
        recipesBinding:
          "`recipes(number, parameters?)`, where `number` is a recipe number the catalog's index lists, an integer, and `parameters` is one plain object, `{}` when omitted; it returns a promise of the value the recipe's body returns, the same value and never a copy or a JSON round trip.",
        recipeSource:
          "a call runs the body the package ships for that number as `dist/recipes/<NN>-<slug>.js`, the file the catalog derives, read from the package that runs the engine and never from the corpus or the working directory.",
        calledBindings:
          "a called recipe receives the caller's `g`, `graph` and `report`, the same objects; its parameters object as `params`; and `recipes` itself, so one recipe may call another.",
        callRejections:
          "`recipes: the catalog holds no recipe <number>` rejects a call whose number the catalog does not list, or that is not an integer; `recipes: recipe <number> takes one parameters object` rejects parameters that are null, an array, a string, a number or a boolean.",
        evaluatorExport:
          "`evaluateBody(body: string, input: { graph: GraphSchema; report?: ValidationReport; params?: Readonly<Record<string, unknown>> }): Promise<unknown>`, exported from the package's main entry, `@libar-dev/software-delivery-protocol`; it binds `g` to the reader over `graph`, `report` to the given report or, when absent, the validation report of `graph`, `params` to the given object or `{}`, and `recipes` over the same three, and resolves to the body's return.",
        evaluatorRejections:
          "a body that does not parse rejects with an Error whose message is `the body does not parse at line L, column C: <message>`, the text the sink prints after `sdp q: `; a body that throws rejects with what it threw; `params` that are not a plain object reject before the body runs.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.evaluation-sink.recipe-call",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.evaluation-sink.recipe-call.sdp.md",
    title: "A body calls a shipped recipe and returns its answer unchanged",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute a recipe call through `sdp q` and compare its answer with the answer of the recipe's shipped file over the same graph.",
        assumptions: [
          "The world writes a probe corpus of two story-altitude behavior Specs, each stating `idea` with an Intent outcome and each declaring `dependsOn` on the other. It runs `sdp q --json` on the probe root with the body `return recipes(26);`, then runs `sdp q --json` on the same root with the text of `dist/recipes/26-dependency-cycles.js` as the body, and compares the two printed answers.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus in which two Specs depend on each other through dependsOn",
              'a body that calls {call: "recipe 26 with no parameters"}',
            ],
            when: ['the body runs {entrance: "through sdp q"}'],
            then: [
              'the call {outcome: "resolves"}',
              "the answer equals the shipped recipe file's own answer over the same graph and parameters: {sameAnswer: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.evaluation-sink.unknown-recipe",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.evaluation-sink.unknown-recipe.sdp.md",
    title: "A call to a recipe the catalog does not hold fails the body",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute a call to a recipe number the catalog does not list through `sdp q` and read the rejection.",
        assumptions: [
          "The world writes the probe corpus of the recipe-call example and runs `sdp q` on its root with the body `return recipes(99);`. It reads the exit code and the one stderr line, and takes the rejection as that line's text after `sdp q: `.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus in which two Specs depend on each other through dependsOn",
              'a body that calls {call: "a recipe number the catalog does not hold"}',
            ],
            when: ['the body runs {entrance: "through sdp q"}'],
            then: [
              'the call {outcome: "rejects"}',
              'the rejection reads {rejection: "recipes: the catalog holds no recipe 99"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.agent-surface.evaluation-sink.exported-evaluator",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/agent-surface.evaluation-sink.exported-evaluator.sdp.md",
    title: "A script holding a graph runs a shipped recipe through the exported evaluator",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute a recipe call with a parameter through `evaluateBody` over a graph the script derived once, and compare its answer with the recipe's shipped file evaluated over the same graph.",
        assumptions: [
          'The world writes the probe corpus of the recipe-call example and derives its graph once with the package\'s `extract`. It awaits `evaluateBody` with the body `return recipes(26, { severity: "warning" });` and that graph, then awaits `evaluateBody` with the text of `dist/recipes/26-dependency-cycles.js`, the same graph and the parameters `{ severity: "warning" }`, and compares the two answers. Neither call derives the graph.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus in which two Specs depend on each other through dependsOn",
              'a body that calls {call: "recipe 26 with the severity warning"}',
            ],
            when: [
              'the body runs {entrance: "through the exported evaluator over a graph derived once"}',
            ],
            then: [
              'the call {outcome: "resolves"}',
              "the answer equals the shipped recipe file's own answer over the same graph and parameters: {sameAnswer: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.reading-on-ramp",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/reading-on-ramp.sdp.md",
    title: "The reading skill teaches agents to query the graph",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give an agent a shipped reading on-ramp that selects current graph evidence and the Spec that owns each law.",
      },
      behavior: {
        rules: [
          "The skill names the closed graph node types, edge types and claims, links their carrying Specs, and moves when those contracts change.",
          "The skill teaches how delivery facts derive and explains the limits of empty answers, keeping a binding distinct from passing tests and runtime observation.",
          "The skill bootstraps through the Protocol repository wrapper or an adopter's package runner, selecting the appropriate root and exclusions without relying on a global `sdp`.",
          "The skill directs the reader from a question to the numbered, named catalog recipe that answers it, passes subjects as `params`, and teaches summary and detail output without creating query verbs.",
          "The skill links the Specs that own law and uses summaries for orientation; current graph data answers state questions and the carrying Specs answer intended truth.",
          "The skill carries one sheet that maps a delivery task to the recipe that answers it.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.index-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/spec-studio.index-page.sdp.md",
    title: "The index says where the corpus stands and narrows every Spec",
    narrative:
      "A reader of a large design needs two ways in: by the task they came to do and by a word they remember. The index gives the first and links to search for the second, opens with a summary the build counts, and replaces one long table with a list a person narrows.",
    sections: {
      intent: {
        outcome:
          "Give a person one landing page that says where the corpus stands, routes them by task, lists every Pack with its members, and narrows every Spec by the coordinates and bindings they ask about.",
      },
      behavior: {
        rules: [
          "The page opens with a summary the build counts from reader values, each count in a sentence: the Specs and Packs; the Specs at each stated rung; the Specs stated above their floor; the open and blocking questions; the Specs with an implementation binding and with a verifier binding; and the findings by severity.",
          "A short list then routes by task, in fixed words that quote nothing from the corpus: read a Pack's design, find a Spec, entry or file by a word, narrow the Specs, and read the findings; each route links to its place in the page set.",
          "The Packs section lists every Pack in id order with its title and its members in authored order, each member with its stated rung beside its floor; it draws no capability tree.",
          "The Specs section lists every Spec in id order, one row each: its title and id, kind and altitude, stated rung beside the floor reached, implementation binding and verifier binding as present or none, open and blocking questions, and its Packs.",
          "Filters narrow the Specs section by kind, altitude, stated rung, floor reached, implementation binding, verifier binding and Pack; each filter takes one value or any, the filters combine, and the section says how many of its rows it shows. Without script every row shows.",
          "The findings section lists the validation report's findings in its order, each with its severity in words, its validator id, its subject when it has one, linked to its page when it is a Spec or a Pack and as text otherwise, its message, and its recorded file and line as text.",
        ],
        ruleKeys: {
          summary: "rules[0]",
          taskRoutes: "rules[1]",
          packsLens: "rules[2]",
          specRows: "rules[3]",
          filters: "rules[4]",
          findings: "rules[5]",
        },
      },
      ui: {
        summary: "a short list of sentences under the page title, each with a count.",
        taskRoutes:
          "links under a `Start here` heading, these four first: Read a Pack's design, Find a Spec, entry or file by a word, Narrow the Specs, Read the findings.",
        packList:
          "one closed disclosure per Pack, its summary line the Pack's title, id and member count, its body the members in authored order as links with their rung badges.",
        specRow:
          "one line per Spec: the title linked to its page, the id as code, the rung badge, then as plain text the kind, altitude, floor in words, the two binding values, the question counts and the Packs; the line wraps on a narrow screen.",
        filterBar:
          "one labelled select per filter above the Specs, each listing any and the values the rows hold, and a line saying how many of all rows show.",
        sectionIds:
          "the Packs, Specs and findings sections carry the element ids `packs`, `specs` and `findings`, which the top navigation, the rail and the task routes link to.",
        findingsList: "one line per finding, the severity word first.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.pack-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/spec-studio.pack-page.sdp.md",
    title: "A Pack page shows the Pack's design as one card per member",
    narrative:
      "The Markdown Pack page renders the Pack design as one wide member table, and the first adopter's reviewers read carrier files instead. This page renders the same assembly as a summary, then a card per member that a reviewer opens where they need the detail.",
    sections: {
      intent: {
        outcome:
          "Show where a Pack's design stands, member by member in reading order, on one page a reviewer scans quickly and opens where they need detail.",
      },
      behavior: {
        rules: [
          "The page opens with the Pack's title, its id and its carrier file as text with a copy action, then the summary; the framing follows as prose under the heading Framing, with the vocabulary references, linked.",
          "The summary states each Pack total in one sentence that opens with its count, never as a table: the members and the unresolved ones, the members held below their stated next rung and those waiting only for their author, the design entries and pinned declarations, the open and blocking questions, the members with an implementation binding and with a design reference, and the boundary in each direction.",
          "The summary's held sentence links each held member to its card with its count of unmet clauses, and its waiting sentence names the members whose stated next rung waits only for their author's statement unless every member does; the page never presents a rung as approved.",
          "The members follow in authored order, one closed card each. A card's summary line shows the member's position, title and kind, its stated rung beside the floor reached, its stated next rung with `nothing blocks` or how many of its clauses are unmet, its open and blocking questions, and its implementation and verifier bindings as present or none.",
          "An open card shows the member's id, linked to its Spec page, then the parts the next five rules state, in their order.",
          "A card lists each clause unmet for the member's stated next rung, with the targets the clause names and their stated rungs.",
          "A card counts the member's design entries and pinned declarations, and links the decisions it names, each with its stated rung.",
          "A card lists each open question with its blocking flag in words, its address when it is keyed, linked to the question on the Spec page, its recorded line, its text, and its decider, links, provisional reading and trigger when present.",
          "A card lists each unit that implements the member and each that references it, by id, label, and recorded file and line as text with a copy action, with its role and its component's id, layer and context.",
          "A card states the member's verifier binding as present or none and, when it has any, counts its verifiers and verifying examples, each beside how many are enabled.",
          "An unresolved member's card says only that the manifest names an id the graph does not hold.",
          "The boundary follows in four closed sections, Rests on, Rested on by, Verified by and Superseded by, each headed with its count. Each row shows the outside Spec, linked, its stated rung, its implementation binding as present or none, and the members it joins under each relation type; an empty section reads None.",
          "Then come the members with no verifier binding, those stated `ready` first, under one sentence saying the graph records bindings and never runs; then the findings that name the Pack.",
          "`Open all` and `Close all` open or close every card and section at once, and opening the page at a card's fragment opens that card.",
        ],
        ruleKeys: {
          header: "rules[0]",
          summary: "rules[1]",
          holds: "rules[2]",
          memberCards: "rules[3]",
          cardBody: "rules[4]",
          cardHolds: "rules[5]",
          cardDesign: "rules[6]",
          cardQuestions: "rules[7]",
          cardCode: "rules[8]",
          cardVerifiers: "rules[9]",
          boundary: "rules[11]",
          unboundVerifiers: "rules[12]",
          openAll: "rules[13]",
        },
      },
      ui: {
        headerBlock:
          "the title as the page heading; below it the id and the carrier file, each with a copy action; then the summary; then the framing under a `Framing` heading, and the vocabulary references.",
        summaryList:
          "the totals as a short list of sentences under a `Where the design stands` heading, each opening with its count, a zero written as No.",
        memberCard:
          "a disclosure whose element id is the member's Spec id; its summary line reads `<position>. <title>`, then the kind, the rung badge, the floor in words, the next rung in words unless the member states ready, the question counts and the two binding values, all but the badge as plain text, wrapping onto further lines on a narrow screen.",
        cardBody:
          "in order, the id link, the unmet clauses, the design counts and decisions, the open questions, the code, and the verifier binding.",
        questionItem:
          "the blocking flag in words; for a keyed question, `question.<key>` as a link to its address with a copy action for the full address; `line <n>` when recorded; the text; then each present field on its own labelled line.",
        unitItem:
          "the unit id as code, its label, `<file>:<line>` with a copy action, its role, and its component with layer and context.",
        boundaryTable:
          "four columns, Spec, stated rung, implementation binding and joined members, the last listing each relation type with its members.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.pack-page.maturity-map",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "A Pack page's maturity map places every member by its stated rung and its floor",
    narrative:
      "A Pack of many members takes a reviewer a long scroll through its cards before they know where the design stands. The maturity map answers that first: one table, a row per stated rung and a column per floor reached, each member a short card in its cell. A member right of its row's own rung waits only for a statement the floor already allows; a member left of it states more than its floor holds.",
    sections: {
      intent: {
        outcome:
          "Let a reviewer see at a glance where every member of a Pack stands, by the rung it states and the floor it reaches.",
      },
      behavior: {
        rules: [
          "After the summary, the maturity map places each resolved member by its stated rung and the floor it reaches: one row per stated rung, idea to ready, and one column per floor, none to ready, each cell listing its members in authored order as short cards linked to their member cards, with its count; the row and column labels say in words where the floor sits above the statement and where the statement sits above the floor.",
        ],
        ruleKeys: {
          maturityMap: "rules[0]",
        },
      },
      ui: {
        maturityMap:
          "an `sdp-maturity-map` holding a table under a `Maturity map` heading, rows headed `stated idea` to `stated ready`, columns headed `floor none` to `floor ready`, each cell its count and its members as short cards, an empty cell reading None, and a caption saying that a cell right of its row's own rung holds statements the floor already allows.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.pack-page.maturity-map.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.spec-page.core",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/spec-studio.spec-page.core.sdp.md",
    title: "A Spec page's core shows the whole Spec, with an anchor for every entry",
    narrative:
      "The full Spec page adds panels to this core: diagrams, a runtime neighborhood, verification and evidence panels, impact, and actions that compose intent. The core shows what the Spec context holds, as text, so a reviewer with only a link reads the whole Spec and can cite any entry by its address.",
    sections: {
      intent: {
        outcome:
          "Show everything the graph holds about one Spec on one page that reads without script: its header, its sections in order with an anchor for every addressable entry, its relations both ways, its bindings and its findings.",
      },
      behavior: {
        rules: [
          "The header shows the title; the id with a copy action; the kind's display label and the altitude; the stated rung beside the floor reached on one line, with the divergence banner only in the dishonest direction; the stated next rung with `nothing blocks` or each unmet clause and its targets; the Packs the Spec belongs to, linked; its design columns; its findings by severity; and its carrier file as text with a copy action. It shows no owner, capability, tag or last-verified time: the envelope holds none, the Packs stand for a capability, and a binding never records a run.",
          "A summary in words follows the header with what the header does not show: the open and blocking questions, and the implementation, verifier and oracle bindings as present or none. It repeats no rung the header shows.",
          "The narrative comes next, then each section the Spec carries as a panel open by default, in the order intent, behavior, constraints, model, design, decision, verification, ui, with its entries in authored order. A section the Spec lacks is absent, and the page adds no section the graph does not hold. The narrative carries the element id `narrative` and each section panel `section.<name>`, such as `section.behavior`.",
          "Every entry an entry address can name, a keyed Design or UI entry, a keyed rule or flow and a keyed open question, carries an element id equal to its address after the `#`, such as `design.<key>`, and shows its key and its recorded line.",
          "Each open question shows its blocking flag in words, its key as code with a copy action for the full entry address when it has one, its text, its decider, its links, linked, its provisional reading and its trigger when present, and its recorded line. It shows no date: git records when a line changed.",
          "A `gwt` or `gwt-vocabulary` fence shows as preformatted step text, as authored.",
          "Relations show both ways, each with its type, its direction, its claim, the other endpoint, linked when it is a Spec or a Pack, whether it resolves, and its reason and the rule keys it exercises when present.",
          "Bindings speak binding language. The implementation binding, design reference, verifier binding and expected-outcome oracle each read present or none, and list each unit, test anchor, example or oracle by id, label, and recorded file and line as text with a copy action; a unit adds its role and component, and an example verifier says whether it is enabled. Runtime observation reads not tracked, and run results read not recorded in the graph.",
          "The findings that name the Spec close the page, each with its severity in words, its validator id and its message.",
        ],
        ruleKeys: {
          header: "rules[0]",
          summary: "rules[1]",
          sections: "rules[2]",
          entryIds: "rules[3]",
          questions: "rules[4]",
          relations: "rules[6]",
          bindings: "rules[7]",
          findings: "rules[8]",
        },
      },
      ui: {
        headerBlock:
          "the title as the page heading; below it a line with the id, kind, altitude, the rung badge with the floor in words, and the next rung; then the Packs, the design columns, the finding counts and the carrier file.",
        summaryLine: "one sentence under the header.",
        sectionPanel:
          "an open disclosure per section, headed with the section's name, and for Verification its mode.",
        entryRow:
          "an entry's key as code, its value, and `line <n>` when recorded, in a definition list.",
        questionItem:
          "the blocking flag in words, `question.<key>` as code when keyed, a copy action whose text and accessible name carry the full entry address, with no second code span of that address, the text, each present field on its own labelled line, and `line <n>` when recorded.",
        relationsTable:
          "five columns, relation and direction, other end, claim, reason, and exercised keys, with an unresolved endpoint marked in words.",
        bindingsBlock:
          "four labelled lines, each present or none with its items below it, then runtime observation and run results.",
        findingsList: "one line per finding, the severity word first.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.search",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/spec-studio.search.sdp.md",
    title: "Search finds a Spec, a Pack, an entry or a bound file by a word",
    narrative:
      "The first adopter asked to search entry keys, pinned declarations and file paths. A Spec's envelope holds no tags, so search reads what the graph holds: the fields concept search reads, which already include every pinned declaration, plus the keys authors coin and the files the graph records. The page matches with the reader's own code, so a term finds on the page what `findByConcept` finds through `sdp q`.",
    sections: {
      intent: {
        outcome:
          "Let a person find a Spec, a Pack, a keyed entry or the code bound at a file by a word they remember of it, from any page and with no request.",
      },
      behavior: {
        rules: [
          "Search matches with the reader's concept matching, one implementation the package exports without Node dependencies and the page script bundles, so over the fields `findByConcept` reads, the page returns the nodes it returns, in its order.",
          "Search also matches the keys authors coin, Design and UI keys, open question keys and rule keys, and a node's recorded file path; a node matched only through these follows every node `findByConcept` matches, in id order. It indexes nothing else.",
          "A term matches where it appears in a field, without regard to case, as `findByConcept` matches; an empty term matches nothing.",
          "The search field on any page opens the search page with the term in its fragment, `search.html#q=<term>`; the search page matches as the person types and keeps the term in its fragment, so a search is a link.",
          "Each result names its node type in words. A Spec result shows its title, id, kind, and stated rung beside the floor reached, and opens its page; a Pack result shows its title and id and opens its page, with no readiness; an Anchor or CodeNode result shows its id, label, and recorded file and line as text with a copy action, and links each Spec its edges reach, with the edge type.",
          "A Spec with a matching entry is a result. Under a Spec result, the page lists the Spec's entries the term matches, as `spec:consumers.spec-studio.data#design.searchEntry` states, in the index's order, each with its section, key and recorded line, linked to the entry's element id on the Spec page when it has an entry address, and otherwise to its section's element id, or to the narrative's.",
          "The page shows fifty results at a time, with a control that shows the next fifty.",
          "The search page reads only the index it embeds; it fetches nothing and joins nothing.",
        ],
        ruleKeys: {
          oneMatcher: "rules[0]",
          addedFields: "rules[1]",
          searchPage: "rules[3]",
          resultShape: "rules[4]",
          entryHits: "rules[5]",
        },
      },
      ui: {
        searchField:
          "a labelled text field and a Search button in the top navigation of every page.",
        resultsHeader: "the term, how many nodes and entries match, and the fields searched.",
        resultCard:
          "one card per node, in result order: its node type in words, title and id, the fields that matched, and the Spec's rungs or the unit's location as the result rule states; then its entry hits.",
        entryHit:
          "one line per entry: its section, its key as code, its recorded line, and the text around the term, shortened.",
        noMatch: "`No node matches` and the term, then the fields searched.",
        needsScript:
          "without script, the search page says that search needs it and links to the index.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.publisher",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/spec-studio.publisher.sdp.md",
    title: "`sdp studio` publishes the Studio as one page set",
    narrative:
      "The Studio has its own verb and root beside the four shipped publishers, and is written the way they are. Its page set opens from the file system and uploads to a static host unchanged. The run adds no stamp, commit or time, so two runs over one graph write the same bytes, and a publishing step that wants build context writes its stamp beside the page set.",
    sections: {
      intent: {
        outcome:
          "Publish the Studio under its own root as one page set the graph and its named inputs alone determine, which opens through `file://` and uploads to a static host unchanged.",
      },
      behavior: {
        rules: [
          "`sdp studio [root] [--exclude PATH]... [--check-clean]` validates the graph and writes the Studio's page set to `<root>/generated/spec-studio/`; `root` defaults to the working directory, and each exclusion is a root-relative path prefix, as for the shipped publishers.",
          "A run writes nothing outside its root, writes no stamp, and leaves every carrier and source file under the root byte-identical.",
          "A run reads no network: every byte it reads is a file under the root, a file its flags name, or a file the package ships.",
          "A run writes its page set to `generated/spec-studio.tmp/`, removes the prior root and renames the temporary into place, so no page of an earlier run survives a later one and no temporary survives a completed run.",
          "Every command that enters the shared build, `sdp studio` among them, removes `generated/spec-studio/` and its temporary sibling before extraction, beside the four roots `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` names; a removal failure refuses the command before extraction.",
          "`sdp studio --check-clean` renders an independent twin and refuses divergent renders, then compares the current root with the new render; missing or drifted output returns nonzero and is removed, and clean output is replaced wholesale with byte-identical content.",
          "Findings never withhold the page set: a run over a graph with validation findings still publishes and returns the validation exit code, and each finding shows on the index, and also on its subject's page when its subject is a Spec or a Pack. A run whose extraction fails publishes nothing and returns nonzero.",
          "The page set holds `index.html`, `search.html`, one `packs/<name>.html` per Pack, one `specs/<name>.html` per Spec, and `assets/studio.css` and `assets/studio.js`. `<name>` is the id after its namespace, with each uppercase ASCII letter written as `_` and its lowercase, so no two pages collide on a file system that ignores case.",
          "Two runs over one graph and the same inputs write byte-identical files, and no file holds a time, a commit, an absolute path or a host name of the run's own.",
          "Every link a page writes stays inside the page set: it resolves to a page the run wrote and, with a fragment, to an element id that page carries, apart from the search page's term fragment `search.html#q=<term>`, which names no element. No page links a carrier or source file, an editor URI or an external address; the only link that leaves the page set is one the stamp element adds in the browser from a present stamp's source template.",
        ],
        exampleSpace: {
          given: [
            'an extraction root holding {corpus:"a Pack and its member Specs"|"a Spec with a validation error"|"a carrier the extractor refuses"} and a stale Studio page {stalePage:string}',
          ],
          when: [
            "the studio command runs twice at that root, with check-clean {checkClean:boolean}",
          ],
          then: [
            "each run exits {exitCode:number}",
            "the page set holds the entry page {entryPage:string}",
            "the two runs wrote byte-identical files: {byteIdentical:boolean}",
            "the stale page survives: {staleSurvives:boolean}",
            "a temporary Studio sibling survives: {temporarySurvives:boolean}",
            "every carrier and source file under the root stays byte-identical: {rootUntouched:boolean}",
            "every link a page writes resolves inside the page set: {linksResolve:boolean}",
          ],
        },
        ruleKeys: {
          verb: "rules[0]",
          ownRoot: "rules[1]",
          wholesale: "rules[3]",
          buildInvalidates: "rules[4]",
          checkClean: "rules[5]",
          findingsShown: "rules[6]",
          pageSet: "rules[7]",
          deterministic: "rules[8]",
          linksResolve: "rules[9]",
          readsNoNetwork: "rules[2]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.publisher.watch",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "`sdp studio --watch` rebuilds the page set on each carrier change",
    narrative:
      "While an author edits, the watch rebuilds the page set on each carrier change, and a person reloads the page to read it. Each cycle writes exactly what a plain run with the same arguments writes, so the watch adds no server, no live reload and no script of its own.",
    sections: {
      intent: {
        outcome:
          "Rebuild the Studio's page set on every carrier change while an author edits, each cycle byte for byte what a plain run writes, with no server and no injected script.",
      },
      behavior: {
        rules: [
          "`sdp studio --watch` installs the carrier watcher validate's watch installs, publishes once at start and again after every carrier create, change, delete or rename, each cycle writing the page set a plain `sdp studio` with the same arguments writes, byte for byte; it serves no page and injects no script, so a reader reloads to read the new build. Findings print each cycle and the process stays alive; a cycle whose extraction fails removes the page set; operator SIGINT exits 0; edits to source files and input files start no cycle; `--watch` cannot combine with `--check-clean`.",
        ],
        ruleKeys: {
          watch: "rules[0]",
        },
        exampleSpace: {
          given: [
            "an extraction root holding a Pack and its member Specs and a stale Studio page {stalePage:string}",
          ],
          when: [
            "the studio command runs under watch at that root while one member carrier changes {changes:number} times",
          ],
          then: [
            "the watch exits {exitCode:number} on SIGINT",
            "each watch cycle wrote the page set a plain run writes: {cyclesMatchPlainRun:boolean}",
            "the page set holds a script the plain run does not write: {injectedScript:boolean}",
            "the stale page survives: {staleSurvives:boolean}",
            "a temporary Studio sibling survives: {temporarySurvives:boolean}",
          ],
        },
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.publisher.watch.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.publisher.watch.matches-plain-run",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "Each watch cycle writes the page set a plain run writes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the watch on a root whose member carrier changes, and hold each cycle's page set to a plain run's.",
        assumptions: [
          "The world writes a root with one Pack of two member Specs and plants the stale page, starts the watch through the command's watch hooks, changes the first member's title twice, waiting for each cycle, and after each cycle runs a plain studio command over a copy of the root as it stands and compares the two page sets file by file; it then stops the watch with SIGINT and reads the exit code.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding a Pack and its member Specs and a stale Studio page {stalePage: "specs/probe.departed.html"}',
            ],
            when: [
              "the studio command runs under watch at that root while one member carrier changes {changes: 2} times",
            ],
            then: [
              "the watch exits {exitCode: 0} on SIGINT",
              "each watch cycle wrote the page set a plain run writes: {cyclesMatchPlainRun: true}",
              "the page set holds a script the plain run does not write: {injectedScript: false}",
              "the stale page survives: {staleSurvives: false}",
              "a temporary Studio sibling survives: {temporarySurvives: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.publisher.watch.matches-plain-run.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.page-elements",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/spec-studio.page-elements.sdp.md",
    title: "A few custom elements filter, search, open and copy on a rendered page",
    narrative:
      "The build renders every page whole, so these elements add behavior to markup that is already there rather than rendering views of their own. A browser refuses a module script on a page opened through `file://`, so they ship as one classic script.",
    sections: {
      intent: {
        outcome:
          "Give the Studio's pages their few interactions through custom elements that enhance markup the build wrote, so a page with its script filters, searches and copies, and every page but the search page still reads in full without it.",
      },
      behavior: {
        rules: [
          "The elements ship in one classic script, `assets/studio.js`, with no module syntax and nothing loaded at run time; the build bundles it from the package's source, with the concept matcher.",
          "Each element enhances markup the build wrote and renders no graph value of its own, except that the search results element renders values from the search index its page embeds.",
          "No element requests anything on a page opened through `file://`; the stamp element requests `stamp.json` only over http or https.",
          "Every control an element adds is a native button, link, select or input with a text label, reachable from the keyboard in reading order.",
          "An element that changes what a page shows says so in words in a polite live region, such as how many rows a filter shows.",
        ],
        ruleKeys: {
          oneScript: "rules[0]",
          enhanceOnly: "rules[1]",
          noRequest: "rules[2]",
          nativeControls: "rules[3]",
          liveCounts: "rules[4]",
        },
      },
      design: {
        search:
          "`sdp-search` with `page-root`, the relative path from its page to the page-set root: wraps the search field's form and, on submit, opens `<page-root>search.html#q=<term>` with the term percent-encoded.",
        searchResults:
          "`sdp-search-results`: on the search page, reads the index from the `sdp-data` element, matches the fragment's term and each term the person types, writes the results `spec:consumers.spec-studio.search` designs, and keeps the term in the fragment.",
        filter:
          '`sdp-filter`: wraps a hidden form of labelled `select` elements, each with `data-filter="<name>"` and an `any` option, and the rows marked `data-row`. On upgrade it shows the form, hides each row whose `data-<name>` differs from a chosen value, and writes `<shown> of <total> shown` in its `output` element; a row whose attribute holds several space-separated values, such as its Packs, matches when one of them equals the choice.',
        expander:
          "`sdp-expander`: adds `Open all` and `Close all` buttons for the `details` elements inside it, and on load and on each fragment change opens every `details` that holds the fragment's target and scrolls the target into view.",
        copy: "`sdp-copy` with `text`: a `Copy` button whose accessible name includes the text; it copies the text to the clipboard and says `Copied`, and where the clipboard is unavailable it selects the text so the person can copy it.",
        stamp:
          "`sdp-stamp` with `page-root`: served over http or https, it requests `<page-root>stamp.json` and, when it loads, shows its corpus commit, engine and build time as text; otherwise it shows nothing.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.readiness-planner",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/readiness-planner.sdp.md",
    title: "The readiness planner orders the statements a person can make",
    narrative:
      "A corpus designed ahead of its code reaches the point where its floors allow far more than its authors have stated, and every statement waits on one person. The statements rest on each other: a Spec reviewed before what it rests on may need review again once that changes. The planner lists the waiting statements so that a Spec others rest on comes first, and lists apart the open questions only the owner settles, with what each holds. It states nothing. A rung stays a person's edit of a carrier, and the order is advice a person may set aside.\n\nThe order reads the four relations the ready floor reads. One pairing would make every decision rest on the Spec it shapes: a decision refines the Spec whose question it settles, and that Spec names the decision through `decidedBy`. A parent that names its own part through `dependsOn` or `constrainedBy` pairs the same way. In each pair the named Spec is what the other rests on, so the `refines` half orders nothing.",
    sections: {
      intent: {
        actor:
          "The owner of a corpus, or an agent preparing the owner's review, with more waiting statements than a session can make.",
        problem:
          "No page orders the statements a person may make, so the owner either states rungs in an order that has to be undone or rebuilds the dependency order by hand with promotion preflight and dependency footing.",
        outcome:
          "Order the Specs whose floor allows a higher rung than their author stated, the Specs they rest on first, so a person makes those statements in an order that holds while tooling states nothing.",
      },
      behavior: {
        rules: [
          "A waiting statement is a Spec whose floor reaches a rung above the rung it states; the queue lists every such Spec once, with the rung its floor allows, and no other Spec.",
          "A waiting Spec rests on each other waiting Spec it names by `dependsOn`, `constrainedBy`, `decidedBy` or `refines`, the four relations the ready floor reads; no Spec rests on itself.",
          "A `refines` from a Spec to a Spec that names it by `dependsOn`, `constrainedBy` or `decidedBy` orders nothing, so a decision comes before the Spec it shapes and a part before the parent that rests on it.",
          "A waiting Spec that rests on no waiting Spec is in round 1, the statements a person can make first; any other waiting Spec is in the round after the latest round among the waiting Specs it rests on.",
          "The queue lists the waiting Specs by round, and within a round by id in code-unit order, numbering each by its place, so each comes after every waiting Spec it rests on unless the two share a cycle.",
          "Waiting Specs that reach each other through those rests-on links form a cycle; its members share one round, the round after the latest round among the waiting Specs outside the cycle that any member rests on, or round 1 when there is none, and the planner lists each cycle with one closed path through it and refuses nothing.",
          "Apart from the statements, the planner lists each open question whose `decider` names the person the caller gives, the owner by default, blocking questions first, each with the Specs it holds: a blocking question holds its own Spec below `defined`, and it holds every Spec whose `ready` the typed-dependency clause refuses because the question's own Spec states below `defined`.",
          "The planner counts the open questions that carry no `decider`, and how many of them block, so an empty list of the owner's questions never reads as nothing waiting on the owner.",
          "The planner is a catalog recipe that reads the graph and states, records and gates nothing; each statement it lists stays a person's edit of the carrier, and a Spec stated out of its order is never a finding.",
        ],
        exampleSpace: {
          given: [
            'a probe corpus in which {corpus:"one waiting Spec depends on another"|"a waiting Spec names a waiting decision that refines it"|"two waiting Specs depend on each other"|"a Spec carries a blocking question its owner decides and another Spec depends on it"}',
          ],
          when: ["the statement queue runs over the probe corpus"],
          then: [
            "the queue lists {queue:string} in that order",
            "round 1 holds {firstRound:string}",
            "the queue reports {cycles:number} cycles",
            "the owner's questions hold {held:string}",
          ],
        },
        ruleKeys: {
          waiting: "rules[0]",
          restsOn: "rules[1]",
          refinesYields: "rules[2]",
          rounds: "rules[3]",
          order: "rules[4]",
          cycles: "rules[5]",
          ownerQuestions: "rules[6]",
          undecided: "rules[7]",
          statesNothing: "rules[8]",
        },
      },
      design: {
        queueRecipe:
          'recipe 46, the statement queue, takes `params.decider`, a token on the `decider` field\'s grammar, `"owner"` by default; another value returns `{ diagnostics: [{ parameter, problem }] }` and no queue.',
        queueAnswer:
          "`{ decider, totals: { waiting, firstRound, rounds, cycles, questions, blockingQuestions, withoutDecider, blockingWithoutDecider }, statements, cycles, questions }`, where `firstRound` counts the round 1 statements, `rounds` the highest round, `questions` and `blockingQuestions` the listed questions, and the last two the open questions that carry no `decider`.",
        statementRow:
          "`{ place, round, id, title, specKind, packs, statedReadiness, floorReached, restsOn }`, where `place` counts from 1 in queue order, `packs` lists the Spec's Pack ids in code-unit order, `floorReached` is the rung its floor allows, and `restsOn` lists the waiting Specs it rests on, sorted by id.",
        cycleRow:
          "`{ members, cycle }`, `members` sorted by id and `cycle` the shortest closed path from the first member through the members, found by a breadth-first walk over the ordering relations with targets in code-unit order, as dependency cycles finds its path; rows sort by first member.",
        questionRow:
          "`{ address, spec, index, question, blocking, decider, holds }`, where `address` is the question's entry address or null when it carries no key, `index` its authored position from 0, and `holds` its own Spec followed by the Specs it holds below `ready`, in code-unit order, empty for a non-blocking question.",
        questionOrder:
          "blocking questions first, then the question that holds more Specs first, then by Spec id and authored position.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:consumers.readiness-planner.dependency-order",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/readiness-planner.dependency-order.sdp.md",
    title: "The Spec another rests on comes first in the queue",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the order on two waiting Specs, one depending on the other.",
        assumptions: [
          "The world writes a probe corpus of two story-altitude behavior Specs, a base and a dependent, each stating `defined` with an Intent outcome and one rule, plus a decision stating `ready` with its context and choice. The decision refines the base, the base names it through `decidedBy`, and the dependent declares `dependsOn` on the base, so both behavior Specs' floors reach `ready` and the decision waits on nothing. The Specs carry the ids the queue names. The world runs the shipped statement queue file through `sdp q --json` on the probe root; a list reads as ids joined by a comma and a space.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['a probe corpus in which {corpus: "one waiting Spec depends on another"}'],
            when: ["the statement queue runs over the probe corpus"],
            then: [
              'the queue lists {queue: "spec:probe.base, spec:probe.dependent"} in that order',
              'round 1 holds {firstRound: "spec:probe.base"}',
              "the queue reports {cycles: 0} cycles",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.readiness-planner.decision-first",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/readiness-planner.decision-first.sdp.md",
    title: "A waiting decision comes before the Spec it shapes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the yielding rule on a waiting decision that refines the waiting Spec naming it through `decidedBy`.",
        assumptions: [
          "The world writes a probe corpus of a story-altitude behavior Spec stating `defined` with an Intent outcome and one rule, and a decision stating `defined` with its context and choice. The decision refines the behavior Spec, and the behavior Spec names the decision through `decidedBy`, so both floors reach `ready`. The Specs carry the ids the queue names, and the world reads the queue as the dependency-order example does.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus in which {corpus: "a waiting Spec names a waiting decision that refines it"}',
            ],
            when: ["the statement queue runs over the probe corpus"],
            then: [
              'the queue lists {queue: "spec:probe.decision, spec:probe.shaped"} in that order',
              'round 1 holds {firstRound: "spec:probe.decision"}',
              "the queue reports {cycles: 0} cycles",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.readiness-planner.cycle-shares-a-round",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/readiness-planner.cycle-shares-a-round.sdp.md",
    title: "Waiting Specs that rest on each other share a round and report a cycle",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the cycle rule on two waiting Specs that depend on each other.",
        assumptions: [
          "The world writes a probe corpus of two story-altitude behavior Specs, each stating `defined` with an Intent outcome and one rule and each declaring `dependsOn` on the other, so both floors reach `ready`. The Specs carry the ids the queue names, and the world reads the queue as the dependency-order example does.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['a probe corpus in which {corpus: "two waiting Specs depend on each other"}'],
            when: ["the statement queue runs over the probe corpus"],
            then: [
              'the queue lists {queue: "spec:probe.a, spec:probe.b"} in that order',
              'round 1 holds {firstRound: "spec:probe.a, spec:probe.b"}',
              "the queue reports {cycles: 1} cycles",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.readiness-planner.owner-question-holds",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/readiness-planner.owner-question-holds.sdp.md",
    title: "An owner's blocking question lists the Specs it holds",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the owner's-question list on a blocking question that holds its own Spec and a Spec depending on it.",
        assumptions: [
          "The world writes a probe corpus of two story-altitude behavior Specs, each with an Intent outcome and one rule. The subject states `scoped`, carries one blocking open question whose `decider` is `owner`, and refines the dependent; the dependent states `defined` and declares `dependsOn` on the subject. Neither floor reaches above its stated rung, so the queue is empty. The Specs carry the ids the list names, and the world reads the queue as the dependency-order example does, the held Specs being the one listed question's `holds`.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus in which {corpus: "a Spec carries a blocking question its owner decides and another Spec depends on it"}',
            ],
            when: ["the statement queue runs over the probe corpus"],
            then: [
              'the queue lists {queue: ""} in that order',
              'the owner\'s questions hold {held: "spec:probe.subject, spec:probe.dependent"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.upgrade-kit",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/consumers/upgrade-kit.sdp.md",
    title: "The upgrade kit shows a corpus what it could adopt",
    narrative:
      "An adopter learns what its corpus does not use yet only by writing its own queries, as the first adopter's survey did when it counted rule keys, question fields, relation reasons and `exercises` lists one at a time. The kit answers that survey with a recipe and turns the one capability a machine can apply without an author's judgment, a key for each rule, into a change proposal. Every other capability it reports asks for intent only an author has, so the kit reports where each could apply and proposes nothing for it.",
    sections: {
      intent: {
        actor:
          "An adopter moving a corpus onto a newer Protocol commit, or the agent working for it.",
        problem:
          "An adopter cannot see which capabilities its corpus already uses and where each could apply, so it hand-rolls the survey for every release and applies each new capability by hand.",
        outcome:
          "Report, per Spec and Pack, the Protocol capabilities a corpus uses and where each could apply, and propose the edits as a change proposal an agent applies, never editing a carrier itself.",
      },
      behavior: {
        rules: [
          "The kit reports and proposes and never edits: its recipes read the graph and return data, and a change reaches a carrier only as an agent's or a person's edit, applied after the proposal check and recorded by git.",
          "The kit states no rung, authors no fact and scores nothing: a capability it reports as unused is a place it could apply, never a finding, a gate or a quota.",
          "The package ships an upgrade guide for an adopter moving its corpus onto a newer commit: it measures the corpus with capability adoption, keys its rules with the rule-key proposal, and, for each capability the report lists, names the Spec that carries its law, with capability adoption as the recipe that measures it.",
          "The guide teaches and states no law: each section names the Spec that carries what it teaches, and no section repeats that Spec's rules.",
        ],
        ruleKeys: {
          reportsAndProposes: "rules[0]",
          statesNoRung: "rules[1]",
          upgradeGuide: "rules[2]",
          guideTeaches: "rules[3]",
        },
      },
      design: {
        guideFile:
          "`docs/agent-surface/upgrade-guide.md`, shipped in the package beside the recipe catalog, listed in the package's files and named by `sdp --help` among the shipped on-ramps.",
        guideSections:
          "in this order: re-pin the package and check `sdp --version`; measure the corpus with capability adoption (recipe 47); key the rules with the rule-key proposal (recipe 48), check the proposal with the proposal check (recipe 38) and apply it through an agent's edit; for every capability in recipe 47's answer, one subsection citing its `carriedBy` Spec and recipe 47 as the measurement, naming a further recipe only when the subsection teaches a distinct next action with it and otherwise sending the reader to the carrying Spec; move rules files onto shipped recipes, recipes 25, 26, 42, 50 and 51 and the `recipes` binding; read large Packs in parts and order the waiting statements, recipes 36 and 46; publish every root with `sdp generate`; and pass a recipe's subject as `--params` data, the recipe-caller guidance the README carries.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.upgrade-kit.capability-adoption",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/upgrade-kit.capability-adoption.sdp.md",
    title: "Capability adoption counts where each capability is used and where it could apply",
    narrative: null,
    sections: {
      intent: {
        problem:
          "An adopter learns which authoring capabilities its corpus uses, and where each could apply, only by writing a query per capability.",
        outcome:
          "Report, for the whole corpus, each Pack and each Spec, how many places use each capability and how many places it could apply, from the graph alone.",
      },
      behavior: {
        rules: [
          "Capability adoption, recipe 47, reports one row per capability with the places that use it and the places it could apply, counted from the graph, each row naming the Spec that carries the capability's law.",
          "Beside the rows it reports the corpus's size and its readiness statements: Specs, Packs, examples, decisions, anchored component units, the Specs stated `ready` and the Specs whose floor allows `ready`.",
          "It counts each capability's places within each Pack's members and, on request, within each Spec, a place two members share counted once, so an adopter sees where each capability could apply.",
          "A capability the graph does not hold, such as the perspectives a corpus keeps as files, is counted only from data the caller passes, and its row reads null otherwise; the recipe reads no file.",
          "A count is a place a capability could apply, never a score, a ranking or a finding, and the answer carries no findings.",
        ],
        exampleSpace: {
          given: [
            "a probe corpus with {rules:number} rule entries of which {keyed:number} carry a key, and {relations:number} authored relations of which {reasons:number} carry a reason",
          ],
          when: ["capability adoption runs over it without perspectives"],
          then: [
            "the rule-key row reads {ruleKeys:string}",
            "the relation-reason row reads {relationReasons:string}",
            "the perspectives row reads {perspectives:string}",
          ],
        },
        ruleKeys: {
          capabilityRows: "rules[0]",
          corpusTotals: "rules[1]",
          perPackAndSpec: "rules[2]",
          outsideTheGraph: "rules[3]",
          countsOnly: "rules[4]",
        },
      },
      design: {
        adoptionRecipe:
          "recipe 47, capability adoption, takes `params.detail`, `false` by default, `true` for every Spec row or a list of Spec ids for those rows, and `params.perspectives`, the list of perspective objects the corpus keeps, absent by default; another `detail` value returns `{ diagnostics: [{ parameter, problem }] }`.",
        adoptionAnswer:
          "`{ totals, capabilities, packs, specs, leftOut }`, where `totals` is `{ specs, packs, examples, decisions, componentUnits, statedReady, floorReady }`, `capabilities` holds one row per capability in the order below, `packs` one row per Pack in id order, `specs` the Spec rows `detail` asks for, empty by default, and `leftOut` holds the one line `Spec rows; pass detail: true or a list of Spec ids.` whenever a Spec row is left out, and is empty otherwise.",
        capabilityRow:
          "`{ capability, inUse, applicable, carriedBy }`, where `inUse` counts the places that use the capability, `applicable` the places it could apply, and `carriedBy` is the id of the Spec that carries its law; a count the graph cannot give is null.",
        capabilityList:
          "each row as `capability` (`carriedBy`): places used, of places it could apply. `ruleKeys` (`spec:model.rule-keys`): rule and flow entries that carry a key, of all rule and flow entries; `questionKeys` (`spec:model.open-question-keys`): open questions that carry a key, of all open questions; `questionFields` (`spec:model.open-question-fields`): open questions that carry `decider`, `links`, `provisional` or `trigger`, of all open questions; `relationReasons` (`spec:model.relation-reasons`): authored relations that carry a reason, of all authored relations; `exercises` (`spec:model.rule-keys`): declared `verifies` edges from an example that carry `exercises`, of all such edges; `pinnedDeclarations` (`spec:extraction.contract-declarations`): keyed Design entries whose value opens with a code span, of every keyed Design entry other than `description`; `componentDesigns` (`spec:model.planned-architecture`): components that have a component design, of the distinct components a component design or a `component:` anchor names; `stepKeys` (`spec:carrier.step-keys`): keyed example steps, of all example steps; `termKeys` (`spec:model.term-addresses`): keyed Model terms, of all Model terms; `entryCitations` (`spec:extraction.entry-citations`): pinned declarations an anchored line cites, of all pinned declarations; `perspectives` (`spec:consumers.review-perspectives`): the perspective objects passed, of null.",
        packRow:
          "`{ id, members, capabilities }`, where `capabilities` maps each capability but `perspectives` to `{ inUse, applicable }` summed over the Pack's resolving members, except `componentDesigns`, which counts once each the components a member names as a component design or a `component:` anchor names when it satisfies a member, `inUse` being those that have a component design anywhere in the corpus.",
        specRow:
          "`{ id, packs, inUse, couldApply }`, where `inUse` maps each capability the Spec uses to its count and `couldApply` maps each capability with places left to `applicable` minus `inUse`, both leaving out `perspectives` and every zero, and `componentDesigns` counts as a Pack row does for that Spec alone; rows sort by id.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.upgrade-kit.capability-adoption.counts-a-corpus",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/upgrade-kit.capability-adoption.counts-a-corpus.sdp.md",
    title: "Capability adoption counts keyed rules and reasoned relations",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the capability rows on a probe corpus with known counts of keyed rules and reasoned relations, and no perspectives passed.",
        assumptions: [
          "The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome. The first carries three rules, one of them keyed, and declares `dependsOn` on the second with a reason; the second carries no rule and declares `refines` on the first with no reason. It runs the shipped capability adoption file through `sdp q --json` with no parameters; a row reads `<inUse> of <applicable>`, and `null` when a count is null.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus with {rules: 3} rule entries of which {keyed: 1} carry a key, and {relations: 2} authored relations of which {reasons: 1} carry a reason",
            ],
            when: ["capability adoption runs over it without perspectives"],
            then: [
              'the rule-key row reads {ruleKeys: "1 of 3"}',
              'the relation-reason row reads {relationReasons: "1 of 2"}',
              'the perspectives row reads {perspectives: "null of null"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.upgrade-kit.rule-key-proposal",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/upgrade-kit.rule-key-proposal.sdp.md",
    title: "The rule-key proposal keys every unkeyed rule as a change proposal",
    narrative:
      "A key is the one capability a machine can add without an author's judgment: it addresses a rule and changes nothing the rule says. The proposal coins each key from the words of its rule, so the same corpus gives the same keys, and a person reads and may rename a key before an agent applies the change. A key coined from words is plainer than one an author would choose, which is why it travels as a proposal a person reviews rather than as an edit.",
    sections: {
      intent: {
        problem:
          "Keying every rule of a large corpus by hand is slow and uneven, and an agent asked to do it in one pass edits carriers with no reviewable record of what it intends.",
        outcome:
          "Write one change proposal that adds a key to each unkeyed rule and flow entry in a scope, so an agent applies it after the proposal check and the corpus validates with no error.",
      },
      behavior: {
        rules: [
          "The rule-key proposal, recipe 48, writes one change proposal that adds a key to each unkeyed rule and flow entry in its scope, in the shape the change-proposal contract states, and edits nothing.",
          "Each change adds only the key marker to its entry and keeps the entry's text, so keying a rule changes no rule's meaning and no frozen projection's text.",
          "Each key is coined from its entry's text by fixed steps, so the same graph and parameters give the same keys.",
          "A coined key is lower camel on the rule-key grammar, unique among the rule and flow keys of its Spec, the keys it already carries and the keys coined before it, and never a name the carrier refuses as a key.",
          "An entry whose text yields no word to coin from is listed apart, with its Spec, entry and line, and gets no change; the recipe never invents a key from nothing.",
          "An agent applies the proposal only after the proposal check finds no change whose scope moved since the commit it names, as composed intent is applied; a person may rename a coined key before it is applied, and `sdp validate` on the worktree stays the only gate.",
        ],
        exampleSpace: {
          given: ["a probe Spec whose unkeyed rules read {rules:string}"],
          when: [
            "the rule-key proposal runs for it at a commit and the proposal check reads it against the graph of that commit",
          ],
          then: [
            "the proposal adds the keys {keys:string}",
            "the proposal leaves {unkeyable:number} entries unkeyed",
            "the proposal check reports {moved:number} moved changes and {problems:number} schema problems",
            "the probe validates with {errors:number} errors once an agent applies the proposal",
          ],
        },
        ruleKeys: {
          proposesKeys: "rules[0]",
          keepsText: "rules[1]",
          coinedKey: "rules[2]",
          uniqueKey: "rules[3]",
          unkeyable: "rules[4]",
          applyAfterCheck: "rules[5]",
        },
      },
      design: {
        proposalRecipe:
          "recipe 48, the rule-key proposal, takes `params.commit`, the commit whose graph it reads, required, and at most one scope, `params.pack` or `params.specs`, the whole corpus with neither; a missing commit, both scopes, or an id that does not resolve returns `{ diagnostics: [{ parameter, problem }] }` and no proposal.",
        proposalAnswer:
          "`{ scope, totals: { specs, entries, keyed, proposed, unkeyable }, proposal, unkeyable }`, where `scope` is `{ corpus: true }`, `{ pack }` or `{ specs }`, `entries` counts the rule and flow entries in scope, `keyed` those that already carry a key, `proposal` is the change-proposal document, or null when no entry needs a key, and `unkeyable` lists the entries no key could be coined for.",
        proposalDocument:
          '`{ "schema": "sdp-proposal/1", "base": "<commit>", "reason": "Key every rule and flow entry in <scope> so a review, a register row or an example can cite it.", "changes": [change] }`, with `<scope>` the Pack id, the Spec ids joined by a comma and a space, or `the corpus`.',
        keyChange:
          '`{ "scope": ["<spec id>"], "request": "<request>", "text": "[#<key>] <entry text>", "reason": "Gives the entry the address <spec id>#rule.<key>." }`, one per unkeyed entry, by Spec in scope order, then its rules before its flows, each in authored order; `text` is the entry\'s text as its carrier writes it once keyed, after its `rule:` or `flow:` label where it has one.',
        keyRequest:
          "`Add the key marker [#<key>] and one space at the start of the text of <entry> of <spec id>, at <file> line <line>, after its rule: or flow: label where it has one.`, with `<entry>` the location table's `rule[<i>]` or `flow[<i>]` and `, at <file>` alone when the line is not located.",
        keyCoining:
          "decompose the text and drop combining marks; drop the bracketed groups that open it, such as `[extension]`; split the rest into words at every character other than an ASCII letter or digit and at each change from a lowercase letter or digit to an uppercase letter; lowercase each word; drop the stop words, unless that leaves no word; drop the leading words that do not open with a letter and every repeat of a word kept before it; join the first three words left in lower camel case, the first all lowercase and each later one with its first letter uppercased.",
        stopWords:
          "`a`, `an`, `the`, `and`, `or`, `but`, `nor`, `so`, `then`, `than`, `if`, `when`, `while`, `where`, `of`, `to`, `in`, `on`, `at`, `by`, `for`, `with`, `from`, `into`, `onto`, `as`, `per`, `via`, `over`, `under`, `about`, `is`, `are`, `was`, `were`, `be`, `been`, `being`, `do`, `does`, `did`, `has`, `have`, `had`, `can`, `could`, `may`, `might`, `must`, `shall`, `should`, `will`, `would`, `it`, `its`, `this`, `that`, `these`, `those`, `there`, `their`, `they`, `them`, `which`, `who`, `whom`, `whose`, `what`, `each`, `every`, `any`, `also`, `only` and `own`.",
        keyCollision:
          "a coined key already taken in its Spec, or equal to a key the carrier refuses, takes the smallest suffix from `2` up that makes it unique.",
        unkeyableRow:
          '`{ spec, entry, file, line, reason: "no word to coin a key from" }`, with `entry` the location table\'s `rule[<i>]` or `flow[<i>]` and `line` null when not located.',
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.upgrade-kit.rule-key-proposal.proposal-applies-clean",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/upgrade-kit.rule-key-proposal.proposal-applies-clean.sdp.md",
    title: "A rule-key proposal passes the proposal check and validates once applied",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the proposal end to end on a probe Spec with two unkeyed rules: coin the keys, check the proposal against the base graph, apply it as an agent would, and validate.",
        assumptions: [
          "The world writes a probe corpus of one story-altitude behavior Spec stating `idea` with an Intent outcome and the two rules the step lists, split at ` / `, runs `sdp build` to write the base graph, and runs the shipped rule-key proposal file through `sdp q --json` with the Spec in `specs` and a commit string. It runs the shipped proposal check file with the answer's `proposal` and the base graph, then applies each change by putting its marker after the rule's label at the line its request names, and runs `sdp validate` on the probe root. The keys read joined by a comma and a space.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe Spec whose unkeyed rules read {rules: "The bundle is composed on each invocation. / Each part fits the budget."}',
            ],
            when: [
              "the rule-key proposal runs for it at a commit and the proposal check reads it against the graph of that commit",
            ],
            then: [
              'the proposal adds the keys {keys: "bundleComposedInvocation, partFitsBudget"}',
              "the proposal leaves {unkeyable: 0} entries unkeyed",
              "the proposal check reports {moved: 0} moved changes and {problems: 0} schema problems",
              "the probe validates with {errors: 0} errors once an agent applies the proposal",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.upgrade-kit.rule-key-proposal.collision-and-unkeyable",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/consumers/upgrade-kit.rule-key-proposal.collision-and-unkeyable.sdp.md",
    title: "Two rules that coin one key stay apart, and a rule with no ASCII word stays unkeyed",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the uniqueness and unkeyable rules on a probe Spec whose first two rules coin the same key and whose third holds no ASCII word.",
        assumptions: [
          "The world writes the probe corpus of the applies-clean example with the three rules the step lists, the third written in Greek letters, and reads the shipped rule-key proposal file's answer as that example does.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe Spec whose unkeyed rules read {rules: "A part fits the budget. / Every part fits the budget again. / Ο κανόνας ισχύει."}',
            ],
            when: [
              "the rule-key proposal runs for it at a commit and the proposal check reads it against the graph of that commit",
            ],
            then: [
              'the proposal adds the keys {keys: "partFitsBudget, partFitsBudget2"}',
              "the proposal leaves {unkeyable: 1} entries unkeyed",
              "the proposal check reports {moved: 0} moved changes and {problems: 0} schema problems",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.command-line",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/command-line.sdp.md",
    title: "Every verb answers --help, and one verb writes every projection root",
    narrative:
      "An adopter meets the command line one verb at a time, and the verb itself is the natural place to ask how it works. Each publisher's build first removes all five projection roots, so after one publisher runs only its own root is current, and writing all five took a script private to this repository. One public verb writes every root from one graph in one run, so an adopter's checkout and its CI publish the same set the Protocol's own does.",
    sections: {
      intent: {
        actor: "An adopter, or an agent working for one, at the command line or in CI.",
        problem:
          "A verb refuses `--help` instead of explaining itself, and no public verb publishes every projection root at once, so an adopter runs the publishers one by one and is left with only the last one's root.",
        outcome:
          "Let every verb explain itself through `--help`, and let one verb write every projection root from one graph in one run.",
      },
      behavior: {
        rules: [
          "Every verb answers `--help`: when `--help` is among a verb's arguments, the verb prints its help on standard output and exits 0, reading no other argument, deriving no graph and touching no file, a projection root included.",
          "A verb's help opens with its usage and its paragraph from the top-level help, the same text, so a verb's help and `sdp --help` never disagree; only the scaffolder's help, for `sdp new` and `sdp new spec`, adds a paragraph of its own after that text.",
          "`sdp generate [root] [--exclude PATH]... [--vault DIR] [--check-clean]` enters the shared build once, validates the graph, synchronizes the vault, and writes all five projection roots from that one graph: the Design Review, the census, the Mermaid diagrams, the Gherkin-shaped view and the Studio.",
          "Each root the verb writes holds the bytes its own publisher writes from the same graph, written wholesale through its temporary sibling as that publisher writes it.",
          "Findings never withhold a root: the verb writes all five and exits with the validation exit code, and a graph that does not derive writes no root and exits 1.",
          "With `--check-clean`, the verb applies to each root the check its publisher applies under `--check-clean`, to renders of the one graph; a root that fails its check is removed, the others are written, and the run exits 1.",
        ],
        exampleSpace: {
          given: [
            'an extraction root holding two authored Specs and {roots:"a stale page in each of the five projection roots"|"five current projection roots, one stale page planted in the census root"}',
          ],
          when: [
            'the command {command:"sdp generate"|"sdp generate --check-clean"|"sdp view --help"} runs at that root',
          ],
          then: [
            "the command exits {exitCode:number}",
            "the stale pages survive: {staleSurvive:boolean}",
            "the roots holding the current pages for those Specs are {currentRoots:string}",
            "the absent projection roots are {absentRoots:string}",
            "standard output opens with the line {firstLine:string}",
          ],
        },
        ruleKeys: {
          verbHelp: "rules[0]",
          oneHelpText: "rules[1]",
          generateVerb: "rules[2]",
          sameBytes: "rules[3]",
          generateExit: "rules[4]",
          generateCheck: "rules[5]",
        },
      },
      design: {
        helpVerbs:
          "`build`, `validate`, `view`, `census`, `mermaid`, `gherkin`, `studio`, `generate`, `import`, `new` and `q` answer `--help`.",
        verbHelpText:
          "`Usage:` on its own line, then the verb's usage lines as `sdp --help` writes them, a blank line and the verb's paragraph from the `Commands:` list of `sdp --help`; `sdp new --help` and `sdp new spec --help` then add a blank line and the scaffolder's own paragraph on what `PATH` takes and what the scaffold writes.",
        generateRoots:
          "in this order, `generated/design-review/`, `generated/census/`, `generated/mermaid/`, `generated/gherkin/` and `generated/spec-studio/`.",
        generateOutput:
          "the build and validation summary lines once, then the line each publisher prints for its root, in the order of the roots.",
        vaultRoot:
          "the verb never removes a vault with the five roots; before it publishes any root it synchronizes the vault at the folder `sdp vault` uses for the same root, or at `--vault DIR`, through the vault's own directory checks and guard, and a refusal there writes no root and exits 1; under `--check-clean` it leaves the vault alone, since the vault has no check mode and its tests hold its determinism.",
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.command-line.generate-check-failure",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/command-line.generate-check-failure.sdp.md",
    title: "A root that fails its check is removed while sdp generate writes the others",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the check rule of the all-roots verb over five current roots, one of which holds a page its publisher would not write.",
        assumptions: [
          "The world writes the extraction root of the generate example, runs `sdp generate` on it so every root is current, since each publisher alone would leave only its own root, then plants one stale page in the census root. It runs `sdp generate --check-clean` on the root, then checks that the census root is gone and that each other root's files equal the files its own publisher writes when run alone on a copy of the same root. Lists of roots read as in the generate example.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding two authored Specs and {roots: "five current projection roots, one stale page planted in the census root"}',
            ],
            when: ['the command {command: "sdp generate --check-clean"} runs at that root'],
            then: [
              "the command exits {exitCode: 1}",
              "the stale pages survive: {staleSurvive: false}",
              'the roots holding the current pages for those Specs are {currentRoots: "design-review, mermaid, gherkin, spec-studio"}',
              'the absent projection roots are {absentRoots: "census"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.command-line.generate-writes-every-root",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/command-line.generate-writes-every-root.sdp.md",
    title: "One run of sdp generate leaves all five roots current",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the all-roots verb over a root whose five projection roots each hold a stale page.",
        assumptions: [
          "The world writes an extraction root of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the second declaring `refines` on the first, so the Protocol's validators report no finding, and plants one stale page in each of the five projection roots. It runs `sdp generate` on the root, then checks that no stale page survives and that each root's files equal the files its own publisher writes when run alone on a copy of the same root. A list of roots names each by its directory under `generated/`, in the verb's root order, joined by a comma and a space.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding two authored Specs and {roots: "a stale page in each of the five projection roots"}',
            ],
            when: ['the command {command: "sdp generate"} runs at that root'],
            then: [
              "the command exits {exitCode: 0}",
              "the stale pages survive: {staleSurvive: false}",
              'the roots holding the current pages for those Specs are {currentRoots: "design-review, census, mermaid, gherkin, spec-studio"}',
              'the absent projection roots are {absentRoots: ""}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.command-line.verb-help-touches-nothing",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/consumers/command-line.verb-help-touches-nothing.sdp.md",
    title: "A publisher's --help prints its help and touches no root",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the help rule on a publisher whose build would otherwise remove every projection root.",
        assumptions: [
          "The world writes the extraction root and stale pages of the generate example, runs `sdp view --help` on it, checks that standard output holds the view's usage line and its paragraph from `sdp --help`, and that every stale page is still in place.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'an extraction root holding two authored Specs and {roots: "a stale page in each of the five projection roots"}',
            ],
            when: ['the command {command: "sdp view --help"} runs at that root'],
            then: [
              "the command exits {exitCode: 0}",
              "the stale pages survive: {staleSurvive: true}",
              'the roots holding the current pages for those Specs are {currentRoots: ""}',
              'the absent projection roots are {absentRoots: ""}',
              'standard output opens with the line {firstLine: "Usage:"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:consumers.spec-studio.diagrams",
    specKind: "contract",
    altitude: "story",
    readiness: "ready",
    title: "A diagram is laid out from graph values into SVG with a text equivalent",
    narrative:
      "The Studio draws four diagrams: the architecture lens's components by context and layer, one component's members and what they use, one Spec's relations, and on a Spec page the code that realizes it. Each is laid out in the engine when the page set is built, so a page draws it with no script and the same graph draws the same bytes. Words carry every reading the drawing shows: bands and columns are labelled, a planned or folded box says so, and a text equivalent after the drawing states every box and edge.",
    sections: {
      intent: {
        outcome:
          "Draw the Studio's diagrams as inline SVG that reads without script, prints, and stays the same bytes for the same graph, with every box and edge also stated in words.",
      },
      behavior: {
        rules: [
          "The build lays out each diagram and writes it into its page as inline SVG; no diagram is laid out in the browser, and a page draws every diagram with no script.",
          "A layout reads only the diagram's boxes, each with its id and its words, and its edges, each with its two ends and its kind, taken from the reader values and recipe answers its page names; it reads no font, file, clock or random value, measures text by character count, and writes whole-pixel coordinates.",
          "One graph and the same inputs draw byte-identical SVG on every build and every machine.",
          "The architecture diagram places each component in the column of its recorded context, contexts in code-unit order and then a column for components that state none, and in the band of its layer, in the order edge, application, domain, adapter, infrastructure, then a band for components that state none; a cell holds its components in id order.",
          "An architecture edge joins two components and carries the count of unit `uses` edges between them, as the component rows of `spec:consumers.spec-studio.lenses.architecture#design.componentRows` count them: each end of a unit `uses` edge resolves to its component, directly or through `memberOf`, and a use within one component draws nothing.",
          "A trace graph draws the Spec in a band of its own, the Specs its declared relations name above it in one band per relation type, in the order refines, dependsOn, constrainedBy, decidedBy, verifies, supersedes, and the Specs whose declared relations name it below in bands of the same order; a Spec related more than one way sits in the band of its first relation, and each relation is its own edge.",
          "A member diagram draws a component's members in bands by how deep `uses` among members reaches, a member that uses another sitting above it, and the units and components outside the component that members use in a last band of their own.",
          "A realization diagram draws the units that satisfy the Spec, then their components, then what those units use, in three bands.",
          "A diagram draws at most the boxes and edges the bound names.",
          "An architecture diagram over the bound with more than one context draws one box per context, with the uses between contexts aggregated and counted, and then each context's own diagram in a section of its own, where every other context it uses or is used by is one folded box in a band of its own.",
          "A diagram of one context still over the bound draws one box per layer of that context, and then each layer's components in a section of their own.",
          "A drawing still over the bound after these folds, the context overview, one context's diagram or one layer's, writes no SVG; its text equivalent lists every box and edge the drawing would hold and then says the drawing was omitted because it exceeds the bound.",
          "A trace graph over the bound folds its largest relation group first, ties broken by direction and then by relation type, into one box that names the count and the relation and links to the Spec page's relations, until the drawing fits.",
          "A member or realization diagram over the bound writes no SVG; its text equivalent lists every member or unit and every use or realization edge, and then says the drawing was omitted because it exceeds the bound.",
          "Every reading a fill, outline or line style marks is also in words: bands and columns carry labels, a planned component reads `planned`, a folded box reads `folded`, and an aggregated edge's count is in its text.",
          "Each diagram is followed by its text equivalent, which states every box with its words and every edge as a sentence naming its two ends and its kind, and the SVG names it as its description.",
          "The diagram element adds only pan, zoom and pinch, by rewriting the SVG's view box; it never moves a box or an edge, and without script the drawing shows at its own size inside a box that scrolls.",
        ],
        ruleKeys: {
          buildTime: "rules[0]",
          layoutInputs: "rules[1]",
          sameBytes: "rules[2]",
          architectureGrid: "rules[3]",
          aggregatedUses: "rules[4]",
          relationBands: "rules[5]",
          memberBands: "rules[6]",
          realizationBands: "rules[7]",
          bound: "rules[8]",
          foldByContext: "rules[9]",
          foldByLayer: "rules[10]",
          boundFallback: "rules[11]",
          foldGroups: "rules[12]",
          noFoldBelowComponent: "rules[13]",
          wordsBesideStyle: "rules[14]",
          textEquivalent: "rules[15]",
          panZoomOnly: "rules[16]",
        },
        exampleSpace: {
          given: [
            "an architecture of {components:number} components spread over {contexts:number} contexts and {layers:number} layers, with {edges:number} uses edges between components",
          ],
          when: ["the build lays the architecture diagram out twice"],
          then: [
            "the two drawings are byte-identical: {identical:boolean}",
            'the diagram folds by {fold:"nothing"|"context"|"layer"}',
            "the first drawing holds {drawn:number} boxes",
            "its text equivalent names {named:number} boxes and edges",
          ],
        },
      },
      design: {
        bound:
          "`40` boxes and `100` edges per diagram, counting every box a drawing holds, folded and planned boxes included, and every edge it draws.",
        labelMetrics:
          "a label line holds at most `30` characters, an id longer than that wraps after a dot or a colon and then after a hyphen, a character advances `7.5` pixels at the 12 pixel monospace label size, and a box is as wide as its longest line plus padding.",
        cellWrap:
          "a grid cell or a band places at most `6` boxes on one line and wraps onto the next.",
        edgeKinds:
          "`uses` for a realized use, drawn solid; `plans to use` for a use a component design states, drawn dashed; on a trace graph the relation's type; an arrow points from the unit or Spec that uses or declares to the one it names.",
        svgMarkup:
          'the `svg` carries `role="img"`, a `title`, `aria-describedby` naming its text equivalent and a `viewBox` of its own size; a box is a `g` with class `node` and `data-id`, plus `data-planned="true"` or `data-folded="true"` when it is planned or folded, holding a link to the box\'s target; an edge is a `g` with class `edge`, `data-from`, `data-to` and `data-kind`; a band is a `g` with class `band` and `data-label`, a column a `g` with class `lane` and `data-label`, each also drawing its label as text.',
        boxTargets:
          "a component's box links to its detail on the architecture lens, a planned component's to its component design's Spec page, a context's or layer's folded box to its section on the same page, a Spec's to its page, and a folded relation group's to the Spec page's relations.",
        textEquivalent:
          "a `details` element closed by default, summary `The diagram as text`, holding one `li` per box, `<id>: <words>`, and then one `li` per edge, `<from> <kind> <to>`, followed by `(<n> unit edges)` when the edge aggregates more than one.",
        diagramElement:
          "`sdp-diagram` with `subject`, the Spec, Pack, component or context id the diagram is rooted at, or `architecture`, wrapping one `figure` that holds the caption, the SVG and its text equivalent; on upgrade it adds `Zoom in`, `Zoom out` and `Reset` buttons and handles drag, a wheel turned with Control or Command held, and a two-finger pinch.",
        elementIds:
          "a diagram's text equivalent has the id `diagram.<subject>.text`, unique on its page because a page draws one diagram per subject.",
        omittedDrawing:
          "a drawing over the bound keeps its `figure` and caption, holds the sentence `Shown as text: this drawing exceeds the bound of <b> boxes and <e> edges.`, with the bound's two numbers, where the SVG would be, and writes its text equivalent open.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.diagrams.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.diagrams.within-bound",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "An architecture within the bound draws in one diagram, the same bytes twice",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the grid, the text equivalent and determinism on an architecture that fits one drawing.",
        assumptions: [
          "The world builds the layout's input directly: the components are named `component:probe.c01` and on, assigned in turn to the first contexts in code-unit order and the first layers in the closed order, and the uses edges join distinct component pairs taken in id order until the count is reached. It lays the input out twice through the engine's layout and compares the two SVG strings.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "an architecture of {components: 12} components spread over {contexts: 3} contexts and {layers: 4} layers, with {edges: 20} uses edges between components",
            ],
            when: ["the build lays the architecture diagram out twice"],
            then: [
              "the two drawings are byte-identical: {identical: true}",
              'the diagram folds by {fold: "nothing"}',
              "the first drawing holds {drawn: 12} boxes",
              "its text equivalent names {named: 32} boxes and edges",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.diagrams.within-bound.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.diagrams.folds-by-context",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "An architecture over the bound folds by context",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the fold by context on an architecture too large for one drawing whose contexts each fit.",
        assumptions: [
          "The world builds the layout's input as the within-bound example does, with no uses edge, so each of the three contexts holds fifteen components and draws in a section of its own within the bound.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "an architecture of {components: 45} components spread over {contexts: 3} contexts and {layers: 5} layers, with {edges: 0} uses edges between components",
            ],
            when: ["the build lays the architecture diagram out twice"],
            then: [
              "the two drawings are byte-identical: {identical: true}",
              'the diagram folds by {fold: "context"}',
              "the first drawing holds {drawn: 3} boxes",
              "its text equivalent names {named: 3} boxes and edges",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.diagrams.folds-by-context.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.diagrams.folds-by-layer",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "One context over the bound folds by layer",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the fold by layer on an architecture whose one context is too large for one drawing.",
        assumptions: [
          "The world builds the layout's input as the within-bound example does, with every component in one context and no uses edge, so each of the five layers holds ten components and draws in a section of its own within the bound.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "an architecture of {components: 50} components spread over {contexts: 1} contexts and {layers: 5} layers, with {edges: 0} uses edges between components",
            ],
            when: ["the build lays the architecture diagram out twice"],
            then: [
              "the two drawings are byte-identical: {identical: true}",
              'the diagram folds by {fold: "layer"}',
              "the first drawing holds {drawn: 5} boxes",
              "its text equivalent names {named: 5} boxes and edges",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.diagrams.folds-by-layer.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses.packs",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The Packs lens groups every Spec by the Packs that hold it",
    narrative:
      "A capability is read as a Pack, or as a projection over high-altitude behavior Specs that no view draws yet, so the lens groups by Pack and draws no capability tree. The index page holds it, because the Packs are where a reader of a design starts.",
    sections: {
      intent: {
        outcome:
          "Let a person reach every Spec through the Packs that hold it, each Pack's members in the order its manifest gives.",
      },
      behavior: {
        rules: [
          "The Packs lens is the index page, the page a person lands on.",
          "The Packs lens groups Specs by Pack, each Pack's members in authored order, and draws no capability tree.",
          "A Spec in no Pack is still listed, in the index's Specs section, so the lens hides no Spec.",
        ],
        ruleKeys: {
          landing: "rules[0]",
          packGrouping: "rules[1]",
          everySpec: "rules[2]",
        },
      },
      ui: {
        packsLens:
          "the index page's Packs section, one closed disclosure per Pack in id order, its summary line the Pack's title, id and member count, its body the members in authored order with their rung badges.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.lenses.packs.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses.architecture",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title:
      "The architecture lens draws components by context and layer, the planned beside the built",
    narrative:
      "The original's architecture lens drew runtime layers, ports and external systems beside components. The graph holds what the architectural annotation decision admits: a component anchor's layer and bounded context, any unit's role, membership and `uses`, and no port or external-system node. So the lens groups components by their recorded context and layer and draws membership and `uses` only. A design ahead of its code states its components in component designs, which no anchor realizes yet; the lens draws them in the same grid, marked planned, so a reader sees what is designed and not built where it will sit.",
    sections: {
      intent: {
        outcome:
          "Let a person see the components the code realizes and the components the design plans, grouped by bounded context and layer, with what each uses and what it holds.",
      },
      behavior: {
        rules: [
          "The lens draws every component the anchors realize, from recipe 17's component rows and the attributes the `componentRows` entry adds to them, grouped by its recorded context and layer as the architecture grid of `spec:consumers.spec-studio.diagrams` places it, and folds above the bound as that Spec states.",
          "The lens draws component membership, as the member count in each box, and `uses`, as edges between components, and nothing else: no port, external system, runtime layer or import the impact graph infers.",
          "Each component design no anchor realizes, a row of recipe 43's `unrealized` list, draws in the same grid by its planned context and layer as a planned box, with the uses it plans drawn dashed to the components it names, and is listed again in a `Designed, not built` section apart from the realized components; a planned use naming a component the lens draws no box for draws no edge and stays listed in its design's row.",
          "A realized component whose design differs from it lists each differing field, as recipe 43's `differing` rows give it, with its planned and realized values in its detail, and a design value recipe 43 cannot read lists in the `Designed, not built` section as unreadable.",
          "Each realized component has a detail section on the lens page whose element id is its id, which its box and every link to it from another page open: its id, label, layer, context and role; its recorded file and line as text with a copy action; its members, each with its id, label, role and recorded file and line; the components it uses and is used by, each with the count of unit edges; the Specs it and its members satisfy and reference, linked, a component design its anchor satisfies among them; and its member diagram, every value read from its recipe 17 row.",
          "A component diagram rooted at code units, the view `spec:consumers.structural-mermaid` asked for, is this lens's member diagram, and the shipped Mermaid root draws none.",
          "A `memberOf` target the graph holds no component for, and a `uses` edge an end of which resolves to no component, list in an `Unresolved structure` section as recipe 17 reports them, never dropped.",
          "The page opens with sentences the build counts from the two recipes' answers: the components realized and planned, the contexts and layers they state, the uses edges between components, and the designs that differ from their components.",
        ],
        ruleKeys: {
          contextAndLayer: "rules[0]",
          membershipAndUses: "rules[1]",
          plannedApart: "rules[2]",
          differences: "rules[3]",
          componentDetail: "rules[4]",
          codeRootedHere: "rules[5]",
          unresolvedStructure: "rules[6]",
          lensSummary: "rules[7]",
        },
        exampleSpace: {
          given: [
            'component anchors that realize {realized:number} components in the context {context:string} and the layer {layer:"edge"|"application"|"domain"|"adapter"|"infrastructure"}',
            "component designs that plan {planned:number} more components in that context and layer, which no anchor realizes",
          ],
          when: ["the build renders the architecture lens"],
          then: [
            "the context's column holds {boxes:number} component boxes in the layer's band",
            "the diagram marks {plannedBoxes:number} boxes planned",
            "the Designed, not built section lists {listed:number} component designs",
          ],
        },
      },
      design: {
        componentRows:
          "`{ label: string | null; file: string | null; line: number | null; role: string | null; layer: string | null; context: string | null; referencedSpecs: string[]; usesCounts: { component: string; edges: number }[]; usedByCounts: { component: string; edges: number }[] }`, the fields recipe 17 adds to each component row: the component's own label, file, line, role, layer and context as its CodeNode records them, each null when the node records none or no node declares the component; the Specs the component and its members reference, sorted; and, sorted by component, the count of unit `uses` edges behind each pair `usesOut` and `usedBy` name. Each member row gains `role: string | null`, and every field the recipe returns today keeps its meaning.",
      },
      ui: {
        architecturePage:
          "in order, the page title `Architecture`, the summary sentences, the architecture diagram or its fold with one section per context, the `Designed, not built` section, the component details in id order, and the `Unresolved structure` section when it has rows.",
        designedNotBuilt:
          "a table with one row per unrealized design in Spec id order: the component design's Spec, linked; the planned component's id as code; its planned context, layer and role, or `not stated`; the components it plans to use; and whether its component anchor exists without satisfying it; a design whose value recipe 43 cannot read adds a row naming the design, the key and the unreadable value.",
        componentDetail:
          "a heading with the component's id as code and its label, a line with its layer, context and role in words, its file and line with a copy action, then lists headed Members, Uses, Used by, Satisfies and References, an empty list reading None, then the member diagram.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.lenses.architecture.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses.architecture.planned-apart",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A component design no anchor realizes draws planned beside the built one",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the planned component on the architecture lens: drawn in the grid where its design places it, marked planned, and listed apart.",
        assumptions: [
          'The world writes a root with one component anchor, `component:probe.orders`, that states the context `orders` and the layer `domain`, and one component design, a Spec whose Design entries name `component:probe.payments` in the same context and layer, which no anchor realizes; it builds the page set and reads the architecture page: the boxes in the `orders` lane and the `domain` band, the boxes carrying `data-planned="true"`, and the rows of the `Designed, not built` table.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'component anchors that realize {realized: 1} components in the context {context: "orders"} and the layer {layer: "domain"}',
              "component designs that plan {planned: 1} more components in that context and layer, which no anchor realizes",
            ],
            when: ["the build renders the architecture lens"],
            then: [
              "the context's column holds {boxes: 2} component boxes in the layer's band",
              "the diagram marks {plannedBoxes: 1} boxes planned",
              "the Designed, not built section lists {listed: 1} component designs",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.lenses.architecture.planned-apart.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses.tests",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The tests lens shows how far each Spec's verification reaches",
    narrative:
      "A verifier binding states that a verifier exists, and pass and fail stay in CI, so the lens shows bindings and coverage. It shows a run result only when the build was given run records, and then as evidence from a test file, never as a verdict on a Spec.",
    sections: {
      intent: {
        outcome:
          "Let a person see, for every Spec, whether a verifier is bound, which keyed rules an example exercises, and which example-space values no example binds.",
      },
      behavior: {
        rules: [
          "The lens lists one row per Spec that is not an example, in id order: its verifier binding as present or none, with its verifiers and how many are enabled; its keyed rules with how many an enabled example exercises, from recipe 34; its unkeyed rules, counted apart because the graph cannot tell which examples exercise a rule with no key; and, when it owns an example space, its uncovered values and the examples that leave a slot unbound, from recipe 44. Each row links to the verification panel of the Spec's page.",
          "The lens shows verifier bindings and states no run result of its own; with the run records input, a row adds how many of the results recipe 45 joins from its verifiers' test files passed, failed, were skipped, pending or other, labelled as external run evidence from those files and never as a verdict on the Spec or on one verifier.",
          "Filters narrow the rows by verifier binding, by whether a keyed rule goes unexercised, by whether an example-space value goes uncovered, and by Pack, and the section says how many rows it shows; without script every row shows.",
          "The page opens with sentences the build counts from the recipes' answers: the Specs with and without a verifier binding, the keyed rules exercised and unexercised, the unkeyed rules, the example spaces with an uncovered value, and, with run records, the inputs it names.",
        ],
        ruleKeys: {
          coverageRows: "rules[0]",
          bindingsOnly: "rules[1]",
          filters: "rules[2]",
          testsSummary: "rules[3]",
        },
        exampleSpace: {
          given: [
            "a Spec with {keyed:number} keyed rules and {unkeyed:number} unkeyed rules",
            "an example bound to a test anchor that exercises {exercised:number} of those keyed rules",
          ],
          when: ["the build renders the tests lens"],
          then: [
            "the Spec's row reads {coverage:string}",
            'the Spec\'s row reads its verifier binding as {binding:"present"|"none"}',
          ],
        },
      },
      ui: {
        testsPage:
          "in order, the page title `Tests`, the summary sentences, the filter bar, and the rows, each a line that wraps on a narrow screen.",
        coverageRow:
          "the Spec's title linked to its page's verification panel, its id as code, then as plain text: verifier binding present or none with `<n> verifiers, <m> enabled`, `<e> of <k> keyed rules exercised`, `<u> unkeyed rules`, and `<v> uncovered values` when it owns an example space; with run records, `external run evidence:` and the count of each result.",
        filterBar:
          "one labelled select per filter, each listing any and the values the rows hold, and a line saying how many of all rows show.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.lenses.tests.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses.tests.coverage-row",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A Spec's row on the tests lens counts its exercised keyed rules",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute a tests-lens row: the keyed rules an enabled example exercises against those it does not, and the unkeyed rules apart.",
        assumptions: [
          "The world writes a root with one behavior Spec whose Behavior section holds two keyed rules and one unkeyed rule, and one example child that verifies it, exercising the first key, bound by a `specTest` anchor in a test file; it builds the page set and reads the Spec's row on the tests page.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a Spec with {keyed: 2} keyed rules and {unkeyed: 1} unkeyed rules",
              "an example bound to a test anchor that exercises {exercised: 1} of those keyed rules",
            ],
            when: ["the build renders the tests lens"],
            then: [
              'the Spec\'s row reads {coverage: "1 of 2 keyed rules exercised"}',
              'the Spec\'s row reads its verifier binding as {binding: "present"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.lenses.tests.coverage-row.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses.evidence",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The evidence lens names each source of runtime evidence and reads it as not tracked",
    narrative:
      "The graph derives no observation yet, and no Spec designs a source for build attestations, deployments or bills of materials, so every row of this lens reads not tracked. The lens stays in the navigation so a reader sees what is not tracked rather than assuming it is.",
    sections: {
      intent: {
        outcome:
          "Let a person see which kinds of runtime evidence the Studio could show, and that none is tracked until the graph records it.",
      },
      behavior: {
        rules: [
          "The lens lists four sources, runtime observation, build attestations, deployments and software bills of materials, and reads each as not tracked: no delivery fact records an observation, and no Spec designs a source for the other three.",
          "The lens shows no payload, measurement or state it was not given, and never says that a Spec is live, deployed or attested.",
          "CI run records are test evidence: they show in the tests lens and on the runs page when the build is given them, and never in this lens.",
        ],
        ruleKeys: {
          notTracked: "rules[0]",
          noInvention: "rules[1]",
          runsElsewhere: "rules[2]",
        },
      },
      ui: {
        evidenceList:
          "one line per source, its name, then `not tracked`, then what would bring it in: an observation the graph records against a measurable target, or a Spec that designs the source.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.lenses.evidence.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.registers",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The corpus's registers are pages a reviewer opens from a link",
    narrative:
      "A large design keeps registers, and each is a catalog recipe an agent runs. Four become pages, so a reviewer with only a link reads the same rows: the open questions and the decisions, which the owner works through; the pinned declarations, each with the source lines that cite it, which is where a reader finds the test that checks a declaration; and the design backlog, the Specs designed and not yet built, which a design ahead of its code is mostly made of. The key-family register stays a recipe: its rows depend on key prefixes a corpus chooses, the Studio takes no corpus configuration, and search already finds a coined key.",
    sections: {
      intent: {
        outcome:
          "Let a person read every open question, decision, pinned declaration and designed-but-unbuilt Spec of the corpus on one page each, linked to the entries they name.",
      },
      behavior: {
        rules: [
          "The page set holds four register pages, each rendering one catalog recipe's answer over the whole corpus: `questions.html` the open-question register, recipe 20; `decisions.html` the decision register, recipe 31; `declarations.html` the pinned declarations, recipe 24, with the entry citations of recipe 51 beside them; and `backlog.html` the design backlog, recipe 33.",
          "The key-family register, recipe 41, has no page.",
          "The questions page lists the Specs with a blocking question first and then the rest, each in id order with its stated rung, and under each its questions in authored order: the blocking flag in words, the address linked to the question on the Spec page with a copy action when the question is keyed, the text, and its decider, links, provisional reading and trigger when present, a question with a trigger named a deferral.",
          "The decisions page lists one row per decision in id order: its title linked, its id, its stated rung, the decisions it supersedes and that supersede it, the decisions it refines and that refine it with the reasons its relations state, the Specs it shapes with their count, and its keyed questions linked; a superseded decision reads superseded in words.",
          "The declarations page lists the pinned declarations grouped by Spec in id order, each with its key linked to the entry on the Spec page, the declaration as code, and every source line recipe 51 records citing the entry's address, as file and line with a copy action, or `no citation recorded`.",
          "The backlog page lists recipe 33's rows in id order: the Spec linked, its kind and altitude, its floor reached, the clauses that hold it below its stated next rung, its design columns as counts, and the units that reference it; a sentence names how many examples and decisions the recipe leaves out.",
          "The questions page filters by blocking flag, decider, deferral and Pack, and the declarations page by whether a citation is recorded; without script every row shows.",
          "A register page lists and links in its recipe's order; it states no rung, verdict or priority of its own.",
          "Each register page opens with its recipe's totals as sentences, each opening with its count.",
        ],
        ruleKeys: {
          registerPages: "rules[0]",
          noKeyFamilyPage: "rules[1]",
          questionsPage: "rules[2]",
          decisionsPage: "rules[3]",
          declarationsPage: "rules[4]",
          backlogPage: "rules[5]",
          registerFilters: "rules[6]",
          statesNothing: "rules[7]",
          registerTotals: "rules[8]",
        },
        exampleSpace: {
          given: [
            "a Spec {blockingSpec:string} with a blocking open question and a Spec {otherSpec:string}, before it in id order, with only a non-blocking one",
          ],
          when: ["the build renders the questions page"],
          then: ["the page lists {first:string} first"],
        },
      },
      ui: {
        questionRow:
          "the blocking flag in words, `question.<key>` as a link with a copy action for the full address when keyed, the text, then each present field on its own labelled line, `deferral` written beside a question with a trigger.",
        decisionRow:
          "the title linked, the id as code, the rung badge, then labelled lines for Supersedes, Superseded by, Refines, Refined by, Shapes and Questions, each listing ids as links and an empty line reading None, and the reasons under the relations they belong to.",
        declarationRow:
          "the key as a link, the declaration in a code block, then `Cited at` and each citing file and line with a copy action, or `no citation recorded`.",
        backlogRow:
          "the title linked, the id as code, then as plain text the kind, altitude, floor in words, the unmet clauses by id, `<e> entries, <d> declarations, <q> open, <b> blocking`, and the referencing units by id.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.registers.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.registers.blocking-first",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "The questions page lists the Specs with a blocking question first",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the questions page's order: a Spec with a blocking question comes before one with only non-blocking questions, whatever their id order.",
        assumptions: [
          "The world writes a root with the two Specs, the first holding one blocking open question and the second one non-blocking open question, builds the page set, and reads the order of the Specs on the questions page.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a Spec {blockingSpec: "spec:probe.zeta"} with a blocking open question and a Spec {otherSpec: "spec:probe.alpha"}, before it in id order, with only a non-blocking one',
            ],
            when: ["the build renders the questions page"],
            then: ['the page lists {first: "spec:probe.zeta"} first'],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.registers.blocking-first.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.owner-queue",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The owner queue page orders the statements and questions only a person can settle",
    narrative:
      "A large design waits on one person: the statements its floor already allows and the questions only its owner decides. The readiness planner orders those statements, the ones they rest on first. This page shows that order to a reviewer with only a link, so the owner sees which statements can be made first and which questions hold the most. A rung stays a person's statement, so the page orders and links and states nothing.",
    sections: {
      intent: {
        outcome:
          "Let the owner see, in one place, every statement the floor allows in the order that holds, and every open question only the owner settles, blocking ones first.",
      },
      behavior: {
        rules: [
          "The page set holds `queue.html`, which renders recipe 46, the statement queue, over the whole corpus.",
          "The first list holds every waiting statement in the queue's order, numbered by position: the Spec linked, its kind, its stated rung, the rung its floor allows, the waiting Specs it rests on, each linked to its own row, and its Packs; a statement that rests on no waiting Spec reads `can be made now`.",
          "The second list holds the open questions whose decider is `owner`, blocking ones first, each with its address linked to the question on its Spec page, its text, its provisional reading when present, and the Specs it holds below a rung, linked.",
          "The page opens with sentences the build counts from the queue's answer: the statements waiting, how many rest on no waiting Spec and can be made now, the owner's questions blocking and not blocking, and any dependency cycle the queue names.",
          "Filters narrow both lists by Pack, and the statements by the rung their floor allows; without script every row shows.",
          "The page orders and links: it states no rung, records no statement, and never presents a waiting statement as approved or a position as a priority the owner set.",
        ],
        ruleKeys: {
          queuePage: "rules[0]",
          waitingStatements: "rules[1]",
          ownerQuestions: "rules[2]",
          queueSummary: "rules[3]",
          queueFilters: "rules[4]",
          statesNothing: "rules[5]",
        },
        exampleSpace: {
          given: [
            "a Spec {dependent:string} that waits for a statement its floor allows and rests on a Spec {dependency:string} that waits for one too",
          ],
          when: ["the build renders the owner queue page"],
          then: [
            "the queue lists {first:string} first",
            "the row of the Spec that rests on the other links it: {linked:boolean}",
          ],
        },
      },
      ui: {
        statementRow:
          "`<position>.`, the title linked, the id as code, then as plain text the kind, `stated <rung>`, `floor allows <rung>`, `rests on` and the waiting Specs as links to their rows or `can be made now`, and the Packs; the row's element id is the Spec's id.",
        ownerQuestionRow:
          "`blocking` or `non-blocking` in words, the address as a link with a copy action, the text, the provisional reading on its own labelled line, then `holds` and the held Specs as links.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.owner-queue.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.owner-queue.dependency-first",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "The owner queue lists a waiting statement after the one it rests on",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the queue's order: a waiting statement that rests on another waiting statement comes after it, whatever their id order, and links it.",
        assumptions: [
          "The world writes a root where both Specs state `scoped` while their floors allow a higher rung, and the first declares `dependsOn` on the second; it builds the page set and reads the queue's statement rows in order.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a Spec {dependent: "spec:probe.alpha"} that waits for a statement its floor allows and rests on a Spec {dependency: "spec:probe.zeta"} that waits for one too',
            ],
            when: ["the build renders the owner queue page"],
            then: [
              'the queue lists {first: "spec:probe.zeta"} first',
              "the row of the Spec that rests on the other links it: {linked: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.owner-queue.dependency-first.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.diff-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The diff page shows what changed in the design since a base graph",
    narrative:
      "Iterating on a design asks what changed since the last pass, or what a change proposal would change. Given the graph of an earlier commit, the build renders the design diff between it and the graph it built, so a reviewer reads the changed Specs, entries, relations and bindings, and each changed Spec's page says it changed.",
    sections: {
      intent: {
        outcome:
          "Let a person read, from a link, what changed in the design between a base graph the build was given and the graph it built, down to each entry.",
      },
      behavior: {
        rules: [
          "The page set holds `diff.html` only when the build was given a base graph; without one, no page, link or change note names a diff.",
          "The page opens by naming its input: the base graph, its label when the build was given one, its schema version and its Spec count beside the built graph's, and a sentence that the comparison reads the two graphs only.",
          "The page renders recipe 35's answer with `detail: true` over the whole corpus, in sections in this order: the totals as sentences; the Specs added, linked; the Specs removed, as their ids in text, since no page holds them; the Specs changed, each linked, with each changed part, its change in words, and for a changed value the base value and the built value as text, one above the other; the Packs whose membership or order changed; the bindings changed, kept apart and headed as derived from anchors; and the diagnostics.",
          "Given a base graph, each changed Spec's page adds a line under its header that names the base input and lists the Spec's changed parts, linked to its row on the diff page, and each added Spec's page says it is new since the base.",
          "Given a base graph, each Pack page adds a `Changed since the base` section after its maturity map, from recipe 35's answer for that Pack, listing its changed and added members, linked, and its own membership change.",
          "The page and the change notes state differences between two graphs and confer nothing: no approval, staleness or readiness, and no record that a design pass happened.",
        ],
        ruleKeys: {
          onlyWithBase: "rules[0]",
          namesTheBase: "rules[1]",
          diffSections: "rules[2]",
          specChangeNotes: "rules[3]",
          packChangeNotes: "rules[4]",
          confersNothing: "rules[5]",
        },
        exampleSpace: {
          given: [
            "a base graph in which the Design entry {key:string} of a Spec reads {before:string}",
            "the built graph in which that entry reads {after:string}",
          ],
          when: ["the build renders the diff page"],
          then: [
            "the Spec's row shows the base value {baseShown:string} and the built value {nowShown:string}",
            "the Spec's page carries the changed-since-base line: {changeNote:boolean}",
          ],
        },
      },
      ui: {
        baseLine:
          "`Compared with the base graph <label>, schema <version>, <n> Specs; the built graph has schema <version>, <m> Specs.`, the label left out when none was given.",
        changedSpec:
          "the title linked, the id as code, then one row per part: the part as code, its change in words, and for a changed value two labelled blocks, `Base` and `Now`, holding the values as text; the block's element id is the Spec's id, which the Spec page's change note links to.",
        bindingRow:
          "the Spec linked, then for implementing units, referencing units, enabled verifiers and delivery facts the ids added and removed, under the heading `Bindings, derived from anchors`.",
        changeNote:
          "`Changed since the base graph <label>:` and the changed parts as code, linked to the Spec's row on the diff page.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.diff-page.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.diff-page.changed-entry",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "The diff page shows a changed entry's base and built values",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the diff page on one changed Design entry: both values side by side, and the change note on the Spec's page.",
        assumptions: [
          "The world writes a root with one Spec whose Design entry `limit` reads `ten items`, writes its graph with `sdp build` and keeps it outside the root as the base, changes the entry to `twenty items`, builds the page set with the base, and reads the Spec's row on the diff page and the line under the Spec page's header.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a base graph in which the Design entry {key: "limit"} of a Spec reads {before: "ten items"}',
              'the built graph in which that entry reads {after: "twenty items"}',
            ],
            when: ["the build renders the diff page"],
            then: [
              'the Spec\'s row shows the base value {baseShown: "ten items"} and the built value {nowShown: "twenty items"}',
              "the Spec's page carries the changed-since-base line: {changeNote: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.diff-page.changed-entry.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.glossary-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The glossary page lists every term the corpus's Specs define",
    narrative:
      "A Spec's Model section defines terms, and a term may carry a key that gives it an address. The glossary page gathers every defined term on one page so a reviewer finds a word and the Spec that defines it. A corpus's ratified glossary stays the document it is; the page lists what the Specs define, so two definitions of one word read side by side.",
    sections: {
      intent: {
        outcome:
          "Let a person find any term a Spec defines, read its definition, and open the Spec and the entry that define it.",
      },
      behavior: {
        rules: [
          "The page set holds `glossary.html`, which lists every term a Spec's Model section defines, sorted by the term's lowercase form in code-unit order and then by Spec id, each with its definition as text, its Spec linked, and, when the term carries a key, its address `spec:<id>#term.<key>` with a copy action, linked to the term on the Spec page; the term and its definition split as `spec:carrier.markdown-body-grammar#rule.modelEntries` states.",
          "A word two Specs define appears once per Spec, so the definitions read side by side and the page chooses none.",
          "The page renders no glossary document: it lists the terms the graph holds and nothing else.",
          "The page opens with the count of terms and of defining Specs in one sentence and the letters its terms start with, each linked to the heading over its terms.",
        ],
        ruleKeys: {
          terms: "rules[0]",
          sameWordTwice: "rules[1]",
          noGlossaryDocument: "rules[2]",
          letterIndex: "rules[3]",
        },
        exampleSpace: {
          given: [
            "two Specs whose Model sections define the term {term:string}, the first with the key {key:string}",
          ],
          when: ["the build renders the glossary page"],
          then: [
            "the page lists the term {rows:number} times",
            "the keyed row shows the address {address:string}",
          ],
        },
      },
      ui: {
        letterHeading:
          "one heading per first letter, lowercased, with the element id `letter.<letter>`, over the terms that start with it; a term that starts with no letter sits under the heading `#` with the element id `letter.other`.",
        termRow:
          "the term in bold, its definition as text with inline code spans as code, then the Spec's title linked and, when keyed, `term.<key>` as a link with a copy action for the full address.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/consumers/spec-studio.glossary-page.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.glossary-page.same-word-twice",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A word two Specs define appears once per Spec on the glossary page",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the glossary on one word two Specs define: both definitions listed, and the keyed one with its address.",
        assumptions: [
          "The world writes a root with two Specs under the probe namespace, `alpha` and `beta`, each defining `order` in its Model section, the first with an authored key; it builds the page set and reads the glossary page's rows for the term.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'two Specs whose Model sections define the term {term: "order"}, the first with the key {key: "order"}',
            ],
            when: ["the build renders the glossary page"],
            then: [
              "the page lists the term {rows: 2} times",
              'the keyed row shows the address {address: "spec:probe.alpha#term.order"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.glossary-page.same-word-twice.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.runs-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "The runs page shows the run records the build was given, joined to test files",
    narrative:
      "CI keeps the results of its test runs; the graph records only that a verifier is bound. Given run records in the Common Test Report Format, the build shows each run and the test files it joins, so a reviewer reads what ran where the verifiers are anchored. A result is evidence from a file, never the verdict of one verifier, and never a delivery fact.",
    sections: {
      intent: {
        outcome:
          "Let a person read, from a link, the test runs the build was given, which anchored test files each joins, and which records join none, each labelled as external evidence.",
      },
      behavior: {
        rules: [
          "The page set holds `runs.html` only when the build was given run records; without them, no page, link or row names a run.",
          "The page names each run by its position among the inputs and its own fields: its tool and version, its build name and number, its branch, its commit, and its start and stop times as recorded, a field the record lacks reading `not recorded`.",
          "Every place a run shows, on this page, in the tests lens and on a Spec page, says in words that it is external run evidence from a test file, and none says that a Spec or a verifier passed.",
          "For each run the page shows how many of its tests passed, failed, were skipped, pending or other, in words, then each test file it joins, with the test anchors in that file, the Specs they verify, linked, and each test's name, suite, result in words and duration, then the records that join no test anchor, each with its reason, no file path or no test anchor in that file.",
          "Each run shows its commit, and the page never says a run is fresh or stale; a stamp present beside the page set names the corpus commit the publishing step recorded, so a reader compares the two.",
          "An input recipe 45 cannot read as a run record shows with its problem, and the other inputs still show.",
          "Given run records, the sentence over a Pack page's members with no verifier binding also says that the runs page, the tests lens and the Spec pages of the Specs their files verify show the run records as external evidence from test files; it never says that no page shows a run result.",
        ],
        ruleKeys: {
          onlyWithRuns: "rules[0]",
          namesEachRun: "rules[1]",
          externalEvidence: "rules[2]",
          runSections: "rules[3]",
          commitShown: "rules[4]",
          diagnosticsShown: "rules[5]",
          packPageSentence: "rules[6]",
        },
        exampleSpace: {
          given: [
            "one CTRF report whose tool is {tool:string} at version {version:string}, and whose tests in an anchored test file {passed:number} passed and {failed:number} failed",
          ],
          when: ["the build renders the runs page"],
          then: [
            "the run's heading reads {heading:string}",
            "the page lists {rows:number} results under that test file",
            "a page says that a Spec or a verifier passed: {verdict:boolean}",
          ],
        },
      },
      ui: {
        runHeader:
          "`Run <n>: external run evidence from <tool> <version>`, `<n>` the input's position counting from 1 and the version left out when the record names none, then a line with the build, branch, commit and times, each labelled, a time written as an ISO 8601 UTC time from the milliseconds the record holds.",
        fileRow:
          "the file as text with a copy action, the anchors in it as code, the Specs they verify as links, then a table of results with columns name, suite, result and duration.",
        unjoinedRow:
          "the test's name, its file path or `no file path`, its result in words, and the reason.",
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.runs-page.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.runs-page.external-evidence",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "The runs page shows a run as external evidence from a test file",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the runs page on one report: the run named by its tool, its results under the test file they join, and no page saying a Spec or a verifier passed.",
        assumptions: [
          "The world writes a root with one Spec and one test file holding a `specTest` anchor that verifies it, writes one CTRF report whose three tests name that file, two passed and one failed, builds the page set with the report as run records, and reads the runs page, then the tests lens and the Spec page for any sentence saying that the Spec or the verifier passed.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'one CTRF report whose tool is {tool: "vitest"} at version {version: "3.2.4"}, and whose tests in an anchored test file {passed: 2} passed and {failed: 1} failed',
            ],
            when: ["the build renders the runs page"],
            then: [
              'the run\'s heading reads {heading: "Run 1: external run evidence from vitest 3.2.4"}',
              "the page lists {rows: 3} results under that test file",
              "a page says that a Spec or a verifier passed: {verdict: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.runs-page.external-evidence.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.export",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    title: "A Pack exports as one file, and every page prints as a document",
    narrative:
      "A design is sent and archived as well as browsed: attached to a message, handed to someone outside the repository, printed for a review meeting. Every build writes each Pack as one self-contained HTML file inside the page set, so a reader with only a link downloads it from the Pack page, and the file opens anywhere with nothing beside it. Every page also prints as a document.",
    sections: {
      intent: {
        outcome:
          "Let a person take a Pack's whole design away as one file that opens anywhere, and print any page as a readable document.",
      },
      behavior: {
        rules: [
          "The page set holds one export file per Pack, `exports/<name>.html`, its name formed from the Pack's id as the Pack's page name is.",
          "An export is one HTML file that loads nothing: its style is inline, it carries no script, and every diagram in it is inline SVG, so it opens from any folder or as an attachment with no other file.",
          "An export holds the Pack page's content and then each member's Spec page content in authored order, every disclosure written open; it leaves out the navigation, the rail, the search field, the stamp line, the composing panel and every control that needs the script.",
          "Inside an export, a link to the Pack or to a member points at its section in the file, a link to an element of the Pack page or of a member's page points at that element in the file, and a link to anything else becomes its id as text, so no link leaves the file.",
          "Within an export, every element id copied from the Pack page takes the prefix `pack/` and every id copied from a member's page the prefix `<Spec id>/`, while each member's section keeps its Spec id as its own id; every fragment link and every attribute that names an element id, such as `aria-describedby` or a label's `for`, is rewritten to the prefixed id, so no two elements in the file share an id.",
          "Each Pack page links its export under the header, as `Download this Pack as one file`.",
          "Every page prints as a document: the print style hides the navigation, the rail, the search field, the composing panel and every control, gives the canvas the page's width, prints a diagram whole at that width, and prints every disclosure open, the expander opening each before printing and restoring it after.",
          "An export is a function of the graph like every page: the same graph writes the same bytes, and an export holds no time, commit or stamp.",
        ],
        ruleKeys: {
          exportPerPack: "rules[0]",
          selfContained: "rules[1]",
          exportContent: "rules[2]",
          exportLinks: "rules[3]",
          uniqueExportIds: "rules[4]",
          exportFromPackPage: "rules[5]",
          printAsDocument: "rules[6]",
          exportBytes: "rules[7]",
        },
        exampleSpace: {
          given: [
            "a Pack of {members:number} member Specs, one of which names a Spec outside the Pack",
          ],
          when: ["the build writes the Pack's export file"],
          then: [
            "the export loads {loads:number} other files",
            "the export holds {scripts:number} script elements",
            "every link in the export points inside it or is text: {linksInside:boolean}",
            "no two elements in the export share an id: {idsUnique:boolean}",
            "the export holds {sections:number} member sections",
          ],
        },
      },
      design: {
        exportIds:
          "a copied id is written `pack/<id>` for the Pack page and `<Spec id>/<id>` for a member's page, so a member's `section.behavior` becomes its Spec id, a slash and `section.behavior`; the slash appears in no graph id, so a prefixed id never equals a member's section id or another prefixed id.",
        expanderPrint:
          "`sdp-expander`, before the page prints, opens every `details` inside it, and after printing restores each one's state.",
      },
      ui: {
        exportTitle:
          "the export opens with the Pack's title, its id, and the line `Exported from the Spec Studio`, with no date or commit.",
        exportLink:
          "under the Pack page's header, a link reading `Download this Pack as one file`, with the `download` attribute naming the file.",
        memberSection:
          "each member's section has its Spec id as its element id and opens with the member's position, title and id.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.export.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.export.self-contained",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "A Pack's export opens alone and keeps its links inside it",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the export's self-containment on a Pack whose member names a Spec outside it.",
        assumptions: [
          "The world writes a root with one Pack of three member Specs and one further Spec outside the Pack that the first member names through `dependsOn`, builds the page set, and reads the one export file: it counts the `link`, `img`, `iframe` and `script` elements with a `src` or `href` reaching another file, the `script` elements of any kind, and the member sections, checks that every `a` element's `href` is a fragment the file holds, and collects every element id in the file to check that none repeats.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a Pack of {members: 3} member Specs, one of which names a Spec outside the Pack",
            ],
            when: ["the build writes the Pack's export file"],
            then: [
              "the export loads {loads: 0} other files",
              "the export holds {scripts: 0} script elements",
              "every link in the export points inside it or is text: {linksInside: true}",
              "no two elements in the export share an id: {idsUnique: true}",
              "the export holds {sections: 3} member sections",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.export.self-contained.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.intent-panel.refresh-keeps-intents",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    title: "Refreshing a tab keeps every gathered intent",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the panel's persistence across a refresh of the tab.",
        assumptions: [
          "The world runs the composing panel's element module under Node with a storage object standing in for the browser's local storage, gathers the intents through the panel's own gather call, then creates a fresh panel over the same storage and page root, as a refreshed tab would, and counts the intents it shows.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ["the composing panel holds {gathered: 3} gathered intents"],
            when: ["the person refreshes the tab"],
            then: ["the composing panel holds {kept: 3} gathered intents"],
          },
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.intent-panel.refresh-keeps-intents.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.sharing.stamp-written-apart",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "The stamp is written beside the page set, and a later build removes it",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the stamp step apart from the build: it touches no page, and no stamp outlives its build.",
        assumptions: [
          "The world writes a root with one Pack of two member Specs, runs the studio command, keeps the bytes of every page file, runs the stamp command, reads `stamp.json` and compares the page files with the kept bytes, then runs the studio command again and checks whether `stamp.json` exists.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ["a page set the studio command wrote at an extraction root"],
            when: [
              'the stamp command runs with the commit {commit: "0123abc"} and the source template {source: "https://example.test/blob/0123abc/{file}#L{line}"}',
            ],
            then: [
              'the stamp names the corpus commit {corpusCommit: "0123abc"}',
              "every page file stays byte-identical: {pagesUntouched: true}",
              "a later studio run keeps the stamp: {stampSurvives: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/spec-studio.sharing.stamp-written-apart.sdp.md",
  },
  {
    id: "spec:consumers.agent-surface.example-space-coverage.uncovered-literal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A literal no example binds is reported uncovered, and an unbound child is named",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute per-value coverage on a closed union with one covered, two uncovered values and one child that binds nothing.",
        assumptions: [
          "The world writes a parent Spec whose example space declares the slot as a closed union of the literals the declared value lists, separated by `|`, and one example child per entry of the bound value, separated by `; `, each child refining and verifying the parent and binding that literal, or binding no value where the entry is `none`; it runs recipe 44's shipped body with the parent as `spec` and joins the uncovered values and the unbound children's ids with `, `. The parent's id ends in `probe.parent`, and each child's id is the parent's followed by `.c1`, `.c2` and on, in order.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'an example space that declares the slot {slot: "availability"} as {declared: "in stock|out of stock|backordered"}',
              'its example children bind {bound: "in stock; in stock; none"}',
            ],
            when: ["recipe 44 reports the space's coverage"],
            then: [
              "the slot is enumerable: {enumerable: true}",
              'the values no example binds are {uncovered: "out of stock, backordered"}',
              'the examples that leave the slot unbound are {unbound: "spec:probe.parent.c3"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/agent-surface.example-space-coverage.uncovered-literal.sdp.md",
  },
  {
    id: "spec:consumers.agent-surface.example-space-coverage.number-not-enumerable",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A number slot is not enumerable and reports no uncovered value",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the not-enumerable answer on a number slot, which reports the values bound and never a missing one.",
        assumptions: [
          "The world writes the parent and children as the uncovered-literal example does, with the slot declared as `number` and each child binding the number its entry names; it runs recipe 44's shipped body with the parent as `spec`, reads the slot's row, and checks that the validation report and the parent's readiness are the same before and after.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'an example space that declares the slot {slot: "quantity"} as {declared: "number"}',
              'its example children bind {bound: "2; 5"}',
            ],
            when: ["recipe 44 reports the space's coverage"],
            then: [
              "the slot is enumerable: {enumerable: false}",
              'the values no example binds are {uncovered: ""}',
              'the examples that leave the slot unbound are {unbound: ""}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/consumers/agent-surface.example-space-coverage.number-not-enumerable.sdp.md",
  },
] as const;
