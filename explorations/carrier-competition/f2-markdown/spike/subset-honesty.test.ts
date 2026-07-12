// The spike's honesty law under test: it "throws on anything outside the subset so the exhibit
// cannot silently accept more grammar than it demonstrates" (micro-yaml.ts). These pins cover
// the forms where a keyed or replaced assignment would otherwise LOSE authored content with no
// finding — duplicate frontmatter keys, repeated section headings, repeated fences. Each must
// refuse loudly; last-wins is the one behavior the spike may never have. (A product parser
// would emit extract/* findings instead of throwing — the spike is evidence, never product.)
import { expect, test } from "vitest";

import { reifyMarkdown } from "./md-reify.js";

function doc(frontmatter: string, body: string): string {
  return `---\n${frontmatter}\n---\n# Probe\n${body}`;
}

const envelope = [
  "id: spec:orders.probe",
  "kind: example",
  "altitude: story",
  "readiness: idea",
  "relations:",
  "  refines: spec:orders.create-order",
].join("\n");

test("a duplicate relation type refuses instead of keeping only the last target", () => {
  const duplicated = `${envelope}\n  refines: spec:orders.order-management`;

  expect(() => reifyMarkdown(doc(duplicated, ""), "probe.sdp.md")).toThrow(
    /duplicate relation type "refines"/u,
  );
});

test("a duplicate scalar envelope field refuses instead of keeping only the last value", () => {
  const duplicated = `${envelope}\nreadiness: ready`;

  expect(() => reifyMarkdown(doc(duplicated, ""), "probe.sdp.md")).toThrow(
    /duplicate envelope field "readiness"/u,
  );
});

test('a repeated "relations" key refuses', () => {
  const duplicated = `${envelope}\nrelations:\n  verifies: spec:orders.create-order`;

  expect(() => reifyMarkdown(doc(duplicated, ""), "probe.sdp.md")).toThrow(
    /duplicate "relations" key/u,
  );
});

test("a second gwt fence refuses instead of silently dropping the first scenario", () => {
  const body = [
    "```gwt",
    "Given a first authored scenario",
    "```",
    "",
    "```gwt",
    "Given a second authored scenario",
    "```",
  ].join("\n");

  expect(() => reifyMarkdown(doc(envelope, body), "probe.sdp.md")).toThrow(
    /multiple gwt fences/u,
  );
});

test("a second gwt-vocabulary fence refuses instead of silently replacing the example space", () => {
  const body = [
    "```gwt-vocabulary",
    "Given a cart with {n:number} line items",
    "```",
    "",
    "```gwt-vocabulary",
    "Given a cart with {m:number} line items",
    "```",
  ].join("\n");

  expect(() => reifyMarkdown(doc(envelope, body), "probe.sdp.md")).toThrow(
    /multiple gwt-vocabulary fences/u,
  );
});

test("a repeated section heading refuses instead of shadowing the first section's content", () => {
  const body = [
    "## Intent",
    "",
    "- outcome: The first authored outcome.",
    "",
    "## Intent",
    "",
    "- outcome: The outcome that would silently win.",
  ].join("\n");

  expect(() => reifyMarkdown(doc(envelope, body), "probe.sdp.md")).toThrow(
    /duplicate section heading "## Intent"/u,
  );
});

test("two Verification sections with different modes refuse (prefix-matched, so not a duplicate heading)", () => {
  const body = [
    "## Verification — executable",
    "",
    "- The first criteria list.",
    "",
    "## Verification — manual",
    "",
    "- The criteria list that would silently be ignored.",
  ].join("\n");

  expect(() => reifyMarkdown(doc(envelope, body), "probe.sdp.md")).toThrow(
    /multiple Verification sections/u,
  );
});
