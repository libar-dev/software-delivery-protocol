import type { CodeAnchor } from "./anchors.js";

export function codeAnchor(anchor: CodeAnchor): CodeAnchor {
  return {
    ...anchor,
  };
}
