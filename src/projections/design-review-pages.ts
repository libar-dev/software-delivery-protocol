import type {
  PackContext,
  PackMemberSummary,
  Reader,
  SpecContext,
  SpecSummary,
} from "../reader/reader.js";
import { escapeRenderedField, renderNarrative } from "./owned-prose.js";
import {
  renderBoundarySection,
  renderCodeSection,
  renderDecisionsCell,
  renderNextRungSection,
  renderOpenQuestionsSection,
  renderStatedNextRungCell,
} from "./design-review-pack-sections.js";
import type { DesignReviewPage } from "./design-review.js";
import {
  renderBindings,
  renderFindings,
  renderReadiness,
  renderRelationsAndImpact,
} from "./design-review-context.js";
import {
  heading,
  PAGE_FOOTER,
  pageHref,
  pagePathOf,
  singleLine,
  sourceHref,
  tableCell,
} from "./design-review-markdown.js";
import { renderSections } from "./design-review-sections.js";

export function renderSpecPage(context: SpecContext): DesignReviewPage {
  const page = pagePathOf(context.id);
  const kind =
    context.kindDisplayLabel === undefined
      ? `\`${context.specKind}\``
      : `${escapeRenderedField(context.kindDisplayLabel)} (\`${context.specKind}\`)`;
  const lines = [
    heading(context.title, context.id),
    "",
    `\`${context.id}\` · ${kind} · altitude \`${context.altitude}\` · authored in [${escapeRenderedField(context.file)}](${sourceHref(page, context.file)}) \`[declared]\``,
    "",
    ...renderNarrative(context.narrative),
    ...renderReadiness(context),
    "",
    ...renderBindings(context, page),
    ...renderSections(context),
  ];

  const relations = renderRelationsAndImpact(context, page);

  if (relations.length > 0) {
    lines.push("", ...relations);
  }

  lines.push("", ...renderFindings(context.findings), "", "---", "", PAGE_FOOTER);

  return { path: page, content: `${lines.join("\n")}\n` };
}

const MEMBER_TABLE_HEADER = [
  "Spec",
  "Kind",
  "Altitude",
  "Stated",
  "Floor reached",
  "Stated next rung",
  "Design entries",
  "Declarations",
  "Open questions",
  "Decisions",
  "Design reference",
  "Implementation binding",
  "Verifier binding",
] as const;

/**
 * One member row, numbered from 1 in authored order. The row opens with the linked Spec and
 * closes with the two binding columns, which read present or none, beside a design-reference
 * column with the same values; unit counts stay off the table.
 */
function renderMemberRow(member: PackMemberSummary, number: number, page: string): string {
  const ordinal = `(${String(number)})`;

  if (!member.resolved) {
    return `| \`${member.id}\` ${ordinal} — **unresolved** (see findings) |${" — |".repeat(MEMBER_TABLE_HEADER.length - 1)}`;
  }

  const link = `[\`${member.id}\`](${pageHref(page, pagePathOf(member.id))})`;
  const title = member.title === undefined ? "" : ` ${tableCell(member.title)}`;
  const present = (fact: "implemented" | "has-verifier"): string =>
    member.deliveryFacts.includes(fact) ? "present" : "none";
  const design = member.design;
  const questions = design?.openQuestions.length ?? 0;
  const cells = [
    `${link} ${ordinal}${title}`,
    member.specKind ?? "—",
    member.altitude ?? "—",
    member.statedReadiness ?? "—",
    member.derivedReadiness ?? "none",
    renderStatedNextRungCell(member),
    String(design?.entries ?? 0),
    String(design?.declarations ?? 0),
    questions === 0
      ? "0"
      : `${String(questions)} (${String(design?.blockingQuestions ?? 0)} blocking)`,
    renderDecisionsCell(member, page),
    (member.references ?? []).length > 0 ? "present" : "none",
    present("implemented"),
    present("has-verifier"),
  ];

  return `| ${cells.join(" | ")} |`;
}

/**
 * @sdpAnchor impl:protocol.binding-language-pack-table
 * @sdpLabel renders Pack member implementation and verifier bindings as present or none
 * @sdpSatisfies spec:consumers.binding-language-views
 * @sdpComponent component:protocol.projections
 * @sdpRole renderer
 */

/**
 * The Pack page presents the Pack's design in a fixed order: title line, framing and vocabulary,
 * then the member table, the next rung, the boundary, the open questions, the code, the verifier
 * coverage gaps and the findings. Every value comes from the Pack context; no timestamp, commit
 * or run identity enters, so two renders of one graph are byte-identical.
 *
 * @sdpAnchor impl:protocol.pack-design-page
 * @sdpLabel renders the Pack page from the Pack design
 * @sdpSatisfies spec:consumers.design-review.pack-design-page
 * @sdpReferences spec:decisions.pack-design-page
 * @sdpComponent component:protocol.projections
 * @sdpRole renderer
 */

export function renderPackPage(
  context: PackContext,
  specLabel: (id: string) => string,
): DesignReviewPage {
  const page = pagePathOf(context.id);
  const lines = [
    heading(context.title === undefined ? undefined : singleLine(context.title), context.id),
    "",
    `\`${context.id}\` · Pack (the grouping / review aggregate — states no truth of its own) · authored in [${escapeRenderedField(context.file)}](${sourceHref(page, context.file)}) \`[declared]\``,
  ];

  if (context.framing !== undefined) {
    lines.push("", `> ${escapeRenderedField(context.framing)}`);
  }

  if (context.modelRefs.length > 0) {
    const refs = context.modelRefs.map((ref) => specLabel(ref)).join(" · ");
    lines.push("", `**Vocabulary (\`modelRefs\`):** ${refs}`);
  }

  lines.push(
    "",
    "## Members",
    "",
    "One row per member in the manifest's order. The stated next rung is the rung above the stated one, with `holds` when the floor already holds it and its first unmet clause otherwise. A binding or design reference reads present when a resolving anchor exists, and none otherwise.",
    "",
    `| ${MEMBER_TABLE_HEADER.join(" | ")} |`,
    `|${"---|".repeat(MEMBER_TABLE_HEADER.length)}`,
  );

  for (const [position, member] of context.members.entries()) {
    lines.push(renderMemberRow(member, position + 1, page));
  }

  lines.push(
    "",
    ...renderNextRungSection(context, page),
    "",
    ...renderBoundarySection(context, page),
    "",
    ...renderOpenQuestionsSection(context, page),
    "",
    ...renderCodeSection(context, page),
  );

  const gaps = context.verifierGaps;

  if (gaps.length > 0) {
    lines.push(
      "",
      "## Verifier coverage gaps",
      "",
      "Members with no verifier binding — a surfaced absence, informative, never a gate. `ready` members are the priority slice (designed, stated done, unverified):",
      "",
    );

    for (const gap of gaps) {
      const stated =
        gap.statedReadiness === undefined ? "" : ` (stated \`${gap.statedReadiness}\`)`;
      lines.push(`- ${specLabel(gap.id)}${stated}${gap.priority ? " — **priority**" : ""}`);
    }
  }

  lines.push("", ...renderFindings(context.findings), "", "---", "", PAGE_FOOTER);

  return { path: page, content: `${lines.join("\n")}\n` };
}

/**
 * @sdpAnchor impl:protocol.binding-language-index-table
 * @sdpLabel renders index implementation and verifier bindings as present or none
 * @sdpSatisfies spec:consumers.binding-language-views
 * @sdpComponent component:protocol.projections
 * @sdpRole renderer
 */

export function renderIndexPage(reader: Reader, specs: readonly SpecSummary[]): DesignReviewPage {
  const page = "index.md";
  const packs = reader.packs();
  const findings = reader.findings();
  const lines = [
    "# Design Review",
    "",
    `The one generated read-only view — a pure projection of the one graph (\`graph.json\`, schema \`${reader.graph.schemaVersion}\`): ${String(reader.graph.nodes.length)} nodes · ${String(reader.graph.edges.length)} edges.`,
    "",
    "## Specs",
    "",
    "| Spec | Kind | Altitude | Stated | Floor reached | Implementation binding | Verifier binding |",
    "|---|---|---|---|---|---|---|",
  ];

  for (const spec of specs) {
    const link = `[\`${spec.id}\`](${pageHref(page, pagePathOf(spec.id))})`;
    const present = (fact: "implemented" | "has-verifier"): string =>
      spec.deliveryFacts.includes(fact) ? "present" : "none";
    lines.push(
      `| ${link} ${tableCell(spec.title ?? "")} | ${spec.specKind} | ${spec.altitude} | ${spec.statedReadiness} | ${spec.derivedReadiness ?? "none"} | ${present("implemented")} | ${present("has-verifier")} |`,
    );
  }

  if (packs.length > 0) {
    lines.push("", "## Packs", "");

    for (const pack of packs) {
      const framing = pack.framing === undefined ? "" : ` — ${escapeRenderedField(pack.framing)}`;
      lines.push(
        `- [\`${pack.id}\`](${pageHref(page, pagePathOf(pack.id))}) ${escapeRenderedField(pack.title ?? "")}${framing}`,
      );
    }
  }

  lines.push("", ...renderFindings(findings), "", "---", "", PAGE_FOOTER);

  return { path: page, content: `${lines.join("\n")}\n` };
}
