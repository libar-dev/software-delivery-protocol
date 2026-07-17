import { Buffer } from "node:buffer";

export interface MarkdownEnvelope {
  readonly source: string;
  readonly baseLine: number;
  readonly body: string;
  readonly bodyBaseLine: number;
}

export function readMarkdownEnvelope(source: string): MarkdownEnvelope | string {
  if (Buffer.byteLength(source, "utf8") > 256 * 1024)
    return "carrier exceeds the 256 KiB byte limit";
  if (source.startsWith("\uFEFF") || !/^(?:---)(?:\r\n|\n)/u.test(source))
    return "carrier must begin at byte zero with an exact --- line";
  if (/\r(?!\n)/u.test(source)) return "carrier contains a lone CR newline";
  const usesCrLf = source.includes("\r\n");
  if (usesCrLf && source.replaceAll("\r\n", "").includes("\n"))
    return "carrier mixes LF and CRLF newlines";
  const newline = usesCrLf ? "\r\n" : "\n";
  const lines = source.split(newline);
  const closing = lines.findIndex((line, index) => index > 0 && line === "---");
  if (closing === -1) return "carrier requires one exact closing --- line";
  if (lines.slice(closing + 1).includes("---"))
    return "an exact --- line in the body is unsupported Markdown";
  const frontmatter = lines.slice(1, closing).join(newline);
  return Buffer.byteLength(frontmatter, "utf8") > 32 * 1024
    ? "frontmatter exceeds the 32 KiB byte limit"
    : {
        source: frontmatter,
        baseLine: 2,
        body: lines.slice(closing + 1).join(newline),
        bodyBaseLine: closing + 2,
      };
}
