import { posix } from "node:path";

import { decodeHtmlReferences, decodeMarkdownReferences } from "./character-references.js";

/**
 * The reader behind the relative-link gate (`test/markdown-links.test.ts`): it finds the link
 * targets in a Markdown document as cmark-gfm, the parser the forge renders these documents with,
 * would. It follows cmark-gfm's block rules where they decide what is code or raw HTML:
 * blockquotes, list items, fenced and indented code, HTML blocks, paragraphs with their lazy
 * continuation lines, headings, and GFM tables. Inside each paragraph, heading and table cell it
 * follows the inline rules for code spans, backslash escapes, raw HTML, inline links and images,
 * and reference definitions.
 *
 * Where the reader departs from cmark-gfm, it reads more, never less, so a dangling link cannot
 * pass unseen. It reads every `](` that has a valid destination, with or without an opening `[`.
 * It reads indented code, HTML blocks and inline HTML, comments included, for HTML `href` and
 * `src` values and Markdown link destinations. It reads footnote definitions as paragraphs. A
 * destination decodes character references as `character-references.ts` says.
 */

export interface LinkTarget {
  /** The line the destination starts on. */
  readonly line: number;
  readonly target: string;
}

/** Text read as one unit, with the line number of each of its lines. */
interface Scope {
  /** A paragraph may open with reference definitions; raw text has no code spans. */
  readonly kind: "paragraph" | "inline" | "raw";
  readonly lines: { readonly number: number; readonly text: string }[];
}

type Container =
  | { readonly kind: "quote" }
  | { readonly kind: "item"; readonly indent: number; hasChild: boolean };

type Leaf =
  | { readonly kind: "none" | "table" }
  | { readonly kind: "paragraph"; readonly scope: Scope; tableTried: boolean }
  | { readonly kind: "fence"; readonly marker: string; readonly length: number }
  | { readonly kind: "html"; readonly end: RegExp | "blank"; readonly scope: Scope }
  | { readonly kind: "indented"; readonly scope: Scope };

const none: Leaf = { kind: "none" };
const punctuation = /[!-/:-@[-`{-~]/u;
const blockTags =
  "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|" +
  "dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|" +
  "header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|" +
  "param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
const htmlBlockSix = new RegExp(`^</?(?:${blockTags})(?: |/?>|$)`, "iu");
const htmlAttribute = ` +[A-Za-z_:][\\w.:-]*(?: *= *(?:[^ "'=<>\`]+|'[^']*'|"[^"]*"))?`;
const htmlBlockSeven = new RegExp(
  `^(?:<[A-Za-z][A-Za-z0-9-]*(?:${htmlAttribute})* */?>|</[A-Za-z][A-Za-z0-9-]* *>) *$`,
  "u",
);

/** The line with each tab replaced by spaces up to the next multiple of four columns. */
function expandTabs(line: string): string {
  let expanded = "";
  for (const char of line) expanded += char === "\t" ? " ".repeat(4 - (expanded.length % 4)) : char;
  return expanded;
}

const indentOf = (text: string): number => /^ */u.exec(text)?.[0].length ?? 0;
const isBlank = (text: string): boolean => /^ *$/u.test(text);

/**
 * How an HTML block that `body` opens ends: on the first line matching a pattern, or before a
 * blank line. Undefined when `body` opens no HTML block; the last kind cannot interrupt a
 * paragraph.
 */
function htmlBlockEnd(body: string, afterParagraph: boolean): RegExp | "blank" | undefined {
  if (/^<(?:script|pre|style)(?:[ >]|$)/iu.test(body)) return /<\/(?:script|pre|style)>/iu;
  if (body.startsWith("<!--")) return /-->/u;
  if (body.startsWith("<?")) return /\?>/u;
  if (/^<![A-Z]/u.test(body)) return />/u;
  if (body.startsWith("<![CDATA[")) return /\]\]>/u;
  if (htmlBlockSix.test(body)) return "blank";
  if (!afterParagraph && htmlBlockSeven.test(body)) return "blank";
  return undefined;
}

/**
 * The cells of a GFM table row: split at each pipe that no backslash escapes, without the
 * optional leading and trailing pipe. Undefined for a row with no cell.
 */
function cellsOf(row: string): readonly string[] | undefined {
  const text = row.trim().replace(/^\|/u, "");
  if (text.trim() === "") return undefined;
  const cells = text.split(/(?<!\\)\|/u);
  if (cells.length > 1 && cells.at(-1)?.trim() === "") cells.pop();
  return cells;
}

/**
 * The document cut into the units cmark-gfm parses inline content from: paragraphs, headings and
 * table cells, plus HTML blocks and indented code, which the link reader reads raw. Fenced code is
 * left out. The block structure follows cmark-gfm line by line: open containers continue or
 * close, a paragraph takes lazy continuation lines, and new blocks open in its order.
 */
function scopesOf(markdown: string): readonly Scope[] {
  const scopes: Scope[] = [];
  const containers: Container[] = [];
  let leaf: Leaf = none;

  const startScope = (kind: Scope["kind"], number: number, text: string): Scope => {
    const scope: Scope = { kind, lines: [{ number, text }] };
    scopes.push(scope);
    return scope;
  };

  const readLine = (line: string, number: number): void => {
    let rest = line;
    let matched = 0;
    for (const container of containers) {
      if (container.kind === "quote") {
        const marker = /^ {0,3}> ?/u.exec(rest);
        if (marker === null) break;
        rest = rest.slice(marker[0].length);
      } else if (indentOf(rest) >= container.indent) {
        rest = rest.slice(container.indent);
      } else if (isBlank(rest) && container.hasChild) {
        rest = "";
      } else {
        break;
      }
      matched += 1;
    }
    const containersMatched = matched === containers.length;

    if (containersMatched && leaf.kind === "fence") {
      const close = /^ {0,3}(`{3,}|~{3,}) *$/u.exec(rest)?.[1];
      if (close?.startsWith(leaf.marker) && close.length >= leaf.length) leaf = none;
      return;
    }
    if (containersMatched && leaf.kind === "indented" && (isBlank(rest) || indentOf(rest) >= 4)) {
      leaf.scope.lines.push({ number, text: rest.slice(4) });
      return;
    }
    if (containersMatched && leaf.kind === "html" && !(leaf.end === "blank" && isBlank(rest))) {
      leaf.scope.lines.push({ number, text: rest });
      if (leaf.end !== "blank" && leaf.end.test(rest)) leaf = none;
      return;
    }

    // New blocks open under the last matched container, which then holds a child; the blocks
    // the line did not match close.
    const openBlock = (): void => {
      containers.length = matched;
      leaf = none;
      const parent = containers.at(-1);
      if (parent?.kind === "item") parent.hasChild = true;
    };
    let afterParagraph = containersMatched && leaf.kind === "paragraph" && !isBlank(rest);
    let maybeLazy = leaf.kind === "paragraph";
    for (;;) {
      const indent = indentOf(rest);
      const body = rest.slice(indent);
      if (indent >= 4) {
        if (maybeLazy || isBlank(rest)) break;
        openBlock();
        leaf = { kind: "indented", scope: startScope("raw", number, rest.slice(4)) };
        return;
      }
      if (body.startsWith(">")) {
        openBlock();
        containers.push({ kind: "quote" });
        matched = containers.length;
        rest = body.slice(body.startsWith("> ") ? 2 : 1);
        afterParagraph = false;
        maybeLazy = false;
        continue;
      }
      if (/^#{1,6}(?: |$)/u.test(body)) {
        openBlock();
        startScope("inline", number, body);
        return;
      }
      const fence = /^(`{3,}|~{3,})(.*)$/u.exec(body);
      if (fence?.[1] !== undefined && !(fence[1].startsWith("`") && fence[2]?.includes("`"))) {
        openBlock();
        leaf = { kind: "fence", marker: fence[1].charAt(0), length: fence[1].length };
        return;
      }
      const htmlEnd = htmlBlockEnd(body, afterParagraph);
      if (htmlEnd !== undefined) {
        openBlock();
        const scope = startScope("raw", number, rest);
        if (htmlEnd === "blank" || !htmlEnd.test(body))
          leaf = { kind: "html", end: htmlEnd, scope };
        return;
      }
      if (afterParagraph && /^(?:=+|-+) *$/u.test(body)) {
        leaf = none;
        return;
      }
      if (/^(?:(?:\* *){3,}|(?:- *){3,}|(?:_ *){3,})$/u.test(body)) {
        openBlock();
        return;
      }
      const item = /^(?:[-+*]|(\d{1,9})[.)])(?= |$)/u.exec(body);
      const afterMarker = item === null ? "" : body.slice(item[0].length);
      if (
        item !== null &&
        !(
          afterParagraph &&
          (isBlank(afterMarker) || (item[1] !== undefined && Number(item[1]) !== 1))
        )
      ) {
        openBlock();
        const spaces = indentOf(afterMarker);
        const padding =
          isBlank(afterMarker) || spaces >= 5 ? item[0].length + 1 : item[0].length + spaces;
        containers.push({ kind: "item", indent: indent + padding, hasChild: false });
        matched = containers.length;
        rest = rest.slice(Math.min(rest.length, indent + padding));
        afterParagraph = false;
        maybeLazy = false;
        continue;
      }
      if (afterParagraph && leaf.kind === "paragraph" && !leaf.tableTried) {
        const delimiter = cellsOf(body);
        if (delimiter?.every((cell) => /^ *:?-+:? *$/u.test(cell)) === true) {
          const header = leaf.scope.lines.at(-1);
          const headerCells = header === undefined ? undefined : cellsOf(header.text);
          if (header !== undefined && headerCells?.length === delimiter.length) {
            leaf.scope.lines.pop();
            for (const cell of headerCells) startScope("inline", header.number, cell);
            leaf = { kind: "table" };
            return;
          }
          leaf.tableTried = true;
        }
      }
      break;
    }

    // No leaf block took the rest of the line. With containers unmatched and none opened, it is a
    // lazy continuation line of the open paragraph; otherwise the unmatched containers close and
    // it is text for the open paragraph or table, or the first line of a new paragraph.
    if (matched < containers.length && leaf.kind === "paragraph" && !isBlank(rest)) {
      leaf.scope.lines.push({ number, text: rest.slice(indentOf(rest)) });
      return;
    }
    if (containers.length > matched) {
      containers.length = matched;
      leaf = none;
    }
    if (isBlank(rest)) {
      leaf = none;
    } else if (leaf.kind === "paragraph") {
      leaf.scope.lines.push({ number, text: rest.slice(indentOf(rest)) });
    } else if (leaf.kind === "table") {
      for (const cell of cellsOf(rest) ?? []) startScope("inline", number, cell);
    } else {
      const parent = containers.at(-1);
      if (parent?.kind === "item") parent.hasChild = true;
      const scope = startScope("paragraph", number, rest.slice(indentOf(rest)));
      leaf = { kind: "paragraph", scope, tableTried: false };
    }
  };

  markdown.split(/\r?\n/u).forEach((line, index) => {
    readLine(expandTabs(line), index + 1);
  });
  return scopes;
}

interface Found {
  readonly offset: number;
  readonly target: string;
}

/**
 * A Markdown destination as cmark-gfm reads it: character references decoded first, then
 * backslash escapes.
 */
function markdownDestination(text: string): string {
  return decodeMarkdownReferences(text).replaceAll(/\\([!-/:-@[-`{-~])/gu, "$1");
}

/** The offset after the spaces, tabs and line breaks at `start`. */
function skipWhitespace(text: string, start: number): number {
  const space = /[ \t\n]*/uy;
  space.lastIndex = start;
  space.exec(text);
  return space.lastIndex;
}

/**
 * The link destination at `start`, with the offset after it: a `<…>` destination on one line, or
 * a run of non-space characters whose unescaped parentheses balance. A destination must be
 * followed by more text, as cmark-gfm requires.
 */
function destinationAt(
  text: string,
  start: number,
): (Found & { readonly end: number }) | undefined {
  if (text.charAt(start) === "<") {
    for (let at = start + 1; at < text.length; at += 1) {
      const char = text.charAt(at);
      if (char === ">") {
        const target = markdownDestination(text.slice(start + 1, at));
        return at + 1 < text.length ? { offset: start + 1, target, end: at + 1 } : undefined;
      }
      if (char === "\n" || char === "<") return undefined;
      if (char === "\\") at += 1;
    }
    return undefined;
  }
  let depth = 0;
  let at = start;
  for (; at < text.length; at += 1) {
    const char = text.charAt(at);
    const code = text.charCodeAt(at);
    if (char === "\\" && punctuation.test(text.charAt(at + 1))) {
      at += 1;
    } else if (char === "(") {
      depth += 1;
      if (depth > 32) return undefined;
    } else if (char === ")") {
      if (depth === 0) break;
      depth -= 1;
    } else if (code <= 0x20 || code === 0x7f) {
      if (at === start) return undefined;
      break;
    }
  }
  if (at >= text.length || depth !== 0) return undefined;
  return { offset: start, target: markdownDestination(text.slice(start, at)), end: at };
}

/** The offset after a link title in quotes or parentheses at `start`, if one is there. */
function titleEnd(text: string, start: number): number | undefined {
  const open = text.charAt(start);
  const close = open === "(" ? ")" : open;
  if (open !== '"' && open !== "'" && open !== "(") return undefined;
  for (let at = start + 1; at < text.length; at += 1) {
    const char = text.charAt(at);
    if (char === "\\" && punctuation.test(text.charAt(at + 1))) at += 1;
    else if (char === close) return at + 1;
    else if (open === "(" && char === "(") return undefined;
  }
  return undefined;
}

/** An inline link's `destination title)` from `start`, just after its `(`, if it is valid. */
function inlineLinkAt(text: string, start: number): { found: Found; end: number } | undefined {
  const destination = destinationAt(text, skipWhitespace(text, start));
  if (destination === undefined) return undefined;
  const titleStart = skipWhitespace(text, destination.end);
  const afterTitle =
    titleStart === destination.end ? titleStart : (titleEnd(text, titleStart) ?? titleStart);
  const close = skipWhitespace(text, afterTitle);
  return text.charAt(close) === ")" ? { found: destination, end: close + 1 } : undefined;
}

/** The offset after the spaces and tabs at `start` and an optional line break with its own. */
function skipLineSpace(text: string, start: number): number {
  const space = /[ \t]*(?:\n[ \t]*)?/uy;
  space.lastIndex = start;
  space.exec(text);
  return space.lastIndex;
}

/** The offset after the spaces and tabs at `start` and the line break or text end they reach. */
function lineEnd(text: string, start: number): number | undefined {
  const end = /[ \t]*(?:\n|$)/uy;
  end.lastIndex = start;
  return end.exec(text) === null ? undefined : end.lastIndex;
}

/** A link reference definition at `start`, the start of a paragraph or of a line after one. */
function definitionAt(text: string, start: number): { found: Found; end: number } | undefined {
  if (text.charAt(start) !== "[") return undefined;
  let at = start + 1;
  for (; at < text.length && text.charAt(at) !== "]"; at += 1) {
    if (text.charAt(at) === "[" || at - start > 1000) return undefined;
    if (text.charAt(at) === "\\" && punctuation.test(text.charAt(at + 1))) at += 1;
  }
  const label = text.slice(start + 1, at).trim();
  if (label === "" || label.startsWith("^") || text.charAt(at + 1) !== ":") return undefined;
  const destination = destinationAt(text, skipLineSpace(text, at + 2));
  if (destination === undefined) return undefined;
  const titleStart = skipLineSpace(text, destination.end);
  const afterTitle = titleStart === destination.end ? undefined : titleEnd(text, titleStart);
  const end =
    (afterTitle === undefined ? undefined : lineEnd(text, afterTitle)) ??
    lineEnd(text, destination.end);
  return end === undefined ? undefined : { found: destination, end };
}

/** The offset after inline raw HTML or an autolink at `start`, which holds a `<`. */
function inlineHtmlEnd(text: string, start: number): number | undefined {
  const rest = text.slice(start, start + 9);
  const closer = rest.startsWith("<!--")
    ? "-->"
    : rest.startsWith("<?")
      ? "?>"
      : rest.startsWith("<![CDATA[")
        ? "]]>"
        : undefined;
  if (closer !== undefined) {
    const end = text.indexOf(closer, start + 2);
    return end === -1 ? undefined : end + closer.length;
  }
  const tag = /<[/!]?[A-Za-z][^"'>]*(?:(?:"[^"]*"|'[^']*')[^"'>]*)*>/uy;
  tag.lastIndex = start;
  return tag.exec(text) === null ? undefined : tag.lastIndex;
}

/** The HTML `href` and `src` values and the inline link destinations between `start` and `end`. */
function rawTargets(text: string, start: number, end: number): readonly Found[] {
  const raw = text.slice(start, end);
  const found: Found[] = [];
  const attributes = /(?<![\w-])(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/dgiu;
  for (const match of raw.matchAll(attributes)) {
    const group = [1, 2, 3].find((index) => match[index] !== undefined) ?? 0;
    const offset = match.indices?.[group]?.[0];
    const target = match[group];
    if (offset !== undefined && target !== undefined) {
      found.push({ offset: start + offset, target: decodeHtmlReferences(target) });
    }
  }
  for (let at = raw.indexOf("]("); at !== -1; at = raw.indexOf("](", at + 2)) {
    const link = inlineLinkAt(raw, at + 2);
    if (link !== undefined) found.push({ ...link.found, offset: start + link.found.offset });
  }
  return found;
}

/**
 * The link targets in the inline content `text`: the reference definitions it opens with, when
 * `definitions` is set, then its links outside code spans and the targets inside its raw HTML.
 */
function inlineTargets(text: string, definitions: boolean): readonly Found[] {
  const found: Found[] = [];
  let at = 0;
  let definition = definitions ? definitionAt(text, at) : undefined;
  while (definition !== undefined) {
    found.push(definition.found);
    at = definition.end;
    definition = definitionAt(text, at);
  }
  const runs = /`+/gu;
  while (at < text.length) {
    const char = text.charAt(at);
    let next = at + 1;
    if (char === "\\" && punctuation.test(text.charAt(at + 1))) {
      next = at + 2;
    } else if (char === "`") {
      // A code span closes at the next backtick run of the same length, or the run is text.
      runs.lastIndex = at;
      const opener = runs.exec(text)?.[0].length ?? 1;
      let closer = runs.exec(text);
      while (closer !== null && closer[0].length !== opener) closer = runs.exec(text);
      next = closer === null ? at + opener : closer.index + opener;
    } else if (char === "<") {
      const end = inlineHtmlEnd(text, at);
      if (end !== undefined) {
        found.push(...rawTargets(text, at, end));
        next = end;
      }
    } else if (char === "]" && text.charAt(at + 1) === "(") {
      const link = inlineLinkAt(text, at + 2);
      if (link !== undefined) {
        found.push(link.found);
        next = link.end;
      }
    }
    at = next;
  }
  return found;
}

/** The link targets in one scope, each on the line its destination starts. */
function scopeTargets(scope: Scope): readonly LinkTarget[] {
  // Each line keeps its line break, as in cmark-gfm's paragraph content: a definition's
  // destination must be followed by one.
  const text = scope.lines.map((line) => `${line.text}\n`).join("");
  const found =
    scope.kind === "raw"
      ? rawTargets(text, 0, text.length)
      : inlineTargets(text, scope.kind === "paragraph");
  return found.map(({ offset, target }) => {
    const index = text.slice(0, offset).split("\n").length - 1;
    return { line: scope.lines[index]?.number ?? 0, target };
  });
}

/** The targets a Markdown reader follows in `markdown`, in document order. */
export function markdownLinkTargets(markdown: string): readonly LinkTarget[] {
  return scopesOf(markdown)
    .flatMap(scopeTargets)
    .sort((left, right) => left.line - right.line);
}

/** The repository path a target names from `from`, or undefined for an external or same-page link. */
export function linkedPath(from: string, target: string): string | undefined {
  if (target === "" || target.startsWith("#") || target.startsWith("//")) return undefined;
  if (/^[a-z][a-z\d+.-]*:/iu.test(target)) return undefined;
  const raw = target.split(/[?#]/u)[0] ?? "";
  let path = raw;
  try {
    path = decodeURIComponent(raw);
  } catch {
    // A malformed escape stays as written and fails to resolve.
  }
  const joined = path.startsWith("/")
    ? posix.normalize(path.slice(1))
    : posix.join(posix.dirname(from), path);
  return joined.replace(/\/$/u, "") || ".";
}

/** Every link in `documents` whose repository path is not in `present`, as `file:line target`. */
export function danglingLinks(
  documents: ReadonlyMap<string, string>,
  present: (path: string) => boolean,
): readonly string[] {
  const dangling: string[] = [];
  for (const [file, markdown] of documents) {
    for (const { line, target } of markdownLinkTargets(markdown)) {
      const path = linkedPath(file, target);
      if (path !== undefined && !present(path)) dangling.push(`${file}:${String(line)} ${target}`);
    }
  }
  return dangling;
}
