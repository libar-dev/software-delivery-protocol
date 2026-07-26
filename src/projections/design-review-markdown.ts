import { escapeRenderedField } from "./owned-prose.js";

/** `spec:orders.create-order` → `spec/orders.create-order.md` — bijective by the id grammar (one `:`). */
export function pagePathOf(id: string): string {
  const colonIndex = id.indexOf(":");

  return `${id.slice(0, colonIndex)}/${id.slice(colonIndex + 1)}.md`;
}

function directoryOf(pagePath: string): readonly string[] {
  return pagePath.split("/").slice(0, -1);
}

/** Relative link between two view pages. */
export function pageHref(fromPage: string, toPage: string): string {
  const fromDirectory = directoryOf(fromPage);
  const toParts = toPage.split("/");
  let shared = 0;

  while (shared < fromDirectory.length && fromDirectory[shared] === toParts[shared]) {
    shared += 1;
  }

  return `${"../".repeat(fromDirectory.length - shared)}${toParts.slice(shared).join("/")}`;
}

/** Relative link from a view page to a repo file recorded in the graph (root-relative, JS-C3). */
export function sourceHref(fromPage: string, file: string): string {
  // Up out of the page's directories, then out of `design-review/` and `generated/`.
  return `${"../".repeat(directoryOf(fromPage).length + 2)}${file}`;
}

/** One-line table cell: field escaping plus collapsed newlines keeps content inside the table. */
export function tableCell(text: string): string {
  return escapeRenderedField(text).replaceAll(/\s+/gu, " ").trim();
}

export function heading(title: string | undefined, id: string): string {
  return `# ${escapeRenderedField(title ?? id)}`;
}

export const PAGE_FOOTER =
  "*Generated from the one graph by `sdp view` — read-only; regenerate to update.*";

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

export function asArray(value: unknown): readonly unknown[] | undefined {
  return Array.isArray(value) ? (value as readonly unknown[]) : undefined;
}

export function asText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

export function textEntries(value: unknown): readonly string[] {
  return (asArray(value) ?? []).flatMap((entry) => {
    const text = asText(entry);

    return text === undefined ? [] : [text];
  });
}

export function renderInlineCode(value: string): string {
  const runs = value.match(/`+/gu) ?? [];
  const longest = runs.reduce((length, run) => Math.max(length, run.length), 0);
  const delimiter = "`".repeat(longest + 1);
  // CommonMark strips one boundary space pair, so pad to keep authored boundary spaces; an all-spaces value cannot round-trip — accepted display-only approximation.
  const padding =
    value.startsWith("`") || value.endsWith("`") || value.startsWith(" ") || value.endsWith(" ")
      ? " "
      : "";

  return `${delimiter}${padding}${value}${padding}${delimiter}`;
}

/** Inline code inside a GFM table row: a pipe must be \|-escaped even inside a code span, and whitespace collapses so a stray newline cannot split the row. */
export function renderTableInlineCode(value: string): string {
  return renderInlineCode(value.replaceAll("|", "\\|").replaceAll(/\s+/gu, " ").trim());
}

function renderDynamicValue(value: unknown): unknown {
  const record = asRecord(value);

  if (record !== undefined) {
    return renderDynamicRecord(record);
  }

  const entries = asArray(value);

  if (entries !== undefined) {
    return entries.map((entry) => renderDynamicValue(entry));
  }

  return value;
}

export function renderDynamicRecord(content: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.keys(content)
      .sort()
      .map((key) => [key, renderDynamicValue(content[key])]),
  );
}
