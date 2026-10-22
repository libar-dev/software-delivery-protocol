// The authored descriptors of the `protocol` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const protocolSpecs = [
  {
    id: "spec:protocol.self-hosting",
    specKind: "behavior",
    altitude: "epic",
    readiness: "ready",
    file: "specs/protocol/self-hosting.sdp.md",
    title: "The Protocol authors and validates itself",
    narrative:
      "The Protocol's own delivery model exercises the same carrier, graph, checks, and projections offered to consumers.",
    sections: {
      intent: {
        outcome:
          "Show that the Protocol carries its own intended truth through the extraction, validators and projections it offers adopters.",
      },
      behavior: {
        rules: [
          "All authored carriers derive one regenerable graph through one validation path.",
          "Self-hosting remains deterministic in a clean clone.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:protocol.structural-self-binding",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/protocol/structural-self-binding.sdp.md",
    title: "The engine's structural self-binding covers its architecturally significant units",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Structural recipes, the census and the Design Review answer architecture questions about the engine from its own anchors.",
      },
      behavior: {
        rules: [
          "The engine applies the structural-patterns model's significance criterion: exported public surface or cross-component reach.",
          "Every architecturally significant engine unit carries component membership through a realizing anchor; a helper with no realization target of its own is covered through the nearest realization anchor that consumes it.",
          "An architectural dependency of the engine is declared as `uses`, normally from one engine component to another; a unit's own `uses` is optional.",
          "A component-level `uses` declaration tracks real value or type imports from another component's source files; imports made only to author anchors through the stable-id or anchor-builder modules confer no edge.",
          "The accepted set of architecturally significant engine units is an owner-reviewed declaration among the self-hosting suite's pinned expectations, never derived from imports or exports; the suite checks every accepted unit's declared membership and rejects unrostered membership edges.",
          "Every engine `component:` anchor declares its `layer` and its `context`.",
          "Every architecturally significant engine unit carries a `role`.",
          "A unit reaches the decisions that shape it through the Specs it satisfies and their `decidedBy` relations, and may reference a decision directly when it answers to that design. A unit satisfies a Spec when it realizes at least one promise of it, and the satisfying units together realize every promise; a unit that follows a design without realizing a promise references it. Code never satisfies a decision Spec. A design that builds on existing code states that through its own `dependsOn` or `refines` to the Spec the code satisfies.",
        ],
        ruleKeys: {
          criterion: "rules[0]",
          membership: "rules[1]",
          architecturalUses: "rules[2]",
          componentUses: "rules[3]",
          acceptedSet: "rules[4]",
          layerAndContext: "rules[5]",
          role: "rules[6]",
          decisionReferences: "rules[7]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:protocol.significant-units-review",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/protocol/significant-units-review.sdp.md",
    title: "The engine's accepted set covers its significant abstractions and only those",
    narrative:
      "A designer needs to find the contracts, decisions and stages a change must preserve. The accepted set records those units on the code that owns them. Exporting a helper, appearing in an import ranking or giving a file an impact answer does not by itself earn an identity.",
    sections: {
      intent: {
        outcome:
          "Keep the accepted set focused on the engine's significant contracts, decisions and stages, with meaningful roles and architectural uses, and exclude units anchored only for coverage.",
      },
      behavior: {
        rules: [
          "Apply the structural-patterns criterion to the public contract or cross-component responsibility a unit owns. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters qualify when changing them requires a designer or builder to understand that responsibility; being exported alone is insufficient.",
          "Leave forwarding barrels, empty element registrations, mechanical wrappers, formatting helpers and generated files unanchored unless they own an independent contract or architectural responsibility. A coverage target, test expectation, file count or desired impact answer never establishes significance.",
          "Declare a component uses for a value or type import the importing file itself makes from another component's file. An import made only to author anchors, and a pair the imports adapter reports only through a re-export the importer does not use, confer no edge. Before calling a declared edge stale, inspect input omissions and every file the comparison leaves unassigned. Import evidence proposes an edit and never authors an edge.",
          "The self-hosting suite pins the reviewed component identities, unit ownership, roles, uses and deliberate membership exceptions independently of extraction. It compares the graph with those declarations and rejects unrostered membership. It never derives its expected roster from paths, exports, imports or the graph under test.",
          "The accepted set is the annotation review's change table as the owner accepted it: its additions, merges, drop, role changes and component uses, each realization claim it names kept.",
          "The example-space decoder joins the reader component, leaving notation a leaf codec, only when the architecture crossings recipe and the self-binding tests show that the move adds no layer crossing; otherwise it stays in notation, its real imports are declared, and the uses cycle they form stays lawful data.",
          "Read role meanings from the engine's role-vocabulary Model when reviewing its anchors. The vocabulary guides authors and reviewers; the Protocol never validates membership in it.",
        ],
        ruleKeys: {
          significantAbstractions: "rules[0]",
          curatedBoundary: "rules[1]",
          dependencyEvidence: "rules[2]",
          rosterOracle: "rules[3]",
          acceptedChanges: "rules[4]",
          decoderBoundary: "rules[5]",
          roleMeaning: "rules[6]",
        },
      },
      design: {
        rosterSource:
          "The self-hosting oracle holds the accepted roster: each row names an accepted unit's anchor, its component and its file, and its expectations for components, membership, uses, exceptions, coarse-grain coverage and roles sit beside it. A symbol suffix is a review locator, never extracted symbol identity.",
      },
      verification: {
        mode: "reviewed",
        criteria: [
          "Compare the independently reviewed accepted roster with the source responsibilities it names, including dependencies that an imports comparison cannot assign to components.",
          "Check that every proposed merge or drop preserves the whole-Spec realization set it claims to preserve and that every architectural uses pair has supporting value or type imports beyond anchor authoring.",
          "Compare the extracted graph with the independently reviewed oracle roster after anchor changes; exercise a missing accepted member and an extra unrostered membership to show that the roster comparison detects both.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:protocol.role-vocabulary",
    specKind: "model",
    altitude: "feature",
    readiness: "ready",
    file: "specs/protocol/role-vocabulary.sdp.md",
    title: "The engine's architectural roles each name one pattern",
    narrative:
      "Authors choose a role by the architectural responsibility a unit owns. The same responsibility uses the same word across the engine. These definitions are this corpus's design vocabulary, not a Protocol enum or a registry a validator checks. An adopter may use other roles for its own architecture.",
    sections: {
      intent: {
        outcome:
          "Define each architectural role the engine's anchors use, so the accepted set of significant units reads as a curated register of the engine's patterns and abstractions.",
      },
      model: {
        terms: {
          adapter:
            "Connects an external tool or runtime to an engine contract, such as a test runner or a TypeScript import reader.",
          codec:
            "Parses, normalizes or encodes a representation while preserving the meaning owned by its contract, such as ids, carrier text, parameter input or source links.",
          contract:
            "Owns a shared interface, data shape, closed vocabulary or public boundary that independently developed callers and providers must agree on.",
          decider:
            "Computes a semantic answer from explicit inputs without reading or writing external state, such as delivery facts or example eligibility.",
          extractor:
            "Reads authored carriers or source bindings, or composes their reified results, into the graph and its located evidence.",
          interaction:
            "Adds browser controls and feedback to build-rendered content without owning its graph joins or layout. This is a corpus role for optional element behavior.",
          projection:
            "Derives read-only presentation or generated contract content from the graph, the reader or an explicitly supplied answer. A page fragment and a complete page use the same role when both own presentation.",
          publisher:
            "Writes or synchronizes an owned artifact set, including its path checks, replacement, recovery and clean comparison.",
          index:
            "Builds a disposable lookup structure over the graph for the units that query it; it holds no authored state and is never a second read model.",
          reader:
            "Answers queries over graph content, resolving or joining recorded identities and bindings without reading source files.",
          service:
            "Coordinates a use case or pipeline across collaborators, including execution and failure handling, while each collaborator owns its own contract.",
          validator:
            "Evaluates a stated contract and reports its failures, including readiness clauses, import fidelity and corpus-selected checks. A role does not determine a Protocol validator family.",
        },
        termKeys: {
          adapter: "adapter",
          codec: "codec",
          contract: "contract",
          decider: "decider",
          extractor: "extractor",
          interaction: "interaction",
          projection: "projection",
          publisher: "publisher",
          index: "index",
          reader: "reader",
          service: "service",
          validator: "validator",
        },
      },
      design: {
        roleChoice:
          "Use the dominant responsibility of the anchored unit. A catalog of shared shapes is a contract, a table computing a semantic answer is a decider, and a failure-producing check is a validator. File size, caller count and naming style never select a role.",
        componentRole:
          "A component anchor's role names the dominant responsibility of its members as a group, read from the reviewed member roles; a component whose members split evenly states no role.",
        presentationWord:
          "Use projection for pure page, fragment and text-equivalent rendering. Use publisher for filesystem publication, codec for representation encoding and interaction for optional DOM behavior; a unit that presents uses projection, never renderer.",
        helperWord:
          "Choose a specific responsibility after reading the code. Graph indexes use index, concept queries use reader, parameter and path encoders use codec, browser controls use interaction and test-runtime integration uses adapter.",
        freeVocabulary:
          "These Model terms explain the engine's role values. Token grammar remains the only Protocol check on role, omission remains lawful, and this Model is not an allowlist.",
      },
      verification: {
        mode: "reviewed",
        criteria: [
          "Compare the graph's role taxonomy with these meanings and review every renamed unit against its implementation; keep an unfamiliar adopter role visible without reporting a Protocol finding.",
          "Check that pure presentation uses projection across the Markdown and Studio implementations, and that publication and optional browser interaction retain their distinct responsibilities.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:protocol.capability-epics",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/protocol/capability-epics.sdp.md",
    title: "The Protocol organizes its own features in capability epics",
    narrative:
      "An epic states an enduring intended outcome. Where an existing hub owns an outcome, enlarging its altitude preserves its identity, kind, evidence and bindings. Self-hosting describes the Protocol using itself; it is not the parent of every capability offered to an adopter.",
    sections: {
      intent: {
        outcome:
          "Organize the Protocol's capabilities through explicit refinement so a reader can choose a capability and inspect its design and bindings.",
      },
      behavior: {
        rules: [
          "Enrich an existing hub to epic altitude when its intended outcome already names the capability. Keep its id, kind and truth; author a new epic only when no existing Spec owns that outcome. A model or rule can be an epic without becoming behavior merely to appear in the map.",
          "Each feature belongs under the epic whose intended outcome it makes more precise, directly or through intermediate Specs. Existing genuine refinement remains, including a nested epic and multiple parents. A Pack, path or dependency alone does not establish that relationship.",
          "The self-hosting epic keeps the Protocol's own use of the carrier, structural binding, roadmap and capability organization, and the decisions about that practice and the Protocol's identity. General model, derivation, validation and projection capabilities no longer refine self-hosting merely because the corpus exercises them.",
          "A re-altituded hub keeps its readiness statement when its content still supports it; reparenting confers no delivery fact and adds no anchor.",
        ],
        ruleKeys: {
          epicHome: "rules[0]",
          refinement: "rules[1]",
          selfHosting: "rules[2]",
          preserveEvidence: "rules[3]",
        },
      },
      design: {
        epicHome:
          "reuse an existing outcome owner so altitude changes do not duplicate intent; add an epic only for an outcome no hub already states. Design iteration has no epic: no Spec owns that outcome, its features are views and reader recipes that refine the projection and agent capabilities, and its Pack already groups them for review.",
        carrierHome:
          "the Markdown hub names the default authoring entry, while its rule puts Markdown and TypeScript on one graph path and its carrier ruling admits Gherkin. Its existing descendants refine that shared authoring outcome, so it keeps its identity and title.",
        executableHome:
          "the runner owns step dispatch and failure rendering, and contract generation owns typed contracts. Neither owns the whole outcome of executing an example against its authored intent, so a separate executable-examples epic joins those refinements. Their other genuine refinement and dependency relations remain.",
        nestedEpic:
          "the agent capability remains a refinement of the projection capability because scripted graph access is a consumer-specific view. Its descendants belong to both epic scopes, and the map reports that overlap explicitly.",
        corpusChecks:
          "corpus-selected rules refine the agent capability because their intended operation is scripting the graph; the validation command is their host, while their findings remain outside the Protocol's conformance and honesty families. A refinement states the narrower outcome and a dependency states what must hold: both relations intentionally connect the build pipeline to derivation, corpus rules to the agent capability, and architecture and external-register checks to corpus rules.",
      },
      verification: {
        mode: "reviewed",
        criteria: [
          "Re-measure the corpus's refinement transitions, roots, overlapping parents and epic reach from the graph.",
          "Every previously ready Spec still states ready and reaches the ready floor after the edits; the drift alarm stays empty.",
          "Compare the capability map before and after authoring the epics, and read the same projection on an adopter with one broad epic without changing its intent.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:protocol.roadmap-replaces-plans",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/protocol/roadmap-replaces-plans.sdp.md",
    title: "The Protocol reads its next work from its roadmap, and its plan files are history",
    narrative:
      "Each arc's intent already lives in its capture Specs and Pack, its rulings in their carrying Specs, and its story in its pull request description. What a plan file still carries is the status line agents read first, the lanes and waves of the arc, and copies of ruling tables. Once a roadmap holds priority, the Protocol reads its next work from the graph and lets the plan files stand as the record of how earlier arcs were run. The Protocol keeps one living roadmap: its owner selects what it lists, and the pull requests that complete that work remove it.",
    sections: {
      intent: {
        actor:
          "An agent or a person opening the Protocol's next body of work, and the owner keeping its order.",
        problem:
          "The handbook points every session at the newest plan file and keeps a status line for each, and a gate requires both, so forward planning lives in prose beside the graph that already holds the arc's intent.",
        outcome:
          "Let an agent opening the Protocol's next work read it from the roadmap recipe, and keep the numbered plan files as frozen history no gate requires to grow.",
      },
      behavior: {
        rules: [
          "An agent opening the Protocol's next work runs the roadmap recipe over the roadmap Pack the handbook names and follows each entry to its Packs and carrying Specs; no plan file answers for forward work.",
          "The Protocol keeps one living roadmap Pack, edited in place. Its owner selects captured work for the upcoming pull requests; landing a capture does not add it. Entries leave by an ordinary manifest edit when the selected work is complete or no longer belongs among the next work, and move on the owner's word, with git as history.",
          "`plans/` keeps the plans of the arcs that had one as history; no plan file is added, and a plan file changes only to correct the record it keeps.",
          "An arc's execution record, its branch and base, its working rules, its lanes, the rulings with who made them, its acceptance as measured, its deferrals and its refusals, lives in its pull request description, opened as a draft at the arc's first authorized push. Before that push it lives in the arc's record file under `reviews/`, with the work done and outstanding and the commands that re-measure it; at the first authorized push the record moves into the draft pull request and the file keeps only its link. Nothing here authorizes a push, and no check reads the record. Evidence no test or recipe carries sits under `reviews/` beside the description that cites it.",
          "Each description's forward section is the roadmap memo rendered at the branch's head, with the re-entry condition and the refused list in the author's words around it; the pull request that completes an entry's selected work removes it from the roadmap in the same change, entries join or move only on the owner's word, and nothing checks either.",
          "The handbook names the roadmap Pack and the roadmap recipe where it named the current plan, and keeps no status line for any plan.",
          "The self-hosting gate's current-record check refuses a primary-numbered plan above the last frozen plan, a handbook that does not name the roadmap Pack or the roadmap recipe, and a roadmap Pack manifest that is missing or does not state `order: priority`; it keeps the frozen historical checks, the documented green-gate legs, and the ban on plan status in the decision registry and the glossary.",
        ],
        ruleKeys: {
          readsRoadmap: "rules[0]",
          oneRoadmap: "rules[1]",
          plansFrozen: "rules[2]",
          executionRecord: "rules[3]",
          forwardSection: "rules[4]",
          handbookPointer: "rules[5]",
          gateRecord: "rules[6]",
        },
      },
      design: {
        roadmapPack: "`pack:roadmap`, carried by `specs/roadmap.pack.sdp.md`.",
        recordFile:
          "`reviews/<name>-record.md`, `<name>` the arc's Pack id after `pack:`; before the arc's first authorized push it holds the branch and base, the owner's working rules for the arc, the work done and outstanding, uncommitted state with no clean boundary, and the commands that re-measure the arc; after that push it holds one line linking the draft pull request.",
        handbookTokens:
          "the gate reads the handbook for the strings `pack:roadmap` and `recipe 53`, and the roadmap Pack's manifest for a frontmatter line `order: priority`.",
        frozenCeiling:
          "the number of the last frozen plan is a constant of the gate, set when the gate changes; a file under `plans/` whose name opens with a number above it, zero-padded or not, is refused, and a letter-suffixed or unnumbered file is not read.",
        gateMessages:
          "`plans/<name> — a numbered plan above the last frozen plan; forward work reads from the roadmap`, `AGENTS.md — the handbook does not name the roadmap Pack`, `AGENTS.md — the handbook does not name the roadmap recipe`, `specs/roadmap.pack.sdp.md — the roadmap Pack's manifest is missing`, and `specs/roadmap.pack.sdp.md — the roadmap Pack's manifest does not state order: priority`.",
      },
    },
    deliveryFacts: [],
  },
] as const;
