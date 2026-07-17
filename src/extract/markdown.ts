import type { CarrierReification } from "./carrier.js";
import { parseMarkdownBody } from "./markdown-body.js";
import { readMarkdownEnvelope } from "./markdown-envelope.js";
import { parseMarkdownFrontmatterData } from "./markdown-frontmatter.js";
import { markdownFinding } from "./markdown-support.js";
import type { MarkdownBodyResult, MarkdownFrontmatterResult } from "./markdown-types.js";

export type {
  MarkdownBody,
  MarkdownBodyResult,
  MarkdownFrontmatter,
  MarkdownFrontmatterResult,
} from "./markdown-types.js";

export function parseMarkdownFrontmatter(
  sourceText: string,
  file: string,
): MarkdownFrontmatterResult {
  return parseMarkdownFrontmatterData(sourceText, file);
}

export function readMarkdownBody(
  sourceText: string,
  file: string,
  kind: string,
): MarkdownBodyResult {
  const envelope = readMarkdownEnvelope(sourceText);
  if (typeof envelope === "string") {
    return { ok: false, findings: [markdownFinding(file, 1, envelope)] };
  }
  return parseMarkdownBody(envelope.body, envelope.bodyBaseLine, file, kind);
}

export function reifyMarkdownCarrier(sourceText: string, relativePath: string): CarrierReification {
  const frontmatter = parseMarkdownFrontmatter(sourceText, relativePath);
  if (!frontmatter.ok) return { specs: [], packs: [], findings: frontmatter.findings };
  const kind = frontmatter.frontmatter.data.kind;
  if (typeof kind !== "string") {
    return {
      specs: [],
      packs: [],
      findings: [markdownFinding(relativePath, 1, "frontmatter kind is unavailable")],
    };
  }
  const body = readMarkdownBody(sourceText, relativePath, kind);
  if (!body.ok) return { specs: [], packs: [], findings: body.findings };
  return {
    specs: [
      {
        data: { ...frontmatter.frontmatter.data, ...body.body.data },
        id: frontmatter.frontmatter.id,
        file: relativePath,
        line: frontmatter.frontmatter.line,
      },
    ],
    packs: [],
    findings: [],
  };
}
