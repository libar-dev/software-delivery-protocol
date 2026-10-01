import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";

const inlineCodeSpansAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.inline-code-spans"),
  label: "scans raw HTML outside matched code spans",
  satisfies: ref("spec:carrier.inline-code-spans"),
  component: componentAnchorId("component:protocol.extract"),
});
void inlineCodeSpansAnchor;

const RAW_HTML = /<\/?[A-Za-z][^>]*>|<!--|-->|<![A-Za-z]|<\?/u;

/** Masks matched spans for the guard while leaving the authored text unchanged. */
export function hasRawHtmlOutsideCodeSpans(text: string): boolean {
  const runs = Array.from(text.matchAll(/`+/gu), (match) => ({
    start: match.index,
    end: match.index + match[0].length,
    length: match[0].length,
  }));
  const nextByLength = new Map<number, number>();
  const closers = new Map<number, number>();
  for (let index = runs.length - 1; index >= 0; index -= 1) {
    const run = runs[index];
    if (run === undefined) continue;
    const next = nextByLength.get(run.length);
    if (next !== undefined) closers.set(index, next);
    nextByLength.set(run.length, index);
  }

  let outsideStart = 0;
  const outside: string[] = [];
  for (let index = 0; index < runs.length; index += 1) {
    const run = runs[index];
    const closingIndex = closers.get(index);
    if (run === undefined || closingIndex === undefined) continue;
    const closing = runs[closingIndex];
    if (closing === undefined) continue;
    outside.push(text.slice(outsideStart, run.start), " ".repeat(closing.end - run.start));
    outsideStart = closing.end;
    index = closingIndex;
  }
  outside.push(text.slice(outsideStart));
  return RAW_HTML.test(outside.join(""));
}
