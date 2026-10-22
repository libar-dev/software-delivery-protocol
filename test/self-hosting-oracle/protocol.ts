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
          "The engine applies the structural-patterns model's significance criterion: exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand; export status or import rank alone is insufficient.",
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
          "A component anchor's role names the dominant architectural responsibility its members serve together, read from their reviewed responsibilities rather than a count of role tokens. Omit the role when no responsibility dominates.",
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
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:protocol.roadmap-replaces-plans",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/protocol/roadmap-replaces-plans.sdp.md",
    title:
      "The Protocol reads its next work from its roadmap and keeps its delivery record in git and its pull requests",
    narrative:
      "Each arc's intent already lives in its capture Specs and Pack, its rulings in their carrying Specs, and its story in its pull request description. What a plan file still carries is the status line agents read first, the lanes and waves of the arc, and copies of ruling tables; what a committed review file carries, a change proposal, its memo and git already hold. Once a roadmap holds priority, the Protocol reads its next work from the graph, keeps each arc's record in git and its pull request, with review findings and evidence beside the story, and lets the plan and review files stand as the record of how earlier arcs were run. The Protocol keeps one living roadmap: its owner selects what it lists, and the pull requests that complete that work remove it.",
    sections: {
      intent: {
        actor:
          "An agent or a person opening, reviewing or resuming the Protocol's work, and the owner keeping its order.",
        problem:
          "The handbook points every session at the newest plan file and keeps a status line for each, and a gate requires both, so forward planning lives in prose beside the graph that already holds the arc's intent, and committed review files repeat what change proposals, git and the pull request already carry.",
        outcome:
          "Let an agent opening the Protocol's next work read it from the roadmap recipe, review and recover an arc from git and its pull request, and keep the plan and review files as frozen history no gate requires to grow.",
      },
      behavior: {
        rules: [
          "An agent opening the Protocol's next work runs the roadmap recipe over the roadmap Pack the handbook names and follows each entry to its Packs and carrying Specs; no plan file answers for forward work.",
          "The Protocol keeps one living roadmap Pack, edited in place. Its owner selects captured work for the upcoming pull requests; landing a capture does not add it. Entries leave by an ordinary manifest edit when the selected work is complete or no longer belongs among the next work, and move on the owner's word, with git as history.",
          "`plans/` and `reviews/` keep the plans and review records of the arcs that had them as history until a cleanup arc removes or archives them; no file is added to either, and a file in either changes only to correct the record it keeps.",
          "Before an arc's first push its record is its branch, git being the event log: the first commit message states the owner's working rules for the arc and the arc's Pack, each later message says what its unit did, and outstanding work is read from the arc's Pack, the backlogs and the open-question register; no record file is kept under `reviews/` or anywhere else. The arc pushes and opens its draft pull request at its first coherent commit, normally the scaffold, so the window in which only local git holds the record stays short and a session restarted on another machine sees the work. The draft pull request description then holds the record: its branch and base, working rules, lanes, the rulings with who made them, review findings as change proposals and their memos, acceptance as measured, deferrals and refusals. A session resuming without its predecessor's context reads the branch, its commits, the draft pull request and the graph, and never claims git kept what was never committed. The authority to commit and push comes from the owner's instruction for the arc, never from this rule, and no check reads the record.",
          "A review's findings against Specs travel as one change proposal in the shape `spec:consumers.intent-composition.proposal` states, whose base is the branch-head commit the reviewer read, never a preview's merge commit; the proposal check runs it against the graph at that base, a moved, unresolved or incomparable scope is read again before its change applies, and its memo, as `spec:consumers.intent-composition.proposal.memo` renders it, is posted to the pull request. A finding against code or another file is a review comment on its line, and a review that proposes no Spec edit has no proposal. The commit that applies a proposal carries its reason line and base, and whether a change was accepted stays in the pull request's discussion and git, never in the proposal or the graph. No review file is committed, and a brief or prompt stays in the session that used it.",
          "A finding left open against intended design becomes an open question on its carrying Spec with its `decider`, `provisional` reading and `links`, and a deferral is a blocking question with its re-entry `trigger`; a code defect against settled intent stays a code finding until it is repaired and never becomes an invented design question.",
          "Evidence no test or recipe carries, such as a prototype of a view not yet built, an adopter measurement's raw output or a screenshot for the description, is committed on the arc's branch with the commands that made it, linked from the description at that commit, and removed before the merge; the merge keeps the commit reachable, so the link lasts.",
          "An arc's acceptance links its bound examples and their run evidence, and re-derives each recipe measurement at the commit the description names, with its commands, never inheriting an earlier result. A run record is evidence from its test file as `spec:observation.run-evidence` reads it, never a verdict for one verifier, and it counts as evidence for a preview only when its recorded commit is the commit the preview's stamp names; a preview stays a current view, never an acceptance record.",
          "Each description's forward section is the roadmap memo rendered at the branch's head, with the re-entry condition, the owner's reason for each entry's place and the refused list in the author's words around it; the pull request that completes an entry's selected work removes it from the roadmap in the same change, entries join or move only on the owner's word, and nothing checks either.",
          "The handbook names the roadmap Pack and the roadmap recipe where it named the current plan, and keeps no status line for any plan.",
          "The self-hosting gate's current-record check refuses a handbook that does not name the roadmap Pack or the roadmap recipe, and a roadmap Pack manifest that is missing or does not state `order: priority`; it keeps the frozen historical checks, the documented green-gate legs, and the ban on plan status in the decision registry and the glossary until the cleanup arc removes the folders they read. It checks no plan number, roadmap content, freshness, work order or review disposition.",
        ],
        ruleKeys: {
          readsRoadmap: "rules[0]",
          oneRoadmap: "rules[1]",
          plansFrozen: "rules[2]",
          executionRecord: "rules[3]",
          reviewFindings: "rules[4]",
          openFindings: "rules[5]",
          evidence: "rules[6]",
          acceptance: "rules[7]",
          forwardSection: "rules[8]",
          handbookPointer: "rules[9]",
          gateRecord: "rules[10]",
        },
      },
      design: {
        roadmapPack: "`pack:roadmap`, carried by `specs/roadmap.pack.sdp.md`.",
        handbookTokens:
          "the gate reads the handbook for the strings `pack:roadmap` and `recipe 53`, and the roadmap Pack's manifest for a frontmatter line `order: priority`.",
        gateMessages:
          "`AGENTS.md — the handbook does not name the roadmap Pack`, `AGENTS.md — the handbook does not name the roadmap recipe`, `specs/roadmap.pack.sdp.md — the roadmap Pack's manifest is missing`, and `specs/roadmap.pack.sdp.md — the roadmap Pack's manifest does not state order: priority`.",
      },
      verification: {
        mode: "reviewed",
        criteria: [
          "Resume an arc from its branch and draft pull request alone, reading the tree, its commits and the graph, and name any context that lived only in the earlier session.",
          "Run the gate with a handbook that does not name the roadmap Pack and with a roadmap manifest that does not state `order: priority`, and see each refused; an empty roadmap, a built entry and an order contrary to dependency add no finding.",
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
