import { frame } from "./frame.js";
import { code, escape, link } from "./html.js";
import type { PageContext } from "./html.js";
import { codeSpans } from "./text.js";
export interface CoverageSpace {
  spec: string;
  examples: string[];
  slots: {
    name: string;
    type: string;
    step: string;
    enumerable: boolean;
    values: { value: string | number | boolean; examples: string[] }[];
    unbound: string[];
  }[];
}
export interface SpaceCoverage {
  spaces: CoverageSpace[];
  totals: { spaces: number; slots: number; enumerable: number; values: number; uncovered: number };
}
export interface RuleCoverage {
  totals: { keyedRules: number; exercised: number; unexercised: number; unkeyedRules: number };
  rows: { address: string; exercisedBy: { example: string; enabled: boolean }[] }[];
}
/**
 * @sdpAnchor impl:protocol.studio-tests-lens
 * @sdpLabel renders shared rule and example-space coverage with filters and verifier bindings
 * @sdpReferences spec:consumers.spec-studio.lenses.tests, spec:consumers.spec-studio.lenses, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function testsPage(ctx: PageContext): string {
  const coverage = ctx.data.recipes.all.get(44) as SpaceCoverage;
  const specs = ctx.data.specs.filter((s) => s.specKind !== "example");
  let exercised = 0,
    unexercised = 0,
    unkeyed = 0;
  const rows = specs
    .map((s) => {
      const rules = ctx.data.recipes.specs.get(s.id)?.get(34) as RuleCoverage;
      const { totals } = rules;
      exercised += totals.exercised;
      unexercised += totals.unexercised;
      unkeyed += totals.unkeyedRules;
      const space = coverage.spaces.find((p) => p.spec === s.id);
      const missing =
        space?.slots.reduce(
          (n, slot) =>
            n + (slot.enumerable ? slot.values.filter((v) => v.examples.length === 0).length : 0),
          0,
        ) ?? 0;
      const binding = s.deliveryFacts.includes("has-verifier") ? "present" : "none",
        enabled = s.verifiers.filter((v) => v.enabled).length;
      const spaceDetails = space?.slots
        .map(
          (slot) =>
            `${escape(slot.name)}: ${
              slot.enumerable
                ? slot.values
                    .filter((v) => v.examples.length === 0)
                    .map((v) => code(String(v.value)))
                    .join(", ") || "no uncovered values"
                : "not enumerable"
            }${slot.unbound.length ? `; unbound ${slot.unbound.map((id) => link(ctx, id)).join(", ")}` : ""}`,
        )
        .join("; ");
      const target = link(ctx, s.id, s.title ?? s.id, codeSpans(s.title ?? s.id)).replace(
        /href="([^"]+)"/u,
        'href="$1#verification"',
      );
      return `<li class="spec-row" data-row data-binding="${binding}" data-rules="${totals.keyedRules === 0 ? "none" : totals.unexercised > 0 ? "unexercised" : "exercised"}" data-values="${space === undefined ? "none" : missing > 0 ? "uncovered" : "covered"}" data-pack="${escape(s.packs.join(" "))}">${target} · ${code(s.id)} · verifier binding ${binding}: ${String(s.verifiers.length)} verifiers, ${String(enabled)} enabled · ${String(totals.exercised)} of ${String(totals.keyedRules)} keyed rules exercised · ${String(totals.unkeyedRules)} unkeyed rules${space ? ` · ${String(missing)} uncovered values` : ""}${s.verifiers.length ? `<ul>${s.verifiers.map((v) => `<li>${link(ctx, v.verifierId)} · ${v.enabled ? "enabled" : "not enabled"}${v.file ? ` · ${code(v.file + (v.line === undefined ? "" : `:${String(v.line)}`))}` : ""}</li>`).join("")}</ul>` : ""}${spaceDetails ? `<p>${spaceDetails}</p>` : ""}</li>`;
    })
    .join("");
  const filters = [
    {
      name: "binding",
      label: "Verifier binding",
      values: [
        ...new Set(
          specs.map((s) => (s.deliveryFacts.includes("has-verifier") ? "present" : "none")),
        ),
      ],
    },
    {
      name: "rules",
      label: "Keyed rules",
      values: [
        ...new Set(
          specs.map((s) => {
            const { totals } = ctx.data.recipes.specs.get(s.id)?.get(34) as RuleCoverage;
            return totals.keyedRules === 0
              ? "none"
              : totals.unexercised > 0
                ? "unexercised"
                : "exercised";
          }),
        ),
      ],
    },
    {
      name: "values",
      label: "Example-space values",
      values: [
        ...new Set(
          specs.map((s) => {
            const space = coverage.spaces.find((p) => p.spec === s.id);
            return space === undefined
              ? "none"
              : space.slots.some(
                    (slot) => slot.enumerable && slot.values.some((v) => v.examples.length === 0),
                  )
                ? "uncovered"
                : "covered";
          }),
        ),
      ],
    },
    { name: "pack", label: "Pack", values: ctx.data.packs.map((p) => p.context.id) },
  ];
  const present = specs.filter((s) => s.deliveryFacts.includes("has-verifier")).length;
  const withMissing = coverage.spaces.filter((space) =>
    space.slots.some((slot) => slot.enumerable && slot.values.some((v) => v.examples.length === 0)),
  ).length;
  return frame(
    ctx,
    "Tests",
    `<header class="page-head"><h1>Tests</h1><p>Verifier bindings, keyed rules from recipe 34 and example-space values from recipe 44.</p><p>${String(present)} Specs with a verifier binding and ${String(specs.length - present)} without. ${String(exercised)} keyed rules exercised and ${String(unexercised)} unexercised. ${String(unkeyed)} unkeyed rules. ${String(withMissing)} example spaces with an uncovered value.</p></header><sdp-filter><form hidden class="filter-bar">${filters.map((f) => `<label>${f.label}<select data-filter="${f.name}"><option value="any">Any</option>${f.values.map((v) => `<option value="${escape(v)}">${escape(v)}</option>`).join("")}</select></label>`).join("")}</form><output aria-live="polite">${String(specs.length)} of ${String(specs.length)} shown</output><ul class="spec-list">${rows}</ul></sdp-filter>`,
  );
}
