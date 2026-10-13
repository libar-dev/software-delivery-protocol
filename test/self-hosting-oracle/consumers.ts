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
          "Before extraction, the shared build removes `generated/design-review/`, `generated/census/`, `generated/mermaid/` and `generated/gherkin/`, each with its temporary sibling, so a run that fails before rendering leaves no view behind; a removal failure refuses the build before extraction. Every command that enters this build, including validate and its watch runs and the four publishers, has this invalidation effect, so a sibling root the command does not publish stays absent until a later publication.",
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
    readiness: "scoped",
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
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.impact-graph",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
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
    deliveryFacts: [],
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
    readiness: "defined",
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
          'The mention audit takes a list of mentioning Spec ids, with an empty list selecting the whole corpus. It reports target Spec pairs and unresolved token pairs, keeping every location in `at` as section and entry. Unresolved rows carry `reason: "spec" | "entry" | "malformed"` for an absent Spec; an absent own key of that `design` or `ui` section, `description` there, a question key no open question carries, or a rule key no rule or flow carries; or a refused token. Pairs with no declared relation in either direction, and pairs backed only by a declared relation from the target are separate lists. The audit accepts `params.intended` rows of `from`, `to` and `reason`: `intended` holds the matching unbacked pairs with their reasons, `unbacked` holds the remaining unbacked pairs, and `staleIntended` holds supplied rows that match no unbacked pair in the selected scope. The validator reads no intended list, so its warnings stand.',
          "Entry search matches whole tokens and answers with the Spec, the section, and the matching entry's key or text, plus `address: string | null`, where concept search names the node and the fields it matched, never the entry.",
          "Entry search gives an entry its address when one exists: `spec:<id>#<section>.<key>` for a `design` or `ui` key matching `^[a-z][A-Za-z0-9]*$` other than `description`, `spec:<id>#question.<key>` for the text of an open question that carries a key, and `spec:<id>#rule.<key>` for a keyed rule or flow; every other entry has `address: null`.",
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
      "A dependency cycle is data about the authored dependencies. The readiness floor reads each dependency target's stated rung without walking a chain.",
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
          "Address resolution follows the checked-mentions address grammar: a `design` or `ui` key resolves as an own key other than `description`, a `question` key resolves when an open question carries it, and a `rule` key resolves through `behavior.ruleKeys` to its rule or flow text; totals count inputs, resolving rows and each miss reason.",
          "Dependency cycles take no parameter and read the whole graph. They report every set of two or more Specs in which each Spec reaches every other through declared `dependsOn` edges, and every Spec that declares `dependsOn` on itself and belongs to no such set. An edge whose target is not a Spec in the graph is ignored.",
          "Each reported set lists its members sorted by id in code-unit order and one cycle through it as a closed path that starts and ends at its first member. The cycle is the shortest such path, found by a breadth-first walk from the first member over targets in code-unit order and restricted to the set; a Spec that depends only on itself reports the path of that Spec twice. Sets are ordered by their first member, and the totals count the sets, the self-dependent Specs, and the Specs in any set.",
          "Both recipes report their answers and never refuse an authored dependency cycle.",
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
    readiness: "defined",
    title:
      "The Studio's custom elements each render one view in pages that load their script and supply graph data",
    narrative:
      "The original's harness element has no subject in the graph, which holds example spaces, bound points and oracle bindings but no harness node, so its successor takes the Spec that owns an example space. No diagram renderer is chosen yet: the design that adds the first diagram names one within the custom-elements decision.",
    sections: {
      intent: {
        outcome:
          "Give the Studio a small set of custom elements that each render one view of the graph for a Studio page or an HTML report that can load the element script and supply its graph data.",
      },
      behavior: {
        rules: [
          "Each element is self-contained and light on dependencies, and works in an HTML page that can load its script and supply its graph data.",
          "An element that renders a view of the graph reads the one data object its page sets, as `spec:consumers.spec-studio.data` states. An element with a graph subject takes that subject's graph id in an attribute named by its Design entry; an element over accumulated intents has no single graph subject.",
          "Every element's name starts with `sdp-`.",
          "A diagram is drawn by a renderer that runs as a custom element under `spec:decisions.studio-web-components`, or by a framework runtime that a decision refining it admits; the design that adds the first diagram names the renderer and the bound on what one diagram draws.",
        ],
        ruleKeys: {
          diagramRenderer: "rules[3]",
        },
      },
      design: {
        description: "The elements in the original's order, with their attributes.",
        specCard:
          "`sdp-spec-card` with `spec-id`, `variant` and `readiness-pill`: one Spec as a card, in full or short form, with its readiness pill shown or hidden.",
        traceGraph:
          "`sdp-trace-graph` with `spec-id`, `depth` and `highlight`: the Spec's relations drawn as SVG to the given depth, highlighting what `highlight` names, such as Specs with no verifier binding.",
        maturityMap:
          "`sdp-maturity-map` with `pack-id` and `group-by`: a Pack's members by readiness, grouped by the named field of the member values, such as kind or stated rung.",
        exampleSpace:
          "`sdp-example-space` with `spec-id`, naming the Spec that owns the example space: the space's dimensions, its children's bound points and its expected-outcome oracle binding; its coverage is a report, never a verifier run or a delivery fact.",
        diagramView:
          "a diagram element whose name and subject attribute the design that adds it names, under the diagram-renderer rule.",
        scenarioEditor:
          "`sdp-scenario-editor` with `spec-id` and `mode`: a given, when and then editor for one example, which in `propose` mode composes intent for a new one.",
        impactView: "`sdp-impact-view` with `spec-id`: a Spec's impact panel on its own.",
        intentPanel:
          "`sdp-intent-panel` with no graph-subject attribute, rendering the gathered intents across their scopes.",
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
          "The build renders the index from `specs()`, `packs()`, `findings()` and each Spec's design columns, a Pack page from `packContext` and the Pack totals, a Spec page from `specContext`, and the search page from the search index; every page's rail renders the rail values. A page states no value the reader did not return, apart from counts the build takes of those values.",
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
    id: "spec:consumers.spec-studio.intent-panel",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    title: "A composing panel on every page gathers scoped intent for an agent",
    narrative:
      "The change-proposal contract requires the commit whose graph the person read, and a generated page set carries no commit, so a proposal's base comes from the build stamp when one is present and from the person otherwise.",
    sections: {
      intent: {
        outcome:
          "Let a person gather the changes they want while they read, each bounded by a Spec, its neighbors, a Pack or one open question, and hand them to an agent that edits source.",
      },
      behavior: {
        rules: [
          "The composing panel is visible on every page.",
          "The panel writes no source; its hand-off follows `spec:consumers.intent-composition`.",
          "A person gathers intents across pages before handing them off.",
          "Gathered intents persist in the browser's local storage, so refreshing a tab on a phone loses none.",
          "A composed intent names its scope by id or entry address, so the agent that receives it reads the same Spec, Pack, entry or question through the graph.",
          "The panel hands its gathered intents off as one change proposal, on the change-proposal contract, which the person copies as text or saves as a document. The page opens no pull request, because a static page holds no credentials; any pull request comes from the agent's ordinary source edit.",
          "A proposal's base is the commit a present build stamp names, otherwise one the person supplies, and the person gives one reason for the whole proposal; without a base and a reason the panel exports its intents as scoped-intent text, and the agent that receives them writes the proposal against a commit it knows.",
          "A request scoped to a Pack expands at hand-off to the member Spec ids that Pack holds at the proposal's base; a request that changes a Pack's membership or framing, or names an empty Pack, stays scoped-intent text, so the change-proposal contract keeps its Spec and entry scopes.",
        ],
        exampleSpace: {
          given: ["the composing panel holds {gathered:number} gathered intents"],
          when: ["the person refreshes the tab"],
          then: ["the composing panel holds {kept:number} gathered intents"],
        },
        ruleKeys: {
          proposalBase: "rules[6]",
          packScope: "rules[7]",
        },
      },
      ui: {
        gatheredIntents:
          "the intents gathered so far, headed with their count, each on one line naming its scope and the change it asks for, such as adding an example or changing a constraint's target.",
        panelActions: "discard, copy the proposal as text, and save the proposal as a document.",
        composingActions:
          "the actions on other panels that compose intent: resolve an open question or promote it to a decision record, propose or edit an example, propose or adjust a constraint target, and propose examples for missing slot values.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.intent-panel.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.lenses",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    title: "Four lenses read the graph as Packs, architecture, tests and evidence",
    narrative:
      "A capability is read as a Pack, or as a projection over high-altitude behavior Specs that no view draws yet, so the Packs lens groups by Pack and draws no capability tree. A verifier binding states that a verifier exists, and pass and fail stay in CI, so the tests lens shows bindings and no run result.",
    sections: {
      intent: {
        outcome:
          "Let a person see the graph four ways, by Pack, by architecture, by verification and by evidence, from one top navigation.",
        openQuestions: [
          {
            question:
              "The original's architecture lens draws runtime layers, ports and external systems beside components and their dependencies; `spec:decisions.architectural-annotation` gives a component anchor a layer and a bounded context and any code anchor a role, beside component membership and `uses`, and admits no port or external-system node. Does the lens group components by layer and context and draw only what those anchors hold?",
            blocking: false,
            key: "architectureVocabulary",
            links: ["spec:consumers.structural-mermaid#question.layerAndContext"],
            decider: "owner",
            provisional:
              "the lens groups components by their recorded layer and context and draws only component membership and `uses` edges, with no port or external-system node",
          },
        ],
      },
      behavior: {
        rules: [
          "The Packs lens is the default landing page.",
          "The Packs lens groups Specs by Pack and draws no capability tree.",
          "Clicking a component in the architecture lens opens its detail.",
          "The tests lens shows verifier bindings and no run result; run records join it only through `spec:observation.run-evidence`, under an input and reproducibility ruling of their own.",
          "The evidence lens is read-only.",
        ],
        ruleKeys: {
          packGrouping: "rules[1]",
          bindingsOnly: "rules[3]",
        },
      },
      ui: {
        description: "The lenses in the order of the top navigation.",
        packsLens:
          "a Spec-by-Spec tree grouped by Pack, with each Pack's members in authored order, which the index page holds.",
        architectureLens:
          "the graph drawn as components and their dependencies, from component membership and `uses` edges, in an embedded interactive diagram whose renderer follows `spec:consumers.spec-studio.components#rule.diagramRenderer`.",
        testsLens:
          "a coverage view: for each Spec, its verifiers with their bindings, then each keyed rule with the examples recipe 34 reports as exercising it, with the unkeyed rules counted apart, because the graph cannot tell which examples exercise a rule with no key.",
        evidenceLens:
          "the graph-recorded evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states; while the graph records no observation or other evidence, each reads not tracked.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.lenses.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio.responsive",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    title: "The Studio reads on a phone as on a desktop",
    narrative:
      "The curated graph's edges carry no confidence, and the impact graph's inferred imports stay outside it, so a compact diagram shortens by distance alone.",
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
        pinchZoom: "on a touch device, every diagram zooms with a pinch.",
        summaryMode:
          "a compact diagram presentation for narrow screens that drops relations past one hop and assigns no confidence to an edge.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.responsive.sdp.md",
  },
  {
    id: "spec:consumers.spec-studio",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
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
          "The Studio is a static page set: an index page, a search page, and one page per Pack and per Spec, with their local assets. Its build renders each page whole, so a page needs no server, and every page but the search page reads without its script, which adds filtering, search and copying.",
          "The Studio works offline: the same files open from the file system through `file://` for local use and from any static host for sharing.",
          "The Studio is reproducible: one graph renders byte-identical files, and an asset whose filename embeds a hash of its content gets the same name from the same graph.",
          "The Studio is read-rich: everything the graph holds about a Spec or a Pack is explorable in it.",
          "The Studio is write-careful: it writes nothing to canonical source, and a change a person wants leaves it as scoped intent for an agent, as `spec:consumers.edit-model` states.",
          "The Studio never builds a second graph: every join, claim, delivery fact, derived readiness, floor failure and finding it shows is a value the reader computed when the Studio was built, and the page computes none of them again.",
          "A page shows a catalog recipe's answer only when the Studio's design names that recipe, and the build composes the answer over the graph it derived; the page recomputes none of it.",
          "The Studio stands beside the shipped Design Review, census, Mermaid and Gherkin projections and re-specifies none of them, which `spec:decisions.shipped-projections-frozen` keeps as they are.",
        ],
        ruleKeys: {
          staticPageSet: "rules[2]",
          noSecondGraph: "rules[7]",
          recipeAnswers: "rules[8]",
        },
      },
      verification: {
        mode: "manual",
        criteria: [
          "The Studio's first build is accepted when a person completes, from the Studio's page set and the files it links to, the five tasks the first adopter set over its history-view Pack (`libar-platform/docs/feedback/sdp-feedback-01.md`): find the history contract, locate OD-157, explain the aggregate dependency, find one declaration's type comparison, and say whether a paused-rebuild example has native-backend evidence. The first build reads no run evidence, so the last task passes when the person finds that the example requires the native backend tier, reads whether a verifier is bound to it, and reports that no run result is supplied.",
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
    readiness: "defined",
    title: "A Studio build is stamped and shared from a static host",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a stakeholder open the Studio of a pull request from a link, and let its author know which graph and which build the stakeholder read.",
      },
      behavior: {
        rules: [
          "A build is shared by uploading its page set to a static host, such as S3, Vercel or GitHub Pages.",
          "Each pull request can publish its Studio as a preview.",
          "A stakeholder opens the link, navigates the Studio and composes intent, and the pull request's author hands that intent to an agent that edits the source.",
          "The Studio's build writes no stamp, so every page and data file it writes stays a function of the graph alone. The publishing step that uploads a build writes one stamp file beside the page set, and the shell shows it as build context when it is present.",
          "Publishing a preview and writing its stamp are a step the adopter runs, never the Studio's build; the shell reads the stamp as `spec:consumers.spec-studio.shell#rule.stamp` states.",
        ],
        ruleKeys: {
          publishingStep: "rules[4]",
        },
      },
      design: {
        buildStamp:
          "`{ schemaVersion: string; corpusCommit: string; engine: string; builtAt: string }` in `stamp.json` beside the page set, written by the publishing step and never by the Studio's build: the graph's `schemaVersion`, the git commit the build came from or `unknown` for a local build, the engine `sdp --version` names, and the build time as an ISO 8601 UTC timestamp.",
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
          "The index, every Pack page and every Spec page read in full without their script: their collapsible parts are native disclosure elements, and only filtering, copying and the stamp need the script. The search page needs its script to match, and without it says so and links to the index.",
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
    id: "spec:consumers.spec-studio.spec-page",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    title: "A Spec page shows one Spec in collapsible panels, in a fixed order",
    narrative:
      "The original runtime panel linked Fastify routes to Effect programs, showed what Effect layers provided and required, and recorded Awilix registrations and their lifetimes, beside ports and external systems. That representation is lineage evidence in `docs/lineage/v0-design/07-spec-studio-and-projections.md`, section 2.3, Section F. The current structural anchors record identity, component membership, uses, role, and a component's architectural layer and context; the question below asks whether a later runtime panel needs more.\n\nThe page shows only what the graph holds. The original header's owner, tags and last-verified time, its schema bindings and its `UI / Stories` section have no graph value behind them, so the page shows none of them.",
    sections: {
      intent: {
        outcome:
          "Show everything the graph holds about one Spec on one page, in panels a person opens and closes one at a time.",
        openQuestions: [
          {
            question:
              "Does the runtime panel show more than the structural neighborhood of the Spec's implementation anchors?",
            blocking: false,
            key: "runtimeComposition",
            decider: "owner",
            provisional:
              "the panel shows only the structural neighborhood the anchors record, until a reader asks for more of the runtime composition",
          },
        ],
      },
      behavior: {
        rules: [
          "Each panel collapses and expands on its own.",
          "The page's core, its header, sections, relations, bindings and findings, is the one `spec:consumers.spec-studio.spec-page.core` states, and the panels below add to it.",
          "Every Spec and Pack a panel names links to its page. A code unit, component or anchor shows its id and its recorded repository-relative file and line as text, with an action that copies `file:line`; the page set holds no code-unit page and writes no editor URI, absolute path or assumed source URL, source navigation waits for a source target designed for it, and a component's attributes, members and uses show in the architecture lens.",
        ],
        ruleKeys: {
          sourceText: "rules[2]",
        },
      },
      ui: {
        description: "The panels the core does not hold, in page order.",
        intentPanel: "beside each open question, an action that composes intent scoped to it.",
        behaviorPanel:
          "beside each keyed rule or flow, the examples that exercise it as recipe 34 reports, then example cards laid out as `spec:consumers.spec-studio.verification-panels` states.",
        constraintsPanel:
          "each constraint with its target, laid out as `spec:consumers.spec-studio.verification-panels` states.",
        designPanel:
          "a diagram of the components that realize the Spec, from its implementation anchors' `component` and `uses` edges, drawn as SVG whose nodes show their id, source file and line as the source-text rule states; below the design entries, the decision records the Spec names by `decidedBy`, each with its text inline.",
        runtimePanel:
          "the structural neighborhood of the Spec's implementation anchors: each anchor's component and the code units it uses, with file and line.",
        verificationPanel:
          "the verifiers and the coverage of the example space, laid out as `spec:consumers.spec-studio.verification-panels` states.",
        evidencePanel:
          "the evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states, with no invented build, deployment, measurement or SBOM data.",
        impactPanel:
          "the upstream parents and downstream children, the Specs that depend on this one, the decision records it names, the tests that verify it, and the code its bindings reach.",
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
    narrative:
      "The graph records that a verifier binding exists and never a run, and a static page runs nothing, so the panels show bindings and no run result, and offer no run of an example. No Spec designs a source for build attestations, deployments or SBOMs, so each reads not tracked.",
    sections: {
      intent: {
        outcome:
          "Show on a Spec page how far each example, constraint target and verifier goes, and what runtime evidence exists, without stating more than the graph records.",
      },
      behavior: {
        rules: [
          "An example card shows the example's verifier as a binding that exists, and the example as an Executable Spec when a test anchor binds it, never as a test that passed.",
          "A panel shows verifier bindings and no run result; run records join a panel only through `spec:observation.run-evidence`, under an input and reproducibility ruling of their own.",
          "The evidence panel shows only runtime evidence the graph records, and reads not tracked while no delivery fact records an observation.",
          "Each panel action gathers intent through the composing panel's contract.",
        ],
        ruleKeys: {
          bindingsOnly: "rules[1]",
          evidenceNotTracked: "rules[2]",
        },
      },
      ui: {
        description: "The panels' parts in page order.",
        ruleList:
          "rules and flows in authored order, each keyed entry with its rule address, recorded carrier line and the examples that exercise it as recipe 34 reports, followed by the example cards; an unrecorded line stays absent.",
        exampleCard:
          "one card per example: its title; its stated readiness and whether it is an Executable Spec; its given, when and then steps with their bound values; and actions to view its verifying test, open the example, and compose intent to edit it.",
        unwrittenExampleCard:
          "an example with no given, when and then steps yet says so, and offers to compose intent proposing them.",
        constraintTarget:
          "each constraint with its flavor and statement, its target drawn as a bar beside the number, and a measured value only when the graph records one, otherwise not tracked; moving the bar composes intent to change the target, and the new value shows on the page only while the intent waits in the composing panel.",
        unsetTarget:
          "a constraint with no quantitative target says so, and offers to compose intent proposing one.",
        verifierList:
          "each verifier with its id, its binding, and its recorded repository-relative file and line as text, as `spec:consumers.spec-studio.spec-page#rule.sourceText` states; no line is invented for a verifier the graph does not locate.",
        coverageGrid:
          "when the Spec owns an example space, the per-slot coverage `spec:consumers.agent-surface.example-space-coverage` reports, listing each literal value of each slot with the examples that bind it and listing a non-literal-union slot as not enumerable; combinations of slots join the grid only when a design pass asks for them; an action composes intent proposing examples for missing values.",
        evidencePanel:
          "runtime observation reads not tracked under the binding-language rule; build attestations, deployments and SBOMs show no payload and each reads not tracked until a Spec designs its source.",
      },
    },
    deliveryFacts: [],
    file: "specs/consumers/spec-studio.verification-panels.sdp.md",
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
          "A carrier ends in `.sdp.md`, `.sdp.gherkin` or `.sdp.ts`. The watcher ignores the directories discovery skips, the configured exclusion prefixes and every non-carrier path; a removed watched directory and an event with no filename each schedule a run because their affected carriers cannot be named.",
          "Events that arrive while a run is in progress coalesce into one pending run.",
          "Findings print as `sdp validate` prints them and the process stays alive; operator SIGINT terminates the process with exit 0 even while a rules body is active, without waiting for it. No further rules file runs or output is written after the stop.",
          "`--watch` is a validate option only and cannot combine with `--check-clean`. It re-runs on carrier edits and never on source edits, so an author re-runs validation after editing an anchor.",
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
    readiness: "defined",
    file: "specs/consumers/agent-surface.example-space-coverage.sdp.md",
    title: "Example spaces report which values their examples cover",
    narrative:
      "The original design rendered a coverage heatmap from each example space: which combinations of its typed slots an example witnesses and which none does (`docs/lineage/v0-design/04-authoring-surfaces.md` §4 and §4.1, `06-extraction-and-validation.md` §8). This Spec reports slot-value coverage; the glossary keeps witness for an example in an outcome class.",
    sections: {
      intent: {
        problem:
          "The graph carries example spaces and bound points, but no reader value or recipe reports which literal slot values example children bind.",
        outcome:
          "Report each literal slot value with the example children that bind it, and each value no child binds, before code exists.",
        openQuestions: [
          {
            question:
              "Is coverage per slot value enough, or does a design pass need the combinations of two or more slots, as the original heatmap drew them?",
            blocking: false,
            key: "combinationCoverage",
            decider: "owner",
            links: ["spec:consumers.spec-studio.verification-panels#ui.coverageGrid"],
            provisional: "the recipe reports per-slot literal-union values",
          },
          {
            question:
              "What reader field names and decoded slot and bound-point shapes, recipe parameters and result rows, eligible-example relation policy, and treatment of an unbound slot form the coverage contract?",
            blocking: false,
            key: "coverageShape",
            decider: "owner",
            links: ["spec:extraction.executable-contracts"],
            provisional:
              "the tests-lens design pass settles the decoded fields and the row shape and records them as keyed Design entries before implementation",
          },
        ],
      },
      behavior: {
        rules: [
          "The engine decodes each Spec's example space into its typed slots, and each example child's steps into its bound point, once, through the notation module that writes the space contracts, and the reader carries both on the Spec context; no recipe or projection parses slot notation a second time.",
          "Slot-value coverage is a catalog recipe over the decoded reader values, listing each literal-union value with the example children that bind it and each value no child binds.",
          "The recipe enumerates slots typed as closed unions of quoted literals. It reports every other slot type, a boolean included, as not enumerable by this recipe, never as covered or as missing a value.",
          "Slot-value coverage reports and confers nothing: it moves no readiness, records no verdict and emits no validation finding.",
        ],
      },
    },
    deliveryFacts: [],
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
      "The original design precomputed graph slices for different reading scopes and a prompt bundle for one Spec. The Protocol keeps context bundle for the reading material of one design pass, composed on demand.\n\nThe first adopter's design passes assemble the same reading material by hand: the Pack design, member questions, dependency footing, pinned declarations and carrying Spec text where the graph answer falls short. Its perspectives read the same Pack for different concerns. The agent front door composes a bundle on each invocation; the bundle is never a committed answer in the graph's name. It builds on Pack design.\n\nAt an adopter's scale a bundle is mostly structure, so its shape is compact. Each member and each example row names its carrier file once. A cut entry without an entry address keeps only its line, since its row and its place in the bundle already name it. A question, a pinned value or a member example's steps appears in one place. Pinned declarations stay whole by default, because a builder and a test author hold to them. A caller whose scope still does not fit may let the bundle cut them to their entry addresses, and then reads each one in its Spec when the pass needs it. A partial bundle stays refused, because a bundle missing members would read as the whole scope.",
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
          "When the protected content alone exceeds the budget after every permitted cut, the recipe returns a budget-exceeded result as data and no partial bundle: the requested scope, the budget, and the minimum count the protected content needs in the same unit; `sdp q` exits 0, because the result is the body's return and not a refusal.",
          "A bundle gives the file and line of an entry or a binding in place of a source excerpt, because the reader never reads source.",
          "A bundle states its scope, its budget and what it left out to stay within the budget, so a reader knows what to read in the Specs themselves.",
          "A bundle carries facts from the graph and no instructions of its own; the brief that tells an agent what to look for stays the corpus's own text.",
        ],
        ruleKeys: {
          oneCopy: "rules[6]",
          cutOrder: "rules[7]",
          declarationAddresses: "rules[8]",
        },
      },
      design: {
        bundleRecipe:
          'recipe 36, the context bundle, takes exactly one scope, `params.pack` or `params.specs`, an optional `params.members` beside `pack`, `params.budget`, 100,000 code units by default, and `params.declarations`, `"whole"` by default or `"addresses"`; a missing, doubled or unknown scope, or another `declarations` value, returns `{ diagnostics }` and no bundle.',
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
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
        openQuestions: [
          {
            question:
              "Which catalog recipe renders a proposal as the Markdown memo a person reviews, so the Studio's composing panel and an agent hand off the same text?",
            blocking: false,
            key: "memoRecipe",
            decider: "owner",
            links: ["spec:consumers.spec-studio.intent-panel"],
            provisional: "a person reviews the proposal's JSON beside the proposal check's rows",
          },
        ],
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
    readiness: "idea",
    file: "specs/consumers/structural-mermaid.sdp.md",
    title: "Mermaid diagrams can be rooted at code units",
    narrative:
      "The shipped Mermaid projection draws bounded diagrams rooted at a Spec or a Pack. A Spec-rooted diagram within the bounds includes directly bound code units and test anchors; component membership and uses are read through the census and structural recipes. A view rooted at code units could group components by their layer and context. Adding it to the shipped Mermaid root would need a decision that narrows or replaces the projection freeze. Whether it becomes a separate root or part of the Studio's architecture lens remains open.",
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
          {
            question:
              "Would a component diagram group its nodes by context and order them by layer, and would that make it the architecture view the Studio's architecture lens draws?",
            blocking: false,
            key: "layerAndContext",
            decider: "owner",
            links: ["spec:consumers.spec-studio.lenses#question.architectureVocabulary"],
            provisional:
              "the diagram folds into the Studio's architecture lens when that lens is designed, rather than becoming a Mermaid root",
          },
        ],
      },
      behavior: {},
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
    readiness: "idea",
    file: "specs/consumers/obsidian-vault.sdp.md",
    title: "An Obsidian vault lets a person iterate on designs from the one graph",
    narrative:
      "The Design Review links a Spec's relations both ways and gives keyed Pack questions a separate carrier-line link, but it offers no built-in filtering of a Pack or navigation from arbitrary prose mentions to their entries. The Spec Studio is designed for both a person who iterates on a design in the repository and a pull request reviewer who holds only a link. A linked-notes view would let a person follow relations, filter members by rung and design columns, open entries by address and see each pass's edits arrive. It is a projection of its own, not the Studio's local half: the Studio's page set serves a reader who holds a link, the vault serves a person who iterates in a notes app, and each has its own verb and root. It waits for a reader who asks for it once the Studio's page set exists.\n\nObsidian already does that for linked Markdown notes with properties: backlinks, a graph view, search, and filterable tables it calls Bases. The prototype in `explorations/obsidian-vault/` wrote notes from dumped graph and reader values, with relations and checked mentions as wikilinks, entry addresses as block links, and Bases for Pack members and standing queries. Pack members could be read as a sortable table. The prototype joined relation lists and computed flat properties itself, and its dump renamed `statedNextRungFailures` to `nextRungFailures`; those shortcuts are evidence for the product design, not the reader's contract.\n\nThe principle is a linked-notes view regenerated from the one graph; Obsidian and its Bases are the representation chosen first. Like every projection, the vault states no truth, and two builds of one graph are byte-identical, so no note names a commit or a time: a publishing step may write a stamp beside the vault, as the Studio's sharing rule does. Intent is still written only in the carriers.",
    sections: {
      intent: {
        actor:
          "A person in the repository who designs a capability in passes while an agent edits the carriers.",
        problem:
          "The Markdown Design Review offers no built-in Pack filters or navigation from arbitrary prose mentions to their entries, so a person iterating on a design still reads carrier files alongside it.",
        outcome:
          "Generate an Obsidian vault from the one graph, in which a person reads, navigates and filters the corpus and follows each pass's edits, while the carriers stay the only place intent is written.",
        risks: [
          "A notes app invites editing, and an edit to a generated note is lost at the next regeneration without reaching the carrier.",
        ],
        openQuestions: [
          {
            question:
              "Does the vault keep to the wikilinks and properties other notes tools read, or use Obsidian's Bases freely?",
            blocking: false,
            key: "otherNotesTools",
            provisional:
              "notes and links stay plain Markdown with wikilinks any such tool reads, and the Bases are Obsidian's alone",
            decider: "owner",
          },
          {
            question:
              "Which files does the generator own, how are stale generated files removed, and where do Obsidian settings and a person's intent notes live so that regeneration and build invalidation never remove them?",
            blocking: true,
            key: "regenerationScope",
            decider: "owner",
            provisional:
              "the generator owns only its generated note folders and Bases; Obsidian settings and authored intent notes sit outside that owned set, and a completed regeneration removes stale generated notes",
            trigger: "a person asks for a vault beside the Studio's static page set",
          },
        ],
      },
      behavior: {
        rules: [
          "The vault is a projection of its own, written by its own verb under `generated/obsidian-vault/`, and no part of the Studio's page set.",
        ],
        ruleKeys: {
          ownProjection: "rules[0]",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.notes",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    file: "specs/consumers/obsidian-vault.notes.sdp.md",
    title: "Every Spec, Pack, code unit and term is a note, and every relation is a link",
    narrative:
      "The prototype wrote a note for each Spec, Pack, code unit and test anchor, and for each term a Model section defines. A note carries the reader's values as flat properties, so Obsidian's tables filter on them, and the Spec's sections in authored order. Each declared relation became a wikilink in both directions with its reason, each mention in prose became a wikilink to its Spec or to its entry's block, and each keyed Design, UI, question and rule entry carried a block id named for its address. Backlinks and the graph view then show what rests on a Spec without a query.\n\nTwo findings shape the questions below. Obsidian refuses a colon in a note's name, so a note cannot be named by its id as written. And Obsidian renders a Spec id in a property as a link to an external address, because the namespace reads as a URL scheme.",
    sections: {
      intent: {
        outcome:
          "Write one note per Spec, Pack, code unit, test anchor, oracle anchor and Model term, with graph and reader values as properties and every declared relation and checked mention as a wikilink, so a person follows the graph in both directions.",
        openQuestions: [
          {
            question:
              "How is a note named, when Obsidian refuses a colon and a vault may also hold notes of another corpus?",
            blocking: true,
            key: "noteNames",
            decider: "owner",
            provisional:
              "within one corpus, preserve the full id and replace its namespace colon with a dot, as spec.model.rule-keys, pack.design-iteration-v1 and impl.protocol.reader, keeping the full id and title as aliases; filenames must remain distinct on the target filesystem, and naming across multiple corpora remains open",
          },
          {
            question: "Which reader values become properties?",
            blocking: true,
            key: "propertySet",
            decider: "owner",
            provisional:
              "kind, altitude, stated rung, floor reached, `statedNextRung` and `statedNextRungFailures` under their reader names, internal delivery-fact booleans whose rendered labels are Implementation binding and Verifier binding, each displayed as present or none under spec:consumers.binding-language-views, design columns, Pack links and the repository-relative carrier path; a Base may select where `statedNextRung` is present and `statedNextRungFailures` is empty, while semantic joins and floor computation stay with the reader",
          },
          {
            question:
              "Which property form keeps a Spec id plain text where Obsidian would render it as an external link?",
            blocking: false,
            key: "idProperty",
          },
          {
            question:
              "A term note comes only from a Model section, and no note links a term by matching words; does a term of the ratified glossary, which is not graph data, get a note too?",
            blocking: false,
            key: "termNotes",
            provisional:
              "no; a glossary term gains a note when a Spec defines it in a Model section",
          },
          {
            question:
              "Does a term defined in several Specs get one note per defining Spec and term, or one note that explicitly lists every defining Spec and its definition?",
            blocking: true,
            key: "termNoteGrain",
            decider: "owner",
            provisional:
              "one note per defining Spec and term, so each definition retains its authored owner; term-address syntax and keys remain the separate term-addresses design",
          },
          {
            question:
              "Prose mentions reach no reader value: the validator checks them and recipe 22 lists their pairs by section and entry. Which value turns a mention into a wikilink, a mention scanner the validator and the vault share, or recipe 22's rows?",
            blocking: true,
            key: "mentionSource",
            decider: "owner",
            provisional: "one mention scanner the validator and the vault share",
          },
        ],
      },
      behavior: {},
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.bases",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    file: "specs/consumers/obsidian-vault.bases.sdp.md",
    title: "A Pack's members and the standing queries are tables over the reader's values",
    narrative:
      "A Base is Obsidian's table, card or list view over notes, filtered and sorted by their properties. The prototype gave each Pack a Base of its members and the corpus one Base whose views are standing queries: the build backlog, the design backlog, the Specs waiting only for their author's statement, the Specs with blocking questions, and the decisions. In Obsidian a Pack's members read as one sortable table with implementation and verifier bindings displayed as present or none, where the Design Review's Pack page is a table too wide for its page.\n\nA view is a filter over values the generator wrote from the reader, so it agrees with the recipe it mirrors only while its predicate stays that simple. A view that would need a join waits until the reader carries the joined value.",
    sections: {
      intent: {
        outcome:
          "Give each Pack a Base of its members and the corpus a Base of standing queries, so a person filters and sorts a design by rung, floor, delivery facts and design columns.",
        openQuestions: [
          {
            question:
              "Which standing queries become views, and how is each kept equal to the recipe it mirrors?",
            blocking: true,
            key: "standingViews",
            decider: "owner",
            provisional:
              "corpus-wide views for build backlog, design backlog, Specs whose stated next rung has no failing clause, Specs with blocking questions, and decisions; tests compare the first two selections with recipes 1 and 33, the no-failing-clause selection with each Spec context's `statedNextRung` and `statedNextRungFailures`, blocking Specs with the deduplicated Spec ids in recipe 20's blocking rows, and decisions with recipe 31's ids, all over the same graph",
          },
          {
            question:
              "A Base sorts by property and keeps no authored order; how does a person read a Pack in its reading order?",
            blocking: false,
            key: "memberOrder",
            provisional: "the Pack's note lists the members in order beside the embedded Base",
          },
        ],
      },
      behavior: {},
    },
    deliveryFacts: [],
  },
  {
    id: "spec:consumers.obsidian-vault.iteration",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    file: "specs/consumers/obsidian-vault.iteration.sdp.md",
    title: "A design pass is followed and answered from the vault",
    narrative:
      "A design pass is a loop: an agent edits carriers, the graph changes, a person reads the change and answers it. In a vault the reading half is cheap, because Obsidian reloads a note when its file changes, so a vault regenerated as the carriers change shows each edit where the person is already reading. The answering half must not become a second write path. A person who edits a generated note loses the edit at the next regeneration, and the edit model refuses patches to canonical source from a view. A person composes intent beside the generated notes instead, citing entries by their block links, and an agent turns it into a change proposal that the proposal check reads before the agent applies it.",
    sections: {
      intent: {
        outcome:
          "Let a person follow a design pass in the vault as an agent edits the carriers, and answer it from the vault with intent an agent hands off as a change proposal.",
        risks: [
          "Regenerating the vault while a person reads could move them off their place or overwrite a note they are editing.",
        ],
        openQuestions: [
          {
            question: "Where does a person compose intent in the vault?",
            blocking: true,
            key: "composeHome",
            decider: "owner",
            links: ["spec:consumers.intent-composition.proposal"],
            provisional:
              "a folder of intent notes the generator never writes, each citing entries by block link, which an agent turns into a proposal and runs through the proposal check",
          },
          {
            question: "What regenerates the vault while a pass runs?",
            blocking: true,
            key: "regenerationTrigger",
            decider: "owner",
            provisional:
              "a separate vault watcher responds to carrier changes and source-anchor changes under the extraction root, replacing generated notes whose values changed and removing notes whose nodes or entries left the graph; it never extends `sdp validate --watch` to source edits",
            links: ["spec:consumers.validate-watch"],
          },
          {
            question: "How does the vault discourage editing a generated note?",
            blocking: false,
            key: "editGuard",
            provisional:
              "a read-only banner naming the carrier on every note, and a regeneration that reports any generated note changed since it last wrote it",
          },
        ],
      },
      behavior: {},
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
    narrative: null,
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
        ],
      },
      design: {
        parseErrorLine:
          "A body that does not parse prints one stderr line, `sdp q: the body does not parse at line L, column C: <message>`, with 1-based positions in the caller's body, exits 1 and prints nothing on stdout.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
          "four links under a `Start here` heading: Read a Pack's design, Find a Spec, entry or file by a word, Narrow the Specs, Read the findings.",
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
        openQuestions: [
          {
            key: "summaryFormat",
            question: "Should the summary state its counts as sentences or as a table?",
            blocking: false,
            decider: "owner",
            provisional: "Keep the counts as sentences.",
          },
        ],
      },
      behavior: {
        rules: [
          "The page opens with the Pack's title, its id and its carrier file as text with a copy action, then the summary; the framing follows as prose under the heading Framing, with the vocabulary references, linked.",
          "The summary states each Pack total in one sentence that opens with its count: the members and the unresolved ones, the members held below their stated next rung and those waiting only for their author, the design entries and pinned declarations, the open and blocking questions, the members with an implementation binding and with a design reference, and the boundary in each direction.",
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
          "Then come the members with no verifier binding, those stated `ready` first, under one sentence saying the graph records bindings and never runs, so no page shows a run result; then the findings that name the Pack.",
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
          "Publish the Studio under its own root as one page set the graph alone determines, which opens through `file://` and uploads to a static host unchanged.",
      },
      behavior: {
        rules: [
          "`sdp studio [root] [--exclude PATH]... [--check-clean]` validates the graph and writes the Studio's page set to `<root>/generated/spec-studio/`; `root` defaults to the working directory, and each exclusion is a root-relative path prefix, as for the shipped publishers.",
          "A run writes nothing outside its root, writes no stamp, and leaves every carrier and source file under the root byte-identical.",
          "A run writes its page set to `generated/spec-studio.tmp/`, removes the prior root and renames the temporary into place, so no page of an earlier run survives a later one and no temporary survives a completed run.",
          "Every command that enters the shared build, `sdp studio` among them, removes `generated/spec-studio/` and its temporary sibling before extraction, beside the four roots `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` names; a removal failure refuses the command before extraction.",
          "`sdp studio --check-clean` renders an independent twin and refuses divergent renders, then compares the current root with the new render; missing or drifted output returns nonzero and is removed, and clean output is replaced wholesale with byte-identical content.",
          "Findings never withhold the page set: a run over a graph with validation findings still publishes and returns the validation exit code, and each finding shows on the index, and also on its subject's page when its subject is a Spec or a Pack. A run whose extraction fails publishes nothing and returns nonzero.",
          "The page set holds `index.html`, `search.html`, one `packs/<name>.html` per Pack, one `specs/<name>.html` per Spec, and `assets/studio.css` and `assets/studio.js`. `<name>` is the id after its namespace, with each uppercase ASCII letter written as `_` and its lowercase, so no two pages collide on a file system that ignores case.",
          "Two runs over one graph write byte-identical files, and no file holds a time, a commit, an absolute path or a host name.",
          "Every link a page writes stays inside the page set: it resolves to a page the run wrote and, with a fragment, to an element id that page carries, apart from the search page's term fragment `search.html#q=<term>`, which names no element. No page links a carrier or source file, an editor URI or an external address.",
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
          wholesale: "rules[2]",
          buildInvalidates: "rules[3]",
          checkClean: "rules[4]",
          findingsShown: "rules[5]",
          pageSet: "rules[6]",
          deterministic: "rules[7]",
          linksResolve: "rules[8]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
          '`sdp-filter`: wraps a hidden form of labelled `select` elements, each with `data-facet="<name>"` and an `any` option, and the rows marked `data-row`. On upgrade it shows the form, hides each row whose `data-<name>` differs from a chosen value, and writes `<shown> of <total> shown` in its `output` element; a row whose attribute holds several space-separated values, such as its Packs, matches when one of them equals the choice.',
        expander:
          "`sdp-expander`: adds `Open all` and `Close all` buttons for the `details` elements inside it, and on load and on each fragment change opens every `details` that holds the fragment's target and scrolls the target into view.",
        copy: "`sdp-copy` with `text`: a `Copy` button whose accessible name includes the text; it copies the text to the clipboard and says `Copied`, and where the clipboard is unavailable it selects the text so the person can copy it.",
        stamp:
          "`sdp-stamp` with `page-root`: served over http or https, it requests `<page-root>stamp.json` and, when it loads, shows its corpus commit, engine and build time as text; otherwise it shows nothing.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
] as const;
