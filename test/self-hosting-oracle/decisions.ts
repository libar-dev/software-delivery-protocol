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
        consequences: [
          "Specs, AGENTS.md, skills, registry glosses and plans lead with a decision's plain-language meaning; its code follows in parentheses when useful.",
        ],
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
        context: "Concept documents carry both laws and unsettled representation.",
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
          "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option. Later refinements keep this default and the one-surface law without repealing them: the Pack syntax ruling completes Pack Markdown, and the Gherkin carrier option admits graph-aware Gherkin as a lawful per-ID option for behavior and example Specs only, with the canonical suffix settled as `.sdp.gherkin`.",
        rationale: [
          "An owned grammar and a permanent kind split both add surface cost without a demonstrated expressive gain, while retiring the DSL removes a useful bounded option. Bounding Gherkin to behavior and example Specs preserves the same trade-off — a second parser only where BDD-native readability earns it — rather than pretending every kind has a natural Gherkin shape.",
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
          "A relation owns its reason and an open question owns its fields, so the one typed-owner law covers edge text.",
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
      intent: {
        outcome: "Make delivery intent conform to one typed, self-validating contract.",
      },
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
      intent: {
        outcome: "Name the product and its meta-layer without implying workflow control.",
      },
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
          "Renaming a binding fact as reachability or approval would overstate what its evidence proves, and recording approval in the graph would add an authored truth-bearing artifact beside the Spec.",
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
          "The readiness floor combines cumulative kind-blind clauses with one kind-conditional evidence clause at each of the `scoped` and `defined` rungs: the kind's natural evidence present, then complete.",
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
          "Promoted evidence counts only when the promoted Spec carries its own kind's natural evidence.",
        rationale: [
          "Counting an empty promoted child or a wrong-kind constraint would clear the evidence floor without the content it is meant to require.",
        ],
        consequences: [
          "The floor checks resolved target shape, and unresolved external decision links stay outside the relation grammar.",
          "Authoring-shape honesty rejects authored delivery facts.",
          "External `doc:` targets remain deferred until a corpus needs a relation to a decision recorded outside the graph.",
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
          "Consumers use the current graph and reader surfaces while MCP integration remains designed-in and unbuilt.",
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
    title: "Packs have a Markdown manifest carrier",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give every Pack one readable canonical authoring surface without losing the TypeScript manifest as a lawful per-ID option.",
      },
      decision: {
        context:
          "The carrier ruling left Packs on TypeScript until a real need forced a syntax ruling; the authored Pack manifests supplied that need, and a second suffix or a body-list membership would invent a second discovery walk or a second membership owner.",
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
          "The Gherkin pipeline parses deterministically, keeps physical source locations, derives the graph a Markdown carrier of the same Spec would, lints its vocabulary, and fails loudly.",
          "A Gherkin scenario does not confer `has-verifier`; only the existing resolving anchored `verifies` trace enables it, and runner pass state remains outside the graph.",
          "Gen-1 value-transfer deletion, authored completion status, and an independent tag taxonomy are explicitly not imported.",
          "The canonical discovered suffix is settled separately as `.sdp.gherkin` (MD-28); this option does not itself choose a file extension, flip the default carrier, or extend kind coverage.",
        ],
        alternatives: [
          "Keeping Markdown as the only default authoring path avoids a second parser but retains the stakeholder-readable duplication established by the executable-verification review.",
          "Deriving more of the test wrapper can reduce mechanical code independently, but does not provide a BDD-native canonical artifact.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.sdp-gherkin-extension",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/sdp-gherkin-extension.sdp.md",
    title: "Canonical Gherkin carriers use `.sdp.gherkin`",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep graph-aware Gherkin Specs discoverable by the Protocol without colliding with default Cucumber runner globs.",
      },
      decision: {
        context:
          "The Gherkin carrier option admits a BDD-native surface for behavior and example Specs, but does not settle the file suffix. Bare `.feature` keeps default editor and Cucumber tooling recognition, yet matches ordinary runner globs and therefore risks treating Protocol carriers as executable Cucumber tests. A compound Protocol suffix mirrors the `.sdp.ts` collision-safety law and gives discovery a unique, content-free signal.",
        decision:
          "Canonical graph-aware Gherkin Specs use the `.sdp.gherkin` suffix. Discovery is suffix-only: `.sdp.gherkin` files are Gherkin carriers, and bare `.feature` files are not. Bare `.feature` remains non-canonical territory for import sources, foreign corpora, and historical lineage, never a second live canonical surface. This ruling does not change which Spec kinds may choose Gherkin, does not flip the default carrier away from Markdown, and does not admit dual-suffix discovery or content sniffing.",
        rationale: [
          "Collision safety outranks default editor recognition when choosing a suffix that becomes costly to change after adoption. Compound extensions already identify Markdown and TypeScript carriers without test-glob collisions; applying the same pattern to Gherkin keeps one discovery walk honest. Teams that want highlighting can associate `*.sdp.gherkin` with Gherkin in the editor, while Cucumber's default `*.feature` globs stay clear of Protocol carriers.",
        ],
        consequences: [
          "Extractors, CLI empty-corpus diagnostics, copy rules, fixtures, and authoring guidance treat `.sdp.gherkin` as the only discovered Gherkin carrier suffix.",
          "Ordinary `.feature` files beside a corpus neither enter the graph nor poison extraction; they stay import-source and foreign-corpus material until an explicit import adapter says otherwise.",
          "Default editor and formatter recognition for bare `.feature` is not inherited; consumers configure a `*.sdp.gherkin` association when they want Gherkin highlighting or formatting.",
        ],
        alternatives: [
          "Keeping bare `.feature` as canonical would preserve stock Gherkin tooling out of the box, but would keep Protocol carriers inside default Cucumber globs and invite false execution of authored intent.",
          "Accepting both `.feature` and `.sdp.gherkin` would create a dual-suffix window, split discovery, and weaken the one-canonical-surface law the carrier rulings already enforce.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.carrier-universality",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/carrier-universality.sdp.md",
    title: "Carrier universality is bounded by honest kind structure",
    narrative: null,
    sections: {
      intent: {
        outcome:
          'Decide which kinds of truth the Gherkin carrier can hold honestly, what "universal" means, and whether Markdown stays the default.',
      },
      decision: {
        context:
          'The Gherkin carrier option (MD-27) admitted graph-aware Gherkin only for behavior and example Specs so the corpus would not pretend every kind has a natural Gherkin shape. A preference for one format asks whether that kind bound should be overturned, whether rich content may live inside the carrier, what "universal" means, whether Markdown remains the default, and whether Packs are in scope. The kind-evidence table and the structural collisions in the Gherkin grammar show which kinds it can carry honestly.',
        decision:
          'In order, first, Gherkin remains an honest canonical per-ID option only for `behavior` (Feature) and `example` (ordinary Scenario); the other six kinds stay Markdown because a Gherkin mapping would lie against the kind-evidence table — `workflow` has no distinct Gherkin root and Feature mapping erases the kind; `rule` collides with `Rule:` already consumed as inline `behavior.rules`; `constraint` needs machine-readable targets a Scenario cannot own; `model` needs keyed terms; `decision` needs context/decision/rationale/consequences (and supersedes) that Feature structure cannot distinguish; `contract` shares the behavior family row but Feature cannot structurally mark the kind. Second, rich content is ruled by physical form: Feature and Scenario description prose (keyed description bullets and remaining non-heading prose) is lawful only as free prose on the prose owners the prose-ownership law (MD-19) names — narrative or description on the typed owner — never a new field and never a parser-within-a-parser beyond enumerated constructs; Gherkin DocStrings and DataTables remain refused. Third, "universal" means per-ID carriers plus a generated Gherkin-shaped READ projection of any Spec (visibly generated, disposable, lossy commentary allowed for refused kinds), not one default authored carrier for everything and not a lossless codec. Fourth, the corpus default does not flip: Markdown remains the default Spec carrier; a default flip is refused before full honest round-trip exists. Fifth, Packs are out of this ruling; the Pack syntax ruling (MD-25) remains the Pack carrier law.',
        rationale: [
          'This is hard to reverse because kind coverage, default posture, and the meaning of universality become contracts for authoring guidance, extraction, projections, and later follow-through — flipping them later would churn every carrier surface and every consumer that trusted the bound. It is surprising without context that "universal" is a generated read projection rather than one authored format, that six kinds stay Markdown on honesty grounds rather than missing syntax, and that description prose is admitted only onto slots the prose-ownership law (MD-19) already owns while DocStrings and DataTables stay refused. It is a real trade-off: one preferred stakeholder shape is worth a bounded second parser and a generated view, while refusing dishonest kind mappings, a default flip, self-executing prose, DocString/DataTable expansion, and Pack absorption gives up format uniformity to keep one graph language and the kind-evidence table honest. The rationale of the Gherkin carrier option (MD-27) is therefore reaffirmed and sharpened, not overturned.',
        ],
        consequences: [
          "`spec:carrier.gherkin-authoring` records the closed grammar this ruling bounds.",
          "A generated Gherkin-shaped projection may render any Spec for reading; it never uses `.sdp.gherkin` in an authored tree, never claims round-trip parity, never becomes a second source of truth, and may mark refused kinds with lossy commentary.",
          "Markdown stays the default Spec carrier under the carrier ruling (MD-18); the Gherkin option stays opt-in per ID for behavior and example only, as the Gherkin carrier option (MD-27) admits it; the `.sdp.gherkin` extension (MD-28) stays untouched, with its suffix, its dual-recognition refusal, and bare `.feature` non-canonicity.",
          "Packs stay under the Pack syntax ruling (MD-25); this Spec neither admits a Gherkin Pack surface nor reopens the Pack Markdown envelope.",
          "Execution and `has-verifier` stay behind generated contracts and resolving anchored handlers; Gherkin prose does not execute; authored delivery status, lifecycle tags, value-transfer deletion, Scenario Outlines, Examples tables, backgrounds, star steps, and leading conjunctions stay refused.",
        ],
        alternatives: [
          "Making Gherkin the default authored carrier for every kind would satisfy the one-preferred-format desire, but would force dishonest Feature mappings for six kinds and an XL migration before round-trip honesty exists.",
          "Admitting DocStrings or DataTables as authored rich content would look more BDD-native, but would invent structure outside the prose owners the prose-ownership law (MD-19) names and reopen a parser-within-a-parser the closed grammar refuses.",
          'Treating "universal" as one lossless codec between Markdown and Gherkin would promise field-level fidelity the v0 record never designed and the kind-evidence collisions forbid.',
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.adopted-registrars-committed",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/adopted-registrars-committed.sdp.md",
    title: "Adopted runnable registrars are committed",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Make an authored test's generated registrar dependency reviewable and available before generation without pretending every generated registrar is source.",
      },
      decision: {
        context:
          "Runnable registrars are derived siblings of authored tests. Most remain ignored, but an authored test that imports one cannot typecheck or execute from a clean checkout unless that adopted sibling is present or generation runs first.",
        decision:
          "A registrar becomes adopted when tracked authored code imports it. Adopted registrars are committed and byte-checked against fresh generation; unadopted registrars remain ignored, regenerable output. A deterministic generated manifest owns reconciliation for both groups without turning registrar content into authored truth.",
        rationale: [
          "This is hard to reverse once adopter tests depend on clean-checkout imports. It is surprising without context that one derived sibling is tracked while its unadopted peers are ignored. It is a real trade-off: committing adopted bytes adds review noise and requires a falsifiable equality gate, while ignoring them all makes authored imports depend on an unrecorded generation precondition.",
        ],
        consequences: [
          "`--check-clean` refuses manifest or sibling-byte drift, preflight compares tracked worktree and Git-index bytes with independent regeneration, and stale manifest-owned siblings are removed.",
          "Tracking a registrar confers no delivery fact or migration claim; its `specTest` anchor remains the only verifier-binding source.",
        ],
        alternatives: [
          "Ignore every registrar and require generation before typecheck or test discovery; this keeps git smaller but makes an authored import unavailable in a clean checkout.",
          "Commit every registrar; this is mechanically simple but turns unadopted migration candidates into persistent review noise.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.shipped-projections-frozen",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/shipped-projections-frozen.sdp.md",
    title: "The shipped projections stay frozen",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep the shipped Design Review, census, Mermaid, and Gherkin projections as the ruled read surfaces so re-specifying them never re-enters a plan.",
      },
      decision: {
        context:
          "The refusal to re-specify the shipped Design Review, census, Mermaid and Gherkin projections lived only in plan prose and was absent from the graph.",
        decision:
          "Re-specifying the shipped Design Review, census, Mermaid, or Gherkin projection is refused. These four projections are the ruled read surfaces over the one graph. A later decision Spec that supersedes this one replaces the ruling whole; a decision Spec that refines this one narrows it for one projection or one rendering and leaves the rest frozen. Either passes the ADR three-part test.",
        rationale: [
          "The four projections are shipped, curated read surfaces over the one graph. Re-specifying them re-litigates settled law and risks a second truth store, while a graph-checkable decision record carries the refusal where agents and validators can read it.",
        ],
        consequences: [
          "Plans treat the four projections as settled read models. Any proposal to reshape one of them arrives as a decision record that refines this one for that projection, or supersedes it whole, never as a follow-up work item.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.planning-truths-placement",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/planning-truths-placement.sdp.md",
    title: "Planning truths live in ruled graph homes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give every planning-truth type one ruled home in the graph so plans point to the graph for law and may keep advisory execution and recovery records, and the briefs index shape is retired as a carrier of law.",
      },
      decision: {
        context:
          "The prose briefs index carried dependency maps, decision gates, do-not-reopen rows, re-entry triggers, ownership rulings, selection-pressure heuristics, and session law, but none of those truth types had a ruled home in the graph, so plan documents drifted into carrying law the graph could not check.",
        decision:
          "Each planning-truth type lives in its ruled home. Work-item dependency truth rides `dependsOn` edges, with independence as absence of the edge and scheduling phrases never authored. Decision gates live on `decision`-kind Specs, linked by `decidedBy`. Do-not-reopen rows split by what they carry: a tradeoff refusal becomes a `decision`-kind Spec, which a later decision that `supersedes` it replaces whole and a later decision that `refines` it narrows for one case, either under the ADR three-part test; a row that restates a behavior guarantee already homed on a carrying Spec stays on that Spec and changes by ordinary Spec revision; a hold stays a blocking open question on its own Spec and is never minted as a decision. A lawful non-decision stays in the plan record as evidence. A deferral carries its re-entry trigger in the `trigger` field of its own blocking open question, and declares `dependsOn` separately when a true precondition exists. Exclusive ownership is one Spec identity per deliverable with consumers depending on it. Selection-pressure heuristics are advisory only, carried as behavior rules on the graph-first planning Spec or in recipes. Session law splits separately, across behavior rules on the graph-first planning Spec, the delivery-session on-ramp's handoff rule, and the plan file. The briefs index shape is retired as a carrier of law.",
        rationale: [
          "The closed six-relation vocabulary already expresses every ruled home, so the ruling costs no engine work and keeps planning prose free of sequencing authority. New relation types such as `precedes`, `inArc`, or `forbids` were refused: each one is engine surface across the model, parser, extraction, validators, oracle rosters, and agent-surface docs, buying machine-checkable planning relations the corpus does not need. A `constraint`-kind home for refusals was refused because refusals are decisions. A single session-law home was refused because the planning Spec must not own per-session routing.",
        ],
        consequences: [
          "Plans point to the graph for law and may keep advisory execution and recovery records. Plan numbering, recorded work order and staleness never become graph structure or workflow authority. The do-not-reopen register lives across its ruled homes: tradeoff refusals in decision Specs, already-homed guarantees on their carrying Specs, and holds as blocking open questions. This ruling is replaced only by a later `decision`-kind Spec that supersedes it, or narrowed by one that refines it, and either passes the ADR three-part test.",
          "A decision `refines` the Spec whose question it settles, and that Spec names the decision through `decidedBy`; a decision that narrows one part of another decision refines that decision.",
          "A deferral that is itself a ruling stays on its decision Spec, which names its re-entry condition, rather than on a blocking open question: the MCP-deferred decision holds MCP integration, and the carried-evidence decision (MD-16) holds external `doc:` decision targets.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.checked-mentions",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/checked-mentions.sdp.md",
    title: "A Spec id written in prose is a checked mention",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Make a Spec id written in prose resolve, and make one keyed entry of an open section, one keyed open question, one keyed entry of the primary behavior owner, or one keyed Model term addressable, so a reference below the Spec level can be checked.",
      },
      decision: {
        context:
          "Specs name other Specs, and single entries of them, in prose. Referential integrity reads edges and Pack references only. A prose id that does not resolve passes validation, a mention that no relation backs hides a dependent from blast radius, and finding every Spec that repeats an entry is a text search. The first adopter corpus carried its design as keyed entries, and most of its prose mentions had no declared relation.",
        decision:
          "A Spec id in narrative or section text, outside `gwt` and `gwt-vocabulary` fences, is a mention. A mention that does not resolve is a conformance error. A mention of another Spec that shares no declared relation with the mentioning Spec, in either direction, is one warning per mentioning Spec and target Spec pair, whatever the number of locations; an address on the mentioning Spec's own id is checked for its entry and never warned. An entry address is a Spec id followed by `#`, the section name `design`, `ui`, `question`, `rule`, or `term`, a dot, and the entry's lower-camel ASCII key, as in `spec:<id>#design.<key>` or `spec:<id>#question.<key>`. A `design` or `ui` address resolves when the Spec exists and that section holds the key as its own key, other than `description`; a `question` address resolves when the Spec exists and one of its open questions carries that key; a `term` address resolves when the Spec exists and one of its Model terms carries that key. The `#` sub-part is reserved for the entry address in every namespace: a Spec's own id, a relation target, a Pack member or model reference, an anchor id or target, and the `specId` and `ref` builders all refuse it. A mention mints no edge, and the reader gains no join.",
        rationale: [
          "The warning asks for a relation that already exists, so linkage keeps one home. A relation in either direction backs a mention because blast radius walks its one hop both ways, so a reverse edge already surfaces the dependent. One warning per pair keeps the report readable where a Spec names one neighbor in many bullets, and the mention audit keeps every location.",
          "This applies the content-only sections ruling rather than contradicting it. A mention mints no edge, so no consumer branches on a reference union, and the warning names the double-linkage drift the earlier ruling left legal and silent. The id grammar already parses and formats a `#` sub-part; this record gives it its only meaning, and the dot inside the sub-part is the one grammar change.",
          "The owner ruled that an open question may carry an optional key in its marker, as in `- [blocking #aggregateReach] text`, addressed as `spec:<id>#question.aggregateReach`. The key grammar is the Design key grammar, a key is unique among one Spec's open questions, and an unkeyed question stays lawful. A register that cites a question by its position breaks silently when a question above it moves or closes, and the first adopter's register had drifted in such citations; a key breaks loudly where it is renamed.",
          "The owner ruled that the address carries the section, because open-section keys are unique within a section and not within a Spec, so `spec:<id>#design.shared` and `spec:<id>#ui.shared` stay distinct when one carrier holds both; that `#` is refused in every identity, because neither this corpus nor the first adopter's carries one, and one meaning per sub-part keeps resolution a lookup instead of a precedence rule; and that one lower-camel key grammar serves every carrier, so an address is typeable from memory and a lawful TypeScript key outside it is simply unaddressable.",
          "A Model term carries an authored key in a marker that opens its definition, as a rule carries its own, addressed through the segment `term`. A key derived from the term would break every address whenever the term is reworded, and the segment names the kind of entry, as `question` and `rule` do. The ratified glossary stays a document, so its terms gain no address; a term gains one where a Spec defines it.",
        ],
        alternatives: [
          "A new edge type for mentions costs the schema, the edge contract, the census, the Mermaid view, and every recipe that filters edges. The warning reaches the same dependents through relations that exist.",
          "Leaving the check to each adopter's own lint fixes one corpus and no other.",
          "A positional address for an unkeyed bullet, such as the third flow of a Workflow, was refused. Positions move with every edit above them, so such an address would break silently where a key breaks loudly.",
          "Refusing a key that appears under both Design and UI would shorten the address and make one section's keys depend on the other's. Refused by the owner.",
          "Letting an identity with `#` outrank an address would retain the earlier identity grammar and make every address resolution a two-step lookup for a case no corpus has. Refused by the owner.",
          "Warning only on a missing forward relation would turn a parent's mention of its own child into a finding the child's `refines` edge already answers. Refused by the owner.",
        ],
        consequences: [
          "Keyed Design and UI entries, keyed open questions, keyed entries of the primary behavior owner and keyed Model terms are addressable, a `rule` address resolving when the Spec's `behavior.ruleKeys` carries the key and a `term` address when its `model.termKeys` does. Unkeyed entries have no address; a reference to one stays a Spec-level mention, and a sequence that must be addressed is authored as keyed entries.",
          "The key `description` names the leading prose of a `design` or `ui` section and is never an entry there, so a `design` or `ui` address ending in `.description` never resolves. A question key is a value on the question, not a property beside section prose, so `description` is an ordinary question key. A TypeScript key outside the lower-camel ASCII grammar is lawful and has no address.",
          "A renamed or removed open-section key, question key, rule key or term key fails validation in every Spec that addresses it.",
          "Blast radius and delta review scope include a mentioning Spec once a declared relation backs its mention.",
          "A family pattern written in id form reads as an unresolved mention, so such a pattern is written as plain words.",
          "No reference check detects two Specs that restate one shape in their own words. The check narrows that defect class and never closes it.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.authored-entry-order",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/authored-entry-order.sdp.md",
    title: "The Design Review renders open-section entries as a list",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Render the entries of an open section as a readable list in authored order, so a signature or a step reads as text and not as an escaped JSON string.",
      },
      decision: {
        context:
          "The Design Review prints an open section as one fenced JSON object, so each entry's value is an escaped string. Authored order is restored by `spec:extraction.open-section-order` as an ordinary revision, because no Spec states the sort. Rendering is different: `spec:consumers.design-review` states that fenced JSON preserves authored keys and values, and the shipped projections are frozen, so a list rendering needs a decision that narrows the freeze for this one rendering. The first adopter carries its design as keyed entries, and its reviewers read the carrier files instead of the generated review because the entries render as escaped strings.",
        decision:
          "The Design Review renders each entry of a `design` or `ui` section as a list item in authored order, its key as inline code. A string value renders as Markdown text through the prose escaping rule; a number or boolean renders as inline code; an array or object renders as a fenced JSON block nested under its item, so a structured value the TypeScript carrier admits survives without loss. The fenced-JSON rule of the Design Review stops covering an open section as a whole and keeps covering a structured value inside one entry. The freeze on the four shipped projections stands for everything else.",
        rationale: [
          "A list reads as the author wrote it and escapes through the prose rules the Design Review already has for every rendered field, where fenced JSON turns a one-line signature into an escaped string nobody can paste.",
        ],
        alternatives: [
          "Keeping fenced JSON in authored order makes a sequence readable and leaves every value escaped.",
          "Narrowing open-section values to strings would make the list rendering total, but it is a model change to the open bag and belongs in its own record, not here.",
        ],
        consequences: [
          "The Design Review Spec's encoding rule carries a list case for open sections.",
          "The Markdown carrier yields string values only, so its entries always render as text; the TypeScript carrier's nested values keep their shape through the per-entry fence.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.question-key-rendering",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    title: "The Design Review shows an open question's key",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Show an open question's key on its Spec page, so a reader can cite the question's entry address from the page.",
      },
      decision: {
        context:
          "`spec:model.open-question-keys` gives an open question an optional key in its marker and an entry address `spec:<id>#question.<key>`. The Design Review renders an open question as its escaped text, with the word blocking after a blocking one, and the shipped projections are frozen, so a reader of the page cannot see the key the address needs until a decision narrows the freeze for it. The first adopter cites its open questions from a decision register and from generated pages.",
        decision:
          "The Design Review renders an open question that carries a key with the key as inline code, `#<key>`, at the start of its item, before the question's text; a question without a key renders as its text. The freeze on the four shipped projections stands for everything else.",
        rationale: [
          "The key is the one part of the address the page did not show, and the `#` that opens it in the marker opens it on the page.",
        ],
        alternatives: [
          "Rendering the whole address beside each question repeats the Spec id on every question of its own page.",
          "Leaving the key off the page keeps the freeze whole and leaves the address to the carrier file and recipe 20.",
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/decisions/question-key-rendering.sdp.md",
  },
  {
    id: "spec:decisions.studio-html-surface",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    title: "The Studio renders HTML, and the HTML stays derived",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give reviewers a Studio with search, filters and collapsible views while git diffs stay over canonical Spec source.",
      },
      decision: {
        context:
          "When a model writes the Specs, a person's main act is review, and review reads tables, diagrams, code, comparisons and examples across many Specs. The first adopter's reviewers need search, filters, navigation and progressive disclosure across a Pack, which the generated Markdown pages do not give: the Pack page's member table is too wide for those readers, and they open the carrier files instead.",
        decision:
          "The Studio renders generated HTML as its surface. The HTML is derived and never committed: git diffs stay over the canonical Spec source, and the Studio's files are regenerated from the graph.",
        rationale: [
          "HTML conveys more per screen: collapsible sections, wide tables that scroll in place, SVG diagrams, highlighted code and side-by-side comparisons are native to it.",
          "HTML is shareable: a page set uploaded to any static host is a link a reviewer opens without installing anything.",
          "HTML is interactive: search, filters and navigation run in the page over values the build wrote, which Markdown cannot do.",
          "The Studio's code renders its HTML from the graph, so the original's argument from generation time and token cost, which priced a page a model writes, does not apply.",
        ],
        alternatives: [
          "Markdown renders in Markdown viewers and agents read it as text; the generated Markdown Design Review lacks the Studio's search, filters and collapsible views, so it stays beside the Studio.",
        ],
        consequences: [
          "The principal trade-off of HTML, diffs that are noisier in git, is sidestepped because the HTML is derived and never committed.",
          "The Studio stands beside the Markdown Design Review. The Studio is an interactive workbench, the frozen Markdown Design Review is a generated view for agents and Markdown readers, and git review stays over canonical Spec source; neither view ranks above the other.",
          "The case for derived HTML holds for any canonical carrier, because it rests on the HTML being derived and never committed, not on the Specs being written in TypeScript.",
          "The richer interactions the original design lists, such as moving a target on a slider, running a scenario harness or reordering members by drag and drop, wait for later phases and their own Specs; the Studio's first build is read-only.",
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/decisions/studio-html-surface.sdp.md",
  },
  {
    id: "spec:decisions.studio-web-components",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    title: "The Studio is built from custom elements, not a framework",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let each Studio view work in an HTML page that can load its element script and supply graph data without imposing a framework on that page.",
      },
      decision: {
        context:
          "The Studio's views must work inside the Studio and in HTML pages that can load the element script and supply its graph data, such as an exported report, and its assets should stay small and cache well.",
        decision:
          "The Studio is built from Web Components, custom elements written without React, Vue, Svelte or another framework.",
        rationale: [
          "Custom elements avoid a matching framework runtime in every embedding page; the host loads the Studio's element script and supplies the graph data.",
          "Element names and attributes are a public embedding contract that is costly to replace; in exchange for framework-independent embedding, the Studio supplies rendering and state handling within its elements.",
        ],
        alternatives: [
          "Components of React, Vue or Svelte would impose that framework on every page that embeds one of them.",
        ],
        consequences: [
          "The few elements that need richer state, the harness and the scenario editor, may use a small reactive primitive inside themselves, such as `@lit/reactive-element` or a signals-style atom, without imposing a framework on the page that embeds them.",
          "A host that strips scripts, such as a pull request description, shows a static link to a Studio page, never an element.",
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/decisions/studio-web-components.sdp.md",
  },
  {
    id: "spec:decisions.anchor-comment-form",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/anchor-comment-form.sdp.md",
    title: "The comment form is a second anchor representation",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Admit a doc comment carrying reserved `@sdp*` tags as a second extracted representation of the anchor, feeding the same closed envelope as the constant form, so code that cannot import the Protocol binds at its real site and comment prose still authors nothing.",
      },
      decision: {
        context:
          "The source-commentary ruling this record replaced (MD-35, deleted because nothing in it still needed its own text; it reads in git at `90c75dd`) refused two things in one record: comment prose authoring graph content, and identity tags in doc comments. Its rationale said the refusal \"is about prose, not identity\", while its operative alternative also refused structured identity tags; the annotation scout under `docs/lineage/` names that mismatch and finds that gen 1's drift was duplicate identities, scan scope, and syntax handling, never an extracted identity tag as such. The first adopter showed the cost of the single form: every one of its code anchors sits in a test or a harness because its runtime code cannot import this package, `byFile` on a source file returns nothing, and a hand-kept join stands in for the binding. The original design (`docs/lineage/v0-design/04-authoring-surfaces.md` §2) supported three marker styles feeding one extractor, and its package shape (`docs/lineage/v0-design/02-system-architecture.md` §3) kept the marker library free of runtime dependencies so product code could import it. The owner's direction was to move closer to that design.",
        decision:
          "An anchor has two extracted representations that feed one closed envelope, the constant form as ruled and a comment form. The comment form is a top-level `/** … */` block in a `.ts` or `.tsx` file carrying reserved camelCase, TSDoc-compatible tags; `@sdpAnchor <id>` opens it, and the id's namespace selects the flavor exactly as the constant builders do. Comment prose still authors nothing: only the reserved tags are read, and a comment that does not open with `/**` is never read. Trust is by reserved grammar, not by builder import, so no import is required. The same id in two forms is a duplicate id. The package also ships a zero-dependency subpath `@libar-dev/software-delivery-protocol/anchors` exporting the id builders and the three anchor builders and nothing else, for runtimes that may import but must not load `node:*` modules or ts-morph; the extractor trusts that specifier as a Protocol builder module.",
        rationale: [
          "Hard to reverse: a second write path from source becomes a contract for the extractor, the validators, and every adopter's code. Surprising without context: the replaced ruling refused the obvious parity move, and this one admits exactly the half its own rationale left open while keeping the half it was about. Real trade-off: a tag grammar in a comment gets no compiler check and the extractor gains a second parser; in exchange, code that cannot import the package binds at its real site and `byFile` answers for it.",
          "What survives from the replaced ruling: comment prose authors nothing; a comment's wording beyond the reserved tags produces no graph finding; a comment that states law other surfaces depend on still promotes into a Spec under the promotion law, and restating promoted law in a comment violates exclusive promotion (MD-10), so the comment demotes to local commentary plus a Spec pointer; one graph language stays, because both forms feed one envelope and one extraction path (one validation path, MD-14).",
        ],
        consequences: [
          "The reserved tags are `@sdpAnchor`, `@sdpLabel`, `@sdpSatisfies`, `@sdpVerifies`, `@sdpModels`, `@sdpReferences`, `@sdpComponent`, `@sdpUses`, `@sdpRole`, `@sdpLayer`, and `@sdpContext`; the spelling is camelCase so TSDoc tooling reads each as one tag.",
          "`@sdpAnchor <id>` opens the anchor; `impl:`, `api:`, and `component:` ids are code anchors, `test:` is a test anchor, `oracle:` is an oracle anchor.",
          "Target tags by flavor are `@sdpSatisfies` and `@sdpReferences` on a code anchor, `@sdpVerifies` on a test anchor, and `@sdpModels` on an oracle anchor; lists are comma-separated.",
          "Structural tags are admitted on code anchors only: `@sdpComponent`, `@sdpUses`, `@sdpRole`; a component anchor additionally takes `@sdpLayer` and `@sdpContext`.",
          "`@sdpLabel` is admitted on any flavor.",
          "Any other `@sdp*` tag is an envelope error, because the envelope is closed exactly as it is in the constant form; a line that opens with `@sdp` is a reserved tag line, so a misspelling such as `@sdp-anchor` or `@sdpAnchor:` is refused rather than read as prose.",
          "Attachment: every top-level `/** … */` block that contains a reserved tag is one anchor with exactly one `@sdpAnchor`; a block with reserved tags and no `@sdpAnchor` is an envelope error, and a block with two is an envelope error, as any repeated tag is.",
          "Blocks above the first import, trailing blocks with no statement beneath them, and comment-only files are read; a `/** … */` block with a reserved tag in a nested position, inside a function body, a class member, an object literal, or a JSX expression, is a misplaced-tag error, and a nested comment the top level would not read stays unread.",
          "The block's first line is the binding's file and line.",
          "The binding grain of both forms is the file: a block's line locates the anchor and names no declaration, and no attachment kind or symbol name is recorded. Symbol-level reach, if it arrives, is derived under the inferred claim and joins anchors by position; a mismatch is never a finding.",
          "Cardinalities: each reserved tag appears at most once per block; `@sdpModels` takes one target; a list tag is non-empty, carries no empty item, and repeats no target.",
          "Prose precedes the tags; after the first reserved tag, a non-empty line that does not open a tag is a refused continuation, and an ordinary TSDoc tag such as `@param` stays lawful and unread.",
          "Parsing reads the raw comment text with a tag grammar; it does not depend on the TypeScript JSDoc tag parser.",
          "The extractor's raw-text prefilter admits any file that contains the `@sdp` prefix, so a file with no Protocol import is still read.",
          "The same id written in both forms reports through the duplicate-id validator.",
          "The `/anchors` subpath is ESM with type declarations, built from the leaf id and anchor modules, carries no dependency, loads no `node:*` module, and its dependency closure is tested; a runtime that imports it ships nothing beyond the id and anchor builders.",
          "The decorator form stays an unextracted representation.",
        ],
        alternatives: [
          "Keeping the constant form as the single binding syntax was refused: the adopter's runtime code cannot import this package, so its anchors would stay in tests and the graph would keep answering nothing for source files.",
          "Extracting the comment form through the TypeScript JSDoc tag parser was refused: it would couple the reserved grammar to the compiler's tag model and its versioning, where a tag grammar over the raw comment text is owned here.",
          "A hyphenated spelling such as `@sdp-anchor` was refused: TSDoc tooling splits a hyphenated tag at the hyphen, so the tag would render as `@sdp` with a stray suffix in every documentation projection.",
          "Parsing comment prose into Spec sections stays refused: it inverts the separation of intent from binding and recreates a shadow intent carrier beside the Specs.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.anchor-binding-grain",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/anchor-binding-grain.sdp.md",
    title: "Bindings are optional, plural, and may reference a design",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a code anchor name zero, one, or several Specs it realizes, and name the Specs it answers to without claiming to realize them, so an anchor can state exactly what its code does and the graph can reach a design from the code that answers to it.",
      },
      decision: {
        context:
          "Before this ruling a code anchor carried one required `satisfies` and a test anchor one `verifies`. The first adopter split Specs so that an anchor could claim only what its code does, a stub reads as `implemented` because the only way to name a design from code is to claim to realize it, and a relationship the design states in prose cannot reach a page. The original design made `satisfies` optional and plural on an anchor (`docs/lineage/v0-design/04-authoring-surfaces.md` §2.4) and drew the line that anchors carry identity and structure, never readiness, intent, behavior, or verification. The annotation scout under `docs/lineage/` found no informational code-to-Spec edge in either lineage and proposed one as the smallest extension.",
        decision:
          "On a code anchor, `satisfies` is optional and plural; on a test anchor, `verifies` is plural and non-empty. The constant form accepts one `ref(…)` or a fresh array literal of them. Each resolving target confers its fact, and `implemented` stays a whole-Spec fact. An anchored edge `references` runs from a CodeNode to a Spec, from `references?: readonly SpecId[]` on a code anchor; it may target any Spec, decisions included, confers no delivery fact, moves no readiness floor, and the drift alarm ignores it. It says this code answers to that design without claiming to realize it: the unit follows the design without realizing any of its promises, or realizes part of a Spec whose remaining promises no unit yet realizes, so a change to the design asks the code to follow. A design that builds on existing code states that by a typed relation to the Spec the code satisfies, never by a reference from the code. A target named in both `satisfies` and `references` is an error. An identity-only code anchor, with no `satisfies` and no `references`, is lawful: it mints a CodeNode for structure and for `byFile`, and nothing else.",
        rationale: [
          "Hard to reverse: the anchor contract and the closed edge list are contracts for the extractor, the validators, the reader, and every adopter's anchors. Surprising without context: the obvious move is to let `satisfies` name a design the code only partly realizes, and this ruling refuses that in favor of a second edge that confers nothing. Real trade-off: a non-conferring edge can be written where a realization claim is due, and nothing in the graph says which; in exchange, `implemented` keeps its one meaning and an honest anchor is always writable.",
          "Bindings state existence, not liveness, and `references` states less than existence of realization: only that the code answers to the design. Keeping that below the delivery facts preserves the drift alarm's meaning.",
        ],
        consequences: [
          "The closed edge list includes `references`, derived and anchored; `satisfies` and `verifies` edges are one per target.",
          "A present `references` is non-empty and unique; a non-resolving target confers nothing and reports as a non-resolving `satisfies` target does.",
          "`satisfies` keeps its posture: code never satisfies a decision Spec directly, because a ruling is not something code realizes, and a unit may reference the decisions it follows; an anchor is never pointed at an unfinished Spec to manufacture coverage, and a unit that answers to such a Spec references it.",
          "`satisfies` is a claim a set of units makes about a Spec: a unit satisfies a Spec when it realizes at least one promise the Spec carries, and the units that satisfy it together realize every promise it carries. A unit that follows a design without realizing any promise of it references the design. A promise no satisfying unit realizes is a binding defect: split that part into a child Spec, or write `references` until it is built. A component and its members are one set for this test, and a component anchor is never added only to complete a set. The set reading keeps `implemented` a Spec-grain fact that does not depend on how the code is split into modules.",
          "A Spec that restates law a narrower Spec carries, as a model Spec defining its terms does, states a definition with a pointer, not a second promise: the narrower Spec carries the promise and its bindings, and a unit satisfies the broader Spec only for a promise that Spec alone carries.",
          "An identity-only anchor derives no `satisfies` edge, so it never confers `implemented`; a stub that answers to a design references the design rather than satisfying it.",
          "`byFile` may lawfully return a CodeNode with an empty Spec list; an empty list is the identity-only anchor's honest answer, not a lookup failure.",
          "`blastRadius` reports changed identity-only CodeNodes as their own list, neither dropped nor folded into coverage-unknown, because the graph records the node and nothing it binds.",
          "The drift alarm ignores `references` and still reports a `satisfies` target that states below `ready`, target by target.",
          "The build backlog predicate (recipe 1) is unchanged: `references` neither adds nor removes a row.",
          "The reader's Spec context names the CodeNodes that reference the Spec with their file and line; blast radius traverses `references` as a binding and names the edge type in its reason.",
          "The Design Review Spec page lists the units that reference the Spec, and the census renders `references` beside the structural edges.",
          "Anchor targets name whole Specs. An entry address never narrows a binding and never carries a delivery fact; a part of a Spec that needs its own realization tracking is its own Spec.",
          "A `references` edge is authored for the design relationship it names; an edge whose reason is a test, a count, or a `byFile` answer is removed.",
        ],
        alternatives: [
          'A partial-realization delivery fact was refused: a fact that says "partly implemented" is a status on code, and the floor cannot read it honestly.',
          "Folding the design relationship into `satisfies` was refused: it manufactures `implemented` on a Spec the code does not realize, which is the adopter's stub problem restated.",
          "Declaring the relationship on the Spec, as a list of its own code bindings, was refused: a Spec-side list of bindings is authored delivery state and a second place for the binding to drift.",
          "References from code that a design builds on were refused: that dependency is a relation from the building design to the Spec the code satisfies; a code-side copy is a second home for it and would make each unit's source list its consumers' designs.",
          "A `satisfies` or `references` target at an entry address was refused: a per-entry `implemented` is the partial-realization fact by another name, it would put delivery facts below the Spec, and a design key is renamed freely while an anchor bound to one would break on every design edit.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.architectural-annotation",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/architectural-annotation.sdp.md",
    title: "Architectural significance is annotated where it is realized",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a code anchor state the architectural role its unit plays, and let a component anchor state its layer and bounded context, so the graph answers architecture questions from the code that realizes the architecture, without a status, a second vocabulary registry, or a second architecture file.",
      },
      decision: {
        context:
          "Two rulings carried the structural half of the anchor: structural anchors confer nothing (MD-30) admitted `component` and `uses` as the only structural fields, and architectural significance rides existing primitives (MD-34) refused a vocabulary beyond them and gave up CodeNode-grain roles. Both cited gen 1's shrinking tag vocabulary as the failure of an open structural vocabulary. The annotation scout under `docs/lineage/` corrects that account: the reduction was a cleanup of gen 1's formal vocabulary that never shipped as a runtime registry, and what drifted there was duplicate identities, scan scope, and syntax handling. The original design declared a Component with `layer` and `bounded_context` (`docs/lineage/v0-design/03-graph-metamodel.md` §2.5), and gen 1 carried a role on each annotated unit. The owner's direction was to bring back the value of annotating architecturally significant units and their relationships in code.",
        decision:
          "Architectural significance is annotated on the anchor of the unit that realizes it. A code anchor may carry `role`, the architectural pattern the unit plays; a `component:` anchor may additionally carry `layer`, one of `edge`, `application`, `domain`, `adapter`, or `infrastructure`, and `context`, its bounded context. The `component:` anchor is anchored architecture: it is the declared component, and there is no separate architecture file, because the anchor sits where the component is realized. It is not the original design's declared Component that could exist before code; an unrealized component lives in Specs and never as an invented CodeNode. A role is a free, corpus-owned vocabulary whose taxonomy the census renders with counts from the graph; `service`, `decider`, `projection`, `read-model`, `codec`, `contract`, `barrel`, and `utility` are the lineage set, not a closed list. `layer` is a closed set, and a value outside it is an envelope error; `layer` or `context` on a non-component anchor is an envelope error. All three attributes are optional, and omission is lawful.",
        rationale: [
          "Hard to reverse: the anchor envelope and the CodeNode fields are contracts for the extractor, the census, the Design Review, and every adopter's anchors. Surprising without context: the replaced rulings refused exactly these attributes on the strength of a drift account the scout found inaccurate, so the reversal reads as a repeat of gen 1 until the correction is on the table. Real trade-off: a free role vocabulary can drift across a corpus and no validator will say so; in exchange, the role, layer, and context live on the one anchor at the one site, and the census taxonomy makes drift visible without a registry.",
          "This record replaced both rulings, and both records were deleted because nothing in them still needed its own text; they read in git at `90c75dd`. What survives from them is restated here as consequences: the `component` and `uses` semantics and their validation rules, structural non-conferral, no inference from imports, no status or readiness on code, significance never selects a Spec kind, no `pattern:` namespace, and the engine significance criterion.",
        ],
        consequences: [
          "`component?: ComponentAnchorId` and `uses?: readonly CodeAnchorId[]` stay closed graph-ID references deriving only anchored `memberOf` and `uses` edges; neither accepts a free string or an enum detached from graph identity, and there are no per-namespace sibling builders.",
          "Every `component` and `uses` target exists as a CodeNode, and a dangling graph id is an error.",
          "Membership is one level: a `memberOf` edge runs only from an `impl:` or `api:` CodeNode to a `component:` CodeNode, each source has at most one component, and a `component:` node is never itself a member.",
          "A `uses` edge runs between CodeNode endpoints in the `impl:`, `api:`, or `component:` namespace; a present `uses` is non-empty and unique, structural edges are unique, and structural self-reference is an error.",
          "Multi-node `uses` cycles remain authored data for the census, never findings; validators infer no transitive edge and reject no cycle.",
          "A malformed or non-static structural field, an unknown `layer`, or `layer` or `context` on a non-component anchor refuses the whole anchor at reification rather than yielding a partial declaration; the envelope stays closed.",
          "Structural edges and the three attributes confer no intent, delivery fact, or readiness effect; `satisfies` stays the only code-to-Spec realization slot and no `implements` field is admitted.",
          "Architecture is never inferred from imports as anchored or declared structure; an inferred structural layer, if one arrives, stays advisory under its own claim, and derivation adds no fourth claim.",
          "No status, readiness, intent, behavior, or verification is carried on code; role, layer, and context describe what the unit is, never where it stands.",
          "The Protocol ships no anchor-required lint; an optional corpus lint for unanchored code stays warn-level, and the absence of an anchor is evidence, never a workflow gate.",
          "Architectural significance never selects a Spec kind; the Spec states the kind of truth it carries, and relationships among such Specs are the existing relations, with `dependsOn` reserved for genuine semantic need, `supersedes` for actual replacement, and scheduling-flavored edges refused (planning truths live in ruled graph homes, MD-33).",
          "Negative architecture constraints, a layer that must not use another, stay declared intent in a Spec, never a finding of the Protocol's validators; a corpus that wants one enforced checks its declared `uses`, `layer`, and `context` in its own gate.",
          "No `pattern` term, kind, or `pattern:` namespace is admitted; a role is an attribute of a CodeNode, not a node; grouping is derived from id families and the component graph, not new Packs.",
          "The engine significance criterion stays exported public surface or cross-component reach; code never satisfies a decision Spec directly (the binding-grain ruling, MD-37), and an anchor is never pointed at an unfinished Spec to manufacture coverage.",
          "`role` and `context` values are one lowercase kebab token matching `^[a-z][a-z0-9-]*$`, with no normalization, so `read-model`, `readModel`, and `Read Model` cannot coexist as three categories; a value outside the token grammar is an envelope error.",
          "The census derives its structural rows and taxonomy from graph edges and runtime constants on every run; it re-derives no validation finding, owns no hand-kept taxonomy, and may group `uses` cycles as data.",
          "Code reaches a decision that shapes it through the `satisfies` to `decidedBy` join, and a unit may name a decision it follows directly through `references`.",
          "The census links each role, layer, and context value to the units that carry it, so an owner can reconcile two spellings of one category by editing the anchors; nothing forces a label, and an unlabelled unit does not populate the taxonomy.",
          "The five layers, one line each: `edge` is the transport and presentation boundary; `application` is use cases and orchestration; `domain` is the model and its rules; `adapter` is the implementations of ports toward external systems; `infrastructure` is runtime, persistence, and platform plumbing.",
          "A package may hold several layers or several contexts; the package-to-component mapping is reviewed, and one component per package is a choice, never a rule.",
          "Retained limitation: there is no independently declared Component; a component that no code realizes yet is a Spec, and the graph holds no CodeNode for it until an anchor exists.",
          "The census renders role, layer, context, and `references` beside its structural edges, with explicit empty states, and the Design Review's binding rows show role, layer and context; these renderings narrow the shipped projections freeze, while its remaining scope stays in force.",
          "Anchors are curated, never a coverage quota; an identity has one owner; a realizing unit documents its local how, never a paraphrase of the Spec's what or why.",
        ],
        alternatives: [
          "A separate architecture file declaring components, layers, and contexts was refused: it is a second place for the component to drift from the code that realizes it.",
          "A closed role enum was refused: the corpus owns its architecture vocabulary, and a closed set would be the Protocol's architecture, not the adopter's.",
          "A corpus-declared role vocabulary checked by a validator was refused: it is an authored registry, and the check is a content-quality check. The token grammar and the census taxonomy with its units are the whole check; a corpus that wants a list lints recipe 28 in its own gate.",
          "Deriving role, layer, or context from file paths or imports was refused: it turns incidental layout into authoritative architecture and misclassifies an inferred observation as an anchored claim.",
          "Adding `implements` was refused again: it would duplicate `satisfies` for contract-kind targets and make code-to-Spec realization ambiguous.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.pack-design-page",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/pack-design-page.sdp.md",
    title: "The Design Review's Pack page presents the Pack's design",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a person working in the repository read where a Pack's design stands, what holds each member below its stated next rung, what the Pack rests on, and which code answers to it, on the page the Protocol already generates.",
      },
      decision: {
        context:
          "The Design Review's Pack page lists the members with their readiness and bindings, and the verifier gaps. The first adopter designs whole capabilities ahead of their code as Packs and generates its own page beside the Design Review, walking the readiness floor one rung above the stated rung, reading what the members rest on outside the Pack, joining the open questions, and re-parsing carrier files for entry lines. Its design passes read that page first. The shipped projections are frozen, so the Pack page cannot change until a decision narrows the freeze for it.",
        decision:
          "The Design Review's Pack page renders the Pack design that `spec:consumers.pack-design` assembles: a member table in authored order with each member's stated rung, floor reached, the rung above the stated rung with the clause that holds it there, its design columns and its bindings; a section naming what holds each member below its stated next rung; the Specs outside the Pack that members rest on and that rest on members; each member's open questions with their entry addresses and source lines; and each member's realizing and referencing code units with their roles and their components' layers and contexts. The verifier gaps and findings stay. The freeze on the four shipped projections stands for everything else, the Spec page and the index included.",
        rationale: [
          "The assembly already exists as graph data and reader values, and an adopter that rebuilds it by hand evaluates the floor a second way, which can disagree with the reader's. One assembly in the reader, rendered on the page the Protocol ships, gives a reviewer the design as it stands and leaves the adopter's script nothing to recompute.",
        ],
        alternatives: [
          "Starting the Spec Studio with an HTML Pack page is closer to the original design, but the Studio is a later arc, and the Pack design data serves it unchanged.",
          "Shipping the assembly as data only keeps every projection frozen and leaves rendering to each adopter, which is the burden this record removes.",
        ],
        consequences: [
          "Line links on the page point into carrier files through the graph's location table, so the page stays a function of the graph alone.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.vault-owned-folder",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    title: "The vault's generator owns one folder and synchronizes it",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Regenerate the vault from the one graph as often as a design pass needs without ever removing or rewriting a note a person wrote in it.",
      },
      decision: {
        context:
          "Every projection root is rewritten wholesale, and every command that enters the shared build removes all of them first, because an absent view is honest and a stale one is not. A vault is different: a person keeps it open in Obsidian, keeps Obsidian's settings in it, and writes intent notes beside the generated ones.",
        decision:
          "The vault's generator owns one folder of the vault, `sdp/`, and keeps there a file list naming every file it wrote with a hash of its content. A run refuses, writing and removing nothing, while that folder holds a file the list does not name or one whose content the list does not record. Otherwise it synchronizes the folder: it writes the files whose content changed, leaves the others untouched, and removes the files it wrote that the graph no longer holds. The vault is not one of the projection roots the shared build rewrites: no build removes it, a vault directory where the build writes or removes is refused, and only the vault's synchronization writes it, whether `sdp vault` or the verb that writes every projection root runs it.",
        rationale: [
          "A wholesale rewrite removes whatever a person put in the root, and a regeneration that removes or rewrites a note a person wrote is refused.",
          "Writing only the files that changed keeps every other note's bytes and modification time, so Obsidian keeps a person's place while a pass runs; a wholesale rename shows Obsidian every note removed and created again.",
          "A list of written contents tells the generator's files from a person's without marking any note, and it is a function of the graph like the notes it lists, so the vault keeps its determinism.",
        ],
        alternatives: [
          "Rewrite the folder wholesale through a temporary sibling, as the five roots are rewritten; refused, because it moves a reader off their place and removes any note a person left in the folder.",
          "Overwrite a generated note a person changed and report it afterwards; refused, because the overwrite loses what the person wrote.",
          "Mark each generated note with a hash in its own properties; refused, because a person's copy of a generated note carries a valid mark and would be removed as stale, and the mark shows on every note.",
          "Make the vault a sixth projection root; refused, because the shared build's invalidation would remove a person's intent notes with it.",
        ],
        consequences: [
          "While a run is under way the folder may hold notes of two generations, each note whole, and the file list lets the next run recognize what an interrupted run left.",
          "A run whose extraction fails keeps the last notes and says so on the index note, so a broken carrier never empties the vault a person is reading.",
          "The vault's determinism is checked by tests, since the repository's projection suite certifies the five projection roots only.",
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/decisions/vault-owned-folder.sdp.md",
  },
  {
    id: "spec:decisions.studio-diagram-renderer",
    specKind: "decision",
    altitude: "story",
    readiness: "defined",
    title: "The engine lays out every Studio diagram as static SVG when the page set is built",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Give the Studio diagrams that a reader with only a link reads without script, that two builds of one graph draw byte for byte, and that need no layout code in the page.",
      },
      decision: {
        context:
          "The Studio's pages read in full without script and open from `file://`, two builds of one graph write the same bytes, and the custom-elements decision admits a framework runtime only through a decision that refines it. The architecture lens, a component's members, a Spec's relations and the code that realizes a Spec all need a drawing. A prototype over the Protocol's own components and the first adopter's, read through `sdp q`, measured how large those drawings are (`reviews/assets/plan46-prototypes/studio-diagrams/`).",
        decision:
          "The engine lays out every Studio diagram at build time with its own deterministic layered layout and writes it into the page as inline SVG followed by a text equivalent. The custom element that holds a diagram adds only pan, zoom and pinch, by changing the SVG's view box. One diagram draws at most the bound `spec:consumers.spec-studio.diagrams#design.bound` names, and above it the diagram folds, by context and then by layer, as that Spec states.",
        rationale: [
          "Inline SVG reads without script, prints, survives the Pack export and opens from `file://`, so the page carries no layout code and the element stays small.",
          "A layout computed from graph values, with no font, clock or random value, draws the same bytes from the same graph, which the Studio's reproducibility rule and `--check-clean` need.",
          "The bound sits between what the two corpora need and what a page reads well: in the prototype the largest real drawing is the Protocol's thirty-five-box member diagram, and a synthetic sixty-two-component drawing spanned about two and a half screen widths unfolded; nothing between forty and sixty-two boxes was measured, and the edge bound is headroom over the thirty-nine edges the largest real diagram draws.",
        ],
        alternatives: [
          "Mermaid rendered in the page needs its script and a runtime of several hundred kilobytes, lays out differently per browser, and shows nothing without script; the shipped Mermaid projection stays frozen for its own readers.",
          "A layout library such as ELK or Dagre run at build time adds a dependency whose version moves the bytes, while the Studio's diagrams need only labelled bands and a grid.",
          "Drawing on a canvas from embedded data puts the diagram out of reach of a screen reader, of print and of a reader without script.",
        ],
        consequences: [
          "The engine owns a small layout module and its tests; the layout's look is judged in review, and its determinism and fold by test.",
          "The text equivalent states every box and edge, so a diagram is never the only way to read what it shows.",
          "A change to the layout moves the Studio's bytes like any other rendering change, and `--check-clean` catches one nobody intended.",
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/decisions/studio-diagram-renderer.sdp.md",
  },
  {
    id: "spec:decisions.studio-build-renders",
    specKind: "decision",
    altitude: "story",
    readiness: "defined",
    title: "The build renders every Studio view, and an element only enhances it",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let every Studio view read in full without script, print, and travel inside a Pack export, while its custom element adds only the interaction the view needs.",
      },
      decision: {
        context:
          "The custom-elements decision frames an element as a view that renders from graph data its host page supplies. The Studio's pages read in full without script and open from `file://`, a Pack export carries no script, two builds of one graph write the same bytes, and the page computes no join, claim, fact or floor; the page elements the Studio ships already add behavior to markup the build wrote.",
        decision:
          "The build renders every Studio view into the page's markup from reader values and the recipe answers its page names, and a custom element adds only the interaction its view needs; a host page that embeds a view carries the markup the build wrote and loads the element script, and supplies no graph data.",
        rationale: [
          "A view rendered at build time reads without script, prints, survives the Pack export, and keeps one graph to one set of bytes.",
          "An element that holds no graph data cannot compute a join, claim, fact or floor in the browser, which the Studio refuses.",
        ],
        alternatives: [
          "Elements that render their views from graph data a host supplies, as the custom-elements decision first framed them, show nothing without script and put a second rendering path in the browser.",
        ],
        consequences: [
          "An element's attributes name its subject and its interaction, never a setting the build did not render, so the original's `readiness-pill`, `depth`, `highlight` and `group-by` attributes are gone.",
          "The custom-elements decision still rules how the elements are written: as custom elements without a framework.",
        ],
      },
    },
    deliveryFacts: [],
    file: "specs/decisions/studio-build-renders.sdp.md",
  },
] as const;
