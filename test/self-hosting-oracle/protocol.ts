// The authored descriptors of the `protocol` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const protocolSpecs = [
  {
    id: "spec:protocol.self-hosting",
    specKind: "behavior",
    altitude: "epic",
    readiness: "defined",
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
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:protocol.structural-self-binding",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
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
    deliveryFacts: ["has-verifier"],
  },
] as const;
