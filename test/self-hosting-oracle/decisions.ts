// The authored descriptors of the `decisions` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const decisionsSpecs = [
  {
    id: "spec:decisions.exclusion-contract",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
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
    id: "spec:decisions.plain-language-references",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
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
    readiness: "ready",
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
        consequences: [
          "Deletion follows the carrying work, per document, and is never bundled into the change that lands the carrier.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.one-validation-path",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
    file: "specs/decisions/executable-meta-model.sdp.md",
    title: "The Protocol is an executable meta-model",
    narrative: null,
    sections: {
      intent: { outcome: "Make delivery intent conform to one typed, self-validating contract." },
      decision: {
        context: "Delivery tools can describe work without making their model executable.",
        decision:
          "The Protocol models authored Specs, Packs, and anchors in typed code, derives one graph, and checks conformance and honesty.",
        rationale: [
          "Gen 1's failure was dual-source binding hidden from the type system, not executability itself; the typed meta-model removes that hidden truth path while allowing executability to return as a recovered surface.",
        ],
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
    readiness: "ready",
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
  {
    id: "spec:decisions.agent-front-door",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/agent-front-door.sdp.md",
    title: "The agent front door is one evaluation sink over the exported reader",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let an agent read the typed graph in a single invocation without authoring a module for each question and without minting query verbs.",
      },
      decision: {
        context:
          "Agents arrive holding a question rather than a project, and the exported reader answers only after a TypeScript module is authored, compiled, and run.",
        decision:
          "The front door is two entrances over one seam: the package exports the reader constructor, and the CLI carries a single evaluation sink that derives the graph in process, injects that same reader, and prints the body's pre-shaped return.",
        rationale: [
          "One evaluation sink adds no query vocabulary, so it is the opposite of a verb wall, while a scripting-only entrance taxes every question with a module, a sink with its own query language would rebuild the wall, and reading a committed graph artifact would answer from a snapshot a just-authored Spec is missing from.",
        ],
        consequences: [
          "The graph is derived through the extractor on every invocation, so a just-authored Spec is queryable immediately and no stale artifact answers in the graph's name.",
          "The sink reads only — it consumes the extractor's derived output in memory, never re-parses carriers, and writes no artifact.",
          "The sink evaluates operator-supplied code with the trust stance of a local developer tool rather than a sandbox, and supplied roots resolve to canonical validated identities at the boundary.",
          "The injected binding names are a scripted contract that recipes and skills depend on, so renaming one breaks every body written against the surface.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.verification-posture-not-realization",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/verification-posture-not-realization.sdp.md",
    title: "Verification mode states posture, not realization",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep authored verification intent distinct from derived evidence that a verifier exists.",
      },
      decision: {
        context:
          "A Spec may declare `verification.mode: executable` before any resolving test anchor exists, while the graph already derives enabled-verifier realization from bindings.",
        decision:
          "`verification.mode` states the intended verification posture; enabled-verifier realization remains a derived fact and the two are never collapsed.",
        rationale: [
          "Treating the authored mode as realization would duplicate and weaken the binding-derived fact, while warning on an unrealized posture would turn an intended direction into workflow or content-quality policing.",
        ],
        consequences: [
          "No validator warns merely because `mode: executable` has no enabled verifier.",
          "Consumers report the authored mode and derived verifier bindings separately.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.example-realization-posture",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/example-realization-posture.sdp.md",
    title: "Example realization stays evidence, not backlog work",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep implementation bindings direct while making the operational build backlog name work that can own a realization.",
      },
      decision: {
        context:
          "The raw `ready ∧ ¬implemented` query includes every ready example whose bound suite verifies its parent even though the example usually owns no implementation site distinct from that parent.",
        decision:
          "Ready example Specs are verification evidence and are excluded from the canonical build-backlog recipe; `implemented` remains a direct, anchor-derived delivery fact with no propagation through refinement.",
        rationale: [
          "Deriving an example's implementation through its parent would introduce an inferred realization claim that no source binding asserted, while adding one anchor per example would turn evidence points into ceremonial implementation sites. Keeping the fact direct preserves the claim boundary and leaves a rare example that genuinely owns a distinct realization free to carry its own code anchor.",
        ],
        consequences: [
          "The unqualified raw `ready ∧ ¬implemented` expression remains literally true but is not the operational backlog definition because it includes example evidence.",
          "The canonical backlog recipe and adopter guidance filter out examples and report both the excluded count and any excluded ready example missing verifier evidence.",
          "Consumers that hand-roll the raw expression must opt into the example posture explicitly rather than assuming refinement confers implementation.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.pack-markdown-carrier",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/pack-markdown-carrier.sdp.md",
    title: "Packs gain a Markdown manifest carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give every Pack one readable canonical authoring surface without losing the TypeScript manifest as a lawful per-ID option.",
      },
      decision: {
        context:
          "The carrier ruling left Packs on TypeScript until a real need forced a syntax ruling; the two remaining authored Pack manifests are that need, and a second suffix or a body-list membership would invent a second discovery walk or a second membership owner.",
        decision:
          "A Pack's Markdown carrier is a `.sdp.md` file routed by the `pack:` envelope id namespace, closed to `id` · `specs` · `modelRefs`, with the H1 as title and remaining prose as framing; the TypeScript `pack()` builder stays a lawful per-ID option and the import source.",
        rationale: [
          "Discovery already walks `.sdp.md`, so routing by namespace reuses the one walk instead of minting a `.pack.md` suffix. Closing the envelope to the same fields the TypeScript manifest already owns keeps one Pack node shape. Refusing `##` headings preserves the no-section-tier law. Membership as a YAML list keeps the manifest the sole owner of `belongsTo` rather than promoting body prose into identity.",
        ],
        consequences: [
          "Markdown and TypeScript manifests of the same Pack derive the identical Pack node, the `file` field aside, and identical `belongsTo` edges.",
          "The same Pack id authored in both carriers remains the standing duplicate-id refusal.",
          "`sdp import` stays Spec-only and does not convert Pack manifests.",
        ],
        alternatives: [
          "A distinct `.pack.md` suffix would split discovery and pretend the carrier ruling had already chosen a Pack surface.",
          "Membership as a body list would give Packs a section tier the TypeScript shape does not have and would split identity between envelope and prose.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.decision-readiness-posture",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/decision-readiness-posture.sdp.md",
    title: "Decision records state readiness from ratification evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let ratified decision records state their honest maturity without manufacturing implementation or verifier work.",
      },
      decision: {
        context:
          "A complete decision record with a ratified registry row carries settled intended truth, but treating its missing implementation and verifier bindings like a behavior gap turns the decision kind into definitional backlog noise.",
        decision:
          "A decision Spec states `ready` when its complete record is registry-ratified. Decision records never require implementation or verifier bindings; the operational build backlog and verifier-gap signal exclude kind `decision`, while recipe 1 reports the excluded ready-decision count.",
        rationale: [
          "Readiness describes maturity of authored intent, not delivery. Registry ratification is the decision kind's natural evidence, just as executable examples carry verifier evidence rather than implementation work. Reporting the exclusion preserves census visibility without pretending decisions are code to build.",
        ],
        consequences: [
          "Ratified, floor-clear decision Specs can state `ready` without creating backlog rows or verifier-gap warnings.",
          "The raw `ready ∧ ¬implemented` expression remains true for decision records; operational recipes must name their kind exclusions explicitly.",
        ],
        alternatives: [
          "Keeping ratified decisions at `defined` would hide their settled maturity to avoid a consumer query defect.",
          "Adding ceremonial anchors or verifiers would collapse authored decision evidence into unrelated delivery facts.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.gherkin-carrier-option",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/gherkin-carrier-option.sdp.md",
    title: "Behavior and example Specs may use Gherkin canonically",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Admit stakeholder-readable BDD authoring without creating a second graph truth or moving execution into authored intent.",
      },
      decision: {
        context:
          "Markdown remains a complete default carrier, but executable behavior and example Specs repeat their Given/When/Then structure in code-side handlers; the restored v0 design and gen-1 production record show that a Gherkin surface improves stakeholder readability while still requiring separate executing code.",
        decision:
          "A behavior or example Spec ID may select a graph-aware Gherkin carrier as a lawful canonical per-ID option. Markdown remains the default, each ID has exactly one canonical surface with no mixing, and Gherkin derives the existing graph shape and executes only through generated contracts plus anchored code-side handlers. Its syntax maps onto the existing envelope, sections, relations, and notation; it creates no parallel lifecycle status or tag registry.",
        rationale: [
          "BDD-native readability is worth one bounded carrier pipeline when the one-graph boundary, generated-contract execution path, and binding-only verifier trace remain unchanged; restricting the option to behavior and example Specs avoids pretending Gherkin is a natural carrier for every kind.",
        ],
        consequences: [
          "The Gherkin pipeline must define deterministic parsing, source locations, graph parity, vocabulary lint, and fail-loudly behavior before the option is realized.",
          "A Gherkin scenario does not confer `has-verifier`; only the existing resolving anchored `verifies` trace enables it, and runner pass state remains outside the graph.",
          "Gen-1 value-transfer deletion, authored completion status, and an independent tag taxonomy are explicitly not imported.",
        ],
        alternatives: [
          "Keeping Markdown as the only default authoring path avoids a second parser but retains the stakeholder-readable duplication established by the executable-verification review.",
          "Deriving more of the test wrapper can reduce mechanical code independently, but does not provide a BDD-native canonical artifact.",
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
