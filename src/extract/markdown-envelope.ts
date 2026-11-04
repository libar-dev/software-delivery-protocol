import { Buffer } from "node:buffer";

export interface MarkdownEnvelope {
  readonly source: string;
  readonly baseLine: number;
  readonly body: string;
  readonly bodyBaseLine: number;
}

/** Why the envelope refuses a carrier, and the physical line it names. */
export interface MarkdownEnvelopeRefusal {
  readonly reason: string;
  readonly line: number;
}

/**
 * A lone CR, U+2028 or U+2029 ends a line for some renderers and not for the parser, which ends a
 * line only at LF or CRLF, so a title, prose line or entry holding one could show a line the
 * carrier does not state.
 */
const UNSUPPORTED_LINE_BREAK = /\r(?!\n)|[\u2028\u2029]/u;

function refusal(reason: string, line = 1): MarkdownEnvelopeRefusal {
  return { reason, line };
}

export function readMarkdownEnvelope(source: string): MarkdownEnvelope | MarkdownEnvelopeRefusal {
  if (Buffer.byteLength(source, "utf8") > 256 * 1024)
    return refusal("carrier exceeds the 256 KiB byte limit");
  if (source.startsWith("\uFEFF") || !/^(?:---)(?:\r\n|\n)/u.test(source))
    return refusal("carrier must begin at byte zero with an exact --- line");
  const lineBreak = UNSUPPORTED_LINE_BREAK.exec(source);
  if (lineBreak !== null)
    return refusal(
      "carrier line holds a lone CR, U+2028 or U+2029; a line ends only at LF or CRLF",
      source.slice(0, lineBreak.index).split(/\r\n|\n/u).length,
    );
  const usesCrLf = source.includes("\r\n");
  if (usesCrLf && source.replaceAll("\r\n", "").includes("\n"))
    return refusal("carrier mixes LF and CRLF newlines");
  const newline = usesCrLf ? "\r\n" : "\n";
  const lines = source.split(newline);
  const closing = lines.findIndex((line, index) => index > 0 && line === "---");
  if (closing === -1) return refusal("carrier requires one exact closing --- line");
  if (lines.slice(1, closing).includes("..."))
    return refusal("frontmatter does not accept an exact ... document-end line");
  if (lines.slice(closing + 1).includes("---"))
    return refusal("an exact --- line in the body is unsupported Markdown");
  const frontmatter = lines.slice(1, closing).join(newline);
  return Buffer.byteLength(frontmatter, "utf8") > 32 * 1024
    ? refusal("frontmatter exceeds the 32 KiB byte limit")
    : {
        source: frontmatter,
        baseLine: 2,
        body: lines.slice(closing + 1).join(newline),
        bodyBaseLine: closing + 2,
      };
}
