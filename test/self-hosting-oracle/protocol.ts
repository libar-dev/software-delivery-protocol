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
    readiness: "idea",
    file: "specs/protocol/significant-units-review.sdp.md",
    title: "The engine's accepted set covers its significant abstractions and only those",
    narrative:
      "The engine anchors more than two hundred units in fourteen components, and declares far fewer `uses` between them than its imports show. A unit anchored because it exists is noise; a port, a pipeline stage or a shared data shape left bare is a gap a designer stumbles over. The accepted set is the owner-reviewed register of what is significant: every entry earns its place, and every significant abstraction has one.",
    sections: {
      intent: {
        outcome:
          "Review every engine anchor and every unanchored abstraction against the significance criterion, so the accepted set names the engine's ports, contracts, pipeline stages and shared shapes with their roles and architectural uses, and drops units anchored for coverage.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:protocol.role-vocabulary",
    specKind: "model",
    altitude: "feature",
    readiness: "idea",
    file: "specs/protocol/role-vocabulary.sdp.md",
    title: "The engine's architectural roles each name one pattern",
    narrative:
      "The engine's anchors carry a dozen role values, from `projection` to `decider`, and the census counts them, but no Spec says what each one means, so two authors can file the same kind of unit under different roles. The roles are the corpus's own vocabulary: a Model of them is declared intent a reviewer reads, never a registry a validator checks.",
    sections: {
      intent: {
        outcome:
          "Define each architectural role the engine's anchors use, so the accepted set of significant units reads as a curated register of the engine's patterns and abstractions.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:protocol.capability-epics",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/protocol/capability-epics.sdp.md",
    title: "The Protocol organizes its own features in capability epics",
    narrative:
      "The Protocol's corpus states one epic, self-hosting, and every other feature refines a feature or that epic, so its capabilities read as one tree under one root. Each capability the Protocol offers, the authored model, the carriers, the one graph, the checks, the agent surface, the human views and design iteration among them, deserves an epic of its own that its features refine.",
    sections: {
      intent: {
        outcome:
          "State each of the Protocol's capabilities as an epic that its top features refine, so the Protocol's own capability map shows its capabilities, how far each is designed, and how far each is built.",
        openQuestions: [
          {
            question:
              "Does a capability's epic restate the hub Spec that already carries the capability, enriched in place to `epic`, or is it a new Spec the hub refines?",
            blocking: true,
            key: "epicHome",
            decider: "delegated",
            provisional:
              "enrich the hub in place where its outcome already is the capability; author a new epic only where no Spec states the capability",
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:protocol.roadmap-replaces-plans",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/protocol/roadmap-replaces-plans.sdp.md",
    title: "The Protocol reads its next work from its roadmap, and its plan files are history",
    narrative:
      "Each arc's intent already lives in its capture Specs and Pack, its rulings in their carrying Specs, and its story in its pull request description. What a plan file still carries is the status line agents read first, the lanes and waves of the arc, and copies of ruling tables. Once a roadmap holds priority, the Protocol can read its next work from the graph and let the plan files stand as the record of how earlier arcs were run.",
    sections: {
      intent: {
        outcome:
          "Let an agent opening the Protocol's next work read it from the roadmap recipe, and keep the numbered plan files as frozen history no gate requires to grow.",
      },
    },
    deliveryFacts: [],
  },
] as const;
