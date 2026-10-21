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
            decider: "owner",
            trigger:
              "An adopter needs runtime measurements linked to measurable Spec targets and can supply an observation identity and freshness policy for review.",
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:observation.run-evidence",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/observation/run-evidence.sdp.md",
    title: "CI run records are joined to verifiers in a view",
    narrative:
      "The original design put test reports in the graph and used passing runs to mark verification. The Protocol keeps run verdicts in CI. A resolving verifier binding confers `has-verifier`; showing a recorded run beside that binding confers no delivery fact. Runtime observation against a measurable target is a separate concern carried by the runtime overlay.\n\nAn adopter that keeps CI run reports needs to read them beside verifier bindings as a separately named input. Recipe 45 reads them, and the Studio admits them as one of its two named inputs. The view identifies each run by its own fields and its commit, and distinguishes evidence from a test file from a verdict for one anchored verifier. Test reporters write a test's file as an absolute path or a path from the directory they ran in, so the join reads a path's end as well as the whole path. The freshness question records what remains unsettled about comparing a run with the source being read.",
    sections: {
      intent: {
        problem:
          "A reader who wants to know whether a bound verifier passed has to leave the Protocol's views for CI, and an adopter that keeps run records has no view that shows them beside the binding without mistaking them for a delivery fact.",
        outcome:
          "Show a verifier's recorded runs beside its binding in a view, labelled as external input with its commit, while the graph keeps recording only that the binding exists.",
        openQuestions: [
          {
            question:
              "How does a view say a run is stale: by its commit against the commit being read, or by whether the bound files changed between the two?",
            blocking: false,
            key: "freshness",
            decider: "owner",
            provisional:
              "Display the run and source commit identifiers when they differ, as the differing-commit rule requires; whether freshness also follows changes to bound files remains open.",
          },
        ],
      },
      behavior: {
        rules: [
          "Run records are an input a view reads beside the graph, named by the caller; the graph never holds them, and no node, edge or delivery fact derives from them.",
          "A run record joins every verifier whose test anchor sits in the test file the record names, because the file is the binding grain of both anchor forms; each test name in the record shows as a row under that verifier. The join is at file grain: a result is evidence from the verifier's file, never the result of that verifier, because a file may hold several suites and a filtered run may exercise only one.",
          "The Protocol reads run records in the Common Test Report Format, CTRF, an open JSON schema with reporters for the common test runners, passed to a view as a recipe parameter. A record joins only when its reporter fills CTRF's optional `filePath` field, and an adopter with records of another shape maps them into CTRF itself.",
          "A record's file path joins a test anchor's file when, with each backslash written as a slash and a leading `./` removed, it equals that file or ends with a slash followed by that file; when several anchored files match, the longest joins.",
          "A record that names no file path, or a file that holds no test anchor, is reported as unjoined with its reason, never dropped, and an input that is not a CTRF report is reported with its problem while the other inputs still join.",
          "A run's commit is CTRF's `results.environment.commit`, and a run without one reads `not recorded`; given the commit being read, the recipe says for each run whether its commit is that commit, and never says the run is fresh or stale.",
          "A view shows each run beside the verifiers anchored in its file, with its result, its commit and the input it came from, labelled as external run evidence from that file and never as `has-verifier`, `implemented` or a pass verdict for one verifier.",
          "A run whose commit differs from the commit being read shows both commits, so a reader sees how old it is.",
          "The Design Review stays a function of the graph alone and shows no run; run evidence appears only in a view that explicitly admits records as external input: recipe 45, and the Studio built with run records, which shows them on its runs page, in its tests lens and on the Spec pages of the Specs their files verify.",
        ],
        ruleKeys: {
          graphUntouched: "rules[0]",
          fileGrain: "rules[1]",
          ctrfInput: "rules[2]",
          pathNormalization: "rules[3]",
          unjoinedReported: "rules[4]",
          commitField: "rules[5]",
          studioInput: "rules[8]",
        },
        exampleSpace: {
          given: [
            'a CTRF report whose test {testName:string} names the file {filePath:string} and reports the result {status:"passed"|"failed"|"skipped"}',
            "the graph holds a test anchor in the file {anchorFile:string} that verifies {specId:string}",
          ],
          when: ["recipe 45 reads the report"],
          then: [
            "the test joins the file {joinedFile:string}",
            'the test is unjoined for the reason {reason:"none"|"noFilePath"|"noTestAnchor"}',
            "the delivery facts of the verified Spec are unchanged: {factsUnchanged:boolean}",
          ],
        },
      },
      design: {
        runsRecipe:
          "recipe 45, run evidence, takes `params.runs`, one CTRF report or a list of them in input order, required; `params.commit`, the commit being read, optional; and `params.spec`, a Spec id, optional, which keeps only the files whose test anchors verify that Spec directly or through an enabled example. It returns `{ inputs, diagnostics, totals, files, unjoined }`, and `{ diagnostics }` alone when `params.runs` is missing or holds no report it can read.",
        ctrfFields:
          "the recipe reads `reportFormat`, which must be `CTRF` when present; `specVersion`; `results.tool.name` and `version`; `results.summary` with `tests`, `passed`, `failed`, `skipped`, `pending`, `other`, `start` and `stop`; `results.environment` with `commit`, `branchName`, `buildName` and `buildNumber`; and per test `name`, `status`, `duration`, `filePath` and `suite`; it reads no other field and accepts a report without `reportFormat`.",
        runInput:
          "`{ index: number; tool: string | null; toolVersion: string | null; specVersion: string | null; commit: string | null; branch: string | null; build: string | null; start: number | null; stop: number | null; summary: { tests: number; passed: number; failed: number; skipped: number; pending: number; other: number }; sameCommit: boolean | null }`, one per readable report, `index` its position from 0, `build` the build name and number joined by a space, and `sameCommit` null without `params.commit` or without a run commit.",
        runFile:
          "`{ file: string; anchors: { id: string; verifies: string[] }[]; specs: string[]; results: { input: number; name: string; suite: string | null; status: string; duration: number | null }[] }`, one per anchored test file a record joins, sorted by file, `specs` the Specs its anchors verify directly or through an enabled example, sorted, and `results` in input order and then record order, `suite` the record's suite path joined by ` > `.",
        unjoinedRow:
          '`{ input: number; name: string; filePath: string | null; status: string; reason: "noFilePath" | "noTestAnchor" }`, in input order and then record order.',
        runDiagnostic:
          "`{ input: number | null; problem: string }`, for a missing `params.runs`, with `input` null, or for an input that is not an object, has no `results.tests` list, or names a `reportFormat` other than `CTRF`.",
        runTotals:
          "`{ inputs: number; tests: number; joined: number; unjoined: number; files: number; specs: number }`, counting the readable reports, every test they hold, the tests joined and unjoined, the files joined, and the distinct Specs those files verify.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:observation.run-evidence.absolute-path-joins",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/observation/run-evidence.absolute-path-joins.sdp.md",
    title: "A test whose reporter wrote an absolute path joins its anchored file",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the file-grain join through path normalization, and hold the graph untouched by it.",
        assumptions: [
          "The world writes a root with one Spec and one test file holding a `specTest` anchor that verifies it, derives the graph, keeps the Spec's delivery facts, runs recipe 45's shipped body with one CTRF report holding the one test, and compares the Spec's delivery facts in a graph derived again afterwards.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a CTRF report whose test {testName: "renders the page"} names the file {filePath: "/home/runner/work/repo/repo/test/page.test.ts"} and reports the result {status: "passed"}',
              'the graph holds a test anchor in the file {anchorFile: "test/page.test.ts"} that verifies {specId: "spec:probe.page"}',
            ],
            when: ["recipe 45 reads the report"],
            then: [
              'the test joins the file {joinedFile: "test/page.test.ts"}',
              'the test is unjoined for the reason {reason: "none"}',
              "the delivery facts of the verified Spec are unchanged: {factsUnchanged: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:observation.run-evidence.unanchored-file-unjoined",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/observation/run-evidence.unanchored-file-unjoined.sdp.md",
    title: "A test in a file with no test anchor is reported as unjoined",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the unjoined report for a record whose file holds no test anchor.",
        assumptions: [
          "The world writes a root with one Spec and one test file holding a `specTest` anchor that verifies it, and a CTRF report whose one test names another file; it runs recipe 45's shipped body and reads the joined files and the unjoined rows, and compares the Spec's delivery facts before and after.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a CTRF report whose test {testName: "counts the rows"} names the file {filePath: "test/other.test.ts"} and reports the result {status: "failed"}',
              'the graph holds a test anchor in the file {anchorFile: "test/page.test.ts"} that verifies {specId: "spec:probe.page"}',
            ],
            when: ["recipe 45 reads the report"],
            then: [
              'the test joins the file {joinedFile: ""}',
              'the test is unjoined for the reason {reason: "noTestAnchor"}',
              "the delivery facts of the verified Spec are unchanged: {factsUnchanged: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
