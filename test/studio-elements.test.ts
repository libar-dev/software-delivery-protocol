import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "../src/anchors.js";
import { rowMatches } from "../src/studio-elements/filter.js";
import { searchFragment, searchTerm, searchUrl } from "../src/studio-elements/search.js";
import {
  entryMatches,
  entryUrl,
  resultPage,
  renderResults,
  searchRecords,
  type SearchRecord,
  type SearchEntry,
} from "../src/studio-elements/search-results.js";
import { stampUrl, stampText } from "../src/studio-elements/stamp.js";
import { copyText } from "../src/studio-elements/copy.js";
import { fragmentTarget } from "../src/studio-elements/expander.js";

const anchor = specTest({
  id: testAnchorId("test:protocol.studio-page-elements"),
  verifies: [
    ref("spec:consumers.spec-studio.page-elements"),
    ref("spec:consumers.spec-studio.search"),
  ],
});
void anchor;

const record: SearchRecord = {
  id: "spec:probe.find",
  nodeType: "Primitive",
  page: "specs/probe.find.html",
  title: "Find <script>",
  specKind: "behavior",
  statedReadiness: "defined",
  floorReached: "ready",
  bindings: [],
  sections: { design: { verifyPass: { needle: true }, pin: "`Needle`", str: '{"needle":true}' } },
  entries: [
    {
      section: "design",
      entry: "verifyPass",
      key: "verifyPass",
      address: "spec:probe.find#design.verifyPass",
      line: 9,
      text: '{"needle":true}',
    },
    {
      section: "design",
      entry: "pin",
      key: "pin",
      address: "spec:probe.find#design.pin",
      line: 10,
      text: "`Needle`",
    },
    {
      section: "design",
      entry: "str",
      key: "str",
      address: "spec:probe.find#design.str",
      line: 11,
      text: '{"needle":true}',
    },
  ],
};

const entryAt = (index: number): SearchEntry => {
  const entry = record.entries[index];
  if (entry === undefined) throw new Error("Missing test entry");
  return entry;
};

describe("Studio page interactions", () => {
  it("offers a prompt before searching and puts a real miss before the field list", () => {
    for (const term of ["", "   "]) {
      const html = renderResults([], term, 50);
      expect(html).toContain("Type a word to search.");
      expect(html).toContain("Fields searched:");
      expect(html).not.toMatch(/No node matches|0 nodes/u);
    }
    const miss = renderResults([], "missing <&>", 50);
    expect(miss).toContain("No node matches missing &lt;&amp;&gt;");
    expect(miss.indexOf("No node matches")).toBeLessThan(miss.indexOf("Fields searched:"));
  });
  it("writes singular counts, readable fields, code-span titles and linked entry keys", () => {
    const single: SearchRecord = {
      ...record,
      title: "Use `safe <&>`",
      sections: { design: { aggregateReadModelRebuild: "needle" }, intent: { outcome: "needle" } },
      entries: [
        {
          ...entryAt(1),
          entry: "aggregateReadModelRebuild",
          key: "aggregateReadModelRebuild",
          text: "needle",
        },
      ],
    };
    const html = renderResults(searchRecords({ records: [single] }, "needle"), "needle", 50);
    expect(html).toContain("1 node and 1 entry match");
    expect(html).toContain("Use <code>safe &lt;&amp;&gt;</code>");
    expect(html).toContain("Spec · behavior · stated defined · floor ready");
    expect(html).toContain("Matched in: the Design section, the Intent section");
    expect(html).not.toContain("sections.design");
    expect(html).toContain(
      '<a href="specs/probe.find.html#design.pin"><code>aggregateReadModelRebuild</code></a> · Design · line 10',
    );
  });
  it("cuts long excerpts at word boundaries around the term", () => {
    const long: SearchRecord = {
      ...record,
      narrative: "projection ".repeat(40) + "needle " + "continuation ".repeat(30),
      entries: [],
    };
    const entry = {
      ...entryAt(1),
      section: "narrative",
      address: null,
      text: long.narrative ?? "",
    };
    const html = renderResults(
      [{ record: long, matchedIn: ["narrative"], entries: [entry] }],
      "needle",
      50,
    );
    expect(html).toContain("needle");
    expect(html).not.toMatch(/…(?:rojection|ontinuation)|(?:projectio|continuatio)…/u);
    expect(html).toContain("…projection");
  });
  it("copies the requested text and reports successful clipboard writes", async () => {
    const written: string[] = [];
    const selected: string[] = [];
    expect(
      await copyText(
        "spec:probe.find#design.pin",
        (text) => {
          written.push(text);
          return Promise.resolve();
        },
        (text) => {
          selected.push(text);
        },
      ),
    ).toBe("Copied");
    expect(written).toEqual(["spec:probe.find#design.pin"]);
    expect(selected).toEqual([]);
  });

  it("selects copy text when the clipboard is missing or rejects access", async () => {
    const selected: string[] = [];
    for (const write of [undefined, () => Promise.reject(new Error("Clipboard denied"))]) {
      expect(
        await copyText("copy me", write, (text) => {
          selected.push(text);
        }),
      ).toBe("Text selected. Copy it with your keyboard.");
    }
    expect(selected).toEqual(["copy me", "copy me"]);
  });

  it("decodes entry fragments literally and refuses malformed fragment escapes", () => {
    expect(fragmentTarget("#design.pin")).toBe("design.pin");
    expect(fragmentTarget("#question.%63overage")).toBe("question.coverage");
    expect(fragmentTarget("#%E0%A4")).toBeNull();
    expect(fragmentTarget("#")).toBeNull();
  });

  it("filters all facets together and accepts space-separated row values", () => {
    expect(
      rowMatches(
        { kind: "behavior", packs: "pack:a pack:b" },
        { kind: "behavior", packs: "pack:b" },
      ),
    ).toBe(true);
    expect(rowMatches({ kind: "behavior", packs: "pack:ab" }, { packs: "pack:a" })).toBe(false);
    expect(rowMatches({ kind: "behavior" }, { kind: "any", packs: "any" })).toBe(true);
    expect(rowMatches({ kind: "behavior" }, { kind: "rule" })).toBe(false);
    expect(rowMatches({}, { packs: "pack:a" })).toBe(false);
  });

  it("round-trips term fragments including punctuation, spaces and Unicode", () => {
    for (const term of ["retry worker", "a+b & #?/%", "čitanje", ""]) {
      expect(searchTerm(searchFragment(term))).toBe(term);
      expect(searchUrl("../", term)).toBe(`../search.html${searchFragment(term)}`);
    }
    expect(searchTerm("#other")).toBe("");
    expect(searchTerm("#q=%E0%A4")).toBe("");
    expect(searchTerm("#q=a+b")).toBe("a+b");
  });

  it("matches entry tokens, and non-string values only by their coined key", () => {
    expect(record.entries.map((entry) => entryMatches(record, entry, "needle"))).toEqual([
      false,
      true,
      true,
    ]);
    expect(entryMatches(record, entryAt(0), "verify pass")).toBe(true);
    expect(entryMatches(record, entryAt(0), "verify")).toBe(true);
    expect(entryMatches(record, entryAt(1), "need")).toBe(false);
    expect(entryMatches(record, entryAt(1), "")).toBe(false);
  });

  it("keeps a node whose only match is a tokenized coined entry key", () => {
    const keyed: SearchRecord = {
      ...record,
      sections: { design: { verifyPass: 42 } },
      entries: [{ ...entryAt(0), text: "42" }],
    };
    expect(searchRecords({ records: [keyed] }, "verify pass")).toEqual([
      { record: keyed, matchedIn: ["key"], entries: keyed.entries },
    ]);
  });

  it("reads authored values at most twice per search, regardless of the entry count", () => {
    const count = 128;
    let reads = 0;
    const design: Record<string, unknown> = {};
    const entries = Array.from({ length: count }, (_, index) => {
      const key = `entry${String(index)}`;
      Object.defineProperty(design, key, {
        enumerable: true,
        get: () => {
          reads += 1;
          return "needle";
        },
      });
      return { ...entryAt(1), entry: key, key, text: "needle" };
    });
    const large: SearchRecord = { ...record, sections: { design }, entries };
    for (const term of ["needle", "absent"]) {
      reads = 0;
      const hits = searchRecords({ records: [large] }, term);
      expect(hits.flatMap((hit) => hit.entries)).toHaveLength(term === "needle" ? count : 0);
      expect(reads).toBeLessThanOrEqual(2 * count);
    }
  });

  it("links addressed hits to the entry and other hits to their section or narrative", () => {
    expect(entryUrl(record, entryAt(0))).toBe("specs/probe.find.html#design.verifyPass");
    expect(entryUrl(record, { ...entryAt(0), address: null })).toBe(
      "specs/probe.find.html#section.design",
    );
    expect(entryUrl(record, { ...entryAt(0), section: "narrative", address: null })).toBe(
      "specs/probe.find.html#narrative",
    );
  });

  it("groups entries beneath each node and pages fifty nodes at a time", () => {
    const hits = searchRecords(
      {
        records: Array.from({ length: 103 }, (_, i) => ({
          ...record,
          id: `spec:probe.${String(i).padStart(3, "0")}`,
        })),
      },
      "needle",
    );
    const page = resultPage(hits, 50);
    expect(page.shown).toHaveLength(50);
    expect(page.total).toBe(103);
    expect(page.entryTotal).toBe(206);
    expect(page.remaining).toBe(53);
    expect(resultPage(hits, 100).remaining).toBe(3);
    expect(resultPage(hits, 150).shown).toHaveLength(103);
    expect(hits[0]?.entries).toEqual(record.entries.slice(1));
  });

  it("renders node words, independent rungs, bindings, locations and escaped text", () => {
    const html = renderResults(
      searchRecords(
        {
          records: [
            record,
            {
              id: "pack:probe",
              nodeType: "Pack",
              title: "Needle Pack",
              page: "packs/probe.html",
              bindings: [],
              entries: [],
            },
            {
              id: "impl:probe",
              nodeType: "CodeNode",
              label: "Needle",
              file: "src/Needle.ts",
              line: 7,
              page: null,
              bindings: [{ edge: "satisfies", specId: "spec:probe.Find" }],
              entries: [],
            },
            {
              id: "test:probe",
              nodeType: "Anchor",
              label: "Needle",
              file: "test/probe.ts",
              line: 12,
              page: null,
              bindings: [{ edge: "verifies", specId: "spec:probe.find" }],
              entries: [],
            },
          ],
        },
        "needle",
      ),
      "needle",
      50,
    );
    expect(html).toContain("Spec");
    expect(html).toContain("Pack");
    expect(html).toContain("Code unit");
    expect(html).toContain("Anchor");
    expect(html).toContain("stated defined");
    expect(html).toContain("floor ready");
    expect(html).toContain("src/Needle.ts:7");
    expect(html).toContain('text="src/Needle.ts:7"');
    expect(html).toContain('href="specs/probe._find.html"');
    expect(html).toContain("satisfies");
    expect(html).toContain("Find &lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(renderResults([], "<missing>", 50)).toContain("No node matches");
  });

  it("requests a stamp only over HTTP and HTTPS and shows only its text fields", () => {
    const builtAt = new Date(0).toISOString();
    expect(stampUrl("file:", "../")).toBeNull();
    expect(stampUrl("data:", "")).toBeNull();
    expect(stampUrl("https:", "../")).toBe("../stamp.json");
    expect(stampUrl("http:", "")).toBe("stamp.json");
    expect(
      stampText({
        schemaVersion: "1",
        corpusCommit: "abc",
        engine: "sdp 0.0.0",
        builtAt,
      }),
    ).toBe(`Corpus abc · sdp 0.0.0 · Built ${builtAt}`);
    expect(stampText({ corpusCommit: 4 })).toBe("");
  });

  it("loads the built classic bundle without imports and defines the six elements", () => {
    const bundle = readFileSync(new URL("../dist/studio/studio.js", import.meta.url), "utf8");
    const defined: string[] = [];
    expect(bundle).not.toMatch(/^\s*(?:import|export)\s/mu);
    expect(bundle).not.toMatch(/\b(?:require\(|import\()/u);
    expect(() => {
      runInNewContext(bundle, {
        HTMLElement: class {
          connected = false;
        },
        customElements: {
          get: () => undefined,
          define: (name: string) => {
            defined.push(name);
          },
        },
      });
    }).not.toThrow();
    expect(defined.sort()).toEqual([
      "sdp-copy",
      "sdp-expander",
      "sdp-filter",
      "sdp-search",
      "sdp-search-results",
      "sdp-stamp",
    ]);
  });
  it("names a question copy control with the full entry address and updates it", () => {
    const defined = new Map<
      string,
      new () => FakeNode & {
        connectedCallback(): void;
        attributeChangedCallback(): void;
      }
    >();
    class FakeNode {
      ownerDocument = doc;
      attributes = new Map<string, string>();
      children: FakeNode[] = [];
      parentNode?: FakeNode;
      textContent = "";
      append(node: FakeNode): void {
        node.parentNode = this;
        this.children.push(node);
      }
      getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
      }
      setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
      }
      querySelectorAll(): FakeNode[] {
        return [];
      }
      addEventListener(): void {
        /* No click is needed to inspect the accessible name. */
      }
    }
    const doc = { createElement: () => new FakeNode() };
    runInNewContext(readFileSync(new URL("../dist/studio/studio.js", import.meta.url), "utf8"), {
      HTMLElement: FakeNode,
      customElements: {
        get: () => undefined,
        define: (
          name: string,
          ctor: new () => FakeNode & {
            connectedCallback(): void;
            attributeChangedCallback(): void;
          },
        ) => defined.set(name, ctor),
      },
    });
    const Copy = defined.get("sdp-copy");
    if (!Copy) throw new Error("Copy element missing");
    const copy = new Copy();
    copy.setAttribute("text", "spec:probe.all#question.choice");
    copy.connectedCallback();
    const control = copy.children[0];
    expect(control?.textContent).toBe("Copy");
    expect(control?.getAttribute("aria-label")).toBe("Copy spec:probe.all#question.choice");
    copy.setAttribute("text", "spec:probe.all#question.nextChoice");
    copy.attributeChangedCallback();
    expect(control?.getAttribute("aria-label")).toBe("Copy spec:probe.all#question.nextChoice");
  });
  it("uses the navigation search input, announces the empty prompt and reveals paging progress", () => {
    const defined = new Map<string, new () => FakeNode & { connectedCallback(): void }>();
    const created: string[] = [];
    const listeners = new Map<string, () => void>();
    class FakeNode {
      ownerDocument = doc;
      children: FakeNode[] = [];
      textContent = "";
      className = "";
      hidden = false;
      value = "";
      innerHTML = "";
      parentNode?: FakeNode;
      append(...nodes: FakeNode[]): void {
        for (const node of nodes) {
          node.parentNode = this;
          this.children.push(node);
        }
      }
      replaceChildren(...nodes: FakeNode[]): void {
        this.children = [];
        this.append(...nodes);
      }
      setAttribute(): void {
        /* Native attribute has no effect on this probe. */
      }
      querySelectorAll(): FakeNode[] {
        return [];
      }
      addEventListener(name: string, listener: () => void): void {
        listeners.set(name, listener);
      }
    }
    const doc = {
      location: { hash: "" },
      defaultView: {
        addEventListener(): void {
          /* Only direct input events are used here. */
        },
        history: {
          replaceState(): void {
            /* The location is controlled by the probe. */
          },
        },
      },
      getElementById: () => ({
        textContent: JSON.stringify({
          records: Array.from({ length: 60 }, (_, i) => ({
            ...record,
            id: `spec:probe.${String(i)}`,
          })),
        }),
      }),
      querySelector: () => input,
      createElement: (name: string) => {
        created.push(name);
        return new FakeNode();
      },
    };
    const input = new FakeNode();
    runInNewContext(readFileSync(new URL("../dist/studio/studio.js", import.meta.url), "utf8"), {
      HTMLElement: FakeNode,
      customElements: {
        get: () => undefined,
        define: (name: string, ctor: new () => FakeNode & { connectedCallback(): void }) =>
          defined.set(name, ctor),
      },
    });
    const Results = defined.get("sdp-search-results");
    if (!Results) throw new Error("Missing results element");
    const element = new Results();
    element.connectedCallback();
    expect(created).not.toContain("form");
    const status = element.children[0];
    expect(status?.textContent).toBe("Type a word to search.");
    expect(status?.className).toBe("visually-hidden");
    input.value = "needle";
    listeners.get("input")?.();
    expect(element.children[1]?.innerHTML).toContain("60 nodes and 120 entries match");
    expect(status?.textContent).toBe("Showing 50 of 60 nodes");
    expect(status?.className).toBe("");
    listeners.get("click")?.();
    expect(status?.textContent).toBe("Showing 60 of 60 nodes");
  });
});
