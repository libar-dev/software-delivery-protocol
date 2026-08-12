import { SPEC_READINESS } from "../model/descriptors.js";
import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { RelationEnd, SpecContext, VerifierBinding } from "../reader/reader.js";
import type { Finding } from "../validate/contracts.js";
import { escapeRenderedField } from "./owned-prose.js";
import {
  pageHref,
  pagePathOf,
  renderTableInlineCode,
  sourceHref,
  tableCell,
} from "./design-review-markdown.js";

const derivedReadinessBannerAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.derived-readiness-banner"),
  label: "renders stated readiness beside the structural floor and dishonest divergence",
  satisfies: ref("spec:consumers.derived-readiness-banner"),
});
void derivedReadinessBannerAnchor;

export function renderReadiness(context: SpecContext): readonly string[] {
  const derived = context.derivedReadiness;
  const lines = [
    `**Readiness:** stated \`${context.statedReadiness}\` · structural floor reached: ${
      derived === undefined ? "none (the `idea` floor is unmet)" : `\`${derived}\``
    }`,
  ];

  const statedRank = SPEC_READINESS.indexOf(context.statedReadiness);
  const derivedRank = derived === undefined ? -1 : SPEC_READINESS.indexOf(derived);

  if (derivedRank < statedRank) {
    const firstUnmet = context.floorFailures[0];
    const clause =
      firstUnmet === undefined
        ? ""
        : ` First unmet clause: \`${firstUnmet.clauseId}\` — ${escapeRenderedField(firstUnmet.description)}`;
    lines.push(
      "",
      `> **Readiness divergence.** This spec states \`${context.statedReadiness}\` but the structural floor reached is ${
        derived === undefined ? "below `idea`" : `\`${derived}\``
      }.${clause}`,
    );
  }

  return lines;
}

function describeVerifier(verifier: VerifierBinding): string {
  if (verifier.via === "test-anchor") {
    return verifier.enabled
      ? "the enabled verifying binding (a resolving test anchor)"
      : "**not enabled** (an off-contract `verifies` edge — it confers no verifier binding)";
  }

  if (verifier.enabled) {
    return "**enabled** (a resolving test anchor binds this example)";
  }

  return verifier.claim === "declared"
    ? "**not enabled** (no test anchor binds this example — it confers no verifier binding)"
    : "**not enabled** (an off-contract `verifies` edge — it confers no verifier binding)";
}

const bindingLanguageSpecPageAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.binding-language-spec-page"),
  label: "renders implementation, verifier, oracle, and observation binding language",
  satisfies: ref("spec:consumers.binding-language-views"),
});
void bindingLanguageSpecPageAnchor;

export function renderBindings(context: SpecContext, page: string): readonly string[] {
  const present = (fact: "implemented" | "has-verifier"): string =>
    context.deliveryFacts.includes(fact) ? "present" : "none";

  const lines = [
    "## Bindings",
    "",
    `- Implementation binding: **${present("implemented")}**`,
    `- Verifier binding: **${present("has-verifier")}**`,
    `- Expected-outcome oracle: **${context.oracle === undefined ? "none" : "present"}**`,
    "- Runtime observation: **not tracked**",
  ];

  if (context.implementations.length > 0) {
    lines.push("", "### Implementations", "");

    for (const binding of context.implementations) {
      const label = binding.label === undefined ? "" : ` — ${escapeRenderedField(binding.label)}`;
      const location =
        binding.file === undefined
          ? ""
          : ` ([${escapeRenderedField(binding.file)}${binding.line === undefined ? "" : `:${String(binding.line)}`}](${sourceHref(page, binding.file)}))`;
      lines.push(`- \`${binding.codeId}\`${label}${location} \`[${binding.claim}]\``);
    }
  }

  if (context.verifiers.length > 0) {
    lines.push("", "### Verifiers", "");

    for (const verifier of context.verifiers) {
      const label = verifier.label === undefined ? "" : ` — ${escapeRenderedField(verifier.label)}`;
      const location =
        verifier.file === undefined
          ? ""
          : ` ([${escapeRenderedField(verifier.file)}${verifier.line === undefined ? "" : `:${String(verifier.line)}`}](${sourceHref(page, verifier.file)}))`;
      lines.push(
        `- \`${verifier.verifierId}\`${label}${location} — ${describeVerifier(verifier)} \`[${verifier.claim}]\``,
      );
    }
  }

  if (context.oracle !== undefined) {
    const oracle = context.oracle;
    const label = oracle.label === undefined ? "" : ` — ${escapeRenderedField(oracle.label)}`;
    const location =
      oracle.file === undefined
        ? ""
        : ` ([${escapeRenderedField(oracle.file)}${oracle.line === undefined ? "" : `:${String(oracle.line)}`}](${sourceHref(page, oracle.file)}))`;
    lines.push("", "### Expected-outcome oracle", "");
    lines.push(
      `- \`${oracle.anchorId}\`${label}${location} — the authored expected-outcome semantics for this spec's example space; the graph records that it exists, never what it says \`[${oracle.claim}]\``,
    );
  }

  return lines;
}

function linkTo(page: string, end: RelationEnd): string {
  const display = end.otherTitle === undefined ? "" : ` — ${escapeRenderedField(end.otherTitle)}`;

  if (end.resolved && (end.otherNodeType === "Primitive" || end.otherNodeType === "Pack")) {
    return `[\`${end.otherId}\`](${pageHref(page, pagePathOf(end.otherId))})${display}`;
  }

  return end.resolved
    ? `\`${end.otherId}\`${display}`
    : `\`${end.otherId}\` — **unresolved** (see findings)`;
}

export function renderRelationsAndImpact(context: SpecContext, page: string): readonly string[] {
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

const diagnosticDesignReviewAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.diagnostic-rendering-design-review"),
  label: "renders structured finding locations in the Design Review table",
  satisfies: ref("spec:validation.diagnostic-rendering"),
});
void diagnosticDesignReviewAnchor;

export function renderFindings(findings: readonly Finding[]): readonly string[] {
  if (findings.length === 0) {
    return ["## Findings", "", "None — conformance + honesty clean for this page's subject."];
  }

  const lines = ["## Findings", "", "| Severity | Check | Message | Where |", "|---|---|---|---|"];

  for (const finding of findings) {
    const where =
      finding.file === undefined
        ? "—"
        : renderTableInlineCode(
            `${finding.file}${finding.line === undefined ? "" : `:${String(finding.line)}`}`,
          );
    lines.push(
      `| ${tableCell(finding.severity)} | ${renderTableInlineCode(finding.validatorId)} | ${tableCell(finding.message)} | ${where} |`,
    );
  }

  return lines;
}
