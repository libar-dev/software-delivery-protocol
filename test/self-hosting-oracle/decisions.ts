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
          "Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option. Later refinements keep this default and the one-surface law without repealing them: the Pack syntax ruling completes Pack Markdown, and the Gherkin carrier option admits graph-aware Gherkin as a lawful per-ID option for behavior and example Specs only, with the canonical suffix settled as `.sdp.gherkin`.",
        rationale: [
          "An owned grammar and a permanent kind split both add surface cost without a demonstrated expressive gain, while retiring the DSL removes a useful bounded option. Bounding Gherkin to behavior and example Specs preserves the same trade-off — a second parser only where BDD-native readability earns it — rather than pretending every kind has a natural Gherkin shape.",
        ],
        consequences: [
          "Each ID has one canonical surface, and Markdown tooling is the default path for authored Specs.",
          "Gherkin does not flip the default carrier, does not extend kind coverage by itself, and does not reopen dual-source truth; the carrier-universality ruling (spec:decisions.carrier-universality) reaffirms the behavior/example kind bound, keeps Markdown as default, defines universal as a generated Gherkin-shaped read projection, and leaves Packs to MD-25.",
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
          "The canonical discovered suffix is settled separately as `.sdp.gherkin` (MD-28); this option does not itself choose a file extension, flip the default carrier, or extend kind coverage. The carrier-universality ruling (spec:decisions.carrier-universality) reaffirms that kind bound with per-kind honesty reasons, admits Feature/Scenario description prose only on MD-19 owners while keeping DocStrings and DataTables refused, defines universal as a generated read projection, keeps Markdown as default, and places Packs outside this option.",
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
          "Collision safety outranks default editor recognition before external adoption freezes the suffix. Compound extensions already identify Markdown and TypeScript carriers without test-glob collisions; applying the same pattern to Gherkin keeps one discovery walk honest. Teams that want highlighting can associate `*.sdp.gherkin` with Gherkin in the editor, while Cucumber's default `*.feature` globs stay clear of Protocol carriers.",
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
          'MD-27 admitted graph-aware Gherkin only for behavior and example Specs so the corpus would not pretend every kind has a natural Gherkin shape. Owner pressure for one preferred format asks whether that kind bound should be overturned, whether rich content may live inside the carrier, what "universal" means, whether Markdown remains the default, and whether Packs are in scope. The kind-evidence table, the structural collisions in the current Gherkin grammar (Feature = behavior, Scenario = example, Rule: = behavior.rules, one file = one Feature parent), review 14 §2.3, and the v0 projection record are the evidence on the table. MD-27\'s own rationale is the thing this session overturns or reaffirms, kind by kind.',
        decision:
          'In order, first, Gherkin remains an honest canonical per-ID option only for `behavior` (Feature) and `example` (ordinary Scenario); the other six kinds stay Markdown because a Gherkin mapping would lie against the kind-evidence table — `workflow` has no distinct Gherkin root and Feature mapping erases the kind; `rule` collides with `Rule:` already consumed as inline `behavior.rules`; `constraint` needs machine-readable targets a Scenario cannot own; `model` needs keyed terms; `decision` needs context/decision/rationale/consequences (and supersedes) that Feature structure cannot distinguish; `contract` shares the behavior family row today but Feature cannot structurally mark the kind. Second, rich content is ruled by physical form: Feature and Scenario description prose (keyed description bullets and remaining non-heading prose) is lawful only as free prose on MD-19\'s existing owners — narrative or description on the typed owner — never a new field and never a parser-within-a-parser beyond enumerated constructs; Gherkin DocStrings and DataTables remain refused. Third, "universal" means per-ID carriers plus a generated Gherkin-shaped READ projection of any Spec (visibly generated, disposable, lossy commentary allowed for refused kinds), not one default authored carrier for everything and not a lossless codec. Fourth, the corpus default does not flip: Markdown remains the default Spec carrier; a default flip is refused before full honest round-trip exists. Fifth, Packs are out of this ruling; MD-25 remains the Pack carrier law.',
        rationale: [
          'This is hard to reverse because kind coverage, default posture, and the meaning of universality become contracts for authoring guidance, extraction, projections, and later follow-through — flipping them later would churn every carrier surface and every consumer that trusted the bound. It is surprising without context that "universal" is a generated read projection rather than one authored format, that six kinds stay Markdown on honesty grounds rather than missing syntax, and that description prose is admitted only onto already-owned MD-19 slots while DocStrings and DataTables stay refused. It is a real trade-off: one preferred stakeholder shape is worth a bounded second parser and a generated view, while refusing dishonest kind mappings, a default flip, self-executing prose, DocString/DataTable expansion, and Pack absorption gives up format uniformity to keep one graph language and the kind-evidence table honest. MD-27\'s rationale is therefore reaffirmed and sharpened, not overturned.',
        ],
        consequences: [
          "`spec:carrier.gherkin-authoring` remains the surface that records the closed grammar: structural kinds for behavior and example only, title-only Rules as `behavior.rules`, description prose on MD-19 owners only, DocStrings and DataTables refused, physical source locations preserved, and the hard cap of 100 independent semantic findings retained.",
          "A generated Gherkin-shaped projection may render any Spec for reading; it never uses `.sdp.gherkin` in an authored tree, never claims round-trip parity, never becomes a second source of truth, and may mark refused kinds with lossy commentary.",
          "Markdown stays the default Spec carrier (MD-18); the Gherkin option stays opt-in per ID for behavior and example only (MD-27); MD-28's `.sdp.gherkin` suffix, dual-recognition refusal, and bare-`.feature` non-canonicity are untouched.",
          "Packs stay under MD-25; this Spec neither admits a Gherkin Pack surface nor reopens the Pack Markdown envelope.",
          "Execution and `has-verifier` stay behind generated contracts and resolving anchored handlers; Gherkin prose does not execute; authored delivery status, lifecycle tags, value-transfer deletion, Scenario Outlines, Examples tables, backgrounds, star steps, and leading conjunctions stay refused.",
          'Follow-through amends carrier grammar and optional projection emitters only along the branches this Spec names; it does not reopen the suffix ruling or reintroduce blanket "Gherkin declined" current-intent language.',
        ],
        alternatives: [
          "Making Gherkin the default authored carrier for every kind would satisfy the one-preferred-format desire, but would force dishonest Feature mappings for six kinds and an XL migration before round-trip honesty exists.",
          "Admitting DocStrings or DataTables as authored rich content would look more BDD-native, but would invent structure outside MD-19's prose owners and reopen a parser-within-a-parser the closed grammar refuses.",
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
    id: "spec:decisions.structural-anchor-semantics",
    specKind: "decision",
    altitude: "feature",
    readiness: "ready",
    file: "specs/decisions/structural-anchor-semantics.sdp.md",
    title: "Structural anchor semantics",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Resolve which intent-free structural relationships code anchors may author without creating a second architecture truth.",
      },
      decision: {
        context:
          "The generic `codeAnchor` already binds realization to a Spec through `satisfies`, while the reserved structural-semantics question leaves component membership and dependencies between anchored code units unresolved. Gen-1 also used `@architect-implements` to join separate test-pattern identities, not code to Spec, and exposed authored `uses` relationships through a broad tag registry.",
        decision:
          "In order, first, `satisfies` remains the only code-to-Spec realization slot: code that realizes a contract-kind Spec satisfies that Spec by authoring convention, so no `implements` field is admitted. Second, `component` and `uses` enter the `codeAnchor` contract as the only new structural fields. Third, their value forms are closed graph-ID references: `component?: ComponentAnchorId` is one statically reifiable reference, and `uses?: readonly CodeAnchorId[]` is a statically reifiable array of references; neither field accepts free strings or an enum detached from graph identity. Fourth, the structural references derive only the anchored `memberOf` and `uses` edges under the validation rules below. Fifth, the census always derives their taxonomy and rows from the graph and runtime constants; it is generated, disposable, and never hand-maintained.",
        rationale: [
          "This is hard to reverse because the anchor authoring API and persisted edge vocabulary become contracts for source, validators, queries, and projections. It is surprising without context that contract realization remains `satisfies`, that a dependency cycle is accepted, and that structural edges confer no realization state. It is a real trade-off: local authored structure and referential checks justify two narrow fields, while rejecting `implements`, inference, lifecycle metadata, and an open tag system gives up looser notation to preserve one graph language. The caution is gen-1's taxonomy drift: a claimed 50 tags was corrected to about 26 while inconsistent counts remained (`reviews/14-executable-verification-design-review.md`, which cites the gen-1 formal-spec findings review); generated census output is therefore evidence, never another registry.",
        ],
        consequences: [
          "Every `component` and `uses` target must exist as a `CodeNode`; a dangling graph ID is an error. A `memberOf` edge runs only from an `impl:` or `api:` `CodeNode` to a `component:` `CodeNode`, and each source has at most one component, enforcing one-level membership: a `component:` node cannot itself be a member. A `uses` edge runs between `CodeNode` endpoints whose IDs use the `impl:`, `api:`, or `component:` namespace.",
          "A present `uses` array must be non-empty and contain unique targets. Structural edges must be unique, and any structural self-reference is an error. Multi-node `uses` cycles remain authored data for census projection, not validator findings; validators do not infer transitive edges or reject cycles.",
          "The census renders the admitted structural bindings from graph edges, including component membership and uses relationships, and reports an explicit empty state when none exist. It may group cycles as data, but it neither re-derives validation findings nor owns a manually curated taxonomy.",
          "The new fields extend `codeAnchor` only; there are no per-namespace sibling anchor builders.",
          "The new edges are anchored claims only, never inferred claims; deriving architecture from imports is refused, because these edges are authored declarations in code. Derivation remains a mechanism and does not add a fourth claim.",
          "Anchors carry no intent, readiness, status, or delivery fact. `memberOf` and structural `uses` mint no delivery facts, add no delivery status, and do not change readiness floors.",
          "No free-form tag vocabulary, authored lifecycle, or parallel registry is admitted.",
          "Foreign fields remain extraction errors; after admitting `component` and `uses`, the anchor envelope remains closed and a malformed structural field refuses the whole anchor rather than yielding a partial declaration.",
          "Anchor-required lint remains warn-level and optional; absence of an anchor is useful evidence but never a load-bearing workflow gate.",
        ],
        alternatives: [
          "Adding `implements` would mirror gen-1 terminology, but would duplicate `satisfies` for contract-kind targets and make code-to-Spec realization ambiguous.",
          "Deriving dependencies from imports would increase coverage without annotations, but would turn incidental runtime wiring into authoritative architecture and misclassify an inferred observation as an anchored claim.",
          "Closed enums or free-form tags would be easy to author, but would not resolve to graph nodes and would recreate the taxonomy-governance failure this decision is intended to avoid.",
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
          "An earlier projection-settling record refused re-specifying the four shipped projections, and the adoption register carried that refusal as a standing do-not-reopen row, but the refusal lived only as plan prose the graph could not check.",
        decision:
          "Re-specifying the shipped Design Review, census, Mermaid, or Gherkin projection is refused. These four projections are the ruled read surfaces over the one graph, and the ruling reopens only through a later decision Spec that supersedes this one and passes the ADR three-part test.",
        rationale: [
          "The four projections are shipped, curated read surfaces over the one graph. Re-specifying them re-litigates settled law and risks a second truth store, while a graph-checkable decision record carries the refusal where agents and validators can read it.",
        ],
        consequences: [
          "Plans treat the four projections as settled read models. Any proposal to reshape one of them arrives as a superseding decision record, never as a follow-up work item.",
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
          "Give every planning-truth type one ruled home in the graph so plans stay thin lineage pointers and the briefs index shape is retired as a carrier of law.",
      },
      decision: {
        context:
          "The prose briefs index carried dependency maps, decision gates, do-not-reopen rows, re-entry triggers, ownership rulings, selection-pressure heuristics, and session law, but none of those truth types had a ruled home in the graph, so plan documents drifted into carrying law the graph could not check.",
        decision:
          "Each planning-truth type lives in its ruled home. Work-item dependency truth rides `dependsOn` edges, with independence as absence of the edge and scheduling phrases never authored. Decision gates live on `decision`-kind Specs, linked by `decidedBy`. Do-not-reopen rows split by what they carry: a tradeoff refusal becomes a `decision`-kind Spec and reopens only through a later decision that `supersedes` it under the ADR three-part test; a row that restates a behavior guarantee already homed on a carrying Spec, including the runnable-modules extraction rows, stays on that Spec and changes by ordinary Spec revision; the bySymbol impact-graph row remains a blocking hold on `spec:consumers.impact-graph` and is never minted as a decision. A lawful non-decision stays in the plan record as evidence. Re-entry triggers are the deferred Spec's own blocking open questions plus `dependsOn` for a true precondition. Exclusive ownership is one Spec identity per deliverable with consumers depending on it. Selection-pressure heuristics are advisory only, carried as behavior rules on the graph-first planning Spec or in recipes. Session law splits separately, across behavior rules on the graph-first planning Spec, the on-ramp handoff rule, and the thin plan file. The briefs index shape is retired as a carrier of law.",
        rationale: [
          "The closed six-relation vocabulary already expresses every ruled home, so the ruling costs no engine work and keeps planning prose free of sequencing authority. New relation types such as `precedes`, `inArc`, or `forbids` were refused: each one is engine surface across the model, parser, extraction, validators, oracle rosters, and agent-surface docs, buying machine-checkable planning relations the corpus does not need. A `constraint`-kind home for refusals was refused because refusals are decisions. A single session-law home was refused because the planning Spec must not own per-session routing.",
        ],
        consequences: [
          "Plans stay thin lineage pointers and the do-not-reopen register lives across its ruled homes: tradeoff refusals in decision Specs, already-homed guarantees on their carrying Specs, and the impact-graph row as a blocking hold. This ruling reopens only through a later `decision`-kind Spec that supersedes this one and itself passes the ADR three-part test.",
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
