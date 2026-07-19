import { isMap, LineCounter, parseAllDocuments } from "yaml";

import { parseId } from "../ids.js";
import { SPEC_ALTITUDES, SPEC_KINDS, SPEC_READINESS } from "../model/descriptors.js";
import { SPEC_RELATION_TYPES } from "../model/relations.js";
import type { Finding } from "../validate/contracts.js";
import { readMarkdownEnvelope } from "./markdown-envelope.js";
import { capMarkdownFindings, markdownFinding, markdownLine, report } from "./markdown-support.js";
import type { MarkdownFrontmatterResult } from "./markdown-types.js";
import {
  inspectMarkdownNodes,
  isMarkdownStringScalar,
  isReservedEnvelopeKey,
  markdownRelationTargets,
  markdownScalarLine,
} from "./markdown-yaml-policy.js";

const relationTypes = new Set<string>(SPEC_RELATION_TYPES);
const envelopeKeys = new Set(["id", "kind", "altitude", "readiness", "relations"]);
const specKinds = new Set<string>(SPEC_KINDS);
const specAltitudes = new Set<string>(SPEC_ALTITUDES);
const specReadiness = new Set<string>(SPEC_READINESS);

function refusal(file: string, message: string): MarkdownFrontmatterResult {
  return { ok: false, findings: [markdownFinding(file, 1, message)] };
}

export function parseMarkdownFrontmatter(
  sourceText: string,
  file: string,
): MarkdownFrontmatterResult {
  const envelope = readMarkdownEnvelope(sourceText);
  if (typeof envelope === "string") return refusal(file, envelope);
  try {
    const lineCounter = new LineCounter();
    lineCounter.addNewLine(0);
    const documents = parseAllDocuments(envelope.source, {
      version: "1.2",
      schema: "failsafe",
      strict: true,
      uniqueKeys: true,
      stringKeys: true,
      keepSourceTokens: true,
      lineCounter,
    });
    const findings: Finding[] = [];
    const directiveMatch = /(?:^|\r?\n)%/u.exec(envelope.source);
    const directiveOffset =
      directiveMatch === null ? -1 : directiveMatch.index + directiveMatch[0].length - 1;
    if (directiveOffset >= 0)
      report(
        findings,
        file,
        markdownLine(envelope.source, directiveOffset, envelope.baseLine),
        "YAML directives are not accepted",
      );
    if (documents.length !== 1 || documents[0]?.contents === null)
      report(findings, file, 1, "frontmatter must contain exactly one nonempty YAML document");
    const document = documents[0];
    if (document === undefined) return { ok: false, findings: capMarkdownFindings(findings, file) };
    for (const diagnostic of [...document.errors, ...document.warnings])
      report(
        findings,
        file,
        markdownLine(envelope.source, diagnostic.pos[0], envelope.baseLine),
        diagnostic.message,
      );
    if (document.directives.yaml.explicit === true && directiveOffset < 0)
      report(findings, file, 1, "YAML directives are not accepted");
    const root = document.contents;
    if (root === null || !isMap(root)) {
      report(findings, file, 1, "frontmatter must be a mapping");
      return { ok: false, findings: capMarkdownFindings(findings, file) };
    }
    inspectMarkdownNodes(root, envelope.source, envelope.baseLine, file, findings);
    const data: Record<string, unknown> = {};
    const names = new Set<string>();
    let idLine = 1;
    for (const pair of root.items) {
      const line = markdownScalarLine(pair.key, envelope.source, envelope.baseLine);
      if (!isMarkdownStringScalar(pair.key)) {
        report(findings, file, line, "frontmatter keys must be string scalars");
        continue;
      }
      const name = pair.key.value;
      if (names.has(name)) {
        report(findings, file, line, `frontmatter key "${name}" is authored more than once`);
        continue;
      }
      names.add(name);
      if (!envelopeKeys.has(name)) {
        report(
          findings,
          file,
          line,
          `frontmatter key "${name}" is not accepted`,
          isReservedEnvelopeKey(name)
            ? "extract/reserved-property"
            : name === "title"
              ? "extract/invalid-frontmatter"
              : "extract/unrecognized-property",
        );
        continue;
      }
      if (name === "relations") {
        if (!isMap(pair.value)) {
          report(findings, file, line, "relations must be a mapping");
          continue;
        }
        const relations: {
          readonly type: string;
          readonly target: string;
          readonly claim: "declared";
        }[] = [];
        const relationNames = new Set<string>();
        for (const relation of pair.value.items) {
          const relationLine = markdownScalarLine(relation.key, envelope.source, envelope.baseLine);
          if (!isMarkdownStringScalar(relation.key) || !relationTypes.has(relation.key.value)) {
            report(findings, file, relationLine, "relations contain an unsupported key");
            continue;
          }
          if (relationNames.has(relation.key.value)) {
            report(
              findings,
              file,
              relationLine,
              `relation "${relation.key.value}" is authored more than once`,
            );
            continue;
          }
          relationNames.add(relation.key.value);
          for (const target of markdownRelationTargets(
            relation.value,
            envelope.source,
            envelope.baseLine,
            file,
            findings,
          ))
            relations.push({ type: relation.key.value, target, claim: "declared" });
        }
        data.relations = relations;
        continue;
      }
      if (!isMarkdownStringScalar(pair.value)) {
        report(findings, file, line, `frontmatter field "${name}" must be a string scalar`);
        continue;
      }
      const value = pair.value.value;
      if (name === "id") {
        idLine = line;
        try {
          if (parseId(value).namespace !== "spec")
            throw new Error("id must use the spec namespace");
          data.id = value;
        } catch (error: unknown) {
          report(
            findings,
            file,
            line,
            error instanceof Error ? error.message : "invalid id",
            "extract/invalid-id",
          );
        }
      } else if (name === "kind" && !specKinds.has(value))
        report(
          findings,
          file,
          line,
          "kind is not a recognized spec kind",
          "extract/non-static-envelope",
        );
      else if (name === "altitude" && !specAltitudes.has(value))
        report(
          findings,
          file,
          line,
          "altitude is not a recognized spec altitude",
          "extract/non-static-envelope",
        );
      else if (name === "readiness" && !specReadiness.has(value))
        report(
          findings,
          file,
          line,
          "readiness is not a recognized spec readiness",
          "extract/non-static-envelope",
        );
      else data[name] = value;
    }
    for (const required of ["id", "kind", "altitude", "readiness", "relations"])
      if (!names.has(required))
        report(findings, file, 1, `frontmatter field "${required}" is missing`);
    const result = capMarkdownFindings(findings, file);
    const id = data.id;
    return result.length === 0 && typeof id === "string"
      ? { ok: true, frontmatter: { data, id, line: idLine }, findings: result }
      : { ok: false, findings: result };
  } catch (error: unknown) {
    return refusal(
      file,
      error instanceof Error
        ? `frontmatter parser failed: ${error.message}`
        : "frontmatter parser threw an unknown value",
    );
  }
}
