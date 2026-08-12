// The authored descriptors of the `observation` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph.

export const observationSpecs = [
  {
    id: "spec:observation.runtime-overlay",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/observation/runtime-overlay.sdp.md",
    title: "Runtime observations can close the liveness loop",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Associate runtime evidence with measurable Spec targets without turning operational payloads into authored model truth.",
        openQuestions: [
          {
            question:
              "Which external observation identity and freshness boundary is small enough for the graph while still supporting an honest `observed` delivery fact?",
            blocking: true,
          },
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
