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
            key: "observationIdentity",
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  // The design-management arc (plan 41): a capture ahead of code.
  {
    id: "spec:observation.run-evidence",
    specKind: "behavior",
    altitude: "feature",
    readiness: "scoped",
    file: "specs/observation/run-evidence.sdp.md",
    title: "CI run records are joined to verifiers in a view",
    narrative:
      "The original design ingested test reports into the graph. Each run became a node with its result and duration, and a passing run marked its Spec verified (`docs/lineage/v0-design/06-extraction-and-validation.md` §11.2; `08-delivery-evidence-and-tooling.md` §2, §3.2). The binding-not-liveness decision rules otherwise. `has-verifier` says a resolving verifier binding exists, and pass and fail stay in CI. The vision document says test run verdicts are never ingested (`docs/concept/00-vision-scope-and-mvp-boundary.md`). Read literally, that keeps them out of every view; this Spec reads it as keeping them out of the graph. The runtime overlay holds the other half of the original's evidence layer, runtime observations against measurable targets, which aims at the `observed` fact; run evidence derives no fact at all.\n\nThe first adopter keeps run records anyway, one JSON file per run with its tier, target, commit, whether the tree was clean, and each test's file, name, result and duration (`libar-platform/evidence/runs/`). It asks to see them beside the bindings as a separately identified input, joined by verifier, with commit, tier, composition and target, and a note when the run predates the source being read (`libar-platform/docs/feedback/sdp-feedback-02.md`, item 25). The Spec Studio's verification panels and its tests lens each hold a question on whether to show run results read from CI output; this Spec is the answer they wait on.",
    sections: {
      intent: {
        problem:
          "A reader who wants to know whether a bound verifier passed has to leave the Protocol's views for CI, and an adopter that keeps run records has no view that shows them beside the binding without mistaking them for a delivery fact.",
        outcome:
          "Show a verifier's recorded runs beside its binding in a view, labelled as external input with its commit, while the graph keeps recording only that the binding exists.",
        openQuestions: [
          {
            question:
              "What joins a run record to a verifier: the test anchor's id, which no reporter prints, the test file the anchor sits in, or a name the adopter maps? The adopter's records carry a file and a test name.",
            blocking: true,
            key: "joinKey",
          },
          {
            question:
              "Which run records does the Protocol read: a schema of its own, a common reporter format, or any shape an adopter maps through a recipe parameter?",
            blocking: true,
            key: "recordShape",
          },
          {
            question:
              "How does a view say a run is stale: by its commit against the commit being read, or by whether the bound files changed between the two?",
            blocking: false,
            key: "freshness",
          },
        ],
      },
      behavior: {
        rules: [
          "Run records are an input a view reads beside the graph, named by the caller; the graph never holds them, and no node, edge or delivery fact derives from them.",
          "A view shows each run joined to the verifier it exercised, with its result, its commit and the input it came from, labelled as external run evidence and never as `has-verifier` or `implemented`.",
          "A run whose commit differs from the commit being read shows both commits, so a reader sees how old it is.",
          "The Design Review stays a function of the graph alone and shows no run; run evidence appears only in a view that admits external input, such as a recipe that takes the records as a parameter, or the Studio.",
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
