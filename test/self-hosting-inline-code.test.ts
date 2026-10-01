import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, expect } from "vitest";
import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  InlineCodeSpansConditions,
  InlineCodeSpansOutcome,
} from "../generated/contracts/carrier.inline-code-spans.space.js";
import { createReader, extract } from "../src/index.js";
import type { ExtractionResult } from "../src/index.js";
import { renderDesignReview } from "../src/projections/design-review.js";
import { renderGherkinView } from "../src/projections/gherkin-view.js";
import { registerNarrative } from "./carrier.inline-code-spans.narrative.test.generated.js";
import { registerDescription } from "./carrier.inline-code-spans.description.test.generated.js";
import { registerList } from "./carrier.inline-code-spans.list.test.generated.js";
import { registerPack } from "./carrier.inline-code-spans.pack.test.generated.js";

const OUTCOME =
  "matched spans preserve {accepted} carriers and exposed HTML refuses {refused} carriers";
const locations = ["narrative", "description", "list", "pack"] as const;
type Location = (typeof locations)[number];

// Expected acceptance is authored here, independently of the scanner.
const probes = [
  { text: "Use `Promise<T>`.", accepted: true },
  { text: "Use ``Promise<T> `x` ``.", accepted: true },
  { text: "Use `Promise<T> `` x`.", accepted: true },
  { text: "Use ``Promise<T> ``` x ``.", accepted: true },
  { text: "Use ```Promise<T> `` x```.", accepted: true },
  { text: "Use `one` and `Promise<T>`.", accepted: true },
  { text: "Use `unmatched ``Promise<T>``.", accepted: true },
  { text: "Use `<!-- --> <!DOCTYPE html> <?xml?> <T> </T> | # {x}`.", accepted: true },
  { text: "`Promise<T>` is literal.", accepted: true },
  { text: "``Promise<T>`` is literal.", accepted: true },
  { text: "Use a < b and Promise<T.", accepted: true },
  { text: "Use Promise<T>.", accepted: false },
  { text: "Use `Promise<T>.", accepted: false },
  { text: "Use ``Promise<T> `.", accepted: false },
  { text: "Use `Promise<T> ``.", accepted: false },
  { text: "Use `one` and `Promise<T>.", accepted: false },
  { text: "Use ``one`` and `Promise<T>``.", accepted: false },
  { text: "Use `literal` <br>.", accepted: false },
  { text: "Use <br> `literal`.", accepted: false },
  { text: "Use `literal` <br> `other`.", accepted: false },
  { text: "Use <T title=`value`>.", accepted: false },
  { text: "Use </T>.", accepted: false },
  { text: "Use <!--.", accepted: false },
  { text: "Use -->.", accepted: false },
  { text: "Use <!DOCTYPE.", accepted: false },
  { text: "Use <?xml.", accepted: false },
] as const;

const inlineCodeOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.inline-code-spans"),
  label: "expected inline code outcome by authored location",
  models: ref("spec:carrier.inline-code-spans"),
});
void inlineCodeOracleAnchor;

function expectedInlineCodeOutcome(
  point: Partial<InlineCodeSpansConditions>,
): InlineCodeSpansOutcome {
  return locations.some((location) => location === point.location)
    ? { kind: OUTCOME, accepted: 11, refused: 15 }
    : unspecified;
}

interface Probe {
  readonly id: string;
  readonly file: string;
  readonly line: number;
  readonly text: string;
  readonly accepted: boolean;
}
interface World {
  readonly root: string;
  readonly location: Location;
  readonly probes: readonly Probe[];
  result?: ExtractionResult;
}
const roots = new Set<string>();
afterEach(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
  roots.clear();
});

function createWorld(point: Partial<InlineCodeSpansConditions>): World {
  const location = locations.find((candidate) => candidate === point.location);
  if (location === undefined) throw new Error(`Unknown probe location: ${String(point.location)}`);
  const root = mkdtempSync(join(tmpdir(), "sdp-inline-code-"));
  roots.add(root);
  const carriers = probes.map((probe, index) => {
    const id = `${location === "pack" ? "pack" : "spec"}:probe.case-${String(index)}`;
    const file = `case-${String(index)}${location === "pack" ? ".pack" : ""}.sdp.md`;
    const envelope =
      location === "pack"
        ? `---\nid: ${id}\nspecs: []\n---\n# Probe\n\n`
        : `---\nid: ${id}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Probe\n\n`;
    const intent = "## Intent\n- outcome: Carry literal content.\n\n";
    const source =
      location === "narrative"
        ? `${envelope}${probe.text}\n\n${intent}`
        : location === "description"
          ? `${envelope}${intent}## Behavior\n${probe.text}\n`
          : location === "list"
            ? `${envelope}${intent}## Behavior\n- rule: ${probe.text}\n`
            : `${envelope}${probe.text}\n`;
    writeFileSync(join(root, file), source);
    return {
      ...probe,
      id,
      file,
      line: source.split("\n").findIndex((line) => line.includes(probe.text)) + 1,
    };
  });
  return { root, location, probes: carriers };
}

function invoke(world: World): void {
  world.result = extract({ root: world.root });
}

function observe(world: World): InlineCodeSpansOutcome {
  const result = world.result;
  if (result === undefined) throw new Error("The code-span matrix requires extraction.");
  const reader = createReader(result.graph);
  const review = renderDesignReview(reader);
  const gherkin = renderGherkinView(reader);
  for (const probe of world.probes) {
    const node = result.graph.nodes.find((candidate) => candidate.id === probe.id);
    const findings = result.report.findings.filter((finding) => finding.file === probe.file);
    if (!probe.accepted) {
      expect(node, probe.text).toBeUndefined();
      expect(findings, probe.text).toMatchObject([
        {
          validatorId: "extract/invalid-markdown-structure",
          severity: "error",
          message: "raw HTML is unsupported",
          file: probe.file,
          line: probe.line,
        },
      ]);
      expect(findings, probe.text).toHaveLength(1);
      continue;
    }
    expect(findings, probe.text).toEqual([]);
    expect(node, probe.text).toBeDefined();
    const stored =
      world.location === "pack"
        ? reader.packContext(probe.id)?.framing
        : world.location === "narrative"
          ? reader.specContext(probe.id)?.narrative
          : world.location === "description"
            ? reader.specContext(probe.id)?.sections?.behavior?.description
            : reader.specContext(probe.id)?.sections?.behavior?.rules?.[0];
    expect(stored, probe.text).toBe(probe.text);
    // Pin the generic's existing field encodings independently of the renderer helpers.
    if (probe.text === "Use `Promise<T>`.") {
      expect(review.find((page) => page.path.includes("probe.case-0"))?.content).toContain(
        "Use \\`Promise&lt;T&gt;\\`.",
      );
      if (world.location !== "pack") {
        expect(gherkin.find((page) => page.path.includes("probe.case-0"))?.content).toContain(
          "Use `Promise<T>`.",
        );
      }
    }
  }
  return {
    kind: OUTCOME,
    accepted: world.probes.filter((probe) =>
      result.graph.nodes.some((node) => node.id === probe.id),
    ).length,
    refused: result.report.findings.filter(
      (finding) => finding.message === "raw HTML is unsupported",
    ).length,
  };
}

const adapters = { createWorld, invoke, observe, expected: expectedInlineCodeOutcome };

const narrativeTestAnchor = specTest({
  id: testAnchorId("test:protocol.inline-code-spans.narrative"),
  label: "verifies inline code in Spec narrative",
  verifies: ref("spec:carrier.inline-code-spans.narrative"),
});
void narrativeTestAnchor;
registerNarrative(adapters);

const descriptionTestAnchor = specTest({
  id: testAnchorId("test:protocol.inline-code-spans.description"),
  label: "verifies inline code in section descriptions",
  verifies: ref("spec:carrier.inline-code-spans.description"),
});
void descriptionTestAnchor;
registerDescription(adapters);

const listTestAnchor = specTest({
  id: testAnchorId("test:protocol.inline-code-spans.list"),
  label: "verifies inline code in list entries",
  verifies: ref("spec:carrier.inline-code-spans.list"),
});
void listTestAnchor;
registerList(adapters);

const packTestAnchor = specTest({
  id: testAnchorId("test:protocol.inline-code-spans.pack"),
  label: "verifies inline code in Pack framing",
  verifies: ref("spec:carrier.inline-code-spans.pack"),
});
void packTestAnchor;
registerPack(adapters);
