import { SPEC_READINESS } from "../../../model/descriptors.js";
import { badge, code, count, escape, findingList, link, present, rungLine } from "./html.js";
import type { PageContext } from "./html.js";
import { frame } from "./frame.js";
import { codeSpans } from "./text.js";

/**
 * Counts reader values and writes native Pack disclosures and filterable Spec rows.
 * @sdpAnchor impl:protocol.studio-index-page
 * @sdpSatisfies spec:consumers.spec-studio.index-page, spec:consumers.spec-studio.lenses.packs
 * @sdpReferences spec:consumers.spec-studio.navigation
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function indexPage(ctx: PageContext): string {
  const { specs, packs, findings } = ctx.data;
  const divergence = specs.filter(
    (s) =>
      SPEC_READINESS.indexOf(s.statedReadiness) >
      (s.derivedReadiness === undefined ? -1 : SPEC_READINESS.indexOf(s.derivedReadiness)),
  ).length;
  const summary = [
    `${count(specs.length, "Spec")} and ${count(packs.length, "Pack", "Packs", false)} in this corpus.`,
    ...SPEC_READINESS.map(
      (rung) =>
        `${count(specs.filter((s) => s.statedReadiness === rung).length, "Spec")} stated ${rung}.`,
    ),
    `${count(divergence, "Spec")} stated above ${divergence === 1 ? "its" : "their"} floor.`,
    `${count(
      specs.reduce((n, s) => n + s.designColumns.openQuestions.length, 0),
      "open question",
    )} and ${count(
      specs.reduce((n, s) => n + s.designColumns.blockingQuestions, 0),
      "blocking question",
      "blocking questions",
      false,
    )}.`,
    `${count(specs.filter((s) => s.implementations.length > 0).length, "Spec")} with an implementation binding and ${count(specs.filter((s) => s.deliveryFacts.includes("has-verifier")).length, "Spec", "Specs", false)} with a verifier binding.`,
    `${count(findings.filter((f) => f.severity === "error").length, "error")} and ${count(findings.filter((f) => f.severity === "warning").length, "warning", "warnings", false)}.`,
  ];
  const rowValues = specs.map((spec) => ({
    kind: spec.specKind,
    altitude: spec.altitude,
    stated: spec.statedReadiness,
    floor: spec.derivedReadiness ?? "none",
    implementation: present(spec.implementations.length > 0),
    verifier: present(spec.deliveryFacts.includes("has-verifier")),
    pack: spec.packs.join(" "),
  }));
  const labels = {
    kind: "Kind",
    altitude: "Altitude",
    stated: "Stated rung",
    floor: "Floor reached",
    implementation: "Implementation binding",
    verifier: "Verifier binding",
    pack: "Pack",
  };
  const filters = Object.entries(labels)
    .map(([name, label]) => {
      const values = [
        ...new Set(
          rowValues.flatMap((row) =>
            (row[name as keyof typeof row] || "").split(" ").filter(Boolean),
          ),
        ),
      ].sort((a, b) =>
        name === "stated" || name === "floor"
          ? [...SPEC_READINESS, "none"].indexOf(a) - [...SPEC_READINESS, "none"].indexOf(b)
          : a < b
            ? -1
            : a > b
              ? 1
              : 0,
      );
      return `<label>${label}<select data-filter="${name}"><option value="any">Any</option>${values.map((v) => `<option value="${escape(v)}">${escape(v)}</option>`).join("")}</select></label>`;
    })
    .join("");
  const specRows = specs
    .map(
      (spec, i) =>
        `<li class="spec-row" data-row ${Object.entries(rowValues[i] ?? {})
          .map(([name, value]) => `data-${name}="${escape(value)}"`)
          .join(
            " ",
          )}>${link(ctx, spec.id, spec.title ?? spec.id, codeSpans(spec.title ?? spec.id))} · ${code(spec.id)} · ${rungLine(spec.statedReadiness, spec.derivedReadiness)} · ${escape(spec.specKind)} · ${escape(spec.altitude)} · implementation binding ${present(spec.implementations.length > 0)} · verifier binding ${present(spec.deliveryFacts.includes("has-verifier"))} · ${String(spec.designColumns.openQuestions.length)} open, ${String(spec.designColumns.blockingQuestions)} blocking questions · Packs ${spec.packs.length === 0 ? "none" : spec.packs.map((id) => link(ctx, id)).join(", ")}</li>`,
    )
    .join("");
  const packList = packs
    .map(
      ({ context: pack }) =>
        `<details class="section"><summary>${codeSpans(pack.title ?? pack.id)} · ${code(pack.id)} · ${count(pack.members.length, "member")}</summary><div class="section-body"><p>${link(ctx, pack.id, "Read the Pack page")}</p><ol>${pack.members.map((m) => `<li>${link(ctx, m.id, m.title ?? m.id, codeSpans(m.title ?? m.id))} · ${m.resolved ? `${badge(m.statedReadiness)} · floor ${escape(m.derivedReadiness ?? "none")}` : "unresolved member"}</li>`).join("")}</ol></div></details>`,
    )
    .join("");
  return frame(
    ctx,
    "Spec Studio",
    `<header class="page-head"><h1>Packs</h1><p>Specs grouped by the Packs that hold them, from the reader.</p><ul class="summary">${summary.map((s) => `<li>${s}</li>`).join("")}</ul></header><h2>Start here</h2><ul class="plain-list task-routes"><li><a href="#packs">Read a Pack's design</a></li><li><a href="search.html">Find a Spec, entry or file by a word</a></li><li><a href="#specs">Narrow the Specs</a></li><li><a href="#findings">Read the findings</a></li><li><a href="queue.html">See what the owner can state first</a></li><li><a href="architecture.html">See the components by context and layer</a></li>${ctx.data.inputs.base === undefined ? "" : '<li><a href="diff.html">See what changed since the base</a></li>'}</ul><section id="packs"><h2>Packs</h2>${packList || "<p>No Packs.</p>"}</section><section id="specs"><h2>Specs</h2><sdp-filter><form hidden class="filter-bar">${filters}</form><output aria-live="polite">${String(specs.length)} of ${String(specs.length)} shown</output><ul class="spec-list">${specRows}</ul></sdp-filter></section><section id="findings"><h2>Findings</h2>${findingList(ctx, findings)}</section>`,
  );
}
