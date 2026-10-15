export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/gu,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );
}

/**
 * Shares the delimiter walk between prose, titles and the browser's result headings.
 * @sdpAnchor impl:protocol.studio-code-spans
 * @sdpSatisfies spec:consumers.spec-studio.shell
 * @sdpComponent component:protocol.projections
 * @sdpRole codec
 */
export function mapCodeSpans(
  value: string,
  plain: (value: string) => string,
  span: (value: string) => string,
): string {
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
    out += plain(value.slice(at, open.index));
    out += span(value.slice(open.index + open[0].length, close.index));
    at = close.index + close[0].length;
    i = closing;
  }
  return out + plain(value.slice(at));
}

export const codeSpans = (value: string): string =>
  mapCodeSpans(value, escapeHtml, (v) => `<code>${escapeHtml(v)}</code>`);

export const plainTitle = (value: string): string =>
  mapCodeSpans(
    value,
    (v) => v,
    (v) => v,
  );
