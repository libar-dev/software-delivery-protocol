import { runRows } from "./run-rows.js";
import type { SpecContext } from "../../../reader/reader.js";
import type { PageContext } from "./html.js";
import {
  citationRows,
  code,
  sourceCode,
  copy,
  escape,
  link,
  list,
  location,
  present,
  rungLine,
} from "./html.js";
import { codeSpans, text } from "./text.js";
import type { RuleCoverage, SpaceCoverage } from "./tests-page.js";

// S5 upgrades these empty action slots with controls and the composing panel.
export const composeSlot = (scope: string, action: string): string =>
  `<sdp-compose scope="${escape(scope)}" action="${action}"></sdp-compose>`;

export function entryCitations(ctx: PageContext, spec: SpecContext, address: string): string {
  const answer = ctx.data.recipes.all.get(51) as {
    entries: {
      address: string;
      pinned: boolean;
      citedBy: { file: string; line: number; anchors: string[]; testAnchors: string[] }[];
    }[];
  };
  const row = answer.entries.find((row) => row.address === `${spec.id}#${address}`);
  if (!row) return "";
  if (row.citedBy.length === 0)
    return row.pinned ? '<p class="citations">no citation recorded</p>' : "";
  return `<div class="citations">${citationRows(row.citedBy)}</div>`;
}

export function ruleCoverage(ctx: PageContext, spec: SpecContext, key: string): string {
  const answer = ctx.data.recipes.specs.get(spec.id)?.get(34) as RuleCoverage | undefined;
  const row = answer?.rows.find((row) => row.address === `${spec.id}#rule.${key}`);
  return `<p class="rule-coverage">${row?.exercisedBy.length ? row.exercisedBy.map((e) => `${link(ctx, e.example)} · ${e.enabled ? "enabled" : "not enabled"}`).join(", ") : "no example exercises it"}</p>`;
}
export function exampleSteps(spec: SpecContext): string {
  return (spec.sections?.behavior?.examples ?? [])
    .map((example) =>
      typeof example === "string"
        ? `<p>${escape(example)}</p>`
        : `<pre>${escape(["given", "when", "then"].flatMap((phase) => example[phase as "given" | "when" | "then"].map((step) => `${phase.charAt(0).toUpperCase() + phase.slice(1)} ${step}`)).join("\n"))}</pre>`,
    )
    .join("");
}
export function exampleCards(ctx: PageContext, spec: SpecContext): string {
  const examples = spec.verifiers
    .filter((v) => v.via === "example")
    .map((v) => ctx.data.specs.find((s) => s.id === v.verifierId))
    .filter((s) => s !== undefined);
  if (!examples.length) return "";
  return `<h3>Verifying examples</h3>${examples
    .map((example) => {
      const steps = exampleSteps(example);
      const executable = example.verifiers.some((v) => v.via === "test-anchor");
      return `<article class="example-card"><sdp-spec-card spec-id="${escape(example.id)}" variant="short"><p>${link(ctx, example.id, example.title ?? example.id, codeSpans(example.title ?? example.id))} · ${code(example.id)} · ${rungLine(example.statedReadiness, example.derivedReadiness)}</p></sdp-spec-card><p>${executable ? "Executable Spec" : "No verifier binding"}</p>${steps || "<p>No given, when and then steps recorded.</p>"}<p>${link(ctx, example.id, "Open example")}${composeSlot(example.id, steps ? "edit-example" : "propose-example")}</p></article>`;
    })
    .join("")}`;
}
export function constraintTarget(
  ctx: PageContext,
  spec: SpecContext,
  constraint: NonNullable<NonNullable<SpecContext["sections"]>["constraints"]>[number],
): string {
  return `<dl><dt>Flavor</dt><dd>${escape(constraint.flavor ?? "not recorded")}</dd><dt>Statement</dt><dd>${text(ctx, constraint.statement)}</dd><dt>Target</dt><dd>${constraint.target === undefined ? "No target recorded." : text(ctx, constraint.target)}${composeSlot(spec.id, constraint.target === undefined ? "propose-target" : "change-target")}</dd>${constraint.measurableBy === undefined ? "" : `<dt>Measurable by</dt><dd>${text(ctx, constraint.measurableBy)}</dd>`}<dt>Measured value</dt><dd>not tracked</dd></dl>`;
}

/**
 * @sdpAnchor impl:protocol.studio-verification-panels
 * @sdpLabel renders rule coverage, example cards, constraint targets, verifiers and example-space coverage
 * @sdpReferences spec:consumers.spec-studio.verification-panels, spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function verificationPanel(ctx: PageContext, spec: SpecContext): string {
  const renderedFiles = new Set<string>();
  const verifiers = list(
    spec.verifiers.map((v) => {
      const anchors =
        v.via === "test-anchor"
          ? [v.verifierId]
          : (ctx.data.specs.find((s) => s.id === v.verifierId)?.verifiers ?? [])
              .filter((binding) => binding.via === "test-anchor")
              .map((binding) => binding.verifierId);
      const runs = anchors
        .map((id) => runRows(ctx, spec.id, id, undefined, renderedFiles))
        .join("");
      return `${link(ctx, v.verifierId)}${v.label === undefined ? "" : ` · ${escape(v.label)}`} · ${escape(v.claim)} · ${v.via === "example" ? `example ${v.enabled ? "enabled" : "not enabled"}` : "test anchor binding present"} · ${sourceCode(v.file, v.line)}${v.file === undefined ? "" : copy(location(v.file, v.line))}${runs}`;
    }),
  );
  return `<h3>Verifier bindings</h3>${spec.verifiers.length ? verifiers : "<p>No verifier binding recorded.</p>"}${spec.sections?.behavior === undefined ? exampleCards(ctx, spec) : ""}${exampleSpace(ctx, spec)}`;
}
function exampleSpace(ctx: PageContext, spec: SpecContext): string {
  const space = spec.exampleSpace;
  if (!space) return "";
  const coverage = (ctx.data.recipes.all.get(44) as SpaceCoverage).spaces.find(
    (s) => s.spec === spec.id,
  );
  const slots = list(
    space.slots.map(
      (slot) =>
        `${code(slot.name)} · ${code(slot.type === "enum" ? (slot.values ?? []).map((v) => JSON.stringify(v)).join(" | ") : slot.type)} · declared by ${code(slot.step)}`,
    ),
  );
  const points = space.points.length
    ? `<div class="table-scroll" role="region" aria-label="Bound example points" tabindex="0"><table><thead><tr><th>Example</th>${space.slots.map((slot) => `<th>${escape(slot.name)}</th>`).join("")}</tr></thead><tbody>${space.points.map((p) => `<tr><th scope="row">${link(ctx, p.example)}</th>${space.slots.map((slot) => `<td>${Object.hasOwn(p.values, slot.name) ? code(JSON.stringify(p.values[slot.name])) : "unbound"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    : "<p>No bound example points recorded.</p>";
  const grid =
    coverage?.slots
      .map((slot) =>
        slot.enumerable
          ? `<div class="table-scroll" role="region" aria-label="Coverage of ${escape(slot.name)}" tabindex="0"><table><caption>${code(slot.name)}</caption><thead><tr><th>Declared value</th><th>Examples</th></tr></thead><tbody>${slot.values.map((v) => `<tr><th scope="row">${code(JSON.stringify(v.value))}</th><td>${v.examples.length ? v.examples.map((id) => link(ctx, id)).join(", ") : "no example"}</td></tr>`).join("")}</tbody></table></div>`
          : `<p>${code(slot.name)}: ${slot.values.map((v) => `${code(JSON.stringify(v.value))} · ${v.examples.map((id) => link(ctx, id)).join(", ")}`).join("; ") || "No bound values"} · not enumerable</p>`,
      )
      .join("") ?? "";
  const unbound = list(
    (coverage?.slots ?? []).map(
      (slot) =>
        `${code(slot.name)}: ${slot.unbound.length ? slot.unbound.map((id) => link(ctx, id)).join(", ") : "None"}`,
    ),
  );
  const oracle = spec.oracle;
  return `<sdp-example-space spec-id="${escape(spec.id)}"><h3>Example space</h3>${slots}<h4>Bound points</h4>${points}<p>Oracle binding: ${present(oracle !== undefined)}${oracle ? ` · ${code(oracle.anchorId)} · ${sourceCode(oracle.file, oracle.line)}${oracle.file === undefined ? "" : copy(location(oracle.file, oracle.line))}` : ""}</p><h4>Coverage</h4>${grid}<h4>Unbound</h4>${unbound}${composeSlot(spec.id, "propose-values")}</sdp-example-space>`;
}
export function evidencePanel(spec: SpecContext): string {
  return `<p>Runtime observation: ${spec.deliveryFacts.includes("observed") ? "observed" : "not tracked"}.</p><p>Build attestations: not tracked.</p><p>Deployments: not tracked.</p><p>Bills of materials: not tracked.</p>`;
}
