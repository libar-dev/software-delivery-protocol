import { describe, expect, it } from "vitest";
import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import {
  implementation,
  memo,
  probeGraph,
  probePack,
  probeSpec,
  roadmap,
  workGraph,
  workStates,
} from "./helpers/roadmap-probe.js";

const roadmapImplementation = codeAnchor({
  id: codeAnchorId("impl:protocol.roadmap-recipe"),
  label: "realizes the roadmap in the shipped recipe catalog",
  satisfies: ref("spec:consumers.roadmap"),
  role: "projection",
});
void roadmapImplementation;
const memoImplementation = codeAnchor({
  id: codeAnchorId("impl:protocol.roadmap-memo-recipe"),
  label: "realizes the roadmap memo in the shipped recipe catalog",
  satisfies: ref("spec:consumers.roadmap.memo"),
  role: "projection",
});
void memoImplementation;
const roadmapTests = specTest({
  id: testAnchorId("test:protocol.roadmap-recipe"),
  verifies: ref("spec:consumers.roadmap"),
});
void roadmapTests;
const memoTests = specTest({
  id: testAnchorId("test:protocol.roadmap-memo-recipe"),
  verifies: ref("spec:consumers.roadmap.memo"),
});
void memoTests;

describe("the roadmap recipes", () => {
  it.each(
    workStates.map((state, index) => ({
      state,
      need: [
        "built",
        "to build",
        "to state",
        "to design",
        "to design",
        "to design",
        "to design",
        "to design",
      ][index],
    })),
  )("reads the work's need: $state", async ({ state, need }) => {
    const answer = await roadmap(workGraph(state));
    const entry = answer.roadmaps[0]?.entries[0];
    expect(entry?.need).toBe(need);
    expect(entry?.statedReadiness).toBe("ready");
    expect(entry?.work.drift).toBe(state === workStates[4] ? 1 : 0);
    expect(entry?.workRows.map((row) => row.id)).toEqual(["spec:probe.part", "spec:probe.root"]);
    expect(JSON.stringify(answer)).not.toContain('"lane"');
  });

  it("selects priority Packs in id order and reads an explicitly named ordinary Pack", async () => {
    const graph = probeGraph(
      {
        "a.sdp.md": probePack("a", ["root"]),
        "z.sdp.md": probePack("z", ["root"]),
        "r.sdp.md": probePack("reading", ["root"]),
        "root.sdp.md": probeSpec("root"),
      },
      ["z", "a"],
    );
    expect((await roadmap(graph)).roadmaps.map((row) => row.pack)).toEqual(["pack:a", "pack:z"]);
    expect((await roadmap(graph, { pack: "pack:reading" })).roadmaps[0]?.order).toBe("reading");
    for (const params of [
      { pack: "pack:missing" },
      { pack: null },
      { decider: "Bad owner" },
      { decider: null },
    ])
      expect(await roadmap(graph, params)).toMatchObject({
        diagnostics: [{ parameter: Object.keys(params)[0] }],
      });
    expect((await roadmap({ ...graph, nodes: [] })).roadmaps).toEqual([]);
    expect((await memo(graph)).memo).toBeNull();
    expect((await memo({ ...graph, nodes: [] })).memo).toBeNull();
    expect((await memo(graph, { pack: "pack:missing" })).memo).toBeNull();
  });

  it("names holding parts and a descendant's outside parent", async () => {
    for (const [state, clause] of [
      [workStates[5], "kind-evidence-present"],
      [workStates[6], "no-blocking-open-questions"],
      [workStates[7], "typed-dependency-targets-are-defined"],
    ] as const) {
      const entry = (await roadmap(workGraph(state))).roadmaps[0]?.entries[0];
      expect(
        entry?.workRows.find((row) => row.id === "spec:probe.part")?.holdsNextRung,
      ).toContainEqual({ clause, targets: state === workStates[7] ? ["spec:probe.outside"] : [] });
      if (state === workStates[7])
        expect(entry?.restsOn).toEqual([
          {
            id: "spec:probe.outside",
            via: "refines",
            from: ["spec:probe.part"],
            need: "to state",
            statedReadiness: "scoped",
            holdsReady: true,
            onRoadmap: null,
          },
        ]);
    }
  });

  it("renders each unbuilt dependency once when two relations reach it", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root"]),
      "root.sdp.md": probeSpec("root", "ready", "\n  dependsOn: spec:probe.o"),
      "part.sdp.md": probeSpec("part", "ready", "\n  refines: [spec:probe.root, spec:probe.o]"),
      "o.sdp.md": probeSpec("o"),
    });
    expect((await roadmap(graph)).roadmaps[0]?.entries[0]?.restsOn.map((row) => row.via)).toEqual([
      "dependsOn",
      "refines",
    ]);
    expect((await memo(graph)).memo).toContain(
      "| 1 | root `spec:probe.root` | Read the probe. | `spec:probe.o` (to build) |\n",
    );
  });

  it("lists sorted incoming relations, Pack memberships and dependency places", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root", "z", "a", "part"]),
      "z-pack.sdp.md": probePack("z", ["root"]),
      "a-pack.sdp.md": probePack("a", ["root"]),
      "root.sdp.md": probeSpec("root"),
      "part.sdp.md": probeSpec("part", "ready", "\n  refines: spec:probe.root"),
      "a.sdp.md": probeSpec(
        "a",
        "ready",
        "\n  dependsOn: [spec:probe.root, spec:probe.part]\n  constrainedBy: spec:probe.root",
      ),
      "z.sdp.md": probeSpec("z", "ready", "\n  decidedBy: spec:probe.root"),
      "outside.sdp.md": probeSpec("outside", "ready", "\n  dependsOn: spec:probe.part"),
    });
    const entries = (await roadmap(graph, { pack: "pack:probe" })).roadmaps[0]?.entries;
    expect(entries?.[0]?.packs).toEqual(["pack:a", "pack:z"]);
    expect(entries?.[0]?.restedOnBy).toEqual([
      { id: "spec:probe.a", via: "constrainedBy", need: "to build", onRoadmap: 3 },
      { id: "spec:probe.a", via: "dependsOn", need: "to build", onRoadmap: 3 },
      { id: "spec:probe.outside", via: "dependsOn", need: "to build", onRoadmap: null },
      { id: "spec:probe.z", via: "decidedBy", need: "to build", onRoadmap: 2 },
    ]);
    expect(entries?.[2]?.restsOn).toEqual([
      {
        id: "spec:probe.part",
        via: "dependsOn",
        from: ["spec:probe.a"],
        need: "to build",
        statedReadiness: "ready",
        holdsReady: false,
        onRoadmap: 1,
      },
      {
        id: "spec:probe.root",
        via: "constrainedBy",
        from: ["spec:probe.a"],
        need: "to build",
        statedReadiness: "ready",
        holdsReady: false,
        onRoadmap: 1,
      },
      {
        id: "spec:probe.root",
        via: "dependsOn",
        from: ["spec:probe.a"],
        need: "to build",
        statedReadiness: "ready",
        holdsReady: false,
        onRoadmap: 1,
      },
    ]);
  });

  it("includes keyed and unkeyed blocking questions on shaping decisions", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root"]),
      "root.sdp.md": probeSpec("root", "defined", "\n  decidedBy: spec:probe.choice"),
      "choice.sdp.md": probeSpec(
        "choice",
        "scoped",
        "\n  refines: spec:probe.foundation-rule",
        "## Decision\n- context: Choose a shape.\n- decision: Keep it.",
        "decision",
      ).replace(
        "\n\n## Decision",
        "\n\n### Open questions\n- [blocking #shape] Which shape?\n  - decider: owner\n  - provisional: Keep it simple.\n- [non-blocking #note] A note.\n- [blocking] Which boundary?\n\n## Decision",
      ),
    });
    expect((await roadmap(graph)).roadmaps[0]?.entries[0]?.decisions).toEqual([
      {
        id: "spec:probe.choice",
        title: "choice",
        statedReadiness: "scoped",
        blockingQuestions: [
          {
            address: "spec:probe.choice#question.shape",
            spec: "spec:probe.choice",
            index: 0,
            question: "Which shape?",
            blocking: true,
            decider: "owner",
            provisional: "Keep it simple.",
          },
          {
            address: null,
            spec: "spec:probe.choice",
            index: 2,
            question: "Which boundary?",
            blocking: true,
            decider: null,
            provisional: null,
          },
        ],
      },
    ]);
  });

  it("finds earlier statements through a shaping decision's own waiting statement", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root", "base"]),
      "root.sdp.md": probeSpec("root", "ready", "\n  decidedBy: spec:probe.choice"),
      "choice.sdp.md": probeSpec(
        "choice",
        "defined",
        "\n  refines: spec:probe.foundation-rule\n  dependsOn: spec:probe.base",
        "## Decision\n- context: Choose a shape.\n- decision: Keep it.",
        "decision",
      ),
      "base.sdp.md": probeSpec("base", "defined"),
    });
    const result = (await roadmap(graph)).roadmaps[0];
    expect(result?.waiting.statements.map((row) => row.id)).toEqual([
      "spec:probe.base",
      "spec:probe.choice",
    ]);
    expect(result?.entries[0]?.earlierStatements).toEqual([
      { id: "spec:probe.base", where: "roadmap", onRoadmap: 2 },
    ]);
  });

  it.each(["A purpose?", "A purpose!", "A purpose", "A purpose."])(
    "ends the intent line with a full stop: %s",
    async (purpose) => {
      const graph = probeGraph({
        "pack.sdp.md": probePack("probe", ["root"]),
        "root.sdp.md": probeSpec("root").replace("Read the probe.", purpose),
      });
      expect((await memo(graph)).memo).toContain(
        `| ${purpose.endsWith(".") ? purpose : `${purpose}.`} | nothing unbuilt |`,
      );
    },
  );

  it("keeps queue order across places, including earlier statements inside, elsewhere and outside", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["dependent", "base", "dependent.part"]),
      "dependent.sdp.md": probeSpec(
        "dependent",
        "defined",
        "\n  dependsOn: [spec:probe.base, spec:probe.outside]",
      ),
      "base.sdp.md": probeSpec("base", "defined"),
      "part.sdp.md": probeSpec(
        "dependent.part",
        "defined",
        "\n  refines: spec:probe.dependent\n  dependsOn: spec:probe.base",
      ),
      "outside.sdp.md": probeSpec("outside", "defined"),
    });
    const result = (await roadmap(graph)).roadmaps[0];
    expect(result?.waiting.statements.map((row) => row.id)).toEqual([
      "spec:probe.base",
      "spec:probe.dependent",
      "spec:probe.dependent.part",
    ]);
    expect(result?.waiting.statements[0]?.places).toEqual([2]);
    expect(result?.entries[0]?.earlierStatements).toEqual([
      { id: "spec:probe.base", where: "roadmap", onRoadmap: 2 },
      { id: "spec:probe.outside", where: "outside", onRoadmap: null },
      { id: "spec:probe.dependent", where: "entry", onRoadmap: null },
    ]);
    expect(result?.entries[0]?.sharesScopeWith).toEqual([3]);
    expect(result?.entries[1]?.earlierStatements).toEqual([]);
    expect((await memo(graph)).memo).toContain(
      "in this entry `spec:probe.dependent`; on the roadmap `spec:probe.base` (place 2); 1 outside the roadmap",
    );
  });

  it("deduplicates shared descendants, preserves places, and lists decision entries apart", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root", "other", "choice"]),
      "root.sdp.md": probeSpec("root"),
      "other.sdp.md": probeSpec("other"),
      "part.sdp.md": probeSpec("part", "ready", "\n  refines: [spec:probe.root, spec:probe.other]"),
      "choice.sdp.md": probeSpec(
        "choice",
        "ready",
        "{}",
        "## Decision\n- context: The probe chooses.\n- decision: Keep the choice.",
        "decision",
      ),
      "impl.ts": implementation("root") + implementation("other") + implementation("part"),
    });
    const result = (await roadmap(graph)).roadmaps[0];
    expect(
      result?.entries.map((row) => [row.place, row.need, row.work.specs, row.sharesScopeWith]),
    ).toEqual([
      [1, "built", 2, [2]],
      [2, "built", 2, [1]],
    ]);
    expect(result?.apart).toEqual([
      {
        place: 3,
        id: "spec:probe.choice",
        specKind: "decision",
        statedReadiness: "ready",
        need: "settled",
      },
    ]);
  });

  it("lists every unassigned question apart, including unkeyed and shared shaping decisions", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["first", "second"]),
      "first.sdp.md": probeSpec("first", "scoped", "\n  decidedBy: spec:probe.choice").replace(
        "\n\n## Behavior",
        "\n\n### Open questions\n- [non-blocking #note] An unassigned note.\n- [blocking] An unassigned hold.\n- [non-blocking #selected] A selected question.\n  - decider: team-lead\n  - provisional: Keep the current design.\n- [blocking #owner] An owner hold.\n  - decider: owner\n\n## Behavior",
      ),
      "second.sdp.md": probeSpec("second", "ready", "\n  decidedBy: spec:probe.choice"),
      "choice.sdp.md": probeSpec(
        "choice",
        "defined",
        "\n  refines: spec:probe.foundation",
        "## Decision\n- context: Choose a shape.\n- decision: Keep it.",
        "decision",
      ).replace(
        "\n\n## Decision",
        "\n\n### Open questions\n- [non-blocking #choice] Ratify this choice.\n  - decider: owner\n- [non-blocking] An unassigned decision question.\n\n## Decision",
      ),
    });
    const result = (await roadmap(graph)).roadmaps[0];
    expect(result?.totals.withoutDecider).toBe(3);
    expect(result?.totals.blockingWithoutDecider).toBe(1);
    expect(result?.waiting.withoutDecider.map((row) => [row.spec, row.index, row.places])).toEqual([
      ["spec:probe.first", 1, [1]],
      ["spec:probe.choice", 1, [1, 2]],
      ["spec:probe.first", 0, [1]],
    ]);
    expect(result?.waiting.questions.map((row) => row.address)).toEqual([
      "spec:probe.first#question.owner",
      "spec:probe.choice#question.choice",
    ]);
    expect(result?.entries[0]?.decisions).toMatchObject([{ id: "spec:probe.choice" }]);
    const selected = (await roadmap(graph, { decider: "team-lead" })).roadmaps[0]?.waiting
      .questions;
    expect(selected).toMatchObject([
      { address: "spec:probe.first#question.selected", provisional: "Keep the current design." },
    ]);
    expect(result?.waiting.statements).toContainEqual({
      id: "spec:probe.choice",
      statedReadiness: "defined",
      floorReached: "ready",
      places: [1, 2],
    });
    const rendered = (await memo(graph)).memo;
    expect(rendered).toContain(
      "These questions have no named decider.\n\n- `spec:probe.first` question 2 (blocking), place 1",
    );
    expect(rendered).not.toContain("An unassigned hold.");
  });

  it("pins memo bytes, intent fallback, line breaks and table escaping", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack(
        "probe",
        ["root"],
        "First paragraph.\nA second line.\n\nAnother paragraph.",
      ),
      "root.sdp.md": probeSpec("root")
        .replace("# root", "# Root | `quoted`")
        .replace("Read the probe.", "Read | `the probe`."),
    });
    const expected = [
      "## The next work, from the roadmap",
      "",
      "Roadmap: probe `pack:probe`",
      "",
      "To state means the floor allows ready and a person still judges the statement. Built means every Spec of the entry's work states ready and has an implementation binding; it reports no passing test and no deployment.",
      "",
      "First paragraph. A second line.",
      "",
      "Another paragraph.",
      "",
      "### To design",
      "",
      "No entry needs design.",
      "",
      "### To build",
      "",
      "| Place | Entry | Purpose and reach | Rests on |",
      "| --- | --- | --- | --- |",
      "| 1 | Root \\| `quoted` `spec:probe.root` | Read \\| `the probe`. | nothing unbuilt |",
      "",
    ].join("\n");
    expect(await memo(graph)).toEqual({ diagnostics: [], memo: expected });
    expect(await memo(graph)).toEqual({ diagnostics: [], memo: expected });
    const reading = (await memo(graph, { pack: "pack:probe" })).memo;
    expect(reading?.endsWith("\n")).toBe(true);
    expect(reading?.endsWith("\n\n")).toBe(false);
    expect(
      (
        await memo(
          probeGraph(
            { "pack.sdp.md": probePack("probe", ["root"]), "root.sdp.md": probeSpec("root") },
            [],
          ),
          { pack: "pack:probe" },
        )
      ).memo,
    ).toContain("This Pack's order is reading order, not a stated priority.");
  });

  it("pins every populated memo section byte for byte", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root", "build", "built", "state", "dependent", "base"]),
      "root.sdp.md": probeSpec("root", "scoped", "\n  decidedBy: spec:probe.choice").replace(
        "\n\n## Behavior",
        "\n\n### Open questions\n- [blocking #root] Settle the root.\n  - decider: owner\n- [non-blocking] An unassigned note.\n\n## Behavior",
      ),
      "choice.sdp.md": probeSpec(
        "choice",
        "scoped",
        "\n  refines: spec:probe.foundation",
        "## Decision\n- context: A choice remains.",
        "decision",
      ),
      ...Object.fromEntries(
        ["a", "b", "c", "d"].map((name) => [
          `${name}.sdp.md`,
          probeSpec(name, "scoped", "\n  refines: spec:probe.root", ""),
        ]),
      ),
      "build.sdp.md": probeSpec("build", "ready", "\n  dependsOn: spec:probe.external"),
      "external.sdp.md": probeSpec("external"),
      "built.sdp.md": probeSpec("built"),
      "built.ts": implementation("built"),
      "state.sdp.md": probeSpec("state", "defined"),
      "dependent.sdp.md": probeSpec(
        "dependent",
        "defined",
        "\n  dependsOn: [spec:probe.base, spec:probe.outside]",
      ),
      "dependent-part.sdp.md": probeSpec(
        "dependent.part",
        "defined",
        "\n  refines: spec:probe.dependent\n  dependsOn: spec:probe.base",
      ),
      "base.sdp.md": probeSpec("base", "defined"),
      "outside.sdp.md": probeSpec("outside", "defined"),
      "deferred.sdp.md": probeSpec("deferred", "scoped").replace(
        "\n\n## Behavior",
        "\n\n### Open questions\n- [blocking #later] A deferred | choice.\n  - trigger: A reader asks.\n\n## Behavior",
      ),
    });
    const expected = [
      "## The next work, from the roadmap",
      "",
      "Roadmap: probe `pack:probe`",
      "",
      "To state means the floor allows ready and a person still judges the statement. Built means every Spec of the entry's work states ready and has an implementation binding; it reports no passing test and no deployment.",
      "",
      "### To design",
      "",
      "| Place | Entry | Next | Purpose and reach |",
      "| --- | --- | --- | --- |",
      "| 1 | root `spec:probe.root` | itself `scoped` → `defined`, held by no-blocking-open-questions; `spec:probe.a` `scoped` → `defined`, held by kind-evidence-present, kind-evidence-complete; `spec:probe.b` `scoped` → `defined`, held by kind-evidence-present, kind-evidence-complete; and 2 more parts to design; blocked by `spec:probe.root#question.root`; decided by `spec:probe.choice` (scoped) | Read the probe. |",
      "",
      "### To state",
      "",
      "| Place | Entry | Earlier waiting statements | Purpose and reach |",
      "| --- | --- | --- | --- |",
      "| 4 | state `spec:probe.state` | No preceding waiting statement in the statement queue. | Read the probe. |",
      "| 5 | dependent `spec:probe.dependent` | in this entry `spec:probe.dependent`; on the roadmap `spec:probe.base` (place 6); 1 outside the roadmap | Read the probe. |",
      "| 6 | base `spec:probe.base` | No preceding waiting statement in the statement queue. | Read the probe. Waited on by 2. |",
      "",
      "### To build",
      "",
      "| Place | Entry | Purpose and reach | Rests on |",
      "| --- | --- | --- | --- |",
      "| 2 | build `spec:probe.build` | Read the probe. | `spec:probe.external` (to build) |",
      "",
      "### Waiting on the owner",
      "",
      "- `spec:probe.root#question.root` (blocking), place 1: Settle the root.",
      "- State `spec:probe.base`: it states `defined` and its floor allows `ready`; place 6",
      "- State `spec:probe.state`: it states `defined` and its floor allows `ready`; place 4",
      "- State `spec:probe.dependent`: it states `defined` and its floor allows `ready`; place 5",
      "- State `spec:probe.dependent.part`: it states `defined` and its floor allows `ready`; place 5",
      "",
      "### Questions without a decider",
      "",
      "These questions have no named decider.",
      "",
      "- `spec:probe.root` question 2, place 1",
      "",
      "### Built and still on the roadmap",
      "",
      "- Place 3: built `spec:probe.built`",
      "",
      "### Deferred, with their triggers",
      "",
      "- `spec:probe.deferred#question.later`: A deferred | choice. Trigger: A reader asks.",
      "",
    ].join("\n");
    expect(await memo(graph)).toEqual({ diagnostics: [], memo: expected });
    expect(
      await memo({
        ...graph,
        nodes: [...graph.nodes].reverse(),
        edges: [...graph.edges].reverse(),
      }),
    ).toEqual({ diagnostics: [], memo: expected });
  });

  it("pins empty design and build sections byte for byte", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", []).replace("specs:\n", "specs: []\n"),
    });
    expect(await memo(graph)).toEqual({
      diagnostics: [],
      memo: [
        "## The next work, from the roadmap",
        "",
        "Roadmap: probe `pack:probe`",
        "",
        "To state means the floor allows ready and a person still judges the statement. Built means every Spec of the entry's work states ready and has an implementation binding; it reports no passing test and no deployment.",
        "",
        "### To design",
        "",
        "No entry needs design.",
        "",
        "### To build",
        "",
        "No entry is ready to build.",
        "",
      ].join("\n"),
    });
  });

  it("reads purpose from intent and counts distinct waiting Specs and buildable parts", async () => {
    const graph = workGraph(workStates[6]);
    const extra = probeGraph({
      "waiter.sdp.md": probeSpec(
        "waiter",
        "defined",
        "\n  dependsOn: spec:probe.root\n  refines: spec:probe.beyond",
      ),
      "beyond.sdp.md": probeSpec("beyond"),
    });
    const waiter = extra.nodes.find((node) => node.id === "spec:probe.waiter");
    if (waiter === undefined) throw new Error("The waiting Spec must be present.");
    const changed = {
      ...graph,
      nodes: [
        ...graph.nodes.map((node) =>
          node.id === "spec:probe.root" && node.nodeType === "Primitive"
            ? {
                ...node,
                sections: {
                  ...node.sections,
                  intent: { ...node.sections?.intent, problem: "Read the purpose | clearly" },
                },
              }
            : node,
        ),
        waiter,
      ],
      edges: [
        ...graph.edges,
        {
          from: waiter.id,
          to: "spec:probe.root",
          type: "dependsOn" as const,
          claim: "declared" as const,
        },
        {
          from: waiter.id,
          to: "spec:probe.root",
          type: "constrainedBy" as const,
          claim: "declared" as const,
        },
      ],
    };
    const text = (await memo(changed)).memo ?? "";
    expect(text).toContain("Read the purpose \\| clearly. Waited on by 1.");
    const mixed = workGraph(workStates[6]);
    const noRootBinding = {
      ...mixed,
      edges: mixed.edges.filter((edge) => edge.type !== "satisfies"),
    };
    expect((await memo(noRootBinding)).memo).toContain("1 of its parts ready to build now.");
    expect((await memo(workGraph(workStates[7]))).memo).toContain(
      "typed-dependency-targets-are-defined (`spec:probe.outside`)",
    );
  });
});
