import { normalizeAuthoring } from "./authoring-normalization.js";
import { codeAnchorId, componentAnchorId, parseId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { CarrierReification } from "./carrier.js";
import { parseMarkdownBody } from "./markdown-body.js";
import { readMarkdownEnvelope } from "./markdown-envelope.js";
import { parseMarkdownFrontmatter as parseFrontmatter } from "./markdown-frontmatter.js";
import { capMarkdownFindings, markdownFinding } from "./markdown-support.js";
import { reifyMarkdownPackFromFrontmatter } from "./markdown-pack.js";
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
  return parseFrontmatter(sourceText, file);
}

export function readMarkdownBody(
  sourceText: string,
  file: string,
  kind: string,
): MarkdownBodyResult {
  const envelope = readMarkdownEnvelope(sourceText);
  if (typeof envelope === "string")
    return { ok: false, findings: [markdownFinding(file, 1, envelope)] };
  return parseMarkdownBody(envelope.body, envelope.bodyBaseLine, file, kind);
}

export const markdownParserAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.markdown-parser"),
  label: "reifies Markdown Specs and Packs through one carrier boundary",
  satisfies: [ref("spec:carrier.markdown-parser"), ref("spec:carrier.markdown-authoring")],
  component: componentAnchorId("component:protocol.extract"),
  role: "extractor",
});

export function reifyMarkdownCarrier(sourceText: string, relativePath: string): CarrierReification {
  try {
    const frontmatter = parseMarkdownFrontmatter(sourceText, relativePath);
    if (!frontmatter.ok) return { specs: [], packs: [], findings: frontmatter.findings };
    if (parseId(frontmatter.frontmatter.id).namespace === "pack")
      return reifyMarkdownPackFromFrontmatter(frontmatter.frontmatter, sourceText, relativePath);
    const kind = frontmatter.frontmatter.data.kind;
    if (typeof kind !== "string")
      return {
        specs: [],
        packs: [],
        findings: [markdownFinding(relativePath, 1, "frontmatter kind is unavailable")],
      };
    const body = readMarkdownBody(sourceText, relativePath, kind);
    if (!body.ok) return { specs: [], packs: [], findings: body.findings };
    const normalized = normalizeAuthoring(
      {
        specs: [
          {
            data: { ...frontmatter.frontmatter.data, ...body.body.data },
            id: frontmatter.frontmatter.id,
            file: relativePath,
            line: frontmatter.frontmatter.line,
            entryLines: [...(frontmatter.frontmatter.entryLines ?? []), ...body.body.entryLines],
          },
        ],
        packs: [],
        findings: [],
      },
      true,
    );
    return { ...normalized, findings: capMarkdownFindings(normalized.findings, relativePath) };
  } catch (error: unknown) {
    return {
      specs: [],
      packs: [],
      findings: [
        markdownFinding(
          relativePath,
          1,
          `the carrier could not be reified: ${error instanceof Error ? error.message : "an unknown value was thrown"}`,
        ),
      ],
    };
  }
}
