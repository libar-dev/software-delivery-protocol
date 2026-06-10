import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  createReader,
  extract,
  pack,
  packId,
  refines,
  renderDesignReview,
  spec,
  specId,
} from "../src/index.js";
import type { DesignReviewPage } from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));
const goldenRoot = fileURLToPath(
  new URL("./fixtures/checkout-v1/expected-design-review", import.meta.url),
);

const examplePages = renderDesignReview(createReader(extract({ root: exampleRoot }).graph));

function pageByPath(pages: readonly DesignReviewPage[], path: string): string {
  const page = pages.find((entry) => entry.path === path);

  if (page === undefined) {
    throw new Error(`The rendered view is missing the page "${path}".`);
  }

  return page.content;
}

function readGoldenPages(directory: string, prefix = ""): Map<string, string> {
  const pages = new Map<string, string>();

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = prefix === "" ? entry.name : `${prefix}/${entry.name}`;

    if (entry.isDirectory()) {
      for (const [childPath, content] of readGoldenPages(join(directory, entry.name), path)) {
        pages.set(childPath, content);
      }
      continue;
    }

    pages.set(path, readFileSync(join(directory, entry.name), "utf8"));
  }

  return pages;
}

describe("the Design Review — the one generated read-only view", () => {
  it("golden correctness oracle: the renderer produces the right view, page set and bytes", () => {
    const golden = readGoldenPages(goldenRoot);

    expect(examplePages.map((page) => page.path)).toEqual([...golden.keys()].sort());

    for (const page of examplePages) {
      expect(
        page.content,
        `Golden view mismatch at "${page.path}". Review the diff against test/fixtures/checkout-v1/expected-design-review/; if the change is intended, regenerate the golden and commit the reviewed diff — the diff is the review.`,
      ).toBe(golden.get(page.path));
    }
  });

  it("re-rendering from the same graph is byte-identical (a pure projection)", () => {
    const again = renderDesignReview(createReader(extract({ root: exampleRoot }).graph));

    expect(again).toEqual(examplePages);
  });

  it("speaks binding language, never liveness: bindings present/none, observation not tracked", () => {
    const createOrder = pageByPath(examplePages, "spec/orders.create-order.md");

    expect(createOrder).toContain("- Implementation binding: **present**");
    expect(createOrder).toContain("- Verifier binding: **present**");
    expect(createOrder).toContain("- Runtime observation: **not tracked**");

    const decision = pageByPath(examplePages, "spec/decisions.order-lifecycle.md");
    expect(decision).toContain("- Implementation binding: **none**");
    // The internal fact names never leak into the rendered prose (the view-label rule, MD-7):
    // `implemented` would read as liveness; the view says "binding: present" instead.
    expect(createOrder).not.toContain("`implemented`");
  });

  it("distinguishes the enabled verifier from the unenabled one — the claim cues travel along", () => {
    const createOrder = pageByPath(examplePages, "spec/orders.create-order.md");

    expect(createOrder).toContain(
      "`spec:orders.create-order.valid-cart` — Valid cart creates an order",
    );
    expect(createOrder).toContain("**enabled** (a resolving test anchor binds this example)");
    expect(createOrder).toContain(
      "**not enabled** (no test anchor binds this example — it confers no verifier binding)",
    );
    expect(createOrder).toContain("`[anchored]`");
    expect(createOrder).toContain("`[declared]`");
  });

  it("renders the standing warning in context — the teaching surface, on both involved pages", () => {
    const invalidCart = pageByPath(examplePages, "spec/orders.create-order.invalid-cart.md");
    const createOrder = pageByPath(examplePages, "spec/orders.create-order.md");
    const index = pageByPath(examplePages, "index.md");

    for (const content of [invalidCart, createOrder, index]) {
      expect(content).toContain("conformance/verifies-linkage");
    }
  });

  it("shows what a verifier covers on its own page (JS-G2: from the test back to the spec)", () => {
    const validCart = pageByPath(examplePages, "spec/orders.create-order.valid-cart.md");

    expect(validCart).toContain("verifies → [`spec:orders.create-order`](orders.create-order.md)");
    expect(validCart).toContain("the enabled verifying binding (a resolving test anchor)");
    expect(validCart).toContain("test/orders/create-order.valid-cart.test.ts:10");
  });

  it("renders the pack as a review unit with the verifier gaps surfaced", () => {
    const packPage = pageByPath(examplePages, "pack/checkout-v1.md");

    expect(packPage).toContain("## Members");
    expect(packPage).toContain("## Verifier coverage gaps");
    expect(packPage).toContain("states no truth of its own");
  });

  it("raises the derived-readiness banner only in the dishonest direction", () => {
    // The honest divergence the example carries everywhere: stated `defined`, floor reached
    // `ready` — informative header text, never a banner (the floor is not a quota).
    const createOrder = pageByPath(examplePages, "spec/orders.create-order.md");
    expect(createOrder).toContain(
      "**Readiness:** stated `defined` · structural floor reached: `ready`",
    );
    expect(createOrder).not.toContain("Readiness divergence");

    // The dishonest direction: stated `ready` with a blocking open question caps the floor at
    // `scoped` — the banner names the first unmet clause, and the question renders loud.
    const parent = spec({
      id: specId("spec:orders.order-management"),
      title: "Order management",
      kind: "behavior",
      altitude: "epic",
      readiness: "defined",
      intent: { outcome: "Coordinate the slice." },
      behavior: { rules: ["The slice stays traceable."] },
    });
    const divergent = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total matches cart math",
      kind: "rule",
      altitude: "story",
      readiness: "ready",
      intent: {
        outcome: "Keep totals deterministic.",
        openQuestions: [{ question: "Do bundle discounts apply per line?", blocking: true }],
      },
      behavior: { rules: ["The order total is the sum of all line subtotals."] },
      relations: [refines(specId("spec:orders.order-management"))],
    });
    const graph = deriveFixtureGraph({
      specs: [parent, divergent],
      packs: [
        pack({
          id: packId("pack:checkout-v1"),
          title: "Checkout v1",
          specs: [specId("spec:orders.order-management"), specId("spec:orders.order-total-rule")],
        }),
      ],
    });

    const page = pageByPath(
      renderDesignReview(createReader(graph)),
      "spec/orders.order-total-rule.md",
    );

    expect(page).toContain("**Readiness:** stated `ready` · structural floor reached: `scoped`");
    expect(page).toContain(
      "> **Readiness divergence.** This spec states `ready` but the structural floor reached is `scoped`.",
    );
    expect(page).toContain("First unmet clause: `no-blocking-open-questions`");
    expect(page).toContain("- Do bundle discounts apply per line? — **blocking**");
    // The same divergence is also the floor check's error, rendered in the findings table.
    expect(page).toContain("honesty/readiness-floor");
  });

  it("names an unresolved relation target instead of linking it", () => {
    const dangling = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total matches cart math",
      kind: "rule",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Keep totals deterministic." },
      behavior: { rules: ["The order total is the sum of all line subtotals."] },
      relations: [refines(specId("spec:orders.order-management"))],
    });

    const page = pageByPath(
      renderDesignReview(createReader(deriveFixtureGraph({ specs: [dangling] }))),
      "spec/orders.order-total-rule.md",
    );

    expect(page).toContain("`spec:orders.order-management` — **unresolved** (see findings)");
    expect(page).toContain("conformance/referential-integrity");
  });
});
