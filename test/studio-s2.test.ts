import {
  ref,
  specTest,
  specOracle,
  testAnchorId,
  oracleAnchorId,
} from "@libar-dev/software-delivery-protocol";

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "../src/projections/studio/pages/index.js";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  SpecPageConditions,
  SpecPageOutcome,
} from "../generated/contracts/consumers.spec-studio.spec-page.space.js";
import type {
  VerificationPanelsConditions,
  VerificationPanelsOutcome,
} from "../generated/contracts/consumers.spec-studio.verification-panels.space.js";
import { registerCitedDeclaration } from "./consumers.spec-studio.spec-page.cited-declaration.test.generated.js";
import { registerRuleCoverage } from "./consumers.spec-studio.verification-panels.rule-coverage.test.generated.js";
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "sdp-s2-"));
  roots.push(root);
  for (const [path, value] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), value);
  }
  return createReader(extract({ root }).graph);
}
function carrier(id: string, kind: string, relations: string, body: string) {
  return `---\nid: ${id}\nkind: ${kind}\naltitude: story\nreadiness: defined\nrelations: ${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Read the Spec.\n${body}`;
}
async function pages(files: Record<string, string>) {
  return renderStudio(await createStudioData(fixture(files)));
}
function entry(page: string, key: string) {
  return (
    new RegExp(`<div class="entry" id="${key.replaceAll(".", "\\.")}"[^>]*>(.*?)</div>`, "su").exec(
      page,
    )?.[1] ?? ""
  );
}
const citationsOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-citations"),
  models: ref("spec:consumers.spec-studio.spec-page"),
});
void citationsOracle;
interface CitationWorld {
  point: Partial<SpecPageConditions>;
  page?: string;
}
const cited = specTest({
  id: testAnchorId("test:protocol.studio-cited-declaration"),
  verifies: ref("spec:consumers.spec-studio.spec-page.cited-declaration"),
});
void cited;
registerCitedDeclaration<CitationWorld>({
  createWorld: (point) => ({ point }),
  invoke: async (w) => {
    const test = [
      "/**",
      " * @sdpAnchor test:orders",
      " * @sdpVerifies spec:orders",
      " */",
      "export const check=1;",
      ...Array.from({ length: Math.max(0, (w.point.line ?? 0) - 6) }, () => ""),
      "// spec:orders#design.first",
    ].join("\n");
    w.page =
      (
        await pages({
          "orders.sdp.md": carrier(
            "spec:orders",
            "behavior",
            "{}",
            "\n## Behavior\n- rule: Orders work.\n\n## Design\n- first: `First` declaration.\n- second: `Second` declaration.\n",
          ),
          [w.point.file ?? "test/unknown.ts"]: test,
        })
      ).find((p) => p.path === "specs/orders.html")?.content ?? "";
  },
  expected: (p): SpecPageOutcome =>
    p.file === undefined || p.line === undefined
      ? unspecified
      : {
          kind: "beside the first declaration the page lists {cited}",
          cited: `${p.file}:${String(p.line)}`,
        },
  observe: (w): SpecPageOutcome => ({
    kind: "beside the first declaration the page lists {cited}",
    cited:
      /<code>(test\/orders\.test\.ts:\d+)<\/code>/u.exec(
        entry(w.page ?? "", "design.first"),
      )?.[1] ?? "",
  }),
  assertions: (w) => {
    expect(entry(w.page ?? "", "design.first")).toContain("<code>test:orders</code>");
    expect(entry(w.page ?? "", "design.second")).toContain(
      paramsForStep(
        citedDeclarationContract,
        "beside the second declaration the page reads {uncited}",
      ).uncited,
    );
  },
});
const coverageOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-rule-coverage"),
  models: ref("spec:consumers.spec-studio.verification-panels"),
});
void coverageOracle;
interface CoverageWorld {
  point: Partial<VerificationPanelsConditions>;
  page?: string;
}
function coverageFiles(p: Partial<VerificationPanelsConditions>): Record<string, string> {
  return {
    "parent.sdp.md": carrier(
      "spec:orders",
      "behavior",
      "{}",
      `\n## Behavior\n- rule: [#${p.exercisedKey ?? "paid"}] Paid.\n- flow: [#${p.otherKey ?? "refunded"}] Refunded.\n- rule: Unkeyed.\n\n## Example space\n\`\`\`gwt-vocabulary\nGiven status {status:"paid"|"refunded"}\nWhen it runs {amount:number}\nThen it works\n\`\`\`\n`,
    ),
    "child.sdp.md": carrier(
      "spec:orders.example",
      "example",
      `\n  refines: spec:orders\n  verifies:\n    target: spec:orders\n    exercises: [${p.exercisedKey ?? "paid"}]`,
      '\n```gwt\nGiven status {status: "paid"}\nWhen it runs {amount: 2}\nThen it works\n```\n',
    ),
    "test/orders.test.ts":
      "/**\n * @sdpAnchor test:orders.example\n * @sdpVerifies spec:orders.example\n */\nexport const check=1;\n",
  };
}
const coverageExampleAnchor = specTest({
  id: testAnchorId("test:protocol.studio-rule-coverage"),
  verifies: ref("spec:consumers.spec-studio.verification-panels.rule-coverage"),
});
void coverageExampleAnchor;
registerRuleCoverage<CoverageWorld>({
  createWorld: (point) => ({ point }),
  invoke: async (w) => {
    w.page =
      (await pages(coverageFiles(w.point))).find((p) => p.path === "specs/orders.html")?.content ??
      "";
  },
  expected: (p): VerificationPanelsOutcome =>
    p.exercisedKey === undefined || p.otherKey === undefined
      ? unspecified
      : {
          kind: "beside the first rule the panel lists the example as {enabledWords}",
          enabledWords: "enabled",
        },
  observe: (w): VerificationPanelsOutcome => ({
    kind: "beside the first rule the panel lists the example as {enabledWords}",
    enabledWords: entry(w.page ?? "", `rule.${w.point.exercisedKey ?? ""}`).includes(" · enabled")
      ? "enabled"
      : "not enabled",
  }),
  assertions: (w) => {
    expect(entry(w.page ?? "", `rule.${w.point.exercisedKey ?? ""}`)).toContain(
      'href="orders.example.html"',
    );
    expect(entry(w.page ?? "", `rule.${w.point.otherKey ?? ""}`)).toContain(
      paramsForStep(ruleCoverageContract, "beside the second rule the panel reads {unexercised}")
        .unexercised,
    );
    expect(w.page).toContain("1 unkeyed rule");
  },
});
const panels = specTest({
  id: testAnchorId("test:protocol.studio-panels"),
  verifies: [
    ref("spec:consumers.spec-studio.spec-page"),
    ref("spec:consumers.spec-studio.verification-panels"),
    ref("spec:consumers.spec-studio.pack-page.maturity-map"),
  ],
});
void panels;
describe("Spec panels", () => {
  it("renders the five open panels in order, the space, bound values, absent evidence, and empty composing slots", async () => {
    const page =
      (await pages(coverageFiles({}))).find((p) => p.path === "specs/orders.html")?.content ?? "";
    const ids = ["verification", "design-view", "runtime", "evidence", "impact"];
    let last = page.indexOf('id="section.behavior"');
    for (const id of ids) {
      const at = page.indexOf(`id="panel.${id}" open`);
      expect(at).toBeGreaterThan(last);
      last = at;
    }
    expect(last).toBeLessThan(page.indexOf('id="relations"'));
    for (const words of [
      "Executable Spec",
      "status",
      "refunded",
      "no example",
      "not enumerable",
      "Unbound",
      "Oracle binding: none",
      "Build attestations: not tracked",
      "Deployments: not tracked",
      "Bills of materials: not tracked",
    ])
      expect(page).toContain(words);
    expect(page).toContain('<sdp-example-space spec-id="spec:orders">');
    expect(page).toContain(
      '<sdp-compose scope="spec:orders.example" action="edit-example"></sdp-compose>',
    );
    expect(page).not.toContain("passed");
    const idsInPage = [...page.matchAll(/\sid="([^"]+)"/gu)].map((m) => m[1]);
    expect(idsInPage).toEqual([...new Set(idsInPage)]);
  });
  it("gives keyed terms address ids, source lines, and citations while hiding termKeys metadata", async () => {
    const page =
      (
        await pages({
          "model.sdp.md": carrier(
            "spec:terms",
            "model",
            "{}",
            "\n## Model\n- **Order** — [#order] A purchase.\n",
          ),
          "cite.ts":
            "/**\n * @sdpAnchor impl:terms\n */\n// spec:terms#term.order\nexport const x=1;",
        })
      ).find((p) => p.path === "specs/terms.html")?.content ?? "";
    expect(page).toContain('id="term.order"');
    expect(page).toContain('text="spec:terms#term.order"');
    expect(page).toContain("line 14");
    expect(page).toContain("cite.ts:4");
    expect(page).not.toContain("<dt>termKeys</dt>");
  });
  it("places resolved Pack members in stated/floor cells in authored order", async () => {
    const files = coverageFiles({});
    files["another.sdp.md"] = carrier(
      "spec:another",
      "behavior",
      "{}",
      "\n## Behavior\n- rule: Another.\n",
    );
    files["pack.pack.sdp.md"] =
      "---\nid: pack:orders\nspecs: [spec:another, spec:orders, spec:orders.example, spec:missing]\n---\n# Orders\n";
    const page = (await pages(files)).find((p) => p.path === "packs/orders.html")?.content ?? "";
    expect(page).toContain('<sdp-maturity-map pack-id="pack:orders">');
    const map = page.split("<sdp-maturity-map")[1]?.split("</sdp-maturity-map>")[0] ?? "";
    expect(map).toContain("stated defined");
    expect(map).toContain("floor none");
    expect(map.indexOf('href="#spec:another"')).toBeLessThan(map.indexOf('href="#spec:orders"'));
    expect(map).not.toContain("spec:missing");
    expect(page).toContain('<sdp-spec-card spec-id="spec:orders" variant="full">');
  });
});

import { paramsForStep } from "./helpers/generated-contract.js";
import { citedDeclarationContract } from "../generated/contracts/consumers.spec-studio.spec-page.cited-declaration.contract.js";
import { ruleCoverageContract } from "../generated/contracts/consumers.spec-studio.verification-panels.rule-coverage.contract.js";

describe("Structural panels and targets", () => {
  it("renders source locations, component links, decisions and transitive impact by distance", async () => {
    const files = coverageFiles({});
    files["parent.sdp.md"] =
      files["parent.sdp.md"]?.replace("relations: {}", "relations:\n  decidedBy: spec:decision") ??
      "";
    files["decision.sdp.md"] = carrier(
      "spec:decision",
      "decision",
      "{}",
      "\n## Decision\n- context: Pick a form.\n- decision: Use the recorded structure.\n",
    );
    files["dependent.sdp.md"] = carrier(
      "spec:dependent",
      "behavior",
      "\n  dependsOn: spec:orders",
      "\n## Behavior\n- rule: Follow orders.\n",
    );
    files["transitive.sdp.md"] = carrier(
      "spec:transitive",
      "behavior",
      "\n  dependsOn: spec:dependent",
      "\n## Behavior\n- rule: Follow the dependent.\n",
    );
    files["units.ts"] =
      "/**\n * @sdpAnchor component:orders\n * @sdpLayer application\n * @sdpContext orders\n */\nexport const component=1;\n/**\n * @sdpAnchor impl:orders\n * @sdpSatisfies spec:orders\n * @sdpComponent component:orders\n * @sdpUses impl:repository\n */\nexport const orders=1;\n/**\n * @sdpAnchor impl:repository\n */\nexport const repository=1;\n/**\n * @sdpAnchor component:dependent\n * @sdpSatisfies spec:dependent\n */\nexport const dependent=1;\n";
    const page = (await pages(files)).find((p) => p.path === "specs/orders.html")?.content ?? "";
    const runtime = page.split('id="panel.runtime"')[1]?.split('id="panel.evidence"')[0] ?? "";
    expect(runtime).toContain('href="../architecture.html#component:orders"');
    expect(runtime).toContain("layer application");
    expect(runtime).toContain("context orders");
    expect(runtime).toContain("units.ts:14");
    expect(runtime).toContain('text="units.ts:14"');
    expect(page).toContain("Use the recorded structure.");
    expect([...page.matchAll(/<sdp-diagram subject="spec:orders">/gu)]).toHaveLength(2);
    expect(page).toContain("Realization of spec:orders</figcaption>");
    const impact = page.split('id="panel.impact"')[1] ?? "";
    expect(impact).toContain("Distance 1");
    expect(impact).toContain("Distance 2");
    expect(impact.indexOf("Distance 1")).toBeLessThan(impact.indexOf("Distance 2"));
    expect(impact).toContain("component:dependent");
    expect(impact).toContain('href="../architecture.html#component:dependent"');
    expect(page).not.toContain("file://");
    expect(page).not.toContain("vscode:");
  });
  it("states absence on unwritten examples and unset constraint targets", async () => {
    const files = coverageFiles({});
    files["unwritten.sdp.md"] = carrier(
      "spec:unwritten",
      "example",
      "\n  refines: spec:orders\n  verifies: spec:orders",
      "",
    );
    files["parent.sdp.md"] =
      (files["parent.sdp.md"] ?? "") +
      "\n## Constraints\n- statement: Respond promptly.\n- flavor: performance\n- measurableBy: A latency probe.\n";
    const page = (await pages(files)).find((p) => p.path === "specs/orders.html")?.content ?? "";
    expect(page).toContain("No given, when and then steps recorded.");
    expect(page).toContain(
      '<sdp-compose scope="spec:unwritten" action="propose-example"></sdp-compose>',
    );
    expect(page).toContain("No target recorded.");
    expect(page).toContain("A latency probe.");
    expect(page).toContain('action="propose-target"');
    expect(page).toContain("<dt>Measured value</dt><dd>not tracked</dd>");
  });
});

it("renders verifying examples for a Model without Behavior and keeps short cards to their summary", async () => {
  const files = coverageFiles({});
  files["parent.sdp.md"] = carrier(
    "spec:orders",
    "model",
    "{}",
    "\n## Model\n- **Order** — A purchase.\n",
  );
  const page = (await pages(files)).find((p) => p.path === "specs/orders.html")?.content ?? "";
  expect(page).toContain("Verifying examples");
  expect(page).toContain("Given status {status: &quot;paid&quot;}");
  const short =
    /<sdp-spec-card spec-id="spec:orders.example" variant="short">(.*?)<\/sdp-spec-card>/su.exec(
      page,
    )?.[1] ?? "";
  expect(short).toContain("badge rung-defined");
  expect(short).toContain('class="floor"');
  expect(short).not.toContain("<pre>");
  expect(short).not.toContain("<article");
  expect(short).not.toContain("sdp-compose");
});
it("keeps example steps and composing actions outside a short Spec card", async () => {
  const page =
    (await pages(coverageFiles({}))).find((p) => p.path === "specs/orders.html")?.content ?? "";
  const short =
    /<sdp-spec-card spec-id="spec:orders.example" variant="short">(.*?)<\/sdp-spec-card>/su.exec(
      page,
    )?.[1] ?? "";
  expect(short).toContain("badge rung-defined");
  expect(short).not.toContain("<pre>");
  expect(short).not.toContain("<article");
  expect(short).not.toContain("sdp-compose");
});
