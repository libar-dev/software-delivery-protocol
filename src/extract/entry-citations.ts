import type { EntryCitationLocation } from "../graph/schema.js";
import { codeAnchorId, componentAnchorId, parseId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { mentionTokens } from "../validate/validators.js";

const entryCitationsAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.entry-citation-scan"),
  label: "records prose-mention tokens with addresses in anchored source files",
  satisfies: ref("spec:extraction.entry-citations"),
  component: componentAnchorId("component:protocol.extract"),
  role: "extractor",
});
void entryCitationsAnchor;

export function scanEntryCitations(text: string, file: string): readonly EntryCitationLocation[] {
  return text.split(/\r\n|[\r\n\u2028\u2029]/u).flatMap((line, index) => {
    const source = line.replaceAll("\\", " ");
    const addresses = mentionTokens(source).flatMap((token) => {
      if (!token.includes("#")) return [];
      if (token.endsWith("$") && source.includes(`${token}{`)) {
        const address = token.slice(0, -1);
        try {
          // An interpolated key has no entry address yet.
          return parseId(address).subpath === undefined ? [] : [address];
        } catch {
          return [];
        }
      }
      return [token];
    });
    return [...new Set(addresses)].map((address) => ({ address, file, line: index + 1 }));
  });
}

export function compareCitations(
  left: EntryCitationLocation,
  right: EntryCitationLocation,
): number {
  const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
  return (
    compare(left.file, right.file) || left.line - right.line || compare(left.address, right.address)
  );
}
