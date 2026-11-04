import { posix } from "node:path";

import { decodeHtmlReferences, decodeMarkdownReferences } from "./character-references.js";

/**
 * The reader behind the relative-link gate (`test/markdown-links.test.ts`): it finds the targets a
 * reader can follow in a Markdown document as the forge renders it. The forge parses Markdown with
 * cmark-gfm, then passes the raw HTML through an HTML sanitizer.
 *
 * Blocks follow cmark-gfm line by line: blockquotes, list items, footnote definitions, fenced and
 * indented code, HTML blocks, paragraphs with their lazy continuation lines, headings, and GFM
 * tables. Inside each paragraph, heading and table cell the reader follows the inline rules for
 * code spans, backslash escapes, autolinks (always absolute, so never reported), raw HTML,
 * brackets, inline links and images, and reference definitions. It reads raw HTML, in a block or
 * inline, as an HTML parser does, for the `href` and `src` values of its tags.
 *
 * What renders no link is skipped: fenced and indented code, code spans, HTML comments, and
 * Markdown inside an HTML block such as `<pre>`. Brackets pair as cmark-gfm pairs them, so an
 * escaped bracket opens no link, a link's text holds no other link, and an image's description
 * renders as text. Destinations decode character references as `character-references.ts` says.
 *
 * Where the reader departs from the forge, it reads more, never less. It reads every reference
 * definition and footnote definition, used or not, and the destination of a link whose text holds
 * a reference link. It reads tags inside processing instructions, declarations and CDATA
 * sections, which the forge's sanitizer treats inconsistently.
 *
 * A fragment on a link to a Markdown page, or on a same-page link (`#part` or `?query#part`), must
 * name one of the page's anchors (`markdownAnchors`). Fragments on the forge's source view
 * (`?plain=1`) name lines and are not checked. The forge derives a heading's anchor from the heading's rendered
 * text: lower-cased, with every character other than a letter, mark, digit, `_`, `-` or space
 * removed, and each space turned into `-`; a repeated anchor gets `-1`, `-2` and so on. The `id`
 * and `name` values of raw HTML tags are anchors too, and nothing inside an HTML comment is one.
 * Where the anchors depart from the forge, they accept more, never less: every `id` and `name`
 * counts, and so do headings in raw HTML.
 */

export interface LinkTarget {
  /** The line the destination starts on. */
  readonly line: number;
  readonly target: string;
}

/** Text read as one unit, with the line number of each of its lines. */
interface Scope {
  /** A paragraph may open with reference definitions; an HTML block holds no Markdown. */
  readonly kind: "paragraph" | "inline" | "html";
  readonly lines: { readonly number: number; readonly text: string }[];
  /** Set on an ATX heading's line and on a paragraph a setext underline makes a heading. */
  heading?: "atx" | "setext";
}

type Container =
  | { readonly kind: "quote" }
  | { readonly kind: "footnote" }
  | { readonly kind: "item"; readonly indent: number; hasChild: boolean };

type Leaf =
  | { readonly kind: "none" | "table" | "indented" }
  | { readonly kind: "paragraph"; readonly scope: Scope; tableTried: boolean }
  | { readonly kind: "fence"; readonly marker: string; readonly length: number }
  | { readonly kind: "html"; readonly end: RegExp | "blank"; readonly scope: Scope };

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
  if (/^<(?:script|pre|style|textarea)(?:[ >]|$)/iu.test(body)) {
    return /<\/(?:script|pre|style|textarea)>/iu;
  }
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
 * table cells, plus HTML blocks, which the link reader reads as HTML. Code is left out. The block
 * structure follows cmark-gfm line by line: open containers continue or close, a paragraph takes
 * lazy continuation lines, and new blocks open in its order.
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
      } else if (container.kind === "footnote") {
        // cmark-gfm continues a footnote definition on a line indented four columns, or on an
        // empty line; a line of only spaces closes it.
        if (indentOf(rest) >= 4) rest = rest.slice(4);
        else if (line !== "") break;
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
        leaf = { kind: "indented" };
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
        startScope("inline", number, body).heading = "atx";
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
        const scope = startScope("html", number, rest);
        if (htmlEnd === "blank" || !htmlEnd.test(body))
          leaf = { kind: "html", end: htmlEnd, scope };
        return;
      }
      if (afterParagraph && /^(?:=+|-+) *$/u.test(body)) {
        if (leaf.kind === "paragraph") leaf.scope.heading = "setext";
        leaf = none;
        return;
      }
      if (/^(?:(?:\* *){3,}|(?:- *){3,}|(?:_ *){3,})$/u.test(body)) {
        openBlock();
        return;
      }
      const footnote = /^\[\^[^\] ]+\]: */u.exec(body);
      if (footnote !== null) {
        openBlock();
        containers.push({ kind: "footnote" });
        matched = containers.length;
        rest = body.slice(footnote[0].length);
        afterParagraph = false;
        maybeLazy = false;
        continue;
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
function definitionAt(
  text: string,
  start: number,
): { found: Found; label: string; end: number } | undefined {
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
  return end === undefined ? undefined : { found: destination, label, end };
}

/** The reference definitions a paragraph's text opens with, and the offset after them. */
function definitionsAt(text: string): {
  readonly definitions: readonly { readonly found: Found; readonly label: string }[];
  readonly end: number;
} {
  const definitions: { found: Found; label: string }[] = [];
  let end = 0;
  for (let definition = definitionAt(text, end); definition !== undefined; ) {
    definitions.push(definition);
    end = definition.end;
    definition = definitionAt(text, end);
  }
  return { definitions, end };
}

const tagSpace = "[ \\t\\n\\v\\f\\r]";
const inlineAttribute =
  `${tagSpace}+[A-Za-z_:][A-Za-z0-9:._-]*` +
  `(?:${tagSpace}*=${tagSpace}*(?:[^ \\t\\n\\v\\f\\r"'=<>\`]+|'[^']*'|"[^"]*"))?`;
const inlineTag = new RegExp(
  `<(?:[A-Za-z][A-Za-z0-9-]*(?:${inlineAttribute})*${tagSpace}*/?|/[A-Za-z][A-Za-z0-9-]*${tagSpace}*)>`,
  "uy",
);
const inlineComment = /<!--(?:>|->|(?:[^-]|-[^-]|--[^>])*-->)/uy;
const inlineCdata = /<!\[CDATA\[(?:[^\]]|\][^\]]|\]\][^>])*\]\]>/uy;
const inlineDeclaration = new RegExp(`<![A-Z]+${tagSpace}+[^>]*>`, "uy");
const inlineInstruction = /<\?(?:[^?>]|\?[^>]|>)*\?>/uy;
// A URI autolink holds no space, control character, `<` or `>`.
const autolink = new RegExp(
  "<(?:[A-Za-z][A-Za-z0-9.+-]{1,31}:[!-;=?-\\u{10FFFF}]*|" +
    "[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?" +
    "(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*)>",
  "uy",
);

/**
 * The autolink or inline raw HTML at `start`, which holds a `<`, as cmark-gfm reads them: the
 * offset after it, and whether it is raw HTML. Undefined when the `<` is text.
 */
function inlineHtmlAt(
  text: string,
  start: number,
): { readonly end: number; readonly html: boolean } | undefined {
  const endOf = (pattern: RegExp): number | undefined => {
    pattern.lastIndex = start;
    return pattern.exec(text) === null ? undefined : pattern.lastIndex;
  };
  const link = endOf(autolink);
  if (link !== undefined) return { end: link, html: false };
  const pattern = text.startsWith("<!--", start)
    ? inlineComment
    : text.startsWith("<![", start)
      ? inlineCdata
      : text.startsWith("<!", start)
        ? inlineDeclaration
        : text.startsWith("<?", start)
          ? inlineInstruction
          : inlineTag;
  const end = endOf(pattern);
  return end === undefined ? undefined : { end, html: true };
}

const htmlSpace = "\\t\\n\\f\\r ";
const tagName = new RegExp(`[^${htmlSpace}/>]*`, "uy");
const tagAttribute = new RegExp(
  `[${htmlSpace}/]*([^${htmlSpace}/>][^${htmlSpace}/>=]*)` +
    `(?:[${htmlSpace}]*=[${htmlSpace}]*(?:"([^"]*)"|'([^']*)'|([^${htmlSpace}>]*)))?`,
  "duy",
);

/**
 * Reads the tag whose name starts at `start` as an HTML parser does, adding its `href` and `src`
 * values to `found` and its `id` and `name` values to `ids`, and returns the offset after its
 * `>`, or `end` for a tag left open.
 */
function readTag(
  text: string,
  start: number,
  end: number,
  found: Found[],
  ids: string[] = [],
): number {
  tagName.lastIndex = start;
  tagName.exec(text);
  tagAttribute.lastIndex = tagName.lastIndex;
  let after = tagName.lastIndex;
  for (let match = tagAttribute.exec(text); match !== null; match = tagAttribute.exec(text)) {
    if (tagAttribute.lastIndex > end) break;
    after = tagAttribute.lastIndex;
    const group = [2, 3, 4].find((index) => match[index] !== undefined);
    const offset = group === undefined ? undefined : match.indices?.[group]?.[0];
    const value = group === undefined ? undefined : match[group];
    if (/^(?:href|src)$/iu.test(match[1] ?? "") && offset !== undefined && value !== undefined) {
      found.push({ offset, target: decodeHtmlReferences(value) });
    }
    if (/^(?:id|name)$/iu.test(match[1] ?? "") && value !== undefined) {
      ids.push(decodeHtmlReferences(value));
    }
  }
  const close = text.indexOf(">", after);
  return close === -1 || close >= end ? end : close + 1;
}

/**
 * The offset after the HTML comment whose `<!--` is at `at`: after the first `-->` or `--!>`, at
 * once when `<!--` is followed by `>` or `->`, or `end` for a comment left open.
 */
function commentEnd(text: string, at: number, end: number): number {
  const abrupt = /->|>/uy;
  abrupt.lastIndex = at + 4;
  if (abrupt.exec(text) !== null) return abrupt.lastIndex;
  const closes = ["-->", "--!>"].map((closer) => {
    const index = text.indexOf(closer, at + 4);
    return index === -1 ? end : index + closer.length;
  });
  return Math.min(end, ...closes);
}

/** The name of the tag that starts at `start`, lower-cased. */
function tagNameAt(text: string, start: number): string {
  tagName.lastIndex = start;
  return (tagName.exec(text)?.[0] ?? "").toLowerCase();
}

/**
 * The `href` and `src` values of the tags in the raw HTML between `start` and `end`, read as an
 * HTML parser reads them, with the tags' `id` and `name` values added to `ids` and the text of
 * each closed `<h1>` to `<h6>` element added to `headings`. Comments render nothing, so nothing
 * in one counts (`commentEnd`). Any other `<` that opens no start or end tag is text.
 */
function htmlTargets(
  text: string,
  start: number,
  end: number,
  ids: string[] = [],
  headings: string[] = [],
): readonly Found[] {
  const found: Found[] = [];
  // The heading element open here, with the text it holds so far, and where that text resumes.
  let heading: { readonly name: string; text: string } | undefined;
  let textStart = start;
  let at = text.indexOf("<", start);
  while (at !== -1 && at < end) {
    let next = at + 1;
    let tag: "start" | "end" | undefined;
    let markup = true;
    if (text.startsWith("<!--", at)) {
      next = commentEnd(text, at, end);
    } else if (/[A-Za-z]/u.test(text.charAt(at + 1))) {
      next = readTag(text, at + 1, end, found, ids);
      tag = "start";
    } else if (text.charAt(at + 1) === "/" && /[A-Za-z]/u.test(text.charAt(at + 2))) {
      // An end tag's attributes are dropped.
      next = readTag(text, at + 2, end, []);
      tag = "end";
    } else {
      markup = false;
    }
    if (markup) {
      if (heading !== undefined) heading.text += text.slice(textStart, at);
      textStart = next;
      const name = tag === undefined ? "" : tagNameAt(text, at + (tag === "end" ? 2 : 1));
      if (tag === "start" && heading === undefined && /^h[1-6]$/u.test(name)) {
        heading = { name, text: "" };
      } else if (tag === "end" && heading?.name === name) {
        headings.push(decodeMarkdownReferences(heading.text));
        heading = undefined;
      }
    }
    at = text.indexOf("<", next);
  }
  return found;
}

/**
 * The link targets in the inline content `text`: the reference definitions it opens with, when
 * `definitions` is set, then its inline links and images and the targets of its raw HTML.
 * Brackets pair as cmark-gfm pairs them: a `]` closes the last open bracket, a link deactivates
 * the brackets open before it, and an image's description renders as text.
 */
function inlineTargets(text: string, definitions: boolean): readonly Found[] {
  const found: Found[] = [];
  let at = 0;
  if (definitions) {
    const opening = definitionsAt(text);
    found.push(...opening.definitions.map((definition) => definition.found));
    at = opening.end;
  }
  const openers: { readonly image: boolean; readonly mark: number; active: boolean }[] = [];
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
      const html = inlineHtmlAt(text, at);
      if (html !== undefined) {
        if (html.html) found.push(...htmlTargets(text, at, html.end));
        next = html.end;
      }
    } else if (char === "[" || (char === "!" && text.charAt(at + 1) === "[")) {
      openers.push({ image: char === "!", mark: found.length, active: true });
      next = char === "!" ? at + 2 : at + 1;
    } else if (char === "]") {
      const opener = openers.pop();
      const link =
        opener?.active === true && text.charAt(at + 1) === "("
          ? inlineLinkAt(text, at + 2)
          : undefined;
      if (opener !== undefined && link !== undefined) {
        if (opener.image) found.length = opener.mark;
        else for (const earlier of openers) if (!earlier.image) earlier.active = false;
        found.push(link.found);
        next = link.end;
      }
    }
    at = next;
  }
  return found;
}

/**
 * A scope's text. Each line keeps its line break, as in cmark-gfm's paragraph content: a
 * definition's destination must be followed by one.
 */
function scopeText(scope: Scope): string {
  return scope.lines.map((line) => `${line.text}\n`).join("");
}

/** The link targets in one scope, each on the line its destination starts. */
function scopeTargets(scope: Scope): readonly LinkTarget[] {
  const text = scopeText(scope);
  const found =
    scope.kind === "html"
      ? htmlTargets(text, 0, text.length)
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

/**
 * True for a target that names the page it is on: empty, or a fragment or query alone. A browser
 * resolves `#part` and `?plain=1#L5` against the page's own address.
 */
const namesSamePage = (target: string): boolean => /^(?:$|[#?])/u.test(target);

/** The repository path a target names from `from`, or undefined for an external or same-page link. */
export function linkedPath(from: string, target: string): string | undefined {
  if (namesSamePage(target) || target.startsWith("//")) return undefined;
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

/**
 * The fragment a target names, percent-decoded, or undefined for an external link, a link with no
 * fragment, and a link to the forge's source view (`?plain=1`), whose fragments name lines.
 */
export function linkedFragment(target: string): string | undefined {
  if (target.startsWith("//") || /^[a-z][a-z\d+.-]*:/iu.test(target)) return undefined;
  const hash = target.indexOf("#");
  if (hash === -1 || hash === target.length - 1) return undefined;
  const query = target.slice(0, hash).split("?")[1];
  if (query !== undefined && new URLSearchParams(query).get("plain") === "1") return undefined;
  const raw = target.slice(hash + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    // A malformed escape stays as written and matches no anchor.
    return raw;
  }
}

/** A run of `*` or `_` that may open or close emphasis, as cmark-gfm's flanking rules say. */
interface Delimiter {
  readonly char: string;
  readonly length: number;
  readonly canOpen: boolean;
  readonly canClose: boolean;
  remaining: number;
}

/** Rendered text, or a delimiter run not yet matched. */
type Piece = string | Delimiter;

const unicodeWhitespace = /\s/u;
const unicodePunctuation = /[\p{P}\p{S}]/u;
const characterReference = /&(?:#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6}|[A-Za-z][A-Za-z0-9]{1,31});/uy;

/** The delimiter run that starts at `at`, with its flanking computed from its neighbours. */
function delimiterAt(text: string, at: number): Delimiter {
  const char = text.charAt(at);
  let end = at;
  while (text.charAt(end) === char) end += 1;
  // The start and end of the text count as whitespace.
  const before = /.$/su.exec(text.slice(0, at))?.[0] ?? " ";
  const after = end < text.length ? String.fromCodePoint(text.codePointAt(end) ?? 32) : " ";
  const spaceBefore = unicodeWhitespace.test(before);
  const spaceAfter = unicodeWhitespace.test(after);
  const punctuationBefore = unicodePunctuation.test(before);
  const punctuationAfter = unicodePunctuation.test(after);
  const left = !spaceAfter && (!punctuationAfter || spaceBefore || punctuationBefore);
  const right = !spaceBefore && (!punctuationBefore || spaceAfter || punctuationAfter);
  const length = end - at;
  return char === "_"
    ? {
        char,
        length,
        canOpen: left && (!right || punctuationBefore),
        canClose: right && (!left || punctuationAfter),
        remaining: length,
      }
    : { char, length, canOpen: left, canClose: right, remaining: length };
}

/**
 * Matches the delimiter runs in `pieces` from `from` as cmark-gfm's emphasis pass does, and
 * replaces each run with the characters no emphasis consumed.
 */
function processEmphasis(pieces: Piece[], from: number): void {
  const stack = pieces.slice(from).filter((piece): piece is Delimiter => typeof piece !== "string");
  let position = 0;
  while (position < stack.length) {
    const closer = stack[position];
    if (closer === undefined || !closer.canClose || closer.remaining === 0) {
      position += 1;
      continue;
    }
    let found = -1;
    for (let index = position - 1; index >= 0; index -= 1) {
      const opener = stack[index];
      if (opener?.char !== closer.char || !opener.canOpen || opener.remaining === 0) continue;
      const bothWays = opener.canClose || closer.canOpen;
      const sum = opener.length + closer.length;
      if (bothWays && sum % 3 === 0 && (opener.length % 3 !== 0 || closer.length % 3 !== 0)) {
        continue;
      }
      found = index;
      break;
    }
    const opener = stack[found];
    if (opener === undefined) {
      if (closer.canOpen) position += 1;
      else stack.splice(position, 1);
      continue;
    }
    const used = opener.remaining >= 2 && closer.remaining >= 2 ? 2 : 1;
    opener.remaining -= used;
    closer.remaining -= used;
    // The runs between the pair can no longer match; they stay as text.
    stack.splice(found + 1, position - found - 1);
    position = found + 1;
    if (opener.remaining === 0) {
      stack.splice(found, 1);
      position = found;
    }
    if (closer.remaining === 0) stack.splice(position, 1);
  }
  for (let index = from; index < pieces.length; index += 1) {
    pieces[index] = pieceText(pieces[index] ?? "");
  }
}

/** A piece's text: a delimiter run renders the characters no emphasis consumed. */
function pieceText(piece: Piece): string {
  return typeof piece === "string" ? piece : piece.char.repeat(piece.remaining);
}

/** A link label as cmark-gfm matches it: case-folded, with its whitespace collapsed. */
function labelKey(label: string): string {
  return label
    .replaceAll(/[ \t\n]+/gu, " ")
    .trim()
    .toLowerCase();
}

/**
 * The offset after the link that the `]` at `at` closes, or undefined when it closes none: an
 * inline link, a full reference whose label is defined, or a collapsed or shortcut reference
 * whose text, from `textStart`, is a defined label.
 */
function linkEnd(
  text: string,
  at: number,
  textStart: number,
  labels: ReadonlySet<string>,
): number | undefined {
  if (text.charAt(at + 1) === "(") {
    const inline = inlineLinkAt(text, at + 2);
    if (inline !== undefined) return inline.end;
  }
  const reference = /\[((?:[^[\]\\]|\\.){0,999})\]/uy;
  reference.lastIndex = at + 1;
  const label = reference.exec(text);
  if (label !== null && (label[1] ?? "").trim() !== "") {
    return labels.has(labelKey(label[1] ?? "")) ? reference.lastIndex : undefined;
  }
  if (!labels.has(labelKey(text.slice(textStart, at)))) return undefined;
  return label === null ? at + 1 : reference.lastIndex;
}

/** A code span's text: line breaks become spaces, and one space pads each side at most. */
function codeSpanText(content: string): string {
  const text = content.replaceAll("\n", " ");
  return /^ .* $/su.test(text) && text.trim() !== "" ? text.slice(1, -1) : text;
}

/**
 * The text an inline scope renders, as the forge's HTML reads it: escapes and character
 * references decoded, code spans as their content, link text without its destination, images
 * and raw HTML as nothing, and emphasis without its delimiters. The `id` and `name` values of
 * raw HTML tags go to `ids`.
 */
function renderedText(text: string, labels: ReadonlySet<string>, ids: string[]): string {
  const pieces: Piece[] = [];
  const openers: {
    readonly image: boolean;
    readonly piece: number;
    readonly ids: number;
    readonly textStart: number;
    active: boolean;
  }[] = [];
  const runs = /`+/gu;
  let at = 0;
  while (at < text.length) {
    const char = text.charAt(at);
    let next = at + 1;
    if (char === "\\" && punctuation.test(text.charAt(at + 1))) {
      pieces.push(text.charAt(at + 1));
      next = at + 2;
    } else if (char === "`") {
      runs.lastIndex = at;
      const opener = runs.exec(text)?.[0].length ?? 1;
      let closer = runs.exec(text);
      while (closer !== null && closer[0].length !== opener) closer = runs.exec(text);
      if (closer === null) {
        pieces.push("`".repeat(opener));
        next = at + opener;
      } else {
        pieces.push(codeSpanText(text.slice(at + opener, closer.index)));
        next = closer.index + opener;
      }
    } else if (char === "<") {
      const html = inlineHtmlAt(text, at);
      if (html === undefined) {
        pieces.push(char);
      } else {
        if (html.html) htmlTargets(text, at, html.end, ids);
        else pieces.push(text.slice(at + 1, html.end - 1));
        next = html.end;
      }
    } else if (char === "&") {
      characterReference.lastIndex = at;
      const reference = characterReference.exec(text)?.[0];
      pieces.push(reference === undefined ? char : decodeMarkdownReferences(reference));
      next = at + (reference?.length ?? 1);
    } else if (char === "*" || char === "_") {
      const delimiter = delimiterAt(text, at);
      pieces.push(delimiter);
      next = at + delimiter.length;
    } else if (char === "[" || (char === "!" && text.charAt(at + 1) === "[")) {
      next = char === "!" ? at + 2 : at + 1;
      openers.push({
        image: char === "!",
        piece: pieces.length,
        ids: ids.length,
        textStart: next,
        active: true,
      });
      pieces.push(text.slice(at, next));
    } else if (char === "]") {
      const opener = openers.pop();
      const end = opener?.active === true ? linkEnd(text, at, opener.textStart, labels) : undefined;
      if (opener !== undefined && end !== undefined) {
        if (opener.image) {
          // An image renders as an element with no text, and its description as no HTML.
          pieces.length = opener.piece;
          ids.length = opener.ids;
        } else {
          pieces[opener.piece] = "";
          processEmphasis(pieces, opener.piece + 1);
          for (const earlier of openers) if (!earlier.image) earlier.active = false;
        }
        next = end;
      } else {
        pieces.push(char);
      }
    } else {
      pieces.push(char);
    }
    at = next;
  }
  processEmphasis(pieces, 0);
  return pieces.map(pieceText).join("");
}

/** A heading's anchor as the forge derives it from the heading's text. */
function slugOf(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{M}\p{Nd}\p{Nl}\p{Pc}\- ]/gu, "")
    .replaceAll(" ", "-");
}

/**
 * The fragments that reach a place in `markdown` as the forge renders it: each heading's anchor,
 * with `-1`, `-2` and so on added to a repeated one, and the `id` and `name` values of its raw
 * HTML. Code is left out.
 */
export function markdownAnchors(markdown: string): ReadonlySet<string> {
  const scopes = scopesOf(markdown);
  const labels = new Set(
    scopes
      .filter((scope) => scope.kind === "paragraph")
      .flatMap((scope) => definitionsAt(scopeText(scope)).definitions)
      .map((definition) => labelKey(definition.label)),
  );
  // Headings number their repeats among themselves; an HTML anchor takes no heading's place.
  const headings = new Set<string>();
  const ids: string[] = [];
  const addHeading = (text: string): void => {
    const base = slugOf(text);
    let anchor = base;
    for (let suffix = 1; headings.has(anchor); suffix += 1) anchor = `${base}-${String(suffix)}`;
    headings.add(anchor);
  };
  for (const scope of scopes) {
    const text = scopeText(scope);
    if (scope.kind === "html") {
      const htmlHeadings: string[] = [];
      htmlTargets(text, 0, text.length, ids, htmlHeadings);
      for (const heading of htmlHeadings) addHeading(heading);
    } else if (scope.heading === "atx") {
      const content = text
        .trim()
        .replace(/^#{1,6}/u, "")
        .replace(/(?:^|[ \t]+)#+[ \t]*$/u, "");
      addHeading(renderedText(content.trim(), labels, ids).trim());
    } else {
      const body = text.slice(scope.kind === "paragraph" ? definitionsAt(text).end : 0);
      const rendered = renderedText(body.replaceAll(/[ \t]+\n/gu, "\n"), labels, ids);
      if (scope.heading === "setext") addHeading(rendered.trim());
    }
  }
  return new Set([...headings, ...ids]);
}

/**
 * True when `fragment` reaches a place on a page with `anchors`. A browser scrolls to the top for
 * `top`. The forge prefixes each anchor with `user-content-`, and when a fragment matches none it
 * tries the fragment lower-cased.
 */
function reaches(anchors: ReadonlySet<string>, fragment: string): boolean {
  if (fragment.toLowerCase() === "top") return true;
  const names = fragment.startsWith("user-content-") ? [fragment, fragment.slice(13)] : [fragment];
  return names.some((name) => anchors.has(name) || anchors.has(name.toLowerCase()));
}

/**
 * Every link in `documents` that misses, as `file:line target`: its repository path is not in
 * `present`, or it names a fragment that no heading or HTML anchor of its Markdown page carries.
 * `read` gives a Markdown page's text; a page it cannot read keeps its fragments unchecked, and
 * fragments on other files, such as line anchors in source files, are not checked.
 */
export function danglingLinks(
  documents: ReadonlyMap<string, string>,
  present: (path: string) => boolean,
  read: (path: string) => string | undefined = (path) => documents.get(path),
): readonly string[] {
  const dangling: string[] = [];
  const pages = new Map<string, ReadonlySet<string> | undefined>();
  const anchorsOf = (path: string): ReadonlySet<string> | undefined => {
    if (!pages.has(path)) {
      const text = read(path);
      pages.set(path, text === undefined ? undefined : markdownAnchors(text));
    }
    return pages.get(path);
  };
  for (const [file, markdown] of documents) {
    for (const { line, target } of markdownLinkTargets(markdown)) {
      const path = linkedPath(file, target);
      if (path !== undefined && !present(path)) {
        dangling.push(`${file}:${String(line)} ${target}`);
        continue;
      }
      const page = path ?? (namesSamePage(target) ? file : undefined);
      const fragment = linkedFragment(target);
      if (page === undefined || fragment === undefined || !/\.md$/iu.test(page)) continue;
      const anchors = anchorsOf(page);
      if (anchors !== undefined && !reaches(anchors, fragment)) {
        dangling.push(`${file}:${String(line)} ${target}`);
      }
    }
  }
  return dangling;
}
