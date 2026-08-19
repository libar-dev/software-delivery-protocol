import type { Finding } from "../validate/contracts.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { CarrierReification } from "./carrier.js";
import { isUnsupportedCommonMarkBlock, normalizeProse } from "./markdown-body-content.js";
import type { MarkdownLine } from "./markdown-body-content.js";
import { readMarkdownEnvelope } from "./markdown-envelope.js";
import { parseMarkdownFrontmatter } from "./markdown-frontmatter.js";
import { addMarkdownFinding, capMarkdownFindings, markdownFinding } from "./markdown-support.js";
import type { MarkdownFrontmatter } from "./markdown-types.js";

function structure(file: string, line: number, message: string): Finding {
  return markdownFinding(file, line, message, "extract/invalid-markdown-structure");
}

function parseMarkdownPackBody(
  sourceText: string,
  file: string,
):
  | { readonly ok: true; readonly data: Record<string, unknown> }
  | { readonly ok: false; readonly findings: readonly Finding[] } {
  const envelope = readMarkdownEnvelope(sourceText);
  if (typeof envelope === "string")
    return { ok: false, findings: [markdownFinding(file, 1, envelope)] };

  const lines: MarkdownLine[] = envelope.body
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((text, index) => ({ text, line: envelope.bodyBaseLine + index }));
  const first = lines[0];
  if (!first?.text.startsWith("# "))
    return {
      ok: false,
      findings: [structure(file, envelope.bodyBaseLine, "the first body line must be an H1 title")],
    };

  const rawTitle = first.text.slice(2);
  const title = rawTitle.replace(/^[\t ]+|[\t ]+$/gu, "");
  const findings: Finding[] = [];
  if (/^[\t ]/u.test(rawTitle) || title.length === 0)
    addMarkdownFinding(
      findings,
      structure(file, first.line, "the H1 title must be nonempty and start immediately after #"),
    );

  const prose: MarkdownLine[] = [];
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) continue;
    if (/^#{2,} /u.test(line.text)) {
      const heading = line.text.replace(/^#+[\t ]+/u, "").replace(/[\t ]+$/gu, "");
      addMarkdownFinding(
        findings,
        markdownFinding(
          file,
          line.line,
          `heading "${heading}" is not recognized; a Pack has no section tier`,
          "extract/unrecognized-heading",
        ),
      );
      continue;
    }
    if (line.text.startsWith("# ")) {
      addMarkdownFinding(findings, structure(file, line.line, "only the first H1 is accepted"));
      continue;
    }
    prose.push(line);
  }

  for (const line of prose) {
    if (line.text === "") continue;
    if (/<\/?[A-Za-z][^>]*>|<!--|-->|<![A-Za-z]|<\?/u.test(line.text)) {
      addMarkdownFinding(findings, structure(file, line.line, "raw HTML is unsupported"));
      continue;
    }
    if (
      /^(?:-|```|\||>|<|#)/u.test(line.text) ||
      /^[\t ]/u.test(line.text) ||
      isUnsupportedCommonMarkBlock(line.text)
    )
      addMarkdownFinding(
        findings,
        structure(file, line.line, "narrative accepts CommonMark paragraphs only"),
      );
  }

  const capped = capMarkdownFindings(findings, file, "extract/invalid-markdown-structure");
  if (capped.length > 0) return { ok: false, findings: capped };

  const framing = normalizeProse(prose);
  return { ok: true, data: { title, ...(framing.length > 0 ? { framing } : {}) } };
}

export function reifyMarkdownPackFromFrontmatter(
  frontmatter: MarkdownFrontmatter,
  sourceText: string,
  relativePath: string,
): CarrierReification {
  const body = parseMarkdownPackBody(sourceText, relativePath);
  if (!body.ok) return { specs: [], packs: [], findings: body.findings };
  return {
    specs: [],
    packs: [
      {
        data: { ...frontmatter.data, ...body.data },
        id: frontmatter.id,
        file: relativePath,
        line: frontmatter.line,
      },
    ],
    findings: [],
  };
}

export const markdownPackAuthoringAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.markdown-pack-authoring"),
  label: "reifies the Markdown Pack manifest into the one carrier path",
  satisfies: ref("spec:carrier.markdown-pack-authoring"),
  component: componentAnchorId("component:protocol.extract"),
});
export function reifyMarkdownPack(sourceText: string, relativePath: string): CarrierReification {
  try {
    const frontmatter = parseMarkdownFrontmatter(sourceText, relativePath);
    if (!frontmatter.ok) return { specs: [], packs: [], findings: frontmatter.findings };
    return reifyMarkdownPackFromFrontmatter(frontmatter.frontmatter, sourceText, relativePath);
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
