import type { PackContext, Reader, SpecContext, SpecSummary } from "../reader/reader.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { escapeRenderedField, renderNarrative } from "./owned-prose.js";
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

const bindingLanguagePackTableAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.binding-language-pack-table"),
  label: "renders Pack member implementation and verifier bindings as present or none",
  satisfies: ref("spec:consumers.binding-language-views"),
  component: componentAnchorId("component:protocol.projections"),
});
void bindingLanguagePackTableAnchor;

export function renderPackPage(
  context: PackContext,
  specLabel: (id: string) => string,
): DesignReviewPage {
  const page = pagePathOf(context.id);
  const lines = [
    heading(context.title, context.id),
    "",
    `\`${context.id}\` · Pack (the grouping / review aggregate — states no truth of its own) · authored in [${escapeRenderedField(context.file)}](${sourceHref(page, context.file)}) \`[declared]\``,
  ];

  if (context.framing !== undefined) {
    lines.push("", `> ${escapeRenderedField(context.framing)}`);
  }

  lines.push(
    "",
    "## Members",
    "",
    "| Spec | Kind | Altitude | Stated | Floor reached | Implementation binding | Verifier binding |",
    "|---|---|---|---|---|---|---|",
  );

  for (const member of context.members) {
    if (!member.resolved) {
      lines.push(`| \`${member.id}\` — **unresolved** (see findings) | — | — | — | — | — | — |`);
      continue;
    }

    const link = `[\`${member.id}\`](${pageHref(page, pagePathOf(member.id))})`;
    const present = (fact: "implemented" | "has-verifier"): string =>
      member.deliveryFacts.includes(fact) ? "present" : "none";
    lines.push(
      `| ${link} ${tableCell(member.title ?? "")} | ${member.specKind ?? "—"} | ${member.altitude ?? "—"} | ${member.statedReadiness ?? "—"} | ${member.derivedReadiness ?? "none"} | ${present("implemented")} | ${present("has-verifier")} |`,
    );
  }

  if (context.modelRefs.length > 0) {
    const refs = context.modelRefs.map((ref) => specLabel(ref)).join(" · ");
    lines.push("", `**Vocabulary (\`modelRefs\`):** ${refs}`);
  }

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

const bindingLanguageIndexTableAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.binding-language-index-table"),
  label: "renders index implementation and verifier bindings as present or none",
  satisfies: ref("spec:consumers.binding-language-views"),
  component: componentAnchorId("component:protocol.projections"),
});
void bindingLanguageIndexTableAnchor;

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
