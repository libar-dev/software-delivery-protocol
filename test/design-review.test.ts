import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import fs from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

import {
  createReader,
  extract,
  pack,
  packId,
  refines,
  renderDesignReview,
  spec,
  specId,
  specTest,
  testAnchorId,
} from "../src/index.js";
import type { DesignReviewPage, GraphSchema } from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));
const goldenRoot = fileURLToPath(
  new URL("./fixtures/checkout-v1/expected-design-review", import.meta.url),
);

const examplePages = renderDesignReview(createReader(extract({ root: exampleRoot }).graph));
const selfHostingRoot = fileURLToPath(new URL("..", import.meta.url));
const selfHostingPages = renderDesignReview(
  createReader(extract({ root: selfHostingRoot, exclude: ["examples", "explorations"] }).graph),
);

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

function copySelfHostingCorpus(root: string): void {
  for (const directory of ["specs", "src", "test"]) {
    cpSync(join(selfHostingRoot, directory), join(root, directory), { recursive: true });
  }
}

function renderSelfHostingRoot(root: string): readonly DesignReviewPage[] {
  return renderDesignReview(
    createReader(extract({ root, exclude: ["examples", "explorations"] }).graph),
  );
}

function assertNarrativeAndIntent(
  page: string,
  narrative: string,
  intentDescription: string,
): void {
  expect(page).toContain(`## Narrative\n\n${narrative}\n\n**Readiness:**`);
  expect(page).toContain(`## Intent\n\n${intentDescription}\n\n- **outcome:**`);
}

describe("the Design Review — the one generated read-only view", () => {
  it("renders the self-hosting spec narrative from the graph", () => {
    const page = pageByPath(selfHostingPages, "spec/protocol.self-hosting.md");
    const index = pageByPath(selfHostingPages, "index.md");
    const pack = pageByPath(selfHostingPages, "pack/self-hosting-v1.md");

    expect(page).toContain(
      "[specs/protocol/self-hosting.sdp.md](../../../specs/protocol/self-hosting.sdp.md)",
    );
    expect(page).toContain(
      "## Narrative\n\nThe Protocol's own delivery model exercises the same carrier, graph, checks, and projections offered to consumers.\n\n**Readiness:",
    );
    expect(page).toContain("## Intent\n\n- **outcome:");
    expect(index).toContain("schema `0.4.0`");
    expect(pack).toContain(
      "| [`spec:protocol.self-hosting`](../spec/protocol.self-hosting.md) The Protocol authors and validates itself | behavior | epic | defined | ready | none | none |",
    );
  });

  it("renders every owned description as escaped prose and omits absent prose artifacts", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.prose-rendering"),
          title: "Owned prose renders safely",
          narrative: "Narrative stays plain.",
          kind: "behavior",
          altitude: "feature",
          readiness: "idea",
          intent: {
            description: "Escaped `code` | # <tag> > quote",
            outcome: "Render owned prose.",
          },
          behavior: { description: "Behavior description.", rules: ["Keep sections stable."] },
          model: { description: "Model description.", terms: { Spec: "One primitive." } },
          design: { description: "Design description.", layout: "linear" },
          decision: {
            description: "Decision description.",
            context: "A choice needs context.",
            decision: "Render prose from the graph.",
          },
          verification: {
            description: "Verification description.",
            mode: "reviewed",
            criteria: ["Inspect the rendered page."],
          },
          ui: { description: "UI description.", surface: "review" },
        }),
        spec({
          id: specId("spec:orders.without-prose"),
          title: "Absent prose stays absent",
          narrative: "   ",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Render no empty prose artifact." },
        }),
      ],
    });
    const page = pageByPath(
      renderDesignReview(createReader(graph)),
      "spec/orders.prose-rendering.md",
    );
    const withoutProse = pageByPath(
      renderDesignReview(createReader(graph)),
      "spec/orders.without-prose.md",
    );

    expect(page).toContain("## Narrative\n\nNarrative stays plain.\n\n**Readiness:**");
    expect(page).toContain("## Intent\n\nEscaped \\`code\\` \\| \\# &lt;tag&gt; &gt; quote");
    expect(page).toContain("## Behavior\n\nBehavior description.\n\n### Rules");
    expect(page).toContain("## Domain vocabulary\n\nModel description.\n\n| Term | Definition |");
    expect(page).toContain("## Design\n\nDesign description.\n\n```json");
    expect(page).toContain("## Decision\n\nDecision description.\n\n**Context.");
    expect(page).toContain("## Verification intent\n\nVerification description.\n\n- **mode:");
    expect(page).toContain("## Ui\n\nUI description.\n\n```json");
    expect(page).not.toContain('"description"');
    expect(withoutProse).not.toContain("## Narrative");
    expect(withoutProse).not.toContain("\n\n\n\n");
  });

  it("reads no authored Markdown source while projecting graph and Reader values", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.graph-only-prose"),
          title: "Graph-only prose",
          narrative: "The reader owns this value.",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: { description: "The renderer must not reopen source.", outcome: "Stay pure." },
        }),
      ],
    });
    const readSpy = vi.spyOn(fs, "readFileSync");

    try {
      const page = pageByPath(
        renderDesignReview(createReader(graph)),
        "spec/orders.graph-only-prose.md",
      );

      expect(page).toContain("The reader owns this value.");
      expect(readSpy.mock.calls.filter(([path]) => String(path).endsWith(".sdp.md"))).toEqual([]);
    } finally {
      readSpy.mockRestore();
    }
  });

  it("renders the committed self-hosting corpus byte-identically at two absolute roots", () => {
    const firstRoot = mkdtempSync(join(tmpdir(), "sdp-review-first-"));
    const secondRoot = mkdtempSync(join(tmpdir(), "sdp-review-second-"));

    try {
      copySelfHostingCorpus(firstRoot);
      copySelfHostingCorpus(secondRoot);

      expect(renderSelfHostingRoot(firstRoot)).toEqual(renderSelfHostingRoot(secondRoot));
    } finally {
      rmSync(firstRoot, { recursive: true, force: true });
      rmSync(secondRoot, { recursive: true, force: true });
    }
  });

  it("rejects swapped prose semantically even when the wrong graph renders deterministically", () => {
    const correct = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.semantic-prose"),
          title: "Semantic prose",
          narrative: "Narrative value.",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: { description: "Intent description.", outcome: "Preserve ownership." },
        }),
      ],
    });
    const swapped = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.semantic-prose"),
          title: "Semantic prose",
          narrative: "Intent description.",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: { description: "Narrative value.", outcome: "Preserve ownership." },
        }),
      ],
    });
    const correctPage = pageByPath(
      renderDesignReview(createReader(correct)),
      "spec/orders.semantic-prose.md",
    );
    const firstWrongPage = pageByPath(
      renderDesignReview(createReader(swapped)),
      "spec/orders.semantic-prose.md",
    );
    const secondWrongPage = pageByPath(
      renderDesignReview(createReader(swapped)),
      "spec/orders.semantic-prose.md",
    );

    assertNarrativeAndIntent(correctPage, "Narrative value.", "Intent description.");
    expect(firstWrongPage).toBe(secondWrongPage);
    expect(() => {
      assertNarrativeAndIntent(firstWrongPage, "Narrative value.", "Intent description.");
    }).toThrow();
  });

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

  it("renders byte-identically when graph and dynamic-key insertion orders differ", () => {
    const first = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.dynamic-order"),
          title: "Dynamic order",
          kind: "model",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Render dynamic fields deterministically." },
          model: { terms: { Zebra: "Last term.", Alpha: "First term." } },
          design: { zeta: "last value", alpha: "first value" },
        }),
        spec({
          id: specId("spec:orders.peer"),
          title: "Peer",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Vary graph node insertion order." },
        }),
      ],
    });
    const permuted = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.peer"),
          title: "Peer",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Vary graph node insertion order." },
        }),
        spec({
          id: specId("spec:orders.dynamic-order"),
          title: "Dynamic order",
          kind: "model",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Render dynamic fields deterministically." },
          model: { terms: { Alpha: "First term.", Zebra: "Last term." } },
          design: { alpha: "first value", zeta: "last value" },
        }),
      ],
    });

    const firstPages = renderDesignReview(createReader(first));
    const permutedPages = renderDesignReview(createReader(permuted));

    expect(permutedPages).toEqual(firstPages);
  });

  it("escapes Markdown text fields while preserving fenced JSON data", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.escaping"),
          title: "Render <tag> & fields",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Keep <outcome> & visible." },
          behavior: { rules: ["Keep <rule> & stable."] },
          model: { terms: { "<Term> &": "Define <term> & safely." } },
          design: { surface: "Review <design> & safely." },
          verification: {
            mode: "reviewed",
            criteria: ["Inspect <criterion> & output."],
          },
        }),
      ],
    });

    const page = pageByPath(renderDesignReview(createReader(graph)), "spec/orders.escaping.md");

    expect(page).toContain("# Render &lt;tag&gt; &amp; fields");
    expect(page).toContain("- **outcome:** Keep &lt;outcome&gt; &amp; visible.");
    expect(page).toContain("- Keep &lt;rule&gt; &amp; stable.");
    expect(page).toContain("| &lt;Term&gt; &amp; | Define &lt;term&gt; &amp; safely. |");
    expect(page).toContain('"surface": "Review <design> & safely."');
    expect(page).toContain("- Inspect &lt;criterion&gt; &amp; output.");
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

  it("locates findings from the structured fields — the Where column (line-free for a Primitive)", () => {
    const index = pageByPath(examplePages, "index.md");

    expect(index).toContain("| Severity | Check | Message | Where |");
    // The standing warning's subject is a spec file: `file` known, no line (Primitive nodes are
    // line-free by design), and the location is never embedded in the message a second time.
    expect(index).toContain("| `specs/orders/create-order-invalid-cart.sdp.md` |");
  });

  it("shows what a verifier covers on its own page (JS-G2: from the test back to the spec)", () => {
    const validCart = pageByPath(examplePages, "spec/orders.create-order.valid-cart.md");

    expect(validCart).toContain("verifies → [`spec:orders.create-order`](orders.create-order.md)");
    expect(validCart).toContain("the enabled verifying binding (a resolving test anchor)");
    expect(validCart).toContain("test/orders/create-order.valid-cart.test.ts:13");
  });

  it("renders bound example steps naturally while preserving typed parent vocabulary", () => {
    const validCart = pageByPath(examplePages, "spec/orders.create-order.valid-cart.md");
    const parent = pageByPath(examplePages, "spec/orders.create-order.md");

    expect(validCart).toContain("a customer has a cart with 2 line items");
    expect(validCart).not.toContain("a customer has a cart with {n: 2} line items");
    expect(parent).toContain("a customer has a cart with {n:number} line items");
  });

  it("renders a test-anchor verifier as the enabled binding only along its contract row", () => {
    // The enabled rendering, pinned over the example graph (a resolving test anchor)...
    const validCart = pageByPath(examplePages, "spec/orders.create-order.valid-cart.md");
    expect(validCart).toContain("the enabled verifying binding (a resolving test anchor)");

    // ...and the not-enabled one over a foreign graph: a declared-claim verifies edge from an
    // Anchor node is off-contract (`03` §1: a test anchor's verifies edge is `anchored`) — it
    // confers no verifier binding, and the enabled-binding line must not render beside it.
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.create-order.valid-cart"),
          title: "Valid cart creates an order",
          kind: "example",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Verify the happy path." },
        }),
      ],
      anchors: [
        specTest({
          id: testAnchorId("test:orders.create-order.valid-cart"),
          verifies: specId("spec:orders.create-order.valid-cart"),
        }),
      ],
    });
    const foreign: GraphSchema = {
      ...graph,
      edges: graph.edges.map((edge) =>
        edge.type === "verifies" ? { ...edge, claim: "declared" } : edge,
      ),
    };

    const page = pageByPath(
      renderDesignReview(createReader(foreign)),
      "spec/orders.create-order.valid-cart.md",
    );

    expect(page).toContain("- Verifier binding: **none**");
    expect(page).toContain(
      "**not enabled** (an off-contract `verifies` edge — it confers no verifier binding)",
    );
    expect(page).not.toContain("the enabled verifying binding");
  });

  it("names the off-contract claim, never a missing anchor, when a bound example's edge is off-contract", () => {
    // A resolving test anchor binds the example, but its own verifies edge rides an inferred
    // claim — blaming a missing anchor would send the reader hunting for one that exists.
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.create-order"),
          title: "Create order",
          kind: "behavior",
          altitude: "feature",
          readiness: "idea",
          intent: { outcome: "Turn a valid cart into an order." },
        }),
        spec({
          id: specId("spec:orders.create-order.valid-cart"),
          title: "Valid cart creates an order",
          kind: "example",
          altitude: "story",
          readiness: "idea",
          intent: { outcome: "Verify the happy path." },
        }),
      ],
      anchors: [
        specTest({
          id: testAnchorId("test:orders.create-order.valid-cart"),
          verifies: specId("spec:orders.create-order.valid-cart"),
        }),
      ],
    });
    const foreign: GraphSchema = {
      ...graph,
      edges: [
        ...graph.edges,
        {
          from: "spec:orders.create-order.valid-cart",
          type: "verifies",
          to: "spec:orders.create-order",
          claim: "inferred",
        },
      ],
    };

    const page = pageByPath(
      renderDesignReview(createReader(foreign)),
      "spec/orders.create-order.md",
    );

    expect(page).toContain(
      "**not enabled** (an off-contract `verifies` edge — it confers no verifier binding)",
    );
    expect(page).not.toContain("no test anchor binds this example");
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
