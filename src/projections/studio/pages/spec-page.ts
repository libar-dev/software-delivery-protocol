import { scenarioTemplate } from "./spec-verification.js";
import {
  verificationPanel,
  evidencePanel,
  ruleCoverage,
  exampleCards,
  constraintTarget,
  entryCitations,
  composeSlot,
} from "./spec-verification.js";
import { designView, runtimePanel, impactView } from "./spec-structure.js";
import { specChangeNote } from "./diff-page.js";
import { SPEC_READINESS } from "../../../model/descriptors.js";
import { SPEC_SECTION_NAMES } from "../../../model/sections.js";
import type { SpecContext, RelationEnd } from "../../../reader/reader.js";
import {
  code,
  sourceCode,
  copy,
  count,
  escape,
  findingList,
  link,
  list,
  location,
  present,
  questionFields,
  rungLine,
  unitList,
} from "./html.js";
import type { PageContext } from "./html.js";
import { frame } from "./frame.js";
import { holds } from "./pack-page.js";
import { codeSpans, prose, text, valueHtml } from "./text.js";

const entryLine = (spec: SpecContext, entry: string): number | undefined =>
  spec.entryLocations.find((loc) => loc.entry === entry)?.line;
const lineLabel = (file: string, line?: number): string =>
  line === undefined
    ? ""
    : ` <span class="entry-line">line ${String(line)} · ${sourceCode(file, line)}${copy(location(file, line))}</span>`;

function entry(
  ctx: PageContext,
  spec: SpecContext,
  key: string,
  value: unknown,
  address?: string,
  located?: string,
): string {
  return `<div class="entry"${address === undefined ? "" : ` id="${escape(address)}"`}><dt>${code(key)}${lineLabel(spec.file, entryLine(spec, located ?? address ?? ""))}${address === undefined ? "" : copy(`${spec.id}#${address}`)}</dt><dd>${valueHtml(ctx, value)}${address === undefined ? "" : `${composeSlot(`${spec.id}#${address}`, "change-entry", typeof value === "string" ? value : undefined)}${address.startsWith("rule.") ? ruleCoverage(ctx, spec, address.slice(5)) : ""}${entryCitations(ctx, spec, address)}`}</dd></div>`;
}

function steps(value: unknown): string {
  if (typeof value !== "object" || value === null) return "";
  const record = value as Record<string, unknown>;
  return `<pre>${escape(
    ["given", "when", "then"]
      .flatMap((phase) => {
        const rows = record[phase];
        return Array.isArray(rows)
          ? rows.map(
              (step: unknown) =>
                `${phase.charAt(0).toUpperCase()}${phase.slice(1)} ${typeof step === "string" ? step : JSON.stringify(step)}`,
            )
          : [];
      })
      .join("\n"),
  )}</pre>`;
}

function sections(ctx: PageContext, spec: SpecContext): string {
  return SPEC_SECTION_NAMES.flatMap((name) => {
    const section = spec.sections?.[name];
    if (section === undefined) return [];
    let body = "";
    let title = name === "ui" ? "UI" : name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "constraints") {
      body = (spec.sections?.constraints ?? [])
        .map((row) => constraintTarget(ctx, spec, row))
        .join("");
    } else {
      const record = section as Record<string, unknown>;
      body = typeof record.description === "string" ? prose(ctx, record.description) : "";
      if (name === "behavior") {
        title =
          spec.specKind === "rule"
            ? "Rule"
            : spec.specKind === "workflow"
              ? "Workflow"
              : spec.specKind === "contract"
                ? "Contract"
                : "Behavior";
        const behavior = spec.sections?.behavior;
        const rows = [
          ...(behavior?.rules ?? []).map((value, i) => ({
            value,
            entry: `rule[${String(i)}]`,
            path: `rules[${String(i)}]`,
            label: "rule",
          })),
          ...(behavior?.flows ?? []).map((value, i) => ({
            value,
            entry: `flow[${String(i)}]`,
            path: `flows[${String(i)}]`,
            label: "flow",
          })),
        ].sort(
          (a, b) => (entryLine(spec, a.entry) ?? Infinity) - (entryLine(spec, b.entry) ?? Infinity),
        );
        body += `<dl>${rows
          .map((row) => {
            const key = Object.keys(behavior?.ruleKeys ?? {}).find(
              (key) => behavior?.ruleKeys?.[key] === row.path,
            );
            return entry(
              ctx,
              spec,
              key === undefined ? row.label : `rule.${key}`,
              row.value,
              key === undefined ? undefined : `rule.${key}`,
              row.entry,
            );
          })
          .join("")}</dl>`;
        const coverage = ctx.data.recipes.specs.get(spec.id)?.get(34) as
          | { totals: { unkeyedRules: number } }
          | undefined;
        if (coverage)
          body += `<p>${String(coverage.totals.unkeyedRules)} unkeyed ${coverage.totals.unkeyedRules === 1 ? "rule" : "rules"}.</p>`;
        body += exampleCards(ctx, spec);
        if (behavior?.examples?.length)
          body += `<h3>Examples</h3>${behavior.examples.map((example) => (typeof example === "string" ? prose(ctx, example) : steps(example))).join("")}`;
        if (behavior?.exampleSpace !== undefined)
          body += `<h3>Example space</h3>${steps(behavior.exampleSpace)}`;
      } else if (name === "intent") {
        body += `<dl>${Object.entries(record)
          .filter(([key]) => key !== "description" && key !== "openQuestions")
          .map(([key, value]) => entry(ctx, spec, key, value))
          .join("")}</dl>`;
        const questions = spec.designColumns.openQuestions;
        if (questions.length)
          body += `<h3>Open questions</h3><ul class="questions">${questions.map((q) => `<li${q.key === undefined ? "" : ` id="question.${escape(q.key)}"`}>${q.blocking ? "blocking" : "non-blocking"}${q.key === undefined ? "" : ` · ${code(`question.${q.key}`)}${copy(`${spec.id}#question.${q.key}`)}`}${lineLabel(spec.file, q.line)} · ${text(ctx, q.question)}${questionFields(ctx, q, (v) => text(ctx, v))}${composeSlot(q.key === undefined ? spec.id : `${spec.id}#question.${q.key}`, "resolve-question")}${composeSlot(q.key === undefined ? spec.id : `${spec.id}#question.${q.key}`, "promote-question")}${q.key === undefined ? "" : entryCitations(ctx, spec, `question.${q.key}`)}</li>`).join("")}</ul>`;
      } else if (name === "model") {
        const model = spec.sections?.model;
        body += `<dl>${Object.entries(model?.terms ?? {})
          .map(([term, value], index) => {
            const key = Object.keys(model?.termKeys ?? {}).find(
              (k) => model?.termKeys?.[k] === term,
            );
            const address = key === undefined ? undefined : `term.${key}`;
            return entry(
              ctx,
              spec,
              key === undefined ? term : `${term} · term.${key}`,
              value,
              address,
              `term[${String(index)}]`,
            );
          })
          .join("")}</dl>`;
      } else {
        if (name === "verification" && typeof record.mode === "string")
          title += ` · ${record.mode}`;
        body += `<dl>${Object.entries(record)
          .filter(([key]) => key !== "description")
          .map(([key, value]) => {
            const address =
              (name === "design" || name === "ui") && /^[a-z][A-Za-z0-9]*$/u.test(key)
                ? `${name}.${key}`
                : undefined;
            return entry(ctx, spec, key, value, address);
          })
          .join("")}</dl>`;
      }
    }
    return [
      `<details class="section" id="section.${name}" open><summary>${escape(title)}</summary><div class="section-body">${body}</div></details>`,
    ];
  }).join("");
}

function relations(ctx: PageContext, spec: SpecContext): string {
  const row = (r: RelationEnd, direction: string): string =>
    `<tr><td>${escape(r.type)} · ${direction}</td><td>${link(ctx, r.otherId, r.otherTitle ?? r.otherId, codeSpans(r.otherTitle ?? r.otherId))}<br>${code(r.otherId)} · ${r.resolved ? "resolves" : "unresolved"}</td><td>${escape(r.claim)}</td><td>${r.reason === undefined ? "None" : text(ctx, r.reason)}</td><td>${r.exercises?.length ? r.exercises.map(code).join(", ") : "None"}</td></tr>`;
  return `<h2 id="relations">Relations</h2>${spec.relationsOut.length + spec.relationsIn.length === 0 ? "<p>None.</p>" : `<div class="table-scroll" role="region" aria-label="Relations" tabindex="0"><table><thead><tr><th>Relation and direction</th><th>Other end</th><th>Claim</th><th>Reason</th><th>Exercised keys</th></tr></thead><tbody>${spec.relationsOut.map((r) => row(r, "outgoing")).join("")}${spec.relationsIn.map((r) => row(r, "incoming")).join("")}</tbody></table></div>`}`;
}

function bindings(ctx: PageContext, spec: SpecContext): string {
  const verifiers = list(
    spec.verifiers.map(
      (v) =>
        `${link(ctx, v.verifierId)}${v.label === undefined ? "" : ` · ${escape(v.label)}`} · ${escape(v.claim)} · ${sourceCode(v.file, v.line)}${v.file === undefined ? "" : copy(location(v.file, v.line))}${v.via === "example" ? ` · example ${v.enabled ? "enabled" : "not enabled"}` : " · test anchor"}`,
    ),
    "units",
  );
  const oracle = spec.oracle;
  return `<h2 id="bindings">Bindings</h2><h3>Implementation binding: ${present(spec.implementations.length > 0)}</h3>${spec.implementations.length ? unitList(spec.implementations, ctx) : ""}<h3>Design reference: ${present(spec.references.length > 0)}</h3>${spec.references.length ? unitList(spec.references, ctx) : ""}<h3 id="verification">Verifier binding: ${present(spec.deliveryFacts.includes("has-verifier"))}</h3>${spec.verifiers.length ? verifiers : ""}<h3>Expected-outcome oracle: ${present(oracle !== undefined)}</h3>${oracle === undefined ? "" : list([`${code(oracle.anchorId)}${oracle.label === undefined ? "" : ` · ${escape(oracle.label)}`} · ${sourceCode(oracle.file, oracle.line)}${oracle.file === undefined ? "" : copy(location(oracle.file, oracle.line))}`], "units")}<p>Runtime observation: not tracked.</p><p>Run results: not recorded in the graph.</p>`;
}

/**
 * Writes the Spec context in section order, with address ids and both relation directions.
 * @sdpAnchor impl:protocol.studio-spec-page
 * @sdpSatisfies spec:consumers.spec-studio.spec-page.core, spec:consumers.spec-studio.spec-page
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function specPage(ctx: PageContext, spec: SpecContext): string {
  const d = spec.designColumns;
  const findings = ctx.data.findings.filter((f) => f.subjectId === spec.id);
  const dishonest =
    SPEC_READINESS.indexOf(spec.statedReadiness) >
    (spec.derivedReadiness === undefined ? -1 : SPEC_READINESS.indexOf(spec.derivedReadiness));
  const firstUnmet = spec.floorFailures[0];
  const divergence = dishonest
    ? `<p class="divergence">stated ${escape(spec.statedReadiness)} exceeds the floor ${escape(spec.derivedReadiness ?? "below idea")}.${firstUnmet === undefined ? "" : ` First unmet clause: ${code(firstUnmet.clauseId)} · ${escape(firstUnmet.description)}`}</p>`
    : "";
  const header = `<header class="page-head"><h1>${codeSpans(spec.title ?? spec.id)}</h1><div class="ids"><span>${code(spec.id)}${copy(spec.id)}</span><span>${escape(spec.kindDisplayLabel ?? spec.specKind)} · ${escape(spec.altitude)}</span><span class="rungs">${rungLine(spec.statedReadiness, spec.derivedReadiness)}</span></div>${specChangeNote(ctx, spec.id)}${divergence}${holds(ctx, spec.statedNextRung, spec.statedNextRungFailures)}<p>Packs: ${spec.packs.length ? spec.packs.map((id) => link(ctx, id)).join(", ") : "none"}</p><p>Design: ${count(d.entries, "design entry", "design entries", false)} · ${count(d.declarations, "pinned declaration", "pinned declarations", false)} · ${count(d.decisions.length, "decision", "decisions", false)}</p><p><a href="#findings">Findings: ${count(findings.filter((f) => f.severity === "error").length, "error", "errors", false)}, ${count(findings.filter((f) => f.severity === "warning").length, "warning", "warnings", false)}</a></p><p>${code(spec.file)}${copy(spec.file)}</p></header>`;
  const summary = `<p class="prose">${count(d.openQuestions.length, "open question")} and ${count(d.blockingQuestions, "blocking question", "blocking questions", false)}; implementation binding ${present(spec.implementations.length > 0)}, verifier binding ${present(spec.deliveryFacts.includes("has-verifier"))}, and expected-outcome oracle ${present(spec.oracle !== undefined)}.</p>`;
  const panel = (id: string, title: string, body: string): string =>
    `<details class="section" id="panel.${id}" open><summary>${title}</summary><div class="section-body">${body}</div></details>`;
  const panels =
    panel("verification", "Verification", verificationPanel(ctx, spec)) +
    panel("design-view", "Design view", designView(ctx, spec)) +
    panel("runtime", "Runtime", runtimePanel(ctx, spec)) +
    panel("evidence", "Evidence", evidencePanel(spec)) +
    panel("impact", "Impact", impactView(ctx, spec));
  return frame(
    ctx,
    spec.title ?? spec.id,
    `${header}${summary}${spec.specKind === "example" ? `${scenarioTemplate(spec, "edit")}${composeSlot(spec.id, "edit-example")}` : ""}${spec.narrative === undefined ? "" : `<section id="narrative">${prose(ctx, spec.narrative)}</section>`}<sdp-expander>${sections(ctx, spec)}${panels}${relations(ctx, spec)}${bindings(ctx, spec)}<h2 id="findings">Findings</h2><sdp-validation-findings filter="${escape(spec.id)}">${findingList(ctx, findings)}</sdp-validation-findings></sdp-expander>`,
    spec.id,
  );
}
