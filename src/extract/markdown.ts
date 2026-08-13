import { codeAnchorId, parseId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { CarrierReification } from "./carrier.js";
import { parseMarkdownBody } from "./markdown-body.js";
import { readMarkdownEnvelope } from "./markdown-envelope.js";
import { parseMarkdownFrontmatter as parseFrontmatter } from "./markdown-frontmatter.js";
import { markdownFinding } from "./markdown-support.js";
import { reifyMarkdownPackFromFrontmatter } from "./markdown-pack.js";
import type { MarkdownBodyResult, MarkdownFrontmatterResult } from "./markdown-types.js";

export type {
  MarkdownBody,
  MarkdownBodyResult,
  MarkdownFrontmatter,
  MarkdownFrontmatterResult,
} from "./markdown-types.js";

export const envelopeContractAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.envelope-contract"),
  label: "parses the bounded Markdown frontmatter envelope",
  satisfies: ref("spec:carrier.envelope-contract"),
});

export function parseMarkdownFrontmatter(
  sourceText: string,
  file: string,
): MarkdownFrontmatterResult {
  return parseFrontmatter(sourceText, file);
}

export const proseOwnershipAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.prose-ownership"),
  label: "reads Markdown body content through its prose owners",
  satisfies: ref("spec:carrier.prose-ownership-rule"),
});

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

export const markdownAuthoringAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.markdown-authoring"),
  label: "reifies Markdown authoring into the one carrier path",
  satisfies: ref("spec:carrier.markdown-authoring"),
});

export const markdownParserAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.markdown-parser"),
  label: "reifies the ruled Markdown parser input",
  satisfies: ref("spec:carrier.markdown-parser"),
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
