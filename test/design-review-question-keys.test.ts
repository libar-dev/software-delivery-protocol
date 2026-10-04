import { describe, expect, it } from "vitest";

import {
  createReader,
  deriveGraph,
  reifyMarkdownCarrier,
  reifyTypeScriptCarrier,
  renderDesignReview,
} from "../src/index.js";
import type { ReifiedSpec } from "../src/index.js";

// The rendering `spec:decisions.question-key-rendering` decides; a decision record needs no binding.
const SPEC_ID = "spec:orders.question-keys";

function markdownSpec(questions: readonly string[]): readonly ReifiedSpec[] {
  const result = reifyMarkdownCarrier(
    `---
id: ${SPEC_ID}
kind: rule
altitude: story
readiness: idea
relations: {}
---
# Keyed questions

## Intent
- outcome: Show each question's key.

### Open questions
${questions.join("\n")}

## Rule
- The probe states one rule.
`,
    "question-keys.sdp.md",
  );

  expect(result.findings).toEqual([]);
  return result.specs;
}

/** The rendered open-question list of the one Spec page, without its heading. */
function renderedQuestions(specs: readonly ReifiedSpec[]): string | undefined {
  const pages = renderDesignReview(createReader(deriveGraph(specs, [], [])));
  const page = pages.find((entry) => entry.path === "spec/orders.question-keys.md")?.content;

  return page?.split("### Open questions\n\n")[1]?.split("\n\n")[0];
}

describe("the Design Review shows an open question's key", () => {
  it("opens a keyed question with its key as inline code and leaves an unkeyed one as before", () => {
    const specs = markdownSpec([
      "- [blocking #aggregateReach] Does the owner widen the aggregate?",
      "- [non-blocking] Is the name final?",
      "- [non-blocking #pageHome] Where does the page live?",
    ]);

    expect(renderedQuestions(specs)).toBe(
      [
        "- `#aggregateReach` Does the owner widen the aggregate? — **blocking**",
        "- Is the name final?",
        "- `#pageHome` Where does the page live?",
      ].join("\n"),
    );
  });

  it("escapes the question's text after the key as it escapes an unkeyed question", () => {
    const specs = markdownSpec([
      "- [blocking #pipeKey] Does a | # stay *literal* & _plain_?",
      "- [blocking] Does a | # stay *literal* & _plain_?",
    ]);
    const [keyed, unkeyed] = renderedQuestions(specs)?.split("\n") ?? [];

    expect(unkeyed).toBe("- Does a \\| \\# stay *literal* &amp; _plain_? — **blocking**");
    expect(keyed).toBe(`- \`#pipeKey\` ${unkeyed?.slice("- ".length) ?? ""}`);
  });

  it("shows description as an ordinary key", () => {
    const specs = markdownSpec(["- [non-blocking #description] Is description a key?"]);

    expect(renderedQuestions(specs)).toBe("- `#description` Is description a key?");
  });

  it("renders a TypeScript question whose key the carrier dropped as an unkeyed one", () => {
    const reified = reifyTypeScriptCarrier(
      `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const carrier = spec({
  id: specId("${SPEC_ID}"),
  kind: "rule",
  altitude: "story",
  readiness: "idea",
  intent: {
    outcome: "Show each question's key.",
    openQuestions: [
      { question: "Kept?", blocking: true, key: "keptKey" },
      { question: "Dropped?", blocking: true, key: "Dropped" },
      "A prose question.",
    ],
  },
});`,
      "question-keys.sdp.ts",
    );

    expect(reified.findings.map((finding) => finding.path)).toEqual([
      "intent.openQuestions[1].key",
    ]);
    expect(renderedQuestions(reified.specs)).toBe(
      [
        "- `#keptKey` Kept? — **blocking**",
        "- Dropped? — **blocking**",
        "- A prose question.",
      ].join("\n"),
    );
  });
});
