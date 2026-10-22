import type { GraphSchema } from "../../../graph/schema.js";
import { code } from "./html.js";
import type { PageContext } from "./html.js";
import type { Diff } from "./register-answers.js";
import { text } from "./text.js";

const address = (value: unknown): string => (typeof value === "string" ? code(value) : "none");

export function keyedRows(
  ctx: PageContext,
  spec: NonNullable<Diff["specs"]>["changed"][number],
): string {
  const entries = (ctx.data.search.records.find((r) => r.id === spec.id)?.entries ?? [])
    .filter((e) => e.section === "behavior" && /^(rules|flows)\[\d+\]$/u.test(e.entry ?? ""))
    .sort((a, b) => (a.line ?? Infinity) - (b.line ?? Infinity));
  const parts = spec.parts.filter((p) => p.change === "keyed");
  const rows = new Map(
    parts.flatMap((p) => {
      const entry = typeof p.to === "string" ? entries.find((e) => e.address === p.to) : undefined;
      return entry === undefined ? [] : [[entry, p] as const];
    }),
  );
  // A removed key has no head address. Its unchanged wording is carried by the base entry.
  const base = ctx.data.inputs.base?.graph as GraphSchema | undefined;
  const node = base?.nodes.find((n) => n.id === spec.id);
  const behavior = node?.nodeType === "Primitive" ? node.sections?.behavior : undefined;
  for (const list of ["rules", "flows"] as const) {
    for (const [index, value] of (behavior?.[list] ?? []).entries()) {
      const path = `${list}[${String(index)}]`;
      const marker =
        behavior?.ruleKeys === undefined ? /^\[#([a-z][A-Za-z0-9]*)\] (.*)$/su.exec(value) : null;
      const key =
        Object.keys(behavior?.ruleKeys ?? {}).find((key) => behavior?.ruleKeys?.[key] === path) ??
        marker?.[1];
      if (key === undefined) continue;
      const part = parts.find((p) => p.to === null && p.from === `${spec.id}#rule.${key}`);
      if (part === undefined) continue;
      const candidates = entries.filter(
        (e) => e.address === null && e.text === (marker?.[2] ?? value) && !rows.has(e),
      );
      const entry = candidates.find((e) => e.entry?.startsWith(`${list}[`)) ?? candidates[0];
      if (entry !== undefined) rows.set(entry, part);
    }
  }
  return entries
    .map((entry) => {
      const part = rows.get(entry);
      return part === undefined
        ? ""
        : `<div class="entry"><p>${code(part.part)} · keyed · ${text(ctx, entry.text)} · Base: ${address(part.from)} · Now: ${address(part.to)}</p></div>`;
    })
    .join("");
}
