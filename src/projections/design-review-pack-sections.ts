import type {
  CodeUnitBinding,
  PackBoundaryRow,
  PackContext,
  PackMemberSummary,
} from "../reader/reader.js";
import type { ReadinessFloorTarget } from "../validate/readiness-floor.js";
import { escapeRenderedField } from "./owned-prose.js";
import {
  pageHref,
  pagePathOf,
  renderInlineCode,
  renderTableInlineCode,
  singleLine,
  sourceHref,
  tableCell,
} from "./design-review-markdown.js";

/**
 * The Pack page's design sections, rendered from the Pack design the reader assembles: what
 * holds each member below its next rung, the boundary, the open questions, and the code.
 *
 * @sdpAnchor impl:protocol.pack-design-sections
 * @sdpLabel renders the Pack page's next-rung, boundary, question and code sections
 * @sdpReferences spec:consumers.design-review.pack-design-page
 * @sdpComponent component:protocol.projections
 * @sdpRole renderer
 */

/** A relative link from a view page to one line of a repository file. */
export function lineHref(page: string, file: string, line: number): string {
  return `${fileHref(page, file)}#L${String(line)}`;
}

/**
 * A relative link to a repository file, each path segment percent-encoded, so a space, a `#` or
 * a bracket in a file name stays inside the destination.
 */
function fileHref(page: string, file: string): string {
  const encoded = file
    .split("/")
    .map((segment) => encodeURIComponent(segment).replaceAll("(", "%28").replaceAll(")", "%29"))
    .join("/");

  return sourceHref(page, encoded);
}

/** An authored value inside a heading or one list item: escaped, its line breaks collapsed. */
function inlineText(text: string): string {
  return escapeRenderedField(singleLine(text));
}

/** A link label: inline text whose brackets are escaped, so a `]` cannot close the label. */
function linkLabel(text: string): string {
  return inlineText(text).replaceAll("[", "\\[").replaceAll("]", "\\]");
}

/** The linked Spec id, then its title. */
function specLink(page: string, id: string, title: string | undefined): string {
  const display = title === undefined ? "" : ` ${inlineText(title)}`;

  return `[\`${id}\`](${pageHref(page, pagePathOf(id))})${display}`;
}

/** Resolved members once each, in authored order: the sections group by member. */
function resolvedMembers(context: PackContext): readonly PackMemberSummary[] {
  const seen = new Set<string>();

  return context.members.filter((member) => {
    if (!member.resolved || seen.has(member.id)) {
      return false;
    }

    seen.add(member.id);
    return true;
  });
}

function renderTarget(page: string, target: ReadinessFloorTarget): string {
  return target.statedReadiness === undefined
    ? `${target.type} \`${target.id}\`, not a Spec`
    : `${target.type} ${specLink(page, target.id, undefined)}, stated \`${target.statedReadiness}\``;
}

export function renderNextRungSection(context: PackContext, page: string): readonly string[] {
  const lines = [
    "## Next rung",
    "",
    "The floor clauses that fail at the rung above each member's stated rung, with the targets a failing dependency clause names. This is a report, never a promotion: only an author's edit states a rung.",
    "",
  ];
  const withNext = resolvedMembers(context).filter((member) => member.statedNextRung !== undefined);
  const held = withNext.filter((member) => (member.statedNextRungFailures ?? []).length > 0);
  const waiting = withNext.filter((member) => (member.statedNextRungFailures ?? []).length === 0);

  if (held.length === 0) {
    lines.push("No member is held below its next rung.");
  }

  // One group per held member, as the question and code sections group; a list line never opens
  // with a member link, which the verifier gap list owns.
  for (const [position, member] of held.entries()) {
    lines.push(
      ...(position === 0 ? [] : [""]),
      `### ${specLink(page, member.id, member.title)}`,
      "",
      `Stated \`${member.statedReadiness ?? ""}\`; the floor does not hold \`${member.statedNextRung ?? ""}\`:`,
      "",
    );

    for (const failure of member.statedNextRungFailures ?? []) {
      lines.push(`- ${renderInlineCode(failure.clauseId)} — ${inlineText(failure.description)}`);

      for (const target of failure.targets ?? []) {
        lines.push(`  - ${renderTarget(page, target)}`);
      }
    }
  }

  if (waiting.length > 0) {
    lines.push(
      "",
      "### Waiting for the author's statement",
      "",
      "The floor already holds these members at their next rung. That is not approval: the page records no review, and the rung stays unstated until its author states it.",
      "",
    );

    for (const member of waiting) {
      lines.push(
        `- stated \`${member.statedReadiness ?? ""}\`, next \`${member.statedNextRung ?? ""}\`: ${specLink(page, member.id, member.title)}`,
      );
    }
  }

  return lines;
}

function renderBoundaryTable(rows: readonly PackBoundaryRow[], page: string): readonly string[] {
  if (rows.length === 0) {
    return ["None."];
  }

  const lines = [
    "| Spec | Stated | Implementation binding | Members joined |",
    "|---|---|---|---|",
  ];

  for (const row of rows) {
    const joined = row.via
      .map(
        (via) =>
          `${via.type}: ${via.members.map((member) => `[\`${member}\`](${pageHref(page, pagePathOf(member))})`).join(", ")}`,
      )
      .join(" · ");
    lines.push(
      `| [\`${row.id}\`](${pageHref(page, pagePathOf(row.id))}) ${tableCell(row.title ?? "")} | ${row.statedReadiness} | ${row.implemented ? "present" : "none"} | ${joined} |`,
    );
  }

  return lines;
}

export function renderBoundarySection(context: PackContext, page: string): readonly string[] {
  return [
    "## Boundary",
    "",
    "### Rests on",
    "",
    "The Specs outside the Pack that a member refines, depends on, is constrained by or is decided by.",
    "",
    ...renderBoundaryTable(context.boundary.restsOn, page),
    "",
    "### Rested on by",
    "",
    "The Specs outside the Pack that relate to a member by an authored relation.",
    "",
    ...renderBoundaryTable(context.boundary.restedOnBy, page),
  ];
}

export function renderOpenQuestionsSection(context: PackContext, page: string): readonly string[] {
  const lines = ["## Open questions", ""];
  const asking = resolvedMembers(context).filter(
    (member) => (member.design?.openQuestions ?? []).length > 0,
  );

  if (asking.length === 0) {
    lines.push("No member records an open question.");
    return lines;
  }

  for (const [position, member] of asking.entries()) {
    lines.push(
      ...(position === 0 ? [] : [""]),
      `### ${specLink(page, member.id, member.title)}`,
      "",
    );

    for (const question of member.design?.openQuestions ?? []) {
      const flag = question.blocking ? "**blocking**" : "non-blocking";
      const address =
        question.key === undefined
          ? ""
          : ` · ${renderInlineCode(`${member.id}#question.${question.key}`)}`;
      const location =
        question.line === undefined || member.file === undefined
          ? ""
          : ` ([${linkLabel(member.file)}:${String(question.line)}](${lineHref(page, member.file, question.line)}))`;
      lines.push(`- ${flag}${address} — ${inlineText(question.question)}${location}`);
    }
  }

  return lines;
}

/** One unit: id, label, a line link, its role and own structure, and its component's. */
function renderUnit(binding: CodeUnitBinding, page: string): string {
  const label = binding.label === undefined ? "" : ` — ${inlineText(binding.label)}`;
  const location =
    binding.file === undefined
      ? ""
      : binding.line === undefined
        ? ` ([${linkLabel(binding.file)}](${fileHref(page, binding.file)}))`
        : ` ([${linkLabel(binding.file)}:${String(binding.line)}](${lineHref(page, binding.file, binding.line)}))`;
  const own = (
    [
      ["role", binding.role],
      ["layer", binding.layer],
      ["context", binding.context],
    ] as const
  ).flatMap(([name, value]) => (value === undefined ? [] : [`${name} ${renderInlineCode(value)}`]));
  const component = binding.component;
  const componentStructure =
    component === undefined
      ? []
      : (
          [
            ["layer", component.layer],
            ["context", component.context],
          ] as const
        ).flatMap(([name, value]) =>
          value === undefined ? [] : [`${name} ${renderInlineCode(value)}`],
        );
  const attributes = [
    ...own,
    ...(component === undefined
      ? []
      : [
          `component \`${component.id}\`${componentStructure.length === 0 ? "" : ` (${componentStructure.join(", ")})`}`,
        ]),
  ].join(" · ");

  return `- \`${binding.codeId}\`${label}${location}${attributes === "" ? "" : ` · ${attributes}`} \`[${binding.claim}]\``;
}

export function renderCodeSection(context: PackContext, page: string): readonly string[] {
  const lines = [
    "## Code",
    "",
    "The code units that realize each member, and those that answer to its design without claiming to realize it, each with its role and its component's layer and context. A reference confers no implementation binding.",
  ];

  for (const member of resolvedMembers(context)) {
    const implementations = member.implementations ?? [];
    const references = member.references ?? [];
    lines.push("", `### ${specLink(page, member.id, member.title)}`, "");

    if (implementations.length === 0 && references.length === 0) {
      lines.push("No implementation or design-reference binding is recorded for this member.");
      continue;
    }

    if (implementations.length > 0) {
      lines.push(
        "#### Implementations",
        "",
        ...implementations.map((unit) => renderUnit(unit, page)),
      );
    }

    if (references.length > 0) {
      lines.push(
        ...(implementations.length > 0 ? [""] : []),
        "#### Referenced by",
        "",
        ...references.map((unit) => renderUnit(unit, page)),
      );
    }
  }

  return lines;
}

/** The member table's stated-next-rung cell: `holds`, the first unmet clause, or none. */
export function renderStatedNextRungCell(member: PackMemberSummary): string {
  if (member.statedNextRung === undefined) {
    return "—";
  }

  const first = member.statedNextRungFailures?.[0];

  return `${member.statedNextRung} · ${first === undefined ? "holds" : renderTableInlineCode(first.clauseId)}`;
}

/** The member table's decisions cell: each decision linked with its stated rung. */
export function renderDecisionsCell(member: PackMemberSummary, page: string): string {
  const decisions = member.design?.decisions ?? [];

  if (decisions.length === 0) {
    return "—";
  }

  return decisions
    .map((decision) =>
      decision.resolved
        ? `[\`${decision.id}\`](${pageHref(page, pagePathOf(decision.id))}) (${decision.statedReadiness ?? ""})`
        : `\`${decision.id}\` (unresolved)`,
    )
    .join(", ");
}
