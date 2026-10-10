import { describe, expect, it } from "vitest";

import { createReader, pack, packId, renderDesignReview, spec, specId } from "../src/index.js";
import type { GraphSchema } from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";
import { PACK_ID, packDesignProbeGraph } from "./helpers/pack-design-probe.js";

/**
 * The Design Review's Pack page over the Pack design probe: the fixed section order, the member
 * table, the next rung, the boundary tables, the questions with addresses and line links, the
 * code, and a byte-identical second render.
 *
 * @sdpAnchor test:protocol.pack-design-page
 * @sdpLabel the Pack page renders the Pack design in its fixed order
 * @sdpVerifies spec:consumers.design-review.pack-design-page
 */

const PAGE = `pack/${PACK_ID.slice("pack:".length)}.md`;

function renderPackPage(graph: GraphSchema = packDesignProbeGraph(), path = PAGE): string {
  const page = renderDesignReview(createReader(graph)).find((entry) => entry.path === path);

  if (page === undefined) {
    throw new Error(`The rendered view is missing the page "${path}".`);
  }

  return page.content;
}

/** The text under one `## ` heading, up to the next one. */
function section(page: string, heading: string): string {
  const start = page.indexOf(`\n${heading}\n`);

  if (start < 0) {
    throw new Error(`The page has no "${heading}" section.`);
  }

  const end = page.indexOf("\n## ", start + 1);

  return page.slice(start + 1, end < 0 ? undefined : end);
}

describe("the Design Review's Pack page presents the Pack design", () => {
  it("keeps the title line, framing and vocabulary, then renders the sections in order", () => {
    const page = renderPackPage();
    const lines = page.split("\n");

    expect(lines[0]).toBe("# Probe design");
    expect(lines[2]?.startsWith("`pack:probe.design` · Pack")).toBe(true);
    expect(page.indexOf("> The probe's design as it stands.")).toBeLessThan(
      page.indexOf("**Vocabulary (`modelRefs`):**"),
    );
    expect(page.indexOf("**Vocabulary (`modelRefs`):**")).toBeLessThan(page.indexOf("## Members"));
    expect(lines.filter((line) => line.startsWith("## "))).toEqual([
      "## Members",
      "## Next rung",
      "## Boundary",
      "## Open questions",
      "## Code",
      "## Verifier coverage gaps",
      "## Findings",
    ]);
  });

  it("numbers one member row from 1 in authored order, with design columns and binding columns", () => {
    const members = section(renderPackPage(), "## Members").split("\n");

    expect(members).toContain(
      "| Spec | Kind | Altitude | Stated | Floor reached | Stated next rung | Design entries | Declarations | Open questions | Decisions | Design reference | Implementation binding | Verifier binding |",
    );
    expect(
      members.filter((line) => line.startsWith("| [`spec:") || line.startsWith("| `spec:")),
    ).toEqual([
      "| [`spec:probe.held`](../spec/probe.held.md) (1) Probe held | rule | story | defined | defined | ready · `typed-dependency-targets-are-defined` | 6 | 2 | 2 (0 blocking) | [`spec:probe.choice`](../spec/probe.choice.md) (defined) | none | none | none |",
      "| [`spec:probe.waiting`](../spec/probe.waiting.md) (2) Probe waiting | rule | story | defined | ready | ready · holds | 0 | 0 | 0 | — | none | present | present |",
      "| [`spec:probe.blocked`](../spec/probe.blocked.md) (3) Probe blocked | rule | story | scoped | scoped | defined · `no-blocking-open-questions` | 0 | 0 | 1 (1 blocking) | `spec:probe.absent` (unresolved) | present | none | none |",
      "| `spec:probe.missing` (4) — **unresolved** (see findings) | — | — | — | — | — | — | — | — | — | — | — | — |",
      "| [`spec:probe.modest`](../spec/probe.modest.md) (5) Probe modest | rule | story | idea | defined | scoped · holds | 0 | 0 | 0 | — | none | none | none |",
      "| [`spec:probe.top`](../spec/probe.top.md) (6) Probe top | rule | story | ready | ready | — | 0 | 0 | 0 | — | none | none | none |",
      "| [`spec:probe.check`](../spec/probe.check.md) (7) Probe check | example | story | idea | idea | scoped · `kind-evidence-present` | 0 | 0 | 0 | — | none | none | none |",
    ]);
  });

  it("lists what holds each member below its next rung, and apart, the members that wait for their author", () => {
    const nextRung = section(renderPackPage(), "## Next rung");
    const [held, waiting = ""] = nextRung.split("### Waiting for the author's statement");

    expect(held).toContain(
      [
        "### [`spec:probe.held`](../spec/probe.held.md) Probe held",
        "",
        "Stated `defined`; the floor does not hold `ready`:",
        "",
        "- `typed-dependency-targets-are-defined` — Every refines, dependsOn, constrainedBy, and decidedBy target states at least defined.",
        "  - dependsOn [`spec:probe.outside-basis`](../spec/probe.outside-basis.md), stated `scoped`",
        "",
        "### [`spec:probe.blocked`](../spec/probe.blocked.md) Probe blocked",
        "",
        "Stated `scoped`; the floor does not hold `defined`:",
        "",
        "- `no-blocking-open-questions` — Spec has no blocking open question in intent.openQuestions.",
      ].join("\n"),
    );
    expect(held).toContain("### [`spec:probe.check`](../spec/probe.check.md) Probe check");
    expect(waiting).toContain("That is not approval");
    expect(waiting.split("\n").filter((line) => line.startsWith("- "))).toEqual([
      "- stated `defined`, next `ready`: [`spec:probe.waiting`](../spec/probe.waiting.md) Probe waiting",
      "- stated `idea`, next `scoped`: [`spec:probe.modest`](../spec/probe.modest.md) Probe modest",
    ]);
    // The verifier gap list owns list lines that open with a member link.
    expect(nextRung).not.toMatch(/^- \[`spec:/mu);
    // A member stating `ready` has no next rung, and an unresolved member has no floor.
    expect(nextRung).not.toContain("spec:probe.top");
    expect(nextRung).not.toContain("spec:probe.missing");
  });

  it("renders the boundary as two tables, each row with its rung, its binding and the members it joins", () => {
    const boundary = section(renderPackPage(), "## Boundary");
    const [restsOn, restedOnBy = ""] = boundary.split("### Rested on by");

    expect(restsOn).toContain(
      [
        "| Spec | Stated | Implementation binding | Members joined |",
        "|---|---|---|---|",
        "| [`spec:probe.choice`](../spec/probe.choice.md) Probe choice | defined | none | decidedBy: [`spec:probe.held`](../spec/probe.held.md) |",
        "| [`spec:probe.outside-basis`](../spec/probe.outside-basis.md) Probe outside-basis | scoped | none | dependsOn: [`spec:probe.held`](../spec/probe.held.md), [`spec:probe.blocked`](../spec/probe.blocked.md), [`spec:probe.modest`](../spec/probe.modest.md) |",
      ].join("\n"),
    );
    expect(restedOnBy.split("\n").filter((line) => line.startsWith("| [`"))).toEqual([
      "| [`spec:probe.outside-basis`](../spec/probe.outside-basis.md) Probe outside-basis | scoped | none | refines: [`spec:probe.held`](../spec/probe.held.md) |",
      "| [`spec:probe.waiting.case`](../spec/probe.waiting.case.md) Probe waiting.case | idea | none | refines: [`spec:probe.waiting`](../spec/probe.waiting.md) · verifies: [`spec:probe.waiting`](../spec/probe.waiting.md) |",
      "| [`spec:probe.waiting.unbound`](../spec/probe.waiting.unbound.md) Probe waiting.unbound | idea | none | refines: [`spec:probe.waiting`](../spec/probe.waiting.md) · verifies: [`spec:probe.waiting`](../spec/probe.waiting.md) |",
    ]);
  });

  it("groups questions by member with their flag, address, escaped text and a line link", () => {
    expect(section(renderPackPage(), "## Open questions")).toBe(
      [
        "## Open questions",
        "",
        "### [`spec:probe.held`](../spec/probe.held.md) Probe held",
        "",
        "- non-blocking · `spec:probe.held#question.basisOwner` — Who owns the basis? ([specs/fixture.sdp.ts:21](../../../specs/fixture.sdp.ts#L21))",
        "- non-blocking — Is the &lt;name&gt; \\| \\# final?",
        "",
        "### [`spec:probe.blocked`](../spec/probe.blocked.md) Probe blocked",
        "",
        "- **blocking** · `spec:probe.blocked#question.scopeCut` — Where is the cut? ([specs/fixture.sdp.ts:14](../../../specs/fixture.sdp.ts#L14))",
        "",
      ].join("\n"),
    );
  });

  it("lists each member's realizing and referencing units with a line link, role and component", () => {
    const code = section(renderPackPage(), "## Code");

    expect(code).toContain(
      [
        "### [`spec:probe.waiting`](../spec/probe.waiting.md) Probe waiting",
        "",
        "#### Implementations",
        "",
        "- `impl:probe.waiting` — realizes the waiting rule ([src/fixture.ts:2](../../../src/fixture.ts#L2)) · role `service` · component `component:probe.core` (layer `domain`, context `probe`) `[anchored]`",
      ].join("\n"),
    );
    expect(code).toContain(
      [
        "### [`spec:probe.blocked`](../spec/probe.blocked.md) Probe blocked",
        "",
        "#### Referenced by",
        "",
        "- `impl:probe.helper` ([src/fixture.ts:3](../../../src/fixture.ts#L3)) `[anchored]`",
      ].join("\n"),
    );
    expect(code).toContain(
      "### [`spec:probe.held`](../spec/probe.held.md) Probe held\n\nNo implementation or design-reference binding is recorded for this member.\n",
    );
  });

  it("percent-encodes each path segment of a line link and escapes brackets in its label", () => {
    const carrier = "specs/odd (dir)/a#b].sdp.ts";
    const source = "src/odd dir/x#y].ts";
    const probe = packDesignProbeGraph();
    const page = renderPackPage({
      ...probe,
      nodes: probe.nodes.map((node) =>
        node.id === "spec:probe.held"
          ? { ...node, file: carrier }
          : node.id === "impl:probe.waiting"
            ? { ...node, file: source }
            : node,
      ),
    });

    expect(section(page, "## Open questions")).toContain(
      "- non-blocking · `spec:probe.held#question.basisOwner` — Who owns the basis? ([specs/odd (dir)/a\\#b\\].sdp.ts:21](../../../specs/odd%20%28dir%29/a%23b%5D.sdp.ts#L21))",
    );
    expect(section(page, "## Code")).toContain(
      "- `impl:probe.waiting` — realizes the waiting rule ([src/odd dir/x\\#y\\].ts:2](../../../src/odd%20dir/x%23y%5D.ts#L2)) · role `service`",
    );
  });

  it("keeps a multiline title, question or label inside its heading or list item", () => {
    const probe = packDesignProbeGraph();
    const page = renderPackPage({
      ...probe,
      nodes: probe.nodes.map((node) => {
        if (node.id === PACK_ID) {
          return { ...node, title: "Probe\ndesign" };
        }

        if (node.id === "impl:probe.waiting") {
          return { ...node, label: "realizes the\r\nwaiting rule" };
        }

        if (node.nodeType !== "Primitive" || node.id !== "spec:probe.held") {
          return node;
        }

        return {
          ...node,
          title: "Probe held\nacross lines",
          sections: {
            ...node.sections,
            intent: {
              ...node.sections?.intent,
              openQuestions: [
                { question: "Who owns\n  the basis?", blocking: false, key: "basisOwner" },
              ],
            },
          },
        };
      }),
    });
    const lines = page.split("\n");

    expect(lines[0]).toBe("# Probe design");
    expect(lines).toContain(
      "### [`spec:probe.held`](../spec/probe.held.md) Probe held across lines",
    );
    expect(lines).toContain(
      "- non-blocking · `spec:probe.held#question.basisOwner` — Who owns the basis? ([specs/fixture.sdp.ts:21](../../../specs/fixture.sdp.ts#L21))",
    );
    expect(lines).toContain(
      "- `impl:probe.waiting` — realizes the waiting rule ([src/fixture.ts:2](../../../src/fixture.ts#L2)) · role `service` · component `component:probe.core` (layer `domain`, context `probe`) `[anchored]`",
    );
    expect(lines).toContain(
      "- [`spec:probe.held`](../spec/probe.held.md) — Probe held across lines (stated `defined`)",
    );
    for (const continuation of ["design", "across lines", "the basis?", "waiting rule"]) {
      expect(lines.filter((line) => line.trimStart().startsWith(continuation))).toEqual([]);
    }
  });

  it("speaks binding language: no delivery-fact name renders as text", () => {
    const page = renderPackPage();

    expect(page.includes("implemented")).toBe(false);
    expect(page.includes("has-verifier")).toBe(false);
  });

  it("renders byte-identical pages from two freshly derived graphs, with no time or commit", () => {
    const first = renderPackPage();

    expect(renderPackPage()).toBe(first);
    expect(first).not.toMatch(/\b\d{4}-\d{2}-\d{2}\b/u);
    expect(first).not.toMatch(/\b[0-9a-f]{40}\b/u);
  });

  it("says so in one line where a section has nothing to show", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:probe.alone"),
          title: "Probe alone",
          kind: "rule",
          altitude: "story",
          readiness: "ready",
          intent: { outcome: "Stand alone." },
          behavior: { rules: ["The probe states one rule."] },
        }),
      ],
      packs: [
        pack({
          id: packId("pack:probe.alone"),
          title: "Alone",
          specs: [specId("spec:probe.alone")],
        }),
      ],
    });
    const page = renderPackPage(graph, "pack/probe.alone.md");

    expect(section(page, "## Next rung")).toContain("No member is held below its next rung.");
    expect(section(page, "## Next rung")).not.toContain("### Waiting");
    expect(section(page, "## Boundary")).toBe(
      [
        "## Boundary",
        "",
        "### Rests on",
        "",
        "The Specs outside the Pack that a member refines, depends on, is constrained by or is decided by.",
        "",
        "None.",
        "",
        "### Rested on by",
        "",
        "The Specs outside the Pack that relate to a member by an authored relation.",
        "",
        "None.",
        "",
      ].join("\n"),
    );
    expect(section(page, "## Open questions")).toBe(
      "## Open questions\n\nNo member records an open question.\n",
    );
    expect(section(page, "## Code")).toContain(
      "No implementation or design-reference binding is recorded for this member.",
    );
    expect(page).not.toContain("No code unit realizes");
  });
});
