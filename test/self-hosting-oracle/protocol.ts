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
      intent: { outcome: "Prove the Protocol can carry its own intended truth honestly." },
      behavior: {
        rules: [
          "All authored carriers derive one regenerable graph through one validation path.",
          "Self-hosting remains deterministic in a clean clone.",
        ],
      },
    },
    deliveryFacts: [],
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
          "Every architecturally significant engine unit carries component membership and uses declarations so structural recipes and the census answer architecture questions about the engine itself.",
      },
      behavior: {
        rules: [
          "The significance criterion for engine self-binding is exported public surface plus cross-component reach.",
          "Every architecturally significant unit carries component membership; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself.",
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
