import { mentionTokens } from "../../../validate/validators.js";
import { escape, link } from "./html.js";
import type { PageContext } from "./html.js";

/**
 * Escapes text first and links only graph-resolving tokens read by the mention validator.
 * @sdpAnchor impl:protocol.studio-text
 * @sdpSatisfies spec:consumers.spec-studio.shell
 * @sdpComponent component:protocol.projections
 * @sdpRole codec
 */
export function text(ctx: PageContext, value: string): string {
  const mentions = (part: string): string => {
    // Keep source offsets while decoding the punctuation escapes the validator reads.
    let decoded = "";
    const starts: number[] = [];
    const ends: number[] = [];
    for (let i = 0; i < part.length; i++) {
      starts.push(i);
      if (part[i] === "\\" && /[!-/:-@[-`{-~]/u.test(part[i + 1] ?? "")) i++;
      decoded += part[i] ?? "";
      ends.push(i + 1);
    }
    let at = 0;
    let decodedAt = 0;
    let out = "";
    for (const token of mentionTokens(part)) {
      const decodedStart = decoded.indexOf(token, decodedAt);
      if (decodedStart < 0) continue;
      const start = starts[decodedStart] ?? 0;
      const end = ends[decodedStart + token.length - 1] ?? part.length;
      out += escape(part.slice(at, start)) + link(ctx, token, part.slice(start, end));
      at = end;
      decodedAt = decodedStart + token.length;
    }
    return out + escape(part.slice(at));
  };
  const runs = [...value.matchAll(/`+/gu)];
  let at = 0;
  let out = "";
  for (let i = 0; i < runs.length; i++) {
    const open = runs[i];
    if (!open) continue;
    const closing = runs.findIndex((run, j) => j > i && run[0].length === open[0].length);
    if (closing < 0) continue;
    const close = runs[closing];
    if (!close) continue;
    out += mentions(value.slice(at, open.index));
    out += `<code>${mentions(value.slice(open.index + open[0].length, close.index))}</code>`;
    at = close.index + close[0].length;
    i = closing;
  }
  return out + mentions(value.slice(at));
}

export function prose(ctx: PageContext, value?: string): string {
  return value === undefined
    ? ""
    : value
        .split(/\n\s*\n/u)
        .map((p) => `<p class="prose">${text(ctx, p)}</p>`)
        .join("");
}

export function valueHtml(ctx: PageContext, value: unknown): string {
  if (typeof value === "string") return text(ctx, value);
  if (Array.isArray(value))
    return `<ul>${value.map((item) => `<li>${valueHtml(ctx, item)}</li>`).join("")}</ul>`;
  if (value !== null && typeof value === "object")
    return `<dl>${Object.entries(value)
      .map(([key, item]) => `<dt>${escape(key)}</dt><dd>${valueHtml(ctx, item)}</dd>`)
      .join("")}</dl>`;
  return escape(value);
}
