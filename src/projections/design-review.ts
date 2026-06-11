import { SPEC_READINESS } from "../model/descriptors.js";
import type { Finding } from "../validate/contracts.js";
import type {
  PackContext,
  Reader,
  RelationEnd,
  SpecContext,
  SpecSummary,
  VerifierBinding,
} from "../reader/reader.js";

/**
 * The Design Review — the one MVP read-only human view (`06` §5): a pure projection of the one
 * graph, rendered as Markdown pages (index + one page per spec and per pack). Fully derived and
 * regenerable; consumes **only** the reader (the one decode path — re-joining the graph here
 * would be the consumption-side second store), and links only to source locations the graph
 * records (R2). Pages carry no timestamps and no commit hashes: the view is `f(graph)`, nothing
 * else, so regeneration from the same graph is byte-identical.
 *
 * Views speak binding language (MD-7): the delivery-fact names stay internal; what renders is
 * "Implementation binding / Verifier binding / Runtime observation: not tracked" — bindings,
 * never liveness. Stated readiness renders beside the structurally-reached floor, and the
 * divergence banner fires only in the dishonest direction (`05` §3).
 */
export interface DesignReviewPage {
  /** POSIX path under the view root (`generated/design-review/`), e.g. `spec/orders.create-order.md`. */
  readonly path: string;
  readonly content: string;
}

/* ----- deterministic Markdown plumbing ----- */

/** `spec:orders.create-order` → `spec/orders.create-order.md` — bijective by the id grammar (one `:`). */
function pagePathOf(id: string): string {
  const colonIndex = id.indexOf(":");

  return `${id.slice(0, colonIndex)}/${id.slice(colonIndex + 1)}.md`;
}

function directoryOf(pagePath: string): readonly string[] {
  return pagePath.split("/").slice(0, -1);
}

/** Relative link between two view pages. */
function pageHref(fromPage: string, toPage: string): string {
  const fromDirectory = directoryOf(fromPage);
  const toParts = toPage.split("/");
  let shared = 0;

  while (shared < fromDirectory.length && fromDirectory[shared] === toParts[shared]) {
    shared += 1;
  }

  return `${"../".repeat(fromDirectory.length - shared)}${toParts.slice(shared).join("/")}`;
}

/** Relative link from a view page to a repo file recorded in the graph (root-relative, JS-C3). */
function sourceHref(fromPage: string, file: string): string {
  // Up out of the page's directories, then out of `design-review/` and `generated/`.
  return `${"../".repeat(directoryOf(fromPage).length + 2)}${file}`;
}

/** One-line table cell: pipes escaped, newlines collapsed — content never breaks the table. */
function tableCell(text: string): string {
  return text.replaceAll("|", "\\|").replaceAll(/\s+/gu, " ").trim();
}

function heading(title: string | undefined, id: string): string {
  return `# ${title ?? id}`;
}

const PAGE_FOOTER =
  "*Generated from the one graph by `sdp view` — read-only; regenerate to update.*";

/* ----- defensive value access (sections are reified value data, never typed instances) ----- */

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

function asArray(value: unknown): readonly unknown[] | undefined {
  return Array.isArray(value) ? (value as readonly unknown[]) : undefined;
}

function asText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function textEntries(value: unknown): readonly string[] {
  return (asArray(value) ?? []).flatMap((entry) => {
    const text = asText(entry);

    return text === undefined ? [] : [text];
  });
}

/* ----- the readiness header (`05` §3, `07` §6 ③) ----- */

function renderReadiness(context: SpecContext): readonly string[] {
  const derived = context.derivedReadiness;
  const lines = [
    `**Readiness:** stated \`${context.statedReadiness}\` · structural floor reached: ${
      derived === undefined ? "none (the `idea` floor is unmet)" : `\`${derived}\``
    }`,
  ];

  const statedRank = SPEC_READINESS.indexOf(context.statedReadiness);
  const derivedRank = derived === undefined ? -1 : SPEC_READINESS.indexOf(derived);

  // The banner fires only in the dishonest direction: derived at-or-above stated is ordinary
  // information (the floor is never a quota and never nags upward).
  if (derivedRank < statedRank) {
    const firstUnmet = context.floorFailures[0];
    const clause =
      firstUnmet === undefined
        ? ""
        : ` First unmet clause: \`${firstUnmet.clauseId}\` — ${firstUnmet.description}`;
    lines.push(
      "",
      `> **Readiness divergence.** This spec states \`${context.statedReadiness}\` but the structural floor reached is ${
        derived === undefined ? "below `idea`" : `\`${derived}\``
      }.${clause}`,
    );
  }

  return lines;
}

/* ----- bindings in binding language (`07` §6 ④) ----- */

function describeVerifier(verifier: VerifierBinding): string {
  if (verifier.via === "test-anchor") {
    return verifier.enabled
      ? "the enabled verifying binding (a resolving test anchor)"
      : "**not enabled** (an off-contract `verifies` edge — it confers no verifier binding)";
  }

  return verifier.enabled
    ? "**enabled** (a resolving test anchor binds this example)"
    : "**not enabled** (no test anchor binds this example — it confers no verifier binding)";
}

function renderBindings(context: SpecContext, page: string): readonly string[] {
  const present = (fact: "implemented" | "has-verifier"): string =>
    context.deliveryFacts.includes(fact) ? "present" : "none";

  const lines = [
    "## Bindings",
    "",
    `- Implementation binding: **${present("implemented")}**`,
    `- Verifier binding: **${present("has-verifier")}**`,
    "- Runtime observation: **not tracked**",
  ];

  if (context.implementations.length > 0) {
    lines.push("", "### Implementations", "");

    for (const binding of context.implementations) {
      const label = binding.label === undefined ? "" : ` — ${binding.label}`;
      const location =
        binding.file === undefined
          ? ""
          : ` ([${binding.file}${binding.line === undefined ? "" : `:${String(binding.line)}`}](${sourceHref(page, binding.file)}))`;
      lines.push(`- \`${binding.codeId}\`${label}${location} \`[${binding.claim}]\``);
    }
  }

  if (context.verifiers.length > 0) {
    lines.push("", "### Verifiers", "");

    for (const verifier of context.verifiers) {
      const label = verifier.label === undefined ? "" : ` — ${verifier.label}`;
      const location =
        verifier.file === undefined
          ? ""
          : ` ([${verifier.file}${verifier.line === undefined ? "" : `:${String(verifier.line)}`}](${sourceHref(page, verifier.file)}))`;
      lines.push(
        `- \`${verifier.verifierId}\`${label}${location} — ${describeVerifier(verifier)} \`[${verifier.claim}]\``,
      );
    }
  }

  return lines;
}

/* ----- section content ----- */

function renderIntent(intent: Record<string, unknown>): readonly string[] {
  const lines: string[] = ["## Intent", ""];

  for (const field of ["actor", "problem", "outcome", "value"]) {
    const text = asText(intent[field]);

    if (text !== undefined) {
      lines.push(`- **${field}:** ${text}`);
    }
  }

  for (const field of ["risks", "assumptions"]) {
    const entries = textEntries(intent[field]);

    if (entries.length > 0) {
      lines.push(`- **${field}:**`);
      lines.push(...entries.map((entry) => `  - ${entry}`));
    }
  }

  const openQuestions = asArray(intent.openQuestions) ?? [];

  if (openQuestions.length > 0) {
    lines.push("", "### Open questions", "");

    for (const entry of openQuestions) {
      const prose = asText(entry);

      if (prose !== undefined) {
        lines.push(`- ${prose}`);
        continue;
      }

      const structured = asRecord(entry);
      const question = asText(structured?.question) ?? "(malformed open-question entry)";
      const blocking = structured?.blocking === true ? " — **blocking**" : "";
      lines.push(`- ${question}${blocking}`);
    }
  }

  return lines;
}

function renderBehavior(behavior: Record<string, unknown>): readonly string[] {
  const lines: string[] = ["## Behavior"];
  const rules = textEntries(behavior.rules);

  if (rules.length > 0) {
    lines.push("", "### Rules", "", ...rules.map((rule) => `- ${rule}`));
  }

  const examples = asArray(behavior.examples) ?? [];

  if (examples.length > 0) {
    lines.push("", "### Examples", "");

    for (const entry of examples) {
      const prose = asText(entry);

      if (prose !== undefined) {
        lines.push(`- ${prose}`);
        continue;
      }

      const structured = asRecord(entry);

      if (structured === undefined) {
        continue;
      }

      lines.push("- Example:");

      for (const phase of ["given", "when", "then"]) {
        const steps = textEntries(structured[phase]);

        if (steps.length > 0) {
          lines.push(`  - **${phase}**`);
          lines.push(...steps.map((step) => `    - ${step}`));
        }
      }
    }
  }

  const flows = textEntries(behavior.flows);

  if (flows.length > 0) {
    lines.push("", "### Flows", "", ...flows.map((flow) => `- ${flow}`));
  }

  return lines.length === 1 ? [] : lines;
}

function renderConstraints(entries: readonly unknown[]): readonly string[] {
  const lines = [
    "## Constraints",
    "",
    "| Flavor | Statement | Target | Measurable by |",
    "|---|---|---|---|",
  ];

  for (const entry of entries) {
    const constraint = asRecord(entry) ?? {};
    const cell = (field: string): string => tableCell(asText(constraint[field]) ?? "—");
    lines.push(
      `| ${cell("flavor")} | ${cell("statement")} | ${cell("target")} | ${cell("measurableBy")} |`,
    );
  }

  return lines;
}

function renderModel(model: Record<string, unknown>): readonly string[] {
  const terms = asRecord(model.terms) ?? {};
  const names = Object.keys(terms);

  if (names.length === 0) {
    return [];
  }

  const lines = ["## Domain vocabulary", "", "| Term | Definition |", "|---|---|"];

  for (const name of names) {
    lines.push(`| ${tableCell(name)} | ${tableCell(asText(terms[name]) ?? "—")} |`);
  }

  return lines;
}

function renderDecision(decision: Record<string, unknown>): readonly string[] {
  const lines: string[] = ["## Decision"];
  const context = asText(decision.context);

  if (context !== undefined) {
    lines.push("", `**Context.** ${context}`);
  }

  const chosen = asText(decision.decision);

  if (chosen !== undefined) {
    lines.push("", `**Decision.** ${chosen}`);
  }

  for (const field of ["rationale", "alternatives", "consequences"]) {
    const entries = textEntries(decision[field]);

    if (entries.length > 0) {
      lines.push(
        "",
        `**${field[0]?.toUpperCase() ?? ""}${field.slice(1)}.**`,
        "",
        ...entries.map((entry) => `- ${entry}`),
      );
    }
  }

  return lines.length === 1 ? [] : lines;
}

function renderVerification(verification: Record<string, unknown>): readonly string[] {
  const lines: string[] = ["## Verification intent"];
  const mode = asText(verification.mode);

  if (mode !== undefined) {
    lines.push("", `- **mode:** \`${mode}\``);
  }

  const criteria = textEntries(verification.criteria);

  if (criteria.length > 0) {
    lines.push("", "### Criteria", "", ...criteria.map((criterion) => `- ${criterion}`));
  }

  return lines.length === 1 ? [] : lines;
}

/** The open bags (`design` / `ui`, L9): authored order preserved, rendered as data. */
function renderOpenBag(name: string, content: Record<string, unknown>): readonly string[] {
  if (Object.keys(content).length === 0) {
    return [];
  }

  return [
    `## ${name[0]?.toUpperCase() ?? ""}${name.slice(1)}`,
    "",
    "```json",
    ...JSON.stringify(content, null, 2).split("\n"),
    "```",
  ];
}

function renderSections(context: SpecContext): readonly string[] {
  const sections = (context.sections ?? {}) as Record<string, unknown>;
  const lines: string[] = [];
  const append = (rendered: readonly string[]): void => {
    if (rendered.length > 0) {
      lines.push("", ...rendered);
    }
  };

  const intent = asRecord(sections.intent);

  if (intent !== undefined) {
    append(renderIntent(intent));
  }

  const behavior = asRecord(sections.behavior);

  if (behavior !== undefined) {
    append(renderBehavior(behavior));
  }

  const constraints = asArray(sections.constraints);

  if (constraints !== undefined && constraints.length > 0) {
    append(renderConstraints(constraints));
  }

  const model = asRecord(sections.model);

  if (model !== undefined) {
    append(renderModel(model));
  }

  const decision = asRecord(sections.decision);

  if (decision !== undefined) {
    append(renderDecision(decision));
  }

  const verification = asRecord(sections.verification);

  if (verification !== undefined) {
    append(renderVerification(verification));
  }

  for (const name of ["design", "ui"]) {
    const bag = asRecord(sections[name]);

    if (bag !== undefined) {
      append(renderOpenBag(name, bag));
    }
  }

  return lines;
}

/* ----- relations, impact, findings ----- */

function linkTo(page: string, end: RelationEnd): string {
  const display = end.otherTitle === undefined ? "" : ` — ${end.otherTitle}`;

  if (end.resolved && (end.otherNodeType === "Primitive" || end.otherNodeType === "Pack")) {
    return `[\`${end.otherId}\`](${pageHref(page, pagePathOf(end.otherId))})${display}`;
  }

  return end.resolved
    ? `\`${end.otherId}\`${display}`
    : `\`${end.otherId}\` — **unresolved** (see findings)`;
}

/**
 * One section, two readings (JS-E1/JS-G1): the relation list *is* the per-spec impact list —
 * every line is a one-hop neighbor, so a change to this spec touches exactly this list plus the
 * bindings above. Stated once, never as a second list to drift.
 */
function renderRelationsAndImpact(context: SpecContext, page: string): readonly string[] {
  // Incoming `verifies` edges render under Bindings (the decoded verifier join), never twice;
  // outgoing ones stay here — a verifier's own page must show what it covers (JS-G2).
  const outgoing = context.relationsOut;
  const incoming = context.relationsIn.filter((end) => end.type !== "verifies");
  const lines: string[] = [
    "## Relations & impact (one hop)",
    "",
    "Every line is a one-hop neighbor over the curated graph: changing this spec touches this list plus the bindings above. Deeper reach is a script over the reader; symbol-level reach is the aspirational impact graph.",
    "",
  ];

  if (context.packs.length > 0) {
    const packLinks = context.packs
      .map((packId) => `[\`${packId}\`](${pageHref(page, pagePathOf(packId))})`)
      .join(" · ");
    lines.push(`- Belongs to: ${packLinks} \`[declared]\``);
  }

  for (const end of outgoing) {
    lines.push(`- ${end.type} → ${linkTo(page, end)} \`[${end.claim}]\``);
  }

  for (const end of incoming) {
    lines.push(`- ${linkTo(page, end)} — ${end.type} → this spec \`[${end.claim}]\``);
  }

  return lines.length === 4 ? [] : lines;
}

function renderFindings(findings: readonly Finding[]): readonly string[] {
  if (findings.length === 0) {
    return ["## Findings", "", "None — conformance + honesty clean for this page's subject."];
  }

  const lines = ["## Findings", "", "| Severity | Check | Message | Where |", "|---|---|---|---|"];

  for (const finding of findings) {
    // Location from the structured `file`/`line` fields — a source location *recorded in the
    // graph* (R2); `Primitive` nodes are line-free by design, so the line renders only when known.
    const where =
      finding.file === undefined
        ? "—"
        : `\`${finding.file}${finding.line === undefined ? "" : `:${String(finding.line)}`}\``;
    lines.push(
      `| ${finding.severity} | \`${finding.validatorId}\` | ${tableCell(finding.message)} | ${where} |`,
    );
  }

  return lines;
}

/* ----- pages ----- */

function renderSpecPage(context: SpecContext): DesignReviewPage {
  const page = pagePathOf(context.id);
  const kind =
    context.kindDisplayLabel === undefined
      ? `\`${context.specKind}\``
      : `${context.kindDisplayLabel} (\`${context.specKind}\`)`;
  const lines = [
    heading(context.title, context.id),
    "",
    `\`${context.id}\` · ${kind} · altitude \`${context.altitude}\` · authored in [${context.file}](${sourceHref(page, context.file)}) \`[declared]\``,
    "",
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

function renderPackPage(context: PackContext, specLabel: (id: string) => string): DesignReviewPage {
  const page = pagePathOf(context.id);
  const lines = [
    heading(context.title, context.id),
    "",
    `\`${context.id}\` · Pack (the grouping / review aggregate — states no truth of its own) · authored in [${context.file}](${sourceHref(page, context.file)}) \`[declared]\``,
  ];

  if (context.framing !== undefined) {
    lines.push("", `> ${context.framing}`);
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

function renderIndexPage(reader: Reader, specs: readonly SpecSummary[]): DesignReviewPage {
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
      const framing = pack.framing === undefined ? "" : ` — ${pack.framing}`;
      lines.push(
        `- [\`${pack.id}\`](${pageHref(page, pagePathOf(pack.id))}) ${pack.title ?? ""}${framing}`,
      );
    }
  }

  lines.push("", ...renderFindings(findings), "", "---", "", PAGE_FOOTER);

  return { path: page, content: `${lines.join("\n")}\n` };
}

/**
 * Renders the full Design Review off the reader. Pure and fs-free: the caller owns writing the
 * pages (and owns the wholesale rewrite that keeps deleted specs from leaving stale pages).
 */
export function renderDesignReview(reader: Reader): readonly DesignReviewPage[] {
  const specs = reader.specs();
  const pages: DesignReviewPage[] = [renderIndexPage(reader, specs)];

  const specLabelFrom = (page: string) => {
    return (id: string): string => {
      const known = specs.find((entry) => entry.id === id);

      return known === undefined
        ? `\`${id}\``
        : `[\`${id}\`](${pageHref(page, pagePathOf(id))})${known.title === undefined ? "" : ` — ${known.title}`}`;
    };
  };

  for (const spec of specs) {
    const context = reader.specContext(spec.id);

    if (context !== undefined) {
      pages.push(renderSpecPage(context));
    }
  }

  for (const pack of reader.packs()) {
    const context = reader.packContext(pack.id);

    if (context !== undefined) {
      pages.push(renderPackPage(context, specLabelFrom(pagePathOf(pack.id))));
    }
  }

  return pages.sort((left, right) =>
    left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
  );
}
